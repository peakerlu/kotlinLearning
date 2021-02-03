var DRAWING = false; //是否正在绘制
var DRAWLAYERS = [];
var BarDRAWLAYERS = [];
var MEASURETOOLTIP;  //量距提示
var MEASUREAREATOOLTIP;  //量面提示
var MEASURERESULT = 0;
var DRAWMOVEPOLYLINE; //绘制过程中的折线
var DRAWPOLYLINEPOINTS = []; //绘制的折线的节点集
var lineOptions = {
    color: '#F54124',
    weight: 3,
    opacity: 0.8,
    fill: false,
    clickable: true
};
var areaOptions = {
    color: '#F54124',
    weight: 3,
    opacity: 0.8,
    fill: true,
    fillColor: null,
    fillOpacity: 0.2,
    clickable: true
}
var DRAWMOVEPOLYGON; //绘制过程中的面
var DRAWPOLYGONPOINTS = []; //绘制的面的节点集
var serviceLink = "http://112.17.127.75:8008/arcgis/rest/services/";
var DRAWCIRCLE; //绘制的圆
var firstApplication = true;//是否第一次缩放或者拖动
var firstLoad = true;//是否首次加

var isMaker = false;//是否正在标点
var isDrawLine = false;//是否正在划线
var isDrawArea = false;//是否正在画面
var _thisMarker;//标点过程中当前点击点
var _thisLine;//选中的折线
var _thisArea;//选中的面
var _lineType;//绘制折线类型 1实线2虚线
var _lineColor;//绘制折线颜色
var isDraw = false;//是否正在标注线/面
//公用图层
var _map;

var _mapLayer
//天地图标注图层偏移量
var tiandituoffsetX = 121.542724 - 121.542091;
var tiandituoffsetY = 29.819915 - 29.820905;

//文字图层
var _baseLayer;   //基础图层
var _hdLineLayer;	//河道线

var _drawLayer;

//影像地图图层
var _yxLayer;
//鄞州区外边界图层
var _outsideBoundary;
//鄞州区镇界
var _townlimitBoundary;

var _bjLayer;//背景图层

var _allhdLayer;	//所有河道线
var _singlehdLayer;   //单个河道线

var _skBaseLayer;     //水库图层

var _borderLayer;	//边界]
var _skmakerLayer;//水库点图层
var _makerLayer;	//标点(move使用)
var _makerDataLayer;	//标点(click使用)
var _drawListLayer;		//标注列表图层
var _clearCoin;
var _buildLayer;//建筑物图层
var borderLayer;//边界图层
var yzBorderLayer;//县界
var yzBorderstatus = 0;
var _polluteLayer;//污染源图层
var _pumpLayer;//泵站图层
var _busProjectLayer;//水利工程图层
var _drainLayer;//排口图层
var _monitorLayer;//监测点位图层
var _waterLevelLater;//水位图层
var _rainDataLater;//雨量图层
var _innerRiverCleanLayer;//内河保洁图层
var _treatmentLayer;//污水处理厂图层
var _sluiceLayer;//水闸图层
var _waterQualityLayer;//水质图层
var _sakaiLayer;//窨井图层
var _pipeNetLayer;//管网图层
//河道图层
var _hdLayer;

var selectRiverId ;

var isShowTip = false;
//参数
var zoom = 11;
//中心点坐标,默认地图层级


//中心点 边界
function setCenter(centerLat, centerLon) {
    if (_map != null) _map.setView(new L.LatLng(centerLat, centerLon), zoom);
}

function centerShow(centerLat, centerLon) {
    if (_map != null) _map.setView(new L.LatLng(centerLat, centerLon), 18);
}

function goCenter(centerLat, centerLon, zoom) {
    if (_map != null) _map.setView(new L.LatLng(centerLat, centerLon), zoom);
}

function InitMap() {
    zoom = _map.getZoom();
}



//加载县界地图
function loadYzBorder() {
    yzBorderLayer = new L.tileLayer(serviceLink + 'yinzhouvillageborder/MapServer/tile/{z}/{y}/{x}', {
        subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
        maxZoom: 20,
        maxNativeZoom: 20,
    });
    yzBorderLayer.addTo(_map);
    yzBorderstatus = 1;
}

//加载水库图层
function loadReservoir(){
    _skBaseLayer= new L.tileLayer(serviceLink+'yinzhoureservoir%e4%bf%ae%e6%ad%a3%e5%90%8e/MapServer/tile/{z}/{y}/{x}', { subdomains: [0, 1, 2, 3, 4, 5, 6, 7], maxZoom: 20, maxNativeZoom: 20,});
    _skBaseLayer.addTo(_map);
}

//加载窨井图层
function loadSakai(){
    _sakaiLayer = new L.tileLayer(serviceLink+'yinzhouWell/MapServer/tile/{z}/{y}/{x}', { subdomains: [0, 1, 2, 3, 4, 5, 6, 7], maxZoom: 20, maxNativeZoom: 20,});
    _sakaiLayer.addTo(_map);
}

//加载管网图层
function loadPipeNet(){
    _pipeNetLayer = new L.tileLayer(serviceLink+'yinzhourpipe/MapServer/tile/{z}/{y}/{x}', { subdomains: [0, 1, 2, 3, 4, 5, 6, 7], maxZoom: 20, maxNativeZoom: 20,});
    _pipeNetLayer.addTo(_map);
}

