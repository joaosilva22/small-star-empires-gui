function Chessboard(scene,du,dv,c1,c2,cs,su,sv,textureref) {
    CGFobject.call(this, scene);
    this.textureref=textureref;
    this.scene = scene;
    this.du = du;
    this.dv=dv;
    this.c1=c1;
    this.c2=c2;
    this.cs=cs;
    this.su=su;
    this.sv=sv;
    this.plane = new Plane(scene,1,1,this.du*4,this.dv*4);

    this.appearance = new CGFappearance(this.scene);

    this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.appearance.setSpecular(0.0, 0.0, 0.0, 1);  
    this.appearance.setShininess(120);
    console.log(this.scene.graph.textures[this.textureref]);
    this.appearance.setTexture(this.scene.graph.textures[this.textureref].texture);

    this.shader = new CGFshader(this.scene.gl,"shaders/shader.vert","shaders/shader.frag");
    this.shader.setUniformsValues({du:this.du, dv:this.dv, c1:this.c1, c2:this.c2, cs:this.cs, su:this.su, sv:this.sv});
}

Chessboard.prototype = Object.create(CGFobject.prototype);
Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.setTexCoords = function(length_s, length_t) {
    this.plane.setTexCoords();
};

Chessboard.prototype.display = function(){
    this.scene.enableTextures(true);
    this.appearance.apply();
    this.scene.setActiveShader(this.shader);
    this.scene.pushMatrix();
    this.plane.display();
    this.scene.popMatrix();
    this.scene.setActiveShader(this.scene.defaultShader);
}
