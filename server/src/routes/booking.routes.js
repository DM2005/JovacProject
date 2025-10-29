const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const {
    createBooking,
    getMyBookings,
    getOne,
    updateMyBooking,
    cancelMyBooking,
    adminList,
    adminUpdateStatus
} = require('../controllers/booking.controller');

// User routes
router.post('/', auth, createBooking);
router.get('/', auth, getMyBookings);
router.get('/:id', auth, getOne);
router.put('/:id', auth, updateMyBooking);
router.delete('/:id', auth, cancelMyBooking);

// Admin
router.get('/admin/all', auth, requireRole('admin'), adminList);
router.patch('/admin/:id/status', auth, requireRole('admin'), adminUpdateStatus);

module.exports = router;


