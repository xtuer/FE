/*******************************************************************************
 *                                   Shapes                                    *
 ******************************************************************************/
function Shape() {
}

// 图形的类型
Shape.types = {
    line: 'line',
    rect: 'rect',
    curve: 'curve',
    circle: 'circle',
    ellipse: 'ellipse',
    polyline: 'polyline',
    eraser: 'eraser'
};

/**
 * 计算 points 围成的包围矩形:
 *     左上角的 x 为所有坐标中最小的 x
 *     左上角的 y 为所有坐标中最小的 y
 *     又下角的 x 为所有坐标中最大的 x
 *     又下角的 y 为所有坐标中最大的 y
 *
 * @param  {Array} points 顶点坐标数组 {x: x, y: y}
 * @return {Rect}         {x: x, y: y, w: w, h: h}
 */
Shape.boundingBox = function(points) {
    var MIN_VALUE = -100000000;
    var MAX_VALUE = 100000000;
    var x1 = MIN_VALUE,
        y1 = MIN_VALUE,
        x2 = MAX_VALUE,
        y2 = MAX_VALUE;

    for (var i = 0; i < points.length; ++i) {
        x1 = Math.max(x1, points[i].x);
        y1 = Math.max(y1, points[i].y);
        x2 = Math.min(x2, points[i].x);
        y2 = Math.min(y2, points[i].y);
    }

    var rect = new Rect(x1, y1, x2-x1, y2-y1);
    rect.normalize();

    return rect;
};

Shape.drawBoundingBox = function(shape, color, context) {
    var box = shape.boundingBox();
    context.beginPath();
    context.rect(box.x, box.y, box.w, box.h);
    context.fillStyle = color;
    context.fill();
};

// 每一个图形都有函数: draw(context), move(dx, dy), mouseTo(x, y), boundingRect(), contains(x, y)
// 每一个图形都有属性: id, color, lineWidth
// id 用于标记图形，方便使用 id 查找图形。

/*-----------------------------------------------------------------------------|
 |                                    Line                                     |
 |----------------------------------------------------------------------------*/
/**
 * 线段类，线段由 2 个顶点组成，第一个顶点的坐标为 (x1, y2)，第二个顶点的坐标为 (x2, y2)
 *
 * @param {int} x1 第一个顶点的 x 坐标
 * @param {int} y1 第一个顶点的 y 坐标
 * @param {int} x2 第二个顶点的 x 坐标
 * @param {int} y2 第二个顶点的 y 坐标
 */
function Line(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.id = 0;
    this.z = 0;
}

// 返回类型的名字
Line.prototype.type = function() {
    return Shape.types.line;
};

/**
 * 绘制线段
 *
 * @param  {Object} context Canvas context
 * @return 无返回值
 */
Line.prototype.draw = function(context) {
    context.beginPath();
    context.moveTo(this.x1, this.y1);
    context.lineTo(this.x2, this.y2);
    context.stroke();
};

/**
 * 画图时鼠标移动到坐标 (x, y) 处，更新线段第二个点的坐标
 *
 * @param  {int} x 当前鼠标的 x 坐标
 * @param  {int} y 当前鼠标的 y 坐标
 * @return 无返回值
 */
Line.prototype.mouseTo = function(x, y) {
    this.x2 = x;
    this.y2 = y;
};

/**
 * 移动线段，x 坐标移动 dx，y 坐标移动 dy
 *
 * @param  {int} dx 线段在 x 坐标方向移动的距离
 * @param  {int} dy 线段在 y 坐标方向移动的距离
 * @return 无返回值
 */
Line.prototype.move = function(dx, dy) {
    this.x1 += dx;
    this.y1 += dy;
    this.x2 += dx;
    this.y2 += dy;
};

Line.prototype.boundingBox = function() {
    var box = Shape.boundingBox([{x: this.x1, y: this.y1}, {x: this.x2, y: this.y2}]);

    // 线段的包围矩形的宽高最小为 10
    if (box.w < 10) {
        box.x -= 5;
        box.w = 10;
    }
    if (box.h < 10) {
        box.y -= 5;
        box.h = 10;
    }
    return box;
};

