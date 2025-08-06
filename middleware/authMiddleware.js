const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Ingen giltig token tillhandahölls." });
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next()
    } catch (error) {
        console.error("Token verifiering misslyckades:", error);
        return res.status(401).json({ error: "Ogiltig token." });
    }
}

module.exports = authMiddleware;
