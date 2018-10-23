define([], function() {
  return {
    defaultRoutePath: '',
    routes: {
      '/myView': {
        templateUrl: 'partials/myself.html',
        controller: 'userAppControllers',
        dependencies: ['js/controllers/view-ctrl.js','../js/directives/tools-dom.js']
      },
      '/index/:industryId?': {
        templateUrl: 'partials/index_detail.html',
        controller: 'myViewCtrl',
        dependencies: ['js/controllers/view-ctrl.js']
      },
      '/modelsGroup': {
        templateUrl: 'partials/modelsgroup.html',
        controller: 'CmdbSolutionCtrl',
        dependencies: ['js/controllers/cmdb-solution-ctrl.js','../js/directives/kpi-dom.js','../js/directives/attr-dom.js',
        '../js/directives/alert-simple-dom.js','../js/directives/directives-dom.js','../js/directives/tools-dom.js']
      },


      '/models': {
        templateUrl: 'partials/models.html',
        controller: 'CmdbSolutionCtrl',
        //当前控制器，指标组件，属性组件，告警组件，指令组件，
      //  dependencies: ['js/controllers/cmdb-solution-ctrl.js','../js/directives/kpi-dom.js','../js/directives/attr-dom.js',
        //    '../js/directives/alert-simple-dom.js','../js/directives/directives-dom.js','../js/directives/tools-dom.js']
        //},
        //当前控制器，数据项组件，属性组件，采集组件，指令组件，
        dependencies: ['js/controllers/cmdb-solution-ctrl.js','../js/directives/resource-dom.js','../js/directives/attr-dom.js',
       '../js/directives/directives-dom.js','../js/directives/tools-dom.js']
      },


      '/dashboard/:mode/:solutionId?': {
        templateUrl: '../partials/dashboard_ver2.html',
        controller: 'Dashboard_ver2Ctrl',
        dependencies: ['../js/controllers/dashboard-ver2-ctrl.js','../js/directives/dashboard-dom.js']
      },
      '/queryAll/:industryId': {
        templateUrl: 'partials/allsolution.html',
        controller: 'queryAllCtrl',
        dependencies: ['js/controllers/view-ctrl.js']
      }
    }
  };
});