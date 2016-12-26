function Interface() {
    CGFinterface.call(this);
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();
    this.omni = this.gui.addFolder("Omni ligths");
    this.spot = this.gui.addFolder("Spot lights");
    
    return true;
};

Interface.prototype.processKeyboard = function(event) {
    CGFinterface.prototype.processKeyboard.call(this, event);
    var code = event.which || event.keyCode;
	this.scene.stateManager.handleInput(code);
    switch (code) {
	case (86):
	case (118):
	    this.scene.camera = this.scene.graph.views.getNext(this.scene.camera);
	    this.setActiveCamera(this.scene.camera);
	    break;
	case (77):
	case (109):
	    this.scene.nextMaterials();
	    break;
    };
};

