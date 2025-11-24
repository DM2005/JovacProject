const nodemailer = require('nodemailer');

// Create transporter - configure with your email service
// For development, you can use Gmail, or services like SendGrid, Mailgun, etc.
function createTransporter() {
    // Check if email is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️  Email not configured. SMTP_USER and SMTP_PASS are required in .env file.');
        return null;
    }

    try {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    } catch (error) {
        console.error('Error creating email transporter:', error);
        return null;
    }
}

const transporter = createTransporter();

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp, bookingId) {
    try {
        // Check if transporter is available
        if (!transporter) {
            console.error('❌ Email transporter not configured. Please set SMTP_USER and SMTP_PASS in .env file.');
            return false;
        }

        const mailOptions = {
            from: process.env.SMTP_USER || 'noreply@rephome.com',
            to: email,
            subject: 'Booking Confirmation OTP - Rephome',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #4a90e2; text-align: center;">Booking Confirmation</h2>
                    <p>Thank you for scheduling your repair with Rephome!</p>
                    <p>Your booking ID is: <strong>${bookingId}</strong></p>
                    <p>Please use the following OTP to confirm your booking:</p>
                    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                        <h1 style="color: #4a90e2; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
                    <p style="color: #666; font-size: 12px;">If you didn't make this booking, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 11px; text-align: center;">© Rephome - Mobile Repair Services</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent successfully:', info.messageId, 'to', email);
        return true;
    } catch (error) {
        console.error('❌ Error sending OTP email:', error.message);
        if (error.code === 'EAUTH') {
            console.error('   Authentication failed. Check your SMTP_USER and SMTP_PASS in .env file.');
        } else if (error.code === 'ECONNECTION') {
            console.error('   Connection failed. Check your SMTP_HOST and SMTP_PORT in .env file.');
        }
        return false;
    }
}

module.exports = {
    generateOTP,
    sendOTPEmail
};

