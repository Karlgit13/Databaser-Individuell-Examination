/** Role-middleware
 * Syfte:
 *  - Begränsa åtkomst till vissa rutter beroende på användarens roll.
 *
 * Förutsättning:
 *  - Kräver att authMiddleware har körts innan, så att req.user finns och innehåller { id, role }.
 *
 * Användningsexempel:
 *  router.post("/admin-route", authMiddleware, roleMiddleware("admin"), controllerFunction);
 *
 * Övergripande flöde:
 *  1) Ta emot en eller flera roller som ska tillåtas (t.ex. "admin", "user").
 *  2) Returnera en middleware-funktion som:
 *     a) Kontrollerar att req.user.role finns.
 *     b) Jämför användarens roll mot de tillåtna rollerna.
 *  3) Om roll matchar -> släpp igenom till nästa steg (next()).
 *  4) Om ingen match -> returnera 403 (Forbidden) med tydligt felmeddelande.
 *
 * Vanliga fel som fångas:
 *  - req.user saknas (authMiddleware har inte körts innan).
 *  - Rollen finns inte i listan med tillåtna roller.
 */
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        // [1] Kontrollera att req.user existerar (ska ha satts av authMiddleware)
        if (!req.user || !req.user.role) {
            return res.status(403).json({ error: "Åtkomst nekad. Ingen användarroll hittades." });
        }

        // [2] Kontrollera om användarens roll är en av de tillåtna rollerna
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Åtkomst nekad. Otillräckliga rättigheter." });
        }

        // [3] Allt ok -> släpp igenom till nästa middleware eller route-handler
        next();
    };
};

module.exports = roleMiddleware;
