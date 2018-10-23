

define(['./tree-data-handler'], function(treeDataHandler){
  return {
    init : function(dom, data, format){
      var rootUl = $("<div></div>");
      rootUl.addClass("ul");
      dom.append(rootUl);
      var treeMenu = function(rootNode){
        var events = {};
        var searchbox = {
          init : function(dom){
            var events = {};
            var input = $("<input/>");
            var button = $("<span></span>");
            var searchIcon = $("<span></span>");
            var searchbox = function(dom){
              input.css("margin-left", "5px");
              input.attr("placeholder", "检索下一级内容");
              button.addClass("searchbox");
              searchIcon.addClass("glyphicon glyphicon-search");
              button.prop("disabled", "disabled");
              button.css("margin", "0 5px");
              button.append(searchIcon);
              dom.append(input);
              dom.append(button);
              dom.on("click", function(event){
                event.stopPropagation();
              });
              button.on("click", function(event){
                if(input.css("display") != "none"){
                  events['search'](input.val());
                }
              })
            };
            searchbox.prototype.on = function(eventName, callback){
              events[eventName] = callback;
            };
            searchbox.prototype.open = function(){
              input.css("display", "inline-block");
              input.on("keypress", function(event){
                if(event.keyCode == 13){
                  events['search'](input.val());
                }
              })
            };
            searchbox.prototype.close = function(){
              input.css("display", "none")
            }
            return new searchbox(dom);
          }
        };
        var buttons = {
          init : function(dom, node){
            var span = $("<span></span>");
            var events = {};
            var BUTTONS = function(dom){
              dom.addClass("btn-group");
              dom.css("float", "right");
              var createBtn = function(inx, elem){
                var clickFn = elem.$attr("on/click");
                var button = $("<button></button>");
                var icon = $("<span></span>");
                var label = $("<span></span>");
                button.addClass(elem.class || "btn btn-default");
                icon.addClass(elem.icon);
                label.text(elem.label);
                if(elem.disabled){
                  button.attr("disabled", "disabled");
                }
                button.append(icon);
                button.append(label);
                button.on("click", function(event){
                  event.stopPropagation();
                  if(clickFn){
                    clickFn(node);
                  }
                });
                return button;
              };
              for(var i in node.buttons){
                dom.append(createBtn(i, node.buttons[i]));
              }
            };
            BUTTONS.prototype.on = function(eventName, callback){
              events[eventName] = callback;
            };
            return new BUTTONS(dom);
          }
        };
        var cbox = {
          init : function(dom){
            var span = $("<span></span>");
            var CBOX = function(dom){
              dom.addClass("checkbox");
              span.addClass("glyphicon glyphicon-ok");
              dom.append(span);
            };
            CBOX.prototype.check = function(){
              span.css("opacity", 1);
              span.removeClass().addClass("glyphicon glyphicon-ok");
            };
            CBOX.prototype.uncheck = function(){
              span.css("opacity", 0);
            };
            CBOX.prototype.half = function(){
              span.css("opacity", 1);
              span.removeClass().addClass("glyphicon glyphicon-minus");
            }
            return new CBOX(dom);
          }
        };
        var traverse = function(node){
          if(!node.parent){
            node.parentDom = rootUl;
          };
          var searchCondition = function(){
            return true;
          };
          var alwaysShow = function(node){
            return node.hasDesChecked() != "none" || node.$attr("checkbox/value") || !node.parent;
          };
          var checkbox = node.checkbox;
          var lv = node.level;
          var li = $("<div></div>");
          var showDescription = node.$attr("showDescription");
          var clickFn = node.$attr("on/click");
          var onOpenFn = node.$attr("on/open");
          var onCloseFn = node.$attr("on/close");
          var searchBtn = $("<span></span>")
          var sbtnIns = searchbox.init(searchBtn);
          var description = $("<span></span>");
          var buttongroup = $("<div></div>");
          if(!showDescription){
            description.css("display", "none");
          }
          var btngroupIns = buttons.init(buttongroup, node);
          var updateIcon = function(icon){
            customeIconWrap.removeClass();
            customeIconWrap.addClass(icon);
          }
          if(node.parent){
            var hline = $("<div></div>");
            var vline = $("<div></div>");
            var circle = $("<div></div>");
            vline.addClass("vline");
            circle.addClass("circle");
            if(node.isLast){
              if(node.isLast()){
                hline.addClass("hline_short");
              } else {
                hline.addClass("hline");
              };
            } else {
              hline.addClass("hline_short");
            };
            vline.css("left", 20 * lv - 10);
            hline.css("left", 20 * lv - 10);
            circle.css("left", 20 * lv - 4);
            li.append(hline);
            li.append(vline);
            li.append(circle);
          };
          description.addClass("description");
          description.text(node.description);
          node.dom = li;
          node.btngroupIns = btngroupIns;
          node.descriptionDom = description;
          node.parentDom.append(li);
          var customeIconWrap = $("<span></span>");
          var customeIcon = $("<div></div>")
          var iconwrap = $("<div></div>");
          customeIconWrap.append(customeIcon);
          //customeIconWrap.css("display", "inline-block");
          iconwrap.addClass("plusminus");
          var icon = $("<span></span>");
          li.addClass("li");
          var text = $("<span></span>");
          text.addClass("text");
          var item = $("<div></div>");
          item.css("padding-left", 20 * lv);
          item.addClass("item");
          item.addClass("level-" + lv);
          var wrap = $("<div></div>");
          item.on("mouseenter", function(){
            dom.find(".item").removeClass("focus");
            item.addClass("focus");
          });
          node.item = item;
          wrap.addClass("wrap");
          var ICONIMAGEPLUS, ICONIMAGEDOWN;
          if(node.folderStyle == 1){
            iconwrap.addClass("folder_1");
            ICONIMAGEPLUS = "glyphicon-triangle-left";
            ICONIMAGEDOWN = "glyphicon-triangle-bottom";

          } else{
            iconwrap.addClass("folder");
            ICONIMAGEPLUS = "glyphicon-plus";
            ICONIMAGEDOWN = "glyphicon-minus";
          };
          iconwrap.append(icon);
          var setLabel = function(label){
            text.text(label);
          }
          setLabel(node.label);
          var folderOpenAndClose = function(event){
            event.stopPropagation();
            var preventdefault = false;
            var event = {
              node: node,
              preventdefault: function () {
                preventdefault = true;
              }
            };
            if(node.closeOtherWhileOpen){
              node.traverseBrothers(function(brother){
                brother.close();
              })
            }
            if(!preventdefault){
              if(li.hasClass("active")){
                if(node.close){
                  node.close();
                };
                if(onCloseFn){
                  onCloseFn(event);
                };
              } else {
                if(node.open){
                  node.open();
                };
                if(onOpenFn){
                  onOpenFn(event);
                }
              };
            };
          };
          var setCheckValue = function(val){
            var val = val || node.checkbox.value;
            node.remapcss(val == true ? "all" : "none");
            node.traverseDescendants(function(child){
              child.setCheckboxValue(val);
              child.remapcss(val == true ? "all" : "none");
            });
            node.traverseParents(function(node){
              var state = node.hasDesChecked();
              node.remapcss(state);
              node.resetcheck(state);
              node.setDescription();
            });
          };
          var checkboxclick = function(event){
            event.stopPropagation();
            var val = !node.checkbox.value;
            node.setCheckboxValue(val);
            var checkboxs = rootNode.getDescendants(function(child){
              return child.$attr("checkbox/value");
            });
            events["check"](checkboxs);
          };
          if(node.icon) {
            updateIcon(node.icon);
            item.append(customeIconWrap);
          };
          if(node.children != undefined && node.showfold != false) {
            item.append(iconwrap);
          };
          node.setHighlight = function(hideOther){
            if(hideOther){
              rootNode.traverse(function(node){
                node.dom.find(".highlight").removeClass("highlight");
              });
            }
            item.addClass("highlight");
          };
          node.searchBtn = sbtnIns;
          node.show = function(){
            node.dom.css("display", "block");
          };
          node.hide = function(){
            node.dom.css("display", "none");
          };
          node.search = function(callback, alwaysShowFn){
            searchCondition = callback || searchCondition;
            alwaysShow = alwaysShowFn || alwaysShow;
            var traverse = function(child){
              if(child.searchable != false){
                var pass = child.getDescendants(function(child){
                  return searchCondition(child);
                });
                var parent = child.parent || {};
                var filterKey = parent.filterKey || "";
                if(searchCondition(child)){
                  pass.push(child);
                };
                if(pass.length > 0 && child.label.indexOf(filterKey) != -1 || alwaysShow(child)){
                  if(child.open){
                    child.open();
                  }
                  child.show();
                } else {
                  child.hide();
                };
              };
            };
            node.traverse(traverse);
          };
          node.remapcss = function(state){
            this.dom.removeClass("some-checked");
            this.dom.removeClass("all-checked");
            if(state == "all"){
              this.dom.addClass("all-checked");
            } else if(state == "some"){
              this.dom.addClass("some-checked");
            }
          };
          node.resetcheck = function(state){
            if(this.checkbox){
              if(state == "all"){
                this.checkbox.cbox.check();
                this.checkbox.value = true;
              } else if(state == "some"){
                this.checkbox.cbox.half();
                this.checkbox.value = true;
              } else {
                this.checkbox.cbox.uncheck();
                this.checkbox.value = false;
              }
            };
          };
          node.setDescription = function(str){
            if(str){
              this.descriptionDom.text(str);
            } else {
              var childrend = this.getDescendants(function(child){
                return child.$attr("checkbox/value");
              });
              if(childrend.length > 0){
                this.descriptionDom.text("(已选:" + childrend.length + "个)");
              } else {
                this.descriptionDom.text("");
              }
            };
          };
          node.hasDesChecked = function(){
            var node = this;
            var checked = node.getDescendants(function(child){
              return child.$attr("checkbox/value") == true;
            });
            var all = node.getDescendants();
            if(all.length > 0){
              if(checked.length > 0 && checked.length < all.length){
                return "some"
              }  else if(checked.length == all.length){
                return "all"
              }
            };
            return "none";
          };
          node.setCheckboxValue = function(value){
            var node = this;
            if(node.checkbox){
              node.checkbox.value = value != undefined ? value : node.checkbox.value;
              if(node.checkbox.value){
                node.checkbox.cbox.check();
              } else {
                node.checkbox.cbox.uncheck();
              }
            };
            setCheckValue(value);
          };
          //var state = node.hasDesChecked();
          if(node.checkbox){
            var checkboxdom = $("<div></div>");
            var mcbox = cbox.init(checkboxdom);
            node.checkbox.cbox = mcbox;
            node.setCheckboxValue();
            /**if(node.checkbox){
              state = "all";
            }*/
            checkboxdom.on("click", checkboxclick);
          }
          //node.remapcss(state);
          item.append(checkboxdom);
          item.append(text);
          item.append(description);
          li.append(item);
          node.remove = function(){
            node.dom.remove();
          };
          node.updateNode = function(nd){
            updateIcon(nd.icon);
            setLabel(nd.label);
          };
          node.update = function(){
            node.remove();
            node.traverse(traverse);
          };
          if(node.triggerEvent == "fold"){
            item.on("click", function(event){
              folderOpenAndClose(event);
              if(clickFn) {
                clickFn(node);
              };
            })
          } else if(node.triggerEvent == "checkbox"){
            item.on("click", checkboxclick);
          } else {
            item.on("click", function(event){
              if(clickFn) {
                clickFn(node);
              };
            });
          };
          sbtnIns.on("search", function(value){
            node.filterKey = value;
            rootNode.search();
          });
          if(node.children != undefined){
            item.addClass("has-children");
            if(node.children.length == 0){
              var empty = {
                label : "暂无数据",
                parentDom : wrap,
                parent : node,
                level : lv + 1
              };
              traverse(empty)
            }
            li.append(wrap);
            icon.addClass("glyphicon " + ICONIMAGEPLUS);
            if(item.searchable){
              item.append(searchBtn);
            };
            for(var i in node.children){
              var ul = $("<div></div>");
              ul.addClass("ul");
              wrap.append(ul);
              node.children[i].parentDom = ul;
            }
            node.open = function(){
              sbtnIns.open();
              searchBtn.removeAttr("disabled");
              li.addClass("active");
              icon.removeClass(ICONIMAGEPLUS);
              icon.addClass(ICONIMAGEDOWN);
            };
            node.close = function(){
              sbtnIns.close();
              searchBtn.prop("disabled", "disabled");
              li.removeClass("active");
              icon.addClass(ICONIMAGEPLUS);
              icon.removeClass(ICONIMAGEDOWN);
            };
            iconwrap.on("click", function(event){
              event.stopPropagation();
              folderOpenAndClose(event)
            });
          };
          item.append(buttongroup);
        };
        rootNode.on = function(eventName, callback){
          events[eventName] = callback;
        };
        rootNode.traverse(traverse);
        treeMenu.prototype.exposeToLeve = function(lv){
          rootNode.traverse(function(node){
            if(node.level < lv){
              if(node.open)
              node.open();
            } else {
              if(node.close)
              node.close();
            }
          });
        };
        rootNode.$on("rootNodeRefresh", function(){
          rootNode.update();
        })
        rootNode.hideRootNode = function(){
          rootNode.item.css("display", "none");
        }
        return rootNode;
      };
      return new treeMenu(treeDataHandler.init(data, format))
    }
  };
});