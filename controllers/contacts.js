const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// -------------------------------
// Helper: Validate ObjectId
// -------------------------------
const isValidId = (id) => ObjectId.isValid(id) && String(new ObjectId(id)) === id;

// -------------------------------
// GET ALL CONTACTS
// -------------------------------
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await mongodb.getDatabase().db().collection('contacts').find().toArray();

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

// -------------------------------
// GET CONTACT BY ID
// -------------------------------
const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// -------------------------------
// CREATE CONTACT
// -------------------------------
const createContact = async (req, res, next) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return res.status(400).json({ message: 'First name, last name, and email are required.' });
    }

    const contact = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      favoriteColor: favoriteColor || null,
      birthday: birthday || null
    };

    const result = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);

    res.status(201).json({ id: result.insertedId, ...contact });
  } catch (error) {
    next(error);
  }
};

// -------------------------------
// UPDATE CONTACT
// -------------------------------
const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return res.status(400).json({
        message: 'First name, last name, and email are required.'
      });
    }

    const updatedContact = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      favoriteColor: favoriteColor || null,
      birthday: birthday || null
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedContact });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// -------------------------------
// DELETE CONTACT
// -------------------------------
const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
