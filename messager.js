function Messager()  {
	
	tlWidth = 100;
	radius = 45;
	tlHeight = 3 * tlWidth;
	tlX = stage_size / 2 - tlWidth / 2;
	tlY = stage_size / 2 - tlHeight / 2;
	gr = null;

	this.drawYouDied = function() {
		var text = new Text("You died.",  "bold 100px Arial", "#ff0000");
		text.textAlign = "center";
		text.x = stage_size/2;
		text.y = stage_size/2;
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