define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('ViewForceCtrl', ['$scope', '$routeParams', 'resourceUIService', 'alertService', 'SwSocket', 'Info',
    function($scope, $routeParams, resourceUIService, alertService, SwSocket, Info) {
      console.info("切换到力导向图");

      var getOption = function() {
        var selectedforceitem;
        for(var i in resourceUIService.selectedInstances) {
          var page = resourceUIService.selectedInstances[i];
          if(page.code == $routeParams.ciid) {
            selectedforceitem = page;
          }
        }
        var option = {
          title: {
            text: '设备关系图：' + selectedforceitem.label,
            subtext: '数据来深度搜索和分享',
            x: 'right',
            y: 'bottom'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} : {b}'
          },
          toolbox: {
            show: true,
            feature: {
              restore: {
                show: true
              },
              magicType: {
                show: true,
                type: ['force', 'chord']
              },
              saveAsImage: {
                show: true
              }
            }
          },
          legend: {
            x: 'left',
            data: ['告警', '事件']
          },
          series: [{
            type: 'force',
            name: "设备关系",
            ribbonType: false,
            categories: [{
              name: '设备'
            }, {
              name: '告警'
            }, {
              name: '事件'
            }],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: {
                    color: '#333'
                  }
                },
                nodeStyle: {
                  brushType: 'both',
                  borderColor: 'rgba(255,215,0,0.4)',
                  borderWidth: 1
                },
                linkStyle: {
                  type: 'curve'
                }
              },
              emphasis: {
                label: {
                  show: false
                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                },
                nodeStyle: {
                  //r: 30
                },
                linkStyle: {}
              }
            },
            useWorker: false,
            minRadius: 15,
            maxRadius: 25,
            gravity: 1.1,
            scaling: 1.1,
            roam: 'move',
            nodes: [{
              category: 0,
              name: selectedforceitem.label,
              value: 10,
              label: selectedforceitem.label
            }, {
              category: 1,
              name: '普通告警',
              value: 2
            }, {
              category: 1,
              name: '一般告警',
              value: 3
            }, {
              category: 1,
              name: '严重告警',
              value: 3
            }, {
              category: 1,
              name: '紧急告警',
              value: 7
            }, {
              category: 2,
              name: '上线事件',
              value: 5
            }, {
              category: 2,
              name: '下线事件',
              value: 8
            }, {
              category: 2,
              name: '维修事件',
              value: 9
            }, {
              category: 2,
              name: '其他事件1',
              value: 4
            }, {
              category: 2,
              name: '其他事件2',
              value: 4
            }, {
              category: 2,
              name: '其他事件3',
              value: 1
            }, ],
            links: [{
              source: '普通告警',
              target: selectedforceitem.label,
              weight: 1,
              name: '女儿'
            }, {
              source: '一般告警',
              target: selectedforceitem.label,
              weight: 2,
              name: '父亲'
            }, {
              source: '严重告警',
              target: selectedforceitem.label,
              weight: 1,
              name: '母亲'
            }, {
              source: '紧急告警',
              target: selectedforceitem.label,
              weight: 2
            }, {
              source: '上线事件',
              target: selectedforceitem.label,
              weight: 3,
              name: '合伙人'
            }, {
              source: '下线事件',
              target: selectedforceitem.label,
              weight: 1
            }, {
              source: '维修事件',
              target: selectedforceitem.label,
              weight: 6,
              name: '竞争对手'
            }, {
              source: '其他事件1',
              target: selectedforceitem.label,
              weight: 1,
              name: '爱将'
            }, {
              source: '其他事件2',
              target: selectedforceitem.label,
              weight: 1
            }, {
              source: '其他事件3',
              target: selectedforceitem.label,
              weight: 1
            }, {
              source: '严重告警',
              target: '一般告警',
              weight: 1
            }, {
              source: '下线事件',
              target: '一般告警',
              weight: 1
            }, {
              source: '下线事件',
              target: '严重告警',
              weight: 1
            }, {
              source: '下线事件',
              target: '紧急告警',
              weight: 1
            }, {
              source: '下线事件',
              target: '上线事件',
              weight: 1
            }, {
              source: '维修事件',
              target: '下线事件',
              weight: 6
            }, {
              source: '维修事件',
              target: '严重告警',
              weight: 1
            }, {
              source: '其他事件2',
              target: '下线事件',
              weight: 1
            }]
          }]
        };
        $scope.$broadcast(Event.ECHARTINFOSINIT, {
          "option": option
        });
      }

      var info = Info.get("localdb/info.json", function(info) {
        getOption();
      });
    }
  ]);
});