//清除全部图层
function removeLayers() {
    if (_borderLayer != null) {
        _borderLayer.clearLayers()
    }
    if (_allhdLayer != null) {
        _allhdLayer.clearLayers()
    }
    if (_singlehdLayer != null) {
        _singlehdLayer.clearLayers()
    }
    if (_hdLineLayer != null) {
        _hdLineLayer.clearLayers()
    }
}

//加载河道线
function addLineLine(data) {
    if (_hdLineLayer != null) {
        _hdLineLayer.clearLayers()
    }
    ;
    for (var i = 0; i < data.length; i++) {
        var xj_sons = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {"type": "LineString", "coordinates": data[i]}
                }
            ]
        }
        var line = L.geoJson(xj_sons, {//加载乡镇边界数据
            style: function (feature) {
                return {fillOpacity: '1', fill: false, fillColor: "#128cff", color: "#0ff", opacity: '1', weight: '3'};
            }
        }).addTo(_hdLineLayer)
    }
}

function changeLayers(){
    var elems = $(".tab-layer-list>p.active");
    var selectLayerArr = [];
    for(var i = 0;i<elems.length;i++){
        var name = $(elems[i]).children("span").text();
        selectLayerArr.push(name);
    }
    for(var j=0;j<selectLayerArr.length;j++){
        var layerName = selectLayerArr[j];
        switch (layerName) {
            case '污染源':{
                removeLayer('污染源');
                getPolluteData(selectRiverId);
                break;
            }
            case '泵站':{
                removeLayer('泵站');
                getPumpData(selectRiverId);
                break;
            }
            case '水利工程':{
                removeLayer('水利工程');
                getBusProject(selectRiverId);
                break;
            }
            case '排口':{
                removeLayer('排口');
                getDrainData(selectRiverId);
                break;
            }
            case '水位':{
                removeLayer('水位');
                getWaterLevelData(selectRiverId);
                break;
            }
            case '雨量':{
                removeLayer('雨量');
                getRainData(selectRiverId);
                break;
            }
            case '内河保洁':{
                removeLayer('内河保洁');
                getRecordData(selectRiverId);
                break;
            }
            case '污水处理厂':{
                removeLayer('污水处理厂');
                getTreatmentData(selectRiverId);
                break;
            }
            case '水闸':{
                removeLayer('水闸');
                getSluiceData(selectRiverId);
                break;
            }
            case '水质':{
                removeLayer('水质');
                getWaterQualityData(selectRiverId);
                break;
            }
        }
    }
    if($(".layerInfo_box").css("display") == "block"){
        $(".layerInfo_box>iframe")[0].contentWindow.getSkList();
    }
}

//地图搜索功能
function searchInMap(latlng) {
    var xMin = parseFloat(latlng.lng);
    var xMax = xMin + 0.000046;
    var yMin = parseFloat(latlng.lat);
    var yMax = yMin + 0.000046;
    var data_post = {
        f: "pjson",
        outSR: 4490,
        inSR: 4490,
        maxAllowableOffset: 0,
        returnGeometry: true,
        outFields: "*",
        spatialRel: "esriSpatialRelIntersects",
        geometryType: "esriGeometryEnvelope",
        geometry: '{"xmin":' + xMin + ',"ymin":' + yMin + ',"xmax":' + xMax + ',"ymax":' + yMax + ',"spatialReference":{"wkid":4490}}'
    };
    $.ajax({
        url: serviceLink + "%E6%B2%B3%E9%81%93%E5%BA%95%E5%9B%BE%E8%83%8C%E6%99%AF%e4%bf%ae%e6%ad%a3%e5%90%8e/MapServer/0/query",
        type: "POST",
        dataType: "json",
        data: data_post,
        success: function (data) {
            if (data.features.length) {
                $.ajax({
                    url: serviceLink + "yinzhouvillageborder/MapServer/0/query",
                    type: "POST",
                    dataType: "json",
                    data: data_post,
                    success: function (sts) {
                        if (_clearCoin != null) {
                            _clearCoin.clearLayers()
                        }
                        var msg = data.features[0].attributes;
                        var adName = sts.features[0].attributes.name;
                        addLineLine(data.features[0].geometry.rings, data.features[0].attributes.LEVEL);
                        var htmlText = '<div style="padding:10px 40px;box-shadow: 3px 3px 11px #6a656e;"><span style="font-weight:bold">' + msg.name + '</span></div>';
                        var popup = L.popup({maxWidth: 700, maxHeight: 600})
                            .setLatLng([yMin, xMin])
                            .setContent(htmlText);
                        _map.openPopup(popup);
                        goStreet(adName, msg.name, data.features[0].attributes.ID, true);

                        selectRiverId = data.features[0].attributes.ID;

                        changeLayers();

                        //展开左边信息栏
                        if($(".mapListContent ").css('display')=='none'){
                            if ($(".dataContent").hasClass("active")) {
                                $(".mapListContent").height($("body").height() - 250 - 185);
                            } else {
                                $(".mapListContent").height($("body").height() - 180);
                            }
                            if ($(".drawAllLits").hasClass("active")) {
                                $(".drawAllLits").animate({
                                    "left" : "261px"
                                });
                            }
                            if ($(".layerInfo_box").hasClass("active")) {
                                $(".layerInfo_box").animate({
                                    "left" : "261px"
                                });
                            }
                            $(".mapListBar").addClass("haveBack");
                            $(".mapListContent").slideDown(function() {
                                $(".listBottomBar").addClass("none");
                                $(".mapListUp").removeClass("none");
                            });
                        }
                    }
                })
            } else {
                _map.closePopup();     //点击非选中区域清空已选中高亮要素
                if (_hdLineLayer != null) {
                    _hdLineLayer.clearLayers()
                };
                if (_allhdLayer != null) {
                    _allhdLayer.clearLayers()
                }
                ;
                if (_singlehdLayer != null) {
                    _singlehdLayer.clearLayers()
                }
                ;
                if (_borderLayer != null) {
                    _borderLayer.clearLayers()
                }
                ;
                if (yzBorderstatus == 0) {
                    loadYzBorder()
                }
            }
        }
    })
}

