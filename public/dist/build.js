(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _vrviewer = require('./vrviewer');

var _vrviewer2 = _interopRequireDefault(_vrviewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _VRViewer$start = _vrviewer2.default.start();

var scene = _VRViewer$start.scene;
var camera = _VRViewer$start.camera;
var controller1 = _VRViewer$start.controller1;
var controller2 = _VRViewer$start.controller2;


scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial()));

},{"./vrviewer":6}],2:[function(require,module,exports){
'use strict';

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.OBJLoader = function (manager) {

        this.manager = manager !== undefined ? manager : THREE.DefaultLoadingManager;

        this.materials = null;

        this.regexp = {
                // v float float float
                vertex_pattern: /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
                // vn float float float
                normal_pattern: /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
                // vt float float
                uv_pattern: /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
                // f vertex vertex vertex
                face_vertex: /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/,
                // f vertex/uv vertex/uv vertex/uv
                face_vertex_uv: /^f\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+))?/,
                // f vertex/uv/normal vertex/uv/normal vertex/uv/normal
                face_vertex_uv_normal: /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/,
                // f vertex//normal vertex//normal vertex//normal
                face_vertex_normal: /^f\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)(?:\s+(-?\d+)\/\/(-?\d+))?/,
                // o object_name | g group_name
                object_pattern: /^[og]\s*(.+)?/,
                // s boolean
                smoothing_pattern: /^s\s+(\d+|on|off)/,
                // mtllib file_reference
                material_library_pattern: /^mtllib /,
                // usemtl material_name
                material_use_pattern: /^usemtl /
        };
};

