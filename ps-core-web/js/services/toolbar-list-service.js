define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('toolbarListService', ['$timeout', function(timeout) {
    var factory = [{
      label: "组件",
      type: "folder",
      $CLASS: "folder",
      sub: [{
        label: "常用组件",
        type: "folder",
        $CLASS: "folder",
        sub: [{
          label: "文字",
          type: "text",
          render: "text",
          $CLASS: "item",
          message : "文字组件"
        }, {
          label: "图片",
          type: "image",
          render: "text",
          $CLASS: "item",
          message : "引入定制图片"
        }, {
          label: "控制板1",
          type: "block",
          render: "text",
          $CLASS: "item",
          message : "不带样式的控制版"
        }, {
          label: "控制板2",
          type: "box",
          render: "text",
          $CLASS: "item",
          message : "普通控制版"
        }, {
          label: "TAB",
          type: "tab",
          render: "text",
          $CLASS: "item",
          message : "标签"
        }, {
          label: "表格",
          type: "excel",
          render: "text",
          $CLASS: "item",
          message : "excel表格"
        }, {
          label: "列表",
          type: "dataTable",
          render: "text",
          $CLASS: "item",
          message : "dataTable表格"
        }, {
            label: "滑动条",
            type: "scrollbar",
            render: "text",
            $CLASS: "item",
            message : "滑动条"
        }, {
          label: "迷你柱图",
          type: "sparkline",
          render: "text",
          $CLASS: "item",
          message : "简化版的柱状图"
        }, {
          label: "表单",
          type: "kpilist",
          render: "text",
          $CLASS: "item",
          message : "FORM表单"
        }, {
          label: "选择器",
          type: "multiselect",
          render: "text",
          $CLASS: "item",
          message : "多项和单项选择器"
        }, {
          label: "时间选择器",
          type: "timeselector",
          render: "text",
          $CLASS: "item",
          message : "时间选择器"
        }, {
          label: "输入框",
          type: "inputBox",
          render: "text",
          $CLASS: "item",
          message : "文字输入框"
        }, {
          label: "按钮",
          type: "button",
          render: "text",
          $CLASS: "item",
          message : "按钮编辑"
        }, {
          label: "嵌入视频",
          type: "video",
          render: "text",
          $CLASS: "item",
          message : "嵌入youku视频"
        }, {
          label: "IFRAME",
          type: "iframe",
          render: "text",
          $CLASS: "item",
          message : "IFRAME框架"
        }]
      }, {
        label: "功能组件",
        type: "folder",
        $CLASS: "folder",
        sub: [{
          label: "天气信息",
          type: "weather",
          render: "text",
          $CLASS: "item",
          message : "天气信息"
        }, {
          label: "时间信息",
          type: "timeinfo",
          render: "bgimage",
          $CLASS: "item"
        }, {
          label: "代码编辑器",
          type: "aceeditor",
          render: "bgimage",
          $CLASS: "item"
        }, {
          label: "时间轴",
          type: "history",
          render: "bgimage",
          $CLASS: "item"
        }]
      },{
        label: "视图组件",
        type: "folder",
        $CLASS: "folder",
        sub: [{
          label: "线图",
          type: "linechart",
          render: "bgimage",
          $CLASS: "item"
        }, {
          label: "饼图",
          type: "piechart",
          render: "bgimage",
          $CLASS: "item"
        }, {
          label: "柱图",
          type: "barchart",
          render: "bgimage",
          $CLASS: "item"
        }, {
          label: "仪表盘",
          type: "gaugechart",
          render: "bgimage",
          $CLASS: "item"
        }]
      }, {
        label: "高级组件",
        type: "folder",
        $CLASS: "folder",
        sub: [{
          label: "百度地图",
          type: "baidumap",
          render: "text",
          $CLASS: "item",
          message : "基于百度地图的扩展"
        }, {
          label: "视图嵌入",
          type: "injector",
          render: "text",
          $CLASS: "item",
          message : "通过参数动态嵌入视图"
        }, {
          label: "轮播组件",
          type: "slick",
          render: "text",
          $CLASS: "item",
          message : "轮播组件"
        }, {
          label: "高级图表",
          type: "sankeychart",
          render: "text",
          $CLASS: "item",
          message : "高级图表组件"
        }, {
          label: "Echart图",
          type: "advanceEchart",
          render: "text",
          $CLASS: "item",
          message : "标准的Echart图"
        },{
          label: "EchartGL图",
          type: "echartGallery",
          render: "text",
          $CLASS: "item",
          message: "标准的Echart-GL图"
        },{
          label: "显示隐藏",
          type: "tabshow",
          render: "text",
          $CLASS: "item",
          message : "显示隐藏"
        },{
          label: "三级目录",
          type: "treemenu2",
          render: "text",
          $CLASS: "item",
          message : "显示隐藏"
        },{
          label: "树结构目录",
          type: "treemenu",
          render: "text",
          $CLASS: "item",
          message : "显示隐藏"
        },{
          label: "数结构导航",
          type: "navitree",
          render: "text",
          $CLASS: "item",
          message : "数结构导航"
        },{
          label: "输入框组",
          type: "ctrlgroup",
          render: "text",
          $CLASS: "item",
          message : "输入框组"
        },{
          label: "立体图标",
          type: "svgchart",
          render: "text",
          $CLASS: "item",
          message : "立体图标"
        },{
          label: "高级列表",
          type: "dataTableAdvance",
          render: "text",
          $CLASS: "item",
          message : "高级列表"
        }, {
          label: "伪TAB样式",
          type: "faketab",
          render: "text",
          $CLASS: "item",
          message : "伪TAB样式"
        }, {
          label: "重复单元",
          type: "repeater",
          render: "text",
          $CLASS: "item",
          message : "自动生成重复的组件"
        }]
      }]
    }, {
      label: "功能模块",
      type: "folder",
      $CLASS: "folder",
      sub: [{
        label: "数据统计标签",
        type: "totalItem",
        render: "text",
        $CLASS: "item",
        message : "数据统计标签"
      }, {
        label: "百分比状态条",
        type: "progress",
        render: "text",
        $CLASS: "item",
        message : "百分比状态条"
      }, {
        label: "环比标签",
        type: "downtab",
        render: "text",
        $CLASS: "item",
        message : "环比标签"
      }/**, {
        label: "项目组态",
        type: "projecttopo",
        render: "text",
        $CLASS: "item",
        message : "绑定在项目上的组态视图"
      }*/, {
        label: "设备（列表）",
        type: "listone",
        render: "bgimage",
        $CLASS: "item",
        message : "最新上线设备列表",
        url : "../app-freeboard/images/listone.jpg"
      }, {
        label: "工单（列表）",
        type: "listtwo",
        render: "bgimage",
        $CLASS: "item",
        message : "最近工单列表列表",
        url:"../app-freeboard/images/listtwo.jpg"
      }, {
        label: "告警（列表）",
        type: "listthree",
        render: "text",
        $CLASS: "item",
        message : "告警列表"
      }/**, {
        label: "线图模板",
        type: "linechartTemp",
        render: "bgimage",
        $CLASS: "item",
        message : "线图模板",
        url : "../../app-freeboard/images/linechartTemp.jpg"
      }, {
        label: "告警分布",
        type: "piechartTemp",
        render: "bgimage",
        $CLASS: "item",
        message : "告警分布饼图",
        url : "../../app-freeboard/images/piechartTemp.png"
      }, {
        label: "设备分布",
        type: "device",
        render: "bgimage",
        $CLASS: "item",
        message : "设备分布地图",
        url : "../../app-freeboard/images/device.png"
      }, {
        label: "地图分布",
        type: "mapchartDist",
        render: "text",
        $CLASS: "item",
        message : "按地图分布"
      }, {
        label: "设备地图列表",
        type: "mapchartLinkTemp",
        render: "bgimage",
        $CLASS: "item",
        message : "设备按地图分布",
        url : "../../app-freeboard/images/mapchart.jpg"
      }, {
        label: "最近一周告警",
        type: "warningMapTemp",
        render: "bgimage",
        $CLASS: "item",
        message : "周告警统计",
        url : "../../app-freeboard/images/warnning.jpg"
      }*/]
    }, /**{
      label: "服务模块",
      type: "folder",
      $CLASS: "folder",
      sub: [{
        label: "区域设备列表",
        type: "resourcelist",
        render: "text",
        $CLASS: "item"
      }, {
        label: "数据列表",
        type: "datalist",
        render: "text",
        $CLASS: "item"
      }]
    }, */{
      label: "导入视图",
      type: "folder",
      $CLASS: "folder",
      sub: [{
        label: "仪表板",
        type: "folder",
        $CLASS: "folder",
        sub: []
      }, {
        label: "组态视图",
        type: "folder",
        $CLASS: "folder",
        sub: []
      }, {
        label: "分析视图",
        type: "folder",
        $CLASS: "folder",
        sub: []
      }]
    }];
    for (var i in factory) {
      factory[i].id = i;
    }
    return factory;
  }]);
});
