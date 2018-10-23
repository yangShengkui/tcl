define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.controller('AppNavCtrl', ['$scope', '$q', 'ngDialog', '$location', 'Info', 'alertService', 'userLoginUIService', 'viewFlexService', 'unitService', 'configUIService',
    'resourceUIService', 'dictionaryService', 'ticketTaskService', '$route', '$timeout', '$rootScope', 'growl', 'userUIService', '$controller', 'SwSocket', 'kpiDataService',
    function($scope, $q, ngDialog, $location, Info, alertService, userLoginUIService, viewFlexService, unitService, configUIService,
             resourceUIService, dictionaryService, ticketTaskService, route, timeout, $rootScope, growl, userUIService, $controller, SwSocket, kpiDataService) {
      var dialogInstance; // 弹出框实例
      var localmodel = false; // 本地测试模式，默认false
      var menuDisplayAlertCount = false; //菜单是否显示告警数量

      $scope.criticalCount = 0; // 菜单栏严重告警个数，已废止
      $scope.orderCount = 0; // 待处理工单，已废止

      $scope.myOptions; // 数据项单位集合
      $scope.myOptionDic; // 数据项单位字典

      $scope.myDicts; // 配置项字典

      $scope.provinces; // 省级区域集合
      $scope.citys; // 市级区域集合
      $scope.districts; // 县级区域集合
      $scope.cityDics; // 市级区域字典
      $scope.districtDics; // 县级区域字典

      $scope.alertView = []; //告警视图集合
      $scope.designView = []; //性能视图集合

      $scope.enterpriseType = 0; // 企业类型

      $scope.loadingShow = false; //true 显示loading false 隐藏

      $scope.localMenuCode = "F01"; //判断使用哪一个服务中心，用来替代localIndex
      $rootScope.menuitems = $scope.menuitems = {}; //菜单权限的集合
      $scope.currentMenuCode = null; //当前的菜单编码
      $scope.firstMenuCode = null; //第一层的菜单编码

      $scope.treeviewIndex = ""; //当前的url路径
      $scope.oldTreeviewIndex = ""; //上一个url路径

      $scope.showMenu = false;

      $scope.getAllUserInfo; //用户信息集合

      $rootScope.rootModelsDic = {}; // 全局的设备模板字典

      // 全局的ngDialog关闭方法
      $scope.closeDialog = function() {
        ngDialog.close();
      };

      // 全局的跳转回官网方法
      $scope.gotoHomePage = function() {
        if(userLoginUIService.user.enterprise.logoStatus != '0') {
          location.href = "http://www.proudsmart.com";
        }
      };

      $scope.gotoAppPage = function() {
        location.href = "index.html";
      };

      $scope.showMenuFun = function() {
        $scope.showMenu = !$scope.showMenu;
      };

      $scope.logout = function() {
        userLoginUIService.logout();
      };

      $scope.onViewLoad = function() {
        console.log('view changed');
      };

      $scope.menusFilter = function(item) {
        return item.functionCode.charAt(0) === "S";
      };

      $scope.publicTableSearch = function(tabelname, value) {
        $scope.$broadcast('table-search-handle', {
          name: tabelname,
          value: value
        });
      };

      // 获得基础配置
      Info.get("../localdb/info.json", function(info) {
        if($scope.baseConfig) {
          delete info.customerConfig;
          delete info.projectConfig;
          $scope.baseConfig = jQuery.extend(true, $scope.baseConfig, info);
        } else {
          $scope.baseConfig = info;
        }
      });

      // 获得KPI的图片配置
      Info.get("../localdb/icon.json", function(info) {
        $scope.kpiIconList = info.kpiIcon;
      });

      /**
       * 判断未登录后如何处理
       * localmodel＝true 本地测试使用
       */
      function showLogin() {
        if(!localmodel) {
          return;
        }
        dialogInstance = BootstrapDialog.show({
          title: '欢迎来到普奥的世界',
          closable: false,
          message: function(dialog) {
            var $message = $('<div></div>');
            var pageToLoad = dialog.getData('pageToLoad');
            $message.load(pageToLoad);

            return $message;
          },
          data: {
            'pageToLoad': 'partials/login.html'
          },
          buttons: [{
            label: '登录',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              var userInput = document.getElementById('username');
              var psdInput = document.getElementById('password');
              userLoginUIService.login(userInput.value, psdInput.value);
            }
          }, {
            label: '退出',
            action: function(dialogRef) {
              dialogRef.close();
              location.href = "../index.html"
            }
          }]
        });
      };

      function initUnit(callbackFun,defereds) {
        var defered = $q.defer();
        defereds.push(defered.promise);
        unitService.getAllUnits(function(returnObj) {
          if(returnObj.code == 0) {
            unitService.units = returnObj.data;
            $scope.myOptions = returnObj.data;
            unitService.unitDics = {};
            for(var i in $scope.myOptions) {
              unitService.unitDics[$scope.myOptions[i].unitCode] = $scope.myOptions[i].unitName;
              if($scope.myOptions[i].unitCode == "NA" || $scope.myOptions[i].unitCode == "Number")
                unitService.unitDics[$scope.myOptions[i].unitCode] = "";
            }
            $scope.myOptionDic = unitService.unitDics;
            defered.resolve('success');
            if(callbackFun) {
              callbackFun();
            }
          }
        });
        dictionaryService.getAllDicts(function(returnObj) {
          if(returnObj.code == 0) {
            dictionaryService.dicts = returnObj.data;
            $scope.myDicts = returnObj.data;
            var dic = {};
            for(var i in returnObj.data) {
              var obj = returnObj.data[i];
              if(dic[obj.dictCode]) {
                dic[obj.dictCode].push(obj);
              } else {
                dic[obj.dictCode] = [];
                dic[obj.dictCode].push(obj);
              }
            }
            for(var items in dic) {
              $scope.myDicts[items] = dic[items];
            }
          }
        });

        userUIService.queryUserByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            var getAllUserInfoList = returnObj.data;
            for(var i in getAllUserInfoList) {
              getAllUserInfoList[getAllUserInfoList[i].loginName] = getAllUserInfoList[i].userName;
            }
            $scope.getAllUserInfo = getAllUserInfoList;
          }
        })

        if(!resourceUIService.hasOwnProperty("provinces")) {
          resourceUIService.getSimpleDistricts(function(returnObj) {
            if(returnObj.code == 0) {
              resourceUIService.provinces = returnObj.data;
              $scope.provinces = returnObj.data;
              $scope.cityDics = {};
              $scope.districtDics = {};
              //查询的时候会有null 的状态
              if(returnObj.data) {
                $scope.provinces.forEach(function(province) {
                  $scope.cityDics[province.id] = province.children;
                  province.children.forEach(function(city) {
                    $scope.districtDics[city.id] = city.children;
                  })
                })
              }
            }
          });
        };

        resourceUIService.getAllDataTypes(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.allDataTypes = returnObj.data;
          }
        });
      };

      function initRootDomain() {
        resourceUIService.getRootDomain(function(returnObj) {
          if(returnObj.code == 0) {
            if(returnObj.data) {
              $scope.rootCi = returnObj.data.id;
            } else {
              growl.error("当前用户不存在rootCi，请联系客服处理。", {});
            }
          }
        });
      };

      /**
       * 获得基本的模型定义，包括：
       * 测点定义
       * 指令定义
       * 属性定义
       */
      function initRootModels() {
        resourceUIService.rootModelsDic = $rootScope.rootModelsDic;
        resourceUIService.getModelsByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.push({id: 0});
            returnObj.data.push({
              id: 300,
              label: "管理域类型"
            });
            if($scope.baseConfig && $scope.baseConfig.customerConfig && $scope.baseConfig.customerConfig.display) {
              returnObj.data.push({
                id: 301,
                label: ($scope.menuitems['S12'] && $scope.menuitems['S12'].label ? $scope.menuitems['S12'].label : '客户') + "域类型"
              });
            };
            if($scope.baseConfig && $scope.baseConfig.projectConfig && $scope.baseConfig.projectConfig.display) {
              returnObj.data.push({
                id: 302,
                label: ($scope.menuitems['S13'] && $scope.menuitems['S13'].label ? $scope.menuitems['S13'].label : '项目') + "域类型"
              });
            };
            returnObj.data.push({
              id: 305,
              label: "网关域类型"
            });
            returnObj.data.forEach(function(model) {
              if(!$rootScope.rootModelsDic[model.id]) $rootScope.rootModelsDic[model.id] = {};
              $rootScope.rootModelsDic[model.id].model = model;
            })

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
            var includeFields = "includeFields=" + include.toString();
            resourceUIService.getDataItemsByModelId(-1, function(subReturnObj) {
              if(subReturnObj.code == 0) {
                subReturnObj.data.forEach(function(kpiDef) {
                  if(!$rootScope.rootModelsDic[kpiDef.modelId]) return;
                  if(!$rootScope.rootModelsDic[kpiDef.modelId].kpiDic) $rootScope.rootModelsDic[kpiDef.modelId].kpiDic = {};
                  if(!$rootScope.rootModelsDic[kpiDef.modelId].kpiNameDic) $rootScope.rootModelsDic[kpiDef.modelId].kpiNameDic = {};
                  if(!$rootScope.rootModelsDic[kpiDef.modelId].kpiLabelDic) $rootScope.rootModelsDic[kpiDef.modelId].kpiLabelDic = {};
                  kpiDef.text = kpiDef.label;
                  if($scope.myOptionDic[kpiDef.unit])
                    kpiDef.unitLabel = $scope.myOptionDic[kpiDef.unit];
                  var regExp = /\{|\[.*\}|\]/;
                  if(kpiDef.range) {
                    var find = regExp.test(kpiDef.range);
                    var rangeObj = [];
                    if(find) {
                      try {
                        rangeObj = find ? JSON.parse(kpiDef.range) : [];
                      } catch(e) {}
                    }
                    kpiDef.rangeAry = rangeObj;
                    if(rangeObj instanceof Array) {
                      kpiDef.rangeAry = rangeObj;
                      if(rangeObj.length == 2) {
                        kpiDef.min = rangeObj[0];
                        kpiDef.max = rangeObj[1];
                      }
                    } else if(rangeObj instanceof Object) {
                      kpiDef.rangeObj = rangeObj;
                    }
                  }
                  $rootScope.rootModelsDic[kpiDef.modelId].kpiDic[kpiDef.id] = kpiDef;
                  $rootScope.rootModelsDic[kpiDef.modelId].kpiNameDic[kpiDef.name] = kpiDef;
                  $rootScope.rootModelsDic[kpiDef.modelId].kpiLabelDic[kpiDef.label] = kpiDef;
                })

                if ($rootScope.rootModelsDic[0] && $rootScope.rootModelsDic[0].kpiDic) {
                  for (var k in $rootScope.rootModelsDic[0].kpiDic) {
                    var kpi = $rootScope.rootModelsDic[0].kpiDic[k];
                    if (kpi.modelIdList.indexOf(300) > -1) {
                      if (!$rootScope.rootModelsDic[300].kpiDic) $rootScope.rootModelsDic[300].kpiDic = {}
                      $rootScope.rootModelsDic[300].kpiDic[kpi.id] = kpi;
                    }
                    if(kpi.modelIdList.indexOf(301) > -1) {
                      if ($rootScope.rootModelsDic[301]) {
                        if(!$rootScope.rootModelsDic[301].kpiDic) $rootScope.rootModelsDic[301].kpiDic = {}
                        $rootScope.rootModelsDic[301].kpiDic[kpi.id] = kpi;
                      }
                    }
                    if(kpi.modelIdList.indexOf(302) > -1) {
                      if ($rootScope.rootModelsDic[302]) {
                        if(!$rootScope.rootModelsDic[302].kpiDic) $rootScope.rootModelsDic[302].kpiDic = {}
                        $rootScope.rootModelsDic[302].kpiDic[kpi.id] = kpi;
                      }
                    }
                  }
                }
                if(!$rootScope.rootModelsDic[305].kpiDic) $rootScope.rootModelsDic[305].kpiDic = {}
                delete $rootScope.rootModelsDic[0];

                //添加在线状态
                for (var k in $rootScope.rootModelsDic) {
                  if ($rootScope.rootModelsDic[k].kpiDic) {
                    $rootScope.rootModelsDic[k].kpiDic[999998] = {
                      id:999998,
                      label:'在线状态',
                      uid:999998
                    }
                  }
                }

                $rootScope.rootModelsDic["kpiDefloaded"] = true;
                //通知监听的地方，模板上的定义已经加载完成
                $scope.$broadcast('kpiDefLoadFinished');
              }
            },includeFields)

            //获得所有模板的属性
            resourceUIService.getAllAttrs(function(subReturnObj) {
              if(subReturnObj.code == 0) {
                subReturnObj.data.forEach(function(attrDef) {
                  if(!$rootScope.rootModelsDic[attrDef.modelId]) return;
                  if(!$rootScope.rootModelsDic[attrDef.modelId].attrs) $rootScope.rootModelsDic[attrDef.modelId].attrs = [];
                  $rootScope.rootModelsDic[attrDef.modelId].attrs.push(attrDef);
                })
              }
            });

            //-1表示获得所有模板的指令
            resourceUIService.getDirectivesByModelId(-1, function(subReturnObj) {
              if(subReturnObj.code == 0) {
                subReturnObj.data.forEach(function(dirDef) {
                  if(!$rootScope.rootModelsDic[dirDef.modelId]) return;
                  if(!$rootScope.rootModelsDic[dirDef.modelId].directives) $rootScope.rootModelsDic[dirDef.modelId].directives = [];
                  $rootScope.rootModelsDic[dirDef.modelId].directives.push(dirDef);
                })
              }
            });
          }
        })
      }

      function initCount() {
        if(menuDisplayAlertCount) {
          var params = {};
          params.states = "0";
          alertService.countFromCache(params, function(returnObj) {
            if(returnObj.code == 0) {
              $scope.criticalCount = returnObj.data.criticalCount;
            }
          });
          //获取执行中工单
          var status = 100;
          ticketTaskService.getTicketsByStatus(status, function(m) {
            if(m.code == 0) {
              $scope.orderCount = m.data.length;
            }
          });
        }
      };

      function initViews() {
        $scope.alertView = [];
        $scope.designView = [];
        $scope.dashboardView = [];
        viewFlexService.getAllMyViews(function(returnObj) {
          if(returnObj.code == 0) {
            var v = returnObj.data;
            var viewList = [];
            for(var i = 0; i < v.length; i++) {
              var view = v[i];
              if(view) {
                viewList.push(view);
                var description = {};
                if(typeof view.description == "string") {
                  var objectLike = /^\{(.|\n)*\}$/;
                  var reg = objectLike.test(view.description)
                  if(reg) {
                    description = JSON.parse(view.description);
                  }
                }
                if(view.viewType == "designView") {
                  var viewmenus = {
                    "title": view.viewTitle.split("?")[0],
                    "url": "#/" + view.viewType + "/" + view.viewId,
                    "viewId": view.viewId,
                    "view": view,
                    "status": description['status'],
                    "statusBg": description["status"] == 1 ? 'bg-red' : (description["status"] == 2 ? 'bg-green' : ''),
                    "statusLab": description["status"] == 1 ? '授权' : (description["status"] == 2 ? '购买' : ''),
                    "icon": "fa fa-area-chart"
                  };
                  $scope.designView.push(viewmenus);

                } else if(view.viewType == "configAlert") {
                  var viewmenus = {
                    "title": view.viewTitle.split("?")[0],
                    "url": "#/" + view.viewType + "/" + view.viewId,
                    "viewId": view.viewId,
                    "view": view,
                    "status": description["status"],
                    "statusBg": description["status"] == 1 ? 'bg-red' : (description["status"] == 2 ? 'bg-green' : ''),
                    "statusLab": description["status"] == 1 ? '授权' : (description["status"] == 2 ? '购买' : ''),

                    "icon": "fa fa-warning"
                  };
                  if(viewmenus.title == "全部告警") {
                    $scope.alertView.splice(0, 0, viewmenus);
                  } else {
                    $scope.alertView.push(viewmenus);
                  }
                } else if(view.viewType == "dashboard") {
                  view.label = view.viewTitle;
                  view.show = true;
                  $scope.dashboardView.push(view);
                }
              }
            }

            viewFlexService.viewLoadFinished = true;
            viewFlexService.viewList = viewList;
            $scope.viewList = viewList;
            $scope.$broadcast('viewLoadFinished');
          }
        });
      };

      function initConfigManager(callbackFun,defereds) {
        var defered = $q.defer();
        defereds.push(defered.promise);
        configUIService.getConfigsByGroupName("EnterpriseConfig", function(returnObj) {
          if(returnObj.code == 0) {
            if(returnObj.data && returnObj.data.length > 0) {
              returnObj.data.forEach(function(item) {
                try {
                  if($scope.baseConfig) {
                    $scope.baseConfig = jQuery.extend(true, $scope.baseConfig, JSON.parse(item.value));
                  } else {
                    $scope.baseConfig = JSON.parse(item.value);
                  }
                  if($scope.baseConfig) { //拥有企业设置
                    if($scope.baseConfig.title)
                      $("title").html($scope.baseConfig.title);
                    else
                      $("title").html("");
                    if($scope.baseConfig.shortcut)
                      $("link[rel='shortcut icon']").attr("href", $scope.baseConfig.shortcut + "?" + new Date().getTime());
                    else
                      $("link[rel='shortcut icon']").attr("href", "../login/images/shortcut_null.png" + "?" + new Date().getTime());
                  }
                  configUIService.baseConfig = $scope.baseConfig;
                } catch(e) {}
              });
            } else {
              $("title").html("");
              $("link[rel='shortcut icon']").attr("href", "../login/images/shortcut_null.png" + "?" + new Date().getTime());
            }
            defered.resolve('success');
            callbackFun();
          }
        });
      };


      var domainTreeQuery = function () {
        // 获取当前用户的domains
        var domainsArr = userLoginUIService.user.domains.split("/");
        var domainListTree = {};
        for (var i = 2; i < domainsArr.length - 1; i++) {
          resourceUIService.getResourceById([domainsArr[i]], function (tc) {
            domainListTree[tc.data.domainPath] = tc.data;
            domainListTree[tc.data.id] = tc.data;
          })
        }
        resourceUIService.getDomainsByFilter({}, function (tc) {
          for (var i in tc.data) {
            domainListTree[tc.data[i].domainPath] = tc.data[i];
            domainListTree[tc.data[i].id] = tc.data[i];
          }
          $rootScope.domainListDic = domainListTree;
        });
      };
      function initUserObjects() {
        var defereds = [];
        initConfigManager(function() {
          userLoginUIService.initMenus($scope, $location);
          /*注入控制用的，长江专用
          $controller('LinkOrderCtrl', {
            $scope: $scope,
            SwSocket: SwSocket,
            resourceUIService: resourceUIService,
            kpiDataService: kpiDataService,
            growl: growl
          });
          */
        },defereds);
        initUnit(function() {},defereds);
        var defered = $q.defer();
        defereds.push(defered.promise);
        $scope.$watch("menuitems.isloaded",function(n, o){
          //菜单加载完毕
          if(n){
            defered.resolve("success")
          }
        })
        $q.all(defereds).then(function(result){
          initRootModels()
        })

        initViews();
        initRootDomain();
        initCount();
        //initDefaultKpis(); 已经迁移到设备模板管理controller
        domainTreeQuery();
      };

      // 路由跳转成功后触发
      $scope.$on('$routeChangeSuccess', function() {
        userLoginUIService.rootHandler($scope, $location);
      });

      // 监听用户登录状态
      $scope.$on('loginStatusChanged', function(evt, d) {
        if(userLoginUIService.user.isAuthenticated) {
          if(dialogInstance) {
            dialogInstance.close();
          }
          $scope.userInfo = userLoginUIService.user;
          $scope.lastLoginTime = newDateJson(userLoginUIService.user.lastLoginTime).Format(GetDateCategoryStrByLabel());
          if(userLoginUIService.user.enterprise)
            $scope.enterpriseType = userLoginUIService.user.enterprise.enterpriseType;
          initUserObjects();
        } else {
          $scope.userInfo = {};
          $scope.lastLoginTime = "";
          showLogin();
        }
      });
        $scope.uniqueJsonArray = function(array, key){//json 数组去重
            var result = [array[0]];
            for(var i = 1; i < array.length; i++){
                var item = array[i];
                var repeat = false;
                for (var j = 0; j < result.length; j++) {
                    if (item[key] == result[j][key]) {
                        repeat = true;
                        break;
                    }
                }
                if (!repeat) {
                    result.push(item);
                }
            }
            return result;
        }
    }
  ]);

  controllers.controller('AppUploadCtrl', ['$scope', 'growl', 'FileUploader',
    function($scope, growl, FileUploader) {
      $scope.fileMaxSize = $scope.fileMaxSize ? $scope.fileMaxSize : 1;
      $scope.fileFormat = $scope.fileFormat ? $scope.fileFormat : "jpg、png、jpeg、bmp、gif、svg";
      $scope.queueLimit = $scope.queueLimit ? $scope.queueLimit : 1;
      var uploader = $scope.uploader = new FileUploader({
          url: $scope.serviceOrigin,
          withCredentials: true,
          removeAfterUpload: true //上传后删除文件
      });

        uploader.fileBelongDic = {};

        // FILTERS
        uploader.filters.push({
        name: 'fileFilter',
        fn: function(item, options) {
          var nameAry = item.name.split(".");
          var type = nameAry[nameAry.length - 1];
          if($scope.fileFormat.indexOf(type) == -1) {
            growl.warning("文件格式仅支持" + $scope.fileFormat + "文件，请重新选择", {});
            return false;
          }
          if((item.size / 1024) > $scope.fileMaxSize * 1000) {
            growl.warning("您选择的文件大于" + $scope.fileMaxSize + "M，请重新选择", {});
            return false;
          }
          return true;
        }
      });

      // CALLBACKS
      uploader.onWhenAddingFileFailed = function(item, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
      };
      uploader.onAfterAddingFile = function(fileItem) {
        if(uploader.queue.length > $scope.queueLimit)
          uploader.removeFromQueue(uploader.queue.length.length - 1);
        console.info('onAfterAddingFile', fileItem);
      };
      uploader.onAfterAddingAll = function(addedFileItems) {
        if(uploader.fileBelongId) {
          uploader.fileBelongDic[uploader.fileBelongId] = addedFileItems;
        }
        $scope.$broadcast("onAfterAddingAll", {
          addedFileItems: addedFileItems
        });
        console.info('onAfterAddingAll', addedFileItems);
      };
      uploader.onBeforeUploadItem = function(item) {
        Array.prototype.push.apply(item.formData, uploader.formData);
        console.info('onBeforeUploadItem', item);
      };
      uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
      };
      uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
      };
      uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
      };
      uploader.onErrorItem = function(fileItem, response, status, headers) {
        growl.warning("上传文件失败", {});
        $scope.loadingShow = false;
        console.info('onErrorItem', fileItem, response, status, headers);
      };
      uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
      };
      uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        uploader.formData = []; //清空参数
        if(response) {
          if(response.code == 0)
            $scope.$broadcast("uploadTemplate", {
              state: true,
              response: response
            });
          else
            growl.error(response.message, {});
          $scope.loadingShow = false;
        } else {
          growl.error("操作异常了，尝试重新刷新", {});
        }
      };
      uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
      };
      uploader.uplaodHandler = function() {
        uploader.uploadAll();
        scope.loadingShow = true;
        uploader.fileBelongDic = {};
        uploader.fileBelongId = "";
      }
      uploader.clearHandler = function() {
        uploader.clearQueue();
        uploader.fileBelongDic = {};
        uploader.fileBelongId = "";
      }
      uploader.growl = function(msg) {
        growl.info(msg, {});
      }
    }
  ]);
});