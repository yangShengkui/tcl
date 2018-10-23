/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return {
    init : function(dom){
      var events = {};
      var fl;
      var btnGroup = $("<div></div>");
      var canvas = $("<canvas></canvas>");
      var instruction = $("<div></div>");
      var input = $('<input class="form-control" type="file">');
      var span = $("<span></span>")
      var button = $("<button></button>");
      var pv = $("<div></div>");
      var uploadImage = function(dom){
        $.fn.uploadImage = function(){
          var cur = this;
          var init = function(){
            cur.children().remove();
            cur.css("display", "none");
            //cur.css("border", "1px solid #666");
            canvas.css("width", "100%");
            canvas.css("height", "100%");
            btnGroup.addClass("input-group");
            span.append(button);
            span.addClass("input-group-btn");
            button.addClass("btn btn-primary");
            button.text("上传");
            button.prop("disabled", "disabled");
            btnGroup.append(input);
            btnGroup.append(span);
            instruction.css("color", "#fff");
            instruction.css("pointer-events", "none");
            instruction.css("position", "absolute");
            instruction.css("width", "calc(100% - 10px)");
            instruction.css("left", "5px");
            instruction.css("top", "5px");
            instruction.css("border", "1px dashed #fff");
            instruction.css("text-align", "center");
            pv.imageprev();
            instruction.css("line-height", (pv.height() - 15) + "px");
            pv.css("background-color", "#999");
            pv.append(instruction);
            pv.append(canvas);
            instruction.text("可拖拽一个图片至此。")
            cur.append(btnGroup).append(pv);
            button.on("click", function(event){
              events['submit'](fl);
            });
            var readFile = function(file){
              fl = file;
              instruction.css("display", "none");
              button.removeAttr("disabled");
              if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                  pv.imageprev("option", "changeSrc", evt.target.result);
                  $(".tips").css("display", "none");
                  $(".uploadBtn").css("display", "none");
                  events['change'](file);
                };
                reader.readAsDataURL(file);
              }
            };
            input.on("change", function(event){
              var file = input[0].files[0];
              readFile(file);
            });
            canvas[0].addEventListener("dragover", function(evt) {
                evt.preventDefault();
              },
              false);
            canvas[0].addEventListener("drop", function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                var files = evt.dataTransfer.files;
                if (files.length > 0) {
                  var file = files[0];
                  input[0].files = files;
                  readFile(file);
                }
              },
              false)
          };
          if(arguments.length == 0){
            init()
          } else if(arguments.length == 3){
            if(arguments[0] == "option"){
              var fun = arguments[1];
              var val = arguments[2];
              eval(fun + "(\"" + val + "\")")
            }
          }
        };
        $(dom).uploadImage();
      };
      uploadImage.prototype.on = function(eventName, callback){
        events[eventName] = callback;
      }
      uploadImage.prototype.reset = function(){
        fl = null;
        pv.imageprev("option", "clear");
        instruction.css("display", "block");
        input.val(null);
      }
      return new uploadImage(dom);
    }
  }
});