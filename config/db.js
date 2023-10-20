const mongoose = require("mongoose");
require("dotenv").config();

const connection = mongoose.connect(`${process.env.MONGODB_URL}/c3retake`);

module.exports = {connection};