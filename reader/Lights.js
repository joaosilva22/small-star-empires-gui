function Lights() {
    this.omni = {};
    this.spot = {};
}

Lights.prototype.addOmni = function(id, enabled) {
    var light = {enabled: enabled};
    this.omni[id] = light;
};

Lights.prototype.addSpot = function(id, enabled, angle, exponent) {
    var rad = angle * (Math.PI/180.0);
    var light = {enabled: enabled, angle: rad, exponent: exponent};
    this.spot[id] = light;
};

Lights.prototype.getById = function(id) {
    if (this.omni[id] != null) {
	return this.omni[id];
    }
    if (this.spot[id] != null) {
	return this.spot[id];
    }
};

Lights.prototype.setLocation = function(id, x, y, z, w) {
    if (this.getById(id) == null) {
	return "light '" + id + "' does not exist.";
    }
    this.getById(id).position = {x: x, y: y, z: z, w: w};
};

Lights.prototype.setAmbient = function(id, r, g, b, a) {
    if (this.getById(id) == null) {
	return "light '" + id + "' does not exist.";
    }
    this.getById(id).ambient = {r: r, g: g, b: b, a: a};
};

Lights.prototype.setDiffuse = function(id, r, g, b, a) {
    if (this.getById(id) == null) {
	return "light '" + id + "' does not exist.";
    }
    this.getById(id).diffuse = {r: r, g: g, b: b, a: a};
};

Lights.prototype.setSpecular = function(id, r, g, b, a) {
    if (this.getById(id) == null) {
	return "light '" + id + "' does not exist.";
    }
    this.getById(id).specular = {r: r, g: g, b: b, a: a};
};
    
Lights.prototype.setTarget = function(id, x, y, z) {
    if (this.getById(id) == null) {
	return "light '" + id + "' does not exist.";
    }
    this.getById(id).target = {x: x, y: y, z: z};
};
