function SceneInfo(root, axisLength) {
    this.ids = []
    
    this.root = root;
    this.axisLength = axisLength;
    
    this.views = new Views();
    this.illumination = new Illumination();
    this.lights = new Lights();
    this.textures = new Textures();
    this.materials = new Materials();
    this.transformations = new Transformations();
}

SceneInfo.prototype.toString = function() {
    return JSON.stringify(this, function(key, val) {
	if (val instanceof CGFscene) {
	    return undefined;
	}
	return val;
    });
};

SceneInfo.prototype.hasId = function(id) {
    for (var i = 0; i < this.ids.length; i++) {
	if (this.ids[0] == id) {
	    return true;
	}
    }
    return false;
};
