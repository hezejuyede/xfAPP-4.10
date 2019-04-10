export function timer() {
    let hour, minute, second,millisecond;
    hour = minute = second=millisecond = 0;
    setInterval(timerTime(),50);
    function timerTime() {
        millisecond = millisecond + 50;
        if (millisecond >= 1000) {
            millisecond = 0;
            second = second + 1;
        }
        if (second >= 60) {
            second = 0;
            minute = minute + 1;
        }
        if (minute >= 60) {
            minute = 0;
            hour = hour + 1;
        }
        let nowTime = hour + hour + '时' + minute + '分' + second + '秒';
        let id = document.getElementById("cumulativeLoginTime");
        id.innerHTML = nowTime
    }
}


export function getNowTime() {
   let time = new Date().getTime()-24*60*60*1000;
    let date = new Date(time);
    let HG = '-';
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let days = date.getDate();



    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (days >= 0 && days <= 9) {
        days = "0" + days;
    }

    let NowDate = year + HG + month + HG + days;
    return NowDate;
}

export function disableHistory (url) {
    //防止页面后退
    history.pushState(null, null, url);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, url);
    })
}
