define(function () {
  return [{
    route: "/test4",
    templateUrl: "test.html",
    name: "ctrlTest",
    injector: ["$scope", "$location", "resourceUIService", "psMessageBox"],
    controller: function ($scope, $location, resourceUIService, psMessageBox) {
      console.log(psMessageBox)
      getModels(getRes);
      $scope.testTxt = "";
      $scope.dateSelect = "2018-5-1";
      $scope.navigators = [{
        label: "模版信息",
        active: true
      }];
      function getModels(callback) {
        resourceUIService.getModels(function (e) {
          (e.code == "0" && callback) && callback(e.data);
        });
      };
      function getRes(resources) {
        $scope.source = {
          showIndex: false,
          showSelector: false,
          search: function (row, i) {
            var dt = new Date(row.createTime);
            var condition1 = row.label.indexOf($scope.testTxt) != -1;
            var condition2 = new Date($scope.dateSelect) < dt;
            return condition1 && condition2;
          },
          buttons: [
            ['全选', function (data) {
              var that = this;
              psMessageBox.confirm({
                message: '将选中所有的数据',
                placeholder: '---->',
                reg: /[0-9]{1,5}/,
                errorTip: '请输入数字',
                confirmFn: function (e) {
                  console.log(this);
                  console.log(that);
                  console.log(e);
                  that.selectAll();
                  $scope.$apply()
                }
              });
            }], ['取消全选', function (data) {
              this.deselectAll();
            }]
          ],
          data: resources,
          body: {
            label: "设备标签",
            createTime: {
              label: "日期",
              style: function (row, i) {
                return {
                  "color": i % 2 ? "blue" : "red"
                }
              },
              on: {
                click: function (row, i) {
                  console.log(row, i);
                }
              },
              component: "date",
              bind: function (row) {
                return new Date(row.createTime).getFullYear();
              },
              sort: function (row) {
                return new (row.createTime).getTime();
              }
            }
          },
          bodyButtons: [{
            label: "添加",
            dtClass: "primary",
            dtShow: function (row, inx) {
              return true;
            },
            dtDisabled: function (row, inx) {
              return false;
            },
            on: {
              click: function (row, inx) {
                this.unshift({
                  id: 3,
                  label: "wer"
                })
              }
            }
          }, {
            label: "删除",
            on: {
              click: function (row, inx) {
                this.remove(inx);
              }
            }
          }, ['详细信息', function (row, inx) {
            $location.path("prod_test3/" + row.id);
          }]]
        }
      }

    }
  }, {
    route: "/prod_dir/:path?/:parameter?",
    templateUrl: "dir.html",
    name: "ctrlTest",
    injector: ["$scope", "$location", "resourceUIService", "psMessageBox"],
    controller: function ($scope, $location, resourceUIService, psMessageBox) {
      $scope.navigators = [{
        label: "批量下发",
        active: true
      }];
    }
  }]
});