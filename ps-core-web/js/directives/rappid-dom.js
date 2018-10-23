define(['directives/directives'], function (directives) {
  'use strict';
  directives.initDirective('rappid', [function () {
    return {
      restrict: 'E',
      templateUrl: function () {
        return location.hash.search("#/configure") > -1 ? 'partials/rappid-configure.html' : 'partials/rappid-display.html';
      },
      replace: true,
      scope: {
        title: '@',
        source: '@'
      },
      controller: ['$scope', 'Info', function ($scope, Info) {
        //右边侧边栏的顶部TAB
        var CommonInspectorGroups = {
          data: {
            label: '数据',
            index: 1
          },
          text: {
            label: '内容',
            index: 2
          },
          presentation: {
            label: '背景',
            index: 3
          },
          geometry: {
            label: '外观',
            index: 4
          }
        };

        var CommonInputs = {
          cursor: {
            type: 'select',
            group: 'geometry',
            index: 100,
            label: '鼠标形状',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedItem.cursor',
                'ng-change': 'cursorChangeHandler()',
                'ng-options': 'value.id as value.label for value in cursorModel'
              }
            }
          },
          size: {
            width: {
              type: 'number',
              min: 1,
              max: 2000,
              group: 'geometry',
              label: 'width',
              index: 1,
              attrs: {
                input: {
                  'class': 'form-control input-sm',
                  'ng-blur': 'updateCellHandler()'
                }
              }
            },
            height: {
              type: 'number',
              min: 1,
              max: 2000,
              group: 'geometry',
              label: 'height',
              index: 2,
              attrs: {
                input: {
                  'class': 'form-control input-sm',
                  'ng-blur': 'updateCellHandler()'
                }
              }
            }
          },
          position: {
            x: {
              type: 'number',
              min: 1,
              max: 2000,
              group: 'geometry',
              label: 'x',
              index: 3,
              attrs: {
                input: {
                  'class': 'form-control input-sm',
                  'ng-blur': 'updateCellHandler()'
                }
              }
            },
            y: {
              type: 'number',
              min: 1,
              max: 2000,
              group: 'geometry',
              label: 'y',
              index: 4,
              attrs: {
                input: {
                  'class': 'form-control input-sm',
                  'ng-blur': 'updateCellHandler()'
                }
              }
            }
          },
          domainPath: {
            type: 'select',
            group: 'data',
            index: 1,
            label: '管理域',
            attrs: {
              'div': {
                'class': 'dropdowntree select-sm',
                'key': 'domainPath',
                'options': 'selectedView.domainListTree',
                'mark': 'nodes',
                'ng-model': 'selectedItem.domainPath',
                'change': 'domainAndModelChangeHandler()',
                'ng-hide': 'selectedView.template.resourceType == "project" && selectedView.template.resourceId > 0',
              },
              'select': {
                'ng-if': false
              }
            }
          },
          extendDomain: {
            type: 'select',
            group: 'data',
            index: 100,
            label: '扩展域',
            attrs: {
              'div': {
                'class': 'dropdowntree select-sm',
                'key': 'id',
                'options': 'selectedView.subDomainListTree',
                'mark': 'nodes',
                'ng-model': 'selectedItem.extendDomainId',
                'change': 'extendDomainsChangeHandler()',
                'ng-show': 'selectedView.template.resourceType == "project" && selectedView.template.resourceId > 0 && baseConfig.extendDomain == true'
              },
              'select': {
                'ng-if': false
              }
            }
          },
          modelId: {
            type: 'select',
            group: 'data',
            index: 2,
            label: '模板',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'select2': '',
                'style': 'width: 200px',
                'selectdata': 'treeAry',
                'ng-model': 'selectedItem.modelId',
                'ng-change': 'domainAndModelChangeHandler()',
                'ng-disabled': 'selectedView.template.resourceType == "device" && selectedView.template.resourceId > 0',
                'ng-options': 'value.id as value.label for value in treeAry'
              }
            }
          },
          z: {
            type: 'number',
            group: 'data',
            label: '组件图层',
            index: 99,
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'type': 'number',
                'ng-model': 'selectedItem.z',
                'ng-change': 'layoutZChangeHandler()',
                'data-tooltip': '显示组件在全局的图层'
              }
            }
          },
          animateType: {
            type: 'select',
            group: 'data',
            index: 100,
            label: '动画方式',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedItem.animateType',
                'ng-change': 'animateTypeChangeHandler()',
                'ng-options': 'value.id as value.label for value in animateTypeModel'
              }
            }
          }
        };

        //通用的属性输入
        var CommonInspectorInputs = _.extend({
          nodeId: {
            type: 'select',
            group: 'data',
            index: 4,
            label: '实例',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'select2': '',
                'style': 'width: 200px',
                'selectdata': 'selectedItem.nodes',
                'ng-model': 'selectedItem.nodeId',
                'ng-change': 'nodeChangeHandler()',
                //'ng-show': 'selectedItem.projects.length <= 0 && selectedItem.customers.length <= 0',
                'ng-options': 'value.id as value.label for value in selectedItem.nodes'
              },
              'label': {
                //'ng-show': 'selectedItem.projects.length <= 0 && selectedItem.customers.length <= 0'
              }
            }
          },
          kpiId: {
            type: 'select',
            group: 'data',
            index: 5,
            label: '数据项',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'select2': '',
                'style': 'width: 200px',
                'selectdata': 'selectedItem.kpis',
                'ng-model': 'selectedItem.kpiId',
                'ng-change': 'kpiChangeHandler()',
                'ng-options': 'value.id as value.label for value in selectedItem.kpis'
              }
            }
          },
          unitType: {
            type: 'select',
            group: 'data',
            index: 6,
            label: '指标单位',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedItem.unitType',
                'ng-change': 'unitChangeHandler()',
                'ng-options': 'value.id as value.label for value in unitTypes'
              }
            }
          },
          subViewId: {
            type: 'select',
            group: 'data',
            index: 7,
            label: '子视图',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedItem.subViewId',
                'ng-change': 'subViewChangeHandler()',
                'ng-options': 'value.viewId as value.viewTitle for value in configureView'
              }
            }
          },
          stateId: {
            type: 'select',
            group: 'data',
            index: 8,
            label: '告警状态',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedItem.stateId',
                'ng-change': 'stateIdChangeHandler()',
                'ng-options': 'value.id as value.label for value in stateDisplayModel | filter:{ type : selectedItem.cell.attributes.type}'
              }
            }
          },
          stateType: {
            type: 'select',
            group: 'data',
            index: 9,
            label: '提醒方式',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedItem.stateType',
                'ng-change': 'stateTypeChangeHandler()',
                'ng-options': 'value.id as value.label for value in stateTypeModel | filter:{ type : selectedItem.cell.attributes.type}'
              }
            }
          },
          directiveIds: {
            type: 'select',
            group: 'data',
            index: 10,
            label: '指令',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedItem.directiveIds',
                'ng-change': 'directivesChangeHandler()',
                'ng-options': 'value.id as value.name for value in selectedItem.directives',
                'multiple': 'multiple',
                'numberdisplayed': '1',
                'bootstrap-multiselect': '',
                'buttonWidth': '100%'
              }
            }
          },
        }, CommonInputs);
        var CommonEchartInputs = _.extend({
          nodeIds: {
            type: 'select',
            group: 'data',
            index: 3,
            label: '设备(可多选)',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedItem.nodeIds',
                'ng-change': 'nodesChangeHandler()',
                'ng-options': 'value.id as value.label for value in selectedItem.nodes',
                'multiple': 'multiple',
                'numberdisplayed': '1',
                'bootstrap-multiselect': '',
                'buttonWidth': '100%'
              }
            }
          },
          echartViewId: {
            type: 'select',
            group: 'data',
            index: 4,
            label: '分析视图',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedItem.echartViewId',
                'ng-change': 'echartViewIdChangeHandler()',
                'ng-options': 'value.viewId as value.viewTitle for value in echartView'
              }
            }
          },
          tabsInfo: {
            type: 'text',
            group: 'data',
            label: '分组信息',
            index: 5,
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'ng-model': 'selectedItem.tabsInfo',
                'ng-change': 'tabsInfoChangeHandler()',
                'data-tooltip': '请按照以下格式:{"group":"<b color=red>分组的名称</b>"}$$<b>该标签名称</b>'
              }
            }
          }
        }, CommonInputs);
        var ExtendAlertInputs = {
          alertLevel: {
            type: 'select',
            group: 'data',
            index: 9,
            label: '告警级别',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedAlertConfig',
                'ng-change': 'alertlevelChangeHandler()',
                'ng-options': 'value as value.label for value in alertLevels'
              }
            }
          },
          alertIcon: {
            type: 'select',
            group: 'data',
            index: 10,
            label: '告警图标',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedAlertConfig.alertIcon',
                'ng-change': 'alertIconChangeHandler()',
                'ng-show': 'selectedAlertConfig.id != null',
                'ng-options': 'value.attrs.image["xlink:href"] as value.label for value in alertIcons'
              },
              'label': {
                'ng-show': 'selectedAlertConfig.id != null'
              }
            }
          },
          alertText: {
            type: 'text',
            group: 'data',
            index: 11,
            label: '告警名称',
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'ng-change': 'alertTextChangeHandler()',
                'ng-model': 'selectedAlertConfig.alertText',
                'ng-show': 'selectedAlertConfig.id != null'
              },
              'label': {
                'ng-show': 'selectedAlertConfig.id != null'
              }
            }
          }
        };
        var ExtendValueInputs = {
          valueLevel: {
            type: 'select',
            group: 'data',
            index: 9,
            label: '指标组别',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedValueConfig',
                'ng-change': 'valuelevelChangeHandler()',
                'ng-options': 'value as value.label for value in valueLevels'
              }
            }
          },
          valueIcon: {
            type: 'select',
            group: 'data',
            index: 10,
            label: '指标图标',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedValueConfig.valueIcon',
                'ng-change': 'valueIconChangeHandler()',
                'ng-show': 'selectedValueConfig.id != null',
                'ng-options': 'value.attrs.image["xlink:href"] as value.label for value in alertIcons'
              },
              'label': {
                'ng-show': 'selectedValueConfig.id != null'
              }
            }
          },
          valueText: {
            type: 'text',
            group: 'data',
            index: 11,
            label: '指标值',
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'ng-change': 'valueTextChangeHandler()',
                'ng-model': 'selectedValueConfig.valueText',
                'ng-show': 'selectedValueConfig.id != null'
              },
              'label': {
                'ng-show': 'selectedValueConfig.id != null'
              }
            }
          },
          valueDirective: {
            type: 'select',
            group: 'data',
            index: 12,
            label: '指标指令',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-model': 'selectedValueConfig.valueDirective',
                'ng-change': 'valueDirChangeHandler()',
                'ng-show': 'selectedValueConfig.id != null',
                'ng-options': 'value.id as value.name for value in selectedItem.directives'
              },
              'label': {
                'ng-show': 'selectedValueConfig.id != null'
              }
            }
          },
          valueDirectiveAttr: {
            type: 'text',
            group: 'data',
            index: 13,
            label: '指标指令参数',
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'ng-change': 'valueDirAttrChangeHandler()',
                'ng-model': 'selectedValueConfig.valueDirectiveAttr',
                'ng-show': 'selectedValueConfig.id != null'
              },
              'label': {
                'ng-show': 'selectedValueConfig.id != null'
              }
            }
          }
        };
        var switchInputs = {
          modelId: {
            type: 'select',
            group: 'data',
            index: 2,
            label: '模板',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'select2': '',
                'style': 'width: 200px',
                'selectdata': 'treeAry',
                'ng-model': 'selectedItem.modelId',
                'ng-change': 'domainAndModelChangeHandler()',
                'ng-disabled': 'selectedView.template.resourceType == "device" && selectedView.template.resourceId > 0',
                'ng-options': 'value.id as value.label for value in treeAry'
              }
            }
          },
          nodeId: {
            type: 'select',
            group: 'data',
            index: 3,
            label: '实例',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'select2': '',
                'style': 'width: 200px',
                'selectdata': 'selectedItem.nodes',
                'ng-model': 'selectedItem.nodeId',
                'ng-change': 'nodeChangeHandler()',
                'ng-options': 'value.id as value.label for value in selectedItem.nodes'
              }
            }
          },
          kpiId: {
            type: 'select',
            group: 'data',
            index: 4,
            label: '数据项',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'select2': '',
                'style': 'width: 200px',
                'selectdata': 'selectedItem.kpis',
                'ng-model': 'selectedItem.kpiId',
                'ng-change': 'kpiChangeHandler()',
                'ng-options': 'value.id as value.label for value in selectedItem.kpis'
              }
            }
          },
          open: {
            type: 'text',
            group: 'data',
            index: 5,
            label: '打开时图片',
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          close: {
            type: 'text',
            group: 'data',
            index: 5,
            label: '关闭时图片',
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'ng-blur': 'updateCellHandler()'
              }
            }
          }
        };
        var openAngleInputs = {}

        var domainInputs = {
          domainPath: {
            type: 'select',
            group: 'data',
            index: 2,
            label: '管理域',
            attrs: {
              'div': {
                'class': 'dropdowntree select-sm',
                key: 'domainPath',
                options: 'selectedView.domainListTree',
                mark: 'nodes',
                'style': 'height: 300px',
                'ng-model': 'selectedItem.domainPath',
                'change': 'domainAndModelChangeHandler()',
                'ng-hide': 'selectedView.template.resourceType == "project" && selectedView.template.resourceId > 0',
              },
              'select': {
                'ng-if': false
              }
            }
          }
        }

        var levelInputs = {
          modelId: {
            type: 'select',
            group: 'data',
            index: 2,
            label: '模板',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'select2': '',
                'style': 'width: 200px',
                'selectdata': 'treeAry',
                'ng-model': 'selectedItem.modelId',
                'ng-change': 'domainAndModelChangeHandler()',
                'ng-disabled': 'selectedView.template.resourceType == "device" && selectedView.template.resourceId > 0',
                'ng-options': 'value.id as value.label for value in treeAry'
              }
            }
          },
          nodeId: {
            type: 'select',
            group: 'data',
            index: 3,
            label: '实例',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'select2': '',
                'style': 'width: 200px',
                'selectdata': 'selectedItem.nodes',
                'ng-model': 'selectedItem.nodeId',
                'ng-change': 'nodeChangeHandler()',
                'ng-options': 'value.id as value.label for value in selectedItem.nodes'
              }
            }
          },
          kpiId: {
            type: 'select',
            group: 'data',
            index: 4,
            label: '数据项',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'select2': '',
                'style': 'width: 200px',
                'selectdata': 'selectedItem.kpis',
                'ng-model': 'selectedItem.kpiId',
                'ng-change': 'kpiChangeHandler()',
                'ng-options': 'value.id as value.label for value in selectedItem.kpis'
              }
            }
          },
          range: {
            type: 'text',
            group: 'data',
            index: 5,
            label: '取值范围',
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'ng-blur': 'updateCellHandler()'
              }
            }
          }
        };
        //输入的定义
        var InputDefs = {
          'text': {
            type: 'text',
            label: '文本(text)',
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          'font-size': {
            type: 'range',
            min: 5,
            max: 80,
            unit: 'px',
            label: '字体大小(font-size)',
            attrs: {
              input: {
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          'font-family': {
            type: 'select',
            options: ['Source Sans Pro', 'Helvetica Neue', 'Luxi Sans', 'DejaVu Sans', 'Tahoma', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
            label: '字体系列(font-family)',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          'font-weight': {
            type: 'range',
            min: 100,
            max: 900,
            step: 100,
            defaultValue: 400,
            label: '字体粗细(font-weight)',
            attrs: {
              input: {
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          'fill': {
            type: 'color',
            label: '填充颜色(fill)',
            attrs: {
              input: {
                'ng-blur': 'updateCellHandler()',
                'class': 'color-picker-block'
              }
            }
          },
          'opacity': {
            type: 'range',
            min: 0,
            max: 1,
            step: .1,
            defaultValue: 1,
            unit: '',
            label: '透明度(opacity)',
            attrs: {
              input: {
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          'stroke': {
            type: 'color',
            defaultValue: '#000000',
            label: '边框颜色(stroke)',
            attrs: {
              input: {
                'ng-blur': 'updateCellHandler()',
                'class': 'color-picker-block'
              }
            }
          },
          'stroke-width': {
            type: 'range',
            min: 0,
            max: 5,
            step: .5,
            defaultValue: 0,
            unit: 'px',
            label: '边框宽度(stroke-width)',
            attrs: {
              input: {
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          //        'ref-x': {
          //          type: 'range',
          //          min: 0,
          //          max: 1,
          //          step: .01,
          //          defaultValue: 0.5,
          //          label: '水平对齐(Horizontal alignment)'
          //        },
          'ref-x': {
            type: 'number',
            defaultValue: 0.5,
            step: .01,
            label: '水平对齐(Horizontal alignment)',
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'data-tooltip': '0-0.99按照百分比设置<br>大于等于1,小于0时，按照PX设置',
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          //        'ref-y': {
          //          type: 'range',
          //          min: 0,
          //          max: 1,
          //          step: .01,
          //          defaultValue: 0.5,
          //          label: '垂直对齐(Vertical alignment)'
          //        },
          'ref-y': {
            type: 'number',
            defaultValue: 0.5,
            step: .01,
            label: '垂直对齐(Vertical alignment)',
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'data-tooltip': '0-0.99按照百分比设置<br>大于等于1,小于0时，按照PX设置',
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          'ref-dx': {
            type: 'range',
            min: -100,
            max: 100,
            step: 1,
            defaultValue: 0,
            label: '水平位移(Horizontal offset)',
            attrs: {
              input: {
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          //        'ref-dy': {
          //          type: 'range',
          //          min: -100,
          //          max: 100,
          //          step: 1,
          //          defaultValue: 0,
          //          label: '垂直位移(Vertical offset)'
          //        },
          'ref-dy': {
            type: 'number',
            defaultValue: 20,
            step: 1,
            label: '垂直位移(Vertical offset)',
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          'dx': {
            type: 'range',
            min: -100,
            max: 100,
            step: 1,
            defaultValue: 0,
            label: '水平距离(Horizontal distance)',
            attrs: {
              input: {
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          'dy': {
            type: 'range',
            min: -100,
            max: 100,
            step: 1,
            defaultValue: 0,
            label: '垂直距离(Vertical distance)',
            attrs: {
              input: {
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          'stroke-dasharray': {
            type: 'select',
            options: ['0', '1', '5,5', '5,10', '10,5', '3,5', '5,1', '15,10,5,10,15'],
            label: '边框虚线(stroke-dasharray)',
            attrs: {
              'select': {
                'class': 'form-control input-sm',
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          'rx': {
            type: 'range',
            min: 0,
            max: 30,
            defaultValue: 1,
            unit: 'px',
            label: 'X轴半径(X-axis radius)',
            attrs: {
              input: {
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          'ry': {
            type: 'range',
            min: 0,
            max: 30,
            defaultValue: 1,
            unit: 'px',
            label: 'Y轴半径(Y-axis radius)',
            attrs: {
              input: {
                'ng-blur': 'updateCellHandler()'
              }
            }
          },
          'xlink:href': {
            type: 'text',
            label: '(图片路径)Image URL',
            attrs: {
              input: {
                'class': 'form-control input-sm',
                'ng-blur': 'updateCellHandler()'
              }
            }
          }
        };

        function inp (defs) {
          var ret = {};
          _.each(defs, function (def, attr) {

            ret[attr] = _.extend({}, InputDefs[attr], def);
          });
          return ret;
        }

        var InspectorDefs = {
          'link': {
            inputs: {
              attrs: {
                '.connection': {
                  'stroke-width': {
                    type: 'range',
                    min: 0,
                    max: 50,
                    defaultValue: 1,
                    unit: 'px',
                    group: 'connection',
                    label: '线条宽度',
                    index: 1,
                    attrs: {
                      input: {
                        'ng-blur': 'updateCellHandler()'
                      }
                    }
                  },
                  'stroke': {
                    type: 'color',
                    group: 'connection',
                    label: '线条颜色',
                    index: 2,
                    attrs: {
                      input: {
                        'ng-blur': 'updateCellHandler()',
                        'class': 'color-picker-block'
                      }
                    }
                  },
                  'stroke-dasharray': {
                    type: 'text',
                    label: '虚线样式',
                    group: 'connection',
                    index: 3,
                    attrs: {
                      input: {
                        'class': 'form-control input-sm',
                        'ng-blur': 'updateCellHandler()',
                        'data-tooltip': '如【5】，【5,5】, 【5,10】,【10,5】, 【5,1】, 【15,10,5,10,15】'
                      }
                    }
                  }
                },
                '.marker-source': {
                  transform: {
                    type: 'range',
                    min: 0,
                    max: 15,
                    unit: 'x scale',
                    defaultValue: 'scale(1)',
                    valueRegExp: '(scale\\()(.*)(\\))',
                    group: 'marker-source',
                    label: '源箭头大小',
                    index: 1,
                    attrs: {
                      input: {
                        'ng-blur': 'updateCellHandler()'
                      }
                    }
                  },
                  fill: {
                    type: 'color',
                    group: 'marker-source',
                    label: '源箭头颜色',
                    index: 2,
                    attrs: {
                      input: {
                        'ng-blur': 'updateCellHandler()',
                        'class': 'color-picker-block'
                      }
                    }
                  }
                },
                '.marker-target': {
                  transform: {
                    type: 'range',
                    min: 0,
                    max: 15,
                    unit: 'x scale',
                    defaultValue: 'scale(1)',
                    valueRegExp: '(scale\\()(.*)(\\))',
                    group: 'marker-target',
                    label: '目标箭头大小',
                    index: 1,
                    attrs: {
                      input: {
                        'ng-blur': 'updateCellHandler()'
                      }
                    }
                  },
                  fill: {
                    type: 'color',
                    group: 'marker-target',
                    label: '目标箭头颜色',
                    index: 2,
                    attrs: {
                      input: {
                        'ng-blur': 'updateCellHandler()',
                        'class': 'color-picker-block'
                      }
                    }
                  }
                }
              },
              linkAn: {
                type: 'select',
                options: ['无', '快速', '普通', '慢速'],
                group: 'connection',
                label: '虚线动画',
                index: 3,
                attrs: {
                  'select': {
                    'class': 'form-control input-sm',
                    'ng-blur': 'updateCellHandler()',
                    'data-tooltip': '仅当虚线样式有效时，动画才有效果'
                  }
                }
              },
              smooth: {
                type: 'toggle',
                group: 'connection',
                label: '线条光滑模式',
                index: 4,
                attrs: {
                  input: {
                    'ng-blur': 'updateCellHandler()',
                    'data-tooltip': '线条的拐角处平滑处理'
                  }
                }
              },
              manhattan: {
                type: 'toggle',
                group: 'connection',
                label: '线条直角模式',
                index: 5,
                attrs: {
                  input: {
                    'ng-blur': 'updateCellHandler()',
                    'data-tooltip': '线条的拐角处直角处理'
                  }
                }
              },
              pattern: {
                type: 'toggle',
                group: 'connection',
                label: '线条渲染模式',
                index: 6,
                attrs: {
                  input: {
                    'ng-blur': 'updateCellHandler()',
                    'data-tooltip': '启用线条渲染时，线条将使用渲染颜色作为过渡色'
                  }
                }
              },
              patternColor: {
                type: 'color',
                group: 'connection',
                label: '渲染颜色',
                defaultValue: '#ffffff',
                index: 7,
                attrs: {
                  input: {
                    'ng-blur': 'updateCellHandler()',
                    'class': 'color-picker-block',
                    'data-tooltip': '渲染模式启用有效'
                  }
                }
              },
              /*
              patternBC: {
                type: 'color',
                group: 'connection',
                label: '渲染边框颜色',
                defaultValue: '#ffffff',
                index: 8,
                attrs: {
                  input: {
                    'ng-blur': 'updateCellHandler()',
                    'class': 'color-picker-block',
                    'data-tooltip': '渲染模式启用有效'
                  }
                }
              },
              patternBA: {
                type: 'range',
                group: 'connection',
                min: 0,
                max: 1,
                step: .1,
                defaultValue: 1,
                unit: '',
                index: 9,
                label: '渲染边框颜色透明度',
                attrs: {
                  input: {
                    'ng-blur': 'updateCellHandler()',
                    'data-tooltip': '渲染模式启用有效'
                  }
                }
              },
              */
              labels: {
                type: 'list',
                group: 'labels',
                label: '标签',
                attrs: {
                  label: {
                    'data-tooltip': '为线条设置标签'
                  },
                  input: {
                    'ng-blur': 'updateCellHandler()'
                  }
                },
                item: {
                  type: 'object',
                  properties: {
                    position: {
                      type: 'range',
                      min: 0.1,
                      max: .9,
                      step: .1,
                      defaultValue: .5,
                      label: '位置',
                      index: 2,
                      attrs: {
                        label: {
                          'data-tooltip': '相对于源的标签位置'
                        },
                        input: {
                          'ng-blur': 'updateCellHandler()'
                        }
                      }
                    },
                    attrs: {
                      text: {
                        text: {
                          type: 'text',
                          label: '内容',
                          defaultValue: 'label',
                          index: 1,
                          attrs: {
                            input: {
                              'class': 'form-control input-sm',
                              'ng-blur': 'updateCellHandler()'
                            },
                            label: {
                              'data-tooltip': '设置标签内容'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            groups: {
              'connection': {
                label: '连接线',
                index: 1
              },
              'labels': {
                label: '标签组',
                index: 2
              },
              'marker-source': {
                label: '源标志',
                index: 3
              },
              'marker-target': {
                label: '目标标志',
                index: 4
              }
            }
          },

          // Basic
          // -----
          'basic.Rect': {
            inputs: _.extend({
              attrs: {
                text: inp({
                  text: {
                    group: 'text',
                    index: 1
                  },
                  'font-size': {
                    group: 'text',
                    index: 2
                  },
                  'font-family': {
                    group: 'text',
                    index: 3
                  },
                  'font-weight': {
                    group: 'text',
                    index: 4
                  },
                  fill: {
                    group: 'text',
                    index: 5
                  },
                  opacity: {
                    group: 'text',
                    index: 6
                  },

                  stroke: {
                    group: 'text',
                    index: 7
                  },
                  'stroke-width': {
                    group: 'text',
                    index: 8
                  },
                  'ref-x': {
                    group: 'text',
                    index: 9
                  },
                  'ref-y': {
                    group: 'text',
                    index: 10
                  }
                }),
                rect: inp({
                  fill: {
                    group: 'presentation',
                    index: 1
                  },
                  stroke: {
                    group: 'presentation',
                    index: 2
                  },
                  'stroke-width': {
                    group: 'presentation',
                    index: 3,
                    min: 0,
                    max: 30,
                    defaultValue: 1
                  },
                  'stroke-dasharray': {
                    group: 'presentation',
                    index: 4
                  },
                  rx: {
                    group: 'presentation',
                    index: 5
                  },
                  ry: {
                    group: 'presentation',
                    index: 6
                  },
                  opacity: {
                    group: 'presentation',
                    index: 7
                  }
                })
              }
            }, CommonInspectorInputs),
            groups: CommonInspectorGroups
          },
          'basic.Polygon': {
            inputs: _.extend({
              attrs: {
                text: inp({
                  text: {
                    group: 'text',
                    index: 1
                  },
                  'font-size': {
                    group: 'text',
                    index: 2
                  },
                  'font-family': {
                    group: 'text',
                    index: 3
                  },
                  'font-weight': {
                    group: 'text',
                    index: 4
                  },
                  fill: {
                    group: 'text',
                    index: 5
                  },
                  opacity: {
                    group: 'text',
                    index: 6
                  },

                  stroke: {
                    group: 'text',
                    index: 7
                  },
                  'stroke-width': {
                    group: 'text',
                    index: 8
                  },
                  'ref-x': {
                    group: 'text',
                    index: 9
                  },
                  'ref-y': {
                    group: 'text',
                    index: 10
                  }
                }),
                polygon: inp({
                  fill: {
                    group: 'presentation',
                    index: 1
                  },
                  stroke: {
                    group: 'presentation',
                    index: 2
                  },
                  'stroke-width': {
                    group: 'presentation',
                    index: 3,
                    min: 0,
                    max: 30,
                    defaultValue: 1
                  },
                  'stroke-dasharray': {
                    group: 'presentation',
                    index: 4
                  },
                  opacity: {
                    group: 'presentation',
                    index: 5
                  }
                })
              }
            }, CommonInspectorInputs),
            groups: CommonInspectorGroups
          },
          'basic.Rhombus': {
            inputs: _.extend({
              attrs: {
                text: inp({
                  text: {
                    group: 'text',
                    index: 1
                  },
                  'font-size': {
                    group: 'text',
                    index: 2
                  },
                  'font-family': {
                    group: 'text',
                    index: 3
                  },
                  'font-weight': {
                    group: 'text',
                    index: 4
                  },
                  fill: {
                    group: 'text',
                    index: 5
                  },
                  opacity: {
                    group: 'text',
                    index: 6
                  },

                  stroke: {
                    group: 'text',
                    index: 7
                  },
                  'stroke-width': {
                    group: 'text',
                    index: 8
                  },
                  'ref-x': {
                    group: 'text',
                    index: 9
                  },
                  'ref-y': {
                    group: 'text',
                    index: 10
                  }
                }),
                path: inp({
                  fill: {
                    group: 'presentation',
                    index: 1
                  },
                  stroke: {
                    group: 'presentation',
                    index: 2
                  },
                  'stroke-width': {
                    group: 'presentation',
                    index: 3,
                    min: 0,
                    max: 30,
                    defaultValue: 1
                  },
                  'stroke-dasharray': {
                    group: 'presentation',
                    index: 4
                  },
                  opacity: {
                    group: 'presentation',
                    index: 5
                  }
                })
              }
            }, CommonInspectorInputs),
            groups: CommonInspectorGroups
          },
          'basic.Path': {
            inputs: _.extend({
              attrs: {
                text: inp({
                  text: {
                    group: 'text',
                    index: 1
                  },
                  'font-size': {
                    group: 'text',
                    index: 2
                  },
                  'font-family': {
                    group: 'text',
                    index: 3
                  },
                  'font-weight': {
                    group: 'text',
                    index: 4
                  },
                  fill: {
                    group: 'text',
                    index: 5
                  },
                  opacity: {
                    group: 'text',
                    index: 6
                  },

                  stroke: {
                    group: 'text',
                    index: 7
                  },
                  'stroke-width': {
                    group: 'text',
                    index: 8
                  },
                  'ref-x': {
                    group: 'text',
                    index: 9
                  },
                  'ref-y': {
                    group: 'text',
                    index: 10
                  }
                }),
                path: inp({
                  fill: {
                    group: 'presentation',
                    index: 1
                  },
                  stroke: {
                    group: 'presentation',
                    index: 2
                  },
                  'stroke-width': {
                    group: 'presentation',
                    index: 3,
                    min: 0,
                    max: 30,
                    defaultValue: 1
                  },
                  'stroke-dasharray': {
                    group: 'presentation',
                    index: 4
                  },
                  opacity: {
                    group: 'presentation',
                    index: 5
                  }
                })
              }
            }, CommonInspectorInputs),
            groups: CommonInspectorGroups
          },
          'basic.Circle': {
            inputs: _.extend({
              attrs: {
                text: inp({
                  text: {
                    group: 'text',
                    index: 1
                  },
                  'font-size': {
                    group: 'text',
                    index: 2
                  },
                  'font-family': {
                    group: 'text',
                    index: 3
                  },
                  'font-weight': {
                    group: 'text',
                    index: 4
                  },
                  fill: {
                    group: 'text',
                    index: 5
                  },
                  opacity: {
                    group: 'text',
                    index: 6
                  },
                  stroke: {
                    group: 'text',
                    index: 7
                  },
                  'stroke-width': {
                    group: 'text',
                    index: 8
                  },
                  'ref-x': {
                    group: 'text',
                    index: 9
                  },
                  'ref-y': {
                    group: 'text',
                    index: 10
                  }
                }),
                circle: inp({
                  fill: {
                    group: 'presentation',
                    index: 1
                  },
                  stroke: {
                    group: 'presentation',
                    index: 2
                  },
                  'stroke-width': {
                    group: 'presentation',
                    index: 3,
                    min: 0,
                    max: 30,
                    defaultValue: 1
                  },
                  'stroke-dasharray': {
                    type: 'select',
                    options: ['0', '1', '5,5', '5,10', '10,5', '5,1', '15,10,5,10,15'],
                    group: 'presentation',
                    index: 4
                  },
                  opacity: {
                    group: 'presentation',
                    index: 5
                  },
                })
              }
            }, CommonInspectorInputs),
            groups: CommonInspectorGroups
          },
          'basic.Image': {
            inputs: _.extend({
              attrs: {
                text: inp({
                  text: {
                    group: 'text',
                    index: 1
                  },
                  'font-size': {
                    group: 'text',
                    index: 2
                  },
                  'font-family': {
                    group: 'text',
                    index: 3
                  },
                  'font-weight': {
                    group: 'text',
                    index: 4
                  },
                  fill: {
                    group: 'text',
                    index: 5
                  },
                  opacity: {
                    group: 'text',
                    index: 6
                  },
                  stroke: {
                    group: 'text',
                    index: 7
                  },
                  'stroke-width': {
                    group: 'text',
                    index: 8
                  },
                  'ref-x': {
                    group: 'text',
                    index: 9
                  },
                  'ref-y': {
                    group: 'text',
                    index: 10
                  }
                }),
                image: inp({
                  'xlink:href': {
                    group: 'presentation',
                    index: 1
                  }
                })
              }
            }, CommonInspectorInputs),
            groups: CommonInspectorGroups
          },
          'basic.Text': {
            inputs: _.extend({
              attrs: {
                text: inp({
                  text: {
                    group: 'text',
                    index: 1
                  },
                  'font-family': {
                    group: 'text',
                    index: 2
                  },
                  fill: {
                    group: 'text',
                    index: 3
                  },
                  opacity: {
                    group: 'text',
                    index: 4
                  },
                })
              }
            }, CommonInspectorInputs),
            groups: CommonInspectorGroups
          },

          // DEVS
          // ----
          'chart.Plot': {
            inputs: _.extend({
              attrs: {
                text: inp({
                  text: {
                    group: 'text',
                    index: 1
                  },
                  opacity: {
                    group: 'text',
                    index: 2
                  }
                })
              }
            }, CommonEchartInputs),
            groups: CommonInspectorGroups
          }
        };

        // container of all jointjs objects/plugins
        $scope.components = {};
        $scope.commonInspectorInputs = CommonInspectorInputs;
        $scope.commonInspectorGroups = CommonInspectorGroups;
        $scope.inspectorDefs = InspectorDefs;
        $scope.extendAlertInputs = ExtendAlertInputs;
        $scope.extendValueInputs = ExtendValueInputs;
        $scope.levelInputs = levelInputs;
        $scope.domainInputs = domainInputs;
        $scope.switchInputs = switchInputs;
        Info.get($scope.source, function (data) {
          $scope.data = _.extend({
            stencil: {},
            bgimages: [],
            fillType: {}
          }, data);
        });
      }],

      link: function (scope, element, attrs, Info) {
        var unbindOnData = scope.$watch('data', function (data) {
          if (!data) return;
          // run all initalizators
          _.invoke(scope.$parent.initialization, 'call', window, scope, element);
          // remove watcher (init only once)
          unbindOnData();
        });
      }
    };
  }]);
});