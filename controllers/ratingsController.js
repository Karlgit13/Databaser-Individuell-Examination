/** Ratings Controller
 * Ansvar:
 *  - Beräkna genomsnittligt betyg per film via aggregeringspipeline.
 *
 * Tekniskt:
 *  - MongoDB Aggregation Pipeline används för att slå ihop Movie + Review
 *    och räkna ett medelvärde på reviews.rating.
 */
const Movie = require("../models/movie");

/** GET /movies/ratings
 * Syfte:
 *  - Returnera alla filmer med ett beräknat fält `averageRating`.
 *
 * Flöde (Aggregation Pipeline):
 *  1) $lookup:
 *     - Kopplar in “reviews”-kollektionen mot Movie._id = Review.movieId.
 *     - Resultatet läggs i fältet `reviews` (array) i varje filmobjekt.
 *
 *  2) $addFields:
 *     - Skapar ett nytt fält `averageRating` = medelvärde av `reviews.rating`.
 *     - Om reviews är tomt blir averageRating = null (hanteras i steg 3).
 *
 *  3) $project:
 *     - Välj vilka fält som ska med i svaret (title, director, releaseYear, genre).
 *     - Sätt averageRating till 0 om det är null med $ifNull.
 *
 * Svar:
 *  - 200 + array av filmer: [{ title, director, releaseYear, genre, averageRating }]
 *
 * Felhantering:
 *  - 500 vid oväntat fel (t.ex. DB-problem).
 *
 * Prestandatips:
 *  - Index på Review.movieId snabbar upp $lookup.
 *  - För mycket data? Lägg till $limit/$sort eller filtrering före $lookup.
 */
exports.getMovieRatings = async (req, res) => {
    try {
        const moviesWithRatings = await Movie.aggregate([
            // [1] Koppla in recensioner per film
            {
                $lookup: {
                    from: 'reviews',           // kollektionens namn (matchar model "review" -> "reviews")
                    localField: '_id',         // Movie._id
                    foreignField: 'movieId',   // Review.movieId
                    as: 'reviews'              // inbäddat fält i resultatet
                }
            },
            // [2] Lägg till medelvärde av betyg (kan bli null om reviews saknas)
            {
                $addFields: {
                    averageRating: { $avg: '$reviews.rating' }
                }
            },
            // [3] Välj ut fält och ersätt null med 0 för averageRating
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
