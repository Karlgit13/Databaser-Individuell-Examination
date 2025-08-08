/** Review Controller
 * Ansvar:
 *  - Skapa, läsa, uppdatera och ta bort recensioner.
 * Säkerhet:
 *  - Skapa/uppdatera/ta bort kräver JWT-auth (authMiddleware sätter req.user).
 * Datamodell:
 *  - Review: { movieId, userId, rating, comment, createdAt }
 */
const Review = require('../models/review');
const Movie = require('../models/movie');

/** POST /reviews  [auth]
 * Syfte:
 *  - Skapa en ny recension kopplad till en befintlig film och den inloggade användaren.
 * Indata (req.body):
 *  - movieId: ObjectId för filmen som recenseras.
 *  - rating:  Number (0..5).
 *  - comment: String (obligatorisk text).
 * Förutsättningar:
 *  - authMiddleware har verifierat JWT och satt req.user.id (recensenten).
 * Flöde:
 *  1) Plocka ut movieId, rating, comment från body.
 *  2) Verifiera att filmen finns (skydd mot “hängande” referenser).
 *  3) Skapa Review-instans med userId = req.user.id.
 *  4) Spara i DB; returnera 201 + den skapade recensionen.
 * Fel:
 *  - 404 om filmen saknas.
 *  - 500 vid oväntat fel (ex. DB-fel).
 */
exports.createReview = async (req, res) => {
    try {
        // [1] Extrahera data från request-body (valid antas hanteras i klient eller separat middleware)
        const { movieId, rating, comment } = req.body;

        // [2] Säkerställ att refererad film existerar (annars blir det trasig relation)
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Filmen hittades inte.' });
        }

        // [3] Konstruera recension kopplad till inloggad användare
        const newReview = new Review({
            movieId,
            userId: req.user.id, // satt av authMiddleware via JWT
            rating,
            comment
        });

        // [4] Spara och svara
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        console.error('Fel vid skapande av recension:', error);
        res.status(500).json({ error: 'Kunde inte skapa recensionen.' });
    }
};

/** GET /reviews
 * Syfte:
 *  - Hämta en lista över alla recensioner.
 * Presentation:
 *  - Populerar userId -> username (visar vem som skrev)
 *  - Populerar movieId -> title (visar vilken film)
 * Flöde:
 *  1) Hämta alla recensioner.
 *  2) Populera relaterad data för läsbarhet i klient.
 *  3) Returnera 200 + lista.
 * Fel:
 *  - 500 vid oväntat fel.
 */
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('userId', 'username')
            .populate('movieId', 'title');

        res.json(reviews);
    } catch (error) {
        console.error('Fel vid hämtning av recensioner:', error);
        res.status(500).json({ error: 'Kunde inte hämta recensionerna.' });
    }
};

/** GET /reviews/:id
 * Syfte:
 *  - Hämta detaljer för en specifik recension.
 * Förutsättning:
 *  - validateId middleware bör ha säkrat att :id är ett giltigt ObjectId (annars 400 tidigare i kedjan).
 * Flöde:
 *  1) Slå upp recension via _id.
 *  2) Populera relaterade fält (user + movie) för helhetsvy.
 *  3) Returnera 404 om inget hittas; annars 200 + dokument.
 * Fel:
 *  - 500 vid oväntat fel.
 */
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('userId', 'username')
            .populate('movieId', 'title');

        if (!review) {
            return res.status(404).json({ error: 'Recensionen hittades inte.' });
        }

        res.json(review);
    } catch (error) {
        console.error('Fel vid hämtning av recension:', error);
        res.status(500).json({ error: 'Kunde inte hämta recensionen.' });
    }
};

/** PUT /reviews/:id  [auth]
 * Syfte:
 *  - Uppdatera en befintlig recension (t.ex. nytt betyg/kommentar).
 * Säkerhet/Policy (om du vill hårdna):
 *  - Här kan man lägga ägarskapskontroll (endast författaren eller admin får uppdatera).
 * Flöde:
 *  1) Försök uppdatera dokumentet med req.body (partial update).
 *  2) { new: true } -> returnera uppdaterad version.
 *  3) 404 om inget dokument matchar id.
 * Fel:
 *  - 500 vid oväntat fel.
 */
exports.updateReview = async (req, res) => {
    try {
        const updated = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Recensionen hittades inte.' });
        }

        res.json({ message: 'Recensionen uppdaterades.', review: updated });
    } catch (error) {
        console.error('Fel vid uppdatering av recension:', error);
        res.status(500).json({ error: 'Kunde inte uppdatera recensionen.' });
    }
};

/** DELETE /reviews/:id  [auth]
 * Syfte:
 *  - Ta bort en recension permanent från databasen.
 * Förklaring av hur funktionen arbetar:
 *  1) Vi läser id från route-parametern (:id) – förväntas validerad av validateId middleware tidigare.
 *  2) Vi försöker hitta och radera dokumentet i ett steg via Mongoose-metoden `findByIdAndDelete`.
 *     - Om ett dokument med det id:t fanns -> det returneras i `deleted`.
 *     - Om inget dokument fanns -> `deleted` blir null (=> 404).
 *  3) Om raderingen lyckades svarar vi med 200 och ett bekräftelsemeddelande.
 *  4) Vid oväntat fel (t.ex. DB-problem) fångas felet i catch och vi svarar 500.
 * Notera:
 *  - Här kan du lägga ägarskapskontroll (endast författaren eller admin) innan raderingen.
 */
exports.deleteReview = async (req, res) => {
    try {
        // [1–2] Försök att radera recensionen via id (atomärt: lookup + delete i ett anrop)
        const deleted = await Review.findByIdAndDelete(req.params.id);

        // [3] Hantera “inte hittad”
        if (!deleted) {
            return res.status(404).json({ error: 'Recensionen hittades inte.' });
        }

        // [4] Bekräfta lyckad radering
        res.json({ message: 'Recensionen togs bort.' });
    } catch (error) {
        console.error('Fel vid borttagning av recension:', error);
        res.status(500).json({ error: 'Kunde inte ta bort recensionen.' });
    }
};
