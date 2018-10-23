define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('energyConsumeUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'energyConsumeUIService',
        factory = {};

      //==========================   企业信息管理   ===============================================  
      //新加企业
      factory.addEnterpriseInfo = function(param, callback) {
        serviceProxy.get(service, 'addEnterpriseInfo', param, callback);
      };

      //批量删除企业
      factory.deleteEnterpriseInfo = function(idAry, callback) {
        serviceProxy.get(service, 'deleteEnterpriseInfo', idAry, callback);
      };

      //更新修改企业
      factory.updateEnterpriseInfo = function(param, callback) {
        serviceProxy.get(service, 'updateEnterpriseInfo', param, callback);
      };

      //查询企业信息
      factory.findEnterpriseInfosByCondition = function(param, callback) {
        serviceProxy.get(service, 'findEnterpriseInfosByCondition', param, function(returnObj) {
          if (returnObj.code == 0) {
            var enterpriseDic = {};
            for (var i in returnObj.data) {
              enterpriseDic[returnObj.data[i]['id']] = returnObj.data[i];
            }
            returnObj.enterpriseDic = enterpriseDic;
            if (callback) {
              callback(returnObj);
            }
          }
        });
      };

      //======================================   查询企业信息   ============================  
      factory.findEnterpriseInfos = function(callback) {
        serviceProxy.get(service, 'findEnterpriseInfos', [], callback);
      };

      //根据企业id查企业信息
      factory.findEnterpriseInfoById = function(id, callback) {
        serviceProxy.get(service, 'findEnterpriseInfoById', id, callback);
      };

      //根据企业path查企业信息
      factory.findEnterpriseInfoByDomainPath = function(domainPath, callback) {
        serviceProxy.get(service, 'findEnterpriseInfoByDomainPath', domainPath, callback);
      };


      //==========================   能耗节点管理   ===============================================  
      //新加能耗节点
      factory.addDomain = function(param, callback) {
        serviceProxy.get(service, 'addDomain', param, callback);
      };

      //批量删除能耗节点
      factory.deleteDomainByDomainID = function(id, callback) {
        serviceProxy.get(service, 'deleteDomainByDomainID', id, callback);
      };

      //按企业id查询能耗节点
      factory.queryDomainsByEnterpriseId = function(id, callback) {
        serviceProxy.get(service, 'queryDomainsByEnterpriseId', id, callback);
      };


      //更新修改能耗节点
      factory.modifyDomainInfo = function(param, callback) {
        serviceProxy.get(service, 'modifyDomainInfo', param, callback);
      };

      //保存提交能耗节点
      factory.saveEnergyConsumeTree = function(callback) {
        serviceProxy.get(service, 'saveEnergyConsumeTree', '', callback);
      };

      //查询能耗节点信息
      factory.queryDomainByDomainPath = function(domainPath, callback) {
        serviceProxy.get(service, 'queryDomainByDomainPath', domainPath, function(returnObj) {
          if (returnObj.code == 0) {
            var enterpriseDic = {};
            for (var i in returnObj.data) {
              enterpriseDic[returnObj.data[i]['id']] = returnObj.data[i];
            }
            returnObj.enterpriseDic = enterpriseDic;
            if (callback) {
              callback(returnObj);
            }
          }
        });
      };

      //根据能耗节点的树
      factory.initEnergyTree = function(obj, energyListDic) {
        if (obj && obj.domainInfos) {
          obj.nodes = [];
          for (var i in obj.domainInfos) {
            obj.nodes.push(factory.initEnergyTree(obj.domainInfos[i], energyListDic));
          }
          obj.tags = [obj.nodes.length]
        }
        if (obj && obj.belong == 1) {
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
        energyListDic[obj.domainPath] = obj;
        if (obj.id) {
          energyListDic[obj.id] = obj;
        } else {
          energyListDic[0] = obj;
        }
        return obj;
      };

      factory.queryEnergyTree = function(domainPath, callback) {
        serviceProxy.get(service, 'queryEnergyNodeTreeByDomainPath', domainPath, function(returnObj) {
          var energyListDic = {};
          var energyListTree;
          var dom = [];
          var newObj = {
            parentID: "",
            domainPath: "",
            name: "",
            description: "",
            domainInfos: [returnObj.data]
          }
          dom.push(newObj);
          var menu_list = factory.initEnergyTree(dom[0], energyListDic);
          energyListTree = menu_list.nodes;
          returnObj.energyListDic = energyListDic;
          returnObj.energyListTree = energyListTree;
          if (callback) {
            callback(returnObj);
          }
        })
      };

      //通过设备modelId过滤企业
      factory.getEnterpriseInfosByModelDefinitionId = function(param, callback) {
        serviceProxy.get(service, 'getEnterpriseInfosByModelDefinitionId', param, callback);
      };

      //通过多个企业过滤设备modelId
      factory.getModelDefinitionsByEnterpriseIds = function(param, callback) {
        serviceProxy.get(service, 'getModelDefinitionsByEnterpriseIds', [param], callback);
      };

      //==========================   能耗计量点   ===============================================  
      //新加能耗计量点
      factory.addEnergyConsumeMeters = function(param, callback) {
        serviceProxy.get(service, 'addEnergyConsumeMeters', param, callback);
      };

      //批量删除能耗计量点
      factory.deleteEnergyConsumeMeter = function(id, callback) {
        serviceProxy.get(service, 'deleteEnergyConsumeMeter', id, callback);
      };

      //更新修改能耗计量点
      factory.updateEnergyConsumeMeter = function(param, callback) {
        serviceProxy.get(service, 'updateEnergyConsumeMeter', param, callback);
      };

      //保存能耗计量点
      factory.saveEnergyConsumeMeters = function(param, callback) {
        serviceProxy.get(service, 'saveEnergyConsumeMeters', param, callback);
      };


      //查询能耗计量点
      factory.findEnergyConsumeMeters = function(domainPath, callback) {
        serviceProxy.get(service, 'findEnergyConsumeMeters', domainPath, function(returnObj) {
          if (returnObj.code == 0) {
            var enterpriseDic = {};
            for (var i in returnObj.data) {
              enterpriseDic[returnObj.data[i]['id']] = returnObj.data[i];
            }
            returnObj.enterpriseDic = enterpriseDic;
            if (callback) {
              callback(returnObj);
            }
          }
        });
      };

      //==========================   产品信息管理   ===============================================  
      //新加产品信息
      factory.addProduct = function(param, callback) {
        serviceProxy.get(service, 'addProduct', param, callback);
      };

      //批量删除产品信息
      factory.deleteProduct = function(idAry, callback) {
        serviceProxy.get(service, 'deleteProduct', idAry, callback);
      };

      //更新修改产品信息
      factory.updateProduct = function(param, callback) {
        serviceProxy.get(service, 'updateProduct', param, callback);
      };

      //查询产品信息信息
      factory.findProducts = function(param, callback) {
        serviceProxy.get(service, 'findProducts', param, function(returnObj) {
          if (returnObj.code == 0) {
            var enterpriseDic = {};
            for (var i in returnObj.data) {
              enterpriseDic[returnObj.data[i]['id']] = returnObj.data[i];
            }
            returnObj.enterpriseDic = enterpriseDic;
            if (callback) {
              callback(returnObj);
            }
          }
        });
      };

      //通过企业id查产品信息
      factory.findProductsByEnterpriseId = function(id, callback) {
        serviceProxy.get(service, 'findProductsByEnterpriseId', id, callback);
      };


      //==========================   产品结构管理   ===============================================  
      //新加产品结构
      factory.addProductStruct = function(param, callback) {
        serviceProxy.get(service, 'addProductStruct', param, callback);
      };

      //批量删除产品结构
      factory.deleteProductStruct = function(idAry, callback) {
        serviceProxy.get(service, 'deleteProductStruct', idAry, callback);
      };

      //更新修改产品结构
      factory.updateProductStruct = function(param, callback) {
        serviceProxy.get(service, 'updateProductStruct', param, callback);
      };

      //查询产品结构信息
      factory.findProductStructs = function(param, callback) {
        serviceProxy.get(service, 'findProductStructs', param, function(returnObj) {
          if (returnObj.code == 0) {
            var enterpriseDic = {};
            for (var i in returnObj.data) {
              enterpriseDic[returnObj.data[i]['id']] = returnObj.data[i];
            }
            returnObj.enterpriseDic = enterpriseDic;
            if (callback) {
              callback(returnObj);
            }
          }
        });
      };

      //通过产品id查企业domainPath
      factory.findProductById = function(id, callback) {
        serviceProxy.get(service, 'findProductById', id, callback);
      };


      //==========================   企业经营信息   ===============================================  
      //新加企业经营信息
      factory.addEnterpriseOperateInfoDto = function(param, callback) {
        serviceProxy.get(service, 'addEnterpriseOperateInfoDto', param, callback);
      };

      //批量删除企业经营信息
      factory.deleteEnterpriseOperateInfoDto = function(idAry, callback) {
        serviceProxy.get(service, 'deleteEnterpriseOperateInfoDto', idAry, callback);
      };

      //更新修改企业经营信息
      factory.updateEnterpriseOperateInfoDto = function(param, callback) {
        serviceProxy.get(service, 'updateEnterpriseOperateInfoDto', param, callback);
      };

      //提交企业经营信息
      factory.commitEnterpriseOperateInfo = function(id, callback) {
        serviceProxy.get(service, 'commitEnterpriseOperateInfo', id, callback);
      };

      //政府审核企业经营信息
      factory.updateEnterpriseOperateInfoCommitStatus = function(id, callback) {
        serviceProxy.get(service, 'updateEnterpriseOperateInfoCommitStatus', id, callback);
      };

      //根据企业经营信息id查询产品产量列表
      factory.findProductYieldsByOperateId = function(id, callback) {
        serviceProxy.get(service, 'findProductYieldsByEnterpriseOperateRecordId', id, callback);
      };

      //查询企业经营信息
      factory.findEnterpriseOperateInfos = function(param, callback) {
        serviceProxy.get(service, 'findEnterpriseOperateInfos', param, function(returnObj) {
          if (returnObj.code == 0) {
            var enterpriseDic = {};
            for (var i in returnObj.data) {
              enterpriseDic[returnObj.data[i]['id']] = returnObj.data[i];
            }
            returnObj.enterpriseDic = enterpriseDic;
            if (callback) {
              callback(returnObj);
            }
          }
        });
      };

      //==========================   能源折标系数管理   ===============================================  
      //新加折标
      factory.addEnergyConvertStandardDto = function(param, callback) {
        serviceProxy.get(service, 'addEnergyConvertStandardDto', param, callback);
      };


      //批量删除能源折标系数
      factory.deleteEnergyConvertStandardDto = function(idAry, callback) {
        serviceProxy.get(service, 'deleteEnergyConvertStandardDto', idAry, callback);
      };


      //更新
      factory.updateEnergyConvertStandardDto = function(param, callback) {
        serviceProxy.get(service, 'updateEnergyConvertStandardDto', param, callback);
      };


      //查询能源折标系数信息
      factory.findEnergyConvertStandards = function(param, callback) {
        serviceProxy.get(service, 'findEnergyConvertStandards', param, function(returnObj) {
          if (returnObj.code == 0) {
            var enterpriseDic = {};
            for (var i in returnObj.data) {
              enterpriseDic[returnObj.data[i]['id']] = returnObj.data[i];
            }
            returnObj.enterpriseDic = enterpriseDic;
            if (callback) {
              callback(returnObj);
            }
          }
        });
      };

      //根据能耗折标系数id查详情
      factory.convertStandardByEnergyId = function(id, callback) {
        serviceProxy.get(service, 'findEnergyConvertStandardDetailsByEnergyConvertStandardId', id, callback);
      };

      //复制能耗折标系数
      factory.copyEnergyConvertStandardDto = function(id, callback) {
        serviceProxy.get(service, 'copyEnergyConvertStandardDto', id, callback);
      };

      //生效能耗折标系数
      factory.effectEnergyConvertStandard = function(id, callback) {
        serviceProxy.get(service, 'effectEnergyConvertStandard', id, callback);
      };

      //==========================   能耗录入管理   ===============================================  


      //保存能耗录入
      factory.saveEnergyConsumeRecords = function(param, callback) {
        serviceProxy.get(service, 'saveEnergyConsumeRecords', param, callback);
      };

      //新建任务
      factory.generateEnergyConsumeRecordTaskByTime = function(param, callback) {
        serviceProxy.get(service, 'generateEnergyConsumeRecordTaskByTime', param, callback);
      };

      //保存能耗录入并录入
      factory.saveAndCommitEnergyConsumeRecords = function(id, callback) {
        serviceProxy.get(service, 'saveAndCommitEnergyConsumeRecords', id, callback);
      };

      //查询能源录入
      factory.findConsumeRecordTasksByCondition = function(param, callback) {
        serviceProxy.get(service, 'findConsumeRecordTasksByCondition', param, function(returnObj) {
          if (returnObj.code == 0) {
            var enterpriseDic = {};
            for (var i in returnObj.data) {
              enterpriseDic[returnObj.data[i]['id']] = returnObj.data[i];
            }
            returnObj.enterpriseDic = enterpriseDic;
            if (callback) {
              callback(returnObj);
            }
          }
        });
      };

      //提交能耗录入
      factory.commitEnergyConsumeRecordTask = function(id, callback) {
        serviceProxy.get(service, 'commitEnergyConsumeRecordTask', id, callback);
      };

      //政府审核能耗录入
      factory.updateEnergyConsumeRecordTaskState = function(id, callback) {
        serviceProxy.get(service, 'updateEnergyConsumeRecordTaskState', id, callback);
      };

      //查询能耗录入记录
      factory.findEnergyConsumeRecordsByTaskId = function(id, callback) {
        serviceProxy.get(service, 'findEnergyConsumeRecordsByTaskId', id, callback);
      };

      //======================================   数据计算   ============================  
      factory.clacKqiByTime = function(param, callback) {
        serviceProxy.get(service, 'clacKqiByTime', [param], callback);
      };

      //======================================    标杆设置   ============================  
      factory.saveMarkValue = function(param, callback) {
        serviceProxy.get(service, 'saveMarkValue', [param], callback);
      };

      //======================================    所有节能指标   ============================  
      factory.findReduceEnergyListByCondition = function(param, callback) {
        serviceProxy.get(service, 'findReduceEnergyListByCondition', [param], callback);
      };

      //======================================   发布节能指标   ============================  
      factory.publishReduceEnergy = function(param, callback) {
        serviceProxy.get(service, 'publishReduceEnergy', [param], callback);
      };

      //======================================   上周期节能指标   ============================  
      factory.findLastEnergyByEnterpriseId = function(id, callback) {
        serviceProxy.get(service, 'findLastEnergyByEnterpriseId', [id], callback);
      };

      //======================================   保存节能周期   ============================  
      factory.saveReduceEnergy = function(param, callback) {
        serviceProxy.get(service, 'saveReduceEnergy', [param], callback);
      };

      //======================================  查看预测数据   ============================  
      factory.findForecastResult = function(id, callback) {
        serviceProxy.get(service, 'findForecastResult', id, callback);
      };

      //======================================  查看预测数据列表   ============================  
      factory.findForecastResultsByCondition = function(id, callback) {
        serviceProxy.get(service, 'findForecastResultsByCondition', id, callback);
      };

      //======================================   发布预测结果   ============================  
      factory.publishForecastResult = function(param, callback) {
        serviceProxy.get(service, 'publishForecastResult', [param], callback);
      };

      //======================================   重点能耗企业   ============================  
      factory.getTopN = function(param, callback) {
        serviceProxy.get(service, 'getTopN', param, callback);
      };

      //======================================   通过节点id查询企业信息   ============================  
      factory.findEnterpriseInfoByNodeId = function(param, callback) {
        serviceProxy.get(service, 'findEnterpriseInfoByNodeId', [param], callback);
      };

      factory.getDeviceTypeNames = function(param, callback) {
        serviceProxy.get(service, 'getDeviceTypeNames', [param], callback);
      };

      //======================================   潜力点分析   =========================================  
      factory.getIndustryMarkValue = function(param, callback) {
        serviceProxy.get(service, 'getIndustryMarkValue', param, callback);
      };

      //======================================   能效评估  ==========================================  
      factory.getEnergyEvaluations = function(param, callback) {
        serviceProxy.get(service, 'getEnergyEvaluations', param, callback);
      };



      return factory;
    }
  ]);

});
