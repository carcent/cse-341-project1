const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

const getAllProducts = async (req, res) => {
  const result = await mongodb.getDatabase().db().collection('Products').find();
  result.toArray().then((Products) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(Products);
  });
};

const getProductById = async (req, res) => {
  const ProductId = new objectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('Products').find({ _id: ProductId });
  result.toArray().then((Products) => {
    if (!Products[0]) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(Products[0]);
  });
};

const createProduct = async (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      return res.status(400).json({ message: 'First name, last name, and email are required.' });
    }
    const Product = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const result = await mongodb.getDatabase().db().collection('Products').insertOne(Product);
    if (!result.acknowledged) {
      throw new Error('Could not create Product.');
    }
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Product.' });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const ProductId = new objectId(req.params.id);

    const Product = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('Products')
      .replaceOne({ _id: ProductId }, Product);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error updating Product.' });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const ProductId = new objectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('Products')
      .deleteOne({ _id: ProductId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Product.' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
