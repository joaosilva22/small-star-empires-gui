
class Cell extends CGFobject {
    constructor(scene, type, position) {
		super(scene);
		this.side = new Rectangle(scene, 0.25, 0, -0.25, -1);
		this.hex = new Hexagon(scene);

		this.type = type;
		this.position = position;

		this.pickId = (this.position.x + 1) * 10 + this.position.z + 1;
		this.pickable = false;
		this.selected = false;
	}

	display(textures, shaders) {
		let initial = Math.PI/6;
		for (let i = 0; i < 6; i++) {
			let angle = Math.PI/6 + i * Math.PI / 3;
			this.scene.pushMatrix();
			this.scene.rotate(angle, 0, 1, 0);
			this.scene.translate(0, 0, Math.sqrt(3) / 4);
			textures['base'].bind();
			this.side.display();
			this.scene.popMatrix();
		}

		this.scene.pushMatrix();
		textures[this.type].bind();
		if (this.pickable) this.scene.setActiveShader(shaders['pickable']);
		if (this.selected) this.scene.setActiveShader(shaders['selected']);
		this.scene.registerForPick(this.pickId, this.hex);
		this.hex.display();
		this.scene.popMatrix();
		this.scene.setActiveShader(this.scene.defaultShader);
    }
}

class Ship extends CGFobject {
	constructor(scene, faction, position) {
		super(scene);
		this.geometry = new Cylinder(scene, 0.2, 0, 1, 6, 6);
		this.scene = scene;

		this.faction = faction;
		this.position = position;

		this.pickId = (this.position.x + 1) * 10 + this.position.z + 1;
		this.pickable = false;
	}

	display(textures) {
		this.scene.pushMatrix();
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		textures[this.faction].bind();
		this.scene.registerForPick(this.pickId, this.geometry);
		this.geometry.display();
		this.scene.popMatrix();
	}
}

class TradeStation extends CGFobject {
	constructor(scene, faction) {
		super(scene);
		this.geometry = new Sphere(scene, 0.1, 24, 24);
		this.scene = scene;

		this.faction = faction;
	}

	display(textures) {
		this.scene.pushMatrix();
		this.scene.translate(0.3,0.1,-0.2);
		textures[this.faction].bind();
		this.geometry.display();
		this.scene.popMatrix();
	}
}

class Colony extends CGFobject {
	constructor(scene, faction) {
		super(scene);
		this.geometry = new Cylinder(scene, 0.1, 0.1, 0.25, 6, 6);

		this.faction = faction;
	}

	display(textures) {
		this.scene.pushMatrix();
		this.scene.translate(-0.3,0,0.2);
		this.scene.rotate(-Math.PI / 2, 1, 0, 0);
		textures[this.faction].bind();
		this.geometry.display();
		this.scene.popMatrix();
	}
}

class Board extends CGFobject{
    constructor(scene) {
		super(scene);

		this.board = [];
		this.cells = [];
		this.ships = [];
		
		this.distance = Math.sqrt(3)/2;
		this.textures = {
			'factionOne' : new CGFtexture(this.scene, 'resources/relaig/base.png'),
			'factionTwo' : new CGFtexture(this.scene, 'resources/relaig/base.png'),
			'base' : new CGFtexture(this.scene, 'resources/relaig/base.png'),
			'0': new CGFtexture(this.scene, 'resources/relaig/empty.png'),
			'1': new CGFtexture(this.scene, 'resources/relaig/one-planet.png'),
			'2': new CGFtexture(this.scene, 'resources/relaig/two-planet.png'),
			'3': new CGFtexture(this.scene, 'resources/relaig/three-planet.png'),
			'g': new CGFtexture(this.scene, 'resources/relaig/blue-home.png'),
			'h': new CGFtexture(this.scene, 'resources/relaig/yellow-home.png'),
			'z': new CGFtexture(this.scene, 'resources/relaig/red-nebula.png'),
			'w': new CGFtexture(this.scene, 'resources/relaig/wormhole.png'),
			'b': new CGFtexture(this.scene, 'resources/relaig/blackhole.png')
		};

		this.shaders = {
			'pickable': new CGFshader(this.scene.gl, 'shaders/pickable.vert', 'shaders/pickable.frag'),
			'selected': new CGFshader(this.scene.gl, 'shaders/selected.vert', 'shaders/selected.frag')
		};

		this.colonyFactionOne = new Colony(this.scene, 'factionOne');
		this.colonyFactionTwo = new Colony(this.scene, 'factionTwo');
		this.tradeStationFactionOne = new TradeStation(this.scene, 'factionOne');
		this.tradeStationFactionTwo = new TradeStation(this.scene, 'factionTwo');

    }

	load(onLoad) {
		let connection = new Connection();
		let self = this;
		connection.getBoardRequest(function(data) {
			self.board = parseStringArray(data.target.response);
			self.initBoard();
			onLoad();
		});
	}

