/** Review Routes
 * Syfte:
 *  - Exponera API-endpoints för recensioner (CRUD).
 * Säkerhet:
 *  - Skapa/uppdatera/ta bort kräver auth (JWT).
 *  - Läsning (GET) är öppen.
 *
 * Övergripande flöde:
 *  [1] Skapa router.
 *  [2] Koppla in auth och id-validering.
 *  [3] Definiera rutter: POST (auth), GET list, GET by id, PUT (auth), DELETE (auth).
 */
const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateId } = require('../middleware/validateId');

// SKAPA (auth krävs)
/** POST /reviews  [auth]
 * Flöde:
 *  [1] authMiddleware: verifiera JWT -> req.user
 *  [2] reviewController.createReview: kontrollerar att filmen finns, skapar review
 */
router.post("/", authMiddleware, reviewController.createReview);

// LÄSA: lista alla (öppen)
/** GET /reviews
 *  - Returnerar alla recensioner med populering av user/movie för läsbarhet.
 */
router.get("/", reviewController.getAllReviews);

// LÄSA: en specifik (öppen)
/** GET /reviews/:id
 * Flöde:
 *  [1] validateId: kontrollera id-format
 *  [2] reviewController.getReviewById: hämta + populera
 */
router.get("/:id", validateId, reviewController.getReviewById);

// UPPDATERA (auth krävs)
/** PUT /reviews/:id  [auth]
 * Flöde:
 *  [1] authMiddleware
 *  [2] validateId
 *  [3] reviewController.updateReview
 * Notis:
 *  - Ägarskapskontroll kan läggas till i controller eller separat middleware.
 */
router.put("/:id", authMiddleware, validateId, reviewController.updateReview);

// TA BORT (auth krävs)
/** DELETE /reviews/:id  [auth]
 * Flöde:
 *  [1] authMiddleware
 *  [2] validateId
 *  [3] reviewController.deleteReview
 */
router.delete("/:id", authMiddleware, validateId, reviewController.deleteReview);

module.exports = router;
