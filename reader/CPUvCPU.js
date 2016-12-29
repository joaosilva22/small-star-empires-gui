class LoadStateCPUvCPU extends State {
	/**
	 * Load state for CPUvCPU mode
	 * @param {StateManager} stateManager - State manager
	 * @param {CGFscene} scene - Scene
	 * @param {Board} board - The game board
	 * @param {String} faction - The current faction
	 * @param {String} difficulty - Game difficulty
	 * @constructor
	 */
	constructor(stateManager, scene, board, faction, difficulty) {
		super(stateManager, scene);
		console.log('Entered LoadStateCPUvCPU ...');
		this.board = board;
		this.difficulty = difficulty;

		if (faction === 'factionOne') {
			this.faction = 'factionTwo';
		} else {
			this.faction = 'factionOne';
		}

		let self = this;
		if (board.board.length === 0) {
			board.load(function() {
				self.stateManager.film.addPlay(faction, board.board);
				stateManager.changeState(new BotPickStateCPUvCPU(stateManager, scene, board, faction, difficulty));
			});
		} else {
			board.initBoard();
			this.loaded = true;
		}
	}

	/**
	* Updates state
	* @param {Number} dt - Delta time
	*/
	update(dt) {
		if (this.loaded) {
			this.stateManager.film.addPlay(this.faction, this.board.board);
			this.stateManager.changeState(new BotPickStateCPUvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty));
		}
	}

	/** Renders state */
	draw() {
		if (this.board.board.length !== 0) {
			this.board.display();
		}
	}
}

class BotPickStateCPUvCPU extends State {
	/**
	 * Bot pick state for CPUvCPU mode
	 * @param {StateManager} stateManager - State manager
	 * @param {CGFscene} scene - Scene
	 * @param {Board} board - Board
	 * @param {String} faction - Current faction
	 * @param {String} difficulty - Game difficulty
	 * @constructor
	 */
	constructor(stateManager, scene, board, faction, difficulty) {
		super(stateManager, scene);
		console.log('Entered BotPickStateCPUvCPU ...');
		this.board = board;

		let self = this;
		let connection = new Connection();
		if (difficulty === 'easy') {
			//FIXME: Este request nao funciona
			connection.getRandomBoardRequest(faction, board, function(data) {
				let newboard = parseStringArray(data.target.response);
				let play = self.getMovement(newboard);
				stateManager.changeState(new BotMoveShipStateCPUvCPU(stateManager, scene, board, faction, difficulty, play.from, play.to, play.structure));
			});
		} else {
			connection.playerBestBoardRequest(faction, board, function(data) {
				let newboard = parseStringArray(data.target.response);
				let play = self.getMovement(newboard);
				stateManager.changeState(new BotMoveShipStateCPUvCPU(stateManager, scene, board, faction, difficulty, play.from, play.to, play.structure));
			});
		}
	}

	/** Renders state */
	draw() {
		this.board.display();
	}

	/**
	 * Returns movement in board
	 * @param {Array} newboard - Board array
	 */
	getMovement(newboard) {
		let from = null;
		let to = null;
		let structure = null;
		for (let i = 0; i < newboard.length; i++) {
			for (let j = 0; j < newboard[i].length; j++) {
				if (newboard[i][j][0] === 'A' && this.board.board[i][j][0] !== 'A') {
					to = {x: j, z: i};
				}
				if (newboard[i][j][0] === 'B' && this.board.board[i][j][0] !== 'B') {
					to = {x: j, z: i};
				}
				if (newboard[i][j][0] !== 'A' && this.board.board[i][j][0] === 'A') {
					from = {x: j, z: i};
				}
				if (newboard[i][j][0] !== 'B' && this.board.board[i][j][0] === 'B') {
					from = {x: j, z: i};
				}
			}
		}
		switch (newboard[to.z][to.x][2]) {
			case 'o':
			case 'p':
				structure = 'colony';
				break;
			case 'l':
			case 'k':
				structure = 'tradestation';
				break;
		}
		return {from, to, structure};
	}
}

