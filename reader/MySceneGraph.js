
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
    this.ids = [];
    
    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseGlobalsExample(rootElement);

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
    this.scene = {
	root: getItem(_scene, 'root'),
	axisLength: getFloat(_scene, 'axis_length')
    };

    // parse other blocks here ?
    // ...
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

    var views = elems[0];

    elems = views.getElementsByTagName('perspective');
    if (elems == null) {
	return "perspective element is missing.";
    }

    this.perspectives = [];
    for (var i = 0; i < elems.length; i++) {
	var perspective = elems[0];
	
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

	var _id = getItem(perspective, 'id');
	if (contains(this.ids, _id)) {
	    return "invalid id on 'perspective' element";
	}
	else {
	    this.ids.push(_id);
	}
	
	this.perspectives.push({
	    id: _id,
	    near: getFloat(perspective, 'near'),
	    far: getFloat(perspective, 'far'),
	    angle: getFloat(perspective, 'angle'),
	    from: {
		x: getFloat(_from[0], 'x'),
		y: getFloat(_from[0], 'y'),
		z: getFloat(_from[0], 'z')
	    },
	    to: {
		x: getFloat(_to[0], 'x'),
		y: getFloat(_to[0], 'y'),
		z: getFloat(_to[0], 'z')
	    }
	});
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

    this.ilumination = {
	doublesided: getBoolean(_illumination, 'doublesided'),
	local: getBoolean(_illumination, 'local'),
	ambient: {
	    r: getFloat(_ambient[0], 'r'),
	    g: getFloat(_ambient[0], 'g'),
	    b: getFloat(_ambient[0], 'b'),
	    a: getFloat(_ambient[0], 'a')
	},
	background: {
	    r: getFloat(_background[0], 'r'),
	    g: getFloat(_background[0], 'g'),
	    b: getFloat(_background[0], 'b'),
	    a: getFloat(_background[0], 'a')
	}
    };
};

/*
 * Method that parses elements of the 'lights' block.
 */

// ...

/*
 * Method that parses elements of the 'transformations' block.
 */
MySceneGraph.prototype.parseTransformations = function(rootElement) {
    var elems = rootElement.getElementsByTagName('transformations');
    if (elems == null) {
	return "transformations element is missing.";
    }

    if (elems.length != 1) {
	return "either zero or more than one 'transformations' element found";
    }

    var _transformations = elems.getElementsByTagName('transformation');
    if (_transformations == null) {
	return "transformation element is missing.";
    }

    this.transformations = [];
    for (var i = 0; i < _transformations.length; i++) {
	var transformation = _transformations[i];

	var _id = getItem(transformation, 'id');
	if (contains(this.ids, id)) {
	    return "invalid id on 'transformation' element";
	}
	else {
	    this.ids.push(id);
	}

	this.transformations[i].push({
	    id: _id,
	    translations: [],
	    rotations: [],
	    scales: []
	});

	var _translations = transformation.getElementsByTagName('translate');
	var _rotations = transformation.getElementsByTagName('rotate');
	var _scales = transformation.getElementsByTagName('scale');

	if (_translations != null) {
	    for (var j = 0; j < _translations.length; j++) {
		var translate = _translations[j];

		this.transformations[j].translations.push({
		    x: getFloat(translate, 'x'),
		    y: getFloat(translate, 'y'),
		    z: getFloat(translate, 'z')
		});
	    }
	}

	if (_rotations != null) {
	    for (var j = 0; j < _rotations.length; j++) {
		var rotate = _rotations[j];

		this.transformations[j].rotations.push({
		    axis: getItem(rotate, 'axis', ['x', 'y', 'z']),
		    angle: getFloat(rotate, 'angle')
		});
	    }
	}

	if (_scales != null) {
	    for (var j = 0; j < _scales.length; j++) {
		var scale = _scales[j];

		this.transformations[j].scales.push({
		    x: getFloat(scale, 'x'),
		    y: getFloat(scale, 'y'),
		    z: getFloat(scale, 'z')
		)};
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

/*
 * Returns object with given id, or creates empty object.
 */
function getById(array, _id) {
    for (var i in array) {
	if (i.id == _id) {
	    return i;
	}
    }
    array.push({id: _id});
    return array.getById(_id);
}

// Encapsular listas e métodos correspondentes
// Ter referências para as classes na scene
