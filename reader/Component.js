/*
 * Method that creates a component object.
 */
function Component() {
    this.transformation = null;
    this.materials = [];
    this.currentMaterial = 0;
    this.texture = null;
    this.children = [];
}

/*
 * Sets the current component's transformation.
 */
Component.prototype.setTransformation = function(transformation) {
    this.transformation = transformation;
};

/*
 * Adds a material to the component's material list.
 */
Component.prototype.addMaterial = function(material) {
    this.materials.push(material);
};

/*
 * Cycles the current material.
 */
Component.prototype.nextMaterial = function() {
    this.currentMaterial = (this.currentMaterial+1)%this.materials.length;
};

/*
 * Sets the component's texture;.
 */
Component.prototype.setTexture = function(texture) {
    this.texture = texture;
};

/*
 * Adds a child to the component's children;
 */
Component.prototype.addChildren = function(child) {
    this.children.push(child);
};

/*
 * Gets a JSON string version of the component.
 */
Component.prototype.toString = function() {
    return JSON.stringify(this, function(key, val) {
	if (val instanceof CGFscene) {
	    return undefined;
	}
	return val;
    });
};

