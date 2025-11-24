const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const {
    getNearbyShops,
    getAllShops,
    createShop
} = require('../controllers/shop.controller');

// Public route - get nearby shops
router.get('/nearby', getNearbyShops);

// Admin routes
router.get('/admin/all', auth, requireRole('admin'), getAllShops);
router.post('/admin', auth, requireRole('admin'), createShop);

module.exports = router;

