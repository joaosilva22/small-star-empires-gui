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

function Transformation(scene) {
    this.scene = scene;
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

Transformation.prototype.push = function() {
    this.scene.pushMatrix();
    for (let t of this.stack) {
	switch (t.type) {
	    case "translation":
		this.scene.translate(t.x, t.y, t.z);
		break;
	    case "rotation":
		switch (t.axis) {
		    case 'x':
			this.scene.rotate(t.angle, 1, 0, 0);
			break;
		    case 'y':
			this.scene.rotate(t.angle, 0, 1, 0);
			break;
		    case 'z':
			this.scene.rotate(t.angle, 0, 0, 1);
			break;
		}
		break;
	    case "scale":
		this.scene.scale(t.x, t.y, t.z);
		break;
	}
    }
};

Transformation.prototype.pop = function() {
    this.scene.popMatrix();
};
