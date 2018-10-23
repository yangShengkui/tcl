define(['controllers/controllers', 'keyboardJS', 'rappid-joint', 'bootstrap-dialog'], function (controllers, keyboardJS, joint, BootstrapDialog) {
  'use strict';
  /**
   * 流程图控制器
   */
  controllers.controller('flowCtrl', ['$scope', 'workflowService', 'workflowDefinitionService', 'Info', '$routeParams', '$compile', '$rootScope', 'userEnterpriseService', 'viewFlexService', 'resourceUIService', 'kpiDataService', 'SwSocket', 'growl', '$timeout', '$location',
    function ($scope, workflowService, workflowDefinitionService, Info, $routeParams, $compile, $rootScope, userEnterpriseService, viewFlexService, resourceUIService, kpiDataService, SwSocket, growl, timeout, loc) {
      var paper, graph, paperScroller, stencil, selection, inspector, selectionView, clipboard, commandManager,
        navigator;
      var viewId = $routeParams.viewId;
      $scope.selectedView = {};
      var displayMode = false;
      var shiftHold = false;
      var backspaceHold = false;
      var historyView = false;
      $scope.userGroupList = '';
      $scope.userList = '';
      $scope.userAryList = '';
      $scope.userRoleList = '';
      $scope.allTasks = [];
      if (location.hash.search("#/displayView") > -1) {
        displayMode = true;
      }
      if (location.hash.search("#/historyView") > -1) {
        historyView = true;
      }
      var displayModeLink = {
        'arrowheadMarkup': '<g></g>',
        'toolMarkup': '<g></g>',
        'vertexMarkup': '<g></g>'
      };
      $scope.selectedItem = {
        cell: null,
        userIds: 0,
        userGroupIds: 0,
        roleIds: 0,
        taskType: "user",
        taskTypeParam: "user",
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
      function getUser () {
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
      };
      $scope.userTypeHandler = function () {
        $scope.selectedItem.cell.attributes["userType"] = "string:" + $scope.selectedItem.userType;
        $scope.selectedItem.cell.attributes["roleIds"] = 0;
        $scope.selectedItem.cell.attributes["userIds"] = 0;
      };
      $scope.roleIdsHandler = function () {
        $scope.selectedItem.cell.attributes["roleIds"] = "number:" + $scope.selectedItem.roleIds;
      };
      $scope.userIdsHandler = function () {
        $scope.selectedItem.cell.attributes["userIds"] = "number:" + $scope.selectedItem.userIds;
      };
      $scope.homeClick = function (flg) {
        if (flg == 1) {
          location.href = "../app-oc/index.html#/processdesign";
        } else {
          if ($rootScope.dirty == true) {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              message: '视图尚未保存，要在退出前保存吗？',
              buttons: [{
                label: '保存退出',
                cssClass: 'btn-success',
                action: function (dialogRef) {
                  $scope.components.commander.save4Json(function (status) {
                    dialogRef.close();
                    location.href = "../app-oc/index.html#/processdesign";
                  });
                }
              }, {
                label: '退出',
                action: function (dialogRef) {
                  location.href = "../app-oc/index.html#/processdesign";
                }
              }, {
                label: '取消',
                action: function (dialogRef) {
                  dialogRef.close();
                }
              }]
            });
          } else {
            location.href = "../app-oc/index.html#/processdesign";
          }
          ;
        }
      };
      $scope.userTypeList = [];
      $scope.taskTypeList = [];

      /**
       * 获取角色
       */
      function getRole () {
        $scope.userTypeList = [{"value": "user", "content": "用户"}, {
          "value": "role",
          "content": "角色"
        }, {"value": "expression", "content": "表达式"}];

        $scope.taskTypeList = [{"value": "user", "content": "用户任务"}, {"value": "service", "content": "服务任务"}];

        userEnterpriseService.queryEnterpriseRole(function (returnObj) {
          if (returnObj.code == 0) {
            if (returnObj.data.length != 0) {
              var list = {};
              var ary = [];
              for (var i in returnObj.data) {
                if (returnObj.data[i]) {
                  list = {};
                  list["id"] = returnObj.data[i].roleID;
                  list["name"] = returnObj.data[i].roleName;
                  ary.push(list);
                }
              }
              $scope.userRoleList = ary;
            } else {
              $scope.userRoleList = [];
            }
          }
        })
      };

      /**
       * 获取用户组
       */
      function getUserGroup () {
        userEnterpriseService.queryEnterpriseGroup(function (returnObj) {
          if (returnObj.code == 0) {
            if (returnObj.data.length != 0) {
              var ary = [];
              for (var i in returnObj.data) {
                var list = {};
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
      };

      var showViewContent = function (scope, viewId) {
        if (historyView) {
          workflowService.getWorkflowById(viewId, function (returnObj) {
            if (returnObj.code == 0) {
              scope.selectedView = returnObj.data;
              scope.data.viewContent = $scope.selectedView.viewContent;
              scope.selectedView["inspector"] = false;
              if (returnObj.data.viewContent) {
                var content = JSON.parse(returnObj.data.viewContent);
                if (displayMode) {
                  for (var i = content.cells.length - 1; i > -1; i--) {
                    if (content.cells[i].type == "bpmn.Flow") {
                      jQuery.extend(content.cells[i], displayModeLink);
                      content.cells[i].attrs['.connection-wrap'] = {
                        display: 'none'
                      };
                    }
                  }
                }
                scope.components.graph.fromJSON(content);
                scope.components.paper.options.gridSize = content.gridSize;
                scope.components.paper.options.width = content.width;
                scope.components.paper.options.height = content.height;
                scope.data.bgimage = content.bgimage;
                scope.data.bgcolor = content.bgcolor;
                scope.data.mouldType = "";
                scope.data.width = content.width;
                scope.data.height = content.height;
                scope.components.commander.setDimensions();
                scope.components.commander.setGrid();
              } else {
                scope.components.graph.fromJSON(scope.data.init);
              }
            }
          })
        } else {
          workflowDefinitionService.getWorkflowDefinitionById(viewId, function (returnObj) {
            if (returnObj.code == 0) {
              scope.selectedView = returnObj.data;
              scope.data.viewContent = $scope.selectedView.viewContent;
              scope.selectedView["inspector"] = false;
              if (returnObj.data.viewContent) {
                var content = JSON.parse(returnObj.data.viewContent);
                if (displayMode) {
                  for (var i = content.cells.length - 1; i > -1; i--) {
                    if (content.cells[i].type == "bpmn.Flow") {
                      jQuery.extend(content.cells[i], displayModeLink);
                      content.cells[i].attrs['.connection-wrap'] = {
                        display: 'none'
                      };
                    }
                  }
                }
                scope.components.graph.fromJSON(content);
                scope.components.paper.options.gridSize = content.gridSize;
                scope.components.paper.options.width = content.width;
                scope.components.paper.options.height = content.height;
                scope.data.bgimage = content.bgimage;
                scope.data.bgcolor = content.bgcolor;
                scope.data.mouldType = "";
                scope.data.width = content.width;
                scope.data.height = content.height;
                scope.components.commander.setDimensions();
                scope.components.commander.setGrid();
              } else {
                scope.components.graph.fromJSON(scope.data.init);
              }
              $scope.allTasks = scope.components.graph.getCells().filter(function (c) {
                return c.get('type') === 'bpmn.Activity';
              });
              scope.components.graph.on('add', function (cell) {
                $scope.allTasks = scope.components.graph.getCells().filter(function (c) {
                  return c.get('type') === 'bpmn.Activity';
                });
                $scope.$apply();
              });
            }
          })
        }
      };

      /**
       * 右边栏控制
       * @param {Object} status
       */
      var inspectorStatus = function (status) {
        $scope.selectedView.inspector = false;
        $scope.$applyAsync();
        $.AdminLTE.controlSidebar.openOrClose(status)
      }

      $scope.viewConfigClick = function () {
        $scope.selectedView.inspector = true;
        $scope.$applyAsync();
      }
      $scope.initialization = [
        function initializePaper (scope, element) {
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

          paperScroller.$el.css('background-color', "hsl(0, 0%, 100%)");
          $('#paper-container1', element).append(paperScroller.el);
          scope.components.paper = paper;
          scope.components.scroller = paperScroller;
          scope.components.graph = graph;
        },
        // 创建模板
        function initializeStencil (scope, element) {
          function layout (graph) {
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
        function initializeSelection (scope, element) {
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
              // scope.selectedView.inspector = true;
              // scope.$apply();
              inspectorStatus(true);
            } else {
              selectionView.cancelSelection();
              paperScroller.startPanning(evt, x, y);
              // scope.selectedView.inspector = false;
              // scope.$apply();
              inspectorStatus(false);
            }
          });
//        paper.on('element:pointerup', function(elementView, evt) {
//          var pool = elementView.model;
//          if (pool.get('type') === 'bpmn.Activity') {
//            var lanePath = $(evt.target).closest('.lane').data('lane-path') || 'lanes';
//            console.log(pool.prop(lanePath + '/label')); // log the lane label
//          }
//        });
          paper.on('element:pointerdown', function (cellView, evt) {
            // Select an element if CTRL/Meta key is pressed while the element is clicked.
            // 如果Ctrl /Meta 键是被按下，当元素被点击时，添加到selectionBox中
            if ((evt.ctrlKey || evt.metaKey) && !(cellView.model instanceof joint.dia.Link)) {
              selectionView.createSelectionBox(cellView);
              selection.add(cellView.model);
            }
            inspectorStatus(true);
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
        function initializeHaloAndInspector (scope, element) {
          // var $inspectorHolder = $('#control-sidebar-settings-data', element);
          // var $inspectorHolder_text = $('#control-sidebar-settings-text', element);
          // var $inspectorHolder_presentation = $('#control-sidebar-settings-presentation', element);
          // var $inspectorHolder_geometry = $('#control-sidebar-settings-geometry', element);
          var $inspectorHolder = $('.inspector-container', element);

          function openCellTools (cellView) {
            var cell = cellView.model || cellView;
            var halo;
            if (displayMode) {
              halo = new joint.ui.Halo({
                cellView: cellView
              }).render();
              halo.removeHandles();
            } else {
              halo = new joint.ui.Halo({
                cellView: cellView
              }).render();
            }
            if ($scope.selectedItem.cell && $scope.selectedItem.cell.id == cell.id) return;
            var selectedItem = {
              cell: null,
              userIds: 0,
              userGroupIds: 0,
              roleIds: 0,
              taskType: "user",
              taskTypeParam: "user",
              userType: ""
            };
            selectedItem.cell = cell;
            //获得设备选择方式
            if (cell.get('userType')) {
              var userTypeAry = cell.get('userType').toString().split(":");
              if (userTypeAry.length > 0 && userTypeAry[userTypeAry.length - 1] != '?')
                selectedItem.userType = String(userTypeAry[userTypeAry.length - 1]);
            }
            if (cell.get('userIds')) {
              var userIdsAry = cell.get('userIds').toString().split(":");
              if (userIdsAry.length > 0 && userIdsAry[userIdsAry.length - 1] != '?')
                selectedItem.userIds = Number(userIdsAry[userIdsAry.length - 1]);
            }
            if (cell.get('userGroupIds')) {
              var userGroupIdsAry = cell.get('userGroupIds').toString().split(":");
              if (userGroupIdsAry.length > 0 && userGroupIdsAry[userGroupIdsAry.length - 1] != '?')
                selectedItem.userGroupIds = Number(userGroupIdsAry[userGroupIdsAry.length - 1]);
            }
            if (cell.get('roleIds')) {
              var roleIdsAry = cell.get('roleIds').toString().split(":");
              if (roleIdsAry.length > 0 && roleIdsAry[roleIdsAry.length - 1] != '?')
                selectedItem.roleIds = Number(roleIdsAry[roleIdsAry.length - 1]);
            }
            if (cell.get('content')) {
              //            var contentAry = cell.get('content').toString().split(":");
              //            if (contentAry.length > 0 && contentAry[contentAry.length - 1] != '?')
              //              selectedItem.content = String(contentAry[contentAry.length - 1]);
              selectedItem.content = cell.get('content');
            }
            if (cell.get('taskType')) {
              var contentAry = cell.get('taskType').toString().split(":");
              if (contentAry.length > 0 && contentAry[contentAry.length - 1] != '?')
                selectedItem.taskType = String(contentAry[contentAry.length - 1]);
            }
            if (cell.get('type') == "bpmn.Activity" && cell.get('icon') == "service") {
              selectedItem.taskType = "service";
            } else {
              selectedItem.taskType = "user";
            }
            /*if (cell.get('type') == 'bpmn.Conversation') {
              cell.attachedTo = 'string:' + cell.attachedTo;
            }*/

            $scope.selectedItem = jQuery.extend(true, {}, selectedItem);
            // No need to re-render inspector if the cellView didn't change.
            if (!inspector || inspector.options.cell !== cell) {
              if (inspector) {
                if (inspector.getModel().collection) {
                  // update cell if the model is still in the graph
                  inspector.updateCell();
                }
                // Clean up the old inspector if there was one.
                inspector.remove();
              }
              var inspectorDefs = scope.inspectorDefs[cell.get('type')];
              inspector = new joint.ui.Inspector({
                inputs: inspectorDefs ? (inspectorDefs.inputs ? inspectorDefs.inputs : scope.commonInspectorInputs) : scope.commonInspectorInputs,
                groups: inspectorDefs ? (inspectorDefs.groups ? inspectorDefs.groups : scope.commonInspectorGroups) : scope.commonInspectorGroups,
                cell: cell
              }).on('render', function () {
                this.$('[data-tooltip]').each(function () {
                  var $label = $(this);
                  new joint.ui.Tooltip({
                    target: $label,
                    content: $label.data('tooltip'),
                    right: '.inspector',
                    direction: 'right'
                  });
                });
                if (cell.get('type') === 'bpmn.Conversation') {
                  var attachedToStr = cell.get('attachedTo');
                  $scope.attachToTask = attachedToStr ? (attachedToStr.indexOf(':') > -1 ? attachedToStr.split(':')[1] : attachedToStr) : '';
                }
                $compile($inspectorHolder)($scope);
                /**
                 * 为了解决丢属性的问题，在使用$compile之后，手动刷新一下所有cell
                 */
                setTimeout(function () {
                  inspector.updateCell();
                });
              });
              scope.selectedView.inspector = true;
              $inspectorHolder.html(inspector.render().el);
              $compile($inspectorHolder)($scope);
              setTimeout(function () {
                inspector.updateCell();
              });
              // var el = inspector.render().el;
              // for(var i = 0; i < el.children.length; i++) {
              //   $(el.children[i]).wrap("<div class='inspector'></div>");
              // }
              // $inspectorHolder_geometry.html(el.children[3]);
              // $inspectorHolder_presentation.html(el.children[2]);
              // $inspectorHolder_text.html(el.children[1]);
              // $inspectorHolder.html(el.children[0]);
              // $compile($inspectorHolder)($scope);
              // $compile($inspectorHolder_text)($scope);
              // $compile($inspectorHolder_presentation)($scope);
              // $compile($inspectorHolder_geometry)($scope);
            }
            // adjust selection
            selectionView.cancelSelection();
            selection.reset([cellView.model]);
          };
          paper.on('element:pointerup', function (cellView, evt) {
            evt.stopPropagation();
            if (!displayMode) {
              if (cellView.model instanceof joint.dia.Element && !selection.contains(cellView.model)) {
                scope.selectedView.inspector = true;
                openCellTools(cellView);
              }
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

          paper.on('cell:pointerup', function (cellView, evt) {
            if (cellView.model instanceof joint.dia.Link) {
              openCellTools(cellView);
            }
          });
          /* 线条上的事件用cell:pointerup
          paper.on('link:options', function(evt, cellView, x, y) {
            openCellTools(cellView);
          });
          */
        },
        function toolTips (scope, element) {
          $('.toolbar-container [data-tooltip]', element).each(function () {
            new joint.ui.Tooltip({
              target: $(this),
              content: $(this).data('tooltip'),
              top: '.toolbar-container',
              direction: 'top'
            });
          });
        },
        function initializeCommandManager (scope, element) {
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
          scope.components.commander.mould = function () {
            if (scope.data.mouldType != "" && scope.data.mouldType != null) {
              for (var i in scope.data.mould) {
                if (scope.data.mould[i].content == scope.data.mouldType) {
                  scope.components.graph.fromJSON(scope.data.mould[i].view);
                }
              }
            }
          };
          scope.components.commander.setGrid = function () {
            var gridSize = paper.options.gridSize;
            var backgroundImage = getGridBackgroundImage(gridSize);
            if (scope.data.bgcolor) {
              paper.$el.css('background-color', scope.data.bgcolor);
            } else {
              paper.$el.css('background-color', "#fff");
              paper.$el.css('box-shadow', "0 0 2px white");
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
          scope.components.commander.setDimensions = function () {
            paper.setDimensions(paper.options.width, paper.options.height);
            paperScroller.options.baseWidth = paper.options.width;
            paperScroller.options.baseHeight = paper.options.height;
            paperScroller.$el.css('padding-top', 0);
            paperScroller.$el.css('padding-left', 0);
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
              }

            } else {
              if (!displayMode) {
                paper.$el.css('background-image', 'url("' + backgroundImage + '")');
              } else {
                paper.$el.css('background-image', 'url(""),url("")');
              }
            }
          };
          scope.components.commander.save4Json = function () {
            var viewjson = graph.toJSON();
            var validate = true;
            viewjson.cells.forEach(function (cell) {

              if (cell.type == "bpmn.Activity") {
                if (!cell.taskType) {
                  growl.warning("请选择{" + cell.content + "}任务的任务类型", {});
                  validate = false;
                  return;
                }
                var userTypeStr = "";
                if (cell.userType == "" || cell.userType == null) {
                  growl.warning("请选择{" + cell.content + "}任务的处理类型", {});
                  validate = false;
                  return;
                } else {
                  var s = cell.userType.split(':')[1];
                  userTypeStr = s ? s : cell.userType;
                  cell.userType = userTypeStr;
                }
                if (userTypeStr == "user" && !cell.userIds) {
                  growl.warning("请设置{" + cell.content + "}任务的处理用户", {});
                  validate = false;
                  return;
                }
                if (userTypeStr == "expression" && !cell.userExpression) {
                  growl.warning("请设置{" + cell.content + "}任务的用户表达式", {});
                  validate = false;
                  return;
                }
                if (userTypeStr == "role" && !cell.roleIds) {
                  growl.warning("请设置{" + cell.content + "}任务的处理角色", {});
                  validate = false;
                  return;
                }
                if (userTypeStr == "userGroup" && !cell.userGroupIds) {
                  growl.warning("请设置{" + cell.content + "}任务的处理用户组", {});
                  validate = false;
                  return;
                }
              }

              if (cell.type == 'bpmn.Conversation') {
                var attachedToStr = cell.attachedTo;
                if (!attachedToStr) {
                  growl.warning("请选择{" + cell.content + "}", {});
                  validate = false;
                  return;
                } else {
                  var attachedTaskArr = attachedToStr.split(':');
                  if (attachedTaskArr.length < 2) {
                    cell.attachedTo = attachedToStr;
                  } else {
                    cell.attachedTo = attachedTaskArr[1];
                  }
                }
              }
            });
            if (!validate) return;
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
          scope.components.commander.loadJSON = function () {
            BootstrapDialog.show({
              title: '导入组态内容',
              message: $('<textarea id="json4configer" class="form-control" placeholder="输入JSON"></textarea>'),
              buttons: [{
                label: '确认',
                cssClass: 'btn-primary',
                hotkey: 13, // Enter.
                action: function (dialogRef) {
                  dialogRef.close();
                  var inputcontent = document.getElementById('json4configer');
                  if (inputcontent.value) {
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
        function initView (scope, element) {
          getUserGroup();
          getUser();
          getRole();
          showViewContent(scope, viewId);
        }
      ];
    }
  ]);
});