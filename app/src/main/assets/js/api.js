
//获取首页巡查数据
function getHomeJson(date){
    var resStr = android.getHomeJson("2020-05-27");
    var patrolArr = JSON.parse(resStr);
    var html = "";
//    alert(JSON.stringify(patrolArr))
    for(var i=0;i<patrolArr.length;i++){
        var workType = "";
        if(patrolArr[i].worktype == "1"){
            workType = "水域巡查";
        }else if(patrolArr[i].worktype == "2"){
            workType = "专项行动";
        }else if(patrolArr[i].worktype == "3"){
            workType = "交办任务";
        }
        var configurationStatus = "";
        if(patrolArr[i].configurationStatus == "0"){
            configurationStatus = "待审核";
        }else if(patrolArr[i].configurationStatus == "1"){
            configurationStatus = "驳回";
        }else if(patrolArr[i].configurationStatus == "2"){
            configurationStatus = "同意";
        }else{
            configurationStatus = "";
        }
        if(patrolArr[i].worktype == "1"){
            html += `<div class="patroltask-item" onclick="geToTaskDetail('${patrolArr[i].routeIds}','${patrolArr[i].id}','${patrolArr[i].worktype}','${patrolArr[i].date}')">
              <div class="task-header">
                <div>${workType}</div>
                <span>${configurationStatus}</span>
              </div>
              <div class="task-content">
                <div class="patrol-detail">
                  <p>巡查详情</p>
                  <div class="detail-data">
                    <p>巡查日期：${patrolArr[i].date}</p>
                    <p><strong>${patrolArr[i].groupName}</strong></p>
                  </div>
                </div>` ;
                for(var j=0;j<patrolArr[i].disposePlanDay.wsPatrolRouteList.length;j++){
                    html += `<div class="patrol-lines">
                                <p>${patrolArr[i].disposePlanDay.wsPatrolRouteList[j].routeName}</p>
                             </div>`
                }
                html += "</div></div>";
        }else if(patrolArr[i].worktype == 2){
            html += `<div class="patroltask-item" onclick="geToTaskDetail('${patrolArr[i].specialActionGroup.routeIds}','${patrolArr[i].id}','${patrolArr[i].worktype}','${patrolArr[i].actionTime}')">
                          <div class="task-header">
                            <div>${workType}</div>
                            <span><i class="unfinish"></i>${configurationStatus}</span>
                          </div>
                          <div class="task-content">
                            <div class="patrol-detail">
                              <p>巡查详情</p>
                              <div class="detail-data">
                                <p>巡查日期：${patrolArr[i].actionTime}</p>
                                <p><strong>${patrolArr[i].name}</strong></p>
                              </div>
                            </div>` ;
                            for(var j=0;j<patrolArr[i].specialActionGroup.wsPatrolRouteList.length;j++){
                                html += `<div class="patrol-lines">
                                            <p>${patrolArr[i].specialActionGroup.wsPatrolRouteList[j].routeName}</p>
                                         </div>`
                            }
                            html += "</div></div>";
        }else if(patrolArr[i].worktype == 3){
            html += `<div class="patroltask-item" onclick="geToTaskDetail('${patrolArr[i].routeIds}','${patrolArr[i].id}','${patrolArr[i].worktype}','${patrolArr[i].startTime}')">
                        <div class="task-header">
                          <div>${workType}</div>
                          <span><i class="unfinish"></i>${configurationStatus}</span>
                        </div>
                        <div class="task-content">
                          <div class="patrol-detail">
                            <p>巡查详情</p>
                            <div class="detail-data">
                              <p>开始日期：${patrolArr[i].startTime}</p>
                              <p><strong>${patrolArr[i].planName}</strong></p>
                            </div>
                          </div>` ;
                        for(var j=0;j<patrolArr[i].routeList.length;j++){
                            html += `<div class="patrol-lines">
                                        <p>${patrolArr[i].routeList[j].routeName}</p>
                                     </div>`
                        }
                        html += "</div></div>";
        }
    }
    $(".patrolTask-list").empty();
    $(".patrolTask-list").append(html);
}

//打卡
function punch(){
    $.ajax({
        url: api + "/android/punch",
        type: "post",
        data: {
          userId: "5",
        },
        dataType: "json",
        success: function (data) {
            if(data.success){
                myApp.alert("打卡成功");
                var today = new Date().format("yyyy-MM-dd");
                punchInfo(today);
            }else{
                myApp.alert("服务器响应失败，请稍后再试");
            }
        }
    })
}

//根据日期获取打卡信息
function punchInfo(date){
    $.ajax({
        url: api + "/android/punchInfo",
        type: "post",
        data: {
          userId: "5",
          day:date
        },
        dataType: "json",
        success: function (data) {
            var today = new Date().format("yyyy-MM-dd");
            if(data.success){
                if(data.data == null){
                    //一天都没记录
                    $(".startInfo").hide();
                    $(".endInfo").hide();
                    $(".click p").html("上班打卡");
                    if(date == today){
                        $(".click").show();
                    }
                }
                if(data.data.startTime){
                    //有上班打卡记录
                    $(".startInfo").show();
                    $(".startInfo .sub>span").html(data.data.startTime);
                    $(".click p").html("下班打卡");
                }else{
                    $(".startInfo").hide();
                    $(".click").show();
                }
                if(data.data.endTime){
                    //有下班打卡记录
                    $(".endInfo").show();
                    $(".endAction .sub>span").html(data.data.endTime);
                    $(".click").hide();
                }else{
                    $(".endInfo").hide();
                    $(".click p").html("上班打卡");
                }
            }else{
                myApp.alert("服务器响应失败，请稍后再试");
            }
        }
    })
}

