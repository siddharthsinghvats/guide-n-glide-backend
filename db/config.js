const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const DATABASE = process.env.DB;
module.exports=mongoose.connect(DATABASE);