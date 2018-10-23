define(['controllers/controllers', 'bootstrap-dialog'], function (controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('reportTemplateCtrl', ['$scope', "$routeParams", 'ngDialog', 'FileUploader', 'userLoginUIService',
    'userDomainService', 'reportFlexService', 'reportUIService', 'growl', 'customerUIService', 'projectUIService','configUIService',
    function ($scope, $routeParams, ngDialog, FileUploader, userLoginUIService, userDomainService,
              reportFlexService, reportUIService, growl, customerUIService, projectUIService,configUIService) {
      var uploader = $scope.uploader = new FileUploader({
        url: reportFlexService.origin + '/api/rest/uploadReport/reportUIService/updateTemplateFileName',
        withCredentials: true
      });
      var fileSize = 50;
      // FILTERS
      uploader.filters.push({
        name: 'fileFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
          var nameAry = item.name.split(".");
          var type = nameAry[nameAry.length - 1];
          if ((item.size / 1024) > fileSize * 1024) {
            growl.warning("您选择的文件大于" + fileSize + "M，请重新选择", {});
            return false;
          }
          if (type != 'zip' && type != 'jrxml') {//zip文件功能暂时没做，先去掉后期后端功能实现之后重新加上
            //if(type != 'jrxml') {
            //growl.warning("文件格式仅支持jrxml文件，请重新选择", {});
            growl.warning("文件格式仅支持jrxml和zip文件，请重新选择", {});
            return false;
          }
          return true;
        }
      });

      // CALLBACKS
      uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        uploader.clearQueue();
        uploader.destroy();
        console.info('onWhenAddingFileFailed', item, filter, options);
      };
      uploader.onAfterAddingFile = function (fileItem) {
        $scope.selectedTemplate.tplFileName = fileItem._file.name;
        uploader.queue[0].file.name = fileItem._file.name;
        console.info('onAfterAddingFile', fileItem);
      };
      uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
      };
      uploader.onBeforeUploadItem = function (item) {
        item.formData = [];
        Array.prototype.push.apply(item.formData, uploader.formData);
        console.info('onBeforeUploadItem', item);
      };
      uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
      };
      uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
      };
      uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // if(response.code != 0){
        //   growl.warning(response.message,{})
        // }

        console.info('onSuccessItem', fileItem, response, status, headers);
      };
      uploader.onErrorItem = function (fileItem, response, status, headers) {
        growl.warning("上传模版文件失败", {})
        console.info('onErrorItem', fileItem, response, status, headers);
      };
      uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
      };
      uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        var nameAry = fileItem.file.name.split(".");
        var tTemplRelPath = '/' + nameAry[0] + '/' + fileItem.file.name;
        reportFlexService.getReportTemplateMeta(response.file, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.selectedTemplate.tplFileName = response.file;
            $scope.selectedTemplate.reportParams = returnObj.data.reportParams;
            $scope.$broadcast("uploadTemplate", true);
            uploader.clearQueue(); //清空上传队列
          }
        });
      };

      uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
      };

      $scope.clearUploader = function () {
        uploader.clearQueue();
      }

      function getShowType(classType) {
        var showtype = "";
        switch (classType) {
          case "java.lang.String":
            showtype = "STRING";
            break;
          case "java.sql.Date":
          case "java.sql.Time":
          case "java.sql.Timestamp":
          case "java.util.Date":
            showtype = "DATETIME";
            break;
          default:
            showtype = "STRING";
        }
        return showtype;
      };
      $scope.uploadImage = function (templateId) {
        if (uploader.queue.length == 0) {
          $scope.$broadcast("uploadTemplate", true);
          return;
        }
        var formObj = {
          "templateId": templateId
        };
        uploader.formData = [];
        uploader.formData.push(formObj);
        uploader.uploadAll();
      };

      $scope.queryDitem = {};

      var initSearch = function () {
        $scope.queryDitem = {
          name: "", // 报表名称
          title: "", // 报表标题
          dataSourceId: "", // 数据源唯一标识
          catalogId: "",
          domainPath: "",
          insertUser: "" //创建人
        };
      }
      $scope.reportDataSourceModel = {
        id: 0,
        name: "",
        driver: "",
        url: "",
        userName: "",
        passWord: ""
      };
      $scope.dataSources = [];
      $scope.dataSourcesDic = {}
      $scope.catalogs = [];
      $scope.catalogsDic = {}
      $scope.reportTemplateModel = {
        id: 0, // 报表ID
        name: "", // 报表名称
        title: "", // 报表标题
        catalogId: 1, // 报表所属分类ID
        catalogName: "", //报表所属分类名称
        dataSourceId: 1, // 数据源唯一标识
        dataSourceName: "", //数据源名称
        tplFileName: "", // 报表模板文件名称
        folder: "", //模板报表所在的目录(不保存在数据库中)
        insertUser: "", //创建人
        updateUser: "", //修改人
        insertTime: new Date(), //创建时间
        updateTime: null, //修改时间
        reportParams: [], // 报表的参数信息。
        reportParamXML: "",
        columns: [],
        existBuildPolicy: 0, //判断模板是否设置发送策略
        zipFileName: "", // Zip压缩文件
        fileName: "", //文件名 前端用
        domainPath: "", // 数据域
        domain: "",
        isEdit: 3
      };
      $scope.selectedTemplate; //选中的对象
      $scope.reportTemplates;
      $scope.goSearch = function () {
        var obj = {};
        if (!$scope.queryDitem.domainPath || $scope.queryDitem.domainPath == undefined) {
          obj = jQuery.extend(true, {}, $scope.queryDitem);
          obj["domainPath"] = userLoginUIService.user.domainPath;
        } else {
          obj = $scope.queryDitem;
        }
        reportFlexService.getReportTemplatesByCondition(obj, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              // item.domainPath = item.domain;
              item.fileName = item.tplFileName ? item.tplFileName : item.zipFileName;
            });
            $scope.reportTemplates = returnObj.data;
            $scope.$broadcast(Event.REPORTMODULE + "_template", {
              "data": $scope.reportTemplates
            });
          }
        });
      };
      //取消参数的时候清空selectedTemplate
      $scope.closeParams = function () {
        $scope.closeDialog();
        $scope.selectedTemplate = null;
        var dataSources = [];
        for (var k in $scope.dataSourcesDic) {
          dataSources.push($scope.dataSourcesDic[k])
        }
        $scope.dataSources = dataSources;
      }
      $scope.goClear = function () {
        initSearch();
      };
      $scope.addtemplate = function () {
        if ($scope.selectedTemplate) {
          growl.warning("当前有未保存的数据");
          return;
        }
        
        if (!$scope.reportTemplates) $scope.reportTemplates = [];
        $scope.selectedTemplate = jQuery.extend({}, $scope.reportTemplateModel);
        $scope.reportTemplates.unshift(jQuery.extend({}, $scope.reportTemplateModel));
        $scope.$broadcast(Event.REPORTMODULE + "_template", {
          "data": $scope.reportTemplates
        });
      };
      $scope.updateParams = function () {
        reportFlexService.updateReportTemplate($scope.selectedTemplate, function (returnObj) {
          if (returnObj.code == 0) {
            growl.success("参数设置更新成功", {});
            $scope.selectedTemplate = null;
            $scope.closeDialog();
          }
        });
      }
      $scope.doAction = function (type, select, callback) {
        if (type == "saveTemplate") {
          var unbindHandler = $scope.$on("uploadTemplate", function (event, args) {
            // select.reportParamXML = null;
            reportFlexService.updateReportTemplate($scope.selectedTemplate, function (returnObj) {
              if (returnObj.code == 0) {
                // $scope.uploadImage(returnObj.data.id);
                if (select.id == 0) {
                  growl.success("添加报表模板成功", {});
                } else {
                  growl.success("更新报表模板成功", {});
                }
                if (callback) {
                  callback(returnObj.data);
                }
                unbindHandler();
              }
            });
          });
          // var unbindHandler = $scope.$on("uploadTemplate", function (event, args) {
          select.zipFileName = $scope.selectedTemplate.zipFileName;
          select.tplFileName = $scope.selectedTemplate.tplFileName;
          select.reportParams = $scope.selectedTemplate.reportParams;
          if (select.id == 0) {
            select.tplFileName = "";
            // select.domain = userLoginUIService.user.domainPath;
            reportFlexService.addReportTemplate(select, function (returnObj) {
              if (returnObj.code == 0) {
                $scope.uploadImage(returnObj.data.id);
                $scope.selectedTemplate = returnObj.data;
                returnObj.data.fileName = returnObj.data.tplFileName ? returnObj.data.tplFileName : returnObj.data.zipFileName;
              }
            });
          } else {
            $scope.uploadImage(select.id);
          }
          //执行完成后就把该事件解绑
          // unbindHandler();
          // });
          // $scope.uploadImage(select.id);
        } else if (type == "deleteTemplate") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认删除报表模板吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function (dialogRef) {
                reportFlexService.deleteReportTemplate(select.id, function (returnObj) {
                  if (returnObj.code == 0) {
                    for (var i = $scope.reportTemplates.length - 1; i > -1; i--) {
                      if ($scope.reportTemplates[i].id == select.id) {
                        $scope.reportTemplates.splice(i, 1);
                      }
                    }
                    $scope.selectedTemplate = null;
                    growl.success("删除报表模板成功", {});
                    if ($scope.reportTemplates.length <= 0) {
                      $scope.$broadcast(Event.REPORTMODULE + "_template", {
                        "data": $scope.reportTemplates
                      });
                    }
                    if (callback) {
                      callback(true);
                    }
                  }
                });
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function (dialogRef) {
                dialogRef.close();
              }
            }]
          });
        } else if (type == "paramsHandler") {
          $scope.selectedTemplate = select;
          var showWin = function () {
            ngDialog.open({
              template: '../partials/dialogue/report_params_dia.html',
              className: 'ngdialog-theme-plain',
              scope: $scope
            });
          }
          if (!$scope.paramShowList) {
            reportFlexService.getParamShowList(function (returnObj) {

              if (returnObj.code == 0) {
                var list = [];
                list = list.concat(returnObj.data);
                var troubleType = {label: "故障类型", value: "troubleType"};
                var district = {label: "区域", value: "district"};
                var badCategory = {label: "不良类别", value: "badCategory"};
                var years = {label: "年份", value: "years"};
                var quarters = {label: "季度", value: "quarters"};
                var weeks = {label: "周", value: "weeks"};
                list.push(troubleType,district,badCategory,years,quarters,weeks);
                $scope.paramShowList = list;
                showWin();
              }
            });
          } else {
            showWin();
          }
        }
      };
      $scope.addDataSource = function () {
        var find = $scope.dataSources.find(function (item) {
          return item.isEdit == true
        })
        if (find) {
          growl.warning("当前有未保存的", {})
        } else {
          $scope.dataSources.push({
            id: 0,
            isEdit: true
          });
        }

      }
      $scope.delDataSource = function (val) {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          //size:BootstrapDialog.SIZE_WIDE,
          message: '确认删除报表数据源配置吗？之前配置的报表将无法驱动，请慎重！',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function (dialogRef) {
              var index = $scope.dataSources.indexOf(val);
              if (index > -1) {
                $scope.dataSources.splice(index, 1);
                if (val.id > 0) {
                  reportUIService.deleteDataSourceConfig(val.id, function (returnObj) {
                    delete $scope.dataSourcesDic[val.id];
                  })
                } else {
                  $scope.$apply();
                }
                dialogRef.close();
              }
            }
          }, {
            label: '取消',
            action: function (dialogRef) {
              dialogRef.close();
            }
          }]
        });
      }

      $scope.openDataSource = function () {
        ngDialog.open({
          template: '../partials/dialogue/report_datasource_dia.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });
      }

      $scope.editDataSource = function (editItem) {
        var find = $scope.dataSources.find(function (item) {
          return item.isEdit == true
        })
        if (find) {
          growl.warning("当前有未保存的", {})
        } else {
          editItem.isEdit = true;
        }
      }

      $scope.saveDataSource = function (saveItem) {
        var checkNull = function () {
          if (!saveItem.name) {
            growl.warning("数据源名不能为空", {})
            return false;
          }
          if (!saveItem.driver) {
            growl.warning("驱动名不能为空", {})
            return false;
          }
          if (!saveItem.url) {
            growl.warning("URL地址不能为空", {})
            return false;
          }
          return true;
        }
        if (checkNull()) {
          if (!saveItem.driverLabel) saveItem.driverLabel = saveItem.driver;
          if (!saveItem.userName) saveItem.userName = " ";
          if (saveItem.id > 0) {
            reportUIService.updateDataSourceConfig(saveItem, function (returnObj) {
              if (returnObj.code == 0) {
                saveItem.isEdit = false;
                $scope.dataSourcesDic[saveItem.id] = saveItem;
              }
            })
          } else {
            reportUIService.addDataSourceConfig(saveItem, function (returnObj) {
              sourceConfigList();
            })
          }
        }
      }
      //读取数据源列表
      var sourceConfigList = function () {
        $scope.dataSourcesDic = {}
        reportUIService.getDataSourceConfigList(function (data) {
          if (data.code == 0) {
            for (var i in data.data) {
              $scope.dataSourcesDic[data.data[i].id] = data.data[i];
            }
            $scope.dataSources = data.data;
          }
        });
      };

      //读取分类列表
      var catalogList = function () {
        reportUIService.getReportCatalogList(function (data) {
          if (data.code == 0) {
            for (var i in data.data) {
              $scope.catalogsDic[data.data[i].id] = data.data[i];
            }
            $scope.catalogs = data.data;
          }
        });
      };
      //根据用户Id查用户域
      var domainTreeQuery = function () {
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function (data) {
          if (data.code == 0) {
            var domainList = data.data;
            $scope.domainListTree = domainList;
            $scope.domainListDic = data.domainListDic;
            $scope.goSearch();
          }
        });
      };

      /**
       * 获得客户列表
       */
      $scope.customersList;
      $scope.customersDic = {};
      var queryCustomer = function () {
        customerUIService.findCustomersByCondition({}, function (returnObj) {
          $scope.customersDic = returnObj.customerDic;
          returnObj.data.forEach(function (item) {
            item.text = item.customerName;
          })
          $scope.customersList = returnObj.data;
        })
      };
      /**
       * 获得年列表
       */
      var myDate = new Date();
      var b = myDate.getFullYear();
      var newlist = [];
      for(var i=0;i<10;i++){
        var map = {};
        var num = b--;
        map.id = num;
        map.text = num+"年";
        newlist.unshift(map)
      }
      $scope.years = newlist;
      /**
       * 获得周列表
       */
      var weeklist = [];
      for(var i=0;i<52;i++){
        var map = {};
        map.id = "第"+(i+1)+"周";
        map.text = "第"+(i+1)+"周";
        weeklist.push(map);
      }
      $scope.weeks = weeklist;
      /**
       * 获得不良类别列表,获得故障类型列表,区域列表,季度列表
       */
      var queryDatas = function () {
        configUIService.getConfigsByGroupName("reportParams", function (returnObj) {
          if (returnObj.code == 0) {
            var datas = returnObj.data;
            for (var i = 0; i < datas.length; i++) {
              if (datas[i].label == "paramBadCategory") {
                var data2 = datas[i].value;
                var data22 = (new Function('return ' + data2 + ';'))();
                $scope.badCategory = data22;
              } else if (datas[i].label == "paramTroubleType") {
                var data1 = datas[i].value;
                var data11 = (new Function('return ' + data1 + ';'))();
                $scope.troubleType = data11;
              } else if (datas[i].label == "paramDistrict") {
                var data3 = datas[i].value;
                var data33 = (new Function('return ' + data3 + ';'))();
                $scope.district = data33;
              } else if (datas[i].label == "paramQuarters") {
                var data4 = datas[i].value;
                var data44 = (new Function('return ' + data4 + ';'))();
                $scope.quarters = data44;
              }
            }
          }
        });
      }
      /**
       * 获得bool类型的列表
       */
      $scope.bool =[
        {id:"1",text:"是"},
        {id:"0",text:"否"}
      ];
      /**
       * 查询项目
       */
      $scope.projectsList;
      $scope.projectsDic = {};
      $scope.queryProject = function () {
        projectUIService.findProjectsByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              $scope.projectsDic[item.id] = item;
              item.text = item.projectName;
            })
            $scope.projectsList = returnObj.data;
          }
        })
      };
      var init = function () {
        sourceConfigList();
        catalogList();
        // 初始化域目录树
        domainTreeQuery();
        queryCustomer();
        queryDatas();
        $scope.queryProject();
      };

      /**
       * 监听登录状态
       */
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);
  controllers.initController('reportSearchCtrl', ['$scope', "$routeParams", 'userLoginUIService', 'userDomainService',
    'reportFlexService', 'growl', 'userUIService', 'customerUIService', 'projectUIService','configUIService',
    function ($scope, $routeParams, userLoginUIService, userDomainService, reportFlexService, growl, userUIService, customerUIService, projectUIService,configUIService) {

      $scope.iframeSrc = ""
      $scope.queryDitem = {};
      var initSearch = function () {
        $scope.queryDitem = {
          name: "", // 报表名称
          title: "", // 报表标题
          dataSourceId: "", // 数据源唯一标识
          catalogId: "",
          insertUser: "" //创建人
        };
      };

      $scope.goClear = function () {
        $scope.selectedTemplate = {};
      };
      $scope.reportDataSourceModel = {
        id: 0,
        name: "",
        driver: "",
        url: "",
        userName: "",
        passWord: ""
      };

      $scope.dataSources = [{
        dataSourceId: 0,
        dataSourceName: "无数据源",
        driver: "",
        url: "",
        userName: "",
        passWord: ""
      },
        {
          dataSourceId: 1,
          dataSourceName: "postgres",
          driver: "org.postgresql.Driver",
          url: "jdbc\:postgresql\://192.168.1.112\:5432/psiot",
          userName: "postgres",
          passWord: "psiot2015"
        }
      ];
      $scope.dataSourcesDic = {}
      $scope.catalogs = [{
        catalogId: 0,
        catalogName: "无分类"
      }, {
        catalogId: 1,
        catalogName: "默认分类"
      }];
      $scope.catalogsDic = {};
      $scope.selectedTemplate; //选中的对象
      $scope.reportTemplates;
      $scope.getTemplates = function () {
        var obj = {};
        obj["domainPath"] = userLoginUIService.user.domainPath;
        reportFlexService.getReportTemplatesByCondition(obj, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              item.domainPath = item.domain;
              item.fileName = item.tplFileName ? item.tplFileName : item.zipFileName;
              //设置报表参数的默认值
              if(item.reportParams){
                var pas = item.reportParams;
                for(var i = 0;i<pas.length;i++){
                  if(pas[i].showTypeValue == "BOOL" && pas[i].defaultValue == ""){
                    pas[i].defaultValue = "否"
                  }else if(pas[i].showTypeValue == "weeks" && pas[i].defaultValue == ""){
                    var d1 = new Date();
                    var d2 = new Date();
                    d2.setMonth(0);
                    d2.setDate(1);
                    var rq = d1.getTime()-d2.getTime();
                    var s1 = Math.ceil(rq/(24*60*60*1000));
                    var s2 = Math.ceil(s1/7);
                    pas[i].defaultValue = "第"+s2+"周";
                    pas[i].value = s2;
                  }
                }
              }
            });
            $scope.reportTemplates = returnObj.data;
          }
        });
      };

      $scope.doAction = function (type, select, callback) {
        if (type == "pdfTemplate") {
          var params = [];
          var nowTime = new Date().getTime();
          select.reportParams.forEach(function (param) {
            var newparam = {};
            newparam.label = param.name;
            newparam.value = param.name == "STARTTIME" ? new Date(nowTime - 1000 * 60 * 60).Format("yyyy-MM-dd hh:mm:ss") : (param.name == "ENDTIME" ? new Date().Format("yyyy-MM-dd hh:mm:ss") : "");
            params.push(newparam)
          })
          reportFlexService.getReportPdf(select.id, params, [], function (returnObj) {
            if (returnObj.code == 0) {
              alert("");
            }
          });
        }
      };

      $scope.goSearch = function (flg) {
        var Dic = {
          ALL : ""
        }
        if (!$scope.selectedTemplate) {
          growl.warning("请选择一个报表模板");
          return;
        }
        var nowTime = new Date().getTime();
        $scope.selectedTemplate.reportParams.forEach(function (param) {
          if(param.showTypeValue == "weeks" && param.value != null){
            param.value = param.value.slice(1,-1);
          };
          if(param.showTypeValue == "BOOL" && param.value == "是"){
            param.value = "1";
          };
          if(param.showTypeValue == "BOOL" && param.value == "否"){
            param.value = "0";
          };
          param.label = param.name;
          if (!param.value)
            param.value = param.name == "STARTTIME" ? new Date(nowTime - 1000 * 60 * 60 * 24).Format("yyyy-MM-dd hh:mm:ss") : (param.name == "ENDTIME" ? new Date().Format("yyyy-MM-dd hh:mm:ss") : "");
          param.value = typeof Dic[param.value] !== "undefined" ? Dic[param.value] : param.value;
        })
        if (!flg || flg == "HTML") {
          reportFlexService.getReportHTML($scope.selectedTemplate.id, $scope.selectedTemplate.reportParams, [], function (returnObj) {
            if (returnObj.code == 0) {
              $scope.iframeSrc = userUIService.uploadFileUrl + returnObj.data;
            }
          });
        } else if (flg == "PDF") {
          reportFlexService.getReportPdf($scope.selectedTemplate.id, $scope.selectedTemplate.reportParams, [], function (returnObj) {
            if (returnObj.code == 0) {
              // window.open(''+ userUIService.uploadFileUrl+''+returnObj.data+'');
              window.open("" + userUIService.uploadFileUrl + "/api/rest/downloadReport/reportUIService/download?reportName=" + returnObj.data + "&reportFileName=" + returnObj.data + "");

            }
          });
        } else if (flg == "WORD") {
          reportFlexService.getReportWord($scope.selectedTemplate.id, $scope.selectedTemplate.reportParams, [], function (returnObj) {
            if (returnObj.code == 0) {
              location.href = '' + userUIService.uploadFileUrl + '' + returnObj.data + '';
            }
          });
        } else if (flg == "XLS") {
          reportFlexService.getReportXls($scope.selectedTemplate.id, $scope.selectedTemplate.reportParams, [], function (returnObj) {
            if (returnObj.code == 0) {
              location.href = '' + userUIService.uploadFileUrl + '' + returnObj.data + '';
            }
          });
        } else if (flg == "PPT") {
          reportFlexService.getReportPpt($scope.selectedTemplate.id, $scope.selectedTemplate.reportParams, [], function (returnObj) {
            if (returnObj.code == 0) {
              location.href = '' + userUIService.uploadFileUrl + '' + returnObj.data + '';
            }
          });
        }
      }

      //根据用户Id查用户域
      var domainTreeQuery = function () {
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function (data) {
            if (data.code == 0) {
              var domainList = data.data;
              $scope.domainListTree = domainList;
              $scope.domainListDic = data.domainListDic;
            }
          });
        }

      /**
       * 获得客户列表
       */
      $scope.customersList;
      $scope.customersDic = {};
      var queryCustomer = function () {
        customerUIService.findCustomersByCondition({}, function (returnObj) {
          $scope.customersDic = returnObj.customerDic;
          returnObj.data.forEach(function (item) {
            item.text = item.customerName;
          })

          $scope.customersList = returnObj.data;
        })
      };

      /**
       * 获得年列表
       */
      var myDate = new Date();
      var b = myDate.getFullYear();
      var newlist = [];
      for(var i=0;i<10;i++){
        var map = {};
        var num = b--;
        map.id = num;
        map.text = num+"年";
        newlist.unshift(map)
      };
      $scope.years = newlist;
      /**
       * 获得周列表
       */
      var weeklist = [];
      for(var i=0;i<52;i++){
        var map = {};
        map.id = "第"+(i+1)+"周";
        map.text = "第"+(i+1)+"周";
        weeklist.push(map);
      }
      $scope.weeks = weeklist;
      /**
       * 获得不良类别列表,获得故障类型列表,区域列表,季度列表
       */

      configUIService.getConfigsByGroupName("reportParams", function(returnObj) {
        if(returnObj.code == 0) {
          var datas = returnObj.data;
          for(var i=0;i<datas.length;i++){
            if(datas[i].label == "paramBadCategory"){
              var data2 = datas[i].value;
              var data22 = (new Function('return '+ data2 +';'))();
              $scope.badCategory = data22;
            }else if(datas[i].label == "paramTroubleType"){
              var data1 = datas[i].value;
              var data11 = (new Function('return '+ data1 +';'))();
              $scope.troubleType = data11;
            }else if(datas[i].label == "paramDistrict"){
              var data3 = datas[i].value;
              var data33 = (new Function('return '+ data3 +';'))();
              $scope.district = data33;
            }else if(datas[i].label == "paramQuarters"){
              var data4 = datas[i].value;
              var data44 = (new Function('return '+ data4 +';'))();
              $scope.quarters = data44;
            }
          }
        }
      });
      /**
       * 获得bool类型的列表
       */
      $scope.bool =[
        {id:"是",text:"是"},
        {id:"否",text:"否"}
      ];
      /**
       * 查询项目
       */
      $scope.projectsList;
      $scope.projectsDic = {};
      $scope.queryProject = function () {
        projectUIService.findProjectsByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              $scope.projectsDic[item.id] = item;
              item.text = item.projectName;
            })
            $scope.projectsList = returnObj.data;
          }
        })
      };
      var init = function () {
        // 初始化域目录树
        domainTreeQuery();
        $scope.getTemplates();
        initSearch();
        $scope.queryProject();
        queryCustomer();
      };

      /**
       * 监听登录状态
       */
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);
  controllers.initController('reportPolicyCtrl', ['$scope', "$routeParams", 'userEnterpriseService', 'ngDialog', 'userLoginUIService', 'userDomainService', 'reportFlexService', 'growl',
    function ($scope, $routeParams, userEnterpriseService, ngDialog, userLoginUIService, userDomainService, reportFlexService, growl) {
      $scope.queryDitem = {};
      $scope.roleList = [];
      $scope.allEmail = []
      var initSearch = function () {
        $scope.queryDitem = {
          name: "", // 报表名称
          periodTypeValue: "",
          dataSourceId: "", // 数据源唯一标识
          catalogId: "",
          domainPath: "",
          id: "",
          cronExp: ""
        };
      };
      $scope.escapeCheck = function (val) {
        return "" + val + "";
      }
      $scope.goClear = function () {
        initSearch();
      };
      $scope.selectedPolicy; //选中的对象
      $scope.reportTemplates;
      $scope.reportTemplatePolicys;
      $scope.periodList;
      $scope.reportPolicyObj = {};
      $scope.savePolicy = function () {
        if ($scope.selectedPolicy.id) {
          $scope.selectedPolicy.reportParamXML = null;
          $scope.selectedPolicy.reportParams = $scope.selectedPolicy.template.reportParams;
          $scope.selectedPolicy.receiver = $scope.selectedPolicy.receiver instanceof Array ? $scope.selectedPolicy.receiver.join(';') : $scope.selectedPolicy.receiver;
          reportFlexService.updateReportBuildPolicy($scope.selectedPolicy, function (returnObj) {
            if (returnObj.code == 0) {
              $scope.goSearch();
              growl.success("更新报表生成策略成功", {});
              $scope.closeDialog();
            }
          })

        } else {
          //$scope.selectedPolicy.id = $scope.selectedPolicy.template.id;
          $scope.selectedPolicy.templateId = $scope.selectedPolicy.template.id;
          $scope.selectedPolicy.tplName = $scope.selectedPolicy.template.name;
          $scope.selectedPolicy.tplTitle = $scope.selectedPolicy.template.title;
          $scope.selectedPolicy.reportParams = $scope.selectedPolicy.template.reportParams;
          $scope.selectedPolicy.reportParamXML = null;
          $scope.selectedPolicy.receiver = $scope.selectedPolicy.receiver instanceof Array ? $scope.selectedPolicy.receiver.join(';') : $scope.selectedPolicy.receiver;
          reportFlexService.addReportBuildPolicy($scope.selectedPolicy, function (returnObj) {
            if (returnObj.code == 0) {
              $scope.goSearch();
              growl.success("添加报表生成策略成功", {});
              $scope.closeDialog();
            } else {
              $scope.selectedPolicy.id = 0;
            }
          })
        }
      };
      $scope.reportTemplatesAll = [];
      $scope.policyhandler = function (policy) {
        var showWin = function () {
          ngDialog.open({
            template: '../partials/dialogue/report_policy_dia.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });
        };
        var templatesList = $scope.reportTemplatesAll;
        var list = [];
        for (var j in templatesList) {
          list.push(templatesList[j]);
          // if (!$scope.reportPolicyObj[templatesList[j].id]) {
          // }
        }
        
        //如果是新增的过滤模板的内容，有不过滤
        if (policy != undefined && policy.id > 0) {
          $scope.reportTemplates = $scope.reportTemplatesAll;
        } else {
          $scope.reportTemplates = list;
        }
        if (!policy) {
          $scope.selectedPolicy = {
            template: {}
          };
        } else {
          $scope.selectedPolicy = policy;
          $scope.reportTemplates.forEach(function (item) {
            if (item.id == $scope.selectedPolicy.templateId) {
              $scope.selectedPolicy.template = item;
              $scope.selectedPolicy.template.reportParams = $scope.selectedPolicy.reportParams;
            }
          });
          var reg = /^((([a-z0-9_\.-]+)@([0-9a-z\.-]+)\.([a-z\.]{2,10}\;))*(([a-z0-9_\.-]+)@([0-9a-z\.-]+)\.([a-z\.]{2,10})))$/;
          if ($scope.selectedPolicy.receiver && !reg.test($scope.selectedPolicy.receiver)) {
            $scope.selectedPolicy.receiver = $scope.selectedPolicy.receiver.split(';');
          }
        }
        showWin();
      };
      $scope.initTemplateInfo = function () {
        var obj = {};
        obj["domainPath"] = userLoginUIService.user.domainPath;
        reportFlexService.getReportTemplatesByCondition(obj, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              item.domainPath = item.domain;
              item.fileName = item.tplFileName ? item.tplFileName : item.zipFileName;
            });
            $scope.reportTemplatesAll = returnObj.data;
            $scope.reportTemplates = returnObj.data;
          }
        });
        $scope.periodListObj = {};
        reportFlexService.getSendPeriod(function (returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              $scope.periodListObj[returnObj.data[i].value] = returnObj.data[i];
            }
            $scope.periodList = returnObj.data;
          }
        });
      }

      $scope.getTemplatePolicys = function () {
        reportFlexService.getReportBuildPolicyListByCondition({}, function (returnObj) {
          if (returnObj.code == 0)
            $scope.reportTemplatePolicys = returnObj.data;
          var d = returnObj.data;
          for (var n in d) {
            $scope.reportPolicyObj["" + d[n].id + ""] = d[n];
          }
          $scope.$broadcast(Event.REPORTMODULE + "_policy", {
            "data": $scope.reportTemplatePolicys
          });
        });
      };

      $scope.doAction = function (type, select, callback) {
        if (type == "deletepolicy") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认删除报表生成策略吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function (dialogRef) {
                reportFlexService.deleteReportBuildPolicy(select.id, function (returnObj) {
                  if (returnObj.code == 0) {
                    //不用getTemplatePolicys因为不同用户域登录进来的用户可以看到别人的策略
                    $scope.goSearch();
                    delete $scope.reportPolicyObj[select.id];
                    growl.success("删除报表生成策略成功", {});
                  }
                });
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function (dialogRef) {
                dialogRef.close();
              }
            }]
          });
        } else if (type == "editpolicy") {
          $scope.policyhandler(select)
        } else if (type == "AlertEnable") {
          var enabled = select.enabled;
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: enabled == 1 ? '确认要启用此报表生成策略吗？' : '确认要停用此报表生成策略吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function (dialogRef) {
                reportFlexService.updateReportBuildPolicy(select, function (returnObj) {
                  if (returnObj.code == 0) {
                    callback(returnObj);
                  }
                })
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function (dialogRef) {
                callback(false);
                dialogRef.close();
              }
            }]
          });
        }
      };
      $scope.goSearch = function () {
        //根据当前用户域查询
        var obj = {};
        if (!$scope.queryDitem.domainPath || $scope.queryDitem.domainPath == undefined) {
          obj = jQuery.extend(true, {}, $scope.queryDitem);
          obj["domainPath"] = userLoginUIService.user.domainPath;
        } else {
          obj = $scope.queryDitem;
        }
        reportFlexService.getReportBuildPolicyListByCondition($scope.queryDitem, function (returnObj) {
          if (returnObj.code == 0)
            $scope.reportTemplatePolicys = returnObj.data;
          var d = returnObj.data;
          for (var n in d) {
            $scope.reportPolicyObj["" + d[n].id + ""] = d[n];
          }
          $scope.$broadcast(Event.REPORTMODULE + "_policy", {
            "data": returnObj.data
          });
        });
      }
      var domainTreeQuery = function () {
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function (data) {
          if (data.code == 0) {
            var domainList = data.data;
            $scope.domainListTree = domainList;
            $scope.domainListDic = data.domainListDic;
          }
        });
      };

      var queryRole = function () {
        userEnterpriseService.queryEnterpriseRole(function (ret) {
          if (ret.code == 0) {
            $scope.roleList = ret.data;
          }
        });
      };
      var init = function () {
        // 初始化域目录树
        domainTreeQuery();
        queryRole();
        $scope.initTemplateInfo();
        $scope.goSearch();
        initSearch();
      };

      //弹出框的关闭事件
      $scope.closeDialog = function () {
        ngDialog.close();
      };

      /**
       * 监听登录状态
       */
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);
});