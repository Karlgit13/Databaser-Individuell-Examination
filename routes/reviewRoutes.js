/** Router för recensioner:
 * - Skapa/uppdatera/ta bort kräver auth (user eller admin)
 * - Validerar :id vid behov
 */
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateId } = require('../middleware/validateId');

/** Endpoints:
 * - POST /           (skapa)        [auth]
 * - GET /            (lista alla)   [offentligt]
 * - GET /:id         (detalj)       [offentligt + validateId]
 * - PUT /:id         (uppdatera)    [auth + validateId]
 * - DELETE /:id      (ta bort)      [auth + validateId]
 */
router.post("/", authMiddleware, reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/:id", validateId, reviewController.getReviewById);
router.put("/:id", authMiddleware, validateId, reviewController.updateReview);
router.delete("/:id", authMiddleware, validateId, reviewController.deleteReview);

module.exports = router;
