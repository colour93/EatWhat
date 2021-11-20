// 前台前端通用js

// API地址初始化
const baseURL = `http://${window.location.hostname}:3000`;
const getURL = baseURL + '/get';

// 添加navbar监听器
document.getElementsByClassName('mdui-bottom-nav')[0].addEventListener('change.mdui.bottomNav', (e)=>{
    const {index} = e._detail;
    switch (index) {
        case 0:
            window.location.href = '/'
            break;
        case 1:
            // window.location.href = '/me.html'
            mdui.alert("功能正在加急制作中\n稍后开放", "咕咕咕");
            break;
    }
})