Line.prototype.contains = function(x, y) {
    return this.boundingBox().contains(x, y);
};

/*-----------------------------------------------------------------------------|
 |                                  Polyline                                   |
 |----------------------------------------------------------------------------*/
/**
 * 折线
 *
 * @param {int} x  折线起始点的 x 坐标
 * @param {int} y  折线起始点的 y 坐标
 * @param {int} id 折线的 id
 */
function Polyline(x, y, id) {
    this.points = [{x: x, y: y}];
    this.virtualEndPoint = {x: x, y: y};
    this.finished = false;

    this.id = 0;
    this.z = 0;
}

// 返回类型的名字
Polyline.prototype.type = function() {
    return Shape.types.polyline;
};

Polyline.prototype.draw = function(context) {
    var ps = this.points;
    context.beginPath();
    context.moveTo(ps[0].x, ps[0].y);

    for (var i = 1; i < ps.length; ++i) {
        context.lineTo(ps[i].x, ps[i].y);
    }

    // 没有结束时才绘制虚拟结束点
    !this.finished && context.lineTo(this.virtualEndPoint.x, this.virtualEndPoint.y);

    context.stroke();
};

Polyline.prototype.mouseTo = function(x, y) {
    this.virtualEndPoint.x = x;
    this.virtualEndPoint.y = y;
};

Polyline.prototype.move = function(dx, dy) {
    var ps = this.points;

    for (var i = 0; i < ps.length; ++i) {
        ps[i].x += dx;
        ps[i].y += dy;
    }
};

Polyline.prototype.boundingBox = function() {
    return Shape.boundingBox(this.points);
};

Polyline.prototype.contains = function(x, y) {
    return this.boundingBox().contains(x, y);
};

Polyline.prototype.addPoint = function(x, y) {
    this.points.push({x: x, y: y});
};

Polyline.prototype.isFinished = function() {
    return this.finished;
};

Polyline.prototype.finish = function() {
    this.finished = true;
};

/*-----------------------------------------------------------------------------|
 |                                    Rect                                     |
 |----------------------------------------------------------------------------*/
function Rect(x, y, w, h, id) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.id = 0;
    this.z = 0;

    this.normalize();
}

// 返回类型的名字
Rect.prototype.type = function() {
    return Shape.types.rect;
};

Rect.prototype.draw = function(context) {
    context.beginPath();
    context.rect(this.x, this.y, this.w, this.h);
    context.stroke();
};

Rect.prototype.mouseTo = function(x, y) {
    this.w = x - this.x;
    this.h = y - this.y;
};

Rect.prototype.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;
};

/**
 * 矫正矩形的坐标，左上角在右上角的上方
 * @return 无返回值
 */
Rect.prototype.normalize = function() {
    if (this.w < 0) {
        this.x += this.w;
        this.w = -this.w;
    }

    if (this.h < 0) {
        this.y += this.h;
        this.h = -this.h;
    }
};

Rect.prototype.boundingBox = function() {
    return new Rect(this.x, this.y, this.w, this.h);
};

Rect.prototype.contains = function(x, y) {
    return (x >= this.x) && (x <= this.x + this.w) && (y >= this.y) && (y <= this.y + this.h);
};

/*-----------------------------------------------------------------------------|
 |                                  Curve                                   |
 |----------------------------------------------------------------------------*/
function Curve(x, y, id) {
    this.points = [{x: x, y: y}];
    this.id = 0;
    this.z = 0;
}

// 返回类型的名字
Curve.prototype.type = function() {
    return Shape.types.curve;
};

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

Curve.prototype.move = function(dx, dy) {
    var ps = this.points;
    for (var i = 0; i < ps.length; ++i) {
        ps[i].x += dx;
        ps[i].y += dy;
    }
};

Curve.prototype.boundingBox = function() {
    return Shape.boundingBox(this.points);
};

Curve.prototype.contains = function(x, y) {
    return this.boundingBox().contains(x, y);
};

/*-----------------------------------------------------------------------------|
 |                                   Circle                                    |
 |----------------------------------------------------------------------------*/
