const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        brandName: { type: String, required: true },
        deviceModel: { type: String, required: true },
        issue: { type: String, required: true },
        description: { type: String },
        estimatedPrice: { type: Number },
        preferredDate: { type: Date, required: true },
        preferredTime: { type: String, required: true },
        status: { type: String, enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
        bookingId: { type: String, unique: true, index: true }
    },
    { timestamps: true }
);

bookingSchema.pre('save', function assignBookingId(next) {
    if (!this.bookingId) {
        this.bookingId = `RPH${Date.now().toString().slice(-8)}`;
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);


