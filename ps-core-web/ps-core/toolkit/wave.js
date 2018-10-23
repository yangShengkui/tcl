(function (root) {

  var getAngle = function (beginAngle, curr) {
    return (Math.PI / 180) * (curr + beginAngle) * 3;
  };

  var circle = function (ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  };

  var _TextWave = function (opt) {
    this.init(opt);
  };

  _TextWave.prototype.init = function (opt) {
    // 获取外层div
    this.div = document.getElementById(opt.id);
    // 添加两层的canvas，一层放置文本框和波浪，一层放置四角的圆形
    this.canvas = document.createElement('CANVAS');
    this.circleCanvas = document.createElement('CANVAS');
    // 为外层容器和内层canvas赋样式
    this.div.style = "position: relative;";
    this.circleCanvas.style = "position: absolute; top: 0; left: 0;";
    this.canvas.style = "position: absolute; top: 0; left: 0;";
    // 计算外层容器的宽高，并设置两个canvas的宽高
    var positionObj = this.div.getBoundingClientRect();
    this.canvas.width = positionObj.width || 1000;
    this.canvas.height = positionObj.width / 3;
    this.circleCanvas.width = positionObj.width || 1000;
    this.circleCanvas.height = positionObj.width / 3;
    // 把两个canvas放到外层容器内
    this.div.appendChild(this.canvas);
    this.div.appendChild(this.circleCanvas);
    // 取得两个canvas的context
    this.context = this.canvas.getContext('2d');
    this.circleContext = this.circleCanvas.getContext('2d');
    // 波浪是正弦曲线，在这里记录一下开始角度，以便于做动画
    this.beginAngle = 0;
    this.endAngle = 0;
    // 颜色
    this.outerColor = opt.outerColor || '#87aafc';
    this.waveColor = opt.waveColor || 'rgba(49,69,119,0.4)';
    // 波浪高度
    this.percent = opt.percent || '0.6';
    this.h = this.canvas.height - this.canvas.height * parseFloat(this.percent);
    this.textContent = opt.text || this.percent;
    this.swing = opt.swing || 20; // 振幅
    this.speed = opt.speed || 30; // 波速
    this.wavelength = opt.wavelength || 20; // 波长
  };

  _TextWave.prototype.setPercent = function (percent, text) {
    var p = percent;
    if (p) {
      try {
        p = parseFloat(p);
        this.percent = p;
        this.textContent = text || this.percent;
        this.h = this.canvas.height - this.canvas.height * p;
        //this.text();
      } catch (e) {
        console.error('参数错误');
      }
    }

  };
  _TextWave.prototype.text = function () {
    this.circleContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.circleContext.beginPath();
    this.circleContext.textAlign = 'center';
    this.circleContext.textBaseline = 'middle';
    this.circleContext.fillStyle = '#fff'
    this.circleContext.font = "18px Arial";
    this.circleContext.fillText(this.textContent, this.canvas.width / 2, this.canvas.height / 2);
    this.circleContext.closePath();
  };

  _TextWave.prototype.clip = function () {
    this.context.beginPath();
    this.context.moveTo(this.canvas.height / 6, 0);
    this.context.lineTo(this.canvas.width - this.canvas.height / 6, 0);
    this.context.lineTo(this.canvas.width, this.canvas.height / 6);
    this.context.lineTo(this.canvas.width, this.canvas.height - this.canvas.height / 6);
    this.context.lineTo(this.canvas.width - this.canvas.height / 6, this.canvas.height);
    this.context.lineTo(this.canvas.height / 6, this.canvas.height);
    this.context.lineTo(0, this.canvas.height - this.canvas.height / 6);
    this.context.lineTo(0, this.canvas.height / 6);
    this.context.lineTo(this.canvas.height / 6, 0);
    this.context.stroke();
    this.context.clip();
    this.context.closePath();
  };

  _TextWave.prototype.drawCircle = function () {
    //this.text();
    circle(this.circleContext, this.canvas.height / 60, this.canvas.height / 60, this.canvas.height / 60, this.outerColor);
    circle(this.circleContext, this.canvas.width - this.canvas.height / 60, this.canvas.height / 60, this.canvas.height / 60, this.outerColor);
    circle(this.circleContext, this.canvas.height / 60, this.canvas.height - this.canvas.height / 60, this.canvas.height / 60, this.outerColor);
    circle(this.circleContext, this.canvas.width - this.canvas.height / 60, this.canvas.height - this.canvas.height / 60, this.canvas.height / 60, this.outerColor);
  };

  _TextWave.prototype.drawWave = function () {
    this.context.beginPath();
    this.context.moveTo(0, 3 * Math.sin(getAngle(this.beginAngle, 0)) + this.h);
    var i = 0;
    for (; i < this.canvas.width + 5; i += 5) {
      this.context.lineTo(i, 3 * Math.sin(getAngle(this.beginAngle, i)) + this.h);
    }
    this.endAngle = getAngle(this.beginAngle, i);
    this.context.lineTo(this.canvas.width, this.canvas.height - this.canvas.height / 6);
    this.context.lineTo(this.canvas.width - this.canvas.height / 6, this.canvas.height);
    this.context.lineTo(this.canvas.height / 6, this.canvas.height);
    this.context.lineTo(0, this.canvas.height - this.canvas.height / 6);
    this.context.lineTo(0, 3 * Math.sin(getAngle(this.beginAngle, 0)) + this.h);
    this.context.strokeStyle = this.outerColor;
    this.context.stroke();
    this.context.fillStyle = this.waveColor;
    this.context.fill();
    this.context.closePath();

    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.moveTo(this.canvas.width, 3 * Math.sin(this.endAngle) + this.h);
    this.context.lineTo(this.canvas.width, this.canvas.height - this.canvas.height / 6);
    this.context.stroke();
    this.context.closePath();

    this.context.beginPath();
    this.context.lineWidth = 3;
    this.context.moveTo(this.canvas.width - this.canvas.height / 6, this.canvas.height);
    this.context.lineTo(this.canvas.height / 6, this.canvas.height);
    this.context.stroke();
    this.context.closePath();

    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.moveTo(0, 3 * Math.sin(getAngle(this.beginAngle, 0)) + this.h);
    this.context.lineTo(0, this.canvas.height - this.canvas.height / 6);
    this.context.stroke();
    this.context.closePath();
  };

  _TextWave.prototype.drawOuterTop = function () {
    this.context.beginPath();
    this.context.moveTo(0, 3 * Math.sin(getAngle(this.beginAngle, 0)) + this.h);
    this.context.lineTo(0, this.canvas.height / 6);
    this.context.lineWidth = 2;
    this.context.strokeStyle = this.outerColor;
    this.context.stroke();
    this.context.closePath();

    this.context.beginPath();
    this.context.moveTo(0, this.canvas.height / 6);
    this.context.lineTo(this.canvas.height / 6, 0);
    this.context.lineWidth = 1;
    this.context.stroke();
    this.context.closePath();

    this.context.beginPath();
    this.context.moveTo(this.canvas.height / 6, 0);
    this.context.lineTo(this.canvas.width - this.canvas.height / 6, 0);
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();

    this.context.beginPath();
    this.context.moveTo(this.canvas.width - this.canvas.height / 6, 0);
    this.context.lineTo(this.canvas.width, this.canvas.height / 6);
    this.context.lineWidth = 1;
    this.context.stroke();
    this.context.closePath();

    this.context.beginPath();
    this.context.moveTo(this.canvas.width, this.canvas.height / 6);
    this.context.lineTo(this.canvas.width, 3 * Math.sin(this.endAngle) + this.h);
    this.context.lineWidth = 2;

    this.context.stroke();
    this.context.closePath();
  };

  _TextWave.prototype.draw = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawWave();
    this.drawOuterTop();
    this.drawCircle();
  };

  _TextWave.prototype.update = function () {
    this.beginAngle += 1;
  }

  _TextWave.prototype.action = function () {
    var _this = this;
    _this.clip();

    function loop () {
      root.requestAnimationFrame(function () {
        loop();
      });
      _this.draw();
      _this.update();
    }

    loop();
  };

  root.TextWave = _TextWave;
})(window);