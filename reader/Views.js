/*
 * Creates a views object.
 */
function Views() {
    this.default = null;
    this.order = [];
    this.perspectives = {};
}

/*
 * Adds a perspective to the perspectives list.
 */
Views.prototype.addPerspective = function(id, near, far, angle, from, to) {
    var rad = degToRad(angle);
    this.order.push(id);
    this.perspectives[id] = new CGFcamera(rad, near, far, from, to);
};

/*
 * Returns the perspective with the given id.
 */
Views.prototype.getById = function(id) {
    if (this.perspectives[id] != null) {
		return this.perspectives[id];
    }
    this.perspectives[id] = new CGFcamera();
    return this.perspectives[id];
};

/*
 * Sets the default perspective.
 */
Views.prototype.setDefault = function(id) {
    this.default = this.getById(id);
};

/*
 * Returns a JSON string version of the object.
 */
Views.prototype.toString = function() {
    return JSON.stringify(this);
};

/*
 * Cycles the perspectives.
 */
Views.prototype.getNext = function(camera) {
    var id = this.getKeyByValue(camera);
    var index = -1;
    for (var i = 0; i < this.order.length; i++) {
		if (this.order[i] == id) {
			index = i;
			break;
		}
    }
    if (index+1 >= this.order.length) {
		index = 0;
    }
    else {
		index++;
    }
    return this.perspectives[this.order[index]];
};

/*
 * Returns perspective id given the perspective object.
 */
Views.prototype.getKeyByValue = function( value ) {
    for(var perspective in this.perspectives) {
        var id = perspective;
		if (this.perspectives[id] == value) {
			return id;
		}
    }
}

/*
 * Converts degrees to radians.
 */
function degToRad(deg) {
    return (deg * (Math.PI / 180));
}

