/*-----------------------------------------------------------------------------|
 |                                  Curve                                   |
 |----------------------------------------------------------------------------*/
/**
 * 构造一个曲线
 * @param {Integer} x 起始点 x 坐标
 * @param {Integer} y 起始点 y 坐标
 */
function Curve(x, y) {
    this.points = [{x: x, y: y}];
    this.z = 0;
}

Curve.prototype.draw = function(context) {
    var ps = this.points;

    if (ps.length > 1) {
        context.beginPath();
        context.moveTo(ps[0].x, ps[0].y);
        for (var i = 1; i < ps.length; ++i) {
            context.lineTo(ps[i].x, ps[i].y);
        }
        context.stroke();
    }
};

Curve.prototype.mouseTo = function(x, y) {
    this.points.push({x: x, y: y});
};

function Painter($painter) {
    this.$painter = $painter;
    this.$canvas = this.$painter.find('.canvas');
    this.canvas  = this.$canvas.get(0);
    this.context = this.canvas.getContext('2d');
    this.lineWidth   = 2;
    this.strokeStyle = '#444';

    this.shapes = []; // 创建好的图形对象数组
    this.shapeAsDrawing = null; // 当前正在绘制的图形，即创建中的图形

    this.mousePressed = false; // 鼠标按下
    this.init(); // 初始化
}

Painter.prototype.init = function() {
    var self = this;
    self.update(); // 绘制背景
    self.$canvas.off(); // 先解绑所有事件，否则同一个 canvas 多次用来创建 painter 的时候就会重复绑定事件

    // 鼠标在画布上按下时事件处理
    // 1. 如果是画图模式，则创建图形
    // 2. 如果是移动模式，如果鼠标在图形上则移动图形，如果不在图形上则移动画布
    self.$canvas.on('mousedown', function(e) {
        if (!Painter.isLeftButton(e)) { return;}

        var x = e.offsetX;
        var y = e.offsetY;
        self.mousePressed = true;
        self.shapeAsDrawing = new Curve(x, y);
        self.update();
    });

    // 鼠标移动时间，如果在按下鼠标的情况下移动鼠标，则说明要么在创建图形，要么在移动图形。
    // 如果当前操作是橡皮擦，即使没有按下鼠标，也要显示出橡皮擦。
    self.$canvas.on('mousemove', function(e) {
        if (self.mousePressed && self.shapeAsDrawing) {
            var x = e.offsetX;
            var y = e.offsetY;
            self.shapeAsDrawing.mouseTo(x, y);
            self.update();
        }
    });

    // 鼠标放开时，如果 shapeAsDrawing 不为空，添加到 shapes 里
    self.$canvas.on('mouseup', function(e) {
        if (!Painter.isLeftButton(e)) { return;}

        if (self.mousePressed && self.shapeAsDrawing) {
            self.shapes.push(self.shapeAsDrawing);
            self.update();
        }

        self.mousePressed = false;
        self.shapeAsDrawing = null;
    });
};

/**
 * 判断是否鼠标左键
 * 1 是鼠标左键
 * 2 是鼠标中建
 * 3 是鼠标右键
 *
 * @param  {Object}  e 鼠标事件
 * @return {Boolean} 如果是鼠标左键发生的事件，则返回 true，否则返回 false
 */
Painter.isLeftButton = function(e) {
    return e.which === 1;
};

Painter.isRightButton = function(e) {
    return e.which === 3;
};

/**
 * 更新 canvas
 *   1. 清除 canvas
 *   2. 绘制 shapes 数组中的所有图形
 *   3. 绘制当前正在画图形
 *   4. 绘制图形时显示鼠标按下位置的点和当前点
 *   5. 显示橡皮擦
 *   6. 移动模式下绘制鼠标指向的图形
 * @return 无返回值
 */
Painter.prototype.update = function() {
    // 1. 清除 canvas: 绘制白色背景
    this.context.fillStyle = '#FFF';
    this.context.beginPath();
    this.context.rect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fill();
    this.context.closePath();
    // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = '#000';
    this.context.strokeStyle = this.strokeStyle;
    this.context.lineWidth = this.lineWidth;

    // 2. 绘制 shapes 数组中的所有图形，不包含正在创建的图形
    for (var i = 0; i < this.shapes.length; ++i) {
        this.shapes[i].draw(this.context);
    }

    if (this.shapeAsDrawing) {
        this.shapeAsDrawing.draw(this.context);
    }
};

/**
 * 清空画布
 */
Painter.prototype.clean = function() {
    this.shapes = [];
    this.update();
};

/**
 * 获取绘制的图片数据，去掉图片四周白色部分
 *
 * @param padding 默认值为 5
 * @return {String} Base64 编码后的图片数据
 */
Painter.prototype.getEffectiveImageDataUrl = function(padding) {
    var bounding = Painter.imageBoundingRect(this.canvas, padding);
    this.validSign = bounding.valid;

    if (!this.validSign) {
        console.log('No paiting!');
        return '';
    }

    var imageData = this.context.getImageData(bounding.x, bounding.y, bounding.w, bounding.h);
    var tempCanvas = $('<canvas id="temp-canvas" width="' + bounding.w +'" height="' + bounding.h + '"></canvas>').get(0);
    var tempContext = tempCanvas.getContext('2d');
    tempContext.putImageData(imageData, 0, 0);

    return tempCanvas.toDataURL();
};

/**
 * 有效图片的 bounding rect
 * @param  {Object} canvas canvas element
 * @return {Json}   返回表示 bounding rect 的 Json 对象，其有 4 个属性，为 x, y, w, h
 */
Painter.imageBoundingRect = function(canvas, padding) {
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var d = imageData.data; // d 是一个 rgba 的整数数组
    var w = imageData.width;
    var h = imageData.height;
    var valid = false; // 全为底色，说明没有画东西，签名无效

    var bounding = {
        minX: 100000,
        minY: 100000,
        maxX: 0,
        maxY: 0
    };

    // 每一行有 w*4 个整数表示的像素颜色分量
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            var r = d[y*w*4 + x*4 + 0];
            var g = d[y*w*4 + x*4 + 1];
            var b = d[y*w*4 + x*4 + 2];

            // 找到非白色像素的最小，最大坐标
            if (r !== 255 || g !== 255 || b !== 255) {
                bounding.minX = x < bounding.minX ? x : bounding.minX;
                bounding.maxX = x > bounding.maxX ? x : bounding.maxX;
                bounding.minY = y < bounding.minY ? y : bounding.minY;
                bounding.maxY = y > bounding.maxY ? y : bounding.maxY;
                valid = true;
            }
        }
    }

    // 加上 padding
    var p = padding || 5;
    bounding.minX = Math.max(bounding.minX - p, 0);
    bounding.minY = Math.max(bounding.minY - p, 0);
    bounding.maxX = Math.min(bounding.maxX + p, w);
    bounding.maxY = Math.min(bounding.maxY + p, h);

    return {
        x: bounding.minX,
        y: bounding.minY,
        w: bounding.maxX - bounding.minX,
        h: bounding.maxY - bounding.minY,
        valid: valid
    };
};
