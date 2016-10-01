
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
    var error = this.parseViews(rootElement);
    console.log(this.views.toString());

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

    var _views = elems[0];
    var def = this.reader.getString(_views, 'default', true);

    console.log("I am here my friend");
    this.views = new Views();

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
	if (contains(this.ids, id)) {
	    return "invalid id on 'perspective' element";
	}
	else {
	    this.ids.push(id);
	}

	var near = this.reader.getFloat(perspective, 'near', true);
	var far = this.reader.getFloat(perspective, 'far', true);
	var angle = this.reader.getFloat(perspective, 'angle', true);

	var from = new Vector3(this.reader.getFloat(_from[0], 'x', true),
			       this.reader.getFloat(_from[0], 'y', true),
			       this.reader.getFloat(_from[0], 'z', true));
	
	var to = new Vector3(this.reader.getFloat(_to[0], 'x', true),
			     this.reader.getFloat(_to[0], 'y', true),
			     this.reader.getFloat(_to[0], 'z', true));

	this.views.addPerspective(new Perspective(id, near, far, angle, from, to));
    }

    this.views.setDefault(def);
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

    var doublesided = getBoolean(_illumination, 'doublesided');
    var local = getBoolean(_illumination, 'local');

    var ambient = new RGBA(getFloat(_ambient[0], 'r', true),
			   getFloat(_ambient[0], 'g', true),
			   getFloat(_ambient[0], 'b', true),
			   getFloat(_ambient[0], 'a', true));

    var background = new RGBA(getFloat(_background[0], 'r', true),
			      getFloat(_background[0], 'g', true),
			      getFloat(_background[0], 'b', true),
			      getFloat(_background[0], 'a', true));

    this.illumination = new Illumination(doublesided, local, ambient, background);
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

    this.transformations = new Transformations();
    for (var i = 0; i < _transformations.length; i++) {
	var _transformation = _transformations[i];

	var _id = getItem(_transformation, 'id');
	if (contains(this.ids, _id)) {
	    return "invalid id on 'transformation' element";
	}
	else {
	    this.ids.push(_id);
	}

	var transformation = new Transformation(_id);

	var _translations = _transformation.getElementsByTagName('translate');
	var _rotations = _transformation.getElementsByTagName('rotate');
	var _scales = _transformation.getElementsByTagName('scale');

	if (_translations != null) {
	    for (var j = 0; j < _translations.length; j++) {
		var translation = _translations[j];
		var vector = new Vector3(getFloat(translation, 'x', true),
					 getFloat(translation, 'y', true),
					 getFloat(translation, 'z', true));
		
		transformation.addTranslation(vector);
	    }
	}

	if (_rotations != null) {
	    for (var j = 0; j < _rotations.length; j++) {
		var rotation = _rotations[j];
		var axis = getItem(rotation, 'axis', ['x', 'y', 'z'], true);
		var angle = getFloat(rotation, 'angle', true);
		
		transformation.addRotation(new Rotation(axis, angle));
	    }
	}

	if (_scales != null) {
	    for (var j = 0; j < _scales.length; j++) {
		var scale = _scales[j];
		var vector = new Vector3(getFloat(scale, 'x', true),
					 getFloat(scale, 'y', true),
					 getFloat(scale, 'z', true));

		transformation.addScale(vector);
	    }
	}

	this.transformations.addTransformation(transformation);
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
