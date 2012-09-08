var cell_size = 10;
var stage_width = 600/cell_size;
var stage_height = 600/cell_size;
var COLORS = ["#ff0000","#00ff00","#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffa500", "#a500ff"];
var bike_module = require('./bike.server.js');

module.exports.Stage = function(name, type) {
    this.name = name;
    this.bikes = [];
    this.usersOnStage = [];
    this.usersOnStageLimit = 8;
    this.intervalGameTicker = null;
    this.intervalOnStageStat = null;
    this.isGameOn = false;
    this.type = type || 1;
    this.deathOrder = [];

    /**
     * adds user to stage
     */
    this.addUser = function(sid) {
        console.log("user " + sid + " tries add to room " + this.name);
        if (! this.isGameOn) {
            if (this.usersOnStage.length < this.usersOnStageLimit) {
                var i  = this.usersOnStage.indexOf(sid);
                if (-1 == i) {
                    this.usersOnStage.push(sid);
                    console.log("user was added");
                } else {
                    console.log("user already in list");
                }
            } else {
                console.log("limit is reached");
            }
        } else {
            console.log("can't add, game is on");
        }
    };

    /**
     * remove player from stage list or kills if he is in battle
     */
    this.delUser = function(sid) {
        var r = this.usersOnStage.indexOf(sid);
        if (-1 == r) return;
        if (this.isGameOn) {
            this.bikes[r].die();
            this.deathOrder.push(this.usersOnStage[r]);
        } else {
            this.usersOnStage.splice(r, 1);
        }
    };

    /**
     * turks users byke if game is on, and user in battle
     */
    this.turnBike = function(sid, data) {
        if (!this.isGameOn) return;
        var i = this.usersOnStage.indexOf(sid);
        if ( -1 ==  i) return;
        this.bikes[i].turn(data.dir);
    }

    /**
     * prepares stage to new battle
     */
    this.battleBegin = function() {
        console.log("battle begins in room " + this.name);
        this.isGameOn = true;
        this.deathOrder = [];
        // init bikes
        var player_count = this.usersOnStage.length;
        var row_count = Math.floor( (player_count + 1) / 2);
        var direction = null;
        var x;
        var y;
        console.log("preparing bikes");
        for (var i  = 0; i < this.usersOnStage.length; i++) {
            if (i % 2) {
                direction = 'l';
            } else {
                direction = 'r';
            }
            var row_number = Math.floor( i / 2 );

            x = Math.floor( (i % 2 + 1) * stage_width / 3 );
            y = Math.floor( (row_number + 1) * stage_height / (row_count + 1) );

            var bike = new bike_module.Bike({
                'corners': [{'x': x,
                             'y': y}],
                'head': {
                    'x': x,
                    'y': y,
                    'direction': direction,
                    'color': COLORS[i]
                },
                'speed': 1,
                'color': COLORS[i]
            });
            console.log("user " + this.usersOnStage[i] + " has bike " + bike);
            this.bikes.push(bike);
        }
    };

    /**
     * clears stage after battle
     */
    this.battleEnd = function() {
        console.log("battle ends in room " + this.name);
        this.usersOnStage = [];
        this.bikes = [];
        this.isGameOn = false;
    };

    /**
     * game tick
     */
    this.tick = function() {
        for (var i = 0; i < this.bikes.length; i++) {
            if (this.bikes[i].speed > 0) {
                this.bikes[i].tick();
                this._checkCollision(i);
            }
        };
    };

    /**
     * checks collisions for buke j
     */
    this._checkCollision = function(j) {
        var cBike = this.bikes[j];
        for (var i = 0; i < this.bikes.length; i++) {
            if (i == j) continue;
            var bike = this.bikes[i];
            // check heads
            if ( (cBike.head.x == bike.head.x)
               &&(cBike.head.y == bike.head.y)
               ) {
                cBike.die();
                this.deathOrder.push(this.usersOnStage[j]);
                bike.die();
                this.deathOrder.push(this.usersOnStage[i]);
                console.log("" + i + " and " + j + " are idiots");
            }
        };
        if (cBike.speed == 0)
            return;
        // border check
        if ( (cBike.head.x < 0)
          || (cBike.head.y < 0)
          || (cBike.head.x >= stage_width)
          || (cBike.head.y >= stage_height) ) {
            console.log("bike" + j + " out of stage");
            cBike.die();
            this.deathOrder.push(this.usersOnStage[j]);
            return;
        }
        // tail check
        for (var i = 0; i < this.bikes.length; i++) {
            var point = {};
            switch (this.bikes[i].head.direction) {
                case 'u':
                    point = {x: this.bikes[i].head.x,
                             y: this.bikes[i].head.y + 1};
                    break;
                case 'd':
                    point = {x: this.bikes[i].head.x,
                             y: this.bikes[i].head.y -1 };
                    break;
                case 'l':
                    point = {x: this.bikes[i].head.x + 1,
                             y: this.bikes[i].head.y};
                    break;
                case 'r':
                    point = {x: this.bikes[i].head.x - 1,
                             y: this.bikes[i].head.y};
                    break;
            }
            var corners = [].concat(this.bikes[i].corners, point);
            for (var k = corners.length - 1; k >= 1; k--) {
                if ( (cBike.head.x == corners[k].x)
                  && ( cBike.head.y >= Math.min(corners[k].y, corners[k - 1].y) )
                  && ( cBike.head.y <= Math.max(corners[k].y, corners[k - 1].y) )
                    ) {
                    cBike.die();
                    this.deathOrder.push(this.usersOnStage[j]);
                    console.log("" + i + " killed " + j);
                    return;
                }
                if ( (cBike.head.y == corners[k].y)
                  && ( cBike.head.x >= Math.min(corners[k].x, corners[k - 1].x) )
                  && ( cBike.head.x <= Math.max(corners[k].x, corners[k - 1].x) )
                    ) {
                    cBike.die();
                    this.deathOrder.push(this.usersOnStage[j]);
                    console.log("" + i + " killed " + j);
                    return;
                }
            };
        }
    };

    /**
     * check for game over
     */
    this.isGameOver = function() {
        if (this.type == 1) {
            var cnt = 0;
            var winner = -1;
            for (var i = 0; i < this.bikes.length; i++) {
                if (this.bikes[i].speed > 0) {
                    cnt++;
                    winner = i;
                }
            }
            if (cnt < 2) {
                console.log("room " + this.name + " gameover");
                if (winner > -1) {
                    this.deathOrder.push(this.usersOnStage[winner]);
                    console.log("player " + this.usersOnStage[winner] + " wins (" + winner + ")");
                } else {
                    console.log("nobody wins");
                }
                this.deathOrder.reverse();
                return true;
            }
            return false;
        }
        console.log("unknow room type");
        return true;
    };
}