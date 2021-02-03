var myApp = new Framework7({
  modalTitle: "提示",
  modalButtonOk: "确定",
  modalButtonCancel: "取消"
});
var $$ = Framework7.$;
var mainView = myApp.addView(".view-main", {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  // dynamicNavbar: true,
  stackPages: true,
  allowDuplicateUrls: true,
  domCache: true
});
var timer;


//初始化日历
function initCalendar(monthClass,weekClass,page){
  var monthNames = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月"
  ];
  var Names = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  ];
  // var array = GetStateByDate();
  var calendarInline = myApp.calendar({
    container: monthClass,
    value: [new Date()],
    weekHeader: true,
    dayNames: Names,
    dayNamesShort: Names,
    toolbarTemplate:
      '<div class="toolbar calendar-custom-toolbar">' +
      '<div class="toolbar-inner" style="justify-content:space-between">' +
      '<div class="left">' +
      '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
      "</div>" +
      '<div class="center"></div>' +
      '<div class="right">' +
      '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
      "</div>" +
      '<span onclick="changeView(\'week\')" style="font-size:.14rem;color:#307EF7">周视图</span></div>' +
      "</div>",
    onOpen: function(p) {
      $$(".calendar-custom-toolbar .center").text(
        monthNames[p.currentMonth] + ", " + p.currentYear
      );
      $$(".calendar-custom-toolbar .left .link").on("click", function() {
        calendarInline.prevMonth();
      });
      $$(".calendar-custom-toolbar .right .link").on("click", function() {
        calendarInline.nextMonth();
      });
    },
    onMonthYearChangeStart: function(p) {
      $$(".calendar-custom-toolbar .center").text(
        monthNames[p.currentMonth] + ", " + p.currentYear
      );
    },
    onDayClick: function(p, dayContainer, year, month, day) {
        var formatMonth = parseInt(month) + 1;
        if(formatMonth<10){
            formatMonth = '0' + formatMonth;
        }
        if(parseInt(day) < 10){
            day = '0' + day;
        }
        var date = year + '-' + formatMonth + '-' + day;
//        getHomeJson(date);
    }
  });

  //当前月
  var curYear = new Date().getYear();
  var curMonth = (new Date().getMonth() + 1) < 10 ? "0"+(new Date().getMonth() + 1) : (new Date().getMonth() + 1);
  var curDay = new Date().getDate()<10 ? ("0" + new Date().getDate()) : new Date().getDate();
  // var patrolDetailDays = android.getCalendarInFo(curYear,curMonth,'0');
  if(patrolDetailDays){
      patrolDetailDays = patrolDetailDays.split(",");
  } else {
      patrolDetailDays = [];
  }
  var patrolDetailDays = [];
  // 调用周日历
  var weekfn = new jcalendar_week({
    element: weekClass, //填充日历的dom元素
    dayaddclass: function(date) {
     //添加某天时给添加类名
  //   alert(patrolDetailDays.length);
     for(var i=0;i<patrolDetailDays.length;i++){
         var currentDay = patrolDetailDays[i].split("-");
         //  格式化月份 "03" => "3"
         var tempMonth = currentDay[1].replace(/\b(0+)/gi,"");
         var formatDate = currentDay[0] + '-' + tempMonth + '-' + currentDay[2];
         if(formatDate == date){
           return "patroledDay"
         }
     }
     return ""
    },
    dayclick: function(date, obj) {

      $(".patrolTask-list").empty();
      //    月份格式化 3 => 03
      var formateDate = date.split("-");
      var tempMonth = formateDate[1];
      if(parseInt(tempMonth) < 10){
          tempMonth = "0" + tempMonth;
      }
      var tempDate = formateDate[0] + "-" + tempMonth + "-" + formateDate[2];
      //day点击事件
      if(page == "attendance"){
        punchInfo(tempDate);
      }
      if(page == "index"){
//        alert(222);
//        getHomeJson(tempDate);
      }
      $(obj)
            .addClass("calendar_day_act")
            .siblings()
            .removeClass("calendar_day_act");
      // var res = JSON.parse(android.getDisposeInFo(tempDate));
      // var html = "";
      // if(res){
      //     for(var i=0;i<res.length;i++){
      //            var finishState = res[i].completeStatus == "0" ? "待完成" : "已完成";
      //            html += '<div class="patroltask-item" onclick="geToTaskDetail(\''+res[i].planid+'\')"><div class="task-header"><div>日常巡查任务</div>'
      //                 +  '<span><i class="unfinish"></i>'+finishState+'</span></div>'
      //                 +  '<div class="task-content"><div class="patrol-detail"><p>巡查详情</p>'
      //                 +  '<div class="detail-data"><p>截至时间：'+res[i].endTime+'</p><p><strong>'+res[i].planName+'</strong></p>'
      //                 +  '<p class="arrange-line"><span>安排人员:'+res[i].arrangeName+'</span><span>巡查人员：'+res[i].arrangeName+'</span> </p></div></div>';
      //                 var childHtml = "";
      //                 if(res[i].routeList.length>0){
      //                     for(var j=0;j<res[i].routeList.length;j++){
      //                         var tempObj = res[i].routeList[j];
      //                         var num = j+1;
      //                         childHtml += '<div class="patrol-lines"><p>巡查路线'+num+'</p><div class="line-data"><p>'+tempObj.routeName+'</p></div></div>';
      //                     }
      //                 }
      //                 html += childHtml + '</div></div>';
      //         }
      // }
      // $(".patrolTask-list").append(html);
    }
  });
  // 获取周第一天
  // console.log(weekfn.weekfirstdate(2018,36));
  // 获取传入日期为当年第几周（注:这里的月份从0开始）
  // console.log(weekfn.getweeknum(2018,0,16));
}



