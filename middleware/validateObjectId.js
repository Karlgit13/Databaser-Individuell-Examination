const mongoose = require('mongoose'); // Importerar mongoose för att hantera MongoDB

module.exports = (params = "id") => {
    return (req, res, next) => {
        const id = req.params[params];
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Ogiltigt ID' });
        }
        next();
    }
}