//初始化高度
function init() {
    var h = $("#map").height();
    $("#map").css("height", h + "px");
}

//切换底图
function changeBaseImage(type){
    _mapLayer.remove();
    _yxLayer.remove();
    _bjLayer.remove();
    _hdLayer.remove();
    _townlimitBoundary.remove();
    _outsideBoundary.remove();
    // textLayer.remove();    // _bjLayer.remove();
    if(type == "1"){
        //加载影像地图
        _mapLayer = new L.tileLayer('http://t{s}.tianditu.gov.cn/DataServer?T=vec_c&X={x}&Y={y}&L={z}&tk=434967d31e3d3f9d396b2f4c4250b023', { subdomains: [0, 1, 2, 3, 4, 5, 6, 7], maxZoom: 20, maxNativeZoom: 20});
        _mapLayer.addTo(_map);
        _yxLayer = L.tileLayer('http://t{s}.tianditu.gov.cn/DataServer?T=img_c&X={x}&Y={y}&L={z}&tk=434967d31e3d3f9d396b2f4c4250b023', {subdomains: [0, 1, 2, 3, 4, 5, 6, 7], maxZoom: 20, maxNativeZoom: 20});
        _yxLayer.addTo(_map);
    }else if(type == "2"){
        _mapLayer = new L.tileLayer('http://t{s}.tianditu.gov.cn/DataServer?T=vec_c&X={x}&Y={y}&L={z}&tk=434967d31e3d3f9d396b2f4c4250b023', { subdomains: [0, 1, 2, 3, 4, 5, 6, 7], maxZoom: 20, maxNativeZoom: 20});
        _mapLayer.addTo(_map);
        //加载时空图
        _yxLayer = new L.tileLayer('http://skxxy.nbmap.gov.cn/OneMapServer/rest/services/nbBasemap/MapServer/tile/{z}/{y}/{x}', { subdomains: [0, 1, 2, 3, 4, 5, 6, 7], maxZoom: 18, maxNativeZoom: 20});
        _yxLayer.addTo(_map);
    }else if(type == "3"){
        _mapLayer = new L.tileLayer('http://t{s}.tianditu.gov.cn/DataServer?T=vec_c&X={x}&Y={y}&L={z}&tk=434967d31e3d3f9d396b2f4c4250b023', { subdomains: [0, 1, 2, 3, 4, 5, 6, 7], maxZoom: 20, maxNativeZoom: 20});
        _mapLayer.addTo(_map);
        //加载水利一张图
        _yxLayer = new L.tileLayer('https://sldtptgis.zjwater.com/arcgis/rest/services/basemap/ZLSLVectorMap/MapServer/tile/{z}/{y}/{x}', { subdomains: [0, 1, 2, 3, 4, 5, 6, 7], maxZoom: 18, maxNativeZoom: 20});
        _yxLayer.addTo(_map);
    }else if(type == "4"){
        //空白底图
    }
    //加载背景切片图层
    _bjLayer = new L.tileLayer(serviceLink+'yinzhoumask/MapServer/tile/{z}/{y}/{x}', { subdomains: [0, 1, 2, 3, 4, 5, 6, 7], maxZoom: 20, maxNativeZoom: 20});
    _bjLayer.addTo(_map);
    _hdLayer= new L.tileLayer(serviceLink+'%E9%84%9E%E5%B7%9E%E6%B2%B3%E9%81%93%E8%92%99%E5%B1%82%e4%bf%ae%e6%ad%a3%e5%90%8e/MapServer/tile/{z}/{y}/{x}', { subdomains: [0, 1, 2, 3, 4, 5, 6, 7], maxZoom: 20, maxNativeZoom: 20});
    _hdLayer.addTo(_map);
    if(!$(".tab-layer-list>p.hdToggle").hasClass("active")){
        _hdLayer.setOpacity(0);
    }
    //加载鄞州区镇界
    _townlimitBoundary = new L.tileLayer(serviceLink + "yinzhouvillageborder/MapServer/tile/{z}/{y}/{x}",{ subdomains: [0, 1, 2, 3, 4, 5, 6, 7],maxZoom: 20});
    _townlimitBoundary.addTo(_map);
    //加载鄞州区外边界
    _outsideBoundary = new L.tileLayer(serviceLink + "yinzhouborder/MapServer/tile/{z}/{y}/{x}", { subdomains: [0, 1, 2, 3, 4, 5, 6, 7],maxZoom: 20});
    _outsideBoundary.addTo(_map);


    // //加载文字图层
    // textLayer = new L.tileLayer('http://t{s}.tianditu.gov.cn/DataServer?T=cva_c&X={x}&Y={y}&L={z}&tk=434967d31e3d3f9d396b2f4c4250b023', { subdomains: [0, 1, 2, 3, 4, 5, 6, 7]});
    // textLayer.addTo(_map);

    //加载背景切片图层
    // _bjLayer = new L.tileLayer(serviceLink+'%e9%84%9e%e5%b7%9e%e8%83%8c%e6%99%af%e4%bf%ae%e6%ad%a3%e5%90%8e/MapServer/tile/{z}/{y}/{x}', { subdomains: [0, 1, 2, 3, 4, 5, 6, 7], maxZoom: 20, maxNativeZoom: 20,});
    // _bjLayer.addTo(_map);

    //加载河道底图

}