//物资入库列表
function getInListJson(){
    var token = localStorage.getItem("token");
     $.ajax({
            url: api + "mgt/in/listJson?fetchAll=true",
            type: "get",
            success: function (data) {
//                alert(JSON.stringify(data))
                var html = "";
                for(var i=0;i<data.rows.length;i++){
                    var type = "固定物资";
                    if(data.rows[i].type == 1){
                        type = "暂扣物资";
                    }else if(data.rows[i].type == 2){
                        type = "罚没物资";
                    }
                    html += `
                        <div class="content-item" data-id="${data.rows[i].id}" data-taskName="${data.rows[i].taskName}" data-approvePeople="${data.rows[i].people}">
                            <div class="top">
                                <img src="../images/no_shuju.png" alt="">
                                <div class="item-left">
                                    <span class="tit">${data.rows[i].goodNames}</span>
                                    <span class="sub">物资类型:${type}</span>
                                    <span class="sub">入库时间: ${data.rows[i].storageTime}</span>
                                    <span class="sub">入库阶段: ${data.rows[i].taskName}</span>
                                </div>
                            </div>
                            <div class="bottom">
                                <span class="left">经办人:${data.rows[i].userName}</span>
                                <i class="right"></i>
                            </div>
                        </div>`;
                }
                $("#goodsList").empty();
                $("#goodsList").append(html);
                $(".content-item").click(function(){
                    var id = $(this).attr("data-id");
                    var taskName = $(this).attr("data-taskName");
                    var approvePeople = $(this).attr('data-approvePeople');
                    mainView.router.loadPage("../pages/goods_detail.html?id="+id+"&taskName="+taskName+"&approvePeople="+approvePeople);
                })
            }
     })
}

//物资出库列表
function getOutListJson(){
    $.ajax({
           url: api + "/mgt/out/listJson?fetchAll=true",
           type: "get",
           success: function (data) {
//               alert(JSON.stringify(data));
               var html = "";
               for(var i=0;i<data.rows.length;i++){
                   var type = "固定物资";
                   if(data.rows[i].type == 1){
                       type = "暂扣物资";
                   }else if(data.rows[i].type == 2){
                       type = "罚没物资";
                   }
                   html += `
                       <div class="content-item" data-id="${data.rows[i].id}" data-taskName="${data.rows[i].taskName}" data-approvePeople="${data.rows[i].people}">
                           <div class="top">
                               <img src="../images/no_shuju.png" alt="">
                               <div class="item-left">
                                   <span class="tit">${isEmpty(data.rows[i].goodNames)}</span>
                                   <span class="sub">物资类型:${type}</span>
                                   <span class="sub">出库时间: ${ isEmpty(data.rows[i].planOutTime) }</span>
                                   <span class="sub">出库阶段: ${data.rows[i].taskName}</span>
                               </div>
                           </div>
                           <div class="bottom">
                               <span class="left">到期领取时间: ${isEmpty(data.rows[i].expirationTime)}</span>
                               <i class="right"></i>
                           </div>
                       </div>`;
               }
               $("#goodsList").empty();
               $("#goodsList").append(html);
               $(".content-item").click(function(){
                     var id = $(this).attr("data-id");
                     var taskName = $(this).attr("data-taskName");
                     var approvePeople = $(this).attr('data-approvePeople');
                     mainView.router.loadPage("../pages/outgoods_detail.html?id="+id+"&taskName="+taskName+"&approvePeople="+approvePeople);
               })
           }
    })
}

//获取仓库列表
function getDepotList(){
    $.ajax({
        url: api + "/mgt/depot/listJson?fetchAll=true",
        type: "get",
        success: function (data) {
            if(data.success){
                var html = "";
                for(var i=0;i<data.rows.length;i++){
                    html += `<option value='${data.rows[i].id}'>${data.rows[i].name}</option>`
                }
                $("#depotId").empty();
                $("#depotId").append(html);
            }
        }
    })
}

//物资入库保存
function saveInDepart(){
    var goodList = [];
    for(var i=0;i<fileIdx;i++){
        if($("#goodName"+i).val()){
            var goodObj = {
                name:$("#goodName"+i).val(),
                num:$("#goodNum"+i).val(),
                fileId:$(".goodImgId"+i).attr("data-imgIds")
            }
            goodList.push(goodObj);
        }
    }
    var formObj = {
        goodsList:JSON.stringify(goodList),
        storageTime:$("#storageTime").val(),
        type:$("#Intype").val(),
        depotId:$("#depotId").val(),
        details:$("#details").val()
    }
    if($("#goodId").val()){
        formObj.id = $("#goodId").val();
    }
    if($("#Intype").val() == 1){
        formObj.waterType = $("#waterType").val();
    }
    if($("#Intype").val() == 1 && $("#waterType").val() == 2 ){
        formObj.expirationTime = $("#expirationTime").val();
    }
//    alert(JSON.stringify(formObj))
     $.ajax({
         url: api + "/mgt/in/save",
         type: "post",
         data:formObj,
         //dataType:"json",
         success: function (data) {
            if(data.success){
                myApp.alert("保存成功!");
                goBack();
                getInListJson();
            }
         }
     })
}

