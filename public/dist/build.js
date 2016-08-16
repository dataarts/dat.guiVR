(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _vrviewer = require('./vrviewer');

var _vrviewer2 = _interopRequireDefault(_vrviewer);

var _vrpad = require('./vrpad');

var VRPad = _interopRequireWildcard(_vrpad);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createApp = (0, _vrviewer2.default)(THREE);

var _createApp = createApp({
  autoEnter: false,
  emptyRoom: true
});

var scene = _createApp.scene;
var camera = _createApp.camera;
var events = _createApp.events;
var toggleVR = _createApp.toggleVR;


scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial()));

var vrpad = VRPad.create();

events.on('tick', function (dt) {
  vrpad.update();
});

vrpad.events.on('connected0', function (pad) {
  pad.on('button3Pressed', function (index, value) {
    toggleVR();
  });
});

vrpad.events.on('connected1', function (pad) {
  pad.on('button3Pressed', function (index, value) {
    location.reload();
  });
});

},{"./vrpad":2,"./vrviewer":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {

  var pads = [];

  var events = new _events2.default();

  function update() {
    var gamePads = navigator.getGamepads();
    for (var i = 0; i < gamePads.length; i++) {
      var gamePad = gamePads[i];
      if (gamePad) {

        if (pads[i] === undefined) {
          pads[i] = createPadHandler(gamePad);
          events.emit('connected', pads[i]);
          events.emit('connected' + i, pads[i]);
        }

        pads[i].update();
      }
    }
  }

  return {
    update: update,
    pads: pads,
    events: events
  };
}

function createPadHandler(pad) {
  var events = new _events2.default();

  var lastButtons = cloneButtons(pad.buttons);

  console.log(lastButtons);
  function update() {

    var buttons = pad.buttons;

    //  compare
    buttons.forEach(function (button, index) {

      var lastButton = lastButtons[index];
      // console.log( button.pressed, lastButton.pressed );
      if (button.pressed !== lastButton.pressed) {
        if (button.pressed) {
          events.emit('buttonPressed', index, button.value);
          events.emit('button' + index + 'Pressed', button.value);
        } else {
          events.emit('buttonReleased', index, button.value);
          events.emit('button' + index + 'Released', button.value);
        }
      }
    });

    lastButtons = cloneButtons(pad.buttons);
  }

  events.update = update;

  return events;
}

function cloneButtons(buttons) {
  var cloned = [];

  buttons.forEach(function (button) {
    cloned.push({
      pressed: button.pressed,
      touched: button.touched,
      value: button.value
    });
  });
  return cloned;
}

},{"events":9}],3:[function(require,module,exports){
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
            controllerModels: [controller1, controller2],
            events: events,
            toggleVR: toggleVR
        };
    };
}

},{"./objloader":4,"./vivecontroller":5,"./vrcontrols":6,"./vreffects":7,"./webvr":8,"events":9}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxpbmRleC5qcyIsIm1vZHVsZXNcXHZycGFkXFxpbmRleC5qcyIsIm1vZHVsZXNcXHZydmlld2VyXFxpbmRleC5qcyIsIm1vZHVsZXNcXHZydmlld2VyXFxvYmpsb2FkZXIuanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcdml2ZWNvbnRyb2xsZXIuanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcdnJjb250cm9scy5qcyIsIm1vZHVsZXNcXHZydmlld2VyXFx2cmVmZmVjdHMuanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcd2VidnIuanMiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7SUFBWSxLOzs7Ozs7QUFFWixJQUFNLFlBQVksd0JBQVUsS0FBVixDQUFsQjs7aUJBRTRDLFVBQVU7QUFDcEQsYUFBVyxLQUR5QztBQUVwRCxhQUFXO0FBRnlDLENBQVYsQzs7SUFBcEMsSyxjQUFBLEs7SUFBTyxNLGNBQUEsTTtJQUFRLE0sY0FBQSxNO0lBQVEsUSxjQUFBLFE7OztBQUsvQixNQUFNLEdBQU4sQ0FBVyxJQUFJLE1BQU0sSUFBVixDQUFnQixJQUFJLE1BQU0sV0FBVixDQUF1QixDQUF2QixFQUEwQixDQUExQixFQUE2QixDQUE3QixDQUFoQixFQUFrRCxJQUFJLE1BQU0sb0JBQVYsRUFBbEQsQ0FBWDs7QUFHQSxJQUFNLFFBQVEsTUFBTSxNQUFOLEVBQWQ7O0FBRUEsT0FBTyxFQUFQLENBQVcsTUFBWCxFQUFtQixVQUFDLEVBQUQsRUFBTTtBQUN2QixRQUFNLE1BQU47QUFDRCxDQUZEOztBQUlBLE1B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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVlJWaWV3ZXIgZnJvbSAnLi92cnZpZXdlcic7XHJcbmltcG9ydCAqIGFzIFZSUGFkIGZyb20gJy4vdnJwYWQnO1xyXG5cclxuY29uc3QgY3JlYXRlQXBwID0gVlJWaWV3ZXIoIFRIUkVFICk7XHJcblxyXG5jb25zdCB7IHNjZW5lLCBjYW1lcmEsIGV2ZW50cywgdG9nZ2xlVlIgfSA9IGNyZWF0ZUFwcCh7XHJcbiAgYXV0b0VudGVyOiBmYWxzZSxcclxuICBlbXB0eVJvb206IHRydWVcclxufSk7XHJcblxyXG5zY2VuZS5hZGQoIG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIDEsIDEsIDEgKSwgbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKCkgKSApO1xyXG5cclxuXHJcbmNvbnN0IHZycGFkID0gVlJQYWQuY3JlYXRlKCk7XHJcblxyXG5ldmVudHMub24oICd0aWNrJywgKGR0KT0+e1xyXG4gIHZycGFkLnVwZGF0ZSgpO1xyXG59KTtcclxuXHJcbnZycGFkLmV2ZW50cy5vbiggJ2Nvbm5lY3RlZDAnLCAoIHBhZCApID0+IHtcclxuICBwYWQub24oJ2J1dHRvbjNQcmVzc2VkJywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApe1xyXG4gICAgdG9nZ2xlVlIoKTtcclxuICB9KTtcclxufSk7XHJcblxyXG5cclxudnJwYWQuZXZlbnRzLm9uKCAnY29ubmVjdGVkMScsICggcGFkICkgPT4ge1xyXG4gIHBhZC5vbignYnV0dG9uM1ByZXNzZWQnLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICl7XHJcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuICB9KTtcclxufSk7XHJcbiIsImltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCl7XHJcblxyXG4gIGNvbnN0IHBhZHMgPSBbXTtcclxuXHJcbiAgY29uc3QgZXZlbnRzID0gbmV3IEVtaXR0ZXIoKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlKCl7XHJcbiAgICBjb25zdCBnYW1lUGFkcyA9IG5hdmlnYXRvci5nZXRHYW1lcGFkcygpO1xyXG4gICAgZm9yKCBsZXQgaT0wOyBpPGdhbWVQYWRzLmxlbmd0aDsgaSsrICl7XHJcbiAgICAgIGNvbnN0IGdhbWVQYWQgPSBnYW1lUGFkc1sgaSBdO1xyXG4gICAgICBpZiggZ2FtZVBhZCApe1xyXG5cclxuICAgICAgICBpZiggcGFkc1sgaSBdID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgICAgIHBhZHNbIGkgXSA9IGNyZWF0ZVBhZEhhbmRsZXIoIGdhbWVQYWQgKTtcclxuICAgICAgICAgIGV2ZW50cy5lbWl0KCAnY29ubmVjdGVkJywgcGFkc1sgaSBdICk7XHJcbiAgICAgICAgICBldmVudHMuZW1pdCggJ2Nvbm5lY3RlZCcraSwgcGFkc1sgaSBdICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwYWRzWyBpIF0udXBkYXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB1cGRhdGUsXHJcbiAgICBwYWRzLFxyXG4gICAgZXZlbnRzXHJcbiAgfTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBhZEhhbmRsZXIoIHBhZCApe1xyXG4gIGNvbnN0IGV2ZW50cyA9IG5ldyBFbWl0dGVyKCk7XHJcblxyXG4gIGxldCBsYXN0QnV0dG9ucyA9IGNsb25lQnV0dG9ucyggcGFkLmJ1dHRvbnMgKTtcclxuXHJcbiAgY29uc29sZS5sb2coIGxhc3RCdXR0b25zICk7XHJcbiAgZnVuY3Rpb24gdXBkYXRlKCl7XHJcblxyXG4gICAgY29uc3QgYnV0dG9ucyA9IHBhZC5idXR0b25zO1xyXG5cclxuICAgIC8vICBjb21wYXJlXHJcbiAgICBidXR0b25zLmZvckVhY2goICggYnV0dG9uLCBpbmRleCApPT57XHJcblxyXG4gICAgICBjb25zdCBsYXN0QnV0dG9uID0gbGFzdEJ1dHRvbnNbIGluZGV4IF07XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCBidXR0b24ucHJlc3NlZCwgbGFzdEJ1dHRvbi5wcmVzc2VkICk7XHJcbiAgICAgIGlmKCBidXR0b24ucHJlc3NlZCAhPT0gbGFzdEJ1dHRvbi5wcmVzc2VkICl7XHJcbiAgICAgICAgaWYoIGJ1dHRvbi5wcmVzc2VkICl7XHJcbiAgICAgICAgICBldmVudHMuZW1pdCggJ2J1dHRvblByZXNzZWQnLCBpbmRleCwgYnV0dG9uLnZhbHVlICk7XHJcbiAgICAgICAgICBldmVudHMuZW1pdCggJ2J1dHRvbicraW5kZXgrJ1ByZXNzZWQnLCBidXR0b24udmFsdWUgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIGV2ZW50cy5lbWl0KCAnYnV0dG9uUmVsZWFzZWQnLCBpbmRleCwgYnV0dG9uLnZhbHVlICk7XHJcbiAgICAgICAgICBldmVudHMuZW1pdCggJ2J1dHRvbicraW5kZXgrJ1JlbGVhc2VkJywgYnV0dG9uLnZhbHVlICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgbGFzdEJ1dHRvbnMgPSBjbG9uZUJ1dHRvbnMoIHBhZC5idXR0b25zICk7XHJcblxyXG4gIH1cclxuXHJcbiAgZXZlbnRzLnVwZGF0ZSA9IHVwZGF0ZTtcclxuXHJcbiAgcmV0dXJuIGV2ZW50cztcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvbmVCdXR0b25zKCBidXR0b25zICl7XHJcbiAgY29uc3QgY2xvbmVkID0gW107XHJcblxyXG4gIGJ1dHRvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGJ1dHRvbiApe1xyXG4gICAgY2xvbmVkLnB1c2goe1xyXG4gICAgICBwcmVzc2VkOiBidXR0b24ucHJlc3NlZCxcclxuICAgICAgdG91Y2hlZDogYnV0dG9uLnRvdWNoZWQsXHJcbiAgICAgIHZhbHVlOiBidXR0b24udmFsdWVcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiBjbG9uZWQ7XHJcbn0iLCJpbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xyXG5cclxuaW1wb3J0ICogYXMgVlJDb250cm9scyBmcm9tICcuL3ZyY29udHJvbHMnO1xyXG5pbXBvcnQgKiBhcyBWUkVmZmVjdHMgZnJvbSAnLi92cmVmZmVjdHMnO1xyXG5pbXBvcnQgKiBhcyBWaXZlQ29udHJvbGxlciBmcm9tICcuL3ZpdmVjb250cm9sbGVyJztcclxuaW1wb3J0ICogYXMgV0VCVlIgZnJvbSAnLi93ZWJ2cic7XHJcbmltcG9ydCAqIGFzIE9iakxvYWRlciBmcm9tICcuL29iamxvYWRlcic7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlKCBUSFJFRSApe1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24oIHtcclxuXHJcbiAgICBlbXB0eVJvb20gPSB0cnVlLFxyXG4gICAgc3RhbmRpbmcgPSB0cnVlLFxyXG4gICAgbG9hZENvbnRyb2xsZXJzID0gdHJ1ZSxcclxuICAgIHZyQnV0dG9uID0gdHJ1ZSxcclxuICAgIGF1dG9FbnRlciA9IGZhbHNlLFxyXG4gICAgcGF0aFRvQ29udHJvbGxlcnMgPSAnbW9kZWxzL29iai92aXZlLWNvbnRyb2xsZXIvJyxcclxuICAgIGNvbnRyb2xsZXJNb2RlbE5hbWUgPSAndnJfY29udHJvbGxlcl92aXZlXzFfNS5vYmonLFxyXG4gICAgY29udHJvbGxlclRleHR1cmVNYXAgPSAnb25lcG9pbnRmaXZlX3RleHR1cmUucG5nJyxcclxuICAgIGNvbnRyb2xsZXJTcGVjTWFwID0gJ29uZXBvaW50Zml2ZV9zcGVjLnBuZydcclxuXHJcbiAgfSA9IHt9ICl7XHJcblxyXG4gICAgaWYgKCBXRUJWUi5pc0xhdGVzdEF2YWlsYWJsZSgpID09PSBmYWxzZSApIHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggV0VCVlIuZ2V0TWVzc2FnZSgpICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZXZlbnRzID0gbmV3IEVtaXR0ZXIoKTtcclxuXHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggY29udGFpbmVyICk7XHJcblxyXG5cclxuICAgIGNvbnN0IHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcblxyXG4gICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA3MCwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAgKTtcclxuICAgIHNjZW5lLmFkZCggY2FtZXJhICk7XHJcblxyXG4gICAgaWYoIGVtcHR5Um9vbSApe1xyXG4gICAgICBjb25zdCByb29tID0gbmV3IFRIUkVFLk1lc2goXHJcbiAgICAgICAgbmV3IFRIUkVFLkJveEdlb21ldHJ5KCA2LCA2LCA2LCA4LCA4LCA4ICksXHJcbiAgICAgICAgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweDQwNDA0MCwgd2lyZWZyYW1lOiB0cnVlIH0gKVxyXG4gICAgICApO1xyXG4gICAgICByb29tLnBvc2l0aW9uLnkgPSAzO1xyXG4gICAgICBzY2VuZS5hZGQoIHJvb20gKTtcclxuXHJcbiAgICAgIHNjZW5lLmFkZCggbmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCggMHg2MDYwNjAsIDB4NDA0MDQwICkgKTtcclxuXHJcbiAgICAgIGxldCBsaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KCAweGZmZmZmZiApO1xyXG4gICAgICBsaWdodC5wb3NpdGlvbi5zZXQoIDEsIDEsIDEgKS5ub3JtYWxpemUoKTtcclxuICAgICAgc2NlbmUuYWRkKCBsaWdodCApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoIHsgYW50aWFsaWFzOiBmYWxzZSB9ICk7XHJcbiAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKCAweDUwNTA1MCApO1xyXG4gICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyggd2luZG93LmRldmljZVBpeGVsUmF0aW8gKTtcclxuICAgIHJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcclxuICAgIHJlbmRlcmVyLnNvcnRPYmplY3RzID0gZmFsc2U7XHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoIHJlbmRlcmVyLmRvbUVsZW1lbnQgKTtcclxuXHJcbiAgICBjb25zdCBjb250cm9scyA9IG5ldyBUSFJFRS5WUkNvbnRyb2xzKCBjYW1lcmEgKTtcclxuICAgIGNvbnRyb2xzLnN0YW5kaW5nID0gc3RhbmRpbmc7XHJcblxyXG5cclxuICAgIGNvbnN0IGNvbnRyb2xsZXIxID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICBjb25zdCBjb250cm9sbGVyMiA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgc2NlbmUuYWRkKCBjb250cm9sbGVyMSwgY29udHJvbGxlcjIgKTtcclxuXHJcbiAgICBsZXQgYzEsIGMyO1xyXG5cclxuICAgIGlmKCBsb2FkQ29udHJvbGxlcnMgKXtcclxuICAgICAgYzEgPSBuZXcgVEhSRUUuVml2ZUNvbnRyb2xsZXIoIDAgKTtcclxuICAgICAgYzEuc3RhbmRpbmdNYXRyaXggPSBjb250cm9scy5nZXRTdGFuZGluZ01hdHJpeCgpO1xyXG4gICAgICBjb250cm9sbGVyMS5hZGQoIGMxICk7XHJcblxyXG4gICAgICBjMiA9IG5ldyBUSFJFRS5WaXZlQ29udHJvbGxlciggMSApO1xyXG4gICAgICBjMi5zdGFuZGluZ01hdHJpeCA9IGNvbnRyb2xzLmdldFN0YW5kaW5nTWF0cml4KCk7XHJcbiAgICAgIGNvbnRyb2xsZXIyLmFkZCggYzIgKTtcclxuXHJcbiAgICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuT0JKTG9hZGVyKCk7XHJcbiAgICAgIGxvYWRlci5zZXRQYXRoKCBwYXRoVG9Db250cm9sbGVycyApO1xyXG4gICAgICBsb2FkZXIubG9hZCggY29udHJvbGxlck1vZGVsTmFtZSwgZnVuY3Rpb24gKCBvYmplY3QgKSB7XHJcblxyXG4gICAgICAgIHZhciB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcclxuICAgICAgICB0ZXh0dXJlTG9hZGVyLnNldFBhdGgoIHBhdGhUb0NvbnRyb2xsZXJzICk7XHJcblxyXG4gICAgICAgIHZhciBjb250cm9sbGVyID0gb2JqZWN0LmNoaWxkcmVuWyAwIF07XHJcbiAgICAgICAgY29udHJvbGxlci5tYXRlcmlhbC5tYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoIGNvbnRyb2xsZXJUZXh0dXJlTWFwICk7XHJcbiAgICAgICAgY29udHJvbGxlci5tYXRlcmlhbC5zcGVjdWxhck1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCggY29udHJvbGxlclNwZWNNYXAgKTtcclxuXHJcbiAgICAgICAgYzEuYWRkKCBvYmplY3QuY2xvbmUoKSApO1xyXG4gICAgICAgIGMyLmFkZCggb2JqZWN0LmNsb25lKCkgKTtcclxuXHJcbiAgICAgIH0gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlZmZlY3QgPSBuZXcgVEhSRUUuVlJFZmZlY3QoIHJlbmRlcmVyICk7XHJcblxyXG4gICAgaWYgKCBXRUJWUi5pc0F2YWlsYWJsZSgpID09PSB0cnVlICkge1xyXG4gICAgICBpZiggdnJCdXR0b24gKXtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBXRUJWUi5nZXRCdXR0b24oIGVmZmVjdCApICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKCBhdXRvRW50ZXIgKXtcclxuICAgICAgICBzZXRUaW1lb3V0KCAoKT0+ZWZmZWN0LnJlcXVlc3RQcmVzZW50KCksIDEwMDAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgZnVuY3Rpb24oKXtcclxuICAgICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gICAgICBlZmZlY3Quc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xyXG5cclxuICAgICAgZXZlbnRzLmVtaXQoICdyZXNpemUnLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XHJcbiAgICB9LCBmYWxzZSApO1xyXG5cclxuXHJcbiAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xyXG4gICAgY2xvY2suc3RhcnQoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gICAgICBjb25zdCBkdCA9IGNsb2NrLmdldERlbHRhKCk7XHJcblxyXG4gICAgICBlZmZlY3QucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBhbmltYXRlICk7XHJcblxyXG4gICAgICBjb250cm9scy51cGRhdGUoKTtcclxuXHJcbiAgICAgIGV2ZW50cy5lbWl0KCAndGljaycsICBkdCApO1xyXG5cclxuICAgICAgcmVuZGVyKCk7XHJcblxyXG4gICAgICBldmVudHMuZW1pdCggJ3JlbmRlcicsIGR0IClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICAgIGVmZmVjdC5yZW5kZXIoIHNjZW5lLCBjYW1lcmEgKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b2dnbGVWUigpe1xyXG4gICAgICBlZmZlY3QuaXNQcmVzZW50aW5nID8gZWZmZWN0LmV4aXRQcmVzZW50KCkgOiBlZmZlY3QucmVxdWVzdFByZXNlbnQoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYW5pbWF0ZSgpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNjZW5lLCBjYW1lcmEsIGNvbnRyb2xzLCByZW5kZXJlcixcclxuICAgICAgY29udHJvbGxlck1vZGVsczogWyBjb250cm9sbGVyMSwgY29udHJvbGxlcjIgXSxcclxuICAgICAgZXZlbnRzLFxyXG4gICAgICB0b2dnbGVWUlxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb20vXHJcbiAqL1xyXG5cclxuVEhSRUUuT0JKTG9hZGVyID0gZnVuY3Rpb24gKCBtYW5hZ2VyICkge1xyXG5cclxuICB0aGlzLm1hbmFnZXIgPSAoIG1hbmFnZXIgIT09IHVuZGVmaW5lZCApID8gbWFuYWdlciA6IFRIUkVFLkRlZmF1bHRMb2FkaW5nTWFuYWdlcjtcclxuXHJcbiAgdGhpcy5tYXRlcmlhbHMgPSBudWxsO1xyXG5cclxuICB0aGlzLnJlZ2V4cCA9IHtcclxuICAgIC8vIHYgZmxvYXQgZmxvYXQgZmxvYXRcclxuICAgIHZlcnRleF9wYXR0ZXJuICAgICAgICAgICA6IC9edlxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKylcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKS8sXHJcbiAgICAvLyB2biBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgbm9ybWFsX3BhdHRlcm4gICAgICAgICAgIDogL152blxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKylcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKS8sXHJcbiAgICAvLyB2dCBmbG9hdCBmbG9hdFxyXG4gICAgdXZfcGF0dGVybiAgICAgICAgICAgICAgIDogL152dFxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKylcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspLyxcclxuICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgIGZhY2VfdmVydGV4ICAgICAgICAgICAgICA6IC9eZlxccysoLT9cXGQrKVxccysoLT9cXGQrKVxccysoLT9cXGQrKSg/OlxccysoLT9cXGQrKSk/LyxcclxuICAgIC8vIGYgdmVydGV4L3V2IHZlcnRleC91diB2ZXJ0ZXgvdXZcclxuICAgIGZhY2VfdmVydGV4X3V2ICAgICAgICAgICA6IC9eZlxccysoLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKSg/OlxccysoLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgLy8gZiB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbFxyXG4gICAgZmFjZV92ZXJ0ZXhfdXZfbm9ybWFsICAgIDogL15mXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKD86XFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKSk/LyxcclxuICAgIC8vIGYgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWxcclxuICAgIGZhY2VfdmVydGV4X25vcm1hbCAgICAgICA6IC9eZlxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKSg/OlxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspKT8vLFxyXG4gICAgLy8gbyBvYmplY3RfbmFtZSB8IGcgZ3JvdXBfbmFtZVxyXG4gICAgb2JqZWN0X3BhdHRlcm4gICAgICAgICAgIDogL15bb2ddXFxzKiguKyk/LyxcclxuICAgIC8vIHMgYm9vbGVhblxyXG4gICAgc21vb3RoaW5nX3BhdHRlcm4gICAgICAgIDogL15zXFxzKyhcXGQrfG9ufG9mZikvLFxyXG4gICAgLy8gbXRsbGliIGZpbGVfcmVmZXJlbmNlXHJcbiAgICBtYXRlcmlhbF9saWJyYXJ5X3BhdHRlcm4gOiAvXm10bGxpYiAvLFxyXG4gICAgLy8gdXNlbXRsIG1hdGVyaWFsX25hbWVcclxuICAgIG1hdGVyaWFsX3VzZV9wYXR0ZXJuICAgICA6IC9edXNlbXRsIC9cclxuICB9O1xyXG5cclxufTtcclxuXHJcblRIUkVFLk9CSkxvYWRlci5wcm90b3R5cGUgPSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yOiBUSFJFRS5PQkpMb2FkZXIsXHJcblxyXG4gIGxvYWQ6IGZ1bmN0aW9uICggdXJsLCBvbkxvYWQsIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKSB7XHJcblxyXG4gICAgdmFyIHNjb3BlID0gdGhpcztcclxuXHJcbiAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLlhIUkxvYWRlciggc2NvcGUubWFuYWdlciApO1xyXG4gICAgbG9hZGVyLnNldFBhdGgoIHRoaXMucGF0aCApO1xyXG4gICAgbG9hZGVyLmxvYWQoIHVybCwgZnVuY3Rpb24gKCB0ZXh0ICkge1xyXG5cclxuICAgICAgb25Mb2FkKCBzY29wZS5wYXJzZSggdGV4dCApICk7XHJcblxyXG4gICAgfSwgb25Qcm9ncmVzcywgb25FcnJvciApO1xyXG5cclxuICB9LFxyXG5cclxuICBzZXRQYXRoOiBmdW5jdGlvbiAoIHZhbHVlICkge1xyXG5cclxuICAgIHRoaXMucGF0aCA9IHZhbHVlO1xyXG5cclxuICB9LFxyXG5cclxuICBzZXRNYXRlcmlhbHM6IGZ1bmN0aW9uICggbWF0ZXJpYWxzICkge1xyXG5cclxuICAgIHRoaXMubWF0ZXJpYWxzID0gbWF0ZXJpYWxzO1xyXG5cclxuICB9LFxyXG5cclxuICBfY3JlYXRlUGFyc2VyU3RhdGUgOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgdmFyIHN0YXRlID0ge1xyXG4gICAgICBvYmplY3RzICA6IFtdLFxyXG4gICAgICBvYmplY3QgICA6IHt9LFxyXG5cclxuICAgICAgdmVydGljZXMgOiBbXSxcclxuICAgICAgbm9ybWFscyAgOiBbXSxcclxuICAgICAgdXZzICAgICAgOiBbXSxcclxuXHJcbiAgICAgIG1hdGVyaWFsTGlicmFyaWVzIDogW10sXHJcblxyXG4gICAgICBzdGFydE9iamVjdDogZnVuY3Rpb24gKCBuYW1lLCBmcm9tRGVjbGFyYXRpb24gKSB7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSBjdXJyZW50IG9iamVjdCAoaW5pdGlhbCBmcm9tIHJlc2V0KSBpcyBub3QgZnJvbSBhIGcvbyBkZWNsYXJhdGlvbiBpbiB0aGUgcGFyc2VkXHJcbiAgICAgICAgLy8gZmlsZS4gV2UgbmVlZCB0byB1c2UgaXQgZm9yIHRoZSBmaXJzdCBwYXJzZWQgZy9vIHRvIGtlZXAgdGhpbmdzIGluIHN5bmMuXHJcbiAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPT09IGZhbHNlICkge1xyXG5cclxuICAgICAgICAgIHRoaXMub2JqZWN0Lm5hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgdGhpcy5vYmplY3QuZnJvbURlY2xhcmF0aW9uID0gKCBmcm9tRGVjbGFyYXRpb24gIT09IGZhbHNlICk7XHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuX2ZpbmFsaXplID09PSAnZnVuY3Rpb24nICkge1xyXG5cclxuICAgICAgICAgIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwcmV2aW91c01hdGVyaWFsID0gKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuY3VycmVudE1hdGVyaWFsID09PSAnZnVuY3Rpb24nID8gdGhpcy5vYmplY3QuY3VycmVudE1hdGVyaWFsKCkgOiB1bmRlZmluZWQgKTtcclxuXHJcbiAgICAgICAgdGhpcy5vYmplY3QgPSB7XHJcbiAgICAgICAgICBuYW1lIDogbmFtZSB8fCAnJyxcclxuICAgICAgICAgIGZyb21EZWNsYXJhdGlvbiA6ICggZnJvbURlY2xhcmF0aW9uICE9PSBmYWxzZSApLFxyXG5cclxuICAgICAgICAgIGdlb21ldHJ5IDoge1xyXG4gICAgICAgICAgICB2ZXJ0aWNlcyA6IFtdLFxyXG4gICAgICAgICAgICBub3JtYWxzICA6IFtdLFxyXG4gICAgICAgICAgICB1dnMgICAgICA6IFtdXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbWF0ZXJpYWxzIDogW10sXHJcbiAgICAgICAgICBzbW9vdGggOiB0cnVlLFxyXG5cclxuICAgICAgICAgIHN0YXJ0TWF0ZXJpYWwgOiBmdW5jdGlvbiggbmFtZSwgbGlicmFyaWVzICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzID0gdGhpcy5fZmluYWxpemUoIGZhbHNlICk7XHJcblxyXG4gICAgICAgICAgICAvLyBOZXcgdXNlbXRsIGRlY2xhcmF0aW9uIG92ZXJ3cml0ZXMgYW4gaW5oZXJpdGVkIG1hdGVyaWFsLCBleGNlcHQgaWYgZmFjZXMgd2VyZSBkZWNsYXJlZFxyXG4gICAgICAgICAgICAvLyBhZnRlciB0aGUgbWF0ZXJpYWwsIHRoZW4gaXQgbXVzdCBiZSBwcmVzZXJ2ZWQgZm9yIHByb3BlciBNdWx0aU1hdGVyaWFsIGNvbnRpbnVhdGlvbi5cclxuICAgICAgICAgICAgaWYgKCBwcmV2aW91cyAmJiAoIHByZXZpb3VzLmluaGVyaXRlZCB8fCBwcmV2aW91cy5ncm91cENvdW50IDw9IDAgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMuc3BsaWNlKCBwcmV2aW91cy5pbmRleCwgMSApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsID0ge1xyXG4gICAgICAgICAgICAgIGluZGV4ICAgICAgOiB0aGlzLm1hdGVyaWFscy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgbmFtZSAgICAgICA6IG5hbWUgfHwgJycsXHJcbiAgICAgICAgICAgICAgbXRsbGliICAgICA6ICggQXJyYXkuaXNBcnJheSggbGlicmFyaWVzICkgJiYgbGlicmFyaWVzLmxlbmd0aCA+IDAgPyBsaWJyYXJpZXNbIGxpYnJhcmllcy5sZW5ndGggLSAxIF0gOiAnJyApLFxyXG4gICAgICAgICAgICAgIHNtb290aCAgICAgOiAoIHByZXZpb3VzICE9PSB1bmRlZmluZWQgPyBwcmV2aW91cy5zbW9vdGggOiB0aGlzLnNtb290aCApLFxyXG4gICAgICAgICAgICAgIGdyb3VwU3RhcnQgOiAoIHByZXZpb3VzICE9PSB1bmRlZmluZWQgPyBwcmV2aW91cy5ncm91cEVuZCA6IDAgKSxcclxuICAgICAgICAgICAgICBncm91cEVuZCAgIDogLTEsXHJcbiAgICAgICAgICAgICAgZ3JvdXBDb3VudCA6IC0xLFxyXG4gICAgICAgICAgICAgIGluaGVyaXRlZCAgOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgICAgY2xvbmUgOiBmdW5jdGlvbiggaW5kZXggKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICBpbmRleCAgICAgIDogKCB0eXBlb2YgaW5kZXggPT09ICdudW1iZXInID8gaW5kZXggOiB0aGlzLmluZGV4ICksXHJcbiAgICAgICAgICAgICAgICAgIG5hbWUgICAgICAgOiB0aGlzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgIG10bGxpYiAgICAgOiB0aGlzLm10bGxpYixcclxuICAgICAgICAgICAgICAgICAgc21vb3RoICAgICA6IHRoaXMuc21vb3RoLFxyXG4gICAgICAgICAgICAgICAgICBncm91cFN0YXJ0IDogdGhpcy5ncm91cEVuZCxcclxuICAgICAgICAgICAgICAgICAgZ3JvdXBFbmQgICA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICBncm91cENvdW50IDogLTEsXHJcbiAgICAgICAgICAgICAgICAgIGluaGVyaXRlZCAgOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5wdXNoKCBtYXRlcmlhbCApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgY3VycmVudE1hdGVyaWFsIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0ZXJpYWxzWyB0aGlzLm1hdGVyaWFscy5sZW5ndGggLSAxIF07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICBfZmluYWxpemUgOiBmdW5jdGlvbiggZW5kICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGxhc3RNdWx0aU1hdGVyaWFsID0gdGhpcy5jdXJyZW50TWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgaWYgKCBsYXN0TXVsdGlNYXRlcmlhbCAmJiBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cEVuZCA9PT0gLTEgKSB7XHJcblxyXG4gICAgICAgICAgICAgIGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwRW5kID0gdGhpcy5nZW9tZXRyeS52ZXJ0aWNlcy5sZW5ndGggLyAzO1xyXG4gICAgICAgICAgICAgIGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwQ291bnQgPSBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cEVuZCAtIGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwU3RhcnQ7XHJcbiAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuaW5oZXJpdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBHdWFyYW50ZWUgYXQgbGVhc3Qgb25lIGVtcHR5IG1hdGVyaWFsLCB0aGlzIG1ha2VzIHRoZSBjcmVhdGlvbiBsYXRlciBtb3JlIHN0cmFpZ2h0IGZvcndhcmQuXHJcbiAgICAgICAgICAgIGlmICggZW5kICE9PSBmYWxzZSAmJiB0aGlzLm1hdGVyaWFscy5sZW5ndGggPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBuYW1lICAgOiAnJyxcclxuICAgICAgICAgICAgICAgIHNtb290aCA6IHRoaXMuc21vb3RoXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBsYXN0TXVsdGlNYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gSW5oZXJpdCBwcmV2aW91cyBvYmplY3RzIG1hdGVyaWFsLlxyXG4gICAgICAgIC8vIFNwZWMgdGVsbHMgdXMgdGhhdCBhIGRlY2xhcmVkIG1hdGVyaWFsIG11c3QgYmUgc2V0IHRvIGFsbCBvYmplY3RzIHVudGlsIGEgbmV3IG1hdGVyaWFsIGlzIGRlY2xhcmVkLlxyXG4gICAgICAgIC8vIElmIGEgdXNlbXRsIGRlY2xhcmF0aW9uIGlzIGVuY291bnRlcmVkIHdoaWxlIHRoaXMgbmV3IG9iamVjdCBpcyBiZWluZyBwYXJzZWQsIGl0IHdpbGxcclxuICAgICAgICAvLyBvdmVyd3JpdGUgdGhlIGluaGVyaXRlZCBtYXRlcmlhbC4gRXhjZXB0aW9uIGJlaW5nIHRoYXQgdGhlcmUgd2FzIGFscmVhZHkgZmFjZSBkZWNsYXJhdGlvbnNcclxuICAgICAgICAvLyB0byB0aGUgaW5oZXJpdGVkIG1hdGVyaWFsLCB0aGVuIGl0IHdpbGwgYmUgcHJlc2VydmVkIGZvciBwcm9wZXIgTXVsdGlNYXRlcmlhbCBjb250aW51YXRpb24uXHJcblxyXG4gICAgICAgIGlmICggcHJldmlvdXNNYXRlcmlhbCAmJiBwcmV2aW91c01hdGVyaWFsLm5hbWUgJiYgdHlwZW9mIHByZXZpb3VzTWF0ZXJpYWwuY2xvbmUgPT09IFwiZnVuY3Rpb25cIiApIHtcclxuXHJcbiAgICAgICAgICB2YXIgZGVjbGFyZWQgPSBwcmV2aW91c01hdGVyaWFsLmNsb25lKCAwICk7XHJcbiAgICAgICAgICBkZWNsYXJlZC5pbmhlcml0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5vYmplY3QubWF0ZXJpYWxzLnB1c2goIGRlY2xhcmVkICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vYmplY3RzLnB1c2goIHRoaXMub2JqZWN0ICk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmluYWxpemUgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgaWYgKCB0aGlzLm9iamVjdCAmJiB0eXBlb2YgdGhpcy5vYmplY3QuX2ZpbmFsaXplID09PSAnZnVuY3Rpb24nICkge1xyXG5cclxuICAgICAgICAgIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFyc2VWZXJ0ZXhJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcbiAgICAgICAgcmV0dXJuICggaW5kZXggPj0gMCA/IGluZGV4IC0gMSA6IGluZGV4ICsgbGVuIC8gMyApICogMztcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwYXJzZU5vcm1hbEluZGV4OiBmdW5jdGlvbiAoIHZhbHVlLCBsZW4gKSB7XHJcblxyXG4gICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICByZXR1cm4gKCBpbmRleCA+PSAwID8gaW5kZXggLSAxIDogaW5kZXggKyBsZW4gLyAzICkgKiAzO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHBhcnNlVVZJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcbiAgICAgICAgcmV0dXJuICggaW5kZXggPj0gMCA/IGluZGV4IC0gMSA6IGluZGV4ICsgbGVuIC8gMiApICogMjtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGRWZXJ0ZXg6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgdmFyIHNyYyA9IHRoaXMudmVydGljZXM7XHJcbiAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnZlcnRpY2VzO1xyXG5cclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDEgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAyIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAyIF0gKTtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGRWZXJ0ZXhMaW5lOiBmdW5jdGlvbiAoIGEgKSB7XHJcblxyXG4gICAgICAgIHZhciBzcmMgPSB0aGlzLnZlcnRpY2VzO1xyXG4gICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS52ZXJ0aWNlcztcclxuXHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkTm9ybWFsIDogZnVuY3Rpb24gKCBhLCBiLCBjICkge1xyXG5cclxuICAgICAgICB2YXIgc3JjID0gdGhpcy5ub3JtYWxzO1xyXG4gICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS5ub3JtYWxzO1xyXG5cclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDEgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAyIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAyIF0gKTtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGRVVjogZnVuY3Rpb24gKCBhLCBiLCBjICkge1xyXG5cclxuICAgICAgICB2YXIgc3JjID0gdGhpcy51dnM7XHJcbiAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnV2cztcclxuXHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDEgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkVVZMaW5lOiBmdW5jdGlvbiAoIGEgKSB7XHJcblxyXG4gICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudXZzO1xyXG5cclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZEZhY2U6IGZ1bmN0aW9uICggYSwgYiwgYywgZCwgdWEsIHViLCB1YywgdWQsIG5hLCBuYiwgbmMsIG5kICkge1xyXG5cclxuICAgICAgICB2YXIgdkxlbiA9IHRoaXMudmVydGljZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgaWEgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGEsIHZMZW4gKTtcclxuICAgICAgICB2YXIgaWIgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGIsIHZMZW4gKTtcclxuICAgICAgICB2YXIgaWMgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGMsIHZMZW4gKTtcclxuICAgICAgICB2YXIgaWQ7XHJcblxyXG4gICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYSwgaWIsIGljICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgaWQgPSB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIGQsIHZMZW4gKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGliLCBpYywgaWQgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIHVhICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgdmFyIHV2TGVuID0gdGhpcy51dnMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgIGlhID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVhLCB1dkxlbiApO1xyXG4gICAgICAgICAgaWIgPSB0aGlzLnBhcnNlVVZJbmRleCggdWIsIHV2TGVuICk7XHJcbiAgICAgICAgICBpYyA9IHRoaXMucGFyc2VVVkluZGV4KCB1YywgdXZMZW4gKTtcclxuXHJcbiAgICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkVVYoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgaWQgPSB0aGlzLnBhcnNlVVZJbmRleCggdWQsIHV2TGVuICk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZFVWKCBpYSwgaWIsIGlkICk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVVYoIGliLCBpYywgaWQgKTtcclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBuYSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgIC8vIE5vcm1hbHMgYXJlIG1hbnkgdGltZXMgdGhlIHNhbWUuIElmIHNvLCBza2lwIGZ1bmN0aW9uIGNhbGwgYW5kIHBhcnNlSW50LlxyXG4gICAgICAgICAgdmFyIG5MZW4gPSB0aGlzLm5vcm1hbHMubGVuZ3RoO1xyXG4gICAgICAgICAgaWEgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5hLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgaWIgPSBuYSA9PT0gbmIgPyBpYSA6IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmIsIG5MZW4gKTtcclxuICAgICAgICAgIGljID0gbmEgPT09IG5jID8gaWEgOiB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5jLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBpZCA9IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmQsIG5MZW4gKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkTm9ybWFsKCBpYSwgaWIsIGlkICk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTm9ybWFsKCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkTGluZUdlb21ldHJ5OiBmdW5jdGlvbiAoIHZlcnRpY2VzLCB1dnMgKSB7XHJcblxyXG4gICAgICAgIHRoaXMub2JqZWN0Lmdlb21ldHJ5LnR5cGUgPSAnTGluZSc7XHJcblxyXG4gICAgICAgIHZhciB2TGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIHV2TGVuID0gdGhpcy51dnMubGVuZ3RoO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgdmkgPSAwLCBsID0gdmVydGljZXMubGVuZ3RoOyB2aSA8IGw7IHZpICsrICkge1xyXG5cclxuICAgICAgICAgIHRoaXMuYWRkVmVydGV4TGluZSggdGhpcy5wYXJzZVZlcnRleEluZGV4KCB2ZXJ0aWNlc1sgdmkgXSwgdkxlbiApICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICggdmFyIHV2aSA9IDAsIGwgPSB1dnMubGVuZ3RoOyB1dmkgPCBsOyB1dmkgKysgKSB7XHJcblxyXG4gICAgICAgICAgdGhpcy5hZGRVVkxpbmUoIHRoaXMucGFyc2VVVkluZGV4KCB1dnNbIHV2aSBdLCB1dkxlbiApICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRlLnN0YXJ0T2JqZWN0KCAnJywgZmFsc2UgKTtcclxuXHJcbiAgICByZXR1cm4gc3RhdGU7XHJcblxyXG4gIH0sXHJcblxyXG4gIHBhcnNlOiBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgY29uc29sZS50aW1lKCAnT0JKTG9hZGVyJyApO1xyXG5cclxuICAgIHZhciBzdGF0ZSA9IHRoaXMuX2NyZWF0ZVBhcnNlclN0YXRlKCk7XHJcblxyXG4gICAgaWYgKCB0ZXh0LmluZGV4T2YoICdcXHJcXG4nICkgIT09IC0gMSApIHtcclxuXHJcbiAgICAgIC8vIFRoaXMgaXMgZmFzdGVyIHRoYW4gU3RyaW5nLnNwbGl0IHdpdGggcmVnZXggdGhhdCBzcGxpdHMgb24gYm90aFxyXG4gICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKCAnXFxyXFxuJywgJ1xcbicgKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxpbmVzID0gdGV4dC5zcGxpdCggJ1xcbicgKTtcclxuICAgIHZhciBsaW5lID0gJycsIGxpbmVGaXJzdENoYXIgPSAnJywgbGluZVNlY29uZENoYXIgPSAnJztcclxuICAgIHZhciBsaW5lTGVuZ3RoID0gMDtcclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAvLyBGYXN0ZXIgdG8ganVzdCB0cmltIGxlZnQgc2lkZSBvZiB0aGUgbGluZS4gVXNlIGlmIGF2YWlsYWJsZS5cclxuICAgIHZhciB0cmltTGVmdCA9ICggdHlwZW9mICcnLnRyaW1MZWZ0ID09PSAnZnVuY3Rpb24nICk7XHJcblxyXG4gICAgZm9yICggdmFyIGkgPSAwLCBsID0gbGluZXMubGVuZ3RoOyBpIDwgbDsgaSArKyApIHtcclxuXHJcbiAgICAgIGxpbmUgPSBsaW5lc1sgaSBdO1xyXG5cclxuICAgICAgbGluZSA9IHRyaW1MZWZ0ID8gbGluZS50cmltTGVmdCgpIDogbGluZS50cmltKCk7XHJcblxyXG4gICAgICBsaW5lTGVuZ3RoID0gbGluZS5sZW5ndGg7XHJcblxyXG4gICAgICBpZiAoIGxpbmVMZW5ndGggPT09IDAgKSBjb250aW51ZTtcclxuXHJcbiAgICAgIGxpbmVGaXJzdENoYXIgPSBsaW5lLmNoYXJBdCggMCApO1xyXG5cclxuICAgICAgLy8gQHRvZG8gaW52b2tlIHBhc3NlZCBpbiBoYW5kbGVyIGlmIGFueVxyXG4gICAgICBpZiAoIGxpbmVGaXJzdENoYXIgPT09ICcjJyApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgaWYgKCBsaW5lRmlyc3RDaGFyID09PSAndicgKSB7XHJcblxyXG4gICAgICAgIGxpbmVTZWNvbmRDaGFyID0gbGluZS5jaGFyQXQoIDEgKTtcclxuXHJcbiAgICAgICAgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJyAnICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAudmVydGV4X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgIDEgICAgICAyICAgICAgM1xyXG4gICAgICAgICAgLy8gW1widiAxLjAgMi4wIDMuMFwiLCBcIjEuMFwiLCBcIjIuMFwiLCBcIjMuMFwiXVxyXG5cclxuICAgICAgICAgIHN0YXRlLnZlcnRpY2VzLnB1c2goXHJcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMSBdICksXHJcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMiBdICksXHJcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMyBdIClcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoIGxpbmVTZWNvbmRDaGFyID09PSAnbicgJiYgKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5ub3JtYWxfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgIDEgICAgICAyICAgICAgM1xyXG4gICAgICAgICAgLy8gW1widm4gMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuXHJcbiAgICAgICAgICBzdGF0ZS5ub3JtYWxzLnB1c2goXHJcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMSBdICksXHJcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMiBdICksXHJcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMyBdIClcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoIGxpbmVTZWNvbmRDaGFyID09PSAndCcgJiYgKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC51dl9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAxICAgICAgMlxyXG4gICAgICAgICAgLy8gW1widnQgMC4xIDAuMlwiLCBcIjAuMVwiLCBcIjAuMlwiXVxyXG5cclxuICAgICAgICAgIHN0YXRlLnV2cy5wdXNoKFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIHZlcnRleC9ub3JtYWwvdXYgbGluZTogJ1wiICsgbGluZSAgKyBcIidcIiApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCBsaW5lRmlyc3RDaGFyID09PSBcImZcIiApIHtcclxuXHJcbiAgICAgICAgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLmZhY2VfdmVydGV4X3V2X25vcm1hbC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyBmIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsXHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICAgNyAgICA4ICAgIDkgICAxMCAgICAgICAgIDExICAgICAgICAgMTJcclxuICAgICAgICAgIC8vIFtcImYgMS8xLzEgMi8yLzIgMy8zLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjJcIiwgXCIzXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICBzdGF0ZS5hZGRGYWNlKFxyXG4gICAgICAgICAgICByZXN1bHRbIDEgXSwgcmVzdWx0WyA0IF0sIHJlc3VsdFsgNyBdLCByZXN1bHRbIDEwIF0sXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMiBdLCByZXN1bHRbIDUgXSwgcmVzdWx0WyA4IF0sIHJlc3VsdFsgMTEgXSxcclxuICAgICAgICAgICAgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNiBdLCByZXN1bHRbIDkgXSwgcmVzdWx0WyAxMiBdXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLmZhY2VfdmVydGV4X3V2LmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIC8vIGYgdmVydGV4L3V2IHZlcnRleC91diB2ZXJ0ZXgvdXZcclxuICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAxICAgIDIgICAgMyAgICA0ICAgIDUgICAgNiAgIDcgICAgICAgICAgOFxyXG4gICAgICAgICAgLy8gW1wiZiAxLzEgMi8yIDMvM1wiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICBzdGF0ZS5hZGRGYWNlKFxyXG4gICAgICAgICAgICByZXN1bHRbIDEgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDcgXSxcclxuICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfbm9ybWFsLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIC8vIGYgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWxcclxuICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAgICAxICAgIDIgICAgMyAgICA0ICAgIDUgICAgNiAgIDcgICAgICAgICAgOFxyXG4gICAgICAgICAgLy8gW1wiZiAxLy8xIDIvLzIgMy8vM1wiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICBzdGF0ZS5hZGRGYWNlKFxyXG4gICAgICAgICAgICByZXN1bHRbIDEgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDcgXSxcclxuICAgICAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA0IF0sIHJlc3VsdFsgNiBdLCByZXN1bHRbIDggXVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyBmIHZlcnRleCB2ZXJ0ZXggdmVydGV4XHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgMSAgICAyICAgIDMgICA0XHJcbiAgICAgICAgICAvLyBbXCJmIDEgMiAzXCIsIFwiMVwiLCBcIjJcIiwgXCIzXCIsIHVuZGVmaW5lZF1cclxuXHJcbiAgICAgICAgICBzdGF0ZS5hZGRGYWNlKFxyXG4gICAgICAgICAgICByZXN1bHRbIDEgXSwgcmVzdWx0WyAyIF0sIHJlc3VsdFsgMyBdLCByZXN1bHRbIDQgXVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBmYWNlIGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIGlmICggbGluZUZpcnN0Q2hhciA9PT0gXCJsXCIgKSB7XHJcblxyXG4gICAgICAgIHZhciBsaW5lUGFydHMgPSBsaW5lLnN1YnN0cmluZyggMSApLnRyaW0oKS5zcGxpdCggXCIgXCIgKTtcclxuICAgICAgICB2YXIgbGluZVZlcnRpY2VzID0gW10sIGxpbmVVVnMgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKCBsaW5lLmluZGV4T2YoIFwiL1wiICkgPT09IC0gMSApIHtcclxuXHJcbiAgICAgICAgICBsaW5lVmVydGljZXMgPSBsaW5lUGFydHM7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgZm9yICggdmFyIGxpID0gMCwgbGxlbiA9IGxpbmVQYXJ0cy5sZW5ndGg7IGxpIDwgbGxlbjsgbGkgKysgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFydHMgPSBsaW5lUGFydHNbIGxpIF0uc3BsaXQoIFwiL1wiICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHBhcnRzWyAwIF0gIT09IFwiXCIgKSBsaW5lVmVydGljZXMucHVzaCggcGFydHNbIDAgXSApO1xyXG4gICAgICAgICAgICBpZiAoIHBhcnRzWyAxIF0gIT09IFwiXCIgKSBsaW5lVVZzLnB1c2goIHBhcnRzWyAxIF0gKTtcclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBzdGF0ZS5hZGRMaW5lR2VvbWV0cnkoIGxpbmVWZXJ0aWNlcywgbGluZVVWcyApO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5vYmplY3RfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgLy8gbyBvYmplY3RfbmFtZVxyXG4gICAgICAgIC8vIG9yXHJcbiAgICAgICAgLy8gZyBncm91cF9uYW1lXHJcblxyXG4gICAgICAgIHZhciBuYW1lID0gcmVzdWx0WyAwIF0uc3Vic3RyKCAxICkudHJpbSgpO1xyXG4gICAgICAgIHN0YXRlLnN0YXJ0T2JqZWN0KCBuYW1lICk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF91c2VfcGF0dGVybi50ZXN0KCBsaW5lICkgKSB7XHJcblxyXG4gICAgICAgIC8vIG1hdGVyaWFsXHJcblxyXG4gICAgICAgIHN0YXRlLm9iamVjdC5zdGFydE1hdGVyaWFsKCBsaW5lLnN1YnN0cmluZyggNyApLnRyaW0oKSwgc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoIHRoaXMucmVnZXhwLm1hdGVyaWFsX2xpYnJhcnlfcGF0dGVybi50ZXN0KCBsaW5lICkgKSB7XHJcblxyXG4gICAgICAgIC8vIG10bCBmaWxlXHJcblxyXG4gICAgICAgIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzLnB1c2goIGxpbmUuc3Vic3RyaW5nKCA3ICkudHJpbSgpICk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnNtb290aGluZ19wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAvLyBzbW9vdGggc2hhZGluZ1xyXG5cclxuICAgICAgICAvLyBAdG9kbyBIYW5kbGUgZmlsZXMgdGhhdCBoYXZlIHZhcnlpbmcgc21vb3RoIHZhbHVlcyBmb3IgYSBzZXQgb2YgZmFjZXMgaW5zaWRlIG9uZSBnZW9tZXRyeSxcclxuICAgICAgICAvLyBidXQgZG9lcyBub3QgZGVmaW5lIGEgdXNlbXRsIGZvciBlYWNoIGZhY2Ugc2V0LlxyXG4gICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIGRldGVjdGVkIGFuZCBhIGR1bW15IG1hdGVyaWFsIGNyZWF0ZWQgKGxhdGVyIE11bHRpTWF0ZXJpYWwgYW5kIGdlb21ldHJ5IGdyb3VwcykuXHJcbiAgICAgICAgLy8gVGhpcyByZXF1aXJlcyBzb21lIGNhcmUgdG8gbm90IGNyZWF0ZSBleHRyYSBtYXRlcmlhbCBvbiBlYWNoIHNtb290aCB2YWx1ZSBmb3IgXCJub3JtYWxcIiBvYmogZmlsZXMuXHJcbiAgICAgICAgLy8gd2hlcmUgZXhwbGljaXQgdXNlbXRsIGRlZmluZXMgZ2VvbWV0cnkgZ3JvdXBzLlxyXG4gICAgICAgIC8vIEV4YW1wbGUgYXNzZXQ6IGV4YW1wbGVzL21vZGVscy9vYmovY2VyYmVydXMvQ2VyYmVydXMub2JqXHJcblxyXG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdFsgMSBdLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHN0YXRlLm9iamVjdC5zbW9vdGggPSAoIHZhbHVlID09PSAnMScgfHwgdmFsdWUgPT09ICdvbicgKTtcclxuXHJcbiAgICAgICAgdmFyIG1hdGVyaWFsID0gc3RhdGUub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCgpO1xyXG4gICAgICAgIGlmICggbWF0ZXJpYWwgKSB7XHJcblxyXG4gICAgICAgICAgbWF0ZXJpYWwuc21vb3RoID0gc3RhdGUub2JqZWN0LnNtb290aDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gSGFuZGxlIG51bGwgdGVybWluYXRlZCBmaWxlcyB3aXRob3V0IGV4Y2VwdGlvblxyXG4gICAgICAgIGlmICggbGluZSA9PT0gJ1xcMCcgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIlVuZXhwZWN0ZWQgbGluZTogJ1wiICsgbGluZSAgKyBcIidcIiApO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0ZS5maW5hbGl6ZSgpO1xyXG5cclxuICAgIHZhciBjb250YWluZXIgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgIGNvbnRhaW5lci5tYXRlcmlhbExpYnJhcmllcyA9IFtdLmNvbmNhdCggc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMgKTtcclxuXHJcbiAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBzdGF0ZS5vYmplY3RzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XHJcblxyXG4gICAgICB2YXIgb2JqZWN0ID0gc3RhdGUub2JqZWN0c1sgaSBdO1xyXG4gICAgICB2YXIgZ2VvbWV0cnkgPSBvYmplY3QuZ2VvbWV0cnk7XHJcbiAgICAgIHZhciBtYXRlcmlhbHMgPSBvYmplY3QubWF0ZXJpYWxzO1xyXG4gICAgICB2YXIgaXNMaW5lID0gKCBnZW9tZXRyeS50eXBlID09PSAnTGluZScgKTtcclxuXHJcbiAgICAgIC8vIFNraXAgby9nIGxpbmUgZGVjbGFyYXRpb25zIHRoYXQgZGlkIG5vdCBmb2xsb3cgd2l0aCBhbnkgZmFjZXNcclxuICAgICAgaWYgKCBnZW9tZXRyeS52ZXJ0aWNlcy5sZW5ndGggPT09IDAgKSBjb250aW51ZTtcclxuXHJcbiAgICAgIHZhciBidWZmZXJnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xyXG5cclxuICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCAncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCBuZXcgRmxvYXQzMkFycmF5KCBnZW9tZXRyeS52ZXJ0aWNlcyApLCAzICkgKTtcclxuXHJcbiAgICAgIGlmICggZ2VvbWV0cnkubm9ybWFscy5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICdub3JtYWwnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCBuZXcgRmxvYXQzMkFycmF5KCBnZW9tZXRyeS5ub3JtYWxzICksIDMgKSApO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgYnVmZmVyZ2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICggZ2VvbWV0cnkudXZzLmxlbmd0aCA+IDAgKSB7XHJcblxyXG4gICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3V2JywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkudXZzICksIDIgKSApO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ3JlYXRlIG1hdGVyaWFsc1xyXG5cclxuICAgICAgdmFyIGNyZWF0ZWRNYXRlcmlhbHMgPSBbXTtcclxuXHJcbiAgICAgIGZvciAoIHZhciBtaSA9IDAsIG1pTGVuID0gbWF0ZXJpYWxzLmxlbmd0aDsgbWkgPCBtaUxlbiA7IG1pKysgKSB7XHJcblxyXG4gICAgICAgIHZhciBzb3VyY2VNYXRlcmlhbCA9IG1hdGVyaWFsc1ttaV07XHJcbiAgICAgICAgdmFyIG1hdGVyaWFsID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBpZiAoIHRoaXMubWF0ZXJpYWxzICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIG1hdGVyaWFsID0gdGhpcy5tYXRlcmlhbHMuY3JlYXRlKCBzb3VyY2VNYXRlcmlhbC5uYW1lICk7XHJcblxyXG4gICAgICAgICAgLy8gbXRsIGV0Yy4gbG9hZGVycyBwcm9iYWJseSBjYW4ndCBjcmVhdGUgbGluZSBtYXRlcmlhbHMgY29ycmVjdGx5LCBjb3B5IHByb3BlcnRpZXMgdG8gYSBsaW5lIG1hdGVyaWFsLlxyXG4gICAgICAgICAgaWYgKCBpc0xpbmUgJiYgbWF0ZXJpYWwgJiYgISAoIG1hdGVyaWFsIGluc3RhbmNlb2YgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwgKSApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbExpbmUgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgbWF0ZXJpYWxMaW5lLmNvcHkoIG1hdGVyaWFsICk7XHJcbiAgICAgICAgICAgIG1hdGVyaWFsID0gbWF0ZXJpYWxMaW5lO1xyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoICEgbWF0ZXJpYWwgKSB7XHJcblxyXG4gICAgICAgICAgbWF0ZXJpYWwgPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCkgOiBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoKSApO1xyXG4gICAgICAgICAgbWF0ZXJpYWwubmFtZSA9IHNvdXJjZU1hdGVyaWFsLm5hbWU7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWF0ZXJpYWwuc2hhZGluZyA9IHNvdXJjZU1hdGVyaWFsLnNtb290aCA/IFRIUkVFLlNtb290aFNoYWRpbmcgOiBUSFJFRS5GbGF0U2hhZGluZztcclxuXHJcbiAgICAgICAgY3JlYXRlZE1hdGVyaWFscy5wdXNoKG1hdGVyaWFsKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENyZWF0ZSBtZXNoXHJcblxyXG4gICAgICB2YXIgbWVzaDtcclxuXHJcbiAgICAgIGlmICggY3JlYXRlZE1hdGVyaWFscy5sZW5ndGggPiAxICkge1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgbWkgPSAwLCBtaUxlbiA9IG1hdGVyaWFscy5sZW5ndGg7IG1pIDwgbWlMZW4gOyBtaSsrICkge1xyXG5cclxuICAgICAgICAgIHZhciBzb3VyY2VNYXRlcmlhbCA9IG1hdGVyaWFsc1ttaV07XHJcbiAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRHcm91cCggc291cmNlTWF0ZXJpYWwuZ3JvdXBTdGFydCwgc291cmNlTWF0ZXJpYWwuZ3JvdXBDb3VudCwgbWkgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbXVsdGlNYXRlcmlhbCA9IG5ldyBUSFJFRS5NdWx0aU1hdGVyaWFsKCBjcmVhdGVkTWF0ZXJpYWxzICk7XHJcbiAgICAgICAgbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIG11bHRpTWF0ZXJpYWwgKSA6IG5ldyBUSFJFRS5MaW5lKCBidWZmZXJnZW9tZXRyeSwgbXVsdGlNYXRlcmlhbCApICk7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBtZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFsc1sgMCBdICkgOiBuZXcgVEhSRUUuTGluZSggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbIDAgXSApICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1lc2gubmFtZSA9IG9iamVjdC5uYW1lO1xyXG5cclxuICAgICAgY29udGFpbmVyLmFkZCggbWVzaCApO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLnRpbWVFbmQoICdPQkpMb2FkZXInICk7XHJcblxyXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuXHJcbiAgfVxyXG5cclxufTsiLCJUSFJFRS5WaXZlQ29udHJvbGxlciA9IGZ1bmN0aW9uICggaWQgKSB7XHJcblxyXG4gIFRIUkVFLk9iamVjdDNELmNhbGwoIHRoaXMgKTtcclxuXHJcbiAgdGhpcy5tYXRyaXhBdXRvVXBkYXRlID0gZmFsc2U7XHJcbiAgdGhpcy5zdGFuZGluZ01hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XHJcblxyXG4gIHZhciBzY29wZSA9IHRoaXM7XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHVwZGF0ZSApO1xyXG5cclxuICAgIHZhciBnYW1lcGFkID0gbmF2aWdhdG9yLmdldEdhbWVwYWRzKClbIGlkIF07XHJcblxyXG4gICAgaWYgKCBnYW1lcGFkICE9PSB1bmRlZmluZWQgJiYgZ2FtZXBhZC5wb3NlICE9PSBudWxsICYmIGdhbWVwYWQucG9zZS5wb3NpdGlvbiAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgIHZhciBwb3NlID0gZ2FtZXBhZC5wb3NlO1xyXG5cclxuICAgICAgc2NvcGUucG9zaXRpb24uZnJvbUFycmF5KCBwb3NlLnBvc2l0aW9uICk7XHJcbiAgICAgIHNjb3BlLnF1YXRlcm5pb24uZnJvbUFycmF5KCBwb3NlLm9yaWVudGF0aW9uICk7XHJcbiAgICAgIHNjb3BlLm1hdHJpeC5jb21wb3NlKCBzY29wZS5wb3NpdGlvbiwgc2NvcGUucXVhdGVybmlvbiwgc2NvcGUuc2NhbGUgKTtcclxuICAgICAgc2NvcGUubWF0cml4Lm11bHRpcGx5TWF0cmljZXMoIHNjb3BlLnN0YW5kaW5nTWF0cml4LCBzY29wZS5tYXRyaXggKTtcclxuICAgICAgc2NvcGUubWF0cml4V29ybGROZWVkc1VwZGF0ZSA9IHRydWU7XHJcblxyXG4gICAgICBzY29wZS52aXNpYmxlID0gdHJ1ZTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgc2NvcGUudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTtcclxuXHJcbn07XHJcblxyXG5USFJFRS5WaXZlQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBUSFJFRS5PYmplY3QzRC5wcm90b3R5cGUgKTtcclxuVEhSRUUuVml2ZUNvbnRyb2xsZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVEhSRUUuVml2ZUNvbnRyb2xsZXI7IiwiLyoqXG4gKiBAYXV0aG9yIGRtYXJjb3MgLyBodHRwczovL2dpdGh1Yi5jb20vZG1hcmNvc1xuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbVxuICovXG5cblRIUkVFLlZSQ29udHJvbHMgPSBmdW5jdGlvbiAoIG9iamVjdCwgb25FcnJvciApIHtcblxuXHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdHZhciB2ckRpc3BsYXksIHZyRGlzcGxheXM7XG5cblx0dmFyIHN0YW5kaW5nTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcblxuXHRmdW5jdGlvbiBnb3RWUkRpc3BsYXlzKCBkaXNwbGF5cyApIHtcblxuXHRcdHZyRGlzcGxheXMgPSBkaXNwbGF5cztcblxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IGRpc3BsYXlzLmxlbmd0aDsgaSArKyApIHtcblxuXHRcdFx0aWYgKCAoICdWUkRpc3BsYXknIGluIHdpbmRvdyAmJiBkaXNwbGF5c1sgaSBdIGluc3RhbmNlb2YgVlJEaXNwbGF5ICkgfHxcblx0XHRcdFx0ICggJ1Bvc2l0aW9uU2Vuc29yVlJEZXZpY2UnIGluIHdpbmRvdyAmJiBkaXNwbGF5c1sgaSBdIGluc3RhbmNlb2YgUG9zaXRpb25TZW5zb3JWUkRldmljZSApICkge1xuXG5cdFx0XHRcdHZyRGlzcGxheSA9IGRpc3BsYXlzWyBpIF07XG5cdFx0XHRcdGJyZWFrOyAgLy8gV2Uga2VlcCB0aGUgZmlyc3Qgd2UgZW5jb3VudGVyXG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGlmICggdnJEaXNwbGF5ID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdGlmICggb25FcnJvciApIG9uRXJyb3IoICdWUiBpbnB1dCBub3QgYXZhaWxhYmxlLicgKTtcblxuXHRcdH1cblxuXHR9XG5cblx0aWYgKCBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cyApIHtcblxuXHRcdG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzKCkudGhlbiggZ290VlJEaXNwbGF5cyApO1xuXG5cdH0gZWxzZSBpZiAoIG5hdmlnYXRvci5nZXRWUkRldmljZXMgKSB7XG5cblx0XHQvLyBEZXByZWNhdGVkIEFQSS5cblx0XHRuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzKCkudGhlbiggZ290VlJEaXNwbGF5cyApO1xuXG5cdH1cblxuXHQvLyB0aGUgUmlmdCBTREsgcmV0dXJucyB0aGUgcG9zaXRpb24gaW4gbWV0ZXJzXG5cdC8vIHRoaXMgc2NhbGUgZmFjdG9yIGFsbG93cyB0aGUgdXNlciB0byBkZWZpbmUgaG93IG1ldGVyc1xuXHQvLyBhcmUgY29udmVydGVkIHRvIHNjZW5lIHVuaXRzLlxuXG5cdHRoaXMuc2NhbGUgPSAxO1xuXG5cdC8vIElmIHRydWUgd2lsbCB1c2UgXCJzdGFuZGluZyBzcGFjZVwiIGNvb3JkaW5hdGUgc3lzdGVtIHdoZXJlIHk9MCBpcyB0aGVcblx0Ly8gZmxvb3IgYW5kIHg9MCwgej0wIGlzIHRoZSBjZW50ZXIgb2YgdGhlIHJvb20uXG5cdHRoaXMuc3RhbmRpbmcgPSBmYWxzZTtcblxuXHQvLyBEaXN0YW5jZSBmcm9tIHRoZSB1c2VycyBleWVzIHRvIHRoZSBmbG9vciBpbiBtZXRlcnMuIFVzZWQgd2hlblxuXHQvLyBzdGFuZGluZz10cnVlIGJ1dCB0aGUgVlJEaXNwbGF5IGRvZXNuJ3QgcHJvdmlkZSBzdGFnZVBhcmFtZXRlcnMuXG5cdHRoaXMudXNlckhlaWdodCA9IDEuNjtcblxuXHR0aGlzLmdldFZSRGlzcGxheSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB2ckRpc3BsYXk7XG5cblx0fTtcblxuXHR0aGlzLmdldFZSRGlzcGxheXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdnJEaXNwbGF5cztcblxuXHR9O1xuXG5cdHRoaXMuZ2V0U3RhbmRpbmdNYXRyaXggPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gc3RhbmRpbmdNYXRyaXg7XG5cblx0fTtcblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICggdnJEaXNwbGF5ICkge1xuXG5cdFx0XHRpZiAoIHZyRGlzcGxheS5nZXRQb3NlICkge1xuXG5cdFx0XHRcdHZhciBwb3NlID0gdnJEaXNwbGF5LmdldFBvc2UoKTtcblxuXHRcdFx0XHRpZiAoIHBvc2Uub3JpZW50YXRpb24gIT09IG51bGwgKSB7XG5cblx0XHRcdFx0XHRvYmplY3QucXVhdGVybmlvbi5mcm9tQXJyYXkoIHBvc2Uub3JpZW50YXRpb24gKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBwb3NlLnBvc2l0aW9uICE9PSBudWxsICkge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnBvc2l0aW9uLmZyb21BcnJheSggcG9zZS5wb3NpdGlvbiApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRvYmplY3QucG9zaXRpb24uc2V0KCAwLCAwLCAwICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIERlcHJlY2F0ZWQgQVBJLlxuXHRcdFx0XHR2YXIgc3RhdGUgPSB2ckRpc3BsYXkuZ2V0U3RhdGUoKTtcblxuXHRcdFx0XHRpZiAoIHN0YXRlLm9yaWVudGF0aW9uICE9PSBudWxsICkge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnF1YXRlcm5pb24uY29weSggc3RhdGUub3JpZW50YXRpb24gKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBzdGF0ZS5wb3NpdGlvbiAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdG9iamVjdC5wb3NpdGlvbi5jb3B5KCBzdGF0ZS5wb3NpdGlvbiApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRvYmplY3QucG9zaXRpb24uc2V0KCAwLCAwLCAwICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggdGhpcy5zdGFuZGluZyApIHtcblxuXHRcdFx0XHRpZiAoIHZyRGlzcGxheS5zdGFnZVBhcmFtZXRlcnMgKSB7XG5cblx0XHRcdFx0XHRvYmplY3QudXBkYXRlTWF0cml4KCk7XG5cblx0XHRcdFx0XHRzdGFuZGluZ01hdHJpeC5mcm9tQXJyYXkoIHZyRGlzcGxheS5zdGFnZVBhcmFtZXRlcnMuc2l0dGluZ1RvU3RhbmRpbmdUcmFuc2Zvcm0gKTtcblx0XHRcdFx0XHRvYmplY3QuYXBwbHlNYXRyaXgoIHN0YW5kaW5nTWF0cml4ICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdG9iamVjdC5wb3NpdGlvbi5zZXRZKCBvYmplY3QucG9zaXRpb24ueSArIHRoaXMudXNlckhlaWdodCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRvYmplY3QucG9zaXRpb24ubXVsdGlwbHlTY2FsYXIoIHNjb3BlLnNjYWxlICk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLnJlc2V0UG9zZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICggdnJEaXNwbGF5ICkge1xuXG5cdFx0XHRpZiAoIHZyRGlzcGxheS5yZXNldFBvc2UgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHR2ckRpc3BsYXkucmVzZXRQb3NlKCk7XG5cblx0XHRcdH0gZWxzZSBpZiAoIHZyRGlzcGxheS5yZXNldFNlbnNvciAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdC8vIERlcHJlY2F0ZWQgQVBJLlxuXHRcdFx0XHR2ckRpc3BsYXkucmVzZXRTZW5zb3IoKTtcblxuXHRcdFx0fSBlbHNlIGlmICggdnJEaXNwbGF5Lnplcm9TZW5zb3IgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHQvLyBSZWFsbHkgZGVwcmVjYXRlZCBBUEkuXG5cdFx0XHRcdHZyRGlzcGxheS56ZXJvU2Vuc29yKCk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMucmVzZXRTZW5zb3IgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRjb25zb2xlLndhcm4oICdUSFJFRS5WUkNvbnRyb2xzOiAucmVzZXRTZW5zb3IoKSBpcyBub3cgLnJlc2V0UG9zZSgpLicgKTtcblx0XHR0aGlzLnJlc2V0UG9zZSgpO1xuXG5cdH07XG5cblx0dGhpcy56ZXJvU2Vuc29yID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0Y29uc29sZS53YXJuKCAnVEhSRUUuVlJDb250cm9sczogLnplcm9TZW5zb3IoKSBpcyBub3cgLnJlc2V0UG9zZSgpLicgKTtcblx0XHR0aGlzLnJlc2V0UG9zZSgpO1xuXG5cdH07XG5cblx0dGhpcy5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0dnJEaXNwbGF5ID0gbnVsbDtcblxuXHR9O1xuXG59O1xuIiwiLyoqXG4gKiBAYXV0aG9yIGRtYXJjb3MgLyBodHRwczovL2dpdGh1Yi5jb20vZG1hcmNvc1xuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbVxuICpcbiAqIFdlYlZSIFNwZWM6IGh0dHA6Ly9tb3p2ci5naXRodWIuaW8vd2VidnItc3BlYy93ZWJ2ci5odG1sXG4gKlxuICogRmlyZWZveDogaHR0cDovL21venZyLmNvbS9kb3dubG9hZHMvXG4gKiBDaHJvbWl1bTogaHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZvbGRlcnZpZXc/aWQ9MEJ6dWRMdDIyQnFHUmJXOVdUSE10T1dNek5qUSZ1c3A9c2hhcmluZyNsaXN0XG4gKlxuICovXG5cblRIUkVFLlZSRWZmZWN0ID0gZnVuY3Rpb24gKCByZW5kZXJlciwgb25FcnJvciApIHtcblxuXHR2YXIgaXNXZWJWUjEgPSB0cnVlO1xuXG5cdHZhciB2ckRpc3BsYXksIHZyRGlzcGxheXM7XG5cdHZhciBleWVUcmFuc2xhdGlvbkwgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXHR2YXIgZXllVHJhbnNsYXRpb25SID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblx0dmFyIHJlbmRlclJlY3RMLCByZW5kZXJSZWN0Ujtcblx0dmFyIGV5ZUZPVkwsIGV5ZUZPVlI7XG5cblx0ZnVuY3Rpb24gZ290VlJEaXNwbGF5cyggZGlzcGxheXMgKSB7XG5cblx0XHR2ckRpc3BsYXlzID0gZGlzcGxheXM7XG5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBkaXNwbGF5cy5sZW5ndGg7IGkgKysgKSB7XG5cblx0XHRcdGlmICggJ1ZSRGlzcGxheScgaW4gd2luZG93ICYmIGRpc3BsYXlzWyBpIF0gaW5zdGFuY2VvZiBWUkRpc3BsYXkgKSB7XG5cblx0XHRcdFx0dnJEaXNwbGF5ID0gZGlzcGxheXNbIGkgXTtcblx0XHRcdFx0aXNXZWJWUjEgPSB0cnVlO1xuXHRcdFx0XHRicmVhazsgLy8gV2Uga2VlcCB0aGUgZmlyc3Qgd2UgZW5jb3VudGVyXG5cblx0XHRcdH0gZWxzZSBpZiAoICdITURWUkRldmljZScgaW4gd2luZG93ICYmIGRpc3BsYXlzWyBpIF0gaW5zdGFuY2VvZiBITURWUkRldmljZSApIHtcblxuXHRcdFx0XHR2ckRpc3BsYXkgPSBkaXNwbGF5c1sgaSBdO1xuXHRcdFx0XHRpc1dlYlZSMSA9IGZhbHNlO1xuXHRcdFx0XHRicmVhazsgLy8gV2Uga2VlcCB0aGUgZmlyc3Qgd2UgZW5jb3VudGVyXG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGlmICggdnJEaXNwbGF5ID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdGlmICggb25FcnJvciApIG9uRXJyb3IoICdITUQgbm90IGF2YWlsYWJsZScgKTtcblxuXHRcdH1cblxuXHR9XG5cblx0aWYgKCBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cyApIHtcblxuXHRcdG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzKCkudGhlbiggZ290VlJEaXNwbGF5cyApO1xuXG5cdH0gZWxzZSBpZiAoIG5hdmlnYXRvci5nZXRWUkRldmljZXMgKSB7XG5cblx0XHQvLyBEZXByZWNhdGVkIEFQSS5cblx0XHRuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzKCkudGhlbiggZ290VlJEaXNwbGF5cyApO1xuXG5cdH1cblxuXHQvL1xuXG5cdHRoaXMuaXNQcmVzZW50aW5nID0gZmFsc2U7XG5cdHRoaXMuc2NhbGUgPSAxO1xuXG5cdHZhciBzY29wZSA9IHRoaXM7XG5cblx0dmFyIHJlbmRlcmVyU2l6ZSA9IHJlbmRlcmVyLmdldFNpemUoKTtcblx0dmFyIHJlbmRlcmVyUGl4ZWxSYXRpbyA9IHJlbmRlcmVyLmdldFBpeGVsUmF0aW8oKTtcblxuXHR0aGlzLmdldFZSRGlzcGxheSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB2ckRpc3BsYXk7XG5cblx0fTtcblxuXHR0aGlzLmdldFZSRGlzcGxheXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdnJEaXNwbGF5cztcblxuXHR9O1xuXG5cdHRoaXMuc2V0U2l6ZSA9IGZ1bmN0aW9uICggd2lkdGgsIGhlaWdodCApIHtcblxuXHRcdHJlbmRlcmVyU2l6ZSA9IHsgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9O1xuXG5cdFx0aWYgKCBzY29wZS5pc1ByZXNlbnRpbmcgKSB7XG5cblx0XHRcdHZhciBleWVQYXJhbXNMID0gdnJEaXNwbGF5LmdldEV5ZVBhcmFtZXRlcnMoICdsZWZ0JyApO1xuXHRcdFx0cmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyggMSApO1xuXG5cdFx0XHRpZiAoIGlzV2ViVlIxICkge1xuXG5cdFx0XHRcdHJlbmRlcmVyLnNldFNpemUoIGV5ZVBhcmFtc0wucmVuZGVyV2lkdGggKiAyLCBleWVQYXJhbXNMLnJlbmRlckhlaWdodCwgZmFsc2UgKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRyZW5kZXJlci5zZXRTaXplKCBleWVQYXJhbXNMLnJlbmRlclJlY3Qud2lkdGggKiAyLCBleWVQYXJhbXNMLnJlbmRlclJlY3QuaGVpZ2h0LCBmYWxzZSApO1xuXG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRyZW5kZXJlci5zZXRQaXhlbFJhdGlvKCByZW5kZXJlclBpeGVsUmF0aW8gKTtcblx0XHRcdHJlbmRlcmVyLnNldFNpemUoIHdpZHRoLCBoZWlnaHQgKTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdC8vIGZ1bGxzY3JlZW5cblxuXHR2YXIgY2FudmFzID0gcmVuZGVyZXIuZG9tRWxlbWVudDtcblx0dmFyIHJlcXVlc3RGdWxsc2NyZWVuO1xuXHR2YXIgZXhpdEZ1bGxzY3JlZW47XG5cdHZhciBmdWxsc2NyZWVuRWxlbWVudDtcblx0dmFyIGxlZnRCb3VuZHMgPSBbIDAuMCwgMC4wLCAwLjUsIDEuMCBdO1xuXHR2YXIgcmlnaHRCb3VuZHMgPSBbIDAuNSwgMC4wLCAwLjUsIDEuMCBdO1xuXG5cdGZ1bmN0aW9uIG9uRnVsbHNjcmVlbkNoYW5nZSAoKSB7XG5cblx0XHR2YXIgd2FzUHJlc2VudGluZyA9IHNjb3BlLmlzUHJlc2VudGluZztcblx0XHRzY29wZS5pc1ByZXNlbnRpbmcgPSB2ckRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiAoIHZyRGlzcGxheS5pc1ByZXNlbnRpbmcgfHwgKCAhIGlzV2ViVlIxICYmIGRvY3VtZW50WyBmdWxsc2NyZWVuRWxlbWVudCBdIGluc3RhbmNlb2Ygd2luZG93LkhUTUxFbGVtZW50ICkgKTtcblxuXHRcdGlmICggc2NvcGUuaXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHR2YXIgZXllUGFyYW1zTCA9IHZyRGlzcGxheS5nZXRFeWVQYXJhbWV0ZXJzKCAnbGVmdCcgKTtcblx0XHRcdHZhciBleWVXaWR0aCwgZXllSGVpZ2h0O1xuXG5cdFx0XHRpZiAoIGlzV2ViVlIxICkge1xuXG5cdFx0XHRcdGV5ZVdpZHRoID0gZXllUGFyYW1zTC5yZW5kZXJXaWR0aDtcblx0XHRcdFx0ZXllSGVpZ2h0ID0gZXllUGFyYW1zTC5yZW5kZXJIZWlnaHQ7XG5cblx0XHRcdFx0aWYgKCB2ckRpc3BsYXkuZ2V0TGF5ZXJzICkge1xuXG5cdFx0XHRcdFx0dmFyIGxheWVycyA9IHZyRGlzcGxheS5nZXRMYXllcnMoKTtcblx0XHRcdFx0XHRpZiAobGF5ZXJzLmxlbmd0aCkge1xuXG5cdFx0XHRcdFx0XHRsZWZ0Qm91bmRzID0gbGF5ZXJzWzBdLmxlZnRCb3VuZHMgfHwgWyAwLjAsIDAuMCwgMC41LCAxLjAgXTtcblx0XHRcdFx0XHRcdHJpZ2h0Qm91bmRzID0gbGF5ZXJzWzBdLnJpZ2h0Qm91bmRzIHx8IFsgMC41LCAwLjAsIDAuNSwgMS4wIF07XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRleWVXaWR0aCA9IGV5ZVBhcmFtc0wucmVuZGVyUmVjdC53aWR0aDtcblx0XHRcdFx0ZXllSGVpZ2h0ID0gZXllUGFyYW1zTC5yZW5kZXJSZWN0LmhlaWdodDtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICF3YXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHRcdHJlbmRlcmVyUGl4ZWxSYXRpbyA9IHJlbmRlcmVyLmdldFBpeGVsUmF0aW8oKTtcblx0XHRcdFx0cmVuZGVyZXJTaXplID0gcmVuZGVyZXIuZ2V0U2l6ZSgpO1xuXG5cdFx0XHRcdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8oIDEgKTtcblx0XHRcdFx0cmVuZGVyZXIuc2V0U2l6ZSggZXllV2lkdGggKiAyLCBleWVIZWlnaHQsIGZhbHNlICk7XG5cblx0XHRcdH1cblxuXHRcdH0gZWxzZSBpZiAoIHdhc1ByZXNlbnRpbmcgKSB7XG5cblx0XHRcdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8oIHJlbmRlcmVyUGl4ZWxSYXRpbyApO1xuXHRcdFx0cmVuZGVyZXIuc2V0U2l6ZSggcmVuZGVyZXJTaXplLndpZHRoLCByZW5kZXJlclNpemUuaGVpZ2h0ICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGlmICggY2FudmFzLnJlcXVlc3RGdWxsc2NyZWVuICkge1xuXG5cdFx0cmVxdWVzdEZ1bGxzY3JlZW4gPSAncmVxdWVzdEZ1bGxzY3JlZW4nO1xuXHRcdGZ1bGxzY3JlZW5FbGVtZW50ID0gJ2Z1bGxzY3JlZW5FbGVtZW50Jztcblx0XHRleGl0RnVsbHNjcmVlbiA9ICdleGl0RnVsbHNjcmVlbic7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2Z1bGxzY3JlZW5jaGFuZ2UnLCBvbkZ1bGxzY3JlZW5DaGFuZ2UsIGZhbHNlICk7XG5cblx0fSBlbHNlIGlmICggY2FudmFzLm1velJlcXVlc3RGdWxsU2NyZWVuICkge1xuXG5cdFx0cmVxdWVzdEZ1bGxzY3JlZW4gPSAnbW96UmVxdWVzdEZ1bGxTY3JlZW4nO1xuXHRcdGZ1bGxzY3JlZW5FbGVtZW50ID0gJ21vekZ1bGxTY3JlZW5FbGVtZW50Jztcblx0XHRleGl0RnVsbHNjcmVlbiA9ICdtb3pDYW5jZWxGdWxsU2NyZWVuJztcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW96ZnVsbHNjcmVlbmNoYW5nZScsIG9uRnVsbHNjcmVlbkNoYW5nZSwgZmFsc2UgKTtcblxuXHR9IGVsc2Uge1xuXG5cdFx0cmVxdWVzdEZ1bGxzY3JlZW4gPSAnd2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4nO1xuXHRcdGZ1bGxzY3JlZW5FbGVtZW50ID0gJ3dlYmtpdEZ1bGxzY3JlZW5FbGVtZW50Jztcblx0XHRleGl0RnVsbHNjcmVlbiA9ICd3ZWJraXRFeGl0RnVsbHNjcmVlbic7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLCBvbkZ1bGxzY3JlZW5DaGFuZ2UsIGZhbHNlICk7XG5cblx0fVxuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAndnJkaXNwbGF5cHJlc2VudGNoYW5nZScsIG9uRnVsbHNjcmVlbkNoYW5nZSwgZmFsc2UgKTtcblxuXHR0aGlzLnNldEZ1bGxTY3JlZW4gPSBmdW5jdGlvbiAoIGJvb2xlYW4gKSB7XG5cblx0XHRyZXR1cm4gbmV3IFByb21pc2UoIGZ1bmN0aW9uICggcmVzb2x2ZSwgcmVqZWN0ICkge1xuXG5cdFx0XHRpZiAoIHZyRGlzcGxheSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdHJlamVjdCggbmV3IEVycm9yKCAnTm8gVlIgaGFyZHdhcmUgZm91bmQuJyApICk7XG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHNjb3BlLmlzUHJlc2VudGluZyA9PT0gYm9vbGVhbiApIHtcblxuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGlzV2ViVlIxICkge1xuXG5cdFx0XHRcdGlmICggYm9vbGVhbiApIHtcblxuXHRcdFx0XHRcdHJlc29sdmUoIHZyRGlzcGxheS5yZXF1ZXN0UHJlc2VudCggWyB7IHNvdXJjZTogY2FudmFzIH0gXSApICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdHJlc29sdmUoIHZyRGlzcGxheS5leGl0UHJlc2VudCgpICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGlmICggY2FudmFzWyByZXF1ZXN0RnVsbHNjcmVlbiBdICkge1xuXG5cdFx0XHRcdFx0Y2FudmFzWyBib29sZWFuID8gcmVxdWVzdEZ1bGxzY3JlZW4gOiBleGl0RnVsbHNjcmVlbiBdKCB7IHZyRGlzcGxheTogdnJEaXNwbGF5IH0gKTtcblx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoICdObyBjb21wYXRpYmxlIHJlcXVlc3RGdWxsc2NyZWVuIG1ldGhvZCBmb3VuZC4nICk7XG5cdFx0XHRcdFx0cmVqZWN0KCBuZXcgRXJyb3IoICdObyBjb21wYXRpYmxlIHJlcXVlc3RGdWxsc2NyZWVuIG1ldGhvZCBmb3VuZC4nICkgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH0gKTtcblxuXHR9O1xuXG5cdHRoaXMucmVxdWVzdFByZXNlbnQgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5zZXRGdWxsU2NyZWVuKCB0cnVlICk7XG5cblx0fTtcblxuXHR0aGlzLmV4aXRQcmVzZW50ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuc2V0RnVsbFNjcmVlbiggZmFsc2UgKTtcblxuXHR9O1xuXG5cdHRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKCBmICkge1xuXG5cdFx0aWYgKCBpc1dlYlZSMSAmJiB2ckRpc3BsYXkgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0cmV0dXJuIHZyRGlzcGxheS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGYgKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBmICk7XG5cblx0XHR9XG5cblx0fTtcblx0XG5cdHRoaXMuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoIGggKSB7XG5cblx0XHRpZiAoIGlzV2ViVlIxICYmIHZyRGlzcGxheSAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHR2ckRpc3BsYXkuY2FuY2VsQW5pbWF0aW9uRnJhbWUoIGggKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSggaCApO1xuXG5cdFx0fVxuXG5cdH07XG5cdFxuXHR0aGlzLnN1Ym1pdEZyYW1lID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCBpc1dlYlZSMSAmJiB2ckRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiBzY29wZS5pc1ByZXNlbnRpbmcgKSB7XG5cblx0XHRcdHZyRGlzcGxheS5zdWJtaXRGcmFtZSgpO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5hdXRvU3VibWl0RnJhbWUgPSB0cnVlO1xuXG5cdC8vIHJlbmRlclxuXG5cdHZhciBjYW1lcmFMID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XG5cdGNhbWVyYUwubGF5ZXJzLmVuYWJsZSggMSApO1xuXG5cdHZhciBjYW1lcmFSID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XG5cdGNhbWVyYVIubGF5ZXJzLmVuYWJsZSggMiApO1xuXG5cdHRoaXMucmVuZGVyID0gZnVuY3Rpb24gKCBzY2VuZSwgY2FtZXJhLCByZW5kZXJUYXJnZXQsIGZvcmNlQ2xlYXIgKSB7XG5cblx0XHRpZiAoIHZyRGlzcGxheSAmJiBzY29wZS5pc1ByZXNlbnRpbmcgKSB7XG5cblx0XHRcdHZhciBhdXRvVXBkYXRlID0gc2NlbmUuYXV0b1VwZGF0ZTtcblxuXHRcdFx0aWYgKCBhdXRvVXBkYXRlICkge1xuXG5cdFx0XHRcdHNjZW5lLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG5cdFx0XHRcdHNjZW5lLmF1dG9VcGRhdGUgPSBmYWxzZTtcblxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgZXllUGFyYW1zTCA9IHZyRGlzcGxheS5nZXRFeWVQYXJhbWV0ZXJzKCAnbGVmdCcgKTtcblx0XHRcdHZhciBleWVQYXJhbXNSID0gdnJEaXNwbGF5LmdldEV5ZVBhcmFtZXRlcnMoICdyaWdodCcgKTtcblxuXHRcdFx0aWYgKCBpc1dlYlZSMSApIHtcblxuXHRcdFx0XHRleWVUcmFuc2xhdGlvbkwuZnJvbUFycmF5KCBleWVQYXJhbXNMLm9mZnNldCApO1xuXHRcdFx0XHRleWVUcmFuc2xhdGlvblIuZnJvbUFycmF5KCBleWVQYXJhbXNSLm9mZnNldCApO1xuXHRcdFx0XHRleWVGT1ZMID0gZXllUGFyYW1zTC5maWVsZE9mVmlldztcblx0XHRcdFx0ZXllRk9WUiA9IGV5ZVBhcmFtc1IuZmllbGRPZlZpZXc7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0ZXllVHJhbnNsYXRpb25MLmNvcHkoIGV5ZVBhcmFtc0wuZXllVHJhbnNsYXRpb24gKTtcblx0XHRcdFx0ZXllVHJhbnNsYXRpb25SLmNvcHkoIGV5ZVBhcmFtc1IuZXllVHJhbnNsYXRpb24gKTtcblx0XHRcdFx0ZXllRk9WTCA9IGV5ZVBhcmFtc0wucmVjb21tZW5kZWRGaWVsZE9mVmlldztcblx0XHRcdFx0ZXllRk9WUiA9IGV5ZVBhcmFtc1IucmVjb21tZW5kZWRGaWVsZE9mVmlldztcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIEFycmF5LmlzQXJyYXkoIHNjZW5lICkgKSB7XG5cblx0XHRcdFx0Y29uc29sZS53YXJuKCAnVEhSRUUuVlJFZmZlY3QucmVuZGVyKCkgbm8gbG9uZ2VyIHN1cHBvcnRzIGFycmF5cy4gVXNlIG9iamVjdC5sYXllcnMgaW5zdGVhZC4nICk7XG5cdFx0XHRcdHNjZW5lID0gc2NlbmVbIDAgXTtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBXaGVuIHJlbmRlcmluZyB3ZSBkb24ndCBjYXJlIHdoYXQgdGhlIHJlY29tbWVuZGVkIHNpemUgaXMsIG9ubHkgd2hhdCB0aGUgYWN0dWFsIHNpemVcblx0XHRcdC8vIG9mIHRoZSBiYWNrYnVmZmVyIGlzLlxuXHRcdFx0dmFyIHNpemUgPSByZW5kZXJlci5nZXRTaXplKCk7XG5cdFx0XHRyZW5kZXJSZWN0TCA9IHtcblx0XHRcdFx0eDogTWF0aC5yb3VuZCggc2l6ZS53aWR0aCAqIGxlZnRCb3VuZHNbIDAgXSApLFxuXHRcdFx0XHR5OiBNYXRoLnJvdW5kKCBzaXplLmhlaWdodCAqIGxlZnRCb3VuZHNbIDEgXSApLFxuXHRcdFx0XHR3aWR0aDogTWF0aC5yb3VuZCggc2l6ZS53aWR0aCAqIGxlZnRCb3VuZHNbIDIgXSApLFxuXHRcdFx0XHRoZWlnaHQ6ICBNYXRoLnJvdW5kKHNpemUuaGVpZ2h0ICogbGVmdEJvdW5kc1sgMyBdIClcblx0XHRcdH07XG5cdFx0XHRyZW5kZXJSZWN0UiA9IHtcblx0XHRcdFx0eDogTWF0aC5yb3VuZCggc2l6ZS53aWR0aCAqIHJpZ2h0Qm91bmRzWyAwIF0gKSxcblx0XHRcdFx0eTogTWF0aC5yb3VuZCggc2l6ZS5oZWlnaHQgKiByaWdodEJvdW5kc1sgMSBdICksXG5cdFx0XHRcdHdpZHRoOiBNYXRoLnJvdW5kKCBzaXplLndpZHRoICogcmlnaHRCb3VuZHNbIDIgXSApLFxuXHRcdFx0XHRoZWlnaHQ6ICBNYXRoLnJvdW5kKHNpemUuaGVpZ2h0ICogcmlnaHRCb3VuZHNbIDMgXSApXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAocmVuZGVyVGFyZ2V0KSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQocmVuZGVyVGFyZ2V0KTtcblx0XHRcdFx0cmVuZGVyVGFyZ2V0LnNjaXNzb3JUZXN0ID0gdHJ1ZTtcblx0XHRcdFx0XG5cdFx0XHR9IGVsc2UgIHtcblx0XHRcdFx0XG5cdFx0XHRcdHJlbmRlcmVyLnNldFNjaXNzb3JUZXN0KCB0cnVlICk7XG5cdFx0XHRcblx0XHRcdH1cblxuXHRcdFx0aWYgKCByZW5kZXJlci5hdXRvQ2xlYXIgfHwgZm9yY2VDbGVhciApIHJlbmRlcmVyLmNsZWFyKCk7XG5cblx0XHRcdGlmICggY2FtZXJhLnBhcmVudCA9PT0gbnVsbCApIGNhbWVyYS51cGRhdGVNYXRyaXhXb3JsZCgpO1xuXG5cdFx0XHRjYW1lcmFMLnByb2plY3Rpb25NYXRyaXggPSBmb3ZUb1Byb2plY3Rpb24oIGV5ZUZPVkwsIHRydWUsIGNhbWVyYS5uZWFyLCBjYW1lcmEuZmFyICk7XG5cdFx0XHRjYW1lcmFSLnByb2plY3Rpb25NYXRyaXggPSBmb3ZUb1Byb2plY3Rpb24oIGV5ZUZPVlIsIHRydWUsIGNhbWVyYS5uZWFyLCBjYW1lcmEuZmFyICk7XG5cblx0XHRcdGNhbWVyYS5tYXRyaXhXb3JsZC5kZWNvbXBvc2UoIGNhbWVyYUwucG9zaXRpb24sIGNhbWVyYUwucXVhdGVybmlvbiwgY2FtZXJhTC5zY2FsZSApO1xuXHRcdFx0Y2FtZXJhLm1hdHJpeFdvcmxkLmRlY29tcG9zZSggY2FtZXJhUi5wb3NpdGlvbiwgY2FtZXJhUi5xdWF0ZXJuaW9uLCBjYW1lcmFSLnNjYWxlICk7XG5cblx0XHRcdHZhciBzY2FsZSA9IHRoaXMuc2NhbGU7XG5cdFx0XHRjYW1lcmFMLnRyYW5zbGF0ZU9uQXhpcyggZXllVHJhbnNsYXRpb25MLCBzY2FsZSApO1xuXHRcdFx0Y2FtZXJhUi50cmFuc2xhdGVPbkF4aXMoIGV5ZVRyYW5zbGF0aW9uUiwgc2NhbGUgKTtcblxuXG5cdFx0XHQvLyByZW5kZXIgbGVmdCBleWVcblx0XHRcdGlmICggcmVuZGVyVGFyZ2V0ICkge1xuXG5cdFx0XHRcdHJlbmRlclRhcmdldC52aWV3cG9ydC5zZXQocmVuZGVyUmVjdEwueCwgcmVuZGVyUmVjdEwueSwgcmVuZGVyUmVjdEwud2lkdGgsIHJlbmRlclJlY3RMLmhlaWdodCk7XG5cdFx0XHRcdHJlbmRlclRhcmdldC5zY2lzc29yLnNldChyZW5kZXJSZWN0TC54LCByZW5kZXJSZWN0TC55LCByZW5kZXJSZWN0TC53aWR0aCwgcmVuZGVyUmVjdEwuaGVpZ2h0KTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRyZW5kZXJlci5zZXRWaWV3cG9ydCggcmVuZGVyUmVjdEwueCwgcmVuZGVyUmVjdEwueSwgcmVuZGVyUmVjdEwud2lkdGgsIHJlbmRlclJlY3RMLmhlaWdodCApO1xuXHRcdFx0XHRyZW5kZXJlci5zZXRTY2lzc29yKCByZW5kZXJSZWN0TC54LCByZW5kZXJSZWN0TC55LCByZW5kZXJSZWN0TC53aWR0aCwgcmVuZGVyUmVjdEwuaGVpZ2h0ICk7XG5cblx0XHRcdH1cblx0XHRcdHJlbmRlcmVyLnJlbmRlciggc2NlbmUsIGNhbWVyYUwsIHJlbmRlclRhcmdldCwgZm9yY2VDbGVhciApO1xuXG5cdFx0XHQvLyByZW5kZXIgcmlnaHQgZXllXG5cdFx0XHRpZiAocmVuZGVyVGFyZ2V0KSB7XG5cblx0XHRcdFx0cmVuZGVyVGFyZ2V0LnZpZXdwb3J0LnNldChyZW5kZXJSZWN0Ui54LCByZW5kZXJSZWN0Ui55LCByZW5kZXJSZWN0Ui53aWR0aCwgcmVuZGVyUmVjdFIuaGVpZ2h0KTtcbiAgXHRcdFx0XHRyZW5kZXJUYXJnZXQuc2Npc3Nvci5zZXQocmVuZGVyUmVjdFIueCwgcmVuZGVyUmVjdFIueSwgcmVuZGVyUmVjdFIud2lkdGgsIHJlbmRlclJlY3RSLmhlaWdodCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0cmVuZGVyZXIuc2V0Vmlld3BvcnQoIHJlbmRlclJlY3RSLngsIHJlbmRlclJlY3RSLnksIHJlbmRlclJlY3RSLndpZHRoLCByZW5kZXJSZWN0Ui5oZWlnaHQgKTtcblx0XHRcdFx0cmVuZGVyZXIuc2V0U2Npc3NvciggcmVuZGVyUmVjdFIueCwgcmVuZGVyUmVjdFIueSwgcmVuZGVyUmVjdFIud2lkdGgsIHJlbmRlclJlY3RSLmhlaWdodCApO1xuXG5cdFx0XHR9XG5cdFx0XHRyZW5kZXJlci5yZW5kZXIoIHNjZW5lLCBjYW1lcmFSLCByZW5kZXJUYXJnZXQsIGZvcmNlQ2xlYXIgKTtcblxuXHRcdFx0aWYgKHJlbmRlclRhcmdldCkge1xuXG5cdFx0XHRcdHJlbmRlclRhcmdldC52aWV3cG9ydC5zZXQoIDAsIDAsIHNpemUud2lkdGgsIHNpemUuaGVpZ2h0ICk7XG5cdFx0XHRcdHJlbmRlclRhcmdldC5zY2lzc29yLnNldCggMCwgMCwgc2l6ZS53aWR0aCwgc2l6ZS5oZWlnaHQgKTtcblx0XHRcdFx0cmVuZGVyVGFyZ2V0LnNjaXNzb3JUZXN0ID0gZmFsc2U7XG5cdFx0XHRcdHJlbmRlcmVyLnNldFJlbmRlclRhcmdldCggbnVsbCApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcblx0XHRcdFx0cmVuZGVyZXIuc2V0U2Npc3NvclRlc3QoIGZhbHNlICk7XG5cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKCBhdXRvVXBkYXRlICkge1xuXG5cdFx0XHRcdHNjZW5lLmF1dG9VcGRhdGUgPSB0cnVlO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggc2NvcGUuYXV0b1N1Ym1pdEZyYW1lICkge1xuXG5cdFx0XHRcdHNjb3BlLnN1Ym1pdEZyYW1lKCk7XG5cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0fVxuXG5cdFx0Ly8gUmVndWxhciByZW5kZXIgbW9kZSBpZiBub3QgSE1EXG5cblx0XHRyZW5kZXJlci5yZW5kZXIoIHNjZW5lLCBjYW1lcmEsIHJlbmRlclRhcmdldCwgZm9yY2VDbGVhciApO1xuXG5cdH07XG5cblx0Ly9cblxuXHRmdW5jdGlvbiBmb3ZUb05EQ1NjYWxlT2Zmc2V0KCBmb3YgKSB7XG5cblx0XHR2YXIgcHhzY2FsZSA9IDIuMCAvICggZm92LmxlZnRUYW4gKyBmb3YucmlnaHRUYW4gKTtcblx0XHR2YXIgcHhvZmZzZXQgPSAoIGZvdi5sZWZ0VGFuIC0gZm92LnJpZ2h0VGFuICkgKiBweHNjYWxlICogMC41O1xuXHRcdHZhciBweXNjYWxlID0gMi4wIC8gKCBmb3YudXBUYW4gKyBmb3YuZG93blRhbiApO1xuXHRcdHZhciBweW9mZnNldCA9ICggZm92LnVwVGFuIC0gZm92LmRvd25UYW4gKSAqIHB5c2NhbGUgKiAwLjU7XG5cdFx0cmV0dXJuIHsgc2NhbGU6IFsgcHhzY2FsZSwgcHlzY2FsZSBdLCBvZmZzZXQ6IFsgcHhvZmZzZXQsIHB5b2Zmc2V0IF0gfTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gZm92UG9ydFRvUHJvamVjdGlvbiggZm92LCByaWdodEhhbmRlZCwgek5lYXIsIHpGYXIgKSB7XG5cblx0XHRyaWdodEhhbmRlZCA9IHJpZ2h0SGFuZGVkID09PSB1bmRlZmluZWQgPyB0cnVlIDogcmlnaHRIYW5kZWQ7XG5cdFx0ek5lYXIgPSB6TmVhciA9PT0gdW5kZWZpbmVkID8gMC4wMSA6IHpOZWFyO1xuXHRcdHpGYXIgPSB6RmFyID09PSB1bmRlZmluZWQgPyAxMDAwMC4wIDogekZhcjtcblxuXHRcdHZhciBoYW5kZWRuZXNzU2NhbGUgPSByaWdodEhhbmRlZCA/IC0gMS4wIDogMS4wO1xuXG5cdFx0Ly8gc3RhcnQgd2l0aCBhbiBpZGVudGl0eSBtYXRyaXhcblx0XHR2YXIgbW9iaiA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XG5cdFx0dmFyIG0gPSBtb2JqLmVsZW1lbnRzO1xuXG5cdFx0Ly8gYW5kIHdpdGggc2NhbGUvb2Zmc2V0IGluZm8gZm9yIG5vcm1hbGl6ZWQgZGV2aWNlIGNvb3Jkc1xuXHRcdHZhciBzY2FsZUFuZE9mZnNldCA9IGZvdlRvTkRDU2NhbGVPZmZzZXQoIGZvdiApO1xuXG5cdFx0Ly8gWCByZXN1bHQsIG1hcCBjbGlwIGVkZ2VzIHRvIFstdywrd11cblx0XHRtWyAwICogNCArIDAgXSA9IHNjYWxlQW5kT2Zmc2V0LnNjYWxlWyAwIF07XG5cdFx0bVsgMCAqIDQgKyAxIF0gPSAwLjA7XG5cdFx0bVsgMCAqIDQgKyAyIF0gPSBzY2FsZUFuZE9mZnNldC5vZmZzZXRbIDAgXSAqIGhhbmRlZG5lc3NTY2FsZTtcblx0XHRtWyAwICogNCArIDMgXSA9IDAuMDtcblxuXHRcdC8vIFkgcmVzdWx0LCBtYXAgY2xpcCBlZGdlcyB0byBbLXcsK3ddXG5cdFx0Ly8gWSBvZmZzZXQgaXMgbmVnYXRlZCBiZWNhdXNlIHRoaXMgcHJvaiBtYXRyaXggdHJhbnNmb3JtcyBmcm9tIHdvcmxkIGNvb3JkcyB3aXRoIFk9dXAsXG5cdFx0Ly8gYnV0IHRoZSBOREMgc2NhbGluZyBoYXMgWT1kb3duICh0aGFua3MgRDNEPylcblx0XHRtWyAxICogNCArIDAgXSA9IDAuMDtcblx0XHRtWyAxICogNCArIDEgXSA9IHNjYWxlQW5kT2Zmc2V0LnNjYWxlWyAxIF07XG5cdFx0bVsgMSAqIDQgKyAyIF0gPSAtIHNjYWxlQW5kT2Zmc2V0Lm9mZnNldFsgMSBdICogaGFuZGVkbmVzc1NjYWxlO1xuXHRcdG1bIDEgKiA0ICsgMyBdID0gMC4wO1xuXG5cdFx0Ly8gWiByZXN1bHQgKHVwIHRvIHRoZSBhcHApXG5cdFx0bVsgMiAqIDQgKyAwIF0gPSAwLjA7XG5cdFx0bVsgMiAqIDQgKyAxIF0gPSAwLjA7XG5cdFx0bVsgMiAqIDQgKyAyIF0gPSB6RmFyIC8gKCB6TmVhciAtIHpGYXIgKSAqIC0gaGFuZGVkbmVzc1NjYWxlO1xuXHRcdG1bIDIgKiA0ICsgMyBdID0gKCB6RmFyICogek5lYXIgKSAvICggek5lYXIgLSB6RmFyICk7XG5cblx0XHQvLyBXIHJlc3VsdCAoPSBaIGluKVxuXHRcdG1bIDMgKiA0ICsgMCBdID0gMC4wO1xuXHRcdG1bIDMgKiA0ICsgMSBdID0gMC4wO1xuXHRcdG1bIDMgKiA0ICsgMiBdID0gaGFuZGVkbmVzc1NjYWxlO1xuXHRcdG1bIDMgKiA0ICsgMyBdID0gMC4wO1xuXG5cdFx0bW9iai50cmFuc3Bvc2UoKTtcblxuXHRcdHJldHVybiBtb2JqO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBmb3ZUb1Byb2plY3Rpb24oIGZvdiwgcmlnaHRIYW5kZWQsIHpOZWFyLCB6RmFyICkge1xuXG5cdFx0dmFyIERFRzJSQUQgPSBNYXRoLlBJIC8gMTgwLjA7XG5cblx0XHR2YXIgZm92UG9ydCA9IHtcblx0XHRcdHVwVGFuOiBNYXRoLnRhbiggZm92LnVwRGVncmVlcyAqIERFRzJSQUQgKSxcblx0XHRcdGRvd25UYW46IE1hdGgudGFuKCBmb3YuZG93bkRlZ3JlZXMgKiBERUcyUkFEICksXG5cdFx0XHRsZWZ0VGFuOiBNYXRoLnRhbiggZm92LmxlZnREZWdyZWVzICogREVHMlJBRCApLFxuXHRcdFx0cmlnaHRUYW46IE1hdGgudGFuKCBmb3YucmlnaHREZWdyZWVzICogREVHMlJBRCApXG5cdFx0fTtcblxuXHRcdHJldHVybiBmb3ZQb3J0VG9Qcm9qZWN0aW9uKCBmb3ZQb3J0LCByaWdodEhhbmRlZCwgek5lYXIsIHpGYXIgKTtcblxuXHR9XG5cbn07XG4iLCIvKipcclxuKiBAYXV0aG9yIG1yZG9vYiAvIGh0dHA6Ly9tcmRvb2IuY29tXHJcbiogQmFzZWQgb24gQHRvamlybydzIHZyLXNhbXBsZXMtdXRpbHMuanNcclxuKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0xhdGVzdEF2YWlsYWJsZSgpIHtcclxuXHJcbiAgcmV0dXJuIG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzICE9PSB1bmRlZmluZWQ7XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNBdmFpbGFibGUoKSB7XHJcblxyXG4gIHJldHVybiBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cyAhPT0gdW5kZWZpbmVkIHx8IG5hdmlnYXRvci5nZXRWUkRldmljZXMgIT09IHVuZGVmaW5lZDtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzYWdlKCkge1xyXG5cclxuICB2YXIgbWVzc2FnZTtcclxuXHJcbiAgaWYgKCBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cyApIHtcclxuXHJcbiAgICBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cygpLnRoZW4oIGZ1bmN0aW9uICggZGlzcGxheXMgKSB7XHJcblxyXG4gICAgICBpZiAoIGRpc3BsYXlzLmxlbmd0aCA9PT0gMCApIG1lc3NhZ2UgPSAnV2ViVlIgc3VwcG9ydGVkLCBidXQgbm8gVlJEaXNwbGF5cyBmb3VuZC4nO1xyXG5cclxuICAgIH0gKTtcclxuXHJcbiAgfSBlbHNlIGlmICggbmF2aWdhdG9yLmdldFZSRGV2aWNlcyApIHtcclxuXHJcbiAgICBtZXNzYWdlID0gJ1lvdXIgYnJvd3NlciBzdXBwb3J0cyBXZWJWUiBidXQgbm90IHRoZSBsYXRlc3QgdmVyc2lvbi4gU2VlIDxhIGhyZWY9XCJodHRwOi8vd2VidnIuaW5mb1wiPndlYnZyLmluZm88L2E+IGZvciBtb3JlIGluZm8uJztcclxuXHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICBtZXNzYWdlID0gJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFdlYlZSLiBTZWUgPGEgaHJlZj1cImh0dHA6Ly93ZWJ2ci5pbmZvXCI+d2VidnIuaW5mbzwvYT4gZm9yIGFzc2lzdGFuY2UuJztcclxuXHJcbiAgfVxyXG5cclxuICBpZiAoIG1lc3NhZ2UgIT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcclxuICAgIGNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICBjb250YWluZXIuc3R5bGUubGVmdCA9ICcwJztcclxuICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSAnMCc7XHJcbiAgICBjb250YWluZXIuc3R5bGUucmlnaHQgPSAnMCc7XHJcbiAgICBjb250YWluZXIuc3R5bGUuekluZGV4ID0gJzk5OSc7XHJcbiAgICBjb250YWluZXIuYWxpZ24gPSAnY2VudGVyJztcclxuXHJcbiAgICB2YXIgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xyXG4gICAgZXJyb3Iuc3R5bGUuZm9udEZhbWlseSA9ICdzYW5zLXNlcmlmJztcclxuICAgIGVycm9yLnN0eWxlLmZvbnRTaXplID0gJzE2cHgnO1xyXG4gICAgZXJyb3Iuc3R5bGUuZm9udFN0eWxlID0gJ25vcm1hbCc7XHJcbiAgICBlcnJvci5zdHlsZS5saW5lSGVpZ2h0ID0gJzI2cHgnO1xyXG4gICAgZXJyb3Iuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmZmYnO1xyXG4gICAgZXJyb3Iuc3R5bGUuY29sb3IgPSAnIzAwMCc7XHJcbiAgICBlcnJvci5zdHlsZS5wYWRkaW5nID0gJzEwcHggMjBweCc7XHJcbiAgICBlcnJvci5zdHlsZS5tYXJnaW4gPSAnNTBweCc7XHJcbiAgICBlcnJvci5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XHJcbiAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKCBlcnJvciApO1xyXG5cclxuICAgIHJldHVybiBjb250YWluZXI7XHJcblxyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRCdXR0b24oIGVmZmVjdCApIHtcclxuXHJcbiAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdidXR0b24nICk7XHJcbiAgYnV0dG9uLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICBidXR0b24uc3R5bGUubGVmdCA9ICdjYWxjKDUwJSAtIDUwcHgpJztcclxuICBidXR0b24uc3R5bGUuYm90dG9tID0gJzIwcHgnO1xyXG4gIGJ1dHRvbi5zdHlsZS53aWR0aCA9ICcxMDBweCc7XHJcbiAgYnV0dG9uLnN0eWxlLmJvcmRlciA9ICcwJztcclxuICBidXR0b24uc3R5bGUucGFkZGluZyA9ICc4cHgnO1xyXG4gIGJ1dHRvbi5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgYnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjMDAwJztcclxuICBidXR0b24uc3R5bGUuY29sb3IgPSAnI2ZmZic7XHJcbiAgYnV0dG9uLnN0eWxlLmZvbnRGYW1pbHkgPSAnc2Fucy1zZXJpZic7XHJcbiAgYnV0dG9uLnN0eWxlLmZvbnRTaXplID0gJzEzcHgnO1xyXG4gIGJ1dHRvbi5zdHlsZS5mb250U3R5bGUgPSAnbm9ybWFsJztcclxuICBidXR0b24uc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgYnV0dG9uLnN0eWxlLnpJbmRleCA9ICc5OTknO1xyXG4gIGJ1dHRvbi50ZXh0Q29udGVudCA9ICdFTlRFUiBWUic7XHJcbiAgYnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBlZmZlY3QuaXNQcmVzZW50aW5nID8gZWZmZWN0LmV4aXRQcmVzZW50KCkgOiBlZmZlY3QucmVxdWVzdFByZXNlbnQoKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICd2cmRpc3BsYXlwcmVzZW50Y2hhbmdlJywgZnVuY3Rpb24gKCBldmVudCApIHtcclxuXHJcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSBlZmZlY3QuaXNQcmVzZW50aW5nID8gJ0VYSVQgVlInIDogJ0VOVEVSIFZSJztcclxuXHJcbiAgfSwgZmFsc2UgKTtcclxuXHJcbiAgcmV0dXJuIGJ1dHRvbjtcclxuXHJcbn1cclxuXHJcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiJdfQ==
