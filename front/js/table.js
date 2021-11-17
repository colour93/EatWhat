// 店铺列表载入

// 初始化变量
let list = {};
let ary = [];
let table;

loadData()

// 验证cookie中的token是否有效

function test() {
    $('#alertModal').modal();
}

// 添加数据
async function addNew () {

    if (!$("#addNewForm")[0].checkValidity()) {
        return;
    };

    switch (window.location.pathname) {

        // 学校页面
        case '/manage/school.html':
            let schoolName = $('#schoolName-input').val(),
                keywords = $('#keywords-input').val();
            result = await axios({
                method: 'post',
                url: addSchoolListURL,
                data: {
                    schoolName,
                    keywords
                }
            }).then((resp)=>{
                return resp.data;
            });

            // 判断返回值
            if (result.code!=100) {
                $('#addNewModal').modal('hide');
                $('#alertMsg').text(result.msg);
                $('#alertModal').modal();
                return;
            };

            // 格式化输出关键词字符串
            keywordStr = '';
                for (let i = 0; i < result.data.keywords.length; i++) {
                    const f = result.data.keywords[i];
                    if (i==result.data.keywords.length-1){
                        keywordStr += f ;
                    } else {
                        keywordStr += f + ', ';
                    };
                }

            // 插入行
            table.row.add([
                result.data.schoolId,
                result.data.schoolName,
                keywordStr,
                `<a href="#">修改</a> <a href="javascript:void(0);" id="delete${result.data.schoolId}">删除</a>`
            ]).draw();

            // 添加监听
            $(`a#delete${result.data.schoolId}`).click((e)=>{
                deleteData(e.schoolId);
            })
            $('#addNewModal').modal('hide');
            break;
    

        // 店铺页面
        case '/manage/shop.html':
            let shopName = $('#shopName-input').val(),
                schoolId = $('#school-select').val(),
                tag = $('#tag-input').val(),
                delivery = $('span.checked input').val();
            console.log(shopName, schoolId, tag, delivery);
            result = await axios({
                method: 'post',
                url: addShopListURL,
                data: {
                    shopName,
                    schoolId,
                    tag,
                    delivery
                }
            }).then((resp)=>{
                return resp.data;
            });

            // 判断返回值
            if (result.code!=100) {
                $('#addNewModal').modal('hide');
                $('#alertMsg').text(result.msg);
                $('#alertModal').modal();
                return;
            };

            // 格式化输出关键词字符串
            tagStr = '';
                for (let i = 0; i < result.data.tag.length; i++) {
                    const f = result.data.tag[i];
                    if (i==result.data.tag.length-1){
                        tagStr += f ;
                    } else {
                        tagStr += f + ', ';
                    };
                }

            // 外卖支持
            let isDelivery;
            if (result.data.delivery) {
                isDelivery = "是";
            } else {
                isDelivery = "否";
            }

            // 插入行
            table.row.add([
                result.data.shopId,
                result.data.shopName,
                result.data.schoolName,
                tagStr,
                isDelivery,
                `<a href="/manage/item.html?shopId=${result.data.shopId}">查看</a> <a href="javascript:void(0);">修改</a> <a href="javascript:void(0);" id="delete${result.data.shopId}">删除</a>`
            ]).draw();

            // 添加监听
            $(`a#delete${result.data.shopId}`).click((e)=>{
                deleteData(result.data.shopId);
            })
            $('#addNewModal').modal('hide');
            break;

        
        // 商品页面
        case '/manage/item.html':

            // 初始化变量
            let {shopId} = getQueryArgs(window.location.search),
                itemName = $('#itemName-input').val(),
                price = $('#price-input').val(),
                type = $('span.checked input').val();

            result = await axios({
                method: 'post',
                url: addItemListURL,
                data: {
                    shopId,
                    itemName,
                    price,
                    type
                }
            }).then((resp)=>{
                return resp.data;
            });

            // 判断返回值
            if (result.code!=100) {
                $('#addNewModal').modal('hide');
                $('#alertMsg').text(result.msg);
                $('#alertModal').modal();
                return;
            };

            // 插入行
            table.row.add([
                result.data.new.itemId,
                result.data.new.itemName,
                result.data.newType,
                result.data.shopName,
                result.data.schoolName,
                result.data.new.price,
                `<a href="#">修改</a> <a href="javascript:void(0);" id="delete${result.data.new.itemId}">删除</a>`
            ]).draw();

            // 添加监听
            $(`a#delete${result.data.new.itemId}`).click((e)=>{
                deleteData(result.data.new.itemId);
            })
            $('#addNewModal').modal('hide');
            break;

        default:
            break;
    }
}

