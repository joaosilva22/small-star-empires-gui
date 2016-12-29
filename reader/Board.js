
class Cell extends CGFobject {
	/**
	* Represents a board cell
	* @param {CGFscene} scene - Scene
	* @param {String} type - Type
	* @param {Object} position - Position
	* @constructor
	*/
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

	/**
	* Renders cell
	* @param {Array} textures - Texture array
	* @param {Array} shaders - Shader arary
	*/
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
	/**
	 * Represents a board ship
	 * @param {CGFscene} scene - Scene
	 * @param {String} faction - Faction
	 * @param {Object} position - Position
	 * @constructor
	 */
	constructor(scene, faction, position) {
		super(scene);
		this.geometry = new Ovni(scene);
		this.scene = scene;

		this.faction = faction;
		this.position = position;

		this.pickId = (this.position.x + 1) * 10 + this.position.z + 1;
		this.pickable = false;

		this.animation = new HopAnimation(100, {x:0,y:0,z:0}, {x:0,y:0,z:0}); 
	}

	/**
	 * Renders ship
	 * @param {Array} textures - Texture array
	 */
	display(textures) {
		this.scene.pushMatrix();
		this.scene.translate(0,0.2,0);
		if (!this.animation.finished) {
			this.scene.translate(this.animation.position.x, this.animation.position.y, this.animation.position.z);
		}
		//this.scene.scale(0.04,0.04,0.04);	
		textures[this.faction].bind();
		this.scene.registerForPick(this.pickId, this.geometry);
		this.geometry.display();
		this.scene.popMatrix();
	}

	/**
	* Updates ship
	* @param {Number} dt - Delta time
	*/
	update(dt) {
		this.animation.update(dt);
	}
}

class TradeStation extends CGFobject {
	/**
	 * Represents a board trade station
	 * @param {CGFscene} scene - Scene
	 * @param {String} faction - Faction
	 * @constructor
	 */
	constructor(scene, faction) {
		super(scene);
		this.geometry = new SpaceStation(scene);
		this.scene = scene;

		this.faction = faction;

		this.animation = new HopAnimation(100, {x:0,y:0,z:0}, {x:0,y:0,z:0}); 
	}

	/**
	 * Renders trade station
	 * @param {Array} textures - Texture array
	 */
	display(textures) {
		this.scene.pushMatrix();
		if (!this.animation.finished) {
			if (this.undoAnimationOffset) {
				this.scene.translate(this.undoAnimationOffset.x, this.undoAnimationOffset.y, this.undoAnimationOffset.z);
			}
			this.scene.translate(this.animation.position.x, this.animation.position.y, this.animation.position.z);
		}
		this.scene.translate(0.3,0.1,-0.2);
		textures[this.faction].bind();
		this.geometry.display();
		this.scene.popMatrix();
	}

	/**
	 * Updates trade station
	 * @param {Number} dt - Delta time
	 */
	update(dt) {
		this.animation.update(dt);
	}
}

class Colony extends CGFobject {
	/**
	 * Represents a board colony
	 * @param {CGFscene} scene - Scene
	 * @param {String} faction - Faction
	 * @constructor
	 */
	constructor(scene, faction) {
		super(scene);
		this.geometry = new SpaceColony(scene);

		this.faction = faction;

		this.animation = new HopAnimation(100, {x:0,y:0,z:0}, {x:0,y:0,z:0}); 
	}

	/**
	 * Renders colony
	 * @param {Array} textures - Texture array
	 */
	display(textures) {
		this.scene.pushMatrix();
		if (!this.animation.finished) {
			if (this.undoAnimationOffset) {
				this.scene.translate(this.undoAnimationOffset.x, this.undoAnimationOffset.y, this.undoAnimationOffset.z);
			}
			this.scene.translate(this.animation.position.x, this.animation.position.y, this.animation.position.z);
		}
		this.scene.translate(-0.3,0,0.2);
		//this.scene.rotate(-Math.PI / 2, 1, 0, 0);
		textures[this.faction].bind();
		this.geometry.display();
		this.scene.popMatrix();
	}

	/**
	 * Updates colony
	 * @param {Number} dt - Delta time
	 */
	update(dt) {
		this.animation.update(dt);
	}

}

