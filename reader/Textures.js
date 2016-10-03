function Texture(id, file, lengthS, lengthT) {
    this.id = id;
    this.file = file;
    this.lengthS = lengthS;
    this.lengthT = lengthT;
}

function Textures() {
    this.textures = [];
}

Textures.prototype.addTexture = function(texture) {
    this.textures.push(texture);
};
