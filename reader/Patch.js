class Patch extends CGFnurbsObject {
    constructor(scene, controlvertexes, dx, dy) {
	var degree1 = controlvertexes.length-1;
	var degree2 = controlvertexes[0].length-1;

	var getKnotsVector = function(degree) {
	    var v = new Array();
	    for (var i = 0; i <= degree; i++) {
		v.push(0);
	    }
	    for (var i = 0; i <= degree; i++) {
		v.push(1);
	    }
	    return v;
	};

	var knots1 = getKnotsVector(degree1);
	var knots2 = getKnotsVector(degree2);

	var surface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	var getSurfacePoint = function(u, v) {
	    return surface.getPoint(u, v);
	}

	super(scene, getSurfacePoint, dx, dy);
    }

    setTexCoords() {}
};
