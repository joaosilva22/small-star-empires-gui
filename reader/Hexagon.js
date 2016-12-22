
class Hexagon extends CGFobject {
    constructor(scene) {
		super(scene);
		this.initBuffers();
    }

    initBuffers() {
		this.vertices = [];
		for (let i = 0; i < 6; i++) {
			let angle = i*(Math.PI/3);
			this.vertices.push(
				Math.sin(angle) / 2,
				0,
				Math.cos(angle) / 2
			);
		}

		this.indices = [
			0, 1, 2,
			0, 2, 3,
			0, 3, 5,
			3, 4, 5
		];

		this.normals = [];
		for (let i = 0; i < 6; i++) {
			this.normals.push(0, 1, 0);
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
}

class HexaPrism extends CGFobject {
    constructor(scene) {
		super(scene);

		this.side = new Rectangle(scene, 0.25, 0, -0.25, -1);
		this.hex = new Hexagon(scene);

		this.verticalOffset = Math.random() * 0.10;
	}

	display() {
		let initial = Math.PI/6;
		for (let i = 0; i < 6; i++) {
			let angle = Math.PI/6 + i*Math.PI/3;
			this.scene.pushMatrix();
			this.scene.rotate(angle, 0, 1, 0);
			this.scene.translate(0, 0, Math.sqrt(3)/4);
			this.side.display();
			this.scene.popMatrix();
		}

		this.scene.pushMatrix();
		this.hex.display();
		this.scene.popMatrix();
    }
}
