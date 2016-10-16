function Interface() {
    CGFinterface.call(this);
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);
    return true;
};

Interface.prototype.processKeyboard = function(event) {
    CGFinterface.prototype.processKeyboard.call(this, event);
    var code = event.which || event.keyCode;
    switch (code) {
	case (86):
	case (118):
	    this.scene.camera = this.scene.graph.views.getNext(this.scene.camera);
	    this.setActiveCamera(this.scene.camera);
	    break;
    };
};

