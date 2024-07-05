const Product = require('../models/product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ status: 200, message: 'success', data: products });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 404, message: 'ไม่พบสินค้า' });
    }
    res.json({ status: 200, message: 'success', data: product });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ status: 200, message: 'เพิ่มสินค้าสำเร็จ', data: product });
  } catch (error) {
    res.status(400).json({ status: 400, message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ status: 404, message: 'ไม่พบสินค้า' });
    }
    res.json({ status: 200, message: 'success', data: product });
  } catch (error) {
    res.status(400).json({ status: 400, message: 'เกิดข้อผิดพลาดในการอัปเดตสินค้า' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 404, message: 'ไม่พบสินค้า' });
    }
    res.json({ status: 200, message: 'success' });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการลบสินค้า' });
  }
};