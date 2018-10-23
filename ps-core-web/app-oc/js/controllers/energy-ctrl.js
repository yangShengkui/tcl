define(['controllers/controllers', 'bootstrap-dialog', 'Array'], function(controllers, BootstrapDialog) {
  'use strict';
  //能耗结构管理
  controllers.initController('energyStructureCtrl', ['$scope', '$routeParams', '$q', '$timeout', '$location', 'ngDialog', 'userLoginUIService', 'resourceUIService', 'energyConsumeUIService', 'growl', function($scope, $routeParams, $q, $timeout, $location, ngDialog, userLoginUIService, resourceUIService, energyConsumeUIService, growl) {
    var structureList;
    $scope.$watch("myDicts", function(n, o) {
      if (n) {
        $scope.energyTypeList = $scope.myDicts['energyType'];
        $scope.dataSourceTypeList = $scope.myDicts['dataSourceType'];
      }
    });
    $scope.energyStrucInfo = {
      title: "能耗结构管理",
      query: "", //查询字段
      statisticsType: "", //显示类型
      statisticsTypeList: {
        MONTH: '月',
        YEAR: '年',
        QUARTER: '季度'
      },
      ifShow: userLoginUIService.user.userType == 1000 ? true : false,
      commitFun: function() {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '提交后将不能进行修改和删除，确认提交吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              energyConsumeUIService.saveEnergyConsumeTree(function(returnObj) {
                if (returnObj.code == 0) {
                  $scope.ifCommit = true;
                  growl.success("能耗结构已提交", {});
                  $scope.$broadcast("commit");
                  dialogRef.close();
                }
              })
            }
          }, {
            label: '取消',
            action: function(dialogRef) {
              $scope.ifCommit = false;
              dialogRef.close();
            }
          }]
        });
      }
    };

    var createTree = function(data) {
      var rs;
      var loop = function(item) {
        var parentID = item.parentID;
        var parent = data.find(function(elem) { //找父亲，根据parentId来找
          return parentID == elem.id;
        });
        if (parent) {
          if (parent.children == undefined) {
            parent.children = []; //给找着的父亲添加孩子属性，如果它还没有孩子的话
          }
          item.parent = parent; //给传进来的数据，把这个父亲的属性添加进去
          Object.defineProperty(item, "parent", {
            enumerable: false
          });
          parent.children.push(item) //并把自己的这条数据放进父亲的属性中
        } else {
          item.parent = null;
          Object.defineProperty(item, "parent", {
            enumerable: false
          });
          rs = item;
        };
      };
      for (var i in data) {
        loop(data[i]);
      }
      return rs;
    };

    $scope.startSearch = function() {
      var listData = structureList.filter(function(elem) {
        return elem.name.indexOf($scope.query) != -1;
      });
      if ($scope.query != '' && $scope.query != undefined) {
        $scope.$broadcast("FILTERDATA", listData);
      } else {
        $scope.$broadcast("FILTERDATA_allData");
      }
    };

    $timeout(function() {
      $scope.$broadcast(Event.ENTERPRISEINIT + "_energy", {
        "option": []
      });

    })

    //获取节点信息
    if ($routeParams.enterpriseId) {
      energyConsumeUIService.queryDomainsByEnterpriseId($routeParams.enterpriseId, function(returnObj) {
        if (returnObj.code == 0) {
          structureList = returnObj.data;
          $scope.structureData = createTree(structureList);
        }
      })
    } else {
      resourceUIService.getDomainsByFilter([{
        "modelId": 303
      }], function(returnObj) {
        if (returnObj.code == 0) {
          var state = returnObj.data.some(function(item) {
            return item.commit == 'yes';
          });
          structureList = returnObj.data;
          $scope.structureData = createTree(structureList);
          if (state) { //提交
            $scope.ifCommit = true;
          } else {
            $scope.ifCommit = false;
          }
        }
      });
    }

    var init = function() {
      // findEnterpriseInfoById();

    };

    /**
     * 监听登录状态
     */
    if (!userLoginUIService.user.isAuthenticated) {
      $scope.$on('loginStatusChanged', function(evt, d) {
        if (userLoginUIService.user.isAuthenticated) {
          init();
        }
      });
    } else {
      init();
    }

  }]);

  //能源折标系数管理
  controllers.initController('energySignatureCtrl', ['$scope', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'unitService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'userDomainService', function($scope, $routeParams, $timeout, $q, $location, ngDialog, unitService, userLoginUIService, energyConsumeUIService, growl, userDomainService) {
    if ($routeParams.viewType == 'View') {
      $scope.view = true;
    }
    var energySignatureTypeId = $routeParams.signatureId;
    $scope.selectedCount = 0;
    $scope.$watch("myDicts", function(n, o) {
      if (n) {
        var energyTypeList = $scope.myDicts['energyType'];
        $scope.energyTypeList = energyTypeList;
        energyTypeList.forEach(function(item) {
          item.id = item.valueCode;
          item.text = item.label;
        });

      }
    });
    var broardFun = function(type, objList) {
      if (type == 'edit_convert') {
        $timeout(function() {
          $scope.$broadcast(Event.ENTERPRISEINIT + "_convertedit", {
            "option": [objList]
          });
        })
      } else if (type == 'convert') {
        $timeout(function() {
          $scope.$broadcast(Event.ENTERPRISEINIT + "_convert", {
            "option": [objList]
          });
        })
      }
    };

    //初始化数据
    var initData = function() {
      $scope.dialog.input = {
        energyType: '',
        valentweight: '',
        equal: '',
        createTime: new Date(),
        id: -1
      };
    };

    //折标系数dialog
    $scope.dialog = {
      title: "能源折标系数",
      input: {
        energyType: "", //能源类型
        valentweight: "", //当量系数
        equal: "", //等价系数
        // id: -1,
        createTime: new Date()
      },
      select: {
        // energyTypeList: energyTypeList
      },
      button: [{
        label: "确定",
        disabled: function() {
          var every = scope.dialog.input.every(function(elem) {
            return elem.right != false;
          });
          return !every;
        },
        fn: function() {
          if (!$scope.tableInit.input.convertStandardYear) {
            growl.warning("请选择生效年度", {});
            return;
          }
          var dataObj = $scope.dialog.input,
            index = 0;
          $scope.queryConvertList.forEach(function(item) {
            if (item.createTime == dataObj.createTime) { //编辑
              item.energyType = dataObj.energyType;
              item.equal = dataObj.equal;
              item.valentweight = dataObj.valentweight;
              index++;
            }
          });
          if (index == 0) {
            delete dataObj.id;
            $scope.queryConvertList.push(dataObj);
          }

          broardFun('edit_convert', $scope.queryConvertList);
          growl.info("请点击“保存模板”按钮，以便对修改的内容进行保存！", {});

          // if ($scope.dialog.input.id == -1) { //新增
          //   energyConsumeUIService.addEnergyConvertStandardDetail([dataObj], addproduct_callback);
          // } else if ($scope.dialog.input.id > 0) { //编辑           
          //   energyConsumeUIService.updateEnergyConvertStandardDetail([dataObj], updataproduct_callback);
          // }
          ngDialog.close();
        }
      }, {
        label: "取消",
        fn: function() {
          ngDialog.close();
        }
      }]
    };

    //验证阈值
    $scope.mistakeMesg = {};
    $scope.verifyFun = function(value, type) {
      var reg, r;
      reg = /^[+-]?([1-9][0-9]*|0)(\.[0-9]+)?%?$/; //全体实数
      r = reg.test(value);
      if (!r) { //不为数字
        $scope.mistakeMesg[type] = true;
      } else {
        $scope.mistakeMesg[type] = false;
      }
    };

    //折标
    $scope.tableInit = {
      'header': {
        'label': "能源折标系数管理",
        'delete': "删除折标系数"
      },
      'input': {
        'convertStandardYear': '',
        'state': '',
        'id': -1
      },
      'select': {
        'year': (function() {
          var yearList = [];
          for (var i = 2015; i < 2026; i++) {
            yearList.push({
              id: i,
              text: i + '年'
            })
          };
          return yearList;
        })()
      },
      'event': {
        'addClick': function() {
          window.location.href = './index.html#/energySignatureInfo/' + '0';
        },
        'addEnergyClick': function() {
          initData();
          ngDialog.open({
            template: '../partials/dialogue/energy_signatrue_dia.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });
        },
        'saveClick': function() {
          if (!$scope.tableInit.input.convertStandardYear) {
            growl.warning("请选择生效年度", {});
            return;
          }
          var addproduct_callback = function(returnObj) {
            if (returnObj.code == 0) {
              $scope.tableInit.input.id = returnObj.data.energyConvertStandard.id;
              // $scope.queryAllList.push(returnObj.data.energyConvertStandard);
              // broardFun('convert', $scope.queryAllList);
              growl.success("能源折标系数添加成功", {});
            }
          };
          var updataproduct_callback = function(returnObj) {
            if (returnObj.code == 0) {
              growl.success("能源折标系数修改成功", {});
              return;
              // $scope.queryAllList.forEach(function(item) {
              //   if (item.id == $scope.tableInit.input.id) {
              //     $.extend(item, returnObj.data.energyConvertStandard);
              //   }
              //   broardFun('convert', $scope.queryAllList);
              //   growl.success("能源折标系数修改成功", {});
              //   return;
              // })
            }
          };


          if ($scope.tableInit.input.id == -1) { //新增
            var param = [{
              energyConvertStandard: {
                "convertStandardYear": $scope.tableInit.input.convertStandardYear
              },
              energyConvertStandardDetails: $scope.queryConvertList
            }];
            energyConsumeUIService.addEnergyConvertStandardDto(param, addproduct_callback);
          } else if ($scope.tableInit.input.id > 0) { //编辑
            var param = [{
              energyConvertStandard: {
                "id": parseInt($scope.tableInit.input.id),
                "convertStandardYear": $scope.tableInit.input.convertStandardYear
              },
              energyConvertStandardDetails: $scope.queryConvertList
            }];
            energyConsumeUIService.updateEnergyConvertStandardDto(param, updataproduct_callback);
          }
        },
        'copyClick': function() {
          energyConsumeUIService.copyEnergyConvertStandardDto([$scope.selectedCount], function(returnObj) {
            if (returnObj.code == 0) {
              $scope.queryAllList.push(returnObj.data);
              broardFun('convert', $scope.queryAllList);
              growl.success("成功复制折标系数", {});
              $scope.selectedCount = 0;
            }
          })
        },
        'goClear': function() {
          $scope.tableInit.select.convertStandardYear = $scope.queryState.state == 1 ? $scope.tableInit.select.convertStandardYear : null;
          $scope.tableInit.select.state = $scope.queryState.state == 1 ? $scope.tableInit.select.state : null;
        }
      }
    };

    //table动作
    $scope.doAction = function(type, select, callback) {
      if (type == 'delete') {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '确认删除该折标系数？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              energyConsumeUIService.deleteEnergyConvertStandardDto([select], function(returnObj) {
                callback(returnObj);
                if (returnObj.code == 0) {
                  select.forEach(function(sel) {
                    for (var i in $scope.queryAllList) {
                      if (sel == $scope.queryAllList[i].id) {
                        $scope.queryAllList.splice(i, 1);
                      }
                    }
                  })

                  growl.success("折标系数已删除", {});
                  $scope.selectedCount = 0;
                  $scope.$apply();
                }
              })
              dialogRef.close();
            }
          }, {
            label: '取消',
            action: function(dialogRef) {
              callback(false);
              dialogRef.close();
              $scope.selectedCount = 0;
              $scope.$apply();
            }
          }]
        });
      } else if (type == 'deleteDetail') {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '确认删除该折标系数？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              var returnObj = {
                code: 0
              };
              callback(returnObj);
              select.forEach(function(sel) {
                for (var i in $scope.queryConvertList) {
                  if (sel == $scope.queryConvertList[i].id) {
                    $scope.queryConvertList.splice(i, 1);
                  }
                }
              })
              growl.info("请点击“保存模板”按钮，以便对修改的内容进行保存！", {});
              $scope.selectedCount = 0;
              $scope.$apply();
              dialogRef.close();
            }
          }, {
            label: '取消',
            action: function(dialogRef) {
              callback(false);
              dialogRef.close();
              $scope.selectedCount = 0;
              $scope.$apply();
            }
          }]
        });
      } else if (type == 'effect') {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '确认生效该折标系数？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              energyConsumeUIService.effectEnergyConvertStandard(select, function(returnObj) {
                callback(returnObj);
                if (returnObj.code == 0) {
                  growl.success("折标系数已生效", {});
                }
              })
              dialogRef.close();
            }
          }, {
            label: '取消',
            action: function(dialogRef) {
              callback(false);
              dialogRef.close();
              $scope.selectedCount = 0;
              $scope.$apply();
            }
          }]
        });
      }
    };

    $scope.searchData = function() {
      var param = {
        "id": energySignatureTypeId ? energySignatureTypeId : "",
        "convertStandardYear": $scope.tableInit.select.convertStandardYear ? $scope.tableInit.select.convertStandardYear : "",
        "state": $scope.tableInit.select.state ? $scope.tableInit.select.state : "",
      };
      energyConsumeUIService.findEnergyConvertStandards([param], function(returnObj) {
        if (returnObj.code == 0) {
          if (energySignatureTypeId > 0) {
            $scope.tableInit.input.convertStandardYear = returnObj.data[0].convertStandardYear;
          }
          $scope.queryAllList = returnObj.data;
          broardFun('convert', returnObj.data);
        }
      })
    };

    var init = function() {
      if (energySignatureTypeId > 0) {
        $scope.tableInit.input.id = energySignatureTypeId;
        (function() {
          energyConsumeUIService.convertStandardByEnergyId([energySignatureTypeId], function(returnObj) {
            if (returnObj.code == 0) {
              $scope.queryConvertList = returnObj.data;
              broardFun('edit_convert', returnObj.data);
            }
          })
        })();
      } else {
        $scope.queryConvertList = [];
        broardFun('edit_convert', []);
      }

      $scope.searchData();
    };

    /**
     * 监听登录状态
     */
    if (!userLoginUIService.user.isAuthenticated) {
      $scope.$on('loginStatusChanged', function(evt, d) {
        if (userLoginUIService.user.isAuthenticated) {
          init();
        }
      });
    } else {
      init();
    }

  }]);

  //数据上报管理
  controllers.initController('energyTasksCtrl', ['$scope', '$routeParams', '$timeout', '$controller', 'kpiDataService', 'FileUploader', '$q', 'userUIService', '$location', 'ngDialog', 'unitService',
    'userLoginUIService', 'energyConsumeUIService', 'growl', 'userDomainService',
    function($scope, $routeParams, $timeout, $controller, kpiDataService, FileUploader, $q, userUIService, $location, ngDialog, unitService, userLoginUIService, energyConsumeUIService, growl, userDomainService) {
      $scope.ifshowState = false; //数据上报
      $scope.userType = userLoginUIService.user.userType;
      if (location.hash.search("#/InfoOnStateManagement") > -1) {
        $scope.ifshowState = true; //信息状态
      };
      if (userLoginUIService.user.userType == 100) {
        $scope.state = [{
          id: 'commit',
          label: '未审核'
        }, {
          id: 'pass',
          label: '审核'
        }];
      } else {
        $scope.state = [{
          id: 'commit',
          label: '提交'
        }, {
          id: 'nocommit',
          label: '草稿'
        }];

      }
      $scope.ifView = false; //查看标识符
      $scope.selectedCount = 0; //选择导入导出
      var energyTypeList = [],
        energyTypeDic = {};

      $scope.$watch("myDicts", function(n, o) {
        if (n) {
          var energyTypeList = $scope.myDicts['energyType'];
          energyTypeList.forEach(function(item) {
            energyTypeDic[item.valueCode] = item;
            // item.id = item.valueCode;
            // item.text = item.label;
          });
        }
      })

      //导入模板
      $scope.serviceOrigin = userUIService.uploadFileUrl + '/api/rest/import/energyConsumeUIService/importEnergyConsumeRecords';
      $scope.fileFormat = '|xls|xlsx|';
      $controller('AppUploadCtrl', {
        $scope: $scope,
        growl: growl,
        FileUploader: FileUploader
      });
      var download = function(config) {
        $scope.uploader.formData = [];
        $scope.uploader.formData.push({
          config: 'energyConsumeRecordModel'
        });
        $scope.uploader.uploadAll();
        growl.info("能耗记录导入处理中，请耐心等待...");
      };

      $scope.$on("uploadTemplate", function(event, args) {
        if (args.response.code == 0) {
          growl.success('能耗录入导入成功', {});
          console.log('记得刷新一下');
        }
      });
      $scope.uploader.onAfterAddingFile = function(fileItem) {
        if ($scope.uploader.queue.length > $scope.queueLimit) {
          $scope.uploader.removeFromQueue(0);
        }
        download();
      }

      var broardFun = function(objList) {
        $timeout(function() {
          $scope.$broadcast(Event.ENTERPRISEINIT + "_recordTask", {
            "option": [objList]
          });
        })
      };

      //初始化数据
      var initData = function() {
        $scope.dialog.input = {
          energyType: '',
          valentweight: '',
          equal: '',
          createTime: new Date(),
          id: -1
        };
      };

      $scope.dialog = {
        title: "能耗统计信息",
        button: [{
          label: "确定",
          fn: function() {
            var param = [];
            $scope.energyConsumeRecords.forEach(function(item) {
              param.push({
                'id': item.id,
                'energyConsumeValue': item.energyConsumeValue
              });
            })
            var saveEnergy_callback = function(returnObj) {
              if (returnObj.code == 0) {
                growl.success("能耗统计信息保存成功", {});
              }
            };
            energyConsumeUIService.saveEnergyConsumeRecords([param, $scope.selectedId], saveEnergy_callback);

            ngDialog.close();
          }
        }, {
          label: "取消",
          fn: function() {
            ngDialog.close();
          }
        }]
      };

      //验证阈值
      $scope.mistakeMesg = {};
      $scope.verifyFun = function(value, type) {
        var reg, r;
        reg = /^[+-]?([1-9][0-9]*|0)(\.[0-9]+)?%?$/; //全体实数
        r = reg.test(value);
        if (!r) { //不为数字
          $scope.mistakeMesg[type] = true;
        } else {
          $scope.mistakeMesg[type] = false;
        }
      };

      //数据上报
      $scope.tableInit = {
        'header': {
          'label': $scope.ifshowState ? "信息状态管理" : "统计数据上报",
          'time': ''
        },
        'select': {
          'enterpriseName': '',
          'statisticsType': '',
          'state': '',
          'overdue': ''
        },
        'event': {
          'goClear': function() {
            $scope.tableInit.select.enterpriseName = $scope.queryState.state == 1 ? $scope.tableInit.select.enterpriseName : null;
            $scope.tableInit.select.statisticsType = $scope.queryState.state == 2 ? $scope.tableInit.select.statisticsType : null;
            $scope.tableInit.select.state = $scope.queryState.state == 3 ? $scope.tableInit.select.state : null;
            $scope.tableInit.select.overdue = $scope.queryState.state == 4 ? $scope.tableInit.select.overdue : null;
          },
          'import': function(selObj) {
            $('#nv-file-select-task').click();
          },
          timeImport: function() {
            if (!$scope.tableInit.header.time) {
              growl.warning("请先选择时间", {});
              return;
            }
            var year = new Date($scope.tableInit.header.time).getFullYear();
            var month = new Date($scope.tableInit.header.time).getMonth() + 1;
            if (month < 10) {
              month = '0' + month;
            }
            var time = year + '-' + month;
            var domiansAry = userLoginUIService.user.domains.split('/');
            var param = [time, domiansAry[domiansAry.length - 2]];
            energyConsumeUIService.generateEnergyConsumeRecordTaskByTime(param, function(returnObj) {
              if (returnObj.code == 0) {
                if (returnObj.data.length > 0) {
                  $scope.queryAllList.push(returnObj.data[0]);
                  broardFun($scope.queryAllList);
                } else {
                  growl.info("新建任务数据为空，请重新选择时间范围", {});
                }
              }
            })
          },
          'export': function(selObj) {
            location.href = '' + userUIService.uploadFileUrl + '/api/rest/export/energyConsumeUIService/exportEnergyConsumeRecord/' + encodeURI(encodeURI(selObj.statisticsPeriod)) + '.xls/' + selObj.id + '/energyConsumeRecord/';
          }
        }
      };

      //table动作
      $scope.doAction = function(type, select, callback) {
        var startTime = '';
        var endTime = '';
        var year = '';
        var month = '';
        if (select.statisticsType == 'MONTH' || select.statisticsType == 'QUARTER') {
          year = select.statisticsPeriod.substring(0, 4);
          month = parseInt(select.statisticsPeriod.substring(4));
          startTime = new Date(year + '-' + month + '-' + '01' + ' 00:00:00');
          endTime = new Date(year + '-' + month + '-' + '02' + ' 00:00:00');
        } else if (select.statisticsType == 'YEAR') {
          startTime = new Date(select.statisticsPeriod + '-01-01 00:00:00');
          endTime = new Date(select.statisticsPeriod + '-01-02 00:00:00');
        }
        var kpiList = function(obj, data, callback) {
          var param = [
            "kpi", {
              "category": "time",
              "isRealTimeData": false,
              startTime: obj.startTime,
              endTime: obj.endTime,
              "nodeIds": obj.nodeIdsAry,
              "kpiCodes": [
                3300
              ],
              "granularityUnit": obj.statisticsType,
              "aggregateType": ["ORIGINAL"],
              "queryInstances": obj.energyAry.join(','),
              "timeRange": "",
              "statisticType": "psiot",
              "includeInstance": true,
              "condList": [],
              "timePeriod": 0,
              "dataType": 1
            }
          ];
          kpiDataService.getValueList(param, function(returnObj) {
            if (returnObj.code == 0) {
              var labelDic = {};
              data.forEach(function(item) {
                labelDic[item.energyConsumeNodeId] = item;
              });
              returnObj.data.forEach(function(item) {
                // item.energyTypeName = energyTypeDic[item.energyType].label;
                item.energyTypeName = item.instance;
                item.energyConsumeValue = item.value;
                item.energyConsumeNodeName = labelDic[item.nodeId].energyConsumeNodeName;
                item.energyTypeUnit = labelDic[item.nodeId].energyTypeUnit;
                item.energyConsumeTreeNodeName = labelDic[item.nodeId].energyConsumeTreeNodeName;
              })
              $scope.energyConsumeRecords = returnObj.data;
              if (callback) {
                callback();
              }
            }
          })
        };
        var RecordsByTaskId = function(type, id) {
          energyConsumeUIService.findEnergyConsumeRecordsByTaskId([id], function(returnObj) {
            if (returnObj.code == 0) {
              var param = {};
              param.nodeIdsAry = returnObj.data.map(function(item) {
                return item.energyConsumeNodeId;
              });
              param.energyAry = returnObj.data.map(function(item) {
                return energyTypeDic[item.energyType].label
              });
              param.startTime = startTime;
              param.endTime = endTime;
              param.statisticsType = select.statisticsType;
              if (type == 'pass') {
                kpiList(param, returnObj.data, function() {
                  ngDialog.open({
                    template: '../partials/dialogue/consume_record_tasks_dia.html',
                    className: 'ngdialog-theme-plain',
                    scope: $scope
                  });
                });
              } else {
                returnObj.data.forEach(function(item) {
                  item.energyTypeName = energyTypeDic[item.energyType].label;
                })
                $scope.energyConsumeRecords = returnObj.data;
                ngDialog.open({
                  template: '../partials/dialogue/consume_record_tasks_dia.html',
                  className: 'ngdialog-theme-plain',
                  scope: $scope
                });
              }

            }
          });
        };
        if (type == 'edit') {
          $scope.selectedId = select.id;
          $scope.ifView = false;
          RecordsByTaskId(select.state, select.id);
        } else if (type == 'commit') {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认' + (userLoginUIService.user.userType == 100 ? '审核' : '提交') + '该能耗统计信息？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                var state = userLoginUIService.user.userType == 100 ? 'pass' : 'commit';
                energyConsumeUIService.updateEnergyConsumeRecordTaskState([select, state], function(returnObj) {
                  callback(returnObj);
                  if (returnObj.code == 0) {
                    if (userLoginUIService.user.userType == 100) {
                      growl.success("能耗统计信息已审核", {});
                    } else {
                      growl.success("能耗统计信息已提交", {});
                    }

                  }
                })
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                callback(false);
                dialogRef.close();
                $scope.selectedCount = 0;
                $scope.$apply();
              }
            }]
          });
        } else if (type == 'view') {
          $scope.ifView = true;
          RecordsByTaskId(select.state, select.id);
        }
      };

      $scope.searchData = function() {
        if ($scope.userType == 100 || $scope.userType == 3) { //政府
          var param = {
            // "id": energySignatureTypeId ? energySignatureTypeId : "",
            "enterpriseName": $scope.tableInit.select.enterpriseName ? $scope.tableInit.select.enterpriseName : "",
            "overdue": $scope.tableInit.select.overdue ? $scope.tableInit.select.overdue : "",
            "statisticsType": $scope.tableInit.select.statisticsType ? $scope.tableInit.select.statisticsType : "",
            "state": $scope.tableInit.select.state ? $scope.tableInit.select.state : "",
          };
        } else { //企业
          var param = {
            // "id": energySignatureTypeId ? energySignatureTypeId : "",
            "statisticsType": $scope.tableInit.select.statisticsType ? $scope.tableInit.select.statisticsType : "",
            "state": $scope.tableInit.select.state ? $scope.tableInit.select.state : "",
          };
        }
        energyConsumeUIService.findConsumeRecordTasksByCondition([param], function(returnObj) {
          if (returnObj.code == 0) {
            $scope.queryAllList = returnObj.data;
            broardFun(returnObj.data);
          }
        })
      };

      var init = function() {
        $scope.searchData();
      };

      /**
       * 监听登录状态
       */
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }

    }
  ]);

  //指令策略管理
  controllers.initController('instructCtrl', ['$scope', '$routeParams', '$timeout', '$controller', 'directiveStrategyUIService', 'kqiManagerUIService', '$q', 'resourceUIService', '$location', 'ngDialog', 'unitService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'userDomainService',
    function(scope, $routeParams, $timeout, $controller, directiveStrategyUIService, kqiManagerUIService, $q, resourceUIService, $location, ngDialog, unitService, userLoginUIService, energyConsumeUIService, growl, userDomainService) {
      var TEXT = {
        "SUBMIT": "确定",
        "CANCEL": "取消"
      };
      var granularityUnits = [{
        id: "MINUTE",
        label: "每分钟"
      }, {
        id: "HOUR",
        label: "每小时"
      }, {
        id: "DAY",
        label: "每天"
      }, {
        id: "WEEK",
        label: "每周"
      }, {
        id: "MONTH",
        label: "每月"
      } /**,{id:"QUARTER",label:"每季度"}*/ , {
        id: "YEAR",
        label: "每年"
      }];
      var condition = [{
        'label': '大于',
        'id': 'GT'
      }, {
        'label': '大于等于',
        'id': 'GE'
      }, {
        'label': '等于',
        'id': 'EQ'
      }, {
        'label': '不等于',
        'id': 'NE'
      }, {
        'label': '小于',
        'id': 'LT'
      }, {
        'label': '小于等于',
        'id': 'LE'
      }, {
        'label': 'js脚本',
        'id': 'JS'
      }];
      var queryDomainTree = function(callback) {
        $$.cacheAsyncData.call(userDomainService.queryDomainTree, [userLoginUIService.user.userID], function(event) {
          if (event.code == 0) {
            callback(event.data);
          }
        });
      };
      var getModels = function(callback) {
        $$.cacheAsyncData.call(resourceUIService.getModels, [], function(event) {
          if (event.code == 0) {
            callback(event.data);
          }
        });
      };
      var getDirectivesByModelIdNotByRole = function(id, callback) {
        $$.cacheAsyncData.call(resourceUIService.getDirectivesByModelIdNotByRole, [id], function(event) {
          if (event.code == 0) {
            event.data.forEach(function(item) {
              item.label = item.name;
            });
            callback(event.data);
          }
        });
      };
      var getDevicesByCondition = function(param, callback) {
        $$.cacheAsyncData.call(resourceUIService.getDevicesByCondition, [param], function(event) {
          if (event.code == 0) {
            callback(event.data);
          }
        });
      };
      var getDataItemsByModelId = function(modelId, callback) {
        $$.cacheAsyncData.call(resourceUIService.getDataItemsByModelId, [modelId], function(event) {
          if (event.code == 0) {
            var dataDic = {};
            event.data.forEach(function(item) {
                dataDic[item.id] = item;
              })
              /*if (!dataDic[0]) {
                event.data.unshift({
                  label: '请选择',
                  name: '请选择',
                  id: 0
                });
              }*/
            callback(event.data);
          }
        });
      };
      var getDirectiveStrategys = function(callback) {
        $$.cacheAsyncData.call(directiveStrategyUIService.getDirectiveStrategys, [], function(event) {
          if (event.code == 0) {
            if (event.data == undefined || event.data == null) {
              event.data = [];
            }
            callback(event.data);
          }
        });
      };
      var init = function() {
        queryDomainTree(function(dtree) {
          var domaintree = {
            nodes: dtree,
            domainInfos: dtree
          };
          getModels(function(allModels) {
            getDirectiveStrategys(function(allInstructAry) {
              var editInstruc = function(target) {
                // getModels(function(obj) {
                // var allModels = [{
                //   id: 300,
                //   label: "管理域"
                // }, {
                //   id: 301,
                //   label: "客户"
                // }, {
                //   id: 302,
                //   label: "项目"
                // }].concat(obj);
                // var allModels = obj;
                var hours = (function() {
                  var rs = [];
                  for (var i = 0; i < 24; i++) {
                    rs.push({
                      id: i,
                      label: i
                    });
                  }
                  return rs;
                })();
                var minutes = (function() {
                  var rs = [];
                  for (var i = 0; i < 60; i++) {
                    rs.push({
                      id: i,
                      label: i
                    });
                  }
                  return rs;
                })();
                var days = (function() {
                  var rs = [];
                  for (var i = 1; i < 32; i++) {
                    rs.push({
                      id: i,
                      label: i
                    });
                  }
                  return rs;
                })();
                var months = (function() {
                  var rs = [];
                  for (var i = 1; i < 13; i++) {
                    rs.push({
                      id: i,
                      label: i
                    });
                  }
                  return rs;
                })();

                var weekdays = [{
                  id: 1,
                  label: "一"
                }, {
                  id: 2,
                  label: "二"
                }, {
                  id: 3,
                  label: "三"
                }, {
                  id: 4,
                  label: "四"
                }, {
                  id: 5,
                  label: "五"
                }, {
                  id: 6,
                  label: "六"
                }, {
                  id: 7,
                  label: "日"
                }];
                var KPIlIST = {
                  "label": "KPI指标",
                  "value": "",
                  "right": true,
                  "data": "kpi",
                  "type": "select",
                  "composory": false,
                  "options": [],
                  "events": {
                    "change": function(data) {

                    }
                  }
                };

                var CONDITION = {
                  "label": "条件",
                  "value": "",
                  "right": true,
                  "data": "condition",
                  "type": "select",
                  "composory": false,
                  "options": condition,
                  "events": {
                    "change": function(data) {

                    }
                  }
                };
                var varnamelist = allInstructAry.map(function(elem) {
                  return elem.name;
                });

                var deferList = [],
                  deviceAry = [],
                  directiveAry = [];
                var TABLE = {
                  "label": "",
                  "value": 0,
                  "apply": true,
                  "right": true,
                  "data": "thresholds",
                  "message": '如若需要选择数据项，则条件和值都必须填写',
                  "type": "table",
                  "composory": false,
                  "groups": [{
                    composory: true,
                    value: 1,
                    label: '配置项'
                  }, {
                    composory: true,
                    value: 2,
                    label: '取值'
                  }, {
                    composory: false,
                    value: 3,
                    label: '数据项'
                  }, {
                    composory: false,
                    value: 4,
                    label: '条件'
                  }, {
                    composory: false,
                    value: 5,
                    label: '值'
                  }],
                  "options": []
                };
                if (target) {
                  if (target.deviceModelId) {
                    var modelId = target.deviceModelId;
                    getDevicesByCondition({
                      modelId: modelId ? modelId : '',
                      domainPath: target.directiveDomainPath ? target.directiveDomainPath : ''
                    }, function(devices) {
                      deviceAry = devices;
                    });
                    getDirectivesByModelIdNotByRole(modelId, function(directive) {
                      directiveAry = directive;
                      getDataItemsByModelId(modelId, function(kpi) {
                        KPIlIST.options = kpi;
                        var targetCi = directiveAry.find(function(item) {
                          return item.id == target.directiveId;
                        }).params;
                        targetCi.forEach(function(selectKpi) {
                          var oldKpi = KPIlIST.options.find(function(oldKpi){
                            return oldKpi.uid == selectKpi.id
                          })
                          if (oldKpi) {
                            selectKpi.id = oldKpi.id;
                            selectKpi.uid = oldKpi.uid;
                          }
                        })
                        if (targetCi) {
                          TABLE.options = targetCi;
                          TABLE.options.forEach(function(elem) {
                            elem.inputs = [];
                            elem.inputs = elem.inputs.concat([{
                              "label": "配置项",
                              "text": elem.label,
                              "right": true,
                              "data": "value",
                              "type": "text",
                              "composory": false
                            }, {
                              "label": "取值",
                              "value": target.params.find(function(item) {
                                return item.kpiId == elem.id;
                              }).value,
                              "maxlength": 12,
                              "right": true,
                              "data": "value",
                              "type": "input",
                              "placeholder": "请填写取值",
                              "composory": false,
                              "events": {
                                "change": function(data) {}
                              }
                            }, {
                              "label": "KPI指标",
                              "value": target.thresholds.find(function(item) {
                                return item.targetKpiId == elem.id;
                              }).kpiId,
                              "right": true,
                              "data": "kpiId",
                              "type": "select",
                              "composory": false,
                              "options": KPIlIST.options,
                              "events": {
                                "change": function(data) {

                                  // if (data.value > 0) {
                                  //   TABLE.groups.forEach(function(item) {
                                  //     item.composory = true;
                                  //   });
                                  // } else {
                                  //   TABLE.groups.forEach(function(item) {
                                  //     if (item.value > 2) {
                                  //       item.composory = false;
                                  //     } else {
                                  //       item.composory = true;
                                  //     }
                                  //   });
                                  // }

                                }
                              }
                            }, {
                              "label": "条件",
                              "value": target.thresholds.find(function(item) {
                                return item.targetKpiId == elem.id;
                              }).compareType,
                              "right": true,
                              "data": "compareType",
                              "type": "select",
                              "composory": false,
                              "options": condition,
                              "events": {
                                "change": function(data) {

                                }
                              }
                            }, {
                              "label": "阈值",
                              "value": target.thresholds.find(function(item) {
                                return item.targetKpiId == elem.id;
                              }).thresholdValue,
                              "right": true,
                              "maxlength": 12,
                              "data": "thresholdValue",
                              "type": "input",
                              "placeholder": "请填写内容",
                              "composory": false,
                              "events": {
                                "change": function(data) {}
                              }
                            }]);
                            // elem.inputs = elem.inputs.concat([KPIlIST, CONDITION]);
                            // $.extend(elem.inputs, KPIlIST, CONDITION);
                          });
                        }
                        start();
                      });
                    });
                  }
                };

                function start() {
                  scope.$tabInx = 0;
                  scope.naviClick = function(id) {
                    scope.$tabInx = id;
                  };

                  var CALMODE = {
                    "label": "计算方式",
                    "value": target && (target.cron.indexOf('/') > -1) ? 'count' : "assign",
                    "right": true,
                    "data": "calmode",
                    "type": "select",
                    "composory": false,
                    "options": [{
                      id: 'assign',
                      label: '指定方式'
                    }, {
                      id: 'count',
                      label: '执行次数'
                    }],
                    "events": {
                      "change": function(data) {
                        var value = data.value;
                        var granular = GRANULARITYUNIT.value;
                        console.log(value);
                        console.log(granular);
                        granularChange(granular, '', value);
                      }
                    }
                  };

                  var SECONDS = {
                    "label": "计算时间",
                    "maxlength": 12,
                    "value": 0,
                    "right": true,
                    "data": "second",
                    "apply": false,
                    "textAfter": "秒",
                    "type": "select",
                    "composory": true,
                    "options": minutes,
                    "events": {
                      "change": function(data) {

                      }
                    },
                    filterFormat: {
                      "label": "label",
                      "value": "id"
                    }
                  };
                  var SECONDSCOUNT = {
                    "label": "计算时间",
                    "maxlength": 12,
                    "value": 0,
                    "right": true,
                    "data": "secondcount",
                    "apply": false,
                    "textAfter": "秒",
                    "type": "select",
                    "options": minutes,
                    "composory": true,
                    "events": {
                      "change": function(data) {

                      }
                    },
                    filterFormat: {
                      "label": "label",
                      "value": "id"
                    }
                  };
                  var DAYS = {
                    "label": "开始计算",
                    "maxlength": 12,
                    "value": 0,
                    "right": true,
                    "data": "day",
                    "apply": false,
                    "options": days,
                    "textAfter": "日",
                    "type": "select",
                    "composory": true,
                    "events": {
                      "change": function(data) {

                      }
                    },
                    filterFormat: {
                      "label": "label",
                      "value": "id"
                    }
                  };
                  var DAYSCOUNT = {
                    "label": "开始计算",
                    "maxlength": 12,
                    "value": 0,
                    "right": true,
                    "data": "daycount",
                    "apply": false,
                    "options": days,
                    "textAfter": "日",
                    "type": "select",
                    "composory": true,
                    "events": {
                      "change": function(data) {

                      }
                    },
                    filterFormat: {
                      "label": "label",
                      "value": "id"
                    }
                  };
                  var MINUTES = {
                    "label": "开始计算",
                    "maxlength": 12,
                    "value": 0,
                    "apply": false,
                    "right": true,
                    "data": "minute",
                    "options": minutes,
                    "textBefore": '',
                    "textAfter": '分',
                    "type": "select",
                    "composory": true,
                    filterFormat: {
                      "label": "label",
                      "value": "id"
                    },
                  };
                  var MINUTESCOUNT = {
                    "label": "开始计算",
                    "maxlength": 12,
                    "value": 0,
                    "apply": false,
                    "right": true,
                    "data": "minutecount",
                    "options": minutes,
                    "textBefore": '',
                    "textAfter": '分',
                    "type": "select",
                    "composory": true,
                    filterFormat: {
                      "label": "label",
                      "value": "id"
                    },
                  };
                  var HOURS = {
                    "label": "开始计算",
                    "maxlength": 12,
                    "value": 0,
                    "apply": true,
                    "right": true,
                    "data": "hour",
                    "textAfter": "点",
                    "type": "select",
                    "composory": true,
                    "events": {
                      "change": function(data) {

                      }
                    },
                    options: hours,
                    filterFormat: {
                      "label": "label",
                      "value": "id"
                    }
                  };
                  var HOURSCOUNT = {
                    "label": "开始计算",
                    "maxlength": 12,
                    "value": 0,
                    "apply": true,
                    "right": true,
                    "data": "hourcount",
                    "textAfter": "点",
                    "type": "select",
                    "composory": true,
                    "events": {
                      "change": function(data) {

                      }
                    },
                    options: hours,
                    filterFormat: {
                      "label": "label",
                      "value": "id"
                    }
                  };
                  var WEEKDAYS = {
                    "label": "开始计算",
                    "maxlength": 12,
                    "value": 0,
                    "apply": false,
                    "right": true,
                    "data": "week",
                    "textBefore": "星期",
                    "options": weekdays,
                    "type": "select",
                    "composory": true,
                    "events": {
                      "change": function(data) {

                      }
                    },
                    filterFormat: {
                      "label": "label",
                      "value": "id"
                    }
                  };
                  var WEEKDAYSCOUNT = {
                    "label": "开始计算",
                    "maxlength": 12,
                    "value": 0,
                    "apply": false,
                    "right": true,
                    "data": "weekcount",
                    "textBefore": "星期",
                    "options": weekdays,
                    "type": "select",
                    "composory": true,
                    "events": {
                      "change": function(data) {

                      }
                    },
                    filterFormat: {
                      "label": "label",
                      "value": "id"
                    }
                  };
                  var MONTHS = {
                    "label": "开始计算",
                    "apply": false,
                    "maxlength": 12,
                    "value": 0,
                    "right": true,
                    "data": "month",
                    "textAfter": "月",
                    "type": "select",
                    "options": months,
                    "composory": true,
                    "events": {
                      "change": function(data) {

                      }
                    },
                    filterFormat: {
                      "label": "label",
                      "value": "id"
                    }
                  };
                  var MONTHSCOUNT = {
                    "label": "开始计算",
                    "apply": false,
                    "maxlength": 12,
                    "value": 0,
                    "right": true,
                    "data": "monthcount",
                    "textAfter": "月",
                    "type": "select",
                    "options": months,
                    "composory": true,
                    "events": {
                      "change": function(data) {

                      }
                    },
                    filterFormat: {
                      "label": "label",
                      "value": "id"
                    }
                  };
                  var GRANULARITYUNIT = {
                    "label": "统计频率",
                    "maxlength": 12,
                    "value": target ? target.frequency : granularityUnits[2].id,
                    "right": true,
                    "data": "frequency",
                    "type": "select",
                    "composory": true,
                    "options": granularityUnits,
                    "events": {
                      "change": function(data) {
                        var value = data.value;
                        CALMODE.value = 'assign';
                        if (data.value == "") {
                          data.error = "统计频率不可为空";
                          data.right = false;
                        } else {
                          data.error = undefined;
                          data.right = true;
                        }
                        granularChange(value, '', 'assign');
                      }
                    }
                  };

                  var TIMESELECT = {
                    "label": "开始计算",
                    "maxlength": 12,
                    "value": 0,
                    "apply": true,
                    "right": true,
                    "data": "cron",
                    "type": "groupSelect",
                    "composory": true,
                    "groups": [HOURS, MINUTES]
                  };
                  var INSTRUCNAME = {
                    "label": "指令策略名称",
                    "maxlength": 32,
                    "value": target ? target.name : "",
                    "right": target ? true : false,
                    "composory": true,
                    "data": "name",
                    "placeholder": "指令策略名称",
                    "events": {
                      "change": function(data) {
                        if (data.value == "") {
                          data.error = "指令策略名称不可为空";
                          data.right = false;
                        } else {
                          if (varnamelist.indexOf(data.value) != -1) {
                            data.error = "指令策略名称已存在";
                            data.right = false;
                          } else {
                            data.error = undefined;
                            data.right = true;
                          }
                        }
                      }
                    },
                    "type": "input"
                  };
                  var DESCRIPTION = {
                    "label": "指令策略描述",
                    "maxlength": 200,
                    "value": target ? target.description : "",
                    "right": true,
                    "composory": false,
                    "data": "description",
                    "placeholder": "描述",
                    "type": "textarea"
                  };
                  var DOMAINPATH = {
                    label: "域路径",
                    value: target ? target.directiveDomainPath : "",
                    right: target ? true : false,
                    type: "tree",
                    sortable: true,
                    filterable: true,
                    composory: true,
                    data: "directiveDomainPath",
                    key: "domainPath",
                    mark: "nodes",
                    options: domaintree,
                    modes: {
                      default: {
                        type: "text",
                      }
                    },
                    "events": {
                      "change": function(data) {
                        if (data.value == "") {
                          data.error = "域路径不可为空";
                          data.right = false;
                        } else {
                          data.error = undefined;
                          data.right = true;
                          getDevicesByCondition({
                            "domainPath": data.value,
                            "modelId": scope.dialog.tabs[1].inputs[1].value ? scope.dialog.tabs[1].inputs[1].value : ''
                          }, function(devices) {
                            scope.dialog.tabs[1].inputs[3].options = devices;
                          });
                        }
                      }
                    }
                  };
                  var TARGETSOURCE = {
                    "label": "资源模板",
                    "maxlength": 12,
                    "value": target ? target.deviceModelId : "",
                    "right": target ? true : false,
                    "data": "deviceModelId",
                    "type": "select",
                    "composory": true,
                    "options": allModels,
                    "events": {
                      "change": function(data) {
                        if (data.value) {
                          var modelId = data.value;
                          getDevicesByCondition({
                            "domainPath": scope.dialog.tabs[1].inputs[0].value ? scope.dialog.tabs[1].inputs[0].value : '',
                            "modelId": modelId
                          }, function(devices) {
                            scope.dialog.tabs[1].inputs[3].options = devices;
                          });
                          getDirectivesByModelIdNotByRole(modelId, function(directive) {
                            scope.dialog.tabs[1].inputs[2].options = directive;
                          });
                          getDataItemsByModelId(modelId, function(kpi) {
                            KPIlIST.options = kpi;
                          });
                          data.error = "";
                          data.right = true;
                        } else {
                          data.error = "资源模版不可为空";
                          data.right = false;
                        }
                      }
                    }
                  };
                  var DEVICElIST = {
                    "label": "设备",
                    "value": target ? target.deviceIds : [],
                    "right": true,
                    "data": "deviceIds",
                    "type": "multiple",
                    "composory": false,
                    "options": target && deviceAry ? deviceAry : [],
                    "events": {
                      "change": function(data) {

                      }
                    }
                  };

                  var DIRECTIVELIST = {
                    "label": "指令",
                    "value": target ? target.directiveId : "",
                    "right": target ? true : false,
                    "data": "directiveId",
                    "type": "select",
                    "composory": true,
                    "options": target && directiveAry.length > 0 ? directiveAry : [],
                    "events": {
                      "change": function(data) {
                        if (data.value) {
                          var directiveList = scope.dialog.tabs[1].inputs[2].options;
                          var ciList = directiveList.find(function(item) {
                            return item.id == data.value;
                          }).params;
                          var ary = [];
                          if (ciList) {
                            scope.dialog.tabs[3].inputs[0].options = ciList;
                            scope.dialog.tabs[3].inputs[0].options.forEach(function(elem) {
                              elem.inputs = [];
                              elem.inputs = elem.inputs.concat([{
                                "label": "配置项",
                                "text": elem.label,
                                "right": true,
                                "data": "value",
                                "type": "text",
                                "composory": false,
                                "events": {
                                  "change": function(data) {}
                                }
                              }, {
                                "label": "取值",
                                "value": elem.data,
                                "maxlength": 12,
                                "right": false,
                                "data": "value",
                                "type": "input",
                                "placeholder": "请填写取值",
                                "composory": false,
                                "events": {
                                  "change": function(data) {
                                    if (data.value == "") {
                                      data.error = "取值不可为空";
                                      data.right = false;
                                    } else {
                                      data.error = undefined;
                                      data.right = true;
                                    }
                                  }
                                }
                              }, {
                                "label": "KPI指标",
                                "value": elem.kpiId == 'undefined' ? "请选择kpi指标" : elem.kpiId,
                                "right": true,
                                "data": "kpiId",
                                "type": "select",
                                "composory": false,
                                "options": KPIlIST.options,
                                "events": {
                                  "change": function(data) {}
                                }
                              }, {
                                "label": "条件",
                                "value": elem.condition == 'undefined' ? "请选择条件" : elem.condition,
                                "right": true,
                                "data": "compareType",
                                "type": "select",
                                "composory": false,
                                "options": condition,
                                "events": {
                                  "change": function(data) {

                                  }
                                }
                              }, {
                                "label": "阈值",
                                "value": elem.value,
                                "right": true,
                                "maxlength": 12,
                                "data": "thresholdValue",
                                "type": "input",
                                "placeholder": "请填写阈值",
                                "composory": false,
                                "events": {
                                  "change": function(data) {}
                                }
                              }]);
                              // elem.inputs = elem.inputs.concat([KPIlIST, CONDITION]);
                              // $.extend(elem.inputs, KPIlIST, CONDITION);
                            });
                          }
                          data.error = undefined;
                          data.right = true;
                        } else {
                          data.error = "指令不可为空";
                          data.right = false;
                        }

                      }
                    }
                  };

                  var granularChange = function(granular, values, type) {
                    if (granular == "MINUTE" || granular == "MINUTECOUNT") {
                      TIMESELECT.apply = true;
                      if (values) {
                        SECONDS.value = values[0];
                      } else {
                        SECONDS.value = 0;
                      }
                      SECONDSCOUNT.value = (type == 'count' ? values[1] : 0);
                      if (type == 'assign') {
                        SECONDS.textBefore = '';
                        SECONDS.textAfter = '秒';
                        TIMESELECT.groups = [SECONDS];
                      } else if (type == 'count') {
                        SECONDS.textBefore = '从';
                        SECONDS.textAfter = '秒开始';
                        SECONDSCOUNT.textBefore = '每';
                        SECONDSCOUNT.textAfter = '秒，执行一次';
                        TIMESELECT.groups = [SECONDS, SECONDSCOUNT];
                      }
                    } else if (granular == "HOUR" || granular == "HOURCOUNT") {
                      TIMESELECT.apply = true;
                      if (type == 'assign') {
                        if (values) {
                          SECONDS.value = values[0];
                          MINUTES.value = values[1];
                        } else {
                          SECONDS.value = 0;
                          MINUTES.value = 0;
                        }
                        MINUTES.textBefore = '';
                        MINUTES.textAfter = '分';
                        SECONDS.textBefore = '';
                        SECONDS.textAfter = '秒';
                        TIMESELECT.groups = [MINUTES, SECONDS];
                      } else if (type == 'count') {
                        if (values) {
                          SECONDS.value = values[0];
                          MINUTESCOUNT.value = values[2];
                          MINUTES.value = values[1];
                        } else {
                          SECONDS.value = 0;
                          MINUTESCOUNT.value = 0;
                          MINUTES.value = 0;
                        }
                        MINUTES.textBefore = '从';
                        MINUTES.textAfter = '分开始';
                        MINUTESCOUNT.textBefore = '每';
                        MINUTESCOUNT.textAfter = '分执行一次';
                        SECONDS.textBefore = '';
                        SECONDS.textAfter = '秒';
                        TIMESELECT.groups = [MINUTES, MINUTESCOUNT, SECONDS];
                      }
                    } else if (granular == "DAY" || granular == "DAYCOUNT") {
                      TIMESELECT.apply = true;
                      if (type == 'assign') {
                        if (values) {
                          MINUTES.value = values[0];
                          HOURS.value = values[1];
                        } else {
                          MINUTES.value = 0;
                          HOURS.value = 0;
                        }
                        HOURS.textBefore = '';
                        HOURS.textAfter = '时';
                        MINUTES.textBefore = '';
                        MINUTES.textAfter = '分';
                        TIMESELECT.groups = [HOURS, MINUTES];
                      } else if (type == 'count') {
                        if (values) {
                          MINUTES.value = values[0];
                          HOURSCOUNT.value = values[2];
                          HOURS.value = values[1];
                        } else {
                          MINUTES.value = 0;
                          HOURSCOUNT.value = 0;
                          HOURS.value = 0;
                        }
                        HOURS.textBefore = '从';
                        HOURS.textAfter = '时开始';
                        HOURSCOUNT.textBefore = '每';
                        HOURSCOUNT.textAfter = '时执行一次';
                        MINUTES.textBefore = '';
                        MINUTES.textAfter = '分';
                        TIMESELECT.groups = [HOURS, HOURSCOUNT, MINUTES];
                      }

                    } else if (granular == "WEEK") {
                      if (values) {
                        HOURS.value = values[0];
                        WEEKDAYS.value = values[1];
                      } else {
                        HOURS.value = 0;
                        WEEKDAYS.value = 1;
                      }
                      if (type == 'assign') {
                        TIMESELECT.apply = true;
                        WEEKDAYS.textBefore = '星期';
                        WEEKDAYS.textAfter = '';
                        HOURS.textBefore = '';
                        HOURS.textAfter = '点';
                        TIMESELECT.groups = [WEEKDAYS, HOURS];
                      } else if (type == 'count') {
                        TIMESELECT.apply = false;
                        // WEEKDAYS.textBefore = '从星期';
                        // WEEKDAYS.textAfter = '开始';
                        // WEEKDAYSCOUNT.textBefore = '每';
                        // WEEKDAYSCOUNT.textAfter = '星期执行一次';
                        // HOURS.textBefore = '';
                        // HOURS.textAfter = '点';
                        // TIMESELECT.groups = [WEEKDAYS, WEEKDAYSCOUNT, HOURS];
                      }

                    } else if (granular == "MONTH" || granular == "MONTHCOUNT") {
                      TIMESELECT.apply = true;
                      if (type == 'assign') {
                        if (values) {
                          HOURS.value = values[0];
                          DAYS.value = values[1];
                        } else {
                          HOURS.value = 0;
                          DAYS.value = 1;
                        }
                        DAYS.textBefore = '';
                        DAYS.textAfter = '日';
                        HOURS.textBefore = '';
                        HOURS.textAfter = '点';
                        TIMESELECT.groups = [DAYS, HOURS];
                      } else if (type == 'count') {
                        if (values) {
                          HOURS.value = values[0];
                          DAYSCOUNT.value = values[2];
                          DAYS.value = values[1];
                        } else {
                          HOURS.value = 0;
                          DAYSCOUNT.value = 1;
                          DAYS.value = 1;
                        }
                        DAYS.textBefore = '从';
                        DAYS.textAfter = '日开始';
                        DAYSCOUNT.textBefore = '每';
                        DAYSCOUNT.textAfter = '日执行一次';
                        HOURS.textBefore = '';
                        HOURS.textAfter = '点';
                        TIMESELECT.groups = [DAYS, DAYSCOUNT, HOURS];
                      }

                    } else if (granular == "YEAR") {
                      if (values) {
                        DAYS.value = values[0];
                        MONTHS.value = values[1];
                      } else {
                        DAYS.value = 1;
                        MONTHS.value = 1;
                      }
                      if (type == 'assign') {
                        TIMESELECT.apply = true;
                        MONTHS.textBefore = '';
                        MONTHS.textAfter = '月';
                        DAYS.textBefore = '';
                        DAYS.textAfter = '日';
                        TIMESELECT.groups = [MONTHS, DAYS];
                      } else if (type == 'count') {
                        TIMESELECT.apply = false;
                        // MONTHS.textBefore = '从';
                        // MONTHS.textAfter = '月开始';
                        // MONTHSCOUNT.textBefore = '每';
                        // MONTHSCOUNT.textAfter = '月执行一次';
                        // DAYS.textBefore = '';
                        // DAYS.textAfter = '日';
                        // TIMESELECT.groups = [MONTHS, MONTHSCOUNT, DAYS];
                      }
                    }
                  };
                  var cronToTime = function(data, type) {
                    var regExps = [{
                      name: "MINUTECOUNT",
                      regExp: /(\d+)\/(\d+)\ \*\ \*\ \*\ \*\ \?\ \*/

                    }, {
                      name: "MINUTE",
                      regExp: /(\d+)\ \*\ \*\ \*\ \*\ \?\ \*/
                    }, {
                      name: "HOURCOUNT",
                      regExp: /(\d+)\ (\d+)\/(\d+)\ \*\ \*\ \*\ \?\ \*/
                    }, {
                      name: "HOUR",
                      regExp: /(\d+)\ (\d+)\ \*\ \*\ \*\ \?\ \*/
                    }, {
                      name: "DAYCOUNT",
                      regExp: /0\ (\d+)\ (\d+)\/(\d+)\ \*\ \*\ \?\ \*/
                    }, {
                      name: "DAY",
                      regExp: /0\ (\d+)\ (\d+)\ \*\ \*\ \?\ \*/
                    }, {
                      name: "MONTHCOUNT",
                      regExp: /0\ 0\ (\d+)\ (\d+)\/(\d+)\ \*\ \?\ \*/
                    }, {
                      name: "MONTH",
                      regExp: /0\ 0\ (\d+)\ (\d+)\ \*\ \?\ \*/
                    }, {
                      name: "YEAR",
                      regExp: /0\ 0\ 0\ (\d+)\ (\d+)\ \?\ \*/
                    }, {
                      name: "WEEK",
                      regExp: /0\ 0\ (\d+)\ \?\ \*\ (\d+)\ \*/
                    }];
                    var find = regExps.find(function(elem) {
                      var regExp = elem.regExp;
                      var rs = regExp.test(data);
                      return rs;
                    });
                    if (find) {
                      var rs = [];
                      if (type == 'assign') {
                        for (var i = 1; i < 3; i++) {
                          var dt = $$.runRegExp(data, find.regExp, i);
                          if (dt) {
                            rs.push(parseInt(dt));
                          }
                        };
                      } else if (type == 'count') {
                        for (var i = 1; i < 4; i++) {
                          var dt = $$.runRegExp(data, find.regExp, i);
                          if (dt) {
                            rs.push(parseInt(dt));
                          }
                        }
                      }
                      return {
                        granular: find.name,
                        type: type,
                        data: rs
                      };
                    } else {
                      return null;
                    };
                  };

                  if (target) {
                    var cronVal = target.cron.indexOf('/') > -1 ? 'count' : 'assign';
                    var granularObj = cronToTime(target.cron, cronVal);
                    console.log(granularObj);
                    if (granularObj) {
                      granularChange(granularObj.granular, granularObj.data, granularObj.type);
                    } else {
                      granularChange("DAY", '', 'assign');
                    }
                  } else {
                    granularChange("DAY", '', 'assign');
                  }
                  scope.dialog = {
                    title: '指令策略',
                    note: '',
                    tabs: [{
                      id: 0,
                      label: '基础信息',
                      inputs: [INSTRUCNAME, DESCRIPTION]
                    }, {
                      id: 1,
                      label: '资源配置',
                      inputs: [DOMAINPATH, TARGETSOURCE, DIRECTIVELIST, DEVICElIST]
                    }, {
                      id: 2,
                      label: "定时策略",
                      inputs: [GRANULARITYUNIT, CALMODE, TIMESELECT]
                    }, {
                      id: 3,
                      label: "指令参数",
                      inputs: [TABLE]
                    }],
                    button: [{
                      label: TEXT.SUBMIT,
                      icon: "btn btn-primary",
                      disabledFn: function() {
                        var rs = [];
                        for (var i in scope.dialog.tabs) {
                          rs = rs.concat(scope.dialog.tabs[i].inputs);
                        };
                        var some = rs.some(function(elem) {
                          return elem.right == false;
                        });
                        if (scope.dialog.tabs[3].inputs[0].options.length > 0) {
                          var opt = scope.dialog.tabs[3].inputs[0].options;
                          for (var p in opt) {
                            var inp = opt[p].inputs;
                            for (var n in inp) {
                              if (inp[n].label == '取值' && !inp[n].value && inp[n].value == undefined) {
                                return true;
                              }
                            }
                          }
                        }
                        return some;
                      },
                      fn: function() {
                        var self = scope.dialog;
                        var inputs = [];
                        var newVar = {
                          "kpiDefinitionIds": [],
                          "thresholds": [],
                          "params": []
                        };
                        for (var i in self.tabs) {
                          inputs = inputs.concat(self.tabs[i].inputs);
                        };
                        var timeToCron = function(data, type) {
                          console.log(data);
                          var rs = "";
                          var arr = ['second', 'minute', 'hour', 'day', 'month', 'week', 'year'];
                          var arrcount = ['second', 'secondcount', 'minute', 'minutecount', 'hour', 'hourcount', 'day', 'daycount', 'month', 'month',
                            'week', 'weekcount', 'year', 'yearcount'
                          ];
                          arrcount = ['secondcount', 'minutecount', 'hourcount', 'daycount', 'monthcount',
                            'weekcount', 'yearcount'
                          ];
                          var fd = data.find(function(elem) {
                            return elem.data == 'week' || elem.data == 'day';
                          });
                          var weekOrDay = 'week';
                          if (fd) {
                            if (fd.data == 'week') {
                              weekOrDay = 'day'
                            } else {
                              weekOrDay = 'week'
                            };
                          };
                          var calcExp = function(item) {
                            var find = data.find(function(elem) {
                              return elem.data == item;
                            });
                            if (find) {
                              return find.value;
                            } else {
                              return undefined;
                            };
                          };
                          var inx = 0;
                          var findVal = false;
                          var repeat = function(index) {
                            var result = calcExp(arr[index]);
                            if (result != undefined) {
                              findVal = true;
                              rs += result;
                            } else {
                              if (findVal == true) {
                                if (arr[index] == weekOrDay) {
                                  rs += "?";
                                } else {
                                  rs += "*";
                                };
                              } else {
                                rs += "0";
                              }
                            }
                            index++;
                            if (arr[index]) {
                              rs += " ";
                              repeat(index);
                            };
                          };

                          var repeatcount = function(index) {
                            var result = calcExp(arr[index]);
                            if (result != undefined) {
                              findVal = true;
                              rs += result;
                            } else {
                              if (findVal == true) {
                                if (arr[index] == weekOrDay) {
                                  rs += "?";
                                } else {
                                  rs += "*";
                                }
                              } else {
                                rs += "0";
                              }
                            }

                            /* if (index == 0) {
                               index++;
                             } else {
                               index = index + 1;
                             }*/
                            var judgeValue = calcExp(arrcount[index]); //次数值 
                            /* if (index > 1) {
                               index--;
                             }*/
                            if (judgeValue) { //次数有值
                              rs += '/' + judgeValue + ' ';
                            } else {
                              rs += ' ';
                            }
                            index++;
                            if (arr[index]) {
                              repeatcount(index);
                            }
                          };

                          if (type.value == 'assign') {
                            repeat(inx);
                          } else if (type.value == 'count') {
                            repeatcount(inx);
                          }
                          console.log(rs);
                          return rs;
                        };

                        var judgeAlarm = function(obj) {
                          for (var i in obj.params) {
                            var val = obj.params[i];
                            if (!val.value) {
                              growl.warning('请输入完整配置项的取值');
                              return false;
                            }
                          }
                          for (var i in obj.thresholds) {
                            var val = obj.thresholds[i];
                            if (val.kpiId) {
                              if (!val.compareType) {
                                growl.warning('请选择数据项的条件');
                                return false;
                              } else if (!val.thresholdValue) {
                                growl.warning('请输入完整数据项的值');
                                return false;
                              }
                            } else if (val.compareType || val.thresholdValue) {
                              growl.warning('请选择数据项');
                              return false;
                            }
                          }
                          return true;
                        };

                        if (target) {
                          target.kpiDefinitionIds = [];
                          target.thresholds = [];
                          target.params = [];
                          /* var type = {
                             'value': ''
                           };*/
                          var type = inputs.find(function(item) {
                            return item.data == 'calmode';
                          });
                          var loop = function(elem) {
                            if (typeof elem.value != "function" && elem.calculable != false && elem.data != "") {
                              if (elem.type == "groupSelect") {
                                /*if (target.cron.indexOf('/') > -1) {
                                  type.value = 'count';
                                } else {
                                  type.value = 'assign';
                                }*/
                                target[elem.data] = timeToCron(elem.groups, type);
                              } else if (elem.type == "table") {
                                elem.options.forEach(function(item) {
                                  target.kpiDefinitionIds.push(item.id);
                                  target.thresholds.push({
                                    "targetKpiId": item.id,
                                    "kpiId": item.inputs[2].value,
                                    "compareType": item.inputs[3].value,
                                    "thresholdValue": item.inputs[4].value
                                  });
                                  target.params.push({
                                    "kpiId": item.id,
                                    "name": item.name,
                                    "value": item.inputs[1].value
                                  });
                                });
                              } else {
                                target[elem.data] = elem.value;
                              }
                            };
                          };
                          for (var i in inputs) {
                            loop(inputs[i]);
                          };
                          if (!judgeAlarm(target)) {
                            return;
                          };
                          directiveStrategyUIService.updateDirectiveStrategys(target, function(event) {
                            if (event.code == "0") {
                              growl.success("指令策略修改完成");
                              ngDialog.close();
                            };
                          });
                        } else {
                          var type = inputs.find(function(item) {
                            return item.data == 'calmode';
                          });
                          var loop = function(elem) {
                            if (typeof elem.value != "function" && elem.calculable != false && elem.data != "") {
                              if (elem.type == "groupSelect") {
                                newVar[elem.data] = timeToCron(elem.groups, type);
                              } else if (elem.type == "table") {
                                console.log(elem);
                                elem.options.forEach(function(item) {
                                  newVar.kpiDefinitionIds.push(item.id);
                                  newVar.thresholds.push({
                                    "targetKpiId": item.id,
                                    "kpiId": item.inputs[2].value,
                                    "compareType": item.inputs[3].value,
                                    "thresholdValue": item.inputs[4].value
                                  });
                                  newVar.params.push({
                                    "kpiId": item.id,
                                    "name": item.name,
                                    "value": item.inputs[1].value
                                  });
                                });
                              } else {
                                newVar[elem.data] = elem.value;
                              }
                            };
                          };
                          for (var i in inputs) {
                            loop(inputs[i]);
                          };
                          if (!judgeAlarm(newVar)) {
                            return;
                          };
                          directiveStrategyUIService.addDirectiveStrategys(newVar, function(event) {
                            if (event.code == "0") {
                              allInstructAry.pushbefore(event.data);
                              growl.success("指令策略添加完成");
                              ngDialog.close();
                            };
                          });
                        }

                      }
                    }, {
                      label: TEXT.CANCEL,
                      icon: "btn btn-default",
                      fn: function() {
                        ngDialog.close();
                      }
                    }]
                  };
                };
                if (!target) {
                  start();
                }
                // });
                ngDialog.open({
                  template: '../partials/dialogue/config_alert_dia2.html',
                  className: 'ngdialog-theme-plain',
                  scope: scope
                });
              };
              var addNewClick = function() {
                editInstruc();
              };
              var editClick = function(target) {
                editInstruc(target);
              };
              var deleteInstruc = function(param, callback) {
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
                    directiveStrategyUIService.deleteDirectiveStrategy(param, function(event) {
                      callback(event);
                    });
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
                    label: '确认要删除此指令策略吗？'
                  },
                  fnlist: fnlist
                };
                ngDialog.open({
                  template: '../partials/dialogue/common_dia_prompt.html',
                  className: 'ngdialog-theme-plain',
                  scope: scope
                });
              };
              var deleteClick = function(target) {
                deleteInstruc(target.id, function(event) {
                  if (event.code == 0) {
                    growl.success("删除指令策略成功！");
                    target.remove();
                  }
                });
              };

              var gotoClick = function(target) {
                // window.open("../app-oc/index.html#/instructionStrategy/" + target.id, "_blank");
                location.href = '../app-oc/index.html#/instructionStrategy/' + target.id;

              };
              var strHeader = {};
              var strEdit = {};
              var strDel = {};
              var optList = [];
              if (scope.menuitems['A01_S34']) {
                strHeader = {
                  icon: "fa fa-plus",
                  class: "btn btn-primary btn-sm",
                  label: "添加指令策略",
                  style: {
                    margin: "2px"
                  },
                  type: "button",
                  events: {
                    click: addNewClick
                  }
                };
              }
              if (scope.menuitems['A02_S34']) {
                strEdit = {
                  class: "btn btn-primary",
                  label: "编辑",
                  type: "button",
                  events: {
                    click: editClick
                  }
                };
                optList.push(strEdit);
              }
              if (scope.menuitems['A03_S34']) {
                strDel = {
                  class: "btn btn-default",
                  label: "删除",
                  type: "button",
                  events: {
                    click: deleteClick
                  }
                };
                optList.push(strDel);
              }
              if (scope.menuitems['A04_S34']) {
                strDel = {
                  class: "btn btn-default",
                  label: "详情",
                  type: "button",
                  events: {
                    click: gotoClick
                  }
                };
                optList.push(strDel);
              }
              scope.instructions = {
                source: allInstructAry,
                showSelector: false,
                header: [strHeader],
                columnDefs: [{
                  label: "标识",
                  width: "10%",
                  editable: true,
                  sortable: true,
                  filterable: true,
                  data: "id",
                  type: "text",
                  modes: {
                    default: {
                      type: "text"
                    },
                    edit: {
                      type: "input",
                      placeholder: ""
                    }
                  }
                }, {
                  label: "名称",
                  width: "20%",
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
                      placeholder: ""
                    }
                  }
                }, {
                  "label": "设备模板",
                  width: "10%",
                  editable: true,
                  sortable: true,
                  filterable: true,
                  data: "deviceModelId",
                  type: "select",
                  options: allModels,
                  filterFormat: {
                    "label": "label",
                    "value": "id"
                  },
                  format: function(value, row) {
                    if (row) {
                      return allModels.find(function(item) {
                        return item.id == value
                      }).label;
                    } else {
                      return '-';
                    }
                  },
                  modes: {
                    default: {
                      type: "text",
                    },
                    edit: {
                      type: "input",
                      placeholder: ""
                    }
                  }
                }, {
                  label: "创建时间",
                  data: "createTime",
                  type: "date",
                  format: "yy-mm-dd hh:nn:ss",
                  filterable: false,
                  sortable: true,
                  modes: {
                    default: {
                      type: "date",
                    }
                  }
                }, {
                  label: "计算频率",
                  width: "auto",
                  editable: true,
                  sortable: true,
                  filterable: true,
                  data: "frequency",
                  type: "select",
                  options: granularityUnits,
                  filterFormat: {
                    "label": "label",
                    "value": "id"
                  },
                  format: function(value, row) {
                    if (row) {
                      return granularityUnits.find(function(item) {
                        return item.id == value
                      }).label;
                    } else {
                      return '-';
                    }
                  },
                  modes: {
                    default: {
                      type: "text",
                    },
                    edit: {
                      type: "input",
                      placeholder: ""
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
                      options: optList
                    }
                  }
                }]
              };
            });
          });
        });
      };

      var init2 = function(instrId) {
        scope.pipeline = function(opts) {
          // Configuration options
          var conf = $.extend({
            pages: 1, // number of pages to cache
            url: '', // script url
            data: null, // function or object with parameters to send to the server
            // matching how `ajax.data` works in DataTables
            method: 'POST' // Ajax HTTP method
          }, opts);

          // Private variables for storing the cache
          var cacheLower = -1;
          var cacheUpper = null;
          var cacheLastRequest = null;
          var cacheLastJson = null;

          return function(request, drawCallback, settings) {
            var ajax = false;
            var requestStart = request.start;
            var drawStart = request.start;
            var requestLength = request.length;
            var requestEnd = requestStart + requestLength;
            var sort = request.columns[request.order[0].column].data; //排序字段
            var sortType = request.order[0].dir; //排序方式
            if (settings.clearCache) {
              // API requested that the cache be cleared
              ajax = true;
              settings.clearCache = false;
            } else if (cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
              // outside cached data - need to make a request
              ajax = true;
            } else if (JSON.stringify(request.order) !== JSON.stringify(cacheLastRequest.order) ||
              JSON.stringify(request.columns) !== JSON.stringify(cacheLastRequest.columns) ||
              JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)
            ) {
              // properties changed (ordering, columns, searching)
              ajax = true;
            }

            // Store the request for checking next time around
            cacheLastRequest = $.extend(true, {}, request);

            if (ajax) {
              // Need data from the server
              if (requestStart < cacheLower) {
                requestStart = requestStart - (requestLength * (conf.pages - 1));

                if (requestStart < 0) {
                  requestStart = 0;
                }
              }

              cacheLower = requestStart;
              cacheUpper = requestStart + (requestLength * conf.pages);

              request.start = requestStart;
              request.length = requestLength * conf.pages;

              // Provide the same `data` options as DataTables.
              if ($.isFunction(conf.data)) {
                // As a function it is executed with the data object as an arg
                // for manipulation. If an object is returned, it is used as the
                // data object to submit
                var d = conf.data(request);
                if (d) {
                  $.extend(request, d);
                }
              } else if ($.isPlainObject(conf.data)) {
                // As an object, the data given extends the default
                $.extend(request, conf.data);
              }
              var pageRequest = {
                start: request.start,
                length: request.length,
                sort: sort,
                sortType: sortType,
                statCount: request.draw == 1
              }

              scope.getHistoryByPage(scope.queryList, pageRequest, function(returnObj, total) {
                var json = {};
                json.data = returnObj;
                json.draw = request.draw; // Update the echo for each response
                json.recordsTotal = total != undefined ? (total == -1 ? cacheLastJson.recordsTotal : total) : returnObj.length;
                json.recordsFiltered = json.recordsTotal;
                cacheLastJson = $.extend(true, {}, json);

                if (cacheLower != drawStart) {
                  json.data.splice(0, drawStart - cacheLower);
                }
                if (requestLength >= -1) {
                  json.data.splice(requestLength, json.data.length);
                }

                drawCallback(json);
              });
            } else {
              var json = $.extend(true, {}, cacheLastJson);
              json.draw = request.draw; // Update the echo for each response
              json.data.splice(0, requestStart - cacheLower);
              json.data.splice(requestLength, json.data.length);

              drawCallback(json);
            }
          }
        };
        scope.getHistoryByPage = function(queryItem, pageRequest, callback) {
          directiveStrategyUIService.getDirectiveStrategyHistory([queryItem[0], queryItem[1], pageRequest], function(returnObj) {
            if (returnObj.code == 0) {
              if (callback) {
                callback(returnObj.data.data, returnObj.data.total);
              }
            }
          })
        };

        scope.goSearch = function(obj) {
          scope.queryList = [instrId, obj.way];
          $timeout(function() {
            scope.$broadcast(Event.ENTERPRISEINIT + "_history", {
              "option": []
            });
          });
        };
        if (instrId) {
          scope.goSearch({
            way: ''
          });
        }
      };

      /**
       * 监听登录状态
       */
      if (!userLoginUIService.user.isAuthenticated) {
        scope.$on('loginStatusChanged', function(evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            if ($routeParams.instrId) {
              init2($routeParams.instrId);
            } else {
              init();
            }

          }
        });
      } else {
        if ($routeParams.instrId) {
          init2($routeParams.instrId);
        } else {
          init();
        }
      }

    }
  ]);

});