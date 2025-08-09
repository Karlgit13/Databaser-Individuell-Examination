/** Movie Model (Mongoose Schema)
 * Syfte:
 *  - Representera en film i databasen.
 *  - Spara grundläggande metadata (titel, regissör, utgivningsår, genre).
 *  - Ha en virtuell relation till recensioner (reviews) utan att lagra dem i samma dokument.
 *
 * Nyckelbegrepp:
 *  - Mongoose Schema: definierar struktur, datatyper och regler för dokument.
 *  - Virtuals: låter oss skapa fält som inte lagras direkt i DB men kan populera från andra samlingar.
 *
 * Fält:
 *  - title: String, krävs, trim (tar bort onödiga mellanslag)
 *  - director: String, krävs, trim
 *  - releaseYear: Number, krävs
 *  - genre: String, krävs, trim
 *
 * Virtuals:
 *  - reviews: hämtar alla Review-dokument där review.movieId == movie._id
 *
 * Export:
 *  - Mongoose-modell "Movie" baserad på detta schema.
 */
const mongoose = require("mongoose");

/** [1] Skapa schema för filmer
 *  - Inkluderar toJSON/toObject med virtuals: true så att virtuala fält följer med vid serialisering.
 */
const movieSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        director: { type: String, required: true, trim: true },
        releaseYear: { type: Number, required: true },
        genre: { type: String, required: true, trim: true },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/** [2] Definiera virtuell relation till recensioner
 *  - ref: "review" => refererar till Review-modellen.
 *  - localField: "_id" => filmens ID.
 *  - foreignField: "movieId" => motsvarande fält i Review-dokument.
 *  - Gör det möjligt att anropa .populate("reviews") vid queries.
 */
movieSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "movieId"
});

/** [3] Exportera modellen
 *  - Första argument: modellens namn ("Movie") – används av Mongoose internt.
 *  - Andra argument: själva schemat vi just definierade.
 */
module.exports = mongoose.model("Movie", movieSchema);
