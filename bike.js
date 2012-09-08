function Bike(data, image) {
    MY_BIKE_COLOR = "#ffffff";
    DIE_BIKE_COLOR = "#000000";
    this.image = image;
    this.corners = data.corners;
    this.color = data.color;
    this.speed = data.speed;
    this.head = data.head;

    this.turn = function (direction) {
        if (this.speed > 0) {//yeap we are alive
            switch (this.head.direction) {
                case 'u':
                    if (('u' == direction) || ('d') == direction) {
                        return;
                    }
                    break;
                case 'd':
                    if (('u' == direction) || ('d') == direction) {
                        return;
                    }
                    break;
                case 'l':
                    if (('l' == direction) || ('r') == direction) {
                        return;
                    }
                    break;
                case 'r':
                    if (('l' == direction) || ('r') == direction) {
                        return;
                    }
                    break;
            }
            this.corners.push({ x:this.head.x,
                                y:this.head.y});
            this.head.direction = direction;
            socket.emit('biketurn', {dir:direction});
        }
    }

    this.tick = function () {
        if (this.speed > 0) {//yeap we are alive
            switch (this.head.direction) {
                case 'u':
                    this.head.y -= 1;
                    break;
                case 'd':
                    this.head.y += 1;
                    break;
                case 'l':
                    this.head.x -= 1;
                    break;
                case 'r':
                    this.head.x += 1;
                    break;
            }
        }
    }

    this.drawSegment = function(g, x1, y1, x2, y2) {
        if (x1 == x2) {
            var x = x1 * cell_size + cell_size / 2;
            var ys = (y1 < y2 ? y1 : y2) * cell_size;
            var ye = ( (y1 > y2 ? y1 : y2) + 1 ) * cell_size;
            g.moveTo(x, ys).lineTo(x, ye);
        } else {
            var y = y1 * cell_size + cell_size / 2;
            var xs = (x1 < x2 ? x1 : x2) * cell_size;
            var xe = ( (x1 > x2 ? x1 : x2) + 1 ) * cell_size;
            g.moveTo(xs, y).lineTo(xe, y);
        }
    }

    this.drawSegment2 = function(g, x1, y1, x2, y2) {
        if (x1 == x2) {
            var x = x1 * cell_size + cell_size / 2;
            var ys = (y1 < y2 ? y1 : y2) * cell_size + cell_size / 2;
            var ye = ( (y1 > y2 ? y1 : y2) + 1 ) * cell_size - cell_size / 2;
            g.moveTo(x, ys).lineTo(x, ye);
        } else {
            var y = y1 * cell_size + cell_size / 2;
            var xs = (x1 < x2 ? x1 : x2) * cell_size + cell_size / 2;
            var xe = ( (x1 > x2 ? x1 : x2) + 1 ) * cell_size - cell_size / 2;
            g.moveTo(xs, y).lineTo(xe, y);
        }
    }

    this.drawFull = function () {

        var points = [].concat(this.corners, this.head);
        var g = this.image.graphics;
        g.beginStroke(this.color).setStrokeStyle(10);
        for(var i = 1, size = points.length; i < size; ++i ) {
            var x1 = points[i - 1].x;
            var y1 = points[i - 1].y;
            var x2 = points[i].x;
            var y2 = points[i].y;
            this.drawSegment(g, x1, y1, x2, y2);
        }
        g.endStroke().setStrokeStyle(1);

        if (this.isDrawBack) {
            g.beginStroke(this.head.color).setStrokeStyle(2);

            for(var i = 1, size = points.length; i < size; ++i ) {
                var x1 = points[i - 1].x;
                var y1 = points[i - 1].y;
                var x2 = points[i].x;
                var y2 = points[i].y;
                this.drawSegment2(g, x1, y1, x2, y2);
            }

            g.endStroke().setStrokeStyle(1);
        }
        this.drawHead();
    }

    this.drawLast = function () {

        var points = [].concat(this.corners[this.corners.length - 1], this.head);
        var g = this.image.graphics;
        g.beginStroke(this.color).setStrokeStyle(10);

        var x1 = points[0].x;
        var y1 = points[0].y;
        var x2 = points[1].x;
        var y2 = points[1].y;
        this.drawSegment(g, x1, y1, x2, y2);

        g.endStroke().setStrokeStyle(1);
        if (this.isDrawBack) {
            g.beginStroke(this.head.color).setStrokeStyle(2);
            this.drawSegment2(g, x1, y1, x2, y2);
            g.endStroke().setStrokeStyle(1);
        }
        this.drawHead();
    }

    this.drawHead = function () {
        var g = this.image.graphics;
        g.beginStroke("#FFFFFF");
        var headFillColor = this.head.color || this.color;
        if (this.speed == 0) {
            headFillColor = DIE_BIKE_COLOR;
        }
        g.beginFill(headFillColor);
        switch (this.head.direction) {
            case 'u':
                g.moveTo((this.head.x + 0.5) * cell_size, this.head.y * cell_size);
                g.lineTo(this.head.x * cell_size + 1, (this.head.y + 1) * cell_size - 1);
                g.lineTo((this.head.x + 1) * cell_size - 1, (this.head.y + 1) * cell_size - 1);
                break;
            case 'd':
                g.moveTo((this.head.x + 0.5) * cell_size, (this.head.y + 1) * cell_size);
                g.lineTo(this.head.x * cell_size + 1, this.head.y * cell_size + 1);
                g.lineTo((this.head.x + 1) * cell_size - 1, this.head.y * cell_size + 1);
                break;
            case 'l':
                g.moveTo(this.head.x  * cell_size, (this.head.y + 0.5) * cell_size);
                g.lineTo((this.head.x + 1) * cell_size - 1, (this.head.y + 1) * cell_size - 1);
                g.lineTo((this.head.x + 1) * cell_size - 1, this.head.y * cell_size + 1);
                break;
            case 'r':
                g.moveTo((this.head.x + 1)  * cell_size, (this.head.y + 0.5) * cell_size);
                g.lineTo(this.head.x * cell_size + 1, (this.head.y + 1) * cell_size - 1);
                g.lineTo(this.head.x * cell_size + 1, this.head.y * cell_size + 1);
                break;
        }
        g.closePath();
        g.endFill();
        g.endStroke();
    }

    this.die = function() {
        this.speed = 0;
    }

    this.setData = function(data) {
        this.corners = data.corners;
        this.speed = data.speed;
        this.head = data.head;
        this.image.graphics.clear();
        this.isDrawBack = data.isDrawBack;
        //this.drawFull();
    }

    this.toString = function() {
        return "color:" + this.color + " head at (" + this.head.x + ";" + this.head.y + ")";
    }
}