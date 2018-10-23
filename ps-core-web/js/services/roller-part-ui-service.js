/**
 * Created by whui on 2018/2/11.
 */
define(['../services/services.js'], function (services) {
  'use strict';
  services.factory('rollerPartUIService', ['serviceProxy',
    function (serviceProxy) {
      var placeServiceName = 'rollerPartUIService',
        service = {};
      /**
       * 获取备件更换和服役履历信息
       */
      service.getRollerPartActionLogByCondition = function (obj, callBack) {
        serviceProxy.get(placeServiceName, "getRollerPartActionLogByCondition", [obj], callBack);
      };

      /**
       * 查询所有辊道
       */
      service.getRollerPartByCondition = function (obj, callBack) {
        serviceProxy.get(placeServiceName, "getRollerPartByCondition", [obj], callBack);
      };


      /**
       * 删除故障信息
       */
      service.deleteDeviceFaultInfoById = function (id, callBack) {
        serviceProxy.get(placeServiceName, "deleteDeviceFaultInfoById", id, callBack);
      };

      /**
       * 发起辊道备修委托
       * @param rollerPartList   List<RollerPart>
       * @param paramValues     Map<String, Object>
       * @param callBack
       */

      service.rollerTrust = function (rollerPartList, paramValues, callBack) {
        serviceProxy.get('baogangTicketService', "rollerTrust", [rollerPartList, paramValues], callBack);
      };


      /**
       * @param obj 参数主要包括：服务的设备ID
       * @param callBack
       */

      service.getRollerPartByCondition = function (obj, callBack) {
        serviceProxy.get(placeServiceName, "getRollerPartByCondition", obj, callBack);
      };

      /**
       * 更换辊道
       * @param obj
       * @param callBack
       */
      service.rollerOnBoard = function (obj, callBack) {
        serviceProxy.get(placeServiceName, "rollerOnBoard", obj, callBack);
      };
      /**
       * 工作日调整-日期调整
       * @param conditions  dateTime["2017-01-01","2017-01-02"]
       * @param pageRequest  分页
       * @param callBack
       */
      service.getDatePickerListByCondition = function (conditions, pageRequest, callBack) {
        serviceProxy.get("maintenanceTaskUIService", "getDatePickerListByCondition", [conditions, pageRequest], callBack);
      };

      /**
       * 计划预设定时期查询
       * @param params
       * @param callBack
       */

      service.getPlanTaskTime = function (params,callBack) {
        serviceProxy.get("maintenanceTaskUIService", "getPlanTaskTime", params,callBack);
      };

      /**
       * 计划预设定时期设置
       * @param planTaskTime
       * @param callBack
       */

      service.setPlanTaskTime = function (planTaskTime,callBack) {
        serviceProxy.get("maintenanceTaskUIService", "setPlanTaskTime", planTaskTime,callBack);
      };
      /**
       * 工作日调整
       * @param srcDatePickerList
       * @param targetDate 调整日期
       * @param changeReason 调整原因
       * @param callBack
       */

      service.changeDatePickerBatch = function (srcDatePickerList,targetDate,changeReason,callBack) {
        serviceProxy.get("maintenanceTaskUIService", "changeDatePickerBatch", [srcDatePickerList,targetDate,changeReason],callBack);
      };




      return service;
    }
  ]);
});

