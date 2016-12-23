
class Board {
    constructor(scene) {
		this.hex = new HexaPrism(scene);
		this.board = [];
		
		this.n = new Connection();
		this.n.getBoardRequest(this);
		
		this.scene = scene;
		this.distance = Math.sqrt(3)/2;

		this.objects = [];
		this.initBoard();
    }

	initBoard() {
		for (let i = 0; i < this.board.length; i++) {
			let line = this.board[i];
			this.objects.push([]);
			for (let j = 0; j < line.length; j++) {
				this.objects[i].push(new HexaPrism(this.scene));
			}
		}
	}

    getMapLayer(cell) {
		return cell[1];
    }

    display() {
		if (!this.board) {
			return;
		}

		for (let i = 0; i < this.board.length; i++) {
			let line = this.board[i];
			for (let j = 0; j < line.length; j++) {
				let cell = line[j];
				if (this.getMapLayer(cell) !== 'v') {
					this.scene.pushMatrix();

					this.scene.scale(5, 5, 5);

					this.scene.translate(-5.5 * this.distance, 0, -3.5 * this.distance);

					if (i % 2 === 0) {
						let offset = i * this.distance / 2;
						this.scene.translate(j * this.distance + offset, this.objects[i][j].verticalOffset, i * 0.75);
					} else {
						let offset = (i * this.distance - this.distance) / 2;
						this.scene.translate(j * this.distance + this.distance / 2 + offset, this.objects[i][j].verticalOffset, i * 0.75);
					}
					
					this.objects[i][j].display(this.getMapLayer(cell));
					this.scene.popMatrix();
				}
			}
		}
    }

	setTexCoords() {};

    setBoard(board){
    	this.board=board;
    }
}
