define([], function() {
  return {
    defaultRoutePath: '',
    routes: {
      '/test3' : {
        templateUrl : "partials/test1.html",
        controller : "testCtrl",
        dependencies: ['js/controllers/test1.js']
      },
      '/addEnterprise': {
        templateUrl: 'partials/add_enterprise.html',
        controller: 'addEnterpriseCtrl',
        dependencies: ['js/controllers/user-ctrl.js', '../js/directives/tools-dom.js']
      },
      '/calendar': {
        templateUrl: 'partials/calendar.html',
        controller: 'CalendarCtrl'
      },
      '/configAlertView': {
        templateUrl: 'partials/config-alert.html',
        controller: 'configAlertCtrl',
        dependencies: ['js/controllers/config-alert-ctrl.js', '../js/directives/data-tables-dom.js', '../js/directives/tools-dom.js']
      },
      '/editorManagement': {
        templateUrl: '../partials/editor_management.html',
        controller: 'editorManagementCtrl',
        dependencies: ['js/controllers/editor-management-ctrl.js','../js/directives/data-tables-dom.js', '../js/directives/fb-tools-dom.js']
      },
      '/configAlert': {
        templateUrl: 'partials/alerts.html',
        controller: 'ViewCtrl',
        dependencies: ['../js/controllers/view-ctrl.js', '../js/controllers/view-alert-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/equipment-malfunctions-dom.js', '../js/directives/timeline-dom.js']
      },
      '/configAlert/:alertId/:type': {
        templateUrl: 'partials/alerts.html',
        controller: 'ViewCtrl',
        dependencies: ['../js/controllers/view-ctrl.js', '../js/controllers/view-alert-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/equipment-malfunctions-dom.js', '../js/directives/timeline-dom.js']
      },
      '/maintenance': {
        templateUrl: 'partials/maintenance.html',
        controller: 'maintenanceCtrl',
        dependencies: ['js/directives/maintenance-dom.js', 'js/controllers/maintenance-ctrl.js', '../js/directives/tools-dom.js']
      },
      '/maintenance/:id': {
        templateUrl: 'partials/maintenance.html',
        controller: 'maintenanceCtrl',
        dependencies: ['js/directives/maintenance-dom.js', 'js/controllers/maintenance-ctrl.js', '../js/directives/tools-dom.js']
      },
      '/calendarData/:id/:person': {
        templateUrl: 'partials/maintenance_calendar.html',
        controller: 'maintenanceCalendarCtrl',
        dependencies: ['js/directives/maintenance-dom.js', 'js/controllers/maintenance-ctrl.js', '../js/directives/tools-dom.js']
      },
      '/recordCondition': {
        templateUrl: 'partials/record_condition.html',
        controller: 'recordConditionCtrl',
        dependencies: ['js/directives/maintenance-dom.js', 'js/controllers/maintenance-ctrl.js', '../js/directives/tools-dom.js']
      },
      '/conditionDetail/:id': {
        templateUrl: 'partials/condition_detail.html',
        controller: 'recordConditionCtrl',
        dependencies: ['js/directives/maintenance-dom.js', 'js/controllers/maintenance-ctrl.js', 'js/directives/workorder-record-dom.js', '../js/directives/tools-dom.js']
      },
      '/configAlert/:nodeId/:status?': {
        templateUrl: 'partials/alerts.html',
        controller: 'ViewCtrl',
        dependencies: ['../js/controllers/view-ctrl.js', '../js/controllers/view-alert-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/equipment-malfunctions-dom.js', '../js/directives/timeline-dom.js']
      },
      '/configAlertByStatus': {
        templateUrl: '../partials/alert2.html',
        controller: 'ViewCtrl',
        dependencies: ['../js/controllers/view-ctrl.js', '../js/controllers/view-alert-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/equipment-malfunctions-dom.js']
      },
      '/configureview': {
        templateUrl: '../partials/rappid-views.html',
        controller: 'RappidViewsCtrl',
        dependencies: ['../js/controllers/rappid-views-ctrl.js', '../js/directives/data-tables-dom.js']
      },
      '/contract': {
        templateUrl: 'partials/contract.html',
        controller: 'contractCtrl',
        dependencies: ['js/controllers/contract-ctrl.js', 'js/directives/user-dom.js']
      },
      '/configmanager': {
        templateUrl: 'partials/configmanager.html',
        controller: 'ConfigManagerCtrl',
        dependencies: ['js/controllers/configmanager-ctrl.js', 'js/directives/configmanager-dom.js', 'js/directives/treeview-dom.js', '../js/directives/tools-dom.js']
      },
      '/dashboard/:page?/:parameter?': {
        templateUrl: '../partials/dashboard_ver3.html',
        controller: 'Dashboard_ver3Ctrl',
        dependencies: ['../js/controllers/dashboard-ver3-ctrl.js', '../js/directives/free-board-dom.js','../js/directives/tools-dom.js']
      },
      '/views/:viewType/:viewId?': {
        templateUrl: 'partials/dashboardmanagement.html',
        controller: 'dashboardmanageCtrl',
        dependencies: ['js/controllers/dashboard-management-ctrl.js', '../js/directives/free-board-dom.js', '../js/directives/data-tables-dom.js', '../js/directives/tools-dom.js']
      },
      '/service/management/:type?': {
        templateUrl: 'partials/dashboardmanagement.html',
        controller: 'dashboardmanageCtrl',
        dependencies: ['js/controllers/dashboard-management-ctrl.js', '../js/directives/free-board-dom.js']
      },
      '/designView/:viewId?/:nodeId?': {
        templateUrl: '../partials/view-management.html',
        controller: 'viewmanageCtrl',
        dependencies: ['js/controllers/view-management-ctrl.js', '../js/directives/free-board-dom.js']
      },
      '/designView2/:mode?': {
        templateUrl: '../partials/views.html',
        controller: 'ViewCtrl',
        dependencies: ['../js/controllers/view-ctrl.js', '../js/controllers/view-chart-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/echarts-dom.js']
      },
      '/freePage/:viewId/:parameter?': {
        templateUrl: '../partials/freePage.html',
        controller: 'freePageCtrl',
        dependencies: ['../js/controllers/free-page-ctrl.js', '../js/directives/free-board-dom.js']
      },
      '/designView2/:viewId/:nodeId': {
        templateUrl: 'partials/view.html',
        controller: 'ViewCtrl',
        dependencies: ['../js/controllers/view-ctrl.js', '../js/controllers/view-chart-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/echarts-dom.js']
      },
      '/directiveview/:modelId/:nodeId': {
        templateUrl: 'partials/directiveview.html',
        controller: 'viewDirectiveCtrl',
        dependencies: ['js/controllers/view-directive-ctrl.js']
      },
      '/kpiType': {
          templateUrl: 'partials/kpi-type.html',
          controller: 'kpiTypeCtrl',
          dependencies: ['js/controllers/alert-rules-ctrl.js', 'js/directives/alert-rules-dom.js', '../js/directives/tools-dom.js']
      },
      '/domains': {
        templateUrl: 'partials/domains.html',
        controller: 'ViewCmdbDomainCtrl',
        dependencies: ['js/controllers/view-cmdb-domain-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/domain-dom.js']
      },
      '/domains_type': {
        templateUrl: 'partials/domains_type.html',
        controller: 'ViewCmdbDomainCtrl',
        dependencies: ['js/controllers/view-cmdb-domain-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/domain-dom.js']
      },
      '/domains_type/:label': {
        templateUrl: 'partials/domains_type.html',
        controller: 'ViewCmdbDomainCtrl',
        dependencies: ['js/controllers/view-cmdb-domain-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/domain-dom.js']
      },
      '/emcsView': {
        templateUrl: '../partials/viewemcs.html',
        controller: 'ViewEmcsCtrl',
        dependencies: ['../js/controllers/view-emcs-ctrl.js', '../js/directives/echarts-dom.js', '../js/directives/tools-dom.js']
      },
        '/emcsView/:id/:show': {
            templateUrl: '../partials/viewemcs.html',
            controller: 'ViewEmcsCtrl',
            dependencies: ['../js/controllers/view-emcs-ctrl.js', '../js/directives/echarts-dom.js', '../js/directives/tools-dom.js']
        },
      '/enterpriseMaintain': {
        templateUrl: 'partials/enterprise.html',
        controller: 'EnterpriseListCtrl',
        dependencies: ['js/controllers/user-ctrl.js', 'js/directives/user-dom.js', '../js/directives/select-list-dom.js', '../js/directives/tools-dom.js']
      },
      '/force/:ciid': {
        templateUrl: 'partials/force.html',
        controller: 'ViewForceCtrl'
      },
      '/gateways2': {
        //      templateUrl: 'partials/gateways2.html',
        templateUrl: 'partials/gateway_list.html',
        controller: 'ViewCmdbGatewayCtrl',
        dependencies: ['js/controllers/view-cmdb-gateway-ctrl.js', 'js/directives/gateway-dom.js', '../js/directives/tools-dom.js', '../js/directives/echarts-dom.js']
      },
      '/gatewayInfo/:gatewayId?': {
        //      templateUrl: 'partials/gateways2.html',
        templateUrl: 'partials/gateway_info.html',
        controller: 'ViewCmdbGatewayCtrl',
        dependencies: ['js/controllers/view-cmdb-gateway-ctrl.js', 'js/directives/gateway-dom.js', '../js/directives/tools-dom.js']
      },
      '/lore': {
        templateUrl: 'partials/lore.html',
        controller: 'loreCtrl',
        dependencies: ['js/controllers/contract-ctrl.js', 'js/directives/user-dom.js']
      },
      '/maintain': {
        templateUrl: 'partials/maintain.html',
        controller: 'maintainCtrl',
        dependencies: ['js/controllers/contract-ctrl.js', 'js/directives/user-dom.js']
      },
      '/mailedit/:msgId': {
        templateUrl: 'partials/mailedit.html',
        controller: 'sendMailCtrl',
        dependencies: ['js/controllers/mail-ctrl.js', 'js/directives/user-dom.js']
      },
      '/mailedit': {
        templateUrl: 'partials/mailedit.html',
        controller: 'sendMailCtrl',
        dependencies: ['js/controllers/mail-ctrl.js', 'js/directives/user-dom.js']
      },
      '/orderdetail/:id/:workType': {
        templateUrl: 'partials/orderdetail.html',
        controller: 'orderDetailCtrl',
        dependencies: ['js/controllers/workorder-record-ctrl.js',  '../js/directives/tools-dom.js','js/directives/workorder-record-dom.js']
      },
      '/orderdetail/:id/:workType/:state': {
        templateUrl: 'partials/orderdetail.html',
        controller: 'orderDetailCtrl',
        dependencies: ['js/controllers/workorder-record-ctrl.js',  '../js/directives/tools-dom.js','js/directives/workorder-record-dom.js', '../js/directives/timeline-dom.js']
      },
      '/resource': {
        templateUrl: '../partials/resource_device.html',
        controller: 'ViewCmdbDevCtrl',
        dependencies: ['../js/controllers/view-cmdb-dev-ctrl.js', '../js/controllers/view-maps2-ctrl.js',
          '../js/directives/tools-dom.js', '../js/directives/echarts-dom.js', '../js/directives/cmdb-dom.js'
        ]
      },
      '/facility_panel/:parameter?': {
        templateUrl: 'partials/facility_panel.html',
        controller: 'FacilityPanelCtrl',
        dependencies: ['js/controllers/facility-panel-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/free-board-dom.js']
      },
      '/facility': {
        templateUrl: 'partials/facility_infor.html',
        controller: 'FacilityCtrl',
        dependencies: ['js/controllers/facility-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/treeview-dom.js', 'js/directives/facility-dom.js', '../js/directives/tools-dom.js']
      },
      '/facility_archives/:deviceId?': {
          templateUrl: 'partials/facility_archives.html',
          controller: 'DeviceArchivesCtrl',
          dependencies: ['js/controllers/facility-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/treeview-dom.js', 'js/directives/facility-dom.js', '../js/directives/tools-dom.js']
      },
      '/facility_detail/:type?/:gatewayid?/:id?': {
        templateUrl: 'partials/facility_detail.html',
        controller: 'FacilityCtrl',
        dependencies: ['js/controllers/facility-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/treeview-dom.js', 'js/directives/facility-dom.js', '../js/directives/tools-dom.js']
      },
      '/facility/:type?/:id?': {
        templateUrl: 'partials/facility_infor.html',
        controller: 'FacilityCtrl',
        dependencies: ['js/controllers/facility-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/treeview-dom.js', 'js/directives/facility-dom.js', '../js/directives/tools-dom.js']
      },

      '/facility/:type?/:gatewayid?/:id?': {
        templateUrl: 'partials/device_info.html',
        controller: 'FacilityCtrl',
        dependencies: ['js/controllers/facility-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/treeview-dom.js', '../js/controllers/view-cmdb-dev-ctrl.js','js/directives/facility-dom.js', '../js/directives/tools-dom.js']
      },
      '/resource/:modelId/:nodeId': {
        templateUrl: '../partials/resource_device.html',
        controller: 'ViewCmdbDevCtrl',
        dependencies: ['../js/controllers/view-cmdb-dev-ctrl.js', '../js/controllers/view-maps2-ctrl.js',
          '../js/directives/tools-dom.js', '../js/directives/echarts-dom.js', '../js/directives/cmdb-dom.js'
        ]
      },
      /*【设备模板】列表 */
      '/resource_type': {
        templateUrl: '../partials/resource_list.html',
        controller: 'ViewCmdbDevCtrl',
        dependencies: ['../js/controllers/view-cmdb-dev-ctrl.js', '../js/directives/resource-dom.js', '../js/directives/base-dom.js', '../js/directives/data-tables-dom.js']
      },
      /*【设备模板】编辑 */
      '/editModel/:id': {
        templateUrl: '../partials/add_model.html',
        controller: 'EditModelCtrl',
        dependencies: ['../js/controllers/view-cmdb-dev-ctrl.js', '../js/directives/resource-dom.js', '../js/directives/tools-dom.js']
      },
      /*【点检计划】 */
      '/prod_checkPlan': {
          templateUrl: 'partials/check_plan.html',
          controller: 'checkPlanCtrl',
          dependencies: ['js/controllers/check-plan-ctrl.js', 'js/directives/check-plan-dom.js', '../js/directives/tools-dom.js']
      },
      /*【保养计划】 */
      '/prod_maintainPlan': {
          templateUrl: 'partials/maintain_plan.html',
          controller: 'maintenancePlanCtrl',
          dependencies: ['js/controllers/check-plan-ctrl.js', 'js/directives/check-plan-dom.js', '../js/directives/tools-dom.js']
      },
      '/resource_type/:modelId/:alertCode': {
        templateUrl: '../partials/resource_list.html',
        controller: 'ViewCmdbDevCtrl',
        dependencies: ['../js/controllers/view-cmdb-dev-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/data-tables-dom.js',
          '../js/directives/resource-dom.js', 'js/directives/treeview-dom.js', '../js/directives/directives-dom.js'
        ]
      },
      '/lookModel/:id': {
        templateUrl: '../partials/look_model.html',
        controller: 'EditModelCtrl',
        dependencies: ['../js/controllers/view-cmdb-dev-ctrl.js', '../js/directives/resource-dom.js', '../js/directives/tools-dom.js']
      },
      
      '/resourcegroup': {
        templateUrl: '../partials/resource_group.html',
        controller: 'ViewCmdbDevCtrl',
        dependencies: ['../js/controllers/view-cmdb-dev-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/cmdb-dom.js']
      },
      '/resourcegroup/:modelId/:alertCode': {
        templateUrl: '../partials/resource_group.html',
        controller: 'ViewCmdbDevCtrl',
        dependencies: ['../js/controllers/view-cmdb-dev-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/cmdb-dom.js']
      },
      '/report': {
        templateUrl: '../partials/reportTree.html',
        controller: 'ReportTreeCtrl',
        dependencies: ['../js/controllers/report-ctrl.js', '../js/directives/report-dom.js']
      },
      '/reportlook': {
        templateUrl: '../partials/reportLook.html',
        controller: 'reportLookCtrl',
        dependencies: ['../js/controllers/report-ctrl.js', '../js/directives/report-dom.js', '../js/directives/tools-dom.js']
      },
      '/reportrule': {
        templateUrl: '../partials/reportRule.html',
        controller: 'reportRuleCtrl',
        dependencies: ['../js/controllers/report-ctrl.js', '../js/directives/report-dom.js']
      },
      '/report/:type/:value': {
        templateUrl: '../partials/reportTree.html',
        controller: 'ReportTreeCtrl',
        dependencies: ['../js/controllers/report-ctrl.js', '../js/directives/report-dom.js']
      },
      '/system': {
        templateUrl: 'partials/system.html',
        controller: 'systemCtrl',
        dependencies: ['js/controllers/mail-ctrl.js', 'js/directives/user-dom.js']
      },
      '/timeline/:ciid': {
        templateUrl: 'partials/timeline.html',
        controller: 'ViewTimeLineCtrl',
        dependencies: ['../js/controllers/view-timeline-ctrl.js', '../js/directives/timeline-dom.js']
      },
      '/usergroup': {
        templateUrl: 'partials/usergroup.html',
        controller: 'userGroupCtrl',
        dependencies: ['js/controllers/user-group-ctrl.js', 'js/directives/usergroup-dom.js']
      },
      '/instructionStrategy': {
        templateUrl: 'partials/instruction_strategy.html',
        controller: 'instructCtrl',
        dependencies: ['js/controllers/energy-ctrl.js', '../js/directives/data-tables-dom.js', '../js/directives/tools-dom.js', '../js/directives/fb-tools-dom.js', '../js/directives/select-list-dom.js']
      },
      '/instructionStrategy/:instrId': {
        templateUrl: 'partials/instruction_strategy_detail.html',
        controller: 'instructCtrl',
        dependencies: ['js/controllers/energy-ctrl.js', 'js/directives/energy-dom.js', '../js/directives/data-tables-dom.js', '../js/directives/tools-dom.js',
          '../js/directives/fb-tools-dom.js', '../js/directives/select-list-dom.js'
        ]
      },
      '/datamodel': {
        templateUrl: 'partials/datamodel.html',
        controller: 'dataModelCtrl',
        dependencies: ['js/controllers/data-model-ctrl.js', '../js/directives/data-tables-dom.js', '../js/directives/tools-dom.js', '../js/directives/fb-tools-dom.js', '../js/directives/select-list-dom.js']
      },
      '/specialist/:id?': {
        templateUrl: 'partials/specialist.html',
        controller: 'specialistCtrl',
        dependencies: ['js/controllers/specialist-ctrl.js', '../js/directives/data-tables-dom.js', '../js/directives/tools-dom.js', '../js/directives/fb-tools-dom.js', '../js/directives/select-list-dom.js']
      },
      '/specialist/input/:id/:pos?': {
        templateUrl: 'partials/specialist_input.html',
        controller: 'specialistInputCtrl',
        dependencies: ['js/controllers/specialist-input-ctrl.js', '../js/directives/data-tables-dom.js', '../js/directives/tools-dom.js', '../js/directives/fb-tools-dom.js', '../js/directives/select-list-dom.js', '../js/directives/free-board-dom.js']
      },
      '/usermanager/:panel?': {
        templateUrl: 'partials/usermanager_list.html',
        controller: 'UserListCtrl',
        dependencies: ['js/controllers/user-list-ctrl.js', '../js/directives/data-tables-dom.js', '../js/directives/tools-dom.js', '../js/directives/fb-tools-dom.js', '../js/directives/select-list-dom.js']
      },
      '/usermanager/permission/:panel/:roleID': {
        templateUrl: 'partials/permission.html',
        controller: 'permissionCtrl',
        dependencies: ['js/controllers/permission_ctrl.js', '../js/directives/data-tables-dom.js', '../js/directives/tree-view-dom.js', '../js/directives/select-list-dom.js']
      },
      /**
      '/usermanager': {
        templateUrl: 'partials/usermanager_list.html',
        controller: 'UserListCtrl',
        dependencies: ['js/controllers/user-ctrl.js', 'js/directives/user-dom.js', '../js/directives/tools-dom.js', 'js/directives/treeview-dom.js']
      },
       */
      '/userclient': {
        templateUrl: 'partials/userclient.html',
        controller: 'UserClientCtrl',
        dependencies: ['js/controllers/client-ctrl.js', 'js/directives/user-dom.js', '../js/directives/tools-dom.js']
      },
      '/userclient/:type?/:id?': {
        templateUrl: 'partials/userclientInfo.html',
        controller: 'UserClientCtrl',
        dependencies: ['js/controllers/client-ctrl.js', 'js/directives/user-dom.js', '../js/directives/tools-dom.js']
      },
      '/dealerInfo': {
        templateUrl: 'partials/dealerInfo.html',
        controller: 'UserClientCtrl',
        dependencies: ['js/controllers/client-ctrl.js', 'js/directives/user-dom.js', '../js/directives/tools-dom.js']
      },
      '/alertRules/:nodeId?/:alertCode?': {
        templateUrl: 'partials/alert_rules.html',
        controller: 'alertRulesCtrl',
        dependencies: ['js/controllers/alert-rules-ctrl.js', 'js/directives/alert-rules-dom.js', '../js/directives/tools-dom.js']
      },
      '/alertRules/:type/:rulesId/:viewType': {
        templateUrl: 'partials/add_alert_rules.html',
        controller: 'alertRulesCtrl',
        dependencies: ['js/controllers/alert-rules-ctrl.js', 'js/directives/alert-rules-dom.js', '../js/directives/tools-dom.js']
      },
      '/alertInforms/:alertInformsId': {
        templateUrl: 'partials/alert_inform.html',
        controller: 'alertInformCtrl',
        dependencies: ['js/controllers/alert-rules-ctrl.js', 'js/directives/alert-rules-dom.js', '../js/directives/tools-dom.js']
      },
      '/alertClassification': {
        templateUrl: 'partials/alert_classification.html',
        controller: 'alertClassifyCtrl',
        dependencies: ['js/controllers/alert-rules-ctrl.js', 'js/directives/alert-rules-dom.js', '../js/directives/tools-dom.js']
      },
      '/usersuper': {
        templateUrl: 'partials/supermanager.html',
        controller: 'SuperListCtrl',
        dependencies: ['js/controllers/user-ctrl.js', 'js/directives/user-dom.js']
      },
      '/usersupplier': {
        templateUrl: 'partials/usersupplier.html',
        controller: 'userSupplierCtrl'
      },
      '/workorder': {
        templateUrl: '../partials/workorder.html',
        controller: 'WorkOrderCtrl',
        dependencies: ['../js/controllers/workorder-ctrl.js', '../js/directives/workorder-dom.js', '../js/directives/tools-dom.js', '../js/directives/timeline-dom.js']
      },
      '/workorder/:type/:id/:state': {
        templateUrl: '../partials/workorder.html',
        controller: 'WorkOrderCtrl',
        dependencies: ['../js/controllers/workorder-ctrl.js', '../js/directives/workorder-dom.js', '../js/directives/tools-dom.js', '../js/directives/timeline-dom.js']
      },
      '/workOrder/:state': {
        templateUrl: 'partials/workorder.html',
        controller: 'WorkOrderCtrl',
        dependencies: ['../js/controllers/workorder-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/workorder-dom.js']
      },
      '/workorder/:id': {
        templateUrl: 'partials/workorder.html',
        controller: 'WorkOrderCtrl',
        dependencies: ['../js/controllers/workorder-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/workorder-dom.js']
      },
      '/workorderrecord': {
        templateUrl: 'partials/workorder_record.html',
        controller: 'WorkOrderRecordCtrl',
        dependencies: ['js/controllers/workorder-record-ctrl.js', 'js/directives/workorder-record-dom.js']
      },
      '/workorderrecord/selectPart/:id': {
        templateUrl: 'partials/workorder_record_part.html',
        controller: 'WorkOrderRecordSelectPartCtrl',
        dependencies: ['js/controllers/workorder-record-ctrl.js', 'js/directives/workorder-record-dom.js', '../js/directives/tools-dom.js']
      },
      '/workorderrecord/partOrder/:id': {
        templateUrl: 'partials/workorder_record_part_order.html',
        controller: 'WorkOrderRecordPartOrderCtrl',
        dependencies: ['js/controllers/workorder-record-ctrl.js', 'js/directives/workorder-record-dom.js', '../js/directives/tools-dom.js']
      },
      '/workorderrecord/:nodeid': {
        templateUrl: 'partials/workorder_record.html',
        controller: 'WorkOrderRecordCtrl',
        dependencies: ['js/controllers/workorder-record-ctrl.js', 'js/directives/workorder-record-dom.js']
      },
      '/workOrderRecord/:state': {
        templateUrl: 'partials/workorder_record.html',
        controller: 'WorkOrderRecordCtrl',
        dependencies: ['js/controllers/workorder-record-ctrl.js', 'js/directives/workorder-record-dom.js']
      },
      '/workorderprocedure': {
        templateUrl: 'partials/workorder_procedure.html',
        controller: 'WorkOrderProcedureCtrl',
        dependencies: ['js/controllers/workorder-procedure-copy-ctrl.js', 'js/directives/workorder-procedure-copy-dom.js']
      },
      '/inspectionStandard': {
        templateUrl: 'partials/inspection_standard.html',
        controller: 'inspectionStandardCtrl',
        dependencies: ['js/controllers/inspection-standard-ctrl.js', 'js/directives/inspection-dom.js', '../js/directives/tools-dom.js']
      },
      '/inspectionRecords': {
        templateUrl: 'partials/inspection_records.html',
        controller: 'inspectionRecordsCtrl',
        dependencies: ['js/controllers/inspection-records-ctrl.js', 'js/directives/inspection-dom.js', '../js/directives/timeline-dom.js']
      },
      '/queryDeviceData': {
        templateUrl: 'partials/query_devicedata.html',
        controller: 'queryDeviceDataCtrl',
        dependencies: ['js/controllers/inspection-records-ctrl.js', '../js/directives/echarts-dom.js', 'js/directives/inspection-dom.js', '../js/directives/tools-dom.js', '../js/directives/timeline-dom.js', '../js/directives/base-dom.js']
      },
      '/teamgroup': {
        templateUrl: 'partials/teamgroup.html',
        controller: 'teamGroupCtrl',
        dependencies: ['js/controllers/team-group-ctrl.js', 'js/directives/teamgroup-dom.js', '../js/directives/tools-dom.js']

      },
      '/projectManagement/:customerId?/:deviceId?/:projectId?/:distributorId?': {
        templateUrl: 'partials/project-management.html',
        controller: 'projectManagementCtrl',
        dependencies: ['js/controllers/project-ctrl.js', 'js/directives/project-dom.js', '../js/directives/tools-dom.js']
      },
 '/projectDocumentation/:projectId?': {
        templateUrl: 'partials/project-management-template.html',
        controller: 'projectManagementTemplateCtrl',
        dependencies: ['js/controllers/project-ctrl.js']
        },

      '/contractTerms/:customerId?/:deviceId?/:contractId?': {
        templateUrl: 'partials/contract-terms.html',
        controller: 'contractTermsCtrl',
        dependencies: ['js/controllers/project-ctrl.js', 'js/directives/project-dom.js', '../js/directives/tools-dom.js']

      },
      '/faultKnowledge/:faultNo?': {
        templateUrl: 'partials/fault-knowledge.html',
        controller: 'faultKnowledgeCtrl',
        dependencies: ['js/controllers/project-ctrl.js', 'js/directives/project-dom.js', '../js/directives/tools-dom.js']

      },
      '/sparepart': {
        templateUrl: 'partials/sparepart.html',
        controller: 'sparePartCtrl',
        dependencies: ['js/controllers/sparepart-ctrl.js', 'js/directives/sparepart-dom.js', '../js/directives/tools-dom.js']

      },

      /*'/sparepartInfo/:spareinfoId?': {
        templateUrl: 'partials/sparepart-info.html',
        controller: 'sparePartInfoCtrl',
        dependencies: ['js/controllers/sparepart-ctrl.js', 'js/directives/sparepart-dom.js', '../js/directives/tools-dom.js', '../js/directives/timeline-dom.js']

      },*/
        '/sparepartInfo': {
            templateUrl: 'partials/sparepart-info.html',
            controller: 'sparePartInfoCtrl',
            dependencies: ['js/controllers/sparepart-ctrl.js','js/controllers/facility-ctrl.js', 'js/directives/sparepart-dom.js', '../js/directives/tools-dom.js', '../js/directives/timeline-dom.js']

        },
        '/sparepartInfo/:spareinfoId?/:queryState?': {
            templateUrl: 'partials/sparepartDetail.html',
            controller: 'sparePartInfoCtrl',
            dependencies: ['js/controllers/sparepart-ctrl.js', 'js/directives/sparepart-dom.js', '../js/directives/tools-dom.js', '../js/directives/timeline-dom.js']

        },
        //出入库明细查询
        '/getStockOrderItemsBySparePartId/:spareinfoId':{
            templateUrl: 'partials/sparepartDetail.html',
            controller: 'sparePartInOutDetailCtrl',
            dependencies: ['js/controllers/sparepart-ctrl.js', 'js/directives/sparepart-dom.js', '../js/directives/tools-dom.js', '../js/directives/timeline-dom.js']
        },
      '/putInSparepart': {
        templateUrl: 'partials/put-in-sparepart.html',
        controller: 'spareInPartCtrl',
        dependencies: ['js/controllers/sparepart-ctrl.js', 'js/directives/sparepart-dom.js', '../js/directives/tools-dom.js', '../js/directives/timeline-dom.js']

      },

      '/putOutSparepart': {
        templateUrl: 'partials/put-out-sparepart.html',
        controller: 'spareOutPartCtrl',
        dependencies: ['js/controllers/sparepart-ctrl.js', 'js/directives/sparepart-dom.js', '../js/directives/tools-dom.js', '../js/directives/timeline-dom.js']

      },
      '/dir/:type/:id': {
        templateUrl: 'partials/directive-send.html',
        controller: 'directiveSendCtrl',
        dependencies: ['js/controllers/directive-send-ctrl.js', 'js/directives/directive-send-dom.js']
      },
      '/workflow': {
        templateUrl: 'partials/work_flow.html',
        controller: 'workFlowCtrl',
        dependencies: ['js/controllers/workorder-procedure-copy-ctrl.js', 'js/directives/workorder-procedure-copy-dom.js', '../js/directives/tools-dom.js']
      },
      '/release': {
        templateUrl: 'partials/release.html',
        controller: 'processReleaseCtrl',
        dependencies: ['js/controllers/process-ctrl.js', 'js/directives/process-dom.js']
      },
      '/deviceTask/:status/:id': {
        templateUrl: 'partials/deviceTask.html',
        controller: 'processDetailCtrl',
        dependencies: ['js/controllers/workorder-record-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/workorder-record-dom.js']
      },
      '/workOrderTimeLine/:id': {
        templateUrl: 'partials/workOrderHistory.html',
        controller: 'workTimeLineCtrl',
        dependencies: ['js/controllers/workorder-record-ctrl.js', 'js/directives/workorder-record-dom.js']
      },
      '/processdesign': {
        templateUrl: 'partials/process-design.html',
        controller: 'processViewsCtrl',
        dependencies: ['js/controllers/process-ctrl.js', 'js/directives/process-dom.js']
      },
      '/reportTemplate': {
        templateUrl: 'partials/report-template-view.html',
        controller: 'reportTemplateCtrl',
        dependencies: ['js/controllers/report-manager-ctrl.js', 'js/directives/report-manager-dom.js', '../js/directives/tools-dom.js']
      },
      '/report/template': {
        templateUrl: 'partials/report-template-view.html',
        controller: 'reportTemplateCtrl',
        dependencies: ['js/controllers/report-manager-ctrl.js', 'js/directives/report-manager-dom.js', '../js/directives/tools-dom.js']
      },
      '/report/search': {
        templateUrl: 'partials/report-search-view.html',
        controller: 'reportSearchCtrl',
        dependencies: ['js/controllers/report-manager-ctrl.js', '../js/directives/tools-dom.js']
      },
      '/report/policy': {
        templateUrl: 'partials/report-policy-view.html',
        controller: 'reportPolicyCtrl',
        dependencies: ['js/controllers/report-manager-ctrl.js', 'js/directives/report-manager-dom.js', '../js/directives/tools-dom.js']
      },
      '/enterpriseInfo': {
        templateUrl: 'partials/enterprise_info.html',
        controller: 'enterpriseCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/EnterpriseOperateInfo/:enterpriseId?': {
        templateUrl: 'partials/enterprise_operate_info.html',
        controller: 'enterpriseOperateCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/productInfo/:enterpriseId?': {
        templateUrl: 'partials/product_info.html',
        controller: 'productCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/product/:enterpriseId?': {
        templateUrl: 'partials/product_list.html',
        controller: 'productCommonCtrl',
        dependencies: ['js/controllers/product-ctrl.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/productStructureInfo/:productId?': {
        templateUrl: 'partials/product_structure.html',
        controller: 'productStructureCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', 'js/directives/enterprise-dom.js', 'js/directives/energy-dom.js', '../js/directives/tools-dom.js']
      },
      '/energyStructureInfo/:enterpriseId?': {
        templateUrl: 'partials/energy_structure.html',
        controller: 'energyStructureCtrl',
        dependencies: ['js/controllers/energy-ctrl.js', 'js/directives/energy-dom.js', '../js/directives/tools-dom.js']
      },
      '/energySignatureInfo': {
        templateUrl: 'partials/energy_signature.html',
        controller: 'energySignatureCtrl',
        dependencies: ['js/controllers/energy-ctrl.js', 'js/directives/energy-dom.js', '../js/directives/tools-dom.js']
      },
      '/energySignatureInfo/:signatureId/:viewType?': {
        templateUrl: 'partials/add_energy_signature.html',
        controller: 'energySignatureCtrl',
        dependencies: ['js/controllers/energy-ctrl.js', 'js/directives/energy-dom.js', '../js/directives/tools-dom.js']
      },
      '/energyRecordTasks': {
        templateUrl: 'partials/consume_record_tasks.html',
        controller: 'energyTasksCtrl',
        dependencies: ['js/controllers/energy-ctrl.js', 'js/directives/energy-dom.js', '../js/directives/tools-dom.js']
      },
      '/InfoOnStateManagement': {
        templateUrl: 'partials/consume_record_tasks.html',
        controller: 'energyTasksCtrl',
        dependencies: ['js/controllers/energy-ctrl.js', 'js/directives/energy-dom.js', '../js/directives/tools-dom.js']
      },
      '/businessManagement': {
        templateUrl: 'partials/basic_business_info.html',
        controller: 'basicEnterpriseCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', '../js/directives/tools-dom.js']
      },
      '/basicBusinessInfo/:enterpriseId?': {
        templateUrl: 'partials/basic_business_info.html',
        controller: 'basicEnterpriseCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', '../js/directives/tools-dom.js']
      },
      '/publishManagement': {
        templateUrl: 'partials/publish_management_info.html',
        controller: 'publishCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/benchmarking': {
        templateUrl: 'partials/benchmarking_info.html',
        controller: 'benchMarkingCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', '../js/directives/echarts-dom.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/benchmarkSetting': {
        templateUrl: 'partials/benchmark_setting_info.html',
        controller: 'benchMarkSetCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', '../js/directives/echarts-dom.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/forecastManagement': {
        templateUrl: 'partials/forecast_managementinfo.html',
        controller: 'forecastCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', '../js/directives/echarts-dom.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/areaEnergyMap': {
        templateUrl: 'partials/area_energy_map.html',
        controller: 'areaEnergyCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', '../js/directives/echarts-dom.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/keyEnterprise': {
        templateUrl: 'partials/key_enterprise_info.html',
        controller: 'keyEnterpriseCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', '../js/directives/echarts-dom.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/queryEnterprise': {
        templateUrl: 'partials/query_enterprise_info.html',
        controller: 'queryEnterpriseCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', '../js/directives/echarts-dom.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/potentialPoint': {
        templateUrl: 'partials/potential_point_info.html',
        controller: 'potentialCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', '../js/directives/echarts-dom.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/deviceComparison': {
        templateUrl: 'partials/device_comparison_info.html',
        controller: 'deviceComparisonCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', '../js/directives/echarts-dom.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/efficiencyAssessment': {
        templateUrl: 'partials/energy_efficiency_ssessment.html',
        controller: 'assessmentCtrl',
        dependencies: ['js/controllers/enterprise-ctrl.js', '../js/directives/echarts-dom.js', 'js/directives/enterprise-dom.js', '../js/directives/tools-dom.js']
      },
      '/deviceLog/:gatewayId?': {
        templateUrl: 'partials/device_log.html',
        controller: 'deviceLogCtrl',
        dependencies: ['js/controllers/device-log-ctrl.js', 'js/directives/device-log-dom.js', '../js/directives/tools-dom.js']
      },

        '/facility': {//设备信息
            templateUrl: 'partials/facility_infor.html',
            controller: 'DeviceFacilityCtrl',
            dependencies: ['js/controllers/device_facility-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/treeview-dom.js', 'js/directives/device-facility-dom.js', '../js/directives/tools-dom.js']
        },
        '/facility/add_device': {//添加设备
            templateUrl: 'partials/add_device.html',
            controller: 'DeviceFacilityCtrl',
            dependencies: ['js/controllers/device_facility-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/treeview-dom.js', 'js/directives/device-facility-dom.js']
        },
        '/facility/facilitybook': {//设备台账
            templateUrl: 'partials/facility_infor.html',
            controller: 'DeviceFacilityCtrl',
            dependencies: ['js/controllers/device_facility-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/treeview-dom.js', 'js/directives/device-facility-dom.js', '../js/directives/tools-dom.js']
        },
        '/facility/:type?/:id?': {//根据类型/id 查询设备
            templateUrl: 'partials/facility_infor.html',
            controller: 'DeviceFacilityCtrl',
            dependencies: ['js/controllers/device_facility-ctrl.js', '../js/directives/tools-dom.js', 'js/directives/treeview-dom.js', 'js/directives/device-facility-dom.js', '../js/directives/tools-dom.js']
        },
        //线体管理 wjd20180911
        '/lineBodyManagement/:customerId?/:deviceId?/:projectId?/:distributorId?': {
            templateUrl: 'partials/lineBody.html',
            controller: 'lineBodyCtrl',
            dependencies: ['js/controllers/linebody-ctrl.js', 'js/directives/linebody-dom.js', '../js/directives/tools-dom.js']
        },
    }
  };
});