//根据物资入库id查物资入库详情
function getGoodInById(id,type){
    $.ajax({
             url: api + "/mgt/in/getById?id="+id,
             type: "get",
             success: function (data) {
                $("#goodId").val(id);
                $("#goodId").attr("data-taskId",data.model.taskId);
                $("#goodId").attr("data-taskDefKey",data.model.taskDefKey);
                $("#storageTime").val(data.model.storageTime);
                $("#Intype").val(data.model.type);
                $("#waterType").val(data.model.waterType);
                $("#expirationTime").val(data.model.expirationTime);
                $("#depotId").val(data.model.depotId);
                $("#details").val(data.model.details);
                var goodsList = data.goodsList;
                for(var i=0;i<goodsList.length;i++){
                    var html = `<div class="new-goodItem">
                                        <div class="form-item">
                                            <div class="item-label">物资名称</div>
                                            <div class="item-value del-temp">
                                                <input id="goodName${i}" placeholder="" type="text" value="${goodsList[i].name}"/>
                                                <i class="del-item"></i>
                                            </div>
                                        </div>
                                        <div class="form-item">
                                            <div class="item-label">物资数量</div>
                                            <div class="item-value">
                                                <input id="goodNum${i}" placeholder="" type="number" value="${parseInt(goodsList[i].num)}"/>
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                     fileIdx ++;
                }
                $(".add-goodslist").empty();
                $(".add-goodslist").append(html);
                if(type == "lookOnly"){
                    $("input").attr("disabled",true);
                    $("select").attr("disabled",true);
                    $(".del-item").hide();
                }
                $(".photo-item .uploadImgBtn").click(function(){
                    android.selectImgActivity(id);
                })
             }
    })
}

//物资入库审批
function approveInDepart(type){
        $.ajax({
            url : api + "/mgt/in/saveAuditNew",
            type : 'post',
            dataType : 'JSON',
            data:{
                id:$("#goodId").val(),
                taskId:$("#goodId").attr("data-taskId"),
                taskDefKey:$("#goodId").attr("data-taskDefKey"),
                pass:type
            },
            success : function(data) {
                if (data.success) {
                    if(type == 0){
                        myApp.alert("审批通过");
                    }else{
                        myApp.alert("审批不通过");
                    }
                    goBack();
                }else{
                    myApp.alert('审批失败');
                }
            },
            error : function() {
                    myApp.alert('连接服务器失败，请稍后再试');
            }
        });
}

//物资入库申请
function storeDeport(){
    saveInDepart();
    $.ajax({
        url : api + "/mgt/in/applicationNew",
        type : 'post',
        dataType : 'JSON',
        data:{
            id:$("#goodId").val(),
            taskId:$("#goodId").attr("data-taskId"),
            taskDefKey:$("#goodId").attr("data-taskDefKey"),
        },
        success : function(data) {

        }
    })
}

//获取全部物资
function getAllGoods(){
    $.ajax({
        url : api + "/mgt/good/getAllGoods",
        type : 'post',
        dataType : 'JSON',
        data:{
            fetchAll:true
        },
        success : function(data) {
            var selectedArr = [];
            $(".new-goodItem .del-temp .good-select-item").each(function(){
                selectedArr.push($(this).val());
            })
            var html = "";
            for(var i=0;i<data.rows.length;i++){
                var selectClass="";
                if(selectedArr&&selectedArr.indexOf(data.rows[i].id + '') != -1){
                    selectClass = "active";
                }
                html += `<div class="select-good-item">
                             <div class="form-item">
                                 <i class="my-checkbox ${selectClass}"></i>
                                 <div class="item-label"> 物资名称</div>
                                 <div class="item-value"><input class="selectGoodName" data-goodId="${data.rows[i].id}" data-goodFileName="${data.rows[i].fileName}" data-goodFileUrl="${data.rows[i].fileUrl}"  data-goodFileId="${data.rows[i].fileId}" type="text" value="${data.rows[i].name}" /></div>
                             </div>
                             <div class="form-item">
                                 <div class="item-label">剩余数量</div>
                                 <div class="item-value"><input class="selectGoodNum" readonly type="text" value="${data.rows[i].num}" /></div>
                             </div>
                         </div>`
            }
            $(".select-good-list").empty();
            $(".select-good-list").append(html);
            $(".form-item>.item-label").click(function(){
              if($(this).parent().children(".my-checkbox").hasClass('active')){
                  $(this).parent().children(".my-checkbox").removeClass("active");
              }else{
                  $(this).parent().children(".my-checkbox").addClass("active");
              }
            })
        }
    })
}
//根据id获取出库记录
function getGoodOutnById(id,type){
    $.ajax({
         url: api + "/mgt/out/getById?id="+id,
         type: "get",
         success: function (data) {
            var taskName = data.model.taskName;
            var html = "";
            if(data.goodsList){
                var goodArr = data.goodsList;
                for(var i=0;i<goodArr.length;i++){
                    var number = new Date().getTime();
                    html += `<div class="new-goodItem">
                                 <div class="form-item">
                                     <div class="item-label">物资名称</div>
                                     <div class="item-value del-temp">
                                         <input class='good-select-item' id="goodId${i}" placeholder="" style="display:none" type="text" value="${goodArr[i].id}"/>
                                         <input id="goodName${i}" placeholder="" readonly type="text" value="${goodArr[i].name}"/>
                                         <i class="del-item"></i>
                                     </div>
                                 </div>
                                 <div class="form-item">
                                     <div class="item-label">剩余数量</div>
                                     <div class="item-value">
                                         <input id="goodNum${i}" placeholder="" type="number" readonly value="${goodArr[i].num}"/>
                                     </div>
                                 </div>
                                 <div class="form-row">
                                     <div class="photo-item"></div>
                                     <div class="photos-item">
                                         <p>物资图片</p>
                                         <div class="photos-box">
                                             <div class="photo-item inGoodImg goodImgId${i}" data-imgIds="" data-number="${number}">
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
            }
            $("#planOutTime").val(data.model.planOutTime);
            $("#returnTime").val(data.model.returnTime);
            $("#outType").val(data.model.type);
            $("#goodId").val(id);
            $("#goodId").attr("data-taskId",data.model.taskId);
            $("#goodId").attr("data-taskDefKey",data.model.taskDefKey);
            $(".photo-item").click(function(){
                android.selectImgActivity(id);
            })
            //有处罚记录 显示处罚信息
            if(data.punishment != null){
                $(".goodPunishment").show();
                $("#contact").val(data.punishment.contact);
                $("#phone").val(data.punishment.phone);
                $("#money").val(data.punishment.money);
            }else{
                $(".goodPunishment").hide();
            }
            //有销毁记录 显示销毁信息
            if(data.destroy != null){
                $(".goodDestory").show();
            }else{
                $(".goodDestory").hide();
            }
            //非固定物资隐藏固定物资字段
            if(data.model.type != 0){
                $(".baseFormItem").hide();
            }
            if(taskName == "未开始"){
                $("#outformIn").show();
            }
            if(data.model.waterType == '1' && data.model.type == '1'){//一级水源地 暂扣物资
                if(taskName == "15天内接受行政处罚"){
                    $("#outformPunish").show();
                    $(".goodPunishment").show();
                    $(".baseFormItem").hide();
                    $("#selectOldGood").hide();
                    $("#outformSave").hide();
                }else if(taskName == "申领"){
                    $("#outformApply").show();
                    $("#selectOldGood").hide();
                    $("#outformSave").hide();
                }else if(taskName == "大队长审批"){
                    var approvePeople = data.model.people ? data.model.people.split(",") : [];
                    if(approvePeople.indexOf(localStorage.getItem("userId")) != -1){
                        $("#outformApprove").show();
                        $("#outformUnApprove").show();
                    }
                    $("#outformSave").hide();
                    $("#selectOldGood").hide();
                }else if(taskName == "销毁"){
                    $("#outformDestroy").show();
                    $(".goodDestory").show();
                    $(".baseFormItem").hide();
                    $("#selectOldGood").hide();
                    $("#outformSave").hide();
                }
            }else if(data.model.waterType == '2' &&data.model.type == '1'){ //二级水源地 暂扣物资
                if(taskName == "到期领取"){
                    $("#outformApply").show();
                    $("#selectOldGood").hide();
                    $("#outformSave").hide();
                }else if(taskName == "大队长审批"){
                     var approvePeople = data.model.people ? data.model.people.split(",") : [];
                     if(approvePeople.indexOf(localStorage.getItem("userId")) != -1){
                         $("#outformApprove").show();
                         $("#outformUnApprove").show();
                     }
                     $("#outformSave").hide();
                     $("#selectOldGood").hide();
                }else if(taskName == "销毁"){
                    $("#outformDestroy").show();
                    $(".goodDestory").show();
                    $(".baseFormItem").hide();
                    $("#selectOldGood").hide();
                     $("#outformSave").hide();
                }
            }else if(data.model.type == '0'){ //固定物资
                if(taskName == "大队长审批"){
                    var approvePeople = data.model.people ? data.model.people.split(",") : [];
                    if(approvePeople.indexOf(localStorage.getItem("userId")) != -1){
                        $("#outformApprove").show();
                        $("#outformUnApprove").show();
                    }
                    $("#outformSave").hide();
                    $("#selectOldGood").hide();
                }
            }
         }
    })
}

