function Cylinder(scene, base, top, height, slices, stacks) {
    CGFobject.call(this, scene);

    this.base = base; //raio
    this.top = top; //raio
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
	currentstack = i*stackstep - this.height/2;
	currentradius = this.base + i*radiusstep;
	for (var j = 0; j <= this.slices; j++) {
	    currentangle = j*angularstep;

	    this.vertices.push(currentradius * Math.cos(currentangle),
			       currentstack,
			       currentradius * Math.sin(currentangle));

	    this.normals.push(currentradius * Math.cos(currentangle),
			      0,
			      currentradius * Math.sin(currentangle));

	    if (i % 2 === 0) {
                if (j % 2 === 0) {
                    this.texCoords.push(0);
                    this.texCoords.push(1);
                } else {
                    this.texCoords.push(1);
                    this.texCoords.push(1);
                }
            } else {
                if (j % 2 === 0) {
                    this.texCoords.push(0);
                    this.texCoords.push(0);
                } else {
                    this.texCoords.push(1);
                    this.texCoords.push(0);
                }
            }
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

    this.vertices.push(0, this.height/2, 0);
    this.texCoords.push(0.5,0.5);
    var num = this.vertices.length/3;
    for (var i = 0; i < this.slices; i++) {
	this.indices.push(num - 2,
			  num - (i+2),
			  num - ((i+1)%this.slices+2));
    }
    this.normals.push(0,1,0);

    this.vertices.push(0, -this.height/2, 0);
    this.texCoords.push(0.5,0.5);
    var num = this.vertices.length/3;
    for (var i = 0; i < this.slices; i++) {
	this.indices.push(num - 1,
			  i,
			  (i+1)%this.slices);
    }
    this.normals.push(0,-1,0);
    
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
