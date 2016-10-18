function Torus(scene, inner, outer, slices, loops) {
    CGFobject.call(this, scene);

    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
}

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

Torus.prototype.setTexCoords = function(){
	
};

Torus.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var r = (this.outer-this.inner)/2;
    var R = this.inner + r;
    //x=(R+r*cos(angleSlice))*cos(angleLoop)
    //y=r*sin(angleSlice)
    //z=(R+r*sin(angleSlice))*cos(angleLoop)

    var incAngleSlice = (360/this.slices)*(Math.PI/180.0);
    var incAngleLoop = (360/this.loops)*(Math.PI/180.0);

    for(var k=0; k < 2*Math.PI ;k+=incAngleLoop){
	    for(var i=0; i < 2*Math.PI ;i+=incAngleSlice){
	    	//R+(r*Math.cos(i)))*Math.sin(k)
	    	this.vertices.push(R*Math.cos(k) + (r*Math.cos(i)*Math.cos(k)));
	    	this.vertices.push(r*Math.sin(i));
	    	this.vertices.push((R+(r*Math.cos(i)))*Math.sin(k));

	    	this.normals.push( Math.cos(k) * (Math.cos(k)*(-Math.sin(i))) );
	    	this.normals.push( (-Math.sin(k))*Math.sin(k)*(-Math.sin(i)) - Math.cos(k)*Math.cos(k)*(-Math.sin(i)) );
	    	this.normals.push( -Math.cos(k)*Math.cos(i) );
	    }
	}

	//indices
	for(var i=0;i<this.loops;i++){
		for(var j=0;j<this.slices;j++){
			this.indices.push(((i+1)%this.loops) * this.slices + j,
				  i * this.slices + j,
			      i * this.slices + ((j + 1) % this.slices));

	    	this.indices.push(((i+1)%this.loops) * this.slices + j,
	    		  i * this.slices + ((j + 1) % this.slices),
			      ((i+1)%this.loops) * this.slices + ((j + 1) % this.slices));
		}
	}

	//tex
	for(var i=0;i<this.loops;i++){
		for(var j=0;j<this.slices;j++){
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

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
