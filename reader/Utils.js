function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function Vector4(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

Vector4.prototype.dotProduct = function(vec) {
    var ret = 0;
    ret += this.x * vec.x;
    ret += this.y * vec.y;
    ret += this.z * vec.z;
    ret += this.w * vec.w;
    return ret;
};

function RGBA(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}
 
function contains(array, object) {
    for (var i = 0; i < array.length; i++) {
	if (array[i] === object) {
	    return true;
	}
    }
    return false;
}

function Matrix4() {
    this.matrix = [
	[1, 0, 0, 0],
	[0, 1, 0, 0],
	[0, 0, 1, 0],
	[0, 0, 0, 1]
    ];
}

Matrix4.prototype.getRow = function(i) {
    var ret = new Vector4(this.matrix[i][0],
			  this.matrix[i][1],
			  this.matrix[i][2],
			  this.matrix[i][3]);
    return ret;
};

Matrix4.prototype.getColumn = function(i) {
    var ret = new Vector4(this.matrix[0][i],
			  this.matrix[1][i],
			  this.matrix[2][i],
			  this.matrix[3][i]);
    return ret;
};

function multMatrix4(m1, m2) {
    var ret = new Matrix4();
    for (var i = 0; i < 4; i++) {
	var row = [];
	for (var j = 0; j < 4; j++) {
	    row.push(m1.getRow(i).dotProduct(m2.getColumn(j))); 
	}
	ret.matrix[i] = row;
    }
    return ret;
}
