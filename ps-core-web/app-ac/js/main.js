/**
 * 定义RequireJS配置
 */
require.config({
  urlArgs: "==version==",
  waitSeconds: 0,
  paths: {
    'baiduMap': 'https://api.map.baidu.com/getscript?v=2.0&ak=eMekSXxqG1j2wLM57RFN61l8T6eB1EDx&services=',

    'ace': '../../node_modules/ace-builds/src',
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

    'clipboard': '../../node_modules/clipboard/dist/clipboard.min',
    'ckeditor': '../../node_modules/ckeditor/ckeditor',
    'ckeditor-sample': "../../node_modules/ckeditor/samples/js/sample",

    'd3': '../../node_modules/d3/build/d3.min',
    'datatables.buttons.html5': '../../node_modules/datatables.net-buttons/js/buttons.html5.min',
    'datatables.buttons.flash': '../../node_modules/datatables.net-buttons/js/buttons.flash.min',
    'datatables.net': '../../node_modules/datatables.net/js/jquery.dataTables',
    'datatables.net-bs': '../../node_modules/datatables.net-bs/js/dataTables.bootstrap',
    'datatables.net-buttons': '../../node_modules/datatables.net-buttons/js/dataTables.buttons.min',
    'datatables.net-buttons-bs': '../../node_modules/datatables.net-buttons-bs/js/buttons.bootstrap.min',
    'datatables.net-select': '../../node_modules/datatables.net-select/js/dataTables.select.min',
    'dataTool': '../../node_modules/echarts/dist/extension/dataTool',
    'dark': '../../node_modules/echarts/theme/dark',
    'domReady': '../../node_modules/requirejs-domready/domReady',

    'echartGalleryJs': "../../node_modules/echarts-gl/dist/echarts-gl.min",
    'echarts': '../../node_modules/echarts/dist/echarts.min',

    'fastclick': '../../node_modules/fastclick/lib/fastclick',
    'fullcalendar': '../../node_modules/fullcalendar/dist/fullcalendar.min',

    'iCheck': '../../node_modules/icheck/icheck.min',

    'jquery': '../../node_modules/jquery/dist/jquery.min',
    'jquery-ui': '../../node_modules/components-jqueryui/jquery-ui.min',
    'jszip': '../../node_modules/jszip/dist/jszip',

    'laydate': '../../node_modules/layui-laydate/dist/laydate',
    'locales': '../../node_modules/moment/min/locales.min',
    'lodash': '../../node_modules/lodash/index',

    'macarons': '../../node_modules/echarts/theme/macarons',
    'moment': '../../node_modules/moment/min/moment.min',
    'multiselect': '../../node_modules/multiselect/js/jquery.multi-select',

    'ng-dialog': '../../node_modules/ng-dialog/js/ngDialog.min',

    'pdfmake': '../../node_modules/pdfmake/build/pdfmake.min',
    'ps-components' : '../../node_modules/proudsmart-components/dist/ps-components',

    'qrcode': '../../node_modules/jquery-qrcode/jquery.qrcode.min',

    'select2': '../../node_modules/select2/dist/js/select2.min',
    'slick': '../../node_modules/slick-carousel/slick/slick.min',
    'slimscroll': '../../node_modules/jquery-slimscroll/jquery.slimscroll.min',
    'spectrum': '../../node_modules/spectrum-colorpicker/spectrum',

    'table2excel': '../../node_modules/jquery-table2excel/dist/jquery.table2excel',

    'underscore': '../../node_modules/underscore/underscore-min',

    'vfs': '../../node_modules/pdfmake/build/vfs_fonts',

    'xlsx': '../../node_modules/js-xlsx/dist/xlsx.min',

    'ztree': '../../node_modules/ztree/js/jquery.ztree.core-3.5',
    'ztree-excheck': '../../node_modules/ztree/js/jquery.ztree.excheck-3.5',

    'angular-dialogue': '../../toolkit/angular-custom/angular-dialogue',
    'angular-popup': '../../toolkit/angular-custom/angular-popup',
    'angular-style': '../../toolkit/angular-custom/angular-style',
    'Array': '../../toolkit/commonLib/js/lib/Array',

    'BMapLib': '../../toolkit/component/BMapLib',

    'ckplayer': '../../toolkit/ckplayer/ckplayer',
    'clock': '../../toolkit/component/explainer/clock',
    'commonMethod': '../../toolkit/component/commonMethod',
    'component': "../../toolkit/component",
    'configs': '../../toolkit/configs',
    'cronGen': '../../toolkit/cronGen',
    'cronGen.min': '../../toolkit/cronGen.min',

    'dropdowntree': '../../toolkit/component/dropdowntree',

    'ezuikit': '../../toolkit/ezuikit',

    'index-app': '../../toolkit/admin-lte/app',

    'jwplayer': '../../toolkit/jwplayer',
    'jwplayer.html5': '../../toolkit/jwplayer.html5',

    'numberPrecision': '../../toolkit/number-precision',

    'rappid-joint': '../../toolkit/rappid/dist/rappid',

    'scrollbar': '../../toolkit/component/explainer/scrollbar',
    'simulate': '../../toolkit/component/simulate',
    'simulate_time': '../../toolkit/component/simulate_time',
    'sparkline': '../../toolkit/sparkline/dist/jquery.sparkline.min',
    'svgcharts': '../../toolkit/svgcharts/svgcharts',

    'toolkit': "../../toolkit",
    'tools': '../../toolkit/tools'
  },
  shim: {
    'angular': {
      exports: 'angular',
      deps: ['jquery']
    },
    'bootstrap': {
      deps: ['jquery']
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
    'slimscroll': {
      deps: ['jquery']
    },
    'tools': {
      deps: ['jquery','moment']
    },
    'configs': {
      deps: ['jquery']
    },
    'ps-components' : {
     deps: ['angular']
    },
    'bootstrap-dialog': {
      deps: ['jquery', 'bootstrap']
    },
    'ng-dialog': {
      deps: ['jquery', 'bootstrap']
    },
    'iCheck': {
      deps: ['jquery']
    },
    'slick': {
      deps: ['jquery', 'angular']
    },
    'bootstrap-treeview': {
      deps: ['jquery', 'bootstrap']
    },
    'bootstrap-multiselect': {
      deps: ['jquery', 'bootstrap']
    },
    'datatables.net': {
      deps: ['jquery']
    },
    'datatables.net-bs': {
      deps: ['jquery','datatables.net']
    },
    'datatables.net-select': {
      deps: ['jquery','datatables.net']
    },
    'index-app': {
      deps: ['slimscroll', 'bootstrap']
    },
    'select2': {
      deps: ['jquery', 'bootstrap']
    }
  },
  deps: [
    // kick start application... see bootstrap.js
//  'angular',
//  'slick',
//  'iCheck',
    'index-app',
//  'bootstrap-dialog',
//  'bootstrap-treeview',
//  'ng-dialog',
//  'slimscroll',
    'tools',
    'configs'
//  'select2',
//		'sparkline',
//  'datatables',
//  'datatables.net',
//  './angular-bootstrap',
//		'baiduMap',
//		'Array'
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
    'filters/filters',
    'values/values'
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