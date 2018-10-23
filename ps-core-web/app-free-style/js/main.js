window.debug = false;
var config = {
  urlArgs: "==version==",
  waitSeconds : 0,
  baseUrl: 'js',
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
    'jquery-cookie': "../../node_modules/jquery.cookie/jquery.cookie",
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
    
    'zrColor': '../../node_modules/zrender/src/tool/color',
    
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
      
    'jquery-session': "../../toolkit/jquery-session",
    'jwplayer': '../../toolkit/jwplayer',
    'jwplayer.html5': '../../toolkit/jwplayer.html5',
    
    'keyboardJS': '../../node_modules/keyboardjs/dist/keyboard',
    
    'numberPrecision': '../../toolkit/number-precision',

    'rappid-joint': '../../toolkit/rappid/dist/rappid',

    'scrollbar': '../../toolkit/component/explainer/scrollbar',
    'simulate': '../../toolkit/component/simulate',
    'simulate_time': '../../toolkit/component/simulate_time',
    'sparkline': '../../toolkit/sparkline/dist/jquery.sparkline.min',
    'svgcharts': '../../toolkit/svgcharts/svgcharts',

    'toolkit': "../../toolkit",
    'tools': '../../toolkit/tools',
    
    'd3-transition' : '../../node_modules/d3-transition/build/d3-transition.min',
    'config' : 'config',
    'directive' : 'directives/index',
    'service' : 'services/index',
    'filter' : 'filters/index',
    'value' : 'values/index',
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
    'free-board': '../../toolkit/component/free-board',
    'app' : 'app',
    'echartsall' : '../../toolkit/echart-addon/echarts-all',
    'dataTools' : '../../toolkit/echart-addon/dataTool.min',
    'contextmenu' : '../../toolkit/contextmenu/contextmenu',
    'handsontable' : '../../node_modules/handsontable/dist/handsontable.full',
    'zeroclipboard' : '../../node_modules/zeroclipboard/dist/ZeroClipboard.min',
    'loader' : '../../js/loader',
    'autocomplete' : '../../toolkit/component/autocomplete',
    'html2canvas' :'../../node_modules/html2canvas/dist/html2canvas',
    'jsToBeautify' : '../../node_modules/js-to-beautify/dist/jsToBeautify',
  },
  shim: {
    'echart_v2' : { exports: 'echarts' },
    'index-app' : { deps: ['jquery', 'jquery-ui'] },
    'slimscroll': {
      deps: ['jquery']
    },
    'html2canvas': {
      deps: ['jquery']
    },
    'ps-components' : {
        deps: ['angular']
    },
    'bootstrap-multiselect': {
      deps: ['jquery', 'bootstrap']
    },
    'ng-dialog': {
      deps: ['angular']
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
    'angular-file-upload': {
      deps: ['angular']
    },
    'underscore' : {exports : '_'},
    'zrender' : {experts : 'zrender'},
    'angular-dialogue' : { deps: ['angular'] },
    'tools' : { deps : ['jquery']},
    'bootstrap': {
      deps: ['jquery']
    }
  },
  deps: ['angular-bootstrap', 'tools', 'html2canvas', 'Array', 'slimscroll', 'jquery-ui','index-app', 'bootstrap-multiselect', 'contextmenu', 'loader']
}
if(window.debug == true)
{
  config.paths.angular = '../../toolkit/angular-for-debug'
}
require.config(config);