class Menu extends State {
	/**
	* Represents the game's main menu state
	* @param {StateManager} stateManager - State manager for this state
	* @param {CGFscene} scene - Scene for this state
	* @param {Overlay} overlay - Overlay controler
	* @param {dat.GUI} gui - GUI
	* @constructor
	*/
	constructor(stateManager, scene, overlay, gui) {
		super(stateManager, scene);
		console.log('Entered Menu ...');
		this.gui = gui;

		this.turnDuration = 60;
		this.ambient = window.location.search.substr(6);
		this.previousAmbient = this.ambient;

		this.settings = this.gui.addFolder('Settings');
		this.settings.add(this, 'ambient', ['Cena.dsx', 'Cena2.dsx', 'Cena3.dsx', 'Cena4.dsx', 'Cena5.dsx']);
		this.settings.add(this, 'turnDuration', 30, 90);

		this.gamemodes = this.gui.addFolder('Play');
		this.gamemodes.add(this, 'PvP');
		this.gamemodes.add(this, 'PvEasyCPU');
		this.gamemodes.add(this, 'PvHardCPU');
		this.gamemodes.add(this, 'EasyCPUvEasyCPU');
		this.gamemodes.add(this, 'HardCPUvHardCPU');
		this.gamemodes.open();

		this.overlay = overlay;
		this.overlay.hideScore();
		this.overlay.timerTextNode.nodeValue = '';
		this.overlay.hideStopWatch();

		this.overlay.updateWinner('Small Star Empires');
		this.overlay.alert('Use the menu in the top right to begin playing', 100000);
		this.overlay.updateTip('LAIG 2016/2017, Diogo Cepa & João Silva');
		this.overlay.hideReplay();
	}

	/**
	* Updates the main menu
	* @param {Number} dt - Delta time
	*/
	update(dt) {
		if (this.previousAmbient != this.ambient) {
			this.previousAmbient = this.ambient;
			this.changeAmbient(this.ambient);
		}
	}

	/**
	* Removes dat.GUI folder
	* @param {dat.GUI} gui - GUI
	* @param {String} name - Folder name
	*/
	removeFolder(gui, name) {
		let folder = gui.__folders[name];
		if (!folder) return;
		folder.close();
		gui.__ul.removeChild(folder.domElement.parentNode);
		delete gui.__folders[name];
		gui.onResize();
	}

	/** Handles transition to PvP state */
	PvP() {
		this.removeFolder(this.gui, 'Play');
		this.removeFolder(this.gui, 'Settings');
		this.overlay.updateWinner('');
		this.overlay.endAlert();
		this.overlay.updateTip('');
		this.stateManager.changeState(new PvP(this.stateManager, this.scene, this.overlay, this.gui, this.turnDuration));
	}

	/** Handles transition to PvCPU state */
	PvEasyCPU() {
		this.removeFolder(this.gui, 'Play');
		this.removeFolder(this.gui, 'Settings');
		this.overlay.updateWinner('');
		this.overlay.endAlert();
		this.overlay.updateTip('');
		this.stateManager.changeState(new PvCPU(this.stateManager, this.scene, this.overlay, this.gui, 'easy'));
	}

	/** Handles transition to PvCPU state */
	PvHardCPU() {
		this.removeFolder(this.gui, 'Play');
		this.removeFolder(this.gui, 'Settings');
		this.overlay.updateWinner('');
		this.overlay.endAlert();
		this.overlay.updateTip('');
		this.stateManager.changeState(new PvCPU(this.stateManager, this.scene, this.overlay, this.gui, 'hard'));
	}

	/** Handles transition to CPUvCPU state */
	EasyCPUvEasyCPU() {
		this.removeFolder(this.gui, 'Play');
		this.removeFolder(this.gui, 'Settings');
		this.overlay.updateWinner('');
		this.overlay.endAlert();
		this.overlay.updateTip('');
		this.stateManager.changeState(new CPUvCPU(this.stateManager, this.scene, this.overlay, this.gui, 'easy'));
	}

	/** Handles transition to CPUvCPU state */
	HardCPUvHardCPU() {
		this.removeFolder(this.gui, 'Play');
		this.removeFolder(this.gui, 'Settings');
		this.overlay.updateWinner('');
		this.overlay.endAlert();
		this.overlay.updateTip('');
		this.stateManager.changeState(new CPUvCPU(this.stateManager, this.scene, this.overlay, this.gui, 'hard'));
	}

	/**
	* Changes the game ambient
	* @param {String} ambient - Ambient file name
	*/
	changeAmbient(ambient) {
		window.location = `?file=${ambient}`;
	}
}
