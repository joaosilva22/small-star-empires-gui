class LoadStatePvCPU extends State {
	constructor(stateManager, scene, board, faction, difficulty) {
		super(stateManager, scene);
		console.log('Entered LoadStatePvCPU ...');
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
				if (faction === 'factionOne') {
					self.stateManager.film.addPlay(faction, board.board);
					self.stateManager.changeState(new ShipPickStatePvCPU(self.stateManager, self.scene, self.board, faction, self.difficulty));
				} else {
					self.stateManager.film.addPlay(faction, board.board);
					self.stateManager.changeState(new BotPickStatePvCPU(self.stateManager, self.scene, self.board, faction, self.difficulty));
				}
			});
		} else {
			board.initBoard();
			this.loaded = true;
		}
	}

	update(dt) {
		if (this.loaded) {
			if (this.faction === 'factionOne') {
				this.stateManager.film.addPlay(this.faction, this.board.board);
				this.stateManager.changeState(new ShipPickStatePvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty));
			} else {
				this.stateManager.film.addPlay(this.faction, this.board.board);
				this.stateManager.changeState(new BotPickStatePvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty));
			}
		}
	}

	draw() {
		if (this.board.board.length !== 0) {
			this.board.display();
		}
	}
}

class BotPickStatePvCPU extends State {
	constructor(stateManager, scene, board, faction, difficulty) {
		super(stateManager, scene);
		console.log('Entered BotPickStatePvCPU ...');
		this.board = board;

		let self = this;
		let connection = new Connection();
		if (difficulty === 'easy') {
			// FIXME: Este request nao funciona
			connection.getRandomBoardRequest(faction, board, function(data) {
				let newboard = parseStringArray(data.target.response);
				let play = self.getMovement(newboard);
				stateManager.changeState(new BotMoveShipStatePvCPU(stateManager, scene, board, faction, difficulty, play.from, play.to, play.structure));
			});
		} else {
			connection.playerBestBoardRequest(faction, board, function(data) {
				let newboard = parseStringArray(data.target.response);
				let play = self.getMovement(newboard);
				stateManager.changeState(new BotMoveShipStatePvCPU(stateManager, scene, board, faction, difficulty, play.from, play.to, play.structure));
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

class ShipPickStatePvCPU extends State {
	constructor(stateManager, scene, board, faction, difficulty) {
		super(stateManager, scene);
		console.log('Entered PlayerPickStatePvCPU ...');
		this.board = board;
		this.faction = faction;
		this.difficulty = difficulty;

		this.board.registerShipsForPicking(faction);

		this.beganUndoAnimation = false;
	}

	draw() {
		this.board.display();
	}

	update(dt) {
		this.board.update(dt);

		if (this.beganUndoAnimation) {
			let lastBotPlay = this.stateManager.film.getPreviousPlay();
			let lastPlayerPlay = this.stateManager.film.getBeforePreviousPlay();

			if (lastBotPlay.struct === 'colony') {
				if (this.board.getAuxColony(lastBotPlay.faction).animation.finished) {
					this.board.getAuxColony(lastBotPlay.faction).undoAnimationOffset = null;
					this.botStructUndone = true;
				}
			} else {
				if (this.board.getAuxTradeStation(lastBotPlay.faction).animation.finished) {
					this.board.getAuxTradeStation(lastBotPlay.faction).undoAnimationOffset = null;
					this.botStructUndone = true;
				}
			}

			if (lastPlayerPlay.struct === 'colony') {
				if (this.board.getAuxColony(lastPlayerPlay.faction).animation.finished) {
					this.board.getAuxColony(lastPlayerPlay.faction).undoAnimationOffset = null;
					this.playerStructUndone = true;
				}
			} else {
				if (this.board.getAuxTradeStation(lastPlayerPlay.faction).animation.finished) {
					this.board.getAuxTradeStation(lastPlayerPlay.faction).undoAnimationOffset = null;
					this.playerStructUndone = true;
				}
			}

			if (this.botStructUndone && this.playerStructUndone && this.board.getShipAt(lastBotPlay.to).animation.finished) {
				this.board.board = lastPlayerPlay.newBoard;
				this.board.board[lastPlayerPlay.to.z][lastPlayerPlay.to.x][2] = ' ';
				this.stateManager.film.goBackOne();
				this.stateManager.film.goBackOne();
				this.stateManager.changeState(new StructBuildStatePvCPU(this.stateManager, this.scene, this.board, lastPlayerPlay.faction, this.difficulty, lastPlayerPlay.to));
			}
		}
	}

	handleInput(keycode) {
		if (!this.beganUndoAnimation) {
			let selectedCell = this.getPickedCell();
			if (selectedCell !== null && selectedCell.pickable) {
				this.board.resetPickRegistration();
				this.board.selectCell(selectedCell.position);
				this.stateManager.changeState(new MovePickStatePvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty, selectedCell));
			}

			if (keycode === 37) {
				this.undo();
			}
		}
	}

	undo() {
		if (!this.beganUndoAnimation) {
			let lastBotPlay = this.stateManager.film.getPreviousPlay();
			let lastPlayerPlay = this.stateManager.film.getBeforePreviousPlay();
			if (lastBotPlay) {
				this.board.board[lastBotPlay.to.z][lastBotPlay.to.x][2] = ' ';

				if (lastBotPlay.struct === 'colony') {
					this.board.pushAuxColony(lastBotPlay.faction);

					let src = this.board.getAuxColonyPosition(lastBotPlay.faction);
					let dest = this.board.getScenePosition(lastBotPlay.to);
					let pls = {x: dest.x - src.x, y: dest.y - src.y, z: dest.z - src.z};

					this.board.getAuxColony(lastBotPlay.faction).animation = new HopAnimation(1, dest, src);
					this.board.getAuxColony(lastBotPlay.faction).undoAnimationOffset = pls;
					this.board.getAuxColony(lastBotPlay.faction).animation.play();
					this.beganUndoAnimation = true;
				} else {
					this.board.pushAuxTradeStation(lastBotPlay.faction);

					let src = this.board.getAuxColonyPosition(lastBotPlay.faction);
					let dest = this.board.getScenePosition(lastBotPlay.to);
					let pls = {x: dest.x - src.x, y: dest.y - src.y, z: dest.z - src.z};

					this.board.getAuxTradeStation(lastBotPlay.faction).animation = new HopAnimation(1, dest, src);
					this.board.getAuxTradeStation(lastBotPlay.faction).undoAnimationOffset = pls;
					this.board.getAuxTradeStation(lastBotPlay.faction).animation.play();
					this.beganUndoAnimation = true;
				}

				this.board.getShipAt(lastBotPlay.to).animation = new HopAnimation(1, this.board.getScenePosition(lastBotPlay.to), this.board.getScenePosition(lastBotPlay.from));
				this.board.getShipAt(lastBotPlay.to).animation.play();
				this.beganUndoAnimation = true;

				this.board.board[lastPlayerPlay.to.z][lastPlayerPlay.to.x][2] = ' ';

				if (lastPlayerPlay.struct === 'colony') {
					this.board.pushAuxColony(lastPlayerPlay.faction);

					let src = this.board.getAuxColonyPosition(lastPlayerPlay.faction);
					let dest = this.board.getScenePosition(lastPlayerPlay.to);
					let pls = {x: dest.x - src.x, y: dest.y - src.y, z: dest.z - src.z};

					this.board.getAuxColony(lastPlayerPlay.faction).animation = new HopAnimation(1, dest, src);
					this.board.getAuxColony(lastPlayerPlay.faction).undoAnimationOffset = pls;
					this.board.getAuxColony(lastPlayerPlay.faction).animation.play();
					this.beganUndoAnimation = true;
				} else {
					this.board.pushAuxTradeStation(lastPlayerPlay.faction);

					let src = this.board.getAuxTradeStationPosition(lastPlayerPlay.faction);
					let dest = this.board.getScenePosition(lastPlayerPlay.to);
					let pls = {x: dest.x - src.x, y: dest.y - src.y, z: dest.z - src.z};

					this.board.getAuxTradeStation(lastPlayerPlay.faction).animation = new HopAnimation(1, dest, src);
					this.board.getAuxTradeStation(lastPlayerPlay.faction).undoAnimationOffset = pls;
					this.board.getAuxTradeStation(lastPlayerPlay.faction).animation.play();
					this.beganUndoAnimation = true;
				}
			} else {
				this.stateManager.overlay.alert('Can\'t undo anymore', 700);
			}
		}
	}

	getPickedCell() {
		let self = this;
		let cell = null;
		if (this.scene.pickMode === false && this.scene.pickResults !== null) {
			this.scene.pickResults.forEach(function(result) {
				let pickId = result[1];
				cell = self.board.getCellByPickId(pickId);
			});
			this.scene.pickResults.splice(0, this.scene.pickResults.length);
		}
		return cell;
	}
}

class MovePickStatePvCPU extends State {
	constructor(stateManager, scene, board, faction, difficulty, selected) {
		super(stateManager, scene);
		console.log('Entered MovePickStatePvCPU ...');
		this.board = board;
		this.faction = faction;
		this.difficulty = difficulty;
		this.selected = selected;

		this.board.initBoard();
		this.board.selectCell(selected.position);

		let connection = new Connection();
		let possibleBoards = null;

		let self = this;
		connection.shipPossibleMovementsRequest(faction, board, selected.position, function(data) {
			possibleBoards = parseStringArray(data.target.response);
			let moves = self.getPossibleMovements(possibleBoards);
			moves.forEach(function(position) {
				self.board.registerCellForPicking(position);
			});
		});	
	}

	draw() {
		this.board.display();
	}

	handleInput(keycode) {
		let selectedCell = this.getPickedCell();
		if (selectedCell !== null && selectedCell.pickable) {
			this.board.resetPickRegistration();
			this.board.resetSelection();
			this.stateManager.changeState(new MoveShipStatePvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty, this.selected.position, selectedCell.position));
		} else if (selectedCell !== null && !selectedCell.pickable) {
			this.board.resetPickRegistration();
			this.board.resetSelection();
			this.stateManager.changeState(new ShipPickStatePvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty));
		}

		if (keycode === 37) {
			this.undo();
		}
	}

	undo() {
		this.board.resetPickRegistration();
		this.board.resetSelection();
		this.board.board = this.stateManager.film.getPlay().prevBoard;
		this.stateManager.changeState(new ShipPickStatePvCPU(this.stateManager, this.scene, this.board, this.stateManager.film.getPlay().faction, this.difficulty));
	}

	getPossibleMovements(possibleBoards) {
		let movements = [];
		let self = this;
		possibleBoards.forEach(function(possibility) {
			for (let i = 0; i < possibility.length; i++) {
				for (let j = 0; j < possibility.length; j++) {
					if (possibility[i][j][0] === 'A' && self.board.board[i][j][0] !== 'A') {
						movements.push({x: j, z: i});
					}
					if (possibility[i][j][0] === 'B' && self.board.board[i][j][0] !== 'B') {
						movements.push({x: j, z: i});
					}
				}
			}
		});
		return movements;
	}

	getPickedCell() {
		let self = this;
		let cell = null;
		if (this.scene.pickMode === false && this.scene.pickResults !== null) {
			this.scene.pickResults.forEach(function(result) {
				let pickId = result[1];
				cell = self.board.getCellByPickId(pickId);
			});
			this.scene.pickResults.splice(0, this.scene.pickResults.length);
		}
		return cell;
	}
}

class BotMoveShipStatePvCPU extends State {
	constructor(stateManager, scene, board, faction, difficulty, from, to, structure) {
		super(stateManager, scene);
		console.log('Entered BotMoveShipStatePvCPU ...');
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
			this.board.resetPickRegistration();
			this.board.resetSelection();
			this.stateManager.changeState(new BotStructBuildStatePvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty, this.to, this.structure));
		}
	}
}

