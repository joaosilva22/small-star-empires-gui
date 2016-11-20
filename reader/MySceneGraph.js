
function MySceneGraph(filename, scene) {
    this.loadedOk = null;
    
    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;
    
    // File reading 
    this.reader = new CGFXMLreader();
    
    /*
     * Read the contents of the xml file, and refer to this class for loading and error handlers.
     * After the file is read, the reader calls onXMLReady on this object.
     * If any error occurs, the reader calls onXMLError on this object, with an error message
     */
    this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
    console.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    // Store scene information
    this.root = null;
    this.axisLenght = null;
    this.illumination = new Illumination();
    this.views = new Views();
    this.lights = new Lights();
    this.textures = {};
    this.materials = {};
    this.transformations = {};
    this.animations = {};
    this.primitives = {};
    this.components = {};
    
    // Here should go the calls for different functions to parse the various blocks
    var error = this.verifyBlockOrder(rootElement);
    if (error != null) {
	this.onXMLError(error);
	return;
    }
    
    error = this.parseScene(rootElement);
    if (error != null) {
	this.onXMLError(error);
	return;
    }

    error = this.parseViews(rootElement);
    if (error != undefined) {
	this.onXMLError(error);
	return error;
    }

    error = this.parseIllumination(rootElement);
    if (error != undefined) {
	this.onXMLError(error);
	return error;
    }

    error = this.parseLights(rootElement);
    if (error != undefined) {
	this.onXMLError(error);
	return error;
    }

    error = this.parseTextures(rootElement);
    if (error != undefined) {
	this.onXMLError(error);
	return error;
    }

    error = this.parseMaterials(rootElement);
    if (error != undefined) {
	this.onXMLError(error);
	return error;
    }

    error = this.parseTransformations(rootElement);
    if (error != undefined) {
	this.onXMLError(error);
	return error;
    }

    error = this.parseAnimations(rootElement);
    if (error != undefined) {
	this.onXMLError(error);
	return error;
    }

    error = this.parsePrimitives(rootElement);
    if (error != undefined) {
	this.onXMLError(error);
	return error;
    }
    
    error = this.parseComponents(rootElement);
    if (error != undefined) {
	this.onXMLError(error);
	return error;
    }

    error = this.verifyComponentChildren(this.components[this.root]);
    if (error != undefined) {
	this.onXMLError(error);
	return error;
    }

    this.loadedOk=true;
    
    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
};

/*
 * Method that parses elements of the 'scene' block.
 */
MySceneGraph.prototype.parseScene = function(rootElement) {
    var elems = rootElement.getElementsByTagName('scene');
    if (elems == null) {
	return "scene element is missing.";
    }
    if (elems.length != 1) {
	return "either zero or more than one 'scene' element found.";
    }

    var _scene = elems[0];
    this.root = this.reader.getString(_scene, 'root', true);
    this.axisLenght = this.reader.getFloat(_scene, 'axis_length', true);
};

/*
 * Method that parses elements of the 'views' block.
 */
MySceneGraph.prototype.parseViews = function(rootElement) {
    var elems = rootElement.getElementsByTagName('views');
    if (elems == null) {
	return "views element is missing.";
    }

    if (elems.length != 1) {
	return "either zero or more than one 'views' element found.";
    }

    var _views = elems[0];
    var def = this.reader.getString(_views, 'default', true);

    elems = _views.getElementsByTagName('perspective');
    if (elems == null) {
	return "perspective element is missing.";
    }

    for (var i = 0; i < elems.length; i++) {
	var perspective = elems[i];
	
	var _from = perspective.getElementsByTagName('from');
	if (_from == null) {
	    return "from element is missing.";
	}

	if (_from.length != 1) {
	    return "either zero or more than one 'from' element found.";
	}
	
	var _to = perspective.getElementsByTagName('to');
	if (_to == null) {
	    return "to element is missing.";
	}

	if (_to.length != 1) {
	    return "either zero or more than one 'to' element found.";
	}

	var id = this.reader.getString(perspective, 'id', true);
	if (this.hasId(id, "views")) {
	    return "invalid id on 'perspective' element";
	}

	var near = this.reader.getFloat(perspective, 'near', true);
	var far = this.reader.getFloat(perspective, 'far', true);
	var angle = this.reader.getFloat(perspective, 'angle', true);

	var from = vec3.fromValues(this.reader.getFloat(_from[0], 'x', true),
				   this.reader.getFloat(_from[0], 'y', true),
				   this.reader.getFloat(_from[0], 'z', true));
	
	var to = vec3.fromValues(this.reader.getFloat(_to[0], 'x', true),
				 this.reader.getFloat(_to[0], 'y', true),
				 this.reader.getFloat(_to[0], 'z', true));

	this.views.addPerspective(id, near, far, angle, from, to);
    }

    if (this.views.perspectives[def]) {
	this.views.setDefault(def);
    } else {
	for (var p in this.views.perspectives) break;
	this.views.setDefault(p);
    }
};

