/**
 * Created by leonlin on 16/11/3.
 */
define([], function () {
  return function (data) {
    var element = data.element;
    var global = data.global;
    var scope = data.scope;
    var compile = data.compile;
    delete element.growl;

    var wrap = $("<div></div>");
    if(element.style) {
      wrap.css(element.style);
    }
    wrap.append(ctrlgroup);
    var expression;
    $$.runExpression(element.$attr("advance/expression"), function (funRes) {
      if (funRes.code == "0") {
        var fnResult = funRes.data;
        if (typeof fnResult == 'function') {
          expression = fnResult(data, system);
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
    var format = expression.format;
    var layout = expression.layout || "fixed";
    var wholeWidth = expression.width || "100%";
    var cgroupstyle = element.$attr("parameters/cgroupstyle");
    var bootstrap = cgroupstyle == "bootstrap" || expression.bootstrap || false;
    if(bootstrap) {
      var ctrlgroup = $("<div></div>");
    } else {
      var ctrlgroup = $("<table></table>");
    }
    ctrlgroup.css("width", wholeWidth);
    ctrlgroup.css("table-layout", layout);
    var createIcon = function(fmt, ctrlGroup) {
      var td = $("<td></td>");
      var style = fmt.style || {};
      var tdStyle = fmt.tdStyle || {};
      var cls = fmt.class || "";
      var icon = $("<span></span>");
      var clickFn = fmt.$attr("on/click");
      icon.addClass(fmt.icon);
      td.addClass(cls);
      td.css("padding", "3px");
      if (typeof style == "object") {
        icon.css(style);
      }
      icon.css(tdStyle);
      td.on("click", function (event) {
        if (clickFn) {
          clickFn();
        }
      })
      td.append(icon);
      return td;
    };
    var createLabel = function(fmt, ctrlGroup) {
      var td = $("<td></td>");
      var style = fmt.style || {};
      var composory = fmt.composory || false;
      var labelStyle = fmt.labelStyle || {};
      var linkage = fmt.linkage;
      var compIconwrap = $("<span><span>");
      var icon = $("<div>*</div>");
      compIconwrap.css("display", "inline-block");
      compIconwrap.css("width", "10px");
      icon.css("font-size", "20px");
      icon.css("top", "5px");
      icon.css("position", "absolute")
      var format = fmt.format || {
          "label": "value"
        }
      var cls = fmt.class || "";
      if (linkage) {

        var label = $("<a></a>");
        label.attr("target", "_blank");
        label.attr("href", linkage);
        label.css("cursor", "pointer");
      } else {
        var label = $("<span></span>");
        //label.css("display", "inline-block")
      }
      var clickFn = fmt.$attr("on/click");
      td.addClass(cls);
      label.css(labelStyle);
      td.css("padding", "3px");
      if(typeof style == "object") {
        td.css(style);
      }
      td.on("click", function(event) {
        if(clickFn) {
          clickFn();
        }
      });
      /***
       *   韩星 2018.01.07
       *   需求: 超出指定的长度部分显示... 鼠标滑过去显示全部
       *   使用方法: 多加一个属性，例如：hideExtraText:"100px",
       */

      if(fmt.hideExtraText && fmt.hideExtraText!="undefined"){
        label.css({
          "display":"inline-block",
          "cursor":"pointer",
          "overflow": "hidden",
          "text-overflow":"ellipsis",
          "white-space" : "nowrap",
          "width":fmt.hideExtraText ,
        });
        label.text(fmt[format.label]);
        label.attr("title",fmt[format.label]);
      }else{
        label.text(fmt[format.label]);
      }


      var rnd = parseInt(Math.random() * 10000);
      icon.attr("id", rnd)
      if(composory == true) {
        icon.css("color", "#ff6f64");
        icon.css("position", "relative");
      } else if(composory == "none") {
        compIconwrap.css("display", "none");
      } else {
        icon.css("color", "rgba(0,0,0,0)");
      };
      compIconwrap.append(icon);
      td.css("position", "relative");
      td.append(compIconwrap);
      td.append(label);
      return td;
    };
    var createMultiSelect = function(fmt, ctrlGroup) {
      var format = fmt.format || {
        id: "id",
        label: "label"
      };
      var td = $("<td></td>");
      var style = fmt.style || {};
      var data = fmt.options || [];
      var cls = fmt.class || "";
      td.addClass(cls);
      td.css("padding", "3px");
      if(typeof style == "object") {
        td.css(style);
      }
      var getSelect = function() {
        var arr = [];
        var filter = td.find("ul.dropdown-menu li.active");
        filter.each(function(index, element) {
          var target = $(element).find("input");
          var find = data.find(function(ele) {
            return ele[format.id] == target.attr("value");
          });
          arr.push(find);
        });
        return arr;
      };
      var select = $("<select></select>")
        .addClass("multiselect multiselect-all multiselect-search");
      select.css("display", "none");
      select.attr("multiple", "multiple");
      td.append(select);
      var loop = function(item) {
        if(format) {
          var label = format.label;
          var value = format.id;
        }
        var option = $("<option></option>")
          .attr("value", item[value])
          .text(item[label]);
        if(item[format.value] == true) {
          option.attr("selected", "selected");
        }
        return option;
      };
      select.children().remove();
      for(var i in data) {
        select.append(loop(data[i]));
      }
      var domready = function() {
        var toolReady = function(multiselect) {
          var buttonText = function(options) {
            if(options.length == 0) {
              return '无做出任何选择';
            } else if (options.length > 1) {
              return "已选择" + options.length + "个";
            } else {
              var selected = '';
              options.each(function () {
                selected += $(this).text() + ', ';
              });
              return selected.substr(0, selected.length - 2);
            }
          };
          var onChange = function(elem, checked) {
            var changeFn = fmt.$attr("on/change");
            if(typeof changeFn == "function") {
              try {
                changeFn({
                  row: ctrlGroup,
                  current: fmt,
                  values: getSelect()
                });

              } catch(e) {
                console.log(e);
              }
            }
          };
          select.multiselect('destroy');
          select.multiselect({
            enableFiltering : true,
            buttonWidth: td.width(),
            buttonText: buttonText,
            onChange: onChange
          });
        };
        $$.loadExternalJs(["bootstrap-multiselect"], toolReady);
      };
      setTimeout(domready);
      return td;
    };
    var createAutoComplete = function(fmt, ctrlGroup) {
      var td = $("<td></td>");
      var cls = fmt.class || "";
      td.addClass(cls);
      var value = fmt.value;
      var placeholder = fmt.placeholder;
      var format = fmt.format || {
        id: "id",
        label: "label"
      };
      var style = fmt.style || {};
      td.css("padding", "3px");
      if(typeof style == "object") {
        td.css(style);
      }
      var changeFn = fmt.$attr("on/change");
      var autocomplete = $("<input />");
      autocomplete.attr("placeholder", placeholder);
      autocomplete.addClass("form-control");
      td.append(autocomplete);
      $$.loadExternalJs(['jquery-ui'], function() {
        /**
         var availableTags = fmt.options.map(function(elem){
          return elem[format.label];
        });*/
        var availableTags = fmt.options;
        autocomplete.autocomplete({
          source: function(request, response) {
            var key = request.term.toUpperCase();
            var equalPinyin = function(text) {
              var find = false;
              var loop = function(stxt) {
                if(stxt.indexOf(key) == 0) {
                  find = true;
                }
              };
              for(var i = 0; i < text.length - 1; i++) {
                loop($$.chineseCharacterToPinyin(text.slice(i, -1)));
              }
              return find;
            };
            var check = function(text) {
              return text.indexOf(key) != -1;
            };
            /**
             var filter = availableTags.filter(function(text){
              return equalPinyin(text) || check(text);
            });*/

            var filter = availableTags.filter(function(elem) {
              var text = elem[format.label] + "";
              return equalPinyin(text) || check(text);
            }).map(function(elem) {
              return {
                id: elem[format.id],
                label: elem[format.label]
              }
            });
            response(filter);
          },
          change: function(event, ui) {
            var val = $(event.currentTarget).val();
            if(typeof changeFn == "function") {
              changeFn({
                row: ctrlGroup,
                current: fmt,
                value: val
              })
            }
          }
        })
      });
      return td;
    };
    var createTextarea = function(fmt, ctrlGroup) {
      var td = $("<td></td>");
      var cls = fmt.class || "";
      td.addClass(cls);
      td.css("padding", "3px");
      var style = fmt.style || {};
      td.css("padding", "3px");
      if(typeof style == "object") {
        td.css(style);
      }
      var input = $("<textarea \>");
      var changeFn = fmt.$attr("on/change")
      input.addClass("form-control");
      input.val(fmt.value);

      if(fmt.disabled) {
        input.attr("disabled", "disabled");
      }

      //属性

      if(fmt.attrs) {
        for(var k in fmt.attrs) {
          input.attr(k, fmt.attrs[k]);
        }
      }
      input.on("change", function(event) {
        if(typeof changeFn == "function") {
          try {
            changeFn({
              row: ctrlGroup,
              current: fmt,
              value: input.val()
            });

          } catch(e) {
            console.log(e);
          }
        }
      });
      td.append(input);
      return td;
    };

    var createToggle = function(fmt, ctrlGroup) {
      var td = $("<td></td>");
      var cls = fmt.class || "";
      td.addClass(cls);
      td.css("padding", "3px");
      var style = fmt.style || {};
      td.css("padding", "3px");

      if(typeof style == "object") {
        td.css(style);
      }
      var wrap = $("<div></div>").addClass("toggle-wrap");
      var inner = $("<div></div>").addClass("toggle-inner");

      if(fmt.value) {
        wrap.addClass("active");
      }
      wrap.append(inner);
      var changeFn = fmt.$attr("on/change");

      wrap.on("click", function(event) {
        if(wrap.hasClass("active")) {
          wrap.removeClass("active");
        } else {
          wrap.addClass("active");
        }
        if(typeof changeFn == "function") {
          try {
            changeFn({
              row: ctrlGroup,
              current: fmt,
              value: wrap.hasClass("active")
            });
          } catch(e) {
            console.log(e);
          }
        }
      });
      td.append(wrap);
      return td;
    };
    var createInput = function(fmt, ctrlGroup) {
      var td = $("<td></td>");
      var cls = fmt.class || "";
      td.addClass(cls);
      td.css("padding", "3px");
      var style = fmt.style || {};
      td.css("padding", "3px");
      if(typeof style == "object") {
        td.css(style);
      }
      var input = $("<input \>");
      var changeFn = fmt.$attr("on/change")
      input.addClass("form-control");
      input.val(fmt.value);

      if(fmt.disabled) {
        input.attr("disabled", "disabled");
      }
      //属性
      if(fmt.attrs) {
        for(var k in fmt.attrs) {
          input.attr(k, fmt.attrs[k]);
        }
      }
      input.on("change", function(event) {
        if(typeof changeFn == "function") {
          try {
            changeFn({
              row: ctrlGroup,
              current: fmt,
              value: input.val()
            });

          } catch(e) {
            console.log(e);
          }
        }
      });
      td.append(input);
      return td;
    };
    var createInputableSelect = function(fmt, ctrlGroup) {
      var format = fmt.format || {
        id: "id",
        label: "label"
      };
      var val = fmt.value + "";
      var options = fmt.options || [];
      var td = $("<td></td>");
      var cls = fmt.class || "";
      td.addClass(cls);
      var style = fmt.style;
      td.css("padding", "3px");

      if(typeof style == "object") {
        td.css(style);
      }
      td.css("padding", "3px");
      var inx = 0;

      var data = options.map(function(elem) {
        var rs = {
          id: elem[format.id],
          text: elem[format.label]
        };
        inx++;
        return rs;
      });
      $$.loadExternalJs(['select2'], function() {
        var select2Dom = $("<select></select>");
        var changeFn = fmt.$attr("on/change");

        select2Dom.css("width", "100%");
        var baseSelect2 = {
          language: {
            noResults: function () {
              return fmt.noresults || "没有该匹配项";
            }
          },
          placeholder: fmt.placeholder || "请选择...",
          data: data
        };
        /**
         select2Dom.on("select2:select", function(evt) {
          if(typeof changeFn == "function"){
            var id = evt.params.data.id;
            input.val("asdasdasdasd");
            //var find = fmt.options[id];
            var find = fmt.options.find(function(elem){
              return id == elem[format.id];
            })
            try {
              changeFn({
                row : ctrlGroup,
                current : fmt,
                value : find
              });
            } catch (e){
              console.log(e);
            }
          }
        });*/
        td.append(select2Dom);
        select2Dom.select2(baseSelect2);
        setTimeout(function() {
          var selection = td.find(".select2");
          selection.css("visibility", "hidden");
          var replacer = $("<div><div>");
          var input = $("<input />");
          var buttonWrap = $("<span class=\"input-group-btn\"></span>");
          var button = $("<span class=\"btn btn-default\"><span class=\"glyphicon glyphicon-plus\"></span></span>");
          var wrap = $("<div></div>");
          wrap.css("position", "absolute");
          input.addClass("form-control");
          replacer.addClass("input-group");
          replacer.css("width", "100%");
          replacer.append(input);
          replacer.append(buttonWrap);
          buttonWrap.append(button);
          wrap.append(replacer);
          input.val(val);
          input.attr("placeholder", fmt.placeholder);
          select2Dom.on("change", function(event) {
            var target = $(event.target);
            var id = target.val();
            var find = options.find(function(elem) {
              return elem[format['id']] == id;
            });
            input.val(find[format['label']]);
            try {
              changeFn({
                row: ctrlGroup,
                current: fmt,
                value: {
                  valueCode: find[format['id']],
                  label: find[format['label']]
                }
              });

            } catch(e) {
              console.log(e);
            }
          });
          var toggleSelect = function() {
            if($(".select2-container--open").size()) {
              select2Dom.select2("close");
            } else {
              select2Dom.select2("open");
            }
          };
          button.on("click", toggleSelect);
          td.prepend(wrap);

          input.on("change", function(event) {
            try {
              changeFn({
                row: ctrlGroup,
                current: fmt,
                value: {
                  valueCode: input.val(),
                  label: input.val()
                }
              });
            } catch(e) {
              console.log(e);
            }
          })
        });
        var find = options.find(function(elem) {
          return elem.id == val;
        });
        var inxStr = options.indexOf(find) + "";
        select2Dom.val(val);
        select2Dom.trigger('change.select2');
      });
      return td;
    };
    var createSelet = function(fmt, ctrlGroup) {
      var format = fmt.format || {
        id: "id",
        label: "label"
      };
      var val = fmt.value + "";
      var options = fmt.options || [];
      var td = $("<td></td>");
      var cls = fmt.class || "";
      td.addClass(cls);
      var style = fmt.style;
      td.css("padding", "3px");
      if(typeof style == "object") {
        td.css(style);
      }
      td.css("padding", "3px");
      var getData4Options = function(key,value) {
        var data = [];
        options.forEach(function(elem) {
          if (key == undefined || value == undefined || elem[key] == value) {
            var rs = {
              id: elem[format.id],
              text: elem[format.label]
            };
            data.push(rs);
          }
        });
        return data;
      }
      $$.loadExternalJs(['select2'], function() {
        var select2Dom = $("<select></select>");
        var changeFn = fmt.$attr("on/change");
        select2Dom.css("width", "100%");
        var baseSelect2 = {
          language: {
            noResults: function() {
              return fmt.noresults || "没有该匹配项";
            }
          },
          placeholder: fmt.placeholder || "请选择...",
          data: getData4Options()
        };
        select2Dom.on("select2:select", function(evt) {
          if(typeof changeFn == "function") {
            var id = evt.params.data.id;
            //var find = fmt.options[id];
            var find = fmt.options.find(function(elem) {
              return id == elem[format.id];
            })
            try {
              changeFn({
                row: ctrlGroup,
                current: fmt,
                value: find
              });
            } catch(e) {
              console.log(e);
            }
          }
        });
        td.append(select2Dom);
        select2Dom.select2(baseSelect2);
        var find = options.find(function(elem) {
          return elem.id == val;
        });
        var inxStr = options.indexOf(find) + "";
        select2Dom.val(val);
        select2Dom.trigger('change.select2');
        //如果format有parentName，那么就要监听这个parentName的变化
        var parentEvent;
        if (format.parentName) {
          if (parentEvent) {
            parentEvent();
            parentEvent = null;
          }
          parentEvent = scope.$on(format.parentName, function (event, params) {
            select2Dom.select2('destroy').empty();
            baseSelect2.data = getData4Options(format.parentKey, params.value)
            select2Dom.select2(baseSelect2);
            select2Dom.val("");
            select2Dom.trigger('change.select2');
          })
        }
      });
      return td;
    };
    var createClipboardButton = function (fmt, ctrlGroup) {
      var cur = this;
      var td = $("<td></td>");
      var style = fmt.style || {};
      var btnStyle = fmt.btnStyle || {};
      var cls = fmt.class || "";
      var btnclass = fmt.btnclass || "";
      var saveFn = fmt.$attr("on/save");
      var disabled = fmt.disabled;
      td.addClass(cls);
      td.css("padding", "3px");
      if (typeof style == "object") {
        td.css(style);
      }
      var button = $("<button></button>");
      var txt = $("<span></span>");
      var icon = $("<span></span>");
      var clickFn = fmt.$attr("on/click");
      button.addClass(btnclass);
      button.attr("type", "button");
      if (fmt.icon) {
        icon.addClass(fmt.icon);
        button.append(icon);
      }
      if (disabled) {
        button.prop("disabled", "disabled")
      }
      button.css(btnStyle);
      txt.text(fmt.value || "");
      button.append(txt);
      button.attr("data-clipboard-text", fmt.clipboardText || "");
      $$.loadExternalJs(['clipboard'], function (Clipboard) {
        setTimeout(function () {
          var clipboard = new Clipboard(button[0]);
          clipboard.on('success', function (e) {
            if (saveFn) {
              saveFn(e);
            }
            e.clearSelection();
          });
          clipboard.on('error', function (e) {
            console.log(e);
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
          });
        });
      });
      td.append(button);
      return td;
    };
    var createButton = function(fmt, ctrlGroup) {
      var td = $("<td></td>");
      var style = fmt.style || {};
      var btnStyle = fmt.btnStyle || {};
      var cls = fmt.class || "";
      var btnclass = fmt.btnclass || "";
      var disabled = fmt.disabled;
      var format = fmt.format || {
        label: "value"
      }
      td.addClass(cls);
      td.css("padding", "3px");
      if(typeof style == "object") {
        td.css(style);
      }
      var button = $("<button></button>");
      var txt = $("<span></span>");
      var icon = $("<span></span>");
      var clickFn = fmt.$attr("on/click")
      button.addClass(btnclass);
      button.attr("type", "button");
      if(fmt.icon) {
        icon.addClass(fmt.icon);
        button.append(icon);
      }
      if(disabled) {
        button.prop("disabled", "disabled")
      }
      button.css(btnStyle);
      txt.text(fmt[format.label] || "");
      button.append(txt);
      button.on("click", function(event) {
        if(typeof clickFn == "function") {
          clickFn({
            row: ctrlGroup,
            current: fmt,
            ui: event
          })
        }
      });
      td.append(button);
      return td;
    };
    var createUploadFile = function(fmt, ctrlGroup) {
      var group = $("<div></div>");
      var cfg;
      group.addClass("btn-group");
      var file;
      var td = $("<td></td>");
      var style = fmt.style || {};
      var btnStyle = fmt.btnStyle || {};
      var cls = fmt.class || "";
      var disabled = fmt.disabled;
      var previewBtn = $("<button></button>");
      var submitBtn = $("<button></button>");
      var submitFn = fmt.$attr("on/submit");
      var config = {};
      config.group = fmt.group;
      previewBtn.addClass("btn btn-default");
      previewBtn.text("预览");
      submitBtn.addClass("btn btn-primary");
      submitBtn.text("上传");
      td.addClass(cls);
      td.css("padding", "3px");
      if(typeof style == "object") {
        td.css(style);
      }
      var button = $("<button></button>");
      var txt = $("<span></span>");
      var icon = $("<span></span>");
      var clickFn = fmt.$attr("on/click");
      var fileDom = $("<input />");
      fileDom.attr("type", "file");
      fileDom.css("display", "none");
      button.addClass("btn btn-default");
      button.attr("type", "button");
      group.append(button);
      if(fmt.icon) {
        icon.addClass(fmt.icon);
        button.append(icon);
      }
      if(disabled) {
        button.prop("disabled", "disabled")
      }
      button.css(btnStyle);
      txt.text("选择文件");
      button.append(txt);
      previewBtn.off("click");
      previewBtn.on("click", function(event) {
        element.createSystemPopupByJsonName("imagePrev", {
          title: "图片内容预览",
          width: "500px",
          config: cfg
        }, {
          file: file
        })
      });
      submitBtn.on("click", function(event) {
        element.uploadFile(file, config, function(event) {
          submitBtn.remove();
          txt.text("文件 : " + file.name + "已经成功上传！");
          cfg = event.data;
          if(submitFn) {
            submitFn(event["data"]);
            previewBtn.off("click");
            previewBtn.on("click", function(evt) {
              element.createSystemPopupByJsonName("imagePrev", {
                title: "图片内容预览",
                width: "500px"
              }, {
                url: event["data"].value
              })
            });
          }
        })
      });
      fileDom.on("change", function(event) {
        file = fileDom[0].files[0];
        txt.text("已选择文件 : " + file.name);
        group.append(previewBtn);
        group.append(submitBtn);
      });
      button.on("click", function(event) {
        fileDom.trigger("click");
      });
      td.append(fileDom);
      td.append(group);
      return td;
    };
    //加了一个可以自定义上传图片，上传图片的参数
    var createUploadFile2 = function(fmt, ctrlGroup) {
      var group = $("<div class='dropdown'></div>");
      group.addClass("btn-group");
      var file;
      var td = $("<td></td>");
      var autosubmit = !fmt.manual ? true : false;
      var style = fmt.style || {};
      var btnStyle = fmt.btnStyle || {};
      var cls = fmt.class || "";
      var disabled = fmt.disabled;
      var text = fmt.text ? fmt.text : "选择文件"; //获得初始化的文件名

      var submitFn = fmt.$attr("on/submit");
      var config = {};
      config.group = fmt.group;
      config.fileFormat = fmt.fileFormat; //自定义上传图片的格式
      config.url = fmt.url; //自定义上传图片路径
      config.formData = fmt.formData; //获取图片上传的参数

      td.addClass(cls);
      td.css("padding", "3px");
      if(typeof style == "object") {
        td.css(style);
      }

      var button = $("<button></button>");
      var dpulDom = $('<ul class="dropdown-menu" role="menu"></ul>');
      var mulbtn;
      var txt = $("<span></span>");
      var icon = $("<span></span>");
      var clickFn = fmt.$attr("on/click");
      var fileDom = $("<input />");
      fileDom.attr("type", "file");
      /**
       * 韩星
       * 控制是否为多选几个文件一起上传
       *
       */
      if(fmt.multiple==true){
        group.append(dpulDom);
        if (fmt.path) {
          var textAry = fmt.text.split(",");
          mulbtn = $('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+textAry[0]+'<span class="caret"></span></button>');
          group.prepend(mulbtn);
          button.css("display", "none");
          textAry.forEach(function(txt) {
            var dpliDom = $('<li>'+txt+'</li>')
            dpulDom.append(dpliDom);
          })
        }
        
        fileDom.attr("multiple",true);
      }
      
      fileDom.css("display", "none");
      button.addClass("btn btn-default");
      button.attr("type", "button");
      if(fmt.groupId) {
        button.attr("id", fmt.groupId);
      }
      
      group.append(button);
      if(fmt.icon) {
        icon.addClass(fmt.icon);
        button.append(icon);
      }
      if(disabled) {
        button.prop("disabled", "disabled")
      }
      button.css(btnStyle);
      txt.text(text);
      button.append(txt);
      var submitBtn; //提交按钮
      if(!autosubmit) {
        submitBtn = $("<button></button>");
        submitBtn.addClass("btn btn-primary");
        submitBtn.text("上传");
      }
      var btnstatus = fmt.btnstatus;
      //如果有删除
      var delBtn;
      if(!disabled && btnstatus && btnstatus.search("del") > -1) {
        var deleteFn = fmt.$attr("on/del");
        delBtn = $("<button></button>");
        delBtn.addClass("btn btn-default");
        delBtn.text("清空");
        delBtn.off("click");
        delBtn.on("click", function(event) {
          if (submitBtn) submitBtn.remove();
          if (mulbtn) mulbtn.remove();
          button.css("display", "inline-block");
          txt.text("选择文件");
          fmt.path = "";
          fmt.text = "";
          if(deleteFn) {
            deleteFn(event, fileDom, fmt); //需要把返回的全部callback回来
          }
        });
        group.append(delBtn);
      }
      //如果有下载
      var downloadBtn;
      if(fmt.path && disabled && btnstatus && btnstatus.search("download") > -1) {
        var downloadFn = fmt.$attr("on/download");
        downloadBtn = $("<button></button>");
        downloadBtn.addClass("btn btn-default");
        downloadBtn.text("下载");
        downloadBtn.off("click");
        downloadBtn.on("click", function(event) {
          if(downloadFn) {
            downloadFn(event, fileDom, fmt); //需要把返回的全部callback回来
          }
        });
        group.append(downloadBtn);
      }
      fileDom.on("change", function(event) {
        /* 老版本的处理
        var txtStr = "";
        for (var f in fileDom[0].files) {
          if (fileDom[0].files[f] instanceof File) {
            if (txtStr) {
              txtStr += "\r\n" + fileDom[0].files[f].name
            } else {
              txtStr = fileDom[0].files[f].name
            }
          }
        }
        txt.text(txtStr);
        txt.attr("title",txtStr);
        if(fmt.multiple==true) {
          txt.css({
            "width":"120px",
            "display":"block",
            "cursor":"pointer",
            "overflow": "hidden",
            "text-overflow":"ellipsis",
            "white-space" : "nowrap"
          })
        }
        */
        var txtStr = "";
        dpulDom.empty();
        for (var f in fileDom[0].files) {
          if (fileDom[0].files[f] instanceof File) {
            if(fmt.multiple==true) {
              if (!txtStr) {
                txtStr = fileDom[0].files[f].name;
                mulbtn = $('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+txtStr+'<span class="caret"></span></button>');
                group.prepend(mulbtn);
                button.css("display", "none");
              }
//            var dpliDom = $('<li>'+fileDom[0].files[f].name+'<span role="button" class="glyphicon glyphicon-trash"></span></li>')
              var dpliDom = $('<li>'+fileDom[0].files[f].name+'</li>')
              dpulDom.append(dpliDom);
            } else {
              txtStr = fileDom[0].files[f].name;
              txt.text(txtStr);
              txt.attr("title",txtStr);
            }
          }
        }
        if (!autosubmit) {
          submitBtn.on("click", function(event) {
            element.uploadFile1(fileDom[0].files, config, function(event) {
              submitBtn.remove();
              if(submitFn) {
                if (fmt.multiple) {
                  submitFn(event, fileDom, fmt); //需要把返回的全部callback回来
                } else {
                  submitFn(event[0], fileDom, fmt); //需要把返回的全部callback回来
                }
              }
            })
          });
          group.append(submitBtn);
        } else {
          element.uploadFile1(fileDom[0].files, config, function(event) { //用了新上传文件提交services
            if(submitFn) {
              if (fmt.multiple) {
                submitFn(event, fileDom, fmt); //需要把返回的全部callback回来
              } else {
                submitFn(event[0], fileDom, fmt); //需要把返回的全部callback回来
              }
            }
          })
        }
      });
      button.on("click", function(event) {
        fileDom.trigger("click");
      });
      td.append(fileDom);
      td.append(group);
      return td;
    }
    var createButtonGroup = function(fmt, ctrlGroup){
      var td = $("<td></td>");
      var style = fmt.style || {};
      var groupStyle = fmt.groupStyle || {}
      td.css(style);
      td.css("padding", "3px");
      var div = $("<div></div>");
      div.css(groupStyle);
      div.addClass("btn-group");
      var createBtn = function (fmtBtn) {
        var style = fmtBtn.style || {};
        var disabled = fmtBtn.disabled;
        var btnStyle = fmtBtn.btnStyle || {};
        var cls = fmtBtn.class || "btn btn-default";
        var btnclass = fmtBtn.btnclass || "";
        var button = $("<button></button>");
        var txt = $("<span></span>");
        var icon = $("<span></span>");
        var clickFn = fmtBtn.$attr("on/click")
        button.addClass(btnclass);
        button.attr("type", "button");
        if (fmtBtn.icon) {
          icon.addClass(fmtBtn.icon);
          button.append(icon);
        }
        if (disabled) {
          button.prop("disabled", "disabled")
        }
        button.css(btnStyle);
        txt.text(fmtBtn.value || "");
        button.append(txt);
        td.append(button);
        button.on("click", function (event) {
          if (typeof clickFn == "function") {
            clickFn({
              row: ctrlGroup,
              current: fmtBtn
            })
          }
        });
        return button;
      };
      var createClipboardBtn = function (fmtBtn) {
        var cur = this;
        var style = fmtBtn.style || {};
        var btnStyle = fmtBtn.btnStyle || {};
        var cls = fmtBtn.class || "";
        var btnclass = fmtBtn.btnclass || "";
        var saveFn = fmtBtn.$attr("on/save");
        var disabled = fmtBtn.disabled;
        if (typeof style == "object") {
          td.css(style);
        }
        var button = $("<button></button>");
        var txt = $("<span></span>");
        var icon = $("<span></span>");
        button.addClass(btnclass);
        button.attr("type", "button");
        if (fmtBtn.icon) {
          icon.addClass(fmtBtn.icon);
          button.append(icon);
        }
        if (disabled) {
          button.prop("disabled", "disabled")
        }
        button.css(btnStyle);
        txt.text(fmtBtn.value || "");
        button.append(txt);
        button.attr("data-clipboard-text", fmtBtn.clipboardText || "");
        $$.loadExternalJs(['clipboard'], function (Clipboard) {
          setTimeout(function () {
            var clipboard = new Clipboard(button[0]);
            clipboard.on('success', function (e) {
              if (saveFn) {
                saveFn(e);
              }
              e.clearSelection();
            });
            clipboard.on('error', function (e) {
              console.log(e);
              console.error('Action:', e.action);
              console.error('Trigger:', e.trigger);
            });
          });
        });
        return button
      }
      for (var i in fmt.content) {
        if (fmt.content[i].type == "button") {
          div.append(createBtn(fmt.content[i]))
        } else if (fmt.content[i].type == "clipboardButton") {
          div.append(createClipboardBtn(fmt.content[i]))
        }
      }
      td.append(div);
      return td;
    };
    var createDatePicker = function(fmt, ctrlGroup) {
      var td = $("<td></td>");
      var style = fmt.style;
      var value = fmt.value;
      td.css("padding", "3px");
      if(typeof style == "object") {
        td.css(style);
      }
      var cls = fmt.class || "";
      td.addClass(cls);
      var wrap = $("<div></div>");
      var id = Math.uuid();
      var changeFn = fmt.$attr("on/change");
      var input = $("<input id=datePicker" + id + " />").addClass("form-control").attr("type", "text");
      var i = $('<i class="glyphicon glyphicon-calendar fa fa-calendar"></i>')
        .css({
          position: "absolute",
          bottom: "10px",
          right: "14px",
          top: "auto",
          cursor: "pointer"
        });
      td.append(wrap);
      wrap.css("position", "relative");
      wrap.append(input).append(i);
      setTimeout(function() {
        $$.loadExternalJs(['laydate'], function(laydate) {
          laydate.render({
            elem: '#datePicker' + id, //指定元素
            theme: '#393D49',
            value: value ? useMomentFormat(value, "YYYY-MM-DD") : '',
            done: function(value, date, endDate) {
              if(changeFn) {
                changeFn({
                  target: element,
                  global: global,
                  row: ctrlGroup,
                  current: fmt,
                  value: {
                    getUTCDateString: value == '' ? '' : formatDatebyMomentToUTC(value), //格林尼治时间格式
                    getDateString: value
                  }
                })
              }
            }
          });
        })
      });
      return td;
    };
    var createDatePicker = function(fmt, ctrlGrooup){
      var td = $("<td></td>");
      var style = fmt.style;
      var value = fmt.value;
      td.css("padding", "3px");
      if (typeof style == "object") {
        td.css(style);
      }
      var cls = fmt.class || "";
      td.addClass(cls);
      var wrap = $("<div></div>");
      var id = Math.uuid();
      var changeFn = fmt.$attr("on/change");
      var input = $("<input id=datePicker" + id + " />").addClass("form-control").attr("type", "text");
      var i = $('<i class="glyphicon glyphicon-calendar fa fa-calendar"></i>')
        .css({
          position: "absolute",
          bottom: "10px",
          right: "14px",
          top: "auto",
          cursor: "pointer"
        });
      td.append(wrap);
      wrap.css("position", "relative");
      wrap.append(input).append(i);
      setTimeout(function () {
        $$.loadExternalJs(['laydate'], function (laydate) {
          laydate.render({
            elem: '#datePicker' + id, //指定元素
            theme: '#393D49',
            value: value ? useMomentFormat(value, "YYYY-MM-DD") : '',
            done: function (value, date, endDate) {
              if (changeFn) {
                changeFn({
                  target: element,
                  global: global,
                  row: ctrlGroup,
                  current: fmt,
                  value: {
                    getUTCDateString: value == '' ? '' : formatDatebyMomentToUTC(value), //格林尼治时间格式
                    getDateString: value
                  }
                })
              }
            }
          });
        })
      });
      return td;
    };
    var createDateTimePicker = function (fmt, ctrlGroup) {
      var td = $("<td></td>");
      var style = fmt.style;
      td.css("padding", "3px");
      if (typeof style == "object") {
        td.css(style);
      }
      var cls = fmt.class || "";
      var value = fmt.value;
      td.addClass(cls);
      var wrap = $("<div></div>");
      var changeFn = fmt.$attr("on/change");
      var id = Math.uuid();
      var input = $("<input id=dateTime" + id + " />").addClass("form-control").attr("type", "text");
      var dateType = fmt.dateType;
      if (fmt.icon == "none") {
        td.append(wrap);
        wrap.css("position", "relative");
        wrap.append(input);
      } else {
        var i = $('<i class="glyphicon glyphicon-calendar fa fa-calendar"></i>')
          .css({
            position: "absolute",
            bottom: "10px",
            right: "14px",
            top: "auto",
            cursor: "pointer"
          });
        td.append(wrap);
        wrap.css("position", "relative");
        wrap.append(input).append(i);
      }
      setTimeout(function () {
        $$.loadExternalJs(['laydate'], function (laydate) {
          var tstr = "yy-MM-dd hh:mm:ss";
          if (value) {
            var dateStr = value.getDateString("yy-MM-dd");
            var hour = value.getHour();
            var minute = value.getHour();
            var second = value.getSecond();
            if (dateType == "date") {
              tstr = "yy-MM-dd"
              value.setDate(new Date(dateStr));
            } else {
              value.setDate(new Date(dateStr + " " + hour + ":" + minute + ":" + second));
            }
            ;
          }
          laydate.render({
            elem: '#dateTime' + id, //指定元素'#dateRange'
            theme: '#393D49',
            type: dateType ? dateType : 'datetime',
            btns: ['clear', 'confirm'],
            value: value ? value.getDateString(tstr) : '',
            done: function (value, date, endDate) {
              if (changeFn) {

                changeFn({
                  target: element,
                  global: global,
                  row: ctrlGroup,
                  current: fmt,
                  value: {
                    getUTCDateString: value == '' ? '' : formatDatebyMomentToUTC(value), //格林尼治时间格式    element.getDateHandler(value).getUTCDateString()
                    getDateString: value
                  }
                })
              }
            }
          });
        })
      });
      return td;
    };
    var createDateRangePicker = function (fmt, ctrlGroup) {
      var td = $("<td></td>");
      var style = fmt.style;
      td.css("padding", "3px");
      if (typeof style == "object") {
        td.css(style);
      }
      var cls = fmt.class || "";
      td.addClass(cls);
      var wrap = $("<div></div>");
      var changeFn = fmt.$attr("on/change");
      var id = Math.uuid();
      var input = $("<input id=dateRange" + id + " />").addClass("form-control").attr("type", "text");
      if (fmt.icon == "none") {
        td.append(wrap);
        wrap.css("position", "relative");
        wrap.css("padding", "3px");
        wrap.append(input);
      } else {
        var i = $('<i class="glyphicon glyphicon-calendar fa fa-calendar"></i>')
          .css({
            position: "absolute",
            bottom: "10px",
            right: "14px",
            top: "auto",
            cursor: "pointer"
          });
        td.append(wrap);
        wrap.css("position", "relative");
        wrap.css("padding", "3px");
        wrap.append(input).append(i);
      }
      var btns = ['clear', 'confirm'];
      if (fmt.btns) {
        btns = fmt.btns
      }

      setTimeout(function () {
        $$.loadExternalJs(['laydate'], function (laydate) {
          laydate.render({
            elem: '#dateRange' + id, //指定元素
            theme: '#393D49',
            range: true,
            btns: btns,
            value: (fmt.value == '' || fmt.value == undefined) ? '' : element.getDateHandler(fmt.value[0]).getDateString("yy-MM-dd") + " - " + element.getDateHandler(fmt.value[1]).getDateString("yy-MM-dd"),
            done: function (value, date, endDate) {

              var dateArray = value.split(" - ");
              if (changeFn) {
                changeFn({
                  target: element,
                  global: global,
                  row: ctrlGroup,
                  current: fmt,
                  value: {
                    start: dateArray[0] == '' ? '' : formatDatebyMomentToUTC(dateArray[0]), //格林尼治时间格式
                    end: dateArray[1] == '' ? '' : formatDatebyMomentToUTC(dateArray[1]), //格林尼治时间格式
                    // end: element.getDateHandler(dateArray[1]).getUTCDateString(),  //格林尼治时间格式
                    startDateString: dateArray[0],
                    endDateString: dateArray[1]
                  }
                })
              }
            }
          });
        })
      });
      return td;
    };
    var createJQury = function(fmt, ctrlGroup) {
      var td = $("<td></td>");
      var style = fmt.style;
      td.css("padding", "3px");
      if(typeof style == "object") {
        td.css(style);
      }
      var renderFn = fmt.render;
      if(typeof renderFn == "function") {
        td.append(renderFn($));
      }
      return td;
    };
    var createDropDownTree = function (fmt, ctrlGroup) {
      var td = $("<td></td>");
      var changeFn = fmt.$attr("on/change")
      td.css("padding", "3px");
      var style = fmt.style;
      td.css("padding", "3px");
      if (typeof style == "object") {
        td.css(style);
      }
      var cls = fmt.class || "";
      td.addClass(cls);
      var dropDownTree = $("<div></div>");
      $$.loadExternalJs(['dropdowntree'], function () {
        dropDownTree.dropdowntree({
          value: fmt.value,
          options: fmt.options,
          format: fmt.format,
          change: function (event) {
            if (typeof changeFn == "function") {
              changeFn({
                row: ctrlGroup,
                current: fmt,
                value: event.data
              })
            }
          }
        })
      });
      td.append(dropDownTree);
      return td;
    };
    var createSvg = function (fmt) {
      var td = $("<td></td>");
      var style = fmt.style || {};
      var cls = fmt.class || "";
      var svgAttr = fmt.svgAttr || {};
      var svgStyle = fmt.svgStyle || {};
      var renderFn = fmt.render;
      td.addClass(cls);
      td.css("padding", "3px");
      $$.loadExternalJs(['d3'], function (d3) {
        var wrap = d3.select(td[0]);
        var svg = wrap.append("svg");
        for (var i in svgAttr) {
          svg.attr(i, svgAttr[i]);
        }
        for (var i in svgStyle) {
          svg.style(i, svgStyle[i]);
        }
        renderFn(svg);
      });
      return td;
    };
    var createCustomHtml = function(fmt) {
      var td = $("<td></td>");
      var div = $("<div></div>");
      var style = fmt.style || {};
      var cls = fmt.class || "";
      var val = fmt.value || {};
      // 如果传进来是个数组需要展示多个
      if(val instanceof Array){
        val.forEach(function (ele) {
           var a = $("<a target='_blank' href="+ele.qualifiedName+">"+ele.label+"</a><br />");
           div.append(a);
        })
      }else{
        div.append(val);
      }
      var customStyle = fmt.customStyle || {};
      var renderFn = fmt.render;
      td.addClass(cls);
      // td.css("padding", "3px");

      td.css(style);
      td.append(div);
      return td;
    };
    var createClock = function(fmt, item) {
      var td = $("<td></td>");
      var style = fmt.style || {};
      var cls = fmt.class || "";
      var label = $("<div></div>");
      td.addClass(cls);
      td.css("padding", "3px");
      if(typeof style == "object") {
        label.css(style);
      }
      var valueFn = fmt.value || function(elem) {
        return elem
      }
      $$.loadExternalJs(['clock'], function(clock) {
        var myClock = clock.init();
        myClock.on("init", function(value) {
          label.text(valueFn(value));
        });
        myClock.on("change", function(value) {
          label.text(valueFn(value));
        });
        myClock.start();
      });
      td.append(label);
      return td;
    };
    var createRadio = function(fmt, ctrlGroup) {
      var td = $("<td></td>");
      var val = fmt.value;
      var changeFn = fmt.$attr("on/change")
      td.css("padding", "3px");
      var style = fmt.style;
      td.css("padding", "3px");
      if(typeof style == "object") {
        td.css(style);
      }
      var cls = fmt.class || "";
      td.addClass(cls);
      var radioDom = $("<div></div>")
        .addClass("btn-group btn-group-justified");
      radioDom.css("width", "100%");
      var createBtn = function(item) {
        var btn = $("<div></div>")
          .addClass("btn");
        if(item.id == val) {
          btn.addClass("btn-primary")
        } else {
          btn.addClass("btn-default")
        }
        btn.on("click", function(event) {
          var btns = radioDom.find(".btn-primary");
          btns.removeClass("btn-primary");
          btns.addClass("btn-default");
          btn.removeClass("btn-default");
          btn.addClass("btn-primary");
          if(changeFn) {
            try {
              changeFn({
                row: ctrlGroup,
                current: fmt,
                value: item.value
              })
            } catch(e) {
              console.log(e);
            }
          }
        });
        btn.text(item.label);
        return btn;
      };
      for(var i in fmt.options) {
        radioDom.append(createBtn(fmt.options[i]))
      }
      td.append(radioDom);
      return td;
    };
    var createCheckBoxList = function(fmt, ctrlGroup) {
      var td = $("<td></td>");
      var multiselect = fmt.multiselect == undefined ? true : fmt.multiselect;
      td.css("padding", "3px");
      var style = fmt.style;
      if(typeof style == "object") {
        td.css(style);
      }
      var format = fmt.format || {
        id: "id",
        label: "label"
      };
      var cls = fmt.class || "";
      var options = fmt.options;
      var column = fmt.column || 1;
      var value = fmt.value;
      var changeFn = fmt.$attr("on/change");
      var createCheckboxList = function(item) {
        var div = $("<div></div>");
        div.css("width", parseInt(100 / column) + "%");
        div.addClass("checkboxlist")
        var trick = $("<span></span>");
        var checkbox = $("<div></div>");
        trick.addClass("glyphicon glyphicon-ok");
        checkbox.addClass("checkbox");
        checkbox.append(trick);
        if(value.some(function(id) {
            return id == item[format.id];
          })) {
          div.addClass("checked");
        }
        if(item.hasOwnProperty("dom")) {
          Object.defineProperty(item, "dom", {
            enumerable: false,
            value: div
          });
        } else {
          item.dom = div;
        }
        var label = $("<span></span>");
        label.text(item[format.label]);
        div.append(checkbox);
        div.append(label);
        div.on("click", function(event) {
          //div.css("display", "none");
          if(multiselect) {
            if(div.hasClass("checked")) {
              div.removeClass("checked");
            } else {
              div.addClass("checked");
            }
          } else {
            for(var i in options) {
              options[i].dom.removeClass("checked");
            }
            div.addClass("checked");
          }
          changeFn({
            row: ctrlGroup,
            current: fmt,
            value: options.filter(function(elem) {
              return elem.dom.hasClass("checked");
            })
          })
        });
        return div;
      };
      for(var i in options) {
        td.append(createCheckboxList(options[i]));
      }
      td.addClass(cls);
      return td;
    }
    var createProgress = function(fmt, ctrlGroup) {
      var td = $("<td></td>");
      td.css("padding", "3px");
      var style = fmt.style;
      if(typeof style == "object") {
        td.css(style);
      }
      var table = $("<div style='display:table;'><tr></tr></div>");
      var tr = table.find("tr");
      var td1 = $("<td></td>");
      var td2 = $("<td></td>");
      tr.append(td1);
      tr.append(td2);
      var cls = fmt.class || "";
      var shownumber = fmt.shownumber;
      td.addClass(cls);
      td1.css("vertical-align", "middle");
      td1.css("text-align", "right");
      td2.css("vertical-align", "middle");
      var pwrap = $('<div></div>').addClass("progress sm");
      var data = fmt.value;
      var progress = $('<div></div>').addClass("progress-bar").css("width", (data || 0) + "%");
      if(shownumber) {
        table.append(td1);
        td1.append($("<span style=\"width:35px;display:inline-block;padding-right:2px;\">" + data + "%</span>"));
      }
      pwrap.css("margin", "auto");
      pwrap.append(progress);
      td2.append(pwrap);
      td2.css("width", "100%");
      table.append(td2);
      td.append(table);

      /** baogang only */
        /**
      var popover = $("<div></div>");
      popover.text("100");
      popover.css("padding", "5px 10px");
      popover.css("background-color", "#000");
      popover.css("color", "#fff");
      popover.css("position", "fixed");
      popover.css("z-index", 1100);
      popover.css("pointer-events", "none");

      function mouseenter(event) {
        popover.css("top", event.clientY - popover.height());
        popover.css("left", event.clientX - popover.width());
        $("body").append(popover);
        progress.on("mousemove", mousemove)
      }

      function mousemove(event) {
        console.log(event);
        popover.css("top", event.clientY - popover.height());
        popover.css("left", event.clientX - popover.width());
      }

      function mouseleave(event) {
        progress.off("mousemove");
        popover.remove();
      }

      progress.on("mouseenter", mouseenter);
      progress.on("mouseleave", mouseleave);*/
      /** baogang only */
     switch(data) {
        case data == 100:
          progress.addClass("progress-bar-aqua");
          break;
        case data > 90:
          progress.addClass("progress-bar-green");
          break;
        case data > 80:
          progress.addClass("progress-bar-yellow");
          break;
        case data > 70:
          progress.addClass("progress-bar-yellow");
          break;
        case data > 60:
          progress.addClass("progress-bar-red");
          break;
        default:
          progress.addClass("progress-bar-danger");
          break;
      }
      return td;
    };
    var render = function (ctrlGroups) {
      ctrlgroup.children().remove();
      var loopCtrlGroups = function (ctrlGroup) {
        var inputGroup = $("<tr></tr>");
        if(bootstrap) {
          inputGroup.css("display", "block");
          inputGroup.addClass("row")
        }
        //inputGroup.css("padding", "5px");
        var loopformat = function(fmt) {
          var dom;
          ctrlGroup.refresh = function() {
            console.log("refresh!!!!");
          }
          if(fmt.type == "label") {
            dom = createLabel(fmt, ctrlGroup);
          } else if(fmt.type == "icon") {
            dom = createIcon(fmt, ctrlGroup);
          } else if(fmt.type == "toggle") {
            dom = createToggle(fmt, ctrlGroup);
          } else if(fmt.type == "autoComplete") {
            dom = createAutoComplete(fmt);
          } else if(fmt.type == "input") {
            dom = createInput(fmt, ctrlGroup);
          } else if(fmt.type == "textarea") {
            dom = createTextarea(fmt, ctrlGroup);
          } else if(fmt.type == "select") {
            dom = createSelet(fmt, ctrlGroup);
          } else if(fmt.type == "inputableSelect") {
            dom = createInputableSelect(fmt, ctrlGroup);
          } else if(fmt.type == "button") {
            dom = createButton(fmt, ctrlGroup);
          } else if(fmt.type == "uploadFile") {
            dom = createUploadFile(fmt, ctrlGroup);
          } else if(fmt.type == "uploadFile2") { //宝钢报告编制特殊处理
            dom = createUploadFile2(fmt, ctrlGroup);
          } else if(fmt.type == "dropdowntree"){
            dom = createDropDownTree(fmt, ctrlGroup);
          } else if (fmt.type == "dateRangePicker") {
            dom = createDateRangePicker(fmt, ctrlGroup);
          } else if (fmt.type == "datePicker") {
            dom = createDatePicker(fmt, ctrlGroup);
          } else if (fmt.type == "dateTimePicker") {
            dom = createDateTimePicker(fmt, ctrlGroup);
          } else if (fmt.type == "multiSelect") {
            dom = createMultiSelect(fmt, ctrlGroup);
          } else if (fmt.type == "radio") {
            dom = createRadio(fmt, ctrlGroup);
          } else if (fmt.type == "buttonGroup") {
            dom = createButtonGroup(fmt, ctrlGroup);
          } else if (fmt.type == "jquery") {
            dom = createJQury(fmt, ctrlGroup);
          } else if (fmt.type == "clipboardButton") {
            dom = createClipboardButton(fmt, ctrlGroup);
          } else if (fmt.type == "clock") {
            dom = createClock(fmt, ctrlGroup);
          } else if (fmt.type == "svg") {
            dom = createSvg(fmt, ctrlGroup);
          } else if(fmt.type == "customHtml") { //加了一个自定义html功能，便于其它功能的扩展
            dom = createCustomHtml(fmt, ctrlGroup);
          } else if(fmt.type == "progressbar") {
            dom = createProgress(fmt, ctrlGroup);
          } else if(fmt.type == "checkboxlist") {
            dom = createCheckBoxList(fmt, ctrlGroup);
          }
          if(bootstrap) {
            inputGroup.css("display", "block");
          }
          if(fmt.colSpan) {
            dom.attr("colSpan", fmt.colSpan);
          }
          if(fmt.rowSpan) {
            dom.attr("rowSpan", fmt.rowSpan);
          }
          if(fmt.tdStyle){
            dom.css(fmt.tdStyle);
          }
          element.setSelfDom(dom);
          return dom;
        };
        for(var i in ctrlGroup) {
          inputGroup.append(loopformat(ctrlGroup[i]));
        }
        return inputGroup;
      };
      for(var i in ctrlGroups) {
        ctrlgroup.append(loopCtrlGroups(ctrlGroups[i]));
      }
    };
    element.render = render;
    element.parentShow = function() {
      ctrlgroup.parent().parent().css("display", "block");
    }
    element.parentHide = function() {
      ctrlgroup.parent().parent().css("display", "none");
    }
    element.show = function() {
      ctrlgroup.css("display", "block");
    }
    element.hide = function() {
      ctrlgroup.css("display", "none");
    }
    var initFn = expression.$attr("on/init");
    if (typeof initFn == "function") {
      try {
        initFn({
          target: element,
          global: global,
          scope: scope
        })
      } catch (e) {
        console.log(e);
      }
    }
    return ctrlgroup;
  }
});