function Circle(cx, cy, radius, id) {
    this.cx = cx; // 圆心的 x 坐标
    this.cy = cy; // 圆心的 y 坐标
    this.radius = radius; // 半径

    this.id = 0;
    this.z = 0;
}

// 返回类型的名字
Circle.prototype.type = function() {
    return Shape.types.cirvle;
};

Circle.prototype.draw = function(context) {
    context.beginPath();
    context.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
    context.stroke();
};

Circle.prototype.mouseTo = function(x, y) {
    var dx = x - this.cx;
    var dy = y - this.cy;
    this.radius = Math.sqrt(dx*dx + dy*dy);
};

Circle.prototype.move = function(dx, dy) {
    this.cx += dx;
    this.cy += dy;
};

Circle.prototype.boundingBox = function() {
    var x = this.cx - this.radius;
    var y = this.cy - this.radius;
    var w = this.radius * 2;
    var h = this.radius * 2;

    return new Rect(x, y, w, h);
};

Circle.prototype.contains = function(x, y) {
    return this.boundingBox().contains(x, y);
};

/*-----------------------------------------------------------------------------|
 |                                   Ellipse                                   |
 |----------------------------------------------------------------------------*/
function Ellipse(cx, cy, a, b, id) {
    this.cx = cx; // 椭圆中心的 x 坐标
    this.cy = cy; // 椭圆中心的 y 坐标
    this.a  = a;  // 椭圆 a 轴
    this.b  = b;  // 椭圆 b 轴

    this.id = 0;
    this.z = 0;
}

// 返回类型的名字
Ellipse.prototype.type = function() {
    return Shape.types.ellipse;
};

Ellipse.prototype.draw = function(context) {
    var centerX = this.cx;
    var centerY = this.cy;
    var width  = this.a;
    var height = this.b;

    context.beginPath();
    context.moveTo(centerX, centerY - height);

    context.bezierCurveTo(
        centerX + width, centerY - height,
        centerX + width, centerY + height,
        centerX, centerY + height
    );
    context.bezierCurveTo(
        centerX - width, centerY + height,
        centerX - width, centerY - height,
        centerX, centerY - height
    );
    context.closePath();
    context.stroke();
};

Ellipse.prototype.mouseTo = function(x, y) {
    this.a = Math.abs(x - this.cx);
    this.b = Math.abs(y - this.cy);
};

Ellipse.prototype.move = function(dx, dy) {
    this.cx += dx;
    this.cy += dy;
};

Ellipse.prototype.boundingBox = function() {
    var x = this.cx - this.a;
    var y = this.cy - this.b;
    var w = this.a * 2;
    var h = this.b * 2;

    return new Rect(x, y, w, h);
};

Ellipse.prototype.contains = function(x, y) {
    return this.boundingBox().contains(x, y);
};

/*-----------------------------------------------------------------------------|
 |                                   Eraser                                    |
 |----------------------------------------------------------------------------*/
/**
 * 橡皮擦是由一系列的擦除 context 内容的矩形组成
 *
 * @param {int} x 创建橡皮擦时鼠标的 x 坐标
 * @param {int} y 创建橡皮擦时鼠标的 y 坐标
 */
function Eraser(x, y) {
    this.points = [{x: x, y: y}];
    this.w = 12;
    this.h = 12;

    this.id = 0;
    this.z = 0;
}

// 返回类型的名字
Eraser.prototype.type = function() {
    return Shape.types.eraser;
};

/**
 * 绘制橡皮擦，也即是使用 clearRect 从 context 中擦出橡皮擦移动过的地方。
 *
 * @param  {Object} context Canvas 的 context
 * @return 无返回值
 */
Eraser.prototype.draw = function(context) {
    var ps = this.points;
    var w = this.w/2;
    var h = this.h/2;

    for (var i = 0; i < ps.length; ++i) {
        context.clearRect(ps[i].x-w, ps[i].y-h, w+w, h+h);
    }
};

/**
 * 创建橡皮擦时鼠标移动到坐标 (x, y)
 *
 * @param  {int} x 鼠标的 x 坐标
 * @param  {int} y 鼠标的 y 坐标
 * @return 无返回值
 */
