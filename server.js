// var cluster = require('cluster');
// var numCPUs = require('os').cpus().length;


var cell_size = 10;
var stage_width = 600/cell_size;
var stage_height = 600/cell_size;
var http = require('http');
var fs = require('fs');
var path = require('path');
var user = require('./user.js');
var stage_module = require('./stage.server.js');
var stage = new stage_module.Stage("4ffa_1");
var connections = 0;

// if (cluster.isMaster) {

//   // Fork workers.
//   for (var i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('death', function(worker) {
//     console.log('worker ' + worker.pid + ' died');
//   });
// } else {

    app = http.createServer(function (request, response) {

        //console.log('request starting...');


        var filePath = '.' + request.url;
        console.info("requesting " + request.url);
        if (filePath == './')
            filePath = './index.html';

        var extname = path.extname(filePath);
        var contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.ogg':
                contentType = 'audio/ogg';
                break;
        }

        path.exists(filePath, function(exists) {

            if (exists) {
                fs.readFile(filePath, function(error, content) {
                    if (error) {
                        response.writeHead(500);
                        response.end();
                    }
                    else {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                        console.info("responsed");
                    }
                });
            }
            else {
                response.writeHead(404);
                response.end();
            }
        });

    }).listen(8080);

    var io = require('socket.io').listen(app);
    // var redis = require('redis')
    // var RedisStore = require('socket.io/lib/stores/redis')
    //   , pub    = redis.createClient()
    //   , sub    = redis.createClient()
    //   , client = redis.createClient();

    io.configure('production', function(){
        io.set('transports', ['websocket']);
        // io.set('store', new RedisStore({
        //       redisPub : pub
        //     , redisSub : sub
        //     , redisClient : client
        // }));
    });

    io.set('log level', 2);
    io.sockets.on('connection', function (socket) {
        if (connections == 0) {
            stage.intervalOnStageStat = setInterval(sendPlayersOnStageStat, 1000);
        }
        connections++;
        // console.info(socket);

        var ID = (socket.id).toString().substr(0, 4);
        var time = (new Date).toLocaleTimeString();
        socket.json.send({'event': 'connected', 'name': ID, 'time': time});
        socket.broadcast.json.send({'event': 'userJoined', 'name': ID, 'time': time});
        socket.on('message', function (msg) {
            if ((msg) && (msg.length > 0)) {
                var time = (new Date).toLocaleTimeString();
                socket.json.send({'event': 'messageSent', 'name': ID, 'text': msg, 'time': time});
                socket.broadcast.json.send({'event': 'messageReceived', 'name': ID, 'text': msg, 'time': time})
            }
        });

        if (stage.isGameOn) {
            socket.emit("initstage", {'bikes': stage.bikes});
        }

        socket.on('disconnect', function() {
            connections--;
            if (connections == 0) {
                clearInterval(stage.intervalOnStageStat);
            }
            var time = (new Date).toLocaleTimeString();
            io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
            stage.delUser(socket.id);
        });

        socket.on("addme", function() {
            stage.addUser(socket.id);
        });

        socket.on("delme", function() {
            stage.delUser(socket.id);
        });


        socket.on("biketurn", function (data) {
            stage.turnBike(socket.id, data);
        });

        socket.on("battlebegin", function () {
            if (stage.usersOnStage[0] != socket.id) return;
            if (stage.usersOnStage < 2) return;
            if (stage.isGameOn) return;
            stage.battleBegin();
            console.log("bike set:");
            console.log("" + stage.bikes);
            io.sockets.emit("initstage", {'bikes': stage.bikes});
            setTimeout(_beginBattle, 2000);
        });
    });

    function _beginBattle() {
        stage.intervalGameTicker = setInterval(tick, 500);
    }

    function tick() {
        stage.tick();
        io.sockets.emit('fulldata', {'bikes':stage.bikes});
        if (stage.isGameOver()) {
            stage.battleEnd();
            clearInterval(stage.intervalGameTicker);
            stage.intervalGameTicker = null;
            io.sockets.emit("battleend", {'deathOrder': stage.deathOrder});
        }
    }

    function sendPlayersOnStageStat() {
        io.sockets.emit("usersonstagelist",
                    {'users': stage.usersOnStage,
                     'limit': stage.usersOnStageLimit,
                     'isgameon': stage.isGameOn,
                     'connected': connections});
    }
// }

require('look').start(3131);