var BASEURL = 'http://test.app.onlyred.net/';
var bathpath = 'rednetMoment-http/rednetApi.opx?param='
window.onerror = function(err){
//  alert(err)
}
var anwserGapTime = 500;

var activId = 19

var UUID = uuid;

function needLogin() {
    // 没有 userid. // 先处理在客户端的情况 
    if( confirm("检测到您尚未登录时刻app，是否现在去登录？") ) {
        if (ostype == "android") {
            verifyJsBridge.postNotification('requireUserToLogin', '{}');
        } else if (ostype == "ios") {
            jsBridge.postNotification('requireUserToLogin', '{}');
        }    
    } else {

    }
}

if(userid == '-1') {
    needLogin()
}

function transferUserDataToWeb(uid,urid,token){
    userid = urid;
    // jsBridge  使用的 勿删
    if(urid == "-1"){
        return;
    }else{
        sessionStorage.setItem("loginId",userid);
    }
}


var baseParam = {
    "header": {"userId":userid,"version":"6.0"},
    "service": "cn.rednet.moment.services.AnswerApi",
    "uuid": UUID
}





var userStatus, questionStatus ;
(function init() {
    var initParam = {myParams: [activId]};
    $.extend(initParam, baseParam, { "method": "answerInfo"} )
    var d = new Date().getTime()
    try{
        jsonpReq(initParam,function(res){
            questionStatus = res.status;
            userStatus = res.enrollStatus;
            ifInAnwserPeriod();
            router();
        },function(err,url){
            
        })    
    } catch(error){
        console.log(error)
        ifInAnwserPeriod()
    }
}());

function ifInAnwserPeriod() {
    if( questionStatus != 1) {
        if( questionStatus == 3) {
            $("#startAnser").html("当天已经完成了答题");
        } else {
            $("#startAnser").html("不在答题时段内");               
        }
    } else {

    }
}

(function(){
    // 开始首页
    var startTime = new Date('2018-05-06 18:01:00').getTime()
    var str = ['<i>','','</i>','时','<i>','','</i>','分','<i>','','</i>','秒'];
    setTimeout(function rerender(){
        var currentTime = new Date().getTime();
        var sub = startTime - currentTime;
        if(sub>0) {
            var d = new Date(sub)
            str[1] = d.getUTCHours() + 24*parseInt(sub/(24*60*60*1000));
            str[5] = d.getMinutes()
            str[9] = d.getSeconds()
            $("#startAnser").html(str.join("")).addClass("to-anwser")
            setTimeout(rerender,1000)
        } else {
            $("#startAnser").removeClass("to-anwser").html("开始答题")
        }
    },1000)
});


/*路由*/
function router() {


    $("#startAnser").on("click",function(){
        if(userid == '-1') {
            needLogin();
            return;
        }
        if(questionStatus != 1) {
            return;
        } else {
            // 在答题时段
            if( userStatus == 1 ) {             // ------------------ 绕过注册信息 直接答题
                // 已报名
                $("section").hide()
                $("#sec3").show()
            } else {
                // 填写报名信息
                $("section").hide()
                $("#sec2").show()
            }
            
        }
        
    })

    $(".btn-reanwser").click(function(){
        clearT();
    runAnwser();
        $("section").hide()
        $("#sec3").show()
        totalTime()
    })
}
/*路由*/


/* 工具函数 */
function jsonpReq(param,succfn,failfn) {
    $.ajaxSetup({
        scriptCharset: "utf-8",
        contentType: "application/json; charset=utf-8"
    });
    var url = encodeURIComponent(BASEURL+bathpath+JSON.stringify(param) )
    url = BASEURL+bathpath+JSON.stringify(param)
     $.ajax({
        url: url ,
        type: "get",
        dataType:"jsonp",
        jsonp: 'jsoncallback',
        jsonpCallback:"success_jsonpCallback",
        success: function(res){
            var body = strTojson(res.body);
            succfn(body,url)
        },
        error: function(err,url){
            failfn(err,url)
        }
    })   
}

function fillNum(n) {
    if(isNaN(n)) {
        return '00'
    }
    if(n<10) {
        return '0'+n;
    } else {
        return n;
    }
}
function formatTime(n) {
    var h = parseInt(n/3600)
        m = parseInt(n/60)
        s = n%60;
    return fillNum(h) +':'+ fillNum(m)+ ':' + fillNum(s)
}
function strTojson(str) {
    if(typeof str == 'string') {
        return JSON.parse(str)
    } else {
        return str;
    }
}
/* 工具函数 end */