class MoveShipStatePvCPU extends State {
	constructor(stateManager, scene, board, faction, difficulty, from, to) {
		super(stateManager, scene);
		console.log('Entered MoveShipStatePvCPU ...');
		this.board = board;
		this.faction = faction;
		this.difficulty = difficulty;
		this.from = from;
		this.to = to;

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
			this.board.resetPickRegistration();
			this.board.resetSelection();
			this.stateManager.changeState(new StructBuildStatePvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty, this.to));
		}
	}
}

class BotStructBuildStatePvCPU extends State {
	constructor(stateManager, scene, board, faction, difficulty, position, structure) {
		super(stateManager, scene);
		console.log('Entered BotStructBuildStatePvCPU ...');
		this.board = board;
		this.faction = faction;
		this.difficulty = difficulty;
		this.position = position;
		this.structure = structure;

		if (structure === 'colony') {
			this.board.getAuxColony(this.faction).animation = new HopAnimation(1, this.board.getAuxColonyPosition(this.faction), this.board.getScenePosition(this.position));
			this.board.getAuxColony(this.faction).animation.play();
			this.beganColonyAnimation = true;
		} else {
			this.board.getAuxTradeStation(this.faction).animation = new HopAnimation(1, this.board.getAuxTradeStationPosition(this.faction), this.board.getScenePosition(this.position));
			this.board.getAuxTradeStation(this.faction).animation.play();
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
			this.stateManager.changeState(new TestEndStatePvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty));
		}

