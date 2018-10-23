define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';

  controllers.controller('AllMessageCtrl', ['$scope', '$location', 'userLoginUIService', 'psMessageService', 'growl',
    function($scope, $location, userLoginUIService, psMessageService, growl) {
      $scope.msgStatus = "全部消息";
      $scope.statusMsg = "0";
      $scope.messageList = "";
      $scope.readMsgStatus = $location.path();
      $scope.msgGridData = {
        columns: [{
          title: '<input type="checkbox" id="allClick" name="allClick" style="width: 19px;height: 25px;" class="minimal" />',
          data: "message.messageId"
        }, {
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
          "data": "message.messageId",
          "render": function(data, type, full) {
            return '<input type="checkbox" id="msgClick" name="msgClick" style="width: 19px;height: 25px;" class="minimal msg"  value="' + data + '" />';
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
              str = '<dt>' + newDateJson(data).Format(GetDateCategoryStrByLabel()) + '</dt>';
            } else {
              str = '<span class="contacts-list-msg">' + newDateJson(data).Format(GetDateCategoryStrByLabel()) + '</span>';
            }
            return str;
          }
        }, {
          "targets": 3,
          "data": "message.msgType",
          "render": function(data, type, full) {
            var str = "";
            if (data == 'ticket_message') {
              str = '工单任务';
            } else if (data == 'maintenance_message') {
              str = '维保';
            } else if (data == 'bulletin_message') {
              str = '系统公告';
            } else if (data == 'payment_message') {
              str = '缴费';
            } else if (data == 'energyconsume_message') {
              str = '能耗结构';
            }
            var str2 = '';
            if (full.status == 0) {
              str2 = '<dt>' + str + '</dt>';
            } else {
              str2 = '<span class="contacts-list-msg">' + str + '</span>';
            }
            return str2;
          }
        }]
      }
      var initEvent = function() {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          var aname = $(e.target).attr("name");
          tabMessage(aname);
        });
      }
      var tabMessage = function(aname) {
        if (aname == "all") {
          initGetDB();
        } else if (aname == "order") {
          statusQuery("ticket_message");
        } else if (aname == "bulletin") {
          statusQuery("bulletin_message");
        } else if (aname == "payment") {
          statusQuery("payment_message");
        } else if (aname == "maintenance") {
          statusQuery("maintenance_message ");
        }
        //$scope.$apply();
      }
      var statusQuery = function(status) {
        if ($location.path() == "/message") {
          psMessageService.queryMessageByUserID(function(res) {
            if (res.code == 0) {
              $scope.msgGridData.data = res.data;
              $scope.messageList = res.data;

              var msgList = $scope.messageList;
              var mesListQuery = [];
              for (var i in msgList) {
                if (msgList[i].message.msgType == status)
                  mesListQuery.push(msgList[i]);
              }
              $scope.msgGridData.data = mesListQuery;
              $scope.$broadcast(Event.USERCENTERINIT + "_msg", $scope.msgGridData);
            }
          });
        } else if ($location.path() == "/unread") {
          psMessageService.queryMessageByStatusAndUserID("0", function(res) {
            if (res.code == 0) {
              $scope.msgGridData.data = res.data;
              $scope.messageList = res.data;

              var msgList = $scope.messageList;
              var mesListQuery = [];
              for (var i in msgList) {
                if (msgList[i].message.msgType == status)
                  mesListQuery.push(msgList[i]);
              }
              $scope.msgGridData.data = mesListQuery;
              $scope.$broadcast(Event.USERCENTERINIT + "_msg", $scope.msgGridData);
            }
          })
        } else if ($location.path() == "/read") {
          psMessageService.queryMessageByStatusAndUserID("1", function(res) {
            if (res.code == 0) {
              $scope.msgGridData.data = res.data;
              $scope.messageList = res.data;

              var msgList = $scope.messageList;
              var mesListQuery = [];
              for (var i in msgList) {
                if (msgList[i].message.msgType == status)
                  mesListQuery.push(msgList[i]);
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
      }

      initEvent();
      var queryMessage = function(mesg) {
        //查询消息的状态
        psMessageService.queryMessageByStatusAndUserID(mesg, function(res) {
          if (res.code == 0) {
            $scope.msgGridData.data = res.data;
            $scope.messageList = res.data;
            $scope.$broadcast(Event.USERCENTERINIT + "_msg", $scope.msgGridData);

          }
        })
      }
      var initGetDB = function() {
        if ($location.path() == "/message") {
          $scope.msgStatus = "全部消息";
          $scope.statusMsg = '0';
          allQueryMessage();
        } else if ($location.path() == "/unread") {
          $scope.msgStatus = "未读消息";
          $scope.statusMsg = '0';
          queryMessage("0");
        } else if ($location.path() == "/read") {
          $scope.msgGridData = {
            columns: [{
              title: "消息标题",
              data: "message.title"
            }, {
              title: "提交时间",
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
                if (full.status == 0) {
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
                if (full.status == 0) {
                  str = '<dt>' + newDateJson(data).Format(GetDateCategoryStrByLabel()) + '</dt>';
                } else {
                  str = '<span class="contacts-list-msg">' + newDateJson(data).Format(GetDateCategoryStrByLabel()) + '</span>';
                }
                return str;
              }
            }, {
              "targets": 2,
              "data": "message.msgType",
              "render": function(data, type, full) {
                var str = "";
                if (data == 'ticket_message') {
                  str = '工单任务';
                } else if (data == 'maintenance_message') {
                  str = '维保';
                } else if (data == 'bulletin_message') {
                  str = '系统公告';
                } else if (data == 'payment_message') {
                  str = '缴费';
                } else if (data == 'energyconsume_message') {
                  str = '能耗结构';
                }
                var str2 = '';
                if (full.status == 0) {
                  str2 = '<dt>' + str + '</dt>';
                } else {
                  str2 = '<span class="contacts-list-msg">' + str + '</span>';
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
          if (res.code == 0) {
            $scope.msgGridData.data = res.data;
            $scope.messageList = res.data;
            $scope.$broadcast(Event.USERCENTERINIT + "_msg", $scope.msgGridData);
          }
        });
      }
      $scope.statusUpdate = function(messageData) {
        psMessageService.modifyMsgStatus([messageData.message.messageId], function(res) {
          if (res.code == 0) {
            if (messageData.message.msgType == "ticket_message") {
              var str2 = $.trim(messageData.message.content);
              var orderId = str2.split("任务ID：")[1];
              location.href = '../app-oc/index.html#/orderdetail/' + orderId.split(",")[0] + '' + $location.path() + '/notdeal';
              console.log("点击修改消息状态成功");
            } else if (messageData.message.msgType == "bulletin_message") {
              location.href = '#/messageDetail/' + messageData.message.messageId + '';
            } else if (messageData.message.msgType == "payment_message") {
              $("#info").css("display", "none");
              $("#exp").css("display", "block");
              location.href = '../app-uc/index.html#/expenses';
            }
          }
        });
      }

      initGetDB();
      $scope.deleteMsg = function(option) {
        $scope.messageInfo = [];
        var messageId = "";
        $("input[name='msgClick']").each(function() {
          if ($(this).is(':checked')) {
            messageId += $(this).val() + ",";
            $scope.messageInfo.push($(this).val());
          }
        });
        if (option == '1') {
          if ($scope.messageInfo.length > 0) {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              message: '您确认要删除选中的' + $scope.messageInfo.length + '条消息吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {

                  psMessageService.deleteMessageUser($scope.messageInfo, function(res) {
                    if (res.code == 0) {
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
        } else if (option == '2') {
          if ($scope.messageInfo.length > 0) {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              message: '您确认要标记选中的' + $scope.messageInfo.length + '条消息为已读吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {

                  psMessageService.modifyMsgStatus($scope.messageInfo, function(res) {
                    if (res.code == 0) {
                      growl.success("消息标记已读成功", {});
                      tabMessage($("#message  .active  a ").attr("name"));
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
            growl.warning("请选择要标记为已读的消息", {});
          }

        }
      }
    }
  ]);
  controllers.controller('messageDetailCtrl', ['$scope', '$sce', '$routeParams', '$location', 'userLoginUIService', 'psMessageService', 'growl',
    function($scope, $sce, $routeParams, $location, userLoginUIService, psMessageService, growl) {
      var msgId = $routeParams.msgId;
      $scope.detailMessage = "";
      $scope.TrustAsHtml = function(post) {
        return $sce.trustAsHtml(post);
      };
      psMessageService.queryMessageByID(msgId, function(res) {
        if (res.code == 0) {
          $scope.detailMessage = res.data;
        }
      });
    }
  ]);
});