Eraser.prototype.mouseTo = function(x, y) {
    this.points.push({x: x, y: y});
};

Eraser.prototype.move = function(dx, dy) {
    var ps = this.points;
    for (var i = 0; i < ps.length; ++i) {
        ps[i].x += dx;
        ps[i].y += dy;
    }
};

Eraser.prototype.boundingBox = function() {
    var box = Shape.boundingBox(this.points);
    box.x -= this.w/2;
    box.y -= this.h/2;
    box.w += this.w;
    box.h += this.h;

    return box;
};

Eraser.prototype.contains = function(x, y) {
    return this.boundingBox().contains(x, y);
};

/**
 * 绘制橡皮擦的边框
 *
 * @param  {int} x 橡皮擦中心的 x 坐标
 * @param  {int} y 橡皮擦中心的 y 坐标
 * @param  {Object} context Canvas 的 context
 * @return 无返回值
 */
Eraser.drawBound = function(x, y, context) {
    var w = 6;
    var h = 6;

    context.beginPath();
    context.rect(x-w, y-h, w+w, h+h);
    context.stroke();
};

/*******************************************************************************
 *                                   Painter                                   *
 ******************************************************************************/
// 操作的种类
var ActionTypes = {
    line    : 'line',     // 画线
    polyline: 'polyline', // 折线
    rect    : 'rect',     // 画矩形
    curve   : 'curve',    // 画曲线
    circle  : 'circle',   // 画圆
    ellipse : 'ellipse',  // 画椭圆
    eraser  : 'eraser',   // 橡皮擦
    move    : 'move'      // 移动画布
};

var shapeId = 0;

/**
 * 画板类，用于绘制图形，支持创建，删除，移动，擦除等操作。
 *
 * 图形绘制逻辑:
 *   普通图形: 鼠标左键按下时生成第一个点，按住鼠标左键移动时调整图形的信息，例如线段的第二个点，圆的半径，
 * 放开鼠标左键时结束绘制，把此图形加入 shapes
 *   绘制折线: 鼠标左键按下一次生成一个折线的点，鼠标右键放开时结束绘制折线，把折线加入 shapes。
 *
 * 点击工具栏按钮选择要绘制的图形后，按下鼠标就创建一个对应的图形对象赋值给 shapeAsDrawing。
 * 鼠标移动的时候修改 shapeAsDrawing 的属性。
 * 鼠标放开时把 shapeAsDrawing 加入到 shapes 里(折线除外，即包括线段，折线，矩形，圆，椭圆，橡皮擦)。
 *
 * 橡皮擦是特殊的图形，它所在处是擦除背景。
 *
 * @param {jQuery} $painter painter 对象
 */
function Painter($painter) {
    this.$painter = $painter;
    this.$canvas = this.$painter.find('.canvas');
    this.canvas  = this.$canvas.get(0);
    this.context = this.canvas.getContext('2d');
    this.lineWidth   = 2;
    this.strokeStyle = '#444';

    this.shapes = []; // 创建好的图形对象数组
    this.shapeAsDrawing = null; // 当前正在绘制的图形，即创建中的图形
    this.selectedShape = null; // 鼠标按下时选中的图形
    this.actionType = null; // 当前操作的类型
    this.undoStack = []; // 后退操作的栈 {name: 'insert|create', index: 2, shape: rectObject}
    this.redoStack = []; // 撤销后退操作的栈

    this.currentX = 0; // 鼠标在画布上的当前 x 坐标
    this.currentY = 0; // 鼠标在画布上的当前 y 坐标
    this.pressedX = 0; // 鼠标按下时的 x 坐标
    this.pressedY = 0; // 鼠标按下时的 y 坐标
    this.showEraser   = false; // 显示橡皮擦
    this.mousePressed = false; // 鼠标按下
    this.draggingCanvas = false; // 正在拖拽 canvas
    this.draggingShape  = false; // 正在拖拽 shape

    // 图形的 z 坐标越小，越在后面，越大越在前面
    this.minZ = 0; // 图形的最小 z 坐标
    this.maxZ = 0; // 图形的最大 z 坐标

    this.init(); // 初始化
}