(function personalInfo(){
    /* 表单信息*/
    var arr = [ 
                {"child":["请选择所在的区域"]},
                {"child":["芙蓉区","天心区","岳麓区","开福区","雨花区","长沙县","望城区","宁乡市","浏阳市","长沙县网上群众工作部"],"royal":"长沙"},
                {"child":["荷塘区","芦淞区","石峰区","天元区","株洲县","攸县","茶陵县","炎陵县","醴陵市","云龙区"],"royal":"株洲"},
                {"child":["雨湖区","岳塘区","湘潭县","湘乡市","韶山市","昭山示范区"],"royal":"湘潭"},
                {"child":["雁峰区","珠晖区","蒸湘区","南岳区","石鼓区","衡阳县","衡南县","衡山县","衡东县","祁东县","耒阳市","常宁市"],"royal":"衡阳"},
                {"child":["双清区","大祥区","北塔区","邵东县","新邵县","邵阳县","隆回县","洞口县","绥宁县","新宁县","城步县","武冈市"],"royal":"邵阳"},
                {"child":["岳阳楼区","云溪区","君山区","岳阳县","华容县","湘阴县","平江县","汨罗市","临湘市"],"royal":"岳阳"},
                {"child":["资阳区","赫山区","南县","桃江县","安化县","沅江市"],"royal":"益阳"},
                {"child":["娄星区","双峰县","新化县","冷水江市","涟源市"],"royal":"娄底"},
                {"child":["武陵区","鼎城区","安乡县","汉寿县","澧县","临澧县","桃源县","石门县","津市"],"royal":"常德"},
                {"child":["北湖区","苏仙区","桂阳县","宜章县","永兴县","嘉禾县","临武县","汝城县","桂东县","安仁县","资兴市"],"royal":"郴州"},
                {"child":["零陵区","冷水滩区","祁阳县","东安县","双牌县","道县","江永县","宁远县","蓝山县","新田县","江华县","金洞管理区","回龙圩管理区"],"royal":"永州"},
                {"child":["鹤城区","中方县","沅陵县","辰溪县","溆浦县","会同县","麻阳县","新晃县","芷江县","靖州县","通道县","洪江市","洪江区"],"royal":"怀化"},
                {"child":["吉首市","泸溪县","保靖县","古丈县","永顺县","龙山县","凤凰县","花垣县"],"royal":"湘西"},
                {"child":["永定区","武陵源区","慈利县","桑植县"],"royal":"张家界"}
        ];
    var optCache = ['<option value="0">请选择您所在的区县</option>'];
    $("#royal").on("change",function(v,n){
        var ind = $(this).val();
        if(ind != '0') {
            $('#royal').css({"color":"#444"})
            $('#zone').css({"color":"#444"})
        } else {
            $('#royal').css({"color":"#ccc"})
            $('#zone').css({"color":"#ccc"})
        }
        var str = ''
        if(optCache[ind]) {
            str = optCache[ind]
        } else {
            var childs = arr[ind].child;
            for(var i=0;i<childs.length;i++){
                var temp = ['<option>','','</option>']
                temp[1] = childs[i]
                str = str + temp.join("");
            }
            optCache[ind] = str;   
        }
        
        $("#zone").html(str);
    });

    $(".closeInfo").click(function(){
        $("section").hide()
        $("#sec1").show()
    })

    $("#fillMyInfo").on("click",function(){
        var name = $.trim( $(".forminfo input").eq(0).val() )
        var royal = $.trim( arr[ $("#royal").val() ].royal );
        var zone = $.trim( $("#zone").val() )
        var org = $.trim( $(".forminfo input").eq(1).val() )
        var pho = $.trim( $(".forminfo input").eq(2).val() )
        if(name.length<2) {
            alert('请填写真实姓名');
            return;
        }

        if(zone == '0') {
            alert("请选择您所在的区县");
            return;

        }

        if(org.length<2) {
            alert("请填写正确的单位名称")
            return;

        }

        if(!pho.match(/^1\d{10}$/)) {
            alert("请填写正确的手机号")
            return;
        }
        var param = {myParams:[activId, 2, encodeURI(encodeURI(name)), pho, "",  encodeURI(encodeURI( royal+"-"+zone)) , encodeURI(encodeURI(org))] };  // 单位名称尚未加入 [19,2,'abd',13255546665,'','as','ad']
        goRegister(param)
    })
    
    function goRegister(param){
        $.extend(param, baseParam, { "method": "addActivityEnroll"} )
        jsonpReq(param, function(res, url){
            if(res.status == 1) {
                // 注册成功
                $("section").hide()
                $("#sec3").show()
                runAnwser()
            } else {
                // 注册失败
                alert("注册失败")
            }
        },function(){

        })
    }
    function registerSucc(){
        console.log("register succ");
        $("section").hide();
        $("#sec1").show()
    }
}());



