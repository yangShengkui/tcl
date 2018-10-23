define(['directives/directives'], function (directives) {
  'use strict';
  directives.initDirective('renderHtml', ["$timeout", "$compile", "$filter", function ($timeout, $compile, $filter) {
    return {
      restrict: 'A',
      scope: {
        renderHtml: '='
      },
      link: function (scope, element, attr) {
        scope.$watch("renderHtml", function (n, o, s) {
          if (n) {
            $(element).html(n);
          }
        });
      }
    }
  }]);
  directives.initDirective('advanceTab', ["$timeout", "$compile", "$filter", function ($timeout, $compile, $filter) {
    return {
      restrict: 'E',
      templateUrl: '../partials/advance_tab.html',
      replace: true,
      scope: {
        toolbars: '='
      },
      link: function (scope, element, attr) {
        // add
        scope.tabLabelLists = [
          {
            id: "0",
            name: "工作台"
          }
        ];
        scope.toolbarHandler = function (id, name) {
          scope.isShowContent = id;
          var item = {
            id: id,
            name: name
          };
          var flag = true;
          scope.tabLabelLists.forEach(function (ele, index) {
            if (ele.id == id) {
              // alert(ele.name + "已经存在");
              flag = false;
            }
          });
          if (flag) {
            scope.tabLabelLists.push(item);
          }
        };
        // delete
        scope.deleteItemTab = function ($index, name) {
          scope.tabLabelLists.splice($index, 1);
          scope.isShowContent = scope.tabLabelLists[$index - 1].id
        };
        //select
        scope.isShowContent = 0;
        scope.selecItemTab = function (id, index) {
          scope.isShowContent = id;
        }
      }
    }
  }]);
  directives.initDirective('treeMenu', ["$timeout", "$compile", "$filter", function ($timeout, $compile, $filter) {
    return {
      restrict: 'AE',
      template: ' <div class="tree-menu">\n' +
        '                    <ul>\n' +
        '                        <li ng-repeat="firstMenu in resetTreeData">\n' +
        '                            <a href="" ng-class="{false:\'inactive\'}[firstMenu.children.length == 0]"\n' +
        '                               ng-bind="firstMenu.name">\n' +
        '                            </a>\n' +
        '                            <ul style="display: none">\n' +
        '                                <li ng-repeat="secondMenu  in firstMenu.children">\n' +
        '                                    <a href="" ng-class="{false:\'inactive\',true:\'\'}[secondMenu.children.length == 0]"\n' +
        '                                       ng-bind="secondMenu.name">\n' +
        '                                    </a>\n' +
        '                                    <ul>\n' +
        '                                        <li ng-repeat="thirdMenu  in secondMenu.children">\n' +
        '                                            <a href="" ng-class="{false:\'inactive\',true:\'\'}[secondMenu.children.length == 0]" ng-bind="thirdMenu.name"></a>\n' +
        '                                            <ul>\n' +
        '                                                <li ng-repeat="fourthMenu  in thirdMenu.children">\n' +
        '                                                    <a href="" ng-class="{false:\'\',true:\'\'}[fourthMenu.children.length == 0]" ng-bind="fourthMenu.name"></a>\n' +
        '                                                </li>\n' +
        '                                            </ul>\n' +
        '                                        </li>\n' +
        '                                    </ul>\n' +
        '                                </li>\n' +
        '                            </ul>\n' +
        '                        </li>\n' +
        '                    </ul>\n' +
        '                </div>',
      link: function (scope, element, attr) {

        var getTreeData = [
          {
            id: 0,
            name: "all"
          },
          {
            parentID: 0,
            id: 1,
            name: '韶关松山基地'
          },
          {
            parentID: 0,
            id: 2,
            name: '上海宝山基地'
          },
          {
            parentID: 0,
            id: 3,
            name: '湛江东山基地'
          },
          {
            parentID: 0,
            id: 4,
            name: '南京梅山基地'
          },
          {
            parentID: 2,
            id: 2001,
            name: '2250产线'
          },
          {
            parentID: 2,
            id: 2002,
            name: '1580产线'
          },
          {
            parentID: 2001,
            id: 3001,
            name: '风机电机'
          },
          {
            parentID: 2001,
            id: 3002,
            name: '风机叶轮'
          },
          {
            parentID: 2001,
            id: 3003,
            name: '主转动电机'
          },
          {
            parentID: 2001,
            id: 3004,
            name: '助燃风机'
          },
          {
            parentID: 3001,
            id: 4001,
            name: '冲击有效值'
          },
          {
            parentID: 3001,
            id: 4002,
            name: '冲击峰值'
          },
          {
            parentID: 3001,
            id: 4003,
            name: '速度有效值'
          },
          {
            parentID: 3001,
            id: 4004,
            name: '速度峰值'
          },
          {
            parentID: 3002,
            id: 4001,
            name: '冲击有效值'
          },
          {
            parentID: 3002,
            id: 4002,
            name: '冲击峰值'
          },
          {
            parentID: 3002,
            id: 4003,
            name: '速度有效值'
          },
          {
            parentID: 3002,
            id: 4004,
            name: '速度峰值'
          }
        ];
        // 转成数结构
        function resetTreeData(e) {
          var rs;
          e.push({ id: 0 });
          for (var i in e) {
            if (e[i].parentID != undefined) {
              var pid = e[i].parentID;
              var parent = e.find(function (elem) {
                return elem.id == pid;
              });
              if (parent.children == undefined) {
                parent.children = [];
              }
              e[i].parent = parent;
              parent.children.push(e[i]);
            } else {
              rs = e[i];
            }
          }
          return rs;
        }
        scope.resetTreeData = resetTreeData(getTreeData).children;
        setTimeout(function () {
          $('.inactive').click(function () {
            if ($(this).siblings('ul').css('display') == 'none') {
              $(this).parent('li').siblings('li').removeClass('inactives');
              $(this).addClass('inactives');
              $(this).siblings('ul').slideDown(200).children('li');
              if ($(this).parents('li').siblings('li').children('ul').css('display') == 'block') {
                $(this).parents('li').siblings('li').children('ul').parent('li').children('a').removeClass('inactives');
                $(this).parents('li').siblings('li').children('ul').slideUp(200);
              }
            } else {
              //控制自身变成+号
              $(this).removeClass('inactives');
              //控制自身菜单下子菜单隐藏
              $(this).siblings('ul').slideUp(200);
              //控制自身子菜单变成+号
              $(this).siblings('ul').children('li').children('ul').parent('li').children('a').addClass('inactives');
              //控制自身菜单下子菜单隐藏
              $(this).siblings('ul').children('li').children('ul').slideUp(200);
              //控制同级菜单只保持一个是展开的（-号显示）
              $(this).siblings('ul').children('li').children('a').removeClass('inactives');
            }
          });
        });
      }
    }
  }]);

  directives.initDirective('importBtn', function () {
    return {
      restrict: 'A',
      link: function (scope, iElem, iAttr, ngmodel) {
        var XW = {
          /* worker message */
          msg: 'xlsx',
          /* worker scripts */
          rABS: '../bower_components/js-xlsx/xlsxworker2.js',
          norABS: '../bower_components/js-xlsx/xlsxworker1.js',
          noxfer: '../bower_components/js-xlsx/xlsxworker.js'
        };
        var rABS = iAttr.rabs == 'false' ? false : true;
        var transferable = iAttr.transferable == 'false' ? false : true;
        var use_worker = iAttr.useworker == 'false' ? false : true;
        var format = iAttr.format ? iAttr.format : 'json';

        function fixdata(data) {
          var o = "",
            l = 0,
            w = 10240;
          for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
          return o;
        }

        function ab2str(data) {
          var o = "",
            l = 0,
            w = 10240;
          for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w, l * w + w)));
          o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
          return o;
        }

        function s2ab(s) {
          var b = new ArrayBuffer(s.length * 2),
            v = new Uint16Array(b);
          for (var i = 0; i != s.length; ++i) v[i] = s.charCodeAt(i);
          return [v, b];
        }

        function xw_noxfer(data, cb) {
          var worker = new Worker(XW.noxfer);
          worker.onmessage = function (e) {
            switch (e.data.t) {
              case 'ready':
                break;
              case 'e':
                console.error(e.data.d);
                break;
              case XW.msg:
                cb(JSON.parse(e.data.d));
                break;
            }
          };
          var arr = rABS ? data : btoa(fixdata(data));
          worker.postMessage({
            d: arr,
            b: rABS
          });
        }

        function xw_xfer(data, cb) {
          var worker = new Worker(rABS ? XW.rABS : XW.norABS);
          worker.onmessage = function (e) {
            switch (e.data.t) {
              case 'ready':
                break;
              case 'e':
                console.error(e.data.d);
                break;
              default:
                var xx = ab2str(e.data).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                console.log("done");
                cb(JSON.parse(xx));
                break;
            }
          };
          if (rABS) {
            var val = s2ab(data);
            worker.postMessage(val[1], [val[1]]);
          } else {
            worker.postMessage(data, [data]);
          }
        }

        function xw(data, cb) {
          if (transferable)
            xw_xfer(data, cb);
          else
            xw_noxfer(data, cb);
        }

        function to_json(workbook) {
          var result = {};
          workbook.SheetNames.forEach(function (sheetName) {
            var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
              result[sheetName] = roa;
            }
          });
          return result;
        }

        function to_csv(workbook) {
          var result = [];
          workbook.SheetNames.forEach(function (sheetName) {
            var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
            if (csv.length > 0) {
              result.push("SHEET: " + sheetName);
              result.push("");
              result.push(csv);
            }
          });
          return result.join("\n");
        }

        function to_formulae(workbook) {
          var result = [];
          workbook.SheetNames.forEach(function (sheetName) {
            var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
            if (formulae.length > 0) {
              result.push("SHEET: " + sheetName);
              result.push("");
              result.push(formulae.join("\n"));
            }
          });
          return result.join("\n");
        }

        function handleFile(e) {
          var files = e.target.files;
          if (!files || files.length == 0) return;
          var f = files[0];
          var reader = new FileReader();
          var name = f.name;
          reader.onload = function (e) {
            if (typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
            var data = e.target.result;
            if (use_worker) {
              xw(data, process_wb);
            } else {
              var wb;
              if (rABS) {
                wb = XLSX.read(data, {
                  type: 'binary'
                });
              } else {
                var arr = fixdata(data);
                wb = XLSX.read(btoa(arr), {
                  type: 'base64'
                });
              }
              process_wb(wb);
            }
          };
          if (rABS)
            reader.readAsBinaryString(f);
          else
            reader.readAsArrayBuffer(f);
        }

        function process_wb(wb) {
          var output;
          switch (format) {
            case "json":
              output = to_json(wb);
              break;
            case "form":
              output = to_formulae(wb);
              break;
            default:
              output = to_csv(wb);
          }
          var fun = scope[iAttr.loadcomplete];
          if (fun) {
            fun(output)
          } else {
            growl.warning("无法批量添加该数据", {});
          }
        }

        require(['xlsx'], function () {
          iElem.parent().append('<input type="file" style="display:none" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">')
          iElem.on("click", function () {
            iElem.nextAll('input').click();
            iElem.nextAll('input').on("change", handleFile)
          });
        });
      }
    }
  });

  directives.initDirective('stringToNumber', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function (value) {
          return '' + value;
        });
        ngModel.$formatters.push(function (value) {
          return parseFloat(value);
        });
      }
    };
  });
  directives.initDirective("slickSlide", ["$timeout", function (timeout) {
    var directive = {};
    directive.scope = {
      options: "=",
      click: "&"
    };
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      $(element).css("width", "calc(100 - 30px)");
      $(element).css("margin", "0 15px");
      var ngModelWatcher = function (n, o, s) {
        var render = function (options) {
          $(element).children().remove();
          var addLi = function (index, op) {
            var div = $("<div></div>").text(op.title);
            div.addClass("inner-item");
            /**
             if(index == 1) {
              div.addClass("active");
            }
             */
            var click = function (event) {
              scope.$apply(function () {
                scope.click({
                  item: op
                });
              })
            };
            div.on("click", click);
            return div;
          };
          for (var i in options) {
            $(element).append(addLi(i, options[i]))
          }
          var domready = function () {
            var slickReady = function (slick) {
              $(element).slick({
                slidesToShow: 8,
                slidesToScroll: 8,
                arrows: true
              });
            };
            $$.loadExternalJs(['slick'], slickReady)
          };
          timeout(domready);
        };
        if (n != undefined) {
          render(n);
        }
      }
      scope.$watch("options", ngModelWatcher);
    }

    return directive;
  }]);
  directives.initDirective("maxlength", ["$timeout", function (timeout) {
    var directive = {};
    directive.scope = {
      maxlength: "=",
      ngModel: "="
    };
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      var maxlength = scope.maxlength;
      $(element).on("keyup", function (event) {
        var val = $(this).val();
        scope.$apply(function () {
          if (val.length > maxlength) {
            scope.ngModel = val.slice(0, maxlength);
          }
        });
      });
    }

    return directive;
  }]);
  directives.initDirective("dropdowntree", ["$timeout", function (timeout) {
    var directive = {};
    directive.scope = {
      ngModel: "=",
      disabled: "=",
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
    directive.restrict = "C";
    directive.link = link;

    function link(scope, element, attr) {
      //    if(element.context.children.length > 0) return; 已经没有在行内选择的场景，去掉
      var ready = function () {
        var mark;
        var placeholder = scope["placeholder"] == "" ? "" : (scope["placeholder"] ? scope["placeholder"] : "请选择...");
        var label = scope['label'] ? scope['label'] : 'text';
        var dtKey = scope.dtKey;
        var dtMark = scope.dtMark;
        var key
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
        if (attr["selectclass"]) {
          cssStyle = attr["selectclass"];
        } else {
          if (attr["class"]) {
            if (attr["class"].search("input-sm") > -1 || attr["class"].search("select-sm") > -1) {
              cssStyle = "form-control input-sm";
            }
          }
        }
        var select = $("<select></select>").addClass(cssStyle);
        var wraps = [];
        select.on("mousedown", function (event) {
          event.preventDefault();
        });
        if (scope.disabled != true) {
          select.on("click", function (event) {
            scope.$apply(function () {
              var elem = $(element)
                .find('[id*=container]');
              //          elem.css("box-sizing", "border-box");
              if (elem.hasClass("noview")) {
                elem.removeClass("noview");
                select.addClass("extend");

                timeout(function () {
                  $('body').on("click.body", docClick);
                });
              }

              //docClick函数定义放在if内部在IE下面会报错误.
              function docClick() {
                elem.addClass("noview");
                $('body').off("click.body");
                select.removeClass("extend");
              }
            });
          });
        } else {
          select.attr("disabled", "disabled");
        }
        //直接把select替换进
        //element.html(select);
        //这个地方用html会让label无法显示的 zhangafa
        element.append(select);
        function ngModelWatcher(n, o, s) {
          wraps.forEach(function (wrap) {
            wrap.removeClass("active");
          });
          if (!n) {
            select.children().remove();
            select.append($("<option id='selectlabel' value='selectlabel'>" + placeholder + "</option>"));
            //select.val('selectlabel')
          }
          if (n && scope.options) {
            var children;
            if (jQuery.isArray(scope.options)) {
              children = scope.options;
            } else {
              children = scope.options[mark];
            }
            var selectedTraverse = function (children) {
              children.forEach(function (child) {
                if (child[key] == n) {
                  select.children().remove();
                  select.append($("<option id='selectlabel' value='selectlabel'>" + (child.label ? child.label : "请选择...") + "</option>"));
                  //select.val('selectlabel')
                  wraps.forEach(function (wrap) {
                    if (wrap.attr(key) == n) {
                      wrap.addClass("active");
                    }
                  });
                } else {
                  if (child[mark]) {
                    selectedTraverse(child[mark])
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

        //traverse函数定义放在if内部在IE下面会报错误.
        function traverse(children, container, level) {
          children.forEach(function (child) {
            var wrap = $("<div></div>").addClass("wrap");
            var handler = $("<div></div>").addClass("glyphicon");
            var label = $("<span></span>").addClass("labeltxt");
            var childrenDom = $("<div></div>").addClass("children");
            var find = false;
            var children = child[mark];
            var checkhasViewId = function (child) {
              if (child.viewId == scope.ngModel) {
                return true;
              } else {
                if (child.hasOwnProperty(mark)) {
                  var checkViewId = function (chd) {
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
              (function (clone, inx) {
                if (inx == level - 1) {
                  clone.addClass("last");
                }
                clone.css("left", 10 + inx * 8 + "px");
                wrap.append(clone);
              })($("<div></div>").addClass("vline"), i)
            }
            wrap.append(handler);
            wrap.append(label);
            wrap.attr(key, child[key]);
            wrap.css("padding-left", (level * 8) + "px");
            wraps.push(wrap);
            container.append(wrap);
            if (child[key] == scope.ngModel || child[key] == attr["model"]) {
              select.children().remove();
              select.append($("<option id='selectlabel' value='selectlabel'>" + (child.label ? child.label : "请选择...") + "</option>"));
              //select.val('selectlabel')
            }
            wrap.on("click", function (event) {
              scope.$apply(function () {
                select.children().remove();
                select.append($("<option id='selectlabel' value='selectlabel'>" + (child.label ? child.label : "请选择...") + "</option>"));
                //select.val('selectlabel')
                wraps.forEach(function (elem) {
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
                if (!attr.hasOwnProperty("ngModel") || !attr.ngModel) {
                  scope.change({
                    data: {
                      value: child[key]
                    }
                  });
                }
              });
            });
            if (children) {
              if (checkhasViewId(child) == false) {
                childrenDom.addClass("hidechildren");
                handler.addClass("glyphicon-plus");
              } else {
                handler.addClass("glyphicon-minus");
              }

              handler.on("click", function (event) {
                event.stopPropagation();
                if (handler.hasClass("glyphicon-minus")) {
                  handler.removeClass("glyphicon-minus").addClass("glyphicon-plus");
                  childrenDom.css("overflow", "hidden");
                  childrenDom.animate({
                    "height": "100%",
                    opacity: 0
                  }, 300, function () {
                    childrenDom.css({
                      display: "none"
                    }).css("overflow", "auto");
                  })
                } else {
                  handler.removeClass("glyphicon-plus").addClass("glyphicon-minus");
                  childrenDom
                    .css("overflow", "hidden")
                    .css("display", "block");
                  childrenDom.animate({
                    "height": "100%",
                    "position": "absolute",
                    opacity: 1
                  }, 300);
                }
              });
              container.append(childrenDom);
              traverse(children, childrenDom, level + 1);
            } else {
              handler.addClass("glyphicon glyphicon-duplicate").css("opacity", 0);
            }
          })
        }

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
              var clone = { key: null };
              clone[label] = placeholder;
              children = [clone].concat(children);
            }
            select.find('[id*=selectlabel]').remove();

            if (options[key] && (options[key] == scope.ngModel || options[key] == attr["model"])) {
              select.append($("<option id='selectlabel'>" + (options.label ? options.label : "请选择...") + "</option>"));
            } else {
              select.append($("<option id='selectlabel'>" + placeholder + "</option>"));
            }

            container.append(childrenDom);
            element.find('[id*=container]').remove();
            element.append(container);
            if (children)
              traverse(children, childrenDom, 1);
          } else {
            element.find('[id*=container]').remove();
          }
        }

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

    return directive;
  }]);


  directives.initDirective('daterangePicker2', ["$timeout", "$filter", function ($timeout, $filter) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, iElem, iAttr, ngmodel) {
        var datePicker;
        var format = "YYYY-MM-DD";
        var timepicker = false; //是否显示时分秒
        var autoapply = true; //自动提交，如果timepicker==true时，不起作用
        var timepicker24hour = true; //是否显示24小时制，如果timepicker==true时，才有作用
        var timepickerseconds = true; //是否显示秒，如果timepicker==true时，才有作用
        var opens = "right"; //打开方向 right left center
        var iszero = false;
        var limitendtime = false; //限制结束时间不能超过现在时间
        var intervaldays = 30; //默认开始时间和结束时间的间隔
        if (iAttr['intervaldays']) {
          intervaldays = Number(iAttr.intervaldays);
        }
        if (iAttr['iszero']) {
          iszero = iAttr.iszero == 'true' ? true : false;
        }

        if (iAttr['limitendtime']) {
          limitendtime = iAttr.limitendtime == 'true' ? true : false;
        }
        if (iAttr['opens']) {
          opens = iAttr.opens
        }
        var drops = "up"; //纵方向 up down
        if (iAttr['drops']) {
          drops = iAttr.drops
        }

        //通过页面标签读取，如果true（YYYY-MM-DD）false （YYYY-MM-DD HH:mm:ss）
        if (iAttr['timepicker']) {
          timepicker = iAttr.timepicker == 'true' ? true : false;
          format = !timepicker ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss';
        }
        if (iAttr['autoapply']) {
          autoapply = iAttr.autoapply == 'true' ? true : false;
        }
        if (iAttr['timepicker24hour']) {
          timepicker24hour = iAttr.timepicker24hour == 'true' ? true : false;
        }
        if (iAttr['timepickerseconds']) {
          timepickerseconds = iAttr.timepickerseconds == 'true' ? true : false;
        }

        var formatDate = function (inputDate) {
          return $filter('date')(inputDate ? inputDate.getTime() : new Date().getTime(), timepicker && !iszero ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd')
        }
        var i = 0;
        iElem.on('show.daterangepicker', function (ev, picker) {
          if (i == 1) {
            i++;
            iElem.trigger("click");
          }
        });
        iElem.on('hide.daterangepicker', function (ev, picker) {
          i = 0;
        });
        iElem.on('showCalendar.daterangepicker', function (ev, picker) {
          if (i == 0) {
            i++;
            var model;
            model = scope[iAttr["model"]];
            if (!model)
              model = scope.$parent[iAttr["model"]];
            if (!model) return;
            var defDate = formatDate();
            var sDate = formatDate(new Date(new Date().getTime() - (intervaldays * 24 * 60 * 60 * 1000)));
            var startDate = model[iAttr["startdate"]] ? model[iAttr["startdate"]] : sDate;
            var endDate = model[iAttr["enddate"]] ? model[iAttr["enddate"]] : defDate;
            picker.setStartDate(startDate);
            picker.setEndDate(endDate);
          }
        });
        iElem.on('hideCalendar.daterangepicker', function (ev, picker) {
        });
        iElem.on('apply.daterangepicker', function (ev, picker) {
          datePicker = picker;
          var model;
          model = scope[iAttr["model"]];
          if (!model)
            model = scope.$parent[iAttr["model"]];
          if (!model) return;
          var startDate = picker.startDate.format(format);
          var endDate = picker.endDate.format(format);
          model[iAttr["startdate"]] = startDate;
          model[iAttr["enddate"]] = endDate;
          ngmodel.$modelValue = startDate + "到" + endDate;
          iElem.val(ngmodel.$modelValue)
          scope.$apply();
        });
        iElem.on('cancel.daterangepicker', function (ev, picker) {
          var model;
          model = scope[iAttr["model"]];
          if (!model)
            model = scope.$parent[iAttr["model"]];
          if (!model) return;
          model[iAttr["startdate"]] = "";
          model[iAttr["enddate"]] = "";
          ngmodel.$modelValue = "";
          iElem.val(ngmodel.$modelValue);
          i = 0;
          var defDate = formatDate();
          var startDate = formatDate(new Date(new Date().getTime() - (intervaldays * 24 * 60 * 60 * 1000)));
          if (picker) {
            picker.setStartDate(startDate);
            picker.setEndDate(defDate);
          } else if (datePicker) {
            datePicker.setStartDate(startDate);
            datePicker.setEndDate(defDate);
          }
        });

        scope.$watch(iAttr["ngModel"], function (newValue, oldValue) {
          if (!newValue && oldValue) {
            iElem.trigger("cancel");
          }
        });
        scope.clearSelectTime = function () {
          iElem.trigger("cancel");
        };
        $timeout(function () {
          require(['bootstrap-daterangepicker'], function (daterangepicker) {
            iElem.daterangepicker({
              singleDatePicker: false,
              showDropdowns: true,
              timePicker: timepicker,
              timePicker24Hour: timepicker24hour,
              timePickerSeconds: timepickerseconds,
              autoApply: autoapply,
              autoUpdateInput: false,
              minDate: timepicker ? '1980-01-01 00:00:00' : '1980-01-01',
              maxDate: timepicker ? (limitendtime ? formatDate() : '2099-12-31 23:59:59') : (limitendtime ? formatDate() : '2099-12-31'),
              opens: opens,
              drops: drops,
              "locale": {
                "format": format,
                "applyLabel": "确定",
                "cancelLabel": "清除",
                "daysOfWeek": [
                  "日",
                  "一",
                  "二",
                  "三",
                  "四",
                  "五",
                  "六"
                ],
                "monthNames": [
                  "一月",
                  "二月",
                  "三月",
                  "四月",
                  "五月",
                  "六月",
                  "七月",
                  "八月",
                  "九月",
                  "十月",
                  "十一月",
                  "十二月"
                ],
                "firstDay": 1
              }
            });
          });
        }, 200);
      },
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
        }
      ]
    };
  }]);

  directives.initDirective('dateTimePicker', ["$timeout", "$compile", "$filter", function ($timeout, $compile, $filter) {
    return {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        ngModel: '='
      },
      link: function (scope, iElem, iAttr, ngModel) {
        var datePicker;
        var format = "YYYY-MM-DD";
        var timepicker = false; //是否显示时分秒
        var autoapply = true; //自动提交，如果timepicker==true时，不起作用
        var timepicker24hour = true; //是否显示24小时制，如果timepicker==true时，才有作用
        var timepickerseconds = true; //是否显示秒，如果timepicker==true时，才有作用
        var iszero = false; // 初始化时是否显示00:00:00
        var opens = "right"; //横方向 right left center
        if (iAttr['opens']) {
          opens = iAttr.opens
        }
        var drops = "up"; //纵方向 up down
        if (iAttr['drops']) {
          drops = iAttr.drops
        }

        //通过页面标签读取，如果true（YYYY-MM-DD）false （YYYY-MM-DD HH:mm:ss）
        if (iAttr['timepicker']) {
          timepicker = iAttr.timepicker == 'true' ? true : false;
          format = !timepicker ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss';
        }
        if (iAttr['autoapply']) {
          autoapply = iAttr.autoapply == 'true' ? true : false;
        }
        if (iAttr['timepicker24hour']) {
          timepicker24hour = iAttr.timepicker24hour == 'true' ? true : false;
        }
        if (iAttr['timepickerseconds']) {
          timepickerseconds = iAttr.timepickerseconds == 'true' ? true : false;
        }
        if (iAttr['iszero']) {
          iszero = iAttr.iszero == 'true' ? true : false;
        }
        var i = 0;
        iElem.on('show.daterangepicker', function (ev, picker) {
          if (i == 1) {
            i++;
            iElem.trigger("click");
          }
        });
        iElem.on('hide.daterangepicker', function (ev, picker) {
          i = 0;
        });
        iElem.on('showCalendar.daterangepicker', function (ev, picker) {
          if (i == 0 && !iElem.val() && timepicker) {
            i++;
            var defDate = $filter('date')(new Date().getTime(), timepicker && !iszero ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd');
            picker.setStartDate(defDate);
            picker.setEndDate(defDate);
          } else if (i == 0 && scope['ngModel']) {
            i++;
            var date = scope['ngModel'];
            picker.setStartDate(date);
            picker.setEndDate(date);
          }
        });
        iElem.on('apply.daterangepicker', function (ev, picker) {
          datePicker = picker;
          var startDate = picker.startDate.format(format);
          scope.$apply(function () {
            iElem.val(startDate);
            if (ngModel)
              ngModel.$setViewValue(picker.startDate._d);
            if (iAttr['ngClick']) {
              var fun = scope.$parent[iAttr['ngClick']];
              if (fun) {
                fun();
              }
            }
          })
        });

        iElem.on('cancel.daterangepicker', function (ev, picker) {
          iElem.val("");
          if (ngModel)
            ngModel.$setViewValue("");
          var defDate = $filter('date')(new Date().getTime(), timepicker && !iszero ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd');
          if (picker) {
            picker.setStartDate(defDate);
            picker.setEndDate(defDate);
          } else if (datePicker) {
            datePicker.setStartDate(defDate);
            datePicker.setEndDate(defDate);
          }
        });
        scope.$watch("ngModel", function (newValue, oldValue) {
          if (!newValue && oldValue) {
            iElem.trigger("cancel");
          }
          if (newValue) {
            iElem.val($filter('date')(new Date(newValue), timepicker && !iszero ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'))
          }
        });
        $timeout(function () {
          require(['bootstrap-daterangepicker'], function (daterangepicker) {
            $(iElem).daterangepicker({
              singleDatePicker: true,
              showDropdowns: true,
              timePicker: timepicker,
              timePicker24Hour: timepicker24hour,
              timePickerSeconds: timepickerseconds,
              autoApply: autoapply,
              autoUpdateInput: false,
              minDate: timepicker ? '1980-01-01 00:00:00' : '1980-01-01',
              maxDate: timepicker ? '2025-12-31 23:59:59' : '2025-12-31',
              opens: opens,
              drops: drops,
              locale: {
                format: format,
                "applyLabel": "确定",
                "cancelLabel": "清除",
                "daysOfWeek": [
                  "日",
                  "一",
                  "二",
                  "三",
                  "四",
                  "五",
                  "六"
                ],
                "monthNames": [
                  "一月",
                  "二月",
                  "三月",
                  "四月",
                  "五月",
                  "六月",
                  "七月",
                  "八月",
                  "九月",
                  "十月",
                  "十一月",
                  "十二月"
                ]
              }
            }, function (start, end, label) {
            });
          })
        }, 200)
      }
    }
  }]);

  directives.initDirective('timeHoursPicker', ['$document', function ($document) {
    var setScopeValues = function (scope, attrs) {
      if(!scope.ngModel)
        scope.initTime = '00:00';
      else
        scope.initTime = scope.ngModel;
      //console.log(scope.initTime, "initTime");
    };
    return {
      restrict: 'A',
      scope: {
        ngDisabled:'=',
        ngModel: '='
      },
      replace: true,
      require: '?ngModel',
      link: function (scope, element, attrs, ngModel) {
        
        //console.log(ngModel);
        setScopeValues(scope, attrs);
        
        function initTime() {
          var time = scope.initTime.split(':');
          scope.hour = time[0];
          scope.minutes = time[1];
        };
        initTime();
        var setTime = function () {
          var time = scope.hour + ':' + scope.minutes;
            scope.viewValue = time;
            ngModel.$setViewValue(time);
        };
        setTime();
        var hoursArr = [];
        var minutesArr = [];
        for (var i = 0; i <= 60; i++) {
          if (i <= 24) hoursArr.push(i.toString().length === 1 ? '0' + i.toString() : i.toString());
          minutesArr.push(i.toString().length === 1 ? '0' + i.toString() : i.toString());
        }
        scope.hoursArr = hoursArr;
        scope.minutesArr = minutesArr;
        scope.opened = false;

        scope.$watch('hour', function(newHour){
          var hour_arr = scope.viewValue.split(":");
          hour_arr[0] = newHour;
          scope.viewValue = hour_arr.join(":");
          scope.ngModel = scope.viewValue;
        })
        scope.$watch('minutes', function(newMinutes){
          // if(!newMinutes) ngModel.$setViewValue('00:00');
          var hour_arr = scope.viewValue.split(":");
          hour_arr[1] = newMinutes;
          scope.viewValue = hour_arr.join(":");
          scope.ngModel = scope.viewValue;
        })
      
        scope.showTimepicker = function () {
          scope.opened = true;
        };

        $document.click(function (e) {
          if (element !== e.target && !element[0].contains(e.target)) {
            scope.$apply(function () {
              scope.opened = false;
            });
          }
        });
      },

      // select下拉选择
      template:
      
        '<div>\
        <input type="text"  ng-focus="showTimepicker()" ng-value="viewValue" class="ng-timepicker-input" ng-readonly="true">' +
        '<div style="width: 135px;" class="ng-timepicker" style="z-index:999;" ng-show="opened" ng-class="{\'red\': theme === \'red\', \'green\': theme === \'green\', \'blue\': theme === \'blue\'}">'
          +
          '<select style="width: 50%;height: 30px;font-size: 15px;" ng-model="hour" ng-options="x for x in hoursArr">\
          </select>'
          +
          '<select style="width: 50%;height: 30px;font-size: 15px;" ng-model="minutes" ng-options="y for y in minutesArr">\
          </select>'
        +
        '</div></div>',
      // 点击选择
      // template:
      //   '<input type="text" ng-focus="showTimepicker()" ng-value="viewValue" class="ng-timepicker-input" ng-readonly="true">' +
      //   '<div class="ng-timepicker" style="z-index:999;" ng-show="opened" ng-class="{\'red\': theme === \'red\', \'green\': theme === \'green\', \'blue\': theme === \'blue\'}">' +
      //   '  <table>' +
      //   '    <tbody>' +
      //   '    <tr>' +
      //   '        <td class="act noselect" ng-click="incrementHour()"><i class="fa fa-angle-up"></i></td>' +
      //   '        <td></td>' +
      //   '        <td class="act noselect" ng-click="incrementMinutes()"><i class="fa fa-angle-up"></i></td>' +
      //   '        <td class="act noselect" ng-click="toggleMeridian()" ng-show="showMeridian"><i class="fa fa-angle-up"></i></td>' +
      //   '      </tr>' +
      //   '      <tr>' +
      //   '        <td><input type="text" ng-model="hour" ng-readonly="true"></td>' +
      //   '        <td>:</td>' +
      //   '        <td><input type="text" ng-model="minutes" ng-readonly="true"></td>' +
      //   '        <td ng-show="showMeridian"><input type="text" ng-model="meridian" ng-readonly="true"></td>' +
      //   '      </tr>' +
      //   '      <tr>' +
      //   '        <td class="act noselect" ng-click="decreaseHour()"><i class="fa fa-angle-down"></i></td>' +
      //   '        <td></td>' +
      //   '        <td class="act noselect" ng-click="decreaseMinutes()"><i class="fa fa-angle-down"></i></td>' +
      //   '        <td class="act noselect" ng-click="toggleMeridian()" ng-show="showMeridian"><i class="fa fa-angle-down"></i></td>' +
      //   '      </tr>' +
      //   '  </table>' +
      //   '</div>'
    };
  }])

  directives.initDirective('domainPicker', ["$compile", "$timeout", function ($compile, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, iElem, iAttr, ngmodel) {
        require(['bootstrap-treeview'], function (treeview) {
          var getDomainList = function (domains) {
            if (iAttr.gatewaydomainpath) {
              for (var i in domains) {
                if (domains[i].domainPath == iAttr.gatewaydomainpath)
                  return [domains[i]]
                else
                  return getDomainList(domains[i].domains);
              }
            } else {
              return domains;
            }
          }
          iElem.on('shown.bs.popover', function () {
            var treeview1 = $('#treeview1');
            $compile(treeview1)(scope);

            var domainListTree = getDomainList(scope.domainListTree);

            treeview1.treeview({
              data: domainListTree,
              onNodeSelected: function (event, node) {
                if (node.domainPath != "") {
                  iElem.attr("domainPath", node.domainPath);
                  iElem.popover("hide");
                  if (iAttr.model) {
                    var arr = iAttr.model.split("\.")
                    var model = scope;
                    for (var i in arr) {
                      if (model) {
                        if (i == arr.length - 1) {
                          model[arr[i]] = node.domainPath;
                          break;
                        }
                        model = model[arr[i]];
                      }
                    }
                  }
                  iElem.val(node.name).change();
                }
              }
            });
          });

        })
      },
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          $element.attr("readonly", true);
          $element.data('content', "<div id ='treeview1' slim-scroll height='220px'></div>");
          $element.popover({
            html: true,
            trigger: 'manual',
            placement: 'auto bottom'
          });
          $element.on("click", function () {
            $element.popover("show");
            $element.siblings(".popover").on("mouseleave", function () {
              $element.popover('hide');
            });
          })
          $element.on("mouseleave", function () {
            setTimeout(function () {
              if (!$(".popover:hover").length) {
                $element.popover("hide")
              }
            }, 100);
          });
        }
      ]
    };
  }]);

  directives.initDirective('modelPicker', ["$compile", "$timeout", function ($compile, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, iElem, iAttr, ngmodel) {
        require(['bootstrap-treeview'], function (treeview) {
          if (iAttr.userparent)
            scope = scope.$parent;
          iElem.on('shown.bs.popover', function () {
            var treeview1 = $('#treeview1');
            $compile(treeview1)(scope);
            treeview1.treeview({
              data: scope.rootModel["nodes"],
              onNodeSelected: function (event, node) {
                iElem.attr("modelId", node.id);
                iElem.popover("hide");
                if (iAttr.model) {
                  var arr = iAttr.model.split("\.")
                  var model = scope;
                  for (var i in arr) {
                    if (model) {
                      if (i == arr.length - 1) {
                        model[arr[i]] = node.id;
                        break;
                      }
                      model = model[arr[i]];
                    }
                  }
                }
                iElem.val(node.label).change();
              }
            });
          });
        });

      },
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          $element.attr("readonly", true);
          $element.data('content', "<div id ='treeview1' slim-scroll height='220px'></div>");
          $element.popover({
            html: true,
            trigger: 'manual',
            placement: 'auto bottom'
          });
          $element.on("click", function () {
            $element.popover("show");
            $element.siblings(".popover").on("mouseleave", function () {
              $element.popover('hide');
            });
          })
          $element.on("mouseleave", function () {
            setTimeout(function () {
              if (!$(".popover:hover").length) {
                $element.popover("hide")
              }
            }, 100);
          });
        }
      ]
    };
  }]);

  directives.initDirective('sensorPopover', ["$compile", "$timeout", function ($compile, $timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, $element, iAttr, ngModel) {
        $timeout(function () {
          var htmlContent = '<div class="box form-group" style="margin-bottom:0;border-top:0;width:400px;">' +
            '<div class="box-header with-border">' +
            '<h3 class="box-title">' + iAttr.vlaue + '</h3>';
          if (ngModel.$modelValue.directive)
            htmlContent += '<input type="checkbox" class="switch" data-size="mini" data-on-text="关闭" data-off-text="启动" bootstrap-switch ngvalue="' + ngModel.$modelValue.kpiValue + '" ngid="' + ngModel.$modelValue.directive.id + '">';
          htmlContent += '<div class="box-tools pull-right">' +
            '<a href="#/emcsView/' + ngModel.$modelValue.id + '" class="btn btn-box-tool"><i class="fa fa-area-chart">报表</i></a>' +
            '<a href="#/configAlert/' + ngModel.$modelValue.id + '/node" class="btn btn-box-tool"><i class="fa fa-warning">告警</i></a>' +
            '<a href="#/resource_type/' + ngModel.$modelValue.modelId + '/alert" class="btn btn-box-tool"><i class="fa fa-cog">阈值</i></a>' +
            '</div>' +
            '</div>' +
            '<div class="box-body no-padding" >' +
            //						'<div class="sparkline pad" data-color="#fff"></div>'+
            '<div echarts3-dom name="sensorMain" style="height:170px"></div>' +
            '</div>' +
            '</div>'

          $element.data('content', $compile(htmlContent)(scope));
          $element.popover({
            html: true,
            trigger: 'manual',
            placement: 'bottom'
          }).on("click", function () {

            $element.popover("show");
            $element.siblings(".popover").on("mouseleave", function () {
              $element.popover('hide');
            });
          }).on("mouseleave", function () {
            setTimeout(function () {
              if (!$(".popover:hover").length) {
                $element.popover("hide")
              }
            }, 100);
          });
          var initChart = function (returnObj) {
            var option = {
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                x: 55,
                y: 10,
                x2: 40,
                y2: 25
              },
              toolbox: {
                show: false,
                feature: {
                  mark: {
                    show: true
                  },
                  dataView: {
                    show: true,
                    readOnly: false
                  },
                  magicType: {
                    show: true,
                    type: ['line', 'bar']
                  },
                  restore: {
                    show: true
                  },
                  saveAsImage: {
                    show: true
                  }
                }
              },
              calculable: true,
              xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: returnObj.times
              }],
              yAxis: [{
                type: 'value',
                scale: true,
                interval: iAttr.chartinterval ? Number(iAttr.chartinterval) : null,
                min: iAttr.min ? Number(iAttr.min) : 'auto',
                max: iAttr.max ? Number(iAttr.max) : 'auto',
                axisLabel: {
                  //                formatter: '{value} ' + (ngModel.$modelValue.unit == "NA" ? '' : ngModel.$modelValue.unit)
                  formatter: '{value}'
                }
              }],
              series: [{
                name: iAttr.vlaue,
                type: 'line',
                data: returnObj.data,

                markLine: {
                  data: [{
                    type: 'average',
                    name: '平均值'
                  }]
                }
              }]
            };
            $timeout(function () {
              scope.$broadcast(Event.ECHARTINFOSINIT, {
                "name": "sensorMain",
                "option": option
              });
            });
          }
          $element.on('show.bs.popover', function () {
            var instances = [];
            if (ngModel.$modelValue.instance) {
              instances.push(ngModel.$modelValue.instance);
            }
            scope.getHierarchyValue([ngModel.$modelValue.id], [ngModel.$modelValue.kpiCode], instances, function (returnObj) {
              if (returnObj) {
                initChart(returnObj);
              }
            })
          });
          $element.on('shown.bs.popover', function () {

          });
          $element.on('hidden.bs.popover', function () {

          })
        })
      }
    };
  }]);

  directives.initDirective('kpiSlick', ["$timeout", "$compile", function ($timeout, $compile) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, iElem, iAttr, ngmodel) {
        require(['slick'], function (slick) {
          $timeout(function () {
            var fontsize = iAttr.fontsize ? iAttr.fontsize : '48px';
            var slideIndex = 0;
            var item = {
              id: iAttr.itemid,
              label: iAttr.itemlabel
            };

            var addSlick = function (newValue) {
              //console.log(newValue);
              if (slideIndex > 0) {
                for (; slideIndex > 0; slideIndex--) {
                  iElem.slick('slickRemove', slideIndex - 1);
                }
              }
              for (var i in newValue) {
                //              iElem.slick('slickAdd','<div style="margin-right: 10px;" class="btn btn-social-icon '+newValue[i].stateStyle+'" data-toggle="popover" title="'+newValue[i].label+":"+newValue[i].value +'"><i class="'+newValue[i].icon+'"></i></div>');
                var str = '<div ng-click="viewDetail(item)" class="box-body">' +
                  '<p class="text-muted text-center">' + (newValue[i].value != "NA" ? newValue[i].value : '-') + (newValue[i].value == 'NA' || newValue[i].unit == 'NA' ? '' : newValue[i].unit) + '</p>' +
                  '<div style="width : 74px; height : 67px;" class="btn ' + newValue[i].stateStyle + '"><i style="font-size:' + fontsize + '" class="' + newValue[i].icon + '"></i></div>' +
                  '<h5 class="text-center">' + newValue[i].label + '</h5>' +
                  '</div>'
                iElem.slick('slickAdd', $compile(str)(scope));

                slideIndex++;
              }
            }
            scope.$watch(iAttr.ngModel, function (newValue) {
              addSlick(newValue);
            });
            scope.$on("kpiSlickValue", function (event, returnObj) {
              if (iAttr.itemid == returnObj.id) {
                addSlick(returnObj.value);
              }
            })
          })
        });
      },
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          require(['slick'], function (slick) {
            $element.slick({
              dots: false,
              arrows: true,
              draggable: false,
              slidesToScroll: 5,
              variableWidth: true,
              infinite: false
            });
          });
        }
      ]
    };
  }]);
  directives.initDirective('slick', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      //			require: 'ngModel',
      //			link: function(scope, iElem, iAttr,ngModel) {
      link: function (scope, iElem, iAttr) {
        var init = false;
        var requireFinish = false;
        var slideIndex = 0;
        var timesRenderFinish = false;
        var autorender = true; //自动渲染
        if (iAttr['autorender']) {
          autorender = iAttr.autorender == 'true' ? true : false;
        }
        var autoplay = false;
        if (iAttr['autoplay']) {
          autoplay = iAttr.autoplay == 'true' ? true : false;
        }
        var autoplaySpeed = 3000;
        if (iAttr['autoplayspeed']) {
          autoplaySpeed = iAttr.autoplayspeed
        }
        var arrows = false;
        if (iAttr['arrows']) {
          arrows = iAttr.arrows == 'true' ? true : false;
        }
        var dots = true;
        if (iAttr['dots']) {
          dots = iAttr.dots == 'true' ? true : false;
        }
        var variableWidth = false;
        if (iAttr['variablesidth']) {
          variableWidth = iAttr.variablesidth == 'true' ? true : false;
        }
        var draggable = true;
        if (iAttr['draggable']) {
          draggable = iAttr.draggable == 'true' ? true : false;
        }
        var slidesToScroll = 1;
        if (iAttr['slidestoscroll']) {
          slidesToScroll = iAttr.slidestoscroll
        }
        var slidesToShow = 1;
        if (iAttr['slidestoshow']) {
          slidesToShow = iAttr.slidestoshow
        }
        var infinite = false;
        if (iAttr['infinite']) {
          infinite = iAttr.infinite == 'true' ? true : false;
        }
        // On before slide change
        iElem.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
          console.log(nextSlide);
        });
        // On init
        iElem.on('init', function (event, slick) {
          console.log("");
        });
        // On init
        iElem.on('reInit', function (event, slick) {
          console.log("");
        });
        scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
          if (!init)
            requireFinish = true;
        });
        require(['slick'], function (slick) {
          var render = function () {
            if (!init)
              init = true;
            else
              iElem.slick('unslick')

            iElem.slick({
              dots: dots,
              arrows: arrows,
              draggable: draggable,
              swipeToSlide: true,
              slidesToScroll: slidesToScroll,
              slidesToShow: slidesToShow,
              infinite: infinite,
              autoplay: autoplay,
              variableWidth: variableWidth,
              autoplaySpeed: autoplaySpeed
            });
          }
          if (autorender || requireFinish) {
            $timeout(function () {
              render();
            })
          } else {
            scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
              if (!init)
                render();
            });
          }
          scope.$on('ngRepeatDelFinished', function (event, params) {
            $timeout(function () {
              iElem.slick('slickRemove', true, true, true);
              render();
            }, 100);
          });
          scope.$watch(iAttr.ngModel, function (newVal, oldVal) {
            if (newVal === oldVal) {
              return;
            }
            if (init) {
              iElem.slick('slickRemove', true, true, true);
              render();
            }
          });
        });

      }
    };
  }]);
  directives.initDirective('slimScroll', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
      restrict: 'A',
      link: function (scope, iElem, iAttr) {
        var init = function () {
          var clientHeight = $(window).height() - (iAttr.offseth ? Number(iAttr.offseth) : 200);
          //加了一个外部控制宽的判断
          var clientWidth = "auto";
          $timeout(function () {
            iElem.slimScroll({
              width: iAttr.width ? iAttr.width : clientWidth, //可滚动区域宽度
              height: iAttr.height ? iAttr.height : clientHeight, //可滚动区域高度
              //              size: '10px', //组件宽度
              //              color: '#000', //滚动条颜色
              //              position: 'right', //组件位置：left/right
              //              distance: '0px', //组件与侧边之间的距离
              //              start: 'top', //默认滚动位置：top/bottom
              //              opacity: .4, //滚动条透明度
              //              alwaysVisible: true, //是否 始终显示组件
              //              disableFadeOut: false, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
              //              railVisible: true, //是否 显示轨道
              //              railColor: '#333', //轨道颜色
              //              railOpacity: .2, //轨道透明度
              //              railDraggable: true, //是否 滚动条可拖动
              //              railClass: 'slimScrollRail', //轨道div类名 
              //              barClass: 'slimScrollBar', //滚动条div类名
              //              wrapperClass: 'slimScrollDiv', //外包div类名
              //              allowPageScroll: true, //是否 使用滚轮到达顶端/底端时，滚动窗口
              //              wheelStep: 20, //滚轮滚动量
              //              touchScrollStep: 200, //滚动量当用户使用手势
              //              borderRadius: '7px', //滚动条圆角
              //              railBorderRadius: '7px' //轨道圆角
            });
          })
        }
        if (iAttr.hasOwnProperty("ngHide") || iAttr.hasOwnProperty("ngShow")) {
          iAttr.$observe('ngShow', function (expr) {
            scope.$watch(function () {
              return $parse(expr)(scope);
            }, function (value) {
              if (value) {
                init();
              }
            })
          });
        } else {
          init();
        }
      }
    };
  }]);

  directives.initDirective('iCheck', ["$timeout", "$parse", function ($timeout, $parse) {
    return {
      link: function ($scope, element, $attrs) {
        require(['iCheck'], function (iCheck) {
          var boxClass = $attrs['boxclass'];
          var radioClass = $attrs['radioclass'];
          if (!$attrs['boxclass']) {
            boxClass = 'icheckbox_square-blue';
          }
          if (!$attrs['radioclass']) {
            radioClass = 'iradio_square-blue';
          }

          var value = $attrs['value'],
            ngModelGetter = $parse($attrs['ngModel']);
          return $timeout(function () {
            $scope.$watch($attrs.ngModel, function (newValue) {
              $(element).iCheck('update');
            });

            $(element).iCheck({
              labelHover: false,
              checkboxClass: boxClass,
              increaseArea: '20%',
              radioClass: radioClass
            }).on('ifChanged', function (event) {
              if ($attrs['change']) {
                var fun = $scope[$attrs['change']];
                if (fun) {
                  fun($scope.item);
                }
              }
              var elemType = $(element).attr('type');

              if (elemType === 'checkbox' && $attrs.ngModel) {
                $scope.$apply(function () {
                  return ngModelGetter.assign($scope, event.target.checked);
                });
              } else if (elemType === 'radio' && $attrs.ngModel) {
                return $scope.$apply(function () {
                  return ngModelGetter.assign($scope, value);
                });
              }
            });
          });
        });
      }
    };
  }]);

  directives.initDirective('baiduWeather', ["$timeout", "$parse", "$http", "weatherService", function ($timeout, $parse, $http, weatherService) {
    return {
      restrict: 'A',
      templateUrl: function (o, attrs) {
        return attrs.templateurl ? attrs.templateurl : 'partials/weather.html';
      },
      link: function ($scope, $element, $attrs) {
        return $timeout(function () {
          var initChart = function (returnObj) {
            var data = [];
            var maxData = [];
            var minData = [];
            if ($scope.weathers.data && $scope.weathers.data.error == 0) {
              for (var i = 1; i < 4; i++) {

                var weather = $scope.weathers.data.results[0].weather_data[i];
                data.push(weather.date);
                var arr = weather.temperature.split(" ~ ");
                maxData.push(arr[0]);
                minData.push(arr[1].split("℃")[0]);
              }
            }
            var option = {
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                borderWidth: 0,
                x: 15,
                y: 5,
                x2: 15,
                y2: 5
              },

              toolbox: {
                show: false,
                feature: {
                  mark: {
                    show: true
                  },
                  dataView: {
                    show: true,
                    readOnly: false
                  },
                  magicType: {
                    show: true,
                    type: ['line', 'bar']
                  },
                  restore: {
                    show: true
                  },
                  saveAsImage: {
                    show: true
                  }
                }
              },
              calculable: true,
              xAxis: [{
                type: 'category',
                show: false,
                boundaryGap: false,
                data: data
              }],
              yAxis: [{
                type: 'value',
                show: false,
                axisLabel: {
                  formatter: '{value} °C'
                }
              }],
              series: [{
                name: '最高气温',
                type: 'line',
                data: maxData
              }, {
                name: '最低气温',
                type: 'line',
                data: minData
              }]
            };
            $timeout(function () {
              $scope.$broadcast(Event.ECHARTINFOSINIT, {
                "name": "weatherMain",
                "option": option
              });
            });
          }
          $scope.$on('updateWeatherFinish', function (event, params) {
            initChart();
          });
          $scope.updateWeather = function (city) {
            weatherService.getWeatherByCity(city, function (returnObj) {
              if (returnObj.code == 0) {
                $scope.weathers = {
                  data: JSON.parse(returnObj.data)
                };
                $scope.$broadcast("updateWeatherFinish");
              }
            })
          };
          $scope.$watch($attrs.ngModel, function (newValue) {
            if (!newValue)
              newValue = "北京"
            $scope.updateWeather(newValue)
          });
        });
      }
    };
  }]);
  directives.initDirective('dateLabel', ['$compile', '$timeout', '$filter', function ($compile, $timeout, $filter) {
    return {
      restrict: 'EA',
      link: function (scope, iElem, iAttr, ngmodel) {
        var myJsDate = $filter('date')(iAttr.value, iAttr.format);
        iElem.context.innerHTML = myJsDate;
      }
    };
  }]);
  directives.initDirective('sglclick', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        var fn = $parse(attr['sglclick']);
        var delay = 100,
          clicks = 0,
          timer = null;
        element.on('click', function (event) {
          clicks++; //count clicks
          if (clicks === 1) {
            timer = setTimeout(function () {
              scope.$apply(function () {
                fn(scope, {
                  $event: event
                });
              });
              clicks = 0; //after action performed, reset counter
            }, delay);
          } else {
            clearTimeout(timer); //prevent single-click action
            clicks = 0; //after action performed, reset counter
          }
        });
      }
    };
  }]);
  directives.initDirective('bootstrapSwitch', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        require(['bootstrap-switch'], function (bootstrapSwitch) {
          $(element).bootstrapSwitch({
            state: attrs['ngvalue'] == 0 ? false : true
          });
          $(element).on('switchChange.bootstrapSwitch', function (e, data) {
            if (scope[attrs['model']] == data) return;
            scope.$emit("switchChange", {
              nodeId: "",
              id: attrs['ngid'],
              itemDirValues: data ? 1 : 0
            });
          });
          if (attrs.hasOwnProperty('model')) {
            scope.$watch(attrs['model'], function (newValue, oldValue) {
              if (newValue != oldValue)
                $(element).bootstrapSwitch('state', newValue);
            });
          }
        });

      }
    }
  });
  directives.initDirective('select2', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, ngModel) {
        //同一个Dom中存在时，跳出
        //    if(element.context.children.length > 0) return; 已经没有在行内选择的场景，去掉

        //初始化状态
        var initStatus = false;

        //如初始化、销毁
        var destroySelect2 = function (selectData) {
          if (initStatus) {
            initStatus = false;
            var instance = $(element).data('select2');
            if (instance) {
              $(element).select2('destroy');
              if (selectData) {
                $(element).empty();
              }
            }
          }
        };

        //初始化
        var init = function (selectData) {
          require(['select2'], function (select2) {
            //如果Dom为ng-show控制时，监听变化
            if ($(element).hasClass("ng-hide")) {
              attrs.$observe('ngShow', function (expr) {
                scope.$watch(function () {
                  return $parse(expr)(scope);
                }, function (value) {
                  if (value) {
                    init(scope[attrs["selectdata"]]);
                  } else {
                    destroySelect2(selectData);
                  }
                })
              });
              return;
            }

            //判断是否销毁
            destroySelect2(selectData);
            var baseSelect2 = {
              language: {
                noResults: function () {
                  return attrs.noresults ? attrs.noresults : "没有该匹配项";
                }
              },
              placeholder: attrs.placeholder ? attrs.placeholder : "请选择..."
            };
            if (selectData) {
              baseSelect2.data = selectData;
            }
            $(element).children("[value$='?']").remove();
            //实例化select2
            $(element).select2(baseSelect2);

            initStatus = true;
            //设置select2为空
            scope.select2init = function (value) {
              $(element).val(value).trigger("change.select2");
            };
            $(element).on("select2:select", function (evt) {
              if (evt.params) {
                var fun = scope[attrs.itemchange];
                if (fun) {
                  fun(evt.params.data)
                }
              }
            });
            if (!ngModel.$modelValue) {
              scope.select2init();
            }
          })
        };
        scope.$watch(attrs.ngModel, function (n, o) {
          if (n && !o) {
            if (initStatus) {
              init();
            }
          } else {
            init();
          }
        });
        //监听数据源，如果为null时监听变化，注意：selectdata的源一定要初始状态为null
        scope.$watch(attrs.selectdata, function (n, o, s) {
          if ((n && n.length > 0) || (n != o)) {
            scope.$evalAsync(function () {
              init();
            });
          }
        });
      }
    }
  }]);
  directives.initDirective('bootstrapMultiselect', function () {
    return {
      restrict: 'A',
      //    require: 'ngModel',
      link: function (scope, element, attrs) {
        require(['bootstrap-multiselect'], function (multiselect) {
          element.multiselect({
            nonSelectedText: attrs.nonselectedtext ? attrs.nonselectedtext : '请选择...',
            numberDisplayed: attrs.numberdisplayed ? attrs.numberdisplayed : 5,
            nSelectedText: '项被选中',
            allSelectedText: '全选中',
            enableFiltering: attrs.enablefiltering == 'true' ? true : false,
            filterPlaceholder: '搜索',
            templates: {
              filter: '<li class="multiselect-item multiselect-filter"><div class="input-group"><input class="form-control multiselect-search" type="text"></div></li>'
            },
            buttonWidth: attrs.buttonwidth ? attrs.buttonwidth : '',

            //        selectedClass: 'disabled',
            buttonClass: attrs.buttonclass ? attrs.buttonclass : 'btn btn-default btn-sm',
            onDropdownShow: function (option, checked) {
              //如果没有数据加一个提示语
              var selLength = $(".multiselect-group select option");
              if (selLength.length == 0) {
                $(".multiselect-group select").append("<option value='Value'>没有该匹配项</option>");
                element.multiselect('rebuild');
                // $(".multiselect-group ul li:first-child").css("display","none");
                $(".multiselect-group ul li:last-child").html('<label  style="cursor:default;text-align: center;display: inline-block;width: 100%;font-weight: 400;"> 没有该匹配项</label>');
                $(".multiselect-group select").empty();
              }
            },
            onChange: function (option, checked) {
              // Get selected options.
              //              var selectedOptions = element.find('option:selected');
              //              var values = [];
              //              selectedOptions.each(function() {
              //                values.push($(this).val());
              //              });
              //              ngModel = values;
              //              if (selectedOptions.length >= 4) {
              //                  // Disable all other checkboxes.
              //                  var nonSelectedOptions = $('#example-limit option').filter(function() {
              //                      return !$(this).is(':selected');
              //                  });
              // 
              //                  var dropdown = $('#example-limit').siblings('.multiselect-container');
              //                  nonSelectedOptions.each(function() {
              //                      var input = $('input[value="' + $(this).val() + '"]');
              //                      input.prop('disabled', true);
              //                      input.parent('li').addClass('disabled');
              //                  });
              //              }
              //              else {
              //                  // Enable all checkboxes.
              //                  var dropdown = $('#example-limit').siblings('.multiselect-container');
              //                  $('#example-limit option').each(function() {
              //                      var input = $('input[value="' + $(this).val() + '"]');
              //                      input.prop('disabled', false);
              //                      input.parent('li').addClass('disabled');
              //                  });
              //              }
            }
          });
          scope.$watch(function () {
            return element[0].length;
          }, function () {
            element.multiselect('rebuild');
          });

          // Watch for any changes from outside the directive and refresh
          if (attrs.selectvalues) {
            element.multiselect('select', attrs.selectvalues.split(","))
            attrs.selectvalues = "";
          } else {
            scope.$watch(attrs.ngModel, function (newVal, oldVal) {
              if (newVal) {
                if (attrs.selectvalues) {
                  element.multiselect('select', attrs.selectvalues.split(","))
                  attrs.selectvalues = "";
                } else {
                  element.multiselect('refresh');
                }
              }
            });
          }
        })
      }
    }
  });
  //angel start    psMultiselect 2018/8/14
  directives.initDirective('psMultiselect', ['$compile', function ($compile) {
    return {
      restrict: 'E',
      template: '<div>' +
        '<select name="multiselect[]" multiple="multiple" style="border:none' +
        '"></select>' +
        '<span></span>' +
        '</div>',
      require: ['ngModel'],
      scope: {
        ngModel: '=',
        config: '=?',//？表示可传可不传
        options: '@'  //= 赋值 @字符格式  & 回调  不写也可以
      },
      replace: true,
      link: function (scope, element, attr, ngModel) {
        //判断数组  对象的方法
        var toString = Object.prototype.toString,
          isArray = isTypeof("Array"),
          isObject = isTypeof("Object");
        function isTypeof(type) {
          return function (obj) {
            return toString.call(obj) === "[object " + type + "]";//记得空格
          }
        }
        require(['bootstrap-multiselect'], function () {
          // reg1 不可以匹配最后一项 item.kpis reg 可以
          //var reg = /(?:(?:([\w\[\]\d\.\"\']+)\s+as\s+)?([\w\[\]\d\.\"\']+)\s+for\s+)?(\w+)\s+in\s+(\w+)/g,
          var reg = /(?:(?:([\w\[\]\d\.\"\']+)\s+as\s+)?([\w\[\]\d\.\"\']+)\s+for\s+)?(\w+)\s+in\s+(?:([\w\[\]\d\.\"\']+))/g,
            match = reg.exec(attr["options"]),
            options = match[4],
            item = match[3],
            value = match[2] || item,
            key = match[1] || value,
            $dom = element.find('select'),
            dom = $dom.get(0),
            $spa = element.find('span'),
            dataOptions = scope.$parent[options],
            defaultOptions = {
              numberDisplayed: 1,
              buttonWidth: '178px',//按钮宽度
              // selectedClass: 'multiselect-selected',//选中项样式
              enableFiltering: true,//过滤
              filterPlaceholder: '请搜索',
              nonSelectedText: '请选择...',
              nSelectedText: '项被选中',
              buttonClass: 'btn btn-default btn-sm',
              includeSelectAllOption: true,//全选
              enableCaseInsensitiveFiltering: true,//不区分大小写
              selectAllText: '全选',//全选的checkbox名称
              maxHeight: 200,
              allSelectedText: '全选中',
              countSelected: '# of % selected'
            };
          defaultOptions = $.extend({}, defaultOptions, scope.config || {});//维护一个默认配置 如果传入就继承
          var fn = new Function("scope", "options", "callback",
            "for(var i in options){\n\
                      var " + item + "=options[i];\n\
                      callback(" + key + ", " + value + "," + item + ")\n\
                  }");
          scope.$parent.$watch(options, function (n, o, s) {//options 为父级正则匹配到的变量
            if (!n) {
              return;
            } else {
              isArray(n) ? render(n, true) : null;
            }
          });
          function render(n, needRebuild) {
            try {
              if (needRebuild) {
                var str1 = '';
                fn(scope, n, function (key, value, item) {
                  str1 += "<option value=" + key + ">" + value + "</option>";
                });
              } else {
                return;
              }
            } catch (e) {
              $spa.text('*无效的表达式');
            } finally {
              $dom.html(str1);
              $dom.multiselect(defaultOptions);
              $dom.multiselect(dataOptions);
              var modelStrArr = attr.ngModel.split('.');
              var value;
              modelStrArr.forEach(function (str) {
                value = value ? value[str] : scope.$parent[str];
              });
              $dom.multiselect('rebuild');///先rebuild在多选
              $dom.multiselect('select', value);
            }
          }
          render(dataOptions, true);
          dom.onchange = function () {
            ngModel[0].$setViewValue($dom.val());
          };
          Array.prototype.push.call(ngModel[0].$parsers, function (n, o) {
            if (!n) {
              return;
            }
            return n;
          });
        })

      }
    }
  }]);
  //angel end
  directives.initDirective('uploaderDiv', function () {
    return {
      restrict: 'AE',
      template: '<div class="input-group">'
        + '<input id="nv-file-select" style="display:none" class="form-control input-sm" type="file" nv-file-select uploader="uploader">'
        + '<input type="text" disabled class="form-control input-sm" ng-model="uploader.queue[0].file.name" placeholder="请选择一个文件">'
        + '<span class="input-group-btn">'
        + '<button class="btn btn-default btn-sm" type="button" ng-click="toggle()"><i class="proudsmart ps-add"></i></button>'
        + '</span>'
        + '</div>',
      replace: true,
      link: function (scope, element, attrs) {
        scope.toggle = function toggle() {
          $('#nv-file-select').click();
        }
      }
    };
  });
  directives.initDirective('uploaderDiv2', ["$rootScope", function (rootScope) {
    return {
      restrict: 'AE',
      scope: {
      },
      template: '<div class="input-group">'
        + '<input id="nv-file-select" style="display:none" class="form-control input-sm" type="file" nv-file-select uploader="uploader">'
        + '<input type="text" disabled class="form-control input-sm" ng-model="uploader.fileBelongDic[fileBelongId][0].file.name" placeholder="请选择一个文件">'
        + '<span class="input-group-btn">'
        + '<button class="btn btn-default btn-sm" type="button" ng-show="!uploader.fileBelongDic[fileBelongId] || uploader.fileBelongDic[fileBelongId].length == 0" title="添加文件" ng-click="toggle()"><i class="proudsmart ps-add"></i></button>'
        + '<button class="btn btn-default btn-sm" type="button" ng-show="uploader.fileBelongDic[fileBelongId].length > 0" title="上传" ng-click="uploader.uplaodHandler()"><i class="glyphicon glyphicon-upload"></i></button>'
        + '<button class="btn btn-default btn-sm" type="button" ng-show="uploader.fileBelongDic[fileBelongId].length > 0" title="清空" ng-click="uploader.clearHandler()"><i class="glyphicon glyphicon-trash"></i></button>'
        + '</span>'
        + '</div>',
      replace: true,
      controller: ['$scope', '$element', '$attrs',
        function (scope, element, attrs) {
          scope.uploader = rootScope.uploader;
        }
      ],
      link: function (scope, element, attrs) {
        scope.fileBelongId = element[0].parentElement.id;
        scope.toggle = function toggle() {
          if (scope.uploader.queue.length > 0) {
            scope.uploader.growl("当前有未上传的文档，请上传或者清空");
            return;
          }
          rootScope.uploader.fileBelongId = scope.fileBelongId;
          $('#nv-file-select').click();
        }
      }
    };
  }]);
  directives.initDirective('sortable', ['$timeout', '$compile', '$filter', function ($timeout, $compile, $filter) {
    return {
      restrict: 'E',
      scope: {
        ngModel: "=",
        source: "=",
        target: "=",
        eventUpdate: "&",
        setting: "="
      },
      template: '<div ng-class="setting.boxClass">' +
        '<ul ng-class = "setting.ulClass">' +
        '<li ng-repeat="item in source" id="{{item.id}}" ng-class="setting.liClass">{{item.label}}</li>' +
        '</ul>' +
        '<ul ng-class = "setting.ulClass"> ' +
        ' <li ng-repeat = "item in target" ng-class = "setting.liClass" id = "{{item.id}}" > {{item.label}} </li>' + '</ul>' +
        '</div>',
      link: function (scope, element, attrs, ngModel) {
        //样式 最外层div必须有高
        if (!scope.setting.boxClass) {
          $(element).css("height", "300px");
        }
        var render = function (data) {
          var uls = $(element).find('ul');
          var delay = 50,
            distance = 3,
            cursor = "move",
            cancel, dropOnEmpty = true,
            placeholder = "",
            typeObj = {};
          if (scope.setting && scope.setting['placeholder']) {
            placeholder = scope.setting.placeholder;
          }
          if (scope.setting && scope.setting['delay']) {
            delay = scope.setting['delay'];
          }
          if (scope.setting && scope.setting['distance']) {
            distance = scope.setting['distance'];
          }
          if (scope.setting && scope.setting['type']) {
            if (scope.setting['type'] == 'connectWith') { //type = connectWith 是双项，默认为单项
              typeObj = {
                connectWith: 'ul',
              }
            }
          }

          require(['jquery-ui'], function (sort) {
            uls.sortable($.extend(typeObj, {
              delay: delay,
              distance: distance,
              dropOnEmpty: dropOnEmpty,
              placeholder: placeholder,
              helper: "clone",
              items: ">li", // 指定哪些条目是可排序
              // cancel: cancel, //取消排序（但仍为防止目标）
              cursor: cursor, //"crosshair","auto",
              revert: true, //sortable 项目是否使用一个流畅的动画还原到它的新位置
              scroll: true, //如果设置为 true，当到达边缘时页面会滚动。
              scrollSensitivity: 10, //定义鼠标距离边缘多少距离时开始滚动。
              update: function (event, ui) {
                var as = $(this).sortable("serialize", {
                  key: "id"
                });
                var asAry = as.split("&");
                var totalAry = asAry.map(function (item) {
                  var itemAry = item.split("=");
                  return {
                    id: parseInt(itemAry[1])
                  }
                })
                scope.$apply(function () {
                  scope.eventUpdate({
                    as: as
                  })
                })
                console.log(totalAry);
                return totalAry;
              },
              remove: function (event, ui) {
                var id = ui.item.attr('id').split("_")[1];
                return {
                  id: id,
                  label: ui.item.html()
                };
              },
              activate: function (event, ui) {
              }
            })).disableSelection();

          })
        };

        scope.watch = {};
        scope.watch.source = scope.source;
        scope.watch.target = scope.target;
        scope.$watch('watch', function (n, o, s) {
          if (n) {
            render(n);
          }
        });
      }
    }
  }]);
});