Painter.prototype.init = function() {
    var self = this;
    self.$canvas.off(); // 先解绑所有事件，否则同一个 canvas 多次用来创建 painter 的时候就会重复绑定事件

    self.$painter.find('.toolbar li').off().on('click', function() {
        if (self.isDrawingPolyline()) {
            var x = self.shapeAsDrawing.virtualEndPoint.x;
            var y = self.shapeAsDrawing.virtualEndPoint.y;
            self.shapeAsDrawing.addPoint(x, y);
        }
        self.finishDrawingNewShape(); // 点击时结束正在绘制的图形

        var type = $(this).attr('data-type');

        if ('clear' === type) {
            self.clear();
        } else if ('undo' === type) {
            self.undo();
        } else if ('redo' === type) {
            self.redo();
        } else {
            self.changeShape(type, this);
        }
    });

    // 鼠标在画布上按下时事件处理
    // 1. 如果是画图模式，则创建图形
    // 2. 如果是移动模式，如果鼠标在图形上则移动图形，如果不在图形上则移动画布
    self.$canvas.on('mousedown', function(e) {
        if (!Painter.isLeftButton(e)) { return;}

        self.mousePressed = true;
        var x = e.offsetX;
        var y = e.offsetY;
        self.currentX = x;
        self.currentY = y;
        self.pressedX = x;
        self.pressedY = y;

        // 没有绘制时创建图形
        if (!self.isDrawing()) {
            if (self.actionType === ActionTypes.line) {
                self.shapeAsDrawing = new Line(x, y, x, y, ++shapeId); // 线段
                self.shapeAsDrawing.z = (++self.maxZ);
            } else if (self.actionType === ActionTypes.polyline) {
                self.shapeAsDrawing = new Polyline(x, y, ++shapeId); // 折线
                self.shapeAsDrawing.z = (++self.maxZ);
            } else if (self.actionType === ActionTypes.curve) {
                self.shapeAsDrawing = new Curve(x, y, ++shapeId); // 曲线
                self.shapeAsDrawing.z = (++self.maxZ);
            } else if (self.actionType === ActionTypes.rect) {
                self.shapeAsDrawing = new Rect(x, y, 1, 1, ++shapeId); // 矩形
                self.shapeAsDrawing.z = (++self.maxZ);
            } else if (self.actionType === ActionTypes.circle) {
                self.shapeAsDrawing = new Circle(x, y, 0, ++shapeId); // 圆
                self.shapeAsDrawing.z = (++self.maxZ);
            } else if (self.actionType === ActionTypes.ellipse) {
                self.shapeAsDrawing = new Ellipse(x, y, 0, 0, ++shapeId); // 椭圆
                self.shapeAsDrawing.z = (++self.maxZ);
            } else if (self.actionType === ActionTypes.eraser) {
                self.shapeAsDrawing = new Eraser(x, y); // 橡皮擦
                self.shapeAsDrawing.z = (++self.maxZ);
            }
        }

        // 找到被选中的图形
        if (self.actionType === ActionTypes.move) {
            self.selectedShape = self.findShapeUnder(x, y);
            self.draggingCanvas = !self.selectedShape;
            self.draggingShape  = (self.selectedShape !== null);
        }
    });

    // 鼠标移动时间，如果在按下鼠标的情况下移动鼠标，则说明要么在创建图形，要么在移动图形。
    // 如果当前操作是橡皮擦，即使没有按下鼠标，也要显示出橡皮擦。
    self.$canvas.on('mousemove', function(e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var dx = x - self.currentX; // 相对于上一次鼠标移动的 dx
        var dy = y - self.currentY; // 相对于上一次鼠标移动的 dy
        self.currentX = x;
        self.currentY = y;

        if (self.draggingShape) { // 移动图形
            self.selectedShape.move(dx, dy);
        } else if (self.draggingCanvas) { // 移动 canvas，即移动所有图形
            for (var i = 0; i < self.shapes.length; ++i) {
                self.shapes[i].move(dx, dy);
            }
        } else if (self.isDrawingPolyline()) { // 折线
            self.shapeAsDrawing.mouseTo(x, y);
        } else if (self.isDrawing()) { // 画图模式下移动鼠标时修正图形数据
            self.shapeAsDrawing.mouseTo(x, y);
        }

        if (self.actionType === ActionTypes.eraser) {
            self.showEraser = true;
        }

        // 正在绘图，拖拽图形，拖拽画布，橡皮擦模式时更新，移动模式时如果鼠标下有图形，也更新
        if (self.isDrawing() || self.draggingCanvas || self.draggingShape || self.actionType === ActionTypes.eraser) {
            self.update();
        } else if (self.actionType === ActionTypes.move) {
            var shape = self.findShapeUnder(x, y);

            // 如果鼠标下有图形则更新
            // 如果鼠标下无图形，但是上次是有图形的时候更新的，则也更新一次
            // 当然最简单的方法时移动模式下不管什么情况都更新
            if (shape) {
                self.update();
                self._updatedAsMove = true; // _ 开头的变量名，表明其它地方不使用此变量
            } else if (self._updatedAsMove) {
                self.update();
                self._updatedAsMove = false;
            }
        }
    });

    // 鼠标放开时，如果 shapeAsDrawing 不为空，非折线时则加入 shapes，折线时添加新的点
    self.$canvas.on('mouseup', function(e) {
        if (!Painter.isLeftButton(e)) { return;}

        var x = e.offsetX;
        var y = e.offsetY;
        self.mousePressed = false;
        self.currentX = x;
        self.currentY = y;
        self.selectedShape  = null;
        self.draggingCanvas = false;
        self.draggingShape  = false;

        if (self.isDrawingPolyline()) { // 折线
            self.shapeAsDrawing.addPoint(x, y);
        } else if (self.isDrawing()) { // 非折线
            if (self.actionType === ActionTypes.rect) {
                self.shapeAsDrawing.normalize(); // 矫正矩形
            }

            self.finishDrawingNewShape();
        }

        self.update();
    });

    // 双击时如果是折线，则结束绘制
	self.$canvas.on('dblclick', function(e) {
        if (self.isDrawingPolyline()) {
            self.finishDrawingNewShape();
            self.update();
        }
    });

    // 鼠标移除画布时，不显示橡皮擦，否则在边缘处会显示部分橡皮擦。
    self.$canvas.on('mouseleave', function(e) {
        self.showEraser = false;
        // self.shapeAsDrawing = null;

        self.update();
    });

    // 鼠标右键时，如果正在绘制折线，则完成折线
    self.$canvas.on('contextmenu', function(e) {
        e.preventDefault(); // 禁止弹出邮件菜单

        if (self.isDrawingPolyline()) {
            var x = e.offsetX;
            var y = e.offsetY;
            self.shapeAsDrawing.addPoint(x, y);
            self.finishDrawingNewShape();
            self.update();
        } else if (self.actionType == ActionTypes.move) {
            var shape = self.findShapeUnder(e.offsetX, e.offsetY);

            if (shape) {
                var x = self.$canvas.position().left + e.offsetX;
                var y = self.$canvas.position().top + e.offsetY;
                self.showMenu(shape, x, y);
            }
        }
    });
};

