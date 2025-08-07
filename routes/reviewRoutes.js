const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateId } = require('../middleware/validateId');

// skapa recension (kräver inloggad användare)
router.post("/", authMiddleware, reviewController.createReview);

// hämta alla recensioner (öppet)
router.get("/", reviewController.getAllReviews);

// hämta recension efter ID (öppet, men validerar ID)
router.get("/:id", validateId, reviewController.getReviewById);

// uppdatera recension (kräver inloggad användare + giltigt ID)
router.put("/:id", authMiddleware, validateId, reviewController.updateReview);

// ta bort recension (kräver inloggad användare + giltigt ID)
router.delete("/:id", authMiddleware, validateId, reviewController.deleteReview);

module.exports = router;
