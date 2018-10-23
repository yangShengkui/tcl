define(['directives/directives'], function (directives) {
  'use strict';
  directives.directive('flowid', [function () {
    return {
      restrict: 'E',
      templateUrl: function () {
        console.log(location.hash.search("#/flow") > -1)
        //return 'partials/flowEdit.html';
        return location.hash.search("#/flow") > -1 ? 'partials/flowEdit.html' : 'partials/flow-display.html';
      },
      replace: true,
      scope: {
        title: '@',
        source: '@'
      },
      controller: ['$scope', 'Info', function ($scope, Info) {
        //通用的属性组
        var CommonInspectorGroups = {
          data: {
            label: '属性',
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
            label: '外观设置',
            index: 4
          }
        };
        var CommonInputs = {
          startExpression: {
            type: 'textarea',
            label: '开始表达式',
            group: 'data',
            attrs: {
              textarea: {
                class: 'form-control input-sm'
              }
            },
            index: 3
          },
          endExpression: {
            type: 'textarea',
            label: '结束表达式',
            group: 'data',
            attrs: {
              textarea: {
                class: 'form-control input-sm'
              }
            },
            index: 3
          },
          size: {
            width: {
              type: 'number',
              min: 1,
              max: 500,
              group: 'geometry',
              label: 'width',
              index: 2,
              attrs: {
                input: {
                  class: 'form-control input-sm'
                }
              }
            },
            height: {
              type: 'number',
              min: 1,
              max: 500,
              group: 'geometry',
              label: 'height',
              index: 2,
              attrs: {
                input: {
                  class: 'form-control input-sm'
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
                  class: 'form-control input-sm'
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
                  class: 'form-control input-sm'
                }
              }
            }
          }
        };

        var InputDefs = function (type) {
          type = type || 'text';
          return {
            'text': {
              type: type,
              label: '文本(text)',
              attrs: {
                input: {
                  class: 'form-control input-sm'
                }
              }
            },
            'textarea': {
              type: type,
              label: '文本(text)',
              attrs: {
                textarea: {
                  class: 'form-control input-sm'
                }
              }
            },
            'font-size': {
              type: 'range',
              min: 5,
              max: 80,
              unit: 'px',
              label: '字体大小(font-size)'
            },
            'font-family': {
              type: 'select',
              options: ['Source Sans Pro', 'Helvetica Neue', 'Luxi Sans', 'DejaVu Sans', 'Tahoma', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
              label: '字体系列(font-family)',
              attrs: {
                'select': {
                  class: 'form-control input-sm'
                }
              }
            },
            'font-weight': {
              type: 'range',
              min: 100,
              max: 900,
              step: 100,
              defaultValue: 400,
              label: '字体粗细(font-weight)'
            },
            'fill': {
              type: 'color',
              label: '填充颜色(fill)'
            },
            'opacity': {
              type: 'range',
              min: 0,
              max: 1,
              step: .1,
              defaultValue: 1,
              unit: '',
              label: '透明度(opacity)'
            },
            'stroke': {
              type: 'color',
              defaultValue: '#000000',
              label: '边框颜色(stroke)'
            },
            'stroke-width': {
              type: 'range',
              min: 0,
              max: 5,
              step: .5,
              defaultValue: 0,
              unit: 'px',
              label: '边框宽度(stroke-width)'
            },
            'ref-x': {
              type: 'number',
              defaultValue: 0.5,
              step: .01,
              label: '水平对齐(Horizontal alignment)',
              attrs: {
                input: {
                  class: 'form-control input-sm',
                  'data-tooltip': '0-0.99按照百分比设置<br>大于等于1,小于0时，按照PX设置'
                }
              }
            },
            'ref-y': {
              type: 'number',
              defaultValue: 0.5,
              step: .01,
              label: '垂直对齐(Vertical alignment)',
              attrs: {
                input: {
                  class: 'form-control input-sm',
                  'data-tooltip': '0-0.99按照百分比设置<br>大于等于1,小于0时，按照PX设置'
                }
              }
            },
            'ref-dx': {
              type: 'range',
              min: -100,
              max: 100,
              step: 1,
              defaultValue: 0,
              label: '水平位移(Horizontal offset)'
            },
            'ref-dy': {
              type: 'number',
              defaultValue: 20,
              step: 1,
              label: '垂直位移(Vertical offset)',
              attrs: {
                input: {
                  class: 'form-control input-sm'
                }
              }
            },
            'dx': {
              type: 'range',
              min: -100,
              max: 100,
              step: 1,
              defaultValue: 0,
              label: '水平距离(Horizontal distance)'
            },
            'dy': {
              type: 'range',
              min: -100,
              max: 100,
              step: 1,
              defaultValue: 0,
              label: '垂直距离(Vertical distance)'
            },
            'stroke-dasharray': {
              type: 'select',
              options: ['0', '1', '5,5', '5,10', '10,5', '3,5', '5,1', '15,10,5,10,15'],
              label: '边框虚线(stroke-dasharray)',
              attrs: {
                'select': {
                  class: 'form-control input-sm'
                }
              }
            },
            'rx': {
              type: 'range',
              min: 0,
              max: 30,
              defaultValue: 1,
              unit: 'px',
              label: 'X轴半径(X-axis radius)'
            },
            'ry': {
              type: 'range',
              min: 0,
              max: 30,
              defaultValue: 1,
              unit: 'px',
              label: 'Y轴半径(Y-axis radius)'
            },
            'xlink:href': {
              type: 'text',
              label: '(图片路径)Image URL',
              attrs: {
                input: {
                  class: 'form-control input-sm'
                }
              }
            }
          }
        }

        function inp(defs) {
          var ret = {};
          var inputDefs = InputDefs();
          _.each(defs, function (def, attr) {
            ret[attr] = _.extend({}, inputDefs[attr], def);
          });
          return ret;
        }

        //定义每个组件右侧展示内容
        var InspectorDefs = {
          'bpmn.Flow': {
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
                    label: '笔画宽度',
                    index: 1
                  },
                  'stroke': {
                    type: 'color',
                    group: 'connection',
                    label: '笔画颜色',
                    index: 2
                  },
                  'stroke-dasharray': {
                    type: 'select',
                    options: ['0', '1', '5,5', '5,10', '10,5', '5,1', '15,10,5,10,15'],
                    group: 'connection',
                    label: '画线',
                    index: 3,
                    attrs: {
                      'select': {
                        'class': 'form-control input-sm'
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
                    index: 1
                  },
                  fill: {
                    type: 'color',
                    group: 'marker-source',
                    label: '源箭头的颜色',
                    index: 2
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
                    index: 1
                  },
                  fill: {
                    type: 'color',
                    group: 'marker-target',
                    label: '目标箭头的颜色',
                    index: 2
                  }
                }
              },
              smooth: {
                type: 'toggle',
                group: 'connection',
                index: 4
              },
              manhattan: {
                type: 'toggle',
                group: 'connection',
                index: 5
              },
              labels: {
                type: 'list',
                group: 'labels',
                label: '标签',
                attrs: {
                  label: {
                    'data-tooltip': '为线条设置标签'
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
                              class: 'form-control input-sm'
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
              },
              conditionExpression: {
                type: 'text',
                label: '条件表达式',
                group: 'data',
                attrs: {
                  input: {
                    class: 'form-control input-sm'
                  }
                },
                index: 3
              },
              processMonitors: {
                type: 'list',
                group: 'data',
                label: '通知方式',
                item: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'text',
                      group: 'data',
                      index: 4,
                      label: '通知标题',
                      attrs: {
                        'input': {
                          'class': 'form-control input-sm'
                        }
                      }
                    },
                    eventType: {
                      type: 'select',
                      group: 'data',
                      index: 4,
                      label: '执行方式',
                      options: [{
                        value: 'start',
                        content: '开始时执行'
                      }, {
                        value: 'end',
                        content: '结束时执行'
                      }],
                      attrs: {
                        'select': {
                          'class': 'form-control input-sm'
                        }
                      }
                    },
                    adviceType: {
                      type: 'select',
                      group: 'data',
                      index: 4,
                      label: '发送方式',
                      options: [{
                        value: 'message',
                        content: '短信'
                      }, {
                        value: 'email',
                        content: '邮件'
                      }],
                      attrs: {
                        'select': {
                          'class': 'form-control input-sm'
                        }
                      }
                    }
                  }
                }
              }
            },
            groups: {
              data: {
                label: '属性',
                index: 1
              },
              labels: {
                label: '标签',
                index: 2
              },
              'connection': {
                label: '连接点',
                index: 3
              },
              'marker-source': {
                label: '标记',
                index: 4
              },
              'marker-target': {
                label: '目标标记',
                index: 5
              }
            }
          },
          'bpmn.Gateway': {
            inputs: _.extend({
              icon: {
                type: 'select',
                options: [{
                  value: 'none',
                  content: '默认'
                }, {
                  value: 'cross',
                  content: '排除'
                }, {
                  value: 'circle',
                  content: '包含'
                }, {
                  value: 'plus',
                  content: '平行'
                }],
                attrs: {
                  'select': {
                    'class': 'form-control input-sm'
                  }
                },
                label: '展示类型',
                group: 'text',
                index: 2
              },
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
                '.body/fill': {
                  type: 'color',
                  label: '主体颜色',
                  group: 'geometry',
                  index: 1
                }
              }
            }, CommonInputs)
          },
          'bpmn.Activity': {
            inputs: _.extend({
              content: {
                type: 'text',
                label: '文本(text)',
                group: 'data',
                index: 1,
                attrs: {
                  input: {
                    class: 'form-control input-sm'
                  }
                }
              },
              activityType: {
                type: 'select',
                options: [{
                  value: 'task',
                  content: '任务'
                }, {
                  value: 'transaction',
                  content: '变换'
                }, {
                  value: 'event-sub-process',
                  content: '二级任务'
                }, {
                  value: 'call-activity',
                  content: '激活'
                }],
                attrs: {
                  'select': {
                    'class': 'form-control input-sm'
                  }
                },
                label: '类型',
                group: 'text',
                index: 3
              },
              subProcess: {
                type: 'toggle',
                label: '二级步骤',
                group: 'text',
                index: 4
              },
              attrs: {
                '.body/fill': {
                  type: 'color',
                  label: '主体颜色',
                  group: 'presentation',
                  index: 1
                },
                rect: inp({
                  opacity: {
                    group: 'presentation',
                    index: 2
                  }
                })
              },
              templateURL: {
                type: 'text',
                label: '模板地址',
                group: 'data',
                attrs: {
                  input: {
                    class: 'form-control input-sm'
                  }
                },
                index: 5
              },
              userType: {
                type: 'select',
                group: 'data',
                index: 2,
                label: '处理类型',
                attrs: {
                  'select': {
                    'class': 'form-control input-sm',
                    //'ng-show': 'selectedItem.taskType != "2"',
                    'ng-model': 'selectedItem.userType',
                    'ng-change': 'userTypeHandler()',
                    'ng-options': 'item.value as item.content for item in userTypeList'
                  },
                  'label': {
                    //'ng-show': 'selectedItem.taskType != "2"'
                  }
                }
              },
              roleIds: {
                type: 'select',
                group: 'data',
                index: 3,
                label: '处理角色',
                attrs: {
                  'select': {
                    'class': 'form-control input-sm',
                    'ng-model': 'selectedItem.roleIds',
                    'ng-show': 'selectedItem.userType == "role"',
                    'ng-change': 'roleIdsHandler()',
                    'ng-options': 'value.id as value.name for value in userRoleList'
                  },
                  'label': {
                    'ng-show': 'selectedItem.userType == "role"'
                  }
                }
              },
              userIds: {
                type: 'select',
                group: 'data',
                index: 3,
                label: '处理用户',
                attrs: {
                  'select': {
                    'class': 'form-control input-sm',
                    'ng-model': 'selectedItem.userIds',
                    'ng-show': 'selectedItem.userType == "user"',
                    'ng-change': 'userIdsHandler()',
                    'ng-options': 'value.id as value.name for value in userAryList'
                  },
                  'label': {
                    'ng-show': 'selectedItem.userType == "user"'
                  }
                }
              },
              userExpression: {
                type: 'text',
                group: 'data',
                index: 3,
                label: '用户表达式',
                attrs: {
                  'input': {
                    'class': 'form-control input-sm',
                    'ng-show': 'selectedItem.userType == "expression"'
                  },
                  'label': {
                    'ng-show': 'selectedItem.userType == "expression"'
                  }
                }
              },
              userGroupIds: {
                type: 'select',
                group: 'data',
                index: 3,
                label: '处理用户组',
                attrs: {
                  'select': {
                    'class': 'form-control input-sm',
                    'ng-model': 'selectedItem.userGroupIds',
                    'ng-show': 'selectedItem.userType == "userGroup"',
                    'ng-options': 'value.id as value.name for value in userGroupList'
                  },
                  'label': {
                    'ng-show': 'selectedItem.userType == "userGroup"'
                  }
                }
              },
              taskType: {
                type: 'select',
                label: '任务类型',
                group: 'data',
                attrs: {
                  'select': {
                    'class': 'form-control input-sm',
                    'ng-model': 'selectedItem.taskType',
                    'ng-options': 'item.value as item.content for item in taskTypeList'
                  },
                  'label': {
                    // 'ng-show': 'selectedItem.userType == "888"'
                  }
                },
                index: 4
              },
              processMonitors: {
                type: 'list',
                group: 'data',
                label: '通知方式',
                item: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'text',
                      group: 'data',
                      index: 4,
                      label: '通知标题',
                      attrs: {
                        'input': {
                          'class': 'form-control input-sm'
                        }
                      }
                    },
                    eventType: {
                      type: 'select',
                      group: 'data',
                      index: 4,
                      label: '执行方式',
                      options: [{
                        value: 'start',
                        content: '开始时执行'
                      }, {
                        value: 'end',
                        content: '结束时执行'
                      }],
                      attrs: {
                        'select': {
                          'class': 'form-control input-sm'
                        }
                      }
                    },
                    adviceType: {
                      type: 'select',
                      group: 'data',
                      index: 4,
                      label: '发送方式',
                      options: [{
                        value: 'message',
                        content: '短信'
                      }, {
                        value: 'email',
                        content: '邮件'
                      }, {
                        value: 'apppush',
                        content: 'app通知'
                      }],
                      attrs: {
                        'select': {
                          'class': 'form-control input-sm'
                        }
                      }
                    }
                  }
                }
              },
              attributeDefinitions: {
                type: 'list',
                group: 'data',
                label: '添加属性',
                item: {
                  type: 'object',
                  properties: {
                    //attrs: {
                    reorder: {
                      //text: {
                      type: 'text',
                      label: '属性排序',
                      index: 1,
                      attrs: {
                        input: {
                          class: 'form-control input-sm'
                        },
                        label: {
                          'data-tooltip': '属性名称最好是英文，不会展示出来'
                        }
                      }
                      //}
                    },
                    label: {
                      //text: {
                      type: 'text',
                      label: '属性名称',
                      index: 2,
                      attrs: {
                        input: {
                          class: 'form-control input-sm'
                        },
                        label: {
                          'data-tooltip': '属性名称最好是英文，不会展示出来'
                        }
                      }
                      //}
                    },
                    name: {
                      //text: {
                      type: 'text',
                      label: '显示名称',
                      index: 3,
                      attrs: {
                        input: {
                          class: 'form-control input-sm'
                        },
                        label: {
                          'data-tooltip': '显示名称最好是中文'
                        }
                      }
                      //}
                    },
                    required: {
                      //text: {
                      type: 'select',
                      label: '是否必填',
                      index: 4,
                      options: [{
                        value: 'no',
                        content: '否'
                      }, {
                        value: 'yes',
                        content: '是'
                      }],
                      attrs: {
                        'select': {
                          'class': 'form-control input-sm'
                        }
                      }
                      //}
                    },
                    lookStatus: {
                      //text: {
                      type: 'select',
                      label: '编辑状态',
                      index: 4,
                      options: [{
                        value: 'edit',
                        content: '可编辑'
                      }, {
                        value: 'disabled',
                        content: '不可编辑'
                      }, {
                        value: 'readonly',
                        content: '只读'
                      }],
                      attrs: {
                        'select': {
                          'class': 'form-control input-sm'
                        }
                      }
                      //}
                    },
                    lineNumber: {
                      //text: {
                      type: 'select',
                      label: '显示行数',
                      index: 4,
                      options: [{
                        value: 'two',
                        content: '两行'
                      }, {
                        value: 'one',
                        content: '一行'
                      }],
                      attrs: {
                        'select': {
                          'class': 'form-control input-sm'
                        }
                      }
                      //}
                    },
                    dataType: {
                      type: 'select',
                      group: 'data',
                      index: 5,
                      label: '属性类型',
                      options: [{
                        value: 'string',
                        content: '文本类型'
                      }, {
                        value: 'textarea',
                        content: '多行文本框'
                      }, {
                        value: 'select',
                        content: '下拉框'
                      }, {
                        value: 'date',
                        content: '日期类型'
                      }, {
                        value: 'customers',
                        content: '客户'
                      }, {
                        value: 'project',
                        content: '项目'
                      }, {
                        value: 'devices',
                        content: '设备'
                      }, {
                        value: 'assign',
                        content: '指派人'
                      }, {
                        value: 'sparepart',
                        content: '备件'
                      }, {
                        value: 'uploader',
                        content: '上传组件'
                      }, {
                        value: 'cascade',
                        content: '级联选项'
                      }],
                      attrs: {
                        'select': {
                          'class': 'form-control input-sm'
                        }
                      }
                    },
                    selectValue: {
                      //text: {
                      type: 'textarea',
                      label: '定义下拉框值',
                      index: 6,
                      attrs: {
                        textarea: {
                          class: 'form-control input-sm'
                        },
                        label: {
                          'data-tooltip': '定义下拉框值数组格式例如：[{}]'
                        }
                      }
                    },
                    selectExpression: {
                      type: 'textarea',
                      label: '属性表达式',
                      index: 7,
                      attrs: {
                        textarea: {
                          class: 'form-control input-sm'
                        }
                      }
                    },
                    relation: {
                      type: 'text',
                      label: '属性关联',
                      index: 8,
                      attrs: {
                        input: {
                          class: 'form-control input-sm'
                        }
                      }
                    }
                  }
                }
              }
            }, CommonInputs),
            groups: CommonInspectorGroups
          },
          'bpmn.Event': {
            inputs: _.extend({
              eventType: {
                type: 'select',
                options: [{
                  value: 'start',
                  content: '开始'
                }, {
                  value: 'end',
                  content: '结束'
                }],
                attrs: {
                  'select': {
                    'class': 'form-control input-sm'
                  }
                },
                group: 'text',
                label: '类型',
                index: 2
              },
              boundaryType: {
                type: 'select',
                options: [{
                  value: 'timeDate',
                  content: 'timeDate'
                }, {
                  value: 'timeDuration',
                  content: 'timeDuration'
                }, {
                  value: 'timeCycle',
                  content: 'timeCycle'
                }],
                attrs: {
                  'select': {
                    'class': 'form-control input-sm'
                  }
                },
                group: 'text',
                index: 3,
                label: '时间边界类型'
              },
              icon: {
                type: 'select',
                options: [{
                  value: 'none',
                  content: '无'
                }, {
                  value: 'cross',
                  content: '取消'
                }, {
                  value: 'message',
                  content: '信息'
                }, {
                  value: 'plus',
                  content: '平行事件'
                }],
                attrs: {
                  'select': {
                    'class': 'form-control input-sm'
                  }
                },
                label: '子类型',
                group: 'text',
                index: 4
              },
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
                '.body/fill': {
                  type: 'color',
                  label: '主体颜色',
                  group: 'presentation',
                  index: 1
                },
                rect: inp({
                  opacity: {
                    group: 'presentation',
                    index: 2
                  }
                })
              },
              attributeDefinitions: {
                type: 'list',
                group: 'data',
                label: '添加属性',
                item: {
                  type: 'object',
                  properties: {
                    //attrs: {
                    reorder: {
                      //text: {
                      type: 'text',
                      label: '属性排序',
                      index: 1,
                      attrs: {
                        input: {
                          class: 'form-control input-sm'
                        },
                        label: {
                          'data-tooltip': '属性名称最好是英文，不会展示出来'
                        }
                      }
                      //}
                    },
                    label: {
                      //text: {
                      type: 'text',
                      label: '属性名称',
                      index: 2,
                      attrs: {
                        input: {
                          class: 'form-control input-sm'
                        },
                        label: {
                          'data-tooltip': '属性名称最好是英文，不会展示出来'
                        }
                      }
                      //}
                    },
                    name: {
                      //text: {
                      type: 'text',
                      label: '显示名称',
                      index: 3,
                      attrs: {
                        input: {
                          class: 'form-control input-sm'
                        },
                        label: {
                          'data-tooltip': '显示名称最好是中文'
                        }
                      }
                      //}
                    },
                    required: {
                      //text: {
                      type: 'select',
                      label: '是否必填',
                      index: 4,
                      options: [{
                        value: 'yes',
                        content: '否'
                      }, {
                        value: 'no',
                        content: '是'
                      }],
                      attrs: {
                        'select': {
                          'class': 'form-control input-sm'
                        }
                      }
                      //}
                    },
                    dataType: {
                      type: 'select',
                      group: 'data',
                      index: 5,
                      label: '属性类型',
                      options: [{
                        value: 'string',
                        content: '文本类型'
                      }, {
                        value: 'textarea',
                        content: '多行文本框'
                      }, {
                        value: 'select',
                        content: '下拉框'
                      }, {
                        value: 'date',
                        content: '日期类型'
                      }, {
                        value: 'customers',
                        content: '客户'
                      }, {
                        value: 'project',
                        content: '项目'
                      }, {
                        value: 'devices',
                        content: '设备'
                      }, {
                        value: 'assign',
                        content: '指派人'
                      }, {
                        value: 'priorityCode',
                        content: '紧急度'
                      }],
                      attrs: {
                        'select': {
                          'class': 'form-control input-sm'
                        }
                      }
                    },
                    selectValue: {
                      //text: {
                      type: 'textarea',
                      label: '定义下拉框值',
                      attrs: {
                        textarea: {
                          class: 'form-control input-sm'
                        },
                        label: {
                          'data-tooltip': '定义下拉框值数组格式例如：[{}]'
                        }
                      }
                      //}
                    },
                    selectExpression: {
                      type: 'textarea',
                      label: '属性表达式',
                      attrs: {
                        textarea: {
                          class: 'form-control input-sm'
                        }
                      }
                    }
                  }
                }
              }
            }, CommonInputs)
          },
          'bpmn.Annotation': {
            inputs: _.extend({
              content: {
                type: 'textarea',
                label: '内容',
                group: 'text',
                attrs: {
                  textarea: {
                    class: 'form-control input-sm'
                  }
                },
                index: 1
              },
              attrs: {
                '.body/fill': {
                  type: 'color',
                  label: '填充颜色(fill)',
                  group: 'presentation',
                  index: 1
                },
                '.body/fill-opacity': {
                  type: 'range',
                  min: 0,
                  max: 1,
                  step: 0.1,
                  label: '透明度(opacity)',
                  group: 'presentation',
                  index: 2
                }
              }
            }, CommonInputs)
          },
          'bpmn.Pool': {
            inputs: _.extend({
              lanes: {
                type: 'object',
                group: 'data',
                index: 1,
                attrs: {
                  label: {
                    style: 'display:none;'
                  }
                },
                properties: {
                  label: {
                    type: 'text',
                    label: '标签'
                  },
                  sublanes: {
                    type: 'list',
                    label: '增加连线',
                    item: {
                      type: 'object',
                      properties: {
                        label: {
                          type: 'text',
                          label: '标签',
                          attrs: {
                            label: {
                              style: 'display:none;'
                            }
                          }
                        },
                        sublanes: {
                          type: 'list',
                          label: '增加子连线',
                          item: {
                            type: 'object',
                            properties: {
                              label: {
                                type: 'text',
                                label: '标签',
                                attrs: {
                                  label: {
                                    style: 'display:none;'
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              attrs: {
                '.body/fill': {
                  type: 'color',
                  label: '主体颜色',
                  group: 'presentation',
                  index: 1
                },
                '.header/fill': {
                  type: 'color',
                  label: '标题颜色',
                  group: 'presentation',
                  index: 2
                },
                '.lane-body/fill': {
                  type: 'color',
                  label: '线框颜色',
                  group: 'presentation',
                  index: 3
                },
                '.lane-header/fill': {
                  type: 'color',
                  label: '线框标题颜色',
                  group: 'presentation',
                  index: 4
                }
              }
            }, CommonInputs)
          },
          'bpmn.Group': {
            inputs: _.extend({
              attrs: {
                '.label/text': {
                  type: 'text',
                  label: '名称',
                  group: 'data',
                  index: 1
                },
                '.label-rect/fill': {
                  type: 'color',
                  label: '主体颜色',
                  group: 'presentation',
                  index: 1
                }
              }
            }, CommonInputs)
          },
          'bpmn.Conversation': {
            inputs: _.extend({
              boundaryType: {
                type: 'select',
                options: [{
                  value: 'timeDate',
                  content: 'timeDate'
                }, {
                  value: 'timeDuration',
                  content: 'timeDuration'
                }, {
                  value: 'timeCycle',
                  content: 'timeCycle'
                }],
                attrs: {
                  'select': {
                    'class': 'form-control input-sm'
                  }
                },
                group: 'text',
                index: 3,
                label: '事件类型'
              },
              expression: {
                type: 'textarea',
                label: '表达式',
                group: 'text',
                attrs: {
                  textarea: {
                    class: 'form-control input-sm'
                  }
                },
                index: 4
              },
              attachedTo: {
                type: 'select',
                options: [],
                attrs: {
                  'select': {
                    'class': 'form-control input-sm',
                    'ng-model': 'attachToTask',
                    'ng-options': 'item.get("id") as item.get("content") for item in allTasks'
                  }
                },
                group: 'text',
                index: 5,
                label: '依附到'
              },
              cancelTask: {
                type: 'select',
                options: [{
                  value: "true",
                  content: '是'
                }, {
                  value: "false",
                  content: '否'
                }],
                attrs: {
                  'select': {
                    'class': 'form-control input-sm'
                  }
                },
                group: 'text',
                index: 6,
                label: '取消活动'
              },
              attrs: {
                '.label/text': {
                  type: 'text',
                  label: '名称',
                  group: 'data',
                  index: 1
                },
                '.body/fill': {
                  type: 'color',
                  label: '主体颜色',
                  group: 'presentation',
                  index: 1
                }
              }
            }, CommonInputs)
          },
          'bpmn.Choreography': {
            inputs: _.extend({
              participants: {
                type: 'list',
                label: '参与者',
                item: {
                  type: 'text'
                },
                group: 'data',
                index: 1
              },
              initiatingParticipant: {
                type: 'select',
                label: '初始化参与者',
                options: 'participants',
                group: 'data',
                index: 2
              },
              subProcess: {
                type: 'toggle',
                label: '次要步骤',
                group: 'data',
                index: 3
              },
              content: {
                type: 'textarea',
                label: '内容',
                group: 'text',
                attrs: {
                  textarea: {
                    class: 'form-control input-sm'
                  }
                },
                index: 4
              },
              attrs: {
                '.body/fill': {
                  type: 'color',
                  label: '主要颜色',
                  group: 'presentation',
                  index: 1
                },
                '.participant-rect/fill': {
                  type: 'color',
                  label: '次要颜色',
                  group: 'presentation',
                  index: 2
                }
              }
            }, CommonInputs)
          },
          'bpmn.DataObject': {
            inputs: _.extend({
              attrs: {
                '.label/text': {
                  type: 'text',
                  label: '名称',
                  group: 'data',
                  index: 1
                },
                '.body/fill': {
                  type: 'color',
                  label: '主体颜色',
                  group: 'presentation',
                  index: 1
                }
              }
            }, CommonInputs)
          },
          'bpmn.Message': {
            inputs: _.extend({
              attrs: {
                '.label/text': {
                  type: 'text',
                  label: '名称',
                  group: 'data',
                  index: 1
                },
                '.body/fill': {
                  type: 'color',
                  label: '主体颜色',
                  group: 'geometry',
                  index: 1
                }
              }
            }, CommonInputs)
          }
        };
        Info.get($scope.source, function (data) {
          $scope.data = _.extend({
            stencil: {},
            bgimages: [],
            fillType: {}
          }, data);
        });
        $scope.components = {};
        $scope.commonInspectorGroups = CommonInspectorGroups;
        $scope.inspectorDefs = InspectorDefs;
      }],
      link: function (scope, element, attrs) {
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