define(['controllers/controllers', 'keyboardJS', 'rappid-joint', 'bootstrap-dialog'], function (controllers, keyboardJS, joint, BootstrapDialog) {
  'use strict';
  /**
   * 流程图编辑控制器
   */
  controllers.controller('flowProcessCtrl', ['$scope', 'ticketLogService', 'ticketTaskService', 'workflowService', 'workflowDefinitionService', 'Info', '$routeParams', '$compile', '$rootScope', 'userEnterpriseService', 'viewFlexService', 'resourceUIService', 'kpiDataService', 'SwSocket', 'growl', '$timeout', '$location',
    function ($scope, ticketLogService, ticketTaskService, workflowService, workflowDefinitionService, Info, $routeParams, $compile, $rootScope, userEnterpriseService, viewFlexService, resourceUIService, kpiDataService, SwSocket, growl, timeout, loc) {
      var paper, graph, paperScroller, stencil, selection, inspector, selectionView, clipboard, commandManager, navigator;
      var viewId = $routeParams.viewId;
      $scope.selectedView = '';
      var displayMode = true;
      var shiftHold = false;
      var backspaceHold = false;
      $scope.userGroupList = '';
      $scope.userList = '';
      $scope.userAryList = '';
      var displayModeLink = {
        'arrowheadMarkup': '<g></g>',
        'toolMarkup': '<g></g>',
        'vertexMarkup': '<g></g>'
      };
      $scope.selectedItem = {
        cell: null,
        userIds: 0,
        userGroupIds: 0,
        userType: ""
      };
      keyboardJS.bind('shift', function (e) {
        shiftHold = true;
      }, function (e) {
        shiftHold = false;
      });
      keyboardJS.bind('shift', null, function (e) {
        shiftHold = false;
      });
      keyboardJS.bind('backspace', function (e) {
        backspaceHold = true;
      }, function (e) {
        backspaceHold = false;
      });
      keyboardJS.bind('backspace', null, function (e) {
        backspaceHold = false;
      });
      $scope.evenType = "start";
      /**
       * 获取用户
       */
      function getUser() {
        userEnterpriseService.queryEnterpriseUser(function (returnObj) {
          if (returnObj.code == 0) {
            if (returnObj.data.length != 0) {
              var list = {};
              var ary = [];
              for (var i in returnObj.data) {
                list = {};
                list["id"] = returnObj.data[i].userID;
                list["name"] = returnObj.data[i].userName;
                ary.push(list);
              }
              $scope.userAryList = ary;
            } else {
              $scope.userAryList = [];
            }
          }
        })
      }
      $scope.historyGo = function () {
        var state = $routeParams.state;
        if ($scope.workType == 'task') {
          location.href = "index.html#/workOrderRecord/"+state;
        } else if ($scope.workType == 'alert') {
          location.href = "index.html#/configAlert";
        } else if ($scope.workType == 'manage') {
          location.href = "index.html#/workOrder/" + state;
        } else if ($scope.workType == 'message') {
          location.href = "../app-uc/index.html#/message";
        } else if ($scope.workType == 'read') {
          location.href = "../app-uc/index.html#/read";
        } else if ($scope.workType == 'unread') {
          location.href = "../app-uc/index.html#/unread";
        }
      }
      /**
       * 获取用户组
       */
      function getUserGroup() {
        userEnterpriseService.queryEnterpriseGroup(function (returnObj) {
          if (returnObj.code == 0) {
            if (returnObj.data.length != 0) {
              var list = {};
              var ary = [];
              for (var i in returnObj.data) {
                list["id"] = returnObj.data[i].groupID;
                list["name"] = returnObj.data[i].groupName;
                ary.push(list);
              }
              $scope.userGroupList = ary;
            } else {
              $scope.userGroupList = [];
            }
          }
        })
      }

      $scope.viewShow = function(scope,data,content,ticketNo){
        ticketTaskService.getTicket(ticketNo, function (order){
          if(order.code == 0){

            var treat = {"fill":"#ff8040"}//正在执行的工单任务颜色
            var finish = {"fill":"#13c865"}//执行完成的工单任务颜色
            var untreated = {"fill":"#ffff00"}//未处理的工单任务颜色
            var notExecute = {"fill":"#cccccc"}//不会执行的工单任务颜色
            for(var i = content.cells.length - 1; i > -1; i--) {
              if(content.cells[i].type == "bpmn.Flow") {
                jQuery.extend(content.cells[i], displayModeLink);
                content.cells[i].attrs['.connection-wrap'] = {
                  display: 'none'
                };
              }
              if(content.cells[i].eventType == "end"){
                if (order.data.status == 200) {
                  content.cells[i].attrs['.body'] =  finish;
                }
              }
              for(var j in data){
                if(data[j].logType == 'userTask'){
                  if(content.cells[i].id == data[j].workflowNodeId){
                    content.cells[i]['desc'] =  data[j].desc;
                    if( data[j].ticketTask.taskStatus == 100){
                      content.cells[i].attrs['.body'] =  treat;
                      break;
                    }else if(data[j].ticketTask.taskStatus == 200){
                      content.cells[i].attrs['.body'] =  finish;
                      break;
                    }else if(data[j].ticketTask.taskStatus == 10){
                      content.cells[i].attrs['.body'] =  untreated;
                      break;
                    }
                  }
                }else if(data[j].logType == 'startEvent'){
                  if(content.cells[i].id == data[j].workflowNodeId) {
                    content.cells[i].attrs['.body'] = finish;
                    break;
                  }
                }else if(data[j].logType == 'exclusiveGateway'){
                  if(content.cells[i].id == data[j].workflowNodeId) {
                    content.cells[i].attrs['.body'] = finish;
                    break;
                  }
                }else if(data[j].logType == 'serviceTask'){
                  if(content.cells[i].id == data[j].workflowNodeId) {
                    content.cells[i].attrs['.body'] = finish;
                    break;
                  }
                }else if(data[j].logType == 'notExecute'){
                  if(content.cells[i].id == data[j].workflowNodeId) {
                    content.cells[i].attrs['.body'] = notExecute;
                    break;
                  }
                }
              }
            }
            scope.components.graph.fromJSON(content);
            scope.components.paper.options.gridSize = content.gridSize;
            scope.components.paper.options.width = content.width;
            scope.components.paper.options.height = content.height;
            scope.data.bgimage = content.bgimage;
            scope.data.bgcolor = content.bgcolor;
            scope.data.width = content.width;
            scope.data.height = content.height;
            scope.components.commander.setDimensions();
            scope.components.commander.setGrid();
          }

        });
      }
      var showViewContent = function (scope, viewId) {
        //根据任务id查任务详情
        ticketTaskService.getTicketTaskById(viewId, function (returnObj1) {
          if (returnObj1.code == 0) {
            scope.selectedTask = returnObj1.data;
            //通过流程id查流程任务详情
            workflowService.getWorkflowById(returnObj1.data.processDefinitionId, function (returnObj) {
              if (returnObj.code == 0) {
                scope.selectedView = returnObj.data;
                scope.data.viewContent = $scope.selectedView.viewContent;
                if (returnObj.data.viewContent) {
                  var content = JSON.parse(returnObj.data.viewContent);
                  var len = returnObj.data.handerConfs.length;
                  ticketLogService.getHistoricActivityInstance(returnObj1.data.ticketNo,function(res){
                    if(res.code == 0 && res.data != "" && res.data != null ){
                      var notExecute = res.data.notExecute;//不会执行的节点（背景为灰色）
                      var executed = res.data.executed;//已经执行过的节点（背景为绿色）

                      if(notExecute && notExecute.length > 0){
                        for(var i in notExecute){
                          var arr = {"id": 0,
                          "ticketNo": "",
                          "message": "",
                          "executeTime": "",
                          "logType": "notExecute",
                          "ticketTask": "",
                          "workflowNodeId": ""
                        }
                          arr.workflowNodeId = notExecute[i];
                          executed.push(arr);
                        }
                      }
                      //console.log("executed=="+JSON.stringify(executed));
                      $scope.viewShow(scope,executed,content,returnObj1.data.ticketNo);
                    }
                  });
                }
              }
            })
          }
        })
      };
      $scope.initialization = [
        function initializePaper(scope, element) {
          var interactive = false;
          if (!displayMode) {
            interactive = true;
          }
          graph = new joint.dia.Graph({
            type: 'bpmn'
          });
          paper = new joint.dia.Paper({
            width: 1200,
            height: 700,
            gridSize: 10,
            perpendicularLinks: true,
            model: graph,
            markAvailable: true,
            interactive: interactive,
            defaultLink: new joint.shapes.bpmn.Flow,
            validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {

              // don't allow loop links
              if (cellViewS == cellViewT) return false;
              var view = (end === 'target' ? cellViewT : cellViewS);
              // don't allow link to link connection
              if (view instanceof joint.dia.LinkView) return false;
              return true;
            },
            embeddingMode: true,
            frontParentOnly: false,
            validateEmbedding: function (childView, parentView) {
              var Pool = joint.shapes.bpmn.Pool;
              return (parentView.model instanceof Pool) && !(childView.model instanceof Pool);
            }
          });
          paperScroller = new joint.ui.PaperScroller({
            paper: paper,
            autoResizePaper: true,
            padding: 0
          });
          $('#paper-container1', element).append(paperScroller.el);
          scope.components.paper = paper;
          scope.components.scroller = paperScroller;
          scope.components.graph = graph;
        },
        // 创建模板
        function initializeStencil(scope, element) {
          function layout(graph) {
            joint.layout.GridLayout.layout(graph, {
              columnWidth: stencil.options.width / 2 - 10,
              columns: 2,
              rowHeight: 80,
              resizeToFit: true,
              dy: 10,
              dx: 10
            });
          }

          stencil = new joint.ui.Stencil({
            graph: graph,
            paper: paper,
            width: 230,
            dropAnimation: true,
            groups: scope.data.stencil.groups,
            search: scope.data.stencil.search
          }).on('filter', layout);
          $('.stencil-container', element).append(stencil.render().el);
          _.each(scope.data.stencil.shapes, function (shapes, groupName) {
            stencil.load(shapes, groupName);
            layout(stencil.getGraph(groupName));
            stencil.getPaper(groupName).fitToContent(1, 1, 10);
          });
          scope.components.stencil = stencil;
        },
        // 创建选择
        function initializeSelection(scope, element) {
          selection = new Backbone.Collection;
          selectionView = new joint.ui.SelectionView({
            paper: paper,
            graph: graph,
            model: selection
          });
          // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
          // 当shift键被按下时，启动用户在页面的空白区域时开始选择。
          // Otherwise, initiate paper pan.
          // 否则，页面默认功能
          paper.on('blank:pointerdown', function (evt, x, y) {
            //          if(_.contains(keyboardJS.getContext(), 'shift')) {
            if (shiftHold) {
              selectionView.startSelecting(evt, x, y);
            } else {
              selectionView.cancelSelection();
              paperScroller.startPanning(evt, x, y);
            }
          });
          paper.on('cell:pointerdown', function (cellView, evt) {
            // Select an element if CTRL/Meta key is pressed while the element is clicked.
            // 如果Ctrl /Meta 键是被按下，当元素被点击时，添加到selectionBox中
            if ((evt.ctrlKey || evt.metaKey) && !(cellView.model instanceof joint.dia.Link)) {
              selectionView.createSelectionBox(cellView);
              selection.add(cellView.model);
            }
          });
          selectionView.on('selection-box:pointerdown', function (evt) {
            // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
            // 取消之前的效果
            if (evt.ctrlKey || evt.metaKey) {
              var cell = selection.get($(evt.target).data('model'));
              selectionView.destroySelectionBox(paper.findViewByModel(cell));
              selection.reset(selection.without(cell));
            }
          });
          // Disable context menu inside the paper.
          // 取消HTML默认页面菜单
          // This prevents from context menu being shown when selecting individual elements with Ctrl in OS X.
          paper.el.oncontextmenu = function (evt) {
            evt.preventDefault();
          };
          keyboardJS.on('delete, backspace', function (evt) {
            if (!$.contains(evt.target, paper.el)) {
              // remove selected elements from the paper only if the target is the paper
              return;
            }
            commandManager.initBatchCommand();
            selection.invoke('remove');
            commandManager.storeBatchCommand();
            selectionView.cancelSelection();
            if (backspaceHold && !$(evt.target).is("input, textarea")) {
              // Prevent Backspace from navigating back.
              evt.preventDefault();
            }
          });
        },
        // 元素控制器，自由转换和属性
        function initializeHaloAndInspector(scope, element) {
          var inspector;
          var $inspectorHolder = $('.inspector-container', element);
          function createInspector(cellView) {
            scope.components.cellView = cellView;
            // No need to re-render inspector if the cellView didn't change.
            //if (!inspector || inspector.options.cellView !== cellView) {

              if (inspector) {
                // Set unsaved changes to the model and clean up the old inspector if there was one.
                inspector.updateCell();
                inspector.remove();
              }
              var sub = scope.selectedTask.taskDefinitionId.split('id');
              var em = scope.data.flowOrder;
              if(cellView.model.id == sub[1] && scope.selectedTask.taskStatus != 200){
                inspector = new joint.ui.Inspector({
                  inputs: $scope.inputsList,
                  cellView: cellView
                });
              }else{
                var flowStatus = "";
                for(var k in scope.data.flowOrder ){
                  var taskDefinitionId = scope.data.flowOrder[k].taskDefinitionId.split('id');
                  if(cellView.model.id == taskDefinitionId[1]){
                    flowStatus=1;
                    break;
                  }
                }
                if(flowStatus == 1){
                  inspector = new joint.ui.Inspector({
                    inputs: {
                      desc: {
                        type: 'textarea', group: '属性', label: '处理记录', index: 1,
                        attrs: {
                          textarea: {
                            class: 'form-control input-sm',
                            'ng-model': 'selectedTask.desc',
                            disabled:"disabled",
                            style:'height: 100px;'
                          }
                        },
                      }
                    },
                    cellView: cellView
                  });
                }else{
                  inspector = new joint.ui.Inspector({
                    cellView: cellView
                  });
                }

              }

              $('.inspector-container').html(inspector.render().el);
            //}
          }
          paper.on('cell:pointerup', function (cellView) {
            createInspector(cellView);
          });
          paper.on('link:options', function (evt, cellView, x, y) {
            openCellTools(cellView);
          });
        },
        function initializeCommandManager(scope, element) {
          commandManager = new joint.dia.CommandManager({
            graph: graph
          });
          keyboardJS.on('ctrl + z', function () {
            commandManager.undo();
            selectionView.cancelSelection();
          });
          keyboardJS.on('ctrl + y', function () {
            commandManager.redo();
            selectionView.cancelSelection();
          });
          scope.components.commander = commandManager;
          scope.components.commander.setDimensions = function () {
            paper.setDimensions(paper.options.width, paper.options.height);
            paperScroller.options.baseWidth = paper.options.width;
            paperScroller.options.baseHeight = paper.options.height;
            paperScroller.$el.css('padding-top', 0);
          };
          scope.components.commander.setGrid = function () {
            var gridSize = paper.options.gridSize;
            var backgroundImage = getGridBackgroundImage(gridSize);
            if (scope.data.bgcolor) {
              paper.$el.css('background-color', scope.data.bgcolor);
            } else {
              paper.$el.css('background-color', "#fff");
            }
            if (scope.data.bgimage) {
              if (!displayMode) {
                paper.$el.css('background-image', 'url("' + backgroundImage + '"),url("' + scope.data.bgimage + '")');
              } else {
                paper.$el.css('background-image', 'url(""),url("' + scope.data.bgimage + '")');
                paper.$el.css('margin-right', 0);
              }
            } else {
              if (!displayMode) {
                paper.$el.css('background-image', 'url("' + backgroundImage + '")');
              } else {
                paper.$el.css('background-image', 'url(""),url("")');
                paper.$el.css('margin-right', 0);
              }
            }
          };
          var getGridBackgroundImage = function (gridSize, color) {
            var canvas = $('<canvas/>', {
              width: gridSize,
              height: gridSize
            });
            canvas[0].width = gridSize;
            canvas[0].height = gridSize;
            var context = canvas[0].getContext('2d');
            context.beginPath();
            context.rect(1, 1, 1, 1);
            context.fillStyle = color || '#AAAAAA';
            context.fill();
            return canvas[0].toDataURL('image/png');
          };
          scope.components.commander.save = function (status) {
            scope.selectedTask.taskStatus = status;
            scope.selectedTask.desc = $("textarea").val() ;
            ticketTaskService.doTask(scope.selectedTask, function (returnObj) {
              if (returnObj.code == 0) {
                if (status == 100) {
                  var inspector = new joint.ui.Inspector({
                    inputs: {
                      attrs: {
                        '.body': {
                          fill: 'red'
                        }
                      }
                    },
                    cellView: scope.components.cellView
                  });
                  $('.inspector-container').html(inspector.render().el);
                  growl.success("任务已确认", {});
                } else if (status == 200) {
                  growl.success("任务已完成", {});
                  location.href = "../app-oc/index.html#/workorderrecord";
                }
              } else {
                growl.success("任务操作失败", {});
              }
            });
            // }
          }
          scope.components.commander.save4Json = function () {
            var viewjson = graph.toJSON();
            viewjson.gridSize = paper.options.gridSize;
            viewjson.width = paper.options.width;
            viewjson.height = paper.options.height;
            viewjson.bgimage = scope.data.bgimage;
            viewjson.bgcolor = scope.data.bgcolor;
            var JSONstring = JSON.stringify(viewjson);
            try {
              var param = {
                id: scope.selectedView.id,
                domainPath: "",
                name: scope.selectedView.name,
                desc: scope.selectedView.desc,
                viewContent: JSONstring,
                createTime: scope.selectedView.createTime,
                updateTime: scope.selectedView.updateTime
              }
              if (param.viewId == 0) {
                workflowDefinitionService.saveWorkflowDefinition(param, function (returnObj) {
                  if (returnObj.code == 0) {
                    growl.success("保存成功")
                  }
                });
              } else {
                workflowDefinitionService.saveWorkflowDefinition(param, function (returnObj) {
                  if (returnObj.code == 0) {
                    growl.success("保存成功")
                  }
                });
              }
            } catch (err) {
              alert(err);
            }
          };
          scope.components.commander.toJSON = function () {
            var windowFeatures = 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no';
            var windowName = _.uniqueId('json_output');
            var jsonWindow = window.open('', windowName, windowFeatures);
            jsonWindow.document.write(JSON.stringify(graph.toJSON()));
          };
          scope.components.commander.loadJSON = function() {
            BootstrapDialog.show({
              title: '导入组态内容',
              message: $('<textarea id="json4configer" class="form-control" placeholder="输入JSON"></textarea>'),
              buttons: [{
                label: '确认',
                cssClass: 'btn-primary',
                hotkey: 13, // Enter.
                action: function(dialogRef) {
                  dialogRef.close();
                  var inputcontent = document.getElementById('json4configer');
                  if(inputcontent.value) {
                    var json = JSON.parse(inputcontent.value);
                    graph.fromJSON(json);
                  }
                }
              }]
            });
          };
          scope.components.commander.toFront = function () {
            selection.invoke('toFront');
          };
          scope.components.commander.toBack = function () {
            selection.invoke('toBack');
          };
          scope.components.commander.embed = function () {
            var parentCell;
            selectionView.model.models.forEach(function (cell) {
              if (!parentCell) {
                parentCell = cell;
              } else {
                if (parentCell.attributes.z > cell.attributes.z) {
                  parentCell = cell;
                }
              }
            });
            selectionView.model.models.forEach(function (cell) {
              if (parentCell.id != cell.id) {
                parentCell.embed(cell);
              }
            });
          };
          scope.components.commander.unembed = function () {
            selectionView.model.models.forEach(function (cell) {
              if (cell.attributes.embeds) {
                cell.attributes.embeds.forEach(function (cellid) {
                  cell.unembed(graph.getCell(cellid));
                });
              }
            });
          };
        },

        function initView(scope, element) {
          getUserGroup();
          getUser();
          showViewContent(scope, viewId);
          //$scope.evenTypeChange();
        }
      ];
    }
  ]);
});