define(['directives/directives'], function(directives) {
  'use strict';
  var arrayLike = [/^\[.*/, /.*\]$/];
  var objectLike = [/^\{.*/, /.*\}$/];
  var functionLike = [/^function\(.*\)\{/, /.*\}$/];
  var test = function(str, regExp) {
    var condition = true;
    for(var i in regExp) {
      condition = condition && regExp[i].test(str)
    }
    return condition;
  }

  function isArrayLike(string) {
    return test(string, arrayLike);
  }

  function isObjectLike(string) {
    return test(string, objectLike);
  }

  function isFunctionLike(string) {
    return test(string, functionLike);
  }

  var objToString = function(obj) {
    if(typeof obj == "function") {
      return obj.toString();
    } else if(typeof obj == "object") {
      return JSON.stringify(obj, null, 2);
    } else {
      return obj + "";
    }
  };
  var stringToObj = function(string) {
    var rs;
    try {
      if(isArrayLike(string) || isFunctionLike(string)) {
        rs = eval(string);
      } else if(isObjectLike(string)) {
        rs = JSON.parse(string);
      } else {
        rs = string;
      }
    } catch(e) {
      //console.log(string, "不能被转化为对象");
    } finally {
      return rs;
    }
  };
  /** 下拉单选框**/
  directives.initDirective("fbTitle", ["$q", "$timeout", function(q, timeout) {
    var directive = {};
    /**
         directive.scope = {
      fbTitle : "=",
    };*/
    directive.restrict = "A";
    directive.link = function(scope, element, attr) {
      var tooltip = $("<div></div>");
      $(element).css("position", "relative");
      tooltip.css("position", "absolute");
      tooltip.css("background-color", "rgba(0,0,0,.7)");
      tooltip.css("padding", "5px");
      tooltip.css("color", "#fff");
      tooltip.css("border-radius", "3px");
      tooltip.css("left", "0px");
      tooltip.css("top", "40px");
      tooltip.text("scope.fbTitle");
      tooltip.css("pointer-events", "none");
      tooltip.text(attr.fbTitle);
      //$(element).append(tooltip);
      $(element).on("mouseenter", function() {
        $(element).append(tooltip);
      });
      $(element).on("click", function() {
        tooltip.remove();
      });
      $(element).on("mouseleave", function() {
        tooltip.remove();
      });
    };
    return directive;
  }]);

  directives.initDirective("buttonGroup", ["$q", "$timeout", function(q, timeout) {
    var directive = {};
    directive.scope = {
      label: "=",
      click: "&",
      options: "="
    };
    directive.restrict = "A";
    directive.link = function(scope, element, attr) {
      var btnGroup = $("<div></div>").addClass("btn-group btn-group-sm");
      var button = $("<button></button>").addClass("btn btn-default");
      var drop = $("<button></button>").addClass("btn btn-default dropdown-toggle");
      var caret = $("<span></span>").addClass("caret");
      var ul = $("<ul></ul>").addClass("dropdown-menu");
      var type;
      drop.append(caret);
      btnGroup.append(button).append(drop).append(ul);
      $(element).append(btnGroup);
      drop.on("click", function(event) {
        if(btnGroup.hasClass("open")) {
          btnGroup.removeClass("open");
        } else {
          btnGroup.addClass("open");
        }
      });
      button.on("click", function(event) {
        scope.$apply(function() {
          scope.click({
            type: type
          });
        });
      });
      var renderOption = function() {
        var loop = function(item) {
          var li = $("<li></li>");
          var a = $("<a></a>").text(item.name);
          li.append(a);
          li.on("click", function(event) {
            btnGroup.removeClass("open");
            type = item.value;
            button.text("添加" + item.name + "样式");
          });
          return li;
        };
        for(var i in scope.options) {
          ul.append(loop(scope.options[i]))
        }
      };
      timeout(function() {
        scope.$watch("label", function(n, o, s) {
          if(n) {
            var find = s.options.find(function(element) {
              return element.value == n;
            });
            type = find.value;
            button.text("添加" + find.name + "样式");
          }
        });
        renderOption();
      });
    };
    return directive;
  }]);

  directives.initDirective("ngThumb", ["$q", "$window", "$timeout", function(q, $window, timeout) {
    var helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function(item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function(file) {
        var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };

    return {
      restrict: 'A',
      template: '<canvas/>',
      link: function(scope, element, attributes) {
        if(!helper.support) return;
        var params = scope.$eval(attributes.ngThumb);
        if(!helper.isFile(params.file)) return;
        if(!helper.isImage(params.file)) return;
        var canvas = element.find('canvas');
        var reader = new FileReader();
        reader.onload = onLoadFile;
        reader.readAsDataURL(params.file);

        function onLoadFile(event) {
          var img = new Image();
          img.onload = onLoadImage;
          img.src = event.target.result;
        }

        function onLoadImage() {
          var width = params.width || this.width / this.height * params.height;
          var height = params.height || this.height / this.width * params.width;
          canvas.attr({
            width: width,
            height: height
          });
          canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
        }
      }
    };
  }]);

  directives.initDirective("fileInput", ["$q", "$timeout", "FileUploader", "configUIService", "growl", function(q, timeout, FileUploader, configUIService, growl) {
    var directive = {};
    directive.scope = {
      ngModel: "=",
      fileFormat: "="
    };
    directive.restrict = "A";
    directive.template = '<div  ng-if="uploader" style="border:1px solid #ddd; background-color:#eee; padding : 5px;">' +
      '<input id="nv-file-select" class="form-control" type="file" nv-file-select uploader="uploader">' +
      '<table class="table" style="margin-bottom: 0;" ng-show="uploader.queue.length > 0">' +
      '<thead>' +
      '<tr>' +
      ' <th width="50%">图片名称</th>' +
      '<th ng-show="uploader.isHTML5">尺寸</th>' +
      '<th>操作</th>' +
      ' </tr>' +
      ' </thead>' +
      '<tbody>' +
      ' <tr ng-repeat="item in uploader.queue">' +
      ' <td>' +
      '<strong>{{ item.file.name }}</strong>' +
      '<div ng-show="uploader.isHTML5" ng-thumb="{ file: item._file, height: 70 }"></div>' +
      '</td>' +
      '<td ng-show="uploader.isHTML5" nowrap>{{ item.file.size/1024/1024|number:2 }} MB</td>' +
      '</td>' +
      '<td nowrap>' +
      '<button type="button" class="btn btn-success btn-xs" ng-click="item.upload()" ng-disabled="item.isReady || item.isUploading || item.isSuccess">' +
      '<span class="glyphicon glyphicon-upload"></span> 上传 </button>' +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      ' </table>' +
      '</div>';
    directive.link = function(scope, element, attr) {
      console.log(scope.ngModel);
      require(['angular-file-upload'], function() {
        timeout(function() {
          var param = {
            domainPath: "",
            groupName: "dashboardImage",
            id: 0,
            invalid: false,
            key: "",
            keyDesc: "",
            label: "",
            value: ""
          };
          var fileFormat = scope.fileFormat && scope.fileFormat.fileFormat ? scope.fileFormat.fileFormat : "|jpg|png|jpeg|bmp|gif|svg|";
          var queueLimit = scope.fileFormat && scope.fileFormat.queueLimit ? scope.fileFormat.queueLimit : 1;
          var fileMaxSize = scope.fileFormat && $scope.fileFormat.fileMaxSize ? $scope.fileFormat.fileMaxSize : 1;
          var uploader = scope.uploader = new FileUploader({
            url: configUIService.origin + '/api/rest/uploadConfig/configUIService/uploadConfigFile',
            withCredentials: true
          });
          uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
              var nameAry = item.name.split(".");
              var type = nameAry[nameAry.length - 1];
              if(fileFormat.indexOf(type) == -1) {
                growl.warning("文件格式仅支持" + fileFormat + "文件，请重新选择", {});
                return false;
              }
              if((item.size / 1024) > fileMaxSize * 1000) {
                growl.warning("您选择的文件大于" + fileMaxSize + "M，请重新选择", {});
                return false;
              }
              return true;
            }
          });

          // CALLBACKS
          uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
          };
          uploader.onAfterAddingFile = function(fileItem) {
            if(uploader.queue.length > queueLimit) {
              uploader.removeFromQueue(queueLimit);
              growl.info("已达上传图片张数", {});
              return;
            };
            param.label = fileItem.file.name;
            configUIService.saveConfig(param, function(resultObj) {
              scope.ngModel.trigger("imageFileUploaded", resultObj.data);
              if(resultObj.code == 0) {
                param.id = resultObj.data.id;
                fileItem.formData.push({
                  value: 'images/dashboardImage',
                  id: param.id
                });
              }
            });
          };
          uploader.onAfterAddingAll = function(addedFileItems) {
            //console.info('onAfterAddingAll', addedFileItems);
          };
          uploader.onBeforeUploadItem = function(item) {
            //console.info('onBeforeUploadItem', item);
          };
          uploader.onProgressItem = function(fileItem, progress) {
            //console.info('onProgressItem', fileItem, progress);
          };
          uploader.onProgressAll = function(progress) {
            //console.info('onProgressAll', progress);
          };
          uploader.onSuccessItem = function(fileItem, response, status, headers) {
            //console.info('onSuccessItem', fileItem, response, status, headers);
          };
          uploader.onErrorItem = function(fileItem, response, status, headers) {
            //console.info('onErrorItem', fileItem, response, status, headers);
          };
          uploader.onCancelItem = function(fileItem, response, status, headers) {
            //console.info('onCancelItem', fileItem, response, status, headers);
          };
          uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', response);
            if(response) {
              if(response.code == 0) {
                var url = response.data;
                scope.ngModel = url;
                growl.success("图片上传成功", {});
              } else {
                growl.error(response.message, {});
              };
            } else {
              growl.error("操作异常了，尝试重新刷新", {});
            }
          };
          uploader.onCompleteAll = function() {
            //console.info('onCompleteAll');
          };
          //console.info('uploader', uploader);
        })
      });
    };
    return directive;
  }]);
  directives.initDirective("selectImage", ["$q", "$timeout", "FileUploader", "configUIService","fuploader", "growl", function(q, timeout, FileUploader, configUIService, fuploader, growl) {
    var directive = {};
    directive.scope = {
      ngModel: "=",
      options: "=",
      format: "=",
      change: "&"
    };
    directive.restrict = "A";
    directive.link = function(scope, element, attr) {
      var format = scope.format || {
          label: "label",
          value: "value"
        };
      timeout(function() {
        var event = {};
        var on = function(eventName, callback){
          event[eventName] = callback;
        };

        var updatePreview = function(n){
          on("updated", function(){
            updatePreview(n);
          });
        };
        var setOption = function(options){
          on("toolLoaded", function(){
            setOption(options);
          });
        };
        $$.loadExternalJs(['toolkit/single-select', 'toolkit/image-drag'], function(singleSelect, imageDrag){
          var dropDown = $("<div></div>");
          var prev = $("<div></div>");
          var upload = $("<div></div>");
          var ss = singleSelect.init(dropDown, format);
          setOption = function(options) {
            console.log(options, scope.ngModel);
            ss.setOption(options);
            ss.setValue(scope.ngModel);
            prev.imageprev();
          };
          updatePreview = function(src){
            prev.imageprev("option", "changeSrc", configUIService.origin + "/" + src);
          };
          if(typeof event['toolLoaded'] == "function"){
            event['toolLoaded']();
          };
          if(typeof event['updated'] == "function"){
            event['updated']();
          };
          var imgDrg = imageDrag.init(upload);
          $(element).children().remove();
          $(element).append(dropDown).append(prev).append(upload);
          imgDrg.on("submit", function(file){
            fuploader.uploadFile(file, function(returnObj){
              setOption(scope.options.concat({
                label : returnObj.data.label,
                value : returnObj.data.value
              }));
              scope.ngModel = returnObj.data.value;
              ss.setValue(returnObj.data.value);
              upload.css("display", "none");
              prev.css("display", "block");
              prev.imageprev("option", "changeSrc", configUIService.origin + "/" + returnObj.data.value);
              imgDrg.reset();
            });
          });
          imgDrg.on("change", function(file){
            growl.success("图片更新后需要点击上传按钮保存后才可使用！");
          });
          ss.on("click", function(value){
            if(value != 'upload'){
              scope.$apply(function(){
                scope.ngModel = value;
              });
              prev.css("display", "block");
              upload.css("display", "none");
            } else {
              prev.css("display", "none");
              upload.css("display", "block");
            };
          });

        });
        scope.$watch("ngModel", function(n, o, s) {
          if(n) {
            updatePreview(n)
          }
        });
        scope.$watch("options", function(n, o, s) {
          if(n) {
            if(n[0].value != "upload"){
              n.unshift({
                label : "上传图片",
                value : "upload"
              });
            };
            setOption(n);
          }
        });

      });
    };
    return directive;
  }]);
  directives.initDirective("selectSingle", ["$q", "$timeout", function(q, timeout) {
    var directive = {};
    directive.scope = {
      ngModel: "=",
      options: "=",
      format: "=",
      change: "&"
    };
    directive.restrict = "A";
    directive.link = function(scope, element, attr) {
      timeout(function() {
        $$.loadExternalJs(['toolkit/single-select'], function(singleSelect){
          var format = scope.format || {
              label: "label",
              value: "value"
            };
          var ss = singleSelect.init(element, format);
          ss.on("click", function(value){
            scope.$apply(function(){
              scope.ngModel = value;
            })
          });
          var setOption = function(options) {
            ss.setOption(options);
            ss.setValue(scope.ngModel);
          };
          scope.$watch("options", function(n, o, s) {
            if(n) {
              setOption(n);
            }
          });
        })

      });
    };
    return directive;
  }]);
  directives.initDirective("copyButton", ["$q", "$timeout", "growl", function(q, timeout, growl) {
    var directive = {};
    directive.scope = {
      ngModel: "="
    };
    directive.restrict = "E";
    directive.link = function(scope, element, attr) {
      var button = $("<button></button>")
        .addClass("btn btn-primary");
      var icon = $("<span></span>");
      var text = $("<span></span>")
        .text("复制到剪切版")
      icon.addClass("glyphicon glyphicon-copy");
      button.append(icon);
      button.append(text);
      //button.text("复制到剪切版");
      element.append(button);
      $$.loadExternalJs(['clipboard'], function(Clipboard) {
        var clipboard = new Clipboard(button[0]);
        clipboard.on('success', function(e) {
          /**
           console.info('Action:', e.action);
           console.info('Text:', e.text);
           console.info('Trigger:', e.trigger);
           */
          growl.success("成功复制到剪切版");
          e.clearSelection();
        });
        clipboard.on('error', function(e) {
          console.error('Action:', e.action);
          console.error('Trigger:', e.trigger);
        });
      });
      /**
             $$.loadExternalJs(['zeroclipboard'], function(ZeroClipboard){
        var client = new ZeroClipboard(button[0]);
        client.on( "ready", function( readyEvent ) {
          client.on( "aftercopy", function( event ) {
            growl.success("成功复制到剪切版");
          });
        });
      });*/
      scope.$watch("ngModel", function(n, o, s) {
        button.attr("data-clipboard-text", n);
      });
    };
    return directive;
  }]);
  directives.initDirective("timeselect", ["$q", "$timeout", function(q, timeout) {
    var directive = {};
    directive.scope = {
      ngModel: "=",
      change: "&"
    };
    directive.restrict = "E";
    directive.template = "\
      <div class='row'>\
        <div class='col-md-6'>\
          <input ng-model='ngModel.value' class='form-control'/>\
        </div>\
        <div class='col-md-6'>\
          <div class='btn-group btn-group-sm' role='group'>\
            <a ng-repeat='unit in units'\
              ng-click = 'selectClick(unit)'\
              class='btn btn-default'\
              ng-class='{true : \"active\", false : \"\"}[ngModel.unit==unit.value]'\
              ng-bind='unit.label'>\
            </a>\
          </div>\
        </div>\
      </div>";
    directive.link = function(scope, element, attr) {
      timeout(function() {
        scope.units = [{
          label: "月",
          value: "month"
        }, {
          label: "天",
          value: "day"
        }, {
          label: "小时",
          value: "hour"
        }, {
          label: "分钟",
          value: "minute"
        }, {
          label: "秒",
          value: "second"
        }];
        scope.selectClick = function(unit) {
          scope.change();
          scope.ngModel.unit = unit.value;
        }
      });
    };
    return directive;
  }]);
  directives.initDirective("evalinput", ["$q", "$timeout", function(q, timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      ngModel: "=",
      change: "&"
    };
    directive.link = function(scope, element, attr) {
      timeout(function() {
        var input = $("<input class='form-control' />");
        input.val(objToString(scope.ngModel));
        input.on("change", function(event) {
          var self = this;
          scope.$apply(function() {
            scope.change();
            scope.ngModel = $(self).val();
          });
        })
        $(element).append(input);
      });
    };
    return directive;
  }]);
  directives.initDirective("fbToggle", ["$q", "$timeout", function(q, timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.template = "<div class='toggle-wrap' ng-click='toggleClick();'><div class='toggle-inner'></div></div>";
    directive.scope = {
      ngModel: "=",
      change: "&"
    };
    directive.link = function(scope, element, attr) {
      timeout(function() {
        var render = function() {
          if(scope.ngModel) {
            $(element).find('.toggle-wrap').addClass("active");
          } else {
            $(element).find('.toggle-wrap').removeClass("active");
          }
        }
        render();
        scope.toggleClick = function() {
          scope.ngModel = !scope.ngModel;
          scope.change();
          render();
        };
      });
    };
    return directive;
  }]);
  directives.initDirective("autoMultiselect", ["$q", "$timeout", function(q, timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      ngModel: "=",
      multiple: "=",
      options: "=",
      config: "=",
      change: "&"
    };
    directive.link = function(scope, element, attr) {
      var select = $("<select class='multiselect' multiple='multiple'></select>");
      if(scope.ngModel == undefined) {
        scope.ngModel = [];
      }
      timeout(function() {
        $$.loadExternalJs(["bootstrap-multiselect"], function(multiselect) {
          timeout(ready);

          function ready() {
            var disp = "label",
              id = "id",
              valueOnly;
            if(scope.multiple == false) {
              select.removeAttr("multiple");
            } else {
              select.attr("multiple", "multiple");
            };
            if(scope.config) {
              disp = scope.config.disp;
              id = scope.config.id;
              valueOnly = scope.config.valueOnly;
            };
            $(element).append(select);
            scope.$watch("options", function(n, o, s) {
              function findModel(elem, callback) {
                var find = scope.options.find(function(element) {
                  if(valueOnly) {
                    return elem == element[id];
                  } else {
                    return elem[id] == element[id];
                  };
                });
                if(find) {
                  if(valueOnly) {
                    callback(elem);
                  } else {
                    callback(elem[id]);
                  }
                } else {
                  callback(null);
                }
              }
              if(n) {
                select.children().remove();
                var renderOption = function(option) {
                  return $("<option value='" + option[id] + "'>" + option[disp] + "</option>")
                };
                if(scope.options.length == 0) {
                  select.multiselect('rebuild');
                  select.multiselect('disable');
                } else {
                  for(var i in scope.options) {
                    select.append(renderOption(scope.options[i]))
                  }
                  select.multiselect('rebuild');
                  for(var i in scope.options) {
                    select.multiselect("deselect", scope.options[i].id);
                  };
                  if(scope.multiple == false) {
                    if(scope.ngModel.length == 0) {
                      if(valueOnly) {
                        scope.ngModel = [scope.options[0].id];
                      } else {
                        scope.ngModel = [scope.options[0]];
                      }
                    };
                  }
                  for(var i in scope.ngModel) {
                    findModel(scope.ngModel[i], function(id) {
                      if(id) {
                        select.multiselect("select", id);
                      } else {
                        scope.ngModel.$remove(function(index, element) {
                          return index == i;
                        });
                      }
                    });
                  };
                }
              }
            });
            var buttonText = function(options) {
              if(options.length == 0) {
                return '没有选择';
              } else if(options.length > 1) {
                return "已选择" + options.length + "个";
              } else {
                var selected = '';
                options.each(function() {
                  selected += $(this).text() + ', ';
                });
                return selected.substr(0, selected.length - 2);
              }
            }
            var onChange = function(element, checked) {
              scope.$apply(function() {
                var resourceId = $(element).val();
                var target;
                if(checked) {
                  var find = scope.options.find(function(ele) {
                    return ele[id] == resourceId;
                  });
                  if(scope.multiple == false) {
                    if(valueOnly) {
                      scope.ngModel = [find.id];
                    } else {
                      scope.ngModel = [find];
                    }
                  } else {
                    if(valueOnly) {
                      scope.ngModel.push(find[id]);
                    } else {
                      scope.ngModel.push(find);
                    }
                  }
                } else {
                  if(valueOnly) {
                    scope.ngModel.$remove(function(index, elem) {
                      return elem == resourceId;
                    });
                  } else {
                    scope.ngModel.$remove(function(index, elem) {
                      return elem.id == resourceId;
                    });
                  }
                }
              });
            };
            select.multiselect({
              selectAll: true,
              enableFiltering: true,
              buttonWidth: "100%",
              buttonText: buttonText,
              onChange: onChange
            });
          }
        });
      });
    };
    return directive;
  }]);
  directives.initDirective("select", ["$timeout", function(timeout) {
    var directive = {};
    directive.scope = {
      ngModel: "=",
      options: "=",
      change: "&"
    };
    directive.template = "\
    <div class='btn-group btn-group-sm' role='group'>\
      <a ng-repeat='value in options'\
        ng-click = 'selectClick(value)'\
        class='btn btn-default'\
        ng-class='{true : \"active\", false : \"\"}[ngModel==value.value]'\
        ng-bind='value.label'>\
      </a>\
    </div>";
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      scope.selectClick = function(value) {
        scope.ngModel = value.value;
        scope.change();
      };
    }

    return directive;
  }]);
  directives.initDirective("excel", ["$timeout", function(timeout) {
    var directive = {};
    directive.scope = {
      ngModel: "="
    };
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      var excelDom = $("<div></div>");
      timeout(function() {
        element.append(excelDom);
        $(element).css("overflow", "auto");
        $(element).css("margin", "5px auto");
        $(element).css("height", "100px");
        $(element).css("background-color", "#eee");
        $$.loadExternalJs(["Handsontable"], function(ht) {
          //window.Handsontable = ht;
          var config = {
            data: scope.ngModel,
            rowHeaders: true,
            colHeaders: true,
            manualColumnResize: true,
            manualRowResize: true,
            minSpareCols: 1,
            minSpareRows: 1
          }
          if(excelDom.handsontable){
            excelDom.handsontable(config);
          } else {
            var ins = Handsontable(excelDom[0], config)
          }

        });
      });
    }

    return directive;
  }]);
  directives.initDirective("excelPrev", ["$timeout", function(timeout) {
    var directive = {};
    directive.scope = {
      source: "="
    };
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      var excelDom = $("<div></div>"),
        handt;
      timeout(function() {
        element.append(excelDom);
        $(element).css("overflow", "auto");
        $(element).css("margin", "5px auto");
        $(element).css("height", "100px");
        $(element).css("background-color", "#eee");
        $$.loadExternalJs(["Handsontable"], function(ht) {
          var config = {
            data: [],
            rowHeaders: true,
            colHeaders: true,
            manualColumnResize: true,
            manualRowResize: true,
            minSpareCols: 0,
            minSpareRows: 0
          }
          if(excelDom.handsontable){
            excelDom.handsontable(config);
          } else {
            var ins = Handsontable(excelDom[0], config)
          }
          scope.$watch("source", function(n, o, s) {
            if(n) {
              excelDom.handsontable("loadData", n);
            }
          });
        });
      });
    }

    return directive;
  }]);
  /**
   * 更换编辑器
   */
  directives.initDirective("codeMirrorEditor", ["$timeout", "growl", "commonMethodService", function(timeout, growl, commonMethodService) {
    var directive = {};
    directive.scope = {
      ngModel: "=",
      options: "=",
      target: "=",
      show: "=",
      style: "=",
    };
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      scope.height = attr.height;
      /**
       * 替换编辑器ace以前的在下面注释着
       * @type {ace}
       */
      var code = $("<div></div>")
      var editor;
      $(element).append(code);
      code.css("position", "relative");
      code.css("width", "100%");
      if(scope.height) {
        code.css("height", scope.height);
      } else {
        code.css("height", "250px");
      }
      code.css("border", "1px solid #ddd");
      code.css("overflow", "auto");
      require(["ace/ace"], function(ace) {
        var completions = [{
          caption: 'target',
          value: 'target',
          metal: 'local'
        },{
          caption: 'event',
          value: 'event',
          metal: 'local'
        }];
        for (var key in commonMethodService.prototype) {
          completions.push({
            caption: key,
            value: key,
            metal: 'local'
          });
        };
        /*lnTools && typeof lnTools.addCompleter == "function" && lnTools.addCompleter({
          getCompletions: function (editor, session, pos, prefix, callback) {
            callback(null, completions);
          }
        });*/
        editor = ace.edit(code[0]);
        editor.session.setMode("ace/mode/html");
        editor.setTheme("ace/theme/tomorrow");
        // enable autocompletion and snippets
        editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true
        });
        editor.session.setMode("ace/mode/javascript");
        // insert someting
        if(scope.ngModel) {
          editor.insert(scope.ngModel);
        }
        editor.on("change", function(event) {
          scope.$apply(function() {
            scope.ngModel = editor.getValue();
          });
        });
      });

    }

    return directive;
  }]);

  directives.initDirective("codeMirror", ["$timeout", "growl", "keySet", "$rootScope", "commonMethodService", function(timeout, growl, keySet, rootScope, commonMethod) {
    var directive = {};
    directive.scope = {
      ngModel: "=",
      options: "=",
      target: "=",
      show: "=",
      config: "=",
      change: "&",
      open: "&",
      rootTarget: "="
    };
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      var editor;
      var btnGroup = $("<div></div>").addClass("input-group");
      var addOn = $("<div></div>").addClass("input-group-btn");
      var prevBtn = $("<button></button>")
        .addClass("btn btn-default")
        .text("预览");
      var editBtn = $("<button></button>")
        .addClass("btn btn-primary")
        .text("编辑");
      var copyBtn = $("<button></button>")
        .addClass("btn btn-default")
        .text("复制代码");
      var pasteBtn = $("<button></button>")
        .addClass("btn btn-default")
        .text("粘贴代码");
      var input = $("<input />")
        .addClass("form-control")
        .css("pointer-events", "none");
      copyBtn.on("click", function(event) {
      });
      if(scope.target) {
        scope.target.open = function() {
          editBtn.trigger("click");
        };
      };
      addOn.append(editBtn);
      /**
      if(scope.$attr("config/showCopy") != false) {
        addOn.append(copyBtn);
      }
      if(scope.$attr("config/showPaste") != false) {
        addOn.append(pasteBtn);
      }*/
      $(element).append(btnGroup);
      btnGroup.append(input);
      btnGroup.append(addOn);
      scope.$watch("ngModel", function(n, o, s) {
        if(n) {
          var val = objToString(n);
          input.val(val);
        }
      });
      scope.$watch("show", function(n, o, s) {
        if(n != undefined) {
          $(element).css("display", n ? "block" : "none");
        }
      });
      var popWrap, json;
      var createPop = function(type) {
        var val = objToString(scope.ngModel);
        var closeBtn = $("<button></button>");
        var applyBtn = $("<button></button>");
        var targetData;
        var error = $("<div></div>")
          .css("padding", "10px 40px")
          .css("color", "red")
          .css("display", "none")
          .text("代码输入错误！");
        var copyBtn = $("<button></button>")
          .addClass("btn btn-default")
          .text("复制代码");
        var pasteBtn = $("<button></button>")
          .addClass("btn btn-default")
          .text("粘贴代码");
        var btnGroup = $("<div></div>").addClass("btn-group btn-group-sm");
        var runBtn = $("<button></button>")
          .addClass("btn btn-primary")
          .text("运行");
        var resizeFn = function() {
          var width = echartContent.parent().parent().width() - 30;
          echartContent.width(width);
          if(typeof targetData.element.resize == "function") {
            targetData.element.resize();
          };
        };
        btnGroup.css("position", "absolute");
        btnGroup.css("right", "20px");
        btnGroup.css("top", "30px");
        btnGroup.css("z-index", 1);
        closeBtn.addClass("btn btn-default");
        closeBtn.text("关闭");
        applyBtn.addClass("btn btn-primary");
        applyBtn.text("应用(ctrl+o)");
        var tidyBtn = $("<button><i class='fa fa-align-left'></i>整理代码</button>").addClass("btn btn-primary");
        // 整理代码
        tidyBtn.click(function(){
          require(["jsToBeautify"], function(jsToBeautify) {
            var jtb =  jsToBeautify(scope.ngModel);
            editor.session.setValue("");
            editor.insert(jtb);
          })
        })
        btnGroup.append(tidyBtn);
        btnGroup.append(runBtn);
        /**
        btnGroup.append(copyBtn);
         */
        btnGroup.append(applyBtn);
        var pop = $("<div></div>")
          .css("position", "fixed")
          .css("z-index", 99999);
        var h = $("<div></div>")
          .text(type == "prev" ? "预览代码" : "编辑代码")
          .css("font-size", "16px")
          .css("line-height", "50px")
          .css("font-weight", "bold")
          .css("text-align", "center")
          .css("width", "100%");
        var text = $("<pre></pre>")
          .css("margin", "0px 10px");
        var line = $("<div></div>").css("height", "1px").css("width", "100%");
        var wrap = $("<div></div>")
          .css("width", "calc(100vw - 20px)")
          .css("height", "calc(100vh - 20px)")
          .css("position", "relative")
          .css("margin", "10px 10px 0 10px")
          .css("background-color", "#fff")
          .css("border", "1px solid #eee");
        var bg = $("<div></div>")
          .css("background-color", "rgba(0,0,0,.8)")
          .css("width", "100vw")
          .css("height", "100vh");
        var echartContent = $("<div id='echartContent' style='padding: 30px 20px 0; position:relative; overflow:hidden;'></div>");
        var rightContainer = $("<div></div>");
        var code = $("<div id='editor'></div>");
        code.css("width", "100%");
        code.css("height", "90%");
        code.css("border", "1px solid #ddd");
        text.text(val);
        pop.append(bg);
        bg.append(line);
        bg.append(btnGroup);
        bg.append(wrap);
        wrap.append(h);
        wrap.append(line);
        wrap.append(code);
        var createEditor = function(){
          require(["ace/ace"], function(ace) {
            var completions = [{
              caption: 'target',
              value: 'target',
              metal: 'local'
            },{
              caption: 'event',
              value: 'event',
              metal: 'local'
            }];
            for (var key in commonMethod.prototype) {
              completions.push({
                caption: key,
                value: key,
                metal: 'local'
              });
            };
//          lnTools.addCompleter({
//            getCompletions: function (editor, session, pos, prefix, callback) {
//              callback(null, completions);
//            }
//          });
            editor = ace.edit(code[0]);
            editor.session.setMode("ace/mode/html");
            editor.setTheme("ace/theme/tomorrow");
            // enable autocompletion and snippets
            editor.setOptions({
              enableBasicAutocompletion: true,
              enableSnippets: true,
              enableLiveAutocompletion: true
            });
            editor.on("change", function(event) {
              var json = editor.getValue();
              //growl.success("表达式编辑完成");
              $$.runExpression(json, function(event) {
                if(event.code == 0 || event.code == 1001) {
                  scope.$apply(function() {
                    scope.change();
                    scope.ngModel = editor.getValue();
                  });
                } else {
                  error.css("display", "block");
                }
              });
            });
            editor.session.setMode("ace/mode/javascript");
            // insert someting
            scope.ngModel = scope.ngModel || "";
            if(typeof scope.ngModel == "object") {
              editor.insert(JSON.stringify(scope.ngModel, null, 2));
            } else {
              editor.insert(scope.ngModel);
            }
          });
        };
        var render = function(){
          echartContent.width(width);
          $$.loadExternalJs(['../../toolkit/component/' + scope.rootTarget.type], function(preview) {
            var advance = scope.rootTarget.getAdvance();
            var style = scope.rootTarget.getStyle();
            var data = scope.rootTarget.getSource();
            var parameter = scope.rootTarget.getParameters();
            rightContainer.find('#echartContent').children().remove();
            var obj = new commonMethod({
              advance: advance.data,
              style: style.data,
              parameter: parameter.data,
              data: data.data
            });
            targetData = {
              element: obj
            };
            rightContainer.find('#echartContent').append(preview(targetData));
          })
        }
        var createRigthContent = function(){
          if(type == "prev") {
            wrap.append(text);
          } else {
            /**
             * 替换编辑器ace以前的在下面注释着
             * 右侧做一个预览图
             * 需求1.运行代码会变
             * 需求2.可以拖拽边沿缩放
             * @type {ace}
             */
            var resize = $("<div></div>");
            rightContainer.css({
              "width": "60%",
              "height": "calc(90% - 2px)",
              "background": "#f3f3f3",
              "z-index": "30",
              "position": "absolute",
              "right": "0",
              "top": "52px",
            });
            resize.css({
              "width": "2px",
              "height": "100%",
              "padding-top": "60px",
              "cursor": "col-resize",
              "background": "#ccc",
            });
            resize.append(echartContent);
            rightContainer.append(resize);
            wrap.append(rightContainer);
            /**
             * div可以边框是实现滑动
             */
            var oBox = rightContainer[0];
            var resize = resize[0];
            var width = echartContent.parent().parent().width() - 30;
            resize.onmousedown = function(ev) {
              var iEvent = ev || event;
              var dx = iEvent.clientX; //当你第一次单击的时候，存储x轴的坐标。
              var dw = oBox.offsetWidth; //存储默认的div的宽度。
              var disright = oBox.offsetLeft + oBox.offsetWidth; //存储默认div右边距离屏幕左边的距离。

              document.onmousemove = function(ev) {
                var iEvent = ev || event;
                oBox.style.width = dw - (iEvent.clientX - dx) + 'px';
                oBox.style.left = disright - oBox.offsetWidth + 'px';
                if(oBox.offsetWidth <= 400) {
                  oBox.style.width = "400px";
                  oBox.style.left = disright - oBox.offsetWidth + 'px'; //防止抖动
                } else {
                  resizeFn();
                }
              };
              document.onmouseup = function() {
                document.onmousedown = null;
                document.onmousemove = null;
              };
              render();
              return false;
            };
          }
        };

        keySet.onCommandKeyWith('o', function() {
          popWrap.remove();
        });
        keySet.onCommandKeyWith('enter.cm', function() {
          popWrap.remove();
        });
        applyBtn.on("click", function() {
          popWrap.remove();
        });
        closeBtn.on("click", function() {
          popWrap.remove();
        });
        /**
         * 点击运行按钮运行echart图
         * 获取右边区域的宽度和高度
         * 拖动边框大小echart跟着变动
         * 页面加载进来echart加载成功
         */
        runBtn.on("click", render);
        setTimeout(function() {
          if(scope.rootTarget){
            createRigthContent();
          }
          createEditor();
        });
        return pop
      }
      prevBtn.on("click", function(event) {
        popWrap = createPop("prev");
        $("body").prepend(popWrap);
      });
      editBtn.on("click", function(event) {
        popWrap = createPop("edit");
        $("body").prepend(popWrap);
      });
    }

    return directive;
  }])
  directives.initDirective("kpiSelector", ["$timeout", "growl", function(timeout, growl) {
    var directive = {};
    directive.scope = {
      ngModel: "=",
      options: "=",
      target: "=",
      show: "=",
      config: "="
    };
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      timeout(function() {
        var createHeader = function(item) {
          var divRow = $("<div></div>");
          var colLeft = $("<div></div>");
          var colRight = $("<div></div>");
          var bottom = $("<div></div>");
          bottom.css("height", "1px");
          bottom.css("clear", "both");
          colLeft.text("变量名");
          colLeft.css("width", "50px");
          colLeft.css("float", "left");
          colLeft.css("text-align", "center");
          colLeft.css("line-height", "30px");
          colLeft.css("background-color", "#eee");
          colLeft.css("padding", "2px");
          colRight.css("width", "calc(100% - 50px)");
          colRight.css("float", "left");
          colRight.css("line-height", "30px");
          colRight.text("对应KPI指标");
          colRight.css("text-align", "center");
          colRight.css("background-color", "#eee");
          colRight.css("padding", "2px");
          divRow.append(colLeft);
          divRow.append(colRight);
          divRow.append(bottom);
          return divRow
        };
        var table = $("<div></div>");
        var content = $("<div></div>");
        table.css("width", "100%");
        table.css("border", "1px solid #ddd");
        table.append(createHeader());
        table.append(content);
        $(element).append(table);
        var createPop = function() {
          content.children().remove();
          var createRow = function(attr, item) {
            var divRow = $("<div></div>");
            var colLeft = $("<div></div>");
            var colRight = $("<div></div>");
            var select = $("<select></select>");
            var createEmpty = function(op) {
              var option = $("<option></option>");
              option.text("--请选择--");
              option.attr("value", 0);
              return option;
            };
            var createOption = function(op) {
              var option = $("<option></option>");
              option.text(op.label);
              option.attr("value", op.id);
              return option;
            };
            if(!item) {
              select.append(createEmpty());
            };
            for(var j in scope.options) {
              select.append(createOption(scope.options[j]));
            };
            var bottom = $("<div></div>");
            bottom.css("height", "1px");
            bottom.css("clear", "both");
            select.addClass("form-control");
            select.attr("id", "kpi_" + item.id);
            colLeft.text(attr);
            colLeft.css("width", "50px");
            colLeft.css("float", "left");
            colLeft.css("text-align", "center");
            colLeft.css("line-height", "30px");
            colLeft.css("padding", "2px");
            colRight.css("width", "calc(100% - 50px)");
            colRight.css("float", "left");
            colRight.css("padding", "2px");
            colRight.append(select);
            divRow.append(colLeft);
            divRow.append(colRight);
            divRow.append(bottom);
            if(item) {
              select.val(item);
            }
            select.on("change", function(event) {
              var find = select.find("option[value=0]");
              find.remove();
              scope.$apply(function() {
                scope.ngModel[attr] = $(event.target).val();
              });
            });
            return divRow
          };
          for(var i in scope.ngModel) {
            content.append(createRow(i, scope.ngModel[i]));
          };
        };
        scope.$watch("ngModel", function(n, o, s) {
          table.append(createPop());
        });
        scope.$watch("options", function(n, o, s) {
          table.append(createPop());
        });
      });
    }

    return directive;
  }]);
  directives.initDirective("exceloneline", ["$timeout", function(timeout) {
    var directive = {};
    directive.scope = {
      ngModel: "="
    };
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      var excelDom = $("<div></div>");
      timeout(function() {
        element.append(excelDom);
        $(element).css("overflow", "auto");
        $(element).css("margin", "5px auto");
        $(element).css("height", "100px");
        $(element).css("background-color", "#eee");
        $$.loadExternalJs(["Handsontable"], function(ht) {
         // window.Handsontable = ht;
          var config = {
            data: [scope.ngModel],
            rowHeaders: true,
            colHeaders: true,
            manualColumnResize: true,
            manualRowResize: true,
            minSpareCols: 1,
            maxRows: 1
          }
          if(excelDom.handsontable){
            excelDom.handsontable(config);
          } else {
            var ins = Handsontable(excelDom[0], config)
          }
        });
      });
    }

    return directive;
  }]);
  directives.initDirective("cronGen", ["$timeout", function(timeout) {
    var directive = {};
    directive.scope = {
      ngModel: "=",
      options: "=",
      target: "=",
      show: "=",
      config: "="
    };
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      var editor;
      var btnGroup = $("<div></div>").addClass("input-group");
      var addOn = $("<div></div>").addClass("input-group-btn");
      var prevBtn = $("<button></button>")
        .addClass("btn btn-default")
        .text("预览");
      var editBtn = $("<button></button>")
        .addClass("btn btn-primary")
        .text("编辑");
      var copyBtn = $("<button></button>")
        .addClass("btn btn-default")
        .text("复制代码");
      var pasteBtn = $("<button></button>")
        .addClass("btn btn-default")
        .text("粘贴代码");
      var input = $("<input />")
        .addClass("form-control")
        .css("pointer-events", "none");
      copyBtn.on("click", function(event) {
      });
      addOn.append(editBtn);
      $(element).append(btnGroup);
      btnGroup.append(input);
      btnGroup.append(addOn);
      scope.$watch("ngModel", function(n, o, s) {
        if(n) {
          var val = objToString(n);
          input.val(val);
        }
      });
      scope.$watch("show", function(n, o, s) {
        if(n != undefined) {
          $(element).css("display", n ? "block" : "none");
        }
      });
      var popWrap;
      var createPop = function(type) {
        var val = objToString(scope.ngModel);
        var code = $("<div></div>")
        var closeBtn = $("<button></button>");
        var applyBtn = $("<button></button>");
        var btnGroup = $("<div></div>").addClass("btn-group btn-group-sm");
        btnGroup.css("position", "absolute");
        btnGroup.css("right", "27px");
        btnGroup.css("top", "20px");
        btnGroup.css("z-index", 1);
        closeBtn.addClass("btn btn-default");
        closeBtn.text("关闭");
        applyBtn.addClass("btn btn-primary");
        applyBtn.text("应用");
        btnGroup.append(applyBtn);
        var pop = $("<div></div>")
          .css("position", "fixed")
          .css("z-index", 99999);
        var h = $("<div></div>")
          .text("编辑CRON表达式")
          .css("font-size", "16px")
          .css("line-height", "50px")
          .css("font-weight", "bold")
          .css("text-align", "center")
          .css("width", "100%");
        var text = $("<pre></pre>")
          .css("margin", "0px 10px");
        var line = $("<div></div>").css("height", "1px").css("width", "100%");
        var wrap = $("<div></div>")
          .css("width", "980px")
          .css("height", "750px")
          .css("position", "relative")
          .css("margin", "10px auto")
          .css("background-color", "#eee")
          .css("border", "1px solid #fff")
          .css("border-radius", "3px");
        var bg = $("<div></div>")
          .css("background-color", "rgba(0,0,0,.8)")
          .css("width", "100vw")
          .css("height", "100vh");
        text.text(val);
        pop.append(bg);
        bg.append(line);
        bg.append(wrap);
        wrap.append(btnGroup);
        wrap.append(h);
        wrap.append(line);
        if(type == "prev") {
          wrap.append(text);
        } else {
          wrap.append(code);
          timeout(function() {
            var requires = ['cronGen'];
            code.css("position", "relative");
            code.css("width", "100%");
            code.css("border", "1px solid #ddd");
            code.css("overflow", "auto");
            $$.loadExternalJs(requires, function() {
              var init = function() {
                code.cronGen({
                  value: scope.ngModel,
                  change: function(event) {
                    scope.$apply(function() {
                      scope.ngModel = event.value;
                    })
                  }
                });
              };
              init();
            });
          });
        }
        applyBtn.on("click", function() {
          popWrap.remove();
        });
        closeBtn.on("click", function() {
          popWrap.remove();
        });
        return pop
      };
      prevBtn.on("click", function(event) {
        popWrap = createPop("prev");
        $("body").prepend(popWrap);
      });
      editBtn.on("click", function(event) {
        popWrap = createPop("edit");
        $("body").prepend(popWrap);
      });
    }

    return directive;
  }]);
  directives.initDirective("numberInput", ["$timeout", function(timeout) {
    var directive = {};
    directive.scope = {
      "ngModel": "=",
      "ngMaxlength": "=",
      "numberInput": "="
    };
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      timeout(function() {
        var numberMax = scope.numberInput;
        $(element).on({
          "keydown": function(event) {
            var keyCode = event.keyCode;
            if(((keyCode < 37) && (keyCode != 8) && (keyCode != 9)) || ((keyCode > 40) && (keyCode < 48)) || ((keyCode > 57) && (keyCode < 96)) || (keyCode > 105)) {
              event.preventDefault();
            }
            if(numberMax > 0) {
              if($(element).val().length > numberMax) {
                event.preventDefault();
              }
            }
          },
          "change": function(event) {
            if(numberMax > 0) {
              if($(element).val().length > numberMax) {
                $(element).val($(element).val().slice(0, numberMax));
              }
            }
          }
        });
      });
    }

    return directive;
  }]);
  directives.initDirective("colorPicker", ["$timeout", function(timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      ngModel: "=",
      change: "&"
    };
    directive.link = function(scope, element, attr) {
      if($(element).spectrum == undefined) {
        require(['spectrum'], function() {
          run();
        });
      } else {
        run();
      }

      function run() {
        scope.$watch("ngModel", function(n, o, s) {
          if(n) {
            $(element).spectrum("set", n);
          }
        });
        $(element).spectrum({
          allowEmpty: true,
          showPalette: true,
          showInput: true,
          hideAfterPaletteSelect: true,
          color: null,
          change: function(color) {
            var colorCode;
            if(color != null) {
              colorCode = color.toRgbString();
              $(".block.active").css("background-color", colorCode);
              $(".block.active").css("border-color", colorCode);
            } else {
              colorCode = color;
            }
            scope.$apply(function() {
              scope.ngModel = colorCode;
            });
          },
          palette: [
            [null, "#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
            ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
            ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
            ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
            ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
            ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
            ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
            ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
          ]
        });
      }
    };
    return directive;
  }]);
  directives.initDirective("numberMax", ["$timeout", function(timeout) {
    var directive = {};
    directive.scope = {};
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      var nmax = $$.switchToNumber(attr['numberMax']);
      if(nmax > 0) {
        timeout(function() {
          $(element).on({
            "keydown": function(event) {
              var keyCode = event.keyCode;
              if($(element).val().length > nmax) {
                if((keyCode >= 48 && keyCode < 57) || (keyCode >= 65 && keyCode < 90) || (keyCode >= 96 && keyCode < 117)) {
                  event.preventDefault();
                }
              }
            },
            "change": function(event) {
              if($(element).val().length > nmax) {
                $(element).val($(element).val().slice(0, nmax));
              }
              scope.ngModel = $(element).val().slice(0, nmax);
            }
          });
        });
      }
    }

    return directive;
  }]);
  directives.initDirective("scrollableDiv", ["$timeout", function(timeout) {
    var directive = {};
    directive.scope = {};
    directive.template =
      "<div class='scrollable-div'>" +
      "<div class='scrollable-div-wrap'>" +
      "<div class='scrollable-div-scroll-x'></div>" +
      "<div class='scrollable-div-scroll-y'>" +
      "<div class='scrollable-div-handler'></div>" +
      "</div>" +
      "</div>" +
      "<div class='scrollable-div-wrap-content'>" +
      "<div ng-transclude class='scrollable-div-content'></div>" +
      "</div>" +
      "</div>"
    directive.transclude = true;
    directive.restrict = "A";
    directive.link = link;

    function link(scope, element, attr) {
      var height, contentHeight, innerHeight, scrollTop, handleTop;
      timeout(run);
      $(window).on("resize", run);

      function run() {
        scrollTop = $(element).find(".scrollable-div-wrap-content").scrollTop();
        height = $(element).parent().height();
        contentHeight = $(element).find('.scrollable-div-content').height();
        $(element).find(".scrollable-div").css("height", height);
        if(contentHeight > height) {
          innerHeight = height * height / contentHeight;
          handleTop = scrollTop / (contentHeight - height) * (height - innerHeight);
          $(element).find(".scrollable-div-handler")
            .css({
              height: innerHeight,
              top: handleTop
            });
          $(element).find(".scrollable-div-handler").draggable({
            containment: $(element).find(".scrollable-div-scroll-y"),
            axis: "y",
            cursor: "pointer",
            drag: stopEvent
          });
        } else {
          $(element).find(".scrollable-div-scroll-y").css("display", "none");
        }
      }

      function stopEvent(event, ui) {
        var parentTop = $(element).offset().top;
        var top = ui.offset.top;
        var totalHeight = height - innerHeight;
        var pos = top - parentTop;
        $(element)
          .find(".scrollable-div-wrap-content")
          .css("overflow", "scroll")
          .scrollTop((contentHeight - height) * (pos / totalHeight))
          .css("overflow", "hidden");
      }
    }

    return directive;
  }]);
})