class Board extends CGFobject{
	/**
	* Represents the game board
	* @param {CGFscene} scene - Scene
	* @constructor
	*/
    constructor(scene) {
		super(scene);

		this.board = [];
		this.cells = [];
		this.ships = [];
		
		this.distance = Math.sqrt(3)/2;
		this.textures = {
			'factionOne' : new CGFtexture(this.scene, 'resources/relaig/factionOne.png'),
			'factionTwo' : new CGFtexture(this.scene, 'resources/relaig/factionTwo.png'),
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

		this.aux = new AuxiliaryBoard(scene, this, 'factionOne');
		this.aux1 = new AuxiliaryBoard(scene, this, 'factionTwo');

    }

	/**
	* Loads board
	* @param {Function} onLoad - Callback
	*/
	load(onLoad) {
		let connection = new Connection();
		let self = this;
		connection.getBoardRequest(function(data) {
			self.board = parseStringArray(data.target.response);
			self.initBoard();
			onLoad();
		});
	}

	/** Initializes board */
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
				if (this.getMovementLayer(this.board[i][j]) === 'B') {
					this.ships.push(new Ship(this.scene, 'factionTwo', {x: j, z: i}));
				}
			}
		}
	}

	/**
	* Places ship from faction at position
	* @param {Object} position - Position
	* @param {String} faction - Faction
	*/
	placeShipAt(position, faction) {
		if (faction === 'factionOne') {
			this.board[position.z][position.x][0] = 'A';
		} else {
			this.board[position.z][position.x][0] = 'B';
		}
	}

	/**
	* Returns board movement layer of cell
	* @param {Cell} cell - Cell
	*/
	getMovementLayer(cell) {
		return cell[0];
	}

	/**
	 * Returns board map layer of cell
	 * @param {Cell} cell - Cell
	 */
    getMapLayer(cell) {
		return cell[1];
    }

	/**
	 * Returns board structure layer of cell
	 * @param {Cell} cell - Cell
	 */
	getStructureLayer(cell) {
		return cell[2];
	}

	/** Registers cell at position for picking
	* @param {Object} position - Position
	*/
	registerCellForPicking(position) {
		this.cells.forEach(function(cell) {
			if (cell.position.x === position.x && cell.position.z === position.z) {
				cell.pickable = true;
			}
		});
	}

	/** Registers ship at position for picking
	 * @param {Object} position - Position
	 */
	registerShipsForPicking(faction) {
		let self = this;
		this.ships.forEach(function(ship) {
			if (ship.faction === faction) {
				self.registerCellForPicking(ship.position);
			}
		});
	}

	/** Resets pick registration */
	resetPickRegistration() {
		this.cells.forEach(function(cell) {
			cell.pickable = false;
		});
	}

	/**
	* Selects cell at position
	* @param {Object} position - Position
	*/
	selectCell(position) {
		this.cells.forEach(function(cell) {
			if (cell.position.x === position.x && cell.position.z === position.z) {
				cell.selected = true;
			}
		});
	}

	/** Resets selection */
	resetSelection() {
		this.cells.forEach(function(cell) {
			cell.selected = false;
		});
	}

	/**
	* Returns cell with pickId
	* @param {String} pickId - Pick id
	*/
	getCellByPickId(pickId) {
		let ret = null;
		this.cells.forEach(function(cell) {
			if (cell.pickId === pickId) {
				ret = cell;
			}
		});
		return ret;
	}

	/** Places colony from faction at position
	* @param {Object} position - Position
	* @param {String} faction - Faction
	*/
	placeColony(position, faction) {
		if (faction === 'factionOne') {
			this.board[position.z][position.x][2] = 'o';
		}
		if (faction === 'factionTwo') {
			this.board[position.z][position.x][2] = 'p';
		}
	}

	/** Places trade station from faction at position
	 * @param {Object} position - Position
	 * @param {String} faction - Faction
	 */
	placeTradeStation(position, faction) {
		if (faction === 'factionOne') {
			this.board[position.z][position.x][2] = 'l';
		}
		if (faction === 'factionTwo') {
			this.board[position.z][position.x][2] = 'k';
		}
	}

	/** Renders board */
    display() {
		let self = this;
		
		this.cells.forEach(function(cell) {
			self.scene.pushMatrix();
			self.scene.scale(5, 5, 5);

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
				var posX;
				var posZ;
				if (i % 2 === 0) {
					let offset = i * this.distance / 2;
					this.scene.translate(j * this.distance + offset, 0, i * 0.75);
				} else {
					let offset = (i * this.distance - this.distance) / 2;
					this.scene.translate(j * this.distance + this.distance / 2 + offset, 0, i * 0.75);
				}
				
				switch (this.board[i][j][2]) {
					case 'o':
						this.colonyFactionOne.display(this.textures);
						break;
					case 'p':
						this.colonyFactionTwo.display(this.textures);
						break;
					case 'l':
						this.tradeStationFactionOne.display(this.textures);
						break;
					case 'k':
						this.tradeStationFactionTwo.display(this.textures);
						break;
				}

				this.scene.popMatrix();
			}
		}

		this.scene.pushMatrix();
		this.scene.scale(5, 5, 5);
		this.aux.display();
		this.scene.translate(-1, 0, 0);
		this.aux1.display();
		this.scene.popMatrix();
    }

	/**
	* Updates board
	* @param {Number} dt - Delta time
	*/
	update(dt) {
		this.ships.forEach(function(ship) {
			ship.update(dt);
		});
		this.aux.update(dt);
		this.aux1.update(dt);
	}

	/** Sets texture coordinates */
	setTexCoords() {};

	/**
	* Sets board
	* @param {Array} board - Board array
	*/
    setBoard(board) {
    	this.board = board;
    }

	/**
	* Returns scene position
	* @param {Object} position - Position
	*/
	getScenePosition(position) {
		let scenepos = {x: 0, y: 0, z: 0};
		if (position.z % 2 === 0) {
			let offset = position.z * this.distance / 2;
			scenepos.x += position.x * this.distance + offset;
			scenepos.z += position.z * 0.75;
		} else {
			let offset = (position.z * this.distance - this.distance) / 2;
			scenepos.x += position.x * this.distance + this.distance / 2 + offset;
			scenepos.z += position.z * 0.75;
		}
		return scenepos;
	}

	/**
	* Returns ship at position
	* @param {Object} position - Position
	*/
	getShipAt(position) {
		let ret = null;
		this.ships.forEach(function(ship) {
			if (ship.position.x === position.x && ship.position.z === position.z) {
				ret = ship;
			}
		});
		return ret;
	}

	/**
	 * Returns cell at position
	 * @param {Object} position - Position
	 */
	getCellAt(position) {
		let ret = null;
		this.cells.forEach(function(cell) {
			if (cell.position.x === position.x && cell.position.z === position.z) {
				ret = cell;
			}
		});
		return ret;
	}

	/**
	 * Returns colony from aux board from faction
	 * @param {String} faction - Faction
	 */
	getAuxColony(faction) {
		if (faction === 'factionOne') {
			return this.aux.colonies[this.aux.colonies.length-1];
		} else {
			return this.aux1.colonies[this.aux1.colonies.length-1];
		}
	}

	/**
	 * Returns trade station from aux board from faction
	 * @param {String} faction - Faction
	 */
	getAuxTradeStation(faction) {
		if (faction === 'factionOne') {
			return this.aux.tradeStations[this.aux.tradeStations.length-1];
		} else {
			return this.aux1.tradeStations[this.aux1.tradeStations.length-1];
		}
	}

	/**
	* Returns position on auxiliary board of colony from faction
	* @param {String} faction - Faction
	*/
	getAuxColonyPosition(faction) {
		if (faction === 'factionOne') {
			return this.aux.getColonyScenePosition();
		} else {
			let position = this.aux1.getColonyScenePosition();
			position.x = position.x - 1;
			return position;
		}
	}

	/**
	 * Returns position on auxiliary board of colony from faction
	 * @param {String} faction - Faction
	 * @param {Number} index - Index
	 */
	getAuxColonyPositionAt(faction, index) {
		if (faction === 'factionOne') {
			return this.aux.getColonyScenePositionAt(index);
		} else {
			let position =  this.aux1.getColonyScenePositionAt(index);
			position.x = position.x - 1;
			return position;
		}
	}

	/**
	 * Returns position on auxiliary board of trade station from faction
	 * @param {String} faction - Faction
	 */
	getAuxTradeStationPosition(faction) {
		if (faction === 'factionOne') {
			return this.aux.getTradeStationScenePosition();
		} else {
			let position = this.aux1.getTradeStationScenePosition();
			position.x = position.x - 1;
			return position;
		}
	}

	/**
	 * Returns position on auxiliary board of trade station from faction
	 * @param {String} faction - Faction
	 * @param {Number} index - Index
	 */
	getAuxTradeStationPositionAt(faction, index) {
		if (faction === 'factionOne') {
			return this.aux.getTradeStationScenePositionAt(index);
		} else {
			let position = this.aux1.getTradeStationScenePositionAt(index);
			position.x = position.x - 1;
			return position;
		}
	}

	/**
	* Pops colony from faction on auxiliary board
	* @param {String} faction - Faction
	*/
	popAuxColony(faction) {
		if (faction === 'factionOne') {
			return this.aux.popColony();
		} else {
			return this.aux1.popColony();
		}
	}

	/**
	 * Pushes colony from faction to auxiliary board
	 * @param {String} faction - Faction
	 */
	pushAuxColony(faction) {
		if (faction === 'factionOne') {
			this.aux.pushColony();
		} else {
			this.aux1.pushColony();
		}
	}

	/**
	 * Pops trade station from faction on auxiliary board
	 * @param {String} faction - Faction
	 */
	popAuxTradeStation(faction) {
		if (faction === 'factionOne') {
			return this.aux.popTradeStation();
		} else {
			return this.aux1.popTradeStation();
		}
	}

	/**
	 * Pushes trade station from faction to auxiliary board
	 * @param {String} faction - Faction
	 */
	pushAuxTradeStation(faction) {
		if (faction === 'factionOne') {
			this.aux.pushTradeStation();
		} else {
			this.aux1.pushTradeStation();
		}
	}

	/** Returns board center */
	getBoardCenter() {
		let pos = this.getScenePosition({x: 4, z: 4});
		return vec3.fromValues(pos.x * 5, pos.y * 5, pos.z * 5);
	}
}

