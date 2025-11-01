const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

const getAllContacts = async (req, res) => {
        const result = await mongodb.getDatabase().db().collection('contacts').find(); 
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts);
    });

}

const getContactById = async (req, res) => {
    const contactId = new objectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('contacts').find({_id: contactId}); 
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts[0]);
    });
};

module.exports = {
    getAllContacts,
    getContactById
};