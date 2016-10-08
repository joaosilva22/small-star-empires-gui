function Rectangle(x1, y1, x2, y2) {
    this.v1 = new Vector3(x1, y1, 0);
    this.v2 = new Vector3(x2, y2, 0);
}

function Triangle(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    this.v1 = new Vector3(x1, y1, z1);
    this.v2 = new Vector3(x2, y2, z2);
    this.v3 = new Vector3(x3, y3, z3);
}

function


function Primitive(id) {
    this.id = id;
    this.primitive = null;
}

function Primitives() {
    this.primitives = [];
}