	initBoard() {
		this.cells = [];
		this.ships = [];

		for (let i = 0; i < this.board.length; i++) {
			let line = this.board[i];
			for (let j = 0; j < line.length; j++) {
				if (this.getMapLayer(this.board[i][j]) !== 'v') {
					this.cells.push(new Cell(this.scene, this.getMapLayer(this.board[i][j]), {x: j, z: i}));
				}
				
				if (this.getMovementLayer(this.board[i][j]) === 'A') {
					this.ships.push(new Ship(this.scene, 'factionOne', {x: j, z: i}));
				}
				if (this.getMovementLayer(this.board[i][j][0]) === 'B') {
					this.ships.push(new Ship(this.scene, 'factionTwo', {x: j, z: i}));
				}
			}
		}
	}

	getMovementLayer(cell) {
		return cell[0];
	}
	
    getMapLayer(cell) {
		return cell[1];
    }

	getStructureLayer(cell) {
		return cell[2];
	}

	registerCellForPicking(position) {
		this.cells.forEach(function(cell) {
			if (cell.position.x === position.x && cell.position.z === position.z) {
				cell.pickable = true;
			}
		});
	}

	registerShipsForPicking(faction) {
		let self = this;
		this.ships.forEach(function(ship) {
			if (ship.faction === faction) {
				self.registerCellForPicking(ship.position);
			}
		});
	}

	resetPickRegistration() {
		this.cells.forEach(function(cell) {
			cell.pickable = false;
		});
	}

	selectCell(position) {
		this.cells.forEach(function(cell) {
			if (cell.position.x === position.x && cell.position.z === position.z) {
				cell.selected = true;
			}
		});
	}

	resetSelection() {
		this.cells.forEach(function(cell) {
			cell.selected = false;
		});
	}

	getCellByPickId(pickId) {
		let ret = null;
		this.cells.forEach(function(cell) {
			if (cell.pickId === pickId) {
				ret = cell;
			}
		});
		return ret;
	}

	placeColony(position, faction) {
		if (faction === 'factionOne') {
			this.board[position.z][position.x][2] = 'o';
		}
		if (faction === 'factionTwo') {
			this.board[position.z][position.x][2] = 'p';
		}
	}

	placeTradeStation(position, faction) {
		if (faction === 'factionOne') {
			this.board[position.z][position.x][2] = 'l';
			console.log(this.board[position.z][position.x][2]);
		}
		if (faction === 'factionTwo') {
			this.board[position.z][position.x][2] = 'k';
		}
	}

    display() {
		let self = this;
		
		this.cells.forEach(function(cell) {
			self.scene.pushMatrix();
			self.scene.scale(5, 5, 5);
			self.scene.translate(-5.5 * self.distance, 0, -3.5 * self.distance);

			if (cell.position.z % 2 === 0) {
				let offset = cell.position.z * self.distance / 2;
				self.scene.translate(cell.position.x * self.distance + offset, 0, cell.position.z * 0.75);
			} else {
				let offset = (cell.position.z * self.distance - self.distance) / 2;
				self.scene.translate(cell.position.x * self.distance + self.distance / 2 + offset, 0, cell.position.z * 0.75);
			}

			cell.display(self.textures, self.shaders);
			self.scene.popMatrix();
		});
		
		this.ships.forEach(function(ship) {
			self.scene.pushMatrix();
			self.scene.scale(5, 5, 5);
			self.scene.translate(-5.5 * self.distance, 0, -3.5 * self.distance);
			
			if (ship.position.z % 2 === 0) {
				let offset = ship.position.z * self.distance / 2;
				self.scene.translate(ship.position.x * self.distance + offset, 0, ship.position.z * 0.75);
			} else {
				let offset = (ship.position.z * self.distance - self.distance) / 2;
				self.scene.translate(ship.position.x * self.distance + self.distance / 2 + offset, 0, ship.position.z * 0.75);
			}

			ship.display(self.textures);
			self.scene.popMatrix();
		});

		for (let i = 0; i < this.board.length; i++) {
			for (let j = 0; j < this.board.length; j++) {
				this.scene.pushMatrix();
				this.scene.scale(5, 5, 5);
				this.scene.translate(-5.5 * this.distance, 0, -3.5 * this.distance);
				var posX;
				var posZ;
				if (i % 2 === 0) {
					let offset = i * this.distance / 2;
					this.scene.translate(j * this.distance + offset, 0, i * 0.75);
//					this.scene.translate(j * this.distance + offset, 0, i * 0.75);
				} else {
					let offset = (i * this.distance - this.distance) / 2;
					this.scene.translate(j * this.distance + this.distance / 2 + offset, 0, i * 0.75);
//					this.scene.translate(j * this.distance + this.distance / 2 + offset, 0, i * 0.75);
				}
				
				switch (this.board[i][j][2]) {
					case 'o':
						console.log('displaying colony');
						this.colonyFactionOne.display(this.textures);
						break;
					case 'p':
						this.colonyFactionTwo.display(this.textures);
						break;
					case 'l':
						console.log('displaying tradeStation');
						this.tradeStationFactionOne.display(this.textures);
						break;
					case 'k':
						this.tradeStationFactionTwo.display(this.textures);
						break;
				}

				this.scene.popMatrix();
			}
		}
    }

	setTexCoords() {};

    setBoard(board) {
    	this.board = board;
    }
}
