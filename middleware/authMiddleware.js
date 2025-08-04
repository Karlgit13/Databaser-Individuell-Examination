const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // { id, role }
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
