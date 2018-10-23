/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data)
  {
    var element = data.element;
    var global = data.global;
    var growl = data.growl;
    var constructor = element.constructor;
    var aceDom = $("<div></div>")
    if(element.style) {
      aceDom.css(element.style);
    };
    var events = {}
    var statue = "wait";
    var expression;
    $$.runExpression(element.$attr("advance/expression"), function(funRes){
      if(funRes.code == "0"){
        var fnResult = funRes.data;
        if(typeof fnResult == 'function'){
          expression = fnResult(data);
        } else {
          expression = fnResult;
        }
        expression = expression ? expression : {};
      } else {
        throw new Error(funRes.message);
      }
    });
    on = function(eventName, callback){
      events[eventName] = callback;
    };
    element.render = function(str){
      on("render", function(fun){
        fun(str);
      });
    };
    element.setText = function(str){
      on("setText", function(fun){
        fun(str);
      });
    };
    element.insert = function(str){
      on("insert", function(fun){
        fun(str);
      });
    };
    var initFn = expression.$attr("on/init");
    var changeFn = expression.$attr("on/change");
    $$.loadExternalJs(["ace/ace"], function (ace) {
      var completions = [{
        caption: 'target',
        value: 'target',
        metal: 'local'
      },{
        caption: 'event',
        value: 'event',
        metal: 'local'
      }];
      for (var key in constructor.prototype) {
        completions.push({
          caption: key,
          value: key,
          metal: 'local'
        });
      };
      typeof lnTools === "object" && typeof lnTools.addCompleter == "function" && lnTools.addCompleter({
        getCompletions: function (editor, session, pos, prefix, callback) {
          callback(null, completions);
        }
      });
      var render = function(str){
        var editor = ace.edit(aceDom[0]);
        editor.session.setMode("ace/mode/html");
        editor.setTheme("ace/theme/tomorrow");
        // enable autocompletion and snippets
        editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true
        });
        editor.on("change", function (event) {
          if(typeof changeFn == "function"){
            try{
              changeFn({
                target : element,
                global : global,
                value : editor.getValue()
              })
            }catch(e){
              console.log(e)
            }
          }
        });

        var setText = function(str){
          editor.setValue(str != undefined ? str : "");
        };
        element.setText = setText;
        if(events['setText']){
          events['setText'](setText);
        };
        var insert = function(str){
          editor.insert(str != undefined ? str : "");
        };
        element.insert = insert;
        if(events['insert']){
          events['insert'](insert);
        };
        if(str){
          element.setText(str);
        };
      };
      element.render = render;
      if(events['render']){
        events['render'](render);
      };
      if(typeof initFn == "function"){
        try{
          initFn({
            target : element,
            global : global
          })
        }catch(e){
          console.log(e)
        }
      } else {
        render();
      };
    });
    return aceDom;
  }
});