function getUserInfo(){
   var resStr = android.getLoginUser();
   var loginObj = JSON.parse(resStr);
   localStorage.setItem("userId",loginObj.id);
   localStorage.setItem("userName",loginObj.userName);
   localStorage.setItem("jobName",loginObj.jobName);
   localStorage.setItem("token",loginObj.token);
   $(".userName").html(loginObj.userName);
   $(".department").html(loginObj.jobName);
   $.ajaxSetup({
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token",loginObj.token);
        }
   });
}
//获取用户信息
getUserInfo();
initCalendar(".calendar-inline-container",".jcalendar_week","index");
$(function(){
    getHomeJson("2020-05-07");
})


function changeView(type) {
  if (type == "month") {
    $(".monthView").css("display", "block");
    $("#monthView1").css("display", "block");//考勤打卡
    $(".jcalendar_week").css("display", "none");
  } else {
    $(".monthView").css("display", "none");
    $("#monthView1").css("display", "none");//考勤打卡
    $(".jcalendar_week").css("display", "block");
  }
}

function hideRightPanel() {
  $(".panel-content").animate({ right: "-2.5rem" });
  $(".right-panel").css("display", "none");
}

function showRightPanel() {
  $(".right-panel").css("display", "block");
  $(".panel-content").animate({ right: "0rem" });
}

function goToTabItem(type) {
  if(type == 1){//巡查考核
    mainView.router.reloadPage("../pages/index.html");
  }else if(type == 2){//交办任务
    mainView.router.reloadPage("../pages/assigned.html");
  }else if(type == 3){//路域巡查
    mainView.router.reloadPage("../pages/road_patrol.html");
  }else if(type == 4){//畜禽养殖
    mainView.router.reloadPage("../pages/animal_farm.html");
  }

}

//回退一页
function goBack(page) {
  mainView.router.back();
  if(page == "attendance"){
    clearInterval(timer);
  }
  if(page == "taskDetail"){
    getHomeJson("2020-05-07");
  }
}

function goAssignedDetail() {
  mainView.router.loadPage("../pages/assigned_details.html");
}

//获取交办违法数据
function getAssignedData() {
//  alert(1);
}

//跳转巡查任务详情页面
function geToTaskDetail(routeId,taskId,workType,date) {
//  alert(taskId)
  mainView.router.loadPage("../pages/task_details.html?routeId="+routeId+"&taskId="+taskId+"&workType="+workType+"&workDate="+date);
}


//跳转到开始巡查页面
function startPotrol(id,taskId,workType) {
//  var startTime = new Date().format("yyyy-MM-dd");
//  // var res = android.addTemporaryInsp(disposeId,planId,routeId,pointId,startTime)
//  mainView.router.loadPage("../pages/patrol_detail.html");
        var json = {
            lineId:id,
            taskId:taskId,
            workType:workType
        }
//        alert(JSON.stringify(json));
        android.startActivity(JSON.stringify(json));
}

