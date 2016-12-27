class SpaceColony extends CGFobject{
	constructor(scene){
		super(scene);
		this.start = new Cylinder(scene,0.005,0.005,0.05,12,1)
		this.bottom = new Cylinder(scene,0.02,0.02,0.025,12,1);
		this.mid = new Cylinder(scene,0.03,0.03,0.05,12,1);
		this.top = new Cylinder(scene,0.035,0.035,0.2,12,1);

		this.headtop = new Cylinder(scene,0.15,0.035,0.025,12,1);
		this.headmid = new Cylinder(scene,0.15,0.15,0.025,12,1);
		this.headbot = new Cylinder(scene,0.035,0.15,0.025,12,1);

		this.ring = new Torus(scene, 0.075, 0.1, 24, 48);
		this.ring2 = new Torus(scene, 0.055, 0.075, 24, 48);
		this.ring3 = new Torus(scene, 0.04, 0.05, 24, 48);
	}

	display(){
		this.scene.pushMatrix();
		this.scene.translate(0,0.100,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.start.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.125,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.bottom.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.175,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.mid.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.375,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.top.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.350,0);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.headtop.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.325,0);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.headmid.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.300,0);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.headbot.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.275,0);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.ring.display();
		this.scene.popMatrix();


		this.scene.pushMatrix();
		this.scene.translate(0,0.2,0);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.ring2.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.1,0);
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.ring3.display();
		this.scene.popMatrix();

	}
}