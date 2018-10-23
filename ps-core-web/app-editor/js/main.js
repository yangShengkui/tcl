require.config({
  urlArgs: "==version==",
  waitSeconds: 0,
  baseUrl: 'js',
  paths: {
    'angular': '../../bower_components/angular/angular.min',
    'angular-route': '../../bower_components/angular-route/angular-route.min',
    'angular-resource': '../../bower_components/angular-resource/angular-resource.min',
    'angular-animate': '../../bower_components/angular-animate/angular-animate.min',
    'angular-growl': '../../bower_components/angular-growl-v2/build/angular-growl.min',
    'jquery': "../../bower_components/jquery/dist/jquery",
    'jquery-ui': "../../bower_components/jquery-ui/jquery-ui",
    'underscore': '../../bower_components/underscore/underscore',
    'domReady': '../../bower_components/requirejs-domready/domReady',
    'zrColor': '../../../bower_components/zrender/src/tool/color',
    'spectrum': '../../bower_components/spectrum/spectrum',
    'echarts': '../../bower_components/echarts/dist/echarts.min',
    'd3': '../../bower_components/d3/d3.min',
    'config': 'config',
    'controllers': 'controllers/index',
    'directives': 'directives/index',
    'services': 'services/index',
    'filters': 'filters/index',
    'values': 'values/index',
    'controller': 'controllers/index',
    'optionDataHandler': 'toolkit/optionDataHandler',
    'profile': 'toolkit/profile',
    'modelPanel': 'toolkit/modelPanel',
    'setting': 'toolkit/setting',
    'dom': 'toolkit/dom',
    'static': 'toolkit/static',
    'codeMirrorEditor': 'toolkit/codeMirror',
    'colorPicker': 'toolkit/colorPicker',
    'grid_controller': 'toolkit/grid_controller',
    'echart_creator': 'toolkit/echart_creator',
    'optionEdit': 'toolkit/optionEdit',
    'commonlib': '../../toolkit/commonLib/js/lib/commonlib',
    'Array': '../../toolkit/commonLib/js/lib/Array',
    'app': 'app',
    'ps-components' : '../../node_modules/proudsmart-components/dist/ps-components'
  },
  shim: {
    'echart_v2': {
      exports: 'echarts'
    },
    'ps-components' : {
        deps: ['angular']
    },
    'jquery': {
      exports: 'jquery'
    },
    'jquery-ui': {
      deps: ['jquery']
    },
    'spectrum': {
      deps: ['jquery']
    },
    'angular': {
      exports: 'angular'
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
    'underscore': {
      exports: '_'
    },
    'zrender': {
      experts: 'zrender'
    }
  },
  deps: ['angular-bootstrap']
});