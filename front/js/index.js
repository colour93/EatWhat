// 主页js

showIndex(1);
bindAction();

window.onload = () => {
    console.log('aaaa')
}


// 时间判断
function timeLoad() {
    let date = new Date();
    let hour = date.getHours();
    let greet = document.getElementById('line-1');
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

// 绑定动作
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
        if (!result) return;
        showResult(result);    })
    // 按标签抽
    document.getElementById('random-bytag').addEventListener('click', async (e)=>{
        mdui.prompt('请输入标签: (如:中餐)', '按标签抽卡', async (keyword) => {
            result = await getRandom('food', {type: 1, keyword});
            if (!result) return;
            showResult(result);
        });
    })
    // 按品名抽
    document.getElementById('random-byitem').addEventListener('click', async (e)=>{
        mdui.prompt('请输入品名: (如:三杯鸡)', '按品名抽卡', async (keyword) => {
            result = await getRandom('food', {type: 3, keyword});
            if (!result) return;
            showResult(result);
        });
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

// 显示主页
async function showIndex (i) {

    if (!i) {
        window.location.href = "#";
    }
    
    document.getElementsByClassName("main-content")[0].style.display = 'flex';
    document.getElementsByClassName("result-content")[0].style.display = 'none';

    document.getElementsByClassName('mdui-toolbar')[0].innerHTML = `<div class="mdui-toolbar-spacer"></div><a href="javascript:;" class="mdui-typo-headline">吃点什么</a><div class="mdui-toolbar-spacer"></div>`

    timeLoad();
    document.getElementById('line-2').innerHTML = "今天吃点什么？";

}

// 显示结果
async function showResult (result) {

    window.location.href = "#result";

    document.getElementsByClassName("main-content")[0].style.display = 'none';
    document.getElementsByClassName("result-content")[0].style.display = 'block';

    document.getElementById("line-1").innerHTML = "抽卡结果";
    document.getElementById("line-2").innerHTML = "";

    document.getElementsByClassName('mdui-toolbar')[0].innerHTML = `<a href="javascript:;" class="mdui-btn mdui-btn-icon" onclick="showIndex()"><i class="mdui-icon material-icons">chevron_left</i></a>`

    let {data} = result;
    let inner = '';
    for (let i = 0; i < data.length; i++) {
        const e = data[i];
        inner += `<div class="glass-box glass-box-result">`;
        inner += `<p class="glass-box-result result-itemName">${e.food.itemName}</p>`;
        inner += `<p class="glass-box-result result-shopName">${e.shopName}</p>`;
        inner += `<p class="glass-box-result result-price">${e.food.price}</p>`;
        inner += `</div>`;
    }
    document.getElementsByClassName('result-content')[0].innerHTML = inner;
    
}