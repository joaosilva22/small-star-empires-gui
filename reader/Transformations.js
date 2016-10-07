function Translation(x, y, z) {
    this.type = "translation";
    this.x = x;
    this.y = y;
    this.z = z;
}

function Rotation(axis, angle) {
    this.type = "rotation";
    this.axis = axis;
    this.angle = angle;
}

function Scale(x, y, z) {
    this.type = "scale";
    this.x = x;
    this.y = y;
    this.z = z;
}

function Transformation(id) {
    this.id = id;
    this.stack = [];
}

Transformation.prototype.translate = function(x, y, z) {
    this.stack.push(new Translation(x, y, z));
};

Transformation.prototype.rotate = function(axis, angle) {
    this.stack.push(new Rotation(axis, angle));
};

Transformation.prototype.scale = function(x, y, z) {
    this.stack.push(new Scale(x, y, z));
};

function Transformations() {
    this.transformations = [];
}

Transformations.prototype.addTransformation = function(transformation) {
    this.transformations.push(transformation);
};

Transformations.prototype.getById = function(id) {
    for (var i = 0; i < this.transformations.length; i++) {
	if (this.transformations[i].id == id) {
	    return this.transformations[i];
	}
    }
    this.transformations.push(new Transformation(id));
    return this.getById(id);
};