		if (this.beganTradeStationAnimation && this.board.getAuxTradeStation(this.faction).animation.finished) {
			let structAuxPos = this.board.popAuxTradeStation(this.faction);
			this.stateManager.film.setPlayStruct('tradeStation', structAuxPos);
			
			this.board.placeTradeStation(this.position, this.faction);
			this.stateManager.changeState(new TestEndStatePvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty));
		}
	}

	draw() {
		this.board.display();
	}
}

class StructBuildStatePvCPU extends State {
	constructor(stateManager, scene, board, faction, difficulty, position) {
		super(stateManager, scene);
		console.log('Entered StructBuildStatePvCPU ...');
		this.board = board;
		this.faction = faction;
		this.difficulty = difficulty;
		this.position = position;

		this.beganColonyAnimation = false;
		this.beganTradeStationAnimation = false;

		this.beganUndoAnimation = false;

		this.board.initBoard();
		this.board.selectCell(position);

		stateManager.overlay.updateTip('Press c/C to place a Colony, or t/T to place a Trade Station');
	}

	draw() {
		this.board.display();
	}

	update(dt) {
		this.board.update(dt);
		
		if (this.beganColonyAnimation && this.board.getAuxColony(this.faction).animation.finished) {
			let structAuxPos = this.board.popAuxColony(this.faction);
			this.stateManager.film.setPlayStruct('colony', structAuxPos);
			
			this.board.placeColony(this.position, this.faction);
			this.stateManager.changeState(new TestEndStatePvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty));
		}

