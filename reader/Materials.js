function Material(id) {
    this.id = id;
    this.emission = new RGBA();
    this.ambient = new RGBA();
    this.diffuse = new RGBA();
    this.specular = new RGBA();
    this.shininess = null;
}

function Materials() {
    this.materials = [];
}

Materials.prototype.addMaterial = function(material) {
    this.materials.push(material);
};
