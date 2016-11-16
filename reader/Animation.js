class Animation {
    constructor(id, span) {
	this.id = id;
	this.span = span;
    }

    push(scene) {}

    pop(scene) {}
};

class LinearAnimation extends Animation {
    constructor(id, span) {
	super(id, span);
	
	this.controlPoints = [];
	this.position = vec3.fromValues(0, 0, 0);
    }
    
    addControlPoint(point) {
	this.controlPoints.push(point);
    }

    
};

class CircularAnimation extends Animation {
    constructor(id, span, center, radius, startang, rotang) {
	super(id, span);
	this.center = center;
	this.radius = radius;
	this.startang = startang;
	this.rotang = rotang;
    }
};

