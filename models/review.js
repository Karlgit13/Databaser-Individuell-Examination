/** Review Model (Mongoose Schema)
 * Syfte:
 *  - Representera en recension kopplad till en film och en användare.
 *
 * Nyckelbegrepp:
 *  - Varje recension refererar till exakt en film (movieId) och en användare (userId).
 *  - rating är ett numeriskt betyg (exempel: skala 1–5).
 *  - createdAt genereras automatiskt vid skapande.
 *
 * Fält:
 *  - movieId: ObjectId, ref "Movie", krävs
 *  - userId: ObjectId, ref "User", krävs
 *  - rating: Number, krävs (kan utökas med min/max-validering)
 *  - comment: String, valfri, trim
 *  - createdAt: Date, default = nuvarande tid
 *
 * Export:
 *  - Mongoose-modell "Review" baserad på detta schema.
 */
const mongoose = require("mongoose");

/** [1] Skapa schema för recensioner
 *  - ObjectId används för att skapa relationer mellan samlingar.
 *  - ref talar om för Mongoose vilken modell id:t hör till.
 */
const reviewSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now }
});

/** [2] Exportera modellen
 *  - Namn: "Review"
 *  - Schema: reviewSchema
 */
module.exports = mongoose.model("Review", reviewSchema);
