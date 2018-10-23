define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('userDomainService', ['serviceProxy',
    function(serviceProxy) {
      var serviceNm = 'userDomainService',
        service = {};
      /**
       * 查看域信息
       */
      service.queryDomainInfo = function(domianId, callBack) {
        serviceProxy.get(serviceNm, "queryDomainInfo", domianId, callBack);
      };

      /**
       * 修改域信息
       */
      service.modifyDomain = function(param, callBack) {
        serviceProxy.get(serviceNm, "modifyDomain", param, callBack);
      };

      /**
       * 添加域
       */
      service.addDomain = function(domainID, domain, callBack) {
        serviceProxy.get(serviceNm, "addDomain", [domainID, domain], callBack);
      };

      /**
       * 移除域
       */
      service.deleteDomain = function(domainID, domainPath, callBack) {
        serviceProxy.get(serviceNm, "deleteDomain", [{
          "id": domainID,
          "domainPath": domainPath
        }], callBack);
      };

      /**
       * 查看域关联的用户
       */
      service.getAssociateDomain2User = function(domainPath, callBack) {
        serviceProxy.get(serviceNm, "getAssociateDomain2User", domainPath, callBack);
      };

      /**
       * 给用户添加域
       */
      service.addDomain2User = function(domain, userID, callBack) {
        serviceProxy.get(serviceNm, "addDomain2User", [domain, userID], callBack);
      };

      /**
       * 资源域管理 给用户添加域
       */
      service.addDomainUser = function(domain, userID, callBack) {
        serviceProxy.get(serviceNm, "addDomainUser", [domain, userID], callBack);
      };

      /**
       * 删除资源域时查询是否可以删除
       */
      service.queryDeleteDomain = function(domain, callBack) {
        serviceProxy.get(serviceNm, "queryDeleteDomain", domain, callBack);
      };
      /**
       * 根据设备id切换域
       */
      service.queryDomainTreeByDomainPath = function(deviceId, callBack) {
        serviceProxy.get(serviceNm, "queryDomainTreeByDomainPath", deviceId, function(returnObj) {
          var domainListDic = {};
          var domainListTree;
          var dom = [];
          var newObj = {
            parentID: "",
            domainPath: "",
            name: "",
            description: "",
            domains: returnObj.data
          }
          dom.push(newObj);
          var menu_list = service.initTreeview(dom[0], domainListDic);
          domainListTree = menu_list.nodes;
          returnObj.domainListDic = domainListDic;
          returnObj.domainListTree = domainListTree;
          if (callBack) {
            callBack(returnObj);
          }
        });
      };

      /**
       * 删除用户的一个域
       */
      service.deleteDomain2User = function(domainID, userID, callBack) {
        serviceProxy.get(serviceNm, "deleteDomain2User", [{
          "id": domainID
        }, userID], callBack);
      };

      /**
       * 切换用户的一个域
       */
      service.changeDomain = function(userID, newDomainID, newDomainPath, oldDomainID, callBack) {
        serviceProxy.get(serviceNm, "changeDomain", [userID, {
          "id": newDomainID,
          "domainPath": newDomainPath
        }, oldDomainID], callBack);
      }

      /**
       * 查看用户下域信息
       */
      service.queryDomainByUser = function(userId, callBack) {
        serviceProxy.get(serviceNm, "queryDomainByUser", userId, callBack);
      };

      /**
       * 根据用户查域的树 
       */
      service.queryDomainTreeByUser = function(userId, callBack) {
        serviceProxy.get(serviceNm, "queryDomainTreeByUser", userId, callBack);
      };

      /**
       * 查看域的树 
       */
      service.initTreeview = function(obj, domainListDic) {
        if (obj.domainInfos || obj.sonDomains) {
          if (!obj.domainInfos) obj.domainInfos = obj.sonDomains
          obj.nodes = [];
          for (var i in obj.domainInfos) {
            obj.nodes.push(service.initTreeview(obj.domainInfos[i], domainListDic));
          }
          obj.tags = [obj.nodes.length]
        }
        if (obj.belong == 1) {
          obj.state = {
            checked: true
          }
        } else {
          obj.state = {
            checked: false
          }
        }
        obj.text = obj.name;
        obj.icon = "ion ion-ios-color-filter";
        domainListDic[obj.domainPath] = obj;
        if (obj.id)
          domainListDic[obj.id] = obj;
        else
          domainListDic[0] = obj;
        return obj;
      }
      service.queryDomainTree = function(userId, callBack) {
        serviceProxy.get(serviceNm, "queryDomainTree", userId, function(returnObj) {
          if (returnObj.code != 0) return;
          var domainListDic = {};
          var domainListTree;
          var dom = [];
          var newObj = {
            parentID: "",
            domainPath: "",
            name: "",
            description: "",
            domainInfos: returnObj.data
          }
          dom.push(newObj);
          var menu_list = service.initTreeview(dom[0], domainListDic);
          domainListTree = menu_list.nodes;
          returnObj.domainListDic = domainListDic;
          returnObj.domainListTree = domainListTree;
          if (callBack) {
            callBack(returnObj);
          }
        });
      };

      //经销商树
      service.queryEnterpriseDomainTree = function(userId, callBack) {
        serviceProxy.get(serviceNm, "queryEnterpriseDomainTree", userId, function(returnObj) {
          var domainListDic = {};
          var domainListTree;
          var dom = [];
          var newObj = {
            parentID: "",
            domainPath: "",
            name: "",
            description: "",
            domainInfos: returnObj.data
          }
          dom.push(newObj);
          var menu_list = service.initTreeview(dom[0], domainListDic);
          domainListTree = menu_list.nodes;
          returnObj.domainListDic = domainListDic;
          returnObj.domainListTree = domainListTree;
          if (callBack) {
            callBack(returnObj);
          }
        });
      };

      return service;
    }
  ]);
});
