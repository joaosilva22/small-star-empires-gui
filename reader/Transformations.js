function Rotation(axis, angle) {
    this.axis = axis;
    this.angle = angle;
}

function Transformation(id) {
    this.id = id;
    this.translations = [];
    this.rotations = [];
    this.scales = [];
}

Transformation.prototype.addTranslation = function(vector) {
    this.translations.push(vector);
};

Transformation.prototype.addRotation = function(rotation) {
    this.rotations.push(rotation);
};

Transformation.prototype.addScale = function(vector) {
    this.scales.push(vector);
};

function Transformations() {
    this.transformations = [];
}

Transformations.prototype.addTransformation = function(transformation) {
    this.transformations.push(transformation);
};

Transformations.prototype.getById = function(id) {
    for (var transformation in this.transformations) {
	if (transformation.id == id) {
	    return transformation;
	}
    }
    this.transformations.push(new Transformation(id));
    return this.getById(id);
};

