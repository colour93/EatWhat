const mongoose = require("mongoose");
const {Schema} = mongoose;

// SchoolList
const SchoolListSchema = new Schema ({
    schoolId: {
        type: Number,
        unique: true
    },
    schoolName: String,
    keywords: [{
        type: String,
        unique: true,
    }]
})
const SchoolList = mongoose.model('SchoolList', SchoolListSchema);

module.exports = SchoolList;