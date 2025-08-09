/** Auth Controller
 * Ansvar:
 *  - Registrera ny användare
 *  - Logga in befintlig användare och ge JWT
 *
 * Säkerhet (översikt):
 *  - Lösenord lagras aldrig i klartext (hash med bcrypt)
 *  - JWT signeras med hemlighet från process.env.JWT_SECRET
 *  - Tokenens payload innehåller endast det som behövs (id, role) och har utgångstid
 */
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/** POST /register
 * Syfte:
 *  - Skapa en ny användare i databasen.
 *
 * Indata (req.body):
 *  - username (unik), email (unik), password (klartext i request)
 *
 * Flöde:
 *  1) Extrahera { username, email, password } från request-body.
 *  2) Kolla om email redan finns (skydd mot dubletter).
 *  3) Hasha lösenordet med bcrypt.hash(plain, saltRounds=10).
 *  4) Skapa User-instans med hashat lösenord.
 *  5) Spara i DB; svara 201 vid lyckad skapelse.
 *
 * Felhantering:
 *  - 400 om email redan finns.
 *  - 500 vid oväntat fel (validering, DB, etc.).
 *
 * Noteringar:
 *  - Vid behov kan extra validering göras (regex för email/lösenordspolicy).
 */
exports.register = async (req, res) => {
    try {
        // [1] Indata
        const { username, email, password } = req.body;

        // [2] Unik email-kontroll
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Användaren finns redan." });
        }

        // [3] Hasha lösenord
        const hashedPassword = await bcrypt.hash(password, 10);

        // [4] Skapa ny användare (role default = "user" enligt modellen)
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // [5] Spara och svara
        await newUser.save();
        res.status(201).json({ User: "Registrering lyckades." });
    } catch (error) {
        console.error("register error:", error);
        res.status(500).json({ error: "Ett fel uppstod vid registrering." });
    }
};

/** POST /login
 * Syfte:
 *  - Autentisera användare och skapa en JWT för fortsatt åtkomst.
 *
 * Indata (req.body):
 *  - email, password
 *
 * Förutsättning:
 *  - Användaren måste redan vara registrerad.
 *
 * Flöde:
 *  1) Hämta { email, password } från body.
 *  2) Slå upp användaren via email.
 *  3) Jämför inskickat lösenord med lagrat (bcrypt.compare).
 *  4) Skapa JWT med payload { id, role } och rimlig utgångstid (ex. 1h).
 *  5) Svara med { token, user: { id, username, role } } för klientens vidare bruk.
 *
 * Felhantering:
 *  - 400 om användare inte finns eller om lösenordet är fel.
 *  - 500 vid oväntat fel.
 *
 * Säkerhetstips:
 *  - Skicka aldrig tillbaka lösenord eller känsliga fält.
 *  - Håll token livstid kort och stöd för refresh om du behöver längre sessioner.
 */
exports.login = async (req, res) => {
    try {
        // [1] Indata
        const { email, password } = req.body;

        // [2] Finns användaren?
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ user: "Användaren finns inte." });
        }

        // [3] Verifiera lösenord (klartext vs hash)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Felaktigt lösenord." });
        }

        // [4] Skapa JWT (payload minimal: id, role)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // [5] Svara med token + publik användarinfo
        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        console.error("login error:", error);
        res.status(500).json({ error: "Ett fel uppstod vid inloggning." });
    }
};
