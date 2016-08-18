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

var boxes = [];
for (var i = 0; i < 32; i++) {
  var box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial());
  box.position.y = 2.0;
  box.position.z = -1.2;
  scene.add(box);
  boxes.push(box);
}

var state = {
  rotationSpeed: 0.02,
  offset: 0.01,
  scale: 1.0
};

events.on('tick', function (dt) {
  boxes.forEach(function (box, index) {
    box.rotation.x += dt * (state.rotationSpeed + index * state.offset);
    box.rotation.y -= dt * (state.rotationSpeed * 1.2 + index * state.offset);
    box.rotation.z += dt * (state.rotationSpeed * 0.4 + index * state.offset);
  });
});

var gui = (0, _vrdatgui2.default)(THREE);
gui.addInputObject(pointer);

var guiGroup = new THREE.Group();
guiGroup.position.z = -0.1;
guiGroup.rotation.x = -Math.PI * 0.5;
guiGroup.scale.multiplyScalar(0.25);
controllerModels[1].add(guiGroup);

var controller = gui.add(state, 'rotationSpeed', -0.8, 0.8);
guiGroup.add(controller);

var controller2 = gui.add(state, 'scale', 0.2, 3.0).onChanged(function (width) {
  boxes.forEach(function (box, index) {
    box.scale.x = width * index * 0.01;
    if (box.scale.x < 0.1) {
      box.scale.x = 0.1;
    }
    box.scale.y = 1 / width * index * 0.05;
    if (box.scale.y < 0.1) {
      box.scale.y = 0.1;
    }
  });
});
controller2.position.y = 0.15;
guiGroup.add(controller2);

var controller3 = gui.add(state, 'offset', 0.001, 0.1);
controller3.position.y = 0.3;
guiGroup.add(controller3);

},{"./vrdatgui":4,"./vrpad":8,"./vrviewer":9}],2:[function(require,module,exports){
'use strict';

var assign = require('object-assign');

module.exports = function createSDFShader(opt) {
  opt = opt || {};
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001;
  var precision = opt.precision || 'highp';
  var color = opt.color;
  var map = opt.map;

  // remove to satisfy r73
  delete opt.map;
  delete opt.color;
  delete opt.precision;
  delete opt.opacity;

  return assign({
    uniforms: {
      opacity: { type: 'f', value: opacity },
      map: { type: 't', value: map || new THREE.Texture() },
      color: { type: 'c', value: new THREE.Color(color) }
    },
    vertexShader: ['attribute vec2 uv;', 'attribute vec4 position;', 'uniform mat4 projectionMatrix;', 'uniform mat4 modelViewMatrix;', 'varying vec2 vUv;', 'void main() {', 'vUv = uv;', 'gl_Position = projectionMatrix * modelViewMatrix * position;', '}'].join('\n'),
    fragmentShader: ['#ifdef GL_OES_standard_derivatives', '#extension GL_OES_standard_derivatives : enable', '#endif', 'precision ' + precision + ' float;', 'uniform float opacity;', 'uniform vec3 color;', 'uniform sampler2D map;', 'varying vec2 vUv;', 'float aastep(float value) {', '  #ifdef GL_OES_standard_derivatives', '    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;', '  #else', '    float afwidth = (1.0 / 32.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));', '  #endif', '  return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);', '}', 'void main() {', '  vec4 texColor = texture2D(map, vUv);', '  float alpha = aastep(texColor.a);', '  gl_FragColor = vec4(color, opacity * alpha);', alphaTest === 0 ? '' : '  if (gl_FragColor.a < ' + alphaTest + ') discard;', '}'].join('\n')
  }, opt);
};

},{"object-assign":35}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TextureText;
function TextureText() {
  var cw = 1024;
  var ch = 1024;

  var canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;

  var ctx = canvas.getContext('2d');
  ctx.font = '32px Lucida Sans Unicode';

  //  what a hack
  var lineHeight = ctx.measureText('M').width * 1.5;

  ctx.fillStyle = 'white';

  var textList = [];
  var texture = new THREE.Texture(canvas);

  // ctx.beginPath();
  // ctx.rect( 0, 0, 100, 100 );
  // ctx.fill();

  function add(str) {
    var id = textList.length;

    textList.push(str);

    drawText(str, id);

    var textureTop = lineHeight * id;
    var width = ctx.measureText(str).width;
    return {
      x1: 0, y1: textureTop / ch,
      x2: 0 + width / cw, y2: (textureTop + lineHeight) / ch,
      width: width / cw, height: lineHeight / ch,
      updateText: function updateText() {}
    };
  }

  function drawText(str, idx) {
    var top = lineHeight * (idx + 1);

    ctx.fillText(str, 0, top);
    texture.needsUpdate = true;
  }

  function appendCanvas() {
    document.body.appendChild(canvas);
  }

  function getTexture() {
    return texture;
  }

  return {
    add: add,
    getTexture: getTexture,
    appendCanvas: appendCanvas
  };
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = VRDATGUI;

var _loadBmfont = require('load-bmfont');

var _loadBmfont2 = _interopRequireDefault(_loadBmfont);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _textureText = require('../textureText');

var _textureText2 = _interopRequireDefault(_textureText);

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

var _sdftext = require('./sdftext');

var SDFText = _interopRequireWildcard(_sdftext);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function VRDATGUI(THREE) {

  var textMaterial = SDFText.createMaterial();

  var inputObjects = [];
  var controllers = [];

  var events = new _events2.default();

  var DEFAULT_FNT = 'fonts/lucidasansunicode.fnt';

  (0, _loadBmfont2.default)(DEFAULT_FNT, function (err, font) {
    if (err) {
      console.warn(err);
    }
    events.emit('fontLoaded', font);
  });

  var textCreator = SDFText.creator(textMaterial, events);

  function addInputObject(object) {
    inputObjects.push({
      box: new THREE.Box3(),
      object: object
    });
  }

  function add(object, propertyName) {
    var min = arguments.length <= 2 || arguments[2] === undefined ? 0.0 : arguments[2];
    var max = arguments.length <= 3 || arguments[3] === undefined ? 100.0 : arguments[3];


    var slider = (0, _slider2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object, min: min, max: max,
      initialValue: object[propertyName]
    });

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

},{"../textureText":3,"./sdftext":5,"./slider":6,"events":19,"load-bmfont":20}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMaterial = createMaterial;
exports.creator = creator;

var _sdf = require('../shaders/sdf');

var _sdf2 = _interopRequireDefault(_sdf);

var _threeBmfontText = require('three-bmfont-text');

var _threeBmfontText2 = _interopRequireDefault(_threeBmfontText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMaterial() {

  var loader = new THREE.TextureLoader();
  loader.load('fonts/lucidasansunicode.png', function (texture) {
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    material.uniforms.map.value = texture;

    //  TODO
    //  add aniso
  });

  var material = new THREE.RawShaderMaterial((0, _sdf2.default)({
    side: THREE.DoubleSide,
    transparent: true,
    color: 'rgb(255, 255, 255)'
  }));

  return material;
}

function creator(material, events) {

  var font = void 0;

  events.on('fontLoaded', function (font) {
    font = font;
  });

  function createText(str, font) {

    var geometry = (0, _threeBmfontText2.default)({
      text: str,
      width: 1000,
      flipY: true,
      font: font
    });

    var layout = geometry.layout;

    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.multiply(new THREE.Vector3(1, -1, 1));
    mesh.scale.multiplyScalar(0.001);

    mesh.position.y = layout.height * 0.5 * 0.001;

    return mesh;
  }

  function create(str) {
    var group = new THREE.Group();

    var mesh = void 0;

    if (font) {
      mesh = createText(str, font);
      group.add(mesh);
      group.layout = mesh.geometry.layout;
    } else {
      events.on('fontLoaded', function (font) {
        mesh = createText(str, font);
        group.add(mesh);
        group.layout = mesh.geometry.layout;
      });
    }

    group.update = function (str) {
      if (mesh) {
        mesh.geometry.update(str);
      }
    };

    return group;
  }

  return {
    create: create,
    getMaterial: function getMaterial() {
      return material;
    }
  };
}

},{"../shaders/sdf":2,"three-bmfont-text":36}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSlider;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_COLOR = 0x2FA1D6;
var HIGHLIGHT_COLOR = 0x40BDF7;
var INTERACTION_COLOR = 0xBDE8FC;
var EMISSIVE_COLOR = 0x222222;

function createSlider() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var textCreator = _ref.textCreator;
  var object = _ref.object;
  var _ref$propertyName = _ref.propertyName;
  var propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName;
  var _ref$initialValue = _ref.initialValue;
  var initialValue = _ref$initialValue === undefined ? 0.0 : _ref$initialValue;
  var min = _ref.min;
  var max = _ref.max;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 4 : _ref$width;


  var group = new THREE.Group();

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

  var descriptorLabel = (0, _textlabel2.default)(textCreator, propertyName);
  descriptorLabel.position.x = 0.03;

  var valueLabel = (0, _textlabel2.default)(textCreator, initialValue.toFixed(2));
  valueLabel.position.x = 0.03;
  valueLabel.position.y = -0.05;

  group.add(filledVolume, outline, outlineMesh, endLocator, descriptorLabel, valueLabel);

  var boundingBox = new THREE.Box3();

  var state = {
    alpha: 1.0,
    value: initialValue,
    hover: false,
    press: false
  };

  state.alpha = map_range(initialValue, min, max, 0.0, 1.0);
  filledVolume.scale.x = state.alpha * width;

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
      state.alpha = pointAlpha;

      filledVolume.scale.x = state.alpha * width;

      state.value = map_range(state.alpha, 0.0, 1.0, min, max);
      if (state.value < min) {
        state.value = min;
      }
      if (state.value > max) {
        state.value = max;
      }

      object[propertyName] = state.value;

      valueLabel.setNumber(state.value);

      if (onChangedCB) {
        onChangedCB(state.value);
      }
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

  var onChangedCB = void 0;
  var onFinishChangeCB = void 0;

  group.onChanged = function (callback) {
    onChangedCB = callback;
    return group;
  };

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

function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

},{"./textlabel":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTextLabel;
function createTextLabel(textCreator, str) {

  var group = new THREE.Group();

  var text = textCreator.create(str);
  group.add(text);

  group.setString = function (str) {
    text.update(str.toString());
  };

  group.setNumber = function (str) {
    text.update(str.toFixed(2));
  };

  text.position.z = 0.015;

  var backBounds = 0.01;
  var labelBackGeometry = new THREE.BoxGeometry(0.4, 0.04, 0.029, 1, 1, 1);

  var labelBackMesh = new THREE.Mesh(labelBackGeometry, new THREE.MeshBasicMaterial({ color: 0x131313 }));
  labelBackMesh.position.y = 0.03;
  labelBackMesh.position.x = 0.18;
  group.add(labelBackMesh);

  // labelGroup.position.x = labelBounds.width * 0.5;
  // labelGroup.position.y = labelBounds.height * 0.5;


  return group;
}

},{}],8:[function(require,module,exports){
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

},{"events":19}],9:[function(require,module,exports){
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

},{"./objloader":10,"./vivecontroller":11,"./vrcontrols":12,"./vreffects":13,"./webvr":14,"events":19}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":16,"ieee754":17,"isarray":18}],16:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],17:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],18:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
(function (Buffer){
var xhr = require('xhr')
var noop = function(){}
var parseASCII = require('parse-bmfont-ascii')
var parseXML = require('parse-bmfont-xml')
var readBinary = require('parse-bmfont-binary')
var isBinaryFormat = require('./lib/is-binary')
var xtend = require('xtend')

var xml2 = (function hasXML2() {
  return window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest
})()

module.exports = function(opt, cb) {
  cb = typeof cb === 'function' ? cb : noop

  if (typeof opt === 'string')
    opt = { uri: opt }
  else if (!opt)
    opt = {}

  var expectBinary = opt.binary
  if (expectBinary)
    opt = getBinaryOpts(opt)

  xhr(opt, function(err, res, body) {
    if (err)
      return cb(err)
    if (!/^2/.test(res.statusCode))
      return cb(new Error('http status code: '+res.statusCode))
    if (!body)
      return cb(new Error('no body result'))

    var binary = false 

    //if the response type is an array buffer,
    //we need to convert it into a regular Buffer object
    if (isArrayBuffer(body)) {
      var array = new Uint8Array(body)
      body = new Buffer(array, 'binary')
    }

    //now check the string/Buffer response
    //and see if it has a binary BMF header
    if (isBinaryFormat(body)) {
      binary = true
      //if we have a string, turn it into a Buffer
      if (typeof body === 'string') 
        body = new Buffer(body, 'binary')
    } 

    //we are not parsing a binary format, just ASCII/XML/etc
    if (!binary) {
      //might still be a buffer if responseType is 'arraybuffer'
      if (Buffer.isBuffer(body))
        body = body.toString(opt.encoding)
      body = body.trim()
    }

    var result
    try {
      var type = res.headers['content-type']
      if (binary)
        result = readBinary(body)
      else if (/json/.test(type) || body.charAt(0) === '{')
        result = JSON.parse(body)
      else if (/xml/.test(type)  || body.charAt(0) === '<')
        result = parseXML(body)
      else
        result = parseASCII(body)
    } catch (e) {
      cb(new Error('error parsing font '+e.message))
      cb = noop
    }
    cb(null, result)
  })
}

function isArrayBuffer(arr) {
  var str = Object.prototype.toString
  return str.call(arr) === '[object ArrayBuffer]'
}

function getBinaryOpts(opt) {
  //IE10+ and other modern browsers support array buffers
  if (xml2)
    return xtend(opt, { responseType: 'arraybuffer' })
  
  if (typeof window.XMLHttpRequest === 'undefined')
    throw new Error('your browser does not support XHR loading')

  //IE9 and XML1 browsers could still use an override
  var req = new window.XMLHttpRequest()
  req.overrideMimeType('text/plain; charset=x-user-defined')
  return xtend({
    xhr: req
  }, opt)
}
}).call(this,require("buffer").Buffer)

},{"./lib/is-binary":21,"buffer":15,"parse-bmfont-ascii":23,"parse-bmfont-binary":24,"parse-bmfont-xml":25,"xhr":28,"xtend":34}],21:[function(require,module,exports){
(function (Buffer){
var equal = require('buffer-equal')
var HEADER = new Buffer([66, 77, 70, 3])

module.exports = function(buf) {
  if (typeof buf === 'string')
    return buf.substring(0, 3) === 'BMF'
  return buf.length > 4 && equal(buf.slice(0, 4), HEADER)
}
}).call(this,require("buffer").Buffer)

},{"buffer":15,"buffer-equal":22}],22:[function(require,module,exports){
var Buffer = require('buffer').Buffer; // for use with browserify

module.exports = function (a, b) {
    if (!Buffer.isBuffer(a)) return undefined;
    if (!Buffer.isBuffer(b)) return undefined;
    if (typeof a.equals === 'function') return a.equals(b);
    if (a.length !== b.length) return false;
    
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    
    return true;
};

},{"buffer":15}],23:[function(require,module,exports){
module.exports = function parseBMFontAscii(data) {
  if (!data)
    throw new Error('no data provided')
  data = data.toString().trim()

  var output = {
    pages: [],
    chars: [],
    kernings: []
  }

  var lines = data.split(/\r\n?|\n/g)

  if (lines.length === 0)
    throw new Error('no data in BMFont file')

  for (var i = 0; i < lines.length; i++) {
    var lineData = splitLine(lines[i], i)
    if (!lineData) //skip empty lines
      continue

    if (lineData.key === 'page') {
      if (typeof lineData.data.id !== 'number')
        throw new Error('malformed file at line ' + i + ' -- needs page id=N')
      if (typeof lineData.data.file !== 'string')
        throw new Error('malformed file at line ' + i + ' -- needs page file="path"')
      output.pages[lineData.data.id] = lineData.data.file
    } else if (lineData.key === 'chars' || lineData.key === 'kernings') {
      //... do nothing for these two ...
    } else if (lineData.key === 'char') {
      output.chars.push(lineData.data)
    } else if (lineData.key === 'kerning') {
      output.kernings.push(lineData.data)
    } else {
      output[lineData.key] = lineData.data
    }
  }

  return output
}

function splitLine(line, idx) {
  line = line.replace(/\t+/g, ' ').trim()
  if (!line)
    return null

  var space = line.indexOf(' ')
  if (space === -1) 
    throw new Error("no named row at line " + idx)

  var key = line.substring(0, space)

  line = line.substring(space + 1)
  //clear "letter" field as it is non-standard and
  //requires additional complexity to parse " / = symbols
  line = line.replace(/letter=[\'\"]\S+[\'\"]/gi, '')  
  line = line.split("=")
  line = line.map(function(str) {
    return str.trim().match((/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g))
  })

  var data = []
  for (var i = 0; i < line.length; i++) {
    var dt = line[i]
    if (i === 0) {
      data.push({
        key: dt[0],
        data: ""
      })
    } else if (i === line.length - 1) {
      data[data.length - 1].data = parseData(dt[0])
    } else {
      data[data.length - 1].data = parseData(dt[0])
      data.push({
        key: dt[1],
        data: ""
      })
    }
  }

  var out = {
    key: key,
    data: {}
  }

  data.forEach(function(v) {
    out.data[v.key] = v.data;
  })

  return out
}

function parseData(data) {
  if (!data || data.length === 0)
    return ""

  if (data.indexOf('"') === 0 || data.indexOf("'") === 0)
    return data.substring(1, data.length - 1)
  if (data.indexOf(',') !== -1)
    return parseIntList(data)
  return parseInt(data, 10)
}

function parseIntList(data) {
  return data.split(',').map(function(val) {
    return parseInt(val, 10)
  })
}
},{}],24:[function(require,module,exports){
var HEADER = [66, 77, 70]

module.exports = function readBMFontBinary(buf) {
  if (buf.length < 6)
    throw new Error('invalid buffer length for BMFont')

  var header = HEADER.every(function(byte, i) {
    return buf.readUInt8(i) === byte
  })

  if (!header)
    throw new Error('BMFont missing BMF byte header')

  var i = 3
  var vers = buf.readUInt8(i++)
  if (vers > 3)
    throw new Error('Only supports BMFont Binary v3 (BMFont App v1.10)')
  
  var target = { kernings: [], chars: [] }
  for (var b=0; b<5; b++)
    i += readBlock(target, buf, i)
  return target
}

function readBlock(target, buf, i) {
  if (i > buf.length-1)
    return 0

  var blockID = buf.readUInt8(i++)
  var blockSize = buf.readInt32LE(i)
  i += 4

  switch(blockID) {
    case 1: 
      target.info = readInfo(buf, i)
      break
    case 2:
      target.common = readCommon(buf, i)
      break
    case 3:
      target.pages = readPages(buf, i, blockSize)
      break
    case 4:
      target.chars = readChars(buf, i, blockSize)
      break
    case 5:
      target.kernings = readKernings(buf, i, blockSize)
      break
  }
  return 5 + blockSize
}

function readInfo(buf, i) {
  var info = {}
  info.size = buf.readInt16LE(i)

  var bitField = buf.readUInt8(i+2)
  info.smooth = (bitField >> 7) & 1
  info.unicode = (bitField >> 6) & 1
  info.italic = (bitField >> 5) & 1
  info.bold = (bitField >> 4) & 1
  
  //fixedHeight is only mentioned in binary spec 
  if ((bitField >> 3) & 1)
    info.fixedHeight = 1
  
  info.charset = buf.readUInt8(i+3) || ''
  info.stretchH = buf.readUInt16LE(i+4)
  info.aa = buf.readUInt8(i+6)
  info.padding = [
    buf.readInt8(i+7),
    buf.readInt8(i+8),
    buf.readInt8(i+9),
    buf.readInt8(i+10)
  ]
  info.spacing = [
    buf.readInt8(i+11),
    buf.readInt8(i+12)
  ]
  info.outline = buf.readUInt8(i+13)
  info.face = readStringNT(buf, i+14)
  return info
}

function readCommon(buf, i) {
  var common = {}
  common.lineHeight = buf.readUInt16LE(i)
  common.base = buf.readUInt16LE(i+2)
  common.scaleW = buf.readUInt16LE(i+4)
  common.scaleH = buf.readUInt16LE(i+6)
  common.pages = buf.readUInt16LE(i+8)
  var bitField = buf.readUInt8(i+10)
  common.packed = 0
  common.alphaChnl = buf.readUInt8(i+11)
  common.redChnl = buf.readUInt8(i+12)
  common.greenChnl = buf.readUInt8(i+13)
  common.blueChnl = buf.readUInt8(i+14)
  return common
}

function readPages(buf, i, size) {
  var pages = []
  var text = readNameNT(buf, i)
  var len = text.length+1
  var count = size / len
  for (var c=0; c<count; c++) {
    pages[c] = buf.slice(i, i+text.length).toString('utf8')
    i += len
  }
  return pages
}

function readChars(buf, i, blockSize) {
  var chars = []

  var count = blockSize / 20
  for (var c=0; c<count; c++) {
    var char = {}
    var off = c*20
    char.id = buf.readUInt32LE(i + 0 + off)
    char.x = buf.readUInt16LE(i + 4 + off)
    char.y = buf.readUInt16LE(i + 6 + off)
    char.width = buf.readUInt16LE(i + 8 + off)
    char.height = buf.readUInt16LE(i + 10 + off)
    char.xoffset = buf.readInt16LE(i + 12 + off)
    char.yoffset = buf.readInt16LE(i + 14 + off)
    char.xadvance = buf.readInt16LE(i + 16 + off)
    char.page = buf.readUInt8(i + 18 + off)
    char.chnl = buf.readUInt8(i + 19 + off)
    chars[c] = char
  }
  return chars
}

function readKernings(buf, i, blockSize) {
  var kernings = []
  var count = blockSize / 10
  for (var c=0; c<count; c++) {
    var kern = {}
    var off = c*10
    kern.first = buf.readUInt32LE(i + 0 + off)
    kern.second = buf.readUInt32LE(i + 4 + off)
    kern.amount = buf.readInt16LE(i + 8 + off)
    kernings[c] = kern
  }
  return kernings
}

function readNameNT(buf, offset) {
  var pos=offset
  for (; pos<buf.length; pos++) {
    if (buf[pos] === 0x00) 
      break
  }
  return buf.slice(offset, pos)
}

function readStringNT(buf, offset) {
  return readNameNT(buf, offset).toString('utf8')
}
},{}],25:[function(require,module,exports){
var parseAttributes = require('./parse-attribs')
var parseFromString = require('xml-parse-from-string')

//In some cases element.attribute.nodeName can return
//all lowercase values.. so we need to map them to the correct 
//case
var NAME_MAP = {
  scaleh: 'scaleH',
  scalew: 'scaleW',
  stretchh: 'stretchH',
  lineheight: 'lineHeight',
  alphachnl: 'alphaChnl',
  redchnl: 'redChnl',
  greenchnl: 'greenChnl',
  bluechnl: 'blueChnl'
}

module.exports = function parse(data) {
  data = data.toString()
  
  var xmlRoot = parseFromString(data)
  var output = {
    pages: [],
    chars: [],
    kernings: []
  }

  //get config settings
  ;['info', 'common'].forEach(function(key) {
    var element = xmlRoot.getElementsByTagName(key)[0]
    if (element)
      output[key] = parseAttributes(getAttribs(element))
  })

  //get page info
  var pageRoot = xmlRoot.getElementsByTagName('pages')[0]
  if (!pageRoot)
    throw new Error('malformed file -- no <pages> element')
  var pages = pageRoot.getElementsByTagName('page')
  for (var i=0; i<pages.length; i++) {
    var p = pages[i]
    var id = parseInt(p.getAttribute('id'), 10)
    var file = p.getAttribute('file')
    if (isNaN(id))
      throw new Error('malformed file -- page "id" attribute is NaN')
    if (!file)
      throw new Error('malformed file -- needs page "file" attribute')
    output.pages[parseInt(id, 10)] = file
  }

  //get kernings / chars
  ;['chars', 'kernings'].forEach(function(key) {
    var element = xmlRoot.getElementsByTagName(key)[0]
    if (!element)
      return
    var childTag = key.substring(0, key.length-1)
    var children = element.getElementsByTagName(childTag)
    for (var i=0; i<children.length; i++) {      
      var child = children[i]
      output[key].push(parseAttributes(getAttribs(child)))
    }
  })
  return output
}

function getAttribs(element) {
  var attribs = getAttribList(element)
  return attribs.reduce(function(dict, attrib) {
    var key = mapName(attrib.nodeName)
    dict[key] = attrib.nodeValue
    return dict
  }, {})
}

function getAttribList(element) {
  //IE8+ and modern browsers
  var attribs = []
  for (var i=0; i<element.attributes.length; i++)
    attribs.push(element.attributes[i])
  return attribs
}

function mapName(nodeName) {
  return NAME_MAP[nodeName.toLowerCase()] || nodeName
}
},{"./parse-attribs":26,"xml-parse-from-string":27}],26:[function(require,module,exports){
//Some versions of GlyphDesigner have a typo
//that causes some bugs with parsing. 
//Need to confirm with recent version of the software
//to see whether this is still an issue or not.
var GLYPH_DESIGNER_ERROR = 'chasrset'

module.exports = function parseAttributes(obj) {
  if (GLYPH_DESIGNER_ERROR in obj) {
    obj['charset'] = obj[GLYPH_DESIGNER_ERROR]
    delete obj[GLYPH_DESIGNER_ERROR]
  }

  for (var k in obj) {
    if (k === 'face' || k === 'charset') 
      continue
    else if (k === 'padding' || k === 'spacing')
      obj[k] = parseIntList(obj[k])
    else
      obj[k] = parseInt(obj[k], 10) 
  }
  return obj
}

function parseIntList(data) {
  return data.split(',').map(function(val) {
    return parseInt(val, 10)
  })
}
},{}],27:[function(require,module,exports){
module.exports = (function xmlparser() {
  //common browsers
  if (typeof window.DOMParser !== 'undefined') {
    return function(str) {
      var parser = new window.DOMParser()
      return parser.parseFromString(str, 'application/xml')
    }
  } 

  //IE8 fallback
  if (typeof window.ActiveXObject !== 'undefined'
      && new window.ActiveXObject('Microsoft.XMLDOM')) {
    return function(str) {
      var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM")
      xmlDoc.async = "false"
      xmlDoc.loadXML(str)
      return xmlDoc
    }
  }

  //last resort fallback
  return function(str) {
    var div = document.createElement('div')
    div.innerHTML = str
    return div
  }
})()
},{}],28:[function(require,module,exports){
"use strict";
var window = require("global/window")
var isFunction = require("is-function")
var parseHeaders = require("parse-headers")
var xtend = require("xtend")

module.exports = createXHR
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
    createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
    }
})

function forEachArray(array, iterator) {
    for (var i = 0; i < array.length; i++) {
        iterator(array[i])
    }
}

function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function initParams(uri, options, callback) {
    var params = uri

    if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
            params = {uri:uri}
        }
    } else {
        params = xtend(options, {uri: uri})
    }

    params.callback = callback
    return params
}

function createXHR(uri, options, callback) {
    options = initParams(uri, options, callback)
    return _createXHR(options)
}

function _createXHR(options) {
    if(typeof options.callback === "undefined"){
        throw new Error("callback argument missing")
    }

    var called = false
    var callback = function cbOnce(err, response, body){
        if(!called){
            called = true
            options.callback(err, response, body)
        }
    }

    function readystatechange() {
        if (xhr.readyState === 4) {
            loadFunc()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else {
            body = xhr.responseText || getXml(xhr)
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    var failureResponse = {
                body: undefined,
                headers: {},
                statusCode: 0,
                method: method,
                url: uri,
                rawRequest: xhr
            }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        return callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        return callback(err, response, response.body)
    }

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data || null
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer

    if ("json" in options) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            aborted=true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr


}

function getXml(xhr) {
    if (xhr.responseType === "document") {
        return xhr.responseXML
    }
    var firefoxBugTakenEffect = xhr.status === 204 && xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror"
    if (xhr.responseType === "" && !firefoxBugTakenEffect) {
        return xhr.responseXML
    }

    return null
}

function noop() {}

},{"global/window":29,"is-function":30,"parse-headers":33,"xtend":34}],29:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],30:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],31:[function(require,module,exports){
var isFunction = require('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":30}],32:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],33:[function(require,module,exports){
var trim = require('trim')
  , forEach = require('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":31,"trim":32}],34:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],35:[function(require,module,exports){
'use strict';
/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],36:[function(require,module,exports){
var createLayout = require('layout-bmfont-text')
var inherits = require('inherits')
var createIndices = require('quad-indices')
var buffer = require('three-buffer-vertex-data')
var assign = require('object-assign')

var vertices = require('./lib/vertices')
var utils = require('./lib/utils')

var Base = THREE.BufferGeometry

module.exports = function createTextGeometry (opt) {
  return new TextGeometry(opt)
}

function TextGeometry (opt) {
  Base.call(this)

  if (typeof opt === 'string') {
    opt = { text: opt }
  }

  // use these as default values for any subsequent
  // calls to update()
  this._opt = assign({}, opt)

  // also do an initial setup...
  if (opt) this.update(opt)
}

inherits(TextGeometry, Base)

TextGeometry.prototype.update = function (opt) {
  if (typeof opt === 'string') {
    opt = { text: opt }
  }

  // use constructor defaults
  opt = assign({}, this._opt, opt)

  if (!opt.font) {
    throw new TypeError('must specify a { font } in options')
  }

  this.layout = createLayout(opt)

  // get vec2 texcoords
  var flipY = opt.flipY !== false

  // the desired BMFont data
  var font = opt.font

  // determine texture size from font file
  var texWidth = font.common.scaleW
  var texHeight = font.common.scaleH

  // get visible glyphs
  var glyphs = this.layout.glyphs.filter(function (glyph) {
    var bitmap = glyph.data
    return bitmap.width * bitmap.height > 0
  })

  // provide visible glyphs for convenience
  this.visibleGlyphs = glyphs

  // get common vertex data
  var positions = vertices.positions(glyphs)
  var uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY)
  var indices = createIndices({
    clockwise: true,
    type: 'uint16',
    count: glyphs.length
  })

  // update vertex data
  buffer.index(this, indices, 1, 'uint16')
  buffer.attr(this, 'position', positions, 2)
  buffer.attr(this, 'uv', uvs, 2)

  // update multipage data
  if (!opt.multipage && 'page' in this.attributes) {
    // disable multipage rendering
    this.removeAttribute('page')
  } else if (opt.multipage) {
    var pages = vertices.pages(glyphs)
    // enable multipage rendering
    buffer.attr(this, 'page', pages, 1)
  }
}

TextGeometry.prototype.computeBoundingSphere = function () {
  if (this.boundingSphere === null) {
    this.boundingSphere = new THREE.Sphere()
  }

  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    this.boundingSphere.radius = 0
    this.boundingSphere.center.set(0, 0, 0)
    return
  }
  utils.computeSphere(positions, this.boundingSphere)
  if (isNaN(this.boundingSphere.radius)) {
    console.error('THREE.BufferGeometry.computeBoundingSphere(): ' +
      'Computed radius is NaN. The ' +
      '"position" attribute is likely to have NaN values.')
  }
}

TextGeometry.prototype.computeBoundingBox = function () {
  if (this.boundingBox === null) {
    this.boundingBox = new THREE.Box3()
  }

  var bbox = this.boundingBox
  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    bbox.makeEmpty()
    return
  }
  utils.computeBox(positions, bbox)
}

},{"./lib/utils":37,"./lib/vertices":38,"inherits":39,"layout-bmfont-text":40,"object-assign":45,"quad-indices":46,"three-buffer-vertex-data":50}],37:[function(require,module,exports){
var itemSize = 2
var box = { min: [0, 0], max: [0, 0] }

function bounds (positions) {
  var count = positions.length / itemSize
  box.min[0] = positions[0]
  box.min[1] = positions[1]
  box.max[0] = positions[0]
  box.max[1] = positions[1]

  for (var i = 0; i < count; i++) {
    var x = positions[i * itemSize + 0]
    var y = positions[i * itemSize + 1]
    box.min[0] = Math.min(x, box.min[0])
    box.min[1] = Math.min(y, box.min[1])
    box.max[0] = Math.max(x, box.max[0])
    box.max[1] = Math.max(y, box.max[1])
  }
}

module.exports.computeBox = function (positions, output) {
  bounds(positions)
  output.min.set(box.min[0], box.min[1], 0)
  output.max.set(box.max[0], box.max[1], 0)
}

module.exports.computeSphere = function (positions, output) {
  bounds(positions)
  var minX = box.min[0]
  var minY = box.min[1]
  var maxX = box.max[0]
  var maxY = box.max[1]
  var width = maxX - minX
  var height = maxY - minY
  var length = Math.sqrt(width * width + height * height)
  output.center.set(minX + width / 2, minY + height / 2, 0)
  output.radius = length / 2
}

},{}],38:[function(require,module,exports){
module.exports.pages = function pages (glyphs) {
  var pages = new Float32Array(glyphs.length * 4 * 1)
  var i = 0
  glyphs.forEach(function (glyph) {
    var id = glyph.data.page || 0
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
  })
  return pages
}

module.exports.uvs = function uvs (glyphs, texWidth, texHeight, flipY) {
  var uvs = new Float32Array(glyphs.length * 4 * 2)
  var i = 0
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data
    var bw = (bitmap.x + bitmap.width)
    var bh = (bitmap.y + bitmap.height)

    // top left position
    var u0 = bitmap.x / texWidth
    var v1 = bitmap.y / texHeight
    var u1 = bw / texWidth
    var v0 = bh / texHeight

    if (flipY) {
      v1 = (texHeight - bitmap.y) / texHeight
      v0 = (texHeight - bh) / texHeight
    }

    // BL
    uvs[i++] = u0
    uvs[i++] = v1
    // TL
    uvs[i++] = u0
    uvs[i++] = v0
    // TR
    uvs[i++] = u1
    uvs[i++] = v0
    // BR
    uvs[i++] = u1
    uvs[i++] = v1
  })
  return uvs
}

module.exports.positions = function positions (glyphs) {
  var positions = new Float32Array(glyphs.length * 4 * 2)
  var i = 0
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data

    // bottom left position
    var x = glyph.position[0] + bitmap.xoffset
    var y = glyph.position[1] + bitmap.yoffset

    // quad size
    var w = bitmap.width
    var h = bitmap.height

    // BL
    positions[i++] = x
    positions[i++] = y
    // TL
    positions[i++] = x
    positions[i++] = y + h
    // TR
    positions[i++] = x + w
    positions[i++] = y + h
    // BR
    positions[i++] = x + w
    positions[i++] = y
  })
  return positions
}

},{}],39:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],40:[function(require,module,exports){
var wordWrap = require('word-wrapper')
var xtend = require('xtend')
var findChar = require('indexof-property')('id')
var number = require('as-number')

var X_HEIGHTS = ['x', 'e', 'a', 'o', 'n', 's', 'r', 'c', 'u', 'm', 'v', 'w', 'z']
var M_WIDTHS = ['m', 'w']
var CAP_HEIGHTS = ['H', 'I', 'N', 'E', 'F', 'K', 'L', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']


var TAB_ID = '\t'.charCodeAt(0)
var SPACE_ID = ' '.charCodeAt(0)
var ALIGN_LEFT = 0, 
    ALIGN_CENTER = 1, 
    ALIGN_RIGHT = 2

module.exports = function createLayout(opt) {
  return new TextLayout(opt)
}

function TextLayout(opt) {
  this.glyphs = []
  this._measure = this.computeMetrics.bind(this)
  this.update(opt)
}

TextLayout.prototype.update = function(opt) {
  opt = xtend({
    measure: this._measure
  }, opt)
  this._opt = opt
  this._opt.tabSize = number(this._opt.tabSize, 4)

  if (!opt.font)
    throw new Error('must provide a valid bitmap font')

  var glyphs = this.glyphs
  var text = opt.text||'' 
  var font = opt.font
  this._setupSpaceGlyphs(font)
  
  var lines = wordWrap.lines(text, opt)
  var minWidth = opt.width || 0

  //clear glyphs
  glyphs.length = 0

  //get max line width
  var maxLineWidth = lines.reduce(function(prev, line) {
    return Math.max(prev, line.width, minWidth)
  }, 0)

  //the pen position
  var x = 0
  var y = 0
  var lineHeight = number(opt.lineHeight, font.common.lineHeight)
  var baseline = font.common.base
  var descender = lineHeight-baseline
  var letterSpacing = opt.letterSpacing || 0
  var height = lineHeight * lines.length - descender
  var align = getAlignType(this._opt.align)

  //draw text along baseline
  y -= height
  
  //the metrics for this text layout
  this._width = maxLineWidth
  this._height = height
  this._descender = lineHeight - baseline
  this._baseline = baseline
  this._xHeight = getXHeight(font)
  this._capHeight = getCapHeight(font)
  this._lineHeight = lineHeight
  this._ascender = lineHeight - descender - this._xHeight
    
  //layout each glyph
  var self = this
  lines.forEach(function(line, lineIndex) {
    var start = line.start
    var end = line.end
    var lineWidth = line.width
    var lastGlyph
    
    //for each glyph in that line...
    for (var i=start; i<end; i++) {
      var id = text.charCodeAt(i)
      var glyph = self.getGlyph(font, id)
      if (glyph) {
        if (lastGlyph) 
          x += getKerning(font, lastGlyph.id, glyph.id)

        var tx = x
        if (align === ALIGN_CENTER) 
          tx += (maxLineWidth-lineWidth)/2
        else if (align === ALIGN_RIGHT)
          tx += (maxLineWidth-lineWidth)

        glyphs.push({
          position: [tx, y],
          data: glyph,
          index: i,
          line: lineIndex
        })  

        //move pen forward
        x += glyph.xadvance + letterSpacing
        lastGlyph = glyph
      }
    }

    //next line down
    y += lineHeight
    x = 0
  })
  this._linesTotal = lines.length;
}

TextLayout.prototype._setupSpaceGlyphs = function(font) {
  //These are fallbacks, when the font doesn't include
  //' ' or '\t' glyphs
  this._fallbackSpaceGlyph = null
  this._fallbackTabGlyph = null

  if (!font.chars || font.chars.length === 0)
    return

  //try to get space glyph
  //then fall back to the 'm' or 'w' glyphs
  //then fall back to the first glyph available
  var space = getGlyphById(font, SPACE_ID) 
          || getMGlyph(font) 
          || font.chars[0]

  //and create a fallback for tab
  var tabWidth = this._opt.tabSize * space.xadvance
  this._fallbackSpaceGlyph = space
  this._fallbackTabGlyph = xtend(space, {
    x: 0, y: 0, xadvance: tabWidth, id: TAB_ID, 
    xoffset: 0, yoffset: 0, width: 0, height: 0
  })
}

TextLayout.prototype.getGlyph = function(font, id) {
  var glyph = getGlyphById(font, id)
  if (glyph)
    return glyph
  else if (id === TAB_ID) 
    return this._fallbackTabGlyph
  else if (id === SPACE_ID) 
    return this._fallbackSpaceGlyph
  return null
}

TextLayout.prototype.computeMetrics = function(text, start, end, width) {
  var letterSpacing = this._opt.letterSpacing || 0
  var font = this._opt.font
  var curPen = 0
  var curWidth = 0
  var count = 0
  var glyph
  var lastGlyph

  if (!font.chars || font.chars.length === 0) {
    return {
      start: start,
      end: start,
      width: 0
    }
  }

  end = Math.min(text.length, end)
  for (var i=start; i < end; i++) {
    var id = text.charCodeAt(i)
    var glyph = this.getGlyph(font, id)

    if (glyph) {
      //move pen forward
      var xoff = glyph.xoffset
      var kern = lastGlyph ? getKerning(font, lastGlyph.id, glyph.id) : 0
      curPen += kern

      var nextPen = curPen + glyph.xadvance + letterSpacing
      var nextWidth = curPen + glyph.width

      //we've hit our limit; we can't move onto the next glyph
      if (nextWidth >= width || nextPen >= width)
        break

      //otherwise continue along our line
      curPen = nextPen
      curWidth = nextWidth
      lastGlyph = glyph
    }
    count++
  }
  
  //make sure rightmost edge lines up with rendered glyphs
  if (lastGlyph)
    curWidth += lastGlyph.xoffset

  return {
    start: start,
    end: start + count,
    width: curWidth
  }
}

//getters for the private vars
;['width', 'height', 
  'descender', 'ascender',
  'xHeight', 'baseline',
  'capHeight',
  'lineHeight' ].forEach(addGetter)

function addGetter(name) {
  Object.defineProperty(TextLayout.prototype, name, {
    get: wrapper(name),
    configurable: true
  })
}

//create lookups for private vars
function wrapper(name) {
  return (new Function([
    'return function '+name+'() {',
    '  return this._'+name,
    '}'
  ].join('\n')))()
}

function getGlyphById(font, id) {
  if (!font.chars || font.chars.length === 0)
    return null

  var glyphIdx = findChar(font.chars, id)
  if (glyphIdx >= 0)
    return font.chars[glyphIdx]
  return null
}

function getXHeight(font) {
  for (var i=0; i<X_HEIGHTS.length; i++) {
    var id = X_HEIGHTS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx].height
  }
  return 0
}

function getMGlyph(font) {
  for (var i=0; i<M_WIDTHS.length; i++) {
    var id = M_WIDTHS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx]
  }
  return 0
}

function getCapHeight(font) {
  for (var i=0; i<CAP_HEIGHTS.length; i++) {
    var id = CAP_HEIGHTS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx].height
  }
  return 0
}

function getKerning(font, left, right) {
  if (!font.kernings || font.kernings.length === 0)
    return 0

  var table = font.kernings
  for (var i=0; i<table.length; i++) {
    var kern = table[i]
    if (kern.first === left && kern.second === right)
      return kern.amount
  }
  return 0
}

function getAlignType(align) {
  if (align === 'center')
    return ALIGN_CENTER
  else if (align === 'right')
    return ALIGN_RIGHT
  return ALIGN_LEFT
}
},{"as-number":41,"indexof-property":42,"word-wrapper":43,"xtend":44}],41:[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],42:[function(require,module,exports){
module.exports = function compile(property) {
	if (!property || typeof property !== 'string')
		throw new Error('must specify property for indexof search')

	return new Function('array', 'value', 'start', [
		'start = start || 0',
		'for (var i=start; i<array.length; i++)',
		'  if (array[i]["' + property +'"] === value)',
		'      return i',
		'return -1'
	].join('\n'))
}
},{}],43:[function(require,module,exports){
var newline = /\n/
var newlineChar = '\n'
var whitespace = /\s/

module.exports = function(text, opt) {
    var lines = module.exports.lines(text, opt)
    return lines.map(function(line) {
        return text.substring(line.start, line.end)
    }).join('\n')
}

module.exports.lines = function wordwrap(text, opt) {
    opt = opt||{}

    //zero width results in nothing visible
    if (opt.width === 0 && opt.mode !== 'nowrap') 
        return []

    text = text||''
    var width = typeof opt.width === 'number' ? opt.width : Number.MAX_VALUE
    var start = Math.max(0, opt.start||0)
    var end = typeof opt.end === 'number' ? opt.end : text.length
    var mode = opt.mode

    var measure = opt.measure || monospace
    if (mode === 'pre')
        return pre(measure, text, start, end, width)
    else
        return greedy(measure, text, start, end, width, mode)
}

function idxOf(text, chr, start, end) {
    var idx = text.indexOf(chr, start)
    if (idx === -1 || idx > end)
        return end
    return idx
}

function isWhitespace(chr) {
    return whitespace.test(chr)
}

function pre(measure, text, start, end, width) {
    var lines = []
    var lineStart = start
    for (var i=start; i<end && i<text.length; i++) {
        var chr = text.charAt(i)
        var isNewline = newline.test(chr)

        //If we've reached a newline, then step down a line
        //Or if we've reached the EOF
        if (isNewline || i===end-1) {
            var lineEnd = isNewline ? i : i+1
            var measured = measure(text, lineStart, lineEnd, width)
            lines.push(measured)
            
            lineStart = i+1
        }
    }
    return lines
}

function greedy(measure, text, start, end, width, mode) {
    //A greedy word wrapper based on LibGDX algorithm
    //https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/BitmapFontCache.java
    var lines = []

    var testWidth = width
    //if 'nowrap' is specified, we only wrap on newline chars
    if (mode === 'nowrap')
        testWidth = Number.MAX_VALUE

    while (start < end && start < text.length) {
        //get next newline position
        var newLine = idxOf(text, newlineChar, start, end)

        //eat whitespace at start of line
        while (start < newLine) {
            if (!isWhitespace( text.charAt(start) ))
                break
            start++
        }

        //determine visible # of glyphs for the available width
        var measured = measure(text, start, newLine, testWidth)

        var lineEnd = start + (measured.end-measured.start)
        var nextStart = lineEnd + newlineChar.length

        //if we had to cut the line before the next newline...
        if (lineEnd < newLine) {
            //find char to break on
            while (lineEnd > start) {
                if (isWhitespace(text.charAt(lineEnd)))
                    break
                lineEnd--
            }
            if (lineEnd === start) {
                if (nextStart > start + newlineChar.length) nextStart--
                lineEnd = nextStart // If no characters to break, show all.
            } else {
                nextStart = lineEnd
                //eat whitespace at end of line
                while (lineEnd > start) {
                    if (!isWhitespace(text.charAt(lineEnd - newlineChar.length)))
                        break
                    lineEnd--
                }
            }
        }
        if (lineEnd >= start) {
            var result = measure(text, start, lineEnd, testWidth)
            lines.push(result)
        }
        start = nextStart
    }
    return lines
}

//determines the visible number of glyphs within a given width
function monospace(text, start, end, width) {
    var glyphs = Math.min(width, end-start)
    return {
        start: start,
        end: start+glyphs
    }
}
},{}],44:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],45:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],46:[function(require,module,exports){
var dtype = require('dtype')
var anArray = require('an-array')
var isBuffer = require('is-buffer')

var CW = [0, 2, 3]
var CCW = [2, 1, 3]

module.exports = function createQuadElements(array, opt) {
    //if user didn't specify an output array
    if (!array || !(anArray(array) || isBuffer(array))) {
        opt = array || {}
        array = null
    }

    if (typeof opt === 'number') //backwards-compatible
        opt = { count: opt }
    else
        opt = opt || {}

    var type = typeof opt.type === 'string' ? opt.type : 'uint16'
    var count = typeof opt.count === 'number' ? opt.count : 1
    var start = (opt.start || 0) 

    var dir = opt.clockwise !== false ? CW : CCW,
        a = dir[0], 
        b = dir[1],
        c = dir[2]

    var numIndices = count * 6

    var indices = array || new (dtype(type))(numIndices)
    for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
        var x = i + start
        indices[x + 0] = j + 0
        indices[x + 1] = j + 1
        indices[x + 2] = j + 2
        indices[x + 3] = j + a
        indices[x + 4] = j + b
        indices[x + 5] = j + c
    }
    return indices
}
},{"an-array":47,"dtype":48,"is-buffer":49}],47:[function(require,module,exports){
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],48:[function(require,module,exports){
module.exports = function(dtype) {
  switch (dtype) {
    case 'int8':
      return Int8Array
    case 'int16':
      return Int16Array
    case 'int32':
      return Int32Array
    case 'uint8':
      return Uint8Array
    case 'uint16':
      return Uint16Array
    case 'uint32':
      return Uint32Array
    case 'float32':
      return Float32Array
    case 'float64':
      return Float64Array
    case 'array':
      return Array
    case 'uint8_clamped':
      return Uint8ClampedArray
  }
}

},{}],49:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],50:[function(require,module,exports){
var flatten = require('flatten-vertex-data')

module.exports.attr = setAttribute
module.exports.index = setIndex

function setIndex (geometry, data, itemSize, dtype) {
  if (typeof itemSize !== 'number') itemSize = 1
  if (typeof dtype !== 'string') dtype = 'uint16'

  var isR69 = !geometry.index && typeof geometry.setIndex !== 'function'
  var attrib = isR69 ? geometry.getAttribute('index') : geometry.index
  var newAttrib = updateAttribute(attrib, data, itemSize, dtype)
  if (newAttrib) {
    if (isR69) geometry.addAttribute('index', newAttrib)
    else geometry.index = newAttrib
  }
}

function setAttribute (geometry, key, data, itemSize, dtype) {
  if (typeof itemSize !== 'number') itemSize = 3
  if (typeof dtype !== 'string') dtype = 'float32'
  if (Array.isArray(data) &&
    Array.isArray(data[0]) &&
    data[0].length !== itemSize) {
    throw new Error('Nested vertex array has unexpected size; expected ' +
      itemSize + ' but found ' + data[0].length)
  }

  var attrib = geometry.getAttribute(key)
  var newAttrib = updateAttribute(attrib, data, itemSize, dtype)
  if (newAttrib) {
    geometry.addAttribute(key, newAttrib)
  }
}

function updateAttribute (attrib, data, itemSize, dtype) {
  data = data || []
  if (!attrib || rebuildAttribute(attrib, data, itemSize)) {
    // create a new array with desired type
    data = flatten(data, dtype)
    attrib = new THREE.BufferAttribute(data, itemSize)
    attrib.needsUpdate = true
    return attrib
  } else {
    // copy data into the existing array
    flatten(data, attrib.array)
    attrib.needsUpdate = true
    return null
  }
}

// Test whether the attribute needs to be re-created,
// returns false if we can re-use it as-is.
function rebuildAttribute (attrib, data, itemSize) {
  if (attrib.itemSize !== itemSize) return true
  if (!attrib.array) return true
  var attribLength = attrib.array.length
  if (Array.isArray(data) && Array.isArray(data[0])) {
    // [ [ x, y, z ] ]
    return attribLength !== data.length * itemSize
  } else {
    // [ x, y, z ]
    return attribLength !== data.length
  }
  return false
}

},{"flatten-vertex-data":51}],51:[function(require,module,exports){
/*eslint new-cap:0*/
var dtype = require('dtype')
module.exports = flattenVertexData
function flattenVertexData (data, output, offset) {
  if (!data) throw new TypeError('must specify data as first parameter')
  offset = +(offset || 0) | 0

  if (Array.isArray(data) && Array.isArray(data[0])) {
    var dim = data[0].length
    var length = data.length * dim

    // no output specified, create a new typed array
    if (!output || typeof output === 'string') {
      output = new (dtype(output || 'float32'))(length + offset)
    }

    var dstLength = output.length - offset
    if (length !== dstLength) {
      throw new Error('source length ' + length + ' (' + dim + 'x' + data.length + ')' +
        ' does not match destination length ' + dstLength)
    }

    for (var i = 0, k = offset; i < data.length; i++) {
      for (var j = 0; j < dim; j++) {
        output[k++] = data[i][j]
      }
    }
  } else {
    if (!output || typeof output === 'string') {
      // no output, create a new one
      var Ctor = dtype(output || 'float32')
      if (offset === 0) {
        output = new Ctor(data)
      } else {
        output = new Ctor(data.length + offset)
        output.set(data, offset)
      }
    } else {
      // store output in existing array
      output.set(data, offset)
    }
  }

  return output
}

},{"dtype":52}],52:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxpbmRleC5qcyIsIm1vZHVsZXNcXHNoYWRlcnNcXHNkZi5qcyIsIm1vZHVsZXNcXHRleHR1cmVUZXh0XFxpbmRleC5qcyIsIm1vZHVsZXNcXHZyZGF0Z3VpXFxpbmRleC5qcyIsIm1vZHVsZXNcXHZyZGF0Z3VpXFxzZGZ0ZXh0LmpzIiwibW9kdWxlc1xcdnJkYXRndWlcXHNsaWRlci5qcyIsIm1vZHVsZXNcXHZyZGF0Z3VpXFx0ZXh0bGFiZWwuanMiLCJtb2R1bGVzXFx2cnBhZFxcaW5kZXguanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcaW5kZXguanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcb2JqbG9hZGVyLmpzIiwibW9kdWxlc1xcdnJ2aWV3ZXJcXHZpdmVjb250cm9sbGVyLmpzIiwibW9kdWxlc1xcdnJ2aWV3ZXJcXHZyY29udHJvbHMuanMiLCJtb2R1bGVzXFx2cnZpZXdlclxcdnJlZmZlY3RzLmpzIiwibW9kdWxlc1xcdnJ2aWV3ZXJcXHdlYnZyLmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2FkLWJtZm9udC9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2xvYWQtYm1mb250L2xpYi9pcy1iaW5hcnkuanMiLCJub2RlX21vZHVsZXMvbG9hZC1ibWZvbnQvbm9kZV9tb2R1bGVzL2J1ZmZlci1lcXVhbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2FkLWJtZm9udC9ub2RlX21vZHVsZXMvcGFyc2UtYm1mb250LWFzY2lpL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvYWQtYm1mb250L25vZGVfbW9kdWxlcy9wYXJzZS1ibWZvbnQtYmluYXJ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvYWQtYm1mb250L25vZGVfbW9kdWxlcy9wYXJzZS1ibWZvbnQteG1sL2xpYi9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2xvYWQtYm1mb250L25vZGVfbW9kdWxlcy9wYXJzZS1ibWZvbnQteG1sL2xpYi9wYXJzZS1hdHRyaWJzLmpzIiwibm9kZV9tb2R1bGVzL2xvYWQtYm1mb250L25vZGVfbW9kdWxlcy9wYXJzZS1ibWZvbnQteG1sL25vZGVfbW9kdWxlcy94bWwtcGFyc2UtZnJvbS1zdHJpbmcvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9hZC1ibWZvbnQvbm9kZV9tb2R1bGVzL3hoci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2FkLWJtZm9udC9ub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIiwibm9kZV9tb2R1bGVzL2xvYWQtYm1mb250L25vZGVfbW9kdWxlcy94aHIvbm9kZV9tb2R1bGVzL2lzLWZ1bmN0aW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvYWQtYm1mb250L25vZGVfbW9kdWxlcy94aHIvbm9kZV9tb2R1bGVzL3BhcnNlLWhlYWRlcnMvbm9kZV9tb2R1bGVzL2Zvci1lYWNoL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvYWQtYm1mb250L25vZGVfbW9kdWxlcy94aHIvbm9kZV9tb2R1bGVzL3BhcnNlLWhlYWRlcnMvbm9kZV9tb2R1bGVzL3RyaW0vaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9hZC1ibWZvbnQvbm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9wYXJzZS1oZWFkZXJzLmpzIiwibm9kZV9tb2R1bGVzL2xvYWQtYm1mb250L25vZGVfbW9kdWxlcy94dGVuZC9pbW11dGFibGUuanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9saWIvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbGliL3ZlcnRpY2VzLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9sYXlvdXQtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9ub2RlX21vZHVsZXMvYXMtbnVtYmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9sYXlvdXQtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL2luZGV4b2YtcHJvcGVydHkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9ub2RlX21vZHVsZXMvd29yZC13cmFwcGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL3F1YWQtaW5kaWNlcy9ub2RlX21vZHVsZXMvYW4tYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL3F1YWQtaW5kaWNlcy9ub2RlX21vZHVsZXMvZHR5cGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL3F1YWQtaW5kaWNlcy9ub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy90aHJlZS1idWZmZXItdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL3RocmVlLWJ1ZmZlci12ZXJ0ZXgtZGF0YS9ub2RlX21vZHVsZXMvZmxhdHRlbi12ZXJ0ZXgtZGF0YS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7SUFBWSxLOztBQUNaOzs7Ozs7OztBQUVBLElBQU0sWUFBWSx3QkFBVSxLQUFWLENBQWxCOztpQkFFOEQsVUFBVTtBQUN0RSxhQUFXLElBRDJEO0FBRXRFLGFBQVc7QUFGMkQsQ0FBVixDOztJQUF0RCxLLGNBQUEsSztJQUFPLE0sY0FBQSxNO0lBQVEsTSxjQUFBLE07SUFBUSxRLGNBQUEsUTtJQUFVLGdCLGNBQUEsZ0I7OztBQU16QyxJQUFNLFFBQVEsTUFBTSxNQUFOLEVBQWQ7O0FBRUEsT0FBTyxFQUFQLENBQVcsTUFBWCxFQUFtQixVQUFDLEVBQUQsRUFBTTtBQUN2QixRQUFN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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZSVmlld2VyIGZyb20gJy4vdnJ2aWV3ZXInO1xyXG5pbXBvcnQgKiBhcyBWUlBhZCBmcm9tICcuL3ZycGFkJztcclxuaW1wb3J0IFZSREFUR1VJIGZyb20gJy4vdnJkYXRndWknO1xyXG5cclxuY29uc3QgY3JlYXRlQXBwID0gVlJWaWV3ZXIoIFRIUkVFICk7XHJcblxyXG5jb25zdCB7IHNjZW5lLCBjYW1lcmEsIGV2ZW50cywgdG9nZ2xlVlIsIGNvbnRyb2xsZXJNb2RlbHMgfSA9IGNyZWF0ZUFwcCh7XHJcbiAgYXV0b0VudGVyOiB0cnVlLFxyXG4gIGVtcHR5Um9vbTogdHJ1ZVxyXG59KTtcclxuXHJcblxyXG5jb25zdCB2cnBhZCA9IFZSUGFkLmNyZWF0ZSgpO1xyXG5cclxuZXZlbnRzLm9uKCAndGljaycsIChkdCk9PntcclxuICB2cnBhZC51cGRhdGUoKTtcclxufSk7XHJcblxyXG5cclxuXHJcblxyXG4vLyAgY3JlYXRlIGEgcG9pbnRlclxyXG5jb25zdCBwb2ludGVyID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjAxLCAxMiwgNyApLCBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4ZmYwMDAwLCB3aXJlZnJhbWU6IHRydWV9KSApXHJcbnBvaW50ZXIucG9zaXRpb24ueiA9IC0wLjEyO1xyXG5wb2ludGVyLnBvc2l0aW9uLnkgPSAtMC4xMjtcclxuY29udHJvbGxlck1vZGVsc1swXS5hZGQoIHBvaW50ZXIgKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyAgcmlnaHQgaGFuZFxyXG52cnBhZC5ldmVudHMub24oICdjb25uZWN0ZWQwJywgKCBwYWQgKSA9PiB7XHJcblxyXG4gIHBhZC5vbignYnV0dG9uMVByZXNzZWQnLCAoKT0+cG9pbnRlci5wcmVzc2VkID0gdHJ1ZSApO1xyXG5cclxuICBwYWQub24oJ2J1dHRvbjFSZWxlYXNlZCcsICgpPT5wb2ludGVyLnByZXNzZWQgPSBmYWxzZSApO1xyXG5cclxuICAvLyAgb3B0aW9uIGJ1dHRvblxyXG4gIHBhZC5vbignYnV0dG9uM1ByZXNzZWQnLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICl7XHJcbiAgICB0b2dnbGVWUigpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcblxyXG4vLyAgbGVmdCBoYW5kXHJcbnZycGFkLmV2ZW50cy5vbiggJ2Nvbm5lY3RlZDEnLCAoIHBhZCApID0+IHtcclxuXHJcbiAgLy8gIG9wdGlvbiBidXR0b25cclxuICBwYWQub24oJ2J1dHRvbjNQcmVzc2VkJywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApe1xyXG4gICAgd2luZG93LmNsb3NlKCk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IGJveGVzID0gW107XHJcbmZvciggbGV0IGk9MDsgaTwzMjsgaSsrICl7XHJcbiAgY29uc3QgYm94ID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggMSwgMSwgMSApLCBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoKSApO1xyXG4gIGJveC5wb3NpdGlvbi55ID0gMi4wO1xyXG4gIGJveC5wb3NpdGlvbi56ID0gLTEuMjtcclxuICBzY2VuZS5hZGQoIGJveCApO1xyXG4gIGJveGVzLnB1c2goIGJveCApO1xyXG59XHJcblxyXG5jb25zdCBzdGF0ZSA9IHtcclxuICByb3RhdGlvblNwZWVkOiAwLjAyLFxyXG4gIG9mZnNldDogMC4wMSxcclxuICBzY2FsZTogMS4wXHJcbn07XHJcblxyXG5ldmVudHMub24oICd0aWNrJywgKGR0KT0+e1xyXG4gIGJveGVzLmZvckVhY2goIGZ1bmN0aW9uKCBib3gsIGluZGV4ICl7XHJcbiAgICBib3gucm90YXRpb24ueCArPSBkdCAqICggc3RhdGUucm90YXRpb25TcGVlZCArIGluZGV4ICogc3RhdGUub2Zmc2V0ICk7XHJcbiAgICBib3gucm90YXRpb24ueSAtPSBkdCAqICggc3RhdGUucm90YXRpb25TcGVlZCAqIDEuMiArIGluZGV4ICogc3RhdGUub2Zmc2V0ICk7XHJcbiAgICBib3gucm90YXRpb24ueiArPSBkdCAqICggc3RhdGUucm90YXRpb25TcGVlZCAqIDAuNCArIGluZGV4ICogc3RhdGUub2Zmc2V0ICk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IGd1aSA9IFZSREFUR1VJKFRIUkVFKTtcclxuZ3VpLmFkZElucHV0T2JqZWN0KCBwb2ludGVyICk7XHJcblxyXG5cclxuXHJcbmNvbnN0IGd1aUdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbmd1aUdyb3VwLnBvc2l0aW9uLnogPSAtMC4xO1xyXG5ndWlHcm91cC5yb3RhdGlvbi54ID0gLU1hdGguUEkgKiAwLjU7XHJcbmd1aUdyb3VwLnNjYWxlLm11bHRpcGx5U2NhbGFyKCAwLjI1ICk7XHJcbmNvbnRyb2xsZXJNb2RlbHNbMV0uYWRkKCBndWlHcm91cCApO1xyXG5cclxuXHJcblxyXG5jb25zdCBjb250cm9sbGVyID0gZ3VpLmFkZCggc3RhdGUsICdyb3RhdGlvblNwZWVkJywgLTAuOCwgMC44ICk7XHJcbmd1aUdyb3VwLmFkZCggY29udHJvbGxlciApO1xyXG5cclxuY29uc3QgY29udHJvbGxlcjIgPSBndWkuYWRkKCBzdGF0ZSwgJ3NjYWxlJywgMC4yLCAzLjAgKS5vbkNoYW5nZWQoIGZ1bmN0aW9uKCB3aWR0aCApe1xyXG4gIGJveGVzLmZvckVhY2goIGZ1bmN0aW9uKCBib3gsIGluZGV4ICl7XHJcbiAgICBib3guc2NhbGUueCA9IHdpZHRoICogaW5kZXggKiAwLjAxO1xyXG4gICAgaWYoIGJveC5zY2FsZS54IDwgMC4xICl7XHJcbiAgICAgIGJveC5zY2FsZS54ID0gMC4xO1xyXG4gICAgfVxyXG4gICAgYm94LnNjYWxlLnkgPSAxL3dpZHRoICogaW5kZXggKiAwLjA1O1xyXG4gICAgaWYoIGJveC5zY2FsZS55IDwgMC4xICl7XHJcbiAgICAgIGJveC5zY2FsZS55ID0gMC4xO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59KTtcclxuY29udHJvbGxlcjIucG9zaXRpb24ueSA9IDAuMTU7XHJcbmd1aUdyb3VwLmFkZCggY29udHJvbGxlcjIgKTtcclxuXHJcbmNvbnN0IGNvbnRyb2xsZXIzID0gZ3VpLmFkZCggc3RhdGUsICdvZmZzZXQnLCAwLjAwMSwgMC4xICk7XHJcbmNvbnRyb2xsZXIzLnBvc2l0aW9uLnkgPSAwLjM7XHJcbmd1aUdyb3VwLmFkZCggY29udHJvbGxlcjMgKTtcclxuXHJcblxyXG5cclxuIiwidmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVNERlNoYWRlciAob3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fVxuICB2YXIgb3BhY2l0eSA9IHR5cGVvZiBvcHQub3BhY2l0eSA9PT0gJ251bWJlcicgPyBvcHQub3BhY2l0eSA6IDFcbiAgdmFyIGFscGhhVGVzdCA9IHR5cGVvZiBvcHQuYWxwaGFUZXN0ID09PSAnbnVtYmVyJyA/IG9wdC5hbHBoYVRlc3QgOiAwLjAwMDFcbiAgdmFyIHByZWNpc2lvbiA9IG9wdC5wcmVjaXNpb24gfHwgJ2hpZ2hwJ1xuICB2YXIgY29sb3IgPSBvcHQuY29sb3JcbiAgdmFyIG1hcCA9IG9wdC5tYXBcblxuICAvLyByZW1vdmUgdG8gc2F0aXNmeSByNzNcbiAgZGVsZXRlIG9wdC5tYXBcbiAgZGVsZXRlIG9wdC5jb2xvclxuICBkZWxldGUgb3B0LnByZWNpc2lvblxuICBkZWxldGUgb3B0Lm9wYWNpdHlcblxuICByZXR1cm4gYXNzaWduKHtcbiAgICB1bmlmb3Jtczoge1xuICAgICAgb3BhY2l0eTogeyB0eXBlOiAnZicsIHZhbHVlOiBvcGFjaXR5IH0sXG4gICAgICBtYXA6IHsgdHlwZTogJ3QnLCB2YWx1ZTogbWFwIHx8IG5ldyBUSFJFRS5UZXh0dXJlKCkgfSxcbiAgICAgIGNvbG9yOiB7IHR5cGU6ICdjJywgdmFsdWU6IG5ldyBUSFJFRS5Db2xvcihjb2xvcikgfVxuICAgIH0sXG4gICAgdmVydGV4U2hhZGVyOiBbXG4gICAgICAnYXR0cmlidXRlIHZlYzIgdXY7JyxcbiAgICAgICdhdHRyaWJ1dGUgdmVjNCBwb3NpdGlvbjsnLFxuICAgICAgJ3VuaWZvcm0gbWF0NCBwcm9qZWN0aW9uTWF0cml4OycsXG4gICAgICAndW5pZm9ybSBtYXQ0IG1vZGVsVmlld01hdHJpeDsnLFxuICAgICAgJ3ZhcnlpbmcgdmVjMiB2VXY7JyxcbiAgICAgICd2b2lkIG1haW4oKSB7JyxcbiAgICAgICd2VXYgPSB1djsnLFxuICAgICAgJ2dsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHBvc2l0aW9uOycsXG4gICAgICAnfSdcbiAgICBdLmpvaW4oJ1xcbicpLFxuICAgIGZyYWdtZW50U2hhZGVyOiBbXG4gICAgICAnI2lmZGVmIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcycsXG4gICAgICAnI2V4dGVuc2lvbiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMgOiBlbmFibGUnLFxuICAgICAgJyNlbmRpZicsXG4gICAgICAncHJlY2lzaW9uICcgKyBwcmVjaXNpb24gKyAnIGZsb2F0OycsXG4gICAgICAndW5pZm9ybSBmbG9hdCBvcGFjaXR5OycsXG4gICAgICAndW5pZm9ybSB2ZWMzIGNvbG9yOycsXG4gICAgICAndW5pZm9ybSBzYW1wbGVyMkQgbWFwOycsXG4gICAgICAndmFyeWluZyB2ZWMyIHZVdjsnLFxuXG4gICAgICAnZmxvYXQgYWFzdGVwKGZsb2F0IHZhbHVlKSB7JyxcbiAgICAgICcgICNpZmRlZiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgJyAgICBmbG9hdCBhZndpZHRoID0gbGVuZ3RoKHZlYzIoZEZkeCh2YWx1ZSksIGRGZHkodmFsdWUpKSkgKiAwLjcwNzEwNjc4MTE4NjU0NzU3OycsXG4gICAgICAnICAjZWxzZScsXG4gICAgICAnICAgIGZsb2F0IGFmd2lkdGggPSAoMS4wIC8gMzIuMCkgKiAoMS40MTQyMTM1NjIzNzMwOTUxIC8gKDIuMCAqIGdsX0ZyYWdDb29yZC53KSk7JyxcbiAgICAgICcgICNlbmRpZicsXG4gICAgICAnICByZXR1cm4gc21vb3Roc3RlcCgwLjUgLSBhZndpZHRoLCAwLjUgKyBhZndpZHRoLCB2YWx1ZSk7JyxcbiAgICAgICd9JyxcblxuICAgICAgJ3ZvaWQgbWFpbigpIHsnLFxuICAgICAgJyAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRChtYXAsIHZVdik7JyxcbiAgICAgICcgIGZsb2F0IGFscGhhID0gYWFzdGVwKHRleENvbG9yLmEpOycsXG4gICAgICAnICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLCBvcGFjaXR5ICogYWxwaGEpOycsXG4gICAgICBhbHBoYVRlc3QgPT09IDBcbiAgICAgICAgPyAnJ1xuICAgICAgICA6ICcgIGlmIChnbF9GcmFnQ29sb3IuYSA8ICcgKyBhbHBoYVRlc3QgKyAnKSBkaXNjYXJkOycsXG4gICAgICAnfSdcbiAgICBdLmpvaW4oJ1xcbicpXG4gIH0sIG9wdClcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRleHR1cmVUZXh0KCl7XHJcbiAgbGV0IGN3ID0gMTAyNDtcclxuICBsZXQgY2ggPSAxMDI0O1xyXG5cclxuICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApO1xyXG4gIGNhbnZhcy53aWR0aCA9IGN3O1xyXG4gIGNhbnZhcy5oZWlnaHQgPSBjaDtcclxuXHJcbiAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoICcyZCcgKTtcclxuICBjdHguZm9udCA9ICczMnB4IEx1Y2lkYSBTYW5zIFVuaWNvZGUnXHJcblxyXG4gIC8vICB3aGF0IGEgaGFja1xyXG4gIGNvbnN0IGxpbmVIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQoJ00nKS53aWR0aCAqIDEuNTtcclxuXHJcbiAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcblxyXG4gIGNvbnN0IHRleHRMaXN0ID0gW107XHJcbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCBjYW52YXMgKTtcclxuXHJcbiAgLy8gY3R4LmJlZ2luUGF0aCgpO1xyXG4gIC8vIGN0eC5yZWN0KCAwLCAwLCAxMDAsIDEwMCApO1xyXG4gIC8vIGN0eC5maWxsKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGFkZCggc3RyICl7XHJcbiAgICBjb25zdCBpZCA9IHRleHRMaXN0Lmxlbmd0aDtcclxuXHJcbiAgICB0ZXh0TGlzdC5wdXNoKCBzdHIgKTtcclxuXHJcbiAgICBkcmF3VGV4dCggc3RyLCBpZCApO1xyXG5cclxuICAgIGNvbnN0IHRleHR1cmVUb3AgPSBsaW5lSGVpZ2h0ICogKGlkKTtcclxuICAgIGNvbnN0IHdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KCBzdHIgKS53aWR0aDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHgxOiAwLCB5MTogdGV4dHVyZVRvcC9jaCxcclxuICAgICAgeDI6IDAgKyB3aWR0aC9jdywgeTI6ICh0ZXh0dXJlVG9wICsgbGluZUhlaWdodCkvY2gsXHJcbiAgICAgIHdpZHRoOiB3aWR0aC9jdywgaGVpZ2h0OiBsaW5lSGVpZ2h0L2NoLFxyXG4gICAgICB1cGRhdGVUZXh0OiBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRyYXdUZXh0KCBzdHIsIGlkeCApe1xyXG4gICAgY29uc3QgdG9wID0gbGluZUhlaWdodCAqICAoaWR4ICsgMSk7XHJcblxyXG4gICAgY3R4LmZpbGxUZXh0KCBzdHIsIDAsIHRvcCApO1xyXG4gICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcHBlbmRDYW52YXMoKXtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGNhbnZhcyApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0VGV4dHVyZSgpe1xyXG4gICAgcmV0dXJuIHRleHR1cmU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgYWRkLFxyXG4gICAgZ2V0VGV4dHVyZSxcclxuICAgIGFwcGVuZENhbnZhc1xyXG4gIH07XHJcbn0iLCJpbXBvcnQgbG9hZEZvbnQgZnJvbSAnbG9hZC1ibWZvbnQnO1xyXG5pbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xyXG5cclxuaW1wb3J0IFRleHR1cmVUZXh0IGZyb20gJy4uL3RleHR1cmVUZXh0JztcclxuaW1wb3J0IGNyZWF0ZVNsaWRlciBmcm9tICcuL3NsaWRlcic7XHJcbmltcG9ydCAqIGFzIFNERlRleHQgZnJvbSAnLi9zZGZ0ZXh0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFZSREFUR1VJKCBUSFJFRSApe1xyXG5cclxuICBjb25zdCB0ZXh0TWF0ZXJpYWwgPSBTREZUZXh0LmNyZWF0ZU1hdGVyaWFsKCk7XHJcblxyXG4gIGNvbnN0IGlucHV0T2JqZWN0cyA9IFtdO1xyXG4gIGNvbnN0IGNvbnRyb2xsZXJzID0gW107XHJcblxyXG4gIGNvbnN0IGV2ZW50cyA9IG5ldyBFbWl0dGVyKCk7XHJcblxyXG4gIGNvbnN0IERFRkFVTFRfRk5UID0gJ2ZvbnRzL2x1Y2lkYXNhbnN1bmljb2RlLmZudCc7XHJcblxyXG4gIGxvYWRGb250KCBERUZBVUxUX0ZOVCwgZnVuY3Rpb24oIGVyciwgZm9udCApe1xyXG4gICAgaWYoIGVyciApe1xyXG4gICAgICBjb25zb2xlLndhcm4oIGVyciApO1xyXG4gICAgfVxyXG4gICAgZXZlbnRzLmVtaXQoICdmb250TG9hZGVkJywgZm9udCApO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCB0ZXh0Q3JlYXRvciA9IFNERlRleHQuY3JlYXRvciggdGV4dE1hdGVyaWFsLCBldmVudHMgKTtcclxuXHJcbiAgZnVuY3Rpb24gYWRkSW5wdXRPYmplY3QoIG9iamVjdCApe1xyXG4gICAgaW5wdXRPYmplY3RzLnB1c2goIHtcclxuICAgICAgYm94OiBuZXcgVEhSRUUuQm94MygpLFxyXG4gICAgICBvYmplY3RcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgbWluID0gMC4wLCBtYXggPSAxMDAuMCApe1xyXG5cclxuICAgIGNvbnN0IHNsaWRlciA9IGNyZWF0ZVNsaWRlcigge1xyXG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsIG1pbiwgbWF4LFxyXG4gICAgICBpbml0aWFsVmFsdWU6IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIHNsaWRlciApO1xyXG5cclxuICAgIHJldHVybiBzbGlkZXI7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB1cGRhdGUgKTtcclxuXHJcbiAgICBpbnB1dE9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24oIHNldCApe1xyXG4gICAgICBzZXQuYm94LnNldEZyb21PYmplY3QoIHNldC5vYmplY3QgKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goIGZ1bmN0aW9uKCBjb250cm9sbGVyICl7XHJcbiAgICAgIGNvbnRyb2xsZXIudXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBhZGRJbnB1dE9iamVjdCxcclxuICAgIGFkZFxyXG4gIH07XHJcblxyXG59XHJcblxyXG4iLCJpbXBvcnQgU0RGU2hhZGVyIGZyb20gJy4uL3NoYWRlcnMvc2RmJztcclxuaW1wb3J0IGNyZWF0ZUdlb21ldHJ5IGZyb20gJ3RocmVlLWJtZm9udC10ZXh0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYXRlcmlhbCgpe1xyXG5cclxuICBjb25zdCBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xyXG4gIGxvYWRlci5sb2FkKCAnZm9udHMvbHVjaWRhc2Fuc3VuaWNvZGUucG5nJywgZnVuY3Rpb24oIHRleHR1cmUgKXtcclxuICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJNaXBNYXBMaW5lYXJGaWx0ZXI7XHJcbiAgICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcclxuICAgIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gdHJ1ZTtcclxuICAgIG1hdGVyaWFsLnVuaWZvcm1zLm1hcC52YWx1ZSA9IHRleHR1cmU7XHJcblxyXG4gICAgLy8gIFRPRE9cclxuICAgIC8vICBhZGQgYW5pc29cclxuXHJcbiAgfSApO1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbChTREZTaGFkZXIoe1xyXG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgY29sb3I6ICdyZ2IoMjU1LCAyNTUsIDI1NSknXHJcbiAgfSkpO1xyXG5cclxuICByZXR1cm4gbWF0ZXJpYWw7XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRvciggbWF0ZXJpYWwsIGV2ZW50cyApe1xyXG5cclxuICBsZXQgZm9udDtcclxuXHJcbiAgZXZlbnRzLm9uKCAnZm9udExvYWRlZCcsIGZ1bmN0aW9uKCBmb250ICl7XHJcbiAgICBmb250ID0gZm9udDtcclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlVGV4dCggc3RyLCBmb250ICl7XHJcblxyXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBjcmVhdGVHZW9tZXRyeSh7XHJcbiAgICAgIHRleHQ6IHN0cixcclxuICAgICAgd2lkdGg6IDEwMDAsXHJcbiAgICAgIGZsaXBZOiB0cnVlLFxyXG4gICAgICBmb250XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgY29uc3QgbGF5b3V0ID0gZ2VvbWV0cnkubGF5b3V0O1xyXG5cclxuICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCggZ2VvbWV0cnksIG1hdGVyaWFsICk7XHJcbiAgICBtZXNoLnNjYWxlLm11bHRpcGx5KCBuZXcgVEhSRUUuVmVjdG9yMygxLC0xLDEpICk7XHJcbiAgICBtZXNoLnNjYWxlLm11bHRpcGx5U2NhbGFyKCAwLjAwMSApO1xyXG5cclxuICAgIG1lc2gucG9zaXRpb24ueSA9IGxheW91dC5oZWlnaHQgKiAwLjUgKiAwLjAwMTtcclxuXHJcbiAgICByZXR1cm4gbWVzaDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZSggc3RyICl7XHJcbiAgICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICAgIGxldCBtZXNoO1xyXG5cclxuICAgIGlmKCBmb250ICl7XHJcbiAgICAgIG1lc2ggPSBjcmVhdGVUZXh0KCBzdHIsIGZvbnQgKTtcclxuICAgICAgZ3JvdXAuYWRkKCBtZXNoICk7XHJcbiAgICAgIGdyb3VwLmxheW91dCA9IG1lc2guZ2VvbWV0cnkubGF5b3V0O1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgZXZlbnRzLm9uKCAnZm9udExvYWRlZCcsIGZ1bmN0aW9uKCBmb250ICl7XHJcbiAgICAgICAgbWVzaCA9IGNyZWF0ZVRleHQoIHN0ciwgZm9udCApO1xyXG4gICAgICAgIGdyb3VwLmFkZCggbWVzaCApO1xyXG4gICAgICAgIGdyb3VwLmxheW91dCA9IG1lc2guZ2VvbWV0cnkubGF5b3V0O1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICAgIGlmKCBtZXNoICl7XHJcbiAgICAgICAgbWVzaC5nZW9tZXRyeS51cGRhdGUoIHN0ciApO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBncm91cDtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBjcmVhdGUsXHJcbiAgICBnZXRNYXRlcmlhbDogKCk9PiBtYXRlcmlhbFxyXG4gIH1cclxuXHJcbn0iLCJpbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuXHJcbmNvbnN0IERFRkFVTFRfQ09MT1IgPSAweDJGQTFENjtcclxuY29uc3QgSElHSExJR0hUX0NPTE9SID0gMHg0MEJERjc7XHJcbmNvbnN0IElOVEVSQUNUSU9OX0NPTE9SID0gMHhCREU4RkM7XHJcbmNvbnN0IEVNSVNTSVZFX0NPTE9SID0gMHgyMjIyMjI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVTbGlkZXIoIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgaW5pdGlhbFZhbHVlID0gMC4wLFxyXG4gIG1pbiwgbWF4LFxyXG4gIHdpZHRoID0gNFxyXG59ID0ge30gKXtcclxuXHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gIC8vICBmaWxsZWQgdm9sdW1lXHJcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggMC4xLCAwLjEsIDAuMDMsIDEsIDEsIDEgKTtcclxuICByZWN0LmFwcGx5TWF0cml4KCBuZXcgVEhSRUUuTWF0cml4NCgpLm1ha2VUcmFuc2xhdGlvbiggLTAuMDUsIDAsIDAgKSApO1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiBERUZBVUxUX0NPTE9SLCBlbWlzc2l2ZTogRU1JU1NJVkVfQ09MT1IgfSk7XHJcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QsIG1hdGVyaWFsICk7XHJcbiAgZmlsbGVkVm9sdW1lLnNjYWxlLnggPSB3aWR0aDtcclxuXHJcblxyXG4gIC8vICBvdXRsaW5lIHZvbHVtZVxyXG4gIGNvbnN0IG91dGxpbmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweDExMTExMSB9KTtcclxuICBjb25zdCBvdXRsaW5lTWVzaCA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LCBvdXRsaW5lTWF0ZXJpYWwgKTtcclxuICBvdXRsaW5lTWVzaC5zY2FsZS54ID0gd2lkdGg7XHJcbiAgb3V0bGluZU1lc2gudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdCBvdXRsaW5lID0gbmV3IFRIUkVFLkJveEhlbHBlciggb3V0bGluZU1lc2ggKTtcclxuICBvdXRsaW5lLm1hdGVyaWFsLmNvbG9yLnNldEhleCggMHg5OTk5OTkgKTtcclxuXHJcbiAgY29uc3QgZW5kTG9jYXRvciA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIDAuMDUsIDAuMDUsIDAuMSwgMSwgMSwgMSApLCBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHtjb2xvcjogMHhmZmZmZmZ9ICkgKTtcclxuICBlbmRMb2NhdG9yLnBvc2l0aW9uLnggPSAtMC4xICogd2lkdGg7XHJcbiAgZW5kTG9jYXRvci52aXNpYmxlID0gZmFsc2U7XHJcblxyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSBjcmVhdGVUZXh0TGFiZWwoIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IDAuMDM7XHJcblxyXG4gIGNvbnN0IHZhbHVlTGFiZWwgPSBjcmVhdGVUZXh0TGFiZWwoIHRleHRDcmVhdG9yLCBpbml0aWFsVmFsdWUudG9GaXhlZCgyKSApO1xyXG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueCA9IDAuMDM7XHJcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDU7XHJcblxyXG4gIGdyb3VwLmFkZCggZmlsbGVkVm9sdW1lLCBvdXRsaW5lLCBvdXRsaW5lTWVzaCwgZW5kTG9jYXRvciwgZGVzY3JpcHRvckxhYmVsLCB2YWx1ZUxhYmVsICk7XHJcblxyXG5cclxuXHJcbiAgY29uc3QgYm91bmRpbmdCb3ggPSBuZXcgVEhSRUUuQm94MygpO1xyXG5cclxuICBjb25zdCBzdGF0ZSA9IHtcclxuICAgIGFscGhhOiAxLjAsXHJcbiAgICB2YWx1ZTogaW5pdGlhbFZhbHVlLFxyXG4gICAgaG92ZXI6IGZhbHNlLFxyXG4gICAgcHJlc3M6IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgc3RhdGUuYWxwaGEgPSBtYXBfcmFuZ2UoIGluaXRpYWxWYWx1ZSwgbWluLCBtYXgsIDAuMCwgMS4wICk7XHJcbiAgZmlsbGVkVm9sdW1lLnNjYWxlLnggPSBzdGF0ZS5hbHBoYSAqIHdpZHRoO1xyXG5cclxuICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBib3VuZGluZ0JveC5zZXRGcm9tT2JqZWN0KCBvdXRsaW5lTWVzaCApO1xyXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCBzZXQgKXtcclxuICAgICAgaWYoIGJvdW5kaW5nQm94LmludGVyc2VjdHNCb3goIHNldC5ib3ggKSApe1xyXG4gICAgICAgIHN0YXRlLmhvdmVyID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBzdGF0ZS5ob3ZlciA9IGZhbHNlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKCBzdGF0ZS5ob3ZlciAmJiBzZXQub2JqZWN0LnByZXNzZWQgKXtcclxuICAgICAgICBzdGF0ZS5wcmVzcyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBzdGF0ZS5wcmVzcyA9IGZhbHNlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHVwZGF0ZSggc2V0LmJveCApO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuXHJcbiAgfTtcclxuXHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZSggYm94ICl7XHJcbiAgICBpZiggc3RhdGUucHJlc3MgJiYgc3RhdGUuaG92ZXIgKXtcclxuXHJcbiAgICAgIGZpbGxlZFZvbHVtZS51cGRhdGVNYXRyaXhXb3JsZCgpO1xyXG4gICAgICBlbmRMb2NhdG9yLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XHJcblxyXG4gICAgICBjb25zdCBhID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGZpbGxlZFZvbHVtZS5tYXRyaXhXb3JsZCApO1xyXG4gICAgICBjb25zdCBiID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGVuZExvY2F0b3IubWF0cml4V29ybGQgKTtcclxuXHJcbiAgICAgIGNvbnN0IGludGVyc2VjdGlvblBvaW50ID0gYm91bmRpbmdCb3guaW50ZXJzZWN0KCBib3ggKS5jZW50ZXIoKTtcclxuICAgICAgY29uc3QgcG9pbnRBbHBoYSA9IGdldFBvaW50QWxwaGEoIGludGVyc2VjdGlvblBvaW50LCB7YSxifSApO1xyXG4gICAgICBzdGF0ZS5hbHBoYSA9IHBvaW50QWxwaGE7XHJcblxyXG4gICAgICBmaWxsZWRWb2x1bWUuc2NhbGUueCA9IHN0YXRlLmFscGhhICogd2lkdGg7XHJcblxyXG4gICAgICBzdGF0ZS52YWx1ZSA9IG1hcF9yYW5nZSggc3RhdGUuYWxwaGEsIDAuMCwgMS4wLCBtaW4sIG1heCApO1xyXG4gICAgICBpZiggc3RhdGUudmFsdWUgPCBtaW4gKXtcclxuICAgICAgICBzdGF0ZS52YWx1ZSA9IG1pbjtcclxuICAgICAgfVxyXG4gICAgICBpZiggc3RhdGUudmFsdWUgPiBtYXggKXtcclxuICAgICAgICBzdGF0ZS52YWx1ZSA9IG1heDtcclxuICAgICAgfVxyXG5cclxuICAgICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IHN0YXRlLnZhbHVlO1xyXG5cclxuICAgICAgdmFsdWVMYWJlbC5zZXROdW1iZXIoIHN0YXRlLnZhbHVlICk7XHJcblxyXG4gICAgICBpZiggb25DaGFuZ2VkQ0IgKXtcclxuICAgICAgICBvbkNoYW5nZWRDQiggc3RhdGUudmFsdWUgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG4gICAgaWYoIHN0YXRlLnByZXNzICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggSU5URVJBQ1RJT05fQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIGlmKCBzdGF0ZS5ob3ZlciApe1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIEhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBERUZBVUxUX0NPTE9SICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsZXQgb25DaGFuZ2VkQ0I7XHJcbiAgbGV0IG9uRmluaXNoQ2hhbmdlQ0I7XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlZCA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xyXG4gICAgb25DaGFuZ2VkQ0IgPSBjYWxsYmFjaztcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQb2ludEFscGhhKCBwb2ludCwgc2VnbWVudCApe1xyXG4gIGNvbnN0IGEgPSBuZXcgVEhSRUUuVmVjdG9yMygpLmNvcHkoIHNlZ21lbnQuYiApLnN1Yiggc2VnbWVudC5hICk7XHJcbiAgY29uc3QgYiA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuY29weSggcG9pbnQgKS5zdWIoIHNlZ21lbnQuYSApO1xyXG4gIGNvbnN0IHByb2plY3RlZCA9IGIucHJvamVjdE9uVmVjdG9yKCBhICk7XHJcblxyXG4gIGNvbnN0IGxlbmd0aCA9IHNlZ21lbnQuYS5kaXN0YW5jZVRvKCBzZWdtZW50LmIgKTtcclxuXHJcbiAgbGV0IGFscGhhID0gcHJvamVjdGVkLmxlbmd0aCgpIC8gbGVuZ3RoO1xyXG4gIGlmKCBhbHBoYSA+IDEuMCApe1xyXG4gICAgYWxwaGEgPSAxLjA7XHJcbiAgfVxyXG4gIGlmKCBhbHBoYSA8IDAuMCApe1xyXG4gICAgYWxwaGEgPSAwLjA7XHJcbiAgfVxyXG4gIHJldHVybiBhbHBoYTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGVycChtaW4sIG1heCwgdmFsdWUpIHtcclxuICByZXR1cm4gKDEtdmFsdWUpKm1pbiArIHZhbHVlKm1heDtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFwX3JhbmdlKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpIHtcclxuICAgIHJldHVybiBsb3cyICsgKGhpZ2gyIC0gbG93MikgKiAodmFsdWUgLSBsb3cxKSAvIChoaWdoMSAtIGxvdzEpO1xyXG59IiwiXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVRleHRMYWJlbCggdGV4dENyZWF0b3IsIHN0ciApe1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICBjb25zdCB0ZXh0ID0gdGV4dENyZWF0b3IuY3JlYXRlKCBzdHIgKTtcclxuICBncm91cC5hZGQoIHRleHQgKTtcclxuXHJcbiAgZ3JvdXAuc2V0U3RyaW5nID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgdGV4dC51cGRhdGUoIHN0ci50b1N0cmluZygpICk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuc2V0TnVtYmVyID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgdGV4dC51cGRhdGUoIHN0ci50b0ZpeGVkKDIpICk7XHJcbiAgfTtcclxuXHJcbiAgdGV4dC5wb3NpdGlvbi56ID0gMC4wMTVcclxuXHJcbiAgY29uc3QgYmFja0JvdW5kcyA9IDAuMDE7XHJcbiAgY29uc3QgbGFiZWxCYWNrR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIDAuNCwgMC4wNCwgMC4wMjksIDEsIDEsIDEgKTtcclxuXHJcbiAgY29uc3QgbGFiZWxCYWNrTWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBsYWJlbEJhY2tHZW9tZXRyeSwgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjoweDEzMTMxM30pKTtcclxuICBsYWJlbEJhY2tNZXNoLnBvc2l0aW9uLnkgPSAwLjAzO1xyXG4gIGxhYmVsQmFja01lc2gucG9zaXRpb24ueCA9IDAuMTg7XHJcbiAgZ3JvdXAuYWRkKCBsYWJlbEJhY2tNZXNoICk7XHJcblxyXG4gIC8vIGxhYmVsR3JvdXAucG9zaXRpb24ueCA9IGxhYmVsQm91bmRzLndpZHRoICogMC41O1xyXG4gIC8vIGxhYmVsR3JvdXAucG9zaXRpb24ueSA9IGxhYmVsQm91bmRzLmhlaWdodCAqIDAuNTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsImltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCl7XHJcblxyXG4gIGNvbnN0IHBhZHMgPSBbXTtcclxuXHJcbiAgY29uc3QgZXZlbnRzID0gbmV3IEVtaXR0ZXIoKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlKCl7XHJcbiAgICBjb25zdCBnYW1lUGFkcyA9IG5hdmlnYXRvci5nZXRHYW1lcGFkcygpO1xyXG4gICAgZm9yKCBsZXQgaT0wOyBpPGdhbWVQYWRzLmxlbmd0aDsgaSsrICl7XHJcbiAgICAgIGNvbnN0IGdhbWVQYWQgPSBnYW1lUGFkc1sgaSBdO1xyXG4gICAgICBpZiggZ2FtZVBhZCApe1xyXG4gICAgICAgIGlmKCBwYWRzWyBpIF0gPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICAgICAgcGFkc1sgaSBdID0gY3JlYXRlUGFkSGFuZGxlciggZ2FtZVBhZCApO1xyXG4gICAgICAgICAgZXZlbnRzLmVtaXQoICdjb25uZWN0ZWQnLCBwYWRzWyBpIF0gKTtcclxuICAgICAgICAgIGV2ZW50cy5lbWl0KCAnY29ubmVjdGVkJytpLCBwYWRzWyBpIF0gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBhZHNbIGkgXS51cGRhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHVwZGF0ZSxcclxuICAgIHBhZHMsXHJcbiAgICBldmVudHNcclxuICB9O1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUGFkSGFuZGxlciggcGFkICl7XHJcbiAgY29uc3QgZXZlbnRzID0gbmV3IEVtaXR0ZXIoKTtcclxuXHJcbiAgbGV0IGxhc3RCdXR0b25zID0gY2xvbmVCdXR0b25zKCBwYWQuYnV0dG9ucyApO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGUoKXtcclxuXHJcbiAgICBjb25zdCBidXR0b25zID0gcGFkLmJ1dHRvbnM7XHJcblxyXG4gICAgLy8gIGNvbXBhcmVcclxuICAgIGJ1dHRvbnMuZm9yRWFjaCggKCBidXR0b24sIGluZGV4ICk9PntcclxuXHJcbiAgICAgIGNvbnN0IGxhc3RCdXR0b24gPSBsYXN0QnV0dG9uc1sgaW5kZXggXTtcclxuICAgICAgLy8gY29uc29sZS5sb2coIGJ1dHRvbi5wcmVzc2VkLCBsYXN0QnV0dG9uLnByZXNzZWQgKTtcclxuICAgICAgaWYoIGJ1dHRvbi5wcmVzc2VkICE9PSBsYXN0QnV0dG9uLnByZXNzZWQgKXtcclxuICAgICAgICBpZiggYnV0dG9uLnByZXNzZWQgKXtcclxuICAgICAgICAgIGV2ZW50cy5lbWl0KCAnYnV0dG9uUHJlc3NlZCcsIGluZGV4LCBidXR0b24udmFsdWUgKTtcclxuICAgICAgICAgIGV2ZW50cy5lbWl0KCAnYnV0dG9uJytpbmRleCsnUHJlc3NlZCcsIGJ1dHRvbi52YWx1ZSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgZXZlbnRzLmVtaXQoICdidXR0b25SZWxlYXNlZCcsIGluZGV4LCBidXR0b24udmFsdWUgKTtcclxuICAgICAgICAgIGV2ZW50cy5lbWl0KCAnYnV0dG9uJytpbmRleCsnUmVsZWFzZWQnLCBidXR0b24udmFsdWUgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBsYXN0QnV0dG9ucyA9IGNsb25lQnV0dG9ucyggcGFkLmJ1dHRvbnMgKTtcclxuXHJcbiAgfVxyXG5cclxuICBldmVudHMudXBkYXRlID0gdXBkYXRlO1xyXG5cclxuICByZXR1cm4gZXZlbnRzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbG9uZUJ1dHRvbnMoIGJ1dHRvbnMgKXtcclxuICBjb25zdCBjbG9uZWQgPSBbXTtcclxuXHJcbiAgYnV0dG9ucy5mb3JFYWNoKCBmdW5jdGlvbiggYnV0dG9uICl7XHJcbiAgICBjbG9uZWQucHVzaCh7XHJcbiAgICAgIHByZXNzZWQ6IGJ1dHRvbi5wcmVzc2VkLFxyXG4gICAgICB0b3VjaGVkOiBidXR0b24udG91Y2hlZCxcclxuICAgICAgdmFsdWU6IGJ1dHRvbi52YWx1ZVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGNsb25lZDtcclxufSIsImltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XHJcblxyXG5pbXBvcnQgKiBhcyBWUkNvbnRyb2xzIGZyb20gJy4vdnJjb250cm9scyc7XHJcbmltcG9ydCAqIGFzIFZSRWZmZWN0cyBmcm9tICcuL3ZyZWZmZWN0cyc7XHJcbmltcG9ydCAqIGFzIFZpdmVDb250cm9sbGVyIGZyb20gJy4vdml2ZWNvbnRyb2xsZXInO1xyXG5pbXBvcnQgKiBhcyBXRUJWUiBmcm9tICcuL3dlYnZyJztcclxuaW1wb3J0ICogYXMgT2JqTG9hZGVyIGZyb20gJy4vb2JqbG9hZGVyJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGUoIFRIUkVFICl7XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbigge1xyXG5cclxuICAgIGVtcHR5Um9vbSA9IHRydWUsXHJcbiAgICBzdGFuZGluZyA9IHRydWUsXHJcbiAgICBsb2FkQ29udHJvbGxlcnMgPSB0cnVlLFxyXG4gICAgdnJCdXR0b24gPSB0cnVlLFxyXG4gICAgYXV0b0VudGVyID0gZmFsc2UsXHJcbiAgICBhbnRpQWxpYXMgPSB0cnVlLFxyXG4gICAgcGF0aFRvQ29udHJvbGxlcnMgPSAnbW9kZWxzL29iai92aXZlLWNvbnRyb2xsZXIvJyxcclxuICAgIGNvbnRyb2xsZXJNb2RlbE5hbWUgPSAndnJfY29udHJvbGxlcl92aXZlXzFfNS5vYmonLFxyXG4gICAgY29udHJvbGxlclRleHR1cmVNYXAgPSAnb25lcG9pbnRmaXZlX3RleHR1cmUucG5nJyxcclxuICAgIGNvbnRyb2xsZXJTcGVjTWFwID0gJ29uZXBvaW50Zml2ZV9zcGVjLnBuZydcclxuXHJcbiAgfSA9IHt9ICl7XHJcblxyXG4gICAgaWYgKCBXRUJWUi5pc0xhdGVzdEF2YWlsYWJsZSgpID09PSBmYWxzZSApIHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggV0VCVlIuZ2V0TWVzc2FnZSgpICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZXZlbnRzID0gbmV3IEVtaXR0ZXIoKTtcclxuXHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggY29udGFpbmVyICk7XHJcblxyXG5cclxuICAgIGNvbnN0IHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcblxyXG4gICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA3MCwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAgKTtcclxuICAgIHNjZW5lLmFkZCggY2FtZXJhICk7XHJcblxyXG4gICAgaWYoIGVtcHR5Um9vbSApe1xyXG4gICAgICBjb25zdCByb29tID0gbmV3IFRIUkVFLk1lc2goXHJcbiAgICAgICAgbmV3IFRIUkVFLkJveEdlb21ldHJ5KCA2LCA2LCA2LCA4LCA4LCA4ICksXHJcbiAgICAgICAgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweDQwNDA0MCwgd2lyZWZyYW1lOiB0cnVlIH0gKVxyXG4gICAgICApO1xyXG4gICAgICByb29tLnBvc2l0aW9uLnkgPSAzO1xyXG4gICAgICBzY2VuZS5hZGQoIHJvb20gKTtcclxuXHJcbiAgICAgIHNjZW5lLmFkZCggbmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCggMHg2MDYwNjAsIDB4NDA0MDQwICkgKTtcclxuXHJcbiAgICAgIGxldCBsaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KCAweGZmZmZmZiApO1xyXG4gICAgICBsaWdodC5wb3NpdGlvbi5zZXQoIDEsIDEsIDEgKS5ub3JtYWxpemUoKTtcclxuICAgICAgc2NlbmUuYWRkKCBsaWdodCApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoIHsgYW50aWFsaWFzOiBhbnRpQWxpYXMgfSApO1xyXG4gICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvciggMHg1MDUwNTAgKTtcclxuICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8oIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICk7XHJcbiAgICByZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XHJcbiAgICByZW5kZXJlci5zb3J0T2JqZWN0cyA9IGZhbHNlO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKCByZW5kZXJlci5kb21FbGVtZW50ICk7XHJcblxyXG4gICAgY29uc3QgY29udHJvbHMgPSBuZXcgVEhSRUUuVlJDb250cm9scyggY2FtZXJhICk7XHJcbiAgICBjb250cm9scy5zdGFuZGluZyA9IHN0YW5kaW5nO1xyXG5cclxuXHJcbiAgICBjb25zdCBjb250cm9sbGVyMSA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgY29uc3QgY29udHJvbGxlcjIgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgIHNjZW5lLmFkZCggY29udHJvbGxlcjEsIGNvbnRyb2xsZXIyICk7XHJcblxyXG4gICAgbGV0IGMxLCBjMjtcclxuXHJcbiAgICBpZiggbG9hZENvbnRyb2xsZXJzICl7XHJcbiAgICAgIGMxID0gbmV3IFRIUkVFLlZpdmVDb250cm9sbGVyKCAwICk7XHJcbiAgICAgIGMxLnN0YW5kaW5nTWF0cml4ID0gY29udHJvbHMuZ2V0U3RhbmRpbmdNYXRyaXgoKTtcclxuICAgICAgY29udHJvbGxlcjEuYWRkKCBjMSApO1xyXG5cclxuICAgICAgYzIgPSBuZXcgVEhSRUUuVml2ZUNvbnRyb2xsZXIoIDEgKTtcclxuICAgICAgYzIuc3RhbmRpbmdNYXRyaXggPSBjb250cm9scy5nZXRTdGFuZGluZ01hdHJpeCgpO1xyXG4gICAgICBjb250cm9sbGVyMi5hZGQoIGMyICk7XHJcblxyXG4gICAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLk9CSkxvYWRlcigpO1xyXG4gICAgICBsb2FkZXIuc2V0UGF0aCggcGF0aFRvQ29udHJvbGxlcnMgKTtcclxuICAgICAgbG9hZGVyLmxvYWQoIGNvbnRyb2xsZXJNb2RlbE5hbWUsIGZ1bmN0aW9uICggb2JqZWN0ICkge1xyXG5cclxuICAgICAgICB2YXIgdGV4dHVyZUxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XHJcbiAgICAgICAgdGV4dHVyZUxvYWRlci5zZXRQYXRoKCBwYXRoVG9Db250cm9sbGVycyApO1xyXG5cclxuICAgICAgICB2YXIgY29udHJvbGxlciA9IG9iamVjdC5jaGlsZHJlblsgMCBdO1xyXG4gICAgICAgIGNvbnRyb2xsZXIubWF0ZXJpYWwubWFwID0gdGV4dHVyZUxvYWRlci5sb2FkKCBjb250cm9sbGVyVGV4dHVyZU1hcCApO1xyXG4gICAgICAgIGNvbnRyb2xsZXIubWF0ZXJpYWwuc3BlY3VsYXJNYXAgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoIGNvbnRyb2xsZXJTcGVjTWFwICk7XHJcblxyXG4gICAgICAgIGMxLmFkZCggb2JqZWN0LmNsb25lKCkgKTtcclxuICAgICAgICBjMi5hZGQoIG9iamVjdC5jbG9uZSgpICk7XHJcblxyXG4gICAgICB9ICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZWZmZWN0ID0gbmV3IFRIUkVFLlZSRWZmZWN0KCByZW5kZXJlciApO1xyXG5cclxuICAgIGlmICggV0VCVlIuaXNBdmFpbGFibGUoKSA9PT0gdHJ1ZSApIHtcclxuICAgICAgaWYoIHZyQnV0dG9uICl7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggV0VCVlIuZ2V0QnV0dG9uKCBlZmZlY3QgKSApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiggYXV0b0VudGVyICl7XHJcbiAgICAgICAgc2V0VGltZW91dCggKCk9PmVmZmVjdC5yZXF1ZXN0UHJlc2VudCgpLCAxMDAwICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgICAgZWZmZWN0LnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcclxuXHJcbiAgICAgIGV2ZW50cy5lbWl0KCAncmVzaXplJywgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xyXG4gICAgfSwgZmFsc2UgKTtcclxuXHJcblxyXG4gICAgY29uc3QgY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcclxuICAgIGNsb2NrLnN0YXJ0KCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuICAgICAgY29uc3QgZHQgPSBjbG9jay5nZXREZWx0YSgpO1xyXG5cclxuICAgICAgZWZmZWN0LnJlcXVlc3RBbmltYXRpb25GcmFtZSggYW5pbWF0ZSApO1xyXG5cclxuICAgICAgY29udHJvbHMudXBkYXRlKCk7XHJcblxyXG4gICAgICBldmVudHMuZW1pdCggJ3RpY2snLCAgZHQgKTtcclxuXHJcbiAgICAgIHJlbmRlcigpO1xyXG5cclxuICAgICAgZXZlbnRzLmVtaXQoICdyZW5kZXInLCBkdCApXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVuZGVyKCkge1xyXG4gICAgICBlZmZlY3QucmVuZGVyKCBzY2VuZSwgY2FtZXJhICk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlVlIoKXtcclxuICAgICAgZWZmZWN0LmlzUHJlc2VudGluZyA/IGVmZmVjdC5leGl0UHJlc2VudCgpIDogZWZmZWN0LnJlcXVlc3RQcmVzZW50KCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFuaW1hdGUoKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzY2VuZSwgY2FtZXJhLCBjb250cm9scywgcmVuZGVyZXIsXHJcbiAgICAgIGNvbnRyb2xsZXJNb2RlbHM6IFsgYzEsIGMyIF0sXHJcbiAgICAgIGV2ZW50cyxcclxuICAgICAgdG9nZ2xlVlJcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBAYXV0aG9yIG1yZG9vYiAvIGh0dHA6Ly9tcmRvb2IuY29tL1xyXG4gKi9cclxuXHJcblRIUkVFLk9CSkxvYWRlciA9IGZ1bmN0aW9uICggbWFuYWdlciApIHtcclxuXHJcbiAgdGhpcy5tYW5hZ2VyID0gKCBtYW5hZ2VyICE9PSB1bmRlZmluZWQgKSA/IG1hbmFnZXIgOiBUSFJFRS5EZWZhdWx0TG9hZGluZ01hbmFnZXI7XHJcblxyXG4gIHRoaXMubWF0ZXJpYWxzID0gbnVsbDtcclxuXHJcbiAgdGhpcy5yZWdleHAgPSB7XHJcbiAgICAvLyB2IGZsb2F0IGZsb2F0IGZsb2F0XHJcbiAgICB2ZXJ0ZXhfcGF0dGVybiAgICAgICAgICAgOiAvXnZcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKVxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKykvLFxyXG4gICAgLy8gdm4gZmxvYXQgZmxvYXQgZmxvYXRcclxuICAgIG5vcm1hbF9wYXR0ZXJuICAgICAgICAgICA6IC9edm5cXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKVxccysoW1xcZHxcXC58XFwrfFxcLXxlfEVdKykvLFxyXG4gICAgLy8gdnQgZmxvYXQgZmxvYXRcclxuICAgIHV2X3BhdHRlcm4gICAgICAgICAgICAgICA6IC9ednRcXHMrKFtcXGR8XFwufFxcK3xcXC18ZXxFXSspXFxzKyhbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKS8sXHJcbiAgICAvLyBmIHZlcnRleCB2ZXJ0ZXggdmVydGV4XHJcbiAgICBmYWNlX3ZlcnRleCAgICAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXHMrKC0/XFxkKylcXHMrKC0/XFxkKykoPzpcXHMrKC0/XFxkKykpPy8sXHJcbiAgICAvLyBmIHZlcnRleC91diB2ZXJ0ZXgvdXYgdmVydGV4L3V2XHJcbiAgICBmYWNlX3ZlcnRleF91diAgICAgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC8oLT9cXGQrKSk/LyxcclxuICAgIC8vIGYgdmVydGV4L3V2L25vcm1hbCB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWxcclxuICAgIGZhY2VfdmVydGV4X3V2X25vcm1hbCAgICA6IC9eZlxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKylcXHMrKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspXFxzKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKSg/OlxccysoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykpPy8sXHJcbiAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICBmYWNlX3ZlcnRleF9ub3JtYWwgICAgICAgOiAvXmZcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKVxccysoLT9cXGQrKVxcL1xcLygtP1xcZCspXFxzKygtP1xcZCspXFwvXFwvKC0/XFxkKykoPzpcXHMrKC0/XFxkKylcXC9cXC8oLT9cXGQrKSk/LyxcclxuICAgIC8vIG8gb2JqZWN0X25hbWUgfCBnIGdyb3VwX25hbWVcclxuICAgIG9iamVjdF9wYXR0ZXJuICAgICAgICAgICA6IC9eW29nXVxccyooLispPy8sXHJcbiAgICAvLyBzIGJvb2xlYW5cclxuICAgIHNtb290aGluZ19wYXR0ZXJuICAgICAgICA6IC9ec1xccysoXFxkK3xvbnxvZmYpLyxcclxuICAgIC8vIG10bGxpYiBmaWxlX3JlZmVyZW5jZVxyXG4gICAgbWF0ZXJpYWxfbGlicmFyeV9wYXR0ZXJuIDogL15tdGxsaWIgLyxcclxuICAgIC8vIHVzZW10bCBtYXRlcmlhbF9uYW1lXHJcbiAgICBtYXRlcmlhbF91c2VfcGF0dGVybiAgICAgOiAvXnVzZW10bCAvXHJcbiAgfTtcclxuXHJcbn07XHJcblxyXG5USFJFRS5PQkpMb2FkZXIucHJvdG90eXBlID0ge1xyXG5cclxuICBjb25zdHJ1Y3RvcjogVEhSRUUuT0JKTG9hZGVyLFxyXG5cclxuICBsb2FkOiBmdW5jdGlvbiAoIHVybCwgb25Mb2FkLCBvblByb2dyZXNzLCBvbkVycm9yICkge1xyXG5cclxuICAgIHZhciBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5YSFJMb2FkZXIoIHNjb3BlLm1hbmFnZXIgKTtcclxuICAgIGxvYWRlci5zZXRQYXRoKCB0aGlzLnBhdGggKTtcclxuICAgIGxvYWRlci5sb2FkKCB1cmwsIGZ1bmN0aW9uICggdGV4dCApIHtcclxuXHJcbiAgICAgIG9uTG9hZCggc2NvcGUucGFyc2UoIHRleHQgKSApO1xyXG5cclxuICAgIH0sIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKTtcclxuXHJcbiAgfSxcclxuXHJcbiAgc2V0UGF0aDogZnVuY3Rpb24gKCB2YWx1ZSApIHtcclxuXHJcbiAgICB0aGlzLnBhdGggPSB2YWx1ZTtcclxuXHJcbiAgfSxcclxuXHJcbiAgc2V0TWF0ZXJpYWxzOiBmdW5jdGlvbiAoIG1hdGVyaWFscyApIHtcclxuXHJcbiAgICB0aGlzLm1hdGVyaWFscyA9IG1hdGVyaWFscztcclxuXHJcbiAgfSxcclxuXHJcbiAgX2NyZWF0ZVBhcnNlclN0YXRlIDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHZhciBzdGF0ZSA9IHtcclxuICAgICAgb2JqZWN0cyAgOiBbXSxcclxuICAgICAgb2JqZWN0ICAgOiB7fSxcclxuXHJcbiAgICAgIHZlcnRpY2VzIDogW10sXHJcbiAgICAgIG5vcm1hbHMgIDogW10sXHJcbiAgICAgIHV2cyAgICAgIDogW10sXHJcblxyXG4gICAgICBtYXRlcmlhbExpYnJhcmllcyA6IFtdLFxyXG5cclxuICAgICAgc3RhcnRPYmplY3Q6IGZ1bmN0aW9uICggbmFtZSwgZnJvbURlY2xhcmF0aW9uICkge1xyXG5cclxuICAgICAgICAvLyBJZiB0aGUgY3VycmVudCBvYmplY3QgKGluaXRpYWwgZnJvbSByZXNldCkgaXMgbm90IGZyb20gYSBnL28gZGVjbGFyYXRpb24gaW4gdGhlIHBhcnNlZFxyXG4gICAgICAgIC8vIGZpbGUuIFdlIG5lZWQgdG8gdXNlIGl0IGZvciB0aGUgZmlyc3QgcGFyc2VkIGcvbyB0byBrZWVwIHRoaW5ncyBpbiBzeW5jLlxyXG4gICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdGhpcy5vYmplY3QuZnJvbURlY2xhcmF0aW9uID09PSBmYWxzZSApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgIHRoaXMub2JqZWN0LmZyb21EZWNsYXJhdGlvbiA9ICggZnJvbURlY2xhcmF0aW9uICE9PSBmYWxzZSApO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHJldmlvdXNNYXRlcmlhbCA9ICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMub2JqZWN0LmN1cnJlbnRNYXRlcmlhbCgpIDogdW5kZWZpbmVkICk7XHJcblxyXG4gICAgICAgIHRoaXMub2JqZWN0ID0ge1xyXG4gICAgICAgICAgbmFtZSA6IG5hbWUgfHwgJycsXHJcbiAgICAgICAgICBmcm9tRGVjbGFyYXRpb24gOiAoIGZyb21EZWNsYXJhdGlvbiAhPT0gZmFsc2UgKSxcclxuXHJcbiAgICAgICAgICBnZW9tZXRyeSA6IHtcclxuICAgICAgICAgICAgdmVydGljZXMgOiBbXSxcclxuICAgICAgICAgICAgbm9ybWFscyAgOiBbXSxcclxuICAgICAgICAgICAgdXZzICAgICAgOiBbXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1hdGVyaWFscyA6IFtdLFxyXG4gICAgICAgICAgc21vb3RoIDogdHJ1ZSxcclxuXHJcbiAgICAgICAgICBzdGFydE1hdGVyaWFsIDogZnVuY3Rpb24oIG5hbWUsIGxpYnJhcmllcyApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX2ZpbmFsaXplKCBmYWxzZSApO1xyXG5cclxuICAgICAgICAgICAgLy8gTmV3IHVzZW10bCBkZWNsYXJhdGlvbiBvdmVyd3JpdGVzIGFuIGluaGVyaXRlZCBtYXRlcmlhbCwgZXhjZXB0IGlmIGZhY2VzIHdlcmUgZGVjbGFyZWRcclxuICAgICAgICAgICAgLy8gYWZ0ZXIgdGhlIG1hdGVyaWFsLCB0aGVuIGl0IG11c3QgYmUgcHJlc2VydmVkIGZvciBwcm9wZXIgTXVsdGlNYXRlcmlhbCBjb250aW51YXRpb24uXHJcbiAgICAgICAgICAgIGlmICggcHJldmlvdXMgJiYgKCBwcmV2aW91cy5pbmhlcml0ZWQgfHwgcHJldmlvdXMuZ3JvdXBDb3VudCA8PSAwICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnNwbGljZSggcHJldmlvdXMuaW5kZXgsIDEgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IHtcclxuICAgICAgICAgICAgICBpbmRleCAgICAgIDogdGhpcy5tYXRlcmlhbHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgIG5hbWUgICAgICAgOiBuYW1lIHx8ICcnLFxyXG4gICAgICAgICAgICAgIG10bGxpYiAgICAgOiAoIEFycmF5LmlzQXJyYXkoIGxpYnJhcmllcyApICYmIGxpYnJhcmllcy5sZW5ndGggPiAwID8gbGlicmFyaWVzWyBsaWJyYXJpZXMubGVuZ3RoIC0gMSBdIDogJycgKSxcclxuICAgICAgICAgICAgICBzbW9vdGggICAgIDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuc21vb3RoIDogdGhpcy5zbW9vdGggKSxcclxuICAgICAgICAgICAgICBncm91cFN0YXJ0IDogKCBwcmV2aW91cyAhPT0gdW5kZWZpbmVkID8gcHJldmlvdXMuZ3JvdXBFbmQgOiAwICksXHJcbiAgICAgICAgICAgICAgZ3JvdXBFbmQgICA6IC0xLFxyXG4gICAgICAgICAgICAgIGdyb3VwQ291bnQgOiAtMSxcclxuICAgICAgICAgICAgICBpbmhlcml0ZWQgIDogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICAgIGNsb25lIDogZnVuY3Rpb24oIGluZGV4ICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgaW5kZXggICAgICA6ICggdHlwZW9mIGluZGV4ID09PSAnbnVtYmVyJyA/IGluZGV4IDogdGhpcy5pbmRleCApLFxyXG4gICAgICAgICAgICAgICAgICBuYW1lICAgICAgIDogdGhpcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICBtdGxsaWIgICAgIDogdGhpcy5tdGxsaWIsXHJcbiAgICAgICAgICAgICAgICAgIHNtb290aCAgICAgOiB0aGlzLnNtb290aCxcclxuICAgICAgICAgICAgICAgICAgZ3JvdXBTdGFydCA6IHRoaXMuZ3JvdXBFbmQsXHJcbiAgICAgICAgICAgICAgICAgIGdyb3VwRW5kICAgOiAtMSxcclxuICAgICAgICAgICAgICAgICAgZ3JvdXBDb3VudCA6IC0xLFxyXG4gICAgICAgICAgICAgICAgICBpbmhlcml0ZWQgIDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMucHVzaCggbWF0ZXJpYWwgKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgIGN1cnJlbnRNYXRlcmlhbCA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFscy5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGVyaWFsc1sgdGhpcy5tYXRlcmlhbHMubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgX2ZpbmFsaXplIDogZnVuY3Rpb24oIGVuZCApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBsYXN0TXVsdGlNYXRlcmlhbCA9IHRoaXMuY3VycmVudE1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgIGlmICggbGFzdE11bHRpTWF0ZXJpYWwgJiYgbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgPT09IC0xICkge1xyXG5cclxuICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cEVuZCA9IHRoaXMuZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoIC8gMztcclxuICAgICAgICAgICAgICBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cENvdW50ID0gbGFzdE11bHRpTWF0ZXJpYWwuZ3JvdXBFbmQgLSBsYXN0TXVsdGlNYXRlcmlhbC5ncm91cFN0YXJ0O1xyXG4gICAgICAgICAgICAgIGxhc3RNdWx0aU1hdGVyaWFsLmluaGVyaXRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gR3VhcmFudGVlIGF0IGxlYXN0IG9uZSBlbXB0eSBtYXRlcmlhbCwgdGhpcyBtYWtlcyB0aGUgY3JlYXRpb24gbGF0ZXIgbW9yZSBzdHJhaWdodCBmb3J3YXJkLlxyXG4gICAgICAgICAgICBpZiAoIGVuZCAhPT0gZmFsc2UgJiYgdGhpcy5tYXRlcmlhbHMubGVuZ3RoID09PSAwICkge1xyXG4gICAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbmFtZSAgIDogJycsXHJcbiAgICAgICAgICAgICAgICBzbW9vdGggOiB0aGlzLnNtb290aFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbGFzdE11bHRpTWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEluaGVyaXQgcHJldmlvdXMgb2JqZWN0cyBtYXRlcmlhbC5cclxuICAgICAgICAvLyBTcGVjIHRlbGxzIHVzIHRoYXQgYSBkZWNsYXJlZCBtYXRlcmlhbCBtdXN0IGJlIHNldCB0byBhbGwgb2JqZWN0cyB1bnRpbCBhIG5ldyBtYXRlcmlhbCBpcyBkZWNsYXJlZC5cclxuICAgICAgICAvLyBJZiBhIHVzZW10bCBkZWNsYXJhdGlvbiBpcyBlbmNvdW50ZXJlZCB3aGlsZSB0aGlzIG5ldyBvYmplY3QgaXMgYmVpbmcgcGFyc2VkLCBpdCB3aWxsXHJcbiAgICAgICAgLy8gb3ZlcndyaXRlIHRoZSBpbmhlcml0ZWQgbWF0ZXJpYWwuIEV4Y2VwdGlvbiBiZWluZyB0aGF0IHRoZXJlIHdhcyBhbHJlYWR5IGZhY2UgZGVjbGFyYXRpb25zXHJcbiAgICAgICAgLy8gdG8gdGhlIGluaGVyaXRlZCBtYXRlcmlhbCwgdGhlbiBpdCB3aWxsIGJlIHByZXNlcnZlZCBmb3IgcHJvcGVyIE11bHRpTWF0ZXJpYWwgY29udGludWF0aW9uLlxyXG5cclxuICAgICAgICBpZiAoIHByZXZpb3VzTWF0ZXJpYWwgJiYgcHJldmlvdXNNYXRlcmlhbC5uYW1lICYmIHR5cGVvZiBwcmV2aW91c01hdGVyaWFsLmNsb25lID09PSBcImZ1bmN0aW9uXCIgKSB7XHJcblxyXG4gICAgICAgICAgdmFyIGRlY2xhcmVkID0gcHJldmlvdXNNYXRlcmlhbC5jbG9uZSggMCApO1xyXG4gICAgICAgICAgZGVjbGFyZWQuaW5oZXJpdGVkID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMub2JqZWN0Lm1hdGVyaWFscy5wdXNoKCBkZWNsYXJlZCApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKCB0aGlzLm9iamVjdCApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZpbmFsaXplIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5vYmplY3QgJiYgdHlwZW9mIHRoaXMub2JqZWN0Ll9maW5hbGl6ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLm9iamVjdC5fZmluYWxpemUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHBhcnNlVmVydGV4SW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDMgKSAqIDM7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFyc2VOb3JtYWxJbmRleDogZnVuY3Rpb24gKCB2YWx1ZSwgbGVuICkge1xyXG5cclxuICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCggdmFsdWUsIDEwICk7XHJcbiAgICAgICAgcmV0dXJuICggaW5kZXggPj0gMCA/IGluZGV4IC0gMSA6IGluZGV4ICsgbGVuIC8gMyApICogMztcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwYXJzZVVWSW5kZXg6IGZ1bmN0aW9uICggdmFsdWUsIGxlbiApIHtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xyXG4gICAgICAgIHJldHVybiAoIGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIGxlbiAvIDIgKSAqIDI7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkVmVydGV4OiBmdW5jdGlvbiAoIGEsIGIsIGMgKSB7XHJcblxyXG4gICAgICAgIHZhciBzcmMgPSB0aGlzLnZlcnRpY2VzO1xyXG4gICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS52ZXJ0aWNlcztcclxuXHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkVmVydGV4TGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICB2YXIgc3JjID0gdGhpcy52ZXJ0aWNlcztcclxuICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkudmVydGljZXM7XHJcblxyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDIgXSApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZE5vcm1hbCA6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgdmFyIHNyYyA9IHRoaXMubm9ybWFscztcclxuICAgICAgICB2YXIgZHN0ID0gdGhpcy5vYmplY3QuZ2VvbWV0cnkubm9ybWFscztcclxuXHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMiBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBiICsgMiBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGMgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMiBdICk7XHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkVVY6IGZ1bmN0aW9uICggYSwgYiwgYyApIHtcclxuXHJcbiAgICAgICAgdmFyIHNyYyA9IHRoaXMudXZzO1xyXG4gICAgICAgIHZhciBkc3QgPSB0aGlzLm9iamVjdC5nZW9tZXRyeS51dnM7XHJcblxyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAwIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBhICsgMSBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYiArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGIgKyAxIF0gKTtcclxuICAgICAgICBkc3QucHVzaCggc3JjWyBjICsgMCBdICk7XHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYyArIDEgXSApO1xyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZFVWTGluZTogZnVuY3Rpb24gKCBhICkge1xyXG5cclxuICAgICAgICB2YXIgc3JjID0gdGhpcy51dnM7XHJcbiAgICAgICAgdmFyIGRzdCA9IHRoaXMub2JqZWN0Lmdlb21ldHJ5LnV2cztcclxuXHJcbiAgICAgICAgZHN0LnB1c2goIHNyY1sgYSArIDAgXSApO1xyXG4gICAgICAgIGRzdC5wdXNoKCBzcmNbIGEgKyAxIF0gKTtcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGRGYWNlOiBmdW5jdGlvbiAoIGEsIGIsIGMsIGQsIHVhLCB1YiwgdWMsIHVkLCBuYSwgbmIsIG5jLCBuZCApIHtcclxuXHJcbiAgICAgICAgdmFyIHZMZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdmFyIGlhID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBhLCB2TGVuICk7XHJcbiAgICAgICAgdmFyIGliID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBiLCB2TGVuICk7XHJcbiAgICAgICAgdmFyIGljID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBjLCB2TGVuICk7XHJcbiAgICAgICAgdmFyIGlkO1xyXG5cclxuICAgICAgICBpZiAoIGQgPT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLmFkZFZlcnRleCggaWEsIGliLCBpYyApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVZlcnRleEluZGV4KCBkLCB2TGVuICk7XHJcblxyXG4gICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgoIGlhLCBpYiwgaWQgKTtcclxuICAgICAgICAgIHRoaXMuYWRkVmVydGV4KCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCB1YSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgIHZhciB1dkxlbiA9IHRoaXMudXZzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICBpYSA9IHRoaXMucGFyc2VVVkluZGV4KCB1YSwgdXZMZW4gKTtcclxuICAgICAgICAgIGliID0gdGhpcy5wYXJzZVVWSW5kZXgoIHViLCB1dkxlbiApO1xyXG4gICAgICAgICAgaWMgPSB0aGlzLnBhcnNlVVZJbmRleCggdWMsIHV2TGVuICk7XHJcblxyXG4gICAgICAgICAgaWYgKCBkID09PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZFVWKCBpYSwgaWIsIGljICk7XHJcblxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVVWSW5kZXgoIHVkLCB1dkxlbiApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRVViggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFVWKCBpYiwgaWMsIGlkICk7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggbmEgIT09IHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAgICAgICAvLyBOb3JtYWxzIGFyZSBtYW55IHRpbWVzIHRoZSBzYW1lLiBJZiBzbywgc2tpcCBmdW5jdGlvbiBjYWxsIGFuZCBwYXJzZUludC5cclxuICAgICAgICAgIHZhciBuTGVuID0gdGhpcy5ub3JtYWxzLmxlbmd0aDtcclxuICAgICAgICAgIGlhID0gdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYSwgbkxlbiApO1xyXG5cclxuICAgICAgICAgIGliID0gbmEgPT09IG5iID8gaWEgOiB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5iLCBuTGVuICk7XHJcbiAgICAgICAgICBpYyA9IG5hID09PSBuYyA/IGlhIDogdGhpcy5wYXJzZU5vcm1hbEluZGV4KCBuYywgbkxlbiApO1xyXG5cclxuICAgICAgICAgIGlmICggZCA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGROb3JtYWwoIGlhLCBpYiwgaWMgKTtcclxuXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgaWQgPSB0aGlzLnBhcnNlTm9ybWFsSW5kZXgoIG5kLCBuTGVuICk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWEsIGliLCBpZCApO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE5vcm1hbCggaWIsIGljLCBpZCApO1xyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkZExpbmVHZW9tZXRyeTogZnVuY3Rpb24gKCB2ZXJ0aWNlcywgdXZzICkge1xyXG5cclxuICAgICAgICB0aGlzLm9iamVjdC5nZW9tZXRyeS50eXBlID0gJ0xpbmUnO1xyXG5cclxuICAgICAgICB2YXIgdkxlbiA9IHRoaXMudmVydGljZXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciB1dkxlbiA9IHRoaXMudXZzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgZm9yICggdmFyIHZpID0gMCwgbCA9IHZlcnRpY2VzLmxlbmd0aDsgdmkgPCBsOyB2aSArKyApIHtcclxuXHJcbiAgICAgICAgICB0aGlzLmFkZFZlcnRleExpbmUoIHRoaXMucGFyc2VWZXJ0ZXhJbmRleCggdmVydGljZXNbIHZpIF0sIHZMZW4gKSApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoIHZhciB1dmkgPSAwLCBsID0gdXZzLmxlbmd0aDsgdXZpIDwgbDsgdXZpICsrICkge1xyXG5cclxuICAgICAgICAgIHRoaXMuYWRkVVZMaW5lKCB0aGlzLnBhcnNlVVZJbmRleCggdXZzWyB1dmkgXSwgdXZMZW4gKSApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0ZS5zdGFydE9iamVjdCggJycsIGZhbHNlICk7XHJcblxyXG4gICAgcmV0dXJuIHN0YXRlO1xyXG5cclxuICB9LFxyXG5cclxuICBwYXJzZTogZnVuY3Rpb24gKCB0ZXh0ICkge1xyXG5cclxuICAgIGNvbnNvbGUudGltZSggJ09CSkxvYWRlcicgKTtcclxuXHJcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9jcmVhdGVQYXJzZXJTdGF0ZSgpO1xyXG5cclxuICAgIGlmICggdGV4dC5pbmRleE9mKCAnXFxyXFxuJyApICE9PSAtIDEgKSB7XHJcblxyXG4gICAgICAvLyBUaGlzIGlzIGZhc3RlciB0aGFuIFN0cmluZy5zcGxpdCB3aXRoIHJlZ2V4IHRoYXQgc3BsaXRzIG9uIGJvdGhcclxuICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSggJ1xcclxcbicsICdcXG4nICk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaW5lcyA9IHRleHQuc3BsaXQoICdcXG4nICk7XHJcbiAgICB2YXIgbGluZSA9ICcnLCBsaW5lRmlyc3RDaGFyID0gJycsIGxpbmVTZWNvbmRDaGFyID0gJyc7XHJcbiAgICB2YXIgbGluZUxlbmd0aCA9IDA7XHJcbiAgICB2YXIgcmVzdWx0ID0gW107XHJcblxyXG4gICAgLy8gRmFzdGVyIHRvIGp1c3QgdHJpbSBsZWZ0IHNpZGUgb2YgdGhlIGxpbmUuIFVzZSBpZiBhdmFpbGFibGUuXHJcbiAgICB2YXIgdHJpbUxlZnQgPSAoIHR5cGVvZiAnJy50cmltTGVmdCA9PT0gJ2Z1bmN0aW9uJyApO1xyXG5cclxuICAgIGZvciAoIHZhciBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkgKysgKSB7XHJcblxyXG4gICAgICBsaW5lID0gbGluZXNbIGkgXTtcclxuXHJcbiAgICAgIGxpbmUgPSB0cmltTGVmdCA/IGxpbmUudHJpbUxlZnQoKSA6IGxpbmUudHJpbSgpO1xyXG5cclxuICAgICAgbGluZUxlbmd0aCA9IGxpbmUubGVuZ3RoO1xyXG5cclxuICAgICAgaWYgKCBsaW5lTGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICBsaW5lRmlyc3RDaGFyID0gbGluZS5jaGFyQXQoIDAgKTtcclxuXHJcbiAgICAgIC8vIEB0b2RvIGludm9rZSBwYXNzZWQgaW4gaGFuZGxlciBpZiBhbnlcclxuICAgICAgaWYgKCBsaW5lRmlyc3RDaGFyID09PSAnIycgKSBjb250aW51ZTtcclxuXHJcbiAgICAgIGlmICggbGluZUZpcnN0Q2hhciA9PT0gJ3YnICkge1xyXG5cclxuICAgICAgICBsaW5lU2Vjb25kQ2hhciA9IGxpbmUuY2hhckF0KCAxICk7XHJcblxyXG4gICAgICAgIGlmICggbGluZVNlY29uZENoYXIgPT09ICcgJyAmJiAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLnZlcnRleF9wYXR0ZXJuLmV4ZWMoIGxpbmUgKSApICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICAgIC8vIDAgICAgICAgICAgICAgICAgICAxICAgICAgMiAgICAgIDNcclxuICAgICAgICAgIC8vIFtcInYgMS4wIDIuMCAzLjBcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuXHJcbiAgICAgICAgICBzdGF0ZS52ZXJ0aWNlcy5wdXNoKFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDMgXSApXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJ24nICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAubm9ybWFsX3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAxICAgICAgMiAgICAgIDNcclxuICAgICAgICAgIC8vIFtcInZuIDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXHJcblxyXG4gICAgICAgICAgc3RhdGUubm9ybWFscy5wdXNoKFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDEgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDIgXSApLFxyXG4gICAgICAgICAgICBwYXJzZUZsb2F0KCByZXN1bHRbIDMgXSApXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCBsaW5lU2Vjb25kQ2hhciA9PT0gJ3QnICYmICggcmVzdWx0ID0gdGhpcy5yZWdleHAudXZfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgMSAgICAgIDJcclxuICAgICAgICAgIC8vIFtcInZ0IDAuMSAwLjJcIiwgXCIwLjFcIiwgXCIwLjJcIl1cclxuXHJcbiAgICAgICAgICBzdGF0ZS51dnMucHVzaChcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAxIF0gKSxcclxuICAgICAgICAgICAgcGFyc2VGbG9hdCggcmVzdWx0WyAyIF0gKVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVW5leHBlY3RlZCB2ZXJ0ZXgvbm9ybWFsL3V2IGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIGlmICggbGluZUZpcnN0Q2hhciA9PT0gXCJmXCIgKSB7XHJcblxyXG4gICAgICAgIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91dl9ub3JtYWwuZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gZiB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbFxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgICAgICAgICAgICAgIDEgICAgMiAgICAzICAgIDQgICAgNSAgICA2ICAgIDcgICAgOCAgICA5ICAgMTAgICAgICAgICAxMSAgICAgICAgIDEyXHJcbiAgICAgICAgICAvLyBbXCJmIDEvMS8xIDIvMi8yIDMvMy8zXCIsIFwiMVwiLCBcIjFcIiwgXCIxXCIsIFwiMlwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgXCIzXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDcgXSwgcmVzdWx0WyAxMCBdLFxyXG4gICAgICAgICAgICByZXN1bHRbIDIgXSwgcmVzdWx0WyA1IF0sIHJlc3VsdFsgOCBdLCByZXN1bHRbIDExIF0sXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMyBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA5IF0sIHJlc3VsdFsgMTIgXVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5mYWNlX3ZlcnRleF91di5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyBmIHZlcnRleC91diB2ZXJ0ZXgvdXYgdmVydGV4L3V2XHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgIC8vIFtcImYgMS8xIDIvMiAzLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMyBdLCByZXN1bHRbIDUgXSwgcmVzdWx0WyA3IF0sXHJcbiAgICAgICAgICAgIHJlc3VsdFsgMiBdLCByZXN1bHRbIDQgXSwgcmVzdWx0WyA2IF0sIHJlc3VsdFsgOCBdXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCAoIHJlc3VsdCA9IHRoaXMucmVnZXhwLmZhY2VfdmVydGV4X25vcm1hbC5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICAvLyBmIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsIHZlcnRleC8vbm9ybWFsXHJcbiAgICAgICAgICAvLyAwICAgICAgICAgICAgICAgICAgICAgMSAgICAyICAgIDMgICAgNCAgICA1ICAgIDYgICA3ICAgICAgICAgIDhcclxuICAgICAgICAgIC8vIFtcImYgMS8vMSAyLy8yIDMvLzNcIiwgXCIxXCIsIFwiMVwiLCBcIjJcIiwgXCIyXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMyBdLCByZXN1bHRbIDUgXSwgcmVzdWx0WyA3IF0sXHJcbiAgICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgcmVzdWx0WyAyIF0sIHJlc3VsdFsgNCBdLCByZXN1bHRbIDYgXSwgcmVzdWx0WyA4IF1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAuZmFjZV92ZXJ0ZXguZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgLy8gZiB2ZXJ0ZXggdmVydGV4IHZlcnRleFxyXG4gICAgICAgICAgLy8gMCAgICAgICAgICAgIDEgICAgMiAgICAzICAgNFxyXG4gICAgICAgICAgLy8gW1wiZiAxIDIgM1wiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCB1bmRlZmluZWRdXHJcblxyXG4gICAgICAgICAgc3RhdGUuYWRkRmFjZShcclxuICAgICAgICAgICAgcmVzdWx0WyAxIF0sIHJlc3VsdFsgMiBdLCByZXN1bHRbIDMgXSwgcmVzdWx0WyA0IF1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIlVuZXhwZWN0ZWQgZmFjZSBsaW5lOiAnXCIgKyBsaW5lICArIFwiJ1wiICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoIGxpbmVGaXJzdENoYXIgPT09IFwibFwiICkge1xyXG5cclxuICAgICAgICB2YXIgbGluZVBhcnRzID0gbGluZS5zdWJzdHJpbmcoIDEgKS50cmltKCkuc3BsaXQoIFwiIFwiICk7XHJcbiAgICAgICAgdmFyIGxpbmVWZXJ0aWNlcyA9IFtdLCBsaW5lVVZzID0gW107XHJcblxyXG4gICAgICAgIGlmICggbGluZS5pbmRleE9mKCBcIi9cIiApID09PSAtIDEgKSB7XHJcblxyXG4gICAgICAgICAgbGluZVZlcnRpY2VzID0gbGluZVBhcnRzO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIGZvciAoIHZhciBsaSA9IDAsIGxsZW4gPSBsaW5lUGFydHMubGVuZ3RoOyBsaSA8IGxsZW47IGxpICsrICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcnRzID0gbGluZVBhcnRzWyBsaSBdLnNwbGl0KCBcIi9cIiApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBwYXJ0c1sgMCBdICE9PSBcIlwiICkgbGluZVZlcnRpY2VzLnB1c2goIHBhcnRzWyAwIF0gKTtcclxuICAgICAgICAgICAgaWYgKCBwYXJ0c1sgMSBdICE9PSBcIlwiICkgbGluZVVWcy5wdXNoKCBwYXJ0c1sgMSBdICk7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgc3RhdGUuYWRkTGluZUdlb21ldHJ5KCBsaW5lVmVydGljZXMsIGxpbmVVVnMgKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoICggcmVzdWx0ID0gdGhpcy5yZWdleHAub2JqZWN0X3BhdHRlcm4uZXhlYyggbGluZSApICkgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgIC8vIG8gb2JqZWN0X25hbWVcclxuICAgICAgICAvLyBvclxyXG4gICAgICAgIC8vIGcgZ3JvdXBfbmFtZVxyXG5cclxuICAgICAgICB2YXIgbmFtZSA9IHJlc3VsdFsgMCBdLnN1YnN0ciggMSApLnRyaW0oKTtcclxuICAgICAgICBzdGF0ZS5zdGFydE9iamVjdCggbmFtZSApO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggdGhpcy5yZWdleHAubWF0ZXJpYWxfdXNlX3BhdHRlcm4udGVzdCggbGluZSApICkge1xyXG5cclxuICAgICAgICAvLyBtYXRlcmlhbFxyXG5cclxuICAgICAgICBzdGF0ZS5vYmplY3Quc3RhcnRNYXRlcmlhbCggbGluZS5zdWJzdHJpbmcoIDcgKS50cmltKCksIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCB0aGlzLnJlZ2V4cC5tYXRlcmlhbF9saWJyYXJ5X3BhdHRlcm4udGVzdCggbGluZSApICkge1xyXG5cclxuICAgICAgICAvLyBtdGwgZmlsZVxyXG5cclxuICAgICAgICBzdGF0ZS5tYXRlcmlhbExpYnJhcmllcy5wdXNoKCBsaW5lLnN1YnN0cmluZyggNyApLnRyaW0oKSApO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggKCByZXN1bHQgPSB0aGlzLnJlZ2V4cC5zbW9vdGhpbmdfcGF0dGVybi5leGVjKCBsaW5lICkgKSAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgLy8gc21vb3RoIHNoYWRpbmdcclxuXHJcbiAgICAgICAgLy8gQHRvZG8gSGFuZGxlIGZpbGVzIHRoYXQgaGF2ZSB2YXJ5aW5nIHNtb290aCB2YWx1ZXMgZm9yIGEgc2V0IG9mIGZhY2VzIGluc2lkZSBvbmUgZ2VvbWV0cnksXHJcbiAgICAgICAgLy8gYnV0IGRvZXMgbm90IGRlZmluZSBhIHVzZW10bCBmb3IgZWFjaCBmYWNlIHNldC5cclxuICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBkZXRlY3RlZCBhbmQgYSBkdW1teSBtYXRlcmlhbCBjcmVhdGVkIChsYXRlciBNdWx0aU1hdGVyaWFsIGFuZCBnZW9tZXRyeSBncm91cHMpLlxyXG4gICAgICAgIC8vIFRoaXMgcmVxdWlyZXMgc29tZSBjYXJlIHRvIG5vdCBjcmVhdGUgZXh0cmEgbWF0ZXJpYWwgb24gZWFjaCBzbW9vdGggdmFsdWUgZm9yIFwibm9ybWFsXCIgb2JqIGZpbGVzLlxyXG4gICAgICAgIC8vIHdoZXJlIGV4cGxpY2l0IHVzZW10bCBkZWZpbmVzIGdlb21ldHJ5IGdyb3Vwcy5cclxuICAgICAgICAvLyBFeGFtcGxlIGFzc2V0OiBleGFtcGxlcy9tb2RlbHMvb2JqL2NlcmJlcnVzL0NlcmJlcnVzLm9ialxyXG5cclxuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHRbIDEgXS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBzdGF0ZS5vYmplY3Quc21vb3RoID0gKCB2YWx1ZSA9PT0gJzEnIHx8IHZhbHVlID09PSAnb24nICk7XHJcblxyXG4gICAgICAgIHZhciBtYXRlcmlhbCA9IHN0YXRlLm9iamVjdC5jdXJyZW50TWF0ZXJpYWwoKTtcclxuICAgICAgICBpZiAoIG1hdGVyaWFsICkge1xyXG5cclxuICAgICAgICAgIG1hdGVyaWFsLnNtb290aCA9IHN0YXRlLm9iamVjdC5zbW9vdGg7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIEhhbmRsZSBudWxsIHRlcm1pbmF0ZWQgZmlsZXMgd2l0aG91dCBleGNlcHRpb25cclxuICAgICAgICBpZiAoIGxpbmUgPT09ICdcXDAnICkgY29udGludWU7XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvciggXCJVbmV4cGVjdGVkIGxpbmU6ICdcIiArIGxpbmUgICsgXCInXCIgKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGUuZmluYWxpemUoKTtcclxuXHJcbiAgICB2YXIgY29udGFpbmVyID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICBjb250YWluZXIubWF0ZXJpYWxMaWJyYXJpZXMgPSBbXS5jb25jYXQoIHN0YXRlLm1hdGVyaWFsTGlicmFyaWVzICk7XHJcblxyXG4gICAgZm9yICggdmFyIGkgPSAwLCBsID0gc3RhdGUub2JqZWN0cy5sZW5ndGg7IGkgPCBsOyBpICsrICkge1xyXG5cclxuICAgICAgdmFyIG9iamVjdCA9IHN0YXRlLm9iamVjdHNbIGkgXTtcclxuICAgICAgdmFyIGdlb21ldHJ5ID0gb2JqZWN0Lmdlb21ldHJ5O1xyXG4gICAgICB2YXIgbWF0ZXJpYWxzID0gb2JqZWN0Lm1hdGVyaWFscztcclxuICAgICAgdmFyIGlzTGluZSA9ICggZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmUnICk7XHJcblxyXG4gICAgICAvLyBTa2lwIG8vZyBsaW5lIGRlY2xhcmF0aW9ucyB0aGF0IGRpZCBub3QgZm9sbG93IHdpdGggYW55IGZhY2VzXHJcbiAgICAgIGlmICggZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoID09PSAwICkgY29udGludWU7XHJcblxyXG4gICAgICB2YXIgYnVmZmVyZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcclxuXHJcbiAgICAgIGJ1ZmZlcmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkudmVydGljZXMgKSwgMyApICk7XHJcblxyXG4gICAgICBpZiAoIGdlb21ldHJ5Lm5vcm1hbHMubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCAnbm9ybWFsJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZSggbmV3IEZsb2F0MzJBcnJheSggZ2VvbWV0cnkubm9ybWFscyApLCAzICkgKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIGJ1ZmZlcmdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIGdlb21ldHJ5LnV2cy5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoICd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoIG5ldyBGbG9hdDMyQXJyYXkoIGdlb21ldHJ5LnV2cyApLCAyICkgKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENyZWF0ZSBtYXRlcmlhbHNcclxuXHJcbiAgICAgIHZhciBjcmVhdGVkTWF0ZXJpYWxzID0gW107XHJcblxyXG4gICAgICBmb3IgKCB2YXIgbWkgPSAwLCBtaUxlbiA9IG1hdGVyaWFscy5sZW5ndGg7IG1pIDwgbWlMZW4gOyBtaSsrICkge1xyXG5cclxuICAgICAgICB2YXIgc291cmNlTWF0ZXJpYWwgPSBtYXRlcmlhbHNbbWldO1xyXG4gICAgICAgIHZhciBtYXRlcmlhbCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgaWYgKCB0aGlzLm1hdGVyaWFscyAhPT0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgICBtYXRlcmlhbCA9IHRoaXMubWF0ZXJpYWxzLmNyZWF0ZSggc291cmNlTWF0ZXJpYWwubmFtZSApO1xyXG5cclxuICAgICAgICAgIC8vIG10bCBldGMuIGxvYWRlcnMgcHJvYmFibHkgY2FuJ3QgY3JlYXRlIGxpbmUgbWF0ZXJpYWxzIGNvcnJlY3RseSwgY29weSBwcm9wZXJ0aWVzIHRvIGEgbGluZSBtYXRlcmlhbC5cclxuICAgICAgICAgIGlmICggaXNMaW5lICYmIG1hdGVyaWFsICYmICEgKCBtYXRlcmlhbCBpbnN0YW5jZW9mIFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsICkgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWxMaW5lID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgIG1hdGVyaWFsTGluZS5jb3B5KCBtYXRlcmlhbCApO1xyXG4gICAgICAgICAgICBtYXRlcmlhbCA9IG1hdGVyaWFsTGluZTtcclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCAhIG1hdGVyaWFsICkge1xyXG5cclxuICAgICAgICAgIG1hdGVyaWFsID0gKCAhIGlzTGluZSA/IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgpIDogbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCkgKTtcclxuICAgICAgICAgIG1hdGVyaWFsLm5hbWUgPSBzb3VyY2VNYXRlcmlhbC5uYW1lO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hdGVyaWFsLnNoYWRpbmcgPSBzb3VyY2VNYXRlcmlhbC5zbW9vdGggPyBUSFJFRS5TbW9vdGhTaGFkaW5nIDogVEhSRUUuRmxhdFNoYWRpbmc7XHJcblxyXG4gICAgICAgIGNyZWF0ZWRNYXRlcmlhbHMucHVzaChtYXRlcmlhbCk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDcmVhdGUgbWVzaFxyXG5cclxuICAgICAgdmFyIG1lc2g7XHJcblxyXG4gICAgICBpZiAoIGNyZWF0ZWRNYXRlcmlhbHMubGVuZ3RoID4gMSApIHtcclxuXHJcbiAgICAgICAgZm9yICggdmFyIG1pID0gMCwgbWlMZW4gPSBtYXRlcmlhbHMubGVuZ3RoOyBtaSA8IG1pTGVuIDsgbWkrKyApIHtcclxuXHJcbiAgICAgICAgICB2YXIgc291cmNlTWF0ZXJpYWwgPSBtYXRlcmlhbHNbbWldO1xyXG4gICAgICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkR3JvdXAoIHNvdXJjZU1hdGVyaWFsLmdyb3VwU3RhcnQsIHNvdXJjZU1hdGVyaWFsLmdyb3VwQ291bnQsIG1pICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG11bHRpTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTXVsdGlNYXRlcmlhbCggY3JlYXRlZE1hdGVyaWFscyApO1xyXG4gICAgICAgIG1lc2ggPSAoICEgaXNMaW5lID8gbmV3IFRIUkVFLk1lc2goIGJ1ZmZlcmdlb21ldHJ5LCBtdWx0aU1hdGVyaWFsICkgOiBuZXcgVEhSRUUuTGluZSggYnVmZmVyZ2VvbWV0cnksIG11bHRpTWF0ZXJpYWwgKSApO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgbWVzaCA9ICggISBpc0xpbmUgPyBuZXcgVEhSRUUuTWVzaCggYnVmZmVyZ2VvbWV0cnksIGNyZWF0ZWRNYXRlcmlhbHNbIDAgXSApIDogbmV3IFRIUkVFLkxpbmUoIGJ1ZmZlcmdlb21ldHJ5LCBjcmVhdGVkTWF0ZXJpYWxzWyAwIF0gKSApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBtZXNoLm5hbWUgPSBvYmplY3QubmFtZTtcclxuXHJcbiAgICAgIGNvbnRhaW5lci5hZGQoIG1lc2ggKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS50aW1lRW5kKCAnT0JKTG9hZGVyJyApO1xyXG5cclxuICAgIHJldHVybiBjb250YWluZXI7XHJcblxyXG4gIH1cclxuXHJcbn07IiwiVEhSRUUuVml2ZUNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoIGlkICkge1xyXG5cclxuICBUSFJFRS5PYmplY3QzRC5jYWxsKCB0aGlzICk7XHJcblxyXG4gIHRoaXMubWF0cml4QXV0b1VwZGF0ZSA9IGZhbHNlO1xyXG4gIHRoaXMuc3RhbmRpbmdNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xyXG5cclxuICB2YXIgc2NvcGUgPSB0aGlzO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB1cGRhdGUgKTtcclxuXHJcbiAgICB2YXIgZ2FtZXBhZCA9IG5hdmlnYXRvci5nZXRHYW1lcGFkcygpWyBpZCBdO1xyXG5cclxuICAgIGlmICggZ2FtZXBhZCAhPT0gdW5kZWZpbmVkICYmIGdhbWVwYWQucG9zZSAhPT0gbnVsbCAmJiBnYW1lcGFkLnBvc2UucG9zaXRpb24gIT09IG51bGwgKSB7XHJcblxyXG4gICAgICB2YXIgcG9zZSA9IGdhbWVwYWQucG9zZTtcclxuXHJcbiAgICAgIHNjb3BlLnBvc2l0aW9uLmZyb21BcnJheSggcG9zZS5wb3NpdGlvbiApO1xyXG4gICAgICBzY29wZS5xdWF0ZXJuaW9uLmZyb21BcnJheSggcG9zZS5vcmllbnRhdGlvbiApO1xyXG4gICAgICBzY29wZS5tYXRyaXguY29tcG9zZSggc2NvcGUucG9zaXRpb24sIHNjb3BlLnF1YXRlcm5pb24sIHNjb3BlLnNjYWxlICk7XHJcbiAgICAgIHNjb3BlLm1hdHJpeC5tdWx0aXBseU1hdHJpY2VzKCBzY29wZS5zdGFuZGluZ01hdHJpeCwgc2NvcGUubWF0cml4ICk7XHJcbiAgICAgIHNjb3BlLm1hdHJpeFdvcmxkTmVlZHNVcGRhdGUgPSB0cnVlO1xyXG5cclxuICAgICAgc2NvcGUudmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIHNjb3BlLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk7XHJcblxyXG59O1xyXG5cclxuVEhSRUUuVml2ZUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVEhSRUUuT2JqZWN0M0QucHJvdG90eXBlICk7XHJcblRIUkVFLlZpdmVDb250cm9sbGVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRIUkVFLlZpdmVDb250cm9sbGVyOyIsIi8qKlxuICogQGF1dGhvciBkbWFyY29zIC8gaHR0cHM6Ly9naXRodWIuY29tL2RtYXJjb3NcbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb21cbiAqL1xuXG5USFJFRS5WUkNvbnRyb2xzID0gZnVuY3Rpb24gKCBvYmplY3QsIG9uRXJyb3IgKSB7XG5cblx0dmFyIHNjb3BlID0gdGhpcztcblxuXHR2YXIgdnJEaXNwbGF5LCB2ckRpc3BsYXlzO1xuXG5cdHZhciBzdGFuZGluZ01hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XG5cblx0ZnVuY3Rpb24gZ290VlJEaXNwbGF5cyggZGlzcGxheXMgKSB7XG5cblx0XHR2ckRpc3BsYXlzID0gZGlzcGxheXM7XG5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBkaXNwbGF5cy5sZW5ndGg7IGkgKysgKSB7XG5cblx0XHRcdGlmICggKCAnVlJEaXNwbGF5JyBpbiB3aW5kb3cgJiYgZGlzcGxheXNbIGkgXSBpbnN0YW5jZW9mIFZSRGlzcGxheSApIHx8XG5cdFx0XHRcdCAoICdQb3NpdGlvblNlbnNvclZSRGV2aWNlJyBpbiB3aW5kb3cgJiYgZGlzcGxheXNbIGkgXSBpbnN0YW5jZW9mIFBvc2l0aW9uU2Vuc29yVlJEZXZpY2UgKSApIHtcblxuXHRcdFx0XHR2ckRpc3BsYXkgPSBkaXNwbGF5c1sgaSBdO1xuXHRcdFx0XHRicmVhazsgIC8vIFdlIGtlZXAgdGhlIGZpcnN0IHdlIGVuY291bnRlclxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZiAoIHZyRGlzcGxheSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRpZiAoIG9uRXJyb3IgKSBvbkVycm9yKCAnVlIgaW5wdXQgbm90IGF2YWlsYWJsZS4nICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGlmICggbmF2aWdhdG9yLmdldFZSRGlzcGxheXMgKSB7XG5cblx0XHRuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cygpLnRoZW4oIGdvdFZSRGlzcGxheXMgKTtcblxuXHR9IGVsc2UgaWYgKCBuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzICkge1xuXG5cdFx0Ly8gRGVwcmVjYXRlZCBBUEkuXG5cdFx0bmF2aWdhdG9yLmdldFZSRGV2aWNlcygpLnRoZW4oIGdvdFZSRGlzcGxheXMgKTtcblxuXHR9XG5cblx0Ly8gdGhlIFJpZnQgU0RLIHJldHVybnMgdGhlIHBvc2l0aW9uIGluIG1ldGVyc1xuXHQvLyB0aGlzIHNjYWxlIGZhY3RvciBhbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIGhvdyBtZXRlcnNcblx0Ly8gYXJlIGNvbnZlcnRlZCB0byBzY2VuZSB1bml0cy5cblxuXHR0aGlzLnNjYWxlID0gMTtcblxuXHQvLyBJZiB0cnVlIHdpbGwgdXNlIFwic3RhbmRpbmcgc3BhY2VcIiBjb29yZGluYXRlIHN5c3RlbSB3aGVyZSB5PTAgaXMgdGhlXG5cdC8vIGZsb29yIGFuZCB4PTAsIHo9MCBpcyB0aGUgY2VudGVyIG9mIHRoZSByb29tLlxuXHR0aGlzLnN0YW5kaW5nID0gZmFsc2U7XG5cblx0Ly8gRGlzdGFuY2UgZnJvbSB0aGUgdXNlcnMgZXllcyB0byB0aGUgZmxvb3IgaW4gbWV0ZXJzLiBVc2VkIHdoZW5cblx0Ly8gc3RhbmRpbmc9dHJ1ZSBidXQgdGhlIFZSRGlzcGxheSBkb2Vzbid0IHByb3ZpZGUgc3RhZ2VQYXJhbWV0ZXJzLlxuXHR0aGlzLnVzZXJIZWlnaHQgPSAxLjY7XG5cblx0dGhpcy5nZXRWUkRpc3BsYXkgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdnJEaXNwbGF5O1xuXG5cdH07XG5cblx0dGhpcy5nZXRWUkRpc3BsYXlzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHZyRGlzcGxheXM7XG5cblx0fTtcblxuXHR0aGlzLmdldFN0YW5kaW5nTWF0cml4ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHN0YW5kaW5nTWF0cml4O1xuXG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIHZyRGlzcGxheSApIHtcblxuXHRcdFx0aWYgKCB2ckRpc3BsYXkuZ2V0UG9zZSApIHtcblxuXHRcdFx0XHR2YXIgcG9zZSA9IHZyRGlzcGxheS5nZXRQb3NlKCk7XG5cblx0XHRcdFx0aWYgKCBwb3NlLm9yaWVudGF0aW9uICE9PSBudWxsICkge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnF1YXRlcm5pb24uZnJvbUFycmF5KCBwb3NlLm9yaWVudGF0aW9uICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcG9zZS5wb3NpdGlvbiAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdG9iamVjdC5wb3NpdGlvbi5mcm9tQXJyYXkoIHBvc2UucG9zaXRpb24gKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnBvc2l0aW9uLnNldCggMCwgMCwgMCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBEZXByZWNhdGVkIEFQSS5cblx0XHRcdFx0dmFyIHN0YXRlID0gdnJEaXNwbGF5LmdldFN0YXRlKCk7XG5cblx0XHRcdFx0aWYgKCBzdGF0ZS5vcmllbnRhdGlvbiAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdG9iamVjdC5xdWF0ZXJuaW9uLmNvcHkoIHN0YXRlLm9yaWVudGF0aW9uICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggc3RhdGUucG9zaXRpb24gIT09IG51bGwgKSB7XG5cblx0XHRcdFx0XHRvYmplY3QucG9zaXRpb24uY29weSggc3RhdGUucG9zaXRpb24gKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnBvc2l0aW9uLnNldCggMCwgMCwgMCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHRoaXMuc3RhbmRpbmcgKSB7XG5cblx0XHRcdFx0aWYgKCB2ckRpc3BsYXkuc3RhZ2VQYXJhbWV0ZXJzICkge1xuXG5cdFx0XHRcdFx0b2JqZWN0LnVwZGF0ZU1hdHJpeCgpO1xuXG5cdFx0XHRcdFx0c3RhbmRpbmdNYXRyaXguZnJvbUFycmF5KCB2ckRpc3BsYXkuc3RhZ2VQYXJhbWV0ZXJzLnNpdHRpbmdUb1N0YW5kaW5nVHJhbnNmb3JtICk7XG5cdFx0XHRcdFx0b2JqZWN0LmFwcGx5TWF0cml4KCBzdGFuZGluZ01hdHJpeCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRvYmplY3QucG9zaXRpb24uc2V0WSggb2JqZWN0LnBvc2l0aW9uLnkgKyB0aGlzLnVzZXJIZWlnaHQgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0b2JqZWN0LnBvc2l0aW9uLm11bHRpcGx5U2NhbGFyKCBzY29wZS5zY2FsZSApO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5yZXNldFBvc2UgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIHZyRGlzcGxheSApIHtcblxuXHRcdFx0aWYgKCB2ckRpc3BsYXkucmVzZXRQb3NlICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0dnJEaXNwbGF5LnJlc2V0UG9zZSgpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCB2ckRpc3BsYXkucmVzZXRTZW5zb3IgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHQvLyBEZXByZWNhdGVkIEFQSS5cblx0XHRcdFx0dnJEaXNwbGF5LnJlc2V0U2Vuc29yKCk7XG5cblx0XHRcdH0gZWxzZSBpZiAoIHZyRGlzcGxheS56ZXJvU2Vuc29yICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0Ly8gUmVhbGx5IGRlcHJlY2F0ZWQgQVBJLlxuXHRcdFx0XHR2ckRpc3BsYXkuemVyb1NlbnNvcigpO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLnJlc2V0U2Vuc29yID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0Y29uc29sZS53YXJuKCAnVEhSRUUuVlJDb250cm9sczogLnJlc2V0U2Vuc29yKCkgaXMgbm93IC5yZXNldFBvc2UoKS4nICk7XG5cdFx0dGhpcy5yZXNldFBvc2UoKTtcblxuXHR9O1xuXG5cdHRoaXMuemVyb1NlbnNvciA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGNvbnNvbGUud2FybiggJ1RIUkVFLlZSQ29udHJvbHM6IC56ZXJvU2Vuc29yKCkgaXMgbm93IC5yZXNldFBvc2UoKS4nICk7XG5cdFx0dGhpcy5yZXNldFBvc2UoKTtcblxuXHR9O1xuXG5cdHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHZyRGlzcGxheSA9IG51bGw7XG5cblx0fTtcblxufTtcbiIsIi8qKlxuICogQGF1dGhvciBkbWFyY29zIC8gaHR0cHM6Ly9naXRodWIuY29tL2RtYXJjb3NcbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb21cbiAqXG4gKiBXZWJWUiBTcGVjOiBodHRwOi8vbW96dnIuZ2l0aHViLmlvL3dlYnZyLXNwZWMvd2VidnIuaHRtbFxuICpcbiAqIEZpcmVmb3g6IGh0dHA6Ly9tb3p2ci5jb20vZG93bmxvYWRzL1xuICogQ2hyb21pdW06IGh0dHBzOi8vZHJpdmUuZ29vZ2xlLmNvbS9mb2xkZXJ2aWV3P2lkPTBCenVkTHQyMkJxR1JiVzlXVEhNdE9XTXpOalEmdXNwPXNoYXJpbmcjbGlzdFxuICpcbiAqL1xuXG5USFJFRS5WUkVmZmVjdCA9IGZ1bmN0aW9uICggcmVuZGVyZXIsIG9uRXJyb3IgKSB7XG5cblx0dmFyIGlzV2ViVlIxID0gdHJ1ZTtcblxuXHR2YXIgdnJEaXNwbGF5LCB2ckRpc3BsYXlzO1xuXHR2YXIgZXllVHJhbnNsYXRpb25MID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblx0dmFyIGV5ZVRyYW5zbGF0aW9uUiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cdHZhciByZW5kZXJSZWN0TCwgcmVuZGVyUmVjdFI7XG5cdHZhciBleWVGT1ZMLCBleWVGT1ZSO1xuXG5cdGZ1bmN0aW9uIGdvdFZSRGlzcGxheXMoIGRpc3BsYXlzICkge1xuXG5cdFx0dnJEaXNwbGF5cyA9IGRpc3BsYXlzO1xuXG5cdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgZGlzcGxheXMubGVuZ3RoOyBpICsrICkge1xuXG5cdFx0XHRpZiAoICdWUkRpc3BsYXknIGluIHdpbmRvdyAmJiBkaXNwbGF5c1sgaSBdIGluc3RhbmNlb2YgVlJEaXNwbGF5ICkge1xuXG5cdFx0XHRcdHZyRGlzcGxheSA9IGRpc3BsYXlzWyBpIF07XG5cdFx0XHRcdGlzV2ViVlIxID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7IC8vIFdlIGtlZXAgdGhlIGZpcnN0IHdlIGVuY291bnRlclxuXG5cdFx0XHR9IGVsc2UgaWYgKCAnSE1EVlJEZXZpY2UnIGluIHdpbmRvdyAmJiBkaXNwbGF5c1sgaSBdIGluc3RhbmNlb2YgSE1EVlJEZXZpY2UgKSB7XG5cblx0XHRcdFx0dnJEaXNwbGF5ID0gZGlzcGxheXNbIGkgXTtcblx0XHRcdFx0aXNXZWJWUjEgPSBmYWxzZTtcblx0XHRcdFx0YnJlYWs7IC8vIFdlIGtlZXAgdGhlIGZpcnN0IHdlIGVuY291bnRlclxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZiAoIHZyRGlzcGxheSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRpZiAoIG9uRXJyb3IgKSBvbkVycm9yKCAnSE1EIG5vdCBhdmFpbGFibGUnICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGlmICggbmF2aWdhdG9yLmdldFZSRGlzcGxheXMgKSB7XG5cblx0XHRuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cygpLnRoZW4oIGdvdFZSRGlzcGxheXMgKTtcblxuXHR9IGVsc2UgaWYgKCBuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzICkge1xuXG5cdFx0Ly8gRGVwcmVjYXRlZCBBUEkuXG5cdFx0bmF2aWdhdG9yLmdldFZSRGV2aWNlcygpLnRoZW4oIGdvdFZSRGlzcGxheXMgKTtcblxuXHR9XG5cblx0Ly9cblxuXHR0aGlzLmlzUHJlc2VudGluZyA9IGZhbHNlO1xuXHR0aGlzLnNjYWxlID0gMTtcblxuXHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdHZhciByZW5kZXJlclNpemUgPSByZW5kZXJlci5nZXRTaXplKCk7XG5cdHZhciByZW5kZXJlclBpeGVsUmF0aW8gPSByZW5kZXJlci5nZXRQaXhlbFJhdGlvKCk7XG5cblx0dGhpcy5nZXRWUkRpc3BsYXkgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gdnJEaXNwbGF5O1xuXG5cdH07XG5cblx0dGhpcy5nZXRWUkRpc3BsYXlzID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHZyRGlzcGxheXM7XG5cblx0fTtcblxuXHR0aGlzLnNldFNpemUgPSBmdW5jdGlvbiAoIHdpZHRoLCBoZWlnaHQgKSB7XG5cblx0XHRyZW5kZXJlclNpemUgPSB7IHdpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHQgfTtcblxuXHRcdGlmICggc2NvcGUuaXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHR2YXIgZXllUGFyYW1zTCA9IHZyRGlzcGxheS5nZXRFeWVQYXJhbWV0ZXJzKCAnbGVmdCcgKTtcblx0XHRcdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8oIDEgKTtcblxuXHRcdFx0aWYgKCBpc1dlYlZSMSApIHtcblxuXHRcdFx0XHRyZW5kZXJlci5zZXRTaXplKCBleWVQYXJhbXNMLnJlbmRlcldpZHRoICogMiwgZXllUGFyYW1zTC5yZW5kZXJIZWlnaHQsIGZhbHNlICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0cmVuZGVyZXIuc2V0U2l6ZSggZXllUGFyYW1zTC5yZW5kZXJSZWN0LndpZHRoICogMiwgZXllUGFyYW1zTC5yZW5kZXJSZWN0LmhlaWdodCwgZmFsc2UgKTtcblxuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0cmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyggcmVuZGVyZXJQaXhlbFJhdGlvICk7XG5cdFx0XHRyZW5kZXJlci5zZXRTaXplKCB3aWR0aCwgaGVpZ2h0ICk7XG5cblx0XHR9XG5cblx0fTtcblxuXHQvLyBmdWxsc2NyZWVuXG5cblx0dmFyIGNhbnZhcyA9IHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG5cdHZhciByZXF1ZXN0RnVsbHNjcmVlbjtcblx0dmFyIGV4aXRGdWxsc2NyZWVuO1xuXHR2YXIgZnVsbHNjcmVlbkVsZW1lbnQ7XG5cdHZhciBsZWZ0Qm91bmRzID0gWyAwLjAsIDAuMCwgMC41LCAxLjAgXTtcblx0dmFyIHJpZ2h0Qm91bmRzID0gWyAwLjUsIDAuMCwgMC41LCAxLjAgXTtcblxuXHRmdW5jdGlvbiBvbkZ1bGxzY3JlZW5DaGFuZ2UgKCkge1xuXG5cdFx0dmFyIHdhc1ByZXNlbnRpbmcgPSBzY29wZS5pc1ByZXNlbnRpbmc7XG5cdFx0c2NvcGUuaXNQcmVzZW50aW5nID0gdnJEaXNwbGF5ICE9PSB1bmRlZmluZWQgJiYgKCB2ckRpc3BsYXkuaXNQcmVzZW50aW5nIHx8ICggISBpc1dlYlZSMSAmJiBkb2N1bWVudFsgZnVsbHNjcmVlbkVsZW1lbnQgXSBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MRWxlbWVudCApICk7XG5cblx0XHRpZiAoIHNjb3BlLmlzUHJlc2VudGluZyApIHtcblxuXHRcdFx0dmFyIGV5ZVBhcmFtc0wgPSB2ckRpc3BsYXkuZ2V0RXllUGFyYW1ldGVycyggJ2xlZnQnICk7XG5cdFx0XHR2YXIgZXllV2lkdGgsIGV5ZUhlaWdodDtcblxuXHRcdFx0aWYgKCBpc1dlYlZSMSApIHtcblxuXHRcdFx0XHRleWVXaWR0aCA9IGV5ZVBhcmFtc0wucmVuZGVyV2lkdGg7XG5cdFx0XHRcdGV5ZUhlaWdodCA9IGV5ZVBhcmFtc0wucmVuZGVySGVpZ2h0O1xuXG5cdFx0XHRcdGlmICggdnJEaXNwbGF5LmdldExheWVycyApIHtcblxuXHRcdFx0XHRcdHZhciBsYXllcnMgPSB2ckRpc3BsYXkuZ2V0TGF5ZXJzKCk7XG5cdFx0XHRcdFx0aWYgKGxheWVycy5sZW5ndGgpIHtcblxuXHRcdFx0XHRcdFx0bGVmdEJvdW5kcyA9IGxheWVyc1swXS5sZWZ0Qm91bmRzIHx8IFsgMC4wLCAwLjAsIDAuNSwgMS4wIF07XG5cdFx0XHRcdFx0XHRyaWdodEJvdW5kcyA9IGxheWVyc1swXS5yaWdodEJvdW5kcyB8fCBbIDAuNSwgMC4wLCAwLjUsIDEuMCBdO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0ZXllV2lkdGggPSBleWVQYXJhbXNMLnJlbmRlclJlY3Qud2lkdGg7XG5cdFx0XHRcdGV5ZUhlaWdodCA9IGV5ZVBhcmFtc0wucmVuZGVyUmVjdC5oZWlnaHQ7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhd2FzUHJlc2VudGluZyApIHtcblxuXHRcdFx0XHRyZW5kZXJlclBpeGVsUmF0aW8gPSByZW5kZXJlci5nZXRQaXhlbFJhdGlvKCk7XG5cdFx0XHRcdHJlbmRlcmVyU2l6ZSA9IHJlbmRlcmVyLmdldFNpemUoKTtcblxuXHRcdFx0XHRyZW5kZXJlci5zZXRQaXhlbFJhdGlvKCAxICk7XG5cdFx0XHRcdHJlbmRlcmVyLnNldFNpemUoIGV5ZVdpZHRoICogMiwgZXllSGVpZ2h0LCBmYWxzZSApO1xuXG5cdFx0XHR9XG5cblx0XHR9IGVsc2UgaWYgKCB3YXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHRyZW5kZXJlci5zZXRQaXhlbFJhdGlvKCByZW5kZXJlclBpeGVsUmF0aW8gKTtcblx0XHRcdHJlbmRlcmVyLnNldFNpemUoIHJlbmRlcmVyU2l6ZS53aWR0aCwgcmVuZGVyZXJTaXplLmhlaWdodCApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRpZiAoIGNhbnZhcy5yZXF1ZXN0RnVsbHNjcmVlbiApIHtcblxuXHRcdHJlcXVlc3RGdWxsc2NyZWVuID0gJ3JlcXVlc3RGdWxsc2NyZWVuJztcblx0XHRmdWxsc2NyZWVuRWxlbWVudCA9ICdmdWxsc2NyZWVuRWxlbWVudCc7XG5cdFx0ZXhpdEZ1bGxzY3JlZW4gPSAnZXhpdEZ1bGxzY3JlZW4nO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdmdWxsc2NyZWVuY2hhbmdlJywgb25GdWxsc2NyZWVuQ2hhbmdlLCBmYWxzZSApO1xuXG5cdH0gZWxzZSBpZiAoIGNhbnZhcy5tb3pSZXF1ZXN0RnVsbFNjcmVlbiApIHtcblxuXHRcdHJlcXVlc3RGdWxsc2NyZWVuID0gJ21velJlcXVlc3RGdWxsU2NyZWVuJztcblx0XHRmdWxsc2NyZWVuRWxlbWVudCA9ICdtb3pGdWxsU2NyZWVuRWxlbWVudCc7XG5cdFx0ZXhpdEZ1bGxzY3JlZW4gPSAnbW96Q2FuY2VsRnVsbFNjcmVlbic7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vemZ1bGxzY3JlZW5jaGFuZ2UnLCBvbkZ1bGxzY3JlZW5DaGFuZ2UsIGZhbHNlICk7XG5cblx0fSBlbHNlIHtcblxuXHRcdHJlcXVlc3RGdWxsc2NyZWVuID0gJ3dlYmtpdFJlcXVlc3RGdWxsc2NyZWVuJztcblx0XHRmdWxsc2NyZWVuRWxlbWVudCA9ICd3ZWJraXRGdWxsc2NyZWVuRWxlbWVudCc7XG5cdFx0ZXhpdEZ1bGxzY3JlZW4gPSAnd2Via2l0RXhpdEZ1bGxzY3JlZW4nO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJywgb25GdWxsc2NyZWVuQ2hhbmdlLCBmYWxzZSApO1xuXG5cdH1cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3ZyZGlzcGxheXByZXNlbnRjaGFuZ2UnLCBvbkZ1bGxzY3JlZW5DaGFuZ2UsIGZhbHNlICk7XG5cblx0dGhpcy5zZXRGdWxsU2NyZWVuID0gZnVuY3Rpb24gKCBib29sZWFuICkge1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKCBmdW5jdGlvbiAoIHJlc29sdmUsIHJlamVjdCApIHtcblxuXHRcdFx0aWYgKCB2ckRpc3BsYXkgPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHRyZWplY3QoIG5ldyBFcnJvciggJ05vIFZSIGhhcmR3YXJlIGZvdW5kLicgKSApO1xuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBzY29wZS5pc1ByZXNlbnRpbmcgPT09IGJvb2xlYW4gKSB7XG5cblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBpc1dlYlZSMSApIHtcblxuXHRcdFx0XHRpZiAoIGJvb2xlYW4gKSB7XG5cblx0XHRcdFx0XHRyZXNvbHZlKCB2ckRpc3BsYXkucmVxdWVzdFByZXNlbnQoIFsgeyBzb3VyY2U6IGNhbnZhcyB9IF0gKSApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRyZXNvbHZlKCB2ckRpc3BsYXkuZXhpdFByZXNlbnQoKSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiAoIGNhbnZhc1sgcmVxdWVzdEZ1bGxzY3JlZW4gXSApIHtcblxuXHRcdFx0XHRcdGNhbnZhc1sgYm9vbGVhbiA/IHJlcXVlc3RGdWxsc2NyZWVuIDogZXhpdEZ1bGxzY3JlZW4gXSggeyB2ckRpc3BsYXk6IHZyRGlzcGxheSB9ICk7XG5cdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCAnTm8gY29tcGF0aWJsZSByZXF1ZXN0RnVsbHNjcmVlbiBtZXRob2QgZm91bmQuJyApO1xuXHRcdFx0XHRcdHJlamVjdCggbmV3IEVycm9yKCAnTm8gY29tcGF0aWJsZSByZXF1ZXN0RnVsbHNjcmVlbiBtZXRob2QgZm91bmQuJyApICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cblx0fTtcblxuXHR0aGlzLnJlcXVlc3RQcmVzZW50ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuc2V0RnVsbFNjcmVlbiggdHJ1ZSApO1xuXG5cdH07XG5cblx0dGhpcy5leGl0UHJlc2VudCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiB0aGlzLnNldEZ1bGxTY3JlZW4oIGZhbHNlICk7XG5cblx0fTtcblxuXHR0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uICggZiApIHtcblxuXHRcdGlmICggaXNXZWJWUjEgJiYgdnJEaXNwbGF5ICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdHJldHVybiB2ckRpc3BsYXkucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBmICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRyZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggZiApO1xuXG5cdFx0fVxuXG5cdH07XG5cdFxuXHR0aGlzLmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKCBoICkge1xuXG5cdFx0aWYgKCBpc1dlYlZSMSAmJiB2ckRpc3BsYXkgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0dnJEaXNwbGF5LmNhbmNlbEFuaW1hdGlvbkZyYW1lKCBoICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoIGggKTtcblxuXHRcdH1cblxuXHR9O1xuXHRcblx0dGhpcy5zdWJtaXRGcmFtZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICggaXNXZWJWUjEgJiYgdnJEaXNwbGF5ICE9PSB1bmRlZmluZWQgJiYgc2NvcGUuaXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHR2ckRpc3BsYXkuc3VibWl0RnJhbWUoKTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMuYXV0b1N1Ym1pdEZyYW1lID0gdHJ1ZTtcblxuXHQvLyByZW5kZXJcblxuXHR2YXIgY2FtZXJhTCA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSgpO1xuXHRjYW1lcmFMLmxheWVycy5lbmFibGUoIDEgKTtcblxuXHR2YXIgY2FtZXJhUiA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSgpO1xuXHRjYW1lcmFSLmxheWVycy5lbmFibGUoIDIgKTtcblxuXHR0aGlzLnJlbmRlciA9IGZ1bmN0aW9uICggc2NlbmUsIGNhbWVyYSwgcmVuZGVyVGFyZ2V0LCBmb3JjZUNsZWFyICkge1xuXG5cdFx0aWYgKCB2ckRpc3BsYXkgJiYgc2NvcGUuaXNQcmVzZW50aW5nICkge1xuXG5cdFx0XHR2YXIgYXV0b1VwZGF0ZSA9IHNjZW5lLmF1dG9VcGRhdGU7XG5cblx0XHRcdGlmICggYXV0b1VwZGF0ZSApIHtcblxuXHRcdFx0XHRzY2VuZS51cGRhdGVNYXRyaXhXb3JsZCgpO1xuXHRcdFx0XHRzY2VuZS5hdXRvVXBkYXRlID0gZmFsc2U7XG5cblx0XHRcdH1cblxuXHRcdFx0dmFyIGV5ZVBhcmFtc0wgPSB2ckRpc3BsYXkuZ2V0RXllUGFyYW1ldGVycyggJ2xlZnQnICk7XG5cdFx0XHR2YXIgZXllUGFyYW1zUiA9IHZyRGlzcGxheS5nZXRFeWVQYXJhbWV0ZXJzKCAncmlnaHQnICk7XG5cblx0XHRcdGlmICggaXNXZWJWUjEgKSB7XG5cblx0XHRcdFx0ZXllVHJhbnNsYXRpb25MLmZyb21BcnJheSggZXllUGFyYW1zTC5vZmZzZXQgKTtcblx0XHRcdFx0ZXllVHJhbnNsYXRpb25SLmZyb21BcnJheSggZXllUGFyYW1zUi5vZmZzZXQgKTtcblx0XHRcdFx0ZXllRk9WTCA9IGV5ZVBhcmFtc0wuZmllbGRPZlZpZXc7XG5cdFx0XHRcdGV5ZUZPVlIgPSBleWVQYXJhbXNSLmZpZWxkT2ZWaWV3O1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGV5ZVRyYW5zbGF0aW9uTC5jb3B5KCBleWVQYXJhbXNMLmV5ZVRyYW5zbGF0aW9uICk7XG5cdFx0XHRcdGV5ZVRyYW5zbGF0aW9uUi5jb3B5KCBleWVQYXJhbXNSLmV5ZVRyYW5zbGF0aW9uICk7XG5cdFx0XHRcdGV5ZUZPVkwgPSBleWVQYXJhbXNMLnJlY29tbWVuZGVkRmllbGRPZlZpZXc7XG5cdFx0XHRcdGV5ZUZPVlIgPSBleWVQYXJhbXNSLnJlY29tbWVuZGVkRmllbGRPZlZpZXc7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBBcnJheS5pc0FycmF5KCBzY2VuZSApICkge1xuXG5cdFx0XHRcdGNvbnNvbGUud2FybiggJ1RIUkVFLlZSRWZmZWN0LnJlbmRlcigpIG5vIGxvbmdlciBzdXBwb3J0cyBhcnJheXMuIFVzZSBvYmplY3QubGF5ZXJzIGluc3RlYWQuJyApO1xuXHRcdFx0XHRzY2VuZSA9IHNjZW5lWyAwIF07XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gV2hlbiByZW5kZXJpbmcgd2UgZG9uJ3QgY2FyZSB3aGF0IHRoZSByZWNvbW1lbmRlZCBzaXplIGlzLCBvbmx5IHdoYXQgdGhlIGFjdHVhbCBzaXplXG5cdFx0XHQvLyBvZiB0aGUgYmFja2J1ZmZlciBpcy5cblx0XHRcdHZhciBzaXplID0gcmVuZGVyZXIuZ2V0U2l6ZSgpO1xuXHRcdFx0cmVuZGVyUmVjdEwgPSB7XG5cdFx0XHRcdHg6IE1hdGgucm91bmQoIHNpemUud2lkdGggKiBsZWZ0Qm91bmRzWyAwIF0gKSxcblx0XHRcdFx0eTogTWF0aC5yb3VuZCggc2l6ZS5oZWlnaHQgKiBsZWZ0Qm91bmRzWyAxIF0gKSxcblx0XHRcdFx0d2lkdGg6IE1hdGgucm91bmQoIHNpemUud2lkdGggKiBsZWZ0Qm91bmRzWyAyIF0gKSxcblx0XHRcdFx0aGVpZ2h0OiAgTWF0aC5yb3VuZChzaXplLmhlaWdodCAqIGxlZnRCb3VuZHNbIDMgXSApXG5cdFx0XHR9O1xuXHRcdFx0cmVuZGVyUmVjdFIgPSB7XG5cdFx0XHRcdHg6IE1hdGgucm91bmQoIHNpemUud2lkdGggKiByaWdodEJvdW5kc1sgMCBdICksXG5cdFx0XHRcdHk6IE1hdGgucm91bmQoIHNpemUuaGVpZ2h0ICogcmlnaHRCb3VuZHNbIDEgXSApLFxuXHRcdFx0XHR3aWR0aDogTWF0aC5yb3VuZCggc2l6ZS53aWR0aCAqIHJpZ2h0Qm91bmRzWyAyIF0gKSxcblx0XHRcdFx0aGVpZ2h0OiAgTWF0aC5yb3VuZChzaXplLmhlaWdodCAqIHJpZ2h0Qm91bmRzWyAzIF0gKVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHJlbmRlclRhcmdldCkge1xuXHRcdFx0XHRcblx0XHRcdFx0cmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KHJlbmRlclRhcmdldCk7XG5cdFx0XHRcdHJlbmRlclRhcmdldC5zY2lzc29yVGVzdCA9IHRydWU7XG5cdFx0XHRcdFxuXHRcdFx0fSBlbHNlICB7XG5cdFx0XHRcdFxuXHRcdFx0XHRyZW5kZXJlci5zZXRTY2lzc29yVGVzdCggdHJ1ZSApO1xuXHRcdFx0XG5cdFx0XHR9XG5cblx0XHRcdGlmICggcmVuZGVyZXIuYXV0b0NsZWFyIHx8IGZvcmNlQ2xlYXIgKSByZW5kZXJlci5jbGVhcigpO1xuXG5cdFx0XHRpZiAoIGNhbWVyYS5wYXJlbnQgPT09IG51bGwgKSBjYW1lcmEudXBkYXRlTWF0cml4V29ybGQoKTtcblxuXHRcdFx0Y2FtZXJhTC5wcm9qZWN0aW9uTWF0cml4ID0gZm92VG9Qcm9qZWN0aW9uKCBleWVGT1ZMLCB0cnVlLCBjYW1lcmEubmVhciwgY2FtZXJhLmZhciApO1xuXHRcdFx0Y2FtZXJhUi5wcm9qZWN0aW9uTWF0cml4ID0gZm92VG9Qcm9qZWN0aW9uKCBleWVGT1ZSLCB0cnVlLCBjYW1lcmEubmVhciwgY2FtZXJhLmZhciApO1xuXG5cdFx0XHRjYW1lcmEubWF0cml4V29ybGQuZGVjb21wb3NlKCBjYW1lcmFMLnBvc2l0aW9uLCBjYW1lcmFMLnF1YXRlcm5pb24sIGNhbWVyYUwuc2NhbGUgKTtcblx0XHRcdGNhbWVyYS5tYXRyaXhXb3JsZC5kZWNvbXBvc2UoIGNhbWVyYVIucG9zaXRpb24sIGNhbWVyYVIucXVhdGVybmlvbiwgY2FtZXJhUi5zY2FsZSApO1xuXG5cdFx0XHR2YXIgc2NhbGUgPSB0aGlzLnNjYWxlO1xuXHRcdFx0Y2FtZXJhTC50cmFuc2xhdGVPbkF4aXMoIGV5ZVRyYW5zbGF0aW9uTCwgc2NhbGUgKTtcblx0XHRcdGNhbWVyYVIudHJhbnNsYXRlT25BeGlzKCBleWVUcmFuc2xhdGlvblIsIHNjYWxlICk7XG5cblxuXHRcdFx0Ly8gcmVuZGVyIGxlZnQgZXllXG5cdFx0XHRpZiAoIHJlbmRlclRhcmdldCApIHtcblxuXHRcdFx0XHRyZW5kZXJUYXJnZXQudmlld3BvcnQuc2V0KHJlbmRlclJlY3RMLngsIHJlbmRlclJlY3RMLnksIHJlbmRlclJlY3RMLndpZHRoLCByZW5kZXJSZWN0TC5oZWlnaHQpO1xuXHRcdFx0XHRyZW5kZXJUYXJnZXQuc2Npc3Nvci5zZXQocmVuZGVyUmVjdEwueCwgcmVuZGVyUmVjdEwueSwgcmVuZGVyUmVjdEwud2lkdGgsIHJlbmRlclJlY3RMLmhlaWdodCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0cmVuZGVyZXIuc2V0Vmlld3BvcnQoIHJlbmRlclJlY3RMLngsIHJlbmRlclJlY3RMLnksIHJlbmRlclJlY3RMLndpZHRoLCByZW5kZXJSZWN0TC5oZWlnaHQgKTtcblx0XHRcdFx0cmVuZGVyZXIuc2V0U2Npc3NvciggcmVuZGVyUmVjdEwueCwgcmVuZGVyUmVjdEwueSwgcmVuZGVyUmVjdEwud2lkdGgsIHJlbmRlclJlY3RMLmhlaWdodCApO1xuXG5cdFx0XHR9XG5cdFx0XHRyZW5kZXJlci5yZW5kZXIoIHNjZW5lLCBjYW1lcmFMLCByZW5kZXJUYXJnZXQsIGZvcmNlQ2xlYXIgKTtcblxuXHRcdFx0Ly8gcmVuZGVyIHJpZ2h0IGV5ZVxuXHRcdFx0aWYgKHJlbmRlclRhcmdldCkge1xuXG5cdFx0XHRcdHJlbmRlclRhcmdldC52aWV3cG9ydC5zZXQocmVuZGVyUmVjdFIueCwgcmVuZGVyUmVjdFIueSwgcmVuZGVyUmVjdFIud2lkdGgsIHJlbmRlclJlY3RSLmhlaWdodCk7XG4gIFx0XHRcdFx0cmVuZGVyVGFyZ2V0LnNjaXNzb3Iuc2V0KHJlbmRlclJlY3RSLngsIHJlbmRlclJlY3RSLnksIHJlbmRlclJlY3RSLndpZHRoLCByZW5kZXJSZWN0Ui5oZWlnaHQpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHJlbmRlcmVyLnNldFZpZXdwb3J0KCByZW5kZXJSZWN0Ui54LCByZW5kZXJSZWN0Ui55LCByZW5kZXJSZWN0Ui53aWR0aCwgcmVuZGVyUmVjdFIuaGVpZ2h0ICk7XG5cdFx0XHRcdHJlbmRlcmVyLnNldFNjaXNzb3IoIHJlbmRlclJlY3RSLngsIHJlbmRlclJlY3RSLnksIHJlbmRlclJlY3RSLndpZHRoLCByZW5kZXJSZWN0Ui5oZWlnaHQgKTtcblxuXHRcdFx0fVxuXHRcdFx0cmVuZGVyZXIucmVuZGVyKCBzY2VuZSwgY2FtZXJhUiwgcmVuZGVyVGFyZ2V0LCBmb3JjZUNsZWFyICk7XG5cblx0XHRcdGlmIChyZW5kZXJUYXJnZXQpIHtcblxuXHRcdFx0XHRyZW5kZXJUYXJnZXQudmlld3BvcnQuc2V0KCAwLCAwLCBzaXplLndpZHRoLCBzaXplLmhlaWdodCApO1xuXHRcdFx0XHRyZW5kZXJUYXJnZXQuc2Npc3Nvci5zZXQoIDAsIDAsIHNpemUud2lkdGgsIHNpemUuaGVpZ2h0ICk7XG5cdFx0XHRcdHJlbmRlclRhcmdldC5zY2lzc29yVGVzdCA9IGZhbHNlO1xuXHRcdFx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQoIG51bGwgKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XG5cdFx0XHRcdHJlbmRlcmVyLnNldFNjaXNzb3JUZXN0KCBmYWxzZSApO1xuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmICggYXV0b1VwZGF0ZSApIHtcblxuXHRcdFx0XHRzY2VuZS5hdXRvVXBkYXRlID0gdHJ1ZTtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHNjb3BlLmF1dG9TdWJtaXRGcmFtZSApIHtcblxuXHRcdFx0XHRzY29wZS5zdWJtaXRGcmFtZSgpO1xuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybjtcblxuXHRcdH1cblxuXHRcdC8vIFJlZ3VsYXIgcmVuZGVyIG1vZGUgaWYgbm90IEhNRFxuXG5cdFx0cmVuZGVyZXIucmVuZGVyKCBzY2VuZSwgY2FtZXJhLCByZW5kZXJUYXJnZXQsIGZvcmNlQ2xlYXIgKTtcblxuXHR9O1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gZm92VG9ORENTY2FsZU9mZnNldCggZm92ICkge1xuXG5cdFx0dmFyIHB4c2NhbGUgPSAyLjAgLyAoIGZvdi5sZWZ0VGFuICsgZm92LnJpZ2h0VGFuICk7XG5cdFx0dmFyIHB4b2Zmc2V0ID0gKCBmb3YubGVmdFRhbiAtIGZvdi5yaWdodFRhbiApICogcHhzY2FsZSAqIDAuNTtcblx0XHR2YXIgcHlzY2FsZSA9IDIuMCAvICggZm92LnVwVGFuICsgZm92LmRvd25UYW4gKTtcblx0XHR2YXIgcHlvZmZzZXQgPSAoIGZvdi51cFRhbiAtIGZvdi5kb3duVGFuICkgKiBweXNjYWxlICogMC41O1xuXHRcdHJldHVybiB7IHNjYWxlOiBbIHB4c2NhbGUsIHB5c2NhbGUgXSwgb2Zmc2V0OiBbIHB4b2Zmc2V0LCBweW9mZnNldCBdIH07XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGZvdlBvcnRUb1Byb2plY3Rpb24oIGZvdiwgcmlnaHRIYW5kZWQsIHpOZWFyLCB6RmFyICkge1xuXG5cdFx0cmlnaHRIYW5kZWQgPSByaWdodEhhbmRlZCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHJpZ2h0SGFuZGVkO1xuXHRcdHpOZWFyID0gek5lYXIgPT09IHVuZGVmaW5lZCA/IDAuMDEgOiB6TmVhcjtcblx0XHR6RmFyID0gekZhciA9PT0gdW5kZWZpbmVkID8gMTAwMDAuMCA6IHpGYXI7XG5cblx0XHR2YXIgaGFuZGVkbmVzc1NjYWxlID0gcmlnaHRIYW5kZWQgPyAtIDEuMCA6IDEuMDtcblxuXHRcdC8vIHN0YXJ0IHdpdGggYW4gaWRlbnRpdHkgbWF0cml4XG5cdFx0dmFyIG1vYmogPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuXHRcdHZhciBtID0gbW9iai5lbGVtZW50cztcblxuXHRcdC8vIGFuZCB3aXRoIHNjYWxlL29mZnNldCBpbmZvIGZvciBub3JtYWxpemVkIGRldmljZSBjb29yZHNcblx0XHR2YXIgc2NhbGVBbmRPZmZzZXQgPSBmb3ZUb05EQ1NjYWxlT2Zmc2V0KCBmb3YgKTtcblxuXHRcdC8vIFggcmVzdWx0LCBtYXAgY2xpcCBlZGdlcyB0byBbLXcsK3ddXG5cdFx0bVsgMCAqIDQgKyAwIF0gPSBzY2FsZUFuZE9mZnNldC5zY2FsZVsgMCBdO1xuXHRcdG1bIDAgKiA0ICsgMSBdID0gMC4wO1xuXHRcdG1bIDAgKiA0ICsgMiBdID0gc2NhbGVBbmRPZmZzZXQub2Zmc2V0WyAwIF0gKiBoYW5kZWRuZXNzU2NhbGU7XG5cdFx0bVsgMCAqIDQgKyAzIF0gPSAwLjA7XG5cblx0XHQvLyBZIHJlc3VsdCwgbWFwIGNsaXAgZWRnZXMgdG8gWy13LCt3XVxuXHRcdC8vIFkgb2Zmc2V0IGlzIG5lZ2F0ZWQgYmVjYXVzZSB0aGlzIHByb2ogbWF0cml4IHRyYW5zZm9ybXMgZnJvbSB3b3JsZCBjb29yZHMgd2l0aCBZPXVwLFxuXHRcdC8vIGJ1dCB0aGUgTkRDIHNjYWxpbmcgaGFzIFk9ZG93biAodGhhbmtzIEQzRD8pXG5cdFx0bVsgMSAqIDQgKyAwIF0gPSAwLjA7XG5cdFx0bVsgMSAqIDQgKyAxIF0gPSBzY2FsZUFuZE9mZnNldC5zY2FsZVsgMSBdO1xuXHRcdG1bIDEgKiA0ICsgMiBdID0gLSBzY2FsZUFuZE9mZnNldC5vZmZzZXRbIDEgXSAqIGhhbmRlZG5lc3NTY2FsZTtcblx0XHRtWyAxICogNCArIDMgXSA9IDAuMDtcblxuXHRcdC8vIFogcmVzdWx0ICh1cCB0byB0aGUgYXBwKVxuXHRcdG1bIDIgKiA0ICsgMCBdID0gMC4wO1xuXHRcdG1bIDIgKiA0ICsgMSBdID0gMC4wO1xuXHRcdG1bIDIgKiA0ICsgMiBdID0gekZhciAvICggek5lYXIgLSB6RmFyICkgKiAtIGhhbmRlZG5lc3NTY2FsZTtcblx0XHRtWyAyICogNCArIDMgXSA9ICggekZhciAqIHpOZWFyICkgLyAoIHpOZWFyIC0gekZhciApO1xuXG5cdFx0Ly8gVyByZXN1bHQgKD0gWiBpbilcblx0XHRtWyAzICogNCArIDAgXSA9IDAuMDtcblx0XHRtWyAzICogNCArIDEgXSA9IDAuMDtcblx0XHRtWyAzICogNCArIDIgXSA9IGhhbmRlZG5lc3NTY2FsZTtcblx0XHRtWyAzICogNCArIDMgXSA9IDAuMDtcblxuXHRcdG1vYmoudHJhbnNwb3NlKCk7XG5cblx0XHRyZXR1cm4gbW9iajtcblxuXHR9XG5cblx0ZnVuY3Rpb24gZm92VG9Qcm9qZWN0aW9uKCBmb3YsIHJpZ2h0SGFuZGVkLCB6TmVhciwgekZhciApIHtcblxuXHRcdHZhciBERUcyUkFEID0gTWF0aC5QSSAvIDE4MC4wO1xuXG5cdFx0dmFyIGZvdlBvcnQgPSB7XG5cdFx0XHR1cFRhbjogTWF0aC50YW4oIGZvdi51cERlZ3JlZXMgKiBERUcyUkFEICksXG5cdFx0XHRkb3duVGFuOiBNYXRoLnRhbiggZm92LmRvd25EZWdyZWVzICogREVHMlJBRCApLFxuXHRcdFx0bGVmdFRhbjogTWF0aC50YW4oIGZvdi5sZWZ0RGVncmVlcyAqIERFRzJSQUQgKSxcblx0XHRcdHJpZ2h0VGFuOiBNYXRoLnRhbiggZm92LnJpZ2h0RGVncmVlcyAqIERFRzJSQUQgKVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZm92UG9ydFRvUHJvamVjdGlvbiggZm92UG9ydCwgcmlnaHRIYW5kZWQsIHpOZWFyLCB6RmFyICk7XG5cblx0fVxuXG59O1xuIiwiLyoqXHJcbiogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbVxyXG4qIEJhc2VkIG9uIEB0b2ppcm8ncyB2ci1zYW1wbGVzLXV0aWxzLmpzXHJcbiovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNMYXRlc3RBdmFpbGFibGUoKSB7XHJcblxyXG4gIHJldHVybiBuYXZpZ2F0b3IuZ2V0VlJEaXNwbGF5cyAhPT0gdW5kZWZpbmVkO1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXZhaWxhYmxlKCkge1xyXG5cclxuICByZXR1cm4gbmF2aWdhdG9yLmdldFZSRGlzcGxheXMgIT09IHVuZGVmaW5lZCB8fCBuYXZpZ2F0b3IuZ2V0VlJEZXZpY2VzICE9PSB1bmRlZmluZWQ7XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVzc2FnZSgpIHtcclxuXHJcbiAgdmFyIG1lc3NhZ2U7XHJcblxyXG4gIGlmICggbmF2aWdhdG9yLmdldFZSRGlzcGxheXMgKSB7XHJcblxyXG4gICAgbmF2aWdhdG9yLmdldFZSRGlzcGxheXMoKS50aGVuKCBmdW5jdGlvbiAoIGRpc3BsYXlzICkge1xyXG5cclxuICAgICAgaWYgKCBkaXNwbGF5cy5sZW5ndGggPT09IDAgKSBtZXNzYWdlID0gJ1dlYlZSIHN1cHBvcnRlZCwgYnV0IG5vIFZSRGlzcGxheXMgZm91bmQuJztcclxuXHJcbiAgICB9ICk7XHJcblxyXG4gIH0gZWxzZSBpZiAoIG5hdmlnYXRvci5nZXRWUkRldmljZXMgKSB7XHJcblxyXG4gICAgbWVzc2FnZSA9ICdZb3VyIGJyb3dzZXIgc3VwcG9ydHMgV2ViVlIgYnV0IG5vdCB0aGUgbGF0ZXN0IHZlcnNpb24uIFNlZSA8YSBocmVmPVwiaHR0cDovL3dlYnZyLmluZm9cIj53ZWJ2ci5pbmZvPC9hPiBmb3IgbW9yZSBpbmZvLic7XHJcblxyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgbWVzc2FnZSA9ICdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBXZWJWUi4gU2VlIDxhIGhyZWY9XCJodHRwOi8vd2VidnIuaW5mb1wiPndlYnZyLmluZm88L2E+IGZvciBhc3Npc3RhbmNlLic7XHJcblxyXG4gIH1cclxuXHJcbiAgaWYgKCBtZXNzYWdlICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XHJcbiAgICBjb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSAnMCc7XHJcbiAgICBjb250YWluZXIuc3R5bGUudG9wID0gJzAnO1xyXG4gICAgY29udGFpbmVyLnN0eWxlLnJpZ2h0ID0gJzAnO1xyXG4gICAgY29udGFpbmVyLnN0eWxlLnpJbmRleCA9ICc5OTknO1xyXG4gICAgY29udGFpbmVyLmFsaWduID0gJ2NlbnRlcic7XHJcblxyXG4gICAgdmFyIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcclxuICAgIGVycm9yLnN0eWxlLmZvbnRGYW1pbHkgPSAnc2Fucy1zZXJpZic7XHJcbiAgICBlcnJvci5zdHlsZS5mb250U2l6ZSA9ICcxNnB4JztcclxuICAgIGVycm9yLnN0eWxlLmZvbnRTdHlsZSA9ICdub3JtYWwnO1xyXG4gICAgZXJyb3Iuc3R5bGUubGluZUhlaWdodCA9ICcyNnB4JztcclxuICAgIGVycm9yLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZmZmJztcclxuICAgIGVycm9yLnN0eWxlLmNvbG9yID0gJyMwMDAnO1xyXG4gICAgZXJyb3Iuc3R5bGUucGFkZGluZyA9ICcxMHB4IDIwcHgnO1xyXG4gICAgZXJyb3Iuc3R5bGUubWFyZ2luID0gJzUwcHgnO1xyXG4gICAgZXJyb3Iuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xyXG4gICAgZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCggZXJyb3IgKTtcclxuXHJcbiAgICByZXR1cm4gY29udGFpbmVyO1xyXG5cclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnV0dG9uKCBlZmZlY3QgKSB7XHJcblxyXG4gIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnYnV0dG9uJyApO1xyXG4gIGJ1dHRvbi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgYnV0dG9uLnN0eWxlLmxlZnQgPSAnY2FsYyg1MCUgLSA1MHB4KSc7XHJcbiAgYnV0dG9uLnN0eWxlLmJvdHRvbSA9ICcyMHB4JztcclxuICBidXR0b24uc3R5bGUud2lkdGggPSAnMTAwcHgnO1xyXG4gIGJ1dHRvbi5zdHlsZS5ib3JkZXIgPSAnMCc7XHJcbiAgYnV0dG9uLnN0eWxlLnBhZGRpbmcgPSAnOHB4JztcclxuICBidXR0b24uc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG4gIGJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzAwMCc7XHJcbiAgYnV0dG9uLnN0eWxlLmNvbG9yID0gJyNmZmYnO1xyXG4gIGJ1dHRvbi5zdHlsZS5mb250RmFtaWx5ID0gJ3NhbnMtc2VyaWYnO1xyXG4gIGJ1dHRvbi5zdHlsZS5mb250U2l6ZSA9ICcxM3B4JztcclxuICBidXR0b24uc3R5bGUuZm9udFN0eWxlID0gJ25vcm1hbCc7XHJcbiAgYnV0dG9uLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gIGJ1dHRvbi5zdHlsZS56SW5kZXggPSAnOTk5JztcclxuICBidXR0b24udGV4dENvbnRlbnQgPSAnRU5URVIgVlInO1xyXG4gIGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgZWZmZWN0LmlzUHJlc2VudGluZyA/IGVmZmVjdC5leGl0UHJlc2VudCgpIDogZWZmZWN0LnJlcXVlc3RQcmVzZW50KCk7XHJcblxyXG4gIH07XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAndnJkaXNwbGF5cHJlc2VudGNoYW5nZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XHJcblxyXG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gZWZmZWN0LmlzUHJlc2VudGluZyA/ICdFWElUIFZSJyA6ICdFTlRFUiBWUic7XHJcblxyXG4gIH0sIGZhbHNlICk7XHJcblxyXG4gIHJldHVybiBidXR0b247XHJcblxyXG59XHJcblxyXG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuXG4ndXNlIHN0cmljdCdcblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuLypcbiAqIEV4cG9ydCBrTWF4TGVuZ3RoIGFmdGVyIHR5cGVkIGFycmF5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZC5cbiAqL1xuZXhwb3J0cy5rTWF4TGVuZ3RoID0ga01heExlbmd0aCgpXG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgICBhcnIuX19wcm90b19fID0ge19fcHJvdG9fXzogVWludDhBcnJheS5wcm90b3R5cGUsIGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfX1cbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MiAmJiAvLyB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZFxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nICYmIC8vIGNocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICAgICAgICBhcnIuc3ViYXJyYXkoMSwgMSkuYnl0ZUxlbmd0aCA9PT0gMCAvLyBpZTEwIGhhcyBicm9rZW4gYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24ga01heExlbmd0aCAoKSB7XG4gIHJldHVybiBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVFxuICAgID8gMHg3ZmZmZmZmZlxuICAgIDogMHgzZmZmZmZmZlxufVxuXG5mdW5jdGlvbiBjcmVhdGVCdWZmZXIgKHRoYXQsIGxlbmd0aCkge1xuICBpZiAoa01heExlbmd0aCgpIDwgbGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdHlwZWQgYXJyYXkgbGVuZ3RoJylcbiAgfVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICBpZiAodGhhdCA9PT0gbnVsbCkge1xuICAgICAgdGhhdCA9IG5ldyBCdWZmZXIobGVuZ3RoKVxuICAgIH1cbiAgICB0aGF0Lmxlbmd0aCA9IGxlbmd0aFxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUodGhpcywgYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKHRoaXMsIGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuLy8gVE9ETzogTGVnYWN5LCBub3QgbmVlZGVkIGFueW1vcmUuIFJlbW92ZSBpbiBuZXh0IG1ham9yIHZlcnNpb24uXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gZnJvbSAodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoYXQsIHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKG51bGwsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gICAgLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgICAgdmFsdWU6IG51bGwsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFsbG9jICh0aGF0LCBzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIGlmIChzaXplIDw9IDApIHtcbiAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpXG4gIH1cbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9ubHkgcGF5IGF0dGVudGlvbiB0byBlbmNvZGluZyBpZiBpdCdzIGEgc3RyaW5nLiBUaGlzXG4gICAgLy8gcHJldmVudHMgYWNjaWRlbnRhbGx5IHNlbmRpbmcgaW4gYSBudW1iZXIgdGhhdCB3b3VsZFxuICAgIC8vIGJlIGludGVycHJldHRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhudWxsLCBzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHRoYXQsIHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyArK2kpIHtcbiAgICAgIHRoYXRbaV0gPSAwXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogRXF1aXZhbGVudCB0byBCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqICovXG5CdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUobnVsbCwgc2l6ZSlcbn1cbi8qKlxuICogRXF1aXZhbGVudCB0byBTbG93QnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUobnVsbCwgc2l6ZSlcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAodGhhdCwgc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICB9XG5cbiAgaWYgKCFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImVuY29kaW5nXCIgbXVzdCBiZSBhIHZhbGlkIHN0cmluZyBlbmNvZGluZycpXG4gIH1cblxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG5cbiAgdmFyIGFjdHVhbCA9IHRoYXQud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcblxuICBpZiAoYWN0dWFsICE9PSBsZW5ndGgpIHtcbiAgICAvLyBXcml0aW5nIGEgaGV4IHN0cmluZywgZm9yIGV4YW1wbGUsIHRoYXQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzIHdpbGxcbiAgICAvLyBjYXVzZSBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdCBpbnZhbGlkIGNoYXJhY3RlciB0byBiZSBpZ25vcmVkLiAoZS5nLlxuICAgIC8vICdhYnh4Y2QnIHdpbGwgYmUgdHJlYXRlZCBhcyAnYWInKVxuICAgIHRoYXQgPSB0aGF0LnNsaWNlKDAsIGFjdHVhbClcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKHRoYXQsIGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGFycmF5LmJ5dGVMZW5ndGggLy8gdGhpcyB0aHJvd3MgaWYgYGFycmF5YCBpcyBub3QgYSB2YWxpZCBBcnJheUJ1ZmZlclxuXG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuKVxuXG4gICAgaWYgKHRoYXQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhhdFxuICAgIH1cblxuICAgIG9iai5jb3B5KHRoYXQsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gdGhhdFxuICB9XG5cbiAgaWYgKG9iaikge1xuICAgIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICBvYmouYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHx8ICdsZW5ndGgnIGluIG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBpc25hbihvYmoubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIDApXG4gICAgICB9XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmopXG4gICAgfVxuXG4gICAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBpc0FycmF5KG9iai5kYXRhKSkge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqLmRhdGEpXG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksIG9yIGFycmF5LWxpa2Ugb2JqZWN0LicpXG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBrTWF4TGVuZ3RoYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBzdHJpbmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2Vyc2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGUgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCBhbmQgYGlzLWJ1ZmZlcmAgKGluIFNhZmFyaSA1LTcpIHRvIGRldGVjdFxuLy8gQnVmZmVyIGluc3RhbmNlcy5cbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIHZhciBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKGlzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiZcbiAgICAgICAgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgdmFyIGluZGV4U2l6ZSA9IDFcbiAgdmFyIGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgdmFyIHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGRpcikge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gbGF0aW4xV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggfCAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgLy8gbGVnYWN5IHdyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKSAtIHJlbW92ZSBpbiB2MC4xM1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gICAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyArK2kpIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBCdWZmZXIuaXNCdWZmZXIodmFsKVxuICAgICAgPyB2YWxcbiAgICAgIDogdXRmOFRvQnl0ZXMobmV3IEJ1ZmZlcih2YWwsIGVuY29kaW5nKS50b1N0cmluZygpKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXitcXC8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHJpbmd0cmltKHN0cikucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG5mdW5jdGlvbiBpbml0ICgpIHtcbiAgdmFyIGNvZGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gICAgcmV2TG9va3VwW2NvZGUuY2hhckNvZGVBdChpKV0gPSBpXG4gIH1cblxuICByZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbiAgcmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXG59XG5cbmluaXQoKVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG4gIC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcbiAgLy8gcmVwcmVzZW50IG9uZSBieXRlXG4gIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuICAvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG4gIHBsYWNlSG9sZGVycyA9IGI2NFtsZW4gLSAyXSA9PT0gJz0nID8gMiA6IGI2NFtsZW4gLSAxXSA9PT0gJz0nID8gMSA6IDBcblxuICAvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbiAgYXJyID0gbmV3IEFycihsZW4gKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gbGVuIC0gNCA6IGxlblxuXG4gIHZhciBMID0gMFxuXG4gIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHwgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA+PiA0KVxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA+PiAyKVxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcbiAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICsgbG9va3VwW251bSAmIDB4M0ZdXG59XG5cbmZ1bmN0aW9uIGVuY29kZUNodW5rICh1aW50OCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdG1wXG4gIHZhciBvdXRwdXQgPSBbXVxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xuICAgIHRtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIG91dHB1dCA9ICcnXG4gIHZhciBwYXJ0cyA9IFtdXG4gIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzIC8vIG11c3QgYmUgbXVsdGlwbGUgb2YgM1xuXG4gIC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKSkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAyXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9ICc9PSdcbiAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgKHVpbnQ4W2xlbiAtIDFdKVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDEwXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz0nXG4gIH1cblxuICBwYXJ0cy5wdXNoKG91dHB1dClcblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsImV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJ2YXIgeGhyID0gcmVxdWlyZSgneGhyJylcbnZhciBub29wID0gZnVuY3Rpb24oKXt9XG52YXIgcGFyc2VBU0NJSSA9IHJlcXVpcmUoJ3BhcnNlLWJtZm9udC1hc2NpaScpXG52YXIgcGFyc2VYTUwgPSByZXF1aXJlKCdwYXJzZS1ibWZvbnQteG1sJylcbnZhciByZWFkQmluYXJ5ID0gcmVxdWlyZSgncGFyc2UtYm1mb250LWJpbmFyeScpXG52YXIgaXNCaW5hcnlGb3JtYXQgPSByZXF1aXJlKCcuL2xpYi9pcy1iaW5hcnknKVxudmFyIHh0ZW5kID0gcmVxdWlyZSgneHRlbmQnKVxuXG52YXIgeG1sMiA9IChmdW5jdGlvbiBoYXNYTUwyKCkge1xuICByZXR1cm4gd2luZG93LlhNTEh0dHBSZXF1ZXN0ICYmIFwid2l0aENyZWRlbnRpYWxzXCIgaW4gbmV3IFhNTEh0dHBSZXF1ZXN0XG59KSgpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0LCBjYikge1xuICBjYiA9IHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJyA/IGNiIDogbm9vcFxuXG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJylcbiAgICBvcHQgPSB7IHVyaTogb3B0IH1cbiAgZWxzZSBpZiAoIW9wdClcbiAgICBvcHQgPSB7fVxuXG4gIHZhciBleHBlY3RCaW5hcnkgPSBvcHQuYmluYXJ5XG4gIGlmIChleHBlY3RCaW5hcnkpXG4gICAgb3B0ID0gZ2V0QmluYXJ5T3B0cyhvcHQpXG5cbiAgeGhyKG9wdCwgZnVuY3Rpb24oZXJyLCByZXMsIGJvZHkpIHtcbiAgICBpZiAoZXJyKVxuICAgICAgcmV0dXJuIGNiKGVycilcbiAgICBpZiAoIS9eMi8udGVzdChyZXMuc3RhdHVzQ29kZSkpXG4gICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdodHRwIHN0YXR1cyBjb2RlOiAnK3Jlcy5zdGF0dXNDb2RlKSlcbiAgICBpZiAoIWJvZHkpXG4gICAgICByZXR1cm4gY2IobmV3IEVycm9yKCdubyBib2R5IHJlc3VsdCcpKVxuXG4gICAgdmFyIGJpbmFyeSA9IGZhbHNlIFxuXG4gICAgLy9pZiB0aGUgcmVzcG9uc2UgdHlwZSBpcyBhbiBhcnJheSBidWZmZXIsXG4gICAgLy93ZSBuZWVkIHRvIGNvbnZlcnQgaXQgaW50byBhIHJlZ3VsYXIgQnVmZmVyIG9iamVjdFxuICAgIGlmIChpc0FycmF5QnVmZmVyKGJvZHkpKSB7XG4gICAgICB2YXIgYXJyYXkgPSBuZXcgVWludDhBcnJheShib2R5KVxuICAgICAgYm9keSA9IG5ldyBCdWZmZXIoYXJyYXksICdiaW5hcnknKVxuICAgIH1cblxuICAgIC8vbm93IGNoZWNrIHRoZSBzdHJpbmcvQnVmZmVyIHJlc3BvbnNlXG4gICAgLy9hbmQgc2VlIGlmIGl0IGhhcyBhIGJpbmFyeSBCTUYgaGVhZGVyXG4gICAgaWYgKGlzQmluYXJ5Rm9ybWF0KGJvZHkpKSB7XG4gICAgICBiaW5hcnkgPSB0cnVlXG4gICAgICAvL2lmIHdlIGhhdmUgYSBzdHJpbmcsIHR1cm4gaXQgaW50byBhIEJ1ZmZlclxuICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykgXG4gICAgICAgIGJvZHkgPSBuZXcgQnVmZmVyKGJvZHksICdiaW5hcnknKVxuICAgIH0gXG5cbiAgICAvL3dlIGFyZSBub3QgcGFyc2luZyBhIGJpbmFyeSBmb3JtYXQsIGp1c3QgQVNDSUkvWE1ML2V0Y1xuICAgIGlmICghYmluYXJ5KSB7XG4gICAgICAvL21pZ2h0IHN0aWxsIGJlIGEgYnVmZmVyIGlmIHJlc3BvbnNlVHlwZSBpcyAnYXJyYXlidWZmZXInXG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKGJvZHkpKVxuICAgICAgICBib2R5ID0gYm9keS50b1N0cmluZyhvcHQuZW5jb2RpbmcpXG4gICAgICBib2R5ID0gYm9keS50cmltKClcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0XG4gICAgdHJ5IHtcbiAgICAgIHZhciB0eXBlID0gcmVzLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddXG4gICAgICBpZiAoYmluYXJ5KVxuICAgICAgICByZXN1bHQgPSByZWFkQmluYXJ5KGJvZHkpXG4gICAgICBlbHNlIGlmICgvanNvbi8udGVzdCh0eXBlKSB8fCBib2R5LmNoYXJBdCgwKSA9PT0gJ3snKVxuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKGJvZHkpXG4gICAgICBlbHNlIGlmICgveG1sLy50ZXN0KHR5cGUpICB8fCBib2R5LmNoYXJBdCgwKSA9PT0gJzwnKVxuICAgICAgICByZXN1bHQgPSBwYXJzZVhNTChib2R5KVxuICAgICAgZWxzZVxuICAgICAgICByZXN1bHQgPSBwYXJzZUFTQ0lJKGJvZHkpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY2IobmV3IEVycm9yKCdlcnJvciBwYXJzaW5nIGZvbnQgJytlLm1lc3NhZ2UpKVxuICAgICAgY2IgPSBub29wXG4gICAgfVxuICAgIGNiKG51bGwsIHJlc3VsdClcbiAgfSlcbn1cblxuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcihhcnIpIHtcbiAgdmFyIHN0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbiAgcmV0dXJuIHN0ci5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSdcbn1cblxuZnVuY3Rpb24gZ2V0QmluYXJ5T3B0cyhvcHQpIHtcbiAgLy9JRTEwKyBhbmQgb3RoZXIgbW9kZXJuIGJyb3dzZXJzIHN1cHBvcnQgYXJyYXkgYnVmZmVyc1xuICBpZiAoeG1sMilcbiAgICByZXR1cm4geHRlbmQob3B0LCB7IHJlc3BvbnNlVHlwZTogJ2FycmF5YnVmZmVyJyB9KVxuICBcbiAgaWYgKHR5cGVvZiB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPT09ICd1bmRlZmluZWQnKVxuICAgIHRocm93IG5ldyBFcnJvcigneW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgWEhSIGxvYWRpbmcnKVxuXG4gIC8vSUU5IGFuZCBYTUwxIGJyb3dzZXJzIGNvdWxkIHN0aWxsIHVzZSBhbiBvdmVycmlkZVxuICB2YXIgcmVxID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpXG4gIHJlcS5vdmVycmlkZU1pbWVUeXBlKCd0ZXh0L3BsYWluOyBjaGFyc2V0PXgtdXNlci1kZWZpbmVkJylcbiAgcmV0dXJuIHh0ZW5kKHtcbiAgICB4aHI6IHJlcVxuICB9LCBvcHQpXG59IiwidmFyIGVxdWFsID0gcmVxdWlyZSgnYnVmZmVyLWVxdWFsJylcbnZhciBIRUFERVIgPSBuZXcgQnVmZmVyKFs2NiwgNzcsIDcwLCAzXSlcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihidWYpIHtcbiAgaWYgKHR5cGVvZiBidWYgPT09ICdzdHJpbmcnKVxuICAgIHJldHVybiBidWYuc3Vic3RyaW5nKDAsIDMpID09PSAnQk1GJ1xuICByZXR1cm4gYnVmLmxlbmd0aCA+IDQgJiYgZXF1YWwoYnVmLnNsaWNlKDAsIDQpLCBIRUFERVIpXG59IiwidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjsgLy8gZm9yIHVzZSB3aXRoIGJyb3dzZXJpZnlcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlb2YgYS5lcXVhbHMgPT09ICdmdW5jdGlvbicpIHJldHVybiBhLmVxdWFscyhiKTtcbiAgICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhW2ldICE9PSBiW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0cnVlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VCTUZvbnRBc2NpaShkYXRhKSB7XG4gIGlmICghZGF0YSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGRhdGEgcHJvdmlkZWQnKVxuICBkYXRhID0gZGF0YS50b1N0cmluZygpLnRyaW0oKVxuXG4gIHZhciBvdXRwdXQgPSB7XG4gICAgcGFnZXM6IFtdLFxuICAgIGNoYXJzOiBbXSxcbiAgICBrZXJuaW5nczogW11cbiAgfVxuXG4gIHZhciBsaW5lcyA9IGRhdGEuc3BsaXQoL1xcclxcbj98XFxuL2cpXG5cbiAgaWYgKGxpbmVzLmxlbmd0aCA9PT0gMClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGRhdGEgaW4gQk1Gb250IGZpbGUnKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbGluZURhdGEgPSBzcGxpdExpbmUobGluZXNbaV0sIGkpXG4gICAgaWYgKCFsaW5lRGF0YSkgLy9za2lwIGVtcHR5IGxpbmVzXG4gICAgICBjb250aW51ZVxuXG4gICAgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ3BhZ2UnKSB7XG4gICAgICBpZiAodHlwZW9mIGxpbmVEYXRhLmRhdGEuaWQgIT09ICdudW1iZXInKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbGZvcm1lZCBmaWxlIGF0IGxpbmUgJyArIGkgKyAnIC0tIG5lZWRzIHBhZ2UgaWQ9TicpXG4gICAgICBpZiAodHlwZW9mIGxpbmVEYXRhLmRhdGEuZmlsZSAhPT0gJ3N0cmluZycpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWFsZm9ybWVkIGZpbGUgYXQgbGluZSAnICsgaSArICcgLS0gbmVlZHMgcGFnZSBmaWxlPVwicGF0aFwiJylcbiAgICAgIG91dHB1dC5wYWdlc1tsaW5lRGF0YS5kYXRhLmlkXSA9IGxpbmVEYXRhLmRhdGEuZmlsZVxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAnY2hhcnMnIHx8IGxpbmVEYXRhLmtleSA9PT0gJ2tlcm5pbmdzJykge1xuICAgICAgLy8uLi4gZG8gbm90aGluZyBmb3IgdGhlc2UgdHdvIC4uLlxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAnY2hhcicpIHtcbiAgICAgIG91dHB1dC5jaGFycy5wdXNoKGxpbmVEYXRhLmRhdGEpXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdrZXJuaW5nJykge1xuICAgICAgb3V0cHV0Lmtlcm5pbmdzLnB1c2gobGluZURhdGEuZGF0YSlcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0W2xpbmVEYXRhLmtleV0gPSBsaW5lRGF0YS5kYXRhXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dHB1dFxufVxuXG5mdW5jdGlvbiBzcGxpdExpbmUobGluZSwgaWR4KSB7XG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UoL1xcdCsvZywgJyAnKS50cmltKClcbiAgaWYgKCFsaW5lKVxuICAgIHJldHVybiBudWxsXG5cbiAgdmFyIHNwYWNlID0gbGluZS5pbmRleE9mKCcgJylcbiAgaWYgKHNwYWNlID09PSAtMSkgXG4gICAgdGhyb3cgbmV3IEVycm9yKFwibm8gbmFtZWQgcm93IGF0IGxpbmUgXCIgKyBpZHgpXG5cbiAgdmFyIGtleSA9IGxpbmUuc3Vic3RyaW5nKDAsIHNwYWNlKVxuXG4gIGxpbmUgPSBsaW5lLnN1YnN0cmluZyhzcGFjZSArIDEpXG4gIC8vY2xlYXIgXCJsZXR0ZXJcIiBmaWVsZCBhcyBpdCBpcyBub24tc3RhbmRhcmQgYW5kXG4gIC8vcmVxdWlyZXMgYWRkaXRpb25hbCBjb21wbGV4aXR5IHRvIHBhcnNlIFwiIC8gPSBzeW1ib2xzXG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UoL2xldHRlcj1bXFwnXFxcIl1cXFMrW1xcJ1xcXCJdL2dpLCAnJykgIFxuICBsaW5lID0gbGluZS5zcGxpdChcIj1cIilcbiAgbGluZSA9IGxpbmUubWFwKGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIudHJpbSgpLm1hdGNoKCgvKFwiLio/XCJ8W15cIlxcc10rKSsoPz1cXHMqfFxccyokKS9nKSlcbiAgfSlcblxuICB2YXIgZGF0YSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkdCA9IGxpbmVbaV1cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAga2V5OiBkdFswXSxcbiAgICAgICAgZGF0YTogXCJcIlxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGkgPT09IGxpbmUubGVuZ3RoIC0gMSkge1xuICAgICAgZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGEgPSBwYXJzZURhdGEoZHRbMF0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRhID0gcGFyc2VEYXRhKGR0WzBdKVxuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAga2V5OiBkdFsxXSxcbiAgICAgICAgZGF0YTogXCJcIlxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0ID0ge1xuICAgIGtleToga2V5LFxuICAgIGRhdGE6IHt9XG4gIH1cblxuICBkYXRhLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgIG91dC5kYXRhW3Yua2V5XSA9IHYuZGF0YTtcbiAgfSlcblxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGF0YShkYXRhKSB7XG4gIGlmICghZGF0YSB8fCBkYXRhLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gXCJcIlxuXG4gIGlmIChkYXRhLmluZGV4T2YoJ1wiJykgPT09IDAgfHwgZGF0YS5pbmRleE9mKFwiJ1wiKSA9PT0gMClcbiAgICByZXR1cm4gZGF0YS5zdWJzdHJpbmcoMSwgZGF0YS5sZW5ndGggLSAxKVxuICBpZiAoZGF0YS5pbmRleE9mKCcsJykgIT09IC0xKVxuICAgIHJldHVybiBwYXJzZUludExpc3QoZGF0YSlcbiAgcmV0dXJuIHBhcnNlSW50KGRhdGEsIDEwKVxufVxuXG5mdW5jdGlvbiBwYXJzZUludExpc3QoZGF0YSkge1xuICByZXR1cm4gZGF0YS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbih2YWwpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQodmFsLCAxMClcbiAgfSlcbn0iLCJ2YXIgSEVBREVSID0gWzY2LCA3NywgNzBdXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVhZEJNRm9udEJpbmFyeShidWYpIHtcbiAgaWYgKGJ1Zi5sZW5ndGggPCA2KVxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBidWZmZXIgbGVuZ3RoIGZvciBCTUZvbnQnKVxuXG4gIHZhciBoZWFkZXIgPSBIRUFERVIuZXZlcnkoZnVuY3Rpb24oYnl0ZSwgaSkge1xuICAgIHJldHVybiBidWYucmVhZFVJbnQ4KGkpID09PSBieXRlXG4gIH0pXG5cbiAgaWYgKCFoZWFkZXIpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdCTUZvbnQgbWlzc2luZyBCTUYgYnl0ZSBoZWFkZXInKVxuXG4gIHZhciBpID0gM1xuICB2YXIgdmVycyA9IGJ1Zi5yZWFkVUludDgoaSsrKVxuICBpZiAodmVycyA+IDMpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IHN1cHBvcnRzIEJNRm9udCBCaW5hcnkgdjMgKEJNRm9udCBBcHAgdjEuMTApJylcbiAgXG4gIHZhciB0YXJnZXQgPSB7IGtlcm5pbmdzOiBbXSwgY2hhcnM6IFtdIH1cbiAgZm9yICh2YXIgYj0wOyBiPDU7IGIrKylcbiAgICBpICs9IHJlYWRCbG9jayh0YXJnZXQsIGJ1ZiwgaSlcbiAgcmV0dXJuIHRhcmdldFxufVxuXG5mdW5jdGlvbiByZWFkQmxvY2sodGFyZ2V0LCBidWYsIGkpIHtcbiAgaWYgKGkgPiBidWYubGVuZ3RoLTEpXG4gICAgcmV0dXJuIDBcblxuICB2YXIgYmxvY2tJRCA9IGJ1Zi5yZWFkVUludDgoaSsrKVxuICB2YXIgYmxvY2tTaXplID0gYnVmLnJlYWRJbnQzMkxFKGkpXG4gIGkgKz0gNFxuXG4gIHN3aXRjaChibG9ja0lEKSB7XG4gICAgY2FzZSAxOiBcbiAgICAgIHRhcmdldC5pbmZvID0gcmVhZEluZm8oYnVmLCBpKVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDI6XG4gICAgICB0YXJnZXQuY29tbW9uID0gcmVhZENvbW1vbihidWYsIGkpXG4gICAgICBicmVha1xuICAgIGNhc2UgMzpcbiAgICAgIHRhcmdldC5wYWdlcyA9IHJlYWRQYWdlcyhidWYsIGksIGJsb2NrU2l6ZSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSA0OlxuICAgICAgdGFyZ2V0LmNoYXJzID0gcmVhZENoYXJzKGJ1ZiwgaSwgYmxvY2tTaXplKVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDU6XG4gICAgICB0YXJnZXQua2VybmluZ3MgPSByZWFkS2VybmluZ3MoYnVmLCBpLCBibG9ja1NpemUpXG4gICAgICBicmVha1xuICB9XG4gIHJldHVybiA1ICsgYmxvY2tTaXplXG59XG5cbmZ1bmN0aW9uIHJlYWRJbmZvKGJ1ZiwgaSkge1xuICB2YXIgaW5mbyA9IHt9XG4gIGluZm8uc2l6ZSA9IGJ1Zi5yZWFkSW50MTZMRShpKVxuXG4gIHZhciBiaXRGaWVsZCA9IGJ1Zi5yZWFkVUludDgoaSsyKVxuICBpbmZvLnNtb290aCA9IChiaXRGaWVsZCA+PiA3KSAmIDFcbiAgaW5mby51bmljb2RlID0gKGJpdEZpZWxkID4+IDYpICYgMVxuICBpbmZvLml0YWxpYyA9IChiaXRGaWVsZCA+PiA1KSAmIDFcbiAgaW5mby5ib2xkID0gKGJpdEZpZWxkID4+IDQpICYgMVxuICBcbiAgLy9maXhlZEhlaWdodCBpcyBvbmx5IG1lbnRpb25lZCBpbiBiaW5hcnkgc3BlYyBcbiAgaWYgKChiaXRGaWVsZCA+PiAzKSAmIDEpXG4gICAgaW5mby5maXhlZEhlaWdodCA9IDFcbiAgXG4gIGluZm8uY2hhcnNldCA9IGJ1Zi5yZWFkVUludDgoaSszKSB8fCAnJ1xuICBpbmZvLnN0cmV0Y2hIID0gYnVmLnJlYWRVSW50MTZMRShpKzQpXG4gIGluZm8uYWEgPSBidWYucmVhZFVJbnQ4KGkrNilcbiAgaW5mby5wYWRkaW5nID0gW1xuICAgIGJ1Zi5yZWFkSW50OChpKzcpLFxuICAgIGJ1Zi5yZWFkSW50OChpKzgpLFxuICAgIGJ1Zi5yZWFkSW50OChpKzkpLFxuICAgIGJ1Zi5yZWFkSW50OChpKzEwKVxuICBdXG4gIGluZm8uc3BhY2luZyA9IFtcbiAgICBidWYucmVhZEludDgoaSsxMSksXG4gICAgYnVmLnJlYWRJbnQ4KGkrMTIpXG4gIF1cbiAgaW5mby5vdXRsaW5lID0gYnVmLnJlYWRVSW50OChpKzEzKVxuICBpbmZvLmZhY2UgPSByZWFkU3RyaW5nTlQoYnVmLCBpKzE0KVxuICByZXR1cm4gaW5mb1xufVxuXG5mdW5jdGlvbiByZWFkQ29tbW9uKGJ1ZiwgaSkge1xuICB2YXIgY29tbW9uID0ge31cbiAgY29tbW9uLmxpbmVIZWlnaHQgPSBidWYucmVhZFVJbnQxNkxFKGkpXG4gIGNvbW1vbi5iYXNlID0gYnVmLnJlYWRVSW50MTZMRShpKzIpXG4gIGNvbW1vbi5zY2FsZVcgPSBidWYucmVhZFVJbnQxNkxFKGkrNClcbiAgY29tbW9uLnNjYWxlSCA9IGJ1Zi5yZWFkVUludDE2TEUoaSs2KVxuICBjb21tb24ucGFnZXMgPSBidWYucmVhZFVJbnQxNkxFKGkrOClcbiAgdmFyIGJpdEZpZWxkID0gYnVmLnJlYWRVSW50OChpKzEwKVxuICBjb21tb24ucGFja2VkID0gMFxuICBjb21tb24uYWxwaGFDaG5sID0gYnVmLnJlYWRVSW50OChpKzExKVxuICBjb21tb24ucmVkQ2hubCA9IGJ1Zi5yZWFkVUludDgoaSsxMilcbiAgY29tbW9uLmdyZWVuQ2hubCA9IGJ1Zi5yZWFkVUludDgoaSsxMylcbiAgY29tbW9uLmJsdWVDaG5sID0gYnVmLnJlYWRVSW50OChpKzE0KVxuICByZXR1cm4gY29tbW9uXG59XG5cbmZ1bmN0aW9uIHJlYWRQYWdlcyhidWYsIGksIHNpemUpIHtcbiAgdmFyIHBhZ2VzID0gW11cbiAgdmFyIHRleHQgPSByZWFkTmFtZU5UKGJ1ZiwgaSlcbiAgdmFyIGxlbiA9IHRleHQubGVuZ3RoKzFcbiAgdmFyIGNvdW50ID0gc2l6ZSAvIGxlblxuICBmb3IgKHZhciBjPTA7IGM8Y291bnQ7IGMrKykge1xuICAgIHBhZ2VzW2NdID0gYnVmLnNsaWNlKGksIGkrdGV4dC5sZW5ndGgpLnRvU3RyaW5nKCd1dGY4JylcbiAgICBpICs9IGxlblxuICB9XG4gIHJldHVybiBwYWdlc1xufVxuXG5mdW5jdGlvbiByZWFkQ2hhcnMoYnVmLCBpLCBibG9ja1NpemUpIHtcbiAgdmFyIGNoYXJzID0gW11cblxuICB2YXIgY291bnQgPSBibG9ja1NpemUgLyAyMFxuICBmb3IgKHZhciBjPTA7IGM8Y291bnQ7IGMrKykge1xuICAgIHZhciBjaGFyID0ge31cbiAgICB2YXIgb2ZmID0gYyoyMFxuICAgIGNoYXIuaWQgPSBidWYucmVhZFVJbnQzMkxFKGkgKyAwICsgb2ZmKVxuICAgIGNoYXIueCA9IGJ1Zi5yZWFkVUludDE2TEUoaSArIDQgKyBvZmYpXG4gICAgY2hhci55ID0gYnVmLnJlYWRVSW50MTZMRShpICsgNiArIG9mZilcbiAgICBjaGFyLndpZHRoID0gYnVmLnJlYWRVSW50MTZMRShpICsgOCArIG9mZilcbiAgICBjaGFyLmhlaWdodCA9IGJ1Zi5yZWFkVUludDE2TEUoaSArIDEwICsgb2ZmKVxuICAgIGNoYXIueG9mZnNldCA9IGJ1Zi5yZWFkSW50MTZMRShpICsgMTIgKyBvZmYpXG4gICAgY2hhci55b2Zmc2V0ID0gYnVmLnJlYWRJbnQxNkxFKGkgKyAxNCArIG9mZilcbiAgICBjaGFyLnhhZHZhbmNlID0gYnVmLnJlYWRJbnQxNkxFKGkgKyAxNiArIG9mZilcbiAgICBjaGFyLnBhZ2UgPSBidWYucmVhZFVJbnQ4KGkgKyAxOCArIG9mZilcbiAgICBjaGFyLmNobmwgPSBidWYucmVhZFVJbnQ4KGkgKyAxOSArIG9mZilcbiAgICBjaGFyc1tjXSA9IGNoYXJcbiAgfVxuICByZXR1cm4gY2hhcnNcbn1cblxuZnVuY3Rpb24gcmVhZEtlcm5pbmdzKGJ1ZiwgaSwgYmxvY2tTaXplKSB7XG4gIHZhciBrZXJuaW5ncyA9IFtdXG4gIHZhciBjb3VudCA9IGJsb2NrU2l6ZSAvIDEwXG4gIGZvciAodmFyIGM9MDsgYzxjb3VudDsgYysrKSB7XG4gICAgdmFyIGtlcm4gPSB7fVxuICAgIHZhciBvZmYgPSBjKjEwXG4gICAga2Vybi5maXJzdCA9IGJ1Zi5yZWFkVUludDMyTEUoaSArIDAgKyBvZmYpXG4gICAga2Vybi5zZWNvbmQgPSBidWYucmVhZFVJbnQzMkxFKGkgKyA0ICsgb2ZmKVxuICAgIGtlcm4uYW1vdW50ID0gYnVmLnJlYWRJbnQxNkxFKGkgKyA4ICsgb2ZmKVxuICAgIGtlcm5pbmdzW2NdID0ga2VyblxuICB9XG4gIHJldHVybiBrZXJuaW5nc1xufVxuXG5mdW5jdGlvbiByZWFkTmFtZU5UKGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBwb3M9b2Zmc2V0XG4gIGZvciAoOyBwb3M8YnVmLmxlbmd0aDsgcG9zKyspIHtcbiAgICBpZiAoYnVmW3Bvc10gPT09IDB4MDApIFxuICAgICAgYnJlYWtcbiAgfVxuICByZXR1cm4gYnVmLnNsaWNlKG9mZnNldCwgcG9zKVxufVxuXG5mdW5jdGlvbiByZWFkU3RyaW5nTlQoYnVmLCBvZmZzZXQpIHtcbiAgcmV0dXJuIHJlYWROYW1lTlQoYnVmLCBvZmZzZXQpLnRvU3RyaW5nKCd1dGY4Jylcbn0iLCJ2YXIgcGFyc2VBdHRyaWJ1dGVzID0gcmVxdWlyZSgnLi9wYXJzZS1hdHRyaWJzJylcbnZhciBwYXJzZUZyb21TdHJpbmcgPSByZXF1aXJlKCd4bWwtcGFyc2UtZnJvbS1zdHJpbmcnKVxuXG4vL0luIHNvbWUgY2FzZXMgZWxlbWVudC5hdHRyaWJ1dGUubm9kZU5hbWUgY2FuIHJldHVyblxuLy9hbGwgbG93ZXJjYXNlIHZhbHVlcy4uIHNvIHdlIG5lZWQgdG8gbWFwIHRoZW0gdG8gdGhlIGNvcnJlY3QgXG4vL2Nhc2VcbnZhciBOQU1FX01BUCA9IHtcbiAgc2NhbGVoOiAnc2NhbGVIJyxcbiAgc2NhbGV3OiAnc2NhbGVXJyxcbiAgc3RyZXRjaGg6ICdzdHJldGNoSCcsXG4gIGxpbmVoZWlnaHQ6ICdsaW5lSGVpZ2h0JyxcbiAgYWxwaGFjaG5sOiAnYWxwaGFDaG5sJyxcbiAgcmVkY2hubDogJ3JlZENobmwnLFxuICBncmVlbmNobmw6ICdncmVlbkNobmwnLFxuICBibHVlY2hubDogJ2JsdWVDaG5sJ1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlKGRhdGEpIHtcbiAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKVxuICBcbiAgdmFyIHhtbFJvb3QgPSBwYXJzZUZyb21TdHJpbmcoZGF0YSlcbiAgdmFyIG91dHB1dCA9IHtcbiAgICBwYWdlczogW10sXG4gICAgY2hhcnM6IFtdLFxuICAgIGtlcm5pbmdzOiBbXVxuICB9XG5cbiAgLy9nZXQgY29uZmlnIHNldHRpbmdzXG4gIDtbJ2luZm8nLCAnY29tbW9uJ10uZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgZWxlbWVudCA9IHhtbFJvb3QuZ2V0RWxlbWVudHNCeVRhZ05hbWUoa2V5KVswXVxuICAgIGlmIChlbGVtZW50KVxuICAgICAgb3V0cHV0W2tleV0gPSBwYXJzZUF0dHJpYnV0ZXMoZ2V0QXR0cmlicyhlbGVtZW50KSlcbiAgfSlcblxuICAvL2dldCBwYWdlIGluZm9cbiAgdmFyIHBhZ2VSb290ID0geG1sUm9vdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgncGFnZXMnKVswXVxuICBpZiAoIXBhZ2VSb290KVxuICAgIHRocm93IG5ldyBFcnJvcignbWFsZm9ybWVkIGZpbGUgLS0gbm8gPHBhZ2VzPiBlbGVtZW50JylcbiAgdmFyIHBhZ2VzID0gcGFnZVJvb3QuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3BhZ2UnKVxuICBmb3IgKHZhciBpPTA7IGk8cGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcCA9IHBhZ2VzW2ldXG4gICAgdmFyIGlkID0gcGFyc2VJbnQocC5nZXRBdHRyaWJ1dGUoJ2lkJyksIDEwKVxuICAgIHZhciBmaWxlID0gcC5nZXRBdHRyaWJ1dGUoJ2ZpbGUnKVxuICAgIGlmIChpc05hTihpZCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbGZvcm1lZCBmaWxlIC0tIHBhZ2UgXCJpZFwiIGF0dHJpYnV0ZSBpcyBOYU4nKVxuICAgIGlmICghZmlsZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWFsZm9ybWVkIGZpbGUgLS0gbmVlZHMgcGFnZSBcImZpbGVcIiBhdHRyaWJ1dGUnKVxuICAgIG91dHB1dC5wYWdlc1twYXJzZUludChpZCwgMTApXSA9IGZpbGVcbiAgfVxuXG4gIC8vZ2V0IGtlcm5pbmdzIC8gY2hhcnNcbiAgO1snY2hhcnMnLCAna2VybmluZ3MnXS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBlbGVtZW50ID0geG1sUm9vdC5nZXRFbGVtZW50c0J5VGFnTmFtZShrZXkpWzBdXG4gICAgaWYgKCFlbGVtZW50KVxuICAgICAgcmV0dXJuXG4gICAgdmFyIGNoaWxkVGFnID0ga2V5LnN1YnN0cmluZygwLCBrZXkubGVuZ3RoLTEpXG4gICAgdmFyIGNoaWxkcmVuID0gZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShjaGlsZFRhZylcbiAgICBmb3IgKHZhciBpPTA7IGk8Y2hpbGRyZW4ubGVuZ3RoOyBpKyspIHsgICAgICBcbiAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgICBvdXRwdXRba2V5XS5wdXNoKHBhcnNlQXR0cmlidXRlcyhnZXRBdHRyaWJzKGNoaWxkKSkpXG4gICAgfVxuICB9KVxuICByZXR1cm4gb3V0cHV0XG59XG5cbmZ1bmN0aW9uIGdldEF0dHJpYnMoZWxlbWVudCkge1xuICB2YXIgYXR0cmlicyA9IGdldEF0dHJpYkxpc3QoZWxlbWVudClcbiAgcmV0dXJuIGF0dHJpYnMucmVkdWNlKGZ1bmN0aW9uKGRpY3QsIGF0dHJpYikge1xuICAgIHZhciBrZXkgPSBtYXBOYW1lKGF0dHJpYi5ub2RlTmFtZSlcbiAgICBkaWN0W2tleV0gPSBhdHRyaWIubm9kZVZhbHVlXG4gICAgcmV0dXJuIGRpY3RcbiAgfSwge30pXG59XG5cbmZ1bmN0aW9uIGdldEF0dHJpYkxpc3QoZWxlbWVudCkge1xuICAvL0lFOCsgYW5kIG1vZGVybiBicm93c2Vyc1xuICB2YXIgYXR0cmlicyA9IFtdXG4gIGZvciAodmFyIGk9MDsgaTxlbGVtZW50LmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspXG4gICAgYXR0cmlicy5wdXNoKGVsZW1lbnQuYXR0cmlidXRlc1tpXSlcbiAgcmV0dXJuIGF0dHJpYnNcbn1cblxuZnVuY3Rpb24gbWFwTmFtZShub2RlTmFtZSkge1xuICByZXR1cm4gTkFNRV9NQVBbbm9kZU5hbWUudG9Mb3dlckNhc2UoKV0gfHwgbm9kZU5hbWVcbn0iLCIvL1NvbWUgdmVyc2lvbnMgb2YgR2x5cGhEZXNpZ25lciBoYXZlIGEgdHlwb1xuLy90aGF0IGNhdXNlcyBzb21lIGJ1Z3Mgd2l0aCBwYXJzaW5nLiBcbi8vTmVlZCB0byBjb25maXJtIHdpdGggcmVjZW50IHZlcnNpb24gb2YgdGhlIHNvZnR3YXJlXG4vL3RvIHNlZSB3aGV0aGVyIHRoaXMgaXMgc3RpbGwgYW4gaXNzdWUgb3Igbm90LlxudmFyIEdMWVBIX0RFU0lHTkVSX0VSUk9SID0gJ2NoYXNyc2V0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlQXR0cmlidXRlcyhvYmopIHtcbiAgaWYgKEdMWVBIX0RFU0lHTkVSX0VSUk9SIGluIG9iaikge1xuICAgIG9ialsnY2hhcnNldCddID0gb2JqW0dMWVBIX0RFU0lHTkVSX0VSUk9SXVxuICAgIGRlbGV0ZSBvYmpbR0xZUEhfREVTSUdORVJfRVJST1JdXG4gIH1cblxuICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgIGlmIChrID09PSAnZmFjZScgfHwgayA9PT0gJ2NoYXJzZXQnKSBcbiAgICAgIGNvbnRpbnVlXG4gICAgZWxzZSBpZiAoayA9PT0gJ3BhZGRpbmcnIHx8IGsgPT09ICdzcGFjaW5nJylcbiAgICAgIG9ialtrXSA9IHBhcnNlSW50TGlzdChvYmpba10pXG4gICAgZWxzZVxuICAgICAgb2JqW2tdID0gcGFyc2VJbnQob2JqW2tdLCAxMCkgXG4gIH1cbiAgcmV0dXJuIG9ialxufVxuXG5mdW5jdGlvbiBwYXJzZUludExpc3QoZGF0YSkge1xuICByZXR1cm4gZGF0YS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbih2YWwpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQodmFsLCAxMClcbiAgfSlcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiB4bWxwYXJzZXIoKSB7XG4gIC8vY29tbW9uIGJyb3dzZXJzXG4gIGlmICh0eXBlb2Ygd2luZG93LkRPTVBhcnNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyKSB7XG4gICAgICB2YXIgcGFyc2VyID0gbmV3IHdpbmRvdy5ET01QYXJzZXIoKVxuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUZyb21TdHJpbmcoc3RyLCAnYXBwbGljYXRpb24veG1sJylcbiAgICB9XG4gIH0gXG5cbiAgLy9JRTggZmFsbGJhY2tcbiAgaWYgKHR5cGVvZiB3aW5kb3cuQWN0aXZlWE9iamVjdCAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICYmIG5ldyB3aW5kb3cuQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTERPTScpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cikge1xuICAgICAgdmFyIHhtbERvYyA9IG5ldyB3aW5kb3cuQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxET01cIilcbiAgICAgIHhtbERvYy5hc3luYyA9IFwiZmFsc2VcIlxuICAgICAgeG1sRG9jLmxvYWRYTUwoc3RyKVxuICAgICAgcmV0dXJuIHhtbERvY1xuICAgIH1cbiAgfVxuXG4gIC8vbGFzdCByZXNvcnQgZmFsbGJhY2tcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGRpdi5pbm5lckhUTUwgPSBzdHJcbiAgICByZXR1cm4gZGl2XG4gIH1cbn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB3aW5kb3cgPSByZXF1aXJlKFwiZ2xvYmFsL3dpbmRvd1wiKVxudmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKFwiaXMtZnVuY3Rpb25cIilcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKFwicGFyc2UtaGVhZGVyc1wiKVxudmFyIHh0ZW5kID0gcmVxdWlyZShcInh0ZW5kXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlWEhSXG5jcmVhdGVYSFIuWE1MSHR0cFJlcXVlc3QgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgfHwgbm9vcFxuY3JlYXRlWEhSLlhEb21haW5SZXF1ZXN0ID0gXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiAobmV3IGNyZWF0ZVhIUi5YTUxIdHRwUmVxdWVzdCgpKSA/IGNyZWF0ZVhIUi5YTUxIdHRwUmVxdWVzdCA6IHdpbmRvdy5YRG9tYWluUmVxdWVzdFxuXG5mb3JFYWNoQXJyYXkoW1wiZ2V0XCIsIFwicHV0XCIsIFwicG9zdFwiLCBcInBhdGNoXCIsIFwiaGVhZFwiLCBcImRlbGV0ZVwiXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgY3JlYXRlWEhSW21ldGhvZCA9PT0gXCJkZWxldGVcIiA/IFwiZGVsXCIgOiBtZXRob2RdID0gZnVuY3Rpb24odXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgICAgICBvcHRpb25zID0gaW5pdFBhcmFtcyh1cmksIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgICAgICBvcHRpb25zLm1ldGhvZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgICAgIHJldHVybiBfY3JlYXRlWEhSKG9wdGlvbnMpXG4gICAgfVxufSlcblxuZnVuY3Rpb24gZm9yRWFjaEFycmF5KGFycmF5LCBpdGVyYXRvcikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0b3IoYXJyYXlbaV0pXG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc0VtcHR5KG9iail7XG4gICAgZm9yKHZhciBpIGluIG9iail7XG4gICAgICAgIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSkgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGluaXRQYXJhbXModXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIHZhciBwYXJhbXMgPSB1cmlcblxuICAgIGlmIChpc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgICAgIGNhbGxiYWNrID0gb3B0aW9uc1xuICAgICAgICBpZiAodHlwZW9mIHVyaSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcGFyYW1zID0ge3VyaTp1cml9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBwYXJhbXMgPSB4dGVuZChvcHRpb25zLCB7dXJpOiB1cml9KVxuICAgIH1cblxuICAgIHBhcmFtcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgcmV0dXJuIHBhcmFtc1xufVxuXG5mdW5jdGlvbiBjcmVhdGVYSFIodXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIG9wdGlvbnMgPSBpbml0UGFyYW1zKHVyaSwgb3B0aW9ucywgY2FsbGJhY2spXG4gICAgcmV0dXJuIF9jcmVhdGVYSFIob3B0aW9ucylcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZVhIUihvcHRpb25zKSB7XG4gICAgaWYodHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjYWxsYmFjayBhcmd1bWVudCBtaXNzaW5nXCIpXG4gICAgfVxuXG4gICAgdmFyIGNhbGxlZCA9IGZhbHNlXG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gY2JPbmNlKGVyciwgcmVzcG9uc2UsIGJvZHkpe1xuICAgICAgICBpZighY2FsbGVkKXtcbiAgICAgICAgICAgIGNhbGxlZCA9IHRydWVcbiAgICAgICAgICAgIG9wdGlvbnMuY2FsbGJhY2soZXJyLCByZXNwb25zZSwgYm9keSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlYWR5c3RhdGVjaGFuZ2UoKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgbG9hZEZ1bmMoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Qm9keSgpIHtcbiAgICAgICAgLy8gQ2hyb21lIHdpdGggcmVxdWVzdFR5cGU9YmxvYiB0aHJvd3MgZXJyb3JzIGFycm91bmQgd2hlbiBldmVuIHRlc3RpbmcgYWNjZXNzIHRvIHJlc3BvbnNlVGV4dFxuICAgICAgICB2YXIgYm9keSA9IHVuZGVmaW5lZFxuXG4gICAgICAgIGlmICh4aHIucmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGJvZHkgPSB4aHIucmVzcG9uc2VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJvZHkgPSB4aHIucmVzcG9uc2VUZXh0IHx8IGdldFhtbCh4aHIpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNKc29uKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGJvZHkgPSBKU09OLnBhcnNlKGJvZHkpXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJvZHlcbiAgICB9XG5cbiAgICB2YXIgZmFpbHVyZVJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgIGJvZHk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAwLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgICAgIHVybDogdXJpLFxuICAgICAgICAgICAgICAgIHJhd1JlcXVlc3Q6IHhoclxuICAgICAgICAgICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3JGdW5jKGV2dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFRpbWVyKVxuICAgICAgICBpZighKGV2dCBpbnN0YW5jZW9mIEVycm9yKSl7XG4gICAgICAgICAgICBldnQgPSBuZXcgRXJyb3IoXCJcIiArIChldnQgfHwgXCJVbmtub3duIFhNTEh0dHBSZXF1ZXN0IEVycm9yXCIpIClcbiAgICAgICAgfVxuICAgICAgICBldnQuc3RhdHVzQ29kZSA9IDBcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGV2dCwgZmFpbHVyZVJlc3BvbnNlKVxuICAgIH1cblxuICAgIC8vIHdpbGwgbG9hZCB0aGUgZGF0YSAmIHByb2Nlc3MgdGhlIHJlc3BvbnNlIGluIGEgc3BlY2lhbCByZXNwb25zZSBvYmplY3RcbiAgICBmdW5jdGlvbiBsb2FkRnVuYygpIHtcbiAgICAgICAgaWYgKGFib3J0ZWQpIHJldHVyblxuICAgICAgICB2YXIgc3RhdHVzXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VGltZXIpXG4gICAgICAgIGlmKG9wdGlvbnMudXNlWERSICYmIHhoci5zdGF0dXM9PT11bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vSUU4IENPUlMgR0VUIHN1Y2Nlc3NmdWwgcmVzcG9uc2UgZG9lc24ndCBoYXZlIGEgc3RhdHVzIGZpZWxkLCBidXQgYm9keSBpcyBmaW5lXG4gICAgICAgICAgICBzdGF0dXMgPSAyMDBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXR1cyA9ICh4aHIuc3RhdHVzID09PSAxMjIzID8gMjA0IDogeGhyLnN0YXR1cylcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzcG9uc2UgPSBmYWlsdXJlUmVzcG9uc2VcbiAgICAgICAgdmFyIGVyciA9IG51bGxcblxuICAgICAgICBpZiAoc3RhdHVzICE9PSAwKXtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgIGJvZHk6IGdldEJvZHkoKSxcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiBzdGF0dXMsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICAgICAgdXJsOiB1cmksXG4gICAgICAgICAgICAgICAgcmF3UmVxdWVzdDogeGhyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKXsgLy9yZW1lbWJlciB4aHIgY2FuIGluIGZhY3QgYmUgWERSIGZvciBDT1JTIGluIElFXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycyA9IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnIgPSBuZXcgRXJyb3IoXCJJbnRlcm5hbCBYTUxIdHRwUmVxdWVzdCBFcnJvclwiKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIHJlc3BvbnNlLCByZXNwb25zZS5ib2R5KVxuICAgIH1cblxuICAgIHZhciB4aHIgPSBvcHRpb25zLnhociB8fCBudWxsXG5cbiAgICBpZiAoIXhocikge1xuICAgICAgICBpZiAob3B0aW9ucy5jb3JzIHx8IG9wdGlvbnMudXNlWERSKSB7XG4gICAgICAgICAgICB4aHIgPSBuZXcgY3JlYXRlWEhSLlhEb21haW5SZXF1ZXN0KClcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB4aHIgPSBuZXcgY3JlYXRlWEhSLlhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBrZXlcbiAgICB2YXIgYWJvcnRlZFxuICAgIHZhciB1cmkgPSB4aHIudXJsID0gb3B0aW9ucy51cmkgfHwgb3B0aW9ucy51cmxcbiAgICB2YXIgbWV0aG9kID0geGhyLm1ldGhvZCA9IG9wdGlvbnMubWV0aG9kIHx8IFwiR0VUXCJcbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keSB8fCBvcHRpb25zLmRhdGEgfHwgbnVsbFxuICAgIHZhciBoZWFkZXJzID0geGhyLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgfHwge31cbiAgICB2YXIgc3luYyA9ICEhb3B0aW9ucy5zeW5jXG4gICAgdmFyIGlzSnNvbiA9IGZhbHNlXG4gICAgdmFyIHRpbWVvdXRUaW1lclxuXG4gICAgaWYgKFwianNvblwiIGluIG9wdGlvbnMpIHtcbiAgICAgICAgaXNKc29uID0gdHJ1ZVxuICAgICAgICBoZWFkZXJzW1wiYWNjZXB0XCJdIHx8IGhlYWRlcnNbXCJBY2NlcHRcIl0gfHwgKGhlYWRlcnNbXCJBY2NlcHRcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIikgLy9Eb24ndCBvdmVycmlkZSBleGlzdGluZyBhY2NlcHQgaGVhZGVyIGRlY2xhcmVkIGJ5IHVzZXJcbiAgICAgICAgaWYgKG1ldGhvZCAhPT0gXCJHRVRcIiAmJiBtZXRob2QgIT09IFwiSEVBRFwiKSB7XG4gICAgICAgICAgICBoZWFkZXJzW1wiY29udGVudC10eXBlXCJdIHx8IGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gfHwgKGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIikgLy9Eb24ndCBvdmVycmlkZSBleGlzdGluZyBhY2NlcHQgaGVhZGVyIGRlY2xhcmVkIGJ5IHVzZXJcbiAgICAgICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmpzb24pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gcmVhZHlzdGF0ZWNoYW5nZVxuICAgIHhoci5vbmxvYWQgPSBsb2FkRnVuY1xuICAgIHhoci5vbmVycm9yID0gZXJyb3JGdW5jXG4gICAgLy8gSUU5IG11c3QgaGF2ZSBvbnByb2dyZXNzIGJlIHNldCB0byBhIHVuaXF1ZSBmdW5jdGlvbi5cbiAgICB4aHIub25wcm9ncmVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gSUUgbXVzdCBkaWVcbiAgICB9XG4gICAgeGhyLm9udGltZW91dCA9IGVycm9yRnVuY1xuICAgIHhoci5vcGVuKG1ldGhvZCwgdXJpLCAhc3luYywgb3B0aW9ucy51c2VybmFtZSwgb3B0aW9ucy5wYXNzd29yZClcbiAgICAvL2hhcyB0byBiZSBhZnRlciBvcGVuXG4gICAgaWYoIXN5bmMpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9ICEhb3B0aW9ucy53aXRoQ3JlZGVudGlhbHNcbiAgICB9XG4gICAgLy8gQ2Fubm90IHNldCB0aW1lb3V0IHdpdGggc3luYyByZXF1ZXN0XG4gICAgLy8gbm90IHNldHRpbmcgdGltZW91dCBvbiB0aGUgeGhyIG9iamVjdCwgYmVjYXVzZSBvZiBvbGQgd2Via2l0cyBldGMuIG5vdCBoYW5kbGluZyB0aGF0IGNvcnJlY3RseVxuICAgIC8vIGJvdGggbnBtJ3MgcmVxdWVzdCBhbmQganF1ZXJ5IDEueCB1c2UgdGhpcyBraW5kIG9mIHRpbWVvdXQsIHNvIHRoaXMgaXMgYmVpbmcgY29uc2lzdGVudFxuICAgIGlmICghc3luYyAmJiBvcHRpb25zLnRpbWVvdXQgPiAwICkge1xuICAgICAgICB0aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBhYm9ydGVkPXRydWUvL0lFOSBtYXkgc3RpbGwgY2FsbCByZWFkeXN0YXRlY2hhbmdlXG4gICAgICAgICAgICB4aHIuYWJvcnQoXCJ0aW1lb3V0XCIpXG4gICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihcIlhNTEh0dHBSZXF1ZXN0IHRpbWVvdXRcIilcbiAgICAgICAgICAgIGUuY29kZSA9IFwiRVRJTUVET1VUXCJcbiAgICAgICAgICAgIGVycm9yRnVuYyhlKVxuICAgICAgICB9LCBvcHRpb25zLnRpbWVvdXQgKVxuICAgIH1cblxuICAgIGlmICh4aHIuc2V0UmVxdWVzdEhlYWRlcikge1xuICAgICAgICBmb3Ioa2V5IGluIGhlYWRlcnMpe1xuICAgICAgICAgICAgaWYoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIGhlYWRlcnNba2V5XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5oZWFkZXJzICYmICFpc0VtcHR5KG9wdGlvbnMuaGVhZGVycykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSGVhZGVycyBjYW5ub3QgYmUgc2V0IG9uIGFuIFhEb21haW5SZXF1ZXN0IG9iamVjdFwiKVxuICAgIH1cblxuICAgIGlmIChcInJlc3BvbnNlVHlwZVwiIGluIG9wdGlvbnMpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IG9wdGlvbnMucmVzcG9uc2VUeXBlXG4gICAgfVxuXG4gICAgaWYgKFwiYmVmb3JlU2VuZFwiIGluIG9wdGlvbnMgJiZcbiAgICAgICAgdHlwZW9mIG9wdGlvbnMuYmVmb3JlU2VuZCA9PT0gXCJmdW5jdGlvblwiXG4gICAgKSB7XG4gICAgICAgIG9wdGlvbnMuYmVmb3JlU2VuZCh4aHIpXG4gICAgfVxuXG4gICAgeGhyLnNlbmQoYm9keSlcblxuICAgIHJldHVybiB4aHJcblxuXG59XG5cbmZ1bmN0aW9uIGdldFhtbCh4aHIpIHtcbiAgICBpZiAoeGhyLnJlc3BvbnNlVHlwZSA9PT0gXCJkb2N1bWVudFwiKSB7XG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VYTUxcbiAgICB9XG4gICAgdmFyIGZpcmVmb3hCdWdUYWtlbkVmZmVjdCA9IHhoci5zdGF0dXMgPT09IDIwNCAmJiB4aHIucmVzcG9uc2VYTUwgJiYgeGhyLnJlc3BvbnNlWE1MLmRvY3VtZW50RWxlbWVudC5ub2RlTmFtZSA9PT0gXCJwYXJzZXJlcnJvclwiXG4gICAgaWYgKHhoci5yZXNwb25zZVR5cGUgPT09IFwiXCIgJiYgIWZpcmVmb3hCdWdUYWtlbkVmZmVjdCkge1xuICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlWE1MXG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG4iLCJpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWw7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNlbGY7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge307XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb25cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uIChmbikge1xuICB2YXIgc3RyaW5nID0gdG9TdHJpbmcuY2FsbChmbilcbiAgcmV0dXJuIHN0cmluZyA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJyB8fFxuICAgICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgJiYgc3RyaW5nICE9PSAnW29iamVjdCBSZWdFeHBdJykgfHxcbiAgICAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgLy8gSUU4IGFuZCBiZWxvd1xuICAgICAoZm4gPT09IHdpbmRvdy5zZXRUaW1lb3V0IHx8XG4gICAgICBmbiA9PT0gd2luZG93LmFsZXJ0IHx8XG4gICAgICBmbiA9PT0gd2luZG93LmNvbmZpcm0gfHxcbiAgICAgIGZuID09PSB3aW5kb3cucHJvbXB0KSlcbn07XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2lzLWZ1bmN0aW9uJylcblxubW9kdWxlLmV4cG9ydHMgPSBmb3JFYWNoXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcblxuZnVuY3Rpb24gZm9yRWFjaChsaXN0LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXNGdW5jdGlvbihpdGVyYXRvcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaXRlcmF0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgY29udGV4dCA9IHRoaXNcbiAgICB9XG4gICAgXG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobGlzdCkgPT09ICdbb2JqZWN0IEFycmF5XScpXG4gICAgICAgIGZvckVhY2hBcnJheShsaXN0LCBpdGVyYXRvciwgY29udGV4dClcbiAgICBlbHNlIGlmICh0eXBlb2YgbGlzdCA9PT0gJ3N0cmluZycpXG4gICAgICAgIGZvckVhY2hTdHJpbmcobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpXG4gICAgZWxzZVxuICAgICAgICBmb3JFYWNoT2JqZWN0KGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoQXJyYXkoYXJyYXksIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGFycmF5LCBpKSkge1xuICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVtpXSwgaSwgYXJyYXkpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZvckVhY2hTdHJpbmcoc3RyaW5nLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzdHJpbmcubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgLy8gbm8gc3VjaCB0aGluZyBhcyBhIHNwYXJzZSBzdHJpbmcuXG4gICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgc3RyaW5nLmNoYXJBdChpKSwgaSwgc3RyaW5nKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZm9yRWFjaE9iamVjdChvYmplY3QsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmplY3QpIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrKSkge1xuICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmplY3Rba10sIGssIG9iamVjdClcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIlxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdHJpbTtcblxuZnVuY3Rpb24gdHJpbShzdHIpe1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbn1cblxuZXhwb3J0cy5sZWZ0ID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKTtcbn07XG5cbmV4cG9ydHMucmlnaHQgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xccyokLywgJycpO1xufTtcbiIsInZhciB0cmltID0gcmVxdWlyZSgndHJpbScpXG4gICwgZm9yRWFjaCA9IHJlcXVpcmUoJ2Zvci1lYWNoJylcbiAgLCBpc0FycmF5ID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChoZWFkZXJzKSB7XG4gIGlmICghaGVhZGVycylcbiAgICByZXR1cm4ge31cblxuICB2YXIgcmVzdWx0ID0ge31cblxuICBmb3JFYWNoKFxuICAgICAgdHJpbShoZWFkZXJzKS5zcGxpdCgnXFxuJylcbiAgICAsIGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gcm93LmluZGV4T2YoJzonKVxuICAgICAgICAgICwga2V5ID0gdHJpbShyb3cuc2xpY2UoMCwgaW5kZXgpKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgLCB2YWx1ZSA9IHRyaW0ocm93LnNsaWNlKGluZGV4ICsgMSkpXG5cbiAgICAgICAgaWYgKHR5cGVvZihyZXN1bHRba2V5XSkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZVxuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkocmVzdWx0W2tleV0pKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IFsgcmVzdWx0W2tleV0sIHZhbHVlIF1cbiAgICAgICAgfVxuICAgICAgfVxuICApXG5cbiAgcmV0dXJuIHJlc3VsdFxufSIsIm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kXG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgdGFyZ2V0ID0ge31cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0XG59XG4iLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJ2YXIgY3JlYXRlTGF5b3V0ID0gcmVxdWlyZSgnbGF5b3V0LWJtZm9udC10ZXh0JylcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBjcmVhdGVJbmRpY2VzID0gcmVxdWlyZSgncXVhZC1pbmRpY2VzJylcbnZhciBidWZmZXIgPSByZXF1aXJlKCd0aHJlZS1idWZmZXItdmVydGV4LWRhdGEnKVxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKVxuXG52YXIgdmVydGljZXMgPSByZXF1aXJlKCcuL2xpYi92ZXJ0aWNlcycpXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL2xpYi91dGlscycpXG5cbnZhciBCYXNlID0gVEhSRUUuQnVmZmVyR2VvbWV0cnlcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVUZXh0R2VvbWV0cnkgKG9wdCkge1xuICByZXR1cm4gbmV3IFRleHRHZW9tZXRyeShvcHQpXG59XG5cbmZ1bmN0aW9uIFRleHRHZW9tZXRyeSAob3B0KSB7XG4gIEJhc2UuY2FsbCh0aGlzKVxuXG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJykge1xuICAgIG9wdCA9IHsgdGV4dDogb3B0IH1cbiAgfVxuXG4gIC8vIHVzZSB0aGVzZSBhcyBkZWZhdWx0IHZhbHVlcyBmb3IgYW55IHN1YnNlcXVlbnRcbiAgLy8gY2FsbHMgdG8gdXBkYXRlKClcbiAgdGhpcy5fb3B0ID0gYXNzaWduKHt9LCBvcHQpXG5cbiAgLy8gYWxzbyBkbyBhbiBpbml0aWFsIHNldHVwLi4uXG4gIGlmIChvcHQpIHRoaXMudXBkYXRlKG9wdClcbn1cblxuaW5oZXJpdHMoVGV4dEdlb21ldHJ5LCBCYXNlKVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChvcHQpIHtcbiAgaWYgKHR5cGVvZiBvcHQgPT09ICdzdHJpbmcnKSB7XG4gICAgb3B0ID0geyB0ZXh0OiBvcHQgfVxuICB9XG5cbiAgLy8gdXNlIGNvbnN0cnVjdG9yIGRlZmF1bHRzXG4gIG9wdCA9IGFzc2lnbih7fSwgdGhpcy5fb3B0LCBvcHQpXG5cbiAgaWYgKCFvcHQuZm9udCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSBhIHsgZm9udCB9IGluIG9wdGlvbnMnKVxuICB9XG5cbiAgdGhpcy5sYXlvdXQgPSBjcmVhdGVMYXlvdXQob3B0KVxuXG4gIC8vIGdldCB2ZWMyIHRleGNvb3Jkc1xuICB2YXIgZmxpcFkgPSBvcHQuZmxpcFkgIT09IGZhbHNlXG5cbiAgLy8gdGhlIGRlc2lyZWQgQk1Gb250IGRhdGFcbiAgdmFyIGZvbnQgPSBvcHQuZm9udFxuXG4gIC8vIGRldGVybWluZSB0ZXh0dXJlIHNpemUgZnJvbSBmb250IGZpbGVcbiAgdmFyIHRleFdpZHRoID0gZm9udC5jb21tb24uc2NhbGVXXG4gIHZhciB0ZXhIZWlnaHQgPSBmb250LmNvbW1vbi5zY2FsZUhcblxuICAvLyBnZXQgdmlzaWJsZSBnbHlwaHNcbiAgdmFyIGdseXBocyA9IHRoaXMubGF5b3V0LmdseXBocy5maWx0ZXIoZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcbiAgICByZXR1cm4gYml0bWFwLndpZHRoICogYml0bWFwLmhlaWdodCA+IDBcbiAgfSlcblxuICAvLyBwcm92aWRlIHZpc2libGUgZ2x5cGhzIGZvciBjb252ZW5pZW5jZVxuICB0aGlzLnZpc2libGVHbHlwaHMgPSBnbHlwaHNcblxuICAvLyBnZXQgY29tbW9uIHZlcnRleCBkYXRhXG4gIHZhciBwb3NpdGlvbnMgPSB2ZXJ0aWNlcy5wb3NpdGlvbnMoZ2x5cGhzKVxuICB2YXIgdXZzID0gdmVydGljZXMudXZzKGdseXBocywgdGV4V2lkdGgsIHRleEhlaWdodCwgZmxpcFkpXG4gIHZhciBpbmRpY2VzID0gY3JlYXRlSW5kaWNlcyh7XG4gICAgY2xvY2t3aXNlOiB0cnVlLFxuICAgIHR5cGU6ICd1aW50MTYnLFxuICAgIGNvdW50OiBnbHlwaHMubGVuZ3RoXG4gIH0pXG5cbiAgLy8gdXBkYXRlIHZlcnRleCBkYXRhXG4gIGJ1ZmZlci5pbmRleCh0aGlzLCBpbmRpY2VzLCAxLCAndWludDE2JylcbiAgYnVmZmVyLmF0dHIodGhpcywgJ3Bvc2l0aW9uJywgcG9zaXRpb25zLCAyKVxuICBidWZmZXIuYXR0cih0aGlzLCAndXYnLCB1dnMsIDIpXG5cbiAgLy8gdXBkYXRlIG11bHRpcGFnZSBkYXRhXG4gIGlmICghb3B0Lm11bHRpcGFnZSAmJiAncGFnZScgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgLy8gZGlzYWJsZSBtdWx0aXBhZ2UgcmVuZGVyaW5nXG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ3BhZ2UnKVxuICB9IGVsc2UgaWYgKG9wdC5tdWx0aXBhZ2UpIHtcbiAgICB2YXIgcGFnZXMgPSB2ZXJ0aWNlcy5wYWdlcyhnbHlwaHMpXG4gICAgLy8gZW5hYmxlIG11bHRpcGFnZSByZW5kZXJpbmdcbiAgICBidWZmZXIuYXR0cih0aGlzLCAncGFnZScsIHBhZ2VzLCAxKVxuICB9XG59XG5cblRleHRHZW9tZXRyeS5wcm90b3R5cGUuY29tcHV0ZUJvdW5kaW5nU3BoZXJlID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5ib3VuZGluZ1NwaGVyZSA9PT0gbnVsbCkge1xuICAgIHRoaXMuYm91bmRpbmdTcGhlcmUgPSBuZXcgVEhSRUUuU3BoZXJlKClcbiAgfVxuXG4gIHZhciBwb3NpdGlvbnMgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXlcbiAgdmFyIGl0ZW1TaXplID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLml0ZW1TaXplXG4gIGlmICghcG9zaXRpb25zIHx8ICFpdGVtU2l6ZSB8fCBwb3NpdGlvbnMubGVuZ3RoIDwgMikge1xuICAgIHRoaXMuYm91bmRpbmdTcGhlcmUucmFkaXVzID0gMFxuICAgIHRoaXMuYm91bmRpbmdTcGhlcmUuY2VudGVyLnNldCgwLCAwLCAwKVxuICAgIHJldHVyblxuICB9XG4gIHV0aWxzLmNvbXB1dGVTcGhlcmUocG9zaXRpb25zLCB0aGlzLmJvdW5kaW5nU3BoZXJlKVxuICBpZiAoaXNOYU4odGhpcy5ib3VuZGluZ1NwaGVyZS5yYWRpdXMpKSB7XG4gICAgY29uc29sZS5lcnJvcignVEhSRUUuQnVmZmVyR2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKCk6ICcgK1xuICAgICAgJ0NvbXB1dGVkIHJhZGl1cyBpcyBOYU4uIFRoZSAnICtcbiAgICAgICdcInBvc2l0aW9uXCIgYXR0cmlidXRlIGlzIGxpa2VseSB0byBoYXZlIE5hTiB2YWx1ZXMuJylcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYm91bmRpbmdCb3ggPT09IG51bGwpIHtcbiAgICB0aGlzLmJvdW5kaW5nQm94ID0gbmV3IFRIUkVFLkJveDMoKVxuICB9XG5cbiAgdmFyIGJib3ggPSB0aGlzLmJvdW5kaW5nQm94XG4gIHZhciBwb3NpdGlvbnMgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXlcbiAgdmFyIGl0ZW1TaXplID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLml0ZW1TaXplXG4gIGlmICghcG9zaXRpb25zIHx8ICFpdGVtU2l6ZSB8fCBwb3NpdGlvbnMubGVuZ3RoIDwgMikge1xuICAgIGJib3gubWFrZUVtcHR5KClcbiAgICByZXR1cm5cbiAgfVxuICB1dGlscy5jb21wdXRlQm94KHBvc2l0aW9ucywgYmJveClcbn1cbiIsInZhciBpdGVtU2l6ZSA9IDJcbnZhciBib3ggPSB7IG1pbjogWzAsIDBdLCBtYXg6IFswLCAwXSB9XG5cbmZ1bmN0aW9uIGJvdW5kcyAocG9zaXRpb25zKSB7XG4gIHZhciBjb3VudCA9IHBvc2l0aW9ucy5sZW5ndGggLyBpdGVtU2l6ZVxuICBib3gubWluWzBdID0gcG9zaXRpb25zWzBdXG4gIGJveC5taW5bMV0gPSBwb3NpdGlvbnNbMV1cbiAgYm94Lm1heFswXSA9IHBvc2l0aW9uc1swXVxuICBib3gubWF4WzFdID0gcG9zaXRpb25zWzFdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgdmFyIHggPSBwb3NpdGlvbnNbaSAqIGl0ZW1TaXplICsgMF1cbiAgICB2YXIgeSA9IHBvc2l0aW9uc1tpICogaXRlbVNpemUgKyAxXVxuICAgIGJveC5taW5bMF0gPSBNYXRoLm1pbih4LCBib3gubWluWzBdKVxuICAgIGJveC5taW5bMV0gPSBNYXRoLm1pbih5LCBib3gubWluWzFdKVxuICAgIGJveC5tYXhbMF0gPSBNYXRoLm1heCh4LCBib3gubWF4WzBdKVxuICAgIGJveC5tYXhbMV0gPSBNYXRoLm1heCh5LCBib3gubWF4WzFdKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbXB1dGVCb3ggPSBmdW5jdGlvbiAocG9zaXRpb25zLCBvdXRwdXQpIHtcbiAgYm91bmRzKHBvc2l0aW9ucylcbiAgb3V0cHV0Lm1pbi5zZXQoYm94Lm1pblswXSwgYm94Lm1pblsxXSwgMClcbiAgb3V0cHV0Lm1heC5zZXQoYm94Lm1heFswXSwgYm94Lm1heFsxXSwgMClcbn1cblxubW9kdWxlLmV4cG9ydHMuY29tcHV0ZVNwaGVyZSA9IGZ1bmN0aW9uIChwb3NpdGlvbnMsIG91dHB1dCkge1xuICBib3VuZHMocG9zaXRpb25zKVxuICB2YXIgbWluWCA9IGJveC5taW5bMF1cbiAgdmFyIG1pblkgPSBib3gubWluWzFdXG4gIHZhciBtYXhYID0gYm94Lm1heFswXVxuICB2YXIgbWF4WSA9IGJveC5tYXhbMV1cbiAgdmFyIHdpZHRoID0gbWF4WCAtIG1pblhcbiAgdmFyIGhlaWdodCA9IG1heFkgLSBtaW5ZXG4gIHZhciBsZW5ndGggPSBNYXRoLnNxcnQod2lkdGggKiB3aWR0aCArIGhlaWdodCAqIGhlaWdodClcbiAgb3V0cHV0LmNlbnRlci5zZXQobWluWCArIHdpZHRoIC8gMiwgbWluWSArIGhlaWdodCAvIDIsIDApXG4gIG91dHB1dC5yYWRpdXMgPSBsZW5ndGggLyAyXG59XG4iLCJtb2R1bGUuZXhwb3J0cy5wYWdlcyA9IGZ1bmN0aW9uIHBhZ2VzIChnbHlwaHMpIHtcbiAgdmFyIHBhZ2VzID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDEpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgaWQgPSBnbHlwaC5kYXRhLnBhZ2UgfHwgMFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICB9KVxuICByZXR1cm4gcGFnZXNcbn1cblxubW9kdWxlLmV4cG9ydHMudXZzID0gZnVuY3Rpb24gdXZzIChnbHlwaHMsIHRleFdpZHRoLCB0ZXhIZWlnaHQsIGZsaXBZKSB7XG4gIHZhciB1dnMgPSBuZXcgRmxvYXQzMkFycmF5KGdseXBocy5sZW5ndGggKiA0ICogMilcbiAgdmFyIGkgPSAwXG4gIGdseXBocy5mb3JFYWNoKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG4gICAgdmFyIGJ3ID0gKGJpdG1hcC54ICsgYml0bWFwLndpZHRoKVxuICAgIHZhciBiaCA9IChiaXRtYXAueSArIGJpdG1hcC5oZWlnaHQpXG5cbiAgICAvLyB0b3AgbGVmdCBwb3NpdGlvblxuICAgIHZhciB1MCA9IGJpdG1hcC54IC8gdGV4V2lkdGhcbiAgICB2YXIgdjEgPSBiaXRtYXAueSAvIHRleEhlaWdodFxuICAgIHZhciB1MSA9IGJ3IC8gdGV4V2lkdGhcbiAgICB2YXIgdjAgPSBiaCAvIHRleEhlaWdodFxuXG4gICAgaWYgKGZsaXBZKSB7XG4gICAgICB2MSA9ICh0ZXhIZWlnaHQgLSBiaXRtYXAueSkgLyB0ZXhIZWlnaHRcbiAgICAgIHYwID0gKHRleEhlaWdodCAtIGJoKSAvIHRleEhlaWdodFxuICAgIH1cblxuICAgIC8vIEJMXG4gICAgdXZzW2krK10gPSB1MFxuICAgIHV2c1tpKytdID0gdjFcbiAgICAvLyBUTFxuICAgIHV2c1tpKytdID0gdTBcbiAgICB1dnNbaSsrXSA9IHYwXG4gICAgLy8gVFJcbiAgICB1dnNbaSsrXSA9IHUxXG4gICAgdXZzW2krK10gPSB2MFxuICAgIC8vIEJSXG4gICAgdXZzW2krK10gPSB1MVxuICAgIHV2c1tpKytdID0gdjFcbiAgfSlcbiAgcmV0dXJuIHV2c1xufVxuXG5tb2R1bGUuZXhwb3J0cy5wb3NpdGlvbnMgPSBmdW5jdGlvbiBwb3NpdGlvbnMgKGdseXBocykge1xuICB2YXIgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDIpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuXG4gICAgLy8gYm90dG9tIGxlZnQgcG9zaXRpb25cbiAgICB2YXIgeCA9IGdseXBoLnBvc2l0aW9uWzBdICsgYml0bWFwLnhvZmZzZXRcbiAgICB2YXIgeSA9IGdseXBoLnBvc2l0aW9uWzFdICsgYml0bWFwLnlvZmZzZXRcblxuICAgIC8vIHF1YWQgc2l6ZVxuICAgIHZhciB3ID0gYml0bWFwLndpZHRoXG4gICAgdmFyIGggPSBiaXRtYXAuaGVpZ2h0XG5cbiAgICAvLyBCTFxuICAgIHBvc2l0aW9uc1tpKytdID0geFxuICAgIHBvc2l0aW9uc1tpKytdID0geVxuICAgIC8vIFRMXG4gICAgcG9zaXRpb25zW2krK10gPSB4XG4gICAgcG9zaXRpb25zW2krK10gPSB5ICsgaFxuICAgIC8vIFRSXG4gICAgcG9zaXRpb25zW2krK10gPSB4ICsgd1xuICAgIHBvc2l0aW9uc1tpKytdID0geSArIGhcbiAgICAvLyBCUlxuICAgIHBvc2l0aW9uc1tpKytdID0geCArIHdcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHlcbiAgfSlcbiAgcmV0dXJuIHBvc2l0aW9uc1xufVxuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJ2YXIgd29yZFdyYXAgPSByZXF1aXJlKCd3b3JkLXdyYXBwZXInKVxudmFyIHh0ZW5kID0gcmVxdWlyZSgneHRlbmQnKVxudmFyIGZpbmRDaGFyID0gcmVxdWlyZSgnaW5kZXhvZi1wcm9wZXJ0eScpKCdpZCcpXG52YXIgbnVtYmVyID0gcmVxdWlyZSgnYXMtbnVtYmVyJylcblxudmFyIFhfSEVJR0hUUyA9IFsneCcsICdlJywgJ2EnLCAnbycsICduJywgJ3MnLCAncicsICdjJywgJ3UnLCAnbScsICd2JywgJ3cnLCAneiddXG52YXIgTV9XSURUSFMgPSBbJ20nLCAndyddXG52YXIgQ0FQX0hFSUdIVFMgPSBbJ0gnLCAnSScsICdOJywgJ0UnLCAnRicsICdLJywgJ0wnLCAnVCcsICdVJywgJ1YnLCAnVycsICdYJywgJ1knLCAnWiddXG5cblxudmFyIFRBQl9JRCA9ICdcXHQnLmNoYXJDb2RlQXQoMClcbnZhciBTUEFDRV9JRCA9ICcgJy5jaGFyQ29kZUF0KDApXG52YXIgQUxJR05fTEVGVCA9IDAsIFxuICAgIEFMSUdOX0NFTlRFUiA9IDEsIFxuICAgIEFMSUdOX1JJR0hUID0gMlxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUxheW91dChvcHQpIHtcbiAgcmV0dXJuIG5ldyBUZXh0TGF5b3V0KG9wdClcbn1cblxuZnVuY3Rpb24gVGV4dExheW91dChvcHQpIHtcbiAgdGhpcy5nbHlwaHMgPSBbXVxuICB0aGlzLl9tZWFzdXJlID0gdGhpcy5jb21wdXRlTWV0cmljcy5iaW5kKHRoaXMpXG4gIHRoaXMudXBkYXRlKG9wdClcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3B0KSB7XG4gIG9wdCA9IHh0ZW5kKHtcbiAgICBtZWFzdXJlOiB0aGlzLl9tZWFzdXJlXG4gIH0sIG9wdClcbiAgdGhpcy5fb3B0ID0gb3B0XG4gIHRoaXMuX29wdC50YWJTaXplID0gbnVtYmVyKHRoaXMuX29wdC50YWJTaXplLCA0KVxuXG4gIGlmICghb3B0LmZvbnQpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdtdXN0IHByb3ZpZGUgYSB2YWxpZCBiaXRtYXAgZm9udCcpXG5cbiAgdmFyIGdseXBocyA9IHRoaXMuZ2x5cGhzXG4gIHZhciB0ZXh0ID0gb3B0LnRleHR8fCcnIFxuICB2YXIgZm9udCA9IG9wdC5mb250XG4gIHRoaXMuX3NldHVwU3BhY2VHbHlwaHMoZm9udClcbiAgXG4gIHZhciBsaW5lcyA9IHdvcmRXcmFwLmxpbmVzKHRleHQsIG9wdClcbiAgdmFyIG1pbldpZHRoID0gb3B0LndpZHRoIHx8IDBcblxuICAvL2NsZWFyIGdseXBoc1xuICBnbHlwaHMubGVuZ3RoID0gMFxuXG4gIC8vZ2V0IG1heCBsaW5lIHdpZHRoXG4gIHZhciBtYXhMaW5lV2lkdGggPSBsaW5lcy5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgbGluZSkge1xuICAgIHJldHVybiBNYXRoLm1heChwcmV2LCBsaW5lLndpZHRoLCBtaW5XaWR0aClcbiAgfSwgMClcblxuICAvL3RoZSBwZW4gcG9zaXRpb25cbiAgdmFyIHggPSAwXG4gIHZhciB5ID0gMFxuICB2YXIgbGluZUhlaWdodCA9IG51bWJlcihvcHQubGluZUhlaWdodCwgZm9udC5jb21tb24ubGluZUhlaWdodClcbiAgdmFyIGJhc2VsaW5lID0gZm9udC5jb21tb24uYmFzZVxuICB2YXIgZGVzY2VuZGVyID0gbGluZUhlaWdodC1iYXNlbGluZVxuICB2YXIgbGV0dGVyU3BhY2luZyA9IG9wdC5sZXR0ZXJTcGFjaW5nIHx8IDBcbiAgdmFyIGhlaWdodCA9IGxpbmVIZWlnaHQgKiBsaW5lcy5sZW5ndGggLSBkZXNjZW5kZXJcbiAgdmFyIGFsaWduID0gZ2V0QWxpZ25UeXBlKHRoaXMuX29wdC5hbGlnbilcblxuICAvL2RyYXcgdGV4dCBhbG9uZyBiYXNlbGluZVxuICB5IC09IGhlaWdodFxuICBcbiAgLy90aGUgbWV0cmljcyBmb3IgdGhpcyB0ZXh0IGxheW91dFxuICB0aGlzLl93aWR0aCA9IG1heExpbmVXaWR0aFxuICB0aGlzLl9oZWlnaHQgPSBoZWlnaHRcbiAgdGhpcy5fZGVzY2VuZGVyID0gbGluZUhlaWdodCAtIGJhc2VsaW5lXG4gIHRoaXMuX2Jhc2VsaW5lID0gYmFzZWxpbmVcbiAgdGhpcy5feEhlaWdodCA9IGdldFhIZWlnaHQoZm9udClcbiAgdGhpcy5fY2FwSGVpZ2h0ID0gZ2V0Q2FwSGVpZ2h0KGZvbnQpXG4gIHRoaXMuX2xpbmVIZWlnaHQgPSBsaW5lSGVpZ2h0XG4gIHRoaXMuX2FzY2VuZGVyID0gbGluZUhlaWdodCAtIGRlc2NlbmRlciAtIHRoaXMuX3hIZWlnaHRcbiAgICBcbiAgLy9sYXlvdXQgZWFjaCBnbHlwaFxuICB2YXIgc2VsZiA9IHRoaXNcbiAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBsaW5lSW5kZXgpIHtcbiAgICB2YXIgc3RhcnQgPSBsaW5lLnN0YXJ0XG4gICAgdmFyIGVuZCA9IGxpbmUuZW5kXG4gICAgdmFyIGxpbmVXaWR0aCA9IGxpbmUud2lkdGhcbiAgICB2YXIgbGFzdEdseXBoXG4gICAgXG4gICAgLy9mb3IgZWFjaCBnbHlwaCBpbiB0aGF0IGxpbmUuLi5cbiAgICBmb3IgKHZhciBpPXN0YXJ0OyBpPGVuZDsgaSsrKSB7XG4gICAgICB2YXIgaWQgPSB0ZXh0LmNoYXJDb2RlQXQoaSlcbiAgICAgIHZhciBnbHlwaCA9IHNlbGYuZ2V0R2x5cGgoZm9udCwgaWQpXG4gICAgICBpZiAoZ2x5cGgpIHtcbiAgICAgICAgaWYgKGxhc3RHbHlwaCkgXG4gICAgICAgICAgeCArPSBnZXRLZXJuaW5nKGZvbnQsIGxhc3RHbHlwaC5pZCwgZ2x5cGguaWQpXG5cbiAgICAgICAgdmFyIHR4ID0geFxuICAgICAgICBpZiAoYWxpZ24gPT09IEFMSUdOX0NFTlRFUikgXG4gICAgICAgICAgdHggKz0gKG1heExpbmVXaWR0aC1saW5lV2lkdGgpLzJcbiAgICAgICAgZWxzZSBpZiAoYWxpZ24gPT09IEFMSUdOX1JJR0hUKVxuICAgICAgICAgIHR4ICs9IChtYXhMaW5lV2lkdGgtbGluZVdpZHRoKVxuXG4gICAgICAgIGdseXBocy5wdXNoKHtcbiAgICAgICAgICBwb3NpdGlvbjogW3R4LCB5XSxcbiAgICAgICAgICBkYXRhOiBnbHlwaCxcbiAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICBsaW5lOiBsaW5lSW5kZXhcbiAgICAgICAgfSkgIFxuXG4gICAgICAgIC8vbW92ZSBwZW4gZm9yd2FyZFxuICAgICAgICB4ICs9IGdseXBoLnhhZHZhbmNlICsgbGV0dGVyU3BhY2luZ1xuICAgICAgICBsYXN0R2x5cGggPSBnbHlwaFxuICAgICAgfVxuICAgIH1cblxuICAgIC8vbmV4dCBsaW5lIGRvd25cbiAgICB5ICs9IGxpbmVIZWlnaHRcbiAgICB4ID0gMFxuICB9KVxuICB0aGlzLl9saW5lc1RvdGFsID0gbGluZXMubGVuZ3RoO1xufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5fc2V0dXBTcGFjZUdseXBocyA9IGZ1bmN0aW9uKGZvbnQpIHtcbiAgLy9UaGVzZSBhcmUgZmFsbGJhY2tzLCB3aGVuIHRoZSBmb250IGRvZXNuJ3QgaW5jbHVkZVxuICAvLycgJyBvciAnXFx0JyBnbHlwaHNcbiAgdGhpcy5fZmFsbGJhY2tTcGFjZUdseXBoID0gbnVsbFxuICB0aGlzLl9mYWxsYmFja1RhYkdseXBoID0gbnVsbFxuXG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm5cblxuICAvL3RyeSB0byBnZXQgc3BhY2UgZ2x5cGhcbiAgLy90aGVuIGZhbGwgYmFjayB0byB0aGUgJ20nIG9yICd3JyBnbHlwaHNcbiAgLy90aGVuIGZhbGwgYmFjayB0byB0aGUgZmlyc3QgZ2x5cGggYXZhaWxhYmxlXG4gIHZhciBzcGFjZSA9IGdldEdseXBoQnlJZChmb250LCBTUEFDRV9JRCkgXG4gICAgICAgICAgfHwgZ2V0TUdseXBoKGZvbnQpIFxuICAgICAgICAgIHx8IGZvbnQuY2hhcnNbMF1cblxuICAvL2FuZCBjcmVhdGUgYSBmYWxsYmFjayBmb3IgdGFiXG4gIHZhciB0YWJXaWR0aCA9IHRoaXMuX29wdC50YWJTaXplICogc3BhY2UueGFkdmFuY2VcbiAgdGhpcy5fZmFsbGJhY2tTcGFjZUdseXBoID0gc3BhY2VcbiAgdGhpcy5fZmFsbGJhY2tUYWJHbHlwaCA9IHh0ZW5kKHNwYWNlLCB7XG4gICAgeDogMCwgeTogMCwgeGFkdmFuY2U6IHRhYldpZHRoLCBpZDogVEFCX0lELCBcbiAgICB4b2Zmc2V0OiAwLCB5b2Zmc2V0OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwXG4gIH0pXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLmdldEdseXBoID0gZnVuY3Rpb24oZm9udCwgaWQpIHtcbiAgdmFyIGdseXBoID0gZ2V0R2x5cGhCeUlkKGZvbnQsIGlkKVxuICBpZiAoZ2x5cGgpXG4gICAgcmV0dXJuIGdseXBoXG4gIGVsc2UgaWYgKGlkID09PSBUQUJfSUQpIFxuICAgIHJldHVybiB0aGlzLl9mYWxsYmFja1RhYkdseXBoXG4gIGVsc2UgaWYgKGlkID09PSBTUEFDRV9JRCkgXG4gICAgcmV0dXJuIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaFxuICByZXR1cm4gbnVsbFxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5jb21wdXRlTWV0cmljcyA9IGZ1bmN0aW9uKHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gIHZhciBsZXR0ZXJTcGFjaW5nID0gdGhpcy5fb3B0LmxldHRlclNwYWNpbmcgfHwgMFxuICB2YXIgZm9udCA9IHRoaXMuX29wdC5mb250XG4gIHZhciBjdXJQZW4gPSAwXG4gIHZhciBjdXJXaWR0aCA9IDBcbiAgdmFyIGNvdW50ID0gMFxuICB2YXIgZ2x5cGhcbiAgdmFyIGxhc3RHbHlwaFxuXG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdGFydDogc3RhcnQsXG4gICAgICBlbmQ6IHN0YXJ0LFxuICAgICAgd2lkdGg6IDBcbiAgICB9XG4gIH1cblxuICBlbmQgPSBNYXRoLm1pbih0ZXh0Lmxlbmd0aCwgZW5kKVxuICBmb3IgKHZhciBpPXN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB2YXIgaWQgPSB0ZXh0LmNoYXJDb2RlQXQoaSlcbiAgICB2YXIgZ2x5cGggPSB0aGlzLmdldEdseXBoKGZvbnQsIGlkKVxuXG4gICAgaWYgKGdseXBoKSB7XG4gICAgICAvL21vdmUgcGVuIGZvcndhcmRcbiAgICAgIHZhciB4b2ZmID0gZ2x5cGgueG9mZnNldFxuICAgICAgdmFyIGtlcm4gPSBsYXN0R2x5cGggPyBnZXRLZXJuaW5nKGZvbnQsIGxhc3RHbHlwaC5pZCwgZ2x5cGguaWQpIDogMFxuICAgICAgY3VyUGVuICs9IGtlcm5cblxuICAgICAgdmFyIG5leHRQZW4gPSBjdXJQZW4gKyBnbHlwaC54YWR2YW5jZSArIGxldHRlclNwYWNpbmdcbiAgICAgIHZhciBuZXh0V2lkdGggPSBjdXJQZW4gKyBnbHlwaC53aWR0aFxuXG4gICAgICAvL3dlJ3ZlIGhpdCBvdXIgbGltaXQ7IHdlIGNhbid0IG1vdmUgb250byB0aGUgbmV4dCBnbHlwaFxuICAgICAgaWYgKG5leHRXaWR0aCA+PSB3aWR0aCB8fCBuZXh0UGVuID49IHdpZHRoKVxuICAgICAgICBicmVha1xuXG4gICAgICAvL290aGVyd2lzZSBjb250aW51ZSBhbG9uZyBvdXIgbGluZVxuICAgICAgY3VyUGVuID0gbmV4dFBlblxuICAgICAgY3VyV2lkdGggPSBuZXh0V2lkdGhcbiAgICAgIGxhc3RHbHlwaCA9IGdseXBoXG4gICAgfVxuICAgIGNvdW50KytcbiAgfVxuICBcbiAgLy9tYWtlIHN1cmUgcmlnaHRtb3N0IGVkZ2UgbGluZXMgdXAgd2l0aCByZW5kZXJlZCBnbHlwaHNcbiAgaWYgKGxhc3RHbHlwaClcbiAgICBjdXJXaWR0aCArPSBsYXN0R2x5cGgueG9mZnNldFxuXG4gIHJldHVybiB7XG4gICAgc3RhcnQ6IHN0YXJ0LFxuICAgIGVuZDogc3RhcnQgKyBjb3VudCxcbiAgICB3aWR0aDogY3VyV2lkdGhcbiAgfVxufVxuXG4vL2dldHRlcnMgZm9yIHRoZSBwcml2YXRlIHZhcnNcbjtbJ3dpZHRoJywgJ2hlaWdodCcsIFxuICAnZGVzY2VuZGVyJywgJ2FzY2VuZGVyJyxcbiAgJ3hIZWlnaHQnLCAnYmFzZWxpbmUnLFxuICAnY2FwSGVpZ2h0JyxcbiAgJ2xpbmVIZWlnaHQnIF0uZm9yRWFjaChhZGRHZXR0ZXIpXG5cbmZ1bmN0aW9uIGFkZEdldHRlcihuYW1lKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUZXh0TGF5b3V0LnByb3RvdHlwZSwgbmFtZSwge1xuICAgIGdldDogd3JhcHBlcihuYW1lKSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcbn1cblxuLy9jcmVhdGUgbG9va3VwcyBmb3IgcHJpdmF0ZSB2YXJzXG5mdW5jdGlvbiB3cmFwcGVyKG5hbWUpIHtcbiAgcmV0dXJuIChuZXcgRnVuY3Rpb24oW1xuICAgICdyZXR1cm4gZnVuY3Rpb24gJytuYW1lKycoKSB7JyxcbiAgICAnICByZXR1cm4gdGhpcy5fJytuYW1lLFxuICAgICd9J1xuICBdLmpvaW4oJ1xcbicpKSkoKVxufVxuXG5mdW5jdGlvbiBnZXRHbHlwaEJ5SWQoZm9udCwgaWQpIHtcbiAgaWYgKCFmb250LmNoYXJzIHx8IGZvbnQuY2hhcnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBudWxsXG5cbiAgdmFyIGdseXBoSWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gIGlmIChnbHlwaElkeCA+PSAwKVxuICAgIHJldHVybiBmb250LmNoYXJzW2dseXBoSWR4XVxuICByZXR1cm4gbnVsbFxufVxuXG5mdW5jdGlvbiBnZXRYSGVpZ2h0KGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPFhfSEVJR0hUUy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZCA9IFhfSEVJR0hUU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdLmhlaWdodFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldE1HbHlwaChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxNX1dJRFRIUy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZCA9IE1fV0lEVEhTW2ldLmNoYXJDb2RlQXQoMClcbiAgICB2YXIgaWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gICAgaWYgKGlkeCA+PSAwKSBcbiAgICAgIHJldHVybiBmb250LmNoYXJzW2lkeF1cbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRDYXBIZWlnaHQoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8Q0FQX0hFSUdIVFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBDQVBfSEVJR0hUU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdLmhlaWdodFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldEtlcm5pbmcoZm9udCwgbGVmdCwgcmlnaHQpIHtcbiAgaWYgKCFmb250Lmtlcm5pbmdzIHx8IGZvbnQua2VybmluZ3MubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiAwXG5cbiAgdmFyIHRhYmxlID0gZm9udC5rZXJuaW5nc1xuICBmb3IgKHZhciBpPTA7IGk8dGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2VybiA9IHRhYmxlW2ldXG4gICAgaWYgKGtlcm4uZmlyc3QgPT09IGxlZnQgJiYga2Vybi5zZWNvbmQgPT09IHJpZ2h0KVxuICAgICAgcmV0dXJuIGtlcm4uYW1vdW50XG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0QWxpZ25UeXBlKGFsaWduKSB7XG4gIGlmIChhbGlnbiA9PT0gJ2NlbnRlcicpXG4gICAgcmV0dXJuIEFMSUdOX0NFTlRFUlxuICBlbHNlIGlmIChhbGlnbiA9PT0gJ3JpZ2h0JylcbiAgICByZXR1cm4gQUxJR05fUklHSFRcbiAgcmV0dXJuIEFMSUdOX0xFRlRcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG51bXR5cGUobnVtLCBkZWYpIHtcblx0cmV0dXJuIHR5cGVvZiBudW0gPT09ICdudW1iZXInXG5cdFx0PyBudW0gXG5cdFx0OiAodHlwZW9mIGRlZiA9PT0gJ251bWJlcicgPyBkZWYgOiAwKVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcGlsZShwcm9wZXJ0eSkge1xuXHRpZiAoIXByb3BlcnR5IHx8IHR5cGVvZiBwcm9wZXJ0eSAhPT0gJ3N0cmluZycpXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdtdXN0IHNwZWNpZnkgcHJvcGVydHkgZm9yIGluZGV4b2Ygc2VhcmNoJylcblxuXHRyZXR1cm4gbmV3IEZ1bmN0aW9uKCdhcnJheScsICd2YWx1ZScsICdzdGFydCcsIFtcblx0XHQnc3RhcnQgPSBzdGFydCB8fCAwJyxcblx0XHQnZm9yICh2YXIgaT1zdGFydDsgaTxhcnJheS5sZW5ndGg7IGkrKyknLFxuXHRcdCcgIGlmIChhcnJheVtpXVtcIicgKyBwcm9wZXJ0eSArJ1wiXSA9PT0gdmFsdWUpJyxcblx0XHQnICAgICAgcmV0dXJuIGknLFxuXHRcdCdyZXR1cm4gLTEnXG5cdF0uam9pbignXFxuJykpXG59IiwidmFyIG5ld2xpbmUgPSAvXFxuL1xudmFyIG5ld2xpbmVDaGFyID0gJ1xcbidcbnZhciB3aGl0ZXNwYWNlID0gL1xccy9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZXh0LCBvcHQpIHtcbiAgICB2YXIgbGluZXMgPSBtb2R1bGUuZXhwb3J0cy5saW5lcyh0ZXh0LCBvcHQpXG4gICAgcmV0dXJuIGxpbmVzLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnN1YnN0cmluZyhsaW5lLnN0YXJ0LCBsaW5lLmVuZClcbiAgICB9KS5qb2luKCdcXG4nKVxufVxuXG5tb2R1bGUuZXhwb3J0cy5saW5lcyA9IGZ1bmN0aW9uIHdvcmR3cmFwKHRleHQsIG9wdCkge1xuICAgIG9wdCA9IG9wdHx8e31cblxuICAgIC8vemVybyB3aWR0aCByZXN1bHRzIGluIG5vdGhpbmcgdmlzaWJsZVxuICAgIGlmIChvcHQud2lkdGggPT09IDAgJiYgb3B0Lm1vZGUgIT09ICdub3dyYXAnKSBcbiAgICAgICAgcmV0dXJuIFtdXG5cbiAgICB0ZXh0ID0gdGV4dHx8JydcbiAgICB2YXIgd2lkdGggPSB0eXBlb2Ygb3B0LndpZHRoID09PSAnbnVtYmVyJyA/IG9wdC53aWR0aCA6IE51bWJlci5NQVhfVkFMVUVcbiAgICB2YXIgc3RhcnQgPSBNYXRoLm1heCgwLCBvcHQuc3RhcnR8fDApXG4gICAgdmFyIGVuZCA9IHR5cGVvZiBvcHQuZW5kID09PSAnbnVtYmVyJyA/IG9wdC5lbmQgOiB0ZXh0Lmxlbmd0aFxuICAgIHZhciBtb2RlID0gb3B0Lm1vZGVcblxuICAgIHZhciBtZWFzdXJlID0gb3B0Lm1lYXN1cmUgfHwgbW9ub3NwYWNlXG4gICAgaWYgKG1vZGUgPT09ICdwcmUnKVxuICAgICAgICByZXR1cm4gcHJlKG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKVxuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGdyZWVkeShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCwgbW9kZSlcbn1cblxuZnVuY3Rpb24gaWR4T2YodGV4dCwgY2hyLCBzdGFydCwgZW5kKSB7XG4gICAgdmFyIGlkeCA9IHRleHQuaW5kZXhPZihjaHIsIHN0YXJ0KVxuICAgIGlmIChpZHggPT09IC0xIHx8IGlkeCA+IGVuZClcbiAgICAgICAgcmV0dXJuIGVuZFxuICAgIHJldHVybiBpZHhcbn1cblxuZnVuY3Rpb24gaXNXaGl0ZXNwYWNlKGNocikge1xuICAgIHJldHVybiB3aGl0ZXNwYWNlLnRlc3QoY2hyKVxufVxuXG5mdW5jdGlvbiBwcmUobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpIHtcbiAgICB2YXIgbGluZXMgPSBbXVxuICAgIHZhciBsaW5lU3RhcnQgPSBzdGFydFxuICAgIGZvciAodmFyIGk9c3RhcnQ7IGk8ZW5kICYmIGk8dGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hyID0gdGV4dC5jaGFyQXQoaSlcbiAgICAgICAgdmFyIGlzTmV3bGluZSA9IG5ld2xpbmUudGVzdChjaHIpXG5cbiAgICAgICAgLy9JZiB3ZSd2ZSByZWFjaGVkIGEgbmV3bGluZSwgdGhlbiBzdGVwIGRvd24gYSBsaW5lXG4gICAgICAgIC8vT3IgaWYgd2UndmUgcmVhY2hlZCB0aGUgRU9GXG4gICAgICAgIGlmIChpc05ld2xpbmUgfHwgaT09PWVuZC0xKSB7XG4gICAgICAgICAgICB2YXIgbGluZUVuZCA9IGlzTmV3bGluZSA/IGkgOiBpKzFcbiAgICAgICAgICAgIHZhciBtZWFzdXJlZCA9IG1lYXN1cmUodGV4dCwgbGluZVN0YXJ0LCBsaW5lRW5kLCB3aWR0aClcbiAgICAgICAgICAgIGxpbmVzLnB1c2gobWVhc3VyZWQpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxpbmVTdGFydCA9IGkrMVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsaW5lc1xufVxuXG5mdW5jdGlvbiBncmVlZHkobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgsIG1vZGUpIHtcbiAgICAvL0EgZ3JlZWR5IHdvcmQgd3JhcHBlciBiYXNlZCBvbiBMaWJHRFggYWxnb3JpdGhtXG4gICAgLy9odHRwczovL2dpdGh1Yi5jb20vbGliZ2R4L2xpYmdkeC9ibG9iL21hc3Rlci9nZHgvc3JjL2NvbS9iYWRsb2dpYy9nZHgvZ3JhcGhpY3MvZzJkL0JpdG1hcEZvbnRDYWNoZS5qYXZhXG4gICAgdmFyIGxpbmVzID0gW11cblxuICAgIHZhciB0ZXN0V2lkdGggPSB3aWR0aFxuICAgIC8vaWYgJ25vd3JhcCcgaXMgc3BlY2lmaWVkLCB3ZSBvbmx5IHdyYXAgb24gbmV3bGluZSBjaGFyc1xuICAgIGlmIChtb2RlID09PSAnbm93cmFwJylcbiAgICAgICAgdGVzdFdpZHRoID0gTnVtYmVyLk1BWF9WQUxVRVxuXG4gICAgd2hpbGUgKHN0YXJ0IDwgZW5kICYmIHN0YXJ0IDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgICAgLy9nZXQgbmV4dCBuZXdsaW5lIHBvc2l0aW9uXG4gICAgICAgIHZhciBuZXdMaW5lID0gaWR4T2YodGV4dCwgbmV3bGluZUNoYXIsIHN0YXJ0LCBlbmQpXG5cbiAgICAgICAgLy9lYXQgd2hpdGVzcGFjZSBhdCBzdGFydCBvZiBsaW5lXG4gICAgICAgIHdoaWxlIChzdGFydCA8IG5ld0xpbmUpIHtcbiAgICAgICAgICAgIGlmICghaXNXaGl0ZXNwYWNlKCB0ZXh0LmNoYXJBdChzdGFydCkgKSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgc3RhcnQrK1xuICAgICAgICB9XG5cbiAgICAgICAgLy9kZXRlcm1pbmUgdmlzaWJsZSAjIG9mIGdseXBocyBmb3IgdGhlIGF2YWlsYWJsZSB3aWR0aFxuICAgICAgICB2YXIgbWVhc3VyZWQgPSBtZWFzdXJlKHRleHQsIHN0YXJ0LCBuZXdMaW5lLCB0ZXN0V2lkdGgpXG5cbiAgICAgICAgdmFyIGxpbmVFbmQgPSBzdGFydCArIChtZWFzdXJlZC5lbmQtbWVhc3VyZWQuc3RhcnQpXG4gICAgICAgIHZhciBuZXh0U3RhcnQgPSBsaW5lRW5kICsgbmV3bGluZUNoYXIubGVuZ3RoXG5cbiAgICAgICAgLy9pZiB3ZSBoYWQgdG8gY3V0IHRoZSBsaW5lIGJlZm9yZSB0aGUgbmV4dCBuZXdsaW5lLi4uXG4gICAgICAgIGlmIChsaW5lRW5kIDwgbmV3TGluZSkge1xuICAgICAgICAgICAgLy9maW5kIGNoYXIgdG8gYnJlYWsgb25cbiAgICAgICAgICAgIHdoaWxlIChsaW5lRW5kID4gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKHRleHQuY2hhckF0KGxpbmVFbmQpKSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBsaW5lRW5kLS1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsaW5lRW5kID09PSBzdGFydCkge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0U3RhcnQgPiBzdGFydCArIG5ld2xpbmVDaGFyLmxlbmd0aCkgbmV4dFN0YXJ0LS1cbiAgICAgICAgICAgICAgICBsaW5lRW5kID0gbmV4dFN0YXJ0IC8vIElmIG5vIGNoYXJhY3RlcnMgdG8gYnJlYWssIHNob3cgYWxsLlxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXh0U3RhcnQgPSBsaW5lRW5kXG4gICAgICAgICAgICAgICAgLy9lYXQgd2hpdGVzcGFjZSBhdCBlbmQgb2YgbGluZVxuICAgICAgICAgICAgICAgIHdoaWxlIChsaW5lRW5kID4gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1doaXRlc3BhY2UodGV4dC5jaGFyQXQobGluZUVuZCAtIG5ld2xpbmVDaGFyLmxlbmd0aCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgbGluZUVuZC0tXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsaW5lRW5kID49IHN0YXJ0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbWVhc3VyZSh0ZXh0LCBzdGFydCwgbGluZUVuZCwgdGVzdFdpZHRoKVxuICAgICAgICAgICAgbGluZXMucHVzaChyZXN1bHQpXG4gICAgICAgIH1cbiAgICAgICAgc3RhcnQgPSBuZXh0U3RhcnRcbiAgICB9XG4gICAgcmV0dXJuIGxpbmVzXG59XG5cbi8vZGV0ZXJtaW5lcyB0aGUgdmlzaWJsZSBudW1iZXIgb2YgZ2x5cGhzIHdpdGhpbiBhIGdpdmVuIHdpZHRoXG5mdW5jdGlvbiBtb25vc3BhY2UodGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpIHtcbiAgICB2YXIgZ2x5cGhzID0gTWF0aC5taW4od2lkdGgsIGVuZC1zdGFydClcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgIGVuZDogc3RhcnQrZ2x5cGhzXG4gICAgfVxufSIsInZhciBkdHlwZSA9IHJlcXVpcmUoJ2R0eXBlJylcbnZhciBhbkFycmF5ID0gcmVxdWlyZSgnYW4tYXJyYXknKVxudmFyIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJylcblxudmFyIENXID0gWzAsIDIsIDNdXG52YXIgQ0NXID0gWzIsIDEsIDNdXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUXVhZEVsZW1lbnRzKGFycmF5LCBvcHQpIHtcbiAgICAvL2lmIHVzZXIgZGlkbid0IHNwZWNpZnkgYW4gb3V0cHV0IGFycmF5XG4gICAgaWYgKCFhcnJheSB8fCAhKGFuQXJyYXkoYXJyYXkpIHx8IGlzQnVmZmVyKGFycmF5KSkpIHtcbiAgICAgICAgb3B0ID0gYXJyYXkgfHwge31cbiAgICAgICAgYXJyYXkgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHQgPT09ICdudW1iZXInKSAvL2JhY2t3YXJkcy1jb21wYXRpYmxlXG4gICAgICAgIG9wdCA9IHsgY291bnQ6IG9wdCB9XG4gICAgZWxzZVxuICAgICAgICBvcHQgPSBvcHQgfHwge31cblxuICAgIHZhciB0eXBlID0gdHlwZW9mIG9wdC50eXBlID09PSAnc3RyaW5nJyA/IG9wdC50eXBlIDogJ3VpbnQxNidcbiAgICB2YXIgY291bnQgPSB0eXBlb2Ygb3B0LmNvdW50ID09PSAnbnVtYmVyJyA/IG9wdC5jb3VudCA6IDFcbiAgICB2YXIgc3RhcnQgPSAob3B0LnN0YXJ0IHx8IDApIFxuXG4gICAgdmFyIGRpciA9IG9wdC5jbG9ja3dpc2UgIT09IGZhbHNlID8gQ1cgOiBDQ1csXG4gICAgICAgIGEgPSBkaXJbMF0sIFxuICAgICAgICBiID0gZGlyWzFdLFxuICAgICAgICBjID0gZGlyWzJdXG5cbiAgICB2YXIgbnVtSW5kaWNlcyA9IGNvdW50ICogNlxuXG4gICAgdmFyIGluZGljZXMgPSBhcnJheSB8fCBuZXcgKGR0eXBlKHR5cGUpKShudW1JbmRpY2VzKVxuICAgIGZvciAodmFyIGkgPSAwLCBqID0gMDsgaSA8IG51bUluZGljZXM7IGkgKz0gNiwgaiArPSA0KSB7XG4gICAgICAgIHZhciB4ID0gaSArIHN0YXJ0XG4gICAgICAgIGluZGljZXNbeCArIDBdID0gaiArIDBcbiAgICAgICAgaW5kaWNlc1t4ICsgMV0gPSBqICsgMVxuICAgICAgICBpbmRpY2VzW3ggKyAyXSA9IGogKyAyXG4gICAgICAgIGluZGljZXNbeCArIDNdID0gaiArIGFcbiAgICAgICAgaW5kaWNlc1t4ICsgNF0gPSBqICsgYlxuICAgICAgICBpbmRpY2VzW3ggKyA1XSA9IGogKyBjXG4gICAgfVxuICAgIHJldHVybiBpbmRpY2VzXG59IiwidmFyIHN0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcblxubW9kdWxlLmV4cG9ydHMgPSBhbkFycmF5XG5cbmZ1bmN0aW9uIGFuQXJyYXkoYXJyKSB7XG4gIHJldHVybiAoXG4gICAgICAgYXJyLkJZVEVTX1BFUl9FTEVNRU5UXG4gICAgJiYgc3RyLmNhbGwoYXJyLmJ1ZmZlcikgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSdcbiAgICB8fCBBcnJheS5pc0FycmF5KGFycilcbiAgKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkdHlwZSkge1xuICBzd2l0Y2ggKGR0eXBlKSB7XG4gICAgY2FzZSAnaW50OCc6XG4gICAgICByZXR1cm4gSW50OEFycmF5XG4gICAgY2FzZSAnaW50MTYnOlxuICAgICAgcmV0dXJuIEludDE2QXJyYXlcbiAgICBjYXNlICdpbnQzMic6XG4gICAgICByZXR1cm4gSW50MzJBcnJheVxuICAgIGNhc2UgJ3VpbnQ4JzpcbiAgICAgIHJldHVybiBVaW50OEFycmF5XG4gICAgY2FzZSAndWludDE2JzpcbiAgICAgIHJldHVybiBVaW50MTZBcnJheVxuICAgIGNhc2UgJ3VpbnQzMic6XG4gICAgICByZXR1cm4gVWludDMyQXJyYXlcbiAgICBjYXNlICdmbG9hdDMyJzpcbiAgICAgIHJldHVybiBGbG9hdDMyQXJyYXlcbiAgICBjYXNlICdmbG9hdDY0JzpcbiAgICAgIHJldHVybiBGbG9hdDY0QXJyYXlcbiAgICBjYXNlICdhcnJheSc6XG4gICAgICByZXR1cm4gQXJyYXlcbiAgICBjYXNlICd1aW50OF9jbGFtcGVkJzpcbiAgICAgIHJldHVybiBVaW50OENsYW1wZWRBcnJheVxuICB9XG59XG4iLCIvKiFcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG4vLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG4vLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCJ2YXIgZmxhdHRlbiA9IHJlcXVpcmUoJ2ZsYXR0ZW4tdmVydGV4LWRhdGEnKVxuXG5tb2R1bGUuZXhwb3J0cy5hdHRyID0gc2V0QXR0cmlidXRlXG5tb2R1bGUuZXhwb3J0cy5pbmRleCA9IHNldEluZGV4XG5cbmZ1bmN0aW9uIHNldEluZGV4IChnZW9tZXRyeSwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGlmICh0eXBlb2YgaXRlbVNpemUgIT09ICdudW1iZXInKSBpdGVtU2l6ZSA9IDFcbiAgaWYgKHR5cGVvZiBkdHlwZSAhPT0gJ3N0cmluZycpIGR0eXBlID0gJ3VpbnQxNidcblxuICB2YXIgaXNSNjkgPSAhZ2VvbWV0cnkuaW5kZXggJiYgdHlwZW9mIGdlb21ldHJ5LnNldEluZGV4ICE9PSAnZnVuY3Rpb24nXG4gIHZhciBhdHRyaWIgPSBpc1I2OSA/IGdlb21ldHJ5LmdldEF0dHJpYnV0ZSgnaW5kZXgnKSA6IGdlb21ldHJ5LmluZGV4XG4gIHZhciBuZXdBdHRyaWIgPSB1cGRhdGVBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpXG4gIGlmIChuZXdBdHRyaWIpIHtcbiAgICBpZiAoaXNSNjkpIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSgnaW5kZXgnLCBuZXdBdHRyaWIpXG4gICAgZWxzZSBnZW9tZXRyeS5pbmRleCA9IG5ld0F0dHJpYlxuICB9XG59XG5cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZSAoZ2VvbWV0cnksIGtleSwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGlmICh0eXBlb2YgaXRlbVNpemUgIT09ICdudW1iZXInKSBpdGVtU2l6ZSA9IDNcbiAgaWYgKHR5cGVvZiBkdHlwZSAhPT0gJ3N0cmluZycpIGR0eXBlID0gJ2Zsb2F0MzInXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmXG4gICAgQXJyYXkuaXNBcnJheShkYXRhWzBdKSAmJlxuICAgIGRhdGFbMF0ubGVuZ3RoICE9PSBpdGVtU2l6ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTmVzdGVkIHZlcnRleCBhcnJheSBoYXMgdW5leHBlY3RlZCBzaXplOyBleHBlY3RlZCAnICtcbiAgICAgIGl0ZW1TaXplICsgJyBidXQgZm91bmQgJyArIGRhdGFbMF0ubGVuZ3RoKVxuICB9XG5cbiAgdmFyIGF0dHJpYiA9IGdlb21ldHJ5LmdldEF0dHJpYnV0ZShrZXkpXG4gIHZhciBuZXdBdHRyaWIgPSB1cGRhdGVBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpXG4gIGlmIChuZXdBdHRyaWIpIHtcbiAgICBnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoa2V5LCBuZXdBdHRyaWIpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQXR0cmlidXRlIChhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBkYXRhID0gZGF0YSB8fCBbXVxuICBpZiAoIWF0dHJpYiB8fCByZWJ1aWxkQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUpKSB7XG4gICAgLy8gY3JlYXRlIGEgbmV3IGFycmF5IHdpdGggZGVzaXJlZCB0eXBlXG4gICAgZGF0YSA9IGZsYXR0ZW4oZGF0YSwgZHR5cGUpXG4gICAgYXR0cmliID0gbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShkYXRhLCBpdGVtU2l6ZSlcbiAgICBhdHRyaWIubmVlZHNVcGRhdGUgPSB0cnVlXG4gICAgcmV0dXJuIGF0dHJpYlxuICB9IGVsc2Uge1xuICAgIC8vIGNvcHkgZGF0YSBpbnRvIHRoZSBleGlzdGluZyBhcnJheVxuICAgIGZsYXR0ZW4oZGF0YSwgYXR0cmliLmFycmF5KVxuICAgIGF0dHJpYi5uZWVkc1VwZGF0ZSA9IHRydWVcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbi8vIFRlc3Qgd2hldGhlciB0aGUgYXR0cmlidXRlIG5lZWRzIHRvIGJlIHJlLWNyZWF0ZWQsXG4vLyByZXR1cm5zIGZhbHNlIGlmIHdlIGNhbiByZS11c2UgaXQgYXMtaXMuXG5mdW5jdGlvbiByZWJ1aWxkQXR0cmlidXRlIChhdHRyaWIsIGRhdGEsIGl0ZW1TaXplKSB7XG4gIGlmIChhdHRyaWIuaXRlbVNpemUgIT09IGl0ZW1TaXplKSByZXR1cm4gdHJ1ZVxuICBpZiAoIWF0dHJpYi5hcnJheSkgcmV0dXJuIHRydWVcbiAgdmFyIGF0dHJpYkxlbmd0aCA9IGF0dHJpYi5hcnJheS5sZW5ndGhcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiYgQXJyYXkuaXNBcnJheShkYXRhWzBdKSkge1xuICAgIC8vIFsgWyB4LCB5LCB6IF0gXVxuICAgIHJldHVybiBhdHRyaWJMZW5ndGggIT09IGRhdGEubGVuZ3RoICogaXRlbVNpemVcbiAgfSBlbHNlIHtcbiAgICAvLyBbIHgsIHksIHogXVxuICAgIHJldHVybiBhdHRyaWJMZW5ndGggIT09IGRhdGEubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG4iLCIvKmVzbGludCBuZXctY2FwOjAqL1xudmFyIGR0eXBlID0gcmVxdWlyZSgnZHR5cGUnKVxubW9kdWxlLmV4cG9ydHMgPSBmbGF0dGVuVmVydGV4RGF0YVxuZnVuY3Rpb24gZmxhdHRlblZlcnRleERhdGEgKGRhdGEsIG91dHB1dCwgb2Zmc2V0KSB7XG4gIGlmICghZGF0YSkgdGhyb3cgbmV3IFR5cGVFcnJvcignbXVzdCBzcGVjaWZ5IGRhdGEgYXMgZmlyc3QgcGFyYW1ldGVyJylcbiAgb2Zmc2V0ID0gKyhvZmZzZXQgfHwgMCkgfCAwXG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiYgQXJyYXkuaXNBcnJheShkYXRhWzBdKSkge1xuICAgIHZhciBkaW0gPSBkYXRhWzBdLmxlbmd0aFxuICAgIHZhciBsZW5ndGggPSBkYXRhLmxlbmd0aCAqIGRpbVxuXG4gICAgLy8gbm8gb3V0cHV0IHNwZWNpZmllZCwgY3JlYXRlIGEgbmV3IHR5cGVkIGFycmF5XG4gICAgaWYgKCFvdXRwdXQgfHwgdHlwZW9mIG91dHB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG91dHB1dCA9IG5ldyAoZHR5cGUob3V0cHV0IHx8ICdmbG9hdDMyJykpKGxlbmd0aCArIG9mZnNldClcbiAgICB9XG5cbiAgICB2YXIgZHN0TGVuZ3RoID0gb3V0cHV0Lmxlbmd0aCAtIG9mZnNldFxuICAgIGlmIChsZW5ndGggIT09IGRzdExlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzb3VyY2UgbGVuZ3RoICcgKyBsZW5ndGggKyAnICgnICsgZGltICsgJ3gnICsgZGF0YS5sZW5ndGggKyAnKScgK1xuICAgICAgICAnIGRvZXMgbm90IG1hdGNoIGRlc3RpbmF0aW9uIGxlbmd0aCAnICsgZHN0TGVuZ3RoKVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwLCBrID0gb2Zmc2V0OyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBkaW07IGorKykge1xuICAgICAgICBvdXRwdXRbaysrXSA9IGRhdGFbaV1bal1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFvdXRwdXQgfHwgdHlwZW9mIG91dHB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIG5vIG91dHB1dCwgY3JlYXRlIGEgbmV3IG9uZVxuICAgICAgdmFyIEN0b3IgPSBkdHlwZShvdXRwdXQgfHwgJ2Zsb2F0MzInKVxuICAgICAgaWYgKG9mZnNldCA9PT0gMCkge1xuICAgICAgICBvdXRwdXQgPSBuZXcgQ3RvcihkYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ID0gbmV3IEN0b3IoZGF0YS5sZW5ndGggKyBvZmZzZXQpXG4gICAgICAgIG91dHB1dC5zZXQoZGF0YSwgb2Zmc2V0KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzdG9yZSBvdXRwdXQgaW4gZXhpc3RpbmcgYXJyYXlcbiAgICAgIG91dHB1dC5zZXQoZGF0YSwgb2Zmc2V0KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRwdXRcbn1cbiJdfQ==
