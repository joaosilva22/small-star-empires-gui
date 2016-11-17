class Plane extends CGFnurbsObject {
    constructor(scene, x, y, dx, dy) {
	var controlvertexes = [
	    [
		[-x/2, -y/2, 0, 1],
		[-x/2, y/2, 0, 1]
	    ],
	    [
		[x/2, -y/2, 0, 1],
		[x/2, y/2, 0, 1]
	    ]
	];

	var knots1 = [0, 0, 1, 1];
	var knots2 = [0, 0, 1, 1];

	var surface = new CGFnurbsSurface(1, 1, knots1, knots2, controlvertexes);
	var getSurfacePoint = function(u, v) {
	    return surface.getPoint(u, v);
	};

	super(scene, getSurfacePoint, dx, dy);
    }

    setTexCoords() {}
};
