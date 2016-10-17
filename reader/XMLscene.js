function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis=new CGFaxis(this);

    this.enableTextures(true);
};

XMLscene.prototype.initLights = function () {

    this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () {
    
    this.axis = new CGFaxis(this, this.graph.axisLenght);

    this.camera = this.graph.views.default;
    this.interface.setActiveCamera(this.camera);
    
    this.gl.clearColor(this.graph.illumination.background.r,
		       this.graph.illumination.background.g,
		       this.graph.illumination.background.b,
		       this.graph.illumination.background.a);

    this.setAmbient(this.graph.illumination.ambient.r,
		    this.graph.illumination.ambient.g,
		    this.graph.illumination.ambient.b,
		    this.graph.illumination.ambient.a);

    this.setupLights();
};

XMLscene.prototype.display = function () {
    // ---- BEGIN Background, camera and axis setup
    
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    this.axis.display();

    this.setDefaultAppearance();
    
    // ---- END Background, camera and axis setup

    // it is important that things depending on the proper loading of the graph
    // only get executed after the graph has loaded correctly.
    // This is one possible way to do it
    if (this.graph.loadedOk) {
	for (var i = 0; i < this.lights.length; i++) {
	    this.lights[i].update();
	}
	let root = this.graph.components[this.graph.root];
	this.displayComponent(root);
    };	
};

XMLscene.prototype.setupLights = function() {
    var i = 0;
    for (let light in this.graph.lights.omni) {
	var l = this.graph.lights.omni[light];
	this.lights[i].setPosition(l.position.x, l.position.y, l.position.z, l.position.w);
	this.lights[i].setAmbient(l.ambient.r, l.ambient.g, l.ambient.b, l.ambient.a);
	this.lights[i].setDiffuse(l.diffuse.r, l.diffuse.g, l.diffuse.b, l.diffuse.a);
	this.lights[i].setSpecular(l.specular.r, l.specular.g, l.specular.b, l.specular.a);
	if (l.enabled) {
	    this.lights[i].enable();
	}
	else {
	    this.lights[i].disable();
	}
	this.lights[i].setVisible(true);
	this.lights[i].update();
	i++;
    }
    for (let light in this.graph.lights.spot) {
	var l = this.graph.lights.spot[light];
	this.lights[i].setPosition(l.position.x, l.position.y, l.position.z, l.position.w);
	this.lights[i].setAmbient(l.ambient.r, l.ambient.g, l.ambient.g, l.ambient.a);
	this.lights[i].setDiffuse(l.diffuse.r, l.diffuse.g, l.diffuse.b, l.diffuse.a);
	this.lights[i].setSpecular(l.specular.r, l.specular.g, l.specular.b, l.specular.a);
	if (l.enabled) {
	    this.lights[i].enable();
	}
	else {
	    this.lights[i].disable();
	}
	this.lights[i].setSpotDirection(l.target.x, l.target.y, l.target.z);
	this.lights[i].setSpotExponent(l.exponent);
	this.lights[i].setVisible(true);
	this.lights[i].update();	
	i++;
    }
};

XMLscene.prototype.displayComponent = function(component) {
    component.transformation.push();
    for (let child of component.children) {
	for (let material of component.materials) {
	    material.apply();
	}
	//component.texture.texture.apply();
	if (child instanceof Component) {
	    this.displayComponent(child);
	}
	else {
	    //child.setTexCoords(component.texture.s, component.texture.t);
	    this.displayPrimitive(child);
	}
    }
    component.transformation.pop();
};

XMLscene.prototype.displayPrimitive = function(primitive) {
    primitive.display();
};
