const crypto = require('crypto');
const {adminSalt} = require('../config.json').db;

const mongoose = require("mongoose");
const {Schema} = mongoose;

// SchoolList
const AdminSchema = new Schema ({
    user: {
        type: String,
        unique: true
    },
    pwd: {
        type: String,
        set (val) {
            return crypto.createHash("md5").update(val + "." + adminSalt).digest("hex");
        }
    },
    ts: {
        type: Number,
        unique: true
    },
    lastLogin: Date
})
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;