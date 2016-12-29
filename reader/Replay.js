class LoadInitialStateReplay extends State {
	constructor(stateManager, scene, board, film) {
		super(stateManager, scene);
		console.log('Entered LoadInitialStateReplay ...');
		this.board = board;
		this.board.initBoard();

		let self = this;
		board.load(function() {
			film.goToBeginning();
			self.stateManager.changeState(new MoveShipStateReplay(self.stateManager, self.scene, board, film));
		});

		this.stateManager.overlay.updateWinner('');
	}

	draw() {
		this.board.display();
	}
}

class MoveShipStateReplay extends State {
	constructor(stateManager, scene, board, film) {
		super(stateManager, scene);
		console.log('Entered MoveShipStateReplay ...');
		this.board = board;
		this.board.initBoard();

		this.film = film;
		this.play = this.film.getPlay();

		board.getShipAt(this.play.from).animation = new HopAnimation(1, board.getScenePosition(this.play.from), board.getScenePosition(this.play.to));
		board.getShipAt(this.play.from).animation.play();
		this.beganAnimation = true;

		this.stateManager.overlay.updateScore(this.board);
	}

	draw() {
		this.board.display();
	}

	update(dt) {
		this.board.update(dt);

		if (this.beganAnimation && this.board.getShipAt(this.play.from).animation.finished) {
			this.board.placeShipAt(this.play.to, this.play.faction);
			this.board.board[this.play.from.z][this.play.from.x][0] = ' ';
			this.stateManager.changeState(new StructBuildStateReplay(this.stateManager, this.scene, this.board, this.film));
		}
	}
}

class StructBuildStateReplay extends State {
	constructor(stateManager, scene, board, film) {
		super(stateManager, scene);
		console.log('Entered StructBuildStateReplay ...');
		this.board = board;
		this.board.initBoard();

		this.film = film;
		this.play = this.film.getPlay();

		if (this.play.struct === 'colony') {
			this.board.getAuxColony(this.play.faction).animation = new HopAnimation(1, this.board.getAuxColonyPosition(this.play.faction), this.board.getScenePosition(this.play.to));
			this.board.getAuxColony(this.play.faction).animation.play();
			this.beganColonyAnimation = true;
		} else {
			this.board.getAuxTradeStation(this.play.faction).animation = new HopAnimation(1, this.board.getAuxTradeStationPosition(this.play.faction), this.board.getScenePosition(this.play.to));
			this.board.getAuxTradeStation(this.play.faction).animation.play();
			this.beganTradeStationAnimation = true;
		}

		this.stateManager.overlay.updateScore(this.board);
	}

	draw() {
		this.board.display();
	}

	update(dt) {
		this.board.update(dt);
		
		if (this.beganColonyAnimation && this.board.getAuxColony(this.play.faction).animation.finished) {
			this.board.popAuxColony(this.play.faction);
			this.board.board = this.play.newBoard;
			if (this.film.hasNext()) {
				this.film.goForwardOne();
				this.stateManager.changeState(new MoveShipStateReplay(this.stateManager, this.scene, this.board, this.film));
			} else {
				this.stateManager.changeState(new EndStateReplay(this.stateManager, this.scene, this.board));
			}
		}
		
		if (this.beganTradeStationAnimation && this.board.getAuxTradeStation(this.play.faction).animation.finished) {
			this.board.popAuxTradeStation(this.play.faction);
			this.board.board = this.play.newBoard;
			if (this.film.hasNext()) {
				this.film.goForwardOne();
				this.stateManager.changeState(new MoveShipStateReplay(this.stateManager, this.scene, this.board, this.film));
			} else {
				this.stateManager.changeState(new EndStateReplay(this.stateManager, this.scene, this.board));
			}
		}
	}
}

class EndStateReplay extends State {
	constructor(stateManager, scene, board) {
		super(stateManager, scene);
		console.log('Entered EndStateReplay ...');
		this.board = board;
		this.board.initBoard();

		let factionOneScore = this.stateManager.overlay.getScore('factionOne');
		let factionTwoScore = this.stateManager.overlay.getScore('factionTwo');
		if (factionOneScore === factionTwoScore) {
			this.stateManager.overlay.updateWinner('It\'s a tie.');
		} else if (factionOneScore > factionTwoScore) {
			this.stateManager.overlay.updateWinner('Blue won!');
		} else {
			this.stateManager.overlay.updateWinner('Yellow won!');
		}

		this.stateManager.overlay.endTimer();
		this.stateManager.overlay.updateScore(this.board);
	}

	draw() {
		this.board.display();
	}
}

class Replay extends State {
	constructor(stateManager, scene, film, overlay, gui) {
		super(stateManager, scene);
		console.log('Entered Replay ...');
		
		this.replayStateManager = new StateManager();
		
		this.replayStateManager.film = film;
		this.replayStateManager.overlay = overlay;

		this.replayStateManager.overlay.showScore();
		this.replayStateManager.overlay.beginTimer();
		this.replayStateManager.overlay.showReplay();

		this.board = new Board(scene);
		let to = this.board.getBoardCenter();
		let from = vec3.fromValues(to[0], to[1] + 20, to[2] - 15);
		
		this.camera = new CGFcamera(Math.PI / 2, 0.1, 100.0, from, to);
		if (!this.scene.graph.views.order.includes('defaultgamecam')) {
			this.scene.graph.views.order.push('defaultgamecam');
		}
		this.scene.graph.views.perspectives['defaultgamecam'] = this.camera;

		this.scene.camera = this.camera;
		this.scene.interface.setActiveCamera(this.camera);

		this.gui = gui;
		let actions = this.gui.addFolder('Actions');
		actions.add(this, 'Menu');
		actions.open();

		this.replayStateManager.pushState(new LoadInitialStateReplay(this.replayStateManager, this.scene, this.board, film));
	}

	draw() {
		this.replayStateManager.draw();
	}

	update(dt) {
		this.replayStateManager.update(dt);
		this.replayStateManager.overlay.update(dt);
	}

	handleInput(keycode) {
		this.replayStateManager.handleInput(keycode);

		if (keycode === 82 || keycode === 114) {
			this.resetCamera();
		}
	}

	resetCamera() {
		let to = this.board.getBoardCenter();
		let from = vec3.fromValues(to[0], to[1] + 20, to[2] - 15);
		let camera = new CGFcamera(Math.PI/2, 0.1, 100.0, from, to);
		this.camera.position = camera.position;
		this.camera.target = camera.target;
		this.camera.direction = camera.direction;
		this.camera._up = camera._up;
	}

	removeFolder(gui, name) {
		let folder = gui.__folders[name];
		if (!folder) return;
		folder.close();
		gui.__ul.removeChild(folder.domElement.parentNode);
		delete gui.__folders[name];
		gui.onResize();
	}

	Menu() {
		this.removeFolder(this.gui, 'Actions');
		this.stateManager.changeState(new Menu(this.stateManager, this.scene, this.replayStateManager.overlay, this.gui));
	}
}
