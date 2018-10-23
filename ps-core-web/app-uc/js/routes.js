define([], function() {
  return {
    defaultRoutePath: '',
    routes: {
      '/register': {
        templateUrl: 'partials/register.html',
        controller: 'registerCtr',
        dependencies: ['js/controllers/approve-ctrl.js']
      },
      '/feature': {
        templateUrl: 'partials/feature.html'
      },
      '/approve': {
        templateUrl: 'partials/approve.html',
        controller: 'approveCtrl',
        dependencies: ['js/controllers/approve-ctrl.js']
      },
      '/personal': {
        templateUrl: 'partials/personal.html',
        controller: 'personalController',
        dependencies: ['js/controllers/user-ctrl.js']
      },
      '/enterprise': {
        templateUrl: 'partials/enterprise.html',
        controller: 'personalController',
        dependencies: ['js/controllers/user-ctrl.js']
      },
      '/forgetPwd': {
        templateUrl: 'partials/forgetPwd.html',
        controller: 'forgetPwdController',
        dependencies: ['js/controllers/user-ctrl.js']
      },
      '/security': {
        templateUrl: 'partials/security.html'
      },
      '/message': {
        templateUrl: 'partials/message.html',
        controller: 'AllMessageCtrl',
        dependencies: ['js/controllers/message-ctrl.js']
      },
      '/messageDetail/:msgId': {
        templateUrl: 'partials/messageDetail.html',
        controller: 'messageDetailCtrl',
        dependencies: ['js/controllers/message-ctrl.js']
      },
      '/unread': {
        templateUrl: 'partials/message.html',
        controller: 'AllMessageCtrl',
        dependencies: ['js/controllers/message-ctrl.js']
      },
      '/expenses': {
        templateUrl: 'partials/expenses.html',
        controller: 'expensesPreviewCtrl',
        dependencies: ['js/controllers/expenses-manage-ctrl.js']
      },
      '/record': {
        templateUrl: 'partials/record.html',
        controller: 'expensesRecordCtrl',
        dependencies: ['js/controllers/expenses-manage-ctrl.js']
      },
      '/renew': {
        templateUrl: 'partials/renew.html',
        controller: 'expensesRenewCtrl',
        dependencies: ['js/controllers/expenses-manage-ctrl.js']
      },
      '/renew/:orderNo': {
        templateUrl: 'partials/renew.html',
        controller: 'expensesRenewCtrl',
        dependencies: ['js/controllers/expenses-manage-ctrl.js']
      },
      '/read': {
        templateUrl: 'partials/message.html',
        controller: 'AllMessageCtrl',
        dependencies: ['js/controllers/message-ctrl.js']
      }
    }
  };
});