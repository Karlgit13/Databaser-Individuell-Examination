/** Router för filmer:
 * - Offentliga GET-rutter
 * - Admin-skyddade POST/PUT/DELETE
 * - Validerar ObjectId där det behövs
 */
const express = require('express');
const router = express.Router();
const { validateId } = require('../middleware/validateId');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const ratingsController = require("../controllers/ratingsController");
const movieController = require('../controllers/movieController');

/** Offentliga rutter (ingen auth krävs)
 * - /ratings: aggregerar snittbetyg
 * - /: lista alla
 * - /:id/reviews: hämta recensioner för film
 * - /:id: detaljer för film
 */
router.get("/ratings", ratingsController.getMovieRatings);
router.get("/", movieController.getAllMovies);
router.get("/:id/reviews", validateId, movieController.getReviewsByMovieId);
router.get("/:id", validateId, movieController.getMoviesById);

/** Admin-rutter (auth + roll "admin")
 * - POST /: skapa film
 * - PUT /:id: uppdatera film
 * - DELETE /:id: ta bort film
 */
router.post("/", authMiddleware, roleMiddleware("admin"), movieController.createMovie);
router.put("/:id", authMiddleware, roleMiddleware("admin"), validateId, movieController.updateMovie);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), validateId, movieController.deleteMovie);

module.exports = router;
