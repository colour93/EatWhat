// 数据库索引文件
const mongoose = require('mongoose');



mongo = async() => {
    const { db } = require('../config.json');
    mongoose.connect(`mongodb://${db.username}:${db.password}@${db.address}/${db.database}`,{ useNewUrlParser: true,useUnifiedTopology: true})
    var database = mongoose.connection;
    database.on("err",console.error.bind(console,"数据库链接错误"));
    database.once("open",()=>{
        console.log("数据库链接成功")
    })
};

module.exports = mongo;


