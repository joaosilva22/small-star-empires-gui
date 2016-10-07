function Views() {
    this.default = null;
    this.perspectives = {};
}

Views.prototype.addPerspective = function(id, near, far, angle, from, to) {
    this.perspectives[id] = new CGFcamera(angle, near, far, from, to);
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

