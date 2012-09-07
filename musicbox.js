function MusicBox() {
	hash = {};
	this.Start = "start";
	this.BadToTheBone = "BadToTheBone";
	this.Paranoid = "Paranoid";
	this.BornToBeWild = "BornToBeWild";
	this.HighwayStar = "HighwayStar";
	this.PeterGunn = "PeterGunn";
	this.RadarLove = "RadarLove";
	active = null;
	musicbox = this;

	playList = ["BadToTheBone","Paranoid", "BornToBeWild", "HighwayStar", "PeterGunn", "RadarLove"];
	iPlayList = 0;

	manifest = [ {src:"oggs/Paranoid.ogg", id:"Paranoid"}
				,{src:"oggs/BadToTheBone.ogg", id:"BadToTheBone"}
				,{src:"oggs/BornToBeWild.ogg", id:"BornToBeWild"}
				,{src:"oggs/HighwayStar.ogg", id:"HighwayStar"}
				,{src:"oggs/PeterGunn.ogg", id:"PeterGunn"}
				,{src:"oggs/RadarLove.ogg", id:"RadarLove"}
				,{src:"oggs/start.ogg", id:"start"}];
		

	// Instantiate a queue.
	queue = new createjs.PreloadJS();
	queue.installPlugin(createjs.SoundJS); // Plug in SoundJS to handle browser-specific paths
	// queue.onComplete = this.playNext;
	// queue.onError = function(arg) {console.log(arg);}; 
	queue.loadManifest(manifest, true);

	/**
	 * playd sound with name name
	 */
	this.play = function(name) {
		if (hash[name]) {
			hash[name].play();
			return hash[name];
		}
		var inst = createjs.SoundJS.play(name);
		//var inst = createjs.SoundJS.play(name, createjs.SoundJS.INTERRUPT_EARLY, 0, 140000);
		hash[name] = inst;
		return inst;
	};

	this.playNext = function() {
		if (active) active.stop();
		iPlayList = iPlayList % playList.length;
		active = musicbox.play(playList[iPlayList]);
		active.setVolume(0.75);
		iPlayList++;
		active.onComplete = musicbox.playNext;
	};

	/**
	 * if value is true - mutes MusicBox, else unmutes MusicBox
	 */
	this.mute = function(value) {
		createjs.SoundJS.setMute(value);
	};

}