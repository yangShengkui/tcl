define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('editorManagementCtrl', ['$scope', 'resourceUIService', '$q', 'ngDialog', '$location', '$routeParams', '$timeout', 'userLoginUIService', 'Info', 'growl', 'configUIService',
    function($scope, resourceUIService, $q, ngDialog, $location, $routeParams, $timeout, userLoginUIService, Info, growl, configUIService) {
      //查询AllConfigs 里面有没有CustomerTools，没有就创建一个
      function isHaveCustomerTools(callback) {
        return configUIService.getAllConfigGroups(function(returnData) {
          var notFind = true;
          for(var i = 0; i < returnData.data.length; i++) {
            if(returnData.data[i].name == "CustomerTools") {
              notFind = false;
              break;
            }
          }
          callback(notFind);
        });
      }

      isHaveCustomerTools(function(result) {
        if(result) {
          var configGroup = {
            label: '自定义视图组件',
            name: 'CustomerTools'
          };
          configUIService.saveConfigGroup(configGroup, function(returnData) {
            console.log(returnData);
          })
        } else {
          getConfigsByGroupName();
        }
      });

      // 刷新表格
      function getConfigsByGroupName() {
        $scope.calcRule = [];
        var configGroupName = "CustomerTools";
        configUIService.getConfigsByGroupName(configGroupName, function(returnData) {
          console.log(returnData);
          for(var i = 0; i < returnData.data.length; i++) {
            var value = JSON.parse(returnData.data[i].value);
            value.id = returnData.data[i].id;
            value.type = value.type.substring(7);
            $scope.calcRule.push(value);
          }
        });

        //创建表格
        $scope.calcRules = {
          source: $scope.calcRule,
          showSelector: false,
          showIndex: true,
          header: [strHeader],
          columnDefs: [{
            label: "名称",
            width: "35%",
            editable: true,
            sortable: false,
            filterable: true,
            data: "label",
            type: "text",
            modes: {
              'default': {
                type: "text",
              },
              edit: {
                type: "input",
                placeholder: "例如：请填写用户名，用户名不可为空"
              }
            }
          }, {
            label: "标识",
            editable: true,
            sortable: false,
            filterable: true,
            data: "type",
            type: "text",
            modes: {
              'default': {
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
            width: '100px',
            modes: {
              'default': {
                options: optList
              }
            }
          }]
        };
      }

      /**
       * 校验方法
       * 创建设计服务器
       * @type {{name: string, id: string, json: string, code: string}}
       */
      $scope.editor = {
        name: "",
        id: "",
        json: "",
        code: ""
      };

      // 校验不能为空
      function checkoutInfo() {
        if($scope.editor.name == '') {
          growl.error("名称不能为空")
          return false;
        }
        if($scope.editor.id == '') {
          growl.error("标识不能为空")
          return false;
        }
        return true;
      }

      // 查重
      function hasElement() {
        var itemsNameArr = [];
        for(var i = 0; i < $scope.calcRule.length; i++) {
          itemsNameArr.push($scope.calcRule[i].label);
        }
        if($$.isExistItems($scope.editor.name, itemsNameArr)) {
          growl.error("名称已经存在")
          return false;
        }
        var itemsNameId = [];
        for(var i = 0; i < $scope.calcRule.length; i++) {
          itemsNameId.push($scope.calcRule[i].type);
        }
        if($$.isExistItems($scope.editor.id, itemsNameId)) {
          growl.error("标识已经存在")
          return false;
        }
        return true;
      }

      // 点击提交按钮
      var flag = false; // 用来判断是编辑还是添加
      $scope.editorManagemengt = function() {
        if(checkoutInfo() && hasElement()) {
          var useableJson = JSON.parse($scope.editor.json);
          console.log(useableJson);
          useableJson.label = $scope.editor.name;
          useableJson.type = "custom_" + $scope.editor.id;
          useableJson.source = "CUSTOM_" + $scope.editor.id.toUpperCase();
          if(flag) {
            var config = {
              value: JSON.stringify(useableJson),
              label: $scope.editor.name,
              groupName: "CustomerTools"
            };
          } else {
            config = {
              value: JSON.stringify(useableJson),
              label: $scope.editor.name,
              groupName: "CustomerTools",
              id: $scope.editor.Id
            };
          }
          console.log(config);
          configUIService.saveConfig(config, function(returnData) {
            console.log(returnData);
            getConfigsByGroupName()
          });
          ngDialog.close();
        }

      };
      $scope.closeEditorManagemengt = function() {
        ngDialog.close();
        getConfigsByGroupName()
      };
      /**
       *  $scope.calcRule 表格名称
       * optList 操作按钮数组
       * editClick  编辑按钮方法  delectClick 删除按钮方法  addNewClick  添加设计器名称
       * @type {Array}
       */

      var optList = [];
      // 添加设计器名称
      var addNewClick = function(target) {
        var json = {
          "advance": {
            "expression": "express = {\n  on : {\n    init : function(event){\n      var target = event.target;\n      var global = event.global;\n      var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a','7a', '8a', '9a', '10a', '11a',\n          '12p', '1p', '2p', '3p', '4p', '5p','6p', '7p', '8p', '9p', '10p', '11p'];\n      var days = ['1', '2', '3','4', '5', '6', '7'];\n      var data = [[12, 0, 10], [3, 3, 15], [4, 3, 20], [10, 1, 12], [3, 0, 14]]\n      var option = {\n        tooltip: {},\n        visualMap: {\n            max: 20,\n            inRange: {\n                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']\n            }\n        },\n        xAxis3D: {\n            type: 'category',\n            data: hours\n        },\n        yAxis3D: {\n            type: 'category',\n            data: days\n        },\n        zAxis3D: {\n            type: 'value'\n        },\n        grid3D: {\n            boxWidth: 200,\n            boxHeight: 40,\n            boxDepth: 90,\n            light: {\n                main: {\n                    intensity: 1.2\n                },\n                ambient: {\n                    intensity: 0.3\n                }\n            }\n        },\n        series: [{\n            type: 'bar3D',\n            data: data.map(function (item) {\n                return {\n                    value: [item[1], item[0], item[2]]\n                }\n            }),\n            shading: 'color',\n\n            label: {\n                show: false,\n                textStyle: {\n                    fontSize: 16,\n                    borderWidth: 1\n                }\n            },\n\n            itemStyle: {\n                opacity: 0.8\n            },\n\n            emphasis: {\n                label: {\n                    textStyle: {\n                        fontSize: 20,\n                        color: '#900'\n                    }\n                },\n                itemStyle: {\n                    color: '#900'\n                }\n            }\n        }]\n    }\n    //   target.line3DOption()  3D 折线图\n    //   target.bar3DOption()  3D  柱状图\n    //   target.scatter3DOption()  3D 散点图\n      event.target.render(option);\n    }\n  }\n}"
          },
          "style": {
            "margin": "auto",
            "width": "100%",
            "height": "300px"
          }
        };

        $scope.editor = {
          name: "",
          id: "",
          json: JSON.stringify(json, null, 2),
          code: "function tool(data) {\n  var element = data.element;\n  var global = data.global;\n  var target = $(\"<div></div>\");\n  var route = data.route;\n  if(element.style) {\n    target.css(element.style);\n  };\n  var expression;\n  $$.runExpression(element.$attr(\"advance/expression\"), function(funRes) {\n    if(funRes.code == \"0\") {\n      var fnResult = funRes.data;\n      if(typeof fnResult == 'function') {\n        expression = fnResult(data, system);\n      } else {\n        expression = fnResult;\n      }\n      expression = expression ? expression : {};\n    } else {\n      expression = {};\n      console.log(funRes.message);\n      //throw new Error(funRes.message);\n    }\n  });\n  var clickFn = expression.$attr(\"on/click\");\n  var initFn = expression.$attr(\"on/init\");\n  target.on(\"click\", function(event){\n    if(typeof clickFn == \"function\"){\n      target.css(\"cursor\", \"pointer\");\n      if(route.current.$$route.controller != \"freeBoardCtrl\"){\n        clickFn({\n          target : element,\n          global : global\n        })\n      };\n    }\n  });\n  var render = function(){\n  };\n  element.render = render\n  if(initFn){\n    try {\n      initFn({\n        target : element,\n        global : global\n      })\n    } catch(e){\n      element.growl(e.message, \"warning\");\n    }\n  } else {\n    render();\n  };\n  return target;\n}"
        };
        ngDialog.open({
          template: '../partials/dialogue/editor_management_diag.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });
        flag = true;
      };
      // 编辑按钮方法
      var editClick = function(target) {
        console.log(target);
        ngDialog.open({
          template: '../partials/dialogue/editor_management_diag.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });

        $scope.editor = {
          name: target.label,
          id: target.source.substring(7),
          code: target.code,
          Id: target.id
        };
        delete(target.label);
        delete(target.$$hashKey);
        delete(target.source);
        delete(target.type);
        delete(target.id);
        $scope.editor.json = JSON.stringify(target, null, 2);
        flag = false;
      };
      // 删除按钮方法
      var delectClick = function(target) {
        var fnlist = [{
          label: "确定",
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
            var configId = target.id;
            configUIService.deleteConfig(configId, function(returnData) {
              console.log(returnData);
            })
            getConfigsByGroupName();
          }
        }, {
          label: "取消",
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
        $scope.dialog = {
          title: {
            label: '提示'
          },
          description: {
            label: '确认要删除此工具？'
          },
          fnlist: fnlist
        };
        ngDialog.open({
          template: '../partials/dialogue/common_dia_prompt.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });

      };
      var strEdit = {
        label: "编辑",
        type: "button",
        class: "btn btn-primary",
        events: {
          click: editClick
        }
      };
      optList.push(strEdit);

      var strDel = {
        label: "删除",
        type: "button",
        class: "btn btn-default",
        events: {
          click: delectClick
        }
      };
      optList.push(strDel);
      var strHeader = {
        icon: "fa fa-plus",
        class: "btn btn-warning btn-sm",
        label: "添加设计器名称",
        style: {
          margin: "2px"
        },
        type: "button",
        events: {
          click: addNewClick
        }
      };
    }
  ]);
});