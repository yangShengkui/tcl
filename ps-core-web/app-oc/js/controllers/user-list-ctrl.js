define(['controllers/controllers', 'Array'], function (controllers) {
  'use strict';
  controllers.initController('UserListCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'ngDialog',
    'configUIService', 'resourceUIService', 'userInitService', 'userLoginUIService', 'userEnterpriseService',
    'userUIService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'commonMethodService',
    function (scope, rootScope, routeParams, location, ngDialog, configUIService, resourceUIService, userInitService,
              userLoginUIService, userEnterpriseService, userUIService, growl, userRoleUIService, userFunctionService,
              userDomainService, cmd) {
      var TEXT = {
        "SUBMIT": "确定",
        "CANCEL": "取消"
      };
      scope.cache = {};
      scope.navigateTo = function (panel) {
        location.path("usermanager/" + panel);
      };
      scope.panel = routeParams.panel ? routeParams.panel : "user";

      var createlist = function (tree) {
        var rs = [];
        var traverse = function (data) {
          rs.push(data);
          if (data.hasOwnProperty("domainInfos")) {
            for (var i in data.domainInfos) {
              traverse(data.domainInfos[i]);
            }
          }
        }
        traverse(tree);
        return rs;
      };

      var cancelClick = function (row, source) {
        scope.userlist.setWholeDisabled(false);
        for (var i in source) {
          source[i].disabled = false;
        }
        row.isEdit = "default";
      };

      var renderUserList = function () {
        var domainlist, domaintree, enterpriseUsers, ifShow, userTypeList = [],
          queryAllRoles = [],
          allRolesData = [],
          allRolesDataDic = {},
          userList = []; //用于执行顺序;

        var saveClick = function (row, source) {
          var cached = row.cached;
          var userName = cached.userName;
          var officePhone = cached.officePhone;
          var domainID = cached.domainID;
          scope.userlist.setWholeDisabled(false);
          for (var i in source) {
            source[i].disabled = false;
          }
          row.isEdit = "default";
          delete row.cached;
          var oldUser = row.$clone();
          oldUser.userName = userName;
          oldUser.officePhone = officePhone;
          oldUser.domainID = domainID;
          var modifyUser_callback = function (event) {
            if (event.code == 0) {
              row.userName = event.data.userName;
              row.officePhone = event.data.officePhone;
              row.domainID = event.data.domainID;
              growl.success("用户修改成功", {});
            }
          };
          userUIService.modifyUser(oldUser, modifyUser_callback)
        };

        var deleteClick = function (row, source) {
          var fnlist = [{
            label: TEXT.SUBMIT,
            icon: 'btn btn-success',
            style: {
              'width': '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function () {
              ngDialog.close();
              userUIService.deleteUser(row.userID, function (event) {
                if (event.code == 0) {
                  row.remove();
                  growl.success("删除用户成功!", {});
                }
              });
            }
          }, {
            label: TEXT.CANCEL,
            icon: 'btn btn-default',
            style: {
              'width': '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function () {
              ngDialog.close();
            }
          }];
          scope.dialog = {
            title: {
              label: '提示'
            },
            description: {
              label: '确认要删除此用户吗？'
            },
            fnlist: fnlist
          };
          ngDialog.open({
            template: '../partials/dialogue/common_dia_prompt.html',
            className: 'ngdialog-theme-plain',
            scope: scope
          });
        };

        var userEditClick = function (row, source) {
          // 获取缓存的所有设备
          var cmdins = new cmd();
          var find = false;
          if (userTypeList.length > 0) {
            find = userTypeList.find(function (elem) {
              return elem.typeCode == 10;
            });
          }
          var arr = [];
          $.extend(arr, userTypeList);
          if (!find) {
            arr = arr.concat([{
              modelId: 300,
              label: '企业管理员',
              typeCode: 10,
              name: '管理员'
            }]);
          }

          if (row.closingDate) {
            row.closingDate = new Date(row.closingDate).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
          }

          var clone = row.$clone();

          var namelist = enterpriseUsers.filter(function (elem) {
            return elem.userName != row.userName;
          }).map(function (elem) {
            return elem.userName;
          });

          var loginlist = enterpriseUsers.filter(function (elem) {
            return elem.loginName != row.loginName;
          }).map(function (elem) {
            return elem.loginName;
          });

          var modelId, userType;
          if (ifShow) {
            var fd = arr.find(function (item) {
              return clone.userType == item.typeCode;
            });
            if (fd) {
              modelId = fd.modelId;
            }
            userType = clone.userType = arr.find(function (item) {
              return clone.userType == item.typeCode;
            });
          }

          var userSelf = false;
          if (clone.userID == userLoginUIService.user.userID) {
            userSelf = true;
          }

          var userInfo = {
            "apply": (modelId == 300 || clone.userType == 10 || clone.userType == 0 || clone.userType == undefined || !ifShow) ? false : true,
            "value": "",
            "label": "",
            "right": true,
            "data": "subDomain",
            "type": "select",
            "composory": true,
            "options": [],
            "events": {
              "change": function (data) {
                if (data.value == undefined) {
                  data.error = userInfo.label + "不可为空";
                  data.right = false;
                } else {
                  data.error = undefined;
                  data.right = true;
                }
              }
            }
          };

          if (modelId != 300 && ifShow) {
            var fdname = arr.find(function (item) {
              if (userType) {
                return item.typeCode == clone.userType.typeCode;
              } else {
                return false;
              }
            });
            userInfo.label = fdname ? fdname.name : "";
            var param = {
              "modelId": userType ? userType.modelId : undefined,
              "layer": userType ? clone.userType.layer : ""
            };
            resourceUIService.getDomainsByFilter(param, function (returnObj) {
              if (returnObj.code == 0) {
                userInfo.options = returnObj.data;
              }
              var findval = userInfo.options.find(function (item) {
                return item.domainPath == clone.subDomain;
              });
              if (findval) {
                userInfo.value = findval.id;
              }
            });
          }
          scope.dialog = {
            title: "用户信息",
            input: [{
              "value": clone.domainPath,
              "label": "管理域",
              "data": "domainID",
              "type": "tree",
              "key": "domainPath",
              "width": 200,
              "composory": true,
              "right": true,
              "options": domaintree,
              "mark": "nodes",
              "apply": true,
              "disabled": userSelf,
              "events": {
                "change": function (data) {
                  if (ifShow && clone.userType != undefined) {
                    scope.dialog.input.find(function (item) {
                      if (item.data == "subDomain") {
                        item.value = "";
                        item.right = false;
                      }
                    });
                    var param = {
                      "domainPath": data.value,
                      "modelId": clone.userType.modelId,
                      "layer": clone.userType.layer
                    };
                    resourceUIService.getDomainsByFilter(param, function (returnObj) {
                      if (returnObj.code == 0) {
                        userInfo.options = returnObj.data;
                      }
                    });
                  }
                  if (!data.value) {
                    data.error = "默认域不可为空";
                    data.right = false;
                  } else {
                    data.error = undefined;
                    data.right = true;
                  }
                }
              }
            }, {
              "value": clone.userType,
              "apply": ifShow,
              "label": "用户类型",
              "data": "userType",
              "type": "userType",
              "disabled": true,
              "composory": true,
              "right": true,
              "options": arr,
              "events": {
                "change": function (data) {
                  if (data.value != 300) {
                    var param = {};
                    if (!scope.baseConfig || !scope.baseConfig.extendDomain) {
                      scope.dialog.input.forEach(function (item) {
                        if (item.data == "domainID") {
                          param.domainPath = item.value;
                        }
                      });
                    }
                    param.modelId = data.value;
                    userInfo.apply = true;
                    userInfo.right = false;
                    userInfo.value = "";
                    userInfo.label = data.options.find(function (item) {
                      return item.id == data.value;
                    }).name;
                    resourceUIService.getDomainsByFilter(param, function (returnObj) {
                      if (returnObj.code == 0) {
                        userInfo.options = returnObj.data;
                      }
                    });
                  } else {
                    userInfo.apply = false;
                    userInfo.right = true;
                  }
                  if (data.value == undefined) {
                    data.error = "用户类型不可为空";
                    data.right = false;
                  } else {
                    data.error = undefined;
                    data.right = true;
                  }
                }
              }
            }, userInfo, {
              "apply": true,
              "label": "用户名称",
              "value": clone.userName,
              "maxlength": 32,
              "data": "userName",
              "type": "input",
              "composory": true,
              "right": true,
              "events": {
                "change": function (data) {
                  if (data.value == "") {
                    data.error = "用户名称不可为空";
                    data.right = false;
                  } else {
                    if (namelist.indexOf(data.value) != -1) {
                      data.error = "用户名已存在";
                      data.right = false;
                    } else {
                      data.error = undefined;
                      data.right = true;
                    }
                  }
                }
              },
            }, {
              "label": "登录名",
              "apply": true,
              "value": clone.loginName,
              "maxlength": 32,
              "composory": true,
              "right": true,
              "events": {
                "change": function (data) {
                  if (data.value == "") {
                    data.error = "登录名不可为空";
                    data.right = false;
                  } else {
                    if (loginlist.indexOf(data.value) != -1) {
                      data.error = "登录名已存在";
                      data.right = false;
                    } else {
                      var regExpNum = /\d+/;
                      var regExpNoNum = /\D+/;
                      var regExp = /^[A-Za-z0-9][A-Za-z0-9_-]{5,32}$/;
                      // if (regExpNum.test(data.value) && regExpNoNum.test(data.value) && data.value.length > 5) {
                      if (regExp.test(data.value)) {
                        data.error = undefined;
                        data.right = true;
                      } else {
                        data.error = "请输入不低于6位的字母、数字和下划线，首字符不能是下划线。";
                        data.right = false;
                      }
                    }
                  }
                },
                "blur": function (data) {
                  if (!data.value || data.error) {
                    return;
                  }
                  if (data.value != row.loginName) {
                    userUIService.checkLoginName(data.value, function (returnObj) {
                      if (returnObj.code == 0) {
                        if (!returnObj.data) {
                          data.error = "登录名已存在";
                          data.right = false;
                        } else {
                          data.error = "";
                          data.right = true;
                        }
                      }
                    })
                  }
                }
              },
              "data": "loginName",
              "type": "input"
            },  {
              "label": "到期日期",
              "value": clone.closingDate ? new Date(clone.closingDate).Format("yyyy-MM-dd") : "",
              "apply": clone.userID == userLoginUIService.user.userID ? false : true,
              "maxlength": 32,
              "data": "closingDate",
              "type": "data",
              "resetdis": true,
              "events": {
                "change": function (data) {
                  var newData = new Date(data.value).Format("yyyy-MM-dd");
                  var ckTime = checkDate(newData);
                  if (ckTime == false) {
                    data.error = "您选择的到期日期小于当前时间！";
                    data.right = false;
                  } else {
                    data.error = undefined;
                    data.right = true;
                  }
                },
                "reset": function (data) {
                  data.value = "";
                }
              }
            }, {
              "label": "办公电话",
              "maxlength": 12,
              "value": clone.officePhone,
              "right": true,
              "composory": false,
              "data": "officePhone",
              "placeholder": "7－11位, 例如：53463333",
              "events": {
                "change": function (data) {
                  if (data.value == "") {
                    data.error = undefined;
                    data.right = true;
                  } else {
                    var valid = checkValidmobile(data.value);
                    if (valid == false) {
                      data.error = "不是有效的电话号码";
                      data.right = false;
                    } else {
                      data.error = undefined;
                      data.right = true;
                    }
                  }
                }
              },
              "type": "input"
            }, {
              "label": "备注",
              "value": clone.description,
              "data": "description",
              "maxlength": 200,
              "type": "textarea"
            }],
            button: [{
              label: TEXT.SUBMIT,
              icon: "btn btn-primary",
              disabledFn: function () {
                var every = scope.dialog.input.every(function (elem) {
                  var rs = (elem.right && elem.value) || elem.right == undefined || elem.apply != true;
                  if (rs != true) {
                  }
                  return rs;
                });
                return !every;
              },
              fn: function () {
                var errorStatus = -1;
                scope.dialog.input.forEach(function (elem) {
                  if (elem.error) {
                    errorStatus = 1;
                    return;
                  }
                });
                if (errorStatus == -1) {
                  var self = scope.dialog;
                  var enterpriseUserRegister_callback = function (event) {
                    if (event.code == 0) {
                      var newUser = event.data;
                      var loop = function (elem) {
                        row[elem.data] = event.data[elem.data];
                        if (elem.data == 'domainID') {
                          row.domainPath = event.data.domainPath;
                        }
                      };
                      for (var i in self.input) {
                        loop(self.input[i])
                      }
                      growl.success("编辑用户成功", {});
                    } else {

                    }
                  };
                  var oldUser = {};
                  var loop = function (elem) {
                    oldUser[elem.data] = elem.value;
                    if (elem.data == 'domainID') {
                      oldUser[elem.data] = elem.value.substring(0, elem.value.length - 1).substring(elem.value.substring(0, elem.value.length - 1).lastIndexOf("/") + 1);
                    } else if (elem.data == 'subDomain') {
                      if (oldUser.subDomain) {
                        oldUser[elem.data] = userInfo.options.find(function (item) {
                          return oldUser.subDomain == item.id;
                        }).domainPath;
                      }
                    } else if (elem.data == 'userType' && elem.value) {
                      oldUser[elem.data] = elem.value.typeCode;
                    } else if (elem.data == 'specialties' && elem.value) {
                      oldUser[elem.data] = "";
                      elem.value.forEach(function (ele) {
                        if (ele) {
                          oldUser[elem.data] += ele + ",";
                        }
                      })
                    }
                  };
                  for (var i in self.input) {
                    loop(self.input[i])
                  }
                  oldUser.userID = row.userID;
                  userUIService.modifyUser(oldUser, enterpriseUserRegister_callback);
                  ngDialog.close();
                }
              }
            }, {
              label: TEXT.CANCEL,
              icon: "btn btn-default",
              fn: function () {
                ngDialog.close();
              }
            }]
          };

          ngDialog.open({
            template: '../partials/dialogue/config_alert_dia.html',
            className: 'ngdialog-theme-plain',
            scope: scope
          });
        };

        var addNewClick = function (event) {
          var cmdins = new cmd();
          var namelist = enterpriseUsers.map(function (elem) {
            return elem.userName;
          });
          var loginlist = enterpriseUsers.map(function (elem) {
            return elem.loginName;
          });
          var emaillist = enterpriseUsers.map(function (elem) {
            return elem.emailAddress;
          });
          var mobilelist = enterpriseUsers.map(function (elem) {
            return elem.mobilePhone;
          });
          var newUserName = $$.duplicateName("新建用户", namelist);
          var newloginName = $$.duplicateName("newuser1", loginlist, false);
          scope.checkDisabled = function (target) {
            if (typeof target == "function") {
              return target();
            } else {
              return target;
            }
          };
          var currentType = scope.userInfo.userType ? scope.userInfo.userType.toString() : "",
            userTypeFilter = []; //10(企业管理员)
          if (currentType && !scope.menuitems['A99_S17']) { //没有编码，则只显示下级用户,有权限编码，则显示下级及所有用户
            for (var key in userTypeList) {
              var val = userTypeList[key].typeCode.toString();
              if (val.indexOf(currentType) == 0) {
                if (val.substring(currentType.length).length == 1) {
                  userTypeFilter.push(userTypeList[key]);
                }
              }
            }
            userTypeList = userTypeFilter;
          }
          var userInfo = {
            "apply": false,
            "value": undefined,
            "label": "",
            "right": false,
            "data": "subDomain",
            "type": "select",
            "composory": true,
            "options": [],
            "events": {
              "change": function (data) {
                if (data.value == undefined) {
                  data.error = userInfo.label + "不可为空";
                  data.right = false;
                } else {
                  data.error = undefined;
                  data.right = true;
                }
              }
            }
          };


          scope.dialog = {
            title: "用户信息",
            note: {
              "message": "系统将自动发送密码到所填手机号或邮箱，手机号或邮箱必选其一填写。"
            },
            input: [{
              "value": undefined,
              "label": "管理域",
              "data": "domainID",
              "type": "tree",
              "right": false,
              "key": "domainPath",
              "width": 200,
              "composory": true,
              "options": domaintree,
              "mark": "nodes",
              "events": {
                "change": function (data) {
                  if (ifShow) {
                    scope.dialog.input.find(function (item) {
                      if (item.data == "userType" || item.data == "subDomain") {
                        item.value = "";
                        item.right = false;
                      }
                    });
                  } else {
                    scope.dialog.input.find(function (item) {
                      if (item.data == "userType" || item.data == "subDomain") {
                        item.value = "";
                        item.right = true;
                      }
                    });
                  }
                  if (data.value == undefined) {
                    data.error = "默认域不可为空";
                    data.right = false;
                  } else {
                    data.error = undefined;
                    data.right = true;
                  }
                }
              }
            }, {
              "value": "",
              "apply": ifShow,
              "label": "用户类型",
              "data": "userType",
              "type": "userType",
              "composory": true,
              "right": true,
              "options": userTypeList,
              "events": {
                "change": function (data) {
                  if (data.value && data.value.modelId != 300) {
                    var param = {};
                    if (!scope.baseConfig || !scope.baseConfig.extendDomain) {
                      scope.dialog.input.find(function (item) {
                        if (item.data == "domainID") {
                          param.domainPath = item.value;
                        }
                      });
                    }
                    param.modelId = data.value.modelId;
                    param.layer = data.value.layer;
                    userInfo.apply = true;
                    userInfo.right = false;
                    userInfo.label = data.options.find(function (item) {
                      return item == data.value;
                    }).name;
                    resourceUIService.getDomainsByFilter(param, function (returnObj) {
                      if (returnObj.code == 0) {
                        userInfo.options = returnObj.data;
                      }
                    });
                  } else {
                    userInfo.apply = false;
                    userInfo.right = true;
                  }
                  if (data.value == undefined || data.value == '') {
                    data.error = "用户类型不可为空";
                    data.right = false;
                  } else {
                    data.error = undefined;
                    data.right = true;
                  }
                }
              }
            }, userInfo, {
              "value": undefined,
              "label": "默认角色",
              "right": false,
              "data": "role",
              "type": "multiple",
              "composory": true,
              "options": queryAllRoles,
              "events": {
                "change": function (data) {
                  if (data.value.length == 0) {
                    data.error = "默认角色不可为空";
                    data.right = false;
                  } else {
                    data.error = undefined;
                    data.right = true;
                  }
                }
              }
            }, {
              "label": "用户名称",
              "value": "",
              "right": false,
              "maxlength": 32,
              "composory": true,
              "data": "userName",
              "events": {
                "change": function (data) {
                  if (data.value == "") {
                    data.error = "用户名称不可为空";
                    data.right = false;
                  } else {
                    if (namelist.indexOf(data.value) != -1) {
                      data.error = "用户名已存在";
                      data.right = false;
                    } else {
                      data.error = undefined;
                      data.right = true;
                    }
                  }
                }
              },
              "type": "input"
            }, {
              "label": "登录名",
              "value": "",
              "maxlength": 32,
              "right": false,
              "composory": true,
              "data": "loginName",
              "type": "input",
              "events": {
                "change": function (data) {
                  if (data.value == "") {
                    data.error = "登录名不可为空";
                    data.right = false;
                  } else {
                    if (loginlist.indexOf(data.value) != -1) {
                      data.error = "登录名已存在";
                      data.right = false;
                    } else {
                      var regExpNum = /\d+/;
                      var regExpNoNum = /\D+/;
                      var regExp = /^[A-Za-z0-9][A-Za-z0-9_-]{5,32}$/;
                      if (regExp.test(data.value)) {
                        data.error = undefined;
                        data.right = true;
                      } else {
                        data.error = "请输入不低于6位的字母、数字和下划线，首字符不能是下划线。";
                        data.right = false;
                      }
                    }
                  }
                },
                "blur": function (data) {
                  if (!data.value || data.error) {
                    return;
                  }
                  userUIService.checkLoginName(data.value, function (returnObj) {
                    if (returnObj.code == 0) {
                      if (!returnObj.data) {
                        data.error = "登录名已存在";
                        data.right = false;
                      } else {
                        data.error = "";
                        data.right = true;
                      }
                    }
                  })
                }
              }
            }, {
              "label": "到期日期",
              "value": "",
              "maxlength": 32,
              "right": true,
              "composory": false,
              "data": "closingDate",
              "type": "data",
              "resetdis": true,
              "events": {
                "change": function (data) {
                  var newData = new Date(data.value).Format("yyyy-MM-dd");
                  var ckTime = checkDate(newData);
                  if (ckTime == false) {
                    data.error = "您选择的到期日期小于当前时间！";
                    data.right = false;
                  } else {
                    data.error = undefined;
                    data.right = true;
                  }
                },
                "reset": function (data) {
                  data.value = "";
                  data.error = undefined;
                  data.right = true;
                }
              }
            }, {
              "label": "手机号",
              "maxlength": 12,
              "value": "",
              "right": true,
              "composory": false,
              "data": "mobilePhone",
              "placeholder": "手机号或邮箱必选其一填写",
              "events": {
                "change": function (data) {
                  if (data.value == "") {
                    data.error = "";
                    data.right = true;
                    return;
                  }
                  var numReg = /^1\d{10}$/;
                  if (numReg.test(data.value) == false) {
                    data.error = "手机号必须是以1开头的11位数字";
                    data.right = false;
                  } else {
                    if (mobilelist.indexOf(data.value) != -1) {
                      data.error = "手机号码已存在";
                      data.right = false;
                    } else {
                      data.error = undefined;
                      data.right = true;
                      var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                      scope.dialog.input.find(function (item) {
                        if (item.data == "emailAddress") {
                          if (item.value == "" || (item.value && emailReg.test(item.value))) {
                            item.right = true;
                          }
                        }
                      });

                    }
                  }
                }
              },
              "type": "input"
            }, {
              "label": "邮箱",
              "maxlength": 32,
              "value": "",
              "composory": false,
              "right": true,
              "placeholder": "手机号或邮箱必选其一填写",
              "data": "emailAddress",
              "events": {
                "change": function (data) {
                  if (data.value == "") {
                    data.error = "";
                    data.right = true;
                    return;
                  }
                  var emailReg = /^[a-zA-Z0-9_-].+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                  if (emailReg.test(data.value) == false) {
                    data.right = false;
                    data.error = "不是正确的邮箱格式"
                  } else {
                    if (emaillist.indexOf(data.value) != -1) {
                      data.error = "邮箱已存在";
                      data.right = false;
                    } else {
                      data.error = undefined;
                      data.right = true;
                      var numReg = /^1\d{10}$/;
                      scope.dialog.input.find(function (item) {
                        if (item.data == "mobilePhone") {
                          if (item.value == "" || (item.value && numReg.test(item.value))) {
                            item.right = true;
                          }
                        }
                      });
                    }
                  }
                }
              },
              "type": "input"
            }, {
              "label": "办公电话",
              "maxlength": 12,
              "value": "",
              "right": true,
              "composory": false,
              "data": "officePhone",
              "placeholder": "7－11位, 例如：53463333",
              "events": {
                "change": function (data) {
                  if (data.value == "") {
                    data.error = undefined;
                    data.right = true;
                  } else {
                    var valid = checkValidmobile(data.value);
                    if (valid == false) {
                      data.error = "不是有效的电话号码";
                      data.right = false;
                    } else {
                      data.error = undefined;
                      data.right = true;
                    }
                  }
                }
              },
              "type": "input"
            }, {
              "label": "备注",
              "value": "",
              "data": "description",
              "maxlength": 200,
              "type": "textarea"
            }, {
              "label": "启用",
              "value": true,
              "data": "status",
              "type": "toggle"
            }],
            button: [{
              label: TEXT.SUBMIT,
              icon: "btn btn-primary",
              disabledFn: function () {
                var every = scope.dialog.input.every(function (elem) {
                  var rs = elem.right != false || elem.apply == false;
                  if (rs != true) {
                    console.log(elem);
                  }
                  return rs;
                });
                return !every;
              },
              fn: function () {
                var role = [];
                var self = scope.dialog;
                var enterpriseUserRegister_callback = function (event) {
                  if (event.code == 0) {
                    var newUser = event.data;
                    userRoleUIService.queryRoleByUser(event.data.userID, function (returnObj) {
                      newUser.roles = returnObj.data;
                    });
                    enterpriseUsers.pushbefore(newUser);
                    growl.success("创建新用户成功", {});
                    ngDialog.close();
                  }
                  ;
                };
                var newUser = {};
                var loop = function (elem) {
                  newUser[elem.data] = elem.value;
                  if (elem.data == 'domainID') {
                    newUser[elem.data] = elem.value.substring(0, elem.value.length - 1).substring(elem.value.substring(0, elem.value.length - 1).lastIndexOf("/") + 1);
                  } else if (elem.data == 'subDomain') {
                    if (newUser.subDomain) {
                      newUser[elem.data] = userInfo.options.find(function (elem) {
                        return newUser.subDomain == elem.id;
                      }).domainPath;
                    }
                  } else if (elem.data == 'role') {
                    elem.value.forEach(function (item) {
                      role.push({
                        roleID: item
                      });
                    })
                  } else if (elem.data == 'userType') {
                    newUser[elem.data] = elem.value.typeCode;
                  } else if (elem.data == 'specialties' && elem.value) {
                    newUser[elem.data] = "";
                    elem.value.forEach(function (ele) {
                      newUser[elem.data] += ele + ",";
                    })
                  }
                }
                for (var i in self.input) {
                  loop(self.input[i]);
                }

                var domain;

                for (var key in domainlist) {
                  if (domainlist[key].id == newUser.domainID) {
                    domain = domainlist[key];
                  }
                }
                if (domain) {
                  domain = {
                    userID: "",
                    domainID: domain.id,
                    domainPath: domain.domainPath,
                    name: domain.name
                  };
                }
                delete newUser.domainID;
                delete newUser.role;
                newUser.status = newUser.status ? 0 : -1;
                if (scope.baseConfig && scope.baseConfig.extendDomain) {
                  newUser.domains = domain.domainPath;
                }
                if (!newUser.mobilePhone && !newUser.emailAddress) {
                  growl.warning("请手机号或邮箱选其一进行填写", {});
                  return;
                }
                userUIService.enterpriseUserRegister(newUser, domain, role, enterpriseUserRegister_callback);
              }
            }, {
              label: TEXT.CANCEL,
              icon: "btn btn-default",
              fn: function () {
                ngDialog.close();
              }
            }]
          };
          ngDialog.open({
            template: '../partials/dialogue/config_alert_dia.html',
            className: 'ngdialog-theme-plain',
            scope: scope
          });
        }


        var assignCharacter = function (list) {
          var inx = 0;
          var rs = [];
          var assignRole = list;
          var allLoaded = function () {
            var finished = function () {
              var roles = scope.cache.role.$clone();
              var roleArr = [];
              var hasUserType2 = list.some(function (elem) {
                return elem.userType == 2;
              });
              if (list.length > 1) {
                for (var i in roles) {
                  roles[i].applied = false;
                  if (roles[i].roleID != 101 || roles[i].roleID != 103) { //暂时没有企业B角色
                    roleArr.push(roles[i]);
                  }
                }
              } else if (list.length == 1) {
                for (var i in roles) {
                  if (rs.indexOf(roles[i].roleID) != -1) {
                    roles[i].applied = true;
                    roleArr.push(roles[i]);
                  } else {
                    if (roles[i].roleID != 101 && roles[i].roleID != 103) {
                      roleArr.push(roles[i]);
                    }
                  }
                }
              }
              scope.dialog = {
                title: "角色分配",
                titles: ['未分配角色', '已分配角色'],
                mark: "roleName",
                characters: roleArr,
                button: [{
                  label: TEXT.SUBMIT,
                  icon: "btn btn-primary",
                  fn: function () {
                    var inx = 0;
                    var rls = roles.filter(function (elem) {
                      return elem.applied == true;
                    }).map(function (elem) {
                      return elem.roleID;
                    });
                    if (rls.length <= 0) {
                      growl.warning("必须要有一个已分配角色", {});
                      return;
                    }
                    var removeRole = function (userID) {
                      var rem = [];
                      for (var i in roles) {
                        var tmp = -1;
                        for (var j in rls) {
                          if (roles[i].roleID == rls[j]) {
                            tmp = j;
                            break;
                          }
                        }
                        if (tmp == -1) {
                          rem.push(roles[i].roleID);
                        }
                      }
                      if (rem.length > 0) {
                        userRoleUIService.removeRole(list[0].userID, rem, function (res) {
                          if (res.code == 0) {
                            console.log("删除角色成功");
                            for (var i in assignRole) {
                              assignRole[i].roleID = rls.join(",");
                            }
                            $$.cacheAsyncData.call(userRoleUIService.queryRoleByUser, [list[0].userID], function (event) {
                              if (event.code == 0) {
                                list[0].roles = res.data;
                              }
                            });
                            growl.success("角色分配成功", {});
                          } else {
                            console.log("删除角色失败");
                          }
                        });
                      }
                    }
                    var completeMsg;
                    var complete = function (list) {
                      ngDialog.close();
                      if (completeMsg) {
                        growl.warning(completeMsg, {});
                      } else {
                        removeRole(list);
                      }
                    };
                    var traverse = function (list) {
                      var item = list[inx];
                      if (list[inx]) {
                        list[inx].selected = false;
                        var success = function (event) {
                          if (event.code == 0) {
                            var findManager = event.data.find(function (elem) {
                              return elem.roleID == 100 || elem.roleID == 101 || elem.roleID == 102 || elem.roleID == 103;
                            });
                            /* if (findManager) {
                             if (rls.indexOf(findManager.roleID) == -1) {
                             completeMsg = "管理员角色不能被删除";
                             };
                             };*/
                            $$.cacheAsyncData.call(userRoleUIService.queryRoleByUser, [item.userID], function (event) {
                              if (event.code == 0) {
                                item.roles = event.data;
                              }
                            });
                          } else {
                            return;
                          }
                          inx++;
                          traverse(list);
                        };
                        var error = function (error) {
                          inx++;
                          traverse(list);
                        }
                        userRoleUIService.appendRole(list[inx].userID, rls, success, error);
                      } else {
                        complete(list);
                      }
                    };
                    traverse(list)

                  }
                }, {
                  label: TEXT.CANCEL,
                  icon: "btn btn-default",
                  fn: function () {
                    ngDialog.close();
                  }
                }]
              };
              ngDialog.open({
                template: '../partials/dialogue/character_assign_dia.html',
                className: 'ngdialog-theme-plain',
                scope: scope
              });
            };
            var queryEnterpriseRole_back = function (event) {
              if (event.code == 0) {
                var eventAllRoles = [];
                event.data.forEach(function (item) {
                  item.id = item.roleID;
                  item.label = item.roleName;
                  if (userLoginUIService.user.domainPath.split("/").length <= 4 || item.domainPath.search(userLoginUIService.user.domainPath) > -1) {
                    eventAllRoles.push(item);
                  }
                })
                scope.cache.role = eventAllRoles.map(function (elem) {
                  if (userLoginUIService.user.userID == 1 && elem.roleID != 101 && elem.roleID != 103) {
                    if (elem.roleID == 100 || elem.roleID == 102) {
                      elem.roleName += "A";
                    }
                  }
                  return elem;
                });
                finished();
              }
            };
            if (scope.cache.role == undefined) {
              userEnterpriseService.queryEnterpriseRole(queryEnterpriseRole_back);
            } else {
              finished();
            }
          };
          var traverse = function (list) {
            var callback = function (event) {
              if (event.code == "0") {
                var loop = function (item) {
                  var map = rs.map(function (el) {
                    return el.roleID
                  });
                  if (item && map.indexOf(item.roleID) == -1) {
                    rs.push(item.roleID);
                  }
                };
                var roleList = list[inx].roles;
                for (var i in roleList) {
                  loop(roleList[i])
                }
              }
              
              inx++;
              traverse(list);
            };
            if (list[inx]) {
              $$.cacheAsyncData.call(userRoleUIService.queryRoleByUser, [list[inx].userID], callback);
            } else {
              allLoaded();
            }
          };
          traverse(list);
        };

        var setEnable = function (list, callback) {
          var editableUser = list.filter(function (elem) {
            return elem.status != 0 && elem.userID != userLoginUIService.user.userID;
          });
          var diseditableUser = list.filter(function (elem) {
            return elem.status == 0 && elem.userID != userLoginUIService.user.userID;
          });
          var fnlist = [{
            label: TEXT.SUBMIT,
            icon: 'btn btn-success',
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function () {
              var users = editableUser.map(function (elem) {
                return elem.userID;
              });
              userUIService.enableUsers(users, function (event) {
                if (event.code == 0) {
                  for (var i in editableUser) {
                    editableUser[i].status = 0;
                  }
                  enterpriseUsers.removeAllChecked();
                  if (callback) {
                    callback();
                  } else {
                    var msg = "启用用户，成功" + event.data.successObj.length + "个,失败" + event.data.failObj.length + "个";
                    growl.success(msg, {});
                  }
                  ngDialog.close();
                }
              });
            }
          }, {
            label: TEXT.CANCEL,
            icon: 'btn btn-default',
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function () {
              ngDialog.close();
            }
          }];
          scope.dialog = {
            title: {
              label: '提示'
            },
            description: {
              label: editableUser.length > 1 ? '当前有' + editableUser.length + '个用户未启用状态，确认要启用吗？' : '确认要启用' + editableUser[0].userName + '用户吗？'
            },
            fnlist: fnlist
          };
          ngDialog.open({
            template: '../partials/dialogue/common_dia_prompt.html',
            className: 'ngdialog-theme-plain',
            scope: scope
          })
        };

        var setEnableGroupClick = function (source) {
          setEnable(source);
        };

        var setEnableClick = function (row) {
          setEnable([row], function () {
            var msg = "已启用成功";
            growl.success(msg, {});
          });
        };

        var setDisable = function (list, callback) {
          var editableUser = list.filter(function (elem) {
            return elem.status == 0 && elem.userID != userLoginUIService.user.userID;
          });
          var diseditableUser = list.filter(function (elem) {
            return elem.status != 0 && elem.userID != userLoginUIService.user.userID;
          });
          var fnlist = [{
            label: TEXT.SUBMIT,
            icon: 'btn btn-success',
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function () {
              var users = editableUser.map(function (elem) {
                return elem.userID;
              });

              if (users.length > 0) {
                userUIService.disableUsers(users, function (event) {
                  if (event.code == 0) {
                    for (var i in editableUser) {
                      editableUser[i].status = -1;
                    }
                    enterpriseUsers.removeAllChecked();
                    if (callback) {
                      callback();
                    } else {
                      var msg = "停用用户，成功" + event.data.successObj.length + "个, 失败" + event.data.failObj.length + "个";
                      growl.success(msg, {});
                    }
                    ngDialog.close();
                  }
                });
              } else {
                if (callback) {
                  callback();
                } else {
                  var msg = "停用用户，成功" + editableUser.length + "个, 失败" + diseditableUser.length + "个";
                  growl.success(msg, {});
                }
                ngDialog.close();
              }

            }
          }, {
            label: TEXT.CANCEL,
            icon: 'btn btn-default',
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function () {
              ngDialog.close();
            }
          }];

          if (editableUser.length <= 0) {
            growl.info("不能停用自己的账号", {});
            return;
          }
          scope.dialog = {
            title: {
              label: '提示'
            },
            description: {
              label: editableUser.length > 1 ? '当前有 ' + editableUser.length + ' 个用户启用状态，停用后将禁止登录系统，确认要停用吗' : '用户停用后将禁止登录系统，确认要停用 ' + editableUser[0].userName + ' 用户吗？'
            },
            fnlist: fnlist
          };
          ngDialog.open({
            template: '../partials/dialogue/common_dia_prompt.html',
            className: 'ngdialog-theme-plain',
            scope: scope
          });
        };

        var setDisableGroupClick = function (source) {
          setDisable(source);
        }

        var setDisableClick = function (row) {
          setDisable([row], function () {
            var msg = "已停用成功";
            growl.success(msg, {});
          });
        };

        var assignCharacterGroupClick = function (event) {
          assignCharacter(event);
        };

        var assignCharacterClick = function (row, source) {
          assignCharacter([row]);
        };
        scope.allDomain = [];
        scope.allDomainDic = {};
        scope.defaultDeviceIds = [];
        scope.allDomainTree = {};
        scope.accredit = 'domain';
        scope.all = {"check": false};
        scope.allDevice = [];
        var domainAllot = function (row, source) {
          scope.allDomain = scope.allDomainInit.slice(0);
          var dialogueHtml = function (data) {
            scope.domainList = [];
            scope.all.check = false;
            var ids = row.domainIds;
            if (row.domainIds && scope.allDomainDic[row.domainPath] != undefined && row.domainIds.indexOf("" + scope.allDomainDic[row.domainPath].id + "") == -1) {
              ids = ids + "," + scope.allDomainDic[row.domainPath].id;
            } else {
              if (scope.allDomainDic[row.domainPath] != undefined && row.domainIds.indexOf("" + scope.allDomainDic[row.domainPath].id + "") == -1) {
                ids = scope.allDomainDic[row.domainPath].id + "";
              }
            }
            var domainIdsArr = ids.split(",");
            for (var j in domainIdsArr) {
              for (var n in scope.allDomain) {
                if (scope.allDomain[n].id == domainIdsArr[j]) {
                  scope.domainList.push(scope.allDomain[n]);
                  scope.allDomain.splice(n, 1);
                  break;
                }
              }
            }
            ngDialog.open({
              template: '../partials/dialogue/default_domain.html',
              scope: scope,
              className: 'ngdialog-theme-plain'
            });
          }
          scope.domainObj = row;
          dialogueHtml();
        };
        scope.defaultDomainAction = function (select, type) {
          if (type == "add" && scope.domainObj.domainIds) {
            for (var j in scope.domainList) {
              var selDomainPath = scope.allDomainDic[scope.domainObj.domainIds].domainPath;
              var domainPath = scope.domainList[j].domainPath;
              var domainPathStr = domainPath.split("/");
              if (scope.allDomainDic[scope.domainObj.domainIds].id == scope.domainList[j].id) {
                growl.warning("您选择的域已存在", {});
                scope.domainObj.domainIds = "";
                return;
              }
              for (var i in domainPathStr) {
                if (domainPathStr[i] == "" + scope.allDomainDic[scope.domainObj.domainIds].id + "") {
                  growl.warning("不能选当前域的父域", {});
                  scope.domainObj.domainIds = "";
                  return;
                }
              }
              if (selDomainPath.indexOf("" + scope.domainList[j].id + "") != -1) {
                growl.warning("不能选当前域的低级别域，删除父域在添加", {});
                scope.domainObj.domainIds = "";
                return;
              }
            }
            scope.allDomain.splice(jQuery.inArray(scope.allDomainDic[scope.domainObj.domainIds], scope.allDomain), 1);
            scope.domainList.push(scope.allDomainDic[scope.domainObj.domainIds]);
            scope.domainObj.domainIds = "";
          } else if (type == "del") {
            scope.domainObj.domainIds = "";
            for (var i in scope.domainList) {
              if (scope.domainList[i].id == select.id) {
                scope.allDomain.push(scope.domainList[i]);
                scope.domainList.splice(i, 1);
                break;
              }
            }
          } else if (type == "save") {
            var domainIds = "";
            for (var i in scope.domainList) {
              domainIds += scope.domainList[i].id + ",";
            }
            // 所选的设备
            var domainIdsAllot = [];
            for (var j in scope.devices) {
              if (scope.devices[j].check) {
                domainIdsAllot.push(scope.devices[j].id);
              }
            }
            var modifyUser_callback = function (event) {
              if (event.code == 0) {
                growl.success("默认扩展域修改成功", {});
              }
            };
            scope.domainObj.domainIds = domainIds;
            scope.domainObj.deviceIds = domainIdsAllot;
            scope.domainObj.deviceDomainId = select.split("/")[select.split("/").length-2]; //当前的域的Id
            userUIService.modifyUser(scope.domainObj, modifyUser_callback)
          }
        }
        /**
         * 查询设备
         * @param obj
         */
        var deviceQuery = function (obj, selecedDeviceStr) {
          resourceUIService.getDevicesByCondition(obj, function (returnObj) {
            if (returnObj.code == 0) {
              returnObj.data.forEach(function (item) {
                var cmdins = new cmd();
                var customNameArr = cmdins.getdomainNameHandler(item.domains, []);
                var customName = "";
                for (var i = 1; i < customNameArr.length; i++) {
                  customName += customNameArr[i] + "/";
                }
                item["customName"] = customName;
                item["check"] = false;
                if (selecedDeviceStr.indexOf(item.id) > -1) {
                  item.check = true;
                }
              });
              scope.devices = returnObj.data;
            }
          }, "includeFields=label,domains,id")
        }
        /**
         * 完成了数据授权的功能
         * 检查上次有没有选中设备
         * 查询所选的域下有多少设备
         *
         * HANXING  2018.06.15
         */

        scope.queryDevice = function (domains, name) {
          // 所选的设备
          scope.department = domains;
          var selecedDeviceStr = "";
          userUIService.queryUserDeviceByDeviceDomains(scope.domainObj.userID,domains, function (resultObj) {
            if (resultObj && resultObj.data.length > 0) {
              resultObj.data.forEach(function (ele) {
                selecedDeviceStr += ele.deviceId + ";";
              })
            }
            deviceQuery({domains: domains, label: name}, selecedDeviceStr);
          });
        }
        var resetPwd = function (row, source) {
          var fnlist = [{
            label: TEXT.SUBMIT,
            icon: 'btn btn-primary',
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function () {
              ngDialog.close();
              if (row.userID != userLoginUIService.user.userID) {
                if (row.emailAddress == "" || row.emailAddress == null) {
                  userUIService.sendModifyPassword(row.mobilePhone, function (resultObj) {
                    if (resultObj.code == 0) {
                      growl.success("重置密码成功,请查收", {});
                    }
                  });
                } else {
                  userUIService.sendModifyPassword(row.emailAddress, function (resultObj) {
                    if (resultObj.code == 0) {
                      growl.success("重置密码成功,请查收", {});
                    }
                  });
                }
              } else {
                growl.warning("不能重置自己密码!", {});
              }
            }
          }, {
            label: TEXT.CANCEL,
            icon: 'btn btn-default',
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function () {
              ngDialog.close();
            }
          }];
          scope.dialog = {
            title: {
              label: '提示'
            },
            description: {
              label: '确认要重置该用户密码？'
            },
            fnlist: fnlist
          };
          ngDialog.open({
            template: '../partials/dialogue/common_dia_prompt.html',
            className: 'ngdialog-theme-plain',
            scope: scope
          })
        };
        var loadedCount = 0;
        var queryEnterpriseUser_back = function (event) {
          if (event.code == 0) {
            if (!scope.menuitems['A99_S17']) { //如果不存在跨域用户权限，不显示上一级别的用户
              enterpriseUsers = event.data.filter(function (item) {
                if (item.domainPath.search(userLoginUIService.user.domainPath) > -1) {
                  return true;
                }
                return false;
              });
            } else {
              enterpriseUsers = event.data;
            }
            loadedCount++;
            if (loadedCount == 4) {
              userListHandler();
            }
          }
        }
        /*queryEnterpriseUser_back*/

        var queryDomainTree_back = function (event) {
          domainlist = event.domainListDic;
          console.log(event)
          domaintree = {
            nodes: event.data,
            domainInfos: event.data
          };
          // for (var item in event.domainListDic) {
          //   console.log(event.domainListDic[item].domains)
          //   if(event.domainListDic[item].domains){
          //     var cmdins = new cmd();
          //     var customNameArr = cmdins.getdomainNameHandler(event.domainListDic[item].domains, []);
          //     var customName = "";
          //     for (var i = 1; i < customNameArr.length; i++) {
          //       customName += customNameArr[i] + "/";
          //     }
          //     event.domainListDic[obj]["customName"] = customName;
          //   }
          // }
          scope.allDomainTree = event.data;
          scope.allDomainDic = event.domainListDic;
          scope.allDomainInit = event.data[0].domainInfos;
          loadedCount++;
          if (loadedCount == 4) {
            userListHandler();
          }
        }
        var userListHandler = function () {
          enterpriseUsers.forEach(function (user) {
            if (user.roleID) {
              user.roles = [];

              user.roleID.split(",").forEach(function (roleId) {
                user.roles.push(allRolesDataDic[roleId])
              })
            }
          })
          var headerArr = [];
          var optList = [];
          if (scope.menuitems['D02_A01_S17']) {
            headerArr.push({
              icon: "fa fa-plus",
              'class': "btn btn-primary btn-sm",
              label: "添加用户",
              style: {
                margin: "2px"
              },
              type: "button",
              events: {
                click: addNewClick
              }
            });
          }
          if (scope.menuitems['D05_A01_S17']) {
            headerArr.push({
              icon: "fa fa-play",
              'class': "btn btn-default btn-sm",
              label: "启用",
              style: {
                margin: "2px"
              },
              type: "button",
              disabled: function (event) {
                var some = event.some(function (elem) {
                  return elem.selected == true && elem.status == -1;
                });
                return !some;
              },
              events: {
                click: setEnableGroupClick
              }
            });
          }
          if (scope.menuitems['D06_A01_S17']) {
            headerArr.push({
              icon: "fa fa-stop",
              'class': "btn btn-default btn-sm",
              label: "停用",
              style: {
                margin: "2px"
              },
              type: "button",
              disabled: function (event) {
                var some = event.some(function (elem) {
                  return elem.selected == true && elem.status == 0;
                });
                return !some;
              },
              events: {
                click: setDisableGroupClick
              }
            });
          }
          if (scope.menuitems['D03_A01_S17']) {
            optList.push({
              label: "编辑",
              type: "button",
              'class': "btn btn-primary",
              events: {
                click: userEditClick
              }
            });
          }
          if (scope.menuitems['D04_A01_S17']) {
            optList.push({
              label: "删除",
              type: "button",
              'class': "btn btn-default",
              disabled: function (row, source) {
                return row.userID == userLoginUIService.user.userID || row.status == 0;
              },
              events: {
                click: deleteClick
              }
            });
          }
          if (scope.menuitems['D07_A01_S17']) {
            optList.push({
              label: "角色分配",
              type: "button",
              'class': "btn btn-default",
              events: {
                click: assignCharacterClick
              }
            });
          }
          if (scope.menuitems['D08_A01_S17']) {
            optList.push({
              label: "重置密码",
              type: "button",
              'class': "btn btn-default",
              visible: function (row, source) {
                return row.userID != userLoginUIService.user.userID;
              },
              events: {
                click: resetPwd
              }
            });
          }
          if (scope.menuitems['D09_A01_S17']) {
            optList.push({
              label: "数据授权 ",
              type: "button",
              'class': "btn btn-default",
              visible: function (row, source) {
                return row.userID != userLoginUIService.user.userID;
              },
              events: {
                click: domainAllot
              }
            });
          }
          if (scope.menuitems['D05_A01_S17']) {
            optList.push({
              label: "启用",
              type: "button",
              'class': "btn btn-default",
              visible: function (row) {
                return row.status == -1;
              },
              events: {
                click: setEnableClick
              }
            });
          }
          if (scope.menuitems['D06_A01_S17']) {
            optList.push({
              label: "停用",
              type: "button",
              'class': "btn btn-default",
              visible: function (row) {
                return row.status == 0 && row.userID != userLoginUIService.user.userID;
              },
              events: {
                click: setDisableClick
              }
            });
          }
          var defs = [{
            label: "用户名称",
            width: "10%",
            editable: true,
            sortable: true,
            filterable: true,
            data: "userName",
            type: "text",
            modes: {
              'default': {
                type: "text",
              },
              edit: {
                type: "input",
                placeholder: "例如：请填写用户名，用户名不可为空"
              }
            }
          }, {
            label: "登录名",
            width: "10%",
            editable: true,
            sortable: true,
            filterable: true,
            data: "loginName",
            type: "text",
            modes: {
              'default': {
                type: "text",
              },
              edit: {
                type: "input",
                placeholder: "例如：请填写用户名，用户名不可为空"
              }
            }
          }, {
            label: "手机号",
            width: "10%",
            editable: true,
            sortable: true,
            filterable: true,
            data: "mobilePhone",
            type: "text",
            format: function (value) {
              return value ? value : "-";
            },
            modes: {
              'default': {
                type: "text",
              },
              edit: {
                type: "input",
                placeholder: "例如：请填写用户名，用户名不可为空"
              }
            }
          }, {
            label: "邮箱",
            width: "10%",
            type: "text",
            sortable: true,
            filterable: true,
            data: "emailAddress",
            format: function (value) {
              return value ? value : "-";
            },
            modes: {
              'default': {
                type: "text",
              },
              edit: {
                type: "text"
              }
            }
          }, {
            label: "已分配角色",
            type: "selectObj",
            sortable: true,
            filterable: true,
            filterFormat: {
              label: "roleName",
              value: "roleID"
            },
            data: "roles",
            options: allRolesData,
            format: function (value) {
              if (!value) return "";
              var value = value.map(function (elem) {
                if (elem && elem.roleName != undefined) {
                  return elem.roleName;
                }
              });
              return value.toString();
            },
            modes: {
              'default': {
                type: "text",
              },
              edit: {
                type: "input",
                placeholder: "例如：010-66668888"
              }
            }
          }, {
            label: "管理域",
            type: "tree",
            sortable: true,
            filterable: true,
            data: "domainPath",
            key: "domainPath",
            mark: "nodes",
            options: domaintree,
            format: function (value) {
              if (!value) return "-";
              var find = domainlist[value];
              if (find) {
                return find.label;
              } else {
                return "-";
              }
            },
            modes: {
              'default': {
                type: "text",
              }
            }
          }, {
            label: "状态",
            width: "30px",
            type: "status",
            sortable: true,
            filterable: true,
            'class': function (row) {
              if (row.status == 0) {
                return "label-success";
              } else {
                return "label-default";
              }
            },
            style: function (col) {
              return {
                "cursor": "default"
              }
            },
            format: function (value) {
              if (value == 0) {
                return "已启用";
              } else {
                return "未启用";
              }
            },
            data: "status"
          }, {
            label: "操作",
            type: "buttonGroup",
            filterable: false,
            sortable: false,
            width: "141px",
            modes: {
              'default': {
                options: optList
              },
              edit: {
                options: [{
                  label: "保存",
                  type: "button",
                  'class': "btn btn-primary",
                  events: {
                    click: saveClick
                  }
                }, {
                  label: "取消",
                  type: "button",
                  'class': "btn btn-default",
                  events: {
                    click: cancelClick
                  }
                }]
              }
            }
          }];
          //如果没有配置用户类型将不会显示
          if (ifShow == true) {
            defs[1] = {
              label: "用户类型",
              apply: true,
              editable: true,
              sortable: true,
              data: "userType",
              type: "text",
              format: function (value) {
                var find = userList.find(function (elem) {
                  return elem.id == value;
                });
                if (find) {
                  return find.label;
                } else if (value == 10) {
                  return "企业管理员";
                } else {
                  return "-";
                }
              },
              modes: {
                'default': {
                  type: "text",
                },
                edit: {
                  type: "input"
                }
              }
            };
          }
          scope.userlist = {
            source: enterpriseUsers,
            header: headerArr,
            columnDefs: defs
          };
        }
        /*queryDomainTree_back*/

        userEnterpriseService.queryEnterpriseRole(function (returnObj) {
          if (returnObj.code == 0) {
            queryAllRoles = [];
            var rs = [];
            for (var i in returnObj.data) {
              if (returnObj.data[i]) {
                rs.push(returnObj.data[i]);
              }
            }
            rs.forEach(function (item) {
              item.id = item.roleID;
              item.label = item.roleName;
              allRolesData.push(item);
              allRolesDataDic[item.id] = item;
              if (userLoginUIService.user.domainPath.split("/").length <= 4 || item.domainPath.search(userLoginUIService.user.domainPath) > -1) {
                queryAllRoles.push(item);
              }
            });
            scope.cache.role = queryAllRoles.map(function (elem) {
              if (userLoginUIService.user.userID == 1 && elem.roleID != 101 && elem.roleID != 103) {
                if (elem.roleID == 100 || elem.roleID == 102) {
                  elem.roleName += "A";
                }
              }
              return elem;
            });
            loadedCount++;
            if (loadedCount == 4) {
              userListHandler();
            }
          }
        });
        /**
         * 这个bug是在用户管理页面
         * 刚开始表格管理域显示正常，一刷新管理域有的不显示
         * 问题是: scope.baseConfig.extendDomain 这个属性没有找到,是接口异步的问题
         * hanxing 2018.07.06
         */
        resourceUIService.getExtendDomainsByFilter({}, queryDomainTree_back);
        /*
         if (scope.baseConfig && scope.baseConfig.extendDomain) {
         resourceUIService.getExtendDomainsByFilter({}, queryDomainTree_back);
         } else {
         userDomainService.queryDomainTree(userLoginUIService.user.userID, queryDomainTree_back);
         }
         */
        var getConfigsByGroupName_back = function (returnObj) {
          if (returnObj.code == 0 && returnObj.data[0]) {
            ifShow = true;
            userList = JSON.parse(returnObj.data[0].value);
            userTypeList = JSON.parse(returnObj.data[0].value);
            userList.forEach(function (item) {
              item.id = item.typeCode;
            });
          } else if (returnObj.code == 0 && returnObj.data.length == 0) {
            userTypeList = [{
              typeCode: 10,
              modelId: 300,
              name: '企业用户'
            }];
            userList = [{
              id: 300,
              typeCode: 10,
              modelId: 300,
              label: '企业用户'
            }];
            ifShow = false;
          }
          loadedCount++;
          if (loadedCount == 4) {
            userListHandler();
          }
        }
        /*getConfigsByGroupName_back*/
        configUIService.getConfigsByGroupName("UserType", getConfigsByGroupName_back)
        userUIService.queryUserByCondition({}, queryEnterpriseUser_back);
      }

      var renderRoleList = function () {
        var roleList = [],
          enterpriseUsers;
        var checkRole = function (str) {
          var role = str + "";
          return role.length < 5;
        };
        var permissionAssignment = function (row) {
          rootScope.currentRole = row.roleID;
          location.path("usermanager/permission/menus/" + row.roleID)
        };
        var assignCharacter = function (list) {
          var inx = 0;
          var rs = [];
          var allLoaded = function () {
            var finished = function () {
              var roles = scope.cache.role.$clone();
              // var hasUserType2 = list.some(function(elem) {
              //   return elem.userType == 2;
              // });
              if (list.length > 1) {
                for (var i in roles) {
                  roles[i].applied = false;
                }
              } else if (list.length == 1) {
                for (var i in roles) {
                  if (rs.indexOf(roles[i].userID) != -1) {
                    roles[i].applied = true;
                  }
                }
              }
              scope.dialog = {
                title: "用户分配",
                titles: ['未分配用户', '已分配用户'],
                mark: "userName",
                characters: roles,
                button: [{
                  label: TEXT.SUBMIT,
                  icon: "btn btn-primary",
                  fn: function () {
                    var inx = 0;
                    var rls = roles.filter(function (elem) {
                      return elem.applied == true;
                    }).map(function (elem) {
                      return elem.userID;
                    });

                    var removeRole = function (list) {
                      for (var k in rls) {
                        rs.splice($.inArray(rls[k], rs), 1);
                      }
                      userRoleUIService.removeUser(rs, list[0].roleID, function (res) {
                        if (res.code == 0) {
                          growl.success("用户分配成功", {});
                        } else {
                          console.log("删除用户失败");
                        }
                      });
                    }
                    var completeMsg;
                    var complete = function (list) {
                      ngDialog.close();
                      if (completeMsg) {
                        growl.warning(completeMsg, {});
                      } else {
                        removeRole(list);
                      }
                    };
                    var traverse = function (list) {
                      if (list[inx]) {
                        list[inx].selected = false;
                        var success = function (event) {
                          if (event.code == 0) {
                            // var findManager = event.data.find(function(elem) {
                            //   return elem.roleID == 100 || elem.roleID == 101 || elem.roleID == 102 || elem.roleID == 103;
                            // });
                            // if (findManager) {
                            //   if (rls.indexOf(findManager.roleID) == -1) {
                            //     completeMsg = "管理员用户不能被删除";
                            //   };
                            // };
                          }
                          inx++;
                          traverse(list);
                        };
                        var error = function (error) {
                          inx++;
                          traverse(list);
                        }
                        userRoleUIService.appendUser(rls, list[inx].roleID, success, error);
                      } else {
                        complete(list);
                      }
                    };
                    traverse(list)

                  }
                }, {
                  label: TEXT.CANCEL,
                  icon: "btn btn-default",
                  fn: function () {
                    ngDialog.close();
                  }
                }]
              };
              ngDialog.open({
                template: '../partials/dialogue/character_assign_dia.html',
                className: 'ngdialog-theme-plain',
                scope: scope
              });
            };
            var queryEnterpriseUser_back = function (event) {
              if (event.code == 0) {
                scope.cache.role = event.data.map(function (elem) {
                  return elem;
                });
                finished();
              }
            };
            if (scope.cache.role == undefined) {
              userUIService.queryUserByCondition({}, queryEnterpriseUser_back);
            } else {
              finished();
            }
          };
          var traverse = function (list) {
            var callback = function (event) {
              if (event.code == "0") {
                var loop = function (item) {
                  var map = rs.map(function (el) {
                    return el.userID
                  });
                  if (map.indexOf(item.userID) == -1) {
                    rs.push(item.userID);
                  }
                };
                for (var i in event.data) {
                  loop(event.data[i])
                }
              }
              inx++;
              traverse(list);
            };
            if (list[inx]) {
              userRoleUIService.getAssociateRole2User({
                roleID: list[inx].roleID
              }, callback);
            } else {
              allLoaded();
            }
          };
          traverse(list);
        };
        var associateRole2User = function (row, source) {
          assignCharacter([row]);
        };
        var editClick = function (row, source) {
          var namelist = roleList.filter(function (elem) {
            return elem.roleID != row.roleID;
          }).map(function (elem) {
            return elem.roleName;
          });
          /** var newRoleName = $$.duplicateName("新建角色", namelist); */
          scope.dialog = {
            title: {
              label: "角色信息"
            },
            input: [{
              "label": "角色名称",
              "value": row.roleName,
              "composory": true,
              "data": "roleName",
              "type": "input",
              "maxlength": 32,
              "onChange": function (item) {
                //角色存在同一有后端提示 tyq
                // if (item.value && namelist.indexOf(item.value) != -1) {
                //   item.error = "角色名称已存在，请更换角色名称";
                //   item.right = false;
                // } else
                if (item.value == "") {
                  item.error = "角色名称不可为空";
                  item.right = false;
                } else {
                  item.error = undefined;
                  item.right = true;
                }
              }
            }, {
              "label": "角色描述",
              "value": row.description,
              "composory": false,
              maxlength: 200,
              "data": "description",
              "type": "textarea"
            }],
            fnlist: [{
              label: TEXT.SUBMIT,
              icon: "btn btn-primary",
              disabledFn: function () {
                var every = scope.dialog.input.every(function (elem) {
                  return elem.right != false;
                });
                return !every;
              },
              fn: function () {
                var self = scope.dialog;
                var oldRole = row.$clone();
                var loop = function (elem) {
                  oldRole[elem.data] = elem.value;
                };
                oldRole.domainID = userLoginUIService.user.domainID;
                oldRole.domainPath = userLoginUIService.user.domainPath;
                for (var i in self.input) {
                  loop(self.input[i])
                }
                var modifyRole_callback = function (event) {
                  if (event.code == 0) {
                    var newUser = event.data;
                    var loop = function (elem) {
                      row[elem.data] = event.data[elem.data];
                    }
                    for (var i in self.input) {
                      loop(self.input[i])
                    }
                    growl.success("角色修改成功", {});
                  } else {

                  }
                };
                userRoleUIService.modifyRole(oldRole, modifyRole_callback);
                ngDialog.close();
              }
            }, {
              label: TEXT.CANCEL,
              icon: "btn btn-default",
              fn: function () {
                ngDialog.close();
              }
            }]
          };
          ngDialog.open({
            template: '../partials/dialogue/common_dia.html',
            className: 'ngdialog-theme-plain',
            scope: scope
          })
        };
        var addNewClick = function (event) {
          var namelist = roleList.map(function (elem) {
            return elem.roleName;
          });
          // var newRoleName = $$.duplicateName("新建角色", namelist);
          var newRoleName = "新建角色";
          scope.dialog = {
            title: {
              label: "角色信息"
            },
            input: [{
              "label": "角色名称",
              "value": newRoleName,
              "composory": true,
              "data": "roleName",
              "type": "input",
              "maxlength": 32,
              "onChange": function (item) {
                //角色已存在统一由后端提示 tyq
                /*    if (item.value && namelist.indexOf(item.value) != -1) {
                 item.error = "角色名称已存在，请更换角色名称";
                 item.right = false;
                 } else */
                if (item.value == "") {
                  item.error = "角色名称不可为空";
                  item.right = false;
                } else {
                  item.error = undefined;
                  item.right = true;
                }
              }
            }, {
              "label": "角色描述",
              "value": "角色描述",
              "composory": false,
              maxlength: 200,
              "data": "description",
              "type": "textarea"
            }],
            fnlist: [{
              label: TEXT.SUBMIT,
              icon: "btn btn-primary",
              disabledFn: function () {
                var every = scope.dialog.input.every(function (elem) {
                  return elem.right != false;
                });
                return !every;
              },
              fn: function () {
                var self = scope.dialog;
                var newRole = {};
                var loop = function (elem) {
                  newRole[elem.data] = elem.value;
                };
                newRole.domainID = userLoginUIService.user.domainID;
                newRole.domainPath = userLoginUIService.user.domainPath;
                for (var i in self.input) {
                  loop(self.input[i])
                }
                var addRole_callback = function (event) {
                  if (event.code == 0) {
                    var newUser = event.data;
                    roleList.pushbefore(newUser);
                    growl.success("创建新角色成功", {});
                  } else {

                  }
                };
                userRoleUIService.addRole(newRole, addRole_callback);
                ngDialog.close();
              }
            }, {
              label: TEXT.CANCEL,
              icon: "btn btn-default",
              fn: function () {
                ngDialog.close();
              }
            }]
          };
          ngDialog.open({
            template: '../partials/dialogue/common_dia.html',
            className: 'ngdialog-theme-plain',
            scope: scope
          })
        };
        var deleteGroupClick = function (source) {
          var fnlist = [{
            label: TEXT.SUBMIT,
            icon: 'btn btn-success',
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function () {
              ngDialog.close();
              var roleIChecked = source.filter(function (elem) {
                return elem.selected == true;
              });
              var inx = 0,
                msg = "";
              var delectRole = function (role) {
                if (role) {
                  inx++;
                  // if (!checkRole(role.roleID)) { 所有的角色都可以删除
                  var param = {
                    "roleID": role.roleID
                  };
                  userRoleUIService.deleteRole(param, function (data) {
                    if (data.code == 0) {
                      role.remove();
                      msg = "角色删除成功"
                    }
                    delectRole(roleIChecked[inx])
                  })
                  // } else {
                  //   delectRole(roleIChecked[inx])
                  // }
                } else {
                  if (msg != "") {
                    growl.success("角色删除成功", {});
                  }
                }
              };
              delectRole(roleIChecked[inx]);
            }
          }, {
            label: TEXT.CANCEL,
            icon: 'btn btn-default',
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function () {
              ngDialog.close();
            }
          }];
          scope.dialog = {
            title: {
              label: '提示'
            },
            description: {
              label: '确认要删除所选角色吗？'
            },
            fnlist: fnlist
          };
          ngDialog.open({
            template: '../partials/dialogue/common_dia_prompt.html',
            className: 'ngdialog-theme-plain',
            scope: scope
          });
        };
        var saveClick = function (row, source) {
          var namelist = roleList.filter(function (elem) {
            return row.roleName != elem.roleName;
          }).map(function (elem) {
            return elem.roleName;
          });
          var roleName = row.cached.roleName;
          if (roleName == "") {
            growl.warning("角色名不可为空", {});
          } else if (namelist.indexOf(roleName) == -1) {
            var description = row.cached.description;
            var roleID = row.roleID;
            scope.userlist.setWholeDisabled(false);
            for (var i in source) {
              source[i].disabled = false;
            }
            row.isEdit = "default";
            delete row.cached;
            var oldRole = {
              roleName: roleName,
              description: description,
              roleID: roleID
            };
            userRoleUIService.modifyRole(oldRole, function (event) {
              if (event.code == 0) {
                row.roleName = event.data.roleName;
                row.description = event.data.description;
                growl.success("修改角色成功", {});
                callback(true);
              } else {
                growl.warning("修改角色失败!", {});
              }
            });
          } else {
            growl.warning("角色名已存在，请跟换", {});
          }

        };
        var deleteClick = function (row, source) {
          var fnlist = [{
            label: TEXT.SUBMIT,
            icon: 'btn btn-success',
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function () {
              ngDialog.close();
              var delectRole = {
                "roleID": row.roleID
              }
              userRoleUIService.deleteRole(delectRole, function (data) {
                if (data.code == 0) {
                  row.remove();
                  growl.success("删除角色成功", {});
                } else {
                  //growl.warning("删除角色失败", {});
                }
              })
            }
          }, {
            label: TEXT.CANCEL,
            icon: 'btn btn-default',
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function () {
              ngDialog.close();
            }
          }];
          scope.dialog = {
            title: {
              label: '提示'
            },
            description: {
              label: '确认要删除这个角色吗？'
            },
            fnlist: fnlist
          };
          ngDialog.open({
            template: '../partials/dialogue/common_dia_prompt.html',
            className: 'ngdialog-theme-plain',
            scope: scope
          });
        };
        var queryEnterpriseRole_back = function (event) {
          if (event.code == 0) {
            /* 用户只能看到属于自己域和子域的角色 */
            var removeEmpty = function (data) {
              var rs = [];
              for (var i in data) {
                // userLoginUIService.user.domainPath.split("/").length <= 4表示企业管理员或者超级管理员
                if (userLoginUIService.user.domainPath.split("/").length <= 4 || (data[i] != null && data[i].domainPath.search(userLoginUIService.user.domainPath) > -1)) {
                  rs.push(data[i]);
                }
              }
              return rs;
            };
            if (event.data != null) {
              if (event.data.length > 0) {
                var roleArr = [];
                for (var n in event.data) {
                  if (event.data[n] && event.data[n].roleID != 101 && event.data[n].roleID != 103) { //暂时没有企业B角色
                    roleArr.push(event.data[n]);
                  }
                }
                roleList = removeEmpty(roleArr);

                var roleHeader = [];
                var roleOption = [];
                if (scope.menuitems['D02_A02_S17']) {
                  roleHeader.push({
                    icon: "fa fa-plus",
                    'class': "btn btn-primary btn-sm",
                    label: "添加角色",
                    style: {
                      margin: "2px"
                    },
                    type: "button",
                    events: {
                      click: addNewClick
                    }
                  });
                }
                if (scope.menuitems['D04_A02_S17']) {
                  roleHeader.push({
                    icon: "glyphicon glyphicon-minus",
                    'class': "btn btn-default btn-sm",
                    label: "删除角色",
                    style: {
                      margin: "2px"
                    },
                    type: "button",
                    disabled: function (event) {
                      var checked = event.filter(function (elem) {
                        return elem.selected == true;
                      });
                      if (checked.length == 0) {
                        return true;
                      } else {
                        for (var i in checked) {
                          if (checked[i].roleID == 100) {
                            return true;
                          }
                        }
                      }
                    },
                    events: {
                      click: deleteGroupClick
                    }
                  });
                }
                if (scope.menuitems['D03_A02_S17']) {
                  roleOption.push({
                    label: "编辑",
                    type: "button",
                    'class': "btn btn-primary",
                    disabled: function (row) {
                      if (userLoginUIService.user.userID == 1) {
                        return false;
                      } else {
                        return checkRole(row.roleID);
                      }
                    },
                    events: {
                      click: editClick
                    }
                  });
                }
                if (scope.menuitems['D04_A02_S17']) {
                  roleOption.push({
                    label: "删除",
                    type: "button",
                    'class': "btn btn-default",
                    disabled: function (row) {
                      if (userLoginUIService.user.userID == 1) {
                        return false;
                      } else {
                        if (row.roleID == 100) {
                          return true;
                        }
                      }
                      //else {
                      // return checkRole(row.roleID);
                      //}
                    },
                    events: {
                      click: deleteClick
                    }
                  });
                }
                if (scope.menuitems['D05_A02_S17']) {
                  roleOption.push({
                    label: "权限设置",
                    type: "button",
                    'class': "btn btn-default",
                    visible: function (row) {
                      if (userLoginUIService.user.userID == 1) {
                        return true;
                      } else {
                        var ck = checkRole(row.roleID);
                        return !ck;
                      }
                    },
                    events: {
                      click: permissionAssignment
                    }
                  });
                }
                if (scope.menuitems['D06_A02_S17']) {
                  roleOption.push({
                    label: "用户分配",
                    type: "button",
                    'class': "btn btn-default",
                    events: {
                      click: associateRole2User
                    }
                  });
                }
                scope.userlist = {
                  source: roleList,
                  rowclass: function (elem) {
                    return rootScope.currentRole == elem.roleID ? "current" : "";
                  },
                  header: roleHeader,
                  columnDefs: [{
                    label: "角色名称",
                    type: "text",
                    filterable: true,
                    data: "roleName",
                    width: "30%",
                    modes: {
                      'default': {
                        type: "text",
                      },
                      edit: {
                        type: "input",
                      }
                    },
                    format: function (value, row) {
                      if (userLoginUIService.user.userID == 1) {
                        if (row.roleID == 100 || row.roleID == 102) {
                          return value + "A";
                        } else if (row.roleID == 101 || row.roleID == 103) {
                          return value + "B";
                        } else {
                          return value;
                        }
                      } else {
                        return value;
                      }
                    }
                  }, {
                    label: "角色描述",
                    type: "text",
                    filterable: true,
                    data: "description",
                    modes: {
                      'default': {
                        type: "text",
                      },
                      edit: {
                        type: "input",
                      }
                    }
                  }, {
                    label: "操作",
                    type: "buttonGroup",
                    filterable: false,
                    sortable: false,
                    width: "161px",
                    modes: {
                      'default': {
                        options: roleOption
                      },
                      edit: {
                        options: [{
                          label: "保存",
                          type: "button",
                          'class': "btn btn-primary",
                          events: {
                            click: saveClick
                          }
                        }, {
                          label: "取消",
                          type: "button",
                          'class': "btn btn-default",
                          events: {
                            click: cancelClick
                          }
                        }]
                      }
                    }
                  }]
                };
              } else {
                growl.error("角色列表为空，请刷新页面重试")
              }
            } else {
              growl.error("角色列表为空，请刷新页面重试")
            }
          }
        };
        var queryEnterpriseUser_back = function (event) {
          if (event.code == 0) {
            if (event.data != null) {
              if (event.data.length > 0) {
                if (!scope.menuitems['A99_S17']) { //如果不存在跨域用户权限，不显示上一级别的用户
                  enterpriseUsers = event.data.filter(function (item) {
                    if (item.domainPath.search(userLoginUIService.user.domainPath) > -1) {
                      return true;
                    }
                    return false;
                  });
                } else {
                  enterpriseUsers = event.data;
                }
                userEnterpriseService.queryEnterpriseRole(queryEnterpriseRole_back);
              } else {
                growl.error("用户列表为空，请刷新页面重试")
              }
            } else {
              growl.error("用户列表为空，请刷新页面重试")
            }
          }
        };
        userUIService.queryUserByCondition({}, queryEnterpriseUser_back);
      };

      var init = function () {
        if (scope.panel == 'user') {
          renderUserList();
        } else {
          renderRoleList();
        }
      }

      /*
       * 监听登录状态
       */
      if (!userLoginUIService.user.isAuthenticated) {
        scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ])
})