
// 初始化apiURL
const baseURL = "http://127.0.0.1:3000";
const loginPageURL = "/manage/login.html";
const statusURL = baseURL + "/manage/status";
const bingURL = baseURL + "/bing";
const loginURL = baseURL + "/manage/admin/login";
const logoutURL = baseURL + "/manage/admin/logout";
const tokenVerifyURL = baseURL + "/manage/token/verify";
const getSchoolListURL = baseURL + "/manage/school/list";
const getShopListURL = baseURL + "/manage/shop/list";
const getItemListURL = baseURL + "/manage/item/list";
const addSchoolListURL = baseURL + "/manage/school/add";
const addShopListURL = baseURL + "/manage/shop/add";
const addItemListURL = baseURL + "/manage/item/add";
const deleteSchoolURL = baseURL + "/manage/school/delete";
const deleteShopURL = baseURL + "/manage/shop/delete";
const deleteItemURL = baseURL + "/manage/item/delete";


// 处理URL查询参数
function getQueryArgs(urlQueryStr){
    var qs = (urlQueryStr.length > 0 ? urlQueryStr.substring(urlQueryStr.indexOf('?')).substr(1) : ''),
        //保存每一项
        args = {},
        //得到每一项
        items = qs.length ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;

    for(i = 0;i<len ;i++){
        item = items[i].split('='),
        name = decodeURIComponent(item[0])
        value = decodeURIComponent(item[1])
        if(name.length){
            args[name] = value;
        }
    }
    return args;
}