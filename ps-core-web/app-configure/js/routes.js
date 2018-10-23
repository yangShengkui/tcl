define([], function() {
  return {
    defaultRoutePath: '',
    routes: {
      '/index': {
        templateUrl: 'partials/rappid-display.html',
        controller: 'ConfigureCtrl',
        dependencies: []
      },
      '/configure/:viewId': {
        templateUrl: 'partials/rappid.html',
        controller: 'RappidBaseCtrl',
        dependencies: ['../js/controllers/rappid-base-ctrl.js','../js/directives/rappid-dom.js','../js/directives/tools-dom.js']
      },
      '/display/:viewId': {
        templateUrl: 'partials/rappid.html',
        controller: 'RappidBaseCtrl',
        dependencies: ['../js/controllers/rappid-base-ctrl.js','../js/directives/rappid-dom.js','../js/directives/tools-dom.js']
      }
    }
  };
});