define(['directives/directives','bootstrap-treeview'], function (directives,treeview) {
  'use strict';
  directives.initDirective('treeviewCheckable', function ($timeout) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var tree;

          $scope.$on(Event.FUNCTIONINFOSINIT, function (event, args) {
            if (tree) {

            }
            var checkcounts = 0;
            var baseNode = args.baseNode;
            tree = domMain.treeview({
              levels: 99,
              data: args.treeData,
              showTags: true,
              showIcon: false,
              showCheckbox: args.statusCheck,
              onNodeChecked: function (event, node) {
                if (checkcounts == 0) {
                  var checkableNodes = findCheckableNodess(node.functionCode);
                  checkcounts = checkableNodes.length - 1;
                  node.belong = 1;
                  baseNode[node.functionCode] = true;
                  changeChecked(checkableNodes, true)
                } else {
                  node.belong = 1;
                  baseNode[node.functionCode] = true;
                  checkcounts--;
                }
                if (checkcounts == 0) {
                  $scope.changeNodesState(baseNode, true);
                }

              },
              onNodeUnchecked: function (event, node) {
                if (checkcounts == 0) {
                  var checkableNodes = findCheckableNodess(node.functionCode);
                  checkcounts = checkableNodes.length - 1;
                  node.belong = 0;
                  baseNode[node.functionCode] = false;
                  changeChecked(checkableNodes, false)
                } else {
                  node.belong = 0;
                  baseNode[node.functionCode] = false;
                  checkcounts--;
                }
                if (checkcounts == 0) {
                  $scope.changeNodesState(baseNode, false);
                }
              }
            });

            domMain.treeview('expandAll', { levels: 99, silent: true });
          });
          var changeChecked = function (checkableNodes, flg) {
            if (flg) {
              domMain.treeview('checkNode', [checkableNodes, {silent: $('#chk-check-silent').is(':checked')}]);
            } else {
              domMain.treeview('uncheckNode', [checkableNodes, {silent: $('#chk-check-silent').is(':checked')}]);
            }
          }
          var findCheckableNodess = function (val) {
            return domMain.treeview('search', [val, {ignoreCase: false, exactMatch: false}]);
          };

          // Check/uncheck all
          $('#btn-check-all').on('click', function (e) {
            domMain.treeview('checkAll', {silent: $('#chk-check-silent').is(':checked')});
          });
          $('#btn-uncheck-all').on('click', function (e) {
            domMain.treeview('uncheckAll', {silent: $('#chk-check-silent').is(':checked')});
          });
        }
      ]
    };
  });
  directives.initDirective('ztreeCheckable', function ($timeout) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var tree;

          $scope.$on(Event.FUNCTIONINFOSINIT+"_ztree", function (event, args) {
            // var init = function(n) {
              require(['ztree','ztree-excheck'], function(ztree) {

                $.fn.zTree.init(domMain, args.setting, args.data);
              })
            // }
            // init(args.data);
          });
        }
      ]
    };
  });
  directives.initDirective('domainPicker1', function($compile, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, iElem, iAttr, ngmodel) {
        require(['bootstrap-treeview'], function(treeview) {
          var getDomainList = function(domains) {
            if(iAttr.gatewaydomainpath) {
              for(var i in domains) {
                if(domains[i].domainPath == iAttr.gatewaydomainpath)
                  return [domains[i]]
                else
                  return getDomainList(domains[i].domains);
              }
            } else {
              return domains;
            }
          }
          iElem.on('shown.bs.popover', function() {
            var treeview1 = $('#treeview1');
            $compile(treeview1)(scope);

            var domainListTree = getDomainList(scope.domainListTree);

            treeview1.treeview({
              data: domainListTree,
              onNodeSelected: function(event, node) {
                if(node.domainPath != "") {
                  iElem.attr("domainPath", node.domainPath);
                  iElem.popover("hide");
                  if(iAttr.model) {
                    var arr = iAttr.model.split("\.")
                    var model = scope;
                    for(var i in arr) {
                      if(model) {
                        if(i == arr.length - 1) {
                          model[arr[i]] = node.domainPath;
                          break;
                        }
                        model = model[arr[i]];
                      }
                    }
                  }
                  iElem.val(node.name).change();
                }
              }
            });
          });

        })
      },
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          $element.attr("readonly", true);
          $element.data('content', "<div id ='treeview1' slim-scroll height='220px'></div>");
          $element.popover({
            html: true,
            trigger: 'manual',
            placement: 'auto bottom'
          });
          $element.on("click", function() {
            $element.popover("show");
            $element.siblings(".popover").on("mouseleave", function() {
              $element.popover('hide');
            });
          })
          $element.on("mouseleave", function() {
            setTimeout(function() {
              if(!$(".popover:hover").length) {
                $element.popover("hide")
              }
            }, 100);
          });
        }
      ]
    };
  });
  directives.initDirective('domaintreeCheckable', function ($timeout) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var tree;

          $scope.$on(Event.DOMAININFOSINIT, function (event, args) {
            if (tree) {

            }
            var checkcounts = 0;
            var baseNode = args.baseNode;
            tree = domMain.treeview({
              levels: 1,
              data: args.treeData,
              showTags: true,
              showIcon: false,
              showCheckbox: true,
              onNodeChecked: function (event, node) {
                if (checkcounts == 0) {
                  var checkableNodes = findCheckableNodess(node.domainID);
                  checkcounts = checkableNodes.length - 1;
                  node.belong = 1;
                  baseNode[node.domainID] = true;
                  changeChecked(checkableNodes, true)
                } else {
                  node.belong = 1;
                  baseNode[node.domainID] = true;
                  checkcounts--;
                }
                if (checkcounts == 0) {
                  $scope.changeDomainState(baseNode, true);
                }

              },
              onNodeUnchecked: function (event, node) {
                if (checkcounts == 0) {
                  var checkableNodes = findCheckableNodess(node.domainID);
                  checkcounts = checkableNodes.length - 1;
                  node.belong = 0;
                  baseNode[node.domainID] = false;
                  changeChecked(checkableNodes, false)
                } else {
                  node.belong = 0;
                  baseNode[node.domainID] = false;
                  checkcounts--;
                }
                if (checkcounts == 0) {
                  $scope.changeDomainState(baseNode, false);
                }
              }
            });
          });
          var changeChecked = function (checkableNodes, flg) {
            if (flg) {
              domMain.treeview('checkNode', [checkableNodes, {silent: $('#chk-check-silent').is(':checked')}]);
            } else {
              domMain.treeview('uncheckNode', [checkableNodes, {silent: $('#chk-check-silent').is(':checked')}]);
            }
          }
          var findCheckableNodess = function (val) {
            return domMain.treeview('search', [val, {ignoreCase: false, exactMatch: false}]);
          };

          // Check/uncheck all
          $('#btn-check-all').on('click', function (e) {
            domMain.treeview('checkAll', {silent: $('#chk-check-silent').is(':checked')});
          });
          $('#btn-uncheck-all').on('click', function (e) {
            domMain.treeview('uncheckAll', {silent: $('#chk-check-silent').is(':checked')});
          });
        }
      ]
    };
  });
});