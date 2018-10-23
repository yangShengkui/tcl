/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  var to2Char = function(num){
    if(num < 10){
      return "0" + num
    } else {
      return num;
    }
  };
  $.fn.creatSelector = function(num, max, str, onchange){
    this.css("width", "100%");
    var leftArrow = $("<div></div>");
    var rightArrow = $("<div></div>");
    var number = $("<input/>");
    var unit = $("<div></div>");
    number.css("display", "inline-block");
    leftArrow.css("display", "inline-block");
    leftArrow.css("padding", "4px");
    leftArrow.css("margin", "5px 5px 5px 20px");
    leftArrow.css("border", "1px solid #21a6fb");
    leftArrow.css("cursor", "pointer");
    rightArrow.css("display", "inline-block");
    rightArrow.css("padding", "4px");
    rightArrow.css("margin", "5px");
    rightArrow.css("border", "1px solid #21a6fb");
    rightArrow.css("cursor", "pointer");
    unit.css("display", "inline-block");
    number.css("width", "100px");
    number.css("text-align", "center");
    leftArrow.append($("<span class=\"glyphicon glyphicon-chevron-left\"></span>"));
    rightArrow.append($("<span class=\"glyphicon glyphicon-chevron-right\"></span>"));
    number.val(to2Char(num));
    unit.text(str);
    leftArrow.on("click", function(){
      num--;
      if(num < 0){
        num = max - 1;
      };
      onchange(num);
      number.val(to2Char(num));
    });
    rightArrow.on("click", function(){
      num++;
      if(num >= max){
        num = 0;
      };
      onchange(num);
      number.val(to2Char(num));
    });
    number.on("blur", function(event){
      var val = $(this).val();
      num = parseInt(val);
      if(num < 0){
        num = 0;
        number.val(to2Char(num));
      } else if(num >= max) {
        num = max;
        number.val(to2Char(num));
      };
      onchange(num);
    });
    number.on("change", function(event){
      var val = $(this).val();
      num = parseInt(val);
      if(num < 0){
        num = 0;
        number.val(to2Char(num));
      } else if(num >= max) {
        num = max;
        number.val(to2Char(num));
      };
      onchange(num);
    })
    this.append(leftArrow);
    this.append(number);
    this.append(rightArrow);
    this.append(unit);
  }
  $.fn.timeSelector = function(config){
    console.log(config);
    config = config || {};
    var hour = config.hour || 0;
    var minute = config.minute || 0;
    var second = config.second || 0;
    var onChange = config.onChange;
    var hourSelector = $("<div></div>");
    var minuteSelector = $("<div></div>");
    var secondSelector = $("<div></div>");
    hourSelector.creatSelector(hour, 23, '时', function(h){
      hour = h;
      if(onChange){
        onChange({
          hour : hour,
          minute : minute,
          second : second
        })
      }
    });
    minuteSelector.creatSelector(minute, 59, '分', function(m){
      minute = m;
      if(onChange){
        onChange({
          hour : hour,
          minute : minute,
          second : second
        })
      }
    });
    secondSelector.creatSelector(second, 59, '秒', function(s){
      second = s;
      if(onChange){
        onChange({
          hour : hour,
          minute : minute,
          second : second
        })
      }
    });
    this.append(hourSelector);
    this.append(minuteSelector);
    this.append(secondSelector);
  }
});
