/*
 * Method that creates a cylinder primitive.
 */
function Cylinder(scene, base, top, height, slices, stacks) {
    CGFobject.call(this, scene);

    this.base = base;
    this.top = top;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
}

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.setTexCoords = function() {
};

Cylinder.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
    
    var angularstep = (360.0/this.slices)*(Math.PI/180.0);
    var stackstep = this.height/this.stacks;
    var radiusstep = (this.top-this.base)/this.stacks;

    var currentangle = 0;
    var currentstack = 0;
    var currentradius = this.base;

    for (var i = 0; i <= this.stacks; i++) {
	currentstack = i*stackstep;
	currentradius = this.base + i*radiusstep;
	for (var j = 0; j <= this.slices; j++) {
	    currentangle = Math.PI - j*angularstep;

	    this.vertices.push(currentradius * Math.cos(currentangle),
			       currentradius * Math.sin(currentangle),
			       currentstack);
	    
	    this.normals.push(currentradius * Math.cos(currentangle),
			      currentradius * Math.sin(currentangle),
			      0);
	}
    }

    for (var i = 1; i <= this.stacks; i++) {
	for (var j = 0; j <= this.slices; j++) {
	    this.indices.push((i - 1) * (this.slices + 1) + j,
			      i * (this.slices + 1) + j,
			      (i - 1) * (this.slices + 1) + ((j + 1) % (this.slices + 1)));
	    
	    this.indices.push((i - 1) * (this.slices + 1) + ((j + 1) % (this.slices + 1)),
			      i * (this.slices + 1) + j,
			      i * (this.slices + 1) + ((j + 1) % (this.slices + 1)));
	}
    }

    for (var i = this.stacks; i >= 0; i--) {
	for (var j = this.slices; j >= 0; j--) {
	    this.texCoords.push(j/this.slices, i/this.stacks);
	}
    }

    // Desenha as tampas
    currentangle = 0;
    for (var i = 0; i < this.slices; i++) {
	currentangle = Math.PI - i*angularstep;
	this.vertices.push(this.top * Math.cos(currentangle),
			   this.top * Math.sin(currentangle),
			   this.height);
	this.normals.push(0, 0, 1);
	this.texCoords.push(0.5 * Math.cos(currentangle) + 0.5,0.5 * Math.sin(currentangle) + 0.5);
    }
    this.vertices.push(0, 0, this.height);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5,0.5);
    for (var i = 0; i < this.slices; i++) {
	var num = this.vertices.length/3;
	this.indices.push(num - 1,
			  num - (i % this.slices + 2),
			  num - ((i+1) % this.slices + 2));
			  
    }

    currentangle = 0;
    for (var i = 0; i < this.slices; i++) {
	currentangle = Math.PI - i*angularstep;
	this.vertices.push(this.base * Math.cos(currentangle),
			   this.base * Math.sin(currentangle),
			   0);
	this.normals.push(0, 0, -1);
	this.texCoords.push(0.5 * Math.cos(currentangle) + 0.5,0.5 * Math.sin(currentangle) + 0.5);
    }
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, -1);
    this.texCoords.push(0.5,0.5);
    for (var i = 0; i < this.slices; i++) {
	var num = this.vertices.length/3;
	this.indices.push(num - 1,
			  num - ((i+1) % this.slices + 2),
			  num - (i % this.slices + 2));
	
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
