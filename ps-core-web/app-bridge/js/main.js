window.debug = false;
var config = {
  urlArgs: "==version==",
  waitSeconds : 0,
  baseUrl: 'js',
  paths: {
    'jquery': '../../bower_components/jquery/dist/jquery.min',
    'angular': '../../bower_components/angular/angular.min',
    'angular-route': '../../bower_components/angular-route/angular-route.min',
    'angular-resource': '../../bower_components/angular-resource/angular-resource.min',
    'angular-animate': '../../bower_components/angular-animate/angular-animate.min',
    'angular-growl': '../../bower_components/angular-growl-v2/build/angular-growl.min',
    'angular-style':'../../toolkit/angular-custom/angular-style',
    'angular-popup':'../../toolkit/angular-custom/angular-popup',
    'jquery-ui' : "../../bower_components/jquery-ui/jquery-ui.min",
    'jquery-cookie' : "../../bower_components/jquery.cookie/jquery.cookie",
    'jquery-session' : "../../toolkit/jquery-session",
    'underscore' : '../../bower_components/underscore/underscore',
    'domReady' : '../../bower_components/requirejs-domready/domReady',
    'zrColor' : '../../../bower_components/zrender/src/tool/color',
    'slimscroll': '../../bower_components/jquery-slimScroll/jquery.slimscroll.min',
    'macarons': '../../bower_components/echarts/theme/macarons',
    'spectrum' : '../../bower_components/spectrum/spectrum',
    'echarts': '../../bower_components/echarts/dist/echarts.min',
    'bootstrap': '../../bower_components/bootstrap/dist/js/bootstrap.min',
    'bootstrap-dialog': '../../bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min',
    'bootstrap-multiselect': '../../bower_components/bootstrap-multiselect/dist/js/bootstrap-multiselect',
    'bmap': '../../bower_components/echarts/dist/extension/bmap.min',
    'd3' : '../../bower_components/d3/d3.min',
    'd3-scale' : '../../bower_components/d3/d3.min',
    'd3-transition' : '../../bower_components/d3-transition/build/d3-transition.min',
    'lodash': '../../bower_components/lodash/lodash',
    'rappid-joint': '../../toolkit/rappid/dist/rappid',
    'config' : 'config',
    'directive' : 'directives/index',
    'service' : 'services/index',
    'filter' : 'filters/index',
    'value' : 'values/index',
    'index-app': '../../toolkit/admin-lte/app',
    'controller' : 'controllers/index',
    'optionDataHandler' : 'toolkit/optionDataHandler',
    'profile' : 'toolkit/profile',
    'modelPanel' : 'toolkit/modelPanel',
    'setting' : 'toolkit/setting',
    'dom' : 'toolkit/dom',
    'static' : 'toolkit/static',
    'codeMirrorEditor' : 'toolkit/codeMirror',
    'colorPicker' : 'toolkit/colorPicker',
    'grid_controller' : 'toolkit/grid_controller',
    'echart_creator' : 'toolkit/echart_creator',
    'optionEdit' : 'toolkit/optionEdit',
    'commonlib' : '../../toolkit/commonLib/js/lib/commonlib',
    'Array' : '../../toolkit/commonLib/js/lib/Array',
    'sparkline': '../../toolkit/sparkline/dist/jquery.sparkline.min',
    'tools' : '../../toolkit/tools',
    'app' : 'app',
    'backbone': '../../bower_components/backbone/backbone',
    'baiduMap': 'https://api.map.baidu.com/getscript?v=2.0&ak=eMekSXxqG1j2wLM57RFN61l8T6eB1EDx&services=',
    'echartsall' : '../../toolkit/echart-addon/echarts-all',
    'dataTools' : '../../toolkit/echart-addon/dataTool.min',
    'contextmenu' : '../../toolkit/contextmenu/contextmenu',
    'handsontable' : '../../bower_components/handsontable/dist/handsontable.full',
    'loader' : '../../js/loader',
    'simulate' : '../../toolkit/component/simulate',
    'simulate_time' : '../../toolkit/component/simulate_time',
    'commonMethod' : '../../toolkit/component/commonMethod'
  },
  shim: {
    'echart_v2' : { exports: 'echarts' },
    'index-app' : { deps: ['jquery', 'jquery-ui'] },
    'slimscroll': {
      deps: ['jquery']
    },
    'tools' : {
      deps: ['jquery']
    },
    'bootstrap-multiselect': {
      deps: ['jquery', 'bootstrap']
    },
    'jquery' : { exports: 'jquery' },
    'jquery-ui' : { deps: ['jquery'] },
    'jquery-cookie' : { deps: ['jquery'] },
    'jquery-session' : { deps : ['jquery'] },
    'contextmenu' : { deps: ['jquery'] },
    'spectrum' : { deps: ['jquery'] },
    'angular' : { exports: 'angular' },
    'angular-route': { deps: ['angular'] },
    'angular-resource' : { deps: ['angular'] },
    'angular-animate' : { deps: ['angular'] },
    'angular-growl': { deps: ['angular'] },
    'angular-style': { deps: ['angular'] },
    'angular-popup': { deps: ['angular'] },
    'underscore' : {exports : '_'},
    'zrender' : {experts : 'zrender'},
    'bootstrap': {
      deps: ['jquery']
    }
  },
  deps: ['angular-bootstrap', 'tools', 'Array', 'slimscroll', 'jquery-ui','index-app', 'bootstrap-multiselect', 'contextmenu', 'loader', "jquery"]
}
if(window.debug == true)
{
  config.paths.angular = '../../toolkit/angular-for-debug'
}
require.config(config);