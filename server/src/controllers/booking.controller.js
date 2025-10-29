const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    try {
        const booking = await Booking.create({ ...req.body, user: req.user._id });
        res.status(201).json(booking);
    } catch (e) {
        res.status(400).json({ message: 'Could not create booking' });
    }
};

exports.getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
};

exports.getOne = async (req, res) => {
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
    const bookings = await Booking.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
};

exports.adminUpdateStatus = async (req, res) => {
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
};


