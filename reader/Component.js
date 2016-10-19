function Component() {
    this.transformation = null;
    this.materials = [];
    this.currentMaterial = 0;
    this.texture = null;
    this.children = [];
}

Component.prototype.setTransformation = function(transformation) {
    this.transformation = transformation;
};

Component.prototype.addMaterial = function(material) {
    this.materials.push(material);
};

Component.prototype.nextMaterial = function() {
    this.currentMaterial = (this.currentMaterial+1)%this.materials.length;
};

Component.prototype.setTexture = function(texture) {
    this.texture = texture;
};

Component.prototype.addChildren = function(children) {
    this.children.push(children);
};

Component.prototype.toString = function() {
    return JSON.stringify(this, function(key, val) {
	if (val instanceof CGFscene) {
	    return undefined;
	}
	return val;
    });
};

