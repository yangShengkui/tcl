(function(window, angular, undefined) {
  'use strict';
  var angularDialogueDirective = ["dialogue", "$timeout", function(dialogue, timeout){
    return {
      restrict : "A",
      priority : 600,
      templateUrl : "../partials/dialogue.html",
      link : function(scope, element, attr) {
        dialogue.onOpen = function(data){
          scope.dialogBox = data;
        }
        dialogue.onClose = function(){
          scope.dialogBox = undefined;
        }
        dialogue.onSetDisabled = function(index){
          scope.dialogBox.fnlist[index].disabled = true;
        }
        dialogue.onSetEnabled = function(index){
          scope.dialogBox.fnlist[index].disabled = false;
        }
        dialogue.onSetError = function(index, message){
          scope.dialogBox.input[index].error = message;
        }
      }
    }
  }];
  var angularDialogueProvider = function(){
    var self = this;
    this.$get = ["$timeout", function(timeout){
      var rs = {};
      rs.open = function(data){
        timeout(function(){
          rs.onOpen(data)
        });
      };
      rs.close = function(){
        timeout(function(){
          rs.onClose()
        });
      };
      rs.setDisabled = function(index){
        timeout(function(){
          rs.onSetDisabled(index);
        });
      };
      rs.setEnabled = function(index){
        timeout(function(){
          rs.onSetEnabled(index);
        });
      };
      rs.setError = function(index, message){
        timeout(function(){
          rs.onSetError(index, message);
        });
      };
      return rs;
    }];
  };
  angular.module("ngAngularDialogue",[])
    .directive("dialogue", angularDialogueDirective)
    .provider("dialogue", angularDialogueProvider)
})(window, angular);