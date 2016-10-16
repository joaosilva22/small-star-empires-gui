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

Rectangle.prototype.setTexCoords(length_s,length_t) = function(){
	this.texCoords = [
		0,length_t,
		length_s,length_t,
		0,0,
		length_s,0
	];
}

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
    //TODO
    this.texCoords = [];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