/**
 * 添加绘制好的图形到 shapes 数组中
 * @return 无返回值
 */
Painter.prototype.finishDrawingNewShape = function() {
    if (this.shapeAsDrawing === null) {
        return;
    }

    if (this.isDrawingPolyline()) {
        this.shapeAsDrawing.finish();
    }

    this.undoStack.push({name: 'remove', index: this.shapes.length, shape: this.shapeAsDrawing});
    this.redoStack.length = 0; // 新添加图形后就不能 redo 了
    this.shapes.push(this.shapeAsDrawing);
    this.shapeAsDrawing = null;
};

/**
 * 删除图形
 *
 * @param  {Shape} shape 要删除的图形
 * @return 无返回值
 */
Painter.prototype.removeShape = function(shape) {
    var index = this.shapes.indexOf(shape);

    // 删除图形
    if (index >= 0) {
        this.undoStack.push({name: 'insert', index: index, shape: shape});
        this.shapes.splice(index, 1);
        this.update();
    }
};

Painter.prototype.showMenu = function(shape, x, y) {
    console.log(x + ', ' + y);
    var self = this;
    var $menu = this.$canvas.siblings('.menu');
    $menu.css({position: 'absolute', left: x, top: y});
    $menu.show();

    self.$canvas.parent().on('click', function() {
        self.hideMenu();
    });

    $menu.find('.menu-item').off();

    $menu.find('.menu-item.remove').on('click', function() {
        self.removeShape(shape);
        self.hideMenu();
    });

    $menu.find('.menu-item.back-one').on('click', function() {
        shape.z -= 1.1;
        self.minZ = Math.min(self.minZ-1, shape.z); // 校正最小 z 坐标

        self.reorderShapes();
        self.update();
        self.hideMenu();
    });

    $menu.find('.menu-item.front-one').on('click', function() {
        shape.z += 1.1;
        self.maxZ = Math.max(self.maxZ+1, shape.z); // 校正最大 z 坐标

        self.reorderShapes();
        self.update();
        self.hideMenu();
    });

    $menu.find('.menu-item.back-most').on('click', function() {
        self.minZ -= 100;
        shape.z = self.minZ;

        self.reorderShapes();
        self.update();
        self.hideMenu();
    });

    $menu.find('.menu-item.front-most').on('click', function() {
        self.maxZ += 100;
        shape.z = self.maxZ;

        self.reorderShapes();
        self.update();
        self.hideMenu();
    });
};

