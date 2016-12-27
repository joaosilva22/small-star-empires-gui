class Ovni extends CGFobject{
	constructor(scene){
		super(scene);
		this.body = new Sphere(scene,0.19,24,24);
		this.cockpit = new Sphere(scene,0.1,24,24);
		this.anthem = new Cylinder(scene,0.007,0.0025,0.1,24,1);
		this.anthemBall = new Sphere(scene,0.01,24,24);
	}

	display(){
		this.scene.pushMatrix();
		this.scene.scale(1.0,0.3,1.0);
		this.body.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.07,0);
		this.cockpit.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.15,0);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.anthem.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.25,0);
		this.anthemBall.display();
		this.scene.popMatrix();
	}
}