		if (this.beganTradeStationAnimation && this.board.getAuxTradeStation(this.faction).animation.finished) {
			let structAuxPos = this.board.popAuxTradeStation(this.faction);
			this.stateManager.film.setPlayStruct('tradeStation', structAuxPos);
			
			this.board.placeTradeStation(this.position, this.faction);
			this.stateManager.changeState(new TestEndStatePvCPU(this.stateManager, this.scene, this.board, this.faction, this.difficulty));
		}

		if (this.beganUndoAnimation) {
			let play = this.stateManager.film.getPlay();
			let selected = this.board.getCellAt(play.from);
			if (this.board.getShipAt(play.to).animation.finished) {
				this.board.board = play.prevBoard;
				this.stateManager.changeState(new MovePickStatePvCPU(this.stateManager, this.scene, this.board, play.faction, this.difficulty, selected));
			}
		}
	}

	handleInput(keycode) {
		if (!this.beganColonyAnimation && !this.beganTradeStationAnimation && !this.beganUndoAnimation) {
			if (keycode === 67 || keycode === 99) {
				this.stateManager.overlay.updateTip('');
				this.board.getAuxColony(this.faction).animation = new HopAnimation(1, this.board.getAuxColonyPosition(this.faction), this.board.getScenePosition(this.position));
				this.board.getAuxColony(this.faction).animation.play();
				this.beganColonyAnimation = true;
			}
			if (keycode === 84 || keycode === 116) {
				this.stateManager.overlay.updateTip('');
				this.board.getAuxTradeStation(this.faction).animation = new HopAnimation(1, this.board.getAuxTradeStationPosition(this.faction), this.board.getScenePosition(this.position));
				this.board.getAuxTradeStation(this.faction).animation.play();
				this.beganTradeStationAnimation = true;
			}
			if (keycode === 37) {
				this.undo();
			}
		}
	}

	undo() {
		if (!this.beganColonyAnimation && !this.beganTradeStationAnimation && !this.beganUndoAnimation) {
			this.stateManager.overlay.updateTip('');
			let play = this.stateManager.film.getPlay();
			this.board.getShipAt(play.to).animation = new HopAnimation(1, this.board.getScenePosition(play.to), this.board.getScenePosition(play.from));
			this.board.getShipAt(play.to).animation.play();
			this.beganUndoAnimation = true;
		}
	}
}

