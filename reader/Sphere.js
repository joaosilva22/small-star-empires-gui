function Sphere(scene, radius, slices, stacks) {
    CGFobject.call(this, scene);

    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
}

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.setTexCoords = function(length_s, length_t) {
};

Sphere.prototype.initBuffers = function() {

    this.vertices=[];
    this.indices=[];
    this.normals=[];
    this.texCoords=[];

    var steph=(360/this.slices)*(Math.PI/180.0);
    var stepv=(Math.PI)/this.stacks;
    var angleh = 0;
    var anglev = 0;
    var currentstack = 0;

    for (var i = 0; i <= this.stacks; i++) {
	anglev = Math.PI - i*stepv;
	for (var j = 0; j <= this.slices; j++)  {
	    angleh = Math.PI - j * steph;

	    this.vertices.push(this.radius * Math.sin(anglev) * Math.cos(angleh),
			       this.radius * Math.cos(anglev),
			       this.radius * Math.sin(anglev) * Math.sin(angleh));
	    
	    this.normals.push(Math.sin(anglev) * Math.cos(angleh),
			      Math.cos(anglev),
			      Math.sin(anglev) * Math.sin(angleh));
	}
    }

    for (var i = 1; i <= this.stacks; i++) {
	for (var j = 0; j <= this.slices; j++) {
	    this.indices.push((i - 1) * (this.slices + 1) + j,
			      (i - 1) * (this.slices + 1) + ((j + 1) % (this.slices + 1)),
			      i * (this.slices + 1) + j);

	    this.indices.push((i - 1) * (this.slices + 1) + ((j + 1) % (this.slices + 1)),
			      i * (this.slices + 1) + ((j + 1) % (this.slices + 1)),
			      i * (this.slices + 1) + j);
	}
    }

    for (var i = this.stacks; i >= 0; i--) {
	for (var j = this.slices; j >= 0; j--) {
	    this.texCoords.push(j/this.slices, i/this.stacks);
	}
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
