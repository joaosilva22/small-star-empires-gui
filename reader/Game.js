class LoadingState extends State {
	constructor(stateManager, scene) {
		super(stateManager, scene);
		console.log('Entered loading state');
		this.board = new Board(scene);
	}

	update(dt) {
		if (this.board.loaded) {
			console.log('Board loading complete');
			this.stateManager.changeState(new MovePickingState(this.stateManager, this.scene, this.board, 'factionOne'));
		}
	}
}

class MovePickingState extends State {
	constructor(stateManager, scene, board, faction) {
		super(stateManager, scene);
		this.board = board;

		this.board.registerShipsForPicking(faction);
	}

	draw() {
		this.scene.clearPickRegistration();
		this.board.display();
	}

	handleInput() {
		let selectedCell = this.getSelectedCell();
		if (selectedCell !== null && selectedCell.pickable) {
			this.board.resetPickRegistration();
			this.board.selectCell(selectedCell.position);
			this.stateManager.changeState(new EmptyState(this.stateManager, this.scene, this.board));
		}
	}

	getSelectedCell() {
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
		this.gameStateManager.pushState(new LoadingState(stateManager, scene));
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

