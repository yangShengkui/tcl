define([], function() {
  return {
    defaultRoutePath: '',
    routes: {
      '/servers' : {
        templateUrl: 'index.html'
      },
      '/configAlert': {
        templateUrl: 'partials/alerts.html',
        controller: 'ViewCtrl',
        dependencies: ['../js/controllers/view-ctrl.js', '../js/controllers/view-alert-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/equipment-malfunctions-dom.js']
      },
      '/configAlert/:nodeId': {
        templateUrl: '../partials/alert2.html',
        controller: 'ViewCtrl',
        dependencies: ['../js/controllers/view-ctrl.js', '../js/controllers/view-alert-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/equipment-malfunctions-dom.js']
      },
      '/designView2/:mode?': {
        templateUrl: '../partials/views.html',
        controller: 'ViewCtrl',
        dependencies: ['../js/controllers/view-ctrl.js', '../js/controllers/view-chart-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/echarts-dom.js']
      },
      '/display/:viewId/:type?': {
        templateUrl: 'partials/rappid.html',
        controller: 'RappidBaseCtrl',
        dependencies: ['../js/controllers/rappid-base-ctrl.js','../js/controllers/view-chart-ctrl.js','../js/controllers/configure-chart-ctrl.js','../js/directives/rappid-dom.js','../js/directives/echarts-dom.js']
      },
      '/emcsView/:id': {
        templateUrl: '../partials/viewemcs.html',
        controller: 'ViewEmcsCtrl',
        dependencies: ['../js/controllers/view-emcs-ctrl.js', '../js/directives/tools-dom.js']
      },
      '/expertcurve': {
        templateUrl: 'partials/yingtaiExpertCurve.html',
        controller: 'ExpertCurveCtrl',
        dependencies: ['js/controllers/yingtai-ctrl.js', 'js/directives/tglibrary-dom.js']
      },
      '/machine': {
        templateUrl: 'partials/machine.html',
        controller: 'ViewMachineCtrl',
        dependencies: ['js/controllers/view-machine-ctrl.js', 'js/directives/machine-dom.js']
      },
      '/freeboard/:page?/:parameter?': {
        templateUrl: 'partials/freeboard.html',
        controller: 'viewFreeboardCtrl',
        dependencies: ['js/controllers/view-freeboard-ctrl.js', '../js/directives/free-board-dom.js']
      },
      '/machine/detail/:nodeId': {
        templateUrl: 'partials/machine.html',
        controller: 'ViewMachineCtrl',
        dependencies: ['js/controllers/view-machine-ctrl.js', 'js/directives/machine-dom.js']
      },
      '/machine/edit/:solutionId/:modelId': {
        templateUrl: 'partials/machine_edit.html',
        controller: 'ViewMachineEdit',
        dependencies: ['js/controllers/view-machine-ctrl.js', 'js/directives/machine-dom.js']
      },
      '/machine/absolute/:modelId': {
        templateUrl: 'partials/machine_edit.html',
        controller: 'ViewMachineEdit',
        dependencies: ['js/controllers/view-machine-ctrl.js', 'js/directives/machine-dom.js']
      },
      '/nongye': {
        templateUrl: 'partials/dashboard3.html',
        controller: 'ViewSensorCtrl',
        dependencies: ['js/controllers/view-sensor-ctrl.js', '../js/controllers/view-maps2-ctrl.js',
          '../js/directives/tools-dom.js', '../js/directives/echarts-dom.js'
        ]
      },
      '/nongye/:nodeId/:level': {
        templateUrl: 'partials/dashboard3.html',
        controller: 'ViewSensorCtrl',
        dependencies: ['js/controllers/view-sensor-ctrl.js', '../js/controllers/view-maps2-ctrl.js',
          '../js/directives/tools-dom.js', '../js/directives/echarts-dom.js'
        ]
      },
      '/resources': {
        templateUrl: '../partials/resources.html',
        controller: 'ViewCmdbDevCtrl',
        dependencies: ['../js/controllers/view-cmdb-dev-ctrl.js', '../js/directives/tools-dom.js', '../js/directives/cmdb-dom.js']
      },
      '/resource/:modelId/:nodeId': {
        templateUrl: '../partials/resource_device.html',
        controller: 'ViewCmdbDevCtrl',
        dependencies: ['../js/controllers/view-cmdb-dev-ctrl.js', '../js/controllers/view-maps2-ctrl.js',
          '../js/directives/tools-dom.js', '../js/directives/echarts-dom.js', '../js/directives/cmdb-dom.js'
        ]
      },
      '/resource_type': {
        templateUrl: '../partials/resource_type.html',
        controller: 'ViewCmdbDevCtrl',
        dependencies: ['../js/controllers/view-cmdb-dev-ctrl.js', '../js/directives/tools-dom.js',
          '../js/directives/attr-dom.js', '../js/directives/kpi-dom.js', '../js/directives/alert-simple-dom.js', '../js/directives/directives-dom.js'
        ]
      },
      '/resource_type/:modelId/:alertCode': {
        templateUrl: '../partials/resource_type.html',
        controller: 'ViewCmdbDevCtrl',
        dependencies: ['../js/controllers/view-cmdb-dev-ctrl.js', '../js/directives/tools-dom.js',
          '../js/directives/attr-dom.js', '../js/directives/kpi-dom.js', '../js/directives/alert-simple-dom.js', '../js/directives/directives-dom.js'
        ]
      },
      '/report/:type/:value': {
        templateUrl: '../partials/reportTree.html',
        controller: 'ReportTreeCtrl',
        dependencies: ['../js/controllers/report-ctrl.js', '../js/directives/report-dom.js']
      },
      '/tongji/prev': {
        templateUrl: 'partials/tglibraryPrev.html',
        controller: 'tglibraryPrevCtrl',
        dependencies: ['js/controllers/tglibrary-ctrl.js', 'js/directives/tglibrary-dom.js']
      },
      '/tongji/detail/:deviceGroupId': {
        templateUrl: 'partials/tglibrary.html',
        controller: 'tglibraryCtrl',
        dependencies: ['js/controllers/tglibrary-ctrl.js', 'js/directives/tglibrary-dom.js']
      },
      '/tongji/edit/:solutionId/:deviceGroupId?': {
        templateUrl: 'partials/tgedit.html',
        controller: 'tgedit',
        dependencies: ['js/controllers/tglibrary-ctrl.js', 'js/directives/tglibrary-dom.js']
      },
      '/tongji/modeledit/:solutionId/:groupId': {
        templateUrl: 'partials/tgedit.html',
        controller: 'tgedit',
        dependencies: ['js/controllers/tglibrary-ctrl.js', 'js/directives/tglibrary-dom.js']
      },
      '/timeline/:ciid': {
        templateUrl: '../partials/timeline.html',
        controller: 'ViewTimeLineCtrl',
        dependencies: ['../js/controllers/view-timeline-ctrl.js', '../js/directives/timeline-dom.js']
      },
      '/workorder': {
        templateUrl: '../partials/workorder.html',
        controller: 'WorkOrderCtrl',
        dependencies: ['../js/controllers/workorder-ctrl.js', '../js/directives/workorder-dom.js']
      }
    }
  }
});