//出库保存
function outSave(){
    var goodsArr = [];
    $(".add-goodslist .new-goodItem").each(function(i){
        var obj = {
            id:$("#goodId"+i).val(),
            name:$("#goodName"+i).val(),
            num:$("#goodNum"+i).val(),
            applyNum:$("#outNum"+i).val(),
            fileId:$("#outFile"+i).val()
        }
        goodsArr.push(obj);
    })
    var formObj = {
        id:$("#goodId").val(),
        planOutTime:$("#planOutTime").val(),
        returnTime:$("#returnTime").val(),
        outType:$("#outType").val(),
        goodsList:JSON.stringify(goodsArr)
    }
    $.ajax({
        url : api+"/mgt/out/save",
        type : 'post',
        data:formObj,
        success : function(data) {
            if (data.success) {
                myApp.alert("保存成功");
                goBack();
                getOutListJson();
            }else{
                myApp.alert("保存失败，请稍后再试");
            }
        }
    });
}

//出库上报
function outAppear(){
//    outSave();
    $.ajax({
        url : api + "/mgt/out/application",
        type : 'post',
        dataType : 'JSON',
        data:{
            id:$("#goodId").val(),
            taskId:$("#goodId").attr("data-taskId"),
            taskDefKey:$("#goodId").attr("data-taskDefKey"),
        },
        success : function(data) {
            alert(JSON.stringify(data))
        }
    })
}

//出库处罚
function outPunish(){
    var punishArr = [];
    var punishObj = {
//        imgId:$("#Punish").val(),
        contact:$("#contact").val(),
        phone:$("#phone").val(),
        money:$("#money").val()
    }
    punishArr.push(punishObj);
    var formData = {
        punishmentRecords:JSON.stringify(punishArr),
        taskId:$("#goodId").attr("data-taskId"),
        taskDefKey:$("#goodId").attr("data-taskDefKey"),
        pass:0,
        id:$("#goodId").val()
    }
    $.ajax({
        url: api + "/mgt/out/saveAudit",
        type: "post",
        data:formData,
        success: function (data) {
            if(data.success){
                myApp.alert("处罚成功");
                goBack();
                getOutListJson();
            }
        }
    })
}

//出库申领
function outApply(){
    var formObj = {
        id:$("#goodId").val(),
        taskId:$("#goodId").attr("data-taskId"),
        taskDefKey:$("#goodId").attr("data-taskDefKey"),
        pass:0
    }
    $.ajax({
        url: api + "/mgt/out/saveAudit",
        type: "post",
        data:formObj,
        success: function (data) {
            if(data.success){
                myApp.alert("申领成功");
                goBack();
                getOutListJson();
            }
        }
    })
}

//出库审批
function outApprove(type){
    var pass = 0;
    if(type == '2'){
        pass = 1;
    }
    $.ajax({
        url : "/mgt/out/saveAudit",
        type : 'post',
        dataType : 'JSON',
        data:{
            id:id,
            taskId:taskId,
            taskDefKey:taskDefKey,
            pass:pass
        },
        success : function(data) {
            if (data.success) {
                myApp.alert("审批成功");
                goBack();
                getOutListJson();
            }else{
                myApp.alert("审批失败，请稍后再试");
            }
        }
    });
}

//出库销毁
function outDestroy(){
    var destroyArr = [];
    var destroyObj = {
        imgId:$("#Destroyimg").val(),
    }
    destroyArr.push(destroyObj);
    var formObj = {
        destroyRecords:JSON.stringify(destroyArr),
        taskId:$("#goodId").attr("data-taskId"),
        taskDefKey:$("#goodId").attr("data-taskDefKey"),
        pass:0
    }
    $.ajax({
        url : "/mgt/out/saveAudit",
        type : 'post',
        dataType : 'JSON',
        data:formObj,
        success : function(data) {
            if (data.success) {
                myApp.alert("销毁成功");
                goBack();
                getOutListJson();
            }else{
                myApp.alert("销毁失败，请稍后再试");
            }
        }
    });
}

