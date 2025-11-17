const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

// Get all contacts
const getAllContacts = async (req, res, next) => {
  try {
    const result = await mongodb.getDatabase().db().collection('contacts').find().toArray();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Get contact by id
const getContactById = async (req, res, next) => {
  try {
    const contactId = new objectId(req.params.id);

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .find({ _id: contactId })
      .toArray();

    if (!result[0]) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    next(error);
  }
};

// create contact
const createContact = async (req, res, next) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      return res.status(400).json({ message: 'First name, last name, and email are required.' });
    }

    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const result = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);

    if (!result.acknowledged) {
      throw new Error('Could not create contact');
    }

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// update contact
const updateContact = async (req, res, next) => {
  try {
    const contactId = new objectId(req.params.id);

    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .replaceOne({ _id: contactId }, contact);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// delete contact
const deleteContact = async (req, res, next) => {
  try {
    const contactId = new objectId(req.params.id);

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .deleteOne({ _id: contactId });

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
