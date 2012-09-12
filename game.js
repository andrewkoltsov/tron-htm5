var KEYCODE_UP = 38;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;
var KEYCODE_W = 87;
var KEYCODE_A = 65;
var KEYCODE_D = 68;
var KEYCODE_S = 83;
var cell_size = 10;
var bikes = [];
var stage_size = 600;
var stage_width = stage_size/cell_size;
var stage_height = stage_size/cell_size;
var stage = null;
var isGameOn = false;
var userids = [];
var bikeBlinkId = null;
var myBikeHeadColor = 0;
var myBike = null;
var musicbox = null;
var messager = null;
var isYouDiedShown = false;
var tl = null;

//document.onkeydown  = handleKeyDown;
function handleKeyDown(e) {
    //cross browser issues exist
    if (!myBike) return;
    if(!e){ var e = window.event; }
    if ("input" == e.target.id) {
        return;
    }
    switch(e.keyCode) {
        case KEYCODE_A:     socket.emit('biketurn', {'dir':'l'}); return false;
        case KEYCODE_LEFT:  socket.emit('biketurn', {'dir':'l'}); return false;
        case KEYCODE_D:     socket.emit('biketurn', {'dir':'r'}); return false;
        case KEYCODE_RIGHT: socket.emit('biketurn', {'dir':'r'}); return false;
        case KEYCODE_W:     socket.emit('biketurn', {'dir':'u'}); return false;
        case KEYCODE_UP:    socket.emit('biketurn', {'dir':'u'}); return false;
        case KEYCODE_S:     socket.emit('biketurn', {'dir':'d'}); return false;
        case KEYCODE_DOWN:  socket.emit('biketurn', {'dir':'d'}); return false;
    }
}

function initGame(data) {
    isGameOn = true;
    isYouDiedShown = false;
    bikes = [];
    var canvas = document.getElementById("testCanvas");
    stage = new Stage(canvas);
    stage.clear();
    stage.autoClear = true;

    for (var i = 0; i < data.bikes.length; i++) {
        var bike = new Bike(data.bikes[i], new Shape());
        bikes.push(bike);
        stage.addChild(bike.image);
        bike.drawFull();
    };

    stage.update();
}

function getMyBike(bikes) {
    var sid = socket.socket.sessionid;
    var i = userids.indexOf(sid);
    if ( i == -1) return null;
    return bikes[i];
}

function startBlinkMybike(bike) {
    myBikeHeadColor = 0;
    var sid = socket.socket.sessionid;
    var i = userids.indexOf(sid);
    if (i != -1) {
        myBike = bikes[i];
        bikeBlinkId = setInterval(blinkMyBike, 250);
    }
}

function stopBlinkMybike() {
    if (bikeBlinkId) {
        //myBike = null;
        clearInterval(bikeBlinkId)
        bikeBlinkId = null;
    }
    stage.removeChild(tl);
    stage.update();
}

function blinkMyBike() {
     if (bikeBlinkId) {
        myBikeHeadColor++;
        myBikeHeadColor = myBikeHeadColor % 2;
        var color = (myBikeHeadColor == 0) ? myBike.color : "#ffffff";
        myBike.head.color = color;
        myBike.drawHead();
        }
    stage.update();
}


$(document).ready(function() {

    // musicbox = new MusicBox();
    
    messager = new Messager();

    $(document).keydown(handleKeyDown);

    $("#initBattle").click(function() {
         socket.emit("battlebegin");
    });

    enable_chat();

    socket.on("usersonstagelist", function (data) {
        $("#players_on_line").text(data.connected);
        userids = data.users;
        var $userNameSpans = $("#players_on_stage .player-name");
        for (var i = 0; i< $userNameSpans.length; i++) {
            if (i <  userids.length) {
                $( $userNameSpans[i] ).text( userids[i].substr(0, 4) );
            } else {
                $( $userNameSpans[i] ).text( "" );
            }
        };

        if (data.users.length < data.limit && !data.isgameon) {
            // enable button add me
            $("#addme").prop("disabled", false);
        } else {
            $("#addme").prop("disabled", true);
        }

        if (-1 != userids.indexOf(socket.socket.sessionid)) {
            $("#delme").prop("disabled", false);
            $("#addme").prop("disabled", true);
        } else {
            $("#delme").prop("disabled", true);
        }

        if (socket.socket.sessionid == data.users[0]
         && data.users.length > 1 && !data.isgameon) {
            // enable button go
            $("#initBattle").prop("disabled", false);
        } else {
            $("#initBattle").prop("disabled", true);
        }
    });

    socket.on("fulldata", function(data) {
        if (stage) {
            var _myBike = getMyBike(data.bikes);
            if (_myBike) {
                if (_myBike.speed == 0) {
                    if (!isYouDiedShown) {
                        stage.addChild(messager.drawYouDied());
                        isYouDiedShown = true;
                    }
                    //draw you are dead
                }
                _myBike.head.color = "#ffffff";
                _myBike.isDrawBack = true;
                if (_myBike.speed == 0) {
                    console.log("you died");
                }
            }
            for (var i = 0; i < data.bikes.length; i++) {
                bikes[i].setData(data.bikes[i]);
                bikes[i].drawFull();
            };
            stage.update();
        }
    });

    socket.on("battleend", function(data) {
        isGameOn = false;
        var sid = socket.socket.sessionid;
        var position = data.deathOrder.indexOf(sid);
        if (myBike && myBike.speed > 0) {
            stage.addChild(messager.drawYouWin());
        }
        stage.addChild(messager.drawResult(data));
        stage.update();
        myBike = null;
        if (position == 0) {
            if (musicbox) musicbox.play(musicbox.f1st);
            return;
        }
        if (position == 1) {
            if (musicbox) musicbox.play(musicbox.f2nd);
            return;
        }
        if (position == 2) {
            if (musicbox) musicbox.play(musicbox.f3rd);
            return;
        }
        if (position > 2) {
            if (musicbox) musicbox.play(musicbox.loser);
            return;
        }
    });

    socket.on("initstage", function (data) {
        $("#initBattle").prop("disabled", true);
        initGame(data);
        if (musicbox) musicbox.play(musicbox.Start);
        startBlinkMybike();
        tl = new Shape();
        stage.addChild(tl);
        messager.playTrafficLightAmimation(tl);
        setTimeout(stopBlinkMybike, 2000);
    });

    $("#addme").click(function () {
        socket.emit("addme", {});
    });
    $("#delme").click(function () {
        socket.emit("delme", {});
    });



    $("#sound").click(function() {
        var $sound = $("#sound");
        $sound.toggleClass("musicOn");
        if ($sound.hasClass("musicOn")) {
            // musicbox.mute(false);
        } else {
            // musicbox.mute(true);
        }
    });

    if ($("#sound").hasClass("musicOn") ) {
        // musicbox.mute(false);
    } else {
        // musicbox.mute(true);
    }
    // playNext();

});