/*
 * Method that parses elements of the 'illumination' block.
 */
MySceneGraph.prototype.parseIllumination = function(rootElement) {
    var elems = rootElement.getElementsByTagName('illumination');
    if (elems == null) {
	return "illumination element is missing.";
    }

    if (elems.length != 1) {
	return "either zero or more than one 'illumination' element found";
    }

    var _illumination = elems[0];

    var _ambient = _illumination.getElementsByTagName('ambient');
    if (_ambient == null) {
	return "ambient element is missing.";
    }

    if (_ambient.length != 1) {
	return "either zero or more than one 'ambient' element found.";
    }

    var _background = _illumination.getElementsByTagName('background');
    if (_background == null) {
	return "background element is missing.";
    }

    if (_background.length != 1) {
	return "either zero or more than one 'background' element found.";
    }

    var doublesided = this.reader.getBoolean(_illumination, 'doublesided');
    var local = this.reader.getBoolean(_illumination, 'local');

    var ambient = [this.reader.getFloat(_ambient[0], 'r', true),
		   this.reader.getFloat(_ambient[0], 'g', true),
		   this.reader.getFloat(_ambient[0], 'b', true),
		   this.reader.getFloat(_ambient[0], 'a', true)];

    var background = [this.reader.getFloat(_background[0], 'r', true),
		      this.reader.getFloat(_background[0], 'g', true),
		      this.reader.getFloat(_background[0], 'b', true),
		      this.reader.getFloat(_background[0], 'a', true)];

    this.illumination =	new Illumination(doublesided, local, ambient, background);
};

/*
 * Method that parses elements of the 'lights' block.
 */
