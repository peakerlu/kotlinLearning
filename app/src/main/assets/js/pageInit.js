var fileIdx = 0;//物资索引
$$(document).on("pageInit", function(e) {
  //首页
  if(e.detail.page.name == "index"){
    initCalendar(".calendar-inline-container",".jcalendar_week","index");
    $(".userName").html(localStorage.getItem("userName"));
    $(".department").html(localStorage.getItem("jobName"));
  }
  if(e.detail.page.name == "taskDetail"){
    var routeIds = e.detail.page.query.routeId;
    var taskId = e.detail.page.query.taskId;
    var workType = e.detail.page.query.workType;
    var workDate = e.detail.page.query.workDate;
    var workTypeName = "";
    if(workType == "1"){
        workTypeName = "水域巡查";
    }else if(workType == "2"){
        workTypeName = "专项行动";
    }else if(workType == "3"){
        workTypeName = "交办任务";
    }
    $("#taskName").attr("data-routeIds",routeIds);
    $("#checkPeople").html(localStorage.getItem("userName"));
    $("#workTypeVal").html(workTypeName);
    $("#taskId").val(taskId);
    $("#workType").val(workType);
    $("#taskStartTime").val(workDate);
    getRouteLines(routeIds);
    // var res = JSON.parse(android.getRouteInfo(planId));
    // $("#taskName").html(res.planName);
    // $("#taskStartTime").html(res.startTime);
    // $("#checkPeople").html(userInfo.userName);
    // var taskHtml = "";
    // if(res.routeList){
    //     for(var i=0;i<res.routeList.length;i++){
    //         var index = i+1;
    //         var routeName = res.routeList[i].routeNames ?  res.routeList[i].routeNames : "巡查路线"+index;
    //         var routeId = res.routeList[i].id;//巡查路线Id
    //         taskHtml += '<p>'+ routeName +'</p>'
    //                  +  '<div class="record-points">';
    //                  if(res.routeList[i].patrolItems){
    //                     var tempObj = res.routeList[i].patrolItems;
    //                     var patrolHtml = "";
    //                     for(var j=0;j<tempObj.length;j++){
    //                         var num = j+1;
    //                         if(tempObj[j].status == '0'){
    //                             patrolHtml += '<div class="record-point"><p><span>'+num+'</span>'+tempObj[j].patrolName+'<a onclick="startPotrol(\''+tempObj[j].id+'\',\''+routeId+'\',\''+res.disposeid+'\',\''+planId+'\')">开始巡查</a></p>'
    //                                        +  '<div class="recordPoint-status"><span>未巡查</span></div></div>'
    //                         }else{
    //                             patrolHtml += '<div class="record-point"><p><span>'+num+'</span>'+tempObj[j].patrolName+'</p>'
    //                                        +  '<div class="recordPoint-status"><span class="active">已巡查</span></div></div>'
    //                         }

    //                     }
    //                     taskHtml += patrolHtml;
    //                  }
    //                  taskHtml += '</div>';
    //     }
    // }
    // $(".routeItem-content").empty();
    // $(".routeItem-content").append(taskHtml);
  }
  //路域巡查
  if (e.detail.page.name == "roadPatrol") {
    initCalendar(".calendar-inline-container",".jcalendar_week");
    $(".road-patrol-bottom>span").click(function(){
      var innerHtml = $(this).html();
      $(this).siblings("span").removeClass('active');
      $(this).addClass('active');
      if(innerHtml == '路域巡查'){
        $(".patrol-record-box").hide();
        $(".road-patrol-list").show();
      }else{
        $(".patrol-record-box").show();
        $(".road-patrol-list").hide();
      }
    })
    $(".userName").html(localStorage.getItem("userName"));
    $(".department").html(localStorage.getItem("jobName"));
  }

  //考核详情
  if(e.detail.page.name == "assessDetail"){
    $(".score-btn-box span").click(function(){
      $(this).siblings('span').removeClass('active');
      $(this).addClass("active");
    })
  }


  // 交办管理页面
  if (e.detail.page.name == "assigned") {
    //滑动筛选项
    var mySwiper1 = new Swiper(".swiper-container1", {
      slidesPerView: "auto",
      spaceBetween: 12,
      on: {
        click: function(swiper) {
          // alert(1)
        }
      }
    });
    //滑动项点击事件
    $(".swiper-slide").click(function() {
//      alert($(this).children("span").html());
      if($(this).children("span").html() == "非法船舶"){
        $(".content-list").show();
      }else{
        $(".content-list").hide();
      }
      $(this)
        .addClass("active")
        .siblings()
        .removeClass("active");
    });
    //执行未执行
    $("#assigned-tab>ul>li").click(function() {
      $(this)
        .find("span")
        .addClass("active")
        .parent()
        .siblings()
        .find("span")
        .removeClass("active");
    });
    //入口函数
    $(function() {
      $(".swiper-wrapper .swiper-slide:first-child").click();
      $(".content-tab>ul>li:first-child").click();
    });
    $(".userName").html(localStorage.getItem("userName"));
    $(".department").html(localStorage.getItem("jobName"));
  }
  // 巡查案例库
  if (e.detail.page.name == "patrol-base") {
    //滑动筛选项
    var mySwiper2 = new Swiper(".swiper-container2", {
      slidesPerView: "auto",
      spaceBetween: 12,
      on: {
        click: function(swiper) {
          // alert(1)
        }
      }
    });
    //滑动项点击事件
    $(".swiper-slide").click(function() {
      $(this)
        .addClass("active")
        .siblings()
        .removeClass("active");
    });
    //水库筛选
    $("#patrolBase-tab>ul>li").click(function() {
      $(this)
        .find("span")
        .addClass("active")
        .parent()
        .siblings()
        .find("span")
        .removeClass("active");
    });
    //入口函数
    $(function() {
      $(".swiper-wrapper .swiper-slide:first-child").click();
      $(".content-tab>ul>li:first-child").click();
    });
  }
  // 考勤签到
  if (e.detail.page.name == "attendance") {
    initCalendar(".calendar-inline-container1",".jcalendar_week","attendance");
    showAttendTime();
    var today = new Date().format("yyyy-MM-dd");
    punchInfo(today);
    timer = setInterval(function(){
        showAttendTime();
    },60*1000)
  }

  //出入库管理
  if(e.detail.page.name == "withhold_material"){
//    getInListJson();
    $("#inOutManage li").click(function(){
        $(this).siblings("li").children("span").removeClass('active');
        $(this).children("span").addClass('active');
        var tabText =$(this).children("span").html();
        if(tabText == "入库管理"){
            getInListJson();
        }else if(tabText == "出库管理"){
            getOutListJson();
        }
    })
    getInListJson();
  }

  //物资入库表单
  if(e.detail.page.name == "goodsDetail"){
      fileIdx = 0;
      getDepotList();
      var type = e.detail.page.query.type;
      if(type == "newGoods"){
        $("#addNewBtn").show();
        $("#selectOldGood").hide();
      }else if(type == "oldGoods"){
        $("#addNewBtn").hide();
        $("#selectOldGood").show();
      }
      var goodId = e.detail.page.query.id;
      var taskName = e.detail.page.query.taskName;
      var approvePeople = e.detail.page.query.approvePeople;
      if(goodId) {
        $("#goodId").val(goodId);
      }else{
        $("#goodId").val("");
      }
      if(goodId&&taskName != "未开始"){
        //入库数据没有编辑只能查看
        getGoodInById(goodId,"lookOnly");
        $("input").attr("disabled",true);
        $("select").attr("disabled",true);
        $("#addNewBtn").hide();
      }
      if(goodId&&taskName == "未开始"){
        $("#informIn").show();
        getGoodInById(goodId);
      }
      if(goodId&&taskName == "大队长审批"){
        getGoodInById(goodId,"lookOnly");
        if(approvePeople.indexOf(localStorage.getItem("userId")) != -1){
            $("#informSave").hide();
            $("#informApprove").show();
            $("#informUnapprove").show();
        }else{
             $("#informSave").hide();
        }
      }

      if(taskName == "结束"){
         getGoodInById(goodId,"lookOnly");
         $("#informSave").hide();
         $("#informApprove").hide();
         $("#informUnapprove").hide();
      }
  }

  //物资出库表单
  if(e.detail.page.name == "outgoodsDetail"){
    var goodId = e.detail.page.query.id;
    var taskName = e.detail.page.query.taskName;
    var approvePeople = e.detail.page.query.approvePeople;
    getGoodOutnById(goodId);
  }



  //畜禽养殖
  if(e.detail.page.name == "animalFarm"){
    $(".userName").html(localStorage.getItem("userName"));
    $(".department").html(localStorage.getItem("jobName"));
  }
  //应急通知
  if(e.detail.page.name == "emergency_notice"){
    getPatrolWarnList()
    $(".addBlueGreen").hide();
    $(".blueGreenList").hide();
    $(".emergency-btn span").click(function(){
        $(this).siblings("span").removeClass("active");
        $(this).addClass("active");
        if($(this).html() == "巡查预警"){
            getPatrolWarnList()
            $(".patrolList").show();
            $(".blueGreenList").hide();
            $(".addPatrol").show();
            $(".addBlueGreen").hide();
        }else{
            getBlueGreenList()
            $(".patrolList").hide();
            $(".blueGreenList").show();
            $(".addPatrol").hide();
            $(".addBlueGreen").show();
        }
    })
  }
  //法律法规
  if(e.detail.page.name == "law_rule"){
    getlawList();
  }
  //黑名单
  if(e.detail.page.name == "blackList"){
    getBlackList();
  }

  if (e.detail.page.name == 'lookPDF'){//查看PDF
    var url = e.detail.page.query.PDFurl;
    var pdfh5 = new Pdfh5('#pdfDemo', {
        pdfurl: url
    });
  }

  if(e.detail.page.name == "assessPage"){
    $(".assessTabs>li>span").click(function(){
        $(this).parent().siblings('li').children("span").removeClass("active");
        $(this).addClass("active");
        if($(this).html() == "联合执法"){
            $(".assess-item").show();
        }else{
            $(".assess-item").hide();
        }
    })
  }
  //车船申请
    if(e.detail.page.name == "carShipApply"){
      getCarShipList()
  //    $(".carShipApplyTab>li>span").click(function(){
  //        $(this).parent().siblings("li").children("span").removeClass("active");
  //        $(this).addClass("active");
  //        if($(this).html() == "待审批"){
  //            $('.carshipList').show();
  //        }else{
  //            $('.carshipList').hide();
  //        }
  //    })
    }
    if(e.detail.page.name == "carDetail"){
        var carEditId = e.detail.page.query.id;
        if(carEditId){
            //数据回显
            getCarShipDetail(carEditId,1)
            $('.catDetailTitle').text('编辑用车申请')
        }else{
            //获取车船列表数据
            getCarShipData('', 1)
        }
    }
    if(e.detail.page.name == "shipDetail"){
        var shipEditId = e.detail.page.query.id;
        if(shipEditId){
            //数据回显
            getCarShipDetail(shipEditId,1)
            $('.shipDetailTitle').text('编辑用船申请')
        }else{
            //获取车船列表数据
            getCarShipData('', 0)
        }
    }
    if(e.detail.page.name == "carShipExamine"){
        var carshipExamineId = e.detail.page.query.id;
        getCarShipDetail(carshipExamineId,'')
    }

    // 巡查预警
    if(e.detail.page.name == "patrolWarnForm"){
        var patrolWarnFormId = e.detail.page.query.id;
        if(patrolWarnFormId){
            //数据回显
            getPatrolWarnDetail(patrolWarnFormId,1)
            $('.patrolWarnFormTitle').text('编辑巡查预警')
        }
    }
    if(e.detail.page.name == "patrolWarnExamine"){
        var patrolWarnExamineId = e.detail.page.query.id;
        //数据回显
        getPatrolWarnDetail(patrolWarnExamineId,'')
    }

    // 蓝藻预警
    if(e.detail.page.name == "blueGreenForm"){
        var blueGreenFormId = e.detail.page.query.id;
        if(blueGreenFormId){
            //数据回显
            getBlueGreenDetail(blueGreenFormId,1)
            $('.blueGreenFormTitle').text('编辑蓝藻预警')
        }else{
            getBlueGreenAreaList()
        }
    }
    if(e.detail.page.name == "blueGreenExamine"){
        var blueGreenExamineId = e.detail.page.query.id;
        //数据回显
        getBlueGreenDetail(blueGreenExamineId,'')
    }
});