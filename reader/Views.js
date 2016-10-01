function Perspective(id, near, far, angle, from, to) {
    this.id = id;
    this.near = near;
    this.far = far;
    this.angle = angle;
    this.from = from;
    this.to = to;
}

function Views() {
    this.default = null;
    this.perspectives = [];
}

Views.prototype.addPerspective = function(perspective) {
    this.perspectives.push(perspective);
};

Views.prototype.getById = function(id) {
    for (var i = 0; i < this.perspectives.length; i++) {
	if (this.perspectives[i].id == id) {
	    return this.perspectives[i];
	}
    }
    this.perspectives.push(new Perspective(id));
    return this.getById(id);
};

Views.prototype.setDefault = function(def) {
    this.default = this.getById(def);
};

Views.prototype.toString = function() {
    return JSON.stringify(this);
};