/* 答题部分 */
$("#startAnser").on("click",function(){
    runAnwser()
});

var runningTime;
var runningTime0;
function clearT(){
    clearTimeout(runningTime)
    clearTimeout(runningTime0)
    runningTime = null;
    runningTime0 = null;
}

var usedTime = 0;
var runningTime = null;
var anwsered = false;
function totalTime() {
    var anwsered = false;
    usedTime = 0;
    clearT()
    $(".header-time span").eq(0).html('00:00:00')
    runningTime0 = setTimeout(function repeat() {
        var str = formatTime(usedTime++)
        $(".header-time span").eq(0).html(str)
        if(!anwsered) {
            runningTime = setTimeout(repeat,1000)
        } else {
        clearT()
        }
    },1000)
}
var currentQuesInd = 0;
var questions = [];
var questLen = 0;
var achvId; // 答题批次
var btType; // 题目类型
var nextClicked = true;

function runAnwser() {
    $(".choice ul").empty();
    currentQuesInd = 0;
    questions = []
    questLen =0;
    queryQuestion()

}


function queryQuestion() {
    var queryQuestionUrl = {myParams: [activId]};
    $.extend(queryQuestionUrl, baseParam, { "method": "initAnswerInfoList"} )
    jsonpReq(queryQuestionUrl,function(res){
        // 成功请求到题目
        questions = res.answerList;
        questLen = res.answerCount;
        achvId = res.achvId;
        $("#sec3 .total").text( fillNum(questLen) );
        $("#sec3 .current").text( fillNum(currentQuesInd+1) );
        totalTime()
        renderQues();
    })
}

function renderQues(){
    // 渲染题目
    var item = questions[currentQuesInd]

    btType = item.btType;
    if(btType == 1) {
        $(".question p").removeClass("mult").addClass("single");
    } else {
        $(".question p").removeClass("single").addClass("mult");
    }

    $(".question span").eq(0).html( item.btTitle )
    var tempStr = '<li class="" btXx={{}}><i class="spritIcon"></i><span>{{}}</span><b class="spritIcon"></b></li>'
    var choiceStr = ''
    item.answerItems.forEach(function(item){
        var temp = [item.btXx, item.btItem]
        choiceStr = choiceStr + tempStr.replace(/\{\{\}\}/g,function(){
            return temp.shift()
        })
    });
    $(".choice ul").html(choiceStr);
    nextClicked = false;
    $("#sec3 .current").text( fillNum(currentQuesInd+1) );
    $(".btn-next").hide()
    anwserEventBind()
}

function anwserEventBind(arr) {
    var usedTime = 0;
    $(".choice ul li").off("click").on("click",function(e){
        if($(this).hasClass("choosed")) {
            // 已选择的情况下，又点击，表示取消选择
            $(this).removeClass("choosed")
        } else {
            if(btType == 1) {
                // 单选在已选择的情况下，选择其它的答案，需要取消当前的
                $(".choosed").removeClass("choosed")
            }
            $(this).addClass('choosed')
        }
        ifNext()
    })


    function ifNext() {
        // 是否显示按钮  下一题
        if( $(".choice").find(".choosed").length ) {
            $(".btn-next").show()
        } else {
            $(".btn-next").hide()
        }
    }

    $(".btn-next").click(function(){
        // 点击下一题
        if(nextClicked) return;
        nextClicked = true;

        var examUrl = { "method": "submissionAnswerInfo" };
        var choosedAnwser = ''
        $.each($(".choosed"),function(ind, item){
            choosedAnwser = choosedAnwser + $(item).attr("btXx")
        })
        var param = { myParams:[activId, achvId, questions[currentQuesInd].btId, choosedAnwser] };
        $.extend( param, baseParam, examUrl )
        jsonpReq(param, function(res){
            var corretAnwser = '';
            if(res.status == 1) {
                corretAnwser = choosedAnwser;
            } else {
                corretAnwser = res.answer
            }
            examAnwser(corretAnwser)
            setTimeout(function(){
                if(questLen == ++currentQuesInd) {
                    // 已经全部答完
                    personOut()
                    
                } else {
                    renderQues();
        }
            }, anwserGapTime)
        })
        
    })
}

