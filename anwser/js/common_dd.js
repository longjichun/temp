var userid = getUrlParam("userid"),achvId = getUrlParam("achvId"), ostype = getUrlParam("ostype"), appversion = getUrlParam("appversion"), uuid = getUrlParam("uuid"), isApp = true, isOld = false;

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
		// window.location.href = "share.html";
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