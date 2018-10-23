define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
controllers.initController('contractCtrl', ['$scope', 'userLoginUIService', 'userEnterpriseService', 'userUIService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'marketplaceUIService',
    function($scope, userLoginUIService, userEnterpriseService, userUIService, growl, userRoleUIService, userFunctionService, userDomainService, marketplaceUIService) {

      $scope.contractGridData = {
        columns: [{
          title: "合同编号",
          data: "contractNum"
        }, {
          title: "客户名称",
          data: "clientNname"
        }, {
          title: "合同名称",
          data: "contractNname"
        }, {
          title: "合同类型",
          data: "contractType"

        }, {
          title: "签订日期",
          data: "qianding"

        }, {
          title: "生效日期",
          data: "sheng"

        }, {
          title: "失效日期",
          data: "shi"

        }, {
          title: "操作",
          orderable:false,
          data: "option"

        }],
        columnDefs: []
      }
      userEnterpriseService.querySupplier(function(resultObj) {
        if (resultObj.code == 0) {
          for (var i in resultObj.data) {
            var obj = resultObj.data[i];
            obj.isEdit = 0;
            if (obj.supplierEmail == null || obj.supplierEmail == "") {
              obj["supplierEmail"] = obj.supplierPhone;
            } else {
              obj["supplierEmail"] = obj.supplierEmail;
            }
          }
          $scope.contractGridData.data = [];
          $scope.$broadcast(Event.USERINFOSINIT+"_contract", $scope.contractGridData);
        }
      });

    }
  ]);
controllers.initController('maintainCtrl', ['$scope', 'userLoginUIService', 'userEnterpriseService', 'userUIService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'marketplaceUIService',
    function($scope, userLoginUIService, userEnterpriseService, userUIService, growl, userRoleUIService, userFunctionService, userDomainService, marketplaceUIService) {
      $scope.contractGridData = {
        columns: [{
          title: "计划名称",
          data: "contractNum"
        }, {
          title: "客户名称",
          data: "clientNname"
        }, {
          title: "计划类型",
          data: "contractNname"
        }, {
          title: "维保类型",
          data: "contractType"

        }, {
          title: "维保项目",
          data: "qianding"

        }, {
          title: "维保人员",
          data: "sheng"

        }, {
          title: "操作",
          orderable:false,
          data: "option"

        }],
        columnDefs: []
      }
      userEnterpriseService.querySupplier(function(resultObj) {
        if (resultObj.code == 0) {
          for (var i in resultObj.data) {
            var obj = resultObj.data[i];
            obj.isEdit = 0;
            if (obj.supplierEmail == null || obj.supplierEmail == "") {
              obj["supplierEmail"] = obj.supplierPhone;
            } else {
              obj["supplierEmail"] = obj.supplierEmail;
            }
          }
          $scope.contractGridData.data = [];
          $scope.$broadcast(Event.USERINFOSINIT+"_maintain", $scope.contractGridData);
        }
      });

    }
  ]);
controllers.initController('loreCtrl', ['$scope', 'userLoginUIService', 'userEnterpriseService', 'userUIService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'marketplaceUIService',
    function($scope, userLoginUIService, userEnterpriseService, userUIService, growl, userRoleUIService, userFunctionService, userDomainService, marketplaceUIService) {
      $scope.contractGridData = {
        columns: [{
          title: "标题",
          data: "contractNum"
        }, {
          title: "分类",
          data: "clientNname"
        }, {
          title: "描述",
          data: "contractNname"
        }, {
          title: "创建时间",
          data: "contractType"

        }, {
          title: "维护时间",
          data: "qianding"

        }, {
          title: "操作",
          orderable:false,
          data: "option"

        }],
        columnDefs: []
      }
      userEnterpriseService.querySupplier(function(resultObj) {
        if (resultObj.code == 0) {
          for (var i in resultObj.data) {
            var obj = resultObj.data[i];
            obj.isEdit = 0;
            if (obj.supplierEmail == null || obj.supplierEmail == "") {
              obj["supplierEmail"] = obj.supplierPhone;
            } else {
              obj["supplierEmail"] = obj.supplierEmail;
            }
          }
          $scope.contractGridData.data = [];
          $scope.$broadcast(Event.USERINFOSINIT+"_lore", $scope.contractGridData);
        }
      });

    }
  ]);
});