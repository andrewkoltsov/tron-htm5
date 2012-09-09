function MusicBox() {
	hash = {};
	this.Start = "start";
	this.f1st = "f1st";
	this.f2nd = "f2nd";
	this.f3rd = "f3rd";
	this.loser = "loser";
	this.BadToTheBone = "BadToTheBone";
	this.Paranoid = "Paranoid";
	this.BornToBeWild = "BornToBeWild";
	this.HighwayStar = "HighwayStar";
	this.PeterGunn = "PeterGunn";
	this.RadarLove = "RadarLove";
	this.active = null;
	musicbox = this;

	this.playList = ["Paranoid", "BornToBeWild", "HighwayStar", "PeterGunn", "RadarLove"];
	//this.playList = [ "start", "f1st", "f2nd", "f3rd", "loser", "start"];
	this.iPlayList = 0;

	manifest = [ {src:"/oggs/Paranoid.ogg", id:"Paranoid"}
				,{src:"/oggs/BadToTheBone.ogg", id:"BadToTheBone"}
				,{src:"/oggs/BornToBeWild.ogg", id:"BornToBeWild"}
				,{src:"/oggs/HighwayStar.ogg", id:"HighwayStar"}
				,{src:"/oggs/PeterGunn.ogg", id:"PeterGunn"}
				,{src:"/oggs/RadarLove.ogg", id:"RadarLove"}
				,{src:"/oggs/start.ogg", id:"start"}
				,{src:"/oggs/1st.ogg", id:"f1st"}
				,{src:"/oggs/2nd.ogg", id:"f2nd"}
				,{src:"/oggs/3rd.ogg", id:"f3rd"}
				,{src:"/oggs/loser.ogg", id:"loser"}];
		

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
		// if (hash[name]) {
		//  	hash[name].play();
		//  	return hash[name];
		// }
		// var inst = createjs.SoundJS.play(name);
		var inst = createjs.SoundJS.play(name, "any", 0, 0);
		hash[name] = inst;
		return inst;
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
	};

}

function playNext() {
	if (!musicbox) return;
	// if (musicbox.active) musicbox.active.stop();
	musicbox.iPlayList = musicbox.iPlayList % musicbox.playList.length;
	musicbox.active = musicbox.play(musicbox.playList[musicbox.iPlayList]);
	musicbox.active.setVolume(0.75);
	musicbox.iPlayList++;
	musicbox.active.onComplete = function() {playNext()};
	musicbox.active.onPlayFailed = function() {playNext()};
}