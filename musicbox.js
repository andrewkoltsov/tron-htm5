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

	playList = ["Paranoid", "BornToBeWild", "HighwayStar", "PeterGunn", "RadarLove"];
	iPlayList = 0;

	manifest = [ {src:"http://localhost/oggs/Paranoid.ogg", id:"Paranoid"}
				,{src:"http://localhost/oggs/BadToTheBone.ogg", id:"BadToTheBone"}
				,{src:"http://localhost/oggs/BornToBeWild.ogg", id:"BornToBeWild"}
				,{src:"http://localhost/oggs/HighwayStar.ogg", id:"HighwayStar"}
				,{src:"http://localhost/oggs/PeterGunn.ogg", id:"PeterGunn"}
				,{src:"http://localhost/oggs/RadarLove.ogg", id:"RadarLove"}
				,{src:"http://localhost/oggs/start.ogg", id:"start"}
				,{src:"http://localhost/oggs/1st.ogg", id:"1st"}
				,{src:"http://localhost/oggs/2nd.ogg", id:"2nd"}
				,{src:"http://localhost/oggs/3rd.ogg", id:"3rd"}
				,{src:"http://localhost/oggs/loser.ogg", id:"loser"}];
		

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
		if (value) {
			createjs.SoundJS.setMasterVolume(0);
		} else {
			createjs.SoundJS.setMasterVolume(1);
		}
		// createjs.SoundJS.setMute(value);
	};

}