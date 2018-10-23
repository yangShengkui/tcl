define(['directives/directives', 'bootstrap-dialog', 'jszip', 'datatables.net',
  'datatables.net-bs', 'datatables.net-select', 'datatables.net-buttons-bs',
  'datatables.buttons.html5'
], function(directives, BootstrapDialog, jszip, datatables) {
  'use strict';
  //======================================    能耗结构tree    ===========================================
  directives.initDirective('energytree', ['$timeout', function(timeout, compile) {
    var directives = {};
    directives.scope = {
      ngModel: "=",
      options: "=",
      label: "=",
      change: "&",
      fontsize: "=",
      width: "=",
      dtMark: "=",
      dtKey: "=",
      key: "@",
      placeholder: "@"
    };
    directives.restrict = "C";
    directives.link = link;

    function link(scope, element, attr) {
      // if(element.context.children.length>0) return;  行内选择时使用
      var ready = function() {
        var mark;
        var placeholder = scope["placeholder"] == "" ? "" : (scope["placeholder"] ? scope["placeholder"] : "请选择...");
        var label = scope['label'] ? scope['label'] : 'text';
        var dtKey = scope.dtKey;
        var dtMark = scope.dtMark;
        var key;
        if (dtKey) {
          key = dtKey;
        } else {
          key = attr.key ? attr.key : "id";
        }
        if (dtMark) {
          mark = dtMark;
        } else {
          mark = attr["mark"] ? attr["mark"] : "children";
        }
        var cssStyle = "form-control";
        $(element).css("width", scope.width);
        if (attr["class"]) {
          if (attr["class"].search("input-sm") > -1 || attr["class"].search("select-sm") > -1) {
            cssStyle = "form-control input-sm";
          }
        }
        var select = $("<select></select>").addClass(cssStyle);
        var wraps = [];
        select.on("mousedown", function(event) {
          event.preventDefault();
        });
        select.on("click", function(event) {
          scope.$apply(function() {
            var elem = $(element).find('[id*=container]');
            if (elem.hasClass("noview")) {
              elem.removeClass("noview");
              select.addClass("extend");
              timeout(function() {
                $('body').on("click.body", docClick);
              });
            }
            // docClick函数定义放在if内部在IE下面会报错
            function docClick() {
              elem.addClass("noview");
              $('body').off("click.body");
              select.removeClass("extend");
            }
          });
        });
        element.append(select);

        function ngModelWatcher(n, o, s) {
          wraps.forEach(function(wrap) {
            wrap.removeClass("active");
          })
          if (n == undefined) {
            select.children().remove();
            select.append($("<option id='selectlabel' value='selectlabel'>" + placeholder + "</option>"))
          }
          if (n != undefined && scope.options) {
            var children;
            if (jQuery.isArray(scope.options)) {
              children = scope.options;
            } else {
              children = scope.options[mark];
            }
            var selectedTraverse = function(children) {
              children.forEach(function(child) {
                if (child[key] == n) {
                  select.children().remove();
                  select.append($("<option id='selectlabel' value='selectlabel'>" + (child.label ? child.label : '请选择...') + "</option>"));
                  wraps.forEach(function(wrap) {
                    if (wrap.attr(key) == n) {
                      wrap.addClass("active");
                    }
                  });
                } else {
                  if (child[mark]) {
                    selectedTraverse(child[mark]);
                  }
                }
              });
            };
            selectedTraverse(children);
          }
          if (scope.change && n != o) { //手动触发change方法
            scope.change({
              data: n
            });
          }
        };

        //traverse函数定义放在if内部在IE下会报错
        function traverse(children, container, level) {
          children.forEach(function(child) {
            var wrap = $("<div></div>").addClass("wrap");
            var handler = $("<div></div>").addClass("glyphicon");
            var label = $("<span></span>").addClass("labeltxt");
            var childrenDom = $("<div></div>").addClass("children");
            var find = false;
            var children = child[mark];
            var checkhasViewId = function(child) {
              if (child.viewId == scope.ngModel) {
                return true;
              } else {
                if (child.hasOwnProperty(mark)) {
                  var checkViewId = function(chd) {
                    return checkhasViewId(chd);
                  };
                  for (var i in child[mark]) {
                    if (checkViewId(child[mark][i])) {
                      return true;
                    }
                  }
                }
              }
              return false;
            };
            handler.data("children", children);
            var lb = scope['label'] ? scope['label'] : 'label'
            child.label = child[lb];
            label.text(child.label ? child.label : child.text);
            for (var i = 0; i <= level; i++) {
              (function(clone, inx) {
                if (inx == level - 1) {
                  clone.addClass("last");
                }
                clone.css("left", 10 + inx * 8 + "px");
                wrap.append(clone);
              })($("<div></div>").addClass("vline"), i);
            }
            wrap.append(handler);
            wrap.append(label);
            wrap.attr(key, child[key]);
            wrap.css("padding-left", (level * 8) + "px");
            wraps.push(wrap);
            container.append(wrap);
            if (child[key] == scope.ngModel || child[key] == attr["model"]) {
              select.children().remove();
              select.append($("<option id='selectlabel' value='selectlabel'>" + (child.label ? child.label : '请选择...') + "</option>"));
            }
            wrap.on("click", function(event) {
              scope.$apply(function() {
                select.children().remove();
                select.append($("<option id='selectlabel' value='selectlabel'>" + (child.label ? child.label : '请选择...') + "</option>"));
                wraps.forEach(function(elem) {
                  elem.removeClass("active");
                });
                wrap.addClass("active");
                if (attr.hasOwnProperty("model")) {
                  attr["model"] = child[key];
                  $(element).attr("model", child[key]);
                } else {
                  scope.ngModel = child[key];
                }
                $('body').trigger("click.body");
              });
            });
            if (children) {
              if (checkhasViewId(child) == false) {
                childrenDom.addClass("hidechildren");
                handler.addClass("glyphicon-plus");
              } else {
                handler.addClass("glyphicon-minus");
              }
              handler.on("click", function(event) {
                event.stopPropagation();
                if (handler.hasClass("glyphicon-minus")) {
                  handler.removeClass("glyphicon-minus").addClass("glyphicon-plus");
                  childrenDom.css("overflow", "hidden");
                  childrenDom.animate({
                    "height": "100%",
                    "opacity": 0
                  }, 300, function() {
                    childrenDom.css({
                      "display": "none"
                    }).css("overflow", "auto");
                  })
                } else {
                  handler.removeClass("glyphicon-plus").addClass("glyphicon-minus");
                  childrenDom.css("overflow", "hidden").css("display", "block");
                  childrenDom.animate({
                    "height": "100%",
                    "position": "absolute",
                    "opacity": 1
                  }, 300);
                }
              });
              container.append(childrenDom);
              traverse(children, childrenDom, level + 1);
            }

          })
        };

        function optionsWatcher(n, o, s) {
          if (n) {
            var options = n;
            var container = $("<div></div>").attr("id", "container").addClass("noview").css("border-top", "1px solid #ddd");
            var childrenDom = $("<div></div>").addClass("children");
            var children;
            if (jQuery.isArray(options)) {
              children = options;
            } else {
              children = options[mark];
            }
            if (attr["showclear"]) { //显示空选项
              var clone = {
                key: null
              };
              clone[label] = placeholder;
              children = [clone].concat(children);
            }
            select.find('[id*=selectlabel]').remove();
            if (options[key] && (options[key] == scope.ngModel || options[key] == attr["model"])) {
              select.append($("<option id='selectlabel'>" + (options.label ? options.label : '请选择...') + "</option>"))
            } else {
              select.append($("<option id='selectlabel'>" + placeholder + "</option>"));
            }
            container.append(childrenDom);
            element.find('[id*=container]').remove();
            element.append(container);
            if (children) {
              traverse(children, childrenDom, 1);
            }
          } else {
            element.find('[id*=container]').remove();
          }
        };

        if (attr.hasOwnProperty("ngModel") && attr.ngModel) {
          scope.$watch("ngModel", ngModelWatcher);
        }
        if (attr.hasOwnProperty("options") && attr.options) {
          if (scope.options && ((jQuery.isArray(scope.options) && scope.options.length > 0) || scope.options[mark])) {
            optionsWatcher(scope.options);
          } else {
            scope.$watch("options", optionsWatcher);
          }
        }
      };
      timeout(ready);
    }
    return directives;
  }]);

  //======================================    能耗结构信息    ===========================================
  directives.initDirective('energyStructureTable', ['$timeout', 'ngDialog', '$compile', 'resourceUIService', 'energyConsumeUIService',
    '$filter', 'growl', '$q',
    function($timeout, ngDialog, $compile, resourceUIService, energyConsumeUIService, $filter, growl, $q) {
      return {
        restrict: 'A',
        scope: {
          ngModel: "=",
          add: "&",
          delete: "&",
          edit: "&",
          user: "&"
        },
        link: function(scope, element, attr, tableCtrl) {
          var parentSelectList = scope.$parent.$parent.energyStrucInfo;
          var TEXT = {
            "SUBMIT": "确定",
            "CANCEL": "取消"
          };
          var description = $("<div></div>")
            .css("z-index", 1999)
            .css("background-color", "#fff")
            .css("box-shadow", "1px 1px 10px rgba(0,0,0,.3)")
            .css("padding", "15px 20px")
            .css("margin", "-5px 0 0 25px")
            .css("display", "block")
            .css("width", "300px")
            .css("position", "fixed");
          var des_text = $("<p></p>")
            .text('')
            .css("color", "#666")
            .css("margin", 0)
            .css("line-height", "16px")
            .css("font-size", "12px")
            .css("font-weight", "normal");
          var des_close = $("<div></div>")
            .append($("<span class='close'>x</span>"))
          var des_title = $("<p></p>")
            .text("描述 :")
            .css("font-weight", "bold")
            .css("color", "#333")
            .css("margin", "10px auto")
            .css("line-height", "16px")
            .css("font-size", "12px");
          description.append(des_close).append(des_text);
          var ready = function() {
            $(element).css("position", "relative");
            var ngModelWatcher = function(n, o, s) {
              var getAllName = function(data) {
                var rs = [];
                var traverse = function(data) {
                  rs.push(data.label);
                  var loop = function(elem) {
                    traverse(elem);
                  };
                  if (data.hasOwnProperty("children")) {
                    for (var i in data.children) {
                      loop(data.children[i]);
                    }
                  }
                }
                traverse(data);
                return rs;
              };
              //获取所有设备
              var queryAllDevicesList = function() {
                resourceUIService.getDevicesByCondition({}, function(returnObj) {
                  if (returnObj.code == 0) {
                    returnObj.data.forEach(function(obj) {
                      obj.text = obj.label;
                    });
                    scope.allDeveicesList = returnObj.data;
                  }
                })
              }();

              //获取所有设备模板
              var queryAllModelsList = function() {
                var filterModels = [];
                var filterAry = [];
                energyConsumeUIService.getDeviceTypeNames('devicetype', function(returnObj) {
                  if (returnObj.code == 0) {
                    returnObj.data.forEach(function(obj) {
                      obj.text = obj.label;
                    });
                    scope.allModelsList = returnObj.data;
                  }
                })
              }();
              //获取设备下的设备模型Id，再得到kpi值
              scope.querykpisByModelId = function(deviceId) {
                var modelObj = {};
                if (typeof(deviceId) === 'object') {
                  deviceId = deviceId.id.substring(deviceId.id.indexOf(':') + 1);
                }
                modelObj = scope.allDeveicesList.find(function(item) {
                  return item.id == deviceId;
                });
                if (!modelObj) {
                  return;
                }
                resourceUIService.getKpisByModelId(modelObj.modelId, function(returnObj) {
                  if (returnObj.code == 0) {
                    returnObj.data.forEach(function(item) {
                      item.text = item.label;
                    })
                    scope.kpis = returnObj.data;
                  }
                })
              };
              var render = function(data, type, searchlist) {
                var tree = data;
                var ifCommit = data.commit == 'yes' ? true : false;
                $(element).children().remove();
                var traverse = function(target, data, depth, parentIcon, parentRmvBtn, parentDom, parentUser, parentData) {
                  depth++;
                  var children;
                  var dom = $("<div></div>")
                    .css("border-bottom", "1px solid #ddd")
                    .css("position", "relative")
                    .css("overflow", "hidden")
                    .css("opacity", 0)
                    .css("max-height", 0)
                    .css("line-height", "40px");
                  var btn = $("<button></button>")
                    .css("line-height", "24px")
                    .css("color", "#fff")
                    .css("border", "0")
                    .css("background-color", "#009dea")
                    .css("float", "left")
                    .css("margin", "4px 10px 0px 3px");
                  var icon = $("<span></span>").addClass("glyphicon glyphicon-minus");
                  var userIcon = $("<span></span>").addClass("glyphicon glyphicon-user")
                    .css("margin", "0 17px")
                    .css("color", "#ccc");
                  var rubish = $("<div></div>").addClass("glyphicon glyphicon-trash");
                  var add = $("<div></div>").addClass("glyphicon glyphicon-plus");
                  var addSource = $("<div></div>").addClass("glyphicon glyphicon-tag");
                  var person = $("<span></span>").addClass("glyphicon glyphicon-user");
                  var text = $("<span></span>").css("margin-left", 10).text(data.name);
                  var infoBtn = $("<span></span>").addClass("glyphicon glyphicon-question-sign")
                    .css("font-size", "16px")
                    .css("color", "#eee")
                    .css("margin-left", "20px");

                  var infoBtnClick = function(event) {
                    event.stopPropagation();
                    description.remove();
                    var offset = $(event.target).offset();
                    description.css({
                      opacity: 0,
                      top: offset.top - 20,
                      left: offset.left + 5
                    });
                    description.text(data.description);
                    $("body").prepend(description);
                    description.animate({
                      opacity: 1
                    }, 300);
                    $("body").on("click.infoleave", infoBtnLeave);
                  };

                  var infoBtnLeave = function(event) {
                    event.stopPropagation();
                    $("body").off();
                    description.remove();
                  };
                  var edit = $("<span></span>").addClass("proudsmart ps-edit");
                  var editSource = $("<span></span>").addClass("proudsmart ps-edit");
                  var removeBtn = $("<button></button>")
                    .css("color", "#dd695c")
                    .css("border", "1px solid #ddd")
                    .css("margin", 0)
                    .css("background-color", "#fff")
                    .css("line-height", "24px")
                    .css("position", "relative")
                    .css("overflow", "visible")
                    .css("float", "right")
                    .css("z-index", 7)
                    .css("margin", "4px 3px 0px 2px");
                  var addBtn = removeBtn.clone();
                  var addSourceBtn = removeBtn.clone();
                  var editBtn = removeBtn.clone();
                  var editSourceBtn = removeBtn.clone();
                  var cover = $("<div></div>")
                    .css("background-color", "#0f58a9")
                    .css("opacity", .2)
                    .css("position", "absolute")
                    .css("height", "40px")
                    .css("top", 0)
                    .css("width", "100%");
                  var inner = $("<div></div>")
                    .css("margin-left", (type != "search" ? depth * 20 : 0) + "px");
                  addBtn.append(add);
                  addSourceBtn.append(addSource);
                  addBtn.css("z-index", 3).css("color", "#1eb8b8");
                  addSourceBtn.css("z-index", 1).css("color", "rgb(92, 95, 221)");
                  editBtn.append(edit);
                  editBtn.css("z-index", 5).css("color", "#009fea");
                  editSourceBtn.append(editSource);
                  editSourceBtn.css("z-index", 2).css("color", "#009fea");
                  removeBtn.append(rubish);

                  //获取当前节点下的所有计量点
                  var ConsumeMetersList = [];
                  var getConsumeMeters = (function(data) {
                    energyConsumeUIService.findEnergyConsumeMeters([{
                      energyConsumeId: data.id
                    }], function(returnObj) {
                      if (returnObj.code == 0) {
                        // returnObj.data.forEach(function(item) {
                        //   item.energyConsumeId = data.id;
                        // });
                        ConsumeMetersList = returnObj.data;
                      }
                    })
                  })(data);

                  if (type == "search") { //查找
                    var find = searchlist.find(function(elem) {
                      return elem.name == data.name;
                    });
                    if (!find) { //查找没有找打
                      dom.css("display", "none");
                    } else { //找到了，高亮显示
                      btn.prop("disabled", true);
                      dom.on("click", function(event) {
                        scope.$broadcast("HIGHLIGHTDATA", data);
                      });
                    }
                    btn.css("display", "none");
                  } else if (type == "highlight") { //找到了，高亮显示
                    if (searchlist) {
                      if (data.id == searchlist.id) {
                        dom.css("background-color", "#d1edaa");
                      }
                    }
                  }
                  btn.append(icon);
                  if (data.description) {
                    infoBtn
                      .css("cursor", "pointer")
                      .css("color", "#ccc")
                      .on("click", infoBtnClick);
                  }
                  if (!parentData) { //没有父节点，不许编辑
                    dom.css("background-color", "#eee");
                    editBtn.css("display", "none");
                    removeBtn.css("display", "none");
                  }
                  var foldClick = function(event) {
                    if (children.css("max-height") == "0px") {
                      $timeout(function() {
                        icon.removeClass().addClass("glyphicon glyphicon-minus");
                        children.animate({
                          "max-height": 800,
                          "opacity": 1
                        }, 300);
                      });
                    } else {
                      $timeout(function() {
                        icon.removeClass().addClass("glyphicon glyphicon-plus");
                        children.animate({
                          "max-height": 0,
                          "opacity": 0
                        }, 300);
                      })
                    }
                  };

                  var addClick = function(event) {
                    event.stopPropagation();
                    var cancel = function(event) {
                      ngDialog.close();
                    };
                    var namelist = [];
                    if (data.children == undefined) {
                      data.children = [];
                    }
                    namelist = getAllName(tree);
                    var inx = 0;
                    var name = "新建能耗节点";
                    while (namelist.indexOf(name) != -1) {
                      inx++;
                      name = "新建能耗节点_" + inx;
                    }
                    var confirm = function(event) {
                      var id = data.id;
                      var name = '',
                        des = '',
                        modelDefinitionId = '';
                      if (!event.input[0].value.id) {
                        growl.warning("请选择类型", {});
                        return;
                      }
                      if (event.input[0].value.id == 'model') {
                        name = event.input[2].value;
                        modelDefinitionId = event.input[1].value.id;
                        if (!modelDefinitionId) {
                          growl.warning("请选择设备模板", {});
                          return;
                        } else if (!name) {
                          growl.warning("请填写节点名称", {});
                          return;
                        }
                      } else if (event.input[0].value.id == 'input') {
                        name = event.input[3].value;
                        des = event.input[4].value;
                        if (!name) {
                          growl.warning("请填写节点名称", {});
                          return;
                        }
                      }
                      var success = function(returnObj) {
                        if (returnObj.code != 0) {
                          return;
                        }
                        var newAdd = returnObj.data;
                        data.children.push(newAdd);
                        userIcon.css("display", "none");
                        btn.css("display", "inline");
                        icon.removeClass().addClass("glyphicon glyphicon-minus");
                        if (children == undefined) {
                          children = $("<div></div>").css("overflow", "hidden").css("position", "relative");
                        }
                        dom.after(children);
                        btn.off("click");
                        btn.on("click", foldClick);
                        removeBtn.prop("disabled", true);
                        removeBtn.css("color", "#aaa");
                        dom.css("font-weight", "bold");
                        traverse(children, newAdd, depth, btn, removeBtn, dom, userIcon, data.children);
                        scope.add({
                          event: data
                        });
                        if (children.css("max-height") == "0px") {
                          $timeout(function() {
                            icon.removeClass().addClass("glyphicon glyphicon-minus");
                            children.animate({
                              "max-height": 400,
                              "opacity": 1
                            }, 300, function() {});
                          })
                        };
                        growl.success("能耗节点添加成功", {});
                        ngDialog.close();
                      }
                      var error = function(returnObj) {
                        growl.warning("添加节点能耗失败", {});
                      };
                      energyConsumeUIService.addDomain([{
                        'parentID': id,
                        'modelDefinitionId': event.input[0].value.id == 'model' ? modelDefinitionId : undefined,
                        'name': name,
                        'description': des
                      }], success);
                    };

                    var fnlist = [{
                      label: TEXT.SUBMIT,
                      icon: 'btn btn-primary',
                      style: {
                        width: '50%',
                        'border-radius': 0,
                        'font-size': '18px',
                        'font-weight': 'bold',
                        'padding': 10
                      },
                      fn: confirm
                    }, {
                      label: TEXT.CANCEL,
                      icon: 'btn btn-default',
                      style: {
                        width: '50%',
                        'border-radius': 0,
                        'font-size': '18px',
                        'font-weight': 'bold',
                        'padding': 10
                      },
                      fn: cancel
                    }];

                    var modelSelect = [{
                      value: '',
                      label: '设备模板',
                      type: 'select',
                      placeholder: '设备模板',
                      apply: false,
                      options: scope.allModelsList,
                      change: function(event) {}
                    }, {
                      value: '',
                      label: '节点名称',
                      type: 'input',
                      placeholder: '节点名称',
                      apply: false,
                      maxlength: 32,
                      onChange: function(event) {
                        if (namelist.indexOf(event.value) != -1) {
                          event.error = "此节点名称已被占用";
                          fnlist[0].disabled = true;
                        } else {
                          event.error = null;
                          fnlist[0].disabled = false;
                        }
                      }
                    }];

                    var nodesInput = [{
                      value: name,
                      label: '节点名称',
                      type: 'input',
                      placeholder: '填写节点名称',
                      apply: false,
                      maxlength: 32,
                      onChange: function(event) {
                        if (namelist.indexOf(event.value) != -1) {
                          event.error = "此节点名称已被占用";
                          fnlist[0].disabled = true;
                        } else {
                          event.error = null;
                          fnlist[0].disabled = false;
                        }
                      }
                    }, {
                      value: '节点描述',
                      label: '节点描述',
                      type: 'textarea',
                      apply: false,
                      maxlength: 200,
                      placeholder: '填写节点描述'
                    }];

                    scope.dialog = {
                      title: {
                        label: '能耗节点信息'
                      },
                      input: [{
                        value: '',
                        label: '选择类型',
                        type: 'select',
                        placeholder: '选择类型',
                        apply: true,
                        options: [{
                          id: 'model',
                          label: '设备模板'
                        }, {
                          id: 'input',
                          label: '手动输入'
                        }],
                        change: function(event) {
                          if (event.value.id == 'model') {
                            modelSelect[0].apply = true;
                            modelSelect[1].apply = true;
                            nodesInput.forEach(function(item) {
                              item.apply = false;
                              item.value = '';
                            });
                          } else {
                            modelSelect[0].apply = false;
                            modelSelect[0].value = '';
                            modelSelect[1].apply = false;
                            modelSelect[1].value = '';
                            nodesInput.forEach(function(item) {
                              item.apply = true;
                            });
                          }
                        }
                      }, modelSelect[0], modelSelect[1], nodesInput[0], nodesInput[1]],
                      fnlist: fnlist
                    };
                    ngDialog.open({
                      template: '../partials/dialogue/enterprise_dia_copy.html',
                      className: 'ngdialog-theme-plain',
                      scope: scope
                    });
                  };

                  var addSourceClick = function(event) {
                    event.stopPropagation();
                    var confirm = function(event) {
                      var consumeMeters = [];
                      consumeMeters = scope.dialog.title.consumeMeters;
                      if (consumeMeters.length == 0) {
                        growl.warning("需要至少添加一条计量点", {});
                        return;
                      }
                      for (var i in consumeMeters) {
                        if (consumeMeters[i].energyType == '' || consumeMeters[i].dataSourceType == '') {
                          growl.warning("请完整输入计量点", {});
                          return;
                        }
                      }

                      energyConsumeUIService.saveEnergyConsumeMeters([data.id, consumeMeters], function(returnObj) {
                        if (returnObj.code == 0) {
                          growl.success("能耗计量点保存成功", {});
                          ngDialog.close();
                        }
                      });
                    };
                    var cancel = function(event) {
                      ngDialog.close();
                    };
                    var fnlist = [{
                      label: TEXT.SUBMIT,
                      icon: 'btn btn-primary',
                      style: {
                        width: '50%',
                        'border-radius': 0,
                        'font-size': '18px',
                        'font-weight': 'bold',
                        'padding': 10
                      },
                      fn: confirm
                    }, {
                      label: TEXT.CANCEL,
                      icon: 'btn btn-default',
                      style: {
                        width: '50%',
                        'border-radius': 0,
                        'font-size': '18px',
                        'font-weight': 'bold',
                        'padding': 10
                      },
                      fn: cancel
                    }];

                    scope.dialog = {
                      title: {
                        label: '能耗计量点',
                        consumeMeters: ConsumeMetersList
                      },
                      view: ifCommit ? true : false,
                      select: {
                        energyTypeList: scope.$parent.$parent.energyTypeList,
                        dataSourceTypeList: scope.$parent.$parent.dataSourceTypeList
                      },
                      event: {
                        addClick: function() {
                          scope.dialog.title.consumeMeters.unshift({
                            energyType: '',
                            dataSourceType: '',
                            energyConsumeId: data.id,
                            createTime: new Date(),
                            id: -1
                          });
                        },
                        delClick: function(obj) {
                          for (var i in scope.dialog.title.consumeMeters) {
                            if (obj.createTime == scope.dialog.title.consumeMeters[i].createTime) {
                              scope.dialog.title.consumeMeters.splice(i, 1);
                            }
                          };
                        },
                        energyTypeClick: function(str) {
                          return;
                          // var ary = [];
                          // scope.$parent.$parent.energyStrucInfo.energyTypeList.forEach(function(item) {
                          //   if (item.valueCode != str) {
                          //     ary.push(item);
                          //   }
                          // });
                          // scope.$parent.$parent.energyStrucInfo.energyTypeList = ary;
                          // console.log(scope.$parent.$parent.energyStrucInfo.energyTypeList)
                          // scope.$apply();
                        }
                      },
                      button: fnlist
                    };

                    if (scope.dialog.title.consumeMeters) { //如果此dialog有计量点就查询出可能设备上的kpi值
                      scope.dialog.title.consumeMeters.forEach(function(item) {
                        if (item.deviceId) {
                          scope.querykpisByModelId(item.deviceId);
                        }
                      })
                    }
                    ngDialog.open({
                      template: '../partials/dialogue/energy_source_dia.html',
                      className: 'ngdialog-theme-plain',
                      scope: scope
                    });
                  };

                  var removeClick = function() {
                    event.stopPropagation();
                    var id = data.id;
                    var domainPath = data.domainPath;
                    var confirm = function() {
                      var success = function(event) {
                        if (event.code == 0) {
                          growl.success("能耗节点已删除成功", {});
                          parentData.$remove(function(index, elem) {
                            return elem.id == data.id;
                          });
                          if (parentData.length == 0) {
                            parentRmvBtn.removeAttr("disabled");
                            parentRmvBtn.css("color", "#dd695c");
                          } else {
                            parentRmvBtn.prop("disabled", true);
                            parentRmvBtn.css("color", "#aaa");
                          }
                          ngDialog.close();
                          var animFinished = function() {
                            dom.remove();
                            if (target.children().size() == 0) {
                              target.remove();
                              parentDom.css("font-weight", "normal");
                              parentDom.css("background-color", "#fff");
                              // parentRmvBtn.css("display", "block");
                              parentIcon.css("display", "none");
                              parentUser.css("display", "inline");
                            }
                          };
                          dom.animate({
                            "opacity": 0,
                            "max-height": 0
                          }, 300, animFinished);
                          scope.delete({
                            event: data
                          });
                        }
                      };
                      energyConsumeUIService.deleteDomainByDomainID(id, success);
                    };
                    var cancel = function() {
                      ngDialog.close();
                    };
                    var fnlist = [{
                      label: '确定',
                      icon: 'btn btn-success',
                      style: {
                        'width': '50%',
                        'border-radius': 0,
                        'font-size': '18px',
                        'font-weight': 'bold',
                        'padding': 10
                      },
                      fn: confirm
                    }, {
                      label: '取消',
                      icon: 'btn btn-default',
                      style: {
                        'width': '50%',
                        'border-radius': 0,
                        'font-size': '18px',
                        'font-weight': 'bold',
                        'padding': 10
                      },
                      fn: cancel
                    }];
                    scope.dialog = {
                      title: {
                        label: '提示'
                      },
                      description: {
                        label: '确认删除该能耗节点吗？'
                      },
                      fnlist: fnlist
                    };
                    ngDialog.open({
                      template: '../partials/dialogue/common_dia_prompt.html',
                      className: 'ngdialog-theme-plain',
                      scope: scope
                    });
                  };

                  var editClick = function() {
                    event.stopPropagation();
                    var id = data.id;
                    var namelist = getAllName(tree);
                    namelist.$remove(function(index, elem) {
                      return elem == data.name;
                    });

                    var modelObj = scope.allModelsList.filter(function(item) {
                      return item.id == data.modelDefinitionId;
                    });
                    var confirm = function(event) {
                      var name = '',
                        des = '',
                        modelDefinitionId = '';
                      if (!event.input[0].value) {
                        growl.warning("请选择类型", {});
                        return;
                      }
                      if (event.input[0].value.id == 'model') {
                        name = event.input[2].value;
                        modelDefinitionId = event.input[1].value.id;
                        if (!modelDefinitionId) {
                          growl.warning("请选择设备模板", {});
                          return;
                        } else if (!name) {
                          growl.warning("请填写节点名称", {});
                          return;
                        }
                      } else if (event.input[0].value.id == 'input') {
                        name = event.input[3].value;
                        des = event.input[4].value;
                        if (!name) {
                          growl.warning("请填写节点名称", {});
                          return;
                        }
                      }
                      var param = {
                        'name': name,
                        'description': des,
                        'modelDefinitionId': modelDefinitionId ? modelDefinitionId : '',
                        'id': data.id,
                        'parentID': data.parentID
                      };
                      energyConsumeUIService.modifyDomainInfo(param, function(returnObj) {
                        if (returnObj.code == 0) {
                          if (returnObj.data.description) {
                            infoBtn
                              .css("cursor", "pointer")
                              .css("color", "#ccc")
                              .on("click", infoBtnClick);
                          } else {
                            infoBtn
                              .css("cursor", "default")
                              .css("color", "#eee")
                              .off("click");
                          }
                          text.text(returnObj.data.name);
                          des_text.text(returnObj.data.description);
                          data.name = returnObj.data.name;
                          data.description = returnObj.data.description;
                          growl.success("能耗节点修改成功", {});
                          ngDialog.close();
                        } else {
                          return;
                        }
                      });

                    };
                    var cancel = function(event) {
                      ngDialog.close();
                    };
                    var fnlist = [{
                      label: '确定',
                      icon: 'btn btn-primary',
                      style: {
                        width: '50%',
                        'border-radius': 0,
                        'font-size': '18px',
                        'font-weight': 'bold',
                        'padding': 10
                      },
                      fn: confirm
                    }, {
                      label: '取消',
                      icon: 'btn btn-default',
                      style: {
                        width: '50%',
                        'border-radius': 0,
                        'font-size': '18px',
                        'font-weight': 'bold',
                        'padding': 10
                      },
                      fn: cancel
                    }];

                    var modelSelect = [{
                      value: modelObj[0],
                      label: '设备模板',
                      type: 'select',
                      placeholder: '设备模板',
                      apply: data.modelDefinitionId ? true : false,
                      options: scope.allModelsList,
                      change: function(event) {}
                    }, {
                      value: data.name,
                      label: '节点名称',
                      type: 'input',
                      placeholder: '节点名称',
                      apply: data.modelDefinitionId ? true : false
                    }];

                    var nodesInput = [{
                      value: data.name,
                      label: '节点名称',
                      type: 'input',
                      placeholder: '填写节点名称',
                      apply: data.modelDefinitionId ? false : true,
                      maxlength: 32,
                      onChange: function(event) {
                        if (namelist.indexOf(event.value) != -1) {
                          event.error = "此节点名称已被占用";
                          fnlist[0].disabled = true;
                        } else {
                          event.error = null;
                          fnlist[0].disabled = false;
                        }
                      }
                    }, {
                      value: data.description,
                      label: '节点描述',
                      type: 'textarea',
                      apply: data.modelDefinitionId ? false : true,
                      maxlength: 200,
                      placeholder: '填写节点描述'
                    }];

                    var typeOptions = [{
                      id: 'model',
                      label: '设备模板'
                    }, {
                      id: 'input',
                      label: '手动输入'
                    }];
                    scope.dialog = {
                      title: {
                        label: '能耗节点信息'
                      },
                      input: [{
                        value: data.modelDefinitionId ? typeOptions[0] : typeOptions[1],
                        label: '选择类型',
                        type: 'select',
                        placeholder: '选择类型',
                        apply: true,
                        options: typeOptions,
                        change: function(event) {
                          if (event.value.id == 'model') {
                            modelSelect[0].apply = true;
                            modelSelect[1].apply = true;
                            nodesInput.forEach(function(item) {
                              item.apply = false;
                              item.value = '';
                            });
                          } else {
                            modelSelect[0].apply = false;
                            modelSelect[0].value = '';
                            modelSelect[1].apply = false;
                            modelSelect[1].value = '';
                            nodesInput.forEach(function(item) {
                              item.apply = true;
                            });
                          }
                        }
                      }, modelSelect[0], modelSelect[1], nodesInput[0], nodesInput[1]],
                      fnlist: fnlist
                    };
                    console.log(scope.dialog.input[0].value);
                    ngDialog.open({
                      template: '../partials/dialogue/enterprise_dia_copy.html',
                      className: 'ngdialog-theme-plain',
                      scope: scope
                    });
                    var ready = function() {
                      scope.edit({
                        event: data
                      });
                    };
                    scope.$apply(ready);
                  };

                  var userClick = function() {
                    var ready = function() {
                      scope.user({
                        user: data
                      });
                    };
                    scope.$apply(ready);
                  };

                  var intro = $('<div></div>')
                    .css("padding", "2px 10px")
                    .css("top", "0px")
                    .css("right", "32px")
                    .css("pointer-events", "none")
                    .css("border-radius", "2px")
                    .css("background-color", "#000")
                    .css("position", "absolute")
                    .css("font-weight", "bold")
                    .css("width", "100px")
                    .css("color", "#fff");

                  var addenter = function() {
                    intro.text("添加子节点");
                    addBtn.append(intro);
                  };
                  var addSourcEnter = function() {
                    intro.text("能耗计量点");
                    addSourceBtn.append(intro);
                  };
                  var addleave = function() {
                    intro.remove();
                  }
                  var addSourcLeave = function() {
                    intro.remove();
                  }
                  var removeenter = function() {
                    intro.text("删除子节点");
                    removeBtn.append(intro);
                  };
                  var removeleave = function() {
                    intro.remove();
                  }
                  var editenter = function() {
                    intro.text("编辑子节点");
                    editBtn.append(intro);
                  };
                  var editSourcenter = function() {
                    intro.text("编辑计量点");
                    editSourceBtn.append(intro);
                  };
                  var editleave = function() {
                    intro.remove();
                  };
                  var editSourceleave = function() {
                    intro.remove();
                  };
                  removeBtn.on("click", removeClick);
                  addBtn.on("click", addClick);
                  addSourceBtn.on("click", addSourceClick);
                  addBtn.on("mouseenter", addenter);
                  addSourceBtn.on("mouseenter", addSourcEnter);
                  addBtn.on("mouseleave", addleave);
                  addSourceBtn.on("mouseleave", addSourcLeave);
                  removeBtn.on("mouseenter", removeenter);
                  removeBtn.on("mouseleave", removeleave);
                  editBtn.on("click", editClick);
                  // editSourceBtn.on("click", editSourceClick);
                  editBtn.on("mouseenter", editenter);
                  editSourceBtn.on("mouseenter", editSourcenter);
                  editBtn.on("mouseleave", editSourceleave);
                  editSourceBtn.on("mouseleave", editSourceleave);
                  //userBtn.on("click", userClick);
                  target.append(dom);
                  if (type != 'search') {
                    inner.append(btn).append(userIcon)
                  };
                  inner.append(text).append(infoBtn);
                  dom.animate({
                    "opacity": 1,
                    "max-height": "50px"
                  }, 300);
                  cover.animate({
                    "opacity": "0"
                  }, 700, function() {
                    cover.remove();
                  });
                  if (data.hasOwnProperty("children")) {
                    userIcon.css("display", "none");
                    btn.css("display", "block");
                    dom.css("font-weight", "bold");
                    //dom.css("background-color", "#eee");
                    if (data.show = false) {
                      dom.css("max-height", 0);
                    };
                    children = $("<div></div>").css("overflow", "hidden");
                    var hasChild = function(data, target) {
                      var traverse = function(data) {
                        if (data == target) {
                          return true;
                        } else if (data.hasOwnProperty("children")) {
                          for (var i in data.children) {
                            if (traverse(data.children[i])) {
                              return true;
                            }
                          }
                          return false;
                        } else {
                          return false;
                        }
                      };
                      return traverse(data);
                    };
                    if (type == 'search') {
                      icon.removeClass().addClass("glyphicon glyphicon-minus");
                    } else if (type == 'highlight') {
                      if (hasChild(data, searchlist) && data != searchlist) {
                        icon.removeClass().addClass("glyphicon glyphicon-minus");
                      } else {
                        children.css("max-height", 0);
                        icon.removeClass().addClass("glyphicon glyphicon-plus");
                      };
                    } else {
                      if (depth > 1) {
                        children.css("max-height", 0);
                        icon.removeClass().addClass("glyphicon glyphicon-plus");
                      }
                    }
                    if (scope.$parent.$parent.energyStrucInfo.ifShow && ifCommit) { //企业用户且为提交状态
                      // removeBtn.prop("disabled", true);
                      removeBtn.attr("display", "none");
                      editBtn.prop("disabled", true);
                      addBtn.prop("disabled", true);
                      removeBtn.css("color", "#aaa");
                      editBtn.css("color", "#aaa");
                      addBtn.css("color", "#aaa");
                    }
                    target.append(children);
                    for (var i in data.children) {
                      traverse(children, data.children[i], depth, btn, removeBtn, dom, userIcon, data.children);
                    }
                    removeBtn.prop("disabled", true);
                    removeBtn.css("color", "#aaa");
                    btn.on("click", foldClick);
                  } else {
                    userIcon.css("display", "inline");
                    btn.css("display", "none");
                    removeBtn.removeAttr("disabled");
                    removeBtn.css("color", "#dd695c");
                    if (scope.$parent.$parent.energyStrucInfo.ifShow && ifCommit) { //企业用户且为提交状态
                      removeBtn.prop("disabled", true);
                      editBtn.prop("disabled", true);
                      addBtn.prop("disabled", true);
                      removeBtn.css("color", "#aaa");
                      editBtn.css("color", "#aaa");
                      addBtn.css("color", "#aaa");
                    }
                  }
                  inner.append(removeBtn).append(editBtn).append(addBtn).append(addSourceBtn);
                  // inner.append(removeBtn).append(addSourceBtn);
                  // inner.append(removeBtn).append(editSourceBtn).append(addSourceBtn);
                  dom.append(inner);
                  dom.append(cover);
                };
                if (data instanceof Array) {
                  for (var i in data) {
                    traverse($(element), data[i], -1);
                  }
                } else {
                  traverse($(element), data, -1);
                }
              };
              if (n != undefined) {
                scope.$on("FILTERDATA", function(event, data) {
                  render(n, "search", data);
                });
                scope.$on("HIGHLIGHTDATA", function(event, data) {
                  render(n, 'highlight', data);
                });
                scope.$on("FILTERDATA_allData", function(event, data) {
                  render(n, "normal", data);
                });
                scope.$on("commit", function(event, data) {
                  console.log(n);
                  n.commit = 'yes';
                  console.log(n);
                  render(n);
                });
                render(n);
              }
            };
            scope.$watch("ngModel", ngModelWatcher);
          };
          $timeout(ready);

        }
      }
    }
  ]);

  //======================================    能源折标系数   ===========================================
  directives.initDirective('energyConvertTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        window.JSZip = jszip;
        $scope.$on(Event.ENTERPRISEINIT + "_convert", function(event, args) {
          if (table) {
            table.destroy();
            domMain.empty();
          }
          var columns = [{
            data: "convertStandardYear",
            title: "生效年度"
          }, {
            data: "state",
            title: "生效状态"
          }, {
            data: "modifyTime",
            title: "修改日期"
          }, {
            data: "effectTime",
            title: "生效日期"
          }, $.ProudSmart.datatable.optionCol3];
          table = domMain.DataTable({
            dom: '<"row"<"col-sm-6 margin-bottom-10">>' + (args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : ''),
            language: $.ProudSmart.datatable.language,
            // select: $.ProudSmart.datatable.select,
            data: args.option[0],
            order: [
              [1, "desc"]
            ],
            columns: columns,
            columnDefs: [{
              "targets": 0,
              "data": "convertStandardYear",
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 1,
              "data": "state",
              "render": function(data, type, full) {
                var stateTypeDic = {
                  "draft": "草稿",
                  "effect": "生效",
                  "ineffect": "失效"
                };
                if (data) {
                  return stateTypeDic[data];
                } else if (data == null) {
                  return "草稿";
                }
              }
            }, {
              "targets": 2,
              "data": "modifyTime",
              "render": function(data, type, full) {
                return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
              }
            }, {
              "targets": 3,
              "data": "effectTime",
              "render": function(data, type, full) {
                return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
              }
            }, {
              "targets": 4,
              "data": "option",
              "render": function(data, type, full) {
                var str = "<div class='btn-group btn-group-sm'>";
                if (full.state == "effect") {
                  str += "<button id='edit-btn' ng-disabled='true' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  str += "<button id='del-btn' ng-disabled='true' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                  str += "<button  type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                  str += "<ul class='dropdown-menu' role='menu'>";
                  str += "<li><a id='view-btn'>查看</a></li>";
                  str += "</ul></div>";
                } else {
                  str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  str += "<button id='del-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                  str += "<button  type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                  str += "<ul class='dropdown-menu' role='menu'>";
                  str += "<li><a id='effect-btn'>生效</a></li>";
                  str += "<li><a id='view-btn'>查看</a></li>";
                  str += "</ul></div>";
                }
                return str;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });
          var arrLength = [];
          for (var i = 0; i < columns.length - 1; i++) {
            arrLength.push(i);
          }
          if (args.option && args.option[0].length >= 1) {
            new $.fn.dataTable.Buttons(table, {
              buttons: [{
                extend: 'excel',
                title: '能源折标系数导出',
                text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
                exportOptions: {
                  columns: arrLength
                }
              }]
            });
            table.buttons().container().appendTo('.dataTables_wrapper .col-sm-6 ');
          }
        });

        /**
         * 监听表格初始化后，添加按钮
         */
        domMain.on('click', 'td', function(e) {
          e.preventDefault();
          $(domMain).find("tbody tr").removeClass("selected");
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          tr.addClass('selected');
          $scope.selectedCount = row.data().id;
          $scope.$apply();
        });

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          location.href = "#/energySignatureInfo/" + $.trim(row.data().id);
        });

        domMain.on('click', '#effect-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('effect', [row.data().id], function(returnObj) {
            if (returnObj.code == 0) {
              row.data().state = returnObj.data.state;
              row.data().effectTime = returnObj.data.effectTime;
              $(domMain).find("tbody tr").removeClass("selected");
              table.rows().invalidate().draw(false);
            }
          });
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('delete', [row.data().id], function(returnObj) {
            if (returnObj.code == 0) {
              row.remove().draw(false);
            }
          });
        });

        domMain.on('click', '#view-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          location.href = "#/energySignatureInfo/" + $.trim(row.data().id) + '/View';
        });

        domMain.on('change', '#allselect-btn', function(e) {
          e.stopPropagation();
          if (e.target.checked) {
            table.rows().select();
            var tableRows = table.rows({
              selected: true
            });
            $scope.selectedCount = tableRows.count();
            $scope.$apply();
            for (var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().selected = true;
            };
            table.rows().invalidate().draw(false);
          } else {
            var tableRows = table.rows({
              selected: true
            });
            for (var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().selected = false;
            };
            table.rows().deselect();
            $scope.selectedCount = 0;
            $scope.$apply();
            table.rows().invalidate().draw(false);
          }
        });

        domMain.on('change', '.itemCheckBox', function(e) {
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if (e.target.checked) {
            row.data().selected = true;
          } else {
            row.data().selected = false;
          }
          var tableRows = table.rows({
            selected: true
          });
          if (tableRows.count() == 0) {
            $('#allselect-btn').attr("checked", false);
          }
          $scope.selectedCount = tableRows.count();
          $scope.$apply();
        });

        //多项删除
        $scope.selectedDelete = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if (selectedCount == 0) {
            growl.warning("当前没有选中的产品信息", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var enterpriseIdAry = [];
          var ifGo = false;
          for (var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            if (rowData.id > 0) {
              enterpriseIdAry.push(rowData.id);
              successCount++;
            } else {
              errorCount++;
            }
            if (selectedCount == (successCount + errorCount)) {
              ifGo = true;
              // growl.success("成功确认" + successCount + "个,失败" + errorCount + "个", {});
            }
          };
          if (ifGo) {
            $scope.doAction("delete", enterpriseIdAry, function(returnObj) {
              if (returnObj.code == 0) {
                for (var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  row.remove().draw(false);
                }
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              } else if (!returnObj) {
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              }
            });
          }
        };

      }]
    }
  }]);

  //======================================    能源折标的编辑增删   ===========================================
  directives.initDirective('energyEditConvert', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        $scope.$on(Event.ENTERPRISEINIT + "_convertedit", function(event, args) {
          if (table) {
            table.destroy();
            domMain.empty();
          }
          var columns = [{
              data: "energyType",
              title: "能源类型"
            }, {
              data: "valentweight",
              title: "当量系数"
            }, {
              data: "equal",
              title: "等量系数"
            }, {
              data: "createTime",
              title: "",
              visible: false
            },
            $.ProudSmart.datatable.optionCol3
          ];
          table = domMain.DataTable({
            dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            data: args.option[0],
            order: [
              [3, "desc"]
            ],
            columns: columns,
            columnDefs: [{
              "targets": 0,
              "data": "energyType",
              "render": function(data, type, full) {
                var energyTypeList = $scope.energyTypeList;
                for (var i in energyTypeList) {
                  if (energyTypeList[i].valueCode == data) {
                    return energyTypeList[i].label;
                  }
                }
              }
            }, {
              "targets": 1,
              "data": "valentweight",
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 2,
              "data": "equal",
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 4,
              "data": "option",
              "render": function(data, type, full) {
                var str = "<div class='btn-group btn-group-sm'>";
                if (location.hash.search("/View") > -1) {
                  str += "<button id='edit-btn' ng-disabled='true' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  str += "<button id='del-btn' ng-disabled='true' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                } else {
                  str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  str += "<button id='del-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                }

                str += "</div>";
                return str;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });

        });

        /**
         * 监听表格初始化后，添加按钮
         */

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $.extend($scope.dialog.input, row.data());
          ngDialog.open({
            template: '../partials/dialogue/energy_signatrue_dia.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('deleteDetail', [row.data().id], function(returnObj) {
            if (returnObj.code == 0) {
              row.remove().draw(false);
            }
          });
        });

        domMain.on('change', '#allselect-btn', function(e) {
          e.stopPropagation();
          if (e.target.checked) {
            table.rows().select();
            var tableRows = table.rows({
              selected: true
            });
            $scope.selectedCount = tableRows.count();
            $scope.$apply();
            for (var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().selected = true;
            };
            table.rows().invalidate().draw(false);
          } else {
            var tableRows = table.rows({
              selected: true
            });
            for (var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().selected = false;
            };
            table.rows().deselect();
            $scope.selectedCount = 0;
            $scope.$apply();
            table.rows().invalidate().draw(false);
          }

        });

        domMain.on('change', '.itemCheckBox', function(e) {
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if (e.target.checked) {
            row.data().selected = true;
          } else {
            row.data().selected = false;
          }
          var tableRows = table.rows({
            selected: true
          });
          if (tableRows.count() == 0) {
            $('#allselect-btn').attr("checked", false);
          }
          $scope.selectedCount = tableRows.count();
          $scope.$apply();
        });

        //多项删除
        $scope.selectedDelete = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if (selectedCount == 0) {
            growl.warning("当前没有选中的产品信息", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var enterpriseIdAry = [];
          var ifGo = false;
          for (var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            if (rowData.id > 0) {
              enterpriseIdAry.push(rowData.id);
              successCount++;
            } else {
              errorCount++;
            }
            if (selectedCount == (successCount + errorCount)) {
              ifGo = true;
              // growl.success("成功确认" + successCount + "个,失败" + errorCount + "个", {});
            }
          };
          if (ifGo) {
            $scope.doAction("delete", enterpriseIdAry, function(returnObj) {
              if (returnObj.code == 0) {
                for (var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  row.remove().draw(false);
                }
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              } else if (!returnObj) {
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              }
            });
          }
        };

      }]
    }
  }]);

  //======================================    能耗录入管理   ===========================================
  directives.initDirective('recordTaskTable', ['$timeout', 'ngDialog', '$compile', 'userLoginUIService', '$filter', 'growl', function($timeout, ngDialog, $compile, userLoginUIService, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        $scope.$on(Event.ENTERPRISEINIT + "_recordTask", function(event, args) {
          if (table) {
            table.destroy();
            domMain.empty();
          };
          var columns = [{
              data: "statisticsPeriod",
              title: "统计周期"
            }, {
              data: "enterpriseName",
              title: "企业名称",
              visible: $scope.userType != 101,
            }, {
              data: "statisticsType",
              title: "统计周期类型"
            }, {
              data: "createTime",
              title: "创建时间"
            }, {
              data: "modifyTime",
              title: "更新时间"
            }, {
              data: "commitTime",
              title: userLoginUIService.user.userType == 100 ? "审核时间" : "提交时间"
            }, {
              data: "overdue",
              title: "是否超期"
            }, {
              data: "state",
              title: "记录状态"
            },
            $.ProudSmart.datatable.optionCol3
          ];
          table = domMain.DataTable({
            dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            // select: $.ProudSmart.datatable.select,
            data: args.option[0],
            order: [
              [0, "desc"]
            ],
            columns: columns,
            columnDefs: [{
              "targets": 0,
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 1,
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 2,
              "render": function(data, type, full) {
                var statisticeDic = {
                  'MONTH': '月',
                  'QUARTER': '季度',
                  'YEAR': '年'
                };
                if (!full.statisticsType) {
                  return "-";
                } else {
                  return statisticeDic[full.statisticsType];
                }

              }
            }, {
              "targets": 3,
              "render": function(data, type, full) {
                return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
              }
            }, {
              "targets": 4,
              "render": function(data, type, full) {
                return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
              }
            }, {
              "targets": 5,
              "render": function(data, type, full) {
                return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
              }
            }, {
              "targets": 6,
              "render": function(data, type, full) {
                var timeDic = {
                  'no': '未超期',
                  'yes': '超期'
                }
                return timeDic[data];
              }
            }, {
              "targets": 7,
              "render": function(data, type, full) {
                var severityStr = "";
                var severityBg = "";
                if (userLoginUIService.user.userType == 100) { //政府
                  if (data == 'pass') {
                    severityStr = "已审核"
                    severityBg = "label-success";
                  } else if (data == 'commit') {
                    severityStr = "未审核"
                    severityBg = "label-default";
                  }
                } else {
                  if (data == 'commit' || data == 'pass') {
                    severityStr = "已提交"
                    severityBg = "label-success";
                  } else {
                    severityStr = "草稿"
                    severityBg = "label-default";
                  }
                }

                return "<span class='label " + severityBg + "'>" + severityStr + "</span>";
              }
            }, {
              "targets": 8,
              "data": "option",
              "render": function(data, type, full) {
                var str = "<div class='btn-group btn-group-sm'>";
                if ($scope.userType == 1000) { //企业
                  if (full.state == "commit" || full.state == "pass") {
                    str += "<button id='edit-btn' disabled='true' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    str += "<button id='commit-btn' disabled='true' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>提交</span></button>";
                  } else {
                    str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    str += "<button id='commit-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>提交</span></button>";
                  }
                  str += "<button id='view-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>查看</span></button>";
                  str += "</div>";
                } else if ($scope.userType = 100) { //政府操作员
                  if (full.state == "commit") { //未审核
                    str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    str += "<button id='commit-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>审核</span></button>";
                    // str += "<button  type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                  } else if (full.state == "pass") { //政府审核
                    str += "<button id='edit-btn' disabled='true' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    str += "<button id='commit-btn' disabled='true'  class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>审核</span></button>";
                  }
                  str += "<button id='view-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>查看</span></button>";
                  str += "</div>";
                }
                return str;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });

        });

        /**
         * 监听表格初始化后，添加按钮
         */
        domMain.on('click', 'td', function(e) {
          e.preventDefault();
          $(domMain).find("tbody tr").removeClass("selected");
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          tr.addClass('selected');
          $scope.selectedCount = row.data();
          $scope.$apply();
        });

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('edit', row.data(), function(returnObj) {
            if (returnObj.code == 0) {
              row.data().state = returnObj.data.state;
              $(domMain).find("tbody tr").removeClass("selected");
              table.rows().invalidate().draw(false);
            }
          });
        });

        domMain.on('click', '#commit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('commit', row.data().id, function(returnObj) {
            if (returnObj.code == 0) {
              row.data().state = returnObj.data.state;
              row.data().commitTime = returnObj.data.commitTime;
              $(domMain).find("tbody tr").removeClass("selected");
              table.rows().invalidate().draw(false);
            }
          });
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('delete', [row.data().id], function(returnObj) {
            if (returnObj.code == 0) {
              row.remove().draw(false);
            }
          });
        });

        domMain.on('click', '#view-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('view', row.data());
        });

        domMain.on('change', '#allselect-btn', function(e) {
          e.stopPropagation();
          if (e.target.checked) {
            table.rows().select();
            var tableRows = table.rows({
              selected: true
            });
            $scope.selectedCount = tableRows.count();
            $scope.$apply();
            for (var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().selected = true;
            };
            table.rows().invalidate().draw(false);
          } else {
            var tableRows = table.rows({
              selected: true
            });
            for (var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().selected = false;
            };
            table.rows().deselect();
            $scope.selectedCount = 0;
            $scope.$apply();
            table.rows().invalidate().draw(false);
          }

        });

        domMain.on('change', '.itemCheckBox', function(e) {
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if (e.target.checked) {
            row.data().selected = true;
          } else {
            row.data().selected = false;
          }
          var tableRows = table.rows({
            selected: true
          });
          if (tableRows.count() == 0) {
            $('#allselect-btn').attr("checked", false);
          }
          $scope.selectedCount = tableRows.count();
          $scope.$apply();
        });

        //多项删除
        $scope.selectedDelete = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if (selectedCount == 0) {
            growl.warning("当前没有选中的产品信息", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var enterpriseIdAry = [];
          var ifGo = false;
          for (var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            if (rowData.id > 0) {
              enterpriseIdAry.push(rowData.id);
              successCount++;
            } else {
              errorCount++;
            }
            if (selectedCount == (successCount + errorCount)) {
              ifGo = true;
              // growl.success("成功确认" + successCount + "个,失败" + errorCount + "个", {});
            }
          };
          if (ifGo) {
            $scope.doAction("delete", enterpriseIdAry, function(returnObj) {
              if (returnObj.code == 0) {
                for (var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  row.remove().draw(false);
                }
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              } else if (!returnObj) {
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              }
            });
          }
        };

      }]
    }
  }]);

  //======================================    执行历史信息    ===========================================
  directives.initDirective('historyTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        $scope.$on(Event.ENTERPRISEINIT + "_history", function(event, args) {
          if (table) {
            table.destroy();
            domMain.empty();
          }
          var columns = [{
            data: "name",
            title: "指令名称"
          }, {
            data: "operateResult",
            title: "执行状态"
          }, {
            data: "operateDescr",
            title: "指令参数描述"
          }, {
            data: "msgContent",
            title: "执行反馈描述"
          }, {
            data: "createTime",
            title: "执行时间"
          }];
          table = domMain.DataTable({
            dom: '<"row"<"col-sm-6 margin-bottom-10">>' + $.ProudSmart.datatable.footerdom,
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            processing: true,
            serverSide: true,
            ordering: true,
            aaSorting: [
              [4, "desc"]
            ],
            ajax: $scope.pipeline(),
            columns: columns,
            columnDefs: [{
              "targets": 0,
              "data": "name",
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 1,
              "data": "operateResult",
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 2,
              "data": "operateDescr",
              "render": function(data, type, full) {
                return "<div style='width:400px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;' data-toggle='tooltip' title='" + escape(data) + "'>" + escape(data) + "</div>";
              }
            }, {
              "targets": 3,
              "data": "statisticsType",
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 4,
              "data": "createTime",
              "render": function(data, type, full) {
                var str = '';
                str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                return str;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });

        });

      }]
    }
  }]);

});
