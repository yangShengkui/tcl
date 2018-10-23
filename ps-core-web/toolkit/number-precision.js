/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  function strip(num) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12;

    return +parseFloat(num.toPrecision(precision));
  }
  /**
   * Return digits length of a number
   * @param {*number} num Input number
   */
  function digitLength(num) {
    // Get digit length of e
    var eSplit = num.toString().split(/[eE]/);
    var len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0);
    return len > 0 ? len : 0;
  }

  /**
   * 精确加法
   */
  function plus(num1, num2) {
    var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
  }

  /**
   * 精确减法
   */
  function minus(num1, num2) {
    var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (num1 * baseNum - num2 * baseNum) / baseNum;
  }

  /**
   * 精确乘法
   */
  function times(num1, num2) {
    var num1Changed = Number(num1.toString().replace('.', ''));
    var num2Changed = Number(num2.toString().replace('.', ''));
    var baseNum = digitLength(num1) + digitLength(num2);
    return num1Changed * num2Changed / Math.pow(10, baseNum);
  }

  /**
   * 精确除法
   */
  function divide(num1, num2) {
    var num1Changed = Number(num1.toString().replace('.', ''));
    var num2Changed = Number(num2.toString().replace('.', ''));
    return times(num1Changed / num2Changed, Math.pow(10, digitLength(num2) - digitLength(num1)));
  }
  /**
   * 四舍五入
   */
  function round(num, ratio) {
    var base = Math.pow(10, ratio);
    return divide(Math.round(times(num, base)), base);
  }
  return {
    strip : strip,
    plus : plus,
    minus : minus,
    times : times,
    divide : divide,
    round : round,
    digitLength : digitLength,
    default : { strip: strip, plus: plus, minus: minus, times: times, divide: divide, round: round, digitLength: digitLength }
  };
});
