(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = create;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$emptyRoom = _ref.emptyRoom;
  var emptyRoom = _ref$emptyRoom === undefined ? true : _ref$emptyRoom;
  var _ref$standing = _ref.standing;
  var standing = _ref$standing === undefined ? true : _ref$standing;
  var _ref$loadControllers = _ref.loadControllers;
  var loadControllers = _ref$loadControllers === undefined ? true : _ref$loadControllers;
  var _ref$vrButton = _ref.vrButton;
  var vrButton = _ref$vrButton === undefined ? true : _ref$vrButton;
  var _ref$autoEnter = _ref.autoEnter;
  var autoEnter = _ref$autoEnter === undefined ? false : _ref$autoEnter;
  var _ref$antiAlias = _ref.antiAlias;
  var antiAlias = _ref$antiAlias === undefined ? true : _ref$antiAlias;
  var _ref$pathToController = _ref.pathToControllers;
  var pathToControllers = _ref$pathToController === undefined ? 'models/obj/vive-controller/' : _ref$pathToController;
  var _ref$controllerModelN = _ref.controllerModelName;
  var controllerModelName = _ref$controllerModelN === undefined ? 'vr_controller_vive_1_5.obj' : _ref$controllerModelN;
  var _ref$controllerTextur = _ref.controllerTextureMap;
  var controllerTextureMap = _ref$controllerTextur === undefined ? 'onepointfive_texture.png' : _ref$controllerTextur;
  var _ref$controllerSpecMa = _ref.controllerSpecMap;
  var controllerSpecMap = _ref$controllerSpecMa === undefined ? 'onepointfive_spec.png' : _ref$controllerSpecMa;


  if (WEBVR.isLatestAvailable() === false) {
    document.body.appendChild(WEBVR.getMessage());
  }

  var events = new _events2.default();

  var container = document.createElement('div');
  document.body.appendChild(container);

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
  scene.add(camera);

  if (emptyRoom) {
    var room = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6, 8, 8, 8), new THREE.MeshBasicMaterial({ color: 0x404040, wireframe: true }));
    room.position.y = 3;
    scene.add(room);

    scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
  }

  var renderer = new THREE.WebGLRenderer({ antialias: antiAlias });
  renderer.setClearColor(0x505050);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.sortObjects = false;
  container.appendChild(renderer.domElement);

  var controls = new THREE.VRControls(camera);
  controls.standing = standing;

  var controller1 = new THREE.Group();
  var controller2 = new THREE.Group();
  scene.add(controller1, controller2);

  var c1 = void 0,
      c2 = void 0;

  if (loadControllers) {
    c1 = new THREE.ViveController(0);
    c1.standingMatrix = controls.getStandingMatrix();
    controller1.add(c1);

    c2 = new THREE.ViveController(1);
    c2.standingMatrix = controls.getStandingMatrix();
    controller2.add(c2);

    var loader = new THREE.OBJLoader();
    loader.setPath(pathToControllers);
    loader.load(controllerModelName, function (object) {

      var textureLoader = new THREE.TextureLoader();
      textureLoader.setPath(pathToControllers);

      var controller = object.children[0];
      controller.material.map = textureLoader.load(controllerTextureMap);
      controller.material.specularMap = textureLoader.load(controllerSpecMap);

      c1.add(object.clone());
      c2.add(object.clone());
    });
  }

  var effect = new THREE.VREffect(renderer);

  if (WEBVR.isAvailable() === true) {
    if (vrButton) {
      document.body.appendChild(WEBVR.getButton(effect));
    }

    if (autoEnter) {
      setTimeout(function () {
        return effect.requestPresent();
      }, 1000);
    }
  }

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize(window.innerWidth, window.innerHeight);

    events.emit('resize', window.innerWidth, window.innerHeight);
  }, false);

  var clock = new THREE.Clock();
  clock.start();

  function animate() {
    var dt = clock.getDelta();

    effect.requestAnimationFrame(animate);

    controls.update();

    events.emit('tick', dt);

    render();

    events.emit('render', dt);
  }

  function render() {
    effect.render(scene, camera);
  }

  function toggleVR() {
    effect.isPresenting ? effect.exitPresent() : effect.requestPresent();
  }

  animate();

  return {
    scene: scene, camera: camera, controls: controls, renderer: renderer,
    controllerModels: [c1, c2],
    events: events,
    toggleVR: toggleVR
  };
}

