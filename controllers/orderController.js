const Order = require('../models/order');
const Product = require('../models/product');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('product');
    res.json({ status: 200, message: 'success', data: orders });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 404, message: 'ไม่พบสินค้า' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ status: 400, message: 'สินค้าในสต็อกไม่เพียงพอ' });
    }
    const order = new Order({
      product: productId, //สินค้าที่สั่งซื้อ
      quantity,  //จำนวณ
      user: req.user._id //ดึงชื่อ user จาก id
    });
    await order.save();
    product.stock -= quantity;
    await product.save();
    res.status(201).json({ status: 200, message: 'success', data: order });
  } catch (error) {
    res.status(400).json({ status: 400, message: 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ' });
  }
};

exports.getOrdersByProduct = async (req, res) => {
  try {
    const orders = await Order.find({ product: req.params.productId }).populate('product');
    res.json({ status: 200, message: 'success', data: orders });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ' });
  }
};