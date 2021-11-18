// 索引路由

// 必要引用
let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');

// 全局返回
const $ = require('../controllers/fn');

// 数据库
const SchoolList = require('../mongo/SchoolList');
const ShopList = require('../mongo/ShopList');
const Admin = require('../mongo/Admin');
const Stat = require('../mongo/Stat');

// 参数
const {frontURL} = require('../config.json').config;


// 鉴权中间件
const auth = async (req, res, next) => {
    console.log(req.cookies);

    let token;

    // 判断token是否存在
    if (!req.cookies.token && !req.query.token) {
        $.unauthorized(res);
        return;
    }

    // 判断token来源
    if (req.query.token) {
        token = req.query.token;
    } else {
        token = req.cookies.token;
    }
    
    // 验证token
    try {
        data = jwt.verify(token, 'token');
    } catch (err) {
        // token失效
        if (err.name == 'TokenExpiredError') {
            $.tokenExpired(res);
            return;
        }
    }

    // 从admin拉取用户信息
    compareOrigin = await Admin.findOne({ts: data.ts});

    // 判断密码是否更改过
    if (data.pwd != compareOrigin.pwd) {
        $.tokenExpired(res);
        return;
    }

    next();
}

// 仪表板状态获取
router.get('/status', auth, async (req, res, next) => {

    // 初始化变量
    let schoolCount, shopCount, apiTodayCount, apiTotalCount, date;

    // 生成日期数字串
    date = $.getDateNumber();

    // 获取学校总数
    schoolCount = await SchoolList.count();

    // 获取店铺总数
    shopCount = await ShopList.count();

    // 获取当日API调用量
    apiTodayCount = await Stat.findOne({date})
        .then((result)=>{
            if (!result) {
                return 0;
            }
            return result.count;
        });

    // 获取全部API调用量
    apiTotalCount = await Stat.findOne({type: 'total'})
        .then((result)=>{
            if (!result) {
                return 0;
            }
            return result.count;
        });

    $.ok(res, {
        schoolCount,
        shopCount,
        apiTodayCount,
        apiTotalCount
    })
})

// =========学校管理=========

// 新增学校
router.post('/school/add', auth, async (req, res, next) => {

    // 初始化变量
    let schoolId;

    // 赋值
    let {schoolName, keywords} = req.body;

    // 判断入参
    if (!schoolName || !keywords) {
        $.missingParam(res);
        return;
    }

    // 格式化变量 关键字
    keywords = keywords.split(',');
    
    // 插入文档
    lastDoc = await SchoolList.aggregate([{"$sort": {"schoolId": -1}}, {"$limit": 1}]);

    // 判断以前有没有文档
    if (!lastDoc.length) {
        schoolId = 1
    } else {
        schoolId = lastDoc[0].schoolId + 1;
    };


    try {
        result = await SchoolList.create({
            schoolId,
            schoolName,
            keywords
        })
    } catch (err) {
        switch (err.code) {

            // unique 问题
            case 11000:
                $.exist(res);
                return;
        
            // 其他问题
            default:
                $.fetalError(res);
                console.log(err);
                return;
        }
    }
    
    $.ok(res, result);
    console.log(`SchoolList 新增 ${result.schoolId} : ${result.schoolName}`);
})

// 获取学校列表
router.get('/school/list', auth, async (req, res, next) => {
    let result;
    result = await SchoolList.find();
    $.ok(res, result);
})

// 删除学校
router.delete('/school/delete', auth, async (req, res, next) => {

    let result;

    let {schoolId} = req.body;
    schoolId = parseInt(schoolId);
    if (isNaN(schoolId)) {
        $.missingParam(res);
        return;
    };

    result = await SchoolList.deleteOne({schoolId});
    if (!result.deletedCount) {
        $.notFound(res, "学校不存在");
        return;
    };
    $.ok(res);
})


// =========店铺管理=========

