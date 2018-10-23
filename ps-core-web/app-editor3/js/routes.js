define([], function() {
  return {
    defaultRoutePath: '',
    routes: {
      '/configure/:viewId': {
        templateUrl: 'partials/header.html',
        controller: 'Editor3Ctrl',
        dependencies: ['js/controllers/editor3d-view-ctrl.js','../js/directives/tools-dom.js']
      }
    }
  };
});