THREE.OBJLoader.prototype = {

        constructor: THREE.OBJLoader,

        load: function load(url, onLoad, onProgress, onError) {

                var scope = this;

                var loader = new THREE.XHRLoader(scope.manager);
                loader.setPath(this.path);
                loader.load(url, function (text) {

                        onLoad(scope.parse(text));
                }, onProgress, onError);
        },

        setPath: function setPath(value) {

                this.path = value;
        },

        setMaterials: function setMaterials(materials) {

                this.materials = materials;
        },

        _createParserState: function _createParserState() {

                var state = {
                        objects: [],
                        object: {},

                        vertices: [],
                        normals: [],
                        uvs: [],

                        materialLibraries: [],

                        startObject: function startObject(name, fromDeclaration) {

                                // If the current object (initial from reset) is not from a g/o declaration in the parsed
                                // file. We need to use it for the first parsed g/o to keep things in sync.
                                if (this.object && this.object.fromDeclaration === false) {

                                        this.object.name = name;
                                        this.object.fromDeclaration = fromDeclaration !== false;
                                        return;
                                }

                                if (this.object && typeof this.object._finalize === 'function') {

                                        this.object._finalize();
                                }

                                var previousMaterial = this.object && typeof this.object.currentMaterial === 'function' ? this.object.currentMaterial() : undefined;

                                this.object = {
                                        name: name || '',
                                        fromDeclaration: fromDeclaration !== false,

                                        geometry: {
                                                vertices: [],
                                                normals: [],
                                                uvs: []
                                        },
                                        materials: [],
                                        smooth: true,

                                        startMaterial: function startMaterial(name, libraries) {

                                                var previous = this._finalize(false);

                                                // New usemtl declaration overwrites an inherited material, except if faces were declared
                                                // after the material, then it must be preserved for proper MultiMaterial continuation.
                                                if (previous && (previous.inherited || previous.groupCount <= 0)) {

                                                        this.materials.splice(previous.index, 1);
                                                }

                                                var material = {
                                                        index: this.materials.length,
                                                        name: name || '',
                                                        mtllib: Array.isArray(libraries) && libraries.length > 0 ? libraries[libraries.length - 1] : '',
                                                        smooth: previous !== undefined ? previous.smooth : this.smooth,
                                                        groupStart: previous !== undefined ? previous.groupEnd : 0,
                                                        groupEnd: -1,
                                                        groupCount: -1,
                                                        inherited: false,

                                                        clone: function clone(index) {
                                                                return {
                                                                        index: typeof index === 'number' ? index : this.index,
                                                                        name: this.name,
                                                                        mtllib: this.mtllib,
                                                                        smooth: this.smooth,
                                                                        groupStart: this.groupEnd,
                                                                        groupEnd: -1,
                                                                        groupCount: -1,
                                                                        inherited: false
                                                                };
                                                        }
                                                };

                                                this.materials.push(material);

                                                return material;
                                        },

                                        currentMaterial: function currentMaterial() {

                                                if (this.materials.length > 0) {
                                                        return this.materials[this.materials.length - 1];
                                                }

                                                return undefined;
                                        },

                                        _finalize: function _finalize(end) {

                                                var lastMultiMaterial = this.currentMaterial();
                                                if (lastMultiMaterial && lastMultiMaterial.groupEnd === -1) {

                                                        lastMultiMaterial.groupEnd = this.geometry.vertices.length / 3;
                                                        lastMultiMaterial.groupCount = lastMultiMaterial.groupEnd - lastMultiMaterial.groupStart;
                                                        lastMultiMaterial.inherited = false;
                                                }

                                                // Guarantee at least one empty material, this makes the creation later more straight forward.
                                                if (end !== false && this.materials.length === 0) {
                                                        this.materials.push({
                                                                name: '',
                                                                smooth: this.smooth
                                                        });
                                                }

                                                return lastMultiMaterial;
                                        }
                                };

                                // Inherit previous objects material.
                                // Spec tells us that a declared material must be set to all objects until a new material is declared.
                                // If a usemtl declaration is encountered while this new object is being parsed, it will
                                // overwrite the inherited material. Exception being that there was already face declarations
                                // to the inherited material, then it will be preserved for proper MultiMaterial continuation.

                                if (previousMaterial && previousMaterial.name && typeof previousMaterial.clone === "function") {

                                        var declared = previousMaterial.clone(0);
                                        declared.inherited = true;
                                        this.object.materials.push(declared);
                                }

                                this.objects.push(this.object);
                        },

                        finalize: function finalize() {

                                if (this.object && typeof this.object._finalize === 'function') {

                                        this.object._finalize();
                                }
                        },

                        parseVertexIndex: function parseVertexIndex(value, len) {

                                var index = parseInt(value, 10);
                                return (index >= 0 ? index - 1 : index + len / 3) * 3;
                        },

                        parseNormalIndex: function parseNormalIndex(value, len) {

                                var index = parseInt(value, 10);
                                return (index >= 0 ? index - 1 : index + len / 3) * 3;
                        },

                        parseUVIndex: function parseUVIndex(value, len) {

                                var index = parseInt(value, 10);
                                return (index >= 0 ? index - 1 : index + len / 2) * 2;
                        },

                        addVertex: function addVertex(a, b, c) {

                                var src = this.vertices;
                                var dst = this.object.geometry.vertices;

                                dst.push(src[a + 0]);
                                dst.push(src[a + 1]);
                                dst.push(src[a + 2]);
                                dst.push(src[b + 0]);
                                dst.push(src[b + 1]);
                                dst.push(src[b + 2]);
                                dst.push(src[c + 0]);
                                dst.push(src[c + 1]);
                                dst.push(src[c + 2]);
                        },

                        addVertexLine: function addVertexLine(a) {

                                var src = this.vertices;
                                var dst = this.object.geometry.vertices;

                                dst.push(src[a + 0]);
                                dst.push(src[a + 1]);
                                dst.push(src[a + 2]);
                        },

                        addNormal: function addNormal(a, b, c) {

                                var src = this.normals;
                                var dst = this.object.geometry.normals;

                                dst.push(src[a + 0]);
                                dst.push(src[a + 1]);
                                dst.push(src[a + 2]);
                                dst.push(src[b + 0]);
                                dst.push(src[b + 1]);
                                dst.push(src[b + 2]);
                                dst.push(src[c + 0]);
                                dst.push(src[c + 1]);
                                dst.push(src[c + 2]);
                        },

                        addUV: function addUV(a, b, c) {

                                var src = this.uvs;
                                var dst = this.object.geometry.uvs;

                                dst.push(src[a + 0]);
                                dst.push(src[a + 1]);
                                dst.push(src[b + 0]);
                                dst.push(src[b + 1]);
                                dst.push(src[c + 0]);
                                dst.push(src[c + 1]);
                        },

                        addUVLine: function addUVLine(a) {

                                var src = this.uvs;
                                var dst = this.object.geometry.uvs;

                                dst.push(src[a + 0]);
                                dst.push(src[a + 1]);
                        },

                        addFace: function addFace(a, b, c, d, ua, ub, uc, ud, na, nb, nc, nd) {

                                var vLen = this.vertices.length;

                                var ia = this.parseVertexIndex(a, vLen);
                                var ib = this.parseVertexIndex(b, vLen);
                                var ic = this.parseVertexIndex(c, vLen);
                                var id;

                                if (d === undefined) {

                                        this.addVertex(ia, ib, ic);
                                } else {

                                        id = this.parseVertexIndex(d, vLen);

                                        this.addVertex(ia, ib, id);
                                        this.addVertex(ib, ic, id);
                                }

                                if (ua !== undefined) {

                                        var uvLen = this.uvs.length;

                                        ia = this.parseUVIndex(ua, uvLen);
                                        ib = this.parseUVIndex(ub, uvLen);
                                        ic = this.parseUVIndex(uc, uvLen);

                                        if (d === undefined) {

                                                this.addUV(ia, ib, ic);
                                        } else {

                                                id = this.parseUVIndex(ud, uvLen);

                                                this.addUV(ia, ib, id);
                                                this.addUV(ib, ic, id);
                                        }
                                }

                                if (na !== undefined) {

                                        // Normals are many times the same. If so, skip function call and parseInt.
                                        var nLen = this.normals.length;
                                        ia = this.parseNormalIndex(na, nLen);

                                        ib = na === nb ? ia : this.parseNormalIndex(nb, nLen);
                                        ic = na === nc ? ia : this.parseNormalIndex(nc, nLen);

                                        if (d === undefined) {

                                                this.addNormal(ia, ib, ic);
                                        } else {

                                                id = this.parseNormalIndex(nd, nLen);

                                                this.addNormal(ia, ib, id);
                                                this.addNormal(ib, ic, id);
                                        }
                                }
                        },

                        addLineGeometry: function addLineGeometry(vertices, uvs) {

                                this.object.geometry.type = 'Line';

                                var vLen = this.vertices.length;
                                var uvLen = this.uvs.length;

                                for (var vi = 0, l = vertices.length; vi < l; vi++) {

                                        this.addVertexLine(this.parseVertexIndex(vertices[vi], vLen));
                                }

                                for (var uvi = 0, l = uvs.length; uvi < l; uvi++) {

                                        this.addUVLine(this.parseUVIndex(uvs[uvi], uvLen));
                                }
                        }

                };

                state.startObject('', false);

                return state;
        },

        parse: function parse(text) {

                console.time('OBJLoader');

                var state = this._createParserState();

                if (text.indexOf('\r\n') !== -1) {

                        // This is faster than String.split with regex that splits on both
                        text = text.replace('\r\n', '\n');
                }

                var lines = text.split('\n');
                var line = '',
                    lineFirstChar = '',
                    lineSecondChar = '';
                var lineLength = 0;
                var result = [];

                // Faster to just trim left side of the line. Use if available.
                var trimLeft = typeof ''.trimLeft === 'function';

                for (var i = 0, l = lines.length; i < l; i++) {

                        line = lines[i];

                        line = trimLeft ? line.trimLeft() : line.trim();

                        lineLength = line.length;

                        if (lineLength === 0) continue;

                        lineFirstChar = line.charAt(0);

                        // @todo invoke passed in handler if any
                        if (lineFirstChar === '#') continue;

                        if (lineFirstChar === 'v') {

                                lineSecondChar = line.charAt(1);

                                if (lineSecondChar === ' ' && (result = this.regexp.vertex_pattern.exec(line)) !== null) {

                                        // 0                  1      2      3
                                        // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

                                        state.vertices.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
                                } else if (lineSecondChar === 'n' && (result = this.regexp.normal_pattern.exec(line)) !== null) {

                                        // 0                   1      2      3
                                        // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

                                        state.normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
                                } else if (lineSecondChar === 't' && (result = this.regexp.uv_pattern.exec(line)) !== null) {

                                        // 0               1      2
                                        // ["vt 0.1 0.2", "0.1", "0.2"]

                                        state.uvs.push(parseFloat(result[1]), parseFloat(result[2]));
                                } else {

                                        throw new Error("Unexpected vertex/normal/uv line: '" + line + "'");
                                }
                        } else if (lineFirstChar === "f") {

                                if ((result = this.regexp.face_vertex_uv_normal.exec(line)) !== null) {

                                        // f vertex/uv/normal vertex/uv/normal vertex/uv/normal
                                        // 0                        1    2    3    4    5    6    7    8    9   10         11         12
                                        // ["f 1/1/1 2/2/2 3/3/3", "1", "1", "1", "2", "2", "2", "3", "3", "3", undefined, undefined, undefined]

                                        state.addFace(result[1], result[4], result[7], result[10], result[2], result[5], result[8], result[11], result[3], result[6], result[9], result[12]);
                                } else if ((result = this.regexp.face_vertex_uv.exec(line)) !== null) {

                                        // f vertex/uv vertex/uv vertex/uv
                                        // 0                  1    2    3    4    5    6   7          8
                                        // ["f 1/1 2/2 3/3", "1", "1", "2", "2", "3", "3", undefined, undefined]

                                        state.addFace(result[1], result[3], result[5], result[7], result[2], result[4], result[6], result[8]);
                                } else if ((result = this.regexp.face_vertex_normal.exec(line)) !== null) {

                                        // f vertex//normal vertex//normal vertex//normal
                                        // 0                     1    2    3    4    5    6   7          8
                                        // ["f 1//1 2//2 3//3", "1", "1", "2", "2", "3", "3", undefined, undefined]

                                        state.addFace(result[1], result[3], result[5], result[7], undefined, undefined, undefined, undefined, result[2], result[4], result[6], result[8]);
                                } else if ((result = this.regexp.face_vertex.exec(line)) !== null) {

                                        // f vertex vertex vertex
                                        // 0            1    2    3   4
                                        // ["f 1 2 3", "1", "2", "3", undefined]

                                        state.addFace(result[1], result[2], result[3], result[4]);
                                } else {

                                        throw new Error("Unexpected face line: '" + line + "'");
                                }
                        } else if (lineFirstChar === "l") {

                                var lineParts = line.substring(1).trim().split(" ");
                                var lineVertices = [],
                                    lineUVs = [];

                                if (line.indexOf("/") === -1) {

                                        lineVertices = lineParts;
                                } else {

                                        for (var li = 0, llen = lineParts.length; li < llen; li++) {

                                                var parts = lineParts[li].split("/");

                                                if (parts[0] !== "") lineVertices.push(parts[0]);
                                                if (parts[1] !== "") lineUVs.push(parts[1]);
                                        }
                                }
                                state.addLineGeometry(lineVertices, lineUVs);
                        } else if ((result = this.regexp.object_pattern.exec(line)) !== null) {

                                // o object_name
                                // or
                                // g group_name

                                var name = result[0].substr(1).trim();
                                state.startObject(name);
                        } else if (this.regexp.material_use_pattern.test(line)) {

                                // material

                                state.object.startMaterial(line.substring(7).trim(), state.materialLibraries);
                        } else if (this.regexp.material_library_pattern.test(line)) {

                                // mtl file

                                state.materialLibraries.push(line.substring(7).trim());
                        } else if ((result = this.regexp.smoothing_pattern.exec(line)) !== null) {

                                // smooth shading

                                // @todo Handle files that have varying smooth values for a set of faces inside one geometry,
                                // but does not define a usemtl for each face set.
                                // This should be detected and a dummy material created (later MultiMaterial and geometry groups).
                                // This requires some care to not create extra material on each smooth value for "normal" obj files.
                                // where explicit usemtl defines geometry groups.
                                // Example asset: examples/models/obj/cerberus/Cerberus.obj

                                var value = result[1].trim().toLowerCase();
                                state.object.smooth = value === '1' || value === 'on';

                                var material = state.object.currentMaterial();
                                if (material) {

                                        material.smooth = state.object.smooth;
                                }
                        } else {

                                // Handle null terminated files without exception
                                if (line === '\0') continue;

                                throw new Error("Unexpected line: '" + line + "'");
                        }
                }

                state.finalize();

                var container = new THREE.Group();
                container.materialLibraries = [].concat(state.materialLibraries);

                for (var i = 0, l = state.objects.length; i < l; i++) {

                        var object = state.objects[i];
                        var geometry = object.geometry;
                        var materials = object.materials;
                        var isLine = geometry.type === 'Line';

                        // Skip o/g line declarations that did not follow with any faces
                        if (geometry.vertices.length === 0) continue;

                        var buffergeometry = new THREE.BufferGeometry();

                        buffergeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(geometry.vertices), 3));

                        if (geometry.normals.length > 0) {

                                buffergeometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(geometry.normals), 3));
                        } else {

                                buffergeometry.computeVertexNormals();
                        }

                        if (geometry.uvs.length > 0) {

                                buffergeometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(geometry.uvs), 2));
                        }

                        // Create materials

                        var createdMaterials = [];

                        for (var mi = 0, miLen = materials.length; mi < miLen; mi++) {

                                var sourceMaterial = materials[mi];
                                var material = undefined;

                                if (this.materials !== null) {

                                        material = this.materials.create(sourceMaterial.name);

                                        // mtl etc. loaders probably can't create line materials correctly, copy properties to a line material.
                                        if (isLine && material && !(material instanceof THREE.LineBasicMaterial)) {

                                                var materialLine = new THREE.LineBasicMaterial();
                                                materialLine.copy(material);
                                                material = materialLine;
                                        }
                                }

                                if (!material) {

                                        material = !isLine ? new THREE.MeshPhongMaterial() : new THREE.LineBasicMaterial();
                                        material.name = sourceMaterial.name;
                                }

                                material.shading = sourceMaterial.smooth ? THREE.SmoothShading : THREE.FlatShading;

                                createdMaterials.push(material);
                        }

                        // Create mesh

                        var mesh;

                        if (createdMaterials.length > 1) {

                                for (var mi = 0, miLen = materials.length; mi < miLen; mi++) {

                                        var sourceMaterial = materials[mi];
                                        buffergeometry.addGroup(sourceMaterial.groupStart, sourceMaterial.groupCount, mi);
                                }

                                var multiMaterial = new THREE.MultiMaterial(createdMaterials);
                                mesh = !isLine ? new THREE.Mesh(buffergeometry, multiMaterial) : new THREE.Line(buffergeometry, multiMaterial);
                        } else {

                                mesh = !isLine ? new THREE.Mesh(buffergeometry, createdMaterials[0]) : new THREE.Line(buffergeometry, createdMaterials[0]);
                        }

                        mesh.name = object.name;

                        container.add(mesh);
                }

                console.timeEnd('OBJLoader');

                return container;
        }

};

},{}],3:[function(require,module,exports){
"use strict";

THREE.ViveController = function (id) {

  THREE.Object3D.call(this);

  this.matrixAutoUpdate = false;
  this.standingMatrix = new THREE.Matrix4();

  var scope = this;

  function update() {

    requestAnimationFrame(update);

    var gamepad = navigator.getGamepads()[id];

    if (gamepad !== undefined && gamepad.pose !== null) {

      var pose = gamepad.pose;

      scope.position.fromArray(pose.position);
      scope.quaternion.fromArray(pose.orientation);
      scope.matrix.compose(scope.position, scope.quaternion, scope.scale);
      scope.matrix.multiplyMatrices(scope.standingMatrix, scope.matrix);
      scope.matrixWorldNeedsUpdate = true;

      scope.visible = true;
    } else {

      scope.visible = false;
    }
  }

  update();
};

THREE.ViveController.prototype = Object.create(THREE.Object3D.prototype);
THREE.ViveController.prototype.constructor = THREE.ViveController;

},{}],4:[function(require,module,exports){
'use strict';

/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 */

THREE.VRControls = function (object, onError) {

	var scope = this;

	var vrDisplay, vrDisplays;

	var standingMatrix = new THREE.Matrix4();

	function gotVRDisplays(displays) {

		vrDisplays = displays;

		for (var i = 0; i < displays.length; i++) {

			if ('VRDisplay' in window && displays[i] instanceof VRDisplay || 'PositionSensorVRDevice' in window && displays[i] instanceof PositionSensorVRDevice) {

				vrDisplay = displays[i];
				break; // We keep the first we encounter
			}
		}

		if (vrDisplay === undefined) {

			if (onError) onError('VR input not available.');
		}
	}

	if (navigator.getVRDisplays) {

		navigator.getVRDisplays().then(gotVRDisplays);
	} else if (navigator.getVRDevices) {

		// Deprecated API.
		navigator.getVRDevices().then(gotVRDisplays);
	}

	// the Rift SDK returns the position in meters
	// this scale factor allows the user to define how meters
	// are converted to scene units.

	this.scale = 1;

	// If true will use "standing space" coordinate system where y=0 is the
	// floor and x=0, z=0 is the center of the room.
	this.standing = false;

	// Distance from the users eyes to the floor in meters. Used when
	// standing=true but the VRDisplay doesn't provide stageParameters.
	this.userHeight = 1.6;

	this.getVRDisplay = function () {

		return vrDisplay;
	};

	this.getVRDisplays = function () {

		return vrDisplays;
	};

	this.getStandingMatrix = function () {

		return standingMatrix;
	};

	this.update = function () {

		if (vrDisplay) {

			if (vrDisplay.getPose) {

				var pose = vrDisplay.getPose();

				if (pose.orientation !== null) {

					object.quaternion.fromArray(pose.orientation);
				}

				if (pose.position !== null) {

					object.position.fromArray(pose.position);
				} else {

					object.position.set(0, 0, 0);
				}
			} else {

				// Deprecated API.
				var state = vrDisplay.getState();

				if (state.orientation !== null) {

					object.quaternion.copy(state.orientation);
				}

				if (state.position !== null) {

					object.position.copy(state.position);
				} else {

					object.position.set(0, 0, 0);
				}
			}

			if (this.standing) {

				if (vrDisplay.stageParameters) {

					object.updateMatrix();

					standingMatrix.fromArray(vrDisplay.stageParameters.sittingToStandingTransform);
					object.applyMatrix(standingMatrix);
				} else {

					object.position.setY(object.position.y + this.userHeight);
				}
			}

			object.position.multiplyScalar(scope.scale);
		}
	};

	this.resetPose = function () {

		if (vrDisplay) {

			if (vrDisplay.resetPose !== undefined) {

				vrDisplay.resetPose();
			} else if (vrDisplay.resetSensor !== undefined) {

				// Deprecated API.
				vrDisplay.resetSensor();
			} else if (vrDisplay.zeroSensor !== undefined) {

				// Really deprecated API.
				vrDisplay.zeroSensor();
			}
		}
	};

	this.resetSensor = function () {

		console.warn('THREE.VRControls: .resetSensor() is now .resetPose().');
		this.resetPose();
	};

	this.zeroSensor = function () {

		console.warn('THREE.VRControls: .zeroSensor() is now .resetPose().');
		this.resetPose();
	};

	this.dispose = function () {

		vrDisplay = null;
	};
};

},{}],5:[function(require,module,exports){
'use strict';

/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 *
 * WebVR Spec: http://mozvr.github.io/webvr-spec/webvr.html
 *
 * Firefox: http://mozvr.com/downloads/
 * Chromium: https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ&usp=sharing#list
 *
 */

THREE.VREffect = function (renderer, onError) {

	var isWebVR1 = true;

	var vrDisplay, vrDisplays;
	var eyeTranslationL = new THREE.Vector3();
	var eyeTranslationR = new THREE.Vector3();
	var renderRectL, renderRectR;
	var eyeFOVL, eyeFOVR;

	function gotVRDisplays(displays) {

		vrDisplays = displays;

		for (var i = 0; i < displays.length; i++) {

			if ('VRDisplay' in window && displays[i] instanceof VRDisplay) {

				vrDisplay = displays[i];
				isWebVR1 = true;
				break; // We keep the first we encounter
			} else if ('HMDVRDevice' in window && displays[i] instanceof HMDVRDevice) {

				vrDisplay = displays[i];
				isWebVR1 = false;
				break; // We keep the first we encounter
			}
		}

		if (vrDisplay === undefined) {

			if (onError) onError('HMD not available');
		}
	}

	if (navigator.getVRDisplays) {

		navigator.getVRDisplays().then(gotVRDisplays);
	} else if (navigator.getVRDevices) {

		// Deprecated API.
		navigator.getVRDevices().then(gotVRDisplays);
	}

	//

	this.isPresenting = false;
	this.scale = 1;

	var scope = this;

	var rendererSize = renderer.getSize();
	var rendererPixelRatio = renderer.getPixelRatio();

	this.getVRDisplay = function () {

		return vrDisplay;
	};

	this.getVRDisplays = function () {

		return vrDisplays;
	};

	this.setSize = function (width, height) {

		rendererSize = { width: width, height: height };

		if (scope.isPresenting) {

			var eyeParamsL = vrDisplay.getEyeParameters('left');
			renderer.setPixelRatio(1);

			if (isWebVR1) {

				renderer.setSize(eyeParamsL.renderWidth * 2, eyeParamsL.renderHeight, false);
			} else {

				renderer.setSize(eyeParamsL.renderRect.width * 2, eyeParamsL.renderRect.height, false);
			}
		} else {

			renderer.setPixelRatio(rendererPixelRatio);
			renderer.setSize(width, height);
		}
	};

	// fullscreen

	var canvas = renderer.domElement;
	var requestFullscreen;
	var exitFullscreen;
	var fullscreenElement;
	var leftBounds = [0.0, 0.0, 0.5, 1.0];
	var rightBounds = [0.5, 0.0, 0.5, 1.0];

	function onFullscreenChange() {

		var wasPresenting = scope.isPresenting;
		scope.isPresenting = vrDisplay !== undefined && (vrDisplay.isPresenting || !isWebVR1 && document[fullscreenElement] instanceof window.HTMLElement);

		if (scope.isPresenting) {

			var eyeParamsL = vrDisplay.getEyeParameters('left');
			var eyeWidth, eyeHeight;

			if (isWebVR1) {

				eyeWidth = eyeParamsL.renderWidth;
				eyeHeight = eyeParamsL.renderHeight;

				if (vrDisplay.getLayers) {

					var layers = vrDisplay.getLayers();
					if (layers.length) {

						leftBounds = layers[0].leftBounds || [0.0, 0.0, 0.5, 1.0];
						rightBounds = layers[0].rightBounds || [0.5, 0.0, 0.5, 1.0];
					}
				}
			} else {

				eyeWidth = eyeParamsL.renderRect.width;
				eyeHeight = eyeParamsL.renderRect.height;
			}

			if (!wasPresenting) {

				rendererPixelRatio = renderer.getPixelRatio();
				rendererSize = renderer.getSize();

				renderer.setPixelRatio(1);
				renderer.setSize(eyeWidth * 2, eyeHeight, false);
			}
		} else if (wasPresenting) {

			renderer.setPixelRatio(rendererPixelRatio);
			renderer.setSize(rendererSize.width, rendererSize.height);
		}
	}

	if (canvas.requestFullscreen) {

		requestFullscreen = 'requestFullscreen';
		fullscreenElement = 'fullscreenElement';
		exitFullscreen = 'exitFullscreen';
		document.addEventListener('fullscreenchange', onFullscreenChange, false);
	} else if (canvas.mozRequestFullScreen) {

		requestFullscreen = 'mozRequestFullScreen';
		fullscreenElement = 'mozFullScreenElement';
		exitFullscreen = 'mozCancelFullScreen';
		document.addEventListener('mozfullscreenchange', onFullscreenChange, false);
	} else {

		requestFullscreen = 'webkitRequestFullscreen';
		fullscreenElement = 'webkitFullscreenElement';
		exitFullscreen = 'webkitExitFullscreen';
		document.addEventListener('webkitfullscreenchange', onFullscreenChange, false);
	}

	window.addEventListener('vrdisplaypresentchange', onFullscreenChange, false);

	this.setFullScreen = function (boolean) {

		return new Promise(function (resolve, reject) {

			if (vrDisplay === undefined) {

				reject(new Error('No VR hardware found.'));
				return;
			}

			if (scope.isPresenting === boolean) {

				resolve();
				return;
			}

			if (isWebVR1) {

				if (boolean) {

					resolve(vrDisplay.requestPresent([{ source: canvas }]));
				} else {

					resolve(vrDisplay.exitPresent());
				}
			} else {

				if (canvas[requestFullscreen]) {

					canvas[boolean ? requestFullscreen : exitFullscreen]({ vrDisplay: vrDisplay });
					resolve();
				} else {

					console.error('No compatible requestFullscreen method found.');
					reject(new Error('No compatible requestFullscreen method found.'));
				}
			}
		});
	};

	this.requestPresent = function () {

		return this.setFullScreen(true);
	};

	this.exitPresent = function () {

		return this.setFullScreen(false);
	};

	this.requestAnimationFrame = function (f) {

		if (isWebVR1 && vrDisplay !== undefined) {

			return vrDisplay.requestAnimationFrame(f);
		} else {

			return window.requestAnimationFrame(f);
		}
	};

	this.cancelAnimationFrame = function (h) {

		if (isWebVR1 && vrDisplay !== undefined) {

			vrDisplay.cancelAnimationFrame(h);
		} else {

			window.cancelAnimationFrame(h);
		}
	};

	this.submitFrame = function () {

		if (isWebVR1 && vrDisplay !== undefined && scope.isPresenting) {

			vrDisplay.submitFrame();
		}
	};

	this.autoSubmitFrame = true;

	// render

	var cameraL = new THREE.PerspectiveCamera();
	cameraL.layers.enable(1);

	var cameraR = new THREE.PerspectiveCamera();
	cameraR.layers.enable(2);

	this.render = function (scene, camera, renderTarget, forceClear) {

		if (vrDisplay && scope.isPresenting) {

			var autoUpdate = scene.autoUpdate;

			if (autoUpdate) {

				scene.updateMatrixWorld();
				scene.autoUpdate = false;
			}

			var eyeParamsL = vrDisplay.getEyeParameters('left');
			var eyeParamsR = vrDisplay.getEyeParameters('right');

			if (isWebVR1) {

				eyeTranslationL.fromArray(eyeParamsL.offset);
				eyeTranslationR.fromArray(eyeParamsR.offset);
				eyeFOVL = eyeParamsL.fieldOfView;
				eyeFOVR = eyeParamsR.fieldOfView;
			} else {

				eyeTranslationL.copy(eyeParamsL.eyeTranslation);
				eyeTranslationR.copy(eyeParamsR.eyeTranslation);
				eyeFOVL = eyeParamsL.recommendedFieldOfView;
				eyeFOVR = eyeParamsR.recommendedFieldOfView;
			}

			if (Array.isArray(scene)) {

				console.warn('THREE.VREffect.render() no longer supports arrays. Use object.layers instead.');
				scene = scene[0];
			}

			// When rendering we don't care what the recommended size is, only what the actual size
			// of the backbuffer is.
			var size = renderer.getSize();
			renderRectL = {
				x: Math.round(size.width * leftBounds[0]),
				y: Math.round(size.height * leftBounds[1]),
				width: Math.round(size.width * leftBounds[2]),
				height: Math.round(size.height * leftBounds[3])
			};
			renderRectR = {
				x: Math.round(size.width * rightBounds[0]),
				y: Math.round(size.height * rightBounds[1]),
				width: Math.round(size.width * rightBounds[2]),
				height: Math.round(size.height * rightBounds[3])
			};

			if (renderTarget) {

				renderer.setRenderTarget(renderTarget);
				renderTarget.scissorTest = true;
			} else {

				renderer.setScissorTest(true);
			}

			if (renderer.autoClear || forceClear) renderer.clear();

			if (camera.parent === null) camera.updateMatrixWorld();

			cameraL.projectionMatrix = fovToProjection(eyeFOVL, true, camera.near, camera.far);
			cameraR.projectionMatrix = fovToProjection(eyeFOVR, true, camera.near, camera.far);

			camera.matrixWorld.decompose(cameraL.position, cameraL.quaternion, cameraL.scale);
			camera.matrixWorld.decompose(cameraR.position, cameraR.quaternion, cameraR.scale);

			var scale = this.scale;
			cameraL.translateOnAxis(eyeTranslationL, scale);
			cameraR.translateOnAxis(eyeTranslationR, scale);

			// render left eye
			if (renderTarget) {

				renderTarget.viewport.set(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
				renderTarget.scissor.set(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
			} else {

				renderer.setViewport(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
				renderer.setScissor(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
			}
			renderer.render(scene, cameraL, renderTarget, forceClear);

			// render right eye
			if (renderTarget) {

				renderTarget.viewport.set(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
				renderTarget.scissor.set(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
			} else {

				renderer.setViewport(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
				renderer.setScissor(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
			}
			renderer.render(scene, cameraR, renderTarget, forceClear);

			if (renderTarget) {

				renderTarget.viewport.set(0, 0, size.width, size.height);
				renderTarget.scissor.set(0, 0, size.width, size.height);
				renderTarget.scissorTest = false;
				renderer.setRenderTarget(null);
			} else {

				renderer.setScissorTest(false);
			}

			if (autoUpdate) {

				scene.autoUpdate = true;
			}

			if (scope.autoSubmitFrame) {

				scope.submitFrame();
			}

			return;
		}

		// Regular render mode if not HMD

		renderer.render(scene, camera, renderTarget, forceClear);
	};

	//

	function fovToNDCScaleOffset(fov) {

		var pxscale = 2.0 / (fov.leftTan + fov.rightTan);
		var pxoffset = (fov.leftTan - fov.rightTan) * pxscale * 0.5;
		var pyscale = 2.0 / (fov.upTan + fov.downTan);
		var pyoffset = (fov.upTan - fov.downTan) * pyscale * 0.5;
		return { scale: [pxscale, pyscale], offset: [pxoffset, pyoffset] };
	}

	function fovPortToProjection(fov, rightHanded, zNear, zFar) {

		rightHanded = rightHanded === undefined ? true : rightHanded;
		zNear = zNear === undefined ? 0.01 : zNear;
		zFar = zFar === undefined ? 10000.0 : zFar;

		var handednessScale = rightHanded ? -1.0 : 1.0;

		// start with an identity matrix
		var mobj = new THREE.Matrix4();
		var m = mobj.elements;

		// and with scale/offset info for normalized device coords
		var scaleAndOffset = fovToNDCScaleOffset(fov);

		// X result, map clip edges to [-w,+w]
		m[0 * 4 + 0] = scaleAndOffset.scale[0];
		m[0 * 4 + 1] = 0.0;
		m[0 * 4 + 2] = scaleAndOffset.offset[0] * handednessScale;
		m[0 * 4 + 3] = 0.0;

		// Y result, map clip edges to [-w,+w]
		// Y offset is negated because this proj matrix transforms from world coords with Y=up,
		// but the NDC scaling has Y=down (thanks D3D?)
		m[1 * 4 + 0] = 0.0;
		m[1 * 4 + 1] = scaleAndOffset.scale[1];
		m[1 * 4 + 2] = -scaleAndOffset.offset[1] * handednessScale;
		m[1 * 4 + 3] = 0.0;

		// Z result (up to the app)
		m[2 * 4 + 0] = 0.0;
		m[2 * 4 + 1] = 0.0;
		m[2 * 4 + 2] = zFar / (zNear - zFar) * -handednessScale;
		m[2 * 4 + 3] = zFar * zNear / (zNear - zFar);

		// W result (= Z in)
		m[3 * 4 + 0] = 0.0;
		m[3 * 4 + 1] = 0.0;
		m[3 * 4 + 2] = handednessScale;
		m[3 * 4 + 3] = 0.0;

		mobj.transpose();

		return mobj;
	}

	function fovToProjection(fov, rightHanded, zNear, zFar) {

		var DEG2RAD = Math.PI / 180.0;

		var fovPort = {
			upTan: Math.tan(fov.upDegrees * DEG2RAD),
			downTan: Math.tan(fov.downDegrees * DEG2RAD),
			leftTan: Math.tan(fov.leftDegrees * DEG2RAD),
			rightTan: Math.tan(fov.rightDegrees * DEG2RAD)
		};

		return fovPortToProjection(fovPort, rightHanded, zNear, zFar);
	}
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vrcontrols = require('./vrcontrols');

var VRControls = _interopRequireWildcard(_vrcontrols);

var _vreffects = require('./vreffects');

var VREffects = _interopRequireWildcard(_vreffects);

var _vivecontroller = require('./vivecontroller');

var ViveController = _interopRequireWildcard(_vivecontroller);

var _webvr = require('./webvr');

var WEBVR = _interopRequireWildcard(_webvr);

var _objloader = require('./objloader');

var ObjLoader = _interopRequireWildcard(_objloader);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

if (WEBVR.isLatestAvailable() === false) {

  document.body.appendChild(WEBVR.getMessage());
}

var container;
var camera, renderer;
var effect, controls;
var controller1, controller2;
var scene;

function init() {

  var container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
  scene.add(camera);

  var room = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6, 8, 8, 8), new THREE.MeshBasicMaterial({ color: 0x404040, wireframe: true }));
  room.position.y = 3;
  scene.add(room);

  scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setClearColor(0x505050);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.sortObjects = false;
  container.appendChild(renderer.domElement);

  controls = new THREE.VRControls(camera);
  controls.standing = true;

  // controllers

  controller1 = new THREE.ViveController(0);
  controller1.standingMatrix = controls.getStandingMatrix();
  scene.add(controller1);

  controller2 = new THREE.ViveController(1);
  controller2.standingMatrix = controls.getStandingMatrix();
  scene.add(controller2);

  var loader = new THREE.OBJLoader();
  loader.setPath('models/obj/vive-controller/');
  loader.load('vr_controller_vive_1_5.obj', function (object) {

    var loader = new THREE.TextureLoader();
    loader.setPath('models/obj/vive-controller/');

    var controller = object.children[0];
    controller.material.map = loader.load('onepointfive_texture.png');
    controller.material.specularMap = loader.load('onepointfive_spec.png');

    controller1.add(object.clone());
    controller2.add(object.clone());
  });

  effect = new THREE.VREffect(renderer);

  if (WEBVR.isAvailable() === true) {
    document.body.appendChild(WEBVR.getButton(effect));
    setTimeout(function () {
      return effect.requestPresent();
    }, 1000);
  }

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize(window.innerWidth, window.innerHeight);
  }, false);
}

function animate() {

  effect.requestAnimationFrame(animate);
  render();
}

function render() {
  controls.update();
  effect.render(scene, camera);
}

exports.default = {
  start: function start() {
    init();
    animate();

    return {
      scene: scene, camera: camera, controller1: controller1, controller2: controller2, renderer: renderer
    };
  }
};

},{"./objloader":2,"./vivecontroller":3,"./vrcontrols":4,"./vreffects":5,"./webvr":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLatestAvailable = isLatestAvailable;
exports.isAvailable = isAvailable;
exports.getMessage = getMessage;
exports.getButton = getButton;
/**
* @author mrdoob / http://mrdoob.com
* Based on @tojiro's vr-samples-utils.js
*/

function isLatestAvailable() {

  return navigator.getVRDisplays !== undefined;
}

function isAvailable() {

  return navigator.getVRDisplays !== undefined || navigator.getVRDevices !== undefined;
}

function getMessage() {

  var message;

  if (navigator.getVRDisplays) {

    navigator.getVRDisplays().then(function (displays) {

      if (displays.length === 0) message = 'WebVR supported, but no VRDisplays found.';
    });
  } else if (navigator.getVRDevices) {

    message = 'Your browser supports WebVR but not the latest version. See <a href="http://webvr.info">webvr.info</a> for more info.';
  } else {

    message = 'Your browser does not support WebVR. See <a href="http://webvr.info">webvr.info</a> for assistance.';
  }

  if (message !== undefined) {

    var container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.top = '0';
    container.style.right = '0';
    container.style.zIndex = '999';
    container.align = 'center';

    var error = document.createElement('div');
    error.style.fontFamily = 'sans-serif';
    error.style.fontSize = '16px';
    error.style.fontStyle = 'normal';
    error.style.lineHeight = '26px';
    error.style.backgroundColor = '#fff';
    error.style.color = '#000';
    error.style.padding = '10px 20px';
    error.style.margin = '50px';
    error.style.display = 'inline-block';
    error.innerHTML = message;
    container.appendChild(error);

    return container;
  }
}

function getButton(effect) {

  var button = document.createElement('button');
  button.style.position = 'absolute';
  button.style.left = 'calc(50% - 50px)';
  button.style.bottom = '20px';
  button.style.width = '100px';
  button.style.border = '0';
  button.style.padding = '8px';
  button.style.cursor = 'pointer';
  button.style.backgroundColor = '#000';
  button.style.color = '#fff';
  button.style.fontFamily = 'sans-serif';
  button.style.fontSize = '13px';
  button.style.fontStyle = 'normal';
  button.style.textAlign = 'center';
  button.style.zIndex = '999';
  button.textContent = 'ENTER VR';
  button.onclick = function () {

    effect.isPresenting ? effect.exitPresent() : effect.requestPresent();
  };

  window.addEventListener('vrdisplaypresentchange', function (event) {

    button.textContent = effect.isPresenting ? 'EXIT VR' : 'ENTER VR';
  }, false);

  return button;
}

},{}]},{},[1,2,3,4,5,7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxpbmRleC5qcyIsIm1vZHVsZXNcXG9iamxvYWRlci5qcyIsIm1vZHVsZXNcXHZpdmVjb250cm9sbGVyLmpzIiwibW9kdWxlc1xcdnJjb250cm9scy5qcyIsIm1vZHVsZXNcXHZyZWZmZWN0cy5qcyIsIm1vZHVsZXNcXHZydmlld2VyLmpzIiwibW9kdWxlc1xcd2VidnIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7c0JBRW9ELG1CQUFTLEtBQVQsRTs7SUFBNUMsSyxtQkFBQSxLO0lBQU8sTSxtQkFBQSxNO0lBQVEsVyxtQkFBQSxXO0lBQWEsVyxtQkFBQSxXOzs7QUFFcEMsTUFBTSxHQUFOLENBQVcsSUFBSSxNQUFNLElBQVYsQ0FBZ0IsSUFBSSxNQUFNLFdBQVYsQ0FBdUIsQ0FBdkIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsQ0FBaEIsRUFBa0QsSUFBSSxNQUFNLG9CQUFWLEVBQWxELENBQVg7Ozs7O0FDSkE7Ozs7QUFJQSxNQUFNLFNBQU4sR0FBa0IsVUFBVyxPQUFYLEVBQXFCOztBQUVyQyxhQUFLLE9BQUwsR0FBaUIsWUFBWSxTQUFkLEdBQTRCLE9BQTVCLEdBQXNDLE1BQU0scUJBQTNEOztBQUVBLGFBQUssU0FBTCxHQUFpQixJQUFqQjs7QUFFQSxhQUFLLE1BQUwsR0FBYztBQUNaO0FBQ0EsZ0NBQTJCLHlFQUZmO0FBR1o7QUFDQSxnQ0FBMkIsMEVBSmY7QUFLWjtBQUNBLDRCQUEyQixtREFOZjtBQU9aO0FBQ0EsNkJBQTJCLGlEQVJmO0FBU1o7QUFDQSxnQ0FBMkIscUZBVmY7QUFXWjtBQUNBLHVDQUEyQix5SEFaZjtBQWFaO0FBQ0Esb0NBQTJCLDZGQWRmO0FBZVo7QUFDQSxnQ0FBMkIsZUFoQmY7QUFpQlo7QUFDQSxtQ0FB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QUFiLEdBQXlCLFFBQXpCO0FBQ0EsU0FBTyxLQUFQLENBQWEsU0FBYixHQUF5QixRQUF6QjtBQUNBLFNBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsS0FBdEI7QUFDQSxTQUFPLFdBQVAsR0FBcUIsVUFBckI7QUFDQSxTQUFPLE9BQVAsR0FBaUIsWUFBVzs7QUFFMUIsV0FBTyxZQUFQLEdBQXNCLE9BQU8sV0FBUCxFQUF0QixHQUE2QyxPQUFPLGNBQVAsRUFBN0M7QUFFRCxHQUpEOztBQU1BLFNBQU8sZ0JBQVAsQ0FBeUIsd0JBQXpCLEVBQW1ELFVBQVcsS0FBWCxFQUFtQjs7QUFFcEUsV0FBTyxXQUFQLEdBQXFCLE9BQU8sWUFBUCxHQUFzQixTQUF0QixHQUFrQyxVQUF2RDtBQUVELEdBSkQsRUFJRyxLQUpIOztBQU1BLFNBQU8sTUFBUDtBQUVEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBWUlZpZXdlciBmcm9tICcuL3Zydmlld2VyJztcclxuXHJcbmNvbnN0IHsgc2NlbmUsIGNhbWVyYSwgY29udHJvbGxlcjEsIGNvbnRyb2xsZXIyIH0gPSBWUlZpZXdlci5zdGFydCgpO1xyXG5cclxuc2NlbmUuYWRkKCBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCAxLCAxLCAxICksIG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCgpICkgKTsiLCIvKipcclxuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbS9cclxuICovXHJcblxyXG5USFJFRS5PQkpMb2FkZXIgPSBmdW5jdGlvbiAoIG1hbmFnZXIgKSB7XHJcblxyXG4gIHRoaXMubWFuYWdlciA9ICggbWFuYWdlciAhPT0gdW5kZWZpbmVkICkgPyBtYW5hZ2VyIDogVEhSRUUuRGVmYXVsdExvYWRpbmdNYW5hZ2VyO1xyXG5cclxuICB0aGlzLm1hdGVyaWFscyA9IG51bGw7XHJcblxyXG4gIHRoaXMucmVnZXhwID0ge1xyXG4gICAgLy8gdiBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgdmVydGV4X3BhdHRlcm4gICAgICAgICAgIDogL152XFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKVxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKylcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspLyxcclxuICAgIC8vIHZuIGZsb2F0IGZsb2F0IGZsb2F0XHJcbiAgICBub3JtYWxfcGF0dGVybiAgICAgICAgICAgOiAvXnZuXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKVxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKylcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspLyxcclxuICAgIC8vIHZ0IGZsb2F0IGZsb2F0XHJcbiAgICB1dl9wYXR0ZXJuICAgICAgICAgICAgICAgOiAvXnZ0XFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKVxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKykvLFxyXG4gICAgLy8gZiB2ZXJ0ZXggdmVydGV4IHZlcnRleFxyXG4gICAgZmFjZV92ZXJ0ZXggICAgICAgICAgICAgIDogL15mXFxzKygtP1xcZCspXFxzKygtP1xcZCspXFxzKygtP1xcZCspKD86XFxzKygtP1xcZCspKT8vLFxyXG4gICAgLy8gZiB2ZXJ0ZXgvdXYgdmVydGV4L3V2IHZlcnRleC91dlxyXG4gICAgZmFjZV92ZXJ0ZXhfdXYgICAgICAgICAgIDogL15mXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspKD86XFxzKygtP1xcZCspXFwvKC0/XFxkKykpPy8sXHJcbiAgICAvLyBmIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsXHJcbiAgICBmYWNlX3ZlcnRleF91dl9ub3JtYWwgICAgOiAvXmZcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgLy8gZiB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbFxyXG4gICAgZmFjZV92ZXJ0ZXhfbm9ybWFsICAgICAgIDogL15mXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspKD86XFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKykpPy8sXHJcbiAgICAvLyBvIG9iamVjdF9uYW1lIHwgZyBncm91cF9uYW1lXHJcbiAgICBvYmplY3RfcGF0dGVybiAgICAgICAgICAgOiAvXltvZ11cXHMqKC4rKT8vLFxyXG4gICAgLy8gcyBib29sZWFuXHJcbiAgICBzbW9vdGhpbmdfcGF0dGVybiAgICAgICAgOiAvXnNcXHMrKFxcZCt8b258b2ZmKS8sXHJcbiAgICAvLyBtdGxsaWIgZmlsZV9yZWZlcmVuY2VcclxuICAgIG1hdGVyaWFsX2xpYnJhcnlfcGF0dGVybiA6IC9ebXRsbGliIC8sXHJcbiAgICAvLyB1c2VtdGwgbWF0ZXJpYWxfbmFtZVxyXG4gICAgbWF0ZXJpYWxfdXNlX3BhdHRlcm4gICAgIDogL151c2VtdGwgL1xyXG4gIH07XHJcblxyXG59O1xyXG5cclxuVEhSRUUuT0JKTG9hZGVyLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgY29uc3RydWN0b3I6IFRIUkVFLk9CSkxvYWRlcixcclxuXHJcbiAgbG9hZDogZnVuY3Rpb24gKCB1cmwsIG9uTG9hZCwgb25Qcm9ncmVzcywgb25FcnJvciApIHtcclxuXHJcbiAgICB2YXIgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuWEhSTG9hZGVyKCBzY29wZS5tYW5hZ2VyICk7XHJcbiAgICBsb2FkZXIuc2V0UGF0aCggdGhpcy5wYXRoICk7XHJcbiAgICBsb2FkZXIubG9hZCggdXJsLCBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgICBvbkxvYWQoIHNjb3BlLnBhcnNlKCB0ZXh0ICkgKTtcclxuXHJcbiAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yICk7XHJcblxyXG4gIH0sXHJcblxyXG4gIHNldFBhdGg6IGZ1bmN0aW9uICggdmFsdWUgKSB7XHJcblxyXG4gICAgdGhpcy5wYXRoID0gdmFsdWU7XHJcblxyXG4gIH0sXHJcblxyXG4gIHNldE1hdGVyaWFsczogZnVuY3Rpb24gKCBtYXRlcmlhbHMgKSB7XHJcblxyXG4gICAgdGhpcy5tYXRlcmlhbHMgPSBtYXRlcmlhbHM7XHJcblxyXG4gIH0sXHJcblxyXG4gIF9jcmVhdGVQYXJzZXJTdGF0ZSA6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB2YXIgc3RhdGUgPSB7XHJcbiAgICAgIG9iamVjdHMgIDogW10sXHJcbiAgICAgIG9iamVjdCAgIDoge30sXHJcblxyXG4gICAgICB2ZXJ0aWNlcyA6IFtdLFxyXG4gICAgICBub3JtYWxzICA6IFtdLFxyXG4gICAgICB1dnMgICAgICA6IFtdLFxyXG5cclxuICAgICAgbWF0ZXJpYWxMaWJyYXJpZXMgOiBbXSxcclxuXHJcbiAgICAgIHN0YXJ0T2JqZWN0OiBmdW5jdGlvbiAoIG5hbWUsIGZyb21EZWNsYXJhdGlvbiApIHtcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgb2JqZWN0IChpbml0aWFsIGZyb20gcmVzZXQpIGlzIG5vdCBmcm9tIGEgZy9vIGRlY2xhcmF0aW9uIGluIHRoZSBwYXJzZWRcclxuICAgICAgICAvLyBmaWxlLiBXZSBuZWVkIHRvIHVzZSBpdCBmb3IgdGhlIGZpcnN0IHBhcnNlZCBnL28gdG8ga2VlcCB0aGluZ3MgaW4gc3luYy5cclxuICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHRoaXMub2JqZWN0LmZyb21EZWNsYXJhdGlvbiA9PT0gZmFsc2UgKSB7XHJcblxyXG4gICAgICAgICAgdGhpcy5vYmplY3QubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPSAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKTtcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5fZmluYWxpemUgPT09ICdmdW5jdGlvbicgKSB7XHJcblxyXG4gICAgICAgICAgdGhpcy5vYmplY3QuX2ZpbmFsaXplKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHByZXZpb3VzTWF0ZXJpYWwgPSAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5jdXJyZW50TWF0ZXJpYWwgPT09ICdmdW5jdGlvbicgPyB0aGlzLm9iamVjdC5jdXJyZW50TWF0ZXJpYWwoKSA6IHVuZGVmaW5lZCApO1xyXG5cclxuICAgICAgICB0aGlzLm9iamVjdCA9IHtcclxuICAgICAgICAgIG5hbWUgOiBuYW1lIHx8ICcnLFxyXG4gICAgICAgICAgZnJvbURlY2xhcmF0aW9uIDogKCBmcm9tRGVjbGFyYXRpb24gIT09IGZhbHNlICksXHJcblxyXG4gICAgICAgICAgZ2VvbWV0cnkgOiB7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgIG5vcm1hbHMgIDogW10sXHJcbiAgICAgICAgICAgIHV2cyAgICAgIDogW11cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtYXRlcmlhbHMgOiBbXSxcclxuICAgICAgICAgIHNtb290aCA6IHRydWUsXHJcblxyXG4gICAgICAgICAgc3RhcnRNYXRlcmlhbCA6IGZ1bmN0aW9uKCBuYW1lLCBsaWJyYXJpZXMgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgcHJldmlvdXMgPSB0aGlzLl9maW5hbGl6ZSggZmFsc2UgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE5ldyB1c2VtdGwgZGVjbGFyYXRpb24gb3ZlcndyaXRlcyBhbiBpbmhlcml0ZWQgbWF0ZXJpYWwsIGV4Y2VwdCBpZiBmYWNlcyB3ZXJlIGRlY2xhcmVkXHJcbiAgICAgICAgICAgIC8vIGFmdGVyIHRoZSBtYXRlcmlhbCwgdGhlbiBpdCBtdXN0IGJlIHByZXNlcnZlZCBmb3IgcHJvcGVyIE11bHRpTWF0ZXJpYWwgY29udGludWF0aW9uLlxyXG4gICAgICAgICAgICBpZiAoIHByZXZpb3VzICYmICggcHJldmlvdXMuaW5oZXJpdGVkIHx8IHByZXZpb3VzLmdyb3VwQ291bnQgPD0gMCApICkge1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5zcGxpY2UoIHByZXZpb3VzLmluZGV4LCAxICk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB7XHJcbiAgICAgICAgICAgICAgaW5kZXggICAgICA6IHRoaXMubWF0ZXJpYWxzLmxlbmd0aCxcclxuICAgICAgICAgICAgICBuYW1lICAgICAgIDogbmFtZSB8fCAnJyxcclxuICAgICAgICAgICAgICBtdGxsaWIgICAgIDogKCBBcnJheS5pc0FycmF5KCBsaWJyYXJpZXMgKSAmJiBsaWJyYXJpZXMubGVuZ3RoID4gMCA/IGxpYnJhcmllc1sgbGlicmFyaWVzLmxlbmd0aCAtIDEgXSA6ICcnICksXHJcbiAgICAgICAgICAgICAgc21vb3RoICAgICA6ICggcHJldmlvdXMgIT09IHVuZGVmaW5lZCA/IHByZXZpb3VzLnNtb290aCA6IHRoaXMuc21vb3RoICksXHJcbiAgICAgICAgICAgICAgZ3JvdXBTdGFydCA6ICggcHJldmlvdXMgIT09IHVuZGVmaW5lZCA/IHByZXZpb3VzLmdyb3VwRW5kIDogMCApLFxyXG4gICAgICAgICAgICAgIGdyb3VwRW5kICAgOiAtMSxcclxuICAgICAgICAgICAgICBncm91cENvdW50IDogLTEsXHJcbiAgICAgICAgICAgICAgaW5oZXJpdGVkICA6IGZhbHNlLFxyXG5cclxuICAgICAgICAgICAgICBjbG9uZSA6IGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgIGluZGV4ICAgICAgOiAoIHR5cGVvZiBpbmRleCA9PT0gJ251bWJlcicgPyBpbmRleCA6IHRoaXMuaW5kZXggKSxcclxuICAgICAgICAgICAgICAgICAgbmFtZSAgICAgICA6IHRoaXMubmFtZSxcclxuICAgICAgICAgICAgICAgICAgbXRsbGliICAgICA6IHRoaXMubXRsbGliLFxyXG4gICAgICAgICAgICAgICAgICBzbW9vdGggICAgIDogdGhpcy5zbW9vdGgsXHJcbiAgICAgICAgICAgICAgICAgIGdyb3VwU3RhcnQgOiB0aGlzLmdyb3VwRW5kLFxyXG4gICAgICAgICAgICAgICAgICBncm91cEVuZCAgIDogLTEsXHJcbiAgICAgICAgICAgICAgICAgIGdyb3VwQ291bnQgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgaW5oZXJpdGVkICA6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnB1c2goIG1hdGVyaWFsICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICBjdXJyZW50TWF0ZXJpYWwgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRlcmlhbHNbIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCAtIDEgXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgIF9maW5hbGl6ZSA6IGZ1bmN0aW9uKCBlbmQgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGFzdE11bHRpTWF0ZXJpYWwgPSB0aGlzLmN1cnJlbnRNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICBpZiAoIGxhc3RNdWx0aU1hdGVyaWFsICYmIGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwRW5kID09PSAtMSApIHtcclxuXHJcbiAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgPSB0aGlzLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aCAvIDM7XHJcbiAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBDb3VudCA9IGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwRW5kIC0gbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBTdGFydDtcclxuICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5pbmhlcml0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEd1YXJhbnRlZSBhdCBsZWFzdCBvbmUgZW1wdHkgbWF0ZXJpYWwsIHRoaXMgbWFrZXMgdGhlIGNyZWF0aW9uIGxhdGVyIG1vcmUgc3RyYWlnaHQgZm9yd2FyZC5cclxuICAgICAgICAgICAgaWYgKCBlbmQgIT09IGZhbHNlICYmIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCA9PT0gMCApIHtcclxuICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIG5hbWUgICA6ICcnLFxyXG4gICAgICAgICAgICAgICAgc21vb3RoIDogdGhpcy5zbW9vdGhcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGxhc3RNdWx0aU1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBJbmhlcml0IHByZXZpb3VzIG9iamVjdHMgbWF0ZXJpYWwuXHJcbiAgICAgICAgLy8gU3BlYyB0ZWxscyB1cyB0aGF0IGEgZGVjbGFyZWQgbWF0ZXJpYWwgbXVzdCBiZSBzZXQgdG8gYWxsIG9iamVjdHMgdW50aWwgYSBuZXcgbWF0ZXJpYWwgaXMgZGVjbGFyZWQuXHJcbiAgICAgICAgLy8gSWYgYSB1c2VtdGwgZGVjbGFyYXRpb24gaXMgZW5jb3VudGVyZWQgd2hpbGUgdGhpcyBuZXcgb2JqZWN0IGlzIGJlaW5nIHBhcnNlZCwgaXQgd2lsbFxyXG4gICAgICAgIC8vIG92ZXJ3cml0ZSB0aGUgaW5oZXJpdGVkIG1hdGVyaWFsLiBFeGNlcHRpb24gYmVpbmcgdGhhdCB0aGVyZSB3YXMgYWxyZWFkeSBmYWNlIGRlY2xhcmF0aW9uc1xyXG4gICAgICAgIC8vIHRvIHRoZSBpbmhlcml0ZWQgbWF0ZXJpYWwsIHRoZW4gaXQgd2lsbCBiZSBwcmVzZXJ2ZWQgZm9yIHByb3BlciBNdWx0aU1hdGVyaWFsIGNvbnRpbnVhdGlvbi5cclxuXHJcbiAgICAgICAgaWYgKCBwcmV2aW91c01hdGVyaWFsICYmIHByZXZpb3VzTWF0ZXJpYWwubmFtZSAmJiB0eXBlb2YgcHJldmlvdXNNYXRlcmlhbC5jbG9uZSA9PT0gXCJmdW5jdGlvblwiICkge1xyXG5cclxuICAgICAgICAgIHZhciBkZWNsYXJlZCA9IHByZXZpb3VzTWF0ZXJpYWwuY2xvbmUoIDAgKTtcclxuICAgICAgICAgIGRlY2xhcmVkLmluaGVyaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5tYXRlcmlhbHMucHVzaCggZGVjbGFyZWQgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm9iamVjdHMucHVzaCggdGhpcy5vYmplY3QgKTtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmaW5hbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5fZmluYWxpemUgPT09ICdmdW5jdGlvbicgKSB7XHJcblxyXG4gICAgICAgICAgdGhpcy5vYmplY3QuX2ZpbmFsaXplKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwYXJzZVZlcnRleEluZGV4OiBmdW5jdGlvbiAoIHZhbHVlLCBsZW4gKSB7XHJcblxyXG4gICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICByZXR1cm4gKCBpbmRleCA+PSAwID8gaW5kZXggLSAxIDogaW5kZXggKyBsZW4gLyAzICkgKiAzO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHBhcnNlTm9ybWFsSW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFyc2VVVkluZGV4OiBmdW5jdGlvbiAoIHZhbHVlLCBsZW4gKSB7XHJcblxyXG4gICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICByZXR1cm4gKCBpbmRleCA+PSAwID8gaW5kZXggLSAxIDogaW5kZXggKyBsZW4gLyAyICkgKiAyO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZFZlcnRleDogZnVuY3Rpb24gKCBhLCBiLCBjICkge1xyXG5cclxuICAgICAgICB2YXIgc3JjID0gdGhpcy52ZXJ0aWNlcztcclxuICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudmVydGljZXM7XHJcblxyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDIgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDIgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDIgXSApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZFZlcnRleExpbmU6IGZ1bmN0aW9uICggYSApIHtcclxuXHJcbiAgICAgICAgdmFyIHNyYyA9IHRoaXMudmVydGljZXM7XHJcbiAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnZlcnRpY2VzO1xyXG5cclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGROb3JtYWwgOiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgIHZhciBzcmMgPSB0aGlzLm5vcm1hbHM7XHJcbiAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5Lm5vcm1hbHM7XHJcblxyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDIgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDIgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDIgXSApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZFVWOiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudXZzO1xyXG5cclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGRVVkxpbmU6IGZ1bmN0aW9uICggYSApIHtcclxuXHJcbiAgICAgICAgdmFyIHNyYyA9IHRoaXMudXZzO1xyXG4gICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkRmFjZTogZnVuY3Rpb24gKCBhLCBiLCBjLCBkLCB1YSwgdWIsIHVjLCB1ZCwgbmEsIG5iLCBuYywgbmQgKSB7XHJcblxyXG4gICAgICAgIHZhciB2TGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHZhciBpYSA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYSwgdkxlbiApO1xyXG4gICAgICAgIHZhciBpYiA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYiwgdkxlbiApO1xyXG4gICAgICAgIHZhciBpYyA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYywgdkxlbiApO1xyXG4gICAgICAgIHZhciBpZDtcclxuXHJcbiAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICBpZCA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggZCwgdkxlbiApO1xyXG5cclxuICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYSwgaWIsIGlkICk7XHJcbiAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggdWEgIT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICB2YXIgdXZMZW4gPSB0aGlzLnV2cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgaWEgPSB0aGlzLnBhcnNlVVZJbmRleCggdWEsIHV2TGVuICk7XHJcbiAgICAgICAgICBpYiA9IHRoaXMucGFyc2VVVkluZGV4KCB1YiwgdXZMZW4gKTtcclxuICAgICAgICAgIGljID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVjLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRVViggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBpZCA9IHRoaXMucGFyc2VVVkluZGV4KCB1ZCwgdXZMZW4gKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkVVYoIGlhLCBpYiwgaWQgKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRVViggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIG5hICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgLy8gTm9ybWFscyBhcmUgbWFueSB0aW1lcyB0aGUgc2FtZS4gSWYgc28sIHNraXAgZnVuY3Rpb24gY2FsbCBhbmQgcGFyc2VJbnQuXHJcbiAgICAgICAgICB2YXIgbkxlbiA9IHRoaXMubm9ybWFscy5sZW5ndGg7XHJcbiAgICAgICAgICBpYSA9IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmEsIG5MZW4gKTtcclxuXHJcbiAgICAgICAgICBpYiA9IG5hID09PSBuYiA/IGlhIDogdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYiwgbkxlbiApO1xyXG4gICAgICAgICAgaWMgPSBuYSA9PT0gbmMgPyBpYSA6IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmMsIG5MZW4gKTtcclxuXHJcbiAgICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkTm9ybWFsKCBpYSwgaWIsIGljICk7XHJcblxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuZCwgbkxlbiApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGlhLCBpYiwgaWQgKTtcclxuICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGliLCBpYywgaWQgKTtcclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGRMaW5lR2VvbWV0cnk6IGZ1bmN0aW9uICggdmVydGljZXMsIHV2cyApIHtcclxuXHJcbiAgICAgICAgdGhpcy5vYmplY3QuZ2VvbWV0cnkudHlwZSA9ICdMaW5lJztcclxuXHJcbiAgICAgICAgdmFyIHZMZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuICAgICAgICB2YXIgdXZMZW4gPSB0aGlzLnV2cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAoIHZhciB2aSA9IDAsIGwgPSB2ZXJ0aWNlcy5sZW5ndGg7IHZpIDwgbDsgdmkgKysgKSB7XHJcblxyXG4gICAgICAgICAgdGhpcy5hZGRWZXJ0ZXhMaW5lKCB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIHZlcnRpY2VzWyB2aSBdLCB2TGVuICkgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKCB2YXIgdXZpID0gMCwgbCA9IHV2cy5sZW5ndGg7IHV2aSA8IGw7IHV2aSArKyApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLmFkZFVWTGluZSggdGhpcy5wYXJzZVVWSW5kZXgoIHV2c1sgdXZpIF0sIHV2TGVuICkgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgc3RhdGUuc3RhcnRPYmplY3QoICcnLCBmYWxzZSApO1xyXG5cclxuICAgIHJldHVybiBzdGF0ZTtcclxuXHJcbiAgfSxcclxuXHJcbiAgcGFyc2U6IGZ1bmN0aW9uICggdGV4dCApIHtcclxuXHJcbiAgICBjb25zb2xlLnRpbWUoICdPQkpMb2FkZXInICk7XHJcblxyXG4gICAgdmFyIHN0YXRlID0gdGhpcy5fY3JlYXRlUGFyc2VyU3RhdGUoKTtcclxuXHJcbiAgICBpZiAoIHRleHQuaW5kZXhPZiggJ1xcclxcbicgKSAhPT0gLSAxICkge1xyXG5cclxuICAgICAgLy8gVGhpcyBpcyBmYXN0ZXIgdGhhbiBTdHJpbmcuc3BsaXQgd2l0aCByZWdleCB0aGF0IHNwbGl0cyBvbiBib3RoXHJcbiAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoICdcXHJcXG4nLCAnXFxuJyApO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGluZXMgPSB0ZXh0LnNwbGl0KCAnXFxuJyApO1xyXG4gICAgdmFyIGxpbmUgPSAnJywgbGluZUZpcnN0Q2hhciA9ICcnLCBsaW5lU2Vjb25kQ2hhciA9ICcnO1xyXG4gICAgdmFyIGxpbmVMZW5ndGggPSAwO1xyXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIC8vIEZhc3RlciB0byBqdXN0IHRyaW0gbGVmdCBzaWRlIG9mIHRoZSBsaW5lLiBVc2UgaWYgYXZhaWxhYmxlLlxyXG4gICAgdmFyIHRyaW1MZWZ0ID0gKCB0eXBlb2YgJycudHJpbUxlZnQgPT09ICdmdW5jdGlvbicgKTtcclxuXHJcbiAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgbGluZSA9IGxpbmVzWyBpIF07XHJcblxyXG4gICAgICBsaW5lID0gdHJpbUxlZnQgPyBsaW5lLnRyaW1MZWZ0KCkgOiBsaW5lLnRyaW0oKTtcclxuXHJcbiAgICAgIGxpbmVMZW5ndGggPSBsaW5lLmxlbmd0aDtcclxuXHJcbiAgICAgIGlmICggbGluZUxlbmd0aCA9PT0gMCApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgbGluZUZpcnN0Q2hhciA9IGxpbmUuY2hhckF0KCAwICk7XHJcblxyXG4gICAgICAvLyBAdG9kbyBpbnZva2UgcGFzc2VkIGluIGhhbmRsZXIgaWYgYW55XHJcbiAgICAgIGlmICggbGluZUZpcnN0Q2hhciA9PT0gJyMnICkgY29udGludWU7XHJcblxyXG4gICAgICBpZiAoIGxpbmVGaXJzdENoYXIgPT09ICd2JyApIHtcclxuXHJcbiAgICAgICAgbGluZVNlY29uZENoYXIgPSBsaW5lLmNoYXJBdCggMSApO1xyXG5cclxuICAgICAgICBpZiAoIGxpbmVTZWNvbmRDaGFyID09PSAnICcgJiYgKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC52ZXJ0ZXhfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAgIDIgICAgICAzXHJcbiAgICAgICAgICAvLyBbXCJ2IDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcblxyXG4gICAgICAgICAgc3RhdGUudmVydGljZXMucHVzaChcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICduJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm5vcm1hbF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAgMSAgICAgIDIgICAgICAzXHJcbiAgICAgICAgICAvLyBbXCJ2biAxLjAgMi4wIDMuMFwiLCBcIjEuMFwiLCBcIjIuMFwiLCBcIjMuMFwiXVxyXG5cclxuICAgICAgICAgIHN0YXRlLm5vcm1hbHMucHVzaChcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICd0JyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnV2X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgIDEgICAgICAyXHJcbiAgICAgICAgICAvLyBbXCJ2dCAwLjEgMC4yXCIsIFwiMC4xXCIsIFwiMC4yXCJdXHJcblxyXG4gICAgICAgICAgc3RhdGUudXZzLnB1c2goXHJcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMSBdICksXHJcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMiBdIClcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIlVuZXhwZWN0ZWQgdmVydGV4L25vcm1hbC91diBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwiZlwiICkge1xyXG5cclxuICAgICAgICBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfdXZfbm9ybWFsLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAgICAgICAxICAgIDIgICAgMyAgICA0ICAgIDUgICAgNiAgICA3ICAgIDggICAgOSAgIDEwICAgICAgICAgMTEgICAgICAgICAxMlxyXG4gICAgICAgICAgLy8gW1wiZiAxLzEvMSAyLzIvMiAzLzMvM1wiLCBcIjFcIiwgXCIxXCIsIFwiMVwiLCBcIjJcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDQgXSwgcmVzdWx0WyA3IF0sIHJlc3VsdFsgMTAgXSxcclxuICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDggXSwgcmVzdWx0WyAxMSBdLFxyXG4gICAgICAgICAgICByZXN1bHRbIDMgXSwgcmVzdWx0WyA2IF0sIHJlc3VsdFsgOSBdLCByZXN1bHRbIDEyIF1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfdXYuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYgdmVydGV4L3V2IHZlcnRleC91dlxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgIDEgICAgMiAgICAzICAgIDQgICAgNSAgICA2ICAgNyAgICAgICAgICA4XHJcbiAgICAgICAgICAvLyBbXCJmIDEvMSAyLzIgMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgNyBdLFxyXG4gICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA0IF0sIHJlc3VsdFsgNiBdLCByZXN1bHRbIDggXVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gZiB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbFxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAgIDEgICAgMiAgICAzICAgIDQgICAgNSAgICA2ICAgNyAgICAgICAgICA4XHJcbiAgICAgICAgICAvLyBbXCJmIDEvLzEgMi8vMiAzLy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgNyBdLFxyXG4gICAgICAgICAgICB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMiBdLCByZXN1bHRbIDQgXSwgcmVzdWx0WyA2IF0sIHJlc3VsdFsgOCBdXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLmZhY2VfdmVydGV4LmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgICAgICAgIC8vIDAgICAgICAgICAgICAxICAgIDIgICAgMyAgIDRcclxuICAgICAgICAgIC8vIFtcImYgMSAyIDNcIiwgXCIxXCIsIFwiMlwiLCBcIjNcIiwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDIgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNCBdXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIGZhY2UgbGluZTogJ1wiICsgbGluZSAgKyBcIidcIiApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCBsaW5lRmlyc3RDaGFyID09PSBcImxcIiApIHtcclxuXHJcbiAgICAgICAgdmFyIGxpbmVQYXJ0cyA9IGxpbmUuc3Vic3RyaW5nKCAxICkudHJpbSgpLnNwbGl0KCBcIiBcIiApO1xyXG4gICAgICAgIHZhciBsaW5lVmVydGljZXMgPSBbXSwgbGluZVVWcyA9IFtdO1xyXG5cclxuICAgICAgICBpZiAoIGxpbmUuaW5kZXhPZiggXCIvXCIgKSA9PT0gLSAxICkge1xyXG5cclxuICAgICAgICAgIGxpbmVWZXJ0aWNlcyA9IGxpbmVQYXJ0cztcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICBmb3IgKCB2YXIgbGkgPSAwLCBsbGVuID0gbGluZVBhcnRzLmxlbmd0aDsgbGkgPCBsbGVuOyBsaSArKyApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IGxpbmVQYXJ0c1sgbGkgXS5zcGxpdCggXCIvXCIgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggcGFydHNbIDAgXSAhPT0gXCJcIiApIGxpbmVWZXJ0aWNlcy5wdXNoKCBwYXJ0c1sgMCBdICk7XHJcbiAgICAgICAgICAgIGlmICggcGFydHNbIDEgXSAhPT0gXCJcIiApIGxpbmVVVnMucHVzaCggcGFydHNbIDEgXSApO1xyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0YXRlLmFkZExpbmVHZW9tZXRyeSggbGluZVZlcnRpY2VzLCBsaW5lVVZzICk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm9iamVjdF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAvLyBvIG9iamVjdF9uYW1lXHJcbiAgICAgICAgLy8gb3JcclxuICAgICAgICAvLyBnIGdyb3VwX25hbWVcclxuXHJcbiAgICAgICAgdmFyIG5hbWUgPSByZXN1bHRbIDAgXS5zdWJzdHIoIDEgKS50cmltKCk7XHJcbiAgICAgICAgc3RhdGUuc3RhcnRPYmplY3QoIG5hbWUgKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoIHRoaXMucmVnZXhwLm1hdGVyaWFsX3VzZV9wYXR0ZXJuLnRlc3QoIGxpbmUgKSApIHtcclxuXHJcbiAgICAgICAgLy8gbWF0ZXJpYWxcclxuXHJcbiAgICAgICAgc3RhdGUub2JqZWN0LnN0YXJ0TWF0ZXJpYWwoIGxpbmUuc3Vic3RyaW5nKCA3ICkudHJpbSgpLCBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcyApO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggdGhpcy5yZWdleHAubWF0ZXJpYWxfbGlicmFyeV9wYXR0ZXJuLnRlc3QoIGxpbmUgKSApIHtcclxuXHJcbiAgICAgICAgLy8gbXRsIGZpbGVcclxuXHJcbiAgICAgICAgc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMucHVzaCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCkgKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuc21vb3RoaW5nX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgIC8vIHNtb290aCBzaGFkaW5nXHJcblxyXG4gICAgICAgIC8vIEB0b2RvIEhhbmRsZSBmaWxlcyB0aGF0IGhhdmUgdmFyeWluZyBzbW9vdGggdmFsdWVzIGZvciBhIHNldCBvZiBmYWNlcyBpbnNpZGUgb25lIGdlb21ldHJ5LFxyXG4gICAgICAgIC8vIGJ1dCBkb2VzIG5vdCBkZWZpbmUgYSB1c2VtdGwgZm9yIGVhY2ggZmFjZSBzZXQuXHJcbiAgICAgICAgLy8gVGhpcyBzaG91bGQgYmUgZGV0ZWN0ZWQgYW5kIGEgZHVtbXkgbWF0ZXJpYWwgY3JlYXRlZCAobGF0ZXIgTXVsdGlNYXRlcmlhbCBhbmQgZ2VvbWV0cnkgZ3JvdXBzKS5cclxuICAgICAgICAvLyBUaGlzIHJlcXVpcmVzIHNvbWUgY2FyZSB0byBub3QgY3JlYXRlIGV4dHJhIG1hdGVyaWFsIG9uIGVhY2ggc21vb3RoIHZhbHVlIGZvciBcIm5vcm1hbFwiIG9iaiBmaWxlcy5cclxuICAgICAgICAvLyB3aGVyZSBleHBsaWNpdCB1c2VtdGwgZGVmaW5lcyBnZW9tZXRyeSBncm91cHMuXHJcbiAgICAgICAgLy8gRXhhbXBsZSBhc3NldDogZXhhbXBsZXMvbW9kZWxzL29iai9jZXJiZXJ1cy9DZXJiZXJ1cy5vYmpcclxuXHJcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0WyAxIF0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgc3RhdGUub2JqZWN0LnNtb290aCA9ICggdmFsdWUgPT09ICcxJyB8fCB2YWx1ZSA9PT0gJ29uJyApO1xyXG5cclxuICAgICAgICB2YXIgbWF0ZXJpYWwgPSBzdGF0ZS5vYmplY3QuY3VycmVudE1hdGVyaWFsKCk7XHJcbiAgICAgICAgaWYgKCBtYXRlcmlhbCApIHtcclxuXHJcbiAgICAgICAgICBtYXRlcmlhbC5zbW9vdGggPSBzdGF0ZS5vYmplY3Quc21vb3RoO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBIYW5kbGUgbnVsbCB0ZXJtaW5hdGVkIGZpbGVzIHdpdGhvdXQgZXhjZXB0aW9uXHJcbiAgICAgICAgaWYgKCBsaW5lID09PSAnXFwwJyApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlLmZpbmFsaXplKCk7XHJcblxyXG4gICAgdmFyIGNvbnRhaW5lciA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgY29udGFpbmVyLm1hdGVyaWFsTGlicmFyaWVzID0gW10uY29uY2F0KCBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcyApO1xyXG5cclxuICAgIGZvciAoIHZhciBpID0gMCwgbCA9IHN0YXRlLm9iamVjdHMubGVuZ3RoOyBpIDwgbDsgaSArKyApIHtcclxuXHJcbiAgICAgIHZhciBvYmplY3QgPSBzdGF0ZS5vYmplY3RzWyBpIF07XHJcbiAgICAgIHZhciBnZW9tZXRyeSA9IG9iamVjdC5nZW9tZXRyeTtcclxuICAgICAgdmFyIG1hdGVyaWFscyA9IG9iamVjdC5tYXRlcmlhbHM7XHJcbiAgICAgIHZhciBpc0xpbmUgPSAoIGdlb21ldHJ5LnR5cGUgPT09ICdMaW5lJyApO1xyXG5cclxuICAgICAgLy8gU2tpcCBvL2cgbGluZSBkZWNsYXJhdGlvbnMgdGhhdCBkaWQgbm90IGZvbGxvdyB3aXRoIGFueSBmYWNlc1xyXG4gICAgICBpZiAoIGdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aCA9PT0gMCApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgdmFyIGJ1ZmZlcmdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XHJcblxyXG4gICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICdwb3NpdGlvbicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5LnZlcnRpY2VzICksIDMgKSApO1xyXG5cclxuICAgICAgaWYgKCBnZW9tZXRyeS5ub3JtYWxzLmxlbmd0aCA+IDAgKSB7XHJcblxyXG4gICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ25vcm1hbCcsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5Lm5vcm1hbHMgKSwgMyApICk7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBidWZmZXJnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCBnZW9tZXRyeS51dnMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCAndXYnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCBuZXcgRmxvYXQzMkFycmF5KCBnZW9tZXRyeS51dnMgKSwgMiApICk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDcmVhdGUgbWF0ZXJpYWxzXHJcblxyXG4gICAgICB2YXIgY3JlYXRlZE1hdGVyaWFscyA9IFtdO1xyXG5cclxuICAgICAgZm9yICggdmFyIG1pID0gMCwgbWlMZW4gPSBtYXRlcmlhbHMubGVuZ3RoOyBtaSA8IG1pTGVuIDsgbWkrKyApIHtcclxuXHJcbiAgICAgICAgdmFyIHNvdXJjZU1hdGVyaWFsID0gbWF0ZXJpYWxzW21pXTtcclxuICAgICAgICB2YXIgbWF0ZXJpYWwgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHMgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgbWF0ZXJpYWwgPSB0aGlzLm1hdGVyaWFscy5jcmVhdGUoIHNvdXJjZU1hdGVyaWFsLm5hbWUgKTtcclxuXHJcbiAgICAgICAgICAvLyBtdGwgZXRjLiBsb2FkZXJzIHByb2JhYmx5IGNhbid0IGNyZWF0ZSBsaW5lIG1hdGVyaWFscyBjb3JyZWN0bHksIGNvcHkgcHJvcGVydGllcyB0byBhIGxpbmUgbWF0ZXJpYWwuXHJcbiAgICAgICAgICBpZiAoIGlzTGluZSAmJiBtYXRlcmlhbCAmJiAhICggbWF0ZXJpYWwgaW5zdGFuY2VvZiBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCApICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsTGluZSA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICBtYXRlcmlhbExpbmUuY29weSggbWF0ZXJpYWwgKTtcclxuICAgICAgICAgICAgbWF0ZXJpYWwgPSBtYXRlcmlhbExpbmU7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggISBtYXRlcmlhbCApIHtcclxuXHJcbiAgICAgICAgICBtYXRlcmlhbCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoKSA6IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCgpICk7XHJcbiAgICAgICAgICBtYXRlcmlhbC5uYW1lID0gc291cmNlTWF0ZXJpYWwubmFtZTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXRlcmlhbC5zaGFkaW5nID0gc291cmNlTWF0ZXJpYWwuc21vb3RoID8gVEhSRUUuU21vb3RoU2hhZGluZyA6IFRIUkVFLkZsYXRTaGFkaW5nO1xyXG5cclxuICAgICAgICBjcmVhdGVkTWF0ZXJpYWxzLnB1c2gobWF0ZXJpYWwpO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ3JlYXRlIG1lc2hcclxuXHJcbiAgICAgIHZhciBtZXNoO1xyXG5cclxuICAgICAgaWYgKCBjcmVhdGVkTWF0ZXJpYWxzLmxlbmd0aCA+IDEgKSB7XHJcblxyXG4gICAgICAgIGZvciAoIHZhciBtaSA9IDAsIG1pTGVuID0gbWF0ZXJpYWxzLmxlbmd0aDsgbWkgPCBtaUxlbiA7IG1pKysgKSB7XHJcblxyXG4gICAgICAgICAgdmFyIHNvdXJjZU1hdGVyaWFsID0gbWF0ZXJpYWxzW21pXTtcclxuICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEdyb3VwKCBzb3VyY2VNYXRlcmlhbC5ncm91cFN0YXJ0LCBzb3VyY2VNYXRlcmlhbC5ncm91cENvdW50LCBtaSApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBtdWx0aU1hdGVyaWFsID0gbmV3IFRIUkVFLk11bHRpTWF0ZXJpYWwoIGNyZWF0ZWRNYXRlcmlhbHMgKTtcclxuICAgICAgICBtZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgbXVsdGlNYXRlcmlhbCApIDogbmV3IFRIUkVFLkxpbmUoIGJ1ZmZlcmdlb21ldHJ5LCBtdWx0aU1hdGVyaWFsICkgKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIG1lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzWyAwIF0gKSA6IG5ldyBUSFJFRS5MaW5lKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFsc1sgMCBdICkgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbWVzaC5uYW1lID0gb2JqZWN0Lm5hbWU7XHJcblxyXG4gICAgICBjb250YWluZXIuYWRkKCBtZXNoICk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUudGltZUVuZCggJ09CSkxvYWRlcicgKTtcclxuXHJcbiAgICByZXR1cm4gY29udGFpbmVyO1xyXG5cclxuICB9XHJcblxyXG59OyIsIlRIUkVFLlZpdmVDb250cm9sbGVyID0gZnVuY3Rpb24gKCBpZCApIHtcclxuXHJcbiAgVEhSRUUuT2JqZWN0M0QuY2FsbCggdGhpcyApO1xyXG5cclxuICB0aGlzLm1hdHJpeEF1dG9VcGRhdGUgPSBmYWxzZTtcclxuICB0aGlzLnN0YW5kaW5nTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcclxuXHJcbiAgdmFyIHNjb3BlID0gdGhpcztcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG5cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSggdXBkYXRlICk7XHJcblxyXG4gICAgdmFyIGdhbWVwYWQgPSBuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMoKVsgaWQgXTtcclxuXHJcbiAgICBpZiAoIGdhbWVwYWQgIT09IHVuZGVmaW5lZCAmJiBnYW1lcGFkLnBvc2UgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICB2YXIgcG9zZSA9IGdhbWVwYWQucG9zZTtcclxuXHJcbiAgICAgIHNjb3BlLnBvc2l0aW9uLmZyb21BcnJheSggcG9zZS5wb3NpdGlvbiApO1xyXG4gICAgICBzY29wZS5xdWF0ZXJuaW9uLmZyb21BcnJheSggcG9zZS5vcmllbnRhdGlvbiApO1xyXG4gICAgICBzY29wZS5tYXRyaXguY29tcG9zZSggc2NvcGUucG9zaXRpb24sIHNjb3BlLnF1YXRlcm5pb24sIHNjb3BlLnNjYWxlICk7XHJcbiAgICAgIHNjb3BlLm1hdHJpeC5tdWx0aXBseU1hdHJpY2VzKCBzY29wZS5zdGFuZGluZ01hdHJpeCwgc2NvcGUubWF0cml4ICk7XHJcbiAgICAgIHNjb3BlLm1hdHJpeFdvcmxkTmVlZHNVcGRhdGUgPSB0cnVlO1xyXG5cclxuICAgICAgc2NvcGUudmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIHNjb3BlLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk7XHJcblxyXG59O1xyXG5cclxuVEhSRUUuVml2ZUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVEhSRUUuT2JqZWN0M0QucHJvdG90eXBlICk7XHJcblRIUkVFLlZpdmVDb250cm9sbGVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRIUkVFLlZpdmVDb250cm9sbGVyOyIsIi8qKlxuICogQGF1dGhvciBkbWFyY29zIC8gaHR0cHM6Ly9naXRodWIuY29tL2RtYXJjb3NcbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb21cbiAqL1xuXG5USFJFRS5WUkNvbnRyb2xzID0gZnVuY3Rpb24gKCBvYmplY3QsIG9uRXJyb3IgKSB7XG5cblx0dmFyIHNjb3BlID0gdGhpcztcblxuXHR2YXIgdnJEaXNwbGF5LCB2ckRpc3BsYXlzO1xuXG5cdHZhciBzdGFuZGluZ01hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XG5cblx0ZnVuY3Rpb24gZ290VlJEaXNwbGF5cyggZGlzcGxheXMgKSB7XG5cblx0XHR2ckRpc3BsYXlzID0gZGlzcGxheXM7XG5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBkaXNwbGF5cy5sZW5ndGg7IGkgKysgKSB7XG5cblx0XHRcdGlmICggKCAnVlJEaXNwbGF5JyBpbiB3aW5kb3cgJiYgZGlzcGxheXNbIGkgXSBpbnN0YW5jZW9mIFZSRGlzcGxheSApIHx8XG5cdFx0XHRcdCAoICdQb3NpdGlvblNlbnNvclZSRGV2aWNlJyBpbiB3aW5kb3cgJiYgZGlzcGxheXNbIGkgXSBpbnN0YW5jZW9mIFBvc2l0aW9uU2Vuc29yVlJEZXZpY2UgKSApIHtcblxuXHRcdFx0XHR2ckRpc3BsYXkgPSBkaXNwbGF5c1sgaSBdO1xuXHRcdFx0XHRicmVhazsgIC8vIFdlIGtlZXAgdGhlIGZpcnN0IHdlIGVuY291bnRlclxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZiAoIHZyRGlzcGxheSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRpZiAoIG9uRXJyb3IgKSBvbkVycm9yKCAnVlIgaW5wdXQgbm90IGF2YWlsYWJsZS4nICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGlmICggbmF2aWdhdG9yLmdldFZSRGlzcGxheXMgKSB7XG5cblx0XHRuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cygpLnRoZW4oIGdvdFZSRGlzcGxheXMgKTtcblxuXHR9IGVsc2UgaWYgKCBuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzICkge1xuXG5cdFx0Ly8gRGVwcmVjYXRlZCBBUEkuXG5cdFx0bmF2aWdhdG9yLmdldFZSRGV2aWNlcygpLnRoZW4oIGdvdFZSRGlzcGxheXMgKTtcblxuXHR9XG5cblx0Ly8gdGhlIFJpZnQgU0RLIHJldHVybnMgdGhlIHBvc2l0aW9uIGluIG1ldGVyc1xuXHQvLyB0aGlzIHNjYWxlIGZhY3RvciBhbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIGhvdyBtZXRlcnNcblx0Ly8gYXJlIGNvbnZlcnRlZCB0byBzY2VuZSB1bml0cy5cblxuXHR0aGlzLnNjYWxlID0gMTtcblxuXHQvLyBJZiB0cnVlIHdpbGwgdXNlIFwic3RhbmRpbmcgc3BhY2VcIiBjb29yZGluYXRlIHN5c3RlbSB3aGVyZSB5PTAgaXMgdGhlXG5cdC8vIGZsb29yIGFuZCB4PTAsIHo9MCBpcyB0aGUgY2VudGVyIG9mIHRoZSByb29tLlxuXHR0aGlzLnN0YW5kaW5nID0gZmFsc2U7XG5cblx0Ly8gRGlzdGFuY2UgZnJvbSB0aGUgdXNlcnMgZXllcyB0byB0aGUgZmxvb3IgaW4gbWV0ZXJzLiBVc2VkIHdoZW5cblx0Ly8gc3RhbmRpbmc9dHJ1ZSBidXQgdGhlIFZSRGlzcGxheSBkb2Vzbid0IHByb3ZpZGUgc3RhZ2VQYXJhbWV0ZXJzLlxuXHR0aGlzLnVzZXJIZWlnaHQgPSAxLjY7XG5cblx0dGhpcy5nZXRWUkRpc3BsYXkgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdnJEaXNwbGF5O1xuXG5cdH07XG5cblx0dGhpcy5nZXRWUkRpc3BsYXlzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHZyRGlzcGxheXM7XG5cblx0fTtcblxuXHR0aGlzLmdldFN0YW5kaW5nTWF0cml4ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHN0YW5kaW5nTWF0cml4O1xuXG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIHZyRGlzcGxheSApIHtcblxuXHRcdFx0aWYgKCB2ckRpc3BsYXkuZ2V0UG9zZSApIHtcblxuXHRcdFx0XHR2YXIgcG9zZSA9IHZyRGlzcGxheS5nZXRQb3NlKCk7XG5cblx0XHRcdFx0aWYgKCBwb3NlLm9yaWVudGF0aW9uICE9PSBudWxsICkge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnF1YXRlcm5pb24uZnJvbUFycmF5KCBwb3NlLm9yaWVudGF0aW9uICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcG9zZS5wb3NpdGlvbiAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdG9iamVjdC5wb3NpdGlvbi5mcm9tQXJyYXkoIHBvc2UucG9zaXRpb24gKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnBvc2l0aW9uLnNldCggMCwgMCwgMCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBEZXByZWNhdGVkIEFQSS5cblx0XHRcdFx0dmFyIHN0YXRlID0gdnJEaXNwbGF5LmdldFN0YXRlKCk7XG5cblx0XHRcdFx0aWYgKCBzdGF0ZS5vcmllbnRhdGlvbiAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdG9iamVjdC5xdWF0ZXJuaW9uLmNvcHkoIHN0YXRlLm9yaWVudGF0aW9uICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggc3RhdGUucG9zaXRpb24gIT09IG51bGwgKSB7XG5cblx0XHRcdFx0XHRvYmplY3QucG9zaXRpb24uY29weSggc3RhdGUucG9zaXRpb24gKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnBvc2l0aW9uLnNldCggMCwgMCwgMCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHRoaXMuc3RhbmRpbmcgKSB7XG5cblx0XHRcdFx0aWYgKCB2ckRpc3BsYXkuc3RhZ2VQYXJhbWV0ZXJzICkge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnVwZGF0ZU1hdHJpeCgpO1xuXG5cdFx0XHRcdFx0c3RhbmRpbmdNYXRyaXguZnJvbUFycmF5KCB2ckRpc3BsYXkuc3RhZ2VQYXJhbWV0ZXJzLnNpdHRpbmdUb1N0YW5kaW5nVHJhbnNmb3JtICk7XG5cdFx0XHRcdFx0b2JqZWN0LmFwcGx5TWF0cml4KCBzdGFuZGluZ01hdHJpeCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRvYmplY3QucG9zaXRpb24uc2V0WSggb2JqZWN0LnBvc2l0aW9uLnkgKyB0aGlzLnVzZXJIZWlnaHQgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0b2JqZWN0LnBvc2l0aW9uLm11bHRpcGx5U2NhbGFyKCBzY29wZS5zY2FsZSApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5yZXNldFBvc2UgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIHZyRGlzcGxheSApIHtcblxuXHRcdFx0aWYgKCB2ckRpc3BsYXkucmVzZXRQb3NlICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0dnJEaXNwbGF5LnJlc2V0UG9zZSgpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCB2ckRpc3BsYXkucmVzZXRTZW5zb3IgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHQvLyBEZXByZWNhdGVkIEFQSS5cblx0XHRcdFx0dnJEaXNwbGF5LnJlc2V0U2Vuc29yKCk7XG5cblx0XHRcdH0gZWxzZSBpZiAoIHZyRGlzcGxheS56ZXJvU2Vuc29yICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0Ly8gUmVhbGx5IGRlcHJlY2F0ZWQgQVBJLlxuXHRcdFx0XHR2ckRpc3BsYXkuemVyb1NlbnNvcigpO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLnJlc2V0U2Vuc29yID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0Y29uc29sZS53YXJuKCAnVEhSRUUuVlJDb250cm9sczogLnJlc2V0U2Vuc29yKCkgaXMgbm93IC5yZXNldFBvc2UoKS4nICk7XG5cdFx0dGhpcy5yZXNldFBvc2UoKTtcblxuXHR9O1xuXG5cdHRoaXMuemVyb1NlbnNvciA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGNvbnNvbGUud2FybiggJ1RIUkVFLlZSQ29udHJvbHM6IC56ZXJvU2Vuc29yKCkgaXMgbm93IC5yZXNldFBvc2UoKS4nICk7XG5cdFx0dGhpcy5yZXNldFBvc2UoKTtcblxuXHR9O1xuXG5cdHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHZyRGlzcGxheSA9IG51bGw7XG5cblx0fTtcblxufTtcbiIsIi8qKlxuICogQGF1dGhvciBkbWFyY29zIC8gaHR0cHM6Ly9naXRodWIuY29tL2RtYXJjb3NcbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb21cbiAqXG4gKiBXZWJWUiBTcGVjOiBodHRwOi8vbW96dnIuZ2l0aHViLmlvL3dlYnZyLXNwZWMvd2VidnIuaHRtbFxuICpcbiAqIEZpcmVmb3g6IGh0dHA6Ly9tb3p2ci5jb20vZG93bmxvYWRzL1xuICogQ2hyb21pdW06IGh0dHBzOi8vZHJpdmUuZ29vZ2xlLmNvbS9mb2xkZXJ2aWV3P2lkPTBCenVkTHQyMkJxR1JiVzlXVEhNdE9XTXpOalEmdXNwPXNoYXJpbmcjbGlzdFxuICpcbiAqL1xuXG5USFJFRS5WUkVmZmVjdCA9IGZ1bmN0aW9uICggcmVuZGVyZXIsIG9uRXJyb3IgKSB7XG5cblx0dmFyIGlzV2ViVlIxID0gdHJ1ZTtcblxuXHR2YXIgdnJEaXNwbGF5LCB2ckRpc3BsYXlzO1xuXHR2YXIgZXllVHJhbnNsYXRpb25MID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblx0dmFyIGV5ZVRyYW5zbGF0aW9uUiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cdHZhciByZW5kZXJSZWN0TCwgcmVuZGVyUmVjdFI7XG5cdHZhciBleWVGT1ZMLCBleWVGT1ZSO1xuXG5cdGZ1bmN0aW9uIGdvdFZSRGlzcGxheXMoIGRpc3BsYXlzICkge1xuXG5cdFx0dnJEaXNwbGF5cyA9IGRpc3BsYXlzO1xuXG5cdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgZGlzcGxheXMubGVuZ3RoOyBpICsrICkge1xuXG5cdFx0XHRpZiAoICdWUkRpc3BsYXknIGluIHdpbmRvdyAmJiBkaXNwbGF5c1sgaSBdIGluc3RhbmNlb2YgVlJEaXNwbGF5ICkge1xuXG5cdFx0XHRcdHZyRGlzcGxheSA9IGRpc3BsYXlzWyBpIF07XG5cdFx0XHRcdGlzV2ViVlIxID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7IC8vIFdlIGtlZXAgdGhlIGZpcnN0IHdlIGVuY291bnRlclxuXG5cdFx0XHR9IGVsc2UgaWYgKCAnSE1EVlJEZXZpY2UnIGluIHdpbmRvdyAmJiBkaXNwbGF5c1sgaSBdIGluc3RhbmNlb2YgSE1EVlJEZXZpY2UgKSB7XG5cblx0XHRcdFx0dnJEaXNwbGF5ID0gZGlzcGxheXNbIGkgXTtcblx0XHRcdFx0aXNXZWJWUjEgPSBmYWxzZTtcblx0XHRcdFx0YnJlYWs7IC8vIFdlIGtlZXAgdGhlIGZpcnN0IHdlIGVuY291bnRlclxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZiAoIHZyRGlzcGxheSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRpZiAoIG9uRXJyb3IgKSBvbkVycm9yKCAnSE1EIG5vdCBhdmFpbGFibGUnICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGlmICggbmF2aWdhdG9yLmdldFZSRGlzcGxheXMgKSB7XG5cblx0XHRuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cygpLnRoZW4oIGdvdFZSRGlzcGxheXMgKTtcblxuXHR9IGVsc2UgaWYgKCBuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzICkge1xuXG5cdFx0Ly8gRGVwcmVjYXRlZCBBUEkuXG5cdFx0bmF2aWdhdG9yLmdldFZSRGV2aWNlcygpLnRoZW4oIGdvdFZSRGlzcGxheXMgKTtcblxuXHR9XG5cblx0Ly9cblxuXHR0aGlzLmlzUHJlc2VudGluZyA9IGZhbHNlO1xuXHR0aGlzLnNjYWxlID0gMTtcblxuXHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdHZhciByZW5kZXJlclNpemUgPSByZW5kZXJlci5nZXRTaXplKCk7XG5cdHZhciByZW5kZXJlclBpeGVsUmF0aW8gPSByZW5kZXJlci5nZXRQaXhlbFJhdGlvKCk7XG5cblx0dGhpcy5nZXRWUkRpc3BsYXkgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdnJEaXNwbGF5O1xuXG5cdH07XG5cblx0dGhpcy5nZXRWUkRpc3BsYXlzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHZyRGlzcGxheXM7XG5cblx0fTtcblxuXHR0aGlzLnNldFNpemUgPSBmdW5jdGlvbiAoIHdpZHRoLCBoZWlnaHQgKSB7XG5cblx0XHRyZW5kZXJlclNpemUgPSB7IHdpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHQgfTtcblxuXHRcdGlmICggc2NvcGUuaXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHR2YXIgZXllUGFyYW1zTCA9IHZyRGlzcGxheS5nZXRFeWVQYXJhbWV0ZXJzKCAnbGVmdCcgKTtcblx0XHRcdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8oIDEgKTtcblxuXHRcdFx0aWYgKCBpc1dlYlZSMSApIHtcblxuXHRcdFx0XHRyZW5kZXJlci5zZXRTaXplKCBleWVQYXJhbXNMLnJlbmRlcldpZHRoICogMiwgZXllUGFyYW1zTC5yZW5kZXJIZWlnaHQsIGZhbHNlICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0cmVuZGVyZXIuc2V0U2l6ZSggZXllUGFyYW1zTC5yZW5kZXJSZWN0LndpZHRoICogMiwgZXllUGFyYW1zTC5yZW5kZXJSZWN0LmhlaWdodCwgZmFsc2UgKTtcblxuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0cmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyggcmVuZGVyZXJQaXhlbFJhdGlvICk7XG5cdFx0XHRyZW5kZXJlci5zZXRTaXplKCB3aWR0aCwgaGVpZ2h0ICk7XG5cblx0XHR9XG5cblx0fTtcblxuXHQvLyBmdWxsc2NyZWVuXG5cblx0dmFyIGNhbnZhcyA9IHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG5cdHZhciByZXF1ZXN0RnVsbHNjcmVlbjtcblx0dmFyIGV4aXRGdWxsc2NyZWVuO1xuXHR2YXIgZnVsbHNjcmVlbkVsZW1lbnQ7XG5cdHZhciBsZWZ0Qm91bmRzID0gWyAwLjAsIDAuMCwgMC41LCAxLjAgXTtcblx0dmFyIHJpZ2h0Qm91bmRzID0gWyAwLjUsIDAuMCwgMC41LCAxLjAgXTtcblxuXHRmdW5jdGlvbiBvbkZ1bGxzY3JlZW5DaGFuZ2UgKCkge1xuXG5cdFx0dmFyIHdhc1ByZXNlbnRpbmcgPSBzY29wZS5pc1ByZXNlbnRpbmc7XG5cdFx0c2NvcGUuaXNQcmVzZW50aW5nID0gdnJEaXNwbGF5ICE9PSB1bmRlZmluZWQgJiYgKCB2ckRpc3BsYXkuaXNQcmVzZW50aW5nIHx8ICggISBpc1dlYlZSMSAmJiBkb2N1bWVudFsgZnVsbHNjcmVlbkVsZW1lbnQgXSBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MRWxlbWVudCApICk7XG5cblx0XHRpZiAoIHNjb3BlLmlzUHJlc2VudGluZyApIHtcblxuXHRcdFx0dmFyIGV5ZVBhcmFtc0wgPSB2ckRpc3BsYXkuZ2V0RXllUGFyYW1ldGVycyggJ2xlZnQnICk7XG5cdFx0XHR2YXIgZXllV2lkdGgsIGV5ZUhlaWdodDtcblxuXHRcdFx0aWYgKCBpc1dlYlZSMSApIHtcblxuXHRcdFx0XHRleWVXaWR0aCA9IGV5ZVBhcmFtc0wucmVuZGVyV2lkdGg7XG5cdFx0XHRcdGV5ZUhlaWdodCA9IGV5ZVBhcmFtc0wucmVuZGVySGVpZ2h0O1xuXG5cdFx0XHRcdGlmICggdnJEaXNwbGF5LmdldExheWVycyApIHtcblxuXHRcdFx0XHRcdHZhciBsYXllcnMgPSB2ckRpc3BsYXkuZ2V0TGF5ZXJzKCk7XG5cdFx0XHRcdFx0aWYgKGxheWVycy5sZW5ndGgpIHtcblxuXHRcdFx0XHRcdFx0bGVmdEJvdW5kcyA9IGxheWVyc1swXS5sZWZ0Qm91bmRzIHx8IFsgMC4wLCAwLjAsIDAuNSwgMS4wIF07XG5cdFx0XHRcdFx0XHRyaWdodEJvdW5kcyA9IGxheWVyc1swXS5yaWdodEJvdW5kcyB8fCBbIDAuNSwgMC4wLCAwLjUsIDEuMCBdO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0ZXllV2lkdGggPSBleWVQYXJhbXNMLnJlbmRlclJlY3Qud2lkdGg7XG5cdFx0XHRcdGV5ZUhlaWdodCA9IGV5ZVBhcmFtc0wucmVuZGVyUmVjdC5oZWlnaHQ7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhd2FzUHJlc2VudGluZyApIHtcblxuXHRcdFx0XHRyZW5kZXJlclBpeGVsUmF0aW8gPSByZW5kZXJlci5nZXRQaXhlbFJhdGlvKCk7XG5cdFx0XHRcdHJlbmRlcmVyU2l6ZSA9IHJlbmRlcmVyLmdldFNpemUoKTtcblxuXHRcdFx0XHRyZW5kZXJlci5zZXRQaXhlbFJhdGlvKCAxICk7XG5cdFx0XHRcdHJlbmRlcmVyLnNldFNpemUoIGV5ZVdpZHRoICogMiwgZXllSGVpZ2h0LCBmYWxzZSApO1xuXG5cdFx0XHR9XG5cblx0XHR9IGVsc2UgaWYgKCB3YXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHRyZW5kZXJlci5zZXRQaXhlbFJhdGlvKCByZW5kZXJlclBpeGVsUmF0aW8gKTtcblx0XHRcdHJlbmRlcmVyLnNldFNpemUoIHJlbmRlcmVyU2l6ZS53aWR0aCwgcmVuZGVyZXJTaXplLmhlaWdodCApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRpZiAoIGNhbnZhcy5yZXF1ZXN0RnVsbHNjcmVlbiApIHtcblxuXHRcdHJlcXVlc3RGdWxsc2NyZWVuID0gJ3JlcXVlc3RGdWxsc2NyZWVuJztcblx0XHRmdWxsc2NyZWVuRWxlbWVudCA9ICdmdWxsc2NyZWVuRWxlbWVudCc7XG5cdFx0ZXhpdEZ1bGxzY3JlZW4gPSAnZXhpdEZ1bGxzY3JlZW4nO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdmdWxsc2NyZWVuY2hhbmdlJywgb25GdWxsc2NyZWVuQ2hhbmdlLCBmYWxzZSApO1xuXG5cdH0gZWxzZSBpZiAoIGNhbnZhcy5tb3pSZXF1ZXN0RnVsbFNjcmVlbiApIHtcblxuXHRcdHJlcXVlc3RGdWxsc2NyZWVuID0gJ21velJlcXVlc3RGdWxsU2NyZWVuJztcblx0XHRmdWxsc2NyZWVuRWxlbWVudCA9ICdtb3pGdWxsU2NyZWVuRWxlbWVudCc7XG5cdFx0ZXhpdEZ1bGxzY3JlZW4gPSAnbW96Q2FuY2VsRnVsbFNjcmVlbic7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vemZ1bGxzY3JlZW5jaGFuZ2UnLCBvbkZ1bGxzY3JlZW5DaGFuZ2UsIGZhbHNlICk7XG5cblx0fSBlbHNlIHtcblxuXHRcdHJlcXVlc3RGdWxsc2NyZWVuID0gJ3dlYmtpdFJlcXVlc3RGdWxsc2NyZWVuJztcblx0XHRmdWxsc2NyZWVuRWxlbWVudCA9ICd3ZWJraXRGdWxsc2NyZWVuRWxlbWVudCc7XG5cdFx0ZXhpdEZ1bGxzY3JlZW4gPSAnd2Via2l0RXhpdEZ1bGxzY3JlZW4nO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJywgb25GdWxsc2NyZWVuQ2hhbmdlLCBmYWxzZSApO1xuXG5cdH1cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3ZyZGlzcGxheXByZXNlbnRjaGFuZ2UnLCBvbkZ1bGxzY3JlZW5DaGFuZ2UsIGZhbHNlICk7XG5cblx0dGhpcy5zZXRGdWxsU2NyZWVuID0gZnVuY3Rpb24gKCBib29sZWFuICkge1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKCBmdW5jdGlvbiAoIHJlc29sdmUsIHJlamVjdCApIHtcblxuXHRcdFx0aWYgKCB2ckRpc3BsYXkgPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHRyZWplY3QoIG5ldyBFcnJvciggJ05vIFZSIGhhcmR3YXJlIGZvdW5kLicgKSApO1xuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBzY29wZS5pc1ByZXNlbnRpbmcgPT09IGJvb2xlYW4gKSB7XG5cblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBpc1dlYlZSMSApIHtcblxuXHRcdFx0XHRpZiAoIGJvb2xlYW4gKSB7XG5cblx0XHRcdFx0XHRyZXNvbHZlKCB2ckRpc3BsYXkucmVxdWVzdFByZXNlbnQoIFsgeyBzb3VyY2U6IGNhbnZhcyB9IF0gKSApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRyZXNvbHZlKCB2ckRpc3BsYXkuZXhpdFByZXNlbnQoKSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiAoIGNhbnZhc1sgcmVxdWVzdEZ1bGxzY3JlZW4gXSApIHtcblxuXHRcdFx0XHRcdGNhbnZhc1sgYm9vbGVhbiA/IHJlcXVlc3RGdWxsc2NyZWVuIDogZXhpdEZ1bGxzY3JlZW4gXSggeyB2ckRpc3BsYXk6IHZyRGlzcGxheSB9ICk7XG5cdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCAnTm8gY29tcGF0aWJsZSByZXF1ZXN0RnVsbHNjcmVlbiBtZXRob2QgZm91bmQuJyApO1xuXHRcdFx0XHRcdHJlamVjdCggbmV3IEVycm9yKCAnTm8gY29tcGF0aWJsZSByZXF1ZXN0RnVsbHNjcmVlbiBtZXRob2QgZm91bmQuJyApICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cblx0fTtcblxuXHR0aGlzLnJlcXVlc3RQcmVzZW50ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuc2V0RnVsbFNjcmVlbiggdHJ1ZSApO1xuXG5cdH07XG5cblx0dGhpcy5leGl0UHJlc2VudCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB0aGlzLnNldEZ1bGxTY3JlZW4oIGZhbHNlICk7XG5cblx0fTtcblxuXHR0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uICggZiApIHtcblxuXHRcdGlmICggaXNXZWJWUjEgJiYgdnJEaXNwbGF5ICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdHJldHVybiB2ckRpc3BsYXkucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBmICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRyZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggZiApO1xuXG5cdFx0fVxuXG5cdH07XG5cdFxuXHR0aGlzLmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKCBoICkge1xuXG5cdFx0aWYgKCBpc1dlYlZSMSAmJiB2ckRpc3BsYXkgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0dnJEaXNwbGF5LmNhbmNlbEFuaW1hdGlvbkZyYW1lKCBoICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoIGggKTtcblxuXHRcdH1cblxuXHR9O1xuXHRcblx0dGhpcy5zdWJtaXRGcmFtZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICggaXNXZWJWUjEgJiYgdnJEaXNwbGF5ICE9PSB1bmRlZmluZWQgJiYgc2NvcGUuaXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHR2ckRpc3BsYXkuc3VibWl0RnJhbWUoKTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMuYXV0b1N1Ym1pdEZyYW1lID0gdHJ1ZTtcblxuXHQvLyByZW5kZXJcblxuXHR2YXIgY2FtZXJhTCA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSgpO1xuXHRjYW1lcmFMLmxheWVycy5lbmFibGUoIDEgKTtcblxuXHR2YXIgY2FtZXJhUiA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSgpO1xuXHRjYW1lcmFSLmxheWVycy5lbmFibGUoIDIgKTtcblxuXHR0aGlzLnJlbmRlciA9IGZ1bmN0aW9uICggc2NlbmUsIGNhbWVyYSwgcmVuZGVyVGFyZ2V0LCBmb3JjZUNsZWFyICkge1xuXG5cdFx0aWYgKCB2ckRpc3BsYXkgJiYgc2NvcGUuaXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHR2YXIgYXV0b1VwZGF0ZSA9IHNjZW5lLmF1dG9VcGRhdGU7XG5cblx0XHRcdGlmICggYXV0b1VwZGF0ZSApIHtcblxuXHRcdFx0XHRzY2VuZS51cGRhdGVNYXRyaXhXb3JsZCgpO1xuXHRcdFx0XHRzY2VuZS5hdXRvVXBkYXRlID0gZmFsc2U7XG5cblx0XHRcdH1cblxuXHRcdFx0dmFyIGV5ZVBhcmFtc0wgPSB2ckRpc3BsYXkuZ2V0RXllUGFyYW1ldGVycyggJ2xlZnQnICk7XG5cdFx0XHR2YXIgZXllUGFyYW1zUiA9IHZyRGlzcGxheS5nZXRFeWVQYXJhbWV0ZXJzKCAncmlnaHQnICk7XG5cblx0XHRcdGlmICggaXNXZWJWUjEgKSB7XG5cblx0XHRcdFx0ZXllVHJhbnNsYXRpb25MLmZyb21BcnJheSggZXllUGFyYW1zTC5vZmZzZXQgKTtcblx0XHRcdFx0ZXllVHJhbnNsYXRpb25SLmZyb21BcnJheSggZXllUGFyYW1zUi5vZmZzZXQgKTtcblx0XHRcdFx0ZXllRk9WTCA9IGV5ZVBhcmFtc0wuZmllbGRPZlZpZXc7XG5cdFx0XHRcdGV5ZUZPVlIgPSBleWVQYXJhbXNSLmZpZWxkT2ZWaWV3O1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGV5ZVRyYW5zbGF0aW9uTC5jb3B5KCBleWVQYXJhbXNMLmV5ZVRyYW5zbGF0aW9uICk7XG5cdFx0XHRcdGV5ZVRyYW5zbGF0aW9uUi5jb3B5KCBleWVQYXJhbXNSLmV5ZVRyYW5zbGF0aW9uICk7XG5cdFx0XHRcdGV5ZUZPVkwgPSBleWVQYXJhbXNMLnJlY29tbWVuZGVkRmllbGRPZlZpZXc7XG5cdFx0XHRcdGV5ZUZPVlIgPSBleWVQYXJhbXNSLnJlY29tbWVuZGVkRmllbGRPZlZpZXc7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBBcnJheS5pc0FycmF5KCBzY2VuZSApICkge1xuXG5cdFx0XHRcdGNvbnNvbGUud2FybiggJ1RIUkVFLlZSRWZmZWN0LnJlbmRlcigpIG5vIGxvbmdlciBzdXBwb3J0cyBhcnJheXMuIFVzZSBvYmplY3QubGF5ZXJzIGluc3RlYWQuJyApO1xuXHRcdFx0XHRzY2VuZSA9IHNjZW5lWyAwIF07XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gV2hlbiByZW5kZXJpbmcgd2UgZG9uJ3QgY2FyZSB3aGF0IHRoZSByZWNvbW1lbmRlZCBzaXplIGlzLCBvbmx5IHdoYXQgdGhlIGFjdHVhbCBzaXplXG5cdFx0XHQvLyBvZiB0aGUgYmFja2J1ZmZlciBpcy5cblx0XHRcdHZhciBzaXplID0gcmVuZGVyZXIuZ2V0U2l6ZSgpO1xuXHRcdFx0cmVuZGVyUmVjdEwgPSB7XG5cdFx0XHRcdHg6IE1hdGgucm91bmQoIHNpemUud2lkdGggKiBsZWZ0Qm91bmRzWyAwIF0gKSxcblx0XHRcdFx0eTogTWF0aC5yb3VuZCggc2l6ZS5oZWlnaHQgKiBsZWZ0Qm91bmRzWyAxIF0gKSxcblx0XHRcdFx0d2lkdGg6IE1hdGgucm91bmQoIHNpemUud2lkdGggKiBsZWZ0Qm91bmRzWyAyIF0gKSxcblx0XHRcdFx0aGVpZ2h0OiAgTWF0aC5yb3VuZChzaXplLmhlaWdodCAqIGxlZnRCb3VuZHNbIDMgXSApXG5cdFx0XHR9O1xuXHRcdFx0cmVuZGVyUmVjdFIgPSB7XG5cdFx0XHRcdHg6IE1hdGgucm91bmQoIHNpemUud2lkdGggKiByaWdodEJvdW5kc1sgMCBdICksXG5cdFx0XHRcdHk6IE1hdGgucm91bmQoIHNpemUuaGVpZ2h0ICogcmlnaHRCb3VuZHNbIDEgXSApLFxuXHRcdFx0XHR3aWR0aDogTWF0aC5yb3VuZCggc2l6ZS53aWR0aCAqIHJpZ2h0Qm91bmRzWyAyIF0gKSxcblx0XHRcdFx0aGVpZ2h0OiAgTWF0aC5yb3VuZChzaXplLmhlaWdodCAqIHJpZ2h0Qm91bmRzWyAzIF0gKVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHJlbmRlclRhcmdldCkge1xuXHRcdFx0XHRcblx0XHRcdFx0cmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KHJlbmRlclRhcmdldCk7XG5cdFx0XHRcdHJlbmRlclRhcmdldC5zY2lzc29yVGVzdCA9IHRydWU7XG5cdFx0XHRcdFxuXHRcdFx0fSBlbHNlICB7XG5cdFx0XHRcdFxuXHRcdFx0XHRyZW5kZXJlci5zZXRTY2lzc29yVGVzdCggdHJ1ZSApO1xuXHRcdFx0XG5cdFx0XHR9XG5cblx0XHRcdGlmICggcmVuZGVyZXIuYXV0b0NsZWFyIHx8IGZvcmNlQ2xlYXIgKSByZW5kZXJlci5jbGVhcigpO1xuXG5cdFx0XHRpZiAoIGNhbWVyYS5wYXJlbnQgPT09IG51bGwgKSBjYW1lcmEudXBkYXRlTWF0cml4V29ybGQoKTtcblxuXHRcdFx0Y2FtZXJhTC5wcm9qZWN0aW9uTWF0cml4ID0gZm92VG9Qcm9qZWN0aW9uKCBleWVGT1ZMLCB0cnVlLCBjYW1lcmEubmVhciwgY2FtZXJhLmZhciApO1xuXHRcdFx0Y2FtZXJhUi5wcm9qZWN0aW9uTWF0cml4ID0gZm92VG9Qcm9qZWN0aW9uKCBleWVGT1ZSLCB0cnVlLCBjYW1lcmEubmVhciwgY2FtZXJhLmZhciApO1xuXG5cdFx0XHRjYW1lcmEubWF0cml4V29ybGQuZGVjb21wb3NlKCBjYW1lcmFMLnBvc2l0aW9uLCBjYW1lcmFMLnF1YXRlcm5pb24sIGNhbWVyYUwuc2NhbGUgKTtcblx0XHRcdGNhbWVyYS5tYXRyaXhXb3JsZC5kZWNvbXBvc2UoIGNhbWVyYVIucG9zaXRpb24sIGNhbWVyYVIucXVhdGVybmlvbiwgY2FtZXJhUi5zY2FsZSApO1xuXG5cdFx0XHR2YXIgc2NhbGUgPSB0aGlzLnNjYWxlO1xuXHRcdFx0Y2FtZXJhTC50cmFuc2xhdGVPbkF4aXMoIGV5ZVRyYW5zbGF0aW9uTCwgc2NhbGUgKTtcblx0XHRcdGNhbWVyYVIudHJhbnNsYXRlT25BeGlzKCBleWVUcmFuc2xhdGlvblIsIHNjYWxlICk7XG5cblxuXHRcdFx0Ly8gcmVuZGVyIGxlZnQgZXllXG5cdFx0XHRpZiAoIHJlbmRlclRhcmdldCApIHtcblxuXHRcdFx0XHRyZW5kZXJUYXJnZXQudmlld3BvcnQuc2V0KHJlbmRlclJlY3RMLngsIHJlbmRlclJlY3RMLnksIHJlbmRlclJlY3RMLndpZHRoLCByZW5kZXJSZWN0TC5oZWlnaHQpO1xuXHRcdFx0XHRyZW5kZXJUYXJnZXQuc2Npc3Nvci5zZXQocmVuZGVyUmVjdEwueCwgcmVuZGVyUmVjdEwueSwgcmVuZGVyUmVjdEwud2lkdGgsIHJlbmRlclJlY3RMLmhlaWdodCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0cmVuZGVyZXIuc2V0Vmlld3BvcnQoIHJlbmRlclJlY3RMLngsIHJlbmRlclJlY3RMLnksIHJlbmRlclJlY3RMLndpZHRoLCByZW5kZXJSZWN0TC5oZWlnaHQgKTtcblx0XHRcdFx0cmVuZGVyZXIuc2V0U2Npc3NvciggcmVuZGVyUmVjdEwueCwgcmVuZGVyUmVjdEwueSwgcmVuZGVyUmVjdEwud2lkdGgsIHJlbmRlclJlY3RMLmhlaWdodCApO1xuXG5cdFx0XHR9XG5cdFx0XHRyZW5kZXJlci5yZW5kZXIoIHNjZW5lLCBjYW1lcmFMLCByZW5kZXJUYXJnZXQsIGZvcmNlQ2xlYXIgKTtcblxuXHRcdFx0Ly8gcmVuZGVyIHJpZ2h0IGV5ZVxuXHRcdFx0aWYgKHJlbmRlclRhcmdldCkge1xuXG5cdFx0XHRcdHJlbmRlclRhcmdldC52aWV3cG9ydC5zZXQocmVuZGVyUmVjdFIueCwgcmVuZGVyUmVjdFIueSwgcmVuZGVyUmVjdFIud2lkdGgsIHJlbmRlclJlY3RSLmhlaWdodCk7XG4gIFx0XHRcdFx0cmVuZGVyVGFyZ2V0LnNjaXNzb3Iuc2V0KHJlbmRlclJlY3RSLngsIHJlbmRlclJlY3RSLnksIHJlbmRlclJlY3RSLndpZHRoLCByZW5kZXJSZWN0Ui5oZWlnaHQpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHJlbmRlcmVyLnNldFZpZXdwb3J0KCByZW5kZXJSZWN0Ui54LCByZW5kZXJSZWN0Ui55LCByZW5kZXJSZWN0Ui53aWR0aCwgcmVuZGVyUmVjdFIuaGVpZ2h0ICk7XG5cdFx0XHRcdHJlbmRlcmVyLnNldFNjaXNzb3IoIHJlbmRlclJlY3RSLngsIHJlbmRlclJlY3RSLnksIHJlbmRlclJlY3RSLndpZHRoLCByZW5kZXJSZWN0Ui5oZWlnaHQgKTtcblxuXHRcdFx0fVxuXHRcdFx0cmVuZGVyZXIucmVuZGVyKCBzY2VuZSwgY2FtZXJhUiwgcmVuZGVyVGFyZ2V0LCBmb3JjZUNsZWFyICk7XG5cblx0XHRcdGlmIChyZW5kZXJUYXJnZXQpIHtcblxuXHRcdFx0XHRyZW5kZXJUYXJnZXQudmlld3BvcnQuc2V0KCAwLCAwLCBzaXplLndpZHRoLCBzaXplLmhlaWdodCApO1xuXHRcdFx0XHRyZW5kZXJUYXJnZXQuc2Npc3Nvci5zZXQoIDAsIDAsIHNpemUud2lkdGgsIHNpemUuaGVpZ2h0ICk7XG5cdFx0XHRcdHJlbmRlclRhcmdldC5zY2lzc29yVGVzdCA9IGZhbHNlO1xuXHRcdFx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQoIG51bGwgKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XG5cdFx0XHRcdHJlbmRlcmVyLnNldFNjaXNzb3JUZXN0KCBmYWxzZSApO1xuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmICggYXV0b1VwZGF0ZSApIHtcblxuXHRcdFx0XHRzY2VuZS5hdXRvVXBkYXRlID0gdHJ1ZTtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHNjb3BlLmF1dG9TdWJtaXRGcmFtZSApIHtcblxuXHRcdFx0XHRzY29wZS5zdWJtaXRGcmFtZSgpO1xuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybjtcblxuXHRcdH1cblxuXHRcdC8vIFJlZ3VsYXIgcmVuZGVyIG1vZGUgaWYgbm90IEhNRFxuXG5cdFx0cmVuZGVyZXIucmVuZGVyKCBzY2VuZSwgY2FtZXJhLCByZW5kZXJUYXJnZXQsIGZvcmNlQ2xlYXIgKTtcblxuXHR9O1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gZm92VG9ORENTY2FsZU9mZnNldCggZm92ICkge1xuXG5cdFx0dmFyIHB4c2NhbGUgPSAyLjAgLyAoIGZvdi5sZWZ0VGFuICsgZm92LnJpZ2h0VGFuICk7XG5cdFx0dmFyIHB4b2Zmc2V0ID0gKCBmb3YubGVmdFRhbiAtIGZvdi5yaWdodFRhbiApICogcHhzY2FsZSAqIDAuNTtcblx0XHR2YXIgcHlzY2FsZSA9IDIuMCAvICggZm92LnVwVGFuICsgZm92LmRvd25UYW4gKTtcblx0XHR2YXIgcHlvZmZzZXQgPSAoIGZvdi51cFRhbiAtIGZvdi5kb3duVGFuICkgKiBweXNjYWxlICogMC41O1xuXHRcdHJldHVybiB7IHNjYWxlOiBbIHB4c2NhbGUsIHB5c2NhbGUgXSwgb2Zmc2V0OiBbIHB4b2Zmc2V0LCBweW9mZnNldCBdIH07XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGZvdlBvcnRUb1Byb2plY3Rpb24oIGZvdiwgcmlnaHRIYW5kZWQsIHpOZWFyLCB6RmFyICkge1xuXG5cdFx0cmlnaHRIYW5kZWQgPSByaWdodEhhbmRlZCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHJpZ2h0SGFuZGVkO1xuXHRcdHpOZWFyID0gek5lYXIgPT09IHVuZGVmaW5lZCA/IDAuMDEgOiB6TmVhcjtcblx0XHR6RmFyID0gekZhciA9PT0gdW5kZWZpbmVkID8gMTAwMDAuMCA6IHpGYXI7XG5cblx0XHR2YXIgaGFuZGVkbmVzc1NjYWxlID0gcmlnaHRIYW5kZWQgPyAtIDEuMCA6IDEuMDtcblxuXHRcdC8vIHN0YXJ0IHdpdGggYW4gaWRlbnRpdHkgbWF0cml4XG5cdFx0dmFyIG1vYmogPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuXHRcdHZhciBtID0gbW9iai5lbGVtZW50cztcblxuXHRcdC8vIGFuZCB3aXRoIHNjYWxlL29mZnNldCBpbmZvIGZvciBub3JtYWxpemVkIGRldmljZSBjb29yZHNcblx0XHR2YXIgc2NhbGVBbmRPZmZzZXQgPSBmb3ZUb05EQ1NjYWxlT2Zmc2V0KCBmb3YgKTtcblxuXHRcdC8vIFggcmVzdWx0LCBtYXAgY2xpcCBlZGdlcyB0byBbLXcsK3ddXG5cdFx0bVsgMCAqIDQgKyAwIF0gPSBzY2FsZUFuZE9mZnNldC5zY2FsZVsgMCBdO1xuXHRcdG1bIDAgKiA0ICsgMSBdID0gMC4wO1xuXHRcdG1bIDAgKiA0ICsgMiBdID0gc2NhbGVBbmRPZmZzZXQub2Zmc2V0WyAwIF0gKiBoYW5kZWRuZXNzU2NhbGU7XG5cdFx0bVsgMCAqIDQgKyAzIF0gPSAwLjA7XG5cblx0XHQvLyBZIHJlc3VsdCwgbWFwIGNsaXAgZWRnZXMgdG8gWy13LCt3XVxuXHRcdC8vIFkgb2Zmc2V0IGlzIG5lZ2F0ZWQgYmVjYXVzZSB0aGlzIHByb2ogbWF0cml4IHRyYW5zZm9ybXMgZnJvbSB3b3JsZCBjb29yZHMgd2l0aCBZPXVwLFxuXHRcdC8vIGJ1dCB0aGUgTkRDIHNjYWxpbmcgaGFzIFk9ZG93biAodGhhbmtzIEQzRD8pXG5cdFx0bVsgMSAqIDQgKyAwIF0gPSAwLjA7XG5cdFx0bVsgMSAqIDQgKyAxIF0gPSBzY2FsZUFuZE9mZnNldC5zY2FsZVsgMSBdO1xuXHRcdG1bIDEgKiA0ICsgMiBdID0gLSBzY2FsZUFuZE9mZnNldC5vZmZzZXRbIDEgXSAqIGhhbmRlZG5lc3NTY2FsZTtcblx0XHRtWyAxICogNCArIDMgXSA9IDAuMDtcblxuXHRcdC8vIFogcmVzdWx0ICh1cCB0byB0aGUgYXBwKVxuXHRcdG1bIDIgKiA0ICsgMCBdID0gMC4wO1xuXHRcdG1bIDIgKiA0ICsgMSBdID0gMC4wO1xuXHRcdG1bIDIgKiA0ICsgMiBdID0gekZhciAvICggek5lYXIgLSB6RmFyICkgKiAtIGhhbmRlZG5lc3NTY2FsZTtcblx0XHRtWyAyICogNCArIDMgXSA9ICggekZhciAqIHpOZWFyICkgLyAoIHpOZWFyIC0gekZhciApO1xuXG5cdFx0Ly8gVyByZXN1bHQgKD0gWiBpbilcblx0XHRtWyAzICogNCArIDAgXSA9IDAuMDtcblx0XHRtWyAzICogNCArIDEgXSA9IDAuMDtcblx0XHRtWyAzICogNCArIDIgXSA9IGhhbmRlZG5lc3NTY2FsZTtcblx0XHRtWyAzICogNCArIDMgXSA9IDAuMDtcblxuXHRcdG1vYmoudHJhbnNwb3NlKCk7XG5cblx0XHRyZXR1cm4gbW9iajtcblxuXHR9XG5cblx0ZnVuY3Rpb24gZm92VG9Qcm9qZWN0aW9uKCBmb3YsIHJpZ2h0SGFuZGVkLCB6TmVhciwgekZhciApIHtcblxuXHRcdHZhciBERUcyUkFEID0gTWF0aC5QSSAvIDE4MC4wO1xuXG5cdFx0dmFyIGZvdlBvcnQgPSB7XG5cdFx0XHR1cFRhbjogTWF0aC50YW4oIGZvdi51cERlZ3JlZXMgKiBERUcyUkFEICksXG5cdFx0XHRkb3duVGFuOiBNYXRoLnRhbiggZm92LmRvd25EZWdyZWVzICogREVHMlJBRCApLFxuXHRcdFx0bGVmdFRhbjogTWF0aC50YW4oIGZvdi5sZWZ0RGVncmVlcyAqIERFRzJSQUQgKSxcblx0XHRcdHJpZ2h0VGFuOiBNYXRoLnRhbiggZm92LnJpZ2h0RGVncmVlcyAqIERFRzJSQUQgKVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZm92UG9ydFRvUHJvamVjdGlvbiggZm92UG9ydCwgcmlnaHRIYW5kZWQsIHpOZWFyLCB6RmFyICk7XG5cblx0fVxuXG59O1xuIiwiaW1wb3J0ICogYXMgVlJDb250cm9scyBmcm9tICcuL3ZyY29udHJvbHMnO1xyXG5pbXBvcnQgKiBhcyBWUkVmZmVjdHMgZnJvbSAnLi92cmVmZmVjdHMnO1xyXG5pbXBvcnQgKiBhcyBWaXZlQ29udHJvbGxlciBmcm9tICcuL3ZpdmVjb250cm9sbGVyJztcclxuaW1wb3J0ICogYXMgV0VCVlIgZnJvbSAnLi93ZWJ2cic7XHJcbmltcG9ydCAqIGFzIE9iakxvYWRlciBmcm9tICcuL29iamxvYWRlcic7XHJcblxyXG5pZiAoIFdFQlZSLmlzTGF0ZXN0QXZhaWxhYmxlKCkgPT09IGZhbHNlICkge1xyXG5cclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBXRUJWUi5nZXRNZXNzYWdlKCkgKTtcclxuXHJcbn1cclxuXHJcbnZhciBjb250YWluZXI7XHJcbnZhciBjYW1lcmEsIHJlbmRlcmVyO1xyXG52YXIgZWZmZWN0LCBjb250cm9scztcclxudmFyIGNvbnRyb2xsZXIxLCBjb250cm9sbGVyMjtcclxudmFyIHNjZW5lO1xyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBjb250YWluZXIgKTtcclxuXHJcbiAgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHJcbiAgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA3MCwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAgKTtcclxuICBzY2VuZS5hZGQoIGNhbWVyYSApO1xyXG5cclxuICBjb25zdCByb29tID0gbmV3IFRIUkVFLk1lc2goXHJcbiAgICBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIDYsIDYsIDYsIDgsIDgsIDggKSxcclxuICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCggeyBjb2xvcjogMHg0MDQwNDAsIHdpcmVmcmFtZTogdHJ1ZSB9IClcclxuICApO1xyXG4gIHJvb20ucG9zaXRpb24ueSA9IDM7XHJcbiAgc2NlbmUuYWRkKCByb29tICk7XHJcblxyXG4gIHNjZW5lLmFkZCggbmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCggMHg2MDYwNjAsIDB4NDA0MDQwICkgKTtcclxuXHJcbiAgdmFyIGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoIDB4ZmZmZmZmICk7XHJcbiAgbGlnaHQucG9zaXRpb24uc2V0KCAxLCAxLCAxICkubm9ybWFsaXplKCk7XHJcbiAgc2NlbmUuYWRkKCBsaWdodCApO1xyXG5cclxuICByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCB7IGFudGlhbGlhczogZmFsc2UgfSApO1xyXG4gIHJlbmRlcmVyLnNldENsZWFyQ29sb3IoIDB4NTA1MDUwICk7XHJcbiAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyggd2luZG93LmRldmljZVBpeGVsUmF0aW8gKTtcclxuICByZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XHJcbiAgcmVuZGVyZXIuc29ydE9iamVjdHMgPSBmYWxzZTtcclxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoIHJlbmRlcmVyLmRvbUVsZW1lbnQgKTtcclxuXHJcbiAgY29udHJvbHMgPSBuZXcgVEhSRUUuVlJDb250cm9scyggY2FtZXJhICk7XHJcbiAgY29udHJvbHMuc3RhbmRpbmcgPSB0cnVlO1xyXG5cclxuICAvLyBjb250cm9sbGVyc1xyXG5cclxuICBjb250cm9sbGVyMSA9IG5ldyBUSFJFRS5WaXZlQ29udHJvbGxlciggMCApO1xyXG4gIGNvbnRyb2xsZXIxLnN0YW5kaW5nTWF0cml4ID0gY29udHJvbHMuZ2V0U3RhbmRpbmdNYXRyaXgoKTtcclxuICBzY2VuZS5hZGQoIGNvbnRyb2xsZXIxICk7XHJcblxyXG4gIGNvbnRyb2xsZXIyID0gbmV3IFRIUkVFLlZpdmVDb250cm9sbGVyKCAxICk7XHJcbiAgY29udHJvbGxlcjIuc3RhbmRpbmdNYXRyaXggPSBjb250cm9scy5nZXRTdGFuZGluZ01hdHJpeCgpO1xyXG4gIHNjZW5lLmFkZCggY29udHJvbGxlcjIgKTtcclxuXHJcbiAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5PQkpMb2FkZXIoKTtcclxuICBsb2FkZXIuc2V0UGF0aCggJ21vZGVscy9vYmovdml2ZS1jb250cm9sbGVyLycgKTtcclxuICBsb2FkZXIubG9hZCggJ3ZyX2NvbnRyb2xsZXJfdml2ZV8xXzUub2JqJywgZnVuY3Rpb24gKCBvYmplY3QgKSB7XHJcblxyXG4gICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XHJcbiAgICBsb2FkZXIuc2V0UGF0aCggJ21vZGVscy9vYmovdml2ZS1jb250cm9sbGVyLycgKTtcclxuXHJcbiAgICB2YXIgY29udHJvbGxlciA9IG9iamVjdC5jaGlsZHJlblsgMCBdO1xyXG4gICAgY29udHJvbGxlci5tYXRlcmlhbC5tYXAgPSBsb2FkZXIubG9hZCggJ29uZXBvaW50Zml2ZV90ZXh0dXJlLnBuZycgKTtcclxuICAgIGNvbnRyb2xsZXIubWF0ZXJpYWwuc3BlY3VsYXJNYXAgPSBsb2FkZXIubG9hZCggJ29uZXBvaW50Zml2ZV9zcGVjLnBuZycgKTtcclxuXHJcbiAgICBjb250cm9sbGVyMS5hZGQoIG9iamVjdC5jbG9uZSgpICk7XHJcbiAgICBjb250cm9sbGVyMi5hZGQoIG9iamVjdC5jbG9uZSgpICk7XHJcblxyXG4gIH0gKTtcclxuXHJcbiAgZWZmZWN0ID0gbmV3IFRIUkVFLlZSRWZmZWN0KCByZW5kZXJlciApO1xyXG5cclxuICBpZiAoIFdFQlZSLmlzQXZhaWxhYmxlKCkgPT09IHRydWUgKSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBXRUJWUi5nZXRCdXR0b24oIGVmZmVjdCApICk7XHJcbiAgICBzZXRUaW1lb3V0KCAoKT0+ZWZmZWN0LnJlcXVlc3RQcmVzZW50KCksIDEwMDAgKTtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgZnVuY3Rpb24oKXtcclxuICAgIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICBlZmZlY3Quc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xyXG4gIH0sIGZhbHNlICk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBhbmltYXRlKCkge1xyXG5cclxuICBlZmZlY3QucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBhbmltYXRlICk7XHJcbiAgcmVuZGVyKCk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgY29udHJvbHMudXBkYXRlKCk7XHJcbiAgZWZmZWN0LnJlbmRlciggc2NlbmUsIGNhbWVyYSApO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgc3RhcnQ6IGZ1bmN0aW9uKCl7XHJcbiAgICBpbml0KCk7XHJcbiAgICBhbmltYXRlKCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2NlbmUsIGNhbWVyYSwgY29udHJvbGxlcjEsIGNvbnRyb2xsZXIyLCByZW5kZXJlclxyXG4gICAgfVxyXG4gIH1cclxufTsiLCIvKipcclxuKiBAYXV0aG9yIG1yZG9vYiAvIGh0dHA6Ly9tcmRvb2IuY29tXHJcbiogQmFzZWQgb24gQHRvamlybydzIHZyLXNhbXBsZXMtdXRpbHMuanNcclxuKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0xhdGVzdEF2YWlsYWJsZSgpIHtcclxuXHJcbiAgcmV0dXJuIG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzICE9PSB1bmRlZmluZWQ7XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNBdmFpbGFibGUoKSB7XHJcblxyXG4gIHJldHVybiBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cyAhPT0gdW5kZWZpbmVkIHx8IG5hdmlnYXRvci5nZXRWUkRldmljZXMgIT09IHVuZGVmaW5lZDtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzYWdlKCkge1xyXG5cclxuICB2YXIgbWVzc2FnZTtcclxuXHJcbiAgaWYgKCBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cyApIHtcclxuXHJcbiAgICBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cygpLnRoZW4oIGZ1bmN0aW9uICggZGlzcGxheXMgKSB7XHJcblxyXG4gICAgICBpZiAoIGRpc3BsYXlzLmxlbmd0aCA9PT0gMCApIG1lc3NhZ2UgPSAnV2ViVlIgc3VwcG9ydGVkLCBidXQgbm8gVlJEaXNwbGF5cyBmb3VuZC4nO1xyXG5cclxuICAgIH0gKTtcclxuXHJcbiAgfSBlbHNlIGlmICggbmF2aWdhdG9yLmdldFZSRGV2aWNlcyApIHtcclxuXHJcbiAgICBtZXNzYWdlID0gJ1lvdXIgYnJvd3NlciBzdXBwb3J0cyBXZWJWUiBidXQgbm90IHRoZSBsYXRlc3QgdmVyc2lvbi4gU2VlIDxhIGhyZWY9XCJodHRwOi8vd2VidnIuaW5mb1wiPndlYnZyLmluZm88L2E+IGZvciBtb3JlIGluZm8uJztcclxuXHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICBtZXNzYWdlID0gJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFdlYlZSLiBTZWUgPGEgaHJlZj1cImh0dHA6Ly93ZWJ2ci5pbmZvXCI+d2VidnIuaW5mbzwvYT4gZm9yIGFzc2lzdGFuY2UuJztcclxuXHJcbiAgfVxyXG5cclxuICBpZiAoIG1lc3NhZ2UgIT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcclxuICAgIGNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICBjb250YWluZXIuc3R5bGUubGVmdCA9ICcwJztcclxuICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSAnMCc7XHJcbiAgICBjb250YWluZXIuc3R5bGUucmlnaHQgPSAnMCc7XHJcbiAgICBjb250YWluZXIuc3R5bGUuekluZGV4ID0gJzk5OSc7XHJcbiAgICBjb250YWluZXIuYWxpZ24gPSAnY2VudGVyJztcclxuXHJcbiAgICB2YXIgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xyXG4gICAgZXJyb3Iuc3R5bGUuZm9udEZhbWlseSA9ICdzYW5zLXNlcmlmJztcclxuICAgIGVycm9yLnN0eWxlLmZvbnRTaXplID0gJzE2cHgnO1xyXG4gICAgZXJyb3Iuc3R5bGUuZm9udFN0eWxlID0gJ25vcm1hbCc7XHJcbiAgICBlcnJvci5zdHlsZS5saW5lSGVpZ2h0ID0gJzI2cHgnO1xyXG4gICAgZXJyb3Iuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmZmYnO1xyXG4gICAgZXJyb3Iuc3R5bGUuY29sb3IgPSAnIzAwMCc7XHJcbiAgICBlcnJvci5zdHlsZS5wYWRkaW5nID0gJzEwcHggMjBweCc7XHJcbiAgICBlcnJvci5zdHlsZS5tYXJnaW4gPSAnNTBweCc7XHJcbiAgICBlcnJvci5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XHJcbiAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKCBlcnJvciApO1xyXG5cclxuICAgIHJldHVybiBjb250YWluZXI7XHJcblxyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRCdXR0b24oIGVmZmVjdCApIHtcclxuXHJcbiAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdidXR0b24nICk7XHJcbiAgYnV0dG9uLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICBidXR0b24uc3R5bGUubGVmdCA9ICdjYWxjKDUwJSAtIDUwcHgpJztcclxuICBidXR0b24uc3R5bGUuYm90dG9tID0gJzIwcHgnO1xyXG4gIGJ1dHRvbi5zdHlsZS53aWR0aCA9ICcxMDBweCc7XHJcbiAgYnV0dG9uLnN0eWxlLmJvcmRlciA9ICcwJztcclxuICBidXR0b24uc3R5bGUucGFkZGluZyA9ICc4cHgnO1xyXG4gIGJ1dHRvbi5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgYnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjMDAwJztcclxuICBidXR0b24uc3R5bGUuY29sb3IgPSAnI2ZmZic7XHJcbiAgYnV0dG9uLnN0eWxlLmZvbnRGYW1pbHkgPSAnc2Fucy1zZXJpZic7XHJcbiAgYnV0dG9uLnN0eWxlLmZvbnRTaXplID0gJzEzcHgnO1xyXG4gIGJ1dHRvbi5zdHlsZS5mb250U3R5bGUgPSAnbm9ybWFsJztcclxuICBidXR0b24uc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgYnV0dG9uLnN0eWxlLnpJbmRleCA9ICc5OTknO1xyXG4gIGJ1dHRvbi50ZXh0Q29udGVudCA9ICdFTlRFUiBWUic7XHJcbiAgYnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBlZmZlY3QuaXNQcmVzZW50aW5nID8gZWZmZWN0LmV4aXRQcmVzZW50KCkgOiBlZmZlY3QucmVxdWVzdFByZXNlbnQoKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICd2cmRpc3BsYXlwcmVzZW50Y2hhbmdlJywgZnVuY3Rpb24gKCBldmVudCApIHtcclxuXHJcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSBlZmZlY3QuaXNQcmVzZW50aW5nID8gJ0VYSVQgVlInIDogJ0VOVEVSIFZSJztcclxuXHJcbiAgfSwgZmFsc2UgKTtcclxuXHJcbiAgcmV0dXJuIGJ1dHRvbjtcclxuXHJcbn1cclxuXHJcbiJdfQ==
