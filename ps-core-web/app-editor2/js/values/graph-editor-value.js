define(["app"], function(app) {
    console.log("获取value列表!!!");
    app.value("toolBarList", [{
        name : "折线(面积)图",
        shortname : "折线图",
        image : "icon_linechart",
        id : "linechart",
        type : "line",
        icon : 0,
        show : true,
        sub : [{
            src : "line/line1",
            title : "标准折线图",
            context : "标注，标线，个性化线条阴影（可随意绑定多组,设备和指标）",
            option : "_lINECHART_STANDARD_",
            show : true,
            dataType : {
                type : "line",
                limit : {
                    onlyDifferentKpi : false
                },
                category : {
                    time : {
                        replace : true,
                        category : "time",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    }
                }
            }
        },{
            src : "line/line2",
            title : "堆积折线图",
            context : "任意系列多维度堆积（可随意绑定多组,设备和指标）",
            option : "_lINECHART_STYLE01_",
            show : true,
            dataType : {
                type : "line",
                limit : {
                    onlyDifferentKpi : false
                },
                category : {
                    time : {
                        replace : true,
                        category : "time",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    }
                }
            }
        },{
            src : "line/line3",
            title : "标准折线图",
            context : "横纵坐标轴互换，平滑曲线",
            option : "_lINECHART_STYLE02_",
            show : true,
            dataType : {
                type : "line",
                limit : {
                    onlyDifferentKpi : false
                },
                category : {
                    time : {
                        replace : true,
                        category : "time",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    }
                }
            }
        },{
            src : "line/line4",
            title : "标准面积图",
            context : "填充样式，平滑曲线",
            option : "_lINECHART_STYLE03_",
            show : true,
            dataType : {
                type : "line",
                category : {
                    time : {
                        replace : true,
                        category : "time",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    }
                }
            }
        },{
            src : "line/line5",
            title : "堆积面积图",
            context : "任意系列多维度堆积",
            option : "_lINECHART_STYLE04_",
            show : true,
            dataType : {
                type : "line",
                limit : {
                    onlyDifferentKpi : false
                },
                category : {
                    time : {
                        replace : true,
                        category : "time",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    }
                }
            }
        },{
            src : "line/line6",
            title : "不等距折线图",
            context : "双数值轴",
            option : "_lINECHART_STYLE05_",
            show : false,
            dataType : {
                type : "line_2d",
                limit : {
                    ci : 2,
                    kpi : 2,
                    onlyDifferentKpi : false
                },
                category : {
                    time : {
                        replace : true,
                        category : "time",
                        series : {
                            model : 'dimensional',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    }
                }
            }
        },{
            src : "line/line7",
            title : "不等距折线图",
            context : "时间坐标轴折线图",
            option : "_lINECHART_STYLE06_",
            show : false,
        },{
            src : "line/line8",
            title : "面积图",
            context : "反向数值轴",
            option : "_lINECHART_STYLE07_",
            show : false,
            dataType : {
                type : "line_2axis",
                limit : {
                    ci : 1,
                    kpi : 2,
                    onlyDifferentKpi : true
                },
                category : {
                    time : {
                        replace : true,
                        category : "time",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    }
                }
            }
        },{
            src : "line/line9",
            title : "折线图",
            context : "多级控制，个性化，填充、线条、拐点样式等",
            option : "_lINECHART_STYLE08_",
            show : false
        },{
            src : "line/line10",
            title : "折线图",
            context : "多级控制，个性化，填充、线条、拐点样式等",
            option : "_lINECHART_STYLE05_",
            show : true,
            dataType : {
                type : "line",
                limit : {
                    ci : 1,
                    onlyDifferentKpi : false
                },
                category : {
                    time : {
                        replace : true,
                        category : "time",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    }
                }
            }
        }]
    }, {
        name: "柱状(条形)图",
        shortname : "柱状图",
        icon: 1,
        image : "icon_barchart",
        id: "barchart",
        type : "bar",
        show : true,
        sub: [{
            src: "bar/bar1",
            title: "标准柱状图",
            context: "标注，标线（可随意绑定多组,设备和指标）",
            option: "_BARCHART_STANDARD_",
            show : true,
            dataType : {
                type : "bar",
                category : {
                    time : {
                        replace : true,
                        category : "time",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    },
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    }
                }
            }
        },{
            src: "bar/bar2",
            title: "堆积柱状图",
            context: "标线，任意系列多维度堆积",
            option: "_BARCHART_STYLE01_",
            show : false,
            dataType : {
                type : "bar",
                category : {
                    time : {
                        replace : true,
                        category : "time",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    },
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    }
                }
            }
        },{
            src: "bar/bar3",
            title: "温度计式图表",
            context: "个性化样式，文本标签显示",
            option: "_BARCHART_STYLE02_",
            show : false
        },{
            src: "bar/bar4",
            title: "组成瀑布图",
            context: "个性化样式，文本标签显示，透明数据驱动样式",
            option: "_BARCHART_STYLE03_",
            show : false
        },{
            src: "bar/bar5",
            title: "变化瀑布图",
            context: "个性化样式，文本标签显示，透明数据驱动样式",
            option: "_BARCHART_STYLE04_",
            show : false
        },{
            src: "bar/bar6",
            title: "多系列层叠",
            context: "个性化样式",
            option: "_BARCHART_STYLE05_",
            show : false
        },{
            src: "bar/bar7",
            title: "标准条形图",
            context: "横纵坐标轴互换",
            option: "_BARCHART_STYLE06_",
            show : false
        },{
            src: "bar/bar8",
            title: "堆积条形图",
            context: "任意系列多维度堆积",
            option: "_BARCHART_STYLE07_",
            show : false
        },{
            src: "bar/bar9",
            title: "多维条形图",
            context: "个性化样式，文本标签显示，透明数据驱动样式",
            option: "_BARCHART_STYLE08_",
            show : false
        },{
            src: "bar/bar10",
            title: "旋风条形图",
            context: "正负值混合",
            option: "_BARCHART_STYLE09_",
            show : false
        }]
    },{
        name : "饼（圆环）图",
        shortname : "饼状图",
        image : "icon_piechart",
        icon : 4,
        id : "piechart",
        type : "pie",
        show : true,
        sub: [{
            show : true,
            src: "pie/pie1",
            title: "标准饼图",
            context: "中心，半径设置",
            option: "_PIECHART_STANDARD_",
            dataType : {
                type : "pie",
                limit : {
                    onlyDifferentKpi : false
                },
                category : {
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : false
                    }
                }
            }
        },{
            show : false,
            src: "pie/pie2",
            title: "标准环形图",
            context: "中心，半径设置，文本标签显示",
            option: "_PIECHART_STYLE01_",
            dataType : {
                type : "pie",
                limit : {
                    onlyDifferentKpi : false
                },
                category : {
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : false
                    }
                }
            }
        },{
            show : false,
            src: "pie/pie3",
            title: "嵌套饼图",
            context: "多个饼图，中心，半径设置，文本标签显示",
            option: "_PIECHART_STYLE02_",
            dataType : {
                height : 500,
                type : "pie_2chart",
                limit : {
                    ci : 2,
                    onlyDifferentKpi : false
                },
                category : {
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'dimensional',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : false
                    }
                }
            }
        },{
            show : false,
            src: "pie/pie9",
            title: "千层饼",
            context: "多层嵌套环形图",
            option: "_PIECHART_STYLE07_"
        }]
    },{
        name : "仪表盘",
        shortname : "仪表盘",
        image : "icon_dashboard",
        icon : 6,
        id : "gaugechart",
        type : "gauge",
        show : true,
        sub: [{
            show : true,
            src: "gauge/gauge1",
            title: "标准仪表盘",
            context: "个性化",
            option: "_GAUGECHART_STANDARD_",
            dataType : {
                type : "gauge",
                limit : {
                    ci : 1,
                    kpi : 1
                },
                category : {
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : false
                    }
                }
            }
        },{
            show : false,
            src: "gauge/gauge2",
            title: "标准仪表盘",
            context: "个性化",
            option: "_GAUGECHART_STYLE01_",
            dataType : {
                type : "gauge",
                limit : {
                    ci : 1,
                    kpi : 1
                },
                category : {
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : false
                    }
                }
            }
        },{
            show : false,
            src: "gauge/gauge3",
            title: "标准仪表盘",
            context: "个性化",
            option: "_GAUGECHART_STYLE02_",
            dataType : {
                type : "gauge",
                limit : {
                    ci : 1,
                    kpi : 1
                },
                category : {
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : false
                    }
                }
            }
        },{
            show : false,
            src: "gauge/gauge4",
            title: "多仪表盘",
            context: "个性化",
            option: "_GAUGECHART_STYLE03_",
            dataType : {
                height : 500,
                type : "gauge",
                limit : {
                    ci : 1,
                    kpi : 4
                },
                category : {
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : false
                    }
                }
            }
        },{
            show : false,
            src: "gauge/gauge5",
            title: "多仪表盘",
            context: "个性化",
            option: "_GAUGECHART_STYLE04_",
            dataType : {
                height : 500,
                type : "gauge",
                limit : {
                    ci : 1,
                    kpi : 4
                },
                category : {
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : false
                    }
                }
            }
        },{
            show : false,
            src: "gauge/gauge6",
            title: "标准仪表盘",
            context: "个性化",
            option: "_GAUGECHART_STYLE05_",
            dataType : {
                type : "gauge",
                limit : {
                    ci : 1,
                    kpi : 1
                },
                category : {
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : false
                    }
                }
            }
        }]
    },{
        name : "地图",
        shortname : "地图",
        image : "icon_mapchart",
        id : "map",
        type : "map",
        show : true,
        sub: [{
            show : true,
            src: "map/map1",
            title: "标准地图",
            context: "中国地图，多系列，值域漫游",
            option: "_MAPCHART_STANDARD_",
            dataType : {
                type : "map"
            }
        },{
            show : true,
            src: "map/map2",
            title: "标准地图",
            context: "中国地图，地域选择器",
            option: "_MAPCHART_STYLE01_",
            dataType : {
                type : "map1"
            }
        },{
            show : true,
            src: "map/map3",
            title: "标准地图",
            context: "世界地图，值域漫游",
            option: "_MAPCHART_STYLE02_",
            dataType : {
                type : "map2"
            }
        },{
            show : false,
            src: "map/map4",
            title: "地图标线",
            context: "炫光特效，模拟百度迁徙",
            option: "_MAPCHART_STYLE03_"
        },{
            show : false,
            src: "map/map5",
            title: "地图标注",
            context: "大规模炫光特效，百度人气",
            option: "_MAPCHART_STYLE04_"
        }]
    },{
        name : "散点（气泡）图",
        shortname : "散点图",
        image : "icon_linechart",
        icon : 2,
        id : "scatterchart",
        type : "scatter",
        show : true,
        sub: [{
            show : true,
            src: "scatter/scatter1",
            title: "标准柱状图",
            context: "标注，标线",
            option: "_SCATTERCHART_STANDARD_",
            dataType : {
                type : "scatter",
                limit : {
                    ci : 2,
                    kpi : 2
                },
                category : {
                    time : {
                        category : "time",
                        series : {
                            model : 'dimensional',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : true
                    }
                }
            }
        },{
            show : true,
            src: "scatter/scatter2",
            title: "堆积柱状图",
            context: "标线，任意系列多维度堆积",
            option: "_SCATTERCHART_STYLE01_",
            dataType : {
                type : 'scatter2'
            }
        },{
            show : false,
            src: "scatter/scatter3",
            title: "温度计式图表",
            context: "个性化样式，文本标签显示",
            option: "_SCATTERCHART_STYLE02_",
            dataType : {
                type : 'scatter3'
            }
        },{
            show : false,
            src: "scatter/scatter4",
            title: "组成瀑布图",
            context: "个性化样式，文本标签显示，透明数据驱动样式",
            option: "_SCATTERCHART_STYLE03_",
            dataType : {
                type : "scatter",
                limit : {
                    ci : 2,
                    kpi : 2
                },
                category : {
                    time : {
                        category : "time",
                        series : {
                            model : 'dimensional',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : true
                    }
                }
            }
        },{
            show : false,
            src: "scatter/scatter5",
            title: "变化瀑布图",
            context: "个性化样式，文本标签显示，透明数据驱动样式",
            option: "_SCATTERCHART_STYLE04_",
            dataType : {
                type : "scatter",
                limit : {
                    ci : 2,
                    kpi : 2
                },
                category : {
                    time : {
                        category : "time",
                        series : {
                            model : 'dimensional',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : true
                    }
                }
            }
        }]
    },{
        name : "关系图",
        shortname : "关系图",
        image : "icon_tree",
        icon : 2,
        id : "relationchart",
        type : "relation",
        show : true,
        sub: [{
            show : true,
            src: "relation/relation1",
            title: "多维关系图",
            context: "多维关系图",
            option: "",
            dataType : {
                type : "relation1",
            }
        },{
            show : true,
            src: "relation/relation2",
            title: "活动关系图",
            context: "活动关系图",
            option: "",
            dataType : {
                type : 'relation2'
            }
        }]
    },{
        name : "平行坐标",
        shortname : "平行坐标",
        image : "icon_treemap",
        icon : 2,
        id : "relationchart",
        type : "parallels",
        show : true,
        sub: [{
            show : true,
            src: "parallels/parallels1",
            title: "平行线图1",
            context: "平行线图1",
            option: "",
            dataType : {
                type : "parallels1",
            }
        },{
            show : true,
            src: "parallels/parallels2",
            title: "平行线图2",
            context: "平行线图2",
            option: "",
            dataType : {
                type : 'parallels2'
            }
        },{
            show : true,
            src: "parallels/parallels3",
            title: "平行线图3",
            context: "平行线图3",
            option: "",
            dataType : {
                type : 'parallels3'
            }
        }]
    },{
        name : "桑基图",
        shortname : "桑基图",
        image : "icon_eventRiver",
        icon : 2,
        id : "relationchart",
        type : "parallels",
        show : true,
        sub: [{
            show : true,
            src: "sankey/sankey1",
            title: "平行线图1",
            context: "平行线图1",
            option: "",
            dataType : {
                type : "sankey1",
            }
        },{
            show : true,
            src: "sankey/sankey2",
            title: "平行线图1",
            context: "活动关系图",
            option: "",
            dataType : {
                type : 'sankey2'
            }
        }]
    },{
        name : "K线图",
        shortname : "K线图",
        image : "icon_k",
        icon : 3,
        id : "kchart",
        type : "k",
        show : true,
        sub: [{
            show : true,
            src: "k/k1",
            title: "标准柱状图",
            context: "标注，标线",
            option: "_KCHART_STANDARD_",
            dataType : {
                type : "k",
                limit : {
                    ci : 1,
                    kpi : 4
                },
                category : {
                    time : {
                        category : "time",
                        series : {
                            model : 'dimensional',
                            value : 'ci'
                        },
                        xAxis : true,
                        legend : true
                    }
                }
            }
        },{
            show : false,
            src: "k/k2",
            title: "K线图",
            context: "多级控制，个性化，柱形阴阳图形样式等",
            option: "_KCHART_STYLE01_"
        }]
    },{
        name : "雷达（面积）图",
        shortname : "雷达图",
        image : "icon_radar",
        icon : 8,
        id : "radarchart",
        type : "radar",
        show : true,
        sub: [{
            src: "radar/radar1",
            title: "标准雷达图",
            context: "极坐标设置",
            option: "_RADARCHART_STANDARD_",
            show : true,
            limit : {
                kpi : 6
            },
            dataType : {
                type : "radar",
                category : {
                    ci : {
                        category : "ci",
                        series : {
                            model : 'polar',
                            value : 'ci'
                        },
                        polar : true,
                        xAxis : false,
                        legend : true
                    }
                }
            }
        },{
            src: "radar/radar2",
            title: "标准填充雷达图",
            context: "极坐标设置，填充样式",
            option: "_RADARCHART_STYLE01_",
            show : false,
            limit : {
                kpi : 6
            },
            dataType : {
                limit : {
                    ci : 4,
                    kpi : 1
                },
                category : {
                    ci : {
                        category : "ci",
                        series : {
                            model : 'dimensional',
                            value : 'ci'
                        },
                        polar : true,
                        xAxis : false,
                        legend : true
                    }
                }
            }
        },{
            src: "radar/radar3",
            title: "多雷达图",
            context: "多个极坐标",
            option: "_RADARCHART_STYLE02_",
            show : false,
            limit : {
                kpi : 6
            }
        },{
            src: "radar/radar4",
            title: "虫洞",
            context: "多层嵌套雷达图",
            option: "_RADARCHART_STYLE03_",
            show : false,
        },{
            src: "radar/radar5",
            title: "雷达图",
            context: "多级控制，个性化线条，拐点，填充样式",
            option: "_RADARCHART_STYLE04_",
            show : false,
        }]
    },{
        name : "和弦图",
        shortname : "和弦图",
        image : "icon_chord",
        icon : 9,
        id : "chord",
        type : "chord",
        show : false,
        sub: [{
            src: "chord/chord1",
            title: "标准和弦图",
            context: "数据格式，排序",
            option: "_CHORDCHART_STANDARD_",
            show : true,
            dataType : {
                type : "chord",
                limit : {
                    ci : 4,
                    kpi : 4
                },
                category : {
                    ci : {
                        category : "ci",
                        series : {
                            model : 'dimensional',
                            value : 'ci'
                        },
                        polar : false,
                        xAxis : false,
                        legend : true
                    }
                }
            }
        },{
            src: "chord/chord2",
            title: "多系列和弦图",
            context: "多维图例选择",
            option: "_CHORDCHART_STYLE01_",
            show : false,
            dataType : {
                type : "chord",
                limit : {
                    ci : 10,
                    kpi : 10
                },
                category : {
                    ci : {
                        category : "ci",
                        series : {
                            model : 'dimensional',
                            value : 'ci'
                        },
                        polar : false,
                        xAxis : false,
                        legend : true
                    }
                }
            }
        },{
            src: "chord/chord3",
            title: "标准和弦图",
            context: "数据格式，排序",
            option: "_CHORDCHART_STYLE02_",
            show : false
        },{
            src: "chord/chord4",
            title: "非缎带和弦图",
            context: "数据格式，排序",
            option: "_CHORDCHART_STYLE03_",
            show : false
        },{
            src: "chord/chord5",
            title: "复杂关系网络",
            context: "Webkit内核依赖",
            option: "_CHORDCHART_STYLE04_",
            show : false
        },{
            src: "chord/chord6",
            title: "和弦图",
            context: "多级控制，个性化填充、标签文本、线条样式等",
            option: "_CHORDCHART_STYLE05_",
            show : false
        }]
    },{
        name : "力导向布局图",
        shortname : "力向图",
        image : "icon_forcechart",
        id : "force",
        type : "force",
        show : false,
        sub: [{
            show : true,
            src: "force/force1",
            title: "简单关系网络",
            context: "数据格式",
            option: "_FORCECHART_STANDARD_"
        },{
            show : false,
            src: "force/force2",
            title: "树状关系网络",
            context: "数据格式",
            option: "_FORCECHART_STYLE01_"
        },{
            show : false,
            src: "force/force3",
            title: "树状关系网络",
            context: "数据格式",
            option: "_FORCECHART_STYLE02_"
        },{
            show : false,
            src: "force/force4",
            title: "复杂关系网络",
            context: "Webkit内核依赖",
            option: "_FORCECHART_STYLE03_"
        },{
            show : false,
            src: "force/force5",
            title: "力导向布局",
            context: "个性化，节点样式，线条样式",
            option: "_FORCECHART_STYLE04_"
        }]
    },{
        show : false,
        name : "漏斗图",
        shortname : "漏斗图",
        image : "icon_funnel",
        icon : 10,
        id : "funnel",
        type : "funnel",
        sub: [{
            show : true,
            src: "funnel/funnel1",
            title: "标准漏斗图",
            context: "个性化",
            option: "_FUNNELCHART_STANDARD_",
            dataType : {
                type : "funnel",
                limit : {
                    ci : 2,
                    kpi : 5
                },
                category : {
                    ci : {
                        category : "ci",
                        series : {
                            model : 'dimensional',
                            value : 'ci'
                        },
                        polar : false,
                        xAxis : false,
                        legend : true
                    }
                }
            }
        },{
            show : false,
            src: "funnel/funnel2",
            title: "多漏斗图",
            context: "个性化",
            option: "_FUNNELCHART_STYLE01_"
        },{
            show : false,
            src: "funnel/funnel3",
            title: "多漏斗图",
            context: "个性化，排序",
            option: "_FUNNELCHART_STYLE02_"
        },{
            show : false,
            src: "funnel/funnel4",
            title: "多漏斗图",
            context: "个性化，水平对齐样式",
            option: "_FUNNELCHART_STYLE03_"
        },{
            show : false,
            src: "funnel/funnel5",
            title: "标准漏斗图",
            context: "个性化",
            option: "_FUNNELCHART_STYLE04_"
        }]
    },{
        name : "事件河流图",
        shortname : "河流图",
        image : "icon_eventRiver",
        icon : 9,
        id : "eventRiver",
        type : "eventRiver",
        show : false,
        sub: [{
            show : false,
            src: "eventRiver/eventRiver1",
            title: "事件河流图",
            context: "个性化",
            option: "_RIVERCHART_STANDARD_"
        },{
            show : false,
            src: "eventRiver/eventRiver2",
            title: "事件河流图",
            context: "个性化",
            option: "_RIVERCHART_STYLE01_"
        }]
    },{
        show : false,
        name : "韦恩图",
        shortname : "韦恩图",
        image : "icon_venn",
        icon : 9,
        id : "venn",
        type : "venn",
        sub: [{
            show : false,
            src: "venn/venn1",
            title: "韦恩图",
            context: "个性化",
            option: "_VENNCHART_STANDARD_",
            dataType : {
                limit : {
                    ci : 2,
                    kpi : 5
                },
                category : {
                    ci : {
                        series : "value"
                    }
                }
            }
        }]
    },{
        name : "矩形树图",
        shortname : "矩形图",
        image : "icon_treemap",
        icon : 9,
        id : "treemap",
        type : "treemap",
        show : false,
        sub: [{
            src: "treemap/treemap1",
            title: "矩形树图",
            context: "最简配置",
            option: "_TREEMAPCHART_STANDARD_",
            show : true,
            dataType : {
                type : "treemap",
                limit : {
                    ci : 1
                },
                category : {
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : false
                    }
                }
            }
        },{
            src: "treemap/treemap2",
            title: "矩形树图",
            context: "数据下钻",
            option: "_TREEMAPCHART_STYLE01_",
            show : false
        },{
            src: "treemap/treemap3",
            title: "矩形树图",
            context: "个性化",
            option: "_TREEMAPCHART_STYLE02_",
            show : false
        }]
    },{
        name : "树图",
        shortname : "树图",
        image : "icon_tree",
        icon : 9,
        id : "tree",
        type : "tree",
        show : false,
        sub: [{
            show : false,
            src: "tree/tree1",
            title: "树图",
            context: "最简配置",
            option: "_TREECHART_STANDARD_"
        },{
            show : false,
            src: "tree/tree2",
            title: "树图",
            context: "冰桶挑战",
            option: "_TREECHART_STYLE01_"
        }]
    },{
        show : false,
        name : "标签",
        shortname : "标签",
        image : "icon_venn",
        icon : 10,
        id : "tab",
        type : "tab",
        sub: [{
            show : false,
            src: "tree/tree1",
            title: "标签",
            context: "最简配置",
            option: "_TREECHART_STANDARD_",
            dataType : {
                type : "tab",
                height : 200,
                limit : {
                    ci : 1,
                    kpi : 1
                },
                category : {
                    ci : {
                        replace : true,
                        category : "ci",
                        series : {
                            model : 'linear',
                            value : 'ci'
                        },
                        xAxis : false,
                        legend : false
                    }
                }
            }
        }]
    }]);
    app.value("timeformatList", [{
        formatStr : "年月日时分秒",
        name : "年／月／日 时 : 分 : 秒",
        value : "yy/mm/dd-hh:mm"
    },{
        formatStr : "时分秒",
        name : "时 : 分 : 秒",
        value : "-hh:mm:ss"
    },{
        formatStr : "时分",
        name : "时 : 分",
        value : "-hh:mm"
    },{
        formatStr : "年月日",
        name : "年／月／日",
        value : "yy/mm/dd-"
    },{
        formatStr : "月日",
        name : "月／日",
        value :"mm/dd-"
    },{
        formatStr : "日",
        name : "日",
        value : "dd-"
    },{
        formatStr : "时",
        name : "时",
        value : "-hh"
    }]);
    app.value("styleList", [{
        name : "macarons",
        value :"macarons"
    },{
        name : "infographic",
        value : "infographic"
    },{
        name : "shine",
        value : "shine"
    },{
        name : "roma",
        value : "roma"
    },{
        name : "自定义模式",
        value : "customer"
    }]);
    app.value("optionType", [{
        id: 0,
        name: "标题",
        display : ['line','bar','pie'],
        sub: [{
            id: 0,
            name: "标题",
            content: [{
                id: 0,
                name: "主标题",
                type: "INPUT",
                bind: "title.text"
            },
            {
                id: 1,
                name: "主标题链接",
                type: "INPUT",
                bind: "title.link"
            },
            {
                id: 2,
                name: "副标题",
                type: "INPUT",
                bind: "title.subtext"
            },
            {
                id: 3,
                name: "副标题链接",
                type: "INPUT",
                bind: "title.sublink"
            }]
        },
        {
            id: 1,
            name: "样式",
            display : ['line','bar','pie'],
            content: [{
                id: 0,
                name: "标题块位置",
                type: "TITLE",
            },
            {
                id: 1,
                name: "水平安放位置",
                type: "SELECT",
                bind: "title.x",
                values: [{
                    id: 0,
                    name: '居左',
                    value: 'left'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居右',
                    value: 'right'
                }]
            },
            {
                id: 2,
                name: "垂直安放位置",
                type: "SELECT",
                bind: "title.y",
                values: [{
                    id: 0,
                    name: '居上',
                    value: 'top'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居下',
                    value: 'bottom'
                }]
            },
            {
                id: 3,
                name: "水平对齐方式",
                type: "SELECT",
                bind: "title.textAlign",
                values: [{
                    id: 0,
                    name: '居左',
                    value: 'left'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居右',
                    value: 'right'
                }]
            },
            {
                id: 4,
                type: "LINE",
            },
            {
                id: 5,
                name: "标题块外观",
                type: "TITLE",
            },
            {
                id: 6,
                name: "标题背景颜色",
                type: "COLOR",
                bind: "title.backgroundColor"
            },
            {
                id: 7,
                name: "标题边框线宽",
                max: 20,
                type: "SLIDER",
                unit : 'px',
                bind: "title.borderWidth"
            },
            {
                id: 8,
                name: "标题边框颜色",
                type: "COLOR",
                bind: "title.borderColor"
            },
            {
                id: 9,
                name: "标题内边距",
                default : 5,
                max: 20,
                type: "SLIDER",
                unit : 'px',
                bind: "title.padding"
            },
            {
                id: 10,
                name: "主副标题纵向间隔",
                default : 5,
                max: 40,
                type: "SLIDER",
                unit : 'px',
                bind: "title.itemGap"
            },
            {
                id: 11,
                type: "LINE",
            },
            {
                id: 12,
                name: "主标题文本样式",
                type: "TITLE",
            },
            {
                id: 13,
                name: "文本颜色",
                type: "COLOR",
                bind: "title.textStyle.color"
            },
            {
                id: 14,
                name: "字体大小",
                max: 40,
                default : 20,
                min: 0,
                type: "SLIDER",
                unit : 'px',
                bind: "title.textStyle.fontSize"
            },
            {
                id: 15,
                name: "字体样式",
                type: "SELECT",
                bind: "title.textStyle.fontStyle",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '倾斜',
                    value: 'oblique'
                },
                {
                    id: 2,
                    name: '斜体',
                    value: 'italic'
                },
                ]
            },
            {
                id: 16,
                name: "字体加粗",
                type: "SELECT",
                bind: "title.textStyle.fontWeight",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '加粗',
                    value: 'bold'
                },
                {
                    id: 2,
                    name: '更粗',
                    value: 'bolder'
                },
                {
                    id: 3,
                    name: '更细',
                    value: 'lighter'
                }]
            },
            {
                id: 17,
                name: "文字水平对齐",
                type: "SELECT",
                bind: "title.textStyle.align",
                values: [{
                    id: 0,
                    name: '居左',
                    value: 'left'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居右',
                    value: 'right'
                }]
            },
            {
                id: 18,
                name: "文字垂直对齐",
                type: "SELECT",
                bind: "title.textStyle.baseline",
                values: [{
                    id: 0,
                    name: '居上',
                    value: 'top'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'middle'
                },
                {
                    id: 2,
                    name: '居下',
                    value: 'bottom'
                }]
            },
            {
                id: 19,
                type: "LINE",
            },
            {
                id: 20,
                name: "副标题文本样式",
                type: "TITLE",
            },
            {
                id: 21,
                name: "文本颜色",
                type: "COLOR",
                bind: "title.subtextStyle.color"
            },
            {
                id: 22,
                name: "字体大小",
                max: 40,
                default : 12,
                min: 0,
                type: "SLIDER",
                unit : 'px',
                bind: "title.subtextStyle.fontSize"
            },
            {
                id: 23,
                name: "字体样式",
                type: "SELECT",
                bind: "title.subtextStyle.fontStyle",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '倾斜',
                    value: 'oblique'
                },
                {
                    id: 2,
                    name: '斜体',
                    value: 'italic'
                },
                ]
            },
            {
                id: 24,
                name: "字体加粗",
                type: "SELECT",
                bind: "title.subtextStyle.fontWeight",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '加粗',
                    value: 'bold'
                },
                {
                    id: 2,
                    name: '更粗',
                    value: 'bolder'
                },
                {
                    id: 3,
                    name: '更细',
                    value: 'lighter'
                }]
            },
            {
                id: 25,
                name: "文字水平对齐",
                type: "SELECT",
                bind: "title.subtextStyle.align",
                values: [{
                    id: 0,
                    name: '居左',
                    value: 'left'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居右',
                    value: 'right'
                }]
            },
            {
                id: 26,
                name: "文字垂直对齐",
                type: "SELECT",
                bind: "title.subtextStyle.baseline",
                values: [{
                    id: 0,
                    name: '居上',
                    value: 'top'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居下',
                    value: 'bottom'
                }]
            }]
        }]
    },
    {
        id: 1,
        name: "图例",
        display : ['line','bar','pie'],
        sub: [{
            id: 0,
            name: "基础",
            content: [{
                id: 0,
                name: "是否显示图例",
                type: "SELECT",
                bind: "legend.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: 'true'
                },
                {
                    id: 1,
                    name: '否',
                    value: 'false'
                }]
            },
            {
                id: 1,
                name: "是否显示图例",
                type: "SELECT",
                bind: "legend.selectedMode",
                values: [{
                    id: 0,
                    name: '不可选',
                    value: 'false'
                },
                {
                    id: 1,
                    name: '单选',
                    value: 'single'
                },
                {
                    id: 1,
                    name: '多选',
                    value: 'multiple'
                }]
            },
            {
                id: 2,
                type: "LINE",
            },
            {
                id: 3,
                name: "图例位置",
                type: "TITLE",
            },
            {
                id: 4,
                name: "水平安放位置",
                type: "SELECT",
                bind: "legend.x",
                values: [{
                    id: 0,
                    name: '居左',
                    value: 'left'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居右',
                    value: 'right'
                }]
            },
            {
                id: 5,
                name: "文字垂直对齐",
                type: "SELECT",
                bind: "legend.y",
                values: [{
                    id: 0,
                    name: '居上',
                    value: 'top'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'middle'
                },
                {
                    id: 2,
                    name: '居下',
                    value: 'bottom'
                }]
            },{
                id: 6,
                name: "水平或垂直放置",
                type: "SELECT",
                bind: "legend.orient",
                values: [{
                    id: 0,
                    name: '水平放置',
                    value: 'horizontal'
                },
                {
                    id: 1,
                    name: '垂直放置',
                    value: 'vertical'
                }]
            },{
                id: 7,
                type: "LINE",
            },{
                id: 8,
                name: "图例外观",
                type: "TITLE",
            },{
                id: 9,
                name: "图例背景颜色",
                type: "COLOR",
                bind: "legend.backgroundColor"
            },{
                id: 10,
                name: "图例边框线宽",
                max: 20,
                type: "SLIDER",
                unit : 'px',
                bind: "legend.borderWidth"
            },{
                id: 11,
                name: "图例边框颜色",
                type: "COLOR",
                bind: "legend.borderColor"
            },{
                id: 12,
                name: "图例内边距",
                max: 10,
                default : 5,
                type: "SLIDER",
                unit : 'px',
                bind: "legend.padding"
            },{
                id: 13,
                name: "图例项宽度",
                default : 20,
                max: 100,
                type: "SLIDER",
                unit : 'px',
                bind: "legend.itemWidth"
            },{
                id: 14,
                name: "图例项高度",
                default : 14,
                max: 100,
                type: "SLIDER",
                unit : 'px',
                bind: "legend.itemHeight"
            },{
                id: 14,
                name: "各项目之间间距",
                default : 10,
                max: 100,
                type: "SLIDER",
                unit : 'px',
                bind: "legend.itemGap"
            },{
                id: 15,
                type: "LINE",
            },
            {
                id: 16,
                name: "图例文字样式",
                type: "TITLE",
            },{
                id: 17,
                name: "文本颜色",
                type: "COLOR",
                bind: "legend.textStyle.color"
            },{
                id: 18,
                name: "字体大小",
                min : 0,
                default : 12,
                max: 40,
                type: "SLIDER",
                unit : 'px',
                bind: "legend.textStyle.fontSize"
            },
            {
                id: 19,
                name: "字体样式",
                type: "SELECT",
                bind: "legend.textStyle.fontStyle",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '倾斜',
                    value: 'oblique'
                },
                {
                    id: 2,
                    name: '斜体',
                    value: 'italic'
                }]
            },{
                id: 20,
                name: "字体粗细",
                type: "SELECT",
                bind: "legend.textStyle.fontWeight",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '加粗',
                    value: 'bold'
                },
                {
                    id: 2,
                    name: '更粗',
                    value: 'bolder'
                },{
                    id: 3,
                    name: '更细',
                    value: 'lighter'
                }]
            },{
                id: 21,
                name: "文本水平对齐方式",
                type: "SELECT",
                bind: "legend.textStyle.align",
                values: [{
                    id: 0,
                    name: '居左',
                    value: 'left'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居右',
                    value: 'right'
                }]
            },
            {
                id: 22,
                name: "文字垂直对齐方式",
                type: "SELECT",
                bind: "legend.textStyle.baseline",
                values: [{
                    id: 0,
                    name: '居上',
                    value: 'top'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'middle'
                },
                {
                    id: 2,
                    name: '居下',
                    value: 'bottom'
                }]
            }]
        }]
    },
    {
        id: 2,
        name: "视区",
        display : ['line','bar'],
        sub: [{
            id: 0,
            name: "位置",
            content: [{
                id: 0,
                name: "直角坐标系绘图区域位置",
                type: "TITLE",
            },
            {
                id: 1,
                name: "左上角横坐标",
                default : 80,
                max: 150,
                type: "SLIDER",
                unit : 'px',
                bind: "grid.x"
            },
            {
                id: 1,
                name: "左上角纵坐标",
                default : 60,
                max: 100,
                type: "SLIDER",
                unit : 'px',
                bind: "grid.y"
            },
            {
                id: 2,
                name: "右下角横坐标",
                default : 80,
                max: 150,
                type: "SLIDER",
                unit : 'px',
                bind: "grid.x2"
            },
            {
                id: 3,
                name: "右下角纵坐标",
                default : 60,
                max: 100,
                type: "SLIDER",
                unit : 'px',
                bind: "grid.y2"
            },
            {
                id: 4,
                name: "宽度",
                default : 250,
                max: 1200,
                type: "SLIDER",
                unit : 'px',
                bind: "grid.width"
            },
            {
                id: 5,
                name: "高度",
                default : 100,
                max: 1000,
                type: "SLIDER",
                unit : 'px',
                bind: "grid.height"
            }]
        },
        {
            id: 1,
            name: "外观",
            content: [{
                id: 0,
                name: "直角坐标系绘图区域外观",
                type: "TITLE",
            },
            {
                id: 1,
                name: "绘图区域背景颜色",
                type: "COLOR",
                bind: "grid.backgroundColor"
            },
            {
                id: 2,
                name: "绘图区域边框线宽",
                max: 20,
                type: "SLIDER",
                unit : 'px',
                bind: "grid.borderWidth"
            },
            {
                id: 3,
                name: "绘图区域边框颜色",
                type: "COLOR",
                bind: "grid.borderColor"
            }]
        }]
    },
    {
        id: 3,
        name: "X轴",
        display : ['line','bar'],
        sub: [{
            id: 0,
            name: "基础",
            content : [{
                id: 0,
                name: "坐标轴名称",
                type: "INPUT",
                bind: "xAxis[0].name"
            },{
                id: 1,
                name: "坐标轴名称位置",
                type: "SELECT",
                bind: "xAxis[0].nameLocation",
                values: [{
                    id: 0,
                    name: '位于开端',
                    value: 'start'
                },
                {
                    id: 1,
                    name: '位于末尾',
                    value: 'end'
                }]
            },{
                id: 2,
                name: "坐标轴文字样式",
                type: "TITLE"
            },{
                id: 3,
                name: "文本颜色",
                type: "COLOR",
                bind: "xAxis[0].nameTextStyle.color"
            },{
                id: 4,
                name: "字体大小",
                max: 40,
                default : 12,
                unit : 'px',
                type: "SLIDER",
                bind: "xAxis[0].nameTextStyle.fontSize"
            },{
                id: 5,
                name: "字体样式",
                type: "SELECT",
                bind: "xAxis[0].nameTextStyle.fontStyle",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '倾斜',
                    value: 'oblique'
                },
                {
                    id: 2,
                    name: '斜体',
                    value: 'italic'
                }]
            },{
                id: 6,
                name: "字体粗细",
                type: "SELECT",
                bind: "xAxis[0].nameTextStyle.fontWeight",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '加粗',
                    value: 'bold'
                },
                {
                    id: 2,
                    name: '更粗',
                    value: 'bolder'
                },{
                    id: 3,
                    name: '更细',
                    value: 'lighter'
                }]
            },{
                id: 7,
                name: "文本水平对齐方式",
                type: "SELECT",
                bind: "xAxis[0].nameTextStyle.align",
                values: [{
                    id: 0,
                    name: '居左',
                    value: 'left'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居右',
                    value: 'right'
                }]
            },
            {
                id: 8,
                name: "文字垂直对齐方式",
                type: "SELECT",
                bind: "xAxis[0].nameTextStyle.baseline",
                values: [{
                    id: 0,
                    name: '居上',
                    value: 'top'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'middle'
                },
                {
                    id: 2,
                    name: '居下',
                    value: 'bottom'
                }]
            },{
                id: 9,
                type: "LINE",
            },{
                id: 10,
                name: "坐标轴显示区间策略",
                type: "SELECT",
                bind: "xAxis[0].scale",
                values: [{
                    id: 0,
                    name: '自适应',
                    value: true
                },
                {
                    id: 1,
                    name: '总是饱含0值',
                    value: false
                }]
            },{
                id: 11,
                name: "坐标轴最小值",
                type: "INPUT",
                bind: "xAxis[0].min"
            },
            {
                id: 12,
                name: "坐标轴最大值",
                type: "INPUT",
                bind: "xAxis[0].max"
            },{
                id: 13,
                name: "类目启示和结束两端空白策略",
                type: "SELECT",
                bind: "xAxis[0].boundaryGap",
                values: [{
                    id: 0,
                    name: '留空',
                    value: true
                },
                {
                    id: 1,
                    name: '顶头',
                    value: false
                }]
            },{
                id: 14,
                name: "分割段树",
                max: 300,
                default : 0,
                unit : 'px',
                type: "SLIDER",
                bind: "xAxis[0].splitNumber"
            }]
        },
        {
            id: 1,
            name: "轴线",
            content : [{
                id: 0,
                name: "是否显示轴线",
                type: "SELECT",
                bind: "xAxis[0].axisLine.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 1,
                type: "LINE"
            },{
                id: 2,
                name: "线条特定样式设置",
                type: "TITLE"
            },{
                id: 3,
                name: "线条颜色",
                type: "COLOR",
                bind: "xAxis[0].axisLine.lineStyle.color"
            },{
                id: 4,
                name: "线条宽度",
                max: 20,
                default : 2,
                unit : 'px',
                type: "SLIDER",
                bind: "xAxis[0].axisLine.lineStyle.width"
            },{
                id: 5,
                name: "线条类型",
                type: "SELECT",
                bind: "xAxis[0].axisLine.lineStyle.type",
                values: [{
                    id: 0,
                    name: '实线',
                    value: 'solid'
                },
                {
                    id: 1,
                    name: '点状线',
                    value: 'dotted'
                },
                {
                    id: 2,
                    name: '虚线',
                    value: 'dashed'
                }]
            }]
        },
        {
            id: 2,
            name: "标签",
            content : [{
                id: 0,
                name: "坐标轴文本标签是否显示",
                type: "SELECT",
                bind: "xAxis[0].axisLabel.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 1,
                type: "LINE",
            },{
                id: 2,
                name: "坐标轴文本标签显示间隔",
                max: 100,
                default : 0,
                unit : 'px',
                type: "SLIDER",
                bind: "xAxis[0].axisLabel.interval"
            },{
                id: 3,
                name: "坐标轴文本标签旋转角度",
                max: 180,
                min: -180,
                default : 0,
                unit : 'px',
                type: "SLIDER",
                bind: "xAxis[0].axisLabel.rotate"
            },{
                id: 4,
                name: "坐标轴文本标签与坐标轴的间距",
                max: 100,
                default : 8,
                unit : 'px',
                type: "SLIDER",
                bind: "xAxis[0].axisLabel.margin"
            },{
                id: 5,
                name: "普通提示模板",
                type: "INPUT",
                bind: "xAxis[0].axisLabel.formatter"
            },{
                id: 6,
                name: "坐标轴文本样式",
                type: "TITLE"
            },{
                id: 7,
                name: "文本颜色",
                type: "COLOR",
                bind: "xAxis[0].axisLabel.textStyle.color"
            },{
                id: 8,
                name: "字体大小",
                max: 40,
                default : 12,
                unit : 'px',
                type: "SLIDER",
                bind: "xAxis[0].axisLabel.textStyle.fontSize"
            },{
                id: 9,
                name: "字体样式",
                type: "SELECT",
                bind: "xAxis[0].axisLabel.textStyle.fontStyle",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '倾斜',
                    value: 'oblique'
                },
                {
                    id: 2,
                    name: '斜体',
                    value: 'italic'
                }]
            },{
                id: 10,
                name: "字体粗细",
                type: "SELECT",
                bind: "xAxis[0].axisLabel.textStyle.fontWeight",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '加粗',
                    value: 'bold'
                },
                {
                    id: 2,
                    name: '更粗',
                    value: 'bolder'
                },{
                    id: 3,
                    name: '更细',
                    value: 'lighter'
                }]
            },{
                id: 11,
                name: "文本水平对齐方式",
                type: "SELECT",
                bind: "xAxis[0].axisLabel.textStyle.align",
                values: [{
                    id: 0,
                    name: '居左',
                    value: 'left'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居右',
                    value: 'right'
                }]
            },
            {
                id: 12,
                name: "文字垂直对齐方式",
                type: "SELECT",
                bind: "xAxis[0].axisLabel.textStyle.baseline",
                values: [{
                    id: 0,
                    name: '居上',
                    value: 'top'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'middle'
                },
                {
                    id: 2,
                    name: '居下',
                    value: 'bottom'
                }]
            }]
        },
        {
            id: 3,
            name: "刻度",
            content : [{
                id: 0,
                name: "坐标轴刻度是否显示",
                type: "SELECT",
                bind: "xAxis[0].axisTick.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 1,
                type: "LINE",
            },{
                id: 2,
                name: "宽度显示间隔",
                max: 100,
                default : 0,
                unit : 'px',
                type: "SLIDER",
                bind: "xAxis[0].axisTick.interval"
            },{
                id: 3,
                name: "刻度位置",
                type: "SELECT",
                bind: "xAxis[0].axisTick.inside",
                values: [{
                    id: 0,
                    name: '在内部',
                    value: true
                },
                {
                    id: 1,
                    name: '在外部',
                    value: false
                }]
            },{
                id: 4,
                name: "刻度长度",
                max: 100,
                default : 5,
                unit : 'px',
                type: "SLIDER",
                bind: "xAxis[0].axisTick.length"
            },{
                id: 5,
                name: "线条特定样式设置",
                type: "TITLE"
            },{
                id: 6,
                name: "线条颜色",
                type: "COLOR",
                bind: "xAxis[0].axisTick.lineStyle.color"
            },{
                id: 7,
                name: "线条宽度",
                max: 20,
                default : 1,
                unit : 'px',
                type: "SLIDER",
                bind: "xAxis[0].axisTick.lineStyle.width"
            }]
        },
        {
            id: 4,
            name: "隔线",
            content : [{
                id: 0,
                name: "网格线是否显示",
                type: "SELECT",
                bind: "xAxis[0].splitLine.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 1,
                type: "LINE",
            },{
                id: 2,
                name: "线条特定样式设置",
                type: "TITLE",
            },{
                id: 6,
                name: "线条颜色",
                type: "COLOR",
                bind: "xAxis[0].splitLine.lineStyle.color"
            },{
                id: 7,
                name: "线条宽度",
                max: 20,
                default : 1,
                unit : 'px',
                type: "SLIDER",
                bind: "xAxis[0].splitLine.lineStyle.width"
            },{
                id: 28,
                name: "线条类型",
                type: "SELECT",
                bind: "xAxis[0].splitLine.lineStyle.type",
                values: [{
                    id: 0,
                    name: '实线',
                    value: 'solid'
                },
                {
                    id: 1,
                    name: '点状线',
                    value: 'dotted'
                },
                {
                    id: 2,
                    name: '虚线',
                    value: 'dashed'
                }]
            }]
        },
        {
            id: 5,
            name: "隔区",
            content : [{
                id: 0,
                name: "网格区域是否显示",
                type: "SELECT",
                bind: "xAxis[0].splitArea.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 1,
                type: "LINE",
            },{
                id: 2,
                name: "线条特定样式设置",
                type: "TITLE",
            },{
                id: 3,
                name: "区域是否填充默认颜色",
                type: "SELECT",
                bind: "xAxis[0].splitArea.areaStyle.type",
                values: [{
                    id: 0,
                    name: '填充',
                    value: 'default'
                }]
            },{
                id: 6,
                name: "区域填充自定义颜色",
                type: "COLOR",
                bind: "xAxis[0].splitArea.areaStyle.color"
            }]
        }]
    },
    {
        id: 4,
        name: "Y轴",
        display : ['line','bar'],
        sub : [{
            id: 0,
            name: "基础",
            content : [{
                id: 0,
                name: "坐标轴名称",
                type: "INPUT",
                bind: "yAxis[0].name"
            },{
                id: 1,
                name: "坐标轴名称位置",
                type: "SELECT",
                bind: "yAxis[0].nameLocation",
                values: [{
                    id: 0,
                    name: '位于开端',
                    value: 'end'
                },
                {
                    id: 1,
                    name: '位于末尾',
                    value: 'start'
                }]
            },{
                id: 2,
                name: "坐标轴文字样式",
                type: "TITLE"
            },{
                id: 3,
                name: "文本颜色",
                type: "COLOR",
                bind: "yAxis[0].nameTextStyle.color"
            },{
                id: 4,
                name: "字体大小",
                max: 40,
                default : 12,
                unit : 'px',
                type: "SLIDER",
                bind: "yAxis[0].nameTextStyle.fontSize"
            },{
                id: 5,
                name: "字体样式",
                type: "SELECT",
                bind: "yAxis[0].nameTextStyle.fontStyle",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '倾斜',
                    value: 'oblique'
                },
                {
                    id: 2,
                    name: '斜体',
                    value: 'italic'
                }]
            },{
                id: 6,
                name: "字体粗细",
                type: "SELECT",
                bind: "yAxis[0].nameTextStyle.fontWeight",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '加粗',
                    value: 'bold'
                },
                {
                    id: 2,
                    name: '更粗',
                    value: 'bolder'
                },{
                    id: 3,
                    name: '更细',
                    value: 'lighter'
                }]
            },{
                id: 7,
                name: "文本水平对齐方式",
                type: "SELECT",
                bind: "yAxis[0].nameTextStyle.align",
                values: [{
                    id: 0,
                    name: '居左',
                    value: 'left'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居右',
                    value: 'right'
                }]
            },
            {
                id: 8,
                name: "文字垂直对齐方式",
                type: "SELECT",
                bind: "yAxis[0].nameTextStyle.baseline",
                values: [{
                    id: 0,
                    name: '居上',
                    value: 'top'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'middle'
                },
                {
                    id: 2,
                    name: '居下',
                    value: 'bottom'
                }]
            },{
                id: 9,
                type: "LINE",
            },{
                id: 10,
                name: "坐标轴显示区间策略",
                type: "SELECT",
                bind: "yAxis[0].scale",
                values: [{
                    id: 0,
                    name: '自适应',
                    value: true
                },
                {
                    id: 1,
                    name: '总是饱含0值',
                    value: false
                }]
            },{
                id: 11,
                name: "坐标轴最小值",
                type: "INPUT",
                bind: "yAxis[0].min"
            },
            {
                id: 12,
                name: "坐标轴最大值",
                type: "INPUT",
                bind: "yAxis[0].max"
            },{
                id: 13,
                name: "类目启示和结束两端空白策略",
                type: "SELECT",
                bind: "yAxis[0].boundaryGap",
                values: [{
                    id: 0,
                    name: '留空',
                    value: true
                },
                {
                    id: 1,
                    name: '顶头',
                    value: false
                }]
            },{
                id: 14,
                name: "分割段树",
                max: 300,
                default : 0,
                unit : 'px',
                type: "SLIDER",
                bind: "yAxis[0].splitNumber"
            }]
        },
        {
            id: 1,
            name: "轴线",
            content : [{
                id: 0,
                name: "是否显示轴线",
                type: "SELECT",
                bind: "yAxis[0].axisLine.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 1,
                type: "LINE"
            },{
                id: 2,
                name: "线条特定样式设置",
                type: "TITLE"
            },{
                id: 3,
                name: "线条颜色",
                type: "COLOR",
                bind: "yAxis[0].axisLine.lineStyle.color"
            },{
                id: 4,
                name: "线条宽度",
                max: 20,
                default : 2,
                unit : 'px',
                type: "SLIDER",
                bind: "yAxis[0].axisLine.lineStyle.width"
            },{
                id: 5,
                name: "线条类型",
                type: "SELECT",
                bind: "yAxis[0].axisLine.lineStyle.type",
                values: [{
                    id: 0,
                    name: '实线',
                    value: 'solid'
                },
                {
                    id: 1,
                    name: '点状线',
                    value: 'dotted'
                },
                {
                    id: 2,
                    name: '虚线',
                    value: 'dashed'
                }]
            }]
        },
        {
            id: 2,
            name: "标签",
            content : [{
                id: 0,
                name: "坐标轴文本标签是否显示",
                type: "SELECT",
                bind: "yAxis[0].axisLabel.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 1,
                type: "LINE",
            },{
                id: 2,
                name: "坐标轴文本标签显示间隔",
                max: 100,
                default : 0,
                unit : 'px',
                type: "SLIDER",
                bind: "yAxis[0].axisLabel.interval"
            },{
                id: 3,
                name: "坐标轴文本标签旋转角度",
                max: 180,
                min: -180,
                default : 0,
                unit : 'px',
                type: "SLIDER",
                bind: "yAxis[0].axisLabel.rotate"
            },{
                id: 4,
                name: "坐标轴文本标签与坐标轴的间距",
                max: 100,
                default : 8,
                unit : 'px',
                type: "SLIDER",
                bind: "yAxis[0].axisLabel.margin"
            },{
                id: 5,
                name: "普通提示模板",
                type: "INPUT",
                bind: "yAxis[0].axisLabel.formatter"
            },{
                id: 6,
                name: "坐标轴文本样式",
                type: "TITLE"
            },{
                id: 7,
                name: "文本颜色",
                type: "COLOR",
                bind: "yAxis[0].axisLabel.textStyle.color"
            },{
                id: 8,
                name: "字体大小",
                max: 40,
                default : 12,
                unit : 'px',
                type: "SLIDER",
                bind: "yAxis[0].axisLabel.textStyle.fontSize"
            },{
                id: 9,
                name: "字体样式",
                type: "SELECT",
                bind: "yAxis[0].axisLabel.textStyle.fontStyle",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '倾斜',
                    value: 'oblique'
                },
                {
                    id: 2,
                    name: '斜体',
                    value: 'italic'
                }]
            },{
                id: 10,
                name: "字体粗细",
                type: "SELECT",
                bind: "yAxis[0].axisLabel.textStyle.fontWeight",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '加粗',
                    value: 'bold'
                },
                {
                    id: 2,
                    name: '更粗',
                    value: 'bolder'
                },{
                    id: 3,
                    name: '更细',
                    value: 'lighter'
                }]
            },{
                id: 11,
                name: "文本水平对齐方式",
                type: "SELECT",
                bind: "yAxis[0].axisLabel.textStyle.align",
                values: [{
                    id: 0,
                    name: '居左',
                    value: 'left'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居右',
                    value: 'right'
                }]
            },
            {
                id: 12,
                name: "文字垂直对齐方式",
                type: "SELECT",
                bind: "yAxis[0].axisLabel.textStyle.baseline",
                values: [{
                    id: 0,
                    name: '居上',
                    value: 'top'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'middle'
                },
                {
                    id: 2,
                    name: '居下',
                    value: 'bottom'
                }]
            }]
        },
        {
            id: 3,
            name: "刻度",
            content : [{
                id: 0,
                name: "坐标轴刻度是否显示",
                type: "SELECT",
                bind: "yAxis[0].axisTick.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 1,
                type: "LINE",
            },{
                id: 2,
                name: "宽度显示间隔",
                max: 100,
                default : 0,
                unit : 'px',
                type: "SLIDER",
                bind: "yAxis[0].axisTick.interval"
            },{
                id: 3,
                name: "刻度位置",
                type: "SELECT",
                bind: "yAxis[0].axisTick.inside",
                values: [{
                    id: 0,
                    name: '在内部',
                    value: true
                },
                {
                    id: 1,
                    name: '在外部',
                    value: false
                }]
            },{
                id: 4,
                name: "刻度长度",
                max: 100,
                default : 5,
                unit : 'px',
                type: "SLIDER",
                bind: "yAxis[0].axisTick.length"
            },{
                id: 5,
                name: "线条特定样式设置",
                type: "TITLE"
            },{
                id: 6,
                name: "线条颜色",
                type: "COLOR",
                bind: "yAxis[0].axisTick.lineStyle.color"
            },{
                id: 7,
                name: "线条宽度",
                max: 20,
                default : 1,
                unit : 'px',
                type: "SLIDER",
                bind: "yAxis[0].axisTick.lineStyle.width"
            }]
        },
        {
            id: 4,
            name: "隔线",
            content : [{
                id: 0,
                name: "网格线是否显示",
                type: "SELECT",
                bind: "yAxis[0].splitLine.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 1,
                type: "LINE",
            },{
                id: 2,
                name: "线条特定样式设置",
                type: "TITLE",
            },{
                id: 6,
                name: "线条颜色",
                type: "COLOR",
                bind: "yAxis[0].splitLine.lineStyle.color"
            },{
                id: 7,
                name: "线条宽度",
                max: 20,
                default : 1,
                unit : 'px',
                type: "SLIDER",
                bind: "yAxis[0].splitLine.lineStyle.width"
            },{
                id: 28,
                name: "线条类型",
                type: "SELECT",
                bind: "yAxis[0].splitLine.lineStyle.type",
                values: [{
                    id: 0,
                    name: '实线',
                    value: 'solid'
                },
                {
                    id: 1,
                    name: '点状线',
                    value: 'dotted'
                },
                {
                    id: 2,
                    name: '虚线',
                    value: 'dashed'
                }]
            }]
        },
        {
            id: 5,
            name: "隔区",
            content : [{
                id: 0,
                name: "网格区域是否显示",
                type: "SELECT",
                bind: "yAxis[0].splitArea.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 1,
                type: "LINE",
            },{
                id: 2,
                name: "线条特定样式设置",
                type: "TITLE",
            },{
                id: 3,
                name: "区域是否填充默认颜色",
                type: "SELECT",
                bind: "yAxis[0].splitArea.areaStyle.type",
                values: [{
                    id: 0,
                    name: '填充',
                    value: 'default'
                }]
            },{
                id: 6,
                name: "区域填充自定义颜色",
                type: "COLOR",
                bind: "yAxis[0].splitArea.areaStyle.color"
            }]
        }]
    },
    {
        id: 5,
        name: "提示",
        display : ['line','bar','pie'],
        sub: [{
            id: 0,
            name: "通用",
            content : [{
                id: 0,
                name: "是否使用提示",
                type: "SELECT",
                bind: "tooltip.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 2,
                type: "LINE",
            },
            {
                id: 3,
                name: "各式模板",
                type: "TITLE",
            },
            {
                id: 4,
                name: "普通提示模板",
                type: "INPUT",
                bind: "tooltip.formatter"
            },
            {
                id: 5,
                name: "孤岛提示模板",
                type: "INPUT",
                bind: "tooltip.islandFormatter"
            },
            {
                id: 6,
                type: "LINE",
            },
            {
                id: 7,
                name: "提示外观",
                type: "TITLE",
            },{
                id: 8,
                name: "背景颜色",
                type: "COLOR",
                bind: "tooltip.backgroundColor"
            },{
                id: 9,
                name: "边框粗细",
                max: 30,
                type: "SLIDER",
                unit : 'px',
                bind: "tooltip.borderWidth"
            },{
                id: 10,
                name: "边框颜色",
                type: "COLOR",
                bind: "tooltip.borderColor"
            },{
                id: 11,
                name: "边框圆角",
                max: 15,
                default : 4,
                type: "SLIDER",
                unit : 'px',
                bind: "tooltip.borderRadius"
            },{
                id: 12,
                name: "内边距",
                default : 5,
                max: 10,
                type: "SLIDER",
                unit : 'px',
                bind: "tooltip.padding"
            },{
                id: 13,
                type: "LINE",
            },
            {
                id: 14,
                name: "提示文本样式",
                type: "TITLE",
            },{
                id: 15,
                name: "文本颜色",
                type: "COLOR",
                bind: "tooltip.textStyle.color"
            },{
                id: 16,
                name: "字体大小",
                max: 40,
                default : 12,
                unit : 'px',
                type: "SLIDER",
                bind: "tooltip.textStyle.fontSize"
            },{
                id: 17,
                name: "字体样式",
                type: "SELECT",
                bind: "tooltip.textStyle.fontStyle",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '倾斜',
                    value: 'oblique'
                },
                {
                    id: 2,
                    name: '斜体',
                    value: 'italic'
                }]
            },{
                id: 18,
                name: "字体粗细",
                type: "SELECT",
                bind: "tooltip.textStyle.fontWeight",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '加粗',
                    value: 'bold'
                },
                {
                    id: 2,
                    name: '更粗',
                    value: 'bolder'
                },{
                    id: 3,
                    name: '更细',
                    value: 'lighter'
                }]
            },{
                id: 19,
                name: "文本水平对齐方式",
                type: "SELECT",
                bind: "tooltip.textStyle.align",
                values: [{
                    id: 0,
                    name: '居左',
                    value: 'left'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居右',
                    value: 'right'
                }]
            },
            {
                id: 20,
                name: "文字垂直对齐方式",
                type: "SELECT",
                bind: "tooltip.textStyle.baseline",
                values: [{
                    id: 0,
                    name: '居上',
                    value: 'top'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'middle'
                },
                {
                    id: 2,
                    name: '居下',
                    value: 'bottom'
                }]
            },{
                id: 21,
                type: "LINE",
            },
            {
                id: 22,
                name: "提示指示器设置",
                type: "TITLE",
            },{
                id: 23,
                name: "提示触发点",
                type: "SELECT",
                bind: "tooltip.trigger",
                values: [{
                    id: 0,
                    name: '在项上触发',
                    value: 'item'
                },
                {
                    id: 1,
                    name: '在轴上触发',
                    value: 'axis'
                }]
            },{
                id: 23,
                name: "提示指示器类型",
                type: "SELECT",
                bind: "tooltip.axisPointer.type",
                values: [{
                    id: 0,
                    name: '提示线',
                    value: 'line'
                },
                {
                    id: 1,
                    name: '提示阴影',
                    value: 'shadow'
                },
                {
                    id: 2,
                    name: '无',
                    value: 'none'
                }]
            },{
                id: 24,
                type: "LINE",
            },
            {
                id: 25,
                name: "提线样式设置",
                type: "TITLE",
            },{
                id: 26,
                name: "线条颜色",
                type: "COLOR",
                bind: "tooltip.axisPointer.lineStyle.color"
            },{
                id: 27,
                name: "线条宽度",
                max: 10,
                default : 2,
                unit : 'px',
                type: "SLIDER",
                bind: "tooltip.axisPointer.lineStyle.width"
            },{
                id: 28,
                name: "线条样式",
                type: "SELECT",
                bind: "tooltip.axisPointer.lineStyle.type",
                values: [{
                    id: 0,
                    name: '实线',
                    value: 'solid'
                },
                {
                    id: 1,
                    name: '点状线',
                    value: 'dotted'
                },
                {
                    id: 2,
                    name: '虚线',
                    value: 'dashed'
                }]
            },{
                id: 29,
                name: "提示阴影样式设置",
                type: "TITLE",
            },{
                id: 30,
                name: "是否填充默认色",
                type: "SELECT",
                bind: "tooltip.axisPointer.areaStyle.type",
                values: [{
                    id: 0,
                    name: '填充',
                    value: 'solid'
                }]
            },{
                id: 31,
                name: "区域填充颜色自定义",
                type: "COLOR",
                bind: "tooltip.axisPointer.areaStyle.color"
            },{
                id: 32,
                type: "LINE",
            },
            {
                id: 33,
                name: "延时和动画",
                type: "TITLE",
            },{
                id: 34,
                name: "显示延迟",
                max: 1000,
                default : 0,
                unit : 'ms',
                type: "SLIDER",
                bind: "tooltip.showDelay"
            },{
                id: 35,
                name: "隐藏延迟",
                max: 1000,
                default : 100,
                unit : 'ms',
                type: "SLIDER",
                bind: "tooltip.hideDelay"
            },{
                id: 36,
                name: "动画变换时长",
                max: 1000,
                unit : 'ms',
                default : 0,
                type: "SLIDER",
                bind: "tooltip.transitionDuration"
            }]
        }]
    },
    {
        id: 6,
        name: "工具",
        display : ['line','bar','pie'],
        sub: [{
            id: 0,
            name: "通用",
            content:[{
                id: 0,
                name: "是否显示工具箱",
                type: "SELECT",
                bind: "toolbox.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 2,
                type: "LINE"
            },
            {
                id: 3,
                name: "各式模板",
                type: "TITLE"
            },{
                id: 4,
                name: "水平安放位置",
                type: "SELECT",
                bind: "toolbox.x",
                values: [{
                    id: 0,
                    name: '居左',
                    value: 'left'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居右',
                    value: 'right'
                }]
            },
            {
                id: 5,
                name: "垂直安放位置",
                type: "SELECT",
                bind: "toolbox.y",
                values: [{
                    id: 0,
                    name: '居上',
                    value: 'top'
                },
                {
                    id: 1,
                    name: '居中',
                    value: 'center'
                },
                {
                    id: 2,
                    name: '居下',
                    value: 'bottom'
                }]
            },
            {
                id: 6,
                name: "水平或垂直放置",
                type: "SELECT",
                bind: "toolbox.orient",
                values: [{
                    id: 0,
                    name: '水平放置',
                    value: 'horizontal'
                },
                {
                    id: 1,
                    name: '垂直放置',
                    value: 'vertical'
                }]
            },{
                id: 7,
                type: "LINE"
            },
            {
                id: 8,
                name: "功能按钮",
                type: "TITLE"
            },{
                id: 9,
                name: "绘制辅助线功能按钮",
                type: "SELECT",
                bind: "toolbox.feature.mark.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 10,
                name: "选区缩放功能按钮",
                type: "SELECT",
                bind: "toolbox.feature.dataZoom.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 10,
                name: "切换至数据视图按钮",
                type: "SELECT",
                bind: "toolbox.feature.dataView.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 11,
                name: "折柱切换按钮",
                type: "SELECT",
                bind: "toolbox.feature.magicType.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 12,
                name: "还原按钮",
                type: "SELECT",
                bind: "toolbox.feature.restore.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 13,
                name: "保存为图片按钮",
                type: "SELECT",
                bind: "toolbox.feature.saveAsImage.show",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 14,
                type: "LINE"
            },
            {
                id: 15,
                name: "工具箱外观",
                type: "TITLE"
            },{
                id: 16,
                name: "工具箱背景颜色",
                type: "COLOR",
                bind: "toolbox.backgroundColor"
            },{
                id: 17,
                name: "工具箱边框宽",
                max: 30,
                default : 0,
                unit : 'px',
                type: "SLIDER",
                bind: "toolbox.borderWidth"
            },{
                id: 18,
                name: "工具箱边框颜色",
                type: "COLOR",
                bind: "toolbox.borderColor"
            },{
                id: 19,
                name: "图例内边距",
                max: 10,
                default : 5,
                unit : 'px',
                type: "SLIDER",
                bind: "toolbox.padding"
            },{
                id: 20,
                name: "工具箱每项大小",
                max: 100,
                default : 16,
                unit : 'px',
                type: "SLIDER",
                bind: "toolbox.itemSize"
            },{
                id: 21,
                name: "工具箱各项之间间隔",
                max: 100,
                default : 10,
                unit : 'px',
                type: "SLIDER",
                bind: "toolbox.itemGap"
            },{
                id: 22,
                type: "LINE"
            },
            {
                id: 23,
                name: "鼠标放上时的文字设置",
                type: "TITLE"
            },{
                id: 24,
                name: "鼠标放上文字提示",
                type: "SELECT",
                bind: "toolbox.showTitle",
                values: [{
                    id: 0,
                    name: '是',
                    value: true
                },
                {
                    id: 1,
                    name: '否',
                    value: false
                }]
            },{
                id: 25,
                name: "字体大小",
                max: 40,
                default : 20,
                min: 0,
                type: "SLIDER",
                unit : 'px',
                bind: "toolbox.textStyle.fontSize"
            },
            {
                id: 26,
                name: "字体样式",
                type: "SELECT",
                bind: "toolbox.textStyle.fontStyle",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '倾斜',
                    value: 'oblique'
                },
                {
                    id: 2,
                    name: '斜体',
                    value: 'italic'
                },
                ]
            },
            {
                id: 27,
                name: "字体加粗",
                type: "SELECT",
                bind: "toolbox.textStyle.fontWeight",
                values: [{
                    id: 0,
                    name: '普通',
                    value: 'normal'
                },
                {
                    id: 1,
                    name: '加粗',
                    value: 'bold'
                },
                {
                    id: 2,
                    name: '更粗',
                    value: 'bolder'
                },
                {
                    id: 3,
                    name: '更细',
                    value: 'lighter'
                }]
            }]
        }]
    }])
})