MySceneGraph.prototype.parseLights = function(rootElement) {
    var elems = rootElement.getElementsByTagName('lights');
    if (elems == null) {
	return "lights element is missing.";
    }

    if (elems.length != 1) {
	return "eiter zero or more than one 'lights' element found";
    }
    var lights = elems[0];

    var omni = lights.getElementsByTagName('omni');
    var spot = lights.getElementsByTagName('spot');

    if (omni == null && spot == null) {
	return "at least one of 'omni' or 'spot' elements should be present.";
    }

    if (omni.length + spot.length > 8) {
	return "too many lights, should be at most eight.";
    }

    if (omni != null) {
	for (var i = 0; i < omni.length; i++) {
	    var current = omni[i];

	    var id = this.reader.getString(current, 'id', true);
	    if (this.hasId(id, "lights")) {
 		return "invalid id on 'omni' element";
	    }
	    
	    var enabled = this.reader.getBoolean(current, 'enabled', true);
	    this.lights.addOmni(id, enabled);

	    elems = current.getElementsByTagName('location');
	    if (elems == null) {
		return "location element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'location' elements found.";
	    }
	    var location = elems[0];

	    this.lights.setLocation(
		id,
		this.reader.getFloat(location, 'x', true),
		this.reader.getFloat(location, 'y', true),
		this.reader.getFloat(location, 'z', true),
		this.reader.getFloat(location, 'w', true));
	    
	    elems = current.getElementsByTagName('ambient');
	    if (elems == null) {
		return "ambient element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'ambient' elements found.";
	    }
	    var ambient = elems[0];

	    this.lights.setAmbient(
		id,
		this.reader.getFloat(ambient, 'r', true),
		this.reader.getFloat(ambient, 'g', true),
		this.reader.getFloat(ambient, 'b', true),
		this.reader.getFloat(ambient, 'a', true));
    
	    elems = current.getElementsByTagName('diffuse');
	    if (elems == null) {
		return "diffuse element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'diffuse' elements found.";
	    }
	    var diffuse = elems[0];

	    this.lights.setDiffuse(
		id,
		this.reader.getFloat(diffuse, 'r', true),
		this.reader.getFloat(diffuse, 'g', true),
		this.reader.getFloat(diffuse, 'b', true),
		this.reader.getFloat(diffuse, 'a', true));

	    elems = current.getElementsByTagName('specular');
	    if (elems == null) {
		return "specular element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'specular' elements found.";
	    }
	    var specular = elems[0];

	    this.lights.setSpecular(
		id,
		this.reader.getFloat(specular, 'r', true),
		this.reader.getFloat(specular, 'g', true),
		this.reader.getFloat(specular, 'b', true),
		this.reader.getFloat(specular, 'a', true));
	}
    }

    if (spot != null) {
	for (var i = 0; i < spot.length; i++) {
	    var current = spot[i];

	    var id = this.reader.getString(current, 'id', true);
	    if (this.hasId(id, "lights")) {
 		return "invalid id on 'spot' element";
	    }

	    var enabled = this.reader.getBoolean(current, 'enabled', true);
	    var angle = this.reader.getFloat(current, 'angle', true);
	    var exponent = this.reader.getFloat(current, 'exponent', true);
	    this.lights.addSpot(id, enabled, angle, exponent);

	    elems = current.getElementsByTagName('target');
	    if (elems == null) {
		return "target element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'target' elements found.";
	    }
	    var target = elems[0];

	    this.lights.setTarget(
		id,
		this.reader.getFloat(target, 'x', true),
		this.reader.getFloat(target, 'y', true),
		this.reader.getFloat(target, 'z', true),
		1); 

	    elems = current.getElementsByTagName('location');
	    if (elems == null) {
		return "location element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'location' elements found.";
	    }
	    var location = elems[0];

	    this.lights.setLocation(
		id,
		this.reader.getFloat(location, 'x', true),
		this.reader.getFloat(location, 'y', true),
		this.reader.getFloat(location, 'z', true),
		1);

	    elems = current.getElementsByTagName('ambient');
	    if (elems == null) {
		return "ambient element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'ambient' elements found.";
	    }
	    var ambient = elems[0];

	    this.lights.setAmbient(
		id,
		this.reader.getFloat(ambient, 'r', true),
		this.reader.getFloat(ambient, 'g', true),
		this.reader.getFloat(ambient, 'b', true),
		this.reader.getFloat(ambient, 'a', true));

	    elems = current.getElementsByTagName('diffuse');
	    if (elems == null) {
		return "diffuse element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'diffuse' elements found.";
	    }
	    var diffuse = elems[0];

	    this.lights.setDiffuse(
		id,
		this.reader.getFloat(diffuse, 'r', true),
		this.reader.getFloat(diffuse, 'g', true),
		this.reader.getFloat(diffuse, 'b', true),
		this.reader.getFloat(diffuse, 'a', true));

	    elems = current.getElementsByTagName('specular');
	    if (elems == null) {
		return "specular element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'specular' elements found.";
	    }
	    var specular = elems[0];

	    this.lights.setSpecular(
		id,
		this.reader.getFloat(specular, 'r', true),
		this.reader.getFloat(specular, 'g', true),
		this.reader.getFloat(specular, 'b', true),
		this.reader.getFloat(specular, 'a', true));
	}
    }	    
};

/*
 * Method that parses elements of the 'textures' block.
 */