function examAnwser(corretAnwser) {
    corretAnwser = corretAnwser.split("");

    $.each($(".choice li"), function(i, item) {
        var ind = corretAnwser.indexOf( $(item).attr("btXx") )
        var $item = $(item)
        if( ind == -1 ) {
            // 当前选项不是正确答案
            if($item.hasClass("choosed")) {
                // 选择了当前答案
                $item.addClass('cho-error')
            } else {

            }
        } else{
            $item.addClass('right-anwser')
        }
    })
}

/* 答题部分 */
var resultId;
function personOut(){
    anwsered = true;
    clearT()
    // 个人成绩
    var name = '';
    var count = '';
    var rank = '';
    var rate = '';
    var used = 0;
    var examUrl = { "method": "submissionAnswerAchv" };
    var param = {myParams:[activId, achvId, usedTime] }; 
    $.extend(param,baseParam, examUrl)
    jsonpReq(param, function(res){
        if( res.status==1 ) {
            rank = res.rank;
            used = formatTime(+res.utilityTime);
            count = res.scoreCount;
            rate = res.correctCount / (res.correctCount + res.errorCount) ;
            rate.toFixed(2)
            name = res.userName;
            localStorage.setItem("resultId",res.id)
            resultId = res.id;
            $(".grade .name i").html(name)
            $(".used-time span").html(used)
            $(".result .count .num").html(count)
            $(".rank .num").html(rank)
            $(".corret .num").html(rate)
        }

        $("section").hide()
        $("#sec4").show()
    });
};


/*
分享
*/
(function(){
    $(".sharelink").click(function(){
        $(".share").show();
        fxclick();
    })
    shareLink()

    function fxclick () {
        if (!IsPC()) {
            if (appVersion("1.4")) {
                $(".share").show();
                shareFlag = false;
            } else if ((ostype == "ios") && (infofrom == "appnews")) {
                //$(".mask, .failure_share").show();
            }
        }
    }
    shareLink()
    function shareLink() {
        $(".share img, .share span").click(function() {
            var index = $(this).parent().index(), name = null;
            switch (index) {
                case 0://新浪微博
                    name = "SinaWeiboShare";
                    break;
                case 1://微信好友
                    name = "WeixinFriendShare";
                    break;
                case 2://微信朋友圈
                    name = "WeixinJSShare";
                    break;
                case 3://QQ好友
                    name = "QQShare";
                    break;
                default:
                    name = "WeixinJSShare";
                    break;
            }
            if (name) {
                if (ostype == "android") {
                    if(shareFlag) {
                        jsBridge.postNotification(name, '{"activity_id": "19", "title": "学习党内法规,提高规矩意识、纪律意识", "link": "//moment.rednet.cn/activity/anwser/share.html?userid=' + userid + '&resultId'+resultId+ '&achvId=' + achvId +'&ostype=' + ostype + '", "desc": "湖南省党内法规学习竞赛活动。", "img_url": "//moment.rednet.cn/activity/anwser/images/logo@2x.png", "phoneNum": "", "is_update": "0"}');
                    }
                    else{
                        jsBridge.postNotification(name, '{"activity_id": "19", "title": "学习党内法规,提高规矩意识、纪律意识", "link": "//moment.rednet.cn/activity/anwser/share.html?userid=' + userid + '&resultId'+resultId +'&ostype=' + ostype + '", "desc": "湖南省党内法规学习竞赛活动。", "img_url": "//moment.rednet.cn/activity/anwser/images/logo@2x.png", "phoneNum": "", "is_update": "0"}');
                    }

                } else if (ostype == "ios") {
                    if(shareFlag){
                        jsBridge.postNotification(name, {activity_id: '19', title: '学习党内法规,提高规矩意识、纪律意识', link: '//moment.rednet.cn/activity/anwser/share.html?userid=' + userid + '&resultId'+resultId + '&achvId=' + achvId +'&ostype=' + ostype, desc: '湖南省党内法规学习竞赛活动。', img_url: '//moment.rednet.cn/activity/anwser/images/logo@2x.png', phoneNum: '', is_update: '0'});
                    }
                    else{
                        jsBridge.postNotification(name, {activity_id: '19', title: '学习党内法规,提高规矩意识、纪律意识', link: '//moment.rednet.cn/activity/anwser/share.html?userid=' + userid + '&resultId'+resultId +'&ostype=' + ostype, desc: '湖南省党内法规学习竞赛活动。', img_url: '//moment.rednet.cn/activity/anwser/images/logo@2x.png', phoneNum: '', is_update: '0'});
                    }

                }
                $(".share").hide();
            }
        });
        $(".share>div>div").click(function() {
            $(".share").hide();
        });
    }
    
}());