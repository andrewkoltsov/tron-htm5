function Messager()  {
	
	tlWidth = 100;
	radius = 45;
	tlHeight = 3 * tlWidth;
	tlX = stage_size / 2 - tlWidth / 2;
	tlY = stage_size / 2 - tlHeight / 2;
	gr = null;

	this.drawYouDied = function() {
		var text = new Text("You lose.",  "bold 100px Arial", "#ff0000");
		text.textAlign = "center";
		text.textBaseline  = "middle";
		text.x = stage_size / 2;
		text.y = stage_size / 2;
		return text;
	};

	this.drawYouWin = function() {
		var text = new Text("You win.",  "bold 100px Arial", "#ff0000");
		text.textAlign = "center";
		text.textBaseline  = "middle";
		text.x = stage_size / 2;
		text.y = stage_size / 2;
		return text;
	};

	this.drawResult = function(data) {
		var str = "Result:"
		for (var i = 0; i < data.deathOrder.length; i++) {
			str += "\r\n";
			str += (i + 1) + ". " + data.deathOrder[i].substring(0, 4);
		}
		var text = new Text(str, "bold 60px Arial", "#ffffff");
		text.textAlign = "center";
		text.textBaseline  = "middle";
		text.x = stage_size / 2;
		text.y = stage_size / 2 - (1 + data.deathOrder.length) / 2 * text.getMeasuredLineHeight();
		return text;
	}

	function drawEmptyTL() {
		gr.beginStroke("#c3c3c3");
		gr.drawRect(tlX, tlY, tlWidth, tlHeight);
		gr.endStroke();
		
		gr.beginStroke("#c3c3c3");
		gr.drawCircle(stage_size / 2, stage_size / 2 - tlHeight / 3, radius);
		gr.endStroke();
		
		gr.beginStroke("#c3c3c3");
		gr.drawCircle(stage_size / 2, stage_size / 2 , radius);
		gr.endStroke();

		gr.beginStroke("#c3c3c3");
		gr.drawCircle(stage_size / 2, stage_size / 2 + tlHeight / 3, radius);
		gr.endStroke();

		stage.update();
		setTimeout(draw1stYellowLight, 500);
	}
	function draw1stYellowLight() {
		gr.beginFill("#ffff00");
		gr.drawCircle(stage_size / 2, stage_size / 2 - tlHeight / 3, radius);
		gr.endFill();
		
		stage.update();
		setTimeout(draw2ndYellowLight, 500);
	}
	function draw2ndYellowLight() {
		gr.beginFill("#ffff00");
		gr.drawCircle(stage_size / 2, stage_size / 2 , radius);
		gr.endFill();

		stage.update();
		setTimeout(drawGreenLight, 500);
	}
	function drawGreenLight() {
		gr.beginFill("#00ff00");
		gr.drawCircle(stage_size / 2, stage_size / 2 + tlHeight / 3, radius);
		gr.endFill();

		stage.update();
	}
	

	this.playTrafficLightAmimation = function(image) {
		gr = image.graphics;
		drawEmptyTL();
	}
};