MySceneGraph.prototype.parseTextures = function(rootElement) {
    var elems = rootElement.getElementsByTagName('textures');
    if (elems == null) {
	return "textures element is missing.";
    }
    if (elems.length != 1) {
	return "either zero or more than one 'textures' elements found.";
    }

    var textures = elems[0].getElementsByTagName('texture');
    if (textures == null) {
	return "texture element is missing.";
    }

    for (var i = 0; i < textures.length; i++) {
	var _texture = textures[i];

	var id = this.reader.getString(_texture, 'id', true);
	if (this.hasId(id, "textures")) {
 	    return "invalid id on 'texture' element.";
	}

	var file = this.reader.getString(_texture, 'file', true);
	var lengthS = this.reader.getFloat(_texture, 'length_s', true);
	var lengthT = this.reader.getFloat(_texture, 'length_t', true);

	var tex = new CGFtexture(this.scene, file);
	this.textures[id] = {s: lengthS, t: lengthT, texture: tex};
    }
};

/*
 * Method that parses elements of the 'materials' block.
 */
MySceneGraph.prototype.parseMaterials = function(rootElement) {
    var elems = rootElement.getElementsByTagName('materials');
    if (elems == null) {
	return "materials element is missing.";
    }
    var count = 0, index;
    for (var i = 0; i < elems.length; i++) {
	if (elems[i].parentNode == rootElement) {
	    index = i;
	    count++;
	}   
    }
    if (count != 1) {
	return "either zero or more than one 'materials' element found.";
    }

    var materials = elems[index].getElementsByTagName('material');
    if (materials == null) {
	return "material element is missing.";
    }

    for (var i = 0; i < materials.length; i++) {
	var current = materials[i];

	var id = this.reader.getString(current, 'id', true);
	if (this.hasId(id, "materials")) {
	    return "invalid id on 'material' element.";
	}

	var material = new CGFappearance(this.scene);

	elems = current.getElementsByTagName('emission');
	if (elems == null) {
	    return "emission element is missing.";
	}
	if (elems.length != 1) {
	    return "either zero or more than one 'emission' element found.";
	}
	var emission = elems[0];

	material.setEmission(this.reader.getFloat(emission, 'r', true),
			     this.reader.getFloat(emission, 'g', true),
			     this.reader.getFloat(emission, 'b', true),
			     this.reader.getFloat(emission, 'a', true));

	elems = current.getElementsByTagName('ambient');
	if (elems == null) {
	    return "ambient element is missing.";
	}
	if (elems.length != 1) {
	    return "either zero or more than one 'ambient' element found.";
	}
	var ambient = elems[0];

	material.setAmbient(this.reader.getFloat(ambient, 'r', true),
			    this.reader.getFloat(ambient, 'g', true),
			    this.reader.getFloat(ambient, 'b', true),
			    this.reader.getFloat(ambient, 'a', true));

	elems = current.getElementsByTagName('diffuse');
	if (elems == null) {
	    return "diffuse element is missing.";
	}
	if (elems.length != 1) {
	    return "either zero or more than one 'diffuse' element found.";
	}
	var diffuse = elems[0];

	material.setDiffuse(this.reader.getFloat(diffuse, 'r', true),
			    this.reader.getFloat(diffuse, 'g', true),
			    this.reader.getFloat(diffuse, 'b', true),
			    this.reader.getFloat(diffuse, 'a', true));

	elems = current.getElementsByTagName('specular');
	if (elems == null) {
	    return "specular element is missing.";
	}
	if (elems.length != 1) {
	    return "either zero or more than one 'specular' element found.";
	}
	var specular = elems[0];
	
	material.setSpecular(this.reader.getFloat(specular, 'r', true),
			     this.reader.getFloat(specular, 'g', true),
			     this.reader.getFloat(specular, 'b', true),
			     this.reader.getFloat(specular, 'a', true));

	elems = current.getElementsByTagName('shininess');
	if (elems == null) {
	    return "shininess element is missing.";
	}
	if (elems.length != 1) {
	    return "either zero or more than one 'shininess' element found.";
	}
	var shininess = elems[0];

	material.setShininess(this.reader.getFloat(shininess, 'value', true));

	this.materials[id] = material;
    }
};

