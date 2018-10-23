define(['directives/directives'], function(directives){
  'use strict';
  var chinaJSON, worldJSON;
  if(typeof directives.registerDirective == "function") {
    directives.registerDirective("gridSelector", freeBoardDir);
  } else {
    directives.directive('gridSelector', freeBoardDir);
  }
  freeBoardDir.$inject = ['$q', '$timeout', '$compile', 'serviceCenterService'];
  function freeBoardDir(q, timeout, compile, serviceCenterService){
    var directive = {};
    directive.scope = {
      change : "&",
      selector : "="
    };
    directive.restrict = "A";
    directive.link = function(scope, element){
      var pointers;
      scope.$watch("selector", function(n, o, s){
        if(n) {
          n.setValue = function(value) {
            var val = -1;
            for(var i = 0; i < 11; i++)
            {
              var pointer = pointers.find("#pointer_" + i);
              pointer.css("opacity", "0");
            }
            for(var j in value)
            {
              val += value[j];
              if(val < 12)
              {
                var pointer = pointers.find("#pointer_" + val);
                pointer.css("opacity", "1");
              }
            }
            onChange();
          }
        }
        function onChange() {
          var result = [], step = 1;
          $(document).off("mouseup.freeboard");
          for(var l = 0; l < 11; l++)
          {
            (function(index){
              if(pointers.find("#pointer_" + index).css("opacity") == "1")
              {
                result.push(step);
                step = 1;
              }
              else
              {
                step++;
              }
            })(l)
          }
          result.push(step);
          scope.change({
            cols : result,
            reset : false
          });
        }
      });
      timeout(ready);
      function ready(){
        var cache = [], status;
        var wrap = $("<div class='wrap'></div>");
        pointers = $("<div class='pointers'></div>");
        var actives = $("<div class='actives'></div>");
        $(element).append(actives);
        $(element).append(pointers);
        $(element).append(wrap);
        $(element)[0].ondragstart = function() {
          return false;
        };
        for(var i = 0; i < 12; i++) {
          wrap.append($("<div class='block'></div>"));
        }
        for(var j = 0; j < 11; j++) {
          (function(index){
            pointers.append($("<div id='pointer_" + index + "' class='pointer'></div>"))
          })(j);
        }
        for(var k = 0; k < 11; k++) {
          (function(index){
            var active = $("<div id='active_" + index + "' class='active'></div>");
            actives.append(active);
            active.on({
              mousedown : function(event){
                mousedown(index);
              },
              mouseover : function(event){
                mouseover(index);
              }
            });
          })(k);
        }
        function mouseover(index){
          if(status == "MOUSEDOWN") {
            var find = pointers.find("#pointer_" + index);
            for(var i = 0; i < 11; i++) {
              var pointer = pointers.find("#pointer_" + i);
              if(cache.indexOf(i) == -1) {
                pointer.css("opacity", "0");
              }
            }
            find.css("opacity", "1");
          }
        }
        function mousedown(index){
          status = "MOUSEDOWN";
          var find = pointers.find("#pointer_" + index);
          var active = actives.find("#active_" + index);
          if(find.css("opacity") == "0") {
            $(document).off("mouseup.freeboard_click")
            $(document).on("mouseup.freeboard", mouseup);
          } else {
            timeout(function(){
              $(document).off("mouseup.freeboard_click")
              $(document).on("mouseup.freeboard", mouseup);
            }, 400)
            $(document).off("mouseup.freeboard")
            $(document).on("mouseup.freeboard_click", function(){
              mouseclick(index)
            });
          }

          find.css("opacity", "1");
          cache = [];
          for(var j = 0; j < 11; j++) {
            (function(inx){
              if(pointers.find("#pointer_" + inx).css("opacity") == 1) {
                if(index != inx) {
                  cache.push(inx)
                }
              }
            })(j);
          }
        }
        function mouseclick(index) {
          var find = pointers.find("#pointer_" + index);
          status = undefined;
          if(find.css("opacity") == 0) {
            find.css("opacity", 1);
          } else {
            find.css("opacity", 0);
          }
          onChange();
        }
        function mouseup(){
          onChange();
        }
        function onChange()
        {
          var result = [], step = 1;
          status = undefined;
          $(document).off("mouseup.freeboard");
          for(var l = 0; l < 11; l++) {
            (function(index){
              if(pointers.find("#pointer_" + index).css("opacity") == "1") {
                result.push(step);
                step = 1;
              } else {
                step++;
              }
            })(l)
          }
          result.push(step);
          scope.$apply(function(){
            scope.change({
              cols : result,
              reset : true
            });
          });
        }
      }
    };
    return directive;
  }
  if(typeof  directives.registerDirective == "function") {
    directives.registerDirective('boardDrag', boardDrag_directive);
  } else {
    directives.directive('boardDrag', boardDrag_directive);
  }
  boardDrag_directive.$inject = ['$timeout', 'toolbarListService']
  function boardDrag_directive(timeout, toolbarListService) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      drag : "=",
      handle : "="
    };
    directive.link = function(scope, element, attr){
      var config = {
        cursor : 'move',
        revert : true,
        appendTo : 'body',
        scroll : false,
        containment : $("body"),
        helper : function(ui){
          var find, result;
          if($(this).attr("id") == 'add_grid') {
            result = $(
              "<div class='colDrag row'>" +
              "<div class='col-xs-12'>" +
              "<div class='row title'>" +
              "创建一个栅格" +
              "</div>" +
              "<div class='row' id='grid'>" +
              "</div>" +
              "</div>" +
              "</div>");
            for(var i in scope.drag) {
              var col = $("<div class='col-xs-" + scope.drag[i].col + "'><div class='block'>" + parseInt(scope.drag[i].col / 12 * 100) + "%" + "</div></div>");
              result.find("#grid").append(col);
            }
          } else {
            var ri = renderItem($(this));
            result = ri(toolbarListService);
          }
          function renderItem(dom) {
            var itemDom = dom;
            return function(data) {
              var rs = $(
                "<div class='colDrag row'>" +
                "<div class='col-xs-12'>" +
                "<div class='row title'>" +
                "创建自定义组件" +
                "</div>" +
                "<div class='row' id='grid'>" +
                "</div>" +
                "</div>" +
                "</div>");
              rs.find("#grid").append($("<div class='col-xs-12'><div class='block'>创建自定义组件</div></div>"));
              traverse(data);
              function traverse(target) {
                for(var i in target) {
                  if(target[i].sub) {
                    traverse(target[i].sub)
                  } else {
                    if(("add_" + target[i].type) == dom.attr("id")) {
                      (function(elem){
                        rs = $(
                          "<div class='colDrag row'>" +
                          "<div class='col-xs-12'>" +
                          "<div class='row title'>" +
                          "创建" + elem.label +
                          "</div>" +
                          "<div class='row' id='grid'>" +
                          "</div>" +
                          "</div>" +
                          "</div>");
                        rs.find("#grid").append($("<div class='col-xs-12'><div class='block'>创建" + elem.label + "</div></div>"));
                      })(target[i])
                    }
                  }
                }
              }
              return rs
            }
          }
          return result;
        },
        revertDuration : 0,
        zIndex : 9999999,
      }
      if(scope.handle != false)
      {
        config.handle = $(element).find(".moveBtn")
      }
      $(element).draggable(config);
    };
    return directive;
  }
  if(typeof  directives.registerDirective == "function") {
    directives.registerDirective('textRepresent', textRepresent_directive);
  }
  else {
    directives.directive('textRepresent', textRepresent_directive);
  }
  textRepresent_directive.$inject = ['$timeout'];
  function textRepresent_directive(timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      input : "="
    };
    directive.link = function(scope, element, attr){
      timeout(function(){
        resize();
      });
      $(window).on("resize", function(){
        resize();
      });
      function resize(){
        var width = $(element).parent().width();
        var result = '', w = 0;
        for(var i in scope.input) {
          var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
          var char = scope.input[i];
          if(reg.test(char)) {
            w += 6;
          } else {
            w += 12;
          }
          if(w > width) {
            break;
          } else {
            result += char;
          }
        };
        if(i < scope.input.length - 1) {
          result += "...";
        }
        $(element).val(result)
      }
    };
    return directive;
  }
  if(typeof directives.registerDirective == "function") {
    directives.registerDirective('iconSelector', iconPicker_directive);
  } else {
    directives.directive('iconSelector', iconPicker_directive);
  }
  iconPicker_directive.$inject = ['$timeout']
  function iconPicker_directive(timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      ngModel : "=",
      target : "=",
      change : "&"
    };
    directive.link = function(scope, element, attr){
      scope.$watch("ngModel", function(n, o, s){
        if(n) {
          $(element).find("#icon_" + n.id).addClass("active");
          var find = scope.target.find(function(elem){
            return elem.$name == "bgcolor";
          })
          if(find) {
            $(element).find("#icon_" + n.id).css("background-color", find.value);
            $(element).find("#icon_" + n.id).css("border-color", find.value);
          }
        }
      });

        function getJSON(url, param, callback){
            var xmlhttp = new XMLHttpRequest();
            param = JSON.stringify(param);
            xmlhttp.onreadystatechange = state_Change;
            xmlhttp.withCredentials = true;
            xmlhttp.open("GET",url,true);
            xmlhttp.send(param);
            function state_Change(){
                if(xmlhttp.readyState == 4){
                    if(xmlhttp.status == 200){
                        var json = JSON.parse(xmlhttp.responseText);
                        callback(json);
                    }
                };
            }
        }



      var icons = [{
        perfix : "",
        css : ''
      },{
        perfix : "ion",
        css : 'ion-ios-gear-outline'
      },{
        perfix : "fa",
        css : 'fa-connectdevelop'
      },{
        perfix : "fa",
        css : 'fa-warning'
      },{
        perfix : "fa",
        css : 'fa-edit'
      },{
        perfix : "fa",
        css : 'fa-birthday-cake'
      },{
        perfix : "fa",
        css : 'fa-user'
      },{
        perfix : "fa",
        css : 'fa-envelope-o'
      },{
        perfix : "fa",
        css : 'fa-file-code-o'
      },{
        perfix : "fa",
        css : 'fa-clock-o'
      },{
        perfix : "fa",
        css : 'fa-warning'
      }
      // ,{
      //   perfix : "proudsmart",
      //   css : 'ps-align-center'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-align-left'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-arrow-down'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-arrow-up'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-add'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-address'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-air-humidity'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-air-temperature'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-align-bottom'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-align-middle'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-align-right'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-align-top'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-app'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-back-01'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-back'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-battery'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-beixunpanjilu'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-business-change'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-camera'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-center'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-certificate'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-chart-brokenline'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-co2'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-collection-point'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-copy'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-copyright'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-court-announcement'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-court-ruling'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-current-production_p'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-current-production'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-customer'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-daily-output'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-delete-02'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-delete'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-domain'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-download'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-duration'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-dust'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-edit'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-electric-motor'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-electric-motor02'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-email'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-equipment-number'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-estimated-output'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-excel'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-exclamation'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-exit'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-expense-center'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-fail'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-fan'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-fax'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-focus'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-gis'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-gongdanguanli'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-group'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-guzhangfenxi'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-help'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-horizontal-distribution'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-information'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-irrigation'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-item-number'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-kehufuwu'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-layer-down'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-layer-up'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-link'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-linked-data'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-login'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-management'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-market'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-message'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-more'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-move'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-mushroom'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-nav_icon_01'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-nav_icon_02'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-nav_icon_03'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-nav_icon_04'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-nav_icon_05'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-nav_icon_06'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-nav_icon_07'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-nav_icon_08'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-nav_icon_09'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-nav_icon_10'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-nav_icon_11'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-nav_icon_12'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-negative'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-neutral'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-number'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-pai_logo'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-patent'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-pattern'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-pay'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-pdf'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-peizhiguanli'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-phone'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-planting'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-positive'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-publish'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-qiyerongyu'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-qiyexinxi'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-qq'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-qqspace'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-recommend'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-renewal'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-review'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-safety'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-sandglass'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-save'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-search'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-sequence'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-server'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-shebeigaojing'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-shebeiguanli'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-shebeijiance'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-shebeimuban'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-smoke-no'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-smoke-yes'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-software-copyright'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-soil-humidity'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-soil-temperature'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-spraying'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-success'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-sunshine'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-system'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-task'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-team'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-tianjiaanli'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-time'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-tongjifenxi'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-top'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-trademark'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-unlink'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-upload-02'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-upload'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-user'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-userinfo'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-vertical-distribution'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-video-camera'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-video'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-water-no'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-water-yes'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-water'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-web'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-website'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-weibaofuwu'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-weibo'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-weixin'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-wodefangan'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-wodeqiye'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-wodexunpanjilu'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-xitongxiaoxi'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-xunpanxiaoxi'
      // },{
      //   perfix : "proudsmart",
      //   css : 'ps-yunyingshouye'
      // },{
      //     perfix : "proudsmart",
      //     css : 'ps-sl_wind'
      // }
      ];

      var loop = function(index,elem){
        elem.id = index;
        var block = $("<div id='icon_" + index + "' class='block'></div>");
        var icon = $("<div class='" + elem.perfix + " " + elem.css + "'></div>");
        block.append(icon);
        $(element).append(block);
        var click = function(event){
          var apply = function(){
            $(element).find(".block").removeAttr("style");
            $(element).find(".active").removeClass("active");
            $(event.currentTarget).addClass("active");
            $(event.currentTarget).css("background-color", $("input[color-picker]").val());
            $(event.currentTarget).css("border-color", $("input[color-picker]").val());
            console.log(elem);
            scope.ngModel = elem;
            scope.change();
          };
          scope.$apply(apply);
        }
        block.on("click", click);
      };

      getJSON("../localdb/bootstrapIcon.json",null,function (json) {
          // console.log("json++++++++++++++",json)
          json.map(function (e) {
              var str = e.split(" ");
              icons.push({
                  perfix : str[0],
                  css : str[1]
              })
          })

          for(var i in icons) {
              loop(i, icons[i])
          }
      })

    };
    return directive;
  }
  if(typeof  directives.registerDirective == "function") {
    directives.registerDirective("fbSlider", fbSliderDir);
  } else {
    directives.directive('fbSlider', fbSliderDir);
  }
  fbSliderDir.$inject = ['$q', '$timeout'];
  function fbSliderDir(q, timeout){
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      range : "=",
      ngModel : "=",
      min : "=",
      max : "=",
      step : "=",
      unit : "="
    };
    var oldvalues;
    directive.link = function(scope, element, attr){
      timeout(function(){
        scope.$watch("ngModel", function(n, o, s){
          if(n){
            if(n instanceof Array)
            {
              $(element).slider( "values", n);
            }
            else
            {
              $(element).slider( "value", n);
            }
          }
        });
        $(element).slider({
          step : scope.step ? parseInt(scope.step) : 1,
          min : scope.min ? scope.min : 0,
          max : scope.max ? scope.max : 100,
          range: (scope.range ? scope.range : false),
          start : function(event, ui){
            oldvalues = ui.values;
          },
          slide : function(event, ui){
            scope.$apply(function(){
              if(scope.ngModel instanceof Array) {
                if(ui.values[0] != ui.values[1]) {
                  scope.ngModel = ui.values;
                } else {
                  if(ui.values[0] == oldvalues[0]) {
                    timeout(function(){
                      $(element).slider( "values", [ui.values[0], ui.values[0] + 1]);
                      scope.ngModel = [ui.values[0], ui.values[0] + 1];
                    },0);
                  } else if(ui.values[1] == oldvalues[1]) {
                    timeout(function(){
                      $(element).slider( "values", [ui.values[1] - 1, ui.values[1]]);
                      scope.ngModel = [ui.values[1] - 1, ui.values[1]];
                    },0);
                  }
                }
              } else {
                scope.ngModel = ui.value;
              }
            });
          },
          stop : function(event, ui){
            scope.$apply(function(){
              if(scope.ngModel instanceof Array) {
                if(ui.values[0] != ui.values[1]) {
                  scope.ngModel = ui.values;
                } else {
                  if(ui.values[0] == oldvalues[0]) {
                    $(element).slider( "values", [ui.values[0], ui.values[0] + 1]);
                    scope.ngModel = [ui.values[0], ui.values[0] + 1];
                  } else if(ui.values[1] == oldvalues[1]) {
                    $(element).slider( "values", [ui.values[1] - 1, ui.values[1]]);
                    scope.ngModel = [ui.values[1] - 1, ui.values[1]];
                  }
                }
              } else {
                scope.ngModel = ui.value;
              }
            });
          }
        });
      });
    };
    return directive;
  }
  if(typeof directives.registerDirective == "function") {
    directives.registerDirective('boardDrop', boardDrop_directive);
  } else {
    directives.directive('boardDrop', boardDrop_directive);
  }
  boardDrop_directive.$inject = ['$q', '$timeout', 'serviceCenterService', '$route', '$routeParams', 'chartOptionService', 'resourceUIService', 'ticketTaskService', '$window', "$location", "Info", "growl", "alertService", "angular-style"];
  function boardDrop_directive(q, timeout, serviceCenterService, route, routeParams, chartOptionService, resourceUIService, ticketTaskService, window, location, Info, growl, alertService, angularStyle) {
    var directive = {}, echarts, echartsall;
    directive.restrict = "A";
    directive.scope = {
      edit : "=",
      drop : "=",
      onDelete : "&",
      onCut : "&",
      onCopy : "&",
      onInsert : "&",
      onPaste : "&",
      onSetting : "&",
      onDataChange : "&",
      onDrop : "&",
      onTabClick : "&",
      instance : "=",
      onInsertjson : "&",
      onPastejson : "&"
    };
    directive.link = function(scope, element, attr){
      scope.$watch("instance", function(n, o, s){
        if(n){
          if(typeof n.addEvents == "function"){
            n.addEvents({
              wholeJSON : scope.wholeJSON,
              onDelete : scope.onDelete,
              onCut : scope.onCut,
              onCopy : scope.onCopy,
              onInsert : scope.onInsert,
              onPaste : scope.onPaste,
              onSetting : scope.onSetting,
              onDataChange : scope.onDataChange,
              onDrop : scope.onDrop,
              onInsertJSON : scope.onInsertjson,
              onPasteJSON : scope.onPastejson,
              onTabClick : scope.onTabClick
            })
          }
        }
      });
    };
    return directive;
  }
  if(typeof directives.registerDirective == "function") {
    directives.registerDirective('fBoard', fboard_directive);
  } else {
    directives.directive('fBoard', fboard_directive);
  }
  fboard_directive.$inject = ['freeboardBaseService'];
  function fboard_directive(freeboardBaseService) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      instance : "=",
    };
    directive.link = function(scope, element, attr){
      var unbind = scope.$watch("instance", function(n, o, s){
        if(n){
          scope.instance = freeboardBaseService($(element));
          scope.instance.b = 1;
          unbind();
        }
      });
    };
    return directive;
  }
});