/**
 * Created by leonlin on 16/11/3.
 */
define(['../services/services.js', 'bootstrap-dialog', 'toolkit/date-handler'], function(services, BootstrapDialog, dateHandler) {
  'use strict';
  var WIN = window || {};
  services.factory('commonMethodService', ['$timeout', '$rootScope', '$q', '$routeParams', 'Info', 'customMethodService', 'projectUIService', 'serviceCenterService', 'dictionaryService', 'energyConsumeUIService', 'ticketTaskService', 'resourceUIService', 'viewFlexService', 'userLoginUIService', '$route', '$window', 'growl', 'kpiDataService', 'SwSocket', 'alertService', 'userDomainService',
    'thridPartyApiService', 'freeboardBaseService', 'configUIService', 'serviceProxy', 'FileUploader', 'maintenanceTaskUIService',
    function(timeout, rootScope, q, routeParam, Info, customMethodService, projectUIService, serviceCenterService, dictionaryService, energyConsumeUIService, ticketTaskService, resourceUIService, viewFlexService, userLoginUIService, route, window, growl, kpiDataService, SwSocket, alertService, userDomainService, thridPartyApiService,
      freeboardBaseService, configUIService, serviceProxy, FileUploader, maintenanceTaskUIService) {
      //WIN.$cache = WIN.$cache || {};
      var clickFnDic = {}; //按钮的返回集合
      var traverseRow;
      var rootTarget;
      var events = {};
      var oldURL = "";
      var domainAreaLineTree, domainAreaLineTree_alertStatus;
      var getDomainAreaLineTree;
      var treeCallback = [];
        WIN.$objPushArr = {};
        var objPushArr = []
      
      var themeCompare = {
        default: "default",
        Cyborg: "dark",
        Slate: "dark",
        Solar: "macarons"
      }
      var cmethod = function(data) {
        if(data) {
          this.$clone(data);
        }
      };
      cmethod.kpiDic = {};
      cmethod.resourceDic = {};
      function clone(obj){
        return JSON.parse(JSON.stringify(obj));
      }
      /**
       * //  2D视图：柱状图（barOption）、折线图（polylineOption）、饼图（pieOption）
       *     3D视图：散点图（scatter3DOption）、柱状图（bar3DOption）、折线图（line3DOption）
       * @returns {option}
       */
      var createSystemPopup = function(object, config, data, depth) {
        var cur = this;
        cur.setValue("$POPUPDATA", data);
        config = config || {};
        var renderTo = $("body");
        var showcloseBtn = config.closeBtn;
        var bgOpacity = config.bgOpacity;
        if(bgOpacity == undefined) {
          bgOpacity = .1;
        }
        if(!rootTarget) {
          growl.info("视图加载中，请稍等");
          return;
        }
        var themeObj = JSONparse(rootTarget.setting) || {
          theme: "default"
        };
        var theme = themeObj.theme || "default";
        var submitFn = config.$attr("on/submit");
        var cancelFn = config.$attr("on/cancel");
        var cur = this;
        var modelDia = $('<div id="bootstrap-dialog" class="modal bootstrap-dialog type-primary fade size-normal in" style="display : table-cell;" popup_layer="popup_layer">\
        <div class="modal-dialog">\
          <div class="modal-content">\
          <div class="modal-header bg-f2 padding-bottom-20">\
          <div class="bootstrap-dialog-header">\
          <a role="button" class="close">×</a>\
        <h4 class="modal-title info-box-number"></h4>\
          </div>\
          </div>\
          <div class="modal-body no-pad-top">\
          </div>\
          </div>\
          </div>\
          </div>');
        var contentDom = modelDia.find(".modal-dialog");
        contentDom.addClass(theme);
        contentDom.css("height", "auto");
        modelDia.addClass("block");
        contentDom.css("min-height", "0");
        var content = modelDia.find(".modal-dialog");
        var title = modelDia.find("h4");
        title.text(config.title || "标题文字");
        var outter = modelDia.find(".modal-body");
        var bg = $("<div></div>");
        var wrap = $("<div></div>");
        var closeBtn = modelDia.find("a.close");
        var span = $("<div></div>");
        modelDia.css("z-index", (depth + 1) || 10000);
        if(config.width != undefined) {
          content.css("width", config.width);
        }
        var row = $("<div></div>");
        row.addClass("row");
        row.append(wrap);
        outter.append(row);
        outter.attr("id", "pp");
        wrap.css("position", "relative");
        wrap.addClass("col-md-12");
        wrap.attr("id", "popup");
        wrap.css("width", "100%");
        wrap.css("padding-top", "10px");
        var destroy = function() {
          content.animate({
            "margin-top": 0
          }, 300, function() {
            modelDia.remove();
          });
          modelDia.animate({
            opacity: 0
          }, 100);
        };
        closeBtn.on("click", function(event) {
          if(cancelFn) {
            cancelFn();
          }
          destroy();
        });
        var instance = freeboardBaseService(wrap);
        instance.setMode(true);
        if(object.groups) {
          object.layout = object.groups[0].layout;
          delete object.groups;
        }
        if(object.layout) {
          object.layout = object.layout.$remapByChild(function(element) {
            var rs = new cmethod(element);
            rs.submit = function(obj) {
              if(obj.statuc == "cancel") {
                destroy();
              } else {
                if(submitFn) {
                  if(!submitFn(obj, destroy)) {
                    destroy();
                  };
                }
              }
            };
            rs.cancel = function() {
              if(cancelFn) {
                cancelFn();
              }
              destroy();
            };
            return rs;
          });
          instance.renderLayout(object);
        }
        modelDia.addClass("block");
        modelDia.attr("id", "free-board");
        modelDia.css("opacity", 0);
        modelDia.css("position", "absolute");
        modelDia.css("overflow-y", "auto");
        modelDia.animate({
          opacity: 1
        }, 100);
        content.css("margin-top", 0);
        content.animate({
          "margin-top": config.top
        }, 300);
        var popupLayer = $("[popup_layer]")
        if(popupLayer.size() > 0) {
          popupLayer.after(modelDia)
        } else {
          renderTo.prepend(modelDia);
        }
      };
      var createPopup = function(object, config, data, depth) {
        var cur = this;
        cur.setValue("$POPUPDATA", data);
        config = config || {};
        var renderTo = config.renderTo || $("body");
        var showcloseBtn = config.closeBtn;
        var bgOpacity = config.bgOpacity;
        if(bgOpacity == undefined) {
          bgOpacity = .1;
        }
        var submitFn = config.$attr("on/submit");
        var cancelFn = config.$attr("on/cancel");
        var cur = this;
        var outter = $("<div></div>");
        outter.attr("popup_layer", "popup_layer");
        var bg = $("<div></div>");
        var wrap = $("<div></div>");
        var closeBtn = $("<button></button>");
        var span = $("<div></div>");
        bg.attr("id", "popup_background");
        bg.css("position", "fixed");
        bg.css("width", "100vw");
        bg.css("height", "100vh");
        bg.css("background-color", "rgba(0,0,0," + bgOpacity + ")");
        bg.css("top", 0);
        bg.css("left", 0);
        bg.css("z-index", depth || 9999);
        outter.css("z-index", (depth + 1) || 10000);
        if(renderTo == "self") {
          renderTo = cur.getSelfDom();
        }
        if(config.top != undefined) {
          outter.css("top", config.top);
        }
        if(config.left != undefined) {
          outter.css("left", config.left);
        }
        if(config.right != undefined) {
          outter.css("right", config.right);
        }
        if(config.bottom != undefined) {
          outter.css("bottom", config.bottom);
        }
        closeBtn.css("position", "absolute");
        closeBtn.css("right", 5);
        closeBtn.css("top", 5);
        closeBtn.css("z-index", 10);
        closeBtn.addClass("btn-sm btn-default");
        span.addClass("glyphicon glyphicon-remove");
        closeBtn.append(span);
        if(showcloseBtn != false) {
          outter.append(closeBtn);
        }
        outter.append(wrap);
        outter.attr("id", "pp");
        wrap.css("position", "relative");
        wrap.addClass("col-md-12");
        wrap.attr("id", "popup");
        outter.css("position", "absolute");
        outter.css("width", (config.width || "400px"));
        wrap.css("width", "100%");
        wrap.css("padding", "10px");
        wrap.css("background-color", "#fff");
        wrap.css("box-shadow", "1px 1px 10px 1px rgba(0,0,0,.1)");
        var remove = function() {
          outter.animate({
            opacity: 0
          }, 200);
          outter.remove();
          bg.remove();
        }
        closeBtn.on("click", function(event) {
          if(cancelFn) {
            cancelFn();
          }

        });
        bg.on("click", function(event) {
          if(cancelFn) {
            cancelFn();
          }
          outter.remove();
          bg.remove();
        });
        var instance = freeboardBaseService(wrap);
        instance.setMode(true);
        object.layout = object.layout.$remapByChild(function(element) {
          var rs = new cmethod(element);
          rs.submit = function(obj) {
            if(submitFn) {
              submitFn(obj);
            }
            outter.remove();
            bg.remove();
          };
          rs.cancel = function() {
            if(cancelFn) {
              cancelFn();
            }
            outter.remove();
            bg.remove();
          };
          return rs;
        });
        instance.renderLayout(object);
        renderTo.prepend(outter);
        outter.addClass("block");
        outter.css("opacity", 0);
        outter.animate({
          opacity: 1
        }, 100);
        bg.css("opacity", 0);
        bg.animate({
          opacity: 1
        }, 200);
        $("body").append(bg);
      };
      var createOverlay = function(object, config, data, depth) {
        var cur = this;
        cur.setValue("$POPUPDATA", data);
        config = config || {};
        var renderTo = config.renderTo || "self";
        var bgOpacity = config.bgOpacity;
        var submitFn = config.$attr("on/submit");
        var cancelFn = config.$attr("on/cancel");
        var cur = this;
        var outter = $("<div></div>");
        var bg = $("<div></div>");
        var wrap = $("<div></div>");
        var closeBtn = $("<button></button>");
        var span = $("<div></div>");
        outter.css("z-index", (depth + 1) || 50);
        if(renderTo == "self") {
          renderTo = cur.getSelfDom();
        }
        if(config.top != undefined) {
          outter.css("top", config.top);
        }
        if(config.left != undefined) {
          outter.css("left", config.left);
        }
        if(config.right != undefined) {
          outter.css("right", config.right);
        }
        if(config.bottom != undefined) {
          outter.css("bottom", config.bottom);
        }
        outter.append(wrap);
        wrap.css("position", "relative");
        wrap.addClass("col-md-12");
        wrap.attr("id", "popup");
        outter.css("position", "absolute");
        outter.css("width", (config.width || "400px"));
        wrap.css("width", "100%");
        bg.append(outter);
        var instance = freeboardBaseService(wrap);
        instance.setMode(true);
        object.layout = object.layout.$remapByChild(function(element) {
          var rs = new cmethod(element);
          rs.submit = function(obj) {
            if(submitFn) {
              submitFn(obj);
            }
            outter.remove();
            bg.remove();
          };
          rs.cancel = function() {
            if(cancelFn) {
              cancelFn();
            }
            outter.remove();
            bg.remove();
          };
          return rs;
        });
        instance.renderLayout(object);
        outter.addClass("block")
        renderTo.prepend(outter);
      };
      var toString = function(obj) {
        if(typeof obj == "function") {
          return obj.toString();
        } else if(typeof obj == null) {
          return "null";
        } else if(typeof obj == "object") {
          return JSON.stringify(obj, null, 2);
        } else if(typeof obj == "string") {
          return obj;
        } else if(typeof obj == "number") {
          return obj + "";
        } else if(typeof obj == undefined) {
          return "undefined";
        } else {
          return "无效字符"
        }
      };
      cmethod.prototype.getRootScope = function(attr) {
        if(attr) {
          return rootScope.$$childHead[attr];
        } else {
          return rootScope.$$childHead;
        };
      };
      cmethod.prototype.topDateString = function(diff, format) {
        var cur = this;
        var regexp = [{
          exp: /d+/g,
          divide: 24 * 3600 * 1000
        }, {
          exp: /h+/g,
          divide: 3600 * 1000
        }, {
          exp: /n+/g,
          divide: 60 * 1000
        }, {
          exp: /s+/g,
          divide: 60
        }];
        var inx = 0
        var repeat = function(inx, rest) {
          if(regexp[inx]) {
            var fd = regexp[inx].exp.exec(format);
            if(fd) {
              var num = Math.floor(rest / regexp[inx].divide);
              rest = rest % regexp[inx].divide;
              format = format.replace(regexp[inx].exp, num + "");
            }
            repeat(inx + 1, rest);
          }
        }
        repeat(inx, diff);
        return format;
      };
      /**
       * 获得模板的属性
       * 注意：首先查看缓存中是否存在
       * @param {Object} modelId
       * @param {Object} callback
       */
      cmethod.prototype.getAttrsByModelId = function (modelId, callback) {
        resourceUIService.getAttrsByModelId(modelId, function (data) {
          if (data.code == 0) {
            callback(data.data);
          }
        })
      }
      /**
       * 获得模板的数据项
       * 注意：首先查看缓存中是否存在
       * @param {Object} modelId
       * @param {Object} callback
       */
      cmethod.prototype.getDataItemsByModelId = function(modelId, callback,exinclude) {
        //-1表示查询所有的模版上的KPI
        var include = [
          "domainPath",
          "granularity",
          "granularityUnit",
          "icon",
          "id",
          "label",
          "modelId",
          "modelIdList",
          "name",
          "range",
          "unit",
          "uid",
          "type"
        ];
        include = exinclude?exinclude:include;
        var includeFields = "includeFields=" + include.toString();
        resourceUIService.getDataItemsByModelId(modelId, function(data) {
          if(data.code == 0) {
            callback(data.data);
          }
        },includeFields)
      };
      /**
       * 全局配置中保存域、客户、项目和设备同视图之间的关系
       * @param {Object} domaintree
       */
      cmethod.prototype.saveDomainAreaLineTree = function(domaintree) {
        var cur = this;
        var mapFun = function(node) {
          return {
            id: node.id,
            label: node.label,
            view: {
              viewId: node.view.viewId,
              viewTitle: node.view.viewTitle
            }
          }
        };
        var view = domaintree.filterNode(function(node) {
          return node.view;
        })
        var domains = domaintree.filterNode(function(node) {
          return node.resourceType == "domain" && node.view;
        }).map(mapFun);
        var customers = domaintree.filterNode(function(node) {
          return node.resourceType == "customer" && node.view;
        }).map(mapFun);
        var projects = domaintree.filterNode(function(node) {
          return node.resourceType == "project" && node.view;
        }).map(mapFun);
        var devices = domaintree.filterNode(function(node) {
          return node.resourceType == "device" && node.view;
        }).map(mapFun);
        var rs = {};
        if(domains.length > 0) {
          rs['domains'] = domains
        }
        if(customers.length > 0) {
          rs['customers'] = customers
        }
        if(projects.length > 0) {
          rs['projects'] = projects
        }
        if(devices.length > 0) {
          rs['devices'] = devices
        }
        cur.saveEditorStatus("DomainAreaLineTree", rs);
      };
      /**
       * 获得域、客户、项目和设备的告警状态
       * 更重要的是这里缓存了所有的设备
       * @param {Object} callback
       */
      cmethod.prototype.getDomainAreaLineTree_alertStatus = function(callback) {
        var cur = this;
        var run = function(domaintree) {
          var ci = [];
          domaintree.traverse(function(node) {
            node.status = 0;
            node.icon = "tag tag-green";
            ci.push(node.id);
          });
          var kpi = [999999];
          var getValueBack = function(valueList) {
            domaintree.traverse(function(node) {
              var find = valueList.find(function(elem) {
                return node.id == elem.nodeId
              });
              if(find) {
                node.status = find.value;
                if(node.status == 2) {
                  node.icon = "tag tag-yellow";
                } else if(node.status == 3) {
                  node.icon = "tag tag-orange";
                } else if(node.status == 4) {
                  node.icon = "tag tag-red";
                } else {
                  node.icon = "tag tag-green";
                }
                if(node.$trigger) {
                  node.$trigger("statusChanged", node);
                }
              }
            });
          }
          cur.webSocket(ci, kpi, function(data) {
            getValueBack([data]);
            //domaintree.update();
          });
          cur.getKpiValueCi(ci, kpi, function(valueList) {
            getValueBack(valueList)
            domainAreaLineTree_alertStatus = domaintree;
            callback(domainAreaLineTree_alertStatus);
          }, {
            isRealTimeData: true
          });
        };
        //如果存在有状态的缓存，则返回
        if(domainAreaLineTree_alertStatus) {
          callback(domainAreaLineTree_alertStatus);
        } else {
          //如果不存在域、客户、项目和设备的缓存，则加载
          if(!domainAreaLineTree) {
            cur.getDomainAreaLineTree(function(domaintree) {
              run(domaintree);
            })
          } else {
            run(domainAreaLineTree);
          }
        }
      };
      /**
       * 实现域、客户、项目和设备的缓存
       * @param {Object} callback
       */
      cmethod.prototype.getDomainAreaLineTree = function(callback) {
        var cur = this;

        function sortByNumber(a, b) {
          var val1 = a.$attr("values/number") || 10000000000;
          var val2 = b.$attr("values/number") || 10000000001;
          return val1 - val2;
        }

        function sortByNumberMachineNo(a, b) {
          var val1 = a.$attr("values/number");
          var val2 = b.$attr("values/number");

          function getMaxUnmber(variable) {
            var maxLength = 0;
            var ret = regeExp.exec(variable.label);
            while(ret != null) {
              var num = ret[0].length;
              if(num > maxLength) {
                maxLength = num;
              }
              ret = regeExp.exec(variable.label)
            }
            return maxLength;
          }

          function addZeroBefore(word) {
            var dif = max - word.length;
            for(var i = 0; i < dif; i++) {
              word = "0" + word;
            }
            return word;
          }

          if(val1 || val2) {
            val1 = val1 || 10000000000;
            val2 = val2 || 10000000001;
            return val1 - val2;
          } else {
            var regeExp = new RegExp("/\\d+/", "g");
            var mnum1 = getMaxUnmber(a);
            var mnum2 = getMaxUnmber(b);
            var max = Math.max(mnum1, mnum2);
            var la = a.label.replace(regeExp, function(word) {
              return addZeroBefore(word);
            });
            var lb = b.label.replace(regeExp, function(word) {
              return addZeroBefore(word);
            });

            return la > lb ? 1 : -1;
          }
        }

        function clickFn() {
          var node = this;
          var main = cur.getParameter("main");
          var path = node.$location;
          var ROLE = cur.getValue("global/ROLE");
          if(node.$attr("view/viewId") || node.$attr("_view/viewId") || !node.parentID) {
            if(ROLE != 4) {
              cur.setParameter("id", node.id);
              if(node.externalDevId) {
                cur.setParameter("deviceCode", node.externalDevId)
              }
              cur.trigger("pathChange", path);
              cur.trigger("treeSelect", node.id);
            } else {
              var param = {
                main: [0, path],
                id: node.id
              };
              if(node.externalDevId) {
                param.externalDevId = node.externalDevId
              }
              cur.navigateTo("index", param, "self");
            }
          } else {
            cur.growl("暂无可展示信息");
          }
        }

        function run(tree, runCallback) {
          require(['toolkit/itree/tree-data-handler'], function(treeDataHandler) {
            //处理域的树
            cur.queryDomainTree(function(data) {
              var domaintree = treeDataHandler.init(data[0], {
                children: "domainInfos",
                traverse: function(node) {
                  node.click = clickFn;
                  node.resourceType = "domain";
                  if(node.domainInfos) {
                    node.domainInfos.sort(sortByNumber);
                    node.children = node.domainInfos;
                    node.$location = node.parentID ? "navigate" : "index";
                  } else {
                    node.$location = "factory";
                  }
                  tree.domains = tree.domains || [];
                  var find = tree.domains.find(function(domain) {
                    return domain.id == node.id;
                  });
                  if(find) {
                    node.view = find.view;
                  }
                }
              });
              //获得客户，下挂到域树上
              cur.getResourceByModelId(301, function(customers) {
                customers.sort(sortByNumber);
                /*这里处理是说第一次进来的时候，如果是第二层，那么就选中产线，有问题
                 var main = cur.getParameter("main");
                 if(main == 1) {
                 cur.setValue("global/resource", customers[0]);
                 }
                 */
                //把客户组织到域下
                var leafNode = domaintree.getLeafNodes();
                for(var i in leafNode) {
                  var filter = customers.filter(function(customer) {
                    customer.click = clickFn;
                    customer.resourceType = "customer";
                    customer.$location = "production";
                    tree.customers = tree.customers || [];
                    var find = tree.customers.find(function(el) {
                      return el.id == customer.id;
                    });
                    if(find) {
                      customer.view = find.view;
                    }
                    return customer.domains.indexOf(leafNode[i].domains) != -1;
                  });
                  if(filter.length > 0) {
                    leafNode[i].updateChildren(filter);
                  }
                }

                //获得项目，下挂到客户树上
                cur.getResourceByModelId(302, function(projs) {
                  projs.sort(sortByNumberMachineNo);
                  //把项目和子项目组合到一起
                  var projects = [];
                  var loopProjects = function(inx, project) {
                    project.resourceType = "project";
                    project.click = clickFn;
                    tree.projects = tree.projects || [];
                    var findView = tree.projects.find(function(el) {
                      return el.id == project.id;
                    });
                    if(findView) {
                      project.view = findView.view;
                    }
                    project.$location = project.$location || "devicegroup";
                    var find = projs.find(function(elem) {
                      var id = elem.id;
                      var parentId = $$.seperateParentIdFromDomains(project.domains);
                      return id == parentId;
                    });
                    if(project.label == "第一组辊道电机组") {
                      console.log("第一组辊道电机组", find);
                    }
                    if(find) {
                      find.$location = "virtual";
                      find.children = find.children || [];
                      find.children.push(project);
                    } else {
                      projects.push(project);
                    }
                  }
                  for(var i in projs) {
                    loopProjects(i, projs[i]);
                  }

                  //把项目挂在客户
                  var customerNode = domaintree.filterNode(function(node) {
                    return node.resourceType == "customer"
                  });
                  for(var i in customerNode) {
                    var filter = projects.filter(function(project) {
                      return project.domains.indexOf(customerNode[i].domains) != -1;
                    });
                    if(filter.length > 0) {
                      customerNode[i].updateChildren(filter);
                    }
                  }

                  //把设备挂载到项目层上
                  var deviceshandler = function(devices) {
                    devices.sort(sortByNumberMachineNo);
                    var projectNode = domaintree.filterNode(function(node) {
                      return node.resourceType == "project"
                    });
                    for(var i in projectNode) {
                      var filter = devices.filter(function(device) {
                        device.click = clickFn;
                        device.resourceType = "device";
                        device.$location = "device";
                        if(rootScope.rootModelsDic && rootScope.rootModelsDic[device.modelId] && rootScope.rootModelsDic[device.modelId].attrs) {
                          rootScope.rootModelsDic[device.modelId].attrs.filter(function(attr) {
                            if(attr.name == "viewType") {
                              device.$location = attr.sourceValue;
                            }
                          });
                        }
                        tree.devices = tree.devices || [];
                        var find = tree.devices.find(function(el) {
                          return el.id == device.id;
                        });
                        if(find) {
                          device.view = find.view;
                        }
                        return device.domains == projectNode[i].domains;
                      });
                      if(filter.length > 0) {
                        var firstHasView = filter.find(function(dev) {
                          return dev.view;
                        });
                        if(firstHasView) {
                          for(var k in filter) {
                            if(!filter[k].view) {
                              filter[k]._view = firstHasView.view;
                            }
                          }
                        }
                        projectNode[i].children = projectNode[i].children || [];
                        for(var j in filter) {
                          projectNode[i].addChildren(filter[j]);
                        }
                      }
                    }
                    console.log("domaintree", domaintree);
                    if(typeof runCallback == "function") {
                      domainAreaLineTree = domaintree;
                      runCallback(domaintree);
                    }
                  };

                  //返回的设备处理和缓存
                  var getProjectsDevices = function(projectIds) {
                    var loadProjectIds = [];
                    var loadedDevices = [];
                    if(window.sessionStorage) {
                      var storageDevices;
                      loadProjectIds = projectIds.filter(function(projectId) {
                        var storageDevicesStr = window.sessionStorage.getItem("devices_" + projectId);
                        if(storageDevicesStr) {
                          storageDevices = JSON.parse(storageDevicesStr);
                          //如何这个项目没有初始化过，则加入初始化
                          var find = domaintree.filterNode(function(node) {
                            return node.resourceType == "device" && storageDevices[0].id == node.id;
                          });
                          if(!find || find.length == 0) {
                            loadedDevices = loadedDevices.concat(storageDevices)
                          }
                          return false;
                        }
                        return true;
                      })
                    } else {
                      loadProjectIds = projectIds;
                    }

                    if(loadProjectIds.length > 0 || loadedDevices.length == 0) {
                      var param = {
                        projectIds: loadProjectIds
                      };
                      if(false) { //老版本的返回后过滤
                        cur.getDevicesByCondition(param, function(devices) {
                          //返回的devices太大，删除不需要的属性缓存，但是处理太耗费时间了
                          var attrStr = "resourceType,groups,category,customerId,domainPath,domains,externalDevId,id,label,modelId,sn,values";
                          var accessStr = "instance,dataItemId,kpiId,kpiName,specialtyProp";
                          var devicesDic = {};
                          for(var x = 0; x < devices.length; x++) {
                            if(!devicesDic[devices[x].projectId]) devicesDic[devices[x].projectId] = [];
                            devicesDic[devices[x].projectId].push(devices[x]);

                            for(var k in devices[x]) {
                              if(attrStr.search(k) == -1) {
                                if(k == "physicalConfig") {
                                  for(var g in devices[x][k]) {
                                    if(g != "accessConfigs") {
                                      delete devices[x][k][g];
                                    } else {
                                      for(var y = 0; y < devices[x][k][g].length; y++) {
                                        for(var q in devices[x][k][g][y]) {
                                          if(accessStr.search(q) == -1) {
                                            delete devices[x][k][g][y][q];
                                          }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  delete devices[x][k];
                                }
                              }
                            }
                          }

                          if(window.sessionStorage) {
                            for(var pid in devicesDic) {
                              window.sessionStorage.setItem("devices_" + pid, JSON.stringify(devicesDic[pid]))
                            }
                          }
                          if(loadedDevices.length > 0) {
                            devices = devices.concat(loadedDevices);
                          }
                          deviceshandler(devices);
                        });
                      } else {
                        var include = [
                          "resourceType",
                          "groups",
                          "category",
                          "customerId",
                          "projectId",
                          "domainPath",
                          "domains",
                          "externalDevId",
                          "id",
                          "label",
                          "modelId",
                          "sn",
                          "values.MeasurePointLocate",
                          "values.OfflinePerson",
                          "values.JoinPersonList",
                          "physicalConfig.accessConfigs.instance",
                          "physicalConfig.accessConfigs.dataItemId",
                          "physicalConfig.accessConfigs.kpiId",
                          "physicalConfig.accessConfigs.kpiName",
                          "physicalConfig.accessConfigs.specialtyProp"
                        ];
                        var includeFields = "includeFields=" + include.toString();
                        cur.getDevicesByCondition(param, function(devices) {
                          var devicesDic = {};
                          for(var x = 0; x < devices.length; x++) {
                            if(!devicesDic[devices[x].projectId]) devicesDic[devices[x].projectId] = [];
                            devicesDic[devices[x].projectId].push(devices[x]);
                          }
                          try {
                            if(window.sessionStorage) {
                              for(var pid in devicesDic) {
                                window.sessionStorage.setItem("devices_" + pid, JSON.stringify(devicesDic[pid]))
                              }
                            }
                          } catch(e) {
                            console.log(e);
                          } finally {

                          }

                          if(loadedDevices.length > 0) {
                            devices = devices.concat(loadedDevices);
                          }
                          deviceshandler(devices);
                        }, includeFields);
                      }
                    } else if(loadedDevices.length > 0) {
                      deviceshandler(loadedDevices);
                    }
                  };

                  //设备数上点击的时候，仅会有projectId
                  cur.on("pathChange", function(evt) {
                    if(evt == "devicegroup") {
                      var nodeId = cur.getParameter("id");
                      var projectNode = projs.find(function(el) {
                        return el.id == nodeId;
                      });
                      cur.setValue("global/resource", projectNode);
                      getProjectsDevices([nodeId])
                    }
                  });

                  //初始化通过项目级IDs
                  cur.on("loadDevicesFromProjectIds", function(evt) {
                    if(evt && evt.length > 0) {
                      var nodeIds = [];
                      for(var i = 0; i < evt.length; i++) {
                        nodeIds.push(evt[i].id)
                      }
                      getProjectsDevices(nodeIds)
                    }
                  });

                  //初始化通过客户级IDs
                  cur.on("loadDevicesFromCustomerIds", function(evt) {

                  });

                  //初始化加载第一个项目下的设备
                  //                getProjectsDevices([projects[0].id]);
                  //不缓存
                  getProjectsDevices([]);
                })
              })
            });
          });
        }

        //如果存在了缓存，那么直接返回缓存
        if(!domainAreaLineTree) {
          //这里getDomainAreaLineTree是变量不是方法
          if(getDomainAreaLineTree == undefined) {
            getDomainAreaLineTree = function(callback) {
              treeCallback.push(callback);
            };
            //获得保存在全局配置中的客户、项目、设备视图等信息
            cur.getEditorStatus("DomainAreaLineTree", function(tree) {
              run(tree || {}, function() {
                for(var i in treeCallback) {
                  treeCallback[i](domainAreaLineTree);
                }
                callback(domainAreaLineTree);
              });
            });
          } else {
            getDomainAreaLineTree(function() {
              callback(domainAreaLineTree);
            })
          }
        } else {
          callback(domainAreaLineTree)
        }
      };
      cmethod.prototype.fillEmpty = function(arr) {
        var loop = function(inx, arr) {
          inx = parseInt(inx);
          if(!arr[inx]) {
            var binx = inx;
            var einx = inx;
            var start = {
              value: 0
            };
            var end = {
              value: 0
            };
            binx--;
            while(binx >= 0) {
              if(arr[binx] != null) {
                start = arr[binx];
                break;
              } else {
                binx--;
              }
            }
            einx++;
            while(einx < arr.length) {
              if(arr[einx] != null) {
                end = arr[einx];
                break;
              } else {
                einx++;
              }
            }
            arr[inx] = {
              value: (start.value + end.value) * (inx - binx) / (einx - binx)
            }
          }
        };
        for(var i in arr) {
          loop(i, arr);
        }
      }
      cmethod.prototype.getDateHandler = cmethod.prototype.dateHandler = function(dateString) {
        var dh = dateHandler.init(dateString);
        return dh;
      };
      cmethod.prototype.reStructSeries = function(returnData) {
        var cur = this;
        var removeDuplicate = [];
        for(var i in returnData) {
          var some = removeDuplicate.some(function(elem) {
            return elem.kpiCode == returnData[i].kpiCode &&
              elem.instance == returnData[i].instance &&
              elem.arisingTime == returnData[i].arisingTime
          });
          if(!some) {
            removeDuplicate.push(returnData[i]);
          }
        }
        returnData = removeDuplicate.map(function(elem) {
          elem.time = dateHandler.init(elem.arisingTime);
          return elem;
        });
        var sortByTIme = function(a, b) {
          var t1 = a.time.getTime();
          var t2 = b.time.getTime();
          return t1 - t2;
        };
        returnData.sort(sortByTIme);
        var rs = returnData.reduce(function(a, b) {
          var kpiCode = b.kpiCode;
          var ins = b.instance;
          var attr = kpiCode + "_" + ins;
          a[attr] = a[attr] || [];
          a[attr].push(b);
          return a;
        }, {});
        var getMinGap = function(arr) {
          var min = 100000000000000000000;
          arr.reduce(function(a, b) {
            var m = b.time.minus(a.time);
            if(m == 0) {

            }
            if(m < min) {
              min = m;
            }
            return b;
          });
          return min;
        };
        var step = 10000000000000000000;
        for(var i in rs) {
          var minGap = getMinGap(rs[i]);
          if(minGap < step) {
            step = minGap;
          }
        }
        var startTime = returnData[0].time;
        var endTime = returnData[returnData.length - 1].time;
        var xAxis = [];
        while(startTime.before(endTime)) {
          xAxis.push(startTime.clone());
          startTime.addTimeStamp(step);
        }
        startTime.addTimeStamp(step);
        xAxis.push(startTime.clone());
        for(var i in rs) {
          var dt = [];
          xAxis.reduce(function(a, b) {
            var time1 = a.getTime();
            var time2 = b.getTime();
            var find = rs[i].find(function(elem) {
              var time = elem.time.getTime();
              return time >= time1 && time < time2;
            });
            if(find) {
              dt.push(find);
            } else {
              dt.push(null);
            }
            return b;
          })
          rs[i] = cur.fillEmpty(dt);
        }
        return {
          series: rs,
          xAxis: xAxis
        }
      };
      cmethod.prototype.off = function(eventName, callback) {
        if(!eventName) return;
        var str = eventName.split(".")[0];
        var cls = eventName.split(".")[1];
        if(cls) {
          if(events[str]) {
            delete events[str][cls];
          }
        } else {
          delete events[str];
        }

      };
      cmethod.prototype.on = function(eventName, callback) {
        if(!eventName) return;
        var str = eventName.split(".")[0];
        var cls = eventName.split(".")[1];
        if(!events[str]) {
          events[str] = {};
        }
        cls = cls || "$GENERAL";
        if(!events[str][cls]) {
          events[str][cls] = [];
        }
        events[str][cls].push(callback);
      };
      cmethod.prototype.getEvents = function() {
        return events;
      };
      cmethod.prototype.trigger = function(eventName, data) {
        if(!eventName) return;
        var str = eventName.split(".")[0];
        var cls = eventName.split(".")[1];
        if(events[str]) {
          if(cls) {
            for(var i in events.$attr(str + "/" + cls)) {
              events.$attr(str + "/" + cls)[i](data);
            }
          } else {
            for(var i in events[str]) {
              for(var j in events[str][i]) {
                var fun = events[str][i][j];
                fun(data);
              }
            }
          }
        }
      };
      cmethod.prototype.uploadFile1 = function(file, config, callback) {
        config = config || {};
        config.params = []; //设置一个队列，存放返回的内容
        var group = config.group;
        var cur = this;
        var start = function() {
          var fileFormat = config.fileFormat || rootScope.fileFormat || "|jpg|png|jpeg|bmp|gif|svg|";
          var queueLimit = 1;
          var fileMaxSize = 1;
          var urlParam = 'api/rest/upload/resourceFileUIService/uploadResourceFile'; //改成可以定义上传路径的接口
          if(config.url) {
            urlParam = config.url;
          }
          var uploader = new FileUploader({
            url: configUIService.origin + '/' + urlParam + '',
            withCredentials: true
          });
          uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
              var nameAry = item.name.split(".");
              var type = nameAry[nameAry.length - 1];
              if(fileFormat.indexOf(type) == -1) {
                growl.warning("文件格式仅支持" + fileFormat + "文件，请重新选择", {});
                return false;
              }
              if((item.size / 1024) > fileMaxSize * 10000) {
                growl.warning("您选择的文件大于" + fileMaxSize + "0M，请重新选择", {});
                return false;
              }
              return true;
            }
          });
          uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
          };
          uploader.onCompleteItem = function(fileItem, response, status, headers) {
            if(response && response.code == 0) {
              var obj = {
                value: {}
              };
              obj.label = fileItem.file.name;
              obj.qualifiedName = response.data.qualifiedName;
              obj.value.qualifiedName = response.data.qualifiedName;
              config.params.push(obj);
            } else {
              growl.error("操作异常了，尝试重新刷新", {});
            }
          };
          uploader.clearQueue();
          uploader.addToQueue(file);
          uploader.queue.forEach(function(que) {
            if(config.formData) {
              que.formData = [config.formData];
            } else {
              que.formData = [{
                resourceId: 0,
                value: 'images/dashboardImage'
              }];
            }
          });
          uploader.onCompleteAll = function() {
            uploader.clearQueue();
            callback(config.params);
          };
          uploader.uploadAll();
        };
        if(group) {
          cur.getAllConfigGroups(function(configGroups) {
            var some = configGroups.some(function(elem) {
              return elem.name == group;
            });
            if(some) {
              start();
            } else {
              cur.saveConfigGroup({
                label: "图片缓存(" + group + ")",
                name: group
              }, function(event) {
                start();
              })
            }
          })
        } else {
          start();
        }
      };
      cmethod.prototype.getKpiTypeByFilter = function(param, callback) {
        resourceUIService.getKpiTypeByFilter(param, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      }
      cmethod.prototype.uploadResourceFile = function() {
        var cur = this;
        var service = ""
        cur.postService("resourceFileUIService", "uploadResourceFile")
      }
      cmethod.prototype.toFix = function(str, num) {
        num = num || 4;
        str = str || "0";
        var cur = this;
        var number = Number(str);
        var le = Math.pow(10, num);
        var res = parseInt(number * le) / le + "";
        var len = res.split(".")[1] || "";
        if(len == "") {
          res += ".";
        }
        for(var i = 0; i < num - len.length; i++) {
          res += "0";
        }
        return res;
      };
      cmethod.prototype.uploadFile = function(file, config, callback) {
        config = config || {};
        var group = config.group;
        var cur = this;
        var start = function() {
          var param = config.config || {
            domainPath: "",
            groupName: group || "dashboardImage",
            id: 0,
            invalid: false,
            key: "",
            keyDesc: "",
            label: "",
            value: ""
          };
          var api = config.api || {
            service: "resourceFileUIService",
            method: "uploadResourceFile",
            fun: "uploadConfig"
          };
          api.fun = "upload"; //宝钢用
          var fileFormat = config.fileFormat || rootScope.fileFormat || "|jpg|png|jpeg|bmp|gif|svg|";
          var queueLimit = 1;
          var fileMaxSize = 10;
          var uploader = new FileUploader({
            url: configUIService.origin + '/api/rest/' + api.fun + '/' + api.service + '/' + api.method,
            withCredentials: true
          });
          uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
              var nameAry = item.name.split(".");
              var type = nameAry[nameAry.length - 1];
              if(fileFormat.indexOf(type) == -1) {
                growl.warning("文件格式仅支持" + fileFormat + "文件，请重新选择", {});
                return false;
              }
              if((item.size / 1024) > fileMaxSize * 1000) {
                growl.warning("您选择的文件大于" + fileMaxSize + "M，请重新选择", {});
                return false;
              }
              return true;
            }
          });
          uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
          };
          uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', response);
            if(response) {
              if(response.code == 0) {
                var url = response.data;
                param.value = url;
                growl.success("图片上传成功", {});
                configUIService.saveConfig(param, function(resultObj) {
                  callback(resultObj);
                });
              } else {
                growl.error(response.message, {});
              }
            } else {
              growl.error("操作异常了，尝试重新刷新", {});
            }
          };
          uploader.clearQueue();
          uploader.addToQueue(file);
          if(uploader.queue.length > 0) {
            var que = uploader.queue[0];
            param.label = que.file.name;
            configUIService.saveConfig(param, function(resultObj) {
              if(resultObj.code == 0) {
                var id = resultObj.data.id;
                param.id = id;
                que.formData = [{
                  resourceId: id,
                  value: 'images/dashboardImage',
                  id: id
                }];
                que.upload();
              }
            });
          }
        }
        if(group) {
          cur.getAllConfigGroups(function(configGroups) {
            var some = configGroups.some(function(elem) {
              return elem.name == group;
            });
            if(some) {
              start();
            } else {
              cur.saveConfigGroup({
                label: "图片缓存(" + group + ")",
                name: group
              }, function(event) {
                start();
              })
            }
          })
        }
      }
      cmethod.prototype.init = function(dom, global, config) {
        var render = config.render;
        var cur = this;
        if(typeof render !== "function") {
          throw new Error("render function is needed!!");
        }
        var expression, style, parameters, initFn;
        $$.runExpression(cur.$attr("advance/expression"), function(funRes) {
          if(funRes.code == "0") {
            var fnResult = funRes.data;
            expression = fnResult ? fnResult : {};
          } else {
            expression = {};
            console.log(funRes.message);
            //throw new Error(funRes.message);
          }
        });
        initFn = expression.$attr("on/init");
        style = cur.$attr("style");
        parameters = cur.$attr("parameters");
        if(style) {
          $(dom).css(style);
        }
        cur.render = function(data) {
          dom.append(render(data, expression, style, parameters));
        };
        if(initFn) {
          try {
            initFn({
              target: cur,
              global: global
            })
          } catch(e) {
            cur.growl(e.message);
          }
        } else {
          dom.append(render({}, expression, style, parameters));
        }
      };
      cmethod.prototype.getAlertValueList = function(callback) {
        var param = ['alert', {
          category: 'ci',
          isRealTimeData: true,
          timePeriod: 0,
          kpiCodes: ["alert_code_count"]
        }];
        this.postService("kpiDataFlexService", "getKpiHierarchyValueList", param, function(returnData) {
          if(returnData.code == 0) {
            callback(returnData);
          }
        })
      };
      cmethod.prototype.setSelfDom = function(dom) {
        this.selfDom = dom;
        Object.defineProperty(this, "selfDom", {
          enumerable: false
        })
      };
      cmethod.prototype.getTheme = function(themeStr) {
        if(rootTarget) {
          var themeObj = JSONparse(rootTarget.setting) || {
            theme: "default"
          };
          themeStr = themeStr || "default";
          themeStr = themeStr == "auto" ? themeCompare[themeObj.theme || "default"] : themeStr;
          return themeStr;
        } else {
          return "default";
        }
      };
      cmethod.prototype.getPath = function(path) {
        var find = rootTarget.groups.find(function(elem) {
          return path == elem.path;
        }) || {};
        return find;
      };
      cmethod.prototype.addView = function(param, callback) {
        viewFlexService.addView(param, function(event) {
          if(event.code == 0) {
            if(typeof callback == "function") {
              callback({
                code: 0,
                msg: param.viewTitle + "添加成功",
                data: event.data
              });
            }
          } else {
            if(typeof callback == "function") {
              callback({
                code: event.code,
                msg: param.viewTitle + "添加失败," + event.message
              });
            }
          }
        })
      };
      cmethod.prototype.updateView = function(param, callback) {
        viewFlexService.updateView(param, function(event) {
          if(event.code == 0) {
            if(typeof callback == "function") {
              callback({
                code: 0,
                msg: param.viewTitle + "添加成功",
                data: event.data
              });
            }
          } else {
            if(typeof callback == "function") {
              callback({
                code: event.code,
                msg: param.viewTitle + "添加失败," + event.message
              });
            }
          }
        })
      }
      cmethod.prototype.getSelfDom = function() {
        return this.selfDom;
      };
      cmethod.$cache = cmethod.$cache || {};
      cmethod.prototype.getKpiDic = function() {
        return cmethod.kpiDic;
      }
      cmethod.prototype.getResourceDic = function() {
        return cmethod.resourceDic;
      }
      cmethod.prototype.getTimesByDay = function(num) {
        return num * 24 * 3600 * 100;
      };

      /**
       * 获得全局配置
       * @param {Object} str
       * @param {Object} callback
       */
      cmethod.prototype.getEditorStatus = function(str, callback) {
        var cur = this;
        cur.getConfigsByGroupName(str, function(configs) {
          if(configs.length > 0) {
            callback(JSON.parse(configs[0].value));
          } else {
            callback(null);
          }
        })
      };
      cmethod.prototype.getCurrentUser = function() {
        return userLoginUIService.user
      }

      /**
       * 保存并返回全局配置
       * @param {Object} str
       * @param {Object} val
       */
      cmethod.prototype.saveEditorStatus = function(str, val, sublabel) {
        var cur = this;
        var paramLabel = sublabel ? "设计器缓存" + "_" + sublabel : "设计器缓存";
        var saveConfig = function(config) {
          var param = {
            label: paramLabel,
            value: JSON.stringify(val),
            groupName: str
          };
          if(config) {
            param.id = config.id
          }
          cur.saveConfig(param, function(event) {})
        };
        var start = function() {
          cur.getConfigsByGroupName(str, function(configs) {
            if(configs.length == 0) {
              saveConfig()
            } else {
              saveConfig(configs[0]);
            }
          })
        };
        cur.getAllConfigGroups(function(configGroups) {
          var some = configGroups.some(function(elem) {
            return elem.name == str;
          });
          if(!some) {
            cur.saveConfigGroup({
              label: paramLabel,
              name: str
            }, function(event) {
              start();
            })
          } else {
            start();
          }
        })
      };
      cmethod.prototype.splitData = function(valueList) {
        var times = valueList.map(function(elem) {
          return new Date(elem.arisingTime).getTime();
        });
        var timeSplit = times.reduce(function(a, b) {
          if(a.indexOf(b) == -1) {
            a.push(b);
          }
          return a;
        }, []);
        var structure = valueList.reduce(function(a, b) {
          var attr = b.nodeId + ":" + b.kpiCode;
          if(!a[attr]) {
            a[attr] = [];
          } else {
            a[attr].push({
              time: new Date(b.arisingTime).getTime(),
              value: b.value
            })
          }
          return a;
        }, {});
        var inputEmpty = function(arr) {
          var rs = [];
          for(var i in timeSplit) {
            var find = arr.find(function(elem) {
              return elem.time == times[i];
            })
            if(find) {
              rs.push(find);
            } else {
              rs.push({
                value: '-',
                time: timeSplit[i]
              })
            }
          }
          return rs;
        };
        for(var i in structure) {
          structure[i] = inputEmpty(structure[i]);
        }
        structure.times = timeSplit;
        return structure;
      };
      cmethod.prototype.createMsgBox = function(config) {
        var cur = this;
        var path = "../localdb/echartTemplate/msgbox.json";
        var run = function(data) {
          createSystemPopup.call(cur, data, {
            width: config.width || "600px",
            title: config.title,
            on: config.on
          }, {
            text: config.message
          }, 100002);
        };
        Info.get(path, function(template) {
          window[path] = template;
          run(window[path]);
        });
      };
      cmethod.prototype.setConsoleText = function(str) {
        var cur = this;
        cur.setValue("$CONSOLELOG", "");
      };
      cmethod.prototype.console = function(obj, commontery) {
        var cur = this;
        var path = "../../localdb/echartTemplate/console.json";
        var oldConsole = cur.getValue("$CONSOLELOG") || "";
        var createUnderscore = function(num) {
          var rs = "";
          for(var i = 0; i < num; i++) {
            rs += "-"
          }
          return rs;
        };
        cur.setValue("$CONSOLELOG", oldConsole + "//" + createUnderscore(40) + (commontery || "") + createUnderscore(40) + "\n" + "console.log = " + toString(obj) + "\n//" + createUnderscore(100) + "\n");
        var run = function(data) {
          if(route.current.$$route.controller == "freeStyleCtrl") {
            createPopup.call(cur, data, {
              width: "100vw",
              bottom: 0
            }, cur.getValue("$CONSOLELOG"), 100002);
          }
        };
        Info.get(path, function(template) {
          window[path] = template;
          run(window[path]);
        });
      };

      cmethod.prototype.createSystemPopupByViewId = function(viewId, config, dt) {
        var cur = this;
        cur.getViewById(viewId, function(view) {
          var json = $$.getViewContent(view);
          if(json) {
            //createPopup.call(cur, json, config, data);
            createSystemPopup.call(cur, json, {
              width: config.width || "600px",
              title: config.title,
              on: config.on
            }, dt, 100002);
          }
        });
      }
      cmethod.prototype.createSystemPopupByLocalPath = function(path, config, dt) {
        var cur = this;
        var root = cur;
        while(root.parent) {
          root = root.parent
        }
        var groups = root.root.groups;
        var find = groups.find(function(elem) {
          return elem.path == path;
        }) || {};
        var run = function(data) {
          createSystemPopup.call(cur, data, {
            width: config.width || "600px",
            title: config.title,
            top: config.top || "110px",
            on: config.on
          }, dt, 100002);
        };
        run(find);
      }
      cmethod.prototype.createSystemPopupByJsonName = function(jsonName, config, dt) {
        var cur = this;
        var path = "../localdb/echartTemplate/" + jsonName + ".json";
        var run = function(data) {
          createSystemPopup.call(cur, data, {
            width: config.width || "600px",
            title: config.title,
            on: config.on
          }, dt, 100002);
        };
        if(!window[path]) {
          Info.get(path, function(template) {
            window[path] = template;
            run(window[path]);
          });
        } else {
          run(window[path]);
        }
      }
      cmethod.prototype.console = function(obj, commontery) {
        var cur = this;
        var path = "../localdb/echartTemplate/console.json";
        var oldConsole = cur.getValue("$CONSOLELOG") || "";
        var createUnderscore = function(num) {
          var rs = "";
          for(var i = 0; i < num; i++) {
            rs += "-"
          }
          return rs;
        };
        cur.setValue("$CONSOLELOG", oldConsole + "//" + createUnderscore(40) + (commontery || "") + createUnderscore(40) + "\n" + "console.log = " + toString(obj) + "\n//" + createUnderscore(100) + "\n");
        var run = function(data) {
          if(route.current.$$route.controller == "freeStyleCtrl") {
            createPopup.call(cur, data, {
              width: "100vw",
              bottom: 0
            }, cur.getValue("$CONSOLELOG"), 100002);
          }
        };
        Info.get(path, function(template) {
          window[path] = template;
          run(window[path]);
        });
      };
      cmethod.prototype.Info = function(path, callback) {
        Info.get(path, function(template) {
          callback(template)
        });
      }
      cmethod.prototype.closePopup = function() {

      }
      cmethod.prototype.getTimesByMonth = function(num) {
        return num * 30 * 24 * 3600 * 100;
      };
      cmethod.prototype.setRootTarget = function(rt) {
        rootTarget = rt;
      };
      cmethod.prototype.getRootTarget = function() {
        return rootTarget;
      };
      cmethod.prototype.getKpiValueList = function(ci, kpi, time, callback, extension) {
        var removeSameValue = function(arr) {
          var rs = [];
          for(var i in arr) {
            if(rs.indexOf(arr[i]) == -1) {
              rs.push(arr[i]);
            }
          }
          return rs;
        }
        var param = {
          nodeIds: removeSameValue(ci),
          kpiCodes: removeSameValue(kpi)
        };
        if(time) {
          param.timePeriod = time
        }
        if(0 == time) {
          param.timePeriod = 0
        }
        param = param.$extension(extension);
        kpiDataService.getKpiValList(param, function(event) {
          if(event.code == 0) {
            callback(event.data);
          } else {
            callback([]);
          }
        })
      };
      cmethod.prototype.getKpiValueCi = function(ci, kpi, callback, extension) {
        serviceCenterService.getValues(ci, kpi, extension).then(function(data) {
          if (data && data.length > 0) {
            callback(data);
          }
          //callback(data[0]); 这个处理方式不对。有BUG时在callback的地方处理
        })
      };
      cmethod.prototype.createPopupBypath = function(path, config, data, isLocal) {
        var cur = this;
        var targetRoot = cur.getRootTarget();
        var find = targetRoot.groups.find(function(elem) {
          return elem.path == path;
        });
        if(route.current.$$route.controller != "freeBoardCtrl") {
          if(find) {
            var type = config.theme || "default";
            if(type == "default") {
              createPopup.call(cur, find, config, data);
            } else if(type == "system") {
              createSystemPopup.call(cur, find, config, data);
            } else {
              createPopup.call(cur, find, config, data);
            }
          }
        }
      };
      cmethod.prototype.readImageFile = function(file, callback) {
        if(typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
          var reader = new FileReader();
          reader.onload = function(evt) {
            callback(evt.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
      cmethod.prototype.createOverlayBypath = function(path, config, data, isLocal) {
        var cur = this;
        var targetRoot = cur.getRootTarget();
        var find = targetRoot.groups.find(function(elem) {
          return elem.path == path;
        });
        if(route.current.$$route.controller != "freeBoardCtrl") {
          if(find) {
            createOverlay.call(cur, find, config, data);
          }
        }
      };
      cmethod.prototype.getPopupData = function() {
        return this.getValue("$POPUPDATA");
      };
      cmethod.prototype.createPopupByViewId = function(id, config, data) {
        var cur = this;
        cur.getViewById(id, function(view) {
          var json = $$.getViewContent(view);
          if(json) {
            createPopup.call(cur, json, config, data);
          }
        });
      };
      cmethod.prototype.getDataHandlers = function(ci, kpi, callback, extension) {
        return [{
          id: 0,
          label: "不裁剪数据",
          text: "function init(event){\n    var global = event.global;\n    var resources = event.resourceId;\n    var kpis = event.kpiId;\n    var timePeriod = event.timePeriod;\n    var data = event.data;\n    global.fire(\"renderList\", data);\n}"
        }, {
          id: 1,
          label: "适合线图的数据",
          text: "function init(source){\n  var formatter=function(elem){\n    return elem.value;\n   }\n  return source.ci.getSeries(formatter);\n}"
        }, {
          id: 2,
          label: "适合饼图的数据",
          text: "function init(source){\n  var formatter=function(elem){\n    return elem.value;\n   }\n  return source.ci.getSeries(formatter);\n}"
        }, {
          id: 3,
          label: "适合柱图的数据",
          text: "function init(source){\n  var formatter=function(elem){\n    return elem.value;\n   }\n  return source.ci.getSeries(formatter);\n}"
        }, {
          id: 4,
          label: "适合柱图的数据",
          text: "function init(source){\n  var formatter=function(elem){\n    return elem.value;\n   }\n  return source.ci.getSeries(formatter);\n}"
        }];
      };
      cmethod.prototype.barOption = function() {
        return {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        };
      };
      cmethod.prototype.polylineOption = function() {
        return {
          title: {
            text: '一天用电量分布',
            subtext: '纯属虚构'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} W'
            },
            axisPointer: {
              snap: true
            }
          },
          visualMap: {
            show: false,
            dimension: 0,
            pieces: [{
              lte: 6,
              color: 'green'
            }, {
              gt: 6,
              lte: 8,
              color: 'red'
            }, {
              gt: 8,
              lte: 14,
              color: 'green'
            }, {
              gt: 14,
              lte: 17,
              color: 'red'
            }, {
              gt: 17,
              color: 'green'
            }]
          },
          series: [{
            name: '用电量',
            type: 'line',
            smooth: true,
            data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
            markArea: {
              data: [
                [{
                  name: '早高峰',
                  xAxis: '07:30'
                }, {
                  xAxis: '10:00'
                }],
                [{
                  name: '晚高峰',
                  xAxis: '17:30'
                }, {
                  xAxis: '21:15'
                }]
              ]
            }
          }]
        };
      };
      cmethod.prototype.pieOption = function() {
        return {
          title: {
            text: '某站点用户访问来源',
            subtext: '纯属虚构',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{
                value: 335,
                name: '直接访问'
              },
              {
                value: 310,
                name: '邮件营销'
              },
              {
                value: 234,
                name: '联盟广告'
              },
              {
                value: 135,
                name: '视频广告'
              },
              {
                value: 1548,
                name: '搜索引擎'
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };
      };
      cmethod.prototype.scatter3DOption = function() {
        var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a',
          '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'
        ];
        var days = ['1', '2', '3', '4', '5', '6', '7'];
        var data = [
          [12, 0, 10],
          [3, 3, 15],
          [4, 3, 20],
          [10, 1, 12],
          [3, 0, 14]
        ];
        var option = {
          tooltip: {},
          visualMap: {
            right: 0,
            max: 20,
            inRange: {
              color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
          },
          xAxis3D: {
            type: 'category',
            data: hours
          },
          yAxis3D: {
            type: 'category',
            data: days
          },
          zAxis3D: {
            type: 'value'
          },
          grid3D: {
            boxWidth: 160,
            boxHeight: 40,
            boxDepth: 90,
            viewControl: {
              // projection: 'orthographic'
            },
            // environment: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //   offset: 0, color: '#00aaff' // 天空颜色
            // }, {
            //   offset: 0.7, color: '#998866' // 地面颜色
            // }, {
            //   offset: 1, color: '#998866' // 地面颜色
            // }], false),
            splitLine: {
              show: true
            },
            axisPointer: {
              show: true
            },
            light: {
              main: {
                intensity: 1.4,
                //                    shadow: true
              },
              ambient: {
                intensity: 0.3
              }
            }
          },
          series: [{
            name: "散点图",
            type: 'scatter3D',
            symbol: 'arrow',

            //            data: [{
            //                // 数据项的名称
            //                name: '数据1',
            //                // 数据项值
            //                value: [12, 3, 10]
            //            }, {
            //                name: '数据2',
            //                value: [3, 5, 15],
            //                itemStyle:{
            //                    color:[255, 233, 1, 0.5]
            //                }
            //            }],
            data: data.map(function(item) {
              return {
                value: [item[1], item[0], item[2]],
              }
            }),
            shading: 'lambert',

            label: {
              textStyle: {
                fontSize: 12,
                borderWidth: 1
              },
              //                formatter: '{a}: {b}'
            },

            emphasis: {
              label: {
                textStyle: {
                  fontSize: 20,
                  color: '#900'
                }
              },
              itemStyle: {
                color: '#900'
              }
            }
          }]
        };
        return option

      };
      cmethod.prototype.bar3DOption = function() {
        var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a',
          '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'
        ];
        var days = ['1', '2', '3', '4', '5', '6', '7'];
        var data = [
          [12, 0, 10],
          [3, 3, 15],
          [4, 3, 20],
          [10, 1, 12],
          [3, 0, 14]
        ];
        var option = {
          tooltip: {},
          visualMap: {
            max: 20,
            inRange: {
              color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
          },
          xAxis3D: {
            type: 'category',
            data: hours
          },
          yAxis3D: {
            type: 'category',
            data: days
          },
          zAxis3D: {
            type: 'value'
          },
          grid3D: {
            boxWidth: 200,
            boxHeight: 40,
            boxDepth: 90,
            light: {
              main: {
                intensity: 1.2
              },
              ambient: {
                intensity: 0.3
              }
            }
          },
          series: [{
            type: 'bar3D',
            data: data.map(function(item) {
              return {
                value: [item[1], item[0], item[2]]
              }
            }),
            shading: 'color',

            label: {
              show: false,
              textStyle: {
                fontSize: 16,
                borderWidth: 1
              }
            },

            itemStyle: {
              opacity: 0.8
            },

            emphasis: {
              label: {
                textStyle: {
                  fontSize: 20,
                  color: '#900'
                }
              },
              itemStyle: {
                color: '#900'
              }
            }
          }]
        };
        return option
      };
      cmethod.prototype.line3DOption = function() {
        var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a',
          '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'
        ];
        var days = ['1', '2', '3', '4', '5', '6', '7'];
        var data = [
          [12, 0, 10],
          [3, 3, 15],
          [4, 3, 20],
          [10, 1, 12],
          [3, 0, 14]
        ];
        var option = {
          tooltip: {},
          visualMap: {
            max: 20,
            inRange: {
              color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
          },
          xAxis3D: {
            type: 'category',
            data: hours
          },
          yAxis3D: {
            type: 'category',
            data: days
          },
          zAxis3D: {
            type: 'value'
          },
          grid3D: {
            boxWidth: 180,
            boxHeight: 40,
            boxDepth: 90,
            light: {
              main: {
                intensity: 1.2
              },
              ambient: {
                intensity: 0.3
              }
            }
          },
          series: [{
            type: 'line3D',
            data: data.map(function(item) {
              return {
                value: [item[1], item[0], item[2]]
              }
            }),
            shading: 'color',

            label: {
              show: false,
              textStyle: {
                fontSize: 16,
                borderWidth: 1
              }
            },

            itemStyle: {
              opacity: 0.8
            },

            emphasis: {
              label: {
                textStyle: {
                  fontSize: 20,
                  color: '#900'
                }
              },
              itemStyle: {
                color: '#900'
              }
            }
          }]
        };
        return option
      };
      cmethod.prototype.copyToClipBoard = function(dom, str, callback) {
        dom.attr("data-clipboard-text", str);
        setTimeout(function() {
          $$.loadExternalJs(['clipboard'], function(Clipboard) {
            var clipboard = new Clipboard(dom[0]);
            clipboard.on('success', function(e) {
              if(callback) {
                callback();
              }
              e.clearSelection();
            });
            clipboard.on('error', function(e) {
              console.error('Action:', e.action);
              console.error('Trigger:', e.trigger);
            });
          });
        });
      };
      cmethod.prototype.getIcons = function(callback) {
        var path = "../../localdb/bootstrapIcon.json";
        Info.get(path, function(icons) {
          callback(icons);
        });
      };
      cmethod.prototype.getCtrlGroupDemos = function() {
        return [{
          label: "普通文字",
          expression: "expression = {\n  on : {\n    init : function(event){\n      var target = event.target;\n      var global = event.global;\n      var ctrlGroups = [\n       [{\n          type : \"label\",\n          value : \"普通标签\",\n          class : \"col-md-12\"\n        }]\n      ];\n      event.target.render(ctrlGroups);\n    }\n  }\n}"
        }, {
          label: "基本按钮",
          expression: 'expression = {\n  on : {\n    init : function(event){\n      var target = event.target;\n      var global = event.global;\n      var ctrlGroups = [\n       [{\n          type : "button",\n          value : "按钮",\n          icon : "glyphicon glyphicon-search",\n          btnclass : "btn btn-primary",\n          class : "col-md-12",\n          on : {\n            click : function(elem){\n              target.console(elem);\n            }\n          }\n        }]\n      ];\n      event.target.render(ctrlGroups);\n    }\n  }\n}'
        }, {
          label: "按钮组",
          expression: "expression = {\n  on : {\n    init : function(event){\n      var target = event.target;\n      var global = event.global;\n      var ctrlGroups = [\n        [{\n          type : \"buttonGroup\",\n          class : \"col-md-12\",\n          content : [{\n            type : \"button\",\n            value : \"保存\",\n            icon : \"glyphicon glyphicon-save\",\n            btnclass : \"btn btn-primary\",\n            on : {\n              click : function(elem){\n              }\n            }\n          },{\n            type : \"button\",\n            value : \"取消\",\n            icon : \"glyphicon glyphicon-remove\",\n            btnclass : \"btn btn-default\",\n            on : {\n              click : function(elem){\n              }\n            }\n          }]\n        }]\n      ];\n      event.target.render(ctrlGroups);\n    }\n  }\n}"
        }, {
          label: "复制粘贴按钮",
          expression: "expression = {\n  on : {\n    init : function(event){\n      var target = event.target;\n      var global = event.global;\n      var ctrlGroups = [\n       [{\n          type : \"clipboardButton\",\n          value : \"复制到剪切板\",\n          icon : \"glyphicon glyphicon-save\",\n          btnclass : \"btn btn-primary\",\n          clipboardText : \"123456\",\n          class : \"col-md-12\",\n          on : {\n            save : function(elem){\n              target.growl(\"保存到剪切板\");\n            }\n          }\n        }]\n      ];\n      event.target.render(ctrlGroups);\n    }\n  }\n}"
        }, {
          label: "单选下拉框",
          expression: "expression = {\n  on : {\n    init : function(event){\n      var target = event.target;\n      var global = event.global;\n      var options = [{\n        id : 0,\n        label : \"第一条\"\n      },{\n        id : 1,\n        label : \"第二条\"\n      }];\n      var ctrlGroups = [\n        [{\n          type : \"select\",\n          value : 0,\n          class : \"col-md-12\",\n          options : options,\n          format : {\n            id : \"id\",\n            label : \"label\"\n          },\n          on : {\n            change : function(elem){\n              console.log(elem.value)\n            }\n          }\n        }]\n      ];\n      event.target.render(ctrlGroups);\n    }\n  }\n}"
        }, {
          label: "多选下拉框",
          expression: "expression = {\n  on : {\n    init : function(event){\n      var target = event.target;\n      var global = event.global;\n      var options = [{\n        id : 0,\n        label : \"第一条\"\n      },{\n        id : 1,\n        label : \"第二条\"\n      }];\n      var ctrlGroups = [\n        [{\n          type : \"multiSelect\",\n          value : 0,\n          class : \"col-md-12\",\n          options : options,\n          format : {\n            id : \"id\",\n            label : \"label\"\n          },\n          on : {\n            change : function(elem){\n              console.log(elem.value)\n            }\n          }\n        }]\n      ];\n      event.target.render(ctrlGroups);\n    }\n  }\n}"
        }, {
          label: "数结构下拉框",
          expression: "expression = {\n  on : {\n    init : function(event){\n      var target = event.target;\n      var global = event.global;\n      var ctrlGroups = [\n       [{\n          type : \"clipboardButton\",\n          value : \"复制到剪切板\",\n          icon : \"glyphicon glyphicon-save\",\n          btnclass : \"btn btn-primary\",\n          clipboardText : \"123456\",\n          class : \"col-md-12\",\n          on : {\n            save : function(elem){\n              target.growl(\"保存到剪切板\");\n            }\n          }\n        }]\n      ];\n      event.target.render(ctrlGroups);\n    }\n  }\n}"
        }, {
          label: "自动搜索下拉框",
          expression: "expression = {\n  on : {\n    init : function(event){\n      var target = event.target;\n      var global = event.global;\n      var ctrlGroups = [\n       [{\n          type : \"clipboardButton\",\n          value : \"复制到剪切板\",\n          icon : \"glyphicon glyphicon-save\",\n          btnclass : \"btn btn-primary\",\n          clipboardText : \"123456\",\n          class : \"col-md-12\",\n          on : {\n            save : function(elem){\n              target.growl(\"保存到剪切板\");\n            }\n          }\n        }]\n      ];\n      event.target.render(ctrlGroups);\n    }\n  }\n}"
        }]

      };
      cmethod.prototype.triggerSocket = function(config) {
        SwSocket.simuSend(config);
      };
      cmethod.prototype.getToolsMenu = function() {
        /**
                 return [{
          label: "API调用",
          path: "apicall"
        }, {
          label: "绘制自定义视图",
          path: "drawechart"
        }, {
          label: "根据ID查询设备模型信息",
          path: "idSelector"
        }, {
          label: "SCP路径",
          path: "scp"
        },{
          label: "项目模版",
          url: "projectlist"
        },{
          label: "图标样式",
          url: "icon"
        }];*/
        return [{
            label: "API调用",
            url: "apiCall"
          }, {
            label: "绘制自定义视图",
            path: "drawechart"
          },
          /*{
                  label: "根据ID查询设备模型信息",
                  path: "idSelector"
                  }, */
          {
            label: "SCP路径",
            url: "scp"
          }, {
            label: "项目模版",
            url: "projectlist"
          }, {
            label: "图标样式",
            url: "icon"
          }, {
            label: "JS代码转换字符串",
            url: "jstostring"
          }, {
            label: "批量导出导入视图或配置项",
            url: "export"
          }, {
            label: "输入框组",
            url: "ctrlGroupDemo"
          }
        ]
      };
      cmethod.prototype.getHelpMenu = function() {
        return [{
          label: "布局设置",
          pdf: "layout"
        }, {
          label: "组件",
          url: "control",
          children: [{
            label: "常用组件",
            url: "common_ctrl",
            children: [{
              label: "文字",
              pdf: "text"
            }, {
              label: "图片",
              pdf: "image"
            }, {
              label: "控制板1",
              pdf: "control1"
            }, {
              label: "控制板2",
              pdf: "control2"
            }, {
              label: "TAB",
              pdf: "tab"
            }, {
              label: "开关",
              pdf: "switch"
            }]
          }, {
            label: "功能组件",
            url: "functional_ctrl",
            children: [{
              label: "天气信息",
              pdf: "weather"
            }]
          }, {
            label: "视图组件",
            url: "echart_ctrl",
            children: [{
              label: "线图",
              pdf: "line"
            }, {
              label: "饼图",
              pdf: "pie"
            }, {
              label: "柱图",
              pdf: "bar"
            }, {
              label: "仪表盘",
              pdf: "gauge"
            }, {
              label: "散点图",
              pdf: "scatter",
              show: false
            }]
          }, {
            label: "高级组件",
            url: "advance_ctrl",
            children: [{
              label: "百度地图",
              pdf: "baidumap"
            }, {
              label: "视图嵌入",
              pdf: "injector"
            }, {
              label: "轮播组件",
              pdf: "echart_ctrl"
            }, {
              label: "高级图表",
              pdf: "advance_ctrl"
            }, {
              label: "输入框组",
              pdf: "ctrlgroup"
            }, {
              label: "伪TAB样式",
              pdf: "faketab"
            }, {
              label: "重复单元",
              pdf: "repeat"
            }]
          }]
        }, {
          label: "功能模块",
          url: "tool",
          children: [{
            label: "数据统计标签",
            pdf: "advance_ctrl"
          }, {
            label: "百分比状态条",
            pdf: "advance_ctrl"
          }, {
            label: "环比标签",
            pdf: "advance_ctrl"
          }, {
            label: "项目组态",
            pdf: "advance_ctrl"
          }, {
            label: "设备（列表）",
            pdf: "advance_ctrl"
          }, {
            label: "工单（列表）",
            pdf: "advance_ctrl"
          }, {
            label: "告警（列表）",
            pdf: "advance_ctrl"
          }, {
            label: "线图模板",
            pdf: "advance_ctrl"
          }, {
            label: "告警趋势",
            pdf: "advance_ctrl"
          }, {
            label: "设备分布",
            pdf: "advance_ctrl"
          }, {
            label: "地图分布",
            pdf: "advance_ctrl"
          }, {
            label: "设备地图列表",
            pdf: "advance_ctrl"
          }, {
            label: "最近一周告警",
            pdf: "advance_ctrl"
          }]
        }, {
          label: "导入视图",
          pdf: "import"
        }, {
          label: "实例",
          url: "example",
          show: false
        }, {
          label: "API",
          pdf: "commonMethod"
        }]
      };
      cmethod.prototype.getSignalShipInfo = function(id, callback) {
        thridPartyApiService.getSignalShipInfo(id, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        });
      };
      cmethod.prototype.getManyShipInfo = function(ids, callback) {
        thridPartyApiService.getManyShipInfo(ids, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        });
      };
      cmethod.prototype.getShipTrack = function(id, start, end, callback) {
        thridPartyApiService.getShipTrack(id, start, end, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        });
      };
      cmethod.prototype.getAllConfigs = function(callback) {
        configUIService.getAllConfigs(function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        });
      };
      cmethod.prototype.getAllConfigGroups = function(callback) {
        configUIService.getAllConfigGroups(function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        });
      };
      cmethod.prototype.getConfigsByGroupName = function(configGroupName, callback) {
        configUIService.getConfigsByGroupName(configGroupName, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        });
      };
      cmethod.prototype.saveConfig = function(config, callback) {
        configUIService.saveConfig(config, function(event) {
          if(event.code == 0) {
            if(typeof callback == "function") {
              callback({
                code: 0,
                msg: config.label + "添加成功"
              });
            }
          } else {
            if(typeof callback == "function") {
              callback({
                code: event.code,
                msg: config.label + "添加失败,原因" + event.message
              });
            }
          }
        });
      };
      cmethod.prototype.saveConfigGroup = function(configGroup, callback) {
        configUIService.saveConfigGroup(configGroup, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        });
      };
      cmethod.prototype.deleteConfig = function(configId, callback) {
        configUIService.deleteConfig(configId, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        });
      };
      cmethod.prototype.deleteConfigGroup = function(groupId, callback) {
        configUIService.deleteConfigGroup(groupId, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        });
      };
      cmethod.prototype.createInfoHtml = function(obj) {
        var str = "";
        // var str = obj.label + "<br><hr/>";
        window.onclickHandler = function(event) {
          var key = event.target.id + "&" + event.target.name
          if(clickFnDic[key]) {
            clickFnDic[key](clickFnDic[key+"_value"]);
          }
        };
        var createContent = function(cont) {
          return "<label><span>" + cont.label + ":</span><span>" + cont.value + "</span></label><br>";
        };
        var createButton = function(cont) {
          var clickFn = cont.$attr("on/click");
          var key = cont.id + "&" + cont.label;
          clickFnDic[key] = clickFn;
          clickFnDic[key+"_value"] = cont.value;
          var dataBtn = "<button id='" + cont.id + "' name='" + cont.label + "' onclick='onclickHandler(event)'>" + cont.label + "</button>";
          //var dataBtn = "<button id='"+cont.label+"' onclick='fnOK("+cont.value+")'>"+cont.label +"</button>";
          return dataBtn;
        };
        for(var i in obj.content) {
          if(!obj.content[i].type || obj.content[i].type == "label") {
            str += createContent(obj.content[i]);
          } else if(obj.content[i].type == "button") {
            str += createButton(obj.content[i]);
          }
        }
        return str;
      }
      cmethod.prototype.createShipShape = function(width, length, trailWidth, trailLength, headWidth, headLength) {
        var RIGHTOFFSET = .1;
        var leftBottomPoint = [(-width / 2) * trailWidth, -length / 2];
        var rightBottomPoint = [(width / 2) * trailWidth, -length / 2];
        var rightBottomPoint_1 = [(1 - RIGHTOFFSET) * width / 2, (trailLength / 2 - 1) * length / 2];
        var rightlowerPoint = [width / 2, (trailLength - 1) * length / 2];
        var rightupperPoint = [width / 2 * 1.4, (1 / 2 - headLength) * length];
        var rightupperPoint_1 = [(headWidth) / 2 * width, (1 / 2 - headLength / 3) * length];
        var topPoint1 = [width * .1, length / 2 * .99];
        var topPoint = [0, length / 2];
        var topPoint2 = [-width * .1, length / 2 * .99];
        var leftupperPoint_1 = [-(headWidth) / 2 * width, (1 / 2 - headLength / 3) * length];
        var leftupperPoint = [-width / 2 * 1.4, (1 / 2 - headLength) * length];
        var leftlowerPoint = [-width / 2, (trailLength - 1) * length / 2];
        var leftBottomPoint_1 = [-(1 - RIGHTOFFSET) * width / 2, (trailLength / 2 - 1) * length / 2];
        return [leftBottomPoint, rightBottomPoint, rightBottomPoint_1, rightlowerPoint,
          rightupperPoint, rightupperPoint_1, topPoint1, topPoint, topPoint2, leftupperPoint_1,
          leftupperPoint, leftlowerPoint, leftBottomPoint_1, leftBottomPoint
        ];
      };

      cmethod.prototype.renderExcel = function(name, filename, json) {
        require(['table2excel'], function() {
          var table = $("<table></table>");
          table.attr("id", "table2excel");
          var thead = $("<thead></thead>");
          var tbody = $("<tbody></tbody>");
          var loopTr = function(dt) {
            var tr = $("<tr></tr>");
            var loopTd = function(elem) {
              var td = $("<td></td>");
              td.text(elem);
              return td;
            };
            for(var i in dt) {
              tr.append(loopTd(dt[i]));
            }
            return tr;
          }
          var tr = $("<tr></tr>");
          var loopTh = function(number) {
            var th = $("<th></th>");
            th.text(number);
            return th;
          };
          /**
                     for(var i in json[0]){
            thead.append(loopTh(json[0][i]));
          };*/
          for(var i = 0; i < json.length; i++) {
            tbody.append(loopTr(json[i]));
          }
          table.append(thead);
          table.append(tbody);
          //$("body").append(table);
          table.table2excel({
            exclude: ".excludeThisClass",
            name: name,
            filename: filename
          });
        })
      };
      cmethod.prototype.asyncRepeat = function(repeatCall, finish) {
        var self = this;
        var inx = 0;
        var repeat = function(inx) {
          if(self[inx]) {
            repeatCall(inx, self[inx], function() {
              inx++;
              repeat(inx);
            })
          } else {
            finish();
          }
        };
        repeat(inx)
      };

      /**
       * 获得域结构
       * @param {Object} callback
       * @param {Object} isArryLike
       */
      cmethod.prototype.queryDomainTree = function(callback, isArryLike) {
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function(event) {
          var $TreeObj = function(data) {
            this.$clone(data);
          };
          var treeObjToArr = function(data) {
            var result = [];
            var traverse = function(item, parent, level) {
              var to = new $TreeObj(item);
              to.parent = parent;
              to.level = level;
              result.push(to);
              for(var i in item.domainInfos) {
                var m = level + 1;
                traverse(item.domainInfos[i], item, m);
              }
            };
            traverse(event.data[0], null, 0);
            return result;
          };
          if(event.code) {
            if(isArryLike) {
              var to = treeObjToArr(event.data[0]);
              callback(to);
            } else {
              callback(event.data);
            }
          }
        })
      };
      cmethod.prototype.getAlertWord = function(str) {
        var color = "";
        switch(str) {
          case 4:
            color = "危险";
            break;
          case 3:
            color = "警告";
            break;
          case 2:
            color = "注意";
            break;
          case 1:
            color = "正常";
            break;
          default:
            color = "正常";
            break;
        }
        //console.log(color);
        return color;
      };
      cmethod.prototype.getAlertColorPoint = function(status) {
        var color = ""
        switch(status) {
          case 4:
            color = "e74e53";
            break;
          case 3:
            color = "#ee6b1c";
            break;
          case 2:
            color = "#efd709";
            break;
          default:
            color = "#00bc79";
            break;
        }
        return color;
      };
      cmethod.prototype.getAlertColor = function(status) {
        var color = ""
        switch(status) {
          case 4:
            color = "#e74e53";
            break;
          case 3:
            color = "#ee6b1c";
            break;
          case 2:
            color = "#ece417";
            break;
          case 1:
            color = "#00bc79";
            break;
          default:
            color = "#00bc79";
            break;
        }
        return color;
      };
      /**
       * 查出基地/厂部/产线/设备名称
       * 韩星 2018.01.16
       * @param domainPathList 传入domainPath
       */
      cmethod.prototype.getdomainListName = function(domainPathList) {
        var domainList = [];
        for(var i = 0; i < domainPathList.length; i++) {
          cmethod.prototype.getdomainNameHandler(domainPathList[i].domains, domainList);
        }
        return domainList;
      };
      cmethod.prototype.getdomainNameHandler = function(domainPathListStr, domainList) {
        var domainListDic = rootScope.domainListDic;
        var domainPathListSplit = domainPathListStr.split("/");
        domainPathListSplit.forEach(function(domainId) {
          if(domainListDic[domainId]) {
            domainList.push(domainListDic[domainId].label);
          }
        })
        return domainList;
      }
      cmethod.prototype.getCurrentDomainCi = function(callback) {
        var domainPath = userLoginUIService.user.domains;
        var domainId;
        var arr = domainPath.split("/");
        if(arr.length > 1) {
          domainId = arr[arr.length - 2];
        }
        $$.cacheAsyncData.call(resourceUIService.getResourceById, [domainId], function(event) {
          if(event.code == 0) {
            callback(event.data)
          }
        });
        /**
         resourceUIService.getResourceById(domainId, function(event){
          if(event.code == 0){
            callback(event.data)
          }
        })*/
      };
      cmethod.prototype.getDevicesByCondition = function(params, callback, extendstr) {
        /**
        if (!rootScope.$$childHead.menuitems["F07_01"] && !rootScope.$$childHead.menuitems["F07_07"] && !rootScope.$$childHead.menuitems["F07_06"]) {
          //如果拥有F07_01表示是查看所有
          if (rootScope.$$childHead.menuitems["F07_08"] || rootScope.$$childHead.menuitems["F07_09"]) {
            params.values = {diagnosticType: "90"};
          } else if (!rootScope.$$childHead.menuitems["F07_01"]) {
            params.values = {diagnosticType: {"NE": "90"}};
          }
        }
        
        var menuitems = rootScope.$$childHead.menuitems || {};
        if(!menuitems["F07_01"] && !menuitems["F07_07"] && !menuitems["F07_06"]) {
          //如果拥有F07_01表示是查看所有
          if(menuitems["F07_08"] || menuitems["F07_09"]) {
            params.values = {
              diagnosticType: "90"
            };
          } else if(!menuitems["F07_01"]) {
            params.values = {
              diagnosticType: {
                "NE": "90"
              }
            };
          }
        }
        **/
        resourceUIService.getDevicesByCondition(params, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        }, extendstr);
      };
      cmethod.prototype.getCurrentDevices = function(callback) {
        this.getCurrentProject(function(project) {
          if(project) {
            var domainPath = project.domainPath;
            var params = {
              projectId: project.id
            };
            resourceUIService.getDevicesByCondition(params, function(event) {
              if(event.code == 0) {
                callback(event.data);
              }
            });
            /*
             $$.cacheAsyncData.call(resourceUIService.getDevicesByCondition, [params], function(event){
             if(event.code == 0){
             callback(event.data)
             }
             });*/
            /**
             resourceUIService.getDevicesByCondition(params, function(event){
          if(event.code == 0){
            callback(event.data);
          }
        });*/
          } else {
            callback([]);
          }
        });
      };
      cmethod.prototype.getCurrentResource = function(callback) {
        var id = this.getParameter("resourceId");
        if(id) {
          resourceUIService.getResourceById(id, function(event) {
            if(event.code == 0) {
              callback(event.data);
            }
          });
        } else {
          if(routeParam.resourceId) {
            id = routeParam.resourceId;
            $$.cacheAsyncData.call(resourceUIService.getResourceById, [id], function(event) {
              if(event.code == 0) {
                callback(event.data)
              }
            });
          } else {
            callback(null);
          }
        }
      };
      cmethod.prototype.getCurrentProject = function(callback) {
        var id = this.getParameter("projectId");
        if(id) {
          $$.cacheAsyncData.call(resourceUIService.getResourceById, [id], function(event) {
            if(event.code == 0) {
              callback(event.data)
            }
          });
          /**
           resourceUIService.getResourceById(id, function(event){
        if(event.code == 0){
          callback(event.data)
        }
      })*/
        } else {
          callback(null);
        }
      };
      cmethod.prototype.getCurrentCustomer = function(callback) {
        var id = this.getParameter("customerId");
        if(id) {
          $$.cacheAsyncData.call(resourceUIService.getResourceById, [id], function(event) {
            if(event.code == 0) {
              callback(event.data)
            }
          });
          /**
           resourceUIService.getResourceById(id, function(event){
        if(event.code == 0){
          callback(event.data)
        }
      })*/
        } else {
          callback(null);
        }

      };
      cmethod.prototype.getCiKpi = function(callback) {
        var model = this.$attr("data/model");
        var resources = this.$attr("data/resource");
        var modelType = this.$attr("data/modelType");
        var resfilltype = this.$attr("data/resfilltype");
        var kpis = this.$attr("data/kpi");
        resources = resources ? resources : [];
        kpis = kpis ? kpis : [];
        var cur = this,
          defers = [],
          res = [],
          ks = [];
        var getKpis = function() {
          var some = kpis.some(function(element) {
            return typeof element != "object";
          });
          if(some) {
            var modelId;
            if(modelType == 0 || modelType == undefined) {
              modelId = model.id;
            } else {
              modelId = modelType;
            }
            if(modelId) {
              $$.cacheAsyncData.call(resourceUIService.getDataItemsByModelId, [modelId], function(event) {
                if(event.code == 0) {
                  ks = event.data.filter(function(elem) {
                    return kpis.indexOf(elem.id) != -1;
                  });
                  callback(res, ks);
                }
              });
              /**
               resourceUIService.getKpisByModelId(modelId, function(event){
            if(event.code == 0){
              ks = event.data.filter(function(elem){
                return kpis.indexOf(elem.id) != -1;
              });
              callback(res, ks);
            }
          })*/
            } else {
              throw new Error("modelId is no avaliable!!!");
            }
          } else {
            ks = kpis;
            callback(res, ks);
          }
        };
        if(resources.length == 1 && resources[0] == "rootCi") {
          this.$attr("data/modelType", 300);
          this.$attr("data/resfilltype", "parameter");
          this.$attr("data/resource", []);
          modelType = 300;
          resfilltype = "parameter";
        }
        if(resfilltype == "parameter") {
          if(modelType == 300) {
            cmethod.prototype.getCurrentDomainCi(function(ci) {
              res = [ci];
              getKpis();
            })
          } else if(modelType == 0) {
            cmethod.prototype.getCurrentResource(function(ci) {
              res = ci ? [ci] : [];
              getKpis();
            })
          } else if(resfilltype == 301) {
            cmethod.prototype.getCurrentCustomer(function(ci) {
              res = ci ? [ci] : [];
              getKpis();
            })
          } else if(modelType == 302) {
            cmethod.prototype.getCurrentProject(function(ci) {
              res = ci ? [ci] : [];
              getKpis();
            })
          } else if(modelType == 303) {
            cmethod.prototype.getCurrentDomainCi(function(ci) {
              res = ci ? [ci] : [];
              getKpis();
            })
          } else {
            cmethod.prototype.getCurrentDomainCi(function(ci) {
              res = ci ? [ci] : [];
              getKpis();
            })
          }
        } else {
          var getResource = function(resource) {
            var defer = q.defer();
            if(typeof resource != "object") {
              cur.getResourceById(resource, function(data) {
                res.push(data);
                defer.resolve("success");
              })
            } else {
              res.push(resource);
              defer.resolve("success");
            }
            return defer.promise;
          };
          for(var i in resources) {
            defers.push(getResource(resources[i]));
          }
          q.all(defers).then(function(event) {
            getKpis();
          });
        }
      };
      cmethod.prototype.copyJSONFileToClipBoard = function() {
        var json = JSON.stringify(wholeJSON);
      };
      cmethod.prototype.postService = function(service, method, param, callback) {
        serviceProxy.get(service, method, param, callback);
      };
      cmethod.prototype.getLatestDevices = function(callback) {
        resourceUIService.getLatestDevices(function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.getDeviceInfo = function(callback) {
        resourceUIService.getDeviceInfo(function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.getTicketsByStatus = function(callback) {
        ticketTaskService.getTicketsByStatus([100], function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.getAlertDeviceList = function(params, callback) {
        ticketTaskService.getAlertDeviceList(params, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };

      cmethod.prototype.getTicketTasksByCondition = function(params, callback) {
        ticketTaskService.getTicketTasksByCondition(params, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };

      cmethod.prototype.getTicketsByCondition = function(params, callback) {
        ticketTaskService.getTicketsByCondition(params, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };

      cmethod.prototype.getDealTicketList = function(params, callback) {
        ticketTaskService.getDealTicketList(params, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.doTask = function(params, callback) {
        ticketTaskService.doTask(params, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };

      cmethod.prototype.doTask4Baogang = function(ticketNo, values, callback) {
        ticketTaskService.doTask4Baogang(ticketNo, values, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };

      cmethod.prototype.getComplexHandleListWithCategorys = function(selector, ticketTaskQueryModel, pageRequest, callback) {
        ticketTaskService.getComplexHandleListWithCategorys(selector, ticketTaskQueryModel, pageRequest, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };

      cmethod.prototype.energyTypeList = function(callback) {
        var data = dictionaryService.dicts['energyType'];
        if(callback) {
          callback(data);
        }
      };
      cmethod.prototype.getDevicesByFilter = function(filter, callback) {
        var params = {
          modelId: filter.modelId,
          domainPath: filter.domainPath,
          label: filter.deviceName,
          sn: filter.sn
        };
        resourceUIService.getDevicesByCondition(params, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        });
      };
      cmethod.prototype.getCurrentAlert = function(callback) {
        var resourceId = this.getParameter("resourceId");
        if(resourceId) {
          alertService.queryFromDb({
            nodeIds: resourceId
          }, function(event) {
            if(event.code == 0) {
              callback(event.data);
            }
          })
        } else {
          callback([]);
        }
      };

      cmethod.prototype.getAlertByPage = function(params, pages, callback) {
        alertService.getAlertByPage(params, pages, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.getAllAlerts = function(callback) {
        alertService.queryFromDb({}, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.getAlerts = function(callback) {
        var domainPath = userLoginUIService.user.domainPath;
        alertService.queryFromDb({
          domain: domainPath
        }, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.queryFromDb = function(param, callback) {
        alertService.queryFromDb(param, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.setExpression = function(str) {
        this.$attr("advance/expression", str);
      }
      cmethod.prototype.runExpression = function(str) {
        var expression;
        $$.runExpression(str, function(funRes) {
          if(funRes.code == "0") {
            var fnResult = funRes.data;
            expression = fnResult ? fnResult : {};
          } else {
            expression = {};
            //throw new Error(funRes.message);
          }
        });
        return expression;
      };
      cmethod.prototype.getCustomerFromCurrentUser = function(callback) {
        var cur = this;
        var domains = userLoginUIService.user.domains;
        var customerId;
        var arr = domains.split("/");
        if(arr.length > 2) {
          customerId = arr[arr.length - 2];
          cur.getResourceById(customerId, function(resource) {
            callback(resource);
          })
        } else {
          callback(resource);
        }
      };
      cmethod.prototype.getCurrentAlertByProject = function(callback) {
        var resourceId = this.getParameter("projectId");
        alertService.queryFromDb({
          nodeIds: resourceId
        }, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.getCurrentGatewayDir = function(callback) {
        var resId = this.getParameter("gatewayId"), firstdevice, modelId;
        resId ? this.getDevicesByCondition({ gatewayId : resId }, function(devices){
          firstdevice = devices[0];
          modelId = firstdevice ? firstdevice.modelId : null;
          modelId ? resourceUIService.getDirectivesByModelId(modelId, function(event) {
            if(event.code == 0) {
              callback(event.data, devices);
            }
          }) : callback([]);
        }) : callback([]);
      };
      cmethod.prototype.currentDirective = function(callback) {
        var resId = this.getParameter("resourceId");
        if(resId) {
          this.getResourceById(resId, function(resource) {
            if(resource) {
              var modelId = resource.modelId;
              if(modelId) {
                resourceUIService.getDirectivesByModelId(modelId, function(event) {
                  if(event.code == 0) {
                    callback(event.data);
                  }
                })
              } else {
                callback([]);
              }
            } else {
              callback([]);
            }
          });
        } else {
          callback([]);
        }
      };
      cmethod.prototype.getProjectByTYpeId = function(projectTypeId, callback) {
        customMethodService.getProjectsType(function(event) {
          if(event.code == 0) {
            var projectType = event.data.find(function(elem) {
              return projectTypeId == elem.id;
            });
            if(projectType == undefined) {
              projectType = event.data[0];
            }
            resourceUIService.getResourceByModelId(302, function(event) {
              if(event.code == 0) {
                var find = event.data.find(function(el) {
                  return el.values.projectType == projectType.valueCode;
                });
                if(typeof callback == "function") {
                  callback(find);
                } else {
                  console.log("请配置回调函数");
                }
              }
            });
          }
        })
      };
      cmethod.prototype.getViewById = cmethod.prototype.getViewByViewId = function (viewId, callback) {
        if(!viewId){
          throw new Error( "viewId不存在" )
        }
        var views = cmethod.prototype.getViewById.views = cmethod.prototype.getViewById.views || {};
        var view = views[viewId] = views[viewId] || {};
        if(view.cache){
          callback(clone(view.cache))
        } else {
          view.promise = view.promise || new Promise(function(resolve){
              viewFlexService.getViewById(viewId, function (event) {
                if (event.code == 0) {
                  resolve(event.data);
                }
              })
            })
          view.promise.then(function(d){
            view.cache = d;
            callback(clone(view.cache));
          })
        }
      };
      cmethod.prototype.getProjectsType = function(callback, domains) {
        customMethodService.getProjectsType(function(event) {
          if(event.code == 0) {
            if(typeof callback == "function") {
              callback(event.data);
            } else {
              console.log("请配置回调函数");
            }
          }
        }, domains)
      };
      cmethod.prototype.getCached = function() {
        return cmethod.$cache;
      };
      cmethod.prototype.setValue = function(attr, value) {
        //console.log("setValue", attr, value);
        cmethod.$cache.$attr(attr, value);
      };
      cmethod.prototype.getValue = function(attr) {
        //console.log("getValue", attr);
        return cmethod.$cache.$attr(attr);
      };
      cmethod.prototype.deleteValue = function(attr, value) {
        delete cmethod.$cache[attr];
      };
      cmethod.prototype.findProjectsByCondition = function(param, callback) {
        projectUIService.findProjectsByCondition(param, function(event) {
          if(event.code == 0) {
            if(callback) {
              callback(event.data);
            }
          }
        })
      };
      cmethod.prototype.getCurrentProjects = function(callback) {
        var param = {
          domainPath: userLoginUIService.user.domainPath
        };
        projectUIService.findProjectsByCondition(param, function(event) {
          if(event.code == 0) {
            if(callback) {
              callback(event.data);
            }
          }
        })
      };
      cmethod.prototype.getViewsByOnlyRole = function(viewType, resourceType, resourceId, callback) {
        viewFlexService.getViewsByOnlyRole(viewType, function(event) {
          var views = event.data;
          /** 为防止同一模型有相同的视图被授权，在这里取VIEWID */
          var loop = function(view) {
            if(view.template && view.template.resourceType == resourceType && view.template.resourceId == resourceId) {
              cmethod.prototype.getViewById(view.viewId, function(view) {
                if(view) {
                  callback(view);
                } else {
                  callback(null);
                }
              });
            }
          };
          for(var i in views) {
            loop(views[i])
          }
        });
      };

        cmethod.prototype.setObjPushArr = function(key, value){
            // objPushArr.push(value)
            WIN.$objPushArr[key] = WIN.$objPushArr[key] || [];
            WIN.$objPushArr[key].push(value)
            // WIN.$objPushArr.$attr(key, WIN.$objPushArr[key]);
        };
        cmethod.prototype.getObjPushArr = function(key){
            return WIN.$objPushArr[key];
        };
        cmethod.prototype.deleteObjPushArr = function(key,value){
            WIN.$objPushArr[key].$remove(function (index,e) {
                return e == value;
            },true)
            // delete WIN.$objPushArr[key];
        };
        cmethod.prototype.deleteAllObjPushArr = function(key){
            delete WIN.$objPushArr[key];
        };

      cmethod.prototype.growl = function(str, fun) {
        fun = fun || "success"
        growl[fun](str);
      };
      cmethod.prototype.sendDirective = function(nodeId, dirId, data, callback) {
        resourceUIService.sendDeviceDirective(nodeId, dirId, data, function(returnObj) {
          if(returnObj.code == 0) {
            if(typeof callback == "function") {
              callback(returnObj);
            } else {
              console.log("callback is not defined");
            }
          }
        });
      };
      cmethod.prototype.sendItemDir = function(dir, nodeId) {
        var itemDirValues = {};
        if(!dir.value) {
          growl.warning("请输入指令参数");
          return;
        }
        for(var i in dir.params) {
          var obj = dir.params[i];
          itemDirValues[obj.name] = dir.value;
        }
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '您发送的指令将会在设备上执行，状态数据返回会有一段时间，确认要发送指令吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              resourceUIService.sendDeviceDirective(nodeId ? nodeId : Number(this.getParameter("resourceId")), dir.id, itemDirValues, function(returnObj) {
                if(returnObj.code == 0) {
                  growl.success("指令发送成功，请勿重复发送，状态数据返回需要一定时间！", {});
                }
              });
              dialogRef.close();
            }
          }, {
            label: '取消',
            action: function(dialogRef) {
              dialogRef.close();
            }
          }]
        });

      };
      cmethod.prototype.sendItemDirAll = function(dir) {
        var itemDirValues = {};
        for(var i in dir.params) {
          var obj = dir.params[i];
          if(dir.params[i].$value) {
            itemDirValues[obj.name] = dir.params[i].$value;
          }
        }
        resourceUIService.sendDeviceDirective(Number(this.getParameter("resourceId")), dir.id, itemDirValues, function(returnObj) {
          if(returnObj.code == 0) {
            growl.success("指令发送成功", {});
          }
        });
      };
      cmethod.prototype.sendItemDirByValue = function(id, params) {
        var cur = this,
          gatewayId = this.getParameter("gatewayId"),
          resourceId = this.getParameter("resourceId");
        var cur = this;
        function getDeviceId(callback){
          gatewayId ? cur.getDevicesByCondition({ gatewayId : gatewayId }, function(device){
            callback(device.map(function(n){ return n.id}));
          }) : null;
          resourceId ? callback([resourceId]) : null;
        }
        getDeviceId(function(ids){//sendDeviceDirectiveBatch
          resourceUIService.sendDeviceDirectiveBatch(ids, id, params, function(returnObj) {
            if(returnObj.code == 0) {
              growl.success("指令发送成功", {});
            }
          });
        })
      };
      cmethod.prototype.getAllDevices = function() {

      };
      cmethod.prototype.getViewByViewTitle = function(viewTitle, callback) {
        viewFlexService.getAllMyViews(function(event) {
          var views = event.data;
          var find = views.find(function(view) {
            return view.viewTitle == viewTitle;
          });
          if(find) {
            cmethod.prototype.getViewById(find.viewId, function(view) {
              if(view) {
                callback(view);
              }
            })
          } else {
            callback(null);
          }
        })
      };
      cmethod.prototype.getResources = function(callback) {
        resourceUIService.getResources(function(event) {
          if(event.code == 0) {
            if(typeof callback == "function") {
              callback(event.data);
            } else {
              console.log("请配置回调函数");
            }
          }
        });
      };
      cmethod.prototype.getProjectsAndKpiValue = function(callback) {
        var cur = this;
        cur.findProjectsByCondition({}, function(projects) {
          var cis = [];
          var kpis = [999999];
          var pushDiff = function(arr) {
            for(var i in arr) {
              if(this.indexOf(arr[i]) == -1) {
                this.push(arr[i]);
              }
            }
          }
          var sloop = function(arr, rptback, callback) {
            var inx = 0;
            var repeat = function(inx) {
              var item = arr[inx];
              if(item) {
                rptback(item, function() {
                  inx++;
                  repeat(inx);
                });
              } else {
                callback(arr);
              }
            }
            repeat(inx);
          };
          var traverse = function(callback) {
            var cur = this;
            for(var i in cur) {
              for(var j in cur[i].devices) {
                callback(cur[i], j, cur[i].devices[j]);
              }
            }
          }
          sloop(projects, function(project, callback1) {
            cur.getDevicesByCondition({
              projectId: project.id
            }, function(devices) {
              project.devices = devices;
              var devis = devices.map(function(elem) {
                return elem.id
              });
              pushDiff.call(cis, devis);
              sloop(devices, function(device, callback2) {
                var modelId = device.modelId;
                cur.getKpisByModelId(modelId, function(kpiDes) {
                  var kpiMaps = kpiDes.map(function(elem) {
                    return elem.id;
                  });
                  pushDiff.call(kpis, kpiMaps);
                  device.kpis = kpiDes;
                  callback2();
                })
              }, function() {
                callback1();
              })
            })
          }, function() {
            cur.getKpiValueCi(cis, kpis, function(valuelist) {
              traverse.call(projects, function(project, inx, device) {
                if(project.detail == undefined) {
                  project.detail = [];
                }
                var loop = function(kpi) {
                  var find = valuelist.find(function(el) {
                    return el.nodeId == device.id && el.kpiCode == kpi.id;
                  });
                  var alertFind = valuelist.find(function(el) {
                    return el.nodeId == device.id && el.kpiCode == 999999 && el.instance == kpi.id;
                  });
                  project.detail.push({
                    ci: {
                      label: device.label
                    },
                    kpi: {
                      label: kpi.label,
                      icon: kpi.icon ? kpi.icon : "proudsmart ps-system"
                    },
                    status: alertFind ? alertFind.value : 0,
                    value: find ? find.value : "-"
                  });
                }
                for(var i in device.kpis) {
                  loop(device.kpis[i]);
                }
              });
              callback(projects);
            }, {
              "includeInstance": true
            })
          });
        });
      };
      
      cmethod.prototype.getProTypeByTypeId = function(id, callback) {
        customMethodService.getProTypeByTypeId(id, function(event) {
          if(event.code == 0) {
            if(typeof callback == "function") {
              callback(event.data);
            } else {
              console.log("请配置回调函数");
            }
          }
        })
      };
      cmethod.prototype.getParameter = function(str) {
        var parameter = {};
        if(routeParam.parameter) {
          var all = JSON.parse(routeParam.parameter);
          parameter = all[all.length - 1];
        }
        return parameter.$attr(str);
      };
      cmethod.prototype.setParameter = function(attr, val) {
        var parameter = {};
        if(routeParam.parameter) {
          var all = JSON.parse(routeParam.parameter);
          parameter = all[all.length - 1];
        }
        parameter.$attr(attr, val);
        routeParam.parameter = JSON.stringify(all);
      };
      cmethod.prototype.getPages = function(str) {
        var pageArr = (routeParam.page || "index").split("|");
        var parameters = JSON.parse(routeParam.parameter || "[0]");
        var rs = [];
        var rootTarget = this.getRootTarget();
        var groups = rootTarget.groups;
        for(var i in pageArr) {
          rs.push({
            path: pageArr[i],
            tabLabel: parameters[i].tabLabel || groups[i].label,
            parameter: parameters[i]
          });
        }
        return rs;
      };
      cmethod.prototype.getResourceById = function(id, callback) {
        if(id) {
          resourceUIService.getResourceById(id, function(event) {
            if(event.code == 0) {
              callback(event.data);
            }
          })
        } else {
          callback(null);
        }
      };
      cmethod.prototype.getOnlineByKpiCodes = function(id, callback) {
        if(id) {
          var kpiQueryModel = {
            includeInstance: true,
            isRealTimeData: true,
            nodeIds: [id],
            kpiCodes: [999998],
            timePeriod: 0
          };
          var param = ["kpi", kpiQueryModel];
          kpiDataService.getValueList(param, function(event) {
            if(event.code == 0) {
              callback(event.data);
            }
          })
        } else {
          callback(null);
        }
      };
      cmethod.prototype.navigateBackTo = function() {
        window.location.href = oldURL;
      };
      cmethod.prototype.navigateBack = function() {
        var para, page = routeParam.page ? routeParam.page : "index";
        var oldParam = routeParam.parameter;
        if(oldParam == undefined) {
          oldParam = ['0']
        } else {
          oldParam = JSON.parse(oldParam);
        }
        var pageArr = page.split("|");
        pageArr.pop();
        page = pageArr.toString();
        page = page.replace(",", "|");
        var last = oldParam[oldParam.length - 1];
        var tabLabel = last.tabLabel;
        oldParam.pop();
        para = encodeURIComponent(JSON.stringify(oldParam));
        if(route.current.$$route.controller == "viewFreeboardCtrl") {
          if(page != "") {
            window.location.href = "../app-sc/index_freeboard.html#/freeboard/" + page + "/" + para;
          }
        } else if(route.current.$$route.controller == "freeStyleCtrl") {
          var viewId = routeParam.viewId;
          if(page != "") {
            window.location.href = "../app-free-style/index.html#/" + viewId + "/" + page + "/" + para;
          }
        } else {
          if(page != "") {
            window.location.href = "../app-oc/index.html#/dashboard/" + page + "/" + para;
          }
        }
      };
      cmethod.prototype.moveTo = function(url) {
        var para, page, pageStr = routeParam.page ? routeParam.page : "index";
        var oldParam = routeParam.parameter;
        if(oldParam == undefined) {
          oldParam = ['0']
        } else {
          oldParam = JSON.parse(oldParam);
        }
        var page = pageStr.split("|");
        var inx = page.indexOf(url);
        if(inx != -1) {
          var pageArr = page.slice(0, inx + 1);
          oldParam = oldParam.slice(0, inx + 1);
          page = pageArr.toString();
          page = page.replace(/\,/g, "|");
          para = encodeURIComponent(JSON.stringify(oldParam));
          if(route.current.$$route.controller == "viewFreeboardCtrl") {
            window.location.href = "../app-sc/index_freeboard.html#/freeboard/" + page + "/" + para;
          } else if(route.current.$$route.controller == "freeStyleCtrl") {
            var viewId = routeParam.viewId;
            window.location.href = "../app-free-style/index.html#/" + viewId + "/" + page + "/" + para;
          } else {
            window.location.href = "../app-oc/index.html#/dashboard/" + page + "/" + para;
          }
        }
      };
      cmethod.prototype.navigateToJson = function(url, parameter, type) {
        var para, page = routeParam.page ? routeParam.page : "index";
        if(parameter == undefined) {
          parameter = '0';
        }
        var oldParam = routeParam.parameter;
        if(oldParam == undefined) {
          oldParam = ['0']
        } else {
          oldParam = JSON.parse(oldParam);
        }
        if(type == "self") {
          var pageArr = page.split("|");
          pageArr.pop();
          page = pageArr.toString();
          page.replace(",", "|");
          var last = oldParam[oldParam.length - 1];
          var tabLabel = last.tabLabel;
          oldParam.pop();
          if(tabLabel) {
            parameter.tabLabel = tabLabel;
          }
          parameter.$target == "self";
          oldParam.push(parameter);
        } else {
          parameter.$target == "blank";
          oldParam.push(parameter);
        }
        para = encodeURIComponent(JSON.stringify(oldParam));
        if(route.current.$$route.controller == "viewFreeboardCtrl") {
          if(page != "") {
            window.location.href = "../app-sc/index_freeboard.html#/freeboard/" + page + "|json:" + url + "/" + para;
          } else {
            window.location.href = "../app-sc/index_freeboard.html#/freeboard/" + url + "/" + para;
          }
        } else if(route.current.$$route.controller == "freeStyleCtrl") {
          var viewId = routeParam.viewId;
          if(page != "") {
            window.location.href = "../app-free-style/index.html#/" + viewId + "/" + page + "|json:" + url + "/" + para;
          } else {
            window.location.href = "../app-free-style/index.html#/" + viewId + "/" + url + "/" + para;
          }
        } else {
          if(page != "") {
            window.location.href = "../app-oc/index.html#/dashboard/" + page + "|json:" + url + "/" + para;
          } else {
            window.location.href = "../app-oc/index.html#/dashboard/" + url + "/" + para;
          }
        }
      };
      cmethod.prototype.navigateToFeature = function(callback) {
        var cur = this;
        var ROLE = cur.getValue("global/ROLE");

        if(ROLE == 0) {
          cur.navigateTo("index", {
            main: 3
          }, "self");
        } else if(ROLE == 1) {
          cur.navigateTo("index", {
            main: 2,
            backHistory: 1
          }, "self");
        } else if(ROLE == 2) {
          cur.navigateTo("index", {
            main: 2,
            backHistory: 1
          }, "self");
        } else if(ROLE == 3) {
          cur.navigateTo("index", {
            main: 2,
            backHistory: 1
          }, "self");
        }
      }
      cmethod.prototype.navigateTo = function(url, parameter, type) {
        events = {};
        if(route.current.$$route.controller != "freeBoardCtrl") {
          var para, page = routeParam.page ? routeParam.page : "index";
          if(parameter == undefined) {
            parameter = '0';
          }
          var oldParam = routeParam.parameter;
          if(route.current.$$route.controller == "viewFreeboardCtrl") {
            oldURL = "../app-sc/index_freeboard.html#/freeboard/" + page + "/" + encodeURIComponent(oldParam);
          } else if(route.current.$$route.controller == "freeStyleCtrl") {
            oldURL = "../app-free-style/index.html#/" + page + "/" + encodeURIComponent(oldParam);
          } else {
            oldURL = "../app-oc/index.html#/dashboard/" + page + "/" + encodeURIComponent(oldParam);
          }
          if(oldParam == undefined) {
            oldParam = ['0']
          } else {
            oldParam = JSON.parse(oldParam);
          }
          if(type == "self") {
            var pageArr = page.split("|");
            pageArr.pop();
            page = pageArr.toString();
            page.replace(",", "|");
            var last = oldParam[oldParam.length - 1];
            var tabLabel = tabLabel;
            oldParam.pop();
            if(tabLabel) {
              parameter.tabLabel = tabLabel;
            }
            parameter.$target == "self";
            oldParam.push(parameter);
          } else {
            parameter.$target == "blank";
            oldParam.push(parameter);
          }
          para = encodeURIComponent(JSON.stringify(oldParam));
          if(route.current.$$route.controller == "viewFreeboardCtrl") {
            if(page != "") {
              var newURL = "../app-sc/index_freeboard.html#/freeboard/" + page + "|" + url + "/" + para;
              window.location.href = newURL;
            } else {
              newURL = "../app-sc/index_freeboard.html#/freeboard/" + url + "/" + para;
              window.location.href = newURL
            }
          } else if(route.current.$$route.controller == "freeStyleCtrl") {
            var viewId = routeParam.viewId;
            if(page != "") {
              newURL = "../app-free-style/index.html#/" + viewId + "/" + page + "|" + url + "/" + para;
              window.location.href = newURL
            } else {
              newURL = "../app-free-style/index.html#/" + viewId + "/" + url + "/" + para;
              window.location.href = newURL;
            }
          } else {
            if(page != "") {
              newURL = "../app-oc/index.html#/dashboard/" + page + "|" + url + "/" + para;
              window.location.href = newURL;
            } else {
              newURL = "../app-oc/index.html#/dashboard/" + url + "/" + para;
              window.location.href = newURL;
            }
          }
        }
      };
      cmethod.prototype.explainDic = function(attr, elem) {
        var obj;
        if(typeof elem == "object") {
          obj = elem;
        } else {
          obj = {
            type: "label",
            value: attr,
            name: elem
          }
        }
        return obj
      };
      cmethod.prototype.getSimulateApi = function(simulate, num, callback) {
        var rs = [];
        var target = {
          randomText: function(strs) {
            var length = strs.length - 1;
            var inx = Math.round(Math.random() * length);
            return strs[inx];
          },
          random: function(max, digital) {
            var num = parseInt(Math.random() * max * Math.pow(10, digital)) / Math.pow(10, digital);
            return num;
          }
        }
        var repeat = function(inx) {
          var obj = {};
          var loopAttr = function(attr, elem) {
            if(typeof elem == "function") {
              obj[attr] = elem(inx, target, attr)
            } else {
              obj[attr] = elem;
            }
          }
          for(var i in simulate) {
            loopAttr(i, simulate[i])
          }
          return obj;
        }
        for(var i = 0; i < num; i++) {
          rs.push(repeat(i))
        }
        if(callback) {
          callback(rs);
        }
      };
      cmethod.prototype.wait = function(condition, success) {
        var repeat = function() {
          if(condition()) {
            success();
          } else {
            setTimeout(function() {
              repeat();
            }, 10)
          }
        };
        repeat();
      };
      cmethod.prototype.http = function(url, callback) {
        customMethodService.http(url, function(event) {
          callback(event);
        })
      };
      cmethod.prototype.getScope = function() {
        var cur = this;
        var parent = cur;
        while(parent.parent) {
          parent = parent.parent;
        }
        return parent;
      };
      cmethod.prototype.setScopeValue = function(attr, value) {
        var t = this.getScope();
        if(!t['private']) {
          t['private'] = {};
          Object.defineProperty(t, "private", {
            enumerable: false,
            value: {}
          })
        }
        var obj = t['private'];
        obj.$attr(attr, value);
      };
      cmethod.prototype.getScopeValue = function(attr) {
        var t = this.getScope();
        var obj = t['private'] || {};
        return obj.$attr(attr);
      };
      cmethod.prototype.linkTo = function(url, target) {
        window.open(url, target ? target : "_blank");
      };
      cmethod.prototype.findViewHasProjectNameById = function(projectId, callback) {
        this.getResourceById(projectId, function(project) {
          var label = project.label;
          var getRootPath = function(domainPath) {
            var arr = domainPath.split("/");
            return "/" + arr[1] + "/" + arr[2] + "/";
          }
          var rootPath = getRootPath(userLoginUIService.user.domainPath);
          viewFlexService.getViewsOnlyPublishedByTypeAndDomainPath('dashboard', rootPath, function(event) {
            var views = event.data;
            var find = views.find(function(view) {
              return label.indexOf(view.viewTitle) != -1;
            });
            if(find) {
              cmethod.prototype.getViewById(find.viewId, function(view) {
                if(view) {
                  callback(view);
                }
              })
            } else {
              callback(null);
            }
          })
        });
      };
      cmethod.prototype.getProjectsByCustomerId = function(customerId, callback) {
        var param = {};
        if(customerId) {
          param.customerId = customerId;
        }
        projectUIService.findProjectsByCondition(param, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.simulate = function(type, nodesDes, kpisDes, simulateFn, callback) {
        var result = [];
        var date = new Date();
        var timeStamp = date.getTime();
        var timeStampToStr = function(timeStamp) {
          var nDate = new Date(timeStamp - 8 * 3600 * 1000);
          var year = nDate.getFullYear();
          var month = nDate.getMonth() + 1;
          var dat = nDate.getDate();
          var hour = nDate.getHours();
          var min = nDate.getMinutes();
          var sec = nDate.getSeconds();
          if(month < 10) {
            month = "0" + month;
          }
          if(dat < 10) {
            dat = "0" + dat;
          }
          if(hour < 10) {
            hour = "0" + hour;
          }
          if(min < 10) {
            min = "0" + min;
          }
          if(sec < 10) {
            sec = "0" + sec;
          }
          return year + "-" + month + "-" + dat + "T" + hour + ":" + min + ":" + sec + ".000+0000";
        };
        var renderData = function(index) {
          var startTime = simulateFn.startTime.getTime();
          var period = simulateFn.period;
          var frequency = simulateFn.frequency;
          var range = simulateFn.range;
          var getData = function(curTime) {
            if(curTime - startTime < period) {
              var loopNodes = function(node) {
                var loopKpis = function(inx, kpi) {
                  var calcRandom = function(range) {
                    if(range) {
                      var max = range[1];
                      var min = range[0];
                      var ran = (max - min);
                      return Math.round((min + Math.random() * ran) * 10) / 10;
                    } else {
                      return Math.round(Math.random() * 100);
                    }
                  };
                  var val = calcRandom(range);
                  var sampleData = {
                    "agentId": "0",
                    "aggregatePeriod": null,
                    "aggregateStatus": null,
                    "aggregateType": null,
                    "arisingTime": timeStampToStr(curTime),
                    "compressCount": 0,
                    "computeTaskId": 0,
                    "dataSerialNumber": 0,
                    "dataTime": null,
                    "insertTime": timeStampToStr(curTime),
                    "kpiCode": kpi.id,
                    "nodeId": node.id,
                    "notes": null,
                    "numberValue": val,
                    "quality": 0,
                    "resourceId": 0,
                    "stringValue": null,
                    "value": val,
                    "valueStr": val + ""
                  };
                  result.push(sampleData);
                };
                for(var i in kpisDes) {
                  loopKpis(i, kpisDes[i])
                }
              };
              for(var i in nodesDes) {
                loopNodes(nodesDes[i])
              }
              getData(curTime + frequency);
            }
          };
          getData(startTime);
          if(typeof callback == "function") {
            callback(result);
          }
        };
        var renderData2D = function() {
          var dictionaryService = services.dictionaryService;
          var loadArray = ["energyType", "industryShortType"];
          var nextStep = function() {
            var loopNodes = function(node) {
              var loopKpis = function(inx, kpi) {
                var loopInstance = function(ins1) {
                  var loopInstance2 = function(ins2) {
                    var range;
                    if(ranges) {
                      range = ranges[inx];
                    }
                    var calcRandom = function(range) {
                      if(range) {
                        var max = range[1];
                        var min = range[0];
                        var ran = (max - min);
                        return Math.round((min + Math.random() * ran) * 10) / 10;
                      } else {
                        return Math.round(Math.random() * 100);
                      }
                    };
                    var val = calcRandom(range);
                    var newTime = timeStamp;
                    var sampleData = {
                      "agentId": "0",
                      "aggregatePeriod": null,
                      "aggregateStatus": null,
                      "aggregateType": null,
                      "arisingTime": timeStampToStr(newTime),
                      "compressCount": 0,
                      "computeTaskId": 0,
                      "dataSerialNumber": 0,
                      "dataTime": null,
                      "insertTime": timeStampToStr(newTime),
                      "kpiCode": kpi.id,
                      "nodeId": node.id,
                      "notes": null,
                      "numberValue": val,
                      "instance": ins1.label + "," + ins2.label,
                      "quality": 0,
                      "resourceId": 0,
                      "stringValue": null,
                      "value": val,
                      "valueStr": val + ""
                    };
                    result.push(sampleData);
                  };
                  for(var i in loadArray[1].data) {
                    loopInstance2(loadArray[1].data[i]);
                  }
                };
                for(var i in loadArray[0].data) {
                  loopInstance(loadArray[0].data[i]);
                }
              };
              for(var i in kpisDes) {
                loopKpis(i, kpisDes[i])
              }
            };
            for(var i in nodesDes) {
              loopNodes(nodesDes[i])
            }
            if(typeof callback == "function") {
              callback(result);
            }
          };
          var loop = function(inx, loadType) {
            var getEnergyType = function(event) {
              var checkFinished = function() {
                var every = loadArray.every(function(elem) {
                  return typeof elem == "object"
                });
                if(every) {
                  nextStep();
                }
              };
              if(event.code == 0) {
                var rs = [];
                var loop = function(el) {
                  var some = rs.some(function(itm) {
                    return itm.label == el.label;
                  });
                  if(!some) {
                    rs.push(el)
                  }
                }
                for(var i in event.data) {
                  loop(event.data[i]);
                }
                loadArray[inx] = {
                  path: loadType,
                  status: "finished",
                  data: rs
                };
                checkFinished();
              }
            };
            dictionaryService.getDictValues(loadType, getEnergyType);
          };
          for(var i in loadArray) {
            loop(i, loadArray[i])
          }
        };
        var renderData3D = function() {
          var aggr_type;
          var dictionaryService = services.dictionaryService;
          var loadArray = ["energyType", "industryShortType"];
          var nextStep = function() {
            var loopNodes = function(node) {
              var loopKpis = function(inx, kpi) {
                var loopAggrType = function(atype) {
                  var loopInstance = function(ins1) {
                    var loopInstance2 = function(ins2) {
                      var range;
                      if(ranges) {
                        range = ranges[inx];
                      }
                      var calcRandom = function(range) {
                        if(range) {
                          var max = range[1];
                          var min = range[0];
                          var ran = (max - min);
                          return Math.round((min + Math.random() * ran) * 10) / 10;
                        } else {
                          return Math.round(Math.random() * 100);
                        }
                      };
                      var val = calcRandom(range);
                      var newTime = timeStamp;
                      var sampleData = {
                        "agentId": "0",
                        "aggregatePeriod": null,
                        "aggregateStatus": null,
                        "aggregateType": atype.valueCode,
                        "arisingTime": timeStampToStr(newTime),
                        "compressCount": 0,
                        "computeTaskId": 0,
                        "dataSerialNumber": 0,
                        "dataTime": null,
                        "insertTime": timeStampToStr(newTime),
                        "kpiCode": kpi.id,
                        "nodeId": node.id,
                        "notes": null,
                        "numberValue": val,
                        "instance": ins2.label + "," + ins1.label,
                        "quality": 0,
                        "resourceId": 0,
                        "stringValue": null,
                        "value": val,
                        "valueStr": val + ""
                      };
                      result.push(sampleData);
                    };
                    for(var i in loadArray[1].data) {
                      loopInstance2(loadArray[1].data[i]);
                    }
                  };
                  for(var i in loadArray[0].data) {
                    loopInstance(loadArray[0].data[i]);
                  }
                };
                for(var i in aggr_type) {
                  loopAggrType(aggr_type[i])
                }
              };
              for(var i in kpisDes) {
                loopKpis(i, kpisDes[i])
              }
            };
            for(var i in nodesDes) {
              loopNodes(nodesDes[i])
            }
            if(typeof callback == "function") {
              callback(result);
            }
          };
          var loop = function(inx, loadType) {
            var getEnergyType = function(event) {
              var checkFinished = function() {
                var every = loadArray.every(function(elem) {
                  return typeof elem == "object"
                });
                if(every) {
                  nextStep();
                }
              };
              if(event.code == 0) {
                var rs = [];
                var loop = function(el) {
                  var some = rs.some(function(itm) {
                    return itm.label == el.label;
                  });
                  if(!some) {
                    rs.push(el)
                  }
                }
                for(var i in event.data) {
                  loop(event.data[i]);
                }
                loadArray[inx] = {
                  path: loadType,
                  status: "finished",
                  data: rs
                };
                checkFinished();
              }
            };
            dictionaryService.getDictValues(loadType, getEnergyType);
          };
          for(var i in loadArray) {
            loop(i, loadArray[i])
          }

          dictionaryService.getDictValues("aggregateType", function(event) {
            if(event.code == 0) {
              aggr_type = event.data.slice(0, 2);
            }
          });
        };
        if(type == "time") {
          renderData();
        } else if(type == "ci") {
          renderData(0);
        } else if(type == "ci_2d") {
          renderData2D();
        } else if(type == "ci_3d") {
          renderData3D();
        }
        return result;
      };
      cmethod.prototype.getModels = function(callback) {
        resourceUIService.getModels(function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.getModelByIds = function(ids, callback) {
        resourceUIService.getModelByIds(ids, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.getKpisByModelId = function(modelId, callback) {
        if(modelId) {
          resourceUIService.getKpisByModelId(modelId, function(event) {
            if(event.code == 0) {
              for(var i in event.data) {
                var kpiId = event.data[i].id;
                if(!cmethod.kpiDic[kpiId]) {
                  cmethod.kpiDic[kpiId] = event.data[i].label;
                }
              }
              callback(event.data);
            }
          })
        } else {
          callback([]);
        }
      };

      /**
       * 根据不同的modelId获得资源
       * 300域 301客户 302项目
       * @param {Object} modelId
       * @param {Object} callback
       */
      cmethod.prototype.getResourceByModelId = function(modelId, callback) {
        if(modelId) {
          resourceUIService.getResourceByModelId(modelId, function(event) {
            if(event.code == 0) {
              for(var i in event.data) {
                var nodeId = event.data[i].id;
                if(!cmethod.resourceDic[nodeId]) {
                  cmethod.resourceDic[nodeId] = event.data[i].label;
                }
              }
              callback(event.data);
            }
          })
        } else {
          callback([]);
        }
      };
      cmethod.prototype.getDomainsByFilter = function(filter, callback) {
        resourceUIService.getDomainsByFilter(filter, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.queryDomainsByEnterpriseId = function(filter, callback) {
        energyConsumeUIService.queryDomainsByEnterpriseId(filter, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.getProjectsByDomains = function(domains, callback) {
        var param = {};
        if(domains) {
          param.domainPath = domains;
        }
        projectUIService.findProjectsByCondition(param, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.getProjectsByDomains = function(domains, callback) {
        var param = {};
        if(domains) {
          param.domainPath = domains;
        }
        projectUIService.findProjectsByCondition(param, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.getCurrentProjectsFromDomain = function(callback) {
        var cur = this;
        var domains = userLoginUIService.user.domains;
        resourceUIService.getDomainsByFilter({
          domains: userLoginUIService.user.domains,
          modelId: 302
        }, function(event) {
          if(event.code == 0) {
            callback(event.data);
          }
        })
      };
      cmethod.prototype.findProjectById = function(id, callback) {
        projectUIService.findProjectById(id, function(event) {
          if(event.code == 0) {
            if(callback) {
              callback(event.data);
            }
          }
        })
      };
      cmethod.prototype.getCurrentProjectsByCustom = function(callback) {
        var cur = this;
        //如果没有subDomain的话，那就不是客户用户，没有customerId的
        if(!userLoginUIService.user.subDomain) {
          callback([]);
          return;
        }
        var arr = userLoginUIService.user.subDomain.split("/");
        var customerId = arr[arr.length - 2];
        var param = {
          customerId: customerId
        }
        projectUIService.findProjectsByCondition(param, function(event) {
          if(event.code == 0) {
            if(callback) {
              callback(event.data);
            }
          }
        })
      };
      cmethod.prototype.getViewByProjectId = function(resId, callback) {
        var getRootPath = function(domainPath) {
          var arr = domainPath.split("/");
          return "/" + arr[1] + "/" + arr[2] + "/";
        }
        var rootPath = getRootPath(userLoginUIService.user.domainPath);
        viewFlexService.getViewsOnlyPublishedByTypeAndDomainPath('configure', rootPath, function(event) {
          var views = event.data;
          var find = views.find(function(view) {
            if(view.template) {
              if(view.template.resourceType == "project") {
                if(view.template.resourceId == resId) {
                  return true;
                }
              }
            }
            return false;
          });
          if(find) {
            cmethod.prototype.getViewById(find.viewId, function(view) {
              if(view) {
                callback(view);
              }
            })
          } else {
            callback(null);
          }
        })
      };
      cmethod.prototype.getAllMyViews = function(callback) {
        viewFlexService.getAllMyViews(function(event) {
          if(event.code == 0) {
            var views = event.data;
            callback(views);
          } else {
            callback(null);
          }
        });
      };
      cmethod.prototype.deleteView = function(viewId, callback) {
        viewFlexService.deleteView(viewId, function(event) {
          if(event.code == 0) {
            var views = event.data;
            callback(views);
          } else {
            callback(null);
          }
        });
      };
      cmethod.prototype.getDefaultView = function(modelId, callback) {
        viewFlexService.getDefaultView(modelId, function(event) {
          if(event.code == 0) {
            var views = event.data;
            callback(views);
          } else {
            callback(null);
          }
        });
      };
      cmethod.prototype.getManagedViewsByTypeAndRole = function(type, callback) {
        viewFlexService.getManagedViewsByTypeAndRole(type, function(event) {
          if(event.code == 0) {
            var views = event.data;
            callback(views);
          } else {
            callback(null);
          }
        });
      };

      cmethod.prototype.getViewsOnlyPublishedByTypeAndDomainPath = function(type, rootPath, callback) {
        viewFlexService.getViewsOnlyPublishedByTypeAndDomainPath(type, rootPath, function(event) {
          if(event.code == 0) {
            var views = event.data;
            callback(views);
          } else {
            callback(null);
          }
        });
      };
      cmethod.prototype.getViewByModelId = function(resId, callback) {
        var getRootPath = function(domainPath) {
          var arr = domainPath.split("/");
          return "/" + arr[1] + "/" + arr[2] + "/";
        }
        var rootPath = getRootPath(userLoginUIService.user.domainPath);
        viewFlexService.getViewsOnlyPublishedByTypeAndDomainPath('configure', rootPath, function(event) {
          var views = event.data;
          var find = views.find(function(view) {
            if(view.template) {
              if(view.template.resourceType == "device") {
                if(view.template.resourceId == resId) {
                  return true;
                }
              }
            }
            return false;
          });
          if(find) {
            cmethod.prototype.getViewById(find.viewId, function(view) {
              if(view) {
                callback(view);
              }
            })
          } else {
            callback(null);
          }
        })
      };
      cmethod.prototype.getSimulateList = function(data, callback) {
        customMethodService.getSimulateList(data, callback);
      };
      cmethod.prototype.webSocket = function(nodeIds, kpiCodes, callback) {
        /**
                 var inx1 = Math.floor(Math.random() * nodeIds.length)
                 var inx2 = Math.floor(Math.random() * kpiCodes.length);
                 var val = 2 + parseInt(Math.round(Math.random() * 2));
                 var test = function(){
          setTimeout(function(){
            var inx1 = Math.floor(Math.random() * nodeIds.length);
            var inx2 = Math.floor(Math.random() * kpiCodes.length);
            var val = 2 + parseInt(Math.round(Math.random() * 2));
            callback({
              value : parseInt(Math.random() * 4),
              instance : "01",
              nodeId : 556881757466073,
              kpiCode : 999999
            });
            test();
          }, 1000);
        };
                 test();
                 */
        var uuid = Math.uuid();
        var paramSocket = {
          ciid: nodeIds.toString(),
          kpi: kpiCodes.toString()
        };
        SwSocket.unregister(uuid);
        var operation = "register";
        SwSocket.register(uuid, operation, function(event) {
          if(typeof callback == "function") {
            callback(event.data);
          }
        });
        SwSocket.send(uuid, operation, 'kpi', paramSocket);
      };
      cmethod.prototype.getKpiFromViewByTypeAndRole = function(viewType, resourceType, resourceId, callback, socketCallback) {
        var kpiCodes = [];
        var nodeIds = [Number(this.getParameter("resourceId"))];
        var valueDic = {};
        var uuid = Math.uuid();
        this.getViewsByOnlyRole(viewType, resourceType, resourceId, function(view) {
          var json = JSON.parse(view.content);
          json.cells.sort(function(a, b) {
            return parseInt(a.z) - parseInt(b.z);
          });
          json.cells.forEach(function(cell) {
            if(cell.type == "basic.Rect" && cell.kpiId && cell.kpiId.length > 8 && cell.nodeId && cell.nodeId.length > 8) {
              var kpiId;
              if(typeof cell.kpiId == "string" && cell.kpiId.search('number:') > -1) {
                kpiId = Number(cell.kpiId.split(":")[1]);
              } else {
                kpiId = Number(cell.kpiId);
              }
              var modelId
              if(typeof cell.modelId == "string" && cell.modelId.search('number:') > -1) {
                modelId = Number(cell.modelId.split(":")[1]);
              } else {
                modelId = Number(cell.modelId);
              }
              var kpiDef = {};
              if(resourceUIService.rootModelsDic && resourceUIService.rootModelsDic[modelId]) {
                if(resourceUIService.rootModelsDic[modelId].kpiDic && resourceUIService.rootModelsDic[modelId].kpiDic[kpiId]) {
                  kpiDef = resourceUIService.rootModelsDic[modelId].kpiDic[kpiId];
                }
              }
              kpiCodes.push(kpiId);
              valueDic[kpiId] = {
                kpiName: cell.attrs.text.text ? cell.attrs.text.text : kpiDef.label,
                kpiUnit: cell.unitType == "number:1" ? (kpiDef.unitLabel ? kpiDef.unitLabel : "") : "",
                value: "无",
                kpiCode: kpiDef.id,
                rangeObj: kpiDef.rangeObj
              }
            }
          });
          var kpiQueryModel = {
            category: 'ci',
            isRealTimeData: true,
            nodeIds: nodeIds,
            kpiCodes: kpiCodes,
            startTime: null,
            endTime: null,
            timeRange: "",
            statisticType: "psiot",
            condList: []
          };
          var param = ["kpi", kpiQueryModel];
          kpiDataService.getValueList(param, function(event) {
            if(event.code == 0) {
              event.data.forEach(function(kpi) {
                valueDic[kpi.kpiCode].value = kpi.value;
                if(valueDic[kpi.kpiCode].rangeObj)
                  valueDic[kpi.kpiCode].value = valueDic[kpi.kpiCode].rangeObj[valueDic[kpi.kpiCode].value];
              });
              var returnAry = [];
              for(var key in valueDic) {
                returnAry.push(valueDic[key])
              }
              callback(returnAry);
            }
          });
          var paramSocket = {
            ciid: nodeIds.toString(),
            kpi: kpiCodes.toString()
          };
          SwSocket.unregister(uuid);
          var operation = "register";
          SwSocket.register(uuid, operation, function(event) {
            if(typeof socketCallback == "function") {
              if(valueDic[event.data.kpiCode].rangeObj)
                event.data.value = valueDic[event.data.kpiCode].rangeObj[event.data.value];
              socketCallback(event.data);
            }
          });
          SwSocket.send(uuid, operation, 'kpi', paramSocket);
        });
      };
      cmethod.prototype.filterEnterprises = function(callback) {
        var domainPath = userLoginUIService.user.domains;
        energyConsumeUIService.findEnterpriseInfoByDomainPath(domainPath, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.valueCode = returnObj.data.industryType;
            cmethod.prototype.queryEnterpriseListByHis(returnObj.data, function(eventData) {
              callback(eventData);
            });
          }
        });
      };
      cmethod.prototype.queryEnterpriseListByHis = function(shortName, callback) {
        if(!shortName) {
          growl.warning("请选择行业");
          return;
        }
        var industryShortType = shortName.valueCode;
        //获取所有企业
        var queryEnterprises = [];
        (function queryAllEnterprises() {
          energyConsumeUIService.findEnterpriseInfos(function(returnObj) {
            if(returnObj.code == 0) {
              returnObj.data.forEach(function(item) {
                if(item.industryType == industryShortType) {
                  item.label = item.name;
                  queryEnterprises.push(item);
                }
              })
              callback(queryEnterprises);
            }
          });
        })();
      };
      cmethod.prototype.queryDomains = function(filter, callback) {
        var nodeIdAry = [];
        var index = 0;
        var queryDomainsByEnterpriseId = function(enterpriseId) {
          energyConsumeUIService.queryDomainsByEnterpriseId(enterpriseId, function(returnObj) {
            if(returnObj.code == 0) {
              index++;
              var ary = returnObj.data.filter(function(item) {
                return item.modelDefinitionId == filter.modelId;
              });
              ary.forEach(function(item) {
                nodeIdAry.push(item.id);
              });
              if(index == filter.enterpriseList.length) {
                callback(nodeIdAry);
                index = 0;
              }
            }
          })
        };
        filter.enterpriseList.forEach(function(item) {
          queryDomainsByEnterpriseId(item);
        });
      };
      cmethod.prototype.navigateToTracker = function(ticketNo) {
        /** target.navigateToTracker(dt.data.data[0].ticketNo); */
        var cur = this;
        var parameter = {};
        if(routeParam.parameter) {
          var all = JSON.parse(routeParam.parameter);
          parameter = all[all.length - 1];
        }
        var main = cur.getParameter("main");
        var sub = cur.getParameter("sub");
        if(sub) {
          if(typeof sub == "number") {
            sub = [sub, "viewId:9246777620035"];
          } else {
            sub = [sub[0], "viewId:9246777620035"]
          }
        } else {
          if(typeof main == "number") {
            main = [main, "viewId:9246777620035"];
          } else {
            main = [main[0], "viewId:9246777620035"];
          }
        }
        var param = {
          main: main,
          ticketNo: ticketNo,
          original: parameter
        }
        if(sub) {
          param.sub = sub;
        }
        cur.navigateTo("index", param, "self");
      }
      cmethod.prototype.getDirectivesByTypeAndRole = function(viewType, resourceType, resourceId, callback) {
        var ids = {};
        var cur = this;
        cur.getManagedViewsByTypeAndRole(viewType, resourceType, resourceId, function(view) {
          var json = JSON.parse(view.content);
          json.cells.forEach(function(cell) {
            if(cell.directiveIds) {
              cell.directiveIds.forEach(function(dirctiveId) {
                if(typeof dirctiveId == "string")
                  ids[dirctiveId.split(":")[1]] = true;
                else
                  ids[dirctiveId] = true;
              })
            }
          });
          cur.getDirectivesByModelId(resourceId, function(event) {
            var resources = [];
            event.forEach(function(dir) {
              if(ids[dir.id]) resources.push(dir);
            })
            resources.sort(doubleCompare(["values", "index"], "desc"));
            callback(resources);
          });
        });
      };
      cmethod.prototype.getDirectivesByTypeAndRoleAndValue = function(viewType, resourceType, modelId, callback) {
        var ids = {};
        var resourceId = this.getParameter("resourceId");
        var cur = this;
        cur.getViewsByOnlyRole(viewType, resourceType, modelId, function(view) {
          var json = JSON.parse(view.content);
          json.cells.forEach(function(cell) {
            if(cell.directiveIds) {
              cell.directiveIds.forEach(function(dirctiveId) {
                if(typeof dirctiveId == "string")
                  ids[dirctiveId.split(":")[1]] = true;
                else
                  ids[dirctiveId] = true;
              })
            }
          });
          cur.getDirectivesByModelId(modelId, function(event) {
            var directives = [];
            event.forEach(function(dir) {
              if(ids[dir.id]) directives.push(dir);
            })
            directives.sort(doubleCompare(["values", "index"], "desc"));
            var kpis = directives.map(function(elem) {
              if(elem.params) {
                if(elem.params[0]) {
                  return elem.params[0].id;
                } else {
                  return 0;
                }
              } else {
                return 0;
              }
            });
            var ci = [parseInt(resourceId)];
            cur.getKpiValueCi(ci, kpis, function(event) {
              var loop = function(item) {
                var directive = directives.find(function(elem) {
                  if(elem.params[0]) {
                    return elem.params[0].id == item.kpiCode;
                  } else {
                    return false;
                  }
                });
                if(directive) {
                  directive.value = item.value;
                }
              };
              for(var i in event) {
                loop(event[i]);
              }
              callback(directives);
            });

          });
        });
      };
      cmethod.prototype.getDirectivesByModelId = function(modelId, callback) {
        if(modelId) {
          resourceUIService.getDirectivesByModelId(modelId, function(event) {
            if(event.code == 0) {
              callback(event.data);
            }
          })
        } else {
          callback([]);
        }
      };
      cmethod.prototype.getRootTarget = function() {
        return rootTarget;
      };
      cmethod.prototype.queryBenchmarkByShortName = function(shortName, callback) {
        var industryDic = {};
        var energyDic = {};
        var industryShortType = [];
        var energyType = [];
        dictionaryService.getAllDicts(function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              if(item.dictCode == 'industryShortType') {
                industryShortType.push(item);
              } else if(item.dictCode == 'energyType') {
                energyType.push(item);
              }
            });
            industryShortType.forEach(function(item) {
              industryDic[item.label] = item;
            });
            energyType.forEach(function(item) {
              energyDic[item.label] = item;
            });
            callBack();
          }
        });

        function callBack() {
          var returnAry = [];
          var param = [
            "kpi", {
              "isRealTimeData": true,
              "nodeIds": [userLoginUIService.user.domainID],
              "kpiCodes": [
                3327
              ],
              "granularityUnit": 'MONTH',
              "aggregateType": ["VALENTWEIGHT"],
              "timeRange": "",
              "statisticType": "psiot",
              "includeInstance": true,
              "condList": [],
              "timePeriod": 1,
              "dataType": 1
            }
          ];
          kpiDataService.getValueList(param, function(returnObj) {
            if(returnObj.code == 0) {
              returnObj.data.forEach(function(item) {
                var instanceAry = item.instance.split(',');
                item.instanceName = industryDic[instanceAry[0]].param;
                item.instanceCode = industryDic[instanceAry[0]].valueCode;
                item.energyName = instanceAry[1];
                item.energyCode = energyDic[instanceAry[1]].valueCode;
                if(shortName.label == instanceAry[0]) {
                  returnAry.push(item);
                }

              });
              callback(returnAry);
            }
          })
        }
      };
      return cmethod;
    }
  ]);
});
