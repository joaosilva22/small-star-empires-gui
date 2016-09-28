function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function RGBA(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

/*
 * Checks whether or not an array contains an object.
 */ 
function contains(array, object) {
    for (var i = 0; i < array.length; i++) {
	if (array[i] === object) {
	    return true;
	}
    }
    return false;
};