// 获取车船申请单列表数据
function getCarShipList () {
    var id = localStorage.getItem("userId")
    $.ajax({
        url : api + "/mgt/andshipprocess/listJson",
        type : 'get',
        dataType : 'JSON',
        data:{
            fetchAll:true
        },
        success : function(data) {
            var html = ''
            var text = ''
            $('.carshipList').empty()
            for(var i = 0; i < data.rows.length; i++){
                if(data.rows[i].type == '3' || data.rows[i].type == '4'){
                    text = '用车单申请'
                }else{
                    text = '用船单申请'
                }
                html += `<div class="patroltask-item" onclick="geToCarShipExamine(${data.rows[i].id})">
                    <div class="task-header">
                        <div>${text}</div>
                        <span><i class="unfinish"></i>${data.rows[i].taskName}</span>
                    </div>
                    <div class="task-content">
                        <div class="patrol-detail">
                            <p>申请详情</p>
                            <div class="detail-data">
                                <p>起止时间：${data.rows[i].startTime} - ${data.rows[i].endTime}</p>
                                <p><strong>${data.rows[i].context}</strong></p>
                                <p class="arrange-line"><span>申请人员:${data.rows[i].applicantName}</span>`
                                if((data.rows[i].taskDefKey == '' && id == data.rows[i].applicant) || (data.rows[i].taskDefKey == 'modify' && carShip_isIn(data.rows[i].taskMan))){
                                    html += `<span class="edit" onclick="geToCarShipEdit('${data.rows[i].id}','${data.rows[i].type}')">编辑</span>`
                                }
                        html+= `</p>
                            </div>
                        </div>
                    </div>
                </div>`
            }
            $('.carshipList').append(html)
        }
    })
}
// 获取车船列表数据
function getCarShipData(id,isCar){
    var type = ''
    var text = ''
    if(isCar == 1){
        type = '3,4'
        text = '选择车辆'
    }else{
        type = '1,2'
        text = '选择船舶'
    }
    $.ajax({
        url : api + "/mgt/andship/listJson?type=" + type + "&fetchAll=true",
        type : 'get',
        dataType : 'JSON',
        success : function(data) {
            $("#carShipList").empty().append("<option value=''>"+text+"</option>");
            if(data.rows.length) {
                for (var i = 0; i < data.rows.length; i++) {
                    $("#carShipList").append("<option value='" + data.rows[i].id + "'>" + data.rows[i].name + '，' + data.rows[i].license + "</option>");
                }
            }
            if(id){
                $('#carShipList').val(id)
            }
        },
        error : function() {

        }
    });
}
// 车船申请表单数据回显
var carShipTaskDefKey = ''
var carShipTaskId = ''
var carShipProcessId = ''
function getCarShipDetail(id,isEdit){
    $('#carship_id').text(id)
    $.ajax({
        url : api + "/mgt/andshipprocess/getById?id=" + id,
        type : 'get',
        dataType : 'JSON',
        success : function(data) {
//            alert(JSON.stringify(data.data))
            if(data.data) {
                var isCar = ''
                if(data.data.type == 3 || data.data.type == 4){
                    isCar == 1
                }
                if(isEdit == 1){ //编辑
                    getCarShipData(data.data.carId,isCar)
                    $('#carship_context').val(data.data.context)
                    $('#carship_startPlace').val(data.data.startPlace)
                    $('#carship_startTime').val(data.data.startTime ? data.data.startTime.slice(0,10) : data.data.startTime)
                    $('#carship_endTime').val(data.data.endTime ? data.data.endTime.slice(0,10) : data.data.endTime)
                    $('#carship_driver').val(data.data.driver)
                }else{//审核
                    $('#carship_context').text(data.data.context)
                    $('#carship_startPlace').text(data.data.startPlace)
                    $('#carship_startTime').text(data.data.startTime)
                    $('#carship_endTime').text(data.data.endTime)
                    $('#carShipList').text(data.data.license)
                    $('#carship_driver').text(data.data.driver)
                    carShipTaskDefKey = data.data.taskDefKey
                    carShipTaskId = data.data.taskId
                    carShipProcessId = data.data.processId
                    showBtn(data.data.applicant,data.data.taskMan,data.data.taskDefKey,data.data.carOfficeId,id)
                }
            }
        },
        error : function() {

        }
    });
//ajax
}

// 车船审核判断显示按钮
function showBtn(applicant,taskMan,taskDefKey,carOfficeId,id) {
    var userId = localStorage.getItem("userId")
    var html = ''
    //未开始
    if((!taskDefKey || taskDefKey == 'null') && userId == applicant){
        html = '<div class="btn-primary" onclick="carShip_report('+id+')">上报</div>'
    }
    //用车处室审核
    else if(taskDefKey == 'carOfficeAudit' && userId == carOfficeId){
        html = '<div class="btn-primary" style="margin-right:15px" onclick="carShip_deal('+id+',1)">同意</div>'+
            '<div class="btn-primary" onclick="carShip_deal('+id+',0)">驳回</div>'
    }
    //重新修改
    else if(taskDefKey == 'modify' && carShip_isIn(taskMan)){
        html = '<div class="btn-primary" style="margin-right:15px" onclick="carShip_deal('+id+',1)">重新上报</div>'+
            '<div class="btn-primary" onclick="carShip_deal('+id+',0)">结束</div>'
    }
    $('#carship_btn').html(html)
}

// 车船判断当前用户是否在taskMan内
function carShip_isIn(ids) {
    var userId = localStorage.getItem("userId")
    var taskMan = ids == ',' ? '' : ids
    taskMan = taskMan.split(',')
    for(var i = 0; i<taskMan.length; i++){
        if(taskMan[i] == userId){
            return true
        }
    }
    return false
}

// 车船审核上报
function carShip_report(id) {
    $.ajax({
        url : api + "/mgt/andshipprocess/application?id=" + id,
        type : 'get',
        success : function(data) {
//            alert(JSON.stringify(data))
            if(data.success){
                myApp.alert("上报成功");
                goBack();
                getCarShipList()
            }else{
                myApp.alert("上报失败!");
            }
        },
        error : function() {

        }
    });
}

// 车船审核操作
function carShip_deal(id,pass) {
    var postData = {}
    postData = {
        id: id,
        taskDefKey: carShipTaskDefKey,
        taskId: carShipTaskId,
        pass: pass, //1同意0驳回2车辆管理处室审核>局领导审核同意
        processId: carShipProcessId,
    }
    $.ajax({
        url : api + "/mgt/andshipprocess/saveAudit",
        type : 'post',
        data: postData,
        dataType : 'JSON',
        success : function(data) {
            if(data.success){
                myApp.alert("操作成功");
                goBack();
                getCarShipList()
            }else{
                myApp.alert("操作失败!");
            }
        },
        error : function() {

        }
    });
}

// 车船申请保存
function saveCarShip(){
    var id = $('#carship_id').text()
    var postData = {
        applicant: localStorage.getItem("userId"),
        context: $('#carship_context').val(),
        startPlace: $('#carship_startPlace').val(),
        startTime: $('#carship_startTime').val() + ' 00:00:00',
        endTime: $('#carship_endTime').val() + ' 00:00:00',
        carId: $('#carShipList').val(),
        driver: $('#carship_driver').val()
    }
    if(id){
        postData.id = id
    }
//    alert(JSON.stringify(postData))
    $.ajax({
        url: api + "/mgt/andshipprocess/save",
        type: 'post',
        data: postData,
        success:function(result){
            if(result.success){
                myApp.alert("保存成功");
                goBack();
                getCarShipList()
            }else{
                myApp.alert("保存失败!");
            }
        }
    });
}

