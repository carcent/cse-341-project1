const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// ------------------------------------------
// Helper: Validate ObjectId
// ------------------------------------------
const isValidId = (id) => ObjectId.isValid(id) && String(new ObjectId(id)) === id;

// ------------------------------------------
// GET ALL PRODUCTS
// ------------------------------------------
const getAllProducts = async (req, res, next) => {
  try {
    const products = await mongodb.getDatabase().db().collection('Products').find().toArray();

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------
// GET PRODUCT BY ID
// ------------------------------------------
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const product = await mongodb
      .getDatabase()
      .db()
      .collection('Products')
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------
// CREATE PRODUCT
// ------------------------------------------
const createProduct = async (req, res, next) => {
  try {
    const { name, price, description } = req.body;

    if (!name?.trim() || !price || !description?.trim()) {
      return res.status(400).json({
        message: 'Product name, price, and description are required.'
      });
    }

    const newProduct = {
      name: name.trim(),
      price,
      description: description.trim()
    };

    const result = await mongodb.getDatabase().db().collection('Products').insertOne(newProduct);

    res.status(201).json({
      id: result.insertedId,
      ...newProduct
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------
// UPDATE PRODUCT (PUT)
// ------------------------------------------
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const { name, price, description } = req.body;

    if (!name?.trim() || !price || !description?.trim()) {
      return res.status(400).json({
        message: 'Product name, price, and description are required.'
      });
    }

    const updatedProduct = {
      name: name.trim(),
      price,
      description: description.trim()
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('Products')
      .replaceOne({ _id: new ObjectId(id) }, updatedProduct);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------
// DELETE PRODUCT
// ------------------------------------------
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('Products')
      .deleteOne({ _id: new ObjectId(id) });

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
