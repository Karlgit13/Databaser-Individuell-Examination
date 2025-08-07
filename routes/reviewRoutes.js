const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// skapa recension (kräver inloggad användare)
router.post("/", authMiddleware, reviewController.createReview)

// hämta alla recensioner (öppet)
router.get("/", reviewController.getAllReviews)

// hämta recension efter ID (öppet)
router.get("/:id", reviewController.getReviewById)


// uppdatera recension (kräver inloggad användare)
router.put("/:id", authMiddleware, reviewController.updateReview)


// ta bort recension (kräver inloggad användare)
router.delete("/:id", authMiddleware, reviewController.deleteReview)


// här exporterar vi routern så att den kan användas i appen
module.exports = router