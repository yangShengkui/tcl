(function(root) {
    var getAngle = function(beginAngle, curr) {
        return (Math.PI / 180) * (curr + beginAngle) * 3;
    };

    var _House = function(opt) {
        this.init(opt);
    };

    _House.prototype.update = function() {
        this.beginAngle += 2;
    };

    _House.prototype.init = function(opt) {
        // 获取外层div
        this.div = document.getElementById(opt.id);
        this.canvas = document.createElement('CANVAS');
        // 计算外层容器的宽高，并设置canvas的宽高
        var positionObj = this.div.getBoundingClientRect();
        this.w = this.canvas.width = positionObj.width || 100;
        this.h = this.canvas.height = positionObj.height || (this.canvas.width * 10 / 9);
        // 把canvas放到外层容器内
        this.div.appendChild(this.canvas);
        // 取得两个canvas的context
        this.context = this.canvas.getContext('2d');
        this.beginAngle = 0;
        this.percent = opt.percent || 0.6;
        this.textContext = opt.text || this.percent;
        this.percentH = 150;
        this.outerColor = opt.outerColor || '#87aafc';
        this.waveColor = opt.waveColor || 'rgba(215,226,254,0.2)';
        this.zddColor = opt.zddColor || '#F6648A';
        this.zgdColor = opt.zgdColor || '#F2BB74';
    };
    _House.prototype.drawDottedLine = function() {
        var w = this.w;
        var h = this.h;
        this.context.beginPath();
        this.context.setLineDash([2, 2]);
        //最低点线
        this.context.strokeStyle = this.zddColor;
        this.context.moveTo(w / 8, h - (h - w / 2 + w / 20) / 3);
        this.context.lineTo(w - w / 8, h - (h - w / 2 + w / 20) / 3);
        this.context.stroke();
        this.context.closePath();
        this.context.beginPath();
        //最高点线
        this.context.strokeStyle = this.zgdColor;
        this.context.moveTo(w / 8, h - 2 * (h - w / 2 + w / 20) / 3);
        this.context.lineTo(w - w / 8, h - 2 * (h - w / 2 + w / 20) / 3);
        this.context.stroke();
        this.context.closePath();
        this.context.setLineDash([0]);
    }

    _House.prototype.drawBlock = function() {
        var w = this.w;
        var h = this.h;
        var l = w / 8;
        this.context.beginPath();
        this.context.fillStyle = '#2d4073'
        this.context.rect(w / 4, h / 2, l, l);
        this.context.rect(w * 3 / 8 + w / 16, h / 2, l, l);
        this.context.rect(w / 4, h / 2 + l + w / 16, l, l);
        this.context.rect(w * 3 / 8 + w / 16, h / 2 + l + w / 16, l, l);
        this.context.rect(w / 2 + l, h / 2 + l + w / 16, l, l);
        this.context.fill();
        this.context.closePath();
    }

    _House.prototype.setPercent = function(percent, text) {
        var w = this.w;
        var h = this.h;
        var p = percent;
        if (p) {
            try {
                p = parseFloat(p);
                this.percent = p;
                this.textContent = text || this.percent;
                this.percentH = h - (h - w / 2 + w / 20) * p
            } catch (e) {
                console.error('参数错误');
            }
        }
    };

    _House.prototype.text = function() {
        var w = this.w;
        var h = this.h;
        this.setPercent(this.percent, this.textContent);
        this.context.beginPath();
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = '#fff'
        //this.context.font = "30px Arial";
        this.context.fillText(this.textContent, 2 * w, 2 * h);
        this.context.closePath();
    };

    _House.prototype.action = function() {
        this.context.lineWidth = 2;
        this.context.strokeStyle = this.outerColor;
        var _this = this;
        _this.clip();

        function loop() {
            root.requestAnimationFrame(function() {
                loop();
            });
            _this.draw();
            _this.update();
        }

        loop();
    };

    _House.prototype.draw = function() {
        this.context.clearRect(0, 0, this.w, this.h);
        this.drawBlock();
        this.drawWave();
        this.clip();
        this.text();
        this.drawDottedLine();
    };

    _House.prototype.clip = function() {
        var w = this.w;
        var h = this.h;
        var r = this.w * 1 / 18;
        var sr = this.w / 25;
        this.context.beginPath();
        this.context.strokeStyle = this.outerColor;
        this.context.moveTo(sr, w / 2 - sr);
        this.context.lineTo(w / 2 - r, r);
        this.context.arcTo(w / 2, 0, w, w / 2, r);
        this.context.lineTo(w - sr, w / 2 - sr);
        this.context.arc(w - 3 * sr / 2, (w - sr) / 2, sr * 2 / 3, -Math.PI / 4, 3 * Math.PI / 4);
        this.context.lineTo(w - w / 8, w / 2 - w / 20);
        this.context.lineTo(w - w / 8, h - 2 - r);
        this.context.arcTo(w - w / 8, h - 2, w / 8, h - 2, r);
        this.context.lineTo(r + w / 8, h - 2);
        this.context.arcTo(w / 8, h - 2, w / 8, 0, r);
        this.context.lineTo(w / 8, w / 2 - w / 20);
        this.context.lineTo(2 * sr, w / 2 + sr / 24);
        this.context.arc(3 * sr / 2, (w - sr) / 2, sr * 2 / 3, Math.PI / 4, 5 * Math.PI / 4);
        this.context.lineTo(sr, w / 2 - sr);
        this.context.stroke();
        this.context.clip();
        this.context.closePath();
    };

    _House.prototype.drawWave = function() {
        var w = this.w;
        var h = this.h;
        var r = this.w * 4 / 25;
        var sr = this.w / 28;
        this.context.beginPath();
        this.context.moveTo(w / 8, 5 * Math.sin(getAngle(this.beginAngle, 0)) + this.percentH);
        var i = w / 8;
        for (; i <= 7 * w / 8 + 5; i += 5) {
            this.context.lineTo(i, 5 * Math.sin(getAngle(this.beginAngle, i)) + this.percentH);
        }
        this.context.lineTo(w - w / 8, h - 2);
        this.context.lineTo(w / 8, h - 2);
        this.context.lineTo(w / 8, 5 * Math.sin(getAngle(this.beginAngle, 0)) + this.percentH);
        this.context.strokeStyle = this.outerColor;
        this.context.stroke();
        this.context.fillStyle = 'rgba(49,69,119,0.4)';
        this.context.fill();
        this.context.closePath();
    };

    root.House = _House;
})(window); 