/*
 * Method that parses elements of the 'transformations' block.
 */
MySceneGraph.prototype.parseTransformations = function(rootElement) {
    var elems = rootElement.getElementsByTagName('transformations');
    if (elems == null) {
	return "transformations element is missing.";
    }

    if (elems.length != 1) {
	return "either zero or more than one 'transformations' element found.";
    }

    var _transformations = elems[0].getElementsByTagName('transformation');
    if (_transformations == null) {
	return "transformation element is missing.";
    }

    for (var i = 0; i < _transformations.length; i++) {
	var id = this.reader.getString(_transformations[i], 'id', true);
	if (this.hasId(id, "transformations")) {
	    return "invalid id on 'transformation' element.";
	}
	
	this.transformations[id] = new Transformation(this.scene);
	
	var children = _transformations[i].children;
	for (var j = 0; j < children.length; j++) {
	    var transformation = children[j];
	    var type = transformation.nodeName;

	    if (type == "translate") {
		var x = this.reader.getFloat(children[j], 'x', true);
		var y = this.reader.getFloat(transformation, 'y', true);
		var z = this.reader.getFloat(transformation, 'z', true);

		this.transformations[id].translate(x, y, z);
	    }

	    if (type == "rotate") {
		var axis = this.reader.getItem(transformation, 'axis', ["x", "y", "z"], true);
		var angle = this.reader.getFloat(transformation, 'angle', true);

		this.transformations[id].rotate(axis, angle);
	    }

	    if (type == "scale") {
		var x = this.reader.getFloat(transformation, 'x', true);
		var y = this.reader.getFloat(transformation, 'y', true);
		var z = this.reader.getFloat(transformation, 'z', true);

		this.transformations[id].scale(x, y, z);
	    }	
	}
    }
};

/*
 * Method that parses elements of the 'animations' block.
 */
MySceneGraph.prototype.parseAnimations = function(rootElement) {
    var elems = rootElement.getElementsByTagName('animations');
    if (elems == null) {
	return "animations element is missing.";
    }
    if (elems.length != 1) {
	return "either zero or more than one 'animations' element found.";
    }

    var animations = elems[0].getElementsByTagName('animation');
    
    for (let animation of animations) {
	var id = this.reader.getString(animation, 'id', true);
	if (this.hasId(id, "animations")) {
	    return "invalid id on 'animation' element.";
	}

	var span = this.reader.getFloat(animation, 'span', true);
	var type = this.reader.getString(animation, 'type', true);

	if (type != "linear" && type != "circular") {
	    return (type + "is not a valid animation type.");
	}

	var anim = null;
	
	if (type == "linear") {
	    anim = new LinearAnimation(id, span);
	    
	    var controlPoints = animation.getElementsByTagName('controlpoint');
	    
	    for (let point of controlPoints) {
		var controlPoint = [this.reader.getFloat(point, 'xx', true),
				    this.reader.getFloat(point, 'yy', true),
				    this.reader.getFloat(point, 'zz', true)];

		anim.addControlPoint(controlPoint);
	    }
	}

	if (type == "circular") {
	    var center = [this.reader.getFloat(animation, 'centerx', true),
			  this.reader.getFloat(animation, 'centery', true),
			  this.reader.getFloat(animation, 'centerz', true)];

	    var radius = this.reader.getFloat(animation, 'radius', true);
	    var startang = this.reader.getFloat(animation, 'startang', true);
	    var rotang = this.reader.getFloat(animation, 'rotang', true);

	    anim = new CircularAnimation(id, span, center, radius, startang, rotang);
	}

	this.animations[id] = anim;
    }

};

/*
 * Method that parses elements of the 'primitives' block.
 */
