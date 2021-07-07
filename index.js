// 吃点啥子 v1.1 By 玖叁 即兴所作
// GitHub colour93
// 需要axios作为前置，mdui可选（模态框）

// 初始化全局变量
var count = 0;
var btnBox1;
var food;
var drink;
var num;
var str;
var interval;
var stopBtn;
var type;
var infoBox;
var inst;

// 窗口初始化
window.onload = () => {
    // 绑定DOM
    btnBox1 = document.getElementById('btn-1');
    btnBox2 = document.getElementById('btn-2');
    retryBtn = document.getElementById('retry');
    stopBtn = document.getElementById('stop');
    str = document.getElementById('str');
    infoBox = document.getElementById('info');
    inst = new mdui.Dialog('#dialog');


    // 获取列表
    axios
        .get('db.json')
        .then((res)=>{
            food = res.data.food;
            drink = res.data.drink;
        });
    // 是的，我压根没写如果获取不到咋办，因为不会发生这种情况（？


};

// 吃啥
const eatWhat = () => {
    if (count>=3) {
        inst.open();
        return;
    };
    count++;
    interval = setInterval(()=>{
        num = randomNum(0, food.length-1);
        str.innerHTML = food[num]
    }, 50);
    type = "food";
    btnBox2.style.display = "flex";
    btnBox1.style.display = "none";
    retryBtn.style.display = "none";
    stopBtn.style.display = "flex";
};

// 喝啥
const drinkWhat = () => {
    if (count>=3) {
        inst.open();
        return;
    };
    count++;
    interval = setInterval(()=>{
        num = randomNum(0, drink.length-1);
        str.innerHTML = drink[num]
    }, 50);
    type = "drink";
    btnBox2.style.display = "flex";
    btnBox1.style.display = "none";
    retryBtn.style.display = "none";
    stopBtn.style.display = "flex";
};

// 停止
const stop = () => {
    clearInterval(interval);
    stopBtn.style.display = "none";
    retryBtn.style.display = "flex";
};

// 再来（贪得无厌
const retry = () => {
    switch (type) {
        case 'food':
            infoBox.innerHTML = "我看你啥都别吃了。";
            eatWhat();
            break;
    
        case 'drink':
            infoBox.innerHTML = "我看你啥都别喝了。";
            drinkWhat();
            break;
    }
};

// 随机数
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        default: 
            return 0; 
    };
};