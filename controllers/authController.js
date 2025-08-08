const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ "message": "Användaren finns redan." });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save();
        res.status(201).json({ "User": "Registrering lyckades." });
    } catch (error) {
        console.error("register error:", error);
        res.status(500).json({ error: "Ett fel uppstod vid registrering." });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ "user": "Användaren finns inte." });
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ "message": "Felaktigt lösenord." });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        console.error("login error:", error);
        res.status(500).json({ error: "Ett fel uppstod vid inloggning." });
    }
}
