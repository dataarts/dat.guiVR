(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _vrviewer = require('./vrviewer');

var _vrviewer2 = _interopRequireDefault(_vrviewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createApp = (0, _vrviewer2.default)(THREE);

var _createApp = createApp({
  autoEnter: false,
  emptyRoom: true
});

var scene = _createApp.scene;
var camera = _createApp.camera;
var controller1 = _createApp.controller1;
var controller2 = _createApp.controller2;
var events = _createApp.events;


scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial()));

events.on('tick', function (dt) {});

},{"./vrviewer":2}],2:[function(require,module,exports){
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

function create(THREE) {

    return function () {
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

        var renderer = new THREE.WebGLRenderer({ antialias: false });
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

        if (loadControllers) {
            var loader;

            (function () {
                var c1 = new THREE.ViveController(0);
                c1.standingMatrix = controls.getStandingMatrix();
                controller1.add(c1);

                var c2 = new THREE.ViveController(1);
                c2.standingMatrix = controls.getStandingMatrix();
                controller2.add(c2);

                loader = new THREE.OBJLoader();

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
            })();
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

        animate();

        return {
            scene: scene, camera: camera, controls: controls, renderer: renderer,
            controller1: controller1, controller2: controller2,
            events: events
        };
    };
}

},{"./objloader":3,"./vivecontroller":4,"./vrcontrols":5,"./vreffects":6,"./webvr":7,"events":8}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxpbmRleC5qcyIsIm1vZHVsZXNcXHZydmlld2VyXFxpbmRleC5qcyIsIm1vZHVsZXNcXHZydmlld2VyXFxvYmpsb2FkZXIuanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcdml2ZWNvbnRyb2xsZXIuanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcdnJjb250cm9scy5qcyIsIm1vZHVsZXNcXHZydmlld2VyXFx2cmVmZmVjdHMuanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcd2VidnIuanMiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUNBLElBQU0sWUFBWSx3QkFBVSxLQUFWLENBQWxCOztpQkFFNEQsVUFBVTtBQUNwRSxhQUFXLEtBRHlEO0FBRXBFLGFBQVc7QUFGeUQsQ0FBVixDOztJQUFwRCxLLGNBQUEsSztJQUFPLE0sY0FBQSxNO0lBQVEsVyxjQUFBLFc7SUFBYSxXLGNBQUEsVztJQUFhLE0sY0FBQSxNOzs7QUFLakQsTUFBTSxHQUFOLENBQVcsSUFBSSxNQUFNLElBQVYsQ0FBZ0IsSUFBSSxNQUFNLFdBQVYsQ0FBdUIsQ0FBdkIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsQ0FBaEIsRUFBa0QsSUFBSSxNQUFNLG9CQUFWLEVBQWxELENBQVg7O0FBRUEsT0FBTyxFQUFQLENBQVcsTUFBWCxFQUFtQixVQUFDLEVBQUQsRUFBTSxDQUN4QixDQUREOzs7Ozs7OztrQkNEd0IsTTs7QUFUeEI7Ozs7QUFFQTs7SUFBWSxVOztBQUNaOztJQUFZLFM7O0FBQ1o7O0lBQVksYzs7QUFDWjs7SUFBWSxLOztB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBWUlZpZXdlciBmcm9tICcuL3Zydmlld2VyJztcclxuY29uc3QgY3JlYXRlQXBwID0gVlJWaWV3ZXIoIFRIUkVFICk7XHJcblxyXG5jb25zdCB7IHNjZW5lLCBjYW1lcmEsIGNvbnRyb2xsZXIxLCBjb250cm9sbGVyMiwgZXZlbnRzIH0gPSBjcmVhdGVBcHAoe1xyXG4gIGF1dG9FbnRlcjogZmFsc2UsXHJcbiAgZW1wdHlSb29tOiB0cnVlXHJcbn0pO1xyXG5cclxuc2NlbmUuYWRkKCBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCAxLCAxLCAxICksIG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCgpICkgKTtcclxuXHJcbmV2ZW50cy5vbiggJ3RpY2snLCAoZHQpPT57XHJcbn0pOyIsImltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XHJcblxyXG5pbXBvcnQgKiBhcyBWUkNvbnRyb2xzIGZyb20gJy4vdnJjb250cm9scyc7XHJcbmltcG9ydCAqIGFzIFZSRWZmZWN0cyBmcm9tICcuL3ZyZWZmZWN0cyc7XHJcbmltcG9ydCAqIGFzIFZpdmVDb250cm9sbGVyIGZyb20gJy4vdml2ZWNvbnRyb2xsZXInO1xyXG5pbXBvcnQgKiBhcyBXRUJWUiBmcm9tICcuL3dlYnZyJztcclxuaW1wb3J0ICogYXMgT2JqTG9hZGVyIGZyb20gJy4vb2JqbG9hZGVyJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGUoIFRIUkVFICl7XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbigge1xyXG5cclxuICAgIGVtcHR5Um9vbSA9IHRydWUsXHJcbiAgICBzdGFuZGluZyA9IHRydWUsXHJcbiAgICBsb2FkQ29udHJvbGxlcnMgPSB0cnVlLFxyXG4gICAgdnJCdXR0b24gPSB0cnVlLFxyXG4gICAgYXV0b0VudGVyID0gZmFsc2UsXHJcbiAgICBwYXRoVG9Db250cm9sbGVycyA9ICdtb2RlbHMvb2JqL3ZpdmUtY29udHJvbGxlci8nLFxyXG4gICAgY29udHJvbGxlck1vZGVsTmFtZSA9ICd2cl9jb250cm9sbGVyX3ZpdmVfMV81Lm9iaicsXHJcbiAgICBjb250cm9sbGVyVGV4dHVyZU1hcCA9ICdvbmVwb2ludGZpdmVfdGV4dHVyZS5wbmcnLFxyXG4gICAgY29udHJvbGxlclNwZWNNYXAgPSAnb25lcG9pbnRmaXZlX3NwZWMucG5nJ1xyXG5cclxuICB9ID0ge30gKXtcclxuXHJcbiAgICBpZiAoIFdFQlZSLmlzTGF0ZXN0QXZhaWxhYmxlKCkgPT09IGZhbHNlICkge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBXRUJWUi5nZXRNZXNzYWdlKCkgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBldmVudHMgPSBuZXcgRW1pdHRlcigpO1xyXG5cclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBjb250YWluZXIgKTtcclxuXHJcblxyXG4gICAgY29uc3Qgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHJcbiAgICBjb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoIDcwLCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMCApO1xyXG4gICAgc2NlbmUuYWRkKCBjYW1lcmEgKTtcclxuXHJcbiAgICBpZiggZW1wdHlSb29tICl7XHJcbiAgICAgIGNvbnN0IHJvb20gPSBuZXcgVEhSRUUuTWVzaChcclxuICAgICAgICBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIDYsIDYsIDYsIDgsIDgsIDggKSxcclxuICAgICAgICBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4NDA0MDQwLCB3aXJlZnJhbWU6IHRydWUgfSApXHJcbiAgICAgICk7XHJcbiAgICAgIHJvb20ucG9zaXRpb24ueSA9IDM7XHJcbiAgICAgIHNjZW5lLmFkZCggcm9vbSApO1xyXG5cclxuICAgICAgc2NlbmUuYWRkKCBuZXcgVEhSRUUuSGVtaXNwaGVyZUxpZ2h0KCAweDYwNjA2MCwgMHg0MDQwNDAgKSApO1xyXG5cclxuICAgICAgbGV0IGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoIDB4ZmZmZmZmICk7XHJcbiAgICAgIGxpZ2h0LnBvc2l0aW9uLnNldCggMSwgMSwgMSApLm5vcm1hbGl6ZSgpO1xyXG4gICAgICBzY2VuZS5hZGQoIGxpZ2h0ICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciggeyBhbnRpYWxpYXM6IGZhbHNlIH0gKTtcclxuICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IoIDB4NTA1MDUwICk7XHJcbiAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKCB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyApO1xyXG4gICAgcmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xyXG4gICAgcmVuZGVyZXIuc29ydE9iamVjdHMgPSBmYWxzZTtcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCggcmVuZGVyZXIuZG9tRWxlbWVudCApO1xyXG5cclxuICAgIGNvbnN0IGNvbnRyb2xzID0gbmV3IFRIUkVFLlZSQ29udHJvbHMoIGNhbWVyYSApO1xyXG4gICAgY29udHJvbHMuc3RhbmRpbmcgPSBzdGFuZGluZztcclxuXHJcblxyXG4gICAgY29uc3QgY29udHJvbGxlcjEgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgIGNvbnN0IGNvbnRyb2xsZXIyID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICBzY2VuZS5hZGQoIGNvbnRyb2xsZXIxLCBjb250cm9sbGVyMiApO1xyXG5cclxuICAgIGlmKCBsb2FkQ29udHJvbGxlcnMgKXtcclxuICAgICAgY29uc3QgYzEgPSBuZXcgVEhSRUUuVml2ZUNvbnRyb2xsZXIoIDAgKTtcclxuICAgICAgYzEuc3RhbmRpbmdNYXRyaXggPSBjb250cm9scy5nZXRTdGFuZGluZ01hdHJpeCgpO1xyXG4gICAgICBjb250cm9sbGVyMS5hZGQoIGMxICk7XHJcblxyXG4gICAgICBjb25zdCBjMiA9IG5ldyBUSFJFRS5WaXZlQ29udHJvbGxlciggMSApO1xyXG4gICAgICBjMi5zdGFuZGluZ01hdHJpeCA9IGNvbnRyb2xzLmdldFN0YW5kaW5nTWF0cml4KCk7XHJcbiAgICAgIGNvbnRyb2xsZXIyLmFkZCggYzIgKTtcclxuXHJcbiAgICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuT0JKTG9hZGVyKCk7XHJcbiAgICAgIGxvYWRlci5zZXRQYXRoKCBwYXRoVG9Db250cm9sbGVycyApO1xyXG4gICAgICBsb2FkZXIubG9hZCggY29udHJvbGxlck1vZGVsTmFtZSwgZnVuY3Rpb24gKCBvYmplY3QgKSB7XHJcblxyXG4gICAgICAgIHZhciB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcclxuICAgICAgICB0ZXh0dXJlTG9hZGVyLnNldFBhdGgoIHBhdGhUb0NvbnRyb2xsZXJzICk7XHJcblxyXG4gICAgICAgIHZhciBjb250cm9sbGVyID0gb2JqZWN0LmNoaWxkcmVuWyAwIF07XHJcbiAgICAgICAgY29udHJvbGxlci5tYXRlcmlhbC5tYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoIGNvbnRyb2xsZXJUZXh0dXJlTWFwICk7XHJcbiAgICAgICAgY29udHJvbGxlci5tYXRlcmlhbC5zcGVjdWxhck1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCggY29udHJvbGxlclNwZWNNYXAgKTtcclxuXHJcbiAgICAgICAgYzEuYWRkKCBvYmplY3QuY2xvbmUoKSApO1xyXG4gICAgICAgIGMyLmFkZCggb2JqZWN0LmNsb25lKCkgKTtcclxuXHJcbiAgICAgIH0gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlZmZlY3QgPSBuZXcgVEhSRUUuVlJFZmZlY3QoIHJlbmRlcmVyICk7XHJcblxyXG4gICAgaWYgKCBXRUJWUi5pc0F2YWlsYWJsZSgpID09PSB0cnVlICkge1xyXG4gICAgICBpZiggdnJCdXR0b24gKXtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBXRUJWUi5nZXRCdXR0b24oIGVmZmVjdCApICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKCBhdXRvRW50ZXIgKXtcclxuICAgICAgICBzZXRUaW1lb3V0KCAoKT0+ZWZmZWN0LnJlcXVlc3RQcmVzZW50KCksIDEwMDAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgZnVuY3Rpb24oKXtcclxuICAgICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICBlZmZlY3Quc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xyXG5cclxuICAgICAgZXZlbnRzLmVtaXQoICdyZXNpemUnLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XHJcbiAgICB9LCBmYWxzZSApO1xyXG5cclxuXHJcbiAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xyXG4gICAgY2xvY2suc3RhcnQoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gICAgICBjb25zdCBkdCA9IGNsb2NrLmdldERlbHRhKCk7XHJcblxyXG4gICAgICBlZmZlY3QucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBhbmltYXRlICk7XHJcblxyXG4gICAgICBjb250cm9scy51cGRhdGUoKTtcclxuXHJcbiAgICAgIGV2ZW50cy5lbWl0KCAndGljaycsICBkdCApO1xyXG5cclxuICAgICAgcmVuZGVyKCk7XHJcblxyXG4gICAgICBldmVudHMuZW1pdCggJ3JlbmRlcicsIGR0IClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICAgIGVmZmVjdC5yZW5kZXIoIHNjZW5lLCBjYW1lcmEgKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYW5pbWF0ZSgpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNjZW5lLCBjYW1lcmEsIGNvbnRyb2xzLCByZW5kZXJlcixcclxuICAgICAgY29udHJvbGxlcjEsIGNvbnRyb2xsZXIyLFxyXG4gICAgICBldmVudHNcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBAYXV0aG9yIG1yZG9vYiAvIGh0dHA6Ly9tcmRvb2IuY29tL1xyXG4gKi9cclxuXHJcblRIUkVFLk9CSkxvYWRlciA9IGZ1bmN0aW9uICggbWFuYWdlciApIHtcclxuXHJcbiAgdGhpcy5tYW5hZ2VyID0gKCBtYW5hZ2VyICE9PSB1bmRlZmluZWQgKSA/IG1hbmFnZXIgOiBUSFJFRS5EZWZhdWx0TG9hZGluZ01hbmFnZXI7XHJcblxyXG4gIHRoaXMubWF0ZXJpYWxzID0gbnVsbDtcclxuXHJcbiAgdGhpcy5yZWdleHAgPSB7XHJcbiAgICAvLyB2IGZsb2F0IGZsb2F0IGZsb2F0XHJcbiAgICB2ZXJ0ZXhfcGF0dGVybiAgICAgICAgICAgOiAvXnZcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKVxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKykvLFxyXG4gICAgLy8gdm4gZmxvYXQgZmxvYXQgZmxvYXRcclxuICAgIG5vcm1hbF9wYXR0ZXJuICAgICAgICAgICA6IC9edm5cXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKVxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKykvLFxyXG4gICAgLy8gdnQgZmxvYXQgZmxvYXRcclxuICAgIHV2X3BhdHRlcm4gICAgICAgICAgICAgICA6IC9ednRcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKS8sXHJcbiAgICAvLyBmIHZlcnRleCB2ZXJ0ZXggdmVydGV4XHJcbiAgICBmYWNlX3ZlcnRleCAgICAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXHMrKC0/XFxkKylcXHMrKC0/XFxkKykoPzpcXHMrKC0/XFxkKykpPy8sXHJcbiAgICAvLyBmIHZlcnRleC91diB2ZXJ0ZXgvdXYgdmVydGV4L3V2XHJcbiAgICBmYWNlX3ZlcnRleF91diAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC8oLT9cXGQrKSk/LyxcclxuICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgIGZhY2VfdmVydGV4X3V2X25vcm1hbCAgICA6IC9eZlxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKSg/OlxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykpPy8sXHJcbiAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICBmYWNlX3ZlcnRleF9ub3JtYWwgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKSk/LyxcclxuICAgIC8vIG8gb2JqZWN0X25hbWUgfCBnIGdyb3VwX25hbWVcclxuICAgIG9iamVjdF9wYXR0ZXJuICAgICAgICAgICA6IC9eW29nXVxccyooLispPy8sXHJcbiAgICAvLyBzIGJvb2xlYW5cclxuICAgIHNtb290aGluZ19wYXR0ZXJuICAgICAgICA6IC9ec1xccysoXFxkK3xvbnxvZmYpLyxcclxuICAgIC8vIG10bGxpYiBmaWxlX3JlZmVyZW5jZVxyXG4gICAgbWF0ZXJpYWxfbGlicmFyeV9wYXR0ZXJuIDogL15tdGxsaWIgLyxcclxuICAgIC8vIHVzZW10bCBtYXRlcmlhbF9uYW1lXHJcbiAgICBtYXRlcmlhbF91c2VfcGF0dGVybiAgICAgOiAvXnVzZW10bCAvXHJcbiAgfTtcclxuXHJcbn07XHJcblxyXG5USFJFRS5PQkpMb2FkZXIucHJvdG90eXBlID0ge1xyXG5cclxuICBjb25zdHJ1Y3RvcjogVEhSRUUuT0JKTG9hZGVyLFxyXG5cclxuICBsb2FkOiBmdW5jdGlvbiAoIHVybCwgb25Mb2FkLCBvblByb2dyZXNzLCBvbkVycm9yICkge1xyXG5cclxuICAgIHZhciBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5YSFJMb2FkZXIoIHNjb3BlLm1hbmFnZXIgKTtcclxuICAgIGxvYWRlci5zZXRQYXRoKCB0aGlzLnBhdGggKTtcclxuICAgIGxvYWRlci5sb2FkKCB1cmwsIGZ1bmN0aW9uICggdGV4dCApIHtcclxuXHJcbiAgICAgIG9uTG9hZCggc2NvcGUucGFyc2UoIHRleHQgKSApO1xyXG5cclxuICAgIH0sIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKTtcclxuXHJcbiAgfSxcclxuXHJcbiAgc2V0UGF0aDogZnVuY3Rpb24gKCB2YWx1ZSApIHtcclxuXHJcbiAgICB0aGlzLnBhdGggPSB2YWx1ZTtcclxuXHJcbiAgfSxcclxuXHJcbiAgc2V0TWF0ZXJpYWxzOiBmdW5jdGlvbiAoIG1hdGVyaWFscyApIHtcclxuXHJcbiAgICB0aGlzLm1hdGVyaWFscyA9IG1hdGVyaWFscztcclxuXHJcbiAgfSxcclxuXHJcbiAgX2NyZWF0ZVBhcnNlclN0YXRlIDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHZhciBzdGF0ZSA9IHtcclxuICAgICAgb2JqZWN0cyAgOiBbXSxcclxuICAgICAgb2JqZWN0ICAgOiB7fSxcclxuXHJcbiAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgIG5vcm1hbHMgIDogW10sXHJcbiAgICAgIHV2cyAgICAgIDogW10sXHJcblxyXG4gICAgICBtYXRlcmlhbExpYnJhcmllcyA6IFtdLFxyXG5cclxuICAgICAgc3RhcnRPYmplY3Q6IGZ1bmN0aW9uICggbmFtZSwgZnJvbURlY2xhcmF0aW9uICkge1xyXG5cclxuICAgICAgICAvLyBJZiB0aGUgY3VycmVudCBvYmplY3QgKGluaXRpYWwgZnJvbSByZXNldCkgaXMgbm90IGZyb20gYSBnL28gZGVjbGFyYXRpb24gaW4gdGhlIHBhcnNlZFxyXG4gICAgICAgIC8vIGZpbGUuIFdlIG5lZWQgdG8gdXNlIGl0IGZvciB0aGUgZmlyc3QgcGFyc2VkIGcvbyB0byBrZWVwIHRoaW5ncyBpbiBzeW5jLlxyXG4gICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdGhpcy5vYmplY3QuZnJvbURlY2xhcmF0aW9uID09PSBmYWxzZSApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgIHRoaXMub2JqZWN0LmZyb21EZWNsYXJhdGlvbiA9ICggZnJvbURlY2xhcmF0aW9uICE9PSBmYWxzZSApO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHJldmlvdXNNYXRlcmlhbCA9ICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCgpIDogdW5kZWZpbmVkICk7XHJcblxyXG4gICAgICAgIHRoaXMub2JqZWN0ID0ge1xyXG4gICAgICAgICAgbmFtZSA6IG5hbWUgfHwgJycsXHJcbiAgICAgICAgICBmcm9tRGVjbGFyYXRpb24gOiAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKSxcclxuXHJcbiAgICAgICAgICBnZW9tZXRyeSA6IHtcclxuICAgICAgICAgICAgdmVydGljZXMgOiBbXSxcclxuICAgICAgICAgICAgbm9ybWFscyAgOiBbXSxcclxuICAgICAgICAgICAgdXZzICAgICAgOiBbXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1hdGVyaWFscyA6IFtdLFxyXG4gICAgICAgICAgc21vb3RoIDogdHJ1ZSxcclxuXHJcbiAgICAgICAgICBzdGFydE1hdGVyaWFsIDogZnVuY3Rpb24oIG5hbWUsIGxpYnJhcmllcyApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX2ZpbmFsaXplKCBmYWxzZSApO1xyXG5cclxuICAgICAgICAgICAgLy8gTmV3IHVzZW10bCBkZWNsYXJhdGlvbiBvdmVyd3JpdGVzIGFuIGluaGVyaXRlZCBtYXRlcmlhbCwgZXhjZXB0IGlmIGZhY2VzIHdlcmUgZGVjbGFyZWRcclxuICAgICAgICAgICAgLy8gYWZ0ZXIgdGhlIG1hdGVyaWFsLCB0aGVuIGl0IG11c3QgYmUgcHJlc2VydmVkIGZvciBwcm9wZXIgTXVsdGlNYXRlcmlhbCBjb250aW51YXRpb24uXHJcbiAgICAgICAgICAgIGlmICggcHJldmlvdXMgJiYgKCBwcmV2aW91cy5pbmhlcml0ZWQgfHwgcHJldmlvdXMuZ3JvdXBDb3VudCA8PSAwICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnNwbGljZSggcHJldmlvdXMuaW5kZXgsIDEgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IHtcclxuICAgICAgICAgICAgICBpbmRleCAgICAgIDogdGhpcy5tYXRlcmlhbHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgIG5hbWUgICAgICAgOiBuYW1lIHx8ICcnLFxyXG4gICAgICAgICAgICAgIG10bGxpYiAgICAgOiAoIEFycmF5LmlzQXJyYXkoIGxpYnJhcmllcyApICYmIGxpYnJhcmllcy5sZW5ndGggPiAwID8gbGlicmFyaWVzWyBsaWJyYXJpZXMubGVuZ3RoIC0gMSBdIDogJycgKSxcclxuICAgICAgICAgICAgICBzbW9vdGggICAgIDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuc21vb3RoIDogdGhpcy5zbW9vdGggKSxcclxuICAgICAgICAgICAgICBncm91cFN0YXJ0IDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuZ3JvdXBFbmQgOiAwICksXHJcbiAgICAgICAgICAgICAgZ3JvdXBFbmQgICA6IC0xLFxyXG4gICAgICAgICAgICAgIGdyb3VwQ291bnQgOiAtMSxcclxuICAgICAgICAgICAgICBpbmhlcml0ZWQgIDogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICAgIGNsb25lIDogZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgaW5kZXggICAgICA6ICggdHlwZW9mIGluZGV4ID09PSAnbnVtYmVyJyA/IGluZGV4IDogdGhpcy5pbmRleCApLFxyXG4gICAgICAgICAgICAgICAgICBuYW1lICAgICAgIDogdGhpcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICBtdGxsaWIgICAgIDogdGhpcy5tdGxsaWIsXHJcbiAgICAgICAgICAgICAgICAgIHNtb290aCAgICAgOiB0aGlzLnNtb290aCxcclxuICAgICAgICAgICAgICAgICAgZ3JvdXBTdGFydCA6IHRoaXMuZ3JvdXBFbmQsXHJcbiAgICAgICAgICAgICAgICAgIGdyb3VwRW5kICAgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgZ3JvdXBDb3VudCA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICBpbmhlcml0ZWQgIDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMucHVzaCggbWF0ZXJpYWwgKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgIGN1cnJlbnRNYXRlcmlhbCA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFscy5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGVyaWFsc1sgdGhpcy5tYXRlcmlhbHMubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgX2ZpbmFsaXplIDogZnVuY3Rpb24oIGVuZCApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBsYXN0TXVsdGlNYXRlcmlhbCA9IHRoaXMuY3VycmVudE1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgIGlmICggbGFzdE11bHRpTWF0ZXJpYWwgJiYgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgPT09IC0xICkge1xyXG5cclxuICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cEVuZCA9IHRoaXMuZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoIC8gMztcclxuICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cENvdW50ID0gbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgLSBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cFN0YXJ0O1xyXG4gICAgICAgICAgICAgIGxhc3RNdWx0aU1hdGVyaWFsLmluaGVyaXRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gR3VhcmFudGVlIGF0IGxlYXN0IG9uZSBlbXB0eSBtYXRlcmlhbCwgdGhpcyBtYWtlcyB0aGUgY3JlYXRpb24gbGF0ZXIgbW9yZSBzdHJhaWdodCBmb3J3YXJkLlxyXG4gICAgICAgICAgICBpZiAoIGVuZCAhPT0gZmFsc2UgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID09PSAwICkge1xyXG4gICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbmFtZSAgIDogJycsXHJcbiAgICAgICAgICAgICAgICBzbW9vdGggOiB0aGlzLnNtb290aFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbGFzdE11bHRpTWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEluaGVyaXQgcHJldmlvdXMgb2JqZWN0cyBtYXRlcmlhbC5cclxuICAgICAgICAvLyBTcGVjIHRlbGxzIHVzIHRoYXQgYSBkZWNsYXJlZCBtYXRlcmlhbCBtdXN0IGJlIHNldCB0byBhbGwgb2JqZWN0cyB1bnRpbCBhIG5ldyBtYXRlcmlhbCBpcyBkZWNsYXJlZC5cclxuICAgICAgICAvLyBJZiBhIHVzZW10bCBkZWNsYXJhdGlvbiBpcyBlbmNvdW50ZXJlZCB3aGlsZSB0aGlzIG5ldyBvYmplY3QgaXMgYmVpbmcgcGFyc2VkLCBpdCB3aWxsXHJcbiAgICAgICAgLy8gb3ZlcndyaXRlIHRoZSBpbmhlcml0ZWQgbWF0ZXJpYWwuIEV4Y2VwdGlvbiBiZWluZyB0aGF0IHRoZXJlIHdhcyBhbHJlYWR5IGZhY2UgZGVjbGFyYXRpb25zXHJcbiAgICAgICAgLy8gdG8gdGhlIGluaGVyaXRlZCBtYXRlcmlhbCwgdGhlbiBpdCB3aWxsIGJlIHByZXNlcnZlZCBmb3IgcHJvcGVyIE11bHRpTWF0ZXJpYWwgY29udGludWF0aW9uLlxyXG5cclxuICAgICAgICBpZiAoIHByZXZpb3VzTWF0ZXJpYWwgJiYgcHJldmlvdXNNYXRlcmlhbC5uYW1lICYmIHR5cGVvZiBwcmV2aW91c01hdGVyaWFsLmNsb25lID09PSBcImZ1bmN0aW9uXCIgKSB7XHJcblxyXG4gICAgICAgICAgdmFyIGRlY2xhcmVkID0gcHJldmlvdXNNYXRlcmlhbC5jbG9uZSggMCApO1xyXG4gICAgICAgICAgZGVjbGFyZWQuaW5oZXJpdGVkID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMub2JqZWN0Lm1hdGVyaWFscy5wdXNoKCBkZWNsYXJlZCApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKCB0aGlzLm9iamVjdCApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZpbmFsaXplIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHBhcnNlVmVydGV4SW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFyc2VOb3JtYWxJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcbiAgICAgICAgcmV0dXJuICggaW5kZXggPj0gMCA/IGluZGV4IC0gMSA6IGluZGV4ICsgbGVuIC8gMyApICogMztcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwYXJzZVVWSW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDIgKSAqIDI7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkVmVydGV4OiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgIHZhciBzcmMgPSB0aGlzLnZlcnRpY2VzO1xyXG4gICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS52ZXJ0aWNlcztcclxuXHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkVmVydGV4TGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICB2YXIgc3JjID0gdGhpcy52ZXJ0aWNlcztcclxuICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudmVydGljZXM7XHJcblxyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDIgXSApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZE5vcm1hbCA6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgdmFyIHNyYyA9IHRoaXMubm9ybWFscztcclxuICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkubm9ybWFscztcclxuXHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkVVY6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgdmFyIHNyYyA9IHRoaXMudXZzO1xyXG4gICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZFVWTGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICB2YXIgc3JjID0gdGhpcy51dnM7XHJcbiAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnV2cztcclxuXHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGRGYWNlOiBmdW5jdGlvbiAoIGEsIGIsIGMsIGQsIHVhLCB1YiwgdWMsIHVkLCBuYSwgbmIsIG5jLCBuZCApIHtcclxuXHJcbiAgICAgICAgdmFyIHZMZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdmFyIGlhID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBhLCB2TGVuICk7XHJcbiAgICAgICAgdmFyIGliID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBiLCB2TGVuICk7XHJcbiAgICAgICAgdmFyIGljID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBjLCB2TGVuICk7XHJcbiAgICAgICAgdmFyIGlkO1xyXG5cclxuICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBkLCB2TGVuICk7XHJcblxyXG4gICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGlhLCBpYiwgaWQgKTtcclxuICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCB1YSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgIHZhciB1dkxlbiA9IHRoaXMudXZzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICBpYSA9IHRoaXMucGFyc2VVVkluZGV4KCB1YSwgdXZMZW4gKTtcclxuICAgICAgICAgIGliID0gdGhpcy5wYXJzZVVWSW5kZXgoIHViLCB1dkxlbiApO1xyXG4gICAgICAgICAgaWMgPSB0aGlzLnBhcnNlVVZJbmRleCggdWMsIHV2TGVuICk7XHJcblxyXG4gICAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZFVWKCBpYSwgaWIsIGljICk7XHJcblxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVkLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRVViggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFVWKCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggbmEgIT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAvLyBOb3JtYWxzIGFyZSBtYW55IHRpbWVzIHRoZSBzYW1lLiBJZiBzbywgc2tpcCBmdW5jdGlvbiBjYWxsIGFuZCBwYXJzZUludC5cclxuICAgICAgICAgIHZhciBuTGVuID0gdGhpcy5ub3JtYWxzLmxlbmd0aDtcclxuICAgICAgICAgIGlhID0gdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYSwgbkxlbiApO1xyXG5cclxuICAgICAgICAgIGliID0gbmEgPT09IG5iID8gaWEgOiB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5iLCBuTGVuICk7XHJcbiAgICAgICAgICBpYyA9IG5hID09PSBuYyA/IGlhIDogdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYywgbkxlbiApO1xyXG5cclxuICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgaWQgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5kLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZExpbmVHZW9tZXRyeTogZnVuY3Rpb24gKCB2ZXJ0aWNlcywgdXZzICkge1xyXG5cclxuICAgICAgICB0aGlzLm9iamVjdC5nZW9tZXRyeS50eXBlID0gJ0xpbmUnO1xyXG5cclxuICAgICAgICB2YXIgdkxlbiA9IHRoaXMudmVydGljZXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciB1dkxlbiA9IHRoaXMudXZzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgZm9yICggdmFyIHZpID0gMCwgbCA9IHZlcnRpY2VzLmxlbmd0aDsgdmkgPCBsOyB2aSArKyApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLmFkZFZlcnRleExpbmUoIHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggdmVydGljZXNbIHZpIF0sIHZMZW4gKSApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoIHZhciB1dmkgPSAwLCBsID0gdXZzLmxlbmd0aDsgdXZpIDwgbDsgdXZpICsrICkge1xyXG5cclxuICAgICAgICAgIHRoaXMuYWRkVVZMaW5lKCB0aGlzLnBhcnNlVVZJbmRleCggdXZzWyB1dmkgXSwgdXZMZW4gKSApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0ZS5zdGFydE9iamVjdCggJycsIGZhbHNlICk7XHJcblxyXG4gICAgcmV0dXJuIHN0YXRlO1xyXG5cclxuICB9LFxyXG5cclxuICBwYXJzZTogZnVuY3Rpb24gKCB0ZXh0ICkge1xyXG5cclxuICAgIGNvbnNvbGUudGltZSggJ09CSkxvYWRlcicgKTtcclxuXHJcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9jcmVhdGVQYXJzZXJTdGF0ZSgpO1xyXG5cclxuICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxyXFxuJyApICE9PSAtIDEgKSB7XHJcblxyXG4gICAgICAvLyBUaGlzIGlzIGZhc3RlciB0aGFuIFN0cmluZy5zcGxpdCB3aXRoIHJlZ2V4IHRoYXQgc3BsaXRzIG9uIGJvdGhcclxuICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSggJ1xcclxcbicsICdcXG4nICk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaW5lcyA9IHRleHQuc3BsaXQoICdcXG4nICk7XHJcbiAgICB2YXIgbGluZSA9ICcnLCBsaW5lRmlyc3RDaGFyID0gJycsIGxpbmVTZWNvbmRDaGFyID0gJyc7XHJcbiAgICB2YXIgbGluZUxlbmd0aCA9IDA7XHJcbiAgICB2YXIgcmVzdWx0ID0gW107XHJcblxyXG4gICAgLy8gRmFzdGVyIHRvIGp1c3QgdHJpbSBsZWZ0IHNpZGUgb2YgdGhlIGxpbmUuIFVzZSBpZiBhdmFpbGFibGUuXHJcbiAgICB2YXIgdHJpbUxlZnQgPSAoIHR5cGVvZiAnJy50cmltTGVmdCA9PT0gJ2Z1bmN0aW9uJyApO1xyXG5cclxuICAgIGZvciAoIHZhciBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XHJcblxyXG4gICAgICBsaW5lID0gbGluZXNbIGkgXTtcclxuXHJcbiAgICAgIGxpbmUgPSB0cmltTGVmdCA/IGxpbmUudHJpbUxlZnQoKSA6IGxpbmUudHJpbSgpO1xyXG5cclxuICAgICAgbGluZUxlbmd0aCA9IGxpbmUubGVuZ3RoO1xyXG5cclxuICAgICAgaWYgKCBsaW5lTGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICBsaW5lRmlyc3RDaGFyID0gbGluZS5jaGFyQXQoIDAgKTtcclxuXHJcbiAgICAgIC8vIEB0b2RvIGludm9rZSBwYXNzZWQgaW4gaGFuZGxlciBpZiBhbnlcclxuICAgICAgaWYgKCBsaW5lRmlyc3RDaGFyID09PSAnIycgKSBjb250aW51ZTtcclxuXHJcbiAgICAgIGlmICggbGluZUZpcnN0Q2hhciA9PT0gJ3YnICkge1xyXG5cclxuICAgICAgICBsaW5lU2Vjb25kQ2hhciA9IGxpbmUuY2hhckF0KCAxICk7XHJcblxyXG4gICAgICAgIGlmICggbGluZVNlY29uZENoYXIgPT09ICcgJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnZlcnRleF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAxICAgICAgMiAgICAgIDNcclxuICAgICAgICAgIC8vIFtcInYgMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuXHJcbiAgICAgICAgICBzdGF0ZS52ZXJ0aWNlcy5wdXNoKFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDMgXSApXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJ24nICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAubm9ybWFsX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAxICAgICAgMiAgICAgIDNcclxuICAgICAgICAgIC8vIFtcInZuIDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcblxyXG4gICAgICAgICAgc3RhdGUubm9ybWFscy5wdXNoKFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDMgXSApXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJ3QnICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAudXZfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgMSAgICAgIDJcclxuICAgICAgICAgIC8vIFtcInZ0IDAuMSAwLjJcIiwgXCIwLjFcIiwgXCIwLjJcIl1cclxuXHJcbiAgICAgICAgICBzdGF0ZS51dnMucHVzaChcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCB2ZXJ0ZXgvbm9ybWFsL3V2IGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIGlmICggbGluZUZpcnN0Q2hhciA9PT0gXCJmXCIgKSB7XHJcblxyXG4gICAgICAgIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91dl9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbFxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAgICAgIDEgICAgMiAgICAzICAgIDQgICAgNSAgICA2ICAgIDcgICAgOCAgICA5ICAgMTAgICAgICAgICAxMSAgICAgICAgIDEyXHJcbiAgICAgICAgICAvLyBbXCJmIDEvMS8xIDIvMi8yIDMvMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDcgXSwgcmVzdWx0WyAxMCBdLFxyXG4gICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgOCBdLCByZXN1bHRbIDExIF0sXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMyBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA5IF0sIHJlc3VsdFsgMTIgXVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91di5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyBmIHZlcnRleC91diB2ZXJ0ZXgvdXYgdmVydGV4L3V2XHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgIC8vIFtcImYgMS8xIDIvMiAzLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMyBdLCByZXN1bHRbIDUgXSwgcmVzdWx0WyA3IF0sXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMiBdLCByZXN1bHRbIDQgXSwgcmVzdWx0WyA2IF0sIHJlc3VsdFsgOCBdXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLmZhY2VfdmVydGV4X25vcm1hbC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgIC8vIFtcImYgMS8vMSAyLy8yIDMvLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMyBdLCByZXN1bHRbIDUgXSwgcmVzdWx0WyA3IF0sXHJcbiAgICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXguZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gZiB2ZXJ0ZXggdmVydGV4IHZlcnRleFxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgIDEgICAgMiAgICAzICAgNFxyXG4gICAgICAgICAgLy8gW1wiZiAxIDIgM1wiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMiBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA0IF1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIlVuZXhwZWN0ZWQgZmFjZSBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwibFwiICkge1xyXG5cclxuICAgICAgICB2YXIgbGluZVBhcnRzID0gbGluZS5zdWJzdHJpbmcoIDEgKS50cmltKCkuc3BsaXQoIFwiIFwiICk7XHJcbiAgICAgICAgdmFyIGxpbmVWZXJ0aWNlcyA9IFtdLCBsaW5lVVZzID0gW107XHJcblxyXG4gICAgICAgIGlmICggbGluZS5pbmRleE9mKCBcIi9cIiApID09PSAtIDEgKSB7XHJcblxyXG4gICAgICAgICAgbGluZVZlcnRpY2VzID0gbGluZVBhcnRzO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIGZvciAoIHZhciBsaSA9IDAsIGxsZW4gPSBsaW5lUGFydHMubGVuZ3RoOyBsaSA8IGxsZW47IGxpICsrICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcnRzID0gbGluZVBhcnRzWyBsaSBdLnNwbGl0KCBcIi9cIiApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBwYXJ0c1sgMCBdICE9PSBcIlwiICkgbGluZVZlcnRpY2VzLnB1c2goIHBhcnRzWyAwIF0gKTtcclxuICAgICAgICAgICAgaWYgKCBwYXJ0c1sgMSBdICE9PSBcIlwiICkgbGluZVVWcy5wdXNoKCBwYXJ0c1sgMSBdICk7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgc3RhdGUuYWRkTGluZUdlb21ldHJ5KCBsaW5lVmVydGljZXMsIGxpbmVVVnMgKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAub2JqZWN0X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgIC8vIG8gb2JqZWN0X25hbWVcclxuICAgICAgICAvLyBvclxyXG4gICAgICAgIC8vIGcgZ3JvdXBfbmFtZVxyXG5cclxuICAgICAgICB2YXIgbmFtZSA9IHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKTtcclxuICAgICAgICBzdGF0ZS5zdGFydE9iamVjdCggbmFtZSApO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggdGhpcy5yZWdleHAubWF0ZXJpYWxfdXNlX3BhdHRlcm4udGVzdCggbGluZSApICkge1xyXG5cclxuICAgICAgICAvLyBtYXRlcmlhbFxyXG5cclxuICAgICAgICBzdGF0ZS5vYmplY3Quc3RhcnRNYXRlcmlhbCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCksIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF9saWJyYXJ5X3BhdHRlcm4udGVzdCggbGluZSApICkge1xyXG5cclxuICAgICAgICAvLyBtdGwgZmlsZVxyXG5cclxuICAgICAgICBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcy5wdXNoKCBsaW5lLnN1YnN0cmluZyggNyApLnRyaW0oKSApO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5zbW9vdGhpbmdfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgLy8gc21vb3RoIHNoYWRpbmdcclxuXHJcbiAgICAgICAgLy8gQHRvZG8gSGFuZGxlIGZpbGVzIHRoYXQgaGF2ZSB2YXJ5aW5nIHNtb290aCB2YWx1ZXMgZm9yIGEgc2V0IG9mIGZhY2VzIGluc2lkZSBvbmUgZ2VvbWV0cnksXHJcbiAgICAgICAgLy8gYnV0IGRvZXMgbm90IGRlZmluZSBhIHVzZW10bCBmb3IgZWFjaCBmYWNlIHNldC5cclxuICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBkZXRlY3RlZCBhbmQgYSBkdW1teSBtYXRlcmlhbCBjcmVhdGVkIChsYXRlciBNdWx0aU1hdGVyaWFsIGFuZCBnZW9tZXRyeSBncm91cHMpLlxyXG4gICAgICAgIC8vIFRoaXMgcmVxdWlyZXMgc29tZSBjYXJlIHRvIG5vdCBjcmVhdGUgZXh0cmEgbWF0ZXJpYWwgb24gZWFjaCBzbW9vdGggdmFsdWUgZm9yIFwibm9ybWFsXCIgb2JqIGZpbGVzLlxyXG4gICAgICAgIC8vIHdoZXJlIGV4cGxpY2l0IHVzZW10bCBkZWZpbmVzIGdlb21ldHJ5IGdyb3Vwcy5cclxuICAgICAgICAvLyBFeGFtcGxlIGFzc2V0OiBleGFtcGxlcy9tb2RlbHMvb2JqL2NlcmJlcnVzL0NlcmJlcnVzLm9ialxyXG5cclxuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHRbIDEgXS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBzdGF0ZS5vYmplY3Quc21vb3RoID0gKCB2YWx1ZSA9PT0gJzEnIHx8IHZhbHVlID09PSAnb24nICk7XHJcblxyXG4gICAgICAgIHZhciBtYXRlcmlhbCA9IHN0YXRlLm9iamVjdC5jdXJyZW50TWF0ZXJpYWwoKTtcclxuICAgICAgICBpZiAoIG1hdGVyaWFsICkge1xyXG5cclxuICAgICAgICAgIG1hdGVyaWFsLnNtb290aCA9IHN0YXRlLm9iamVjdC5zbW9vdGg7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIEhhbmRsZSBudWxsIHRlcm1pbmF0ZWQgZmlsZXMgd2l0aG91dCBleGNlcHRpb25cclxuICAgICAgICBpZiAoIGxpbmUgPT09ICdcXDAnICkgY29udGludWU7XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGUuZmluYWxpemUoKTtcclxuXHJcbiAgICB2YXIgY29udGFpbmVyID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICBjb250YWluZXIubWF0ZXJpYWxMaWJyYXJpZXMgPSBbXS5jb25jYXQoIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcblxyXG4gICAgZm9yICggdmFyIGkgPSAwLCBsID0gc3RhdGUub2JqZWN0cy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgdmFyIG9iamVjdCA9IHN0YXRlLm9iamVjdHNbIGkgXTtcclxuICAgICAgdmFyIGdlb21ldHJ5ID0gb2JqZWN0Lmdlb21ldHJ5O1xyXG4gICAgICB2YXIgbWF0ZXJpYWxzID0gb2JqZWN0Lm1hdGVyaWFscztcclxuICAgICAgdmFyIGlzTGluZSA9ICggZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmUnICk7XHJcblxyXG4gICAgICAvLyBTa2lwIG8vZyBsaW5lIGRlY2xhcmF0aW9ucyB0aGF0IGRpZCBub3QgZm9sbG93IHdpdGggYW55IGZhY2VzXHJcbiAgICAgIGlmICggZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICB2YXIgYnVmZmVyZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcclxuXHJcbiAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkudmVydGljZXMgKSwgMyApICk7XHJcblxyXG4gICAgICBpZiAoIGdlb21ldHJ5Lm5vcm1hbHMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCAnbm9ybWFsJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkubm9ybWFscyApLCAzICkgKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIGdlb21ldHJ5LnV2cy5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5LnV2cyApLCAyICkgKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENyZWF0ZSBtYXRlcmlhbHNcclxuXHJcbiAgICAgIHZhciBjcmVhdGVkTWF0ZXJpYWxzID0gW107XHJcblxyXG4gICAgICBmb3IgKCB2YXIgbWkgPSAwLCBtaUxlbiA9IG1hdGVyaWFscy5sZW5ndGg7IG1pIDwgbWlMZW4gOyBtaSsrICkge1xyXG5cclxuICAgICAgICB2YXIgc291cmNlTWF0ZXJpYWwgPSBtYXRlcmlhbHNbbWldO1xyXG4gICAgICAgIHZhciBtYXRlcmlhbCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFscyAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICBtYXRlcmlhbCA9IHRoaXMubWF0ZXJpYWxzLmNyZWF0ZSggc291cmNlTWF0ZXJpYWwubmFtZSApO1xyXG5cclxuICAgICAgICAgIC8vIG10bCBldGMuIGxvYWRlcnMgcHJvYmFibHkgY2FuJ3QgY3JlYXRlIGxpbmUgbWF0ZXJpYWxzIGNvcnJlY3RseSwgY29weSBwcm9wZXJ0aWVzIHRvIGEgbGluZSBtYXRlcmlhbC5cclxuICAgICAgICAgIGlmICggaXNMaW5lICYmIG1hdGVyaWFsICYmICEgKCBtYXRlcmlhbCBpbnN0YW5jZW9mIFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsICkgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWxMaW5lID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgIG1hdGVyaWFsTGluZS5jb3B5KCBtYXRlcmlhbCApO1xyXG4gICAgICAgICAgICBtYXRlcmlhbCA9IG1hdGVyaWFsTGluZTtcclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCAhIG1hdGVyaWFsICkge1xyXG5cclxuICAgICAgICAgIG1hdGVyaWFsID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgpIDogbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCkgKTtcclxuICAgICAgICAgIG1hdGVyaWFsLm5hbWUgPSBzb3VyY2VNYXRlcmlhbC5uYW1lO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hdGVyaWFsLnNoYWRpbmcgPSBzb3VyY2VNYXRlcmlhbC5zbW9vdGggPyBUSFJFRS5TbW9vdGhTaGFkaW5nIDogVEhSRUUuRmxhdFNoYWRpbmc7XHJcblxyXG4gICAgICAgIGNyZWF0ZWRNYXRlcmlhbHMucHVzaChtYXRlcmlhbCk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDcmVhdGUgbWVzaFxyXG5cclxuICAgICAgdmFyIG1lc2g7XHJcblxyXG4gICAgICBpZiAoIGNyZWF0ZWRNYXRlcmlhbHMubGVuZ3RoID4gMSApIHtcclxuXHJcbiAgICAgICAgZm9yICggdmFyIG1pID0gMCwgbWlMZW4gPSBtYXRlcmlhbHMubGVuZ3RoOyBtaSA8IG1pTGVuIDsgbWkrKyApIHtcclxuXHJcbiAgICAgICAgICB2YXIgc291cmNlTWF0ZXJpYWwgPSBtYXRlcmlhbHNbbWldO1xyXG4gICAgICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkR3JvdXAoIHNvdXJjZU1hdGVyaWFsLmdyb3VwU3RhcnQsIHNvdXJjZU1hdGVyaWFsLmdyb3VwQ291bnQsIG1pICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG11bHRpTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTXVsdGlNYXRlcmlhbCggY3JlYXRlZE1hdGVyaWFscyApO1xyXG4gICAgICAgIG1lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBtdWx0aU1hdGVyaWFsICkgOiBuZXcgVEhSRUUuTGluZSggYnVmZmVyZ2VvbWV0cnksIG11bHRpTWF0ZXJpYWwgKSApO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbIDAgXSApIDogbmV3IFRIUkVFLkxpbmUoIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzWyAwIF0gKSApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBtZXNoLm5hbWUgPSBvYmplY3QubmFtZTtcclxuXHJcbiAgICAgIGNvbnRhaW5lci5hZGQoIG1lc2ggKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS50aW1lRW5kKCAnT0JKTG9hZGVyJyApO1xyXG5cclxuICAgIHJldHVybiBjb250YWluZXI7XHJcblxyXG4gIH1cclxuXHJcbn07IiwiVEhSRUUuVml2ZUNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoIGlkICkge1xyXG5cclxuICBUSFJFRS5PYmplY3QzRC5jYWxsKCB0aGlzICk7XHJcblxyXG4gIHRoaXMubWF0cml4QXV0b1VwZGF0ZSA9IGZhbHNlO1xyXG4gIHRoaXMuc3RhbmRpbmdNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xyXG5cclxuICB2YXIgc2NvcGUgPSB0aGlzO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB1cGRhdGUgKTtcclxuXHJcbiAgICB2YXIgZ2FtZXBhZCA9IG5hdmlnYXRvci5nZXRHYW1lcGFkcygpWyBpZCBdO1xyXG5cclxuICAgIGlmICggZ2FtZXBhZCAhPT0gdW5kZWZpbmVkICYmIGdhbWVwYWQucG9zZSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgIHZhciBwb3NlID0gZ2FtZXBhZC5wb3NlO1xyXG5cclxuICAgICAgc2NvcGUucG9zaXRpb24uZnJvbUFycmF5KCBwb3NlLnBvc2l0aW9uICk7XHJcbiAgICAgIHNjb3BlLnF1YXRlcm5pb24uZnJvbUFycmF5KCBwb3NlLm9yaWVudGF0aW9uICk7XHJcbiAgICAgIHNjb3BlLm1hdHJpeC5jb21wb3NlKCBzY29wZS5wb3NpdGlvbiwgc2NvcGUucXVhdGVybmlvbiwgc2NvcGUuc2NhbGUgKTtcclxuICAgICAgc2NvcGUubWF0cml4Lm11bHRpcGx5TWF0cmljZXMoIHNjb3BlLnN0YW5kaW5nTWF0cml4LCBzY29wZS5tYXRyaXggKTtcclxuICAgICAgc2NvcGUubWF0cml4V29ybGROZWVkc1VwZGF0ZSA9IHRydWU7XHJcblxyXG4gICAgICBzY29wZS52aXNpYmxlID0gdHJ1ZTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgc2NvcGUudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTtcclxuXHJcbn07XHJcblxyXG5USFJFRS5WaXZlQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBUSFJFRS5PYmplY3QzRC5wcm90b3R5cGUgKTtcclxuVEhSRUUuVml2ZUNvbnRyb2xsZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVEhSRUUuVml2ZUNvbnRyb2xsZXI7IiwiLyoqXG4gKiBAYXV0aG9yIGRtYXJjb3MgLyBodHRwczovL2dpdGh1Yi5jb20vZG1hcmNvc1xuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbVxuICovXG5cblRIUkVFLlZSQ29udHJvbHMgPSBmdW5jdGlvbiAoIG9iamVjdCwgb25FcnJvciApIHtcblxuXHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdHZhciB2ckRpc3BsYXksIHZyRGlzcGxheXM7XG5cblx0dmFyIHN0YW5kaW5nTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcblxuXHRmdW5jdGlvbiBnb3RWUkRpc3BsYXlzKCBkaXNwbGF5cyApIHtcblxuXHRcdHZyRGlzcGxheXMgPSBkaXNwbGF5cztcblxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IGRpc3BsYXlzLmxlbmd0aDsgaSArKyApIHtcblxuXHRcdFx0aWYgKCAoICdWUkRpc3BsYXknIGluIHdpbmRvdyAmJiBkaXNwbGF5c1sgaSBdIGluc3RhbmNlb2YgVlJEaXNwbGF5ICkgfHxcblx0XHRcdFx0ICggJ1Bvc2l0aW9uU2Vuc29yVlJEZXZpY2UnIGluIHdpbmRvdyAmJiBkaXNwbGF5c1sgaSBdIGluc3RhbmNlb2YgUG9zaXRpb25TZW5zb3JWUkRldmljZSApICkge1xuXG5cdFx0XHRcdHZyRGlzcGxheSA9IGRpc3BsYXlzWyBpIF07XG5cdFx0XHRcdGJyZWFrOyAgLy8gV2Uga2VlcCB0aGUgZmlyc3Qgd2UgZW5jb3VudGVyXG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGlmICggdnJEaXNwbGF5ID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdGlmICggb25FcnJvciApIG9uRXJyb3IoICdWUiBpbnB1dCBub3QgYXZhaWxhYmxlLicgKTtcblxuXHRcdH1cblxuXHR9XG5cblx0aWYgKCBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cyApIHtcblxuXHRcdG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzKCkudGhlbiggZ290VlJEaXNwbGF5cyApO1xuXG5cdH0gZWxzZSBpZiAoIG5hdmlnYXRvci5nZXRWUkRldmljZXMgKSB7XG5cblx0XHQvLyBEZXByZWNhdGVkIEFQSS5cblx0XHRuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzKCkudGhlbiggZ290VlJEaXNwbGF5cyApO1xuXG5cdH1cblxuXHQvLyB0aGUgUmlmdCBTREsgcmV0dXJucyB0aGUgcG9zaXRpb24gaW4gbWV0ZXJzXG5cdC8vIHRoaXMgc2NhbGUgZmFjdG9yIGFsbG93cyB0aGUgdXNlciB0byBkZWZpbmUgaG93IG1ldGVyc1xuXHQvLyBhcmUgY29udmVydGVkIHRvIHNjZW5lIHVuaXRzLlxuXG5cdHRoaXMuc2NhbGUgPSAxO1xuXG5cdC8vIElmIHRydWUgd2lsbCB1c2UgXCJzdGFuZGluZyBzcGFjZVwiIGNvb3JkaW5hdGUgc3lzdGVtIHdoZXJlIHk9MCBpcyB0aGVcblx0Ly8gZmxvb3IgYW5kIHg9MCwgej0wIGlzIHRoZSBjZW50ZXIgb2YgdGhlIHJvb20uXG5cdHRoaXMuc3RhbmRpbmcgPSBmYWxzZTtcblxuXHQvLyBEaXN0YW5jZSBmcm9tIHRoZSB1c2VycyBleWVzIHRvIHRoZSBmbG9vciBpbiBtZXRlcnMuIFVzZWQgd2hlblxuXHQvLyBzdGFuZGluZz10cnVlIGJ1dCB0aGUgVlJEaXNwbGF5IGRvZXNuJ3QgcHJvdmlkZSBzdGFnZVBhcmFtZXRlcnMuXG5cdHRoaXMudXNlckhlaWdodCA9IDEuNjtcblxuXHR0aGlzLmdldFZSRGlzcGxheSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB2ckRpc3BsYXk7XG5cblx0fTtcblxuXHR0aGlzLmdldFZSRGlzcGxheXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdnJEaXNwbGF5cztcblxuXHR9O1xuXG5cdHRoaXMuZ2V0U3RhbmRpbmdNYXRyaXggPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gc3RhbmRpbmdNYXRyaXg7XG5cblx0fTtcblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICggdnJEaXNwbGF5ICkge1xuXG5cdFx0XHRpZiAoIHZyRGlzcGxheS5nZXRQb3NlICkge1xuXG5cdFx0XHRcdHZhciBwb3NlID0gdnJEaXNwbGF5LmdldFBvc2UoKTtcblxuXHRcdFx0XHRpZiAoIHBvc2Uub3JpZW50YXRpb24gIT09IG51bGwgKSB7XG5cblx0XHRcdFx0XHRvYmplY3QucXVhdGVybmlvbi5mcm9tQXJyYXkoIHBvc2Uub3JpZW50YXRpb24gKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBwb3NlLnBvc2l0aW9uICE9PSBudWxsICkge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnBvc2l0aW9uLmZyb21BcnJheSggcG9zZS5wb3NpdGlvbiApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRvYmplY3QucG9zaXRpb24uc2V0KCAwLCAwLCAwICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIERlcHJlY2F0ZWQgQVBJLlxuXHRcdFx0XHR2YXIgc3RhdGUgPSB2ckRpc3BsYXkuZ2V0U3RhdGUoKTtcblxuXHRcdFx0XHRpZiAoIHN0YXRlLm9yaWVudGF0aW9uICE9PSBudWxsICkge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnF1YXRlcm5pb24uY29weSggc3RhdGUub3JpZW50YXRpb24gKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBzdGF0ZS5wb3NpdGlvbiAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdG9iamVjdC5wb3NpdGlvbi5jb3B5KCBzdGF0ZS5wb3NpdGlvbiApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRvYmplY3QucG9zaXRpb24uc2V0KCAwLCAwLCAwICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggdGhpcy5zdGFuZGluZyApIHtcblxuXHRcdFx0XHRpZiAoIHZyRGlzcGxheS5zdGFnZVBhcmFtZXRlcnMgKSB7XG5cblx0XHRcdFx0XHRvYmplY3QudXBkYXRlTWF0cml4KCk7XG5cblx0XHRcdFx0XHRzdGFuZGluZ01hdHJpeC5mcm9tQXJyYXkoIHZyRGlzcGxheS5zdGFnZVBhcmFtZXRlcnMuc2l0dGluZ1RvU3RhbmRpbmdUcmFuc2Zvcm0gKTtcblx0XHRcdFx0XHRvYmplY3QuYXBwbHlNYXRyaXgoIHN0YW5kaW5nTWF0cml4ICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdG9iamVjdC5wb3NpdGlvbi5zZXRZKCBvYmplY3QucG9zaXRpb24ueSArIHRoaXMudXNlckhlaWdodCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRvYmplY3QucG9zaXRpb24ubXVsdGlwbHlTY2FsYXIoIHNjb3BlLnNjYWxlICk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLnJlc2V0UG9zZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICggdnJEaXNwbGF5ICkge1xuXG5cdFx0XHRpZiAoIHZyRGlzcGxheS5yZXNldFBvc2UgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHR2ckRpc3BsYXkucmVzZXRQb3NlKCk7XG5cblx0XHRcdH0gZWxzZSBpZiAoIHZyRGlzcGxheS5yZXNldFNlbnNvciAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdC8vIERlcHJlY2F0ZWQgQVBJLlxuXHRcdFx0XHR2ckRpc3BsYXkucmVzZXRTZW5zb3IoKTtcblxuXHRcdFx0fSBlbHNlIGlmICggdnJEaXNwbGF5Lnplcm9TZW5zb3IgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHQvLyBSZWFsbHkgZGVwcmVjYXRlZCBBUEkuXG5cdFx0XHRcdHZyRGlzcGxheS56ZXJvU2Vuc29yKCk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMucmVzZXRTZW5zb3IgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRjb25zb2xlLndhcm4oICdUSFJFRS5WUkNvbnRyb2xzOiAucmVzZXRTZW5zb3IoKSBpcyBub3cgLnJlc2V0UG9zZSgpLicgKTtcblx0XHR0aGlzLnJlc2V0UG9zZSgpO1xuXG5cdH07XG5cblx0dGhpcy56ZXJvU2Vuc29yID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0Y29uc29sZS53YXJuKCAnVEhSRUUuVlJDb250cm9sczogLnplcm9TZW5zb3IoKSBpcyBub3cgLnJlc2V0UG9zZSgpLicgKTtcblx0XHR0aGlzLnJlc2V0UG9zZSgpO1xuXG5cdH07XG5cblx0dGhpcy5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0dnJEaXNwbGF5ID0gbnVsbDtcblxuXHR9O1xuXG59O1xuIiwiLyoqXG4gKiBAYXV0aG9yIGRtYXJjb3MgLyBodHRwczovL2dpdGh1Yi5jb20vZG1hcmNvc1xuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbVxuICpcbiAqIFdlYlZSIFNwZWM6IGh0dHA6Ly9tb3p2ci5naXRodWIuaW8vd2VidnItc3BlYy93ZWJ2ci5odG1sXG4gKlxuICogRmlyZWZveDogaHR0cDovL21venZyLmNvbS9kb3dubG9hZHMvXG4gKiBDaHJvbWl1bTogaHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZvbGRlcnZpZXc/aWQ9MEJ6dWRMdDIyQnFHUmJXOVdUSE10T1dNek5qUSZ1c3A9c2hhcmluZyNsaXN0XG4gKlxuICovXG5cblRIUkVFLlZSRWZmZWN0ID0gZnVuY3Rpb24gKCByZW5kZXJlciwgb25FcnJvciApIHtcblxuXHR2YXIgaXNXZWJWUjEgPSB0cnVlO1xuXG5cdHZhciB2ckRpc3BsYXksIHZyRGlzcGxheXM7XG5cdHZhciBleWVUcmFuc2xhdGlvbkwgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXHR2YXIgZXllVHJhbnNsYXRpb25SID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblx0dmFyIHJlbmRlclJlY3RMLCByZW5kZXJSZWN0Ujtcblx0dmFyIGV5ZUZPVkwsIGV5ZUZPVlI7XG5cblx0ZnVuY3Rpb24gZ290VlJEaXNwbGF5cyggZGlzcGxheXMgKSB7XG5cblx0XHR2ckRpc3BsYXlzID0gZGlzcGxheXM7XG5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBkaXNwbGF5cy5sZW5ndGg7IGkgKysgKSB7XG5cblx0XHRcdGlmICggJ1ZSRGlzcGxheScgaW4gd2luZG93ICYmIGRpc3BsYXlzWyBpIF0gaW5zdGFuY2VvZiBWUkRpc3BsYXkgKSB7XG5cblx0XHRcdFx0dnJEaXNwbGF5ID0gZGlzcGxheXNbIGkgXTtcblx0XHRcdFx0aXNXZWJWUjEgPSB0cnVlO1xuXHRcdFx0XHRicmVhazsgLy8gV2Uga2VlcCB0aGUgZmlyc3Qgd2UgZW5jb3VudGVyXG5cblx0XHRcdH0gZWxzZSBpZiAoICdITURWUkRldmljZScgaW4gd2luZG93ICYmIGRpc3BsYXlzWyBpIF0gaW5zdGFuY2VvZiBITURWUkRldmljZSApIHtcblxuXHRcdFx0XHR2ckRpc3BsYXkgPSBkaXNwbGF5c1sgaSBdO1xuXHRcdFx0XHRpc1dlYlZSMSA9IGZhbHNlO1xuXHRcdFx0XHRicmVhazsgLy8gV2Uga2VlcCB0aGUgZmlyc3Qgd2UgZW5jb3VudGVyXG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGlmICggdnJEaXNwbGF5ID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdGlmICggb25FcnJvciApIG9uRXJyb3IoICdITUQgbm90IGF2YWlsYWJsZScgKTtcblxuXHRcdH1cblxuXHR9XG5cblx0aWYgKCBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cyApIHtcblxuXHRcdG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzKCkudGhlbiggZ290VlJEaXNwbGF5cyApO1xuXG5cdH0gZWxzZSBpZiAoIG5hdmlnYXRvci5nZXRWUkRldmljZXMgKSB7XG5cblx0XHQvLyBEZXByZWNhdGVkIEFQSS5cblx0XHRuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzKCkudGhlbiggZ290VlJEaXNwbGF5cyApO1xuXG5cdH1cblxuXHQvL1xuXG5cdHRoaXMuaXNQcmVzZW50aW5nID0gZmFsc2U7XG5cdHRoaXMuc2NhbGUgPSAxO1xuXG5cdHZhciBzY29wZSA9IHRoaXM7XG5cblx0dmFyIHJlbmRlcmVyU2l6ZSA9IHJlbmRlcmVyLmdldFNpemUoKTtcblx0dmFyIHJlbmRlcmVyUGl4ZWxSYXRpbyA9IHJlbmRlcmVyLmdldFBpeGVsUmF0aW8oKTtcblxuXHR0aGlzLmdldFZSRGlzcGxheSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB2ckRpc3BsYXk7XG5cblx0fTtcblxuXHR0aGlzLmdldFZSRGlzcGxheXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdnJEaXNwbGF5cztcblxuXHR9O1xuXG5cdHRoaXMuc2V0U2l6ZSA9IGZ1bmN0aW9uICggd2lkdGgsIGhlaWdodCApIHtcblxuXHRcdHJlbmRlcmVyU2l6ZSA9IHsgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9O1xuXG5cdFx0aWYgKCBzY29wZS5pc1ByZXNlbnRpbmcgKSB7XG5cblx0XHRcdHZhciBleWVQYXJhbXNMID0gdnJEaXNwbGF5LmdldEV5ZVBhcmFtZXRlcnMoICdsZWZ0JyApO1xuXHRcdFx0cmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyggMSApO1xuXG5cdFx0XHRpZiAoIGlzV2ViVlIxICkge1xuXG5cdFx0XHRcdHJlbmRlcmVyLnNldFNpemUoIGV5ZVBhcmFtc0wucmVuZGVyV2lkdGggKiAyLCBleWVQYXJhbXNMLnJlbmRlckhlaWdodCwgZmFsc2UgKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRyZW5kZXJlci5zZXRTaXplKCBleWVQYXJhbXNMLnJlbmRlclJlY3Qud2lkdGggKiAyLCBleWVQYXJhbXNMLnJlbmRlclJlY3QuaGVpZ2h0LCBmYWxzZSApO1xuXG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRyZW5kZXJlci5zZXRQaXhlbFJhdGlvKCByZW5kZXJlclBpeGVsUmF0aW8gKTtcblx0XHRcdHJlbmRlcmVyLnNldFNpemUoIHdpZHRoLCBoZWlnaHQgKTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdC8vIGZ1bGxzY3JlZW5cblxuXHR2YXIgY2FudmFzID0gcmVuZGVyZXIuZG9tRWxlbWVudDtcblx0dmFyIHJlcXVlc3RGdWxsc2NyZWVuO1xuXHR2YXIgZXhpdEZ1bGxzY3JlZW47XG5cdHZhciBmdWxsc2NyZWVuRWxlbWVudDtcblx0dmFyIGxlZnRCb3VuZHMgPSBbIDAuMCwgMC4wLCAwLjUsIDEuMCBdO1xuXHR2YXIgcmlnaHRCb3VuZHMgPSBbIDAuNSwgMC4wLCAwLjUsIDEuMCBdO1xuXG5cdGZ1bmN0aW9uIG9uRnVsbHNjcmVlbkNoYW5nZSAoKSB7XG5cblx0XHR2YXIgd2FzUHJlc2VudGluZyA9IHNjb3BlLmlzUHJlc2VudGluZztcblx0XHRzY29wZS5pc1ByZXNlbnRpbmcgPSB2ckRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiAoIHZyRGlzcGxheS5pc1ByZXNlbnRpbmcgfHwgKCAhIGlzV2ViVlIxICYmIGRvY3VtZW50WyBmdWxsc2NyZWVuRWxlbWVudCBdIGluc3RhbmNlb2Ygd2luZG93LkhUTUxFbGVtZW50ICkgKTtcblxuXHRcdGlmICggc2NvcGUuaXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHR2YXIgZXllUGFyYW1zTCA9IHZyRGlzcGxheS5nZXRFeWVQYXJhbWV0ZXJzKCAnbGVmdCcgKTtcblx0XHRcdHZhciBleWVXaWR0aCwgZXllSGVpZ2h0O1xuXG5cdFx0XHRpZiAoIGlzV2ViVlIxICkge1xuXG5cdFx0XHRcdGV5ZVdpZHRoID0gZXllUGFyYW1zTC5yZW5kZXJXaWR0aDtcblx0XHRcdFx0ZXllSGVpZ2h0ID0gZXllUGFyYW1zTC5yZW5kZXJIZWlnaHQ7XG5cblx0XHRcdFx0aWYgKCB2ckRpc3BsYXkuZ2V0TGF5ZXJzICkge1xuXG5cdFx0XHRcdFx0dmFyIGxheWVycyA9IHZyRGlzcGxheS5nZXRMYXllcnMoKTtcblx0XHRcdFx0XHRpZiAobGF5ZXJzLmxlbmd0aCkge1xuXG5cdFx0XHRcdFx0XHRsZWZ0Qm91bmRzID0gbGF5ZXJzWzBdLmxlZnRCb3VuZHMgfHwgWyAwLjAsIDAuMCwgMC41LCAxLjAgXTtcblx0XHRcdFx0XHRcdHJpZ2h0Qm91bmRzID0gbGF5ZXJzWzBdLnJpZ2h0Qm91bmRzIHx8IFsgMC41LCAwLjAsIDAuNSwgMS4wIF07XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRleWVXaWR0aCA9IGV5ZVBhcmFtc0wucmVuZGVyUmVjdC53aWR0aDtcblx0XHRcdFx0ZXllSGVpZ2h0ID0gZXllUGFyYW1zTC5yZW5kZXJSZWN0LmhlaWdodDtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICF3YXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHRcdHJlbmRlcmVyUGl4ZWxSYXRpbyA9IHJlbmRlcmVyLmdldFBpeGVsUmF0aW8oKTtcblx0XHRcdFx0cmVuZGVyZXJTaXplID0gcmVuZGVyZXIuZ2V0U2l6ZSgpO1xuXG5cdFx0XHRcdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8oIDEgKTtcblx0XHRcdFx0cmVuZGVyZXIuc2V0U2l6ZSggZXllV2lkdGggKiAyLCBleWVIZWlnaHQsIGZhbHNlICk7XG5cblx0XHRcdH1cblxuXHRcdH0gZWxzZSBpZiAoIHdhc1ByZXNlbnRpbmcgKSB7XG5cblx0XHRcdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8oIHJlbmRlcmVyUGl4ZWxSYXRpbyApO1xuXHRcdFx0cmVuZGVyZXIuc2V0U2l6ZSggcmVuZGVyZXJTaXplLndpZHRoLCByZW5kZXJlclNpemUuaGVpZ2h0ICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGlmICggY2FudmFzLnJlcXVlc3RGdWxsc2NyZWVuICkge1xuXG5cdFx0cmVxdWVzdEZ1bGxzY3JlZW4gPSAncmVxdWVzdEZ1bGxzY3JlZW4nO1xuXHRcdGZ1bGxzY3JlZW5FbGVtZW50ID0gJ2Z1bGxzY3JlZW5FbGVtZW50Jztcblx0XHRleGl0RnVsbHNjcmVlbiA9ICdleGl0RnVsbHNjcmVlbic7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2Z1bGxzY3JlZW5jaGFuZ2UnLCBvbkZ1bGxzY3JlZW5DaGFuZ2UsIGZhbHNlICk7XG5cblx0fSBlbHNlIGlmICggY2FudmFzLm1velJlcXVlc3RGdWxsU2NyZWVuICkge1xuXG5cdFx0cmVxdWVzdEZ1bGxzY3JlZW4gPSAnbW96UmVxdWVzdEZ1bGxTY3JlZW4nO1xuXHRcdGZ1bGxzY3JlZW5FbGVtZW50ID0gJ21vekZ1bGxTY3JlZW5FbGVtZW50Jztcblx0XHRleGl0RnVsbHNjcmVlbiA9ICdtb3pDYW5jZWxGdWxsU2NyZWVuJztcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW96ZnVsbHNjcmVlbmNoYW5nZScsIG9uRnVsbHNjcmVlbkNoYW5nZSwgZmFsc2UgKTtcblxuXHR9IGVsc2Uge1xuXG5cdFx0cmVxdWVzdEZ1bGxzY3JlZW4gPSAnd2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4nO1xuXHRcdGZ1bGxzY3JlZW5FbGVtZW50ID0gJ3dlYmtpdEZ1bGxzY3JlZW5FbGVtZW50Jztcblx0XHRleGl0RnVsbHNjcmVlbiA9ICd3ZWJraXRFeGl0RnVsbHNjcmVlbic7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLCBvbkZ1bGxzY3JlZW5DaGFuZ2UsIGZhbHNlICk7XG5cblx0fVxuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAndnJkaXNwbGF5cHJlc2VudGNoYW5nZScsIG9uRnVsbHNjcmVlbkNoYW5nZSwgZmFsc2UgKTtcblxuXHR0aGlzLnNldEZ1bGxTY3JlZW4gPSBmdW5jdGlvbiAoIGJvb2xlYW4gKSB7XG5cblx0XHRyZXR1cm4gbmV3IFByb21pc2UoIGZ1bmN0aW9uICggcmVzb2x2ZSwgcmVqZWN0ICkge1xuXG5cdFx0XHRpZiAoIHZyRGlzcGxheSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdHJlamVjdCggbmV3IEVycm9yKCAnTm8gVlIgaGFyZHdhcmUgZm91bmQuJyApICk7XG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHNjb3BlLmlzUHJlc2VudGluZyA9PT0gYm9vbGVhbiApIHtcblxuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGlzV2ViVlIxICkge1xuXG5cdFx0XHRcdGlmICggYm9vbGVhbiApIHtcblxuXHRcdFx0XHRcdHJlc29sdmUoIHZyRGlzcGxheS5yZXF1ZXN0UHJlc2VudCggWyB7IHNvdXJjZTogY2FudmFzIH0gXSApICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdHJlc29sdmUoIHZyRGlzcGxheS5leGl0UHJlc2VudCgpICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGlmICggY2FudmFzWyByZXF1ZXN0RnVsbHNjcmVlbiBdICkge1xuXG5cdFx0XHRcdFx0Y2FudmFzWyBib29sZWFuID8gcmVxdWVzdEZ1bGxzY3JlZW4gOiBleGl0RnVsbHNjcmVlbiBdKCB7IHZyRGlzcGxheTogdnJEaXNwbGF5IH0gKTtcblx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoICdObyBjb21wYXRpYmxlIHJlcXVlc3RGdWxsc2NyZWVuIG1ldGhvZCBmb3VuZC4nICk7XG5cdFx0XHRcdFx0cmVqZWN0KCBuZXcgRXJyb3IoICdObyBjb21wYXRpYmxlIHJlcXVlc3RGdWxsc2NyZWVuIG1ldGhvZCBmb3VuZC4nICkgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH0gKTtcblxuXHR9O1xuXG5cdHRoaXMucmVxdWVzdFByZXNlbnQgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5zZXRGdWxsU2NyZWVuKCB0cnVlICk7XG5cblx0fTtcblxuXHR0aGlzLmV4aXRQcmVzZW50ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuc2V0RnVsbFNjcmVlbiggZmFsc2UgKTtcblxuXHR9O1xuXG5cdHRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKCBmICkge1xuXG5cdFx0aWYgKCBpc1dlYlZSMSAmJiB2ckRpc3BsYXkgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0cmV0dXJuIHZyRGlzcGxheS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGYgKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBmICk7XG5cblx0XHR9XG5cblx0fTtcblx0XG5cdHRoaXMuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoIGggKSB7XG5cblx0XHRpZiAoIGlzV2ViVlIxICYmIHZyRGlzcGxheSAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHR2ckRpc3BsYXkuY2FuY2VsQW5pbWF0aW9uRnJhbWUoIGggKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSggaCApO1xuXG5cdFx0fVxuXG5cdH07XG5cdFxuXHR0aGlzLnN1Ym1pdEZyYW1lID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCBpc1dlYlZSMSAmJiB2ckRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiBzY29wZS5pc1ByZXNlbnRpbmcgKSB7XG5cblx0XHRcdHZyRGlzcGxheS5zdWJtaXRGcmFtZSgpO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5hdXRvU3VibWl0RnJhbWUgPSB0cnVlO1xuXG5cdC8vIHJlbmRlclxuXG5cdHZhciBjYW1lcmFMID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XG5cdGNhbWVyYUwubGF5ZXJzLmVuYWJsZSggMSApO1xuXG5cdHZhciBjYW1lcmFSID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XG5cdGNhbWVyYVIubGF5ZXJzLmVuYWJsZSggMiApO1xuXG5cdHRoaXMucmVuZGVyID0gZnVuY3Rpb24gKCBzY2VuZSwgY2FtZXJhLCByZW5kZXJUYXJnZXQsIGZvcmNlQ2xlYXIgKSB7XG5cblx0XHRpZiAoIHZyRGlzcGxheSAmJiBzY29wZS5pc1ByZXNlbnRpbmcgKSB7XG5cblx0XHRcdHZhciBhdXRvVXBkYXRlID0gc2NlbmUuYXV0b1VwZGF0ZTtcblxuXHRcdFx0aWYgKCBhdXRvVXBkYXRlICkge1xuXG5cdFx0XHRcdHNjZW5lLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG5cdFx0XHRcdHNjZW5lLmF1dG9VcGRhdGUgPSBmYWxzZTtcblxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgZXllUGFyYW1zTCA9IHZyRGlzcGxheS5nZXRFeWVQYXJhbWV0ZXJzKCAnbGVmdCcgKTtcblx0XHRcdHZhciBleWVQYXJhbXNSID0gdnJEaXNwbGF5LmdldEV5ZVBhcmFtZXRlcnMoICdyaWdodCcgKTtcblxuXHRcdFx0aWYgKCBpc1dlYlZSMSApIHtcblxuXHRcdFx0XHRleWVUcmFuc2xhdGlvbkwuZnJvbUFycmF5KCBleWVQYXJhbXNMLm9mZnNldCApO1xuXHRcdFx0XHRleWVUcmFuc2xhdGlvblIuZnJvbUFycmF5KCBleWVQYXJhbXNSLm9mZnNldCApO1xuXHRcdFx0XHRleWVGT1ZMID0gZXllUGFyYW1zTC5maWVsZE9mVmlldztcblx0XHRcdFx0ZXllRk9WUiA9IGV5ZVBhcmFtc1IuZmllbGRPZlZpZXc7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0ZXllVHJhbnNsYXRpb25MLmNvcHkoIGV5ZVBhcmFtc0wuZXllVHJhbnNsYXRpb24gKTtcblx0XHRcdFx0ZXllVHJhbnNsYXRpb25SLmNvcHkoIGV5ZVBhcmFtc1IuZXllVHJhbnNsYXRpb24gKTtcblx0XHRcdFx0ZXllRk9WTCA9IGV5ZVBhcmFtc0wucmVjb21tZW5kZWRGaWVsZE9mVmlldztcblx0XHRcdFx0ZXllRk9WUiA9IGV5ZVBhcmFtc1IucmVjb21tZW5kZWRGaWVsZE9mVmlldztcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIEFycmF5LmlzQXJyYXkoIHNjZW5lICkgKSB7XG5cblx0XHRcdFx0Y29uc29sZS53YXJuKCAnVEhSRUUuVlJFZmZlY3QucmVuZGVyKCkgbm8gbG9uZ2VyIHN1cHBvcnRzIGFycmF5cy4gVXNlIG9iamVjdC5sYXllcnMgaW5zdGVhZC4nICk7XG5cdFx0XHRcdHNjZW5lID0gc2NlbmVbIDAgXTtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBXaGVuIHJlbmRlcmluZyB3ZSBkb24ndCBjYXJlIHdoYXQgdGhlIHJlY29tbWVuZGVkIHNpemUgaXMsIG9ubHkgd2hhdCB0aGUgYWN0dWFsIHNpemVcblx0XHRcdC8vIG9mIHRoZSBiYWNrYnVmZmVyIGlzLlxuXHRcdFx0dmFyIHNpemUgPSByZW5kZXJlci5nZXRTaXplKCk7XG5cdFx0XHRyZW5kZXJSZWN0TCA9IHtcblx0XHRcdFx0eDogTWF0aC5yb3VuZCggc2l6ZS53aWR0aCAqIGxlZnRCb3VuZHNbIDAgXSApLFxuXHRcdFx0XHR5OiBNYXRoLnJvdW5kKCBzaXplLmhlaWdodCAqIGxlZnRCb3VuZHNbIDEgXSApLFxuXHRcdFx0XHR3aWR0aDogTWF0aC5yb3VuZCggc2l6ZS53aWR0aCAqIGxlZnRCb3VuZHNbIDIgXSApLFxuXHRcdFx0XHRoZWlnaHQ6ICBNYXRoLnJvdW5kKHNpemUuaGVpZ2h0ICogbGVmdEJvdW5kc1sgMyBdIClcblx0XHRcdH07XG5cdFx0XHRyZW5kZXJSZWN0UiA9IHtcblx0XHRcdFx0eDogTWF0aC5yb3VuZCggc2l6ZS53aWR0aCAqIHJpZ2h0Qm91bmRzWyAwIF0gKSxcblx0XHRcdFx0eTogTWF0aC5yb3VuZCggc2l6ZS5oZWlnaHQgKiByaWdodEJvdW5kc1sgMSBdICksXG5cdFx0XHRcdHdpZHRoOiBNYXRoLnJvdW5kKCBzaXplLndpZHRoICogcmlnaHRCb3VuZHNbIDIgXSApLFxuXHRcdFx0XHRoZWlnaHQ6ICBNYXRoLnJvdW5kKHNpemUuaGVpZ2h0ICogcmlnaHRCb3VuZHNbIDMgXSApXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAocmVuZGVyVGFyZ2V0KSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQocmVuZGVyVGFyZ2V0KTtcblx0XHRcdFx0cmVuZGVyVGFyZ2V0LnNjaXNzb3JUZXN0ID0gdHJ1ZTtcblx0XHRcdFx0XG5cdFx0XHR9IGVsc2UgIHtcblx0XHRcdFx0XG5cdFx0XHRcdHJlbmRlcmVyLnNldFNjaXNzb3JUZXN0KCB0cnVlICk7XG5cdFx0XHRcblx0XHRcdH1cblxuXHRcdFx0aWYgKCByZW5kZXJlci5hdXRvQ2xlYXIgfHwgZm9yY2VDbGVhciApIHJlbmRlcmVyLmNsZWFyKCk7XG5cblx0XHRcdGlmICggY2FtZXJhLnBhcmVudCA9PT0gbnVsbCApIGNhbWVyYS51cGRhdGVNYXRyaXhXb3JsZCgpO1xuXG5cdFx0XHRjYW1lcmFMLnByb2plY3Rpb25NYXRyaXggPSBmb3ZUb1Byb2plY3Rpb24oIGV5ZUZPVkwsIHRydWUsIGNhbWVyYS5uZWFyLCBjYW1lcmEuZmFyICk7XG5cdFx0XHRjYW1lcmFSLnByb2plY3Rpb25NYXRyaXggPSBmb3ZUb1Byb2plY3Rpb24oIGV5ZUZPVlIsIHRydWUsIGNhbWVyYS5uZWFyLCBjYW1lcmEuZmFyICk7XG5cblx0XHRcdGNhbWVyYS5tYXRyaXhXb3JsZC5kZWNvbXBvc2UoIGNhbWVyYUwucG9zaXRpb24sIGNhbWVyYUwucXVhdGVybmlvbiwgY2FtZXJhTC5zY2FsZSApO1xuXHRcdFx0Y2FtZXJhLm1hdHJpeFdvcmxkLmRlY29tcG9zZSggY2FtZXJhUi5wb3NpdGlvbiwgY2FtZXJhUi5xdWF0ZXJuaW9uLCBjYW1lcmFSLnNjYWxlICk7XG5cblx0XHRcdHZhciBzY2FsZSA9IHRoaXMuc2NhbGU7XG5cdFx0XHRjYW1lcmFMLnRyYW5zbGF0ZU9uQXhpcyggZXllVHJhbnNsYXRpb25MLCBzY2FsZSApO1xuXHRcdFx0Y2FtZXJhUi50cmFuc2xhdGVPbkF4aXMoIGV5ZVRyYW5zbGF0aW9uUiwgc2NhbGUgKTtcblxuXG5cdFx0XHQvLyByZW5kZXIgbGVmdCBleWVcblx0XHRcdGlmICggcmVuZGVyVGFyZ2V0ICkge1xuXG5cdFx0XHRcdHJlbmRlclRhcmdldC52aWV3cG9ydC5zZXQocmVuZGVyUmVjdEwueCwgcmVuZGVyUmVjdEwueSwgcmVuZGVyUmVjdEwud2lkdGgsIHJlbmRlclJlY3RMLmhlaWdodCk7XG5cdFx0XHRcdHJlbmRlclRhcmdldC5zY2lzc29yLnNldChyZW5kZXJSZWN0TC54LCByZW5kZXJSZWN0TC55LCByZW5kZXJSZWN0TC53aWR0aCwgcmVuZGVyUmVjdEwuaGVpZ2h0KTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRyZW5kZXJlci5zZXRWaWV3cG9ydCggcmVuZGVyUmVjdEwueCwgcmVuZGVyUmVjdEwueSwgcmVuZGVyUmVjdEwud2lkdGgsIHJlbmRlclJlY3RMLmhlaWdodCApO1xuXHRcdFx0XHRyZW5kZXJlci5zZXRTY2lzc29yKCByZW5kZXJSZWN0TC54LCByZW5kZXJSZWN0TC55LCByZW5kZXJSZWN0TC53aWR0aCwgcmVuZGVyUmVjdEwuaGVpZ2h0ICk7XG5cblx0XHRcdH1cblx0XHRcdHJlbmRlcmVyLnJlbmRlciggc2NlbmUsIGNhbWVyYUwsIHJlbmRlclRhcmdldCwgZm9yY2VDbGVhciApO1xuXG5cdFx0XHQvLyByZW5kZXIgcmlnaHQgZXllXG5cdFx0XHRpZiAocmVuZGVyVGFyZ2V0KSB7XG5cblx0XHRcdFx0cmVuZGVyVGFyZ2V0LnZpZXdwb3J0LnNldChyZW5kZXJSZWN0Ui54LCByZW5kZXJSZWN0Ui55LCByZW5kZXJSZWN0Ui53aWR0aCwgcmVuZGVyUmVjdFIuaGVpZ2h0KTtcbiAgXHRcdFx0XHRyZW5kZXJUYXJnZXQuc2Npc3Nvci5zZXQocmVuZGVyUmVjdFIueCwgcmVuZGVyUmVjdFIueSwgcmVuZGVyUmVjdFIud2lkdGgsIHJlbmRlclJlY3RSLmhlaWdodCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0cmVuZGVyZXIuc2V0Vmlld3BvcnQoIHJlbmRlclJlY3RSLngsIHJlbmRlclJlY3RSLnksIHJlbmRlclJlY3RSLndpZHRoLCByZW5kZXJSZWN0Ui5oZWlnaHQgKTtcblx0XHRcdFx0cmVuZGVyZXIuc2V0U2Npc3NvciggcmVuZGVyUmVjdFIueCwgcmVuZGVyUmVjdFIueSwgcmVuZGVyUmVjdFIud2lkdGgsIHJlbmRlclJlY3RSLmhlaWdodCApO1xuXG5cdFx0XHR9XG5cdFx0XHRyZW5kZXJlci5yZW5kZXIoIHNjZW5lLCBjYW1lcmFSLCByZW5kZXJUYXJnZXQsIGZvcmNlQ2xlYXIgKTtcblxuXHRcdFx0aWYgKHJlbmRlclRhcmdldCkge1xuXG5cdFx0XHRcdHJlbmRlclRhcmdldC52aWV3cG9ydC5zZXQoIDAsIDAsIHNpemUud2lkdGgsIHNpemUuaGVpZ2h0ICk7XG5cdFx0XHRcdHJlbmRlclRhcmdldC5zY2lzc29yLnNldCggMCwgMCwgc2l6ZS53aWR0aCwgc2l6ZS5oZWlnaHQgKTtcblx0XHRcdFx0cmVuZGVyVGFyZ2V0LnNjaXNzb3JUZXN0ID0gZmFsc2U7XG5cdFx0XHRcdHJlbmRlcmVyLnNldFJlbmRlclRhcmdldCggbnVsbCApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcblx0XHRcdFx0cmVuZGVyZXIuc2V0U2Npc3NvclRlc3QoIGZhbHNlICk7XG5cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKCBhdXRvVXBkYXRlICkge1xuXG5cdFx0XHRcdHNjZW5lLmF1dG9VcGRhdGUgPSB0cnVlO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggc2NvcGUuYXV0b1N1Ym1pdEZyYW1lICkge1xuXG5cdFx0XHRcdHNjb3BlLnN1Ym1pdEZyYW1lKCk7XG5cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0fVxuXG5cdFx0Ly8gUmVndWxhciByZW5kZXIgbW9kZSBpZiBub3QgSE1EXG5cblx0XHRyZW5kZXJlci5yZW5kZXIoIHNjZW5lLCBjYW1lcmEsIHJlbmRlclRhcmdldCwgZm9yY2VDbGVhciApO1xuXG5cdH07XG5cblx0Ly9cblxuXHRmdW5jdGlvbiBmb3ZUb05EQ1NjYWxlT2Zmc2V0KCBmb3YgKSB7XG5cblx0XHR2YXIgcHhzY2FsZSA9IDIuMCAvICggZm92LmxlZnRUYW4gKyBmb3YucmlnaHRUYW4gKTtcblx0XHR2YXIgcHhvZmZzZXQgPSAoIGZvdi5sZWZ0VGFuIC0gZm92LnJpZ2h0VGFuICkgKiBweHNjYWxlICogMC41O1xuXHRcdHZhciBweXNjYWxlID0gMi4wIC8gKCBmb3YudXBUYW4gKyBmb3YuZG93blRhbiApO1xuXHRcdHZhciBweW9mZnNldCA9ICggZm92LnVwVGFuIC0gZm92LmRvd25UYW4gKSAqIHB5c2NhbGUgKiAwLjU7XG5cdFx0cmV0dXJuIHsgc2NhbGU6IFsgcHhzY2FsZSwgcHlzY2FsZSBdLCBvZmZzZXQ6IFsgcHhvZmZzZXQsIHB5b2Zmc2V0IF0gfTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gZm92UG9ydFRvUHJvamVjdGlvbiggZm92LCByaWdodEhhbmRlZCwgek5lYXIsIHpGYXIgKSB7XG5cblx0XHRyaWdodEhhbmRlZCA9IHJpZ2h0SGFuZGVkID09PSB1bmRlZmluZWQgPyB0cnVlIDogcmlnaHRIYW5kZWQ7XG5cdFx0ek5lYXIgPSB6TmVhciA9PT0gdW5kZWZpbmVkID8gMC4wMSA6IHpOZWFyO1xuXHRcdHpGYXIgPSB6RmFyID09PSB1bmRlZmluZWQgPyAxMDAwMC4wIDogekZhcjtcblxuXHRcdHZhciBoYW5kZWRuZXNzU2NhbGUgPSByaWdodEhhbmRlZCA/IC0gMS4wIDogMS4wO1xuXG5cdFx0Ly8gc3RhcnQgd2l0aCBhbiBpZGVudGl0eSBtYXRyaXhcblx0XHR2YXIgbW9iaiA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XG5cdFx0dmFyIG0gPSBtb2JqLmVsZW1lbnRzO1xuXG5cdFx0Ly8gYW5kIHdpdGggc2NhbGUvb2Zmc2V0IGluZm8gZm9yIG5vcm1hbGl6ZWQgZGV2aWNlIGNvb3Jkc1xuXHRcdHZhciBzY2FsZUFuZE9mZnNldCA9IGZvdlRvTkRDU2NhbGVPZmZzZXQoIGZvdiApO1xuXG5cdFx0Ly8gWCByZXN1bHQsIG1hcCBjbGlwIGVkZ2VzIHRvIFstdywrd11cblx0XHRtWyAwICogNCArIDAgXSA9IHNjYWxlQW5kT2Zmc2V0LnNjYWxlWyAwIF07XG5cdFx0bVsgMCAqIDQgKyAxIF0gPSAwLjA7XG5cdFx0bVsgMCAqIDQgKyAyIF0gPSBzY2FsZUFuZE9mZnNldC5vZmZzZXRbIDAgXSAqIGhhbmRlZG5lc3NTY2FsZTtcblx0XHRtWyAwICogNCArIDMgXSA9IDAuMDtcblxuXHRcdC8vIFkgcmVzdWx0LCBtYXAgY2xpcCBlZGdlcyB0byBbLXcsK3ddXG5cdFx0Ly8gWSBvZmZzZXQgaXMgbmVnYXRlZCBiZWNhdXNlIHRoaXMgcHJvaiBtYXRyaXggdHJhbnNmb3JtcyBmcm9tIHdvcmxkIGNvb3JkcyB3aXRoIFk9dXAsXG5cdFx0Ly8gYnV0IHRoZSBOREMgc2NhbGluZyBoYXMgWT1kb3duICh0aGFua3MgRDNEPylcblx0XHRtWyAxICogNCArIDAgXSA9IDAuMDtcblx0XHRtWyAxICogNCArIDEgXSA9IHNjYWxlQW5kT2Zmc2V0LnNjYWxlWyAxIF07XG5cdFx0bVsgMSAqIDQgKyAyIF0gPSAtIHNjYWxlQW5kT2Zmc2V0Lm9mZnNldFsgMSBdICogaGFuZGVkbmVzc1NjYWxlO1xuXHRcdG1bIDEgKiA0ICsgMyBdID0gMC4wO1xuXG5cdFx0Ly8gWiByZXN1bHQgKHVwIHRvIHRoZSBhcHApXG5cdFx0bVsgMiAqIDQgKyAwIF0gPSAwLjA7XG5cdFx0bVsgMiAqIDQgKyAxIF0gPSAwLjA7XG5cdFx0bVsgMiAqIDQgKyAyIF0gPSB6RmFyIC8gKCB6TmVhciAtIHpGYXIgKSAqIC0gaGFuZGVkbmVzc1NjYWxlO1xuXHRcdG1bIDIgKiA0ICsgMyBdID0gKCB6RmFyICogek5lYXIgKSAvICggek5lYXIgLSB6RmFyICk7XG5cblx0XHQvLyBXIHJlc3VsdCAoPSBaIGluKVxuXHRcdG1bIDMgKiA0ICsgMCBdID0gMC4wO1xuXHRcdG1bIDMgKiA0ICsgMSBdID0gMC4wO1xuXHRcdG1bIDMgKiA0ICsgMiBdID0gaGFuZGVkbmVzc1NjYWxlO1xuXHRcdG1bIDMgKiA0ICsgMyBdID0gMC4wO1xuXG5cdFx0bW9iai50cmFuc3Bvc2UoKTtcblxuXHRcdHJldHVybiBtb2JqO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBmb3ZUb1Byb2plY3Rpb24oIGZvdiwgcmlnaHRIYW5kZWQsIHpOZWFyLCB6RmFyICkge1xuXG5cdFx0dmFyIERFRzJSQUQgPSBNYXRoLlBJIC8gMTgwLjA7XG5cblx0XHR2YXIgZm92UG9ydCA9IHtcblx0XHRcdHVwVGFuOiBNYXRoLnRhbiggZm92LnVwRGVncmVlcyAqIERFRzJSQUQgKSxcblx0XHRcdGRvd25UYW46IE1hdGgudGFuKCBmb3YuZG93bkRlZ3JlZXMgKiBERUcyUkFEICksXG5cdFx0XHRsZWZ0VGFuOiBNYXRoLnRhbiggZm92LmxlZnREZWdyZWVzICogREVHMlJBRCApLFxuXHRcdFx0cmlnaHRUYW46IE1hdGgudGFuKCBmb3YucmlnaHREZWdyZWVzICogREVHMlJBRCApXG5cdFx0fTtcblxuXHRcdHJldHVybiBmb3ZQb3J0VG9Qcm9qZWN0aW9uKCBmb3ZQb3J0LCByaWdodEhhbmRlZCwgek5lYXIsIHpGYXIgKTtcblxuXHR9XG5cbn07XG4iLCIvKipcclxuKiBAYXV0aG9yIG1yZG9vYiAvIGh0dHA6Ly9tcmRvb2IuY29tXHJcbiogQmFzZWQgb24gQHRvamlybydzIHZyLXNhbXBsZXMtdXRpbHMuanNcclxuKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0xhdGVzdEF2YWlsYWJsZSgpIHtcclxuXHJcbiAgcmV0dXJuIG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzICE9PSB1bmRlZmluZWQ7XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNBdmFpbGFibGUoKSB7XHJcblxyXG4gIHJldHVybiBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cyAhPT0gdW5kZWZpbmVkIHx8IG5hdmlnYXRvci5nZXRWUkRldmljZXMgIT09IHVuZGVmaW5lZDtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzYWdlKCkge1xyXG5cclxuICB2YXIgbWVzc2FnZTtcclxuXHJcbiAgaWYgKCBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cyApIHtcclxuXHJcbiAgICBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cygpLnRoZW4oIGZ1bmN0aW9uICggZGlzcGxheXMgKSB7XHJcblxyXG4gICAgICBpZiAoIGRpc3BsYXlzLmxlbmd0aCA9PT0gMCApIG1lc3NhZ2UgPSAnV2ViVlIgc3VwcG9ydGVkLCBidXQgbm8gVlJEaXNwbGF5cyBmb3VuZC4nO1xyXG5cclxuICAgIH0gKTtcclxuXHJcbiAgfSBlbHNlIGlmICggbmF2aWdhdG9yLmdldFZSRGV2aWNlcyApIHtcclxuXHJcbiAgICBtZXNzYWdlID0gJ1lvdXIgYnJvd3NlciBzdXBwb3J0cyBXZWJWUiBidXQgbm90IHRoZSBsYXRlc3QgdmVyc2lvbi4gU2VlIDxhIGhyZWY9XCJodHRwOi8vd2VidnIuaW5mb1wiPndlYnZyLmluZm88L2E+IGZvciBtb3JlIGluZm8uJztcclxuXHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICBtZXNzYWdlID0gJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFdlYlZSLiBTZWUgPGEgaHJlZj1cImh0dHA6Ly93ZWJ2ci5pbmZvXCI+d2VidnIuaW5mbzwvYT4gZm9yIGFzc2lzdGFuY2UuJztcclxuXHJcbiAgfVxyXG5cclxuICBpZiAoIG1lc3NhZ2UgIT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcclxuICAgIGNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICBjb250YWluZXIuc3R5bGUubGVmdCA9ICcwJztcclxuICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSAnMCc7XHJcbiAgICBjb250YWluZXIuc3R5bGUucmlnaHQgPSAnMCc7XHJcbiAgICBjb250YWluZXIuc3R5bGUuekluZGV4ID0gJzk5OSc7XHJcbiAgICBjb250YWluZXIuYWxpZ24gPSAnY2VudGVyJztcclxuXHJcbiAgICB2YXIgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xyXG4gICAgZXJyb3Iuc3R5bGUuZm9udEZhbWlseSA9ICdzYW5zLXNlcmlmJztcclxuICAgIGVycm9yLnN0eWxlLmZvbnRTaXplID0gJzE2cHgnO1xyXG4gICAgZXJyb3Iuc3R5bGUuZm9udFN0eWxlID0gJ25vcm1hbCc7XHJcbiAgICBlcnJvci5zdHlsZS5saW5lSGVpZ2h0ID0gJzI2cHgnO1xyXG4gICAgZXJyb3Iuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmZmYnO1xyXG4gICAgZXJyb3Iuc3R5bGUuY29sb3IgPSAnIzAwMCc7XHJcbiAgICBlcnJvci5zdHlsZS5wYWRkaW5nID0gJzEwcHggMjBweCc7XHJcbiAgICBlcnJvci5zdHlsZS5tYXJnaW4gPSAnNTBweCc7XHJcbiAgICBlcnJvci5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XHJcbiAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKCBlcnJvciApO1xyXG5cclxuICAgIHJldHVybiBjb250YWluZXI7XHJcblxyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRCdXR0b24oIGVmZmVjdCApIHtcclxuXHJcbiAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdidXR0b24nICk7XHJcbiAgYnV0dG9uLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICBidXR0b24uc3R5bGUubGVmdCA9ICdjYWxjKDUwJSAtIDUwcHgpJztcclxuICBidXR0b24uc3R5bGUuYm90dG9tID0gJzIwcHgnO1xyXG4gIGJ1dHRvbi5zdHlsZS53aWR0aCA9ICcxMDBweCc7XHJcbiAgYnV0dG9uLnN0eWxlLmJvcmRlciA9ICcwJztcclxuICBidXR0b24uc3R5bGUucGFkZGluZyA9ICc4cHgnO1xyXG4gIGJ1dHRvbi5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgYnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjMDAwJztcclxuICBidXR0b24uc3R5bGUuY29sb3IgPSAnI2ZmZic7XHJcbiAgYnV0dG9uLnN0eWxlLmZvbnRGYW1pbHkgPSAnc2Fucy1zZXJpZic7XHJcbiAgYnV0dG9uLnN0eWxlLmZvbnRTaXplID0gJzEzcHgnO1xyXG4gIGJ1dHRvbi5zdHlsZS5mb250U3R5bGUgPSAnbm9ybWFsJztcclxuICBidXR0b24uc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgYnV0dG9uLnN0eWxlLnpJbmRleCA9ICc5OTknO1xyXG4gIGJ1dHRvbi50ZXh0Q29udGVudCA9ICdFTlRFUiBWUic7XHJcbiAgYnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBlZmZlY3QuaXNQcmVzZW50aW5nID8gZWZmZWN0LmV4aXRQcmVzZW50KCkgOiBlZmZlY3QucmVxdWVzdFByZXNlbnQoKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICd2cmRpc3BsYXlwcmVzZW50Y2hhbmdlJywgZnVuY3Rpb24gKCBldmVudCApIHtcclxuXHJcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSBlZmZlY3QuaXNQcmVzZW50aW5nID8gJ0VYSVQgVlInIDogJ0VOVEVSIFZSJztcclxuXHJcbiAgfSwgZmFsc2UgKTtcclxuXHJcbiAgcmV0dXJuIGJ1dHRvbjtcclxuXHJcbn1cclxuXHJcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiJdfQ==
