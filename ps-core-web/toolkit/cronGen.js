function btnFan() {
  var txt = $("#cron").val();
  if (txt) {
    var regs = txt.split(" ");
    $("input[name=v_second]").val(regs[0]);
    $("input[name=v_min]").val(regs[1]);
    $("input[name=v_hour]").val(regs[2]);
    $("input[name=v_day]").val(regs[3]);
    $("input[name=v_mouth]").val(regs[4]);
    $("input[name=v_week]").val(regs[5]);
    initObj(regs[0], "second");
    initObj(regs[1], "min");
    initObj(regs[2], "hour");
    initDay(regs[3]);
    initMonth(regs[4]);
    initWeek(regs[5]);
    if (regs.length > 6) {
      $("input[name=v_year]").val(regs[6]);
      initYear(regs[6])
    }
  }
}

function initObj(strVal, strid) {
  var ary = null;
  var objRadio = $("input[name='" + strid + "'");
  if (strVal == "*") {
    objRadio.eq(0).attr("checked", "checked")
  } else {
    if (strVal.split("-").length > 1) {
      ary = strVal.split("-");
      objRadio.eq(1).attr("checked", "checked");
      $("#" + strid + "Start_0").val(ary[0]);
      $("#" + strid + "End_0").val(ary[1])
    } else {
      if (strVal.split("/").length > 1) {
        ary = strVal.split("/");
        objRadio.eq(2).attr("checked", "checked");
        $("#" + strid + "Start_1").val(ary[0]);
        $("#" + strid + "End_1").val(ary[1])
      } else {
        objRadio.eq(3).attr("checked", "checked");
        if (strVal != "?") {
          ary = strVal.split(",");
          for (var i = 0; i < ary.length; i++) {
            $("." + strid + "List input[value='" + ary[i] + "']").attr("checked", "checked")
          }
        }
      }
    }
  }
}

function initDay(strVal) {
  var ary = null;
  var objRadio = $("input[name='day'");
  if (strVal == "*") {
    objRadio.eq(0).attr("checked", "checked")
  } else {
    if (strVal == "?") {
      objRadio.eq(1).attr("checked", "checked")
    } else {
      if (strVal.split("-").length > 1) {
        ary = strVal.split("-");
        objRadio.eq(2).attr("checked", "checked");
        $("#dayStart_0").val(ary[0]);
        $("#dayEnd_0").val(ary[1])
      } else {
        if (strVal.split("/").length > 1) {
          ary = strVal.split("/");
          objRadio.eq(3).attr("checked", "checked");
          $("#dayStart_1").val(ary[0]);
          $("#dayEnd_1").val(ary[1])
        } else {
          if (strVal.split("W").length > 1) {
            ary = strVal.split("W");
            objRadio.eq(4).attr("checked", "checked");
            $("#dayStart_2").val(ary[0])
          } else {
            if (strVal == "L") {
              objRadio.eq(5).attr("checked", "checked")
            } else {
              objRadio.eq(6).attr("checked", "checked");
              ary = strVal.split(",");
              for (var i = 0; i < ary.length; i++) {
                $(".dayList input[value='" + ary[i] + "']").attr("checked", "checked")
              }
            }
          }
        }
      }
    }
  }
}

function initMonth(strVal) {
  var ary = null;
  var objRadio = $("input[name='mouth'");
  if (strVal == "*") {
    objRadio.eq(0).attr("checked", "checked")
  } else {
    if (strVal == "?") {
      objRadio.eq(1).attr("checked", "checked")
    } else {
      if (strVal.split("-").length > 1) {
        ary = strVal.split("-");
        objRadio.eq(2).attr("checked", "checked");
        $("#mouthStart_0").val(ary[0]);
        $("#mouthEnd_0").val(ary[1])
      } else {
        if (strVal.split("/").length > 1) {
          ary = strVal.split("/");
          objRadio.eq(3).attr("checked", "checked");
          $("#mouthStart_1").val(ary[0]);
          $("#mouthEnd_1").val(ary[1])
        } else {
          objRadio.eq(4).attr("checked", "checked");
          ary = strVal.split(",");
          for (var i = 0; i < ary.length; i++) {
            $(".mouthList input[value='" + ary[i] + "']").attr("checked", "checked")
          }
        }
      }
    }
  }
}