function removeLayer(name){
    if(name == '河道'){
        if( _hdLayer != null){
            _hdLayer.setOpacity(0);
        }
    }
    if(name == '污染源'){
        if(_polluteLayer != null){
            _polluteLayer.clearLayers();
        }
    }
    if(name == '水库'){
        if(_skBaseLayer != null){
            _skBaseLayer.remove();
        }
        if(_skmakerLayer != null){
            _skmakerLayer.clearLayers();
        }
    }
    if(name == '泵站'){
        if(_pumpLayer != null){
            _pumpLayer.clearLayers();
        }
    }
    if(name == '排口'){
        if(_drainLayer != null){
            _drainLayer.clearLayers();
        }
    }
    if(name == '水利工程'){
        if(_busProjectLayer != null){
            _busProjectLayer.clearLayers();
        }
    }
    if(name == '监测点位'){
        if(_monitorLayer != null){
            _monitorLayer.clearLayers();
        }
    }
    if(name == '水位'){
        if(_waterLevelLater != null){
            _waterLevelLater.clearLayers();
        }
    }
    if(name == '雨量'){
        if(_rainDataLater != null){
            _rainDataLater.clearLayers();
        }
    }
    if(name == '内河保洁'){
        if(_innerRiverCleanLayer != null){
            _innerRiverCleanLayer.clearLayers();
        }
    }
    if(name == '污水处理厂'){
        if(_treatmentLayer != null){
            _treatmentLayer.clearLayers();
        }
    }
    if(name == '水闸'){
        if(_sluiceLayer !=null){
            _sluiceLayer.clearLayers();
        }
    }
    if(name == '水质'){
        if(_waterQualityLayer != null){
            _waterQualityLayer.clearLayers();
        }
    }
    if(name == '窨井'){
        if(_sakaiLayer != null){
            _sakaiLayer.remove();
        }
    }
    if(name == '管网'){
        if(_pipeNetLayer != null){
            _pipeNetLayer.remove();
        }
    }
}

