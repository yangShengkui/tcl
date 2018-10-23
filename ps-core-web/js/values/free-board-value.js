define(["values/values"], function(values) {
  values.value("freeBoardValue", {
    "GRID": {
      "type": "row",
      "children": [{
        "type": "column",
        "col": 12,
        "children": [{
          "type": "row",
          "children": []
        }]
      }]
    },
    "BLOCK": {
      "label": "方块",
      "type": "block",
      "children": [{
        "type": "column",
        "col": 12,
        "children": []
      }],
      "attributes": {
        "bgcolor": {
          "label": "背景色",
          "value": "#367fa9",
          "type": "colorPicker"
        },
        "bordercolor": {
          "label": "边框颜色",
          "value": "#93C47D",
          "type": "colorPicker"
        },
        "borderwidth": {
          "label": "边框颜色",
          "value": 2,
          "min": 0,
          "max": 10,
          "type": "slider"
        }
      }
    },
    "BOX": {
      "type": "box",
      "class": "box box-info",
      "attributes": {
        "text": {
          "label": "标题文字",
          "value": "标题文字",
          "type": "standardInput"
        },
        "color": {
          "label": "颜色",
          "value": "#333",
          "type": "colorPicker"
        },
        "fontSize": {
          "label": "字体大小",
          "value": 18,
          "type": "slider"
        },
        "position": {
          "label": "对齐",
          "value": "left",
          "type": "select",
          "option": [{
            "label": "左对齐",
            "value": "left"
          }, {
            "label": "中间对齐",
            "value": "center"
          }, {
            "label": "右对齐",
            "value": "right"
          }]
        },
        "weight": {
          "label": "粗细",
          "value": "bold",
          "type": "select",
          "option": [{
            "label": "正常",
            "value": "normal"
          }, {
            "label": "粗体",
            "value": "bold"
          }]
        }
      },
      "children": [{
        "class": "box-body",
        "type": "box-body",
        "children" : [{
          "type": "column",
          "col": 12,
          "children": []
        }]
      },{
        "class": "box-footer",
        "type": "box-footer",
        "children" : [{
          "type": "column",
          "col": 12,
          "children": []
        }]
      }]
    },
    "TEXT": {
      "label": "文字编辑",
      "type": "text",
      "attributes": {
        "text": {
          "label": "文字",
          "value": "新建文字",
          "type": "standardInput"
        },
        "link": {
          "label": "链接地址",
          "value": "",
          "type": "standardInput"
        },
        "color": {
          "label": "颜色",
          "value": "#333",
          "type": "colorPicker"
        },
        "fontSize": {
          "label": "字体大小",
          "value": 14,
          "type": "slider"
        },
        "position": {
          "label": "对齐",
          "value": "left",
          "type": "select",
          "option": [{
            "label": "左对齐",
            "value": "left"
          }, {
            "label": "中间对齐",
            "value": "center"
          }, {
            "label": "右对齐",
            "value": "right"
          }]
        },
        "weight": {
          "label": "粗细",
          "value": "normal",
          "type": "select",
          "option": [{
            "label": "正常",
            "value": "normal"
          }, {
            "label": "粗体",
            "value": "bold"
          }]
        }
      }
    },
    "TOTALITEM": {
      "label": "数据统计标签",
      "type": "totalItem",
      "attributes": {
        "title": {
          "label": "主标题",
          "value": "10米(模拟数据)",
          "type": "standardInput",
          "data": {
            value : 'none',
            option : [{
              label : '不绑定数据',
              value : 'none'
            },{
              label : '读数(单位) ',
              value : 'value'
            }]
          }
        },
        "subtitle": {
          "label": "副标题",
          "value": "模拟数据",
          "type": "standardInput",
          "data": {
            value : 'none',
            option : [{
              label : '不绑定数据',
              value : 'none'
            },{
              label : '指标名称',
              value : 'kpi'
            },{
              label : '设备名称',
              value : 'resource'
            },{
              label : '设备 + 指标名称',
              value : 'resourcekpi'
            }]
          }
        },
        "link": {
          "label": "链接地址",
          "value": "http://www.baidu.com",
          "type": "standardInput"
        },
        "color": {
          "label": "颜色",
          "value": "#367fa9",
          "type": "colorPicker"
        },
        "icon": {
          "label": "图标",
          "value": "ps-edit",
          "type": "iconPicker"
        }
      },
      "data": {
        "model": null,
        "resource": [null],
        "modelDisable": true,
        "maxKpi": 1
      }
    },
    "PROGRESS": {
      "label": "百分比状态条",
      "type": "progress",
      "attributes": {
        "value": {
          "label": "数值",
          "value": 20,
          "type": "slider",
          "data": {
            value : 'none',
            option : [{
              label : '不绑定数据',
              value : 'none'
            },{
              label : '读数(单位) ',
              value : 'value'
            }]
          }
        },
        "description": {
          "label": "数值",
          "value": "(模拟数据)",
          "type": "standardInput"
        },
        "padding": {
          "label": "边距",
          "value": 5,
          "type": "slider"
        }
      },
      "data": {
        "model": null,
        "resource": [null],
        "modelDisable": true,
        "maxKpi": 1
      }
    },
    "SPARKLINE": {
      "label": "柱状图",
      "type": "sparkline",
      "attributes": {
        "value": {
          "label": "数值",
          "value": "3,1,4,5,7,2",
          "type": "standardInput",
          "data": {
            value : 'none',
            option : [{
              label : '不绑定数据',
              value : 'none'
            },{
              label : '读数',
              value : 'value'
            }]
          }
        },
        "title": {
          "label": "标题",
          "value": "(模拟数据)",
          "type": "standardInput",
          "data": {
            value : 'none',
            option : [{
              label : '不绑定数据',
              value : 'none'
            },{
              label : '指标',
              value : 'kpi'
            },{
              label : '设备',
              value : 'resource'
            },{
              label : '设备 + 指标',
              value : 'resourcekpi'
            }]
          }
        },
        "color": {
          "label": "字体颜色",
          "value": "#fff",
          "type": "colorPicker"
        },
        "timespan": {
          "label": "时间段",
          "value": 168,
          "type": "slider",
          "min": 0,
          "max": 1000,
          "unit": "小时"
        }
      },
      "data": {
        "model": null,
        "resource": [null],
        "modelDisable": true,
        "maxKpi": 1
      }
    },
    "DOWNTAB": {
      "label": "环比标签",
      "type": "downtab",
      "attributes": {
        "value": {
          "label": "数值",
          "value": 20,
          "type": "slider",
          "data": {}
        },
        "desciption": {
          "label": "描述",
          "value": "(模拟数据)",
          "type": "standardInput"
        }
      },
      "data": {
        "model": null,
        "resource": [null],
        "modelDisable": true,
        "maxKpi": 1
      }
    },
    "LINECHART": {
      "label": "线图",
      "type": "linechart",
      "attributes": {
        "value": {
          "label": "数值",
          "value": "22,10,5,10,4,8,3",
          "type": "standardInput",
          "data": {
            value : 'none',
            option : [{
              label : '不绑定数据',
              value : 'none'
            },{
              label : '读数',
              value : 'value'
            }]
          }
        },
        "xAxis": {
          "label": "X轴",
          "value": "2016/6/1,2016/6/2,2016/6/3,2016/6/4,2016/6/5,2016/6/6,2016/6/7",
          "type": "standardInput",
          "data": {
            value : 'none',
            option : [{
              label : '不绑定数据',
              value : 'none'
            },{
              label : '读数',
              value : 'value'
            }]
          }
        },
        "timespan": {
          "label": "时间段",
          "value": 168,
          "type": "slider",
          "min": 0,
          "max": 1000,
          "unit": "小时"
        },
        "format": {
          "label": "时间模式",
          "value": "年月日",
          "type": "select",
          "option": [{
            "label": "年月日",
            "value": "年月日"
          }, {
            "label": "年月日时分",
            "value": "年月日时分"
          }, {
            "label": "年月日时分秒",
            "value": "年月日时分秒"
          }, {
            "label": "月日",
            "value": "月日"
          }, {
            "label": "时分",
            "value": "时分"
          }, {
            "label": "时分秒",
            "value": "时分秒"
          }]
        },
        "max": {
          "label": "Y轴最大值",
          "value": 0,
          "type": "slider",
          "unit": ""
        },
        "min": {
          "label": "Y轴最小值",
          "value": 0,
          "type": "slider",
          "unit": ""
        },
        "color": {
          "label": "颜色",
          "value": "#d11332",
          "type": "colorPicker"
        },
        "showxAxis": {
          "label": "显示X轴坐标",
          "value": true,
          "type": "select",
          "option": [{
            "label": "显示",
            "value": true
          }, {
            "label": "隐藏",
            "value": false
          }]
        },
        "showyAxis": {
          "label": "显示Y轴坐标",
          "value": true,
          "type": "select",
          "option": [{
            "label": "显示",
            "value": true
          }, {
            "label": "隐藏",
            "value": false
          }]
        },
        "fillType": {
          "label": "填充模式",
          "value": "line",
          "type": "select",
          "option": [{
            "label": "线性填充",
            "value": "line"
          }, {
            "label": "面积填充",
            "value": "area"
          }]
        }
      },
      "data": {
        "model": null,
        "resource": [null],
        "modelDisable": true,
        "timeSpan": 3600
      }
    },
    "PIECHART": {
      "label": "饼图",
      "type": "piechart",
      "attributes": {
        "title": {
          "label": "主标题",
          "value": "新建饼图",
          "type": "standardInput"
        },
        "subtitle": {
          "label": "副标题",
          "value": "新建副标题",
          "type": "standardInput"
        },
        "dataType": {
          "label": "数据类型",
          "value": "kpi",
          "type": "select",
          "option": [{
            "label": "告警",
            "value": "alert"
          }, {
            "label": "指标",
            "value": "kpi"
          }]
        },
        "value": {
          "label": "数值",
          "value": "6,5,10,2",
          "type": "standardInput",
          "data": {
            value : 'none',
            option : [{
              label : '不绑定数据',
              value : 'none'
            },{
              label : '读数',
              value : 'value'
            }]
          }
        },
        "legend": {
          "label": "数值",
          "value": "设备A, 设备B, 设备C, 设备D",
          "type": "standardInput",
          "data": {
            value : 'none',
            option : [{
              label : '不绑定数据',
              value : 'none'
            },{
              label : '读数',
              value : 'value'
            }]
          }
        }
      },
      "data": {
        "model": null,
        "resource": [null],
        "modelDisable": true,
        "timeSpan": 3600
      }
    }
  });
  values.value("standardDashboard", {"version":"V_2","data":{"type":"column","children":[{"label":"方块","type":"row","children":[{"type":"column","col":3,"children":[{"label":"数据统计标签","type":"totalItem","attributes":{"title":{"label":"主标题","value":"10米(模拟数据)","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:324"},{"label":"读数(单位) ","value":"value","$$hashKey":"object:325"}]}},"subtitle":{"label":"副标题","value":"模拟数据","type":"standardInput","data":{"value":"kpi","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:334"},{"label":"指标名称","value":"kpi","$$hashKey":"object:335"},{"label":"设备名称","value":"resource","$$hashKey":"object:336"},{"label":"设备 + 指标名称","value":"resourcekpi","$$hashKey":"object:337"}]}},"link":{"label":"链接地址","value":"../app-oc/index.html#/resource","type":"standardInput"},"color":{"label":"颜色","value":"#25bce7","type":"colorPicker"},"icon":{"label":"图标","value":"ps-number","type":"iconPicker"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3001]}}]},{"type":"column","col":3,"children":[{"label":"数据统计标签","type":"totalItem","attributes":{"title":{"label":"主标题","value":"10米(模拟数据)","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:83"},{"label":"读数(单位) ","value":"value","$$hashKey":"object:84"}]}},"subtitle":{"label":"副标题","value":"模拟数据","type":"standardInput","data":{"value":"kpi","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:93"},{"label":"指标名称","value":"kpi","$$hashKey":"object:94"},{"label":"设备名称","value":"resource","$$hashKey":"object:95"},{"label":"设备 + 指标名称","value":"resourcekpi","$$hashKey":"object:96"}]}},"link":{"label":"链接地址","value":"../app-oc/index.html#/emcsView","type":"standardInput"},"color":{"label":"颜色","value":"#00b9b2","type":"colorPicker"},"icon":{"label":"图标","value":"ps-video-camera","type":"iconPicker"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3002]}}]},{"type":"column","col":3,"children":[{"label":"数据统计标签","type":"totalItem","attributes":{"title":{"label":"主标题","value":"10米(模拟数据)","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:424"},{"label":"读数(单位) ","value":"value","$$hashKey":"object:425"}]}},"subtitle":{"label":"副标题","value":"模拟数据","type":"standardInput","data":{"value":"kpi","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:434"},{"label":"指标名称","value":"kpi","$$hashKey":"object:435"},{"label":"设备名称","value":"resource","$$hashKey":"object:436"},{"label":"设备 + 指标名称","value":"resourcekpi","$$hashKey":"object:437"}]}},"link":{"label":"链接地址","value":"../app-oc/index.html#/workorderrecord","type":"standardInput"},"color":{"label":"颜色","value":"#e7675d","type":"colorPicker"},"icon":{"label":"图标","value":"ps-sandglass","type":"iconPicker"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3003]}}]},{"type":"column","col":3,"children":[{"label":"数据统计标签","type":"totalItem","attributes":{"title":{"label":"主标题","value":"10米(模拟数据)","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:477"},{"label":"读数(单位) ","value":"value","$$hashKey":"object:478"}]}},"subtitle":{"label":"副标题","value":"模拟数据","type":"standardInput","data":{"value":"kpi","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:487"},{"label":"指标名称","value":"kpi","$$hashKey":"object:488"},{"label":"设备名称","value":"resource","$$hashKey":"object:489"},{"label":"设备 + 指标名称","value":"resourcekpi","$$hashKey":"object:490"}]}},"link":{"label":"链接地址","value":"../app-oc/index.html#/configAlertByStatus","type":"standardInput"},"color":{"label":"颜色","value":"#ebae0b","type":"colorPicker"},"icon":{"label":"图标","value":"ps-duration","type":"iconPicker"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3004]}}]}]},{"type":"box","class":"box box-info","attributes":{"text":{"label":"标题文字","value":"最近一周告警情况","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":18,"type":"slider"},"position":{"label":"对齐","value":"left","type":"select","option":[{"label":"左对齐","value":"left"},{"label":"中间对齐","value":"center"},{"label":"右对齐","value":"right"}]},"weight":{"label":"粗细","value":"bold","type":"select","option":[{"label":"正常","value":"normal"},{"label":"粗体","value":"bold"}]}},"children":[{"type":"box-body","children":[{"type":"column","col":8,"children":[{"label":"线图","type":"linechart","attributes":{"value":{"label":"数值","value":"22,10,5,10,4,8,3","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none"},{"label":"读数","value":"value"}]}},"xAxis":{"label":"X轴","value":"2016/6/1,2016/6/2,2016/6/3,2016/6/4,2016/6/5,2016/6/6,2016/6/7","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none"},{"label":"读数","value":"value"}]}},"timespan":{"label":"时间段","value":168,"type":"slider","min":0,"max":1000,"unit":"小时"},"format":{"label":"时间模式","value":"年月日","type":"select","option":[{"label":"年月日","value":"年月日"},{"label":"年月日时分","value":"年月日时分"},{"label":"年月日时分秒","value":"年月日时分秒"},{"label":"月日","value":"月日"},{"label":"时分","value":"时分"},{"label":"时分秒","value":"时分秒"}]},"max":{"label":"Y轴最大值","value":0,"type":"slider","unit":""},"min":{"label":"Y轴最小值","value":0,"type":"slider","unit":""},"color":{"label":"颜色","value":"#d11332","type":"colorPicker"},"showxAxis":{"label":"显示X轴坐标","value":true,"type":"select","option":[{"label":"显示","value":true},{"label":"隐藏","value":false}]},"showyAxis":{"label":"显示Y轴坐标","value":true,"type":"select","option":[{"label":"显示","value":true},{"label":"隐藏","value":false}]},"fillType":{"label":"填充模式","value":"line","type":"select","option":[{"label":"线性填充","value":"line"},{"label":"面积填充","value":"area"}]}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"timeSpan":3600,"kpi":[3006,3007,3008,3009]}}]},{"type":"column","col":4,"children":[{"type":"row","children":[{"type":"column","col":12,"children":[{"label":"文字编辑","type":"text","attributes":{"text":{"label":"文字","value":"处理情况","type":"standardInput"},"link":{"label":"链接地址","value":"","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":14,"type":"slider"},"position":{"label":"对齐","value":"center","type":"select","option":[{"label":"左对齐","value":"left"},{"label":"中间对齐","value":"center"},{"label":"右对齐","value":"right"}]},"weight":{"label":"粗细","value":"bold","type":"select","option":[{"label":"正常","value":"normal"},{"label":"粗体","value":"bold"}]}}},{"label":"百分比状态条","type":"progress","attributes":{"value":{"label":"数值","value":20,"type":"slider","data":{}},"description":{"label":"数值","value":"(模拟数据)","type":"standardInput"},"padding":{"label":"边距","value":5,"type":"slider"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[100002]}},{"label":"百分比状态条","type":"progress","attributes":{"value":{"label":"数值","value":20,"type":"slider","data":{}},"description":{"label":"数值","value":"(模拟数据)","type":"standardInput"},"padding":{"label":"边距","value":5,"type":"slider"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[100004]}}]}]}]}],"class":"box-body"},{"type":"box-footer","children":[{"type":"column","col":3,"children":[{"type":"row","children":[{"type":"column","col":12,"children":[{"label":"环比标签","type":"downTab","attributes":{"value":{"label":"数值","value":20,"type":"slider","data":{}},"desciption":{"label":"描述","value":"(模拟数据)","type":"standardInput"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3006]}}]}]}]},{"type":"column","col":3,"children":[{"type":"row","children":[{"type":"column","col":12,"children":[{"label":"环比标签","type":"downTab","attributes":{"value":{"label":"数值","value":20,"type":"slider","data":{}},"desciption":{"label":"描述","value":"(模拟数据)","type":"standardInput"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3007]}}]}]}]},{"type":"column","col":3,"children":[{"type":"row","children":[{"type":"column","col":12,"children":[{"label":"环比标签","type":"downTab","attributes":{"value":{"label":"数值","value":20,"type":"slider","data":{}},"desciption":{"label":"描述","value":"(模拟数据)","type":"standardInput"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3008]}}]}]}]},{"type":"column","col":3,"children":[{"type":"row","children":[{"type":"column","col":12,"children":[{"label":"环比标签","type":"downTab","attributes":{"value":{"label":"数值","value":20,"type":"slider","data":{}},"desciption":{"label":"描述","value":"(模拟数据)","type":"standardInput"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3009]}}]}]}]}],"class":"box-footer"}]},{"type":"row","children":[{"type":"column","children":[{"type":"box","class":"box box-info","attributes":{"text":{"label":"标题文字","value":"设备分布","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":18,"type":"slider"},"position":{"label":"对齐","value":"left","type":"select","option":[{"label":"左对齐","value":"left"},{"label":"中间对齐","value":"center"},{"label":"右对齐","value":"right"}]},"weight":{"label":"粗细","value":"bold","type":"select","option":[{"label":"正常","value":"normal"},{"label":"粗体","value":"bold"}]}},"children":[{"type":"box-body","children":[{"type":"column","col":8,"children":[{"type":"map","children":[]}]},{"type":"column","col":4,"children":[{"label":"方块","type":"block","children":[{"type":"column","col":12,"children":[{"label":"柱状图","type":"sparkline","attributes":{"value":{"label":"数值","value":"3,1,4,5,7,2","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none"},{"label":"读数","value":"value"}]}},"title":{"label":"标题","value":"(模拟数据)","type":"standardInput","data":{"value":"kpi","option":[{"label":"不绑定数据","value":"none"},{"label":"指标","value":"kpi"},{"label":"设备","value":"resource"},{"label":"设备 + 指标","value":"resourcekpi"}]}},"color":{"label":"字体颜色","value":"#fff","type":"colorPicker"},"timespan":{"label":"时间段","value":168,"type":"slider","min":0,"max":1000,"unit":"小时"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3005]}},{"label":"柱状图","type":"sparkline","attributes":{"value":{"label":"数值","value":"3,1,4,5,7,2","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none"},{"label":"读数","value":"value"}]}},"title":{"label":"标题","value":"(模拟数据)","type":"standardInput","data":{"value":"kpi","option":[{"label":"不绑定数据","value":"none"},{"label":"指标","value":"kpi"},{"label":"设备","value":"resource"},{"label":"设备 + 指标","value":"resourcekpi"}]}},"color":{"label":"字体颜色","value":"#fff","type":"colorPicker"},"timespan":{"label":"时间段","value":168,"type":"slider","min":0,"max":1000,"unit":"小时"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3012]}},{"label":"柱状图","type":"sparkline","attributes":{"value":{"label":"数值","value":"3,1,4,5,7,2","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none"},{"label":"读数","value":"value"}]}},"title":{"label":"标题","value":"(模拟数据)","type":"standardInput","data":{"value":"kpi","option":[{"label":"不绑定数据","value":"none"},{"label":"指标","value":"kpi"},{"label":"设备","value":"resource"},{"label":"设备 + 指标","value":"resourcekpi"}]}},"color":{"label":"字体颜色","value":"#fff","type":"colorPicker"},"timespan":{"label":"时间段","value":168,"type":"slider","min":0,"max":1000,"unit":"小时"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[100005]}}]}],"attributes":{"bgcolor":{"label":"背景色","value":"##00b9b2","type":"colorPicker"},"bordercolor":{"label":"边框颜色","value":"#93C47D","type":"colorPicker"},"borderwidth":{"label":"边框颜色","value":0,"min":0,"max":10,"type":"slider"}}}]}],"class":"box-body"},{"type":"box-footer","children":[{"type":"row","children":[]}],"class":"box-footer"}]},{"type":"box","class":"box box-info","attributes":{"text":{"label":"标题文字","value":"工单列表","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":18,"type":"slider"},"position":{"label":"对齐","value":"left","type":"select","option":[{"label":"左对齐","value":"left"},{"label":"中间对齐","value":"center"},{"label":"右对齐","value":"right"}]},"weight":{"label":"粗细","value":"bold","type":"select","option":[{"label":"正常","value":"normal"},{"label":"粗体","value":"bold"}]}},"children":[{"type":"box-body","children":[{"type":"column","col":12,"children":[{"label":"工单列表","type":"listtwo","attributes":{"fun":"ticketService.getTicketsByStatus"}}]}],"class":"box-body"},{"type":"box-footer","children":[{"type":"column","col":12,"children":[{"label":"文字编辑","type":"text","attributes":{"text":{"label":"文字","value":"查看更多","type":"standardInput"},"link":{"label":"链接地址","value":"../app-oc/index.html#/workOrder/1","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":14,"type":"slider"},"position":{"label":"对齐","value":"right","type":"select","option":[{"label":"左对齐","value":"left"},{"label":"中间对齐","value":"center"},{"label":"右对齐","value":"right"}]},"weight":{"label":"粗细","value":"normal","type":"select","option":[{"label":"正常","value":"normal"},{"label":"粗体","value":"bold"}]}}}]}],"class":"box-footer"}]}],"col":8,"$$hashKey":"object:58"},{"type":"column","children":[{"type":"box","class":"box box-info","attributes":{"text":{"label":"标题文字","value":"告警趋势","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":18,"type":"slider"},"position":{"label":"对齐","value":"left","type":"select","option":[{"label":"左对齐","value":"left"},{"label":"中间对齐","value":"center"},{"label":"右对齐","value":"right"}]},"weight":{"label":"粗细","value":"bold","type":"select","option":[{"label":"正常","value":"normal"},{"label":"粗体","value":"bold"}]}},"children":[{"type":"box-body","children":[{"type":"column","col":12,"children":[{"label":"饼图","type":"piechart","attributes":{"title":{"label":"主标题","value":"告警趋势图","type":"standardInput"},"subtitle":{"label":"副标题","value":"","type":"standardInput"},"dataType":{"label":"数据类型","value":"alert","type":"select","option":[{"label":"告警","value":"alert"},{"label":"指标","value":"kpi"}]},"value":{"label":"数值","value":"6,5,10,2","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none"},{"label":"读数","value":"value"}]}},"legend":{"label":"数值","value":"设备A, 设备B, 设备C, 设备D","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none"},{"label":"读数","value":"value"}]}}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"timeSpan":3600}}]}],"class":"box-body"},{"type":"box-footer","children":[{"type":"column","col":12,"children":[{"type":"alertcount","children":[]}]}],"class":"box-footer"}]},{"type":"box","class":"box box-info","attributes":{"text":{"label":"标题文字","value":"最新上线设备","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":18,"type":"slider"},"position":{"label":"对齐","value":"left","type":"select","option":[{"label":"左对齐","value":"left"},{"label":"中间对齐","value":"center"},{"label":"右对齐","value":"right"}]},"weight":{"label":"粗细","value":"bold","type":"select","option":[{"label":"正常","value":"normal"},{"label":"粗体","value":"bold"}]}},"children":[{"type":"box-body","children":[{"type":"column","col":12,"children":[{"label":"最新上线设备","type":"listone","attributes":{"fun":"resourceUIService.getLatestDevices"}}]}],"class":"box-body"},{"type":"box-footer","children":[{"type":"row","col":12,"children":[{"label":"文字编辑","type":"text","attributes":{"text":{"label":"文字","value":"查看更多","type":"standardInput"},"link":{"label":"链接地址","value":"../app-oc/index.html#/resource","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":14,"type":"slider"},"position":{"label":"对齐","value":"right","type":"select","option":[{"label":"左对齐","value":"left"},{"label":"中间对齐","value":"center"},{"label":"右对齐","value":"right"}]},"weight":{"label":"粗细","value":"normal","type":"select","option":[{"label":"正常","value":"normal"},{"label":"粗体","value":"bold"}]}}}]}],"class":"box-footer"}]}],"col":4,"$$hashKey":"object:59"}]}],"col":12}});

  values.value("machineDashboard", {"version":"V_2","data":{"type":"column","children":[{"type":"row","children":[{"type":"column","children":[{"type":"row","children":[{"type":"column","children":[{"label":"数据统计标签","type":"totalItem","attributes":{"title":{"label":"主标题","value":"10米(模拟数据)","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:110"},{"label":"读数(单位) ","value":"value","$$hashKey":"object:111"}]}},"subtitle":{"label":"副标题","value":"模拟数据","type":"standardInput","data":{"value":"kpi","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:120"},{"label":"指标名称","value":"kpi","$$hashKey":"object:121"},{"label":"设备名称","value":"resource","$$hashKey":"object:122"},{"label":"设备 + 指标名称","value":"resourcekpi","$$hashKey":"object:123"}]}},"link":{"label":"链接地址","value":"../app-oc/index.html#/resource","type":"standardInput"},"color":{"label":"颜色","value":"rgb(204, 0, 0)","type":"colorPicker"},"icon":{"label":"图标","value":"ps-number","type":"iconPicker"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3001]}}],"col":4,"$$hashKey":"object:69"},{"type":"column","children":[{"label":"数据统计标签","type":"totalItem","attributes":{"title":{"label":"主标题","value":"10米(模拟数据)","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:353"},{"label":"读数(单位) ","value":"value","$$hashKey":"object:354"}]}},"subtitle":{"label":"副标题","value":"模拟数据","type":"standardInput","data":{"value":"kpi","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:363"},{"label":"指标名称","value":"kpi","$$hashKey":"object:364"},{"label":"设备名称","value":"resource","$$hashKey":"object:365"},{"label":"设备 + 指标名称","value":"resourcekpi","$$hashKey":"object:366"}]}},"link":{"label":"链接地址","value":"../app-oc/index.html#/emcsView","type":"standardInput"},"color":{"label":"颜色","value":"rgb(61, 133, 198)","type":"colorPicker"},"icon":{"label":"图标","value":"ps-electric_motor","type":"iconPicker"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3236]}}],"col":4,"$$hashKey":"object:70"},{"type":"column","children":[{"label":"数据统计标签","type":"totalItem","attributes":{"title":{"label":"主标题","value":"10米(模拟数据)","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:565"},{"label":"读数(单位) ","value":"value","$$hashKey":"object:566"}]}},"subtitle":{"label":"副标题","value":"模拟数据","type":"standardInput","data":{"value":"kpi","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:575"},{"label":"指标名称","value":"kpi","$$hashKey":"object:576"},{"label":"设备名称","value":"resource","$$hashKey":"object:577"},{"label":"设备 + 指标名称","value":"resourcekpi","$$hashKey":"object:578"}]}},"link":{"label":"链接地址","value":"../app-oc/index.html#/configAlertByStatus","type":"standardInput"},"color":{"label":"颜色","value":"rgb(106, 168, 79)","type":"colorPicker"},"icon":{"label":"图标","value":"ps-duration","type":"iconPicker"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3003]}}],"col":4,"$$hashKey":"object:71"}]}],"col":7,"$$hashKey":"object:63"},{"type":"column","children":[{"type":"row","children":[{"type":"column","children":[{"label":"数据统计标签","type":"totalItem","attributes":{"title":{"label":"主标题","value":"10米(模拟数据)","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:777"},{"label":"读数(单位) ","value":"value","$$hashKey":"object:778"}]}},"subtitle":{"label":"副标题","value":"模拟数据","type":"standardInput","data":{"value":"kpi","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:787"},{"label":"指标名称","value":"kpi","$$hashKey":"object:788"},{"label":"设备名称","value":"resource","$$hashKey":"object:789"},{"label":"设备 + 指标名称","value":"resourcekpi","$$hashKey":"object:790"}]}},"link":{"label":"链接地址","value":"../app-oc/index.html#/workorderrecord","type":"standardInput"},"color":{"label":"颜色","value":"rgb(230, 145, 56)","type":"colorPicker"},"icon":{"label":"图标","value":"ps-task","type":"iconPicker"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3004]}}],"col":6,"$$hashKey":"object:78"},{"type":"column","children":[{"label":"数据统计标签","type":"totalItem","attributes":{"title":{"label":"主标题","value":"10米(模拟数据)","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:1462"},{"label":"读数(单位) ","value":"value","$$hashKey":"object:1463"}]}},"subtitle":{"label":"副标题","value":"模拟数据","type":"standardInput","data":{"value":"kpi","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:1472"},{"label":"指标名称","value":"kpi","$$hashKey":"object:1473"},{"label":"设备名称","value":"resource","$$hashKey":"object:1474"},{"label":"设备 + 指标名称","value":"resourcekpi","$$hashKey":"object:1475"}]}},"link":{"label":"链接地址","value":"../app-oc/index.html#/emcsView","type":"standardInput"},"color":{"label":"颜色","value":"rgb(241, 194, 50)","type":"colorPicker"},"icon":{"label":"图标","value":"ps-current_production_p","type":"iconPicker"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[3237]}}],"col":6,"$$hashKey":"object:79"}]}],"col":5,"$$hashKey":"object:64"}]},{"type":"row","children":[{"type":"column","children":[{"type":"box","class":"box box-info","attributes":{"text":{"label":"标题文字","value":"最近一周日产量情况","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":18,"type":"slider"},"position":{"label":"对齐","value":"center","type":"select","option":[{"label":"左对齐","value":"left","$$hashKey":"object:102"},{"label":"中间对齐","value":"center","$$hashKey":"object:103"},{"label":"右对齐","value":"right","$$hashKey":"object:104"}]},"weight":{"label":"粗细","value":"bold","type":"select","option":[{"label":"正常","value":"normal","$$hashKey":"object:108"},{"label":"粗体","value":"bold","$$hashKey":"object:109"}]}},"children":[{"type":"box-body","children":[{"type":"column","col":12,"children":[{"label":"线图","type":"linechart","attributes":{"value":{"label":"数值","value":"22,10,5,10,4,8,3","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:146"},{"label":"读数","value":"value","$$hashKey":"object:147"}]}},"xAxis":{"label":"X轴","value":"2016/6/1,2016/6/2,2016/6/3,2016/6/4,2016/6/5,2016/6/6,2016/6/7","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:156"},{"label":"读数","value":"value","$$hashKey":"object:157"}]}},"timespan":{"label":"时间段","value":168,"type":"slider","min":0,"max":1000,"unit":"小时"},"format":{"label":"时间模式","value":"月日","type":"select","option":[{"label":"年月日","value":"年月日","$$hashKey":"object:169"},{"label":"年月日时分","value":"年月日时分","$$hashKey":"object:170"},{"label":"年月日时分秒","value":"年月日时分秒","$$hashKey":"object:171"},{"label":"月日","value":"月日","$$hashKey":"object:172"},{"label":"时分","value":"时分","$$hashKey":"object:173"},{"label":"时分秒","value":"时分秒","$$hashKey":"object:174"}]},"max":{"label":"Y轴最大值","value":0,"type":"slider","unit":""},"min":{"label":"Y轴最小值","value":0,"type":"slider","unit":""},"color":{"label":"颜色","value":"rgb(204, 0, 0)","type":"colorPicker"},"showxAxis":{"label":"显示X轴坐标","value":true,"type":"select","option":[{"label":"显示","value":true,"$$hashKey":"object:198"},{"label":"隐藏","value":false,"$$hashKey":"object:199"}]},"showyAxis":{"label":"显示Y轴坐标","value":true,"type":"select","option":[{"label":"显示","value":true,"$$hashKey":"object:203"},{"label":"隐藏","value":false,"$$hashKey":"object:204"}]},"fillType":{"label":"填充模式","value":"area","type":"select","option":[{"label":"线性填充","value":"line","$$hashKey":"object:208"},{"label":"面积填充","value":"area","$$hashKey":"object:209"}]}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"timeSpan":3600,"kpi":[3239]}}]}],"class":"box-body"},{"type":"box-footer","children":[{"type":"column","col":12,"children":[]}],"class":"box-footer"}]}],"col":4,"$$hashKey":"object:57"},{"type":"column","children":[{"type":"box","class":"box box-info","attributes":{"text":{"label":"标题文字","value":"最近一周开机总时长","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":18,"type":"slider"},"position":{"label":"对齐","value":"center","type":"select","option":[{"label":"左对齐","value":"left","$$hashKey":"object:1051"},{"label":"中间对齐","value":"center","$$hashKey":"object:1052"},{"label":"右对齐","value":"right","$$hashKey":"object:1053"}]},"weight":{"label":"粗细","value":"bold","type":"select","option":[{"label":"正常","value":"normal","$$hashKey":"object:1057"},{"label":"粗体","value":"bold","$$hashKey":"object:1058"}]}},"children":[{"type":"box-body","children":[{"type":"column","col":12,"children":[{"label":"线图","type":"linechart","attributes":{"value":{"label":"数值","value":"22,10,5,10,4,8,3","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:330"},{"label":"读数","value":"value","$$hashKey":"object:331"}]}},"xAxis":{"label":"X轴","value":"2016/6/1,2016/6/2,2016/6/3,2016/6/4,2016/6/5,2016/6/6,2016/6/7","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:340"},{"label":"读数","value":"value","$$hashKey":"object:341"}]}},"timespan":{"label":"时间段","value":168,"type":"slider","min":0,"max":1000,"unit":"小时"},"format":{"label":"时间模式","value":"年月日","type":"select","option":[{"label":"年月日","value":"年月日","$$hashKey":"object:353"},{"label":"年月日时分","value":"年月日时分","$$hashKey":"object:354"},{"label":"年月日时分秒","value":"年月日时分秒","$$hashKey":"object:355"},{"label":"月日","value":"月日","$$hashKey":"object:356"},{"label":"时分","value":"时分","$$hashKey":"object:357"},{"label":"时分秒","value":"时分秒","$$hashKey":"object:358"}]},"max":{"label":"Y轴最大值","value":0,"type":"slider","unit":""},"min":{"label":"Y轴最小值","value":0,"type":"slider","unit":""},"color":{"label":"颜色","value":"rgb(106, 168, 79)","type":"colorPicker"},"showxAxis":{"label":"显示X轴坐标","value":true,"type":"select","option":[{"label":"显示","value":true,"$$hashKey":"object:382"},{"label":"隐藏","value":false,"$$hashKey":"object:383"}]},"showyAxis":{"label":"显示Y轴坐标","value":true,"type":"select","option":[{"label":"显示","value":true,"$$hashKey":"object:387"},{"label":"隐藏","value":false,"$$hashKey":"object:388"}]},"fillType":{"label":"填充模式","value":"area","type":"select","option":[{"label":"线性填充","value":"line","$$hashKey":"object:392"},{"label":"面积填充","value":"area","$$hashKey":"object:393"}]}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"timeSpan":3600,"kpi":[3238]}}]}],"class":"box-body"},{"type":"box-footer","children":[{"type":"column","col":12,"children":[]}],"class":"box-footer"}]}],"col":4,"$$hashKey":"object:58"},{"type":"column","children":[{"type":"box","class":"box box-info","attributes":{"text":{"label":"标题文字","value":"最近一周告警情况","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":18,"type":"slider"},"position":{"label":"对齐","value":"center","type":"select","option":[{"label":"左对齐","value":"left","$$hashKey":"object:1095"},{"label":"中间对齐","value":"center","$$hashKey":"object:1096"},{"label":"右对齐","value":"right","$$hashKey":"object:1097"}]},"weight":{"label":"粗细","value":"bold","type":"select","option":[{"label":"正常","value":"normal","$$hashKey":"object:1101"},{"label":"粗体","value":"bold","$$hashKey":"object:1102"}]}},"children":[{"type":"box-body","children":[{"type":"column","col":12,"children":[{"label":"线图","type":"linechart","attributes":{"value":{"label":"数值","value":"22,10,5,10,4,8,3","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:430"},{"label":"读数","value":"value","$$hashKey":"object:431"}]}},"xAxis":{"label":"X轴","value":"2016/6/1,2016/6/2,2016/6/3,2016/6/4,2016/6/5,2016/6/6,2016/6/7","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none","$$hashKey":"object:440"},{"label":"读数","value":"value","$$hashKey":"object:441"}]}},"timespan":{"label":"时间段","value":168,"type":"slider","min":0,"max":1000,"unit":"小时"},"format":{"label":"时间模式","value":"年月日","type":"select","option":[{"label":"年月日","value":"年月日","$$hashKey":"object:453"},{"label":"年月日时分","value":"年月日时分","$$hashKey":"object:454"},{"label":"年月日时分秒","value":"年月日时分秒","$$hashKey":"object:455"},{"label":"月日","value":"月日","$$hashKey":"object:456"},{"label":"时分","value":"时分","$$hashKey":"object:457"},{"label":"时分秒","value":"时分秒","$$hashKey":"object:458"}]},"max":{"label":"Y轴最大值","value":0,"type":"slider","unit":""},"min":{"label":"Y轴最小值","value":0,"type":"slider","unit":""},"color":{"label":"颜色","value":"rgb(255, 217, 102)","type":"colorPicker"},"showxAxis":{"label":"显示X轴坐标","value":true,"type":"select","option":[{"label":"显示","value":true,"$$hashKey":"object:482"},{"label":"隐藏","value":false,"$$hashKey":"object:483"}]},"showyAxis":{"label":"显示Y轴坐标","value":true,"type":"select","option":[{"label":"显示","value":true,"$$hashKey":"object:487"},{"label":"隐藏","value":false,"$$hashKey":"object:488"}]},"fillType":{"label":"填充模式","value":"area","type":"select","option":[{"label":"线性填充","value":"line","$$hashKey":"object:492"},{"label":"面积填充","value":"area","$$hashKey":"object:493"}]}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"timeSpan":3600,"kpi":[3006]}}]}],"class":"box-body"},{"type":"box-footer","children":[{"type":"column","col":12,"children":[]}],"class":"box-footer"}]}],"col":4,"$$hashKey":"object:59"}]},{"type":"row","children":[{"type":"column","children":[{"type":"box","class":"box box-info","attributes":{"text":{"label":"标题文字","value":"告警趋势","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":18,"type":"slider"},"position":{"label":"对齐","value":"left","type":"select","option":[{"label":"左对齐","value":"left"},{"label":"中间对齐","value":"center"},{"label":"右对齐","value":"right"}]},"weight":{"label":"粗细","value":"bold","type":"select","option":[{"label":"正常","value":"normal"},{"label":"粗体","value":"bold"}]}},"children":[{"type":"box-body","children":[{"type":"column","col":12,"children":[{"label":"饼图","type":"piechart","attributes":{"title":{"label":"主标题","value":"告警趋势图","type":"standardInput"},"subtitle":{"label":"副标题","value":"","type":"standardInput"},"dataType":{"label":"数据类型","value":"alert","type":"select","option":[{"label":"告警","value":"alert"},{"label":"指标","value":"kpi"}]},"value":{"label":"数值","value":"6,5,10,2","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none"},{"label":"读数","value":"value"}]}},"legend":{"label":"数值","value":"设备A, 设备B, 设备C, 设备D","type":"standardInput","data":{"value":"value","option":[{"label":"不绑定数据","value":"none"},{"label":"读数","value":"value"}]}}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"timeSpan":3600}}]}],"class":"box-body"},{"type":"box-footer","children":[{"type":"column","col":12,"children":[{"type":"alertcount","children":[]}]}],"class":"box-footer"}]}],"col":8,"$$hashKey":"object:63"},{"type":"column","children":[{"type":"box","class":"box box-info","attributes":{"text":{"label":"标题文字","value":"工单，告警","type":"standardInput"},"color":{"label":"颜色","value":"#333","type":"colorPicker"},"fontSize":{"label":"字体大小","value":18,"type":"slider"},"position":{"label":"对齐","value":"left","type":"select","option":[{"label":"左对齐","value":"left","$$hashKey":"object:419"},{"label":"中间对齐","value":"center","$$hashKey":"object:420"},{"label":"右对齐","value":"right","$$hashKey":"object:421"}]},"weight":{"label":"粗细","value":"bold","type":"select","option":[{"label":"正常","value":"normal","$$hashKey":"object:425"},{"label":"粗体","value":"bold","$$hashKey":"object:426"}]}},"children":[{"class":"box-body","type":"box-body","children":[{"type":"column","col":12,"children":[{"label":"百分比状态条","type":"progress","attributes":{"value":{"label":"数值","value":20,"type":"slider","data":{"value":"value","option":[{"label":"不绑定数据","value":"none"},{"label":"读数(单位) ","value":"value"}]}},"description":{"label":"数值","value":"(模拟数据)","type":"standardInput"},"padding":{"label":"边距","value":5,"type":"slider"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[100002]}},{"label":"百分比状态条","type":"progress","attributes":{"value":{"label":"数值","value":20,"type":"slider","data":{"value":"value","option":[{"label":"不绑定数据","value":"none"},{"label":"读数(单位) ","value":"value"}]}},"description":{"label":"数值","value":"(模拟数据)","type":"standardInput"},"padding":{"label":"边距","value":5,"type":"slider"}},"data":{"model":{"id":204},"resource":["rootCi"],"modelDisable":true,"maxKpi":1,"kpi":[100004]}}]}]},{"class":"box-footer","type":"box-footer","children":[{"type":"column","col":12,"children":[]}]}]}],"col":4,"$$hashKey":"object:64"}]}],"col":12}});
});