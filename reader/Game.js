class LoadingState extends State {
	constructor(stateManager, scene, board) {
		super(stateManager, scene);
		console.log('Entered loading state');

		let self = this;
		board.load(function() {
			console.log('Board loading complete');
			self.stateManager.changeState(new ShipPickingState(self.stateManager, self.scene, board, 'factionOne'));
		});
	}
}

class ShipPickingState extends State {
	constructor(stateManager, scene, board, faction) {
		super(stateManager, scene);
		this.board = board;
		this.faction = faction;

		this.board.registerShipsForPicking(faction);

		console.log('Entered ship picking state')
	}

	draw() {
		this.scene.clearPickRegistration();
		this.board.display();
	}

	handleInput() {
		let selectedCell = this.getPickedCell();
		if (selectedCell !== null && selectedCell.pickable) {
			this.board.resetPickRegistration();
			this.board.selectCell(selectedCell.position);
			this.stateManager.changeState(new MovePickingState(this.stateManager, this.scene, this.board, this.faction, selectedCell));
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

class MovePickingState extends State {
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
	}

	draw() {
		this.scene.clearPickRegistration();
		this.board.display();
	}

	handleInput() {
		let selectedCell = this.getPickedCell();
		if (selectedCell !== null && selectedCell.pickable) {
			// TODO:
			// movimentar a nave
			console.log('Clicked in');
		}
		if (selectedCell !== null && !selectedCell.pickable) {
			this.board.resetPickRegistration();
			this.board.resetSelection();
			this.stateManager.changeState(new ShipPickingState(this.stateManager, this.scene, this.board, this.faction));
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

		let connection = new Connection();		
	}
}

class EmptyState extends State {
	constructor(stateManager, scene, board) {
		super(stateManager, scene);
		console.log('Entered empty state');
		this.board = board;
	}

	draw() {
		this.board.display();
	}
}

class Game extends State {
	constructor(stateManager, scene) {
		super(stateManager, scene);
		this.gameStateManager = new StateManager();
		this.gameStateManager.pushState(new LoadingState(stateManager, scene, new Board(scene)));
	}

	draw() {
		this.gameStateManager.draw();
	}

	update(dt) {
		this.gameStateManager.update(dt);
	}

	handleInput() {
		this.gameStateManager.handleInput();
	}
	
}

