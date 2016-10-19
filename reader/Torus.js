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
	    this.vertices.push(R*Math.cos(k) + (r*Math.cos(0)*Math.cos(k)));
	    this.vertices.push(r*Math.sin(0));
	    this.vertices.push((R+(r*Math.cos(0)))*Math.sin(k));

	    this.normals.push( Math.cos(k) * (Math.cos(k)*(-Math.sin(0))) );
	    this.normals.push( (-Math.sin(k))*Math.sin(k)*(-Math.sin(0)) - Math.cos(k)*Math.cos(k)*(-Math.sin(0)) );
	    this.normals.push( -Math.cos(k)*Math.cos(0) );
	}

	//Last loop
	for(var i=0; i < 2*Math.PI ;i+=incAngleSlice){
	   	//R+(r*Math.cos(i)))*Math.sin(k)
	   	this.vertices.push(R*Math.cos(0) + (r*Math.cos(i)*Math.cos(0)));
	   	this.vertices.push(r*Math.sin(i));
	   	this.vertices.push((R+(r*Math.cos(i)))*Math.sin(0));

	   	this.normals.push( Math.cos(0) * (Math.cos(0)*(-Math.sin(i))) );
	   	this.normals.push( (-Math.sin(0))*Math.sin(0)*(-Math.sin(i)) - Math.cos(0)*Math.cos(0)*(-Math.sin(i)) );
	   	this.normals.push( -Math.cos(0)*Math.cos(i) );
	   }
	this.vertices.push(R*Math.cos(0) + (r*Math.cos(0)*Math.cos(0)));
	this.vertices.push(r*Math.sin(0));
	this.vertices.push((R+(r*Math.cos(0)))*Math.sin(0));

	this.normals.push( Math.cos(0) * (Math.cos(0)*(-Math.sin(0))) );
	this.normals.push( (-Math.sin(0))*Math.sin(k)*(-Math.sin(0)) - Math.cos(0)*Math.cos(0)*(-Math.sin(0)) );
	this.normals.push( -Math.cos(0)*Math.cos(0) );

	//indices
	for(var i=0;i<=this.loops;i++){
		for(var j=0;j<=this.slices;j++){
			this.indices.push(((i+1)%(this.loops+1)) * (this.slices+1) + j,
				  i * (this.slices+1) + j,
			      i * (this.slices+1) + ((j + 1) % (this.slices+1)));

	    	this.indices.push(((i+1)%(this.loops+1)) * (this.slices+1) + j,
	    		  i * (this.slices+1) + ((j + 1) % (this.slices+1)),
			      ((i+1)%(this.loops+1)) * (this.slices+1) + ((j + 1) % (this.slices+1)));
		}
	}

	//tex
	for(var i=this.loops ; i>=0 ; i--){
		for(var j=this.slices ; j>=0 ; j--){
			this.texCoords.push(i/this.loops,j/this.slices);
		}
	}

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
