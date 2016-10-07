function Lights() {
    this.omni = {};
    this.spot = {};
}

Lights.prototype.addOmni = function(id, scene, enabled) {
    var light = new CGFlight(scene, id);
    if (enabled) {
	light.enable();
    }
    else {
	light.disable();
    }
    this.omni[id] = light;
};

Lights.prototype.addSpot = function(id, scene, enabled, angle, exponent) {
    var light = new CGFlight(scene, id);
    if (enabled) {
	light.enable();
    }
    else {
	light.disable();
    }
    // angle ??
    light.setSpotExponent(exponent);
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
    this.getById(id).setPosition(x, y, z, w);
};

Lights.prototype.setAmbient = function(id, r, g, b, a) {
    if (this.getById(id) == null) {
	return "light '" + id + "' does not exist.";
    }
    this.getById(id).setAmbient(r, g, b, a);
};

Lights.prototype.setDiffuse = function(id, r, g, b, a) {
    if (this.getById(id) == null) {
	return "light '" + id + "' does not exist.";
    }
    this.getById(id).setDiffuse(r, g, b, a);
};

Lights.prototype.setSpecular = function(id, r, g, b, a) {
    if (this.getById(id) == null) {
	return "light '" + id + "' does not exist.";
    }
    this.getById(id).setSpecular(r, g, b, a);
};
    
Lights.prototype.setTarget = function(id, x, y, z) {
    if (this.getById(id) == null) {
	return "light '" + id + "' does not exist.";
    }
    this.getById(id).setSpotDirection(x, y, z);
};