class TestEndStatePvCPU extends State {
	constructor(stateManager, scene, board, faction, difficulty) {
		super(stateManager, scene);
		this.board = board;

		let connection = new Connection();
		connection.isGameOverRequest(board, function(data) {
			if (data.target.response === '0') {
				stateManager.changeState(new LoadStatePvCPU(stateManager, scene, board, faction, difficulty));
			} else {
				stateManager.changeState(new GameOverStatePvCPU(stateManager, scene, board));
			}
		});

		this.stateManager.overlay.updateScore(this.board);
	}

	draw() {
		this.board.display();
	}
}

class GameOverStatePvCPU extends State {
	constructor(stateManager, scene, board) {
		super(stateManager, scene);
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

	draw() {
		this.board.display();
	}
}

class PvCPU extends State {
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

		this.scene.camera = this.camera;
		this.scene.interface.setActiveCamera(this.camera);
		
		this.gameStateManager.pushState(new LoadStatePvCPU(this.gameStateManager, this.scene, this.board, 'factionOne', difficulty));
		this.gameStateManager.overlay.updateScore(this.board);

		this.gui = gui;
		this.actions = this.gui.addFolder('Actions');
		this.actions.add(this, 'Menu');
		this.actions.add(this, 'Undo');
		this.filmAvailable = false;
		this.actions.open();
	}

	draw() {
		this.scene.clearPickRegistration();
		this.gameStateManager.draw();
	}

	update(dt) {
		this.gameStateManager.update(dt);
		this.gameStateManager.overlay.update(dt);

		if (!this.filmAvailable && this.gameStateManager.finished) {
			this.actions.add(this, 'Replay');
			this.filmAvailable = true;
		}
	}

	handleInput(keycode) {
		this.gameStateManager.handleInput(keycode);

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
		this.stateManager.changeState(new Menu(this.stateManager, this.scene, this.gameStateManager.overlay, this.gui));
	}
	
	Undo() {
		if (this.gameStateManager.getCurrentState().undo) {
			this.gameStateManager.getCurrentState().undo();
		}
	}

	Replay() {
		this.removeFolder(this.gui, 'Actions');
		this.stateManager.pushState(new Replay(this.stateManager, this.scene, this.gameStateManager.film, this.gameStateManager.overlay, this.gui));
	}
}
