(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _vrviewer = require('./vrviewer');

var _vrviewer2 = _interopRequireDefault(_vrviewer);

var _vrpad = require('./vrpad');

var VRPad = _interopRequireWildcard(_vrpad);

var _vrdatgui = require('./vrdatgui');

var _vrdatgui2 = _interopRequireDefault(_vrdatgui);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createApp = (0, _vrviewer2.default)(THREE);

var _createApp = createApp({
  autoEnter: true,
  emptyRoom: true
});

var scene = _createApp.scene;
var camera = _createApp.camera;
var events = _createApp.events;
var toggleVR = _createApp.toggleVR;
var controllerModels = _createApp.controllerModels;


var box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial());
scene.add(box);

var vrpad = VRPad.create();

events.on('tick', function (dt) {
  vrpad.update();
});

//  create a pointer
var pointer = new THREE.Mesh(new THREE.SphereGeometry(0.01, 12, 7), new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
pointer.position.z = -0.12;
pointer.position.y = -0.12;
controllerModels[0].add(pointer);

//  right hand
vrpad.events.on('connected0', function (pad) {

  pad.on('button1Pressed', function () {
    return pointer.pressed = true;
  });

  pad.on('button1Released', function () {
    return pointer.pressed = false;
  });

  //  option button
  pad.on('button3Pressed', function (index, value) {
    toggleVR();
  });
});

//  left hand
vrpad.events.on('connected1', function (pad) {

  //  option button
  pad.on('button3Pressed', function (index, value) {
    window.close();
  });
});

var state = {
  x: 0
};

var gui = (0, _vrdatgui2.default)(THREE);
gui.addInputObject(pointer);

var controller = gui.add(state, 'x');
controller.position.x = 0.0;
controller.position.y = 1.5;
controller.updateMatrixWorld();

// scene.add( controller );

box.add(controller);

events.on('tick', function () {
  box.rotation.y += 0.001;
});

},{"./vrdatgui":2,"./vrpad":3,"./vrviewer":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = VRDATGUI;
function VRDATGUI(THREE) {

  var inputObjects = [];
  var controllers = [];

  function addInputObject(object) {
    inputObjects.push({
      box: new THREE.Box3(),
      object: object
    });
  }

  function add(object, propertyName) {

    var slider = createSlider();
    controllers.push(slider);

    return slider;
  }

  function update() {
    requestAnimationFrame(update);

    inputObjects.forEach(function (set) {
      set.box.setFromObject(set.object);
    });

    controllers.forEach(function (controller) {
      controller.update(inputObjects);
    });
  }

  update();

  return {
    addInputObject: addInputObject,
    add: add
  };
}

function createSlider() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 4 : _ref$width;


  var group = new THREE.Group();

  var DEFAULT_COLOR = 0x2FA1D6;
  var HIGHLIGHT_COLOR = 0x40BDF7;
  var INTERACTION_COLOR = 0xBDE8FC;
  var EMISSIVE_COLOR = 0x222222;

  //  filled volume
  var rect = new THREE.BoxGeometry(0.1, 0.1, 0.03, 1, 1, 1);
  rect.applyMatrix(new THREE.Matrix4().makeTranslation(-0.05, 0, 0));

  var material = new THREE.MeshPhongMaterial({ color: DEFAULT_COLOR, emissive: EMISSIVE_COLOR });
  var filledVolume = new THREE.Mesh(rect, material);
  filledVolume.scale.x = width;

  //  outline volume
  var outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
  var outlineMesh = new THREE.Mesh(rect, outlineMaterial);
  outlineMesh.scale.x = width;
  outlineMesh.visible = false;

  var outline = new THREE.BoxHelper(outlineMesh);
  outline.material.color.setHex(0x999999);

  var endLocator = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.1, 1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  endLocator.position.x = -0.1 * width;
  endLocator.visible = false;

  group.add(filledVolume, outline, outlineMesh, endLocator);

  var boundingBox = new THREE.Box3();

  var state = {
    value: 1.0,
    hover: false,
    press: false
  };

  group.update = function (inputObjects) {
    boundingBox.setFromObject(outlineMesh);
    inputObjects.forEach(function (set) {
      if (boundingBox.intersectsBox(set.box)) {
        state.hover = true;
      } else {
        state.hover = false;
      }

      if (state.hover && set.object.pressed) {
        state.press = true;
      } else {
        state.press = false;
      }

      update(set.box);
    });

    updateView();
  };

  function update(box) {
    if (state.press && state.hover) {

      filledVolume.updateMatrixWorld();
      endLocator.updateMatrixWorld();

      var a = new THREE.Vector3().setFromMatrixPosition(filledVolume.matrixWorld);
      var b = new THREE.Vector3().setFromMatrixPosition(endLocator.matrixWorld);

      var intersectionPoint = boundingBox.intersect(box).center();
      var pointAlpha = getPointAlpha(intersectionPoint, { a: a, b: b });
      state.value = pointAlpha;

      filledVolume.scale.x = state.value * width;
    }
  }

  function updateView() {
    if (state.press) {
      material.color.setHex(INTERACTION_COLOR);
    } else if (state.hover) {
      material.color.setHex(HIGHLIGHT_COLOR);
    } else {
      material.color.setHex(DEFAULT_COLOR);
    }
  }

  return group;
}

function getPointAlpha(point, segment) {
  var a = new THREE.Vector3().copy(segment.b).sub(segment.a);
  var b = new THREE.Vector3().copy(point).sub(segment.a);
  var projected = b.projectOnVector(a);

  var length = segment.a.distanceTo(segment.b);

  var alpha = projected.length() / length;
  if (alpha > 1.0) {
    alpha = 1.0;
  }
  if (alpha < 0.0) {
    alpha = 0.0;
  }
  return alpha;
}

