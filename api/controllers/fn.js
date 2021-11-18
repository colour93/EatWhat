// 全局回复

const crypto = require('crypto');
const {adminSalt, userSalt} = require('../config.json').db;

module.exports  = {
    // 正常返回
    ok: (res, data, msg) => {
        if (!msg) {
            msg = "success";
        };
        res.send({
            code: 100,
            msg,
            data
        });
        return;
    },
    // 缺少参数
    missingParam: (res) => {
        res.send({
            code: 101,
            msg: "参数不正确或缺少参数"
        });
        return;
    },
    // 已存在
    exist: (res) => {
        res.send({
            code: 102,
            msg: "条目已存在"
        });
        return;
    },
    // 已存在
    passwordWrong: (res) => {
        res.send({
            code: 103,
            msg: "用户名或密码错误"
        });
        return;
    },
    // 已存在
    tokenExpired: (res) => {
        res.send({
            code: 401,
            msg: "登陆已失效"
        });
        return;
    },
    // 无权访问
    unauthorized: (res) => {
        res.status(401).send({
            code: 401,
            msg: "无权访问"
        });
        return;
    },
    // 未搜索到
    notFound: (res, msg) => {
        if (!msg) {
            msg = "未找到";
        };
        res.status(404).send({
            code: 404,
            msg
        });
        return;
    },
    // 403
    forbidden: (res, msg) => {
        if (!msg) {
            msg = "forbidden";
        };
        res.status(403).send({
            code: 403,
            msg
        });
        return;
    },
    // 一些奇怪的错误
    fetalError: (res, msg) => {
        res.send({
            code: -1,
            msg: "内部错误，请联系玖叁 QQ：1285419578"
        });
        return;
    },
    // 密码比对
    comparePwd: (pwd, saltType, dPwd) => {
        let salt, nPwd;
        switch (saltType) {
            case 'admin':
                salt = adminSalt;
                break;
            case 'user':
                salt = userSalt;
                break;
            default:
                return;
        }
        nPwd = crypto.createHash("md5").update(pwd + "." + salt).digest("hex");
        if (nPwd == dPwd) {
            return 1;
        } else {
            return 0;
        }
    },
    // 生成日期数串
    getDateNumber: () => {
        let dateObj = new Date();
        yearStr = dateObj.getFullYear().toString();
        if (dateObj.getMonth() < 9) {
            monthStr = "0" + (dateObj.getMonth() + 1).toString();
        } else {
            monthStr = (dateObj.getMonth() + 1).toString();
        };
        if (dateObj.getDate() < 10) {
            dateStr = "0" + dateObj.getDate().toString();
        } else {
            dateStr = dateObj.getDate().toString();
        }
        return parseInt(yearStr + monthStr + dateStr);
    }
}