//获取巡查预警列表
function getPatrolWarnList() {
    $.ajax({
        url : api + "/mgt/emergency/listJson",
        type : 'get',
        dataType : 'JSON',
        data:{
            fetchAll:true
        },
        success : function(data) {
            var html = ''
            var text = ''
            $('.patrolList').empty()
            for(var i = 0; i < data.rows.length; i++){
                if(data.rows[i].type == '1'){
                    text = '一级响应'
                }else if(data.rows[i].type == '2'){
                    text = '二级响应'
                }else{
                    text = '三级响应'
                }
                var time = data.rows[i].createTime ? data.rows[i].createTime.slice(5) : data.rows[i].createTime
                html += `<div class="content-item" onclick="goPatrolWarnExamine(${data.rows[i].id})">
                     <i class="ico"></i>
                     <div class="top">
                         <div>
                             <span class="ellipsis tit">${text}</span>
                             <span class="time">${data.rows[i].taskName}</span>
                         </div>
                         <div>
                             <p class="ellipsis">${data.rows[i].context}</p>
                         </div>
                     </div>
                     <div class="bottom">
                        <span>${time}</span>`
                if((data.rows[i].taskDefKey == '' || (data.rows[i].taskDefKey == 'modify' && carShip_isIn(data.rows[i].people))) && data.rows[i].taskName != '结束'){
                    html += `<span class="edit" onclick="goPatrolWarnForm(${data.rows[i].id})">编辑</span>`
                }
                html +=
                    `</div>
                </div>`
            }
            $('.patrolList').append(html)
        }
    })
}

//获取巡查预警详情
var patrolWarnTaskDefKey = ''
var patrolWarnTaskId = ''
function getPatrolWarnDetail(id,isEdit){
    $('#patrolWarn_id').text(id)
    $.ajax({
        url : api + "/mgt/emergency/getById?id=" + id,
        type : 'get',
        dataType : 'JSON',
        success : function(data) {
//            alert(JSON.stringify(data.data))
            if(data.data) {
                if(isEdit == 1){ //编辑
                    $('#patrolWarn_type').val(data.data.type)
                    $('#patrolWarn_address').val(data.data.address)
                    $('#patrolWarn_findTime').val(data.data.findTime)
                    $('#patrolWarn_context').val(data.data.context)
                }else{ //审核
                    patrolWarnTaskDefKey = data.data.taskDefKey
                    patrolWarnTaskId = data.data.taskId
                    var text = ''
                    if(data.data.type == '1'){
                        text = '一级响应'
                    }else if(data.data.type == '2'){
                        text = '二级响应'
                    }else{
                        text = '三级响应'
                    }
                    $('#patrolWarn_type').text(text)
                    $('#patrolWarn_address').text(data.data.address)
                    $('#patrolWarn_findTime').text(data.data.findTime)
                    $('#patrolWarn_context').text(data.data.context)
                    var html = ''
                    if(data.data.taskDefKey == '' && data.data.taskName != '结束'){
                        html = '<div class="btn-primary" onclick="patrolWarn_report('+id+')">上报</div>'
                    }else if(data.data.taskDefKey == 'captainAudit' && carShip_isIn(data.data.people)){
                        html = '<div class="btn-primary" onclick="patrolWarn_deal(1,'+id+')" style="margin-right: 10px">通过</div>' +
                            '<div class="btn-primary" onclick="patrolWarn_deal(0,'+id+')" style="margin-right: 10px">驳回</div>' +
                            '<div class="btn-primary" onclick="patrolWarn_deal(2,'+id+')">二级响应</div>'
                    }else if(data.data.taskDefKey == 'superiorsAudit' && carShip_isIn(data.data.people)){
                        html = '<div class="btn-primary" onclick="patrolWarn_deal(1,'+id+')" style="margin-right: 10px">通过</div>' +
                            '<div class="btn-primary" onclick="patrolWarn_deal(3,'+id+')" style="margin-right: 10px">结束</div>' +
                            '<div class="btn-primary" onclick="patrolWarn_deal(2,'+id+')">三级响应</div>'
                    }else if(data.data.taskDefKey == 'cityLeadersAudit' && carShip_isIn(data.data.people)){
                        html = '<div class="btn-primary" onclick="patrolWarn_deal(0,'+id+')" style="margin-right: 10px">通过</div>' +
                            '<div class="btn-primary" onclick="patrolWarn_deal(1,'+id+')">结束</div>'
                    }else if(data.data.taskDefKey == 'modify' && carShip_isIn(data.data.people)){
                        html = '<div class="btn-primary" onclick="patrolWarn_rereport(1,'+id+')" style="margin-right: 10px">重新上报</div>' +
                            '<div class="btn-primary" onclick="patrolWarn_rereport(0,'+id+')">结束</div>'
                    }else if(data.data.taskDefKey == 'uploadDisposal' && carShip_isIn(data.data.people)){
                        $('.patrolWarn_upload_wrap').removeClass('none')
                        html = '<div class="btn-primary" onclick="patrolWarnFile_save('+id+')" style="margin-right: 10px">保存</div>'
                    }
                    $('#patrolWarn_btn').html(html)
                }
            }
        }
    })
}

// 巡查预警上报
function patrolWarn_report(id){
    $.ajax({
        url : api + "/mgt/emergency/application?id="+ id,
        type : 'get',
        dataType : 'JSON',
        success : function(data) {
            if(data.success){
                myApp.alert("上报成功");
                goBack();
                getPatrolWarnList()
            }else{
                myApp.alert("上报失败!");
            }
        },
        error : function() {

        }
    });
}

// 巡查预警审核操作
function patrolWarn_deal(pass, id){
    $.ajax({
        url : api + "/mgt/emergency/saveAudit?id="+ id + '&taskId=' + patrolWarnTaskId + '&taskDefKey=' + patrolWarnTaskDefKey + '&pass=' + pass,
        type : 'get',
        dataType : 'JSON',
        success : function(data) {
            if(data.success){
                myApp.alert("操作成功");
                goBack();
                getPatrolWarnList()
            }else{
                myApp.alert("操作失败!");
            }
        },
        error : function() {
        }
    });
}