function lerp(min, max, value) {
  return (1 - value) * min + value * max;
}

},{}],3:[function(require,module,exports){
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

},{"events":10}],4:[function(require,module,exports){
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
    };
}

},{"./objloader":5,"./vivecontroller":6,"./vrcontrols":7,"./vreffects":8,"./webvr":9,"events":10}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxpbmRleC5qcyIsIm1vZHVsZXNcXHZyZGF0Z3VpXFxpbmRleC5qcyIsIm1vZHVsZXNcXHZycGFkXFxpbmRleC5qcyIsIm1vZHVsZXNcXHZydmlld2VyXFxpbmRleC5qcyIsIm1vZHVsZXNcXHZydmlld2VyXFxvYmpsb2FkZXIuanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcdml2ZWNvbnRyb2xsZXIuanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcdnJjb250cm9scy5qcyIsIm1vZHVsZXNcXHZydmlld2VyXFx2cmVmZmVjdHMuanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcd2VidnIuanMiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7SUFBWSxLOztBQUNaOzs7Ozs7OztBQUVBLElBQU0sWUFBWSx3QkFBVSxLQUFWLENBQWxCOztpQkFFOEQsVUFBVTtBQUN0RSxhQUFXLElBRDJEO0FBRXRFLGFBQVc7QUFGMkQsQ0FBVixDOztJQUF0RCxLLGNBQUEsSztJQUFPLE0sY0FBQSxNO0lBQVEsTSxjQUFBLE07SUFBUSxRLGNBQUEsUTtJQUFVLGdCLGNBQUEsZ0I7OztBQUt6QyxJQUFNLE1BQU0sSUFBSSxNQUFNLElBQVYsQ0FBZ0IsSUFBSSxNQUFNLFdBQVYsQ0FBdUIsQ0FBdkIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsQ0FBaEIsRUFBa0QsSUFBSSxNQUFNLG9CQUFWLEVBQWxELENBQVo7QUFDQSxNQUFNLEdBQU4sQ0FBVyxHQUFYOztBQUdBLElBQU0sUUFBUSxNQUFNLE1BQU4sRUFBZDs7QUFFQSxP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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZSVmlld2VyIGZyb20gJy4vdnJ2aWV3ZXInO1xyXG5pbXBvcnQgKiBhcyBWUlBhZCBmcm9tICcuL3ZycGFkJztcclxuaW1wb3J0IFZSREFUR1VJIGZyb20gJy4vdnJkYXRndWknO1xyXG5cclxuY29uc3QgY3JlYXRlQXBwID0gVlJWaWV3ZXIoIFRIUkVFICk7XHJcblxyXG5jb25zdCB7IHNjZW5lLCBjYW1lcmEsIGV2ZW50cywgdG9nZ2xlVlIsIGNvbnRyb2xsZXJNb2RlbHMgfSA9IGNyZWF0ZUFwcCh7XHJcbiAgYXV0b0VudGVyOiB0cnVlLFxyXG4gIGVtcHR5Um9vbTogdHJ1ZVxyXG59KTtcclxuXHJcbmNvbnN0IGJveCA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIDEsIDEsIDEgKSwgbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKCkgKTtcclxuc2NlbmUuYWRkKCBib3ggKTtcclxuXHJcblxyXG5jb25zdCB2cnBhZCA9IFZSUGFkLmNyZWF0ZSgpO1xyXG5cclxuZXZlbnRzLm9uKCAndGljaycsIChkdCk9PntcclxuICB2cnBhZC51cGRhdGUoKTtcclxufSk7XHJcblxyXG5cclxuXHJcblxyXG4vLyAgY3JlYXRlIGEgcG9pbnRlclxyXG5jb25zdCBwb2ludGVyID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjAxLCAxMiwgNyApLCBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4ZmYwMDAwLCB3aXJlZnJhbWU6IHRydWV9KSApXHJcbnBvaW50ZXIucG9zaXRpb24ueiA9IC0wLjEyO1xyXG5wb2ludGVyLnBvc2l0aW9uLnkgPSAtMC4xMjtcclxuY29udHJvbGxlck1vZGVsc1swXS5hZGQoIHBvaW50ZXIgKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyAgcmlnaHQgaGFuZFxyXG52cnBhZC5ldmVudHMub24oICdjb25uZWN0ZWQwJywgKCBwYWQgKSA9PiB7XHJcblxyXG4gIHBhZC5vbignYnV0dG9uMVByZXNzZWQnLCAoKT0+cG9pbnRlci5wcmVzc2VkID0gdHJ1ZSApO1xyXG5cclxuICBwYWQub24oJ2J1dHRvbjFSZWxlYXNlZCcsICgpPT5wb2ludGVyLnByZXNzZWQgPSBmYWxzZSApO1xyXG5cclxuICAvLyAgb3B0aW9uIGJ1dHRvblxyXG4gIHBhZC5vbignYnV0dG9uM1ByZXNzZWQnLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICl7XHJcbiAgICB0b2dnbGVWUigpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcblxyXG4vLyAgbGVmdCBoYW5kXHJcbnZycGFkLmV2ZW50cy5vbiggJ2Nvbm5lY3RlZDEnLCAoIHBhZCApID0+IHtcclxuXHJcbiAgLy8gIG9wdGlvbiBidXR0b25cclxuICBwYWQub24oJ2J1dHRvbjNQcmVzc2VkJywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApe1xyXG4gICAgd2luZG93LmNsb3NlKCk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuY29uc3Qgc3RhdGUgPSB7XHJcbiAgeDogMFxyXG59O1xyXG5cclxuY29uc3QgZ3VpID0gVlJEQVRHVUkoVEhSRUUpO1xyXG5ndWkuYWRkSW5wdXRPYmplY3QoIHBvaW50ZXIgKTtcclxuXHJcblxyXG5jb25zdCBjb250cm9sbGVyID0gZ3VpLmFkZCggc3RhdGUsICd4JyApO1xyXG5jb250cm9sbGVyLnBvc2l0aW9uLnggPSAwLjA7XHJcbmNvbnRyb2xsZXIucG9zaXRpb24ueSA9IDEuNTtcclxuY29udHJvbGxlci51cGRhdGVNYXRyaXhXb3JsZCgpO1xyXG5cclxuLy8gc2NlbmUuYWRkKCBjb250cm9sbGVyICk7XHJcblxyXG5ib3guYWRkKCBjb250cm9sbGVyICk7XHJcblxyXG5ldmVudHMub24oJ3RpY2snLCBmdW5jdGlvbigpe1xyXG4gIGJveC5yb3RhdGlvbi55ICs9IDAuMDAxO1xyXG59KTtcclxuXHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFZSREFUR1VJKCBUSFJFRSApe1xyXG5cclxuICBjb25zdCBpbnB1dE9iamVjdHMgPSBbXTtcclxuICBjb25zdCBjb250cm9sbGVycyA9IFtdO1xyXG5cclxuICBmdW5jdGlvbiBhZGRJbnB1dE9iamVjdCggb2JqZWN0ICl7XHJcbiAgICBpbnB1dE9iamVjdHMucHVzaCgge1xyXG4gICAgICBib3g6IG5ldyBUSFJFRS5Cb3gzKCksXHJcbiAgICAgIG9iamVjdFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGQoIG9iamVjdCwgcHJvcGVydHlOYW1lICl7XHJcblxyXG4gICAgY29uc3Qgc2xpZGVyID0gY3JlYXRlU2xpZGVyKCk7XHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBzbGlkZXIgKTtcclxuXHJcbiAgICByZXR1cm4gc2xpZGVyO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSggdXBkYXRlICk7XHJcblxyXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCBzZXQgKXtcclxuICAgICAgc2V0LmJveC5zZXRGcm9tT2JqZWN0KCBzZXQub2JqZWN0ICk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5mb3JFYWNoKCBmdW5jdGlvbiggY29udHJvbGxlciApe1xyXG4gICAgICBjb250cm9sbGVyLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgYWRkSW5wdXRPYmplY3QsXHJcbiAgICBhZGRcclxuICB9O1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlU2xpZGVyKHtcclxuICB3aWR0aCA9IDRcclxufSA9IHt9ICl7XHJcblxyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICBjb25zdCBERUZBVUxUX0NPTE9SID0gMHgyRkExRDY7XHJcbiAgY29uc3QgSElHSExJR0hUX0NPTE9SID0gMHg0MEJERjc7XHJcbiAgY29uc3QgSU5URVJBQ1RJT05fQ09MT1IgPSAweEJERThGQztcclxuICBjb25zdCBFTUlTU0lWRV9DT0xPUiA9IDB4MjIyMjIyO1xyXG5cclxuICAvLyAgZmlsbGVkIHZvbHVtZVxyXG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIDAuMSwgMC4xLCAwLjAzLCAxLCAxLCAxICk7XHJcbiAgcmVjdC5hcHBseU1hdHJpeCggbmV3IFRIUkVFLk1hdHJpeDQoKS5tYWtlVHJhbnNsYXRpb24oIC0wLjA1LCAwLCAwICkgKTtcclxuXHJcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogREVGQVVMVF9DT0xPUiwgZW1pc3NpdmU6IEVNSVNTSVZFX0NPTE9SIH0pO1xyXG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LCBtYXRlcmlhbCApO1xyXG4gIGZpbGxlZFZvbHVtZS5zY2FsZS54ID0gd2lkdGg7XHJcblxyXG5cclxuICAvLyAgb3V0bGluZSB2b2x1bWVcclxuICBjb25zdCBvdXRsaW5lTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHgxMTExMTEgfSk7XHJcbiAgY29uc3Qgb3V0bGluZU1lc2ggPSBuZXcgVEhSRUUuTWVzaCggcmVjdCwgb3V0bGluZU1hdGVyaWFsICk7XHJcbiAgb3V0bGluZU1lc2guc2NhbGUueCA9IHdpZHRoO1xyXG4gIG91dGxpbmVNZXNoLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3Qgb3V0bGluZSA9IG5ldyBUSFJFRS5Cb3hIZWxwZXIoIG91dGxpbmVNZXNoICk7XHJcbiAgb3V0bGluZS5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIDB4OTk5OTk5ICk7XHJcblxyXG4gIGNvbnN0IGVuZExvY2F0b3IgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCAwLjA1LCAwLjA1LCAwLjEsIDEsIDEsIDEgKSwgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7Y29sb3I6IDB4ZmZmZmZmfSApICk7XHJcbiAgZW5kTG9jYXRvci5wb3NpdGlvbi54ID0gLTAuMSAqIHdpZHRoO1xyXG4gIGVuZExvY2F0b3IudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICBncm91cC5hZGQoIGZpbGxlZFZvbHVtZSwgb3V0bGluZSwgb3V0bGluZU1lc2gsIGVuZExvY2F0b3IgKTtcclxuXHJcblxyXG5cclxuICBjb25zdCBib3VuZGluZ0JveCA9IG5ldyBUSFJFRS5Cb3gzKCk7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgdmFsdWU6IDEuMCxcclxuICAgIGhvdmVyOiBmYWxzZSxcclxuICAgIHByZXNzOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGJvdW5kaW5nQm94LnNldEZyb21PYmplY3QoIG91dGxpbmVNZXNoICk7XHJcbiAgICBpbnB1dE9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24oIHNldCApe1xyXG4gICAgICBpZiggYm91bmRpbmdCb3guaW50ZXJzZWN0c0JveCggc2V0LmJveCApICl7XHJcbiAgICAgICAgc3RhdGUuaG92ZXIgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHN0YXRlLmhvdmVyID0gZmFsc2VcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoIHN0YXRlLmhvdmVyICYmIHNldC5vYmplY3QucHJlc3NlZCApe1xyXG4gICAgICAgIHN0YXRlLnByZXNzID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgIHN0YXRlLnByZXNzID0gZmFsc2VcclxuICAgICAgfVxyXG5cclxuICAgICAgdXBkYXRlKCBzZXQuYm94ICk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGUoIGJveCApe1xyXG4gICAgaWYoIHN0YXRlLnByZXNzICYmIHN0YXRlLmhvdmVyICl7XHJcblxyXG4gICAgICBmaWxsZWRWb2x1bWUudXBkYXRlTWF0cml4V29ybGQoKTtcclxuICAgICAgZW5kTG9jYXRvci51cGRhdGVNYXRyaXhXb3JsZCgpO1xyXG5cclxuICAgICAgY29uc3QgYSA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBmaWxsZWRWb2x1bWUubWF0cml4V29ybGQgKTtcclxuICAgICAgY29uc3QgYiA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBlbmRMb2NhdG9yLm1hdHJpeFdvcmxkICk7XHJcblxyXG4gICAgICBjb25zdCBpbnRlcnNlY3Rpb25Qb2ludCA9IGJvdW5kaW5nQm94LmludGVyc2VjdCggYm94ICkuY2VudGVyKCk7XHJcbiAgICAgIGNvbnN0IHBvaW50QWxwaGEgPSBnZXRQb2ludEFscGhhKCBpbnRlcnNlY3Rpb25Qb2ludCwge2EsYn0gKTtcclxuICAgICAgc3RhdGUudmFsdWUgPSBwb2ludEFscGhhO1xyXG5cclxuICAgICAgZmlsbGVkVm9sdW1lLnNjYWxlLnggPSBzdGF0ZS52YWx1ZSAqIHdpZHRoO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG4gICAgaWYoIHN0YXRlLnByZXNzICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggSU5URVJBQ1RJT05fQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIGlmKCBzdGF0ZS5ob3ZlciApe1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIEhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBERUZBVUxUX0NPTE9SICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQb2ludEFscGhhKCBwb2ludCwgc2VnbWVudCApe1xyXG4gIGNvbnN0IGEgPSBuZXcgVEhSRUUuVmVjdG9yMygpLmNvcHkoIHNlZ21lbnQuYiApLnN1Yiggc2VnbWVudC5hICk7XHJcbiAgY29uc3QgYiA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuY29weSggcG9pbnQgKS5zdWIoIHNlZ21lbnQuYSApO1xyXG4gIGNvbnN0IHByb2plY3RlZCA9IGIucHJvamVjdE9uVmVjdG9yKCBhICk7XHJcblxyXG4gIGNvbnN0IGxlbmd0aCA9IHNlZ21lbnQuYS5kaXN0YW5jZVRvKCBzZWdtZW50LmIgKTtcclxuXHJcbiAgbGV0IGFscGhhID0gcHJvamVjdGVkLmxlbmd0aCgpIC8gbGVuZ3RoO1xyXG4gIGlmKCBhbHBoYSA+IDEuMCApe1xyXG4gICAgYWxwaGEgPSAxLjA7XHJcbiAgfVxyXG4gIGlmKCBhbHBoYSA8IDAuMCApe1xyXG4gICAgYWxwaGEgPSAwLjA7XHJcbiAgfVxyXG4gIHJldHVybiBhbHBoYTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGVycChtaW4sIG1heCwgdmFsdWUpIHtcclxuICByZXR1cm4gKDEtdmFsdWUpKm1pbiArIHZhbHVlKm1heDtcclxufSIsImltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCl7XHJcblxyXG4gIGNvbnN0IHBhZHMgPSBbXTtcclxuXHJcbiAgY29uc3QgZXZlbnRzID0gbmV3IEVtaXR0ZXIoKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlKCl7XHJcbiAgICBjb25zdCBnYW1lUGFkcyA9IG5hdmlnYXRvci5nZXRHYW1lcGFkcygpO1xyXG4gICAgZm9yKCBsZXQgaT0wOyBpPGdhbWVQYWRzLmxlbmd0aDsgaSsrICl7XHJcbiAgICAgIGNvbnN0IGdhbWVQYWQgPSBnYW1lUGFkc1sgaSBdO1xyXG4gICAgICBpZiggZ2FtZVBhZCApe1xyXG5cclxuICAgICAgICBpZiggcGFkc1sgaSBdID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgICAgIHBhZHNbIGkgXSA9IGNyZWF0ZVBhZEhhbmRsZXIoIGdhbWVQYWQgKTtcclxuICAgICAgICAgIGV2ZW50cy5lbWl0KCAnY29ubmVjdGVkJywgcGFkc1sgaSBdICk7XHJcbiAgICAgICAgICBldmVudHMuZW1pdCggJ2Nvbm5lY3RlZCcraSwgcGFkc1sgaSBdICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwYWRzWyBpIF0udXBkYXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB1cGRhdGUsXHJcbiAgICBwYWRzLFxyXG4gICAgZXZlbnRzXHJcbiAgfTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBhZEhhbmRsZXIoIHBhZCApe1xyXG4gIGNvbnN0IGV2ZW50cyA9IG5ldyBFbWl0dGVyKCk7XHJcblxyXG4gIGxldCBsYXN0QnV0dG9ucyA9IGNsb25lQnV0dG9ucyggcGFkLmJ1dHRvbnMgKTtcclxuXHJcbiAgY29uc29sZS5sb2coIGxhc3RCdXR0b25zICk7XHJcbiAgZnVuY3Rpb24gdXBkYXRlKCl7XHJcblxyXG4gICAgY29uc3QgYnV0dG9ucyA9IHBhZC5idXR0b25zO1xyXG5cclxuICAgIC8vICBjb21wYXJlXHJcbiAgICBidXR0b25zLmZvckVhY2goICggYnV0dG9uLCBpbmRleCApPT57XHJcblxyXG4gICAgICBjb25zdCBsYXN0QnV0dG9uID0gbGFzdEJ1dHRvbnNbIGluZGV4IF07XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCBidXR0b24ucHJlc3NlZCwgbGFzdEJ1dHRvbi5wcmVzc2VkICk7XHJcbiAgICAgIGlmKCBidXR0b24ucHJlc3NlZCAhPT0gbGFzdEJ1dHRvbi5wcmVzc2VkICl7XHJcbiAgICAgICAgaWYoIGJ1dHRvbi5wcmVzc2VkICl7XHJcbiAgICAgICAgICBldmVudHMuZW1pdCggJ2J1dHRvblByZXNzZWQnLCBpbmRleCwgYnV0dG9uLnZhbHVlICk7XHJcbiAgICAgICAgICBldmVudHMuZW1pdCggJ2J1dHRvbicraW5kZXgrJ1ByZXNzZWQnLCBidXR0b24udmFsdWUgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIGV2ZW50cy5lbWl0KCAnYnV0dG9uUmVsZWFzZWQnLCBpbmRleCwgYnV0dG9uLnZhbHVlICk7XHJcbiAgICAgICAgICBldmVudHMuZW1pdCggJ2J1dHRvbicraW5kZXgrJ1JlbGVhc2VkJywgYnV0dG9uLnZhbHVlICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgbGFzdEJ1dHRvbnMgPSBjbG9uZUJ1dHRvbnMoIHBhZC5idXR0b25zICk7XHJcblxyXG4gIH1cclxuXHJcbiAgZXZlbnRzLnVwZGF0ZSA9IHVwZGF0ZTtcclxuXHJcbiAgcmV0dXJuIGV2ZW50cztcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvbmVCdXR0b25zKCBidXR0b25zICl7XHJcbiAgY29uc3QgY2xvbmVkID0gW107XHJcblxyXG4gIGJ1dHRvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGJ1dHRvbiApe1xyXG4gICAgY2xvbmVkLnB1c2goe1xyXG4gICAgICBwcmVzc2VkOiBidXR0b24ucHJlc3NlZCxcclxuICAgICAgdG91Y2hlZDogYnV0dG9uLnRvdWNoZWQsXHJcbiAgICAgIHZhbHVlOiBidXR0b24udmFsdWVcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiBjbG9uZWQ7XHJcbn0iLCJpbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xyXG5cclxuaW1wb3J0ICogYXMgVlJDb250cm9scyBmcm9tICcuL3ZyY29udHJvbHMnO1xyXG5pbXBvcnQgKiBhcyBWUkVmZmVjdHMgZnJvbSAnLi92cmVmZmVjdHMnO1xyXG5pbXBvcnQgKiBhcyBWaXZlQ29udHJvbGxlciBmcm9tICcuL3ZpdmVjb250cm9sbGVyJztcclxuaW1wb3J0ICogYXMgV0VCVlIgZnJvbSAnLi93ZWJ2cic7XHJcbmltcG9ydCAqIGFzIE9iakxvYWRlciBmcm9tICcuL29iamxvYWRlcic7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlKCBUSFJFRSApe1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24oIHtcclxuXHJcbiAgICBlbXB0eVJvb20gPSB0cnVlLFxyXG4gICAgc3RhbmRpbmcgPSB0cnVlLFxyXG4gICAgbG9hZENvbnRyb2xsZXJzID0gdHJ1ZSxcclxuICAgIHZyQnV0dG9uID0gdHJ1ZSxcclxuICAgIGF1dG9FbnRlciA9IGZhbHNlLFxyXG4gICAgYW50aUFsaWFzID0gdHJ1ZSxcclxuICAgIHBhdGhUb0NvbnRyb2xsZXJzID0gJ21vZGVscy9vYmovdml2ZS1jb250cm9sbGVyLycsXHJcbiAgICBjb250cm9sbGVyTW9kZWxOYW1lID0gJ3ZyX2NvbnRyb2xsZXJfdml2ZV8xXzUub2JqJyxcclxuICAgIGNvbnRyb2xsZXJUZXh0dXJlTWFwID0gJ29uZXBvaW50Zml2ZV90ZXh0dXJlLnBuZycsXHJcbiAgICBjb250cm9sbGVyU3BlY01hcCA9ICdvbmVwb2ludGZpdmVfc3BlYy5wbmcnXHJcblxyXG4gIH0gPSB7fSApe1xyXG5cclxuICAgIGlmICggV0VCVlIuaXNMYXRlc3RBdmFpbGFibGUoKSA9PT0gZmFsc2UgKSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIFdFQlZSLmdldE1lc3NhZ2UoKSApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGV2ZW50cyA9IG5ldyBFbWl0dGVyKCk7XHJcblxyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lciApO1xyXG5cclxuXHJcbiAgICBjb25zdCBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG5cclxuICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSggNzAsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwICk7XHJcbiAgICBzY2VuZS5hZGQoIGNhbWVyYSApO1xyXG5cclxuICAgIGlmKCBlbXB0eVJvb20gKXtcclxuICAgICAgY29uc3Qgcm9vbSA9IG5ldyBUSFJFRS5NZXNoKFxyXG4gICAgICAgIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggNiwgNiwgNiwgOCwgOCwgOCApLFxyXG4gICAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCggeyBjb2xvcjogMHg0MDQwNDAsIHdpcmVmcmFtZTogdHJ1ZSB9IClcclxuICAgICAgKTtcclxuICAgICAgcm9vbS5wb3NpdGlvbi55ID0gMztcclxuICAgICAgc2NlbmUuYWRkKCByb29tICk7XHJcblxyXG4gICAgICBzY2VuZS5hZGQoIG5ldyBUSFJFRS5IZW1pc3BoZXJlTGlnaHQoIDB4NjA2MDYwLCAweDQwNDA0MCApICk7XHJcblxyXG4gICAgICBsZXQgbGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCggMHhmZmZmZmYgKTtcclxuICAgICAgbGlnaHQucG9zaXRpb24uc2V0KCAxLCAxLCAxICkubm9ybWFsaXplKCk7XHJcbiAgICAgIHNjZW5lLmFkZCggbGlnaHQgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCB7IGFudGlhbGlhczogYW50aUFsaWFzIH0gKTtcclxuICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IoIDB4NTA1MDUwICk7XHJcbiAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKCB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyApO1xyXG4gICAgcmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xyXG4gICAgcmVuZGVyZXIuc29ydE9iamVjdHMgPSBmYWxzZTtcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCggcmVuZGVyZXIuZG9tRWxlbWVudCApO1xyXG5cclxuICAgIGNvbnN0IGNvbnRyb2xzID0gbmV3IFRIUkVFLlZSQ29udHJvbHMoIGNhbWVyYSApO1xyXG4gICAgY29udHJvbHMuc3RhbmRpbmcgPSBzdGFuZGluZztcclxuXHJcblxyXG4gICAgY29uc3QgY29udHJvbGxlcjEgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgIGNvbnN0IGNvbnRyb2xsZXIyID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICBzY2VuZS5hZGQoIGNvbnRyb2xsZXIxLCBjb250cm9sbGVyMiApO1xyXG5cclxuICAgIGxldCBjMSwgYzI7XHJcblxyXG4gICAgaWYoIGxvYWRDb250cm9sbGVycyApe1xyXG4gICAgICBjMSA9IG5ldyBUSFJFRS5WaXZlQ29udHJvbGxlciggMCApO1xyXG4gICAgICBjMS5zdGFuZGluZ01hdHJpeCA9IGNvbnRyb2xzLmdldFN0YW5kaW5nTWF0cml4KCk7XHJcbiAgICAgIGNvbnRyb2xsZXIxLmFkZCggYzEgKTtcclxuXHJcbiAgICAgIGMyID0gbmV3IFRIUkVFLlZpdmVDb250cm9sbGVyKCAxICk7XHJcbiAgICAgIGMyLnN0YW5kaW5nTWF0cml4ID0gY29udHJvbHMuZ2V0U3RhbmRpbmdNYXRyaXgoKTtcclxuICAgICAgY29udHJvbGxlcjIuYWRkKCBjMiApO1xyXG5cclxuICAgICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5PQkpMb2FkZXIoKTtcclxuICAgICAgbG9hZGVyLnNldFBhdGgoIHBhdGhUb0NvbnRyb2xsZXJzICk7XHJcbiAgICAgIGxvYWRlci5sb2FkKCBjb250cm9sbGVyTW9kZWxOYW1lLCBmdW5jdGlvbiAoIG9iamVjdCApIHtcclxuXHJcbiAgICAgICAgdmFyIHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xyXG4gICAgICAgIHRleHR1cmVMb2FkZXIuc2V0UGF0aCggcGF0aFRvQ29udHJvbGxlcnMgKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBvYmplY3QuY2hpbGRyZW5bIDAgXTtcclxuICAgICAgICBjb250cm9sbGVyLm1hdGVyaWFsLm1hcCA9IHRleHR1cmVMb2FkZXIubG9hZCggY29udHJvbGxlclRleHR1cmVNYXAgKTtcclxuICAgICAgICBjb250cm9sbGVyLm1hdGVyaWFsLnNwZWN1bGFyTWFwID0gdGV4dHVyZUxvYWRlci5sb2FkKCBjb250cm9sbGVyU3BlY01hcCApO1xyXG5cclxuICAgICAgICBjMS5hZGQoIG9iamVjdC5jbG9uZSgpICk7XHJcbiAgICAgICAgYzIuYWRkKCBvYmplY3QuY2xvbmUoKSApO1xyXG5cclxuICAgICAgfSApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVmZmVjdCA9IG5ldyBUSFJFRS5WUkVmZmVjdCggcmVuZGVyZXIgKTtcclxuXHJcbiAgICBpZiAoIFdFQlZSLmlzQXZhaWxhYmxlKCkgPT09IHRydWUgKSB7XHJcbiAgICAgIGlmKCB2ckJ1dHRvbiApe1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIFdFQlZSLmdldEJ1dHRvbiggZWZmZWN0ICkgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoIGF1dG9FbnRlciApe1xyXG4gICAgICAgIHNldFRpbWVvdXQoICgpPT5lZmZlY3QucmVxdWVzdFByZXNlbnQoKSwgMTAwMCApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBmdW5jdGlvbigpe1xyXG4gICAgICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcbiAgICAgIGVmZmVjdC5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XHJcblxyXG4gICAgICBldmVudHMuZW1pdCggJ3Jlc2l6ZScsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcclxuICAgIH0sIGZhbHNlICk7XHJcblxyXG5cclxuICAgIGNvbnN0IGNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XHJcbiAgICBjbG9jay5zdGFydCgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XHJcbiAgICAgIGNvbnN0IGR0ID0gY2xvY2suZ2V0RGVsdGEoKTtcclxuXHJcbiAgICAgIGVmZmVjdC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGFuaW1hdGUgKTtcclxuXHJcbiAgICAgIGNvbnRyb2xzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgZXZlbnRzLmVtaXQoICd0aWNrJywgIGR0ICk7XHJcblxyXG4gICAgICByZW5kZXIoKTtcclxuXHJcbiAgICAgIGV2ZW50cy5lbWl0KCAncmVuZGVyJywgZHQgKVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgICAgZWZmZWN0LnJlbmRlciggc2NlbmUsIGNhbWVyYSApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvZ2dsZVZSKCl7XHJcbiAgICAgIGVmZmVjdC5pc1ByZXNlbnRpbmcgPyBlZmZlY3QuZXhpdFByZXNlbnQoKSA6IGVmZmVjdC5yZXF1ZXN0UHJlc2VudCgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhbmltYXRlKCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2NlbmUsIGNhbWVyYSwgY29udHJvbHMsIHJlbmRlcmVyLFxyXG4gICAgICBjb250cm9sbGVyTW9kZWxzOiBbIGMxLCBjMiBdLFxyXG4gICAgICBldmVudHMsXHJcbiAgICAgIHRvZ2dsZVZSXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCIvKipcclxuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbS9cclxuICovXHJcblxyXG5USFJFRS5PQkpMb2FkZXIgPSBmdW5jdGlvbiAoIG1hbmFnZXIgKSB7XHJcblxyXG4gIHRoaXMubWFuYWdlciA9ICggbWFuYWdlciAhPT0gdW5kZWZpbmVkICkgPyBtYW5hZ2VyIDogVEhSRUUuRGVmYXVsdExvYWRpbmdNYW5hZ2VyO1xyXG5cclxuICB0aGlzLm1hdGVyaWFscyA9IG51bGw7XHJcblxyXG4gIHRoaXMucmVnZXhwID0ge1xyXG4gICAgLy8gdiBmbG9hdCBmbG9hdCBmbG9hdFxyXG4gICAgdmVydGV4X3BhdHRlcm4gICAgICAgICAgIDogL152XFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKVxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKylcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspLyxcclxuICAgIC8vIHZuIGZsb2F0IGZsb2F0IGZsb2F0XHJcbiAgICBub3JtYWxfcGF0dGVybiAgICAgICAgICAgOiAvXnZuXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKVxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKylcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspLyxcclxuICAgIC8vIHZ0IGZsb2F0IGZsb2F0XHJcbiAgICB1dl9wYXR0ZXJuICAgICAgICAgICAgICAgOiAvXnZ0XFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKVxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKykvLFxyXG4gICAgLy8gZiB2ZXJ0ZXggdmVydGV4IHZlcnRleFxyXG4gICAgZmFjZV92ZXJ0ZXggICAgICAgICAgICAgIDogL15mXFxzKygtP1xcZCspXFxzKygtP1xcZCspXFxzKygtP1xcZCspKD86XFxzKygtP1xcZCspKT8vLFxyXG4gICAgLy8gZiB2ZXJ0ZXgvdXYgdmVydGV4L3V2IHZlcnRleC91dlxyXG4gICAgZmFjZV92ZXJ0ZXhfdXYgICAgICAgICAgIDogL15mXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspKD86XFxzKygtP1xcZCspXFwvKC0/XFxkKykpPy8sXHJcbiAgICAvLyBmIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsXHJcbiAgICBmYWNlX3ZlcnRleF91dl9ub3JtYWwgICAgOiAvXmZcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKT8vLFxyXG4gICAgLy8gZiB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbFxyXG4gICAgZmFjZV92ZXJ0ZXhfbm9ybWFsICAgICAgIDogL15mXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspKD86XFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKykpPy8sXHJcbiAgICAvLyBvIG9iamVjdF9uYW1lIHwgZyBncm91cF9uYW1lXHJcbiAgICBvYmplY3RfcGF0dGVybiAgICAgICAgICAgOiAvXltvZ11cXHMqKC4rKT8vLFxyXG4gICAgLy8gcyBib29sZWFuXHJcbiAgICBzbW9vdGhpbmdfcGF0dGVybiAgICAgICAgOiAvXnNcXHMrKFxcZCt8b258b2ZmKS8sXHJcbiAgICAvLyBtdGxsaWIgZmlsZV9yZWZlcmVuY2VcclxuICAgIG1hdGVyaWFsX2xpYnJhcnlfcGF0dGVybiA6IC9ebXRsbGliIC8sXHJcbiAgICAvLyB1c2VtdGwgbWF0ZXJpYWxfbmFtZVxyXG4gICAgbWF0ZXJpYWxfdXNlX3BhdHRlcm4gICAgIDogL151c2VtdGwgL1xyXG4gIH07XHJcblxyXG59O1xyXG5cclxuVEhSRUUuT0JKTG9hZGVyLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgY29uc3RydWN0b3I6IFRIUkVFLk9CSkxvYWRlcixcclxuXHJcbiAgbG9hZDogZnVuY3Rpb24gKCB1cmwsIG9uTG9hZCwgb25Qcm9ncmVzcywgb25FcnJvciApIHtcclxuXHJcbiAgICB2YXIgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuWEhSTG9hZGVyKCBzY29wZS5tYW5hZ2VyICk7XHJcbiAgICBsb2FkZXIuc2V0UGF0aCggdGhpcy5wYXRoICk7XHJcbiAgICBsb2FkZXIubG9hZCggdXJsLCBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblxyXG4gICAgICBvbkxvYWQoIHNjb3BlLnBhcnNlKCB0ZXh0ICkgKTtcclxuXHJcbiAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yICk7XHJcblxyXG4gIH0sXHJcblxyXG4gIHNldFBhdGg6IGZ1bmN0aW9uICggdmFsdWUgKSB7XHJcblxyXG4gICAgdGhpcy5wYXRoID0gdmFsdWU7XHJcblxyXG4gIH0sXHJcblxyXG4gIHNldE1hdGVyaWFsczogZnVuY3Rpb24gKCBtYXRlcmlhbHMgKSB7XHJcblxyXG4gICAgdGhpcy5tYXRlcmlhbHMgPSBtYXRlcmlhbHM7XHJcblxyXG4gIH0sXHJcblxyXG4gIF9jcmVhdGVQYXJzZXJTdGF0ZSA6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB2YXIgc3RhdGUgPSB7XHJcbiAgICAgIG9iamVjdHMgIDogW10sXHJcbiAgICAgIG9iamVjdCAgIDoge30sXHJcblxyXG4gICAgICB2ZXJ0aWNlcyA6IFtdLFxyXG4gICAgICBub3JtYWxzICA6IFtdLFxyXG4gICAgICB1dnMgICAgICA6IFtdLFxyXG5cclxuICAgICAgbWF0ZXJpYWxMaWJyYXJpZXMgOiBbXSxcclxuXHJcbiAgICAgIHN0YXJ0T2JqZWN0OiBmdW5jdGlvbiAoIG5hbWUsIGZyb21EZWNsYXJhdGlvbiApIHtcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgb2JqZWN0IChpbml0aWFsIGZyb20gcmVzZXQpIGlzIG5vdCBmcm9tIGEgZy9vIGRlY2xhcmF0aW9uIGluIHRoZSBwYXJzZWRcclxuICAgICAgICAvLyBmaWxlLiBXZSBuZWVkIHRvIHVzZSBpdCBmb3IgdGhlIGZpcnN0IHBhcnNlZCBnL28gdG8ga2VlcCB0aGluZ3MgaW4gc3luYy5cclxuICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHRoaXMub2JqZWN0LmZyb21EZWNsYXJhdGlvbiA9PT0gZmFsc2UgKSB7XHJcblxyXG4gICAgICAgICAgdGhpcy5vYmplY3QubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5mcm9tRGVjbGFyYXRpb24gPSAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKTtcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5fZmluYWxpemUgPT09ICdmdW5jdGlvbicgKSB7XHJcblxyXG4gICAgICAgICAgdGhpcy5vYmplY3QuX2ZpbmFsaXplKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHByZXZpb3VzTWF0ZXJpYWwgPSAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5jdXJyZW50TWF0ZXJpYWwgPT09ICdmdW5jdGlvbicgPyB0aGlzLm9iamVjdC5jdXJyZW50TWF0ZXJpYWwoKSA6IHVuZGVmaW5lZCApO1xyXG5cclxuICAgICAgICB0aGlzLm9iamVjdCA9IHtcclxuICAgICAgICAgIG5hbWUgOiBuYW1lIHx8ICcnLFxyXG4gICAgICAgICAgZnJvbURlY2xhcmF0aW9uIDogKCBmcm9tRGVjbGFyYXRpb24gIT09IGZhbHNlICksXHJcblxyXG4gICAgICAgICAgZ2VvbWV0cnkgOiB7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgICAgICAgIG5vcm1hbHMgIDogW10sXHJcbiAgICAgICAgICAgIHV2cyAgICAgIDogW11cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtYXRlcmlhbHMgOiBbXSxcclxuICAgICAgICAgIHNtb290aCA6IHRydWUsXHJcblxyXG4gICAgICAgICAgc3RhcnRNYXRlcmlhbCA6IGZ1bmN0aW9uKCBuYW1lLCBsaWJyYXJpZXMgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgcHJldmlvdXMgPSB0aGlzLl9maW5hbGl6ZSggZmFsc2UgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE5ldyB1c2VtdGwgZGVjbGFyYXRpb24gb3ZlcndyaXRlcyBhbiBpbmhlcml0ZWQgbWF0ZXJpYWwsIGV4Y2VwdCBpZiBmYWNlcyB3ZXJlIGRlY2xhcmVkXHJcbiAgICAgICAgICAgIC8vIGFmdGVyIHRoZSBtYXRlcmlhbCwgdGhlbiBpdCBtdXN0IGJlIHByZXNlcnZlZCBmb3IgcHJvcGVyIE11bHRpTWF0ZXJpYWwgY29udGludWF0aW9uLlxyXG4gICAgICAgICAgICBpZiAoIHByZXZpb3VzICYmICggcHJldmlvdXMuaW5oZXJpdGVkIHx8IHByZXZpb3VzLmdyb3VwQ291bnQgPD0gMCApICkge1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5zcGxpY2UoIHByZXZpb3VzLmluZGV4LCAxICk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSB7XHJcbiAgICAgICAgICAgICAgaW5kZXggICAgICA6IHRoaXMubWF0ZXJpYWxzLmxlbmd0aCxcclxuICAgICAgICAgICAgICBuYW1lICAgICAgIDogbmFtZSB8fCAnJyxcclxuICAgICAgICAgICAgICBtdGxsaWIgICAgIDogKCBBcnJheS5pc0FycmF5KCBsaWJyYXJpZXMgKSAmJiBsaWJyYXJpZXMubGVuZ3RoID4gMCA/IGxpYnJhcmllc1sgbGlicmFyaWVzLmxlbmd0aCAtIDEgXSA6ICcnICksXHJcbiAgICAgICAgICAgICAgc21vb3RoICAgICA6ICggcHJldmlvdXMgIT09IHVuZGVmaW5lZCA/IHByZXZpb3VzLnNtb290aCA6IHRoaXMuc21vb3RoICksXHJcbiAgICAgICAgICAgICAgZ3JvdXBTdGFydCA6ICggcHJldmlvdXMgIT09IHVuZGVmaW5lZCA/IHByZXZpb3VzLmdyb3VwRW5kIDogMCApLFxyXG4gICAgICAgICAgICAgIGdyb3VwRW5kICAgOiAtMSxcclxuICAgICAgICAgICAgICBncm91cENvdW50IDogLTEsXHJcbiAgICAgICAgICAgICAgaW5oZXJpdGVkICA6IGZhbHNlLFxyXG5cclxuICAgICAgICAgICAgICBjbG9uZSA6IGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgIGluZGV4ICAgICAgOiAoIHR5cGVvZiBpbmRleCA9PT0gJ251bWJlcicgPyBpbmRleCA6IHRoaXMuaW5kZXggKSxcclxuICAgICAgICAgICAgICAgICAgbmFtZSAgICAgICA6IHRoaXMubmFtZSxcclxuICAgICAgICAgICAgICAgICAgbXRsbGliICAgICA6IHRoaXMubXRsbGliLFxyXG4gICAgICAgICAgICAgICAgICBzbW9vdGggICAgIDogdGhpcy5zbW9vdGgsXHJcbiAgICAgICAgICAgICAgICAgIGdyb3VwU3RhcnQgOiB0aGlzLmdyb3VwRW5kLFxyXG4gICAgICAgICAgICAgICAgICBncm91cEVuZCAgIDogLTEsXHJcbiAgICAgICAgICAgICAgICAgIGdyb3VwQ291bnQgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgaW5oZXJpdGVkICA6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnB1c2goIG1hdGVyaWFsICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICBjdXJyZW50TWF0ZXJpYWwgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRlcmlhbHNbIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCAtIDEgXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgIF9maW5hbGl6ZSA6IGZ1bmN0aW9uKCBlbmQgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGFzdE11bHRpTWF0ZXJpYWwgPSB0aGlzLmN1cnJlbnRNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICBpZiAoIGxhc3RNdWx0aU1hdGVyaWFsICYmIGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwRW5kID09PSAtMSApIHtcclxuXHJcbiAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgPSB0aGlzLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aCAvIDM7XHJcbiAgICAgICAgICAgICAgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBDb3VudCA9IGxhc3RNdWx0aU1hdGVyaWFsLmdyb3VwRW5kIC0gbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBTdGFydDtcclxuICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5pbmhlcml0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEd1YXJhbnRlZSBhdCBsZWFzdCBvbmUgZW1wdHkgbWF0ZXJpYWwsIHRoaXMgbWFrZXMgdGhlIGNyZWF0aW9uIGxhdGVyIG1vcmUgc3RyYWlnaHQgZm9yd2FyZC5cclxuICAgICAgICAgICAgaWYgKCBlbmQgIT09IGZhbHNlICYmIHRoaXMubWF0ZXJpYWxzLmxlbmd0aCA9PT0gMCApIHtcclxuICAgICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIG5hbWUgICA6ICcnLFxyXG4gICAgICAgICAgICAgICAgc21vb3RoIDogdGhpcy5zbW9vdGhcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGxhc3RNdWx0aU1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBJbmhlcml0IHByZXZpb3VzIG9iamVjdHMgbWF0ZXJpYWwuXHJcbiAgICAgICAgLy8gU3BlYyB0ZWxscyB1cyB0aGF0IGEgZGVjbGFyZWQgbWF0ZXJpYWwgbXVzdCBiZSBzZXQgdG8gYWxsIG9iamVjdHMgdW50aWwgYSBuZXcgbWF0ZXJpYWwgaXMgZGVjbGFyZWQuXHJcbiAgICAgICAgLy8gSWYgYSB1c2VtdGwgZGVjbGFyYXRpb24gaXMgZW5jb3VudGVyZWQgd2hpbGUgdGhpcyBuZXcgb2JqZWN0IGlzIGJlaW5nIHBhcnNlZCwgaXQgd2lsbFxyXG4gICAgICAgIC8vIG92ZXJ3cml0ZSB0aGUgaW5oZXJpdGVkIG1hdGVyaWFsLiBFeGNlcHRpb24gYmVpbmcgdGhhdCB0aGVyZSB3YXMgYWxyZWFkeSBmYWNlIGRlY2xhcmF0aW9uc1xyXG4gICAgICAgIC8vIHRvIHRoZSBpbmhlcml0ZWQgbWF0ZXJpYWwsIHRoZW4gaXQgd2lsbCBiZSBwcmVzZXJ2ZWQgZm9yIHByb3BlciBNdWx0aU1hdGVyaWFsIGNvbnRpbnVhdGlvbi5cclxuXHJcbiAgICAgICAgaWYgKCBwcmV2aW91c01hdGVyaWFsICYmIHByZXZpb3VzTWF0ZXJpYWwubmFtZSAmJiB0eXBlb2YgcHJldmlvdXNNYXRlcmlhbC5jbG9uZSA9PT0gXCJmdW5jdGlvblwiICkge1xyXG5cclxuICAgICAgICAgIHZhciBkZWNsYXJlZCA9IHByZXZpb3VzTWF0ZXJpYWwuY2xvbmUoIDAgKTtcclxuICAgICAgICAgIGRlY2xhcmVkLmluaGVyaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5tYXRlcmlhbHMucHVzaCggZGVjbGFyZWQgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm9iamVjdHMucHVzaCggdGhpcy5vYmplY3QgKTtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmaW5hbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBpZiAoIHRoaXMub2JqZWN0ICYmIHR5cGVvZiB0aGlzLm9iamVjdC5fZmluYWxpemUgPT09ICdmdW5jdGlvbicgKSB7XHJcblxyXG4gICAgICAgICAgdGhpcy5vYmplY3QuX2ZpbmFsaXplKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwYXJzZVZlcnRleEluZGV4OiBmdW5jdGlvbiAoIHZhbHVlLCBsZW4gKSB7XHJcblxyXG4gICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICByZXR1cm4gKCBpbmRleCA+PSAwID8gaW5kZXggLSAxIDogaW5kZXggKyBsZW4gLyAzICkgKiAzO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHBhcnNlTm9ybWFsSW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFyc2VVVkluZGV4OiBmdW5jdGlvbiAoIHZhbHVlLCBsZW4gKSB7XHJcblxyXG4gICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCB2YWx1ZSwgMTAgKTtcclxuICAgICAgICByZXR1cm4gKCBpbmRleCA+PSAwID8gaW5kZXggLSAxIDogaW5kZXggKyBsZW4gLyAyICkgKiAyO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZFZlcnRleDogZnVuY3Rpb24gKCBhLCBiLCBjICkge1xyXG5cclxuICAgICAgICB2YXIgc3JjID0gdGhpcy52ZXJ0aWNlcztcclxuICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudmVydGljZXM7XHJcblxyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDIgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDIgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDIgXSApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZFZlcnRleExpbmU6IGZ1bmN0aW9uICggYSApIHtcclxuXHJcbiAgICAgICAgdmFyIHNyYyA9IHRoaXMudmVydGljZXM7XHJcbiAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnZlcnRpY2VzO1xyXG5cclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAyIF0gKTtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGROb3JtYWwgOiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgIHZhciBzcmMgPSB0aGlzLm5vcm1hbHM7XHJcbiAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5Lm5vcm1hbHM7XHJcblxyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDIgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDIgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDIgXSApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZFVWOiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgIHZhciBzcmMgPSB0aGlzLnV2cztcclxuICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudXZzO1xyXG5cclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDEgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGRVVkxpbmU6IGZ1bmN0aW9uICggYSApIHtcclxuXHJcbiAgICAgICAgdmFyIHNyYyA9IHRoaXMudXZzO1xyXG4gICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkRmFjZTogZnVuY3Rpb24gKCBhLCBiLCBjLCBkLCB1YSwgdWIsIHVjLCB1ZCwgbmEsIG5iLCBuYywgbmQgKSB7XHJcblxyXG4gICAgICAgIHZhciB2TGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHZhciBpYSA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYSwgdkxlbiApO1xyXG4gICAgICAgIHZhciBpYiA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYiwgdkxlbiApO1xyXG4gICAgICAgIHZhciBpYyA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggYywgdkxlbiApO1xyXG4gICAgICAgIHZhciBpZDtcclxuXHJcbiAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICBpZCA9IHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggZCwgdkxlbiApO1xyXG5cclxuICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYSwgaWIsIGlkICk7XHJcbiAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggdWEgIT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICB2YXIgdXZMZW4gPSB0aGlzLnV2cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgaWEgPSB0aGlzLnBhcnNlVVZJbmRleCggdWEsIHV2TGVuICk7XHJcbiAgICAgICAgICBpYiA9IHRoaXMucGFyc2VVVkluZGV4KCB1YiwgdXZMZW4gKTtcclxuICAgICAgICAgIGljID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVjLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRVViggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBpZCA9IHRoaXMucGFyc2VVVkluZGV4KCB1ZCwgdXZMZW4gKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkVVYoIGlhLCBpYiwgaWQgKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRVViggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIG5hICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgLy8gTm9ybWFscyBhcmUgbWFueSB0aW1lcyB0aGUgc2FtZS4gSWYgc28sIHNraXAgZnVuY3Rpb24gY2FsbCBhbmQgcGFyc2VJbnQuXHJcbiAgICAgICAgICB2YXIgbkxlbiA9IHRoaXMubm9ybWFscy5sZW5ndGg7XHJcbiAgICAgICAgICBpYSA9IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmEsIG5MZW4gKTtcclxuXHJcbiAgICAgICAgICBpYiA9IG5hID09PSBuYiA/IGlhIDogdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYiwgbkxlbiApO1xyXG4gICAgICAgICAgaWMgPSBuYSA9PT0gbmMgPyBpYSA6IHRoaXMucGFyc2VOb3JtYWxJbmRleCggbmMsIG5MZW4gKTtcclxuXHJcbiAgICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkTm9ybWFsKCBpYSwgaWIsIGljICk7XHJcblxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuZCwgbkxlbiApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGlhLCBpYiwgaWQgKTtcclxuICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGliLCBpYywgaWQgKTtcclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGRMaW5lR2VvbWV0cnk6IGZ1bmN0aW9uICggdmVydGljZXMsIHV2cyApIHtcclxuXHJcbiAgICAgICAgdGhpcy5vYmplY3QuZ2VvbWV0cnkudHlwZSA9ICdMaW5lJztcclxuXHJcbiAgICAgICAgdmFyIHZMZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuICAgICAgICB2YXIgdXZMZW4gPSB0aGlzLnV2cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAoIHZhciB2aSA9IDAsIGwgPSB2ZXJ0aWNlcy5sZW5ndGg7IHZpIDwgbDsgdmkgKysgKSB7XHJcblxyXG4gICAgICAgICAgdGhpcy5hZGRWZXJ0ZXhMaW5lKCB0aGlzLnBhcnNlVmVydGV4SW5kZXgoIHZlcnRpY2VzWyB2aSBdLCB2TGVuICkgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKCB2YXIgdXZpID0gMCwgbCA9IHV2cy5sZW5ndGg7IHV2aSA8IGw7IHV2aSArKyApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLmFkZFVWTGluZSggdGhpcy5wYXJzZVVWSW5kZXgoIHV2c1sgdXZpIF0sIHV2TGVuICkgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgc3RhdGUuc3RhcnRPYmplY3QoICcnLCBmYWxzZSApO1xyXG5cclxuICAgIHJldHVybiBzdGF0ZTtcclxuXHJcbiAgfSxcclxuXHJcbiAgcGFyc2U6IGZ1bmN0aW9uICggdGV4dCApIHtcclxuXHJcbiAgICBjb25zb2xlLnRpbWUoICdPQkpMb2FkZXInICk7XHJcblxyXG4gICAgdmFyIHN0YXRlID0gdGhpcy5fY3JlYXRlUGFyc2VyU3RhdGUoKTtcclxuXHJcbiAgICBpZiAoIHRleHQuaW5kZXhPZiggJ1xcclxcbicgKSAhPT0gLSAxICkge1xyXG5cclxuICAgICAgLy8gVGhpcyBpcyBmYXN0ZXIgdGhhbiBTdHJpbmcuc3BsaXQgd2l0aCByZWdleCB0aGF0IHNwbGl0cyBvbiBib3RoXHJcbiAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoICdcXHJcXG4nLCAnXFxuJyApO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGluZXMgPSB0ZXh0LnNwbGl0KCAnXFxuJyApO1xyXG4gICAgdmFyIGxpbmUgPSAnJywgbGluZUZpcnN0Q2hhciA9ICcnLCBsaW5lU2Vjb25kQ2hhciA9ICcnO1xyXG4gICAgdmFyIGxpbmVMZW5ndGggPSAwO1xyXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIC8vIEZhc3RlciB0byBqdXN0IHRyaW0gbGVmdCBzaWRlIG9mIHRoZSBsaW5lLiBVc2UgaWYgYXZhaWxhYmxlLlxyXG4gICAgdmFyIHRyaW1MZWZ0ID0gKCB0eXBlb2YgJycudHJpbUxlZnQgPT09ICdmdW5jdGlvbicgKTtcclxuXHJcbiAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgbGluZSA9IGxpbmVzWyBpIF07XHJcblxyXG4gICAgICBsaW5lID0gdHJpbUxlZnQgPyBsaW5lLnRyaW1MZWZ0KCkgOiBsaW5lLnRyaW0oKTtcclxuXHJcbiAgICAgIGxpbmVMZW5ndGggPSBsaW5lLmxlbmd0aDtcclxuXHJcbiAgICAgIGlmICggbGluZUxlbmd0aCA9PT0gMCApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgbGluZUZpcnN0Q2hhciA9IGxpbmUuY2hhckF0KCAwICk7XHJcblxyXG4gICAgICAvLyBAdG9kbyBpbnZva2UgcGFzc2VkIGluIGhhbmRsZXIgaWYgYW55XHJcbiAgICAgIGlmICggbGluZUZpcnN0Q2hhciA9PT0gJyMnICkgY29udGludWU7XHJcblxyXG4gICAgICBpZiAoIGxpbmVGaXJzdENoYXIgPT09ICd2JyApIHtcclxuXHJcbiAgICAgICAgbGluZVNlY29uZENoYXIgPSBsaW5lLmNoYXJBdCggMSApO1xyXG5cclxuICAgICAgICBpZiAoIGxpbmVTZWNvbmRDaGFyID09PSAnICcgJiYgKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC52ZXJ0ZXhfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAgIDIgICAgICAzXHJcbiAgICAgICAgICAvLyBbXCJ2IDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcblxyXG4gICAgICAgICAgc3RhdGUudmVydGljZXMucHVzaChcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICduJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm5vcm1hbF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAgMSAgICAgIDIgICAgICAzXHJcbiAgICAgICAgICAvLyBbXCJ2biAxLjAgMi4wIDMuMFwiLCBcIjEuMFwiLCBcIjIuMFwiLCBcIjMuMFwiXVxyXG5cclxuICAgICAgICAgIHN0YXRlLm5vcm1hbHMucHVzaChcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKSxcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAzIF0gKVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggbGluZVNlY29uZENoYXIgPT09ICd0JyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnV2X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgIDEgICAgICAyXHJcbiAgICAgICAgICAvLyBbXCJ2dCAwLjEgMC4yXCIsIFwiMC4xXCIsIFwiMC4yXCJdXHJcblxyXG4gICAgICAgICAgc3RhdGUudXZzLnB1c2goXHJcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMSBdICksXHJcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoIHJlc3VsdFsgMiBdIClcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIlVuZXhwZWN0ZWQgdmVydGV4L25vcm1hbC91diBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwiZlwiICkge1xyXG5cclxuICAgICAgICBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfdXZfbm9ybWFsLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAgICAgICAxICAgIDIgICAgMyAgICA0ICAgIDUgICAgNiAgICA3ICAgIDggICAgOSAgIDEwICAgICAgICAgMTEgICAgICAgICAxMlxyXG4gICAgICAgICAgLy8gW1wiZiAxLzEvMSAyLzIvMiAzLzMvM1wiLCBcIjFcIiwgXCIxXCIsIFwiMVwiLCBcIjJcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDQgXSwgcmVzdWx0WyA3IF0sIHJlc3VsdFsgMTAgXSxcclxuICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNSBdLCByZXN1bHRbIDggXSwgcmVzdWx0WyAxMSBdLFxyXG4gICAgICAgICAgICByZXN1bHRbIDMgXSwgcmVzdWx0WyA2IF0sIHJlc3VsdFsgOSBdLCByZXN1bHRbIDEyIF1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXhfdXYuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYgdmVydGV4L3V2IHZlcnRleC91dlxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgIDEgICAgMiAgICAzICAgIDQgICAgNSAgICA2ICAgNyAgICAgICAgICA4XHJcbiAgICAgICAgICAvLyBbXCJmIDEvMSAyLzIgMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgNyBdLFxyXG4gICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA0IF0sIHJlc3VsdFsgNiBdLCByZXN1bHRbIDggXVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gZiB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbFxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAgIDEgICAgMiAgICAzICAgIDQgICAgNSAgICA2ICAgNyAgICAgICAgICA4XHJcbiAgICAgICAgICAvLyBbXCJmIDEvLzEgMi8vMiAzLy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIyXCIsIFwiMlwiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgNyBdLFxyXG4gICAgICAgICAgICB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMiBdLCByZXN1bHRbIDQgXSwgcmVzdWx0WyA2IF0sIHJlc3VsdFsgOCBdXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLmZhY2VfdmVydGV4LmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIC8vIGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXhcclxuICAgICAgICAgIC8vIDAgICAgICAgICAgICAxICAgIDIgICAgMyAgIDRcclxuICAgICAgICAgIC8vIFtcImYgMSAyIDNcIiwgXCIxXCIsIFwiMlwiLCBcIjNcIiwgdW5kZWZpbmVkXVxyXG5cclxuICAgICAgICAgIHN0YXRlLmFkZEZhY2UoXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMSBdLCByZXN1bHRbIDIgXSwgcmVzdWx0WyAzIF0sIHJlc3VsdFsgNCBdXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIGZhY2UgbGluZTogJ1wiICsgbGluZSAgKyBcIidcIiApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCBsaW5lRmlyc3RDaGFyID09PSBcImxcIiApIHtcclxuXHJcbiAgICAgICAgdmFyIGxpbmVQYXJ0cyA9IGxpbmUuc3Vic3RyaW5nKCAxICkudHJpbSgpLnNwbGl0KCBcIiBcIiApO1xyXG4gICAgICAgIHZhciBsaW5lVmVydGljZXMgPSBbXSwgbGluZVVWcyA9IFtdO1xyXG5cclxuICAgICAgICBpZiAoIGxpbmUuaW5kZXhPZiggXCIvXCIgKSA9PT0gLSAxICkge1xyXG5cclxuICAgICAgICAgIGxpbmVWZXJ0aWNlcyA9IGxpbmVQYXJ0cztcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICBmb3IgKCB2YXIgbGkgPSAwLCBsbGVuID0gbGluZVBhcnRzLmxlbmd0aDsgbGkgPCBsbGVuOyBsaSArKyApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IGxpbmVQYXJ0c1sgbGkgXS5zcGxpdCggXCIvXCIgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggcGFydHNbIDAgXSAhPT0gXCJcIiApIGxpbmVWZXJ0aWNlcy5wdXNoKCBwYXJ0c1sgMCBdICk7XHJcbiAgICAgICAgICAgIGlmICggcGFydHNbIDEgXSAhPT0gXCJcIiApIGxpbmVVVnMucHVzaCggcGFydHNbIDEgXSApO1xyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0YXRlLmFkZExpbmVHZW9tZXRyeSggbGluZVZlcnRpY2VzLCBsaW5lVVZzICk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLm9iamVjdF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAvLyBvIG9iamVjdF9uYW1lXHJcbiAgICAgICAgLy8gb3JcclxuICAgICAgICAvLyBnIGdyb3VwX25hbWVcclxuXHJcbiAgICAgICAgdmFyIG5hbWUgPSByZXN1bHRbIDAgXS5zdWJzdHIoIDEgKS50cmltKCk7XHJcbiAgICAgICAgc3RhdGUuc3RhcnRPYmplY3QoIG5hbWUgKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoIHRoaXMucmVnZXhwLm1hdGVyaWFsX3VzZV9wYXR0ZXJuLnRlc3QoIGxpbmUgKSApIHtcclxuXHJcbiAgICAgICAgLy8gbWF0ZXJpYWxcclxuXHJcbiAgICAgICAgc3RhdGUub2JqZWN0LnN0YXJ0TWF0ZXJpYWwoIGxpbmUuc3Vic3RyaW5nKCA3ICkudHJpbSgpLCBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcyApO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggdGhpcy5yZWdleHAubWF0ZXJpYWxfbGlicmFyeV9wYXR0ZXJuLnRlc3QoIGxpbmUgKSApIHtcclxuXHJcbiAgICAgICAgLy8gbXRsIGZpbGVcclxuXHJcbiAgICAgICAgc3RhdGUubWF0ZXJpYWxMaWJyYXJpZXMucHVzaCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCkgKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuc21vb3RoaW5nX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgIC8vIHNtb290aCBzaGFkaW5nXHJcblxyXG4gICAgICAgIC8vIEB0b2RvIEhhbmRsZSBmaWxlcyB0aGF0IGhhdmUgdmFyeWluZyBzbW9vdGggdmFsdWVzIGZvciBhIHNldCBvZiBmYWNlcyBpbnNpZGUgb25lIGdlb21ldHJ5LFxyXG4gICAgICAgIC8vIGJ1dCBkb2VzIG5vdCBkZWZpbmUgYSB1c2VtdGwgZm9yIGVhY2ggZmFjZSBzZXQuXHJcbiAgICAgICAgLy8gVGhpcyBzaG91bGQgYmUgZGV0ZWN0ZWQgYW5kIGEgZHVtbXkgbWF0ZXJpYWwgY3JlYXRlZCAobGF0ZXIgTXVsdGlNYXRlcmlhbCBhbmQgZ2VvbWV0cnkgZ3JvdXBzKS5cclxuICAgICAgICAvLyBUaGlzIHJlcXVpcmVzIHNvbWUgY2FyZSB0byBub3QgY3JlYXRlIGV4dHJhIG1hdGVyaWFsIG9uIGVhY2ggc21vb3RoIHZhbHVlIGZvciBcIm5vcm1hbFwiIG9iaiBmaWxlcy5cclxuICAgICAgICAvLyB3aGVyZSBleHBsaWNpdCB1c2VtdGwgZGVmaW5lcyBnZW9tZXRyeSBncm91cHMuXHJcbiAgICAgICAgLy8gRXhhbXBsZSBhc3NldDogZXhhbXBsZXMvbW9kZWxzL29iai9jZXJiZXJ1cy9DZXJiZXJ1cy5vYmpcclxuXHJcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0WyAxIF0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgc3RhdGUub2JqZWN0LnNtb290aCA9ICggdmFsdWUgPT09ICcxJyB8fCB2YWx1ZSA9PT0gJ29uJyApO1xyXG5cclxuICAgICAgICB2YXIgbWF0ZXJpYWwgPSBzdGF0ZS5vYmplY3QuY3VycmVudE1hdGVyaWFsKCk7XHJcbiAgICAgICAgaWYgKCBtYXRlcmlhbCApIHtcclxuXHJcbiAgICAgICAgICBtYXRlcmlhbC5zbW9vdGggPSBzdGF0ZS5vYmplY3Quc21vb3RoO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBIYW5kbGUgbnVsbCB0ZXJtaW5hdGVkIGZpbGVzIHdpdGhvdXQgZXhjZXB0aW9uXHJcbiAgICAgICAgaWYgKCBsaW5lID09PSAnXFwwJyApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlLmZpbmFsaXplKCk7XHJcblxyXG4gICAgdmFyIGNvbnRhaW5lciA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgY29udGFpbmVyLm1hdGVyaWFsTGlicmFyaWVzID0gW10uY29uY2F0KCBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcyApO1xyXG5cclxuICAgIGZvciAoIHZhciBpID0gMCwgbCA9IHN0YXRlLm9iamVjdHMubGVuZ3RoOyBpIDwgbDsgaSArKyApIHtcclxuXHJcbiAgICAgIHZhciBvYmplY3QgPSBzdGF0ZS5vYmplY3RzWyBpIF07XHJcbiAgICAgIHZhciBnZW9tZXRyeSA9IG9iamVjdC5nZW9tZXRyeTtcclxuICAgICAgdmFyIG1hdGVyaWFscyA9IG9iamVjdC5tYXRlcmlhbHM7XHJcbiAgICAgIHZhciBpc0xpbmUgPSAoIGdlb21ldHJ5LnR5cGUgPT09ICdMaW5lJyApO1xyXG5cclxuICAgICAgLy8gU2tpcCBvL2cgbGluZSBkZWNsYXJhdGlvbnMgdGhhdCBkaWQgbm90IGZvbGxvdyB3aXRoIGFueSBmYWNlc1xyXG4gICAgICBpZiAoIGdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aCA9PT0gMCApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgdmFyIGJ1ZmZlcmdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XHJcblxyXG4gICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICdwb3NpdGlvbicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5LnZlcnRpY2VzICksIDMgKSApO1xyXG5cclxuICAgICAgaWYgKCBnZW9tZXRyeS5ub3JtYWxzLmxlbmd0aCA+IDAgKSB7XHJcblxyXG4gICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ25vcm1hbCcsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5Lm5vcm1hbHMgKSwgMyApICk7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBidWZmZXJnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCBnZW9tZXRyeS51dnMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCAndXYnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCBuZXcgRmxvYXQzMkFycmF5KCBnZW9tZXRyeS51dnMgKSwgMiApICk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDcmVhdGUgbWF0ZXJpYWxzXHJcblxyXG4gICAgICB2YXIgY3JlYXRlZE1hdGVyaWFscyA9IFtdO1xyXG5cclxuICAgICAgZm9yICggdmFyIG1pID0gMCwgbWlMZW4gPSBtYXRlcmlhbHMubGVuZ3RoOyBtaSA8IG1pTGVuIDsgbWkrKyApIHtcclxuXHJcbiAgICAgICAgdmFyIHNvdXJjZU1hdGVyaWFsID0gbWF0ZXJpYWxzW21pXTtcclxuICAgICAgICB2YXIgbWF0ZXJpYWwgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5tYXRlcmlhbHMgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgbWF0ZXJpYWwgPSB0aGlzLm1hdGVyaWFscy5jcmVhdGUoIHNvdXJjZU1hdGVyaWFsLm5hbWUgKTtcclxuXHJcbiAgICAgICAgICAvLyBtdGwgZXRjLiBsb2FkZXJzIHByb2JhYmx5IGNhbid0IGNyZWF0ZSBsaW5lIG1hdGVyaWFscyBjb3JyZWN0bHksIGNvcHkgcHJvcGVydGllcyB0byBhIGxpbmUgbWF0ZXJpYWwuXHJcbiAgICAgICAgICBpZiAoIGlzTGluZSAmJiBtYXRlcmlhbCAmJiAhICggbWF0ZXJpYWwgaW5zdGFuY2VvZiBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCApICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsTGluZSA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICBtYXRlcmlhbExpbmUuY29weSggbWF0ZXJpYWwgKTtcclxuICAgICAgICAgICAgbWF0ZXJpYWwgPSBtYXRlcmlhbExpbmU7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggISBtYXRlcmlhbCApIHtcclxuXHJcbiAgICAgICAgICBtYXRlcmlhbCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoKSA6IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCgpICk7XHJcbiAgICAgICAgICBtYXRlcmlhbC5uYW1lID0gc291cmNlTWF0ZXJpYWwubmFtZTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXRlcmlhbC5zaGFkaW5nID0gc291cmNlTWF0ZXJpYWwuc21vb3RoID8gVEhSRUUuU21vb3RoU2hhZGluZyA6IFRIUkVFLkZsYXRTaGFkaW5nO1xyXG5cclxuICAgICAgICBjcmVhdGVkTWF0ZXJpYWxzLnB1c2gobWF0ZXJpYWwpO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ3JlYXRlIG1lc2hcclxuXHJcbiAgICAgIHZhciBtZXNoO1xyXG5cclxuICAgICAgaWYgKCBjcmVhdGVkTWF0ZXJpYWxzLmxlbmd0aCA+IDEgKSB7XHJcblxyXG4gICAgICAgIGZvciAoIHZhciBtaSA9IDAsIG1pTGVuID0gbWF0ZXJpYWxzLmxlbmd0aDsgbWkgPCBtaUxlbiA7IG1pKysgKSB7XHJcblxyXG4gICAgICAgICAgdmFyIHNvdXJjZU1hdGVyaWFsID0gbWF0ZXJpYWxzW21pXTtcclxuICAgICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEdyb3VwKCBzb3VyY2VNYXRlcmlhbC5ncm91cFN0YXJ0LCBzb3VyY2VNYXRlcmlhbC5ncm91cENvdW50LCBtaSApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBtdWx0aU1hdGVyaWFsID0gbmV3IFRIUkVFLk11bHRpTWF0ZXJpYWwoIGNyZWF0ZWRNYXRlcmlhbHMgKTtcclxuICAgICAgICBtZXNoID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoKCBidWZmZXJnZW9tZXRyeSwgbXVsdGlNYXRlcmlhbCApIDogbmV3IFRIUkVFLkxpbmUoIGJ1ZmZlcmdlb21ldHJ5LCBtdWx0aU1hdGVyaWFsICkgKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIG1lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzWyAwIF0gKSA6IG5ldyBUSFJFRS5MaW5lKCBidWZmZXJnZW9tZXRyeSwgY3JlYXRlZE1hdGVyaWFsc1sgMCBdICkgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbWVzaC5uYW1lID0gb2JqZWN0Lm5hbWU7XHJcblxyXG4gICAgICBjb250YWluZXIuYWRkKCBtZXNoICk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUudGltZUVuZCggJ09CSkxvYWRlcicgKTtcclxuXHJcbiAgICByZXR1cm4gY29udGFpbmVyO1xyXG5cclxuICB9XHJcblxyXG59OyIsIlRIUkVFLlZpdmVDb250cm9sbGVyID0gZnVuY3Rpb24gKCBpZCApIHtcclxuXHJcbiAgVEhSRUUuT2JqZWN0M0QuY2FsbCggdGhpcyApO1xyXG5cclxuICB0aGlzLm1hdHJpeEF1dG9VcGRhdGUgPSBmYWxzZTtcclxuICB0aGlzLnN0YW5kaW5nTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcclxuXHJcbiAgdmFyIHNjb3BlID0gdGhpcztcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG5cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSggdXBkYXRlICk7XHJcblxyXG4gICAgdmFyIGdhbWVwYWQgPSBuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMoKVsgaWQgXTtcclxuXHJcbiAgICBpZiAoIGdhbWVwYWQgIT09IHVuZGVmaW5lZCAmJiBnYW1lcGFkLnBvc2UgIT09IG51bGwgJiYgZ2FtZXBhZC5wb3NlLnBvc2l0aW9uICE9PSBudWxsICkge1xyXG5cclxuICAgICAgdmFyIHBvc2UgPSBnYW1lcGFkLnBvc2U7XHJcblxyXG4gICAgICBzY29wZS5wb3NpdGlvbi5mcm9tQXJyYXkoIHBvc2UucG9zaXRpb24gKTtcclxuICAgICAgc2NvcGUucXVhdGVybmlvbi5mcm9tQXJyYXkoIHBvc2Uub3JpZW50YXRpb24gKTtcclxuICAgICAgc2NvcGUubWF0cml4LmNvbXBvc2UoIHNjb3BlLnBvc2l0aW9uLCBzY29wZS5xdWF0ZXJuaW9uLCBzY29wZS5zY2FsZSApO1xyXG4gICAgICBzY29wZS5tYXRyaXgubXVsdGlwbHlNYXRyaWNlcyggc2NvcGUuc3RhbmRpbmdNYXRyaXgsIHNjb3BlLm1hdHJpeCApO1xyXG4gICAgICBzY29wZS5tYXRyaXhXb3JsZE5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgIHNjb3BlLnZpc2libGUgPSB0cnVlO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICBzY29wZS52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpO1xyXG5cclxufTtcclxuXHJcblRIUkVFLlZpdmVDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFRIUkVFLk9iamVjdDNELnByb3RvdHlwZSApO1xyXG5USFJFRS5WaXZlQ29udHJvbGxlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUSFJFRS5WaXZlQ29udHJvbGxlcjsiLCIvKipcbiAqIEBhdXRob3IgZG1hcmNvcyAvIGh0dHBzOi8vZ2l0aHViLmNvbS9kbWFyY29zXG4gKiBAYXV0aG9yIG1yZG9vYiAvIGh0dHA6Ly9tcmRvb2IuY29tXG4gKi9cblxuVEhSRUUuVlJDb250cm9scyA9IGZ1bmN0aW9uICggb2JqZWN0LCBvbkVycm9yICkge1xuXG5cdHZhciBzY29wZSA9IHRoaXM7XG5cblx0dmFyIHZyRGlzcGxheSwgdnJEaXNwbGF5cztcblxuXHR2YXIgc3RhbmRpbmdNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuXG5cdGZ1bmN0aW9uIGdvdFZSRGlzcGxheXMoIGRpc3BsYXlzICkge1xuXG5cdFx0dnJEaXNwbGF5cyA9IGRpc3BsYXlzO1xuXG5cdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgZGlzcGxheXMubGVuZ3RoOyBpICsrICkge1xuXG5cdFx0XHRpZiAoICggJ1ZSRGlzcGxheScgaW4gd2luZG93ICYmIGRpc3BsYXlzWyBpIF0gaW5zdGFuY2VvZiBWUkRpc3BsYXkgKSB8fFxuXHRcdFx0XHQgKCAnUG9zaXRpb25TZW5zb3JWUkRldmljZScgaW4gd2luZG93ICYmIGRpc3BsYXlzWyBpIF0gaW5zdGFuY2VvZiBQb3NpdGlvblNlbnNvclZSRGV2aWNlICkgKSB7XG5cblx0XHRcdFx0dnJEaXNwbGF5ID0gZGlzcGxheXNbIGkgXTtcblx0XHRcdFx0YnJlYWs7ICAvLyBXZSBrZWVwIHRoZSBmaXJzdCB3ZSBlbmNvdW50ZXJcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0aWYgKCB2ckRpc3BsYXkgPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0aWYgKCBvbkVycm9yICkgb25FcnJvciggJ1ZSIGlucHV0IG5vdCBhdmFpbGFibGUuJyApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRpZiAoIG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzICkge1xuXG5cdFx0bmF2aWdhdG9yLmdldFZSRGlzcGxheXMoKS50aGVuKCBnb3RWUkRpc3BsYXlzICk7XG5cblx0fSBlbHNlIGlmICggbmF2aWdhdG9yLmdldFZSRGV2aWNlcyApIHtcblxuXHRcdC8vIERlcHJlY2F0ZWQgQVBJLlxuXHRcdG5hdmlnYXRvci5nZXRWUkRldmljZXMoKS50aGVuKCBnb3RWUkRpc3BsYXlzICk7XG5cblx0fVxuXG5cdC8vIHRoZSBSaWZ0IFNESyByZXR1cm5zIHRoZSBwb3NpdGlvbiBpbiBtZXRlcnNcblx0Ly8gdGhpcyBzY2FsZSBmYWN0b3IgYWxsb3dzIHRoZSB1c2VyIHRvIGRlZmluZSBob3cgbWV0ZXJzXG5cdC8vIGFyZSBjb252ZXJ0ZWQgdG8gc2NlbmUgdW5pdHMuXG5cblx0dGhpcy5zY2FsZSA9IDE7XG5cblx0Ly8gSWYgdHJ1ZSB3aWxsIHVzZSBcInN0YW5kaW5nIHNwYWNlXCIgY29vcmRpbmF0ZSBzeXN0ZW0gd2hlcmUgeT0wIGlzIHRoZVxuXHQvLyBmbG9vciBhbmQgeD0wLCB6PTAgaXMgdGhlIGNlbnRlciBvZiB0aGUgcm9vbS5cblx0dGhpcy5zdGFuZGluZyA9IGZhbHNlO1xuXG5cdC8vIERpc3RhbmNlIGZyb20gdGhlIHVzZXJzIGV5ZXMgdG8gdGhlIGZsb29yIGluIG1ldGVycy4gVXNlZCB3aGVuXG5cdC8vIHN0YW5kaW5nPXRydWUgYnV0IHRoZSBWUkRpc3BsYXkgZG9lc24ndCBwcm92aWRlIHN0YWdlUGFyYW1ldGVycy5cblx0dGhpcy51c2VySGVpZ2h0ID0gMS42O1xuXG5cdHRoaXMuZ2V0VlJEaXNwbGF5ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHZyRGlzcGxheTtcblxuXHR9O1xuXG5cdHRoaXMuZ2V0VlJEaXNwbGF5cyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB2ckRpc3BsYXlzO1xuXG5cdH07XG5cblx0dGhpcy5nZXRTdGFuZGluZ01hdHJpeCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiBzdGFuZGluZ01hdHJpeDtcblxuXHR9O1xuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCB2ckRpc3BsYXkgKSB7XG5cblx0XHRcdGlmICggdnJEaXNwbGF5LmdldFBvc2UgKSB7XG5cblx0XHRcdFx0dmFyIHBvc2UgPSB2ckRpc3BsYXkuZ2V0UG9zZSgpO1xuXG5cdFx0XHRcdGlmICggcG9zZS5vcmllbnRhdGlvbiAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdG9iamVjdC5xdWF0ZXJuaW9uLmZyb21BcnJheSggcG9zZS5vcmllbnRhdGlvbiApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHBvc2UucG9zaXRpb24gIT09IG51bGwgKSB7XG5cblx0XHRcdFx0XHRvYmplY3QucG9zaXRpb24uZnJvbUFycmF5KCBwb3NlLnBvc2l0aW9uICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdG9iamVjdC5wb3NpdGlvbi5zZXQoIDAsIDAsIDAgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gRGVwcmVjYXRlZCBBUEkuXG5cdFx0XHRcdHZhciBzdGF0ZSA9IHZyRGlzcGxheS5nZXRTdGF0ZSgpO1xuXG5cdFx0XHRcdGlmICggc3RhdGUub3JpZW50YXRpb24gIT09IG51bGwgKSB7XG5cblx0XHRcdFx0XHRvYmplY3QucXVhdGVybmlvbi5jb3B5KCBzdGF0ZS5vcmllbnRhdGlvbiApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHN0YXRlLnBvc2l0aW9uICE9PSBudWxsICkge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnBvc2l0aW9uLmNvcHkoIHN0YXRlLnBvc2l0aW9uICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdG9iamVjdC5wb3NpdGlvbi5zZXQoIDAsIDAsIDAgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCB0aGlzLnN0YW5kaW5nICkge1xuXG5cdFx0XHRcdGlmICggdnJEaXNwbGF5LnN0YWdlUGFyYW1ldGVycyApIHtcblxuXHRcdFx0XHRcdG9iamVjdC51cGRhdGVNYXRyaXgoKTtcblxuXHRcdFx0XHRcdHN0YW5kaW5nTWF0cml4LmZyb21BcnJheSggdnJEaXNwbGF5LnN0YWdlUGFyYW1ldGVycy5zaXR0aW5nVG9TdGFuZGluZ1RyYW5zZm9ybSApO1xuXHRcdFx0XHRcdG9iamVjdC5hcHBseU1hdHJpeCggc3RhbmRpbmdNYXRyaXggKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnBvc2l0aW9uLnNldFkoIG9iamVjdC5wb3NpdGlvbi55ICsgdGhpcy51c2VySGVpZ2h0ICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdG9iamVjdC5wb3NpdGlvbi5tdWx0aXBseVNjYWxhciggc2NvcGUuc2NhbGUgKTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMucmVzZXRQb3NlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCB2ckRpc3BsYXkgKSB7XG5cblx0XHRcdGlmICggdnJEaXNwbGF5LnJlc2V0UG9zZSAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdHZyRGlzcGxheS5yZXNldFBvc2UoKTtcblxuXHRcdFx0fSBlbHNlIGlmICggdnJEaXNwbGF5LnJlc2V0U2Vuc29yICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0Ly8gRGVwcmVjYXRlZCBBUEkuXG5cdFx0XHRcdHZyRGlzcGxheS5yZXNldFNlbnNvcigpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCB2ckRpc3BsYXkuemVyb1NlbnNvciAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdC8vIFJlYWxseSBkZXByZWNhdGVkIEFQSS5cblx0XHRcdFx0dnJEaXNwbGF5Lnplcm9TZW5zb3IoKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5yZXNldFNlbnNvciA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGNvbnNvbGUud2FybiggJ1RIUkVFLlZSQ29udHJvbHM6IC5yZXNldFNlbnNvcigpIGlzIG5vdyAucmVzZXRQb3NlKCkuJyApO1xuXHRcdHRoaXMucmVzZXRQb3NlKCk7XG5cblx0fTtcblxuXHR0aGlzLnplcm9TZW5zb3IgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRjb25zb2xlLndhcm4oICdUSFJFRS5WUkNvbnRyb2xzOiAuemVyb1NlbnNvcigpIGlzIG5vdyAucmVzZXRQb3NlKCkuJyApO1xuXHRcdHRoaXMucmVzZXRQb3NlKCk7XG5cblx0fTtcblxuXHR0aGlzLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHR2ckRpc3BsYXkgPSBudWxsO1xuXG5cdH07XG5cbn07XG4iLCIvKipcbiAqIEBhdXRob3IgZG1hcmNvcyAvIGh0dHBzOi8vZ2l0aHViLmNvbS9kbWFyY29zXG4gKiBAYXV0aG9yIG1yZG9vYiAvIGh0dHA6Ly9tcmRvb2IuY29tXG4gKlxuICogV2ViVlIgU3BlYzogaHR0cDovL21venZyLmdpdGh1Yi5pby93ZWJ2ci1zcGVjL3dlYnZyLmh0bWxcbiAqXG4gKiBGaXJlZm94OiBodHRwOi8vbW96dnIuY29tL2Rvd25sb2Fkcy9cbiAqIENocm9taXVtOiBodHRwczovL2RyaXZlLmdvb2dsZS5jb20vZm9sZGVydmlldz9pZD0wQnp1ZEx0MjJCcUdSYlc5V1RITXRPV016TmpRJnVzcD1zaGFyaW5nI2xpc3RcbiAqXG4gKi9cblxuVEhSRUUuVlJFZmZlY3QgPSBmdW5jdGlvbiAoIHJlbmRlcmVyLCBvbkVycm9yICkge1xuXG5cdHZhciBpc1dlYlZSMSA9IHRydWU7XG5cblx0dmFyIHZyRGlzcGxheSwgdnJEaXNwbGF5cztcblx0dmFyIGV5ZVRyYW5zbGF0aW9uTCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cdHZhciBleWVUcmFuc2xhdGlvblIgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXHR2YXIgcmVuZGVyUmVjdEwsIHJlbmRlclJlY3RSO1xuXHR2YXIgZXllRk9WTCwgZXllRk9WUjtcblxuXHRmdW5jdGlvbiBnb3RWUkRpc3BsYXlzKCBkaXNwbGF5cyApIHtcblxuXHRcdHZyRGlzcGxheXMgPSBkaXNwbGF5cztcblxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IGRpc3BsYXlzLmxlbmd0aDsgaSArKyApIHtcblxuXHRcdFx0aWYgKCAnVlJEaXNwbGF5JyBpbiB3aW5kb3cgJiYgZGlzcGxheXNbIGkgXSBpbnN0YW5jZW9mIFZSRGlzcGxheSApIHtcblxuXHRcdFx0XHR2ckRpc3BsYXkgPSBkaXNwbGF5c1sgaSBdO1xuXHRcdFx0XHRpc1dlYlZSMSA9IHRydWU7XG5cdFx0XHRcdGJyZWFrOyAvLyBXZSBrZWVwIHRoZSBmaXJzdCB3ZSBlbmNvdW50ZXJcblxuXHRcdFx0fSBlbHNlIGlmICggJ0hNRFZSRGV2aWNlJyBpbiB3aW5kb3cgJiYgZGlzcGxheXNbIGkgXSBpbnN0YW5jZW9mIEhNRFZSRGV2aWNlICkge1xuXG5cdFx0XHRcdHZyRGlzcGxheSA9IGRpc3BsYXlzWyBpIF07XG5cdFx0XHRcdGlzV2ViVlIxID0gZmFsc2U7XG5cdFx0XHRcdGJyZWFrOyAvLyBXZSBrZWVwIHRoZSBmaXJzdCB3ZSBlbmNvdW50ZXJcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0aWYgKCB2ckRpc3BsYXkgPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0aWYgKCBvbkVycm9yICkgb25FcnJvciggJ0hNRCBub3QgYXZhaWxhYmxlJyApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRpZiAoIG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzICkge1xuXG5cdFx0bmF2aWdhdG9yLmdldFZSRGlzcGxheXMoKS50aGVuKCBnb3RWUkRpc3BsYXlzICk7XG5cblx0fSBlbHNlIGlmICggbmF2aWdhdG9yLmdldFZSRGV2aWNlcyApIHtcblxuXHRcdC8vIERlcHJlY2F0ZWQgQVBJLlxuXHRcdG5hdmlnYXRvci5nZXRWUkRldmljZXMoKS50aGVuKCBnb3RWUkRpc3BsYXlzICk7XG5cblx0fVxuXG5cdC8vXG5cblx0dGhpcy5pc1ByZXNlbnRpbmcgPSBmYWxzZTtcblx0dGhpcy5zY2FsZSA9IDE7XG5cblx0dmFyIHNjb3BlID0gdGhpcztcblxuXHR2YXIgcmVuZGVyZXJTaXplID0gcmVuZGVyZXIuZ2V0U2l6ZSgpO1xuXHR2YXIgcmVuZGVyZXJQaXhlbFJhdGlvID0gcmVuZGVyZXIuZ2V0UGl4ZWxSYXRpbygpO1xuXG5cdHRoaXMuZ2V0VlJEaXNwbGF5ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHZyRGlzcGxheTtcblxuXHR9O1xuXG5cdHRoaXMuZ2V0VlJEaXNwbGF5cyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB2ckRpc3BsYXlzO1xuXG5cdH07XG5cblx0dGhpcy5zZXRTaXplID0gZnVuY3Rpb24gKCB3aWR0aCwgaGVpZ2h0ICkge1xuXG5cdFx0cmVuZGVyZXJTaXplID0geyB3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0IH07XG5cblx0XHRpZiAoIHNjb3BlLmlzUHJlc2VudGluZyApIHtcblxuXHRcdFx0dmFyIGV5ZVBhcmFtc0wgPSB2ckRpc3BsYXkuZ2V0RXllUGFyYW1ldGVycyggJ2xlZnQnICk7XG5cdFx0XHRyZW5kZXJlci5zZXRQaXhlbFJhdGlvKCAxICk7XG5cblx0XHRcdGlmICggaXNXZWJWUjEgKSB7XG5cblx0XHRcdFx0cmVuZGVyZXIuc2V0U2l6ZSggZXllUGFyYW1zTC5yZW5kZXJXaWR0aCAqIDIsIGV5ZVBhcmFtc0wucmVuZGVySGVpZ2h0LCBmYWxzZSApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHJlbmRlcmVyLnNldFNpemUoIGV5ZVBhcmFtc0wucmVuZGVyUmVjdC53aWR0aCAqIDIsIGV5ZVBhcmFtc0wucmVuZGVyUmVjdC5oZWlnaHQsIGZhbHNlICk7XG5cblx0XHRcdH1cblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8oIHJlbmRlcmVyUGl4ZWxSYXRpbyApO1xuXHRcdFx0cmVuZGVyZXIuc2V0U2l6ZSggd2lkdGgsIGhlaWdodCApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gZnVsbHNjcmVlblxuXG5cdHZhciBjYW52YXMgPSByZW5kZXJlci5kb21FbGVtZW50O1xuXHR2YXIgcmVxdWVzdEZ1bGxzY3JlZW47XG5cdHZhciBleGl0RnVsbHNjcmVlbjtcblx0dmFyIGZ1bGxzY3JlZW5FbGVtZW50O1xuXHR2YXIgbGVmdEJvdW5kcyA9IFsgMC4wLCAwLjAsIDAuNSwgMS4wIF07XG5cdHZhciByaWdodEJvdW5kcyA9IFsgMC41LCAwLjAsIDAuNSwgMS4wIF07XG5cblx0ZnVuY3Rpb24gb25GdWxsc2NyZWVuQ2hhbmdlICgpIHtcblxuXHRcdHZhciB3YXNQcmVzZW50aW5nID0gc2NvcGUuaXNQcmVzZW50aW5nO1xuXHRcdHNjb3BlLmlzUHJlc2VudGluZyA9IHZyRGlzcGxheSAhPT0gdW5kZWZpbmVkICYmICggdnJEaXNwbGF5LmlzUHJlc2VudGluZyB8fCAoICEgaXNXZWJWUjEgJiYgZG9jdW1lbnRbIGZ1bGxzY3JlZW5FbGVtZW50IF0gaW5zdGFuY2VvZiB3aW5kb3cuSFRNTEVsZW1lbnQgKSApO1xuXG5cdFx0aWYgKCBzY29wZS5pc1ByZXNlbnRpbmcgKSB7XG5cblx0XHRcdHZhciBleWVQYXJhbXNMID0gdnJEaXNwbGF5LmdldEV5ZVBhcmFtZXRlcnMoICdsZWZ0JyApO1xuXHRcdFx0dmFyIGV5ZVdpZHRoLCBleWVIZWlnaHQ7XG5cblx0XHRcdGlmICggaXNXZWJWUjEgKSB7XG5cblx0XHRcdFx0ZXllV2lkdGggPSBleWVQYXJhbXNMLnJlbmRlcldpZHRoO1xuXHRcdFx0XHRleWVIZWlnaHQgPSBleWVQYXJhbXNMLnJlbmRlckhlaWdodDtcblxuXHRcdFx0XHRpZiAoIHZyRGlzcGxheS5nZXRMYXllcnMgKSB7XG5cblx0XHRcdFx0XHR2YXIgbGF5ZXJzID0gdnJEaXNwbGF5LmdldExheWVycygpO1xuXHRcdFx0XHRcdGlmIChsYXllcnMubGVuZ3RoKSB7XG5cblx0XHRcdFx0XHRcdGxlZnRCb3VuZHMgPSBsYXllcnNbMF0ubGVmdEJvdW5kcyB8fCBbIDAuMCwgMC4wLCAwLjUsIDEuMCBdO1xuXHRcdFx0XHRcdFx0cmlnaHRCb3VuZHMgPSBsYXllcnNbMF0ucmlnaHRCb3VuZHMgfHwgWyAwLjUsIDAuMCwgMC41LCAxLjAgXTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGV5ZVdpZHRoID0gZXllUGFyYW1zTC5yZW5kZXJSZWN0LndpZHRoO1xuXHRcdFx0XHRleWVIZWlnaHQgPSBleWVQYXJhbXNMLnJlbmRlclJlY3QuaGVpZ2h0O1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggIXdhc1ByZXNlbnRpbmcgKSB7XG5cblx0XHRcdFx0cmVuZGVyZXJQaXhlbFJhdGlvID0gcmVuZGVyZXIuZ2V0UGl4ZWxSYXRpbygpO1xuXHRcdFx0XHRyZW5kZXJlclNpemUgPSByZW5kZXJlci5nZXRTaXplKCk7XG5cblx0XHRcdFx0cmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyggMSApO1xuXHRcdFx0XHRyZW5kZXJlci5zZXRTaXplKCBleWVXaWR0aCAqIDIsIGV5ZUhlaWdodCwgZmFsc2UgKTtcblxuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIGlmICggd2FzUHJlc2VudGluZyApIHtcblxuXHRcdFx0cmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyggcmVuZGVyZXJQaXhlbFJhdGlvICk7XG5cdFx0XHRyZW5kZXJlci5zZXRTaXplKCByZW5kZXJlclNpemUud2lkdGgsIHJlbmRlcmVyU2l6ZS5oZWlnaHQgKTtcblxuXHRcdH1cblxuXHR9XG5cblx0aWYgKCBjYW52YXMucmVxdWVzdEZ1bGxzY3JlZW4gKSB7XG5cblx0XHRyZXF1ZXN0RnVsbHNjcmVlbiA9ICdyZXF1ZXN0RnVsbHNjcmVlbic7XG5cdFx0ZnVsbHNjcmVlbkVsZW1lbnQgPSAnZnVsbHNjcmVlbkVsZW1lbnQnO1xuXHRcdGV4aXRGdWxsc2NyZWVuID0gJ2V4aXRGdWxsc2NyZWVuJztcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnZnVsbHNjcmVlbmNoYW5nZScsIG9uRnVsbHNjcmVlbkNoYW5nZSwgZmFsc2UgKTtcblxuXHR9IGVsc2UgaWYgKCBjYW52YXMubW96UmVxdWVzdEZ1bGxTY3JlZW4gKSB7XG5cblx0XHRyZXF1ZXN0RnVsbHNjcmVlbiA9ICdtb3pSZXF1ZXN0RnVsbFNjcmVlbic7XG5cdFx0ZnVsbHNjcmVlbkVsZW1lbnQgPSAnbW96RnVsbFNjcmVlbkVsZW1lbnQnO1xuXHRcdGV4aXRGdWxsc2NyZWVuID0gJ21vekNhbmNlbEZ1bGxTY3JlZW4nO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3pmdWxsc2NyZWVuY2hhbmdlJywgb25GdWxsc2NyZWVuQ2hhbmdlLCBmYWxzZSApO1xuXG5cdH0gZWxzZSB7XG5cblx0XHRyZXF1ZXN0RnVsbHNjcmVlbiA9ICd3ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbic7XG5cdFx0ZnVsbHNjcmVlbkVsZW1lbnQgPSAnd2Via2l0RnVsbHNjcmVlbkVsZW1lbnQnO1xuXHRcdGV4aXRGdWxsc2NyZWVuID0gJ3dlYmtpdEV4aXRGdWxsc2NyZWVuJztcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnd2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsIG9uRnVsbHNjcmVlbkNoYW5nZSwgZmFsc2UgKTtcblxuXHR9XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICd2cmRpc3BsYXlwcmVzZW50Y2hhbmdlJywgb25GdWxsc2NyZWVuQ2hhbmdlLCBmYWxzZSApO1xuXG5cdHRoaXMuc2V0RnVsbFNjcmVlbiA9IGZ1bmN0aW9uICggYm9vbGVhbiApIHtcblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSggZnVuY3Rpb24gKCByZXNvbHZlLCByZWplY3QgKSB7XG5cblx0XHRcdGlmICggdnJEaXNwbGF5ID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0cmVqZWN0KCBuZXcgRXJyb3IoICdObyBWUiBoYXJkd2FyZSBmb3VuZC4nICkgKTtcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggc2NvcGUuaXNQcmVzZW50aW5nID09PSBib29sZWFuICkge1xuXG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggaXNXZWJWUjEgKSB7XG5cblx0XHRcdFx0aWYgKCBib29sZWFuICkge1xuXG5cdFx0XHRcdFx0cmVzb2x2ZSggdnJEaXNwbGF5LnJlcXVlc3RQcmVzZW50KCBbIHsgc291cmNlOiBjYW52YXMgfSBdICkgKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0cmVzb2x2ZSggdnJEaXNwbGF5LmV4aXRQcmVzZW50KCkgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKCBjYW52YXNbIHJlcXVlc3RGdWxsc2NyZWVuIF0gKSB7XG5cblx0XHRcdFx0XHRjYW52YXNbIGJvb2xlYW4gPyByZXF1ZXN0RnVsbHNjcmVlbiA6IGV4aXRGdWxsc2NyZWVuIF0oIHsgdnJEaXNwbGF5OiB2ckRpc3BsYXkgfSApO1xuXHRcdFx0XHRcdHJlc29sdmUoKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciggJ05vIGNvbXBhdGlibGUgcmVxdWVzdEZ1bGxzY3JlZW4gbWV0aG9kIGZvdW5kLicgKTtcblx0XHRcdFx0XHRyZWplY3QoIG5ldyBFcnJvciggJ05vIGNvbXBhdGlibGUgcmVxdWVzdEZ1bGxzY3JlZW4gbWV0aG9kIGZvdW5kLicgKSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fSApO1xuXG5cdH07XG5cblx0dGhpcy5yZXF1ZXN0UHJlc2VudCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB0aGlzLnNldEZ1bGxTY3JlZW4oIHRydWUgKTtcblxuXHR9O1xuXG5cdHRoaXMuZXhpdFByZXNlbnQgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5zZXRGdWxsU2NyZWVuKCBmYWxzZSApO1xuXG5cdH07XG5cblx0dGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoIGYgKSB7XG5cblx0XHRpZiAoIGlzV2ViVlIxICYmIHZyRGlzcGxheSAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRyZXR1cm4gdnJEaXNwbGF5LnJlcXVlc3RBbmltYXRpb25GcmFtZSggZiApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0cmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGYgKTtcblxuXHRcdH1cblxuXHR9O1xuXHRcblx0dGhpcy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uICggaCApIHtcblxuXHRcdGlmICggaXNXZWJWUjEgJiYgdnJEaXNwbGF5ICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdHZyRGlzcGxheS5jYW5jZWxBbmltYXRpb25GcmFtZSggaCApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKCBoICk7XG5cblx0XHR9XG5cblx0fTtcblx0XG5cdHRoaXMuc3VibWl0RnJhbWUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIGlzV2ViVlIxICYmIHZyRGlzcGxheSAhPT0gdW5kZWZpbmVkICYmIHNjb3BlLmlzUHJlc2VudGluZyApIHtcblxuXHRcdFx0dnJEaXNwbGF5LnN1Ym1pdEZyYW1lKCk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLmF1dG9TdWJtaXRGcmFtZSA9IHRydWU7XG5cblx0Ly8gcmVuZGVyXG5cblx0dmFyIGNhbWVyYUwgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoKTtcblx0Y2FtZXJhTC5sYXllcnMuZW5hYmxlKCAxICk7XG5cblx0dmFyIGNhbWVyYVIgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoKTtcblx0Y2FtZXJhUi5sYXllcnMuZW5hYmxlKCAyICk7XG5cblx0dGhpcy5yZW5kZXIgPSBmdW5jdGlvbiAoIHNjZW5lLCBjYW1lcmEsIHJlbmRlclRhcmdldCwgZm9yY2VDbGVhciApIHtcblxuXHRcdGlmICggdnJEaXNwbGF5ICYmIHNjb3BlLmlzUHJlc2VudGluZyApIHtcblxuXHRcdFx0dmFyIGF1dG9VcGRhdGUgPSBzY2VuZS5hdXRvVXBkYXRlO1xuXG5cdFx0XHRpZiAoIGF1dG9VcGRhdGUgKSB7XG5cblx0XHRcdFx0c2NlbmUudXBkYXRlTWF0cml4V29ybGQoKTtcblx0XHRcdFx0c2NlbmUuYXV0b1VwZGF0ZSA9IGZhbHNlO1xuXG5cdFx0XHR9XG5cblx0XHRcdHZhciBleWVQYXJhbXNMID0gdnJEaXNwbGF5LmdldEV5ZVBhcmFtZXRlcnMoICdsZWZ0JyApO1xuXHRcdFx0dmFyIGV5ZVBhcmFtc1IgPSB2ckRpc3BsYXkuZ2V0RXllUGFyYW1ldGVycyggJ3JpZ2h0JyApO1xuXG5cdFx0XHRpZiAoIGlzV2ViVlIxICkge1xuXG5cdFx0XHRcdGV5ZVRyYW5zbGF0aW9uTC5mcm9tQXJyYXkoIGV5ZVBhcmFtc0wub2Zmc2V0ICk7XG5cdFx0XHRcdGV5ZVRyYW5zbGF0aW9uUi5mcm9tQXJyYXkoIGV5ZVBhcmFtc1Iub2Zmc2V0ICk7XG5cdFx0XHRcdGV5ZUZPVkwgPSBleWVQYXJhbXNMLmZpZWxkT2ZWaWV3O1xuXHRcdFx0XHRleWVGT1ZSID0gZXllUGFyYW1zUi5maWVsZE9mVmlldztcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRleWVUcmFuc2xhdGlvbkwuY29weSggZXllUGFyYW1zTC5leWVUcmFuc2xhdGlvbiApO1xuXHRcdFx0XHRleWVUcmFuc2xhdGlvblIuY29weSggZXllUGFyYW1zUi5leWVUcmFuc2xhdGlvbiApO1xuXHRcdFx0XHRleWVGT1ZMID0gZXllUGFyYW1zTC5yZWNvbW1lbmRlZEZpZWxkT2ZWaWV3O1xuXHRcdFx0XHRleWVGT1ZSID0gZXllUGFyYW1zUi5yZWNvbW1lbmRlZEZpZWxkT2ZWaWV3O1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggQXJyYXkuaXNBcnJheSggc2NlbmUgKSApIHtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oICdUSFJFRS5WUkVmZmVjdC5yZW5kZXIoKSBubyBsb25nZXIgc3VwcG9ydHMgYXJyYXlzLiBVc2Ugb2JqZWN0LmxheWVycyBpbnN0ZWFkLicgKTtcblx0XHRcdFx0c2NlbmUgPSBzY2VuZVsgMCBdO1xuXG5cdFx0XHR9XG5cblx0XHRcdC8vIFdoZW4gcmVuZGVyaW5nIHdlIGRvbid0IGNhcmUgd2hhdCB0aGUgcmVjb21tZW5kZWQgc2l6ZSBpcywgb25seSB3aGF0IHRoZSBhY3R1YWwgc2l6ZVxuXHRcdFx0Ly8gb2YgdGhlIGJhY2tidWZmZXIgaXMuXG5cdFx0XHR2YXIgc2l6ZSA9IHJlbmRlcmVyLmdldFNpemUoKTtcblx0XHRcdHJlbmRlclJlY3RMID0ge1xuXHRcdFx0XHR4OiBNYXRoLnJvdW5kKCBzaXplLndpZHRoICogbGVmdEJvdW5kc1sgMCBdICksXG5cdFx0XHRcdHk6IE1hdGgucm91bmQoIHNpemUuaGVpZ2h0ICogbGVmdEJvdW5kc1sgMSBdICksXG5cdFx0XHRcdHdpZHRoOiBNYXRoLnJvdW5kKCBzaXplLndpZHRoICogbGVmdEJvdW5kc1sgMiBdICksXG5cdFx0XHRcdGhlaWdodDogIE1hdGgucm91bmQoc2l6ZS5oZWlnaHQgKiBsZWZ0Qm91bmRzWyAzIF0gKVxuXHRcdFx0fTtcblx0XHRcdHJlbmRlclJlY3RSID0ge1xuXHRcdFx0XHR4OiBNYXRoLnJvdW5kKCBzaXplLndpZHRoICogcmlnaHRCb3VuZHNbIDAgXSApLFxuXHRcdFx0XHR5OiBNYXRoLnJvdW5kKCBzaXplLmhlaWdodCAqIHJpZ2h0Qm91bmRzWyAxIF0gKSxcblx0XHRcdFx0d2lkdGg6IE1hdGgucm91bmQoIHNpemUud2lkdGggKiByaWdodEJvdW5kc1sgMiBdICksXG5cdFx0XHRcdGhlaWdodDogIE1hdGgucm91bmQoc2l6ZS5oZWlnaHQgKiByaWdodEJvdW5kc1sgMyBdIClcblx0XHRcdH07XG5cblx0XHRcdGlmIChyZW5kZXJUYXJnZXQpIHtcblx0XHRcdFx0XG5cdFx0XHRcdHJlbmRlcmVyLnNldFJlbmRlclRhcmdldChyZW5kZXJUYXJnZXQpO1xuXHRcdFx0XHRyZW5kZXJUYXJnZXQuc2Npc3NvclRlc3QgPSB0cnVlO1xuXHRcdFx0XHRcblx0XHRcdH0gZWxzZSAge1xuXHRcdFx0XHRcblx0XHRcdFx0cmVuZGVyZXIuc2V0U2Npc3NvclRlc3QoIHRydWUgKTtcblx0XHRcdFxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHJlbmRlcmVyLmF1dG9DbGVhciB8fCBmb3JjZUNsZWFyICkgcmVuZGVyZXIuY2xlYXIoKTtcblxuXHRcdFx0aWYgKCBjYW1lcmEucGFyZW50ID09PSBudWxsICkgY2FtZXJhLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG5cblx0XHRcdGNhbWVyYUwucHJvamVjdGlvbk1hdHJpeCA9IGZvdlRvUHJvamVjdGlvbiggZXllRk9WTCwgdHJ1ZSwgY2FtZXJhLm5lYXIsIGNhbWVyYS5mYXIgKTtcblx0XHRcdGNhbWVyYVIucHJvamVjdGlvbk1hdHJpeCA9IGZvdlRvUHJvamVjdGlvbiggZXllRk9WUiwgdHJ1ZSwgY2FtZXJhLm5lYXIsIGNhbWVyYS5mYXIgKTtcblxuXHRcdFx0Y2FtZXJhLm1hdHJpeFdvcmxkLmRlY29tcG9zZSggY2FtZXJhTC5wb3NpdGlvbiwgY2FtZXJhTC5xdWF0ZXJuaW9uLCBjYW1lcmFMLnNjYWxlICk7XG5cdFx0XHRjYW1lcmEubWF0cml4V29ybGQuZGVjb21wb3NlKCBjYW1lcmFSLnBvc2l0aW9uLCBjYW1lcmFSLnF1YXRlcm5pb24sIGNhbWVyYVIuc2NhbGUgKTtcblxuXHRcdFx0dmFyIHNjYWxlID0gdGhpcy5zY2FsZTtcblx0XHRcdGNhbWVyYUwudHJhbnNsYXRlT25BeGlzKCBleWVUcmFuc2xhdGlvbkwsIHNjYWxlICk7XG5cdFx0XHRjYW1lcmFSLnRyYW5zbGF0ZU9uQXhpcyggZXllVHJhbnNsYXRpb25SLCBzY2FsZSApO1xuXG5cblx0XHRcdC8vIHJlbmRlciBsZWZ0IGV5ZVxuXHRcdFx0aWYgKCByZW5kZXJUYXJnZXQgKSB7XG5cblx0XHRcdFx0cmVuZGVyVGFyZ2V0LnZpZXdwb3J0LnNldChyZW5kZXJSZWN0TC54LCByZW5kZXJSZWN0TC55LCByZW5kZXJSZWN0TC53aWR0aCwgcmVuZGVyUmVjdEwuaGVpZ2h0KTtcblx0XHRcdFx0cmVuZGVyVGFyZ2V0LnNjaXNzb3Iuc2V0KHJlbmRlclJlY3RMLngsIHJlbmRlclJlY3RMLnksIHJlbmRlclJlY3RMLndpZHRoLCByZW5kZXJSZWN0TC5oZWlnaHQpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHJlbmRlcmVyLnNldFZpZXdwb3J0KCByZW5kZXJSZWN0TC54LCByZW5kZXJSZWN0TC55LCByZW5kZXJSZWN0TC53aWR0aCwgcmVuZGVyUmVjdEwuaGVpZ2h0ICk7XG5cdFx0XHRcdHJlbmRlcmVyLnNldFNjaXNzb3IoIHJlbmRlclJlY3RMLngsIHJlbmRlclJlY3RMLnksIHJlbmRlclJlY3RMLndpZHRoLCByZW5kZXJSZWN0TC5oZWlnaHQgKTtcblxuXHRcdFx0fVxuXHRcdFx0cmVuZGVyZXIucmVuZGVyKCBzY2VuZSwgY2FtZXJhTCwgcmVuZGVyVGFyZ2V0LCBmb3JjZUNsZWFyICk7XG5cblx0XHRcdC8vIHJlbmRlciByaWdodCBleWVcblx0XHRcdGlmIChyZW5kZXJUYXJnZXQpIHtcblxuXHRcdFx0XHRyZW5kZXJUYXJnZXQudmlld3BvcnQuc2V0KHJlbmRlclJlY3RSLngsIHJlbmRlclJlY3RSLnksIHJlbmRlclJlY3RSLndpZHRoLCByZW5kZXJSZWN0Ui5oZWlnaHQpO1xuICBcdFx0XHRcdHJlbmRlclRhcmdldC5zY2lzc29yLnNldChyZW5kZXJSZWN0Ui54LCByZW5kZXJSZWN0Ui55LCByZW5kZXJSZWN0Ui53aWR0aCwgcmVuZGVyUmVjdFIuaGVpZ2h0KTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRyZW5kZXJlci5zZXRWaWV3cG9ydCggcmVuZGVyUmVjdFIueCwgcmVuZGVyUmVjdFIueSwgcmVuZGVyUmVjdFIud2lkdGgsIHJlbmRlclJlY3RSLmhlaWdodCApO1xuXHRcdFx0XHRyZW5kZXJlci5zZXRTY2lzc29yKCByZW5kZXJSZWN0Ui54LCByZW5kZXJSZWN0Ui55LCByZW5kZXJSZWN0Ui53aWR0aCwgcmVuZGVyUmVjdFIuaGVpZ2h0ICk7XG5cblx0XHRcdH1cblx0XHRcdHJlbmRlcmVyLnJlbmRlciggc2NlbmUsIGNhbWVyYVIsIHJlbmRlclRhcmdldCwgZm9yY2VDbGVhciApO1xuXG5cdFx0XHRpZiAocmVuZGVyVGFyZ2V0KSB7XG5cblx0XHRcdFx0cmVuZGVyVGFyZ2V0LnZpZXdwb3J0LnNldCggMCwgMCwgc2l6ZS53aWR0aCwgc2l6ZS5oZWlnaHQgKTtcblx0XHRcdFx0cmVuZGVyVGFyZ2V0LnNjaXNzb3Iuc2V0KCAwLCAwLCBzaXplLndpZHRoLCBzaXplLmhlaWdodCApO1xuXHRcdFx0XHRyZW5kZXJUYXJnZXQuc2Npc3NvclRlc3QgPSBmYWxzZTtcblx0XHRcdFx0cmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KCBudWxsICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRyZW5kZXJlci5zZXRTY2lzc29yVGVzdCggZmFsc2UgKTtcblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAoIGF1dG9VcGRhdGUgKSB7XG5cblx0XHRcdFx0c2NlbmUuYXV0b1VwZGF0ZSA9IHRydWU7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBzY29wZS5hdXRvU3VibWl0RnJhbWUgKSB7XG5cblx0XHRcdFx0c2NvcGUuc3VibWl0RnJhbWUoKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm47XG5cblx0XHR9XG5cblx0XHQvLyBSZWd1bGFyIHJlbmRlciBtb2RlIGlmIG5vdCBITURcblxuXHRcdHJlbmRlcmVyLnJlbmRlciggc2NlbmUsIGNhbWVyYSwgcmVuZGVyVGFyZ2V0LCBmb3JjZUNsZWFyICk7XG5cblx0fTtcblxuXHQvL1xuXG5cdGZ1bmN0aW9uIGZvdlRvTkRDU2NhbGVPZmZzZXQoIGZvdiApIHtcblxuXHRcdHZhciBweHNjYWxlID0gMi4wIC8gKCBmb3YubGVmdFRhbiArIGZvdi5yaWdodFRhbiApO1xuXHRcdHZhciBweG9mZnNldCA9ICggZm92LmxlZnRUYW4gLSBmb3YucmlnaHRUYW4gKSAqIHB4c2NhbGUgKiAwLjU7XG5cdFx0dmFyIHB5c2NhbGUgPSAyLjAgLyAoIGZvdi51cFRhbiArIGZvdi5kb3duVGFuICk7XG5cdFx0dmFyIHB5b2Zmc2V0ID0gKCBmb3YudXBUYW4gLSBmb3YuZG93blRhbiApICogcHlzY2FsZSAqIDAuNTtcblx0XHRyZXR1cm4geyBzY2FsZTogWyBweHNjYWxlLCBweXNjYWxlIF0sIG9mZnNldDogWyBweG9mZnNldCwgcHlvZmZzZXQgXSB9O1xuXG5cdH1cblxuXHRmdW5jdGlvbiBmb3ZQb3J0VG9Qcm9qZWN0aW9uKCBmb3YsIHJpZ2h0SGFuZGVkLCB6TmVhciwgekZhciApIHtcblxuXHRcdHJpZ2h0SGFuZGVkID0gcmlnaHRIYW5kZWQgPT09IHVuZGVmaW5lZCA/IHRydWUgOiByaWdodEhhbmRlZDtcblx0XHR6TmVhciA9IHpOZWFyID09PSB1bmRlZmluZWQgPyAwLjAxIDogek5lYXI7XG5cdFx0ekZhciA9IHpGYXIgPT09IHVuZGVmaW5lZCA/IDEwMDAwLjAgOiB6RmFyO1xuXG5cdFx0dmFyIGhhbmRlZG5lc3NTY2FsZSA9IHJpZ2h0SGFuZGVkID8gLSAxLjAgOiAxLjA7XG5cblx0XHQvLyBzdGFydCB3aXRoIGFuIGlkZW50aXR5IG1hdHJpeFxuXHRcdHZhciBtb2JqID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcblx0XHR2YXIgbSA9IG1vYmouZWxlbWVudHM7XG5cblx0XHQvLyBhbmQgd2l0aCBzY2FsZS9vZmZzZXQgaW5mbyBmb3Igbm9ybWFsaXplZCBkZXZpY2UgY29vcmRzXG5cdFx0dmFyIHNjYWxlQW5kT2Zmc2V0ID0gZm92VG9ORENTY2FsZU9mZnNldCggZm92ICk7XG5cblx0XHQvLyBYIHJlc3VsdCwgbWFwIGNsaXAgZWRnZXMgdG8gWy13LCt3XVxuXHRcdG1bIDAgKiA0ICsgMCBdID0gc2NhbGVBbmRPZmZzZXQuc2NhbGVbIDAgXTtcblx0XHRtWyAwICogNCArIDEgXSA9IDAuMDtcblx0XHRtWyAwICogNCArIDIgXSA9IHNjYWxlQW5kT2Zmc2V0Lm9mZnNldFsgMCBdICogaGFuZGVkbmVzc1NjYWxlO1xuXHRcdG1bIDAgKiA0ICsgMyBdID0gMC4wO1xuXG5cdFx0Ly8gWSByZXN1bHQsIG1hcCBjbGlwIGVkZ2VzIHRvIFstdywrd11cblx0XHQvLyBZIG9mZnNldCBpcyBuZWdhdGVkIGJlY2F1c2UgdGhpcyBwcm9qIG1hdHJpeCB0cmFuc2Zvcm1zIGZyb20gd29ybGQgY29vcmRzIHdpdGggWT11cCxcblx0XHQvLyBidXQgdGhlIE5EQyBzY2FsaW5nIGhhcyBZPWRvd24gKHRoYW5rcyBEM0Q/KVxuXHRcdG1bIDEgKiA0ICsgMCBdID0gMC4wO1xuXHRcdG1bIDEgKiA0ICsgMSBdID0gc2NhbGVBbmRPZmZzZXQuc2NhbGVbIDEgXTtcblx0XHRtWyAxICogNCArIDIgXSA9IC0gc2NhbGVBbmRPZmZzZXQub2Zmc2V0WyAxIF0gKiBoYW5kZWRuZXNzU2NhbGU7XG5cdFx0bVsgMSAqIDQgKyAzIF0gPSAwLjA7XG5cblx0XHQvLyBaIHJlc3VsdCAodXAgdG8gdGhlIGFwcClcblx0XHRtWyAyICogNCArIDAgXSA9IDAuMDtcblx0XHRtWyAyICogNCArIDEgXSA9IDAuMDtcblx0XHRtWyAyICogNCArIDIgXSA9IHpGYXIgLyAoIHpOZWFyIC0gekZhciApICogLSBoYW5kZWRuZXNzU2NhbGU7XG5cdFx0bVsgMiAqIDQgKyAzIF0gPSAoIHpGYXIgKiB6TmVhciApIC8gKCB6TmVhciAtIHpGYXIgKTtcblxuXHRcdC8vIFcgcmVzdWx0ICg9IFogaW4pXG5cdFx0bVsgMyAqIDQgKyAwIF0gPSAwLjA7XG5cdFx0bVsgMyAqIDQgKyAxIF0gPSAwLjA7XG5cdFx0bVsgMyAqIDQgKyAyIF0gPSBoYW5kZWRuZXNzU2NhbGU7XG5cdFx0bVsgMyAqIDQgKyAzIF0gPSAwLjA7XG5cblx0XHRtb2JqLnRyYW5zcG9zZSgpO1xuXG5cdFx0cmV0dXJuIG1vYmo7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGZvdlRvUHJvamVjdGlvbiggZm92LCByaWdodEhhbmRlZCwgek5lYXIsIHpGYXIgKSB7XG5cblx0XHR2YXIgREVHMlJBRCA9IE1hdGguUEkgLyAxODAuMDtcblxuXHRcdHZhciBmb3ZQb3J0ID0ge1xuXHRcdFx0dXBUYW46IE1hdGgudGFuKCBmb3YudXBEZWdyZWVzICogREVHMlJBRCApLFxuXHRcdFx0ZG93blRhbjogTWF0aC50YW4oIGZvdi5kb3duRGVncmVlcyAqIERFRzJSQUQgKSxcblx0XHRcdGxlZnRUYW46IE1hdGgudGFuKCBmb3YubGVmdERlZ3JlZXMgKiBERUcyUkFEICksXG5cdFx0XHRyaWdodFRhbjogTWF0aC50YW4oIGZvdi5yaWdodERlZ3JlZXMgKiBERUcyUkFEIClcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGZvdlBvcnRUb1Byb2plY3Rpb24oIGZvdlBvcnQsIHJpZ2h0SGFuZGVkLCB6TmVhciwgekZhciApO1xuXG5cdH1cblxufTtcbiIsIi8qKlxyXG4qIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb21cclxuKiBCYXNlZCBvbiBAdG9qaXJvJ3MgdnItc2FtcGxlcy11dGlscy5qc1xyXG4qL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzTGF0ZXN0QXZhaWxhYmxlKCkge1xyXG5cclxuICByZXR1cm4gbmF2aWdhdG9yLmdldFZSRGlzcGxheXMgIT09IHVuZGVmaW5lZDtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0F2YWlsYWJsZSgpIHtcclxuXHJcbiAgcmV0dXJuIG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzICE9PSB1bmRlZmluZWQgfHwgbmF2aWdhdG9yLmdldFZSRGV2aWNlcyAhPT0gdW5kZWZpbmVkO1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1lc3NhZ2UoKSB7XHJcblxyXG4gIHZhciBtZXNzYWdlO1xyXG5cclxuICBpZiAoIG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzICkge1xyXG5cclxuICAgIG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzKCkudGhlbiggZnVuY3Rpb24gKCBkaXNwbGF5cyApIHtcclxuXHJcbiAgICAgIGlmICggZGlzcGxheXMubGVuZ3RoID09PSAwICkgbWVzc2FnZSA9ICdXZWJWUiBzdXBwb3J0ZWQsIGJ1dCBubyBWUkRpc3BsYXlzIGZvdW5kLic7XHJcblxyXG4gICAgfSApO1xyXG5cclxuICB9IGVsc2UgaWYgKCBuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzICkge1xyXG5cclxuICAgIG1lc3NhZ2UgPSAnWW91ciBicm93c2VyIHN1cHBvcnRzIFdlYlZSIGJ1dCBub3QgdGhlIGxhdGVzdCB2ZXJzaW9uLiBTZWUgPGEgaHJlZj1cImh0dHA6Ly93ZWJ2ci5pbmZvXCI+d2VidnIuaW5mbzwvYT4gZm9yIG1vcmUgaW5mby4nO1xyXG5cclxuICB9IGVsc2Uge1xyXG5cclxuICAgIG1lc3NhZ2UgPSAnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgV2ViVlIuIFNlZSA8YSBocmVmPVwiaHR0cDovL3dlYnZyLmluZm9cIj53ZWJ2ci5pbmZvPC9hPiBmb3IgYXNzaXN0YW5jZS4nO1xyXG5cclxuICB9XHJcblxyXG4gIGlmICggbWVzc2FnZSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xyXG4gICAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gJzAnO1xyXG4gICAgY29udGFpbmVyLnN0eWxlLnRvcCA9ICcwJztcclxuICAgIGNvbnRhaW5lci5zdHlsZS5yaWdodCA9ICcwJztcclxuICAgIGNvbnRhaW5lci5zdHlsZS56SW5kZXggPSAnOTk5JztcclxuICAgIGNvbnRhaW5lci5hbGlnbiA9ICdjZW50ZXInO1xyXG5cclxuICAgIHZhciBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XHJcbiAgICBlcnJvci5zdHlsZS5mb250RmFtaWx5ID0gJ3NhbnMtc2VyaWYnO1xyXG4gICAgZXJyb3Iuc3R5bGUuZm9udFNpemUgPSAnMTZweCc7XHJcbiAgICBlcnJvci5zdHlsZS5mb250U3R5bGUgPSAnbm9ybWFsJztcclxuICAgIGVycm9yLnN0eWxlLmxpbmVIZWlnaHQgPSAnMjZweCc7XHJcbiAgICBlcnJvci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZic7XHJcbiAgICBlcnJvci5zdHlsZS5jb2xvciA9ICcjMDAwJztcclxuICAgIGVycm9yLnN0eWxlLnBhZGRpbmcgPSAnMTBweCAyMHB4JztcclxuICAgIGVycm9yLnN0eWxlLm1hcmdpbiA9ICc1MHB4JztcclxuICAgIGVycm9yLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcclxuICAgIGVycm9yLmlubmVySFRNTCA9IG1lc3NhZ2U7XHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoIGVycm9yICk7XHJcblxyXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEJ1dHRvbiggZWZmZWN0ICkge1xyXG5cclxuICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2J1dHRvbicgKTtcclxuICBidXR0b24uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gIGJ1dHRvbi5zdHlsZS5sZWZ0ID0gJ2NhbGMoNTAlIC0gNTBweCknO1xyXG4gIGJ1dHRvbi5zdHlsZS5ib3R0b20gPSAnMjBweCc7XHJcbiAgYnV0dG9uLnN0eWxlLndpZHRoID0gJzEwMHB4JztcclxuICBidXR0b24uc3R5bGUuYm9yZGVyID0gJzAnO1xyXG4gIGJ1dHRvbi5zdHlsZS5wYWRkaW5nID0gJzhweCc7XHJcbiAgYnV0dG9uLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcclxuICBidXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyMwMDAnO1xyXG4gIGJ1dHRvbi5zdHlsZS5jb2xvciA9ICcjZmZmJztcclxuICBidXR0b24uc3R5bGUuZm9udEZhbWlseSA9ICdzYW5zLXNlcmlmJztcclxuICBidXR0b24uc3R5bGUuZm9udFNpemUgPSAnMTNweCc7XHJcbiAgYnV0dG9uLnN0eWxlLmZvbnRTdHlsZSA9ICdub3JtYWwnO1xyXG4gIGJ1dHRvbi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICBidXR0b24uc3R5bGUuekluZGV4ID0gJzk5OSc7XHJcbiAgYnV0dG9uLnRleHRDb250ZW50ID0gJ0VOVEVSIFZSJztcclxuICBidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIGVmZmVjdC5pc1ByZXNlbnRpbmcgPyBlZmZlY3QuZXhpdFByZXNlbnQoKSA6IGVmZmVjdC5yZXF1ZXN0UHJlc2VudCgpO1xyXG5cclxuICB9O1xyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3ZyZGlzcGxheXByZXNlbnRjaGFuZ2UnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xyXG5cclxuICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IGVmZmVjdC5pc1ByZXNlbnRpbmcgPyAnRVhJVCBWUicgOiAnRU5URVIgVlInO1xyXG5cclxuICB9LCBmYWxzZSApO1xyXG5cclxuICByZXR1cm4gYnV0dG9uO1xyXG5cclxufVxyXG5cclxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIl19
