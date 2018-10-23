define(['controllers/controllers', 'bootstrap-dialog', 'Array'], function(controllers, BootstrapDialog) {
  'use strict';

  //================================================     企业信息   ====================================================
  controllers.initController('enterpriseCtrl', ['$scope', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'userDomainService',
    function($scope, $routeParams, $timeout, $q, $location, ngDialog, userLoginUIService, energyConsumeUIService, growl, userDomainService) {
      $scope.selectedCount = 0;
      var deferList = [];
      $scope.$watch("myDicts", function(n, o) {
        if (n) {
          $scope.industryList = $scope.myDicts['industryShortType'];
          $scope.industryList.forEach(function(item) {
            item.id = item.valueCode;
            item.text = item.param;
          });
        }
      });

      //企业dialog
      $scope.dialog = {
        title: "企业信息",
        input: {
          name: '',
          statisticsType: '', //周期
          industryType: '',
          province: '',
          city: '',
          county: '',
          address: '',
          id: -1,
          createTime: new Date()
        },
        list: {
          provincesList: $scope.provinces,
          periodList: [{
            id: 'MONTH',
            label: '月'
          }, {
            id: 'QUARTER',
            label: '季度'
          }, {
            id: 'YEAR',
            label: '年'
          }],
          cityList: null,
          districtList: null
        },
        event: {
          provinceClick: function(provinceId) {
            $scope.dialog.input.districtId = "";
            if ($scope.cityDics[provinceId]) {
              $scope.dialog.list.cityList = $scope.cityDics[provinceId];
            }
          },
          cityClick: function(cityId) {
            if ($scope.districtDics[cityId]) {
              $scope.dialog.list.districtList = $scope.districtDics[cityId];
            }
          }
        },
        button: [{
          label: "确定",
          disabled: function() {
            // var every = scope.dialog.input.every(function(elem) {
            //   return elem.right != false;
            // });
            // return !every;
          },
          fn: function() {
            $scope.dialog.input.values = {};
            $scope.dialog.input.values.standardAddress = $scope.dialog.input.county ? $scope.dialog.input.county : ($scope.dialog.input.city ? $scope.dialog.input.city : ($scope.dialog.input.province));
            var addEnterprise_callback = function(returnObj) {
              if (returnObj.code == 0) {
                $scope.searchData();
                // var newEnterprise = returnObj.data;
                // $scope.queryAllList.push(newEnterprise);
                // broardFun($scope.queryAllList);
                growl.success("添加企业信息成功", {});
              }
            };
            var updataEnterprise_callback = function(returnObj) {
              if (returnObj.code == 0) {
                $scope.searchData();
                growl.success("修改企业信息成功", {});
                // $scope.queryAllList.forEach(function(item) {
                //   if (item.id == $scope.dialog.input.id) {
                //     $.extend(item, $scope.dialog.input);
                //   }
                //   return;
                // })
              }
            }
            if ($scope.dialog.input.id == -1) { //新增
              energyConsumeUIService.addEnterpriseInfo($scope.dialog.input, addEnterprise_callback);
            } else if ($scope.dialog.input.id > 0) { //编辑
              energyConsumeUIService.updateEnterpriseInfo($scope.dialog.input, updataEnterprise_callback);
            }
            ngDialog.close();
          }
        }, {
          label: "取消",
          fn: function() {
            ngDialog.close();
          }
        }]
      };

      //初始化数据
      var initData = function(obj) {
        $scope.dialog.input = {
          name: obj.name ? obj.name : "",
          statisticsType: obj.statisticsType ? obj.statisticsType : "", //周期
          industryType: obj.industryType ? obj.industryType : "",
          province: obj.province ? obj.province : "",
          city: obj.city ? obj.city : "",
          county: obj.county ? obj.county : "",
          address: obj.address ? obj.address : "",
          id: obj.id ? obj.id : -1,
          createTime: obj.createTime ? obj.createTime : new Date()
        };
      };

      $scope.addNewClick = function() {
        initData({});
        ngDialog.open({
          template: '../partials/dialogue/enterprise_dia.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });
      };

      //企业展示信息
      $scope.tableInit = {
        'header': {
          'label': "企业信息管理",
          'time': ''
        },
        'select': {
          name: '',
          industryType: '',
          statisticsType: ''
        },
        event: function() {
          $scope.tableInit.select.name = $scope.queryState.state == 1 ? $scope.tableInit.select.name : null;
          $scope.tableInit.select.industryType = $scope.queryState.state == 2 ? $scope.tableInit.select.industryType : null;
          $scope.tableInit.select.province = $scope.queryState.state == 3 ? $scope.tableInit.select.province : null;
          $scope.tableInit.select.city = $scope.queryState.state == 3 ? $scope.tableInit.select.city : null;
          $scope.tableInit.select.county = $scope.queryState.state == 3 ? $scope.tableInit.select.county : null;
          $scope.tableInit.select.statisticsType = $scope.queryState.state == 4 ? $scope.tableInit.select.statisticsType : null;
        },
        clacTime: function() {
          if (!$scope.tableInit.header.time) {
            growl.warning("请先选择时间", {});
            return;
          }
          energyConsumeUIService.clacKqiByTime($scope.tableInit.header.time, function(returnObj) {
            if (returnObj.code == 0) {
              growl.success("已开始计算数据", {});
            }
          })
        }
      };

      //table动作
      $scope.doAction = function(type, select, callback) {
        if (type == 'delete') {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除该企业信息？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                energyConsumeUIService.deleteEnterpriseInfo([select], function(returnObj) {
                  callback(returnObj);
                  if (returnObj.code == 0) {
                    $scope.searchData();
                    // $scope.queryAllList.forEach(function(item) {
                    //   select.forEach(function(sel) {
                    //     if (item.id == sel) {
                    //       $scope.queryAllList.splice(item, 1);
                    //     }
                    //   })
                    // })
                    growl.success("企业信息已删除", {});
                    $scope.selectedCount = 0;
                    $scope.$apply();
                    return;
                  }
                })
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                dialogRef.close();
              }
            }]
          });
        }
      };

      $scope.pipeline = function(opts) {
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

            $scope.getEnterpriceByPage($scope.queryList, pageRequest, function(returnObj, total) {
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
      $scope.getEnterpriceByPage = function(queryItem, pageRequest, callback) {
        energyConsumeUIService.findEnterpriseInfosByCondition([queryItem, pageRequest], function(returnObj) {
          if (returnObj.code == 0) {
            if (callback) {
              callback(returnObj.data.data, returnObj.data.total);
            }
            // var ids = [];
            // for (var i in returnObj.data.data) {
            //   ids.push(returnObj.data.data[i].id);
            // }
            // getSearchResourceState(ids, returnObj.data.data, function(data) {
            //   if (callback) {
            //     callback(data, returnObj.data.count);
            //   }
            // });

          }
        })
      };

      $scope.searchData = function() {
        $scope.queryList = {
          "id": $scope.tableInit.select.id ? $scope.tableInit.select.id : "",
          "industryType": $scope.tableInit.select.industryType ? $scope.tableInit.select.industryType : "",
          "province": $scope.tableInit.select.province ? $scope.tableInit.select.province : "",
          "city": $scope.tableInit.select.city ? $scope.tableInit.select.city : "",
          "county": $scope.tableInit.select.county ? $scope.tableInit.select.county : "",
          "statisticsType": $scope.tableInit.select.statisticsType ? $scope.tableInit.select.statisticsType : "",
          "name": $scope.tableInit.select.name ? $scope.tableInit.select.name : "",
        };
        $timeout(function() {
          $scope.$broadcast(Event.ENTERPRISEINIT + "_info", {
            "option": []
          });
        })
      };

      //根据用户Id查用户域
      var domainTreeQuery = function() {
        var defer = $q.defer();
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function(data) {
          $scope.domainListTree = data.domainListTree;
          $scope.domainListDic = data.domainListDic;
          defer.resolve("success");
        });
        deferList.push(defer.promise);
      };

      // var getIndustry = function() {
      //   var industryDic = [];
      //   $.extend(industryDic, $scope.myDicts['industryType']);
      //   var defer = $q.defer();
      //   industryDic.forEach(function(item) {
      //     item.id = item.valueCode;
      //     item.text = item.label;
      //   });
      //   $scope.industryList = industryDic;
      //   defer.resolve("seccess");
      //   deferList.push(defer.promise);
      // };

      var init = function() {
        // getIndustry();
        domainTreeQuery();
        $q.all(deferList).then(function() {
          $scope.searchData();
        });
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

  //================================================   产品结构（产品信息）   ======================================================
  controllers.initController('productCtrl', ['$scope', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'unitService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'userDomainService',
    function($scope, $routeParams, $timeout, $q, $location, ngDialog, unitService, userLoginUIService, energyConsumeUIService, growl, userDomainService) {
      $scope.selectedCount = 0;
      if (userLoginUIService.user.userType == 100) { //政府操作菜单
        $scope.ifShowEnter = true;
      } else { //企业操作
        $scope.ifShowEnter = false;
      }

      var deferList = [];
      //获取全部单位
      var getUnit = (function() {
        $scope.unitList = unitService.units;
        $scope.unitDics = unitService.unitDics;
      })();
      //产品dialog
      $scope.dialog = {
        title: "产品结构",
        input: {
          enterpriseId: '',
          name: '', // 产品名称
          desc: '',
          unit: '',
          id: -1,
          createTime: new Date()
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
            var addproduct_callback = function(returnObj) {
              if (returnObj.code == 0) {
                var newproduct = returnObj.data;
                $scope.queryAllList.push(newproduct);
                broardFun($scope.queryAllList);
                growl.success("添加产品信息成功", {});
              }
            };
            var updataproduct_callback = function(returnObj) {
              if (returnObj.code == 0) {
                $scope.queryAllList.forEach(function(item) {
                  if (item.id == $scope.dialog.input.id) {
                    $.extend(item, $scope.dialog.input);
                  }
                  broardFun($scope.queryAllList);
                  growl.success("产品信息修改完成", {});

                  return;
                })
              }
            }
            if ($scope.dialog.input.id == -1) { //新增
              if (!$scope.ifShowEnter) {
                delete($scope.dialog.input.enterpriseId);
              }
              energyConsumeUIService.addProduct($scope.dialog.input, addproduct_callback);
            } else if ($scope.dialog.input.id > 0) { //编辑
              energyConsumeUIService.updateProduct($scope.dialog.input, updataproduct_callback);
            }
            ngDialog.close();
          }
        }, {
          label: "取消",
          fn: function() {
            ngDialog.close();
          }
        }]
      };

      var broardFun = function(objList) {
        $timeout(function() {
          $scope.$broadcast(Event.ENTERPRISEINIT + "_product", {
            "option": [objList]
          });
        })
      };

      //初始化数据
      var initData = function(obj) {
        $scope.dialog.input = {
          name: obj.name ? obj.name : "",
          // domainPath: obj.domainPath ? obj.domainPath : "", //企业域
          desc: obj.desc ? obj.desc : "",
          unit: obj.unit ? obj.unit : "",
          id: obj.id ? obj.id : -1,
          createTime: obj.createTime ? obj.createTime : new Date()
        };
      };

      //产品展示信息
      $scope.tableInit = {
        'header': {
          'label': "产品结构管理",
          'delete': "删除产品结构"
        },
        'select': {
          'name': '',
          'desc': '',
          'enterpriseId': ''
        },
        'event': {
          'addClick': function() {
            initData({});
            ngDialog.open({
              template: '../partials/dialogue/product_info_dia.html',
              className: 'ngdialog-theme-plain',
              scope: $scope
            });
          },
          'goClear': function() {
            $scope.tableInit.select.name = $scope.queryState.state == 1 ? $scope.tableInit.select.name : null;
            $scope.tableInit.select.desc = $scope.queryState.state == 2 ? $scope.tableInit.select.desc : null;
            $scope.tableInit.select.enterpriseId = $scope.queryState.state == 3 ? $scope.tableInit.select.enterpriseId : null;
          }
        }
      };

      //table动作
      $scope.doAction = function(type, select, callback) {
        if (type == 'delete') {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除该产品结构？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                energyConsumeUIService.deleteProduct([select], function(returnObj) {
                  callback(returnObj);
                  if (returnObj.code == 0) {
                    select.forEach(function(sel) {
                      for (var i in $scope.queryAllList) {
                        if (sel == $scope.queryAllList[i].id) {
                          $scope.queryAllList.splice(i, 1);
                        }
                      }
                    })

                    growl.success("产品结构已删除", {});
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
        }
      };

      $scope.searchData = function() {
        var param = {
          "id": $scope.tableInit.select.id ? $scope.tableInit.select.id : "",
          "enterpriseId": $scope.tableInit.select.enterpriseId ? $scope.tableInit.select.enterpriseId : ($routeParams.enterpriseId ? $routeParams.enterpriseId : ""),
          "desc": $scope.tableInit.select.desc ? $scope.tableInit.select.desc : "",
          "name": $scope.tableInit.select.name ? $scope.tableInit.select.name : "",
        };
        energyConsumeUIService.findProducts(param, function(returnObj) {
          if (returnObj.code == 0) {
            $scope.queryAllList = returnObj.data;
            broardFun(returnObj.data);
          }
        })
      };

      //获取所有企业
      (function() {
        var queryList = {
          "id": "",
          "industryType": "",
          "province": "",
          "city": "",
          "county": "",
          "statisticsType": "",
          "name": "",
        };
        var pageRequest = {
          start: 0,
          length: 1000000000,
          sort: "createTime",
          sortType: "desc",
          statCount: true
        };
        energyConsumeUIService.findEnterpriseInfosByCondition([queryList, pageRequest], function(returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.data.forEach(function(item) {
              item.text = item.name;
            })
            $scope.enterpriseList = returnObj.data.data;
          }
        })
      })();

      //根据用户Id查用户域
      var domainTreeQuery = function() {
        var defer = $q.defer();
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function(data) {
          $scope.domainListTree = data.domainListTree;
          $scope.domainListDic = data.domainListDic;
          defer.resolve("success");
        });
        deferList.push(defer.promise);
      };
      var findProductsByEnterId = function(enterpriseId) {
        energyConsumeUIService.findProductsByEnterpriseId([enterpriseId], function(returnObj) {
          if (returnObj.code == 0) {
            $scope.queryAllList = returnObj.data;
            broardFun(returnObj.data);
          }
        })
      };
      var init = function() {
        domainTreeQuery();
        $q.all(deferList).then(function() {
          $scope.searchData();
          // if ($routeParams.enterpriseId) {
          //   findProductsByEnterId($routeParams.enterpriseId);
          // } else {
          //   $scope.searchData();
          // }
        });
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

  //================================================  工艺流程   ======================================================
  controllers.initController('productStructureCtrl', ['$scope', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'userDomainService',
    function($scope, $routeParams, $timeout, $q, $location, ngDialog, userLoginUIService, energyConsumeUIService, growl, userDomainService) {
      $scope.selectedCount = 0;
      var deferList = [];
      var routeParamsId = $routeParams.productId;

      //产品dialog
      $scope.dialog = {
        title: "工艺流程",
        input: {
          occupyPrcent: '', //所占比例
          energyConsumeNodeId: '', // 能耗节点Id
          id: -1,
          productId: routeParamsId,
          createTime: new Date()
        },
        event: {
          verifyFun: function(type, value) {
            var reg, r;
            if (type == 'number') {
              // var isNumber = /^(0|[0-9][0-9]?|100)$/; //只准输入1-100，保留两位小数的数字
              // var isNumber = /^[0-9]\d*(\.\d+)$/; //输入大于等于0的数字
              var isNumber = /^\d+(\.{0,1}\d+){0,1}$/; //输入非负数
              r = isNumber.test(value);
              if (value == 0) {
                r = true;
              }
              if (!r) {
                $scope.mistakeMesg = true;
              } else {
                $scope.mistakeMesg = false;
              }
            }
          }
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
            if ($scope.mistakeMesg) {
              growl.warning("请正确输入所用分钟数", {});
              return;
            }
            var addProductStruct_callback = function(returnObj) {
              if (returnObj.code == 0) {
                var newproduct = returnObj.data;
                $scope.queryAllList.push(newproduct);
                broardFun($scope.queryAllList);
                growl.success("添加工艺流程成功", {});
              }
            };
            var updataProductStruct_callback = function(returnObj) {
              if (returnObj.code == 0) {
                $scope.queryAllList.forEach(function(item) {
                  if (item.id == $scope.dialog.input.id) {
                    $.extend(item, $scope.dialog.input);
                  }
                  broardFun($scope.queryAllList);
                  growl.success("工艺流程修改完成", {});
                  return;
                })
              }
            }
            $scope.dialog.input.productId = parseInt(routeParamsId);
            if ($scope.dialog.input.id == -1) { //新增             
              energyConsumeUIService.addProductStruct($scope.dialog.input, addProductStruct_callback);
            } else if ($scope.dialog.input.id > 0) { //编辑
              energyConsumeUIService.updateProductStruct($scope.dialog.input, updataProductStruct_callback);
            }
            ngDialog.close();
          }
        }, {
          label: "取消",
          fn: function() {
            ngDialog.close();
          }
        }]
      };

      var broardFun = function(objList) {
        $timeout(function() {
          $scope.$broadcast(Event.ENTERPRISEINIT + "_structrue", {
            "option": [objList]
          });
        })
      };

      //初始化数据
      var initData = function(obj) {
        $scope.dialog.input = {
          occupyPrcent: obj.occupyPrcent ? obj.occupyPrcent : "",
          energyConsumeNodeId: obj.energyConsumeNodeId ? obj.energyConsumeNodeId : "",
          id: obj.id ? obj.id : -1,
          createTime: obj.createTime ? obj.createTime : new Date()
        };
      };
      //企业展示信息
      $scope.tableInit = {
        'header': {
          'label': "工艺流程",
          'delete': "删除工艺流程"
        },
        'select': {
          'occupyPrcent': '',
          'energyConsumeNodeId': ''
        },
        'event': {
          'addClick': function() {
            initData({});
            ngDialog.open({
              template: '../partials/dialogue/product_structrue_dia.html',
              className: 'ngdialog-theme-plain',
              scope: $scope
            });
          },
          'goClear': function() {
            $scope.tableInit.select.occupyPrcent = $scope.queryState.state == 1 ? $scope.tableInit.select.occupyPrcent : null;
            $scope.tableInit.select.energyConsumeNodeId = $scope.queryState.state == 1 ? $scope.tableInit.select.energyConsumeNodeId : null;
          }
        }
      };

      //table动作
      $scope.doAction = function(type, select, callback) {
        if (type == 'delete') {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除该工艺流程？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                energyConsumeUIService.deleteProductStruct([select], function(returnObj) {
                  callback(returnObj);
                  if (returnObj.code == 0) {
                    for (var i in $scope.queryAllList) {
                      select.forEach(function(sel) {
                        if ($scope.queryAllList[i].id == sel) {
                          $scope.queryAllList.splice(i, 1);
                        }
                      })
                    }
                    // for (var i in $scope.queryAllList) {
                    //   select.forEach(function(sel) {
                    //     sel == $scope.queryAllList[i].id;
                    //     $scope.queryAllList.splice(i, 1);
                    //   })
                    // }
                    // $scope.queryAllList.forEach(function(item) {
                    //   select.forEach(function(sel) {
                    //     if (item.id == sel) {
                    //       $scope.queryAllList.splice(item, 1);
                    //     }
                    //   })
                    // })
                    growl.success("工艺流程已删除", {});
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
        }
      };

      $scope.searchData = function() {
        var param = {
          "productId": parseInt($scope.tableInit.select.productId) ? parseInt($scope.tableInit.select.productId) : (parseInt(routeParamsId) ? parseInt(routeParamsId) : ""),
          "energyConsumeNodeId": $scope.tableInit.select.energyConsumeNodeId ? $scope.tableInit.select.energyConsumeNodeId : "",
          "occupyPrcent": parseFloat($scope.tableInit.select.occupyPrcent) ? parseFloat($scope.tableInit.select.occupyPrcent) : "",
        };
        energyConsumeUIService.findProductStructs(param, function(returnObj) {
          if (returnObj.code == 0) {
            $scope.queryAllList = returnObj.data;
            broardFun(returnObj.data);
          }
        });

      };

      //根据用户Id查用户域
      var domainTreeQuery = function() {
        var defer = $q.defer();
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function(data) {
          $scope.domainListTree = data.domainListTree;
          $scope.domainListDic = data.domainListDic;
          defer.resolve("success");
        });
        deferList.push(defer.promise);
      };

      //根据用户path查能耗结构
      function queryEnergyTree(param) {
        // var defer = $q.defer();
        energyConsumeUIService.queryEnergyTree([param], function(data) {
          $scope.energyListTree = data.energyListTree;
          $scope.energyListDic = data.energyListDic;
          // defer.resolve("success");
        });
        // deferList.push(defer.promise);
      };

      var init = function() {
        domainTreeQuery();
        if (userLoginUIService.user.userType == 100) {
          energyConsumeUIService.findProductById([parseInt(routeParamsId)], function(returnObj) {
            var path = returnObj.data.domainPath;
            queryEnergyTree(path);
          });
        } else {
          queryEnergyTree();
        }
        $q.all(deferList).then(function() {
          $scope.searchData();
        });
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

  //================================================   企业经营信息   ======================================================
  controllers.initController('enterpriseOperateCtrl', ['$scope', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'unitService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'userDomainService',
    function($scope, $routeParams, $timeout, $q, $location, ngDialog, unitService, userLoginUIService, energyConsumeUIService, growl, userDomainService) {
      var productYields = {};
      $scope.selectedCount = 0;
      var deferList = [];
      //获取全部单位
      var getUnit = (function() {
        $scope.unitList = unitService.units;
        $scope.unitDics = unitService.unitDics;
      })();

      //获取企业信息
      var getEnterprise = function(domainPath) {
        var deferred = $q.defer();
        if (!$routeParams.enterpriseId) {
          energyConsumeUIService.findEnterpriseInfoByDomainPath([domainPath], function(returnObj) {
            if (returnObj.code == 0) {
              $scope.dialog.statisticsType = returnObj.data.statisticsType;
              deferred.resolve('success');
            }
          });
        } else {
          energyConsumeUIService.findEnterpriseInfoById([$routeParams.enterpriseId], function(returnObj) {
            if (returnObj.code == 0) {
              $scope.dialog.statisticsType = returnObj.data.statisticsType;
              deferred.resolve('success');
            }
          });
        }

        return deferred.promise;
      };

      var broardFun = function(objList) {
        $timeout(function() {
          $scope.$broadcast(Event.ENTERPRISEINIT + "_operate", {
            "option": [objList]
          });
        })
      };

      //初始化数据
      var initData = function(obj) {
        $scope.ifView = false;
        if (obj.statisticsPeriod) {
          var ary = new Date(obj.statisticsPeriod).Format("yyyy-M").split('-');
        }
        $scope.dialog.input.enterpriseOperateInfo = {
          productionValue: obj.productionValue || '', //产值
          additionalValue: obj.additionalValue || '', //附加值
          id: obj.id || 0,
          statisticsPeriod: '', //统计周期
          createTime: obj.createTime || new Date()
        };
        $scope.ignoreList = {
          year: obj.statisticsPeriod ? parseInt(ary[0]) : '',
          month: obj.statisticsPeriod ? parseInt(ary[1]) : '',
          quarter: obj.statisticsPeriod ? parseInt(ary[1]) : ''
        };
        if (!obj.hasOwnProperty('id')) {
          $scope.productYields.forEach(function(item) {
            item.yield = '';
          });
        }
      };

      $scope.ignoreList = {
        year: '',
        month: '',
        quarter: ''
      };

      //产品dialog
      $scope.dialog = {
        title: "企业经营信息",
        statisticsType: "",
        input: {
          enterpriseOperateInfo: {
            productionValue: '', //产值
            additionalValue: '', //附加值
            yieldUnit: '', //单位
            statisticsPeriod: '', //统计周期
            createTime: new Date()
          }
        },
        select: {
          statisticsYear: (function() { //获取年份（2015 ~ 2025年）            
            var yearList = [];
            for (var i = 2015; i < 2026; i++) {
              yearList.push({
                id: i,
                text: i + '年'
              })
            };
            return yearList;
            // return [{
            //   id: 0,
            //   text: "请选择..."
            // }].concat(yearList);
          })(),
          statisticsMonth: (function() { //获取月份（2010 ~ 2020年）
            var monthList = [];
            for (var i = 1; i < 13; i++) {
              monthList.push({
                id: i,
                text: i + '月'
              })
            };
            return monthList;
            // return [{
            //   id: 0,
            //   text: "请选择..."
            // }].concat(monthList);
          })(),
          statisticsQuarter: [{
            id: 1,
            text: '第一季度'
          }, {
            id: 4,
            text: '第二季度'
          }, {
            id: 8,
            text: '第三季度'
          }, {
            id: 12,
            text: '第四季度'
          }]
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
            var verifyFun = function(value) {
              var isNumber = /^[1-9]\d*(\.\d+)?$/;
              var r = isNumber.test(value);
              if (!r) { //不是大于0的正数
                growl.warning("请输入且为大于0的正数", {});
                return false;
              } else {
                return true; //是数字
              }
            };
            var enterpriseOperateInfo = $scope.dialog.input.enterpriseOperateInfo;
            $scope.dialog.input.productYields = $scope.productYields;
            if ($scope.dialog.statisticsType == 'YEAR') {
              enterpriseOperateInfo.statisticsPeriod = $scope.ignoreList.year ? new Date([$scope.ignoreList.year, 1, 1].join('-')) : "";
            } else if ($scope.dialog.statisticsType == 'MONTH') {
              enterpriseOperateInfo.statisticsPeriod = $scope.ignoreList.month ? new Date([$scope.ignoreList.year, $scope.ignoreList.month, 1].join('-')) : "";
            } else if ($scope.dialog.statisticsType == 'QUARTER') {
              enterpriseOperateInfo.statisticsPeriod = $scope.ignoreList.quarter ? new Date([$scope.ignoreList.year, $scope.ignoreList.quarter, 1].join('-')) : "";
            }

            for (var key in enterpriseOperateInfo) {
              if (key == 'productionValue' || key == 'additionalValue') {
                if (!verifyFun(enterpriseOperateInfo[key])) {
                  return;
                };
              }
            }
            $scope.dialog.input.productYields.forEach(function(item) {
              if (!verifyFun(item.yield)) {
                return;
              };
            })
            var addproduct_callback = function(returnObj) {
              if (returnObj.code == 0) {
                var newproduct = returnObj.data.enterpriseOperateInfo;
                $scope.queryAllList.push(newproduct);
                broardFun($scope.queryAllList);
                growl.success("添加企业经营信息成功", {});
              }
            };
            var updataproduct_callback = function(returnObj) {
              if (returnObj.code == 0) {
                $scope.queryAllList.forEach(function(item) {
                  if (item.id == enterpriseOperateInfo.id) {
                    $.extend(item, returnObj.data.enterpriseOperateInfo);
                    broardFun($scope.queryAllList);
                    growl.success("企业经营信息修改完成", {});
                    return;
                  }
                })
              }
            }
            if ($routeParams.enterpriseId) {
              $scope.dialog.input.enterpriseOperateInfo.enterpriseId = $routeParams.enterpriseId;
            }
            if (enterpriseOperateInfo.id == 0) { //新增
              energyConsumeUIService.addEnterpriseOperateInfoDto($scope.dialog.input, addproduct_callback);
            } else if (enterpriseOperateInfo.id > 0) { //编辑
              energyConsumeUIService.updateEnterpriseOperateInfoDto($scope.dialog.input, updataproduct_callback);
            }
            ngDialog.close();
          }
        }, {
          label: "取消",
          fn: function() {
            ngDialog.close();
          }
        }]
      };

      //产品展示信息
      $scope.tableInit = {
        'header': {
          'label': "企业经营信息",
          'add': "添加经营信息",
          'delete': "删除经营信息"
        },
        'select': {
          'year': '',
          'month': '',
          'quarter': '',
          'statisticsYear': [{
            id: 0,
            text: "请选择..."
          }].concat($scope.dialog.select.statisticsYear),
          'statisticsMonth': [{
            id: 0,
            text: "请选择..."
          }].concat($scope.dialog.select.statisticsMonth),
          'statisticsQuarter': [{
            id: 0,
            text: "请选择..."
          }].concat($scope.dialog.select.statisticsQuarter),
          'statisticsPeriod': '', //统计周期
          'productionValue': '' //产值
        },
        'event': {
          'addClick': function() {
            initData({});
            ngDialog.open({
              template: '../partials/dialogue/enterprise_operate_info_dia.html',
              className: 'ngdialog-theme-plain',
              scope: $scope
            });
          },
          'changeYear': function(year) {
            if (!year) {
              $scope.tableInit.select.month = "";
              $scope.tableInit.select.quarter = "";
            }
          }
        }
      };


      //table动作
      $scope.doAction = function(type, select, callback) {
        if (type == 'delete') {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除该企业经营信息？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                energyConsumeUIService.deleteEnterpriseOperateInfoDto([select], function(returnObj) {
                  callback(returnObj);
                  if (returnObj.code == 0) {
                    select.forEach(function(sel) {
                      for (var i in $scope.queryAllList) {
                        if (sel == $scope.queryAllList[i].id) {
                          $scope.queryAllList.splice(i, 1);
                        }
                      }
                    })
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
        } else if (type == 'commit') {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认' + (userLoginUIService.user.userType == 100 ? '审核' : '提交') + ' 该企业经营信息？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                var state = userLoginUIService.user.userType == 100 ? 'pass' : 'yes';
                energyConsumeUIService.updateEnterpriseOperateInfoCommitStatus([select, state], function(returnObj) {
                  callback(returnObj);
                  if (returnObj.code == 0) {
                    if (userLoginUIService.user.userType == 100) {
                      growl.success("企业经营信息已审核", {});
                    } else {
                      growl.success("企业经营信息已提交", {});
                    }
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
        } else if (type == 'edit') {
          energyConsumeUIService.findProductYieldsByOperateId([select.id], function(returnObj) {
            if (returnObj.code == 0) {
              initData(select)
              if (!$routeParams.enterpriseId) {
                $scope.dialog.input.enterpriseOperateInfo.enterpriseId = select.enterpriseId;
                // $.extend($scope.dialog.input, select);
              }
              $scope.productYields = returnObj.data;
              ngDialog.open({
                template: '../partials/dialogue/enterprise_operate_info_dia.html',
                className: 'ngdialog-theme-plain',
                scope: $scope
              });
            }
          })
        } else if (type == 'view') {
          energyConsumeUIService.findProductYieldsByOperateId([select.id], function(returnObj) {
            if (returnObj.code == 0) {
              initData(select);
              $scope.ifView = true;
              // $.extend($scope.dialog.input, select);
              $scope.productYields = returnObj.data;
              ngDialog.open({
                template: '../partials/dialogue/enterprise_operate_info_dia.html',
                className: 'ngdialog-theme-plain',
                scope: $scope
              });
            }
          })
        }
      };

      $scope.searchData = function() {
        var statisticsPeriod = "";
        if ($scope.dialog.statisticsType == 'YEAR') {
          statisticsPeriod = $scope.tableInit.select.year ? new Date(String($scope.tableInit.select.year)) : "";
        } else if ($scope.dialog.statisticsType == 'MONTH') {
          if ($scope.tableInit.select.year && !$scope.tableInit.select.month) {
            statisticsPeriod = new Date(String($scope.tableInit.select.year));
          } else {
            statisticsPeriod = $scope.tableInit.select.month ? new Date([$scope.tableInit.select.year, $scope.tableInit.select.month].join('-')) : "";
          }
        } else if ($scope.dialog.statisticsType == 'QUARTER') {
          if ($scope.tableInit.select.year && !$scope.tableInit.select.quarter) {
            statisticsPeriod = new Date(String($scope.tableInit.select.year));
          } else {
            statisticsPeriod = $scope.tableInit.select.quarter ? new Date([$scope.tableInit.select.year, $scope.tableInit.select.quarter].join('-')) : "";

          }
        }
        var param = {
          "productionValue": $scope.tableInit.select.productionValue ? $scope.tableInit.select.productionValue : "",
          "statisticsPeriod": statisticsPeriod ? statisticsPeriod : "",
          "enterpriseId": $routeParams.enterpriseId ? $routeParams.enterpriseId : "",
        };
        energyConsumeUIService.findEnterpriseOperateInfos(param, function(returnObj) {
          if (returnObj.code == 0) {
            $scope.queryAllList = returnObj.data;
            broardFun(returnObj.data);
          }
        })
      };



      //获取企业的产品信息
      var getProducts = function() {
        energyConsumeUIService.findProducts({
          enterpriseId: $routeParams.enterpriseId
        }, function(returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              item.yield = '';
              item.yieldUnit = item.unit;
              item.productId = item.id;
              item.productName = item.name;
              delete item.id;
            })
            $scope.productYields = returnObj.data;
          }
        });
      };

      var init = function() {
        getEnterprise(userLoginUIService.user.domains);
        getProducts();
        $q.all(deferList).then(function() {
          $scope.searchData();
        });
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

  //================================================     企业基本信息   ====================================================
  controllers.initController('basicEnterpriseCtrl', ['$scope', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'userDomainService',
    function($scope, $routeParams, $timeout, $q, $location, ngDialog, userLoginUIService, energyConsumeUIService, growl, userDomainService) {

      $scope.sortList = [{
        id: "id_1",
        label: "我是哈哈1"
      }, {
        id: "id_2",
        label: "我是哈哈2"
      }, {
        id: "id_3",
        label: "我是哈哈3"
      }, {
        id: "id_4",
        label: "我是哈哈4"
      }, {
        id: "id_5",
        label: "我是哈哈5"
      }];

      $scope.sortList2 = [{
        id: "id_11",
        label: "我是try1"
      }, {
        id: "id_22",
        label: "我是try2"
      }, {
        id: "id_33",
        label: "我是try3"
      }];

      $scope.setting = {
        boxClass: "boxClass",
        ulClass: "ulhaha",
        liClass: "lihaha",
        type: "sort",
        placeholder: "placeholder",
        cursor: "move",
        delay: 50,
        distance: 3
      };

      $scope.clipboard = "hahaCopy";

      //demo end

      $scope.ifGovernment = false;
      $scope.mistakeMesg = {};
      $scope.$watch("myDicts", function(n, o) {
        if (n) {
          $scope.industryList = $scope.myDicts['industryShortType'];
          $scope.granularityList = $scope.myDicts['KqiGranularityUnit'];
          $scope.industryList.forEach(function(item) {
            item.id = item.valueCode;
            item.text = item.param;
          });
          $scope.granularityList = $scope.granularityList.filter(function(item) {
            item.id = item.valueCode;
            item.text = item.label;
            return item.valueCode == 'MONTH' || item.valueCode == 'QUARTER' || item.valueCode == 'YEAR';
          });
        }
      });
      if (location.hash.search('#/businessManagement') > -1) { //企业管理（政府操作员入口）
        $scope.ifGovernment = true;
      }

      var basicInfo = null;

      //企业展示信息
      $scope.tableInit = {
        'header': {
          'label': $scope.ifGovernment ? "企业管理" : "企业基本信息"
        },
        'input': {
          province: "",
          city: "",
          county: "",
          enterpriseSize: "", //企业规模
          address: "", //街道地址
          contactPhone: "", //联系电话
          contactEmail: "", //联系邮箱
          website: "", //主页地址
          business: "", //营业范围
        },
        'select': {
          name: '',
          cityList: [],
          districtList: []
        },
        event: {
          editClick: function() {
            if ($scope.mistakeMesg.phone) {
              growl.warning("请正确输入手机号码", {});
              return;
            }
            if ($scope.mistakeMesg.email) {
              growl.warning("请正确输入邮箱地址", {});
              return;
            }
            if ($scope.mistakeMesg.website) {
              growl.warning("请正确输入主页地址", {});
              return;
            }
            $scope.tableInit.input.values = {};
            $scope.tableInit.input.values.standardAddress = $scope.tableInit.input.county ? $scope.tableInit.input.county : ($scope.tableInit.input.city ? $scope.tableInit.input.city : ($scope.tableInit.input.province));
            energyConsumeUIService.updateEnterpriseInfo($scope.tableInit.input, function(returnObj) {
              if (returnObj.code == 0) {
                growl.success("企业信息保存成功", {});
                return;
              }
            })
          }
        }
      };

      //验证信息
      $scope.verifyFun = function(value, type) {
        var reg, r;
        if (type == "phone") {
          var isMob = /^((1[34578]\d{9})|(0\d{2,4}\-\d{7,8})|\d{8})$/;
          r = isMob.test(value);
          if (!r) {
            if (!value) {
              $scope.mistakeMesg.phone = false;
            } else {
              $scope.mistakeMesg.phone = true;
            }
          } else {
            $scope.mistakeMesg.phone = false;
          }
        } else if (type == "email") {
          reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
          r = reg.test(value);
          if (!r) {
            if (!value) {
              $scope.mistakeMesg.email = false;
            } else {
              $scope.mistakeMesg.email = true;
            }
          } else {
            $scope.mistakeMesg.email = false;
          }
        } else if (type == "website") {
          reg = /(\w+):\/\/([^/:]+)(:\d+)?([^# :]{1,12}.?([^# :]*))/;
          r = reg.test(value);
          if (!r) {
            if (!value) {
              $scope.mistakeMesg.website = false;
            } else {
              $scope.mistakeMesg.website = true;
            }
          } else {
            $scope.mistakeMesg.website = false;
          }
        }
      };

      var currentInfo = function() {
        if ($routeParams.enterpriseId) {
          energyConsumeUIService.findEnterpriseInfoById([$routeParams.enterpriseId], function(returnObj) {
            if (returnObj.code == 0) {
              $scope.tableInit.input = returnObj.data;
              $scope.tableInit.select.cityList = $scope.cityDics[returnObj.data.province];
              $scope.tableInit.select.districtList = $scope.districtDics[returnObj.data.city];
            }
          });
        } else {
          energyConsumeUIService.findEnterpriseInfoByDomainPath([$scope.userInfo.domains], function(returnObj) {
            if (returnObj.code == 0) {
              $scope.tableInit.input = returnObj.data;
              $scope.tableInit.select.cityList = $scope.cityDics[returnObj.data.province];
              $scope.tableInit.select.districtList = $scope.districtDics[returnObj.data.city];
            }
          });
        }

      };

      /**
       * 监听登录状态
       */
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            currentInfo();
          }
        });
      } else {
        currentInfo();
      }
    }
  ]);

  //================================================  发布管理   ======================================================
  controllers.initController('publishCtrl', ['$scope', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'resourceUIService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'userDomainService',
    function($scope, $routeParams, timeout, $q, $location, ngDialog, resourceUIService, userLoginUIService, energyConsumeUIService, growl, userDomainService) {
      $scope.tab = "tab1";
      $scope.ifView = false;
      $scope.ifEnterprise = userLoginUIService.user.userType == 1000 ? true : false;
      var deferList = [];

      //节能指标
      $scope.dialog = {
        title: "节能指标",
        input: {
          lastReducePeriodData: '',
          thisReduceIndicator: '',
          id: -1,
          enterpriseId: '',
          createTime: new Date()
        },
        event: {
          verifyFun: function(type, value) {
            var reg, r;
            if (type == 'number') {
              // var isNumber = /^(0|[0-9][0-9]?|100)$/; //只准输入1-100，保留两位小数的数字
              // var isNumber = /^[0-9]\d*(\.\d+)$/; //输入大于等于0的数字
              var isNumber = /^\d+(\.{0,1}\d+){0,1}$/; //输入非负数
              r = isNumber.test(value);
              if (value == 0) {
                r = true;
              }
              if (!r) {
                $scope.mistakeMesg = true;
              } else {
                $scope.mistakeMesg = false;
              }
            }
          }
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
            // if ($scope.dialog.input.thisReduceIndicator < 0) {
            //   growl.warning("请正确输入能耗数据", {});
            //   return;
            // }
            var addReduceEnergy_callback = function(returnObj) {
              if (returnObj.code == 0) {
                var newproduct = returnObj.data;
                $scope.reduceEnergyList.push(newproduct);
                broardFun($scope.reduceEnergyList, '_publish');
                growl.success("发布节能指标成功", {});
              }
            };
            if ($scope.dialog.input.id == -1) { //新增             
              energyConsumeUIService.publishReduceEnergy($scope.dialog.input, addReduceEnergy_callback);
            }
            ngDialog.close();
          }
        }, {
          label: "取消",
          fn: function() {
            ngDialog.close();
          }
        }]
      };

      //预测结果
      $scope.dialog2 = {
        title: "预测结果",
        param: {
          lastReducePeriodData: '',
          thisReduceIndicator: '',
          id: -1,
          enterpriseId: '',
          createTime: new Date()
        },
        button: [{
          label: "确定",
          disabled: function() {
            var every = scope.dialog.param.every(function(elem) {
              return elem.right != false;
            });
            return !every;
          },
          fn: function() {
            var ForecastResult_callback = function(returnObj) {
              if (returnObj.code == 0) {
                var newproduct = returnObj.data;
                $scope.ForecastResult.push(newproduct);
                broardFun($scope.ForecastResult, '_forecast');
                growl.success("发布预测结果成功", {});
                ngDialog.close();
              }
            };
            if ($scope.dialog2.param.id == -1) { //新增             
              energyConsumeUIService.publishForecastResult($scope.dialog2.param.enterpriseId, ForecastResult_callback);
            }
          }
        }, {
          label: "取消",
          fn: function() {
            ngDialog.close();
          }
        }]
      };

      //展示信息
      $scope.tableInit = {
        'select': {
          'enterpriseId': '',
          'reducePeriod': ''
        },
        'event': {
          'addClick': function() {
            $scope.statisticsType = "";
            $scope.dialog.input = {
              lastReducePeriodData: '',
              thisReduceIndicator: '',
              id: -1,
              enterpriseId: '',
              createTime: new Date()
            };
            ngDialog.open({
              template: '../partials/dialogue/publish_dia.html',
              className: 'ngdialog-theme-plain',
              scope: $scope
            });
          },
          'forecastClick': function() {
            $scope.ifView = false;
            $scope.statisticsType = "";
            $scope.dialog2.param = {
              lastReducePeriodData: '',
              thisReduceIndicator: '',
              id: -1,
              enterpriseId: '',
              createTime: new Date()
            };
            ngDialog.open({
              template: '../partials/dialogue/forecast_dia.html',
              className: 'ngdialog-theme-plain',
              scope: $scope
            });
          },
          'goClear': function() {
            $scope.tableInit.select.occupyPrcent = $scope.queryState.state == 1 ? $scope.tableInit.select.occupyPrcent : null;
            $scope.tableInit.select.energyConsumeNodeId = $scope.queryState.state == 1 ? $scope.tableInit.select.energyConsumeNodeId : null;
          }
        }
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

      var broardFun = function(objList, type) {
        timeout(function() {
          $scope.$broadcast(Event.ENTERPRISEINIT + type, {
            "option": [objList]
          });
        })
      };

      //table动作
      $scope.doAction = function(type, select, callback) {
        if (type == 'complete') {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认该节能周期已完成？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                energyConsumeUIService.saveReduceEnergy({
                  id: select,
                  lastCompleteStatus: 'yes'
                }, function(returnObj) {
                  if (returnObj.code == 0) {
                    callback(returnObj);
                  }
                })
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                dialogRef.close();

              }
            }]
          });
        } else if (type == 'view') {
          $scope.ifView = true;
          var state = select.energyTypeForecastData.some(function(item) {
            return item.hasOwnProperty('value');
          })
          if (!state) {
            select.energyTypeForecastData.forEach(function(item) {
              for (var key in item) {
                item.energyType = key;
                item.value = item[key];
              }
            })
          }

          $scope.dialog2.param.energyTypeForecastData = select.energyTypeForecastData;
          ngDialog.open({
            template: '../partials/dialogue/forecast_dia.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });
        }
      };

      //根据企业查询企业信息
      $scope.queryEnterpriseById = function(obj) {
        var id = obj.id.split(':')[1];
        energyConsumeUIService.findEnterpriseInfoById(id, function(returnObj) {
          if (returnObj.code == 0) {
            $scope.statisticsType = returnObj.data.statisticsType;
          }
        });
        energyConsumeUIService.findLastEnergyByEnterpriseId(id, function(returnObj) {
          if (returnObj.code == 0) {
            $scope.dialog.input.lastReducePeriodData = returnObj.data.value;
          }
        });
        if ($scope.tab == 'tab3') {
          energyConsumeUIService.findForecastResult(id, function(returnObj) {
            if (returnObj.code == 0) {
              returnObj.data.energyTypeForecastData.forEach(function(item) {
                for (var key in item) {
                  item.energyType = key;
                  item.value = item[key];
                }
              })
              $scope.dialog2.param.energyTypeForecastData = returnObj.data.energyTypeForecastData;
            }
          });
        }
      };

      //获取所有企业
      function queryAllEnterprises() {
        var defer = $q.defer();
        resourceUIService.getDomainsByFilter({
          modelId: 303,
          layer: 2
        }, function(returnObj) {
          if (returnObj.code == 0) {
            $scope.EnterprisesDic = {};
            returnObj.data.forEach(function(item) {
              item.text = item.label;
              $scope.EnterprisesDic[item.id] = item;
            })
            $scope.allEnterprises = returnObj.data;
            $scope.queryEnterpriseList = [{
              id: '',
              text: '请选择...'
            }].concat(returnObj.data);
            defer.resolve('success');
          }
        });
        deferList.push(defer.promise);
      };

      //获取所有
      $scope.searchDate = function() {
        var param = {
          "enterpriseId": parseInt($scope.tableInit.select.enterpriseId) ? parseInt($scope.tableInit.select.enterpriseId) : ""
        };
        if ($scope.tab == 'tab1') {
          energyConsumeUIService.findReduceEnergyListByCondition(param, function(returnObj) {
            if (returnObj.code == 0) {
              $scope.reduceEnergyList = returnObj.data;
              broardFun($scope.reduceEnergyList, '_publish');
            }
          });
        } else if ($scope.tab == 'tab3') {
          energyConsumeUIService.findForecastResultsByCondition(param, function(returnObj) {
            if (returnObj.code == 0) {
              // returnObj.data.forEach(function(item) {
              //   item.energyTypeForecastData.forEach(function(obj) {
              //     for (var key in obj) {
              //       obj.energyType = key;
              //       obj.value = obj[key];
              //     }
              //   })
              // })
              $scope.ForecastResult = returnObj.data;
              broardFun($scope.ForecastResult, '_forecast');
            }
          });
        }

      };

      var initEvent = function() {
        $('#deploy a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          if ($(e.target).closest("li.disabled").length > 0) {
            $(e.target).closest("li.disabled").removeClass("active");
            $(e.target).closest("ul").children("[name=" + $scope.tab + "]").addClass("active");
            return;
          }
          var aname = $(e.target).closest("li").attr("name");
          if (aname) {
            $scope.tab = aname;
            $scope.$apply();
          }
          if (aname == 'tab3' || aname == 'tab1') {
            $scope.searchDate();
          }
        });
      };

      var init = function() {
        queryAllEnterprises();
        initEvent();
        $q.all(deferList).then(function() {
          $scope.searchDate();
        });
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

  //================================================  能效对标  ======================================================
  controllers.initController('benchMarkingCtrl', ['$scope', '$routeParams', '$filter', '$timeout', '$q', '$location', 'ngDialog', 'dictionaryService', 'kpiDataService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'resourceUIService',
    function($scope, $routeParams, $filter, timeout, $q, $location, ngDialog, dictionaryService, kpiDataService, userLoginUIService, energyConsumeUIService, growl, resourceUIService) {
      var echart = require('echarts');
      var target = echart.init(document.getElementById('bardataview'));
      var deferList = [];
      var energyDic = {};
      $scope.industryDic = {};
      $scope.statisticsTypeDic = {
        'MONTH': '月',
        'QUARTER': '季度',
        'YEAR': '年'
      };
      $scope.$watch("myDicts", function(n, o) {
        if (n) {
          $scope.industryList = $scope.myDicts['industryShortType'];
          $scope.energyType = $scope.myDicts['energyType'];
          $scope.industryList.forEach(function(item) {
            item.id = item.valueCode;
            item.text = item.param;
            $scope.industryDic[item.valueCode] = item;
            $scope.industryDic[item.label] = item;
          });
          $scope.energyType.forEach(function(item) {
            energyDic[item.label] = item;
          });

        }
      });
      //初始化所有的数据
      function initAllData() {
        var lastYear = new Date().getFullYear();
        var lastMonth = new Date().getMonth();
        $scope.queryDitem = {};
        $scope.queryDitem.industryType = '';
        $scope.queryDitem.enterpriseId = '';
        $scope.queryDitem.year = lastYear;
        $scope.queryDitem.month = lastMonth;
        $scope.yearList = [];
        $scope.monthList = [];
        for (var i = 0; i < 8; i++) {
          $scope.yearList.push({
            id: lastYear - i,
            text: (lastYear - i) + '年'
          });
        }
        for (var i = 1; i < 13; i++) {
          $scope.monthList.unshift({
            id: i,
            text: i + '月'
          });
        }
        target.clear();
      };
      $scope.goClear = function() {
        initAllData();
      };

      //定义EChart option
      var getOption = function(echartData) {
        target.setOption({
          title: {
            text: '',
            subtext: '',
            x: 'center',
            y: 'top'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          legend: {
            data: echartData.legend
          },
          xAxis: [{
            type: 'category',
            boundaryGap: true,
            axisLabel: {
              interval: 0
            },
            data: echartData.xAxis,
            axisPointer: {
              type: 'shadow'
            }
          }],
          yAxis: [{
            type: 'value',
            name: '节点能耗（单位：吨标煤）',
            boundaryGap: true,
            axisLabel: {
              formatter: '{value}'
            }
          }, {
            type: 'value',
            name: '标杆值（单位：吨标煤）',
            boundaryGap: true,
            axisLabel: {
              formatter: '{value}'
            }
          }],
          series: echartData.series //{name:'',type:'',data:[]}
        });
      };

      //处理数据
      function fomatData(energyByEnterpriseIdAry, energyByIndustryCodeAry) {
        var xAxis = $scope.energyType.map(function(item) {
          return item.label;
        });
        var enterpriseAry = energyByEnterpriseIdAry.map(function(item) {
          return item.value;
        });
        var industryCodeAry = energyByIndustryCodeAry.map(function(item) {
          return item.value;
        });

        //设置柱状图的各项参数
        var echartData = {
          result: [energyByEnterpriseIdAry, energyByIndustryCodeAry],
          xAxis: xAxis,
          legend: ['节点能耗', '标杆值'],
          series: [{
            name: '节点能耗',
            type: 'bar',
            data: enterpriseAry ? enterpriseAry : []
          }, {
            name: '标杆值',
            type: 'bar',
            data: industryCodeAry ? industryCodeAry : []
          }]
        };
        getOption(echartData);
      };

      //获取企业对应的节点能耗
      var kpiDataByEnterpriseId = function(obj) {
        var defer = $q.defer();
        $scope.energyByEnterpriseIdAry = [];
        var param = [
          "kpi", {
            "isRealTimeData": false,
            "nodeIds": [obj.enterpriseId],
            "kpiCodes": [
              3331
            ],
            "startTime": new Date(obj.startTime),
            "endTime": new Date(obj.endTime),
            "timeRange": "",
            "aggregateType": ["VALENTWEIGHT"],
            "granularityUnit": "MONTH",
            "statisticType": "psiot",
            "includeInstance": true,
            "condList": [],
            "timePeriod": 0,
            "dataType": 1
          }
        ];
        kpiDataService.getValueList(param, function(returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              item.energyName = item.instance;
              item.energyCode = energyDic[item.instance].valueCode;
              $scope.energyByEnterpriseIdAry.push(item);
            });
            defer.resolve("success");
          }
        });
        deferList.push(defer.promise);
      };

      //获取企业对应行业的标杆值
      var industryDataByindustryCode = function(industryCode) {
        var defer = $q.defer();
        $scope.energyByIndustryCodeAry = [];
        var param = [
          "kpi", {
            "isRealTimeData": false,
            "nodeIds": [userLoginUIService.user.domainID],
            "kpiCodes": [
              3328
            ],
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
            returnObj.data.forEach(function(item) {
              var instanceAry = item.instance.split(',');
              item.instanceName = $scope.industryDic[instanceAry[0]].param;
              item.instanceCode = $scope.industryDic[instanceAry[0]].valueCode;
              item.energyName = instanceAry[1];
              item.energyCode = energyDic[instanceAry[1]].valueCode;
              if (industryCode == item.instanceCode) {
                $scope.energyByIndustryCodeAry.push(item);
              }
            });
            defer.resolve("success");
          }
        });
        deferList.push(defer.promise);
      };

      //根据企业查询企业信息
      var queryEnterpriseById = function(obj) {
        energyConsumeUIService.findEnterpriseInfoById(obj.enterpriseId, function(returnObj) {
          if (returnObj.code == 0) {
            $scope.enterpriseInfo = returnObj.data;
            industryDataByindustryCode(returnObj.data.industryType);
            kpiDataByEnterpriseId(obj);
            $q.all(deferList).then(function() {
              fomatData($scope.energyByEnterpriseIdAry, $scope.energyByIndustryCodeAry);
            });
          }
        });
      };

      //获取所有企业
      function queryAllEnterprises() {
        energyConsumeUIService.findEnterpriseInfos(function(returnObj) {
          if (returnObj.code == 0) {
            $scope.EnterprisesDic = {};
            returnObj.data.forEach(function(item) {
              item.text = item.name;
              $scope.EnterprisesDic[item.id] = item;
            })
            $scope.allEnterprises = returnObj.data;
            $scope.queryEnterpriseList = returnObj.data;
          }
        });
      }

      $scope.goSearch = function(obj) {
        obj.startTime = new Date(obj.year + '-' + obj.month);
        obj.endTime = new Date(obj.year + '-' + obj.month + '-' + '02');
        if (!$scope.queryDitem.enterpriseId) {
          growl.info("请选择企业名称", {});
          return;
        }
        queryEnterpriseById(obj);
      };

      var init = function() {
        initAllData();
        queryAllEnterprises();
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

  //================================================  标杆设置  ======================================================
  controllers.initController('benchMarkSetCtrl', ['$scope', '$routeParams', '$filter', '$timeout', '$q', '$location', 'ngDialog', 'dictionaryService', 'kpiDataService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'resourceUIService',
    function($scope, $routeParams, $filter, timeout, $q, $location, ngDialog, dictionaryService, kpiDataService, userLoginUIService, energyConsumeUIService, growl, resourceUIService) {
      var echart = require('echarts');
      var target = echart.init(document.getElementById('barsettingdataview'));
      var deferList = [];
      $scope.energyDic = {};
      $scope.industryDic = {};
      $scope.statisticsTypeDic = {
        'MONTH': '月',
        'QUARTER': '季度',
        'YEAR': '年'
      };
      $scope.$watch("myDicts", function(n, o) {
        if (n) {
          $scope.industryList = $scope.myDicts['industryShortType'];
          $scope.energyType = $scope.myDicts['energyType'];
          $scope.industryList.forEach(function(item) {
            item.id = item.label;
            item.text = item.param;
            $scope.industryDic[item.valueCode] = item;
            $scope.industryDic[item.label] = item;
          });
          $scope.energyType.forEach(function(item) {
            $scope.energyDic[item.label] = item;
          });
        }
      });
      //初始化所有的数据
      function initAllData() {
        $scope.queryDitem.industryType = '';
        $scope.filterLastDic = {};
        $scope.filterBestDic = {};
        target.clear();
      };
      $scope.goClear = function() {
        initAllData();
      };

      //定义EChart option
      var getOption = function(echartData) {
        target.setOption({
          title: {
            text: '',
            subtext: '',
            x: 'center',
            y: 'top'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          legend: {
            data: echartData.legend
          },
          xAxis: [{
            type: 'category',
            boundaryGap: true,
            axisLabel: {
              interval: 0
            },
            data: echartData.xAxis,
            axisPointer: {
              type: 'shadow'
            }
          }],
          yAxis: [{
            type: 'value',
            name: '上周期设置值（单位：吨标煤）',
            boundaryGap: true,
            axisLabel: {
              formatter: '{value}'
            }
          }, {
            type: 'value',
            name: '标杆值（单位：吨标煤）',
            boundaryGap: true,
            axisLabel: {
              formatter: '{value}'
            }
          }],
          series: echartData.series //{name:'',type:'',data:[]}
        });

      };

      /**
       * 格式化时间格式(YYYY-MM-Day HH:MM:SS)
       */
      var formatDate = function(datestr) {
        datestr = $filter('date')(datestr, 'yyyy-MM-dd');
        return datestr;
      };

      //处理数据
      function fomatData(filterBestAry, filterLastAry) {
        var xAxis = $scope.energyType.map(function(item) {
          return item.label;
        });
        var filterBestValue = [];
        var industryLastValue = [];
        xAxis = xAxis.sort();
        xAxis.forEach(function(item) {
          filterBestAry.forEach(function(obj) {
            if (item == obj.energyName) {
              filterBestValue.push(obj.value);
            }
          })
        });
        xAxis.forEach(function(item) {
          filterLastAry.forEach(function(obj) {
            if (item == obj.energyName) {
              industryLastValue.push(obj.value);
            }
          })
        });
        // var filterBestValue = filterBestAry.map(function(item) {
        //   return item.value;
        // });
        // var industryLastValue = filterLastAry.map(function(item) {
        //   return item.value;
        // });

        //设置柱状图的各项参数
        var echartData = {
          result: [industryLastValue, filterBestValue],
          xAxis: xAxis,
          legend: ['上周期设置值', '标杆值'],
          series: [{
            name: '上周期设置值',
            type: 'bar',
            data: industryLastValue
          }, {
            name: '标杆值',
            type: 'bar',
            data: filterBestValue
          }]
        };
        getOption(echartData);
      };

      //获取企业对应行业的标杆值(3327)
      var bestindustryCode = function() {
        var defer = $q.defer();
        $scope.bestIndustryCodeAry = [];
        var param = [
          "kpi", {
            "isRealTimeData": true,
            "nodeIds": [userLoginUIService.user.domainID],
            "kpiCodes": [
              3327
            ],
            "granularityUnit": "MONTH",
            "timeRange": "",
            "statisticType": "psiot",
            "includeInstance": true,
            "condList": [],
            "timePeriod": 1,
            "dataType": 1
          }
        ];
        kpiDataService.getValueList(param, function(returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              var instanceAry = item.instance.split(',');
              item.instanceName = $scope.industryDic[instanceAry[0]].label;
              item.insShortName = $scope.industryDic[instanceAry[0]].param;
              item.instanceCode = $scope.industryDic[instanceAry[0]].valueCode;
              item.energyName = instanceAry[1];
              item.energyCode = $scope.energyDic[instanceAry[1]].valueCode;
            });
            $scope.bestIndustryCodeAry = returnObj.data;
            defer.resolve('success');
          }
        });
        deferList.push(defer.promise);
      };

      //获取上期设置标杆值数据(3328)
      var lastindustryCode = function() {
        var defer = $q.defer();
        $scope.lastIndustryCodeAry = [];
        var param = [
          "kpi", {
            "isRealTimeData": false,
            "nodeIds": [userLoginUIService.user.domainID],
            "kpiCodes": [
              3328
            ],
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
            returnObj.data.forEach(function(item) {
              var instanceAry = item.instance.split(',');
              item.instanceName = $scope.industryDic[instanceAry[0]].label;
              item.insShorteName = $scope.industryDic[instanceAry[0]].param;
              item.instanceCode = $scope.industryDic[instanceAry[0]].valueCode;
              item.energyName = instanceAry[1];
              item.energyCode = $scope.energyDic[instanceAry[1]].valueCode;
            });
            $scope.lastIndustryCodeAry = returnObj.data;
            defer.resolve("success");
          }
        });
        deferList.push(defer.promise);
      };

      //根据行业过滤  
      var filterByIndustryType = function(obj) {
        //系统标杆值 3327
        $scope.filterBestAry = [];
        $scope.filterLastAry = [];
        $scope.filterBestDic = {};
        $scope.filterLastDic = {};

        $scope.bestIndustryCodeAry.forEach(function(item) {
          if (obj.industryType == item.instanceName) {
            $scope.filterBestAry.push(item);
            $scope.filterBestDic[item.energyName] = item;
          }
        });
        $scope.lastIndustryCodeAry.forEach(function(item) {
          if (obj.industryType == item.instanceName) {
            $scope.filterLastAry.push(item);
            $scope.filterLastDic[item.energyName] = item;
          }
        })
        $scope.energyType.forEach(function(item) {
          if (!$scope.filterLastDic[item.label]) {
            $scope.filterLastDic[item.label] = {
              value: 0
            };
          }
          if (!$scope.filterBestDic[item.label]) {
            $scope.filterBestDic[item.label] = {
              value: 0
            };
          }
        });
        $scope.lastTime = $scope.filterLastAry.length > 0 ? formatDate($scope.filterLastAry[0].insertTime) : '';
        fomatData($scope.filterBestAry, $scope.filterLastAry);
      };

      $scope.goSearch = function(obj) {
        filterByIndustryType(obj);
      };

      $scope.goSubmit = function() {
        var industryName = $scope.industryDic[$scope.queryDitem.industryType].label;
        var instanceObj = {};
        for (var key in $scope.filterBestDic) {
          instanceObj[industryName + ',' + key] = $scope.filterBestDic[key].value;
        }
        var paramAry = [];
        for (var key in instanceObj) {
          paramAry.push({
            nodeId: userLoginUIService.user.domainID,
            kpiCode: 3327,
            value: instanceObj[key],
            instance: key
          });
        };
        energyConsumeUIService.saveMarkValue(paramAry, function(returnObj) {
          if (returnObj.code == 0) {
            init(function() {
              $scope.goSearch($scope.queryDitem);
              growl.success("对标设置成功");
            });
          }
        });
      };

      var init = function(callback) {
        bestindustryCode();
        lastindustryCode();
        $q.all(deferList).then(function() {
          if (callback) {
            callback();
          }
        })
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

  //================================================  重点能耗单位  ======================================================
  controllers.initController('keyEnterpriseCtrl', ['$scope', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'dictionaryService', 'kpiDataService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'resourceUIService',
    function($scope, $routeParams, timeout, $q, $location, ngDialog, dictionaryService, kpiDataService, userLoginUIService, energyConsumeUIService, growl, resourceUIService) {
      $scope.ifView = false;
      var echart = require('echarts');
      var target = echart.init(document.getElementById('piedataview'));
      var target1 = echart.init(document.getElementById('bardataview'));
      var deferList = [];
      $scope.kpiCodeDic = {
        '3301': '综合能耗',
        '3304': 'GDP能耗',
        '3300': '单能源消耗'
      };
      $scope.unitCodeDic = {
        '3301': '单位：吨标煤',
        '3304': '单位：吨标煤/万元',
        '3300': '单位：吨标煤'
      };
      $scope.industryDic = {};
      $scope.statisticsTypeDic = {
        'MONTH': '月',
        'QUARTER': '季度',
        'YEAR': '年'
      };
      $scope.energyDic = {};
      var industryShortType = dictionaryService.dicts['industryShortType'];
      $scope.energyType = dictionaryService.dicts['energyType'];
      industryShortType.forEach(function(item) {
        $scope.industryDic[item.valueCode] = item;
        $scope.industryDic[item.label] = item;
      });
      $scope.energyType.forEach(function(item) {
        $scope.energyDic[item.label] = item;
      });

      //初始化所有的数据
      function initAllData() {
        $scope.queryDitem = {
          topN: '',
          statisticsType: '',
          kpiCode: '',
          energyType: ''
        };
        $scope.enterpriseInfoAry = [];
        target.clear();
      };
      $scope.goClear = function() {
        initAllData();
      };

      //定义EChart option
      var getOption = function(echartData) {
        if (echartData.legend.length == 0) {
          target.clear();
          target1.clear();
          return;
        }
        target.setOption({
          title: {
            text: '',
            subtext: '',
            x: 'center',
            y: 'top'
          },
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} (占比：{d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: echartData.legend
          },
          series: [{
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '40%'],
            data: echartData.series.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        });
        target1.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          legend: {
            data: echartData.legend
          },
          xAxis: [{
            type: 'category',
            data: [$scope.kpiCodeDic[echartData.param.kpiCode]],
            axisPointer: {
              type: 'shadow'
            }
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              margin: 30,
              formatter: '{value}'
            },
            name: $scope.unitCodeDic[echartData.param.kpiCode]
          }],
          series: echartData.series1
        })

      };

      //处理数据
      function fomatData(enterpriseInfoAry, topNdata, param) {
        enterpriseInfoAry.forEach(function(item) {
          topNdata.forEach(function(topN) {
            if (topN.nodeId == item.id) {
              topN.name = item.name;
            }
          })
        });
        var legend = enterpriseInfoAry.map(function(item) {
          return item.name;
        });
        var series = {};
        series.name = topNdata.map(function(item) {
          return item.instance;
        });
        series.data = topNdata.map(function(item) {
          return {
            value: item.value,
            name: item.name
          }
        });
        var series1 = [];
        series.data.forEach(function(item) {
          series1.push({
            data: [item.value],
            name: item.name,
            type: 'bar'
          })
        });

        //设置柱状图的各项参数
        var echartData = {
          param: param,
          result: [enterpriseInfoAry, topNdata],
          legend: legend,
          series: series,
          series1: series1
        };
        getOption(echartData);
      };


      //获取topN企业
      function queryEnterpriseByTopN(param) {
        $scope.enterpriseInfoAry = [];
        //根据企业查询企业信息
        var queryEnterpriseById = function(enterpriseId) {
          var subdefer = $q.defer();
          energyConsumeUIService.findEnterpriseInfoById(enterpriseId, function(returnObj) {
            if (returnObj.code == 0) {
              $scope.enterpriseInfoAry.push(returnObj.data);
              subdefer.resolve('success');
            }
          });
          return subdefer.promise;
        };
        if (param.kpiCode != '3300') {
          param.energyType = '';
        }
        var paramAry = [param.topN, param.statisticsType, param.kpiCode, param.energyType, param.range];
        energyConsumeUIService.getTopN(paramAry, function(returnObj) {
          var defers = [];
          var topNdata = [];
          if (returnObj.code == 0) {
            topNdata = returnObj.data;
            returnObj.data.forEach(function(item) {
              defers.push(queryEnterpriseById(item.nodeId));
            })
          }
          $q.all(defers).then(function() {
            fomatData($scope.enterpriseInfoAry, topNdata, param);
          })
        })
      }

      $scope.goSearch = function(obj) {
        if (!obj) {
          return;
        }
        if (!obj.topN) {
          growl.info("请选择topN", {});
          return;
        }
        if (!obj.statisticsType) {
          growl.info("请选择统计周期", {});
          return;
        }
        if (!obj.kpiCode) {
          growl.info("请选择指标", {});
          return;
        }
        if (!obj.range) {
          growl.info("请选择时间段", {});
          return;
        }
        if (obj.kpiCode == '3300' && !obj.energyType) {
          growl.info("请选择能源类型", {});
          return;
        }
        queryEnterpriseByTopN(obj);
      };

      var init = function() {};

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

  //================================================  节能潜力点分析 ======================================================
  controllers.initController('potentialCtrl', ['$scope', '$filter', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'dictionaryService', 'kpiDataService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'resourceUIService',
    function($scope, $filter, $routeParams, timeout, $q, $location, ngDialog, dictionaryService, kpiDataService, userLoginUIService, energyConsumeUIService, growl, resourceUIService) {
      var echart = require('echarts');
      var target = echart.init(document.getElementById('potentialdataview'));
      var target1 = echart.init(document.getElementById('potentialDeviceview'));
      var deferList = [];
      var energyDic = {};
      var markValueDic = {
        'max': '最大值',
        'min': '最小值',
        'avg': '平均值'
      };
      $scope.tab = "tab1";
      $scope.showTable1 = false;
      $scope.showTable2 = false;
      $scope.industryDic = {};
      $scope.filterEnterprises = [];
      $scope.queryDitem = {};
      $scope.statisticsTypeDic = {
        'MONTH': '月',
        'QUARTER': '季度',
        'YEAR': '年'
      };
      var initEvent = function() {
        $('#deploy a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          if ($(e.target).closest("li.disabled").length > 0) {
            $(e.target).closest("li.disabled").removeClass("active");
            $(e.target).closest("ul").children("[name=" + $scope.tab + "]").addClass("active");
            return;
          }
          var aname = $(e.target).closest("li").attr("name");
          if (aname) {
            $scope.tab = aname;
            $scope.$apply();
          }
        });
      };
      $scope.$watch("myDicts", function(n, o) {
        if (n) {
          $scope.industryList = $scope.myDicts['industryShortType'];
          $scope.energyType = $scope.myDicts['energyType'];
          $scope.industryList.forEach(function(item) {
            item.id = item.valueCode;
            item.text = item.param;
            $scope.industryDic[item.valueCode] = item;
            $scope.industryDic[item.label] = item;
          });
          $scope.energyType.forEach(function(item) {
            item.text = item.label;
            energyDic[item.label] = item;
          });

        }
      });

      /**
       * 格式化时间格式(YYYY-MM-Day HH:MM:SS)
       */
      var formatDate = function(datestr) {
        datestr = $filter('date')(datestr, 'yyyy-MM');
        return datestr;
      };

      var broardFun = function(columns, columnDefs, totalList, type) {
        timeout(function() {
          $scope.$broadcast(Event.ENTERPRISEINIT + type, {
            "option": [columns, columnDefs, totalList]
          });
        })
      };

      var widgetMaxFun = function(id) {
        if (jQuery(id).find(".fa.fa-plus").length > 0) {
          jQuery.AdminLTE.boxWidget.collapse(jQuery(id));
        }
      };
      var widgetMinFun = function(id) {
        if (jQuery(id).find(".fa.fa-plus").length == 0) {
          jQuery.AdminLTE.boxWidget.collapse(jQuery(id));
        }
      };

      //初始化所有的数据
      function initAllData() {
        if ($scope.tab == 'tab1') {
          $scope.queryDitem.enterpriseIds = [];
          $scope.queryDitem.industryType = '';
          $scope.queryDitem.markValue = '';
          $scope.queryDitem.modelId = '';
          $scope.queryDitem.startTime = '';
          $scope.queryDitem.endTime = '';
          target.clear();
          $scope.showTable1 = false;
        } else if ($scope.tab == 'tab3') {
          $scope.queryDitem1.industryType = '';
          $scope.queryDitem1.markValue = '';
          $scope.queryDitem1.enterpriseId = '';
          $scope.queryDitem1.modelId = '';
          $scope.queryDitem1.startTime = '';
          $scope.queryDitem1.endTime = '';
          target1.clear();
          $scope.showTable2 = false;
        }
      };
      $scope.goClear = function() {
        initAllData();
      };

      //定义EChart option
      var getOption = function(echartData) {
        var tabOption = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: echartData.legend
          },
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: true,
            data: echartData.xAxis
          }],
          yAxis: [{
            type: 'value'
          }],
          series: echartData.series
        };
        if ($scope.tab == 'tab1') {
          target.setOption(tabOption);
        } else if ($scope.tab == 'tab3') {
          target1.setOption(tabOption);
        }
      };

      //处理数据
      function fomatData(energyByEnterpriseIdAry, markValueList, obj) { //返回数据，节点与相应企业信息
        var legend = [];
        var dataDic = {};
        var filterDataDic = {};
        var xAisDic = {};
        var xAxis = [];
        var series = [];
        energyByEnterpriseIdAry.forEach(function(item) {
          for (var key in obj.nodeIdDic) {
            if (!filterDataDic[obj.nodeIdDic[key].name]) {
              filterDataDic[obj.nodeIdDic[key].name] = [];
            }
            if (item.nodeId == key) {
              filterDataDic[obj.nodeIdDic[key].name].push(item.value); //key是企业名字
            }
          }
        });
        obj.enterpriseIds.forEach(function(item) {
          legend.push($scope.enterprisesDic[item].name);
        });
        legend = obj.nodeIds.map(function(item) {
          return obj.nodeIdToEnfoDic[item].name + '-' + obj.nodeIdDic[item].label;
        });
        legend.push(markValueDic[obj.markValue]);
        energyByEnterpriseIdAry.forEach(function(item) {
          if (!xAisDic[item.arisingTime]) {
            xAisDic[item.arisingTime] = item.arisingTime;
            xAxis.push(formatDate(item.arisingTime));
          }
        });
        obj.nodeIds.forEach(function(nodeId) {
          series.push({
            name: obj.nodeIdToEnfoDic[nodeId].name + '-' + obj.nodeIdDic[nodeId].label,
            type: 'bar',
            data: xAxis.map(function(elem) {
              var find = energyByEnterpriseIdAry.find(function(el) {
                var time = formatDate(el.arisingTime);
                return time == elem && el.nodeId == nodeId;
              })
              if (find) {
                return find;
              } else {
                return {};
              }

            })
          });
        });
        series.push({
          name: markValueDic[obj.markValue],
          type: 'line',
          data: xAxis.map(function(elem) {
            var find = markValueList.find(function(el) {
              var time = formatDate(el.arisingTime);
              return time == elem;
            })
            if (find) {
              return find;
            } else {
              return {};
            }

          })
        })

        //设置折线图的各项参数
        var echartData = {
          xAxis: xAxis,
          legend: legend,
          series: series
        };
        getOption(echartData);
      };

      //获取表格信息
      function fomatDataTable(enterpriseGDPList, energyByEnterpriseIdAry, markValueList, obj) {
        var xAisDic = {};
        var xAxis = [];
        var totalList = [];
        energyByEnterpriseIdAry.forEach(function(item) {
          if (!xAisDic[item.arisingTime]) {
            xAisDic[item.arisingTime] = item.arisingTime;
            xAxis.push(item.arisingTime);
          }
        });
        xAxis.forEach(function(x) {
          obj.nodeIds.forEach(function(nodeId) {
            totalList.push({
              arisingTime: formatDate(x),
              nodeName: obj.nodeIdToEnfoDic[nodeId].name + '-' + obj.nodeIdDic[nodeId].label,
              nodeValue: (function() {
                var find = energyByEnterpriseIdAry.find(function(el) {
                  return x == el.arisingTime && el.nodeId == nodeId;
                })
                if (find) {
                  return find.value;
                } else {
                  return '-';
                }
              })(),
              markValue: (function() {
                var find = markValueList.find(function(el) {
                  return x == el.arisingTime;
                })
                if (find) {
                  return find.value;
                } else {
                  return '-';
                }
              })(),
              diffValue: (function() {
                var nodeValue = energyByEnterpriseIdAry.find(function(el) {
                  return x == el.arisingTime && el.nodeId == nodeId;
                });
                var markValue = markValueList.find(function(el) {
                  return x == el.arisingTime;
                });
                if (nodeValue && markValue) {
                  return (nodeValue.value - markValue.value).toFixed(2);
                } else {
                  return '-';
                }
              })(),
              diffToGDP: (function() {
                var nodeValue = energyByEnterpriseIdAry.find(function(el) {
                  return x == el.arisingTime && el.nodeId == nodeId;
                });
                var markValue = markValueList.find(function(el) {
                  return x == el.arisingTime;
                });
                var enterpriseGDPValue = enterpriseGDPList.find(function(el) {
                  return x == el.arisingTime && el.nodeId == obj.nodeIdToEnfoDic[nodeId].id;
                });
                if (nodeValue && markValue && enterpriseGDPValue) {
                  var diff = (nodeValue.value - markValue.value).toFixed(2);
                  return (diff * enterpriseGDPValue.value).toFixed(2);
                } else {
                  return '-';
                }
              })()
            })
          });
        });
        var columns = [{
          data: "arisingTime",
          title: "时间",
        }, {
          data: "nodeName",
          title: "节点名称"
        }, {
          data: "nodeValue",
          title: "节点GDP能耗"
        }, {
          data: "markValue",
          title: markValueDic[obj.markValue]
        }, {
          data: "diffValue",
          title: "差值"
        }, {
          data: "diffToGDP",
          title: "差值能耗值"
        }];
        var columnDefs = [];
        columns.forEach(function(item, index) {
          columnDefs.push({
            target: index,
            data: item.data,
            render: function(data, type, full) {
              return escape(data);
            }
          })
        });
        if ($scope.tab == "tab1") {
          broardFun(columns, columnDefs, totalList, '_potential_data');
        } else if ($scope.tab == "tab3") {
          broardFun(columns, columnDefs, totalList, '_potential_device');
        }
      };

      //获取节点对应的GDP能耗
      var kpiDataByEnterpriseId = function(obj, type, callback) {
        var filterENterpriseAry = [];
        // var kpiCode = $scope.tab == 'tab3' ? [3325] : [3301];
        var kpiCode = [];
        if (type == 'enterpriseGDP') {
          kpiCode = [3302];
        } else {
          kpiCode = [3304];
        }
        var param = [
          "kpi", {
            "category": "time",
            "isRealTimeData": false,
            // "nodeIds": obj.nodeIds,
            "kpiCodes": kpiCode,
            "startTime": new Date(obj.startTime),
            "endTime": new Date(obj.endTime),
            "timeRange": "",
            "statisticType": "psiot",
            "includeInstance": true,
            "condList": [],
            "timePeriod": 0,
            "dataType": 1
          }
        ];
        if (type == 'enterpriseGDP') {
          param[1].nodeIds = obj.enterpriseIds;
        } else {
          param[1].nodeIds = obj.nodeIds;
        }
        kpiDataService.getValueList(param, function(returnObj) {
          if (returnObj.code == 0) {
            if (type == 'enterpriseGDP') {
              $scope.enterpriseGDPList = returnObj.data;
              fomatDataTable($scope.enterpriseGDPList, $scope.energyByEnterpriseIdAry, $scope.markValueList, obj);
            } else {
              $scope.energyByEnterpriseIdAry = [];
              returnObj.data.forEach(function(item) {
                $scope.energyByEnterpriseIdAry.push(item);
              });
              fomatData($scope.energyByEnterpriseIdAry, $scope.markValueList, obj);
            }
            if (callback) {
              callback();
            }
          }
        });
      };

      //获取企业对应的GDP能耗
      var queryDataByEnterpriseId = function(obj) {
        var param = {};
        $.extend(param, obj);
        if ($scope.tab == 'tab1') {
          param.enterpriseIds = obj.enterpriseIds;
        } else if ($scope.tab == 'tab3') {
          param.enterpriseIds = [obj.enterpriseId];
        }
        kpiDataByEnterpriseId(param, 'enterpriseGDP');
      };

      //获取所有企业
      function queryAllEnterprises() {
        energyConsumeUIService.findEnterpriseInfos(function(returnObj) {
          if (returnObj.code == 0) {
            $scope.enterprisesDic = {};
            returnObj.data.forEach(function(item) {
              item.text = item.name;
              $scope.enterprisesDic[item.id] = item;
            })
            $scope.allEnterprises = returnObj.data;
          }
        });
      };

      //获取所有设备模板
      function queryAllModels() {
        resourceUIService.getModelsByCondition({}, function(returnObj) {
          if (returnObj.code == 0) {
            $scope.allModelsDic = {};
            returnObj.data.forEach(function(item) {
              $scope.allModelsDic[item.id] = item;
            })
            $scope.allModels = returnObj.data;
          }
        });
      };

      //获取节点上的设备类型
      function queryAllDevices() {
        energyConsumeUIService.getDeviceTypeNames('devicetype', function(returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              item.text = item.label;
            })
            $scope.allDeviceList = returnObj.data;
          }
        })
      };

      //获取取值类型及行业对应值
      function queryMarkValue(obj, callback) {
        var param = ["MONTH", obj.industryType, obj.modelId, obj.markValue, [3304], obj.startTime, obj.endTime];
        energyConsumeUIService.getIndustryMarkValue(param, function(returnObj) {
          if (returnObj.code == 0) {
            if (callback) {
              callback();
            }
            $scope.markValueList = returnObj.data;
          }
        });
      };

      $scope.goSearch = function(obj) {
        if (!obj || !obj.industryType) {
          growl.info("请选择行业", {});
          return;
        }
        if (!obj || ($scope.tab == 'tab3' && !obj.enterpriseId) || ($scope.tab == 'tab1' && obj.enterpriseIds.length == 0)) {
          growl.info("请选择企业", {});
          return;
        }
        if (!obj || !obj.modelId) {
          growl.info("请选择设备", {});
          return;
        }
        if (!obj || !obj.modelId) {
          growl.info("请选择设备", {});
          return;
        }
        if (!obj || !obj.startTime) {
          var year = new Date().getFullYear();
          var startMonth = new Date().getMonth();
          var endMonth = new Date().getMonth() + 1;
          obj.startTime = new Date(year + '-' + startMonth);
          obj.endTime = new Date(year + '-' + endMonth);
        }
        if (!obj || !obj.markValue) {
          growl.info("请选择取值类型", {});
          return;
        }
        //通过企业查设备模型
        var nodeIdAry = [];
        var nodeIdDic = {};
        var modelNodeDic = {};
        var nodeIdToEnfoDic = {};
        var index = 0;
        var ary = [];
        var defers = [];
        obj.enterToNodesDic = {};
        var queryDomainsByEnterpriseId = function(enterpriseId) {
          var subdefer = $q.defer();
          energyConsumeUIService.queryDomainsByEnterpriseId(enterpriseId, function(returnObj) {
            if (returnObj.code == 0) {
              if ($scope.tab == 'tab1') {
                index++;
                ary = returnObj.data.filter(function(item) {
                  return item.modelDefinitionId == obj.modelId;
                });
                ary.forEach(function(item) {
                  nodeIdAry.push(item.id);
                  nodeIdDic[item.id] = item ///节点存放节点信息 
                  nodeIdToEnfoDic[item.id] = $scope.enterprisesDic[enterpriseId]; //节点id对应企业信息
                });
                if (!obj.enterToNodesDic[enterpriseId]) {
                  obj.enterToNodesDic[enterpriseId] = ary;
                }
                if (index == obj.enterpriseIds.length) {
                  obj.nodeIds = nodeIdAry;
                  obj.nodeIdDic = nodeIdDic;
                  obj.nodeIdToEnfoDic = nodeIdToEnfoDic;
                }
              } else if ($scope.tab == 'tab3') {
                // if (!obj.modelIds) {
                //   ary = returnObj.data.filter(function(item) {
                //     return item.modelDefinitionId != undefined;
                //   });
                // }
                // else {
                //   obj.modelIds.forEach(function(model) {
                //     returnObj.data.forEach(function(item) {
                //       if (item.modelDefinitionId == model) {
                //         ary.push(item);
                //       }
                //     })
                //   })
                // }
                returnObj.data.forEach(function(item) {
                  if (item.modelDefinitionId == obj.modelId) {
                    ary.push(item);
                  }
                })
                ary.forEach(function(item) {
                  nodeIdAry.push(item.id);
                  nodeIdDic[item.id] = item; ///节点存放企业信息
                  nodeIdToEnfoDic[item.id] = $scope.enterprisesDic[enterpriseId]; //节点id对应企业信息
                });
                obj.nodeIds = nodeIdAry;
                obj.nodeIdDic = nodeIdDic; //节点id对应节点信息
                obj.nodeIdToEnfoDic = nodeIdToEnfoDic;
              }
              subdefer.resolve("success");
            }
          })
          return subdefer.promise;
        };
        if ($scope.tab == 'tab1') {
          target.clear();
          $scope.showTable1 = true;
          widgetMaxFun('#viewcollapse1');
          widgetMaxFun('#viewcollapse2');
          obj.enterpriseIds.forEach(function(item) {
            defers.push(queryDomainsByEnterpriseId(item));
          });
        } else if ($scope.tab == 'tab3') {
          target1.clear();
          $scope.showTable2 = true;
          widgetMaxFun('#devicecollapse1');
          widgetMaxFun('#devicecollapse2');
          obj.enterpriseIds = [obj.enterpriseId];
          defers.push(queryDomainsByEnterpriseId(obj.enterpriseId));

        }
        $q.all(defers).then(function() {
          queryMarkValue(obj, function() {
            kpiDataByEnterpriseId(obj, '', function() {
              queryDataByEnterpriseId(obj);
            }); //两个函数的执行顺序不能反
          });
        });
      };
      $scope.filterModel = function(obj) {
        var param = obj;
        if ($scope.tab == 'tab3') {
          param = [obj];
        }
        if (obj.length == 0) {
          return;
        }
        energyConsumeUIService.getModelDefinitionsByEnterpriseIds(param, function(returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              item.text = item.label;
            })
            $scope.flterDeviceList = returnObj.data;
          }
        })
      };
      var init = function() {
        queryAllEnterprises();
        queryAllModels();
        queryAllDevices();
        initEvent();
        jQuery.AdminLTE.boxWidget.collapse(jQuery("#viewcollapse1"));
        jQuery.AdminLTE.boxWidget.collapse(jQuery("#viewcollapse2"));
        jQuery.AdminLTE.boxWidget.collapse(jQuery("#devicecollapse1"));
        jQuery.AdminLTE.boxWidget.collapse(jQuery("#devicecollapse2"));
        // widgetMinFun('#viewcollapse1');
        // widgetMinFun('#viewcollapse2');
        // widgetMinFun('#devicecollapse1');
        // widgetMinFun('#devicecollapse2');
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

  //================================================  能耗预测  ======================================================
  controllers.initController('forecastCtrl', ['$scope', '$filter', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'dictionaryService', 'kpiDataService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'resourceUIService',
    function($scope, $filter, $routeParams, timeout, $q, $location, ngDialog, dictionaryService, kpiDataService, userLoginUIService, energyConsumeUIService, growl, resourceUIService) {
      var echart = require('echarts');
      var target1 = echart.init(document.getElementById('areaview'));
      var target2 = echart.init(document.getElementById('industryview'));
      var target31 = echart.init(document.getElementById('energyview1'));
      var target32 = echart.init(document.getElementById('energyview2'));
      var target33 = echart.init(document.getElementById('energyview3'));
      var target4 = echart.init(document.getElementById('deviceView'));
      var target5 = echart.init(document.getElementById('enterpriseView'));
      $scope.area = $scope.$parent.districtDics['安徽省,合肥市'];
      $scope.tab = 'tab1';
      $scope.energyDic = {};
      $scope.showEnergyTitle = false;
      $scope.industryShortType = dictionaryService.dicts['industryShortType'];
      $scope.energyType = dictionaryService.dicts['energyType'];
      $scope.industryShortType.forEach(function(item) {
        item.id = item.param;
        item.text = item.param;
      });
      $scope.energyType.forEach(function(item) {
        item.text = item.label;
        item.id = item.label;
        $scope.energyDic[item.label] = item;
      });
      $scope.statisticsTypeList = [{
        id: "MONTH",
        text: '月'
      }, {
        id: "QUARTER",
        text: '季度'
      }, {
        id: "YEAR",
        text: '年'
      }];
      var kpiCodeList = [{
        id: 3319,
        type: 'area',
        label: "区域工业附加值能耗"
      }, {
        id: 3318,
        type: 'area',
        label: "区域GDP能耗"
      }, {
        id: 3315,
        type: 'area',
        label: "区域综合能耗"
      }, {
        id: 3330,
        type: 'industry',
        label: "行业工业附加值能耗"
      }, {
        id: 3329,
        type: 'industry',
        label: "行业GDP能耗"
      }, {
        id: 3312,
        type: 'industry',
        label: "行业综合能耗"
      }, {
        id: 3332,
        type: 'energy',
        label: "能源类型的工业附加值能耗"
      }, {
        id: 3331,
        type: 'energy',
        label: "能源类型的GDP能耗"
      }, {
        id: 3300,
        type: 'energy',
        label: "能源类型的综合能耗"
      }, {
        id: 3305,
        type: 'device',
        label: "工业附加值能耗"
      }, {
        id: 3304,
        type: 'device',
        label: "GDP能耗"
      }, {
        id: 3301,
        type: 'device',
        label: "综合能耗"
      }];

      //初始化所有的数据
      function initAllData() {
        $scope.queryDitem.area = '';
        $scope.queryDitem.industry = '';
        $scope.queryDitem.energy = '';
        $scope.queryDitem.enterpriseId = '';
        $scope.queryDitem.enterpriseId2 = '';
        $scope.queryDitem.enterpriseId5 = '';
        $scope.queryDitem.statisticsType1 = '';
        $scope.queryDitem.statisticsType2 = '';
        $scope.queryDitem.statisticsType3 = '';
        $scope.queryDitem.statisticsType4 = '';
        $scope.queryDitem.statisticsType5 = '';
        $scope.queryDitem.modelId = '';
        $scope.queryDitem.nodeId = '';
        $scope.showEnergyTitle = false;
        target1.clear();
        target2.clear();
        target31.clear();
        target32.clear();
        target33.clear();
        target4.clear();
        target5.clear();
      };
      $scope.goClear = function() {
        initAllData();
      };

      var initEvent = function() {
        $('#deploy a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          if ($(e.target).closest("li.disabled").length > 0) {
            $(e.target).closest("li.disabled").removeClass("active");
            $(e.target).closest("ul").children("[name=" + $scope.tab + "]").addClass("active");
            return;
          }
          var aname = $(e.target).closest("li").attr("name");
          if (aname) {
            $scope.tab = aname;
            $scope.$apply();
          }
        });
      };

      //定义EChart option
      var getOption = function(echartData) {
        var yAxis = [];
        if ($scope.tab == "tab3") {
          yAxis = [{
            name: '单位（吨标煤/万元）',
            boundaryGap: true,
            type: 'value',
          }, {
            name: '单位（吨标煤）',
            boundaryGap: true,
            type: 'value',
          }];
        } else {
          yAxis = [{
            name: '单位（吨标煤/万元）',
            boundaryGap: true,
            type: 'value',
            max: echartData.yAxis[0]
          }, {
            name: '单位（吨标煤）',
            boundaryGap: true,
            type: 'value',
            max: echartData.yAxis[1]
          }];
        }
        var option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: echartData.legend,
            selected: (function() {
              var dataDic = {};
              echartData.legend.forEach(function(item) {
                dataDic[item] = ($scope.tab == "tab3") ? false : true;
              })
              dataDic['电力'] = true;
              dataDic['电力（真实值）'] = true;
              dataDic['水'] = true;
              dataDic['水（真实值）'] = true;
              return dataDic;
            })()
          },
          toolbox: {
            feature: {
              dataView: {
                readOnly: false
              },
              magicType: {
                type: ['line', 'bar']
              },
              restore: {},
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: true,
            data: echartData.xAxis
          }],
          yAxis: yAxis,
          series: echartData.series
        };
        if ($scope.tab == "tab1") {
          target1.setOption(option);
        } else if ($scope.tab == "tab2") {
          target2.setOption(option);
        } else if ($scope.tab == "tab3") {
          if (echartData.kpiCode == 3332) {
            target31.setOption(option);
          } else if (echartData.kpiCode == 3331) {
            target32.setOption(option);
          } else if (echartData.kpiCode == 3300) {
            target33.setOption(option);
          }
        } else if ($scope.tab == "tab4") {
          target4.setOption(option);
        } else if ($scope.tab == "tab5") {
          target5.setOption(option);
        }
      };

      /**
       * 格式化时间格式(YYYY-MM-Day HH:MM:SS)
       */
      var formatDate = function(datestr) {
        datestr = $filter('date')(datestr, 'yyyy-MM');
        return datestr;
      };

      //根据参数查kpi数据
      var queryKpiCOdeByParam = function(param, callback) {
        kpiDataService.getValueList(param, function(returnObj) {
          if (returnObj.code == 0) {
            callback(returnObj.data);
          }
        });
      };

      //处理数据
      var formatDataFunc = function(data, trueData) {
        var xAxis = [];
        var yAxisMinAry = [];
        var yAxisMaxAry = [];
        var yAxis = [];
        data.forEach(function(item) {
          if (item.kpiCode == 3315 || item.kpiCode == 3312 || item.kpiCode == 3300 || item.kpiCode == 3301) {
            yAxisMaxAry.push(item.value);
          } else {
            yAxisMinAry.push(item.value);
          }
          if (xAxis.indexOf(formatDate(item.arisingTime)) == -1) {
            xAxis.push(formatDate(item.arisingTime));
          }
        });
        if (trueData) {
          trueData.forEach(function(item) {
            if (item.kpiCode == 3315 || item.kpiCode == 3312 || item.kpiCode == 3300 || item.kpiCode == 3301) {
              yAxisMaxAry.push(item.value);
            } else {
              yAxisMinAry.push(item.value);
            }
          });
        }

        yAxisMinAry = yAxisMinAry.sort(function(a, b) {
          return a - b;
        });
        yAxisMaxAry = yAxisMaxAry.sort(function(a, b) {
          return a - b;
        });
        yAxis = [yAxisMinAry[yAxisMinAry.length - 1], yAxisMaxAry[yAxisMaxAry.length - 1]];
        var legendAry = [];
        if ($scope.tab == 'tab1') {
          legendAry = kpiCodeList.filter(function(item) {
            return item.type == 'area';
          });
        } else if ($scope.tab == 'tab2') {
          legendAry = kpiCodeList.filter(function(item) {
            return item.type == 'industry';
          });
        } else if ($scope.tab == 'tab3') {
          legendAry = kpiCodeList.filter(function(item) {
            return item.type == 'energy';
          });
        } else if ($scope.tab == 'tab4' || $scope.tab == 'tab5') {
          legendAry = kpiCodeList.filter(function(item) {
            return item.type == 'device';
          });
        }
        var legend = [];
        legendAry.forEach(function(item) {
          legend.push(item.label, item.label + '（真实值）');
        });

        var series = [];
        legendAry.map(function(len) {
          var itemValue = xAxis.map(function(xA) {
            var find = data.find(function(el) {
              var time = formatDate(el.arisingTime);
              return xA == time && el.kpiCode == len.id;
            });
            if (find) {
              return find;
            } else {
              return [];
            };
          });
          var trueItemValue = xAxis.map(function(xA) {
            if (trueData) {
              var find = trueData.find(function(el) {
                var time = formatDate(el.arisingTime);
                return xA == time && el.kpiCode == len.id;
              });
            }
            if (find) {
              return find;
            } else {
              return [];
            };
          });
          var obj = {
            name: len.label,
            type: 'bar',
            // stack: '总量',
            // areaStyle: {
            //   normal: {}
            // },
            yAxisIndex: (len.id == 3315 || len.id == 3312 || len.id == 3300 || len.id == 3301) ? 1 : 0,
            data: itemValue.map(function(item) {
              return item.value;
            })
          };
          var trueObj = {
            name: len.label + '（真实值）',
            type: 'line',
            // xAxisIndex: (len.id == 3315 || len.id == 3312 || len.id == 3300 || len.id == 3301) ? 1 : 0,
            yAxisIndex: (len.id == 3315 || len.id == 3312 || len.id == 3300 || len.id == 3301) ? 1 : 0,
            data: trueItemValue.map(function(item) {
              return item && item.value ? item.value : '-';
            })
          };
          series.push(obj, trueObj);

        });
        //设置折线图的各项参数
        var echartData = {
          xAxis: xAxis,
          yAxis: yAxis,
          legend: legend,
          series: series
        };
        getOption(echartData);
      };

      //特殊处理能源数据
      var formatEnergyFunc = function(data, trueData) {
        var legend = [];
        $scope.energyType.forEach(function(item) {
          legend.push(item.text, item.text + '（真实值）');
        });
        var totalDic = {};
        var trueTotalDic = {};
        var totalAry = [];
        var picAry = kpiCodeList.filter(function(item) {
          return item.type == 'energy';
        });
        picAry.forEach(function(item) {
          totalDic[item.id] = [];
          trueTotalDic[item.id] = [];
          data.forEach(function(ele) {
            if (item.id == ele.kpiCode) {
              totalDic[item.id].push(ele);
            }
          });
          trueData.forEach(function(ele) {
            if (item.id == ele.kpiCode) {
              trueTotalDic[item.id].push(ele);
            }
          });
        })
        var loop = function(itemObj) {
          itemObj.data.forEach(function(item) {
            if (itemObj.xAxis.indexOf(formatDate(item.arisingTime)) == -1) {
              itemObj.xAxis.push(formatDate(item.arisingTime));
            }
          });
          $scope.energyType.map(function(len) {
            function fotmat(xAixs, data) {
              var itemValue = xAixs.map(function(xA) {
                var find = data.find(function(el) {
                  var time = formatDate(el.arisingTime);
                  return xA == time && el.instance == len.text;
                });
                if (find) {
                  return find;
                } else {
                  return [];
                };
              });
              return itemValue;
            };
            var itemValue = fotmat(itemObj.xAxis, itemObj.data);
            var trueItemValue = fotmat(itemObj.xAxis, itemObj.trueData);
            var obj = {
              name: len.label,
              type: 'bar',
              // stack: '总量',
              // areaStyle: {
              //   normal: {}
              // },
              data: itemValue.map(function(item) {
                return item.value;
              })
            };
            var trueObj = {
              name: len.label + '（真实值）',
              type: 'line',
              yAxisIndex: 1,
              // stack: '总量',
              // areaStyle: {
              //   normal: {}
              // },
              data: trueItemValue.map(function(item) {
                return item.value;
              })
            };
            itemObj.series.push(obj, trueObj);
          });
        };
        for (var key in totalDic) {
          totalAry.push({
            kpiCode: key,
            data: totalDic[key],
            trueData: trueTotalDic[key],
            xAxis: [],
            legend: legend,
            series: []
          });
        };
        totalAry.forEach(function(item) {
          loop(item);
          getOption(item);
        });
        //设置折线图的各项参数
        // getOption(totalAry);
      };

      $scope.goSearch = function(obj) {
        var param = [
          "kpi", {
            "category": "time",
            "isRealTimeData": true,
            // "nodeIds": obj.nodeIds,
            // "kpiCodes": [3300],
            // "startTime": new Date(obj.startTime),
            // "endTime": new Date(obj.endTime),
            "timeRange": "",
            // "granularityUnit": "MONTH",
            "aggregateType": [],
            "statisticType": "psiot",
            "includeInstance": true,
            "condList": [],
            "timePeriod": 15552000000,
            "dataType": 2
          }
        ];
        if ($scope.tab == 'tab1') {
          param[1].granularityUnit = obj.statisticsType1;
          param[1].nodeIds = [userLoginUIService.user.domainID];
          var kpiAry = kpiCodeList.filter(function(item) {
            return item.type == "area";
          });
          param[1].kpiCodes = kpiAry.map(function(item) {
            return item.id;
          });
          param[1].queryInstances = obj.area;
          queryKpiCOdeByParam(param, function(eventData) {
            param[1].dataType = 1;
            queryKpiCOdeByParam(param, function(trueData) {
              formatDataFunc(eventData, trueData);
            });
          });
        } else if ($scope.tab == 'tab2') {
          param[1].granularityUnit = obj.statisticsType2;
          param[1].nodeIds = [userLoginUIService.user.domainID];
          var kpiAry = kpiCodeList.filter(function(item) {
            return item.type == "industry";
          });
          param[1].kpiCodes = kpiAry.map(function(item) {
            return item.id;
          });
          param[1].queryInstances = obj.industry;
          queryKpiCOdeByParam(param, function(eventData) {
            param[1].dataType = 1;
            queryKpiCOdeByParam(param, function(trueData) {
              formatDataFunc(eventData, trueData);
            });
          });
        } else if ($scope.tab == 'tab5') {
          param[1].nodeIds = [obj.enterpriseId5];
          var kpiAry = kpiCodeList.filter(function(item) {
            return item.type == "device";
          });
          param[1].kpiCodes = kpiAry.map(function(item) {
            return item.id;
          });
          queryKpiCOdeByParam(param, function(eventData) {
            param[1].dataType = 1;
            queryKpiCOdeByParam(param, function(trueData) {
              formatDataFunc(eventData, trueData);
            });
          });
        } else if ($scope.tab == 'tab3') {
          $scope.showEnergyTitle = true;
          param[1].granularityUnit = obj.statisticsType3;
          param[1].nodeIds = $scope.queryDitem.enterpriseId2 ? [$scope.queryDitem.enterpriseId2] : [userLoginUIService.user.domainID];
          var kpiAry = kpiCodeList.filter(function(item) {
            return item.type == "energy";
          });
          param[1].kpiCodes = kpiAry.map(function(item) {
            return item.id;
          });
          param[1].queryInstances = obj.energy;
          queryKpiCOdeByParam(param, function(eventData) {
            param[1].dataType = 1;
            queryKpiCOdeByParam(param, function(trueData) {
              formatEnergyFunc(eventData, trueData);
            });
          });
        } else if ($scope.tab == 'tab4') {
          if (!obj.enterpriseId) {
            growl.info("请选择企业", {});
            return;
          }
          if (!obj.modelId) {
            growl.info("请选择设备", {});
            return;
          }
          // queryNodeIdByEnterprise(obj, function(returnNodeId) {
          // param[1].nodeIds = [returnNodeId];
          param[1].nodeIds = [obj.nodeId];
          param[1].granularityUnit = obj.statisticsType4;
          var kpiAry = kpiCodeList.filter(function(item) {
            return item.type == "device";
          });
          param[1].kpiCodes = kpiAry.map(function(item) {
            return item.id;
          });
          queryKpiCOdeByParam(param, function(eventData) {
            param[1].dataType = 1;
            queryKpiCOdeByParam(param, function(trueData) {
              formatDataFunc(eventData, trueData);
            });
          });
        }

      };

      //获取节点上的设备类型
      function queryAllDevices() {
        energyConsumeUIService.getDeviceTypeNames('devicetype', function(returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              item.text = item.label;
            })
            $scope.allDeviceList = returnObj.data;
          }
        })
      };

      $scope.filterModel = function(obj) {
        $scope.filterNodes = [];
        $scope.queryDitem.modelId = "";
        $scope.queryDitem.nodeId = "";
        var id = obj.id.split(":")[1];
        $scope.queryDitem.statisticsType4 = $scope.enterprisesDic[id].statisticsType;
        $scope.$apply();
        energyConsumeUIService.getModelDefinitionsByEnterpriseIds([id], function(returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              item.text = item.label;
            })
            $scope.flterDeviceList = returnObj.data;
          }
        })
      };

      $scope.filterNodeId = function(model) {
        var obj = {
          enterpriseId: $scope.queryDitem.enterpriseId,
          modelId: model.id.split(":")[1]
        }
        queryNodeIdByEnterprise(obj);
      };

      $scope.filterStatistic = function(obj) {
        var id = obj.id.split(':')[1];
        if ($scope.tab == "tab3") {
          $scope.queryDitem.statisticsType3 = $scope.enterprisesDic[id].statisticsType;
          $scope.$apply();
        } else if ($scope.tab == "tab5") {
          $scope.queryDitem.statisticsType5 = $scope.enterprisesDic[id].statisticsType;
          $scope.$apply();
        }
      };

      //获取所有企业
      function queryAllEnterprises() {
        energyConsumeUIService.findEnterpriseInfos(function(returnObj) {
          if (returnObj.code == 0) {
            $scope.enterprisesDic = {};
            returnObj.data.forEach(function(item) {
              item.text = item.name;
              $scope.enterprisesDic[item.id] = item;
            });
            $scope.allEnterprises = returnObj.data;
          }
        });
      };

      //根据企业和所选设备过滤出节点信息
      function queryNodeIdByEnterprise(obj, callback) {
        energyConsumeUIService.queryDomainsByEnterpriseId(obj.enterpriseId, function(returnObj) {
          if (returnObj.code == 0) {
            var data = returnObj.data.filter(function(item) {
              item.text = item.name;
              return item.modelDefinitionId && item.modelDefinitionId == obj.modelId;
            });
            $scope.filterNodes = data;
            //var data = returnObj.data;
            // var ids = [];
            // for (var i = 0; i < data.length; i++) {
            //   if (data[i].modelDefinitionId && data[i].modelDefinitionId == obj.modelId) {
            //     ids.push(data[i].id);
            //   }
            // }
            // callback(ids);
          }
        })
      };

      var init = function() {
        queryAllEnterprises();
        queryAllDevices();
        initEvent();
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

  //================================================  企业间设备对比（新）  ======================================================
  controllers.initController('deviceComparisonCtrl', ['$scope', '$filter', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'dictionaryService', 'kpiDataService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'resourceUIService',
    function($scope, $filter, $routeParams, timeout, $q, $location, ngDialog, dictionaryService, kpiDataService, userLoginUIService, energyConsumeUIService, growl, resourceUIService) {
      var echart = require('echarts');
      var target = echart.init(document.getElementById('deviceview'));
      var target3 = echart.init(document.getElementById('device3view'));
      var deferList = [];
      $scope.industryDic = {};
      $scope.tab = 'tab1';
      $scope.statisticsTypeDic = {
        'MONTH': '月',
        'QUARTER': '季度',
        'YEAR': '年'
      };
      $scope.energyDic = {};
      var industryShortType = dictionaryService.dicts['industryShortType'];
      $scope.energyType = dictionaryService.dicts['energyType'];
      industryShortType.forEach(function(item) {
        $scope.industryDic[item.valueCode] = item;
        $scope.industryDic[item.label] = item;
      });
      $scope.energyType.forEach(function(item) {
        item.id = item.label;
        item.text = item.label;
        $scope.energyDic[item.label] = item;
      });

      //初始化所有的数据
      function initAllData() {
        $scope.queryDitem.enterpriseIds = [];
        $scope.queryDitem.modelId = '';
        $scope.queryDitem.energyType = '';
        target.clear();
      };
      $scope.goClear = function() {
        initAllData();
      };

      var initEvent = function() {
        $('#deploy a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          if ($(e.target).closest("li.disabled").length > 0) {
            $(e.target).closest("li.disabled").removeClass("active");
            $(e.target).closest("ul").children("[name=" + $scope.tab + "]").addClass("active");
            return;
          }
          var aname = $(e.target).closest("li").attr("name");
          if (aname) {
            $scope.tab = aname;
            $scope.$apply();
          }
          if (aname == 'tab3' || aname == 'tab1') {
            //$scope.searchDate();
          }
        });
      };

      //定义EChart option
      var getOption = function(echartData) {
        var option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: echartData.legend
          },
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: echartData.xAxis
          }],
          yAxis: [{
            name: '单能源消耗（单位：吨标煤）',
            axisLabel: {
              margin: 30,
            },
            type: 'value'
          }],
          series: echartData.series
        };
        if ($scope.tab == 'tab1') {
          target.setOption(option);
        } else if ($scope.tab == 'tab3') {
          target3.setOption(option);
        }
      };

      /**
       * 格式化时间格式(YYYY-MM-Day HH:MM:SS)
       */
      var formatDate = function(datestr) {
        datestr = $filter('date')(datestr, 'yyyy-MM');
        return datestr;
      };

      //处理数据
      function fomatData(data, obj) { //返回数据，节点与相应企业信息
        var xAxis = [];
        data.forEach(function(item) {
          if (xAxis.indexOf(formatDate(item.arisingTime)) == -1) {
            xAxis.push(formatDate(item.arisingTime));
          }
        });
        var series = [];
        var legend = [];
        var result = [];
        obj.enterpriseIds.forEach(function(item) {
          legend.push($scope.enterprisesDic[item].name);
        });
        legend = obj.nodeIds.map(function(item) {
          return obj.nodeIdToEnfoDic[item].name + '-' + obj.nodeIdDic[item].label;
        });

        obj.nodeIds.forEach(function(nodeId) {
          var nodeObj = {
            name: obj.nodeIdToEnfoDic[nodeId].name + '-' + obj.nodeIdDic[nodeId].label,
            value: xAxis.map(function(elem) {
              var find = data.find(function(el) {
                var time = formatDate(el.arisingTime);
                return time == elem && el.nodeId == nodeId;
              })
              if (find) {
                return find;
              } else {
                return {};
              }

            })
          };
          result.push(nodeObj);
        })

        result.forEach(function(item) {
          series.push({
            name: item.name,
            type: 'line',
            areaStyle: {
              normal: {}
            },
            data: item.value.map(function(el) {
              return el.value;
            })
          })
        });

        //设置折线图的各项参数
        var echartData = {
          xAxis: xAxis,
          legend: legend,
          series: series

        };
        getOption(echartData);
      };

      //获取企业对应的综合能耗
      var kpiDataByEnterpriseId = function(obj) {
        var filterENterpriseAry = [];
        var param = [
          "kpi", {
            "category": "time",
            "isRealTimeData": false,
            "nodeIds": obj.nodeIds,
            "kpiCodes": [3300],
            "startTime": obj.startTime,
            "endTime": obj.endTime,
            "timeRange": "",
            "statisticType": "psiot",
            "queryInstances": obj.energyType,
            "aggregateType": ["VALENTWEIGHT"],
            "granularityUnit": "MONTH",
            "includeInstance": true,
            "condList": [],
            "timePeriod": 15552000000,
            "dataType": 1
          }
        ];
        kpiDataService.getValueList(param, function(returnObj) {
          if (returnObj.code == 0) {
            fomatData(returnObj.data, obj);
          }
        });
      };

      //获取所有企业及企业对应的节点信息
      function queryAllEnterprises() {
        var index = 0;
        var ary = [];
        var allEnterprisesLength = 0;
        var allModelAry = [];
        var allModelDic = {};
        $scope.allModelAry = [];
        $scope.allModelDic = {};
        var queryDomainsByEnterpriseId = function(enterpriseId) {
          energyConsumeUIService.queryDomainsByEnterpriseId(enterpriseId, function(returnObj) {
            if (returnObj.code == 0) {
              index++;
              returnObj.data.forEach(function(item) { //筛选出企业的设备模板
                if (item.modelDefinitionId) {
                  ary.push(item)
                }
              });
              if (ary) {
                ary.forEach(function(item) {
                  allModelAry.push()
                  allModelDic[item.modelDefinitionId] = $scope.enterprisesDic[enterpriseId]; ///设备模型上存放企业信息
                });
              }

              if (index == allEnterprisesLength) { //查询了所有的企业节点
                $scope.allModelAry = allModelAry;
                $scope.allModelDic = allModelDic; //节点id对应企业信息
              }
            }
          })
        };
        energyConsumeUIService.findEnterpriseInfos(function(returnObj) {
          if (returnObj.code == 0) {
            $scope.enterprisesDic = {};
            returnObj.data.forEach(function(item) {
              item.text = item.name;
              $scope.enterprisesDic[item.id] = item;
              // queryDomainsByEnterpriseId(item.id);
            })
            $scope.allEnterprises = returnObj.data;
            allEnterprisesLength = returnObj.data.length;
          }
        });
      };

      //获取节点上的设备类型
      function queryAllDevices() {
        energyConsumeUIService.getDeviceTypeNames('devicetype', function(returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              item.text = item.label;
            })
            $scope.allDeviceList = returnObj.data;
          }
        })
      };

      $scope.goSearch = function(obj) {
        //通过企业查设备模型
        var nodeIdAry = [];
        var nodeIdDic = {};
        var nodeIdToEnfoDic = {};
        var index = 0;
        var defers = [];
        obj.enterToNodesDic = {};
        var queryDomainsByEnterpriseId = function(enterpriseId) {
          var subdefer = $q.defer();
          energyConsumeUIService.queryDomainsByEnterpriseId(enterpriseId, function(returnObj) {
            if (returnObj.code == 0) {
              index++;
              var ary = returnObj.data.filter(function(item) {
                return item.modelDefinitionId == obj.modelId;
              });
              ary.forEach(function(item) {
                nodeIdAry.push(item.id);
                nodeIdDic[item.id] = item; //节点ID对应节点信息
                nodeIdToEnfoDic[item.id] = $scope.enterprisesDic[enterpriseId]; //节点id对应企业信息
              });
              if (!obj.enterToNodesDic[enterpriseId]) {
                obj.enterToNodesDic[enterpriseId] = ary;
              }
              if (index == obj.enterpriseIds.length) {
                obj.nodeIds = nodeIdAry;
                obj.nodeIdDic = nodeIdDic;
                obj.nodeIdToEnfoDic = nodeIdToEnfoDic;
              }
              subdefer.resolve("success");
            }
          })
          return subdefer.promise;
        };
        obj.enterpriseIds.forEach(function(item) {
          defers.push(queryDomainsByEnterpriseId(item));
        });
        $q.all(defers).then(function() {
          kpiDataByEnterpriseId(obj);
        });
      };

      $scope.filterEnter = function(obj) {
        var modelId = obj.id.split(':')[1];
        energyConsumeUIService.getEnterpriseInfosByModelDefinitionId([modelId], function(returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              item.text = item.name;
            });
            $scope.filterEnterprises = returnObj.data;
          }
        })
      };

      $scope.filterModel = function(obj) {
        if (obj.length == 0) {
          return;
        }
        energyConsumeUIService.getModelDefinitionsByEnterpriseIds(obj, function(returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              item.text = item.label;
            })
            $scope.flterDeviceList = returnObj.data;
          }
        })
      }

      var init = function() {
        queryAllEnterprises();
        queryAllDevices();
        initEvent();
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

  //================================================  能效评估 ======================================================
  controllers.initController('assessmentCtrl', ['$scope', '$filter', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'dictionaryService', 'kpiDataService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'resourceUIService',
    function($scope, $filter, $routeParams, timeout, $q, $location, ngDialog, dictionaryService, kpiDataService, userLoginUIService, energyConsumeUIService, growl, resourceUIService) {
      var echart = require('echarts');
      var target = echart.init(document.getElementById('radarView'));
      var target1 = echart.init(document.getElementById('tendencyView'));
      var statisticsTypeDic = {
        'MONTH': '月',
        'QUARTER': '季度',
        'YEAR': '年'
      };
      var kpiCodeDic = {
        3304: 'GDP能耗得分',
        3305: '工业附加值能耗得分',
        3301: '节能率指标得分',
        3351: '节能潜力指标得分'
      };
      $scope.industryDic = {};
      $scope.queryDitem = {};
      $scope.$watch("myDicts", function(n, o) {
        if (n) {
          $scope.industryList = $scope.myDicts['industryShortType'];
          $scope.industryList.forEach(function(item) {
            item.id = item.valueCode;
            item.text = item.param;
            $scope.industryDic[item.valueCode] = item;
            $scope.industryDic[item.label] = item;
          });
        }
      });

      /**
       * 格式化时间格式(YYYY-MM-Day HH:MM:SS)
       */
      var formatDate = function(datestr) {
        datestr = $filter('date')(datestr, 'yyyy-MM');
        return datestr;
      };

      var widgetMaxFun = function(id) {
        if (jQuery(id).find(".fa.fa-plus").length > 0) {
          jQuery.AdminLTE.boxWidget.collapse(jQuery(id));
        }
      };
      var widgetMinFun = function(id) {
        if (jQuery(id).find(".fa.fa-plus").length == 0) {
          jQuery.AdminLTE.boxWidget.collapse(jQuery(id));
        }
      };


      //初始化所有的数据
      function initAllData() {
        $scope.queryDitem.enterpriseId = '';
        $scope.queryDitem.industryType = '';
        $scope.queryDitem.statisticsType = '';
        $scope.queryDitem.startTime = '';
        $scope.queryDitem.endTime = '';
        target.clear();
        target1.clear();
      };
      $scope.goClear = function() {
        initAllData();
      };

      //定义EChart option
      var getOption = function(echartData) {
        var tabOption = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: echartData.legend
          },
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: echartData.xAxis
          }],
          yAxis: [{
            type: 'value'
          }],
          series: echartData.series
        };
        var radarOption = {
          title: {
            text: ''
          },
          tooltip: {},
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          legend: {
            data: echartData.xAxis
          },
          radar: {
            // shape: 'circle',
            indicator: echartData.indicator
          },
          series: [{
            name: '',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: echartData.randarSeries
          }]
        };
        target.setOption(radarOption);
        target1.setOption(tabOption);
      };

      //处理数据
      function fomatData(ssessmentAry, obj) { //返回数据
        var legend = [];
        var legendAry = [];
        var xAisDic = {};
        var xAxis = [];
        var series = [];
        var randarSeries = [];

        for (var key in kpiCodeDic) {
          legend.push(kpiCodeDic[key]);
          legendAry.push({
            id: key,
            name: kpiCodeDic[key],
            max: 100
          });
        }
        ssessmentAry.forEach(function(item) {
          if (!xAisDic[item.arisingTime]) {
            xAisDic[item.arisingTime] = item.arisingTime;
            xAxis.push(formatDate(item.arisingTime));
          }
        });
        legendAry.forEach(function(legend) {
          series.push({
            name: legend.name,
            type: 'line',
            data: xAxis.map(function(elem) {
              var find = ssessmentAry.find(function(el) {
                var time = formatDate(el.arisingTime);
                return time == elem && el.kpiCode == legend.id;
              })
              if (find) {
                return find.value;
              } else {
                return '-';
              }
            })
          });
        });

        //雷达图：xAxis时间为图例，legendAry为5个指标
        xAxis.forEach(function(x) {
          randarSeries.push({
            name: x,
            value: legendAry.map(function(legend) {
              var find = ssessmentAry.find(function(el) {
                var time = formatDate(el.arisingTime);
                return time == x && el.kpiCode == legend.id;
              })
              if (find) {
                return find.value;
              } else {
                return '-';
              }
            })
          });
        });
        //设置折线图的各项参数
        var echartData = {
          xAxis: xAxis,
          legend: legend,
          series: series,
          indicator: legendAry,
          randarSeries: randarSeries
        };
        getOption(echartData);
      };

      //获取能效评估的5个指标
      var kpiDataByEnterpriseId = function(obj) {
        var param = [obj.statisticsType, obj.industryType, obj.enterpriseId, obj.startTime, obj.endTime];
        energyConsumeUIService.getEnergyEvaluations(param, function(returnObj) {
          if (returnObj.code == 0) {
            var ssessmentAry = [];
            returnObj.data.forEach(function(item) {
              ssessmentAry.push(item);
            });
            fomatData(ssessmentAry, obj);
          }
        });
      };

      $scope.goSearch = function(obj) {
        if (!obj || !obj.industryType) {
          growl.info("请选择行业", {});
          return;
        }
        if (!obj || !obj.enterpriseId) {
          growl.info("请选择企业", {});
          return;
        }
        if (!obj || !obj.statisticsType) {
          growl.info("请选择周期类型", {});
          return;
        }
        if (!obj || !obj.startTime) {
          var year = new Date().getFullYear();
          var startMonth = new Date().getMonth();
          var endMonth = new Date().getMonth() + 1;
          obj.startTime = new Date(year + '-' + startMonth);
          obj.endTime = new Date(year + '-' + endMonth);
        }
        target.clear();
        kpiDataByEnterpriseId(obj);
        widgetMaxFun("#viewrandar1");
        widgetMaxFun("#viewrandar2");
      };

      //获取所有企业
      function queryAllEnterprises() {
        energyConsumeUIService.findEnterpriseInfos(function(returnObj) {
          if (returnObj.code == 0) {
            $scope.enterprisesDic = {};
            returnObj.data.forEach(function(item) {
              item.text = item.name;
              $scope.enterprisesDic[item.id] = item;
            })
            $scope.allEnterprises = returnObj.data;
          }
        });
      };

      var init = function() {
        queryAllEnterprises();
        jQuery.AdminLTE.boxWidget.collapse(jQuery("#viewrandar1"));
        jQuery.AdminLTE.boxWidget.collapse(jQuery("#viewrandar2"));
        // widgetMinFun("#viewrandar1");
        // widgetMinFun("#viewrandar2");
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

  //================================================  能耗区域态势  ======================================================
  controllers.initController('areaEnergyCtrl', ['$scope', '$filter', '$routeParams', '$timeout', 'Info', '$q', '$location', 'ngDialog', 'dictionaryService', 'kpiDataService', 'userLoginUIService', 'energyConsumeUIService', 'growl', 'resourceUIService',
    function($scope, $filter, $routeParams, timeout, Info, $q, $location, ngDialog, dictionaryService, kpiDataService, userLoginUIService, energyConsumeUIService, growl, resourceUIService) {
      var echart = require('echarts');
      var target1 = echart.init(document.getElementById('areaEnergyview'));
      var target2 = echart.init(document.getElementById('areamap'));
      var areaDic = {
        '合肥': [117.29, 32.0581]
      };
      Info.get('../localdb/hefei2.json', function(data) {
        data.features.forEach(function(item) {
          var temp = item.properties.cp;
          areaDic[item.properties.name] = [temp[0], temp[1]];
        });
        echart.registerMap('hefei', data);
      });
      $scope.tab = 'tab1';

      var kpiCodeList = [{
        id: 3320,
        type: 'area',
        label: "区域综合能耗增幅"
      }, {
        id: 3321,
        type: 'area',
        label: "区域GDP增幅"
      }, {
        id: 3322,
        type: 'area',
        label: "区域工业附加值增幅"
      }, {
        id: 3323,
        type: 'area',
        label: "区域GDP能耗增幅"
      }, {
        id: 3324,
        type: 'area',
        label: "区域工业附加值能耗增幅"
      }, {
        id: 3315,
        type: 'map',
        label: "区域综合能耗"
      }, {
        id: 3318,
        type: 'map',
        label: "区域GDP能耗"
      }, {
        id: 3319,
        type: 'map',
        label: "区域工业附加值能耗"
      }];

      //初始化所有的数据
      function initAllData() {
        var lastYear = new Date().getFullYear();
        var lastMonth = new Date().getMonth();
        $scope.queryDitem = {};
        $scope.queryDitem1 = {};
        $scope.queryDitem.year = lastYear;
        $scope.queryDitem.month = lastMonth;
        $scope.queryDitem1.year = lastYear;
        $scope.queryDitem1.month = lastMonth;
        $scope.yearList = [];
        $scope.monthList = [];
        for (var i = 0; i < 8; i++) {
          $scope.yearList.push({
            id: lastYear - i,
            text: (lastYear - i) + '年'
          });
        }
        for (var i = 1; i < 13; i++) {
          $scope.monthList.unshift({
            id: i,
            text: i + '月'
          });
        }
        target1.clear();
        target2.clear();
      };
      $scope.goClear = function() {
        initAllData();
      };

      var initEvent = function() {
        $('#deploy a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          if ($(e.target).closest("li.disabled").length > 0) {
            $(e.target).closest("li.disabled").removeClass("active");
            $(e.target).closest("ul").children("[name=" + $scope.tab + "]").addClass("active");
            return;
          }
          var aname = $(e.target).closest("li").attr("name");
          if (aname) {
            $scope.tab = aname;
            $scope.$apply();
          }
        });
      };

      //定义EChart option
      var getOption = function(echartData) {
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['stack', 'tiled']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          legend: echartData.legend,
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: echartData.xAxis,
          yAxis: echartData.yAxis,
          series: echartData.series
        };
        var optionMap = {
          backgroundColor: 'rgb(208, 224, 227)',
          title: {
            text: '',
            subtext: '',
            left: 'center',
            textStyle: {
              color: '#000'
            }
          },
          tooltip: {
            trigger: 'item'
          },
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          visualMap: {
            min: 0,
            max: 2500,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            inRange: {
              color: ['lightskyblue', 'yellow', 'orangered']
            }
          },
          legend: {
            orient: 'vertical',
            top: 'top',
            left: 'left',
            data: echartData.legend,
            textStyle: {
              color: '#333'
            },
            selectedMode: 'single'
          },
          geo: {
            map: 'hefei',
            label: {
              emphasis: {
                show: false
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: 'rgb(111, 168, 220)',
                borderColor: '#404a59'
              },
              emphasis: {
                areaColor: 'rgb(7, 55, 99)'
              }
            }
          },
          series: echartData.series
        };
        if ($scope.tab == "tab1") {
          // console.log(JSON.stringify(option, null, '\t'));
          target1.setOption(option);
        } else if ($scope.tab == "tab2") {
          target2.setOption(optionMap);
        }
      };

      /**
       * 格式化时间格式(YYYY-MM-Day HH:MM:SS)
       */
      var formatDate = function(datestr) {
        datestr = $filter('date')(datestr, 'yyyy-MM');
        return datestr;
      };

      //根据参数查kpi数据
      var queryKpiCOdeByParam = function(param, callback) {
        kpiDataService.getValueList(param, function(returnObj) {
          if (returnObj.code == 0) {
            callback(returnObj.data);
          }
        });
      };

      //处理数据
      var formatDataFunc = function(data, type) {
        var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        var color = {
          '区域综合能耗': '#a6c84c',
          '区域GDP能耗': '#ffa022',
          '区域工业附加值能耗': '#46bee9'
        };
        var xAxis = [];
        var yAxis = [];
        data.forEach(function(item) {
          if (yAxis.indexOf(item.instance) == -1) {
            yAxis.push(item.instance);
          }
        });
        var legend = kpiCodeList.filter(function(item) {
          return item.type == type;
        });

        var series = [];
        var seriesMap = [];
        var HFData = [];
        var echartData = {};
        var mapDic = {};
        legend.map(function(len) {
          mapDic[len.label] = [];
          var itemValue = yAxis.map(function(yA) {
            var find = data.find(function(el) {
              return yA == el.instance && el.kpiCode == len.id;
            });
            if (find) {
              HFData.push({
                name: len.label,
                from: '合肥',
                to: find.instance,
                value: find.value
              });
              return find;
            } else {
              return [];
            };
          });
          var obj = {
            name: len.label,
            type: 'bar',
            areaStyle: {
              normal: {
                show: true
              }
            },
            data: itemValue.map(function(item) {
              return item.value;
            })
          };
          series.push(obj);
        });
        for (var key in mapDic) {
          HFData.forEach(function(item) {
            if (key == item.name) {
              mapDic[key].push({
                formName: '合肥',
                toName: item.to,
                name: item.to,
                coords: [areaDic['合肥'], areaDic[item.to]],
                value: areaDic[item.to].concat(item.value)
              });
            }
          });
        };
        for (var key in mapDic) {
          seriesMap.push({
            name: key,
            type: 'lines',
            zlevel: 1,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: '#fff',
              symbolSize: 3
            },
            lineStyle: {
              normal: {
                color: color[key],
                width: 0,
                curveness: 0.2
              }
            },
            data: mapDic[key]
          }, {
            name: key,
            type: 'lines',
            zlevel: 2,
            symbol: ['none', 'arrow'],
            symbolSize: 10,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: planePath,
              symbolSize: 15
            },
            lineStyle: {
              normal: {
                color: color[key],
                width: 1,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: mapDic[key]
          }, {
            name: key,
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter: '{b}'
              }
            },
            symbolSize: function(val) {
              return 10;
            },
            itemStyle: {
              normal: {
                label: {
                  show: true
                }
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              normal: {
                color: color[key]
              }
            },
            data: mapDic[key]
          })
        }

        //设置折线图的各项参数
        if (type == 'area') {
          echartData = {
            xAxis: [{
              type: 'value'
            }],
            yAxis: [{
              type: 'category',
              axisTick: {
                show: false
              },
              data: yAxis
            }],
            legend: {
              data: (function() {
                return legend.map(function(item) {
                  return item.label;
                });
              })()
            },
            series: series
          };
        } else {
          echartData = {
            legend: legend.map(function(item) {
              return item.label;
            }),
            series: seriesMap
          }
        }

        getOption(echartData);
      };

      $scope.goSearch = function(obj) {
        obj.startTime = new Date(obj.year + '-' + obj.month);
        obj.endTime = new Date(obj.year + '-' + obj.month + '-' + '02');
        var param = [
          "kpi", {
            // "category": "ci",
            "aggregate_instance": 2,
            "aggregate_rule": 0,
            "isRealTimeData": false,
            "nodeIds": [userLoginUIService.user.domainID],
            // "kpiCodes": [3300],
            "startTime": obj.startTime,
            "endTime": obj.endTime,
            "timeRange": "",
            "granularityUnit": "MONTH",
            "aggregateType": ['VALENTWEIGHT'],
            "statisticType": "psiot",
            "includeInstance": true,
            "condList": [],
            "timePeriod": 15552000000,
            "dataType": 1
          }
        ];
        if ($scope.tab == 'tab1') {
          param[1].category = "time";
          var kpiAry = kpiCodeList.filter(function(item) {
            return item.type == "area";
          });
          param[1].kpiCodes = kpiAry.map(function(item) {
            return item.id;
          });
          queryKpiCOdeByParam(param, function(eventData) {
            formatDataFunc(eventData, 'area');
          });
        } else if ($scope.tab == 'tab2') {
          param[1].category = "ci";
          var kpiAry = kpiCodeList.filter(function(item) {
            return item.type == "map";
          });
          param[1].kpiCodes = kpiAry.map(function(item) {
            return item.id;
          });
          queryKpiCOdeByParam(param, function(eventData) {
            formatDataFunc(eventData, 'map');
          });
        }

      };

      var init = function() {
        initAllData();
        initEvent();
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

});