MySceneGraph.prototype.parsePrimitives = function(rootElement) {
    var elems = rootElement.getElementsByTagName('primitives');
    if (elems == null) {
	return "primitives element is missing.";
    }

    if (elems.length != 1) {
	return "either zero or more than one 'primitives' element found.";
    }

    var primitives = elems[0].getElementsByTagName('primitive');
    if (primitives == null) {
	return "primitive element is missing.";
    }

    for (var i = 0; i < primitives.length; i++) {
	if (primitives[i].children.length != 1) {
	    return "either zero or more than one primitive type found.";
	}

	var id = this.reader.getString(primitives[i], 'id', true);
	if (this.hasId(id, "primitives")) {
	    return "invalid id on 'primitive' element.";
	}

	var primitive = primitives[i].children[0];
	var type = primitive.nodeName;
	
	if (type == "rectangle") {
	    var x1 = this.reader.getFloat(primitive, 'x1', true);
	    var y1 = this.reader.getFloat(primitive, 'y1', true);
	    var x2 = this.reader.getFloat(primitive, 'x2', true);
	    var y2 = this.reader.getFloat(primitive, 'y2', true);

	    this.primitives[id] = new Rectangle(this.scene, x1, y1, x2, y2);
	}

	if (type == "triangle") {
	    var x1 = this.reader.getFloat(primitive, 'x1', true);
	    var y1 = this.reader.getFloat(primitive, 'y1', true);
	    var z1 = this.reader.getFloat(primitive, 'z1', true);

	    var x2 = this.reader.getFloat(primitive, 'x2', true);
	    var y2 = this.reader.getFloat(primitive, 'y2', true);
	    var z2 = this.reader.getFloat(primitive, 'z2', true);

	    var x3 = this.reader.getFloat(primitive, 'x3', true);
	    var y3 = this.reader.getFloat(primitive, 'y3', true);
	    var z3 = this.reader.getFloat(primitive, 'z3', true);

	    this.primitives[id] = new Triangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
	}

	if (type == "cylinder") {
	    var base = this.reader.getFloat(primitive, 'base', true);
	    var top = this.reader.getFloat(primitive, 'top', true);
	    var height = this.reader.getFloat(primitive, 'height', true);
	    var slices = this.reader.getInteger(primitive, 'slices', true);
	    var stacks = this.reader.getInteger(primitive, 'stacks', true);

	    this.primitives[id] = new Cylinder(this.scene, base, top, height, slices, stacks);
	}

	if (type == "sphere") {
	    var radius = this.reader.getFloat(primitive, 'radius', true);
	    var slices = this.reader.getInteger(primitive, 'slices', true);
	    var stacks = this.reader.getInteger(primitive, 'stacks', true);

	    this.primitives[id] = new Sphere(this.scene, radius, slices, stacks);
	}

	if (type == "torus") {
	    var inner = this.reader.getFloat(primitive, 'inner', true);
	    var outer = this.reader.getFloat(primitive, 'outer', true);
	    var slices = this.reader.getInteger(primitive, 'slices', true);
	    var loops = this.reader.getInteger(primitive, 'loops', true);

	    this.primitives[id] = new Torus(this.scene, inner, outer, slices, loops);
	}

	if (type == "plane") {
	    var dimX = this.reader.getFloat(primitive, 'dimX', true);
	    var dimY = this.reader.getFloat(primitive, 'dimY', true);
	    var partsX = this.reader.getInteger(primitive, 'partsX', true);
	    var partsY = this.reader.getInteger(primitive, 'partsY', true);

	    this.primitives[id] = new Plane(this.scene, dimX, dimY, partsX, partsY);
	}

	if (type == "patch") {
	    var orderU = this.reader.getInteger(primitive, 'orderU', true);
	    var orderV = this.reader.getInteger(primitive, 'orderV', true);
	    var partsU = this.reader.getInteger(primitive, 'partsU', true);
	    var partsV = this.reader.getInteger(primitive, 'partsV', true);

	    var controlpoints = primitive.getElementsByTagName('controlpoint');

	    var controlvertexes = [];
	    for (var u = 0; u <= orderU; u++) {
		controlvertexes.push([]);
		for (var v = 0; v <= orderV; v++) {
		    var index = (u * (orderV+1)) + v;

		    var vertex = [this.reader.getFloat(controlpoints[index], 'x', true),
				  this.reader.getFloat(controlpoints[index], 'y', true),
				  this.reader.getFloat(controlpoints[index], 'z', true),
				  1];

		    controlvertexes[u].push(vertex);
		}
	    }

	    this.primitives[id] = new Patch(this.scene, controlvertexes, partsU, partsV);
	}
	
    }	
};

