function Rectangle(scene, x1, y1, x2, y2) {
    CGFobject.call(this, scene);

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.initBuffers();
}

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.setTexCoords = function(length_s, length_t){
    this.s = length_s;
    this.t = length_t;
    this.initBuffers();
};

Rectangle.prototype.initBuffers = function() {
    this.vertices = [
	this.x1, this.y1, 0,
	this.x2, this.y1, 0,
	this.x2, this.y2, 0,
	this.x1, this.y2, 0
    ];

    this.indices = [
	0, 1, 2,
	2, 3, 0
    ];

    this.normals = [
	0, 0, 1,
	0, 0, 1,
	0, 0, 1,
	0, 0, 1
    ];

    if (this.s != undefined && this.t != undefined) {
	this.texCoords = [
	    0,this.t,
	    this.s,this.t,
	    this.s,0,
	    0,0
	];
    }
    //this.texCoords = [
//	0,1,
//	1,1,
//	1,0,
//	0,0
  //  ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
