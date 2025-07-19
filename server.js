require('dotenv').config();
const express = require('express');
const dotenv = require("dotenv")
const connectDB = require("./config/db.js");

dotenv.config({ override: true, quiet: true });


connectDB()


const app = express()
app.use(express.json())

const PORT = process.env.port || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));