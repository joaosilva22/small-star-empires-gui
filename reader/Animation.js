class Animation {
    constructor(id, span) {
	this.id = id;
	this.span = span;
    }

    apply() {}
};

class LinearAnimation extends Animation {
    constructor(id, span) {
	super(id, span);
	this.controlPoints = [];
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

