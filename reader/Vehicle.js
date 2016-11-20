
class Trapezoid extends CGFobject {
    constructor(scene, x1, y1, x2, y2, x3, y3, x4, y4) {
	super(scene);

	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.x3 = x3;
	this.y3 = y3;
	this.x4 = x4;
	this.y4 = y4;

	this.initBuffers();
    }

    initBuffers() {
	this.vertices = [
	    this.x1, this.y1, 0,
	    this.x2, this.y2, 0,
	    this.x3, this.y3, 0,
	    this.x4, this.y4, 0
	];

	this.indices = [
	    0, 1, 2,
	    2, 3, 0
	];

	this.normals = [
	    0, 0, 1,
	    0, 0, 1,
	    0, 0, 1,
	    0, 0, 1
	];

	this.texCoords = [
	    0, 1,
	    1, 1,
	    1, 0,
	    0, 0
	];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
    }
};

class Box extends CGFobject {
    constructor(scene, width, height, depth) {
	super(scene);

	this.w = width;
	this.h = height;
	this.d = depth;

	this.top = new Rectangle(scene, -width/2, -depth/2, width/2, depth/2);
	this.side = new Rectangle(scene, -width/2, -height/2, width/2, height/2);
	this.base = new Rectangle(scene, -depth/2, -height/2, depth/2, height/2);
    }

    display() {

	this.scene.pushMatrix();
	this.scene.translate(0, -this.h/2, 0);
	this.scene.rotate(Math.PI/2, 1, 0, 0);
	this.top.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0, this.h/2, 0);
	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	this.top.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0, 0, this.d/2);
	this.side.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.translate(0, 0, this.d/2);
	this.side.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(Math.PI/2, 0, 1, 0);
	this.scene.translate(0, 0, this.w/2);
	this.base.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(-Math.PI/2, 0, 1, 0);
	this.scene.translate(0, 0, this.w/2);
	this.base.display();
	this.scene.popMatrix();
	
    }
    
};


class VehicleBody extends CGFobject {
    constructor(scene) {
	super(scene);

	this.side = new Rectangle(scene, -2.5, -1, 2.5, 1);
	this.top = new Rectangle(scene, 2.5, 4, -2.5, 0);
    }

    display() {
	
	this.scene.pushMatrix();
	this.scene.translate(0, 0, 2);
	this.side.display();
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.translate(0, 0, 4);
	this.side.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0, 1, 2);
	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	this.top.display();
	this.scene.popMatrix();
	
    }
    
};

class Vehicle extends CGFobject {
    constructor(scene) {
	super(scene);

	this.body = new Box(scene, 5, 1.5, 3);
	this.bodyTop = new Box(scene, 2.5, 1, 3);

	// O comprimento do vidro da frent e :
	// c = Math.sqrt( (body.w/2)^2 + bodyTop.h^2 )
	// O angulo que o vidro faz com o plano xz e :
	// a = Math.atan( (body.w/2) / bodyTop.h )
	var c = Math.sqrt( Math.pow(this.body.w/2, 2) + Math.pow(this.bodyTop.h, 2) );
	this.cockpitFront = new Rectangle(scene, -1.5, -c/2, 1.5, c/2);

	// Os vidos laterais tem como coordenadas :
	// 1: ( -body.w/4, -bodyTop.h/2, 0)
	// 2: ( body.w/4, -bodyTop.h/2, 0)
	// 3: ( -body.w/4, bodyTop.h/2, 0)
	this.cockpitRightSide = new Triangle(scene,
					    -this.body.w/4, -this.bodyTop.h/2, 0,
					     this.body.w/4, -this.bodyTop.h/2, 0,
					    -this.body.w/4, this.bodyTop.h/2, 0);
	this.cockpitLeftSide = new Triangle(scene,
					    this.body.w/4, -this.bodyTop.h/2, 0,
					   -this.body.w/4, -this.bodyTop.h/2, 0,
					   -this.body.w/4, this.bodyTop.h/2, 0);					    
	this.cockpitRightSide.setTexCoords(1, 1);
	this.cockpitLeftSide.setTexCoords(1, 1);

	// Os canos laterais sao superficies curvas
	// Com os pontos de controlo seguintes:
	// U[0] :
	//     V[0] : (-body.w/4, -body.h/2, 0, 1);
	//     V[1] : (-body.w/4, 0, 1, 1);
	//     V[2] : (-body.w/4, body.h/2, 0, 1);
	// U[1] :
	//     V[0] : (body.w/4, -body.h/2, 0, 1);
	//     V[1] : (body.w/4, 0, 1, 1);
	//     V[2] : (body.w/4, body.h/2, 0, 1);
	var controlvertexes = [
	    [
		[-this.body.w/4, -this.body.h/2, 0, 1],
		[-this.body.w/4, 0, 1, 1],
		[-this.body.w/4, this.body.h/2, 0, 1]
	    ],
	    [
		[this.body.w/4, -this.body.h/2, 0, 1],
		[this.body.w/4, 0, 1, 1],
		[this.body.w/4, this.body.h/2, 0, 1]
	    ]
	];
	this.exaust = new Patch(scene, controlvertexes, 10, 10);
			
    }

    display() {

	this.scene.pushMatrix();
	this.body.display()
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(-1.25, 1.25, 0);
	this.bodyTop.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(1.25, 1.25, 0);
	this.scene.rotate(Math.PI/2, 0, 1, 0);
	this.scene.rotate(-Math.atan((this.body.w/2)/this.bodyTop.h), 1, 0, 0);
	this.cockpitFront.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(1.25, 1.25, 1.50);
	this.cockpitRightSide.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(1.25, 1.25, -1.50);
	this.cockpitLeftSide.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(-1.25, 0, 1.5);
	this.exaust.display();
	this.scene.popMatrix();
	
    }
};
