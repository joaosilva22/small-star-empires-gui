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

	update(dt) {
	}

	handleInput() {
		this.logPicking();
	}

	logPicking() {
		if (this.scene.pickMode === false) {
			if (this.scene.pickResults !== null) {
				for (let i = 0; i < this.scene.pickResults.length; i++) {
					let obj = this.scene.pickResults[i][0];
					if (obj) {
						let pickId = this.scene.pickResults[i][1];
						//console.log(`Picked object ${obj} with pick id ${pickId}`);

						let pickedCell = this.board.getCellByPickId(pickId);
						if (pickedCell !== null && pickedCell.pickable) {
							console.log(`Pickable object! (id = ${pickId})`);
						}
					}
					
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
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

