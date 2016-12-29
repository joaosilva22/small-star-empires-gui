class State {
	/**
	* Represents the base class for a state
	* @param {StateManager} stateManager - State manager for this state
	* @param {CGFscene} scene - Scene for this state
	* @constructor
	*/
    constructor(stateManager, scene) {
		this.stateManager = stateManager;
		this.scene = scene;
    }

	/**
	* Renders the state
	* @abstract
	*/
    draw() {}

	/**
	* Updates the state
	* @param {Number} dt - Delta time
	* @abstract
	*/
    update(dt) {}

	/**
	* Handles the user input
	* @abstract
	*/
    handleInput() {}
}

class StateManager {
	/**
	* Handles state updating and transitions
	* @constructor
	*/
    constructor() {
		this.states = [];
    }

	/**
	* Pushes a new state to the stack
	* @param {State} state - The state to push
	*/
    pushState(state) {
		this.states.push(state);
    }

	/** Pops a state from the stack */
    popState() {
		if (this.states.length !== 0) {
			this.states.pop();
		}
    }

	/** 
	* Changes the current state
	* @param {State} state - State to change to
	*/
    changeState(state) {
		this.popState();
		this.pushState(state);
    }

	/** Renders the current state */
    draw() {
		if (this.states.length > 0) {
			let current = this.states.length-1;
			this.states[current].draw();
		}
    }

	/**
	* Updates the current state
	* @param {Number} dt - Delta time
	*/
    update(dt) {
		if (this.states.length > 0) {
			let current = this.states.length-1;
			this.states[current].update(dt);
		}
    }

	/**
	* Handles the user input for current state
	* @param {Number} keycode - Key code
	*/
	handleInput(keycode) {
		if (this.states.length > 0) {
			let current = this.states.length-1;
			this.states[current].handleInput(keycode);
		}
    }

	/** Returns the current state */
	getCurrentState() {
		if (this.states.length > 0) {
			let current = this.states.length - 1;
			return this.states[current];
		}
		return null;
	}
}
