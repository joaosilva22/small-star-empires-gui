class LoadingState extends State {
	constructor(stateManager, scene) {
		super(stateManager, scene);
		console.log('Entered loading state');
		this.board = new Board(scene);
	}

	update(dt) {
		if (this.board.loaded) {
			console.log('Board loading complete');
			this.stateManager.changeState(new EmptyState(this.stateManager, this.scene, this.board));
		}
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

