define(['controllers/controllers','Array'], function (controllers) {
  'use strict';
  controllers.initController('specialistCtrl', ['$scope', '$q', '$rootScope', '$location', '$routeParams', '$timeout', 'kqiManagerUIService', 'userRoleUIService', 'resourceUIService','userLoginUIService', 'Info', 'growl', 'userEnterpriseService', 'viewFlexService','userDomainService', "$window", "freeboardservice", 'dialogue', "ngDialog", "specialListService",
    function (scope, q, rootScope, $location, $routeParams, timeout, kqiManagerUIService, userRoleUIService, resourceUIService, userLoginUIService, Info, growl, userEnterpriseService, viewFlexService, userDomainService, window, freeboardservice, dialogue, ngDialog, specialListService) {
      scope.addNewClick = function(){
        $location.path("specialist/input/0");
      };
      scope.expertModelType = $routeParams.id;
      var expertClick = function(){
        //scope.expertModelType = this.id;
        $location.path("specialist/" + this.id);
      };
      scope.expertModelTypes = specialListService(expertClick);
      scope.filterExpertType = function(elem){
        if(elem.expertModelType == 1){
          return !scope.kqiModels.some(function(el){
            return el.originalId == elem.id;
          }) && elem.expertModelType == scope.expertModelType;
        } else {
          return elem.expertModelType == scope.expertModelType;
        }
      };
      var getAllExpertDataModels = function(callback){
        kqiManagerUIService.getAllExpertDataModels(function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
        /**
        $$.cacheAsyncData.call(kqiManagerUIService.getAllExpertDataModels, [], function(event){
          if(event.code == 0){
            callback(event.data);
          }
        }, false);*/
      };
      var getExpertDataModels = function(callback){
        kqiManagerUIService.getExpertDataModels(function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
        /**
        $$.cacheAsyncData.call(kqiManagerUIService.getExpertDataModels, [], function(event){
          if(event.code == 0){
            callback(event.data);
          }
        }, false);*/
      };
      var applyExpertDataModel = function(id, callback){
        kqiManagerUIService.applyExpertDataModel(id, function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
      };
      var saveKqiModel = function(param, callback){
        kqiManagerUIService.saveKqiModel(param, function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });
      };
      var deleteKqiModel = function(id, callback){
        kqiManagerUIService.deleteKqiModel(id, function(event){
          if(event.code == 0){
            callback(event);
          }
        })
      };
      var init = function(){
        getAllExpertDataModels(function(allkqiModels){
          getExpertDataModels(function(selfkqiModels){
            var kqiModels = [];
            for(var i in selfkqiModels){
              selfkqiModels[i].expertModelType = 0;
            };
            var extraKqiModels = allkqiModels.filter(function(elem){
              var some = selfkqiModels.some(function(el){
                return elem.id == el.id;
              });
              return !some;
            });
            for(var i in extraKqiModels){
              extraKqiModels[i].expertModelType = 1;
            }
            kqiModels = selfkqiModels.concat(extraKqiModels);
            //
            //kqiModels[0].expertModelType = 1;
            //
            if(kqiModels.length > 0){
              scope.kqiModels = kqiModels.map(function(elem){
                try {
                  elem.content = JSON.parse(elem.viewContent);
                } catch (e){
                  elem.content = null
                } finally {
                  return elem;
                }
              }).sort(function(a, b){
                var timea = a.modifyTime ? new Date(a.modifyTime).getTime() : 0;
                var timeb = b.modifyTime ? new Date(b.modifyTime).getTime() : 0;
                return timeb - timea;
              });
            } else {
              Info.get("../localdb/specialist.json", function(kqiModels){
                console.log(kqiModels);
                var repeat = function(kqiModel, callback){
                  saveKqiModel(kqiModel, function(result){
                    callback();
                  });
                };
                var finish = function(){
                  init();
                };
                $$.sloop.call(kqiModels, repeat, finish);
              });
            }
          })
        });
      };
      scope.publicModel = function(model){
        model.status = 10;
        saveKqiModel(model, function(event){
          growl.success("专家模型发布成功!!");
        });
      };
      scope.editModel = function(model){
        $location.path("specialist/input/" + model.id);
      };
      scope.applyModel = function(model){
        /**
        model.status = 10;
        var clone = model.$clone();
        delete clone.$$hashKey;
        clone.originalId = model.id;
        clone.expertModelType = 0;
        scope.kqiModels.push(clone);
        console.log(scope.kqiModels);*/
        /**
        scope.$apply(function(){
        scope.$apply(function(){
          //scope.kqiModels.push(model.$clone());
        });
          scope.kqiModels.push(model.$clone());
        });*/

        applyExpertDataModel(model.id, function(data){
          var clone = model.$clone();
          delete clone.$$hashKey;
          clone = clone.$extension(data);
          model.status = 10;
          data.expertModelType = 0;
          scope.kqiModels.push(clone);
          growl.success("已经成功应用模型!!");
        });
      };
      scope.removeModel = function(model){
        deleteKqiModel(model.id, function(event){
          if(event.code == "0"){
            scope.kqiModels.$remove(function(index, elem){
              return elem == model
            });
          }
        });
      };
      init();
    }
  ]);
});