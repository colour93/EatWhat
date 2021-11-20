// 前台前端通用js

// API地址初始化
const baseURL = 'http://127.0.0.1:3000';
const getURL = baseURL + '/get';

// 添加navbar监听器
document.getElementsByClassName('mdui-bottom-nav')[0].addEventListener('change.mdui.bottomNav', (e)=>{
    const {index} = e._detail;
    switch (index) {
        case 0:
            window.location.href = '/'
            break;
        case 1:
            window.location.href = '/me.html'
            break;
    }
})
