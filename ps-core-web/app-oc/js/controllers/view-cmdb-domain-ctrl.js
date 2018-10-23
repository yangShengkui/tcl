define(['controllers/controllers', 'bootstrap-dialog', 'Array'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('ViewCmdbDomainCtrl', ['$scope', '$location', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService',
    'SwSocket', 'Info', 'viewFlexService', 'unitService', 'growl', 'userDomainService', 'userEnterpriseService', 'dialogue',
    function($scope, $location, $routeParams, $timeout, kpiDataService, userLoginUIService, resourceUIService, alertService,
      SwSocket, Info, viewFlexService, unitService, growl, userDomainService, userEnterpriseService, dialogue) {
      console.info("切换到域管理");
      var domainId = $routeParams.label;
      var domainList;
      var treeToArr = function(tree){
        var rs = [];
        var traverse = function(children){
          var loop = function(child){
            rs.push(child);
            if(child.children){
              traverse(child.children);
            }
          };
          for(var i in children){
            loop(children[i])
          }
        };
        traverse(tree);
        return rs;
      };
      var createTree = function(data){
        var rs;
        var loop = function(item){
          var parentID = item.parentID;
          var parent = data.find(function(elem){
            return parentID == elem.id;
          });
          if(parentID != 0){
            if(parent && parent != undefined){
              if(parent.children == undefined){
                parent.children = [];
              }
              item.parent = parent;
              Object.defineProperty(item, "parent", {enumerable : false});
              parent.children.push(item)
            }else{//现在存在一个情况有父id没有父
              item.parent = null;
              Object.defineProperty(item, "parent", {enumerable : false});
              rs = item;
            }
          } else {
            item.parent = null;
            Object.defineProperty(item, "parent", {enumerable : false});
            rs = item;
          }
        };
        for(var i in data){
          loop(data[i])
        }
        return rs;
      };
      $scope.startSearch = function(){
        var dlist = treeToArr([$scope.treeData]);
        var listData = dlist.filter(function(elem){
          return elem.name.indexOf($scope.query) != -1;
        });
        if($scope.query != '' && $scope.query != undefined){
          $scope.$broadcast("SEARCHDATA", listData);
        } else {
          $scope.$broadcast("RENDERDATA");
        }
      };
      var init = function() {
        /** 查询企业域目录 */
        var domainHandler = function (returnObj) {
          if(returnObj.code == 0) {
            domainList = returnObj.data;
            if(domainId){
              var treeList = [];
              for(var i in domainList){
                if(domainList[i].id == domainId){
                  treeList = domainList[i];
                  break;
                }
              }
              $scope.treeData = treeList;
            }else{
              $scope.treeData = createTree(domainList);
            }
          }
        };
        if (!$scope.menuitems["isloaded"]) {
          var menuitemsWatch = $scope.$watch('menuitems', function(o, n) {
            if ($scope.menuitems["isloaded"]) {
              if ($scope.baseConfig.extendDomain) {
                resourceUIService.getDomainsByFilter({},domainHandler);
              } else {
                userEnterpriseService.findEnterpriseDomain(domainHandler);
              }
              menuitemsWatch();
            }
          },true)
        } else if ($scope.baseConfig.extendDomain) {
          resourceUIService.getDomainsByFilter({},domainHandler);
        } else {
          userEnterpriseService.findEnterpriseDomain(domainHandler);
        }
      };

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
});