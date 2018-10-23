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
        'jquery' : "../../bower_components/jquery/dist/jquery",
        'jquery-ui' : "../../bower_components/jquery-ui/jquery-ui",
        'underscore' : '../../bower_components/underscore/underscore',
        'domReady' : '../../bower_components/requirejs-domready/domReady',
        'zrColor' : '../../bower_components/zrender/src/tool/color',
        'config' : 'config',
        'controllers' : 'controllers/index',
        'services' : 'services/index',
        'filters' : 'filters/index',
        'directives' : 'directives/index',
        'values' : 'values/index',
        'app' : 'app',
        'baiduMap' : 'toolkit/baiduMap',
        'ps-components' : '../../node_modules/proudsmart-components/dist/ps-components',

        'commonlib' : '../../toolkit/commonLib/js/lib/commonlib'
    },
    shim: {
        'jquery' : { exports: 'jquery' },
        'ps-components' : {
            deps: ['angular']
        },
        'jquery-ui' : { deps: ['jquery'] },
        'angular' : { exports: 'angular' },
        'angular-route': { deps: ['angular'] },
        'angular-resource' : { deps: ['angular'] },
        'angular-animate' : { deps: ['angular'] },
        'angular-growl': { deps: ['angular'] },
        'zrender' : {experts : 'zrender'}
    },
    deps: ['angular-bootstrap']
});