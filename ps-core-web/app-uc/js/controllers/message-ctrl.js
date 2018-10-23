define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';

  controllers.initController('AllMessageCtrl', ['$scope', '$location', 'userLoginUIService', 'configUIService', 'psMessageService', 'growl',
    function($scope, $location, userLoginUIService, configUIService, psMessageService, growl) {
      $scope.msgStatus = "全部消息";
      $scope.statusMsg = "0";
      $scope.messageList = "";
      $scope.readMsgStatus = $location.path();
      //标准时间转换2017-07-17T03:10:38.931+0000
      var chGMT = function(dateStr) {
//      var mydate = new Date(dateStr);
//      return mydate.Format("yyyy-MM-dd hh:mm:ss");
        return useMomentFormat(dateStr, "yyyy-MM-dd hh:mm:ss");
      }
      $scope.msgGridData = {
        columns: [$.ProudSmart.datatable.selectCol, {
          title: "消息标题",
          data: "message.title"
        }, {
          title: "接收时间",
          data: "message.insertTime"
        }, {
          title: "消息类型",
          data: "message.msgType"
        }],
        columnDefs: [{
          "targets": 0,
          "orderable": false,
          "data": "message.messageId",
          render: function(data, type, full) {
            if (type == "display") {
              if (data) {
                return '<input class="itemCheckBox" value="' + full.message.messageId + '" checked type="checkbox">';
              } else {
                return '<input class="itemCheckBox" value="' + full.message.messageId + '" type="checkbox">';
              }
            }
            return "";
          }
        }, {
          "targets": 1,
          "data": "message.title",
          "render": function(data, type, full) {
            var str = '';
            if (full.status == 0) {
              str = '<dt><a href class="hov-slide" style="color: #444;" >' + data + '</a></dt>';
            } else {
              str = '<span class="contacts-list-msg"><a  href style="color: #999;"   class="hov-slide"  >' + data + '</a></span>';
            }
            return str;
          }
        }, {
          "targets": 2,
          "data": "message.insertTime",
          "render": function(data, type, full) {
            var str = '';
            if (full.status == 0) {
              str = '<dt>' + chGMT(data) + '</dt>';
            } else {
              str = '<span class="contacts-list-msg">' + chGMT(data) + '</span>';
            }
            return str;
          }
        }, {
          "targets": 3,
          "data": "message.msgType",
          "render": function(data, type, full) {
            var str2 = '';
            if(full.status == 0 && $scope.messageTypeDic[data] != undefined) {
              str2 = '<dt>' + $scope.messageTypeDic[data].senderTxt + '</dt>';
            } else if($scope.messageTypeDic[data] != undefined){
              str2 = '<span class="contacts-list-msg">' + $scope.messageTypeDic[data].senderTxt + '</span>';
            }
            return str2;
          }
        }]
      };
      $scope.activeListTab = "tab1";
      /**
       * tab页的事件监听
       */
      var initEvent = function() {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          if($(e.target).closest("li.disabled").length > 0) {
            $(e.target).closest("li.disabled").removeClass("active");
            $(e.target).closest("ul").children("[name=" + $scope.activeListTab + "]").addClass("active");
            return;
          }
          var aname = $(e.target).closest("li").attr("name");
          var tabName = $(e.target).attr("name");
          if(aname) {
            $scope.activeListTab = aname;
            $scope.$apply();
            tabMessage(tabName);
          }
        });
      }
      var tabMessage = function(aname) {
        if(aname == "all") {
          initGetDB();
        } else if(aname == "order") {
          statusQuery("ticket_message");
        } else if(aname == "bulletin") {
          statusQuery("bulletin_message");
        } else if(aname == "payment") {
          statusQuery("payment_message");
        } else if(aname == "maintenance") {
          statusQuery("maintenance_message");
        } else if(aname == "notice") {
          statusQuery("notify_message");
        }
        //$scope.$apply();
      }
      var statusQuery = function(status) {
        if($location.path() == "/message") {
          psMessageService.queryMessageByUserID(function(res) {
            if(res.code == 0) {
              $scope.msgGridData.data = res.data;
              $scope.messageList = res.data;

              var msgList = $scope.messageList;
              var mesListQuery = [];
              for(var i in msgList) {
                if(status == 'notify_message') {
                  if(msgList[i].message.msgType == 'payment_message' || msgList[i].message.msgType == 'maintenance_message' || msgList[i].message.msgType == 'maintenance_msg' || msgList[i].message.msgType == 'notice' || msgList[i].message.msgType == 'gateway_message') {
                    mesListQuery.push(msgList[i]);
                  }
                } else {
                  if(msgList[i].message.msgType == status) {
                    mesListQuery.push(msgList[i]);
                  }
                }
              }
              $scope.msgGridData.data = mesListQuery;
              $scope.$broadcast(Event.USERCENTERINIT + "_msg", $scope.msgGridData);
            }
          });
        } else if($location.path() == "/unread") {
          psMessageService.queryMessageByStatusAndUserID("0", function(res) {
            if(res.code == 0) {
              $scope.msgGridData.data = res.data;
              $scope.messageList = res.data;

              var msgList = $scope.messageList;
              var mesListQuery = [];
              for(var i in msgList) {
                if(status == 'notify_message') {
                  if(msgList[i].message.msgType == 'payment_message' || msgList[i].message.msgType == 'maintenance_message' || msgList[i].message.msgType == 'maintenance_msg' || msgList[i].message.msgType == 'notice' || msgList[i].message.msgType == 'gateway_message') {
                    mesListQuery.push(msgList[i]);
                  }
                } else {
                  if(msgList[i].message.msgType == status) {
                    mesListQuery.push(msgList[i]);
                  }
                }
              }
              $scope.msgGridData.data = mesListQuery;
              $scope.$broadcast(Event.USERCENTERINIT + "_msg", $scope.msgGridData);
            }
          })
        } else if($location.path() == "/read") {

          psMessageService.queryMessageByStatusAndUserID("1", function(res) {
            if(res.code == 0) {
              $scope.msgGridData.data = res.data;
              $scope.messageList = res.data;

              var msgList = $scope.messageList;
              var mesListQuery = [];
              for(var i in msgList) {
                if(status == 'notify_message') {
                  if(msgList[i].message.msgType == 'payment_message' || msgList[i].message.msgType == 'maintenance_message' || msgList[i].message.msgType == 'maintenance_msg' || msgList[i].message.msgType == 'notice' || msgList[i].message.msgType == 'gateway_message') {
                    mesListQuery.push(msgList[i]);
                  }
                } else {
                  if(msgList[i].message.msgType == status) {
                    mesListQuery.push(msgList[i]);
                  }
                }
              }
              $scope.msgGridData.data = mesListQuery;
              $scope.$broadcast(Event.USERCENTERINIT + "_msg", $scope.msgGridData);
            }
          })
        }
        //psMessageService.queryMessageByTypeAndUserID(status, function (ret) {
        //
        //  if (ret.code == 0) {
        //    $scope.msgGridData.data = ret.data;
        //    $scope.$broadcast(Event.USERCENTERINIT + "_msg", $scope.msgGridData);
        //  }
        //});
      };
      $scope.messageTypeDic = {};
      $scope.configGroupsDic = {};
      //获取所有的全局配置
      var configList = function() {
        configUIService.getAllConfigs(function(returnObj){
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.configGroupsDic[item.groupName] = item;
            });
            $scope.configGroups = returnObj.data;
            if(returnObj.data.length > 0 && $scope.configGroupsDic["messageType"] != undefined && $scope.configGroupsDic["messageType"].value){
              var messageType = eval("(" + $scope.configGroupsDic["messageType"].value + ")");
              $scope.messageTypeDic= messageType;
              /*messageType.forEach(function(user) {
                $scope.messageTypeDic[user.typeCode] = user;
              });*/
            }
            initGetDB();
          }
        });
      };

      var queryMessage = function(mesg) {
        //查询消息的状态
        psMessageService.queryMessageByStatusAndUserID(mesg, function(res) {
          if(res.code == 0) {
            $scope.msgGridData.data = res.data;
            $scope.messageList = res.data;
            $scope.$broadcast(Event.USERCENTERINIT + "_msg", $scope.msgGridData);

          }
        })
      }
      var initGetDB = function() {
        if($location.path() == "/message") {
          $scope.msgStatus = "全部消息";
          $scope.statusMsg = '0';
          allQueryMessage();
        } else if($location.path() == "/unread") {
          $scope.msgStatus = "未读消息";
          $scope.statusMsg = '0';
          queryMessage("0");
        } else if($location.path() == "/read") {
          $scope.msgGridData = {
            columns: [{
              title: "消息标题",
              data: "message.title"
            }, {
              title: "接收时间",
              data: "message.insertTime"
            }, {
              title: "消息类型",
              data: "message.msgType"
            }],
            columnDefs: [{
              "targets": 0,
              "data": "message.title",
              "render": function(data, type, full) {
                var str = '';
                if(full.status == 0) {
                  str = '<dt><a href class="hov-slide" style="color: #444;" >' + data + '</a></dt>';
                } else {
                  str = '<span class="contacts-list-msg"><a  href style="color: #999;"   class="hov-slide"  >' + data + '</a></span>';
                }
                return str;
              }
            }, {
              "targets": 1,
              "data": "message.insertTime",
              "render": function(data, type, full) {
                var str = '';
                if(full.status == 0) {
                  str = '<dt>' + chGMT(data) + '</dt>';
                } else {
                  str = '<span class="contacts-list-msg">' + chGMT(data) + '</span>';
                }
                return str;
              }
            }, {
              "targets": 2,
              "data": "message.msgType",
              "render": function(data, type, full) {
                var str2 = '';
                if(full.status == 0 && $scope.messageTypeDic[data] != undefined) {
                  str2 = '<dt>' + $scope.messageTypeDic[data].senderTxt + '</dt>';
                } else if($scope.messageTypeDic[data] != undefined){
                  str2 = '<span class="contacts-list-msg">' + $scope.messageTypeDic[data].senderTxt + '</span>';
                }
                return str2;
              }
            }]
          }
          $scope.msgStatus = "已读消息";
          queryMessage("1");
          $scope.statusMsg = '1';
        }
      }
      var allQueryMessage = function() {
        psMessageService.queryMessageByUserID(function(res) {
          if(res.code == 0) {
            $scope.msgGridData.data = res.data;
            $scope.messageList = res.data;
            $scope.$broadcast(Event.USERCENTERINIT + "_msg", $scope.msgGridData);
          }
        });
      }
      $scope.statusUpdate = function(messageData) {
        psMessageService.modifyMsgStatus([messageData.message.messageId], function(res) {
          if(res.code == 0) {
            if(messageData.message.msgType == "ticket_message") {
              var str2 = $.trim(messageData.message.content);
              var orderId = str2.split("任务ID：")[1];
              var orderAddress = str2.split("任务地址：")[1];
              if(orderAddress) {
                // location.href = '../app-oc/index.html#/deviceTask/' + orderId.split(",")[0] + '';
                location.href = orderAddress + "/" + orderId.split(",")[0];
              } else {
                location.href = '../app-oc/index.html#/orderdetail/' + orderId.split(",")[0] + '/task/message';
              }
            } else if(messageData.message.msgType == "ticket_maintenance_message") {
              var str2 = $.trim(messageData.message.content);
              var orderId = str2.split("任务ID：")[1];
              location.href = '../app-oc/index.html#/deviceTask/' + orderId.split(",")[0] + '';
            } else if (messageData.message.msgType == "payment_message") {
              $("#info").css("display", "none");
              $("#exp").css("display", "block");
              location.href = '../app-uc/index.html#/expenses';
            } else if(messageData.message.msgType == "alert_message_insystem") {
              location.href = '../app-oc/index.html#/configAlert/' + $.trim(messageData.message.content) + '/alert';
            } else if(messageData.message.msgType == "maintenance_msg") {
              location.href = '../app-oc/index.html#/maintenance/' + $.trim(messageData.message.content) + '';
            }else{
              location.href = '#/messageDetail/' + messageData.message.messageId + '';
            }
          }
        });
      }


      $scope.deleteMsg = function(option) {
        $scope.messageInfo = [];
        var messageList = $scope.msgGridData.data;
        var messageId = "";
        /*$(".itemCheckBox").each(function() {
          if($(this).is(':checked')) {
            messageId += $(this).val() + ",";
            $scope.messageInfo.push($(this).val());
          }
        });*/
        messageList.forEach(function(item) {
          if((item.selected && item.status == 0 && option == '2' )|| (item.selected && option == '1' )) {
            messageId += item.message.messageId + ",";
            $scope.messageInfo.push(item.message.messageId);
          }
        });
        if(option == '1') {
          if($scope.messageInfo.length > 0) {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              message: '您确认要删除选中的' + $scope.messageInfo.length + '条消息吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {

                  psMessageService.deleteMessageUser($scope.messageInfo, function(res) {
                    if(res.code == 0) {
                      growl.success("删除消息成功", {});
                      initGetDB();
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
          } else {
            growl.warning("请选择要删除的消息", {});
          }
        } else if(option == '2') {
          if($scope.messageInfo.length > 0) {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              message: '您确认要标记选中的' + $scope.messageInfo.length + '条消息为已读吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  psMessageService.modifyMsgStatus($scope.messageInfo, function(res) {
                    if(res.code == 0) {
                      growl.success("消息标记已读成功", {});
                      tabMessage($(".nav-tabs .active  a ").attr("name"));
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
          } else {
            growl.warning("请选择要标记为已读的消息,已读消息不算数哦！", {});
          }

        }
      }
      //判断用户是否存在
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            initEvent();
            configList();
          }
        });
      } else {
        initEvent();
        configList();
      }
    }
  ]);
  controllers.initController('messageDetailCtrl', ['$scope', '$sce', '$routeParams', '$location', 'userLoginUIService', 'psMessageService', 'growl',
    function($scope, $sce, $routeParams, $location, userLoginUIService, psMessageService, growl) {
      var msgId = $routeParams.msgId;
      $scope.detailMessage = "";
      $scope.TrustAsHtml = function(post) {
        return $sce.trustAsHtml(post);
      };
      psMessageService.queryMessageByID(msgId, function(res) {
        if(res.code == 0) {
          $scope.detailMessage = res.data;
        }
      });
    }
  ]);
});