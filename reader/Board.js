class Cell {
    constructor(scene) {
		this.hex = new Hexagon(scene);
    }
}

class Board {
    constructor(scene) {
		this.hex = new HexaPrism(scene);
		this.board = [
			/*[[' ','v',' '],[' ','v',' '],[' ','v',' '],['A','g',' '],['A','g',' '],[' ','2',' '],[' ','0',' '],[' ','v',' '],[' ','v',' ']],
			[[' ','v',' '],[' ','v',' '],['A','g',' '],['A','g',' '],[' ','1',' '],[' ','b',' '],[' ','1',' '],[' ','2',' '],[' ','1',' ']],
			[[' ','v',' '],[' ','v',' '],[' ','0',' '],[' ','1',' '],[' ','3',' '],[' ','z',' '],[' ','3',' '],[' ','w',' '],[' ','0',' ']],
			[[' ','v',' '],[' ','1',' '],[' ','w',' '],[' ','2',' '],[' ','1',' '],[' ','2',' '],[' ','1',' '],[' ','1',' '],[' ','v',' ']],
			[[' ','v',' '],[' ','3',' '],[' ','1',' '],[' ','1',' '],[' ','z',' '],[' ','1',' '],[' ','1',' '],[' ','0',' '],[' ','v',' ']],
			[[' ','v',' '],[' ','0',' '],[' ','1',' '],[' ','1',' '],[' ','2',' '],[' ','1',' '],[' ','w',' '],[' ','3',' '],[' ','v',' ']],
			[[' ','3',' '],[' ','b',' '],[' ','2',' '],[' ','3',' '],[' ','1',' '],[' ','1',' '],[' ','2',' '],[' ','v',' '],[' ','v',' ']],
			[[' ','1',' '],[' ','0',' '],[' ','z',' '],[' ','w',' '],[' ','1',' '],['B','h',' '],['B','h',' '],[' ','v',' '],[' ','v',' ']],
			[[' ','v',' '],[' ','v',' '],[' ','1',' '],[' ','0',' '],['B','h',' '],['B','h',' '],[' ','v',' '],[' ','v',' '],[' ','v',' ']],*/
		];
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
					
					this.objects[i][j].display();
					this.scene.popMatrix();
				}
			}
		}
    }

    setTexCoords() {}

    setBoard(board){
    	this.board=board;
    }
}