class BotMoveShipStateCPUvCPU extends State {
	/**
	 * Bot move ship state for CPUvCPU mode
	 * @param {StateManager} stateManager - State manager
	 * @param {CGFscene} scene - Scene
	 * @param {Board} board - Board
	 * @param {String} faction - Faction
	 * @param {String} difficulty - Game difficulty
	 * @param {Object} from - Movement origin
	 * @param {Object} to - Movement destination
	 * @param {String} structure - Structure to place
	 * @constructor
	 */
	constructor(stateManager, scene, board, faction, difficulty, from, to, structure) {
		super(stateManager, scene);
		console.log('Entered BotMoveShipStateCPUvCPU ...');
		this.board = board;
		this.faction = faction;
		this.difficulty = difficulty;
		this.from = from;
		this.to = to;
		this.structure = structure;

		this.beganAnimation = false;

		let self = this;
		let connection = new Connection();
		connection.moveShipRequest(board, faction, from.x, from.z, to.x, to.z, function(data) {
			board.board = parseStringArray(data.target.response);
			self.stateManager.film.setPlayMove(from, to, board.board);

			board.getShipAt(from).animation = new HopAnimation(1, board.getScenePosition(from), board.getScenePosition(to));
			board.getShipAt(from).animation.play();
			self.beganAnimation = true;
		});
	}

	/** Renders state */
	draw() {
		this.board.display();
	}

	/** Updates state */
	update(dt) {
		this.board.update(dt);

		if (this.beganAnimation && this.board.getShipAt(this.from).animation.finished) {
			this.stateManager.changeState(new BotStructBuildStateCPUvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty, this.to, this.structure));
		}
	}
}

class BotStructBuildStateCPUvCPU extends State {
	/**
	 * Bot struct build state for CPUvCPU mode
	 * @param {StateManager} stateManager - State manager
	 * @param {CGFscene} scene - Scene
	 * @param {Board} board - Board
	 * @param {String} faction - Faction
	 * @param {String} difficulty - Game difficulty
	 * @param {Object} position - Structure position
	 * @param {String} structure - Structure to build
	 * @constructor
	 */
	constructor(stateManager, scene, board, faction, difficulty, position, structure) {
		super(stateManager, scene);
		console.log('Entered BotStructBuildStateCPUvCPU ...');
		this.board = board;
		this.faction = faction;
		this.difficulty = difficulty;
		this.position = position;
		this.structure = structure;

		if (structure === 'colony') {
			if (this.board.getAuxColony(this.faction)) {
				this.board.getAuxColony(this.faction).animation = new HopAnimation(1, this.board.getAuxColonyPosition(this.faction), this.board.getScenePosition(this.position));
				this.board.getAuxColony(this.faction).animation.play();
			}
			this.beganColonyAnimation = true;
		} else {
			if (this.board.getAuxTradeStation(this.faction)) {
				this.board.getAuxTradeStation(this.faction).animation = new HopAnimation(1, this.board.getAuxTradeStationPosition(this.faction), this.board.getScenePosition(this.position));
				this.board.getAuxTradeStation(this.faction).animation.play();
			}
			this.beganTradeStationAnimation = true;
		}

		this.board.initBoard();
	}

	/**
	* Updates state
	* @param {Number} dt - Delta time
	*/
	update(dt) {
		this.board.update(dt);
		
		if (this.beganColonyAnimation && this.board.getAuxColony(this.faction).animation.finished) {
			let structAuxPos = this.board.popAuxColony(this.faction);
			this.stateManager.film.setPlayStruct('colony', structAuxPos);
			
			this.board.placeColony(this.position, this.faction);
			this.stateManager.changeState(new TestEndStateCPUvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty));
		}
		
		if (this.beganTradeStationAnimation && this.board.getAuxTradeStation(this.faction).animation.finished) {
			let structAuxPos = this.board.popAuxTradeStation(this.faction);
			this.stateManager.film.setPlayStruct('tradeStation', structAuxPos);
			
			this.board.placeTradeStation(this.position, this.faction);
			this.stateManager.changeState(new TestEndStateCPUvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty));
		}
	}

	/** Renders state */
	draw() {
		this.board.display();
	}
}

