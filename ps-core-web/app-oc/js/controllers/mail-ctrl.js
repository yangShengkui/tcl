define(['controllers/controllers', 'bootstrap-dialog'], function (controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('sendMailCtrl', ['$scope', "$routeParams", "$sce", 'FileUploader', 'userLoginUIService', 'userEnterpriseService', 'psMessageService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'marketplaceUIService',
    function ($scope, $routeParams, $sce, FileUploader, userLoginUIService, userEnterpriseService, psMessageService, growl, userRoleUIService, userFunctionService, userDomainService, marketplaceUIService) {
      $scope.msgModel = {"messageId":"","title":"","content":"","insertTime":"","status":"","msgType":"","objectId":""}
      var msgId = $routeParams.msgId;
      if(msgId){
          psMessageService.queryMessageInfo(msgId,function(res){
            if(res.code == 0){
              $scope.msgModel=res.data;
              $scope.msgModel.content = res.data.content;
            }
          });
      }
      $scope.TrustAsHtml = function (post) {
        return $sce.trustAsHtml(post);
      };
      $scope.msgSave = function(){
        var productDetail = CKEDITOR.instances.editor1.getData();// 获取产品详情
        console.log(productDetail.length);
        var tit = $scope.msgModel.title;
        if (tit != "" && $.trim(tit) != "" && productDetail!="" && $.trim(productDetail)!="") {
          if(productDetail.length < 10000){
            $scope.msgModel.content = productDetail;
            if($scope.msgModel.messageId == ""){

              psMessageService.addMessage($scope.msgModel,function(res){
                if(res.code == 0){
                  //$scope.msgModel.messageTitle = '';
                  //CKEDITOR.instances.editor1.setData('');
                  growl.success("站内信保存成功",{});
                  location.href = "#/system";
                }
              });
            }else{
              psMessageService.modifyMessage($scope.msgModel,function(res){
                if(res.code == 0){
                  //$scope.msgModel.messageTitle = '';
                  //CKEDITOR.instances.editor1.setData('');
                  growl.success("修改站内信保存成功",{});
                  location.href = "#/system";
                }
              });
            }
          }else{
            growl.warning("联系管理员，输入内容过长",{});
          }
        }else{
          growl.warning("标题或者内容不能为空",{});
        }
      }
    }
  ]);
  controllers.initController('systemCtrl', ['$scope', "$sce", 'FileUploader', 'userLoginUIService', 'userEnterpriseService', 'psMessageService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'marketplaceUIService',
    function ($scope, $sce, FileUploader, userLoginUIService, userEnterpriseService, psMessageService, growl, userRoleUIService, userFunctionService, userDomainService, marketplaceUIService) {
      $scope.systemGridData = {
        columns: [{
          title: "标题",
          data: "title"
        }, {
          title: "创建时间",
          data: "createTime"
        }, {
          title: "状态",
          data: "status"
        }, {
          title: "发布时间",
          data: "insertTime"
        }, {
          title: "操作",
          orderable:false,
          data: "option"
        }],
        columnDefs: [{
          "targets": 1,
          "data": "createTime",
          "render": function (data, type, full) {
            var str = '';
            //if(full.status == 0){
              //if(data != "" && data != null){
                str = newDateJson(data).Format(GetDateCategoryStrByLabel());
            //  }
            //}else if(full.status == 5){
            //  str ="";
            //}
            return str;
          }
        },{
          "targets": 2,
          "data": "status",
          "render": function (data, type, full) {
            var str = '';
            if(data == 0){
              str = "草稿";
            }else if(data == 5){
              str = "已发布";
            }
            return str;
          }
        },{
          "targets": 3,
          "data": "insertTime",
          "render": function (data, type, full) {
            var str = '';
            if(full.status == 0){
              str = "";
            }else if(full.status == 5){
              if(data != "" && data != null){
                str = newDateJson(data).Format(GetDateCategoryStrByLabel());
              }
            }
            return str;
          }
        },{
          "targets": 4,
          "data": "option",
          "render": function (data, type, full) {
            var str = '';
            if (full.status  == 0) {
              //str = "<a id='update-btn' class='btn btn-default btn-sm' style='margin-right: 10px;'>  <i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i> <span class='hidden-xs'> 修改</span></a><a id='delete-btn'  style='margin-right: 10px;' class='btn btn-default btn-sm' > <i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span>  </a><a id='publish-btn' class='btn btn-default btn-sm' > <i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 发布</span>  </a>";
              str += "<div class='btn-group table-option-group' >" +
                "<button type='button' class='btn btn-default btn-sm'>操作</button>" +
                "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'>" +
                "<span class='caret'></span>" +
                "<span class='sr-only'>Toggle Dropdown</span>" +
                "</button>" +
                "<ul class='dropdown-menu' role='menu'>" +
                "<li><a style='cursor: pointer;' id='update-btn'>修改</a></li>" +
                "<li><a style='cursor: pointer;' id='delete-btn'>删除</a></li>" +
                "<li><a style='cursor: pointer;' id='publish-btn'>发布</a></li>" +
                "<li><a style='cursor: pointer;' id='preview-btn'>预览</a></li>" +
                "</ul>" +
                "</div>";
            } else if (full.status  == 5) {
              //str = "<a id='publish-btn' class='btn btn-default btn-sm' > <i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 发布</span>  </a>";
              str="已发布";
            }
            return str;
          }
        }]
      }
      $scope.deleteMessage = function(message){
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          //size:BootstrapDialog.SIZE_WIDE,
          message: '确认要删除该公告',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function (dialogRef) {
              psMessageService.deleteMessage(message.messageId,function(msg){
                if(msg.code == 0){
                  initDB();
                  growl.success("公告删除成功",{});
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
      }
      $scope.notice = 'tab';
      $scope.previewData = '';
      $scope.TrustAsHtml = function (post) {
        return $sce.trustAsHtml(post);
      };
      $scope.preview =  function(msg){
        $scope.previewData = msg;
        $scope.notice = 'preview';
        $scope.$apply();
      }

      $scope.addMail = function(){
        window.location.href = "#/mailedit";
      }
      $scope.publishMessage = function(messages){
        psMessageService.sendMessageToAll(messages.messageId,function(res){
          if(res.code == 0){
            initDB();
            growl.success("公告发布成功",{});
          }
        });
      }
      var initDB = function(){
        psMessageService.queryAllMessage(function(obj){
          if(obj.code == 0){
            //var objList = [];
            //var resList  = obj.data;
            $scope.systemGridData.data = obj.data;
            $scope.$broadcast(Event.USERINFOSINIT + "_system", $scope.systemGridData);
          }
        });
      }
      initDB();
    }
  ]);
});