// 巡查预警重新上报
function patrolWarn_rereport(pass, id){
    $.ajax({
        url : api + "/mgt/emergency/saveAudit?id="+ id + '&taskId=' + patrolWarnTaskId + '&taskDefKey=' + patrolWarnTaskDefKey + '&pass=' + pass,
        type : 'get',
        dataType : 'JSON',
        success : function(data) {
            if(data.success){
                myApp.alert("操作成功");
                goBack();
                getPatrolWarnList()
            }else{
                myApp.alert("操作失败!");
            }
        },
        error : function() {
        }
    });
}

//巡查预警处置文件保存
function patrolWarnFile_save(id){
    postData = {
        id: id,
        resultId: $("#fileId").val(),
        taskId: patrolWarnTaskId,
        taskDefKey: patrolWarnTaskDefKey
    }
    $.ajax({
        url: "/mgt/emergency/saveAudit",
        type: 'post',
        data: postData,
        success: function (data) {
            if(data.success){
                myApp.alert("操作成功");
                goBack();
                getPatrolWarnList()
            }else{
                myApp.alert("操作失败!");
            }
        }
    })
}

//巡查预警保存
function savePatrolWarn(){
    var id = $('#patrolWarn_id').text()
    var postData = {
        type: $('#patrolWarn_type').val(),
        address: $('#patrolWarn_address').val(),
        findTime: $('#patrolWarn_findTime').val(),
        context: $('#patrolWarn_context').val(),
    }
    if(id){
        postData.id = id
    }
    $.ajax({
        url: api + "/mgt/emergency/save",
        type: 'post',
        data: postData,
        success:function(result){
            if(result.success){
                myApp.alert("保存成功");
                goBack();
                getPatrolWarnList()
            }else{
                myApp.alert("保存失败!");
            }
        }
    });
}

//获取蓝藻预警列表
function getBlueGreenList() {
    $.ajax({
        url : api + "/mgt/exception/listJson",
        type : 'get',
        dataType : 'JSON',
        data:{
            fetchAll:true
        },
        success : function(data) {
            var html = ''
            var text = ''
            $('.blueGreenList').empty()
            for(var i = 0; i < data.rows.length; i++){
                if(data.rows[i].state == 1){
                    text = '异常'
                }else{
                    text = '无异常'
                }
                var time = data.rows[i].createTime ? data.rows[i].createTime.slice(5) : data.rows[i].createTime
                html += `<div class="content-item" onclick="goBlueGreenExamine(${data.rows[i].id})">
                     <i class="ico"></i>
                     <div class="top">
                         <div>
                             <span class="ellipsis tit">${text}</span>
                             <span class="time">${data.rows[i].taskName}</span>
                         </div>
                         <div>
                             <p class="ellipsis">${data.rows[i].areaName}</p>
                         </div>
                     </div>
                     <div class="bottom">
                        <span>${time}</span>`
                if((data.rows[i].taskDefKey == '' || (data.rows[i].taskDefKey == 'report' && carShip_isIn(data.rows[i].people))) && data.rows[i].taskName != '结束'){
                    html += `<span class="edit" onclick="goBlueGreenForm(${data.rows[i].id})">编辑</span>`
                }
                html +=
                    `</div>
                </div>`
            }
            $('.blueGreenList').append(html)
        }
    })
}

//获取巡查预警详情
var blueGreenTaskDefKey = ''
var blueGreenTaskId = ''
function getBlueGreenDetail(id,isEdit){
    $('#blueGreen_id').text(id)
    $.ajax({
        url : api + "/mgt/exception/getById?id=" + id,
        type : 'get',
        dataType : 'JSON',
        success : function(data) {
//            alert(JSON.stringify(data.data))
            if(data) {
                if(isEdit == 1){ //编辑
                    $('#blueGreen_state').val(data.state)
                    $('#blueGreen_remark').val(data.remark)
                    // 地区选择回显
                    townCode = data.areaCode
                    getBlueGreenAreaList(data.cityCode)
                }else{ //审核
                    blueGreenTaskDefKey = data.taskDefKey
                    blueGreenTaskId = data.taskId
                    var text = ''
                    if(data.state == 1){
                        text = '异常'
                    }else{
                        text = '无异常'
                    }
                    $('#blueGreen_state').text(text)
                    $('#blueGreen_cityCode').text(data.cityName)
                    $('#blueGreen_areaCode').text(data.areaName)
                    $('#blueGreen_remark').text(data.remark)

                    var html = ''
                    if(data.taskDefKey == '' && data.taskName != '结束'){
                        html = '<div class="btn-primary" onclick="blueGreen_report('+id+')">上报</div>'
                    }else if(data.taskDefKey == 'report' && carShip_isIn(data.people)){
                        html = '<div class="btn-primary" onclick="blueGreen_rereport(1,'+id+')">重新上报</div>'
                    }else if(data.taskDefKey == 'research' && carShip_isIn(data.people)){
                        html = '<div class="btn-primary" style="margin-right: 10px" onclick="blueGreen_deal(0,'+id+')">正常</div>' +
                            '<div class="btn-primary" onclick="blueGreen_deal(1)">异常</div>'
                    }else if(data.taskDefKey == 'leader' && carShip_isIn(data.people)){
                        html = '<div class="btn-primary" onclick="blueGreen_deal()">确认</div>'
                    }
                    $('#blueGreen_btn').html(html)
                }
            }
        }
    })
}

//蓝藻预警上报
function blueGreen_report(id){
    $.ajax({
        url : api + "/mgt/exception/application?id="+ id,
        type : 'get',
        dataType : 'JSON',
        success : function(data) {
            if(data.success){
                myApp.alert("上报成功");
                goBack();
                getBlueGreenList()
            }else{
                myApp.alert("上报失败!");
            }
        },
        error : function() {

        }
    });
}

//蓝藻预警重新上报
function blueGreen_rereport(pass,id){
    $.ajax({
        url : api + "/mgt/exception/saveAudit?id="+ id + '&taskId=' + blueGreenTaskId + '&taskDefKey=' + blueGreenTaskDefKey + '&pass=' + pass,
        type : 'get',
        dataType : 'JSON',
        success : function(data) {
            if(data.success){
                myApp.alert("上报成功");
                goBack();
                getBlueGreenList()
            }else{
                myApp.alert("上报失败!");
            }
        },
        error : function() {
        }
    });
}

