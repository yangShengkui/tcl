define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';

  controllers.initController('UserClientCtrl', ['$scope', '$routeParams', '$timeout', 'ngDialog', 'distributorUIService', 'userLoginUIService', 'customerUIService',
    'userEnterpriseService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'solutionUIService', 'userUIService', '$location', 'actionService',
    function($scope, $routeParams, $timeout, ngDialog, distributorUIService, userLoginUIService, customerUIService, userEnterpriseService, growl, userRoleUIService,
      userFunctionService, userDomainService, solutionUIService, userUIService, $location, actionService) {
      $scope.userSearch = {};
      var selectedObj = null;

      //客户查询
      $scope.selectedItem = {
        "orCondition": "",
        "customerName": "", //客户姓名
        "customerAddress": "", //客户地址
        "domainPath": "", //客户归属
        "customerPhone": "" //客户电话
      };

      //经销商查询
      $scope.selectedDealItem = {
        "domainPath": "",
        "id": "", //经销商名称id
        "distributorName": "", //经销商名称
        "distributorAddress": "",
        "contactPhone": "",
        "orCondition": ""
      };

      var dealerType = false; //客户默认为空，经销商会置为true
      if(location.hash.search("#/dealerInfo") > -1) {
        dealerType = true;
      };

      $scope.mistakeMesg = { //验证错误信息提示
        email: false,
        phone: false
      };

      //职务
      $scope.$watch("myDicts", function(n, o) {
        if(n) {
          var baseConfig = $scope.baseConfig.contactPosition;
          if(baseConfig != undefined){
            $scope.jobs = baseConfig;
          }else{
            $scope.jobs = $scope.myDicts['jobTitle'];
          }
        }
      })
      //初始数据
      function initData() {
        $scope.inputItem = { //添加客户联系人，客户其他联系人及经销商的联系及其他联系人 //客户及经销商的输入数据
          "userMain": {
            "customerName": "", //客户姓名
            "customerEmail": "", //客户邮箱地址
            "customerPhone": "", //客户电话（座机或手机）
            "customerAddress": "", //客户地址
            "customerContact": "", //客户联系人
            "domainPath": "", //客户所属域
            "duty": "", //职务key
            "values": {},
            "risingTime": new Date()
          },
          "dealer": {
            "domainPath": "",
            "distributorName": "",
            "distributorContact": "", //联系人
            "contactDuty": "",
            "contactPhone": "",
            "email": "",
            "distributorAddress": "",
            "risingTime": new Date()
          },
          "clientOther": {
            "contactName": "", //联系人
            "contactDuty": "", //联系人职务
            "contactPhone": "", //联系电话
            "contactEmail": "" //邮箱地址
          }
        };
      };
      $scope.othercontactlist = []; //存储客户的其他联系人

      $scope.getChange = function(type) {
        if(type == "searchDealer") {
          $scope.selectedDealItem.orCondition = !$scope.queryState ? $scope.selectedDealItem.orCondition : null;
          $scope.selectedDealItem.domainPath = $scope.queryState == 1 ? $scope.selectedDealItem.domainPath : null;
          $scope.selectedDealItem.distributorName = $scope.queryState == 2 ? $scope.selectedDealItem.distributorName : null;
          $scope.selectedDealItem.distributorAddress = $scope.queryState == 3 ? $scope.selectedDealItem.distributorAddress : null;
          $scope.selectedDealItem.contactPhone = $scope.queryState == 4 ? $scope.selectedDealItem.contactPhone : null;
        } else {
          $scope.selectedItem.orCondition = !$scope.queryState ? $scope.selectedItem.orCondition : null;
          $scope.selectedItem.domainPath = $scope.queryState == 1 ? $scope.selectedItem.domainPath : null;
          $scope.selectedItem.customerName = $scope.queryState == 2 ? $scope.selectedItem.customerName : null;
          $scope.selectedItem.customerAddress = $scope.queryState == 3 ? $scope.selectedItem.customerAddress : null;
          $scope.selectedItem.customerPhone = $scope.queryState == 4 ? $scope.selectedItem.customerPhone : null;
        }
      };

      //用户信息
      $scope.userGridData = {
        columns: [{
          title: ($scope.menuitems['S12'] && $scope.menuitems['S12'].label?$scope.menuitems['S12'].label:"客户")+"归属",
          data: "domainPath"
        }, {
          title: ($scope.menuitems['S12'] && $scope.menuitems['S12'].label?$scope.menuitems['S12'].label:"客户")+"名称",
          data: "customerName"
        }, {
          title: "主要联系人",
          data: "customerContact"
        }, {
          title: "联系人职务",
          data: "duty"
        }, {
          title: "联系电话",
          data: "customerPhone"
        }, {
          title: "邮箱地址",
          data: "customerEmail"
        }, {
          title: ($scope.menuitems['S12'] && $scope.menuitems['S12'].label?$scope.menuitems['S12'].label:"客户")+"地址",
          data: "customerAddress",
          "render": function(data, type, full, meta) {
            var addr = data;
            //校验所属区域
            if(full.values != null && full.values != undefined && full.values.standardAddress != null && full.values.standardAddress != undefined) {
              addr = full.values.standardAddress.split(",").join("") + " " + data;
            }
            return addr;
          }
        }, {
          title: "",
          data: "risingTime",
          visible: false
        }, $.ProudSmart.datatable.optionCol3],
        columnDefs: [{
          "targets": 0,
          "data": "domainPath",
          "render": function(data, type, full) {
            var data = escape(data);
            var str = "";
            if(data && $scope.domainListDic[data]) {
              str = $scope.domainListDic[data].label;
            }
            return str;
          }
        }, {
          "targets": 1,
          "data": "customerName",
          "render": function(data, type, full) {
            return escape(data);
          }
        }, {
          "targets": 2,
          "data": "customerContact",
          "render": function(data, type, full) {
            return escape(data);
          }
        }, {
          "targets": 3,
          "data": "duty",
          "render": function(data, type, full) {
            var item = "";
            for(var i in $scope.jobs) {
              if($scope.jobs[i].valueCode == data) {
                item = $scope.jobs[i]['label'];
              }
            }
            return item;
          }
        }, {
          "targets": 4,
          "data": "customerPhone",
          "render": function(data, type, full) {
            return data;
          }
        }, {
          "targets": 5,
          "data": "customerEmail",
          "render": function(data, type, full) {
            return data;
          }
        }, {
          "targets": 6,
          "data": "customerAddress",
          "render": function(data, type, full) {
            //return data;
            var addr = data;
            //校验所属区域
            if(full.values != null && full.values != undefined && full.values.standardAddress != null && full.values.standardAddress != undefined) {
              addr = full.values.standardAddress.split(",").join("") + " " + data;
            }
            return addr;
          }
        }, {
          "targets": 8,
          "data": "option",
          "render": function(data, type, full) {
            var str = "<div class='btn-group btn-group-sm'>";
            if($scope.menuitems['A03_S12']) {
              str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
            }
            if($scope.menuitems['A04_S12']) {
              str += "<button id='del-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
            }
            if($scope.menuitems['A01_S12']) {
              str += "<button  type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
              str += "<ul class='dropdown-menu' role='menu'>";
              if($scope.menuitems['A01_S12']) {
                str += "<li><a  href='#/projectManagement/" + full.id + "'>项目信息</a></li>";
              }
              str += actionService.addmenu("client", full);
              str += '</ul>';
            }
            // str += "<li><a  href='#/facility/customer/" + full.id + "'>设备信息</a></li>";
            str += "</div>";
            return str;

          }
        }]
      };

      $scope.provinceClick = function(provinceId) {
        $scope.inputItem.userMain.county = "";
        if($scope.cityDics[provinceId]) {
          $scope.cityList = $scope.cityDics[provinceId];
        }
      };

      $scope.cityClick = function(cityId) {
        if($scope.districtDics[cityId]) {
          $scope.districtList = $scope.districtDics[cityId];
        }
      };

      //经销商信息
      $scope.dealerGridData = {
        columns: [{
          title: "经销商归属",
          data: "domainPath"
        }, {
          title: "经销商名称",
          data: "distributorName"
        }, {
          title: "联系人",
          data: "distributorContact"
        }, {
          title: "联系人职务",
          data: "contactDuty"
        }, {
          title: "联系电话",
          data: "contactPhone"
        }, {
          title: "邮箱地址",
          data: "email"
        }, {
          title: "经销商地址",
          data: "distributorAddress"
        }, {
          title: "",
          data: "risingTime",
          visible: false
        }, $.ProudSmart.datatable.optionCol3],
        columnDefs: [{
          "targets": 0,
          "data": "domainPath",
          "render": function(data, type, full) {
            if(full.isEdit == 2 && type == "display") {
              return "<div class='dropdowntree select-sm' name='domainPath' key='domainPath' placeholder='请选择...' model='" + data + "' change='' options='domainListTree' mark='nodes' />";;
            } else {
              if(data && $scope.domainDealerListDic[data]) {
                return $scope.domainDealerListDic[data].name;
              } else {
                return "";
              }
            }
          }
        }, {
          "targets": 1,
          "data": "distributorName",
          "render": function(data, type, full) {
            // 返回自定义内容
            if(full.isEdit == 2 && type == "display")
              return "<input class='form-control col-xs-6' type='text'  maxlength='20'  style='border: 1px solid #F18282;width:100%;' value='" + escape(data) + "'>";
            else
              return escape(data);
          }
        }, {
          "targets": 2,
          "data": "distributorContact",
          "render": function(data, type, full) {
            // 返回自定义内容
            if(full.isEdit == 2 && type == "display")
              return "<input class='form-control col-xs-6' type='text'  maxlength='20'  style='border: 1px solid #F18282;width:100%;' value='" + escape(data) + "'>";
            else
              return escape(data);
          }
        }, {
          "targets": 3,
          "data": "contactDuty",
          "render": function(data, type, full) {
            // 返回自定义内容
            if(full.isEdit == 2 && type == "display") {
              var str = '<select class="form-control input-sm " style="border: 1px solid #F18282;width:100%;"><option value=""></option>';
              for(var i in $scope.jobs) {
                if($scope.jobs[i].valueCode == data) {
                  str += '<option value="' + $scope.jobs[i].valueCode + '" selected="selected">' + $scope.jobs[i].label + '</option>';
                }
                str += '<option value="' + $scope.jobs[i].valueCode + '">' + $scope.jobs[i].label + '</option>';
              }
              str += '</select>';
              return str;
            } else {
              for(var i in $scope.jobs) {
                if($scope.jobs[i].valueCode == data) {
                  return $scope.jobs[i].label;
                }
              }

            }
          }
        }, {
          "targets": 4,
          "data": "customerPhone",
          "render": function(data, type, full) {
            // 返回自定义内容
            if(full.isEdit == 2 && type == "display")
              return "<input class='form-control col-xs-6' type='text'style='border: 1px solid #F18282;width:100%;' value='" + data + "'>";
            else
              return data;
          }
        }, {
          "targets": 5,
          "data": "email",
          "render": function(data, type, full) {
            // 返回自定义内容
            if(full.isEdit == 2 && type == "display")
              return "<input class='form-control col-xs-6' style='width:100%;border: 1px solid #F18282;width:100%;' type='text'  value='" + data + "'>";
            else
              return data;
          }
        }, {
          "targets": 6,
          "data": "distributorAddress",
          "render": function(data, type, full) {
            // 返回自定义内容
            if(full.isEdit == 2 && type == "display")
              return "<input class='form-control col-xs-6' style='width:100%;border: 1px solid #F18282;width:100%;' type='text'  value='" + data + "'>";
            else
              return data;
          }
        }, {
          "targets": 8,
          "data": "option",
          "render": function(data, type, full) {
            if(full.isEdit == 2 && type == "display") {
              return "<a id='save-btn' class='btn btn-primary btn-sm'>  <i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i> <span class='hidden-xs'> 保存</span></a><a id='cancel-btn' class='btn btn-default btn-sm' > <i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span>  </a>";
            } else {
              var str = "<div class='btn-group btn-group-sm'>";
              if ($scope.menuitems['A03_S46']) {
                str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
              }
              if ($scope.menuitems['A04_S46']) {
                str += "<button id='del-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span id='block'>删除</span></button>";
              }
              if($scope.menuitems['A01_S46']) {
                str += "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                str += "<ul class='dropdown-menu' role='menu'>";
                if($scope.menuitems['A01_S46']) {
                  str += "<li><a  href='#/projectManagement////" + full.id + "'>项目信息</a></li></ul>";
                }
              }
              str += "</div>";
              return str;
            }
          }
        }]
      };

      //客户其他联系人操作
      $scope.inputFun = {
        addOther: function() {
          $scope.mistakeMesg.email = false;
          $scope.mistakeMesg.phone = false;
          if($scope.othercontactlist && $scope.othercontactlist.length >= 5) {
            growl.error("其他联系人最多只能添加5个人", {});
            return;
          }
          $scope.inputItem.clientOther.contactName = "";
          $scope.inputItem.clientOther.contactDuty = "";
          $scope.inputItem.clientOther.contactPhone = "";
          $scope.inputItem.clientOther.contactEmail = "";
          $scope.inputItem.clientOther.id = -1;
          ngDialog.open({
            template: '../partials/dialogue/client_other_dia.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });
        },
        saveOther: function() {
          if($scope.mistakeMesg.phone) {
            growl.warning("请正确填写联系电话", {});
            return;
          }
          if($scope.mistakeMesg.email) {
            growl.warning("请正确填写联系邮箱", {});
            return;
          }
          var inputOther = $scope.inputItem.clientOther;
          if(inputOther.id == -1) { //新加
            var newObj = {
              "contactName": inputOther.contactName,
              "contactDuty": inputOther.contactDuty,
              "contactPhone": inputOther.contactPhone,
              "contactEmail": inputOther.contactEmail,
              'id': 0,
              "createTime": new Date()
            };
            $scope.othercontactlist.unshift(newObj);
          }
          if(inputOther.isEdit == 3) { //编辑
            if(inputOther.id == 0) { //本地
              $scope.othercontactlist.forEach(function(item) {
                if(item.createTime == inputOther.createTime) {
                  $.extend(item, inputOther);
                }
              })
            } else if(inputOther.id > 0) {
              $scope.othercontactlist.forEach(function(item) {
                if(item.id == inputOther.id) {
                  $.extend(item, inputOther);
                }
              })
            }
            for(var i in $scope.othercontactlist) {
              if($scope.othercontactlist[i].isEdit == 3) {
                delete $scope.othercontactlist[i].isEdit;
              }
            }
          }

          $timeout(function() {
            $scope.$broadcast(Event.CLIENTMANAGEINIT + '_Other', $scope.othercontactlist);
          });
          ngDialog.close();
        },

        doActionOther: function(type, select, callback) {
          if(type == "cancel") {
            for(var i = $scope.othercontactlist.length - 1; i > -1; i--) {
              if(select.createTime && ($scope.othercontactlist[i].createTime == select.createTime)) {
                $scope.othercontactlist.splice(i, 1);
              } else if(!select.createTime && select.id && ($scope.othercontactlist[i].id == select.id)) {
                $scope.othercontactlist.splice(i, 1);
              } else {
                $scope.othercontactlist[i]["isEdit"] = 0;
              }
            }
            $scope.$broadcast(Event.CLIENTMANAGEINIT + '_Other', $scope.othercontactlist);
          } else if(type == 'save') {
            if(callback) {
              callback();
            }
          } else if(type == 'delete') {
            for(var i in $scope.othercontactlist) {
              if(select.createTime && ($scope.othercontactlist[i].createTime == select.createTime)) {
                $scope.othercontactlist.splice(i, 1);
                $scope.$apply();
                if(callback) {
                  callback(true);
                }
                return;
                // growl.success("其他联系人已删除", {});
                // $scope.saveUser('saveClient'); 本地删除不需要调用保存信息
              }
            }
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              message: '确定删除该联系人记录？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  for(var i in $scope.othercontactlist) {
                    // if (select.createTime && ($scope.othercontactlist[i].createTime == select.createTime)) {
                    //   $scope.othercontactlist.splice(i, 1);
                    //   $scope.$apply();
                    //   // growl.success("其他联系人已删除", {});
                    //   // $scope.saveUser('saveClient'); 本地删除不需要调用保存信息
                    // } else 
                    if(!select.createTime && select.id && ($scope.othercontactlist[i].id == select.id)) {
                      $scope.othercontactlist.splice(i, 1);
                      $scope.saveUser('saveClientOther');
                    }
                  }
                  if(callback) {
                    callback(true);
                  }
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
        }
      };

      //添加
      $scope.addUser = function(type) {
        if(type == "addDealer") {
          initData();
          ngDialog.open({
            template: '../partials/dialogue/dealer_info_dia.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });
        } else {
          location.href = "#/userclient//0";
        }
      };

      //保存
      $scope.saveUser = function(type, flg) {
        var dealerInfo = $scope.inputItem.dealer;
        if(type == 'saveDealer') {
          if($scope.mistakeMesg.phone) {
            growl.warning("请正确输入座机或手机号", {});
            return;
          }
          if($scope.mistakeMesg.email) {
            growl.warning("请正确输入邮箱地址", {});
            return;
          }

          if(dealerInfo.id > 0) {
            distributorUIService.updateDistributor(dealerInfo, function(returnObj) {
              if(returnObj.code == 0) {
                growl.success("经销商信息修改完成", {});
                var dealerLists = $scope.dealerGridData.data;
                for(var i in dealerLists) {
                  if(dealerLists[i].id == dealerInfo.id) {
                    $.extend(dealerLists[i], dealerInfo);
                    break;
                  }
                }
                broadInfo('dealer');
                ngDialog.close();
                return;
              }
            })
          } else {
            distributorUIService.addDistributor($scope.inputItem.dealer, function(returnObj) {
              if(returnObj.code == 0) {
                growl.success("经销商信息添加成功", {});
                returnObj.data['isEdit'] = 0;
                $scope.dealerGridData.data.push(returnObj.data);
                broadInfo('dealer');
                ngDialog.close();
                return;
              }
            });
          }

        } else if(type == 'saveClientOther') { ////编辑客户时，删除已存数据库其他联系人，需保存
          var newObj = {};
          if(selectedObj && $routeParams.id == 0) {
            newObj.id = selectedObj.id;
          } else {
            newObj.id = $routeParams.type;
          }

          $.extend(newObj, $scope.inputItem.userMain); //同上
          newObj.otherContacts = $scope.othercontactlist; //同上
          getAddressPoint(newObj,function(newObj) {
            customerUIService.updateCustomer(newObj, function(returnObj) {
              if(returnObj.code == 0) {
                growl.success("其他联系人已删除", {});
                $timeout(function() {
                  $scope.othercontactlist = returnObj.data.otherContacts;
                  $scope.$broadcast(Event.CLIENTMANAGEINIT + '_Other', $scope.othercontactlist);
                });
                return;
              }
            })
          })
          
        } else if(type = 'saveClient') {
          var item = $scope.inputItem.userMain;
          var mainlabel = $scope.menuitems['S12'] && $scope.menuitems['S12'].label?$scope.menuitems['S12'].label:'客户'
          if($scope.inputItem.userMain.values == undefined || $scope.inputItem.userMain.values == null) {
            $scope.inputItem.userMain.values = {};
          }
          $scope.inputItem.userMain.values.standardAddress = item.county ? item.county : (item.city ? item.city : (item.province));

          if(!$scope.inputItem.userMain.domainPath) {
            growl.warning("请选择"+mainlabel+"归属", {});
            return;
          }
          if(!$scope.inputItem.userMain.customerName) {
            growl.warning("请输入"+mainlabel+"名称", {});
            return;
          }
          if(!$scope.inputItem.userMain.customerContact) {
            growl.warning("请输入主要联系人", {});
            return;
          }
          if(!$scope.inputItem.userMain.duty) {
            growl.warning("请选择联系人职务", {});
            return;
          }
          if(!$scope.inputItem.userMain.customerPhone) {
            growl.warning("请输入联系人电话", {});
            return;
          }
          if($scope.mistakeMesg.userphone) {
            growl.warning("请正确填写联系人电话", {});
            return;
          }
          // if (!$scope.inputItem.userMain.customerEmail) {
          //   growl.warning("请输入联系人邮箱地址", {});
          //   return;
          // }
          if($scope.inputItem.userMain.customerEmail && $scope.mistakeMesg.useremail) {
            growl.warning("请输入正确的邮箱地址", {});
            return;
          }
          if(!$scope.inputItem.userMain.values.standardAddress) {
            growl.warning("请选择所属区域", {});
            return;
          }
          /*if (!$scope.inputItem.userMain.customerAddress) {
            growl.warning("请输入客户详细地址", {});
            return;
          }*/

          if($routeParams.id == 0 && !selectedObj) {
            var param = {};
            $.extend(param, $scope.inputItem.userMain); // $scope.inputItem.userMain 包含原始$scope.othercontactlist信息，所以将修改的 $scope.othercontactlist置下赋值
            param.otherContacts = $scope.othercontactlist; //与上代码不能调换位置
            getAddressPoint(param,function(param) {
              customerUIService.addCustomer(param, function(returnObj) {
                if(returnObj.code == 0) {
                  growl.success(mainlabel+"添加成功", {});
                  selectedObj = returnObj.data; //客户新增保存再保存
                  $scope.userGridData.data.push(returnObj.data);
                  broadInfo('client', 'other');
                  $location.url("/userclient/" + returnObj.data.id);
                  $location.replace();
                  return;
                }
              })
            })
          } else {
            var obj = {};
            if($routeParams.id == 0 && selectedObj) {
              obj.id = selectedObj.id;
            } else {
              obj.id = $routeParams.type;
            }

            $.extend(obj, $scope.inputItem.userMain); //同上
            obj.otherContacts = $scope.othercontactlist; //同上
            getAddressPoint(obj,function(obj) {
              customerUIService.updateCustomer(obj, function(returnObj) {
                if(returnObj.code == 0) {
                  growl.success(mainlabel+"信息修改完成", {});
                  var data = $scope.userGridData.data;
                  for(var i in data) {
                    if(data[i].id == obj.id) {
                      $.extend(data[i], returnObj.data);
                    }
                  }
                  broadInfo('client', 'other');
                  $scope.othercontactlist = returnObj.data.otherContacts;
                  $timeout(function() {
                    $scope.$broadcast(Event.CLIENTMANAGEINIT + '_Other', $scope.othercontactlist);
                  });
                  return;
                }
              })
            })
          }
          if(flg == "createUser") {
            var baseDomain = $scope.domainListDic[$scope.inputItem.userMain.domainPath];
            if(!baseDomain) {
              growl.warning("无法创建"+mainlabel+"用户", {});
              return;
            }
            userDomainService.addDomain(baseDomain.id, { name: $scope.inputItem.userMain.customerName, description: "", values: { standardAddress: $scope.inputItem.userMain.values.standardAddress } }, function(returnObj) {
              if(returnObj.code == 0) {
                var newUser = {};
                newUser.userType = $scope.baseConfig.customerConfig.typeCode ? $scope.baseConfig.customerConfig.typeCode : 100;
                newUser.status = 0;
                newUser.userName = $scope.inputItem.userMain.customerContact;
                newUser.loginName = $scope.inputItem.userMain.customerPhone;
                newUser.mobilePhone = $scope.inputItem.userMain.customerPhone;
                var domain = {
                  userID: "",
                  domainID: returnObj.data.id,
                  domainPath: returnObj.data.domainPath,
                  name: returnObj.data.name
                };
                var role = [{ "roleID": $scope.baseConfig.customerConfig.role ? $scope.baseConfig.customerConfig.role : 102 }];
                userUIService.enterpriseUserRegister(newUser, domain, role, function(returnObj) {
                  growl.success(mainlabel+"的用户添加成功", {});
                });
              }
            });
          }
        }
      };

      //客户操作
      $scope.doAction = function(type, select, callback) {
        if(type == "delete") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除该记录？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                customerUIService.deleteCustomerById(select.id, function(resultObj) {
                  callback(resultObj.code);
                  if(resultObj.code == 0) {
                    growl.success("记录已删除", {});
                  }
                });
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                dialogRef.close();
              }
            }]
          });
        } else if(type == "editClient") {
          location.href = "#/userclient/" + $.trim(select.id) + "/";

        }
      };

      //经销商操作
      $scope.doDealerAction = function(type, select, callback) {
        if(type == "cancel") {
          for(var i = $scope.dealerGridData.data.length - 1; i > -1; i--) {
            if($scope.dealerGridData.data[i].id == 0) {
              $scope.dealerGridData.data.splice(i, 1);
            } else {
              // $scope.dealerGridData.data[i]["isEdit"] = 0;
            }
          }
          broadInfo('dealer');
        } else if(type == "save") {
          // distributorUIService.updateDistributor(select, function(returnObj) {
          //   callback(returnObj.code);
          //   if (returnObj.code == 0) {
          //     growl.success("经销商信息修改完成", {});
          //     return;
          //   } else {
          //     var str = returnObj.message;
          //     growl.error(str, {});
          //   }
          // })
        } else if(type == "delete") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除该经销商记录？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                distributorUIService.deleteDistributorById(select.id, function(returnObj) {
                  callback(returnObj.code);
                  if(returnObj.code == 0) {
                    var dealerLists = $scope.dealerGridData.data;
                    for(var j in dealerLists) {
                      if(dealerLists[j].id == select.id) {
                        dealerLists.splice(j, 1);
                      }
                    }
                    growl.success("经销商信息已删除", {});
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
      }

      function broadInfo(value, type) {
        if(value == "client" && type == "other") {
          $timeout(function() {
            $scope.$broadcast(Event.CLIENTMANAGEINIT, $scope.userGridData);
          })
        } else if(value == "dealer") {
          $timeout(function() {
            $scope.$broadcast(Event.CLIENTMANAGEINIT + "_dealer", $scope.dealerGridData);
          })
        }
      };

      //查询
      $scope.searchData = function(type) {
        if(type == "searchDealer") {
          var param = {
            "orCondition": "" ? "" : $scope.selectedDealItem.orCondition,
            "distributorName": "" ? "" : $scope.selectedDealItem.distributorName,
            "distributorAddress": "" ? "" : $scope.selectedDealItem.distributorAddress,
            "domainPath": "" ? "" : $scope.selectedDealItem.domainPath,
            "contactPhone": "" ? "" : $scope.selectedDealItem.contactPhone
          };
          distributorUIService.findDistributorsByCondition(param, function(returnObj) {
            if(returnObj.code == 0) {
              $scope.dealerGridData.data = returnObj.data;
              broadInfo('dealer');
            }
          })
        } else {
          var param = {
            "id": "" ? "" : $routeParams.type,
            "orCondition": "" ? "" : $scope.selectedItem.orCondition,
            "customerName": "" ? "" : $scope.selectedItem.customerName,
            "customerAddress": "" ? "" : $scope.selectedItem.customerAddress,
            "domainPath": "" ? "" : $scope.selectedItem.domainPath,
            "customerPhone": "" ? "" : $scope.selectedItem.customerPhone
          };
          customerUIService.findCustomersByCondition(param, function(returnObj) {
            if(returnObj.code == 0) {
              $scope.userGridData.data = returnObj.data;
              if($routeParams.type) {
                $scope.inputItem.userMain = returnObj.data[0];
                if($scope.inputItem.userMain.values.standardAddress) {
                  var arr = $scope.inputItem.userMain.values.standardAddress.split(",");
                  $scope.inputItem.userMain.province = arr[0];
                  if(arr[1]) {
                    $scope.inputItem.userMain.city = arr[0]+","+arr[1];
                  }
                  if(arr[2]) {
                    $scope.inputItem.userMain.county = $scope.inputItem.userMain.values.standardAddress;
                  }
                  /**
                    取消地址的这种取法，直接从全局中获得，请熟悉这种使用方式。
                  if(arr[1]) {
                    $scope.inputItem.userMain.city = $scope.cityDics[arr[0]].find(function(item) {
                      return arr[1] == item.label;
                    }).id;
                  }
                  if(arr[2]) {
                    $scope.inputItem.userMain.county = $scope.districtDics[$scope.inputItem.userMain.city].find(function(item) {
                      return arr[2] == item.label;
                    }).id;
                  }
                  
                  $scope.cityList = $scope.cityDics[arr[0]];
                  $scope.districtList = $scope.districtDics[$scope.inputItem.userMain.city];
                  */
                } else {
                  $scope.inputItem.userMain.province = "";
                  $scope.inputItem.userMain.city = "";
                  $scope.inputItem.userMain.county = "";
                };
                $scope.othercontactlist = returnObj.data[0].otherContacts;
                $timeout(function() {
                  $scope.$broadcast(Event.CLIENTMANAGEINIT + '_Other', $scope.othercontactlist);
                });
              }
              broadInfo('client', 'other');
            }
          })
        }
      };

      //验证信息
      $scope.verifyFun = function(value, type, user) {
        var reg, r;
        if(type == "phone") {
          var isMob = /^((1[34578]\d{9})|(0\d{2,4}\-\d{7,8})|\d{8})$/;
          r = isMob.test(value);
          if(!r) {
            if(user == 'user') {
              $scope.mistakeMesg.userphone = true;
            } else {
              if(!value) {
                $scope.mistakeMesg.phone = false;
              } else {
                $scope.mistakeMesg.phone = true;
              }
            }
          } else {
            if(user == 'user') {
              $scope.mistakeMesg.userphone = false;
            } else {
              $scope.mistakeMesg.phone = false;
            }
          }
        } else if(type == "email") {
          reg = /^[a-zA-Z0-9_-].+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          r = reg.test(value);
          if(!r) {
            if(user == 'user') {
              $scope.mistakeMesg.useremail = true;
            } else {
              if(!value) {
                $scope.mistakeMesg.email = false;
              } else {
                $scope.mistakeMesg.email = true;
              }
            }
          } else {
            if(user == 'user') {
              $scope.mistakeMesg.useremail = false;
            } else {
              $scope.mistakeMesg.email = false;
            }

          }
        }
      };

      //特殊符号过滤
      var stripscript = function(str) {
        var pattern = new RegExp("[<>/]")
        var rs = "";
        for(var i = 0; i < str.length; i++) {
          rs = rs + str.substr(i, 1).replace(pattern, '');
        }
        return rs;
      };

      //弹出框的关闭事件
      $scope.closeDialog = function() {
        ngDialog.close();

      };

      //根据用户Id查用户域
      var domainTreeQuery = function(callbackFun) {
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function(data) {
          $scope.domainListTree = data.domainListTree;
          $scope.domainListDic = data.domainListDic;
          if(callbackFun)
            callbackFun();
        });
      };

      //根据用户Id查经销商域
      var queryEnterpriseDomainTree = function(callbackFun) {
        userDomainService.queryEnterpriseDomainTree(userLoginUIService.user.userID, function(data) {
          $scope.domainDealerListTree = data.domainListTree;
          $scope.domainDealerListDic = data.domainListDic;
          if(callbackFun)
            callbackFun();
        });
      };

      //初始数据
      var init = function() {
        initData();
        if(dealerType) {
          queryEnterpriseDomainTree(function() {
            $scope.searchData('searchDealer');
          })
        } else {
          domainTreeQuery(function() {
            $scope.searchData();
          });
        }

        //新加客户，其他联系人一栏默认数据为空
        if($routeParams.id == 0 && !$routeParams.type) {
          $timeout(function() {
            $scope.$broadcast(Event.CLIENTMANAGEINIT + '_Other', []);
          });
        }
      };
      var getAddressPoint = function(inputObj,callbackFun) {
        inputObj.values.latitude = "";
        inputObj.values.longitude = "";
        userLoginUIService.getAddressPoint(inputObj.values.standardAddress.split(",").join("")+inputObj.customerAddress,function(address) {
          inputObj.values.latitude = address.location.lat.toFixed(6);
          inputObj.values.longitude = address.location.lng.toFixed(6);
          if (callbackFun) {
            callbackFun(inputObj);
          }
        })
      }
      //判断用户是否存在
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }

    }
  ]);
  controllers.initController('userSupplierCtrl', ['$scope', 'userLoginUIService', 'userEnterpriseService', 'userUIService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'marketplaceUIService',
    function($scope, userLoginUIService, userEnterpriseService, userUIService, growl, userRoleUIService, userFunctionService, userDomainService, marketplaceUIService) {
      $scope.userSearch = {};
      var button = "";

      //用户管理
      $scope.userGridData = {
        columns: [{
          title: "供应商名称",
          data: "supplierName"
        }, {
          title: "供应商联系人",
          data: "supplierContact"
        }, {
          title: "联系方式（手机/邮箱）",
          data: "supplierEmail"
        }, {
          title: "联系地址",
          data: "supplierAddress"
        }, {
          title: "供应商状态",
          data: "supplierStatus"
        }],
        columnDefs: []
      }
      //用户管理数据初始化
      $scope.getDBdata = function(userInfo) {
        //客户管理
        userEnterpriseService.querySupplier(function(resultObj) {
          if(resultObj.code == 0) {
            for(var i in resultObj.data) {
              var obj = resultObj.data[i];
              obj.isEdit = 0;
              if(obj.supplierEmail == null || obj.supplierEmail == "") {
                obj["supplierEmail"] = obj.supplierPhone;
              } else {
                obj["supplierEmail"] = obj.supplierEmail;
              }
            }
            $scope.userGridData.data = resultObj.data;
            $scope.$broadcast(Event.SUPPLIERMANAGEINIT, $scope.userGridData);
          }
        });
      }

      //判断用户是否存在
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            $scope.getDBdata({});
          }
        });
      } else {
        $scope.getDBdata({});
      }
    }
  ]);

});