/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var element = data.element;
    var tabWrap = data.tabWrap;
    var coldomInner = data.coldomInner;
    var previewMode = data.previewMode;
    var traverseColumn = data.traverseColumn;
    var onTabClick = data.onTabClick;
    var rowDom = data.rowDom;
    if(element.tabInx == undefined) {
      var fd = element.children.find(function(elem){
        return elem.default == true
      });
      if(fd){
        element.tabInx = element.children.indexOf(fd);
      } else {
        element.tabInx = 0;
      }
    }
    var ulDom = $("<div class='nav nav-tabs'></div>");
    var liAdd = $("<li style='cursor : pointer;'><a><span class='glyphicon glyphicon-plus'></span><span class=''>创建标签</span></a></li>");
    if(element.$attr("parameters/align") == "vertical") {
      ulDom.addClass("vertical");
      tabWrap.css("float", "left");
      tabWrap.css("width", "100px");
      if(!previewMode) {
        coldomInner.css("float", "left");
        coldomInner.css("width", "calc( 100% - 100px )");
      }
    }
    //coldomInner.addClass("tab-content");
    tabWrap.append(ulDom);
    var renderTab = function() {
      ulDom.children().remove();
      if(!previewMode)
      {
        ulDom.append(liAdd)
      };
      for(var i in element.children) {
        (function(index, child){
          var liDom = $("<li style='cursor:pointer;'><a></a></li>");
          var label = $("<span></span>");
          var editBtn = $("<span class='proudsmart ps-edit' style='cursor:pointer;'></span>");
          var removeBtn = $("<span class='glyphicon glyphicon-remove' style='cursor:pointer;'></span>");
          label.css("padding-right", "5px");
          editBtn.css("padding-right", "5px");
          if(element.tabInx == index) {
            child.display = "block";
            liDom.addClass("active");
          } else {
            child.display = "none";
          };
          child.tabId = index;
          liDom.attr("id", index);
          label.text(child.tabName);
          liDom.find("a").append(label);
          if(!previewMode) {
            liDom.find("a").append(editBtn);
            liDom.find("a").append(removeBtn);
            liAdd.before(liDom);
            editBtn.on("click", function(event, ui){
              event.stopPropagation();
              onTabClick({event : event, ui: ui, target: child, parent: element});
            });
            removeBtn.on("click", function(event){
              event.stopPropagation();
              if(element.children.length > 1) {
                element.children.$remove(function(inx, elem){
                  return index == inx;
                });
                if(element.tabInx >= index) {
                  if(element.tabInx > 0){
                    element.tabInx --;
                  }
                }
                if(!previewMode) {
                  coldomInner.children().remove();
                  renderTab();
                  traverseColumn(coldomInner, element.children, previewMode);
                } else {
                  rowDom.children("[tabId]").remove();
                  renderTab();
                  traverseColumn(rowDom, element.children, previewMode);
                }
              }
            });
          } else {
            ulDom.append(liDom);
          };
          liDom.on("click", function(){
            ulDom.find(".active").removeClass("active");
            liDom.addClass("active");
            element.tabInx = index;
            for(var j in element.children) {
              element.children[j].display = "none";
            }
            child.display = "block";
            if(!previewMode) {
              coldomInner.children().remove();
              renderTab();
              traverseColumn(coldomInner, element.children, previewMode);
            } else {
              rowDom.children("[tabId]").remove();
              renderTab();
              traverseColumn(rowDom, element.children, previewMode);
            }
          });
        })(i, element.children[i])
      }
      liAdd.on("click", function(){
        element.children.push({
          "id" : $randomString(32),
          "tabName" : "新建标签页",
          "tabId" : element.children.length - 1,
          "type": "tabShowItem",
          "display" : "none",
          "children": []
        });
        if(!previewMode) {
          coldomInner.children().remove();
          renderTab();
          traverseColumn(coldomInner, element.children, previewMode);
        } else {
          rowDom.children("[tabId]").remove();
          renderTab();
          traverseColumn(rowDom, element.children, previewMode);
        }
      });
    };
    renderTab();
  }
});
