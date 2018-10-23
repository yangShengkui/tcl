/**
 * Created by leonlin on 16/11/3.
 */
define(['commonMethod'], function(commonMethod){
  return function(data) {
    var self = new commonMethod(data);
    var regExp = /\{item\:(\w+)\}/;
    var getValue = function(str, item){
      if(regExp.test(str)){
        var val = $$.runRegExp(str, regExp, 1);
      } else {
        var val = str;
      };
      if(val){
        return eval("item." + val);
      } else {
        return val;
      }
    };
    var autoload = true;
    var resourceUIService = data.resourceUIService;
    var dictionaryService = data.dictionaryService;
    var global = data.global;
    var element = data.element;
    var timeout = data.timeout;
    var serviceCenterService = data.serviceCenterService;
    var resourceUIService = data.resourceUIService;
    var userLoginUIService = data.userLoginUIService;
    var customMethodService = data.customMethodService;
    var viewFlexService = data.viewFlexService;
    var wrap = $("<div></div>").addClass("input-group btn-group");
    var addOn = $("<button></button>")
      .addClass("btn btn-default")
      .css("padding", "6px 12px");
    var b = $("<b></b>").addClass("glyphicon glyphicon-refresh");
    addOn.append(b);
    var select = $("<select></select>")
      .addClass("multiselect");
    wrap.append(select);
    //wrap.append(addOn);
    var condition;
    $$.runExpression(element.advance.condition, function(funRes){
      if(funRes.code == "0"){
        var fnResult = funRes.data;
        if(typeof fnResult == 'function'){
          condition = fnResult(data);
        } else {
          condition = fnResult;
        }
        condition = condition ? condition : {};
      } else {
        throw new Error(funRes.message);
      }
    });
    var expression;
    $$.runExpression(element.advance.expression, function(funRes){
      if(funRes.code == "0"){
        var fnResult = funRes.data;
        if(typeof fnResult == 'function'){
          expression = fnResult(data);
        } else {
          expression = fnResult;
        }
        expression = expression ? expression : {};
      } else {
        expression = {};
        console.log(funRes.message);
        //throw new Error(funRes.message);
      }
    });
    self.getResources = function(callback){
      resourceUIService.getResources(function(event){
        if(event.code == 0){
          callback(event.data);
        }
      })
    };
    self.getKpisByModelId = function(modelId, callback){
      resourceUIService.getKpisByModelId(modelId, function(event){
        if(event.code == 0){
          callback(event.data);
        }
      })
    };
    self.getCurrentProjects = function(callback){
      resourceUIService.getDomainsByFilter({
        modelId : 302,
      }, function(event){
        if(event.code == 0){
          callback(event.data);
        }
      })
    };
    if(expression){
      autoload =  expression.$attr("formatter/autoload");
      if(autoload == undefined){
        autoload = true;
      }
    }
    if(expression.$attr("type") == "multiple"){
      select.attr("multiple", "multiple");
    } else {
      select.removeAttr("multiple");
    };
    if(element.style){
      wrap.css(element.style);
    };
    //var method = element.$attr("advance/getfunction") ? element.$attr("advance/getfunction") : 'kpiDataService.getValueList';
    var method = element.$attr("advance/getMultiSelect");
    element.setCondition = function(cond) {
      condition = cond;
    };
    element.renderData = function() {
      var params = [];
      var loop = function(item){
        if(typeof item == "function"){
          return item({
            global : global,
            tools : data,
            ui : element
          })
        } else {
          return item;
        }
      };
      for(var i in condition){
        params.push(loop(condition[i]));
      };
      var run = function(data){
        var initFn = expression.$attr("on/init");
        if(typeof initFn == "function"){
          try{
            initFn({
              global : global,
              target : element,
              self : self,
              tools : data,
              ui : element
            })
          } catch(e){
            console.log(e);
          };
        } else {
          element.render(data);
        };
      };
      if(method == 'models'){
        resourceUIService.getModels(function(event){
          if(event.code == 0){
            var allModels = [{
              id : "",
              label : "全部"
            }];
            run(allModels.concat(event.data));
          };
        })
      } else if(method == 'devices'){
        resourceUIService.getDevices(function(event){
          if(event.code == 0){
            run(event.data);
          }
        })
      } else if(method == 'projects'){
        resourceUIService.getDomainsByFilter({
          modelId : 302
        }, function(event){
          if(event.code == 0){
            run(event.data);
          }
        })
      } else if(method == 'domains'){
        resourceUIService.getDomainsByFilter({
          modelId : 300
        }, function(event){
          if(event.code == 0){
            run(event.data);
          }
        })
      } else if(method == 'enterprises'){
        resourceUIService.getEnterpriseDomainsByFilter({
          modelId: 303,
          layer: 2
        }, function(event) {
          if (event.code == 0) {
            event.data.unshift({
              id: '',
              label: '请选择'
            });
            run(event.data);
          }
        })
      } else if (method == 'industrys') {
        dictionaryService.getAllDicts(function(returnObj) {
          if (returnObj.code == 0) {
            var data = [];
            returnObj.data.forEach(function(item) {
              if (item.dictCode == 'industryShortType') {
                item.id = item.label;
                data.push(item);
              }
            });
            data.unshift({
              id: 0,
              label: '请选择',
              param: '请选择'
            });
            run(data);
          }
        });
      } else if (method == 'energys') {
        dictionaryService.getAllDicts(function(returnObj) {
          if (returnObj.code == 0) {
            var data = [];
            returnObj.data.forEach(function(item) {
              if (item.dictCode == 'energyType') {
                item.id = item.label;
                data.push(item);
              }
            });
            data.unshift({
              id: 0,
              label: '请选择',
            });
            run(data);
          }
        });
      }
      /**
      if(method.indexOf("serviceCenterService") == -1){
        params.push(function(event){
          if(event.code == 0){
            run(event.data);
          }
        });
       //console.log(method, params);
        eval(method).apply(null, params)
      } else {
        var success = function(dt){
          run(dt);
        };
        var call = method + "(" + params.toString() +  ")";
        //console.log(call);
        eval(call).then(success);
      }
       */
    };
    self.getViewByProjectId = function(resId, callback){
      //viewFlexService.getAllMyViews(function(event){
      viewFlexService.getViewsOnlyPublishedByTypeAndDomainPath('configure', userLoginUIService.user.domainPath, function(event){
        var views = event.data;
        var find = views.find(function(view){
          if(view.template){
            if(view.template.resourceType == "project"){
              if(view.template.resourceId == resId){
                return true;
              }
            }
          }
          return false;
        });
        if(find){
          viewFlexService.getViewById(find.viewId, function(event){
            if(event.code == 0){
              callback(event.data);
            }
          })
        } else {
          callback(null);
        }
      })
    };
    element.render = function(data){
      var cur = this;
      var getSelect = function(){
        var arr = [];
        var filter = wrap.find("ul.dropdown-menu li.active");
        filter.each(function(index, element){
          var target = $(element).find("input");
          var find = data.find(function(ele){
            return ele.id == target.attr("value");
          });
          arr.push(find);
        });
        return arr;
      };
      element.getSelect = getSelect;
      var loop = function(item){
        var formatter = expression.$attr("formatter");
        if(formatter){
          var label = getValue(formatter.label, item);
          var value = getValue(formatter.value, item);
        };
        var option = $("<option></option>")
          .attr("value", value)
          .text(label);
        return option;
      };
      select.children().remove();
      for(var i in data){
        select.append(loop(data[i]));
      }
      var domready = function(){
        var toolReady = function(multiselect){
          var buttonText = function(options){
            if (options.length == 0) {
              return '无做出任何选择';
            } else if(options.length > 1) {
              return "已选择" + options.length + "个";
            } else {
              var selected = '';
              options.each(function() {
                selected += $(this).text() + ', ';
              });
              return selected.substr(0, selected.length -2);
            }
          };
          var onChange = function(elem, checked){
            var changeFn = expression.$attr("on/change");
            var values =1;
            if(typeof changeFn == "function"){
              try {
                changeFn({
                  target : element,
                  element : element,
                  global : global,
                  tools : data,
                  self : self,
                  values : getSelect(),
                  ui : {
                    values : getSelect()
                  }
                });
              } catch(e){
                console.log(e);
              }
            }
          };
          select.multiselect('destroy');
          select.multiselect({
            buttonWidth : wrap.parent().width(),
            buttonText: buttonText,
            onChange : onChange
          });
          /**
          addOn.on("click", function(event){
            console.log("click");
          });*/
        };
        $$.loadExternalJs(["bootstrap-multiselect"], toolReady);
      };
      timeout(domready);
    };
    self.render = element.render;
    if(autoload){
      element.renderData();
    }
    return wrap;
  }
});
