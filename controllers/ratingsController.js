/** Ratings Controller:
 * - /movies/ratings: aggregerar filmer med snittbetyg via $lookup + $avg
 */
const Movie = require("../models/movie");

/** GET /movies/ratings
 * Pipeline:
 * 1) $lookup reviews-> koppla recensioner
 * 2) $addFields averageRating = $avg(reviews.rating)
 * 3) $project relevanta fält + sätt 0 om inga recensioner
 */
exports.getMovieRatings = async (req, res) => {
    try {
        const moviesWithRatings = await Movie.aggregate([
            { $lookup: { from: 'reviews', localField: '_id', foreignField: 'movieId', as: 'reviews' } },
            { $addFields: { averageRating: { $avg: '$reviews.rating' } } },
            { $project: { title: 1, director: 1, releaseYear: 1, genre: 1, averageRating: { $ifNull: ['$averageRating', 0] } } }
        ]);
        res.json(moviesWithRatings);
    } catch (err) {
        console.error("Fel vid hämtning av genomsnittsbetyg:", err);
        res.status(500).json({ error: "Kunde inte hämta genomsnittsbetyg." });
    }
};
