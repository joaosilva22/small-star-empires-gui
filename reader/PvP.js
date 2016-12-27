class LoadState extends State {
	constructor(stateManager, scene, board, faction) {
		super(stateManager, scene);
		console.log('Entered loading state');
		this.board = board;

		if (faction === 'factionOne') {
			this.faction = 'factionTwo';
		} else {
			this.faction = 'factionOne';
		}

		this.loaded = false;

		let self = this;
		if (board.board.length === 0) {
			board.load(function() {
				self.stateManager.changeState(new ShipPickState(self.stateManager, self.scene, board, faction));
			});
		} else {
			board.initBoard();
			this.loaded = true;
		}
	}

	update(dt) {
		if (this.loaded) {
			this.stateManager.changeState(new ShipPickState(this.stateManager, this.scene, this.board, this.faction));
		}
	}

	draw() {
		if (this.board.board.length !== 0) {
			this.board.display();
		}
	}
}

class ShipPickState extends State {
	constructor(stateManager, scene, board, faction) {
		super(stateManager, scene);
		console.log('Entered ship picking state');
		this.board = board;
		this.faction = faction;

		this.board.registerShipsForPicking(faction);
	}

	draw() {
		this.board.display();
	}

	handleInput() {
		let selectedCell = this.getPickedCell();
		if (selectedCell !== null && selectedCell.pickable) {
			this.board.resetPickRegistration();
			this.board.selectCell(selectedCell.position);
			this.stateManager.changeState(new MovePickState(this.stateManager, this.scene, this.board, this.faction, selectedCell));
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

class MovePickState extends State {
	constructor(stateManager, scene, board, faction, selected) {
		super(stateManager, scene);
		this.board = board;
		this.faction = faction;
		this.selected = selected;

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

		console.log('Entered move picking state')
	}

	draw() {
		this.scene.clearPickRegistration();
		this.board.display();
	}

	handleInput() {
		let selectedCell = this.getPickedCell();
		if (selectedCell !== null && selectedCell.pickable) {
			this.board.resetPickRegistration();
			this.board.resetSelection();
			this.stateManager.changeState(new MoveShipState(this.stateManager, this.scene, this.board, this.faction, this.selected.position, selectedCell.position));
		} else if (selectedCell !== null && !selectedCell.pickable) {
			this.board.resetPickRegistration();
			this.board.resetSelection();
			this.stateManager.changeState(new ShipPickState(this.stateManager, this.scene, this.board, this.faction));
		}
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

class MoveShipState extends State {
	constructor(stateManager, scene, board, faction, from, to) {
		super(stateManager, scene);
		console.log('Entered ship moving state');
		this.board = board;
		this.faction = faction;
		this.from = from;
		this.to = to;

		this.beganAnimation = false;

		let self = this;
		let connection = new Connection();
		connection.moveShipRequest(board, faction, from.x, from.z, to.x, to.z, function(data) {
			board.board = parseStringArray(data.target.response.replace(/%20/g, " "));

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
			this.stateManager.changeState(new StructureBuildState(this.stateManager, this.scene, this.board, this.faction, this.to));
		}
	}
}

class StructureBuildState extends State {
	constructor(stateManager, scene, board, faction, position) {
		super(stateManager, scene);
		console.log('Entered structure pick state');
		this.board = board;
		this.faction = faction;
		this.position = position;

		this.board.initBoard();
		this.board.selectCell(position);
	}

	draw() {
		this.board.display();
	}

	handleInput(keycode) {
		if (keycode) {
			switch (keycode) {
				case 67:
				case 99:
					this.board.placeColony(this.position, this.faction);
					this.stateManager.changeState(new TestEndState(this.stateManager, this.scene, this.board, this.faction));
					break;
				case 84:
				case 116:
					this.board.placeTradeStation(this.position, this.faction);
					this.stateManager.changeState(new TestEndState(this.stateManager, this.scene, this.board, this.faction));
					break;
			}
		}
	}
}

class TestEndState extends State {
	constructor(stateManager, scene, board, faction) {
		super(stateManager, scene);
		console.log('Entered end testing state');
		this.board = board;

		let connection = new Connection();
		connection.isGameOverRequest(board, function(data) {
			if (data.target.response === '0') {
				stateManager.changeState(new LoadState(stateManager, scene, board, faction));
			} else {
				stateManager.changeState(new GameOverState(stateManager, scene, board));
			}
		});
	}
	
	draw() {
		this.board.display();
	}
}

class GameOverState extends State {
	constructor(stateManager, scene, board) {
		super(stateManager, scene);
		console.log('Entered game over state');
		this.board = board;

		board.initBoard();
	}

	draw() {
		this.board.display();
	}
}

class PvP extends State {
	constructor(stateManager, scene) {
		super(stateManager, scene);
		
		this.gameStateManager = new StateManager();
		this.gameStateManager.pushState(new LoadState(this.gameStateManager, this.scene, new Board(scene), 'factionOne'));
	}

	draw() {
		this.scene.clearPickRegistration();
		this.gameStateManager.draw();
	}

	update(dt) {
		this.gameStateManager.update(dt);
	}

	handleInput(keycode) {
		this.gameStateManager.handleInput(keycode);
	}
	
}

