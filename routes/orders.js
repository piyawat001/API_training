const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.get('/', auth, orderController.getAllOrders);
router.post('/', auth, orderController.createOrder);
router.get('/product/:productId', auth, orderController.getOrdersByProduct);

module.exports = router;