//加载污染源
function showPollute(data){
    if(_polluteLayer != null){
        _polluteLayer.clearLayers();
    }
    var viewIcon = L.icon({
        iconUrl: _ctx+"/styles/plugin/map/images/pollute-map-icon.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    for(var i=0;i<data.length;i++){
        var pointFeature = new L.marker([data[i].latitude,data[i].longitude],{ icon: viewIcon})
            .bindTooltip(data[i].name, { permanent: false, offset : [15,0], direction : "right", className: 'swLayer_tooltip'});
        var popText="<div class='popup-content'>" +
            "<div class='popup-header'><strong>"+isEmpty(data[i].name)+"</strong><span>"+isEmpty(data[i].grade)+"</span></div>" +
            "<div class='popup-info clearfix'><div class='info-item'><span>污染溯源:</span>"+isEmpty(data[i].source)+"</div>" +
            "<div class='info-item'><span>污染类型:</span>"+isEmpty(data[i].type)+"</div>"+
            "<div class='info-item long'><span>地址:</span>"+isEmpty(data[i].address)+"</div>"+
            "</div>" +
            "</div>";
        var popup = L.popup({ maxWidth: 700, maxHeight: 600 })
            .setLatLng([data[i].latitude,data[i].longitude])
            .setContent(popText);
        pointFeature.bindPopup(popup);
        pointFeature.options.sm_sid = 'pollute';
        pointFeature.addTo(_polluteLayer);
    }
}


//加载水库
function showMapSk(data){
    var skIcon= L.icon({
        iconUrl: _ctx+"/styles/plugin/map/images/map-sk-same.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
        className:"sk-map"
    });
    for(var i=0;i<data.length;i++){
        (function(index){
            var row=data[index];
            var typeText = "";
            if(row.type==0){
                typeText = "小一型";
            }else if(row.type==1){
                typeText = "小二型";
            }else if(row.type==2){
                typeText = "中型";
            }
            if(row.lttd&&row.lgtd){
                var pointFeature = new L.marker([row.lttd,row.lgtd], { icon: skIcon, riseOnHover: true, title:row.stationname});
                pointFeature.options.sm_sid = 'sk';
                pointFeature.addTo(_skmakerLayer);
                pointFeature.on("click",function(){
                    if(row.stationname == null){
                        row.stationname = "-"
                    }
                    if(row.jyarea == null){
                        row.jyarea = "-"
                    }
                    if(row.stationname == null){
                        row.stationname = "-"
                    }
                    if(row.tcp == null){
                        row.tcp = "-"
                    }
                    if(row.damh == null){
                        row.damh = "-"
                    }
                    if(row.damw == null){
                        row.damw = "-"
                    }
                    if(row.damhl == null){
                        row.daml = "-"
                    }
                    if(row.pwidth == null){
                        row.pwidth = "-"
                    }
                    if(row.phigh == null){
                        row.phigh = "-"
                    }
                    var htmlText="<div style='width:600px;padding:20px;'><table class='sk-map-table'>"+
                        "<tr><th colspan='4' class='tit_all'>水库工程信息<i class='skInfo_close right'></i></th></tr>"+
                        "<tr><th colspan='4' class='tit'><i></i>基本信息</th></tr>"+
                        "<tr><th>水库名称</th><td>"+row.stationname+"</td><th>所在乡镇</th><td>"+row.townADNM+"</td></tr>"+
                        "<tr><th>集雨面积(km²)</th><td>"+row.jyarea+"</td><th>总库容(万m³)</th><td>"+row.tcp+"</td></tr>"+
                        "<tr><th>类型</th><td>"+typeText+"</td><th>输水形式(cm)</th><td>"+row.watertype+"</td></tr>"+
                        "<tr><th>主要功能</th><td colspan='3'>"+row.majorF+"</td></tr>"+
                        "<tr><th colspan='4' class='tit'><i></i>大坝</th></tr>"+
                        "<tr><th>坝型</th><td>"+row.damtype+"</td><th>坝高(m)</th><td>"+row.damh+"</td></tr>"+
                        "<tr><th>坝宽(m)</th><td>"+row.damw+"</td><th>坝长(m)</th><td>"+row.daml+"</td></tr>"+
                        "<tr><th colspan='4' class='tit'><i></i>溢洪道</th></tr>"+
                        "<tr><th>宽度(m)</th><td>"+row.pwidth+"</td><th>高度(m)</th><td>"+row.phigh+"</td></tr>"+
                        "</table></div>";
                    // var popup = L.popup({
                    //     maxWidth : 700,
                    //     maxHeight : 600
                    // }).setLatLng([row.lttd,row.lgtd])
                    //     .setContent(htmlText);
                    // _map.openPopup(popup);
                    if($(".mapListContent").css("display") == "block"){
                        $(".mapListUp").trigger("click");
                    }
                    // layer.close(skLayerIndex);
                    // isShowSKLayer = false;
                    if($(".map>.info-layer").css("display","none")){
                        $(".map>.info-layer").fadeToggle("slow","linear");
                    }
                    $(".map>.info-layer").empty();
                    $(".map>.info-layer").append(htmlText);
                    $(".skInfo_close").click(function(){
                        if($(".map>.info-layer").css("display") == "block"){
                            $(".map>.info-layer").fadeOut("slow","linear");
                        }
                    })
                });
            }
        })(i)
    }
}

//加载水位
function showWaterLevel(data){
    var viewIcon = L.icon({
        iconUrl: _ctx+"/styles/plugin/map/images/water-level-icon.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    for(var i=0;i<data.length;i++){
        var name = data[i].stationName + ": " + data[i].data + "m";
        var pointFeature = new L.marker([data[i].latitude,data[i].longitude],{ icon: viewIcon})
            .bindTooltip(name, { permanent: false, offset : [15,0], direction : "right", className: 'swLayer_tooltip'});
        var popText="<div class='popup-content' style='width: 380px;'>" +
            "<div class='popup-header'><strong>"+isEmpty(data[i].stationName)+"</strong></div>" +
            "<div class='popup-info clearfix'><div class='info-item'><span>当前水位:</span>"+isEmpty(data[i].data)+"m</div>" +
            "</div>" +
            "</div>";
        var popup = L.popup({ maxWidth: 700, maxHeight: 600 })
            .setLatLng([data[i].latitude,data[i].longitude])
            .setContent(popText);
        pointFeature.bindPopup(popup);
        pointFeature.options.sm_sid = 'waterLevel';
        pointFeature.addTo(_waterLevelLater);
    }
}

//加载雨量
function showRainData(data){
    var viewIcon = L.icon({
        iconUrl: _ctx+"/styles/plugin/map/images/rain-data-icon.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    for(var i=0;i<data.length;i++){
        var name = data[i].stationName + ": " + data[i].data + "mm";
        var pointFeature = new L.marker([data[i].latitude,data[i].longitude],{ icon: viewIcon})
            .bindTooltip(name, { permanent: false, offset : [15,0], direction : "right", className: 'swLayer_tooltip'});
        var popText="<div class='popup-content' style='width: 380px;'>" +
            "<div class='popup-header'><strong>"+isEmpty(data[i].stationName)+"</strong></div>" +
            "<div class='popup-info clearfix'><div class='info-item'><span>当前雨量:</span>"+isEmpty(data[i].data)+"mm</div>" +
            "</div>" +
            "</div>";
        var popup = L.popup({ maxWidth: 700, maxHeight: 600 })
            .setLatLng([data[i].latitude,data[i].longitude])
            .setContent(popText);
        pointFeature.bindPopup(popup);
        pointFeature.options.sm_sid = 'rain';
        pointFeature.addTo(_rainDataLater);
    }
}

//加载内河保洁
function showRecordData(data){
    var viewIcon = L.icon({
        iconUrl: _ctx+"/styles/plugin/map/images/innerRiver-clean-icon.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    for(var i=0;i<data.length;i++){
        var name = data[i].companyName;
        var pointFeature = new L.marker([data[i].latitude,data[i].longitude],{ icon: viewIcon})
            .bindTooltip(name, { permanent: false, offset : [15,0], direction : "right", className: 'swLayer_tooltip'});
        var popText="<div class='popup-content'>" +
            "<div class='popup-header'><strong>"+isEmpty(data[i].companyName)+"</strong><span>"+isEmpty(data[i].cleanTime)+"</span></div>" +
            "<div class='popup-info clearfix'><div class='info-item'><span>保洁员:</span>"+isEmpty(data[i].executorName)+"</div>" +
            "<div class='info-item'><span>联系方式:</span>"+isEmpty(data[i].executorPhone)+"</div>"+
            "<div class='info-item long'><span>保洁情况:</span>"+isEmpty(data[i].situation)+"</div>"+
            "</div>" +
            "</div>";
        var popup = L.popup({ maxWidth: 700, maxHeight: 600 })
            .setLatLng([data[i].latitude,data[i].longitude])
            .setContent(popText);
        pointFeature.bindPopup(popup);
        pointFeature.options.sm_sid = 'innerRiverClean';
        pointFeature.addTo(_innerRiverCleanLayer);
    }
}

//加载污水处理厂图层
function showTreatmentData(data){
    var viewIcon = L.icon({
        iconUrl: _ctx+"/styles/plugin/map/images/treatment-map-icon.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    for(var i=0;i<data.length;i++){
        var name = data[i].name;
        var pointFeature = new L.marker([data[i].latitude,data[i].longitude],{ icon: viewIcon})
            .bindTooltip(name, { permanent: false, offset : [15,0], direction : "right", className: 'swLayer_tooltip'});
        var popText="<div class='popup-content'>" +
            "<div class='popup-header'><strong>"+isEmpty(data[i].name)+"</strong><span>"+isEmpty(data[i].resolveAbility)+"吨/日</span></div>" +
            "<div class='popup-info clearfix'><div class='info-item long'><span>污水处理方法:</span>"+isEmpty(data[i].resolveMethod)+"</div>" +
            "<div class='info-item'><span>废水进口数量:</span>"+isEmpty(data[i].innerNum)+"</div>"+
            "<div class='info-item'><span>废水排口数量:</span>"+isEmpty(data[i].outerNum)+"</div>"+
            "<div class='info-item'><span>污水处理工艺:</span>"+isEmpty(data[i].soilResoilve)+"</div>"+
            "<div class='info-item'><span>设计负荷:</span>"+isEmpty(data[i].designPayload)+"m³/天</div>"+
            "<div class='info-item'><span>负责人:</span>"+isEmpty(data[i].leaderName)+"</div>"+
            "<div class='info-item'><span>联系方式:</span>"+isEmpty(data[i].leaderPhone)+"</div>"+
            "<div class='info-item long'><span>地址:</span>"+isEmpty(data[i].address)+"</div>"+
            "</div>" +
            "</div>";
        var popup = L.popup({ maxWidth: 700, maxHeight: 600 })
            .setLatLng([data[i].latitude,data[i].longitude])
            .setContent(popText);
        pointFeature.bindPopup(popup);
        pointFeature.options.sm_sid = 'treatment';
        pointFeature.addTo(_treatmentLayer);
    }
}

//加载水闸图层
function showSluiceData(data){
    var viewIcon = L.icon({
        iconUrl: _ctx+"/styles/plugin/map/images/sluice-map-icon.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    for(var i=0;i<data.length;i++){
        var name = data[i].name;
        var pointFeature = new L.marker([data[i].latitude,data[i].longitude],{ icon: viewIcon})
            .bindTooltip(name, { permanent: false, offset : [15,0], direction : "right", className: 'swLayer_tooltip'});
        var popText="<div class='popup-content'>" +
            "<div class='popup-header'><strong>"+isEmpty(data[i].name)+"</strong><span>"+isEmpty(data[i].type)+"</span></div>" +
            "<div class='popup-info clearfix'><div class='info-item'><span>所属街道:</span>"+isEmpty(data[i].adnm)+"</div>" +
            "<div class='info-item'><span>河道名称:</span>"+isEmpty(data[i].riverName)+"</div>"+
            "<div class='info-item long'><span>特性:</span>"+isEmpty(data[i].specifications)+"</div>"+
            "</div>" +
            "</div>";
        var popup = L.popup({ maxWidth: 700, maxHeight: 600 })
            .setLatLng([data[i].latitude,data[i].longitude])
            .setContent(popText);
        pointFeature.bindPopup(popup);
        pointFeature.options.sm_sid = 'sluice';
        pointFeature.addTo(_sluiceLayer);
    }
}

//加载水质图层
function showWaterQualityData(data){
    var viewIcon = L.icon({
        iconUrl: _ctx+"/styles/plugin/map/images/waterQuality-map-icon.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    for(var i=0;i<data.length;i++){
        if(data[i].latitude&&data[i].longitude){
            var name = data[i].stationName;
            var pointFeature = new L.marker([data[i].latitude,data[i].longitude],{ icon: viewIcon})
                .bindTooltip(name, { permanent: false, offset : [15,0], direction : "right", className: 'swLayer_tooltip'});
            var popText="<div class='popup-content'>" +
                "<div class='popup-header'><strong>"+isEmpty(data[i].stationName)+"</strong><span>2019年8月</span></div>" +
                "<div class='popup-info clearfix'><div class='info-item'><span>总磷:</span>"+isEmpty(data[i].pData)+"mg/L</div>" +
                "<div class='info-item'><span>氨氮:</span>"+isEmpty(data[i].nhData)+"mg/L</div>"+
                "<div class='info-item'><span>高锰酸盐:</span>"+isEmpty(data[i].kmnData)+"mg/L</div>"+
                "<div class='info-item'><span>ph值:</span>"+isEmpty(data[i].ph)+"</div>"+
                "<div class='info-item'><span>透明度:</span>"+isEmpty(data[i].capacity)+"cm</div>"+
                "</div>" +
                "</div>";
            var popup = L.popup({ maxWidth: 700, maxHeight: 600 })
                .setLatLng([data[i].latitude,data[i].longitude])
                .setContent(popText);
            pointFeature.bindPopup(popup);
            pointFeature.addTo(_waterQualityLayer);
        }
    }
}


//加载泵站
function showPump(data){
    if(_pumpLayer != null){
        _pumpLayer.clearLayers();
    }
    var viewIcon = L.icon({
        iconUrl: _ctx+"/styles/plugin/map/images/pump-map-icon.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    for(var i=0;i<data.length;i++){
        var name = data[i].name;
        var pointFeature = new L.marker([data[i].latitude,data[i].longitude],{ icon: viewIcon})
            .bindTooltip(name, { permanent: false, offset : [15,0], direction : "right", className: 'swLayer_tooltip'});
        var isFinish = data[i].isFinish == 1 ? '已完工' : '未完工';
        var popText="<div class='popup-content'>" +
            "<div class='popup-header'><strong>"+isEmpty(data[i].name)+"</strong><span>"+isEmpty(data[i].usage)+"</span></div>" +
            "<div class='popup-info clearfix'><div class='info-item'><span>开工时间:</span>"+isEmpty(data[i].adnm)+"</div>" +
            "<div class='info-item'><span>完工时间:</span>"+isEmpty(data[i].finishTime)+"</div>"+
            "<div class='info-item'><span>所在村:</span>"+isEmpty(data[i].village)+"</div>"+
            "<div class='info-item'><span>泵站种类:</span>"+isEmpty(data[i].type)+"</div>"+
            "<div class='info-item'><span>设计流量:</span>"+isEmpty(data[i].degisnFlow)+"m³/h</div>"+
            "<div class='info-item'><span>实际流量:</span>"+isEmpty(data[i].trueFlow)+"m³/h</div>"+
            "</div>" +
            "</div>";
        var popup = L.popup({ maxWidth: 700, maxHeight: 600 })
            .setLatLng([data[i].latitude,data[i].longitude])
            .setContent(popText);
        pointFeature.bindPopup(popup);
        pointFeature.options.sm_sid = 'pump';
        pointFeature.addTo(_pumpLayer);
    }
}

//加载水利工程
function showBusProject(data){
    if(_busProjectLayer != null){
        _busProjectLayer.clearLayers();
    }
    var viewIcon = L.icon({
        iconUrl: _ctx+"/styles/plugin/map/images/project-map-icon.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    for(var i=0;i<data.length;i++){
        var name = data[i].name;
        var isReception = data[i].reception == '是' ? '已验收' : '未验收';
        var pointFeature = new L.marker([data[i].latitude,data[i].longitude],{ icon:
            viewIcon,title:name});
        var popText="<div class='popup-content'>" +
            "<div class='popup-header'><strong>"+isEmpty(name)+"</strong><span></span></div>" +
            "<div class='popup-info clearfix'><div class='info-item'><p><i></i><span>工程类型</span></p><p>"+isEmpty(data[i].type)+"</p></div>" +
            "<div class='info-item'><p><i></i><span>经度</span></p><p>"+isEmpty(data[i].longitude)+"</p></div>"+
            "<div class='info-item'><p><i></i><span>纬度</span></p><p>"+isEmpty(data[i].latitude)+"</p></div>"+
            "<div class='info-item'><p><i></i><span>造价</span></p><p>"+isEmpty(data[i].price)+"万元</p></div>"+
            "<div class='info-item'><p><i></i><span>是否验收</span></p><p>"+isEmpty(isReception)+"</p></div>"+
            "<div class='info-item'><p><i></i><span>验收时间</span></p><p>"+isEmpty(data[i].receptionTime)+"</p></div>"+
            "</div>" +
            // "<div class='pop-imgArea clearfix'>" +
            // "<img src='"+_ctx+"/styles/plugin/map/images/test-img1.png'>"+
            // "<img src='"+_ctx+"/styles/plugin/map/images/test-img2.png'>"+
            // "<img src='"+_ctx+"/styles/plugin/map/images/test-img3.png'></div>" +
            "</div>";
        var popup = L.popup({ maxWidth: 700, maxHeight: 600 })
            .setLatLng([data[i].latitude,data[i].longitude])
            .setContent(popText);
        pointFeature.bindPopup(popup);
        pointFeature.addTo(_busProjectLayer);
    }
}

//加载排口数据
function showDrainData(data){
    if(_drainLayer != null){
        _drainLayer.clearLayers();
    }
    var viewIcon = L.icon({
        iconUrl: _ctx+"/styles/plugin/map/images/drain-map-icon.png",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    for(var i=0;i<data.length;i++) {
        var name = data[i].name+"<br/>编码:"+isEmpty(data[i].code);
        if(isShowTip){
            var pointFeature = new L.marker([data[i].latitude, data[i].longitude], {icon: viewIcon})
                .bindTooltip(name, { permanent: true, offset : [15,0], direction : "right", className: 'swLayer_tooltip'}).openTooltip();
        }else{
            var pointFeature = new L.marker([data[i].latitude, data[i].longitude], {icon: viewIcon})
                .bindTooltip(name, { permanent: false, offset : [15,0], direction : "right", className: 'swLayer_tooltip'});
        }
        var popText="<div class='popup-content'>" +
            "<div class='popup-header'><strong>"+isEmpty(data[i].name)+"</strong><span>"+isEmpty(data[i].code)+"</span></div>" +
            "<div class='popup-info clearfix'><div class='info-item'><span>排放方式:</span>"+isEmpty(data[i].emission)+"</div>" +
            "<div class='info-item'><span>入河方式:</span>"+isEmpty(data[i].innerWay)+"</div>"+
            "<div class='info-item'><span>排口种类:</span>"+isEmpty(data[i].type)+"</div>"+
            "<div class='info-item'><span>污水性质:</span>"+isEmpty(data[i].nature)+"</div>"+
            "<div class='info-item'><span>排放水量:</span>"+isEmpty(data[i].volume)+"</div>"+
            "<div class='info-item'><span>排放管径:</span>"+isEmpty(data[i].diameter)+"</div>"+
            "</div>" +
            "</div>";
        var popup = L.popup({ maxWidth: 700, maxHeight: 600 })
            .setLatLng([data[i].latitude,data[i].longitude])
            .setContent(popText);
        pointFeature.bindPopup(popup);
        pointFeature.options.sm_sid = 'drain';
        pointFeature.addTo(_drainLayer);
    }
}

//加载视频
function showMapSp(data){
    var videoIcon= L.icon({
        iconUrl: _ctx+"/styles/plugin/map/images/map-sp.png",
        iconSize: [20, 24],
        iconAnchor: [10, 12],
        popupAnchor: [0, -12],
        className:"video-map map-none"
    });
    for(var i=0;i<data.length;i++){
        (function(index){
            var row=data[index];
            if(row.latitude&&row.longitude){
                var pointFeature = new L.marker([row.latitude,row.longitude], { icon: videoIcon, riseOnHover: true, title:row.videoName}).addTo(_makerLayer);
                pointFeature.on("click",function(){
                    var url = _ctx+"/map/videoDetail?id=" + row.id;
                    $.dialog({
                        lock : true,
                        background : '#000', /* 背景色 */
                        opacity : 0.5, /* 透明度 */
                        title : "视频列表",
                        max : false,
                        min : false,
                        width : '750px',
                        height : '500px',
                        content : "url:"+url
                    });
                });
            }
        })(i)
    }
}

function isEmpty(value){
    if(value == undefined || value == null || value == 'null' ){
        value = '-';
    }
    return value;
}


//加载所有河道面
function addAllRiver(data){
    if(_allhdLayer!=null){_allhdLayer.clearLayers()};
    for(var i=0;i<data.length;i++){
        var row=data[i];
        for(var x=0;x<row.geometry.rings.length;x++){
            var xj_sons={ "type": "FeatureCollection",
                "features": [
                    { "type": "Feature",
                        "geometry": {"type": "LineString", "coordinates": row.geometry.rings[x]}
                    }
                ]
            }
            var line=L.geoJson(xj_sons,{//加载乡镇边界数据
                style: function (feature) {
                    return {fillOpacity:'1',fill:false,fillColor:"#0ff",color:"#0ff",opacity:'1',weight:'3'};
                }
            }).addTo(_allhdLayer)
        }
    }
}

//加载边界线
function addBorderLing(data){
    if(_borderLayer!=null){_borderLayer.clearLayers()};
    yzBorderLayer.remove();
    yzBorderstatus = 0;
    for(var i=0;i<data.length;i++){
        var row=data[i];
        // for(var x=0;x<row.geometry.ri_makerLayerngs.length;x++){
            var xj_sons={ "type": "FeatureCollection",
                "features": [
                    { "type": "Feature",
                        "geometry": {"type": "LineString", "coordinates": row.geometry.rings[0]}
                    }
                ]
            }
            var line=L.geoJson(xj_sons,{//加载乡镇边界数据
                style: function (feature) {
                    return {fillOpacity:'1',fill:false,fillColor:"#e90ee6",color:"#e90ee6",opacity:'1',weight:'4',dashArray:'10'};
                }
            }).addTo(_borderLayer)
        }
    // }
}

function goStreet(rName) {
    $.ajax({
        url: serviceLink + "%e6%b2%b3%e9%81%93%e5%ba%95%e5%9b%be%e8%83%8c%e6%99%af%e4%bf%ae%e6%ad%a3%e5%90%8e/MapServer/find",
        type: "POST",
        dataType: "json",
        data: {
            searchText: rName,
            searchFields: "NAME",
            layers: 0,
            f: "pjson"
        },
        success: function (data) {
            addLineLine(data.results[0].geometry.rings, data.results[0].attributes.LEVEL);
        }
    })
}







