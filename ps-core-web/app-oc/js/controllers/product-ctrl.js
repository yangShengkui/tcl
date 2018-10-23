define(['controllers/controllers', 'bootstrap-dialog', 'Array'], function(controllers, BootstrapDialog) {
  'use strict';

  //================================================   产品结构（产品信息）   ======================================================
  controllers.initController('productCommonCtrl', ['$scope', '$routeParams', '$timeout', '$q', '$location', 'ngDialog', 'unitService', 'userLoginUIService', 'productUIService', 'growl', 'userDomainService',
    function($scope, $routeParams, $timeout, $q, $location, ngDialog, unitService, userLoginUIService, productUIService, growl, userDomainService) {
      $scope.selectedCount = 0;


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
              productUIService.addProduct($scope.dialog.input, addproduct_callback);
            } else if ($scope.dialog.input.id > 0) { //编辑
              productUIService.updateProduct($scope.dialog.input, updataproduct_callback);
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
          $scope.$broadcast(Event.ENTERPRISEINIT + "_productList", {
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
                productUIService.deleteProduct([select], function(returnObj) {
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
        var param = {};
        if($scope.tableInit.select.desc){
          param["desc"] = $scope.tableInit.select.desc;
        }
        if($scope.tableInit.select.name){
          param["name"] = $scope.tableInit.select.name;
        }
        productUIService.findProducts(param, function(returnObj) {
          if (returnObj.code == 0) {
            $scope.queryAllList = returnObj.data;
            broardFun(returnObj.data);
          }
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
      var findProductsByEnterId = function(enterpriseId) {
        productUIService.findProductsByEnterpriseId([enterpriseId], function(returnObj) {
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

});
