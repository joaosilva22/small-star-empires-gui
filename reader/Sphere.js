function Sphere(scene, radius, slices, stacks) {
    CGFObject.call(this, scene);

    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
}

Sphere.prototype = Object.create(CGFObject.prototype);
Sphere.prototype.constructor = Sphere;

//TODO verificar pode estar mal
Sphere.prototype.initBuffers = function() {

    /*r-raio, V-angulo vertical, H-angulo horizontal
      x = r sin V cos H
      y = r sin V sin H
      z = r cos V
     */
    var degree2rad= Math.PI/180.0;
    var incAngle=(360/this.slices)*degree2rad;
    var angle=0;
    this.vertices=[];
    this.normals = [];
    //this.texCoords = [];

    for(var i=0; i<=this.stacks;i+=1){
        for(angle = 0 ; angle < 2*Math.PI ; angle+=incAngle){

            this.vertices.push(this.radius * Math.cos(angle) * Math.cos( i/(this.stacks*Math.PI) ));
            this.vertices.push(this.radius * Math.sin(angle) * Math.cos( i/(this.stacks*Math.PI) ));
            this.vertices.push(this.radius * Math.sin(i/this.stacks*Math.PI));
            this.normals.push(this.radius * Math.cos(angle) * Math.cos( i/(this.stacks*Math.PI) ));
            this.normals.push(this.radius * Math.sin(angle) * Math.cos( i/(this.stacks*Math.PI) ));
            this.normals.push(this.radius * Math.sin( i/(this.stacks*Math.PI) ));
            //this.texCoords.push(0.5+0.5*Math.cos(angle)*Math.cos((i)/(this.stacks)*Math.PI/2),1-(0.5+0.5*Math.sin(angle))*Math.cos((i)/(this.stacks)*Math.PI/2));
        }
    }

    this.indices = [];

    for(var j = 0; j < this.stacks; j++){
        for(var i=0; i < this.slices ; i++){
            this.indices.push(j*this.slices+i);
            if(i == this.slices-1){
                this.indices.push(j*this.slices);
            }else this.indices.push(j*this.slices+i+1);
            this.indices.push((j+1)*this.slices+i);

            if(i == this.slices-1){
                this.indices.push(j*this.slices);
            }else this.indices.push(j*this.slices+i+1);

            if(i == this.slices-1){
                this.indices.push((j+1)*this.slices);
            }else this.indices.push((j+1)*this.slices+i+1);
            this.indices.push((j+1)*this.slices+i);
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
