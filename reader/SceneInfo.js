function SceneInfo(root, axisLength) {
    this.ids = []
    this.root = root;
    this.axisLength = axisLength;
    this.views = new Views();
    this.illumination = new Illumination();
    this.lights = new Lights();
}

SceneInfo.prototype.toString = function() {
    return JSON.stringify(this);
};

