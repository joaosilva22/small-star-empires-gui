function Sphere(scene, radius, slices, stacks) {
    CGFobject.call(this, scene);

    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
}

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.setTexCoords = function() {
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
	for (var j = 0; j < this.slices; j++)  {
	    angleh = j * steph;

	    this.vertices.push(this.radius * Math.sin(anglev) * Math.cos(angleh),
			       this.radius * Math.cos(anglev),
			       this.radius * Math.sin(anglev) * Math.sin(angleh));

	    this.texCoords.push(0.5 + (Math.sin(anglev) * Math.cos(angleh)) / 2);
            this.texCoords.push(0.5 + (Math.sin(anglev) * Math.sin(angleh)) / 2);
	    
	    this.normals.push(Math.sin(anglev) * Math.cos(angleh),
			      Math.cos(anglev),
			      Math.sin(anglev) * Math.sin(angleh));
	}
    }

    for (var i = 1; i <= this.stacks; i++) {
	for (var j = 0; j < this.slices; j++) {
	    this.indices.push((i - 1) * this.slices + j,
			      i * this.slices + j,
			      (i - 1) * this.slices + ((j + 1) % this.slices));

	    this.indices.push((i - 1) * this.slices + ((j + 1) % this.slices),
			      i * this.slices + j,
			      i * this.slices + ((j + 1) % this.slices));
	}
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
