define(['controllers/controllers', 'bootstrap-dialog', 'keyboardJS', 'rappid-joint', 'Array'], function(controllers, BootstrapDialog, keyboardJS, joint) {
  'use strict';
  controllers.initController('RappidBaseCtrl', ['$scope', '$routeParams', '$compile', '$rootScope', 'viewFlexService',
    'resourceUIService', 'kpiDataService', 'SwSocket', 'growl', '$location', '$timeout', 'configUIService', "$q", 'ngDialog',
    function($scope, $routeParams, $compile, $rootScope, viewFlexService, resourceUIService, kpiDataService, SwSocket,
      growl, loc, timeout, configUIService, $q, ngDialog) {
      var paper, graph, paperScroller, stencil, selection, selectionView, clipboard, commandManager, navigator, snapLines, inspector;
      var cellsDic = {}; //组件字典
      var linksDic = {}; //线条字典
      var shiftHold = false; //shift按钮状态
      var backspaceHold = false; //空格按钮状态
      var displayMode = false; //显示模式，false为设计模式，true为展示模式
      var uuid = Math.uuid();
      //线条展示时，清空设计状态
      var displayModeLink = {
        'arrowheadMarkup': '<g></g>',
        'toolMarkup': '<g></g>',
        'vertexMarkup': '<g></g>'
      }
      var kpiDefDic = {}; //指标字典
      var zoomOptAry = []; //缩放动作数组，用于记录缩放的动作

      //url包含#/display时，组态进入展示模式
      if(location.hash.search("#/display") > -1) {
        displayMode = true;
      };
      if($routeParams.displayMode) {
        displayMode = true;
      }

      //onEvent保存状态的变更
      var _events_ = {};
      $scope.onEvent = function(eventName, callback) {
        _events_[eventName] = callback;
      };

      //监听按钮
      keyboardJS.bind('shift', function(e) {
        shiftHold = true;
      }, function(e) {
        shiftHold = false;
      });
      keyboardJS.bind('shift', null, function(e) {
        shiftHold = false;
      });
      keyboardJS.bind('backspace', function(e) {
        backspaceHold = true;
      }, function(e) {
        backspaceHold = false;
      });
      keyboardJS.bind('backspace', null, function(e) {
        backspaceHold = false;
      });

      //监听上下左右和删除按钮
      keyboardJS.bind(['up', 'down', 'right', 'left', 'delete'], function(e) {
        if(e.target.tagName != "INPUT" && $scope.selectedItem.cell) {
          var cell = $scope.selectedItem.cell;
          var cellposition = cell.attributes.position;
          var embeds = cell.get("embeds");
          if(e.keyCode == 38) {
            cell.prop('position/y', cellposition.y - 1);
            if(embeds) {
              embeds.forEach(function(subId) {
                var subCell = graph.getCell(subId);
                subCell.prop('position/y', subCell.attributes.position.y - 1);
              })
            }
          } else if(e.keyCode == 40) {
            cell.prop('position/y', cellposition.y + 1);
            if(embeds) {
              embeds.forEach(function(subId) {
                var subCell = graph.getCell(subId);
                subCell.prop('position/y', subCell.attributes.position.y + 1);
              })
            }
          } else if(e.keyCode == 39) {
            cell.prop('position/x', cellposition.x + 1);
            if(embeds) {
              embeds.forEach(function(subId) {
                var subCell = graph.getCell(subId);
                subCell.prop('position/x', subCell.attributes.position.x + 1);
              })
            }
          } else if(e.keyCode == 37) {
            cell.prop('position/x', cellposition.x - 1);
            if(embeds) {
              embeds.forEach(function(subId) {
                var subCell = graph.getCell(subId);
                subCell.prop('position/x', subCell.attributes.position.x - 1);
              })
            }
          } else if(e.keyCode == 46) {
            if(embeds) {
              embeds.forEach(function(subId) {
                var subCell = graph.getCell(subId);
                subCell.remove();
              })
            }
            cell.remove();
          }
        } else if(e.target.tagName != "INPUT" && selection.models.length > 0) {
          selection.models.forEach(function(cell) {
            var cellposition = cell.attributes.position;
            if(e.keyCode == 38) {
              cell.prop('position/y', cellposition.y - 1);
            } else if(e.keyCode == 40) {
              cell.prop('position/y', cellposition.y + 1);
            } else if(e.keyCode == 39) {
              cell.prop('position/x', cellposition.x + 1);
            } else if(e.keyCode == 37) {
              cell.prop('position/x', cellposition.x - 1);
            } else if(e.keyCode == 46) {
              var embeds = cell.get("embeds");
              if(embeds) {
                embeds.forEach(function(subId) {
                  var subCell = graph.getCell(subId);
                  subCell.remove();
                })
              }
              cell.remove();
            }
          })
        }
      });

      $scope.alertIcons = [];
      $scope.selectedView = {
        temp: {}, //临时存储Domains
        inspector: false, //控制inspector是否显示视图设置
        domainListTree: null, //管理域

      }; //组态视图对象
      $scope.selectedAlertConfig = {};
      $scope.selectedValueConfig = {};
      $scope.selectedItem = {}; //选中的组件对象
      $scope.directiveList = []; //指令集合

      var interval; //自动保存的计时器对象

      /**
       * 自动保存，需要在全局配置中设置
       * @param {Object} callback
       */
      $scope.autoSaveHandler = function(callback) {
        if($scope.baseConfig && $scope.baseConfig.autoSave) {
          if(isNaN($scope.baseConfig.autoSave)) {
            $scope.baseConfig.autoSave = 15;
          }
          interval = setInterval(function() {
            callback();
          }, $scope.baseConfig.autoSave * 60 * 1000);
        }
      }

      /**
       * 检查当前组态视图名称是否可以用
       * @param {Object} viewTitle
       */
      $scope.checkSameName = function(viewTitle) {
        var run = function(allViews) {
          var some = allViews.some(function(elem) {
            return viewTitle == elem.viewTitle;
          });
          if(some) {
            $scope.errorMsg = "此视图名称已被占用";
          } else {
            $scope.errorMsg = null;
          }
          $scope.checkSm = some;
        }
        if($scope.getAllMyViews) {
          run($scope.getAllMyViews)
        } else {
          viewFlexService.getAllMyViews(function(event) {
            if(event.code == 0) {
              $scope.getAllMyViews = event.data;
              run(event.data);
            }
          })
        }
      };

      /**
       * 发送指令
       * @param {Object} dir
       * @param {Object} dirNodeId
       */
      $scope.sendItemDir = function(dir, dirNodeId) {
        var itemDirValues = {};
        if(!dir.value) {
          growl.warning("请输入指令参数");
          return;
        }
        for(var i in dir.params) {
          var obj = dir.params[i];
          itemDirValues[obj.name] = dir.value;
        }
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '您发送的指令将会在设备上执行，状态数据返回将会有一定时间，确认要发送指令吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              resourceUIService.sendDeviceDirective(dirNodeId ? dirNodeId : Number($scope.selectedItem.nodeId), dir.id, itemDirValues, function(returnObj) {
                if(returnObj.code == 0) {
                  growl.success("指令发送成功，请勿重复发送，状态数据返回需要一定时间！", {});
                }
              });
              dialogRef.close();
            }
          }, {
            label: '取消',
            action: function(dialogRef) {
              dialogRef.close();
            }
          }]
        });
      };

      $scope.backHandler = function() {};

      /**
       * 设备单选切换时
       */
      $scope.nodeChangeHandler = function() {
        //      $scope.selectedItem.cell.attributes["projectId"] = ""; //清空projectId假如有的话
        var nodeId;
        if($scope.selectedItem.nodeId == null) {
          if($scope.selectedItem.cell.get('nodeId')) {
            var ary = $scope.selectedItem.cell.get('nodeId').toString().split(":");
            nodeId = Number(ary[ary.length - 1]);
            $scope.selectedItem.nodeId = nodeId;
          }
        } else {
          nodeId = $scope.selectedItem.nodeId;
        }
        if(nodeId) {
          for(var i = 0; i < $scope.selectedItem.nodes.length; i++) {
            var node = $scope.selectedItem.nodes[i];
            if(node.id == nodeId) {
              $scope.selectedItem.cell.attributes["nodeId"] = "number:" + node.id;
              $scope.selectedItem.cell.attributes["modelId"] = "number:" + (node.modelId ? node.modelId : $scope.selectedItem.modelId);
              $scope.selectedItem.cell.attributes["domainPath"] = "number:" + $scope.selectedItem.domainPath;
              $scope.selectedItem.cell.attributes["sn"] = node.sn;
              if($scope.selectedItem.modelId == 0) {
                $scope.selectedItem.modelId = node.modelId;
                var model = resourceUIService.rootModelDic[$scope.selectedItem.modelId]; //选中对象的modelId
                if(model) { //存在该模型
                  $scope.selectedItem.kpis = model.kpis;
                  $scope.selectedItem.directives = model.directives;
                }
              }
              break;
            }
          }
        }
      };

      /**
       * 项目单选切换时
       */
      $scope.projectChangeHandler = function() {
        var projectId;
        if($scope.selectedItem.projectId == null) {
          if($scope.selectedItem.cell.get('projectId')) {
            var ary = $scope.selectedItem.cell.get('projectId').toString().split(":");
            projectId = Number(ary[ary.length - 1]);
            $scope.selectedItem.projectId = projectId;
          }
        } else {
          projectId = $scope.selectedItem.projectId;
          $scope.selectedItem.cell.attributes["projectId"] = "number:" + projectId;
        }
        $scope.selectedItem.cell.attributes["nodeId"] = "number:" + projectId; //把projectId设置到nodeId上
      };

      /**
       * 指令切换时
       */
      $scope.directivesChangeHandler = function() {
        $scope.selectedItem.cell.attributes["directiveIds"] = $scope.selectedItem.directiveIds;
      };

      /**
       * 设备多选切换时
       */
      $scope.nodesChangeHandler = function() {
        $scope.selectedItem.cell.attributes["nodeIds"] = $scope.selectedItem.nodeIds;
      };

      /**
       * 指标切换时
       */
      $scope.kpiChangeHandler = function() {
        $scope.selectedItem.cell.attributes["kpiId"] = "number:" + $scope.selectedItem.kpiId;
      };

      /**
       * 子视图切换时
       */
      $scope.subViewChangeHandler = function() {
        $scope.selectedItem.cell.attributes["subViewId"] = "number:" + $scope.selectedItem.subViewId;
      };

      /**
       * 分析视图切换时
       */
      $scope.echartViewIdChangeHandler = function() {
        $scope.selectedItem.cell.attributes["echartViewId"] = "number:" + $scope.selectedItem.echartViewId;
      };

      /**
       * 设备选择方式切换时（已废弃）
       */
      $scope.selectTypeChangeHandler = function() {
        $scope.selectedItem.models = [];
        $scope.selectedItem.modelId = 0;
        $scope.selectedItem.nodeId = 0;
        $scope.selectedItem.nodeIds = [];
        $scope.selectedItem.directives = [];
        $scope.selectedItem.kpis = [];
        $scope.selectedItem.kpiId = 0;
      };

      /**
       * 告警状态切换时
       */
      $scope.stateIdChangeHandler = function() {
        $scope.selectedItem.cell.attributes["stateId"] = "number:" + $scope.selectedItem.stateId;
      };

      /**
       * 提醒方式切换时
       */
      $scope.stateTypeChangeHandler = function() {
        $scope.selectedItem.cell.attributes["stateType"] = "number:" + $scope.selectedItem.stateType;
      };
      /**
       * 动画方式切换时
       */
      $scope.animateTypeChangeHandler = function() {
        $scope.selectedItem.cell.attributes["animateType"] = "number:" + $scope.selectedItem.animateType;
      };
      /**
       *  鼠标形状切换时
       */
      $scope.cursorChangeHandler = function() {
        $scope.selectedItem.cell.attributes["cursor"] = "string:" + $scope.selectedItem.cursor;
      };

      /**
       * 分组信息切换时（不常用）
       */
      $scope.tabsInfoChangeHandler = function() {
        $scope.selectedItem.cell.attributes["tabsInfo"] = $scope.selectedItem.tabsInfo;
      };

      /**
       * 指标单位切换时
       */
      $scope.unitChangeHandler = function() {
        $scope.selectedItem.cell.attributes["unitType"] = "number:" + $scope.selectedItem.unitType;
      };

      /**
       * 告警级别切换时
       */
      $scope.alertlevelChangeHandler = function() {
        if($scope.selectedAlertConfig) {
          $scope.selectedItem.cell.prop('alertConfig', $scope.alertLevels);
        }
      };

      /**
       * 告警图标切换时
       */
      $scope.alertIconChangeHandler = function() {
        if($scope.selectedAlertConfig) {
          $scope.selectedItem.cell.prop('alertConfig', $scope.alertLevels);
          if($scope.selectedAlertConfig.id == 0) {
            $scope.selectedItem.cell.attributes.attrs.image["xlink:href"] = $scope.selectedAlertConfig.alertIcon;
          }
        }
      };

      /**
       * 告警名称切换时
       */
      $scope.alertTextChangeHandler = function() {
        if($scope.selectedAlertConfig) {
          $scope.selectedItem.cell.prop('alertConfig', $scope.alertLevels);
          if($scope.selectedAlertConfig.id == 0) {
            $scope.selectedItem.cell.attributes.attrs.text.text = $scope.selectedAlertConfig.alertText;
          }
        }
      };

      /**
       * 指标图标切换时
       */
      $scope.valuelevelChangeHandler = function() {
        if($scope.selectedValueConfig) {
          $scope.selectedItem.cell.prop('valueConfig', $scope.valueLevels);
        }
      };

      /**
       * 指标单位切换时
       */
      $scope.valueIconChangeHandler = function() {
        if($scope.selectedValueConfig) {
          $scope.selectedItem.cell.prop('valueConfig', $scope.valueLevels);
          if($scope.selectedValueConfig.id == 0) {
            $scope.selectedItem.cell.attributes.attrs.image["xlink:href"] = $scope.selectedValueConfig.valueIcon;
          }
        }
      };

      /**
       * 指标值切换时
       */
      $scope.valueTextChangeHandler = function() {
        if($scope.selectedValueConfig) {
          $scope.selectedItem.cell.prop('valueConfig', $scope.valueLevels);
          if($scope.selectedValueConfig.id == 0) {
            $scope.selectedItem.cell.attributes.attrs.text.text = $scope.selectedValueConfig.valueText;
          }
        }
      };

      /**
       * 指标指令切换时
       */
      $scope.valueDirChangeHandler = function() {
        if($scope.selectedValueConfig) {
          $scope.selectedItem.cell.prop('valueConfig', $scope.valueLevels);
        }
      };

      /**
       * 指标指令参数切换时
       */
      $scope.valueDirAttrChangeHandler = function() {
        if($scope.selectedValueConfig) {
          $scope.selectedItem.cell.prop('valueConfig', $scope.valueLevels);
        }
      };

      /**
       * 管理域／模板切换时
       * @param {Object} initItem
       */
      $scope.domainAndModelChangeHandler = function(initItem) {
        var modelId = $scope.selectedItem.modelId > 0 ? $scope.selectedItem.modelId : null;
        var domains = $scope.selectedItem.domainPath;
        if(!modelId || !domains) {
          return;
        }
        var model = resourceUIService.rootModelDic[$scope.selectedItem.modelId]; //选中对象的modelId
        if(model) { //存在该模型
          $scope.selectedItem.kpis = model.kpis;
          $scope.selectedItem.directives = model.directives;
          $scope.selectedItem.cell.attributes["modelId"] = "number:" + $scope.selectedItem.modelId;
          $scope.selectedItem.cell.attributes["domainPath"] = "number:" + $scope.selectedItem.domainPath;
          if(modelId == 302) {
            $scope.selectedItem.nodes = model.project;
            return;
          } else if(modelId == 301) {
            $scope.selectedItem.nodes = model.customers;
            return;
          }
        } else {
          $scope.selectedItem.kpis = [];
          $scope.selectedItem.directives = [];
          //$scope.selectedItem.projects = [];
        }

        if($scope.selectedView.temp[modelId + "_" + domains]) {
          $scope.selectedItem.nodes = [{
            label: "无",
            id: 0
          }].concat($scope.selectedView.temp[modelId + "_" + domains]);
          if(initItem) {
            $scope.selectedItem.nodeIds = initItem.nodeIds;
            $scope.nodesChangeHandler();
          }
        } else {
          resourceUIService.getDevicesByCondition({
            modelId: modelId,
            domains: domains
          }, function(returnObj) {
            if(returnObj.code == 0) {
              $scope.selectedView.temp[modelId + "_" + domains] = returnObj.data;
              $scope.selectedItem.nodes = [{
                label: "无",
                id: 0
              }].concat(returnObj.data);
              if(initItem) {
                $scope.selectedItem.nodeIds = initItem.nodeIds;
                $scope.nodesChangeHandler();
              }
            };
          });
        }
      };

      /**
       * 组件图层切换时
       */
      $scope.layoutZChangeHandler = function() {
        $scope.selectedItem.cell.attributes["z"] = Number($scope.selectedItem.z);
        $scope.selectedItem.cell.prop("z", Number($scope.selectedItem.z));
      }

      /**
       * 扩展域切换时，暂时用处不大
       */
      $scope.extendDomainsChangeHandler = function() {
        if($scope.selectedItem.extendDomainId) {
          $scope.selectedItem.cell.attributes["extendDomainId"] = "number:" + $scope.selectedItem.extendDomainId;
          $scope.selectedItem.cell.attributes["nodeId"] = "number:" + $scope.selectedItem.extendDomainId;
        }
      }

      /**
       * 告警状态提示方式：填充颜色
       * @param {Object} cell 组件对象
       * @param {Object} type 组件类型，比如rect、image、cricle等
       * @param {Object} color 填充颜色
       * @param {Object} state 告警状态
       * @param {Object} color2 组件的原来颜色
       */
      var fillColor = function(cell, type, color, state, color2) {
        var stateId = cell.get("stateId");
        if(stateId) {
          if(state < 1) state = 0;
          var colorAry = [color, '#25bce7', '#e1cd0a', '#ed9700', '#e7675d'];
          var colorAry2 = [color2, '#25bce7', '#e1cd0a', '#ed9700', '#e7675d'];
          if(stateId == "number:1" || stateId == "number:3") {
            if(type) {
              cell.transition('attrs/' + type + '/fill', colorAry[state], {
                delay: 0,
                duration: 500,
                valueFunction: joint.util.interpolate.hexColor
              });
            }
          }
          if(stateId == "number:2" || stateId == "number:3") {
            cell.transition('attrs/text/fill', colorAry2[state], {
              delay: 0,
              duration: 500,
              valueFunction: joint.util.interpolate.hexColor
            });
          }
        }
      }

      /**
       * 告警状态提示方式：呼吸灯,经过优化的 zhangafa 2017-6-2
       * @param {Object} cell 组件对象
       * @param {Object} type 组件类型，比如rect、image、cricle等
       * @param {Object} color 填充颜色
       * @param {Object} state 告警状态
       * @param {Object} opacityState 组件的透明度
       */
      var breathFlash = function(cell, type, color, state, opacityState) {
        var stateId = cell.get("stateId");
        var flash = function(el) {
          var defaultOpacity = opacityState ? 1 : el.opacity;
          el.transition('attrs/' + type + '/opacity', defaultOpacity, {
            delay: 0,
            duration: 3000,
            timingFunction: joint.util.timing.inout,
            valueFunction: function(a, b) {
              return function(t) {
                var o = a + b * (defaultOpacity - Math.abs(defaultOpacity - 2 * defaultOpacity * t))
                return Number(o.toFixed(2));
              }
            }
          });
        };

        if(stateId) {
          if(state < 0) state = 0;
          var colorAry = [color, '#25bce7', '#e1cd0a', '#ed9700', '#e7675d'];
          if(stateId == "number:2") {
            type = "text";
          }
          if(type) {
            if(!cell.opacity) {
              cell.opacity = jQuery.isNumeric(cell.prop('attrs/' + type + '/opacity')) ? cell.prop('attrs/' + type + '/opacity') : 1;
            }
            cell.state = state;
            cell.prop('attrs/' + type + '/opacity', 0.1);
            cell.prop('attrs/' + type + '/fill', colorAry[state]);
            if(cell.state > 0) {
              if(_.contains(cell.getTransitions(), 'attrs/' + type + '/opacity')) return;
              cell.on('transition:end', function(el, path) {
                if(el.state > 0) {
                  flash(el);
                } else {
                  el.off('transition:end');
                  el.prop('attrs/' + type + '/opacity', el.opacity);
                }
              });
              flash(cell);
            } else {
              cell.prop('attrs/' + type + '/opacity', cell.opacity);
            }
          }
        }
      }

      /**
       * 液位设置
       * @param {Object} cell 组件对象
       * @param {Object} value 液位的数值
       */
      var setLevel = function(cell, value) {
        var range = cell.attributes.range;
        if(range) {
          range = eval(range);
        }
        var persent = (value - range[0]) / (range[1] - range[0]);
        cell.prop("attrs/text/text", "");
        cell.transition('attrs/rect', {
          'transform': 'translate(0,0)',
          'height': 60 * persent
        }, {
          delay: 0,
          duration: 1000,
          valueFunction: function(start, end) {
            return function(time) {
              var height = start['height'] + (end['height'] - start['height']) * time;
              var all = 0;
              return {
                'transform': 'translate(0,' + (60 - height) + ')',
                'height': height,
              }
            }
          }
        });
      };

      /**
       * 告警状态提示方式：气泡，仅支持圆形
       * @param {Object} cell 组件对象
       * @param {Object} type 组件类型，比如rect、image、cricle等
       * @param {Object} color 填充颜色
       * @param {Object} state 告警状态
       * @param {Object} opacityState 组件的透明度
       */
      var bubbleFlash = function(cell, type, color, state, opacityState) {
        var stateId = cell.get("stateId");
        var flash = function() {
          cell.prop('attrs/' + type + '/r', 0);
          cell.prop('attrs/' + type + '/opacity', opacityState ? 1 : cell.opacity);
          cell.transition('attrs/' + type, {
            'r': cell.r,
            'opacity': 0
          }, {
            delay: 0,
            duration: 1500,
            valueFunction: function(start, end) {
              return function(time) {
                return {
                  'r': start['r'] + (end['r'] - start['r']) * time,
                  'opacity': start['opacity'] - (start['opacity']) * time
                }
              }
            }
          });
        }
        if(stateId) {
          if(state < 0) state = 0;
          var colorAry = [color, '#25bce7', '#e1cd0a', '#ed9700', '#e7675d'];
          if(stateId == "number:2") {
            type = "text";
          }
          if(type) {
            if(!cell.opacity) {
              cell.opacity = jQuery.isNumeric(cell.prop('attrs/' + type + '/opacity')) ? cell.prop('attrs/' + type + '/opacity') : 1;
              cell.r = cell.prop('attrs/' + type + '/r');
              cell.prop('attrs/' + type + '/opacity', opacityState ? 1 : cell.opacity);
            }
            cell.state = state;
            cell.prop('attrs/' + type + '/fill', colorAry[state]);
            if(cell.state > 0) {
              if(_.contains(cell.getTransitions(), 'attrs/' + type)) return;
              cell.on('transition:end', function(el) {
                if(el.state > 0) {
                  flash();
                } else {
                  cell.prop('attrs/' + type + '/opacity', cell.opacity);
                  cell.prop('attrs/' + type + '/r', cell.r);
                }
              });
              flash();
            } else {
              cell.prop('attrs/' + type + '/opacity', cell.opacity);
              cell.prop('attrs/' + type + '/r', cell.r);
            }
          }
        }
      }

      /**
       * 告警扩展修改图片和文字
       * @param {Object} cell
       * @param {Object} state
       * @param {Object} type alertConfig：图标设置 valueConfig文字设置
       */
      var changeIconAndText = function(cell, state, type) {
        if(!type) type = "alertConfig";
        if(type == "alertConfig") {
          var alertIcon = cell.get("alertIcon");
          if(alertIcon) {
            if(state < 1) state = 0;
            var alertConfig = cell.get(type);
            alertConfig.forEach(function(item) {
              if(item.id == state) {
                if(item.alertText)
                  cell.prop('attrs/text/text', item.alertText);
                if(item.alertIcon)
                  cell.prop('attrs/image/xlink:href', item.alertIcon);
              }
            })
          }
        } else if(type == "valueConfig") {
          var valueConfig = cell.get(type);
          valueConfig.forEach(function(item) {
            item.stateDisplay = false;
            if(item.valueText == state) {
              item.stateDisplay = true;
              if(item.valueText)
                cell.prop('attrs/text/text', item.valueText);
              if(item.valueIcon)
                cell.prop('attrs/image/xlink:href', item.valueIcon);
            }
          })
        }
      };
      
      var pathAnimate = function(cell,value,type,kpiRange) {
        var scale = 1;
        if (zoomOptAry.length > 0) {
          scale = zoomOptAry[0]+1;
        }
        if (!kpiRange) kpiRange = [0,1];
        var p = (value -kpiRange[0])/(kpiRange[1] - kpiRange[0]);
        if (p < 0) p = -p;
        if (p > 1) p = 1;

        if (!cell.linkDomBox) {
          var pathlink = linksDic["source:"+cell.id]; //渲染的link
          if (!pathlink) pathlink = linksDic["target:"+cell.id];
          if (!pathlink) return;
          cell.linkDom = jQuery("[model-id=" + pathlink.id + "]")[0]; //定义的link
          cell.linkDomBox = cell.linkDom.getBoundingClientRect();
        }
        var movetox = -1;
        var movetoy = -1;
        if (type == "number:1") { //X轴正方向
          if (cell.offsetx == undefined) {
            cell.offsetx = cell.get("position").x;
          }
          movetox = cell.offsetx + cell.linkDomBox.width*p/scale;
        } else if (type == "number:2") { //x轴负方向
          if (cell.offsetx == undefined) {
            cell.offsetx = cell.get("position").x;
          }
          movetox = cell.offsetx - cell.linkDomBox.width*p/scale;
        } else if (type == "number:3") { //y轴正方向
          if (cell.offsety == undefined) {
            cell.offsety = cell.get("position").y;
          }
          movetoy = cell.offsety + cell.linkDomBox.height*p/scale;
        } else if (type == "number:4") { //y轴负方向
          if (cell.offsety == undefined) {
            cell.offsety = cell.get("position").y;
          }
          movetoy = cell.offsety - cell.linkDomBox.height*p/scale;
        } else if (type == "number:5") {
          var connection = cell.linkDom.firstChild;
          var cellDom = jQuery("[model-id=" + cell.id + "]")[0]
          var attrs = { 
            'xlink:href': '#' + cellDom.firstChild.attributes["id"].value,
            path:connection.attributes["d"].value,
            dur: '5s', 
            begin : "1s",
            rotate:"auto"
          };
          var animateMotion = joint.V('animateMotion', attrs);
          cellDom.firstChild.append(animateMotion.node);
        }
        if (movetox > -1) {
          cell.transition('position/x', movetox, {
            delay: 100,
            duration: 1000,
            timingFunction: joint.util.timing.inout,
            valueFunction: function(a, b) { return function(t) { return a + (b - a) * t }}
          });
        }
        if (movetoy > -1) {
          cell.transition('position/y', movetoy, {
            delay: 100,
            duration: 1000,
            timingFunction: joint.util.timing.inout,
            valueFunction: function(a, b) { return function(t) { return a + (b - a) * t }}
          });
        }
      }
      
      /**
       * 告警状态设置
       * @param {Object} returnData
       */
      var stateHandler = function(returnData) {
        if(cellsDic[returnData.nodeId]) {
          cellsDic[returnData.nodeId].forEach(function(cellObj) {
            if(cellObj[returnData.nodeId].state != returnData.value) {
              var showEffect = true;
              var cell = cellObj[returnData.nodeId];
              if(cell.get("kpiId") && cell.get("kpiId") != "number:0") {
                if(returnData.instance) {
                  if("number:" + returnData.instance != cell.get("kpiId")) {
                    showEffect = false;
                  }
                } else {
                  showEffect = false;
                }
              } else {
                if(returnData.instance) {
                  showEffect = false;
                }
              }
              if(!showEffect) return;
              var extend = cellObj[returnData.nodeId].get("extend");
              if(extend == 'alert') { //告警扩展
                changeIconAndText(cellObj[returnData.nodeId], returnData.value);
              } else if(extend == "level") { //液位扩展
                fillColor(cellObj[returnData.nodeId], cellObj[returnData.nodeId + "_type"], cellObj[returnData.nodeId + "_fill"], returnData.value, false)
              } else {
                if(cellObj[returnData.nodeId].get('stateType') == "number:1") {
                  breathFlash(cellObj[returnData.nodeId], cellObj[returnData.nodeId + "_type"], cellObj[returnData.nodeId + "_fill"], returnData.value, false);
                } else if(cellObj[returnData.nodeId].get('stateType') == "number:2") {
                  bubbleFlash(cellObj[returnData.nodeId], cellObj[returnData.nodeId + "_type"], cellObj[returnData.nodeId + "_fill"], returnData.value, false);
                } else if(cellObj[returnData.nodeId].get('stateType') == "number:3") {
                  breathFlash(cellObj[returnData.nodeId], cellObj[returnData.nodeId + "_type"], cellObj[returnData.nodeId + "_fill"], returnData.value, true);
                } else if(cellObj[returnData.nodeId].get('stateType') == "number:4") {
                  bubbleFlash(cellObj[returnData.nodeId], cellObj[returnData.nodeId + "_type"], cellObj[returnData.nodeId + "_fill"], returnData.value, true);
                } else {
                  fillColor(cellObj[returnData.nodeId], cellObj[returnData.nodeId + "_type"], cellObj[returnData.nodeId + "_fill"], returnData.value, cellObj[returnData.nodeId + "text_fill"]);
                }
              }
            }
          })
        } else {
          graph.attributes.cells.models.forEach(function(cell) {
            if(cell.get("nodeId")) {
              var nodeIdAry = cell.get("nodeId").split(":");
              if(nodeIdAry.length > 0 && nodeIdAry[nodeIdAry.length - 1] == returnData.nodeId) {
                if(!cellsDic[returnData.nodeId]) cellsDic[returnData.nodeId] = [];
                var cellObj = {};
                var type = $scope.fillType[cell.get("type")];
                var showEffect = true;
                if(cell.get("kpiId") && cell.get("kpiId") != "number:0") {
                  if(returnData.instance) {
                    if("number:" + returnData.instance != cell.get("kpiId")) {
                      showEffect = false;
                    }
                  } else {
                    showEffect = false;
                  }
                } else {
                  if(returnData.instance) {
                    showEffect = false;
                  }
                }

                var extend = cell.get("extend");
                var attrsType = cell.get("attrs")[type];
                if(attrsType)
                  cellObj[returnData.nodeId + "_fill"] = attrsType["fill"];
                else
                  cellObj[returnData.nodeId + "_fill"] = '#fff';
                if(extend != 'alert' && extend != 'value' && extend != 'level') {

                  if(cell.get("attrs")["text"]) {
                    cellObj[returnData.nodeId + "text_fill"] = cell.get("attrs")["text"]["fill"]
                  } else {
                    cellObj[returnData.nodeId + "text_fill"] = '#000';
                  }
                  cellObj[returnData.nodeId + "_type"] = type;
                  cellObj[returnData.nodeId] = cell;
                  cellsDic[returnData.nodeId].push(cellObj);
                  if(!showEffect) return;
                  if(cell.get('stateType') == "number:1") {
                    breathFlash(cell, type, attrsType["fill"], returnData.value, false);
                  } else if(cell.get('stateType') == "number:2") {
                    bubbleFlash(cell, type, attrsType["fill"], returnData.value, false);
                  } else if(cell.get('stateType') == "number:3") {
                    breathFlash(cell, type, attrsType["fill"], returnData.value, true);
                  } else if(cell.get('stateType') == "number:4") {
                    bubbleFlash(cell, type, attrsType["fill"], returnData.value, true);
                  } else {
                    fillColor(cell, type, attrsType["fill"], returnData.value, cellObj[returnData.nodeId + "text_fill"]);
                  }
                } else if(extend == 'alert') {
                  cellObj[returnData.nodeId] = cell;
                  cellsDic[returnData.nodeId].push(cellObj);
                  if(!showEffect) return;
                  changeIconAndText(cell, returnData.value);
                } else if(extend == "level") {
                  fillColor(cell, type, attrsType["fill"], returnData.value, false);
                }
              }
            }
          })
        }
      }

      /**
       * 文本修改
       * @param {Object} cell
       * @param {Object} value
       */
      var fillValue = function(cell, value) {
        var extend = cell.get("extend");
        if(extend == 'alert') return;
        if(extend == 'level') {
          setLevel(cell, value);
        } else {
          var unit = "";
          if(cell.get("unitType") == "number:1") {
            var kpiDef = kpiDefDic[cell.get("kpiId")];
            if(kpiDef && $scope.myOptionDic) {
              unit = $scope.myOptionDic[kpiDef.unit];
              if(unit) {
                cell.prop('attrs/text/text', value + "" + unit);
              }
            }
          }
          if(!unit)
            cell.prop('attrs/text/text', value);
        }
      }

      /**
       * 组件label设置
       * @param {Object} returnData
       */
      var valueHandler = function(returnData) {
        if(cellsDic[returnData.nodeId + "_" + returnData.kpiCode]) {
          cellsDic[returnData.nodeId + "_" + returnData.kpiCode].forEach(function(cellObj) {
            fillValue(cellObj, cellObj.rangeObj ? cellObj.rangeObj[returnData.value] : returnData.value)
            if(cellObj.get("extend") == 'value')
              changeIconAndText(cellObj, returnData.value, "valueConfig");
            if(cellObj.get("animateType")) 
              pathAnimate(cellObj, returnData.value, cellObj.get("animateType"),cellObj.rangeAry)
          });
        } else {
          var rangeObj;
          var rangeAry;
          if(returnData.modelId) {
            rangeAry = $rootScope.rootModelsDic[returnData.modelId].kpiDic[returnData.kpiCode].rangeAry;
            rangeObj = $rootScope.rootModelsDic[returnData.modelId].kpiDic[returnData.kpiCode].rangeObj;
          }
          graph.attributes.cells.models.forEach(function(cell) {
            if(cell.get("nodeId")) {
              var nodeIdAry = cell.get("nodeId").split(":");
              if(nodeIdAry.length > 0 && nodeIdAry[nodeIdAry.length - 1] == returnData.nodeId) {
                if(!cellsDic[returnData.nodeId + "_" + returnData.kpiCode]) cellsDic[returnData.nodeId + "_" + returnData.kpiCode] = [];
                if(cell.get("kpiId")) {
                  var kpiIdAry = cell.get("kpiId").split(":");
                  if(kpiIdAry.length > 0 && kpiIdAry[kpiIdAry.length - 1] == returnData.kpiCode) {
                    cell.rangeObj = rangeObj;
                    cell.rangeAry = rangeAry;
                    cellsDic[returnData.nodeId + "_" + returnData.kpiCode].push(cell);
                    fillValue(cell, rangeObj ? rangeObj[returnData.value] : returnData.value);
                    if(cell.get("extend") == 'value')
                      changeIconAndText(cell, returnData.value, "valueConfig");
                    if(cell.get("animateType")) 
                      pathAnimate(cell, returnData.value, cell.get("animateType"),rangeAry)
                  }
                }
              }
            }
          })
        }
      }

      /**
       * 获得组件绑定的设备上基本告警状态
       * @param {Object} ids
       */
      var getResourceBaseState = function(ids) {
        kpiDataService.getRealTimeKpiData(ids, [999999], function(returnObj) {
          if(returnObj.code == 0) {
            for(var i in returnObj.data) {
              stateHandler(returnObj.data[i]);
            }
          }
        }, true);
      };

      /**
       * 获得组件绑定的设备上KPI指标数据
       * @param {Object} ids
       * @param {Object} kpis
       */
      var getResourceState = function(ids, kpis) {
        kpiDataService.getRealTimeKpiData(ids, kpis, function(returnObj) {
          if(returnObj.code == 0) {
            for(var i in returnObj.data) {
              valueHandler(returnObj.data[i]);
            }
          }
        });
      };

      /******** 以下为websocket处理 ********/

      var getWebsocket = function(ids, kpis) {
        kpis.push(999999);
        var param = {
          ciid: ids.toString(),
          kpi: kpis.toString()
        };
        var operation = "register";
        //考虑极端情况，一个页面有多个模块监听同一个方法
        //但展示在页面的数据需对接收的实时监听的数据做不同处理
        SwSocket.register(uuid, operation, function(returnObj) {
          if(returnObj.data.kpiCode == 999999)
            stateHandler(returnObj.data);
          else
            valueHandler(returnObj.data);
        });

        //websocket发送请求
        SwSocket.send(uuid, operation, 'kpi', param);
      };
      /**
       * 注销scope时注销方法heartBeat，回调函数callback
       */
      $scope.$on("$destroy", function() {
        SwSocket.unregister(uuid);
        if(interval)
          clearInterval(interval);
      });
      /******** 以上为websocket处理 ********/

      /**
       * 通过viewId获得视图的组态内容
       * @param {Object} scope
       * @param {Object} viewId
       */
      var showViewContent = function(scope, viewId) {
        //清空原来的组件内容
        cellsDic = {};
        if(graph.attributes && graph.attributes.cells && graph.attributes.cells.models) {
          graph.attributes.cells.models.forEach(function(cell) {
            cell.off('transition:end');
          });
          graph.clear();
        }
        if(viewId != "all") {
          viewFlexService.getViewById(viewId, function(returnObj) {
            if(returnObj.code == 0) {
              $.AdminLTE.controlSidebar.activate(); //激活控制区域
              $scope.selectedView = returnObj.data;
              $scope.selectedView.temp = {}; //临时存储Domains
              $scope.selectedView.inspector = false; //控制inspector是否显示视图设置
              //设置管理域
              $scope.selectedView.domainListTree = [$scope.domainListDic[$scope.selectedView.domainPath]];
              //查询扩展域（项目视图且扩展域配置为真时）
              if($scope.baseConfig && $scope.baseConfig.extendDomain && $scope.selectedView.template && $scope.selectedView.template.resourceType == 'project') {
                resourceUIService.getResourceByIds([$scope.selectedView.template.resourceId], function(resourceDic) {
                  if(!resourceDic[$scope.selectedView.template.resourceId]) return;
                  var domains = resourceDic[$scope.selectedView.template.resourceId].domains.replace($scope.selectedView.template.resourceId + "/", "")
                  var params = {
                    domains: domains,
                    modelId: 301
                  }
                  resourceUIService.getExtendDomainsByFilter(params, function(returnObj) {
                    if(returnObj.code != 0) return;
                    $scope.selectedView.subDomainListTree = returnObj.domainListTree;
                    $scope.selectedView.subDomainListDic = returnObj.domainListDic;
                  });
                })
              }
              scope.data.viewTitle = $scope.selectedView.viewTitle;
              //设计模式下，获得背景、自定义和通用组件
              if(!displayMode) {
                $scope.autoSaveHandler(scope.components.myCommander.save4Json);
                if($scope.$parent.configViewBg.length > 0) {
                  scope.data.bgimages = scope.data.bgimages.concat($scope.$parent.configViewBg);
                }
                if($scope.$parent.configCustoms.length > 0) {
                  scope.components.stencil.load($scope.$parent.configCustoms, "enterprise");
                  scope.components.layout(stencil.getGraph("enterprise"));
                  scope.components.stencil.getPaper("enterprise").fitToContent(1, 1, 10);
                }
                if($scope.$parent.configCommons.length > 0) {
                  scope.components.stencil.load($scope.$parent.configCommons.concat(scope.data.stencil.shapes.customer), "customer");
                  scope.components.layout(stencil.getGraph("customer"));
                  scope.components.stencil.getPaper("customer").fitToContent(1, 1, 10);
                  $scope.$parent.configCommons.forEach(function(configItem) {
                    configItem.label = configItem.attrs.text.text;
                    $scope.alertIcons.push(configItem);
                  })
                }
              }
              //如果有视图内容，按照视图内容处理，否则用空的内容
              if(returnObj.data.content) {
                $scope.fillType = scope.data.fillType;
                var content = JSON.parse(returnObj.data.content);
                var contentCellsDic = {};
                var originalCellDic = {}; //原始的单元格
                var scale = (scope.data.paperscorllerW - 20) / content.width;
                // 展示模式下，去掉线条的控制显示和性能视图的组件存储
                for(var i = content.cells.length - 1; i > -1; i--) {
                  if(content.cells[i].type == "link") {
                    if(displayMode) {
                      linksDic[content.cells[i].id] = content.cells[i];
                      if (content.cells[i].source && content.cells[i].source.id) {
                        linksDic["source:"+content.cells[i].source.id] = content.cells[i];
                      }
                      if (content.cells[i].target && content.cells[i].target.id) {
                        linksDic["target:"+content.cells[i].target.id] = content.cells[i];
                      }
                      jQuery.extend(content.cells[i], displayModeLink);
                      content.cells[i].attrs['.connection-wrap'] = {
                        display: 'none'
                      };
                    }
                  } else if(content.cells[i].type == "chart.Plot") {
                    if(displayMode) {
                      contentCellsDic[content.cells[i].id] = content.cells[i];
                    }
                  } else if(content.cells[i].type == "basic.Image") {
                    content.cells[i].attrs['image']['width'] = content.cells[i].size['width']
                    content.cells[i].attrs['image']['height'] = content.cells[i].size['height']
                  } else {
                    originalCellDic[content.cells[i].id] = content.cells[i];
                  }
                }

                //如果缩放操作有，进行处理
                if(zoomOptAry.length > 0) {
                  paperScroller.zoom(-zoomOptAry.pop(), {
                    max: 4
                  });
                  paper.$el.css('margin-left', 0);
                }
                
                scope.components.graph.fromJSON(content);
                scope.components.paper.options.gridSize = Number(content.gridSize);
                scope.components.paper.options.width = content.width;
                scope.components.paper.options.height = content.height
                scope.data.bgimage = content.bgimage;
                scope.data.bgcolor = content.bgcolor ? content.bgcolor : "#ffffff";
                scope.data.width = content.width;
                scope.data.height = content.height;
                scope.data.originalCellDic = originalCellDic;
                scope.components.myCommander.setDimensions();
                scope.components.myCommander.setGrid();
                paper.$el.css('background-position', "top");
                if(displayMode) {
                  // paperSroller缩放处理
                  zoomOptAry.push(scale - 1);
                  paperScroller.zoom(scale - 1, {
                    max: 4
                  });
                  paper.$el.css('margin-right', 0);
                  scope.data.width = jQuery(".joint-paper").width();
                  scope.data.height = jQuery(".joint-paper").height();
                  paperScroller.scroll(0, 0);
                  paperScroller.$el.css('padding-left', "0");
                  paperScroller.$el.css('padding-top', "0");
                  
                  /** 以下处理echarts */
                  if (false) {
                    var echartAry = [];
                    var groupDic = {};
                    for(var i = graph.attributes.cells.models.length - 1; i > -1; i--) {
                      var cellsModel = graph.attributes.cells.models[i];
                      if(cellsModel.attributes.type == "link") {
                        linkAnHandler(cellsModel)
                      }
                      if(cellsModel.attributes.type == "chart.Plot") {
                        var boxClientRect = jQuery("[model-id=" + cellsModel.id + "]").find("g.background")[0].getBoundingClientRect();
                        if(!contentCellsDic[cellsModel.id + "_extend"]) {
                          contentCellsDic[cellsModel.id].size.width = boxClientRect.width;
                          contentCellsDic[cellsModel.id].size.height = boxClientRect.height;
                          contentCellsDic[cellsModel.id].size.x = boxClientRect.left;
                          if($routeParams.type == 'service') {
                            contentCellsDic[cellsModel.id].size.y = cellsModel.attributes.position.y * scale;
                          } else {
                            contentCellsDic[cellsModel.id].size.y = boxClientRect.top - 86;
                          }
                          contentCellsDic[cellsModel.id].position.width = boxClientRect.width;
                          contentCellsDic[cellsModel.id].position.height = boxClientRect.height;
                          contentCellsDic[cellsModel.id].position.x = boxClientRect.left;
                          if($routeParams.type == 'service') {
                            contentCellsDic[cellsModel.id].position.y = cellsModel.attributes.position.y * scale;
                          } else {
                            contentCellsDic[cellsModel.id].position.y = boxClientRect.top - 86;
                          }
                          contentCellsDic[cellsModel.id + "_extend"] = true;
                        }
  
                        if(cellsModel.attributes.tabsInfo || (cellsModel.attributes.attrs.text && cellsModel.attributes.attrs.text.text)) {
                          var textary;
                          if(!cellsModel.attributes.tabsInfo) {
                            textary = cellsModel.attributes.attrs.text.text.split("$$");
                          } else {
                            textary = cellsModel.attributes.tabsInfo.split("$$");
                          }
                          if(textary.length > 1) { //有group状态
                            cellsModel.attributes.attrs.text = {
                              text: textary[textary.length - 1]
                            }
                            contentCellsDic[cellsModel.id].attrs.text = cellsModel.attributes.attrs.text;
                            var groupDef = JSON.parse(textary[0]);
                            if(!groupDic[groupDef.group]) {
                              groupDic[groupDef.group] = {
                                name: groupDef.group,
                                x: contentCellsDic[cellsModel.id].position.x,
                                y: contentCellsDic[cellsModel.id].position.y,
                                width: contentCellsDic[cellsModel.id].size.width,
                                height: contentCellsDic[cellsModel.id].size.height,
                                echartAry: []
                              };
                            }
                            groupDic[groupDef.group].echartAry.push(contentCellsDic[cellsModel.id]);
                          } else {
                            echartAry.push(contentCellsDic[cellsModel.id]);
                          }
                        } else {
                          echartAry.push(contentCellsDic[cellsModel.id]);
                        }
                        cellsModel.remove();
                      }
                    }
                    scope.data.echartAry = echartAry;
                    var groupAry = [];
                    for(var k in groupDic) {
                      groupAry.push(groupDic[k]);
                    }
                    scope.data.groupAry = groupAry;
                  }
                  /** 以上处理echarts */

                  var ids = [];
                  var kpis = [];
                  content.cells.forEach(function(item) {
                    if(item.nodeId && item.type != "chart.Plot") {
                      var nodeIdAry = item.nodeId.split(":");
                      if(nodeIdAry.length > 0 && nodeIdAry[nodeIdAry.length - 1] != '?') {
                        var nodeId = Number(nodeIdAry[nodeIdAry.length - 1]);
                        if(nodeId == 0) return true;
                        ids.push(nodeId);
                        if(item.kpiId) {
                          var kpiIdAry = item.kpiId.split(":");
                          if(kpiIdAry.length > 0 && kpiIdAry[kpiIdAry.length - 1] != '?') {
                            var kpiId = Number(kpiIdAry[kpiIdAry.length - 1]);
                            if(kpiId == 0) return true;
                            var modelAry = item.modelId.split(":");
                            var modelId = Number(modelAry[modelAry.length - 1]);
                            var model = resourceUIService.rootModelDic[modelId];
                            if(model && model.kpis) {
                              model.kpis.forEach(function(kpiDef) {
                                if(kpiId == kpiDef.id) {
                                  kpiDefDic[item.kpiId] = kpiDef;
                                  kpis.push(kpiId);
                                  getResourceState([nodeId], [kpiId]);
                                  return false;
                                }
                              })
                            }
                          }
                        }
                      }
                    }
                  });
                  if(ids.length > 0) {
                    getResourceBaseState(ids);
                    getWebsocket(ids, kpis);
                  }
                } else {
                  for(var i = graph.attributes.cells.models.length - 1; i > -1; i--) {
                    var cellsModel = graph.attributes.cells.models[i];
                    if(cellsModel.attributes.type == "link") {
                      linkAnHandler(cellsModel)
                    }
                  }
                }
              } else {
                scope.data.bgcolor = "#ffffff";
                scope.components.graph.clear();
                if(displayMode) {
                  paper.$el.css('background-image', 'url(""),url("")');
                  paper.$el.css('margin-right', 0);
                }
              }
            }
          })
        }
      };

      //附加一个小数字给0的情况
      joint.connectors.normalDimFix = function(sourcePoint, targetPoint, vertices) {
        var dimensionFix = 1e-3;
        var d = ['M', sourcePoint.x, sourcePoint.y];
        _.each(vertices, function(vertex) {
          d.push(vertex.x, vertex.y);
        });
        d.push(targetPoint.x + dimensionFix, targetPoint.y + dimensionFix);
        return d.join(' ');
      };

      //组态线条的处理
      var PatternLinkView = joint.dia.LinkView.extend({
        //渲染的模板
        patternMarkup: [
          '<pattern id="pattern-<%= id %>" patternUnits="userSpaceOnUse">',
          '<image xlink:href=""/>',
          '</pattern>'
        ].join(''),
        initialize: function() {
          joint.dia.LinkView.prototype.initialize.apply(this, arguments);
          _.bindAll(this, 'fillWithPattern');
        },
        render: function() {
          // 调用父节点的render方法
          joint.dia.LinkView.prototype.render.apply(this, arguments);
          // 建立监听
          this.listenTo(this.model, 'change:pattern change:patternColor', this.update);
          return this;
        },
        remove: function() {
          // 确保我们停止了正在进行的模式更新。
          joint.util.cancelFrame(this.frameId);
          joint.dia.LinkView.prototype.remove.apply(this, arguments);
          this.clearPattern();
        },
        clearPattern: function() {
          if(this.pattern) {
            // 从DOM中删除模式。
            this.pattern.remove();
            this.pattern = null;
          }
        },
        update: function() {
          joint.dia.LinkView.prototype.update.apply(this, arguments);
          
          if(this.model && !this.model.get("pattern")) {
            return this;
          }
          
          this.clearPattern();
          // 确保pattern不存在
          if(!this.pattern) {
            // 创建模式和图像元素。
            this.pattern = joint.V(_.template(this.patternMarkup)({
              id: this.id
            }));

            // 缓存图像元素以便更快地访问。
            this.patternImage = this.pattern.findOne('image');

            // 将模式附加到pager的defs中。
            joint.V(this.paper.svg).defs().append(this.pattern);
            
            // 通知 '.connection' 路径使用pattern渲染
            var connection = joint.V(this.el).findOne('.connection').attr({
              stroke: 'url(#pattern-' + this.id + ')'
            });
            
            // 缓存原来的stroke-width
            this.strokeWidth = connection.attr('stroke-width') || 1;
          }
          
          // 确保我们停止了正在进行的模式更新。
          joint.util.cancelFrame(this.frameId);

          this.frameId = joint.util.nextFrame(this.fillWithPattern);

          return this;
        },
        fillWithPattern: function() {
          var strokeWidth = this.strokeWidth;
          // we get the bounding box of the linkView without the transformations
          // and expand it to all 4 sides by the stroke width
          // (making sure there is always enough room for drawing,
          // even if the bounding box was tiny.
          // Note that the bounding box doesn't include the stroke.)
          var bbox = joint.g.rect(joint.V(this.el).bbox(true)).moveAndExpand({
            x: -strokeWidth,
            y: -strokeWidth,
            width: 2 * strokeWidth,
            height: 2 * strokeWidth
          });

          // create an array of all points the link goes through
          // (route doesn't contain the connection points)
          var points = [].concat(this.sourcePoint, this.route, this.targetPoint);

          // transform all points to the links coordinate system
          points = _.map(points, function(point) {
            return joint.g.point(point.x - bbox.x, point.y - bbox.y);
          });

          // create a canvas of the size same as the link bounding box
          var canvas = document.createElement('canvas');
          canvas.width = bbox.width;
          canvas.height = bbox.height;
          var ctx = canvas.getContext('2d');
          ctx.lineWidth = strokeWidth;
          ctx.lineJoin = "round"; //lineJoin 属性设置或返回所创建边角的类型，当两条线交汇时。bevel/round/miter。
          ctx.lineCap = "round"; //lineCap 属性设置或返回线条末端线帽的样式。butt/round/square

          // iterate over the points and execute the drawing function
          // for each segment
          for(var i = 0, pointsCount = points.length - 1; i < pointsCount; i++) {
            ctx.save();
            var gradientPoints = this.gradientPoints(points[i], points[i + 1], strokeWidth);
            var gradient = ctx.createLinearGradient.apply(ctx, gradientPoints);

            this.drawPattern.call(this, ctx, points[i], points[i + 1], strokeWidth, gradient);

            ctx.restore();
          }

          // generate data URI from the canvas
          var dataUri = canvas.toDataURL('image/png');

          // update the pattern image and the dimensions
          this.pattern.attr(bbox);
          this.patternImage.attr({
            width: bbox.width,
            height: bbox.height,
            'xlink:href': dataUri
          });
        },
        // finds a gradient with perpendicular direction to a link segment
        gradientPoints: function(from, to, width) {
          var angle = joint.g.toRad(from.theta(to) - 90);
          var center = joint.g.line(from, to).midpoint();
          var start = joint.g.point.fromPolar(width / 2, angle, center);
          var end = joint.g.point.fromPolar(width / 2, Math.PI + angle, center);
          return [start.x, start.y, end.x, end.y];
        },
        // A drawing function executed for all links segments.
        drawPattern: function(ctx, from, to, width, gradient) {
          var innerWidth = width - 4;
          var outerWidth = width;
          var buttFrom = joint.g.point(from).move(to, -outerWidth / 2);
          var buttTo = joint.g.point(to).move(from, -outerWidth / 2);

          /*
          ctx.beginPath();
          ctx.lineWidth = outerWidth;
          ctx.strokeStyle = 'rgba(0,0,0,0.6)';

          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
          ctx.closePath();
          */ 
          
          var lineColor = "blue";
          if(this.model.get("attrs") && this.model.get("attrs")[".connection"]) {
            lineColor = this.model.get("attrs")[".connection"]["stroke"] ? this.model.get("attrs")[".connection"]["stroke"] : lineColor;
          }
          var patternColor = "#ffffff";
          if(this.model.get("patternColor")) {
            patternColor = this.model.get("patternColor");
          }
          gradient.addColorStop(0.000, lineColor);
          gradient.addColorStop(0.500, patternColor);
          gradient.addColorStop(1.000, lineColor);

          ctx.beginPath();
          ctx.lineWidth = innerWidth;
          ctx.strokeStyle = gradient;
          ctx.moveTo(from.x, from.y);

          ctx.lineTo(to.x, to.y);
          ctx.stroke();
          ctx.closePath();
        }
      });

      /**
       * 新建组态视图
       * @param {Object} callbackFun
       */
      var createConfigView = function(callbackFun) {
        $scope.configureInfo = {
          viewId: 0,
          viewTitle: '新建组态视图' + new Date().Format("yyyy-MM-dd"),
          viewType: 'configure',
          template: {
            type: 0
          },
          domainPath: '',
          description: ''
        };

        var dialog = ngDialog.open({
          template: '../partials/dialogue/configure_dia.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });
        $scope.checkSameName($scope.configureInfo.viewTitle);

        // 模板、项目、客户、普通之间的切换
        var typeWatcher = function(n, o, s) {
          var callback = function(event) {
            var tree = event.data;
            $scope.typeContents = [].concat(tree);
          };
          if(n < 2) {
            callback({
              data: $scope.treeAry
            });
          } else if(n == 3) {
            if($scope.getResourceByModelId) {
              callback($scope.getResourceByModelId)
            } else {
              resourceUIService.getResourceByModelId(301, function(event) {
                $scope.getResourceByModelId = event;
                callback(event);
              });
            };
          } else if(n == 2) {
            if($scope.getResourceByModelId) {
              callback($scope.getResourceByModelId)
            } else {
              resourceUIService.getResourceByModelId(302, function(event) {
                $scope.getResourceByModelId = event;
                callback(event);
              });
            };
          }
        };
        $scope.$watch("configureInfo.template.type", typeWatcher);

        //保存按钮
        $scope.saveData = function() {
          if(!$scope.configureInfo.template.resourceId || $scope.configureInfo.template.resourceId == 0) {
            $scope.configureInfo.template = null;
          } else {
            if($scope.configureInfo.template.type == 1) {
              $scope.configureInfo.template.resourceType = "device";
            } else {
              $scope.configureInfo.template.resourceType = "project";
            }
          }
          viewFlexService.addView($scope.configureInfo, function(returnObj) {
            if(returnObj.code == 0) {
              var viewId = returnObj.data.viewId;
              if(dialog) {
                dialog.close();
                $('#' + dialog.id).remove();
              }
              growl.success("保存成功");
              location.href = "index.html#/configure/" + viewId;
              /** 不使用回调方式，直接刷新了URL
              if(callbackFun) {
                callbackFun(returnObj.data.viewId);
              }
              growl.success("保存成功")
              */
            }
          });
        };
        $scope.closeDialog = function() {
          if(dialog) {
            dialog.close();
            $('#' + dialog.id).remove();
            window.history.back();
          }
        };
      };
      var linkAnHandler = function(cell) {
        var dr = cell.get("attrs")[".connection"]["stroke-dasharray"];
        var linkAn = cell.get("linkAn");
        
        var cellDom = jQuery("[model-id=" + cell.id + "]").find(".connection")[0];
        var oldClass = cellDom.getAttribute("class");
        oldClass = oldClass.replace(' runslow', '');
        oldClass = oldClass.replace(' runnormal', '');
        oldClass = oldClass.replace(' runfast', '')
        if(dr && dr != "0") {
          if(linkAn == "慢速") {
            oldClass = oldClass + ' runslow';
          } else if(linkAn == "普通") {
            oldClass = oldClass + ' runnormal';
          } else if(linkAn == "快速") {
            oldClass = oldClass + ' runfast';
          }
        }
        cellDom.setAttribute("class", oldClass);
      }
      
      /**
       * 更新组件的状态
       */
      $scope.updateCellHandler = function() {
        if(inspector) {
          if(inspector.getModel().collection) {
            inspector.updateCell();
            var cell = inspector.options.cell;
            if(cell instanceof joint.dia.Link) {
              linkAnHandler(cell);
            }
          }
        }
      };
      /**
       * 右边栏控制
       * @param {Object} status
       */
      var inspectorStatus = function(status) {
        $scope.selectedView.inspector = false;
        $scope.$applyAsync();
        $.AdminLTE.controlSidebar.openOrClose(status)
      }

      $scope.viewConfigClick = function() {
        $scope.selectedView.inspector = true;
        $scope.$applyAsync();
      }

      /********以下是划线的功能********/
      var creatingLine = false;
      var lineCoords = {
        source: {},
        target: {}
      };
      var tempLine;
      var tempLines = [];
      $(document.body).on('mousemove', function(evt) {

        if(creatingLine) {

          evt.preventDefault();
          evt.stopPropagation();
          evt = joint.util.normalizeEvent(evt);

          var clientCoords = paper.snapToGrid({
            x: evt.clientX,
            y: evt.clientY
          });
          lineCoords.x2 = clientCoords.x;
          lineCoords.y2 = clientCoords.y;

          var d = 'M ' + lineCoords.x1 + ' ' + lineCoords.y1 + ' L ' + lineCoords.x2 + ' ' + lineCoords.y2;
          tempLine.attr('d', d);
        }
      });
      /********以上是划线的功能********/

      /**
       * 主动添加组件的处理
       * @param {Object} cell
       */
      var addCellhandler = function(cell) {
        if(cell.get("extend") == "copy") {
          var parentCell = JSON.parse(cell.get("parentCell"));
          var embedObjs = JSON.parse(cell.get("embedObjs"));
          var parentCellPos = cell.get("position");
          var oldParentCellPos = parentCell.position;
          cell.remove();
          parentCell.id = joint.util.uuid();
          parentCell.embeds = [];
          parentCell.z = graph.getLastCell() ? ((Number(graph.getLastCell().get('z')) || 0) + 1) : 1;
          if(parentCell.z > Number.MAX_VALUE) parentCell.z = Number.MAX_VALUE;
          parentCell.position = parentCellPos;
          if(embedObjs) {
            for(var i = 0; i < embedObjs.length; i++) {
              var embedobj = embedObjs[i]
              embedobj.id = joint.util.uuid();
              parentCell.embeds.push(embedobj.id);
              embedobj.parent = parentCell.id;
              embedobj.position.x = (embedobj.position.x - oldParentCellPos.x) + parentCellPos.x;
              embedobj.position.y = (embedobj.position.y - oldParentCellPos.y) + parentCellPos.y;
              embedobj.z = parentCell.z + i + 1;
              if(embedobj.z > Number.MAX_VALUE) embedobj.z = Number.MAX_VALUE;
              graph.addCell(embedobj);
            };
          }
          graph.addCell(parentCell);
        } else if(typeof(cell.get("z")) == "string") {
          var newCell = cell.clone()
          newCell.unset("z");
          newCell.attributes.z = graph.getLastCell() ? ((Number(graph.getLastCell().get('z')) || 0) + 1) : 1;
          if(newCell.attributes.z > Number.MAX_VALUE) newCell.attributes.z = Number.MAX_VALUE;
          cell.remove();
          graph.addCell(newCell);
        }
      }

      /**
       * 组态核心功能代码区域，基于Rappid,包括
       * initializePaper
       * initializeStencil
       * initializeSelection
       * initializeHaloAndInspector
       * initializeNavigator
       * initializeClipboard
       * initializeMyCommandManager
       * initializeCommandManager
       * toolTips
       * initView
       * initAlertIconfunction
       */
      $scope.initialization = [
        // Create a graph, paper and wrap the paper in a PaperScroller.
        // 创建一个图层，页面和包裹页面的页面控制层
        function initializePaper(scope, element) {
          var interactive = false;
          if(!displayMode) {
            interactive = true;
          }
          $scope.graph = graph = new joint.dia.Graph;

          paper = new joint.dia.Paper({
            width: 1200,
            height: 700,
            gridSize: 10,
            perpendicularLinks: true,
            model: graph,
            markAvailable: true,
            interactive: interactive,
            defaultLink: new joint.dia.Link({
              attrs: {
                '.marker-source': {
                  d: 'M 10 0 L 0 5 L 10 10 z',
                  transform: 'scale(0.001)'
                },
                '.marker-target': {
                  d: 'M 10 0 L 0 5 L 10 10 z'
                },
                '.connection': {
                  stroke: 'black'
                }
              }
            }),
            linkConnectionPoint: joint.util.shapePerimeterConnectionPoint,
            linkView: PatternLinkView
          });
          paperScroller = new joint.ui.PaperScroller({
            paper: paper,
            autoResizePaper: false,
            padding: 0
          });

          if(!displayMode) {
            snapLines = new joint.ui.Snaplines({
              paper: paper
            });
          };

          $('.paper-container', element).append(paperScroller.el);
          scope.components.paper = paper;
          scope.components.scroller = paperScroller;
          scope.components.graph = graph;
          scope.data.paperscorllerW = $('.joint-paper-scroller').width();
          graph.on('add', function(cell, collection, opt) {
            addCellhandler(cell);
          });
          if($routeParams.type == 'service') {
            $(paperScroller.el).css("overflow", "hidden");
            $(paperScroller.el).css("width", "auto");
            $(paperScroller.el).css("height", "auto");
          } else {
            return
            $('.paper-echart-container').scroll(function() {
              $('.joint-paper-scroller').scrollTop($('.paper-echart-container').scrollTop())
            });
            $('.joint-paper-scroller').scroll(function() {
              $('.paper-echart-container').scrollTop($('.joint-paper-scroller').scrollTop())
            });
          }
        },

        // 创建模板
        function initializeStencil(scope, element) {
          function layout(graph) {
            joint.layout.GridLayout.layout(graph, {
              columnWidth: (stencil.options.width - 10) / 2,
              columns: 2,
              rowHeight: 90,
              resizeToFit: false,
              dy: 10,
              dx: 0
            });
          }

          stencil = new joint.ui.Stencil({
            graph: graph,
            paper: paper,
            width: 230,
            dropAnimation: true,
            groups: scope.data.stencil.groups,
            search: scope.data.stencil.search
          }).on('filter', layout);

          stencil.renderSearch = function() {
            return "";
            /* 暂时不要查询 */
            return $('<div class="sidebar-form"><input placeholder="搜索..." type="search" class="search form-control"/></div>');
          }

          $('.stencil-container', element).append(stencil.render().el);

          _.each(scope.data.stencil.shapes, function(shapes, groupName) {
            stencil.load(shapes, groupName);
            layout(stencil.getGraph(groupName));
            stencil.getPaper(groupName).fitToContent(1, 1, 10);
          });
          stencil.closeGroups();
          scope.components.layout = layout;
          scope.components.stencil = stencil;
        },
        // Create Selection
        // 创建选择
        function initializeSelection(scope, element) {
          selection = new Backbone.Collection;
          selectionView = new joint.ui.Selection({
            paper: paper,
            graph: graph,
            model: selection
          });

          // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
          // 当shift键被按下时，启动用户在页面的空白区域时开始选择。
          // Otherwise, initiate paper pan.
          // 否则，页面默认功能
          paper.on('blank:pointerdown', function(evt, x, y) {
            inspectorStatus(false);
            if(scope.data.drawStatus) {
              var createLine = function() {
                var d = 'M ' + x + ' ' + y + ' L ' + x + ' ' + y;
                if(tempLine) {
                  tempLines.push(tempLine);
                }
                tempLine = joint.V('path', {
                  stroke: 'black',
                  'stroke-width': 1,
                  d: d
                });
                joint.V(paper.viewport).append(tempLine);
                if(!creatingLine) {
                  lineCoords.source = {
                    x: x,
                    y: y
                  };
                } else {
                  if(!lineCoords.vertices) lineCoords.vertices = [];
                  lineCoords.vertices.push({
                    x: x,
                    y: y
                  })
                }
                creatingLine = true;
                lineCoords.x1 = x;
                lineCoords.y1 = y;
              }
              if(3 != evt.which) {
                createLine();
              } else {
                if(creatingLine) {
                  createLine();
                  lineCoords.target = {
                    x: x,
                    y: y
                  };
                  var tmplink = new joint.dia.Link({
                    source: lineCoords.source,
                    target: lineCoords.target,
                    vertices: lineCoords.vertices,
                    attrs: {}
                  });
                  graph.addCell([tmplink]);
                  creatingLine = false;
                  lineCoords = {
                    source: {},
                    target: {}
                  };
                  tempLines.forEach(function(line) {
                    line.remove();
                  });
                  tempLines = [];
                  tempLine = null;
                  scope.$apply(function() {
                    scope.data.drawStatus = false;
                  });
                }
              }
            } else {
              if(shiftHold) {
                selectionView.startSelecting(evt, x, y);
              } else {
                selectionView.cancelSelection();
                paperScroller.startPanning(evt, x, y);
                /* 这里暂时取消了。因为涉及到组态对象拖动时不能变化的问题4
                if(inspector && inspector.options.cell === $scope.selectedItem.cell) {
                  if(inspector.getModel().collection) {
                    inspector.updateCell();
                  }
                  inspector.remove();
                }
                */
              }
            }
          });

          paper.on('element:pointerdown', function(cellView, evt) {
            // Select an element if CTRL/Meta key is pressed while the element is clicked.
            // 如果Ctrl /Meta 键是被按下，当元素被点击时，添加到selectionBox中
            if((evt.ctrlKey || evt.metaKey) && !(cellView.model instanceof joint.dia.Link)) {
              selectionView.createSelectionBox(cellView);
              selection.add(cellView.model);
            }
          });

          selectionView.on('selection-box:pointerdown', function(evt) {
            // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
            // 取消之前的效果
            if(evt.ctrlKey || evt.metaKey) {
              var cell = selection.get($(evt.target).data('model'));
              selectionView.destroySelectionBox(paper.findViewByModel(cell));
              selection.reset(selection.without(cell));
            }
          });

          // Disable context menu inside the paper.
          // 取消HTML默认页面菜单
          // This prevents from context menu being shown when selecting individual elements with Ctrl in OS X.
          paper.el.oncontextmenu = function(evt) {
            evt.preventDefault();
          };

          keyboardJS.on('delete, backspace', function(evt) {

            if(!$.contains(evt.target, paper.el)) {
              // remove selected elements from the paper only if the target is the paper
              return;
            }

            commandManager.initBatchCommand();
            selection.invoke('remove');
            commandManager.storeBatchCommand();
            selectionView.cancelSelection();

            if(backspaceHold && !$(evt.target).is("input, textarea")) {
              // Prevent Backspace from navigating back.
              evt.preventDefault();
            }
          });
        },
        // Halo, FreeTransfrom  & Inspector
        // 元素控制器，自由转换和属性
        function initializeHaloAndInspector(scope, element) {
          function openCellTools(cellView) {
            var $inspectorHolder = $('#control-sidebar-settings-data', element);
            var $inspectorHolder_text = $('#control-sidebar-settings-text', element);
            var $inspectorHolder_presentation = $('#control-sidebar-settings-presentation', element);
            var $inspectorHolder_geometry = $('#control-sidebar-settings-geometry', element);
            var cell = cellView.model || cellView;
            var halo;

            if(displayMode) {
              if(!cellsDic[cell.id]) cellsDic[cell.id] = jQuery.extend(true, {}, cell.attributes);
              var subViewState = cell.get('subViewId') && cell.get('subViewId') != "number:0" && cell.get('subViewId') != "?";
              var nodeState = cell.get('nodeId') && cell.get('nodeId') != "number:0" && cell.get('nodeId') != "?";
              if(subViewState == null || nodeState == null) {
                cell.attributes = cellsDic[cell.id];
                subViewState = cell.get('subViewId') && cell.get('subViewId') != "number:0" && cell.get('subViewId') != "?";
                nodeState = cell.get('nodeId') && cell.get('nodeId') != "number:0" && cell.get('nodeId') != "?";
              }
              if(subViewState || nodeState) {
                halo = new joint.ui.Halo({
                  cellView: cellView,
                  type: 'toolbar'
                }).render();
                halo.removeHandles();
              }
              if(nodeState) {
                var dirNodeId; //指令设备对象
                var dirModelId; //设备对象模板
                var nodeIdAry = cell.get('nodeId').toString().split(":");
                if(nodeIdAry.length > 0 && nodeIdAry[nodeIdAry.length - 1] != '?')
                  dirNodeId = Number(nodeIdAry[nodeIdAry.length - 1]);
                var modelIdAry = cell.get('modelId').toString().split(":");
                if(modelIdAry.length > 0 && modelIdAry[modelIdAry.length - 1] != '?')
                  dirModelId = Number(modelIdAry[modelIdAry.length - 1]);
                var dirModel = resourceUIService.rootModelDic[dirModelId];
                var dirSn = cell.get('sn');
                $scope.selectedItem["nodeId"] = dirNodeId;
                halo.addHandle({
                  name: 'alertaction',
                  position: 's',
                  icon: 'images/alert.svg'
                });
                halo.on('action:alertaction:pointerdown', function(evt) {
                  evt.stopPropagation();
                  window.open("../app-oc/index.html#/configAlert/" + dirNodeId + "/node");
                });

                halo.addHandle({
                  name: 'chartaction',
                  position: 's',
                  icon: 'images/chart.svg'
                });
                halo.on('action:chartaction:pointerdown', function(evt) {
                  evt.stopPropagation();
                  window.open("../app-oc/index.html#/emcsView/" + dirNodeId);
                });
                halo.addHandle({
                  name: 'infoaction',
                  position: 's',
                  icon: 'images/info.svg'
                });
                halo.on('action:infoaction:pointerdown', function(evt) {
                  evt.stopPropagation();
                  window.open("../app-oc/index.html#/facility/sn/" + dirSn);
                });
                halo.addHandle({
                  name: 'configaction',
                  position: 's',
                  icon: 'images/config.svg'
                });
                halo.on('action:configaction:pointerdown', function(evt) {
                  evt.stopPropagation();
                  if(dirModel && dirModel.category == "Device")
                    window.open("../app-oc/index.html#/resource_type/" + dirModelId + "/0");
                  else
                    window.open("../app-oc/index.html#/resourcegroup/" + dirModelId + "/0");
                });
                if(cell.get('directiveIds')) {
                  halo.addHandle({
                    name: 'directiveaction',
                    position: 's',
                    icon: 'images/directive.svg'
                  });
                  halo.on('action:directiveaction:pointerdown', function(evt) {
                    evt.stopPropagation();
                    inspectorStatus(true);
                    var directiveList = [];
                    cell.get('directiveIds').forEach(function(directiveId) {
                      if(typeof(directiveId) != "number") {
                        var ary = directiveId.split(":");
                        directiveId = Number(ary[ary.length - 1]);
                      }
                      dirModel.directives.forEach(function(dirObj) {
                        if(directiveId == dirObj.id) {
                          directiveList.push(dirObj);
                        }
                      })
                    })
                    $scope.directiveList = directiveList;
                    $scope.$apply();
                  });
                }
                if(cell.get('valueConfig')) {
                  var isSend = false; //是否发送过

                  $scope.valueLevels = cell.get('valueConfig');
                  if($scope.valueLevels && dirModel) {
                    $scope.valueLevels.forEach(function(valueLvevel) {
                      if(valueLvevel.stateDisplay && valueLvevel.valueDirective && valueLvevel.valueDirectiveAttr) {
                        isSend = true;
                        dirModel.directives.forEach(function(dirObj) {
                          if(valueLvevel.valueDirective == dirObj.id) {
                            dirObj.value = valueLvevel.valueDirectiveAttr;
                            $scope.sendItemDir(dirObj, dirNodeId)
                          }
                        })

                      }
                    });
                    if(!isSend && $scope.valueLevels[0].valueDirective && $scope.valueLevels[0].valueDirectiveAttr) {
                      dirModel.directives.forEach(function(dirObj) {
                        if($scope.valueLevels[0].valueDirective == dirObj.id) {
                          dirObj.value = $scope.valueLevels[0].valueDirectiveAttr;
                          $scope.sendItemDir(dirObj, dirNodeId)
                        }
                      })
                    }
                  }
                }
              }

              if(subViewState) {
                var dirSubViewId
                var subViewIdAry = cell.get('subViewId').toString().split(":");
                if(subViewIdAry.length > 0 && subViewIdAry[subViewIdAry.length - 1] != '?')
                  dirSubViewId = Number(subViewIdAry[subViewIdAry.length - 1]);

                halo.addHandle({
                  name: 'nextaction',
                  position: 's',
                  icon: 'images/subview.svg'
                });
                halo.on('action:nextaction:pointerdown', function(evt) {
                  evt.stopPropagation();
                  if($routeParams.type == 'service') {
                    loc.path("display/" + dirSubViewId + "/service");
                  } else {
                    if(dirSubViewId > 0) {
                      SwSocket.unregister(uuid);
                      uuid = Math.uuid();
                      scope.data.viewRoutes.push($scope.selectedView);
                      showViewContent(scope, dirSubViewId);
                    }
                  }
                });
              }
              return;
            } else {
              if(scope.components.commander.configDispaly)
                inspectorStatus(true);

              halo = new joint.ui.Halo({
                cellView: cellView
              }).render();
              halo.options.clone = function(cell, opt) {
                var cloneCell = cell.clone();
                var z = (Number(graph.getLastCell().get('z')) || 0) + 1;
                cloneCell.attributes["z"] = z;
                cloneCell.prop("z", z);
                cloneCell.unset("parent")
                return cloneCell;
              };
              if(cell.get("alertConfig")) {
                $scope.alertLevels = cell.get("alertConfig");
              } else {
                $scope.alertLevels = [{
                  label: '正常',
                  id: 0
                }, {
                  label: '警告',
                  id: 1
                }, {
                  label: '次要',
                  id: 2
                }, {
                  label: '重要',
                  id: 3
                }, {
                  label: '严重',
                  id: 4
                }];
              }
              if(cell.get("valueConfig")) {
                $scope.valueLevels = cell.get("valueConfig");
              } else {
                $scope.valueLevels = [{
                  label: '第一组数据',
                  id: 0,
                  stateDisplay: true
                }, {
                  label: '第二组数据',
                  id: 1,
                  stateDisplay: false
                }, {
                  label: '第三组数据',
                  id: 2,
                  stateDisplay: false
                }, {
                  label: '第四组数据',
                  id: 3,
                  stateDisplay: false
                }, {
                  label: '第五组数据',
                  id: 4,
                  stateDisplay: false
                }, {
                    label: '第六组数据',
                    id: 5,
                    stateDisplay: false
                }, {
                    label: '第七组数据',
                    id: 6,
                    stateDisplay: false
                }, {
                    label: '第八组数据',
                    id: 7,
                    stateDisplay: false
                }];
              }
              if(cell.attributes.embeds && cell.attributes.embeds.length > 0) {
                halo.addHandle({
                  name: 'embedsaction',
                  position: 's',
                  icon: 'images/info.svg'
                });
                halo.addHandle({
                  name: 'copyaction',
                  position: 'w',
                  icon: 'images/print.png'
                });
                var extendHalohandler = function(flg) {
                  var embeds = [];
                  var embedObjs = [];
                  if($scope.selectedItem.cell.attributes.embeds) {
                    var parentCell = $scope.selectedItem.cell.clone();
                    parentCell.id = joint.util.uuid();
                    parentCell.attributes.id = parentCell.id;
                    parentCell.attributes.parent = "";
                    parentCell.attributes.z = graph.getLastCell() ? ((Number(graph.getLastCell().get('z')) || 0) + 1) : 1;
                    var i = 1;
                    $scope.selectedItem.cell.attributes.embeds.forEach(function(cellid) {
                      var cloneCell = graph.getCell(cellid).clone();
                      cloneCell.id = joint.util.uuid();
                      cloneCell.attributes.id = cloneCell.id;
                      cloneCell.attributes.parent = parentCell.id;
                      cloneCell.attributes.z = parentCell.attributes.z + i;
                      embeds.push(cloneCell.id);
                      if(flg == "embedsaction") {
                        graph.addCell(cloneCell);
                      } else if(flg == "copyaction") {
                        embedObjs.push(cloneCell);
                      }
                      i++;
                    });
                    parentCell.attributes.embeds = embeds;
                    if(flg == "embedsaction") {
                      graph.addCell(parentCell);
                    } else if(flg == "copyaction") {
                      var copyactionhandler = function(dataURL) {
                        var imageWidth = 60;
                        var imageHeight = 60;
                        var pjson = parentCell.toJSON();
                        var tmpcopy = {
                          "type": "basic.Image",
                          "extend": "copy",
                          "parentCell": JSON.stringify(pjson),
                          "embedObjs": JSON.stringify(embedObjs),
                          "size": {
                            "width": imageWidth,
                            "height": imageHeight
                          },
                          "attrs": {
                            "image": {
                              "width": imageWidth,
                              "height": imageHeight,
                              "xlink:href": dataURL
                            },
                            "text": {
                              "text": pjson.attrs.text.text,
                              "font-size": 12,
                              "stroke": "#000000",
                              "display": "block",
                              "stroke-width": 0,
                              "fill": "#000000",
                              "ref-dy": 10,
                              "font-family": "Microsoft YaHei"
                            }
                          }
                        }
                        $scope.$parent.configCustoms.push(tmpcopy);
                        scope.components.stencil.load($scope.$parent.configCustoms, "enterprise");
                        scope.components.layout(stencil.getGraph("enterprise"));
                        scope.components.stencil.getPaper("enterprise").fitToContent(1, 1, 10);
                        var newconfig = {
                          key: "",
                          value: JSON.stringify(tmpcopy),
                          groupName: "ConfigurationCustom",
                          keyDesc: "",
                          invalid: false,
                          canDelete: true,
                          domainPath: "",
                          id: 0,
                          label: pjson.attrs.text.text
                        };
                        configUIService.saveConfig(newconfig, function(returnObj) {})
                      }

                      paper.toPNG(function(dataURL) {
                        copyactionhandler(dataURL);
                      }, {
                        padding: 0
                      })
                    }
                  }
                }

                halo.on('action:embedsaction:pointerdown', function(evt) {
                  evt.stopPropagation();
                  extendHalohandler("embedsaction");
                });
                halo.on('action:copyaction:pointerdown', function(evt) {
                  evt.stopPropagation();
                  extendHalohandler("copyaction");
                });
              };

              /** 去掉Text的resize按钮 */
              if(cell.get("type") == "basic.Text") {
                halo.removeHandle('resize');
              }
              /** freeTransform，halo已经具有该功能*/
              if(cell.get("type") != "link") {
                var freeTransform = new joint.ui.FreeTransform({
                  cellView: cellView
                }).render();
              }
            }

            if($scope.selectedItem.cell && $scope.selectedItem.cell.id == cell.id) return;
            var selectedItem = {
              modelId: ($scope.selectedView.template && $scope.selectedView.template.resourceType == "device") ? $scope.selectedView.template.resourceId : 0,
              nodeId: 0,
              kpiId: 0,
              subViewId: 0,
              projectId: 0,
              customerId: 0,
              echartViewId: 0,
              kpis: [],
              nodes: [],
              projects: [],
              customers: [],
              cell: cell,
              stateId: 0,
              selectType: -1,
              domainPath: $scope.selectedView.domainPath,
              nodeIds: [],
              directives: [],
              stateType: 0,
              animateType:0,
              unitType: 0,
              z: 0,
              extendDomainid: 0,
              cursor: 'default'
            };

            //获得组件图层
            if(cell.get('z')) {
              var zTypeAry = cell.get('z').toString().split(":");
              if(zTypeAry.length > 0 && zTypeAry[zTypeAry.length - 1] != '?')
                selectedItem.z = Number(zTypeAry[zTypeAry.length - 1]);
            }
            //获得设备选择方式
            if(cell.get('selectType')) {
              var selectTypeAry = cell.get('selectType').toString().split(":");
              if(selectTypeAry.length > 0 && selectTypeAry[selectTypeAry.length - 1] != '?')
                selectedItem.selectType = Number(selectTypeAry[selectTypeAry.length - 1]);
            }

            if(cell.get("type") == "chart.Plot") {
              if(cell.get('echartViewId')) {
                var echartViewIdAry = cell.get('echartViewId').toString().split(":");
                if(echartViewIdAry.length > 0 && echartViewIdAry[echartViewIdAry.length - 1] != '?')
                  selectedItem.echartViewId = Number(echartViewIdAry[echartViewIdAry.length - 1]);
              }
              if(cell.get('tabsInfo')) {
                selectedItem.tabsInfo = cell.get('tabsInfo');
              }
              if(cell.get('nodeIds')) {
                var nodeIdsAry = [];
                cell.get('nodeIds').forEach(function(nodeItem) {
                  var ary = nodeItem.toString().split(":");
                  nodeIdsAry.push(Number(ary[ary.length - 1]))
                });
                selectedItem.nodeIds = nodeIdsAry;
              }
            } else {
              if(cell.get('kpiId')) {
                var kpiIdAry = cell.get('kpiId').toString().split(":");
                if(kpiIdAry.length > 0 && kpiIdAry[kpiIdAry.length - 1] != '?')
                  selectedItem.kpiId = Number(kpiIdAry[kpiIdAry.length - 1]);
              }
              if(cell.get('nodeId')) {
                var nodeIdAry = cell.get('nodeId').toString().split(":");
                if(nodeIdAry.length > 0 && nodeIdAry[nodeIdAry.length - 1] != '?')
                  selectedItem.nodeId = Number(nodeIdAry[nodeIdAry.length - 1]);
              }
              if(cell.get('projectId')) {
                var projectIdAry = cell.get('projectId').toString().split(":");
                if(projectIdAry.length > 0 && projectIdAry[projectIdAry.length - 1] != '?')
                  selectedItem.projectId = Number(projectIdAry[projectIdAry.length - 1]);
              }
              if(cell.get('customerId')) {
                var customerIdAry = cell.get('customerId').toString().split(":");
                if(customerIdAry.length > 0 && customerIdAry[customerIdAry.length - 1] != '?')
                  selectedItem.customerId = Number(customerIdAry[customerIdAry.length - 1]);
              }
              if(cell.get('subViewId')) {
                var subViewIdAry = cell.get('subViewId').toString().split(":");
                if(subViewIdAry.length > 0 && subViewIdAry[subViewIdAry.length - 1] != '?')
                  selectedItem.subViewId = Number(subViewIdAry[subViewIdAry.length - 1]);
              }

              if(cell.get('stateId')) {
                var stateIdAry = cell.get('stateId').toString().split(":");
                if(stateIdAry.length > 0 && stateIdAry[stateIdAry.length - 1] != '?')
                  selectedItem.stateId = Number(stateIdAry[stateIdAry.length - 1]);
              }
              if(cell.get('stateType')) {
                var stateTypeAry = cell.get('stateType').toString().split(":");
                if(stateTypeAry.length > 0 && stateTypeAry[stateTypeAry.length - 1] != '?')
                  selectedItem.stateType = Number(stateTypeAry[stateTypeAry.length - 1]);
              }
              if(cell.get('animateType')) {
                var animateTypeAry = cell.get('animateType').toString().split(":");
                if(animateTypeAry.length > 0 && animateTypeAry[animateTypeAry.length - 1] != '?')
                  selectedItem.animateType = Number(animateTypeAry[animateTypeAry.length - 1]);
              }
              if(cell.get('cursor')) {
                var cursorAry = cell.get('cursor').toString().split(":");
                if(cursorAry.length > 0 && cursorAry[cursorAry.length - 1] != '?')
                  selectedItem.cursor = String(cursorAry[cursorAry.length - 1]);
              }
              if(cell.get('unitType')) {
                var unitTypeAry = cell.get('unitType').toString().split(":");
                if(unitTypeAry.length > 0 && unitTypeAry[unitTypeAry.length - 1] != '?')
                  selectedItem.unitType = Number(unitTypeAry[unitTypeAry.length - 1]);
              }
              if(cell.get('sn')) {
                selectedItem.sn = cell.get('sn');
              }
              if(cell.get('extendDomainId')) {
                var extenDomainAry = cell.get('extendDomainId').toString().split(":");
                if(extenDomainAry.length > 0 && extenDomainAry[extenDomainAry.length - 1] != '?')
                  selectedItem.extendDomainId = Number(extenDomainAry[extenDomainAry.length - 1]);
              }
              //            if(cell.get('extendDomains')) {
              //              selectedItem.extendDomains = cell.get('extendDomains');
              //            }
              if(cell.get('directiveIds')) {
                var directivesAry = [];
                cell.get('directiveIds').forEach(function(directiveItem) {
                  var ary = directiveItem.toString().split(":");
                  directivesAry.push(Number(ary[ary.length - 1]))
                });
                selectedItem.directiveIds = directivesAry;
              }
            }
            if(selectedItem.selectType) { //selectType不使用
              if(cell.get('domainPath')) {
                var domainPathAry = cell.get('domainPath').toString().split(":");
                if(domainPathAry.length > 0 && domainPathAry[domainPathAry.length - 1] != '?')
                  selectedItem.domainPath = domainPathAry[domainPathAry.length - 1];
              }
              if(cell.get('modelId')) {
                var modelIdAry = cell.get('modelId').toString().split(":");
                if(modelIdAry.length > 0 && modelIdAry[modelIdAry.length - 1] != '?')
                  selectedItem.modelId = Number(modelIdAry[modelIdAry.length - 1]);
              }
              if(cell.get('projectId')) {
                var projectIdAry = cell.get('projectId').toString().split(":");
                if(projectIdAry.length > 0 && projectIdAry[projectIdAry.length - 1] != '?')
                  selectedItem.projectId = Number(projectIdAry[projectIdAry.length - 1]);
              }
              if($scope.selectedView.template && $scope.selectedView.template.resourceType == 'project') {
                var projectId = $scope.selectedView.template.resourceId;
                if($scope.selectedView.temp.domains) {
                  selectedItem.domainPath = $scope.selectedView.temp.domains;
                  $scope.selectedItem = jQuery.extend(true, {}, selectedItem);
                  $scope.domainAndModelChangeHandler(selectedItem);
                } else {
                  resourceUIService.getResourceById(projectId, function(event) {
                    $scope.selectedView.temp.domains = event.data.domainPath;
                    selectedItem.domainPath = $scope.selectedView.temp.domains;
                    $scope.selectedItem = jQuery.extend(true, {}, selectedItem);
                    $scope.domainAndModelChangeHandler(selectedItem);
                  })
                }
              } else {
                $scope.selectedItem = jQuery.extend(true, {}, selectedItem);
                $scope.domainAndModelChangeHandler(selectedItem);
              }
            }

            // No need to re-render inspector if the cellView didn't change. 强制刷新
            if(!inspector || inspector.options.cell !== cell || true) {

              if(inspector) {
                if(inspector.getModel().collection) {
                  // update cell if the model is still in the graph
                  inspector.updateCell();
                }
                // Clean up the old inspector if there was one.
                inspector.remove();
              }
              var inspectorDefs = scope.inspectorDefs[cell.get('type')];
              var inputs = inspectorDefs ? (inspectorDefs.inputs ? inspectorDefs.inputs : scope.commonInspectorInputs) : scope.commonInspectorInputs;
              var groups = inspectorDefs ? (inspectorDefs.groups ? inspectorDefs.groups : scope.commonInspectorGroups) : scope.commonInspectorGroups;
              if(cell.get('extend') == "alert") {
                inputs = _.extend(inputs, scope.extendAlertInputs);
                delete inputs.valueIcon;
                delete inputs.valueLevel;
                delete inputs.valueText;
                delete inputs.valueDirective;
                delete inputs.valueDirectiveAttr;
              } else if(cell.get('extend') == "value") {
                inputs = _.extend(inputs, scope.extendValueInputs);
                delete inputs.alertIcon;
                delete inputs.alertLevel;
                delete inputs.alertText;
              } else if(cell.get('extend') == "level") {
                inputs = _.extend({}, scope.levelInputs);
                delete inputs.alertIcon;
                delete inputs.alertLevel;
                delete inputs.alertText;
                delete inputs.valueIcon;
                delete inputs.valueLevel;
                delete inputs.valueText;
                delete inputs.valueDirective;
                delete inputs.valueDirectiveAttr;
              } else if(cell.get('extend') == "domain") {
                inputs = _.extend({}, scope.domainInputs);
                delete inputs.alertIcon;
                delete inputs.alertLevel;
                delete inputs.alertText;
                delete inputs.valueIcon;
                delete inputs.valueLevel;
                delete inputs.valueText;
                delete inputs.valueDirective;
                delete inputs.valueDirectiveAttr;
              } else if(cell.get('extend') == "switch") {
                inputs = _.extend({}, scope.switchInputs);
                delete inputs.alertIcon;
                delete inputs.alertLevel;
                delete inputs.alertText;
                delete inputs.valueIcon;
                delete inputs.valueLevel;
                delete inputs.valueText;
                delete inputs.valueDirective;
                delete inputs.valueDirectiveAttr;
              } else if(cell.get('extend') == "openangle") {
                inputs = _.extend({}, scope.openAngleInputs);
                delete inputs.alertIcon;
                delete inputs.alertLevel;
                delete inputs.alertText;
                delete inputs.valueIcon;
                delete inputs.valueLevel;
                delete inputs.valueText;
                delete inputs.valueDirective;
                delete inputs.valueDirectiveAttr;
              } else {
                delete inputs.alertIcon;
                delete inputs.alertLevel;
                delete inputs.alertText;
                delete inputs.valueIcon;
                delete inputs.valueLevel;
                delete inputs.valueText;
                delete inputs.valueDirective;
                delete inputs.valueDirectiveAttr;
              }

              inspector = new joint.ui.Inspector({
                inputs: inputs,
                groups: groups,
                cell: cell
              }).on('render', function() {
                this.$('[data-tooltip]').each(function() {
                  var $label = $(this);
                  new joint.ui.Tooltip({
                    target: $label,
                    content: $label.data('tooltip'),
                    right: '.inspector',
                    direction: 'right'
                  });
                });
              });
              var el = inspector.render().el;
              for(var i = 0; i < el.children.length; i++) {
                $(el.children[i]).wrap("<div class='inspector'></div>");
              }
              $inspectorHolder_geometry.html(el.children[3]);
              $inspectorHolder_presentation.html(el.children[2]);
              $inspectorHolder_text.html(el.children[1]);
              $inspectorHolder.html(el.children[0]);
              $compile($inspectorHolder)($scope);
              $compile($inspectorHolder_text)($scope);
              $compile($inspectorHolder_presentation)($scope);
              $compile($inspectorHolder_geometry)($scope);
            }

            // adjust selection
            selectionView.cancelSelection();
            selection.reset([cellView.model]);
          };

          paper.on('element:pointerup', function(cellView, evt) {
            evt.stopPropagation();
            if(cellView.model instanceof joint.dia.Element && !selection.contains(cellView.model)) {
              openCellTools(cellView);
            }
          });
          paper.on('element:mouseover', function(cellView) {
            if(cellView.model instanceof joint.dia.Element && !selection.contains(cellView.model)) {
              $scope.$broadcast("element:mouseouve:handler", cellView.model);
            }
          });
          paper.on('cell:pointerup', function(cellView, evt) {
            if(cellView.model instanceof joint.dia.Link) {
              openCellTools(cellView);
            }
          });
          /* 线条上的事件用cell:pointerup
          paper.on('link:options', function(evt, cellView, x, y) {
            openCellTools(cellView);
          });
          */
        },
        // Navigator
        // 导航（没有使用）
        function initializeNavigator(scope, element) {
          return;
          navigator = new joint.ui.Navigator({
            width: 240,
            height: 115,
            paperScroller: paperScroller,
            zoomOptions: {
              max: 5,
              min: 0.2
            }
          });
          $('.navigator-container', element).append(navigator.el);
          navigator.render();
        },
        // Clipboard
        // 剪切板缩略显示（没有使用）
        function initializeClipboard(scope, element) {

          clipboard = new joint.ui.Clipboard;

          keyboardJS.on('ctrl + shift + c', function() {
            // Copy all selected elements and their associated links.
            clipboard.copyElements(selection, graph, {
              translate: {
                dx: 20,
                dy: 20
              },
              useLocalStorage: true
            });
          });

          keyboardJS.on('ctrl + shift + v', function() {

            selectionView.cancelSelection();
            clipboard.pasteCells(graph, {
              link: {
                z: -1
              },
              useLocalStorage: true
            });

            // Make sure pasted elements get selected immediately. This makes the UX better as
            // the user can immediately manipulate the pasted elements.
            clipboard.each(function(cell) {

              if(cell.get('type') === 'link') return;

              // Push to the selection not to the model from the clipboard but put the model into the graph.
              // Note that they are different models. There is no views associated with the models
              // in clipboard.
              selection.add(graph.getCell(cell.id));
              selectionView.createSelectionBox(paper.findViewByModel(cell));
            });
          });

          keyboardJS.on('ctrl + x', function() {

            var originalCells = clipboard.copyElements(selection, graph, {
              useLocalStorage: true
            });
            commandManager.initBatchCommand();
            _.invoke(originalCells, 'remove');
            commandManager.storeBatchCommand();
            selectionView.cancelSelection();
          });
        },
        // Command Manager
        // 个性化的命令
        function initializeMyCommandManager(scope, element) {
          var getGridBackgroundImage = function(gridSize, color) {

            var canvas = $('<canvas/>', {
              width: gridSize,
              height: gridSize
            });

            canvas[0].width = gridSize;
            canvas[0].height = gridSize;

            var context = canvas[0].getContext('2d');
            context.beginPath();
            context.rect(1, 1, 1, 1);
            context.fillStyle = color || '#AAAAAA';
            context.fill();

            return canvas[0].toDataURL('image/png');
          };
          scope.components.myCommander = {};
          scope.components.myCommander.setDimensions = function() {
            paper.setDimensions(paper.options.width, paper.options.height);
            paperScroller.options.baseWidth = paper.options.width;
            paperScroller.options.baseHeight = paper.options.height;
            paperScroller.$el.css('padding-top', 0);
            paperScroller.$el.css('padding-left', 0);
          };
          scope.components.myCommander.setGrid = function() {
            var gridSize = paper.options.gridSize;
            var backgroundImage = getGridBackgroundImage(gridSize);
            if(scope.data.bgcolor) {
              paper.$el.css('background-color', scope.data.bgcolor);
            } else {
              paper.$el.css('background-color', "#fff");
            }
            if(scope.data.bgimage) {
              if(!displayMode) {
                paper.$el.css('background', 'url("' + backgroundImage + '"),url("' + scope.data.bgimage + '")');
                paper.$el.css("background-repeat", "repeat,no-repeat");
                paper.$el.css("background-size", "auto,contain");
              } else {
                paper.$el.css('background-image', 'url(""),url("' + scope.data.bgimage + '")');
                paper.$el.css("background-repeat", "no-repeat");
                paper.$el.css("background-size", "contain");
              }

            } else {
              if(!displayMode) {
                paper.$el.css('background-image', 'url("' + backgroundImage + '")');
              } else {
                paper.$el.css('background-image', 'url(""),url("")');
              }
            }
          };
          $rootScope.save4Json = scope.components.myCommander.save4Json = function(callback) {
            var viewjson = graph.toJSON();
            /*
            for (var i in viewjson.cells) {
              //如果项目ID存在，那么nodeId默认用projectId；
              if (viewjson.cells[i]["projectId"] && viewjson.cells[i]["projectId"] != "?" && viewjson.cells[i]["projectId"] != "number:0") {
                viewjson.cells[i]["nodeId"] =  viewjson.cells[i]["projectId"]
              }
            }
            */
            $rootScope.dirty = false;
            var callback = callback || function() {}
            viewjson.gridSize = paper.options.gridSize;
            viewjson.width = paper.options.width;
            viewjson.height = paper.options.height;
            viewjson.bgimage = scope.data.bgimage;
            viewjson.bgcolor = scope.data.bgcolor;
            var JSONstring = JSON.stringify(viewjson);
            try {
              var param = {
                viewId: $scope.selectedView.viewId,
                viewTitle: scope.data.viewTitle,
                viewName: scope.data.viewTitle,
                viewType: "configure",
                content: JSONstring
              }
              if(param.viewId == 0) {
                viewFlexService.addView(param, function(returnObj) {
                  if(returnObj.code == 0) {
                    $rootScope.dirty = false;
                    callback("success");
                    growl.success("保存成功")
                  }
                });
              } else {
                viewFlexService.updateView(param, function(returnObj) {
                  if(returnObj.code == 0) {
                    callback("success");
                    $rootScope.dirty = false;
                    growl.success("保存成功")
                  }
                });
              }
            } catch(err) {
              callback("error");
              alert(err);
            }
          };
        },
        // Command Manager
        // rappid内置命令
        function initializeCommandManager(scope, element) {
          if(displayMode) return;
          /** 重载CommandManager类的push方法 */
          joint.dia.CommandManager.prototype.push = function(cmd) {
            //          暂时去掉了该EVENT，zhangafa
            //          if(typeof _events_['graphUpdated'] == "function"){
            //            _events_['graphUpdated']();
            //          };
            this.redoStack = [];
            if(!cmd.batch) {
              this.undoStack.push(cmd);
              this.trigger('add', cmd);
            } else {
              this.lastCmdIndex = Math.max(this.lastCmdIndex, 0);
              this.trigger('batch', cmd);
            }
          };
          /** */
          commandManager = new joint.dia.CommandManager({
            graph: graph
          });
          keyboardJS.on('ctrl + z', function() {

            commandManager.undo();
            selectionView.cancelSelection();
          });

          keyboardJS.on('ctrl + y', function() {

            commandManager.redo();
            selectionView.cancelSelection();
          });

          commandManager.configDispaly = true;
          commandManager.configDispalySet = function(flg) {
            commandManager.configDispaly = flg;
          };
          commandManager.alignAction = function(flg) {
            commandManager.initBatchCommand();
            var align;
            selectionView.model.models.forEach(function(cell) {
              if(flg == "left") {
                if(!align) align = cell.attributes.position.x;
                if(align > cell.attributes.position.x) {
                  align = cell.attributes.position.x;
                }
              } else if(flg == "right") {
                if(!align) align = cell.attributes.position.x + cell.attributes.size.width;
                if(align < cell.attributes.position.x + cell.attributes.size.width) {
                  align = cell.attributes.position.x + cell.attributes.size.width;
                }
              } else if(flg == "up") {
                if(!align) align = cell.attributes.position.y;
                if(align > cell.attributes.position.y) {
                  align = cell.attributes.position.y;
                }
              } else if(flg == "down") {
                if(!align) align = cell.attributes.position.y + cell.attributes.size.height;
                if(align < cell.attributes.position.y + cell.attributes.size.height) {
                  align = cell.attributes.position.y + cell.attributes.size.height
                }
              }
            });
            selectionView.model.models.forEach(function(cell) {
              if(cell.get("parent")) {
                var parentCell = graph.getCell(cell.get("parent"));
                var x_offset = parentCell.get("position").x - cell.get("position").x;
                var y_offset = parentCell.get("position").y - cell.get("position").y;
                if(flg == "left") {
                  cell.prop('position/x', align - x_offset);
                } else if(flg == "right") {
                  cell.prop('position/x', align - parentCell.attributes.size.width - x_offset);
                } else if(flg == "up") {
                  cell.prop('position/y', align - y_offset);
                } else if(flg == "down") {
                  cell.prop('position/y', align - parentCell.attributes.size.height - y_offset);
                }
              }
            });
            selectionView.model.models.forEach(function(cell) {
              if(!cell.get("parent")) {
                if(flg == "left") {
                  cell.prop('position/x', align);
                } else if(flg == "right") {
                  cell.prop('position/x', align - cell.attributes.size.width);
                } else if(flg == "up") {
                  cell.prop('position/y', align);
                } else if(flg == "down") {
                  cell.prop('position/y', align - cell.attributes.size.height);
                }
              }
            });
            commandManager.storeBatchCommand();
          }
          commandManager.toFront = function() {
            selection.invoke('toFront');
          };

          commandManager.toBack = function() {
            selection.invoke('toBack');
          };
          commandManager.embed = function() {
            var parentCell;
            selectionView.model.models.forEach(function(cell) {
              if(!parentCell) {
                parentCell = cell;
              } else {
                if(parentCell.attributes.z > cell.attributes.z) {
                  parentCell = cell;
                }
              }
            });
            selectionView.model.models.forEach(function(cell) {
              if(parentCell.id != cell.id) {
                parentCell.embed(cell);
              }
            });
          };
          commandManager.unembed = function() {
            selectionView.model.models.forEach(function(cell) {
              if(cell.attributes.embeds) {
                cell.attributes.embeds.forEach(function(cellid) {
                  cell.unembed(graph.getCell(cellid));
                });
              }
            });
          };
          commandManager.preview = function() {
            var url = window.location.origin;
            //如果是localhost那么就使用默认的URL
            if(url.search('localhost') > -1) {
              window.open('../app-configure/index.html#/display/' + $scope.selectedView.viewId, '_blank');
            } else {
              var viewId = $scope.selectedView.viewId;
              var param = [{
                viewId: viewId
              }];
              window.open('../app-free-style/index.html#/topoview/index/' + encodeURIComponent(JSON.stringify(param)), '_blank');
            }
          };
          
          commandManager.flip = function() {
            selectionView.model.models.forEach(function(cell) {
              var attrs = cell.attributes.attrs;
              if(attrs.hasOwnProperty("image")) {
                var image = attrs.image;
                if(image.hasOwnProperty("transform")) {
                  var scale = image.transform;
                  if(scale.indexOf("scale(-1,1)") == -1) {
                    cell.attr("image/transform", "scale(-1,1),translate(-" + image.width + ",0)");
                  } else {
                    cell.attr("image/transform", "scale(1,1),translate(0,0)");
                  }
                } else {
                  cell.attr("image/transform", "scale(-1,1),translate(-" + image.width + ",0)");
                }
              }
            });
          };
          commandManager.toJSON = function() {
            var windowFeatures = 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no';
            var windowName = _.uniqueId('json_output');
            var jsonWindow = window.open('', windowName, windowFeatures);

            jsonWindow.document.write(JSON.stringify(graph.toJSON()));
          };
          commandManager.loadJSON = function() {
            BootstrapDialog.show({
              title: '导入组态内容',
              message: $('<textarea id="json4configer" class="form-control" placeholder="输入JSON"></textarea>'),
              buttons: [{
                label: '确认',
                cssClass: 'btn-primary',
                hotkey: 13, // Enter.
                action: function(dialogRef) {
                  dialogRef.close();
                  var inputcontent = document.getElementById('json4configer');
                  if(inputcontent.value) {
                    var json = JSON.parse(inputcontent.value);
                    graph.fromJSON(json);
                  }
                }
              }]
            });
          };
          scope.components.commander = commandManager;
        },
        // toolTip显示处理
        function toolTips(scope, element) {
          $('.toolbar-container [data-tooltip]', element).each(function() {
            new joint.ui.Tooltip({
              target: $(this),
              content: $(this).data('tooltip'),
              top: '.toolbar-container',
              direction: 'top'
            });
          });
        },
        // 初始化视图
        function initView(scope, element) {
          if($routeParams.type == 'service') {
            return;
          };
          if(!$routeParams.viewId) {
            location.href = "../app-oc/index.html#/index";
            return;
          }
          scope.data.viewRoutes = [];
          scope.data.viewChange = function(view) {
            SwSocket.unregister(uuid);
            uuid = Math.uuid();
            for(var i in scope.data.viewRoutes) {
              if(scope.data.viewRoutes[i].viewId == view.viewId) {
                scope.data.viewRoutes.splice(i, scope.data.viewRoutes.length - i);
              }
            }
            showViewContent(scope, view.viewId);
          }
          var loadcount = 0;
          var gotoShowView = function() {
            if(loadcount == 3) {
              if($routeParams.viewId != 0) {
                showViewContent(scope, $routeParams.viewId);
              } else {
                createConfigView(function(viewId) {
                  showViewContent(scope, viewId);
                });
              }
            }
          }

          var rootModelDicWatch = $scope.$watch("rootModelDic", function(nv, ov) {
            if((nv && !ov) || ov) {
              loadcount++;
              gotoShowView();
              rootModelDicWatch();
            }
          });

          var domainListTreeWatch = $scope.$watch("domainListTree", function(nv, ov) {
            if((nv && !ov) || ov) {
              loadcount++;
              gotoShowView();
              domainListTreeWatch();
            }
          });
          var myOptionDicWatch = $scope.$watch("myOptionDic", function(nv, ov) {
            if((nv && !ov) || ov) {
              loadcount++;
              gotoShowView();
              myOptionDicWatch();
            }
          });
        },
        // 初始化告警图标的方法
        function initAlertIconfunction(scope, element) {
          if(scope.data.stencil && scope.data.stencil.shapes && scope.data.stencil.shapes.customer) {
            scope.data.stencil.shapes.customer.forEach(function(item) {
              if(item.label || (item.attrs.text && item.attrs.text.text)) {
                if(!item.label) item.label = item.attrs.text.text;
                $scope.alertIcons.push(item);
              }
            })
          }
        }
      ];
      /********↑↑↑↑↑↑以上是组态的核心处理对象↑↑↑↑↑↑********/

      if($routeParams.type == 'service') {
        if($scope.defer == undefined) {
          $scope.defer = $q.defer();
        };
        var promise = $scope.defer.promise;

        $scope.initialization[9] = function initView(scope, element) {
          var confighome, confighomeArr, allmyViews, currentlevel;
          $rootScope.dialogBox = undefined;
          scope.open = false;
          scope.wholeClick = function() {
            scope.open = false;
          };
          if(scope.defer == undefined) {
            scope.defer = $q.defer();
          }
          var promise = scope.defer.promise;
          scope.lv1viewsclick = function(item) {
            scope.open = false;
            if(graph.attributes && graph.attributes.cells && graph.attributes.cells.models) {
              graph.attributes.cells.models.forEach(function(cell) {
                cell.off('transition:end');
              });
            };
            timeout(function() {
              location.href = "../app-sc/index_configure.html#/display/" + item.viewId + "/service";
            });
          };
          viewFlexService.getAllMyViews(function(event) {
            if(event.code == 0) {
              confighome = event.data.find(function(element) {
                return element.viewType == 'confighome';
              });
              confighomeArr = event.data.filter(function(element) {
                return element.viewType == 'confighome';
              });
              confighomeArr = confighomeArr.map(function(element) {
                return element.viewId
              });
              var tmp = event.data.filter(function(element) {
                return element.viewType == 'configure';
              })
              allmyViews = tmp.map(function(element) {
                var jsonObj;
                if(element.content != null) {
                  jsonObj = JSON.parse(element.content);
                } else {
                  jsonObj = {};
                }
                if(jsonObj.level == undefined) {
                  jsonObj.level = 1;
                }
                var obj = {
                  viewId: element.viewId,
                  viewTitle: element.viewTitle,
                  viewType: element.viewType,
                  navigate: element.navigate,
                  JSON: jsonObj
                }
                return obj;
              });
              allViewLoaded();
            }
          });

          function allViewLoaded() {
            if(!$routeParams.viewId) {
              location.href = "../app-sc/index_configure.html#/display/edit/service";
              return;
            } else if($routeParams.viewId == 'all') {
              if(confighome) {
                var viewId = JSON.parse(confighome.content).viewId;
                var currentView = allmyViews.find(function(element) {
                  return element.viewId == viewId;
                });
                if(!viewId || currentView) {
                  run(viewId);
                } else {
                  location.href = "../app-sc/index_configure.html#/display/edit/service";
                }
              } else {
                delete $rootScope.dialogBox;
                location.href = "../app-sc/index_configure.html#/display/edit/service";
              }
            } else if($routeParams.viewId == 'edit') {
              var findView, fnhandle;
              scope.lv1views = allmyViews.filter(function(element) {
                return $$.switchToNumber(element.navigate) > 0;
              });
              if(confighome) {
                findView = scope.lv1views.find(function(elem) {
                  return elem.viewId == JSON.parse(confighome.content).viewId;
                });
                fnhandle = function() {
                  var viewId = $rootScope.dialogBox.select.value.viewId;
                  var con = {
                    viewId: viewId
                  };
                  var param = {
                    viewId: confighome.viewId,
                    viewTitle: 'confighome',
                    viewType: 'confighome',
                    content: JSON.stringify(con)
                  };
                  viewFlexService.updateView(param, function() {
                    delete $rootScope.dialogBox;
                    location.href = "../app-sc/index_configure.html#/display/all/service";
                  });
                }
              } else {
                findView = scope.lv1views[0];
                fnhandle = function() {
                  var viewId = $rootScope.dialogBox.select.value.viewId;
                  var con = {
                    viewId: viewId
                  };
                  var param = {
                    viewTitle: 'confighome',
                    viewType: 'confighome',
                    content: JSON.stringify(con)
                  };
                  viewFlexService.addView(param, function() {
                    delete $rootScope.dialogBox;
                    location.href = "../app-sc/index_configure.html#/display/all/service";
                  });
                }
              }
              var fnlist = [{
                label: '确定',
                icon: 'btn btn-success',
                style: {
                  width: '50%',
                  'border-radius': 0,
                  'font-size': '18px',
                  'font-weight': 'bold',
                  'padding': 10
                },
                fn: fnhandle
              }];
              $rootScope.dialogBox = {
                title: {
                  label: '请选择服务中心默认视图'
                },
                description: {
                  label: ''
                },
                select: {
                  "label": '请选择展示页',
                  "value": findView,
                  "options": scope.lv1views
                },
                fnlist: fnlist
              };
            } else {
              run($routeParams.viewId);
            }
          }

          function run(viewId) {
            var treedata = {};
            for(var i in allmyViews) {
              if(typeof allmyViews[i].navigate == 'string' && allmyViews[i].navigate != "") {
                var navi = allmyViews[i].navigate.split("/")
                var rs = {};
                var ta = rs;
                for(var j in navi) {
                  if(j < navi.length - 1) {
                    ta[navi[j]] = {};
                    ta = ta[navi[j]];
                  } else {
                    ta[navi[j]] = {
                      data: allmyViews[i]
                    };
                  }
                };
                treedata.$extension(rs)
              }
            }
            var currentView = allmyViews.find(function(element) {
              return element.viewId == viewId;
            });
            if(currentView) {
              var findCur;
              treedata.traverse(function(attr, element) {
                if(element.data) {
                  if(element.data.viewId) {
                    if(currentView.viewId == element.data.viewId) {
                      findCur = element;
                      var arr = [];
                      for(var k in element.parent) {
                        if(k != 'data') {
                          arr.push(element.parent[k].data);
                        }
                      }
                      scope.lv1views = arr;
                    }
                  }
                }
              });
              var target, detaillist = [];
              if(findCur) {
                target = findCur.parent;
                while(target.parent) {
                  detaillist.push(target.data);
                  target = target.parent;
                }
                scope.details = detaillist;
              }
              scope.data.viewRoutes = [];
              scope.data.viewChange = function(view) {
                SwSocket.unregister(uuid);
                uuid = Math.uuid();
                for(var i in scope.data.viewRoutes) {
                  if(scope.data.viewRoutes[i].viewId == view.viewId) {
                    scope.data.viewRoutes.splice(i, scope.data.viewRoutes.length - i);
                  }
                }
                showViewContent(scope, view.viewId)
              }
              showViewContent(scope, currentView.viewId);
            } else {
              location.href = "../app-sc/index_configure.html#/display/edit/service";
            }
          }
        }
      }
    }
  ]);
});