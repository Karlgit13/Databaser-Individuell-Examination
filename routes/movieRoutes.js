const express = require('express');
const router = express.Router();
const { validateId } = require('../middleware/validateId');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const ratingsController = require("../controllers/ratingsController");
const movieController = require('../controllers/movieController');

// offentliga routes
router.get("/ratings", ratingsController.getMovieRatings);
router.get("/", movieController.getAllMovies);
router.get("/:id/reviews", validateId, movieController.getReviewsByMovieId);
router.get("/:id", validateId, movieController.getMoviesById);

// endast admin
router.post("/", authMiddleware, roleMiddleware("admin"), movieController.createMovie);
router.put("/:id", authMiddleware, roleMiddleware("admin"), validateId, movieController.updateMovie);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), validateId, movieController.deleteMovie);

module.exports = router;
