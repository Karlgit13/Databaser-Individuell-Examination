const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, reuireqd: true, unique: true },
    password: {type : String, required:true},
    role: {type : String, enum: ["user", "admin"], default: "user"}
})

exports = mongoose.model("User", userSchema); // Exporterar modellen för användning i andra filer