function initWeek(strVal) {
  var ary = null;
  var objRadio = $("input[name='week'");
  if (strVal == "*") {
    objRadio.eq(0).attr("checked", "checked")
  } else {
    if (strVal == "?") {
      objRadio.eq(1).attr("checked", "checked")
    } else {
      if (strVal.split("/").length > 1) {
        ary = strVal.split("/");
        objRadio.eq(2).attr("checked", "checked");
        $("#weekStart_0").val(ary[0]);
        $("#weekEnd_0").val(ary[1])
      } else {
        if (strVal.split("-").length > 1) {
          ary = strVal.split("-");
          objRadio.eq(3).attr("checked", "checked");
          $("#weekStart_1").val(ary[0]);
          $("#weekEnd_1").val(ary[1])
        } else {
          if (strVal.split("L").length > 1) {
            ary = strVal.split("L");
            objRadio.eq(4).attr("checked", "checked");
            $("#weekStart_2").val(ary[0])
          } else {
            objRadio.eq(5).attr("checked", "checked");
            ary = strVal.split(",");
            for (var i = 0; i < ary.length; i++) {
              $(".weekList input[value='" + ary[i] + "']").attr("checked", "checked")
            }
          }
        }
      }
    }
  }
}

function initYear(strVal) {
  var ary = null;
  var objRadio = $("input[name='year']");
  if (strVal == "*") {
    objRadio.eq(1).attr("checked", "checked")
  } else {
    if (strVal.split("-").length > 1) {
      ary = strVal.split("-");
      objRadio.eq(2).attr("checked", "checked");
      $("#yearStart_0").val(ary[0]);
      $("#yearEnd_0").val(ary[1]);
    }
  }
}

function everyTime(dom) {
  var item = $("input[name=v_" + dom.name + "]");
  item.val("*");
  item.change()
}

function unAppoint(dom) {
  var name = dom.name;
  var val = "?";
  if (name == "year") {
    val = ""
  }
  var item = $("input[name=v_" + name + "]");
  item.val(val);
  item.change()
}

function appoint(dom) {}

function cycle(dom) {
  var name = dom.name;
  var ns = $(dom).parent().find(".numberspinner");
  var start = ns.eq(0).val();
  var end = ns.eq(1).val();
  var item = $("input[name=v_" + name + "]");
  item.val(start + "-" + end);
  item.change()
}

function startOn(dom) {
  var name = dom.name;
  var ns = $(dom).parent().find(".numberspinner");
  var start = ns.eq(0).val();
  var end = ns.eq(1).val();
  var item = $("input[name=v_" + name + "]");
  item.val(start + "/" + end);
  item.change()
}

function lastDay(dom) {
  var item = $("input[name=v_" + dom.name + "]");
  item.val("L");
  item.change()
}

function weekOfDay(dom) {
  var name = dom.name;
  var ns = $(dom).parent().find(".numberspinner");
  var start = ns.eq(0).val();
  var end = ns.eq(1).val();
  var item = $("input[name=v_" + name + "]");
  item.val(start + "#" + end);
  item.change()
}

function lastWeek(dom) {
  var item = $("input[name=v_" + dom.name + "]");
  var ns = $(dom).parent().find(".numberspinner");
  var start = ns.eq(0).val();
  item.val(start + "L");
  item.change()
}

