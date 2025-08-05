const movie = require('../models/movie');
const review = require('../models/review');

// get /movies
exports.getAllMovies = async (req, res) => {
    try {
        const movies = await movie.find().populate("reviews");
        res.json(movies)
    } catch (error) {
        console.error("kunde inte hämta filmer:", error)
        res.status(500).json({ error: "Fel vid hämtning av filmer." })
    }
}