if (window) {
  window.VRViewer = create;
}

},{"./objloader":2,"./vivecontroller":3,"./vrcontrols":4,"./vreffects":5,"./webvr":6,"events":7}],2:[function(require,module,exports){
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

    if (gamepad !== undefined && gamepad.pose !== null && gamepad.pose.position !== null) {

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

},{}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcaW5kZXguanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcb2JqbG9hZGVyLmpzIiwibW9kdWxlc1xcdnJ2aWV3ZXJcXHZpdmVjb250cm9sbGVyLmpzIiwibW9kdWxlc1xcdnJ2aWV3ZXJcXHZyY29udHJvbHMuanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcdnJlZmZlY3RzLmpzIiwibW9kdWxlc1xcdnJ2aWV3ZXJcXHdlYnZyLmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkNTd0IsTTs7QUFUeEI7Ozs7QUFFQTs7SUFBWSxVOztBQUNaOztJQUFZLFM7O0FBQ1o7O0lBQVksYzs7QUFDWjs7SUFBWSxLOztBQUNaOztJQUFZLFM7Ozs7OztBQUdHLFNBQVMsTUFBVCxHQWFQO0FBQUEsbUVBQUosRUFBSTs7QUFBQSw0QkFYTixTQVdNO0FBQUEsTUFYTixTQVdNLGtDQVhNLElBV047QUFBQSwyQkFWTixRQVVNO0FBQUEsTUFWTixRQVVNLGlDQVZLLElBVUw7QUFBQSxrQ0FUTixlQVNNO0FBQUEsTUFUTixlQVNNLHdDQVRZLElBU1o7QUFBQSwyQkFSTixRQVFNO0FBQUEsTUFSTixRQVFNLGlDQVJLLElBUUw7QUFBQSw0QkFQTixTQU9NO0FBQUEsTUFQTixTQU9NLGtDQVBNLEtBT047QUFBQSw0QkFOTixTQU1NO0FBQUEsTUFOTixTQU1NLGtDQU5NLElBTU47QUFBQSxtQ0FMTixpQkFLTTtBQUFBLE1BTE4saUJBS00seUNBTGMsNkJBS2Q7QUFBQSxtQ0FKTixtQkFJTTtBQUFBLE1BSk4sbUJBSU0s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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xyXG5cclxuaW1wb3J0ICogYXMgVlJDb250cm9scyBmcm9tICcuL3ZyY29udHJvbHMnO1xyXG5pbXBvcnQgKiBhcyBWUkVmZmVjdHMgZnJvbSAnLi92cmVmZmVjdHMnO1xyXG5pbXBvcnQgKiBhcyBWaXZlQ29udHJvbGxlciBmcm9tICcuL3ZpdmVjb250cm9sbGVyJztcclxuaW1wb3J0ICogYXMgV0VCVlIgZnJvbSAnLi93ZWJ2cic7XHJcbmltcG9ydCAqIGFzIE9iakxvYWRlciBmcm9tICcuL29iamxvYWRlcic7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlKCB7XHJcblxyXG4gIGVtcHR5Um9vbSA9IHRydWUsXHJcbiAgc3RhbmRpbmcgPSB0cnVlLFxyXG4gIGxvYWRDb250cm9sbGVycyA9IHRydWUsXHJcbiAgdnJCdXR0b24gPSB0cnVlLFxyXG4gIGF1dG9FbnRlciA9IGZhbHNlLFxyXG4gIGFudGlBbGlhcyA9IHRydWUsXHJcbiAgcGF0aFRvQ29udHJvbGxlcnMgPSAnbW9kZWxzL29iai92aXZlLWNvbnRyb2xsZXIvJyxcclxuICBjb250cm9sbGVyTW9kZWxOYW1lID0gJ3ZyX2NvbnRyb2xsZXJfdml2ZV8xXzUub2JqJyxcclxuICBjb250cm9sbGVyVGV4dHVyZU1hcCA9ICdvbmVwb2ludGZpdmVfdGV4dHVyZS5wbmcnLFxyXG4gIGNvbnRyb2xsZXJTcGVjTWFwID0gJ29uZXBvaW50Zml2ZV9zcGVjLnBuZydcclxuXHJcbn0gPSB7fSApe1xyXG5cclxuICBpZiAoIFdFQlZSLmlzTGF0ZXN0QXZhaWxhYmxlKCkgPT09IGZhbHNlICkge1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggV0VCVlIuZ2V0TWVzc2FnZSgpICk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBldmVudHMgPSBuZXcgRW1pdHRlcigpO1xyXG5cclxuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lciApO1xyXG5cclxuXHJcbiAgY29uc3Qgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHJcbiAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA3MCwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAgKTtcclxuICBzY2VuZS5hZGQoIGNhbWVyYSApO1xyXG5cclxuICBpZiggZW1wdHlSb29tICl7XHJcbiAgICBjb25zdCByb29tID0gbmV3IFRIUkVFLk1lc2goXHJcbiAgICAgIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggNiwgNiwgNiwgOCwgOCwgOCApLFxyXG4gICAgICBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4NDA0MDQwLCB3aXJlZnJhbWU6IHRydWUgfSApXHJcbiAgICApO1xyXG4gICAgcm9vbS5wb3NpdGlvbi55ID0gMztcclxuICAgIHNjZW5lLmFkZCggcm9vbSApO1xyXG5cclxuICAgIHNjZW5lLmFkZCggbmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCggMHg2MDYwNjAsIDB4NDA0MDQwICkgKTtcclxuXHJcbiAgICBsZXQgbGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCggMHhmZmZmZmYgKTtcclxuICAgIGxpZ2h0LnBvc2l0aW9uLnNldCggMSwgMSwgMSApLm5vcm1hbGl6ZSgpO1xyXG4gICAgc2NlbmUuYWRkKCBsaWdodCApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciggeyBhbnRpYWxpYXM6IGFudGlBbGlhcyB9ICk7XHJcbiAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvciggMHg1MDUwNTAgKTtcclxuICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKCB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyApO1xyXG4gIHJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcclxuICByZW5kZXJlci5zb3J0T2JqZWN0cyA9IGZhbHNlO1xyXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCggcmVuZGVyZXIuZG9tRWxlbWVudCApO1xyXG5cclxuICBjb25zdCBjb250cm9scyA9IG5ldyBUSFJFRS5WUkNvbnRyb2xzKCBjYW1lcmEgKTtcclxuICBjb250cm9scy5zdGFuZGluZyA9IHN0YW5kaW5nO1xyXG5cclxuXHJcbiAgY29uc3QgY29udHJvbGxlcjEgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBjb25zdCBjb250cm9sbGVyMiA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIHNjZW5lLmFkZCggY29udHJvbGxlcjEsIGNvbnRyb2xsZXIyICk7XHJcblxyXG4gIGxldCBjMSwgYzI7XHJcblxyXG4gIGlmKCBsb2FkQ29udHJvbGxlcnMgKXtcclxuICAgIGMxID0gbmV3IFRIUkVFLlZpdmVDb250cm9sbGVyKCAwICk7XHJcbiAgICBjMS5zdGFuZGluZ01hdHJpeCA9IGNvbnRyb2xzLmdldFN0YW5kaW5nTWF0cml4KCk7XHJcbiAgICBjb250cm9sbGVyMS5hZGQoIGMxICk7XHJcblxyXG4gICAgYzIgPSBuZXcgVEhSRUUuVml2ZUNvbnRyb2xsZXIoIDEgKTtcclxuICAgIGMyLnN0YW5kaW5nTWF0cml4ID0gY29udHJvbHMuZ2V0U3RhbmRpbmdNYXRyaXgoKTtcclxuICAgIGNvbnRyb2xsZXIyLmFkZCggYzIgKTtcclxuXHJcbiAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLk9CSkxvYWRlcigpO1xyXG4gICAgbG9hZGVyLnNldFBhdGgoIHBhdGhUb0NvbnRyb2xsZXJzICk7XHJcbiAgICBsb2FkZXIubG9hZCggY29udHJvbGxlck1vZGVsTmFtZSwgZnVuY3Rpb24gKCBvYmplY3QgKSB7XHJcblxyXG4gICAgICB2YXIgdGV4dHVyZUxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XHJcbiAgICAgIHRleHR1cmVMb2FkZXIuc2V0UGF0aCggcGF0aFRvQ29udHJvbGxlcnMgKTtcclxuXHJcbiAgICAgIHZhciBjb250cm9sbGVyID0gb2JqZWN0LmNoaWxkcmVuWyAwIF07XHJcbiAgICAgIGNvbnRyb2xsZXIubWF0ZXJpYWwubWFwID0gdGV4dHVyZUxvYWRlci5sb2FkKCBjb250cm9sbGVyVGV4dHVyZU1hcCApO1xyXG4gICAgICBjb250cm9sbGVyLm1hdGVyaWFsLnNwZWN1bGFyTWFwID0gdGV4dHVyZUxvYWRlci5sb2FkKCBjb250cm9sbGVyU3BlY01hcCApO1xyXG5cclxuICAgICAgYzEuYWRkKCBvYmplY3QuY2xvbmUoKSApO1xyXG4gICAgICBjMi5hZGQoIG9iamVjdC5jbG9uZSgpICk7XHJcblxyXG4gICAgfSApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZWZmZWN0ID0gbmV3IFRIUkVFLlZSRWZmZWN0KCByZW5kZXJlciApO1xyXG5cclxuICBpZiAoIFdFQlZSLmlzQXZhaWxhYmxlKCkgPT09IHRydWUgKSB7XHJcbiAgICBpZiggdnJCdXR0b24gKXtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggV0VCVlIuZ2V0QnV0dG9uKCBlZmZlY3QgKSApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBhdXRvRW50ZXIgKXtcclxuICAgICAgc2V0VGltZW91dCggKCk9PmVmZmVjdC5yZXF1ZXN0UHJlc2VudCgpLCAxMDAwICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIGZ1bmN0aW9uKCl7XHJcbiAgICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgZWZmZWN0LnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcclxuXHJcbiAgICBldmVudHMuZW1pdCggJ3Jlc2l6ZScsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcclxuICB9LCBmYWxzZSApO1xyXG5cclxuXHJcbiAgY29uc3QgY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcclxuICBjbG9jay5zdGFydCgpO1xyXG5cclxuICBmdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gICAgY29uc3QgZHQgPSBjbG9jay5nZXREZWx0YSgpO1xyXG5cclxuICAgIGVmZmVjdC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGFuaW1hdGUgKTtcclxuXHJcbiAgICBjb250cm9scy51cGRhdGUoKTtcclxuXHJcbiAgICBldmVudHMuZW1pdCggJ3RpY2snLCAgZHQgKTtcclxuXHJcbiAgICByZW5kZXIoKTtcclxuXHJcbiAgICBldmVudHMuZW1pdCggJ3JlbmRlcicsIGR0IClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIGVmZmVjdC5yZW5kZXIoIHNjZW5lLCBjYW1lcmEgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHRvZ2dsZVZSKCl7XHJcbiAgICBlZmZlY3QuaXNQcmVzZW50aW5nID8gZWZmZWN0LmV4aXRQcmVzZW50KCkgOiBlZmZlY3QucmVxdWVzdFByZXNlbnQoKTtcclxuICB9XHJcblxyXG5cclxuICBhbmltYXRlKCk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzY2VuZSwgY2FtZXJhLCBjb250cm9scywgcmVuZGVyZXIsXHJcbiAgICBjb250cm9sbGVyTW9kZWxzOiBbIGMxLCBjMiBdLFxyXG4gICAgZXZlbnRzLFxyXG4gICAgdG9nZ2xlVlJcclxuICB9O1xyXG59XHJcblxyXG5cclxuaWYoIHdpbmRvdyApe1xyXG4gIHdpbmRvdy5WUlZpZXdlciA9IGNyZWF0ZTtcclxufSIsIi8qKlxyXG4gKiBAYXV0aG9yIG1yZG9vYiAvIGh0dHA6Ly9tcmRvb2IuY29tL1xyXG4gKi9cclxuXHJcblRIUkVFLk9CSkxvYWRlciA9IGZ1bmN0aW9uICggbWFuYWdlciApIHtcclxuXHJcbiAgdGhpcy5tYW5hZ2VyID0gKCBtYW5hZ2VyICE9PSB1bmRlZmluZWQgKSA/IG1hbmFnZXIgOiBUSFJFRS5EZWZhdWx0TG9hZGluZ01hbmFnZXI7XHJcblxyXG4gIHRoaXMubWF0ZXJpYWxzID0gbnVsbDtcclxuXHJcbiAgdGhpcy5yZWdleHAgPSB7XHJcbiAgICAvLyB2IGZsb2F0IGZsb2F0IGZsb2F0XHJcbiAgICB2ZXJ0ZXhfcGF0dGVybiAgICAgICAgICAgOiAvXnZcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKVxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKykvLFxyXG4gICAgLy8gdm4gZmxvYXQgZmxvYXQgZmxvYXRcclxuICAgIG5vcm1hbF9wYXR0ZXJuICAgICAgICAgICA6IC9edm5cXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKVxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKykvLFxyXG4gICAgLy8gdnQgZmxvYXQgZmxvYXRcclxuICAgIHV2X3BhdHRlcm4gICAgICAgICAgICAgICA6IC9ednRcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKS8sXHJcbiAgICAvLyBmIHZlcnRleCB2ZXJ0ZXggdmVydGV4XHJcbiAgICBmYWNlX3ZlcnRleCAgICAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXHMrKC0/XFxkKylcXHMrKC0/XFxkKykoPzpcXHMrKC0/XFxkKykpPy8sXHJcbiAgICAvLyBmIHZlcnRleC91diB2ZXJ0ZXgvdXYgdmVydGV4L3V2XHJcbiAgICBmYWNlX3ZlcnRleF91diAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC8oLT9cXGQrKSk/LyxcclxuICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgIGZhY2VfdmVydGV4X3V2X25vcm1hbCAgICA6IC9eZlxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKSg/OlxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykpPy8sXHJcbiAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICBmYWNlX3ZlcnRleF9ub3JtYWwgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKSk/LyxcclxuICAgIC8vIG8gb2JqZWN0X25hbWUgfCBnIGdyb3VwX25hbWVcclxuICAgIG9iamVjdF9wYXR0ZXJuICAgICAgICAgICA6IC9eW29nXVxccyooLispPy8sXHJcbiAgICAvLyBzIGJvb2xlYW5cclxuICAgIHNtb290aGluZ19wYXR0ZXJuICAgICAgICA6IC9ec1xccysoXFxkK3xvbnxvZmYpLyxcclxuICAgIC8vIG10bGxpYiBmaWxlX3JlZmVyZW5jZVxyXG4gICAgbWF0ZXJpYWxfbGlicmFyeV9wYXR0ZXJuIDogL15tdGxsaWIgLyxcclxuICAgIC8vIHVzZW10bCBtYXRlcmlhbF9uYW1lXHJcbiAgICBtYXRlcmlhbF91c2VfcGF0dGVybiAgICAgOiAvXnVzZW10bCAvXHJcbiAgfTtcclxuXHJcbn07XHJcblxyXG5USFJFRS5PQkpMb2FkZXIucHJvdG90eXBlID0ge1xyXG5cclxuICBjb25zdHJ1Y3RvcjogVEhSRUUuT0JKTG9hZGVyLFxyXG5cclxuICBsb2FkOiBmdW5jdGlvbiAoIHVybCwgb25Mb2FkLCBvblByb2dyZXNzLCBvbkVycm9yICkge1xyXG5cclxuICAgIHZhciBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5YSFJMb2FkZXIoIHNjb3BlLm1hbmFnZXIgKTtcclxuICAgIGxvYWRlci5zZXRQYXRoKCB0aGlzLnBhdGggKTtcclxuICAgIGxvYWRlci5sb2FkKCB1cmwsIGZ1bmN0aW9uICggdGV4dCApIHtcclxuXHJcbiAgICAgIG9uTG9hZCggc2NvcGUucGFyc2UoIHRleHQgKSApO1xyXG5cclxuICAgIH0sIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKTtcclxuXHJcbiAgfSxcclxuXHJcbiAgc2V0UGF0aDogZnVuY3Rpb24gKCB2YWx1ZSApIHtcclxuXHJcbiAgICB0aGlzLnBhdGggPSB2YWx1ZTtcclxuXHJcbiAgfSxcclxuXHJcbiAgc2V0TWF0ZXJpYWxzOiBmdW5jdGlvbiAoIG1hdGVyaWFscyApIHtcclxuXHJcbiAgICB0aGlzLm1hdGVyaWFscyA9IG1hdGVyaWFscztcclxuXHJcbiAgfSxcclxuXHJcbiAgX2NyZWF0ZVBhcnNlclN0YXRlIDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHZhciBzdGF0ZSA9IHtcclxuICAgICAgb2JqZWN0cyAgOiBbXSxcclxuICAgICAgb2JqZWN0ICAgOiB7fSxcclxuXHJcbiAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgIG5vcm1hbHMgIDogW10sXHJcbiAgICAgIHV2cyAgICAgIDogW10sXHJcblxyXG4gICAgICBtYXRlcmlhbExpYnJhcmllcyA6IFtdLFxyXG5cclxuICAgICAgc3RhcnRPYmplY3Q6IGZ1bmN0aW9uICggbmFtZSwgZnJvbURlY2xhcmF0aW9uICkge1xyXG5cclxuICAgICAgICAvLyBJZiB0aGUgY3VycmVudCBvYmplY3QgKGluaXRpYWwgZnJvbSByZXNldCkgaXMgbm90IGZyb20gYSBnL28gZGVjbGFyYXRpb24gaW4gdGhlIHBhcnNlZFxyXG4gICAgICAgIC8vIGZpbGUuIFdlIG5lZWQgdG8gdXNlIGl0IGZvciB0aGUgZmlyc3QgcGFyc2VkIGcvbyB0byBrZWVwIHRoaW5ncyBpbiBzeW5jLlxyXG4gICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdGhpcy5vYmplY3QuZnJvbURlY2xhcmF0aW9uID09PSBmYWxzZSApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgIHRoaXMub2JqZWN0LmZyb21EZWNsYXJhdGlvbiA9ICggZnJvbURlY2xhcmF0aW9uICE9PSBmYWxzZSApO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHJldmlvdXNNYXRlcmlhbCA9ICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCgpIDogdW5kZWZpbmVkICk7XHJcblxyXG4gICAgICAgIHRoaXMub2JqZWN0ID0ge1xyXG4gICAgICAgICAgbmFtZSA6IG5hbWUgfHwgJycsXHJcbiAgICAgICAgICBmcm9tRGVjbGFyYXRpb24gOiAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKSxcclxuXHJcbiAgICAgICAgICBnZW9tZXRyeSA6IHtcclxuICAgICAgICAgICAgdmVydGljZXMgOiBbXSxcclxuICAgICAgICAgICAgbm9ybWFscyAgOiBbXSxcclxuICAgICAgICAgICAgdXZzICAgICAgOiBbXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1hdGVyaWFscyA6IFtdLFxyXG4gICAgICAgICAgc21vb3RoIDogdHJ1ZSxcclxuXHJcbiAgICAgICAgICBzdGFydE1hdGVyaWFsIDogZnVuY3Rpb24oIG5hbWUsIGxpYnJhcmllcyApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX2ZpbmFsaXplKCBmYWxzZSApO1xyXG5cclxuICAgICAgICAgICAgLy8gTmV3IHVzZW10bCBkZWNsYXJhdGlvbiBvdmVyd3JpdGVzIGFuIGluaGVyaXRlZCBtYXRlcmlhbCwgZXhjZXB0IGlmIGZhY2VzIHdlcmUgZGVjbGFyZWRcclxuICAgICAgICAgICAgLy8gYWZ0ZXIgdGhlIG1hdGVyaWFsLCB0aGVuIGl0IG11c3QgYmUgcHJlc2VydmVkIGZvciBwcm9wZXIgTXVsdGlNYXRlcmlhbCBjb250aW51YXRpb24uXHJcbiAgICAgICAgICAgIGlmICggcHJldmlvdXMgJiYgKCBwcmV2aW91cy5pbmhlcml0ZWQgfHwgcHJldmlvdXMuZ3JvdXBDb3VudCA8PSAwICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnNwbGljZSggcHJldmlvdXMuaW5kZXgsIDEgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IHtcclxuICAgICAgICAgICAgICBpbmRleCAgICAgIDogdGhpcy5tYXRlcmlhbHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgIG5hbWUgICAgICAgOiBuYW1lIHx8ICcnLFxyXG4gICAgICAgICAgICAgIG10bGxpYiAgICAgOiAoIEFycmF5LmlzQXJyYXkoIGxpYnJhcmllcyApICYmIGxpYnJhcmllcy5sZW5ndGggPiAwID8gbGlicmFyaWVzWyBsaWJyYXJpZXMubGVuZ3RoIC0gMSBdIDogJycgKSxcclxuICAgICAgICAgICAgICBzbW9vdGggICAgIDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuc21vb3RoIDogdGhpcy5zbW9vdGggKSxcclxuICAgICAgICAgICAgICBncm91cFN0YXJ0IDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuZ3JvdXBFbmQgOiAwICksXHJcbiAgICAgICAgICAgICAgZ3JvdXBFbmQgICA6IC0xLFxyXG4gICAgICAgICAgICAgIGdyb3VwQ291bnQgOiAtMSxcclxuICAgICAgICAgICAgICBpbmhlcml0ZWQgIDogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICAgIGNsb25lIDogZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgaW5kZXggICAgICA6ICggdHlwZW9mIGluZGV4ID09PSAnbnVtYmVyJyA/IGluZGV4IDogdGhpcy5pbmRleCApLFxyXG4gICAgICAgICAgICAgICAgICBuYW1lICAgICAgIDogdGhpcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICBtdGxsaWIgICAgIDogdGhpcy5tdGxsaWIsXHJcbiAgICAgICAgICAgICAgICAgIHNtb290aCAgICAgOiB0aGlzLnNtb290aCxcclxuICAgICAgICAgICAgICAgICAgZ3JvdXBTdGFydCA6IHRoaXMuZ3JvdXBFbmQsXHJcbiAgICAgICAgICAgICAgICAgIGdyb3VwRW5kICAgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgZ3JvdXBDb3VudCA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICBpbmhlcml0ZWQgIDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMucHVzaCggbWF0ZXJpYWwgKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgIGN1cnJlbnRNYXRlcmlhbCA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFscy5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGVyaWFsc1sgdGhpcy5tYXRlcmlhbHMubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgX2ZpbmFsaXplIDogZnVuY3Rpb24oIGVuZCApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBsYXN0TXVsdGlNYXRlcmlhbCA9IHRoaXMuY3VycmVudE1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgIGlmICggbGFzdE11bHRpTWF0ZXJpYWwgJiYgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgPT09IC0xICkge1xyXG5cclxuICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cEVuZCA9IHRoaXMuZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoIC8gMztcclxuICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cENvdW50ID0gbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgLSBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cFN0YXJ0O1xyXG4gICAgICAgICAgICAgIGxhc3RNdWx0aU1hdGVyaWFsLmluaGVyaXRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gR3VhcmFudGVlIGF0IGxlYXN0IG9uZSBlbXB0eSBtYXRlcmlhbCwgdGhpcyBtYWtlcyB0aGUgY3JlYXRpb24gbGF0ZXIgbW9yZSBzdHJhaWdodCBmb3J3YXJkLlxyXG4gICAgICAgICAgICBpZiAoIGVuZCAhPT0gZmFsc2UgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID09PSAwICkge1xyXG4gICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbmFtZSAgIDogJycsXHJcbiAgICAgICAgICAgICAgICBzbW9vdGggOiB0aGlzLnNtb290aFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbGFzdE11bHRpTWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEluaGVyaXQgcHJldmlvdXMgb2JqZWN0cyBtYXRlcmlhbC5cclxuICAgICAgICAvLyBTcGVjIHRlbGxzIHVzIHRoYXQgYSBkZWNsYXJlZCBtYXRlcmlhbCBtdXN0IGJlIHNldCB0byBhbGwgb2JqZWN0cyB1bnRpbCBhIG5ldyBtYXRlcmlhbCBpcyBkZWNsYXJlZC5cclxuICAgICAgICAvLyBJZiBhIHVzZW10bCBkZWNsYXJhdGlvbiBpcyBlbmNvdW50ZXJlZCB3aGlsZSB0aGlzIG5ldyBvYmplY3QgaXMgYmVpbmcgcGFyc2VkLCBpdCB3aWxsXHJcbiAgICAgICAgLy8gb3ZlcndyaXRlIHRoZSBpbmhlcml0ZWQgbWF0ZXJpYWwuIEV4Y2VwdGlvbiBiZWluZyB0aGF0IHRoZXJlIHdhcyBhbHJlYWR5IGZhY2UgZGVjbGFyYXRpb25zXHJcbiAgICAgICAgLy8gdG8gdGhlIGluaGVyaXRlZCBtYXRlcmlhbCwgdGhlbiBpdCB3aWxsIGJlIHByZXNlcnZlZCBmb3IgcHJvcGVyIE11bHRpTWF0ZXJpYWwgY29udGludWF0aW9uLlxyXG5cclxuICAgICAgICBpZiAoIHByZXZpb3VzTWF0ZXJpYWwgJiYgcHJldmlvdXNNYXRlcmlhbC5uYW1lICYmIHR5cGVvZiBwcmV2aW91c01hdGVyaWFsLmNsb25lID09PSBcImZ1bmN0aW9uXCIgKSB7XHJcblxyXG4gICAgICAgICAgdmFyIGRlY2xhcmVkID0gcHJldmlvdXNNYXRlcmlhbC5jbG9uZSggMCApO1xyXG4gICAgICAgICAgZGVjbGFyZWQuaW5oZXJpdGVkID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMub2JqZWN0Lm1hdGVyaWFscy5wdXNoKCBkZWNsYXJlZCApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKCB0aGlzLm9iamVjdCApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZpbmFsaXplIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHBhcnNlVmVydGV4SW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFyc2VOb3JtYWxJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcbiAgICAgICAgcmV0dXJuICggaW5kZXggPj0gMCA/IGluZGV4IC0gMSA6IGluZGV4ICsgbGVuIC8gMyApICogMztcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwYXJzZVVWSW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDIgKSAqIDI7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkVmVydGV4OiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgIHZhciBzcmMgPSB0aGlzLnZlcnRpY2VzO1xyXG4gICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS52ZXJ0aWNlcztcclxuXHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkVmVydGV4TGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICB2YXIgc3JjID0gdGhpcy52ZXJ0aWNlcztcclxuICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudmVydGljZXM7XHJcblxyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDIgXSApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZE5vcm1hbCA6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgdmFyIHNyYyA9IHRoaXMubm9ybWFscztcclxuICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkubm9ybWFscztcclxuXHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkVVY6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgdmFyIHNyYyA9IHRoaXMudXZzO1xyXG4gICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZFVWTGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICB2YXIgc3JjID0gdGhpcy51dnM7XHJcbiAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnV2cztcclxuXHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGRGYWNlOiBmdW5jdGlvbiAoIGEsIGIsIGMsIGQsIHVhLCB1YiwgdWMsIHVkLCBuYSwgbmIsIG5jLCBuZCApIHtcclxuXHJcbiAgICAgICAgdmFyIHZMZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdmFyIGlhID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBhLCB2TGVuICk7XHJcbiAgICAgICAgdmFyIGliID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBiLCB2TGVuICk7XHJcbiAgICAgICAgdmFyIGljID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBjLCB2TGVuICk7XHJcbiAgICAgICAgdmFyIGlkO1xyXG5cclxuICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBkLCB2TGVuICk7XHJcblxyXG4gICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGlhLCBpYiwgaWQgKTtcclxuICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCB1YSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgIHZhciB1dkxlbiA9IHRoaXMudXZzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICBpYSA9IHRoaXMucGFyc2VVVkluZGV4KCB1YSwgdXZMZW4gKTtcclxuICAgICAgICAgIGliID0gdGhpcy5wYXJzZVVWSW5kZXgoIHViLCB1dkxlbiApO1xyXG4gICAgICAgICAgaWMgPSB0aGlzLnBhcnNlVVZJbmRleCggdWMsIHV2TGVuICk7XHJcblxyXG4gICAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZFVWKCBpYSwgaWIsIGljICk7XHJcblxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVkLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRVViggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFVWKCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggbmEgIT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAvLyBOb3JtYWxzIGFyZSBtYW55IHRpbWVzIHRoZSBzYW1lLiBJZiBzbywgc2tpcCBmdW5jdGlvbiBjYWxsIGFuZCBwYXJzZUludC5cclxuICAgICAgICAgIHZhciBuTGVuID0gdGhpcy5ub3JtYWxzLmxlbmd0aDtcclxuICAgICAgICAgIGlhID0gdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYSwgbkxlbiApO1xyXG5cclxuICAgICAgICAgIGliID0gbmEgPT09IG5iID8gaWEgOiB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5iLCBuTGVuICk7XHJcbiAgICAgICAgICBpYyA9IG5hID09PSBuYyA/IGlhIDogdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYywgbkxlbiApO1xyXG5cclxuICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgaWQgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5kLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZExpbmVHZW9tZXRyeTogZnVuY3Rpb24gKCB2ZXJ0aWNlcywgdXZzICkge1xyXG5cclxuICAgICAgICB0aGlzLm9iamVjdC5nZW9tZXRyeS50eXBlID0gJ0xpbmUnO1xyXG5cclxuICAgICAgICB2YXIgdkxlbiA9IHRoaXMudmVydGljZXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciB1dkxlbiA9IHRoaXMudXZzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgZm9yICggdmFyIHZpID0gMCwgbCA9IHZlcnRpY2VzLmxlbmd0aDsgdmkgPCBsOyB2aSArKyApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLmFkZFZlcnRleExpbmUoIHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggdmVydGljZXNbIHZpIF0sIHZMZW4gKSApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoIHZhciB1dmkgPSAwLCBsID0gdXZzLmxlbmd0aDsgdXZpIDwgbDsgdXZpICsrICkge1xyXG5cclxuICAgICAgICAgIHRoaXMuYWRkVVZMaW5lKCB0aGlzLnBhcnNlVVZJbmRleCggdXZzWyB1dmkgXSwgdXZMZW4gKSApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0ZS5zdGFydE9iamVjdCggJycsIGZhbHNlICk7XHJcblxyXG4gICAgcmV0dXJuIHN0YXRlO1xyXG5cclxuICB9LFxyXG5cclxuICBwYXJzZTogZnVuY3Rpb24gKCB0ZXh0ICkge1xyXG5cclxuICAgIGNvbnNvbGUudGltZSggJ09CSkxvYWRlcicgKTtcclxuXHJcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9jcmVhdGVQYXJzZXJTdGF0ZSgpO1xyXG5cclxuICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxyXFxuJyApICE9PSAtIDEgKSB7XHJcblxyXG4gICAgICAvLyBUaGlzIGlzIGZhc3RlciB0aGFuIFN0cmluZy5zcGxpdCB3aXRoIHJlZ2V4IHRoYXQgc3BsaXRzIG9uIGJvdGhcclxuICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSggJ1xcclxcbicsICdcXG4nICk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaW5lcyA9IHRleHQuc3BsaXQoICdcXG4nICk7XHJcbiAgICB2YXIgbGluZSA9ICcnLCBsaW5lRmlyc3RDaGFyID0gJycsIGxpbmVTZWNvbmRDaGFyID0gJyc7XHJcbiAgICB2YXIgbGluZUxlbmd0aCA9IDA7XHJcbiAgICB2YXIgcmVzdWx0ID0gW107XHJcblxyXG4gICAgLy8gRmFzdGVyIHRvIGp1c3QgdHJpbSBsZWZ0IHNpZGUgb2YgdGhlIGxpbmUuIFVzZSBpZiBhdmFpbGFibGUuXHJcbiAgICB2YXIgdHJpbUxlZnQgPSAoIHR5cGVvZiAnJy50cmltTGVmdCA9PT0gJ2Z1bmN0aW9uJyApO1xyXG5cclxuICAgIGZvciAoIHZhciBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XHJcblxyXG4gICAgICBsaW5lID0gbGluZXNbIGkgXTtcclxuXHJcbiAgICAgIGxpbmUgPSB0cmltTGVmdCA/IGxpbmUudHJpbUxlZnQoKSA6IGxpbmUudHJpbSgpO1xyXG5cclxuICAgICAgbGluZUxlbmd0aCA9IGxpbmUubGVuZ3RoO1xyXG5cclxuICAgICAgaWYgKCBsaW5lTGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICBsaW5lRmlyc3RDaGFyID0gbGluZS5jaGFyQXQoIDAgKTtcclxuXHJcbiAgICAgIC8vIEB0b2RvIGludm9rZSBwYXNzZWQgaW4gaGFuZGxlciBpZiBhbnlcclxuICAgICAgaWYgKCBsaW5lRmlyc3RDaGFyID09PSAnIycgKSBjb250aW51ZTtcclxuXHJcbiAgICAgIGlmICggbGluZUZpcnN0Q2hhciA9PT0gJ3YnICkge1xyXG5cclxuICAgICAgICBsaW5lU2Vjb25kQ2hhciA9IGxpbmUuY2hhckF0KCAxICk7XHJcblxyXG4gICAgICAgIGlmICggbGluZVNlY29uZENoYXIgPT09ICcgJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnZlcnRleF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAxICAgICAgMiAgICAgIDNcclxuICAgICAgICAgIC8vIFtcInYgMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuXHJcbiAgICAgICAgICBzdGF0ZS52ZXJ0aWNlcy5wdXNoKFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDMgXSApXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJ24nICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAubm9ybWFsX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAxICAgICAgMiAgICAgIDNcclxuICAgICAgICAgIC8vIFtcInZuIDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcblxyXG4gICAgICAgICAgc3RhdGUubm9ybWFscy5wdXNoKFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDMgXSApXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJ3QnICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAudXZfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgMSAgICAgIDJcclxuICAgICAgICAgIC8vIFtcInZ0IDAuMSAwLjJcIiwgXCIwLjFcIiwgXCIwLjJcIl1cclxuXHJcbiAgICAgICAgICBzdGF0ZS51dnMucHVzaChcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCB2ZXJ0ZXgvbm9ybWFsL3V2IGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIGlmICggbGluZUZpcnN0Q2hhciA9PT0gXCJmXCIgKSB7XHJcblxyXG4gICAgICAgIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91dl9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbFxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAgICAgIDEgICAgMiAgICAzICAgIDQgICAgNSAgICA2ICAgIDcgICAgOCAgICA5ICAgMTAgICAgICAgICAxMSAgICAgICAgIDEyXHJcbiAgICAgICAgICAvLyBbXCJmIDEvMS8xIDIvMi8yIDMvMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDcgXSwgcmVzdWx0WyAxMCBdLFxyXG4gICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgOCBdLCByZXN1bHRbIDExIF0sXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMyBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA5IF0sIHJlc3VsdFsgMTIgXVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91di5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyBmIHZlcnRleC91diB2ZXJ0ZXgvdXYgdmVydGV4L3V2XHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgIC8vIFtcImYgMS8xIDIvMiAzLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMyBdLCByZXN1bHRbIDUgXSwgcmVzdWx0WyA3IF0sXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMiBdLCByZXN1bHRbIDQgXSwgcmVzdWx0WyA2IF0sIHJlc3VsdFsgOCBdXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLmZhY2VfdmVydGV4X25vcm1hbC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgIC8vIFtcImYgMS8vMSAyLy8yIDMvLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMyBdLCByZXN1bHRbIDUgXSwgcmVzdWx0WyA3IF0sXHJcbiAgICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXguZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gZiB2ZXJ0ZXggdmVydGV4IHZlcnRleFxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgIDEgICAgMiAgICAzICAgNFxyXG4gICAgICAgICAgLy8gW1wiZiAxIDIgM1wiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMiBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA0IF1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIlVuZXhwZWN0ZWQgZmFjZSBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwibFwiICkge1xyXG5cclxuICAgICAgICB2YXIgbGluZVBhcnRzID0gbGluZS5zdWJzdHJpbmcoIDEgKS50cmltKCkuc3BsaXQoIFwiIFwiICk7XHJcbiAgICAgICAgdmFyIGxpbmVWZXJ0aWNlcyA9IFtdLCBsaW5lVVZzID0gW107XHJcblxyXG4gICAgICAgIGlmICggbGluZS5pbmRleE9mKCBcIi9cIiApID09PSAtIDEgKSB7XHJcblxyXG4gICAgICAgICAgbGluZVZlcnRpY2VzID0gbGluZVBhcnRzO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIGZvciAoIHZhciBsaSA9IDAsIGxsZW4gPSBsaW5lUGFydHMubGVuZ3RoOyBsaSA8IGxsZW47IGxpICsrICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcnRzID0gbGluZVBhcnRzWyBsaSBdLnNwbGl0KCBcIi9cIiApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBwYXJ0c1sgMCBdICE9PSBcIlwiICkgbGluZVZlcnRpY2VzLnB1c2goIHBhcnRzWyAwIF0gKTtcclxuICAgICAgICAgICAgaWYgKCBwYXJ0c1sgMSBdICE9PSBcIlwiICkgbGluZVVWcy5wdXNoKCBwYXJ0c1sgMSBdICk7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgc3RhdGUuYWRkTGluZUdlb21ldHJ5KCBsaW5lVmVydGljZXMsIGxpbmVVVnMgKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAub2JqZWN0X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgIC8vIG8gb2JqZWN0X25hbWVcclxuICAgICAgICAvLyBvclxyXG4gICAgICAgIC8vIGcgZ3JvdXBfbmFtZVxyXG5cclxuICAgICAgICB2YXIgbmFtZSA9IHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKTtcclxuICAgICAgICBzdGF0ZS5zdGFydE9iamVjdCggbmFtZSApO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggdGhpcy5yZWdleHAubWF0ZXJpYWxfdXNlX3BhdHRlcm4udGVzdCggbGluZSApICkge1xyXG5cclxuICAgICAgICAvLyBtYXRlcmlhbFxyXG5cclxuICAgICAgICBzdGF0ZS5vYmplY3Quc3RhcnRNYXRlcmlhbCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCksIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF9saWJyYXJ5X3BhdHRlcm4udGVzdCggbGluZSApICkge1xyXG5cclxuICAgICAgICAvLyBtdGwgZmlsZVxyXG5cclxuICAgICAgICBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcy5wdXNoKCBsaW5lLnN1YnN0cmluZyggNyApLnRyaW0oKSApO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5zbW9vdGhpbmdfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgLy8gc21vb3RoIHNoYWRpbmdcclxuXHJcbiAgICAgICAgLy8gQHRvZG8gSGFuZGxlIGZpbGVzIHRoYXQgaGF2ZSB2YXJ5aW5nIHNtb290aCB2YWx1ZXMgZm9yIGEgc2V0IG9mIGZhY2VzIGluc2lkZSBvbmUgZ2VvbWV0cnksXHJcbiAgICAgICAgLy8gYnV0IGRvZXMgbm90IGRlZmluZSBhIHVzZW10bCBmb3IgZWFjaCBmYWNlIHNldC5cclxuICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBkZXRlY3RlZCBhbmQgYSBkdW1teSBtYXRlcmlhbCBjcmVhdGVkIChsYXRlciBNdWx0aU1hdGVyaWFsIGFuZCBnZW9tZXRyeSBncm91cHMpLlxyXG4gICAgICAgIC8vIFRoaXMgcmVxdWlyZXMgc29tZSBjYXJlIHRvIG5vdCBjcmVhdGUgZXh0cmEgbWF0ZXJpYWwgb24gZWFjaCBzbW9vdGggdmFsdWUgZm9yIFwibm9ybWFsXCIgb2JqIGZpbGVzLlxyXG4gICAgICAgIC8vIHdoZXJlIGV4cGxpY2l0IHVzZW10bCBkZWZpbmVzIGdlb21ldHJ5IGdyb3Vwcy5cclxuICAgICAgICAvLyBFeGFtcGxlIGFzc2V0OiBleGFtcGxlcy9tb2RlbHMvb2JqL2NlcmJlcnVzL0NlcmJlcnVzLm9ialxyXG5cclxuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHRbIDEgXS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBzdGF0ZS5vYmplY3Quc21vb3RoID0gKCB2YWx1ZSA9PT0gJzEnIHx8IHZhbHVlID09PSAnb24nICk7XHJcblxyXG4gICAgICAgIHZhciBtYXRlcmlhbCA9IHN0YXRlLm9iamVjdC5jdXJyZW50TWF0ZXJpYWwoKTtcclxuICAgICAgICBpZiAoIG1hdGVyaWFsICkge1xyXG5cclxuICAgICAgICAgIG1hdGVyaWFsLnNtb290aCA9IHN0YXRlLm9iamVjdC5zbW9vdGg7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIEhhbmRsZSBudWxsIHRlcm1pbmF0ZWQgZmlsZXMgd2l0aG91dCBleGNlcHRpb25cclxuICAgICAgICBpZiAoIGxpbmUgPT09ICdcXDAnICkgY29udGludWU7XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGUuZmluYWxpemUoKTtcclxuXHJcbiAgICB2YXIgY29udGFpbmVyID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICBjb250YWluZXIubWF0ZXJpYWxMaWJyYXJpZXMgPSBbXS5jb25jYXQoIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcblxyXG4gICAgZm9yICggdmFyIGkgPSAwLCBsID0gc3RhdGUub2JqZWN0cy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgdmFyIG9iamVjdCA9IHN0YXRlLm9iamVjdHNbIGkgXTtcclxuICAgICAgdmFyIGdlb21ldHJ5ID0gb2JqZWN0Lmdlb21ldHJ5O1xyXG4gICAgICB2YXIgbWF0ZXJpYWxzID0gb2JqZWN0Lm1hdGVyaWFscztcclxuICAgICAgdmFyIGlzTGluZSA9ICggZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmUnICk7XHJcblxyXG4gICAgICAvLyBTa2lwIG8vZyBsaW5lIGRlY2xhcmF0aW9ucyB0aGF0IGRpZCBub3QgZm9sbG93IHdpdGggYW55IGZhY2VzXHJcbiAgICAgIGlmICggZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICB2YXIgYnVmZmVyZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcclxuXHJcbiAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkudmVydGljZXMgKSwgMyApICk7XHJcblxyXG4gICAgICBpZiAoIGdlb21ldHJ5Lm5vcm1hbHMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCAnbm9ybWFsJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkubm9ybWFscyApLCAzICkgKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIGdlb21ldHJ5LnV2cy5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5LnV2cyApLCAyICkgKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENyZWF0ZSBtYXRlcmlhbHNcclxuXHJcbiAgICAgIHZhciBjcmVhdGVkTWF0ZXJpYWxzID0gW107XHJcblxyXG4gICAgICBmb3IgKCB2YXIgbWkgPSAwLCBtaUxlbiA9IG1hdGVyaWFscy5sZW5ndGg7IG1pIDwgbWlMZW4gOyBtaSsrICkge1xyXG5cclxuICAgICAgICB2YXIgc291cmNlTWF0ZXJpYWwgPSBtYXRlcmlhbHNbbWldO1xyXG4gICAgICAgIHZhciBtYXRlcmlhbCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFscyAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICBtYXRlcmlhbCA9IHRoaXMubWF0ZXJpYWxzLmNyZWF0ZSggc291cmNlTWF0ZXJpYWwubmFtZSApO1xyXG5cclxuICAgICAgICAgIC8vIG10bCBldGMuIGxvYWRlcnMgcHJvYmFibHkgY2FuJ3QgY3JlYXRlIGxpbmUgbWF0ZXJpYWxzIGNvcnJlY3RseSwgY29weSBwcm9wZXJ0aWVzIHRvIGEgbGluZSBtYXRlcmlhbC5cclxuICAgICAgICAgIGlmICggaXNMaW5lICYmIG1hdGVyaWFsICYmICEgKCBtYXRlcmlhbCBpbnN0YW5jZW9mIFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsICkgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWxMaW5lID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgIG1hdGVyaWFsTGluZS5jb3B5KCBtYXRlcmlhbCApO1xyXG4gICAgICAgICAgICBtYXRlcmlhbCA9IG1hdGVyaWFsTGluZTtcclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCAhIG1hdGVyaWFsICkge1xyXG5cclxuICAgICAgICAgIG1hdGVyaWFsID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgpIDogbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCkgKTtcclxuICAgICAgICAgIG1hdGVyaWFsLm5hbWUgPSBzb3VyY2VNYXRlcmlhbC5uYW1lO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hdGVyaWFsLnNoYWRpbmcgPSBzb3VyY2VNYXRlcmlhbC5zbW9vdGggPyBUSFJFRS5TbW9vdGhTaGFkaW5nIDogVEhSRUUuRmxhdFNoYWRpbmc7XHJcblxyXG4gICAgICAgIGNyZWF0ZWRNYXRlcmlhbHMucHVzaChtYXRlcmlhbCk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDcmVhdGUgbWVzaFxyXG5cclxuICAgICAgdmFyIG1lc2g7XHJcblxyXG4gICAgICBpZiAoIGNyZWF0ZWRNYXRlcmlhbHMubGVuZ3RoID4gMSApIHtcclxuXHJcbiAgICAgICAgZm9yICggdmFyIG1pID0gMCwgbWlMZW4gPSBtYXRlcmlhbHMubGVuZ3RoOyBtaSA8IG1pTGVuIDsgbWkrKyApIHtcclxuXHJcbiAgICAgICAgICB2YXIgc291cmNlTWF0ZXJpYWwgPSBtYXRlcmlhbHNbbWldO1xyXG4gICAgICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkR3JvdXAoIHNvdXJjZU1hdGVyaWFsLmdyb3VwU3RhcnQsIHNvdXJjZU1hdGVyaWFsLmdyb3VwQ291bnQsIG1pICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG11bHRpTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTXVsdGlNYXRlcmlhbCggY3JlYXRlZE1hdGVyaWFscyApO1xyXG4gICAgICAgIG1lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBtdWx0aU1hdGVyaWFsICkgOiBuZXcgVEhSRUUuTGluZSggYnVmZmVyZ2VvbWV0cnksIG11bHRpTWF0ZXJpYWwgKSApO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbIDAgXSApIDogbmV3IFRIUkVFLkxpbmUoIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzWyAwIF0gKSApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBtZXNoLm5hbWUgPSBvYmplY3QubmFtZTtcclxuXHJcbiAgICAgIGNvbnRhaW5lci5hZGQoIG1lc2ggKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS50aW1lRW5kKCAnT0JKTG9hZGVyJyApO1xyXG5cclxuICAgIHJldHVybiBjb250YWluZXI7XHJcblxyXG4gIH1cclxuXHJcbn07IiwiVEhSRUUuVml2ZUNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoIGlkICkge1xyXG5cclxuICBUSFJFRS5PYmplY3QzRC5jYWxsKCB0aGlzICk7XHJcblxyXG4gIHRoaXMubWF0cml4QXV0b1VwZGF0ZSA9IGZhbHNlO1xyXG4gIHRoaXMuc3RhbmRpbmdNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xyXG5cclxuICB2YXIgc2NvcGUgPSB0aGlzO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB1cGRhdGUgKTtcclxuXHJcbiAgICB2YXIgZ2FtZXBhZCA9IG5hdmlnYXRvci5nZXRHYW1lcGFkcygpWyBpZCBdO1xyXG5cclxuICAgIGlmICggZ2FtZXBhZCAhPT0gdW5kZWZpbmVkICYmIGdhbWVwYWQucG9zZSAhPT0gbnVsbCAmJiBnYW1lcGFkLnBvc2UucG9zaXRpb24gIT09IG51bGwgKSB7XHJcblxyXG4gICAgICB2YXIgcG9zZSA9IGdhbWVwYWQucG9zZTtcclxuXHJcbiAgICAgIHNjb3BlLnBvc2l0aW9uLmZyb21BcnJheSggcG9zZS5wb3NpdGlvbiApO1xyXG4gICAgICBzY29wZS5xdWF0ZXJuaW9uLmZyb21BcnJheSggcG9zZS5vcmllbnRhdGlvbiApO1xyXG4gICAgICBzY29wZS5tYXRyaXguY29tcG9zZSggc2NvcGUucG9zaXRpb24sIHNjb3BlLnF1YXRlcm5pb24sIHNjb3BlLnNjYWxlICk7XHJcbiAgICAgIHNjb3BlLm1hdHJpeC5tdWx0aXBseU1hdHJpY2VzKCBzY29wZS5zdGFuZGluZ01hdHJpeCwgc2NvcGUubWF0cml4ICk7XHJcbiAgICAgIHNjb3BlLm1hdHJpeFdvcmxkTmVlZHNVcGRhdGUgPSB0cnVlO1xyXG5cclxuICAgICAgc2NvcGUudmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIHNjb3BlLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk7XHJcblxyXG59O1xyXG5cclxuVEhSRUUuVml2ZUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVEhSRUUuT2JqZWN0M0QucHJvdG90eXBlICk7XHJcblRIUkVFLlZpdmVDb250cm9sbGVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRIUkVFLlZpdmVDb250cm9sbGVyOyIsIi8qKlxuICogQGF1dGhvciBkbWFyY29zIC8gaHR0cHM6Ly9naXRodWIuY29tL2RtYXJjb3NcbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb21cbiAqL1xuXG5USFJFRS5WUkNvbnRyb2xzID0gZnVuY3Rpb24gKCBvYmplY3QsIG9uRXJyb3IgKSB7XG5cblx0dmFyIHNjb3BlID0gdGhpcztcblxuXHR2YXIgdnJEaXNwbGF5LCB2ckRpc3BsYXlzO1xuXG5cdHZhciBzdGFuZGluZ01hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XG5cblx0ZnVuY3Rpb24gZ290VlJEaXNwbGF5cyggZGlzcGxheXMgKSB7XG5cblx0XHR2ckRpc3BsYXlzID0gZGlzcGxheXM7XG5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBkaXNwbGF5cy5sZW5ndGg7IGkgKysgKSB7XG5cblx0XHRcdGlmICggKCAnVlJEaXNwbGF5JyBpbiB3aW5kb3cgJiYgZGlzcGxheXNbIGkgXSBpbnN0YW5jZW9mIFZSRGlzcGxheSApIHx8XG5cdFx0XHRcdCAoICdQb3NpdGlvblNlbnNvclZSRGV2aWNlJyBpbiB3aW5kb3cgJiYgZGlzcGxheXNbIGkgXSBpbnN0YW5jZW9mIFBvc2l0aW9uU2Vuc29yVlJEZXZpY2UgKSApIHtcblxuXHRcdFx0XHR2ckRpc3BsYXkgPSBkaXNwbGF5c1sgaSBdO1xuXHRcdFx0XHRicmVhazsgIC8vIFdlIGtlZXAgdGhlIGZpcnN0IHdlIGVuY291bnRlclxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZiAoIHZyRGlzcGxheSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRpZiAoIG9uRXJyb3IgKSBvbkVycm9yKCAnVlIgaW5wdXQgbm90IGF2YWlsYWJsZS4nICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGlmICggbmF2aWdhdG9yLmdldFZSRGlzcGxheXMgKSB7XG5cblx0XHRuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cygpLnRoZW4oIGdvdFZSRGlzcGxheXMgKTtcblxuXHR9IGVsc2UgaWYgKCBuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzICkge1xuXG5cdFx0Ly8gRGVwcmVjYXRlZCBBUEkuXG5cdFx0bmF2aWdhdG9yLmdldFZSRGV2aWNlcygpLnRoZW4oIGdvdFZSRGlzcGxheXMgKTtcblxuXHR9XG5cblx0Ly8gdGhlIFJpZnQgU0RLIHJldHVybnMgdGhlIHBvc2l0aW9uIGluIG1ldGVyc1xuXHQvLyB0aGlzIHNjYWxlIGZhY3RvciBhbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIGhvdyBtZXRlcnNcblx0Ly8gYXJlIGNvbnZlcnRlZCB0byBzY2VuZSB1bml0cy5cblxuXHR0aGlzLnNjYWxlID0gMTtcblxuXHQvLyBJZiB0cnVlIHdpbGwgdXNlIFwic3RhbmRpbmcgc3BhY2VcIiBjb29yZGluYXRlIHN5c3RlbSB3aGVyZSB5PTAgaXMgdGhlXG5cdC8vIGZsb29yIGFuZCB4PTAsIHo9MCBpcyB0aGUgY2VudGVyIG9mIHRoZSByb29tLlxuXHR0aGlzLnN0YW5kaW5nID0gZmFsc2U7XG5cblx0Ly8gRGlzdGFuY2UgZnJvbSB0aGUgdXNlcnMgZXllcyB0byB0aGUgZmxvb3IgaW4gbWV0ZXJzLiBVc2VkIHdoZW5cblx0Ly8gc3RhbmRpbmc9dHJ1ZSBidXQgdGhlIFZSRGlzcGxheSBkb2Vzbid0IHByb3ZpZGUgc3RhZ2VQYXJhbWV0ZXJzLlxuXHR0aGlzLnVzZXJIZWlnaHQgPSAxLjY7XG5cblx0dGhpcy5nZXRWUkRpc3BsYXkgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdnJEaXNwbGF5O1xuXG5cdH07XG5cblx0dGhpcy5nZXRWUkRpc3BsYXlzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHZyRGlzcGxheXM7XG5cblx0fTtcblxuXHR0aGlzLmdldFN0YW5kaW5nTWF0cml4ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHN0YW5kaW5nTWF0cml4O1xuXG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIHZyRGlzcGxheSApIHtcblxuXHRcdFx0aWYgKCB2ckRpc3BsYXkuZ2V0UG9zZSApIHtcblxuXHRcdFx0XHR2YXIgcG9zZSA9IHZyRGlzcGxheS5nZXRQb3NlKCk7XG5cblx0XHRcdFx0aWYgKCBwb3NlLm9yaWVudGF0aW9uICE9PSBudWxsICkge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnF1YXRlcm5pb24uZnJvbUFycmF5KCBwb3NlLm9yaWVudGF0aW9uICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcG9zZS5wb3NpdGlvbiAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdG9iamVjdC5wb3NpdGlvbi5mcm9tQXJyYXkoIHBvc2UucG9zaXRpb24gKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnBvc2l0aW9uLnNldCggMCwgMCwgMCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBEZXByZWNhdGVkIEFQSS5cblx0XHRcdFx0dmFyIHN0YXRlID0gdnJEaXNwbGF5LmdldFN0YXRlKCk7XG5cblx0XHRcdFx0aWYgKCBzdGF0ZS5vcmllbnRhdGlvbiAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdG9iamVjdC5xdWF0ZXJuaW9uLmNvcHkoIHN0YXRlLm9yaWVudGF0aW9uICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggc3RhdGUucG9zaXRpb24gIT09IG51bGwgKSB7XG5cblx0XHRcdFx0XHRvYmplY3QucG9zaXRpb24uY29weSggc3RhdGUucG9zaXRpb24gKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnBvc2l0aW9uLnNldCggMCwgMCwgMCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHRoaXMuc3RhbmRpbmcgKSB7XG5cblx0XHRcdFx0aWYgKCB2ckRpc3BsYXkuc3RhZ2VQYXJhbWV0ZXJzICkge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnVwZGF0ZU1hdHJpeCgpO1xuXG5cdFx0XHRcdFx0c3RhbmRpbmdNYXRyaXguZnJvbUFycmF5KCB2ckRpc3BsYXkuc3RhZ2VQYXJhbWV0ZXJzLnNpdHRpbmdUb1N0YW5kaW5nVHJhbnNmb3JtICk7XG5cdFx0XHRcdFx0b2JqZWN0LmFwcGx5TWF0cml4KCBzdGFuZGluZ01hdHJpeCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRvYmplY3QucG9zaXRpb24uc2V0WSggb2JqZWN0LnBvc2l0aW9uLnkgKyB0aGlzLnVzZXJIZWlnaHQgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0b2JqZWN0LnBvc2l0aW9uLm11bHRpcGx5U2NhbGFyKCBzY29wZS5zY2FsZSApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5yZXNldFBvc2UgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIHZyRGlzcGxheSApIHtcblxuXHRcdFx0aWYgKCB2ckRpc3BsYXkucmVzZXRQb3NlICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0dnJEaXNwbGF5LnJlc2V0UG9zZSgpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCB2ckRpc3BsYXkucmVzZXRTZW5zb3IgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHQvLyBEZXByZWNhdGVkIEFQSS5cblx0XHRcdFx0dnJEaXNwbGF5LnJlc2V0U2Vuc29yKCk7XG5cblx0XHRcdH0gZWxzZSBpZiAoIHZyRGlzcGxheS56ZXJvU2Vuc29yICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0Ly8gUmVhbGx5IGRlcHJlY2F0ZWQgQVBJLlxuXHRcdFx0XHR2ckRpc3BsYXkuemVyb1NlbnNvcigpO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLnJlc2V0U2Vuc29yID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0Y29uc29sZS53YXJuKCAnVEhSRUUuVlJDb250cm9sczogLnJlc2V0U2Vuc29yKCkgaXMgbm93IC5yZXNldFBvc2UoKS4nICk7XG5cdFx0dGhpcy5yZXNldFBvc2UoKTtcblxuXHR9O1xuXG5cdHRoaXMuemVyb1NlbnNvciA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGNvbnNvbGUud2FybiggJ1RIUkVFLlZSQ29udHJvbHM6IC56ZXJvU2Vuc29yKCkgaXMgbm93IC5yZXNldFBvc2UoKS4nICk7XG5cdFx0dGhpcy5yZXNldFBvc2UoKTtcblxuXHR9O1xuXG5cdHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHZyRGlzcGxheSA9IG51bGw7XG5cblx0fTtcblxufTtcbiIsIi8qKlxuICogQGF1dGhvciBkbWFyY29zIC8gaHR0cHM6Ly9naXRodWIuY29tL2RtYXJjb3NcbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb21cbiAqXG4gKiBXZWJWUiBTcGVjOiBodHRwOi8vbW96dnIuZ2l0aHViLmlvL3dlYnZyLXNwZWMvd2VidnIuaHRtbFxuICpcbiAqIEZpcmVmb3g6IGh0dHA6Ly9tb3p2ci5jb20vZG93bmxvYWRzL1xuICogQ2hyb21pdW06IGh0dHBzOi8vZHJpdmUuZ29vZ2xlLmNvbS9mb2xkZXJ2aWV3P2lkPTBCenVkTHQyMkJxR1JiVzlXVEhNdE9XTXpOalEmdXNwPXNoYXJpbmcjbGlzdFxuICpcbiAqL1xuXG5USFJFRS5WUkVmZmVjdCA9IGZ1bmN0aW9uICggcmVuZGVyZXIsIG9uRXJyb3IgKSB7XG5cblx0dmFyIGlzV2ViVlIxID0gdHJ1ZTtcblxuXHR2YXIgdnJEaXNwbGF5LCB2ckRpc3BsYXlzO1xuXHR2YXIgZXllVHJhbnNsYXRpb25MID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblx0dmFyIGV5ZVRyYW5zbGF0aW9uUiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cdHZhciByZW5kZXJSZWN0TCwgcmVuZGVyUmVjdFI7XG5cdHZhciBleWVGT1ZMLCBleWVGT1ZSO1xuXG5cdGZ1bmN0aW9uIGdvdFZSRGlzcGxheXMoIGRpc3BsYXlzICkge1xuXG5cdFx0dnJEaXNwbGF5cyA9IGRpc3BsYXlzO1xuXG5cdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgZGlzcGxheXMubGVuZ3RoOyBpICsrICkge1xuXG5cdFx0XHRpZiAoICdWUkRpc3BsYXknIGluIHdpbmRvdyAmJiBkaXNwbGF5c1sgaSBdIGluc3RhbmNlb2YgVlJEaXNwbGF5ICkge1xuXG5cdFx0XHRcdHZyRGlzcGxheSA9IGRpc3BsYXlzWyBpIF07XG5cdFx0XHRcdGlzV2ViVlIxID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7IC8vIFdlIGtlZXAgdGhlIGZpcnN0IHdlIGVuY291bnRlclxuXG5cdFx0XHR9IGVsc2UgaWYgKCAnSE1EVlJEZXZpY2UnIGluIHdpbmRvdyAmJiBkaXNwbGF5c1sgaSBdIGluc3RhbmNlb2YgSE1EVlJEZXZpY2UgKSB7XG5cblx0XHRcdFx0dnJEaXNwbGF5ID0gZGlzcGxheXNbIGkgXTtcblx0XHRcdFx0aXNXZWJWUjEgPSBmYWxzZTtcblx0XHRcdFx0YnJlYWs7IC8vIFdlIGtlZXAgdGhlIGZpcnN0IHdlIGVuY291bnRlclxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZiAoIHZyRGlzcGxheSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRpZiAoIG9uRXJyb3IgKSBvbkVycm9yKCAnSE1EIG5vdCBhdmFpbGFibGUnICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGlmICggbmF2aWdhdG9yLmdldFZSRGlzcGxheXMgKSB7XG5cblx0XHRuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cygpLnRoZW4oIGdvdFZSRGlzcGxheXMgKTtcblxuXHR9IGVsc2UgaWYgKCBuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzICkge1xuXG5cdFx0Ly8gRGVwcmVjYXRlZCBBUEkuXG5cdFx0bmF2aWdhdG9yLmdldFZSRGV2aWNlcygpLnRoZW4oIGdvdFZSRGlzcGxheXMgKTtcblxuXHR9XG5cblx0Ly9cblxuXHR0aGlzLmlzUHJlc2VudGluZyA9IGZhbHNlO1xuXHR0aGlzLnNjYWxlID0gMTtcblxuXHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdHZhciByZW5kZXJlclNpemUgPSByZW5kZXJlci5nZXRTaXplKCk7XG5cdHZhciByZW5kZXJlclBpeGVsUmF0aW8gPSByZW5kZXJlci5nZXRQaXhlbFJhdGlvKCk7XG5cblx0dGhpcy5nZXRWUkRpc3BsYXkgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdnJEaXNwbGF5O1xuXG5cdH07XG5cblx0dGhpcy5nZXRWUkRpc3BsYXlzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHZyRGlzcGxheXM7XG5cblx0fTtcblxuXHR0aGlzLnNldFNpemUgPSBmdW5jdGlvbiAoIHdpZHRoLCBoZWlnaHQgKSB7XG5cblx0XHRyZW5kZXJlclNpemUgPSB7IHdpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHQgfTtcblxuXHRcdGlmICggc2NvcGUuaXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHR2YXIgZXllUGFyYW1zTCA9IHZyRGlzcGxheS5nZXRFeWVQYXJhbWV0ZXJzKCAnbGVmdCcgKTtcblx0XHRcdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8oIDEgKTtcblxuXHRcdFx0aWYgKCBpc1dlYlZSMSApIHtcblxuXHRcdFx0XHRyZW5kZXJlci5zZXRTaXplKCBleWVQYXJhbXNMLnJlbmRlcldpZHRoICogMiwgZXllUGFyYW1zTC5yZW5kZXJIZWlnaHQsIGZhbHNlICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0cmVuZGVyZXIuc2V0U2l6ZSggZXllUGFyYW1zTC5yZW5kZXJSZWN0LndpZHRoICogMiwgZXllUGFyYW1zTC5yZW5kZXJSZWN0LmhlaWdodCwgZmFsc2UgKTtcblxuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0cmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyggcmVuZGVyZXJQaXhlbFJhdGlvICk7XG5cdFx0XHRyZW5kZXJlci5zZXRTaXplKCB3aWR0aCwgaGVpZ2h0ICk7XG5cblx0XHR9XG5cblx0fTtcblxuXHQvLyBmdWxsc2NyZWVuXG5cblx0dmFyIGNhbnZhcyA9IHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG5cdHZhciByZXF1ZXN0RnVsbHNjcmVlbjtcblx0dmFyIGV4aXRGdWxsc2NyZWVuO1xuXHR2YXIgZnVsbHNjcmVlbkVsZW1lbnQ7XG5cdHZhciBsZWZ0Qm91bmRzID0gWyAwLjAsIDAuMCwgMC41LCAxLjAgXTtcblx0dmFyIHJpZ2h0Qm91bmRzID0gWyAwLjUsIDAuMCwgMC41LCAxLjAgXTtcblxuXHRmdW5jdGlvbiBvbkZ1bGxzY3JlZW5DaGFuZ2UgKCkge1xuXG5cdFx0dmFyIHdhc1ByZXNlbnRpbmcgPSBzY29wZS5pc1ByZXNlbnRpbmc7XG5cdFx0c2NvcGUuaXNQcmVzZW50aW5nID0gdnJEaXNwbGF5ICE9PSB1bmRlZmluZWQgJiYgKCB2ckRpc3BsYXkuaXNQcmVzZW50aW5nIHx8ICggISBpc1dlYlZSMSAmJiBkb2N1bWVudFsgZnVsbHNjcmVlbkVsZW1lbnQgXSBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MRWxlbWVudCApICk7XG5cblx0XHRpZiAoIHNjb3BlLmlzUHJlc2VudGluZyApIHtcblxuXHRcdFx0dmFyIGV5ZVBhcmFtc0wgPSB2ckRpc3BsYXkuZ2V0RXllUGFyYW1ldGVycyggJ2xlZnQnICk7XG5cdFx0XHR2YXIgZXllV2lkdGgsIGV5ZUhlaWdodDtcblxuXHRcdFx0aWYgKCBpc1dlYlZSMSApIHtcblxuXHRcdFx0XHRleWVXaWR0aCA9IGV5ZVBhcmFtc0wucmVuZGVyV2lkdGg7XG5cdFx0XHRcdGV5ZUhlaWdodCA9IGV5ZVBhcmFtc0wucmVuZGVySGVpZ2h0O1xuXG5cdFx0XHRcdGlmICggdnJEaXNwbGF5LmdldExheWVycyApIHtcblxuXHRcdFx0XHRcdHZhciBsYXllcnMgPSB2ckRpc3BsYXkuZ2V0TGF5ZXJzKCk7XG5cdFx0XHRcdFx0aWYgKGxheWVycy5sZW5ndGgpIHtcblxuXHRcdFx0XHRcdFx0bGVmdEJvdW5kcyA9IGxheWVyc1swXS5sZWZ0Qm91bmRzIHx8IFsgMC4wLCAwLjAsIDAuNSwgMS4wIF07XG5cdFx0XHRcdFx0XHRyaWdodEJvdW5kcyA9IGxheWVyc1swXS5yaWdodEJvdW5kcyB8fCBbIDAuNSwgMC4wLCAwLjUsIDEuMCBdO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0ZXllV2lkdGggPSBleWVQYXJhbXNMLnJlbmRlclJlY3Qud2lkdGg7XG5cdFx0XHRcdGV5ZUhlaWdodCA9IGV5ZVBhcmFtc0wucmVuZGVyUmVjdC5oZWlnaHQ7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhd2FzUHJlc2VudGluZyApIHtcblxuXHRcdFx0XHRyZW5kZXJlclBpeGVsUmF0aW8gPSByZW5kZXJlci5nZXRQaXhlbFJhdGlvKCk7XG5cdFx0XHRcdHJlbmRlcmVyU2l6ZSA9IHJlbmRlcmVyLmdldFNpemUoKTtcblxuXHRcdFx0XHRyZW5kZXJlci5zZXRQaXhlbFJhdGlvKCAxICk7XG5cdFx0XHRcdHJlbmRlcmVyLnNldFNpemUoIGV5ZVdpZHRoICogMiwgZXllSGVpZ2h0LCBmYWxzZSApO1xuXG5cdFx0XHR9XG5cblx0XHR9IGVsc2UgaWYgKCB3YXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHRyZW5kZXJlci5zZXRQaXhlbFJhdGlvKCByZW5kZXJlclBpeGVsUmF0aW8gKTtcblx0XHRcdHJlbmRlcmVyLnNldFNpemUoIHJlbmRlcmVyU2l6ZS53aWR0aCwgcmVuZGVyZXJTaXplLmhlaWdodCApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRpZiAoIGNhbnZhcy5yZXF1ZXN0RnVsbHNjcmVlbiApIHtcblxuXHRcdHJlcXVlc3RGdWxsc2NyZWVuID0gJ3JlcXVlc3RGdWxsc2NyZWVuJztcblx0XHRmdWxsc2NyZWVuRWxlbWVudCA9ICdmdWxsc2NyZWVuRWxlbWVudCc7XG5cdFx0ZXhpdEZ1bGxzY3JlZW4gPSAnZXhpdEZ1bGxzY3JlZW4nO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdmdWxsc2NyZWVuY2hhbmdlJywgb25GdWxsc2NyZWVuQ2hhbmdlLCBmYWxzZSApO1xuXG5cdH0gZWxzZSBpZiAoIGNhbnZhcy5tb3pSZXF1ZXN0RnVsbFNjcmVlbiApIHtcblxuXHRcdHJlcXVlc3RGdWxsc2NyZWVuID0gJ21velJlcXVlc3RGdWxsU2NyZWVuJztcblx0XHRmdWxsc2NyZWVuRWxlbWVudCA9ICdtb3pGdWxsU2NyZWVuRWxlbWVudCc7XG5cdFx0ZXhpdEZ1bGxzY3JlZW4gPSAnbW96Q2FuY2VsRnVsbFNjcmVlbic7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vemZ1bGxzY3JlZW5jaGFuZ2UnLCBvbkZ1bGxzY3JlZW5DaGFuZ2UsIGZhbHNlICk7XG5cblx0fSBlbHNlIHtcblxuXHRcdHJlcXVlc3RGdWxsc2NyZWVuID0gJ3dlYmtpdFJlcXVlc3RGdWxsc2NyZWVuJztcblx0XHRmdWxsc2NyZWVuRWxlbWVudCA9ICd3ZWJraXRGdWxsc2NyZWVuRWxlbWVudCc7XG5cdFx0ZXhpdEZ1bGxzY3JlZW4gPSAnd2Via2l0RXhpdEZ1bGxzY3JlZW4nO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJywgb25GdWxsc2NyZWVuQ2hhbmdlLCBmYWxzZSApO1xuXG5cdH1cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3ZyZGlzcGxheXByZXNlbnRjaGFuZ2UnLCBvbkZ1bGxzY3JlZW5DaGFuZ2UsIGZhbHNlICk7XG5cblx0dGhpcy5zZXRGdWxsU2NyZWVuID0gZnVuY3Rpb24gKCBib29sZWFuICkge1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKCBmdW5jdGlvbiAoIHJlc29sdmUsIHJlamVjdCApIHtcblxuXHRcdFx0aWYgKCB2ckRpc3BsYXkgPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHRyZWplY3QoIG5ldyBFcnJvciggJ05vIFZSIGhhcmR3YXJlIGZvdW5kLicgKSApO1xuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBzY29wZS5pc1ByZXNlbnRpbmcgPT09IGJvb2xlYW4gKSB7XG5cblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBpc1dlYlZSMSApIHtcblxuXHRcdFx0XHRpZiAoIGJvb2xlYW4gKSB7XG5cblx0XHRcdFx0XHRyZXNvbHZlKCB2ckRpc3BsYXkucmVxdWVzdFByZXNlbnQoIFsgeyBzb3VyY2U6IGNhbnZhcyB9IF0gKSApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRyZXNvbHZlKCB2ckRpc3BsYXkuZXhpdFByZXNlbnQoKSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiAoIGNhbnZhc1sgcmVxdWVzdEZ1bGxzY3JlZW4gXSApIHtcblxuXHRcdFx0XHRcdGNhbnZhc1sgYm9vbGVhbiA/IHJlcXVlc3RGdWxsc2NyZWVuIDogZXhpdEZ1bGxzY3JlZW4gXSggeyB2ckRpc3BsYXk6IHZyRGlzcGxheSB9ICk7XG5cdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCAnTm8gY29tcGF0aWJsZSByZXF1ZXN0RnVsbHNjcmVlbiBtZXRob2QgZm91bmQuJyApO1xuXHRcdFx0XHRcdHJlamVjdCggbmV3IEVycm9yKCAnTm8gY29tcGF0aWJsZSByZXF1ZXN0RnVsbHNjcmVlbiBtZXRob2QgZm91bmQuJyApICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cblx0fTtcblxuXHR0aGlzLnJlcXVlc3RQcmVzZW50ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuc2V0RnVsbFNjcmVlbiggdHJ1ZSApO1xuXG5cdH07XG5cblx0dGhpcy5leGl0UHJlc2VudCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB0aGlzLnNldEZ1bGxTY3JlZW4oIGZhbHNlICk7XG5cblx0fTtcblxuXHR0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uICggZiApIHtcblxuXHRcdGlmICggaXNXZWJWUjEgJiYgdnJEaXNwbGF5ICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdHJldHVybiB2ckRpc3BsYXkucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBmICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRyZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggZiApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uICggaCApIHtcblxuXHRcdGlmICggaXNXZWJWUjEgJiYgdnJEaXNwbGF5ICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdHZyRGlzcGxheS5jYW5jZWxBbmltYXRpb25GcmFtZSggaCApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKCBoICk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLnN1Ym1pdEZyYW1lID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCBpc1dlYlZSMSAmJiB2ckRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiBzY29wZS5pc1ByZXNlbnRpbmcgKSB7XG5cblx0XHRcdHZyRGlzcGxheS5zdWJtaXRGcmFtZSgpO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5hdXRvU3VibWl0RnJhbWUgPSB0cnVlO1xuXG5cdC8vIHJlbmRlclxuXG5cdHZhciBjYW1lcmFMID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XG5cdGNhbWVyYUwubGF5ZXJzLmVuYWJsZSggMSApO1xuXG5cdHZhciBjYW1lcmFSID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XG5cdGNhbWVyYVIubGF5ZXJzLmVuYWJsZSggMiApO1xuXG5cdHRoaXMucmVuZGVyID0gZnVuY3Rpb24gKCBzY2VuZSwgY2FtZXJhLCByZW5kZXJUYXJnZXQsIGZvcmNlQ2xlYXIgKSB7XG5cblx0XHRpZiAoIHZyRGlzcGxheSAmJiBzY29wZS5pc1ByZXNlbnRpbmcgKSB7XG5cblx0XHRcdHZhciBhdXRvVXBkYXRlID0gc2NlbmUuYXV0b1VwZGF0ZTtcblxuXHRcdFx0aWYgKCBhdXRvVXBkYXRlICkge1xuXG5cdFx0XHRcdHNjZW5lLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG5cdFx0XHRcdHNjZW5lLmF1dG9VcGRhdGUgPSBmYWxzZTtcblxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgZXllUGFyYW1zTCA9IHZyRGlzcGxheS5nZXRFeWVQYXJhbWV0ZXJzKCAnbGVmdCcgKTtcblx0XHRcdHZhciBleWVQYXJhbXNSID0gdnJEaXNwbGF5LmdldEV5ZVBhcmFtZXRlcnMoICdyaWdodCcgKTtcblxuXHRcdFx0aWYgKCBpc1dlYlZSMSApIHtcblxuXHRcdFx0XHRleWVUcmFuc2xhdGlvbkwuZnJvbUFycmF5KCBleWVQYXJhbXNMLm9mZnNldCApO1xuXHRcdFx0XHRleWVUcmFuc2xhdGlvblIuZnJvbUFycmF5KCBleWVQYXJhbXNSLm9mZnNldCApO1xuXHRcdFx0XHRleWVGT1ZMID0gZXllUGFyYW1zTC5maWVsZE9mVmlldztcblx0XHRcdFx0ZXllRk9WUiA9IGV5ZVBhcmFtc1IuZmllbGRPZlZpZXc7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0ZXllVHJhbnNsYXRpb25MLmNvcHkoIGV5ZVBhcmFtc0wuZXllVHJhbnNsYXRpb24gKTtcblx0XHRcdFx0ZXllVHJhbnNsYXRpb25SLmNvcHkoIGV5ZVBhcmFtc1IuZXllVHJhbnNsYXRpb24gKTtcblx0XHRcdFx0ZXllRk9WTCA9IGV5ZVBhcmFtc0wucmVjb21tZW5kZWRGaWVsZE9mVmlldztcblx0XHRcdFx0ZXllRk9WUiA9IGV5ZVBhcmFtc1IucmVjb21tZW5kZWRGaWVsZE9mVmlldztcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIEFycmF5LmlzQXJyYXkoIHNjZW5lICkgKSB7XG5cblx0XHRcdFx0Y29uc29sZS53YXJuKCAnVEhSRUUuVlJFZmZlY3QucmVuZGVyKCkgbm8gbG9uZ2VyIHN1cHBvcnRzIGFycmF5cy4gVXNlIG9iamVjdC5sYXllcnMgaW5zdGVhZC4nICk7XG5cdFx0XHRcdHNjZW5lID0gc2NlbmVbIDAgXTtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBXaGVuIHJlbmRlcmluZyB3ZSBkb24ndCBjYXJlIHdoYXQgdGhlIHJlY29tbWVuZGVkIHNpemUgaXMsIG9ubHkgd2hhdCB0aGUgYWN0dWFsIHNpemVcblx0XHRcdC8vIG9mIHRoZSBiYWNrYnVmZmVyIGlzLlxuXHRcdFx0dmFyIHNpemUgPSByZW5kZXJlci5nZXRTaXplKCk7XG5cdFx0XHRyZW5kZXJSZWN0TCA9IHtcblx0XHRcdFx0eDogTWF0aC5yb3VuZCggc2l6ZS53aWR0aCAqIGxlZnRCb3VuZHNbIDAgXSApLFxuXHRcdFx0XHR5OiBNYXRoLnJvdW5kKCBzaXplLmhlaWdodCAqIGxlZnRCb3VuZHNbIDEgXSApLFxuXHRcdFx0XHR3aWR0aDogTWF0aC5yb3VuZCggc2l6ZS53aWR0aCAqIGxlZnRCb3VuZHNbIDIgXSApLFxuXHRcdFx0XHRoZWlnaHQ6ICBNYXRoLnJvdW5kKHNpemUuaGVpZ2h0ICogbGVmdEJvdW5kc1sgMyBdIClcblx0XHRcdH07XG5cdFx0XHRyZW5kZXJSZWN0UiA9IHtcblx0XHRcdFx0eDogTWF0aC5yb3VuZCggc2l6ZS53aWR0aCAqIHJpZ2h0Qm91bmRzWyAwIF0gKSxcblx0XHRcdFx0eTogTWF0aC5yb3VuZCggc2l6ZS5oZWlnaHQgKiByaWdodEJvdW5kc1sgMSBdICksXG5cdFx0XHRcdHdpZHRoOiBNYXRoLnJvdW5kKCBzaXplLndpZHRoICogcmlnaHRCb3VuZHNbIDIgXSApLFxuXHRcdFx0XHRoZWlnaHQ6ICBNYXRoLnJvdW5kKHNpemUuaGVpZ2h0ICogcmlnaHRCb3VuZHNbIDMgXSApXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAocmVuZGVyVGFyZ2V0KSB7XG5cblx0XHRcdFx0cmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KHJlbmRlclRhcmdldCk7XG5cdFx0XHRcdHJlbmRlclRhcmdldC5zY2lzc29yVGVzdCA9IHRydWU7XG5cblx0XHRcdH0gZWxzZSAge1xuXG5cdFx0XHRcdHJlbmRlcmVyLnNldFNjaXNzb3JUZXN0KCB0cnVlICk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCByZW5kZXJlci5hdXRvQ2xlYXIgfHwgZm9yY2VDbGVhciApIHJlbmRlcmVyLmNsZWFyKCk7XG5cblx0XHRcdGlmICggY2FtZXJhLnBhcmVudCA9PT0gbnVsbCApIGNhbWVyYS51cGRhdGVNYXRyaXhXb3JsZCgpO1xuXG5cdFx0XHRjYW1lcmFMLnByb2plY3Rpb25NYXRyaXggPSBmb3ZUb1Byb2plY3Rpb24oIGV5ZUZPVkwsIHRydWUsIGNhbWVyYS5uZWFyLCBjYW1lcmEuZmFyICk7XG5cdFx0XHRjYW1lcmFSLnByb2plY3Rpb25NYXRyaXggPSBmb3ZUb1Byb2plY3Rpb24oIGV5ZUZPVlIsIHRydWUsIGNhbWVyYS5uZWFyLCBjYW1lcmEuZmFyICk7XG5cblx0XHRcdGNhbWVyYS5tYXRyaXhXb3JsZC5kZWNvbXBvc2UoIGNhbWVyYUwucG9zaXRpb24sIGNhbWVyYUwucXVhdGVybmlvbiwgY2FtZXJhTC5zY2FsZSApO1xuXHRcdFx0Y2FtZXJhLm1hdHJpeFdvcmxkLmRlY29tcG9zZSggY2FtZXJhUi5wb3NpdGlvbiwgY2FtZXJhUi5xdWF0ZXJuaW9uLCBjYW1lcmFSLnNjYWxlICk7XG5cblx0XHRcdHZhciBzY2FsZSA9IHRoaXMuc2NhbGU7XG5cdFx0XHRjYW1lcmFMLnRyYW5zbGF0ZU9uQXhpcyggZXllVHJhbnNsYXRpb25MLCBzY2FsZSApO1xuXHRcdFx0Y2FtZXJhUi50cmFuc2xhdGVPbkF4aXMoIGV5ZVRyYW5zbGF0aW9uUiwgc2NhbGUgKTtcblxuXG5cdFx0XHQvLyByZW5kZXIgbGVmdCBleWVcblx0XHRcdGlmICggcmVuZGVyVGFyZ2V0ICkge1xuXG5cdFx0XHRcdHJlbmRlclRhcmdldC52aWV3cG9ydC5zZXQocmVuZGVyUmVjdEwueCwgcmVuZGVyUmVjdEwueSwgcmVuZGVyUmVjdEwud2lkdGgsIHJlbmRlclJlY3RMLmhlaWdodCk7XG5cdFx0XHRcdHJlbmRlclRhcmdldC5zY2lzc29yLnNldChyZW5kZXJSZWN0TC54LCByZW5kZXJSZWN0TC55LCByZW5kZXJSZWN0TC53aWR0aCwgcmVuZGVyUmVjdEwuaGVpZ2h0KTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRyZW5kZXJlci5zZXRWaWV3cG9ydCggcmVuZGVyUmVjdEwueCwgcmVuZGVyUmVjdEwueSwgcmVuZGVyUmVjdEwud2lkdGgsIHJlbmRlclJlY3RMLmhlaWdodCApO1xuXHRcdFx0XHRyZW5kZXJlci5zZXRTY2lzc29yKCByZW5kZXJSZWN0TC54LCByZW5kZXJSZWN0TC55LCByZW5kZXJSZWN0TC53aWR0aCwgcmVuZGVyUmVjdEwuaGVpZ2h0ICk7XG5cblx0XHRcdH1cblx0XHRcdHJlbmRlcmVyLnJlbmRlciggc2NlbmUsIGNhbWVyYUwsIHJlbmRlclRhcmdldCwgZm9yY2VDbGVhciApO1xuXG5cdFx0XHQvLyByZW5kZXIgcmlnaHQgZXllXG5cdFx0XHRpZiAocmVuZGVyVGFyZ2V0KSB7XG5cblx0XHRcdFx0cmVuZGVyVGFyZ2V0LnZpZXdwb3J0LnNldChyZW5kZXJSZWN0Ui54LCByZW5kZXJSZWN0Ui55LCByZW5kZXJSZWN0Ui53aWR0aCwgcmVuZGVyUmVjdFIuaGVpZ2h0KTtcbiAgXHRcdFx0XHRyZW5kZXJUYXJnZXQuc2Npc3Nvci5zZXQocmVuZGVyUmVjdFIueCwgcmVuZGVyUmVjdFIueSwgcmVuZGVyUmVjdFIud2lkdGgsIHJlbmRlclJlY3RSLmhlaWdodCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0cmVuZGVyZXIuc2V0Vmlld3BvcnQoIHJlbmRlclJlY3RSLngsIHJlbmRlclJlY3RSLnksIHJlbmRlclJlY3RSLndpZHRoLCByZW5kZXJSZWN0Ui5oZWlnaHQgKTtcblx0XHRcdFx0cmVuZGVyZXIuc2V0U2Npc3NvciggcmVuZGVyUmVjdFIueCwgcmVuZGVyUmVjdFIueSwgcmVuZGVyUmVjdFIud2lkdGgsIHJlbmRlclJlY3RSLmhlaWdodCApO1xuXG5cdFx0XHR9XG5cdFx0XHRyZW5kZXJlci5yZW5kZXIoIHNjZW5lLCBjYW1lcmFSLCByZW5kZXJUYXJnZXQsIGZvcmNlQ2xlYXIgKTtcblxuXHRcdFx0aWYgKHJlbmRlclRhcmdldCkge1xuXG5cdFx0XHRcdHJlbmRlclRhcmdldC52aWV3cG9ydC5zZXQoIDAsIDAsIHNpemUud2lkdGgsIHNpemUuaGVpZ2h0ICk7XG5cdFx0XHRcdHJlbmRlclRhcmdldC5zY2lzc29yLnNldCggMCwgMCwgc2l6ZS53aWR0aCwgc2l6ZS5oZWlnaHQgKTtcblx0XHRcdFx0cmVuZGVyVGFyZ2V0LnNjaXNzb3JUZXN0ID0gZmFsc2U7XG5cdFx0XHRcdHJlbmRlcmVyLnNldFJlbmRlclRhcmdldCggbnVsbCApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHJlbmRlcmVyLnNldFNjaXNzb3JUZXN0KCBmYWxzZSApO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggYXV0b1VwZGF0ZSApIHtcblxuXHRcdFx0XHRzY2VuZS5hdXRvVXBkYXRlID0gdHJ1ZTtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHNjb3BlLmF1dG9TdWJtaXRGcmFtZSApIHtcblxuXHRcdFx0XHRzY29wZS5zdWJtaXRGcmFtZSgpO1xuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybjtcblxuXHRcdH1cblxuXHRcdC8vIFJlZ3VsYXIgcmVuZGVyIG1vZGUgaWYgbm90IEhNRFxuXG5cdFx0cmVuZGVyZXIucmVuZGVyKCBzY2VuZSwgY2FtZXJhLCByZW5kZXJUYXJnZXQsIGZvcmNlQ2xlYXIgKTtcblxuXHR9O1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gZm92VG9ORENTY2FsZU9mZnNldCggZm92ICkge1xuXG5cdFx0dmFyIHB4c2NhbGUgPSAyLjAgLyAoIGZvdi5sZWZ0VGFuICsgZm92LnJpZ2h0VGFuICk7XG5cdFx0dmFyIHB4b2Zmc2V0ID0gKCBmb3YubGVmdFRhbiAtIGZvdi5yaWdodFRhbiApICogcHhzY2FsZSAqIDAuNTtcblx0XHR2YXIgcHlzY2FsZSA9IDIuMCAvICggZm92LnVwVGFuICsgZm92LmRvd25UYW4gKTtcblx0XHR2YXIgcHlvZmZzZXQgPSAoIGZvdi51cFRhbiAtIGZvdi5kb3duVGFuICkgKiBweXNjYWxlICogMC41O1xuXHRcdHJldHVybiB7IHNjYWxlOiBbIHB4c2NhbGUsIHB5c2NhbGUgXSwgb2Zmc2V0OiBbIHB4b2Zmc2V0LCBweW9mZnNldCBdIH07XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGZvdlBvcnRUb1Byb2plY3Rpb24oIGZvdiwgcmlnaHRIYW5kZWQsIHpOZWFyLCB6RmFyICkge1xuXG5cdFx0cmlnaHRIYW5kZWQgPSByaWdodEhhbmRlZCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHJpZ2h0SGFuZGVkO1xuXHRcdHpOZWFyID0gek5lYXIgPT09IHVuZGVmaW5lZCA/IDAuMDEgOiB6TmVhcjtcblx0XHR6RmFyID0gekZhciA9PT0gdW5kZWZpbmVkID8gMTAwMDAuMCA6IHpGYXI7XG5cblx0XHR2YXIgaGFuZGVkbmVzc1NjYWxlID0gcmlnaHRIYW5kZWQgPyAtIDEuMCA6IDEuMDtcblxuXHRcdC8vIHN0YXJ0IHdpdGggYW4gaWRlbnRpdHkgbWF0cml4XG5cdFx0dmFyIG1vYmogPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuXHRcdHZhciBtID0gbW9iai5lbGVtZW50cztcblxuXHRcdC8vIGFuZCB3aXRoIHNjYWxlL29mZnNldCBpbmZvIGZvciBub3JtYWxpemVkIGRldmljZSBjb29yZHNcblx0XHR2YXIgc2NhbGVBbmRPZmZzZXQgPSBmb3ZUb05EQ1NjYWxlT2Zmc2V0KCBmb3YgKTtcblxuXHRcdC8vIFggcmVzdWx0LCBtYXAgY2xpcCBlZGdlcyB0byBbLXcsK3ddXG5cdFx0bVsgMCAqIDQgKyAwIF0gPSBzY2FsZUFuZE9mZnNldC5zY2FsZVsgMCBdO1xuXHRcdG1bIDAgKiA0ICsgMSBdID0gMC4wO1xuXHRcdG1bIDAgKiA0ICsgMiBdID0gc2NhbGVBbmRPZmZzZXQub2Zmc2V0WyAwIF0gKiBoYW5kZWRuZXNzU2NhbGU7XG5cdFx0bVsgMCAqIDQgKyAzIF0gPSAwLjA7XG5cblx0XHQvLyBZIHJlc3VsdCwgbWFwIGNsaXAgZWRnZXMgdG8gWy13LCt3XVxuXHRcdC8vIFkgb2Zmc2V0IGlzIG5lZ2F0ZWQgYmVjYXVzZSB0aGlzIHByb2ogbWF0cml4IHRyYW5zZm9ybXMgZnJvbSB3b3JsZCBjb29yZHMgd2l0aCBZPXVwLFxuXHRcdC8vIGJ1dCB0aGUgTkRDIHNjYWxpbmcgaGFzIFk9ZG93biAodGhhbmtzIEQzRD8pXG5cdFx0bVsgMSAqIDQgKyAwIF0gPSAwLjA7XG5cdFx0bVsgMSAqIDQgKyAxIF0gPSBzY2FsZUFuZE9mZnNldC5zY2FsZVsgMSBdO1xuXHRcdG1bIDEgKiA0ICsgMiBdID0gLSBzY2FsZUFuZE9mZnNldC5vZmZzZXRbIDEgXSAqIGhhbmRlZG5lc3NTY2FsZTtcblx0XHRtWyAxICogNCArIDMgXSA9IDAuMDtcblxuXHRcdC8vIFogcmVzdWx0ICh1cCB0byB0aGUgYXBwKVxuXHRcdG1bIDIgKiA0ICsgMCBdID0gMC4wO1xuXHRcdG1bIDIgKiA0ICsgMSBdID0gMC4wO1xuXHRcdG1bIDIgKiA0ICsgMiBdID0gekZhciAvICggek5lYXIgLSB6RmFyICkgKiAtIGhhbmRlZG5lc3NTY2FsZTtcblx0XHRtWyAyICogNCArIDMgXSA9ICggekZhciAqIHpOZWFyICkgLyAoIHpOZWFyIC0gekZhciApO1xuXG5cdFx0Ly8gVyByZXN1bHQgKD0gWiBpbilcblx0XHRtWyAzICogNCArIDAgXSA9IDAuMDtcblx0XHRtWyAzICogNCArIDEgXSA9IDAuMDtcblx0XHRtWyAzICogNCArIDIgXSA9IGhhbmRlZG5lc3NTY2FsZTtcblx0XHRtWyAzICogNCArIDMgXSA9IDAuMDtcblxuXHRcdG1vYmoudHJhbnNwb3NlKCk7XG5cblx0XHRyZXR1cm4gbW9iajtcblxuXHR9XG5cblx0ZnVuY3Rpb24gZm92VG9Qcm9qZWN0aW9uKCBmb3YsIHJpZ2h0SGFuZGVkLCB6TmVhciwgekZhciApIHtcblxuXHRcdHZhciBERUcyUkFEID0gTWF0aC5QSSAvIDE4MC4wO1xuXG5cdFx0dmFyIGZvdlBvcnQgPSB7XG5cdFx0XHR1cFRhbjogTWF0aC50YW4oIGZvdi51cERlZ3JlZXMgKiBERUcyUkFEICksXG5cdFx0XHRkb3duVGFuOiBNYXRoLnRhbiggZm92LmRvd25EZWdyZWVzICogREVHMlJBRCApLFxuXHRcdFx0bGVmdFRhbjogTWF0aC50YW4oIGZvdi5sZWZ0RGVncmVlcyAqIERFRzJSQUQgKSxcblx0XHRcdHJpZ2h0VGFuOiBNYXRoLnRhbiggZm92LnJpZ2h0RGVncmVlcyAqIERFRzJSQUQgKVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZm92UG9ydFRvUHJvamVjdGlvbiggZm92UG9ydCwgcmlnaHRIYW5kZWQsIHpOZWFyLCB6RmFyICk7XG5cblx0fVxuXG59O1xuIiwiLyoqXHJcbiogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbVxyXG4qIEJhc2VkIG9uIEB0b2ppcm8ncyB2ci1zYW1wbGVzLXV0aWxzLmpzXHJcbiovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNMYXRlc3RBdmFpbGFibGUoKSB7XHJcblxyXG4gIHJldHVybiBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cyAhPT0gdW5kZWZpbmVkO1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXZhaWxhYmxlKCkge1xyXG5cclxuICByZXR1cm4gbmF2aWdhdG9yLmdldFZSRGlzcGxheXMgIT09IHVuZGVmaW5lZCB8fCBuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzICE9PSB1bmRlZmluZWQ7XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVzc2FnZSgpIHtcclxuXHJcbiAgdmFyIG1lc3NhZ2U7XHJcblxyXG4gIGlmICggbmF2aWdhdG9yLmdldFZSRGlzcGxheXMgKSB7XHJcblxyXG4gICAgbmF2aWdhdG9yLmdldFZSRGlzcGxheXMoKS50aGVuKCBmdW5jdGlvbiAoIGRpc3BsYXlzICkge1xyXG5cclxuICAgICAgaWYgKCBkaXNwbGF5cy5sZW5ndGggPT09IDAgKSBtZXNzYWdlID0gJ1dlYlZSIHN1cHBvcnRlZCwgYnV0IG5vIFZSRGlzcGxheXMgZm91bmQuJztcclxuXHJcbiAgICB9ICk7XHJcblxyXG4gIH0gZWxzZSBpZiAoIG5hdmlnYXRvci5nZXRWUkRldmljZXMgKSB7XHJcblxyXG4gICAgbWVzc2FnZSA9ICdZb3VyIGJyb3dzZXIgc3VwcG9ydHMgV2ViVlIgYnV0IG5vdCB0aGUgbGF0ZXN0IHZlcnNpb24uIFNlZSA8YSBocmVmPVwiaHR0cDovL3dlYnZyLmluZm9cIj53ZWJ2ci5pbmZvPC9hPiBmb3IgbW9yZSBpbmZvLic7XHJcblxyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgbWVzc2FnZSA9ICdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBXZWJWUi4gU2VlIDxhIGhyZWY9XCJodHRwOi8vd2VidnIuaW5mb1wiPndlYnZyLmluZm88L2E+IGZvciBhc3Npc3RhbmNlLic7XHJcblxyXG4gIH1cclxuXHJcbiAgaWYgKCBtZXNzYWdlICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XHJcbiAgICBjb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSAnMCc7XHJcbiAgICBjb250YWluZXIuc3R5bGUudG9wID0gJzAnO1xyXG4gICAgY29udGFpbmVyLnN0eWxlLnJpZ2h0ID0gJzAnO1xyXG4gICAgY29udGFpbmVyLnN0eWxlLnpJbmRleCA9ICc5OTknO1xyXG4gICAgY29udGFpbmVyLmFsaWduID0gJ2NlbnRlcic7XHJcblxyXG4gICAgdmFyIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcclxuICAgIGVycm9yLnN0eWxlLmZvbnRGYW1pbHkgPSAnc2Fucy1zZXJpZic7XHJcbiAgICBlcnJvci5zdHlsZS5mb250U2l6ZSA9ICcxNnB4JztcclxuICAgIGVycm9yLnN0eWxlLmZvbnRTdHlsZSA9ICdub3JtYWwnO1xyXG4gICAgZXJyb3Iuc3R5bGUubGluZUhlaWdodCA9ICcyNnB4JztcclxuICAgIGVycm9yLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZmZmJztcclxuICAgIGVycm9yLnN0eWxlLmNvbG9yID0gJyMwMDAnO1xyXG4gICAgZXJyb3Iuc3R5bGUucGFkZGluZyA9ICcxMHB4IDIwcHgnO1xyXG4gICAgZXJyb3Iuc3R5bGUubWFyZ2luID0gJzUwcHgnO1xyXG4gICAgZXJyb3Iuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xyXG4gICAgZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCggZXJyb3IgKTtcclxuXHJcbiAgICByZXR1cm4gY29udGFpbmVyO1xyXG5cclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnV0dG9uKCBlZmZlY3QgKSB7XHJcblxyXG4gIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnYnV0dG9uJyApO1xyXG4gIGJ1dHRvbi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgYnV0dG9uLnN0eWxlLmxlZnQgPSAnY2FsYyg1MCUgLSA1MHB4KSc7XHJcbiAgYnV0dG9uLnN0eWxlLmJvdHRvbSA9ICcyMHB4JztcclxuICBidXR0b24uc3R5bGUud2lkdGggPSAnMTAwcHgnO1xyXG4gIGJ1dHRvbi5zdHlsZS5ib3JkZXIgPSAnMCc7XHJcbiAgYnV0dG9uLnN0eWxlLnBhZGRpbmcgPSAnOHB4JztcclxuICBidXR0b24uc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG4gIGJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzAwMCc7XHJcbiAgYnV0dG9uLnN0eWxlLmNvbG9yID0gJyNmZmYnO1xyXG4gIGJ1dHRvbi5zdHlsZS5mb250RmFtaWx5ID0gJ3NhbnMtc2VyaWYnO1xyXG4gIGJ1dHRvbi5zdHlsZS5mb250U2l6ZSA9ICcxM3B4JztcclxuICBidXR0b24uc3R5bGUuZm9udFN0eWxlID0gJ25vcm1hbCc7XHJcbiAgYnV0dG9uLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gIGJ1dHRvbi5zdHlsZS56SW5kZXggPSAnOTk5JztcclxuICBidXR0b24udGV4dENvbnRlbnQgPSAnRU5URVIgVlInO1xyXG4gIGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgZWZmZWN0LmlzUHJlc2VudGluZyA/IGVmZmVjdC5leGl0UHJlc2VudCgpIDogZWZmZWN0LnJlcXVlc3RQcmVzZW50KCk7XHJcblxyXG4gIH07XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAndnJkaXNwbGF5cHJlc2VudGNoYW5nZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XHJcblxyXG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gZWZmZWN0LmlzUHJlc2VudGluZyA/ICdFWElUIFZSJyA6ICdFTlRFUiBWUic7XHJcblxyXG4gIH0sIGZhbHNlICk7XHJcblxyXG4gIHJldHVybiBidXR0b247XHJcblxyXG59XHJcblxyXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iXX0=
