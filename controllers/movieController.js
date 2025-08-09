/** Movie Controller
 * Ansvar:
 *  - CRUD för filmer
 *  - Hämta recensioner för en specifik film
 *
 * Datamodell:
 *  - Movie: { title, director, releaseYear, genre }
 *  - Virtuellt fält "reviews" i Movie (kopplar Review.movieId -> Movie._id)
 */
const Movie = require('../models/movie');
const Review = require('../models/review');

/** GET /movies
 * Syfte:
 *  - Hämta alla filmer.
 *
 * Flöde:
 *  [1] Hämta alla filmer via Movie.find().
 *  [2] Populera virtuellt fält "reviews" om det är definierat i modellen.
 *  [3] Returnera 200 med listan.
 * Fel:
 *  - 500 vid oväntat fel.
 */
exports.getAllMovies = async (req, res) => {
    try {
        // [1] Hämta alla filmer
        // [2] Populera kopplade recensioner via virtual "reviews"
        const movies = await Movie.find().populate("reviews");

        // [3] Skicka svar
        res.json(movies);
    } catch (error) {
        console.error("kunde inte hämta filmer:", error);
        res.status(500).json({ error: "Fel vid hämtning av filmer." });
    }
};

/** GET /movies/:id
 * Syfte:
 *  - Hämta en specifik film via id.
 *
 * Förutsättning:
 *  - validateId-middleware har redan säkrat giltigt ObjectId.
 *
 * Flöde:
 *  [1] Hämta id från req.params.id och slå upp filmen.
 *  [2] Om ingen film hittas -> 404.
 *  [3] Annars returnera 200 med filmobjektet.
 * Fel:
 *  - 500 vid oväntat fel.
 */
exports.getMoviesById = async (req, res) => {
    try {
        // [1] Slå upp film
        const foundMovie = await Movie.findById(req.params.id);

        // [2] Hantera ej funnen
        if (!foundMovie) {
            return res.status(404).json({ error: "Filmen hittades inte." });
        }

        // [3] Skicka svar
        res.json(foundMovie);
    } catch (error) {
        console.error("kunde inte hämta filmen:", error);
        res.status(500).json({ error: "Fel vid hämtning av filmen." });
    }
};

/** POST /movies   [admin]
 * Syfte:
 *  - Skapa ny film (endast admin – styrs i router via auth + roleMiddleware).
 *
 * Indata (req.body):
 *  - { title, director, releaseYear, genre }
 *
 * Flöde:
 *  [1] Extrahera fälten från req.body.
 *  [2] Skapa en Movie-instans.
 *  [3] Spara i DB.
 *  [4] Returnera 201 med skapad film.
 * Fel:
 *  - 500 vid oväntat fel.
 */
exports.createMovie = async (req, res) => {
    try {
        // [1] Indata
        const { title, director, releaseYear, genre } = req.body;

        // [2] Instansiera ny film
        const newMovie = new Movie({ title, director, releaseYear, genre });

        // [3] Spara
        await newMovie.save();

        // [4] Svara
        res.status(201).json(newMovie);
    } catch (error) {
        console.error("kunde inte skapa filmen:", error);
        res.status(500).json({ error: "Fel vid skapande av filmen." });
    }
};

/** PUT /movies/:id   [admin]
 * Syfte:
 *  - Uppdatera en befintlig film.
 *
 * Indata:
 *  - req.params.id: filmens id
 *  - req.body: fält som ska uppdateras
 *
 * Flöde:
 *  [1] Uppdatera med findByIdAndUpdate(id, body, { new: true }).
 *  [2] Om ingen film hittas -> 404.
 *  [3] Annars 200 + { message, movie }.
 * Fel:
 *  - 500 vid oväntat fel.
 */
exports.updateMovie = async (req, res) => {
    try {
        // [1] Uppdatera och få tillbaka nya dokumentet
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        // [2] Hantera ej funnen
        if (!updatedMovie) {
            return res.status(404).json({ error: "Filmen hittades inte." });
        }

        // [3] Svara
        res.json({ message: "Filmen uppdaterades.", movie: updatedMovie });
    } catch (error) {
        console.error("kunde inte uppdatera filmen:", error);
        res.status(500).json({ error: "Fel vid uppdatering av filmen." });
    }
};

/** DELETE /movies/:id   [admin]
 * Syfte:
 *  - Radera en film permanent.
 *
 * Flöde:
 *  [1] Försök ta bort filmen med findByIdAndDelete(id).
 *  [2] Om ingen film fanns -> 404.
 *  [3] Vid lyckad radering -> 200 med bekräftelse.
 * Fel:
 *  - 500 vid oväntat fel.
 * Notis:
 *  - Om du vill rensa relaterade recensioner: Review.deleteMany({ movieId: id }) här eller via Mongoose hooks.
 */
exports.deleteMovie = async (req, res) => {
    try {
        // [1] Radera
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

        // [2] Hantera ej funnen
        if (!deletedMovie) {
            return res.status(404).json({ error: "Filmen hittades inte," });
        }

        // [3] Svara
        res.json({ message: "Filmen togs bort." });
    } catch (error) {
        console.error("kunde inte ta bort filmen;", error);
        res.status(500).json({ error: "Fel vid borttagning av filmen." });
    }
};

/** GET /movies/:id/reviews
 * Syfte:
 *  - Hämta alla recensioner som hör till en viss film.
 *
 * Flöde:
 *  [1] Hitta alla recensioner där movieId = req.params.id.
 *  [2] Populera userId (t.ex. för att se username).
 *  [3] Om tomt resultat -> 404 (alternativt 200 och tom array beroende på policy).
 *  [4] Annars returnera 200 med listan.
 * Fel:
 *  - 500 vid oväntat fel.
 */
exports.getReviewsByMovieId = async (req, res) => {
    try {
        // [1] Hämta recensioner för filmen
        // [2] Populera användarinfo
        const reviews = await Review.find({ movieId: req.params.id }).populate("userId");

        // [3] Hantera tomt resultat
        if (reviews.length === 0) {
            return res.status(404).json({ error: "Inga recensioner hittades för denna film." });
        }

        // [4] Svara
        res.json(reviews);
    } catch (error) {
        console.error("kunde inte hämta recensioner:", error);
        res.status(500).json({ error: "Fel vid hämtning av recensioner." });
    }
};