//是否有异常点选
function haveAbnormal(type, _this) {
  if (type) {
    $(_this)
      .parent()
      .next()
      .css("display", "block");
  } else {
    $(_this)
      .parent()
      .next()
      .css("display", "none");
  }
  $(_this)
    .siblings("span")
    .removeClass("active");
  $(_this).addClass("active");
}

function nextStep() {
  myApp.modal({
    title: "提示",
    text: "是否继续巡查下一个点?",
    buttons: [
      {
        text: "保存并退出",
        onClick: function() {
          mainView.router.back();
        }
      },
      {
        text: "确定",
        onClick: function() {
          mainView.router.loadPage("../pages/goods_detail.html");
        }
      }
    ]
  });
}

//打开暂扣单弹框
function openRetainage() {
  myApp.popup(".popup-services");
}

//关闭暂扣单弹框
function closeRetainage() {
  myApp.closeModal(".popup-services");
}

//跳转物资出入库
function goWithholdMaterial() {
  mainView.router.loadPage("../pages/withhold_material.html");
}

//跳转车船单申请
function goCarShipApply(){
  mainView.router.loadPage("../pages/car_ship_apply.html");
}

//物资管理弹出显示隐藏
function hideBottomMaterial() {
  $("#material_div").animate({ bottom: "-1.93rem" }, "slow", function() {
    $(".right-material").css("display", "none");
    $("#material_div").css("display", "none");
  });
}

function showBottomMaterial() {
//  $("#material_div").css("display", "block");
//  $(".right-material").css("display", "block");
//  $("#material_div").animate({ bottom: "0rem" }, "slow");
  if($(".inManage").hasClass("active")){
    myApp.popover(".goodsInpover",".goodsOpen");
  }else if($(".outManage").hasClass("active")){
    mainView.router.loadPage("../pages/outgoods_detail.html?type=add");
  }

}

//跳转考勤签到管理
function goAttendance() {
  mainView.router.loadPage("../pages/attendance.html");
}

//跳转应急通知
function goEmergency() {
  mainView.router.loadPage("../pages/emergency_notice.html");
}

//跳转法律法规查询
function goLawRule() {
  mainView.router.loadPage("../pages/law_rule.html");
}

//跳转巡查案例库
function goPatrolBase() {
  mainView.router.loadPage("../pages/patrol_base.html");
}

//跳转考核办法
function goAssessPage(){
  mainView.router.loadPage("../pages/assess_page.html");
}

//打开用车 用船申请popover
function openApply(){
  myApp.popover(".carshipover",".carshipOpen");
}

function gotoAssessDetail(){
  mainView.router.loadPage("../pages/assess_detail.html");
}

function showAttendTime(){
    var nowTime = new Date().format("HH:mm");
    $("#attendTime").html(nowTime);
}

//入库表单页面
function goInDeport(type){
    myApp.closeModal();
    if(type == 'newGoods'){
        mainView.router.loadPage("../pages/goods_detail.html?type=newGoods");
    }else if(type == 'oldGoods'){
        mainView.router.loadPage("../pages/goods_detail.html?type=oldGoods");
    }
}

