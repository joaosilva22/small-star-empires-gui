
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

		this.texCoords = [];
		for (let i = 0; i < 6; i++) {
			let angle = i*(Math.PI/3);
			this.texCoords.push(
				Math.sin(angle) / 2 + 0.5,
				Math.cos(angle) / 2 + 0.5
			);
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
}


