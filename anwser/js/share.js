;(function(designWidth, maxWidth) {     //PX rem转换
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

$(document).ready(function() {
	if (userid && ostype && achvId) {
		$.ajax({
			type: "get",
			async: false,
			url: rednetURl+"/rednetMoment-http/rednetApi.opx?param={%22header%22:{%22userId%22:%22"+ userid +"%22,%22version%22:%22" + appversion + "%22},%22method%22:%22selectAnswerAchvInfo%22,%22myParams%22:[" +achvId+ "],%22service%22:%22cn.rednet.moment.services.AnswerApi%22,%22uuid%22:%22" + uuid + "%22}",
			dataType: "jsonp",
			jsonp: "jsoncallback",
			jsonpCallback: "success_jsonpCallback",
			success: function(json) {
				var obj = eval(json);
				var data = obj.body;
				if (data) {
					if (data.status == "1") {
						withData(data);
					} else {
						withoutData();
					}
				}
				//$("body, html").show();
			}
		});
	} else {
		withoutData();
		//$("body, html").show();
	}
    
});

function withData(data) {
	 var rate = data.winRate;
	$(".result_rank").html(data.achvRank);
	$(".result_correctRate").html(parseInt(data.correctCount*100/data.questionCount)+"%");
	$(".result_time").html(formatDuring(data.utilityTime));
	$(".result_winRate").html(data.winRate + "%");
	$(".download").click(function() {
		openApp();
	});
}

function withoutData() {
	$(".main").addClass("withoutData");
	$(".participate").css("top","3.16rem");
	$(".download").css("top","38.02rem");
	$(".hiddenLink").css("top","31.34rem");
	$(".code").css("top","34.47rem");
	$(".download").click(function() {
		openApp();
	});
}

var  formatDuring = function(mss) {
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = parseInt((mss % (1000 * 60)) / 1000);
    return (hours < 10 ? "0" + hours :hours )  + ":" + (minutes < 10 ? "0" + minutes :minutes )+ ":" + (seconds < 10 ? "0" +seconds :seconds);
};