// 仪表板js

// 读取状态数据
loadStatus();

async function loadStatus () {

    statusInfo = await axios.get(statusURL)
        .then((resp)=>{
            return resp.data;
        })

    $('#schoolCount-number').text(statusInfo.data.schoolCount);
    $('#shopCount-number').text(statusInfo.data.shopCount);
    $('#apiTodayCount-number').text(statusInfo.data.apiTodayCount);
    $('#apiTotalCount-number').text(statusInfo.data.apiTotalCount);
}