class Menu extends State {
	constructor(stateManager, scene, overlay, gui) {
		super(stateManager, scene);
		console.log('Entered Menu ...');
		this.gui = gui;

		this.turnDuration = 60;
		this.ambient = window.location.search.substr(6);
		this.previousAmbient = this.ambient;

		this.settings = this.gui.addFolder('Settings');
		this.settings.add(this, 'ambient', ['Cena3.dsx', 'Cena4.dsx', 'Cena5.dsx']);
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

	update(dt) {
		if (this.previousAmbient != this.ambient) {
			this.previousAmbient = this.ambient;
			this.changeAmbient(this.ambient);
		}
	}

	removeFolder(gui, name) {
		let folder = gui.__folders[name];
		if (!folder) return;
		folder.close();
		gui.__ul.removeChild(folder.domElement.parentNode);
		delete gui.__folders[name];
		gui.onResize();
	}

	PvP() {
		this.removeFolder(this.gui, 'Play');
		this.removeFolder(this.gui, 'Settings');
		this.overlay.updateWinner('');
		this.overlay.endAlert();
		this.overlay.updateTip('');
		this.stateManager.changeState(new PvP(this.stateManager, this.scene, this.overlay, this.gui, this.turnDuration));
	}

	PvEasyCPU() {
		this.removeFolder(this.gui, 'Play');
		this.removeFolder(this.gui, 'Settings');
		this.overlay.updateWinner('');
		this.overlay.endAlert();
		this.overlay.updateTip('');
		this.stateManager.changeState(new PvCPU(this.stateManager, this.scene, this.overlay, this.gui, 'easy'));
	}

	PvHardCPU() {
		this.removeFolder(this.gui, 'Play');
		this.removeFolder(this.gui, 'Settings');
		this.overlay.updateWinner('');
		this.overlay.endAlert();
		this.overlay.updateTip('');
		this.stateManager.changeState(new PvCPU(this.stateManager, this.scene, this.overlay, this.gui, 'hard'));
	}

	EasyCPUvEasyCPU() {
		this.removeFolder(this.gui, 'Play');
		this.removeFolder(this.gui, 'Settings');
		this.overlay.updateWinner('');
		this.overlay.endAlert();
		this.overlay.updateTip('');
		this.stateManager.changeState(new CPUvCPU(this.stateManager, this.scene, this.overlay, this.gui, 'easy'));
	}

	HardCPUvHardCPU() {
		this.removeFolder(this.gui, 'Play');
		this.removeFolder(this.gui, 'Settings');
		this.overlay.updateWinner('');
		this.overlay.endAlert();
		this.overlay.updateTip('');
		this.stateManager.changeState(new CPUvCPU(this.stateManager, this.scene, this.overlay, this.gui, 'hard'));
	}

	changeAmbient(ambient) {
		window.location = `?file=${ambient}`;
	}
}