// 新增店铺
router.post('/shop/add', auth, async (req, res, next) => {

    let {shopName, schoolId, tag, delivery} = req.body;
    let schoolInfo;
    schoolId = parseInt(schoolId);
    delivery = parseInt(delivery);

    // 判断入参
    if (!shopName || isNaN(schoolId) || !tag || isNaN(delivery)) {
        $.missingParam(res);
        return;
    };

    // 格式化变量 关键字
    tag = tag.split(',');

    // 获取学校名称
    schoolInfo = await SchoolList.findOne({schoolId});
    if (!schoolInfo) {
        $.notFound(res, "学校不存在");
        return;
    };
    console.log(schoolInfo);
    
    // 插入文档
    lastDoc = await ShopList.aggregate([
        {"$match": {"schoolId": schoolId}},
        {"$sort": {"shopId": -1}},
        {"$limit": 1}
    ])

    // 判断以前有没有文档
    if (!lastDoc.length) {
        shopId = schoolId * 10000 + 1
    } else {
        shopId = lastDoc[0].shopId + 1;
    };

    console.log(shopId)
    let {schoolName} = schoolInfo;
    try {
        result = await ShopList.create({
            shopName,
            shopId,
            schoolId,
            schoolName,
            tag,
            delivery
        })
    } catch (err) {
        switch (err.code) {

            // unique 问题
            case 11000:
                console.log(err)
                $.exist(res);
                return;
        
            // 其他问题
            default:
                $.fetalError(res);
                console.log(err);
                return;
        }
    }
    
    $.ok(res, result);
    console.log(`ShopList 新增 ${result.shopId} : ${result.shopName}`);


})

// 获取店铺列表
router.get('/shop/list', auth, async (req, res, next) => {
    let result;
    result = await ShopList.find({}, {food: 0, drink: 0});
    $.ok(res, result);
})

// 删除店铺
router.delete('/shop/delete', auth, async (req, res, next) => {

    let result;

    let {shopId} = req.body;
    shopId = parseInt(shopId);
    if (isNaN(shopId)) {
        $.missingParam(res);
        return;
    };

    result = await ShopList.deleteOne({shopId});
    if (!result.deletedCount) {
        $.notFound(res, "店铺不存在");
        return;
    };
    $.ok(res);
})

// =========商品管理=========

// 新增商品
router.post('/item/add', auth, async (req, res, next) => {

    console.log(req.body)

    let {itemName, price, shopId, type} = req.body;
    let priceNull, itemId, temp, newType;
    shopId = parseInt(shopId);
    if (!price) {
        priceNull = true;
    }
    price = parseFloat(price);

    // 判断入参
    if (!itemName || isNaN(shopId) || ( isNaN(price) && !priceNull ) || !type || ( type!='food' && type!='drink')) {
        $.missingParam(res);
        return;
    };
    if (priceNull) {
        price = null;
    }
    
    // 判断是否存在店铺id
    result = await ShopList.findOne({shopId});
    if (!result) {
        $.notFound(res, "店铺不存在");
        return;
    }

    // 生成时间戳
    let ts = new Date().getTime();

    // 计算shopId
    if (type=='food') {
        count = result.food.length;
        itemId = (shopId * 100000) + 10000 + (count + 1);
    } else {
        count = result.drink.length;
        itemId = (shopId * 100000) + 20000 + (count + 1);
    }
    
    // 插入文档
    try {
        if (type=='food') {
            ctrlResult = await ShopList.findOneAndUpdate({shopId}, {
                $addToSet: {
                    food: {
                        itemName,
                        itemId,
                        price,
                        ts
                    }
                }
            }, { new: true })
            temp = ctrlResult.food.filter((p) => {
                return p.ts === ts;
            });
            temp = temp[0];
            newType = "食品";
        } else {
            ctrlResult = await ShopList.findOneAndUpdate({shopId},{
                $addToSet: {
                    drink: {
                        itemName,
                        itemId,
                        price,
                        ts
                    }
                }
            }, { new: true })
            temp = ctrlResult.drink.filter((p) => {
                return p.ts === ts;
            });
            temp = temp[0];
            newType = "饮品";
        }
    } catch (err) {
        switch (err.code) {

            // unique 问题
            case 11000:
                // console.log(err)
                $.exist(res);
                return;
        
            // 其他问题
            default:
                $.fetalError(res);
                console.log(err);
                return;
        }
    }
    result = {
        shopName: ctrlResult.shopName,
        shopId: ctrlResult.shopId,
        schoolName: ctrlResult.schoolName,
        schoolId: ctrlResult.schoolId,
        tag: ctrlResult.tag,
        delivery: ctrlResult.delivery,
        new: temp,
        newType
    }
    
    $.ok(res, result);
    console.log(`ShopList - Item 新增 ${result.shopName}[${result.shopId}]`);
})

