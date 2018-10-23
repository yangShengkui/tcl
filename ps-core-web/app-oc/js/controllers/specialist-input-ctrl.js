define(['controllers/controllers','Array'], function (controllers) {
  'use strict';
  controllers.initController('specialistInputCtrl', ['$scope', '$q', '$rootScope', '$location', '$routeParams', '$timeout', 'kqiManagerUIService', 'userRoleUIService', 'resourceUIService','userLoginUIService', 'Info', 'growl', 'userEnterpriseService', 'viewFlexService','userDomainService', "$window", "freeboardservice", 'dialogue', "ngDialog", "specialListService",
    function (scope, q, rootScope, $location, $routeParams, timeout, kqiManagerUIService, userRoleUIService, resourceUIService, userLoginUIService, Info, growl, userEnterpriseService, viewFlexService, userDomainService, window, freeboardservice, dialogue, ngDialog, specialListService) {
      /** {"id":10075,"name":"客户月新增数888hhh","desc":"0","kpiId":3043,"schedule":"0 18 0 1 * ?","targetType":"all","target":null,"targetResource":null,"expression":"var dateList = new (Java.type(\"java.util.ArrayList\"));\ndateList.add(core.getMonthStart(1));\ndateList.add(core.getMonthStart(0));\nvar values=core.count(\"resource\",\"domains\",{\"modelId\":301,\"createTime\":dateList});\ncore.toKpiValues(values,{domainPath:\"domains\",value:\"count\"});","scriptType":"js","domainPath":"/0/141935137496068/","createTime":"2017-04-28T09:58:00.394+0000","updateTime":"2017-05-05T11:20:45.997+0000","solutionId":0,"enable":true,"real":false,"granularity":1,"granularityUnit":"MONTH","dataType":0,"domainCalcType":1,"aggregateType":null,"forecastMethod":null}*/
      var TEXT = {
        "SUBMIT" : "确定",
        "CANCEL" : "取消"
      };
      var currentGraph = {}, kqiModel;
      var kqiModelId = parseInt($routeParams['id']);
      var pos = $routeParams['pos'];
      var timePeriod = [{
        id : 0,
        label : "秒"
      },{
        id : 1,
        label : "分钟"
      },{
        id : 2,
        label : "小时"
      },{
        id : 3,
        label : "天"
      }];
      scope.thumbs = [{
        label : "灰色背景",
        url : "../app-freeboard/images/dataModel/dataModel1.jpg",
        color : "#fff"
      },{
        label : "水滴背景",
        url : "../app-freeboard/images/dataModel/dataModel2.jpg",
        color : "#fff"
      },{
        label : "白色背景",
        url : "../app-freeboard/images/dataModel/dataModel3.jpg",
        color : "#000"
      }];
      scope.kqiModelThumb = scope.thumbs[0].url;
      var expertChange = function(){
        console.log(this.id);
      };
      scope.expertModelTypes = specialListService(expertChange);
      scope.expertModelTypes.shift();
      scope.instance = {};
      scope.$watch("currentNav", function(n,o,s){
        if(n == 3){
          var draw = function(graph){
            var input = {
              layout : graph.layout,
              setting : graph.setting
            };
            var editData = new freeboardservice.replaceCiKpi(input, function(){
              console.log(editData);
              timeout(function(){
                scope.instance.setMode(true);
                scope.instance.renderLayout(editData);
              });
            });
          }
          if(currentGraph.viewId){
            scope.insText = "编辑分析视图";
            var content = currentGraph.content;
            draw(JSON.parse(content));
          } else {
            scope.insText = "导出到分析视图";
            var initFn = "function(event){\n\
            var target = event.target;\n\
            var global = event.global;\n\
            var inx = 0;\n\
            var execute = " + scope.expression.toString() + "\n\
            console.log('execute', execute);\n\
            var option = {\n\
              title: {\n\
                text: \"" + scope.kqiModelName + "\"\n\
              },\n\
              tooltip: {\
               trigger: 'axis'\
              },\n\
              legend: {\n\
                data: execute().map(function(elem){return elem.name;})\n\
              },\n\
              xAxis: {\n\
                data: execute()[0].data.map(function(elem){ inx++;return inx; })\n\
              },\n\
              yAxis: {},\n\
              series: execute().map(function(elem){ elem.type = elem.type || 'line'; return elem;})\n\
            };\n\
            target.render(option);\n\
          }\n";
            var expression = "{\n\
            on : {\n\
              init : " + initFn + "\n\
            }\n\
          }\n";
            var graph = {
              "layout": {
                "type": "column",
                "children": [
                  {
                    "label": "高级视图",
                    "type": "advanceEchart",
                    "source": "ADVANCEECHART",
                    "parameters": {
                      "theme": "default"
                    },
                    "style": {
                      "margin": "auto",
                      "width": "100%",
                      "height": "600px"
                    },
                    "advance": {
                      "expression": "expression = " + expression
                    }
                  }
                ],
                "col": 12
              },
              "setting": "{\n  \"theme\": \"default\"\n}"
            };
            draw(graph);
            currentGraph = {
              viewTitle : scope.kqiModelName + "(专家模型)",
              viewType : "designView",
              content : JSON.stringify(graph)
            };
          }
        }
      });
      var runEval = function(expression){
        var fun;
        try {
          fun = eval("(" + expression + ")");
        } catch(e){
          console.log(e);
        }
        return fun
      };
      var getKqiModels = function(callback){
        kqiManagerUIService.getKqiModels(function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
      };
      var saveKqiModel = function(param, callback){
        kqiManagerUIService.saveKqiModel(param, function(event){
          if(event.code == 0){
            callback(event.data);
          }
        })
      };
      var deleteKqiModel = function(param, callback){
        kqiManagerUIService.deleteKqiModel(param, function(event){
          if(event.code == 0){
            callback(event.data);
          }
        })
      };
      var getKqiModelById = function(id, callback){
         kqiManagerUIService.getKqiModelById(id, function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
      };
      scope.a = "aba";
      scope.navigation = [{
        id : 0,
        label : "基础设置"
      },{
        id : 1,
        label : "公式输入"
      },{
        id : 3,
        label : "图形展示"
      }];
      scope.createGraphView = function(){
        if(kqiModelId){
          var open = function(){
            window.open("/app-freeboard/index.html#/editor/view/editor/" + currentGraph.viewId + "/0");
          };
          if(currentGraph.viewId){
            open();
          } else {
            currentGraph.template = {
              resourceType : 'kqiModel',
              resourceId : kqiModelId
            };
            viewFlexService.addView(currentGraph, function(data){
              if(data.code == 0){
                currentGraph = data.data || {};
                scope.insText = "编辑仪表板";
                open()
              }
            })
          };
        } else {
          growl.error("请先保存您的专家模版");
        };
      };
      scope.currentNav = scope.navigation[0].id;
      scope.navigateClick = function(id){
        scope.currentNav = id;
      };
      scope.saveSpecialist = function(){
        var check = function(){
          if(!scope.kqiModelName){
            growl.error("请填写视图名称.");
            return false;
          }
          return true;
        };
        if(check()){
          var viewContent = {};
          viewContent.expression = scope.expression;
          viewContent.simulate = scope.simulate;
          viewContent.variables = scope.variables;
          viewContent.thumb = scope.kqiModelThumb;
          viewContent.fontcolor = scope.thumbs.find(function(elem){
            return elem.url == scope.kqiModelThumb;
          }).color;
          viewContent.kqiModelNameEn = scope.kqiModelNameEn;
          var save = function(kModel){
            kqiModel = kModel;
            var param = kqiModel ? kqiModel : {};
            param.label = scope.kqiModelName;
            //param.expertModelType = scope.expertModelType;
            console.log(JSON.stringify(viewContent,null, 2));
            param.viewContent = JSON.stringify(viewContent);
            saveKqiModel(param, function(event){
              if(kqiModelId){
                growl.success("修改专家模型成功。");
              } else {
                growl.success("保存专家模型成功。");
              }
              $location.path("specialist/input/" + event.id);
            })
          }
          if(kqiModelId){
            getKqiModelById(kqiModelId, function(kqiModel){
              save(kqiModel);
            });
          } else {
            save();
          };
        };
      };
      scope.addSimulate = function(){
        scope.simulate.push({});
      };
      scope.removeSim = function(sim){
        scope.simulate.$remove(function(index, elem){
          return sim == elem;
        })
      };
      scope.runKqi = function(sim){
        var clone = {};
        for(var i in sim){
          clone[i] = sim[i].split(",").map(function(ele){
            return parseInt(ele);
          });
        }
        var fun = runEval(scope.expression);
        var result;
        try {
          result = fun(clone)
        } catch(e){
          console.log(e);
        } finally {
          result = result ? result : "";
        }
        return result;
      };
      var init = function(){
        var run = function(kqiModel){
          if(kqiModel){
            scope.kqiModelName = kqiModel.label;
            scope.expertModelType = kqiModel.expertModelType;
            var viewContent = JSON.parse(kqiModel.viewContent);
            scope.kqiModelNameEn = viewContent.kqiModelNameEn;
            scope.expression = viewContent.expression;
            scope.simulate = viewContent.simulate;
            scope.variables = viewContent.variables;
            scope.kqiModelThumb = viewContent.thumb;
            viewFlexService.getManagedViewsByTypeAndRole("designView", function(event){
              if(event.code == 0){
                var allGraph = event.data;
                var kqiGraph = allGraph.find(function(elem){
                  var r = false;
                  if(elem.template){
                    if(elem.template.resourceType == 'kqiModel'){
                      r = elem.template.resourceId == kqiModel.id;
                    }
                  }
                  return r;
                });
                if(kqiGraph){
                  viewFlexService.getViewById(kqiGraph.viewId, function(event){
                    if(event.code == 0){
                      //var content = event.data.content;
                      currentGraph = event.data || {};
                      scope.currentNav = pos ? scope.navigation[pos].id : scope.navigation[0].id;
                    }
                  })
                } else {
                  scope.currentNav = pos ? scope.navigation[pos].id : scope.navigation[0].id;
                };
              }

            });
          } else {
            scope.currentNav = pos ? scope.navigation[pos].id : scope.navigation[0].id;
            scope.expertModelType = 0;
            scope.expression = "function(){\n    return [{\n        name : \"专家模型\",\n        data : [5,7,3,5,8,2,4,7]\n    }]\n}";
            scope.simulate = [];
            scope.variables = [];
          }
          var editVarible = function(target){
            var varnamelist = scope.variables.map(function(elem){
              return elem.name;
            })
            scope.dialog = {
              title: "新增变量",
              note: {
                "message": "新增变量名不可重复使用。"
              },
              input: [{
                "label": "变量名称",
                "maxlength": 12,
                "value": target ? target.name : "",
                "right": true,
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
              },{
                "value": target ? target.period : null,
                "label": "统计时段",
                "right": target ? true : false,
                "data": "period",
                "type": "select",
                "composory": true,
                "options": timePeriod,
                "events": {
                  "change": function(data) {
                    if (data.value.length == 0) {
                      data.error = "默认角色不可为空";
                      data.right = false;
                    } else {
                      data.error = undefined;
                      data.right = true;
                    }
                  }
                }
              }],
              button: [{
                label: TEXT.SUBMIT,
                icon: "btn btn-primary",
                disabledFn : function() {
                  var some = scope.dialog.input.some(function(elem) {
                    return elem.right == false;
                  });
                  return some;
                },
                fn: function() {
                  var self = scope.dialog;
                  if(target){
                    var loop = function(elem) {
                      target[elem.data] = elem.value;
                    };
                    for (var i in self.input) {
                      loop(self.input[i]);
                    };
                  } else {
                    var newVar = {};
                    var loop = function(elem) {
                      newVar[elem.data] = elem.value;
                    };
                    for (var i in self.input) {
                      loop(self.input[i]);
                    };
                    scope.variables.push(newVar);
                  }
                  ngDialog.close();
                }
              }, {
                label: TEXT.CANCEL,
                icon: "btn btn-default",
                fn: function() {
                  ngDialog.close();
                }
              }]
            };
            ngDialog.open({
              template: '../partials/dialogue/config_alert_dia.html',
              className: 'ngdialog-theme-plain',
              scope: scope
            });
          }
          var addNewClick = function(){
            editVarible()
          };
          var delectClickGroup = function(event){
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
                var removeVar = function(elem){
                  scope.variables.$remove(function(inx, el){
                    return el == elem
                  });
                };
                for(var i in event){
                  removeVar(event[i]);
                };
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
                label: '确认要删除所选变量吗？'
              },
              fnlist: fnlist
            };
            ngDialog.open({
              template: '../partials/dialogue/common_dia_prompt.html',
              className: 'ngdialog-theme-plain',
              scope: scope
            });
          };
          var editClick = function(target){
            editVarible(target)
          };
          var delectClick = function(target){
            scope.variables.$remove(function(index, elem){
              return elem == target;
            });
          };
          /**
          scope.valinput = {
            source: scope.variables,
            header: [{
              icon: "fa fa-plus",
              class: "btn btn-primary btn-sm",
              label: "添加变量",
              style: {
                margin: "2px"
              },
              type: "button",
              events: {
                click: addNewClick
              }
            }, {
              icon: "fa fa-minus",
              class: "btn btn-default btn-sm",
              label: "删除变量",
              style: {
                margin: "2px"
              },
              type: "button",
              disabled: function(event) {
                var some = event.some(function(elem) {
                  return elem.selected == true;
                });
                return !some;
              },
              events: {
                click: delectClickGroup
              }
            }],
            columnDefs: [{
              label: "变量名",
              width: "40%",
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
              label: "时间段",
              editable: true,
              sortable: true,
              filterable: true,
              data: "period",
              type: "select",
              format : function(event){
                return timePeriod[event].label;
              },
              options : timePeriod,
              filterFormat : {
                "value" : "id",
                "label" : "label"
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
                  options: [{
                    label: "编辑",
                    type: "button",
                    class: "btn btn-default",
                    events: {
                      click: editClick
                    }
                  },{
                    label: "删除",
                    type: "button",
                    class: "btn btn-default",
                    events: {
                      click: delectClick
                    }
                  }]
                }
              }
            }]
          };*/
        };
        if(kqiModelId){
          getKqiModelById(kqiModelId, function(kqiModel){
            run(kqiModel);
          });
        } else {
          run()
        }
      };
      init();
    }
  ]);
});