class AuxiliaryBoard extends CGFobject {
	/**
	* Represents auxiliary board
	* @param {CGFscene} scene - Scene
	* @param {Board} board - Board
	* @param {Faction} faction - Faction
	* @constructor
	*/
	constructor(scene, board, faction) {
		super(scene);
		this.board = board;
		this.faction = faction;

		this.box = new Box(scene, 1, 0.25, 6);
		this.boxTexture = new CGFtexture(this.scene, 'resources/relaig/aux.png'),

		this.colonies = [];
		for (let i = 0; i < 18; i++) {
			this.colonies.push(new Colony(scene, faction));
		}

		this.tradeStations = [];
		for (let i = 0; i < 18; i++) {
			this.tradeStations.push(new TradeStation(scene, faction));
		}
	}

	/** Renders auxiliary board */
	display() {
		for (let i = 0; i < this.colonies.length; i++) {
			this.scene.pushMatrix();
			this.scene.translate(0, 0, 1 + i * 0.3);
			this.colonies[i].display(this.board.textures);
			this.scene.popMatrix();
		}

		for (let i = 0; i < this.tradeStations.length; i++) {
			this.scene.pushMatrix();
			this.scene.translate(0, 0, 1 + i * 0.3);
			this.tradeStations[i].display(this.board.textures);
			this.scene.popMatrix();
		}

		this.scene.pushMatrix();
		this.scene.translate(0, -0.125, 3.5);
		this.boxTexture.bind();
		this.box.display();
		this.scene.popMatrix();
	}