function workDay(dom) {
  var name = dom.name;
  var ns = $(dom).parent().find(".numberspinner");
  var start = ns.eq(0).val();
  var item = $("input[name=v_" + name + "]");
  item.val(start + "W");
  item.change()
};
(function ($) {
  $.fn.extend({
    cronGen: function (targetData) {
      var createUI = function(){
        var structures = [{
          label : "秒",
          value : "SECONDS"
        },{
          label : "分钟",
          value : "MINUTES"
        },{
          label : "小时",
          value : "HOURS"
        },{
          label : "日",
          value : "DAYS"
        },{
          label : "月",
          value : "MONTHS"
        },{
          label : "周",
          value : "WEEKS"
        },{
          label : "年",
          value : "YEARS"
        }]
        var $ui = $("<div></div>");
        var createNavi = function(){
          var $navi = $("<div></div>");
          var $ul = $("<ul></ul>");
          $ul.addClass("nav nav-tabs");
          var createLi = function(index, structure){
            var $li = $("<li></li>");
            var $a = $("<a></a>");
            if(index == 0){
              $li.addClass("active");
            }
            $a.css("cursor", "pointer")
            $a.text(structure.label);
            $li.on("click", function(event){
              $ul.find("li.active").removeClass("active");
              $li.addClass("active");
              $ui.find("[id*=_Tab]").css("display", "none");
              $ui.find("#"+structure.value+"_Tab").css("display", "block");
            });
            $li.append($a);
            return $li;
          };
          for(var i in structures){
            $ul.append(createLi(i, structures[i]))
          }
          $navi.append($ul);
          return $navi;
        }
        var createContent = function(){
          var $content = $("<div></div>");
          var createSeconds = function(){
            var dom = $('<div><div class="line">\
              <input type="radio" checked="checked" name="second"\
            onclick="everyTime(this)"> 每秒 允许的通配符[, - * /]\
            </div>\
            <div class="line">\
              <input type="radio" name="second" onclick="cycle(this)">\
              周期从 <input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:58" value="1" id="secondStart_0">\
              - <input class="numberspinner" style="width: 60px;"\
            data-options="min:2,max:59" value="2" id="secondEnd_0">\
              秒\
              </div>\
              <div class="line">\
              <input type="radio" name="second" onclick="startOn(this)">\
              从 <input class="numberspinner" style="width: 60px;"\
            data-options="min:0,max:59" value="0" id="secondStart_1">\
              秒开始,每 <input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:59" value="1" id="secondEnd_1">\
              秒执行一次\
              </div>\
              <div class="line">\
              <input type="radio" name="second" id="sencond_appoint">\
              指定\
              </div>\
              <div class="imp secondList">\
              <input type="checkbox" value="0">00 <input\
            type="checkbox" value="1">01 <input type="checkbox"\
            value="2">02 <input type="checkbox" value="3">03\
              <input type="checkbox" value="4">04 <input\
            type="checkbox" value="5">05 <input type="checkbox"\
            value="6">06 <input type="checkbox" value="7">07\
              <input type="checkbox" value="8">08 <input\
            type="checkbox" value="9">09\
              </div>\
              <div class="imp secondList">\
              <input type="checkbox" value="10">10 <input\
            type="checkbox" value="11">11 <input type="checkbox"\
            value="12">12 <input type="checkbox" value="13">13\
              <input type="checkbox" value="14">14 <input\
            type="checkbox" value="15">15 <input type="checkbox"\
            value="16">16 <input type="checkbox" value="17">17\
              <input type="checkbox" value="18">18 <input\
            type="checkbox" value="19">19\
              </div>\
              <div class="imp secondList">\
              <input type="checkbox" value="20">20 <input\
            type="checkbox" value="21">21 <input type="checkbox"\
            value="22">22 <input type="checkbox" value="23">23\
              <input type="checkbox" value="24">24 <input\
            type="checkbox" value="25">25 <input type="checkbox"\
            value="26">26 <input type="checkbox" value="27">27\
              <input type="checkbox" value="28">28 <input\
            type="checkbox" value="29">29\
              </div>\
              <div class="imp secondList">\
              <input type="checkbox" value="30">30 <input\
            type="checkbox" value="31">31 <input type="checkbox"\
            value="32">32 <input type="checkbox" value="33">33\
              <input type="checkbox" value="34">34 <input\
            type="checkbox" value="35">35 <input type="checkbox"\
            value="36">36 <input type="checkbox" value="37">37\
              <input type="checkbox" value="38">38 <input\
            type="checkbox" value="39">39\
              </div>\
              <div class="imp secondList">\
              <input type="checkbox" value="40">40 <input\
            type="checkbox" value="41">41 <input type="checkbox"\
            value="42">42 <input type="checkbox" value="43">43\
              <input type="checkbox" value="44">44 <input\
            type="checkbox" value="45">45 <input type="checkbox"\
            value="46">46 <input type="checkbox" value="47">47\
              <input type="checkbox" value="48">48 <input\
            type="checkbox" value="49">49\
              </div>\
              <div class="imp secondList">\
              <input type="checkbox" value="50">50 <input\
            type="checkbox" value="51">51 <input type="checkbox"\
            value="52">52 <input type="checkbox" value="53">53\
              <input type="checkbox" value="54">54 <input\
            type="checkbox" value="55">55 <input type="checkbox"\
            value="56">56 <input type="checkbox" value="57">57\
              <input type="checkbox" value="58">58 <input\
            type="checkbox" value="59">59\
              </div></div>');
            dom.attr("id", "SECONDS_Tab");
            return dom;
          };
          var createMinutes = function(){
            var dom = $('<div>\
              <div class="line">\
              <input type="radio" checked="checked" name="min"\
            onclick="everyTime(this)"> 分钟 允许的通配符[, - * /]\
            </div>\
            <div class="line">\
              <input type="radio" name="min" onclick="cycle(this)"> 周期从\
              <input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:58" value="1" id="minStart_0"> -\
              <input class="numberspinner" style="width: 60px;"\
            data-options="min:2,max:59" value="2" id="minEnd_0"> 分钟\
              </div>\
              <div class="line">\
              <input type="radio" name="min" onclick="startOn(this)"> 从\
              <input class="numberspinner" style="width: 60px;"\
            data-options="min:0,max:59" value="0" id="minStart_1">\
              分钟开始,每 <input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:59" value="1" id="minEnd_1">\
              分钟执行一次\
              </div>\
              <div class="line">\
              <input type="radio" name="min" id="min_appoint"> 指定\
              </div>\
              <div class="imp minList">\
              <input type="checkbox" value="0">00 <input\
            type="checkbox" value="1">01 <input type="checkbox"\
            value="2">02 <input type="checkbox" value="3">03\
              <input type="checkbox" value="4">04 <input\
            type="checkbox" value="5">05 <input type="checkbox"\
            value="6">06 <input type="checkbox" value="7">07\
              <input type="checkbox" value="8">08 <input\
            type="checkbox" value="9">09\
              </div>\
              <div class="imp minList">\
              <input type="checkbox" value="10">10 <input\
            type="checkbox" value="11">11 <input type="checkbox"\
            value="12">12 <input type="checkbox" value="13">13\
              <input type="checkbox" value="14">14 <input\
            type="checkbox" value="15">15 <input type="checkbox"\
            value="16">16 <input type="checkbox" value="17">17\
              <input type="checkbox" value="18">18 <input\
            type="checkbox" value="19">19\
              </div>\
              <div class="imp minList">\
              <input type="checkbox" value="20">20 <input\
            type="checkbox" value="21">21 <input type="checkbox"\
            value="22">22 <input type="checkbox" value="23">23\
              <input type="checkbox" value="24">24 <input\
            type="checkbox" value="25">25 <input type="checkbox"\
            value="26">26 <input type="checkbox" value="27">27\
              <input type="checkbox" value="28">28 <input\
            type="checkbox" value="29">29\
              </div>\
              <div class="imp minList">\
              <input type="checkbox" value="30">30 <input\
            type="checkbox" value="31">31 <input type="checkbox"\
            value="32">32 <input type="checkbox" value="33">33\
              <input type="checkbox" value="34">34 <input\
            type="checkbox" value="35">35 <input type="checkbox"\
            value="36">36 <input type="checkbox" value="37">37\
              <input type="checkbox" value="38">38 <input\
            type="checkbox" value="39">39\
              </div>\
              <div class="imp minList">\
              <input type="checkbox" value="40">40 <input\
            type="checkbox" value="41">41 <input type="checkbox"\
            value="42">42 <input type="checkbox" value="43">43\
              <input type="checkbox" value="44">44 <input\
            type="checkbox" value="45">45 <input type="checkbox"\
            value="46">46 <input type="checkbox" value="47">47\
              <input type="checkbox" value="48">48 <input\
            type="checkbox" value="49">49\
              </div>\
              <div class="imp minList">\
              <input type="checkbox" value="50">50 <input\
            type="checkbox" value="51">51 <input type="checkbox"\
            value="52">52 <input type="checkbox" value="53">53\
              <input type="checkbox" value="54">54 <input\
            type="checkbox" value="55">55 <input type="checkbox"\
            value="56">56 <input type="checkbox" value="57">57\
              <input type="checkbox" value="58">58 <input\
            type="checkbox" value="59">59\
              </div>\
              </div>');
            dom.attr("id", "MINUTES_Tab");
            dom.css("display", "none");
            return dom;
          };
          var createHours = function(){
            var dom = $('<div>\
              <div class="line">\
              <input type="radio" checked="checked" name="hour"\
            onclick="everyTime(this)"> 小时 允许的通配符[, - * /]\
            </div>\
            <div class="line">\
              <input type="radio" name="hour" onclick="cycle(this)">\
              周期从 <input class="numberspinner" style="width: 60px;"\
            data-options="min:0,max:23" value="0" id="hourStart_0">\
              - <input class="numberspinner" style="width: 60px;"\
            data-options="min:2,max:23" value="2" id="hourEnd_1"> 小时\
              </div>\
              <div class="line">\
              <input type="radio" name="hour" onclick="startOn(this)">\
              从 <input class="numberspinner" style="width: 60px;"\
            data-options="min:0,max:23" value="0" id="hourStart_1">\
              小时开始,每 <input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:23" value="1" id="hourEnd_1">\
              小时执行一次\
              </div>\
              <div class="line">\
              <input type="radio" name="hour" id="hour_appoint"> 指定\
              </div>\
              <div class="imp hourList">\
              AM: <input type="checkbox" value="0">00 <input\
            type="checkbox" value="1">01 <input type="checkbox"\
            value="2">02 <input type="checkbox" value="3">03\
              <input type="checkbox" value="4">04 <input\
            type="checkbox" value="5">05 <input type="checkbox"\
            value="6">06 <input type="checkbox" value="7">07\
              <input type="checkbox" value="8">08 <input\
            type="checkbox" value="9">09 <input type="checkbox"\
            value="10">10 <input type="checkbox" value="11">11\
              </div>\
              <div class="imp hourList">\
              PM: <input type="checkbox" value="12">12 <input\
            type="checkbox" value="13">13 <input type="checkbox"\
            value="14">14 <input type="checkbox" value="15">15\
              <input type="checkbox" value="16">16 <input\
            type="checkbox" value="17">17 <input type="checkbox"\
            value="18">18 <input type="checkbox" value="19">19\
              <input type="checkbox" value="20">20 <input\
            type="checkbox" value="21">21 <input type="checkbox"\
            value="22">22 <input type="checkbox" value="23">23\
              </div>\
              </div>');
            dom.attr("id", "HOURS_Tab");
            dom.css("display", "none");
            return dom;
          };
          var createDays = function(){
            var dom = $('<div>\
              <div class="line">\
              <input type="radio" checked="checked" name="day"\
            onclick="everyTime(this)"> 日 允许的通配符[, - * / L W]\
            </div>\
            <div class="line">\
              <input type="radio" name="day" onclick="unAppoint(this)">\
              不指定\
              </div>\
              <div class="line">\
              <input type="radio" name="day" onclick="cycle(this)"> 周期从\
              <input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:31" value="1" id="dayStart_0"> -\
              <input class="numberspinner" style="width: 60px;"\
            data-options="min:2,max:31" value="2" id="dayEnd_0"> 日\
              </div>\
              <div class="line">\
              <input type="radio" name="day" onclick="startOn(this)"> 从\
              <input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:31" value="1" id="dayStart_1">\
              日开始,每 <input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:31" value="1" id="dayEnd_1">\
              天执行一次\
              </div>\
              <div class="line">\
              <input type="radio" name="day" onclick="workDay(this)">\
              每月 <input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:31" value="1" id="dayStart_2">\
              号最近的那个工作日\
              </div>\
              <div class="line">\
              <input type="radio" name="day" onclick="lastDay(this)">\
              每月最后一天\
              </div>\
              <div class="line">\
              <input type="radio" name="day" id="day_appoint"> 指定\
              </div>\
              <div class="imp dayList">\
              <input type="checkbox" value="1">1 <input type="checkbox"\
            value="2">2 <input type="checkbox" value="3">3 <input\
            type="checkbox" value="4">4 <input type="checkbox"\
            value="5">5 <input type="checkbox" value="6">6 <input\
            type="checkbox" value="7">7 <input type="checkbox"\
            value="8">8 <input type="checkbox" value="9">9 <input\
            type="checkbox" value="10">10 <input type="checkbox"\
            value="11">11 <input type="checkbox" value="12">12\
              <input type="checkbox" value="13">13 <input\
            type="checkbox" value="14">14 <input type="checkbox"\
            value="15">15 <input type="checkbox" value="16">16\
              </div>\
              <div class="imp dayList">\
              <input type="checkbox" value="17">17 <input\
            type="checkbox" value="18">18 <input type="checkbox"\
            value="19">19 <input type="checkbox" value="20">20\
              <input type="checkbox" value="21">21 <input\
            type="checkbox" value="22">22 <input type="checkbox"\
            value="23">23 <input type="checkbox" value="24">24\
              <input type="checkbox" value="25">25 <input\
            type="checkbox" value="26">26 <input type="checkbox"\
            value="27">27 <input type="checkbox" value="28">28\
              <input type="checkbox" value="29">29 <input\
            type="checkbox" value="30">30 <input type="checkbox"\
            value="31">31\
              </div>\
              </div>');
            dom.attr("id", "DAYS_Tab");
            dom.css("display", "none");
            return dom;
          };
          var createWeeks = function(){
            var dom = $('<div title="周">\
              <div class="line">\
              <input type="radio" checked="checked" name="week"\
            onclick="everyTime(this)"> 周 允许的通配符[, - * / L #]\
            </div>\
            <div class="line">\
              <input type="radio" name="week" onclick="unAppoint(this)">\
              不指定\
              </div>\
              <div class="line">\
              <input type="radio" name="week" onclick="startOn(this)">\
              周期 从星期<input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:7" id="weekStart_0" value="1"> -\
              <input class="numberspinner" style="width: 60px;"\
            data-options="min:2,max:7" value="2" id="weekEnd_0">\
              </div>\
              <div class="line">\
              <input type="radio" name="week" onclick="weekOfDay(this)">\
              第<input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:4" value="1" id="weekStart_1"> 周\
            的星期<input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:7" id="weekEnd_1" value="1">\
              </div>\
              <div class="line">\
              <input type="radio" name="week" onclick="lastWeek(this)">\
              本月最后一个星期<input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:7" id="weekStart_2" value="1">\
              </div>\
              <div class="line">\
              <input type="radio" name="week" id="week_appoint"> 指定\
              </div>\
              <div class="imp weekList">\
              <input type="checkbox" value="1">1 <input type="checkbox"\
            value="2">2 <input type="checkbox" value="3">3 <input\
            type="checkbox" value="4">4 <input type="checkbox"\
            value="5">5 <input type="checkbox" value="6">6 <input\
            type="checkbox" value="7">7\
              </div>\
              </div>');
            dom.attr("id", "WEEKS_Tab");
            dom.css("display", "none");
            return dom;
          };
          var createMonths = function(){
            var dom = $('<div>\
              <div class="line">\
              <input type="radio" checked="checked" name="mouth"\
            onclick="everyTime(this)"> 月 允许的通配符[, - * /]\
            </div>\
            <div class="line">\
              <input type="radio" name="mouth" onclick="unAppoint(this)">\
              不指定\
              </div>\
              <div class="line">\
              <input type="radio" name="mouth" onclick="cycle(this)">\
              周期从 <input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:12" value="1" id="mouthStart_0">\
              - <input class="numberspinner" style="width: 60px;"\
            data-options="min:2,max:12" value="2" id="mouthEnd_0"> 月\
              </div>\
              <div class="line">\
              <input type="radio" name="mouth" onclick="startOn(this)">\
              从 <input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:12" value="1" id="mouthStart_1">\
              日开始,每 <input class="numberspinner" style="width: 60px;"\
            data-options="min:1,max:12" value="1" id="mouthEnd_1">\
              月执行一次\
              </div>\
              <div class="line">\
              <input type="radio" name="mouth" id="mouth_appoint"> 指定\
              </div>\
              <div class="imp mouthList">\
              <input type="checkbox" value="1">1 <input type="checkbox"\
            value="2">2 <input type="checkbox" value="3">3 <input\
            type="checkbox" value="4">4 <input type="checkbox"\
            value="5">5 <input type="checkbox" value="6">6 <input\
            type="checkbox" value="7">7 <input type="checkbox"\
            value="8">8 <input type="checkbox" value="9">9 <input\
            type="checkbox" value="10">10 <input type="checkbox"\
            value="11">11 <input type="checkbox" value="12">12\
              </div>\
              </div>');
            dom.attr("id", "MONTHS_Tab");
            dom.css("display", "none");
            return dom;
          };
          var createYears = function(){
            var dom = $('<div title="年">\
              <div class="line">\
              <input type="radio" checked="checked" name="year"\
            onclick="unAppoint(this)"> 不指定 允许的通配符[, - * /] 非必填\
            </div>\
            <div class="line">\
              <input type="radio" name="year" onclick="everyTime(this)">\
              每年\
              </div>\
              <div class="line">\
              <input type="radio" name="year" onclick="cycle(this)">周期\
            从 <input class="numberspinner" style="width: 90px;"\
            data-options="min:2013,max:3000" id="yearStart_0" value="2013">\
              - <input class="numberspinner" style="width: 90px;"\
            data-options="min:2014,max:3000" id="yearEnd_0" value="2014">\
              </div>\
              </div>');
            dom.attr("id", "YEARS_Tab");
            dom.css("display", "none");
            return dom;
          };
          $content.append(createSeconds());
          $content.append(createMinutes());
          $content.append(createHours());
          $content.append(createDays());
          $content.append(createWeeks());
          $content.append(createMonths());
          $content.append(createYears());
          $content.css("min-height", "350px");
          $content.css("padding", "10px");
          return $content;
        };
        $ui.append(createNavi());
        $ui.append(createContent());
        return $ui;
      };
      var createResult = function(){
        var $result = $("<div></div>");
        var $dom = $('<div style="border-radius: 3px; height: 250px;">\
        <table style="height: 100px; margin:auto; border:1px solid #eee; padding:20px">\
          <tbody>\
          <tr  style="background-color: #eee; padding:5px;">\
            <td align="center" colspan="8">表达式生成结果</td>\
          </tr>\
          <tr>\
          <td></td>\
          <td align="center">秒</td>\
          <td align="center">分钟</td>\
          <td align="center">小时</td>\
          <td align="center">日</td>\
          <td align="center">月<br />\
          </td>\
          <td align="center">星期</td>\
          <td align="center">年</td>\
          </tr>\
          <tr>\
          <td>表达式字段:</td>\
        <td><input type="text" name="v_second" class="col"\
        value="*" readonly="readonly" /></td>\
          <td><input type="text" name="v_min" class="col" value="*"\
        readonly="readonly" /></td>\
          <td><input type="text" name="v_hour" class="col" value="*"\
        readonly="readonly" /></td>\
          <td><input type="text" name="v_day" class="col" value="*"\
        readonly="readonly" /></td>\
          <td><input type="text" name="v_mouth" class="col" value="*"\
        readonly="readonly" /></td>\
          <td><input type="text" name="v_week" class="col" value="?"\
        readonly="readonly" /></td>\
          <td><input type="text" name="v_year" class="col"\
        readonly="readonly" /></td>\
          </tr>\
          <tr>\
          <td>Cron 表达式:</td>\
        <td colspan="7"><input type="text" name="cron"\
        style="width: 100%;" value="* * * * * ?" id="cron" readonly="readonly"/></td>\
          </tr>\
        <tr>\
        <td colspan="8" id="runTime"></td>\
          </tr>\
          </tbody>\
          </table>\
          </div>');
        $result.append($dom);
        return $result;
      };
      $(this).css("width", "100%");
      $(this).css("margin", "0");
      $(this).css("background-color", "#fff");
      $(this).attr("id", "cronGen");
      $(this).append(createUI());
      $(this).append(createResult());
      var ready = function(){
        $(".numberspinner").on("change", function(){
          $(this).closest("div.line").children().eq(0).click();
        });
        var vals = $("input[name^='v_']");
        var cron = $("#cron");
        vals.change(function() {
          var item = [];
          vals.each(function() {
            item.push(this.value)
          });
          var currentIndex = 0;
          $(".tabs>li").each(function(i, item) {
            if ($(item).hasClass("tabs-selected")) {
              currentIndex = i;
              return false
            }
          });
          for (var i = currentIndex; i >= 1; i--) {
            if (item[i] != "*" && item[i - 1] == "*") {
              item[i - 1] = "0"
            }
          }
          if (item[currentIndex] == "*") {
            for (var i = currentIndex + 1; i < item.length; i++) {
              if (i == 5) {
                item[i] = "?"
              } else {
                item[i] = "*"
              }
            }
          }
          cron.val(item.join(" ")).change()
        });
        cron.change(function() {
          targetData.change({
            value : cron.val()
          })
          btnFan();
        });
        cron.val(targetData.value);
        btnFan();
        var secondList = $(".secondList").children();
        $("#sencond_appoint").click(function() {
          if (this.checked) {
            if ($(secondList).filter(":checked").length == 0) {
              $(secondList.eq(0)).attr("checked", true)
            }
            secondList.eq(0).change()
          }
        });
        secondList.change(function() {
          var sencond_appoint = $("#sencond_appoint").prop("checked");
          if (sencond_appoint) {
            var vals = [];
            secondList.each(function() {
              if (this.checked) {
                vals.push(this.value)
              }
            });
            var val = "?";
            if (vals.length > 0 && vals.length < 59) {
              val = vals.join(",")
            } else {
              if (vals.length == 59) {
                val = "*"
              }
            }
            var item = $("input[name=v_second]");
            item.val(val);
            item.change()
          }
        });
        var minList = $(".minList").children();
        $("#min_appoint").click(function() {
          if (this.checked) {
            if ($(minList).filter(":checked").length == 0) {
              $(minList.eq(0)).attr("checked", true)
            }
            minList.eq(0).change()
          }
        });
        minList.change(function() {
          var min_appoint = $("#min_appoint").prop("checked");
          if (min_appoint) {
            var vals = [];
            minList.each(function() {
              if (this.checked) {
                vals.push(this.value)
              }
            });
            var val = "?";
            if (vals.length > 0 && vals.length < 59) {
              val = vals.join(",")
            } else {
              if (vals.length == 59) {
                val = "*"
              }
            }
            var item = $("input[name=v_min]");
            item.val(val);
            item.change()
          }
        });
        var hourList = $(".hourList").children();
        $("#hour_appoint").click(function() {
          if (this.checked) {
            if ($(hourList).filter(":checked").length == 0) {
              $(hourList.eq(0)).attr("checked", true)
            }
            hourList.eq(0).change()
          }
        });
        hourList.change(function() {
          var hour_appoint = $("#hour_appoint").prop("checked");
          if (hour_appoint) {
            var vals = [];
            hourList.each(function() {
              if (this.checked) {
                vals.push(this.value)
              }
            });
            var val = "?";
            if (vals.length > 0 && vals.length < 24) {
              val = vals.join(",")
            } else {
              if (vals.length == 24) {
                val = "*"
              }
            }
            var item = $("input[name=v_hour]");
            item.val(val);
            item.change()
          }
        });
        var dayList = $(".dayList").children();
        $("#day_appoint").click(function() {
          if (this.checked) {
            if ($(dayList).filter(":checked").length == 0) {
              $(dayList.eq(0)).attr("checked", true)
            }
            dayList.eq(0).change()
          }
        });
        dayList.change(function() {
          var day_appoint = $("#day_appoint").prop("checked");
          if (day_appoint) {
            var vals = [];
            dayList.each(function() {
              if (this.checked) {
                vals.push(this.value)
              }
            });
            var val = "?";
            if (vals.length > 0 && vals.length < 31) {
              val = vals.join(",")
            } else {
              if (vals.length == 31) {
                val = "*"
              }
            }
            var item = $("input[name=v_day]");
            item.val(val);
            item.change()
          }
        });
        var mouthList = $(".mouthList").children();
        $("#mouth_appoint").click(function() {
          if (this.checked) {
            if ($(mouthList).filter(":checked").length == 0) {
              $(mouthList.eq(0)).attr("checked", true)
            }
            mouthList.eq(0).change()
          }
        });
        mouthList.change(function() {
          var mouth_appoint = $("#mouth_appoint").prop("checked");
          if (mouth_appoint) {
            var vals = [];
            mouthList.each(function() {
              if (this.checked) {
                vals.push(this.value)
              }
            });
            var val = "?";
            if (vals.length > 0 && vals.length < 12) {
              val = vals.join(",")
            } else {
              if (vals.length == 12) {
                val = "*"
              }
            }
            var item = $("input[name=v_mouth]");
            item.val(val);
            item.change()
          }
        });
        var weekList = $(".weekList").children();
        $("#week_appoint").click(function() {
          if (this.checked) {
            if ($(weekList).filter(":checked").length == 0) {
              $(weekList.eq(0)).attr("checked", true)
            }
            weekList.eq(0).change()
          }
        });
        weekList.change(function() {
          var week_appoint = $("#week_appoint").prop("checked");
          if (week_appoint) {
            var vals = [];
            weekList.each(function() {
              if (this.checked) {
                vals.push(this.value)
              }
            });
            var val = "?";
            if (vals.length > 0 && vals.length < 7) {
              val = vals.join(",")
            } else {
              if (vals.length == 7) {
                val = "*"
              }
            }
            var item = $("input[name=v_week]");
            item.val(val);
            item.change()
          }
        })
      };
      setTimeout(ready);
    }
  });
})(jQuery);