// 获取商品列表
router.get('/item/list', auth, async (req, res, next) => {

    let {shopId} = req.query;
    shopId = parseInt(shopId);
    if (isNaN(shopId)) {
        $.missingParam(res);
        return;
    };

    let result;
    result = await ShopList.findOne({shopId});
    if (!result) {
        $.notFound(res, '店铺不存在');
        return;
    };

    $.ok(res, result);
})

// 删除商品
router.delete('/item/delete', auth, async (req, res, next) => {

    let result;

    let {itemId} = req.body;
    let shopId, typeId;
    itemId = parseInt(itemId);
    if (isNaN(itemId)) {
        $.missingParam(res);
        return;
    };

    shopId = parseInt(itemId.toString().substring(itemId.toString().length - 5, 0));

    console.log(shopId);

    // result = await ShopList.updateOne({shopId}, {
    //     $pull: {
            
    //     }
    // });
    // if (!result.deletedCount) {
    //     $.notFound(res, "店铺不存在");
    //     return;
    // };
    $.ok(res);
})

// ========管理员管理=========

// 注册用户
router.post('/admin/add', auth, async (req, res, next) => {

    let {user, pwd} = req.body;

    if (!user || !pwd) {
        $.missingParam(res);
        return;
    }

    ts = new Date().getTime();
    
    try {

        result = await Admin.create({
            user, pwd, ts
        })

    } catch (err) {

        switch (err.code) {

            // unique 问题
            case 11000:
                $.exist(res);
                return;
        
            // 其他问题
            default:
                $.fetalError(res);
                console.log(err);
                return;
        }
    }


    $.ok(res, result);
})

// 登录
router.post('/admin/login', async (req, res, next) => {

    // 初始化变量
    let {user, pwd} = req.body;
    let result, token;

    // 判断入参
    if (!user || !pwd) {
        $.missingParam(res);
        return;
    }

    // 从数据库查找user
    compareOrigin = await Admin.findOne({user});

    // 比对
    if (!compareOrigin || !$.comparePwd(pwd, 'admin', compareOrigin.pwd)) {
        $.passwordWrong(res);
        return;
    }

    // 签发token
    token = jwt.sign({
        ts: compareOrigin.ts,
        pwd: compareOrigin.pwd
    }, 'token', {
        expiresIn: 7 * 24 * 60 * 60
    })
    console.log(token)
    $.ok(res, {
        token
    })
})

// 登出
router.get('/admin/logout', auth, async(req, res, next) => {
    res.clearCookie('token');
    res.redirect(302, frontURL + "/manage/login.html");
})

// 为了解决跨域,整了个redirect,set-cookie专用
router.get('/token/verify', auth, async(req, res, next) => {
    if (!req.query.redirect || req.query.redirect == 'undefined') {
        redirectURL = "/manage";
    } else {
        redirectURL = req.query.redirect;
    }
    res.cookie('token', req.query.token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    });
    res.redirect(302, frontURL + redirectURL);
})


module.exports = router;
