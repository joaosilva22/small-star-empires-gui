class Play {
	constructor(faction, prevBoard) {
		this.faction = faction;
		this.prevBoard = prevBoard.slice();
		this.from = null;
		this.to = null;
		this.newBoard = null;
		this.struct = null;
		this.structAuxPos = null;
	}

	setMove(from, to, newBoard) {
		this.from = from;
		this.to = to;
		this.newBoard = newBoard.slice();
	}

	setStruct(struct, structAuxPos) {
		this.struct = struct;
		this.structAuxPos = structAuxPos;
	}
}

class GameFilm {
	constructor() {
		this.current = -1;
		this.plays = [];
	}

	addPlay(faction, prevBoard) {
		this.current += 1;
		this.plays[this.current] = new Play(faction, prevBoard);
	}

	setPlayMove(from, to, newBoard) {
		if (this.current < 0) return;
		this.plays[this.current].setMove(from, to, newBoard);
	}

	setPlayStruct(struct, structAuxPos) {
		if (this.current < 0) return;
		this.plays[this.current].setStruct(struct, structAuxPos);
	}

	getPlay() {
		if (this.current < 0) return;
		return this.plays[this.current];
	}

	getPreviousPlay() {
		if (this.current < 1) return;
		return this.plays[this.current - 1];
	}

	getBeforePreviousPlay() {
		if (this.current < 2) return;
		return this.plays[this.current - 2];
	}

	goToBeginning() {
		this.current = 0;
	}

	goBackOne() {
		if (this.current < 1) return;
		this.current -= 1;
	}

	goForwardOne() {
		if (this.current > this.plays.length - 2) return;
		this.current += 1;
	}

	hasNext() {
		if (this.current < this.plays.length - 1) return true;
		return false;
	}
}
