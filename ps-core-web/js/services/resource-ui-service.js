define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('resourceUIService', ['serviceProxy',
    function(serviceProxy) {

      var service = {
        code: 0,
        nodesDic: {},
        kpisDic: {},
        activeListTab: "" //存储当天tab页的信息
      };
      var resourceUIName = "resourceUIService";
      var logService = 'deviceLogService';
      service.getRootModel = function(callBack) {
        serviceProxy.get(resourceUIName, "getRootModel", [], callBack);
      };
      /**
       * 获得根的模型
       */

      service.importPhysicalConfig = function(config, file, id, callBack) {
        serviceProxy.get(resourceUIName, "importPhysicalConfig", {
          config : config,
          file : file,
          resourceId : id
        }, callBack);
      };
      /**
       * 下发网关配置
       * @param gatewayId
       * @param callback
       */
      service.sendGatewayConfig = function (gatewayId, callback) {
        serviceProxy.get(resourceUIName, "sendGatewayConfig", gatewayId, callback);
      };
      /**
       * 查询用户企业域下的接入用户
       */
      service.getEnterpriseAccessAccounts = function(callBack) {
        serviceProxy.get(resourceUIName, "getEnterpriseAccessAccounts", [], callBack);
      };
      /**
       * @param
       * params 设备的id
       * callBack
       */
      service.getDeviceInfo = function(params,callBack) {
        serviceProxy.get(resourceUIName, "getDeviceInfo",params, callBack);
      };
      /**
       * 删除企业接入用户
       * userId 企业接入用户ID
       */
      service.deleteEnterpriseAccessAccount = function(userId, callBack) {
        serviceProxy.get(resourceUIName, "deleteEnterpriseAccessAccount", userId, callBack);
      };
      /**
       * 删除设备文件
       * device 设备
       */
      service.deleteDeviceFile = function(device, callBack) {
        serviceProxy.get(resourceUIName, "deleteDeviceFile", device, callBack);
      };
      service.getKpiTypeByFilter = function(param, callBack) {
        serviceProxy.get(resourceUIName, "getKpiTypeByFilter", param, callBack);
      };
      /**
       * 获取设备文件列表
       * deviceId 设备ID
       */
      service.getUploadDeviceFileList = function(userId, callBack) {
        serviceProxy.get(resourceUIName, "getUploadDeviceFileList", [userId], callBack);
      };
      /**
       * 通过网关ID查询为确认设备
       * gatewayId 网关ID
       */
      service.findUnRecognizedDevice = function(gatewayId, callBack) {
        serviceProxy.get(resourceUIName, "findUnRecognizedDevice", gatewayId, callBack);
      };
      /**
       * 删除未识别设备
       * gatewayId 网关ID
       */
      service.deleteUnRecognizedDevice = function(id, callBack) {
        serviceProxy.get(resourceUIName, "deleteUnRecognizedDevice", id, callBack);
      };
      /**
       * 统计多个网关设备数量
       * gatewayId 网关ID
       */
      service.countDevicesByGatewayIds = function(id, callBack) {
        serviceProxy.get(resourceUIName, "countDevicesByGatewayIds", id, callBack);
      };
      /**
       * 添加未确认设备
       * unComfirmed 未确认设备
       */
      service.addUnComfirmedDevice = function(unComfirmed, callBack) {
        serviceProxy.get(resourceUIName, "addUnComfirmedDevice", unComfirmed, callBack);
      };
      /**
       * 修改未确认设备
       * unComfirmed 未确认设备
       */
      service.editUnComfirmedDevice = function(unComfirmed, callBack) {
        serviceProxy.get(resourceUIName, "editUnComfirmedDevice", unComfirmed, callBack);
      };
      /**
       * 新增企业接入用户
       * enterprise 企业接入用户信息
       */
      service.addEnterpriseAccessAccount = function(enterprise, callBack) {
        serviceProxy.get(resourceUIName, "addEnterpriseAccessAccount", enterprise, callBack);
      };
      /**
       * 更新企业接入用户
       * enterprise 企业接入用户信息
       */
      service.updateEnterpriseAccessAccount = function(enterprise, callBack) {
        serviceProxy.get(resourceUIName, "updateEnterpriseAccessAccount", enterprise, callBack);
      };
      /**
       * 获得根的模型
       */
      service.getRootDomain = function(callBack) {
        serviceProxy.get(resourceUIName, "getRootDomain", [], callBack);
      };

      /**
       * 	获取所有模型定义
       */
      service.getModels = function(callBack) {
        serviceProxy.get(resourceUIName, "getModels", [], callBack);
      };

      /**
       * 	获取所有模型定义
       */
      service.getModelByIds = function(ids, callBack) {
        serviceProxy.get(resourceUIName, "getModelByIds", [ids], callBack);
      };

      /**
       * 通过模型ID获取该模型下的资源列表
       */
      service.getResourceByModelId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getResourceByModelId", [id], callBack);
      };
      /**
       * 通过id获取协议配置信息
       */
      service.getModelConfigById = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getModelConfigById", [id], callBack);
      };
      /**
       * 通过型号id获取协议配置信息
       */
      service.getModelConfigByModelId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getModelConfigByModelId", [id], callBack);
      };

      /**
       * 通过模型ID获取KPI定义列表
       */
      service.getDataItemsByModelId = function(id, callBack,extendstr) {
        serviceProxy.get(resourceUIName, "getDataItemsByModelId", [id], callBack,null,extendstr);
      };

      //获得KPI的range和单位
      service.getKpiRangeAndUnit = function(myOptionDic, kpiDef) {
        if(myOptionDic[kpiDef.unit])
          kpiDef.unitLabel = myOptionDic[kpiDef.unit];
        var regExp = /\{|\[.*\}|\]/;
        if(kpiDef.range) {
          var find = regExp.test(kpiDef.range);
          var rangeObj = [];
          if(find) {
            try {
              rangeObj = find ? JSON.parse(kpiDef.range) : [];
            } catch(e) {}
          }
          kpiDef.rangeAry = rangeObj;
          if(rangeObj instanceof Array) {
            kpiDef.rangeAry = rangeObj;
            if(rangeObj.length == 2) {
              kpiDef.min = rangeObj[0];
              kpiDef.max = rangeObj[1];
            }
          } else if(rangeObj instanceof Object) {
            kpiDef.rangeObj = rangeObj;
          }
        }
        return kpiDef;
      }
      /**
       * 查询接入协议和解析协议
       */
      service.getAllResolutionProtocol = function(protocol, callBack) {
        serviceProxy.get(resourceUIName, "getAllResolutionProtocol", [protocol], callBack);
      };
      /**
       * 复制模型
       */
      service.copyModelDefinition = function(protocol, callBack) {
        serviceProxy.get(resourceUIName, "copyModelDefinition", [protocol], callBack);
      };
      /**
       * 删除型号协议配置
       * id 协议ID
       */
      service.deleteModelConfig = function(id, callBack) {
        serviceProxy.get(resourceUIName, "deleteModelConfig", [id], callBack);
      };
      /**
       * 添加型号协议配置
       */
      service.saveModelConfig = function(obj, callBack) {
        serviceProxy.get(resourceUIName, "saveModelConfig", obj, callBack);
      };
      /**
       * 通过条件查询设备模型
       */
      service.getModelsByCondition = function(obj, callBack) {
        serviceProxy.get(resourceUIName, "getModelsByCondition", [obj], callBack);
      };
      /**
       * 查询设备模型
       */
      service.getDeviceModel = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getDeviceModel", [id], callBack);
      };
      service.getDeviceGroups = function(callBack) {
        serviceProxy.get(resourceUIName, "getDeviceGroups", [], callBack);
      };

      /**
       * 通过模型ID获取该模型下的管理资源列表
       */
      service.getManagedDevicesByModelId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getManagedDevicesByModelId", id, callBack);
      };
      //通过指令id查测点
      service.getKpiDefinitionsByDirectiveId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getKpiDefinitionsByDirectiveId", id, callBack);
      };
      //通过任务id查测点
      service.getKpiDefinitionsByCollectionTaskId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getKpiDefinitionsByCollectionTaskId", id, callBack);
      };
      //通过主要部件id查备件消息
      service.getSparePartByPrincipalComponentId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getSparePartByPrincipalComponentId", id, callBack);
      };
      /**
       * 修改保存技术参数
       */
      service.saveTechnicalParameterByModelId = function(id, paramList, callBack) {
        serviceProxy.get(resourceUIName, "saveTechnicalParameterByModelId", [id, paramList], callBack);
      };
      /**
       *新增 保存技术参数
       */
      service.addTechnicalParameterByModelId = function(id, paramList, callBack) {
        serviceProxy.get(resourceUIName, "addTechnicalParameterByModelId", [id, paramList], callBack);
      };
      /**
       *新增 保存技术参数
       */
      service.deleteTechnicalParameterByModelId = function(id, paramList, callBack) {
        serviceProxy.get(resourceUIName, "deleteTechnicalParameterByModelId", [id, paramList], callBack);
      };
      /**
       *新增 添加采集任务
       */
      service.addCollectionTaskDefinitionByModelId = function(id, paramList, callBack) {
        serviceProxy.get(resourceUIName, "addCollectionTaskDefinitionByModelId", [id, paramList], callBack);
      };
      /**
       *新增 添加主要部件
       */
      service.addPrincipalComponentByModelId = function(id, paramList, callBack) {
        serviceProxy.get(resourceUIName, "addPrincipalComponentByModelId", [id, paramList], callBack);
      };
      /**
       *	删除采集任务
       */
      service.deleteCollectionTaskDefinitionByModelId = function(id, taskId, callBack) {
        serviceProxy.get(resourceUIName, "deleteCollectionTaskDefinitionByModelId", [id, taskId], callBack);
      };
      /**
       *	删除主要部件
       */
      service.deletePrincipalComponentByModelId = function(id, taskId, callBack) {
        serviceProxy.get(resourceUIName, "deletePrincipalComponentByModelId", [id, taskId], callBack);
      };
      /**
       *	删除故障
       */
      service.deleteFaultKnowledgeByModelId = function(id, faultId, callBack) {
        serviceProxy.get(resourceUIName, "deleteFaultKnowledgeByModelId", [id, faultId], callBack);
      };
      /**
       *修改 添加采集任务
       */
      service.saveCollectionTaskDefinitionByModelId = function(id, paramList, callBack) {
        serviceProxy.get(resourceUIName, "saveCollectionTaskDefinitionByModelId", [id, paramList], callBack);
      };
      /**
       *修改 主要部件
       */
      service.savePrincipalComponentByModelId = function(id, paramList, callBack) {
        serviceProxy.get(resourceUIName, "savePrincipalComponentByModelId", [id, paramList], callBack);
      };
      /**
       * 查询技术参数
       * 型号id
       */
      service.findTechnicalParameterByModelId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "findTechnicalParameterByModelId", id, callBack);
      };
      /**
       * 删除文档
       * 整个对象
       */
      service.deleteModelFile = function(docList, callBack) {
        serviceProxy.get(resourceUIName, "deleteModelFile", docList, callBack);
      };
      /**
       * 删除文档
       * 整个对象
       */
      service.deleteDeviceFile = function(docList, callBack) {
        serviceProxy.get(resourceUIName, "deleteDeviceFile  ", docList, callBack);
      };
      /**
       * 获取文件列表
       * 型号id
       */
      service.getUploadModelFileList = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getUploadModelFileList", id, callBack);
      };
      /*
       * 获取部件列表
       * 型号 id
       * 类型 type //
      */
        service.getDevicePartsByDeviceModelIdAndDevicePartType = function(id , type, callBack) {
            serviceProxy.get(resourceUIName, "getDevicePartsByDeviceModelIdAndDevicePartType",[id ,type], callBack);
        };
      /*
        * 保存部件列表
        * 型号 id
        * 类型 type //
      */
        service.saveDevicePart = function(param ,callBack) {
            serviceProxy.get(resourceUIName, "saveDevicePart",param ,callBack);
        };

       /*
        * 获取备件列表
       */
        service.getSparePartByModelId = function(id ,callBack) {
            serviceProxy.get(resourceUIName, "getSparePartByModelId",id ,callBack);
        };
      /**
       * 查询技术参数
       * 型号id
       */
      service.findPrincipalComponentByModelId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "findPrincipalComponentByModelId", id, callBack);
      };
      /**
       * 查询采集任务
       * 型号id
       */
      service.findCollectionTaskDefinitionByModelId = function(queryObj, callBack) {
        serviceProxy.get(resourceUIName, "findCollectionTaskDefinitionByModelId", queryObj, callBack);
      };
      /**
       * 获取默认属性定义列表
       */
      service.getdefaultAttrs = function(callBack) {
        serviceProxy.get(resourceUIName, "getdefaultAttrs", [], callBack);
      };
      /**
       * 获取所有属性
       */
      service.getAllAttrs = function(callBack) {
        serviceProxy.get(resourceUIName, "getAllAttrs", [], callBack);
      };
      /**
       * 查询所有数据类型
       */
      service.getAllDataTypes = function(callBack) {
        serviceProxy.get(resourceUIName, "getAllDataTypes", [], callBack);
      };
      /**
       * 查询设备种类
       */
      service.getAllModelType = function(callBack) {
        serviceProxy.get(resourceUIName, "getAllModelType", [], callBack);
      };
      /**
       * 通过设备型号查询故障信息
       */
      service.findFaultKnowledgeByModelId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "findFaultKnowledgeByModelId", id, callBack);
      };
      /**
       * 通过设备型号查询故障信息
       */
      service.saveFaultKnowledgeByModelId = function(id, list, callBack) {
        serviceProxy.get(resourceUIName, "saveFaultKnowledgeByModelId", [id, list], callBack);
      };
      /**
       * 查看告警定义
       */
      service.getAlertDefinitionByAlertCode = function(id, modelId, callBack) {
        serviceProxy.get(resourceUIName, "getAlertDefinitionByAlertCode", [id, modelId], callBack);
      };
      /**
       * 查询所有数据项
       */
      service.getAllDataItems = function(callBack) {
        serviceProxy.get(resourceUIName, "getAllDataItems", [], callBack);
      };
      
      /**
       * 设备信息查询条件查询
       */
      service.getDevicesByCondition = function(serarch,callBack,extendstr) {
        serviceProxy.get(resourceUIName, "getDevicesByCondition", [serarch], callBack,null,extendstr);
      };
      
      /**
       * 设备信息真实分页查询条件查询
       *
       */
      service.getDevicesByConditionWithPage = function(serarch, page, callBack) {
        serviceProxy.get(resourceUIName, "getDevicesByConditionWithPage", [serarch, page], callBack);
      };

      /**
       * 通过资源IDS获取的资源列表
       */
      service.getResourcesByCondition = function(param, callBack) {
        serviceProxy.get(resourceUIName, "getResourcesByCondition", param, callBack);
      };
      service.getResourceByIds = function(ids, callBack) {
        var params = [];
        var returnNodes = {};
        for(var i in ids) {
          if(!service.nodesDic[ids[i]]) {
            params.push(ids[i])
          } else {
            returnNodes[ids[i]] = service.nodesDic[ids[i]];
          }
        }
        if(params.length > 0)
          serviceProxy.get(resourceUIName, "getResourceByIds", [params], function(returnObj) {
            if(returnObj.code == 0) {
              for(var i in returnObj.data) {
                service.nodesDic[returnObj.data[i].id] = returnObj.data[i];
                returnNodes[returnObj.data[i].id] = returnObj.data[i];
              }
              callBack(returnNodes);
            }
          });
        else
          callBack(returnNodes);
      };

      /**
       * 增加模型
       */
      service.addModel = function(model, callBack) {
        serviceProxy.get(resourceUIName, "addModel", model, callBack);
      };

      /**
       * 更新模型
       */
      service.updateModel = function(model, callBack) {
        serviceProxy.get(resourceUIName, "updateModel", model, callBack);
      };

      /**
       * 删除模型
       */
      service.deleteModel = function(modelid, callBack) {
        serviceProxy.get(resourceUIName, "deleteModel", modelid, callBack);
      };

      /**
       * 通过模型ID获取告警定义列表
       */
      service.getAlertsByModelId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getAlertsByModelId", id, callBack);
      };

      /**
       * 保存alert
       */
      service.saveAlerts = function(id, alerts, callBack) {
        serviceProxy.get(resourceUIName, "saveAlerts", [id, alerts], callBack);
      };

      /**
       * 通过模型ID和告警ID获取Thresholds
       */
      service.getThresholds = function(modelId, alertId, callBack) {
        serviceProxy.get(resourceUIName, "getThresholds", [modelId, alertId], callBack);
      };

      /**
       * 保存Thresholds
       */
      service.saveThresholds = function(thresholdsParams, callBack) {
        serviceProxy.get(resourceUIName, "saveThresholds", thresholdsParams, callBack);
      };

      /**
       * 一次性获取告警和阈值
       */
      service.getThresholdsByModelId = function(modelId, callBack) {
        serviceProxy.get(resourceUIName, "getThresholdsByModelId", modelId, callBack);
      };

      /**
       * 保存告警和阈值
       */
      service.saveThresholdsByAlert = function(modelId, alertDefinition, callBack) {
        serviceProxy.get(resourceUIName, "saveThresholdsByAlert", [modelId, alertDefinition], callBack);
      };

      /**
       * 删除告警和阈值
       */
      service.deleteThresholdByAlert = function(modelId, alertId, callBack) {
        serviceProxy.get(resourceUIName, "deleteThresholdByAlert", [modelId, alertId], callBack);
      };

      /**
       * 通过模型ID获取KPI定义列表
       */
      service.getKpisByModelId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getKpisByModelId", id, callBack);
      };

      /**
       * 保存kpi
       */
      service.saveKpis = function(id, kpis, callBack) {
        serviceProxy.get(resourceUIName, "saveKpis", [id, kpis], callBack);
      };

      service.getMSvalue = function(minTimespan, returnObj) {
        switch(returnObj.granularityUnit) {
          case 'MS':
            if(minTimespan < returnObj.granularity) {
              minTimespan = returnObj.granularity;
            }
            break;
          case 'SECOND':
            if(minTimespan < returnObj.granularity * 1000) {
              minTimespan = returnObj.granularity * 1000;
            }
            break;
          case 'MINUTE':
            if(minTimespan < returnObj.granularity * 1000 * 60) {
              minTimespan = returnObj.granularity * 1000 * 60;
            }
            break;
          case 'HOUR':
            if(minTimespan < returnObj.granularity * 1000 * 3600) {
              minTimespan = returnObj.granularity * 1000 * 3600;
            }
            break;
          case 'DAY':
            if(minTimespan < returnObj.granularity * 1000 * 3600 * 24) {
              minTimespan = returnObj.granularity * 1000 * 3600 * 24;
            }
            break;
          case 'WEEK':
            if(minTimespan < returnObj.granularity * 1000 * 3600 * 24 * 7) {
              minTimespan = returnObj.granularity * 1000 * 3600 * 24 * 7;
            }
            break;
          case 'MONTH':
            if(minTimespan < returnObj.granularity * 1000 * 3600 * 24 * 31) {
              minTimespan = returnObj.granularity * 1000 * 3600 * 24 * 31;
            }
            break;
          default:
            minTimespan = minTimespan;
        }
        returnObj.minTimespan = minTimespan
        return minTimespan;
      }

      /**
       * 通过KPIID获得KPI定义
       */
      service.getKpisByKpiIds = function(kpis, callBack) {
        var params = [];
        var returnKpis = {
          minTimespan: 1000
        };
        for(var i in kpis) {
          if(!service.kpisDic[kpis[i]]) {
            params.push(kpis[i])
          } else {
            returnKpis[kpis[i]] = service.kpisDic[kpis[i]];
            if(service.kpisDic[kpis[i]].granularity > 0) {
              returnKpis.minTimespan = service.getMSvalue(returnKpis.minTimespan, service.kpisDic[kpis[i]])
            } else {
              returnKpis.minTimespan = returnKpis.minTimespan;
            }
          }
        }
        if(params.length > 0)
          serviceProxy.get(resourceUIName, "getKpisByKpiIds", [params], function(returnObj) {
            if(returnObj.code == 0) {
              for(var i in returnObj.data) {
                service.kpisDic[returnObj.data[i].id] = returnObj.data[i];
                returnKpis[returnObj.data[i].id] = returnObj.data[i];
                if(returnObj.data[i].granularity > 0) {
                  returnKpis.minTimespan = service.getMSvalue(returnKpis.minTimespan, returnObj.data[i])
                } else {
                  returnKpis.minTimespan = returnKpis.minTimespan;
                }
              }
              callBack(returnKpis);
            }
          });
        else
          callBack(returnKpis);
      };

      /**
       * 通过模型ID获取属性定义列表
       */
      service.getAttrsByModelId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getAttrsByModelId", id, callBack);
      };

      /**
       * 增加资源
       */
      service.addResource = function(resource, callBack) {
        serviceProxy.get(resourceUIName, "addResource", resource, callBack);
      };

      /**
       * 保存资源
       */
      service.saveAttrs = function(attrs, callBack) {
        serviceProxy.get(resourceUIName, "saveAttrs", [attrs], callBack);
      };
      /**
       * 删除资源
       */
      service.deleteAttrs = function(attrs, callBack) {
        serviceProxy.get(resourceUIName, "deleteAttrs", [attrs], callBack);
      };

      /**
       * 更新资源
       */
      service.updateResource = function(resource, callBack) {
        serviceProxy.get(resourceUIName, "updateResource", resource, callBack);
      };
      /**
       * 更新物理资源
       */
      service.updateDevice = function(resource, callBack) {
        serviceProxy.get(resourceUIName, "updateDevice", resource, callBack);
      };
      /**
       * 保存物理设备属性
       */
      service.savePhysicalDevice = function(resource, callBack) {
        serviceProxy.get(resourceUIName, "savePhysicalDevice", resource, callBack);
      };
      /**
       * 各测点分别接入/保存测点
       */
      service.addResourceAccesses = function(resource, callBack) {
        serviceProxy.get(resourceUIName, "addResourceAccesses", resource, callBack);
      };
      /**
       * 删除资源
       */
      service.deleteResource = function(id, callBack) {
        serviceProxy.get(resourceUIName, "deleteResource", id, callBack);
      };
      /**
       * 	各测点分别接入删除测点
       */
      service.findResourceAccesses = function(id, callBack) {
        serviceProxy.get(resourceUIName, "findResourceAccesses", id, callBack);
      };
      /**
       * 查询物理设备
       */
      service.getPhysicalDeviceById = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getPhysicalDeviceById", id, callBack);
      };

      /**
       * 获取所有资源
       */
      service.getResources = function(callBack) {
        serviceProxy.get(resourceUIName, "getResources", null, callBack);
      };

      service.getResourceByModelId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getResourceByModelId", id, callBack);
      };

      /**
       * 获取所有资源（去掉204 域名类型）
       */
      service.getDevices = function(callback) {
        serviceProxy.get(resourceUIName, "getDevices", [], callback);
      };

      /**
       * 获取区域
       */
      service.getSimpleDistricts = function(callBack) {
        serviceProxy.get(resourceUIName, "getSimpleDistricts", null, callBack);
      };

      /**
       * 修改网关
       */
      service.updateGateway = function(gateway, callBack) {
        serviceProxy.get(resourceUIName, "updateGateway", gateway, callBack);
      };

      /**
       * 通过网关ID获取该模型下的资源列表
       */
      service.getResourcesByGatewayId = function(gatewayId, callBack) {
        serviceProxy.get(resourceUIName, "getResourcesByGatewayId", gatewayId, callBack);
      };

      /**
       * 通过网关ID获取该模型下的物理资源列表
       */
      service.getPhysicalDevicesByGatewayId = function(gatewayId, callBack) {
        serviceProxy.get(resourceUIName, "getPhysicalDevicesByGatewayId", gatewayId, callBack);
      };

      /**
       * 通过资源ID获得资源信息
       */
      service.getResourceById = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getResourceById", id, callBack);
      };

      /**
       * 增加网关
       */
      service.addGateway = function(gateway, callBack) {
        serviceProxy.get(resourceUIName, "addGateway", gateway, callBack);
      };

      /**
       * 获取所有网关
       */
      service.getAllGateways = function(callBack) {
        serviceProxy.get(resourceUIName, "getAllGateways", null, callBack);
      };
      /**
       * 按照ID获得网关
       * @param {Object} callBack
       */
      service.getGatewayById = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getGatewayById", id, callBack);
      };

      /**
       * 按照条件获得网关
       * @param {Object} callBack
       */
      service.getAllGatewaysByCondition = function(condition, callBack) {
        serviceProxy.get(resourceUIName, "getAllGatewaysByCondition", condition, callBack);
      };

      /**
       * 删除网关
       */
      service.deleteGateway = function(gateid, callBack) {
        serviceProxy.get(resourceUIName, "deleteGateway", gateid, callBack);
      };
      /**
       * 批量删除网关
       */
      service.deleteGateways = function(gateids, callBack) {
        serviceProxy.get(resourceUIName, "deleteGateways", [gateids], callBack);
      };
      /**
       * 启用网关
       */
      service.activateGateway = function(gateid, callBack) {
        serviceProxy.get(resourceUIName, "activateGateway", gateid, callBack);
      };

      /**
       * 批量启用网关
       */
      service.activateGateways = function(gateids, callBack) {
        serviceProxy.get(resourceUIName, "activateGateways", [gateids], callBack);
      };

      /**
       * 停用网关
       */
      service.deactivateGateway = function(gateid, callBack) {
        serviceProxy.get(resourceUIName, "deactivateGateway", gateid, callBack);
      };

      /**
       * 批量停用网关
       */
      service.deactivateGateways = function(gateids, callBack) {
        serviceProxy.get(resourceUIName, "deactivateGateways", [gateids], callBack);
      };

      /**
       * 注册设备
       */
      service.registerDevice = function(gateid, device, callBack) {
        serviceProxy.get(resourceUIName, "registerDevice", [gateid, device], callBack);
      };

      /**
       * 多个设备注销
       */
      service.unregisterDevices = function(gateid, deviceids, callBack) {
        serviceProxy.get(resourceUIName, "unregisterDevices", [gateid, deviceids], callBack);
      };

      /**
       * 设备注销
       */
      service.unregisterDevice = function(gateid, deviceid, callBack) {
        serviceProxy.get(resourceUIName, "unregisterDevice", [gateid, deviceid], callBack);
      };
      /**
       * 设备激活
       */
      service.activateDevice = function(device, callBack) {
        serviceProxy.get(resourceUIName, "activateDevice", device, callBack);
      };

      /**
       * 多个设备激活
       */
      service.activateDevices = function(deviceids, callBack) {
        serviceProxy.get(resourceUIName, "activateDevices", [deviceids], callBack);
      };
      /**
       * 设备取消激活
       */
      service.deactivateDevice = function(device, callBack) {
        serviceProxy.get(resourceUIName, "deactivateDevice", device, callBack);
      };
      /**
       * 多个设备取消激活
       */
      service.deactivateDevices = function(deviceids, callBack) {
        serviceProxy.get(resourceUIName, "deactivateDevices", [deviceids], callBack);
      };
      /**
       * 通过域路径获取资源
       */
      service.getResourcesByDomainPath = function(domainPath, callBack) {
        serviceProxy.get(resourceUIName, "getResourcesByDomainPath", domainPath, callBack);
      };

      service.getLatestDevices = function(callBack) {
        //serviceProxy.get(resourceUIName, "getDevicesByCondition", [{}], callBack);
        serviceProxy.get(resourceUIName, "getLatestDevices", [], callBack);
      };

      /**
       * 通过模型ID取得指令
       */
      service.getDirectivesByModelId = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getDirectivesByModelId", id, callBack);
      };

      /**
       * 通过模型ID取得指令 没有角色
       */
      service.getDirectivesByModelIdNotByRole = function(id, callBack) {
        serviceProxy.get(resourceUIName, "getDirectivesByModelIdNotByRole", id, callBack);
      };

      /**
       * 保存该模型下的指令
       */
      service.saveDirectives = function(id, list, callBack) {
        serviceProxy.get(resourceUIName, "saveDirectives", [id, list], callBack);
      };

      /**
       * 发送指令
       */
      service.sendDeviceDirective = function(id, did, maps, callBack) {
        serviceProxy.get(resourceUIName, "sendDeviceDirective", [id, did, maps], callBack);
      };

      /**
       * 批量发送指令
       */
      service.sendDeviceDirectiveBatch = function(ids, did, maps, callBack) {
          serviceProxy.get(resourceUIName, "sendDeviceDirectiveBatch", [ids, did, maps], callBack);
      };

      /**
       * 表达式检测
       */
      service.checkDirectiveParam = function(dirObj, callBack) {
        serviceProxy.get(resourceUIName, "checkDirectiveParam", dirObj, callBack);
      };

      /**
       * 城市分布
       */
      service.statDeviceByStandardAddress = function(callBack) {
        serviceProxy.get(resourceUIName, "statDeviceByStandardAddress", [], callBack);
      };

      /**
       * 切换用户的一个域(最新版)
       */
      service.changeDeviceDomain = function(deviceID, domainPath, callBack) {
        serviceProxy.get(resourceUIName, "changeDeviceDomain", [deviceID, domainPath], callBack);
      };

      /**
       * 删除模型下的一个KPI指标
       */
      service.deleteKpi = function(modelId, kpiId, callBack) {
        serviceProxy.get(resourceUIName, "deleteKpi", [modelId, kpiId], callBack);
      };

      /**
       * 保存模型下的一个KPI指标
       */
      service.saveKpi = function(modelId, kpi, callBack) {
        serviceProxy.get(resourceUIName, "saveKpi", [modelId, kpi], callBack);
      };

      /**
       * 删除模型下的一个属性
       */
      service.deleteAttr = function(modelId, attrId, callBack) {
        serviceProxy.get(resourceUIName, "deleteAttr", [modelId, attrId], callBack);
      };

      /**
       * 保存模型下的一个属性
       */
      service.saveAttr = function(modelId, attr, callBack) {
        serviceProxy.get(resourceUIName, "saveAttr", [modelId, attr], callBack);
      }

      /**
       * 删除模型下的一个告警定义
       */
      service.deleteAlert = function(modelId, alertId, callBack) {
        serviceProxy.get(resourceUIName, "deleteAlert", [modelId, alertId], callBack);
      };

      /**
       * 保存模型下的一个告警定义
       */
      service.saveAlert = function(modelId, alert, callBack) {
        serviceProxy.get(resourceUIName, "saveAlert", [modelId, alert], callBack);
      };

      /**
       * 删除模型下的一个指令
       */
      service.deleteDirective = function(modelId, directiveId, callBack) {
        serviceProxy.get(resourceUIName, "deleteDirective", [modelId, directiveId], callBack);
      };

      /**
       * 保存模型下的一个指令
       */
      service.saveDirective = function(modelId, directive, callBack) {
        serviceProxy.get(resourceUIName, "saveDirective", [modelId, directive], callBack);
      };

      /**
       * 取得所有可用的模型引用
       */
      service.getDeviceProviderModels = function(callBack) {
        serviceProxy.get(resourceUIName, "getDeviceProviderModels", [], callBack);
      };

      /**
       * 取得所有可管理的模型
       */
      service.getManagedModels = function(callBack) {
        serviceProxy.get(resourceUIName, "getManagedModels", [], callBack);
      };

      service.getDeviceGroups = function(callBack) {
        serviceProxy.get(resourceUIName, "getDeviceGroups", [], callBack);
      };

      service.deleteDeviceGroup = function(id, callBack) {
        serviceProxy.get(resourceUIName, "deleteDeviceGroup", [id], callBack);
      };

      service.deleteDevice = function(id, callBack) {
        serviceProxy.get(resourceUIName, "deleteDevice", [id], callBack);
      };

      /**
       * 查询影子设备
       */
      service.getDeviceShadowsByFilter = function(deviceShadow, callBack) {
        serviceProxy.get(resourceUIName, "getDeviceShadowsByFilter", deviceShadow, callBack);
      };

      /**
       * 查询影子设备
       */
      service.getModelsByGroupId = function(deviceGroupId, callback) {
        serviceProxy.get(resourceUIName, "getModelsByGroupId", [deviceGroupId], callback);
      }

      service.getCustomerDeviceByFilter = function(deviceShadow, callBack) {
        serviceProxy.get(resourceUIName, "getCustomerDeviceByFilter", deviceShadow, callBack);
      };

      service.getDeviceGroupModels = function(callBack, error) {
        serviceProxy.get(resourceUIName, "getDeviceGroupModels", [], callBack, error);
      };

      service.saveDeviceGroup = function(deviceGroup, callback) {
        serviceProxy.get(resourceUIName, 'saveDeviceGroup', deviceGroup, callback);
      };
      service.getCanRelatedToGroupDevicesByModelId = function(modelId, callback) {
        serviceProxy.get(resourceUIName, 'getCanRelatedToGroupDevicesByModelId', [modelId], callback);
      };
      service.saveDeviceToGroups = function(deviceGroupId, deviceGroup, callback) {
        serviceProxy.get(resourceUIName, 'saveDeviceToGroups', [deviceGroupId, deviceGroup], callback);
      };

      /**
       * 获取所有采集插件
       * @param {Object} callback
       */
      service.getAllCollectionPlugins = function(callback) {
        serviceProxy.get(resourceUIName, 'getAllCollectionPlugins', [], callback);
      };

      /**
       * 通过条件取得KPI
       * @param {Object} filer[name，label，code]
       * @param {Object} callback
       */
      service.getKpiTypeByFilter = function(filer, callback) {
        serviceProxy.get(resourceUIName, 'getKpiTypeByFilter', filer, callback);
      };

      /**
       * 保存kpi
       * @param {Object} filer[name，label，code]
       * @param {Object} callback
       */
      service.saveKpiType = function(param, callback) {
          serviceProxy.get(resourceUIName, 'saveKpiType', param, callback);
      };

      /**
       * 根据kpiId删除kpi
       */
      service.deleteKpiType = function(kpiId, callback) {
          serviceProxy.get(resourceUIName, 'deleteKpiType', kpiId, callback);
      };

      /**
       * 根据kpiId 批量删除kpi
       */
      service.deleteKpiTypeByIds = function(kpiIds, callback) {
          serviceProxy.get(resourceUIName, 'deleteKpiTypeByIds', kpiIds, callback);
      };

      /**
       * 根据优惠码获取优惠券
       * @param 优惠码
       */
      service.getCouponByPromoCode = function(code, callback) {
        serviceProxy.get(resourceUIName, 'getCouponByPromoCode', code, callback);
      };
      /**
       * 获取当前用户的激费记录
       */
      service.getCurrentUserOrder = function(callback) {
        serviceProxy.get(resourceUIName, 'getCurrentUserOrder', [], callback);
      };
      /**
       * 提交订单
       * Order 集合
       */
      service.saveOrder = function(order, callback) {
        serviceProxy.get(resourceUIName, 'saveOrder', order, callback);
      };
      /**
       * 获取当前用户购买的服务
       */
      service.getCurrentUserProduct = function(callback) {
        serviceProxy.get(resourceUIName, 'getCurrentUserProduct', [], callback);
      };
      /**
       * 获取所有价格定
       */
      service.getAllPrice = function(callback) {
        serviceProxy.get(resourceUIName, 'getAllPrice', [], callback);
      };

      /**
       * 设备查询
       * @param {Object} devName
       * @param {Object} callback
       */
      service.findByExternalDevIdAndLabel = function(devName, callback) {
        serviceProxy.get(resourceUIName, 'findByExternalDevIdAndLabel', devName, callback);
      };

      /**
       * 根据网关id获取资源设备
       * @param id
       * @param callback
       */
      service.getResourceByGatewayId = function(id, callback) {
        serviceProxy.get(resourceUIName, 'getResourceByGatewayId', id, callback);
      }

      service.getResourcesByDomainPathAndCategory = function(domainPath, callback) {
        serviceProxy.get(resourceUIName, 'getResourcesByDomainPathAndCategory', [domainPath, "DeviceGroup"], callback);
      }

      service.getDevicesByDomainPath = function(domainPath, callback) {
        serviceProxy.get(resourceUIName, 'getDevicesByDomainPath', domainPath, callback);
      }

      service.saveThresholdsByModelId = function(modelId, alertId, thresholddefine, callback) {
        serviceProxy.get(resourceUIName, 'saveThresholdsByModelId', [modelId, alertId, thresholddefine], callback);
      }
      service.deleteThresholdById = function(thresholdId, callback) {
        serviceProxy.get(resourceUIName, 'deleteThresholdById', [thresholdId], callback);
      }

      //==============================     告警规则    =============================
      //告警分类
      //新加告警分类
      service.addAlertDefinition = function(param, callback) {
        serviceProxy.get(resourceUIName, 'addAlertDefinition', param, callback);
      };

      //更新告警分类
      service.updateAlertDefinition = function(param, callback) {
        serviceProxy.get(resourceUIName, 'updateAlertDefinition', param, callback);
      };

      //删除告警分类
      service.deleteAlertDefinition = function(id, callback) {
        serviceProxy.get(resourceUIName, 'deleteAlertDefinition', id, callback);
      };

      //查询告警分类
      service.findAlertDefinitions = function(param, callback) {
        serviceProxy.get(resourceUIName, 'findAlertDefinitions', param, callback);
      };

      //告警规则
      //新加
      service.addKpiThreshold = function(param, callback) {
        serviceProxy.get(resourceUIName, 'addKpiThreshold', param, callback);
      };

      //更新
      service.updateKpiThreshold = function(param, callback) {
        serviceProxy.get(resourceUIName, 'updateKpiThreshold', param, callback);
      };

      //复制
      service.copyKpiThresholdById = function(id, callback) {
        serviceProxy.get(resourceUIName, 'copyKpiThresholdById', id, callback);
      };

      //删除
      service.deleteKpiThresholds = function(id, callback) {
        serviceProxy.get(resourceUIName, 'deleteKpiThresholds', id, callback);
      };

      //查询
      service.findKpiThresholds = function(param, callback) {
        serviceProxy.get(resourceUIName, 'findKpiThresholds', param, callback);
      };

      //批量启用
      service.enabledKpiThresholds = function(param, callback) {
        serviceProxy.get(resourceUIName, 'enabledKpiThresholds', param, callback);
      };

      //告警通知
      //新加
      service.addNoticeRule = function(param, callback) {
        serviceProxy.get(resourceUIName, 'addNoticeRule', param, callback);
      };

      //更新
      service.updateNoticeRule = function(param, callback) {
        serviceProxy.get(resourceUIName, 'updateNoticeRule', param, callback);
      };

      //删除
      service.deleteNoticeRule = function(id, callback) {
        serviceProxy.get(resourceUIName, 'deleteNoticeRule', id, callback);
      };

      //根据通知id查通知
      service.findNoticeRuleById = function(id, callback) {
        serviceProxy.get(resourceUIName, 'findNoticeRuleById', id, callback);
      };

      //查询
      service.findNoticeRules = function(param, callback) {
        serviceProxy.get(resourceUIName, 'findNoticeRules', param, callback);
      };

      //通知模板
      service.findTemplateByCondition = function(code, callback) {
        serviceProxy.get(resourceUIName, 'findTemplateByCondition', code, callback);
      };

      //设备型号查询故障
      service.getFaultsByModelId = function(modelId, callback) {
        serviceProxy.get(resourceUIName, 'getFaultsByModelId', modelId, callback);
      };

      //多条件查询设备
      service.findResourcesByCondition = function(param, callback) {
        serviceProxy.get(resourceUIName, 'findResourcesByCondition', param, callback);
      };

      //获得网关的连接点
      service.loadConnectionPoint = function(gwid, callback) {
        serviceProxy.get(resourceUIName, 'loadConnectionPoint', gwid, callback);
      };

      //获得缓存网关的连接点
      service.getConnectionPoint = function(gwid, callback) {
        serviceProxy.get(resourceUIName, 'getConnectionPoint', gwid, callback);
      };

      //条件查询域
      service.getDomainsByFilter = function(param, callback) {
        serviceProxy.get(resourceUIName, 'getDomainsByFilter', param, callback);
      };
      //查企业
      service.getEnterpriseDomainsByFilter = function(param, callback) {
        serviceProxy.get(resourceUIName, 'getEnterpriseDomainsByFilter', param, callback);
      };
      //条件查询扩展域
      service.getExtendDomainsByFilter = function(param, callback) {
        serviceProxy.get(resourceUIName, 'getDomainsByFilter', param, function(returnObj) {
          if(returnObj.code != 0) return;
          var domainListDic = {};
          returnObj.data.forEach(function(obj) {
            obj.text = obj.name;
            obj.label = obj.name + (obj.modelId == 301 ? "[客户域]" : (obj.modelId == 302 ? "[项目域]" : ""));
            obj.icon = "ion ion-ios-color-filter";
            domainListDic[obj.domainPath] = obj;
          });

          var menu_list = {};
          for(var key in domainListDic) {
            var parentkey = key.replace(domainListDic[key].id + "/", "")
            if(!domainListDic[parentkey]) {
              menu_list = domainListDic[key];
              menu_list.domainInfos = returnObj.data;
            } else {
              if(!domainListDic[parentkey].nodes) domainListDic[parentkey].nodes = [];
              domainListDic[parentkey].nodes.push(domainListDic[key]);
            }
          }
          returnObj.domainListDic = domainListDic;
          returnObj.domainListTree = [menu_list];
          returnObj.data = [menu_list];
          callback(returnObj)
        });
      };

      //条件查询域
      service.getEnterpriseDomainsByFilter = function(param, callback) {
        serviceProxy.get(resourceUIName, 'getEnterpriseDomainsByFilter', param, callback);
      };

      service.getKqiCalcRules = function(callback) {
        serviceProxy.get(resourceUIName, 'getKqiCalcRules', [], callback);
      };

      service.addKqiCalcRule = function(param, callback) {
        serviceProxy.get(resourceUIName, 'addKqiCalcRule', [param], callback);
      };

      service.updateKqiCalcRule = function(param, callback) {
        serviceProxy.get(resourceUIName, 'updateKqiCalcRule', [param], callback);
      };

      service.deleteKqiCalcRule = function(id, callback) {
        serviceProxy.get(resourceUIName, 'deleteKqiCalcRule', [id], callback);
      };

      /**
       * 激活网关
       * @param {Object} id
       * @param {Object} callback
       */
      service.activateSimulatedGateway = function(id, callback) {
        serviceProxy.get(resourceUIName, 'activateSimulatedGateway', [id], callback);
      };
      service.activateSimulatedGateways = function(ids, callback) {
        serviceProxy.get(resourceUIName, 'activateSimulatedGateways', [ids], callback);
      };
      /**
       * 查询设备日志
       * type  类型（operation_log，data_status_log，alert_log）
       * resourceId  资源id
       * @param obj {"type":"data_status_log","resourceId":long}
       */
      service.findDeviceLog = function(serarch, page, callBack) {
        serviceProxy.get(logService, "findDeviceLog", [serarch, page], callBack);
      };
      /**
       * 订阅采集日志
       * @param param [true,true,"网关标识","DEBUG"]
       */
      service.displayGatewayLog = function(param, callback) {
        serviceProxy.get(resourceUIName, 'displayGatewayLog', param, callback);
      };
      service.setDeviceAlertSwitchStatus = function(id,status, callback) {
        serviceProxy.get(resourceUIName, 'setDeviceAlertSwitchStatus', [id,status], callback);
      };
        /**
         * 根据备件id查询备件名称  20180916 yinjinxing
         * @param param
         * @param callback
         */
      service.getDevicePartById=function(param,callback){
        serviceProxy.get(resourceUIName,'getDevicePartById',param,callback);
      }
      return service;
    }
  ]);
});