define(['directives/directives', 'datatables.net', 'datatables.net-bs'], function(directives, datatables) {
  'use strict';
  directives.initDirective('treeData', ['$timeout', 'ngDialog', 'userDomainService', 'growl', function(timeout, ngDialog, userDomainService, growl) {
    return {
      restrict: 'A',
      scope: {
        ngModel: "=",
        add: "&",
        delete: "&",
        edit: "&",
        user: "&"
      },
      link: function(scope, element, attr) {
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
            var rootscope,menuitems,label301,label302;
            var getAllName = function(data) {
              var rs = [];
              var traverse = function(data) {
                rs.push(data.label);
                var loop = function(elem) {
                  traverse(elem);
                };
                if(data.hasOwnProperty("children")) {
                  for(var i in data.children) {
                    loop(data.children[i])
                  }
                }
              }
              traverse(data);
              return rs;
            };
            var render = function(data, type, searchlist) {
              var tree = data,
                searchFound = (type == "search") ? false : true;
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
                  .css("line-height", "32px");
                var btn = $("<button></button>")
                  .css("line-height", "20px")
                  .css("color", "#fff")
                  .css("border", "0")
                  .css("background-color", "#009dea")
                  .css("float", "left")
                  .css("padding", "2px 5px 2px 6px")
                  .css("margin", "4px 0px 0px 3px");
                var icon = $("<span></span>").addClass("glyphicon glyphicon-minus").css("font-size", "10px");
                var userIcon = $("<span></span>").addClass("glyphicon glyphicon-user").css("opacity", 0)
                  .css("margin", "0 5px 0 8px")
                  .css("color", "#ccc");
                var rubish = $("<div></div>").addClass("glyphicon glyphicon-trash");
                var add = $("<div></div>").addClass("glyphicon glyphicon-plus");
                var person = $("<span></span>").addClass("glyphicon glyphicon-user");
                var text = $("<span></span>").css("margin-left", 10).text(data.name + (data.modelId == 301 ? "[" + label301 + "域]" : (data.modelId == 302 ? "[" + label302 + "域]" : "")));
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
                  des_text.text(data.description);
                  $("body").prepend(description);
                  description.animate({
                    opacity: 1
                  }, 300)
                  $("body").on("click.infoleave", infoBtnLeave)
                };
                var infoBtnLeave = function(event) {
                  event.stopPropagation();
                  $("body").off();
                  description.remove();
                };
                var edit = $("<span></span>").addClass("proudsmart ps-edit");
                var removeBtn = $("<button></button>")
                  .css("color", "#dd695c")
                  .css("border", "1px solid #ddd")
                  .css("margin", 0)
                  .css("background-color", "#fff")
                  .css("line-height", "14px")
                  .css("position", "relative")
                  .css("overflow", "visible")
                  .css("float", "right")
                  .css("z-index", 3)
                  .css("margin", "4px 3px 0px 2px");
                var addBtn = removeBtn.clone();
                var editBtn = removeBtn.clone();
                //var userBtn = removeBtn.clone();
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
                addBtn.css("z-index", 1).css("color", "#1eb8b8");
                editBtn.append(edit);
                editBtn.css("z-index", 2).css("color", "#009fea");
                removeBtn.append(rubish);
                //userBtn.append(person);
                if(type == "search") {
                  var find = searchlist.find(function(elem) {
                    return elem.name == data.name;
                  });
                  if(!find) {
                    dom.css("display", "none");
                  } else {
                    searchFound = true;
                    btn.prop("disabled", true);
                    dom.on("click", function(event) {
                      scope.$broadcast("HIGHLIGHTDATA", data);
                    });
                  }
                  btn.css("display", "none");
                } else if(type == "highlight") {
                  //当有检索时，检索内容高亮
                  if(searchlist) {
                    if(data.id == searchlist.id) {
                      dom.css("background-color", "#d1edaa");
                    }
                  }
                }
                btn.append(icon);
                if(data.description) {
                  infoBtn
                    .css("cursor", "pointer")
                    .css("color", "#ccc")
                    .on("click", infoBtnClick);
                }
                if(!parentData || (data.modelId == 301 && data.layer == 1) || (data.modelId == 302 && data.layer == 1)) {
                  // dom.css("background-color", "#eee"); 根据bug【PROMETHEUS-452】取消
                  editBtn.css("display", "none");
                  removeBtn.css("display", "none");
                }
                var foldClick = function(event) {
                  if(children.css("max-height") == "0px") {
                    timeout(function() {
                      icon.removeClass().addClass("glyphicon glyphicon-minus");
                      children.animate({
                        "max-height": 800,
                        "opacity": 1
                      }, 300);
                    });
                  } else {
                    timeout(function() {
                      icon.removeClass().addClass("glyphicon glyphicon-plus");
                      children.animate({
                        "max-height": 0,
                        "opacity": 0
                      }, 300);
                    });
                  };
                };
                var addClick = function(event) {
                  var provinces = rootscope.provinces;
                  var cityDics = rootscope.cityDics;
                  var districtDics = rootscope.districtDics;
                  event.stopPropagation();
                  description.remove();

                  var cancel = function(event) {
                    ngDialog.close();
                  };
                  var namelist = [];
                  if(data.children == undefined) {
                    data.children = []
                  }
                  namelist = getAllName(tree);
                  var inx = 0;
                  var name = "新建域";
                  while(namelist.indexOf(name) != -1) {
                    inx++;
                    name = "新建域_" + inx;
                  }
                  var confirm = function(event) {
                    if(event.input[0].value == '' || event.input[0].value == null) {
                      growl.warning("域名称不能为空", {});
                      return;
                    }
                    if(event.input[1].value == '' || event.input[1].value == null) {
                      growl.warning("所在省不能为空", {});
                      return;
                    }
                    ngDialog.close();
                    var domainID = data.id;
                    var name = event.input[0].value;
                    var des = event.input[event.input.length - 1].value;
                    var standardAddress = areaList[2].value.id ? areaList[2].value.id : (areaList[1].value.id ? areaList[1].value.id : (areaList[0].value.id));
                    var success = function(returnObj) {
                      if(returnObj.code == 0) {
                        var newAdd = returnObj.data;
                        data.children.push(newAdd);
                        userIcon.css("display", "none");
                        btn.css("display", "inline");
                        icon.removeClass().addClass("glyphicon glyphicon-minus");
                        if(children == undefined) {
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
                        if(children.css("max-height") == "0px") {
                          timeout(function() {
                            icon.removeClass().addClass("glyphicon glyphicon-minus");
                            children.animate({
                              "max-height": 400,
                              "opacity": 1
                            }, 300, function() {

                            });
                          });
                        };
                        growl.success("新增管理域成功", {});
                      } else {
                        growl.warning("新增管理域失败", {});
                      }
                    };
                    var error = function(returnObj) {
                      growl.warning("新增管理域失败", {});
                    };
                    getAddressPointFromTools(standardAddress.split(",").join(""), function(address) {
                      userDomainService.addDomain(domainID, {
                        name: name,
                        description: des,
                        values: {
                          standardAddress: standardAddress,
                          longitude: address ? address.location.lng : "",
                          latitude: address ? address.location.lat : ""
                        }
                      }, success);
                    })

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
                    disabled: function() {
                      var every = scope.dialog.input.every(function(elem) {
                        return elem.right == true;
                      });
                      return !every;
                    },
                    fn: function() {
                      var errorStatus = -1;
                      scope.dialog.input.forEach(function(elem) {
                        if(elem.error) {
                          errorStatus = 1;
                          return;
                        }
                      });
                      if(errorStatus == -1) {
                        var self = scope.dialog;
                        confirm(self);
                      }
                    }
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

                  var areaList = [{
                    value: '',
                    label: '所在省',
                    type: 'select',
                    composory: true,
                    placeholder: '',
                    format: {
                      label: 'label'
                    },
                    abled: false,
                    right: false,
                    options: provinces,
                    maxlength: 32,
                    onChange: function(event) {
                      areaList[2].value = "";
                      // areaList[2].right = false;
                      if(event.value == "") {
                        areaList[1].abled = true;
                        event.right = false;
                      } else {
                        if(cityDics[event.value.id]) {
                          areaList[1].options = cityDics[event.value.id];
                        }
                        areaList[1].abled = false;
                        event.right = true;
                      }
                    }
                  }, {
                    value: '',
                    label: '所在市',
                    type: 'select',
                    composory: false,
                    placeholder: '',
                    format: {
                      label: 'label'
                    },
                    abled: true,
                    right: true,
                    options: cityDics,
                    maxlength: 32,
                    onChange: function(event) {
                      areaList[2].value = "";
                      // areaList[2].right = false;
                      if(event.value == "") {
                        areaList[2].abled = true;
                        event.right = false;
                      } else {
                        if(event.value && districtDics[event.value.id]) {
                          areaList[2].options = districtDics[event.value.id];
                        }
                        areaList[2].abled = false;
                        event.right = true;
                      }
                    }
                  }, {
                    value: '',
                    label: '区/县',
                    type: 'select',
                    composory: false,
                    placeholder: '',
                    format: {
                      label: 'label'
                    },
                    abled: true,
                    right: true,
                    options: districtDics,
                    maxlength: 32,
                    onChange: function(event) {
                      if(event.value == "") {
                        event.right = false;
                      } else {
                        event.right = true;
                      }
                    }
                  }];
                  scope.dialog = {
                    title: {
                      label: '管理域信息'
                    },
                    input: [{
                      value: name,
                      label: '域名称 ',
                      type: 'input',
                      composory: true,
                      placeholder: '填写域名称',
                      maxlength: 32,
                      right: true,
                      onChange: function(event) {
                        if(event.value == "") {
                          event.error = "域名称不可为空";
                          event.right = false;
                        } else if(namelist.indexOf(event.value) != -1) {
                          event.error = "此域已被占用";
                          event.right = false;
                        } else {
                          event.error = null;
                          event.right = true;
                        }
                      }
                    }, areaList[0], areaList[1], areaList[2], {
                      maxlength: 200,
                      value: '',
                      label: '域描述 ',
                      type: 'textarea',
                      right: true,
                      placeholder: '填写域描述'
                    }],
                    fnlist: fnlist
                  };
                  ngDialog.open({
                    template: '../partials/dialogue/common_dia.html',
                    className: 'ngdialog-theme-plain',
                    scope: scope
                  });
                };
                var removeClick = function() {
                  event.stopPropagation();
                  description.remove();
                  var domainID = data.id;
                  var domainPath = data.domainPath
                  var domain = {
                    "id": domainID,
                    "domainPath": domainPath
                  };
                  userDomainService.queryDeleteDomain(domain, function(resultObj) {
                    if(resultObj.data != "true") {
                      growl.warning(resultObj.data, {});
                    } else {
                      var confirm = function() {
                        var success = function(event) {
                          if(event.code == 0) {
                            growl.success("删除管理域成功", {});
                            parentData.$remove(function(index, elem) {
                              return elem.id == data.id;
                            });
                            if(parentData.length == 0) {
                              parentRmvBtn.removeAttr("disabled");
                              parentRmvBtn.css("color", "#dd695c");
                            } else {
                              parentRmvBtn.prop("disabled", true);
                              parentRmvBtn.css("color", "#aaa");
                            }
                            ngDialog.close();
                            var animFinished = function() {
                              dom.remove();
                              if(target.children().size() == 0) {
                                target.remove();
                                parentDom.css("font-weight", "normal");
                                parentDom.css("background-color", "#fff");
                                parentRmvBtn.css("display", "block");
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
                        userDomainService.deleteDomain(domainID, domainPath, success)
                      };
                      var cancel = function() {
                        ngDialog.close();
                      };
                      var fnlist = [{
                        label: '确定',
                        icon: 'btn btn-success',
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
                      scope.dialog = {
                        title: {
                          label: '提示'
                        },
                        description: {
                          label: '确认删除域?'
                        },
                        fnlist: fnlist
                      };
                      ngDialog.open({
                        template: '../partials/dialogue/common_dia_prompt.html',
                        className: 'ngdialog-theme-plain',
                        scope: scope
                      });
                    }
                  });
                };
                var editClick = function() {
                  var provinces = rootscope.provinces;
                  var cityDics = rootscope.cityDics;
                  var districtDics = rootscope.districtDics;
                  event.stopPropagation();
                  description.remove();
                  var domainID = data.id;
                  if(data.values.standardAddress) {
                    var arr = data.values.standardAddress.split(",");
                    data.provinceId = arr[0];
                    data.province = provinces.find(function(item) {
                      return arr[0] == item.label;
                    });
                    if(arr[1]) {
                      data.cityId = cityDics[arr[0]].find(function(item) {
                        return arr[1] == item.label;
                      }).id;
                      data.city = cityDics[arr[0]].find(function(item) {
                        return arr[1] == item.label;
                      });
                      if(!arr[2]) {
                        data.county = "";
                      }
                    } else if(!arr[1]) {
                      data.county = "";
                      data.cityId = "";
                    }
                    if(arr[2]) {
                      data.county = districtDics[data.cityId].find(function(item) {
                        return arr[2] == item.label;
                      });
                    }
                  } else {
                    data.province = "";
                    data.city = "";
                    data.county = "";
                  };
                  /**
                  var filter = parentData.filter(function(elem){
                    return elem.domainID != data.domainID;
                  });
                   */
                  var namelist = getAllName(tree);
                  namelist.$remove(function(index, elem) {
                    return elem == data.name;
                  });
                  var cancel = function(event) {
                    ngDialog.close();
                  };
                  var confirm = function(event) {
                    if(event.input[0].value == '' || event.input[0].value == null) {
                      growl.warning("域名称不能为空", {});
                      return;
                    }
                    if(event.input[1].value == '' || event.input[1].value == null) {
                      growl.warning("所在省不能为空", {});
                      return;
                    }
                    var standardAddress;
                    var name = event.input[0].value;
                    var des = event.input[event.input.length - 1].value;
                    if(areaList[2].value) {
                      standardAddress = areaList[2].value.id;
                      // standardAddress = areaList[2].value.id ? areaList[2].value.id : (areaList[1].value.id ? areaList[1].value.id : (areaList[0].value.id));
                    } else if(areaList[1].value) {
                      standardAddress = areaList[1].value.id;
                    } else {
                      standardAddress = areaList[0].value.id;
                    }
                    getAddressPointFromTools(standardAddress.split(",").join(""), function(address) {
                      userDomainService.modifyDomain([{
                        id: domainID,
                        name: name,
                        description: des,
                        values: {
                          standardAddress: standardAddress,
                          longitude: address ? address.location.lng : "",
                          latitude: address ? address.location.lat : ""
                        }
                      }], function(returnObj) {
                        if(returnObj.code == 0) {
                          if(returnObj.data) {
                            if(returnObj.data.description) {
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
                            text.text(returnObj.data.name + (returnObj.data.modelId == 301 ? "[" + label301 + "域]" : (returnObj.data.modelId == 302 ? "[" + label302 + "域]" : "")));
                            des_text.text(returnObj.data.description);
                            data.name = returnObj.data.name;
                            data.label = returnObj.data.label;
                            data.values.standardAddress = returnObj.data.values.standardAddress;
                            data.description = returnObj.data.description;
                          }
                          growl.success("修改管理域成功", {});
                        } else {
                          growl.warning("修改管理域失败", {});
                          return;
                        }
                      });
                    })

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
                    disabled: function() {
                      var every = scope.dialog.input.every(function(elem) {
                        return elem.right == true;
                      });
                      return !every;
                    },
                    fn: function() {
                      var errorStatus = -1;
                      scope.dialog.input.forEach(function(elem) {
                        if(elem.error) {
                          errorStatus = 1;
                          return;
                        }
                      });
                      if(errorStatus == -1) {
                        var self = scope.dialog;
                        confirm(self);
                      }
                    }
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

                  var areaList = [{
                    value: data.province,
                    label: '所在省',
                    type: 'select',
                    composory: true,
                    placeholder: '',
                    format: {
                      label: 'label'
                    },
                    abled: false,
                    options: provinces,
                    maxlength: 32,
                    right: data.province ? true : false,
                    onChange: function(event) {
                      areaList[2].value = "";
                      areaList[2].options = [];
                      // areaList[2].right = false;
                      if(event.value == "") {
                        areaList[1].abled = true;
                        event.right = false;
                      } else {
                        if(cityDics[event.value.id]) {
                          areaList[1].options = cityDics[event.value.id];
                        }
                        areaList[1].abled = false;
                        event.right = true;
                      }
                    }
                  }, {
                    value: data.city,
                    label: '所在市',
                    type: 'select',
                    composory: false,
                    placeholder: '',
                    format: {
                      label: 'label'
                    },
                    abled: data.city ? false : true,
                    right: true,
                    // right: data.city ? true : false,
                    options: cityDics[data.provinceId],
                    maxlength: 32,
                    onChange: function(event) {
                      areaList[2].value = "";
                      // areaList[2].right = false;
                      if(event.value == "") {
                        areaList[2].abled = true;
                        areaList[2].options = [];
                        event.right = false;
                      } else {
                        if(event.value && districtDics[event.value.id]) {
                          areaList[2].options = districtDics[event.value.id];
                        }
                        areaList[2].abled = false;
                        event.right = true;
                      }
                    }
                  }, {
                    value: data.county,
                    label: '区/县',
                    type: 'select',
                    composory: false,
                    placeholder: '',
                    format: {
                      label: 'label'
                    },
                    abled: false,
                    right: true,
                    // right: data.county ? true : false,
                    options: districtDics[data.cityId],
                    maxlength: 32,
                    onChange: function(event) {
                      if(event.value == "") {
                        event.right = false;
                      } else {
                        event.right = true;
                      }
                    }
                  }];
                  scope.dialog = {
                    title: {
                      label: '管理域信息'
                    },
                    input: [{
                      value: data.name,
                      type: 'input',
                      label: '域名称',
                      maxlength: 32,
                      composory: true,
                      right: true,
                      placeholder: '填写域名称',
                      onChange: function(event) {
                        if(event.value == "") {
                          event.error = "域名称不可为空";
                          event.right = false;
                        } else if(namelist.indexOf(event.value) != -1) {
                          event.error = "此域已被占用";
                          event.right = false;
                        } else {
                          event.error = null;
                          event.right = true;
                        }
                      }
                    }, areaList[0], areaList[1], areaList[2], {
                      value: data.description,
                      label: '域描述',
                      type: 'textarea',
                      right: true,
                      maxlength: 200,
                      placeholder: '填写域描述'
                    }],
                    fnlist: fnlist
                  };
                  ngDialog.open({
                    template: '../partials/dialogue/common_dia.html',
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
                      event: data
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
                  .css("width", "80px")
                  .css("color", "#fff");

                var addenter = function() {
                  intro.text("创建子域");
                  addBtn.append(intro);
                };
                var addleave = function() {
                  intro.remove();
                }
                var removeenter = function() {
                  intro.text("删除");
                  removeBtn.append(intro);
                };
                var removeleave = function() {
                  intro.remove();
                }
                var editenter = function() {
                  intro.text("编辑");
                  editBtn.append(intro);
                };
                var editleave = function() {
                  intro.remove();
                }
                removeBtn.on("click", removeClick);
                addBtn.on("click", addClick);
                addBtn.on("mouseenter", addenter);
                addBtn.on("mouseleave", addleave);
                removeBtn.on("mouseenter", removeenter);
                removeBtn.on("mouseleave", removeleave);
                editBtn.on("click", editClick);
                editBtn.on("mouseenter", editenter);
                editBtn.on("mouseleave", editleave);
                //userBtn.on("click", userClick);
                target.append(dom);
                if(type != 'search') {
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
                if(data.hasOwnProperty("children")) {
                  userIcon.css("display", "none");
                  btn.css("display", "block");
                  dom.css("font-weight", "bold");
                  //dom.css("background-color", "#eee");
                  if(data.show = false) {
                    dom.css("max-height", 0);
                  };
                  children = $("<div></div>").css("overflow", "hidden");
                  var hasChild = function(data, target) {
                    var traverse = function(data) {
                      if(data == target) {
                        return true;
                      } else if(data.hasOwnProperty("children")) {
                        for(var i in data.children) {
                          if(traverse(data.children[i])) {
                            return true;
                          }
                        }
                        return false;
                      } else {
                        return false
                      }
                    };
                    return traverse(data);
                  };
                  if(type == 'search') {
                    icon.removeClass().addClass("glyphicon glyphicon-minus");
                  } else if(type == 'highlight') {
                    if(hasChild(data, searchlist) && data != searchlist) {
                      icon.removeClass().addClass("glyphicon glyphicon-minus");
                    } else {
                      children.css("max-height", 0);
                      icon.removeClass().addClass("glyphicon glyphicon-plus");
                    };
                  } else {
                    if(depth > 1) {
                      children.css("max-height", 0);
                      icon.removeClass().addClass("glyphicon glyphicon-plus");
                    }
                  }
                  target.append(children);
                  for(var i in data.children) {
                    traverse(children, data.children[i], depth, btn, removeBtn, dom, userIcon, data.children);
                  }
                  removeBtn.prop("disabled", true);
                  removeBtn.css("color", "#aaa")
                  //removeBtn.css("display", "none");
                  btn.on("click", foldClick);
                } else {
                  userIcon.css("display", "inline");
                  btn.css("display", "none");
                  removeBtn.removeAttr("disabled");
                  removeBtn.css("color", "#dd695c")
                  //removeBtn.css("display", "inline");
                }
                if(!parentData) {
                  // dom.css("background-color", "#eee");
                } else {
                  inner.append(removeBtn).append(editBtn)
                }

                inner.append(addBtn);
                dom.append(inner);
                dom.append(cover);
              };
              if(data instanceof Array) {
                for(var i in data) {
                  traverse($(element), data[i], -1);
                }
              } else {
                traverse($(element), data, -1);
              }
              if(!searchFound) {
                var error = $("<div></div>").text("没有符合条件的记录。").css("line-height", "50px").css("text-align", "center");
                $(element).append(error);
              }
            };
            if(n) {
              rootscope = scope.$root.$$childTail;
              menuitems = rootscope.menuitems; //获得根域下的属性
              label301 = ((menuitems && menuitems["S12"] && menuitems["S12"].label) ? menuitems["S12"].label : "客户")
              label302 = ((menuitems && menuitems['S13'] && menuitems['S13'].label) ? menuitems['S13'].label : "项目")

              scope.$on("SEARCHDATA", function(event, data) {
                render(n, "search", data);
              });
              scope.$on("HIGHLIGHTDATA", function(event, data) {
                render(n, 'highlight', data);
              });
              scope.$on("RENDERDATA", function(event, data) {
                render(n, 'normal', data);
              });
              render(n)
            }
          };
          scope.$watch("ngModel", ngModelWatcher);
        };
        timeout(ready);
      }
    }
  }]);
  directives.initDirective('domainUserTable', ['$timeout', '$compile', 'dialogue', 'userEnterpriseService', function($timeout, $compile, dialogue, userEnterpriseService) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var enterpriseUser;
          var domMain = $element;
          var table;
          var isEditing = false;
          var checkbox;
          $scope.$on(Event.DOMAININFOSINIT, function(event, args) {
            if(table) {
              table.destroy();
            }
            checkbox = $("<input type='checkbox'/>")
            checkbox.on("click", function(event) {
              event.stopPropagation();
              if(checkbox.prop('checked')) {
                if($(domMain).find("tbody tr").hasClass("select") == false) {
                  $(domMain).find("tbody tr").addClass("selected");
                }
                $(domMain).find("tbody input[type*=checkbox]").prop("checked", true);
              } else {
                $(domMain).find("tbody tr").removeClass("selected");
                $(domMain).find("tbody input[type*=checkbox]").removeAttr("checked");
              }
            });
            isEditing = false;
            for(var i in args.data) {
              args.data[i].select = false;
            }
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-12"<"special-btn">>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: $.ProudSmart.datatable.language,
              "autoWidth": false,
              "data": args.data,
              "order": [1, "desc"],
              columns: [{
                title: "",
                data: "select",
                type: ""
              }, {
                title: "用户名称",
                data: "userName"
              }, {
                title: "邮箱",
                data: "emailAddress"
              }, {
                title: "手机",
                data: "mobilePhone"
              }, $.ProudSmart.datatable.optionCol1],
              "initComplete": function(setting) {
                domMain.find('th').eq(0).children().remove();
                domMain.find('th').eq(0).append(checkbox);
              },
              columnDefs: [{
                "targets": 0,
                "width": 14,
                "data": "userName",
                "orderable": false,
                "render": function(data, type, full) {
                  var str = '<input type="checkbox" style="pointer-events: none;"/>';
                  return str
                }
              }, {
                "targets": 1,
                "data": "userName",
                "render": function(data, type, full) {
                  /**
                    var str = '<select id="userDomainName" name="userName" class="combobox form-control input-sm">' +
                      '<option value="">请选择用户</option>';
                    var argData = args.data;
                    var enterpriseData = $scope.enterpriseUser;
                    for (var i = 0; i < enterpriseData.length; i++) {
                      var index = -1;
                      for (var j = 0; j < argData.length; ++j) {
                        if (argData[j].userID == enterpriseData[i].userID) {
                          index = j;
                        }
                      }
                      if (index == -1) {
                        str += '<option value="' + enterpriseData[i].userID + '">' + escape(enterpriseData[i].userName) + '</option>';
                      }
                    }
                    str += '</select>';

                  if (full.isEdit == 2 && type == "display") {
                    return str;
                  } else {
                    return data;
                  }
                  */
                  return data;
                }
              }, {
                "targets": 3,
                "data": 'mobilePhone',
                "render": function(data, type, full) {
                  if(data == null) {
                    return "";
                  } else {
                    return data;
                  }
                }
              }, {
                "targets": 4,
                "data": "option",
                "render": function(data, type, full) {
                  var str = "<div class='btn-group btn-group-sm'>";
                  str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>移出</span></a>";
                  /**
                  if (full.isEdit == 2) {
                    str += "<a id='save-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>"
                    str += "<a id='cancel-btn' class='btn btn-default' ><i class='fa fa-times hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                  } else {
                    if($scope.selectedDomainitem.domainPath != full.domainPath){
                      str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                    }
                  }
                  */
                  str += "</div>";
                  return str;
                }
              }]
            });
          });
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            var queryFormat = [{
              title: "用户名称",
              data: "userName",
              type: "input"
            }, {
              title: "邮箱",
              data: "emailAddress",
              type: "input"
            }, {
              title: "手机",
              data: "mobilePhone",
              type: "input"
            }];
            var addClick = function(event) {
              var run = function(enterpriseUser) {
                var confirm = function(event) {
                  ngDialog.close();
                  var username = event.input[0].value;
                  var email = event.input[1].value;
                  var cellphone = event.input[2].value;
                };
                var cancel = function() {
                  ngDialog.close();
                };
                var fnlist = [{
                  label: '确定',
                  icon: 'btn btn-success',
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
                scope.dialog = {
                  type: "list",
                  title: {
                    label: '添加域用户'
                  },
                  input: [{
                    value: enterpriseUser[0],
                    type: "select",
                    options: enterpriseUser,
                    composory: true,
                    label: '选择用户',
                    onChange: function(event) {
                      console.log(event);
                    }
                  }, {
                    value: 'example@example.com',
                    type: "input",
                    label: '邮箱',
                    placeholder: '填写邮箱'
                  }, {
                    value: '12345678',
                    type: "input",
                    label: '手机',
                    placeholder: '填写手机'
                  }],
                  fnlist: fnlist
                };
              }
              if(enterpriseUser) {
                run(enterpriseUser);
              } else {
                userEnterpriseService.queryEnterpriseUser(function(event) {
                  if(event.code == 0) {
                    enterpriseUser = event.data;
                    run(enterpriseUser);
                  }
                })
              }
            };
            var parentDom = $(".special-btn").parent();
            var createBtn = function(cls, subcls, text) {
              var button = $("<button></button>").addClass(cls);
              var i = $("<i></i>").addClass(subcls);
              var span = $("<span></span>").addClass("hidden-sm").text(text);
              i.append(span);
              button.append(i);
              return button;
            };
            var createQuary = function(queryFormat) {
              var inx = 0;
              var queryDom = $("<div></div>").addClass("combined-query pull-right");
              var btnGroup = $("<div></div>").addClass("btn-group");
              var button = $("<button></button>").addClass("btn btn-default btn-sm dropdown-toggle").css("margin", "2px")
              var text = $("<span></span>").text("查询条件");
              var drop = $("<span></span>").addClass("caret");
              var ul = $("<ul></ul>").addClass("dropdown-menu").css("cursor", "pointer");
              var inputWrap = $("<div></div>").css("display", "inline-block").css("margin", "2px");
              var searchIcon = $("<i></i>").addClass("fa fa-search");
              var searchText = $("<span></span>").text("查询");
              var searchBtn = $("<button></button>").addClass("btn btn-primary btn-sm").css("margin", "2px");
              var createInput = function(dt) {
                if(dt.type == "input") {
                  return $("<input />").addClass("form-control").css("height", "30px").css("padding", "2px");
                }
              };
              searchBtn.append(searchIcon).append(searchText);
              inputWrap.append(createInput(queryFormat[inx]));
              button.append(text).append(drop);
              button.on("click", function(event) {
                if(btnGroup.hasClass("open")) {
                  btnGroup.removeClass("open");
                } else {
                  btnGroup.addClass("open");
                }
              });
              btnGroup.append(button).append(ul);
              queryDom.append(btnGroup).append(inputWrap).append(searchBtn);
              var createLi = function(elem) {
                var li = $("<li></li>");
                var a = $("<a></a>").text(elem.title);
                li.append(a);
                li.on("click", function(event) {
                  text.text(elem.title);
                  btnGroup.removeClass("open");
                });
                return li;
              };
              for(var i in queryFormat) {
                ul.append(createLi(queryFormat[i]))
              };
              return queryDom;
            };
            var addBtn = createBtn("btn btn-primary btn-sm", "fa fa-plus", "添加域用户").css("margin", "2px");
            var deleteBtn = createBtn("btn btn-default btn-sm", "fa fa-plus", "移除").css("margin", "2px");
            var queryPart = createQuary(queryFormat);
            parentDom.append(addBtn).append(deleteBtn).append(queryPart);
            addBtn.on("click", addClick);
            $compile(parentDom)($scope);
          });
          domMain.on('click', 'td', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            if(rowData) {
              if(($(this).context.cellIndex == 4 && rowData.isEdit == 0)) {
                return;
              }
              if(rowData.isEdit == 1) {}
            }
          });
          domMain.on('click', 'tbody tr', function(e) {
            e.preventDefault();
            $(this).toggleClass('selected');
            if($(this).hasClass('selected')) {
              $(this).find("input[type*=checkbox]").prop("checked", true);
            } else {
              $(this).find("input[type*=checkbox]").removeAttr("checked");
            }
            var selected = table.rows('.selected')[0].length;
            var total = table.rows()[0].length;
            if(selected == total) {
              checkbox.prop("checked", true);
            } else {
              checkbox.removeAttr("checked");
            }
          });

          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var checkPass = true;
            var selectRow = table.row('.shown');
            if(checkPass) {
              isEditing = false;
              $scope.doAction('saveUserToDomain', selectRow.data());
            }
          });

          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            isEditing = false;
            var selectRow = table.row('.shown');

            $scope.doAction('cancel');
          });
          domMain.on('click', '#del-btn', function(e) {
            console.log(e);
            e.stopPropagation();
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('removeDomain', row.data());
          });

          domMain.on('click', '#changeDomain-btn', function(e) {
            e.preventDefault();
            isEditing = false;
            if(!isEditing) {
              isEditing = true;
              var tr = $(this).closest('tr');

              var row = table.row(tr);

              row.data().isEdit = 1;
            }
          });

          domMain.on('click', '#removeDomain-btn', function(e) {
            //e.preventDefault();
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var selectRow = table.row('.shown');

            $scope.doAction('removeDomain', row.data());
          })

        }
      ]
    }
  }]);
  directives.initDirective('domainCmdbTable', ['$timeout', '$compile', '$filter', function($timeout, $compile, $filter) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;

          $scope.$on(Event.DOMAINDEVICESINIT, function(event, args) {
            if(table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              columns: [{
                data: "id",
                title: "编码"
              }, {
                data: "label",
                title: "名称"
              }, {
                data: "createTime",
                title: "上线时间"
              }, {
                data: "onlineStatus",
                title: "在线状态"
              }, {
                data: "health",
                title: "健康度",
                visible: false
              }, {
                data: "domainPath",
                title: "管理域"
              }, {
                data: "option",
                orderable: false,
                title: "操作",
                width: "120px"
              }],
              columnDefs: [{
                targets: 2,
                data: "createTime",
                render: function(data, type, full) {
                  // 返回自定义内容
                  var str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                  //                var str = "<date-label value=" + data + " format='yyyy-MM-dd HH:mm:ss'>";
                  return str;
                }
              }, {
                targets: 1,
                data: "label",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  return escape(data);

                }
              }, {
                "targets": 3,
                "data": "onlineStatus",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  return "<span class='label " + (data == 'online' ? "label-primary" : "label-warning") + "'>" + (data == 'online' ? "在线" : "离线") + "</span>";
                }
              }, {
                "targets": 4,
                "data": "health",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  //自定义随机的健康度---等待接口的实现连接
                  data = Math.random() * 100;
                  return "<div class='progress progress-xs progress-striped active'><div class='progress-bar " + (data > 90 ? "progress-bar-success" : (data > 60 ? "progress-bar-yellow" : "progress-bar-red")) + "' style='width:" + data + "%'></div></div>";
                }
              }, {
                "targets": 5,
                "data": "domainPath",
                "render": function(data, type, full) {
                  var str = "";
                  var test = $scope.enterpriseDomain;
                  var selectDomain1 = "";
                  var selectPath = "";
                  // var selectDomain = $scope.domainListDic[data].name;
                  for(var i in $scope.enterpriseDomain) {
                    if($scope.enterpriseDomain[i].domainPath == data) {
                      selectDomain1 = $scope.enterpriseDomain[i].name;
                      selectPath = $scope.enterpriseDomain[i].domainPath;
                    }
                  }
                  if(full.isEdit == 2 && type == "display") {
                    $scope.deviceIdTree(full.id);
                    if(data != null && data != "") {
                      for(var i in $scope.domainsAry) {
                        if($scope.domainsAry[i].domainPath == data) {
                          str += "<input name='domainPath' domain-Picker class='form-control input-sm' type='text' value='" + selectDomain1 + "' domainPath='" + selectPath + "'>";
                        }
                      }
                    }
                    if(!str) {
                      str += "<input name='domainPath'  domain-Picker class='form-control input-sm' type='text' domainPath='' value='请选择...'>"
                    }
                  } else {

                    str += selectDomain1;
                  }

                  return str;
                }
              }, {
                "targets": 6,
                "data": "option",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group btn-group-sm'>";
                  if(full.isEdit == 2) {
                    str += "<a id='save-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>"
                    str += "<a id='cancel-btn' class='btn btn-default' ><i class='fa fa-times hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                  } else {
                    str += "<a id='edit-btn' class='btn btn-default' ><i class='fa fa-refresh hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 切换域</span></a>"
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

          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();

            var domainSelect = $(tr).find('input[name="domainPath"]').attr("domainPath");
            var domainSelectName = $(tr).find('input[name="domainPath"]').val();

            rowData['domainPath'] = domainSelect;
            rowData['domainName'] = domainSelectName;

            var checkPass = true;
            if(checkPass) {
              $scope.doAction('saveChangedDomain', rowData, function(flg) {
                if(flg) {
                  isEditing = false;
                  rowData.isEdit = 0;
                  row.remove().draw();
                }
              });
            }
          });
          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            if(!isEditing) {
              isEditing = true;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 2;
              row.cells().invalidate();
              $compile(tr)($scope);
            } else {
              $scope.doAction("thresholdMessage", "当前有修改中的属性，请先完成该操作");
            }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            if(isEditing) {
              isEditing = false;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 0;
              row.cells().invalidate();
            }
          });
        }
      ]
    }
  }]);
});