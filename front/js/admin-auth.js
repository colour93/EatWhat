// 验证登录态

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
        }
        if (err.response.status == 404) {
            $('#addNewModal').modal('hide');
            $('#alertMsg').text(err.response.data.msg);
            $('#alertModal').modal();
            return err;
        }
    });

// 初始化axios跨域凭证设置
axios.defaults.withCredentials = true;

// 登出操作
async function logout () {
    window.location.href = logoutURL;
}

$('#logout-a').click((e)=>{
    logout();
})