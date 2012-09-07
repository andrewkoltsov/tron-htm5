module.exports.Bike = function(data) {
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

    this.die = function() {
        console.log("bike with color " + this.color + " died");
    	this.speed = 0;
    }

    this.toString = function() {
        return "color:" + this.color + " head at (" + this.head.x + ";" + this.head.y + ")";
    }
}