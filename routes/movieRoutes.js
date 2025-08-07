const express = require('express');
const router = express.Router()
const validateObjectId = require('../middleware/validateObjectId');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const ratingsController = require("../controllers/ratingsController");
const movieController = require('../controllers/movieController');



// offentliga routes
router.get("/ratings", ratingsController.getMovieRatings);
router.get("/", movieController.getAllMovies);
router.get("/:id/reviews", validateObjectId(), movieController.getReviewsByMovieId)
router.get("/:id", validateObjectId(), movieController.getMoviesById);

// endast admin
router.post("/", authMiddleware, roleMiddleware("admin"), movieController.createMovie);
router.put("/:id", authMiddleware, roleMiddleware("admin"), validateObjectId(), movieController.updateMovie)
router.delete("/:id", authMiddleware, roleMiddleware("admin"), validateObjectId(), movieController.deleteMovie)


module.exports = router