class LoadStateCPUvCPU extends State {
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

	update(dt) {
		if (this.loaded) {
			this.stateManager.film.addPlay(this.faction, this.board.board);
			this.stateManager.changeState(new BotPickStateCPUvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty));
		}
	}

	draw() {
		if (this.board.board.length !== 0) {
			this.board.display();
		}
	}
}

class BotPickStateCPUvCPU extends State {
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

	draw() {
		this.board.display();
	}

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

	draw() {
		this.board.display();
	}
	
	update(dt) {
		this.board.update(dt);

		if (this.beganAnimation && this.board.getShipAt(this.from).animation.finished) {
			this.stateManager.changeState(new BotStructBuildStateCPUvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty, this.to, this.structure));
		}
	}
}

class BotStructBuildStateCPUvCPU extends State {
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

	draw() {
		this.board.display();
	}
}

class TestEndStateCPUvCPU extends State {
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

	draw() {
		this.board.display();
	}
}

class GameOverStateCPUvCPU extends State {
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
	}

	draw() {
		this.board.display();
	}
}

class CPUvCPU extends State {
	constructor(stateManager, scene) {
		super(stateManager, scene);

		this.gameStateManager = new StateManager();
		this.gameStateManager.overlay = new Overlay();
		this.gameStateManager.film = new GameFilm();
		this.gameStateManager.overlay.beginTimer();

		this.board = new Board(scene);
		let to = this.board.getBoardCenter();
		let from = vec3.fromValues(to[0], to[1] + 20, to[2] - 15);

		this.camera = new CGFcamera(Math.PI / 2, 0.1, 100.0, from, to);
		this.scene.graph.views.order.push('defaultgamecam');
		this.scene.graph.views.perspectives['defaultgamecam'] = this.camera;
		
		this.scene.interface.setActiveCamera(null);
		this.scene.camera = this.camera;
		
		// FIXME: A dificuldade deve ser passada como parametro
		this.gameStateManager.pushState(new LoadStateCPUvCPU(this.gameStateManager, this.scene, new Board(scene), 'factionOne', 'hard'));
	}

	draw() {
		this.gameStateManager.draw();
	}

	update(dt) {
		this.gameStateManager.update(dt);
		this.gameStateManager.overlay.update(dt);
	}

	handleInput(keycode) {	
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
}
