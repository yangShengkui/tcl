window.debug = false;
var config = {
  urlArgs: "==version==",
  waitSeconds: 0,
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
    'ps-tree' : "../../node_modules/proudsmart-tree/dist/ps-tree",
    'ngPstree' : "../../node_modules/proudsmart-tree/dist/ngPstree",
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
    'dataTool': '../../node_modules/echarts/dist/extension/dataTool.min',
    'dark': '../../node_modules/echarts/theme/dark',
    'domReady': '../../node_modules/requirejs-domready/domReady',

    'echartGalleryJs': "../../node_modules/echarts-gl/dist/echarts-gl.min",
    'echarts': '../../node_modules/echarts/dist/echarts.min',
    
    'fastclick': '../../node_modules/fastclick/lib/fastclick',
    'fullcalendar': '../../node_modules/fullcalendar/dist/fullcalendar.min',

    'Handsontable': '../../node_modules/handsontable/dist/handsontable.full',

    'iCheck': '../../node_modules/icheck/icheck.min',

    'jquery': '../../node_modules/jquery/dist/jquery.min',
    'jquery-cookie': "../../node_modules/jquery.cookie/jquery.cookie",
    'jquery-ui': '../../node_modules/components-jqueryui/jquery-ui.min',
    'jszip': '../../node_modules/jszip/dist/jszip',

    'keyboardJS': '../../node_modules/keyboardjs/dist/keyboard',

    'laydate': '../../node_modules/layui-laydate/dist/laydate',
    'locales': '../../node_modules/moment/min/locales.min',
    'lodash': '../../node_modules/lodash/index',

    'macarons': '../../node_modules/echarts/theme/macarons',
    'moment': '../../node_modules/moment/min/moment.min',
    'multiselect': '../../node_modules/multiselect/js/jquery.multi-select',

    'ng-dialog': '../../node_modules/ng-dialog/js/ngDialog.min',

    'select2': '../../node_modules/select2/dist/js/select2.min',
    'slick': '../../node_modules/slick-carousel/slick/slick.min',
    'slimscroll': '../../node_modules/jquery-slimscroll/jquery.slimscroll.min',
    'spectrum': '../../node_modules/spectrum-colorpicker/spectrum',

    'table2excel': '../../node_modules/jquery-table2excel/dist/jquery.table2excel',
    
    'underscore': '../../node_modules/underscore/underscore-min',

    'zrColor': '../../node_modules/zrender/src/tool/color',

    'loader': '../../js/loader',

    'angular-dialogue': '../../toolkit/angular-custom/angular-dialogue',
    'angular-popup': '../../toolkit/angular-custom/angular-popup',
    'angular-style': '../../toolkit/angular-custom/angular-style',
    'Array': '../../toolkit/commonLib/js/lib/Array',
    'autocomplete': '../../toolkit/component/autocomplete',

    'BMapLib': '../../toolkit/component/BMapLib',

    'ckplayer': '../../toolkit/ckplayer/ckplayer',
    'clock': '../../toolkit/component/explainer/clock',
    'codeMirrorEditor': 'toolkit/codeMirror',
    'commonlib': '../../toolkit/commonLib/js/lib/commonlib',
    'commonMethod': '../../toolkit/component/commonMethod',
    'component': "../../toolkit/component",
    'configs': '../../toolkit/configs',
    'contextmenu': '../../toolkit/contextmenu/contextmenu',

    'dropdowntree': '../../toolkit/component/dropdowntree',

    'ezuikit': '../../toolkit/ezuikit',

    'free-board': '../../toolkit/component/free-board',

    'index-app': '../../toolkit/admin-lte/app',

    'jwplayer': '../../toolkit/jwplayer',
    'jwplayer.html5': '../../toolkit/jwplayer.html5',

    'jquery-session': "../../toolkit/jquery-session",

    'ps-components' : '../../node_modules/proudsmart-components/dist/ps-components',

    'rappid-joint': '../../toolkit/rappid/dist/rappid',

    'simulate': '../../toolkit/component/simulate',
    'simulate_time': '../../toolkit/component/simulate_time',
    'sparkline': '../../toolkit/sparkline/dist/jquery.sparkline.min',
    'svgcharts': '../../toolkit/svgcharts/svgcharts',

    'threejsApp': '../../toolkit/threejsApp',
    
    'toolkit': "../../toolkit",
    'tools': '../../toolkit/tools',

    'colorPicker': 'toolkit/colorPicker',
    'dom': 'toolkit/dom',
    'echart_creator': 'toolkit/echart_creator',
    'grid_controller': 'toolkit/grid_controller',
    'modelPanel': 'toolkit/modelPanel',
    'optionDataHandler': 'toolkit/optionDataHandler',
    'optionEdit': 'toolkit/optionEdit',
    'profile': 'toolkit/profile',
    'setting': 'toolkit/setting',
    'static': 'toolkit/static',

    'app': 'app',
    'config': 'config',
    'controller': 'controllers/index',
    'directive': 'directives/index',
    'filter': 'filters/index',
    'service': 'services/index',
    'value': 'values/index',
    'jsToBeautify' : '../../node_modules/js-to-beautify/dist/jsToBeautify',

  },
  shim: {
    'ps-tree' : {
      exports: 'ps-tree'
    },
    'ngPstree' : {
      deps: ['ps-tree','angular']
    },
    'echart_v2': {
      exports: 'echarts'
    },
    'ps-components' : {
        deps: ['angular']
    },
    'index-app': {
      deps: ['jquery', 'jquery-ui']
    },
    'echartGalleryJs': {
      deps: ['echarts']
    },
    'slimscroll': {
      deps: ['jquery']
    },
    'bootstrap-multiselect': {
      deps: ['jquery', 'bootstrap']
    },
    'ng-dialog': {
      deps: ['angular']
    },
    'tools': {
      deps: ['jquery']
    },
    'jquery-ui': {
      deps: ['jquery']
    },
    'jquery-cookie': {
      deps: ['jquery']
    },
    'jquery-session': {
      deps: ['jquery']
    },
    'free-board': {
      deps: ['jquery']
    },
    'contextmenu': {
      deps: ['jquery']
    },
    'spectrum': {
      deps: ['jquery']
    },
    'angular': {
      exports: 'angular'
    },
    'configs': {
      deps: ['jquery']
    },
    'jwplayer': {
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
    'angular-style': {
      deps: ['angular']
    },
    'angular-dialogue': {
      deps: ['angular']
    },
    'angular-popup': {
      deps: ['angular']
    },
    'angular-file-upload': {
      deps: ['angular']
    },
    'underscore': {
      exports: '_'
    },
    'zrender': {
      experts: 'zrender'
    },
    'bootstrap': {
      deps: ['jquery']
    }
  },
  deps: ['angular-bootstrap', 'tools', 'Array', 'slimscroll', 'jquery-ui', 'index-app', 'bootstrap-multiselect', 'contextmenu', 'loader', 'configs']
}
if(window.debug == true) {
  config.paths.angular = '../../toolkit/angular-for-debug'
}
require.config(config);