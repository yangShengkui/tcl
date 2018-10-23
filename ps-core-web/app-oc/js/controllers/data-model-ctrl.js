define(['controllers/controllers','Array'], function (controllers) {
  'use strict';
  controllers.initController('dataModelCtrl', ['$scope', '$q', '$rootScope', '$location', '$routeParams', '$timeout', 'kqiManagerUIService','userRoleUIService', 'resourceUIService','userLoginUIService', 'Info', 'growl', 'userEnterpriseService', 'viewFlexService','userDomainService', "$window", "freeboardservice", 'dialogue', "ngDialog",
    function (scope, q, rootScope, $location, $routeParams, timeout, kqiManagerUIService, userRoleUIService, resourceUIService, userLoginUIService, Info, growl, userEnterpriseService, viewFlexService, userDomainService, window, freeboardservice, dialogue, ngDialog) {
      /** {"id":10075,"name":"客户月新增数888hhh","desc":"0","kpiId":3043,"schedule":"0 18 0 1 * ?","targetType":"all","target":null,"targetResource":null,"expression":"var dateList = new (Java.type(\"java.util.ArrayList\"));\ndateList.add(core.getMonthStart(1));\ndateList.add(core.getMonthStart(0));\nvar values=core.count(\"resource\",\"domains\",{\"modelId\":301,\"createTime\":dateList});\ncore.toKpiValues(values,{domainPath:\"domains\",value:\"count\"});","scriptType":"js","domainPath":"/0/141935137496068/","createTime":"2017-04-28T09:58:00.394+0000","updateTime":"2017-05-05T11:20:45.997+0000","solutionId":0,"enable":true,"real":false,"granularity":1,"granularityUnit":"MONTH","dataType":0,"domainCalcType":1,"aggregateType":null,"forecastMethod":null}*/
      var TEXT = {
        "SUBMIT" : "确定",
        "CANCEL" : "取消"
      };
      var targetTypes=[{id:"all",label:"全库"},{id:"root",label:"企业级"},{id:"domain",label:"资源域"},{id:"model",label:"模型"},{id:"device",label:"设备"}];
      var scriptTypes=[{id:"js",label:"js"},{id:"python",label:"python"},{id:"groovy",label:"groovy"},{id:"spring",label:"spring"}];
      var dataTypes=[{id:0,label:"原始数据"},{id:1,label:"聚合数据"},{id:2,label:"预测数据"}];
      var granularityUnits=[{id:"MINUTE",label:"每分钟"},{id:"HOUR",label:"每小时"},{id:"DAY",label:"每天"},
        {id:"WEEK",label:"每周"},{id:"MONTH",label:"每月"}/**,{id:"QUARTER",label:"每季度"}*/,
        {id:"YEAR",label:"每年"}];
      var domainCalcTypes=[{id:0,label:"不汇聚"},{id:1,label:"所有域"},{id:2,label:"企业域"}];
      var getKqiCalcRules = function(callback){
        $$.cacheAsyncData.call(kqiManagerUIService.getKqiCalcRules, [], function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
      };
      var getKpisByModelId = function(modelId, callback){
        $$.cacheAsyncData.call(resourceUIService.getKpisByModelId, [modelId], function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
      };
      var getKqiModels = function(callback){
        $$.cacheAsyncData.call(kqiManagerUIService.getKqiModels, [], function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
      };
      var getModels = function(callback){
        $$.cacheAsyncData.call(resourceUIService.getModels, [], function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
      };
      var queryDomainTree = function(callback){
        $$.cacheAsyncData.call(userDomainService.queryDomainTree, [userLoginUIService.user.userID], function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
      };
      /**
      var addKqiCalcRule = function(param, callback){
        kqiManagerUIService.addKqiCalcRule(param, function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
      };
      var updateKqiCalcRule = function(param, callback){
        kqiManagerUIService.updateKqiCalcRule(param, function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
      };*/
      var deleteKqiCalcRule = function(param, callback){
        var fnlist = [{
          label: TEXT.SUBMIT,
          icon: 'btn btn-success',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            ngDialog.close();
            kqiManagerUIService.deleteKqiCalcRule(param, function(event){
              callback(event);
            });
          }
        }, {
          label: TEXT.CANCEL,
          icon: 'btn btn-default',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            ngDialog.close();
          }
        }];
        scope.dialog = {
          title: {
            label: '提示'
          },
          description: {
            label: '确认要删除此KQI吗？'
          },
          fnlist: fnlist
        };
        ngDialog.open({
          template: '../partials/dialogue/common_dia_prompt.html',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      };
      var getKqiModelById = function(id, callback){
        $$.cacheAsyncData.call(kqiManagerUIService.getKqiModelById, [id], function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
      };
      var init = function(){
        getModels(function(){});
        getKqiModels(function(){});
        queryDomainTree(function(dtree){
          var domaintree = {
            nodes : dtree,
            domainInfos : dtree
          };
          getKqiCalcRules(function(calcRules){
            var editCalcRules = function(target){
              getKqiModels(function(allKqiModels){
                getModels(function(obj){
                  var allModels = [{
                    id : 300,
                    label : "管理域"
                  },{
                    id : 301,
                    label : "客户"
                  },{
                    id : 302,
                    label : "项目"
                  }].concat(obj);
                  var hours = (function(){
                    var rs = [];
                    for(var i = 0; i < 24; i++){
                      rs.push({
                        "id" : i,
                        "label" : i
                      });
                    };
                    return rs;
                  })();
                  var weekdays = [{
                    id : 1,
                    label : "一"
                  },{
                    id : 2,
                    label : "二"
                  },{
                    id : 3,
                    label : "三"
                  },{
                    id : 4,
                    label : "四"
                  },{
                    id : 5,
                    label : "五"
                  },{
                    id : 6,
                    label : "六"
                  },{
                    id : 7,
                    label : "日"
                  }];
                  var months = [{
                    id : 1,
                    label : "一"
                  },{
                    id : 2,
                    label : "二"
                  },{
                    id : 3,
                    label : "三"
                  },{
                    id : 4,
                    label : "四"
                  },{
                    id : 5,
                    label : "五"
                  },{
                    id : 6,
                    label : "六"
                  },{
                    id : 7,
                    label : "七"
                  },{
                    id : 8,
                    label : "八"
                  },{
                    id : 9,
                    label : "九"
                  },{
                    id : 10,
                    label : "十"
                  },{
                    id : 11,
                    label : "十一"
                  },{
                    id : 12,
                    label : "十二"
                  }];
                  var varnamelist = calcRules.map(function(elem){
                    return elem.name;
                  });
                  var initResource = allModels[0].id, initKqiModel = 0;
                  var initInputMapping = {};
                  var initModel = "model";
                  /**
                  if(target){
                    initModel = target.targetType;
                  } else {
                    initModel = targetTypes[0].id;
                  };*/
                  if(target){
                    if(target.targetResource){
                      initResource = parseInt(target.targetResource);
                    } else {
                      initResource = -1;
                    }
                  };
                  if(target){
                    initKqiModel = (target.expertDataModelId != undefined) ? target.expertDataModelId : 0;
                  };
                  if(target){
                    initInputMapping = target.inputMapping;
                    if(!initInputMapping){
                      initInputMapping = {};
                    };
                  };
                  var start = function(kpis, viewContent){
                    var varialbes = {};
                    var loopVariable = function(variable){
                      varialbes[variable.name] = initInputMapping[variable.name] ? initInputMapping[variable.name] : 0;
                    };
                    if(viewContent){
                      for(var i in viewContent.variables){
                        loopVariable(viewContent.variables[i]);
                      };
                    };
                    scope.$tabInx = 0;
                    scope.naviClick = function(id){
                      scope.$tabInx = id;
                    };
                    var SECONDS = {
                      "label": "计算时间",
                      "maxlength": 12,
                      "value": 0,
                      "right": true,
                      "data": "second",
                      "apply" : false,
                      "textAfter" : "秒",
                      "type": "input",
                      "composory": true,
                      "events": {
                        "change": function(data) {

                        }
                      },
                      filterFormat : {
                        "label" : "label",
                        "value" : "id"
                      }
                    };
                    var DAYS = {
                      "label": "开始计算",
                      "maxlength": 12,
                      "value": 0,
                      "right": true,
                      "data": "day",
                      "apply" : false,
                      "textAfter" : "日",
                      "type": "input",
                      "composory": true,
                      "events": {
                        "change": function(data) {

                        }
                      },
                      filterFormat : {
                        "label" : "label",
                        "value" : "id"
                      }
                    };
                    var MINUTES = {
                      "label": "开始计算",
                      "maxlength": 12,
                      "value": 0,
                      "apply" : false,
                      "right": true,
                      "data": "minute",
                      "textAfter" : "分",
                      "type": "input",
                      "composory": true,
                      filterFormat : {
                        "label" : "label",
                        "value" : "id"
                      },
                    };
                    var HOURS = {
                      "label": "开始计算",
                      "maxlength": 12,
                      "value": 0,
                      "apply" : true,
                      "right": true,
                      "data": "hour",
                      "textAfter" : "点",
                      "type": "select",
                      "composory": true,
                      "events": {
                        "change": function(data) {

                        }
                      },
                      options : hours,
                      filterFormat : {
                        "label" : "label",
                        "value" : "id"
                      }
                    };
                    var WEEKDAYS = {
                      "label": "开始计算",
                      "maxlength": 12,
                      "value": 0,
                      "apply" : false,
                      "right": true,
                      "data": "week",
                      "textBefore" : "星期",
                      "options" : weekdays,
                      "type": "select",
                      "composory": true,
                      "events": {
                        "change": function(data) {

                        }
                      },
                      filterFormat : {
                        "label" : "label",
                        "value" : "id"
                      }
                    };
                    var MONTHS = {
                      "label": "开始计算",
                      "apply" : false,
                      "maxlength": 12,
                      "value": 0,
                      "right": true,
                      "data": "month",
                      "textAfter" : "月",
                      "type": "select",
                      "options" : months,
                      "composory": true,
                      "events": {
                        "change": function(data) {

                        }
                      },
                      filterFormat : {
                        "label" : "label",
                        "value" : "id"
                      }
                    };
                    var TIMESELECT = {
                      "label": "开始计算",
                      "maxlength": 12,
                      "value": 0,
                      "apply" : true,
                      "right": true,
                      "data": "schedule",
                      "type": "groupSelect",
                      "composory": true,
                      "groups" : [HOURS, MINUTES]
                    };
                    var granularChange = function(granular, values){
                      if(granular == "MINUTE"){
                        TIMESELECT.apply = true;
                        if(values){
                          SECONDS.value = values[0];
                        } else {
                          SECONDS.value = 0;
                        }
                        TIMESELECT.groups = [SECONDS];
                      } else if(granular == "HOUR"){
                        TIMESELECT.apply = true;
                        if(values){
                          SECONDS.value = values[0];
                          MINUTES.value = values[1];
                        } else {
                          SECONDS.value = 0;
                          MINUTES.value = 0;
                        }
                        TIMESELECT.groups = [MINUTES,SECONDS];
                      } else if(granular == "DAY"){
                        TIMESELECT.apply = true;
                        if(values){
                          MINUTES.value = values[0];
                          HOURS.value = values[1];
                        } else {
                          MINUTES.value = 0;
                          HOURS.value = 0;
                        }
                        TIMESELECT.groups = [HOURS,MINUTES];
                      } else if(granular == "WEEK"){
                        TIMESELECT.apply = true;
                        if(values){
                          HOURS.value = values[0];
                          WEEKDAYS.value = values[1];
                        } else {
                          HOURS.value = 0;
                          WEEKDAYS.value = 1;
                        }
                        TIMESELECT.groups = [WEEKDAYS,HOURS];
                      } else if(granular == "MONTH"){
                        TIMESELECT.apply = true;
                        if(values){
                          HOURS.value = values[0];
                          DAYS.value = values[1];
                        } else {
                          HOURS.value = 0;
                          DAYS.value = 1;
                        }
                        TIMESELECT.groups = [DAYS,HOURS];
                      } else if(granular == "YEAR"){
                        TIMESELECT.apply = true;
                        if(values){
                          DAYS.value = values[0];
                          MONTHS.value = values[1];
                        } else {
                          DAYS.value = 1;
                          MONTHS.value = 1;
                        }
                        TIMESELECT.groups = [MONTHS, DAYS];
                      }
                    };
                    var cronToTime = function(data){
                      var regExps = [{
                        name : "MINUTE",
                        regExp : /(\d+)\ \*\ \*\ \*\ \*\ \?\ \*/
                      },{
                        name : "HOUR",
                        regExp : /(\d+)\ (\d+)\ \*\ \*\ \*\ \?\ \*/
                      },{
                        name : "DAY",
                        regExp : /0\ (\d+)\ (\d+)\ \*\ \*\ \?\ \*/
                      },{
                        name : "MONTH",
                        regExp : /0\ 0\ (\d+)\ (\d+)\ \*\ \?\ \*/
                      },{
                        name : "YEAR",
                        regExp : /0\ 0\ 0\ (\d+)\ (\d+)\ \?\ \*/
                      },{
                        name : "WEEK",
                        regExp : /0\ 0\ (\d+)\ \?\ \*\ (\d+)\ \*/
                      }];
                      var find = regExps.find(function(elem){
                        var regExp = elem.regExp;
                        var rs = regExp.test(data);
                        return rs;
                      });
                      if(find){
                        var rs = [];
                        for(var i = 1; i < 3; i++){
                          var dt = $$.runRegExp(data, find.regExp, i);
                          if(dt){
                            rs.push(parseInt(dt));
                          }
                        };
                        return {
                          granular : find.name,
                          data : rs
                        };
                      } else {
                        return null;
                      };
                    };
                    if(target){
                      var granularObj = cronToTime(target.schedule);
                      if(granularObj){
                        granularChange(granularObj.granular, granularObj.data);
                      } else {
                        granularChange("DAY");
                      }
                    } else {
                      granularChange("DAY");
                    }
                    var KQINAME = {
                      "label": "KQI名称",
                      "maxlength": 32,
                      "value": target ? target.name : "",
                      "right": target ? true : false,
                      "composory": true,
                      "data": "name",
                      "placeholder": "变量名称",
                      "events": {
                        "change": function(data) {
                          if (data.value == "") {
                            data.error = "变量名不可为空";
                            data.right = false;
                          } else {
                            if (varnamelist.indexOf(data.value) != -1) {
                              data.error = "变量名已存在";
                              data.right = false;
                            } else {
                              data.error = undefined;
                              data.right = true;
                            }
                          }
                        }
                      },
                      "type": "input"
                    };
                    var KQIID = {
                      "label": "目标ID",
                      "maxlength": 32,
                      "value": target ? target.kpiId : "",
                      "right": true,
                      "composory": false,
                      "data": "kpiId",
                      "placeholder": "目标ID",
                      "type": "input"
                    };
                    var DESCRIPTION = {
                      "label": "描述",
                      "maxlength": 200,
                      "value": target ? target.desc : "",
                      "right": true,
                      "composory": false,
                      "data": "desc",
                      "placeholder": "描述",
                      "type": "textarea"
                    };
                    var TIMEOFFSET = {
                      "label": "偏移周期数",
                      "value": target ? target.timeOffsetPeriod : "",
                      "right": true,
                      "composory": false,
                      "data": "timeOffsetPeriod",
                      "placeholder": "偏移周期数",
                      "type": "number",
                      "events": {
                        "change": function(data) {
                          if (data.value && data.value.toString().length > 4) {
                            data.error = "长度不能大于4位数";
                            data.right = false;
                          } else {
                            data.error = undefined;
                            data.right = true;
                          }
                        }
                      },
                    };
                    var DOMAINPATH = {
                      label: "域路径",
                      value : target ? target.domainPath : "",
                      right : target ? true : false,
                      type: "tree",
                      sortable: true,
                      filterable: true,
                      composory: true,
                      data: "domainPath",
                      key: "domainPath",
                      mark: "nodes",
                      options: domaintree,
                      modes: {
                        default: {
                          type: "text",
                        }
                      },
                      "events": {
                        "change": function(data) {
                          if (data.value == "") {
                            data.error = "变量名不可为空";
                            data.right = false;
                          } else {
                            data.error = undefined;
                            data.right = true;
                          }
                        }
                      }
                    };
                    var TARGETSOURCE = {
                      "label": "资源模版",
                      "maxlength": 12,
                      "value": initResource,
                      "right": true,
                      "data": "targetResource",
                      "type": "select",
                      "composory": true,
                      "options": allModels,
                      "events": {
                     /*   "change": function(data) {
                          var modelId = data.value;
                          getKpisByModelId(modelId, function(kpis){
                            var kqiModelId = scope.dialog.tabs[1].inputs[1].value;
                            scope.dialog.tabs[1].inputs[2].options = kpis;
                            if(kqiModelId){
                              getKqiModelById(kqiModelId, function(expertDataModel){
                                var varialbes = {};
                                var viewContent = JSON.parse(expertDataModel.viewContent);
                                var loopVariable = function(variable){
                                  varialbes[variable.name] = "";
                                };
                                for(var i in viewContent.variables){
                                  loopVariable(viewContent.variables[i]);
                                }
                                scope.dialog.tabs[1].inputs[2].value = varialbes;
                              });
                            };
                          })
                        }*/
                      }
                    };
                    var CRONEXP = {
                      "label": "调度周期",
                      "maxlength": 30,
                      "apply" : true,
                      "value": target ? target.schedule : "",
                      "right": true,
                      "composory": true,
                      "data": "schedule",
                      "placeholder": "例如(0 46 1 * * ?)",
                      "type": "cronGen"
                    };
                    var SCRIPTTYPE = {
                      "label": "脚本类型",
                      "maxlength": 12,
                      "value": target ? target.scriptType : scriptTypes[0].id,
                      "right": true,
                      "apply" : false,
                      "data": "scriptType",
                      "type": "select",
                      "composory": true,
                      "options": scriptTypes,
                      "events": {
                        "change": function(data) {
                          if (data.value.length == 0) {
                            data.error = "脚本类型不可为空";
                            data.right = false;
                          } else {
                            data.error = undefined;
                            data.right = true;
                          }
                        }
                      }
                    };
                    var DATATYPE = {
                      "label": "目标类型",
                      "maxlength": 12,
                      "value": target ? target.dataType : dataTypes[0].id,
                      "right": true,
                      "data": "dataType",
                      "type": "select",
                      "composory": true,
                      "options": dataTypes,
                      "events": {
                        "change": function(data) {
                          if (data.value.length == 0) {
                            data.error = "目标资源类型不可为空";
                            data.right = false;
                          } else {
                            data.error = undefined;
                            data.right = true;
                          }
                        }
                      }
                    };
                    var DOMAINCALCTYPE = {
                      "label": "域汇聚类型",
                      "maxlength": 12,
                      "value": domainCalcTypes[0].id,
                      "right": true,
                      "data": "domainCalcType",
                      "type": "select",
                      "apply" : true,
                      "disabled" : false,
                      "composory": true,
                      "options": domainCalcTypes,
                      "events": {
                        "change": function(data) {
                          if (data.value.length == 0) {
                            data.error = "域汇聚类型不可为空";
                            data.right = false;
                          } else {
                            data.error = undefined;
                            data.right = true;
                          }
                        }
                      }
                    };
                    var TARGETTYPE = {
                      "label": "目标资源类型",
                      "maxlength": 12,
                      "value": initModel,
                      "apply" : false,
                      "right": true,
                      "data": "targetType",
                      "type": "select",
                      "disabled" : true,
                      "composory": true,
                      "options": targetTypes,
                      "events": {
                        "change": function(data) {

                        }
                      }
                    };
                    var GRANULARITYUNIT = {
                      "label": "统计频率",
                      "maxlength": 12,
                      "value": target ? target.granularityUnit : granularityUnits[2].id,
                      "right": true,
                      "data": "granularityUnit",
                      "type": "select",
                      "composory": true,
                      "options": granularityUnits,
                      "events": {
                        "change": function(data) {
                          var value = data.value;
                          granularChange(value);
                        }
                      }
                    };
                    var FORCASTMETHOD = {
                      "label": "预测方法",
                      "apply" : false,
                      "maxlength": 12,
                      "value": target ? target.forecastMethod : "",
                      "right": true,
                      "composory": false,
                      "data": "forecastMethod",
                      "placeholder": "预测方法",
                      "type": "input",
                      "events": {
                        "change": function(data) {
                          if (data.value.length == 0) {
                            data.error = "预测方法不可为空";
                            data.right = false;
                          } else {
                            data.error = undefined;
                            data.right = true;
                          }
                        }
                      }
                    };
                    var CALCUTYPE = {
                      "label": "计算方式",
                      "maxlength": 12,
                      "value": initKqiModel == 0 ? 0 : 1,
                      "right": true,
                      "apply": true,
                      "data": "",
                      "type": "radio",
                      "options" : [{id:0,label:'专家模版'},{id:1,label:'表达式'}],
                      "composory": true,
                      "events": {
                        "click": function(data) {
                          CALCUTYPE.value = data.id;
                          if(data.id == 0){
                            EXPERTMODELID.apply = true;
                            INPUTMAPPING.apply = true;
                            EXPRESSION.apply = false;
                            EXPERTMODELID.calculable = true;
                            INPUTMAPPING.calculable = true;
                            EXPRESSION.calculable = false;
                          } else {
                            EXPERTMODELID.apply = false;
                            INPUTMAPPING.apply = false;
                            EXPRESSION.apply = true;
                            EXPERTMODELID.calculable = false;
                            INPUTMAPPING.calculable = false;
                            EXPRESSION.calculable = true;
                          }
                        }
                      }
                    };
                    var EXPERTMODELID = {
                      "label": "专家模版",
                      "maxlength": 12,
                      "value": initKqiModel,
                      "right": true,
                      "data": "expertDataModelId",
                      "type": "select",
                      "apply": initKqiModel == 0 ? true : false,
                      "calculable" : false,
                      "composory": true,
                      "options": allKqiModels,
                      "events": {
                        "change": function(data) {
                          getKqiModelById(data.value, function(expertDataModel){
                            var varialbes = {};
                            if(expertDataModel){
                              var viewContent = JSON.parse(expertDataModel.viewContent);
                              var loopVariable = function(variable){
                                varialbes[variable.name] = "";
                              };
                              for(var i in viewContent.variables){
                                loopVariable(viewContent.variables[i]);
                              };
                              INPUTMAPPING.value = varialbes;
                            }
                          });
                        }
                      }
                    };
                    var INPUTMAPPING = {
                      "label": "专家模版参数设置",
                      "maxlength": 12,
                      "value": varialbes,
                      "right": true,
                      "apply": initKqiModel == 0 ? true : false,
                      "calculable" : false,
                      "data": "inputMapping",
                      "type": "kpiSelector",
                      "options" : kpis,
                      "composory": true,
                      "events": {
                        "change": function(data) {

                        }
                      }
                    };
                    var EXPRESSION = {
                      "label": "表达式",
                      "right": true,
                      "apply": true,//initKqiModel == 0 ? false : true,
                      "calculable" : true,
                      "value": target ? target.expression : "",
                      "data": "expression",
                      "type": "codeMirror"
                    };
                    scope.dialog = {
                      title: "KQI",
                      note: {
                        "message": "KQI自定义统计指标"
                      },
                      tabs: [{
                        id : 0,
                        label : "基础信息",
                        inputs : [KQINAME,KQIID,DATATYPE, DOMAINCALCTYPE,TIMEOFFSET, DESCRIPTION, SCRIPTTYPE,TARGETTYPE, FORCASTMETHOD]
                      },{
                        id : 1,
                        label : "资源配置",
                        inputs : [DOMAINPATH, TARGETSOURCE]
                      },{
                        id : 2,
                        label : "计算策略",
                        inputs : [GRANULARITYUNIT, TIMESELECT]
                      },{
                        id : 3,
                        label : "表达式",
                        inputs : [EXPRESSION]
                      }],
                      button: [{
                        label: TEXT.SUBMIT,
                        icon: "btn btn-primary",
                        disabledFn : function() {
                          var rs = [];
                          for(var i in scope.dialog.tabs){
                            rs = rs.concat(scope.dialog.tabs[i].inputs);
                          };
                          var some = rs.some(function(elem) {
                            return elem.right == false && elem.apply != false;
                          });
                          return some;
                        },
                        fn: function() {
                          var self = scope.dialog;
                          var inputs = [];
                          for(var i in self.tabs){
                            inputs = inputs.concat(self.tabs[i].inputs);
                          };
                          var timeToCron = function(data){
                            var rs = "";
                            var arr = ['second', 'minute', 'hour', 'day', 'month', 'week', 'year'];
                            var fd = data.find(function(elem){
                              return elem.data == 'week' || elem.data == 'day';
                            });
                            var weekOrDay = 'week';
                            if(fd){
                              if(fd.data == 'week'){
                                weekOrDay = 'day'
                              } else{
                                weekOrDay = 'week'
                              };
                            };
                            var calcExp = function(item){
                              var find = data.find(function(elem){
                                return elem.data == item;
                              });
                              if(find){
                                return find.value;
                              } else {
                                return undefined;
                              };
                            };
                            var inx = 0;
                            var findVal = false;
                            var repeat = function(index){
                              var result = calcExp(arr[index]);
                              if(result != undefined){
                                findVal = true;
                                rs += result;
                              } else {
                                if(findVal == true){
                                  if(arr[index] == weekOrDay){
                                    rs += "?";
                                  } else {
                                    rs += "*";
                                  };
                                } else {
                                  rs += "0";
                                }
                              }
                              //console.log(rs);
                              index++;
                              if(arr[index]){
                                rs += " ";
                                repeat(index);
                              };
                            };
                            repeat(inx);
                            console.log(rs);
                            return rs;
                          };
                          if(target){
                            var loop = function(elem) {
                              if(typeof elem.value != "function" && elem.calculable != false && elem.data !=""){
                                if(elem.type == "groupSelect"){
                                  target[elem.data] = timeToCron(elem.groups);
                                } else {
                                  target[elem.data] = elem.value;
                                }
                              };
                            };
                            for (var i in inputs) {
                              loop(inputs[i]);
                            };
                            if(CALCUTYPE.value == 1){
                              target.expertDataModelId = 0;
                            }
                            kqiManagerUIService.updateKqiCalcRule(target, function(event){
                              if(event.code == "0"){
                                growl.success("KQI编辑完成");
                                target = event.data;
                                for(var k in calcRules){
                                  if(calcRules[k].id == event.data.id){
                                    calcRules[k] = event.data;
                                    break;
                                  }
                                };
                                // calcRules.updateData(event.data);（这个功能暂时不用）
                                ngDialog.close();
                              };
                            });
                          } else {
                            var newVar = {};
                            var loop = function(elem) {
                              if(typeof elem.value != "function" && elem.calculable != false && elem.data !=""){
                                if(elem.type == "groupSelect"){
                                  newVar[elem.data] = timeToCron(elem.groups);
                                } else {
                                  newVar[elem.data] = elem.value;
                                }
                              };
                            };
                            for (var i in inputs) {
                              loop(inputs[i]);
                            };
                            if(CALCUTYPE.value == 1){
                              newVar.expertDataModelId = 0;
                            } else {
                              newVar.expression = "var a=1";
                            };
                            kqiManagerUIService.addKqiCalcRule(newVar, function(event){
                              if(event.code == "0"){
                                calcRules.pushbefore(event.data);
                                growl.success("KQI添加完成");
                                ngDialog.close();
                              };
                            });
                          };
                        }
                      }, {
                        label: TEXT.CANCEL,
                        icon: "btn btn-default",
                        fn: function() {
                          ngDialog.close();
                        }
                      }]
                    };
                  };
                  var getKpisByModelId_end = function(kpis){
                    if(initKqiModel != 0){
                      getKqiModelById(initKqiModel, function(kqiModel){
                        var viewContent = JSON.parse(kqiModel.viewContent);
                        start(kpis, viewContent);
                      });
                    } else {
                      start(kpis);
                    };
                  };
                  if(initResource){
                    getKpisByModelId(initResource, function(kpis){
                      getKpisByModelId_end(kpis);
                    });
                  } else {
                    getKpisByModelId_end()
                  }
                });
              });
              ngDialog.open({
                template: '../partials/dialogue/config_alert_dia2.html',
                className: 'ngdialog-theme-plain',
                scope: scope
              });
            }
            var addNewClick = function(){
              editCalcRules();
            };
            var delectClick = function(target){
              //console.log(event);
              deleteKqiCalcRule(target.id, function(event){
                if(event.code == 0){
                  growl.success("删除KQI成功！");
                  target.remove();
                }
              })
            };
            /** var delectClickGroup = function(){}; */
            var editClick = function(target){
              editCalcRules(jQuery.extend(true, {}, target));
            };
            var strHeader = {};
            var strEdit = {};
            var strDel = {};
            var optList = [];
            if (scope.menuitems['A01_S97']) {
              strHeader = {
                icon: "fa fa-plus",
                class: "btn btn-primary btn-sm",
                label: "添加KQI",
                style: {
                  margin: "2px"
                },
                type: "button",
                events: {
                  click: addNewClick
                }
              };
            }
            if (scope.menuitems['A02_S97']) {
              strEdit = {
                label: "编辑",
                type: "button",
                class: "btn btn-default",
                events: {
                  click: editClick
                }
              };
              optList.push(strEdit);
            }
            if (scope.menuitems['A03_S97']) {
              strDel = {
                label: "删除",
                type: "button",
                class: "btn btn-default",
                events: {
                  click: delectClick
                }
              };
              optList.push(strDel);
            }

            scope.calcRules = {
              source: calcRules,
              showSelector : false,
              header: [strHeader
                /**, {
                icon: "fa fa-minus",
                class: "btn btn-default btn-sm",
                label: "删除KQI",
                style: {
                  margin: "2px"
                },
                type: "button",
                disabled: function(event) {
                  var some = event.some(function(elem) {
                    return elem.selected == true && elem.status == -1;
                  });
                  return !some;
                },
                events: {
                  click: delectClickGroup
                }
              }*/],
              columnDefs: [{
                label: "标识",
                width: "10%",
                editable: true,
                sortable: true,
                filterable: true,
                data: "id",
                type: "text",
                modes: {
                  default: {
                    type: "text",
                  },
                  edit: {
                    type: "input",
                    placeholder: "例如：请填写用户名，用户名不可为空"
                  }
                }
              },{
                label: "名称",
                width: "20%",
                editable: true,
                sortable: true,
                filterable: true,
                data: "name",
                type: "text",
                modes: {
                  default: {
                    type: "text",
                  },
                  edit: {
                    type: "input",
                    placeholder: "例如：请填写用户名，用户名不可为空"
                  }
                }
              },{
                "label": "对应指标",
                width: "10%",
                editable: true,
                sortable: true,
                filterable: true,
                data: "kpiId",
                type: "text",
                modes: {
                  default: {
                    type: "text",
                  },
                  edit: {
                    type: "input",
                    placeholder: "例如：请填写用户名，用户名不可为空"
                  }
                }
              },{
                label : "创建时间",
                data : "createTime",
                type : "date",
                format : "yy-mm-dd hh:nn:ss",
                filterable : false,
                sortable : true,
                modes : {
                  default : {
                    type : "date",
                  }
                }
              },{
                label: "脚本类型",
                width: "10%",
                editable: true,
                sortable: true,
                filterable: true,
                data: "scriptType",
                type: "select",
                options: scriptTypes,
                filterFormat : {
                  "label" : "label",
                  "value" : "id"
                },
                modes: {
                  default: {
                    type: "text",
                  },
                  edit: {
                    type: "input",
                    placeholder: "例如：请填写用户名，用户名不可为空"
                  }
                }
              },{
                label: "计算频率",
                width: "auto",
                editable: true,
                sortable: true,
                filterable: true,
                data: "granularityUnit",
                type: "select",
                options: granularityUnits,
                filterFormat : {
                  "label" : "label",
                  "value" : "id"
                },
                modes: {
                  default: {
                    type: "text",
                  },
                  edit: {
                    type: "input",
                    placeholder: "例如：请填写用户名，用户名不可为空"
                  }
                }
              }, {
                label: "操作",
                type: "buttonGroup",
                filterable: false,
                sortable: false,
                width: "141px",
                modes: {
                  default: {
                    options: optList
                  }
                }
              }]
            };
          });
        });
      };
      
      // 监听登录状态
      if(!userLoginUIService.user.isAuthenticated) {
        scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);
});