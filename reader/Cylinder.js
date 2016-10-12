function Cylinder(scene, base, top, height, slices, stacks) {
    CGFObject.call(this, scene);

    this.base = base; //raio
    this.top = top; //raio
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
}

Cylinder.prototype = Object.create(CGFObject.prototype);
Cylinder.prototype.constructor = Cylinder;

//TODO tampos(falta) (verificar TOP? BASE?)
Cylinder.prototype.initBuffers = function() {
    this.passoAngular = (360.0/this.slices)*(Math.PI/180.0);
    this.passoAndar = this.height/this.stacks;
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
    this.difRaios = this.top-this.base;
    this.passoRaio = difRaios/this.stacks;

    this.anguloAtual = 0;
    this.andarAtual = 0;
    this.raioAtual = this.base;

    for(var k=0; k < this.stacks ; k++){
        this.andarAtual = k*this.passoAndar;
        this.raioAtual = this.base + k*this.passoRaio;
        for(var i=0 ; i < this.slices ; i++){
            this.anguloAtual = i*this.passoAngular;

            this.vertices.push(this.raioAtual * Math.cos(this.anguloAtual));
            this.vertices.push(this.raioAtual * Math.sin(this.anguloAtual));
            this.vertices.push(this.andarAtual);

            if (k % 2 == 0) {
                if (i % 2 == 0) {
                    this.texCoords.push(0);
                    this.texCoords.push(1);
                } else {
                    this.texCoords.push(1);
                    this.texCoords.push(1);
                }
            } else {
                if (i % 2 == 0) {
                    this.texCoords.push(0);
                    this.texCoords.push(0);
                } else {
                    this.texCoords.push(1);
                    this.texCoords.push(0);
                }
            }

            this.normals.push(this.raioAtual * Math.cos(this.anguloatual));
            this.normals.push(this.raioAtual * Math.sin(this.anguloatual));
            this.normals.push(0);
        }
    }

    for (var m = 1; m < this.stacks; m++) {
        this.andaratual = m*this.passoAndar;
        for (var j = 0; j < this.slices; j++) {
            this.indices.push((this.andaratual - this.passoAndar) * this.slices + j);
            this.indices.push((this.andaratual - this.passoAndar) * this.slices + ((j + 1) % this.slices));
            this.indices.push(this.andaratual * this.slices + j);

            this.indices.push((this.andaratual - this.passoAndar) * this.slices + ((j + 1) % this.slices));
            this.indices.push(this.andaratual * this.slices + ((j + 1) % this.slices));
            this.indices.push(this.andaratual * this.slices + j);
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
