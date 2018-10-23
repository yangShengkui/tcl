define(['directives/directives'], function (directives) {
  'use strict';
  directives.registerDirective && directives.registerDirective("datTableDom", dataTableDir) || directives.directive('datTableDom', dataTableDir);
  dataTableDir.$inject = ['$q', '$timeout', '$location'];

  function dataTableDir (q, timeout, $location) {
    return {
      restrict: 'E',
      scope: {
        source: "="
      },
      replace: true,
      templateUrl: '../partials/data-table-adv.html',
      link: function (scope, element, attr) {
        var toString = Object.prototype.toString,
          isArray = isType("Array"),
          isObject = isType("Object"),
          isFunction = isType("Function"),
          isNumber = isType("Number"),
          isUndefined = isType("Undefined"),
          _position = ["label", "type", "bind", "search", "filter"],
          _btnPosition = ["label", "on.click"],
          _size = [5, 10, 15, 20, 25, 50, 100];
        var _objectType = "[object "

        function extend (a, b) {
          for (var i in b) {
            a[i] = b[i];
          }
        }

        function isType (type) {
          return function (target) {
            return toString.call(target) == _objectType + type + "]";
          }
        }

        function getTextFromType (type, header) {
          if (isArray(header)) {
            var inx = _position.indexOf(type)
            return header[inx];
          } else if (isObject(header)) {
            return header[type];
          } else if (isFunction(header)) {
            return header[type];
          } else {
            return null
          }
        }

        function getAttrs (obj, attrs) {
          var arr = attrs.split(".");
          var target = obj;
          for (var i in arr) {
            target = target[arr[i]]
            if (!target) {
              break;
            }
          }
          return target
        }

        function getButtonFromType (type, header) {
          if (isArray(header)) {
            var inx = _btnPosition.indexOf(type)
            return header[inx];
          } else if (isObject(header)) {
            return getAttrs(header, type);
          } else {
            return null
          }
        }

        function getButtonFunction (op) {
          var fn = getButtonFromType("on.click", op);
          return fn;
        }

        function windClick () {
          $("body").off("click.windClick");
          scope.$apply(function () {
            scope.open = false;
            scope.searchTypeClick = searchTypeClickFn;
          });
        }

        function searchTypeClickFn () {
          scope.searchTypeClick = undefined;
          scope.open = true;
          timeout(function () {
            $("body").on("click.windClick", windClick)
          });
        };

        function dataTable (data) {
          dataTable.init = function (data) {
            extend(this, data);
          }
          extend(dataTable.init.prototype, {
            getPageSize: function () {
              return data.pageSize || 10;
            },
            getData: function () {
              return data['data'];
            },
            push: function (obj) {
              this.data.unshift(obj);
            },
            unshift: function (obj) {
              this.data.unshift(obj);
            },
            remove: function (inx) {
              this.data.splice(inx, 1);
            },
            get: function (inx) {
              return this.data[inx];
            },
            select: function (inx) {
              this.data[inx].selected = true;
            },
            selectAll: function () {
              for (var i in scope.currentPageData) {
                scope.currentPageData[i].selected = true;
              }
              scope.allcheck = true;
            },
            deselectAll: function () {
              for (var i in scope.currentPageData) {
                scope.currentPageData[i].selected = false;
              }
              scope.allcheck = false;
            },
            hasButtons: function () {
              return isArray(this.bodyButtons) && this.bodyButtons.length > 0;
            }
          })
          return new dataTable.init(data);
        }

        function currentPageDataChanges () {
          timeout(function () {
            var n = scope.currentPageData;
            if (isArray(n) && n.length > 0) {
              scope.allcheck = n.every(function (elem) {
                return elem.selected == true;
              });
            }
          });
        }

        function pages (length, s) {
          pages.init = function (length, s) {
            this.current = 0
            this.length = length;
            this.total = Math.ceil(length / s);
            this.size = s;
          }
          extend(pages.init.prototype, {
            setSize: function (s) {
              this.size = s;
              this.total = Math.ceil(this.length / s);
              this.current = 0;
              currentPageDataChanges();
            },
            setLength: function (l) {
              this.length = l;
              this.total = Math.ceil(l / this.size);
              this.current = 0;
              currentPageDataChanges();
            },
            getTotal: function () {
              return this.total;
            },
            getCurrent: function () {
              return this.current;
            },
            isFirst: function () {
              return this.current == 0;
            },
            isLast: function () {
              return this.current == this.total.length - 1;
            },
            nextPage: function () {
              this.current < this.total && this.current++;
              currentPageDataChanges();
            },
            prevPage: function () {
              this.current > 0 && this.current--;
              currentPageDataChanges();
            },
            moveTo: function (inx) {
              this.current = inx;
              currentPageDataChanges();
            },
            getSize: function () {
              return this.size;
            },
            getStartPoint: function () {
              return this.current * this.size;
            }
          })
          return new pages.init(length, s);
        }

        function getSearchFields (body) {
          var rs = [];
          for (var i in body) {
            if (body[i].search !== false) {
              rs.push(i)
            }
          }
          return rs;
        }

        function headerToObj (header) {
          if (typeof header === "string") {
            return {
              label: header,
              type: "text"
            }
          } else if (isArray(header)) {
            var obj = {};
            for (var i in header) {
              obj[_position[i]] = header[i]
            }
            return obj;
          } else if (isObject(header)) {
            return header;
          }
        }

        scope.filterResult;
        scope.searchBy = {
          searchFields: []
        };
        scope.sortBy = {};
        scope.buttonClass = function (format) {
          var cls = format.class;
          return cls ? "btn-" + cls : "btn-default";
        }
        scope.pageDescription = function () {
          var from = scope.page.current * scope.page.size + 1;
          var to = (scope.page.current + 1) * scope.page.size;
          to = to < scope.page.length && to || scope.page.length;
          var total = scope.page.length;
          return '第 ' + from + ' 至 ' + to + ' 项，共 ' + total + ' 项'
        }
        scope.isPrevBtnDisabled = function () {
          return scope.page.isFirst() ? "disabled" : "";
        }
        scope.isNextBtnDisabled = function () {
          return scope.page.isLast() ? "disabled" : "";
        }
        scope.sizes = _size;
        scope.getSize = function () {
          return scope.page && scope.page.size || 10;
        }
        scope.getStartPoint = function () {
          return scope.page ? scope.page.getStartPoint() : 0;
        }
        scope.getData = function (row, header, key) {
          var dt = getTextFromType("bind", header) || row[key];
          return typeof dt === "function" ? dt(row) : dt;
        }
        scope.checkButtonShow = function (op, row) {
          var fn = getButtonFromType("show", op);
          if (isFunction(fn)) {
            return fn(row);
          } else {
            return fn !== false;
          }
        }
        scope.getType = function (header) {
          return getTextFromType("type", header) || "text";
        }
        scope.getlabel = function (header) {
          return getTextFromType("label", header) || header
        }
        scope.sizeChange = function (size) {
          scope.page.setSize(size);
        };
        scope.hasPages = function () {
          return scope.page && scope.page.getTotal() > 0 || false;
        }
        scope.ifBeforeMarkShow = function () {
          var current = scope.page.current;
          var total = scope.page.total;
          return current > 2 && total > 3;
        }
        scope.middleRange = function () {
          var arr = [];
          var current = scope.page.current;
          var total = scope.page.total;
          current > 1 && arr.push(current - 1);
          current > 0 && current < total - 1 && arr.push(current);
          current < total - 2 && arr.push(current + 1);
          return arr;
        }
        scope.ifAfterMarkShow = function () {
          var current = scope.page.current;
          var total = scope.page.total;
          return current < total - 3 && total > 3;
        }
        scope.open = false;
        scope.renderClass = function (target, row) {
          var type = typeof target;
          if (type == 'function') {
            return target(row);
          } else if (type == 'string') {
            return target;
          } else {
            return 'btn btn-default';
          }
        };
        scope.colClick = function (event, col, row, i) {
          event.stopPropagation();
          isObject(col) && isObject(col.on) && isFunction(col.on.click) && col.on.click(row, i);
        };
        scope.sorting = function (sortBy, head, key) {
          var cls = "";
          if (head.sortable !== false) {
            cls += "sorting"
          }
          if (sortBy.value == key) {
            if (sortBy.asc) {
              cls += "_desc";
            } else {
              cls += "_asc";
            }
          }
          return cls;
        };
        scope.getButtonLabel = function (op) {
          return getButtonFromType("label", op)
        };
        scope.getButtonIcon = function (op) {
          return op.iconClass || 'fa-edit';
        };
        scope.buttonClick = function (op, row) {
          var fn = getButtonFunction(op);
          if (typeof fn === "function") {
            var inx = scope.dataTable.data.indexOf(row)
            fn.call(scope.dataTable, row, inx);
          } else if (typeof fn === "string") {
            $location.path(fn);
          }
        }
        scope.moreclick = function (row) {
          scope.open = false;
          var cache = row.open ? true : false;
          for (var i in scope.dataTable.data) {
            scope.dataTable.data[i].open = false;
          }
          row.open = !cache;
        };
        scope.trClass = function (row, customClass) {
          var cls = [];
          if (row.selected) {
            cls.push("selected");
          }
          ;
          if (typeof customClass == 'function') {
            var fn = customClass(row);
            if (fn) {
              cls.push(fn);
            }
          }
          ;
          var result = cls.toString().replace(",", " ")
          return result;
        };
        scope.searchTypeClick = searchTypeClickFn;
        scope.conditionClick = function (header, key) {
          delete scope.querytype;
          delete scope.key;
          delete scope.keyinput;
          /** add a timespan for renew the menu*/
          timeout(function () {
            scope.key = key;
            scope.querytype = headerToObj(header);
          });
        };
        scope.goSearch = function () {
          extend(scope.searchBy, {
            key: scope.key,
            keyinput: scope.keyinput
          });
        };
        scope.allClick = function () {
          scope.allcheck = scope.allcheck ? false : true;
          for (var i in scope.currentPageData) {
            if (scope.key) {
              if (scope.currentPageData[i].queryStatus == '1') {
                scope.currentPageData[i].selected = scope.allcheck;
              }
            } else {
              scope.currentPageData[i].selected = scope.allcheck;
            }
          }
          ;
        };
        scope.pageChange = function (value) {
          if (scope.wholeDisabled != true) {
            if (value != undefined) {
              scope.page = value;
            }
            if (scope.source.source.length > 0) {
              scope.from = scope.page * scope.size + 1;
            } else {
              scope.from = 0;
            }
            if (scope.page < scope.totalpage - 1) {
              scope.to = (scope.page + 1) * scope.size;
            } else {
              scope.to = scope.total;
            }
          }
        };
        scope.sortClick = function (head, key) {
          var sortable = head.sortable === false && false || true;
          if (sortable) {
            if (scope.sortBy.value != key) {
              scope.sortBy.value = key;
              scope.sortBy.asc = true;
            } else {
              scope.sortBy.asc = !scope.sortBy.asc;
            }
          }
        };
        scope.getFullLength = function () {
          var showIndex = scope.source && scope.source.showIndex;
          var showSelector = scope.source && scope.source.showSelector;
          var bodyLength = scope.source && Object.keys(scope.source.body).length;
          var bodyButtons = scope.source && scope.source.bodyButtons;
          return bodyLength + (showIndex ? 1 : 0) + (showSelector ? 1 : 0) + (bodyButtons ? 1 : 0);
        };
        scope.trClick = function (event, row, col, i) {
          //isObject(col) && isObject(col.on) && isFunction(col.on.click) && col.on.click(row, i);

          isObject(col) && isObject(col.on) && isFunction(col.on.click) && col.on.click(row, i, event);

          if (!event.isPropagationStopped()) {
            if (!row.disabled && !scope.wholeDisabled) {
              if (scope.source.couldSelect) {
                if (scope.source.singleSelect) {
                  scope.currentPageData.map(function (elem) {
                    elem.selected = false;
                  });
                  row.selected = true;
                } else {
                  row.selected = row.selected ? false : true;
                  scope.allcheck = scope.currentPageData.every(function (elem) {
                    return elem.selected == true;
                  });
                }
              }
            }
          }
        };
        var source3Watch, source4Watch;
        var sourceWatch = scope.$watch("source", function (n, o, s) {
          if (n) {
            scope.dataTable = dataTable(n);
            scope.searchBy.searchFields = getSearchFields(scope.dataTable.body);
            scope.sortBy = scope.source.sortBy || {};
            source4Watch = scope.$watch("source.data", function (n, o, s) {
              if (!isUndefined(n)) {
                scope.dataTable.data = n;
              }
            });
            source3Watch = scope.$watch("filterResult.length", function (n, o, s) {
              if (isNumber(n)) {
                var size = scope.dataTable.getPageSize();
                var total = Math.ceil(n, size);
                scope.page = pages(total, size);
              }
            });
          }
        });
        scope.$on('$destroy', function () {
          sourceWatch && sourceWatch();
          $("body").off("click.drop");
          source2Watch && source2Watch();
          source3Watch && source3Watch();
          source4Watch && source4Watch();
        });
      }
    };
  };
  directives.filter("filtersort", function () {
    return function (input, header, sortBy, searchBy, searchFunction) {
      var searchArea = searchBy.key,
        searchKey = searchBy.keyinput,
        searchFields = searchBy.searchFields,
        searchFunction = searchFunction || function () {
        };
      if (typeof sortBy === "object") {
        var key = sortBy.value, asc = sortBy.asc;
        sortBy = function (a, b) {
          return asc ? a[key] > b[key] : a[key] < b[key]
        };
      }

      function sort (arr, callback) {
        var rs = [];
        for (var i in arr) {
          for (var j = rs.length - 1; j > -1;) {
            if (callback(arr[i], rs[j])) {
              rs[j + 1] = rs[j];
              j--;
            } else {
              break;
            }
          }
          rs[j + 1] = arr[i]
        }
        return rs;
      }

      function Arraysort (input, cb) {
        input.sort(cb);
        return input;
      }

      var rs = Arraysort(input ? [].slice.call(input) : [], sortBy);

      function hasCharacters (val, target) {
        if (typeof val === "number") {
          val = val + "";
        }
        val = typeof val == "string" ? val : "";
        return val.indexOf(target) !== -1
      }

      rs = rs.filter(function (e, i) {
        if (searchFunction(e, i) == false) return false;
        if (!searchKey) return true;
        if (!searchArea) {
          for (var i in searchFields) {
            var sf = searchFields[i];
            if (hasCharacters(e[sf], searchKey))
              return true;
          }
          return false;
        } else {
          return hasCharacters(e[searchArea], searchKey);
        }
      });
      return rs;
    };
  });
});