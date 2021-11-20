// 主页js

timeLoad();
bindAction()

// 时间判断
function timeLoad() {
    let date = new Date();
    let hour = date.getHours();
    let greet = document.getElementById('time-greet');
    if (5 > hour && hour >= 0) {
        greet.innerHTML = "深夜好"
    } else if (8 > hour && hour >= 5) {
        greet.innerHTML = "早上好"
    } else if (11 > hour && hour >= 8) {
        greet.innerHTML = "上午好"
    } else if (14 > hour && hour >= 11) {
        greet.innerHTML = "中午好"
    } else if (18 > hour && hour >= 14) {
        greet.innerHTML = "下午好"
    } else if (24 > hour && hour >= 18) {
        greet.innerHTML = "晚上好"
    }
}

function bindAction () {

    // 一键单抽
    document.getElementById('random-oneclick').addEventListener('click', async (e)=>{
        result = await getRandom('food');
        if (!result) return;
        showResult(result);
    })
    
    // 十连抽
    document.getElementById('random-10pulls').addEventListener('click', async (e)=>{
        result = await getRandom('food', {count: 10});
        console.log(result)
    })
    // 按标签抽
    document.getElementById('random-bytag').addEventListener('click', async (e)=>{
        mdui.prompt('请输入标签: (如:中餐)', '按标签抽卡', async (keyword) => {
            result = await getRandom('food', {type: 1, keyword});
            console.log(result)
        });
    })
    // 按店铺抽
    document.getElementById('random-byshop').addEventListener('click', async (e)=>{
        result = await getRandom('food');
        console.log(result)
    })

}

// 抽卡
async function getRandom (itemType, params) {
    result = await axios({
        method: 'get',
        url: getURL + '/' + itemType,
        params,
        }).then((resp)=>{return resp.data})
    if (result.code != 100) {
        mdui.alert(result.msg);
        return 0;
    }
    return result;
}

// 显示结果
async function showResult (result) {

}