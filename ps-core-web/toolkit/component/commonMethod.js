/**
 * Created by leonlin on 16/11/3.
 */
var WIN = window;
define([], function() {
  var timeout, customMethodService, projectUIService, serviceCenterService, dictionaryService, energyConsumeUIService, ticketTaskService, resourceUIService, viewFlexService, userLoginUIService, elemData, route, window, growl, kpiDataService, SwSocket, alertService, userDomainService, thridPartyApiService;
  var cmethod = function(data) {
    if (data) {
      this.$clone(data.element);
      elemData = data;
      route = data.route;
      window = data.window;
      q = data.q;
      projectUIService = data.projectUIService;
      serviceCenterService = data.serviceCenterService;
      customMethodService = data.customMethodService;
      resourceUIService = data.resourceUIService;
      dictionaryService = data.dictionaryService;
      energyConsumeUIService = data.energyConsumeUIService;
      viewFlexService = data.viewFlexService;
      userLoginUIService = data.userLoginUIService;
      kpiDataService = data.kpiDataService;
      ticketTaskService = data.ticketTaskService;
      userDomainService = data.userDomainService;
      SwSocket = data.SwSocket;
      alertService = data.alertService;
      serviceProxy = data.serviceProxy;
      thridPartyApiService = data.thridPartyApiService;
      wholeJSON = data.wholeJSON;
      growl = data.growl;
      timeout = data.timeout;
    };
  };
  WIN.$cache = {};
  WIN.$events = {};
  cmethod.prototype.getSignalShipInfo = function(id, callback) {
    thridPartyApiService.getSignalShipInfo(id, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    });
  };
  cmethod.prototype.getManyShipInfo = function(ids, callback) {
    thridPartyApiService.getManyShipInfo(ids, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    });
  };
  cmethod.prototype.getShipTrack = function(id,start,end, callback) {
    thridPartyApiService.getShipTrack(id,start,end, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    });
  };
  cmethod.prototype.setSelfDom = function(dom){
    this.selfDom = dom;
    Object.defineProperty(this, "selfDom", {
      enumerable : false
    })
  };
  cmethod.prototype.getTheme = function(themeStr){
    if(rootTarget){
      var themeObj = JSONparse(rootTarget.setting) || {
          theme : "default"
        };
      themeStr = themeStr || "default";
      themeStr = themeStr == "auto" ? themeCompare[themeObj.theme || "default"] : themeStr;
      return themeStr;
    } else {
      return "default";
    }
  };
  var clickFnDic = {}; //按钮的返回集合
  cmethod.prototype.createInfoHtml = function(obj){
    var str = "";
    // var str = obj.label + "<br><hr/>";
    window.onclickHandler = function(event) {
      var key = event.target.id+"&"+event.target.name
      if (clickFnDic[key]) {
        clickFnDic[key](event.target.name);
      }
    }
    var createContent = function(cont){
      return "<label><span>"+cont.label+":</span><span>" + cont.value + "</span></label><br>";
    }
    var createButton = function (cont) {
      var clickFn = cont.$attr("on/click");
      var key = cont.label+"&"+cont.value;
      clickFnDic[key] = clickFn
      var dataBtn = "<button id='"+cont.label+"' name='"+cont.value+"' onclick='onclickHandler(event)'>"+cont.label +"</button>";
//    var dataBtn = "<button id='"+cont.label+"' onclick='fnOK("+cont.value+")'>"+cont.label +"</button>";
      return dataBtn;
    }
    for(var i in obj.content){
      if(!obj.content[i].type || obj.content[i].type == "label"){
        str += createContent(obj.content[i]);
      }else if(obj.content[i].type == "button"){
        str += createButton(obj.content[i]);
      }
    }
    return str;
  }
  cmethod.prototype.createShipShape = function(width, length, trailWidth, trailLength, headWidth, headLength) {
    var RIGHTOFFSET = 0;
    var leftBottomPoint = [(-width / 2) * trailWidth, -length / 2];
    var rightBottomPoint = [(width / 2) * trailWidth, -length / 2];
    var rightBottomPoint_1 = [(1 - RIGHTOFFSET) * width / 2, (trailLength / 2 - 1) * length / 2];
    var rightlowerPoint = [width / 2, (trailLength - 1) * length / 2];
    var rightupperPoint = [width / 2 * 1.4, (1 / 2 - headLength) * length];
    var rightupperPoint_1 = [(headWidth)/ 2 * width, (1 / 2 - headLength / 3) * length];
    var topPoint1 = [width *.1, length / 2 *.99];
    var topPoint = [0, length / 2];
    var topPoint2 = [-width *.1, length / 2 *.99];
    var leftupperPoint_1 = [-(headWidth)/ 2 * width, (1 / 2 - headLength / 3) * length];
    var leftupperPoint = [-width / 2  * 1.4, (1 / 2 - headLength) * length];
    var leftlowerPoint = [-width / 2, (trailLength - 1) * length / 2];
    var leftBottomPoint_1 = [-(1 - RIGHTOFFSET) * width / 2, (trailLength / 2 - 1) * length / 2];
    return [leftBottomPoint, rightBottomPoint, rightBottomPoint_1, rightlowerPoint,
      rightupperPoint, rightupperPoint_1, topPoint1, topPoint, topPoint2, leftupperPoint_1,
      leftupperPoint, leftlowerPoint, leftBottomPoint_1, leftBottomPoint];
  };
  cmethod.prototype.asyncCall = function(arr){

  };
  cmethod.prototype.asyncRepeat = function(repeatCall, finish){
    var self = this;
    var inx = 0;
    var repeat = function(inx){
      if(self[inx]){
        repeatCall(inx, self[inx], function(){
          inx++;
          repeat(inx);
        })
      } else {
        finish();
      }
    };
    repeat(inx)
  };
  cmethod.prototype.queryDomainTree =  function(callback, isArryLike){
    userDomainService.queryDomainTree(userLoginUIService.user.userID, function(event){
      var $TreeObj = function(data){
        this.$clone(data);
      };
      var treeObjToArr = function(data){
        var result = [];
        var traverse = function(item, parent, level){
          var to = new $TreeObj(item);
          to.parent = parent;
          to.level = level;
          result.push(to);
          for(var i in item.domainInfos){
            var m = level+1;
            traverse(item.domainInfos[i], item, m);
          }
        };
        traverse(event.data[0], null, 0);
        return result;
      };
      if(event.code){
        if(isArryLike){
          var to = treeObjToArr(event.data[0]);
          callback(to);
        } else {
          callback(event.data);
        }
      };
    })
  };
  cmethod.prototype.getAlertColor =  function(str){
    var color = "";
    switch(str){
      case 4 :
        color = "#e7675d";
        break;
      case 3 :
        color = "#ed9700";
        break;
      case 2 :
        color = "#e1cd0a";
        break;
      case 1 :
        color = "#25bce7";
        break;
      default :
        color = "#4db6ac";
        break;
    }
    //console.log(color);
    return color;
  };
  cmethod.prototype.getCurrentDomainCi = function(callback){
    var domainPath = userLoginUIService.user.domains;
    var domainId;
    var arr = domainPath.split("/");
    if(arr.length > 1){
      domainId = arr[arr.length - 2];
    }
    $$.cacheAsyncData.call(resourceUIService.getResourceById, [domainId], function(event){
      if(event.code == 0){
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
  cmethod.prototype.getDevicesByCondition = function(params, callback){
    resourceUIService.getDevicesByCondition(params, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    });
  };
  cmethod.prototype.getCurrentDevices = function(callback){
    this.getCurrentProject(function(project){
      if(project){
        var domainPath = project.domainPath;
        var params = {
          projectId : project.id
        };
        resourceUIService.getDevicesByCondition(params, function(event){
          if(event.code == 0){
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
      };
    });
  };
  cmethod.prototype.getCurrentResource = function(callback){
    var id = this.getParameter("resourceId");
    if(id){
      resourceUIService.getResourceById(id, function(event){
        if(event.code == 0){
          callback(event.data);
        }
      })
    } else {
      if(elemData.$attr("routeParam/resourceId")){
        id = elemData.$attr("routeParam/resourceId");
        $$.cacheAsyncData.call(resourceUIService.getResourceById, [id], function(event){
          if(event.code == 0){
            callback(event.data)
          }
        });
        /**
        resourceUIService.getResourceById(id, function(event){
          if(event.code == 0){
            callback(event.data);
          }
        })*/
      } else {
        callback(null);
      }
    }
  };
  cmethod.prototype.getCurrentProject = function(callback){
    var id = this.getParameter("projectId");
    if(id){
      $$.cacheAsyncData.call(resourceUIService.getResourceById, [id], function(event){
        if(event.code == 0){
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
  cmethod.prototype.getCurrentCustomer = function(callback){
    var id = this.getParameter("customerId");
    if(id){
      $$.cacheAsyncData.call(resourceUIService.getResourceById, [id], function(event){
        if(event.code == 0){
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
  cmethod.prototype.getCiKpi = function(callback){
    var model = this.$attr("data/model");
    var resources = this.$attr("data/resource");
    var modelType = this.$attr("data/modelType");
    var resfilltype = this.$attr("data/resfilltype");
    var kpis = this.$attr("data/kpi");
    resources = resources ? resources : [];
    kpis = kpis ? kpis : [];
    var cur = this, defers = [], res = [], ks = [];
    var getKpis = function(){
      var some = kpis.some(function(element){
        return typeof element != "object";
      });
      if(some){
        var modelId;
        if(modelType == 0 || modelType == undefined){
          modelId = model.id;
        } else {
          modelId = modelType;
        }
        if(modelId){
          $$.cacheAsyncData.call(resourceUIService.getDataItemsByModelId, [modelId], function(event){
            if(event.code == 0){
              ks = event.data.filter(function(elem){
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
    if(resources.length == 1 && resources[0] == "rootCi"){
      this.$attr("data/modelType", 300);
      this.$attr("data/resfilltype", "parameter");
      this.$attr("data/resource", []);
      modelType = 300;
      resfilltype = "parameter";
    }
    if(resfilltype == "parameter"){
      if(modelType == 300){
        cmethod.prototype.getCurrentDomainCi(function(ci){
          res = [ci];
          getKpis();
        })
      } else if(modelType == 0){
        cmethod.prototype.getCurrentResource(function(ci){
          res = ci ? [ci] : [];
          getKpis();
        })
      } else if(resfilltype == 301){
        cmethod.prototype.getCurrentCustomer(function(ci){
          res = ci ? [ci] : [];
          getKpis();
        })
      } else if(modelType == 302){
        cmethod.prototype.getCurrentProject(function(ci){
          res = ci ? [ci] : [];
          getKpis();
        })
      } else if(modelType == 303){
        cmethod.prototype.getCurrentDomainCi(function(ci){
          res = ci ? [ci] : [];
          getKpis();
        })
      } else {
        cmethod.prototype.getCurrentDomainCi(function(ci){
          res = ci ? [ci] : [];
          getKpis();
        })
      }
    } else {
      var getResource = function(resource){
        var defer = q.defer();
        if(typeof resource != "object"){
          cur.getResourceById(resource, function(data){
            res.push(data);
            defer.resolve("success");
          })
        } else {
          res.push(resource);
          defer.resolve("success");
        }
        return defer.promise;
      };
      for(var i in resources){
        defers.push(getResource(resources[i]));
      }
      q.all(defers).then(function(event){
        getKpis();
      });
    };
  };
  cmethod.prototype.copyJSONFileToClipBoard = function(){
    var json = JSON.stringify(wholeJSON);
  };
  cmethod.prototype.postService = function(service, method, param, callback){
    serviceProxy.get(service, method, param, callback);
  };
  cmethod.prototype.getLatestDevices = function(callback){
    resourceUIService.getLatestDevices(function(event){
      if(event.code == 0){
        callback(event.data);
      }
    })
  };
  cmethod.prototype.getTicketsByStatus = function(callback){
    ticketTaskService.getTicketsByStatus([100], function(event){
      if(event.code == 0){
        callback(event.data);
      }
    })
  };
  cmethod.prototype.energyTypeList = function(callback) {
    var data = dictionaryService.dicts['energyType'];
    if (callback) {
      callback(data);
    }
  };
  cmethod.prototype.getDevicesByFilter = function(filter, callback) {
    var params = {
      modelId : filter.modelId,
      domainPath : filter.domainPath,
      label : filter.deviceName,
      sn : filter.sn
    };
    resourceUIService.getDevicesByCondition(params, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    });
  };
  cmethod.prototype.getCurrentAlert = function(callback){
    var resourceId = this.getParameter("resourceId");
    if(resourceId){
      alertService.queryFromDb({
        nodeIds : resourceId
      }, function(event){
        if(event.code == 0){
          callback(event.data);
        }
      })
    } else {
      callback([]);
    };
  };
  cmethod.prototype.getAllAlerts = function(callback){
    alertService.queryFromDb({
    }, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    })
  };
  cmethod.prototype.getAlerts = function(callback){
    var domainPath = userLoginUIService.user.domainPath;
    alertService.queryFromDb({domain : domainPath}, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    })
  };
  cmethod.prototype.queryFromDb = function(param, callback){
    alertService.queryFromDb(param, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    })
  }
  cmethod.prototype.getCustomerFromCurrentUser = function(callback){
    var cur = this;
    var domains = userLoginUIService.user.domains;
    var customerId;
    var arr = domains.split("/");
    if(arr.length > 2){
      customerId = arr[arr.length - 2];
      cur.getResourceById(customerId, function(resource){
        callback(resource);
      })
    } else {
      callback(resource);
    }
  };
  cmethod.prototype.getCurrentAlertByProject = function(callback){
    var resourceId = this.getParameter("projectId");
    alertService.queryFromDb({
      nodeIds : resourceId
    }, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    })
  };
  cmethod.prototype.currentDirective = function(callback){
    var resId = this.getParameter("resourceId");
    if(resId){
      this.getResourceById(resId, function(resource){
        if(resource){
          var modelId = resource.modelId;
          if(modelId){
            resourceUIService.getDirectivesByModelId(modelId, function(event){
              if(event.code == 0){
                callback(event.data);
              };
            })
          } else {
            callback([]);
          };
        } else {
          callback([]);
        };
      });
    } else {
      callback([]);
    }
  };
  cmethod.prototype.getKpiValueCi = function(ci, kpi, callback, extension){
    serviceCenterService.getValues(ci, kpi, extension).then(function(data){
      callback(data);
    })
  };
  cmethod.prototype.getProjectByTYpeId = function(projectTypeId, callback){
    customMethodService.getProjectsType(function(event){
      if(event.code == 0){
        var projectType = event.data.find(function(elem){
          return projectTypeId == elem.id;
        });
        if(projectType == undefined){
          projectType = event.data[0];
        }
        resourceUIService.getResourceByModelId(302, function(event){
          if(event.code == 0){
            var find = event.data.find(function(el){
              return el.values.projectType == projectType.valueCode;
            });
            if(typeof callback == "function"){
              callback(find);
            } else {
              console.log("请配置回调函数");
            }
          }
        });
      }
    })
  };
  cmethod.prototype.getViewById = cmethod.prototype.getViewByViewId = function(viewId, callback){
    if(viewId){
      viewFlexService.getViewById(viewId, function(event){
        if(event.code == 0){
          callback(event.data);
        }
      })
    } else {
      callback(null);
    }
  };
  cmethod.prototype.getProjectsType = function(callback, domains){
    customMethodService.getProjectsType(function(event){
      if(event.code == 0){
        if(typeof callback == "function"){
          callback(event.data);
        } else {
          console.log("请配置回调函数");
        }
      }
    }, domains)
  };
  cmethod.prototype.setValue = function(attr, value){
    WIN.$cache.$attr(attr, value);
  };
  cmethod.prototype.getValue = function(attr){
    return WIN.$cache.$attr(attr);
  };
  cmethod.prototype.deleteValue = function(attr, value){
    delete WIN.$cache[attr];
  };
  cmethod.prototype.findProjectsByCondition = function(param, callback){
    projectUIService.findProjectsByCondition(param, function(event){
      if(event.code == 0){
        if(callback){
          callback(event.data);
        }
      }
    })
  };
  cmethod.prototype.getCurrentProjects = function(callback){
    var param = {
      domainPath : userLoginUIService.user.domainPath
    };
    projectUIService.findProjectsByCondition(param, function(event){
      if(even.code == 0){
        if(callback){
          callback(event.data);
        }
      }
    })
  };

  cmethod.prototype.getViewsByOnlyRole = function(viewType,resourceType, resourceId, callback){
    viewFlexService.getViewsByOnlyRole(viewType,function(event){
      var views = event.data;
      /** 为防止同一模型有相同的视图被授权，在这里取VIEWID */
      var loop = function(view){
        if (view.template && view.template.resourceType == resourceType && view.template.resourceId == resourceId) {
          viewFlexService.getViewById(view.viewId, function(event){
            if(event.code == 0){
              callback(event.data);
            } else {
              callback(null);
            }
          });
        };
      };
      for(var i in views){
        loop(views[i])
      }
      /**
       var find = views.find(function(view){
        return view.template && view.template.resourceType == resourceType && view.template.resourceId == resourceId;
      });
       if(find){
        viewFlexService.getViewById(find.viewId, function(event){
          if(event.code == 0){
            callback(event.data);
          } else {
            callback(null);
          }
        })
      };*/
    });
  };
  cmethod.prototype.getManagedViewsByTypeAndRole = function(viewType,resourceType, resourceId, callback){
    viewFlexService.getManagedViewsByTypeAndRole(viewType,function(event){
      var views = event.data;
      /** 为防止同一模型有相同的视图被授权，在这里取VIEWID */
      var loop = function(view){
        if (view.template && view.template.resourceType == resourceType && view.template.resourceId == resourceId) {
          viewFlexService.getViewById(view.viewId, function(event){
            if(event.code == 0){
              callback(event.data);
            } else {
              callback(null);
            }
          });
        };
      };
      for(var i in views){
        loop(views[i])
      }
      /**
      var find = views.find(function(view){
        return view.template && view.template.resourceType == resourceType && view.template.resourceId == resourceId;
      });
      if(find){
        viewFlexService.getViewById(find.viewId, function(event){
          if(event.code == 0){
            callback(event.data);
          } else {
            callback(null);
          }
        })
      };*/
    });
  };
  cmethod.prototype.growl = function(str){
    growl.success(str);
  };
  cmethod.prototype.sendDirective = function(nodeId, dirId, data, callback) {
    resourceUIService.sendDeviceDirective(nodeId, dirId, data, function(returnObj) {
      if(returnObj.code == 0) {
        if(typeof callback == "function"){
          callback(returnObj);
        } else {
          console.log("callback is not defined");
        }
        //growl.success("指令发送成功", {});
      }
    });
  };
  cmethod.prototype.sendItemDir = function(dir,nodeId) {
    var itemDirValues = {};
    if(!dir.value) {
      growl.warning("请输入指令参数");
      return;
    }
    for(var i in dir.params) {
      var obj = dir.params[i];
      itemDirValues[obj.name] = dir.value;
    }
    resourceUIService.sendDeviceDirective(nodeId?nodeId:Number(this.getParameter("resourceId")), dir.id, itemDirValues, function(returnObj) {
      if(returnObj.code == 0) {
        growl.success("指令发送成功", {});
      }
    });
  };
  cmethod.prototype.sendItemDirAll = function(dir) {
    var itemDirValues = {};
    for(var i in dir.params) {
      var obj = dir.params[i];
      if(dir.params[i].$value){
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
    resourceUIService.sendDeviceDirective(Number(this.getParameter("resourceId")), id, params, function(returnObj) {
      if(returnObj.code == 0) {
        growl.success("指令发送成功", {});
      }
    });
  };
  cmethod.prototype.getAllDevices = function(){

  };
  cmethod.prototype.getViewByViewTitle = function(viewTitle, callback){
    viewFlexService.getAllMyViews(function(event){
      var views = event.data;
      var find = views.find(function(view){
        return view.viewTitle == viewTitle;
      });
      if(find){
        viewFlexService.getViewById(find.viewId, function(event){
          if(event.code == 0){
            callback(event.data);
          }
        })
      } else {
        callback(null);
      }
    })
  };
  cmethod.prototype.getResources = function(callback){
    resourceUIService.getResources(function(event){
      if(event.code == 0){
        if(typeof callback == "function"){
          callback(event.data);
        } else {
          console.log("请配置回调函数");
        };
      };
    });
  };
  cmethod.prototype.getProjectsAndKpiValue = function(callback){
    var cur = this;
    cur.findProjectsByCondition({}, function(projects){
      var cis = [];
      var kpis = [999999];
      var pushDiff = function(arr){
        for(var i in arr){
          if(this.indexOf(arr[i]) == -1){
            this.push(arr[i]);
          }
        }
      }
      var sloop = function(arr, rptback, callback){
        var inx = 0;
        var repeat = function(inx){
          var item = arr[inx];
          if(item){
            rptback(item, function(){
              inx++;
              repeat(inx);
            });
          } else {
            callback(arr);
          }
        }
        repeat(inx);
      };
      var traverse = function(callback){
        var cur = this;
        for(var i in cur){
          for(var j in cur[i].devices){
            callback(cur[i], j, cur[i].devices[j]);
          }
        }
      }
      sloop(projects, function(project, callback1){
        cur.getDevicesByCondition({
          projectId : project.id
        }, function(devices){
          project.devices = devices;
          var devis = devices.map(function(elem){
            return elem.id
          });
          pushDiff.call(cis, devis);
          sloop(devices, function(device, callback2){
            var modelId = device.modelId;
            cur.getKpisByModelId(modelId, function(kpiDes){
              var kpiMaps = kpiDes.map(function(elem){
                return elem.id;
              });
              pushDiff.call(kpis, kpiMaps);
              device.kpis = kpiDes;
              callback2();
            })
          }, function(){
            callback1();
          })
        })
      }, function(){
        cur.getKpiValueCi(cis, kpis, function(valuelist){
          traverse.call(projects, function(project, inx, device){
            if(project.detail == undefined){
              project.detail = [];
            };
            var loop = function(kpi){
              var find = valuelist.find(function(el){
                return el.nodeId == device.id && el.kpiCode == kpi.id;
              });
              var alertFind = valuelist.find(function(el){
                return el.nodeId == device.id && el.kpiCode == 999999;
              });
              project.detail.push({
                ci : {
                  label : device.label
                },
                kpi : {
                  label : kpi.label,
                  icon : kpi.icon ? kpi.icon : "proudsmart ps-system"
                },
                status : alertFind ? alertFind.value : 0,
                value : find ? find.value : "-"
              });
            }
            for(var i in device.kpis){
              loop(device.kpis[i]);
            };
          });
          callback(projects);
        })
      });
    });
  };
  cmethod.prototype.getResourceByModelId = function(id, callback){
    resourceUIService.getResourceByModelId(id, function(event){
      if(event.code == 0){
        if(typeof callback == "function"){
          callback(event.data);
        } else {
          console.log("请配置回调函数");
        };
      };
    });
  };
  cmethod.prototype.getProTypeByTypeId = function(id, callback){
    customMethodService.getProTypeByTypeId(id, function(event){
      if(event.code == 0){
        if(typeof callback == "function"){
          callback(event.data);
        } else {
          console.log("请配置回调函数");
        }
      }
    })
  };
  cmethod.prototype.getParameter = function(str){
    if(elemData.routeParam.parameter){
      var all = JSON.parse(elemData.routeParam.parameter);
      var param = all[all.length - 1];
      return param.$attr(str);
    } else {
      return null;
    }
  };
  cmethod.prototype.getResourceById = function(id, callback){
    if(id){
      resourceUIService.getResourceById(id, function(event){
        if(event.code == 0){
          callback(event.data);
        };
      })
    } else {
      callback(null);
    }
  };

  cmethod.prototype.getOnlineByKpiCodes = function(id, callback) {
    if (id) {
      var kpiQueryModel = {
        includeInstance: true,
        isRealTimeData: true,
        nodeIds: [id],
        kpiCodes: [999998],
        timePeriod: 0
      };
      var param = ["kpi", kpiQueryModel];
      kpiDataService.getValueList(param, function(event) {
        if (event.code == 0) {
          callback(event.data);
        };
      })
    } else {
      callback(null);
    }
  };
  cmethod.prototype.navigateBack = function() {
    var para, page = elemData.routeParam.page ? elemData.routeParam.page : "index";
    var oldParam = elemData.routeParam.parameter;
    if(oldParam == undefined){
      oldParam = ['0']
    } else {
      oldParam = JSON.parse(oldParam);
    }
    var pageArr = page.split("|");
    pageArr.pop();
    page = pageArr.toString();
    page.replace(",", "|");
    var last = oldParam[oldParam.length -1];
    var tabLabel = last.tabLabel;
    oldParam.pop();
    para = encodeURIComponent(JSON.stringify(oldParam));
    if(route.current.$$route.controller == "viewFreeboardCtrl"){
      if(page != ""){
        window.location.href = "../app-sc/index_freeboard.html#/freeboard/" + page + "/" + para;
      }
    } else if(route.current.$$route.controller == "freeStyleCtrl"){
      var viewId = elemData.routeParam.viewId;
      if(page != ""){
        window.location.href = "../app-free-style/index.html#/" + viewId + "/" + page + "/" + para;
      }
    } else {
      if(page != ""){
        window.location.href = "../app-oc/index.html#/dashboard/" + page + "/" + para;
      }
    };
  };
  cmethod.prototype.navigateTo = function(url, parameter, type){
    var para, page = elemData.routeParam.page ? elemData.routeParam.page : "index";
    if(parameter == undefined){
      parameter = '0';
    }
    var oldParam = elemData.routeParam.parameter;
    if(oldParam == undefined){
      oldParam = ['0']
    } else {
      oldParam = JSON.parse(oldParam);
    }
    if(type == "self"){
      var pageArr = page.split("|");
      pageArr.pop();
      page = pageArr.toString();
      page.replace(",", "|");
      var last = oldParam[oldParam.length -1];
      var tabLabel = last.tabLabel;
      oldParam.pop();
      if(tabLabel){
        parameter.tabLabel = tabLabel;
      }
      parameter.$target == "self";
      oldParam.push(parameter);
    } else {
      parameter.$target == "blank";
      oldParam.push(parameter);
    }
    para = encodeURIComponent(JSON.stringify(oldParam));
    if(route.current.$$route.controller == "viewFreeboardCtrl"){
      if(page != ""){
        window.location.href = "../app-sc/index_freeboard.html#/freeboard/" + page + "|" + url + "/" + para;
      } else {
        window.location.href = "../app-sc/index_freeboard.html#/freeboard/" + url + "/" + para;
      }
    } else if(route.current.$$route.controller == "freeStyleCtrl"){
      var viewId = elemData.routeParam.viewId;
      if(page != ""){
        window.location.href = "../app-free-style/index.html#/" + viewId + "/" + page + "|" + url + "/" + para;
      } else {
        window.location.href = "../app-free-style/index.html#/" + viewId + "/" + url + "/" + para;
      }
    } else {
      if(page != ""){
        window.location.href = "../app-oc/index.html#/dashboard/" + page + "|" + url + "/" + para;
      } else {
        window.location.href = "../app-oc/index.html#/dashboard/" + url + "/" + para;
      }
    };
  };
  cmethod.prototype.http = function(url, callback){
    customMethodService.http(url, function(event){
      callback(event);
    })
  };
  cmethod.prototype.linkTo = function(url, target){
    window.open(url, target ? target : "_blank");
  };
  cmethod.prototype.findViewHasProjectNameById = function(projectId, callback){
    this.getResourceById(projectId, function(project){
      var label = project.label;
      var getRootPath = function(domainPath){
        var arr = domainPath.split("/");
        return "/" + arr[1] + "/" + arr[2] + "/";
      }
      var rootPath = getRootPath(userLoginUIService.user.domainPath);
      viewFlexService.getViewsOnlyPublishedByTypeAndDomainPath('dashboard', rootPath, function(event){
        var views = event.data;
        var find = views.find(function(view){
          return label.indexOf(view.viewTitle) != -1;
        });
        if(find){
          viewFlexService.getViewById(find.viewId, function(event){
            if(event.code == 0){
              callback(event.data);
            }
          })
        } else {
          callback(null);
        }
      })
    });
  };
  cmethod.prototype.getProjectsByCustomerId = function(customerId, callback){
    var param = {};
    if(customerId){
      param.customerId = customerId;
    };
    projectUIService.findProjectsByCondition(param, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    })
  };
  cmethod.prototype.simulate = function(type, nodesDes, kpisDes, simulateFn, callback){
    var result = [];
    var date = new Date();
    var timeStamp = date.getTime();
    var timeStampToStr = function(timeStamp){
      var nDate = new Date(timeStamp - 8 * 3600 * 1000);
      var year = nDate.getFullYear();
      var month = nDate.getMonth() + 1;
      var dat = nDate.getDate();
      var hour = nDate.getHours();
      var min = nDate.getMinutes();
      var sec = nDate.getSeconds();
      if(month < 10){
        month = "0" + month;
      }
      if(dat < 10){
        dat = "0" + dat;
      }
      if(hour < 10){
        hour = "0" + hour;
      }
      if(min < 10){
        min = "0" + min;
      }
      if(sec < 10){
        sec = "0" + sec;
      };
      return year + "-" + month + "-" + dat + "T" + hour + ":" + min + ":" + sec + ".000+0000";
    };
    var renderData = function(index){
      var startTime = simulateFn.startTime.getTime();
      var period = simulateFn.period;
      var frequency = simulateFn.frequency;
      var range = simulateFn.range;
      var getData = function(curTime){
        if(curTime - startTime < period){
          var loopNodes = function(node){
            var loopKpis = function(inx, kpi){
              var calcRandom = function(range){
                if(range){
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
                "aggregatePeriod":null,
                "aggregateStatus":null,
                "aggregateType": null,
                "arisingTime": timeStampToStr(curTime),
                "compressCount": 0,
                "computeTaskId": 0,
                "dataSerialNumber": 0,
                "dataTime": null,
                "insertTime": timeStampToStr(curTime),
                "kpiCode": kpi.id,
                "nodeId" : node.id,
                "notes" : null,
                "numberValue": val,
                "quality": 0,
                "resourceId": 0,
                "stringValue": null,
                "value": val,
                "valueStr": val + ""
              };
              result.push(sampleData);
            };
            for(var i in kpisDes){
              loopKpis(i, kpisDes[i])
            }
          };
          for(var i in nodesDes){
            loopNodes(nodesDes[i])
          };
          getData(curTime + frequency);
        }
      };
      getData(startTime);
      if(typeof callback == "function"){
        callback(result);
      }
    };
    var renderData2D = function(){
      var dictionaryService = services.dictionaryService;
      var loadArray = ["energyType", "industryShortType"];
      var nextStep = function(){
        var loopNodes = function(node){
          var loopKpis = function(inx, kpi){
            var loopInstance = function(ins1){
              var loopInstance2 = function(ins2){
                var range;
                if(ranges){
                  range = ranges[inx];
                }
                var calcRandom = function(range){
                  if(range){
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
                  "aggregatePeriod":null,
                  "aggregateStatus":null,
                  "aggregateType": null,
                  "arisingTime": timeStampToStr(newTime),
                  "compressCount": 0,
                  "computeTaskId": 0,
                  "dataSerialNumber": 0,
                  "dataTime": null,
                  "insertTime": timeStampToStr(newTime),
                  "kpiCode": kpi.id,
                  "nodeId" : node.id,
                  "notes" : null,
                  "numberValue": val,
                  "instance":ins1.label + "," + ins2.label,
                  "quality": 0,
                  "resourceId": 0,
                  "stringValue": null,
                  "value": val,
                  "valueStr": val + ""
                };
                result.push(sampleData);
              };
              for(var i in loadArray[1].data){
                loopInstance2(loadArray[1].data[i]);
              }
            };
            for(var i in loadArray[0].data){
              loopInstance(loadArray[0].data[i]);
            }
          };
          for(var i in kpisDes){
            loopKpis(i, kpisDes[i])
          }
        };
        for(var i in nodesDes){
          loopNodes(nodesDes[i])
        };
        if(typeof callback == "function"){
          callback(result);
        }
      };
      var loop = function(inx, loadType){
        var getEnergyType = function(event){
          var checkFinished = function(){
            var every = loadArray.every(function(elem){
              return typeof elem == "object"
            });
            if(every){
              nextStep();
            }
          };
          if(event.code == 0){
            var rs = [];
            var loop = function(el){
              var some = rs.some(function(itm){
                return itm.label == el.label;
              });
              if(!some){
                rs.push(el)
              }
            }
            for(var i in event.data){
              loop(event.data[i]);
            }
            loadArray[inx] = {
              path : loadType,
              status : "finished",
              data : rs
            };
            checkFinished();
          }
        };
        dictionaryService.getDictValues(loadType, getEnergyType);
      };
      for(var i in loadArray){
        loop(i, loadArray[i])
      }
    };
    var renderData3D = function(){
      var aggr_type;
      var dictionaryService = services.dictionaryService;
      var loadArray = ["energyType", "industryShortType"];
      var nextStep = function(){
        var loopNodes = function(node){
          var loopKpis = function(inx, kpi){
            var loopAggrType = function(atype){
              var loopInstance = function(ins1){
                var loopInstance2 = function(ins2){
                  var range;
                  if(ranges){
                    range = ranges[inx];
                  }
                  var calcRandom = function(range){
                    if(range){
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
                    "aggregatePeriod":null,
                    "aggregateStatus":null,
                    "aggregateType": atype.valueCode,
                    "arisingTime": timeStampToStr(newTime),
                    "compressCount": 0,
                    "computeTaskId": 0,
                    "dataSerialNumber": 0,
                    "dataTime": null,
                    "insertTime": timeStampToStr(newTime),
                    "kpiCode": kpi.id,
                    "nodeId" : node.id,
                    "notes" : null,
                    "numberValue": val,
                    "instance":ins2.label + "," + ins1.label,
                    "quality": 0,
                    "resourceId": 0,
                    "stringValue": null,
                    "value": val,
                    "valueStr": val + ""
                  };
                  result.push(sampleData);
                };
                for(var i in loadArray[1].data){
                  loopInstance2(loadArray[1].data[i]);
                }
              };
              for(var i in loadArray[0].data){
                loopInstance(loadArray[0].data[i]);
              }
            };
            for(var i in aggr_type){
              loopAggrType(aggr_type[i])
            };
          };
          for(var i in kpisDes){
            loopKpis(i, kpisDes[i])
          }
        };
        for(var i in nodesDes){
          loopNodes(nodesDes[i])
        };
        if(typeof callback == "function"){
          callback(result);
        }
      };
      var loop = function(inx, loadType){
        var getEnergyType = function(event){
          var checkFinished = function(){
            var every = loadArray.every(function(elem){
              return typeof elem == "object"
            });
            if(every){
              nextStep();
            }
          };
          if(event.code == 0){
            var rs = [];
            var loop = function(el){
              var some = rs.some(function(itm){
                return itm.label == el.label;
              });
              if(!some){
                rs.push(el)
              }
            }
            for(var i in event.data){
              loop(event.data[i]);
            }
            loadArray[inx] = {
              path : loadType,
              status : "finished",
              data : rs
            };
            checkFinished();
          }
        };
        dictionaryService.getDictValues(loadType, getEnergyType);
      };
      for(var i in loadArray){
        loop(i, loadArray[i])
      }


      dictionaryService.getDictValues("aggregateType", function(event){
        if(event.code == 0){
          aggr_type = event.data.slice(0,2);
        }
      });
    };
    if(type == "time"){
      renderData();
    } else if(type == "ci"){
      renderData(0);
    } else if(type == "ci_2d"){
      renderData2D();
    } else if(type == "ci_3d"){
      renderData3D();
    };
    return result;
  };
  cmethod.prototype.getModels = function(callback){
    resourceUIService.getModels(function(event){
      if(event.code == 0){
        callback(event.data);
      }
    })
  };
  cmethod.prototype.getKpisByModelId = function(modelId, callback){
    if(modelId){
      resourceUIService.getKpisByModelId(modelId, function(event){
        if(event.code == 0){
          callback(event.data);
        }
      })
    } else {
      callback([]);
    };
  };
  cmethod.prototype.getResourceByModelId = function(modelId, callback){
    if(modelId){
      resourceUIService.getResourceByModelId(modelId, function(event){
        if(event.code == 0){
          callback(event.data);
        }
      })
    } else {
      callback([]);
    };
  };
  cmethod.prototype.getDomainsByFilter = function(filter, callback){
    resourceUIService.getDomainsByFilter(filter, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    })
  };
  cmethod.prototype.queryDomainsByEnterpriseId = function(filter, callback) {
    energyConsumeUIService.queryDomainsByEnterpriseId(filter, function(event) {
      if (event.code == 0) {
        callback(event.data);
      }
    })
  };
  cmethod.prototype.getProjectsByDomains = function(domains, callback) {
    var param = {};
    if(domains){
      param.domainPath = domains;
    };
    projectUIService.findProjectsByCondition(param, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    })
  };
  cmethod.prototype.getProjectsByDomains = function(domains, callback) {
    var param = {};
    if(domains){
      param.domainPath = domains;
    };
    projectUIService.findProjectsByCondition(param, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    })
  };
  cmethod.prototype.getCurrentProjectsFromDomain = function(callback){
    var cur = this;
    var domains = userLoginUIService.user.domains;
    resourceUIService.getDomainsByFilter({
      domains : userLoginUIService.user.domains,
      modelId : 302
    }, function(event){
      if(event.code == 0){
        callback(event.data);
      }
    })
  };
  cmethod.prototype.findProjectById = function(id, callback){
    projectUIService.findProjectById(id, function(event){
      if(event.code == 0){
        if(callback){
          callback(event.data);
        }
      }
    })
  };

  cmethod.prototype.getCurrentProjectsByCustom = function(callback){
    var cur = this;
    //如果没有subDomain的话，那就不是客户用户，没有customerId的
    if (!userLoginUIService.user.subDomain) {
      callback([]);
      return;
    }
    var arr = userLoginUIService.user.subDomain.split("/");
    var customerId = arr[arr.length - 2];
    var param = {
      customerId : customerId
    }
    projectUIService.findProjectsByCondition(param, function(event){
      if(event.code == 0){
        if(callback){
          callback(event.data);
        }
      }
    })
  };
  cmethod.prototype.getViewByProjectId = function(resId, callback){
    var getRootPath = function(domainPath){
      var arr = domainPath.split("/");
      return "/" + arr[1] + "/" + arr[2] + "/";
    }
    var rootPath = getRootPath(userLoginUIService.user.domainPath);
    viewFlexService.getViewsOnlyPublishedByTypeAndDomainPath('configure', rootPath, function(event){
      var views = event.data;
      var find = views.find(function(view){
        if(view.template){
          if(view.template.resourceType == "project"){
            if(view.template.resourceId == resId){
              return true;
            }
          }
        }
        return false;
      });
      if(find){
        viewFlexService.getViewById(find.viewId, function(event){
          if(event.code == 0){
            callback(event.data);
          }
        })
      } else {
        callback(null);
      }
    })
  };
  cmethod.prototype.getViewByModelId = function(resId, callback){
    var getRootPath = function(domainPath){
      var arr = domainPath.split("/");
      return "/" + arr[1] + "/" + arr[2] + "/";
    }
    var rootPath = getRootPath(userLoginUIService.user.domainPath);
    viewFlexService.getViewsOnlyPublishedByTypeAndDomainPath('configure', rootPath, function(event){
      var views = event.data;
      var find = views.find(function(view){
        if(view.template){
          if(view.template.resourceType == "device"){
            if(view.template.resourceId == resId){
              return true;
            }
          }
        }
        return false;
      });
      if(find){
        viewFlexService.getViewById(find.viewId, function(event){
          if(event.code == 0){
            callback(event.data);
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
  cmethod.prototype.webSocket = function(nodeIds, kpiCodes, callback){
    var uuid = Math.uuid();
    var paramSocket = {
      ciid: nodeIds.toString(),
      kpi: kpiCodes.toString()
    };
    /**
    var inx1 = Math.floor(Math.random() * nodeIds.length)
    var inx2 = Math.floor(Math.random() * kpiCodes.length);
    var val = Math.round(Math.random() * 100);
    callback({
      value : val,
      nodeId : nodeIds[inx1],
      kpiCode : kpiCodes[inx2]
    });
    var test = function(){
      setTimeout(function(){
        var inx1 = Math.floor(Math.random() * nodeIds.length);
        var inx2 = Math.floor(Math.random() * kpiCodes.length);
        var val = Math.round(Math.random() * 100);
        callback({
          value : val,
          nodeId : nodeIds[inx1],
          kpiCode : kpiCodes[inx2]
        });
        test();
      }, 6000);
    };
    test();*/
    SwSocket.unregister(uuid);
    var operation = "register";
    SwSocket.register(uuid, operation, function(event) {
      if(typeof callback == "function"){
        callback(event.data);
      }
    });
    SwSocket.send(uuid, operation, 'kpi', paramSocket);
    /**
     * PROMETHEUS-586 
     * 注销scope时注销方法heartBeat，回调函数callback
     */
    $('#free-board').on('naviClick', function() {
      console.log("on-destroy");
      SwSocket.unregister(uuid);
    });
  };
  cmethod.prototype.getKpiFromViewByTypeAndRole = function(viewType, resourceType, resourceId, callback, socketCallback) {
    var kpiCodes = [];
    var nodeIds
    if (this.getParameter("resourceId")) {
      nodeIds= [Number(this.getParameter("resourceId"))];
    } else if (this.parameters["resourceId"]){
      nodeIds= [this.parameters["resourceId"]];
    }
    var valueDic = {};
    var uuid = Math.uuid();
    this.getViewsByOnlyRole(viewType, resourceType, resourceId, function(view) {
      var json = JSON.parse(view.content);
      json.cells.sort(function(a,b){
        return parseInt(a.z) - parseInt(b.z);
      });
      json.cells.forEach(function(cell) {
        if(cell.type == "basic.Rect" && cell.kpiId && cell.kpiId.length > 8 && cell.nodeId && cell.nodeId.length > 8) {
          var kpiId;
          if (typeof cell.kpiId == "string" && cell.kpiId.search('number:') > -1) {
            kpiId = Number(cell.kpiId.split(":")[1]);
          } else {
            kpiId = Number(cell.kpiId);
          }
          var modelId
          if (typeof cell.modelId == "string" && cell.modelId.search('number:') > -1) {
            modelId = Number(cell.modelId.split(":")[1]);
          } else {
            modelId = Number(cell.modelId);
          }
          var kpiDef = {};
          if (resourceUIService.rootModelsDic && resourceUIService.rootModelsDic[modelId]) {
            if (resourceUIService.rootModelsDic[modelId].kpiDic && resourceUIService.rootModelsDic[modelId].kpiDic[kpiId]) {
              kpiDef = resourceUIService.rootModelsDic[modelId].kpiDic[kpiId];
            }
          }
          kpiCodes.push(kpiId);
          valueDic[kpiId] = {
            kpiName:cell.attrs.text.text?cell.attrs.text.text:kpiDef.label,
            kpiUnit:cell.unitType == "number:1"?(kpiDef.unitLabel?kpiDef.unitLabel:""):"",
            value:"无",
            kpiCode:kpiDef.id,
            rangeObj:kpiDef.rangeObj
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
            if (valueDic[kpi.kpiCode].rangeObj)
              valueDic[kpi.kpiCode].value = valueDic[kpi.kpiCode].rangeObj[valueDic[kpi.kpiCode].value];
          });
          var returnAry = [];
          for (var key in valueDic) {
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
        if(typeof socketCallback == "function"){
          if (valueDic[event.data.kpiCode].rangeObj)
            event.data.value = valueDic[event.data.kpiCode].rangeObj[event.data.value];
          socketCallback(event.data);
        }
      });
      SwSocket.send(uuid, operation, 'kpi', paramSocket);
      /**
       * PROMETHEUS-586 
       * 注销scope时注销方法heartBeat，回调函数callback
       */
      $('#free-board').on('naviClick', function() {
        console.log("on-destroy");
        SwSocket.unregister(uuid);
      });
    });
  };

  cmethod.prototype.filterEnterprises = function(callback) {
    var domainPath = userLoginUIService.user.domains;
    energyConsumeUIService.findEnterpriseInfoByDomainPath(domainPath, function(returnObj) {
      if (returnObj.code == 0) {
        returnObj.data.valueCode = returnObj.data.industryType;
        cmethod.prototype.queryEnterpriseListByHis(returnObj.data, function(eventData) {
          console.log(eventData);
          callback(eventData);
        });
      }
    });
  };
  cmethod.prototype.queryEnterpriseListByHis = function(shortName, callback) {
    if (!shortName) {
      growl.warning("请选择行业");
      return;
    }
    var industryShortType = shortName.valueCode;
    //获取所有企业
    var queryEnterprises = [];
    (function queryAllEnterprises() {
      energyConsumeUIService.findEnterpriseInfos(function(returnObj) {
        if (returnObj.code == 0) {
          returnObj.data.forEach(function(item) {
            if (item.industryType == industryShortType) {
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
        if (returnObj.code == 0) {
          index++;
          var ary = returnObj.data.filter(function(item) {
            return item.modelDefinitionId == filter.modelId;
          });
          ary.forEach(function(item) {
            nodeIdAry.push(item.id);
          });
          if (index == filter.enterpriseList.length) {
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
        resources.sort(doubleCompare(["values","index"],"desc"));
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
        directives.sort(doubleCompare(["values","index"],"desc"));
        var kpis = directives.map(function(elem){
          if(elem.params){
            if(elem.params[0]){
              return elem.params[0].id;
            } else {
              console.log(elem);
              return 0;
            }
          } else {
            return 0;
          }
        });
        console.log(kpis);
        var ci = [parseInt(resourceId)];
        cur.getKpiValueCi(ci, kpis, function(event){
          var loop = function(item){
            var directive = directives.find(function(elem){
              if(elem.params[0]){
                return elem.params[0].id == item.kpiCode;
              } else {
                return false;
              }
            });
            if(directive){
              directive.value = item.value;
            }
          };
          for(var i in event){
            loop(event[i]);
          };
          callback(directives);
        });

      });
    });
  };
  cmethod.prototype.getDirectivesByModelId = function(modelId, callback) {
    if(modelId){
      resourceUIService.getDirectivesByModelId(modelId, function(event) {
        if(event.code == 0) {
          callback(event.data);
        }
      })
    } else {
      callback([]);
    }
  };
  cmethod.prototype.queryBenchmarkByShortName = function(shortName, callback) {
    var industryDic = {};
    var energyDic = {};
    var industryShortType = [];
    var energyType = [];
    dictionaryService.getAllDicts(function(returnObj) {
      if (returnObj.code == 0) {
        returnObj.data.forEach(function(item) {
          if (item.dictCode == 'industryShortType') {
            industryShortType.push(item);
          } else if (item.dictCode == 'energyType') {
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
        if (returnObj.code == 0) {
          returnObj.data.forEach(function(item) {
            var instanceAry = item.instance.split(',');
            item.instanceName = industryDic[instanceAry[0]].param;
            item.instanceCode = industryDic[instanceAry[0]].valueCode;
            item.energyName = instanceAry[1];
            item.energyCode = energyDic[instanceAry[1]].valueCode;
            if (shortName.label == instanceAry[0]) {
              returnAry.push(item);
            }

          });
          callback(returnAry);
        }
      })
    };
  };

  return cmethod
});