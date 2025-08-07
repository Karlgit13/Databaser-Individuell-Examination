const mongoose = require('mongoose');

exports.validateId = (id, res) => {
    if (mongoose.isValidObjectId(id)) {
        res.status(400).json({ error: 'Ogiltigt ID' });
        return false;
    }
    return true;
}