//蓝藻预警操作
function blueGreen_deal(pass,id){
    $.ajax({
        url : api + "/mgt/exception/saveAudit?id="+ id + '&taskId=' + blueGreenTaskId + '&taskDefKey=' + blueGreenTaskDefKey + '&pass=' + pass,
        type : 'get',
        dataType : 'JSON',
        success : function(data) {
            if(data.success){
                myApp.alert("操作成功");
                goBack();
                getBlueGreenList()
            }else{
                myApp.alert("操作失败!");
            }
        },
        error : function() {
        }
    });
}

// 获取区县
function getBlueGreenAreaList(code) {
    $.ajax({
        url: api + "/mgt/sysAdcd/adcdList?level=3" ,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            var html = ''
            if(data.length){
                data.map(function(v){
                    if(v.areaName == '文成县' || v.areaName == '泰顺县' || v.areaName == '瑞安市'){
                        html += '<option value="'+v.areaCode+'">'+v.areaName+'</option>'
                    }
                })
            }
            $('#blueGreen_cityCode').append(html)
            $("#blueGreen_cityCode").val(code ? code : '')
            if($('#blueGreen_cityCode').val() != ''){
                getBlueGreenTownList($('#blueGreen_cityCode').val())
            }
        }
    })
}

// 获取区域
var townCode = ''
function getBlueGreenTownList(code) {
    $.ajax({
        url: api + "/mgt/sysAdcd/adcdList?level=4&parentCode=" + code,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            var html = ''
            $('#blueGreen_areaCode').empty()
            if(data.length){
                data.map(function(v){
                    html += '<option value="'+v.townCode+'">'+v.townName+'</option>'
                })
            }
            $('#blueGreen_areaCode').append(html)
            $("#blueGreen_areaCode").val(townCode ? townCode : '')
        }
    })
}

//蓝藻预警保存
function saveBlueGreen(){
    var id = $('#blueGreen_id').text()
    var postData = {
        state: $('#blueGreen_state').val(),
        cityCode: $('#blueGreen_cityCode').val(),
        areaCode: $('#blueGreen_areaCode').val(),
        remark: $('#blueGreen_remark').val()
    }
    if(id){
        postData.id = id
    }
    $.ajax({
        url: api + "/mgt/exception/save",
        type: 'post',
        data: postData,
        success:function(result){
            if(result.success){
                myApp.alert("保存成功");
                goBack();
                getBlueGreenList()
            }else{
                myApp.alert("保存失败!");
            }
        }
    });
}











































//获取巡查路线
async function getRouteLines(routeIds){
   var routeArr = routeIds ? routeIds.split(",") : [];
   for(var i=0;i<routeArr.length;i++){
        await getRouteLineById(routeArr[i]);
   }
}
//根据巡查路线id查详情
async function getRouteLineById(id,name){
    var html = "";
    $.ajax({
        url: api + "/android/getAllPatrolItem",
        type: 'post',
        data: {
             routeId:id
        },
        success:function(result){
            var taskId = $("#taskId").val();
            var workType = $("#workType").val();
            html += `<p>${result.routeName}<span style="float:right; border:1px solid #ddd; padding:.02rem" onclick="startPotrol('${id}','${taskId}','${workType}')">立即巡查</span></p><div class="record-points">`
            for(var j=0;j<result.data.length;j++){
               var resStr = android.getPointStatus(result.data[j].id);
               status = resStr;
               html += `<div class="record-point">
                            <p><span>${j+1}</span>${result.data[j].patrolName}</p>
                            <div class="recordPoint-status">
                                <span>${status}</span>
                            </div>
                        </div>`;
            }
            html += "</div>";
            $(".routeItem-content").append(html);
        }
    });
}

//选择完图片android回调方法
function getImgInfo(flog,img){
    $(".add-goodslist .inGoodImg").each(function(){
        if($(this).attr("data-number") == flog){
            $(this).attr("data-imgIds",img);
        }
    })
}

//巡查上报
function submitPatrol(){
    var taskId = $("#taskId").val();
    var routeIds = $("#taskName").attr("data-routeIds");
    var workType = $("#workType").val();
    android.submitPatrol(taskId,routeIds,workType);
}
//巡查结束返回刷新页面方法
function refreshPatrol(){
    $(".routeItem-content").empty();
    var routeIds = $("#taskName").attr("data-routeIds");
    getRouteLines(routeIds);
}
//获取法律法规
function getlawList(){
    var name = $("#ruleSearch").val();
    $.ajax({
        url: api + "/mgt/lawyer/listJson?fetchAll=true"+"&filename="+name,
        type: 'get',
        success:function(result){
            var html = "";
            for(var i=0;i<result.rows.length;i++){
                var fileUrl = result.rows[i].files[0].fileUrl;
                if(result.rows[i].files[0].fileExt != "pdf"){
                    fileUrl = "";
                }
                html += `<div class="content-item" onclick="lookPDF('${fileUrl}')">
                             <div class="l-box">
                                 <i></i>
                                 <span class="ellipsis">${result.rows[i].filename}</span>
                             </div>
                             <div class="r-box">${result.rows[i].create_time.split(" ")[0]}</div>
                         </div>`
            }
            $(".law-rule .content-list").empty();
            $(".law-rule .content-list").append(html);
        }
    });
}

//获取黑名单列表
function getBlackList(){
     var blackName = $("#blackName").val();
    $.ajax({
            url: api + "/mgt/tempWithholdListController/blacklistGroupName?fetchAll=true&name="+name,
            type: 'get',
            success:function(result){
                var html = "";
                for(var i=0;i<result.data.length;i++){
                    html += `<div class="content-item" style="line-height:.22rem">
                                 <img src="../images/head-portrait.png">
                                 <div class="black-info">
                                     <p><strong>${result.data[i].className}</strong></p>
                                     <p>身份证号:<span>${result.data[i].cardId}</span></p>
                                     <p>手机号:<span>${result.data[i].phone}</span></p>
                                 </div>
                             </div>`
                }
                $(".black-list").empty();
                $(".black-list").append(html);
            }
    })
}