Painter.prototype.hideMenu = function() {
    this.$canvas.siblings('.menu').hide();
    this.$canvas.parent().off('click');
};

/**
 * 把 shapes 中的图形按照 z 坐标从小到大排序
 *
 * @return 无返回值
 */
Painter.prototype.reorderShapes = function() {
    this.shapes.sort(function(s1, s2) {
        return s1.z - s2.z;
    });
};

/**
 * 改变当前要绘制的图形
 *
 * @param  {String} type 操作的类型
 * @param  {DOM}    elem DOM element
 * @return 无返回值
 */
Painter.prototype.changeShape = function(type, elem) {
    // 如果正在绘制折线，结束绘制
    if (this.isDrawingPolyline()) {
        this.finishDrawingNewShape();
        this.update();
    }

    $(elem).addClass('active');
    $(elem).siblings().removeClass('active');

    this.actionType = type; // 当前绘制图形的类型
    this.showEraser = false; // 切换绘制的图形后，不在显示橡皮擦
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

    if (this.isDrawing()) { // 绘图模式
        // 3. 绘制当前正在画图形
        this.shapeAsDrawing.draw(this.context);

        // 4. 绘制图形时显示鼠标按下位置的点和当前点，但是不显示橡皮擦按下时的点
        if (this.actionType !== ActionTypes.eraser) {
            this.drawPoint(this.pressedX, this.pressedY);
        }
        this.drawPoint(this.currentX, this.currentY);
    }

    // 5. 显示橡皮擦
    this.showEraser && Eraser.drawBound(this.currentX, this.currentY, this.context);

    // 6. 移动模式下绘制鼠标指向的图形
    if (this.actionType === ActionTypes.move) {
        var color = 'rgba(0, 0, 200, 0.2)';

        // 移动模式下，如果有选中的图形则高亮它，否则就高亮在鼠标下的图形
        if (this.draggingShape) {
            Shape.drawBoundingBox(this.selectedShape, color, this.context);
        } else {
            var shap = this.findShapeUnder(this.currentX, this.currentY);
            shap && Shape.drawBoundingBox(shap, color, this.context);
        }
    }
};

Painter.prototype.drawPoint = function(x, y) {
    this.context.beginPath();
    this.context.arc(x, y, 3, 0, Math.PI * 2);
    this.context.fill();
};

/**
 * 判断是否正在绘制折线。
 * 绘制折线的逻辑: 鼠标左键按下一次生成一个折线的点，鼠标右键放开时结束绘制折线，把折线加入 shapes。
 *
 * @return {Boolean} 返回 true 如果正在绘制折线，否则返回 false
 */
