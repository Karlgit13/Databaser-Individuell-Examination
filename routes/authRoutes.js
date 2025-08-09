/** Auth Routes
 * Syfte:
 *  - Registrering och inloggning (generera JWT).
 * Säkerhet:
 *  - Register/Login är öppna endpoints; token skapas först vid /login.
 *
 * Övergripande flöde:
 *  [1] Skapa router.
 *  [2] Koppla controller-funktioner.
 *  [3] Definiera POST /register och POST /login.
 */
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

/** POST /register
 * Flöde:
 *  [1] authController.register: kollar unik email, hashar lösenord, sparar användare.
 */
router.post("/register", authController.register);

/** POST /login
 * Flöde:
 *  [1] authController.login: validerar credsen, signerar JWT, returnerar { token, user }.
 */
router.post("/login", authController.login);

module.exports = router;
