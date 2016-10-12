
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
    this.sceneInfo = new SceneInfo();
    
    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseScene(rootElement);
    //console.log(this.sceneInfo.toString());

    if (error != null) {
	this.onXMLError(error);
	return;
    }	

    this.loadedOk=true;
    
    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
};

/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {    
    var elems =  rootElement.getElementsByTagName('globals');
    if (elems == null) {
	return "globals element is missing.";
    }

    if (elems.length != 1) {
	return "either zero or more than one 'globals' element found.";
    }

    // various examples of different types of access
    var globals = elems[0];
    this.background = this.reader.getRGBA(globals, 'background');
    this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
    this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
    this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

    console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

    var tempList=rootElement.getElementsByTagName('list');

    if (tempList == null  || tempList.length==0) {
	return "list element is missing.";
    }
    
    this.list=[];
    // iterate over every element
    var nnodes=tempList[0].children.length;
    for (var i=0; i< nnodes; i++)
	{
	    var e=tempList[0].children[i];

	    // process each element and store its information
	    this.list[e.id]=e.attributes.getNamedItem("coords").value;
	    console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

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
    // Should be getById probably
    this.sceneInfo.root = this.reader.getString(_scene, 'root', true);
    this.sceneInfo.axisLenght = this.reader.getFloat(_scene, 'axis_length', true);

    // parse other blocks here ?
    // ...
    var error = this.parseViews(rootElement);
    if (error != undefined) {
	return error;
    }

    error = this.parseIllumination(rootElement);
    if (error != undefined) {
	return error;
    }

    error = this.parseLights(rootElement);
    if (error != undefined) {
	return error;
    }

    error = this.parseTextures(rootElement);
    if (error != undefined) {
	return error;
    }

    error = this.parseMaterials(rootElement);
    if (error != undefined) {
	return error;
    }

    error = this.parseTransformations(rootElement);
    if (error != undefined) {
	return error;
    }

    error = this.parseComponents(rootElement);
    if (error != undefined) {
	return error;
    }
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
	if (this.sceneInfo.hasId(id)) {
	    return "invalid id on 'perspective' element";
	}
	this.sceneInfo.ids.push(id);

	var near = this.reader.getFloat(perspective, 'near', true);
	var far = this.reader.getFloat(perspective, 'far', true);
	var angle = this.reader.getFloat(perspective, 'angle', true);

	var from = [this.reader.getFloat(_from[0], 'x', true),
		    this.reader.getFloat(_from[0], 'y', true),
		    this.reader.getFloat(_from[0], 'z', true)];
	
	var to = [this.reader.getFloat(_to[0], 'x', true),
		  this.reader.getFloat(_to[0], 'y', true),
		  this.reader.getFloat(_to[0], 'z', true)];

	this.sceneInfo.views.addPerspective(id, near, far, angle, from, to);
    }

    this.sceneInfo.views.setDefault(def);
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

    var ambient = new RGBA(this.reader.getFloat(_ambient[0], 'r', true),
			   this.reader.getFloat(_ambient[0], 'g', true),
			   this.reader.getFloat(_ambient[0], 'b', true),
			   this.reader.getFloat(_ambient[0], 'a', true));

    var background = new RGBA(this.reader.getFloat(_background[0], 'r', true),
			      this.reader.getFloat(_background[0], 'g', true),
			      this.reader.getFloat(_background[0], 'b', true),
			      this.reader.getFloat(_background[0], 'a', true));

    this.sceneInfo.illumination =
	new Illumination(doublesided, local, ambient, background);
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

    if (omni != null) {
	for (var i = 0; i < omni.length; i++) {
	    var current = omni[i];

	    var id = this.reader.getString(current, 'id', true);
	    if (this.sceneInfo.hasId(id)) {
 		return "invalid id on 'omni' element";
	    }
	    this.sceneInfo.ids.push(id);
	    var enabled = this.reader.getBoolean(current, 'enabled', true);
	    this.sceneInfo.lights.addOmni(id, this.scene, enabled);

	    elems = current.getElementsByTagName('location');
	    if (elems == null) {
		return "location element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'location' elements found.";
	    }
	    var location = elems[0];

	    this.sceneInfo.lights.setLocation(
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

	    this.sceneInfo.lights.setAmbient(
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

	    this.sceneInfo.lights.setDiffuse(
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

	    this.sceneInfo.lights.setSpecular(
		id,
		this.reader.getFloat(specular, 'r', true),
		this.reader.getFloat(specular, 'g', true),
		this.reader.getFloat(specular, 'b', true),
		this.reader.getFloat(specular, 'a', true));
	}
    }

    if (spot != null) {
	for (var i = 0; i < spot.length; i++) {
	    var current = spot[0];

	    var id = this.reader.getString(current, 'id', true);
	    if (this.sceneInfo.hasId(id)) {
 		return "invalid id on 'omni' element";
	    }
	    this.sceneInfo.ids.push(id);
	    var enabled = this.reader.getBoolean(current, 'enabled', true);
	    var angle = this.reader.getFloat(current, 'angle', true);
	    var exponent = this.reader.getFloat(current, 'exponent', true);
	    this.sceneInfo.lights.addSpot(id, this.scene, enabled, angle, exponent);

	    elems = current.getElementsByTagName('target');
	    if (elems == null) {
		return "target element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'target' elements found.";
	    }
	    var target = elems[0];

	    this.sceneInfo.lights.setTarget(
		id,
		this.reader.getFloat(target, 'x', true),
		this.reader.getFloat(target, 'y', true),
		this.reader.getFloat(target, 'z', true)); 

	    elems = current.getElementsByTagName('location');
	    if (elems == null) {
		return "location element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'location' elements found.";
	    }
	    var location = elems[0];

	    this.sceneInfo.lights.setLocation(
		id,
		this.reader.getFloat(location, 'x', true),
		this.reader.getFloat(location, 'y', true),
		this.reader.getFloat(location, 'z', true),
		0);

	    elems = current.getElementsByTagName('ambient');
	    if (elems == null) {
		return "ambient element is missing.";
	    }
	    if (elems.length != 1) {
		return "either zero or more than one 'ambient' elements found.";
	    }
	    var ambient = elems[0];

	    this.sceneInfo.lights.setAmbient(
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

	    this.sceneInfo.lights.setDiffuse(
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

	    this.sceneInfo.lights.setAmbient(
		id,
		this.reader.getFloat(ambient, 'r', true),
		this.reader.getFloat(ambient, 'g', true),
		this.reader.getFloat(ambient, 'b', true),
		this.reader.getFloat(ambient, 'a', true));
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
	if (this.sceneInfo.hasId(id)) {
 	    return "invalid id on 'texture' element.";
	}
	this.sceneInfo.ids.push(id);
	var file = this.reader.getString(_texture, 'file', true);
	var lengthS = this.reader.getFloat(_texture, 'length_s', true);
	var lengthT = this.reader.getFloat(_texture, 'length_t', true);

	var tex = new CGFappearance(this.scene);
	tex.loadTexture(file);

	this.sceneInfo.textures[id] = {s: lengthS, t: lengthT, texture: tex};
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
	if (this.sceneInfo.hasId(id)) {
	    return "invalid id on 'material' element.";
	}
	this.sceneInfo.ids.push(id);

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

	this.sceneInfo.materials[id] = material;
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
	if (this.sceneInfo.hasId(id)) {
	    return "invalid id on 'transformation' element.";
	}
	this.sceneInfo.ids.push(id);
	this.sceneInfo.transformations[id] = new Transformation(this.scene);
	
	var children = _transformations[i].children;
	for (var j = 0; j < children.length; j++) {
	    var transformation = children[j];
	    var type = transformation.nodeName;

	    if (type == "translate") {
		var x = this.reader.getFloat(children[j], 'x', true);
		var y = this.reader.getFloat(transformation, 'y', true);
		var z = this.reader.getFloat(transformation, 'z', true);

		this.sceneInfo.transformations[id].translate(x, y, z);
	    }

	    if (type == "rotate") {
		var axis = this.reader.getItem(transformation, 'axis', ["x", "y", "z"], true);
		var angle = this.reader.getFloat(transformation, 'angle', true);

		this.sceneInfo.transformations[id].rotate(axis, angle);
	    }

	    if (type == "scale") {
		var x = this.reader.getFloat(transformation, 'x', true);
		var y = this.reader.getFloat(transformation, 'y', true);
		var z = this.reader.getFloat(transformation, 'z', true);

		this.sceneInfo.transformations[id].scale(x, y, z);
	    }	
	}
    }
};

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
	if (this.sceneInfo.hasId(id)) {
	    return "invalid id on 'transformation' element.";
	}
	this.sceneInfo.push(id);

	var primitive = primitives[i].children[0];
	var type = primitive.nodeName;

	if (type = "rectangle") {
	    var x1 = this.reader.getFloat(primitive, 'x1', true);
	    var y1 = this.reader.getFloat(primitive, 'y1', true);
	    var x2 = this.reader.getFloat(primitive, 'x2', true);
	    var y2 = this.reader.getFloat(primitive, 'y2', true);

	    this.sceneInfo.primitives[id] = new Rectangle(this.scene, x1, y1, x2, y2);
	}

	if (type = "triangle") {
	    var x1 = this.reader.getFloat(primitive, 'x1', true);
	    var y1 = this.reader.getFloat(primitive, 'y1', true);
	    var z1 = this.reader.getFloat(primitive, 'z1', true);

	    var x2 = this.reader.getFloat(primitive, 'x2', true);
	    var y2 = this.reader.getFloat(primitive, 'y2', true);
	    var z2 = this.reader.getFloat(primitive, 'z2', true);

	    var x3 = this.reader.getFloat(primitive, 'x3', true);
	    var y3 = this.reader.getFloat(primitive, 'y3', true);
	    var z3 = this.reader.getFloat(primitive, 'z3', true);

	    this.sceneInfo.primitives[id] =
		new Triangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
	}

	if (type = "cylinder") {
	    var base = this.reader.getFloat(primitive, 'base', true);
	    var top = this.reader.getFloat(primitive, 'top', true);
	    var height = this.reader.getFloat(primitive, 'height', true);
	    var slices = this.reader.getFloat(primitive, 'slices', true);
	    var stacks = this.reader.getFloat(primitive, 'stacks', true);

	    this.sceneInfo.primitives[id] =
		new Cylinder(this.scene, base, top, height, slices, stacks);
	}

	if (type = "sphere") {
	    var radius = this.reader.getFloat(primitive, 'radius', true);
	    var slices = this.reader.getFloat(primitive, 'slices', true);
	    var stacks = this.reader.getFloat(primitive, 'stacks', true);

	    this.sceneInfo.primitives[id] =
		new Sphere(this.scene, radius, slices, stacks);
	}

	if (type = "torus") {
	    var inner = this.reader.getFloat(primitive, 'inner', true);
	    var outer = this.reader.getFloat(primitive, 'outer', true);
	    var slices = this.reader.getFloat(primitive, 'slices', true);
	    var loops = this.reader.getFloat(primitive, 'loops', true);

	    this.sceneInfo.primitives[id] =
		new Torus(this.scene, inner, outer, slices, loops);
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
	if (this.sceneInfo.hasId(id)) {
	    return "invalid id on 'component' element.";
	}
	this.sceneInfo.ids.push(id);

	this.sceneInfo.components[id] = new Component();

	// TRANSFORMACOES
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
		if (this.sceneInfo.transformations[refid] == null) {
		    return "transformation '" + refid + "' does not exist.";
		}
		
		this.sceneInfo.components[id].setTransformation(this.sceneInfo.transformations[refid]);
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
		this.sceneInfo.components[id].setTransformation(explicit);
	    }
	}

	// MATERIAIS
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
		this.sceneInfo.components[id].addMaterial(refid);
		break;
	    }

	    if (this.sceneInfo.materials[refid] == null) {
		return "material '" + refid + "' does not exist.";
	    }
	    this.sceneInfo.components[id].addMaterial(this.sceneInfo.materials[refid]);
	}

	// TEXTURE
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
	    this.sceneInfo.components[id].setTexture(refid);
	    break;
	}

	if (this.sceneInfo.textures[refid] == null) {
	    return "texture '" + refid + "' does not exist.";
	}
	this.sceneInfo.components[id].setTexture(this.sceneInfo.textures[refid]);

	console.log(this.sceneInfo.components[id].toString());
    }	
};

/*
 * Callback to be executed on any read error.
 */ 
MySceneGraph.prototype.onXMLError=function (message) {
    console.error("XML Loading Error: "+message);	
    this.loadedOk=false;
};

// TODO:
// Encapsular listas e métodos correspondentes
// Ter referências para as classes na scene
// Verificar se todos os objectos foram loaded corretamente
// Implementar toString em todas as 'classes'
// Classe scene para guardar lista de ids + todas as outras classes
// SceneInfo.geteById implementar
// Stringify todas as classes
