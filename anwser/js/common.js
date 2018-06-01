function alert(str){
    $(".alertinfo span").html(str)
    $(".alert-mask").show()
    $(".alertsure").off("click").on("click",function(){
        $(".alert-mask").hide()
    })
}

var userid = getUrlParam("userid"),achvId = getUrlParam("achvId"), ostype = getUrlParam("ostype"), appversion = getUrlParam("appversion"), uuid = getUrlParam("uuid"), isApp = true, isOld = false;
if (ostype == "ios") {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", "js/js4ios.min.js");
    if (typeof fileref != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}
if(sessionStorage.getItem("loginId")){
    userid = sessionStorage.getItem("loginId");
}

if (userid != null && ostype != null) { //用于新版本，从url中获取userid
} else { //用于老版本，从url中获取userid
    var longurl, android, ios;
    longurl = window.location.href;
    android = longurl.indexOf("android");
    ios = longurl.indexOf("ios");
    if (longurl.indexOf("userid") > -1) {
        if (android > 0) {
            userid = longurl.split("=")[2];
            ostype = "android";
        } else if (ios > 0) {
            userid = longurl.split("&")[2];
            ostype = "ios";
        }
    }
}

if (appversion && appversion != "null") { //客户端内判断依据
    if (appVersion("3.1")) { //android 3.1以上添加的UUID
        if (uuid && uuid != "null") { //需要继续判断是否是在客户端内
            if (ostype == "android") { //android需要特殊判断
                if ((typeof jsBridge) != "undefined") { //客户端内不处理
                    isApp = true;
                } else { //客户端外强制跳转活动分享页
                    // window.location.href = "share.html";
                }
            } else { //iOS不需要特殊判断
                isApp = true;
            }
        }
    } else {
        isOld = true;
    }
} else { //客户端外强制跳转活动分享页
    var longurl = window.location.href;
    if (longurl.indexOf("share.html") > -1) { //三级主界面不跳转
    } else {
        //window.location.href = "share.html";
    }
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (null != r) {
        return unescape(r[2]);
    } else {
        return null; //返回参数值
    }
}

//判断版本号
function appVersion(version) {
    if (appversion) {
        if (appversion == version) {
            return true;
        } else {
            var appversions = appversion.split("."), versions = version.split(".");
            for (var i = 0, j = versions.length; i < appversions.length; i++) {
                if (Number(appversions[i]) > Number(versions[i])) {
                    return true;
                } else if (Number(appversions[i]) < Number(versions[i])) {
                    return false;
                }
            }
        }
    } else {
        return false;
    }
}

//判断当前设备类型（PC、mobile）
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function startYRotate() {
    var i = $(".open>img")[0];
    degree = degree + 5;
    i.style.transform = "rotateY(" + degree + "deg)";
    i.style.webkitTransform = "rotateY(" + degree + "deg)";
    i.style.OTransform = "rotateY(" + degree + "deg)";
    i.style.MozTransform = "rotateY(" + degree + "deg)";
    if (degree == 360) {
        degree = 0;
    }
}

function getDate(timeStamp) {
    var date = new Date(timeStamp);
    return date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
}

function getNumber(number, pn) {
    var sign = "";
    if (pn) {
        sign = (number >= 0) ? "+" : "-";
        number = Math.abs(number);
    }
    number = number + "";
    if (number.indexOf(".") > -1) {
        var numbers = number.split(".");
        if (numbers[1].length == 1) {
            numbers[1] += "0";
        }
        number = numbers.join(".");
    } else {
        number += ".00";
    }
    return sign + number;
}

$.fn.visibleHeight = function() {
    var win = $(window);
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();
    return viewport.bottom - bounds.top;
};





(function(designWidth, maxWidth) {     //PX rem转换
    var doc = document,
        win = window,
        docEl = doc.documentElement,
        remStyle = document.createElement("style"),
        tid;

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        maxWidth = maxWidth || 540;
        width>maxWidth && (width=maxWidth);
        var rem = width * 100 / designWidth;
        remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
    }

    if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(remStyle);
    } else {
        var wrap = doc.createElement("div");
        wrap.appendChild(remStyle);
        doc.write(wrap.innerHTML);
        wrap = null;
    }
    //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
    refreshRem();

    win.addEventListener("resize", function() {
        clearTimeout(tid); //防止执行两次
        tid = setTimeout(refreshRem, 300);
    }, false);

    win.addEventListener("pageshow", function(e) {
        if (e.persisted) { // 浏览器后退的时候重新计算
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === "complete") {
        doc.body.style.fontSize = "16px";
    } else {
        doc.addEventListener("DOMContentLoaded", function(e) {
            doc.body.style.fontSize = "16px";
        }, false);
    }
})(750, 750);

/* 倒计时计算函数 */
function getTime(startTime) {
    var date = new Date(startTime), now = new Date();
    var ms = date.getTime() - now.getTime();

    var hour = Math.floor(ms / (1000 * 60 * 60));
    var ms_ = ms % (1000 * 60 * 60);
    var minute = Math.floor(ms_ / (1000 * 60));
    var second = Math.round(ms % (1000 * 60) / 1000);

    return {hour:hour,minute:minute,second:second,ms:ms};
}

var Utils={
    /*
        单位
    */
    units:'个十百千万@#%亿^&~',
    /*
        字符
    */
    chars:'零一二三四五六七八九',
    /*
        数字转中文
        @number {Integer} 形如123的数字
        @return {String} 返回转换成的形如 一百二十三 的字符串
    */
    numberToChinese:function(number){
        var a=(number+'').split(''),s=[],t=this;
        if(a.length>12){
            throw new Error('too big');
        }else{
            for(var i=0,j=a.length-1;i<=j;i++){
                if(j==1||j==5||j==9){//两位数 处理特殊的 1*
                    if(i==0){
                        if(a[i]!='1')s.push(t.chars.charAt(a[i]));
                    }else{
                        s.push(t.chars.charAt(a[i]));
                    }
                }else{
                    s.push(t.chars.charAt(a[i]));
                }
                if(i!=j){
                    s.push(t.units.charAt(j-i));
                }
            }
        }
        //return s;
        return s.join('').replace(/零([十百千万亿@#%^&~])/g,function(m,d,b){//优先处理 零百 零千 等
            b=t.units.indexOf(d);
            if(b!=-1){
                if(d=='亿')return d;
                if(d=='万')return d;
                if(a[j-b]=='0')return '零'
            }
            return '';
        }).replace(/零+/g,'零').replace(/零([万亿])/g,function(m,b){// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
            return b;
        }).replace(/亿[万千百]/g,'亿').replace(/[零]$/,'').replace(/[@#%^&~]/g,function(m){
            return {'@':'十','#':'百','%':'千','^':'十','&':'百','~':'千'}[m];
        }).replace(/([亿万])([一-九])/g,function(m,d,b,c){
            c=t.units.indexOf(d);
            if(c!=-1){
                if(a[j-c]=='0')return d+'零'+b
            }
            return m;
        });
    }
};

/**
 * 获取格式化后的时间字符串
 * @param mss=>毫秒
 */

function formatDuring(mss) {
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.round((mss % (1000 * 60)) / 1000);

    // seconds = seconds.toFixed(2);
    return (hours < 10 ? "0" + hours :hours )  + ":" + (minutes < 10 ? "0" + minutes :minutes )+ ":" + (seconds < 10 ? "0" +seconds :seconds);
};