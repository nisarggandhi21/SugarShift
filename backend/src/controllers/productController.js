const Product = require("../models/Product");

const list = async (req, res) => {
  const products = await Product.findAll(req.query.category);
  res.json(products);
};

const getOne = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
};

const listCategories = async (req, res) => {
  const categories = await Product.categories();
  res.json(categories);
};

module.exports = { list, getOne, listCategories };
