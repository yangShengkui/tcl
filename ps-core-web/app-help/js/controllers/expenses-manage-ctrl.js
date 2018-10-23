define(['controllers/controllers', 'bootstrap-dialog'], function (controllers, BootstrapDialog) {
  'use strict';
  //预览
  controllers.controller('expensesPreviewCtrl', ['$scope', "$sce", 'chargeUIService', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'psMessageService', 'growl',
    function ($scope, $sce, chargeUIService, kpiDataService, userLoginUIService, resourceUIService, psMessageService, growl) {
      $scope.orderUser = '';
      var node = $scope.rootCi;
      $scope.device = '0';
      $scope.gather = '0';
      $scope.pass = '0';
      $scope.client = '0';
      var kpiValues = function () {

        var kpiList = ["kpi", {
          "category": "ci",
          "isRealTimeData": true,
          "timePeriod": 0,
          "nodeIds": [node],
          "kpiCodes": [
            3001, 3002, 3022
          ],
          "startTime": null,
          "endTime": null,
          "timeRange": "",
          "statisticType": "psiot",
          "condList": []
        }];

        kpiDataService.getValueList(kpiList, function (returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              if (returnObj.data[i].kpiCode == 3001) {
                $scope.device = returnObj.data[i].value;
              } else if (returnObj.data[i].kpiCode == 3002) {
                $scope.gather = returnObj.data[i].value;
              } else if (returnObj.data[i].kpiCode == 3022) {
                $scope.client = returnObj.data[i].value;
              }
            }
          }
        })
      };
      chargeUIService.getCurrentUserProduct(function (res) {
        if (res.code == 0) {
          $scope.orderUser = res.data;
        }
      });

      if (node == undefined) {
        resourceUIService.getRootDomain(function (returnObj1) {
          if (returnObj1.code == 0) {
            node = returnObj1.data.id;
            kpiValues();
          }
        });
      } else {
        kpiValues();
      }
    }
  ]);
  //缴费记录
  controllers.controller('expensesRecordCtrl', ['$scope', 'chargeUIService', 'userLoginUIService', 'userEnterpriseService', 'growl', 'resourceUIService',
    function ($scope, chargeUIService, userLoginUIService, userEnterpriseService, growl, resourceUIService) {
      var RetainedDecimalPlaces = function (num, del, o) {
        try {
          num += "";
          num = parseFloat(num).toFixed(del); //保留小数并四舍五入
          var str = "";
          if (!o) {
            if (num.substring(0, 1) == "-") str = "-";
          }
          //清除字符串中的非数字 非.字符
          num = num.replace(/[^0-9|\.]/g, "");
          //清除字符串开头的0
          if (/^0+/) num = num.replace(/^0+/, "");
          //为整数字符串在末尾添加.0000
          if (!/\./.test(num)) num += ".0000";
          //字符以.开头时，在开头添加0
          if (/^\./.test(num)) num = "0" + num;
          num += "0000"; //在字符串末尾补零
          if (del == 2) num = num.match(/\d+\.\d{2}/)[0];
          if (del == 4) num = num.match(/\d+\.\d{4}/)[0];
          //千位符
          while (/\d{4}(\.|,)/.test(num)) //符合条件则进行替换
            num = num.replace(/(\d)(\d{3}(\.|,))/, "$1,$2"); //每隔3位添加一个
          return str + num;
        } catch (e) {
          alert(e);
        }
      };
      //用户管理
      $scope.recordGridData = {
        columns: [{
          title: "资费方式",
          data: "resourceType"
        }, {
          title: "付费模式",
          data: "durationUnit"
        }, {
          title: "数量",
          data: "resourceCount"
        }, {
          title: "开通时长",
          data: "duration"
        }, {
          title: "价格",
          data: "netAmount"
        }, {
          title: "状态",
          data: "state"
        }, {
          title: "订单提交时间",
          data: "createDate"

        }, {
          title: "操作",
          orderable:false,
          data: "option"

        }],
        columnDefs: [{
          targets: 0,
          render: function (data, type, row) {
            var str = "";
            if (data == 1) {
              str = '接入设备数量';
            } else if (data == 2) {
              str = '采集监控点数量';
            } else if (data == 3) {
              str = '交互消息数量';
            }
            return str;
          }
        }, {
          targets: 1,
          render: function (data, type, row) {
            var str = '';
            if (data == 1) {
              str = '月';
            } else if (data == 2) {
              str = '年';
            }
            return str;
          }
        }, {
          targets: 2,
          render: function (data, type, row) {
            var str = '';
            if (row.resourceType == 1 || row.resourceType == 2) {
              str = data + '个';
            } else if (row.resourceType == 3) {
              str = data + '条';
            }
            return str;
          }
        }, {
          targets: 3,
          render: function (data, type, row) {
            var str = '';
            if (row.durationUnit == 1) {
              str = '月';
            } else if (row.durationUnit == 2) {
              str = '年';
            }
            return '' + data + '' + str + '';
          }
        }, {
          targets: 4,
          render: function (data, type, row) {
            var str = '0元';
            if (data != '' && data != null) {
              str = '' + RetainedDecimalPlaces(data, 2, true) + '元';
            }
            return str;
          }
        }, {
          targets: 5,
          render: function (data, type, row) {
            return "<span class='label " + (data == 1 ? "label-warning" : "label-info") + "'>" + (data == 2 ? "已支付" : "未支付") + "</span>";
            ;
          }
        }, {
          targets: 6,
          render: function (data, type, row) {
            var str = '';
            if (data != '' && data != null) {
              str = newDateJson(data).Format(GetDateCategoryStrByLabel());
            }
            return str;
          }
        }, {
          targets: 7,
          render: function (data, type, row) {
            var str = '';
            if (row.state == 1) {
              //str = "待支付";
              str += "<a id='price-btn' class='btn btn-default btn-sm'><i class='proudsmart ps-pay  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 支付</span></a>";

            } else if (row.state == 2) {
              str = "已购买";
            }
            return str;
          }
        }]
      }
      chargeUIService.getCurrentUserOrder(function (res) {
        if (res.code == 0) {
          $scope.recordGridData.data = res.data;
          $scope.$broadcast(Event.USERINFOSINIT + "_record", $scope.recordGridData);
        }
      });

    }
  ]);
  //续费
  controllers.controller('expensesRenewCtrl', ['$scope', "$sce", '$routeParams', 'chargeUIService', 'userLoginUIService', 'resourceUIService', 'psMessageService', 'growl',
    function ($scope, $sce, $routeParams, chargeUIService, userLoginUIService, resourceUIService, psMessageService, growl) {
      //初始化数量+价格下拉列表
      $scope.product = '';
      //初始化付费模式
      $scope.unit = '月';
      //优惠券对应model
      $scope.code = '';
      //优惠之后的价格
      $scope.codeMoney = '';
      //根据id进来的时候保存整个集合，购买的时候使用了优惠券保存优惠券结合
      $scope.CouponList = '';
      //标记通过哪种方式进来
      $scope.orderUser = '';
      //获取进来的订单号
      $scope.orderNo = $routeParams.orderNo;
      //初始化购买集合
      $scope.orderList = {
        'duration': '',
        'durationUnit': '1',
        'resourceType': '1',
        'resourceCount': '0',
        'totalAmount': '',
        'balanceAmount': '',
        'price': '',
        'netAmount': ''
      };
      /*四舍五入并且截取
       * num  值
       * del  保留小数
       */
      var RetainedDecimalPlaces = function (num, del, o) {
        try {
          num += "";
          num = parseFloat(num).toFixed(del); //保留小数并四舍五入
          var str = "";
          if (!o) {
            if (num.substring(0, 1) == "-") str = "-";
          }
          //清除字符串中的非数字 非.字符
          num = num.replace(/[^0-9|\.]/g, "");
          //清除字符串开头的0
          if (/^0+/) num = num.replace(/^0+/, "");
          //为整数字符串在末尾添加.0000
          if (!/\./.test(num)) num += ".0000";
          //字符以.开头时，在开头添加0
          if (/^\./.test(num)) num = "0" + num;
          num += "0000"; //在字符串末尾补零
          if (del == 2) num = num.match(/\d+\.\d{2}/)[0];
          if (del == 4) num = num.match(/\d+\.\d{4}/)[0];
          //千位符
          while (/\d{4}(\.|,)/.test(num)) //符合条件则进行替换
            num = num.replace(/(\d)(\d{3}(\.|,))/, "$1,$2"); //每隔3位添加一个
          return str + num;
        } catch (e) {
          alert(e);
        }
      };
      //获取所有价格定义
      chargeUIService.getAllPrice(function (res) {
        if (res.code == 0) {
          $scope.product = res.data;
          if ($scope.orderNo != null) {
            payUser();
          }
        }
      });
      //根据订单id查订单详情
      var payUser = function () {
        chargeUIService.getOrderByOrderNo($scope.orderNo, function (res) {
          if (res.code == 0) {
            $scope.CouponList = res.data;
            $scope.orderList.resourceType = res.data.resourceType;
            $scope.orderList.durationUnit = res.data.durationUnit;
            $scope.orderList.duration = res.data.duration;
            $scope.orderList.resourceCount = res.data.resourceCount;
            $scope.orderList.totalAmount = RetainedDecimalPlaces(res.data.price, 2, true);
            $scope.orderList.netAmount = RetainedDecimalPlaces(res.data.netAmount, 2, true);
            $scope.orderUser = "order";
          }
        });
      }
      //监听数量下拉框的变化并且实时更新数据
      $scope.$watch('orderList.resourceCount', function (newValue, oldValue, scope) {

        if ($scope.orderUser != 'order') {
          if (newValue != undefined && newValue != null) {
            var item = "";
            for (var i in $scope.product) {
              if ($scope.product[i].resourceCount == newValue && $scope.product[i].resourceType == $scope.orderList.resourceType && $scope.product[i].durationUnit == $scope.orderList.durationUnit) {
                item = $scope.product[i];
                break;
              }
            }
            if (item != "") {
              //默认一个月
              $scope.orderList.duration = "1";
              $scope.orderList.totalAmount = RetainedDecimalPlaces(item.price, 2, true);
              if ($scope.codeMoney != "") {
                if ($scope.CouponList.couponType == 1) {
                  var price = item.price * $scope.orderList.duration;
                  if (price > $scope.CouponList.amount) {
                    var orderPrice = price - $scope.CouponList.amount;
                    $scope.orderList.netAmount = RetainedDecimalPlaces(orderPrice, 2, true);
                  } else {
                    $scope.orderList.netAmount = '0.00';
                  }
                } else if ($scope.CouponList.couponType == 2) {
                  var orderPrice = item.price * $scope.orderList.duration * $scope.CouponList.discount;
                  $scope.orderList.netAmount = RetainedDecimalPlaces(orderPrice, 2, true);
                }
              } else {
                $scope.orderList.netAmount = RetainedDecimalPlaces(item.price, 2, true);
              }

            }

          } else {
            emptyRecord();
          }
        }
      });
      //资费方式变更的时候查询初始化
      $scope.typeClick = function () {
        emptyRecord();
      };
      var emptyRecord = function () {
        $scope.orderList.duration = '';
        $scope.orderList.resourceCount = '';
        $scope.orderList.totalAmount = '';
        $scope.orderList.price = '';
        $scope.orderList.netAmount = '';
        $scope.codeMoney = '';
        $scope.code = '';
      }
      //优惠券兑换
      $scope.promoCode = function () {
        if ($scope.orderList.totalAmount != '') {
          if ($scope.code != '') {
            chargeUIService.getCouponByPromoCode($scope.code, function (res) {
              if (res.code == 0 && res.data != null) {

                if (res.data.couponType == 1) {
                  $scope.codeMoney = '-' + RetainedDecimalPlaces(res.data.amount, 2, true) + '元';
                  var price = $scope.orderList.totalAmount.replace(",", "") * $scope.orderList.duration;
                  if (price > res.data.amount) {
                    var netPrice = price - res.data.amount;
                    $scope.orderList.netAmount = RetainedDecimalPlaces(netPrice, 2, true)
                  } else {
                    $scope.orderList.netAmount = '0.00';
                  }
                } else if (res.data.couponType == 2) {
                  $scope.codeMoney = res.data.discount + '折';
                  var netPrice = $scope.orderList.totalAmount.replace(",", "") * $scope.orderList.duration * res.data.discount;
                  $scope.orderList.netAmount = RetainedDecimalPlaces(netPrice, 2, true)
                }

                $scope.CouponList = res.data;
              } else {
                $scope.codeMoney = '';
              }
            });

          } else {
            growl.warning("请输入优惠券", {});
          }
        } else {
          growl.warning("请先选择套餐", {});
        }
      };
      $scope.dict = "个";
      //资费方式单位变更
      $scope.$watch('orderList.resourceType', function (newValue, oldValue, scope) {
        if (newValue == 1) {
          $scope.dict = '个';
        } else if (newValue == 2) {
          $scope.dict = '个';
        } else if (newValue == 3) {
          $scope.dict = '条';
        }
      })
      //付费方式变更以及数据更新
      $scope.$watch('orderList.durationUnit', function (newValue, oldValue, scope) {
        if ($scope.orderUser != 'order') {
          $scope.orderList.netAmount = '';
          $scope.orderList.resourceCount = "0";
          $scope.orderList.totalAmount = "";
          $scope.orderList.duration = "";
        }
        if (newValue == 1) {
          $scope.unit = "月";
        } else if (newValue == 2) {
          $scope.unit = "年";
        }
      });
      //开通时长输入校验以及数据更新
      $scope.timeOpen = function () {
        if (!/^[0-9]*[1-9][0-9]*$/.test($scope.orderList.duration)) {
          $scope.orderList.duration = '';
        } else {
          //时长*单价
          var banPrice = $scope.orderList.duration * $scope.orderList.totalAmount.replace(",", "");
          if ($scope.codeMoney != "") {
            if ($scope.CouponList.couponType == 1) {
              if (banPrice > $scope.CouponList.amount) {
                $scope.orderList.netAmount = RetainedDecimalPlaces(banPrice - $scope.CouponList.amount, 2, true);
              } else {
                $scope.orderList.netAmount = '0.00';
              }
            } else if ($scope.CouponList.couponType == 2) {
              $scope.orderList.netAmount = RetainedDecimalPlaces(banPrice * $scope.CouponList.discount, 2, true);
            }
          } else {
            $scope.orderList.netAmount = RetainedDecimalPlaces(banPrice, 2, true);
          }
        }
      }
      $scope.subAjax = '';
      //付费提交数据
      var pay = function (orderList) {
        chargeUIService.saveOrder($scope.orderList, function (res) {
          if (res.code == 0) {
            if (res.data == "true") {
              growl.success("续费成功", {});
              location.href = '#/expenses';
            } else if (res.data == "false") {
              growl.success("续费失败", {});
              location.href = '#/record';
            } else {
              $scope.subAjax = res.data;
            }
          }
        });
      }

      $scope.TrustAsHtml = function (post) {
        return $sce.trustAsHtml(post);
      };
      //支付之前校验
      $scope.saveOrder = function () {
        if ($scope.orderList.resourceCount == "" || $scope.orderList.resourceCount == null) {
          growl.warning("请选择数量");
          return;
        }
        if ($scope.orderList.duration <= 0 || $scope.orderList.duration == "") {
          growl.warning("开通时长大于0且不能为空");
          return;
        }
        if ($scope.orderNo != null) {
          $scope.orderList = $scope.CouponList;
          pay($scope.orderList);
        } else {
          if ($scope.codeMoney != "") {
            $scope.orderList['couponList'] = [$scope.CouponList];
          }
          if ($scope.orderList.netAmount.length > 6) {
            $scope.orderList.netAmount = $scope.orderList.netAmount.replace(",", "");
          }
          if ($scope.orderList.netAmount <= 200000) {
            if($scope.orderList.totalAmount.length > 6){
              $scope.orderList.price = $scope.orderList.totalAmount.replace(",", "");
            }else{
              $scope.orderList.price = $scope.orderList.totalAmount;
            }
            var amount = $scope.orderList.price * $scope.orderList.duration;
            $scope.orderList.totalAmount = amount;
            console.log("list==" + JSON.stringify($scope.orderList));
            pay($scope.orderList);
          } else {
            growl.warning("单笔支付不能超过20万", {});
          }
        }
      }
    }
  ]);
});