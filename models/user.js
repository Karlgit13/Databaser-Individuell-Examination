const mongoose = require("mongoose");


// här definerar vi en användare som kan logga in och skriva recensioner
// varje användare har ett användarnamn, e-postadress, lösenord och roll (user eller admin)
// mongoose.Schema används för att skapa ett schema som definierar dessa fält
// varje fält har en typ och vissa fält är markerade som unika (unique) för att undvika dubbletter
// användarnamnet och e-postadressen måste vara unika för varje användare
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
})


// här exporterar vi modellen User som kan användas i andra filer
// mongoose.model skapar en modell baserat på schemat userSchema
module.exports = mongoose.model("User", userSchema);