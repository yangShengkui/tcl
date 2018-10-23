define(['directives/directives'], function(directives) {
  'use strict';
  if($$.isFunction(directives.registerDirective)) {
    directives.registerDirective("tableDom", dataTableDir);
  } else {
    directives.directive('tableDom', dataTableDir);
  }
  dataTableDir.$inject = ['$q', '$timeout'];

  function dataTableDir(q, timeout) {
    return {
      restrict: 'A',
      scope: {
        source: "="
      },
      templateUrl: '../partials/data-table.html',
      link: function(scope, element, attr) {
        scope.open = false;
        scope.sortBy = {};
        scope.renderClass = function(target, row) {
          var type = typeof target;
          if(type == 'function') {
            return target(row);
          } else if(type == 'string') {
            return target;
          } else {
            return 'btn btn-default';
          }
        };
        scope.colClick = function(event, col) {
          if(col.type == "buttonGroup" || col.type == "status") {
            event.stopPropagation();
          }
        };
        scope.sorting = function(sortBy, head) {
          var cls = "";
          if(head.sortable) {
            cls += "sorting"
          }
          if(sortBy.value == head.data) {
            if(sortBy.asc) {
              cls += "_desc";
            } else {
              cls += "_asc";
            }
          }
          return cls;
        };
        /** whole click event*/
        scope.trClass = function(row, customClass) {
          var cls = [];
          if(row.selected) {
            cls.push("selected");
          };
          if(typeof customClass == 'function') {
            var fn = customClass(row);
            if(fn) {
              cls.push(fn);
            }
          };
          var result = cls.toString().replace(",", " ")
          return result;
        };
        var searchTypeClickFn;
        var windClick = function() {
          $("body").off("click.windClick");
          scope.$apply(function() {
            scope.open = false;
            scope.searchTypeClick = searchTypeClickFn;
          });
        }
        searchTypeClickFn = function() {
          scope.searchTypeClick = undefined;
          scope.open = true;
          for(var i in scope.source.source) {
            scope.source.source[i].open = false;
          }
          timeout(function() {
            $("body").on("click.windClick", windClick)
          });
        };
        scope.searchTypeClick = searchTypeClickFn;
        /** remove data*/
        /** whole click event*/
        var totalPageChange = function() {
          if(scope.page > scope.totalpage - 1) {
            scope.page = scope.totalpage - 1;
          }
          if(scope.source.source.length > 0) {
            scope.from = scope.page * scope.size + 1;
          } else {
            scope.from = 0;
          }

          if(scope.page < scope.totalpage - 1) {
            scope.to = (scope.page + 1) * scope.size;
          } else {
            scope.to = scope.total;
          }
          var rs = [];
          for(var i = 1; i <= scope.totalpage; i++) {
            rs.push(i)
          }
          scope.totalpageArr = rs;
        };
        var sourceWatch = scope.$watch("source", function(n, o, s) {
          var dclick = function(event) {
            scope.$apply(function() {
              for(var i in scope.source.source) {
                scope.source.source[i].open = false;
              }
            });
          };
          if(n != undefined) {
            $("body").off("click.drop");
            $("body").on("click.drop", dclick);
            s.pageResize = n.pageResize == false ? true : false;
            if(n.page != false) {
              s.size = 10;
            } else {
              s.size = +Infinity;
            }
            n.setWholeDisabled = function(bool) {
              s.wholeDisabled = bool;
            }
          }
        });
        var source2Watch = scope.$watch("source.source", function(n, o, s) {
          if(n != undefined) {
            scope.totalpage = Math.ceil(n.length / scope.size);
            scope.totalpage = scope.totalpage ? scope.totalpage : 1;
            scope.moreclick = function(row) {
              scope.open = false;
              var cache = row.open ? true : false;
              for(var i in scope.source.source) {
                scope.source.source[i].open = false;
              }
              row.open = !cache;
            };
            var remove = function() {
              var self = this;
              n.$remove(function(index, elem) {
                return elem == self;
              });
              if(n.length == 0) {
                scope.allcheck = false;
              }
            };
            var insertAfter = function(data) {
              var self = this;
              var step = 0;
              var rs = []
              var loop = function(index, val) {
                rs[parseInt(index) + step] = val;
                if(self == val) {
                  step = 1;
                  rs[parseInt(index) + step] = data;
                }
              };
              data.remove = remove;
              data.insertAfter = insertAfter;
              var clone = n;
              /** create a new Array to save result */
              for(var i in clone) {
                loop(i, clone[i])
              }
              /** save it back */
              for(var i in rs) {
                n[i] = rs[i];
              }
            };
            for(var i in n) {
              var loop = function(i, n) {
                n[i].remove = remove;
                n[i].insertAfter = insertAfter;
              }
              loop(i, n);
            };
            n.pushback = function(data) {
              data.remove = remove;
              data.insertAfter = insertAfter;
              n.push(data);
            };
            n.pushbefore = function(data) {
              data.remove = remove;
              data.insertAfter = insertAfter;
              n.unshift(data);
            };
            n.removeAllChecked = function() {
              for(var i in n) {
                n[i].selected = false;
              }
              scope.allcheck = false;
            }
            Object.defineProperty(n, "pushback", {
              enumerable: false
            });
            Object.defineProperty(n, "pushbefore", {
              enumerable: false
            });
            Object.defineProperty(n, "removeAllChecked", {
              enumerable: false
            });
            totalPageChange();
            scope.total = n.length;
            scope.pageChange();
          }
        });
        
        var source3Watch = scope.$watch("source.source.length", function(n, o, s) {
          if(n != undefined) {
            scope.key = scope.keyinput;
            scope.total = scope.source.source.filter(function(elem) {
              if(scope.querytype == undefined || scope.querytype == "" || scope.key == undefined || scope.key == "") {
                return true;
              } else {
                return elem[scope.querytype.data].indexOf(scope.key) != -1;
              };
            }).length;
            scope.totalpage = Math.ceil(scope.total / scope.size);
            scope.totalpage = scope.totalpage ? scope.totalpage : 1;
            totalPageChange();
          }
        });
        
        scope.page = 0;
        scope.pagebefore = 0;
        scope.conditionClick = function(querytype) {
          delete scope.querytype;
          delete scope.key;
          delete scope.keyinput;
          /** add a timespan for renew the menu*/
          timeout(function() {
            scope.querytype = querytype;
          });
        };
        
        scope.goSearch = function() {
          if(scope.keyinput == undefined) {
            scope.key = "";
          } else {
            scope.key = scope.keyinput;
          };
          
          scope.total = scope.source.source.filter(function(elem) {
            elem.selected = false;
            elem["queryStatus"] = "0";
            if(scope.key === undefined || scope.key === "") {
              var some = scope.source.columnDefs.some(function(el) {
                if(el.filterable) {
                  if(scope.key && typeof(elem[el.data]) != 'object' && elem[el.data]) {
                    if(String(elem[el.data]).indexOf(scope.key) != -1) {
                      elem.queryStatus = "1";
                    }
                    return String(elem[el.data]).indexOf(scope.key) != -1
                  } else if(elem[el.data]) {
                    if(elem[el.data].indexOf(scope.key) != -1) {
                      elem.queryStatus = "1";
                    }
                    return elem[el.data].indexOf(scope.key) != -1
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              });
              return some;
            } else {
              //如果查询条件没有的情况默认第一个，并且修改label值
              if(scope.querytype === undefined || scope.querytype === "") {
                scope.querytype = jQuery.extend(true, {}, scope.source.columnDefs[0]);
                scope.querytype.label = "查询条件";
              }
              var val = elem[scope.querytype.data];
              if(typeof val == 'string' || typeof val == "number") {
                if(typeof val == 'string') {
                  if (elem[scope.querytype.data].indexOf(scope.key) != -1) {
                    elem.queryStatus = "1";
                  }
                  return elem[scope.querytype.data].indexOf(scope.key) != -1;
                } else if(typeof val == "number") {
                  if (elem[scope.querytype.data] == scope.key) {
                    elem.queryStatus = "1";
                  }
                  return elem[scope.querytype.data] == scope.key;
                } else {
                  return false;
                };
              } else if(Object.prototype.toString.call(val) === '[object Array]' && typeof scope.key == 'object') { //判断已分配角色的low办法
                var some = val.some(function(item) {
                  return item.roleID === scope.key.roleID;
                });
                if(some) {
                  elem.queryStatus = "1";
                  return true;
                } else {
                  return false;
                }
              }

            };
          }).length;
          scope.totalpage = Math.ceil(scope.total / scope.size);
          scope.totalpage = scope.totalpage ? scope.totalpage : 1;
          totalPageChange();
        };
        scope.allClick = function() {
          for(var i in scope.source.source) {
            if(scope.key) {
              if(scope.source.source[i].queryStatus == '1') {
                scope.source.source[i].selected = scope.allcheck;
              }
            } else {
              scope.source.source[i].selected = scope.allcheck;
            }
          };
        };
        scope.sizeChange = function() {
          scope.totalpage = Math.ceil(scope.total / scope.size);
          scope.totalpage = scope.totalpage ? scope.totalpage : 1;
          totalPageChange();
        };
        scope.pageChange = function(value) {
          if(scope.wholeDisabled != true) {
            if(value != undefined) {
              scope.page = value;
            }
            if(scope.source.source.length > 0) {
              scope.from = scope.page * scope.size + 1;
            } else {
              scope.from = 0;
            }
            if(scope.page < scope.totalpage - 1) {
              scope.to = (scope.page + 1) * scope.size;
            } else {
              scope.to = scope.total;
            }
          }
        };
        scope.sortClick = function(head) {
          var sortable = head.sortable;
          if(sortable) {
            var sortKey = head.data;
            if(scope.sortBy.value != sortKey) {
              scope.sortBy.value = sortKey;
              scope.sortBy.asc = true;
            } else {
              scope.sortBy.asc = !scope.sortBy.asc;
            }
          }
        };
        scope.trClick = function(row) {
          if(row.disabled != true) {
            if(scope.source.showSelector != false) {
              if(scope.wholeDisabled != true) {
                if(row.selected) {
                  row.selected = false;
                } else {
                  row.selected = true;
                }
                var every = scope.source.source.every(function(elem) {
                  return elem.selected == true;
                });
                if(every) {
                  scope.allcheck = true;
                } else {
                  scope.allcheck = false;
                }
              }
            }
          }
        };
        scope.$on('$destroy', function() {
          sourceWatch();
          $("body").off("click.drop");
          source2Watch();
          source3Watch();
        });
      }
    };
  };

  if($$.isFunction(directives.registerDirective)) {
    directives.registerDirective("tableSpan", tableSpanDir);
  } else {
    directives.directive('tableSpan', tableSpanDir);
  }
  tableSpanDir.$inject = ['$q', '$timeout'];

  function tableSpanDir(q, timeout) {
    return {
      restrict: 'A',
      scope: {
        ngModel: "=",
        columnDef: "="
      },
      link: function(scope, element, attr) {
        var ngModelWatcher = function() {

        };
        var columnDefTypeWatcher = function(n, o, s) {
          $(element).children().remove();
          if(n == 'edit') {
            var input = $("<input />");
            input.val(s.ngModel);
            $(element).append(input);
          } else {
            var span = $("<span></span>").text(s.ngModel);
            $(element).append(span);
          }
        };
        var columnDefWatcher = function(n, o, s) {
          if(n != undefined) {
            if(n.isEdit == undefined) {
              n.isEdit = "default"
            }
            scope.$watch("columnDef.isEdit", columnDefTypeWatcher);
          }
        };
        scope.$watch("ngModel", ngModelWatcher);
        scope.$watch("columnDef", columnDefWatcher);

      }
    };
  };

  directives.initDirective("multiSelect", ["$q", "$timeout", function(q, timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      id: "=",
      mark: "=",
      options: "=",
      submit: "&"
    };
    directive.link = function(scope, element, attr) {
      var select = $("<select class='multiselect' multiple='multiple'></select>");
      var btnGroup = $("<div></div>").addClass("btn-group");
      var btn = $("<button></button>").addClass("btn btn-primary");
      var span = $("<span></span>").text("添加");
      var icon = $("<span></span>").addClass("glyphicon glyphicon-plus");
      var selectItem = [];
      btn.append(icon).append(span);
      btnGroup.append(select).append(btn);
      if(scope.ngModel == undefined) {
        scope.ngModel = [];
      }
      timeout(function() {
        $$.loadExternalJs(["bootstrap-multiselect"], function(multiselect) {
          timeout(ready);

          function ready() {
            $(element).append(btnGroup);
            scope.$watch("options", function(n, o, s) {
              function findModel(elem, callback) {
                var find = scope.options.find(function(element) {
                  return elem.id == element.id;
                });
                if(find) {
                  callback(elem.id)
                }
              }
              if(n) {
                selectItem = [];
                n.removeData = function(data) {
                  var rs = [];
                  for(var i in scope.options) {
                    if(data.indexOf(scope.options[i]) == -1) {
                      rs.push(scope.options[i]);
                    }
                  }
                  console.log(rs);
                  scope.options = rs;
                };
                n.appendData = function(data) {
                  var rs = scope.options.$clone();
                  Array.prototype.push.apply(rs, data);
                  console.log(rs);
                  scope.options = rs;
                };
                Object.defineProperty(n, "removeData", {
                  enumerable: false
                });
                Object.defineProperty(n, "appendData", {
                  enumerable: false
                });
                btn.attr("disabled", "disabled");
                select.children().remove();
                var renderOption = function(option) {
                  return $("<option value='" + option[scope.id] + "'>" + option[scope.mark] + "</option>")
                }
                if(scope.options.length == 0) {
                  select.multiselect('rebuild');
                  select.multiselect('disable');
                } else {
                  for(var i in scope.options) {
                    select.append(renderOption(scope.options[i]))
                  }
                  select.multiselect('rebuild');
                  for(var i in scope.ngModel) {
                    findModel(scope.ngModel[i], function(id) {
                      select.multiselect("select", id);
                    });
                  }
                }
              }
            });
            var buttonText = function(options) {
              if(options.length == 0) {
                return '没有选择';
              } else if(options.length > 3) {
                return "已选择" + options.length + "个";
              } else {
                var selected = '';
                options.each(function() {
                  selected += $(this).text() + ', ';
                });
                return selected.substr(0, selected.length - 2);
              }
            }
            var onChange = function(element, checked) {
              scope.$apply(function() {
                var id = $(element).val();
                if(checked) {
                  var find = scope.options.find(function(ele) {
                    return ele[scope.id] == id;
                  });
                  selectItem.push(find);
                } else {
                  selectItem.$remove(function(index, elem) {
                    return elem[scope.id] == id;
                  });
                }
                if(selectItem.length > 0) {
                  btn.removeAttr("disabled");
                } else {
                  btn.prop("disabled", "disabled");
                }
              });
            };
            btn.on("click", function(event) {
              scope.$apply(function() {
                scope.submit({
                  data: selectItem
                });
              })
            })
            select.multiselect({
              enableFiltering: true,
              buttonText: buttonText,
              onChange: onChange
            });
          }
        });
      });
    };
    return directive;
  }]);
});