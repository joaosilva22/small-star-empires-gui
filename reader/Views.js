function Views() {
    this.default = null;
    this.order = [];
    this.perspectives = {};
}

Views.prototype.addPerspective = function(id, near, far, angle, from, to) {
    var rad = degToRad(angle);
    this.order.push(id);
    this.perspectives[id] = new CGFcamera(rad, near, far, from, to);
};

Views.prototype.getById = function(id) {
    if (this.perspectives[id] != null) {
	return this.perspectives[id];
    }
    this.perspectives[id] = new CGFcamera();
    return this.perspectives[id];
};

Views.prototype.setDefault = function(id) {
    this.default = this.getById(id);
};

Views.prototype.toString = function() {
    return JSON.stringify(this);
};

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

Views.prototype.getKeyByValue = function( value ) {
    for(var perspective in this.perspectives) {
        var id = perspective;
	if (this.perspectives[id] == value) {
	    return id;
	}
    }
}

function degToRad(deg) {
    return (deg * (Math.PI / 180));
}