	/**
	* Updates board
	* @param {Number} dt - Delta time
	*/
	update(dt) {
		for (let i = 0; i < this.colonies.length; i++) {
			this.colonies[i].update(dt);
		}
		for (let i = 0; i < this.tradeStations.length; i++) {
			this.tradeStations[i].update(dt);
		}
	}

	/** Returns scene position of colony */
	getColonyScenePosition() {
		let current = this.colonies.length - 1;
		let position = {x: 0, y: 0, z: 1 + current * 0.3};
		return position;
	}

	/**
	* Returns scene position of colony at index
	* @param {Number} index - Index
	*/
	getColonyScenePositionAt(index) {
		let position = {x: 0, y: 0, z: 1 + index * 0.3};
		return position;
	}

	/** Returns scene position of trade station */
	getTradeStationScenePosition() {
		let current = this.tradeStations.length - 1;
		let position = {x: 0, y: 0, z: 1 +  current * 0.3};
		return position;
	}

	/**
	 * Returns scene position of trade station at index
	 * @param {Number} index - Index
	 */
	getTradeStationScenePositionAt(index) {
		let position = {x: 0, y: 0, z: 1 + index * 0.4}
		return position;
	}

	/** Pops colony */
	popColony() {
		this.colonies.pop();
		return this.colonies.length;
	}

	/** Pushes colony */
	pushColony() {
		this.colonies.push(new Colony(this.scene, this.faction));
	}

	/** Pops trade station */
	popTradeStation() {
		this.tradeStations.pop();
		return this.colonies.length;
	}

	/** Pushes trade station */
	pushTradeStation() {
		this.tradeStations.push(new TradeStation(this.scene, this.faction));
	}
}
