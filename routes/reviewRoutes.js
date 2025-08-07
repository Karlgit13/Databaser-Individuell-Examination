const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// skapa recension (kräver inloggad användare)
router.post("/", authMiddleware, reviewController.createReview)

// hämta alla recensioner (öppet)
router.get("/", reviewController.getAllReviews)

// hämta recension efter ID (öppet)
router.get("/:id", validateObjectId(), reviewController.getReviewById)


// uppdatera recension (kräver inloggad användare)
router.put("/:id", authMiddleware, validateObjectId(), reviewController.updateReview)


// ta bort recension (kräver inloggad användare)
router.delete("/:id", authMiddleware, validateObjectId(), reviewController.deleteReview)


// här exporterar vi routern så att den kan användas i appen
module.exports = router