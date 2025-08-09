/** Auth-middleware (JWT)
 * Syfte:
 *  - Skydda rutter genom att kräva en giltig JWT i Authorization-headern.
 *
 * Förväntad header:
 *  - Authorization: "Bearer <token>"
 *
 * Övergripande flöde:
 *  1) Läs Authorization-header.
 *  2) Säkerställ formatet "Bearer <token>".
 *  3) Verifiera token med jwt.verify och din hemlighet (process.env.JWT_SECRET).
 *  4) Om verifiering lyckas: lägg { id, role } från payload på req.user.
 *  5) Kör next() för att släppa igenom till nästa middleware/route.
 *  6) Vid fel: returnera 401 med tydligt felmeddelande.
 *
 * Vanliga fel som fångas:
 *  - Header saknas eller har fel format.
 *  - Token är ogiltig eller utgången.
 */
const jwt = require("jsonwebtoken");

/** Kärnlogik:
 *  - All validering görs innan next().
 *  - Den här middlewaren lägger inte till rättigheter; den exponerar bara identitet/roll.
 *  - Rollkontroll sker separat i t.ex. roleMiddleware.
 */
const authMiddleware = (req, res, next) => {
    // [1] Hämta och kontrollera att Authorization-header finns och följer rätt format.
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // Saknad/trasig header => ingen verifierbar identitet
        return res.status(401).json({ error: "Ingen giltig token tillhandahölls." });
    }

    // [2] Extrahera token-delen efter "Bearer "
    const token = authHeader.split(" ")[1];

    try {
        // [3] Verifiera token; misslyckas om signatur fel/utgången/hemlighet fel
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // [4] Exponera identitet och roll för nedströms kod (controllers/andra middleware)
        //     Håll detta minimal: endast fält som behövs (id, role)
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        // [5] Släpp igenom till nästa middleware/route
        next();
    } catch (error) {
        // [6] Token ogiltig eller utgången => 401 Unauthorized
        console.error("Token verifiering misslyckades:", error);
        return res.status(401).json({ error: "Ogiltig token." });
    }
};

module.exports = authMiddleware;