/*
 * Method that parses elements of the 'components' block.
 */
MySceneGraph.prototype.parseComponents = function(rootElement) {
    var elems = rootElement.getElementsByTagName('components');
    if (elems == null) {
	return "components element is missing.";
    }
    if (elems.length != 1) {
	return "either zero or more than one 'components' element found.";
    }

    var components = elems[0].getElementsByTagName('component');
    for (let component of components) {
	var id = this.reader.getString(component, 'id', true);
	if (this.hasId(id, "components")) {
	    return "invalid id on 'component' element.";
	}

	this.components[id] = new Component();

	var elems = component.getElementsByTagName('transformation');
	if (elems == null) {
	    return "transformation block is missing.";
	}
	if (elems.length != 1) {
	    return "either zero or more than one 'transformation' element found.";
	}
	
	var transformations = elems[0].children;
	if (transformations.lenght != 0) {
	    
	    var hasRef = false;
	    for (let transformation of transformations) {
		if (transformation.nodeName == "transformationref") {
		    hasRef = true;
		    break;
		}
	    }

	    if (hasRef && transformations.length > 1) {
		return "invalid transformations."
	    }

	    if (hasRef) {
		var refid = this.reader.getString(transformations[0], 'id', true);
		if (this.transformations[refid] == null) {
		    return "transformation '" + refid + "' does not exist.";
		}
		
		this.components[id].setTransformation(this.transformations[refid]);
	    }
	    else {
		var explicit = new Transformation(this.scene);
		for (let transformation of transformations) {
		    if (transformation.nodeName == "translate") {
			var x = this.reader.getFloat(transformation, 'x', true);
			var y = this.reader.getFloat(transformation, 'y', true);
			var z = this.reader.getFloat(transformation, 'z', true);

			explicit.translate(x, y, z);
		    }

		    if (transformation.nodeName == "rotate") {
			var axis = this.reader.getItem(transformation, 'axis', ["x", "y", "z"], true);
			var angle = this.reader.getFloat(transformation, 'angle', true);

			explicit.rotate(axis, angle);
		    }

		    if (transformation.nodeName == "scale") {
			var x = this.reader.getFloat(transformation, 'x', true);
			var y = this.reader.getFloat(transformation, 'y', true);
			var z = this.reader.getFloat(transformation, 'z', true);

			explicit.scale(x, y, z);
		    }
		}
		this.components[id].setTransformation(explicit);
	    }
	}

	var elems = component.getElementsByTagName('animation');
	if (elems.length > 1) {
	    return "more than one 'animation' element found.";
	}

	if (elems.length == 1) {
	    // TODO: verificar se existe pelo menos uma animationref
	    var animations = elems[0].children;
	    if (animations.length < 1) {
		return "at least one animationref should be present.";
	    }
	    
	    for (let animation of animations) {
		var refid = this.reader.getString(animation, 'id', true);
		this.components[id].addAnimation(this.animations[refid]);
	    }
	}
	

	var elems = component.getElementsByTagName('materials');
	if (elems == null) {
	    return "materials block is missing.";
	}
	var count = 0, index;
	for (var i = 0; i < elems.length; i++) {
	    if (elems[i].parentNode == component) {
		index = i;
		count++;
	    }   
	}
	if (count != 1) {
	    return "either zero or more than one 'materials' element found.";
	}

	var materials = elems[index].getElementsByTagName('material');
	if (materials.length < 1) {
	    return "at least one material should be present";
	}

	for (let material of materials) {
	    var refid = this.reader.getString(material, 'id', true);
	    if (refid == "inherit") {
		this.components[id].addMaterial(refid);
	    }
	    else {
		if (this.materials[refid] == null) {
		    return "material '" + refid + "' does not exist.";
		}
		this.components[id].addMaterial(this.materials[refid]);
	    }
	}

	var elems = component.getElementsByTagName('texture');
	if (elems == null) {
	    return "texture block is missing.";
	}
	var count = 0, index;
	for (var i = 0; i < elems.length; i++) {
	    if (elems[i].parentNode == component) {
		index = i;
		count++;
	    }   
	}
	if (count != 1) {
	    return "either zero or more than one 'texture' element found.";
	}

	var texture = elems[index];
	var refid = this.reader.getString(texture, 'id', true);
	if (refid == "inherit" || refid == "none") {
	    this.components[id].setTexture(refid);
	} else {
	    if (this.textures[refid] == null) {
		return "texture '" + refid + "' does not exist.";
	    }
	    this.components[id].setTexture(this.textures[refid]);
	}

	var elems = component.getElementsByTagName('children');
	if (elems == null) {
	    return "children block is missing.";
	}
	if (elems.length != 1) {
	    return "either zero or more than one 'children' element found.";
	}
	var children = elems[0].children;

	for (let child of children) {
	    if (child.nodeName == "componentref") {
		var refid = this.reader.getString(child, 'id', true);
		if (refid == id) {
		    return "component can't be a child of itself";
		}
		this.components[id].addChildren({type: "component", id: refid});
	    }
	    if (child.nodeName == "primitiveref") {
		var refid = this.reader.getString(child, 'id', true);
		this.components[id].addChildren({type: "primitive", id: refid});
	    }
	}
    }	
};

