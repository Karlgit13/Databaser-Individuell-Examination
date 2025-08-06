// controllers/ratingsController.js
const Movie = require("../models/movie");

exports.getMovieRatings = async (req, res) => {
    try {
        const moviesWithRatings = await Movie.aggregate([
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'movieId',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    averageRating: { $avg: '$reviews.rating' }
                }
            },
            {
                $project: {
                    title: 1,
                    director: 1,
                    releaseYear: 1,
                    genre: 1,
                    averageRating: { $ifNull: ['$averageRating', 0] }
                }
            }
        ]);
        res.json(moviesWithRatings);
    } catch (err) {
        console.error("Fel vid hämtning av genomsnittsbetyg:", err);
        res.status(500).json({ error: "Kunde inte hämta genomsnittsbetyg." });
    }
};
