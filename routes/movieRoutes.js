const express = require('express');
const router = express.Router()
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


// offentliga routes
router.get("/", movieController.getAllMoivies);
router.get("/:id", movieController.getMovieById);
router.get(":id/reviews", movieController.getMovieReviews)

// endast admin
router.post("/", authMiddleware, roleMiddleware("admin"), movieController.createMovie);
router.put("/:id", authMiddleware, roleMiddleware("admin"), movieController.updateMovie)
router.delete("/:id", authMiddleware, roleMiddleware("admin"), movieController.deleteMovie)


module.exports = router