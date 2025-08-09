/** validateObjectId-middleware
 * Syfte:
 *  - Ett alternativt namn/variant för att kontrollera giltiga MongoDB ObjectId:n.
 *  - Kan återanvändas i flera rutter för att validera olika typer av ID:n.
 *
 * Skillnad mot validateId.js:
 *  - I praktiken gör den samma sak, men kan användas i t.ex. reviews, movies, users.
 *  - Möjligt att utöka med mer logik här om man vill ha mer avancerad validering.
 *
 * Övergripande flöde:
 *  1) Ta emot id från req.params.id.
 *  2) Använd mongoose.Types.ObjectId.isValid() för formatkontroll.
 *  3) Om ogiltigt -> returnera 400 (Bad Request).
 *  4) Om giltigt -> kör next().
 */
const mongoose = require("mongoose");

module.exports = function (req, res, next) {
    // [1] Plocka id från URL-parametrarna
    const id = req.params.id;

    // [2] Kontrollera med mongoose-metoden
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Ogiltigt ID.");
    }

    // [3] Vid giltigt id -> fortsätt
    next();
};
