/** User Model (Mongoose Schema)
 * Syfte:
 *  - Representera en användare i databasen.
 *  - Spara inloggningsuppgifter och roll för åtkomstkontroll.
 *
 * Nyckelbegrepp:
 *  - Lösenord lagras alltid hashat (bcrypt i controllers).
 *  - Email och username är unika för att förhindra dubbletter.
 *
 * Fält:
 *  - username: String, krävs, trim, unik
 *  - email: String, krävs, trim, unik
 *  - password: String, krävs (hash lagras här)
 *  - role: String, default "user", kan även vara "admin"
 *
 * Export:
 *  - Mongoose-modell "User" baserad på detta schema.
 */
const mongoose = require("mongoose");

/** [1] Skapa schema för användare
 *  - unique: true för att databasen ska avvisa dubbletter.
 *  - trim: true tar bort onödiga mellanslag i början/slutet.
 */
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
});

/** [2] Exportera modellen
 *  - Namn: "User"
 *  - Schema: userSchema
 */
module.exports = mongoose.model("User", userSchema);
