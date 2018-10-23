(function(win) {
    var _Render = function(opt) {
        this.init(opt);
    };
    _Render.prototype.init = function (opt) {
        //获取最外层id
        this.div = document.getElementById(opt.id);
        this.canvas = document.createElement('CANVAS');
        // 为外层容器和内层canvas赋样式
        this.div.style = 'position: relative;';
        /*this.canvas.style = 'position: absolute;top: 13%;left:10%;';*/
        //把canvas放到外层容器div内
        this.div.appendChild(this.canvas);
        // 计算外层容器div的宽高，并设置canvas的宽高
        var  positionObj = this.div.getBoundingClientRect();
        this.canvas.width = positionObj.width || 100;
        this.canvas.height = positionObj.width *2/1.2;
        this.context = this.canvas.getContext('2d');
        this.strokeColor = opt.strokeColor || 'rgb(73,95,155)';
        this.fillColor = opt.fillColor || '#495F9B';
        this.zddColor = opt.zddColor || '#F6648A';
        this.zgdColor = opt.zgdColor || '#F2BB74';
        // this.font = opt.font || '20px microsoft yahei';
        // this.textColor = opt.textColor || '#fff';
        // this.textAlign = opt.textAlign || 'center';
        // this.textBaseline = opt.textBaseline || 'middle';
        this.lineWidth = opt.lineWidth || 5;
        this.lineDash = opt.lineDash || [4,4];
        this.zgd = parseFloat(opt.zgd) || parseFloat(4/5);
        this.zdd = parseFloat(opt.zdd) || parseFloat(1/5);
        this.sjd = parseFloat(opt.sjd) || parseFloat(2/5);
        // this.textContent = opt.text || this.sjd;


    }
    /**
     * a x轴半径
     * b y轴半径
     * x 圆心横坐标
     * y 圆心纵坐标
     * s 柱体的高
     * zgd 最高点比例
     * zdd 最低点比例
     * sjd 实际点比例
     */
    _Render.prototype.draw = function () {


        var a = this.canvas.width/2, b = a/4, x = this.canvas.width/2, y = b,s = this.canvas.height-2*b -4,
        zgd = 1-this.zgd;
        zdd = 1-this.zdd;
        sjd = 1-this.sjd;
        //选择a、b中的较大者作为arc方法的半径参数
        var r = (a > b) ? a : b;
        var ratioX = a / r; //横轴缩放比率
        var ratioY = b / r; //纵轴缩放比率
        this.context.scale(ratioX, ratioY); //进行缩放（均匀压缩）
        this.context.beginPath();
        //上班部分不染色
        this.context.strokeStyle = this.strokeColor;
        this.context.lineWidth = this.lineWidth;
        this.context.moveTo((x + a) / ratioX, y / ratioY);
        // this.context.ellipse(x,y,a,b,0,0, 2 * Math.PI);
        this.context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo((x + a) / ratioX, y / ratioY);
        this.context.lineTo((x + a) / ratioX, (y+s*sjd) / ratioY);
        this.context.arc(x / ratioX, (y+s*sjd) / ratioY, r, 0, Math.PI,true);
        this.context.moveTo((x - a)/ratioX , (y+s*sjd) / ratioY );
        this.context.lineTo((x - a)/ratioX , y / ratioY);
        this.context.closePath();
        this.context.stroke();
        this.context.beginPath();
        //下半个染色
        this.context.moveTo((x - a)/ratioX , (y+s*sjd) / ratioY );
        this.context.arc(x / ratioX, (y+s*sjd)/ ratioY, r, Math.PI, 2 * Math.PI,true);
        this.context.lineTo((x + a)/ratioX , (y+s) / ratioY);
        this.context.arc(x / ratioX, (y+s)/ ratioY, r, 0, Math.PI);
        this.context.lineTo((x - a)/ratioX , (y+s*sjd) / ratioY );
        this.context.fillStyle = 'rgba(47,64,115,.5)';
        this.context.fill();
        this.context.closePath();
        this.context.stroke();
        //绘制字体
        // this.context.beginPath();
        // this.context.fillStyle = this.fillColor;
        // this.context.font = this.font;
        // this.context.textAlign= this.textAlign;//文本水平对齐方式
        // this.context.textBaseline= this.textBaseline;//文本垂直方向，基线位置
        // this.context.fillText(this.textContent,x / ratioX, (y+4*s/5)/ratioY);
        // this.context.closePath();
        //画最高点虚线
        this.context.beginPath();
        this.context.setLineDash(this.lineDash);
        this.context.strokeStyle = this.zgdColor;
        this.context.moveTo((x + a) / ratioX, (y+s*zgd) / ratioY);
        this.context.arc(x / ratioX, (y+s*zgd) / ratioY, r, 0, Math.PI);
        this.context.stroke();
        this.context.closePath();
        //画最低点虚线
        this.context.beginPath();
        this.context.strokeStyle = this.zddColor;
        this.context.moveTo((x + a) / ratioX, (y+s*zdd) / ratioY);
        this.context.arc(x / ratioX, (y+s*zdd) / ratioY, r, 0, Math.PI);
        this.context.stroke();
        this.context.closePath();
    }
    // _Render.prototype.text =function () {
    //     this.context.beginPath();
    //     this.context.textAlign = 'center';
    //     this.context.textBaseline = 'middle';
    //     this.context.fillStyle = '#fff';
    //     this.context.font = "18px Arial";
    //     this.context.fillText(this.textContent,this.canvas.width /2, this.canvas.height / 2);
    //     this.context.closePath();
    //
    // }
    _Render.prototype.drawZhuti = function () {
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.draw();
        // this.text();
    }
    win._Render = _Render;

})(window);