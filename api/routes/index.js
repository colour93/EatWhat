// 索引路由
const axios = require('axios');
let express = require('express');
let router = express.Router();

// 全局返回
const $ = require('../controllers/fn');

// 数据库
const SchoolList = require('../mongo/SchoolList');
const ShopList = require('../mongo/ShopList');
const Stat = require('../mongo/Stat');

// API统计中间件
const apiStat = async (req, res, next) => {

    let oldToday, newToday, date, oldTotal, newTotal;

    // 生成日期串
    date = $.getDateNumber();

    oldToday = await Stat.findOne({date});
    oldTotal = await Stat.findOne({type: 'total'});

    if (!oldToday) {
        // 如果为当天第一次
        newToday = await Stat.findOneAndUpdate({date}, {
            date,
            count: 1,
            type: 'day'
        }, {
            upsert: true
        })
    } else {
        // 如果不是第一次
        newToday = await Stat.findOneAndUpdate({date}, {
            date,
            count: oldToday.count + 1
        })
    }

    if (!oldTotal) {
        // 如果为总数第一次
        newTotal = await Stat.findOneAndUpdate({type: 'total'}, {
            count: 1,
            type: 'total'
        }, {
            upsert: true
        })
    } else {
        // 如果不是第一次
        newTotal = await Stat.findOneAndUpdate({type: 'total'}, {
            count: oldTotal.count + 1
        })
    }

    next();
}

// bing壁纸
router.get('/bing', async (req, res, next) => {
    axios.get("https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN")
        .then((resp)=>{
            $.ok(res, {
                url: "https://cn.bing.com" + resp.data.images[0].url
            })
        })
})

router.get('/121', async (req, res, next) => {
    res.cookie('key', '232', {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true});
    res.send('ok');
})

// 搜索学校
router.get('/searchSchool', async (req, res, next) => {

    let byExact, byFuzzy, byKeyword;
    let result = [];

    let {keyword} = req.query;

    // 判断入参
    if (!keyword) {
        $.missingParam(res);
        return;
    };

    // 精确查找
    byExact = await SchoolList.findOne({schoolName: keyword}, {_id: 0, __v: 0});

    // 模糊查找
    if (!byExact) {
        byFuzzy = await SchoolList.find({schoolName: {$regex: keyword}}, {_id: 0, __v: 0});
        byKeyword = await SchoolList.find({keywords: keyword}, {_id: 0, __v: 0});

    }
    
    $.ok(res, {byExact, byFuzzy, byKeyword});
})

// 搜索店铺
router.get('/searchShop', async (req, res, next) => {

    let result = [];

    let {keyword, type} = req.query;
    if (!type) {
        type = 1;
    } else {
        type = parseInt(type);
    }

    // 判断入参
    if (!keyword || isNaN(type)) {
        $.missingParam(res);
        return;
    };
    switch (type) {
        case 1:
            // 查店铺名模式
            result = await ShopList.find({shopName: {$regex: keyword}}, {_id: 0, __v: 0, food: 0, drink: 0});
            break;
        case 2:
            // 查店铺标签
            result = await ShopList.find({tag: keyword}, {_id: 0, __v: 0, food: 0, drink: 0});
            break;
        default:
            $.missingParam(res);
            return;
    }
    
    
    $.ok(res, result);
})

// 抽卡！
router.get('/get/:type', apiStat, async (req, res, next) => {

    // 初始化变量
    let result = [];
    let otherItemType;

    // 获取路径参数
    let itemType = req.params.type;

    // 获取查询字符串
    let {count, type, keyword} = req.query;

    // 格式化参数
    if (itemType != 'food' && itemType != 'drink') {
        $.missingParam(res);
        return;
    }
    count = parseInt(count);
    if (isNaN(count)) {
        count = 1;
    };
    if (count > 15) {
        $.missingParam(res);
        return;
    }
    if (!type) {
        type = 0;
        keyword = null;
    } else {
        type = parseInt(type);
        if (isNaN(type) || !keyword) {
            $.missingParam(res);
            return;
        };
    };

    // 抽卡！！！

    // 判断反向类目，以便屏蔽返回
    if (itemType=='food') {
        otherItemType = 'drink';
    } else {
        otherItemType = 'food';
    }

    // 这里为了方便用的字符串转JSON
    pjCFG = JSON.parse(`{"_id":0, "${otherItemType}":0, "__v":0, "${itemType}._id":0}`)

    switch (type) {

        // 标准模式
        case 0:
            
            // 抽卡！
            while (result.length==0) {

                // 聚合查询
                result = await ShopList.aggregate([
                    
                    // 先随机查找 count 个商家
                    {"$sample" : { size : count }},

                    // 依据类目拆分
                    {"$unwind" : `$${itemType}`},

                    // 从拆分好的文档中随机抽取 count 个商品
                    {"$sample" : { size : count }},

                    // 设置返回项
                    {"$project" : pjCFG}

                ]);
            };
            break;

        // 按照tag查找
        case 1:

            // 聚合查询 yyds    
            result = await ShopList.aggregate([

                // 按照tag筛选商家
                {"$match" : { tag: keyword }},

                // 依据类目拆分
                {"$unwind" : `$${itemType}`},

                // 从拆分好的文档中随机抽取 count 个商品
                {"$sample" : { size : count }},

                // 设置返回项
                {"$project" : pjCFG}
            ])
            break;

        // 按照店铺id查找
        case 2:

            shopId = parseInt(keyword);
            
            // 聚合查询 yyds x2
            result = await ShopList.aggregate([

                // 按照tag筛选商家
                {"$match" : { shopId }},

                // 依据类目拆分
                {"$unwind" : `$${itemType}`},

                // 从拆分好的文档中随机抽取 count 个商品
                {"$sample" : { size : count }},

                // 设置返回项
                {"$project" : pjCFG}
            ])
            break;
    
        default:
            $.missingParam(res);
            return;
    }

    $.ok(res, result);
})

module.exports = router;
