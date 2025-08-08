/** Router för auth:
 * - Initierar Express Router
 * - Kopplar controller-funktioner till POST-endpoints
 */
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/** Endpoints (bas monteras i server.js under /api):
 * - POST /register -> skapa användare
 * - POST /login    -> logga in och få JWT
 */
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
