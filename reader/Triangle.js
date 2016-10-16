function Triangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    CGFobject.call(this, scene);

    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;

    this.initBuffers();
}

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.setTexCoords = function(length_s,length_t) {
    this.s = length_s;
    this.t = length_t;
    this.initBuffers();
};

Triangle.prototype.initBuffers = function() {
    this.vertices = [
        this.x1, this.y1, this.z1,
        this.x2, this.y2, this.z2,
        this.x3, this.y3, this.z3
    ];

    this.indices = [
        0, 1, 2
    ];

    this.normals = [
        this.y1*this.z2-this.z1*this.y2, this.z1*this.x2 - this.x1*this.z2, this.x1*this.y2-this.y1*this.x2,
        this.y2*this.z3-this.z2*this.y3, this.z2*this.x3 - this.x2*this.z3, this.x2*this.y3-this.y2*this.x3,
        this.y3*this.z1-this.z3*this.y1, this.z3*this.x1 - this.x3*this.z1, this.x3*this.y1-this.y3*this.x1,
    ];

    if (this.s != undefined && this.t != undefined) {
	var a = Math.sqrt(Math.pow(this.x1-this.x3,2) +  Math.pow(this.y1-this.y3,2) + Math.pow(this.z1-this.z3,2));
	var b = Math.sqrt(Math.pow(this.x2-this.x1,2) +  Math.pow(this.y2-this.y1,2) + Math.pow(this.z2-this.z1,2));
	var c = Math.sqrt(Math.pow(this.x3-this.x2,2) +  Math.pow(this.y3-this.y2,2) + Math.pow(this.z3-this.z2,2));
	var cosBeta = (a*a - b*b + c*c)/(2*a*c);
	var sinBeta = 1-(cosBeta*cosBeta);
	
	this.texCoords = [
	    this.s*(c-a*cosBeta), this.t*(a*sinBeta),
	    0,0,
	    this.s*c,0
	];
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
