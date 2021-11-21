// 前台前端通用js

// API地址初始化
const baseURL = `http://${window.location.hostname}:9519`;
const getURL = baseURL + '/get';

// 初始化axios拦截器
axios.interceptors.response.use(
    (res) => {
        return res;
    } , 
    (err) => {
        if (err.response.status == 401) {
            // URLenocde当前pathname,方便重定向
            pn = encodeURI(window.location.pathname);
            window.location.href = loginPageURL + `?redirect=${pn}`;
        } else {
            mdui.alert(err.response.data.msg);
        }
    });

// 初始化axios跨域凭证设置
axios.defaults.withCredentials = true;

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
