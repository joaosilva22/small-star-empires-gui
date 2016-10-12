function Torus(scene, inner, outer, slices, loops) {
    CGFObject.call(this, scene);

    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
}

Torus.prototype = Object.create(CGFObject.prototype);
Torus.prototype.constructor = Torus;
//TODO
Torus.prototype.initBuffers = function() {

    this.radius = (this.outer-this.inner)/2;
    this.centerLine = this.inner+this.radius;

    this.vertices = [;

    this.indices = [];

    this.normals = [];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};/**
 * Created by DC on 12/10/2016.
 */