// 载入数据
async function loadData () {

    switch (window.location.pathname) {

        // 学校页面
        case '/manage/school.html':
            list = await axios.get(getSchoolListURL)
                .then((resp)=>{
                    return resp.data.data;
                });
            
            for (let i = 0; i < list.length; i++) {
                const e = list[i];
                keywordStr = '';
                for (let i = 0; i < e.keywords.length; i++) {
                    const f = e.keywords[i];
                    if (i==e.keywords.length-1){
                        keywordStr += f ;
                    } else {
                        keywordStr += f + ', ';
                    };
                }
                ary.push([
                    e.schoolId,
                    e.schoolName,
                    keywordStr,
                    `<a href="javascript:void(0);" id="update${e.schoolId}">修改</a> <a href="javascript:void(0);" id="delete${e.schoolId}">删除</a>`
                ]);
            }
            table = await $('#table').DataTable({
                data: ary,
                createdRow: (nRow, aData, iDataIndex) => {
                    console.log(`r${aData[0]}`);
                    $(nRow).attr('id', `r${aData[0]}`);
                },
            });

            // 添加监听器
            for (let i = 0; i < list.length; i++) {
                const e = list[i];
                $(`a#delete${e.schoolId}`).click((f)=>{
                    // event.preventDefault();
                    console.log(this.text);
                    deleteData(e.schoolId);
                });
                
            }
            break;

        // 店铺页面
        case '/manage/shop.html':

            // 获取学校列表
            schoolList = await axios.get(getSchoolListURL)
                .then((resp)=>{
                    return resp.data.data;
                })
            
            // 装填select
            for (let i = 0; i < schoolList.length; i++) {
                const e = schoolList[i];
                $('select#school-select').prepend(`<option value="${e.schoolId}">${e.schoolName}</option>`);
            };


            list = await axios.get(getShopListURL)
                .then((resp)=>{
                    return resp.data.data;
                });
            for (let i = 0; i < list.length; i++) {
                const e = list[i];
        
                // tag格式化
                tagStr = '';
                for (let i = 0; i < e.tag.length; i++) {
                    const f = e.tag[i];
                    if (i==e.tag.length-1){
                        tagStr += f ;
                    } else {
                        tagStr += f + ', ';
                    };
                }
        
                // 外卖支持
                let isDelivery;
                if (e.delivery) {
                    isDelivery = "是";
                } else {
                    isDelivery = "否";
                }
        
                ary.push([
                    e.shopId,
                    e.shopName,
                    e.schoolName,
                    tagStr,
                    isDelivery,
                    `<a href='/manage/item.html?shopId=${e.shopId}'>查看</a> <a href="javascript:void(0);" id="update${e.shopId}">修改</a> <a href="javascript:void(0);" id="delete${e.shopId}">删除</a>`
                ]);
            }

            // 初始化表格
            table = await $('#table').DataTable({
                data: ary,
                createdRow: (nRow, aData, iDataIndex) => {
                    console.log(`r${aData[0]}`);
                    $(nRow).attr('id', `r${aData[0]}`);
                },
            });

            // 添加监听器
            for (let i = 0; i < list.length; i++) {
                const e = list[i];
                $(`a#delete${e.shopId}`).click((f)=>{
                    deleteData(e.shopId);
                });
                
            }
            break;

        // 商品页面
        case '/manage/item.html':

            // 获取查询字符串
            let query = getQueryArgs(window.location.search);
            if (!window.location.search) {
                alert("请先到店铺页面选择店铺");
                return;
            }
            let {shopId} = query;

            // 发送请求
            list = await axios.get(getItemListURL, {
                params: {
                    shopId
                }
            })
                .then((resp)=>{
                    return resp.data.data;
                });

            // console.log(list);

            // 循环datalist
            // 食品
            for (let i = 0; i < list.food.length; i++) {
                const food = list.food[i];
                ary.push([
                    food.itemId,
                    food.itemName,
                    "食品",
                    list.shopName,
                    list.schoolName,
                    food.price,
                    `<a href="javascript:void(0);" id="update${food.itemId}">修改</a> <a href="javascript:void(0);" id="delete${food.itemId}">删除</a>`
                ]);
            };
            for (let i = 0; i < list.drink.length; i++) {
                const drink = list.drink[i];
                ary.push([
                    drink.itemId,
                    drink.itemName,
                    "饮品",
                    list.shopName,
                    list.schoolName,
                    food.price,
                    `<a href="javascript:void(0);" id="update${drink.itemId}">修改</a> <a href="javascript:void(0);" id="delete${drink.itemId}">删除</a>`
                ]);
            };

            // 初始化表格
            table = await $('#table').DataTable({
                data: ary,
                createdRow: (nRow, aData, iDataIndex) => {
                    console.log(`r${aData[0]}`);
                    $(nRow).attr('id', `r${aData[0]}`);
                },
            });

            // 添加监听器
            for (let i = 0; i < ary.length; i++) {
                const e = ary[i];
                $(`a#delete${e[0]}`).click((f)=>{
                    deleteData(e[0]);
                });
                
            }
            break;
    
        default:
            break;
    }
}

// 删除
async function deleteData (id, confirm) {

    // 初始化变量
    let requestURL,
        data = {};

    // 确定框
    if (!confirm) {
        $('#confirm-delete-btn').click((e)=>{
            deleteData(id, 1);
            return;
        });
        $('#confirmModal').modal();
        return;
    } else if (confirm==-1){
        return;
    }
    
    switch (window.location.pathname) {

        // 学校删除
        case '/manage/school.html':
            requestURL = deleteSchoolURL;
            data = {
                schoolId: id
            };
            break;

        // 店铺删除
        case '/manage/shop.html':
            requestURL = deleteShopURL;
            data = {
                shopId: id
            };
            break;

        // 商品删除
        case '/manage/item.html':
            requestURL = deleteItemURL;
            data = {
                itemId: id
            };
            break;

        default:
            return;
        }
        result = await axios({
            method: 'delete',
            url: requestURL,
            data
        })
            .then((resp, err)=>{
                if (err && err.response.status!=200) {
                    return;
                };
                return resp.data;
            })
        console.log(result);
        if (result.code==100) {
            // 获取行id，重绘
            table.row(`tr#r${id}`).remove().draw();
        }

    $('#confirmModal').modal('hide');
}