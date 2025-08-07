const mongoose = require('mongoose');

const validateId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: 'Ogiltigt ID' });
    }
    next();
};

module.exports = { validateId };
