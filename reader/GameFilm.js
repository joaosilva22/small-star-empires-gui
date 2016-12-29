class Play {
	/**
	* Stores play information
	* @param {String} faction - Faction
	* @param {Array} prevBoard - Previous board
	* @constructor
	*/
	constructor(faction, prevBoard) {
		this.faction = faction;
		this.prevBoard = prevBoard.slice();
		this.from = null;
		this.to = null;
		this.newBoard = null;
		this.struct = null;
		this.structAuxPos = null;
	}

	/**
	* Sets play move info
	* @param {Object} from - Move origin
	* @param {Object} to - Move destination
	* @param {Array} newBoard - New board
	*/
	setMove(from, to, newBoard) {
		this.from = from;
		this.to = to;
		this.newBoard = newBoard.slice();
	}

	/**
	* Sets play structure info
	* @param {String} struct - Structure
	* @param {Number} structAuxPos - Structure aux board index
	*/
	setStruct(struct, structAuxPos) {
		this.struct = struct;
		this.structAuxPos = structAuxPos;
	}
}

class GameFilm {
	/**
	* Represents the game film
	* @constructor
	*/
	constructor() {
		this.current = -1;
		this.plays = [];
	}

	/**
	* Add play to film
	* @param {String} faction - Faction
	* @param {Array} prevBoard - Previous board
	*/
	addPlay(faction, prevBoard) {
		this.current += 1;
		this.plays[this.current] = new Play(faction, prevBoard);
	}

	/**
	* Sets play move info
	 * @param {Object} from - Move origin
	 * @param {Object} to - Move destination
	 * @param {Array} newBoard - New board
	 */
	setPlayMove(from, to, newBoard) {
		if (this.current < 0) return;
		this.plays[this.current].setMove(from, to, newBoard);
	}

	/**
	 * Sets play structure info
	 * @param {String} struct - Structure
	 * @param {Number} structAuxPos - Structure aux board index
	 */
	setPlayStruct(struct, structAuxPos) {
		if (this.current < 0) return;
		this.plays[this.current].setStruct(struct, structAuxPos);
	}

	/** Returns current pay */
	getPlay() {
		if (this.current < 0) return;
		return this.plays[this.current];
	}

	/** Returns previous play */
	getPreviousPlay() {
		if (this.current < 1) return;
		return this.plays[this.current - 1];
	}

	/** Returns two plays back */
	getBeforePreviousPlay() {
		if (this.current < 2) return;
		return this.plays[this.current - 2];
	}

	/** Goto first play */
	goToBeginning() {
		this.current = 0;
	}

	/** Goto previous play */
	goBackOne() {
		if (this.current < 1) return;
		this.current -= 1;
	}

	/** Goto next play */
	goForwardOne() {
		if (this.current > this.plays.length - 2) return;
		this.current += 1;
	}

	/** Checks if has next play */
	hasNext() {
		if (this.current < this.plays.length - 1) return true;
		return false;
	}
}
