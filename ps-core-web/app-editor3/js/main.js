/**
 * 定义RequireJS配置
 */
require.config({
  urlArgs: "==version==",
  waitSeconds: 0,
  paths: {
    'baiduMap': 'https://api.map.baidu.com/getscript?v=2.0&ak=eMekSXxqG1j2wLM57RFN61l8T6eB1EDx&services=',

    'angular': '../../node_modules/angular/angular.min',
    'angular-animate': '../../node_modules/angular-animate/angular-animate.min',
    'angular-file-upload': '../../node_modules/angular-file-upload/dist/angular-file-upload.min',
    'angular-growl': '../../node_modules/angular-growl-v2/build/angular-growl.min',
    'angular-resource': '../../node_modules/angular-resource/angular-resource.min',
    'angular-route': '../../node_modules/angular-route/angular-route.min',

    'backbone': '../../node_modules/backbone/backbone-min',
    'bmap': '../../node_modules/echarts/dist/extension/bmap.min',
    'bootstrap': '../../node_modules/bootstrap/dist/js/bootstrap.min',
    'bootstrap-datetimepicker': '../../node_modules/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min',
    'bootstrap-daterangepicker': '../../node_modules/bootstrap-daterangepicker/daterangepicker',
    'bootstrap-dialog': '../../node_modules/bootstrap3-dialog/dist/js/bootstrap-dialog.min',
    'bootstrap-multiselect': '../../node_modules/bootstrap-multiselect/dist/js/bootstrap-multiselect',
    'bootstrap-switch': '../../node_modules/bootstrap-switch/dist/js/bootstrap-switch.min',
    'bootstrap-treeview': '../../node_modules/patternfly-bootstrap-treeview/dist/bootstrap-treeview.min',

    'datatables.buttons.html5': '../../node_modules/datatables.net-buttons/js/buttons.html5.min',
    'datatables.buttons.flash': '../../node_modules/datatables.net-buttons/js/buttons.flash.min',
    'datatables.net': '../../node_modules/datatables.net/js/jquery.dataTables',
    'datatables.net-bs': '../../node_modules/datatables.net-bs/js/dataTables.bootstrap',
    'datatables.net-buttons': '../../node_modules/datatables.net-buttons/js/dataTables.buttons.min',
    'datatables.net-buttons-bs': '../../node_modules/datatables.net-buttons-bs/js/buttons.bootstrap.min',
    'datatables.net-select': '../../node_modules/datatables.net-select/js/dataTables.select.min',
    'domReady': '../../node_modules/requirejs-domready/domReady',

    'echarts': '../../node_modules/echarts/dist/echarts.min',

    'jquery': '../../node_modules/jquery/dist/jquery.min',
    'jquery-ui': '../../node_modules/components-jqueryui/jquery-ui.min',

    'keyboardJS': '../../node_modules/keyboardjs/dist/keyboard',

    'locales': '../../node_modules/moment/min/locales.min',
    'lodash': '../../node_modules/lodash/index',

    'macarons': '../../node_modules/echarts/theme/macarons',
    'moment': '../../node_modules/moment/min/moment.min',

    'ng-dialog': '../../node_modules/ng-dialog/js/ngDialog.min',

    'select2': '../../node_modules/select2/dist/js/select2.min',
    'slimscroll': '../../node_modules/jquery-slimscroll/jquery.slimscroll.min',

    'underscore': '../../node_modules/underscore/underscore-min',

    'angular-style': '../../toolkit/angular-custom/angular-style',
    'Array': '../../toolkit/commonLib/js/lib/Array',
    'commonMethod': '../../toolkit/component/commonMethod',
    'index-app': '../../toolkit/admin-lte/app',
    'rappid-joint': '../../toolkit/rappid/dist/rappid',
    'toolkit': "../../toolkit",
    'tools': '../../toolkit/tools',
    'ps-components' : '../../node_modules/proudsmart-components/dist/ps-components'
  },
  shim: {
    'angular': {
      exports: 'angular',
      deps: ['jquery']
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'ps-components' : {
        deps: ['angular']
    },
    'angular-route': {
      deps: ['angular']
    },
    'angular-resource': {
      deps: ['angular']
    },
    'angular-animate': {
      deps: ['angular']
    },
    'angular-growl': {
      deps: ['angular']
    },
    'tools': {
      deps: ['jquery', 'moment']
    },
    'bootstrap-dialog': {
      deps: ['jquery', 'bootstrap']
    },
    'jquery-ui': {
      deps: ['jquery']
    },
    'index-app': {
      deps: ['slimscroll', 'bootstrap']
    },
    'slimscroll': {
      deps: ['jquery']
    },
    'select2': {
      deps: ['jquery', 'bootstrap']
    },
    'backbone': {
      deps: ['underscore']
    },
    'datatables.net': {
      deps: ['jquery']
    },
    'datatables.net-bs': {
      deps: ['jquery', 'datatables.net']
    },
    'datatables.net-select': {
      deps: ['jquery', 'datatables.net']
    },
    'bootstrap-multiselect': {
      deps: ['jquery', 'bootstrap']
    },
    'angular-style': {
      deps: ['angular']
    },
    'ng-dialog': {
      deps: ['angular']
    },
    'lodash': {
      exports: '_'
    }
  },
  deps: [
    // kick start application... see bootstrap.js
    'index-app',
    'tools'
  ]
});

require([
    'app',
    'routes',
    '../js/loader.js',
    //注意：这不是Twitter Bootstrap，而是AngularJS bootstrap
    'angular-bootstrap',
    //所创建的所有控制器、服务、指令及过滤器文件都必须写到这里，这块内容必须手动维护
    'controllers/controllers',
    '../js/services/services.js',
    'directives/directives',
    'filters/filters'
  ],

  function(app, config, loader) {
    'use strict';
    app.config([
      '$routeProvider',
      '$locationProvider',
      '$controllerProvider',
      '$compileProvider',
      '$filterProvider',
      '$provide',
      "$httpProvider",
      'growlProvider',
      function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider, growlProvider) {
        $locationProvider.hashPrefix(''); //Ag1.6版本默认路由为!
        app.registerController = $controllerProvider.register;
        app.registerDirective = $compileProvider.directive;
        app.registerFilter = $filterProvider.register;
        app.registerFactory = $provide.factory;
        app.registerService = $provide.service;

        if(config.routes != undefined) {
          angular.forEach(config.routes, function(route, path) {
            $routeProvider.when(path, {
              templateUrl: route.templateUrl,
              controller: route.controller,
              resolve: loader(route.dependencies)
            });
          });
        }

        if(config.defaultRoutePath != undefined) {
          $routeProvider.otherwise({
            redirectTo: config.defaultRoutePath
          });
        }
        growlProvider.globalTimeToLive({
          success: 3000,
          error: 5000,
          warning: 5000,
          info: 5000
        });
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
      }
    ]);
    return app;
  }
);