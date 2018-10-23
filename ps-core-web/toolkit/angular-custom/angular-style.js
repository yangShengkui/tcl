(function(window, angular, undefined) {
  'use strict';
  var source = {
    "legend" : {
      "label" : "图例",
      "value" : "function(source){\
          return ['第一组', '第二组']\
      }"
    },
    "xAxis" : {
      "label" : "X轴横坐标",
      "value" : "function(source){\
          return ['第一','第二','第三','第四','第五','第六']\
      }"
    },
    "series" : {
      "label" : "视图数据",
      "value" : "function(source){return [{\
          data : [1,2,3,4,5,6]\
      }]}"
    }
  };
  var parameters = {
    "text" : {
      "label" : "文字",
      "value" : "新建文字",
      "placeholder" : "请填写文字",
      "type" : "input"
    },
    "cgroupstyle" : {
      "label" : "空间组样式",
      "value" : "新建文字",
      "type" : "select-single",
      "options" : [{
        "label" : "横排对齐",
        "value" : "bootstrap"
      },{
        "label" : "竖排对齐",
        "value" : "table"
      }]
    },
    "theme" : {
      "label" : "颜色主题",
      "value" : "default",
      "placeholder" : "请填写文字",
      "type" : "select-single",
      "options" : [{
        "label" : "根据场景自动选择",
        "value" : "auto"
      },{
        "label" : "默认",
        "value" : "default"
      },{
        "label" : "黑色",
        "value" : "dark"
      },{
        "label" : "马卡龙",
        "value" : "macarons"
      }]
    },
    "mapStyle" : {
      "label" : "地图样式",
      "value" : "[]",
      "type" : "code"
    },
    "currentTab" : {
      "label" : "标签位置",
      "value" : 0,
      "placeholder" : "TAB序列号",
      "type" : "input"
    },
    "city" : {
      "label" : "城市名称",
      "value" : "",
      "placeholder" : "请填写城市名字",
      "type" : "input"
    },
    "col" : {
      "label" : "列数",
      "value" : 1,
      "type" : "select-single",
      "options" : [{
        "label" : "一列",
        "value" : 1
      },{
        "label" : "二列",
        "value" : 2
      },{
        "label" : "三列",
        "value" : 3
      },{
        "label" : "四列",
        "value" : 4
      },{
        "label" : "五列",
        "value" : 5
      },{
        "label" : "六列",
        "value" : 6
      },{
          "label" : "十二列",
          "value" : 12
      }]
    },
    "pageSize" : {
      "label" : "每页记录数",
      "value" : 10,
      "type" : "select-single",
      "options" : [{
        "label" : "每页5个",
        "value" : 5
      },{
        "label" : "每页10个",
        "value" : 10
      },{
        "label" : "每页25个",
        "value" : 25
      }]
    },
    "videotype" : {
      "label" : "视频类型",
      "value" : "video",
      "type" : "select-single",
      "options" : [
      {
        "label" : "本地视频",
        "value" : "video"
      },{
        "label" : "嵌入视频",
        "value" : "embed"
//    },{
//      "label" : "摄像头",
//      "value" : "camera"
      },{
        "label" : "监控视频",
        "value" : "live"
      }]
    },
    "username" : {
      "label" : "用户名",
      "value" : "用户名",
      "placeholder" : "请填写文字",
      "type" : "input"
    },
    "password" : {
      "label" : "密码",
      "value" : "密码",
      "placeholder" : "请填写文字",
      "type" : "input"
    },
    "autostart" : {
      "label" : "自动播放",
      "value" : true,
      "type" : "boolean"
    },
    "url" : {
      "label" : "视频地址",
      "value" : "",
      "placeholder" : "请填写嵌入视频地址",
      "type" : "input"
    },
    "alignment" : {
      "label" : "排列方式",
      "value" : "bootstrap",
      "type" : "select-single",
      "options" : [{
        "label" : "bootstrap方式",
        "value" : "bootstrap"
      },{
        "label" : "流式",
        "value" : "float"
      }]
    },
    "align" : {
      "label" : "排列方式",
      "value" : "horizental",
      "type" : "select",
      "options" : [{
        "label" : "水平排列",
        "value" : "horizental"
      },{
        "label" : "垂直排列",
        "value" : "vertical"
      }]
    },
    "webSocket" : {
      "label" : "实时数据",
      "value" : true,
      "type" : "boolean"
    },
    "excelData" : {
      "label" : "表内容",
      "type" : "excel",
      "value" : [
        ["标题1", "标题2", "标题3", "标题4", "标题5"],
        ["12", "14", "10", "51", "5"],
        ["9", "53", "14", "12", "16"],
        ["16", "3", "4", "7", "12"]
      ]
    },
    "icon" : {
      "label" : "图标",
      "value" : "#fff",
      "type" : "iconSelector"
    },
    "fontcolor" : {
      "label" : "字体色",
      "value" : "#fff",
      "type" : "colorPicker"
    },
    "bgcolor" : {
      "label" : "背景色",
      "value" : "#fff",
      "type" : "colorPicker"
    },
    "barcolor" : {
      "label" : "柱颜色",
      "value" : "#fff",
      "type" : "colorPicker"
    },
    "type" : {
      "label" : "类型",
      "value" : 1,
      "type" : "select",
      "options": [{
        "label": "第一个",
        "value": 1
      },{
        "label": "第二个",
        "value": 2
      }]
    },
    "imgSrc" : {
      "label" : "选择图片",
      "value" : "../images/machine/machine2.png",
      "type" : "selectImage",
      "options": [{
        "label": "机械设备图",
        "value": "../images/machine/machine2.png"
      },{
        "label": "水泵图1",
        "value": "../images/ksb/CHT.jpg"
      },{
        "label": "水泵图2",
        "value": "../images/ksb/HG.jpg"
      },{
        "label": "水泵图3",
        "value": "../images/ksb/LUV.jpg"
      },{
        "label": "水泵图4",
        "value": "../images/ksb/NLT.jpg"
      },{
        "label": "水泵图5",
        "value": "../images/ksb/SEZ.jpg"
      },{
        "label": "水泵图6",
        "value": "../images/ksb/SQ.jpg"
      },{
        "label": "水泵图7",
        "value": "../images/ksb/YNK.jpg"
      },{
        "label": "积水器TOPO",
        "value": "../images/ksb/pic_hd.jpg"
      },{
        "label": "蒸发器",
        "value": "../images/ouke/evaporator.svg"
      },{
        "label": "压缩器",
        "value": "../images/ouke/compressor.svg"
      },{
        "label": "冷凝器",
        "value": "../images/ouke/condenser.svg"
      },{
        "label": "热交换器",
        "value": "../images/ouke/exchanger.svg"
      },{
        "label": "膨胀器",
        "value": "../images/ouke/extension.svg"
      },{
        "label": "运转皮带1",
        "value": "../images/shangmei/shangmei1.png"
      },{
        "label": "运转皮带2",
        "value": "../images/shangmei/shangmei2.png"
      },{
        "label": "宝钢",
        "value": "../images/baogang/baogang.jpg"
      },{
        "label": "宝钢产线",
        "value": "../images/baogang/prodline.png"
      },{
        "label": "康达",
        "value": "../images/kangda/kangda.jpeg"
      }]
    },
    "fileInput": {
      "label": "上传图片",
      "value": "",
      "type": "fileinput"
    },
    "title": {
      "label": "主标题",
      "value": "主标题",
      "placeholder": "填写附主标题文字",
      "type": "input"
    },
    "subtitle" : {
      "label" : "副标题",
      "value" : "副标题",
      "placeholder" : "填写副标题文字",
      "type" : "input"
    },
    "background" : {
      "label" : "类型",
      "value" : "../images/factory/workhouse1.png",
      "type" : "select",
      "options": [{
        "label": "水厂1",
        "value": "../images/factory/workhouse1.png"
      },{
        "label": "水厂2",
        "value": "../images/factory/workhouse2.png"
      }]
    },
    "colwidth" : {
      "label" : "每行列数",
      "value" : 2,
      "type" : "select-single",
      "options": [{
        "label": "1列",
        "value": 1
      },{
        "label": "2列",
        "value": 2
      },{
        "label": "3列",
        "value": 3
      },{
        "label": "4列",
        "value": 4
      },{
        "label": "6列",
        "value": 6
      }]
    },
    "listbottom" : {
      "label" : "尾部样式",
      "value" : 2,
      "type" : "select-single",
      "options": [{
        "label": "不显示",
        "value": "none"
      },{
        "label": "标准",
        "value": "standard"
      },{
        "label": "显示翻页和个数",
        "value": "pageAndTotal"
      },{
        "label": "只显示翻页",
        "value": "pageOnly"
      }]
    },
    "itemstyle" : {
      "label" : "表单样式",
      "value" : "normal",
      "type" : "select-single",
      "options": [{
        "label": "普通",
        "value": "normal"
      },{
        "label": "样式1",
        "value": "style1"
      },{
        "label": "样式2",
        "value": "style2"
      }]
    }
  };
  var stylesheet = {
    "color" : {
      "label" : "颜色",
      "value" : "",
      "placeholder" : "#fff",
      "type" : "colorPicker"
    },
    "width" : {
      "label" : "宽度",
      "value" : "auto",
      "placeholder" : "例如 100px或auto",
      "type" : "input"
    },
    "height" : {
      "label" : "高度",
      "value" : "auto",
      "placeholder" : "例如 100px或auto",
      "type" : "input"
    },
    "min-height" : {
      "label" : "最小高度",
      "value" : "auto",
      "placeholder" : "例如 100px或auto",
      "type" : "input"
    },
    "max-height" : {
      "label" : "最大高度",
      "value" : "auto",
      "placeholder" : "例如 100px或auto",
      "type" : "input"
    },
    "line-height" : {
      "label" : "行高",
      "value" : "auto",
      "placeholder" : "例如 12px",
      "type" : "input"
    },
    "border" : {
      "label" : "描边",
      "value" : "1px solid #eee",
      "placeholder" : "例如 1px solid #333",
      "type" : "input"
    },
    "border-width" : {
      "label" : "描边线宽",
      "value" : "1px",
      "placeholder" : "例如 1px solid #eee",
      "type" : "input"
    },
    "border-bottom" : {
      "label" : "底部描边",
      "value" : "1px solid #eee",
      "placeholder" : "例如 1px solid #eee",
      "type" : "input"
    },
    "border-left" : {
      "label" : "左侧描边",
      "value" : "1px solid #333",
      "placeholder" : "例如 1px solid #eee",
      "type" : "input"
    },
    "border-top" : {
      "label" : "顶部描边",
      "value" : "1px solid #eee",
      "placeholder" : "例如 1px solid #eee",
      "type" : "input"
    },
    "border-right" : {
      "label" : "右侧描边",
      "value" : "1px solid #eee",
      "placeholder" : "例如 1px solid #eee",
      "type" : "input"
    },
    "border-radius" : {
      "label" : "边角弧度",
      "value" : "0px",
      "placeholder" : "例如 2px",
      "type" : "input"
    },
    "box-shadow" : {
      "label" : "阴影",
      "value" : "1px 10px 1px 1px",
      "placeholder" : "1px 1px 10px 1px rgba(0,0,0,.3)",
      "type" : "input"
    },
    "margin" : {
      "label" : "边距",
      "value" : "auto",
      "placeholder" : "例如 10px 10px 10px 10px 或 auto 10px",
      "type" : "input"
    },
    "margin-top" : {
      "label" : "上边距",
      "value" : "auto",
      "placeholder" : "例如 10px或auto",
      "type" : "input"
    },
    "margin-right" : {
      "label" : "右边距",
      "value" : "auto",
      "placeholder" : "例如 10px或auto",
      "type" : "input"
    },
    "margin-bottom" : {
      "label" : "下边距",
      "value" : "auto",
      "placeholder" : "例如 10px或auto",
      "type" : "input"
    },
    "margin-left" : {
      "label" : "左边距",
      "value" : "auto",
      "placeholder" : "例如 10px或auto",
      "type" : "input"
    },
    "padding" : {
      "label" : "填充",
      "value" : "auto",
      "placeholder" : "例如 10px",
      "type" : "input"
    },
    "padding-top" : {
      "label" : "上填充",
      "value" : "auto",
      "placeholder" : "例如 10px",
      "type" : "input"
    },
    "padding-right" : {
      "label" : "右填充",
      "value" : "auto",
      "placeholder" : "例如 10px",
      "type" : "input"
    },
    "padding-bottom" : {
      "label" : "下填充",
      "value" : "auto",
      "placeholder" : "例如 10px",
      "type" : "input"
    },
    "padding-left" : {
      "label" : "左填充",
      "value" : "auto",
      "placeholder" : "例如 10px",
      "type" : "input"
    },
    "z-index" : {
      "label" : "深度",
      "value" : "1",
      "placeholder" : "6",
      "type" : "input"
    },
    "position" : {
      "label" : "定位",
      "value" : "relative",
      "placeholder" : "例如 10px",
      "type" : "select",
      "options" : [{
        "label" : "相对",
        "value" : 'relative'
      }, {
        "label" : "绝对",
        "value" : 'absolute'
      } ,{
        "label" : "静态",
        "value" : 'static'
      }],
    },
    "float" : {
      "label" : "浮动",
      "value" : "none",
      "type" : "select",
      "options" : [{
        "label" : "不浮动",
        "value" : 'none'
      }, {
        "label" : "左浮动",
        "value" : 'left'
      } ,{
        "label" : "右浮动",
        "value" : 'right'
      }],
    },
    "text-align" : {
      "label" : "字体对齐",
      "value" : "left",
      "type" : "select",
      "options" : [{
        "label" : "左对齐",
        "value" : 'left'
      }, {
        "label" : "中间对齐",
        "value" : 'center'
      } ,{
        "label" : "右对齐",
        "value" : 'right'
      }],
      "placeholder" : "例如: center, left"
    },
    "font-size" : {
      "label" : "字大小",
      "value" : "12px",
      "placeholder" : "例如 12px",
      "type" : "input"
    },
    "font-weight" : {
      "label" : "粗细",
      "value" : "normal",
      "type" : "select",
      "options" : [{
        "label" : "普通",
        "value" : 'normal'
      }, {
        "label" : "粗体",
        "value" : 'bold'
      }],
      "placeholder" : "normal,bold"
    },
    "white-space" : {
      "label" : "元素空白",
      "value" : "normal",
      "options" : [{
        "label" : "默认",
        "value" : 'normal'
      },{
        "label" : "保留空白",
        "value" : 'pre'
      },{
        "label" : "不换行",
        "value" : 'nowrap'
      }],
      "type" : "select"
    },
    "overflow" : {
      "label" : "超出部分",
      "value" : "auto",
      "options" : [{
        "label" : "自动",
        "value" : 'auto'
      },{
        "label" : "显示",
        "value" : 'visible'
      },{
        "label" : "隐藏",
        "value" : 'hidden'
      },{
        "label" : "滚动条",
        "value" : 'scroll'
      }],
      "type" : "select"
    },
    "overflow-x" : {
      "label" : "x超出部分",
      "value" : "auto",
      "options" : [{
        "label" : "自动",
        "value" : 'auto'
      },{
        "label" : "显示",
        "value" : 'visible'
      },{
        "label" : "隐藏",
        "value" : 'hidden'
      },{
        "label" : "滚动条",
        "value" : 'scroll'
      }],
      "type" : "select"
    },
    "overflow-y" : {
      "label" : "y超出部分",
      "value" : "auto",
      "options" : [{
        "label" : "自动",
        "value" : 'auto'
      },{
        "label" : "显示",
        "value" : 'visible'
      },{
        "label" : "隐藏",
        "value" : 'hidden'
      },{
        "label" : "滚动条",
        "value" : 'scroll'
      }],
      "type" : "select"
    },
    "font-family" : {
      "label" : "字形",
      "value" : "arial",
      "type" : "select",
      "options" : [{
        "label" : "arial",
        "value" : 'arial'
      }],
      "placeholder" : "例如 arial"
    },
    "background" : {
      "label" : "背景",
      "value" : "rgba(250,250,250,1)",
      "placeholder" : "例如 red",
      "type" : "input"
    },
    "background-color" : {
      "label" : "背景颜色",
      "value" : "",
      "placeholder" : "例如 red",
      "type" : "colorPicker"
    },
    "background-size" : {
        "label" : "背景大小",
        "value" : "",
        "placeholder" : "例如 auto",
        "type" : "input"
    },
    "background-repeat" : {
      "label" : "背景重复",
      "value" : "repeat",
      "options" : [{
        "label" : "重复",
        "value" : 'repeat'
      },{
        "label" : "重复-x轴",
        "value" : 'repeat-x'
      },{
        "label" : "重复-y轴",
        "value" : 'repeat-y'
      },{
        "label" : "不重复",
        "value" : 'no-repeat'
      },{
        "label" : "继承父级",
        "value" : 'inherit'
      }],
      "type" : "select"
    }
  };
  var echartBase = {
    general : {
      $name : "general",
      label : "全局",
      content : {
        "backgroundColor" : {
          label : "背景色",
          value : null,
          type : "colorPicker"
        },
        "animation" : {
          label : "动画",
          type : "boolean",
          value : true
        },
        "animationDuration" : {
          label : "初始动画的时长(mm)",
          value : 1000,
          type : "numberinput"
        }
      }
    },
    title : {
      $name : "title",
      label : "标题",
      content : {
        show : {
          label : "显示",
          type : "boolean",
          value : true
        },
        "textStyle/color" : {
          label : "主标题颜色",
          value : "#0089cd",
          type : "colorPicker"
        },
        "textStyle/fontStyle" : {
          label : "主标题风格",
          value : "normal",
          type : "select",
          options : [{
            label : "普通",
            value : "normal"
          },{
            label : "斜体",
            value : "italic"
          }]
        },
        // "textStyle/fontWeight" : {
        //   label : "主标题粗细",
        //   value : "normal",
        //   type : "select",
        //   options : [{
        //     label : "正常",
        //     value : "normal"
        //   },{
        //     label : "粗体",
        //     value : "bold"
        //   },{
        //     label : "超粗",
        //     value : "bolder"
        //   },{
        //     label : "细体",
        //     value : "lighter"
        //   }]
        // },
        "textStyle/fontSize" : {
          label : "主标题字号",
          value : 18,
          type : "numberinput"
        },
        // "textAlign" : {
        //   label : "水平对齐",
        //   value : "middle",
        //   type : "select",
        //   options : [{
        //     label : "左",
        //     value : "left"
        //   },{
        //     label : "中间",
        //     value : "middle"
        //   },{
        //     label : "右边",
        //     value : "right"
        //   }]
        // },
        // "textBaseline" : {
        //   label : "垂直对齐",
        //   value : "top",
        //   type : "select",
        //   options : [{
        //     label : "上",
        //     value : "top"
        //   },{
        //     label : "中",
        //     value : "middle"
        //   },{
        //     label : "下",
        //     value : "bottom"
        //   }]
        // },
        "subtextStyle/color" : {
          label : "副标题颜色",
          value : "#aaa",
          type : "colorPicker"
        },
        "subtextStyle/fontStyle" : {
          label : "副标题风格",
          value : "normal",
          type : "select",
          options : [{
            label : "普通",
            value : "normal"
          },{
            label : "斜体",
            value : "italic"
          }]
        },
        // "subtextStyle/fontWeight" : {
        //   label : "副标题粗细",
        //   value : "bolder",
        //   type : "select",
        //   options : [{
        //     label : "正常",
        //     value : "normal"
        //   },{
        //     label : "粗体",
        //     value : "bold"
        //   },{
        //     label : "超粗",
        //     value : "bolder"
        //   },{
        //     label : "细体",
        //     value : "lighter"
        //   }]
        // },
        "subtextStyle/fontSize" : {
          label : "副标题字号",
          value : 18,
          type : "numberinput"
        },
        "padding" : {
          label : "内边距",
          value : 5,
          type : "numberinput"
        },
        itemGap : {
          label : "标题间间距",
          value : 10,
          type : "numberinput"
        },
        "left" : {
          label : "左边距",
          value : "auto",
          type : "numberinput"
        },
        "top" : {
          label : "上边距",
          value : "auto",
          type : "numberinput"
        },
        "right" : {
          label : "右边距",
          value : "auto",
          type : "numberinput"
        },
        "bottom" : {
          label : "下边距",
          value : "auto",
          type : "numberinput"
        },
        "backgroundColor" : {
          label : "背景颜色",
          value : null,
          type : "colorPicker"
        },
        "shadowBlur" : {
          label : "阴影模糊",
          value : 0,
          type : "numberinput"
        },
        "shadowColor" : {
          label : "阴影颜色",
          value : null,
          type : "colorPicker"
        },
        "shadowOffsetX" : {
          label : "阴影水平偏移",
          value : 0,
          type : "numberinput"
        },
        "shadowOffsetY" : {
          label : "阴影垂直偏移",
          value : 0,
          type : "numberinput"
        }
      }
    },
    legend : {
      $name : "legend",
      label : "图例",
      content : {
        show : {
          label : "显示",
          type : "boolean",
          value : true
        },
        "left" : {
          label : "左边距",
          value : "auto",
          type : "numberinput"
        },
        "top" : {
          label : "上边距",
          value : "auto",
          type : "numberinput"
        },
        "right" : {
          label : "右边距",
          value : "auto",
          type : "numberinput"
        },
        "bottom" : {
          label : "下边距",
          value : "auto",
          type : "numberinput"
        },
        "width" : {
          label : "宽度",
          value : "auto",
          type : "numberinput"
        },
        "height" : {
          label : "高度",
          value : "auto",
          type : "numberinput"
        },
        "orient" : {
          label : "方向",
          value : "horizontal",
          type : "select",
          options : [{
            label : "水平",
            value : "horizontal"
          },{
            label : "垂直",
            value : "vertical"
          }]
        },
        "align" : {
          label : "对齐",
          value : "auto",
          type : "select",
          options : [{
            label : "自动",
            value : "auto"
          },{
            label : "左对齐",
            value : "left"
          },{
            label : "右对齐",
            value : "right"
          }]
        },
        "padding" : {
          label : "内边距",
          value : 5,
          type : "numberinput"
        },
        itemGap : {
          label : "标题间间距",
          value : 10,
          type : "numberinput"
        },
        itemWidth : {
          label : "图例标记宽度",
          value : 25,
          type : "numberinput"
        },
        itemHeight : {
          label : "图例标记高度",
          value : 14,
          type : "numberinput"
        },
        formatter : {
          label : "图例文本格式",
          value : "{a}",
          type : "code"
        },
        "textStyle/color" : {
          label : "文字颜色",
          value : "#333",
          type : "colorPicker"
        },
        "textStyle/fontStyle" : {
          label : "文字风格",
          value : "normal",
          type : "select",
          options : [{
            label : "普通",
            value : "normal"
          },{
            label : "斜体",
            value : "italic"
          }]
        },
        "textStyle/fontWeight" : {
          label : "文字粗细",
          value : "bolder",
          type : "select",
          options : [{
            label : "正常",
            value : "normal"
          },{
            label : "超粗",
            value : "bolder"
          },{
            label : "细体",
            value : "lighter"
          }]
        },
        "textStyle/fontSize" : {
          label : "文字大小",
          value : 12,
          type : "numberinput"
        },
        "backgroundColor" : {
          label : "背景颜色",
          value : null,
          type : "colorPicker"
        },
        "borderColor" : {
          label : "边框颜色",
          value : "#ccc",
          type : "colorPicker"
        },
        "borderWidth" : {
          label : "边框线宽",
          value : 0,
          type : "numberinput"
        },
        "shadowBlur" : {
          label : "阴影模糊",
          value : 0,
          type : "numberinput"
        },
        "shadowColor" : {
          label : "阴影颜色",
          value : null,
          type : "colorPicker"
        },
        "shadowOffsetX" : {
          label : "阴影水平偏移",
          value : 0,
          type : "numberinput"
        },
        "shadowOffsetY" : {
          label : "阴影垂直偏移",
          value : 0,
          type : "numberinput"
        }
      }
    },
    grid : {
      $name : "grid",
      label : "位置",
      options : {
        grid : {
          $name : "grid",
          label : "位置",
          content : {
            show : {
              label : "显示",
              type : "boolean",
              value : true
            },
            "left" : {
              label : "左边距",
              value : "auto",
              type : "input"
            },
            "top" : {
              label : "上边距",
              value : 60,
              type : "input"
            },
            "right" : {
              label : "右边距",
              value : "10%",
              type : "input"
            },
            "bottom" : {
              label : "下边距",
              value : "60",
              type : "input"
            },
            "width" : {
              label : "宽度",
              value : "auto",
              type : "numberinput"
            },
            "height" : {
              label : "高度",
              value : "auto",
              type : "numberinput"
            },
            "backgroundColor" : {
              label : "背景颜色",
              value : null,
              type : "colorPicker"
            },
            "borderColor" : {
              label : "边框颜色",
              value : "#ccc",
              type : "colorPicker"
            },
            "borderWidth" : {
              label : "边框线宽",
              value : 1,
              type : "numberinput"
            },
            "shadowBlur" : {
              label : "阴影模糊",
              value : 0,
              type : "numberinput"
            },
            "shadowColor" : {
              label : "阴影颜色",
              value : null,
              type : "colorPicker"
            },
            "shadowOffsetX" : {
              label : "阴影水平偏移",
              value : 0,
              type : "numberinput"
            },
            "shadowOffsetY" : {
              label : "阴影垂直偏移",
              value : 0,
              type : "numberinput"
            }
          }
        }
      }
    },
    xAxis : {
      $name : "xAxis",
      label : "X轴",
      options : {
        xAxis : {
          $name : "xAxis",
          label: "X轴",
          content: {
            name : {
              label : "坐标轴名称",
              value : "",
              type : "input"
            },
            gridIndex : {
              label : "轴线索引值",
              value : 0,
              type : "numberinput"
            },
            position : {
              label : "位置",
              value : "bottom",
              type : "select",
              options : [{
                label : "顶部",
                value : "top"
              },{
                label : "底部",
                value : "bottom"
              }]
            },
            offset : {
              label : "相对偏移量",
              value : 0,
              type : "numberinput"
            },
            type: {
              label: "类型",
              value: "category",
              type : "select",
              options : [{
                label : "数值轴",
                value : "value"
              },{
                label : "类目轴",
                value : "category"
              },{
                label : "时间轴",
                value : "time"
              },{
                label : "对数轴",
                value : "log"
              }]
            },
            nameLocation: {
              label: "显示位置",
              value: "end",
              type : "select",
              options : [{
                label : "起点",
                value : "start"
              },{
                label : "中间",
                value : "middle"
              },{
                label : "终点",
                value : "end"
              }]
            },
            "nameTextStyle/color" : {
              label : "文字颜色",
              value : "#333",
              type : "colorPicker"
            },
            "nameTextStyle/fontStyle" : {
              label : "文字风格",
              value : "normal",
              type : "select",
              options : [{
                label : "普通",
                value : "normal"
              },{
                label : "斜体",
                value : "italic"
              }]
            },
            "nameTextStyle/fontWeight" : {
              label : "文字粗细",
              value : "bolder",
              type : "select",
              options : [{
                label : "正常",
                value : "normal"
              },{
                label : "超粗",
                value : "bolder"
              },{
                label : "细体",
                value : "lighter"
              }]
            },
            "nameTextStyle/fontSize" : {
              label : "文字字号",
              value : 12,
              type : "numberinput"
            },
            "nameGap" : {
              label : "字轴距",
              value : 15,
              type : "numberinput"
            },
            "nameRotate" : {
              label : "文字旋转角度",
              value : null,
              type : "numberinput"
            },
            "inverse" : {
              label : "反转坐标",
              value : false,
              type : "boolean"
            },
            "boundaryGap" : {
              label : "双侧留白",
              value : true,
              type : "boolean"
            },
            "min" : {
              label : "最小值",
              value : 'auto',
              type : "input"
            },
            "max" : {
              label : "最大值",
              value : 'auto',
              type : "input"
            },
            splitNumber : {
              label : "分割段数",
              value : 5,
              type : "colorPicker"
            },
            "axisLine/show" : {
              label : "显示（轴线）",
              type : "boolean",
              value : true
            },
            "axisLine/lineStyle/color" : {
              label : "轴线颜色",
              value : "#333",
              type : "colorPicker"
            },
            "axisLine/lineStyle/width" : {
              label : "轴线宽",
              value : 1,
              type : "numberinput"
            },
            "axisLine/lineStyle/type" : {
              label : "轴线线型",
              value : "solid",
              type : "select",
              options : [{
                label : "正常",
                value : "solid"
              },{
                label : "粗体",
                value : "dashed"
              },{
                label : "超粗",
                value : "dotted"
              }]
            },
            "axisLine/lineStyle/opacity" : {
              label : "轴线透明度",
              value : 1,
              type : "numberinput"
            },
            "axisLine/lineStyle/shadowBlur" : {
              label : "轴线阴影模糊",
              value : 0,
              type : "numberinput"
            },
            "axisLine/lineStyle/shadowColor" : {
              label : "轴线阴影颜色",
              value : null,
              type : "colorPicker"
            },
            "axisLine/lineStyle/shadowOffsetX" : {
              label : "轴线阴影水平偏移",
              value : 0,
              type : "numberinput"
            },
            "axisLine/lineStyle/shadowOffsetY" : {
              label : "轴线阴影垂直偏移",
              value : 0,
              type : "numberinput"
            },
            "axisTick/show" : {
              label : "显示（刻度线）",
              type : "boolean",
              value : true
            },
            "axisTick/alignWithLabel" : {
              label : "刻度标签对齐",
              type : "boolean",
              value : false
            },
            "axisTick/inside" : {
              label : "刻度标签向内",
              type : "boolean",
              value : false
            },
            "axisTick/lineStyle/color" : {
              label : "刻度线颜色",
              value : "#333",
              type : "colorPicker"
            },
            "axisTick/lineStyle/width" : {
              label : "刻度线宽",
              value : 1,
              type : "numberinput"
            },
            "axisTick/lineStyle/type" : {
              label : "刻度线线型",
              value : "solid",
              type : "select",
              options : [{
                label : "正常",
                value : "solid"
              }/**,{
                label : "粗体",
                value : "dashed"
              }*/,{
                label : "超粗",
                value : "dotted"
              }]
            },
            "axisTick/lineStyle/shadowBlur" : {
              label : "阴影模糊",
              value : 0,
              type : "numberinput"
            },
            "axisTick/lineStyle/shadowColor" : {
              label : "阴影颜色",
              value : null,
              type : "colorPicker"
            },
            "axisTick/lineStyle/shadowOffsetX" : {
              label : "阴影水平偏移",
              value : 0,
              type : "numberinput"
            },
            "axisTick/lineStyle/shadowOffsetY" : {
              label : "阴影垂直偏移",
              value : 0,
              type : "numberinput"
            },
            "axisLabel/show" : {
              label : "显示（刻度标签）",
              type : "boolean",
              value : true
            },
            "axisLabel/interval" : {
              label : "刻度标签间隔",
              value : "auto",
              type : "numberinput"
            },
            "axisLabel/inside" : {
              label : "刻度标签向内",
              type : "boolean",
              value : false
            },
            "axisLabel/rotate" : {
              label : "刻度标签旋转",
              value : 0,
              type : "numberinput"
            },
            "axisLabel/margin" : {
              label : "刻度标签间距",
              value : 8,
              type : "numberinput"
            },
            "axisLabel/formatter" : {
              label : "刻度标签格式",
              value : null,
              type : "code"
            },
          }
        }
      }
    },
    yAxis : {
      $name : "yAxis",
      label : "Y轴",
      options : {
        yAxis : {
          $name : "yAxis",
          label : "Y轴",
          content: {
            name : {
              label : "坐标轴名称",
              value : "",
              type : "input"
            },
            gridIndex : {
              label : "轴线索引值",
              value : 0,
              type : "numberinput"
            },
            position : {
              label : "位置",
              value : "bottom",
              type : "select",
              options : [{
                label : "顶部",
                value : "top"
              },{
                label : "底部",
                value : "bottom"
              }]
            },
            offset : {
              label : "相对偏移量",
              value : 0,
              type : "numberinput"
            },
            type: {
              label: "类型",
              value: "value",
              type : "select",
              options : [{
                label : "数值轴",
                value : "value"
              },{
                label : "类目轴",
                value : "category"
              },{
                label : "时间轴",
                value : "time"
              },{
                label : "对数轴",
                value : "log"
              }]
            },
            nameLocation: {
              label: "显示位置",
              value: "end",
              type : "select",
              options : [{
                label : "起点",
                value : "start"
              },{
                label : "中间",
                value : "middle"
              },{
                label : "终点",
                value : "end"
              }]
            },
            "nameTextStyle/color" : {
              label : "文字颜色",
              value : "#333",
              type : "colorPicker"
            },
            "nameTextStyle/fontStyle" : {
              label : "文字风格",
              value : "normal",
              type : "select",
              options : [{
                label : "普通",
                value : "normal"
              },{
                label : "斜体",
                value : "italic"
              }/**,{
                label : "粗体",
                value : "oblique"
              }*/]
            },
            "nameTextStyle/fontWeight" : {
              label : "文字粗细",
              value : "bolder",
              type : "select",
              options : [{
                label : "正常",
                value : "normal"
              }/**,{
                label : "粗体",
                value : "bold"
              }*/,{
                label : "超粗",
                value : "bolder"
              },{
                label : "细体",
                value : "lighter"
              }]
            },
            "nameTextStyle/fontSize" : {
              label : "文字字号",
              value : 12,
              type : "numberinput"
            },
            "nameGap" : {
              label : "字轴距",
              value : 15,
              type : "numberinput"
            },
            "nameRotate" : {
              label : "文字旋转角度",
              value : null,
              type : "numberinput"
            },
            "inverse" : {
              label : "反转坐标",
              value : false,
              type : "boolean"
            },
            "boundaryGap" : {
              label : "双侧留白",
              value : true,
              type : "boolean"
            },
            "max" : {
              label : "最大值",
              value : 'auto',
              type : "input"
            },
            splitNumber : {
              label : "分割段数",
              value : 5,
              type : "colorPicker"
            },
            "axisLine/show" : {
              label : "显示（轴线）",
              type : "boolean",
              value : true
            },
            "axisLine/lineStyle/color" : {
              label : "轴线颜色",
              value : "#333",
              type : "colorPicker"
            },
            "axisLine/lineStyle/width" : {
              label : "轴线宽",
              value : 1,
              type : "numberinput"
            },
            "axisLine/lineStyle/type" : {
              label : "轴线线型",
              value : "solid",
              type : "select",
              options : [{
                label : "正常",
                value : "solid"
              }/**,{
                label : "粗体",
                value : "dashed"
              }*/,{
                label : "超粗",
                value : "dotted"
              }]
            },
            "axisLine/lineStyle/opacity" : {
              label : "轴线透明度",
              value : 1,
              type : "numberinput"
            },
            "axisLine/lineStyle/shadowBlur" : {
              label : "轴线阴影模糊",
              value : 0,
              type : "numberinput"
            },
            "axisLine/lineStyle/shadowColor" : {
              label : "轴线阴影颜色",
              value : null,
              type : "colorPicker"
            },
            "axisLine/lineStyle/shadowOffsetX" : {
              label : "轴线阴影水平偏移",
              value : 0,
              type : "numberinput"
            },
            "axisLine/lineStyle/shadowOffsetY" : {
              label : "轴线阴影垂直偏移",
              value : 0,
              type : "numberinput"
            },
            "axisTick/show" : {
              label : "显示（刻度线）",
              type : "boolean",
              value : true
            },
            "axisTick/alignWithLabel" : {
              label : "刻度标签对齐",
              type : "boolean",
              value : false
            },
            "axisTick/inside" : {
              label : "刻度标签向内",
              type : "boolean",
              value : false
            },
            "axisTick/lineStyle/color" : {
              label : "刻度线颜色",
              value : "#333",
              type : "colorPicker"
            },
            "axisTick/lineStyle/width" : {
              label : "刻度线宽",
              value : 1,
              type : "numberinput"
            },
            "axisTick/lineStyle/type" : {
              label : "刻度线线型",
              value : "solid",
              type : "select",
              options : [{
                label : "正常",
                value : "solid"
              }/**,{
                label : "粗体",
                value : "dashed"
              }*/,{
                label : "超粗",
                value : "dotted"
              }]
            },
            "axisTick/lineStyle/shadowBlur" : {
              label : "阴影模糊",
              value : 0,
              type : "numberinput"
            },
            "axisTick/lineStyle/shadowColor" : {
              label : "阴影颜色",
              value : null,
              type : "colorPicker"
            },
            "axisTick/lineStyle/shadowOffsetX" : {
              label : "阴影水平偏移",
              value : 0,
              type : "numberinput"
            },
            "axisTick/lineStyle/shadowOffsetY" : {
              label : "阴影垂直偏移",
              value : 0,
              type : "numberinput"
            },
            "axisLabel/show" : {
              label : "显示（刻度标签）",
              type : "boolean",
              value : true
            },
            "axisLabel/interval" : {
              label : "刻度标签间隔",
              value : "auto",
              type : "numberinput"
            },
            "axisLabel/inside" : {
              label : "刻度标签向内",
              type : "boolean",
              value : false
            },
            "axisLabel/rotate" : {
              label : "刻度标签旋转",
              value : 0,
              type : "numberinput"
            },
            "axisLabel/margin" : {
              label : "刻度标签间距",
              value : 8,
              type : "numberinput"
            },
            "axisLabel/formatter" : {
              label : "刻度标签格式",
              value : null,
              type : "code"
            },
          }
        }
      }
    },
    toolbox: {
      $name: "toolbox",
      label: "工具箱",
      content: {
        "feature/dataZoom/show": {
          label: "区域缩放",
          type: "boolean",
          value: false
        },
        "feature/dataView/show": {
          label: "数据视图",
          type: "boolean",
          value: false
        },
        "feature/restore/show": {
          label: "还原",
          type: "boolean",
          value: false
        },
        "feature/saveAsImage/show": {
          label: "保存为图片",
          type: "boolean",
          value: false
        },
        "feature/magicType": {
          label: "图形转换",
          type: "select",
          options: [{
            label: "线图与柱图转换",
            value: {
              type: ['line', 'bar']
            }
          }, {
            label: "堆叠与平铺转换",
            value: {
              type: ['stack', 'tiled']
            }
          }]
        },
        orient: {
          label: "工具箱布局朝向",
          type: "select",
          options: [{
            label: "横向",
            value: 'horizontal'
          }, {
            label: "纵向",
            value: 'vertical'
          }]
        },
        left: {
          label: "工具箱距离容器左侧距离",
          type: "select",
          options: [{
            label: "左",
            value: 'left'
          }, {
            label: "中",
            value: 'center'
          }, {
            label: "右",
            value: 'right'
          }]
        },
        top: {
          label: "工具箱距离容器上侧距离",
          type: "select",
          options: [{
            label: "上",
            value: 'top'
          }, {
            label: "中",
            value: 'middle'
          }, {
            label: "下",
            value: 'bottom'
          }]
        },
        "iconStyle/normal/color": {
          label: "工具箱图形颜色",
          type: "colorPicker",
          value: "#ccc"
        },
        "iconStyle/normal/borderColor": {
          label: "工具箱图形描边颜色",
          type: "colorPicker",
          value: "#ccc"
        },
        "iconStyle/emphasis/color": {
          label: "工具箱图形hover颜色",
          type: "colorPicker",
          value: "#ccc"
        },
        "iconStyle/emphasis/borderColor": {
          label: "工具箱图形hover描边颜色",
          type: "colorPicker",
          value: "#ccc"
        },
        "iconStyle/normal/opacity": {
          label: "工具箱图形透明度",
          type: "numberinput",
          value: 0
        },
        "iconStyle/emphasis/opacity": {
          label: "工具箱图形hover透明度",
          type: "numberinput",
          value: 0
        },
      }
    },
    tooltip: {
      $name: "tooltip",
      label: "浮动层",
      content: {
        show: {
          label: "显示(坐标线)",
          type: "boolean",
          value: true
        },
        showContent : {
          label : "显示(浮动层)",
          type : "boolean",
          value : true
        },
        trigger : {
          label : "触发类型",
          type : "select",
          value : "item",
          options : [{
            label : "数据项图形触发",
            value : "item"
          },{
            label : "坐标轴触发",
            value : "axis"
          }]
        },
        triggerOn : {
          label : "触发类型",
          type : "select",
          value : "mousemove",
          options : [{
            label : "鼠标移动时触发",
            value : "mousemove"
          },{
            label : "鼠标点击时触发",
            value : "click"
          }]
        },
        /**
        alwaysShowContent : {
          label : "永远显示提示框",
          type : "boolean",
          value : true
        },*/
        formatter : {
          label : "框浮层内容格式器",
          type : "code",
          value : ""
        },
        backgroundColor : {
          label : "框浮层的背景颜色",
          type : "colorPicker",
          value : "rgba(50,50,50,0.7)"
        },
        borderColor : {
          label : "浮层的边框颜色",
          type : "colorPicker",
          value : "#333"
        },
        borderWidth : {
          label : "浮层的边框宽",
          type : "numberinput",
          value : 0
        },
        // padding : {
        //   label : "浮层内边距",
        //   type : "numberinput",
        //   value : 5
        // },
        "textStyle/color" : {
          label : "浮层文本颜色",
          value : "#aaa",
          type : "colorPicker"
        },
        "textStyle/fontStyle" : {
          label : "浮层文本样式",
          value : "normal",
          type : "select",
          options : [{
            label : "普通",
            value : "normal"
          },{
            label : "斜体",
            value : "italic"
          }/**,{
            label : "粗体",
            value : "oblique"
          }*/]
        },
        // "textStyle/fontWeight" : {
        //   label : "浮层文本粗细",
        //   value : "bolder",
        //   type : "select",
        //   options : [{
        //     label : "正常",
        //     value : "normal"
        //   },{
        //     label : "粗体",
        //     value : "bold"
        //   },{
        //     label : "超粗",
        //     value : "bolder"
        //   },{
        //     label : "细体",
        //     value : "lighter"
        //   }]
        // },
        "textStyle/fontSize" : {
          label : "浮层文本字号",
          value : 18,
          type : "numberinput"
        },
      }
    },
    series : {
      $name : "series",
      label : "图形",
      options : {
        line : {
          $name : "line",
          label: "线状图",
          content: {
            type : {
              label : '类型',
              type : "select",
              value : "line",
              options : [{
                label : "直线",
                value : "line"
              }]
            },
            name : {
              label : "名称",
              type : "input",
              value : ""
            },
            coordinateSystem : {
              label : '坐标系',
              type : "select",
              value : "cartesian2d",
              options : [{
                label : "直角坐标系",
                value : "cartesian2d"
              },{
                label : "极坐标系",
                value : "polar"
              }]
            },
            smooth : {
              label : "平滑",
              type : "boolean",
              value : true
            },
            xAxisIndex : {
              label : '对应X轴',
              type : "numberinput",
              value : 0,
            },
            yAxisIndex : {
              label : '对应Y轴',
              type : "numberinput",
              value : 0,
            },
            symbol : {
              label : "标示点样式",
              value : "pin",
              type : "select",
              options : [{
                label : "圆形",
                value : "circle"
              },{
                label : "方形",
                value : "rect"
              },{
                label : "圆角矩形",
                value : "roundRect"
              },{
                label : "三角形",
                value : "triangle"
              },{
                label : "棱形",
                value : "diamond"
              },{
                label : "标注",
                value : "pin"
              },{
                label : "箭头",
                value : "arrow"
              }]
            },
            symbolSize : {
              label : '标示点大小',
              type : "code",
              value : 4,
            },
            polarIndex : {
              label : '对应极轴',
              type : "numberinput",
              value : 0,
            },
            stack : {
              label : '堆叠',
              type : "input",
              value : "",
            },
            "itemStyle/normal/color" : {
              label : "点颜色",
              type : "code",
              value : "#fff",
            },
            "label/normal/show" : {
              label : "显示标签",
              value : true,
              type : "boolean"
            },
            "label/normal/position" : {
              label : "标签位置",
              value : "top",
              type : "select",
              options : [{
                label : "上",
                value : "top"
              },{
                label : "左",
                value : "left"
              },{
                label : "右",
                value : "right"
              },{
                label : "下",
                value : "bottom"
              }]
            },
            "label/normal/formatter" : {
              label : "标签格式",
              value : "",
              type : "code"
            },
            "label/normal/textStyle/Color" : {
              label : "文字颜色",
              value : "#fff",
              type : "colorPicker"
            },
            "label/normal/textStyle/fontStyle" : {
              label : "文字风格",
              value : "normal",
              type : "select",
              options : [{
                label : "普通",
                value : "normal"
              },{
                label : "斜体",
                value : "italic"
              },{
                label : "粗体",
                value : "oblique"
              }]
            },
            "label/normal/textStyle/fontWeight" : {
              label : "文字粗细",
              value : "bolder",
              type : "select",
              options : [{
                label : "正常",
                value : "normal"
              },{
                label : "粗体",
                value : "bold"
              },{
                label : "超粗",
                value : "bolder"
              },{
                label : "细体",
                value : "lighter"
              }]
            },
            "label/normal/textStyle/fontSize" : {
              label : "文字字号",
              value : 12,
              type : "numberinput"
            },
            "label/emphasis/show" : {
              label : "显示强调标签",
              value : true,
              type : "boolean"
            },
            "label/emphasis/position" : {
              label : "强调标签位置",
              value : "top",
              type : "select",
              options : [{
                label : "上",
                value : "top"
              },{
                label : "左",
                value : "left"
              },{
                label : "右",
                value : "right"
              },{
                label : "下",
                value : "bottom"
              }]
            },
            "label/emphasis/formatter" : {
              label : "强调标签格式",
              value : "",
              type : "code"
            },
            "label/emphasis/textStyle/Color" : {
              label : "强调文字颜色",
              value : "#fff",
              type : "colorPicker"
            },
            "label/emphasis/textStyle/fontStyle" : {
              label : "强调文字风格",
              value : "normal",
              type : "select",
              options : [{
                label : "普通",
                value : "normal"
              },{
                label : "斜体",
                value : "italic"
              },{
                label : "粗体",
                value : "oblique"
              }]
            },
            "label/emphasis/textStyle/fontWeight" : {
              label : "强调文字粗细",
              value : "bolder",
              type : "select",
              options : [{
                label : "正常",
                value : "normal"
              },{
                label : "粗体",
                value : "bold"
              },{
                label : "超粗",
                value : "bolder"
              },{
                label : "细体",
                value : "lighter"
              }]
            },
            "label/emphasis/textStyle/fontSize" : {
              label : "强调文字字号",
              value : 12,
              type : "numberinput"
            },
            "areaStyle/normal/show" : {
              label : "面积填充",
              value : false,
              type : "boolean"
            },
            "areaStyle/normal/color" : {
              label : "面积颜色",
              value : null,
              type : "colorPicker"
            },
            "areaStyle/normal/shadowBlur" : {
              label : "面积阴影模糊",
              value : 0,
              type : "numberinput"
            },
            "areaStyle/normal/shadowColor" : {
              label : "面积阴影颜色",
              value : null,
              type : "colorPicker"
            },
            "areaStyle/normal/shadowOffsetX" : {
              label : "面积阴影水平偏移",
              value : 0,
              type : "numberinput"
            },
            "areaStyle/normal/shadowOffsetY" : {
              label : "面积阴影垂直偏移",
              value : 0,
              type : "numberinput"
            },
            "areaStyle/normal/opacity" : {
              label : "面积透明度",
              value : 1,
              type : "numberinput"
            },
            "lineStyle/normal/color" : {
              label : "线颜色",
              value : null,
              type : "colorPicker"
            },
            "lineStyle/normal/width" : {
              label : "线宽",
              value : 2,
              type : "numberinput"
            },
            "lineStyle/normal/type" : {
              label : "线型",
              value : "solid",
              type : "select",
              options : [{
                label : "实线",
                value : "solid"
              },{
                label : "虚线",
                value : "dashed"
              },{
                label : "点化线",
                value : "dotted"
              }]
            },
            "lineStyle/normal/shadowBlur" : {
              label : "线阴影模糊",
              value : 0,
              type : "numberinput"
            },
            "lineStyle/normal/shadowColor" : {
              label : "线阴影颜色",
              value : null,
              type : "colorPicker"
            },
            "lineStyle/normal/shadowOffsetX" : {
              label : "线阴影水平偏移",
              value : 0,
              type : "numberinput"
            },
            "lineStyle/normal/shadowOffsetY" : {
              label : "线阴影垂直偏移",
              value : 0,
              type : "numberinput"
            },
            "lineStyle/normal/opacity" : {
              label : "线透明度",
              value : 1,
              type : "numberinput"
            },
            "markLine/data" : {
              label : "标注线数据",
              value : [],
              type : "code"
            },
            "markArea/data" : {
              label : "标注面数据",
              value : [],
              type : "code"
            },
            "markArea/itemStyle/normal/opacity" : {
              label : "标注透明度",
              value : 1,
              type : "input"
            },
            "markPoint/symbol" : {
              label : "标注类型",
              value : "pin",
              type : "select",
              options : [{
                label : "圆形",
                value : "circle"
              },{
                label : "方形",
                value : "rect"
              },{
                label : "圆角矩形",
                value : "roundRect"
              },{
                label : "三角形",
                value : "triangle"
              },{
                label : "棱形",
                value : "diamond"
              },{
                label : "标注",
                value : "pin"
              },{
                label : "箭头",
                value : "arrow"
              }]
            },
            "markPoint/symbolSize" : {
              label : "标注大小",
              value : 50,
              type : "numberinput"
            },
            "markPoint/data" : {
              label : "标注数据",
              value : [],
              type : "code"
            },
            "markPoint/symbolRotate" : {
              label : "标注旋转",
              value : 0,
              type : "numberinput"
            },
            "markPoint/label/normal/show" : {
              label : "显示标注",
              value : true,
              type : "boolean"
            },
          }
        },
        bar : {
          $name : "bar",
          label: "线状图",
          content: {
            type : {
              label : '类型',
              type : "select",
              value : "bar",
              options : [{
                label : "柱体",
                value : "bar"
              }]
            },
            name : {
              label : "名称",
              type : "input",
              value : ""
            },
            coordinateSystem : {
              label : '坐标系',
              type : "select",
              value : "cartesian2d",
              options : [{
                label : "直角坐标系",
                value : "cartesian2d"
              },{
                label : "极坐标系",
                value : "polar"
              }]
            },
            xAxisIndex : {
              label : '对应X轴',
              type : "numberinput",
              value : 0,
            },
            yAxisIndex : {
              label : '对应Y轴',
              type : "numberinput",
              value : 0,
            },
            stack : {
              label : '堆叠',
              type : "input",
              value : "",
            },
            "label/normal/show" : {
              label : "显示标签",
              value : true,
              type : "boolean"
            },
            "label/normal/position" : {
              label : "标签位置",
              value : "top",
              type : "select",
              options : [{
                label : "上",
                value : "top"
              },{
                label : "左",
                value : "left"
              },{
                label : "右",
                value : "right"
              },{
                label : "下",
                value : "bottom"
              }]
            },
            "label/normal/formatter" : {
              label : "标签格式",
              value : "",
              type : "code"
            },
            "label/normal/textStyle/Color" : {
              label : "文字颜色",
              value : "#fff",
              type : "colorPicker"
            },
            "label/normal/textStyle/fontStyle" : {
              label : "文字风格",
              value : "normal",
              type : "select",
              options : [{
                label : "普通",
                value : "normal"
              },{
                label : "斜体",
                value : "italic"
              },{
                label : "粗体",
                value : "oblique"
              }]
            },
            "label/normal/textStyle/fontWeight" : {
              label : "文字粗细",
              value : "bolder",
              type : "select",
              options : [{
                label : "正常",
                value : "normal"
              },{
                label : "粗体",
                value : "bold"
              },{
                label : "超粗",
                value : "bolder"
              },{
                label : "细体",
                value : "lighter"
              }]
            },
            "label/normal/textStyle/fontSize" : {
              label : "文字字号",
              value : 12,
              type : "numberinput"
            },
            "label/emphasis/show" : {
              label : "显示强调标签",
              value : true,
              type : "boolean"
            },
            "label/emphasis/position" : {
              label : "强调标签位置",
              value : "top",
              type : "select",
              options : [{
                label : "上",
                value : "top"
              },{
                label : "左",
                value : "left"
              },{
                label : "右",
                value : "right"
              },{
                label : "下",
                value : "bottom"
              }]
            },
            "label/emphasis/formatter" : {
              label : "强调标签格式",
              value : "",
              type : "code"
            },
            "label/emphasis/textStyle/Color" : {
              label : "强调文字颜色",
              value : "#fff",
              type : "colorPicker"
            },
            "label/emphasis/textStyle/fontStyle" : {
              label : "强调文字风格",
              value : "normal",
              type : "select",
              options : [{
                label : "普通",
                value : "normal"
              },{
                label : "斜体",
                value : "italic"
              },{
                label : "粗体",
                value : "oblique"
              }]
            },
            "label/emphasis/textStyle/fontWeight" : {
              label : "强调文字粗细",
              value : "bolder",
              type : "select",
              options : [{
                label : "正常",
                value : "normal"
              },{
                label : "粗体",
                value : "bold"
              },{
                label : "超粗",
                value : "bolder"
              },{
                label : "细体",
                value : "lighter"
              }]
            },
            "label/emphasis/textStyle/fontSize" : {
              label : "强调文字字号",
              value : 12,
              type : "numberinput"
            },
            "itemStyle/normal/color" : {
              label : "柱体颜色",
              value : null,
              type : "colorPicker"
            },
            "itemStyle/normal/shadowBlur" : {
              label : "柱体阴影模糊",
              value : 0,
              type : "numberinput"
            },
            "itemStyle/normal/shadowColor" : {
              label : "柱体阴影颜色",
              value : null,
              type : "colorPicker"
            },
            "itemStyle/normal/shadowOffsetX" : {
              label : "柱体阴影水平偏移",
              value : 0,
              type : "numberinput"
            },
            "itemStyle/normal/shadowOffsetY" : {
              label : "柱体阴影垂直偏移",
              value : 0,
              type : "numberinput"
            },
            "itemStyle/normal/opacity" : {
              label : "柱体透明度",
              value : 1,
              type : "numberinput"
            },
            "itemStyle/normal/borderWidth" : {
              label : "线宽",
              value : 2,
              type : "numberinput"
            },
            "itemStyle/normal/type" : {
              label : "线型",
              value : "solid",
              type : "select",
              options : [{
                label : "实线",
                value : "solid"
              },{
                label : "虚线",
                value : "dashed"
              },{
                label : "点化线",
                value : "dotted"
              }]
            },
            "markPoint/symbol" : {
              label : "标注类型",
              value : "pin",
              type : "select",
              options : [{
                label : "圆形",
                value : "circle"
              },{
                label : "方形",
                value : "rect"
              },{
                label : "圆角矩形",
                value : "roundRect"
              },{
                label : "三角形",
                value : "triangle"
              },{
                label : "棱形",
                value : "diamond"
              },{
                label : "标注",
                value : "pin"
              },{
                label : "箭头",
                value : "arrow"
              }]
            },
            "markPoint/symbolSize" : {
              label : "标注大小",
              value : 50,
              type : "numberinput"
            },
            "markPoint/data" : {
              label : "标注数据",
              value : [],
              type : "code"
            },
            "markPoint/symbolRotate" : {
              label : "标注旋转",
              value : 0,
              type : "numberinput"
            },
            "markPoint/label/normal/show" : {
              label : "显示标注",
              value : true,
              type : "boolean"
            },
          }
        },
        pie: {
          $name : "pie",
          label: "饼图",
          echartType : "pie",
          content: {
            type : {
              label : '类型',
              type : "select",
              value : "pie",
              options : [{
                label : "饼图",
                value : "pie"
              }]
            },
            name : {
              label : "名称",
              type : "input",
              value : ""
            },
            clockwise : {
              label : "顺时针",
              type : "boolean",
              value : true
            },
            startAngle: {
              label : "起始角度",
              type : "numberinput",
              value : 90
            },
            "minAngle" : {
              label : "最小的扇区角度",
              type : "numberinput",
              value : 0
            },
            "roseType" : {
              label : "南丁格尔图",
              type : "select",
              value : false,
              options : [{
                label : "不使用",
                value : false
              },{
                label : "半径",
                value : "radius"
              },{
                label : "面积",
                value : "area"
              }]
            },
            "avoidLabelOverlap" : {
              label : "防止标签重叠",
              type : "boolean",
              value : true
            },
            "center" : {
              label : "圆心位置",
              type : "evalinput",
              value : "['50%', '50%']"
            },
            "radius" : {
              label : "半径",
              type : "evalinput",
              value : "[0, '75%']"
            },
            "label/normal/show" : {
              label : "显示标签",
              value : true,
              type : "boolean"
            },
            "label/normal/position" : {
              label : "标签位置",
              value : "outside",
              type : "select",
              options : [{
                label : "外侧",
                value : "outside"
              },{
                label : "内侧",
                value : "inside"
              },{
                label : "中心",
                value : "center"
              }]
            },
            "label/normal/formatter" : {
              label : "标签格式",
              value : "",
              type : "code"
            },
            "label/normal/textStyle/Color" : {
              label : "文字颜色",
              value : "#fff",
              type : "colorPicker"
            },
            "label/normal/textStyle/fontStyle" : {
              label : "文字风格",
              value : "normal",
              type : "select",
              options : [{
                label : "普通",
                value : "normal"
              },{
                label : "斜体",
                value : "italic"
              },{
                label : "粗体",
                value : "oblique"
              }]
            },
            "label/normal/textStyle/fontWeight" : {
              label : "文字粗细",
              value : "bolder",
              type : "select",
              options : [{
                label : "正常",
                value : "normal"
              },{
                label : "粗体",
                value : "bold"
              },{
                label : "超粗",
                value : "bolder"
              },{
                label : "细体",
                value : "lighter"
              }]
            },
            "label/normal/textStyle/fontSize" : {
              label : "文字字号",
              value : 12,
              type : "numberinput"
            },
            "label/emphasis/show" : {
              label : "显示强调标签",
              value : true,
              type : "boolean"
            },
            "label/emphasis/position" : {
              label : "强调标签位置",
              value : "top",
              type : "select",
              options : [{
                label : "上",
                value : "top"
              },{
                label : "左",
                value : "left"
              },{
                label : "右",
                value : "right"
              },{
                label : "下",
                value : "bottom"
              }]
            },
            "label/emphasis/formatter" : {
              label : "强调标签格式",
              value : "",
              type : "code"
            },
            "label/emphasis/textStyle/Color" : {
              label : "强调文字颜色",
              value : "#fff",
              type : "colorPicker"
            },
            "label/emphasis/textStyle/fontStyle" : {
              label : "强调文字风格",
              value : "normal",
              type : "select",
              options : [{
                label : "普通",
                value : "normal"
              },{
                label : "斜体",
                value : "italic"
              },{
                label : "粗体",
                value : "oblique"
              }]
            },
            "label/emphasis/textStyle/fontWeight" : {
              label : "强调文字粗细",
              value : "bolder",
              type : "select",
              options : [{
                label : "正常",
                value : "normal"
              },{
                label : "粗体",
                value : "bold"
              },{
                label : "超粗",
                value : "bolder"
              },{
                label : "细体",
                value : "lighter"
              }]
            },
            "label/emphasis/textStyle/fontSize" : {
              label : "强调文字字号",
              value : 12,
              type : "numberinput"
            },
            "areaStyle/normal/show" : {
              label : "面积填充",
              value : false,
              type : "boolean"
            },
            "areaStyle/normal/color" : {
              label : "面积颜色",
              value : null,
              type : "colorPicker"
            },
            "areaStyle/normal/shadowBlur" : {
              label : "面积阴影模糊",
              value : 0,
              type : "numberinput"
            },
            "areaStyle/normal/shadowColor" : {
              label : "面积阴影颜色",
              value : null,
              type : "colorPicker"
            },
            "areaStyle/normal/shadowOffsetX" : {
              label : "面积阴影水平偏移",
              value : 0,
              type : "numberinput"
            },
            "areaStyle/normal/shadowOffsetY" : {
              label : "面积阴影垂直偏移",
              value : 0,
              type : "numberinput"
            },
            "areaStyle/normal/opacity" : {
              label : "面积透明度",
              value : 1,
              type : "numberinput"
            },
            "color" : {
              label : "扇形颜色",
              value : "",
              type : "evalinput"
            },
            "markPoint/symbol" : {
              label : "标注类型",
              value : "pin",
              type : "select",
              options : [{
                label : "圆形",
                value : "circle"
              },{
                label : "方形",
                value : "rect"
              },{
                label : "圆角矩形",
                value : "roundRect"
              },{
                label : "三角形",
                value : "triangle"
              },{
                label : "棱形",
                value : "diamond"
              },{
                label : "标注",
                value : "pin"
              },{
                label : "箭头",
                value : "arrow"
              }]
            },
            "markPoint/symbolSize" : {
              label : "标注大小",
              value : 50,
              type : "numberinput"
            },
            "markPoint/data" : {
              label : "标注数据",
              value : [],
              type : "code"
            },
            "markPoint/symbolRotate" : {
              label : "标注旋转",
              value : 0,
              type : "numberinput"
            },
            "markPoint/label/normal/show" : {
              label : "显示标注",
              value : true,
              type : "boolean"
            }
          }
        },
        gauge: {
          $name : "gauge",
          label: "饼图",
          echartType : "gauge",
          content: {
            type : {
              label : '类型',
              type : "select",
              value : "gauge",
              options : [{
                label : "饼图",
                value : "gauge"
              }]
            },
            name : {
              label : "名称",
              type : "input",
              value : ""
            },
            clockwise : {
              label : "顺时针",
              type : "boolean",
              value : true
            },
            startAngle: {
              label : "起始角度",
              type : "numberinput",
              value : 225
            },
            "endAngle" : {
              label : "结束角度",
              type : "numberinput",
              value : -45
            },
            "min": {
              label : "最小值",
              type : "numberinput",
              value : 0
            },
            "max" : {
              label : "最大值",
              type : "numberinput",
              value : 100
            },
            "splitNumber" : {
              label : "分割段数",
              type : "numberinput",
              value : 10
            },
            "center" : {
              label : "圆心位置",
              type : "evalinput",
              value : "['50%', '50%']"
            },
            "radius" : {
              label : "半径",
              type : "input",
              value : "75%"
            },
            "title/show" : {
              label : "显示标题",
              value : true,
              type : "boolean"
            },
            "title/offsetCenter" : {
              label : "标题位置",
              value : "[0, '-40%']",
              type : "evalinput"
            },
            "title/textStyle/fontSize" : {
              label : "标题字号",
              value : 15,
              type : "numberinput"
            },
            "detail/show" : {
              label : "显示值",
              value : true,
              type : "boolean"
            },
            "detail/offsetCenter" : {
              label : "值位置",
              value : "[0, '40%']",
              type : "evalinput"
            },
            "detail/textStyle/fontSize" : {
              label : "值字号",
              value : 15,
              type : "numberinput"
            },
            "axisLine/lineStyle/color" : {
              label : "轴线分段颜色（数组）",
              value : "[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]",
              type : "evalinput"
            },
            "axisLine/lineStyle/width" : {
              label : "轴线宽度",
              value : 40,
              type : "numberinput"
            },
            "markPoint/symbol" : {
              label : "标注类型",
              value : "pin",
              type : "select",
              options : [{
                label : "圆形",
                value : "circle"
              },{
                label : "方形",
                value : "rect"
              },{
                label : "圆角矩形",
                value : "roundRect"
              },{
                label : "三角形",
                value : "triangle"
              },{
                label : "棱形",
                value : "diamond"
              },{
                label : "标注",
                value : "pin"
              },{
                label : "箭头",
                value : "arrow"
              }]
            },
            "markPoint/symbolSize" : {
              label : "标注大小",
              value : 50,
              type : "numberinput"
            },
            "markPoint/data" : {
              label : "标注数据",
              value : [],
              type : "code"
            },
            "markPoint/symbolRotate" : {
              label : "标注旋转",
              value : 0,
              type : "numberinput"
            },
            "markPoint/label/normal/show" : {
              label : "显示标注",
              value : true,
              type : "boolean"
            }
          }
        },
        scatter : {
          $name : "scatter",
          label: "散点图",
          content: {
            type : {
              label : '类型',
              type : "select",
              value : "scatter",
              options : [{
                label : "散点",
                value : "scatter"
              }]
            },
            name : {
              label : "名称",
              type : "input",
              value : ""
            },
            coordinateSystem : {
              label : '坐标系',
              type : "select",
              value : "cartesian2d",
              options : [{
                label : "直角坐标系",
                value : "cartesian2d"
              },{
                label : "极坐标系",
                value : "polar"
              },{
                label : "地图坐标",
                value : "geo"
              },{
                label : "百度地图",
                value : "bmap"
              }]
            },
            xAxisIndex : {
              label : '对应X轴',
              type : "numberinput",
              value : 0,
            },
            yAxisIndex : {
              label : '对应Y轴',
              type : "numberinput",
              value : 0,
            },
            symbol : {
              label : "标示点样式",
              value : "pin",
              type : "code"
            },
            symbolSize : {
              label : '标示点大小',
              type : "code",
              value : 4,
            },
            polarIndex : {
              label : '对应极轴',
              type : "numberinput",
              value : 0,
            },
            "label/normal/show" : {
              label : "显示标签",
              value : false,
              type : "boolean"
            },
            "label/normal/position" : {
              label : "标签位置",
              value : "top",
              type : "select",
              options : [{
                label : "上",
                value : "top"
              },{
                label : "左",
                value : "left"
              },{
                label : "右",
                value : "right"
              },{
                label : "下",
                value : "bottom"
              }]
            },
            "label/normal/formatter" : {
              label : "标签格式",
              value : "",
              type : "code"
            },
            "label/normal/offset" : {
              label : "标签偏移",
              value : "",
              type : "evalinput"
            },
            "label/normal/textStyle/Color" : {
              label : "文字颜色",
              value : "#fff",
              type : "colorPicker"
            },
            "label/normal/textStyle/fontStyle" : {
              label : "文字风格",
              value : "normal",
              type : "select",
              options : [{
                label : "普通",
                value : "normal"
              },{
                label : "斜体",
                value : "italic"
              },{
                label : "粗体",
                value : "oblique"
              }]
            },
            "label/normal/textStyle/fontWeight" : {
              label : "文字粗细",
              value : "bolder",
              type : "select",
              options : [{
                label : "正常",
                value : "normal"
              },{
                label : "粗体",
                value : "bold"
              },{
                label : "超粗",
                value : "bolder"
              },{
                label : "细体",
                value : "lighter"
              }]
            },
            "label/normal/textStyle/fontSize" : {
              label : "文字字号",
              value : 12,
              type : "numberinput"
            },
            "label/emphasis/show" : {
              label : "显示强调标签",
              value : true,
              type : "boolean"
            },
            "label/emphasis/position" : {
              label : "强调标签位置",
              value : "top",
              type : "select",
              options : [{
                label : "上",
                value : "top"
              },{
                label : "左",
                value : "left"
              },{
                label : "右",
                value : "right"
              },{
                label : "下",
                value : "bottom"
              }]
            },
            "label/emphasis/formatter" : {
              label : "强调标签格式",
              value : "",
              type : "code"
            },
            "label/emphasis/textStyle/Color" : {
              label : "强调文字颜色",
              value : "#fff",
              type : "colorPicker"
            },
            "label/emphasis/textStyle/fontStyle" : {
              label : "强调文字风格",
              value : "normal",
              type : "select",
              options : [{
                label : "普通",
                value : "normal"
              },{
                label : "斜体",
                value : "italic"
              },{
                label : "粗体",
                value : "oblique"
              }]
            },
            "label/emphasis/textStyle/fontWeight" : {
              label : "强调文字粗细",
              value : "bolder",
              type : "select",
              options : [{
                label : "正常",
                value : "normal"
              },{
                label : "粗体",
                value : "bold"
              },{
                label : "超粗",
                value : "bolder"
              },{
                label : "细体",
                value : "lighter"
              }]
            },
            "label/emphasis/textStyle/fontSize" : {
              label : "强调文字字号",
              value : 12,
              type : "numberinput"
            },
            "itemStyle/normal/color" : {
              label : "面积颜色",
              value : "",
              type : "code"
            },
            "itemStyle/normal/borderColor" : {
              label : "描边颜色",
              value : null,
              type : "colorPicker"
            },
            "itemStyle/normal/borderWidth" : {
              label : "描边宽度",
              value : 0,
              type : "numberinput"
            },
            "itemStyle/normal/shadowBlur" : {
              label : "面积阴影模糊",
              value : 0,
              type : "numberinput"
            },
            "itemStyle/normal/shadowColor" : {
              label : "面积阴影颜色",
              value : null,
              type : "colorPicker"
            },
            "itemStyle/normal/shadowOffsetX" : {
              label : "面积阴影水平偏移",
              value : 0,
              type : "numberinput"
            },
            "itemStyle/normal/shadowOffsetY" : {
              label : "面积阴影垂直偏移",
              value : 0,
              type : "numberinput"
            },
            "itemStyle/normal/opacity" : {
              label : "面积透明度",
              value : 1,
              type : "numberinput"
            },
            "markPoint/symbol" : {
              label : "标注类型",
              value : "pin",
              type : "select",
              options : [{
                label : "圆形",
                value : "circle"
              },{
                label : "方形",
                value : "rect"
              },{
                label : "圆角矩形",
                value : "roundRect"
              },{
                label : "三角形",
                value : "triangle"
              },{
                label : "棱形",
                value : "diamond"
              },{
                label : "标注",
                value : "pin"
              },{
                label : "箭头",
                value : "arrow"
              }]
            },
            "markPoint/symbolSize" : {
              label : "标注大小",
              value : 50,
              type : "numberinput"
            },
            "markPoint/data" : {
              label : "标注数据",
              value : [],
              type : "code"
            },
            "markPoint/symbolRotate" : {
              label : "标注旋转",
              value : 0,
              type : "numberinput"
            },
            "markPoint/label/normal/show" : {
              label : "显示标注",
              value : true,
              type : "boolean"
            },
            "markLine/lineStyle/normal/color" : {
              label : "标线颜色",
              value : "",
              type : "colorPicker"
            },
            "markLine/lineStyle/normal/width" : {
              label : "标线宽度",
              value : 1,
              type : "numberinput"
            },
            "markLine/lineStyle/data" : {
              label : "标注数据",
              value : [],
              type : "code"
            },
            "markLine/lineStyle/type" : {
              label : "刻度线线型",
              value : "solid",
              type : "select",
              options : [{
                label : "正常",
                value : "solid"
              },{
                label : "粗体",
                value : "dashed"
              },{
                label : "超粗",
                value : "dotted"
              }]
            },
          }
        },
        effectScatter : {
          $name : "effectScatter",
          label: "波动散点图",
          content: {
            type : {
              label : '类型',
              type : "select",
              value : "effectScatter",
              options : [{
                label : "波动散点",
                value : "effectScatter"
              }]
            },
            name : {
              label : "名称",
              type : "input",
              value : ""
            },
            coordinateSystem : {
              label : '坐标系',
              type : "select",
              value : "cartesian2d",
              options : [{
                label : "直角坐标系",
                value : "cartesian2d"
              },{
                label : "极坐标系",
                value : "polar"
              },{
                label : "地图坐标",
                value : "geo"
              },{
                label : "百度地图",
                value : "bmap"
              }]
            },
            showEffectOn : {
              label : '显示特效',
              type : "select",
              value : "render",
              options : [{
                label : "渲染后显示",
                value : "render"
              },{
                label : "高亮时显示",
                value : "emphasis"
              }]
            },
            "rippleEffect/period" : {
              label : "波纹时间",
              value : 4,
              type : "numberinput"
            },
            "rippleEffect/scale" : {
              label : "波纹比例",
              value : 2.5,
              type : "numberinput"
            },
            "rippleEffect/brushType" : {
              label : "波纹方式",
              value : "fill",
              type : "select",
              options : [{
                label : "fill",
                value : "fill"
              },{
                label : "stroke",
                value : "stroke"
              }]
            },
            hoverAnimation : {
              label : "hover动画效果",
              value : true,
              type : "boolean"
            },
            xAxisIndex : {
              label : '对应X轴',
              type : "numberinput",
              value : 0,
            },
            yAxisIndex : {
              label : '对应Y轴',
              type : "numberinput",
              value : 0,
            },
            symbol : {
              label : "标示点样式",
              value : "pin",
              type : "code"
            },
            symbolSize : {
              label : '标示点大小',
              type : "code",
              value : 4,
            },
            polarIndex : {
              label : '对应极轴',
              type : "numberinput",
              value : 0,
            },
            "label/normal/show" : {
              label : "显示标签",
              value : true,
              type : "boolean"
            },
            "label/normal/position" : {
              label : "标签位置",
              value : "top",
              type : "select",
              options : [{
                label : "上",
                value : "top"
              },{
                label : "左",
                value : "left"
              },{
                label : "右",
                value : "right"
              },{
                label : "下",
                value : "bottom"
              }]
            },
            "label/normal/formatter" : {
              label : "标签格式",
              value : "",
              type : "code"
            },
            "label/normal/textStyle/Color" : {
              label : "文字颜色",
              value : "#fff",
              type : "colorPicker"
            },
            "label/normal/textStyle/fontStyle" : {
              label : "文字风格",
              value : "normal",
              type : "select",
              options : [{
                label : "普通",
                value : "normal"
              },{
                label : "斜体",
                value : "italic"
              },{
                label : "粗体",
                value : "oblique"
              }]
            },
            "label/normal/textStyle/fontWeight" : {
              label : "文字粗细",
              value : "bolder",
              type : "select",
              options : [{
                label : "正常",
                value : "normal"
              },{
                label : "粗体",
                value : "bold"
              },{
                label : "超粗",
                value : "bolder"
              },{
                label : "细体",
                value : "lighter"
              }]
            },
            "label/normal/textStyle/fontSize" : {
              label : "文字字号",
              value : 12,
              type : "numberinput"
            },
            "label/emphasis/show" : {
              label : "显示强调标签",
              value : true,
              type : "boolean"
            },
            "label/emphasis/position" : {
              label : "强调标签位置",
              value : "top",
              type : "select",
              options : [{
                label : "上",
                value : "top"
              },{
                label : "左",
                value : "left"
              },{
                label : "右",
                value : "right"
              },{
                label : "下",
                value : "bottom"
              }]
            },
            "label/emphasis/formatter" : {
              label : "强调标签格式",
              value : "",
              type : "code"
            },
            "label/emphasis/textStyle/Color" : {
              label : "强调文字颜色",
              value : "#fff",
              type : "colorPicker"
            },
            "label/emphasis/textStyle/fontStyle" : {
              label : "强调文字风格",
              value : "normal",
              type : "select",
              options : [{
                label : "普通",
                value : "normal"
              },{
                label : "斜体",
                value : "italic"
              },{
                label : "粗体",
                value : "oblique"
              }]
            },
            "label/emphasis/textStyle/fontWeight" : {
              label : "强调文字粗细",
              value : "bolder",
              type : "select",
              options : [{
                label : "正常",
                value : "normal"
              },{
                label : "粗体",
                value : "bold"
              },{
                label : "超粗",
                value : "bolder"
              },{
                label : "细体",
                value : "lighter"
              }]
            },
            "label/emphasis/textStyle/fontSize" : {
              label : "强调文字字号",
              value : 12,
              type : "numberinput"
            },
            "itemStyle/normal/color" : {
              label : "面积颜色",
              value : "",
              type : "code"
            },
            "itemStyle/normal/shadowBlur" : {
              label : "面积阴影模糊",
              value : 0,
              type : "numberinput"
            },
            "itemStyle/normal/shadowColor" : {
              label : "面积阴影颜色",
              value : null,
              type : "colorPicker"
            },
            "itemStyle/normal/shadowOffsetX" : {
              label : "面积阴影水平偏移",
              value : 0,
              type : "numberinput"
            },
            "itemStyle/normal/shadowOffsetY" : {
              label : "面积阴影垂直偏移",
              value : 0,
              type : "numberinput"
            },
            "itemStyle/normal/opacity" : {
              label : "面积透明度",
              value : 1,
              type : "numberinput"
            },
            "markPoint/symbol" : {
              label : "标注类型",
              value : "pin",
              type : "select",
              options : [{
                label : "圆形",
                value : "circle"
              },{
                label : "方形",
                value : "rect"
              },{
                label : "圆角矩形",
                value : "roundRect"
              },{
                label : "三角形",
                value : "triangle"
              },{
                label : "棱形",
                value : "diamond"
              },{
                label : "标注",
                value : "pin"
              },{
                label : "箭头",
                value : "arrow"
              }]
            },
            "markPoint/symbolSize" : {
              label : "标注大小",
              value : 50,
              type : "numberinput"
            },
            "markPoint/data" : {
              label : "标注数据",
              value : [],
              type : "code"
            },
            "markPoint/symbolRotate" : {
              label : "标注旋转",
              value : 0,
              type : "numberinput"
            },
            "markPoint/label/normal/show" : {
              label : "显示标注",
              value : true,
              type : "boolean"
            },
            "markLine/lineStyle/normal/color" : {
              label : "标线颜色",
              value : "",
              type : "colorPicker"
            },
            "markLine/lineStyle/normal/width" : {
              label : "标线宽度",
              value : 1,
              type : "numberinput"
            },
            "markLine/lineStyle/data" : {
              label : "标注数据",
              value : [],
              type : "code"
            },
            "markLine/lineStyle/type" : {
              label : "刻度线线型",
              value : "solid",
              type : "select",
              options : [{
                label : "正常",
                value : "solid"
              },{
                label : "粗体",
                value : "dashed"
              },{
                label : "超粗",
                value : "dotted"
              }]
            },
          }
        },
        map : {
          $name : "map",
          label: "地图",
          content: {
            type : {
              label : '类型',
              type : "select",
              value : "map",
              options : [{
                label : "地图",
                value : "map"
              }]
            },
            mapType : {
              label : "地图",
              value : "none",
              type : "select",
              options : [{
                label : "无",
                value : "none"
              },{
                label : "中国",
                value : "china"
              },{
                label : "世界",
                value : "world"
              }]
            },
            geoIndex : {
              label : "绑定地图序列",
              type : "input",
              value : ""
            },
            name : {
              label : "名称",
              type : "input",
              value : ""
            },
            roam : {
              label : "可移动",
              type : "boolean",
              value : false
            },
            center : {
              label : "圆心位置",
              type : "evalinput",
              value : "[]"
            },
            zoom : {
              label : "缩放级别",
              type : "numberinput",
              value : 1
            },
            "item/emphasis/color" : {
              label : "高亮颜色",
              value : null,
              type : "colorPicker"
            }
          }
        }
      }
    },
    visualMap : {
      $name : "visualMap",
      label : "视觉映射",
      options : {
        "continuous" : {
           $name : "continuous",
           label: "连续映射",
           content : {
             type : {
               label : '类型',
               type : "select",
               value : "continuous",
               options : [{
                 label : "连续映射",
                 value : "continuous"
               }]
             },
             show : {
               label : "显示",
               type : "boolean",
               value : true
             },
             calculable : {
               label : "可计算",
               type : "boolean",
               value : false
             },
             color : {
               label : "颜色",
               value :  ['#bf444c', '#d88273', '#f6efa6'],
               type : "evalinput"
             },
             "left" : {
               label : "左边距",
               value : "auto",
               type : "input"
             },
             "top" : {
               label : "上边距",
               value : "auto",
               type : "input"
             },
             "right" : {
               label : "右边距",
               value : "auto",
               type : "numberinput"
             },
             "bottom" : {
               label : "下边距",
               value : "auto",
               type : "numberinput"
             },
             "min" : {
               label : "最小值",
               value : "auto",
               type : "numberinput"
             },
             "max" : {
               label : "最大值",
               value : "auto",
               type : "numberinput"
             }
           }
         },
        "piecewise" : {
          $name : "piecewise",
          label: "分断映射",
          content : {
            type : {
              label : '类型',
              type : "select",
              value : "piecewise",
              options : [{
                label : "分断映射",
                value : "piecewise"
              }]
            },
            show : {
              label : "显示",
              type : "boolean",
              value : true
            },
            "pieces" : {
              label : "分段内容",
              value : "[]",
              type : "code"
            },
            "left" : {
              label : "左边距",
              value : "auto",
              type : "input"
            },
            "top" : {
              label : "上边距",
              value : "auto",
              type : "input"
            },
            "right" : {
              label : "右边距",
              value : "auto",
              type : "numberinput"
            },
            "bottom" : {
              label : "下边距",
              value : "auto",
              type : "numberinput"
            },
            "min" : {
              label : "最小值",
              value : "auto",
              type : "numberinput"
            },
            "max" : {
              label : "最大值",
              value : "auto",
              type : "numberinput"
            }
          }
        }
      }
    },
    bmap : {
      $name : "bmap",
      label : "百度地图",
      content : {
        "center" : {
          label : "地图中心",
          value : "[121.114129, 31.550339]",
          type : "input"
        },
        "zoom" : {
          label : "缩放度",
          value : 11,
          type : "numberinput"
        },
        "roam" : {
          label : "滑动",
          value : false,
          type : "boolean"
        },
        "mapStyle/styleJson" : {
          label : "地图样式",
          value : [],
          type : "code"
        }
      }
    },
    geo : {
      $name : "geo",
      label : "矢量地图",
      content : {
        "map" : {
          label : "地图",
          value : "",
          type : "select",
          options : [{
            label : "世界",
            value : "world"
          },{
            label : "中国",
            value : "china"
          },{
            label : "北京",
            value : "beijing"
          },{
            label : "河北",
            value : "hebei"
          },{
            label : "安徽",
            value : "anhui"
          },{
            label : "合肥",
            value : "hefei"
          }]
        },
        show : {
          label : "显示",
          type : "boolean",
          value : true
        },
        "itemStyle/normal/color" : {
          label : "地图颜色",
          value : "#ff0000",
          type : "colorPicker"
        },
        "itemStyle/emphasis/areaColor" : {
          label : "强调色",
          value : null,
          type : "colorPicker"
        },
        "itemStyle/normal/borderColor" : {
          label : "边框颜色",
          value : "#333",
          type : "colorPicker"
        },
        "itemStyle/normal/borderWidth" : {
          label : "边框宽",
          value : 1,
          type : "numberinput"
        }
      }
    }
  };
  var advance = {
    "variable" : {
      "label" : "变量名",
      "value" : "",
      "placeholder" : "请填变量名",
      "type" : "input"
    },
    "geturl" : {
      "label" : "获取视频地址",
      "value" : "none",
      "type" : "select-single",
      "options" : [{
        "label" : "无",
        "value" : "none"
      },{
        "label" : "从设备视频属性获取[参数：当前设备ID]",
        "value" : "fromResource"
      }]
    },
    "getoption" : {
      "label" : "获取列表",
      "value" : "selected-kpi",
      "type" : "select-single",
      "options" : [{
        "label" : "获取所选指标",
        "value" : "selected-kpi"
      }]
    },
    "getMultiSelect" : {
      "label" : "获取列表",
      "value" : "",
      "type" : "select-single",
      "options" : [{
        "label" : "获取所有设备",
        "value" : "devices"
      },{
        "label" : "获取管理域",
        "value" : "domains"
      },{
        "label" : "获取模型",
        "value" : "models"
      },{
        "label" : "获取所有企业",
        "value" : "enterprises"
      },{
        "label" : "获取所有项目",
        "value" : "projects"
      }, {
        "label": "获取所有行业",
        "value": "industrys"
      }, {
        "label": "获取能源类型",
        "value": "energys"
      }]
    },
    "getListTable" : {
      "label" : "获取列表",
      "value" : "",
      "type" : "select-single",
      "options" : [{
        "label" : "模拟列表",
        "value" : "simulate"
      },{
        "label" : "获取设备",
        "value" : "newdevice"
      },{
        "label" : "获取工单",
        "value" : "workorder"
      }, {
        "label": "获取能源类型",
        "value": "energyType"
      }, {
        "label" : "获取全部告警",
        "value" : "alert"
      }, {
        "label" : "获取当前客户所有项目",
        "value" : "allprojects"
      }, {
        "label" : "获取当前用户所有项目",
        "value" : "allprojectsbydomain"
      }, {
        "label" : "获取当前项目所有设备[参数:当前项目ID]",
        "value" : "currentDevicesByProject"
      },{
        "label" : "获取当前设备指令[参数：当前设备ID]",
        "value" : "currentDirectiveByDevice"
      }, {
        "label" : "获取当前设备告警[参数：当前设备ID]",
        "value" : "currentAlertByDevice"
      }, {
        "label" : "获取当前项目告警[参数：当前项目ID]",
        "value" : "currentAlertByProject"
      },{
        "label" : "获取当前网关所有设备[参数:当前项目ID]",
        "value" : "currentDevicesByGateWay"
      }]
    },
    "getfunction" : {
      "label" : "获取函数",
      "value" : "",
      "placeholder" : "请填写文字",
      "type" : "input"
    },
    "expression" : {
      "label" : "配置表达式",
      "value" : "",
      "placeholder" : "请填写文字",
      "type" : "code"
    },
    "category" : {
      "label" : "解析方式",
      "value" : "time",
      "type" : "select",
      "options" : [{
        "label" : "时间",
        "value" : "time"
      },{
        "label" : "设备",
        "value" : "ci"
      },{
        "label" : "散点",
        "value" : "scatter"
      },{
        "label" : "地图散点",
        "value" : "scatterMap"
      },{
        "label" : "告警统计",
        "value" : "alert"
      },{
        "label" : "可选列表",
        "value" : "choselist"
      }]
    },
    "custom_category" : {
      "label" : "自定义解析",
      "placeholder" : "如使用默认解析方式请不填",
      "value" : "",
      "type" : "input"
    },
    "condition" : {
      "label" : "参数",
      "value" : ["kpi", "{object:kpiQueryModel}"],
      "placeholder" : "请填写文字",
      "type" : "code"
    }
  };
  var findElement = function(attr, val) {

  };
  var $ngAngularStylePanel = function(){
    this.$get = ["stylesheet", function(stylesheet){
      return {
        getStyle : function(){
          return stylesheet;
        },
        getEchart : function(){
          return echartBase;
        },
        getParameters : function(){
          return parameters;
        },
        getSource : function(){
          return source;
        },
        getAdvance : function(){
          return advance;
        },
        echartToOption : function(data) {
          var rs;
          if(data == undefined) {
            rs = {}
          } else {
            rs = data.$clone();
          }
          for(var i in rs["general"]) {
            if(rs[i] != echartBase["general"]['content'][i]) {
              rs[i] = rs["general"][i];
            }
          }
          var loop = function(attr, target){
            if(typeof target[attr] == "string"){
              $$.runExpression(target[attr], function(funRes){
                if(funRes.code == "0" || funRes.code == 1001){
                  target[attr] = funRes.data;
                } else {
                  throw new Error(funRes.message);
                }
              });
            }
          }
          for(var i in rs) {
            loop(i, rs)
          }
          rs.traverse(function(attr, elem){
            for(var i in elem) {
              loop(i, elem);
            }
          });
          delete rs.general;
          return rs.$clone();
        }
      }
    }];
  };
  angular.module("ngAngularStyle",[])
    .provider("angular-style", $ngAngularStylePanel)
    .value("stylesheet", stylesheet);
})(window, angular);