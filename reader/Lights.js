function Omni(id, enabled) {
    this.id = id;
    this.enabled = enabled;
    this.location = new Vector4();
    this.ambient = new RGBA();
    this.diffuse = new RGBA();
    this.specular = new RGBA();
}

function Spot(id, enabled, angle, exponent) {
    this.id = id;
    this.enabled = enabled;
    this.angle = angle;
    this.exponent = exponent;
    this.target = new Vector3();
    this.location = new Vector3();
    this.ambient = new RGBA();
    this.diffuse = new RGBA();
    this.specular = new RGBA();
}

function Lights() {
    this.omni = [];
    this.spot = [];
}

Lights.prototype.addOmni = function(omni) {
    this.omni.push(omni);
};

Lights.prototype.addSpot = function(spot) {
    this.spot.push(spot);
};
