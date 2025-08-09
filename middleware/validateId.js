/** validateId-middleware
 * Syfte:
 *  - Kontrollera att ett ID som skickas som route-parameter är ett giltigt MongoDB ObjectId.
 *
 * Fördel:
 *  - Stoppar onödiga databasfrågor och ger tidigt felmeddelande om ID är ogiltigt format.
 *
 * Förväntad användning:
 *  router.get("/:id", validateId, controllerFunction);
 *
 * Övergripande flöde:
 *  1) Hämta id från req.params.id.
 *  2) Kontrollera om det är ett giltigt ObjectId via mongoose.Types.ObjectId.isValid().
 *  3) Om ogiltigt -> returnera 400 (Bad Request).
 *  4) Om giltigt -> släpp igenom till nästa middleware/route-handler.
 */
const mongoose = require("mongoose");

const validateId = (req, res, next) => {
    // [1] Hämta id från parametern i URL:en
    const id = req.params.id;

    // [2] Kontrollera giltighet med mongoose-metod
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Ogiltigt ID-format." });
    }

    // [3] ID är giltigt, gå vidare
    next();
};

module.exports = { validateId };
