/*
 * Method that creates a component object.
 */
function Component() {
    this.transformation = null;
    
    this.animations = [];
    this.currentAnimation = 0;
    
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
 * Adds an animation to the component's animation list.
 */
Component.prototype.addAnimation = function(animation) {
    this.animations.push(animation);
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

/*
 * Updates the component.
 */
Component.prototype.update = function(currTime) {
    if (this.animations[this.currentAnimation] != undefined) {
	var animation = this.animations[this.currentAnimation];
	if (!animation.finished) {
	    animation.update(currTime);
	}
	else {
	    animation.applyFinalTransformations(this);
	    this.currentAnimation++;
	    if (this.animations[this.currentAnimation]) {
		this.animations[this.currentAnimation].prev = 0;
		this.animations[this.currentAnimation].elapsed = 0;
		this.animations[this.currentAnimation].cdir = 0;
		this.animations[this.currentAnimation].finished = false;
	    }
	}
    }
};

/*
 * Applies the component's animation.
 */
Component.prototype.pushAnimation = function(scene) {
    if (this.animations[this.currentAnimation] != undefined) {
	var animation = this.animations[this.currentAnimation];
	animation.push(scene);
    }
};

Component.prototype.popAnimation = function(scene) {
    if (this.animations[this.currentAnimation] != undefined) {
	var animation = this.animations[this.currentAnimation];
	animation.pop(scene);
    }
};
