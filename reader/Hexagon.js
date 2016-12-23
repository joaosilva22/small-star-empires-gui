
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

class HexaPrism extends CGFobject {
    constructor(scene) {
		super(scene);

		this.side = new Rectangle(scene, 0.25, 0, -0.25, -1);
		this.hex = new Hexagon(scene);

		this.verticalOffset = 0;//Math.random() * 0.10;

		this.textures = {
			'base' : new CGFtexture(this.scene, 'resources/relaig/base.png'),
			'0': new CGFtexture(this.scene, 'resources/relaig/empty.png'),
			'1': new CGFtexture(this.scene, 'resources/relaig/one-planet.png'),
			'2': new CGFtexture(this.scene, 'resources/relaig/two-planet.png'),
			'3': new CGFtexture(this.scene, 'resources/relaig/three-planet.png'),
			'g': new CGFtexture(this.scene, 'resources/relaig/blue-home.png'),
			'h': new CGFtexture(this.scene, 'resources/relaig/yellow-home.png'),
			'z': new CGFtexture(this.scene, 'resources/relaig/red-nebula.png'),
			'w': new CGFtexture(this.scene, 'resources/relaig/wormhole.png'),
			'b': new CGFtexture(this.scene, 'resources/relaig/blackhole.png')
		}
			
	}

	display(type) {
		let initial = Math.PI/6;
		for (let i = 0; i < 6; i++) {
			let angle = Math.PI/6 + i*Math.PI/3;
			this.scene.pushMatrix();
			this.scene.rotate(angle, 0, 1, 0);
			this.scene.translate(0, 0, Math.sqrt(3)/4);
			this.textures['base'].bind();
			this.side.display();
			this.scene.popMatrix();
		}

		this.scene.pushMatrix();
		this.textures[type].bind();
		this.hex.display();
		this.scene.popMatrix();
    }
}
