const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    genre: { type: string, required: true },
})

module.exports = mongoose.model("Movie", movieSchema) // Exporterar modellen för användning i andra filer