//新增物资项
function addNewGoods(){
    var number =  new Date().getTime();
    var html = `<div class="new-goodItem">
                    <div class="form-item">
                        <div class="item-label">物资名称</div>
                        <div class="item-value del-temp">
                            <input id="goodName${fileIdx}" placeholder="请输入物资名称" type="text" value=""/>
                            <i class="del-item"></i>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="item-label">物资数量</div>
                        <div class="item-value">
                            <input id="goodNum${fileIdx}" placeholder="请输入物资数量" type="number" value=""/>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="photo-item"></div>
                        <div class="photos-item">
                            <p>物资图片</p>
                            <div class="photos-box">
                                <div class="photo-item inGoodImg goodImgId${fileIdx}" data-imgIds="" data-number="${number}">
                                    <p><span></span></p>
                                    <p>上传图片</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    $(".add-goodslist").append(html);
    fileIdx++;
    $(".new-goodItem .form-item .del-item").click(function(){
        $(this).parent().parent().parent().remove();
    })
    $(".photo-item").click(function(){
        var number = $(this).attr("data-number");
        android.selectImgActivity(number);
    })
}

function inTypeChange(){
    var intype = $("#Intype").val();
    if(intype == "1"){
        //暂扣物资显示水源地类型
        $(".waterType").show();
    }else{
        $(".waterType").hide();
    }
}

function waterTypeChange(){
    var waterType = $("#waterType").val();
    if(waterType == "2"){
        //二级水源地显示到期领取时间
        $(".expirationTime").show();
    }else{
        $(".expirationTime").hide();
    }
}

function backHome(){
    mainView.router.loadPage("../pages/index.html");
}

function goToCarForm(){
    myApp.closeModal();
    mainView.router.loadPage("../pages/car_detail.html");
}
function goToShipForm(){
    myApp.closeModal();
    mainView.router.loadPage("../pages/ship_detail.html");
}

function goToBlackList(){
  mainView.router.loadPage("../pages/blacklist.html");
}

function goToAddBlack(){
  mainView.router.loadPage("../pages/black_detail.html");
}

function selectGoods(){
  myApp.popup(".popup-selectgoods");
  $(".my-checkbox").click(function(){
    $(this).toggleClass("active");
  });
  getAllGoods();

}


function closeSelectgoods(){
  myApp.closeModal(".popup-selectgoods");
}

function statisticsGoods(){
    var goodArr = [];
    $(".my-checkbox.active").each(function(){
        var selectGoodNameEle = $(this).parent().children(".item-value").children(".selectGoodName");
        var goodObj = {
            goodName:$(selectGoodNameEle).val(),
            goodId:$(selectGoodNameEle).attr("data-goodId"),
            goodFileUrl:$(selectGoodNameEle).attr("data-goodFileUrl"),
            goodFileName:$(selectGoodNameEle).attr("data-goodFileName"),
            goodFileId:$(selectGoodNameEle).attr("data-goodFileId"),
            goodNum:$(this).parent().next().children(".item-value").children(".selectGoodNum").val()
        }
        goodArr.push(goodObj);
    })
    var html = "";
    for(var i=0;i<goodArr.length;i++){
        html += `<div class="new-goodItem">
                    <div class="form-item">
                        <div class="item-label">物资名称</div>
                        <div class="item-value del-temp">
                            <input class='good-select-item' id="goodId${i}" placeholder="" style="display:none" type="text" value="${goodArr[i].goodId}"/>
                            <input id="goodName${i}" placeholder="" type="text" value="${goodArr[i].goodName}"/>
                            <i class="del-item"></i>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="item-label">剩余数量</div>
                        <div class="item-value">
                            <input id="goodNum${i}" placeholder="" type="number" value="${goodArr[i].goodNum}"/>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="item-label">出库数量</div>
                        <div class="item-value">
                            <input id="outNum${i}" placeholder="" type="number" value=""/>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="photo-item"></div>
                        <div class="photos-item">
                            <p>物资图片</p>
                            <div class="photos-box">
                                <div class="photo-item">
                                    <p><span></span></p>
                                    <p class="uploadImgBtn">上传图片</p>
                                    <input id="outFile${i}" style="display:none" value="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
    }
    $(".add-goodslist").empty();
    $(".add-goodslist").append(html);
    $(".new-goodItem .form-item .del-item").click(function(){
        $(this).parent().parent().parent().remove();
    })
    closeSelectgoods(".popup-selectgoods");
}

// 跳转车船审核页面
function geToCarShipExamine(id){
    mainView.router.loadPage("../pages/car_ship_examine.html?id=" + id);
}
// 跳转车船编辑页面
function geToCarShipEdit(id,type){
    if(type == '1' || type == '2'){ //船
        mainView.router.loadPage("../pages/ship_detail.html?id=" + id);
    }else{ //车
        mainView.router.loadPage("../pages/car_detail.html?id=" + id);
    }
}


// 跳转巡查预警表单页面
function goPatrolWarnForm(id){
    mainView.router.loadPage("../pages/patrolWarn_form.html?id=" + id);
}

// 跳转巡查预警审核页面
function goPatrolWarnExamine(id){
    mainView.router.loadPage("../pages/patrolWarn_examine.html?id=" + id);
}

function selectImgActivity(){
    android.selectImgActivity()
}
//查看pdf
function lookPDF(fileUrl){
    mainView.router.loadPage("../pages/PDFLook.html?PDFurl=" + fileUrl);
}

// 跳转蓝藻预警表单页面
function goBlueGreenForm(id){
    mainView.router.loadPage("../pages/blueGreen_form.html?id=" + id);
}

// 跳转蓝藻预警审核页面
function goBlueGreenExamine(id){
    mainView.router.loadPage("../pages/blueGreen_examine.html?id=" + id);
}

//蓝藻选择所属区县
function blueGreenCityChange(val){
    getBlueGreenTownList(val)
}