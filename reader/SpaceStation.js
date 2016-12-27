class SpaceStation extends CGFobject{
	constructor(scene){
		super(scene);
		this.ring = new Torus(scene, 0.125, 0.15, 24, 48);
		this.body = new Torus(scene, 0.07,0.09,24,48);
		this.body2 = new Cylinder(scene, 0.020, 0.020, 0.2, 24, 1);
		this.sphere = new Sphere(scene, 0.08, 24, 24);
		this.joint = new Cylinder(scene, 0.008,0.008,0.08,24,1);
	}

	display(){
		this.scene.pushMatrix();
		this.scene.translate(0,0.195,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.body2.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.1,0);
		for(let i=0;i<6;i++){
			this.scene.rotate(Math.PI/3,0,1,0);
			this.joint.display();
		}
		this.scene.rotate(Math.PI/2	,1,0,0);
		this.ring.display();
		this.body.display();
		
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0,0.180,0);
		this.scene.scale(1,0.25,1);
		this.sphere.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.scale(1,0.25,1);
		this.sphere.display();
		this.scene.popMatrix();
	}
}