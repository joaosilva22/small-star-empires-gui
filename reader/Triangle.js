function Triangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    CGFobject.call(this, scene);

    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;

    this.initBuffers();
}

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function() {
    this.vertices = [
        this.x1, this.y1, this.z1,
        this.x2, this.y2, this.z2,
        this.x3, this.y3, this.z3
    ];

    this.indices = [
        0, 1, 2
    ];

    this.normals = [
        //0->x1,y1,z1 X 1->x2,y2,z2
        this.y1*this.z2-this.z1*this.y2, this.z1*this.x2 - this.x1*this.z2, this.x1*this.y2-this.y1*this.x2,
        //1 X 2
        this.y2*this.z3-this.z2*this.y3, this.z2*this.x3 - this.x2*this.z3, this.x2*this.y3-this.y2*this.x3,
        //2 X 0
        this.y3*this.z1-this.z3*this.y1, this.z3*this.x1 - this.x3*this.z1, this.x3*this.y1-this.y3*this.x1,
    ];

    //TODO
    this.texCoords = [];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
