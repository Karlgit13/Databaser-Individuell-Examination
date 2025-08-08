const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateId } = require('../middleware/validateId');

router.post("/", authMiddleware, reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/:id", validateId, reviewController.getReviewById);
router.put("/:id", authMiddleware, validateId, reviewController.updateReview);
router.delete("/:id", authMiddleware, validateId, reviewController.deleteReview);

module.exports = router;