class TestEndStateCPUvCPU extends State {
	/**
	 * Test end game state for CPUvCPU mode
	 * @param {StateManager} stateManager - State manager
	 * @param {CGFscene} scene - Scene
	 * @param {Board} board - Board
	 * @param {String} faction - The current faction
	 * @param {String} difficulty - Game difficulty
	 * @constructor
	 */
	constructor(stateManager, scene, board, faction, difficulty) {
		super(stateManager, scene);
		console.log('Entered TestEndStateCPUvCPU ...');
		this.board = board;

		let connection = new Connection();
		connection.isGameOverRequest(board, function(data) {
			if (data.target.response === '0') {
				stateManager.changeState(new LoadStateCPUvCPU(stateManager, scene, board, faction, difficulty));
			} else {
				stateManager.changeState(new GameOverStateCPUvCPU(stateManager, scene, board));
			}
		});

		this.stateManager.overlay.updateScore(this.board);
	}

	/** Renders state */
	draw() {
		this.board.display();
	}
}

class GameOverStateCPUvCPU extends State {
	/**
	 * Game over state for CPUvCPU mode
	 * @param {StateManager} stateManager - State manager
	 * @param {CGFscene} scene - Scene
	 * @param {Board} board - The game board
	 * @constructor
	 */
	constructor(stateManager, scene, board) {
		super(stateManager, scene);
		console.log('Entered GameOverStateCUPvCPU ...');
		this.board = board;

		board.initBoard();

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
		this.stateManager.finished = true;
	}

	/** Renders state */
	draw() {
		this.board.display();
	}
}

class CPUvCPU extends State {
	/**
	 * CPUvCPU game mode
	 * @param {StateManager} stateManager - State manager
	 * @param {CGFscene} scene - Scene
	 * @param {Overlay} overlay - Overlay
	 * @param {dat.GUI} gui - GUI
	 * @param {String} difficulty - Game difficulty
	 * @constructor
	 */
	constructor(stateManager, scene, overlay, gui, difficulty) {
		super(stateManager, scene);

		this.gameStateManager = new StateManager();
		this.gameStateManager.overlay = overlay;
		this.gameStateManager.film = new GameFilm();

		this.gameStateManager.overlay.showScore();
		this.gameStateManager.overlay.beginTimer();

		this.board = new Board(scene);
		let to = this.board.getBoardCenter();
		let from = vec3.fromValues(to[0], to[1] + 20, to[2] - 15);

		this.camera = new CGFcamera(Math.PI / 2, 0.1, 100.0, from, to);
		if (!this.scene.graph.views.order.includes('defaultgamecam')) {
			this.scene.graph.views.order.push('defaultgamecam');
		}
		this.scene.graph.views.perspectives['defaultgamecam'] = this.camera;
		
		this.scene.interface.setActiveCamera(null);
		this.scene.camera = this.camera;
		
		this.gameStateManager.pushState(new LoadStateCPUvCPU(this.gameStateManager, this.scene, this.board, 'factionOne', difficulty));
		this.gameStateManager.overlay.updateScore(this.board);

		this.gui = gui;
		this.actions = this.gui.addFolder('Actions');
		this.actions.add(this, 'Menu');
		this.filmAvailable = false;
		this.actions.open();
	}

	/** Renders state */
	draw() {
		this.gameStateManager.draw();
	}

	/**
	* Updates state
	* @param {Number} dt - Delta time
	*/
	update(dt) {
		this.gameStateManager.update(dt);
		this.gameStateManager.overlay.update(dt);

		if (!this.filmAvailable && this.gameStateManager.finished) {
			this.actions.add(this, 'Replay');
			this.filmAvailable = true;
		}
	}

	/**
	 * Handles input
	 * @param {Number} keycode - Key code
	 */
	handleInput(keycode) {	
		if (keycode === 82 || keycode === 114) {
			this.resetCamera();
		}
	}

	/** Resets camera */
	resetCamera() {
		let to = this.board.getBoardCenter();
		let from = vec3.fromValues(to[0], to[1] + 20, to[2] - 15);
		let camera = new CGFcamera(Math.PI/2, 0.1, 100.0, from, to);
		this.camera.position = camera.position;
		this.camera.target = camera.target;
		this.camera.direction = camera.direction;
		this.camera._up = camera._up;
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

	/** Handles transition to menu state */
	Menu() {
		this.removeFolder(this.gui, 'Actions');
		this.stateManager.changeState(new Menu(this.stateManager, this.scene, this.gameStateManager.overlay, this.gui));
	}

	/** Handles transition to replay state */
	Replay() {
		this.removeFolder(this.gui, 'Actions');
		this.stateManager.pushState(new Replay(this.stateManager, this.scene, this.gameStateManager.film, this.gameStateManager.overlay, this.gui));
	}
}