/*
 * Callback to be executed on any read error.
 */ 
MySceneGraph.prototype.onXMLError=function (message) {
    console.error("XML Loading Error: "+message);	
    this.loadedOk=false;
};

/*
 * Checks whether or not id has been used already.
 */ 
MySceneGraph.prototype.hasId = function(id, type) {
    switch (type) {
	case "views":
	    if (this.views.perspectives[id]) return true;
	    break;
	case "lights":
	    if (this.lights.spot[id] || this.lights.omni[id]) return true;
	    break;
	case "textures":
	    if (this.textures[id]) return true;
	    break;
	case "materials":
	    if (this.materials[id]) return true;
	    break;
	case "transformations":
	    if (this.transformations[id]) return true;
	    break;
	case "animations":
	    if (this.animations[id]) return true;
	    break;
	case "primitives":
	    if (this.primitives[id]) return true;
	    break;
	case "components":
	    if (this.components[id]) return true;
	    break;
    }
    return false;
};

/*
 * Verifies block order.
 */
MySceneGraph.prototype.verifyBlockOrder = function(root) {
    var order = ["scene", "views", "illumination", "lights", "textures", "materials",
		 "transformations", "animations", "primitives", "components"];

    if (root.children.length != order.length) {
	return "wrong number of blocks.";
    }
    
    for (var i = 0; i < root.children.length; i++) {
	if (root.children[i].nodeName != order[i]) {
	    console.warn("Warning: incorrect block order. Should be: " +
			 "scene, views, illumination, lights, " + 
                         "textures, materials, transformations, animations, " +
                         "primitives, components.");
	    return;
	}
    }
};

/*
 * Verifies if component/primitive loaded ok.
 */
MySceneGraph.prototype.verifyComponentChildren = function(component) {
    var children = component.children;
    for (let child of children) {
	if (child.type == "component") {
	    if (!this.components[child.id]) {
		return "component '" + child.id + "' does not exist";
	    }
	    this.verifyComponentChildren(this.components[child.id]);
	}
	else {
	    if (!this.primitives[child.id]) {
		return "primitive '" + child.id + "' does not exist";
	    }
	}
    }
};
