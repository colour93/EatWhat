const mongoose = require("mongoose");
const {Schema} = mongoose;

// Stat
const StatSchema = new Schema ({
    count: Number,
    date: Number,
    type: String
})
const Stat = mongoose.model('Stat', StatSchema);

module.exports = Stat;