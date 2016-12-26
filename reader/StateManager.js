class State {
    constructor(stateManager, scene) {
		this.stateManager = stateManager;
		this.scene = scene;
    }

    draw() {}
    update(dt) {}
    handleInput() {}
}

class StateManager {
    constructor() {
		this.states = [];
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
		if (this.states.length > 0) {
			let current = this.states.length-1;
			this.states[current].draw();
		}
    }

    update(dt) {
		if (this.states.length > 0) {
			let current = this.states.length-1;
			this.states[current].update(dt);
		}
    }

	handleInput() {
		if (this.states.length > 0) {
			let current = this.states.length-1;
			this.states[current].handleInput();
		}
    }
}
