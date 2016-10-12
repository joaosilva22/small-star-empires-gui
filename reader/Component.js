function Component() {
    this.parent = null;
    this.transformation = null;
    this.materials = [];
    this.texture = null;
    this.children = [];
}

Component.prototype.setParent = function(component) {
    this.parent = component;
};

Component.prototype.setTransformation = function(transformation) {
    this.transformation = transformation;
};

Component.prototype.addMaterial = function(material) {
    this.materials.push(material);
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

