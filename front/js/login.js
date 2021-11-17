// 登陆页面

let imgUrl, redirectPath;

// 获取重定向路径
redirectPath = decodeURI(getQueryArgs(window.location.search).redirect);

// 加载背景
axios.get(bingURL)
    .then((resp)=>{
        console.log(resp.data)
        imgUrl = resp.data.data.url;
        $('.login-page').css('background', `url("${imgUrl}") center center no-repeat fixed`)
    })

// 登录
async function login() {

    // 初始化变量
    let user = $('#user-input').val(),
        pwd = $('#pwd-input').val();
    
    // 发请求
    result = await axios({
        method: 'post',
        url: loginURL,
        data: {
            user, pwd
        }
    }).then((resp)=>{
        return resp.data;
    })

    // 判断状态码
    if (result.code != 100) {
        $('#alertMsg').text(result.msg);
        $('#alertModal').modal();
        return;
    }

    // 判断重定向
    if (!redirectPath || redirectPath == 'undefined') {
        window.location.href = tokenVerifyURL + `?token=${result.data.token}&redirect=/manage`
    } else {
        window.location.href = tokenVerifyURL + `?token=${result.data.token}&redirect=${redirectPath}`;
    }
}