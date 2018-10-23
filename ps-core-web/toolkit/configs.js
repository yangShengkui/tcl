/*! Proudsmart config.js
 * ================
 * 这是一个提供jQuery下可用的全局配置
 *
 */
if(typeof jQuery === "undefined") {
  throw new Error("ProudSmart requires jQuery");
}

/**
 * 事件名称扩展设置
 */
Event.DOMAINDEVICESINIT = "domainDevicesInit"; //资源域信息设备列表初始化
Event.DOMAININFOSINIT = "domainInfosInit"; //资源域信息初始化
Event.USERGROUPINIT = "userGroupInit"; //用户组用户列表初始化
Event.USERCENTERINIT = "UserCenterInit"; //用户中心列表初始化
Event.APPROVEINIT = "approveInit"; //接入认证列表初始化
Event.CLIENTMANAGEINIT = "clientManageInit"; //客户列表初始化
Event.REPORTTREEINIT = "reportTreeInit"; //报表目录树列表初始化
Event.SUPPLIERMANAGEINIT = "supplierManageInit"; //供应商列表初始化
Event.CURRENTINFOSINIT = "currentInfosInit"; //权限信息初始化
Event.FUNCTIONINFOSINIT = "functionInfosInit"; //tree信息初始化
Event.DOMAININFOSINIT = "domainInfosInit"; //tree域信息初始化
Event.ECHARTINFOSINIT = "echartInfosInit"; //echart信息初始化
Event.ECHARTMAPINFOSINIT = "echartMapInfosInit"; //echart信息初始化
Event.ECHARTMAPINFOSCHANGE = "echartMapInfosChange"; //echart信息初始化
Event.ALERTINFOSINIT = "alertInfosInit"; //告警信息初始化
Event.USERINFOSINIT = "userInfosInit"; //用户信息初始化
Event.GROUPINFOSINIT = "groupInfosInit"; //工作组信息初始化
Event.CMDBINFOSINIT = "cmdbInfosInit"; //cmdb信息初始化
Event.CMDBINFOS4MAPINIT = "cmdbInfos4mapInit"; //cmdb信息初始化
Event.ATTREDITINIT = "attrEditInit"; //属性设置初始化
Event.KPIEDITINIT = "kpiEditInit"; //kpi设置初始化
Event.ALERTEDITINIT = "alertEditInit"; //告警设置初始化
Event.WORKORDERINIT = "workOrderInit"; //工单管理初始化
Event.WORKORDERRECORDINIT = "workOrderRecordInit"; //工单任务初始化
Event.DIRECTIVESINIT = "directivesInit"; //指令管理初始化
Event.UNITTYPEINIT = "unitTypeInit"; //设备型号初始化
Event.WORKORDERTYPEINIT = "workOrderTypeInit"; //工单类型维护初始化
Event.INSPECTIONRECORDS = "inspectionRecords"; //巡检记录初始化
Event.INSPECTIONSTANDARD = "inspectionStandard"; //巡检标准初始化
Event.TEAM2USERINIT = "team2userInit"; //班组关联用户初始化
Event.TEAM2DEVICEINIT = "team2deviceInit"; //班组关联设备初始化
Event.STOREINIT = "storeInit"; //备件管理出入库初始化
Event.STATSINIT = "statsInit"; //备件统计初始化
Event.CONTECTITEMSINIT = "contectitemsInit"; //项目条款管理
Event.ALERTRULESINIT = "alertRulesInit"; //告警规则
Event.PROJECTMANAGEINIT = "projectmanageInit"; //合同管理
Event.LINEBODYMANAGEINIT = "linebodymanageInit"; //线体管理查询初始化
Event.SELDEVICEINIT = "seldeviceInit"; //项目条款管理中关联设备
Event.PRODEVICEINIT = "prodeviceInit"; //合同管理中查看设备
Event.SPAREININIT = "spareinInit"; //入库单信息初始化
Event.SPAREOUTINIT = "spareoutInit"; //出库单信息初始化
Event.FAULTKNOWLEDGEINIT = "faultknowledgeInit"; //故障知识初始化
Event.INSPARECLAUSESINIT = "inspareclausesInit"; //入库单添加条目
Event.OUTSPARECLAUSESINIT = "outspareclausesInit"; //出库单添加条目
Event.CONFIGGROUPINIT = "configGroupInit"; //配置项
Event.CONFIGINSINIT = "configInsInit"; //配置实例
Event.REPORTMODULE = "reportModule"; //报名模板事件用
Event.ENTERPRISEINIT = "enterPriseInit"; //能耗企业信息

$.ProudSmart = {};
$.ProudSmart.message = {
  noDataInfo : "没有符合条件的记录",
  saveVerify: function(info) {
    return "当前有未保存的" + info + "，请完成该操作"
  }
};
$.ProudSmart.datatable = {
  //仅有底部按钮的dom
  footerdom: '<"row"<"clo-lg-12">>t<"row footerdom"<"col-lg-3"l><"col-lg-2"i><"col-lg-7"p>>',
  //有头部并且带有搜索框且可以替换special按钮的dom
  specialdom: '<"row specialdom"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row footerdom"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
  //有头部没有搜索框且可以替换special按钮的dom
  special2dom: '<"row specialdom"<"col-sm-12 margin-bottom-5"<"special-btn">>><"row footerdom"<"clo-sm-12">>t<"row"<"col-sm-2"l><"col-sm-2"i><"col-sm-8"p>>',
  //中文显示
  language: {
    lengthMenu: "每页显示 _MENU_ 项",
    zeroRecords: "<i class='fa fa-success text-danger'></i>"+$.ProudSmart.message.noDataInfo,
    info: "第 _START_ 至 _END_ 项，共 _TOTAL_ 项",
    infoEmpty: "第 0 至 0 项，共 0 项",
    infoFiltered: "",
    loadingRecords: "载入中...",
    processing: "处理中...",
    search: "筛选:",
    paginate: {
      first: "首页",
      last: "末页",
      next: "下页",
      previous: "上页"
    }
  },
  //单选时使用
  singleSelect: {
    style: 'single',
    info: false
  },
  //多选时使用
  select: {
    style: 'multi',
    selector: 'td:first-child input[type="checkbox"]',
    info: false
  },
  //选择select时，在第一列使用
  selectCol: {
    data: "selected",
    title: '<input id="allselect-btn" type="checkbox">',
    width: "8px"
  },
  //1个操作项
  optionCol1: {
    data: "option",
    orderable: false,
    title: "操作",
    width: "41px"
  },
  //2个操作项
  optionCol2: {
    data: "option",
    orderable: false,
    title: "操作",
    width: "100px"
  },
  //3个操作项
  optionCol3: {
    data: "option",
    orderable: false,
    title: "操作",
    width: "144px"
  }
};
$.fn.imageprev = function(){
  var cur = this;
  var init = function(){
    cur.css("width", "100%");
    cur.css("position", "relative");
    cur.css("height", "300px");
    cur.css("background-repeat", "no-repeat");
    cur.css("background-size", "contain");
    cur.css("background-position", "center center");
    cur.css("background-color", "#eee");
    cur.css("border", "1px solid #ddd");
  };
  var changeSrc = function(src){
    cur.css("background-image", "url(" + src + ")");
  };
  var clear = function(){
    cur.css("background-image", "url()");
  };
  if(arguments.length == 0){
    init()
  } else {
    if(arguments[0] == "option"){
      var fun = arguments[1];
      var val = arguments[2] || "";
      eval(fun + "(\"" + val + "\")")
    }
  }
};
