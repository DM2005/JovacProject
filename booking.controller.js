const Booking = require('../models/Booking');
const { generateOTP, sendOTPEmail } = require('../utils/emailService');

// Auto-approve bookings that are 2+ minutes old and still pending
async function autoApproveBookings() {
    try {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes ago
        
        const result = await Booking.updateMany(
            { 
                status: 'pending',
                createdAt: { $lte: twoMinutesAgo }
            },
            { 
                status: 'confirmed'
            }
        );
        
        if (result.modifiedCount > 0) {
            console.log(`Auto-approved ${result.modifiedCount} booking(s)`);
        }
    } catch (error) {
        console.error('Error auto-approving bookings:', error);
    }
}

exports.createBooking = async (req, res) => {
    try {
        // Generate OTP
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Create booking with OTP
        const booking = await Booking.create({ 
            ...req.body, 
            user: req.user._id,
            otp,
            otpExpiresAt,
            emailVerified: false
        });

        // Send OTP email
        const emailSent = await sendOTPEmail(booking.email, otp, booking.bookingId);
        
        if (!emailSent) {
            console.warn('⚠️  Failed to send OTP email for booking:', booking.bookingId);
            // For development: log OTP to console if email fails
            if (process.env.NODE_ENV !== 'production') {
                console.log('📧 OTP for booking', booking.bookingId, ':', otp);
                console.log('   (This is only shown in development mode)');
            }
        }

        // Don't send OTP in response for security
        const bookingResponse = booking.toObject();
        delete bookingResponse.otp;
        
        res.status(201).json({
            ...bookingResponse,
            otpSent: emailSent,
            message: emailSent ? 'Booking created. Please check your email for OTP.' : 'Booking created, but email could not be sent.'
        });
    } catch (e) {
        console.error('Error creating booking:', e);
        res.status(400).json({ message: 'Could not create booking' });
    }
};

exports.getMyBookings = async (req, res) => {
    // Auto-approve pending bookings before fetching
    await autoApproveBookings();
    
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
};

exports.getOne = async (req, res) => {
    // Auto-approve pending bookings before fetching
    await autoApproveBookings();
    
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Not found' });
    res.json(booking);
};

exports.updateMyBooking = async (req, res) => {
    const updated = await Booking.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
};

exports.cancelMyBooking = async (req, res) => {
    const updated = await Booking.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { status: 'cancelled' },
        { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
};

exports.adminList = async (req, res) => {
    // Auto-approve pending bookings before fetching
    await autoApproveBookings();
    
    const bookings = await Booking.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
};

exports.adminUpdateStatus = async (req, res) => {
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
};

// Verify OTP for booking
exports.verifyOTP = async (req, res) => {
    try {
        const { bookingId, otp } = req.body;
        
        // Validate input
        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }
        
        if (!otp) {
            return res.status(400).json({ message: 'OTP is required' });
        }

        // Convert OTP to string for comparison (in case it's sent as number)
        const otpString = String(otp).trim();

        // Find booking
        const booking = await Booking.findOne({ 
            bookingId: String(bookingId).trim(),
            user: req.user._id
        });

        if (!booking) {
            return res.status(404).json({ 
                message: 'Booking not found. Please check your booking ID.' 
            });
        }

        if (booking.emailVerified) {
            return res.status(400).json({ 
                message: 'Booking already verified',
                booking: {
                    bookingId: booking.bookingId,
                    status: booking.status,
                    emailVerified: true
                }
            });
        }

        if (!booking.otp) {
            return res.status(400).json({ 
                message: 'No OTP found for this booking. Please request a new OTP.',
                bookingId: booking.bookingId
            });
        }

        if (!booking.otpExpiresAt) {
            return res.status(400).json({ 
                message: 'OTP expiration not set. Please request a new OTP.',
                bookingId: booking.bookingId
            });
        }

        if (new Date() > booking.otpExpiresAt) {
            return res.status(400).json({ 
                message: 'OTP has expired. Please request a new one using resend OTP.',
                bookingId: booking.bookingId
            });
        }

        // Compare OTP (both as strings to avoid type issues)
        if (String(booking.otp).trim() !== otpString) {
            return res.status(400).json({ 
                message: 'Invalid OTP. Please check and try again.',
                hint: 'Make sure you entered the correct 6-digit code from your email.'
            });
        }

        // OTP is valid, mark as verified and confirm booking
        booking.emailVerified = true;
        booking.status = 'confirmed';
        booking.otp = undefined; // Remove OTP after verification
        booking.otpExpiresAt = undefined;
        await booking.save();

        res.json({ 
            message: 'Booking verified successfully!',
            booking: {
                _id: booking._id,
                bookingId: booking.bookingId,
                status: booking.status,
                emailVerified: booking.emailVerified
            }
        });
    } catch (e) {
        console.error('Error verifying OTP:', e);
        res.status(500).json({ 
            message: 'Could not verify OTP',
            error: process.env.NODE_ENV !== 'production' ? e.message : undefined
        });
    }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
    try {
        const { bookingId } = req.body;
        
        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }

        const booking = await Booking.findOne({ 
            bookingId,
            user: req.user._id
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.emailVerified) {
            return res.status(400).json({ message: 'Booking already verified' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        booking.otp = otp;
        booking.otpExpiresAt = otpExpiresAt;
        await booking.save();

        // Send new OTP email
        const emailSent = await sendOTPEmail(booking.email, otp, booking.bookingId);

        if (!emailSent) {
            // For development: log OTP to console if email fails
            if (process.env.NODE_ENV !== 'production') {
                console.log('📧 OTP for booking', booking.bookingId, ':', otp);
                console.log('   (This is only shown in development mode)');
            }
            return res.status(500).json({ 
                message: 'Failed to send OTP email. Please check server logs and email configuration. ' +
                         (process.env.NODE_ENV !== 'production' ? 'Check console for OTP.' : '')
            });
        }

        res.json({ message: 'OTP resent successfully. Please check your email.' });
    } catch (e) {
        console.error('Error resending OTP:', e);
        res.status(500).json({ message: 'Could not resend OTP: ' + e.message });
    }
};


