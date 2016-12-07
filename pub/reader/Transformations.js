/*
 * Creates a translation object.
 */
function Translation(x, y, z) {
    this.type = "translation";
    this.x = x;
    this.y = y;
    this.z = z;
}

/*
 * Creates a rotation object.
 */
function Rotation(axis, angle) {
    this.type = "rotation";
    this.axis = axis;
    this.angle = angle;
}

/*
 * Creates a scale object.
 */
function Scale(x, y, z) {
    this.type = "scale";
    this.x = x;
    this.y = y;
    this.z = z;
}

/*
 * Creates a transformation object.
 */
function Transformation(scene) {
    this.scene = scene;
    this.queue = [];
}

/*
 * Adds a translation to the transformation queue.
 */
Transformation.prototype.translate = function(x, y, z) {
    this.queue.push(new Translation(x, y, z));
};

/*
 * Adds a rotation to the transformation queue.
 */
Transformation.prototype.rotate = function(axis, angle) {
    var rad = angle * (Math.PI/180);
    this.queue.push(new Rotation(axis, rad));
};

/*
 * Adds a scale to the transformation queue.
 */
Transformation.prototype.scale = function(x, y, z) {
    this.queue.push(new Scale(x, y, z));
};

/*
 * Pushes the transformation matrix.
 */
Transformation.prototype.push = function() {
    this.scene.pushMatrix();
    for (let t of this.queue) {
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

/*
 * Pops the transformation matrix.
 */
Transformation.prototype.pop = function() {
    this.scene.popMatrix();
};
