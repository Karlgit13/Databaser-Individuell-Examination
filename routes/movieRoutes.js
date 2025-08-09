/** Movie Routes
 * Syfte:
 *  - Exponera API-endpoints för filmer (listar, hämtar, skapar, uppdaterar, tar bort)
 * Säkerhet:
 *  - Offentliga GET-endpoints är öppna
 *  - Skrivande operationer (POST/PUT/DELETE) kräver auth + admin-roll
 *
 * Övergripande flöde:
 *  [1] Skapa en Express-router.
 *  [2] Koppla in controllers och middleware (auth, roll, id-validering).
 *  [3] Definiera offentliga rutter.
 *  [4] Definiera admin-skyddade rutter.
 */
const express = require('express');
const router = express.Router();

const { validateId } = require('../middleware/validateId');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const ratingsController = require("../controllers/ratingsController");
const movieController = require('../controllers/movieController');

// [3] OFFENTLIGA RUTTER (ingen auth krävs)
/** GET /movies/ratings
 *  - Returnerar alla filmer + beräknat genomsnittsbetyg.
 */
router.get("/ratings", ratingsController.getMovieRatings);

/** GET /movies
 *  - Lista alla filmer (inkl. virtuellt fält 'reviews' om controller populaterar).
 */
router.get("/", movieController.getAllMovies);

/** GET /movies/:id/reviews
 *  - Hämtar recensioner för vald film.
 *  - [A] validateId: tidig kontroll av ObjectId-format.
 */
router.get("/:id/reviews", validateId, movieController.getReviewsByMovieId);

/** GET /movies/:id
 *  - Hämtar en film med angivet id.
 *  - [A] validateId: tidig kontroll av ObjectId-format.
 */
router.get("/:id", validateId, movieController.getMoviesById);

// [4] ADMIN-SKYDDADE RUTTER (kräver JWT + admin-roll)
/** POST /movies
 *  Flöde:
 *   [1] authMiddleware: säkerställ giltig JWT -> req.user
 *   [2] roleMiddleware("admin"): endast admin får skapa filmer
 *   [3] movieController.createMovie: skriver till DB
 */
router.post("/", authMiddleware, roleMiddleware("admin"), movieController.createMovie);

/** PUT /movies/:id
 *  Flöde:
 *   [1] authMiddleware
 *   [2] roleMiddleware("admin")
 *   [3] validateId: kontroll av param-id
 *   [4] movieController.updateMovie: uppdaterar dokumentet
 */
router.put("/:id", authMiddleware, roleMiddleware("admin"), validateId, movieController.updateMovie);

/** DELETE /movies/:id
 *  Flöde:
 *   [1] authMiddleware
 *   [2] roleMiddleware("admin")
 *   [3] validateId
 *   [4] movieController.deleteMovie
 */
router.delete("/:id", authMiddleware, roleMiddleware("admin"), validateId, movieController.deleteMovie);

module.exports = router;