Painter.prototype.isDrawingPolyline = function() {
    return this.shapeAsDrawing && this.shapeAsDrawing.type() === Shape.types.polyline && !this.shapeAsDrawing.isFinished();
};

/**
 * 判断是否正在绘制，除了折线
 * 普通图形绘制逻辑: 鼠标左键按下时生成第一个点，按住鼠标左键移动时调整图形的信息，例如线段的第二个点，圆的半径，
 * 放开鼠标左键时结束绘制，把此图形加入 shapes
 *
 * @return {Boolean} 返回 true 如果正在绘制图形，否则返回 false
 */
Painter.prototype.isDrawing = function() {
    return this.shapeAsDrawing;
};

/**
 * 后退一步
 *
 * @return 无返回值
 */
Painter.prototype.undo = function() {
    if (this.undoStack.length > 0) {
        var a = this.undoStack.pop();

        if ('remove' === a.name) { // 执行删除操作
            this.shapes.splice(a.index, 1); // 从 shapes 里删除

            // 添加到 redo stack
            a.name = 'insert';
            this.redoStack.push(a);
        } else if ('insert' === a.name) {
            this.shapes.splice(a.index, 0, a.shape); // 添加到 shapes 里

            // 添加到 redo stack
            a.name = 'remove';
            this.redoStack.push(a);
        }

        this.reorderShapes();
        this.update();
    }
};

/**
 * 恢复一步后退操作
 *
 * @return 无返回值
 */
Painter.prototype.redo = function() {
    if (this.redoStack.length > 0) {
        var a = this.redoStack.pop();

        if ('remove' === a.name) {
            this.shapes.splice(a.index, 1); // 从 shapes 里删除

            // 添加到 undo stack
            a.name = 'insert';
            this.undoStack.push(a);
        } else if ('insert' === a.name) {
            this.shapes.splice(a.index, 0, a.shape); // 添加到 shapes 里

            // 添加到 undo stack
            a.name = 'remove';
            this.undoStack.push(a);
        }

        this.reorderShapes();
        this.update();
    }
};

/**
 * 清空画布
 *
 * @return 无返回值
 */
Painter.prototype.clear = function() {
    if (confirm('画布清空后不能恢复，确定要清空画布吗?')) {
        this.shapes.length = 0;
        this.undoStack.length = 0;
        this.redoStack.length = 0;
        this.update();
    }
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
 * 查找在坐标 (x, y) 下的图形，只找最上面的。
 *
 * @param  {int} x x 坐标
 * @param  {int} y y 坐标
 * @return {Object} 如果在坐标 (x, y) 下有图形则返回它，否则返回 null
 */
Painter.prototype.findShapeUnder = function(x, y) {
    for (var i = this.shapes.length - 1; i >= 0; --i) {
        if (this.shapes[i].contains(this.currentX, this.currentY)) {
            return this.shapes[i];
        }
    }

    return null;
};

/**
 * 获取绘制的图片数据。
 *
 * @return {String} Base64 编码后的图片数据
 */
Painter.prototype.getImageDataUrl = function() {
    return this.canvas.toDataURL();
};

/**
 * 获取绘制的图片数据，去掉图片四周白色部分
 *
 * @param padding 默认值为 5
 * @return {String} Base64 编码后的图片数据
 */
Painter.prototype.getEffectiveImageDataUrl = function(padding) {
    var bounding = Painter.imageBoundingRect(this.canvas, padding);
    var imageData = this.context.getImageData(bounding.x, bounding.y, bounding.w, bounding.h);
    var tempCanvas = $('<canvas id="temp-canvas" width="' + bounding.w +'" height="' + bounding.h + '"></canvas>').get(0);
    var tempContext = tempCanvas.getContext('2d');
    tempContext.putImageData(imageData, 0, 0);

    return tempCanvas.toDataURL();
};

Painter.prototype.setShapes = function(shapes) {
    this.shapes = shapes;
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.update();
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
        h: bounding.maxY - bounding.minY
    };
};
