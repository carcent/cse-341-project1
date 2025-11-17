const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

// Get all
const getAllProducts = async (req, res, next) => {
  try {
    const products = await mongodb.getDatabase().db().collection('Products').find().toArray();

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Get by ID
const getProductById = async (req, res, next) => {
  try {
    const productId = new objectId(req.params.id);

    const product = await mongodb
      .getDatabase()
      .db()
      .collection('Products')
      .findOne({ _id: productId });

    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Create
const createProduct = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price || !req.body.description) {
      return res
        .status(400)
        .json({ message: 'Product name, price, and description are required.' });
    }

    const newProduct = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    };

    const result = await mongodb.getDatabase().db().collection('Products').insertOne(newProduct);

    if (!result.acknowledged) {
      throw new Error('Could not create product');
    }

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Update
const updateProduct = async (req, res, next) => {
  try {
    const productId = new objectId(req.params.id);

    const updatedProduct = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('Products')
      .replaceOne({ _id: productId }, updatedProduct);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Delete
const deleteProduct = async (req, res, next) => {
  try {
    const productId = new objectId(req.params.id);

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('Products')
      .deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
