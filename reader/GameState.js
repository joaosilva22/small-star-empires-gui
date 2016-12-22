class GameState {
    constructor(stateManager) {
	this.stateManager = stateManager;
    }

    draw() {}
    update(dt) {}
    handleInput() {}
}

class GameStateManager {
    constructor() {
	this.states = [];
	this.prevTime = 0;
    }

    pushState(state) {
	this.states.push(state);
    }

    popState() {
	if (this.states.length !== 0) {
	    this.states.pop();
	}
    }

    changeState(state) {
	this.popState();
	this.pushState(state);
    }

    draw() {
	let current = this.states.length-1;
	this.states[current].draw();
    }

    update(currTime) {
	if (prevTime == 0) {
	    this.prevTime = currTime;
	}
	let dt = currTime - this.prevTime;
	let current = this.states.length-1;
	this.states[current].update(dt);
    }

    handleInput() {
	let current = this.states.length-1;
	this.states[current].handleInput();
    }
}
