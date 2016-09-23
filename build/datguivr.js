(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCheckbox() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var textCreator = _ref.textCreator;
  var object = _ref.object;
  var _ref$propertyName = _ref.propertyName;
  var propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height;
  var _ref$depth = _ref.depth;
  var depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;


  var BUTTON_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var BUTTON_HEIGHT = height - Layout.PANEL_MARGIN;
  var BUTTON_DEPTH = depth;

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var rect = new THREE.BoxGeometry(BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_DEPTH);
  rect.translate(BUTTON_WIDTH * 0.5, 0, 0);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;

  //  outline volume
  var outline = new THREE.BoxHelper(hitscanVolume);
  outline.material.color.setHex(Colors.OUTLINE_COLOR);

  //  checkbox volume
  var material = new THREE.MeshPhongMaterial({ color: Colors.DEFAULT_COLOR, emissive: Colors.EMISSIVE_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  hitscanVolume.add(filledVolume);

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_BUTTON);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, hitscanVolume, outline, controllerID);

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);

  updateView();

  function handleOnPress() {
    if (group.visible === false) {
      return;
    }

    object[propertyName]();
  }

  function updateView() {

    if (interaction.hovering()) {
      material.color.setHex(Colors.HIGHLIGHT_COLOR);
      material.emissive.setHex(Colors.HIGHLIGHT_EMISSIVE_COLOR);
    } else {
      material.emissive.setHex(Colors.EMISSIVE_COLOR);

      if (state.value) {
        material.color.setHex(Colors.DEFAULT_COLOR);
      } else {
        material.color.setHex(Colors.INACTIVE_COLOR);
      }
    }
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.update = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  return group;
}

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":12,"./textlabel":14}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCheckbox() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var textCreator = _ref.textCreator;
  var object = _ref.object;
  var _ref$propertyName = _ref.propertyName;
  var propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName;
  var _ref$initialValue = _ref.initialValue;
  var initialValue = _ref$initialValue === undefined ? false : _ref$initialValue;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height;
  var _ref$depth = _ref.depth;
  var depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;


  var CHECKBOX_WIDTH = height - Layout.PANEL_MARGIN;
  var CHECKBOX_HEIGHT = CHECKBOX_WIDTH;
  var CHECKBOX_DEPTH = depth;

  var INACTIVE_SCALE = 0.001;
  var ACTIVE_SCALE = 0.9;

  var state = {
    value: initialValue,
    listen: false
  };

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var rect = new THREE.BoxGeometry(CHECKBOX_WIDTH, CHECKBOX_HEIGHT, CHECKBOX_DEPTH);
  rect.translate(CHECKBOX_WIDTH * 0.5, 0, 0);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;

  //  outline volume
  var outline = new THREE.BoxHelper(hitscanVolume);
  outline.material.color.setHex(Colors.OUTLINE_COLOR);

  //  checkbox volume
  var material = new THREE.MeshPhongMaterial({ color: Colors.DEFAULT_COLOR, emissive: Colors.EMISSIVE_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  filledVolume.scale.set(ACTIVE_SCALE, ACTIVE_SCALE, ACTIVE_SCALE);
  hitscanVolume.add(filledVolume);

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_CHECKBOX);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, hitscanVolume, outline, controllerID);

  // group.add( filledVolume, outline, hitscanVolume, descriptorLabel );

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);

  updateView();

  function handleOnPress() {
    if (group.visible === false) {
      return;
    }

    state.value = !state.value;

    object[propertyName] = state.value;

    if (onChangedCB) {
      onChangedCB(state.value);
    }
  }

  function updateView() {

    if (interaction.hovering()) {
      material.color.setHex(Colors.HIGHLIGHT_COLOR);
      material.emissive.setHex(Colors.HIGHLIGHT_EMISSIVE_COLOR);
    } else {
      material.emissive.setHex(Colors.EMISSIVE_COLOR);

      if (state.value) {
        material.color.setHex(Colors.DEFAULT_COLOR);
      } else {
        material.color.setHex(Colors.INACTIVE_COLOR);
      }
    }

    if (state.value) {
      filledVolume.scale.set(ACTIVE_SCALE, ACTIVE_SCALE, ACTIVE_SCALE);
    } else {
      filledVolume.scale.set(INACTIVE_SCALE, INACTIVE_SCALE, INACTIVE_SCALE);
    }
  }

  var onChangedCB = void 0;
  var onFinishChangeCB = void 0;

  group.onChange = function (callback) {
    onChangedCB = callback;
    return group;
  };

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.listen = function () {
    state.listen = true;
    return group;
  };

  group.update = function (inputObjects) {
    if (state.listen) {
      state.value = object[propertyName];
    }
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  return group;
}

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":12,"./textlabel":14}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorizeGeometry = colorizeGeometry;
var DEFAULT_COLOR = exports.DEFAULT_COLOR = 0x2FA1D6;
var HIGHLIGHT_COLOR = exports.HIGHLIGHT_COLOR = 0x0FC3FF;
var INTERACTION_COLOR = exports.INTERACTION_COLOR = 0x07ABF7;
var EMISSIVE_COLOR = exports.EMISSIVE_COLOR = 0x222222;
var HIGHLIGHT_EMISSIVE_COLOR = exports.HIGHLIGHT_EMISSIVE_COLOR = 0x999999;
var OUTLINE_COLOR = exports.OUTLINE_COLOR = 0x999999;
var DEFAULT_BACK = exports.DEFAULT_BACK = 0x131313;
var HIGHLIGHT_BACK = exports.HIGHLIGHT_BACK = 0x494949;
var INACTIVE_COLOR = exports.INACTIVE_COLOR = 0x161829;
var CONTROLLER_ID_SLIDER = exports.CONTROLLER_ID_SLIDER = 0x2fa1d6;
var CONTROLLER_ID_CHECKBOX = exports.CONTROLLER_ID_CHECKBOX = 0x806787;
var CONTROLLER_ID_BUTTON = exports.CONTROLLER_ID_BUTTON = 0xe61d5f;
var CONTROLLER_ID_TEXT = exports.CONTROLLER_ID_TEXT = 0x1ed36f;
var DROPDOWN_BG_COLOR = exports.DROPDOWN_BG_COLOR = 0xffffff;
var DROPDOWN_FG_COLOR = exports.DROPDOWN_FG_COLOR = 0x000000;

function colorizeGeometry(geometry, color) {
  geometry.faces.forEach(function (face) {
    face.color.setHex(color);
  });
  geometry.colorsNeedUpdate = true;
  return geometry;
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createCheckbox() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var textCreator = _ref.textCreator;
  var object = _ref.object;
  var _ref$propertyName = _ref.propertyName;
  var propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName;
  var _ref$initialValue = _ref.initialValue;
  var initialValue = _ref$initialValue === undefined ? false : _ref$initialValue;
  var _ref$options = _ref.options;
  var options = _ref$options === undefined ? [] : _ref$options;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height;
  var _ref$depth = _ref.depth;
  var depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;


  var state = {
    open: false,
    listen: false
  };

  var DROPDOWN_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var DROPDOWN_HEIGHT = height - Layout.PANEL_MARGIN;
  var DROPDOWN_DEPTH = depth;
  var DROPDOWN_OPTION_HEIGHT = height - Layout.PANEL_MARGIN * 1.8;
  var DROPDOWN_MARGIN = Layout.PANEL_MARGIN;

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  group.hitscan = [panel];

  var labelInteractions = [];
  var optionLabels = [];

  //  find actually which label is selected
  var initialLabel = findLabelFromProp();

  function findLabelFromProp() {
    if (Array.isArray(options)) {
      return options.find(function (optionName) {
        return optionName === object[propertyName];
      });
    } else {
      return Object.keys(options).find(function (optionName) {
        return object[propertyName] === options[optionName];
      });
    }
  }

  function createOption(labelText, isOption) {
    var label = (0, _textlabel2.default)(textCreator, labelText, DROPDOWN_WIDTH, depth, Colors.DROPDOWN_FG_COLOR, Colors.DROPDOWN_BG_COLOR);
    group.hitscan.push(label.back);
    var labelInteraction = (0, _interaction2.default)(label.back);
    labelInteractions.push(labelInteraction);
    optionLabels.push(label);

    if (isOption) {
      labelInteraction.events.on('onPressed', function () {
        selectedLabel.setString(labelText);

        var propertyChanged = false;

        if (Array.isArray(options)) {
          propertyChanged = object[propertyName] !== labelText;
          if (propertyChanged) {
            object[propertyName] = labelText;
          }
        } else {
          propertyChanged = object[propertyName] !== options[labelText];
          if (propertyChanged) {
            object[propertyName] = options[labelText];
          }
        }

        collapseOptions();
        state.open = false;

        if (onChangedCB && propertyChanged) {
          onChangedCB(object[propertyName]);
        }
      });
    } else {
      labelInteraction.events.on('onPressed', function () {
        if (state.open === false) {
          openOptions();
          state.open = true;
        } else {
          collapseOptions();
          state.open = false;
        }
      });
    }
    label.isOption = isOption;
    return label;
  }

  function collapseOptions() {
    optionLabels.forEach(function (label) {
      if (label.isOption) {
        label.visible = false;
        label.back.visible = false;
      }
    });
  }

  function openOptions() {
    optionLabels.forEach(function (label) {
      if (label.isOption) {
        label.visible = true;
        label.back.visible = true;
      }
    });
  }

  //  base option
  var selectedLabel = createOption(initialLabel, false);
  selectedLabel.position.x = Layout.PANEL_MARGIN * 2 + width * 0.5;
  selectedLabel.position.z = depth;

  selectedLabel.add(function createDownArrow() {
    var w = 0.015;
    var h = 0.03;
    var sh = new THREE.Shape();
    sh.moveTo(0, 0);
    sh.lineTo(-w, h);
    sh.lineTo(w, h);
    sh.lineTo(0, 0);

    var geo = new THREE.ShapeGeometry(sh);
    Colors.colorizeGeometry(geo, Colors.DROPDOWN_FG_COLOR);
    geo.translate(DROPDOWN_WIDTH - w * 4, -DROPDOWN_HEIGHT * 0.5 + h * 0.5, depth * 1.01);

    return new THREE.Mesh(geo, SharedMaterials.PANEL);
  }());

  function configureLabelPosition(label, index) {
    label.position.y = -DROPDOWN_MARGIN - (index + 1) * DROPDOWN_OPTION_HEIGHT;
    label.position.z = depth * 2;
  }

  function optionToLabel(optionName, index) {
    var optionLabel = createOption(optionName, true);
    configureLabelPosition(optionLabel, index);
    return optionLabel;
  }

  if (Array.isArray(options)) {
    selectedLabel.add.apply(selectedLabel, _toConsumableArray(options.map(optionToLabel)));
  } else {
    selectedLabel.add.apply(selectedLabel, _toConsumableArray(Object.keys(options).map(optionToLabel)));
  }

  collapseOptions();

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_SLIDER);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, controllerID, selectedLabel);

  updateView();

  function updateView() {

    labelInteractions.forEach(function (interaction, index) {
      var label = optionLabels[index];
      if (label.isOption) {
        if (interaction.hovering()) {
          Colors.colorizeGeometry(label.back.geometry, Colors.HIGHLIGHT_COLOR);
        } else {
          Colors.colorizeGeometry(label.back.geometry, Colors.DROPDOWN_BG_COLOR);
        }
      }
    });
  }

  var onChangedCB = void 0;
  var onFinishChangeCB = void 0;

  group.onChange = function (callback) {
    onChangedCB = callback;
    return group;
  };

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.listen = function () {
    state.listen = true;
    return group;
  };

  group.update = function (inputObjects) {
    if (state.listen) {
      selectedLabel.setString(findLabelFromProp());
    }
    labelInteractions.forEach(function (labelInteraction) {
      labelInteraction.update(inputObjects);
    });
    grabInteraction.update(inputObjects);
    updateView();
  };

  return group;
}

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":12,"./textlabel":14}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createFolder;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createFolder() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var textCreator = _ref.textCreator;
  var name = _ref.name;


  var width = Layout.PANEL_WIDTH;

  var spacingPerController = Layout.PANEL_HEIGHT + Layout.PANEL_SPACING;

  var state = {
    collapsed: false,
    previousParent: undefined
  };

  var group = new THREE.Group();
  var collapseGroup = new THREE.Group();
  group.add(collapseGroup);

  //  Yeah. Gross.
  var addOriginal = THREE.Group.prototype.add;
  addOriginal.call(group, collapseGroup);

  var descriptorLabel = (0, _textlabel2.default)(textCreator, '- ' + name, 0.6);
  descriptorLabel.position.y = Layout.PANEL_HEIGHT * 0.5;

  addOriginal.call(group, descriptorLabel);

  // const panel = new THREE.Mesh( new THREE.BoxGeometry( width, 1, Layout.PANEL_DEPTH ), SharedMaterials.FOLDER );
  // panel.geometry.translate( width * 0.5, 0, -Layout.PANEL_DEPTH );
  // addOriginal.call( group, panel );

  // const interactionVolume = new THREE.Mesh( new THREE.BoxGeometry( width, 1, Layout.PANEL_DEPTH ), new THREE.MeshBasicMaterial({color:0x000000}) );
  // interactionVolume.geometry.translate( width * 0.5 - Layout.PANEL_MARGIN, 0, -Layout.PANEL_DEPTH );
  // addOriginal.call( group, interactionVolume );
  // interactionVolume.visible = false;

  // const interaction = createInteraction( panel );
  // interaction.events.on( 'onPressed', handlePress );

  function handlePress() {
    state.collapsed = !state.collapsed;
    performLayout();
  }

  group.add = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    args.forEach(function (obj) {
      var container = new THREE.Group();
      container.add(obj);
      collapseGroup.add(container);
      obj.folder = group;
    });

    performLayout();
  };

  function performLayout() {
    collapseGroup.children.forEach(function (child, index) {
      child.position.y = -(index + 1) * spacingPerController + Layout.PANEL_HEIGHT * 0.5;
      if (state.collapsed) {
        child.children[0].visible = false;
      } else {
        child.children[0].visible = true;
      }
    });

    if (state.collapsed) {
      descriptorLabel.setString('+ ' + name);
    } else {
      descriptorLabel.setString('- ' + name);
    }

    // const totalHeight = collapseGroup.children.length * spacingPerController;
    // panel.geometry = new THREE.BoxGeometry( width, totalHeight, Layout.PANEL_DEPTH );
    // panel.geometry.translate( width * 0.5, -totalHeight * 0.5, -Layout.PANEL_DEPTH );
    // panel.geometry.computeBoundingBox();
  }

  function updateLabel() {
    // if( interaction.hovering() ){
    //   descriptorLabel.back.material.color.setHex( Colors.HIGHLIGHT_BACK );
    // }
    // else{
    // descriptorLabel.back.material.color.setHex( Colors.DEFAULT_BACK );
    // }
  }

  group.folder = group;
  var grabInteraction = Grab.create({ group: group, panel: descriptorLabel.back });

  group.update = function (inputObjects) {
    grabInteraction.update(inputObjects);
    updateLabel();
  };

  group.pinTo = function (newParent) {
    var oldParent = group.parent;

    if (group.parent) {
      group.parent.remove(group);
    }
    newParent.add(group);

    return oldParent;
  };

  group.hitscan = [descriptorLabel.back];

  return group;
}

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":12,"./textlabel":14}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.image = image;
exports.fnt = fnt;
function image() {
  var image = new Image();
  image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAEACAYAAADFkM5nAACAAElEQVR42uy9B3dcR7Im2Lt7ds/Mm9nZnmf6vbbqllot7yWKpOhACxIEQHiPgvfe+wOgCp7dPf84t6CX0fXVVxF581YVQE03eU4eSdSta9JEfBHxRcTPnHON+dGaHx350ZkwOvy1l7954f/Zkh/tKX77Kj/qEn7blh/N+VGfH7X58UV+3MiPu/nx2D/7lb+uKz96jdHlr3nlf/PY3+Pyft/lx+38eJAfT/07yT2786MvPzJ+9MG9GuGa/vwY8OPyuh7/nfjuD/PjTn58nx9f5cfH/lvu+P9X669tou/p9/fU7q89u9+/Z7ef08t3aMiP5/nxyH/3Tf8Of8qPz/Lj2/z4Ad6jwa9Jp3+WNqd4/5d+7i7n8D/y4/f58UF+fO7n945/9nPYZ9q9e/zftySsq/XsW/nxdX58kh9/zI/f+jn+Adb3hf++Zrh/D63zQGBOO/37N/n1eu73032/j7713/1RfryXH1/6ObiVYt9q33f5u5r8uOefk3Re+Yw+8b+9Cfvv8v1+kx//lh//nB//X3789/z4r/nx/+bHz/PjX/017/nffOXvcc/f80XEu7T7NW308/WNn497/rue05p0+jnQ9ke3IRuqOR+/yI9/gfmo5r1/lR+/9M/41zLufcfvA9zLr/xctMJo8X/3yl/zwv8GZQ3Od9KaXc7Hr/PjXb+3ZR/c999b589Eu1+jNLL4npeLX/p7v+vnqQXkXG/E0PZHo3+3ZySDUS48gblsoj2IMpjlcAbkgzy/S9FxT8v4FrkfflO7v6/IdPmuR34Ob/mz9dnP0v7xN+8hhWKNfn9tOynLmN+iAmsK/FYUriiEev9xt/0BkEMv7335m+H8GKEx7P+fvG+j/22NF9as/Jv8u8k9L+8x7seI/7tuvxDd/r9H82PCj7H8GFLeHUHADQ8+fqADKUq3F75n1D+b79+rPHvc///L9xwEwNKqgIDLd/jQH7rv/UF+Cu/R5ddgSJlTvH+nn7M6f5hFSIiyuOXn95l/B5m3jLJeQ/7vuxLWFZ/dDM+W7/rcA5B3/BzX0PqK4u1T5hnnmud0CPZvpyL0GQR8SILmceS+5bmt9+9e65/zIOK88hl94df+jgckn3kA+I4HSr8CxSeK/z/8ev4OwCICOgEyMe/SDcD5Jil/UYK4JkPKvAzDGvD5qtZ8/F6Zj2rd+z1/Nn7v5/TXZdxbMxY6FcXCyrAJ5BDKmj4F9Gpr9gv/zu8rRsNz/24d/tmDhszQZPFzf48fvHz/1D/jt/79+gMyaCRhfyCQZhnMcuEVzGUvyb4xRTaMwxgF+TCo6Li6Mr5Fvke+aQCARhcAnAYwQv4GAsoBAD3+5UdJAGpj1F/bAwp8IPK3qMDaA78d9x/fD4LwO7CiXvpN3O3f5fL66fyYoTHt/9+gv7bF//axn6z7ivLv9e8o95z3Y9q/ZwYWdBSuWciPWf/++O4ipJ75TSdKgpWu3HPYP3vK32+O7j8Oa4XPnvfXTvt3GAGFKiCgFt7hE28x34aD3OTfI+PvP6XM6Qx8Y6/fAw3++37rD/CnICREWTT7dxnw+4DvPQXzG1pXeXYfgboHYHWJJVHj3+ulf34HgKcRmud5mMsF+O85eL8xEDLdJPQFBNwCYcaCpjFi3+Lcdvj5bSFrJum88hlt8O9w38+RWFsfeG/JH/zaXVqn/+6V0zt+Dt8HsHgT9m2Dv3fMuwzA+WOPEMoQXJNpOseXY9KQDdWYj49pPn7ngUA17v2JHx/7uXzfz23ae2vGQkYBTKgMe0kONSuyJmnNfunnBI2GeyC/Wv07DkXK4h7/m3rwmIhh9IEHSX3+WyYNGTQT2B8MpFkGo1xgow/l7wzIX0s2zIJ80HRcY8pv4W/C+4oRisZdI4OAcgCACOUZ+EhrzPhrBwKK0BqzpJCt3875yUIlcwM2XYOf3D7/+8t3WsqPFRpL/v+NgsKQA3oPXLKs/Cf8u17+fs2PRb8YQyDAJ/37Xv7/jfxYhncfASGluavx2TKPsknm/LNX/b3X/f2X/FyNKM9e9/++5OcSFWoXgB85cKKk7/h3qfPXyEGe8vfnOZVvHIc90OQ34Tvg/r8BruJ6v4a9/t2n/XzifRdgfq11lWdP+Pnv8nP7giwJCQM8BeUvFg8KqTm4P86zzKfM6bJ/31mY10HF8kOX5leKoGmnfW993zhYE31KWCDpvPIZlfUR8PeNf7/P/T740M+XWMDveqv1I2/xfQFgsYbAYuhdEDj3+zNWo3iE5B6yJot+LnBeZA002VCt+fgC5uN9Px/VuLeMr70C/czPbdp7s7Ege3lSAUyiDIfIGOnwe2oYZE3Smv3G749PyBMr1r8YDWMgN0OyWO77CowSCeFJyGTQn/N55V6aTJL9MU9GEH67yGCWCyL3xTDBPbgKskCTDav+uiVDxzWn/Bbrm+YARI2AEdLGIKAcACACf5E+lMc6KcIeQxFaAxVYb+C3q/6Dx2CziKv6mf/gDj8J436CLt9th8a6/3/j/toO/9tnYPWKS5aV/7J/l9382Pb/Pe0PDirJy2/ayo+9/Nj07z4PIKCP3EHirn4GVlQvHMh5f49N/w2X9933/77iD9EIPXvfX7fr/3sNFOoIHTgRTp+BV+WJPxCtoKRn/PO2aU43FTAkSphjhA/A7d0BQmLOf6Pcc5u+zVrXTdhDogBaAdjc9d/0uVdgCO5E6CG4k3nehnm+HIfw77L+G/4dF/17jhMIQJemuH81QYMWn/Z9iyTAR5WwQOi8ame0xe+9R+ACvelB2jde8X0CFvCHfn985UHi915Ai0dHA4vau8g+nATAJmCTPUICCnFNcH9sBWRDNebjljEfldz7Bxq3/Fx+64FA2ns3K8bCrAGYBLCyMdIDck7OYdKavUO8Hs0TO+R/s+jvo8livG83hfA4ZDLs98SyX/udwMD9gUbQJMm/Ji8T6gJyYRHmRPagyIIDP/ZB5vLzWce1pvwWuZ+MTT93q/7ec+CNHFBAwMNyAAC+4LYXgNqIUYTWb1mB9Rq/3TcUdwwAuPztsR/7CQAA3VfokkXlf7nAucjvzvpnbgEImFDcQYJ4RTmJEByHAylK/fLZJ/57QgAg6687gnXCgzwE7jw5cAwA6g0AsANzmvXPWzIAAFoJEiNE978g4QU/v/swvxoAmPPfIesgczALlkQ7rCm6XT8kcDcMQm8ZhNSBv/fl953SOIHv3vfvuQ7WjObSRPdvHVjKfeBenPH7Ywn2rcwtWhNzRsgldF61vSrr/sSv/UMPzu56a+6Gt74+8+v3hV/Dm34d7/nrHyneotC7aHvlGXnw0CO0BmuS9ety5P+ZDZzpcudDCJaP/PfdU+aj3Hs/UkaN3xs/eHmW9t7tZL2LRbmhACYBrGyMDJCc2/TzHVqzd4kE+gDkMHtixWjIKnJjGZRjX0J4iucmB/fDgfvjAIwgNMSG6IzGyIV9+IYTRTagfMgFdFxrim85hvvJNx2CASgGphgJY8RL+zEUWw0AcPnwc/rYNIoQf3duKLDegBKtBADIc5MAQJ0S8xaXrCj/I/9OMd994DfEgf/vFcUdhG54FqJT8Ox92FyHkR6AQ/++p3CQVygEggcuLQC4iAAAfyIrgT0Lss8YLLJXwRIoe7CmE4rb9aEX4JINwPH2OX+/TQAVsl+O4H1kPkUAnPn1yHoBs04uzQy8B5LALEEjin/Lf5sIG82a0UIu1nnNBZRSg1/jl/4dhVRY49fqlrdMv/IK8LY/bw/9fqn1v3sJruiewLtYe0UDvvOg/FF+HIOwPEkBAKoxHzc9CCrn3nXGeA5s/Htl3LsbQDQbC1lSHJoxgtwhlHPHsP/W6Hx1KeQ/jdeDHi2555/9OPLnZi0QPnwIIZNPjbl5DftC9sSJP58XcI5ZBo/BXnkVKRdOQHeJIkaglIXrzgI6rjXyW/ib5L4ie3L++TsQkp6mMO+PHpVqAYBTcnfsRyrCfRon1wwADhM8CY2G+x1dcbtwmHYNaxo3/Sqh3n1wB2lxr+cQF+9TXO45EHhb4BJE97dY0hKj2oSDd+z/fS3w/VcBAJgshtaexL1n4b45Q6l3k3t0MwAWesizga7EDiXeLgDryB/wE0DvW+QOldCAKKUz2BPoomVCpFg0IUGz65+LCo4F+J4RcrEESi5gObZDmpikSL30ig9TGb+HdLMnsFcx3awNGOzau4T2igV8ZY1PAUijW3QvJQCImY82Yz4wtSrtvVuMIWl5mD6a9t7oMVkC6/0EAPKen0c0RpZBDk1ByHUHvCy8p0eAN/Wh9wox+a8tAOwvz8pf8uOvoEs2lLPLITzJ5AnNDe6JPThHp/4alMFa2CFGLpzCnG6TXNgCVz4+Py0AyCnu/z3Y64fg3b2Ad9ohXhquVWM1AcA+EB7WA2Q4VkbrgASvEgD0U0yZOQdavFAUYLPhfrcUORNj+sASR+BwRAdqwXBDoWIcA3f3LijxHf9OQs6ZAfQ8AoSVhcDaXScA+CSBLDZOVoLl1g9dv53g2bjv98oXClkTwd0FCck1cL0vAElxHdyzAgLEK7SaYNG0E9FVhLYImjOwco/gn8dw2LX5TqM4+vw79FM+dgdkF2AWg9SmEPLiK1eo3SDpZnjPtACgiQihDHwvaH5XQK5YZzrNfPTCu/e5Qu2FDsp9fxyw0kNKuhNyuHuUfG5kbqe9N4fGdmHf7IDcRRm2R1Y9yrlDw2AZI6uSz3WtQv5DXk8OrOdTv6Z4dmdJlmImzy3vhUqaGyRIb4L36Iw8UBpAs+TCESjaQwj5CfdHZMMScC7WgbOyXQYA2AbuxiqQztfBCNkHGXxK54O9Nc1XAQDmE9LhUBnNg0uvmgCAswDalBjiMo3FQMyJWekonE9gktGVj6kxWuhAEDm74WcVL0ASADiBwztHhDARBiMQU0ar+k0BgM8iMgvYot9SiH1JHgP2bHQqjOKvKJSwDHvsjNZoldjDE5AGtEju6XPwziRZNJ3kKUKhjRbGPuw3tCoqBQAj/vvHII1o2O8hzPXGVEYuFtMB+23QuGcaAICpmLy+x35+D2FuZyBN08oQSqNIR+DdRyFlrN9gVadV0ljHYJjyuZG53VDmvZlDc0qeMSHhHSiWN8f9T0hOzSm8lgaF/FcXIP/tgwt7D77pGLx9C0Ymj4TOvo2cmzni0ogHNMlDE5ILCPDXKPsHZcM07MtFI5tJnhfzLTOQ9j1H990EEPAa1nVLIR22XRUAsAridJEyYvLWdYUA1og9uZ3gAu9UrP8dcMnuKRZ8LwgIJg+ygNfugVwAKwSw43/PMU90j7f7eY8BD9cJACw3oRbTz5GbDgVCK7mX0bWIAm1SeQdhX3+rxJhZQGDMcxKUgQjxUQAtGC8NWTSSavosEMo4I6sNSYArwA/YqTAEMAO5zHOQIjYB55hTGbViMZIihelmfM9YAIB1NqYUWXFK+4LzobU6ALHzwe8+C/MxarCq0yjpQUglm6YxBc8QpZcWALCyPTQMNfS+4jokxf0nCYTLHDD5T0vDXgbPA/IYDkGxHlpKiwi036eYm3EFRCYBAM27eAx8BZTbsm5SkGcQAN4oGQtczyTt/kRgjedjhUAbyi/0Qv4o468SAGRcaUlcAQG95A66bgCwDqzyXIQFzFYpIuqQu0qIXo0Kk5ljYFklBieeCE674/k/A0uI03KaAt9/QuEDdJe2XzEJEKv/iZuww2D1a+8oaxTKGsgqVi4KESwsognMkDDqB1dtD+U2s5v6hPgLGAYQb0SPkgKUJSuXAcASWDUrKUiALFAWwE25Bu70JVCsnMr4Ssk1H6EUKbznGtwzFgBkQGjL7zQAsE7evCXwxGVccYGXmPnAOV2Fd1+G+WBWdX1KJT0OXqMYb2Q5AEDL/kGwz7IX12FN4Tdx3L9fSVtm8p9F4twDt/8B8ZJCSquTUpRvp5ibCcUAOjO8iwIALLlwDr9bJpKvhHe6XHGZYDEWtIqmLWXsoX647zCFbXbgfJ0aPIeuqwYAIqClDKHU8dbc2W8CAMRmAVhW6bmRDsOpXpLLzDwIVsTsxpf30NzjCCDOExRuZ+D7Q4SU+iv0AHyjsIQ53qYp8hlS5KG6AUcGuOFY4k1lX2cN5Y0xtBaIe1uhi3MCaIsE0GQ+eox3wMOrAYApsiqS0gC1mOI6hRR2gOi4Fkhl1ApTYboZkp924Z7rkQCAhe82kC0RALA3L+T1iRGw65SDvUfzsaiEN9NYb2NgBKxHeiPLBQCLRJpEWWcBgCSi8pgrLRomhcvEq8dyQiNxCq9lF7yySaEzrtJ6N4XbfB7CGvvArA+FGzRQfkFeV/wdno0mIMO2u9K+JtjTRKqvlkNSxdRhXPMDyK7jM/bj768DADQCW/ZZIJ79UwYAGQO9aptgACzv5xAnZTLiLCmq0wAbFSvDcWzvIIEE1kzxZf6dRX7CanJXAQBuBO7HBy7kyq9XiGKoQPcTYolSFXBE4Ue8Ju+DVlOAyYsM7oIHELISuo09jiDTAgBY2pULASUJlE3KYz6mfGVOZRwDpWcVptqCjIgj456xAIDnIwder3P4b8yKCO27pPnYULIujiH1c0chOPdEErgwvLBI7PqcEmqqBABYHAA8S4sKP2AjMlVZvpnLWzP5r4O8Y0z+Q3CPvIBz4lZxlVaRzQ8i50Y8UZuQtn1sZD+gkRCSC5iuyMbFcz8kHbbRn8cWV9yICXsvPCozk6Q5QIY+McDQj3r1ugCAFF55+r8pAGCr9IDQ41ogg+BBgpLT8qF5kbl5hvYdaQGA9TtNiVwFANCKhFjgKETmQ+8KW4wHAfcepxRp32EeHPi9tsd4Tycd4DoIY0wqayT7bMMAAEPO7hCYJFAOKKf4GARwUiqjVZjqANyrx6CYc6BM98oEAMdw73MlN7pSALAHAIPn41Qh/GLILFZ4L7jSWgY8z5WGADIK3+gYrl8jqxv3GMb9mUE+6p+RUTghTxLIfwsK+Q+NnlVFyVreN+TxJM0NercOIBvCqn+A8iFJLqCe6qPwYo03MJ54OfHcz8tLP7jew90yAYCWPr0K7/tnS6++BQBx725ZZvyuo8omuOfskqhL5FbKGekhWvMM/o5DZ5feDXEAUEFabuSrAADSWIjjhBMKT4M5FpilwTXG2VMTqgrYAHtTI0heRCjumD0dAwAYQKAwPPNCa98AAEIY66WY7LMEgYKCHktE77viegaoCLBYCmfGoHA/o9zoLVCwh0BejQEAi5C+taOEADg/OlSCOmk+jsDa34Pn5cg1rRWZiuUXrFG66BEoX/S0VEIC7COP2Bax+bkOgMgBK+4v6cXCch9zeo+LtOQ/DNExL+oskP2DDYKsucF6GVg85wD2CVdAxJ4sdYZciDnPWDr6rpcxNa5QIRMrbd53dsXHGACQJI//8hYAVAYArPzlJOvwMeRKvyBLNQQoOGaNLjQkJ22CtRWqfGdZ1zklj1ojkl0FAJD0v5dOL/ay5eySoz0Ue2ygDAIm4lkEPGzGou1F/o6rBABaqinWIjgDZY1ZAEjSG1JAgCVQuCzpBuUV7yhKj8NTFmC5IAWyTLnQnK9s7RX0LqAbVyMBxjahSpoP2S9bQIhcJ2BzSBkpaQDAKuztU4qxLytu9nLTAJFvhKGZfVKIUjVu24j7c2Mbq8eFvOfDSPKfptznjRS9HQV8YoOg0Jpmyft0Bt+86+yeLBJmKFcuSIbRDU92vgMg4KEfUu75jr/mu7cA4KcJAEbKWBTcBFqde2aWniv5/GPA8kT3vVg6+664pr9V+14rr4t1DA4SrKerAAD3y1DeGsciFkQkVQXUXGevr9EDwMWmZggEYJWvIyC/rQHrnftJvEqwjg6I2CYpb4tGPJYF3qCS141nahMsWsmFXnB6MR8rDVDYzTOBNEDZHzFtqK35OAfQsgHW+hztifMKAMAKWeInME+SW6+t4QtXHjmsj8iZVvOkTSPuL1wObmjDPS7QU4HyoSeB/LcH91oC48YiA1r9SmJCAOx9OoVzpIUB5P5jyh6IOc9i/N11hd4YT4EX8ML/+zN/7QOvK8oFAJoM3VGA1FsAUCYA4Nz7C2fX/mcAUBMgi5UDAA7BnYX5uVolwZfOrmSIhz4UP70KAFCTwn1vEfCelRFGsKoCpon1oQtSS2FkEk7MXhEgJF0zGQRsu+Lyo8dAqEPrcSIlMU0E35R/puYlsubBSltkgtQ45EKnqQMg7OZBQ1ZoZ9ciQ4pQDlmL6IafBeCxUiUAgEVaUNGugvIfJi/OiwQ3t6UYtG6AAu64nawW98fqfzkgdHKPC+Yq4Hnop9TYHVdawXHLGBoZcNk4v2lIgFsKz+PASMFuTyEXOPz71Mv/J35O5IxLmexmv74NYEjUlAkAGhNSqM1Q5lsAUB4AyP0EAEDOlRboWHB6pTlOQeQSn28CADyKIPBlA/E/IfBVg0hY6/RSs68DYRnZH3UuXIvgNCJNs87PyStXqJuPIGABrDckUJ2BlwRBAKanpakEmElQkHwuLYa0RZBKWwo4KWXYOrsaGfJpJGMc2e4jVQYAe664Cdc2uZ+lHDOGcIRdn1YxcI0GqT2AKaMLRr4/ewO26f1DOfp1RkovhlFeA5gIjVMgsPH5HUiZfolpgFjOVyMb4v1DWQBa2ra8k5D8pKNgswcHUia7GzJpmoBQXG4WgJVifhpKV38LAMrnALypEADnbB8pzGROZbFKGR9AvG8nkEP9zRUAgCeRKXxacSMEEbGphPsR+eEaLyMp31eUlNXo5JzSr7RCTeIWbADOhoAAqTA4T2mAB6CQsCIZhznS7l3+BiGoaudSczeGgHFaANBQJgCQ+iONQIasKcPFWk0AsAveGw20MwENQcvtMtaRqzRKSeUhl9yYbAcUvYCUZWeXDZ6kNWszSIh4pmIHnp9NykRJm3454YpLsTPZUPsey8t16krrFKD3phVS/qQaqxTAG3KFaoG9RDosp59El7OLzGlhlL+FUt8CgPIAQPaKSYDMeMduVFhhDUs+cjELjJVrzZB2CDzIIdeqqN0GJmu1AECtCxfx0fJsmfwjcTOrmNCii68KOGikKiVV/OqGFE2NEPfa2R0X0QPxCiwEbAqj7dssuDKPjJzpEQIllVSQswDAmOFutGoeXCcAkPojT2Cf3HiDAOCAOBzM+sdW4Fhe+FGZ6WHYp6GVSJWzCh9B3OCcISRKl3u2WCnLWkMvrfLeXuRAF/aOkn6ZtkaCpgNCe3BQ8UyeKmcO+Rv9kL0lVQAxhXsSQm7DRDpM8y0ZV9x3A/uI7ICHI+eMSqpvAUB5aYCHkWmAT6uYBsi1w7U0wLSVAPmQz8DGxH4GNZDLWlslAPDCxZfxtfJspQ0rlhPuNGJhSVUBMxEKHGt+j7lC45YRitlvOrugyazBQRCrHxvEDCUAAKz2ZYUqyvUAMNiNBQBp7n3VAEDkzm3vwfryDQKAbVC255Qlwal/Ul5YqsM9LGMdn0D4D5uRYcqmlu+vFQ1aUDw91nOZ/Leo7FM5S2sJYzvCE5em34XU4l9IAQBYlmDoAEmcyMEZBY6MnJMJ/w7Cw1gE0IDth9P0NRgHQCH3XqEsE0wRv9ZmQG8SANypMgDQiugkle9NKgQ040oLAR0alhMrh2oUAtIqCMpB5pzyWleoZvXKFcrfVgIAXrryG/lgnm3ahkJWVUAtS+KActq569c0ALI5JXXvgshli0TSxJKmGsibdIVmHxoAwHNjhY/StgPW9qYV1x9NQZwccOm7AVYLAEjL54/fMABAwawVWcLywlgfvpwSsS/A+4ftyK24/7rTGwfJd85EAoAQ+U+zmq2xmOCJm07glmj1F6Q97yp5Xs8DIQDLtX6qeHNWACxxQ6l5ePYGgIa07YDlW3DgdyHRFGstMH/iStsBv2kA8Ng/q9ZVrxSwVhDi1IVLAUucOqkU8HEA4XaBe1irFsfNhNJWArTCGG1ARGr0wkjqTne6QnXCcgGAVr0qtpWv5O5fWv+VthQWq0XLksB6/KeQM78O+eZLkN+9SXn7WqvnMfqWl35/aGEesRKmIwDAcYUAYBw8GbzPrVLGscRJsVSmgdD4JgDAB28YAHABoDODD4AkznKaxPQQ9ycm7r9keBU3YB/inrB4HiHyn1bff8wYmifuSMkuyUTMzbor1DPYIm/Mn53eD2AACHvoocTyzWfEwdki2SChWqklsQXp21b/ldhvWVe+ayeBG4Sg6cdCaH+vAABTLppcdZoBaSQ1y2rH2PKzAFMcD0cu4KKuozz3aYU/EFK4oe+PCWO0+XsJIXHAFbo9hohgIQCgxQrXIUUnyWUugv1rV6g//jzivlZVwDZX3FBDK9cqHhNsDrMFpMx9Si86BMHPraKl372U8tSInht+PyzRftFCANacxSglBBqzrrSqH4NTITEOG6GxE1IsaAGtUez5HwkALJNrG/fUdgIpMC0ASBP3lz3D4Ry01tkityqP9hkk3HMlDCfr1U/D6pjK5MMpCJdZc7NPQzKoJBvhNIFE3UHvtEhevlNKy90DQjWXIcbsrXIAwL4xJGMqB3tKyw7i6pJ11wUApGBL7TUBAEy56HThbngxQiRUzzqUEtMMFnRSO+BQ/+uXCeGDctoBJ1mO/P0DrtDTegIsRi0OfB4BAFqcXu41pvqfkCslrnsTQj4xngUt3UeLlWLDlkP4thPIjc5CjrSEC44gfQqF+oSfrxEgC3X5tdVSPfcBaGwESIDIko4h3r0mj8YGkEBXSMBxyVYkYDGYxboHWFRHqgtuwlzmIsDi3yMAsIBlKC2w05XHDo+N+88DQ36ZagDsA9jcgb2+a6TlWTHzkIxrh4FGElcGvDCUtcUtOYf5PQVlfQ7GT1IdlRbwDo654tocKBfOAPgfueIGT8cgG05cuANrmm/Bgfc+AE+lVh/kb4WxrgMAtPrD+IJcyVcJAKSASAas1UoAAHe0WoHDcGKkg4ibBdvFch6+KKUjV1rxDuPTVmxbCx9gxTyJyXUbWQDab7Xv7wdBIjGnOconRm+GlibEKXycKoQVwJKq/z30Vv9leuLnlKKIYEnjFlhVAesBlMhhRxCwpaB4bKBzTKmcUvhlDdz58zBvk+Tq1QCAHGgBA3sAALCiGQrzOYrzxZS+3SerRTr5nSkcBvRyMcjaVmLc+8DoPoC5i2kG9PcIABhYZl1pQRqtMFBaANCreLOsuL94HCaVa4/h3Ijy31dIZSLvNK5Rls71gkJ+a3DFtTx4X2WV+8wDk56Jq0njAM4pt3juh2yjUIEuSy4cUyrjMZ3jnRQcgJhvOSTvwyZ4Dq0KoT+Gp68SAAz4icRmEexKvioAgIUvxFodrQAAaMxW9AKwAGa0xQhymdy3WpoZpoaEBOGxQgATS3MI8n9HXXFlszThm0ESDmLVrbji+uaYzrin3BPT3joMayGm+t8Db/VfWv+feCBg1Vtg3oNVwasW4qYMAhbAMpZY266SspSFQ58jIbPpf78KliAqU0twHsM+xQJAZyCcuUVtUhc5Ubq74A49IovljIT9CrkRO4FrMWlYthckCLH2/U+JA3BxhQBAu7fmSj5zemlgkaVp3rtHAfxW3B/TWtFbsA5hLVQ0e8r7oSIfoHQ0rvBn1SqpJWIwegbXlfsg2MVQ1IazqwviwN4G0k8DszCEe2EV6BK5sAzvh+5+HDtAAhUZEMoCSPstm/A9qxB2C/UI+TGL6qoAwASkQ2CzCM2VfBUAQPqTz7lCFytJcWMAEGMBN4F7a0yxeE7ABbusCEothsRVtdacXov6pSEI0YpHN/4iMFHlcKL1vlgGAOC53/eCawc2vcaYtzrwPVXIQlqrW6v6311v9V9a/x/lx1eu0F7Yqi+ABCaNYPjYexcalb066Qp17KVeOacsYbneHCm8LKH/bQXgcBrihr9uF2KXaIUdBiyYjAt3kcuBJ2RHsV5yhrBnYNtJ3iG0bA8S7snWTVoAkE2QAbEAAN8hCQCgIowBANa92ZW8S9fuK16qNO/dY4T89oCstkIyAvkCQkRdJSW0CW5l9lAIQMf9IOcFx7zTy5U/IQ5PBuZpUbkPciWQ56Bdu2T8XrobijdOlH+bK64jwSCADap5kAuabJBGa0sgm606AOV8C3drlJTHEfAEt4Py/1uBqasAAAswZhRFyK7khSsAAGMkSNdgAZad3mudY+BocTYQMp1UGKHHzq7GprFIs4p7ld1pjQl590gmOgTi2Aa559h6x25sFrM2qR3ysRHj0tyL2mFntyZX7AtV//vBW/2feqF+CQRu+HTAJxQyCVUYxJSfewYI6Pf/fxRyeWeMtCXZb2g5cXwwa3g4+gi4LgJpDJm+CJJCFozkkXNqI5KTREBxg5gduD8L+z5wj1ohk9WEe64o1s26Ei6yGkWFrMEYAGBZWBtGloN47PDaNae3A469N/d62EqYjzT37iE3+jIppBV4d3QNYyoq5qyjohFjaoI4CqJcGDhP0ZgggiOG9Z664kZC8i6h+2RAP4wb12pjEjzDwsfhIkyPXaH42QvFiz0IckFKLM8qsmEWDFDxzmK6NfLFyvmWKfJ0S6OuPn+O2vy7Fyn/SyOq2gBgwxW3jtQUISujDSCnVAsAsKsfe5JjMwitghqz4J8Qa50tnnWKrcVUV0OCzWaIpUnpbUya2yAiWBZcwjh//OysK21IojX2kCwAbe5PyDUtVumu4V7EFL6Hzm5PHFP976a3+i+t//c9EJB0wNgeA1wV8JYCAlr8s3vgwGNxDxxTChDgDmRHCjgaBiGAoatJABoLxLNAMlXIgnlOvJMlSE9CXoLWIGYJQDwLeylVa4VMrKYzy2ABLSpWzAylSb5UgPd8gjXY60oLcd3wIPFPCRbWIljFAzR3i8ozp8m7lfbe4wELl+cjzb27YM4mFMAqe2bEFfceQAt3xFBC4+DZ5f3wVFGQQzQG4HctsE73vVx4TtZ2xrjPIJBoJSU5o1xnjUHIZOqBjBxU/ve8okQQgHIBw9lSEGxUkQ1YGEjeW8489wIo51uGIDtL7t3lCr0wGlyh/PrflP8lKK4WADgDF+UhWKMxihDHVQGAY2JtHwcITtxq8jEg0xAjdDfgjrPePeRelfalWte8MUD2G+ASPTbmz7LeQ60wseAOM/X3nN4mVCyXJVfa17yVDrtGytx3cdX/boBF9577zwIvX3slHuoyuA7vzXP0DYCARxCTFBJnhyvU8+6jtKWMK262ggqQ838RHI1RvjeSV7HC4AR5tDYU1rJlwYhnYQLizzKmXGmDGBnTFMZjYf/MCJmMRNxTUyxS9Aj3y3MC3iNgbVnWYJcrLRZ1CQ4/82AxZGFNUsy0j9aVrx2lmHGaeydZuDwfae7d5gr9KQYVpYRWL64p1hvpNZSvKHButvSjrPrZ2z9/338CHoBTykGMVYT826sAAFmFtZ01CE5srdb4UeuSW7buRH63WMkrAffqCxBg7BoTZD8LJBQkoIQAACrsDXAHThrhhxpXXCAH3dI4kNw2QwKpHZTSQ+/C52pheB/u+60J9E+9QP99fnzoAYGUgMZ6E5g5sUzvjDyDzzwIuOk5BjUQlxRrt9mvQRulLmGzFVQYyBtYBff3nAGOuGNYH4CLSfIGzCusZc2CwZa6wzSGyHrBgdZKjybsyVsixZT6Iu6ZCVhkSBpG4N1J97aswVYAzw88qPvag8T3IiysDBCmuImO9kwEXWnuHWPh4nykuXcTWPTdCmDtg1RBscKfuUKBLtyHXa7QvU462LXDXsNWtj+81ZD/eADAKk4Qowit38YAgP0EDsAsxBo1dua2ooSHDGv1ris0nLFati5CjI29CcgBWCUrWXOvYhvQm+Qa63DF1b1mgaW+aig3frbEAYWJOulKC4+I9+MuxOvRncjlKGcVq5GZp6KUvleAzDykyU0p6TgCRlig/867drFl8WOvqFpo/mfpnWfAbfqhv8fX3sNw27/rQ1fo6S0ljOu9oJTRBAIThTTyBuZgnjTylBSMwp7hbUpoYIJItsxarvV79cc+CW8l1ts/b/+8/VNNAIDuYM0SXAclE6MIrcEscOu33B2qHRQLkqlWFCLMoqKEOyhW/YNXwvcMRiiSZubJMsuQ+3IKFAFayZp79QHkuksMqg4K+/SCkplUFDMqN372nCtu/DMMyh8tArGg0IoUd+I4DYlzoWWkMU9v+W+SGuVDyv3QndsCxMF7QOj60Fv/v/FAQNIBb4PHphFcoUOQCjpOsczLdXzXhxQ+8ff/1j/rBw8qHvj98Ni/y1MYLxQggLyBEXjmGKw5gqMHEG567gq9xFuUuhYY72PW8kP/vpd79pu3Euvtn7d/3v6pJgDIEJM/NGIUoTVmiNRi/XZWsd77FDIVszNFAY4ZShgtcIkP3w+khYyQAkM2dpefgxFF+YiVzO7VH4So4ZXaA68c6oiw0w/u1jFDuWUUJTSqMFHRinzoCtX2mhV3YoaGkE+6yR3N5JNvPSGrmQh2eK9ecufWwpyg+//S+v9lfvyBwgD3gDzJc4XP+Vss8+3Jfvvn7Z+3f97+SQYA3YrCs0aMIrQG1xCwfqtZVBwvGwkQYTLAAmUljNXmvlUYoUia6SPF0gWWWSsRazJEpGlSlP8NX+jmY6+EGQQgOa0bKrNp9+dncxxQmKis/C+V6Vdvd/3bP2//vP3z9s/bPz8zFJ41YhRh6Lfdrricrvbbflbgb1fp7Z+3f97+efvn7Z+3f6oPAFrI6ix3cIz4yRXe+4a3qh+A9c4xW82Kxs537OrugRzUViq0kPQd6CaXePtLcrVrvxOLvRXY3mmfFXM9Mr6bEt6pl4pNvCjz+9Hjcuni/2N+/DY/fpEf/yM//p8U+0+bp0c+LPBCSXe6qrmuheyRFuAGxMwh7tmnCkNbcr37lP06QJ6ebvgW8fRgoRMMzXxUxjnsgfMgHqVmYolLCKicM85njb/hHnBLPoM0znqaLzzfA8r5xjAWesbkG5ojzkJvlWRXc8Se4bMas7eR/S/htaSzoMlqydsvZ3+nPUexclG+SYxN633w+qRrLVkQ+924RjH7R0uvfJxybVvTznEaANBJcedyB8a/hXR3Vff+wSsYdJ9rrG2Oo2PnOww5cEpTDxG6kr5Dy8FtIrLdiJFGlaFKb2mflXT9IFX36gASpvVOWG6ysczv13L8L0l+/5EfP8+P/5If/0fkHsF5agNBh8TAHkjbu4q5FuGF9SMygfQ4nkPes03kfZN3H1X26wTtVQx1oSB7AcIcQUDaczhM56EvQAKt9N69ijAWEHDTZ3E8J+GszdeEcr5Hab4wi+VFxPmsxsDzF9oz2lmN2dtDRLCtjzgLg8pcPFLqo8Tu77TnKGne8ZtaXaEVciZiDpKu1eRJI6Rlp1mjmP0zqGSEPY9cW3zPVDI4DQDog/KyM2UObFKAaXdXde8asLKbgHzGedvMpMec63mFQT/pipvuiPBO+g6uwiXFVDjdjseUUi0w7bOSrucUNSxAMh2Yb+xfUM7310KWgFT5uyT3/So//jk//ik//s/IPTJlVFXk1EDrmyqdayxzirXNRwMFcngOa8gz1AE56SNUa8DarxrZNUOhNQQBYkWnPYfTVJBmxEgDfVrmvafhrGnC+DmkrH4Ppbu7qEjTNMzXgjJfs1QgCQvrNEScz2oMPH+hPcPXtkXu7SkiZjclXD9tzMVTV1q7P3Z/pzlHHZFyEb8Ji7VNJVyfdC3LAjmfzRHfzWsUs38wI62dwEZPxNqOQbGmaBmcBgBgr+aVMscSFd4RJXBV934KgrQTlBqXcF2mFEMsayypjVpjB+6IlfQdWtW9TqXgDv8O+wVIg5y0zwpdv+yKO5Dhhpt1xQ0vcL65g2E53//CFbf5/cSn9/06P/4lP/5bfvxfkXtkUSlrrLUbnTG+qZK5nlSEMtbAWIicQ96zfQTE5lxxYyJrvy5DuusUkWsRBGCNhjTnUMoKy3kIdSF7UcYZX3alTVSsxi2StovKfxTO+JJyvrViVlpp3aaI81np4PMX2jN8badS+Erb2wuuuDx7S8L1WNUTQcNzp3fvi9nfsedoyBU3KbLmnTtrSs+UaaMkNc5B0rUoC7A2STtkm8WuUdJ3YN8NNAYYZFlrhTIrlQxOAwC4gctOGUPrpPXqCu+N+fNYGlXqaq9SwSApMnTgB5e8lb4C3HRH6+nM37GlFEjS6vxvKt8mTU+w5kHaZ4Wu5w5kXPJ4Q3knqxtj2u+XSn8/JACAmD2Cnf4GQGg1A+KfgGqRO1Waa27hKuEDrYlT0hy+COxZUWTScAfLMh/Cv+9SwatFSK8dpJDDc8j+SHMOt+k8WH3IRVGnPeN8bxFyWutWKdzFltkCzNcOzNehcba15jotEeez0sHnL7RnNpU6Kx1K6WueSy6w1hq4fkcpk94DtTkYUM9G7u+Yc4SlwEPzbnXW5K6p1hz0B65FeYLVSbGUM5bpTlqjpP2z6YpbwgvYQO+w7Of1BJmVSgaXCwCkFPBximG10my6wntjQZhhWLRlp3dvO1FKFJ9CGWHpK7BjHCjrO6wSyQwAuG5/qGNh2mdZ12stWa2mR8euuKvdXAAAxH5/OQBA2yMHAaHV6oq7EHJzpnLnmnuss7XAAGCHfme1s03as9hy19qrWajMuQ7WWKhPQ5pzmIPzcABKY5msaOx3Xs695Ru01sfcVY6F5Zr/rczXiTFfR87u59GScD4rHdr5s/aM1T5ZAwD7zu4RggAAW2YfwXOstt6NAKgHCVDvKWeJAcCUcf52lbPHHT1zdH8+P1g0bsMV94PZVgAGg5dD0ik4B+NAHMUS45t+f+F7YcfRQVdohreozBN+C4KNHjBaZJ2wE6y1TqlkcKUA4LUr1PGvNgCoxr05NiaTKI1tRCicudL+7diHna9LAwBelwkALvwz0yil1ykBwIUiVEZIgEoLY6vlL3ZiK+f7KwEAl/f+i/+OnHIYxK3e4YqbKWEXQrlHOXN94Yo7GbK1YAGA0wAAiNmzoryOYJ/uu+KOj9iGeJdAACtQIXfFnsMTOA/n8C57inesL2FvWPc+9wNbKa8prmxpNf2YhOUqCHVR/DllruRs56oMAOT9qwUALsoAAKcJ8mqErMVDeGdUsOIyFk5MCFCfObvTqqagBYRhW/kJ8EKihX75Xn/2vzlQFK32PueuuIsm7h1s8b4OIOi1Ae5HAMSgMpeurIfgycBwNMqeFZqrM0WRj0F2ygh8k8zZibPb0Gvn7PwqAUCuyiGAat67Q4n7yiQegYA5JLepjC1wo0h719zfOQCQ1qsoQDUBj13tugJW3nUAgL8YQkviuN2uuCU1HqS/+lHOXP/VFTpiatZCOQAgzZ7dATf5hituRSwNtyzgNqyQu2LO4a4r9NWQ83AGQmZXsfw6U5xxvPcRAIxsAOBJEyB2te6D8tfma4u8gEkAIDYEsA8gbb/CEMBVAgBUyOswX2ekNKdpv3Q4u603tojnUEWGvA57AJY0JT1B3yPn9ZzmYhoyPWZh3nIBcNGpnDOx5k9gP2NocUJx/aNxxNcOQaosgo21ANjA8zkE67NGc3wALn0E9XzOgp16qwUAtiskAV7VvVnwI8oTBSsTicQpYQkvAWljHWKv23/HAGAOUOoBoM19iFUxAVLS5d4EADgGRcdCZBhy5tGduAUH96SCuf6Lt0gsa6G/DABg7dmcsWeXYL9iK2IEb2hlrCokMnGjx5zDNSAfbtK7WZZZV+S9V+HeW2BdvYb1WVd4HtI0imPnuMd3aL6Q/CtgYJMUiuzRNCTAdQUArKckAV4XAODOnDsKMMP4cmiPomWK7nwEgUhU5DXS3PTiNt8Ai/kv9H4ICLn9t4R3NG6P5mlbBY/nuWHVs+v/RHH9T1O2E4L6aQIbpwBoOLSqeQ1OaW3QQ9NDYHWdjAP2FlQVACxXkAZ4VffmlrAo+HFxpRWtpEkI0puiFKLFBFZtWgXY/hMDALOwufdBWR0Q2Q3RLZLJrhsAnIMVemEIhX7F8tilWPxpmXN9DAc4ZxCH0gKANHtW+m7gfsUOlSjMTgzLDN3oMes3Bymz4p1gQaaBsDT3XiC39BkAPCuM+BwsQHQZnyvW7IRfn2l63hKxscWzFZsGOB8AAPMp0gCvCwD0UFx+E+Yb9wu36e5VwgdZWv9lire3Ob0zLIYdmAeA+yULIdgzhbMzDopvQwlHLBNpu1Fh9HOM/rXiao91/WMaMXcnnSOvCZ5PBKFTBm9g3wAb7fSMJcjWUfd3tQHAtCuvENBV3XtAQYXHhCBRYI8CC34QYiqjJGCtvNo0ChD7dP9UAIAIdN7c26BwJl1pB0VJJ3tTAOCAlDi6+wYJFaPCylYAAM4hjnxmCILxMgAA7tm1wJ6dh5zeQUgfG6Vv3QMFkguQu9J4cMaUdzwpY/9Z955QFNl5BAAYI/fyiaGUpBOmFACbhLoDWj52TCGX8QgAMO7iCsFcFwDoCuy3c1KeqMwzitV8ZIAGTPnFTBz2HGiu+lm6/zGs6yk9a4IIg1nDIyVzVkc5/Za1zdZ5Gtc/pyH3UeohhiIvlHuxV+IsAmwMk5dhG0aJh+sqAMCYMbBBEJeXTKM4tCGHh+89ZLiRtBiXuGylmlKXKy4TPOCKqytplbUqmaOfAgBAd/OZApKmXHHBm2ZXXCL0qgDAf01QwntgGRwmxAbl8J5AKlglACCGOJQGAFSyZ3sUYbZN4YOQGz3N+mnKthoAYNggimkCH9/d8gC8Bv7KOlhBUwD4BxVZgvs7qZRrJgUAyLjkUrDXBQDaDbd8VrHKcb/wHt1XXNMcNnhF3AH2xmk8AHbn5wAMaNdrHj4tW6DTc0YaXHE9gwkAQjtKaGtTCY2GXP9iHNURABpX5BEbEcsKL8EiHCPY0M5Z7qpJgOzC08Y0bAhkHz9MIRysMeGKK0hpngVNsWos1xb/+yZgvLa70rrPWm3tSufoTQIAZvwfEXEM06+6ICcY671XGwD8mwcBP09Qwii0UAjNKhblHqTF7FQBAMQQh9IAgGHF9Wnt2QHas61KHHAT3KzoRucYfRoS54gR/7XIWWkAwASFPw7JRarNGXMAlmlPIBFyE+oKzILsENJmlyuuyS4lmRtBHuDoKAMAdCj3wR4K1wUAkIM0qVilp0Z67agxzyHiYL3/Z1+Aq8E8AM1jh2eCr2eCrxYSFM/OI68jXrniSqka4x5B5B6c4SRrXEqdC9iQvP4hyuu3Qg7IWdNCBJhyLPo0lQyuJgBYC4xVYjdiUYlY13FocAWpFuMgYewWlQTnuWKDni5gcuKQg9fsCo1tKpkjGW8KACBpjC3ZGVdcgKUVmNfSxvi7KgOA3+XHb9x/lgT+9wQlrKUUoRtSS1WSw1spANgIoHgkDsUCgHL3LJZn1dysVoy+HA7LtCtUGtsGJc0M8DQkwGWKx2Oc9cJIlcLvf6akde2BtSggAGsjLAOPQvhDaP1LU5YnHmBIWWnp9dBYAQBohPu89Peu9c+6LgDwilzgHJu2wkZayMAKv4kylGZhFkDV4vpouJ2CArR4A0npfyh37vm5fqlY53OKdS58giyFBUKuf5GPj1yhwFenUkvASgvcVrgMTOLtJmPsjQCAvYRhbcD6yBBAaGwZ935pHCSNXMi/a6a4Xyjs0AkLUMkc4XgTAOAAYnHi7lohxr9sbizBellB7rKRz5dVBACXDYH+5P6zM+C7+fFOhBLeBWGPMd9pJVUJhVU1AICF4kURVgIAYvfsM0UhsYv+ImEtYtZv0RUqEm4BWfR1BWmA25RdIBkAOVAMIQKjyBGsTLdMfJYzOFNZ//fi+UJvwLACAu6BIH8MVl2lAEDAxWN/7xr/rOsCAPVglY4YQFlLr9X4NBYBF3t+MEDlFD8O8yAIPqYze6J4hZLS/wSQNHmPZY0rdPfDqntWbYAzZU5Crv9HXj7ed4UGSljbH0MOmE1zDOFJK+cfvSsyvzVvAgCcwWJo47gCAHBCMQxthO6txZqShCCzQydShB3KnSMepz697LoAwD7F0BFpYlnXdtrc0oTlK6+4qwEAvvDjsjvdZXvgjzwYSFLCyETm1B/LNVgtALAMIOrUCAXEAoBy9qw03GlwhRKtaWP0MQCA8+cP4P0QOKYpBMTgeB9qAEgoah8AKaeWYSgRY7kMArIAgsR6lNoAG5ThgiTXJg9wb/k9KgK9WgDgvr/nD/4ZN64RALxwpVX92C2tcU+0+PUhrD1a263gCm9U9mcoY2NNCdmtKe+2SWz5E2dXF5S5v+HlF1vnodoAf1Vy8EOu/8u1venX9qErdPfTQg6bFErLReT8dwLfTZpiXTsAqFRJP7lCcDFmWEFWnLJFORBaOoUVdgili2VTDM59vmoAwDHspNh/PSDOH1yhlW+lAOB7GDc8ILgEF59FKOENxTLYgHzvLUVYVQsALCTkEC+XCQBi9+xVAwCsOIgV9E5BSR9AeiK7KJtTnPFTV1zsaI+UP3fCkyJG911xF0sEAVIXYR+AxWuwXPeVZ6CH4XJvf+334/dXAAC+9/f+2j/rugBALXyDVtef02tXIQVUK/3L5NIuAmhiAfcafA0OOWBoLwveXpZf2wD2tPQ/Tkes9yFLUczYLrw3kBb4Fxeu+IcdSLHJ1vdKyIGbHbH8OFc4TZzzj6W8paPqG+MAlOumf+yuLrygocwkIdhCClNLp7C+J2mOtiLHdYcAtKIxzP5H1NkCvIca706rlANwn8Zdf0AvEfS3EUqY82pRAGjM4LUqAwBOu2NCTywAsJjsb9IDcEFCCWvoo5LWUkW1ZkAhA+IIvDh7EKu3rHN0tUoTJQQBQiaTpkC7rlDzHcv17lPYCwnLH+bHx145XxUA+MI/48NrBACikDTy6Aal1yKgDpX+tao0PgA2fHckD4Dj/xtElGZvH3sktGqEoqBv+XcS17xVGAjveWHUBpiiXHxssiWeTQw5cBv4KSJgSsnjpJx/fs53bxIAlEvUe3SFBMOkeCrXqm5TAICWTlFJKeClhPEmSYBZEFxZmHsrBbBaWQDPlPHEb+z7gXujEtZil+ICZEtC1r6aACAmh7gaHAAL7NYCo5mVQawnIdYDgF30tkhJTxqporEGBOeha0SrXqe3A64jEDDoStsCrwF3IQeCPcQz+L3npVw1APjAP+u6AMBDhTw6TnFprSYAxtqtTAEmet8NPGvdyO/fVjg7Wh+BPYjXH0ekuz737/MY9ozWdneT4vACBLTKfSHL/AsIOWjP1NJ2XysETA41SAq2eBq+fNMAoJxUvVjiQjkphiFGNVeRQuu2J8GdX2kvgClj/JTSAGOKADVVoQ5AozHq/Ro+DewRVsIsSA6Ipc8s9WoCAC2H+JxieGkBwLaRBaDFNOuMeO6GKy2moymRmDRALiu66q9dIBJdv+IpitkbDKCs4kpaO+AH/hva/LOxLsKw/900kMs2XHHNi/OAJfvONQKAd1ICgJ4KAMB98Bxxih5X+GPP2R4R1DTiJ3ZqvA3pcNxKeNXI7+f4/4oBGA6cXo8g5JEIuf6ZACj7cNeoDZAUm//Eh3fE68A1CNLKzTbyrNz2XoZPfwoAIKlYTyekoNSlTF2IKTKEKWpaHQCrLKrEFTuuAQBIowccP7VCQOeuuO78ikIKRMbrkzLeqcMY7X4+m4DhHqOEVyiFKUtW5RHF06oNAKYVVx4CzjR1AJaMPcus5h7II0dBpnVFO3V6YxSJ1casn/QdmPfCVcD9KKXRIVckttaHBqBCLZdZ0ErmTsYVWrf2kTdg0r/3EqUKhgyDNw0AcglEUE793IgEAHfAIm124aZZXAzn0OnVAtGbivyM7ynkwOWENR4Ax/+XXXHfAs76ybpwLQoMO6dx/eeALKrVBlgHL+kwEKbFQ/WBJzV/5+f8kZ/zljIBAHrP7/j7fuHDRz8JAJAJjH5XqCHfFOketEroypACHq0QF3nkivswazXLtxXF1ndNAEBqCfyUegFwKeALV1yAYgUsPewFkLakc+we6YBQQ4wSXjLiiZz7v3xFAGDc6S0/0WWYBAAsAXxO748Wh+ylXqc3N8G9qzVqiW3KhcV6xv3zpYwtnutmUv53UtybuRTcZXABPFG9FAvtB2tf3lHeT/bVkP97tnIvAuty3QAgpnESEtu6Fa8P5spb8uoWxKUxfKR1+UPFzKl2WqndFgBmoqQeQeaBVoBIO7ccYrAAg9aNEMsRYz2ChxHMf3T970OmyLaRs4/k10HyUL3nvQDf+FBVNQEApk//8acAAMYTxiillTW68pro4BALqMELAmFgZpSYFjLsucOdWDLD1wQAfmrdALVmQBwf5W6APRFEr7R7ZAzAWEfAOmUlPG+kMGl5wVcBALSWn9zFLwkAZBIUOFscY+BRGgHlpqUWMYBgZnRaACfgW+LQ6Nl7Bsr/+xT31rgUVnoqekAaIId7DtZYGnyJp3BIyXn/qQIAfj8uzTsBaz/s9CY7Ie7IDWCnI0Nf8yCdwRnZd3qnPXT/v4JModveBV7jCtX3YngAOSWeHyIOniSAXHmnBwoRbzLg+hcPKLfyZQPJ8lBdFwB4700DgPmIMQuHNyl9LjQBDTAkXvzMT8o9j277nF7g4tQvHva4Xya35tQ/IACw2gGf01xZ1QGrvUcwFSsNEY9L6J650hLBVwEABly4nOip4opnxdCr5AcfwHcgOXNR2a9zSjjnQgEPeAZjiXoaEMcyti+9gH/ihawo/69Sehe0UAAD9hkl/QqzfjZcocX3gjJP8+DqTeIGXTcAGDI8lxx3nlPWXsuGsUif34JCwpoAXKiHAbXW+Q877bUBN+MefN994gH0UeohehuOCGSg95ELCJ274lLUmpeE36lFScVbcXajnwWn5+zLu2o1+mUu/iEAwHrk0GJF5U7AUz+e+MkQoXPTTwq7xlConJFi24J0LWHrLwfIWH+vAGAChCMz2pNqBFRrj2jlXmOUsJbC9BdXWsxk6goBgCZQxFL5X36EFEOXkh/MGRpSwEbbr5julgPLjYuXaJXaytm/L73yqIXMjXuQGvqlS1ckasQIBVxQzJXTrzoUJbzrv3kDCIs4T1sGuOLsoOsGABmDjf+agPgKZRCtknLSXPToDv/Ky8oH8D2aYmZArXXv485/mJ55CTQ+Axb8S8XbwDytP7vSPP9ppxfKujzjf3WlhYGmjKyzO+T61wD7icI9sTgC6KFismrXPwIA2I8c1VJmOAH3IGf8lhc6UjxGClygUEHL6NQVVwXbc8X5+hLv2vsHAgAj5MZG5cM1AuSQjQLbutI9EtskJ4mJj3n/WjnTqwIAIZfiRQQAEDY2MpIxQwPTNDEVD/frPil/zuZg78rLMkmceA4fgOKXwjaS2/6+S99p0AoFZF1pYRT5FlbCkrq173+zTfN0ADwDDVyI8rhuAKCx8ZG/dATfhPVDduC7TxWeE7vohZiGilmr14+kwr+44tbUqwTW2dV+y8vjj12h8M4LhXTIwP1/Ob15lZUl81dnN8zCjAQJSfA5XSPQrCl0K0vgwgAMAk7/bgHABbg0k0ZaAXuRYgK+8yjzK7+pLzfbn/x1YlGNQWx03W/eQ3BtnUHKCVbly8E1p2UAgItrBAAXVQAAEiPVlM+Zs2sEDFVhj5xWAQCg0NyBwYf5qgBAEqnoIuE7myknWYDrmrJnT5T9egRx1BxY/lzPoY8InA+rcA6leuOXPiXpQy+U3kl57yHDa8dplVy0R1vXc3Al87k+hXnCUCCndF03AEDPJYYqDsnlrckqsV41oM7d+UQp3XaFmgDYIIi5KKLsrLbbXOH1nitUCf0A0uBqledwuMFqX21xHS4UUMINs3C+MwFPndV2NxM411Yn0MEyAcBFFQHAxVUAgGwZI1bA4m9iJ+BTr/g/8GzI30N+aw+wo2Xx1iDXVOJaYi1iqWEEBQfgJYgBADHfYQGAas9Z6HoGAKx8BO3ibw6VeajGHknTJjerKGERmivKEAXIwrrcubYAQCitKOk7hYzVDcAVQQDu2ZyxX2Wv7rjiCn1c0ZGLiVTrHH7krf4/5Mdv8+M/Ut673+BS8LnguWdFckAgnsuI52CeNogMjATDcgBA0jqHAADWikcgLmsf+iZ5JvJEppUc9RceoH0J34Q1AThNbwvkZNbZranR/Y974n3lORYPANeZFbpW44Jl2bICSsTLddcbjAOB+1hppzHn+lB5h7QAoJxzZwGA4L3SAoApOJBbZQ4uztCWcO8Np7dztCbgUvFftpH9pd+Ir/xGQxAgBUGkTvgmuftl7IIFKe8iBVDQ8sVKamm/o4vcYOtXNGeh69cpRthteE34vTaJUV6tPbKqMHhD90bELSGMGWWIAsQDXOlcrynuRq2m+Frkd2KpUAYBuGe3jD0r3g4hwS254gp9GUiZlSI9WMmxWufwsp3zr/PjF/nxz2Xce4DSKjeV+eO5x06A6664cVFonlZdcUdAzlKKBQDWnlo10i4tACBkPAHiAgJWYO35e6xvmlbIukKG+5MPlXJ+erPBnwqdFba0H3h+wVceEL4bCDfE7I1p2L+huV5L4CTIPh2gkKH2bdzTIvZc836OAQDVOnep7pUGAOCBXHTJJW2tgSWBBWGH7r2okCqwwYSkmHzsN9ml0Pk3L3SeKCBABIW4i+ddoWHMiistNbwCZJtFYKlPKai6nO/AcpAzxtxWY86SrkdWdafiNdHea5FSsqq1R9BVLS7L0L0XCKlLGIOHeDfQsqp0rvnZ7a60tOi08SztOx+7QtcwBAEjrtDgZt7/fsULQd6vy7BXp8F12g/Kv4Hy9L+7gnP4L/nx8/z4b2XcG+v5zxn7SVt3nKNFmCc+26swT1hNFItcSZ2S33ll+TmkzkkhGbSWp1KsMzLSb/h7/8k/S6rEdcF+lQJGCwFZxd8kMkoUmKTrSsjnPb9eX5N7nhsETac4K2xpfw7ABsMNkofflWJvDEbO9TSRXDVOQuy3Ydgk9lzzfn4X5rmS7485d6nulQYAyIEc9xMzVebAksCiOEP3nvR/j2kVDYQyv/Qo8w/e8v+fXujcJxAgArXfFSqDSX9rsRK5zLD8/TS8yyjkQmOHvHK+A/tDjxlzW405S7p+jNye7RHvNQXKpe8K9gimeCW9Pwo6KYrDo4eE6kSV5hqf3aK48UcT1hW/854CArpAwfGenaX9Ogu571IIZ8AVV+iTehnc0vkqzuE/5cf/Xca9O4AMOW7sE577Xpgjec60MU9z4BXCeeoh5f/UhzHe99byt4q1HLuncJ3rFJb8+/5ZtQQCcO3lm7TvmaVvEhnFyl/qpGCPA6wJ8JLS5EZTyCVugiMFan7j9wdmHTREyibcG0lzbZ1H5iSU822x55rf+Q/+XFTj+5POXap7pQEAkqOccaVlbNMMFkb1EffOECp/4YorTAl6vkSZ/+6tjv/i0RGCgEb/zA4AAgNgMY46vcywuLexolivK5Q1FmuqnO9A70TGP+Mq5ix0vXwXVvaLea8hYL53VnGPDCrWatL794Oga/G/49FCQrUac83PblQseOtZ2nfeIhDQAHu2B/bssLFnR8nb0efv3+aKK/SJ8r/pLYhPr+ocRsoPvreQIXvhjCbNfTvMkezZ4YSzjWsu84Rlyh94b4ZmLT9TFHXsOj8Di1QsuPf8sx7R2nfCd8k3ad/Da48yipX/LQ82/ujX3upY153yrEjpX1ZMv3LF5XAfgxWcZm/EzjWex1oCJZ+W+W2x55rf+R3wIFX6/UnnLtW90gAA6WPcHrCwyhnd4Da96zd/rX9ek1/wTnhmnyuUAO4DVNijjC5w3dTB+4eu157TC8/pcIUmNlID/75fjIf+YL/0QqSa794E1qB2fTe8WwNYEQh4Qr+ph/nugHcWYTpAA4FQkoLB95D3l5rtae7NlR7/1QuWP7hCvW0pblLj16Ke5iBpD2Jzo5tV2vNyf+yg+ArWsxrnqIcsfDxL9bT3ewFIDJLQE9DQQ8oDFeJtPx4EwHWfsndwXXm/4lm67dfxpvEdbfQd/IyMMu8NigL8JmENehQFau3jAQIqEhKLOSO/9q5/TRnH7OHuwN/zvnvgn/F1AtjsVr5tgL6pk2QU7o9vwf3/ewAyfTRPwwDSEKihR6aNzrToog4wUNDzMwHW76QrLl09HABkKK9j5OuH3nPzjbJXWQdoAG4c3nfCFVfLxf45uI5cYvt7V9phsM//ludU81xL8a6n/p73LABg3bzSMQiI5JFh9WQMKx0tc60B0QAhJ3x/q2FR0nMQXWIjnIckpDrIeq703TvAGtKuH1I2NbsQQ79pSbFR+UAhWm5VXMyM2vm+oUOA1hlbMr/0qPd9EmrCNH4J3xXiBuAefEVuzGrseWyEJcISOSnDVThHQ3Sw8Sy1Kt8xRoJyitZ1iLxCLOSll7oInnayiuQZvLZjrrh/QJdylu77dbxrWMN9MG9jxv7Bee8yrOCbCWuALnTZ19Y+niCXtPz3WMQZedfv4Q8Nd3xzwh4eDPw977vHwPwPhZsGlW/DNdRkFO4P8WxICKATsjtwnqYhTIOhmmki4D0g5S/7YMi/zxRwPxYg/m01r9JCMt2ga5Lkaz0ofwFSSfpLzhyGcObpHbUmW4PObrJ1RwknDAPHDUPbyF3rh7TjV+DheGwBgNDNyx3TEJPoCcS+xojZjTG8aZhUHFNK7KQP3t9qWZz0HESm7SC4agGp8+bEWGS5746xnSnlN5OuuCof55NPJvymU5nvaThUuFH5QI0TsmSSGcftcC7mA4eA47Ps1hMX5sc+hv09sIzRvdYfyA7gPch5zNXY8xNEJmqglKLpKpwlJqXWKmQy3PtzMOdCEFpQSK6DipB/7OenjsDpIBFsNQE3F3GWZO4fBr5jXBH61jO0OLiA09AaTLnSHuy8j/n5SEabJ2VmnZGPPID9MkDI6zP28DTEe2P23TPwkj1MIJxaaziryCjeH3ch3v6hKxQXmgQSq1RlXAai5ipkr2AxnSfgxe0kWS6EtxXI/tgA5rtkb60kkDIHIOsiSVY2BbwoGndjCkicS/Cd6/SO+J7ztI5am+0aAkVYRXSZCLCrrriugXg2irxcFgAI3bzcIQ1ohH3OBx3bd2pMfVxQ3EzLcG+sfjUIrGLt+jmFZbtKz5l2xY1w2gFBtShIt1rvngF2J1+/bGxq7nFt/WaYBAyyjUMbdRXmbYoACKYbaczdFbhv0r05lUkOwLtgNX0HYRitz7cInqQ9iKVxH1Rhzy9TOpEID8l/niGmermD01JfQpopppPNgQDCVLlNEpSLIHw4Le458Fc6CJzOwN7R9s0q7D3rLImCfgbEq5jv2KC9M09KvJsUb03CGiy64hr3rQn7eINSrpLOiLhgv/BK+XvvPheS4QslJW/e2L/zkfvuufd83IdMhtZAyqm1hqG0SW4C9IkrzffH6pXbrrhoFzbzkXocz4GXhMpfzuWGK7T+vqztIDULLv+574qrZlppmVgxNiQrZS+EvCgZRQdoaZxS/fRAec81WMdJIiW2QFiHPSLYMAlTYLkOwDB4+gQgN1gAoDtw83IHF/II5b9uUN7zLk3UJmwmyYXlFpXY5Yqv34QFwufs0HOkEc44seabSPmjwtmgRcd3X498d24Qsk1D68jFObPab2aBNYsCRtuoh8qB2nTFdREYJdcZubvbdABC97aKmXwAbrjb4CZEoYaFO1ZcaYVArZAPdjKrdM9rdcmbXWnxmErOkVaY6hWlcslZWoXv2CdBiYWupG/HrLLX611xkS1Mv8OaEbuutMxzzFkSS7VO8WRZ32E9A3PhWfE+SViDVVdaFIr3sXY+cC9rZ2SEUtRu+P17z++5R+D+b3V6UR7ev/z31r574YpL8mqpbVx0al/5Jq0zKDaWegypgJ/578U6/lLQSIoaSWEjbsgkc18PGVOYHio1IuR+UgZZqnvKv0vhp1BhJuy/EJKVshfuBLwoo2R4iV6RuczB4DnIuUJpeizkNUl7RwiB7Yp3G4vKyT0RAKC3eRS9XDEAgG9eztCqqLU7vQKWTBw/TyZq1xXKHsqEcnU7BADLdH0OQEDSc9ZdcTe8DJBh2NpcdcXVu44qeHcGAPvwG2z4gVagVs9bfsMCjtd23xWXF+UDJaVID1xpWWB2O7Ky24fNfppw753AvT/xFsZNyPbQlIZYeDIHoT3IdcMr2fPWWjYbc1LuWbJKU6PbFc/SQWBd5b258yPnVTcrOcxiie26QsniE3rOkStuZqSdJQGOjQkyAb8Dn4PPwFK4rHifB9bAqgoZu4/PAmcE+xe0eEVS4/fvc//tL12hWl4/WM9Ylhf73q/A3x8mAIC7rrgFMMsKLjt9SmuYo/2Brvp2AHD3XaHIkQYAUP5iTX1t7rlmCrcuP3KFMr5oSKDCPY4EAOskK629UEOZIJoXRavgeOiKCzfh2IN9LWu8RSCA5WuX4d3GsvIIAHAs0vq1XSUAkGYSVh31UA1sadpxTKjp2BUaeYTq21sAABslHLjS0qpS5xlrRGPDkGFg+Q4oFoLc86zCd0crmntSY9MPRKlaRy+tjveIsbZnrri8KB8ordmM5na0lF3WOKxymLHvAFtjHT5megPIYuiWZqXB7XHPKwAAFyAMQyMtADhNMS7n588BANBh7IFD2Ns891lX6Ix3BHtdq6yGihlL9spexl4EuLbH8P+ss9QGRKqkuvj4Hbh/ZO/sGIpXPBlp+0Kk3cfncEa0SpPtSvYQprFi6JXr5cs74t9zlz7e13WutJJhvytuwIQNwI5pDeWbsAXuPJ35V3B+uPDOrOGNPIS50uZeAyo4F7Leu+BZldDFJnkcYwFA0l5AkmaX4UVB/XUI3hns5LlMIeJNAGDYyZOrEwovpSfg3WYAwGON5+KqQgCyUH92xZ2TcJNiXJS7YJ0BGsOuXrtw2E4qAAB7irLbBcGI3cjQJTQGaUdWL/gzsKq2yQUe++59Tq/Nfe70bndYxhMPitUXXlN0h664peo6hCy43ey+YnWIhaMpuz0Id2Ar4C2497kh0KSl6XeQHlRruKVRaQioOa8CAJD1TBppAECacQiCWAMAXQl7YF8RlAKCcc9q/d5b6f7zrrTVdhZcxbi2ewDwsuSJYuCIIIZlwglZSLg39wAEaIoXvQCVAoDdwD7eA5DOZxS/NSnVj+XuIXjxVlxxJ71jI4aOqWQ1fn83AcDAfbIPFv8BzC+2Z9Y69bGnQSrVfZPAR9qIAAAhoMKNeJaIXMwEQc2YKMcD8NwwONiLgi3n11xx+2bhWKwpA8EDenmnievVE/BuSxvpE/K4mOGQapMAtd7JWSNuzfWZsTMUWgwrRMDZAjReDgBAl7wIrTVYnB1FIW2QZcRx7h1X3IlpF+Kqy8Q3iHn3bkOgnwSseowFHbrSnucoEFnR7RIRBRn6S660c1dOua/U0kf336pCNuN7I3g6p2/DObkF6Wj1rrT746yiNHIuuZtfLADYMg4ul+blhilNijBbTzGwnfWBsu69hsfukOZzBeZ+EbxWSeCCe7nj/U/JOlwEQbzi9J7rGnBsDYCYI1faFVC+Y5mewYCXPRlpAQCv2ZorLr08r7zHKSlM3m8xqX4zrrTBy5bi7s0pnBBOCeSWvBrAOFe8DNiC9yLBwyUAQFpEWxlJC5EAoJvCWevKPsKQxASkMHK2yJziSq8vgwOg8RLY4BDZvwHybk3hj7DhsO2K27HnFLCcgVRDTbeJB/vP4M05JiMgGgCkTQPUhC8qQy2uqwkscQXjAs9C2k6ajWkBAHSziNCSdL1FRSFlXWkrzEElRo8tQTch3jkNTPvYd7dcuggysHOW1srzJMAXYBLgGqWiTMKBmjFAlCU0kRsxp6QT4WHFEEcSKBIGbp1CwpyGtWDvR7aKAGDJlZZk5fKskxQjbVTIc/MRY0UBczsQH5wA5WZ1GTtVAOw4hUr2XXLray0unVMA2zSt7YrhmtQay1gg4wzACX77hALAzwOejLYyAACv2RycD9zHaMScJOy3pFS/Gfoucctz/D9Hc2+lBJYDAOZI5oSAuRQeeu7d5DVOr0kykQIAMBFSs/5FOXI9BqltMQ7/jWl1QqZLmwWg8RJWQOcdAfhccqWt6JETpoUOl8nQ0gxP7awjGTRL+oFHNABIUwhIi9G8po9YUpjdI4pyuQBBhOhnWNkQlXIAsG3qOCwqCpTXBsrmBcjCIUKXnLz7aMp3bzWIfQcgtHCDaNdYKLJTSQPkXOpByMHWFGJIaIpiHqZDKAVnBlxxN7cVEHQhQYMMXAYa3EseQV61AYCkmmlDvlGEjbCkO1xxrYjxwJgKgJkNIrkJyLAAAM4ntr/FZ2BfdCEOMQDIKHHpEwVgCCgZNp6hucYzsGcskJFVPB9Wr/gjg9XfUQYA0NYMSwoPG1bqKSlt3G9JqX4r4HHYh/dbB7DOSiKUEhgTAjhVDAaOuWvrLIWdWrx7/CUQ5TDEMZASAGhtg4+UvTDv9HoMAsStwjpPXfo6AJZM5rVYdsVt1dEFv0ccHA6trCheH24PbO2dLQNocxrpDHJSKikFzG6QHRA6HI/jVostAABQAVgKt9dQ6JUAALQQMgkhgx3FzTZDaNx6974y3r1JIQShpcyWDnsJrDCBWELofsRynFiO0kLhFwkeACyOlKFnjJGiWyCBdmrwRbqIgdtjpPwdEpnwKgAAN4uSAjciuHpcaQEPrBYp5Wx5DCrnKWfEtjHNrTlA2j0n8LAMHoZVAkyWt6iFPEaa0mCFPqAoW00xToIiCYEM7Tdaj/fTBGLcuGKthwCAtmZ9sP80T8d5AtBpVeTZlmGxHRrW3D48IykVFSs4dgQIxudwbtZBnlv8jQzt+Q7wBmB5984yAIC1F1BhYpyf6zFImIjTTrF2QdpKgB2K9b8N/KltCAGuwfxllVDzFpD+8PwgYLb0oOY9WgpkAWiFpMSb0GIBgGeQmtPsipuscNx1hQh8TNJYUGIwjZQmormAGflcFQAYVpiVW6TsGABo1isy9Ct9dyG49ZGnxPI2sAViEQVFYWAp4D44yN0A+gYMnsNrIiXNEAegXgkhYTezeSMOfZYQ+9IYuDPAhN2HuP8ukLOqCQDQysLWstglUaw8LOGJvS5EscjgFEYmxOJZmlfY7ZgapFmj50RMWqWslZMIgp4mwM8CAEBLA9NCarjnB+kZBwkggxWZ5n5nwpr2TiEAoK0Zno0ZhYdwmpAF0EYEaDQiOG57YsRzj42/17xnXMFxCFLXONRyApZqFvYfe580r1cf5KuHvA4xAMACd6ewF7aAWI0Da1tw7Qnu4JmmFwCfsQ0CYuuuuEbDoZL9wqEVNqQ440QLyTF/ZCoBAEy74nLXWI2z0QIA0vijFvJUudSqFnd9TRYHWp9c0EA7jG8SAFiTqS0Ev7sVvy733evIVZjkZmRwkA3EWhtdcTOgNhBMbYCMRwNZDocKL0Lcxa8US2OFiJbrkFlykJBvjP25NQbuOlgxHHaKBQB1HvQmZQFgoShhGC9BLJJBgBRJeer3fL2ffxlaBUckv2lhtBEQtpKCpbGmUcGfQyx5hzIAskoOPafoDQTSGDXX8EDC+Y45f0lKoj9ChizRM9ICAFwzBJ+oQJmsmKWUK64D0G68u5b9IaEs/ntOh8TBe/wVhMyQ07AIJN098CweAfjIEqHZakvMZYirDQAOwbO874rrFmAKN6Yycx0XzghpUIxb7CTa5IqbSvUaRiLqq3naD8zRYG4HG1IxAKAeUmZjAcCwK25y97d+HBYAwEpVmHLV64prPK9RrE5Dv5jHiCUNNSvaUtD91+gB0NzdMQAgzb2T3r3WFVd3G6O5ypEwxfdIcufK/D93hQIk2A6YK1utUaoeolrNu/DKOPR7FAOTqnRHrrjw0rKyb5pp/2kMXN57MQCAO6iF6gBgUaesK66StqKAAHQ33veegCeQA95ieFq2yfW6bZwleecnrrQQEM7NPuzPUxBaJ664SA9X0UPCVEZxnx8HSIDjZCCIMisXgMcAgN2Ic6gBgGMi1CJYfhiR/oVZGhqYYsDWpqRAc+aHZl2uOz3/n8cKec9aFRLqMrj5D+D9L+CM7yuW9JKR+cLeukoBAJOs+fosxdV3wBtw4krruHBN/BaXvjOkxkvIEehC8MpZFeitPID9gsYuehZyBgB4kRD2uwjs/1ZX6Jb5Yx8OCwBglzVOuRonK+MQXP/ZgLuyzRXX5Q7F0XfIesU+AVcBAPoMUqIV1x9NwV8YKIPAyJW7kPC0qZCqNiPc6Fi0474rtHZF5T/oSitbbSvP29AIJf6whA49VnDD+0llRikFPKNwRrqN/XegCN/5CACgdVDTDhSWMD0CAXMKAmCTQAC6Gy+V9GX1wjuKQul3dj0JLaVtyJU2e6lxepneZWIhS1ruOQj5PaeX0cVa+vWKy5pZ2btGRs0aXVspAEd3el8EjygNANCyH7BEL6d/YZxXU/5IekbAxgWPOCtkiVzIOxDTZmCwpmSPsEWuVdTjIk5HrriYEYdwZwhoIZjXvGqVAgCLz3IGABzj6qsQFuDaFla6ctrOkBYI5syJHXhH1AUL5K1kAiCHZCxPeCUAoAW8nZfF1O5bAIC7rCFLl4WVHDpMg7DQ7wtX6MwVYtKj4JulNLoNV1x0o1IAIESuccWaODfc+iMkDJkwiMp3HBTqaiQAwNrdXQoZkAt07ESS/4QB+9hQ/hLX5MpWIiRE2Wl1wVsSiD/cByBLVvWBKy4ZO01uO23/yTwcUaxtJgEAWB3UrB4MUswJLQ2sVonzMqOEXLSGLKhQ2NNyprD3R5Uw2iMPLKwyvXtkneJ7n7niimWa4hJgpOVl4x7UiE4bRGQ7SxBOaUi4vUBSvUoAgB36OC2XSac7CUBKAJvVKndKkSmoBHA/s6GBaXBjFJO3KuphyGKXlOepsv+00MnhNQOA1wQ4MS13gTxoWm0D9FKU0xlyPOCmZ3IplmhG794heOCQ28JcqwPisYicvRYPAHZZa0tIuTqHWBUqhzEF/Ur/79tGLj0jN3FpIcLbd5VXAtwmi0Vy9dkKY0bxJKU5afFKjNnOAapfc6V1Eqx3fwCs93bFZcgWWCz5T5QGNrRg5b9ELOBTAHds6WqdwV45vTmRVq5zFzwDKIzWyOplBbRGxCktHWrFAAChDmoZF+7CuOL0ym9HyrxjISDs+BbKJ8a8911isnNZ26f+LN10dplerJAnsX8keL0OuK4RGLECxLrsWJqVU51ywJ8I7fkewyDQ0oI5V7wcAIBx2BAAQBAeqrS4q4RRuKW1dD20WuUugZzYdcX5/0vOzv/HMU+u7lZnlwlnj+1qIJNhUQEAp4Fsi2qFAPh6K+Q0FuBJ7RsgJW1nSM2gyREAQH4MgiM8L1klRDAH1xwkeHHLBQCpOABPiWwwQIQutAy1an8aU7nWK7XHfoNklAOZBffqIRGv0PLaryAEgAJRiFwo3DnejfFB3KBalT4sfrQBpLdNsoaSit6IB6aOCB/MQEWWcAz5T9reckMLVv675B7ENDKOdaNF+pgyGLAgEJfrXCZQhBXUtsma7nN6nXtcS2sgAEjq3IetbrX8YGydHCJGTpHb7T4AOib+aTnXTB5iAtNzD9IvSyN/G8jYOCOeCFakPIB9qPVh4NQ1qzPbvittNnRC3gVm6FsNsNLUnOgrIxtHAwwhACDnrycA+rO0Xy3l/9jzqjRPAg/M/8e/x5xz7Xeaq3vASKljrhDvQy2kq5EntVr7V0ECPAso9FDWieWlSNsZUgMAR0qI5oDek73W2BhpB/hK6JnBYnJFzXtSAgBOXY/OAqhzeutItpAvFPfrFBGhmvwQ5qXEIDQhiC7QMyUlBpvRlAsAjl1xcQbs0rTnihvjcPqLIKn+gEI6c6WFHw4o7SPp3W8DAfOVkoPKaXl/iST/PfHgIsRoxjVg5T8bYLs/9eCijlJVhl1x/v8EuDsXlG9hZDxOYBEP+GuX3JRKuy5UgbEXYoM4hPsxocT7QvUrWhXr3yL+YSGbNVda8Q/X8VKZXHZf+1LhiBy40jK9C8T+5pLavH/Q7Wj1Zl8BV7/W5nkrwiITD1VMFkBSquFxQqphWgDw0sjbj5E/mvK/ZSjkrMI3OVH+PktEThxWJsOgoUyZ/DhLKWynCrEWLdyjAHmyWgAgJutkIAAGYwFATGfIUAhg1ZUWVjok4HYEYU6UQdIQaBe8O1qzNfTixtT+QN6MhDmi6wBwtTWNEY5CY5OsFbEceLRDDALdoGx9YtOcE4oTb1eBBLgLh+zIFTdTOCMUhsVXBiB/XnNJZ4FNy21Lj4FZm/Tu33uBgWTAUKnU15HkP2nYkcRoPqO0PFT+Q0Au6oDUPwEBWgEpKe4hVQCHINOABf6pkfetCfvYrpSxAKAJ2MGcG9wLgCY2XVQUydOA9Z+UYjmiZBXUuELjlU8NToqWUitzPk8WPOfos+WMoI5BwBKEeDZgrLnSGvlapUyxGmNyvzG8knHJxWK42JAGAELADc+eRloOgY1m8IqJ8v/G6aV4WZmfQPgEh/BdNACwY3gALGDF3z1hZHYhxwXJxqHmUZUCgIwrrfHACh1rPPQb4Z2zFAAgqSqklXWCYRC04k8AEEs4Z8uVNukSA/EIlL9VP6cB5rXLCJWcEZhfAQ93dCXAVmCqjiskhjNy16LSGQRBz6PPFaortRrxZ26eIJ36tsFlzzWqtaIfSRwAdsljkyAr3i3ZDEyKxI5QBwn3jAEA33r37iNAfF0KMmYyoJab30Yx4+8TGM0hy3+I1jPjClXAJJ9eKyE9BOvf48LlQZMAwKpL15kylyIEIKQpBCv9kBqUtl6ECMTnAesf0zotDke3K64rcOnFuWyNfNl7/UOXrqzyiCuto3+UEDuXcKCsrXhIxiE0IuEdGfMuXJ9ihlybSQqd10srynJquKZF6LMSP6SQEzOmQwAAi88kNckRsPYZcZ/WFTe+5ebn+D8PrX5GawAAaNwKjWCLHJcd8mRaTZcqBQBayI9Tn7EI2ZCzqzxq4FEDAFmXXBbaatS0DYoWw2LHlFKJoW5NP2y54r454lXBeiW1lGqttY7GLJ8d0HepugFmnF1tjdN/ZBNMBIaw7ZEY2OVKazJLjHVVyTddTIHwYkiAmzA5WORlPRDvfkXciDEAAasJ94xtBiR9758oqUOTLtz2l0lozcQY/zaB0XyisP2tNR1TiIBaEynptzDqCqU2R1xpvfgQAMDiUyuRQwOKIRIgVkrDb5R3HlLS4XIRAOAlxJKHDOv/3BBu/Yb1/7W3/t9P4QofgblPUyOjyWCvTwIJi/cGA5xTI0QloY1+I8/6wuC2jBhZRFoascwhEyVlrAfCZggAtN9ukAwcBPInet0u1+tj8nouEolPq/+/5PT8fyYALiqZOc2BEIAWMtRSbE8UsrHFNRL5WCkA6DE8JWcK+JiGkOISxeGPAjF9BOFbML8WAOimLCFu3LMJsgV1wLYr7Q4Y0g+o/EVXYg8DJIeHQtHnSrg7GgBo1cl2XXG/a2S7L0SMeUoNbCP2shDDFiGflStOaSx9C+3HpAFqymQJUsW0ePdLYNAzCJgz7rkMwCYGACAHgNOQZiIsK87Nf+bj85eM8a8CKV3nRAZLWlNN4GhtpHFNpwHsaR3jLA6AzPOUS+5OyfUcYtMAB0EILijvPEU5vXsG8YwBAGdzaJaN1np6SIn9s/X/B1dal+JICQvN09xzP4BQCKDVYK9Lu9UZY12Rj5AUotKIdgcQOtCEPobfjlxylcq0zO86BbgtGOdbK6EsJaZv+XP3kSuutzEJ+8rK/8cmXxxCwRRCAWMMyDWvIQNOzPefcqVFts4ANGicL85QqRQAWH1QNGLrMmTsrDu9h4bmGRlxpdU3jwOhlFDmDnpsVpX9tRjQDahzxNhCQxlJ9A+dXpsCQ9Hbhhc6FQDgmMq2wtDfUpBwaKyRku5wpcUVtil+uAwIN8TS19B+bB0AVhzSFY87SYnyf0ZpdAICRoA9rt0zDYEIswC4exhvWI28xYpD3Mbf5cfngbQgvFfMCLkcFwEJbwLCxQO7asShNTAjJYq1wh08phMAgFUIiK28dcgSWSJBg2fihPJ22RXMqZHsstMKYI1BfPwVKBNxJ3+SH3/Mj98a1jC+1xZ9h5aBoQGQQSC09Sleow3wzuEcybpiZsOBs+tTNCghrlA2wzI8B71XSHrU0mDTMr9fGiGA7YhwEocAxAPQDmGmQYO/gUBMczcjyByCkXGFhjHiMg6lAZ5CCGQ9Qd6+dsXtzrV04Gp5ANqV1NZNV1qnYBdCIJJWrBVm0sJpo4rXIATiQwoX4/w7IO/WII1damOwO551DjciaoAU0rtOLyaGlVs1L/Q2yIC5GACgMR4vJ/7PRG5IMzQ3vdaa8sAVqsNt0wLvgUA4VlxYaLGk6QbIVaAGwRXVTsq/xitUAQHSIKkPCG7aPdMAgPuutA7AiEEAzCkCjMl/rDg0l3HatbXc3VqM/JDiURjXxHQ0zj3mFsmdQMizxnAkANBKAXOcd195Z86lj6m+2EykHW7dfJ5gudYrzH+x/n9lhIaOXHGNjh1FWHINhm1lH3W4cP167azuQJoUd5PTQlR1AaG/T+mRO8r+OVEIyRqBMi3zO8QBSCKUWgDgFexli7yGvCbkaRwaYENGpyv0zRBSbqgQ0DmlXGv7/BDA+YUrLXw1q6R9VwoAmp1eJhst7jOFEMnFjdbJs2PthV1X2vRoUgHxWL1zSrG6jyimv0tp7FgHAJ/DOgcbEaHyvwnkcAkrYnO0qQgv9BSC7zQAQNjtUi86zdCEr8ViPHXFNdc5NeaMWJVcJ12suTSlgLkOdBcw3BvhMNV4ct49AAHSVKItoKDSAoAagziG7rAklyeS/1hxWE1UYtf2OCUAOItYUyvzQhRpg5+PFqc38MCyybEAgJsBWSzxnMLGPnOlDVM4DVas2xZnd5w8T0iPQ0Uief8S+/9dfvxCCQ9tEFg+Meb+zBX3BLAKAbUHcq1D63oSKYyfESeI2zwfAAg4Up5zTJ6OOYNAmZb5nQQALsoAAJpinDfi//NG/J8Jbc2gpP5W5c2H/WJKAWMTHZzbYwjfHIIOOFZIwggYYwBAKH2x0ZXWEpkHr9U+nEMtUwwrimJthq7AXtgLyJ5XAYW7AOBkVyGWHwcI4RoJuRWeV0vK/2svA7BHTyu8U5IXmsMLzWkAQLaCYVlfGkMVN9+JssA4gWJRaHXSNUWQc+EyidIJqtlvwpeQx/vAT/4NH9O75xdHWidbCqon8C5JpYA53xMJMTlArUnkP1EcnxmksXLWNBYAYNOf0JruutLGOmhVPPPf89ILZh4tzq4pn3Vx7YC1VC/rnbNOb5gyRoK5LuBGtvK4MT0OCzjdhFjyu/nx6/z4F1fcnx6FPAsk/I4j+oZQKWALAITOatL8dFFmA6dJYihgE553bDxni+SB1pTJkmnlAABcuzQAIOlco7fE+vtZes9Gf9/nHvA/coWKq1YzINkfBxFruOOKy9jivGln6oHCVp8gJR4qYMS1REYofRVd6ZwppvUUGXSl/WjYs7AekD31hsLFtFrMYON3Q+/npitt2oSySHTOEy+TUPl/CgTxR2CAxnqhBzm8kAQAcIIqHWuKksK4tsRItshtwpPILP1Jp7cbHiZX4jaMTVfaKlSYli/972v9IjyEPN7vvBX9jSs0eHngBZhwA+pASWmWH7+L5nLSAIBWo34bDlAM+e9jrziSKpHFjE0jVjZIMTI8ENxIBA8t1vbWMi/u+3l57NcFh1WxbSNhDwq6FwWLaT6bxkHeI3ZvkrB5pigRuT/Pp0Y+Qi/ODc/h+CA/3smP/8iPnzu93SsLpN3AN6wAuU5rBqRxAPCs7pYxP1gfXwpINUGq4YgrVJFchpS5ncA3zJM84LbMIZmmzf3LyLVbd8XFk7oiAEBXICVwA5j96xGpfvWgMO57uXTTg/5XCftjM2J/rBqK2zpTEsJsJLa6ZHkllTB+5oqb0GVgP8wCYdzKFBOC5Bjst3YIiT4iNz6T8Fj2PDcUbgayYqYBCKwY78aEaCYhy3kQnXPbn/mvvPL/4GfX8Qc2/JSxYOWMBac3eEF0twjMcZ7AtQBLXw47trsddMXFSpaJWDhnuFof+wV44JHWD959/o0Xvh97S/orDwhu+QPHCooPeuhdZiluXANEj5ga9fOR5D9RHKFa5LFj0XC1aodd1nQtsKbCUh83Mi9u+gNxx3/TXSDFaI2TZpU0K96DCJTuK+sU2ofLJGxGFWEjHhgmcs4p77aoWB+4jnf8OooX55L892/58T/8t3e44lLGLJCsbxDBN+m/QStj2+JKSwEvBtZ1NXJ+nkN66lP/rVxFcsIVl2BeoeesQArcBCl/TJ96kCDTtDr6dSnWbkZxGwuwxCwA7pehpQTK91h/z5k36On73u+Tr/xeqQvsj7nA/uA1XIiU6+1GCrOke09S9sKUsm4PFYu7H1J0J12hQyEOTDkWVzefR+HSZJSUViHhsex5YljdXPMEq5zOKVlsnBI9RCTkOjjronO+8LytP11yfq4LAHQpE1TpYAHTosQuJoGZP2sssMXSl8MuRD2sWDatDKt3+wOvaG569PWNt/o/9fHz9/xifOyV6tf+wKGCegApfO0J7zJF6TttrtA5Dt2ioRr1E+QFCbHGf+PsbmRpx7gyh3jYJ+B9tUOhHdpBYBQj+VI8L9/6+ZY5x8ZJPFeTEXsQD7isE8bRZo3DPO3vJ3UCQsKG98F4xHxy3X9cx/e8+/9f8+O/K0J+IFIg4TcI+1grYysEKHz/ycC6srBLmp+bfq+i5SfCdQgUB6+HPAe/geVBLfAnQjKNlVCTcYbHDdk2Rt4N5t984QE4d4TUUgKxvsJkRKofA43PvHz6k3+etT/GUyisiRRyndOYJVtK+qgM0RigdbtDyrbFFRfpEhf3GA0uOtYFPC7Zb/f9PHXR+zAJj4nfNwEE1Po1xKqn7H7ndxt1elE0fNZTWMevQedcyu3fX5756wIArcoEVToGScBosYtBV1x3XZvEYbqXsLjxsN8hdDasDE7x4yprX3kF/6lH7u971vVv/WL80R/oT/x1X/pFu6Gk8SW9ywCl73D3uFCN+mEFCL0MsMZ/6YorulWypvLeOIfaYR8xDsWYK25S0Qdr2kQH8CM/1596Afe5BwF3XHHrapmrTMQe5OI6nTTPSfsQU686A8IG90FvYN55PpPW8Z/z459IyLeRQBqOEEiinGX/cA17scx5bmPvnTQ/3/h1fKgI1x7YS7we2jd0GPLgRoJMG1DAw5PItRtUAA43bBLPDaZxcUogp/RZf8+pflwd8gMPEt/xCqUa+2MwUq43/uztn/+9/8Dh02qilzu6KEXliScw/cKnMv3OC7b3vZD71G/mb7zwu+2FUY3/ba2/T6OCxPoBYeGBbgYkKTWn++G6Vv9+9V5IPfUH9r4/yBJXE5T9kUfZ7/rD9hsfl/03/893/GFEZSWK/RW9cwYGpiDiIUdr4kMPRH7pleRLV6hSKBkJ3ZCVIPMic9MLqUOtisL9AQSKME+f+nfnzIfuwDM4s6IFiDgi9PH9W/113ZHv/QpY/PjeSXu4y3hGL+yHNrgH9jXgd+lQFGfM88u5773Ie/cY34ZWESrcJnBrhuYen8HguxnWLkkGtASu7SbA8NyF+zT0wHzJ+2CabmfgOfKbpPvj96b5zuaE7+wA0nHoXfkdXpJ1HDOPryhbqVJ53k7Wa8xc4/l/aFjT/QEQPpIALrn50u8VGfw4wbiKMaiQiHsXuGAvYJ67jFTlbpLtTyDkfItSRbso1bPb/x3Kvxewfzuc3odHG5jp9oJLAYcs1nIGW7kvKlD8Lw3FPwhoFosqdMJB7INY0ji4DjMVAAFxt70HQOB3foN85K/T3NXiAhx1hW55GB9iNx+Wgf0EnldPgqBPsdJiLScEAbf9d9aAkkZBqbFO+RkmA1URAB2Kxafdky2uZgW8xHiA2KocJY9Eb8BSwnfRXOcxzy/nvo8j7z1kCE8k+NWSy51drNqeGSaPDQLsNJ4ujOvydbIv0VuY1gvWANZuxngO/ibN/dN8Z+havGfSu2pey9aU8ygeh4HAM2KH5kENvT8XuKlX9l8fyMMJIww3A6ErDC9ZHRj/6GXl1165hkKGUwkhVSsV97H/lhcQMuqh840Dw5yvgHQu2WYhz5DlcULv3EDkQEPzFQKApPh52qHFuRsqUPys7AaJjTkHxCbMOeZ0GGFjTlUBCHxOQEC+6xP/TT8Qux8JazP+XeaJIYptYJEg8i2EJv5ExKkhABQYp50x4ntjBvFFmgfdBOXfnBBH1J4xQzHWDJAuaxNivhxjnlHi1tZ7x3BAJui9tdj1CJCmZgJ8FCbPxT5/Wpm30H2fR95bE57TRFTDuddIVlq8fToQM++ncxiSARlaZ752lNIF0/BgOp3da8T6Tcz9h8ErEvudoWvx+UnvOq0w1LtSziNyDqYqlOkahyr0/pNKeinvP+whggTWFSJ9agRT7Zw8NKz/OkUGI8FaI4TWB7wA6InmRnrTSj7+ON1bPEBYvEnjhoQ4J8hR0frwaL1ckJjbhgAgxFovZ2hM91cVKv5+RfFjPuaKknYoucySyrROLOJKgMB3BAQ+A17At7D5tB7j0vBjHVIcZ5R0MKwF/7W//+euuL3vJBwgZGqvGCx2LfWlyRUXn3lJXAZmEmuMcKxAJWzhoipUigAYSWB9x77348gsEH7GKqUSTQbSe5BFr6XPxTy/nPvWR957URGeXDGTc605zSq0npqQxOySJBmAvUb4Wi4Y1JYyE6bHlVYWXEz4Tej+nDUU+50DCdfi85PelVNke11xS++YecSCUYsVynMtiyr0/guuuMBUqyttMjUJe3pdyanfMVJMtXMiKXUh658rT24oKaExXoAmV9wCvc/ZfSeWXHGhIS2cYmWHhLJOMENH68Mzr/x9Ud0SBAChvPVyhlVesRLFP6qgRclVlRrRXJxDDjkWA+FuTWmBwCPKvRUg8K3/rlt+w0hqTKi4iFSk0oqSNACr+AfIVPiO0pTmQXBjwYxQ/rRV/EKe10QscMwl5trTu8phVetQGwJgHsDZlnJPq1sjepZqXXIdCC23XN5ZhIuAKMmX3qFrJQ96UbGuY+pQ4PND92XLKeneWrEUrXATsttx7rVCK7yeWt487uetBBkgNQVWFXmBfUNkr8TUwkChjdYd9hrR6meMJNyfa16MJnznEig761p+fibwrriu2HYdW3rHzCOXXi9Xnlt1VELvv+pK+7W0gyE06YoLP1lV9WIKWGGRqRjrH0sxc5vjGC+AeEUxbGn1ncDCSVY4JalltFZ3gmt0cB+eNZfQAVMDAFi5rpJKgFalrBsVKn5Bvaj4DwPP1ABAtgpA4JkCBH7w/13j/9+jCABwHAEA5F5Sq+COK62AJ+0t5fvwEHGVr1D5S+EdYKxMUKZsNKnHnlWeEexEFRAA8v5YQRAP/54iELm6XFIlSKkud+hKy3Xug4CWA8zCSGqzWyV0k56/YQg5674oiJLuzeVSrdLNnN++avwW5yYX2KNaJUWr4iVXFcwl7BVW0AeutBomllHGjqYClA5pnkIAAK/lXhvcez5n3Hc0cO1OAgDYgbMr8yLgYga4GbNw5nFOdhMAAH9jmqFVUm1RZGvSfkFXOZZ+xj4SWHkz5wr1/qXMNJ8T9Bo1pLD+N11xQ6A0XoAe8opiV0Vs+oXVSKcC4RStnHqSPuXzxH14tujvStYwBACyrrxqcdsJAOBuhYp/nRS/CE+r1rJ2yPZdaWnXWCAgTN8GBQg89ApbqgPKqAQA4H3keY+dXW741JXWs5f66VLTfz/goZECIxwrWwEFKs+ROu05ElzHAaFuCYADABJyv0P6JhSI08rBT+oFIULmBBSv9ETA+2OHsWP4JumMmXV6M6ak53Ot/mNYl1NFEOFeSLr3gQLENADQ6+yOa5rwzSXs0TT18rW+AqeBvZKBfSL9MKSFtfTDwAZfGVCQ2FlQOhNy58YBV9qpEZsMIcDQGjq9prmZBz4BX3tI8zGshACwac+FK23DOw3XboCSCZ0NDQAcR47Xzu6lYgGApF4LVvMn2X858optAxi3mlhxad001j/u7zReANxrSxRGxIZruLcXA+EUDQBcuHDvCfQA7NDZ2AAAfG6tYQwASFMpbjkCADyuUPHvKYqfXcS4IfiQrYIVWw4Q6DWAgCj+elfoBtcCoxwA0EIDn2cBAO7Ctw3KTzZI1pV2R5QYnVSh02Jle3APbCizrcTuLKEeEgDSxY67zElTkpwrbveZphnUHoCVfXDP7YPSyoEVJuh9F74p50pbKKMFGvP8I1oj7b5a85eke6OHZy8QAtC60R2BkNgz1vNNAIA+V1yOF5spHbnSbozcaEz2FbYMRvnQpwjRnCvt1DgF74CtdS9caVOnSVfa+4Gb/SBHaQBiv8vw3gI40eJdIEMmR+CCvWPdCgDYiRyHrrR9cDU8AJoSPoLzh/1BlsnbewiGxwEZfNjfJY31f+pKW5JbXgAsssZ7DcOIeBZkb69CmInDKb1lAgDt7OF+3KgWAIipEDcdCQBeVEnx75Li51LBvZC6NgAs2LkKgQCm/CAQqI/I600DAJJyjTUAgPFyPECrJLiOnN3YR9BuxkDL2G5W4tbYc164COuGJTugWHXY5VCQ/RJwPNiS21Tc5C0BJYlW7S4d1C0SdhKC2IPvWyGFoimIoYjn5+i+q664I9yZsxsYJd37EPbtWoAEmDGsXhQc1npqRNWrBADdAaV+6kpbg1tgIat4C/qc3q2RBeYKZEagF+IYzgN+6zS5/4/J/Y/KBdOCJxSP2Kmi4FdIGeYIIEyS/NMs1dDYIo9QVrk/yvO0HABuhoTfiV6MWfB4MOi5MOZU3OlprP8TCDlqXgCuHipegP+/vTNhrurKrrD/RFJJVyrpVJJOdztxOu60G8dl45HYQGOMQAxC84CMEEggCYSGEpLQAHb+8g3quiest94+d3h6MrT8fVWnusqN7nvv3nvO2WcPa09Z+HWn6GzBvV50thtelzBb9C7kQgAHLQyAXZtPagD4O9raAKhSh5tsYQCoGM5xNv6VYON3qeDvrNZWZT17MQTuW7mYGgIDDet6mxgATXQVtGFQak+5XHQ2uXCX4XZR39o3GQATRb6Pvfd619Kfecl2j/qG5xYAn4D3JTv4acaS9e+e2yR9IdOKAG99/Vwm7ZL8juUGG1zu81/Y6SZlg3tP+Bc9GACHcnpZkfc0VwYY5cS42/uh/O18TanqSRoA1yvc+n5qu1d0t8/eC9z538v39+ZkamC4a9///x15d30zauL+Hyo6m/Z4TkxaRw/lN6yah0Bb9KrrX5ukRbFqHymnYNU8hbtBCMJPxm2rAKaCvSKF4NxLM2mn9rQOHAZeFa02a3P637Zn6vkc6be6LstMJpSgXthNyZfalfBm9L2jJMBN8bRG+2m0Juw3MAD+/xptDYBbwRhqaQC4GE4vG782ktGN36WCL9qpXEU/ejEEljOGQKpDblLXO1djADTVVbguJT53ZeO9J5vbopzk2hoAuYmaO3lNSgZ0EjfSuv20IE0F7tSXdpLx8cQMhfXM6aLKTe4LWS52uSUZ4PPyfi4dwwDwhTp33V4MAI0TL4inKicEFLX41dCQekgiA9vFqk7SAIhKZ3UT2LPFNDIsfXOekUVdDQw/4XvegJ7MDiTUshdsRk3d/6rXr03S0iawIcbOc9lQItf/vCXGplNrlK2uYlv3LMT3PDCEo7bO6fptdQD8fXlueQa6JmkOgxus+nx8rrSN/edyAdzYVS+Ad1fV0Oe2XGdNjAwNzXqFlJcBPjYDwMONNysMgE3x2m1VeRF6MQCuyBjowQC4VXSK4Rxn43f1NJVRTVKxqdcLju8AABbVSURBVLlE8gYcxxBYDwwBFR6qq+vVERkAbXQVtN3nnaBCIiWBaHJmWwPAJ+qPgcFyR5Ikh4pOieOo0UbVhrFZMZokGNUlyj2ShaxJ8tJsyw2u7vN1oZ7qkwHgv21a7n0kBaz1yo/MnXxoORJPxSOQNlgtuzppD4Au4LNBhvWhnY7mA3doVaz4WpBnsJYJHfjGsVGRZBi5/yODNXVD1CZp08GmrCfybUtE1da8ydOmpbFer66CTHMZY2PPwkHajdCv31YJcLrCoxblGYxk3puqudLm9P/UPDuaXFrlBXCtBw2VPZWD46aF5pbMOzIl+1EyUh7JoWcvY0DeCAzjnZ/KADhfdPdjb/q3/kCOs/EPBxv/xfIhJa3lL8oX4nwfDIHdwBDQh1JX1+tDDYC2ugqucPjQKiS2pDxSy2leNjQAZgIX9Y/B32o8OIVBrkvJn/ccyF33QFzRufGyDwbAnDzvJtnL/TQA9PNPwgDQhXNQ7v+V8t3/xsoAF6z8TO+xz8NlWbR0UTxJA8B7y8/L6dpjwcsW0tnPZOhr0ugVCaXdtVDZoSUa6olsRxIlt4PE2pz7f87c4Z/JZuVqclp580w2Pfd8eCmcSs1+UXQq1t0wT8OCxdYPJb9HS27VuEien9TWuW0vgOgdeJmLUfdoADQ5/Wti6HIPXgBXe7wvz2tL3kstwUt5FO4duRmERjctt2epIp/C8wbWLb9oR+5Vh5bAmzAARgKX27ZkMbfZ+JOr3zf+z0o3TWrVe7ZPhsAzieNsBb9xtCIrNjcOGvybncxnaU3wE7uX+/ICbYtB8KKlAaCnmR9qYvDpvuYqF76qmMxtdCcwAOoNgLToum6Fho7m5MS6Ju+rbjbPpTJjJSiTOkkD4KKsMROZ8jqNeT6q2JTdWL1UbpQ3GpYDqqcknfYfW6XBusXvo3JCVdE7W3R3H9TTuXsB/te8Go8krKGu+dQi/VMLM6hy6II8950g4XC56BbdUuMi6e6nJmFXg6HzP2n1Rx6A3Ht8OygFbWIAtDn9P5R3qo0X4IYZpp5DsWVhle3MHLpluVG6mW9VzLurRV48aFW8Vlqiv+JehDflAXAFo5OqzT+u2JB7J/as9HDFEouiDOu6sdfw30UJmXeD+uED2STXxMXVNgcgqjF1D4Crwg0W3V3H0vNJC0eudrWt7kT0+RgAnQZA6jr2RfFaQGpAwnAzFeWx20HJZ3QSOUkDIHUE9E3aNQF2ZD6mqpL9oDxPs7ovlOvFYEU5YAoxrMo9V6+CbmIa68+5/2dsI9Euoaq6qafzjaJTC+NFEesDeE+E9Oy1acxk0aki6KV1O8GGo7Lb7k36sqjugKciaslrUJUDEHkW1Vulc/UgKMUdK7p7QtSd/h8U9boAkRfgema9f1506hToPa4qp4w28ycVnrfLRV4+eFHywLRMf8ESOQffhAGgruvjluTV1eaf1MavpYd6Q90iXKkZngNQNbzPgbtEd+QkvS5leA+LThGQOgMgueqiEpMfKtyqSXdcu44lsZWhiqQxdeWuyXeuG5EuPQZAtwFwtMl8VNZG/6HobMIyE3i8liyOqWGjKHu56f1R2eemBsC54DQXxer3JHnRk/908x2VxTOtC1cblgPqpr4msVzN1t+uOGW6+z91xtMuobouLkvezqEY9XsV5XmTQRhgMLh2k3K/u2JU5PJJvimqO+Bp1760tlRVAWwGVQDTmeeyH6xD6fm2Of3PmWepqRfgelAqnQS5NDyzIqGA9aJbNjrN1WgzXyg6mx+NWgJmVQOh1AzIGwppE6WBN2EAqKVb525vYghEJXl64rx0Qhu/ZkaPSQxsQq57v2LkqgBywzsdRi76Q4v1zMtpos4A8La9UYLJC3NBPpQysynbUObEUBsPNmm/rlvddZoTUYYxBkDeADgSL3mv6OwDoOWad6WaZMHimVVZ103uT3oXHgR17FUGgGZze9nrk+C7rQUn94dBKVrycmmXzrpywCrX8baVYzZx/58vXjfGUq0SdSc/KzqFjPS/5dz1mgj4rWwSdyxcWFfuNxMMryi5VOQ74GnnUZXs9vJiPdHrujIv13RvSJUOwLWWp//Zopk6oHsBklS65lMsS+L1kuRmPbGwtldsfJfZzL+XsvBRW5+/LqpbCI8F/62r3XivBsCFYxgA3l7WDQFtNtPEEIhq87VnsvbP7vfG7zd0UEpupjOTaKao1wGIxrRk1d7I1HJ7NnKq4X6YMQCWpSTN2/aqAIu6Nb1kb9HKD1XycjGwnnPCLoe2oC3YIjBv145qjDEAqg2Ad4NTy2ObS/ckqalJzDXnKdLvpQb+U9l8fqgxAD4rF7rLQcnesnmQ9IQceSt0sU0Jcl/baS5XDriVKenznIE9+Q6uVDgTxJGvWCw5kvnV0lT1CuTKVu/YJj3astyv6hDimhLfFfkOeEsWnrgt3ycnMLYblKEuSa6CagB4KbJWd7Q5/U9J2MWNksgLMCy5Z1q5ofuXdn3UTpMLRWdrYG1mFm3m4+bhHpDwyxfv9JMWm7jL07Y1AC7WJODNtTQEvDbfT5w3xVV5Ehu/ViBoyc2wuc9GKmKmUVKbj2GJqQ1UJMbsWAggdbXbkNO2bnS5tr0jmTCD6+Grql4qPUkx08fBRqbJi37dfUmuVDXDJXFNrxZ5lTEMgHoDwKVhc2VK6gE4yJxoxzLfy0MG2qXymST81nkAPileN9O6VlRrAuzLexQJuqSF+5IkyOm1h+2ZuHLmfnDqjHIGduU7uPqgtsT+qujuzOhZ+QeWe+H/v3rOVAxI3cWTRV5bYE8MiLoQZKQq6VLALie8HCTqei8Klz7WSqs1Cb9EuQq5XgBtTv/jRb1OgP/7W1K5kfaXSakI0KR19YjOihclJVX+2SB9503TcBMfyow2BsC5mkz8qZaGgNfme89kd9OcxMafKhAuSK7BNSnFGrSXv2kvAB3Xis6OhDkNc00CXBf3ZUpO0VBBVdtezbxesMVDjQDV1d8oOrtSRRvZUJDAuGFlSFE/g3W5NlUA/TMAUqnoMytHXS86O7TtZBLaPHs5bci6mG/aKXqnYQ7AR5Io56561wT4UUoYc82uUuz0KLTwsZTJDQTlgKvyW34suuWf5zKhrB8yCYjjRXfDragzo57wXeY3ahqkJ2eP3w8H71kykl4UnYp1dSOXM+TzaK9mTcs1GdsSo2ffqqD2pPxxO8hV8Nbgky1O/8NFvkFW1d98LeHlG5Kw6O1+x+y/pVBrylc7ev/O/SUYAJM1o6kBUFWSd1NuWlNDQC3GqGeyu5x849/pw8afSg+/FEPgT+VvuyTWYi/dAHVcLN0/5wK3lS4Ih0V3Z69tO9XsywYebThaknRPdAY2ZCF/UXR2n9sr6jXtm1xXu9LpIrDfgw7AyzdsALw8QQPgZZ8MgIOiu4vkbtHZfW3D6s4nxWiftez8Xdlk9uU62s61iQFwpjypf91QE8B1Ae4X3e2utanLZxWVBo+tTj1qAOWhLJWTjr6DJiB+WnSLMq0GuQdPLNdmPvi3h3Yq1tNq7v19WdTrbuzLd2lqANSJdeXajK9Kspy3pd61yqaVolOaWEMS54PfnA4kG5nTfC5nwP9Of0sKIf2p3NeSceMaCNF/G7BE9U/fdgNgruFoYgCcqajNv3IMQyD3maMZK1VfqONu/Elz4BMxBL4qN+pzxfHaAZ+TcXTdz8t7NxboAGwWr5vZuC71U1nUdovOPvTRhjNQdAqT6Gad7rt+lk7U7QrD4mrFddfkpLhbdPek3xZjb7mBAaDaAXUGQE5jIDpB7TQ0AKo+P3fdpgZA1bXbhgBS2d+uPc8dM64fBh62SNhrQ663F4TuVuRd3akwAD4oT+pfWcZ+1E9C71+UeZ9c7+eK1w1dzhavhXgi48Kft793Hobzd6PK/f9JpoxsRzwyLvObqxLwv2nynrUdTQ2AOq2O7ywRfFbW9RUJ8Xk44ankfi2IQTQm3p30fD3EoMNP8oOZqoHH9ncdyYbvnDYqDIBHLUedAfCfZTmSGgJflhPxwjENgaYGgG78S33Y+P9YLrB/LF6LD31sMcycAbDTwAD4pBwfl4v5maJbCVBDGz5xHsvzeRL8/10CEXLiGrLNWqs1fKKqamG6tx5aqLrukmTMrgXXXS1et9aMEowmxR39xHQDvPzGvUI5jYEpO6Hpv3OPU5vPr7pu9DzaXLsuCXDGSlWje74e5NmkhjuaY+PS3g8z7+Fa0d2FUUcUhvp9OZ8+z5zUc8/PT3k3zfV+dD/+KzAuPMcgd5/Tezdd8wyr3P8fZbyTfk9U5jfKF3h6jPeszVgtYvGvpvMoZehflOTHYcv90iRfTyjUJmdeznZNEis/t6qHBRsqa6yJ6TeLbol6HR1VFj8XA2Ctx1FlAPy2LEdKhsCH5Yb5aR8MgaYhAN349YXqdeP/j1fj38r/fb9cXD4oXrelvBgYAD4ho8miBsAH5f06+rzfSSWFGgELweTRiTMvG+1S0alLPWcJdUmgZNBKVLRsM5qoKftfu8fpKSy67rSVoD2sue59OwGkBV5ji4umG7BoWdKaF1KlMaAx2uiaeiJu8/lV142eR5tra7b75+W7+n4596JS1YWis/2v33O93+NWZXMtMOYWaq71ILjnUSLq70pjV0/qelrLPb/o/n0rrvcz5frzUXl/zgebQN19Hm/5DN39/2GQn1R1T4atYiD3N23eszZjUTZB3TybzqNkMP6PGQGe+3W3iDsWzklZ3ITF0pMmQcrtSOviTPl9dcwU3Q2tLhVxkzodd1Rn4ediABxn5AyAf3o1fiWGwPt9MgQWGyYBRpZkeqGGetz4f/1q/Ev5v++W/+33ksSktcy5CRlNFk1YOrpH/15e/zfiSksv+3T593PBxEmejWiCzUUCEVInfdlKVJLF/n2m9jddTyebdgPMXXdCamBz170r141qkrU50veBCIaW32hliOsMzIo2gmtW+DV1U2zz+XXX9efR5trXLNv9TLmZ/qbo7A6X3gnNXo5que/I/dbNP2fMzWbew5xAyd1MKep75Xsf9Xeven7R/Usa7h+XxvR7kmOgxsVJPkN1/3/Q4Hf4PRlo+Nubfse2QzfBtHk2nUcpRv+ZGAFR7tdE0S0oNCVJdKO2Tqsq4SflM70u68qYDf37lITn7/FI5u9S5v6V02oA5FyMvYzoNH40ef/u1fiH0hD413JD64chEC3IVzMTJrfxX+1x4//HV+PvX41flr/rt+Xv+VBqmb+1sp87DSbLN+UJRV24/1x+3gUpOxwSnYPcxBkp8opdXQIRxWud8vOip5DcdqM1EzUJUUTdAPW62qpZa2AnG1w3UiW7Lpv7RDB0Eqs2xEQgojEsSYu3ZXFyYY1R2RTbfH7ddf15tLl2Ov1/Wc6lP5Rz7FdBqWrVPZ+ya6f7fVkSmHTxVKGtyczzG635zSp28q7MI92or9Y8v+j+aS/3NJfUuDhvRvVJPMOvbT43/R16T+r+ps13bDtUbC3pwTSdR382gN6Bt9YAqHJ99eoyuhdk4f7Vq/E3pSHwy3JD64chEC3IlzMTZjzY+C+XFvo3PWz8v3g1/vrV+NvyN/26/LcfSB7AhcDtVTlZSvf/WTvBHX3mL3hjAQCgXwZAleurlxGdxrEAAQAA3jIDoM711XZEp/FvuNMAAABvlwGQEjKuS+xTx3VRL7po8dtbFSqBvQ5XS7oiccbbmZH+RmOUZzPx8gmLU2p8+ZaEBjTMkE0KsTj5zfIaOm5KHXz6fgMSEhgpr9nrGLas2Muisnic53CrsJaezBYAgNPrARhrsOFdkzr7iQZKgW2H6yWr3GIu+SzKUv6iYcb8XcmW1+TAUUk0zJaFFNWdmXIekag1a6/Ds+LT9xk75vNJSUUpmekSswUA4HQZAJqdPltXByk1s9PS7KBf425Q1nRblKNydaIqUqKZt4M1NfOPpBTvnlUJpBLCB1XCEEV1b+ZcTkTUmrXX4bKYXrt/nGcxrfX2zBYAgNNlAKjM5EKdEpJJJy72oBhYNbRn8mig/pVTirpXdLbDTNn0Q1J/r6p5a6JSlhMIuiM651lpyKKz7eZiw6oIFyl63ONYEY32CSnHmpbv0+uzWDTpzGvMFgCA02UAqAb2k2BEG55ujmt9HFEnL9f/dq3ox0V3O8xUrzpisp2qm79rmvmRRPCiNE7JdaNLfe4XRQq1ThfBddm3ehyRFrxe+/ExnsWKa7QzWwAATpcBMGONLbZrNrxIY3+3DyOnIugb7IY1G4laRKZwxbjoZ2srzQO5xkGmO2CSSH0qXaq0Lep0pi1qE2XEqDPbfsux28AAeCLNWdqMsEkLswUA4PR6ALQ96X4LA6BfI9fUZyZoIbsrfZvXpKnIrOQQqMxx2pwPpLf0RtlM6Ln1nd6QRhibYmysBZ2xIgPgZUXr2FuZzmy9jKYGwF7LgQEAAPAzMAC8S93RRveD9YLWEMCIdBVbOkb8OhrL0g51XHoqRy1kN6R3+bNys14KGr/4b1OvQeqqpW1MD0qDILUYTR6D9Bnefa0XA0BzAJbku7Qdy9J5LGdcrPc4MAAAAE65AeDNgCIDQE+83o72QR/HfemCNWJldlVGwF55Iva2nRre2Ajc8g+kH/VTaS+cDAsND6xb69KUHd9LCEArG+bLa/Yy5iVbP90vbfsadddrOlJyZTL8BpktAACn0wDwE2zO5T0siXXH2WCWMq1fdYO9EXQdi4yAbXHda8hCwxu5nt1zYggsS6LhZukK35SkuK7M+B6TAK+Xf5+0CWZ6HNPl89OuYUMi7TyXKZ1sMuasf/YAswUA4HQZANEJ9kVFkpnnAKz3cawGZW3nGxgBuaqFiXLjfVDRs3tK2pjeF0NAQxNL8jfei76XMsAr0royhVV6HbdFse+StX2dOsZwgaVvmS0AAKfLANBM+ZQ09sLc11UGwFYPSWbRyLnLv6oxAqp0C0YyPau1Z7eqDKZTs4c25k0YR3vRtxYC4q0DAIC3wQDwpLFnZey7LoHtp/IAnK0wAqZrlAtvWNvgqGf3oOn+T5bXVbnd6UAaN/Wiby0FzFsHAABvgwEQnehTTD3akH/qHID/rjACRhr0LhgMmvSkOPxAuZGnHgc3Mw16hsvPuyF/c7T5f8kbBAAAf6kGwIhkyy9bPF3V4MakA+B4H5LMcmO2PIXfRn4WAADg5AyA29aYRuPpD6Qsb7g8TWu3ucljJppFY1zc99/xhAAAAE7GANDWtFHr2ykpM6MjHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA28P/AfYIu0dbpReEAAAAAElFTkSuQmCC";
  return image;
}

function fnt() {
  return "info face=\"Lucida Sans Unicode\" size=32 bold=0 italic=0 charset=\"\" unicode=0 stretchH=100 smooth=1 aa=1 padding=4,4,4,4 spacing=-8,-8\ncommon lineHeight=51 base=36 scaleW=512 scaleH=256 pages=1 packed=0\npage id=0 file=\"lucidasansunicode.png\"\nchars count=97\nchar id=0       x=0    y=103  width=26   height=29   xoffset=-4   yoffset=11   xadvance=24   page=0    chnl=0\nchar id=10      x=0    y=0    width=0    height=0    xoffset=-4   yoffset=0    xadvance=0    page=0    chnl=0\nchar id=32      x=0    y=0    width=0    height=0    xoffset=-4   yoffset=0    xadvance=10   page=0    chnl=0\nchar id=33      x=310  y=71   width=12   height=32   xoffset=-4   yoffset=8    xadvance=10   page=0    chnl=0\nchar id=34      x=493  y=103  width=17   height=17   xoffset=-4   yoffset=6    xadvance=12   page=0    chnl=0\nchar id=35      x=343  y=71   width=28   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=36      x=214  y=0    width=22   height=36   xoffset=-4   yoffset=6    xadvance=20   page=0    chnl=0\nchar id=37      x=362  y=0    width=30   height=34   xoffset=-4   yoffset=7    xadvance=21   page=0    chnl=0\nchar id=38      x=371  y=71   width=29   height=32   xoffset=-4   yoffset=8    xadvance=22   page=0    chnl=0\nchar id=39      x=0    y=132  width=12   height=17   xoffset=-4   yoffset=6    xadvance=7    page=0    chnl=0\nchar id=40      x=61   y=0    width=16   height=38   xoffset=-4   yoffset=7    xadvance=10   page=0    chnl=0\nchar id=41      x=77   y=0    width=16   height=38   xoffset=-4   yoffset=7    xadvance=10   page=0    chnl=0\nchar id=42      x=460  y=103  width=20   height=21   xoffset=-4   yoffset=8    xadvance=15   page=0    chnl=0\nchar id=43      x=81   y=103  width=27   height=27   xoffset=-4   yoffset=13   xadvance=25   page=0    chnl=0\nchar id=44      x=480  y=103  width=13   height=18   xoffset=-4   yoffset=27   xadvance=10   page=0    chnl=0\nchar id=45      x=93   y=132  width=23   height=11   xoffset=-4   yoffset=21   xadvance=19   page=0    chnl=0\nchar id=46      x=80   y=132  width=13   height=13   xoffset=-4   yoffset=27   xadvance=10   page=0    chnl=0\nchar id=47      x=146  y=0    width=18   height=37   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=48      x=285  y=71   width=25   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=49      x=400  y=71   width=16   height=31   xoffset=-4   yoffset=9    xadvance=20   page=0    chnl=0\nchar id=50      x=120  y=71   width=23   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=51      x=143  y=71   width=22   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=52      x=165  y=71   width=25   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=53      x=190  y=71   width=22   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=54      x=416  y=71   width=25   height=31   xoffset=-4   yoffset=9    xadvance=20   page=0    chnl=0\nchar id=55      x=212  y=71   width=24   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=56      x=236  y=71   width=24   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=57      x=260  y=71   width=25   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=58      x=398  y=103  width=12   height=26   xoffset=-4   yoffset=14   xadvance=10   page=0    chnl=0\nchar id=59      x=441  y=71   width=12   height=31   xoffset=-4   yoffset=14   xadvance=10   page=0    chnl=0\nchar id=60      x=26   y=103  width=28   height=27   xoffset=-4   yoffset=13   xadvance=25   page=0    chnl=0\nchar id=61      x=12   y=132  width=28   height=16   xoffset=-4   yoffset=18   xadvance=25   page=0    chnl=0\nchar id=62      x=54   y=103  width=27   height=27   xoffset=-4   yoffset=13   xadvance=25   page=0    chnl=0\nchar id=63      x=322  y=71   width=21   height=32   xoffset=-4   yoffset=8    xadvance=14   page=0    chnl=0\nchar id=64      x=453  y=71   width=34   height=31   xoffset=-4   yoffset=9    xadvance=27   page=0    chnl=0\nchar id=65      x=392  y=0    width=29   height=32   xoffset=-4   yoffset=8    xadvance=22   page=0    chnl=0\nchar id=66      x=421  y=0    width=23   height=32   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=67      x=444  y=0    width=28   height=32   xoffset=-4   yoffset=8    xadvance=22   page=0    chnl=0\nchar id=68      x=472  y=0    width=28   height=32   xoffset=-4   yoffset=8    xadvance=24   page=0    chnl=0\nchar id=69      x=0    y=39   width=23   height=32   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=70      x=23   y=39   width=22   height=32   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=71      x=45   y=39   width=28   height=32   xoffset=-4   yoffset=8    xadvance=23   page=0    chnl=0\nchar id=72      x=73   y=39   width=27   height=32   xoffset=-4   yoffset=8    xadvance=24   page=0    chnl=0\nchar id=73      x=100  y=39   width=12   height=32   xoffset=-4   yoffset=8    xadvance=9    page=0    chnl=0\nchar id=74      x=125  y=0    width=21   height=37   xoffset=-4   yoffset=8    xadvance=10   page=0    chnl=0\nchar id=75      x=112  y=39   width=25   height=32   xoffset=-4   yoffset=8    xadvance=21   page=0    chnl=0\nchar id=76      x=137  y=39   width=23   height=32   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=77      x=160  y=39   width=31   height=32   xoffset=-4   yoffset=8    xadvance=28   page=0    chnl=0\nchar id=78      x=191  y=39   width=27   height=32   xoffset=-4   yoffset=8    xadvance=24   page=0    chnl=0\nchar id=79      x=218  y=39   width=31   height=32   xoffset=-4   yoffset=8    xadvance=25   page=0    chnl=0\nchar id=80      x=249  y=39   width=23   height=32   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=81      x=182  y=0    width=32   height=36   xoffset=-4   yoffset=8    xadvance=25   page=0    chnl=0\nchar id=82      x=272  y=39   width=25   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=83      x=297  y=39   width=22   height=32   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=84      x=319  y=39   width=28   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=85      x=347  y=39   width=26   height=32   xoffset=-4   yoffset=8    xadvance=22   page=0    chnl=0\nchar id=86      x=373  y=39   width=28   height=32   xoffset=-4   yoffset=8    xadvance=21   page=0    chnl=0\nchar id=87      x=401  y=39   width=35   height=32   xoffset=-4   yoffset=8    xadvance=27   page=0    chnl=0\nchar id=88      x=436  y=39   width=27   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=89      x=463  y=39   width=27   height=32   xoffset=-4   yoffset=8    xadvance=20   page=0    chnl=0\nchar id=90      x=0    y=71   width=25   height=32   xoffset=-4   yoffset=8    xadvance=19   page=0    chnl=0\nchar id=91      x=0    y=0    width=15   height=39   xoffset=-4   yoffset=6    xadvance=10   page=0    chnl=0\nchar id=92      x=164  y=0    width=18   height=37   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=93      x=15   y=0    width=15   height=39   xoffset=-4   yoffset=6    xadvance=10   page=0    chnl=0\nchar id=94      x=435  y=103  width=25   height=25   xoffset=-4   yoffset=9    xadvance=20   page=0    chnl=0\nchar id=95      x=116  y=132  width=23   height=11   xoffset=-4   yoffset=31   xadvance=16   page=0    chnl=0\nchar id=96      x=40   y=132  width=15   height=14   xoffset=-4   yoffset=6    xadvance=20   page=0    chnl=0\nchar id=97      x=108  y=103  width=24   height=26   xoffset=-4   yoffset=14   xadvance=18   page=0    chnl=0\nchar id=98      x=236  y=0    width=23   height=34   xoffset=-4   yoffset=6    xadvance=20   page=0    chnl=0\nchar id=99      x=132  y=103  width=22   height=26   xoffset=-4   yoffset=14   xadvance=16   page=0    chnl=0\nchar id=100     x=259  y=0    width=24   height=34   xoffset=-4   yoffset=6    xadvance=20   page=0    chnl=0\nchar id=101     x=154  y=103  width=23   height=26   xoffset=-4   yoffset=14   xadvance=18   page=0    chnl=0\nchar id=102     x=283  y=0    width=21   height=34   xoffset=-4   yoffset=6    xadvance=12   page=0    chnl=0\nchar id=103     x=25   y=71   width=24   height=32   xoffset=-4   yoffset=14   xadvance=20   page=0    chnl=0\nchar id=104     x=304  y=0    width=23   height=34   xoffset=-4   yoffset=6    xadvance=20   page=0    chnl=0\nchar id=105     x=490  y=39   width=12   height=32   xoffset=-4   yoffset=8    xadvance=9    page=0    chnl=0\nchar id=106     x=41   y=0    width=20   height=38   xoffset=-4   yoffset=8    xadvance=10   page=0    chnl=0\nchar id=107     x=327  y=0    width=23   height=34   xoffset=-4   yoffset=6    xadvance=19   page=0    chnl=0\nchar id=108     x=350  y=0    width=12   height=34   xoffset=-4   yoffset=6    xadvance=9    page=0    chnl=0\nchar id=109     x=177  y=103  width=32   height=26   xoffset=-4   yoffset=14   xadvance=30   page=0    chnl=0\nchar id=110     x=209  y=103  width=23   height=26   xoffset=-4   yoffset=14   xadvance=20   page=0    chnl=0\nchar id=111     x=410  y=103  width=25   height=25   xoffset=-4   yoffset=15   xadvance=20   page=0    chnl=0\nchar id=112     x=49   y=71   width=23   height=32   xoffset=-4   yoffset=14   xadvance=20   page=0    chnl=0\nchar id=113     x=72   y=71   width=24   height=32   xoffset=-4   yoffset=14   xadvance=20   page=0    chnl=0\nchar id=114     x=232  y=103  width=18   height=26   xoffset=-4   yoffset=14   xadvance=13   page=0    chnl=0\nchar id=115     x=250  y=103  width=20   height=26   xoffset=-4   yoffset=14   xadvance=16   page=0    chnl=0\nchar id=116     x=487  y=71   width=20   height=28   xoffset=-4   yoffset=12   xadvance=12   page=0    chnl=0\nchar id=117     x=270  y=103  width=23   height=26   xoffset=-4   yoffset=14   xadvance=20   page=0    chnl=0\nchar id=118     x=293  y=103  width=24   height=26   xoffset=-4   yoffset=14   xadvance=17   page=0    chnl=0\nchar id=119     x=317  y=103  width=32   height=26   xoffset=-4   yoffset=14   xadvance=25   page=0    chnl=0\nchar id=120     x=349  y=103  width=25   height=26   xoffset=-4   yoffset=14   xadvance=20   page=0    chnl=0\nchar id=121     x=96   y=71   width=24   height=32   xoffset=-4   yoffset=14   xadvance=17   page=0    chnl=0\nchar id=122     x=374  y=103  width=24   height=26   xoffset=-4   yoffset=14   xadvance=18   page=0    chnl=0\nchar id=123     x=93   y=0    width=16   height=38   xoffset=-4   yoffset=7    xadvance=10   page=0    chnl=0\nchar id=124     x=30   y=0    width=11   height=39   xoffset=-4   yoffset=6    xadvance=12   page=0    chnl=0\nchar id=125     x=109  y=0    width=16   height=38   xoffset=-4   yoffset=7    xadvance=10   page=0    chnl=0\nchar id=126     x=55   y=132  width=25   height=14   xoffset=-4   yoffset=20   xadvance=20   page=0    chnl=0\nkernings count=0\n";
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var group = _ref.group;
  var panel = _ref.panel;


  var interaction = (0, _interaction2.default)(panel);

  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('onReleased', handleOnRelease);

  var tempMatrix = new THREE.Matrix4();

  var oldParent = void 0;

  function handleOnPress() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var inputObject = _ref2.inputObject;


    var folder = group.folder;
    if (folder === undefined) {
      return;
    }

    tempMatrix.getInverse(inputObject.matrixWorld);

    folder.matrix.premultiply(tempMatrix);
    folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);

    oldParent = folder.parent;
    inputObject.add(folder);
  }

  function handleOnRelease() {
    var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var inputObject = _ref3.inputObject;

    var folder = group.folder;
    if (folder === undefined) {
      return;
    }
    if (oldParent === undefined) {
      return;
    }
    folder.matrix.premultiply(inputObject.matrixWorld);
    folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);
    oldParent.add(folder);
    oldParent = undefined;
  }

  return interaction;
}

},{"./interaction":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = DATGUIVR;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

var _checkbox = require('./checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

var _folder = require('./folder');

var _folder2 = _interopRequireDefault(_folder);

var _dropdown = require('./dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _sdftext = require('./sdftext');

var SDFText = _interopRequireWildcard(_sdftext);

var _font = require('./font');

var Font = _interopRequireWildcard(_font);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function DATGUIVR() {

  /*
    SDF font
  */
  var textCreator = SDFText.creator();

  /*
    Lists.
    InputObjects are things like VIVE controllers, cardboard headsets, etc.
    Controllers are the DAT GUI sliders, checkboxes, etc.
    HitscanObjects are anything raycasts will hit-test against.
  */
  var inputObjects = [];
  var controllers = [];
  var hitscanObjects = [];

  var mouseEnabled = false;

  function setMouseEnabled(flag) {
    mouseEnabled = flag;
  }

  /*
    The default laser pointer coming out of each InputObject.
  */
  var laserMaterial = new THREE.LineBasicMaterial({ color: 0x55aaff, transparent: true, blending: THREE.AdditiveBlending });
  function createLaser() {
    var g = new THREE.Geometry();
    g.vertices.push(new THREE.Vector3());
    g.vertices.push(new THREE.Vector3(0, 0, 0));
    return new THREE.Line(g, laserMaterial);
  }

  /*
    A "cursor", eg the ball that appears at the end of your laser.
  */
  var cursorMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, blending: THREE.AdditiveBlending });
  function createCursor() {
    return new THREE.Mesh(new THREE.SphereGeometry(0.006, 4, 4), cursorMaterial);
  }

  /*
    Creates a generic Input type.
    Takes any THREE.Object3D type object and uses its position
    and orientation as an input device.
      A laser pointer is included and will be updated.
    Contains state about which Interaction is currently being used or hover.
  */
  function createInput() {
    var inputObject = arguments.length <= 0 || arguments[0] === undefined ? new THREE.Group() : arguments[0];

    return {
      raycast: new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3()),
      laser: createLaser(),
      cursor: createCursor(),
      object: inputObject,
      pressed: false,
      gripped: false,
      state: {
        currentHover: undefined,
        currentInteraction: undefined,
        events: new _events2.default()
      }
    };
  }

  /*
    MouseInput is a special input type that is on by default.
    Allows you to click on the screen when not in VR for debugging.
  */
  var mouseInput = createMouseInput();

  function createMouseInput() {
    var mouse = new THREE.Vector2(-1, -1);

    window.addEventListener('mousemove', function (event) {
      mouse.x = event.clientX / window.innerWidth * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);

    window.addEventListener('mousedown', function (event) {
      input.pressed = true;
    }, false);

    window.addEventListener('mouseup', function (event) {
      input.pressed = false;
    }, false);

    var input = createInput();
    input.mouse = mouse;
    return input;
  }

  /*
    Public function users run to give DAT GUI an input device.
    Automatically detects for ViveController and binds buttons + haptic feedback.
      Returns a laser pointer so it can be directly added to scene.
      The laser will then have two methods:
    laser.pressed(), laser.gripped()
      These can then be bound to any button the user wants. Useful for binding to
    cardboard or alternate input devices.
      For example...
      document.addEventListener( 'mousedown', function(){ laser.pressed( true ); } );
  */
  function addInputObject(object) {
    var input = createInput(object);

    input.laser.add(input.cursor);

    input.laser.pressed = function (flag) {
      input.pressed = flag;
    };

    input.laser.gripped = function (flag) {
      input.gripped = flag;
    };

    input.laser.cursor = input.cursor;

    if (THREE.ViveController && object instanceof THREE.ViveController) {
      bindViveController(input.state, object, input.laser.pressed, input.laser.gripped);
    }

    inputObjects.push(input);

    return input.laser;
  }

  /*
    Here are the main dat gui controller types.
  */

  function addSlider(object, propertyName) {
    var min = arguments.length <= 2 || arguments[2] === undefined ? 0.0 : arguments[2];
    var max = arguments.length <= 3 || arguments[3] === undefined ? 100.0 : arguments[3];

    var slider = (0, _slider2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object, min: min, max: max,
      initialValue: object[propertyName]
    });

    controllers.push(slider);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(slider.hitscan));

    return slider;
  }

  function addCheckbox(object, propertyName) {
    var checkbox = (0, _checkbox2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object,
      initialValue: object[propertyName]
    });

    controllers.push(checkbox);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(checkbox.hitscan));

    return checkbox;
  }

  function addButton(object, propertyName) {
    var button = (0, _button2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object
    });

    controllers.push(button);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(button.hitscan));
    return button;
  }

  function addDropdown(object, propertyName, options) {
    var dropdown = (0, _dropdown2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object, options: options
    });

    controllers.push(dropdown);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(dropdown.hitscan));
    return dropdown;
  }

  /*
    An implicit Add function which detects for property type
    and gives you the correct controller.
      Dropdown:
      add( object, propertyName, objectType )
      Slider:
      add( object, propertyOfNumberType, min, max )
      Checkbox:
      add( object, propertyOfBooleanType )
      Button:
      add( object, propertyOfFunctionType )
  */

  function add(object, propertyName, arg3, arg4) {

    if (object === undefined) {
      console.warn('object is undefined');
      return new THREE.Group();
    } else if (object[propertyName] === undefined) {
      console.warn('no property named', propertyName, 'on object', object);
      return new THREE.Group();
    }

    if (isObject(arg3) || isArray(arg3)) {
      return addDropdown(object, propertyName, arg3);
    }

    if (isNumber(object[propertyName])) {
      return addSlider(object, propertyName, arg3, arg4);
    }

    if (isBoolean(object[propertyName])) {
      return addCheckbox(object, propertyName);
    }

    if (isFunction(object[propertyName])) {
      return addButton(object, propertyName);
    }

    //  add couldn't figure it out, so at least add something THREE understands
    return new THREE.Group();
  }

  /*
    Creates a folder with the name.
      Folders are THREE.Group type objects and can do group.add() for siblings.
    Folders will automatically attempt to lay its children out in sequence.
  */

  function addFolder(name) {
    var folder = (0, _folder2.default)({
      textCreator: textCreator,
      name: name
    });

    controllers.push(folder);
    if (folder.hitscan) {
      hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(folder.hitscan));
    }

    return folder;
  }

  /*
    Perform the necessary updates, raycasts on its own RAF.
  */

  var tPosition = new THREE.Vector3();
  var tDirection = new THREE.Vector3(0, 0, -1);
  var tMatrix = new THREE.Matrix4();

  function update() {
    requestAnimationFrame(update);

    if (mouseEnabled) {
      mouseInput.intersections = performMouseInput(hitscanObjects, mouseInput);
    }

    inputObjects.forEach(function () {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var box = _ref.box;
      var object = _ref.object;
      var raycast = _ref.raycast;
      var laser = _ref.laser;
      var cursor = _ref.cursor;
      var index = arguments[1];

      object.updateMatrixWorld();

      tPosition.set(0, 0, 0).setFromMatrixPosition(object.matrixWorld);
      tMatrix.identity().extractRotation(object.matrixWorld);
      tDirection.set(0, 0, -1).applyMatrix4(tMatrix).normalize();

      raycast.set(tPosition, tDirection);

      laser.geometry.vertices[0].copy(tPosition);

      //  debug...
      // laser.geometry.vertices[ 1 ].copy( tPosition ).add( tDirection.multiplyScalar( 1 ) );

      var intersections = raycast.intersectObjects(hitscanObjects, false);
      parseIntersections(intersections, laser, cursor);

      inputObjects[index].intersections = intersections;
    });

    var inputs = inputObjects.slice();

    if (mouseEnabled) {
      inputs.push(mouseInput);
    }

    controllers.forEach(function (controller) {
      controller.update(inputs);
    });
  }

  function parseIntersections(intersections, laser, cursor) {
    if (intersections.length > 0) {
      var firstHit = intersections[0];
      laser.geometry.vertices[1].copy(firstHit.point);
      laser.visible = true;
      laser.geometry.computeBoundingSphere();
      laser.geometry.computeBoundingBox();
      laser.geometry.verticesNeedUpdate = true;
      cursor.position.copy(firstHit.point);
      cursor.visible = true;
    } else {
      laser.visible = false;
      cursor.visible = false;
    }
  }

  function performMouseInput(hitscanObjects) {
    var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var box = _ref2.box;
    var object = _ref2.object;
    var raycast = _ref2.raycast;
    var laser = _ref2.laser;
    var cursor = _ref2.cursor;
    var mouse = _ref2.mouse;

    raycast.setFromCamera(mouse, camera);
    var intersections = raycast.intersectObjects(hitscanObjects, false);
    parseIntersections(intersections, laser, cursor);
    return intersections;
  }

  update();

  /*
    Public methods.
  */

  return {
    addInputObject: addInputObject,
    add: add,
    addFolder: addFolder,
    setMouseEnabled: setMouseEnabled
  };
}

/*
  Set to global scope if exporting as a standalone.
*/

if (window) {
  window.DATGUIVR = DATGUIVR;
}

/*
  Bunch of state-less utility functions.
*/

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isBoolean(n) {
  return typeof n === 'boolean';
}

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

//  only {} objects not arrays
//                    which are technically objects but you're just being pedantic
function isObject(item) {
  return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
}

function isArray(o) {
  return Array.isArray(o);
}

/*
  Controller-specific support.
*/

function bindViveController(inputState, controller, pressed, gripped) {
  controller.addEventListener('triggerdown', function () {
    return pressed(true);
  });
  controller.addEventListener('triggerup', function () {
    return pressed(false);
  });
  controller.addEventListener('gripsdown', function () {
    return gripped(true);
  });
  controller.addEventListener('gripsup', function () {
    return gripped(false);
  });

  var gamepad = controller.getGamepad();
  inputState.events.on('onControllerHeld', function (input) {
    if (input.object === controller) {
      if (gamepad && gamepad.hapticActuators.length > 0) {
        gamepad.hapticActuators[0].pulse(0.3, 0.3);
      }
    }
  });
}

},{"./button":1,"./checkbox":2,"./dropdown":4,"./folder":5,"./font":6,"./sdftext":11,"./slider":13,"events":19}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createInteraction;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createInteraction(hitVolume) {
  var events = new _events2.default();

  var states = new WeakMap();

  var anyHover = false;
  var anyPressing = false;

  // const state = {
  //   hover: false,
  //   pressed: false,
  //   gripped: false,
  // };

  function isMainInteraction(guiState) {
    return guiState.currentInteraction === interaction;
  }

  function hasMainInteraction(guiState) {
    return guiState.currentInteraction !== undefined;
  }

  function setMainInteraction(guiState) {
    guiState.currentInteraction = interaction;
  }

  function clearMainInteraction(guiState) {
    guiState.currentInteraction = undefined;
  }

  var tVector = new THREE.Vector3();

  function update(inputObjects) {

    anyHover = false;
    anyPressing = false;

    inputObjects.forEach(function (input) {

      var state = states.get(input);
      if (state === undefined) {
        states.set(input, {
          hover: false,
          pressed: false,
          gripped: false
        });
        state = states.get(input);
      }

      state.lastHover = state.hover;
      state.hover = false;

      var hitPoint = void 0;
      var hitObject = void 0;

      if (input.intersections.length <= 0) {
        state.hover = false;
        hitPoint = tVector.setFromMatrixPosition(input.cursor.matrixWorld).clone();
        hitObject = input.cursor;
      } else {
        hitPoint = input.intersections[0].point;
        hitObject = input.intersections[0].object;
      }

      if (hasMainInteraction(input.state) === false && hitVolume === hitObject) {
        state.hover = true;
        anyHover = true;
      }

      var used = performStateEvents(input, state, hitObject, hitPoint, 'pressed', 'onPressed', 'pressing', 'onReleased');
      used = used || performStateEvents(input, state, hitObject, hitPoint, 'gripped', 'onGripped', 'gripping', 'onReleaseGrip');

      if (used === false && isMainInteraction(input.state)) {
        clearMainInteraction(input.state);
      }
    });
  }

  function performStateEvents(input, state, hitObject, hitPoint, stateToCheck, clickName, holdName, releaseName) {
    if (input[stateToCheck] && state.hover && hasMainInteraction(input.state) === false) {
      if (state[stateToCheck] === false) {
        state[stateToCheck] = true;
        setMainInteraction(input.state);

        events.emit(clickName, {
          hitObject: hitObject,
          inputObject: input.object,
          point: hitPoint
        });
      }
    }

    if (input[stateToCheck] === false && isMainInteraction(input.state)) {
      state[stateToCheck] = false;
      events.emit(releaseName, {
        hitObject: hitObject,
        inputObject: input.object,
        point: hitPoint
      });
    }

    if (state[stateToCheck]) {
      events.emit(holdName, {
        hitObject: hitObject,
        inputObject: input.object,
        point: hitPoint
      });

      anyPressing = true;

      input.state.events.emit('onControllerHeld', input);
    }

    return state[stateToCheck];
  }

  var interaction = {
    hovering: function hovering() {
      return anyHover;
    },
    pressing: function pressing() {
      return anyPressing;
    },
    update: update,
    events: events
  };

  return interaction;
}

},{"events":19}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_WIDTH = exports.PANEL_VALUE_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = exports.PANEL_MARGIN = exports.PANEL_SPACING = exports.PANEL_DEPTH = exports.PANEL_HEIGHT = exports.PANEL_WIDTH = undefined;
exports.alignLeft = alignLeft;
exports.createPanel = createPanel;
exports.createControllerIDBox = createControllerIDBox;

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function alignLeft(obj) {
  if (obj instanceof THREE.Mesh) {
    obj.geometry.computeBoundingBox();
    var width = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.max.y;
    obj.geometry.translate(width, 0, 0);
    return obj;
  } else if (obj instanceof THREE.Geometry) {
    obj.computeBoundingBox();
    var _width = obj.boundingBox.max.x - obj.boundingBox.max.y;
    obj.translate(_width, 0, 0);
    return obj;
  }
}

function createPanel(width, height, depth) {
  var panel = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), SharedMaterials.PANEL);
  panel.geometry.translate(width * 0.5, 0, 0);
  Colors.colorizeGeometry(panel.geometry, Colors.DEFAULT_BACK);
  return panel;
}

function createControllerIDBox(height, color) {
  var panel = new THREE.Mesh(new THREE.BoxGeometry(CONTROLLER_ID_WIDTH, height, CONTROLLER_ID_DEPTH), SharedMaterials.PANEL);
  panel.geometry.translate(CONTROLLER_ID_WIDTH * 0.5, 0, 0);
  Colors.colorizeGeometry(panel.geometry, color);
  return panel;
}

var PANEL_WIDTH = exports.PANEL_WIDTH = 1.0;
var PANEL_HEIGHT = exports.PANEL_HEIGHT = 0.07;
var PANEL_DEPTH = exports.PANEL_DEPTH = 0.01;
var PANEL_SPACING = exports.PANEL_SPACING = 0.002;
var PANEL_MARGIN = exports.PANEL_MARGIN = 0.005;
var PANEL_LABEL_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = 0.06;
var PANEL_VALUE_TEXT_MARGIN = exports.PANEL_VALUE_TEXT_MARGIN = 0.02;
var CONTROLLER_ID_WIDTH = exports.CONTROLLER_ID_WIDTH = 0.02;
var CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_DEPTH = 0.005;

},{"./colors":3,"./sharedmaterials":12}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMaterial = createMaterial;
exports.creator = creator;

var _sdf = require('three-bmfont-text/shaders/sdf');

var _sdf2 = _interopRequireDefault(_sdf);

var _threeBmfontText = require('three-bmfont-text');

var _threeBmfontText2 = _interopRequireDefault(_threeBmfontText);

var _parseBmfontAscii = require('parse-bmfont-ascii');

var _parseBmfontAscii2 = _interopRequireDefault(_parseBmfontAscii);

var _font = require('./font');

var Font = _interopRequireWildcard(_font);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMaterial(color) {

  var texture = new THREE.Texture();
  var image = Font.image();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  //  and what about anisotropic filtering?

  return new THREE.RawShaderMaterial((0, _sdf2.default)({
    side: THREE.DoubleSide,
    transparent: true,
    color: color,
    map: texture
  }));
}

function creator() {

  var font = (0, _parseBmfontAscii2.default)(Font.fnt());

  var colorMaterials = {};

  function createText(str, font) {
    var color = arguments.length <= 2 || arguments[2] === undefined ? 0xffffff : arguments[2];


    var geometry = (0, _threeBmfontText2.default)({
      text: str,
      align: 'left',
      width: 1000,
      flipY: true,
      font: font
    });

    var layout = geometry.layout;

    var material = colorMaterials[color];
    if (material === undefined) {
      material = colorMaterials[color] = createMaterial(color);
    }
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.multiply(new THREE.Vector3(1, -1, 1));
    mesh.scale.multiplyScalar(0.001);

    mesh.position.y = layout.height * 0.5 * 0.001;

    return mesh;
  }

  function create(str) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$color = _ref.color;
    var color = _ref$color === undefined ? 0xffffff : _ref$color;

    var group = new THREE.Group();

    var mesh = createText(str, font, color);
    group.add(mesh);
    group.layout = mesh.geometry.layout;

    group.update = function (str) {
      mesh.geometry.update(str);
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

},{"./font":6,"parse-bmfont-ascii":25,"three-bmfont-text":27,"three-bmfont-text/shaders/sdf":30}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FOLDER = exports.LOCATOR = exports.PANEL = undefined;

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var PANEL = exports.PANEL = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: THREE.VertexColors });
var LOCATOR = exports.LOCATOR = new THREE.MeshBasicMaterial();
var FOLDER = exports.FOLDER = new THREE.MeshBasicMaterial({ color: 0x000000 });

},{"./colors":3}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSlider;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSlider() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var textCreator = _ref.textCreator;
  var object = _ref.object;
  var _ref$propertyName = _ref.propertyName;
  var propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName;
  var _ref$initialValue = _ref.initialValue;
  var initialValue = _ref$initialValue === undefined ? 0.0 : _ref$initialValue;
  var _ref$min = _ref.min;
  var min = _ref$min === undefined ? 0.0 : _ref$min;
  var _ref$max = _ref.max;
  var max = _ref$max === undefined ? 1.0 : _ref$max;
  var _ref$step = _ref.step;
  var step = _ref$step === undefined ? 0.1 : _ref$step;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height;
  var _ref$depth = _ref.depth;
  var depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;


  var SLIDER_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var SLIDER_HEIGHT = height - Layout.PANEL_MARGIN;
  var SLIDER_DEPTH = depth;

  var state = {
    alpha: 1.0,
    value: initialValue,
    step: step,
    precision: 1,
    listen: false,
    min: min,
    max: max,
    onChangedCB: undefined,
    onFinishedChange: undefined
  };

  state.step = getImpliedStep(state.value);
  state.precision = numDecimals(state.step);
  state.alpha = getAlphaFromValue(state.value, state.min, state.max);

  var group = new THREE.Group();

  //  filled volume
  var rect = new THREE.BoxGeometry(SLIDER_WIDTH, SLIDER_HEIGHT, SLIDER_DEPTH);
  rect.translate(SLIDER_WIDTH * 0.5, 0, 0);
  // Layout.alignLeft( rect );

  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  //  outline volume
  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;

  var outline = new THREE.BoxHelper(hitscanVolume);
  outline.material.color.setHex(Colors.OUTLINE_COLOR);

  var material = new THREE.MeshPhongMaterial({ color: Colors.DEFAULT_COLOR, emissive: Colors.EMISSIVE_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  hitscanVolume.add(filledVolume);

  var endLocator = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05, 1, 1, 1), SharedMaterials.LOCATOR);
  endLocator.position.x = SLIDER_WIDTH;
  hitscanVolume.add(endLocator);
  endLocator.visible = false;

  var valueLabel = textCreator.create(state.value.toString());
  valueLabel.position.x = Layout.PANEL_VALUE_TEXT_MARGIN + width * 0.5;
  valueLabel.position.z = depth * 2;
  valueLabel.position.y = -0.03;

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_SLIDER);
  controllerID.position.z = depth;

  var panel = Layout.createPanel(width, height, depth);
  panel.add(descriptorLabel, hitscanVolume, outline, valueLabel, controllerID);

  group.add(panel);

  updateValueLabel(state.value);
  updateSlider(state.alpha);

  function updateValueLabel(value) {
    valueLabel.update(roundToDecimal(state.value, state.precision).toString());
  }

  function updateView() {
    if (interaction.pressing()) {
      material.color.setHex(Colors.INTERACTION_COLOR);
    } else if (interaction.hovering()) {
      material.color.setHex(Colors.HIGHLIGHT_COLOR);
      material.emissive.setHex(Colors.HIGHLIGHT_EMISSIVE_COLOR);
    } else {
      material.color.setHex(Colors.DEFAULT_COLOR);
      material.emissive.setHex(Colors.EMISSIVE_COLOR);
    }
  }

  function updateSlider(alpha) {
    filledVolume.scale.x = Math.max(alpha * width, 0.000001);
  }

  function updateObject(value) {
    object[propertyName] = value;
  }

  function updateStateFromAlpha(alpha) {
    state.alpha = getClampedAlpha(alpha);
    state.value = getValueFromAlpha(state.alpha, state.min, state.max);
    state.value = getSteppedValue(state.value, state.step);
    state.value = getClampedValue(state.value, state.min, state.max);
  }

  function listenUpdate() {
    state.value = getValueFromObject();
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    state.alpha = getClampedAlpha(state.alpha);
  }

  function getValueFromObject() {
    return parseFloat(object[propertyName]);
  }

  group.onChange = function (callback) {
    state.onChangedCB = callback;
    return group;
  };

  group.step = function (step) {
    state.step = step;
    state.precision = numDecimals(state.step);
    return group;
  };

  group.listen = function () {
    state.listen = true;
    return group;
  };

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('pressing', handlePress);

  function handlePress() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var point = _ref2.point;

    if (group.visible === false) {
      return;
    }

    filledVolume.updateMatrixWorld();
    endLocator.updateMatrixWorld();

    var a = new THREE.Vector3().setFromMatrixPosition(filledVolume.matrixWorld);
    var b = new THREE.Vector3().setFromMatrixPosition(endLocator.matrixWorld);

    var previousValue = state.value;

    updateStateFromAlpha(getPointAlpha(point, { a: a, b: b }));
    updateValueLabel(state.value);
    updateSlider(state.alpha);
    updateObject(state.value);

    if (previousValue !== state.value && state.onChangedCB) {
      state.onChangedCB(state.value);
    }
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.update = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    if (state.listen) {
      listenUpdate();
      updateValueLabel(state.value);
      updateSlider(state.alpha);
    }
    updateView();
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

function getClampedAlpha(alpha) {
  if (alpha > 1) {
    return 1;
  }
  if (alpha < 0) {
    return 0;
  }
  return alpha;
}

function getClampedValue(value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function getImpliedStep(value) {
  if (value === 0) {
    return 1; // What are we, psychics?
  } else {
    // Hey Doug, check this out.
    return Math.pow(10, Math.floor(Math.log(Math.abs(value)) / Math.LN10)) / 10;
  }
}

function getValueFromAlpha(alpha, min, max) {
  return map_range(alpha, 0.0, 1.0, min, max);
}

function getAlphaFromValue(value, min, max) {
  return map_range(value, min, max, 0.0, 1.0);
}

function getSteppedValue(value, step) {
  if (value % step != 0) {
    return Math.round(value / step) * step;
  }
  return value;
}

function numDecimals(x) {
  x = x.toString();
  if (x.indexOf('.') > -1) {
    return x.length - x.indexOf('.') - 1;
  } else {
    return 0;
  }
}

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":12,"./textlabel":14}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTextLabel;

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createTextLabel(textCreator, str) {
  var width = arguments.length <= 2 || arguments[2] === undefined ? 0.4 : arguments[2];
  var depth = arguments.length <= 3 || arguments[3] === undefined ? 0.029 : arguments[3];
  var fgColor = arguments.length <= 4 || arguments[4] === undefined ? 0xffffff : arguments[4];
  var bgColor = arguments.length <= 5 || arguments[5] === undefined ? Colors.DEFAULT_BACK : arguments[5];


  var group = new THREE.Group();
  var internalPositioning = new THREE.Group();
  group.add(internalPositioning);

  var text = textCreator.create(str, { color: fgColor });
  internalPositioning.add(text);

  group.setString = function (str) {
    text.update(str.toString());
  };

  group.setNumber = function (str) {
    text.update(str.toFixed(2));
  };

  text.position.z = 0.015;

  var backBounds = 0.01;
  var margin = 0.01;
  var totalWidth = width;
  var totalHeight = 0.04 + margin * 2;
  var labelBackGeometry = new THREE.BoxGeometry(totalWidth, totalHeight, depth, 1, 1, 1);
  labelBackGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(totalWidth * 0.5 - margin, 0, 0));

  var labelBackMesh = new THREE.Mesh(labelBackGeometry, SharedMaterials.PANEL);
  Colors.colorizeGeometry(labelBackMesh.geometry, bgColor);

  labelBackMesh.position.y = 0.03;
  // labelBackMesh.position.x = width * 0.5;
  internalPositioning.add(labelBackMesh);
  internalPositioning.position.y = -totalHeight * 0.5;

  // labelGroup.position.x = labelBounds.width * 0.5;
  // labelGroup.position.y = labelBounds.height * 0.5;

  group.back = labelBackMesh;

  return group;
}

},{"./colors":3,"./sharedmaterials":12}],15:[function(require,module,exports){
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],16:[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"dtype":17}],19:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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
},{"as-number":16,"indexof-property":20,"word-wrapper":32,"xtend":33}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{"an-array":15,"dtype":17,"is-buffer":22}],27:[function(require,module,exports){
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

},{"./lib/utils":28,"./lib/vertices":29,"inherits":21,"layout-bmfont-text":23,"object-assign":24,"quad-indices":26,"three-buffer-vertex-data":31}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
var assign = require('object-assign')

module.exports = function createSDFShader (opt) {
  opt = opt || {}
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001
  var precision = opt.precision || 'highp'
  var color = opt.color
  var map = opt.map

  // remove to satisfy r73
  delete opt.map
  delete opt.color
  delete opt.precision
  delete opt.opacity

  return assign({
    uniforms: {
      opacity: { type: 'f', value: opacity },
      map: { type: 't', value: map || new THREE.Texture() },
      color: { type: 'c', value: new THREE.Color(color) }
    },
    vertexShader: [
      'attribute vec2 uv;',
      'attribute vec4 position;',
      'uniform mat4 projectionMatrix;',
      'uniform mat4 modelViewMatrix;',
      'varying vec2 vUv;',
      'void main() {',
      'vUv = uv;',
      'gl_Position = projectionMatrix * modelViewMatrix * position;',
      '}'
    ].join('\n'),
    fragmentShader: [
      '#ifdef GL_OES_standard_derivatives',
      '#extension GL_OES_standard_derivatives : enable',
      '#endif',
      'precision ' + precision + ' float;',
      'uniform float opacity;',
      'uniform vec3 color;',
      'uniform sampler2D map;',
      'varying vec2 vUv;',

      'float aastep(float value) {',
      '  #ifdef GL_OES_standard_derivatives',
      '    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;',
      '  #else',
      '    float afwidth = (1.0 / 32.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));',
      '  #endif',
      '  return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);',
      '}',

      'void main() {',
      '  vec4 texColor = texture2D(map, vUv);',
      '  float alpha = aastep(texColor.a);',
      '  gl_FragColor = vec4(color, opacity * alpha);',
      alphaTest === 0
        ? ''
        : '  if (gl_FragColor.a < ' + alphaTest + ') discard;',
      '}'
    ].join('\n')
  }, opt)
}

},{"object-assign":24}],31:[function(require,module,exports){
var flatten = require('flatten-vertex-data')
var warned = false;

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
    if (attrib && !warned) {
      warned = true;
      console.warn([
        'A WebGL buffer is being updated with a new size or itemSize, ',
        'however ThreeJS only supports fixed-size buffers.\nThe old buffer may ',
        'still be kept in memory.\n',
        'To avoid memory leaks, it is recommended that you dispose ',
        'your geometries and create new ones, or support the following PR in ThreeJS:\n',
        'https://github.com/mrdoob/three.js/pull/9631'
      ].join(''));
    }
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

},{"flatten-vertex-data":18}],32:[function(require,module,exports){
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
},{}],33:[function(require,module,exports){
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

},{}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcYnV0dG9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNoZWNrYm94LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNvbG9ycy5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxkcm9wZG93bi5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxmb2xkZXIuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcZm9udC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxncmFiLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGluZGV4LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGludGVyYWN0aW9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGxheW91dC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxzZGZ0ZXh0LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHNoYXJlZG1hdGVyaWFscy5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxzbGlkZXIuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcdGV4dGxhYmVsLmpzIiwibm9kZV9tb2R1bGVzL2FuLWFycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzLW51bWJlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdHlwZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mbGF0dGVuLXZlcnRleC1kYXRhL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvaW5kZXhvZi1wcm9wZXJ0eS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sYXlvdXQtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZS1ibWZvbnQtYXNjaWkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcXVhZC1pbmRpY2VzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2xpYi91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9saWIvdmVydGljZXMuanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvc2hhZGVycy9zZGYuanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYnVmZmVyLXZlcnRleC1kYXRhL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3dvcmQtd3JhcHBlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94dGVuZC9pbW11dGFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkNPd0IsYzs7QUFQeEI7Ozs7QUFDQTs7OztBQUNBOztJQUFZLE07O0FBQ1o7O0lBQVksTTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLEk7Ozs7OztBQUVHLFNBQVMsY0FBVCxHQU9QO0FBQUEsbUVBQUosRUFBSTs7QUFBQSxNQU5OLFdBTU0sUUFOTixXQU1NO0FBQUEsTUFMTixNQUtNLFFBTE4sTUFLTTtBQUFBLCtCQUpOLFlBSU07QUFBQSxNQUpOLFlBSU0scUNBSlMsV0FJVDtBQUFBLHdCQUhOLEtBR007QUFBQSxNQUhOLEtBR00sOEJBSEUsT0FBTyxXQUdUO0FBQUEseUJBRk4sTUFFTTtBQUFBLE1BRk4sTUFFTSwrQkFGRyxPQUFPLFlBRVY7QUFBQSx3QkFETixLQUNNO0FBQUEsTUFETixLQUNNLDhCQURFLE9BQU8sV0FDVDs7O0FBRU4sTUFBTSxlQUFlLFFBQVEsR0FBUixH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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ2hlY2tib3goIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcbiAgY29uc3QgQlVUVE9OX1dJRFRIID0gd2lkdGggKiAwLjUgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9ERVBUSCA9IGRlcHRoO1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcclxuICBncm91cC5hZGQoIHBhbmVsICk7XHJcblxyXG4gIC8vICBiYXNlIGNoZWNrYm94XHJcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQlVUVE9OX1dJRFRILCBCVVRUT05fSEVJR0hULCBCVVRUT05fREVQVEggKTtcclxuICByZWN0LnRyYW5zbGF0ZSggQlVUVE9OX1dJRFRIICogMC41LCAwLCAwICk7XHJcblxyXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcclxuXHJcbiAgLy8gIG91dGxpbmUgdm9sdW1lXHJcbiAgY29uc3Qgb3V0bGluZSA9IG5ldyBUSFJFRS5Cb3hIZWxwZXIoIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBvdXRsaW5lLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLk9VVExJTkVfQ09MT1IgKTtcclxuXHJcbiAgLy8gIGNoZWNrYm94IHZvbHVtZVxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5ERUZBVUxUX0NPTE9SLCBlbWlzc2l2ZTogQ29sb3JzLkVNSVNTSVZFX0NPTE9SIH0pO1xyXG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xyXG5cclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQlVUVE9OICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIG91dGxpbmUsIGNvbnRyb2xsZXJJRCApO1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xyXG5cclxuICB1cGRhdGVWaWV3KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoKXtcclxuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG5cclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkVNSVNTSVZFX0NPTE9SICk7XHJcblxyXG4gICAgICBpZiggc3RhdGUudmFsdWUgKXtcclxuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0NPTE9SICk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5JTkFDVElWRV9DT0xPUiApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG5cclxuICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsImltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IGZhbHNlLFxyXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxyXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXHJcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEhcclxufSA9IHt9ICl7XHJcblxyXG4gIGNvbnN0IENIRUNLQk9YX1dJRFRIID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBDSEVDS0JPWF9IRUlHSFQgPSBDSEVDS0JPWF9XSURUSDtcclxuICBjb25zdCBDSEVDS0JPWF9ERVBUSCA9IGRlcHRoO1xyXG5cclxuICBjb25zdCBJTkFDVElWRV9TQ0FMRSA9IDAuMDAxO1xyXG4gIGNvbnN0IEFDVElWRV9TQ0FMRSA9IDAuOTtcclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICB2YWx1ZTogaW5pdGlhbFZhbHVlLFxyXG4gICAgbGlzdGVuOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcclxuXHJcbiAgLy8gIGJhc2UgY2hlY2tib3hcclxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBDSEVDS0JPWF9XSURUSCwgQ0hFQ0tCT1hfSEVJR0hULCBDSEVDS0JPWF9ERVBUSCApO1xyXG4gIHJlY3QudHJhbnNsYXRlKCBDSEVDS0JPWF9XSURUSCAqIDAuNSwgMCwgMCApO1xyXG5cclxuXHJcbiAgLy8gIGhpdHNjYW4gdm9sdW1lXHJcbiAgY29uc3QgaGl0c2Nhbk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG5cclxuICAvLyAgb3V0bGluZSB2b2x1bWVcclxuICBjb25zdCBvdXRsaW5lID0gbmV3IFRIUkVFLkJveEhlbHBlciggaGl0c2NhblZvbHVtZSApO1xyXG4gIG91dGxpbmUubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuT1VUTElORV9DT0xPUiApO1xyXG5cclxuICAvLyAgY2hlY2tib3ggdm9sdW1lXHJcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogQ29sb3JzLkRFRkFVTFRfQ09MT1IsIGVtaXNzaXZlOiBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgfSk7XHJcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcclxuICBmaWxsZWRWb2x1bWUuc2NhbGUuc2V0KCBBQ1RJVkVfU0NBTEUsIEFDVElWRV9TQ0FMRSxBQ1RJVkVfU0NBTEUgKTtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XHJcblxyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9DSEVDS0JPWCApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBvdXRsaW5lLCBjb250cm9sbGVySUQgKTtcclxuXHJcbiAgLy8gZ3JvdXAuYWRkKCBmaWxsZWRWb2x1bWUsIG91dGxpbmUsIGhpdHNjYW5Wb2x1bWUsIGRlc2NyaXB0b3JMYWJlbCApO1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xyXG5cclxuICB1cGRhdGVWaWV3KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoKXtcclxuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGUudmFsdWUgPSAhc3RhdGUudmFsdWU7XHJcblxyXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IHN0YXRlLnZhbHVlO1xyXG5cclxuICAgIGlmKCBvbkNoYW5nZWRDQiApe1xyXG4gICAgICBvbkNoYW5nZWRDQiggc3RhdGUudmFsdWUgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcclxuXHJcbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQ09MT1IgKTtcclxuICAgICAgbWF0ZXJpYWwuZW1pc3NpdmUuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0VNSVNTSVZFX0NPTE9SICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5FTUlTU0lWRV9DT0xPUiApO1xyXG5cclxuICAgICAgaWYoIHN0YXRlLnZhbHVlICl7XHJcbiAgICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9DT0xPUiApO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSU5BQ1RJVkVfQ09MT1IgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKCBzdGF0ZS52YWx1ZSApe1xyXG4gICAgICBmaWxsZWRWb2x1bWUuc2NhbGUuc2V0KCBBQ1RJVkVfU0NBTEUsIEFDVElWRV9TQ0FMRSwgQUNUSVZFX1NDQUxFICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBmaWxsZWRWb2x1bWUuc2NhbGUuc2V0KCBJTkFDVElWRV9TQ0FMRSwgSU5BQ1RJVkVfU0NBTEUsIElOQUNUSVZFX1NDQUxFICk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgbGV0IG9uQ2hhbmdlZENCO1xyXG4gIGxldCBvbkZpbmlzaENoYW5nZUNCO1xyXG5cclxuICBncm91cC5vbkNoYW5nZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xyXG4gICAgb25DaGFuZ2VkQ0IgPSBjYWxsYmFjaztcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xyXG4gIGdyb3VwLmhpdHNjYW4gPSBbIGhpdHNjYW5Wb2x1bWUsIHBhbmVsIF07XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgc3RhdGUudmFsdWUgPSBvYmplY3RbIHByb3BlcnR5TmFtZSBdO1xyXG4gICAgfVxyXG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCJleHBvcnQgY29uc3QgREVGQVVMVF9DT0xPUiA9IDB4MkZBMUQ2O1xyXG5leHBvcnQgY29uc3QgSElHSExJR0hUX0NPTE9SID0gMHgwRkMzRkY7XHJcbmV4cG9ydCBjb25zdCBJTlRFUkFDVElPTl9DT0xPUiA9IDB4MDdBQkY3O1xyXG5leHBvcnQgY29uc3QgRU1JU1NJVkVfQ09MT1IgPSAweDIyMjIyMjtcclxuZXhwb3J0IGNvbnN0IEhJR0hMSUdIVF9FTUlTU0lWRV9DT0xPUiA9IDB4OTk5OTk5O1xyXG5leHBvcnQgY29uc3QgT1VUTElORV9DT0xPUiA9IDB4OTk5OTk5O1xyXG5leHBvcnQgY29uc3QgREVGQVVMVF9CQUNLID0gMHgxMzEzMTNcclxuZXhwb3J0IGNvbnN0IEhJR0hMSUdIVF9CQUNLID0gMHg0OTQ5NDk7XHJcbmV4cG9ydCBjb25zdCBJTkFDVElWRV9DT0xPUiA9IDB4MTYxODI5O1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9TTElERVIgPSAweDJmYTFkNjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfQ0hFQ0tCT1ggPSAweDgwNjc4NztcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfQlVUVE9OID0gMHhlNjFkNWY7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1RFWFQgPSAweDFlZDM2ZjtcclxuZXhwb3J0IGNvbnN0IERST1BET1dOX0JHX0NPTE9SID0gMHhmZmZmZmY7XHJcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9GR19DT0xPUiA9IDB4MDAwMDAwO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yaXplR2VvbWV0cnkoIGdlb21ldHJ5LCBjb2xvciApe1xyXG4gIGdlb21ldHJ5LmZhY2VzLmZvckVhY2goIGZ1bmN0aW9uKGZhY2Upe1xyXG4gICAgZmFjZS5jb2xvci5zZXRIZXgoY29sb3IpO1xyXG4gIH0pO1xyXG4gIGdlb21ldHJ5LmNvbG9yc05lZWRVcGRhdGUgPSB0cnVlO1xyXG4gIHJldHVybiBnZW9tZXRyeTtcclxufSIsImltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IGZhbHNlLFxyXG4gIG9wdGlvbnMgPSBbXSxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICBvcGVuOiBmYWxzZSxcclxuICAgIGxpc3RlbjogZmFsc2VcclxuICB9O1xyXG5cclxuICBjb25zdCBEUk9QRE9XTl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBEUk9QRE9XTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IERST1BET1dOX0RFUFRIID0gZGVwdGg7XHJcbiAgY29uc3QgRFJPUERPV05fT1BUSU9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU4gKiAxLjg7XHJcbiAgY29uc3QgRFJPUERPV05fTUFSR0lOID0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XHJcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xyXG5cclxuICBncm91cC5oaXRzY2FuID0gWyBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBsYWJlbEludGVyYWN0aW9ucyA9IFtdO1xyXG4gIGNvbnN0IG9wdGlvbkxhYmVscyA9IFtdO1xyXG5cclxuICAvLyAgZmluZCBhY3R1YWxseSB3aGljaCBsYWJlbCBpcyBzZWxlY3RlZFxyXG4gIGNvbnN0IGluaXRpYWxMYWJlbCA9IGZpbmRMYWJlbEZyb21Qcm9wKCk7XHJcblxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZmluZExhYmVsRnJvbVByb3AoKXtcclxuICAgIGlmKCBBcnJheS5pc0FycmF5KCBvcHRpb25zICkgKXtcclxuICAgICAgcmV0dXJuIG9wdGlvbnMuZmluZCggZnVuY3Rpb24oIG9wdGlvbk5hbWUgKXtcclxuICAgICAgICByZXR1cm4gb3B0aW9uTmFtZSA9PT0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvcHRpb25zKS5maW5kKCBmdW5jdGlvbiggb3B0aW9uTmFtZSApe1xyXG4gICAgICAgIHJldHVybiBvYmplY3RbcHJvcGVydHlOYW1lXSA9PT0gb3B0aW9uc1sgb3B0aW9uTmFtZSBdO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbiggbGFiZWxUZXh0LCBpc09wdGlvbiApe1xyXG4gICAgY29uc3QgbGFiZWwgPSBjcmVhdGVUZXh0TGFiZWwoIHRleHRDcmVhdG9yLCBsYWJlbFRleHQsIERST1BET1dOX1dJRFRILCBkZXB0aCwgQ29sb3JzLkRST1BET1dOX0ZHX0NPTE9SLCBDb2xvcnMuRFJPUERPV05fQkdfQ09MT1IgKVxyXG4gICAgZ3JvdXAuaGl0c2Nhbi5wdXNoKCBsYWJlbC5iYWNrICk7XHJcbiAgICBjb25zdCBsYWJlbEludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGxhYmVsLmJhY2sgKTtcclxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLnB1c2goIGxhYmVsSW50ZXJhY3Rpb24gKTtcclxuICAgIG9wdGlvbkxhYmVscy5wdXNoKCBsYWJlbCApO1xyXG5cclxuXHJcbiAgICBpZiggaXNPcHRpb24gKXtcclxuICAgICAgbGFiZWxJbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHNlbGVjdGVkTGFiZWwuc2V0U3RyaW5nKCBsYWJlbFRleHQgKTtcclxuXHJcbiAgICAgICAgbGV0IHByb3BlcnR5Q2hhbmdlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XHJcbiAgICAgICAgICBwcm9wZXJ0eUNoYW5nZWQgPSBvYmplY3RbIHByb3BlcnR5TmFtZSBdICE9PSBsYWJlbFRleHQ7XHJcbiAgICAgICAgICBpZiggcHJvcGVydHlDaGFuZ2VkICl7XHJcbiAgICAgICAgICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBsYWJlbFRleHQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBwcm9wZXJ0eUNoYW5nZWQgPSBvYmplY3RbIHByb3BlcnR5TmFtZSBdICE9PSBvcHRpb25zWyBsYWJlbFRleHQgXTtcclxuICAgICAgICAgIGlmKCBwcm9wZXJ0eUNoYW5nZWQgKXtcclxuICAgICAgICAgICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IG9wdGlvbnNbIGxhYmVsVGV4dCBdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGNvbGxhcHNlT3B0aW9ucygpO1xyXG4gICAgICAgIHN0YXRlLm9wZW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYoIG9uQ2hhbmdlZENCICYmIHByb3BlcnR5Q2hhbmdlZCApe1xyXG4gICAgICAgICAgb25DaGFuZ2VkQ0IoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBpZiggc3RhdGUub3BlbiA9PT0gZmFsc2UgKXtcclxuICAgICAgICAgIG9wZW5PcHRpb25zKCk7XHJcbiAgICAgICAgICBzdGF0ZS5vcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIGNvbGxhcHNlT3B0aW9ucygpO1xyXG4gICAgICAgICAgc3RhdGUub3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBsYWJlbC5pc09wdGlvbiA9IGlzT3B0aW9uO1xyXG4gICAgcmV0dXJuIGxhYmVsO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29sbGFwc2VPcHRpb25zKCl7XHJcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGxhYmVsLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICBsYWJlbC5iYWNrLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvcGVuT3B0aW9ucygpe1xyXG4gICAgb3B0aW9uTGFiZWxzLmZvckVhY2goIGZ1bmN0aW9uKCBsYWJlbCApe1xyXG4gICAgICBpZiggbGFiZWwuaXNPcHRpb24gKXtcclxuICAgICAgICBsYWJlbC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBsYWJlbC5iYWNrLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vICBiYXNlIG9wdGlvblxyXG4gIGNvbnN0IHNlbGVjdGVkTGFiZWwgPSBjcmVhdGVPcHRpb24oIGluaXRpYWxMYWJlbCwgZmFsc2UgKTtcclxuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTUFSR0lOICogMiArIHdpZHRoICogMC41O1xyXG4gIHNlbGVjdGVkTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG5cclxuICBzZWxlY3RlZExhYmVsLmFkZCgoZnVuY3Rpb24gY3JlYXRlRG93bkFycm93KCl7XHJcbiAgICBjb25zdCB3ID0gMC4wMTU7XHJcbiAgICBjb25zdCBoID0gMC4wMztcclxuICAgIGNvbnN0IHNoID0gbmV3IFRIUkVFLlNoYXBlKCk7XHJcbiAgICBzaC5tb3ZlVG8oMCwwKTtcclxuICAgIHNoLmxpbmVUbygtdyxoKTtcclxuICAgIHNoLmxpbmVUbyh3LGgpO1xyXG4gICAgc2gubGluZVRvKDAsMCk7XHJcblxyXG4gICAgY29uc3QgZ2VvID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkoIHNoICk7XHJcbiAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggZ2VvLCBDb2xvcnMuRFJPUERPV05fRkdfQ09MT1IgKTtcclxuICAgIGdlby50cmFuc2xhdGUoIERST1BET1dOX1dJRFRIIC0gdyAqIDQsIC1EUk9QRE9XTl9IRUlHSFQgKiAwLjUgKyBoICogMC41ICwgZGVwdGggKiAxLjAxICk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBnZW8sIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xyXG4gIH0pKCkpO1xyXG5cclxuXHJcbiAgZnVuY3Rpb24gY29uZmlndXJlTGFiZWxQb3NpdGlvbiggbGFiZWwsIGluZGV4ICl7XHJcbiAgICBsYWJlbC5wb3NpdGlvbi55ID0gLURST1BET1dOX01BUkdJTiAtIChpbmRleCsxKSAqICggRFJPUERPV05fT1BUSU9OX0hFSUdIVCApO1xyXG4gICAgbGFiZWwucG9zaXRpb24ueiA9IGRlcHRoICogMjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wdGlvblRvTGFiZWwoIG9wdGlvbk5hbWUsIGluZGV4ICl7XHJcbiAgICBjb25zdCBvcHRpb25MYWJlbCA9IGNyZWF0ZU9wdGlvbiggb3B0aW9uTmFtZSwgdHJ1ZSApO1xyXG4gICAgY29uZmlndXJlTGFiZWxQb3NpdGlvbiggb3B0aW9uTGFiZWwsIGluZGV4ICk7XHJcbiAgICByZXR1cm4gb3B0aW9uTGFiZWw7XHJcbiAgfVxyXG5cclxuICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XHJcbiAgICBzZWxlY3RlZExhYmVsLmFkZCggLi4ub3B0aW9ucy5tYXAoIG9wdGlvblRvTGFiZWwgKSApO1xyXG4gIH1cclxuICBlbHNle1xyXG4gICAgc2VsZWN0ZWRMYWJlbC5hZGQoIC4uLk9iamVjdC5rZXlzKG9wdGlvbnMpLm1hcCggb3B0aW9uVG9MYWJlbCApICk7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29sbGFwc2VPcHRpb25zKCk7XHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX1NMSURFUiApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBjb250cm9sbGVySUQsIHNlbGVjdGVkTGFiZWwgKTtcclxuXHJcblxyXG4gIHVwZGF0ZVZpZXcoKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG5cclxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBpbnRlcmFjdGlvbiwgaW5kZXggKXtcclxuICAgICAgY29uc3QgbGFiZWwgPSBvcHRpb25MYWJlbHNbIGluZGV4IF07XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGxhYmVsLmJhY2suZ2VvbWV0cnksIENvbG9ycy5EUk9QRE9XTl9CR19DT0xPUiApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBsZXQgb25DaGFuZ2VkQ0I7XHJcbiAgbGV0IG9uRmluaXNoQ2hhbmdlQ0I7XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBvbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgc2VsZWN0ZWRMYWJlbC5zZXRTdHJpbmcoIGZpbmRMYWJlbEZyb21Qcm9wKCkgKTtcclxuICAgIH1cclxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBsYWJlbEludGVyYWN0aW9uICl7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIH0pO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsImltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUZvbGRlcih7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgbmFtZVxyXG59ID0ge30gKXtcclxuXHJcbiAgY29uc3Qgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEg7XHJcblxyXG4gIGNvbnN0IHNwYWNpbmdQZXJDb250cm9sbGVyID0gTGF5b3V0LlBBTkVMX0hFSUdIVCArIExheW91dC5QQU5FTF9TUEFDSU5HO1xyXG5cclxuICBjb25zdCBzdGF0ZSA9IHtcclxuICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICBwcmV2aW91c1BhcmVudDogdW5kZWZpbmVkXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBjb25zdCBjb2xsYXBzZUdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgZ3JvdXAuYWRkKCBjb2xsYXBzZUdyb3VwICk7XHJcblxyXG4gIC8vICBZZWFoLiBHcm9zcy5cclxuICBjb25zdCBhZGRPcmlnaW5hbCA9IFRIUkVFLkdyb3VwLnByb3RvdHlwZS5hZGQ7XHJcbiAgYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIGNvbGxhcHNlR3JvdXAgKTtcclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gY3JlYXRlVGV4dExhYmVsKCB0ZXh0Q3JlYXRvciwgJy0gJyArIG5hbWUsIDAuNiApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCAqIDAuNTtcclxuXHJcbiAgYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIGRlc2NyaXB0b3JMYWJlbCApO1xyXG5cclxuICAvLyBjb25zdCBwYW5lbCA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIHdpZHRoLCAxLCBMYXlvdXQuUEFORUxfREVQVEggKSwgU2hhcmVkTWF0ZXJpYWxzLkZPTERFUiApO1xyXG4gIC8vIHBhbmVsLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGggKiAwLjUsIDAsIC1MYXlvdXQuUEFORUxfREVQVEggKTtcclxuICAvLyBhZGRPcmlnaW5hbC5jYWxsKCBncm91cCwgcGFuZWwgKTtcclxuXHJcbiAgLy8gY29uc3QgaW50ZXJhY3Rpb25Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgMSwgTGF5b3V0LlBBTkVMX0RFUFRIICksIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6MHgwMDAwMDB9KSApO1xyXG4gIC8vIGludGVyYWN0aW9uVm9sdW1lLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGggKiAwLjUgLSBMYXlvdXQuUEFORUxfTUFSR0lOLCAwLCAtTGF5b3V0LlBBTkVMX0RFUFRIICk7XHJcbiAgLy8gYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIGludGVyYWN0aW9uVm9sdW1lICk7XHJcbiAgLy8gaW50ZXJhY3Rpb25Wb2x1bWUudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAvLyBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xyXG4gIC8vIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZVByZXNzICk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVByZXNzKCl7XHJcbiAgICBzdGF0ZS5jb2xsYXBzZWQgPSAhc3RhdGUuY29sbGFwc2VkO1xyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuYWRkID0gZnVuY3Rpb24oIC4uLmFyZ3MgKXtcclxuICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24oIG9iaiApe1xyXG4gICAgICBjb25zdCBjb250YWluZXIgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgICAgY29udGFpbmVyLmFkZCggb2JqICk7XHJcbiAgICAgIGNvbGxhcHNlR3JvdXAuYWRkKCBjb250YWluZXIgKTtcclxuICAgICAgb2JqLmZvbGRlciA9IGdyb3VwO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIHBlcmZvcm1MYXlvdXQoKXtcclxuICAgIGNvbGxhcHNlR3JvdXAuY2hpbGRyZW4uZm9yRWFjaCggZnVuY3Rpb24oIGNoaWxkLCBpbmRleCApe1xyXG4gICAgICBjaGlsZC5wb3NpdGlvbi55ID0gLShpbmRleCsxKSAqIHNwYWNpbmdQZXJDb250cm9sbGVyICsgTGF5b3V0LlBBTkVMX0hFSUdIVCAqIDAuNTtcclxuICAgICAgaWYoIHN0YXRlLmNvbGxhcHNlZCApe1xyXG4gICAgICAgIGNoaWxkLmNoaWxkcmVuWzBdLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgIGNoaWxkLmNoaWxkcmVuWzBdLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiggc3RhdGUuY29sbGFwc2VkICl7XHJcbiAgICAgIGRlc2NyaXB0b3JMYWJlbC5zZXRTdHJpbmcoICcrICcgKyBuYW1lICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBkZXNjcmlwdG9yTGFiZWwuc2V0U3RyaW5nKCAnLSAnICsgbmFtZSApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnN0IHRvdGFsSGVpZ2h0ID0gY29sbGFwc2VHcm91cC5jaGlsZHJlbi5sZW5ndGggKiBzcGFjaW5nUGVyQ29udHJvbGxlcjtcclxuICAgIC8vIHBhbmVsLmdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgdG90YWxIZWlnaHQsIExheW91dC5QQU5FTF9ERVBUSCApO1xyXG4gICAgLy8gcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCAqIDAuNSwgLXRvdGFsSGVpZ2h0ICogMC41LCAtTGF5b3V0LlBBTkVMX0RFUFRIICk7XHJcbiAgICAvLyBwYW5lbC5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZUxhYmVsKCl7XHJcbiAgICAvLyBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgLy8gICBkZXNjcmlwdG9yTGFiZWwuYmFjay5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQkFDSyApO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gZWxzZXtcclxuICAgICAgLy8gZGVzY3JpcHRvckxhYmVsLmJhY2subWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9CQUNLICk7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICBncm91cC5mb2xkZXIgPSBncm91cDtcclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWw6IGRlc2NyaXB0b3JMYWJlbC5iYWNrIH0gKTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVMYWJlbCgpO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnBpblRvID0gZnVuY3Rpb24oIG5ld1BhcmVudCApe1xyXG4gICAgY29uc3Qgb2xkUGFyZW50ID0gZ3JvdXAucGFyZW50O1xyXG5cclxuICAgIGlmKCBncm91cC5wYXJlbnQgKXtcclxuICAgICAgZ3JvdXAucGFyZW50LnJlbW92ZSggZ3JvdXAgKTtcclxuICAgIH1cclxuICAgIG5ld1BhcmVudC5hZGQoIGdyb3VwICk7XHJcblxyXG4gICAgcmV0dXJuIG9sZFBhcmVudDtcclxuICB9O1xyXG5cclxuICBncm91cC5oaXRzY2FuID0gWyBkZXNjcmlwdG9yTGFiZWwuYmFjayBdO1xyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCJleHBvcnQgZnVuY3Rpb24gaW1hZ2UoKXtcclxuICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gIGltYWdlLnNyYyA9IGBkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQWdBQUFBRUFDQVlBQUFERmtNNW5BQUNBQUVsRVFWUjQydXk5QjNkY1I3SW0yTHQ3ZHMvTW05blpubWY2dmJicWxsb3Q3eVdLcE9oQUN4SUVRSGlQZ3ZmZSt3T2dDcDdkUGY4NHQ2Q1gwZlhWVnhGNTgxWVZRRTAzZVU0ZVNkU3RhOUpFZkJIeFJjVFBuSE9OK2RHYUh4MzUwWmt3T3Z5MWw3OTU0Zi9aa2gvdEtYNzdLai9xRW43YmxoL04rVkdmSDdYNThVViszTWlQdS9ueDJELzdsYit1S3o5NmpkSGxyM25sZi9QWTMrUHlmdC9seCszOGVKQWZULzA3eVQyNzg2TXZQekorOU1HOUd1R2EvdndZOE9QeXVoNy9uZmp1RC9QalRuNThueDlmNWNmSC9sdnUrUDlYNjY5dG91L3A5L2ZVN3E4OXU5Ky9aN2VmMDh0M2FNaVA1L254eUgvM1RmOE9mOHFQei9MajIvejRBZDZqd2E5SnAzK1dOcWQ0LzVkKzdpN244RC95NC9mNThVRitmTzduOTQ1LzluUFlaOXE5ZS96ZnR5U3NxL1hzVy9ueGRYNThraDkvekkvZitqbitBZGIzaGYrK1pyaC9ENjN6UUdCT08vMzdOL24xZXU3MzAzMi9qNzcxMy8xUmZyeVhIMS82T2JpVll0OXEzM2Y1dTVyOHVPZWZrM1JlK1l3KzhiKzlDZnZ2OHYxK2t4Ly9saC8vbkIvL1gzNzg5L3o0ci9ueC8rYkh6L1BqWC8wMTcvbmZmT1h2Y2MvZjgwWEV1N1Q3TlczMDgvV05uNDk3L3J1ZTA1cDAram5ROWtlM0lSdXFPUisveUk5L2dmbW81cjEvbFIrLzlNLzQxekx1ZmNmdkE5ekxyL3hjdE1KbzhYLzN5bC96d3Y4R1pRM09kOUthWGM3SHIvUGpYYiszWlIvYzk5OWI1ODlFdTErak5MTDRucGVMWC9wN3Yrdm5xUVhrWEcvRTBQWkhvMyszWnlTRFVTNDhnYmxzb2oySU1wamxjQWJrZ3p5L1M5RnhUOHY0RnJrZmZsTzd2Ni9JZFBtdVIzNE9iL216OWRuUDB2N3hOKzhoaFdLTmZuOXRPeW5MbU4raUFtc0svRllVcmlpRWV2OXh0LzBCa0VNdjczMzVtK0g4R0tFeDdQK2Z2RytqLzIyTkY5YXMvSnY4dThrOUwrOHg3c2VJLzd0dXZ4RGQvcjlIODJQQ2o3SDhHRkxlSFVIQURROCtmcUFES1VxM0Y3NW4xRCtiNzkrclBIdmMvLy9MOXh3RXdOS3FnSURMZC9qUUg3cnYvVUYrQ3UvUjVkZGdTSmxUdkgrbm43TTZmNWhGU0lpeXVPWG45NWwvQjVtM2pMSmVRLzd2dXhMV0ZaL2RETStXNy9yY0E1QjMvQnpYMFBxSzR1MVQ1aG5ubXVkMENQWnZweUwwR1FSOFNJTG1jZVMrNWJtdDkrOWU2NS96SU9LODhobDk0ZGYramdja24za0ErSTRIU3I4Q3hTZUsvei84ZXY0T3dDSUNPZ0V5TWUvU0RjRDVKaWwvVVlLNEprUEt2QXpER3ZENXF0WjgvRjZaajJyZCt6MS9Objd2NS9UWFpkeGJNeFk2RmNYQ3lyQUo1QkRLbWo0RjlHcHI5Z3YvenU4clJzTnovMjRkL3RtRGhzelFaUEZ6ZjQ4ZnZIei8xRC9qdC83OStnTXlhQ1JoZnlDUVpobk1jdUVWekdVdnliNHhSVGFNd3hnRitUQ282TGk2TXI1RnZrZSthUUNBUmhjQW5BWXdRdjRHQXNvQkFEMys1VWRKQUdwajFGL2JBd3A4SVBLM3FNRGFBNzhkOXgvZkQ0THdPN0NpWHZwTjNPM2Y1Zkw2NmZ5WW9USHQvOStndjdiRi8vYXhuNno3aXZMdjllOG85NXozWTlxL1p3WVdkQlN1V2NpUFdmLysrTzRpcEo3NVRTZEtncFd1M0hQWVAzdkszMitPN2o4T2E0WFBudmZYVHZ0M0dBR0ZLaUNnRnQ3aEUyOHgzNGFEM09UZkkrUHZQNlhNNlF4OFk2L2ZBdzMrKzM3ckQvQ25JQ1JFV1RUN2R4bncrNER2UFFYekcxcFhlWFlmZ2JvSFlIV0pKVkhqMyt1bGYzNEhnS2NSbXVkNW1Nc0YrTzg1ZUw4eEVETGRKUFFGQk53Q1ljYUNwakZpMytMY2R2ajViU0ZySnVtODhobHQ4Tzl3MzgrUldGc2ZlRy9KSC96YVhWcW4vKzZWMHp0K0R0OEhzSGdUOW0yRHYzZk11d3pBK1dPUEVNb1FYSk5wT3NlWFk5S1FEZFdZajQ5cFBuN25nVUExN3YySkh4Lzd1WHpmejIzYWUydkdRa1lCVEtnTWUwa09OU3V5Sm1uTmZ1bm5CSTJHZXlDL1d2MDdEa1hLNGg3L20zcndtSWhoOUlFSFNYMytXeVlOR1RRVDJCOE1wRmtHbzF4Z293L2w3d3pJWDBzMnpJSjgwSFJjWThwdjRXL0MrNG9SaXNaZEk0T0FjZ0NBQ09VWitFaHJ6UGhyQndLSzBCcXpwSkN0Mzg3NXlVSWxjd00yWFlPZjNENy8rOHQzV3NxUEZScEwvditOZ3NLUUEzb1BYTEtzL0NmOHUxNytmczJQUmI4WVF5REFKLzM3WHY3L2pmeFlobmNmQVNHbHVhdngyVEtQc2tubS9MTlgvYjNYL2YyWC9GeU5LTTllOS8rKzVPY1NGV29YZ0I4NWNLS2s3L2gzcWZQWHlFR2U4dmZuT1pWdkhJYzkwT1EzNFR2Zy9yOEJydUo2djRhOS90Mm4vWHppZlJkZ2ZxMTFsV2RQK1BudjhuUDdnaXdKQ1FNOEJlVXZGZzhLcVRtNFA4Nnp6S2ZNNmJKLzMxbVkxMEhGOGtPWDVsZUtvR21uZlc5OTN6aFlFMzFLV0NEcHZQSVpsZlVSOFBlTmY3L1AvVDc0ME0rWFdNRHZlcXYxSTIveGZRRmdzWWJBWXVoZEVEajMrek5XbzNpRTVCNnlKb3QrTG5CZVpBMDAyVkN0K2ZnQzV1TjlQeC9WdUxlTXI3MEMvY3pQYmRwN3M3RWdlM2xTQVV5aURJZklHT253ZTJvWVpFM1NtdjNHNzQ5UHlCTXIxcjhZRFdNZ04wT3lXTzc3Q293U0NlRkp5R1RRbi9ONTVWNmFUSkw5TVU5R0VINjd5R0NXQ3lMM3hUREJQYmdLc2tDVERhdit1aVZEeHpXbi9CYnJtK1lBUkkyQUVkTEdJS0FjQUNBQ2Y1RStsTWM2S2NJZVF4RmFBeFZZYitDM3EvNkR4MkN6aUt2Nm1mL2dEajhKNDM2Q0x0OXRoOGE2LzMvai90b08vOXRuWVBXS1M1YVYvN0ovbDkzODJQYi9QZTBQRGlySnkyL2F5bys5L05qMDd6NFBJS0NQM0VIaXJuNEdWbFF2SE1oNWY0OU4vdzJYOTkzMy83N2lEOUVJUFh2Zlg3ZnIvM3NORk9vSUhUZ1JUcCtCVitXSlB4Q3RvS1JuL1BPMmFVNDNGVEFrU3BoamhBL0E3ZDBCUW1MT2Y2UGNjNXUrelZyWFRkaERvZ0JhQWRqYzlkLzB1VmRnQ081RTZDRzRrM25laG5tK0hJZnc3N0wrRy80ZEYvMTdqaE1JUUplbXVIODFRWU1Xbi9aOWl5VEFSNVd3UU9pOGFtZTB4ZSs5UitBQ3ZlbEIyamRlOFgwQ0Z2Q0hmbjk4NVVIaTkxNUFpMGRIQTR2YXU4ZytuQVRBSm1DVFBVSUNDbkZOY0g5c0JXUkROZWJqbGpFZmxkejdCeHEzL0Z4KzY0RkEybnMzSzhiQ3JBR1lCTEN5TWRJRGNrN09ZZEthdlVPOEhzMFRPK1Ivcytqdm84bGl2RzgzaGZBNFpETHM5OFN5WC91ZHdNRDlnVWJRSk1tL0ppOFQ2Z0p5WVJIbVJQYWd5SUlEUC9aQjV2THpXY2UxcHZ3V3VaK01UVDkzcS83ZWMrQ05IRkJBd01OeUFBQys0TFlYZ05xSVVZVFdiMW1COVJxLzNUY1Vkd3dBdVB6dHNSLzdDUUFBM1Zmb2trWGxmN25BdWNqdnp2cG5iZ0VJbUZEY1FZSjRSVG1KRUJ5SEF5bEsvZkxaSi81N1FnQWc2Njg3Z25YQ2d6d0U3anc1Y0F3QTZnMEFzQU56bXZYUFd6SUFBRm9KRWlORTk3OGc0UVUvdi9zd3Z4b0FtUFBmSWVzZ2N6QUxsa1E3ckNtNlhUOGtjRGNNUW04WmhOU0J2L2ZsOTUzU09JSHYzdmZ2dVE3V2pPYlNSUGR2SFZqS2ZlQmVuUEg3WXduMnJjd3RXaE56UnNnbGRGNjF2U3JyL3NTdi9VTVB6dTU2YSs2R3Q3NCs4K3YzaFYvRG0zNGQ3L25ySHluZW90QzdhSHZsR1hudzBDTzBCbXVTOWV0eTVQK1pEWnpwY3VkRENKYVAvUGZkVSthajNIcy9Va2FOM3hzL2VIbVc5dDd0WkwyTFJibWhBQ1lCckd5TURKQ2MyL1R6SFZxemQ0a0UrZ0RrTUh0aXhXaklLbkpqR1pSalgwSjRpdWNtQi9mRGdmdmpBSXdnTk1TRzZJekd5SVY5K0lZVFJUYWdmTWdGZEZ4cmltODVodnZKTngyQ0FTZ0dwaGdKWThSTCt6RVVXdzBBY1Bud2MvcllOSW9RZjNkdUtMRGVnQkt0QkFESWM1TUFRSjBTOHhhWHJDai9JLzlPTWQ5OTREZkVnZi92RmNVZGhHNTRGcUpUOE94OTJGeUhrUjZBUS8rK3AzQ1FWeWdFZ2djdUxRQzRpQUFBZnlJcmdUMExzczhZTExKWHdSSW9lN0NtRTRyYjlhRVg0SklOd1BIMk9YKy9UUUFWc2wrTzRIMWtQa1VBblBuMXlIb0JzMDR1elF5OEI1TEFMRUVqaW4vTGY1c0lHODJhMFVJdTFubk5CWlJTZzEvamwvNGRoVlJZNDlmcWxyZE12L0lLOExZL2J3LzlmcW4xdjNzSnJ1aWV3THRZZTBVRHZ2T2cvRkYrSElPd1BFa0JBS294SHpjOUNDcm4zblhHZUE1cy9IdGwzTHNiUURRYkMxbFNISm94Z3R3aGxIUEhzUC9XNkh4MUtlUS9qZGVESGkyNTU1LzlPUExuWmkwUVBud0lJWk5QamJsNURmdEM5c1NKUDU4WGNJNVpCby9CWG5rVktSZE9RSGVKSWthZ2xJWHJ6Z0k2cmpYeVcvaWI1TDRpZTNMKytUc1FrcDZtTU8rUEhwVnFBWUJUY25mc1J5ckNmUm9uMXd3QURoTThDWTJHK3gxZGNidHdtSFlOYXhvMy9TcWgzbjF3QjJseHIrY1FGKzlUWE80NUVIaGI0QkpFOTdkWTBoS2oyb1NEZCt6L2ZTM3cvVmNCQUpnc2h0YWV4TDFuNGI0NVE2bDNrM3QwTXdBV2VzaXpnYTdFRGlYZUxnRHJ5Qi93RTBEdlcrUU9sZENBS0tVejJCUG9vbVZDcEZnMElVR3o2NStMQ280RitKNFJjckVFU2k1Z09iWkRtcGlrU0wzMGlnOVRHYitIZExNbnNGY3gzYXdOR096YXU0VDJpZ1Y4WlkxUEFVaWpXM1F2SlFDSW1ZODJZejR3dFNydHZWdU1JV2w1bUQ2YTl0N29NVmtDNi8wRUFQS2VuMGMwUnBaQkRrMUJ5SFVIdkN5OHAwZUFOL1doOXdveCthOHRBT3d2ejhwZjh1T3ZvRXMybExQTElUeko1QW5ORGU2SlBUaEhwLzRhbE1GYTJDRkdMcHpDbkc2VFhOZ0NWejQrUHkwQXlDbnUvejNZNjRmZzNiMkFkOW9oWGhxdVZXTTFBY0ErRUI3V0EyUTRWa2JyZ0FTdkVnRDBVMHlaT1FkYXZGQVVZTFBoZnJjVU9STmorc0FTUitCd1JBZHF3WEJEb1dJY0EzZjNMaWp4SGY5T1FzNlpBZlE4QW9TVmhjRGFYU2NBK0NTQkxEWk9Wb0xsMWc5ZHY1M2cyYmp2OThvWENsa1R3ZDBGQ2NrMWNMMHZBRWx4SGR5ekFnTEVLN1NhWU5HMEU5RlZoTFlJbWpPd2NvL2duOGR3MkxYNVRxTTQrdnc3OUZNK2RnZGtGMkFXZzlTbUVQTGlLMWVvM1NEcFpualB0QUNnaVFpaERId3ZhSDVYUUs1WVp6ck5mUFRDdS9lNVF1MkZEc3A5Znh5dzBrTkt1aE55dUh1VWZHNWticWU5TjRmR2RtSGY3SURjUlJtMlIxWTl5cmxEdzJBWkk2dVN6M1d0UXY1RFhrOE9yT2RUdjZaNGRtZEpsbUltenkzdmhVcWFHeVJJYjRMMzZJdzhVQnBBcytUQ0VTamFRd2o1Q2ZkSFpNTVNjQzdXZ2JPeVhRWUEyQWJ1eGlxUXp0ZkJDTmtIR1h4SzU0TzlOYzFYQVFEbUU5TGhVQm5OZzB1dm1nQ0Fzd0RhbEJqaU1vM0ZRTXlKV2Vrb25FOWdrdEdWajZreFd1aEFFRG03NFdjVkwwQVNBRGlCd3p0SGhEQVJCaU1RVTBhcitrMEJnTThpTWd2WW90OVNpSDFKSGdQMmJIUXFqT0t2S0pTd0RIdnNqTlpvbGRqREU1QUd0RWp1NlhQd3ppUlpOSjNrS1VLaGpSYkdQdXczdENvcUJRQWovdnZISUkxbzJPOGh6UFhHVkVZdUZ0TUIrMjNRdUdjYUFJQ3BtTHkreDM1K0QyRnVaeUJOMDhvUVNxTklSK0RkUnlGbHJOOWdWYWRWMGxqSFlKanl1Wkc1M1ZEbXZabERjMHFlTVNIaEhTaVdOOGY5VDBoT3pTbThsZ2FGL0ZjWElQL3Rnd3Q3RDc3cEdMeDlDMFltajRUT3ZvMmNtem5pMG9nSE5NbERFNUlMQ1BEWEtQc0haY00wN010Rkk1dEpuaGZ6TFRPUTlqMUg5OTBFRVBBYTFuVkxJUjIyWFJVQXNBcmlkSkV5WXZMV2RZVUExb2c5dVozZ0F1OVVyUDhkY01udUtSWjhMd2dJSmcreWdOZnVnVndBS3dTdzQzL1BNVTkwajdmN2VZOEJEOWNKQUN3M29SYlR6NUdiRGdWQ0s3bVgwYldJQW0xU2VRZGhYMytyeEpoWlFHRE1jeEtVZ1FqeFVRQXRHQzhOV1RTU2F2b3NFTW80STZzTlNZQXJ3QS9ZcVRBRU1BTzV6SE9RSWpZQjU1aFRHYlZpTVpJaWhlbG1mTTlZQUlCMU5xWVVXWEZLKzRMem9iVTZBTEh6d2U4K0MvTXhhckNxMHlqcFFVZ2xtNll4QmM4UXBaY1dBTEN5UFRRTU5mUys0am9reGYwbkNZVExIREQ1VDB2RFhnYlBBL0lZRGtHeEhscEtpd2kwMzZlWW0zRUZSQ1lCQU0yN2VBeDhCWlRic201U2tHY1FBTjRvR1F0Y3p5VHQva1JnamVkamhVQWJ5aS8wUXY0bzQ2OFNBR1JjYVVsY0FRRzk1QTY2YmdDd0RxenlYSVFGekZZcEl1cVF1MHFJWG8wS2s1bGpZRmtsQmllZUNFNjc0L2svQTB1STAzS2FBdDkvUXVFRGRKZTJYekVKRUt2L2ladXd3MkQxYSs4b2F4VEtHc2dxVmk0S0VTd3NvZ25Na0REcUIxZHREK1UyczV2NmhQZ0xHQVlRYjBTUGtnS1VKU3VYQWNBU1dEVXJLVWlBTEZBV3dFMjVCdTcwSlZDc25NcjRTc2sxSDZFVUtiem5HdHd6RmdCa1FHakw3elFBc0U3ZXZDWHd4R1ZjY1lHWG1QbkFPVjJGZDErRytXQldkWDFLSlQwT1hxTVliMlE1QUVETC9rR3d6N0lYMTJGTjRUZHgzTDlmU1Z0bThwOUY0dHdEdC84QjhaSkNTcXVUVXBSdnA1aWJDY1VBT2pPOGl3SUFMTGx3RHI5YkpwS3ZoSGU2WEhHWllERVd0SXFtTFdYc29YNjQ3ekNGYlhiZ2ZKMGFQSWV1cXdZQUlxQ2xES0hVOGRiYzJXOENBTVJtQVZoVzZibVJEc09wWHBMTHpEd0lWc1RzeHBmMzBOempDQ0RPRXhSdVorRDdRNFNVK2l2MEFIeWpzSVE1M3FZcDhobFM1S0c2QVVjR3VPRlk0azFsWDJjTjVZMHh0QmFJZTF1aGkzTUNhSXNFMEdRK2VveDN3TU9yQVlBcHNpcVMwZ0MxbU9JNmhSUjJnT2k0RmtobDFBcFRZYm9aa3A5MjRaN3JrUUNBaGU4MmtDMFJBTEEzTCtUMWlSR3c2NVNEdlVmenNhaUVOOU5ZYjJOZ0JLeEhlaVBMQlFDTFJKcEVXV2NCZ0NTaThwZ3JMUm9taGN2RXE4ZHlRaU54Q3E5bEY3eXlTYUV6cnRKNk40WGJmQjdDR3Z2QXJBK0ZHelJRZmtGZVYvd2RubzBtSU1PMnU5SytKdGpUUktxdmxrTlN4ZFJoWFBNRHlLN2pNL2JqNzY4REFEUUNXL1paSUo3OVV3WUFHUU85YXB0Z0FDenY1eEFuWlRMaUxDbXEwd0FiRlN2RGNXenZJSUVFMWt6eFpmNmRSWDdDYW5KWEFRQnVCTzdIQnk3a3lxOVhpR0tvUVBjVFlvbFNGWEJFNFVlOEp1K0RWbE9BeVlzTTdvSUhFTElTdW8wOWppRFRBZ0JZMnBVTEFTVUpsRTNLWXo2bWZHVk9aUndEcFdjVnB0cUNqSWdqNDU2eEFJRG5Jd2RlcjNQNGI4eUtDTzI3cFBuWVVMSXVqaUgxYzBjaE9QZEVFcmd3dkxCSTdQcWNFbXFxQkFCWUhBQThTNHNLUDJBak1sVlp2cG5MV3pQNXI0TzhZMHorUTNDUHZJQno0bFp4bFZhUnpROGk1MFk4VVp1UXRuMXNaRCtna1JDU0M1aXV5TWJGY3o4a0hiYlJuOGNXVjl5SUNYc3ZQQ296azZRNVFJWStNY0RRajNyMXVnQ0FGRjU1K3I4cEFHQ3I5SURRNDFvZ2crQkJncExUOHFGNWtibDVodllkYVFHQTlUdE5pVndGQU5DS2hGamdLRVRtUSs4S1c0d0hBZmNlcHhScDMyRWVIUGk5dHNkNFR5Y2Q0RG9JWTB3cWF5VDdiTU1BQUVQTzdoQ1lKRkFPS0tmNEdBUndVaXFqVlpqcUFOeXJ4NkNZYzZCTTk4b0VBTWR3NzNNbE43cFNBTEFIQUlQbjQxUWgvR0xJTEZaNEw3alNXZ1k4ejVXR0FESUszK2dZcmw4anF4djNHTWI5bVVFKzZwK1JVVGdoVHhMSWZ3c0srUStObmxWRnlWcmVOK1R4Sk0wTmVyY09JQnZDcW4rQThpRkpMcUNlNnFQd1lvMDNNSjU0T2ZIY3o4dExQN2pldzkweUFZQ1dQcjBLNy90blM2KytCUUJ4NzI1Wlp2eXVvOG9tdU9mc2txaEw1RmJLR2VraFd2TU0vbzVEWjVmZURYRUFVRUZhYnVTckFBRFNXSWpqaEJNS1Q0TTVGcGlsd1RYRzJWTVRxZ3JZQUh0VEkwaGVSQ2p1bUQwZEF3QVlRS0F3UFBOQ2E5OEFBRUlZNjZXWTdMTUVnWUtDSGt0RTc3dmllZ2FvQ0xCWUNtZkdvSEEvbzl6b0xWQ3doMEJlalFFQWk1Qyt0YU9FQURnL09sU0NPbWsranNEYTM0UG41Y2cxclJXWml1VVhyRkc2NkJFb1gvUzBWRUlDN0NPUDJCYXgrYmtPZ01nQksrNHY2Y1hDY2g5emVvK0x0T1EvRE5FeEwrb3NrUDJERFlLc3VjRjZHVmc4NXdEMkNWZEF4SjRzZFlaY2lEblBXRHI2cnBjeE5hNVFJUk1yYmQ1M2RzWEhHQUNRSkkvLzhoWUFWQVlBclB6bEpPdndNZVJLdnlCTE5RUW9PR2FOTGpRa0oyMkN0UldxZkdkWjF6a2xqMW9qa2wwRkFKRDB2NWRPTC9heTVleVNvejBVZTJ5Z0RBSW00bGtFUEd6R291MUYvbzZyQkFCYXFpbldJamdEWlkxWkFFalNHMUpBZ0NWUXVDenBCdVVWN3loS2o4TlRGbUM1SUFXeVRMblFuSzlzN1JYMExxQWJWeU1CeGphaFNwb1AyUzliUUloY0oyQnpTQmtwYVFEQUt1enRVNHF4THl0dTluTFRBSkZ2aEtHWmZWS0lValZ1MjRqN2MyTWJxOGVGdk9mRFNQS2ZwdHpualJTOUhRVjhZb09nMEpwbXlmdDBCdCs4Nit5ZUxCSm1LRmN1U0liUkRVOTJ2Z01nNEtFZlV1NzVqci9tdTdjQTRLY0pBRWJLV0JUY0JGcWRlMmFXbml2NS9HUEE4a1QzdlZnNis2NjRwcjlWKzE0cnI0dDFEQTRTcktlckFBRDN5MURlR3NjaUZrUWtWUVhVWEdldnI5RUR3TVdtWmdnRVlKV3ZJeUMvclFIcm5mdEp2RXF3amc2STJDWXBiNHRHUEpZRjNxQ1MxNDFuYWhNc1dzbUZYbkI2TVI4ckRWRFl6VE9CTkVEWkh6RnRxSzM1T0FmUXNnSFcraHp0aWZNS0FNQUtXZUluTUUrU1c2K3Q0UXRYSGptc2o4aVpWdk9rVFNQdUwxd09ibWpEUFM3UVU0SHlvU2VCL0xjSDkxb0M0OFlpQTFyOVNtSkNBT3g5T29WenBJVUI1UDVqeWg2SU9jOWkvTjExaGQ0WVQ0RVg4TUwvK3pOLzdRT3ZLOG9GQUpvTTNWR0ExRnNBVUNZQTROejdDMmZYL21jQVVCTWdpNVVEQUE3Qm5ZWDV1Vm9sd1pmT3JtU0loejRVUDcwS0FGQ1R3bjF2RWZDZWxSRkdzS29DcG9uMW9RdFNTMkZrRWs3TVhoRWdKRjB6R1FSc3UrTHlvOGRBcUVQcmNTSWxNVTBFMzVSL3B1WWxzdWJCU2x0a2d0UTQ1RUtucVFNZzdPWkJRMVpvWjljaVE0cFFEbG1MNklhZkJlQ3hVaVVBZ0VWYVVOR3VndklmSmkvT2l3UTN0NlVZdEc2QUF1NjRuYXdXOThmcWZ6a2dkSEtQQytZcTRIbm9wOVRZSFZkYXdYSExHQm9aY05rNHYybElnRnNLeitQQVNNRnVUeUVYT1B6NzFNdi9KMzVPNUl4TG1leG12NzROWUVqVWxBa0FHaE5TcU0xUTVsc0FVQjRBeVAwRUFFRE9sUmJvV0hCNnBUbE9RZVFTbjI4Q0FEeUtJUEJsQS9FL0lmQlZnMGhZNi9SU3M2OERZUm5aSDNVdVhJdmdOQ0pOczg3UHlTdFhxSnVQSUdBQnJEY2tVSjJCbHdSQkFLYW5wYWtFbUVsUWtId3VMWWEwUlpCS1d3bzRLV1hZT3JzYUdmSnBKR01jMmU0alZRWUFlNjY0Q2RjMnVaK2xIRE9HY0lSZG4xWXhjSTBHcVQyQUthTUxScjQvZXdPMjZmMURPZnAxUmtvdmhsRmVBNWdJalZNZ3NQSDVIVWlaZm9scGdGak9WeU1iNHYxRFdRQmEycmE4azVEOHBLTmdzd2NIVWlhN0d6SnBtb0JRWEc0V2dKVmlmaHBLVjM4TEFNcm5BTHlwRUFEbmJCOHB6R1JPWmJGS0dSOUF2Rzhua0VQOXpSVUFnQ2VSS1h4YWNTTUVFYkdwaFBzUitlRWFMeU1wMzFlVWxOWG81SnpTcjdSQ1RlSVdiQURPaG9BQXFUQTRUMm1BQjZDUXNDSVpoem5TN2wzK0JpR29hdWRTY3plR2dIRmFBTkJRSmdDUStpT05RSWFzS2NQRldrMEFzQXZlR3cyME13RU5RY3Z0TXRhUnF6UktTZVVobDl5WWJBY1V2WUNVWldlWERaNmtOV3N6U0loNHBtSUhucDlOeWtSSm0zNDU0WXBMc1RQWlVQc2V5OHQxNmtyckZLRDNwaFZTL3FRYXF4VEFHM0tGYW9HOVJEb3NwNTlFbDdPTHpHbGhsTCtGVXQ4Q2dQSUFRUGFLU1lETWVNZHVWRmhoRFVzK2NqRUxqSlZyelpCMkNEeklJZGVxcU4wR0ptdTFBRUN0Q3hmeDBmSnNtZndqY1RPcm1OQ2lpNjhLT0dpa0tpVlYvT3FHRkUyTkVQZmEyUjBYMFFQeENpd0ViQXFqN2Rzc3VES1BqSnpwRVFJbGxWU1Fzd0RBbU9GdXRHb2VYQ2NBa1BvalQyQ2YzSGlEQU9DQU9Cek0rc2RXNEZoZStGR1o2V0hZcDZHVlNKV3pDaDlCM09DY0lTUktsM3UyV0NuTFdrTXZyZkxlWHVSQUYvYU9rbjZadGthQ3BnTkNlM0JROFV5ZUttY08rUnY5a0wwbFZRQXhoWHNTUW03RFJEcE04eTBaVjl4M0EvdUk3SUNISStlTVNxcHZBVUI1YVlDSGtXbUFUNnVZQnNpMXc3VTB3TFNWQVBtUXo4REd4SDRHTlpETFdsc2xBUERDeFpmeHRmSnNwUTBybGhQdU5HSmhTVlVCTXhFS0hHdCtqN2xDNDVZUml0bHZPcnVneWF6QlFSQ3JIeHZFRENVQUFLejJaWVVxeXZVQU1OaU5CUUJwN24zVkFFRGt6bTN2d2ZyeURRS0FiVkMyNTVRbHdhbC9VbDVZcXNNOUxHTWRuMEQ0RDV1UlljcW1sdSt2RlExYVVEdzkxbk9aL0xlbzdGTTVTMnNKWXp2Q0U1ZW0zNFhVNGw5SUFRQllsbURvQUVtY3lNRVpCWTZNbkpNSi93N0N3MWdFMElEdGg5UDBOUmdIUUNIM1hxRXNFMHdSdjlabVFHOFNBTnlwTWdEUWl1Z2tsZTlOS2dRMDQwb0xBUjBhbGhNcmgyb1VBdElxQ01wQjVwenlXbGVvWnZYS0ZjcmZWZ0lBWHJyeUcvbGdubTNhaGtKV1ZVQXRTK0tBY3RxNTY5YzBBTEk1SlhYdmdzaGxpMFRTeEpLbUdzaWJkSVZtSHhvQXdITmpoWS9TdGdQVzlxWVYxeDlOUVp3Y2NPbTdBVllMQUVqTDU0L2ZNQUJBd2F3VldjTHl3bGdmdnB3U3NTL0ErNGZ0eUsyNC83clRHd2ZKZDg1RUFvQVErVSt6bXEyeG1PQ0ptMDdnbG1qMUY2UTk3eXA1WHM4RElRREx0WDZxZUhOV0FDeHhRNmw1ZVBZR2dJYTA3WURsVzNEZ2R5SFJGR3N0TUgvaVN0c0J2MmtBOE5nL3E5WlZyeFN3VmhEaTFJVkxBVXVjT3FrVThIRUE0WGFCZTFpckZzZk5oTkpXQXJUQ0dHMUFSR3Iwd2tqcVRuZTZRblhDY2dHQVZyMHF0cFd2NU81Zld2K1Z0aFFXcTBYTGtzQjYvS2VRTTc4TytlWkxrTis5U1huN1dxdm5NZnFXbDM1L2FHRWVzUkttSXdEQWNZVUFZQnc4R2J6UHJWTEdzY1JKc1ZTbWdkRDRKZ0RBQjI4WUFIQUJvRE9ERDRBa3puS2F4UFFROXljbTdyOWtlQlUzWUIvaW5yQjRIaUh5bjFiZmY4d1ltaWZ1U01rdXlVVE16Ym9yMURQWUltL01uNTNlRDJBQUNIdm9vY1R5eldmRXdka2kyU0NoV3FrbHNRWHAyMWIvbGRodldWZStheWVCRzRTZzZjZENhSCt2QUFCVExwcGNkWm9CYVNRMXkyckgyUEt6QUZNY0QwY3U0S0t1b3p6M2FZVS9FRks0b2UrUENXTzArWHNKSVhIQUZibzlob2hnSVFDZ3hRclhJVVVueVdVdWd2MXJWNmcvL2p6aXZsWlZ3RFpYM0ZCREs5Y3FIaE5zRHJNRnBNeDlTaTg2Qk1IUHJhS2wzNzJVOHRTSW5odCtQeXpSZnRGQ0FOYWN4U2dsQkJxenJyU3FINE5USVRFT0c2R3hFMUlzYUFHdFVlejVId2tBTEpOckcvZlVkZ0lwTUMwQVNCUDNsejNENFJ5MDF0a2l0eXFQOWhrazNITWxEQ2ZyMVUvRDZwaks1TU1wQ0pkWmM3TlBRektvSkJ2aE5JRkUzVUh2dEVoZXZsTkt5OTBEUWpXWEljYnNyWElBd0w0eEpHTXFCM3RLeXc3aTZwSjExd1VBcEdCTDdUVUJBRXk1NkhUaGJuZ3hRaVJVenpxVUV0TU1GblJTTytCUS8rdVhDZUdEY3RvQkoxbU8vUDBEcnREVGVnSXNSaTBPZkI0QkFGcWNYdTQxcHZxZmtDc2xybnNUUWo0eG5nVXQzVWVMbFdMRGxrUDR0aFBJamM1Q2pyU0VDNDRnZlFxRitvU2ZyeEVnQzNYNXRkVlNQZmNCYUd3RVNJRElrbzRoM3IwbWo4WUdrRUJYU01CeHlWWWtZREdZeGJvSFdGUkhxZ3R1d2x6bUlzRGkzeU1Bc0lCbEtDMncwNVhIRG8rTis4OERRMzZaYWdEc0E5amNnYjIrYTZUbFdUSHprSXhyaDRGR0VsY0d2RENVdGNVdE9ZZjVQUVZsZlE3R1QxSWRsUmJ3RG82NTR0b2NLQmZPQVBnZnVlSUdUOGNnRzA1Y3VBTnJtbS9CZ2ZjK0FFK2xWaC9rYjRXeHJnTUF0UHJEK0lKY3lWY0pBS1NBU0FhczFVb0FBSGUwV29IRGNHS2tnNGliQmR2RmNoNitLS1VqVjFyeER1UFRWbXhiQ3g5Z3hUeUp5WFViV1FEYWI3WHY3d2RCSWpHbk9jb25SbStHbGliRUtYeWNLb1FWd0pLcS96MzBWdjlsZXVMbmxLS0lZRW5qRmxoVkFlc0JsTWhoUnhDd3BhQjRiS0J6VEttY1V2aGxEZHo1OHpCdmsrVHExUUNBSEdnQkEzc0FBTENpR1Fyek9Zcnp4WlMrM1NlclJUcjVuU2tjQnZSeU1jamFWbUxjKzhEb1BvQzVpMmtHOVBjSUFCaFlabDFwUVJxdE1GQmFBTkNyZUxPc3VMOTRIQ2FWYTQvaDNJankzMWRJWlNMdk5LNVJsczcxZ2tKK2EzREZ0VHg0WDJXVis4d0RrNTZKcTBuakFNNHB0M2p1aDJ5alVJRXVTeTRjVXlyak1aM2puUlFjZ0podk9TVHZ3eVo0RHEwS29UK0dwNjhTQUF6NGljUm1FZXhLdmlvQWdJVXZ4Rm9kclFBQWFNeFc5QUt3QUdhMHhRaHltZHkzV3BvWnBvYUVCT0d4UWdBVFMzTUk4bjlIWFhGbHN6VGhtMEVTRG1MVnJiamkrdWFZenJpbjNCUFQzam9NYXlHbSt0OERiL1ZmV3YrZmVDQmcxVnRnM29OVndhc1c0cVlNQWhiQU1wWlkyNjZTc3BTRlE1OGpJYlBwZjc4S2xpQXFVMHR3SHNNK3hRSkFaeUNjdVVWdFVoYzVVYnE3NEE0OUlvdmxqSVQ5Q3JrUk80RnJNV2xZdGhja0NMSDIvVStKQTNCeGhRQkF1N2ZtU2o1emVtbGdrYVZwM3J0SEFmeFczQi9UV3RGYnNBNWhMVlEwZThyN29TSWZvSFEwcnZCbjFTcXBKV0l3ZWdiWGxmc2cyTVZRMUlhenF3dml3TjRHMGs4RHN6Q0VlMkVWNkJLNXNBenZoKzUrSER0QUFoVVpFTW9DU1BzdG0vQTlxeEIyQy9VSStUR0w2cW9Bd0FTa1EyQ3pDTTJWZkJVQVFQcVR6N2xDRnl0SmNXTUFFR01CTjRGN2EweXhlRTdBQmJ1c0NFb3Roc1JWdGRhY1hvdjZwU0VJMFlwSE4vNGlNRkhsY0tMMXZsZ0dBT0M1My9lQ2F3YzJ2Y2FZdHpyd1BWWElRbHFyVzZ2NjMxMXY5VjlhL3gvbHgxZXUwRjdZcWkrQUJDYU5ZUGpZZXhjYWxiMDY2UXAxN0tWZU9hY3NZYm5lSENtOExLSC9iUVhnY0JyaWhyOXVGMktYYUlVZEJpeVlqQXQza2N1QkoyUkhzVjV5aHJCbllOdEozaUcwYkE4UzdzbldUVm9Ba0UyUUFiRUFBTjhoQ1FDZ0lvd0JBTmE5MlpXOFM5ZnVLMTZxTk8vZFk0VDg5b0NzdGtJeUF2a0NRa1JkSlNXMENXNWw5bEFJUU1mOUlPY0Z4N3pUeTVVL0lRNVBCdVpwVWJrUGNpV1E1NkJkdTJUOFhyb2JpamRPbEgrYks2NGp3U0NBRGFwNWtBdWFiSkJHYTBzZ202MDZBT1Y4QzNkcmxKVEhFZkFFdDRQeS8xdUJxYXNBQUFzd1poUkZ5SzdraFNzQUFHTWtTTmRnQVphZDNtdWRZK0JvY1RZUU1wMVVHS0hIenE3R3ByRklzNHA3bGQxcGpRbDU5MGdtT2dUaTJBYTU1OWg2eDI1c0ZyTTJxUjN5c1JIajB0eUwybUZudHlaWDdBdFYvL3ZCVy8yZmVxRitDUVJ1K0hUQUp4UXlDVlVZeEpTZmV3WUk2UGYvZnhSeWVXZU10Q1haYjJnNWNYd3dhM2c0K2dpNExnSnBESm0rQ0pKQ0ZvemtrWE5xSTVLVFJFQnhnNWdkdUQ4TCt6NXdqMW9oazlXRWU2NG8xczI2RWk2eUdrV0ZyTUVZQUdCWldCdEdsb040N1BEYU5hZTNBNDY5Ti9kNjJFcVlqelQzN2lFMytqSXBwQlY0ZDNRTll5b3E1cXlqb2hGamFvSTRDcUpjR0RoUDBaZ2dnaU9HOVo2NjRrWkM4aTZoKzJSQVA0d2IxMnBqRWp6RHdzZmhJa3lQWGFINDJRdkZpejBJY2tGS0xNOHFzbUVXREZEeHptSzZOZkxGeXZtV0tmSjBTNk91UG4rTzJ2eTdGeW4vU3lPcTJnQmd3eFczanRRVUlTdWpEU0NuVkFzQXNLc2ZlNUpqTXdpdGdocXo0SjhRYTUwdG5uV0tyY1ZVVjBPQ3pXYUlwVW5wYlV5YTJ5QWlXQlpjd2poLy9PeXNLMjFJb2pYMmtDd0FiZTVQeURVdFZ1bXU0VjdFRkw2SHptNVBIRlA5NzZhMytpK3QvL2M5RUpCMHdOZ2VBMXdWOEpZQ0FscjhzM3Znd0dOeER4eFRDaERnRG1SSENqZ2FCaUdBb2F0SkFCb0x4TE5BTWxYSWdubE92Sk1sU0U5Q1hvTFdJR1lKUUR3TGV5bFZhNFZNcktZenkyQUJMU3BXekF5bFNiNVVnUGQ4Z2pYWTYwb0xjZDN3SVBGUENSYldJbGpGQXpSM2k4b3pwOG03bGZiZTR3RUxsK2NqemIyN1lNNG1GTUFxZTJiRUZmY2VRQXQzeEZCQzQrRFo1ZjN3VkZHUVF6UUc0SGN0c0U3M3ZWeDRUdFoyeHJqUElKQm9KU1U1bzF4bmpVSElaT3FCakJ4VS92ZThva1FRZ0hJQnc5bFNFR3hVa1ExWUdFamVXODQ4OXdJbzUxdUdJRHRMN3QzbENyMHdHbHloL1ByZmxQOGxLSzRXQURnREYrVWhXS014aWhESFZRR0FZMkp0SHdjSVR0eHE4akVnMHhBamREZmdqclBlUGVSZWxmYWxXdGU4TVVEMkcrQVNQVGJtejdMZVE2MHdzZUFPTS9YM25ONG1WQ3lYSlZmYTE3eVZEcnRHeXR4M2NkWC9ib0JGOTU3N3p3SXZYM3NsSHVveXVBN3Z6WFAwRFlDQVJ4Q1RGQkpuaHl2VTgrNmp0S1dNSzI2MmdncVE4MzhSSEkxUnZqZVNWN0hDNEFSNXREWVUxckpsd1lobllRTGl6ekttWEdtREdCblRGTVpqWWYvTUNKbU1STnhUVXl4UzlBajN5M01DM2lOZ2JWbldZSmNyTFJaMUNRNC84MkF4WkdGTlVzeTBqOWFWcngybG1IR2FleWRadUR3ZmFlN2Q1Z3I5S1FZVnBZUldMNjRwMWh2cE5aU3ZLSEJ1dHZTanJQcloyejkvMzM4Q0hvQlR5a0dNVllUODI2c0FBRm1GdFowMUNFNXNyZGI0VWV1U1c3YnVSSDYzV01rckFmZnFDeEJnN0JvVFpEOExKQlFrb0lRQUFDcnNEWEFIVGhyaGh4cFhYQ0FIM2RJNGtOdzJRd0twSFpUU1ErL0M1MnBoZUIvdSs2MEo5RSs5UVA5OWZuem9BWUdVZ01aNkU1ZzVzVXp2akR5RHp6d0l1T2s1QmpVUWx4UnJ0OW12UVJ1bExtR3pGVlFZeUJ0WUJmZjNuQUdPdUdOWUg0Q0xTZklHekN1c1pjMkN3WmE2d3pTR3lIckJnZFpLanlic3lWc2l4WlQ2SXU2WkNWaGtTQnBHNE4xSjk3YXN3VllBenc4OHFQdmFnOFQzSWl5c0RCQ211SW1POWt3RVhXbnVIV1BoNG55a3VYY1RXUFRkQ21EdGcxUkJzY0tmdVVLQkx0eUhYYTdRdlU0NjJMWERYc05XdGorODFaRC9lQURBS2s0UW93aXQzOFlBZ1AwRURzQXN4Qm8xZHVhMm9vU0hER3YxcmlzMG5MRmF0aTVDakkyOUNjZ0JXQ1VyV1hPdllodlFtK1FhNjNERjFiMW1nYVcrYWlnM2ZyYkVBWVdKT3VsS0M0K0k5K011eE92Um5jamxLR2NWcTVHWnA2S1V2bGVBekR5a3lVMHA2VGdDUmxpZy84NjdkckZsOFdPdnFGcG8vbWZwbldmQWJmcWh2OGZYM3NOdzI3L3JRMWZvNlMwbGpPdTlvSlRSQkFJVGhUVHlCdVpnbmpUeWxCU013cDdoYlVwb1lJSkl0c3hhcnZWNzljYytDVzhsMXRzL2IvKzgvVk5OQUlEdVlNMFNYQWNsRTZNSXJjRXNjT3UzM0IycUhSUUxrcWxXRkNMTW9xS0VPeWhXL1lOWHd2Y01SaWlTWnViSk1zdVErM0lLRkFGYXlacDc5UUhrdWtzTXFnNEsrL1NDa3BsVUZETXFOMzcybkN0dS9ETU15aDh0QXJHZzBJb1VkK0k0RFlsem9XV2tNVTl2K1crU0d1VkR5djNRbmRzQ3hNRjdRT2o2MEZ2L3YvRkFRTklCYjRQSHBoRmNvVU9RQ2pwT3NjekxkWHpYaHhRKzhmZi8xai9yQnc4cUh2ajk4TmkveTFNWUx4UWdnTHlCRVhqbUdLdzVncU1IRUc1NjdncTl4RnVVdWhZWTcyUFc4a1AvdnBkNzlwdTNFdXZ0bjdkLzN2NnBKZ0RJRUpNL05HSVVvVFZtaU5SaS9YWldzZDc3RkRJVnN6TkZBWTRaU2hndGNJa1AzdytraFl5UUFrTTJkcGVmZ3hGRitZaVZ6TzdWSDRTbzRaWGFBNjhjNm9pdzB3L3UxakZEdVdVVUpUU3FNRkhSaW56b0N0WDJtaFYzWW9hR2tFKzZ5UjNONUpOdlBTR3JtUWgyZUs5ZWN1Zld3cHlnKy8vUyt2OWxmdnlCd2dEM2dEekpjNFhQK1ZzczgrM0pmdnZuN1orM2Y5NytTUVlBM1lyQ3MwYU1JclFHMXhDd2ZxdFpWQnd2R3drUVlUTEFBbVVsak5YbXZsVVlvVWlhNlNQRjBnV1dXU3NSYXpKRXBHbFNsUDhOWCtqbVk2K0VHUVFnT2EwYktyTnA5K2RuY3h4UW1LaXMvQytWNlZkdmQvM2JQMi8vdlAzejlzL2JQejh6Rko0MVloUmg2TGZkcnJpY3J2YmJmbGJnYjFmcDdaKzNmOTcrZWZ2bjdaKzNmNm9QQUZySTZpeDNjSXo0eVJYZSs0YTNxaCtBOWM0eFc4Mkt4czUzN09ydWdSelVWaXEwa1BRZDZDYVhlUHRMY3JWcnZ4T0x2UlhZM21tZkZYTTlNcjZiRXQ2cGw0cE52Q2p6KzlIamN1bmkvMk4rL0RZL2ZwRWYveU0vL3A4VSswK2JwMGMrTFBCQ1NYZTZxcm11aGV5UkZ1QUd4TXdoN3RtbkNrTmJjcjM3bFAwNlFKNmVidmdXOGZSZ29STU16WHhVeGpuc2dmTWdIcVZtWW9sTENLaWNNODVuamIvaEhuQkxQb00wem5xYUx6emZBOHI1eGpBV2VzYmtHNW9qemtKdmxXUlhjOFNlNGJNYXM3ZVIvUy9odGFTem9NbHF5ZHN2WjMrblBVZXhjbEcrU1l4TjYzM3crcVJyTFZrUSs5MjRSakg3UjB1dmZKeHliVnZUem5FYUFOQkpjZWR5QjhhL2hYUjNWZmYrd1NzWWRKOXJyRzJPbzJQbk93dzVjRXBURHhHNmtyNUR5OEZ0SXJMZGlKRkdsYUZLYjJtZmxYVDlJRlgzNmdBU3B2Vk9XRzZ5c2N6djEzTDhMMGwrLzVFZlA4K1AvNUlmLzBma0hzRjVhZ05CaDhUQUhramJ1NHE1RnVHRjlTTXlnZlE0bmtQZXMwM2tmWk4zSDFYMjZ3VHRWUXgxb1NCN0FjSWNRVURhY3poTTU2RXZRQUt0OU42OWlqQVdFSERUWjNFOEorR3N6ZGVFY3I1SGFiNHdpK1ZGeFBtc3hzRHpGOW96MmxtTjJkdERSTEN0anpnTGc4cGNQRkxxbzhUdTc3VG5LR25lOFp0YVhhRVZjaVppRHBLdTFlUkpJNlJscDFtam1QMHpxR1NFUFk5Y1czelBWREk0RFFEb2cvS3lNMlVPYkZLQWFYZFhkZThhc0xLYmdIekdlZHZNcE1lYzYzbUZRVC9waXB2dWlQQk8rZzZ1d2lYRlZEamRqc2VVVWkwdzdiT1NydWNVTlN4QU1oMlliK3hmVU03MzEwS1dnRlQ1dXlUMy9Tby8vamsvL2lrLy9zL0lQVEpsVkZYazFFRHJteXFkYXl4emlyWE5Sd01GY25nT2E4Z3oxQUU1NlNOVWE4RGFyeHJaTlVPaE5RUUJZa1duUFlmVFZKQm14RWdEZlZybXZhZmhyR25DK0Rta3JINFBwYnU3cUVqVE5NelhnakpmczFRZ0NRdnJORVNjejJvTVBIK2hQY1BYdGtYdTdTa2laamNsWEQ5dHpNVlRWMXE3UDNaL3B6bEhIWkZ5RWI4Smk3Vk5KVnlmZEMzTEFqbWZ6UkhmeldzVXMzOHdJNjJkd0VaUHhOcU9RYkdtYUJtY0JnQmdyK2FWTXNjU0ZkNFJKWEJWOTM0S2dyUVRsQnFYY0YybUZFTXNheXlwalZwakIrNklsZlFkV3RXOVRxWGdEdjhPK3dWSWc1eTB6d3Bkdit5S081RGhocHQxeFEwdmNMNjVnMkU1My8vQ0ZiZjUvY1NuOS8wNlAvNGxQLzViZnZ4ZmtYdGtVU2xyckxVYm5URytxWks1bmxTRU10YkFXSWljUTk2emZRVEU1bHh4WXlKcnZ5NUR1dXNVa1dzUkJHQ05oalRuVU1vS3kza0lkU0Y3VWNZWlgzYWxUVlNzeGkyU3RvdktmeFRPK0pKeXZyVmlWbHBwM2FhSTgxbnA0UE1YMmpOOGJhZFMrRXJiMnd1dXVEeDdTOEwxV05VVFFjTnpwM2Z2aTluZnNlZG95QlUzS2JMbW5UdHJTcytVYWFNa05jNUIwclVvQzdBMlNUdGttOFd1VWRKM1lOOE5OQVlZWkZscmhUSXJsUXhPQXdDNGdjdE9HVVBycFBYcUN1K04rZk5ZR2xYcWFxOVN3U0FwTW5UZ0I1ZThsYjRDM0hSSDYrbk0zN0dsRkVqUzZ2eHZLdDhtVFUrdzVrSGFaNFd1NXc1a1hQSjRRM2tucXh0ajJ1K1hTbjgvSkFDQW1EMkNuZjRHUUdnMUErS2ZnR3FSTzFXYWEyN2hLdUVEcllsVDBoeStDT3haVVdUU2NBZkxNaC9Ddis5U3dhdEZTSzhkcEpERGM4aitTSE1PdCtrOFdIM0lSVkduUGVOOGJ4RnlXdXRXS2R6Rmx0a0N6TmNPek5laGNiYTE1am90RWVlejBzSG5MN1JuTnBVNkt4MUs2V3VlU3k2dzFocTRma2Nwazk0RHRUa1lVTTlHN3UrWWM0U2x3RVB6Ym5YVzVLNnAxaHowQjY1RmVZTFZTYkdVTTVicFRscWpwUDJ6NllwYndndllRTyt3N09mMUJKbVZTZ2FYQ3dDa0ZQQnhpbUcxMG15NndudGpRWmhoV0xSbHAzZHZPMUZLRko5Q0dXSHBLN0JqSENqck82d1N5UXdBdUc1L3FHTmgybWRaMTJzdFdhMm1SOGV1dUt2ZFhBQUF4SDUvT1FCQTJ5TUhBYUhWNm9xN0VISnpwbkxubW51c3M3WEFBR0NIZm1lMXMwM2FzOWh5MTlxcldhak11UTdXV0toUFE1cHptSVB6Y0FCS1k1bXNhT3gzWHM2OTVSdTAxc2ZjVlk2RjVaci9yY3pYaVRGZlI4N3U1OUdTY0Q0ckhkcjVzL2FNMVQ1WkF3RDd6dTRSZ2dBQVcyWWZ3WE9zdHQ2TkFLZ0hDVkR2S1dlSkFjQ1VjZjUybGJQSEhUMXpkSDgrUDFnMGJzTVY5NFBaVmdBR2c1ZEQwaWs0QitOQUhNVVM0NXQrZitGN1ljZlJRVmRvaHJlb3pCTitDNEtOSGpCYVpKMndFNnkxVHFsa2NLVUE0TFVyMVBHdk5nQ294cjA1TmlhVEtJMXRSQ2ljdWRMKzdkaUhuYTlMQXdCZWx3a0FMdnd6MHlpbDF5a0J3SVVpVkVaSWdFb0xZNnZsTDNaaUsrZjdLd0VBbC9mK2kvK09uSElZeEszZTRZcWJLV0VYUXJsSE9YTjk0WW83R2JLMVlBR0Ewd0FBaU5tem9yeU9ZSi91dStLT2o5aUdlSmRBQUN0UUlYZkZuc01UT0EvbjhDNTdpbmVzTDJGdldQYys5d05iS2E4cHJteHBOZjJZaE9VcUNIVlIvRGxscnVSczU2b01BT1Q5cXdVQUxzb0FBS2NKOG1xRXJNVkRlR2RVc09JeUZrNU1DRkNmT2J2VHFxYWdCWVJoVy9rSjhFS2loWDc1WG4vMnZ6bFFGSzMyUHVldXVJc203aDFzOGI0T0lPaTFBZTVIQU1TZ01wZXVySWZneWNCd05NcWVGWnFyTTBXUmowRjJ5Z2g4azh6WmliUGIwR3ZuN1B3cUFVQ3V5aUdBYXQ2N1E0bjd5aVFlZ1lBNUpMZXBqQzF3bzBoNzE5emZPUUNRMXFzb1FEVUJqMTN0dWdKVzNuVUFnTDhZUWt2aXVOMnV1Q1UxSHFTLytsSE9YUC9WRlRwaWF0WkNPUUFnelo3ZEFUZjVoaXR1UlN3TnR5emdOcXlRdTJMTzRhNHI5TldRODNBR1FtWlhzZnc2VTV4eHZQY1JBSXhzQU9CSkV5QjJ0ZTZEOHRmbWE0dThnRWtBSURZRXNBOGdiYi9DRU1CVkFnQlV5T3N3WDJla05LZHB2M1E0dTYwM3Rvam5VRVdHdkE1N0FKWTBKVDFCM3lQbjlaem1ZaG95UFdaaDNuSUJjTkdwbkRPeDVrOWdQMk5vY1VKeC9hTnh4TmNPUWFvc2dvMjFBTmpBOHprRTY3TkdjM3dBTG4wRTlYek9ncDE2cXdVQXRpc2tBVjdWdlZud0k4b1RCU3NUaWNRcFlRa3ZBV2xqSFdLdjIzL0hBR0FPVU9vQm9NMTlpRlV4QVZMUzVkNEVBRGdHUmNkQ1pCaHk1dEdkdUFVSDk2U0N1ZjZMdDBnc2E2Ry9EQUJnN2RtY3NXZVhZTDlpSzJJRWIyaGxyQ29rTW5Hang1ekROU0FmYnRLN1daWlpWK1M5VitIZVcyQmR2WWIxV1ZkNEh0STBpbVBudU1kM2FMNlEvQ3RnWUpNVWl1elJOQ1RBZFFVQXJLY2tBVjRYQU9ET25Ec0tNTVA0Y21pUG9tV0s3bndFZ1VoVTVEWFMzUFRpTnQ4QWkva3Y5SDRJQ0xuOXQ0UjNORzZQNW1sYkJZL251V0hWcyt2L1JISDlUMU8yRTRMNmFRSWJwd0JvT0xTcWVRMU9hVzNRUTlORFlIV2RqQVAyRmxRVkFDeFhrQVo0VmZmbWxyQW8rSEZ4cFJXdHBFa0kwcHVpRktMRkJGWnRXZ1hZL2hNREFMT3d1ZmRCV1IwUTJRM1JMWkxKcmhzQW5JTVZlbUVJaFg3Rjh0aWxXUHhwbVhOOURBYzRaeENIMGdLQU5IdFcrbTdnZnNVT2xTak1UZ3pMRE4zb01lczNCeW16NHAxZ1FhYUJzRFQzWGlDMzlCa0FQQ3VNK0J3c1FIUVpueXZXN0lSZm4ybDYzaEt4c2NXekZac0dPQjhBQVBNcDBnQ3ZDd0QwVUZ4K0UrWWI5d3UzNmU1VndnZFpXdjlsaXJlM09iMHpMSVlkbUFlQSt5VUxJZGd6aGJNekRvcHZRd2xITEJOcHUxRmg5SE9NL3JYaWFvOTEvV01hTVhjbm5TT3ZDWjVQQktGVEJtOWczd0FiN2ZTTUpjaldVZmQzdFFIQXRDdXZFTkJWM1h0QVFZWEhoQ0JSWUk4Q0MzNFFZaXFqSkdDdHZObzBDaEQ3ZFA5VUFJQUlkTjdjMjZCd0psMXBCMFZKSjN0VEFPQ0FsRGk2K3dZSkZhUEN5bFlBQU00aGpueG1DSUx4TWdBQTd0bTF3SjZkaDV6ZVFVZ2ZHNlZ2M1FNRmtndVF1OUo0Y01hVWR6d3BZLzlaOTU1UUZObDVCQUFZSS9meWlhR1VwQk9tRkFDYmhMb0RXajUyVENHWDhRZ0FNTzdpQ3NGY0Z3RG9DdXkzYzFLZXFNd3ppdFY4WklBR1RQbkZUQnoySEdpdStsbTYvekdzNnlrOWE0SUlnMW5ESXlWelZrYzUvWmExemRaNUd0Yy9weUgzVWVvaGhpSXZsSHV4VitJc0Ftd01rNWRoRzBhSmgrc3FBTUNZTWJCQkVKZVhUS000dENHSGgrODlaTGlSdEJpWHVHeWxtbEtYS3k0VFBPQ0txeXRwbGJVcW1hT2ZBZ0JBZC9PWkFwS21YSEhCbTJaWFhDTDBxZ0RBZjAxUXdudGdHUndteEFibDhKNUFLbGdsQUNDR09KUUdBRlN5WjNzVVliWk40WU9RR3ozTittbkt0aG9BWU5nZ2lta0NIOS9kOGdDOEJ2N0tPbGhCVXdENEJ4VlpndnM3cVpSckpnVUF5TGprVXJEWEJRRGFEYmQ4VnJIS2NiL3dIdDFYWE5NY05uaEYzQUgyeG1rOEFIYm41d0FNYU5kckhqNHRXNkRUYzBZYVhIRTlnd2tBUWp0S2FHdFRDWTJHWFA5aUhOVVJBQnBYNUJFYkVjc0tMOEVpSENQWTBNNVo3cXBKZ096QzA4WTBiQWhrSHo5TUlSeXNNZUdLSzBocG5nVk5zV29zMXhiLyt5Wmd2TGE3MHJyUFdtM3RTdWZvVFFJQVp2d2ZFWEVNMDYrNklDY1k2NzFYR3dEOG13Y0JQMDlRd2lpMFVBak5LaGJsSHFURjdGUUJBTVFRaDlJQWdHSEY5V250MlFIYXM2MUtISEFUM0t6b1J1Y1lmUm9TNTRnUi83WElXV2tBd0FTRlB3N0pSYXJOR1hNQWxtbFBJQkZ5RStvS3pJTHNFTkptbHl1dXlTNGxtUnRCSHVEb0tBTUFkQ2ozd1I0SzF3VUFrSU0wcVZpbHAwWjY3YWd4enlIaVlMMy9aMStBcThFOEFNMWpoMmVDcjJlQ3J4WVNGTS9PSTY4alhybmlTcWthNHg1QjVCNmM0U1JyWEVxZEM5aVF2UDRoeXV1M1FnN0lXZE5DQkpoeUxQbzBsUXl1SmdCWUM0eFZZamRpVVlsWTEzRm9jQVdwRnVNZ1lld1dsUVRudVdLRG5pNWdjdUtRZzlmc0NvMXRLcGtqR1c4S0FDQnBqQzNaR1ZkY2dLVVZtTmZTeHZpN0tnT0EzK1hIYjl4L2xnVCs5d1FscktVVW9SdFNTMVdTdzFzcEFOZ0lvSGdrRHNVQ2dITDNMSlpuMWR5c1ZveStIQTdMdEN0VUd0c0dKYzBNOERRa3dHV0t4Mk9jOWNKSWxjTHZmNmFrZGUyQnRTZ2dBR3NqTEFPUFF2aERhUDFMVTVZbkhtQklXV25wOWRCWUFRQm9oUHU4OVBldTljKzZMZ0R3aWx6Z0hKdTJ3a1pheU1BS3Y0a3lsR1poRmtEVjR2cG91SjJDQXJSNEEwbnBmeWgzN3ZtNWZxbFk1M09LZFM1OGdpeUZCVUt1ZjVHUGoxeWh3RmVuVWt2QVNndmNWcmdNVE9MdEptUHNqUUNBdllSaGJjRDZ5QkJBYUd3WjkzNXBIQ1NOWE1pL2E2YTRYeWpzMEFrTFVNa2M0WGdUQU9BQVluSGk3bG9oeHI5c2JpekJlbGxCN3JLUno1ZFZCQUNYRFlIKzVQNnpNK0M3K2ZGT2hCTGVCV0dQTWQ5cEpWVUpoVlUxQUlDRjRrVVJWZ0lBWXZmc00wVWhzWXYrSW1FdFl0WnYwUlVxRW00QldmUjFCV21BMjVSZElCa0FPVkFNSVFLanlCR3NUTGRNZkpZek9GTlovL2ZpK1VKdndMQUNBdTZCSUg4TVZsMmxBRURBeFdOLzd4ci9yT3NDQVBWZ2xZNFlRRmxMcjlYNE5CWUJGM3QrTUVEbEZEOE84eUFJUHFZemU2SjRoWkxTL3dTUU5IbVBaWTByZFBmRHFudFdiWUF6WlU1Q3J2OUhYajdlZDRVR1NsamJIME1PbUUxekRPRkpLK2NmdlNzeXZ6VnZBZ0Njd1dKbzQ3Z0NBSEJDTVF4dGhPNnR4WnFTaENDelF5ZFNoQjNLblNNZXB6Njk3TG9Bd0Q3RjBCRnBZbG5YZHRyYzBvVGxLNis0cXdFQXZ2RGpzanZkWlh2Z2p6d1lTRkxDeUVUbTFCL0xOVmd0QUxBTUlPclVDQVhFQW9CeTlxdzAzR2x3aFJLdGFXUDBNUUNBOCtjUDRQMFFPS1lwQk1UZ2VCOXFBRWdvYWg4QUthZVdZU2dSWTdrTUFySUFnc1I2bE5vQUc1VGhnaVRYSmc5d2IvazlLZ0s5V2dEZ3ZyL25ELzRaTjY0UkFMeHdwVlg5MkMydGNVKzArUFVockQxYTI2M2dDbTlVOW1jb1kyTk5DZG10S2UrMlNXejVFMmRYRjVTNXYrSGxGMXZub2RvQWYxVnk4RU91Lzh1MXZlblg5cUVyZFBmVFFnNmJGRXJMUmVUOGR3TGZUWnBpWFRzQXFGUkpQN2xDY0RGbVdFRlduTEpGT1JCYU9vVVZkZ2lsaTJWVERNNTl2bW9Bd0RIc3BOaC9QU0RPSDF5aGxXK2xBT0I3R0RjOElMZ0VGNTlGS09FTnhUTFlnSHp2TFVWWVZRc0FMQ1RrRUMrWENRQmk5K3hWQXdDc09JZ1Y5RTVCU1I5QWVpSzdLSnRUblBGVFYxenNhSStVUDNmQ2t5Skc5MTF4RjBzRUFWSVhZUitBeFd1d1hQZVZaNkNINFhKdmYrMzM0L2RYQUFDKzkvZisyai9ydWdCQUxYeURWdGVmMDJ0WElRVlVLLzNMNU5JdUFtaGlBZmNhZkEwT09XQm9Md3ZlWHBaZjJ3RDJ0UFEvVGtlczl5RkxVY3pZTHJ3M2tCYjRGeGV1K0ljZFNMSEoxdmRLeUlHYkhiSDhPRmM0VFp6emo2VzhwYVBxRytNQWxPdW1mK3l1THJ5Z29jd2tJZGhDQ2xOTHA3QytKMm1PdGlMSGRZY0F0S0l4elA1SDFOa0N2SWNhNzA2cmxBTnduOFpkZjBBdkVmUzNFVXFZODJwUkFHak00TFVxQXdCT3UyTkNUeXdBc0pqc2I5SURjRUZDQ1d2b281TFdVa1cxWmtBaEErSUl2RGg3RUt1M3JITjB0VW9USlFRQlFpYVRwa0M3cmxEekhjdjE3bFBZQ3duTEgrYkh4MTQ1WHhVQStNSS80OE5yQkFDaWtEVHk2QWFsMXlLZ0RwWCt0YW8wUGdBMmZIY2tENERqL3h0RWxHWnZIM3NrdEdxRW9xQnYrWGNTMTd4VkdBanZlV0hVQnBpaVhIeHNzaVdlVFF3NWNCdjRLU0pnU3NuanBKeC9mczUzYnhJQWxFdlVlM1NGQk1Pa2VDclhxbTVUQUlDV1RsRkpLZUNsaFBFbVNZQlpFRnhabUhzckJiQmFXUURQbFBIRWIrejdnWHVqRXRaaWwrSUNaRXRDMXI2YUFDQW1oN2dhSEFBTDdOWUNvNW1WUWF3bklkWURnRjMwdGtoSlR4cXBvckVHQk9laGEwU3JYcWUzQTY0akVERG9TdHNDcndGM0lRZUNQY1F6K0wzbnBWdzFBUGpBUCt1NkFNQkRoVHc2VG5GcHJTWUF4dHF0VEFFbWV0OE5QR3ZkeU8vZlZqZzdXaCtCUFlqWEgwZWt1ejczNy9NWTlveldkbmVUNHZBQ0JMVEtmU0hML0FzSU9XalAxTkoyWHlzRVRBNDFTQXEyZUJxK2ZOTUFvSnhVdlZqaVFqa3BoaUZHTlZlUlF1dTJKOEdkWDJrdmdDbGovSlRTQUdPS0FEVlZvUTVBb3pIcS9SbytEZXdSVnNJc1NBNklwYzhzOVdvQ0FDMkgrSnhpZUdrQndMYVJCYURGTk91TWVPNkdLeTJtb3ltUm1EUkFMaXU2NnE5ZElCSmR2K0lwaXRrYkRLQ3M0a3BhTytBSC9odmEvTE94THNLdy85MDBrTXMyWEhITmkvT0FKZnZPTlFLQWQxSUNnSjRLQU1COThCeHhpaDVYK0dQUDJSNFIxRFRpSjNacXZBM3BjTnhLZU5YSTcrZjQvNG9CR0E2Y1hvOGc1SkVJdWY2WkFDajdjTmVvRFpBVW0vL0VoM2ZFNjhBMUNOTEt6VGJ5ck56MlhvWlBmd29BSUtsWVR5ZWtvTlNsVEYySUtUS0VLV3BhSFFDckxLckVGVHV1QVFCSW93Y2NQN1ZDUU9ldXVPNzhpa0lLUk1icmt6TGVxY01ZN1g0K200RGhIcU9FVnlpRktVdFc1UkhGMDZvTkFLWVZWeDRDempSMUFKYU1QY3VzNWg3SUkwZEJwblZGTzNWNll4U0oxY2Fzbi9RZG1QZkNWY0Q5S0tYUklWY2t0dGFIQnFCQ0xaZFowRXJtVHNZVldyZjJrVGRnMHIvM0VxVUtoZ3lETncwQWNnbEVVRTc5M0lnRUFIZkFJbTEyNGFaWlhBem4wT25WQXRHYml2eU03eW5rd09XRU5SNEF4LytYWFhIZkFzNzZ5YnB3TFFvTU82ZHgvZWVBTEtyVkJsZ0hMK2t3RUtiRlEvV0JKelYvNStmOGtaL3psaklCQUhyUDcvajdmdUhEUno4SkFKQUpqSDVYcUNIZkZPa2V0RXJveXBBQ0hxMFFGM25raXZzd2F6WEx0eFhGMW5kTkFFQnFDZnlVZWdGd0tlQUxWMXlBWWdVc1Bld0ZrTGFrYyt3ZTZZQlFRNHdTWGpMaWlaejd2M3hGQUdEYzZTMC8wV1dZQkFBc0FYeE83NDhXaCt5bFhxYzNOOEc5cXpWcWlXM0toY1Y2eHYzenBZd3RudXRtVXY1M1V0eWJ1UlRjWlhBQlBGRzlGQXZ0QjJ0ZjNsSGVUL2JWa1A5N3RuSXZBdXR5M1FBZ3BuRVNFdHU2RmE4UDVzcGI4dW9XeEtVeGZLUjErVVBGektsMldxbmRGZ0Jtb3FRZVFlYUJWb0JJTzdjY1lyQUFnOWFORU1zUll6MkNoeEhNZjNUOTcwT215TGFSczQvazEwSHlVTDNudlFEZitGQlZOUUVBcGsvLzhhY0FBTVlUeGlpbGxUVzY4cHJvNEJBTHFNRUxBbUZnWnBTWUZqTHN1Y09kV0RMRDF3UUFmbXJkQUxWbVFCd2Y1VzZBUFJGRXI3UjdaQXpBV0VmQU9tVWxQRytrTUdsNXdWY0JBTFNXbjl6Rkx3a0FaQklVT0ZzY1krQlJHZ0hscHFVV01ZQmdablJhQUNmZ1crTFE2Tmw3QnNyLyt4VDMxcmdVVm5vcWVrQWFJSWQ3RHRaWUdueUpwM0JJeVhuL3FRSUFmajh1elRzQmF6L3M5Q1k3SWU3SURXQ25JME5mOHlDZHdSblpkM3FuUFhUL3Y0Sk1vZHZlQlY3akN0WDNZbmdBT1NXZUh5SU9uaVNBWEhtbkJ3b1JiekxnK2hjUEtMZnlaUVBKOGxCZEZ3QjQ3MDBEZ1BtSU1RdUhOeWw5TGpRQkRUQWtYdnpNVDhvOWoyNzduRjdnNHRRdkh2YTRYeWEzNXRRL0lBQ3cyZ0dmMDF4WjFRR3J2VWN3RlNzTkVZOUw2SjY1MGhMQlZ3RUFCbHk0bk9pcDRvcG54ZENyNUFjZndIY2dPWE5SMmE5elNqam5RZ0VQZUFaamlYb2FFTWN5dGkrOWdIL2loYXdvLzY5U2VoZTBVQUFEOWhrbC9RcXpmalpjb2NYM2dqSlA4K0RxVGVJR1hUY0FHREk4bHh4M25sUFdYc3VHc1VpZjM0SkN3cG9BWEtpSEFiWFcrUTg3N2JVQk4rTWVmTjk5NGdIMFVlb2hlaHVPQ0dTZzk1RUxDSjI3NGxMVW1wZUUzNmxGU2NWYmNYYWpud1duNSt6THUybzErbVV1L2lFQXdIcmswR0pGNVU3QVV6K2UrTWtRb1hQVFR3cTd4bENvbkpGaTI0SjBMV0hyTHdmSVdIK3ZBR0FDaENNejJwTnFCRlJyajJqbFhtT1VzSmJDOUJkWFdzeGs2Z29CZ0NaUXhGTDVYMzZFRkVPWGtoL01HUnBTd0ViYnI1anVsZ1BMall1WGFKWGF5dG0vTDczeXFJWE1qWHVRR3ZxbFMxY2thc1FJQlZ4UXpKWFRyem9VSmJ6cnYza0RDSXM0VDFzR3VPTHNvT3NHQUJtRGpmK2FnUGdLWlJDdGtuTFNYUFRvRHYvS3k4b0g4RDJhWW1aQXJYWHY0ODUvbUo1NUNUUStBeGI4UzhYYndEeXRQN3ZTUFA5cHB4Zkt1anpqZjNXbGhZR21qS3l6TytUNjF3RDdpY0k5c1RnQzZLRmlzbXJYUHdJQTJJOGMxVkptT0FIM0lHZjhsaGM2VWp4R0NseWdVRUhMNk5RVlZ3WGJjOFg1K2hMdjJ2c0hBZ0FqNU1aRzVjTTFBdVNRalFMYnV0STlFdHNrSjRtSmozbi9Xam5UcXdJQUlaZmlSUVFBRURZMk1wSXhRd1BUTkRFVkQvZnJQaWwvenVaZzc4ckxNa21jZUE0ZmdPS1h3amFTMi82K1M5OXAwQW9GWkYxcFlSVDVGbGJDa3JxMTczK3pUZk4wQUR3RERWeUk4cmh1QUtDeDhaRy9kQVRmaFBWRGR1QzdUeFdlRTd2b2haaUdpbG1yMTQra3dyKzQ0dGJVcXdUVzJkVit5OHZqajEyaDhNNExoWFRJd1AxL09iMTVsWlVsODFkbk44ekNqQVFKU2ZBNVhTUFFyQ2wwSzB2Z3dnQU1BazcvYmdIQUJiZzBrMFphQVh1UllnSys4eWp6SzcrcEx6ZmJuL3gxWWxHTlFXeDAzVy9lUTNCdG5VSEtDVmJseThFMXAyVUFnSXRyQkFBWFZRQUFFaVBWbE0rWnMyc0VERlZoajV4V0FRQ2cwTnlCd1lmNXFnQkFFcW5vSXVFN215a25XWURybXJKblQ1VDllZ1J4MUJ4WS9selBvWThJbkErcmNBNmxldU9YUGlYcFF5K1Uza2w1N3lIRGE4ZHBsVnkwUjF2WGMzQWw4N2sraFhuQ1VDQ25kRjAzQUVEUEpZWXFEc25scmNrcXNWNDFvTTdkK1VRcDNYYUZtZ0RZSUlpNUtLTHNyTGJiWE9IMW5pdFVDZjBBMHVCcWxlZHd1TUZxWDIxeEhTNFVVTUlOczNDK013RlBuZFYyTnhNNDExWW4wTUV5QWNCRkZRSEF4VlVBZ0d3WkkxYkE0bTlpSitCVHIvZy84R3pJMzBOK2F3K3dvMlh4MWlEWFZPSmFZaTFpcVdFRUJRZmdKWWdCQURIZllRR0FhczlaNkhvR0FLeDhCTzNpYnc2VmVhakdIa25USmplcktHRVJtaXZLRUFYSXdycmN1YllBUUNpdEtPazdoWXpWRGNBVlFRRHUyWnl4WDJXdjdyamlDbjFjMFpHTGlWVHJISDdrcmY0LzVNZHY4K00vVXQ2NzMrQlM4TG5ndVdkRmNrQWduc3VJNTJDZU5vZ01qQVREY2dCQTBqcUhBQURXaWtjZ0xtc2YraVo1SnZKRXBwVWM5UmNlb0gwSjM0UTFBVGhOYnd2a1pOYlpyYW5SL1k5NzRuM2xPUllQQU5lWkZicFc0NEpsMmJJQ1NzVExkZGNiakFPQisxaHBwekhuK2xCNWg3UUFvSnh6WndHQTRMM1NBb0FwT0pCYlpRNHV6dENXY084TnA3ZHp0Q2JnVXZGZnRwSDlwZCtJci94R1F4QWdCVUdrVHZnbXVmdGw3SUlGS2U4aUJWRFE4c1ZLYW1tL280dmNZT3RYTkdlaDY5Y3BSdGh0ZUUzNHZUYUpVVjZ0UGJLcU1IaEQ5MGJFTFNHTUdXV0lBc1FEWE9sY3J5bnVScTJtK0Zya2QyS3BVQVlCdUdlM2pEMHIzZzRod1MyNTRncDlHVWlabFNJOVdNbXhXdWZ3c3AzenIvUGpGL254ejJYY2U0RFNLamVWK2VPNXgwNkE2NjY0Y1ZGb25sWmRjVWRBemxLS0JRRFdubG8xMGk0dEFDQmtQQUhpQWdKV1lPMzVlNnh2bWxiSXVrS0crNU1QbFhKK2VyUEJud3FkRmJhMEgzaCt3VmNlRUw0YkNEZkU3STFwMkwraHVWNUw0Q1RJUGgyZ2tLSDJiZHpUSXZaYzgzNk9BUURWT25lcDdwVUdBT0NCWEhUSkpXMnRnU1dCQldHSDdyMm9rQ3F3d1lTa21IenNOOW1sMFBrM0wzU2VLQ0JBQklXNGkrZGRvV0hNaWlzdE5id0NaSnRGWUtsUEthaTZuTy9BY3BBenh0eFdZODZTcmtkV2RhZmlOZEhlYTVGU3NxcTFSOUJWTFM3TDBMMFhDS2xMR0lPSGVEZlFzcXAwcnZuWjdhNjB0T2kwOFN6dE94KzdRdGN3QkFFanJ0RGdadDcvZnNVTFFkNnZ5N0JYcDhGMTJnL0t2NEh5OUwrN2duUDRML254OC96NGIyWGNHK3Y1enhuN1NWdDNuS05GbUNjKzI2c3dUMWhORkl0Y1NaMlMzM2xsK1Rta3pra2hHYlNXcDFLc016TFNiL2g3LzhrL1M2ckVkY0YrbFFKR0N3Rlp4ZDhrTWtvVW1LVHJTc2puUGI5ZVg1TjduaHNFVGFjNEsyeHBmdzdBQnNNTmtvZmZsV0p2REViTzlUU1JYRFZPUXV5M1lkZ2s5bHp6Zm40WDVybVM3NDg1ZDZudWxRWUF5SUVjOXhNelZlYkFrc0NpT0VQM252Ui9qMmtWRFlReXYvUW84dy9lOHYrZlh1amNKeEFnQXJYZkZTcURTWDlyc1JLNXpMRDgvVFM4eXlqa1FtT0h2SEsrQS90RGp4bHpXNDA1UzdwK2pOeWU3Ukh2TlFYS3BlOEs5Z2ltZUNXOVB3bzZLWXJEbzRlRTZrU1Y1aHFmM2FLNDhVY1QxaFcvODU0Q0FycEF3ZkdlbmFYOU9ndTU3MUlJWjhBVlYraVRlaG5jMHZrcXp1RS81Y2YvWGNhOU80QU1PVzdzRTU3N1hwZ2plYzYwTVU5ejRCWENlZW9oNWYvVWh6SGU5OWJ5dDRxMUhMdW5jSjNyRkpiOCsvNVp0UVFDY08zbG03VHZtYVZ2RWhuRnlsL3FwR0NQQTZ3SjhKTFM1RVpUeUNWdWdpTUZhbjdqOXdkbUhUUkV5aWJjRzBsemJaMUg1aVNVODIyeDU1cmYrUS8rWEZUais1UE9YYXA3cFFFQWtxT2NjYVZsYk5NTUZrYjFFZmZPRUNwLzRZb3JUQWw2dmtTWi8rNnRqdi9pMFJHQ2dFYi96QTRBQWdOZ01ZNDZ2Y3l3dUxleG9saXZLNVExRm11cW5POUE3MFRHUCtNcTVpeDB2WHdYVnZhTGVhOGhZTDUzVm5HUERDcldhdEw3OTRPZ2EvRy80OUZDUXJVYWM4M1BibFFzZU90WjJuZmVJaERRQUh1MkIvYnNzTEZuUjhuYjBlZnYzK2FLSy9TSjhyL3BMWWhQcitvY1Jzb1B2cmVRSVh2aGpDYk5mVHZNa2V6WjRZU3pqV3N1ODRSbHloOTRiNFptTFQ5VEZIWHNPajhEaTFRc3VQZjhzeDdSMm5mQ2Q4azNhZC9EYTQ4eWlwWC9MUTgyL3VqWDN1cFkxNTN5ckVqcFgxWk12M0xGNVhBZmd4V2NabS9FempXZXgxb0NKWitXK1cyeDU1cmYrUjN3SUZYNi9Vbm5MdFc5MGdBQTZXUGNIckN3eWhuZDREYTk2emQvclg5ZWsxL3dUbmhtbnl1VUFPNERWTmlqakM1dzNkVEIrNGV1MTU3VEM4L3BjSVVtTmxJRC83NWZqSWYrWUwvMFFxU2E3OTRFMXFCMmZUZThXd05ZRVFoNFFyK3BoL251Z0hjV1lUcEFBNEZRa29MQjk1RDNsNXJ0YWU3TmxSNy8xUXVXUDdoQ3ZXMHBibExqMTZLZTVpQnBEMkp6bzV0VjJ2TnlmK3lnK0FyV3N4cm5xSWNzZkR4TDliVDNld0ZJREpMUUU5RFFROG9ERmVKdFB4NEV3SFdmc25kd1hYbS80bG02N2RmeHB2RWRiZlFkL0l5TU11OE5pZ0w4Sm1FTmVoUUZhdTNqQVFJcUVoS0xPU08vOXE1L1RSbkg3T0h1d04venZudmduL0YxQXRqc1ZyNXRnTDZwazJRVTdvOXZ3ZjMvZXdBeWZUUlB3d0RTRUtpaFI2YU56clRvb2c0d1VORHpNd0hXNzZRckxsMDlIQUJrS0s5ajVPdUgzblB6amJKWFdRZG9BRzRjM25mQ0ZWZkx4ZjQ1dUk1Y1l2dDdWOXBoc00vL2x1ZFU4MXhMOGE2bi9wNzNMQUJnM2J6U01RaUk1SkZoOVdRTUt4MHRjNjBCMFFBaEozeC9xMkZSMG5NUVhXSWpuSWNrcERySWVxNzAzVHZBR3RLdUgxSTJOYnNRUTc5cFNiRlIrVUFoV201VlhNeU0ydm0rb1VPQTFobGJNci8wcVBkOUVtckNOSDRKM3hYaUJ1QWVmRVZ1ekdyc2VXeUVKY0lTT1NuRFZUaEhRM1N3OFN5MUt0OHhSb0p5aXRaMWlMeENMT1NsbDdvSW5uYXlpdVFadkxaanJyaC9RSmR5bHU3N2RieHJXTU45TUc5anh2N0JlZTh5ck9DYkNXdUFMblRaMTlZK25pQ1h0UHozV01RWmVkZnY0UThOZDN4endoNGVEUHc5Nzd2SHdQd1BoWnNHbFcvRE5kUmtGTzRQOFd4SUNLQVRzanR3bnFZaFRJT2htbWtpNEQwZzVTLzdZTWkvenhSd1B4WWcvbTAxcjlKQ010MmdhNUxrYXowb2Z3RlNTZnBMemh5R2NPYnBIYlVtVzRQT2JySjFSd2tuREFQSERVUGJ5RjNyaDdUalYrRGhlR3dCZ05ETnl4M1RFSlBvQ2NTK3hvalpqVEc4YVpoVUhGTks3S1FQM3Q5cVdaejBIRVNtN1NDNGFnR3A4K2JFV0dTNTc0NnhuU25sTjVPdXVDb2Y1NU5QSnZ5bVU1bnZhVGhVdUZINVFJMFRzbVNTR2NmdGNDN21BNGVBNDdQczFoTVg1c2MraHYwOXNJelJ2ZFlmeUE3Z1BjaDV6TlhZOHhORUptcWdsS0xwS3B3bEpxWFdLbVF5M1B0ek1PZENFRnBRU0s2RGlwQi83T2VuanNEcElCRnNOUUUzRjNHV1pPNGZCcjVqWEJINjFqTzBPTGlBMDlBYVRMblNIdXk4ai9uNVNFYWJKMlZtblpHUFBJRDlNa0RJNnpQMjhEVEVlMlAyM1RQd2tqMU1JSnhhYXppcnlDamVIM2NoM3Y2aEt4UVhtZ1FTcTFSbFhBYWk1aXBrcjJBeG5TZmd4ZTBrV1M2RXR4WEkvdGdBNXJ0a2I2MGtrRElISU9zaVNWWTJCYndvR25kakNraWNTL0NkNi9TTytKN3p0STVhbSswYUFrVllSWFNaQ0xDcnJyaXVnWGcyaXJ4Y0ZnQUkzYnpjSVExb2hIM09CeDNiZDJwTWZWeFEzRXpMY0crc2ZqVUlyR0x0K2ptRlpidEt6NWwyeFkxdzJnRkJ0U2hJdDFydm5nRjJKMSsvYkd4cTduRnQvV2FZQkF5eWpVTWJkUlhtYllvQUNLWWJhY3pkRmJodjByMDVsVWtPd0x0Z05YMEhZUml0ejdjSW5xUTlpS1Z4SDFSaHp5OVRPcEVJRDhsL25pR21lcm1EMDFKZlFwb3BwcFBOZ1FEQ1ZMbE5FcFNMSUh3NExlNDU4RmM2Q0p6T3dON1I5czBxN0QzckxJbUNmZ2JFcTVqdjJLQzlNMDlLdkpzVWIwM0NHaXk2NGhyM3JRbjdlSU5TcnBMT2lMaGd2L0JLK1h2dlBoZVM0UXNsSlcvZTJML3prZnZ1dWZkODNJZE1odFpBeXFtMWhxRzBTVzRDOUlrcnpmZkg2cFhicnJob0Z6YnprWG9jejRHWGhNcGZ6dVdHSzdUK3ZxenRJRFVMTHYrNTc0cXJabHBwbVZneE5pUXJaUytFdkNnWlJRZG9hWnhTL2ZSQWVjODFXTWRKSWlXMlFGaUhQU0xZTUFsVFlMa093REI0K2dRZ04xZ0FvRHR3ODNJSEYvSUk1Yjl1VU43ekxrM1VKbXdteVlYbEZwWFk1WXF2MzRRRnd1ZnMwSE9rRWM0NHNlYWJTUG1qd3RtZ1JjZDNYNDk4ZDI0UXNrMUQ2OGpGT2JQYWIyYUJOWXNDUnR1b2g4cUIyblRGZFJFWUpkY1p1YnZiZEFCQzk3YUttWHdBYnJqYjRDWkVvWWFGTzFaY2FZVkFyWkFQZGpLcmRNOXJkY21iWFdueG1Fck9rVmFZNmhXbGNzbFpXb1h2MkNkQmlZV3VwRy9IckxMWDYxMXhrUzFNdjhPYUVidXV0TXh6ekZrU1M3Vk84V1JaMzJFOUEzUGhXZkUrU1ZpRFZWZGFGSXIzc1hZK2NDOXJaMlNFVXRSdStQMTd6Kys1UitEK2IzVjZVUjdldi96MzFyNTc0WXBMOG1xcGJWeDBhbC81SnEwektEYVdlZ3lwZ0ovNTc4VTYvbExRU0lvYVNXRWpic2drYzE4UEdWT1lIaW8xSXVSK1VnWlpxbnZLdjB2aHAxQmhKdXkvRUpLVnNoZnVCTHdvbzJSNGlWNlJ1Y3pCNERuSXVVSnBlaXprTlVsN1J3aUI3WXAzRzR2S3lUMFJBS0MzZVJTOVhERUFnRzllenRDcXFMVTd2UUtXVEJ3L1R5WnExeFhLSHNxRWNuVTdCQURMZEgwT1FFRFNjOVpkY1RlOERKQmgyTnBjZGNYVnU0NHFlSGNHQVB2d0cyejRnVmFnVnM5YmZzTUNqdGQyM3hXWEYrVURKYVZJRDF4cFdXQjJPN0t5MjRmTmZwcHc3NTNBdlQveEZzWk55UGJRbElaWWVESUhvVDNJZGNNcjJmUFdXalliYzFMdVdiSktVNlBiRmMvU1FXQmQ1YjI1OHlQblZUY3JPY3hpaWUyNlFzbmlFM3JPa1N0dVpxU2RKUUdPalFreUFiOERuNFBQd0ZLNHJIaWZCOWJBcWdvWnU0L1BBbWNFK3hlMGVFVlM0L2Z2Yy8vdEwxMmhXbDQvV005WWxoZjczcS9BM3g4bUFJQzdycmdGTU1zS0xqdDlTbXVZby8yQnJ2cDJBSEQzWGFISWtRWUFVUDVpVFgxdDdybG1DcmN1UDNLRk1yNW9TS0RDUFk0RUFPc2tLNjI5VUVPWklKb1hSYXZnZU9pS0N6ZmgySU45TFd1OFJTQ0E1V3VYNGQzR3N2SUlBSEFzMHZxMVhTVUFrR1lTVmgzMVVBMXNhZHB4VEtqcDJCVWFlWVRxMjFzQUFCc2xITGpTMHFwUzV4bHJSR1BEa0dGZytRNG9Gb0xjODZ6Q2QwY3JtbnRTWTlNUFJLbGFSeSt0anZlSXNiWm5ycmk4S0I4b3JkbU01bmEwbEYzV09LeHltTEh2QUZ0akhUNW1lZ1BJWXVpV1pxWEI3WEhQS3dBQUZ5QU1ReU10QURoTk1TN241ODhCQU5CaDdJRkQyTnM4OTFsWDZJeDNCSHRkcTZ5R2lobEw5c3BleGw0RXVMYkg4UCtzczlRR1JLcWt1dmo0SGJoL1pPL3NHSXBYUEJscCswS2szY2ZuY0VhMFNwUHRTdllRcHJGaTZKWHI1Y3M3NHQ5emx6N2UxM1d1dEpKaHZ5dHV3SVFOd0k1cERlV2JzQVh1UEozNVYzQit1UERPck9HTlBJUzUwdVplQXlvNEY3TGV1K0JabGRERkpua2NZd0ZBMGw1QWttYVg0VVZCL1hVSTNobnM1TGxNSWVKTkFHRFl5Wk9yRXdvdnBTZmczV1lBd0dPTjUrS3FRZ0N5VUg5MnhaMlRjSk5pWEpTN1lKMEJHc091WHJ0dzJFNHFBQUI3aXJMYkJjR0kzY2pRSlRRR2FVZFdML2d6c0txMnlRVWUrKzU5VHEvTmZlNzBibmRZeGhNUGl0VVhYbE4waDY2NHBlbzZoQ3k0M2V5K1luV0loYU1wdXowSWQyQXI0QzI0OTdraDBLU2w2WGVRSGxScnVLVlJhUWlvT2E4Q0FKRDFUQnBwQUVDYWNRaUNXQU1BWFFsN1lGOFJsQUtDY2M5cS9kNWI2Zjd6cnJUVmRoWmN4YmkyZXdEd3N1U0pZdUNJSUlabHdnbFpTTGczOXdBRWFJb1h2UUNWQW9EZHdEN2VBNURPWnhTL05TblZqK1h1SVhqeFZseHhKNzFqSTRhT3FXUTFmbjgzQWNEQWZiSVBGdjhCekMrMlo5WTY5YkduUVNyVmZaUEFSOXFJQUFBaG9NS05lSmFJWE13RVFjMllLTWNEOE53d09OaUxnaTNuMTF4eCsyYmhXS3dwQThFRGVubW5pZXZWRS9CdVN4dnBFL0s0bU9HUWFwTUF0ZDdKV1NOdXpmV1pzVE1VV2d3clJNRFpBalJlRGdCQWw3d0lyVFZZbkIxRklXMlFaY1J4N2gxWDNJbHBGK0txeThRM2lIbjNia09nbndTc2Vvd0ZIYnJTbnVjb0VGblI3UklSQlJuNlM2NjBjMWRPdWEvVTBrZjMzNnBDTnVON0kzZzZwMi9ET2JrRjZXajFyclQ3NDZ5aU5ISXV1WnRmTEFEWU1nNHVsK2JsaGlsTmlqQmJUekd3bmZXQnN1Njloc2Z1a09aekJlWitFYnhXU2VDQ2U3bmovVS9KT2x3RVFiemk5SjdyR25Cc0RZQ1lJMWZhRlZDK1k1bWV3WUNYUFJscEFRQ3YyWm9yTHIwOHI3ekhLU2xNM204eHFYNHpyclRCeTViaTdzMHBuQkJPQ2VTV3ZCckFPRmU4RE5pQzl5TEJ3eVVBUUZwRVd4bEpDNUVBb0p2Q1dldktQc0tReEFTa01ISzJ5SnppU3E4dmd3T2c4UkxZNEJEWnZ3SHliazNoajdEaHNPMksyN0huRkxDY2dWUkRUYmVKQi92UDRNMDVKaU1nR2dDa1RRUFVoQzhxUXkydXF3a3NjUVhqQXM5QzJrNmFqV2tCQUhTemlOQ1NkTDFGUlNGbFhXa3J6RUVsUm84dFFUY2gzamtOVFB2WWQ3ZGN1Z2d5c0hPVzFzcnpKTUFYWUJMZ0dxV2lUTUtCbWpGQWxDVTBrUnN4cDZRVDRXSEZFRWNTS0JJR2JwMUN3cHlHdFdEdlI3YUtBR0RKbFpaazVmS3NreFFqYlZUSWMvTVJZMFVCY3pzUUg1d0E1V1oxR1R0VkFPdzRoVXIyWFhMcmF5MHVuVk1BMnpTdDdZcmhtdFFheTFnZzR3ekFDWDc3aEFMQXp3T2VqTFl5QUFDdjJSeWNEOXpIYU1TY0pPeTNwRlMvR2ZvdWNjdHovRDlIYzIrbEJKWURBT1pJNW9TQXVSUWVldTdkNURWT3Iwa3lrUUlBTUJGU3MvNUZPWEk5QnFsdE1RNy9qV2wxUXFaTG13V2c4UkpXUU9jZEFmaGNjcVd0NkpFVHBvVU9sOG5RMGd4UDdhd2pHVFJMK29GSE5BQklVd2hJaTlHOHBvOVlVcGpkSTRweXVRQkJoT2huV05rUWxYSUFzRzNxT0N3cUNwVFhCc3JtQmNqQ0lVS1huTHo3YU1wM2J6V0lmUWNndEhDRGFOZFlLTEpUU1FQa1hPcEJ5TUhXRkdKSWFJcGlIcVpES0FWbkJseHhON2NWRUhRaFFZTU1YQVlhM0VzZVFWNjFBWUNrbW1sRHZsR0VqYkNrTzF4eHJZanh3SmdLZ0prTklya0p5TEFBQU00bnRyL0ZaMkJmZENFT01RRElLSEhwRXdWZ0NDZ1pOcDZodWNZenNHY3NrSkZWUEI5V3IvZ2pnOVhmVVFZQTBOWU1Td29QRzFicUtTbHQzRzlKcVg0cjRISFloL2RiQjdET1NpS1VFaGdUQWpoVkRBYU91V3ZyTElXZFdyeDcvQ1VRNVRERU1aQVNBR2h0ZzQrVXZURHY5SG9NQXNTdHdqcFBYZm82QUpaTTVyVllkc1Z0MWRFRnYwY2NIQTZ0ckNoZUgyNFBiTzJkTFFOb2N4cnBESEpTS2lrRnpHNlFIUkE2SEkvalZvc3RBQUJRQVZnS3Q5ZFE2SlVBQUxRUU1na2hneDNGelRaRGFOeDY5NzR5M3IxSklRU2hwY3lXRG5zSnJEQ0JXRUxvZnNSeW5GaU8wa0xoRndrZUFDeU9sS0ZuakpHaVd5Q0JkbXJ3UmJxSWdkdGpwUHdkRXBud0tnQUFONHVTQWpjaXVIcGNhUUVQckJZcDVXeDVEQ3JuS1dmRXRqSE5yVGxBMmowbjhMQU1Ib1pWQWt5V3Q2aUZQRWFhMG1DRlBxQW9XMDB4VG9JaUNZRU03VGRhai9mVEJHTGN1R0t0aHdDQXRtWjlzUDgwVDhkNUF0QnBWZVRabG1HeEhSclczRDQ4SXlrVkZTczRkZ1FJeHVkd2J0WkJubHY4alF6dCtRN3dCbUI1OTg0eUFJQzFGMUJoWXB5ZjZ6RkltSWpUVHJGMlFkcEtnQjJLOWI4Ti9LbHRDQUd1d2Z4bGxWRHpGcEQrOFB3Z1lMYjBvT1k5V2dwa0FXaUZwTVNiMEdJQmdHZVFtdFBzaXB1c2NOeDFoUWg4VE5KWVVHSXdqWlFtb3JtQUdmbGNGUUFZVnBpVlc2VHNHQUJvMWlzeTlDdDlkeUc0OVpHbnhQSTJzQVZpRVFWRllXQXA0RDQ0eU4wQStnWU1uc05ySWlYTkVBZWdYZ2toWVRlemVTTU9mWllRKzlJWXVEUEFoTjJIdVA4dWtMT3FDUURReXNMV3N0Z2xVYXc4TE9HSnZTNUVzY2pnRkVZbXhPSlptbGZZN1pnYXBGbWo1MFJNV3FXc2xaTUlncDRtd004Q0FFQkxBOU5DYXJqbkIra1pCd2tnZ3hXWjVuNW53cHIyVGlFQW9LMFpubzBaaFlkd21wQUYwRVlFYURRaU9HNTdZc1J6ajQyLzE3eG5YTUZ4Q0ZMWE9OUnlBcFpxRnZZZmU1ODByMWNmNUt1SHZBNHhBTUFDZDZld0Y3YUFXSTBEYTF0dzdRbnU0Sm1tRndDZnNRMENZdXV1dUViRG9aTDl3cUVWTnFRNDQwUUx5VEYvWkNvQkFFeTc0bkxYV0kyejBRSUEwdmlqRnZKVXVkU3FGbmQ5VFJZSFdwOWMwRUE3akc4U0FGaVRxUzBFdjdzVnZ5NzMzZXZJVlpqa1ptUndrQTNFV2h0ZGNUT2dOaEJNYllDTVJ3TlpEb2NLTDBMY3hhOFVTMk9GaUpicmtGbHlrSkJ2alAyNU5RYnVPbGd4SEhhS0JRQjFIdlFtWlFGZ29TaGhHQzlCTEpKQmdCUkplZXIzZkwyZmZ4bGFCVWNrdjJsaHRCRVF0cEtDcGJHbVVjR2ZReXg1aHpJQXNrb09QYWZvRFFUU0dEWFg4RURDK1k0NWYwbEtvajlDaGl6Uk05SUNBRnd6Qkorb1FKbXNtS1dVSzY0RDBHNjh1NWI5SWFFcy9udE9oOFRCZS93VmhNeVEwN0FJSk4wOThDd2VBZmpJRXFIWmFrdk1aWWlyRFFBT3diTzg3NHJyRm1BS042WXljeDBYemdocFVJeGI3Q1RhNUlxYlN2VWFSaUxxcTNuYUQ4elJZRzRIRzFJeEFLQWVVbVpqQWNDd0syNXk5N2QrSEJZQXdFcFZtSExWNjRwclBLOVJyRTVEdjVqSGlDVU5OU3ZhVXREOTErZ0IwTnpkTVFBZ3piMlQzcjNXRlZkM0c2TzV5cEV3eGZkSWN1ZksvRDkzaFFJazJBNllLMXV0VWFvZW9sck51L0RLT1BSN0ZBT1RxblJIcnJqdzByS3liNXBwLzJrTVhONTdNUUNBTzZpRjZnQmdVYWVzSzY2U3RxS0FBSFEzM3ZlZWdDZVFBOTVpZUZxMnlmVzZiWndsZWVjbnJyUVFFTTdOUHV6UFV4QmFKNjY0U0E5WDBVUENWRVp4bng4SFNJRGpaQ0NJTWlzWGdNY0FnTjJJYzZnQmdHTWkxQ0pZZmhpUi9vVlpHaHFZWXNEV3BxUkFjK2FIWmwydU96My9uOGNLZWM5YUZSTHFNcmo1RCtEOUwrQ003eXVXOUpLUitjTGV1a29CQUpPcytmb3N4ZFYzd0J0dzRrcnJ1SEJOL0JhWHZqT2t4a3ZJRWVoQzhNcFpGZWl0UElEOWdzWXVlaFp5QmdCNGtSRDJ1d2pzLzFaWDZKYjVZeDhPQ3dCZ2x6Vk91Um9uSytNUVhQL1pnTHV5elJYWDVRN0YwWGZJZXNVK0FWY0JBUG9NVXFJVjF4OU53VjhZS0lQQXlKVzdrUEMwcVpDcU5pUGM2RmkwNDc0cnRIWkY1VC9vU2l0YmJTdlAyOUFJSmY2d2hBNDlWbkREKzBsbFJpa0ZQS053UnJxTi9YZWdDTi81Q0FDZ2RWRFREaFNXTUQwQ0FYTUtBbUNUUUFDNkd5K1Y5R1gxd2p1S1F1bDNkajBKTGFWdHlKVTJlNmx4ZXBuZVpXSWhTMXJ1T1FqNVBhZVgwY1ZhK3ZXS3k1cFoyYnRHUnMwYVhWc3BBRWQzZWw4RWp5Z05BTkN5SDdCRUw2ZC9ZWnhYVS81SWVrYkF4Z1dQT0N0a2lWeklPeERUWm1Dd3BtU1BzRVd1VmRUaklrNUhycmlZRVlkd1p3aG9JWmpYdkdxVkFnQ0x6M0lHQUJ6ajZxc1FGdURhRmxhNmN0ck9rQllJNXN5SkhYaEgxQVVMNUsxa0FpQ0haQ3hQZUNVQW9BVzhuWmZGMU81YkFJQzdyQ0ZMbDRXVkhEcE1nN0RRN3d0WDZNd1ZZdEtqNEp1bE5Mb05WMXgwbzFJQUlFU3VjY1dhT0RmYytpTWtESmt3aU1wM0hCVHFhaVFBd05yZFhRb1prQXQwN0VTUy80UUIrOWhRL2hMWDVNcFdJaVJFMldsMXdWc1NpRC9jQnlCTFZ2V0JLeTRaTzAxdU8yMy95VHdjVWF4dEpnRUFXQjNVckI0TVVzd0pMUTJzVm9uek1xT0VYTFNHTEtoUTJOTnlwckQzUjVVdzJpTVBMS3d5dlh0a25lSjduN25paW1XYTRoSmdwT1ZsNHg3VWlFNGJSR1E3U3hCT2FVaTR2VUJTdlVvQWdCMzZPQzJYU2FjN0NVQktBSnZWS25kS2tTbW9CSEEvczZHQmFYQmpGSk8zS3VwaHlHS1hsT2Vwc3YrMDBNbmhOUU9BMXdRNE1TMTNnVHhvV20wRDlGS1UweGx5UE9DbVozSXBsbWhHNzk0aGVPQ1EyOEpjcXdQaXNZaWN2UllQQUhaWmEwdEl1VHFIV0JVcWh6RUYvVXIvNzl0R0xqMGpOM0ZwSWNMYmQ1VlhBdHdtaTBWeTlka0tZMGJ4SktVNWFmRktqTm5PQWFwZmM2VjFFcXgzZndDczkzYkZaY2dXV0N6NVQ1UUdOclJnNWI5RUxPQlRBSGRzNldxZHdWNDV2VG1SVnE1ekZ6d0RLSXpXeU9wbEJiUkd4Q2t0SFdyRkFBQ2hEbW9aRis3Q3VPTDB5bTlIeXJ4aklTRHMrQmJLSjhhODkxMWlzbk5aMjZmK0xOMTBkcGxlckpBbnNYOGtlTDBPdUs0UkdMRUN4THJzV0pxVlU1MXl3SjhJN2ZrZXd5RFEwb0k1Vjd3Y0FJQngyQkFBUUJBZXFyUzRxNFJSdUtXMWREMjBXdVV1Z1p6WWRjWDUvMHZPenYvSE1VK3U3bFpubHdsbmorMXFJSk5oVVFFQXA0RnNpMnFGQVBoNksrUTBGdUJKN1JzZ0pXMW5TTTJneVJFQVFINE1naU04TDFrbFJEQUgxeHdrZUhITEJRQ3BPQUJQaVd3d1FJUXV0QXkxYW44YVU3bldLN1hIZm9Oa2xBT1pCZmZxSVJHdjBQTGFyeUFFZ0FKUmlGd28zRG5lamZGQjNLQmFsVDRzZnJRQnBMZE5zb2FTaXQ2SUI2YU9DQi9NUUVXV2NBejVUOXJlY2tNTFZ2Njc1QjdFTkRLT2RhTkYrcGd5R0xBZ0VKZnJYQ1pRaEJYVXRzbWE3bk42blh0Y1Myc2dBRWpxM0lldGJyWDhZR3lkSENKR1RwSGI3VDRBT2liK2FUblhUQjVpQXROekQ5SXZTeU4vRzhqWU9DT2VDRmFrUElCOXFQVmg0TlExcXpQYnZpdHROblJDM2dWbTZGc05zTkxVbk9nckl4dEhBd3doQUNEbnJ5Y0Erck8wWHkzbC85anpxalJQQWcvTS84ZS94NXh6N1hlYXEzdkFTS2xqcmhEdlF5MmtxNUVudFZyN1YwRUNQQXNvOUZEV2llV2xTTnNaVWdNQVIwcUk1b0RlazczVzJCaHBCL2hLNkpuQlluSkZ6WHRTQWdCT1hZL09BcWh6ZXV0SXRwQXZGUGZyRkJHaG12d1E1cVhFSURRaGlDN1FNeVVsQnB2UmxBc0FqbDF4Y1FiczByVG5paHZqY1BxTElLbitnRUk2YzZXRkh3NG83U1BwM1c4REFmT1Zrb1BLYVhsL2lTVC9QZkhnSXNSb3hqVmc1VDhiWUxzLzllQ2lqbEpWaGwxeC92OEV1RHNYbEc5aFpEeE9ZQkVQK0d1WDNKUkt1eTVVZ2JFWFlvTTRoUHN4b2NUN1F2VXJXaFhyM3lMK1lTR2JOVmRhOFEvWDhWS1pYSFpmKzFMaGlCeTQwaks5QzhUKzVwTGF2SC9RN1dqMVpsOEJWNy9XNW5rcndpSVREMVZNRmtCU3F1RnhRcXBoV2dEdzBzamJqNUUvbXZLL1pTamtyTUkzT1ZIK1BrdEVUaHhXSnNPZ29VeVovRGhMS1d5bkNyRVdMZHlqQUhteVdnQWdKdXRrSUFBR1l3RkFUR2ZJVUFoZzFaVVdWam9rNEhZRVlVNlVRZElRYUJlOE8xcXpOZlRpeHRUK1FONk1oRG1pNndCd3RUV05FWTVDWTVPc0ZiRWNlTFJEREFMZG9HeDlZdE9jRTRvVGIxZUJCTGdMaCt6SUZUZFRPQ01VaHNWWEJpQi9Ybk5KWjRGTnkyMUxqNEZabS9UdTMzdUJnV1RBVUtuVTE1SGtQMm5Za2NSb1BxTzBQRlQrUTBBdTZvRFVQd0VCV2dFcEtlNGhWUUNISU5PQUJmNnBrZmV0Q2Z2WXJwU3hBS0FKMk1HY0c5d0xnQ1kyWFZRVXlkT0E5WitVWWptaVpCWFV1RUxqbFU4TlRvcVdVaXR6UGs4V1BPZm9zK1dNb0k1QndCS0VlRFpnckxuU0d2bGFwVXl4R21OeXZ6RzhrbkhKeFdLNDJKQUdBRUxBRGMrZVJsb09nWTFtOElxSjh2L0c2YVY0V1ptZlFQZ0VoL0JkTkFDd1kzZ0FMR0RGM3oxaFpIWWh4d1hKeHFIbVVaVUNnSXdycmZIQUNoMXJQUFFiNFoyekZBQWdxU3FrbFhXQ1lSQzA0azhBRUVzNFo4dVZOdWtTQS9FSWxMOVZQNmNCNXJYTENKV2NFWmhmQVE5M2RDWEFWbUNxamlza2hqTnkxNkxTR1FSQno2UFBGYW9ydFJyeFoyNmVJSjM2dHNGbHp6V3F0YUlmU1J3QWRzbGpreUFyM2kzWkRFeUt4STVRQnduM2pBRUEzM3IzN2lOQWZGMEtNbVl5b0phYjMwWXg0KzhUR00waHkzK0kxalBqQ2xYQUpKOWVLeUU5Qk92ZjQ4TGxRWk1Bd0twTDE1a3lseUlFSUtRcEJDdjlrQnFVdGw2RUNNVG5BZXNmMHpvdERrZTNLNjRyY09uRnVXeU5mTmw3L1VPWHJxenlpQ3V0bzMrVUVEdVhjS0NzclhoSXhpRTBJdUVkR2ZNdVhKOWlobHliU1FxZDEwc3J5bkpxdUtaRjZMTVNQNlNRRXpPbVF3QUFpODhrTmNrUnNQWVpjWi9XRlRlKzVlYm4rRDhQclg1R2F3QUFhTndLaldDTEhKY2Q4bVJhVFpjcUJRQmF5STlUbjdFSTJaQ3pxenhxNEZFREFGbVhYQmJhYXRTMERZb1d3MkxIbEZLSm9XNU5QMnk1NHI0NTRsWEJlaVcxbEdxdHRZN0dMSjhkMEhlcHVnRm1uRjF0amROL1pCTk1CSWF3N1pFWTJPVkthekpMakhWVnlUZGRUSUh3WWtpQW16QTVXT1JsUFJEdmZrWGNpREVBQWFzSjk0eHRCaVI5NzU4b3FVT1RMdHoybDBsb3pjUVkvemFCMFh5aXNQMnROUjFUaUlCYUV5bnB0ekRxQ3FVMlIxeHB2ZmdRQU1EaVV5dVJRd09LSVJJZ1ZrckRiNVIzSGxMUzRYSVJBT0FseEpLSERPdi8zQkJ1L1liMS83VzMvdDlQNFFvZmdibFBVeU9qeVdDdlR3SUppL2NHQTV4VEkwUWxvWTErSTgvNnd1QzJqQmhaUkZvYXNjd2hFeVZsckFmQ1pnZ0F0Tjl1a0F3Y0JQSW5ldDB1MSt0ajhub3VFb2xQcS8rLzVQVDhmeVlBTGlxWk9jMkJFSUFXTXRSU2JFOFVzckhGTlJMNVdDa0E2REU4SldjSytKaUdrT0lTeGVHUEFqRjlCT0ZiTUw4V0FPaW1MQ0Z1M0xNSnNnVjF3TFlyN1E0WTBnK28vRVZYWWc4REpJZUhRdEhuU3JnN0dnQm8xY2wyWFhHL2EyUzdMMFNNZVVvTmJDUDJzaERERmlHZmxTdE9hU3g5QyszSHBBRnF5bVFKVXNXMGVQZExZTkF6Q0pnejdya013Q1lHQUNBSGdOT1FaaUlzSzg3TmYrYmo4NWVNOGE4Q0tWM25SQVpMV2xOTjRHaHRwSEZOcHdIc2FSM2pMQTZBelBPVVMrNU95ZlVjWXRNQUIwRUlMaWp2UEVVNXZYc0c4WXdCQUdkemFKYU4xbnA2U0luOXMvWC9CMWRhbCtKSUNRdk4wOXh6UDRCUUNLRFZZSzlMdTlVWlkxMlJqNUFVb3RLSWRnY1FPdENFUG9iZmpseHlsY3Ewek84NkJiZ3RHT2RiSzZFc0phWnYrWFAza1N1dXR6RUorOHJLLzhjbVh4eEN3UlJDQVdNTXlEV3ZJUU5PelBlZmNxVkZ0czRBTkdpY0w4NVFxUlFBV0gxUU5HTHJNbVRzckR1OWg0Ym1HUmx4cGRVM2p3T2hsRkRtRG5wc1ZwWDl0UmpRRGFoenhOaENReGxKOUErZFhwc0NROUhiaGhjNkZRRGdtTXEyd3REZlVwQndhS3lSa3U1d3BjVVZ0aWwrdUF3SU44VFMxOUIrYkIwQVZoelNGWTg3U1lueWYwWnBkQUlDUm9BOXJ0MHpEWUVJc3dDNGV4aHZXSTI4eFlwRDNNYmY1Y2ZuZ2JRZ3ZGZk1DTGtjRndFSmJ3TEN4UU83YXNTaE5UQWpKWXExd2gwOHBoTUFnRlVJaUsyOGRjZ1NXU0pCZzJmaWhQSjIyUlhNcVpIc3N0TUtZSTFCZlB3VktCTnhKMytTSDMvTWo5OGExakMrMXhaOWg1YUJvUUdRUVNDMDlTbGVvdzN3enVFY3licGlac09Ccyt0VE5DZ2hybEEyd3pJOEI3MVhTSHJVMG1EVE1yOWZHaUdBN1lod0VvY0F4QVBRRG1HbVFZTy9nVUJNY3pjanlCeUNrWEdGaGpIaU1nNmxBWjVDQ0dROVFkNitkc1h0enJWMDRHcDVBTnFWMU5aTlYxcW5ZQmRDSUpKV3JCVm0wc0pwbzRyWElBVGlRd29YNC93N0lPL1dJSTFkYW1Pd081NTFEamNpYW9BVTBydE9MeWFHbFZzMUwvUTJ5SUM1R0FDZ01SNHZKLzdQUkc1SU16UTN2ZGFhOHNBVnFzTnQwd0x2Z1VBNFZseFlhTEdrNlFiSVZhQUd3UlhWVHNxL3hpdFVBUUhTSUtrUENHN2FQZE1BZ1B1dXRBN0FpRUVBekNrQ2pNbC9yRGcwbDNIYXRiWGMzVnFNL0pEaVVSalh4SFEwemozbUZzbWRRTWl6eG5Ba0FOQktBWE9jZDE5NVo4NmxqNm0rMkV5a0hXN2RmSjVndWRZcnpIK3gvbjlsaElhT1hIR05qaDFGV0hJTmhtMWxIM1c0Y1AxNjdhenVRSm9VZDVQVFFsUjFBYUcvVCttUk84citPVkVJeVJxQk1pM3pPOFFCU0NLVVdnRGdGZXhsaTd5R3ZDYmthUndhWUVOR3B5djB6UkJTYnFnUTBEbWxYR3Y3L0JEQStZVXJMWHcxcTZSOVZ3b0FtcDFlSmhzdDdqT0ZFTW5GamRiSnMyUHRoVjFYMnZSb1VnSHhXTDF6U3JHNmp5aW12MHRwN0ZnSEFKL0RPZ2NiRWFIeXZ3bmtjQWtyWW5PMHFRZ3Y5QlNDN3pRQVFOanRVaTg2emRDRXI4VmlQSFhGTmRjNU5lYU1XSlZjSjEyc3VUU2xnTGtPZEJjdzNCdmhNTlY0Y3Q0OUFBSFNWS0l0b0tEU0FvQWFnemlHN3JBa2x5ZVMvMWh4V0UxVVl0ZjJPQ1VBT0l0WVV5dnpRaFJwZzUrUEZxYzM4TUN5eWJFQWdKc0JXU3p4bk1MR1BuT2xEVk00RFZhczJ4Wm5kNXc4VDBpUFEwVWllZjhTKy85ZGZ2eENDUTl0RUZnK01lYit6QlgzQkxBS0FiVUhjcTFENjNvU0tZeWZFU2VJMnp3ZkFBZzRVcDV6VEo2T09ZTkFtWmI1blFRQUxzb0FBSnBpbkRmaS8vTkcvSjhKYmMyZ3BQNVc1YzJIL1dKS0FXTVRIWnpiWXdqZkhJSU9PRlpJd2dnWVl3QkFLSDJ4MFpYV0Vwa0hyOVUrbkVNdFV3d3JpbUp0aHE3QVh0Z0x5SjVYQVlXN0FPQmtWeUdXSHdjSTRSb0p1UldlVjB2Sy8yc3ZBN0JIVHl1OFU1SVhtc01MeldrQVFMYUNZVmxmR2tNVk45K0pzc0E0Z1dKUmFIWFNOVVdRYytFeWlkSUpxdGx2d3BlUXgvdkFULzROSDlPNzV4ZEhXaWRiQ3FvbjhDNUpwWUE1M3hNSk1UbEFyVW5rUDFFY254bWtzWExXTkJZQVlOT2YwSnJ1dXRMR09taFZQUFBmODlJTFpoNHR6cTRwbjNWeDdZQzFWQy9ybmJOT2I1Z3lSb0s1THVCR3R2SzRNVDBPQ3pqZGhGanl1L254Ni96NEYxZmNueDZGUEFzay9JNGorb1pRS1dBTEFJVE9hdEw4ZEZGbUE2ZEpZaWhnRTU1M2JEeG5pK1NCMXBUSmttbmxBQUJjdXpRQUlPbGNvN2ZFK3Z0WmVzOUdmOS9uSHZBL2NvV0txMVl6SU5rZkJ4RnJ1T09LeTlqaXZHbG42b0hDVnA4Z0pSNHFZTVMxUkVZb2ZSVmQ2WndwcHZVVUdYU2wvV2pZczdBZWtEMzFoc0xGdEZyTVlPTjNRKy9ucGl0dDJvU3lTSFRPRXkrVFVQbC9DZ1R4UjJDQXhucWhCem04a0FRQWNJSXFIV3VLa3NLNHRzUkl0c2h0d3BQSUxQMUpwN2NiSGlaWDRqYU1UVmZhS2xTWWxpLzk3MnY5SWp5RVBON3Z2Qlg5alNzMGVIbmdCWmh3QStwQVNXbVdINytMNW5MU0FJQldvMzRiRGxBTStlOWpyemlTS3BIRmpFMGpWalpJTVRJOEVOeElCQTh0MXZiV01pL3UrM2w1N05jRmgxV3hiU05oRHdxNkZ3V0xhVDZieGtIZUkzWnZrckI1cGlnUnVUL1BwMFkrUWkvT0RjL2grQ0EvM3NtUC84aVBuenU5M1NzTHBOM0FONndBdVU1ckJxUnhBUENzN3BZeFAxZ2ZYd3BJTlVHcTRZZ3JWSkZjaHBTNW5jQTN6Sk04NExiTUlabW16ZjNMeUxWYmQ4WEZrN29pQUVCWElDVndBNWo5NnhHcGZ2V2dNTzU3dVhUVGcvNVhDZnRqTTJKL3JCcUsyenBURXNKc0pMYTZaSGtsbFRCKzVvcWIwR1ZnUDh3Q1lkektGQk9DNUJqc3QzWUlpVDRpTno2VDhGajJQRGNVYmdheVlxWUJDS3dZNzhhRWFDWWh5M2tRblhQYm4vbXZ2UEwvNEdmWDhRYzIvSlN4WU9XTUJhYzNlRUYwdHdqTWNaN0F0UUJMWHc0N3Ryc2RkTVhGU3BhSldEaG51Rm9mK3dWNDRKSFdEOTU5L28wWHZoOTdTL29yRHdodStRUEhDb29QZXVoZFppbHVYQU5FajVnYTlmT1I1RDlSSEtGYTVMRmowWEMxYW9kZDFuUXRzS2JDVWg4M01pOXUrZ054eDMvVFhTREZhSTJUWnBVMEs5NkRDSlR1SytzVTJvZkxKR3hHRldFakhoZ21jczRwNzdhb1dCKzRqbmY4T29vWDU1TDg5Mi81OFQvOHQzZTQ0bExHTEpDc2J4REJOK20vUVN0ajIrSktTd0V2QnRaMU5YSitua042NmxQL3JWeEZjc0lWbDJCZW9lZXNRQXJjQkNsL1RKOTZrQ0RUdERyNmRTbldia1p4R3d1d3hDd0E3cGVocFFUSzkxaC96NWszNk9uNzN1K1RyL3hlcVF2c2o3bkEvdUExWElpVTYrMUdDck9rZTA5UzlzS1VzbTRQRll1N0gxSjBKMTJoUXlFT1REa1dWemVmUitIU1pKU1VWaUhoc2V4NVlsamRYUE1FcTV6T0tWbHNuQkk5UkNUa09qanJvbk8rOEx5dFAxMXlmcTRMQUhRcEUxVHBZQUhUb3NRdUpvR1pQMnNzc01YU2w4TXVSRDJzV0RhdERLdDMrd092YUc1NjlQV050L28vOWZIejkveGlmT3lWNnRmK3dLR0NlZ0FwZk8wSjd6SkY2VHR0cnRBNUR0MmlvUnIxRStRRkNiSEdmK1BzYm1ScHg3Z3loM2pZSitCOXRVT2hIZHBCWUJRaitWSThMOS82K1pZNXg4WkpQRmVURVhzUUQ3aXNFOGJSWm8zRFBPM3ZKM1VDUXNLRzk4RjR4SHh5M1g5Y3gvZTgrLzlmOCtPL0swSitJRklnNFRjSSsxZ3JZeXNFS0h6L3ljQzZzckJMbXArYmZxK2k1U2ZDZFFnVUI2K0hQQWUvZ2VWQkxmQW5RaktObFZDVGNZYkhEZGsyUnQ0TjV0OTg0UUU0ZDRUVVVnS3h2c0prUktvZkE0M1B2SHo2azMrZXRUL0dVeWlzaVJSeW5kT1lKVnRLK3FnTTBSaWdkYnREeXJiRkZSZnBFaGYzR0EwdU90WUZQQzdaYi9mOVBIWFIrekFKajRuZk53RUUxUG8xeEtxbjdIN25keHQxZWxFMGZOWlRXTWV2UWVkY3l1M2ZYNTc1NndJQXJjb0VWVG9HU2NCb3NZdEJWMXgzWFp2RVlicVhzTGp4c044aGREYXNERTd4NHlwclgza0YvNmxIN3U5NzF2VnYvV0w4MFIvb1QveDFYL3BGdTZHazhTVzl5d0NsNzNEM3VGQ04rbUVGQ0wwTXNNWi82WW9ydWxXeXB2TGVPSWZhWVI4eERzV1lLMjVTMFFkcjJrUUg4Q00vMTU5NkFmZTVCd0YzWEhIcmFwbXJUTVFlNU9JNm5UVFBTZnNRVTY4NkE4SUc5MEZ2WU41NVBwUFc4Wi96NDU5SXlMZVJRQnFPRUVpaW5HWC9jQTE3c2N4NWJtUHZuVFEvMy9oMWZLZ0kxeDdZUzd3ZTJqZDBHUExnUm9KTUcxREF3NVBJdFJ0VUFBNDNiQkxQRGFaeGNVb2dwL1JaZjgrcGZsd2Q4Z01QRXQveENxVWErMk13VXE0My91enRuLys5LzhEaDAycWlsenU2S0VYbGlTY3cvY0tuTXYzT0M3YjN2WkQ3MUcvbWI3end1KzJGVVkzL2JhMi9UNk9DeFBvQlllR0JiZ1lrS1RXbisrRzZWdjkrOVY1SVBmVUg5cjQveUJKWEU1VDlrVWZaNy9yRDloc2ZsLzAzLzg5My9HRkVaU1dLL1JXOWN3WUdwaURpSVVkcjRrTVBSSDdwbGVSTFY2aFNLQmtKM1pDVklQTWljOU1McVVPdGlzTDlBUVNLTUUrZituZm56SWZ1d0RNNHM2SUZpRGdpOVBIOVcvMTEzWkh2L1FwWS9QamVTWHU0eTNoR0wreUhOcmdIOWpYZ2QrbFFGR2ZNODh1NTc3M0llL2NZMzRaV0VTcmNKbkJyaHVZZW44SGd1eG5XTGtrR3RBU3U3U2JBOE55Rit6VDB3SHpKKzJDYWJtZmdPZkticFB2ajk2YjV6dWFFNyt3QTBuSG9YZmtkWHBKMUhET1ByeWhicVZKNTNrN1dhOHhjNC9sL2FGalQvUUVRUHBJQUxybjUwdThWR2Z3NHdiaUtNYWlRaUhzWHVHQXZZSjY3akZUbGJwTHRUeURrZkl0U1Jic28xYlBiL3gzS3Z4ZXdmenVjM29kSEc1anA5b0pMQVljczFuSUdXN2t2S2xEOEx3M0ZQd2hvRm9zcWRNSkI3SU5ZMGppNERqTVZBQUZ4dDcwSFFPQjNmb044NUsvVDNOWGlBaHgxaFc1NUdCOWlOeCtXZ2YwRW5sZFBncUJQc2RKaUxTY0VBYmY5ZDlhQWtrWkJxYkZPK1JrbUExVVJBQjJLeGFmZGt5MnVaZ1c4eEhpQTJLb2NKWTlFYjhCU3duZlJYT2N4enkvbnZvOGo3ejFrQ0U4aytOV1N5NTFkck5xZUdTYVBEUUxzTko0dWpPdnlkYkl2MFZ1WTFndldBTlp1eG5nTy9pYk4vZE44WitoYXZHZlN1MnBleTlhVTh5Z2VoNEhBTTJLSDVrRU52VDhYdUtsWDlsOGZ5TU1KSXd3M0E2RXJEQzlaSFJqLzZHWGwxMTY1aGtLR1V3a2hWU3NWOTdIL2xoY1FNdXFoODQwRHc1eXZnSFF1MldZaHo1RGxjVUx2M0VEa1FFUHpGUUtBcFBoNTJxSEZ1UnNxVVB5czdBYUpqVGtIeENiTU9lWjBHR0ZqVGxVQkNIeE9RRUMrNnhQL1RUOFF1eDhKYXpQK1hlYUpJWXB0WUpFZzhpMkVKdjVFeEtraEFCUVlwNTB4NG50akJ2RkZtZ2ZkQk9YZm5CQkgxSjR4UXpIV0RKQXVheE5pdmh4am5sSGkxdFo3eDNCQUp1aTl0ZGoxQ0pDbVpnSjhGQ2JQeFQ1L1dwbTMwSDJmUjk1YkU1N1RSRlREdWRkSVZscThmVG9RTSsrbmN4aVNBUmxhWjc1MmxOSUYwL0JnT3AzZGE4VDZUY3o5aDhFckV2dWRvV3Z4K1Vudk9xMHcxTHRTemlOeURxWXFsT2thaHlyMC9wTktlaW52UCt3aGdnVFdGU0o5YWdSVDdadzhOS3ovT2tVR0k4RmFJNFRXQjd3QTZJbm1SbnJUU2o3K09OMWJQRUJZdkVuamhvUTRKOGhSMGZyd2FMMWNrSmpiaGdBZ3hGb3ZaMmhNOTFjVkt2NStSZkZqUHVhS2tuWW91Y3lTeXJST0xPSktnTUIzQkFRK0ExN0F0N0Q1dEI3ajB2QmpIVkljWjVSME1Ld0YvN1cvLytldXVMM3ZKQndnWkdxdkdDeDJMZldseVJVWG4zbEpYQVptRW11TWNLeEFKV3pob2lwVWlnQVlTV0I5eDc3MzQ4Z3NFSDdHS3FVU1RRYlNlNUJGcjZYUHhUeS9uUHZXUjk1N1VSR2VYREdUYzYwNXpTcTBucHFReE95U0pCbUF2VWI0V2k0WTFKWXlFNmJIbFZZV1hFejRUZWorbkRVVSs1MERDZGZpODVQZWxWTmtlMTF4UysrWWVjU0NVWXNWeW5NdGl5cjAvZ3V1dU1CVXF5dHRNalVKZTNwZHlhbmZNVkpNdFhNaUtYVWg2NThyVDI0b0thRXhYb0FtVjl3Q3ZjL1pmU2VXWEhHaElTMmNZbVdIaExKT01FTkg2OE16ci94OVVkMFNCQUNodlBWeWhsVmVzUkxGUDZxZ1JjbFZsUnJSWEp4RERqa1dBK0Z1VFdtQndDUEt2UlVnOEszL3JsdCt3MGhxVEtpNGlGU2swb3FTTkFDcitBZklWUGlPMHBUbVFYQmp3WXhRL3JSVi9FS2UxMFFzY013bDV0clR1OHBoVmV0UUd3SmdIc0RabG5KUHExc2plcFpxWFhJZENDMjNYTjVaaEl1QUtNbVgzcUZySlE5NlViR3VZK3BRNFBORDkyWExLZW5lV3JFVXJYQVRzdHR4N3JWQ0s3eWVXdDQ4N3VldEJCa2dOUVZXRlhtQmZVTmtyOFRVd2tDaGpkWWQ5aHJSNm1lTUpOeWZhMTZNSm56bkVpZzc2MXArZmlid3JyaXUySFlkVzNySHpDT1hYaTlYbmx0MVZFTHZ2K3BLKzdXMGd5RTA2WW9MUDFsVjlXSUtXR0dScVJqckgwc3hjNXZqR0MrQWVFVXhiR24xbmNEQ1NWWTRKYWxsdEZaM2dtdDBjQitlTlpmUUFWTURBRmk1cnBKS2dGYWxyQnNWS241QnZhajREd1BQMUFCQXRncEE0SmtDQkg3dy8xM2ovOStqQ0FCd0hBRUE1RjVTcStDT0s2MkFKKzB0NWZ2d0VIR1ZyMUQ1UytFZFlLeE1VS1pzTktuSG5sV2VFZXhFRlJBQTh2NVlRUkFQLzU0aUVMbTZYRklsU0trdWQraEt5M1h1ZzRDV0E4ekNTR3F6V3lWMGs1Ni9ZUWc1Njc0b2lKTHV6ZVZTcmRMTm5OKythdndXNXlZWDJLTmFKVVdyNGlWWEZjd2w3QlZXMEFldXRCb21sbEhHanFZQ2xBNXBua0lBQUsvbFhodmNlejVuM0hjMGNPMU9BZ0RZZ2JNcjh5TGdZZ2E0R2JOdzVuRk9kaE1BQUg5am1xRlZVbTFSWkd2U2ZrRlhPWloreGo0U1dIa3o1d3IxL3FYTU5KOFQ5Qm8xcExEK04xMXhRNkEwWG9BZThvcGlWMFZzK29YVlNLY0M0UlN0bkhxU1B1WHp4SDE0dHVqdlN0WXdCQUN5cnJ4cWNkc0pBT0J1aFlwL25SUy9DRStyMXJKMnlQWmRhV25YV0NBZ1ROOEdCUWc4OUFwYnFnUEtxQVFBNEgza2VZK2RYVzc0MUpYV3M1ZjY2VkxUZnovZ29aRUNJeHdyV3dFRktzK1JPdTA1RWx6SEFhRnVDWUFEQUJKeXYwUDZKaFNJMDhyQlQrb0ZJVUxtQkJTdjlFVEErMk9Ic1dQNEp1bU1tWFY2TTZhazUzT3QvbU5ZbDFORkVPRmVTTHIzZ1FMRU5BRFE2K3lPYTVyd3pTWHMwVFQxOHJXK0FxZUJ2WktCZlNMOU1LU0Z0ZlREd0FaZkdWQ1EyRmxRT2hOeTU4WUJWOXFwRVpzTUljRFFHanE5cHJtWkJ6NEJYM3RJOHpHc2hBQ3dhYytGSzIzRE93M1hib0NTQ1owTkRRQWNSNDdYenU2bFlnR0FwRjRMVnZNbjJYODU4b3B0QXhpM21saHhhZDAwMWovdTd6UmVBTnhyU3hSR3hJWnJ1TGNYQStFVURRQmN1SER2Q2ZRQTdORFoyQUFBZkc2dFlRd0FTRk1wYmprQ0FEeXVVUEh2S1lxZlhjUzRJZmlRcllJVld3NFE2RFdBZ0NqK2VsZm9CdGNDb3h3QTBFSURuMmNCQU83Q3R3M0tUelpJMXBWMlI1UVluVlNoMDJKbGUzQVBiQ2l6cmNUdUxLRWVFZ0RTeFk2N3pFbFRrcHdyYnZlWnBoblVIb0NWZlhEUDdZUFN5b0VWSnVoOUY3NHA1MHBiS0tNRkd2UDhJMW9qN2I1YTg1ZWtlNk9IWnk4UUF0QzYwUjJCa05nejF2Tk5BSUErVjF5T0Y1c3BIYm5TYm96Y2FFejJGYllNUnZuUXB3alJuQ3Z0MURnRjc0Q3RkUzljYVZPblNWZmErNEdiL1NCSGFRQml2OHZ3M2dJNDBlSmRJRU1tUitDQ3ZXUGRDZ0RZaVJ5SHJyUjljRFU4QUpvU1BvTHpoLzFCbHNuYmV3aUd4d0VaZk5qZkpZMzFmK3BLVzVKYlhnQXNzc1o3RGNPSWVCWmtiNjlDbUluREtiMWxBZ0R0N09GKzNLZ1dBSWlwRURjZENRQmVWRW54NzVMaTUxTEJ2WkM2TmdBczJMa0tnUUNtL0NBUXFJL0k2MDBEQUpKeWpUVUFnUEZ5UEVDckpMaU9uTjNZUjlCdXhrREwyRzVXNHRiWWMxNjRDT3VHSlR1Z1dIWFk1VkNRL1JKd1BOaVMyMVRjNUMwQkpZbFc3UzRkMUMwU2RoS0MySVB2V3lHRm9pbUlvWWpuNStpK3E2NjRJOXlac3hzWUpkMzdFUGJ0V29BRW1ER3NYaFFjMW5wcVJOV3JCQURkQWFWKzZrcGJnMXRnSWF0NEMvcWMzcTJSQmVZS1pFYWdGK0lZemdOKzZ6UzUvNC9KL1kvS0JkT0NKeFNQMkttaTRGZElHZVlJSUV5Uy9OTXMxZERZSW85UVZyay95dk8wSEFCdWhvVGZpVjZNV2ZCNE1PaTVNT1pVM09scHJQOFRDRGxxWGdDdUhpcGVnUCsvdlROaHJ1cktyckQvUkZKSlZ5cnBWSkpPZHp0eE91NjBHOGRsNDVIWVFHT01RQXhDODRDTUVFZ2dDWVNHRXBMUUFIYis4ZzNxdWllc3Q5NCtkM2g2TXJUOGZWV251c3FON252djNudk8yV2NQYTA5WitIV242R3pCdlY1MHRodGVsekJiOUM3a1FnQUhMUXlBWFp0UGFnRDRPOXJhQUtoU2g1dHNZUUNvR001eE52NlZZT04zcWVEdnJOWldaVDE3TVFUdVc3bVlHZ0lERGV0Nm14Z0FUWFFWdEdGUWFrKzVYSFEydVhDWDRYWlIzOW8zR1FBVFJiNlB2ZmQ2MTlLZmVjbDJqL3FHNXhZQW40RDNKVHY0YWNhUzllK2UyeVI5SWRPS0FHOTkvVndtN1pMOGp1VUdHMXp1ODEvWTZTWmxnM3RQK0JjOUdBQ0hjbnBaa2ZjMFZ3WVk1Y1M0Mi91aC9PMThUYW5xU1JvQTF5dmMrbjVxdTFkMHQ4L2VDOXo1Mzh2MzkrWmthbUM0YTkvLy94MTVkMzB6YXVMK0h5bzZtL1o0VGt4YVJ3L2xONnlhaDBCYjlLcnJYNXVrUmJGcUh5bW5ZTlU4aGJ0QkNNSlB4bTJyQUthQ3ZTS0Y0TnhMTTJtbjlyUU9IQVplRmEwMmEzUDYzN1puNnZrYzZiZTZMc3RNSnBTZ1h0aE55WmZhbGZCbTlMMmpKTUJOOGJSRysybTBKdXczTUFEKy94cHREWUJid1JocWFRQzRHRTR2Rzc4Mmt0R04zNldDTDlxcFhFVS9lakVFbGpPR1FLcERibExYTzFkakFEVFZWYmd1SlQ1M1plTzlKNXZib3B6azJob0F1WW1hTzNsTlNnWjBFamZTdXYyMElFMEY3dFNYZHBMeDhjUU1oZlhNNmFMS1RlNExXUzUydVNVWjRQUHlmaTRkd3dEd2hUcDMzVjRNQUkwVEw0aW5LaWNFRkxYNDFkQ1Fla2dpQTl2RnFrN1NBSWhLWjNVVDJMUEZORElzZlhPZWtVVmREUXcvNFh2ZWdKN01EaVRVc2hkc1JrM2QvNnJYcjAzUzBpYXdJY2JPYzlsUUl0Zi92Q1hHcGxOcmxLMnVZbHYzTE1UM1BEQ0VvN2JPNmZwdGRRRDhmWGx1ZVFhNkpta09neHVzK254OHJyU04vZWR5QWR6WVZTK0FkMWZWME9lMlhHZE5qQXdOelhxRmxKY0JQallEd01PTk55c01nRTN4Mm0xVmVSRjZNUUN1eUJqb3dRQzRWWFNLNFJ4bjQzZjFOSlZSVFZLeHFkY0xqdThBQUJiVlNVUkJWTGxFOGdZY3h4QllEd3dCRlI2cXErdlZFUmtBYlhRVnROM25uYUJDSWlXQmFISm1Xd1BBSitxUGdjRnlSNUlraDRwT2llT28wVWJWaHJGWk1ab2tHTlVseWoyU2hheEo4dEpzeXcydTd2TjFvWjdxa3dIZ3YyMWE3bjBrQmF6MXlvL01uWHhvT1JKUHhTT1FObGd0dXpwcEQ0QXU0TE5CaHZXaG5ZN21BM2RvVmF6NFdwQm5zSllKSGZqR3NWR1JaQmk1L3lPRE5YVkQxQ1pwMDhHbXJDZnliVXRFMWRhOHlkT21wYkZlcjY2Q1RITVpZMlBQd2tIYWpkQ3YzMVlKY0xyQ294YmxHWXhrM3B1cXVkTG05UC9VUER1YVhGcmxCWEN0QncyVlBaV0Q0NmFGNXBiTU96SWwrMUV5VWg3Sm9XY3ZZMERlQ0F6am5aL0tBRGhmZFBkamIvcTMva0NPcy9FUEJ4di94ZkloSmEzbEw4b1g0bndmRElIZHdCRFFoMUpYMSt0RERZQzJ1Z3F1Y1BqUUtpUzJwRHhTeTJsZU5qUUFaZ0lYOVkvQjMybzhPSVZCcmt2Sm4vY2N5RjMzUUZ6UnVmR3lEd2JBbkR6dkp0bkwvVFFBOVBOUHdnRFFoWE5RN3YrVjh0My94c29BRjZ6OFRPK3h6OE5sV2JSMFVUeEpBOEI3eTgvTDZkcGp3Y3NXMHRuUFpPaHIwdWdWQ2FYZHRWRFpvU1VhNm9sc1J4SWx0NFBFMnB6N2Y4N2M0Wi9KWnVWcWNscDU4MHcyUGZkOGVDbWNTczErVVhRcTF0MHdUOE9DeGRZUEpiOUhTMjdWdUVpZW45VFd1VzB2Z09nZGVKbUxVZmRvQURRNS9XdGk2SElQWGdCWGU3d3Z6MnRMM2tzdHdVdDVGTzRkdVJtRVJqY3R0MmVwSXAvQzh3YldMYjlvUis1Vmg1YkFtekFBUmdLWDI3WmtNYmZaK0pPcjN6Zit6MG8zVFdyVmU3WlBoc0F6aWVOc0JiOXh0Q0lyTmpjT0d2eWJuY3huYVUzd0U3dVgrL0lDYll0QjhLS2xBYUNubVI5cVl2RHB2dVlxRjc2cW1NeHRkQ2N3QU9vTmdMVG91bTZGaG83bTVNUzZKdStyYmpiUHBUSmpKU2lUT2trRDRLS3NNUk9aOGpxTmVUNnEySlRkV0wxVWJwUTNHcFlEcXFja25mWWZXNlhCdXNYdm8zSkNWZEU3VzNSM0g5VFR1WHNCL3RlOEdvOGtyS0d1K2RRaS9WTUxNNmh5NklJODk1MGc0WEM1NkJiZFV1TWk2ZTZuSm1GWGc2SHpQMm4xUng2QTNIdDhPeWdGYldJQXREbjlQNVIzcW8wWDRJWVpwcDVEc1dWaGxlM01ITHBsdVZHNm1XOVZ6THVyUlY0OGFGVzhWbHFpditKZWhEZmxBWEFGbzVPcXpUK3UySkI3Si9hczlIREZFb3VpRE91NnNkZnczMFVKbVhlRCt1RUQyU1RYeE1YVk5nY2dxakYxRDRDcndnMFczVjNIMHZOSkMwZXVkcld0N2tUMCtSZ0FuUVpBNmpyMlJmRmFRR3BBd25BekZlV3gyMEhKWjNRU09Va0RJSFVFOUUzYU5RRjJaRDZtcXBMOW9EeFBzN292bE92RllFVTVZQW94ck1vOVY2K0NibUlhNjgrNS8yZHNJOUV1b2FxNnFhZnpqYUpUQytORkVlc0RlRStFOU95MWFjeGswYWtpNktWMU84R0dvN0xiN2szNnNxanVnS2NpYXNsclVKVURFSGtXMVZ1bGMvVWdLTVVkSzdwN1F0U2QvaDhVOWJvQWtSZmdlbWE5ZjE1MDZoVG9QYTRxcDR3Mjh5Y1ZucmZMUlY0K2VGSHl3TFJNZjhFU09RZmZoQUdncnV2amx1VFYxZWFmMU1hdnBZZDZROTBpWEtrWm5nTlFOYnpQZ2J0RWQrUWt2UzVsZUErTFRoR1FPZ01ndWVxaUVwTWZLdHlxU1hkY3U0NGxzWldoaXFReGRlV3V5WGV1RzVFdVBRWkF0d0Z3dE1sOFZOWkcvNkhvYk1JeUUzaThsaXlPcVdHaktIdTU2ZjFSMmVlbUJzQzU0RFFYeGVyM0pIblJrLzkwOHgyVnhUT3RDMWNibGdQcXByNG1zVnpOMXQrdU9HVzYrejkxeHRNdW9ib3VMa3ZlenFFWTlYc1Y1WG1UUVJoZ01MaDJrM0svdTJKVTVQSkp2aW1xTytCcDE3NjB0bFJWQVd3R1ZRRFRtZWV5SDZ4RDZmbTJPZjNQbVdlcHFSZmdlbEFxblFTNU5EeXpJcUdBOWFKYk5qck4xV2d6WHlnNm14K05XZ0ptVlFPaDFBeklHd3BwRTZXQk4yRUFxS1ZiNTI1dllnaEVKWGw2NHJ4MFFodS9aa2FQU1F4c1FxNTd2MkxrcWdCeXd6c2RSaTc2UTR2MXpNdHBvczRBOExhOVVZTEpDM05CUHBReXN5bmJVT2JFVUJzUE5tbS9ybHZkZFpvVFVZWXhCa0RlQURnU0wzbXY2T3dEb09XYWQ2V2FaTUhpbVZWWjEwM3VUM29YSGdSMTdGVUdnR1p6ZTlucmsrQzdyUVVuOTRkQktWcnljbW1YenJweXdDclg4YmFWWXpaeC81OHZYamZHVXEwU2RTYy9LenFGalBTLzVkejFtZ2o0cld3U2R5eGNXRmZ1TnhNTXJ5aTVWT1E3NEdublVaWHM5dkppUGRIcnVqSXYxM1J2U0pVT3dMV1dwLy9ab3BrNm9Ic0JrbFM2NWxNc1MrTDFrdVJtUGJHd3RsZHNmSmZaekwrWHN2QlJXNSsvTHFwYkNJOEYvNjJyM1hpdkJzQ0ZZeGdBM2w3V0RRRnROdFBFRUlocTg3Vm5zdmJQN3ZmRzd6ZDBVRXB1cGpPVGFLYW8xd0dJeHJSazFkN0kxSEo3Tm5LcTRYNllNUUNXcFNUTjIvYXFBSXU2TmIxa2I5SEtEMVh5Y2pHd25uUENMb2Uyb0MzWUlqQnYxNDVxakRFQXFnMkFkNE5UeTJPYlMvY2txYWxKekRYbktkTHZwUWIrVTlsOGZxZ3hBRDRyRjdyTFFjbmVzbm1ROUlRY2VTdDBzVTBKY2wvYmFTNVhEcmlWS2Vuem5JRTkrUTZ1VkRnVHhKR3ZXQ3c1a3ZuVjBsVDFDdVRLVnUvWUpqM2FzdHl2NmhEaW1oTGZGZmtPZUVzV25yZ3QzeWNuTUxZYmxLRXVTYTZDYWdCNEtiSldkN1E1L1U5SjJNV05rc2dMTUN5NVoxcTVvZnVYZG4zVVRwTUxSV2RyWUcxbUZtM200K2JoSHBEd3l4ZnY5Sk1XbTdqTDA3WTFBQzdXSk9ETnRUUUV2RGJmVDV3M3hWVjVFaHUvVmlCb3ljMnd1YzlHS21LbVVWS2JqMkdKcVExVUpNYnNXQWdnZGJYYmtOTzJiblM1dHIwam1UQ0Q2K0dycWw0cVBVa3gwOGZCUnFiSmkzN2RmVW11VkRYREpYRk5yeFo1bFRFTWdIb0R3S1ZoYzJWSzZnRTR5SnhveHpMZnkwTUcycVh5bVNUODFua0FQaWxlTjlPNlZsUnJBdXpMZXhRSnVxU0YrNUlreU9tMWgrMlp1SExtZm5EcWpISUdkdVU3dVBxZ3RzVCtxdWp1ek9oWitRZVdlK0gvdjNyT1ZBeEkzY1dUUlY1YllFOE1pTG9RWktRcTZWTEFMaWU4SENUcWVpOEtsejdXU3FzMUNiOUV1UXE1WGdCdFR2L2pSYjFPZ1AvN1cxSzVrZmFYU2FrSTBLUjE5WWpPaWhjbEpWWCsyU0I5NTAzVGNCTWZ5b3cyQnNDNW1rejhxWmFHZ05mbWU4OWtkOU9jeE1hZktoQXVTSzdCTlNuRkdyU1h2Mmt2QUIzWGlzNk9oRGtOYzAwQ1hCZjNaVXBPMFZCQlZkdGV6Ynhlc01WRGpRRFYxZDhvT3J0U1JSdlpVSkRBdUdGbFNGRS9nM1c1TmxVQS9UTUFVcW5vTXl0SFhTODZPN1R0WkJMYVBIczViY2k2bUcvYUtYcW5ZUTdBUjVJbzU2NTYxd1Q0VVVvWWM4MnVVdXowS0xUd3NaVEpEUVRsZ0t2eVczNHN1dVdmNXpLaHJCOHlDWWpqUlhmRHJhZ3pvNTd3WGVZM2FocWtKMmVQM3c4SDcxa3lrbDRVbllwMWRTT1hNK1R6YUs5bVRjczFHZHNTbzJmZnFxRDJwUHh4TzhoVjhOYmdreTFPLzhORnZrRlcxZDk4TGVIbEc1S3c2TzEreCt5L3BWQnJ5bGM3ZXYvTy9TVVlBSk0xbzZrQlVGV1NkMU51V2xORFFDM0dxR2V5dTV4ODQ5L3B3OGFmU2crL0ZFUGdUK1Z2dXlUV1lpL2RBSFZjTE4wLzV3SzNsUzRJaDBWM1o2OXRPOVhzeXdZZWJUaGFrblJQZEFZMlpDRi9VWFIybjlzcjZqWHRtMXhYdTlMcElyRGZndzdBeXpkc0FMdzhRUVBnWlo4TWdJT2l1NHZrYnRIWmZXM0Q2czRueFdpZnRlejhYZGxrOXVVNjJzNjFpUUZ3cGp5cGY5MVFFOEIxQWU0WDNlMnV0YW5MWnhXVkJvK3RUajFxQU9XaExKV1RqcjZESmlCK1duU0xNcTBHdVFkUExOZG1QdmkzaDNZcTF0TnE3djE5V2RUcmJ1ekxkMmxxQU5TSmRlWGFqSzlLc3B5M3BkNjF5cWFWb2xPYVdFTVM1NFBmbkE0a0c1blRmQzVud1A5T2Ywc0tJZjJwM05lU2NlTWFDTkYvRzdCRTlVL2ZkZ05ncnVGb1lnQ2NxYWpOdjNJTVF5RDNtYU1aSzFWZnFPTnUvRWx6NEJNeEJMNHFOK3B6eGZIYUFaK1RjWFRkejh0N054Ym9BR3dXcjV2WnVDNzFVMW5VZG92T1B2VFJoak5RZEFxVDZHYWQ3cnQrbGs3VTdRckQ0bXJGZGRma3BMaGJkUGVrM3haamI3bUJBYURhQVhVR1FFNWpJRHBCN1RRMEFLbytQM2ZkcGdaQTFiWGJoZ0JTMmQrdVBjOGRNNjRmQmg2MlNOaHJRNjYzRjRUdVZ1UmQzYWt3QUQ0b1QrcGZXY1orMUU5QzcxK1VlWjljNytlSzF3MWR6aGF2aFhnaTQ4S2Z0NzkzSG9iemQ2UEsvZjlKcG94c1J6d3lMdk9icXhMd3YybnluclVkVFEyQU9xMk83eXdSZkZiVzlSVUo4WGs0NGFua2ZpMklRVFFtM3AzMGZEM0VvTU5QOG9PWnFvSEg5bmNkeVlidm5EWXFESUJITFVlZEFmQ2ZaVG1TR2dKZmxoUHh3akVOZ2FZR2dHNzhTMzNZK1A5WUxyQi9MRjZMRDMxc01jeWNBYkRUd0FENHBCd2ZsNHY1bWFKYkNWQkRHejV4SHN2emVSTDgvMTBDRVhMaUdyTE5XcXMxZktLcWFtRzZ0eDVhcUxydWttVE1yZ1hYWFMxZXQ5YU1Fb3dteFIzOXhIUUR2UHpHdlVJNWpZRXBPNkhwdjNPUFU1dlByN3B1OUR6YVhMc3VDWERHU2xXamU3NGU1Tm1raGp1YVkrUFMzZzh6NytGYTBkMkZVVWNVaHZwOU9aOCt6NXpVYzgvUFQzazN6ZlYrZEQvK0t6QXVQTWNnZDUvVGV6ZGQ4d3lyM1A4ZlpieVRmazlVNWpmS0YzaDZqUGVzelZndFl2R3Zwdk1vWmVoZmxPVEhZY3Y5MGlSZlR5alVKbWRlem5aTkVpcy90NnFIQlJzcWE2eUo2VGVMYm9sNkhSMVZGajhYQTJDdHgxRmxBUHkyTEVkS2hzQ0g1WWI1YVI4TWdhWWhBTjM0OVlYcWRlUC9qMWZqMzhyL2ZiOWNYRDRvWHJlbHZCZ1lBRDRobzhtaUJzQUg1ZjA2K3J6ZlNTV0ZHZ0VMd2VUUmlUTXZHKzFTMGFsTFBXY0pkVW1nWk5CS1ZMUnNNNXFvS2Z0ZnU4ZnBLU3k2N3JTVm9EMnN1ZTU5T3dHa0JWNWppNHVtRzdCb1dkS2FGMUtsTWFBeDJ1aWFlaUp1OC9sVjE0MmVSNXRyYTdiNzUrVzcrbjQ1OTZKUzFZV2lzLzJ2MzNPOTMrTldaWE10TU9ZV2FxNzFJTGpuVVNMcTcwcGpWMC9xZWxyTFBiL28vbjBycnZjejVmcnpVWGwvemdlYlFOMTlIbS81RE4zOS8yR1FuMVIxVDRhdFlpRDNOMjNlc3paalVUWkIzVHlienFOa01QNlBHUUdlKzNXM2lEc1d6a2xaM0lURjBwTW1RY3J0U092aVRQbDlkY3dVM1EydExoVnhrem9kZDFSbjRlZGlBQnhuNUF5QWYzbzFmaVdHd1B0OU1nUVdHeVlCUnBaa2VxR0dldHo0Zi8xcS9FdjV2KytXLyszM2tzU2t0Y3k1Q1JsTkZrMVlPcnBILzE1ZS96ZmlTa3N2KzNUNTkzUEJ4RW1laldpQ3pVVUNFVkluZmRsS1ZKTEYvbjJtOWpkZFR5ZWJkZ1BNWFhkQ2FtQnoxNzByMTQxcWtyVTUwdmVCQ0lhVzMyaGxpT3NNeklvMmdtdFcrRFYxVTJ6eitYWFg5ZWZSNXRyWExOdjlUTG1aL3FibzdBNlgzZ25OWG81cXVlL0kvZGJOUDJmTXpXYmV3NXhBeWQxTUtlcDc1WHNmOVhldmVuN1IvVXNhN2grWHh2UjdrbU9neHNWSlBrTjEvMy9RNEhmNFBSbG8rTnViZnNlMlF6ZkJ0SGsyblVjcFJ2K1pHQUZSN3RkRTBTMG9OQ1ZKZEtPMlRxc3E0U2ZsTTcwdTY4cVlEZjM3bElUbjcvRkk1dTlTNXY2VjAyb0E1RnlNdll6b05INDBlZi91MWZpSDBoRDQxM0pENjRjaEVDM0lWek1USnJmeFgrMXg0Ly9IVitQdlg0MWZsci9ydCtYditWQnFtYisxc3A4N0RTYkxOK1VKUlYyNC8xeCszZ1VwT3h3U25ZUGN4QmtwOG9wZFhRSVJ4V3VkOHZPaXA1RGNkcU0xRXpVSlVVVGRBUFc2MnFwWmEyQW5HMXczVWlXN0xwdjdSREIwRXFzMnhFUWdvakVzU1l1M1pYRnlZWTFSMlJUYmZIN2RkZjE1dExsMk92MS9XYzZsUDVSejdGZEJxV3JWUForeWE2ZjdmVmtTbUhUeFZLR3R5Y3p6RzYzNXpTcDI4cTdNSTkyb3I5WTh2K2orYVMvM05KZlV1RGh2UnZWSlBNT3ZiVDQzL1IxNlQrcitwczEzYkR0VWJDM3B3VFNkUjM4MmdONkJ0OVlBcUhKOTllb3l1aGRrNGY3VnEvRTNwU0h3eTNKRDY0Y2hFQzNJbHpNVFpqelkrQytYRnZvM1BXejh2M2cxL3ZyVitOdnlOLzI2L0xjZlNCN0FoY0R0VlRsWlN2Zi9XVHZCSFgzbUwzaGpBUUNnWHdaQWxldXJseEdkeHJFQUFRQUEzaklEb003MTFYWkVwL0Z2dU5NQUFBQnZsd0dRRWpLdVMreFR4M1ZSTDdwbzhkdGJGU3FCdlE1WFM3b2ljY2JibVpIK1JtT1VaelB4OGdtTFUycDgrWmFFQmpUTWtFMEtzVGo1emZJYU9tNUtIWHo2ZmdNU0VoZ3ByOW5yR0xhczJNdWlzbmljNTNDcnNKYWV6QllBZ05QckFSaHJzT0Zka3pyN2lRWktnVzJINnlXcjNHSXUrU3pLVXY2aVljYjhYY21XMStUQVVVazB6SmFGRk5XZG1YSWVrYWcxYTYvRHMrTFQ5eGs3NXZOSlNVVXBtZWtTc3dVQTRIUVpBSnFkUGx0WEJ5azFzOVBTN0tCZjQyNVExblJibEtOeWRhSXFVcUtadDRNMU5mT1BwQlR2bmxVSnBCTENCMVhDRUVWMWIrWmNUa1RVbXJYWDRiS1lYcnQvbkdjeHJmWDJ6QllBZ05ObEFLak01RUtkRXBKSkp5NzJvQmhZTmJSbjhtaWcvcFZUaXJwWGRMYkRUTm4wUTFKL3I2cDVhNkpTbGhNSXVpTTY1MWxweUtLejdlWml3Nm9JRnlsNjNPTllFWTMyQ1NuSG1wYnYwK3V6V0RUcHpHdk1GZ0NBMDJVQXFBYjJrMkJFRzU1dWptdDlIRkVuTDlmL2RxM294MFYzTzh4VXJ6cGlzcDJxbTc5cm12bVJSUENpTkU3SmRhTkxmZTRYUlFxMVRoZkJkZG0zZWh5UkZyeGUrL0V4bnNXS2E3UXpXd0FBVHBjQk1HT05MYlpyTnJ4SVkzKzNEeU9uSXVnYjdJWTFHNGxhUktad3hiam9aMnNyelFPNXhrR21PMkNTU0gwcVhhcTBMZXAwcGkxcUUyWEVxRFBiZnN1eDI4QUFlQ0xOV2RxTXNFa0xzd1VBNFBSNkFMUTk2WDRMQTZCZkk5ZlVaeVpvSWJzcmZadlhwS25Jck9RUXFNeHgycHdQcExmMFJ0bE02TG4xbmQ2UVJoaWJZbXlzQloyeElnUGdaVVhyMkZ1WnpteTlqS1lHd0Y3TGdRRUFBUEF6TUFDOFM5M1JSdmVEOVlMV0VNQ0lkQlZiT2tiOE9ockwwZzUxWEhvcVJ5MWtONlIzK2JOeXMxNEtHci80YjFPdlFlcXFwVzFNRDBxRElMVVlUUjZEOUJuZWZhMFhBMEJ6QUpia3U3UWR5OUo1TEdkY3JQYzRNQUFBQUU2NUFlRE5nQ0lEUUUrODNvNzJRUi9IZmVtQ05XSmxkbFZHd0Y1NUl2YTJuUnJlMkFqYzhnK2tIL1ZUYVMrY0RBc05ENnhiNjlLVUhkOUxDRUFyRytiTGEvWXk1aVZiUDkwdmJmc2FkZGRyT2xKeVpUTDhCcGt0QUFDbjB3RHdFMnpPNVQwc2lYWEgyV0NXTXExZmRZTzlFWFFkaTR5QWJYSGRhOGhDd3h1NW50MXpZZ2dzUzZMaFp1a0szNVNrdUs3TStCNlRBSytYZjUrMENXWjZITlBsODlPdVlVTWk3VHlYS1oxc011YXNmL1lBc3dVQTRIUVpBTkVKOWtWRmtwbm5BS3ozY2F3R1pXM25HeGdCdWFxRmlYTGpmVkRSczN0SzJwamVGME5BUXhOTDhqZmVpNzZYTXNBcjByb3loVlY2SGJkRnNlK1N0WDJkT3Nad2dhVnZtUzBBQUtmTEFOQk0rWlEwOXNMYzExVUd3RllQU1diUnlMbkx2Nm94QXFwMEMwWXlQYXUxWjdlcURLWlRzNGMyNWswWVIzdlJ0eFlDNHEwREFJQzN3UUR3cExGblpleTdMb0h0cC9JQW5LMHdBcVpybEF0dldOdmdxR2Yzb09uK1Q1YlhWYm5kNlVBYU4vV2lieTBGekZzSEFBQnZnd0VRbmVoVFREM2FrSC9xSElEL3JqQUNSaHIwTGhnTW12U2tPUHhBdVpHbkhnYzNNdzE2aHN2UHV5Ri9jN1Q1ZjhrYkJBQUFmNmtHd0loa3l5OWJQRjNWNE1ha0ErQjRINUxNY21PMlBJWGZSbjRXQUFEZzVBeUEyOWFZUnVQcEQ2UXNiN2c4VFd1M3VjbGpKcHBGWTF6Yzk5L3hoQUFBQUU3R0FORFd0RkhyMnlrcE02TWpIQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFEQTI4UC9BZllJdTBkYnBSZUVBQUFBQUVsRlRrU3VRbUNDYDtcclxuICByZXR1cm4gaW1hZ2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbnQoKXtcclxuICByZXR1cm4gYGluZm8gZmFjZT1cIkx1Y2lkYSBTYW5zIFVuaWNvZGVcIiBzaXplPTMyIGJvbGQ9MCBpdGFsaWM9MCBjaGFyc2V0PVwiXCIgdW5pY29kZT0wIHN0cmV0Y2hIPTEwMCBzbW9vdGg9MSBhYT0xIHBhZGRpbmc9NCw0LDQsNCBzcGFjaW5nPS04LC04XHJcbmNvbW1vbiBsaW5lSGVpZ2h0PTUxIGJhc2U9MzYgc2NhbGVXPTUxMiBzY2FsZUg9MjU2IHBhZ2VzPTEgcGFja2VkPTBcclxucGFnZSBpZD0wIGZpbGU9XCJsdWNpZGFzYW5zdW5pY29kZS5wbmdcIlxyXG5jaGFycyBjb3VudD05N1xyXG5jaGFyIGlkPTAgICAgICAgeD0wICAgIHk9MTAzICB3aWR0aD0yNiAgIGhlaWdodD0yOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTExICAgeGFkdmFuY2U9MjQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTAgICAgICB4PTAgICAgeT0wICAgIHdpZHRoPTAgICAgaGVpZ2h0PTAgICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MCAgICB4YWR2YW5jZT0wICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zMiAgICAgIHg9MCAgICB5PTAgICAgd2lkdGg9MCAgICBoZWlnaHQ9MCAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0wICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTMzICAgICAgeD0zMTAgIHk9NzEgICB3aWR0aD0xMiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzQgICAgICB4PTQ5MyAgeT0xMDMgIHdpZHRoPTE3ICAgaGVpZ2h0PTE3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NiAgICB4YWR2YW5jZT0xMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zNSAgICAgIHg9MzQzICB5PTcxICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTM2ICAgICAgeD0yMTQgIHk9MCAgICB3aWR0aD0yMiAgIGhlaWdodD0zNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzcgICAgICB4PTM2MiAgeT0wICAgIHdpZHRoPTMwICAgaGVpZ2h0PTM0ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NyAgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zOCAgICAgIHg9MzcxICB5PTcxICAgd2lkdGg9MjkgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTM5ICAgICAgeD0wICAgIHk9MTMyICB3aWR0aD0xMiAgIGhlaWdodD0xNyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9NyAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDAgICAgICB4PTYxICAgeT0wICAgIHdpZHRoPTE2ICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NyAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00MSAgICAgIHg9NzcgICB5PTAgICAgd2lkdGg9MTYgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQyICAgICAgeD00NjAgIHk9MTAzICB3aWR0aD0yMCAgIGhlaWdodD0yMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDMgICAgICB4PTgxICAgeT0xMDMgIHdpZHRoPTI3ICAgaGVpZ2h0PTI3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTMgICB4YWR2YW5jZT0yNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00NCAgICAgIHg9NDgwICB5PTEwMyAgd2lkdGg9MTMgICBoZWlnaHQ9MTggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yNyAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQ1ICAgICAgeD05MyAgIHk9MTMyICB3aWR0aD0yMyAgIGhlaWdodD0xMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIxICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDYgICAgICB4PTgwICAgeT0xMzIgIHdpZHRoPTEzICAgaGVpZ2h0PTEzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MjcgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00NyAgICAgIHg9MTQ2ICB5PTAgICAgd2lkdGg9MTggICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQ4ICAgICAgeD0yODUgIHk9NzEgICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDkgICAgICB4PTQwMCAgeT03MSAgIHdpZHRoPTE2ICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01MCAgICAgIHg9MTIwICB5PTcxICAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTUxICAgICAgeD0xNDMgIHk9NzEgICB3aWR0aD0yMiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTIgICAgICB4PTE2NSAgeT03MSAgIHdpZHRoPTI1ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01MyAgICAgIHg9MTkwICB5PTcxICAgd2lkdGg9MjIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTU0ICAgICAgeD00MTYgIHk9NzEgICB3aWR0aD0yNSAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTUgICAgICB4PTIxMiAgeT03MSAgIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01NiAgICAgIHg9MjM2ICB5PTcxICAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTU3ICAgICAgeD0yNjAgIHk9NzEgICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTggICAgICB4PTM5OCAgeT0xMDMgIHdpZHRoPTEyICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01OSAgICAgIHg9NDQxICB5PTcxICAgd2lkdGg9MTIgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTYwICAgICAgeD0yNiAgIHk9MTAzICB3aWR0aD0yOCAgIGhlaWdodD0yNyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEzICAgeGFkdmFuY2U9MjUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjEgICAgICB4PTEyICAgeT0xMzIgIHdpZHRoPTI4ICAgaGVpZ2h0PTE2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTggICB4YWR2YW5jZT0yNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02MiAgICAgIHg9NTQgICB5PTEwMyAgd2lkdGg9MjcgICBoZWlnaHQ9MjcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMyAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTYzICAgICAgeD0zMjIgIHk9NzEgICB3aWR0aD0yMSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjQgICAgICB4PTQ1MyAgeT03MSAgIHdpZHRoPTM0ICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT0yNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02NSAgICAgIHg9MzkyICB5PTAgICAgd2lkdGg9MjkgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTY2ICAgICAgeD00MjEgIHk9MCAgICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjcgICAgICB4PTQ0NCAgeT0wICAgIHdpZHRoPTI4ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02OCAgICAgIHg9NDcyICB5PTAgICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI0ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTY5ICAgICAgeD0wICAgIHk9MzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzAgICAgICB4PTIzICAgeT0zOSAgIHdpZHRoPTIyICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03MSAgICAgIHg9NDUgICB5PTM5ICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTcyICAgICAgeD03MyAgIHk9MzkgICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzMgICAgICB4PTEwMCAgeT0zOSAgIHdpZHRoPTEyICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT05ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03NCAgICAgIHg9MTI1ICB5PTAgICAgd2lkdGg9MjEgICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTc1ICAgICAgeD0xMTIgIHk9MzkgICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzYgICAgICB4PTEzNyAgeT0zOSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03NyAgICAgIHg9MTYwICB5PTM5ICAgd2lkdGg9MzEgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTc4ICAgICAgeD0xOTEgIHk9MzkgICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzkgICAgICB4PTIxOCAgeT0zOSAgIHdpZHRoPTMxICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04MCAgICAgIHg9MjQ5ICB5PTM5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTgxICAgICAgeD0xODIgIHk9MCAgICB3aWR0aD0zMiAgIGhlaWdodD0zNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODIgICAgICB4PTI3MiAgeT0zOSAgIHdpZHRoPTI1ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04MyAgICAgIHg9Mjk3ICB5PTM5ICAgd2lkdGg9MjIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTg0ICAgICAgeD0zMTkgIHk9MzkgICB3aWR0aD0yOCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODUgICAgICB4PTM0NyAgeT0zOSAgIHdpZHRoPTI2ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04NiAgICAgIHg9MzczICB5PTM5ICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTg3ICAgICAgeD00MDEgIHk9MzkgICB3aWR0aD0zNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODggICAgICB4PTQzNiAgeT0zOSAgIHdpZHRoPTI3ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04OSAgICAgIHg9NDYzICB5PTM5ICAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTkwICAgICAgeD0wICAgIHk9NzEgICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTEgICAgICB4PTAgICAgeT0wICAgIHdpZHRoPTE1ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NiAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05MiAgICAgIHg9MTY0ICB5PTAgICAgd2lkdGg9MTggICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTkzICAgICAgeD0xNSAgIHk9MCAgICB3aWR0aD0xNSAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTQgICAgICB4PTQzNSAgeT0xMDMgIHdpZHRoPTI1ICAgaGVpZ2h0PTI1ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05NSAgICAgIHg9MTE2ICB5PTEzMiAgd2lkdGg9MjMgICBoZWlnaHQ9MTEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zMSAgIHhhZHZhbmNlPTE2ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTk2ICAgICAgeD00MCAgIHk9MTMyICB3aWR0aD0xNSAgIGhlaWdodD0xNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTcgICAgICB4PTEwOCAgeT0xMDMgIHdpZHRoPTI0ICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05OCAgICAgIHg9MjM2ICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTk5ICAgICAgeD0xMzIgIHk9MTAzICB3aWR0aD0yMiAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MTYgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTAwICAgICB4PTI1OSAgeT0wICAgIHdpZHRoPTI0ICAgaGVpZ2h0PTM0ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDEgICAgIHg9MTU0ICB5PTEwMyAgd2lkdGg9MjMgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwMiAgICAgeD0yODMgIHk9MCAgICB3aWR0aD0yMSAgIGhlaWdodD0zNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MTIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTAzICAgICB4PTI1ICAgeT03MSAgIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDQgICAgIHg9MzA0ICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwNSAgICAgeD00OTAgIHk9MzkgICB3aWR0aD0xMiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9OSAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTA2ICAgICB4PTQxICAgeT0wICAgIHdpZHRoPTIwICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDcgICAgIHg9MzI3ICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwOCAgICAgeD0zNTAgIHk9MCAgICB3aWR0aD0xMiAgIGhlaWdodD0zNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9OSAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTA5ICAgICB4PTE3NyAgeT0xMDMgIHdpZHRoPTMyICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0zMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTAgICAgIHg9MjA5ICB5PTEwMyAgd2lkdGg9MjMgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExMSAgICAgeD00MTAgIHk9MTAzICB3aWR0aD0yNSAgIGhlaWdodD0yNSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE1ICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTEyICAgICB4PTQ5ICAgeT03MSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTMgICAgIHg9NzIgICB5PTcxICAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExNCAgICAgeD0yMzIgIHk9MTAzICB3aWR0aD0xOCAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MTMgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTE1ICAgICB4PTI1MCAgeT0xMDMgIHdpZHRoPTIwICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xNiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTYgICAgIHg9NDg3ICB5PTcxICAgd2lkdGg9MjAgICBoZWlnaHQ9MjggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMiAgIHhhZHZhbmNlPTEyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExNyAgICAgeD0yNzAgIHk9MTAzICB3aWR0aD0yMyAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTE4ICAgICB4PTI5MyAgeT0xMDMgIHdpZHRoPTI0ICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTkgICAgIHg9MzE3ICB5PTEwMyAgd2lkdGg9MzIgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyMCAgICAgeD0zNDkgIHk9MTAzICB3aWR0aD0yNSAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTIxICAgICB4PTk2ICAgeT03MSAgIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjIgICAgIHg9Mzc0ICB5PTEwMyAgd2lkdGg9MjQgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyMyAgICAgeD05MyAgIHk9MCAgICB3aWR0aD0xNiAgIGhlaWdodD0zOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTcgICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTI0ICAgICB4PTMwICAgeT0wICAgIHdpZHRoPTExICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NiAgICB4YWR2YW5jZT0xMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjUgICAgIHg9MTA5ICB5PTAgICAgd2lkdGg9MTYgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyNiAgICAgeD01NSAgIHk9MTMyICB3aWR0aD0yNSAgIGhlaWdodD0xNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIwICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmtlcm5pbmdzIGNvdW50PTBcclxuYDtcclxufSIsImltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gPSB7fSApe1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xyXG5cclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlZCcsIGhhbmRsZU9uUmVsZWFzZSApO1xyXG5cclxuICBjb25zdCB0ZW1wTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcclxuXHJcbiAgbGV0IG9sZFBhcmVudDtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25QcmVzcygge2lucHV0T2JqZWN0fT17fSApe1xyXG5cclxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGVtcE1hdHJpeC5nZXRJbnZlcnNlKCBpbnB1dE9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG5cclxuICAgIGZvbGRlci5tYXRyaXgucHJlbXVsdGlwbHkoIHRlbXBNYXRyaXggKTtcclxuICAgIGZvbGRlci5tYXRyaXguZGVjb21wb3NlKCBmb2xkZXIucG9zaXRpb24sIGZvbGRlci5xdWF0ZXJuaW9uLCBmb2xkZXIuc2NhbGUgKTtcclxuXHJcbiAgICBvbGRQYXJlbnQgPSBmb2xkZXIucGFyZW50O1xyXG4gICAgaW5wdXRPYmplY3QuYWRkKCBmb2xkZXIgKTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblJlbGVhc2UoIHtpbnB1dE9iamVjdH09e30gKXtcclxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiggb2xkUGFyZW50ID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZm9sZGVyLm1hdHJpeC5wcmVtdWx0aXBseSggaW5wdXRPYmplY3QubWF0cml4V29ybGQgKTtcclxuICAgIGZvbGRlci5tYXRyaXguZGVjb21wb3NlKCBmb2xkZXIucG9zaXRpb24sIGZvbGRlci5xdWF0ZXJuaW9uLCBmb2xkZXIuc2NhbGUgKTtcclxuICAgIG9sZFBhcmVudC5hZGQoIGZvbGRlciApO1xyXG4gICAgb2xkUGFyZW50ID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGludGVyYWN0aW9uO1xyXG59IiwiaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcclxuaW1wb3J0IGNyZWF0ZVNsaWRlciBmcm9tICcuL3NsaWRlcic7XHJcbmltcG9ydCBjcmVhdGVDaGVja2JveCBmcm9tICcuL2NoZWNrYm94JztcclxuaW1wb3J0IGNyZWF0ZUJ1dHRvbiBmcm9tICcuL2J1dHRvbic7XHJcbmltcG9ydCBjcmVhdGVGb2xkZXIgZnJvbSAnLi9mb2xkZXInO1xyXG5pbXBvcnQgY3JlYXRlRHJvcGRvd24gZnJvbSAnLi9kcm9wZG93bic7XHJcbmltcG9ydCAqIGFzIFNERlRleHQgZnJvbSAnLi9zZGZ0ZXh0JztcclxuaW1wb3J0ICogYXMgRm9udCBmcm9tICcuL2ZvbnQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gREFUR1VJVlIoKXtcclxuXHJcbiAgLypcclxuICAgIFNERiBmb250XHJcbiAgKi9cclxuICBjb25zdCB0ZXh0Q3JlYXRvciA9IFNERlRleHQuY3JlYXRvcigpO1xyXG5cclxuXHJcbiAgLypcclxuICAgIExpc3RzLlxyXG4gICAgSW5wdXRPYmplY3RzIGFyZSB0aGluZ3MgbGlrZSBWSVZFIGNvbnRyb2xsZXJzLCBjYXJkYm9hcmQgaGVhZHNldHMsIGV0Yy5cclxuICAgIENvbnRyb2xsZXJzIGFyZSB0aGUgREFUIEdVSSBzbGlkZXJzLCBjaGVja2JveGVzLCBldGMuXHJcbiAgICBIaXRzY2FuT2JqZWN0cyBhcmUgYW55dGhpbmcgcmF5Y2FzdHMgd2lsbCBoaXQtdGVzdCBhZ2FpbnN0LlxyXG4gICovXHJcbiAgY29uc3QgaW5wdXRPYmplY3RzID0gW107XHJcbiAgY29uc3QgY29udHJvbGxlcnMgPSBbXTtcclxuICBjb25zdCBoaXRzY2FuT2JqZWN0cyA9IFtdO1xyXG5cclxuICBsZXQgbW91c2VFbmFibGVkID0gZmFsc2U7XHJcblxyXG4gIGZ1bmN0aW9uIHNldE1vdXNlRW5hYmxlZCggZmxhZyApe1xyXG4gICAgbW91c2VFbmFibGVkID0gZmxhZztcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBUaGUgZGVmYXVsdCBsYXNlciBwb2ludGVyIGNvbWluZyBvdXQgb2YgZWFjaCBJbnB1dE9iamVjdC5cclxuICAqL1xyXG4gIGNvbnN0IGxhc2VyTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4NTVhYWZmLCB0cmFuc3BhcmVudDogdHJ1ZSwgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcgfSk7XHJcbiAgZnVuY3Rpb24gY3JlYXRlTGFzZXIoKXtcclxuICAgIGNvbnN0IGcgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuICAgIGcudmVydGljZXMucHVzaCggbmV3IFRIUkVFLlZlY3RvcjMoKSApO1xyXG4gICAgZy52ZXJ0aWNlcy5wdXNoKCBuZXcgVEhSRUUuVmVjdG9yMygwLDAsMCkgKTtcclxuICAgIHJldHVybiBuZXcgVEhSRUUuTGluZSggZywgbGFzZXJNYXRlcmlhbCApO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBBIFwiY3Vyc29yXCIsIGVnIHRoZSBiYWxsIHRoYXQgYXBwZWFycyBhdCB0aGUgZW5kIG9mIHlvdXIgbGFzZXIuXHJcbiAgKi9cclxuICBjb25zdCBjdXJzb3JNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6MHg0NDQ0NDQsIHRyYW5zcGFyZW50OiB0cnVlLCBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyB9ICk7XHJcbiAgZnVuY3Rpb24gY3JlYXRlQ3Vyc29yKCl7XHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjAwNiwgNCwgNCApLCBjdXJzb3JNYXRlcmlhbCApO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIENyZWF0ZXMgYSBnZW5lcmljIElucHV0IHR5cGUuXHJcbiAgICBUYWtlcyBhbnkgVEhSRUUuT2JqZWN0M0QgdHlwZSBvYmplY3QgYW5kIHVzZXMgaXRzIHBvc2l0aW9uXHJcbiAgICBhbmQgb3JpZW50YXRpb24gYXMgYW4gaW5wdXQgZGV2aWNlLlxyXG5cclxuICAgIEEgbGFzZXIgcG9pbnRlciBpcyBpbmNsdWRlZCBhbmQgd2lsbCBiZSB1cGRhdGVkLlxyXG4gICAgQ29udGFpbnMgc3RhdGUgYWJvdXQgd2hpY2ggSW50ZXJhY3Rpb24gaXMgY3VycmVudGx5IGJlaW5nIHVzZWQgb3IgaG92ZXIuXHJcbiAgKi9cclxuICBmdW5jdGlvbiBjcmVhdGVJbnB1dCggaW5wdXRPYmplY3QgPSBuZXcgVEhSRUUuR3JvdXAoKSApe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmF5Y2FzdDogbmV3IFRIUkVFLlJheWNhc3RlciggbmV3IFRIUkVFLlZlY3RvcjMoKSwgbmV3IFRIUkVFLlZlY3RvcjMoKSApLFxyXG4gICAgICBsYXNlcjogY3JlYXRlTGFzZXIoKSxcclxuICAgICAgY3Vyc29yOiBjcmVhdGVDdXJzb3IoKSxcclxuICAgICAgb2JqZWN0OiBpbnB1dE9iamVjdCxcclxuICAgICAgcHJlc3NlZDogZmFsc2UsXHJcbiAgICAgIGdyaXBwZWQ6IGZhbHNlLFxyXG4gICAgICBzdGF0ZToge1xyXG4gICAgICAgIGN1cnJlbnRIb3ZlcjogdW5kZWZpbmVkLFxyXG4gICAgICAgIGN1cnJlbnRJbnRlcmFjdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgIGV2ZW50czogbmV3IEVtaXR0ZXIoKVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBNb3VzZUlucHV0IGlzIGEgc3BlY2lhbCBpbnB1dCB0eXBlIHRoYXQgaXMgb24gYnkgZGVmYXVsdC5cclxuICAgIEFsbG93cyB5b3UgdG8gY2xpY2sgb24gdGhlIHNjcmVlbiB3aGVuIG5vdCBpbiBWUiBmb3IgZGVidWdnaW5nLlxyXG4gICovXHJcbiAgY29uc3QgbW91c2VJbnB1dCA9IGNyZWF0ZU1vdXNlSW5wdXQoKTtcclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlTW91c2VJbnB1dCgpe1xyXG4gICAgY29uc3QgbW91c2UgPSBuZXcgVEhSRUUuVmVjdG9yMigtMSwtMSk7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBmdW5jdGlvbiggZXZlbnQgKXtcclxuICAgICAgbW91c2UueCA9ICggZXZlbnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoICkgKiAyIC0gMTtcclxuICAgICAgbW91c2UueSA9IC0gKCBldmVudC5jbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0ICkgKiAyICsgMTtcclxuICAgIH0sIGZhbHNlICk7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBmdW5jdGlvbiggZXZlbnQgKXtcclxuICAgICAgaW5wdXQucHJlc3NlZCA9IHRydWU7XHJcbiAgICB9LCBmYWxzZSApO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIGZ1bmN0aW9uKCBldmVudCApe1xyXG4gICAgICBpbnB1dC5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICB9LCBmYWxzZSApO1xyXG5cclxuICAgIGNvbnN0IGlucHV0ID0gY3JlYXRlSW5wdXQoKTtcclxuICAgIGlucHV0Lm1vdXNlID0gbW91c2U7XHJcbiAgICByZXR1cm4gaW5wdXQ7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIFB1YmxpYyBmdW5jdGlvbiB1c2VycyBydW4gdG8gZ2l2ZSBEQVQgR1VJIGFuIGlucHV0IGRldmljZS5cclxuICAgIEF1dG9tYXRpY2FsbHkgZGV0ZWN0cyBmb3IgVml2ZUNvbnRyb2xsZXIgYW5kIGJpbmRzIGJ1dHRvbnMgKyBoYXB0aWMgZmVlZGJhY2suXHJcblxyXG4gICAgUmV0dXJucyBhIGxhc2VyIHBvaW50ZXIgc28gaXQgY2FuIGJlIGRpcmVjdGx5IGFkZGVkIHRvIHNjZW5lLlxyXG5cclxuICAgIFRoZSBsYXNlciB3aWxsIHRoZW4gaGF2ZSB0d28gbWV0aG9kczpcclxuICAgIGxhc2VyLnByZXNzZWQoKSwgbGFzZXIuZ3JpcHBlZCgpXHJcblxyXG4gICAgVGhlc2UgY2FuIHRoZW4gYmUgYm91bmQgdG8gYW55IGJ1dHRvbiB0aGUgdXNlciB3YW50cy4gVXNlZnVsIGZvciBiaW5kaW5nIHRvXHJcbiAgICBjYXJkYm9hcmQgb3IgYWx0ZXJuYXRlIGlucHV0IGRldmljZXMuXHJcblxyXG4gICAgRm9yIGV4YW1wbGUuLi5cclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGZ1bmN0aW9uKCl7IGxhc2VyLnByZXNzZWQoIHRydWUgKTsgfSApO1xyXG4gICovXHJcbiAgZnVuY3Rpb24gYWRkSW5wdXRPYmplY3QoIG9iamVjdCApe1xyXG4gICAgY29uc3QgaW5wdXQgPSBjcmVhdGVJbnB1dCggb2JqZWN0ICk7XHJcblxyXG4gICAgaW5wdXQubGFzZXIuYWRkKCBpbnB1dC5jdXJzb3IgKTtcclxuXHJcbiAgICBpbnB1dC5sYXNlci5wcmVzc2VkID0gZnVuY3Rpb24oIGZsYWcgKXtcclxuICAgICAgaW5wdXQucHJlc3NlZCA9IGZsYWc7XHJcbiAgICB9O1xyXG5cclxuICAgIGlucHV0Lmxhc2VyLmdyaXBwZWQgPSBmdW5jdGlvbiggZmxhZyApe1xyXG4gICAgICBpbnB1dC5ncmlwcGVkID0gZmxhZztcclxuICAgIH07XHJcblxyXG4gICAgaW5wdXQubGFzZXIuY3Vyc29yID0gaW5wdXQuY3Vyc29yO1xyXG5cclxuICAgIGlmKCBUSFJFRS5WaXZlQ29udHJvbGxlciAmJiBvYmplY3QgaW5zdGFuY2VvZiBUSFJFRS5WaXZlQ29udHJvbGxlciApe1xyXG4gICAgICBiaW5kVml2ZUNvbnRyb2xsZXIoIGlucHV0LnN0YXRlLCBvYmplY3QsIGlucHV0Lmxhc2VyLnByZXNzZWQsIGlucHV0Lmxhc2VyLmdyaXBwZWQgKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnB1dE9iamVjdHMucHVzaCggaW5wdXQgKTtcclxuXHJcbiAgICByZXR1cm4gaW5wdXQubGFzZXI7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgSGVyZSBhcmUgdGhlIG1haW4gZGF0IGd1aSBjb250cm9sbGVyIHR5cGVzLlxyXG4gICovXHJcblxyXG4gIGZ1bmN0aW9uIGFkZFNsaWRlciggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG1pbiA9IDAuMCwgbWF4ID0gMTAwLjAgKXtcclxuICAgIGNvbnN0IHNsaWRlciA9IGNyZWF0ZVNsaWRlcigge1xyXG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsIG1pbiwgbWF4LFxyXG4gICAgICBpbml0aWFsVmFsdWU6IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIHNsaWRlciApO1xyXG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uc2xpZGVyLmhpdHNjYW4gKVxyXG5cclxuICAgIHJldHVybiBzbGlkZXI7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRDaGVja2JveCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKXtcclxuICAgIGNvbnN0IGNoZWNrYm94ID0gY3JlYXRlQ2hlY2tib3goe1xyXG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsXHJcbiAgICAgIGluaXRpYWxWYWx1ZTogb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggY2hlY2tib3ggKTtcclxuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmNoZWNrYm94LmhpdHNjYW4gKVxyXG5cclxuICAgIHJldHVybiBjaGVja2JveDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZEJ1dHRvbiggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKXtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGNyZWF0ZUJ1dHRvbih7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggYnV0dG9uICk7XHJcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5idXR0b24uaGl0c2NhbiApO1xyXG4gICAgcmV0dXJuIGJ1dHRvbjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZERyb3Bkb3duKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgb3B0aW9ucyApe1xyXG4gICAgY29uc3QgZHJvcGRvd24gPSBjcmVhdGVEcm9wZG93bih7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCwgb3B0aW9uc1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggZHJvcGRvd24gKTtcclxuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmRyb3Bkb3duLmhpdHNjYW4gKTtcclxuICAgIHJldHVybiBkcm9wZG93bjtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgQW4gaW1wbGljaXQgQWRkIGZ1bmN0aW9uIHdoaWNoIGRldGVjdHMgZm9yIHByb3BlcnR5IHR5cGVcclxuICAgIGFuZCBnaXZlcyB5b3UgdGhlIGNvcnJlY3QgY29udHJvbGxlci5cclxuXHJcbiAgICBEcm9wZG93bjpcclxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgb2JqZWN0VHlwZSApXHJcblxyXG4gICAgU2xpZGVyOlxyXG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlPZk51bWJlclR5cGUsIG1pbiwgbWF4IClcclxuXHJcbiAgICBDaGVja2JveDpcclxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZCb29sZWFuVHlwZSApXHJcblxyXG4gICAgQnV0dG9uOlxyXG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlPZkZ1bmN0aW9uVHlwZSApXHJcbiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gYWRkKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMywgYXJnNCApe1xyXG5cclxuICAgIGlmKCBvYmplY3QgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICBjb25zb2xlLndhcm4oICdvYmplY3QgaXMgdW5kZWZpbmVkJyApO1xyXG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICBpZiggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIGNvbnNvbGUud2FybiggJ25vIHByb3BlcnR5IG5hbWVkJywgcHJvcGVydHlOYW1lLCAnb24gb2JqZWN0Jywgb2JqZWN0ICk7XHJcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaXNPYmplY3QoIGFyZzMgKSB8fCBpc0FycmF5KCBhcmczICkgKXtcclxuICAgICAgcmV0dXJuIGFkZERyb3Bkb3duKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMyApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc051bWJlciggb2JqZWN0WyBwcm9wZXJ0eU5hbWVdICkgKXtcclxuICAgICAgcmV0dXJuIGFkZFNsaWRlciggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMsIGFyZzQgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaXNCb29sZWFuKCBvYmplY3RbIHByb3BlcnR5TmFtZV0gKSApe1xyXG4gICAgICByZXR1cm4gYWRkQ2hlY2tib3goIG9iamVjdCwgcHJvcGVydHlOYW1lICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlzRnVuY3Rpb24oIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKSApe1xyXG4gICAgICByZXR1cm4gYWRkQnV0dG9uKCBvYmplY3QsIHByb3BlcnR5TmFtZSApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICBhZGQgY291bGRuJ3QgZmlndXJlIGl0IG91dCwgc28gYXQgbGVhc3QgYWRkIHNvbWV0aGluZyBUSFJFRSB1bmRlcnN0YW5kc1xyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIENyZWF0ZXMgYSBmb2xkZXIgd2l0aCB0aGUgbmFtZS5cclxuXHJcbiAgICBGb2xkZXJzIGFyZSBUSFJFRS5Hcm91cCB0eXBlIG9iamVjdHMgYW5kIGNhbiBkbyBncm91cC5hZGQoKSBmb3Igc2libGluZ3MuXHJcbiAgICBGb2xkZXJzIHdpbGwgYXV0b21hdGljYWxseSBhdHRlbXB0IHRvIGxheSBpdHMgY2hpbGRyZW4gb3V0IGluIHNlcXVlbmNlLlxyXG4gICovXHJcblxyXG4gIGZ1bmN0aW9uIGFkZEZvbGRlciggbmFtZSApe1xyXG4gICAgY29uc3QgZm9sZGVyID0gY3JlYXRlRm9sZGVyKHtcclxuICAgICAgdGV4dENyZWF0b3IsXHJcbiAgICAgIG5hbWVcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGZvbGRlciApO1xyXG4gICAgaWYoIGZvbGRlci5oaXRzY2FuICl7XHJcbiAgICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmZvbGRlci5oaXRzY2FuICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZvbGRlcjtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgUGVyZm9ybSB0aGUgbmVjZXNzYXJ5IHVwZGF0ZXMsIHJheWNhc3RzIG9uIGl0cyBvd24gUkFGLlxyXG4gICovXHJcblxyXG4gIGNvbnN0IHRQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgY29uc3QgdERpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCAwLCAwLCAtMSApO1xyXG4gIGNvbnN0IHRNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHVwZGF0ZSApO1xyXG5cclxuICAgIGlmKCBtb3VzZUVuYWJsZWQgKXtcclxuICAgICAgbW91c2VJbnB1dC5pbnRlcnNlY3Rpb25zID0gcGVyZm9ybU1vdXNlSW5wdXQoIGhpdHNjYW5PYmplY3RzLCBtb3VzZUlucHV0ICk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCB7Ym94LG9iamVjdCxyYXljYXN0LGxhc2VyLGN1cnNvcn0gPSB7fSwgaW5kZXggKXtcclxuICAgICAgb2JqZWN0LnVwZGF0ZU1hdHJpeFdvcmxkKCk7XHJcblxyXG4gICAgICB0UG9zaXRpb24uc2V0KDAsMCwwKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIG9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG4gICAgICB0TWF0cml4LmlkZW50aXR5KCkuZXh0cmFjdFJvdGF0aW9uKCBvYmplY3QubWF0cml4V29ybGQgKTtcclxuICAgICAgdERpcmVjdGlvbi5zZXQoMCwwLC0xKS5hcHBseU1hdHJpeDQoIHRNYXRyaXggKS5ub3JtYWxpemUoKTtcclxuXHJcbiAgICAgIHJheWNhc3Quc2V0KCB0UG9zaXRpb24sIHREaXJlY3Rpb24gKTtcclxuXHJcbiAgICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzWyAwIF0uY29weSggdFBvc2l0aW9uICk7XHJcblxyXG4gICAgICAvLyAgZGVidWcuLi5cclxuICAgICAgLy8gbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDEgXS5jb3B5KCB0UG9zaXRpb24gKS5hZGQoIHREaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoIDEgKSApO1xyXG5cclxuICAgICAgY29uc3QgaW50ZXJzZWN0aW9ucyA9IHJheWNhc3QuaW50ZXJzZWN0T2JqZWN0cyggaGl0c2Nhbk9iamVjdHMsIGZhbHNlICk7XHJcbiAgICAgIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApO1xyXG5cclxuICAgICAgaW5wdXRPYmplY3RzWyBpbmRleCBdLmludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgaW5wdXRzID0gaW5wdXRPYmplY3RzLnNsaWNlKCk7XHJcblxyXG4gICAgaWYoIG1vdXNlRW5hYmxlZCApe1xyXG4gICAgICBpbnB1dHMucHVzaCggbW91c2VJbnB1dCApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goIGZ1bmN0aW9uKCBjb250cm9sbGVyICl7XHJcbiAgICAgIGNvbnRyb2xsZXIudXBkYXRlKCBpbnB1dHMgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICl7XHJcbiAgICBpZiggaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwICl7XHJcbiAgICAgIGNvbnN0IGZpcnN0SGl0ID0gaW50ZXJzZWN0aW9uc1sgMCBdO1xyXG4gICAgICBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc1sgMSBdLmNvcHkoIGZpcnN0SGl0LnBvaW50ICk7XHJcbiAgICAgIGxhc2VyLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICBsYXNlci5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTtcclxuICAgICAgbGFzZXIuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XHJcbiAgICAgIGN1cnNvci5wb3NpdGlvbi5jb3B5KCBmaXJzdEhpdC5wb2ludCApO1xyXG4gICAgICBjdXJzb3IudmlzaWJsZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBsYXNlci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgIGN1cnNvci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwZXJmb3JtTW91c2VJbnB1dCggaGl0c2Nhbk9iamVjdHMsIHtib3gsb2JqZWN0LHJheWNhc3QsbGFzZXIsY3Vyc29yLG1vdXNlfSA9IHt9ICl7XHJcbiAgICByYXljYXN0LnNldEZyb21DYW1lcmEoIG1vdXNlLCBjYW1lcmEgKTtcclxuICAgIGNvbnN0IGludGVyc2VjdGlvbnMgPSByYXljYXN0LmludGVyc2VjdE9iamVjdHMoIGhpdHNjYW5PYmplY3RzLCBmYWxzZSApO1xyXG4gICAgcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICk7XHJcbiAgICByZXR1cm4gaW50ZXJzZWN0aW9ucztcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIFB1YmxpYyBtZXRob2RzLlxyXG4gICovXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBhZGRJbnB1dE9iamVjdCxcclxuICAgIGFkZCxcclxuICAgIGFkZEZvbGRlcixcclxuICAgIHNldE1vdXNlRW5hYmxlZFxyXG4gIH07XHJcblxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbiAgU2V0IHRvIGdsb2JhbCBzY29wZSBpZiBleHBvcnRpbmcgYXMgYSBzdGFuZGFsb25lLlxyXG4qL1xyXG5cclxuaWYoIHdpbmRvdyApe1xyXG4gIHdpbmRvdy5EQVRHVUlWUiA9IERBVEdVSVZSO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gIEJ1bmNoIG9mIHN0YXRlLWxlc3MgdXRpbGl0eSBmdW5jdGlvbnMuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBpc051bWJlcihuKSB7XHJcbiAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNCb29sZWFuKG4pe1xyXG4gIHJldHVybiB0eXBlb2YgbiA9PT0gJ2Jvb2xlYW4nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGZ1bmN0aW9uVG9DaGVjaykge1xyXG4gIGNvbnN0IGdldFR5cGUgPSB7fTtcclxuICByZXR1cm4gZnVuY3Rpb25Ub0NoZWNrICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbChmdW5jdGlvblRvQ2hlY2spID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG59XHJcblxyXG4vLyAgb25seSB7fSBvYmplY3RzIG5vdCBhcnJheXNcclxuLy8gICAgICAgICAgICAgICAgICAgIHdoaWNoIGFyZSB0ZWNobmljYWxseSBvYmplY3RzIGJ1dCB5b3UncmUganVzdCBiZWluZyBwZWRhbnRpY1xyXG5mdW5jdGlvbiBpc09iamVjdCAoaXRlbSkge1xyXG4gIHJldHVybiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0gIT09IG51bGwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0FycmF5KCBvICl7XHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoIG8gKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICBDb250cm9sbGVyLXNwZWNpZmljIHN1cHBvcnQuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBiaW5kVml2ZUNvbnRyb2xsZXIoIGlucHV0U3RhdGUsIGNvbnRyb2xsZXIsIHByZXNzZWQsIGdyaXBwZWQgKXtcclxuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmlnZ2VyZG93bicsICgpPT5wcmVzc2VkKCB0cnVlICkgKTtcclxuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmlnZ2VydXAnLCAoKT0+cHJlc3NlZCggZmFsc2UgKSApO1xyXG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ2dyaXBzZG93bicsICgpPT5ncmlwcGVkKCB0cnVlICkgKTtcclxuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICdncmlwc3VwJywgKCk9PmdyaXBwZWQoIGZhbHNlICkgKTtcclxuXHJcbiAgY29uc3QgZ2FtZXBhZCA9IGNvbnRyb2xsZXIuZ2V0R2FtZXBhZCgpO1xyXG4gIGlucHV0U3RhdGUuZXZlbnRzLm9uKCAnb25Db250cm9sbGVySGVsZCcsIGZ1bmN0aW9uKCBpbnB1dCApe1xyXG4gICAgaWYoIGlucHV0Lm9iamVjdCA9PT0gY29udHJvbGxlciApe1xyXG4gICAgICBpZiggZ2FtZXBhZCAmJiBnYW1lcGFkLmhhcHRpY0FjdHVhdG9ycy5sZW5ndGggPiAwICl7XHJcbiAgICAgICAgZ2FtZXBhZC5oYXB0aWNBY3R1YXRvcnNbIDAgXS5wdWxzZSggMC4zLCAwLjMgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxufSIsImltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJbnRlcmFjdGlvbiggaGl0Vm9sdW1lICl7XHJcbiAgY29uc3QgZXZlbnRzID0gbmV3IEVtaXR0ZXIoKTtcclxuXHJcbiAgY29uc3Qgc3RhdGVzID0gbmV3IFdlYWtNYXAoKTtcclxuXHJcbiAgbGV0IGFueUhvdmVyID0gZmFsc2U7XHJcbiAgbGV0IGFueVByZXNzaW5nID0gZmFsc2U7XHJcblxyXG4gIC8vIGNvbnN0IHN0YXRlID0ge1xyXG4gIC8vICAgaG92ZXI6IGZhbHNlLFxyXG4gIC8vICAgcHJlc3NlZDogZmFsc2UsXHJcbiAgLy8gICBncmlwcGVkOiBmYWxzZSxcclxuICAvLyB9O1xyXG5cclxuICBmdW5jdGlvbiBpc01haW5JbnRlcmFjdGlvbiggZ3VpU3RhdGUgKXtcclxuICAgIHJldHVybiAoIGd1aVN0YXRlLmN1cnJlbnRJbnRlcmFjdGlvbiA9PT0gaW50ZXJhY3Rpb24gKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhc01haW5JbnRlcmFjdGlvbiggZ3VpU3RhdGUgKXtcclxuICAgIHJldHVybiAoIGd1aVN0YXRlLmN1cnJlbnRJbnRlcmFjdGlvbiAhPT0gdW5kZWZpbmVkICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRNYWluSW50ZXJhY3Rpb24oIGd1aVN0YXRlICl7XHJcbiAgICBndWlTdGF0ZS5jdXJyZW50SW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNsZWFyTWFpbkludGVyYWN0aW9uKCBndWlTdGF0ZSApe1xyXG4gICAgZ3VpU3RhdGUuY3VycmVudEludGVyYWN0aW9uID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgdFZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZSggaW5wdXRPYmplY3RzICl7XHJcblxyXG4gICAgYW55SG92ZXIgPSBmYWxzZTtcclxuICAgIGFueVByZXNzaW5nID0gZmFsc2U7XHJcblxyXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCBpbnB1dCApe1xyXG5cclxuICAgICAgbGV0IHN0YXRlID0gc3RhdGVzLmdldCggaW5wdXQgKTtcclxuICAgICAgaWYoIHN0YXRlID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgICBzdGF0ZXMuc2V0KCBpbnB1dCwge1xyXG4gICAgICAgICAgaG92ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgcHJlc3NlZDogZmFsc2UsXHJcbiAgICAgICAgICBncmlwcGVkOiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBzdGF0ZSA9IHN0YXRlcy5nZXQoIGlucHV0ICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN0YXRlLmxhc3RIb3ZlciA9IHN0YXRlLmhvdmVyO1xyXG4gICAgICBzdGF0ZS5ob3ZlciA9IGZhbHNlO1xyXG5cclxuICAgICAgbGV0IGhpdFBvaW50O1xyXG4gICAgICBsZXQgaGl0T2JqZWN0O1xyXG5cclxuICAgICAgaWYoIGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoIDw9IDAgKXtcclxuICAgICAgICBzdGF0ZS5ob3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIGhpdFBvaW50ID0gdFZlY3Rvci5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGlucHV0LmN1cnNvci5tYXRyaXhXb3JsZCApLmNsb25lKCk7XHJcbiAgICAgICAgaGl0T2JqZWN0ID0gaW5wdXQuY3Vyc29yO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgaGl0UG9pbnQgPSBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ucG9pbnQ7XHJcbiAgICAgICAgaGl0T2JqZWN0ID0gaW5wdXQuaW50ZXJzZWN0aW9uc1sgMCBdLm9iamVjdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoIGhhc01haW5JbnRlcmFjdGlvbiggaW5wdXQuc3RhdGUgKSA9PT0gZmFsc2UgJiYgaGl0Vm9sdW1lID09PSBoaXRPYmplY3QgKXtcclxuICAgICAgICBzdGF0ZS5ob3ZlciA9IHRydWU7XHJcbiAgICAgICAgYW55SG92ZXIgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgdXNlZCA9IHBlcmZvcm1TdGF0ZUV2ZW50cyggaW5wdXQsIHN0YXRlLCBoaXRPYmplY3QsIGhpdFBvaW50LCAncHJlc3NlZCcsICdvblByZXNzZWQnLCAncHJlc3NpbmcnLCAnb25SZWxlYXNlZCcgKTtcclxuICAgICAgdXNlZCA9IHVzZWQgfHwgcGVyZm9ybVN0YXRlRXZlbnRzKCBpbnB1dCwgc3RhdGUsIGhpdE9iamVjdCwgaGl0UG9pbnQsICdncmlwcGVkJywgJ29uR3JpcHBlZCcsICdncmlwcGluZycsICdvblJlbGVhc2VHcmlwJyApO1xyXG5cclxuICAgICAgaWYoIHVzZWQgPT09IGZhbHNlICYmIGlzTWFpbkludGVyYWN0aW9uKCAgaW5wdXQuc3RhdGUgICkgKXtcclxuICAgICAgICBjbGVhck1haW5JbnRlcmFjdGlvbiggaW5wdXQuc3RhdGUgKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBlcmZvcm1TdGF0ZUV2ZW50cyggaW5wdXQsIHN0YXRlLCBoaXRPYmplY3QsIGhpdFBvaW50LCBzdGF0ZVRvQ2hlY2ssIGNsaWNrTmFtZSwgaG9sZE5hbWUsIHJlbGVhc2VOYW1lICl7XHJcbiAgICBpZiggaW5wdXRbIHN0YXRlVG9DaGVjayBdICYmIHN0YXRlLmhvdmVyICYmIGhhc01haW5JbnRlcmFjdGlvbiggaW5wdXQuc3RhdGUgKSA9PT0gZmFsc2UgKXtcclxuICAgICAgaWYoIHN0YXRlWyBzdGF0ZVRvQ2hlY2sgXSA9PT0gZmFsc2UgKXtcclxuICAgICAgICBzdGF0ZVsgc3RhdGVUb0NoZWNrIF0gPSB0cnVlO1xyXG4gICAgICAgIHNldE1haW5JbnRlcmFjdGlvbiggaW5wdXQuc3RhdGUgKTtcclxuXHJcbiAgICAgICAgZXZlbnRzLmVtaXQoIGNsaWNrTmFtZSwge1xyXG4gICAgICAgICAgaGl0T2JqZWN0LFxyXG4gICAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdCxcclxuICAgICAgICAgIHBvaW50OiBoaXRQb2ludCxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiggaW5wdXRbIHN0YXRlVG9DaGVjayBdID09PSBmYWxzZSAmJiBpc01haW5JbnRlcmFjdGlvbiggaW5wdXQuc3RhdGUgKSApe1xyXG4gICAgICBzdGF0ZVsgc3RhdGVUb0NoZWNrIF0gPSBmYWxzZTtcclxuICAgICAgZXZlbnRzLmVtaXQoIHJlbGVhc2VOYW1lLCB7XHJcbiAgICAgICAgaGl0T2JqZWN0LFxyXG4gICAgICAgIGlucHV0T2JqZWN0OiBpbnB1dC5vYmplY3QsXHJcbiAgICAgICAgcG9pbnQ6IGhpdFBvaW50LFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggc3RhdGVbIHN0YXRlVG9DaGVjayBdICl7XHJcbiAgICAgIGV2ZW50cy5lbWl0KCBob2xkTmFtZSwge1xyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0LFxyXG4gICAgICAgIHBvaW50OiBoaXRQb2ludCxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBhbnlQcmVzc2luZyA9IHRydWU7XHJcblxyXG4gICAgICBpbnB1dC5zdGF0ZS5ldmVudHMuZW1pdCggJ29uQ29udHJvbGxlckhlbGQnLCBpbnB1dCApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdGF0ZVsgc3RhdGVUb0NoZWNrIF07XHJcblxyXG4gIH1cclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSB7XHJcbiAgICBob3ZlcmluZzogKCk9PmFueUhvdmVyLFxyXG4gICAgcHJlc3Npbmc6ICgpPT5hbnlQcmVzc2luZyxcclxuICAgIHVwZGF0ZSxcclxuICAgIGV2ZW50c1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBpbnRlcmFjdGlvbjtcclxufSIsImltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWxpZ25MZWZ0KCBvYmogKXtcclxuICBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuTWVzaCApe1xyXG4gICAgb2JqLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gICAgY29uc3Qgd2lkdGggPSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnggLSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4Lnk7XHJcbiAgICBvYmouZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCwgMCwgMCApO1xyXG4gICAgcmV0dXJuIG9iajtcclxuICB9XHJcbiAgZWxzZSBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuR2VvbWV0cnkgKXtcclxuICAgIG9iai5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgIGNvbnN0IHdpZHRoID0gb2JqLmJvdW5kaW5nQm94Lm1heC54IC0gb2JqLmJvdW5kaW5nQm94Lm1heC55O1xyXG4gICAgb2JqLnRyYW5zbGF0ZSggd2lkdGgsIDAsIDAgKTtcclxuICAgIHJldHVybiBvYmo7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICl7XHJcbiAgY29uc3QgcGFuZWwgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApLCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcclxuICBwYW5lbC5nZW9tZXRyeS50cmFuc2xhdGUoIHdpZHRoICogMC41LCAwLCAwICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHBhbmVsLmdlb21ldHJ5LCBDb2xvcnMuREVGQVVMVF9CQUNLICk7XHJcbiAgcmV0dXJuIHBhbmVsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIGNvbG9yICl7XHJcbiAgY29uc3QgcGFuZWwgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBDT05UUk9MTEVSX0lEX1dJRFRILCBoZWlnaHQsIENPTlRST0xMRVJfSURfREVQVEggKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCBDT05UUk9MTEVSX0lEX1dJRFRIICogMC41LCAwLCAwICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHBhbmVsLmdlb21ldHJ5LCBjb2xvciApO1xyXG4gIHJldHVybiBwYW5lbDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFBBTkVMX1dJRFRIID0gMS4wO1xyXG5leHBvcnQgY29uc3QgUEFORUxfSEVJR0hUID0gMC4wNztcclxuZXhwb3J0IGNvbnN0IFBBTkVMX0RFUFRIID0gMC4wMTtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX1NQQUNJTkcgPSAwLjAwMjtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX01BUkdJTiA9IDAuMDA1O1xyXG5leHBvcnQgY29uc3QgUEFORUxfTEFCRUxfVEVYVF9NQVJHSU4gPSAwLjA2O1xyXG5leHBvcnQgY29uc3QgUEFORUxfVkFMVUVfVEVYVF9NQVJHSU4gPSAwLjAyO1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9XSURUSCA9IDAuMDI7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0RFUFRIID0gMC4wMDU7IiwiaW1wb3J0IFNERlNoYWRlciBmcm9tICd0aHJlZS1ibWZvbnQtdGV4dC9zaGFkZXJzL3NkZic7XHJcbmltcG9ydCBjcmVhdGVHZW9tZXRyeSBmcm9tICd0aHJlZS1ibWZvbnQtdGV4dCc7XHJcbmltcG9ydCBwYXJzZUFTQ0lJIGZyb20gJ3BhcnNlLWJtZm9udC1hc2NpaSc7XHJcblxyXG5pbXBvcnQgKiBhcyBGb250IGZyb20gJy4vZm9udCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWF0ZXJpYWwoIGNvbG9yICl7XHJcblxyXG4gIGNvbnN0IHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xyXG4gIGNvbnN0IGltYWdlID0gRm9udC5pbWFnZSgpO1xyXG4gIHRleHR1cmUuaW1hZ2UgPSBpbWFnZTtcclxuICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLkxpbmVhck1pcE1hcExpbmVhckZpbHRlcjtcclxuICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcclxuICB0ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IHRydWU7XHJcblxyXG4gIC8vICBhbmQgd2hhdCBhYm91dCBhbmlzb3Ryb3BpYyBmaWx0ZXJpbmc/XHJcblxyXG4gIHJldHVybiBuZXcgVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWwoU0RGU2hhZGVyKHtcclxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGNvbG9yOiBjb2xvcixcclxuICAgIG1hcDogdGV4dHVyZVxyXG4gIH0pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0b3IoKXtcclxuXHJcbiAgY29uc3QgZm9udCA9IHBhcnNlQVNDSUkoIEZvbnQuZm50KCkgKTtcclxuXHJcbiAgY29uc3QgY29sb3JNYXRlcmlhbHMgPSB7fTtcclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlVGV4dCggc3RyLCBmb250LCBjb2xvciA9IDB4ZmZmZmZmICl7XHJcblxyXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBjcmVhdGVHZW9tZXRyeSh7XHJcbiAgICAgIHRleHQ6IHN0cixcclxuICAgICAgYWxpZ246ICdsZWZ0JyxcclxuICAgICAgd2lkdGg6IDEwMDAsXHJcbiAgICAgIGZsaXBZOiB0cnVlLFxyXG4gICAgICBmb250XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgY29uc3QgbGF5b3V0ID0gZ2VvbWV0cnkubGF5b3V0O1xyXG5cclxuICAgIGxldCBtYXRlcmlhbCA9IGNvbG9yTWF0ZXJpYWxzWyBjb2xvciBdO1xyXG4gICAgaWYoIG1hdGVyaWFsID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgbWF0ZXJpYWwgPSBjb2xvck1hdGVyaWFsc1sgY29sb3IgXSA9IGNyZWF0ZU1hdGVyaWFsKCBjb2xvciApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBnZW9tZXRyeSwgbWF0ZXJpYWwgKTtcclxuICAgIG1lc2guc2NhbGUubXVsdGlwbHkoIG5ldyBUSFJFRS5WZWN0b3IzKDEsLTEsMSkgKTtcclxuICAgIG1lc2guc2NhbGUubXVsdGlwbHlTY2FsYXIoIDAuMDAxICk7XHJcblxyXG4gICAgbWVzaC5wb3NpdGlvbi55ID0gbGF5b3V0LmhlaWdodCAqIDAuNSAqIDAuMDAxO1xyXG5cclxuICAgIHJldHVybiBtZXNoO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZSggc3RyLCB7IGNvbG9yPTB4ZmZmZmZmIH0gPSB7fSApe1xyXG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgICBsZXQgbWVzaCA9IGNyZWF0ZVRleHQoIHN0ciwgZm9udCwgY29sb3IgKTtcclxuICAgIGdyb3VwLmFkZCggbWVzaCApO1xyXG4gICAgZ3JvdXAubGF5b3V0ID0gbWVzaC5nZW9tZXRyeS5sYXlvdXQ7XHJcblxyXG4gICAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgICBtZXNoLmdlb21ldHJ5LnVwZGF0ZSggc3RyICk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBncm91cDtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBjcmVhdGUsXHJcbiAgICBnZXRNYXRlcmlhbDogKCk9PiBtYXRlcmlhbFxyXG4gIH1cclxuXHJcbn0iLCJpbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBBTkVMID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweGZmZmZmZiwgdmVydGV4Q29sb3JzOiBUSFJFRS5WZXJ0ZXhDb2xvcnMgfSApO1xyXG5leHBvcnQgY29uc3QgTE9DQVRPUiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG5leHBvcnQgY29uc3QgRk9MREVSID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweDAwMDAwMCB9ICk7IiwiaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlU2xpZGVyKCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IDAuMCxcclxuICBtaW4gPSAwLjAsIG1heCA9IDEuMCxcclxuICBzdGVwID0gMC4xLFxyXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxyXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXHJcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEhcclxufSA9IHt9ICl7XHJcblxyXG5cclxuICBjb25zdCBTTElERVJfV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgU0xJREVSX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgU0xJREVSX0RFUFRIID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgYWxwaGE6IDEuMCxcclxuICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXHJcbiAgICBzdGVwOiBzdGVwLFxyXG4gICAgcHJlY2lzaW9uOiAxLFxyXG4gICAgbGlzdGVuOiBmYWxzZSxcclxuICAgIG1pbjogbWluLFxyXG4gICAgbWF4OiBtYXgsXHJcbiAgICBvbkNoYW5nZWRDQjogdW5kZWZpbmVkLFxyXG4gICAgb25GaW5pc2hlZENoYW5nZTogdW5kZWZpbmVkXHJcbiAgfTtcclxuXHJcbiAgc3RhdGUuc3RlcCA9IGdldEltcGxpZWRTdGVwKCBzdGF0ZS52YWx1ZSApO1xyXG4gIHN0YXRlLnByZWNpc2lvbiA9IG51bURlY2ltYWxzKCBzdGF0ZS5zdGVwICk7XHJcbiAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gIC8vICBmaWxsZWQgdm9sdW1lXHJcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggU0xJREVSX1dJRFRILCBTTElERVJfSEVJR0hULCBTTElERVJfREVQVEggKTtcclxuICByZWN0LnRyYW5zbGF0ZShTTElERVJfV0lEVEgqMC41LDAsMCk7XHJcbiAgLy8gTGF5b3V0LmFsaWduTGVmdCggcmVjdCApO1xyXG5cclxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcclxuICBoaXRzY2FuTWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAvLyAgb3V0bGluZSB2b2x1bWVcclxuICBjb25zdCBoaXRzY2FuVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgaGl0c2Nhbk1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XHJcblxyXG4gIGNvbnN0IG91dGxpbmUgPSBuZXcgVEhSRUUuQm94SGVscGVyKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgb3V0bGluZS5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5PVVRMSU5FX0NPTE9SICk7XHJcblxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5ERUZBVUxUX0NPTE9SLCBlbWlzc2l2ZTogQ29sb3JzLkVNSVNTSVZFX0NPTE9SIH0pO1xyXG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xyXG5cclxuICBjb25zdCBlbmRMb2NhdG9yID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggMC4wNSwgMC4wNSwgMC4wNSwgMSwgMSwgMSApLCBTaGFyZWRNYXRlcmlhbHMuTE9DQVRPUiApO1xyXG4gIGVuZExvY2F0b3IucG9zaXRpb24ueCA9IFNMSURFUl9XSURUSDtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZW5kTG9jYXRvciApO1xyXG4gIGVuZExvY2F0b3IudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdCB2YWx1ZUxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBzdGF0ZS52YWx1ZS50b1N0cmluZygpICk7XHJcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX1ZBTFVFX1RFWFRfTUFSR0lOICsgd2lkdGggKiAwLjU7XHJcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGgqMjtcclxuICB2YWx1ZUxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfU0xJREVSICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIG91dGxpbmUsIHZhbHVlTGFiZWwsIGNvbnRyb2xsZXJJRCApO1xyXG5cclxuICBncm91cC5hZGQoIHBhbmVsIClcclxuXHJcbiAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICB1cGRhdGVTbGlkZXIoIHN0YXRlLmFscGhhICk7XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVZhbHVlTGFiZWwoIHZhbHVlICl7XHJcbiAgICB2YWx1ZUxhYmVsLnVwZGF0ZSggcm91bmRUb0RlY2ltYWwoIHN0YXRlLnZhbHVlLCBzdGF0ZS5wcmVjaXNpb24gKS50b1N0cmluZygpICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcbiAgICBpZiggaW50ZXJhY3Rpb24ucHJlc3NpbmcoKSApe1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5JTlRFUkFDVElPTl9DT0xPUiApO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XHJcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9FTUlTU0lWRV9DT0xPUiApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9DT0xPUiApO1xyXG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5FTUlTU0lWRV9DT0xPUiApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlU2xpZGVyKCBhbHBoYSApe1xyXG4gICAgZmlsbGVkVm9sdW1lLnNjYWxlLnggPSBNYXRoLm1heCggYWxwaGEgKiB3aWR0aCwgMC4wMDAwMDEgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZU9iamVjdCggdmFsdWUgKXtcclxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBhbHBoYSApe1xyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRDbGFtcGVkQWxwaGEoIGFscGhhICk7XHJcbiAgICBzdGF0ZS52YWx1ZSA9IGdldFZhbHVlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuICAgIHN0YXRlLnZhbHVlID0gZ2V0U3RlcHBlZFZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUuc3RlcCApO1xyXG4gICAgc3RhdGUudmFsdWUgPSBnZXRDbGFtcGVkVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbGlzdGVuVXBkYXRlKCl7XHJcbiAgICBzdGF0ZS52YWx1ZSA9IGdldFZhbHVlRnJvbU9iamVjdCgpO1xyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldENsYW1wZWRBbHBoYSggc3RhdGUuYWxwaGEgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFZhbHVlRnJvbU9iamVjdCgpe1xyXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKTtcclxuICB9XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBzdGF0ZS5vbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnN0ZXAgPSBmdW5jdGlvbiggc3RlcCApe1xyXG4gICAgc3RhdGUuc3RlcCA9IHN0ZXA7XHJcbiAgICBzdGF0ZS5wcmVjaXNpb24gPSBudW1EZWNpbWFscyggc3RhdGUuc3RlcCApXHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubGlzdGVuID0gZnVuY3Rpb24oKXtcclxuICAgIHN0YXRlLmxpc3RlbiA9IHRydWU7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggaGl0c2NhblZvbHVtZSApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ3ByZXNzaW5nJywgaGFuZGxlUHJlc3MgKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlUHJlc3MoIHsgcG9pbnQgfSA9IHt9ICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbGxlZFZvbHVtZS51cGRhdGVNYXRyaXhXb3JsZCgpO1xyXG4gICAgZW5kTG9jYXRvci51cGRhdGVNYXRyaXhXb3JsZCgpO1xyXG5cclxuICAgIGNvbnN0IGEgPSBuZXcgVEhSRUUuVmVjdG9yMygpLnNldEZyb21NYXRyaXhQb3NpdGlvbiggZmlsbGVkVm9sdW1lLm1hdHJpeFdvcmxkICk7XHJcbiAgICBjb25zdCBiID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGVuZExvY2F0b3IubWF0cml4V29ybGQgKTtcclxuXHJcbiAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gc3RhdGUudmFsdWU7XHJcblxyXG4gICAgdXBkYXRlU3RhdGVGcm9tQWxwaGEoIGdldFBvaW50QWxwaGEoIHBvaW50LCB7YSxifSApICk7XHJcbiAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gICAgdXBkYXRlU2xpZGVyKCBzdGF0ZS5hbHBoYSApO1xyXG4gICAgdXBkYXRlT2JqZWN0KCBzdGF0ZS52YWx1ZSApO1xyXG5cclxuICAgIGlmKCBwcmV2aW91c1ZhbHVlICE9PSBzdGF0ZS52YWx1ZSAmJiBzdGF0ZS5vbkNoYW5nZWRDQiApe1xyXG4gICAgICBzdGF0ZS5vbkNoYW5nZWRDQiggc3RhdGUudmFsdWUgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdyb3VwLmludGVyYWN0aW9uID0gaW50ZXJhY3Rpb247XHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgaGl0c2NhblZvbHVtZSwgcGFuZWwgXTtcclxuXHJcbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgaWYoIHN0YXRlLmxpc3RlbiApe1xyXG4gICAgICBsaXN0ZW5VcGRhdGUoKTtcclxuICAgICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICAgICAgdXBkYXRlU2xpZGVyKCBzdGF0ZS5hbHBoYSApO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBncm91cDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UG9pbnRBbHBoYSggcG9pbnQsIHNlZ21lbnQgKXtcclxuICBjb25zdCBhID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5jb3B5KCBzZWdtZW50LmIgKS5zdWIoIHNlZ21lbnQuYSApO1xyXG4gIGNvbnN0IGIgPSBuZXcgVEhSRUUuVmVjdG9yMygpLmNvcHkoIHBvaW50ICkuc3ViKCBzZWdtZW50LmEgKTtcclxuICBjb25zdCBwcm9qZWN0ZWQgPSBiLnByb2plY3RPblZlY3RvciggYSApO1xyXG5cclxuICBjb25zdCBsZW5ndGggPSBzZWdtZW50LmEuZGlzdGFuY2VUbyggc2VnbWVudC5iICk7XHJcblxyXG4gIGxldCBhbHBoYSA9IHByb2plY3RlZC5sZW5ndGgoKSAvIGxlbmd0aDtcclxuICBpZiggYWxwaGEgPiAxLjAgKXtcclxuICAgIGFscGhhID0gMS4wO1xyXG4gIH1cclxuICBpZiggYWxwaGEgPCAwLjAgKXtcclxuICAgIGFscGhhID0gMC4wO1xyXG4gIH1cclxuICByZXR1cm4gYWxwaGE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxlcnAobWluLCBtYXgsIHZhbHVlKSB7XHJcbiAgcmV0dXJuICgxLXZhbHVlKSptaW4gKyB2YWx1ZSptYXg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hcF9yYW5nZSh2YWx1ZSwgbG93MSwgaGlnaDEsIGxvdzIsIGhpZ2gyKSB7XHJcbiAgICByZXR1cm4gbG93MiArIChoaWdoMiAtIGxvdzIpICogKHZhbHVlIC0gbG93MSkgLyAoaGlnaDEgLSBsb3cxKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2xhbXBlZEFscGhhKCBhbHBoYSApe1xyXG4gIGlmKCBhbHBoYSA+IDEgKXtcclxuICAgIHJldHVybiAxXHJcbiAgfVxyXG4gIGlmKCBhbHBoYSA8IDAgKXtcclxuICAgIHJldHVybiAwO1xyXG4gIH1cclxuICByZXR1cm4gYWxwaGE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENsYW1wZWRWYWx1ZSggdmFsdWUsIG1pbiwgbWF4ICl7XHJcbiAgaWYoIHZhbHVlIDwgbWluICl7XHJcbiAgICByZXR1cm4gbWluO1xyXG4gIH1cclxuICBpZiggdmFsdWUgPiBtYXggKXtcclxuICAgIHJldHVybiBtYXg7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW1wbGllZFN0ZXAoIHZhbHVlICl7XHJcbiAgaWYoIHZhbHVlID09PSAwICl7XHJcbiAgICByZXR1cm4gMTsgLy8gV2hhdCBhcmUgd2UsIHBzeWNoaWNzP1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBIZXkgRG91ZywgY2hlY2sgdGhpcyBvdXQuXHJcbiAgICByZXR1cm4gTWF0aC5wb3coMTAsIE1hdGguZmxvb3IoTWF0aC5sb2coTWF0aC5hYnModmFsdWUpKS9NYXRoLkxOMTApKS8xMDtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFZhbHVlRnJvbUFscGhhKCBhbHBoYSwgbWluLCBtYXggKXtcclxuICByZXR1cm4gbWFwX3JhbmdlKCBhbHBoYSwgMC4wLCAxLjAsIG1pbiwgbWF4IClcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QWxwaGFGcm9tVmFsdWUoIHZhbHVlLCBtaW4sIG1heCApe1xyXG4gIHJldHVybiBtYXBfcmFuZ2UoIHZhbHVlLCBtaW4sIG1heCwgMC4wLCAxLjAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U3RlcHBlZFZhbHVlKCB2YWx1ZSwgc3RlcCApe1xyXG4gIGlmKCB2YWx1ZSAlIHN0ZXAgIT0gMCkge1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQoIHZhbHVlIC8gc3RlcCApICogc3RlcDtcclxuICB9XHJcbiAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBudW1EZWNpbWFscyh4KSB7XHJcbiAgeCA9IHgudG9TdHJpbmcoKTtcclxuICBpZiAoeC5pbmRleE9mKCcuJykgPiAtMSkge1xyXG4gICAgcmV0dXJuIHgubGVuZ3RoIC0geC5pbmRleE9mKCcuJykgLSAxO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJvdW5kVG9EZWNpbWFsKHZhbHVlLCBkZWNpbWFscykge1xyXG4gIGNvbnN0IHRlblRvID0gTWF0aC5wb3coMTAsIGRlY2ltYWxzKTtcclxuICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAqIHRlblRvKSAvIHRlblRvO1xyXG59IiwiaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVRleHRMYWJlbCggdGV4dENyZWF0b3IsIHN0ciwgd2lkdGggPSAwLjQsIGRlcHRoID0gMC4wMjksIGZnQ29sb3IgPSAweGZmZmZmZiwgYmdDb2xvciA9IENvbG9ycy5ERUZBVUxUX0JBQ0sgKXtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBjb25zdCBpbnRlcm5hbFBvc2l0aW9uaW5nID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgZ3JvdXAuYWRkKCBpbnRlcm5hbFBvc2l0aW9uaW5nICk7XHJcblxyXG4gIGNvbnN0IHRleHQgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHN0ciwgeyBjb2xvcjogZmdDb2xvciB9ICk7XHJcbiAgaW50ZXJuYWxQb3NpdGlvbmluZy5hZGQoIHRleHQgKTtcclxuXHJcbiAgZ3JvdXAuc2V0U3RyaW5nID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgdGV4dC51cGRhdGUoIHN0ci50b1N0cmluZygpICk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuc2V0TnVtYmVyID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgdGV4dC51cGRhdGUoIHN0ci50b0ZpeGVkKDIpICk7XHJcbiAgfTtcclxuXHJcbiAgdGV4dC5wb3NpdGlvbi56ID0gMC4wMTVcclxuXHJcbiAgY29uc3QgYmFja0JvdW5kcyA9IDAuMDE7XHJcbiAgY29uc3QgbWFyZ2luID0gMC4wMTtcclxuICBjb25zdCB0b3RhbFdpZHRoID0gd2lkdGg7XHJcbiAgY29uc3QgdG90YWxIZWlnaHQgPSAwLjA0ICsgbWFyZ2luICogMjtcclxuICBjb25zdCBsYWJlbEJhY2tHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggdG90YWxXaWR0aCwgdG90YWxIZWlnaHQsIGRlcHRoLCAxLCAxLCAxICk7XHJcbiAgbGFiZWxCYWNrR2VvbWV0cnkuYXBwbHlNYXRyaXgoIG5ldyBUSFJFRS5NYXRyaXg0KCkubWFrZVRyYW5zbGF0aW9uKCB0b3RhbFdpZHRoICogMC41IC0gbWFyZ2luLCAwLCAwICkgKTtcclxuXHJcbiAgY29uc3QgbGFiZWxCYWNrTWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBsYWJlbEJhY2tHZW9tZXRyeSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGxhYmVsQmFja01lc2guZ2VvbWV0cnksIGJnQ29sb3IgKTtcclxuXHJcbiAgbGFiZWxCYWNrTWVzaC5wb3NpdGlvbi55ID0gMC4wMztcclxuICAvLyBsYWJlbEJhY2tNZXNoLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcclxuICBpbnRlcm5hbFBvc2l0aW9uaW5nLmFkZCggbGFiZWxCYWNrTWVzaCApO1xyXG4gIGludGVybmFsUG9zaXRpb25pbmcucG9zaXRpb24ueSA9IC10b3RhbEhlaWdodCAqIDAuNTtcclxuXHJcbiAgLy8gbGFiZWxHcm91cC5wb3NpdGlvbi54ID0gbGFiZWxCb3VuZHMud2lkdGggKiAwLjU7XHJcbiAgLy8gbGFiZWxHcm91cC5wb3NpdGlvbi55ID0gbGFiZWxCb3VuZHMuaGVpZ2h0ICogMC41O1xyXG5cclxuICBncm91cC5iYWNrID0gbGFiZWxCYWNrTWVzaDtcclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwidmFyIHN0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcblxubW9kdWxlLmV4cG9ydHMgPSBhbkFycmF5XG5cbmZ1bmN0aW9uIGFuQXJyYXkoYXJyKSB7XG4gIHJldHVybiAoXG4gICAgICAgYXJyLkJZVEVTX1BFUl9FTEVNRU5UXG4gICAgJiYgc3RyLmNhbGwoYXJyLmJ1ZmZlcikgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSdcbiAgICB8fCBBcnJheS5pc0FycmF5KGFycilcbiAgKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBudW10eXBlKG51bSwgZGVmKSB7XG5cdHJldHVybiB0eXBlb2YgbnVtID09PSAnbnVtYmVyJ1xuXHRcdD8gbnVtIFxuXHRcdDogKHR5cGVvZiBkZWYgPT09ICdudW1iZXInID8gZGVmIDogMClcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGR0eXBlKSB7XG4gIHN3aXRjaCAoZHR5cGUpIHtcbiAgICBjYXNlICdpbnQ4JzpcbiAgICAgIHJldHVybiBJbnQ4QXJyYXlcbiAgICBjYXNlICdpbnQxNic6XG4gICAgICByZXR1cm4gSW50MTZBcnJheVxuICAgIGNhc2UgJ2ludDMyJzpcbiAgICAgIHJldHVybiBJbnQzMkFycmF5XG4gICAgY2FzZSAndWludDgnOlxuICAgICAgcmV0dXJuIFVpbnQ4QXJyYXlcbiAgICBjYXNlICd1aW50MTYnOlxuICAgICAgcmV0dXJuIFVpbnQxNkFycmF5XG4gICAgY2FzZSAndWludDMyJzpcbiAgICAgIHJldHVybiBVaW50MzJBcnJheVxuICAgIGNhc2UgJ2Zsb2F0MzInOlxuICAgICAgcmV0dXJuIEZsb2F0MzJBcnJheVxuICAgIGNhc2UgJ2Zsb2F0NjQnOlxuICAgICAgcmV0dXJuIEZsb2F0NjRBcnJheVxuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheVxuICAgIGNhc2UgJ3VpbnQ4X2NsYW1wZWQnOlxuICAgICAgcmV0dXJuIFVpbnQ4Q2xhbXBlZEFycmF5XG4gIH1cbn1cbiIsIi8qZXNsaW50IG5ldy1jYXA6MCovXG52YXIgZHR5cGUgPSByZXF1aXJlKCdkdHlwZScpXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW5WZXJ0ZXhEYXRhXG5mdW5jdGlvbiBmbGF0dGVuVmVydGV4RGF0YSAoZGF0YSwgb3V0cHV0LCBvZmZzZXQpIHtcbiAgaWYgKCFkYXRhKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHNwZWNpZnkgZGF0YSBhcyBmaXJzdCBwYXJhbWV0ZXInKVxuICBvZmZzZXQgPSArKG9mZnNldCB8fCAwKSB8IDBcblxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBBcnJheS5pc0FycmF5KGRhdGFbMF0pKSB7XG4gICAgdmFyIGRpbSA9IGRhdGFbMF0ubGVuZ3RoXG4gICAgdmFyIGxlbmd0aCA9IGRhdGEubGVuZ3RoICogZGltXG5cbiAgICAvLyBubyBvdXRwdXQgc3BlY2lmaWVkLCBjcmVhdGUgYSBuZXcgdHlwZWQgYXJyYXlcbiAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgb3V0cHV0ID0gbmV3IChkdHlwZShvdXRwdXQgfHwgJ2Zsb2F0MzInKSkobGVuZ3RoICsgb2Zmc2V0KVxuICAgIH1cblxuICAgIHZhciBkc3RMZW5ndGggPSBvdXRwdXQubGVuZ3RoIC0gb2Zmc2V0XG4gICAgaWYgKGxlbmd0aCAhPT0gZHN0TGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZSBsZW5ndGggJyArIGxlbmd0aCArICcgKCcgKyBkaW0gKyAneCcgKyBkYXRhLmxlbmd0aCArICcpJyArXG4gICAgICAgICcgZG9lcyBub3QgbWF0Y2ggZGVzdGluYXRpb24gbGVuZ3RoICcgKyBkc3RMZW5ndGgpXG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGsgPSBvZmZzZXQ7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRpbTsgaisrKSB7XG4gICAgICAgIG91dHB1dFtrKytdID0gZGF0YVtpXVtqXVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gbm8gb3V0cHV0LCBjcmVhdGUgYSBuZXcgb25lXG4gICAgICB2YXIgQ3RvciA9IGR0eXBlKG91dHB1dCB8fCAnZmxvYXQzMicpXG4gICAgICBpZiAob2Zmc2V0ID09PSAwKSB7XG4gICAgICAgIG91dHB1dCA9IG5ldyBDdG9yKGRhdGEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQgPSBuZXcgQ3RvcihkYXRhLmxlbmd0aCArIG9mZnNldClcbiAgICAgICAgb3V0cHV0LnNldChkYXRhLCBvZmZzZXQpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHN0b3JlIG91dHB1dCBpbiBleGlzdGluZyBhcnJheVxuICAgICAgb3V0cHV0LnNldChkYXRhLCBvZmZzZXQpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dHB1dFxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21waWxlKHByb3BlcnR5KSB7XG5cdGlmICghcHJvcGVydHkgfHwgdHlwZW9mIHByb3BlcnR5ICE9PSAnc3RyaW5nJylcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ211c3Qgc3BlY2lmeSBwcm9wZXJ0eSBmb3IgaW5kZXhvZiBzZWFyY2gnKVxuXG5cdHJldHVybiBuZXcgRnVuY3Rpb24oJ2FycmF5JywgJ3ZhbHVlJywgJ3N0YXJ0JywgW1xuXHRcdCdzdGFydCA9IHN0YXJ0IHx8IDAnLFxuXHRcdCdmb3IgKHZhciBpPXN0YXJ0OyBpPGFycmF5Lmxlbmd0aDsgaSsrKScsXG5cdFx0JyAgaWYgKGFycmF5W2ldW1wiJyArIHByb3BlcnR5ICsnXCJdID09PSB2YWx1ZSknLFxuXHRcdCcgICAgICByZXR1cm4gaScsXG5cdFx0J3JldHVybiAtMSdcblx0XS5qb2luKCdcXG4nKSlcbn0iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiIsInZhciB3b3JkV3JhcCA9IHJlcXVpcmUoJ3dvcmQtd3JhcHBlcicpXG52YXIgeHRlbmQgPSByZXF1aXJlKCd4dGVuZCcpXG52YXIgZmluZENoYXIgPSByZXF1aXJlKCdpbmRleG9mLXByb3BlcnR5JykoJ2lkJylcbnZhciBudW1iZXIgPSByZXF1aXJlKCdhcy1udW1iZXInKVxuXG52YXIgWF9IRUlHSFRTID0gWyd4JywgJ2UnLCAnYScsICdvJywgJ24nLCAncycsICdyJywgJ2MnLCAndScsICdtJywgJ3YnLCAndycsICd6J11cbnZhciBNX1dJRFRIUyA9IFsnbScsICd3J11cbnZhciBDQVBfSEVJR0hUUyA9IFsnSCcsICdJJywgJ04nLCAnRScsICdGJywgJ0snLCAnTCcsICdUJywgJ1UnLCAnVicsICdXJywgJ1gnLCAnWScsICdaJ11cblxuXG52YXIgVEFCX0lEID0gJ1xcdCcuY2hhckNvZGVBdCgwKVxudmFyIFNQQUNFX0lEID0gJyAnLmNoYXJDb2RlQXQoMClcbnZhciBBTElHTl9MRUZUID0gMCwgXG4gICAgQUxJR05fQ0VOVEVSID0gMSwgXG4gICAgQUxJR05fUklHSFQgPSAyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTGF5b3V0KG9wdCkge1xuICByZXR1cm4gbmV3IFRleHRMYXlvdXQob3B0KVxufVxuXG5mdW5jdGlvbiBUZXh0TGF5b3V0KG9wdCkge1xuICB0aGlzLmdseXBocyA9IFtdXG4gIHRoaXMuX21lYXN1cmUgPSB0aGlzLmNvbXB1dGVNZXRyaWNzLmJpbmQodGhpcylcbiAgdGhpcy51cGRhdGUob3B0KVxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvcHQpIHtcbiAgb3B0ID0geHRlbmQoe1xuICAgIG1lYXN1cmU6IHRoaXMuX21lYXN1cmVcbiAgfSwgb3B0KVxuICB0aGlzLl9vcHQgPSBvcHRcbiAgdGhpcy5fb3B0LnRhYlNpemUgPSBudW1iZXIodGhpcy5fb3B0LnRhYlNpemUsIDQpXG5cbiAgaWYgKCFvcHQuZm9udClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ211c3QgcHJvdmlkZSBhIHZhbGlkIGJpdG1hcCBmb250JylcblxuICB2YXIgZ2x5cGhzID0gdGhpcy5nbHlwaHNcbiAgdmFyIHRleHQgPSBvcHQudGV4dHx8JycgXG4gIHZhciBmb250ID0gb3B0LmZvbnRcbiAgdGhpcy5fc2V0dXBTcGFjZUdseXBocyhmb250KVxuICBcbiAgdmFyIGxpbmVzID0gd29yZFdyYXAubGluZXModGV4dCwgb3B0KVxuICB2YXIgbWluV2lkdGggPSBvcHQud2lkdGggfHwgMFxuXG4gIC8vY2xlYXIgZ2x5cGhzXG4gIGdseXBocy5sZW5ndGggPSAwXG5cbiAgLy9nZXQgbWF4IGxpbmUgd2lkdGhcbiAgdmFyIG1heExpbmVXaWR0aCA9IGxpbmVzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBsaW5lKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KHByZXYsIGxpbmUud2lkdGgsIG1pbldpZHRoKVxuICB9LCAwKVxuXG4gIC8vdGhlIHBlbiBwb3NpdGlvblxuICB2YXIgeCA9IDBcbiAgdmFyIHkgPSAwXG4gIHZhciBsaW5lSGVpZ2h0ID0gbnVtYmVyKG9wdC5saW5lSGVpZ2h0LCBmb250LmNvbW1vbi5saW5lSGVpZ2h0KVxuICB2YXIgYmFzZWxpbmUgPSBmb250LmNvbW1vbi5iYXNlXG4gIHZhciBkZXNjZW5kZXIgPSBsaW5lSGVpZ2h0LWJhc2VsaW5lXG4gIHZhciBsZXR0ZXJTcGFjaW5nID0gb3B0LmxldHRlclNwYWNpbmcgfHwgMFxuICB2YXIgaGVpZ2h0ID0gbGluZUhlaWdodCAqIGxpbmVzLmxlbmd0aCAtIGRlc2NlbmRlclxuICB2YXIgYWxpZ24gPSBnZXRBbGlnblR5cGUodGhpcy5fb3B0LmFsaWduKVxuXG4gIC8vZHJhdyB0ZXh0IGFsb25nIGJhc2VsaW5lXG4gIHkgLT0gaGVpZ2h0XG4gIFxuICAvL3RoZSBtZXRyaWNzIGZvciB0aGlzIHRleHQgbGF5b3V0XG4gIHRoaXMuX3dpZHRoID0gbWF4TGluZVdpZHRoXG4gIHRoaXMuX2hlaWdodCA9IGhlaWdodFxuICB0aGlzLl9kZXNjZW5kZXIgPSBsaW5lSGVpZ2h0IC0gYmFzZWxpbmVcbiAgdGhpcy5fYmFzZWxpbmUgPSBiYXNlbGluZVxuICB0aGlzLl94SGVpZ2h0ID0gZ2V0WEhlaWdodChmb250KVxuICB0aGlzLl9jYXBIZWlnaHQgPSBnZXRDYXBIZWlnaHQoZm9udClcbiAgdGhpcy5fbGluZUhlaWdodCA9IGxpbmVIZWlnaHRcbiAgdGhpcy5fYXNjZW5kZXIgPSBsaW5lSGVpZ2h0IC0gZGVzY2VuZGVyIC0gdGhpcy5feEhlaWdodFxuICAgIFxuICAvL2xheW91dCBlYWNoIGdseXBoXG4gIHZhciBzZWxmID0gdGhpc1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUsIGxpbmVJbmRleCkge1xuICAgIHZhciBzdGFydCA9IGxpbmUuc3RhcnRcbiAgICB2YXIgZW5kID0gbGluZS5lbmRcbiAgICB2YXIgbGluZVdpZHRoID0gbGluZS53aWR0aFxuICAgIHZhciBsYXN0R2x5cGhcbiAgICBcbiAgICAvL2ZvciBlYWNoIGdseXBoIGluIHRoYXQgbGluZS4uLlxuICAgIGZvciAodmFyIGk9c3RhcnQ7IGk8ZW5kOyBpKyspIHtcbiAgICAgIHZhciBpZCA9IHRleHQuY2hhckNvZGVBdChpKVxuICAgICAgdmFyIGdseXBoID0gc2VsZi5nZXRHbHlwaChmb250LCBpZClcbiAgICAgIGlmIChnbHlwaCkge1xuICAgICAgICBpZiAobGFzdEdseXBoKSBcbiAgICAgICAgICB4ICs9IGdldEtlcm5pbmcoZm9udCwgbGFzdEdseXBoLmlkLCBnbHlwaC5pZClcblxuICAgICAgICB2YXIgdHggPSB4XG4gICAgICAgIGlmIChhbGlnbiA9PT0gQUxJR05fQ0VOVEVSKSBcbiAgICAgICAgICB0eCArPSAobWF4TGluZVdpZHRoLWxpbmVXaWR0aCkvMlxuICAgICAgICBlbHNlIGlmIChhbGlnbiA9PT0gQUxJR05fUklHSFQpXG4gICAgICAgICAgdHggKz0gKG1heExpbmVXaWR0aC1saW5lV2lkdGgpXG5cbiAgICAgICAgZ2x5cGhzLnB1c2goe1xuICAgICAgICAgIHBvc2l0aW9uOiBbdHgsIHldLFxuICAgICAgICAgIGRhdGE6IGdseXBoLFxuICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgIGxpbmU6IGxpbmVJbmRleFxuICAgICAgICB9KSAgXG5cbiAgICAgICAgLy9tb3ZlIHBlbiBmb3J3YXJkXG4gICAgICAgIHggKz0gZ2x5cGgueGFkdmFuY2UgKyBsZXR0ZXJTcGFjaW5nXG4gICAgICAgIGxhc3RHbHlwaCA9IGdseXBoXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9uZXh0IGxpbmUgZG93blxuICAgIHkgKz0gbGluZUhlaWdodFxuICAgIHggPSAwXG4gIH0pXG4gIHRoaXMuX2xpbmVzVG90YWwgPSBsaW5lcy5sZW5ndGg7XG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLl9zZXR1cFNwYWNlR2x5cGhzID0gZnVuY3Rpb24oZm9udCkge1xuICAvL1RoZXNlIGFyZSBmYWxsYmFja3MsIHdoZW4gdGhlIGZvbnQgZG9lc24ndCBpbmNsdWRlXG4gIC8vJyAnIG9yICdcXHQnIGdseXBoc1xuICB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGggPSBudWxsXG4gIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGggPSBudWxsXG5cbiAgaWYgKCFmb250LmNoYXJzIHx8IGZvbnQuY2hhcnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVyblxuXG4gIC8vdHJ5IHRvIGdldCBzcGFjZSBnbHlwaFxuICAvL3RoZW4gZmFsbCBiYWNrIHRvIHRoZSAnbScgb3IgJ3cnIGdseXBoc1xuICAvL3RoZW4gZmFsbCBiYWNrIHRvIHRoZSBmaXJzdCBnbHlwaCBhdmFpbGFibGVcbiAgdmFyIHNwYWNlID0gZ2V0R2x5cGhCeUlkKGZvbnQsIFNQQUNFX0lEKSBcbiAgICAgICAgICB8fCBnZXRNR2x5cGgoZm9udCkgXG4gICAgICAgICAgfHwgZm9udC5jaGFyc1swXVxuXG4gIC8vYW5kIGNyZWF0ZSBhIGZhbGxiYWNrIGZvciB0YWJcbiAgdmFyIHRhYldpZHRoID0gdGhpcy5fb3B0LnRhYlNpemUgKiBzcGFjZS54YWR2YW5jZVxuICB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGggPSBzcGFjZVxuICB0aGlzLl9mYWxsYmFja1RhYkdseXBoID0geHRlbmQoc3BhY2UsIHtcbiAgICB4OiAwLCB5OiAwLCB4YWR2YW5jZTogdGFiV2lkdGgsIGlkOiBUQUJfSUQsIFxuICAgIHhvZmZzZXQ6IDAsIHlvZmZzZXQ6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDBcbiAgfSlcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuZ2V0R2x5cGggPSBmdW5jdGlvbihmb250LCBpZCkge1xuICB2YXIgZ2x5cGggPSBnZXRHbHlwaEJ5SWQoZm9udCwgaWQpXG4gIGlmIChnbHlwaClcbiAgICByZXR1cm4gZ2x5cGhcbiAgZWxzZSBpZiAoaWQgPT09IFRBQl9JRCkgXG4gICAgcmV0dXJuIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGhcbiAgZWxzZSBpZiAoaWQgPT09IFNQQUNFX0lEKSBcbiAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tTcGFjZUdseXBoXG4gIHJldHVybiBudWxsXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLmNvbXB1dGVNZXRyaWNzID0gZnVuY3Rpb24odGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpIHtcbiAgdmFyIGxldHRlclNwYWNpbmcgPSB0aGlzLl9vcHQubGV0dGVyU3BhY2luZyB8fCAwXG4gIHZhciBmb250ID0gdGhpcy5fb3B0LmZvbnRcbiAgdmFyIGN1clBlbiA9IDBcbiAgdmFyIGN1cldpZHRoID0gMFxuICB2YXIgY291bnQgPSAwXG4gIHZhciBnbHlwaFxuICB2YXIgbGFzdEdseXBoXG5cbiAgaWYgKCFmb250LmNoYXJzIHx8IGZvbnQuY2hhcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgIGVuZDogc3RhcnQsXG4gICAgICB3aWR0aDogMFxuICAgIH1cbiAgfVxuXG4gIGVuZCA9IE1hdGgubWluKHRleHQubGVuZ3RoLCBlbmQpXG4gIGZvciAodmFyIGk9c3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHZhciBpZCA9IHRleHQuY2hhckNvZGVBdChpKVxuICAgIHZhciBnbHlwaCA9IHRoaXMuZ2V0R2x5cGgoZm9udCwgaWQpXG5cbiAgICBpZiAoZ2x5cGgpIHtcbiAgICAgIC8vbW92ZSBwZW4gZm9yd2FyZFxuICAgICAgdmFyIHhvZmYgPSBnbHlwaC54b2Zmc2V0XG4gICAgICB2YXIga2VybiA9IGxhc3RHbHlwaCA/IGdldEtlcm5pbmcoZm9udCwgbGFzdEdseXBoLmlkLCBnbHlwaC5pZCkgOiAwXG4gICAgICBjdXJQZW4gKz0ga2VyblxuXG4gICAgICB2YXIgbmV4dFBlbiA9IGN1clBlbiArIGdseXBoLnhhZHZhbmNlICsgbGV0dGVyU3BhY2luZ1xuICAgICAgdmFyIG5leHRXaWR0aCA9IGN1clBlbiArIGdseXBoLndpZHRoXG5cbiAgICAgIC8vd2UndmUgaGl0IG91ciBsaW1pdDsgd2UgY2FuJ3QgbW92ZSBvbnRvIHRoZSBuZXh0IGdseXBoXG4gICAgICBpZiAobmV4dFdpZHRoID49IHdpZHRoIHx8IG5leHRQZW4gPj0gd2lkdGgpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vb3RoZXJ3aXNlIGNvbnRpbnVlIGFsb25nIG91ciBsaW5lXG4gICAgICBjdXJQZW4gPSBuZXh0UGVuXG4gICAgICBjdXJXaWR0aCA9IG5leHRXaWR0aFxuICAgICAgbGFzdEdseXBoID0gZ2x5cGhcbiAgICB9XG4gICAgY291bnQrK1xuICB9XG4gIFxuICAvL21ha2Ugc3VyZSByaWdodG1vc3QgZWRnZSBsaW5lcyB1cCB3aXRoIHJlbmRlcmVkIGdseXBoc1xuICBpZiAobGFzdEdseXBoKVxuICAgIGN1cldpZHRoICs9IGxhc3RHbHlwaC54b2Zmc2V0XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydDogc3RhcnQsXG4gICAgZW5kOiBzdGFydCArIGNvdW50LFxuICAgIHdpZHRoOiBjdXJXaWR0aFxuICB9XG59XG5cbi8vZ2V0dGVycyBmb3IgdGhlIHByaXZhdGUgdmFyc1xuO1snd2lkdGgnLCAnaGVpZ2h0JywgXG4gICdkZXNjZW5kZXInLCAnYXNjZW5kZXInLFxuICAneEhlaWdodCcsICdiYXNlbGluZScsXG4gICdjYXBIZWlnaHQnLFxuICAnbGluZUhlaWdodCcgXS5mb3JFYWNoKGFkZEdldHRlcilcblxuZnVuY3Rpb24gYWRkR2V0dGVyKG5hbWUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRleHRMYXlvdXQucHJvdG90eXBlLCBuYW1lLCB7XG4gICAgZ2V0OiB3cmFwcGVyKG5hbWUpLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxufVxuXG4vL2NyZWF0ZSBsb29rdXBzIGZvciBwcml2YXRlIHZhcnNcbmZ1bmN0aW9uIHdyYXBwZXIobmFtZSkge1xuICByZXR1cm4gKG5ldyBGdW5jdGlvbihbXG4gICAgJ3JldHVybiBmdW5jdGlvbiAnK25hbWUrJygpIHsnLFxuICAgICcgIHJldHVybiB0aGlzLl8nK25hbWUsXG4gICAgJ30nXG4gIF0uam9pbignXFxuJykpKSgpXG59XG5cbmZ1bmN0aW9uIGdldEdseXBoQnlJZChmb250LCBpZCkge1xuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIG51bGxcblxuICB2YXIgZ2x5cGhJZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgaWYgKGdseXBoSWR4ID49IDApXG4gICAgcmV0dXJuIGZvbnQuY2hhcnNbZ2x5cGhJZHhdXG4gIHJldHVybiBudWxsXG59XG5cbmZ1bmN0aW9uIGdldFhIZWlnaHQoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8WF9IRUlHSFRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gWF9IRUlHSFRTW2ldLmNoYXJDb2RlQXQoMClcbiAgICB2YXIgaWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gICAgaWYgKGlkeCA+PSAwKSBcbiAgICAgIHJldHVybiBmb250LmNoYXJzW2lkeF0uaGVpZ2h0XG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0TUdseXBoKGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPE1fV0lEVEhTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gTV9XSURUSFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XVxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldENhcEhlaWdodChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxDQVBfSEVJR0hUUy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZCA9IENBUF9IRUlHSFRTW2ldLmNoYXJDb2RlQXQoMClcbiAgICB2YXIgaWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gICAgaWYgKGlkeCA+PSAwKSBcbiAgICAgIHJldHVybiBmb250LmNoYXJzW2lkeF0uaGVpZ2h0XG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0S2VybmluZyhmb250LCBsZWZ0LCByaWdodCkge1xuICBpZiAoIWZvbnQua2VybmluZ3MgfHwgZm9udC5rZXJuaW5ncy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIDBcblxuICB2YXIgdGFibGUgPSBmb250Lmtlcm5pbmdzXG4gIGZvciAodmFyIGk9MDsgaTx0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXJuID0gdGFibGVbaV1cbiAgICBpZiAoa2Vybi5maXJzdCA9PT0gbGVmdCAmJiBrZXJuLnNlY29uZCA9PT0gcmlnaHQpXG4gICAgICByZXR1cm4ga2Vybi5hbW91bnRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRBbGlnblR5cGUoYWxpZ24pIHtcbiAgaWYgKGFsaWduID09PSAnY2VudGVyJylcbiAgICByZXR1cm4gQUxJR05fQ0VOVEVSXG4gIGVsc2UgaWYgKGFsaWduID09PSAncmlnaHQnKVxuICAgIHJldHVybiBBTElHTl9SSUdIVFxuICByZXR1cm4gQUxJR05fTEVGVFxufSIsIid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VCTUZvbnRBc2NpaShkYXRhKSB7XG4gIGlmICghZGF0YSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGRhdGEgcHJvdmlkZWQnKVxuICBkYXRhID0gZGF0YS50b1N0cmluZygpLnRyaW0oKVxuXG4gIHZhciBvdXRwdXQgPSB7XG4gICAgcGFnZXM6IFtdLFxuICAgIGNoYXJzOiBbXSxcbiAgICBrZXJuaW5nczogW11cbiAgfVxuXG4gIHZhciBsaW5lcyA9IGRhdGEuc3BsaXQoL1xcclxcbj98XFxuL2cpXG5cbiAgaWYgKGxpbmVzLmxlbmd0aCA9PT0gMClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGRhdGEgaW4gQk1Gb250IGZpbGUnKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbGluZURhdGEgPSBzcGxpdExpbmUobGluZXNbaV0sIGkpXG4gICAgaWYgKCFsaW5lRGF0YSkgLy9za2lwIGVtcHR5IGxpbmVzXG4gICAgICBjb250aW51ZVxuXG4gICAgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ3BhZ2UnKSB7XG4gICAgICBpZiAodHlwZW9mIGxpbmVEYXRhLmRhdGEuaWQgIT09ICdudW1iZXInKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbGZvcm1lZCBmaWxlIGF0IGxpbmUgJyArIGkgKyAnIC0tIG5lZWRzIHBhZ2UgaWQ9TicpXG4gICAgICBpZiAodHlwZW9mIGxpbmVEYXRhLmRhdGEuZmlsZSAhPT0gJ3N0cmluZycpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWFsZm9ybWVkIGZpbGUgYXQgbGluZSAnICsgaSArICcgLS0gbmVlZHMgcGFnZSBmaWxlPVwicGF0aFwiJylcbiAgICAgIG91dHB1dC5wYWdlc1tsaW5lRGF0YS5kYXRhLmlkXSA9IGxpbmVEYXRhLmRhdGEuZmlsZVxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAnY2hhcnMnIHx8IGxpbmVEYXRhLmtleSA9PT0gJ2tlcm5pbmdzJykge1xuICAgICAgLy8uLi4gZG8gbm90aGluZyBmb3IgdGhlc2UgdHdvIC4uLlxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAnY2hhcicpIHtcbiAgICAgIG91dHB1dC5jaGFycy5wdXNoKGxpbmVEYXRhLmRhdGEpXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdrZXJuaW5nJykge1xuICAgICAgb3V0cHV0Lmtlcm5pbmdzLnB1c2gobGluZURhdGEuZGF0YSlcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0W2xpbmVEYXRhLmtleV0gPSBsaW5lRGF0YS5kYXRhXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dHB1dFxufVxuXG5mdW5jdGlvbiBzcGxpdExpbmUobGluZSwgaWR4KSB7XG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UoL1xcdCsvZywgJyAnKS50cmltKClcbiAgaWYgKCFsaW5lKVxuICAgIHJldHVybiBudWxsXG5cbiAgdmFyIHNwYWNlID0gbGluZS5pbmRleE9mKCcgJylcbiAgaWYgKHNwYWNlID09PSAtMSkgXG4gICAgdGhyb3cgbmV3IEVycm9yKFwibm8gbmFtZWQgcm93IGF0IGxpbmUgXCIgKyBpZHgpXG5cbiAgdmFyIGtleSA9IGxpbmUuc3Vic3RyaW5nKDAsIHNwYWNlKVxuXG4gIGxpbmUgPSBsaW5lLnN1YnN0cmluZyhzcGFjZSArIDEpXG4gIC8vY2xlYXIgXCJsZXR0ZXJcIiBmaWVsZCBhcyBpdCBpcyBub24tc3RhbmRhcmQgYW5kXG4gIC8vcmVxdWlyZXMgYWRkaXRpb25hbCBjb21wbGV4aXR5IHRvIHBhcnNlIFwiIC8gPSBzeW1ib2xzXG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UoL2xldHRlcj1bXFwnXFxcIl1cXFMrW1xcJ1xcXCJdL2dpLCAnJykgIFxuICBsaW5lID0gbGluZS5zcGxpdChcIj1cIilcbiAgbGluZSA9IGxpbmUubWFwKGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIudHJpbSgpLm1hdGNoKCgvKFwiLio/XCJ8W15cIlxcc10rKSsoPz1cXHMqfFxccyokKS9nKSlcbiAgfSlcblxuICB2YXIgZGF0YSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkdCA9IGxpbmVbaV1cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAga2V5OiBkdFswXSxcbiAgICAgICAgZGF0YTogXCJcIlxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGkgPT09IGxpbmUubGVuZ3RoIC0gMSkge1xuICAgICAgZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGEgPSBwYXJzZURhdGEoZHRbMF0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRhID0gcGFyc2VEYXRhKGR0WzBdKVxuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAga2V5OiBkdFsxXSxcbiAgICAgICAgZGF0YTogXCJcIlxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0ID0ge1xuICAgIGtleToga2V5LFxuICAgIGRhdGE6IHt9XG4gIH1cblxuICBkYXRhLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgIG91dC5kYXRhW3Yua2V5XSA9IHYuZGF0YTtcbiAgfSlcblxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGF0YShkYXRhKSB7XG4gIGlmICghZGF0YSB8fCBkYXRhLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gXCJcIlxuXG4gIGlmIChkYXRhLmluZGV4T2YoJ1wiJykgPT09IDAgfHwgZGF0YS5pbmRleE9mKFwiJ1wiKSA9PT0gMClcbiAgICByZXR1cm4gZGF0YS5zdWJzdHJpbmcoMSwgZGF0YS5sZW5ndGggLSAxKVxuICBpZiAoZGF0YS5pbmRleE9mKCcsJykgIT09IC0xKVxuICAgIHJldHVybiBwYXJzZUludExpc3QoZGF0YSlcbiAgcmV0dXJuIHBhcnNlSW50KGRhdGEsIDEwKVxufVxuXG5mdW5jdGlvbiBwYXJzZUludExpc3QoZGF0YSkge1xuICByZXR1cm4gZGF0YS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbih2YWwpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQodmFsLCAxMClcbiAgfSlcbn0iLCJ2YXIgZHR5cGUgPSByZXF1aXJlKCdkdHlwZScpXG52YXIgYW5BcnJheSA9IHJlcXVpcmUoJ2FuLWFycmF5JylcbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpXG5cbnZhciBDVyA9IFswLCAyLCAzXVxudmFyIENDVyA9IFsyLCAxLCAzXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVF1YWRFbGVtZW50cyhhcnJheSwgb3B0KSB7XG4gICAgLy9pZiB1c2VyIGRpZG4ndCBzcGVjaWZ5IGFuIG91dHB1dCBhcnJheVxuICAgIGlmICghYXJyYXkgfHwgIShhbkFycmF5KGFycmF5KSB8fCBpc0J1ZmZlcihhcnJheSkpKSB7XG4gICAgICAgIG9wdCA9IGFycmF5IHx8IHt9XG4gICAgICAgIGFycmF5ID0gbnVsbFxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0ID09PSAnbnVtYmVyJykgLy9iYWNrd2FyZHMtY29tcGF0aWJsZVxuICAgICAgICBvcHQgPSB7IGNvdW50OiBvcHQgfVxuICAgIGVsc2VcbiAgICAgICAgb3B0ID0gb3B0IHx8IHt9XG5cbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvcHQudHlwZSA9PT0gJ3N0cmluZycgPyBvcHQudHlwZSA6ICd1aW50MTYnXG4gICAgdmFyIGNvdW50ID0gdHlwZW9mIG9wdC5jb3VudCA9PT0gJ251bWJlcicgPyBvcHQuY291bnQgOiAxXG4gICAgdmFyIHN0YXJ0ID0gKG9wdC5zdGFydCB8fCAwKSBcblxuICAgIHZhciBkaXIgPSBvcHQuY2xvY2t3aXNlICE9PSBmYWxzZSA/IENXIDogQ0NXLFxuICAgICAgICBhID0gZGlyWzBdLCBcbiAgICAgICAgYiA9IGRpclsxXSxcbiAgICAgICAgYyA9IGRpclsyXVxuXG4gICAgdmFyIG51bUluZGljZXMgPSBjb3VudCAqIDZcblxuICAgIHZhciBpbmRpY2VzID0gYXJyYXkgfHwgbmV3IChkdHlwZSh0eXBlKSkobnVtSW5kaWNlcylcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IDA7IGkgPCBudW1JbmRpY2VzOyBpICs9IDYsIGogKz0gNCkge1xuICAgICAgICB2YXIgeCA9IGkgKyBzdGFydFxuICAgICAgICBpbmRpY2VzW3ggKyAwXSA9IGogKyAwXG4gICAgICAgIGluZGljZXNbeCArIDFdID0gaiArIDFcbiAgICAgICAgaW5kaWNlc1t4ICsgMl0gPSBqICsgMlxuICAgICAgICBpbmRpY2VzW3ggKyAzXSA9IGogKyBhXG4gICAgICAgIGluZGljZXNbeCArIDRdID0gaiArIGJcbiAgICAgICAgaW5kaWNlc1t4ICsgNV0gPSBqICsgY1xuICAgIH1cbiAgICByZXR1cm4gaW5kaWNlc1xufSIsInZhciBjcmVhdGVMYXlvdXQgPSByZXF1aXJlKCdsYXlvdXQtYm1mb250LXRleHQnKVxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxudmFyIGNyZWF0ZUluZGljZXMgPSByZXF1aXJlKCdxdWFkLWluZGljZXMnKVxudmFyIGJ1ZmZlciA9IHJlcXVpcmUoJ3RocmVlLWJ1ZmZlci12ZXJ0ZXgtZGF0YScpXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpXG5cbnZhciB2ZXJ0aWNlcyA9IHJlcXVpcmUoJy4vbGliL3ZlcnRpY2VzJylcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vbGliL3V0aWxzJylcblxudmFyIEJhc2UgPSBUSFJFRS5CdWZmZXJHZW9tZXRyeVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVRleHRHZW9tZXRyeSAob3B0KSB7XG4gIHJldHVybiBuZXcgVGV4dEdlb21ldHJ5KG9wdClcbn1cblxuZnVuY3Rpb24gVGV4dEdlb21ldHJ5IChvcHQpIHtcbiAgQmFzZS5jYWxsKHRoaXMpXG5cbiAgaWYgKHR5cGVvZiBvcHQgPT09ICdzdHJpbmcnKSB7XG4gICAgb3B0ID0geyB0ZXh0OiBvcHQgfVxuICB9XG5cbiAgLy8gdXNlIHRoZXNlIGFzIGRlZmF1bHQgdmFsdWVzIGZvciBhbnkgc3Vic2VxdWVudFxuICAvLyBjYWxscyB0byB1cGRhdGUoKVxuICB0aGlzLl9vcHQgPSBhc3NpZ24oe30sIG9wdClcblxuICAvLyBhbHNvIGRvIGFuIGluaXRpYWwgc2V0dXAuLi5cbiAgaWYgKG9wdCkgdGhpcy51cGRhdGUob3B0KVxufVxuXG5pbmhlcml0cyhUZXh0R2VvbWV0cnksIEJhc2UpXG5cblRleHRHZW9tZXRyeS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG9wdCkge1xuICBpZiAodHlwZW9mIG9wdCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHQgPSB7IHRleHQ6IG9wdCB9XG4gIH1cblxuICAvLyB1c2UgY29uc3RydWN0b3IgZGVmYXVsdHNcbiAgb3B0ID0gYXNzaWduKHt9LCB0aGlzLl9vcHQsIG9wdClcblxuICBpZiAoIW9wdC5mb250KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbXVzdCBzcGVjaWZ5IGEgeyBmb250IH0gaW4gb3B0aW9ucycpXG4gIH1cblxuICB0aGlzLmxheW91dCA9IGNyZWF0ZUxheW91dChvcHQpXG5cbiAgLy8gZ2V0IHZlYzIgdGV4Y29vcmRzXG4gIHZhciBmbGlwWSA9IG9wdC5mbGlwWSAhPT0gZmFsc2VcblxuICAvLyB0aGUgZGVzaXJlZCBCTUZvbnQgZGF0YVxuICB2YXIgZm9udCA9IG9wdC5mb250XG5cbiAgLy8gZGV0ZXJtaW5lIHRleHR1cmUgc2l6ZSBmcm9tIGZvbnQgZmlsZVxuICB2YXIgdGV4V2lkdGggPSBmb250LmNvbW1vbi5zY2FsZVdcbiAgdmFyIHRleEhlaWdodCA9IGZvbnQuY29tbW9uLnNjYWxlSFxuXG4gIC8vIGdldCB2aXNpYmxlIGdseXBoc1xuICB2YXIgZ2x5cGhzID0gdGhpcy5sYXlvdXQuZ2x5cGhzLmZpbHRlcihmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuICAgIHJldHVybiBiaXRtYXAud2lkdGggKiBiaXRtYXAuaGVpZ2h0ID4gMFxuICB9KVxuXG4gIC8vIHByb3ZpZGUgdmlzaWJsZSBnbHlwaHMgZm9yIGNvbnZlbmllbmNlXG4gIHRoaXMudmlzaWJsZUdseXBocyA9IGdseXBoc1xuXG4gIC8vIGdldCBjb21tb24gdmVydGV4IGRhdGFcbiAgdmFyIHBvc2l0aW9ucyA9IHZlcnRpY2VzLnBvc2l0aW9ucyhnbHlwaHMpXG4gIHZhciB1dnMgPSB2ZXJ0aWNlcy51dnMoZ2x5cGhzLCB0ZXhXaWR0aCwgdGV4SGVpZ2h0LCBmbGlwWSlcbiAgdmFyIGluZGljZXMgPSBjcmVhdGVJbmRpY2VzKHtcbiAgICBjbG9ja3dpc2U6IHRydWUsXG4gICAgdHlwZTogJ3VpbnQxNicsXG4gICAgY291bnQ6IGdseXBocy5sZW5ndGhcbiAgfSlcblxuICAvLyB1cGRhdGUgdmVydGV4IGRhdGFcbiAgYnVmZmVyLmluZGV4KHRoaXMsIGluZGljZXMsIDEsICd1aW50MTYnKVxuICBidWZmZXIuYXR0cih0aGlzLCAncG9zaXRpb24nLCBwb3NpdGlvbnMsIDIpXG4gIGJ1ZmZlci5hdHRyKHRoaXMsICd1dicsIHV2cywgMilcblxuICAvLyB1cGRhdGUgbXVsdGlwYWdlIGRhdGFcbiAgaWYgKCFvcHQubXVsdGlwYWdlICYmICdwYWdlJyBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAvLyBkaXNhYmxlIG11bHRpcGFnZSByZW5kZXJpbmdcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgncGFnZScpXG4gIH0gZWxzZSBpZiAob3B0Lm11bHRpcGFnZSkge1xuICAgIHZhciBwYWdlcyA9IHZlcnRpY2VzLnBhZ2VzKGdseXBocylcbiAgICAvLyBlbmFibGUgbXVsdGlwYWdlIHJlbmRlcmluZ1xuICAgIGJ1ZmZlci5hdHRyKHRoaXMsICdwYWdlJywgcGFnZXMsIDEpXG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS5jb21wdXRlQm91bmRpbmdTcGhlcmUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmJvdW5kaW5nU3BoZXJlID09PSBudWxsKSB7XG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZSA9IG5ldyBUSFJFRS5TcGhlcmUoKVxuICB9XG5cbiAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5hcnJheVxuICB2YXIgaXRlbVNpemUgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uaXRlbVNpemVcbiAgaWYgKCFwb3NpdGlvbnMgfHwgIWl0ZW1TaXplIHx8IHBvc2l0aW9ucy5sZW5ndGggPCAyKSB7XG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZS5yYWRpdXMgPSAwXG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZS5jZW50ZXIuc2V0KDAsIDAsIDApXG4gICAgcmV0dXJuXG4gIH1cbiAgdXRpbHMuY29tcHV0ZVNwaGVyZShwb3NpdGlvbnMsIHRoaXMuYm91bmRpbmdTcGhlcmUpXG4gIGlmIChpc05hTih0aGlzLmJvdW5kaW5nU3BoZXJlLnJhZGl1cykpIHtcbiAgICBjb25zb2xlLmVycm9yKCdUSFJFRS5CdWZmZXJHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTogJyArXG4gICAgICAnQ29tcHV0ZWQgcmFkaXVzIGlzIE5hTi4gVGhlICcgK1xuICAgICAgJ1wicG9zaXRpb25cIiBhdHRyaWJ1dGUgaXMgbGlrZWx5IHRvIGhhdmUgTmFOIHZhbHVlcy4nKVxuICB9XG59XG5cblRleHRHZW9tZXRyeS5wcm90b3R5cGUuY29tcHV0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5ib3VuZGluZ0JveCA9PT0gbnVsbCkge1xuICAgIHRoaXMuYm91bmRpbmdCb3ggPSBuZXcgVEhSRUUuQm94MygpXG4gIH1cblxuICB2YXIgYmJveCA9IHRoaXMuYm91bmRpbmdCb3hcbiAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5hcnJheVxuICB2YXIgaXRlbVNpemUgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uaXRlbVNpemVcbiAgaWYgKCFwb3NpdGlvbnMgfHwgIWl0ZW1TaXplIHx8IHBvc2l0aW9ucy5sZW5ndGggPCAyKSB7XG4gICAgYmJveC5tYWtlRW1wdHkoKVxuICAgIHJldHVyblxuICB9XG4gIHV0aWxzLmNvbXB1dGVCb3gocG9zaXRpb25zLCBiYm94KVxufVxuIiwidmFyIGl0ZW1TaXplID0gMlxudmFyIGJveCA9IHsgbWluOiBbMCwgMF0sIG1heDogWzAsIDBdIH1cblxuZnVuY3Rpb24gYm91bmRzIChwb3NpdGlvbnMpIHtcbiAgdmFyIGNvdW50ID0gcG9zaXRpb25zLmxlbmd0aCAvIGl0ZW1TaXplXG4gIGJveC5taW5bMF0gPSBwb3NpdGlvbnNbMF1cbiAgYm94Lm1pblsxXSA9IHBvc2l0aW9uc1sxXVxuICBib3gubWF4WzBdID0gcG9zaXRpb25zWzBdXG4gIGJveC5tYXhbMV0gPSBwb3NpdGlvbnNbMV1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICB2YXIgeCA9IHBvc2l0aW9uc1tpICogaXRlbVNpemUgKyAwXVxuICAgIHZhciB5ID0gcG9zaXRpb25zW2kgKiBpdGVtU2l6ZSArIDFdXG4gICAgYm94Lm1pblswXSA9IE1hdGgubWluKHgsIGJveC5taW5bMF0pXG4gICAgYm94Lm1pblsxXSA9IE1hdGgubWluKHksIGJveC5taW5bMV0pXG4gICAgYm94Lm1heFswXSA9IE1hdGgubWF4KHgsIGJveC5tYXhbMF0pXG4gICAgYm94Lm1heFsxXSA9IE1hdGgubWF4KHksIGJveC5tYXhbMV0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuY29tcHV0ZUJveCA9IGZ1bmN0aW9uIChwb3NpdGlvbnMsIG91dHB1dCkge1xuICBib3VuZHMocG9zaXRpb25zKVxuICBvdXRwdXQubWluLnNldChib3gubWluWzBdLCBib3gubWluWzFdLCAwKVxuICBvdXRwdXQubWF4LnNldChib3gubWF4WzBdLCBib3gubWF4WzFdLCAwKVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlU3BoZXJlID0gZnVuY3Rpb24gKHBvc2l0aW9ucywgb3V0cHV0KSB7XG4gIGJvdW5kcyhwb3NpdGlvbnMpXG4gIHZhciBtaW5YID0gYm94Lm1pblswXVxuICB2YXIgbWluWSA9IGJveC5taW5bMV1cbiAgdmFyIG1heFggPSBib3gubWF4WzBdXG4gIHZhciBtYXhZID0gYm94Lm1heFsxXVxuICB2YXIgd2lkdGggPSBtYXhYIC0gbWluWFxuICB2YXIgaGVpZ2h0ID0gbWF4WSAtIG1pbllcbiAgdmFyIGxlbmd0aCA9IE1hdGguc3FydCh3aWR0aCAqIHdpZHRoICsgaGVpZ2h0ICogaGVpZ2h0KVxuICBvdXRwdXQuY2VudGVyLnNldChtaW5YICsgd2lkdGggLyAyLCBtaW5ZICsgaGVpZ2h0IC8gMiwgMClcbiAgb3V0cHV0LnJhZGl1cyA9IGxlbmd0aCAvIDJcbn1cbiIsIm1vZHVsZS5leHBvcnRzLnBhZ2VzID0gZnVuY3Rpb24gcGFnZXMgKGdseXBocykge1xuICB2YXIgcGFnZXMgPSBuZXcgRmxvYXQzMkFycmF5KGdseXBocy5sZW5ndGggKiA0ICogMSlcbiAgdmFyIGkgPSAwXG4gIGdseXBocy5mb3JFYWNoKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBpZCA9IGdseXBoLmRhdGEucGFnZSB8fCAwXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gIH0pXG4gIHJldHVybiBwYWdlc1xufVxuXG5tb2R1bGUuZXhwb3J0cy51dnMgPSBmdW5jdGlvbiB1dnMgKGdseXBocywgdGV4V2lkdGgsIHRleEhlaWdodCwgZmxpcFkpIHtcbiAgdmFyIHV2cyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAyKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcbiAgICB2YXIgYncgPSAoYml0bWFwLnggKyBiaXRtYXAud2lkdGgpXG4gICAgdmFyIGJoID0gKGJpdG1hcC55ICsgYml0bWFwLmhlaWdodClcblxuICAgIC8vIHRvcCBsZWZ0IHBvc2l0aW9uXG4gICAgdmFyIHUwID0gYml0bWFwLnggLyB0ZXhXaWR0aFxuICAgIHZhciB2MSA9IGJpdG1hcC55IC8gdGV4SGVpZ2h0XG4gICAgdmFyIHUxID0gYncgLyB0ZXhXaWR0aFxuICAgIHZhciB2MCA9IGJoIC8gdGV4SGVpZ2h0XG5cbiAgICBpZiAoZmxpcFkpIHtcbiAgICAgIHYxID0gKHRleEhlaWdodCAtIGJpdG1hcC55KSAvIHRleEhlaWdodFxuICAgICAgdjAgPSAodGV4SGVpZ2h0IC0gYmgpIC8gdGV4SGVpZ2h0XG4gICAgfVxuXG4gICAgLy8gQkxcbiAgICB1dnNbaSsrXSA9IHUwXG4gICAgdXZzW2krK10gPSB2MVxuICAgIC8vIFRMXG4gICAgdXZzW2krK10gPSB1MFxuICAgIHV2c1tpKytdID0gdjBcbiAgICAvLyBUUlxuICAgIHV2c1tpKytdID0gdTFcbiAgICB1dnNbaSsrXSA9IHYwXG4gICAgLy8gQlJcbiAgICB1dnNbaSsrXSA9IHUxXG4gICAgdXZzW2krK10gPSB2MVxuICB9KVxuICByZXR1cm4gdXZzXG59XG5cbm1vZHVsZS5leHBvcnRzLnBvc2l0aW9ucyA9IGZ1bmN0aW9uIHBvc2l0aW9ucyAoZ2x5cGhzKSB7XG4gIHZhciBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KGdseXBocy5sZW5ndGggKiA0ICogMilcbiAgdmFyIGkgPSAwXG4gIGdseXBocy5mb3JFYWNoKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG5cbiAgICAvLyBib3R0b20gbGVmdCBwb3NpdGlvblxuICAgIHZhciB4ID0gZ2x5cGgucG9zaXRpb25bMF0gKyBiaXRtYXAueG9mZnNldFxuICAgIHZhciB5ID0gZ2x5cGgucG9zaXRpb25bMV0gKyBiaXRtYXAueW9mZnNldFxuXG4gICAgLy8gcXVhZCBzaXplXG4gICAgdmFyIHcgPSBiaXRtYXAud2lkdGhcbiAgICB2YXIgaCA9IGJpdG1hcC5oZWlnaHRcblxuICAgIC8vIEJMXG4gICAgcG9zaXRpb25zW2krK10gPSB4XG4gICAgcG9zaXRpb25zW2krK10gPSB5XG4gICAgLy8gVExcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHhcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHkgKyBoXG4gICAgLy8gVFJcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHggKyB3XG4gICAgcG9zaXRpb25zW2krK10gPSB5ICsgaFxuICAgIC8vIEJSXG4gICAgcG9zaXRpb25zW2krK10gPSB4ICsgd1xuICAgIHBvc2l0aW9uc1tpKytdID0geVxuICB9KVxuICByZXR1cm4gcG9zaXRpb25zXG59XG4iLCJ2YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU0RGU2hhZGVyIChvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9XG4gIHZhciBvcGFjaXR5ID0gdHlwZW9mIG9wdC5vcGFjaXR5ID09PSAnbnVtYmVyJyA/IG9wdC5vcGFjaXR5IDogMVxuICB2YXIgYWxwaGFUZXN0ID0gdHlwZW9mIG9wdC5hbHBoYVRlc3QgPT09ICdudW1iZXInID8gb3B0LmFscGhhVGVzdCA6IDAuMDAwMVxuICB2YXIgcHJlY2lzaW9uID0gb3B0LnByZWNpc2lvbiB8fCAnaGlnaHAnXG4gIHZhciBjb2xvciA9IG9wdC5jb2xvclxuICB2YXIgbWFwID0gb3B0Lm1hcFxuXG4gIC8vIHJlbW92ZSB0byBzYXRpc2Z5IHI3M1xuICBkZWxldGUgb3B0Lm1hcFxuICBkZWxldGUgb3B0LmNvbG9yXG4gIGRlbGV0ZSBvcHQucHJlY2lzaW9uXG4gIGRlbGV0ZSBvcHQub3BhY2l0eVxuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIHVuaWZvcm1zOiB7XG4gICAgICBvcGFjaXR5OiB7IHR5cGU6ICdmJywgdmFsdWU6IG9wYWNpdHkgfSxcbiAgICAgIG1hcDogeyB0eXBlOiAndCcsIHZhbHVlOiBtYXAgfHwgbmV3IFRIUkVFLlRleHR1cmUoKSB9LFxuICAgICAgY29sb3I6IHsgdHlwZTogJ2MnLCB2YWx1ZTogbmV3IFRIUkVFLkNvbG9yKGNvbG9yKSB9XG4gICAgfSxcbiAgICB2ZXJ0ZXhTaGFkZXI6IFtcbiAgICAgICdhdHRyaWJ1dGUgdmVjMiB1djsnLFxuICAgICAgJ2F0dHJpYnV0ZSB2ZWM0IHBvc2l0aW9uOycsXG4gICAgICAndW5pZm9ybSBtYXQ0IHByb2plY3Rpb25NYXRyaXg7JyxcbiAgICAgICd1bmlmb3JtIG1hdDQgbW9kZWxWaWV3TWF0cml4OycsXG4gICAgICAndmFyeWluZyB2ZWMyIHZVdjsnLFxuICAgICAgJ3ZvaWQgbWFpbigpIHsnLFxuICAgICAgJ3ZVdiA9IHV2OycsXG4gICAgICAnZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogcG9zaXRpb247JyxcbiAgICAgICd9J1xuICAgIF0uam9pbignXFxuJyksXG4gICAgZnJhZ21lbnRTaGFkZXI6IFtcbiAgICAgICcjaWZkZWYgR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcbiAgICAgICcjZXh0ZW5zaW9uIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcyA6IGVuYWJsZScsXG4gICAgICAnI2VuZGlmJyxcbiAgICAgICdwcmVjaXNpb24gJyArIHByZWNpc2lvbiArICcgZmxvYXQ7JyxcbiAgICAgICd1bmlmb3JtIGZsb2F0IG9wYWNpdHk7JyxcbiAgICAgICd1bmlmb3JtIHZlYzMgY29sb3I7JyxcbiAgICAgICd1bmlmb3JtIHNhbXBsZXIyRCBtYXA7JyxcbiAgICAgICd2YXJ5aW5nIHZlYzIgdlV2OycsXG5cbiAgICAgICdmbG9hdCBhYXN0ZXAoZmxvYXQgdmFsdWUpIHsnLFxuICAgICAgJyAgI2lmZGVmIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcycsXG4gICAgICAnICAgIGZsb2F0IGFmd2lkdGggPSBsZW5ndGgodmVjMihkRmR4KHZhbHVlKSwgZEZkeSh2YWx1ZSkpKSAqIDAuNzA3MTA2NzgxMTg2NTQ3NTc7JyxcbiAgICAgICcgICNlbHNlJyxcbiAgICAgICcgICAgZmxvYXQgYWZ3aWR0aCA9ICgxLjAgLyAzMi4wKSAqICgxLjQxNDIxMzU2MjM3MzA5NTEgLyAoMi4wICogZ2xfRnJhZ0Nvb3JkLncpKTsnLFxuICAgICAgJyAgI2VuZGlmJyxcbiAgICAgICcgIHJldHVybiBzbW9vdGhzdGVwKDAuNSAtIGFmd2lkdGgsIDAuNSArIGFmd2lkdGgsIHZhbHVlKTsnLFxuICAgICAgJ30nLFxuXG4gICAgICAndm9pZCBtYWluKCkgeycsXG4gICAgICAnICB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKG1hcCwgdlV2KTsnLFxuICAgICAgJyAgZmxvYXQgYWxwaGEgPSBhYXN0ZXAodGV4Q29sb3IuYSk7JyxcbiAgICAgICcgIGdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IsIG9wYWNpdHkgKiBhbHBoYSk7JyxcbiAgICAgIGFscGhhVGVzdCA9PT0gMFxuICAgICAgICA/ICcnXG4gICAgICAgIDogJyAgaWYgKGdsX0ZyYWdDb2xvci5hIDwgJyArIGFscGhhVGVzdCArICcpIGRpc2NhcmQ7JyxcbiAgICAgICd9J1xuICAgIF0uam9pbignXFxuJylcbiAgfSwgb3B0KVxufVxuIiwidmFyIGZsYXR0ZW4gPSByZXF1aXJlKCdmbGF0dGVuLXZlcnRleC1kYXRhJylcbnZhciB3YXJuZWQgPSBmYWxzZTtcblxubW9kdWxlLmV4cG9ydHMuYXR0ciA9IHNldEF0dHJpYnV0ZVxubW9kdWxlLmV4cG9ydHMuaW5kZXggPSBzZXRJbmRleFxuXG5mdW5jdGlvbiBzZXRJbmRleCAoZ2VvbWV0cnksIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBpZiAodHlwZW9mIGl0ZW1TaXplICE9PSAnbnVtYmVyJykgaXRlbVNpemUgPSAxXG4gIGlmICh0eXBlb2YgZHR5cGUgIT09ICdzdHJpbmcnKSBkdHlwZSA9ICd1aW50MTYnXG5cbiAgdmFyIGlzUjY5ID0gIWdlb21ldHJ5LmluZGV4ICYmIHR5cGVvZiBnZW9tZXRyeS5zZXRJbmRleCAhPT0gJ2Z1bmN0aW9uJ1xuICB2YXIgYXR0cmliID0gaXNSNjkgPyBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoJ2luZGV4JykgOiBnZW9tZXRyeS5pbmRleFxuICB2YXIgbmV3QXR0cmliID0gdXBkYXRlQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKVxuICBpZiAobmV3QXR0cmliKSB7XG4gICAgaWYgKGlzUjY5KSBnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoJ2luZGV4JywgbmV3QXR0cmliKVxuICAgIGVsc2UgZ2VvbWV0cnkuaW5kZXggPSBuZXdBdHRyaWJcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGUgKGdlb21ldHJ5LCBrZXksIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBpZiAodHlwZW9mIGl0ZW1TaXplICE9PSAnbnVtYmVyJykgaXRlbVNpemUgPSAzXG4gIGlmICh0eXBlb2YgZHR5cGUgIT09ICdzdHJpbmcnKSBkdHlwZSA9ICdmbG9hdDMyJ1xuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJlxuICAgIEFycmF5LmlzQXJyYXkoZGF0YVswXSkgJiZcbiAgICBkYXRhWzBdLmxlbmd0aCAhPT0gaXRlbVNpemUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05lc3RlZCB2ZXJ0ZXggYXJyYXkgaGFzIHVuZXhwZWN0ZWQgc2l6ZTsgZXhwZWN0ZWQgJyArXG4gICAgICBpdGVtU2l6ZSArICcgYnV0IGZvdW5kICcgKyBkYXRhWzBdLmxlbmd0aClcbiAgfVxuXG4gIHZhciBhdHRyaWIgPSBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoa2V5KVxuICB2YXIgbmV3QXR0cmliID0gdXBkYXRlQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKVxuICBpZiAobmV3QXR0cmliKSB7XG4gICAgZ2VvbWV0cnkuYWRkQXR0cmlidXRlKGtleSwgbmV3QXR0cmliKVxuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUF0dHJpYnV0ZSAoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgZGF0YSA9IGRhdGEgfHwgW11cbiAgaWYgKCFhdHRyaWIgfHwgcmVidWlsZEF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplKSkge1xuICAgIC8vIGNyZWF0ZSBhIG5ldyBhcnJheSB3aXRoIGRlc2lyZWQgdHlwZVxuICAgIGRhdGEgPSBmbGF0dGVuKGRhdGEsIGR0eXBlKVxuICAgIGlmIChhdHRyaWIgJiYgIXdhcm5lZCkge1xuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUud2FybihbXG4gICAgICAgICdBIFdlYkdMIGJ1ZmZlciBpcyBiZWluZyB1cGRhdGVkIHdpdGggYSBuZXcgc2l6ZSBvciBpdGVtU2l6ZSwgJyxcbiAgICAgICAgJ2hvd2V2ZXIgVGhyZWVKUyBvbmx5IHN1cHBvcnRzIGZpeGVkLXNpemUgYnVmZmVycy5cXG5UaGUgb2xkIGJ1ZmZlciBtYXkgJyxcbiAgICAgICAgJ3N0aWxsIGJlIGtlcHQgaW4gbWVtb3J5LlxcbicsXG4gICAgICAgICdUbyBhdm9pZCBtZW1vcnkgbGVha3MsIGl0IGlzIHJlY29tbWVuZGVkIHRoYXQgeW91IGRpc3Bvc2UgJyxcbiAgICAgICAgJ3lvdXIgZ2VvbWV0cmllcyBhbmQgY3JlYXRlIG5ldyBvbmVzLCBvciBzdXBwb3J0IHRoZSBmb2xsb3dpbmcgUFIgaW4gVGhyZWVKUzpcXG4nLFxuICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9wdWxsLzk2MzEnXG4gICAgICBdLmpvaW4oJycpKTtcbiAgICB9XG4gICAgYXR0cmliID0gbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShkYXRhLCBpdGVtU2l6ZSlcbiAgICBhdHRyaWIubmVlZHNVcGRhdGUgPSB0cnVlXG4gICAgcmV0dXJuIGF0dHJpYlxuICB9IGVsc2Uge1xuICAgIC8vIGNvcHkgZGF0YSBpbnRvIHRoZSBleGlzdGluZyBhcnJheVxuICAgIGZsYXR0ZW4oZGF0YSwgYXR0cmliLmFycmF5KVxuICAgIGF0dHJpYi5uZWVkc1VwZGF0ZSA9IHRydWVcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbi8vIFRlc3Qgd2hldGhlciB0aGUgYXR0cmlidXRlIG5lZWRzIHRvIGJlIHJlLWNyZWF0ZWQsXG4vLyByZXR1cm5zIGZhbHNlIGlmIHdlIGNhbiByZS11c2UgaXQgYXMtaXMuXG5mdW5jdGlvbiByZWJ1aWxkQXR0cmlidXRlIChhdHRyaWIsIGRhdGEsIGl0ZW1TaXplKSB7XG4gIGlmIChhdHRyaWIuaXRlbVNpemUgIT09IGl0ZW1TaXplKSByZXR1cm4gdHJ1ZVxuICBpZiAoIWF0dHJpYi5hcnJheSkgcmV0dXJuIHRydWVcbiAgdmFyIGF0dHJpYkxlbmd0aCA9IGF0dHJpYi5hcnJheS5sZW5ndGhcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiYgQXJyYXkuaXNBcnJheShkYXRhWzBdKSkge1xuICAgIC8vIFsgWyB4LCB5LCB6IF0gXVxuICAgIHJldHVybiBhdHRyaWJMZW5ndGggIT09IGRhdGEubGVuZ3RoICogaXRlbVNpemVcbiAgfSBlbHNlIHtcbiAgICAvLyBbIHgsIHksIHogXVxuICAgIHJldHVybiBhdHRyaWJMZW5ndGggIT09IGRhdGEubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG4iLCJ2YXIgbmV3bGluZSA9IC9cXG4vXG52YXIgbmV3bGluZUNoYXIgPSAnXFxuJ1xudmFyIHdoaXRlc3BhY2UgPSAvXFxzL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRleHQsIG9wdCkge1xuICAgIHZhciBsaW5lcyA9IG1vZHVsZS5leHBvcnRzLmxpbmVzKHRleHQsIG9wdClcbiAgICByZXR1cm4gbGluZXMubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgcmV0dXJuIHRleHQuc3Vic3RyaW5nKGxpbmUuc3RhcnQsIGxpbmUuZW5kKVxuICAgIH0pLmpvaW4oJ1xcbicpXG59XG5cbm1vZHVsZS5leHBvcnRzLmxpbmVzID0gZnVuY3Rpb24gd29yZHdyYXAodGV4dCwgb3B0KSB7XG4gICAgb3B0ID0gb3B0fHx7fVxuXG4gICAgLy96ZXJvIHdpZHRoIHJlc3VsdHMgaW4gbm90aGluZyB2aXNpYmxlXG4gICAgaWYgKG9wdC53aWR0aCA9PT0gMCAmJiBvcHQubW9kZSAhPT0gJ25vd3JhcCcpIFxuICAgICAgICByZXR1cm4gW11cblxuICAgIHRleHQgPSB0ZXh0fHwnJ1xuICAgIHZhciB3aWR0aCA9IHR5cGVvZiBvcHQud2lkdGggPT09ICdudW1iZXInID8gb3B0LndpZHRoIDogTnVtYmVyLk1BWF9WQUxVRVxuICAgIHZhciBzdGFydCA9IE1hdGgubWF4KDAsIG9wdC5zdGFydHx8MClcbiAgICB2YXIgZW5kID0gdHlwZW9mIG9wdC5lbmQgPT09ICdudW1iZXInID8gb3B0LmVuZCA6IHRleHQubGVuZ3RoXG4gICAgdmFyIG1vZGUgPSBvcHQubW9kZVxuXG4gICAgdmFyIG1lYXN1cmUgPSBvcHQubWVhc3VyZSB8fCBtb25vc3BhY2VcbiAgICBpZiAobW9kZSA9PT0gJ3ByZScpXG4gICAgICAgIHJldHVybiBwcmUobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpXG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gZ3JlZWR5KG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoLCBtb2RlKVxufVxuXG5mdW5jdGlvbiBpZHhPZih0ZXh0LCBjaHIsIHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgaWR4ID0gdGV4dC5pbmRleE9mKGNociwgc3RhcnQpXG4gICAgaWYgKGlkeCA9PT0gLTEgfHwgaWR4ID4gZW5kKVxuICAgICAgICByZXR1cm4gZW5kXG4gICAgcmV0dXJuIGlkeFxufVxuXG5mdW5jdGlvbiBpc1doaXRlc3BhY2UoY2hyKSB7XG4gICAgcmV0dXJuIHdoaXRlc3BhY2UudGVzdChjaHIpXG59XG5cbmZ1bmN0aW9uIHByZShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICAgIHZhciBsaW5lcyA9IFtdXG4gICAgdmFyIGxpbmVTdGFydCA9IHN0YXJ0XG4gICAgZm9yICh2YXIgaT1zdGFydDsgaTxlbmQgJiYgaTx0ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaHIgPSB0ZXh0LmNoYXJBdChpKVxuICAgICAgICB2YXIgaXNOZXdsaW5lID0gbmV3bGluZS50ZXN0KGNocilcblxuICAgICAgICAvL0lmIHdlJ3ZlIHJlYWNoZWQgYSBuZXdsaW5lLCB0aGVuIHN0ZXAgZG93biBhIGxpbmVcbiAgICAgICAgLy9PciBpZiB3ZSd2ZSByZWFjaGVkIHRoZSBFT0ZcbiAgICAgICAgaWYgKGlzTmV3bGluZSB8fCBpPT09ZW5kLTEpIHtcbiAgICAgICAgICAgIHZhciBsaW5lRW5kID0gaXNOZXdsaW5lID8gaSA6IGkrMVxuICAgICAgICAgICAgdmFyIG1lYXN1cmVkID0gbWVhc3VyZSh0ZXh0LCBsaW5lU3RhcnQsIGxpbmVFbmQsIHdpZHRoKVxuICAgICAgICAgICAgbGluZXMucHVzaChtZWFzdXJlZClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGluZVN0YXJ0ID0gaSsxXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxpbmVzXG59XG5cbmZ1bmN0aW9uIGdyZWVkeShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCwgbW9kZSkge1xuICAgIC8vQSBncmVlZHkgd29yZCB3cmFwcGVyIGJhc2VkIG9uIExpYkdEWCBhbGdvcml0aG1cbiAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9saWJnZHgvbGliZ2R4L2Jsb2IvbWFzdGVyL2dkeC9zcmMvY29tL2JhZGxvZ2ljL2dkeC9ncmFwaGljcy9nMmQvQml0bWFwRm9udENhY2hlLmphdmFcbiAgICB2YXIgbGluZXMgPSBbXVxuXG4gICAgdmFyIHRlc3RXaWR0aCA9IHdpZHRoXG4gICAgLy9pZiAnbm93cmFwJyBpcyBzcGVjaWZpZWQsIHdlIG9ubHkgd3JhcCBvbiBuZXdsaW5lIGNoYXJzXG4gICAgaWYgKG1vZGUgPT09ICdub3dyYXAnKVxuICAgICAgICB0ZXN0V2lkdGggPSBOdW1iZXIuTUFYX1ZBTFVFXG5cbiAgICB3aGlsZSAoc3RhcnQgPCBlbmQgJiYgc3RhcnQgPCB0ZXh0Lmxlbmd0aCkge1xuICAgICAgICAvL2dldCBuZXh0IG5ld2xpbmUgcG9zaXRpb25cbiAgICAgICAgdmFyIG5ld0xpbmUgPSBpZHhPZih0ZXh0LCBuZXdsaW5lQ2hhciwgc3RhcnQsIGVuZClcblxuICAgICAgICAvL2VhdCB3aGl0ZXNwYWNlIGF0IHN0YXJ0IG9mIGxpbmVcbiAgICAgICAgd2hpbGUgKHN0YXJ0IDwgbmV3TGluZSkge1xuICAgICAgICAgICAgaWYgKCFpc1doaXRlc3BhY2UoIHRleHQuY2hhckF0KHN0YXJ0KSApKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBzdGFydCsrXG4gICAgICAgIH1cblxuICAgICAgICAvL2RldGVybWluZSB2aXNpYmxlICMgb2YgZ2x5cGhzIGZvciB0aGUgYXZhaWxhYmxlIHdpZHRoXG4gICAgICAgIHZhciBtZWFzdXJlZCA9IG1lYXN1cmUodGV4dCwgc3RhcnQsIG5ld0xpbmUsIHRlc3RXaWR0aClcblxuICAgICAgICB2YXIgbGluZUVuZCA9IHN0YXJ0ICsgKG1lYXN1cmVkLmVuZC1tZWFzdXJlZC5zdGFydClcbiAgICAgICAgdmFyIG5leHRTdGFydCA9IGxpbmVFbmQgKyBuZXdsaW5lQ2hhci5sZW5ndGhcblxuICAgICAgICAvL2lmIHdlIGhhZCB0byBjdXQgdGhlIGxpbmUgYmVmb3JlIHRoZSBuZXh0IG5ld2xpbmUuLi5cbiAgICAgICAgaWYgKGxpbmVFbmQgPCBuZXdMaW5lKSB7XG4gICAgICAgICAgICAvL2ZpbmQgY2hhciB0byBicmVhayBvblxuICAgICAgICAgICAgd2hpbGUgKGxpbmVFbmQgPiBzdGFydCkge1xuICAgICAgICAgICAgICAgIGlmIChpc1doaXRlc3BhY2UodGV4dC5jaGFyQXQobGluZUVuZCkpKVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGxpbmVFbmQtLVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpbmVFbmQgPT09IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRTdGFydCA+IHN0YXJ0ICsgbmV3bGluZUNoYXIubGVuZ3RoKSBuZXh0U3RhcnQtLVxuICAgICAgICAgICAgICAgIGxpbmVFbmQgPSBuZXh0U3RhcnQgLy8gSWYgbm8gY2hhcmFjdGVycyB0byBicmVhaywgc2hvdyBhbGwuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5leHRTdGFydCA9IGxpbmVFbmRcbiAgICAgICAgICAgICAgICAvL2VhdCB3aGl0ZXNwYWNlIGF0IGVuZCBvZiBsaW5lXG4gICAgICAgICAgICAgICAgd2hpbGUgKGxpbmVFbmQgPiBzdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZSh0ZXh0LmNoYXJBdChsaW5lRW5kIC0gbmV3bGluZUNoYXIubGVuZ3RoKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBsaW5lRW5kLS1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbmVFbmQgPj0gc3RhcnQpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBtZWFzdXJlKHRleHQsIHN0YXJ0LCBsaW5lRW5kLCB0ZXN0V2lkdGgpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKHJlc3VsdClcbiAgICAgICAgfVxuICAgICAgICBzdGFydCA9IG5leHRTdGFydFxuICAgIH1cbiAgICByZXR1cm4gbGluZXNcbn1cblxuLy9kZXRlcm1pbmVzIHRoZSB2aXNpYmxlIG51bWJlciBvZiBnbHlwaHMgd2l0aGluIGEgZ2l2ZW4gd2lkdGhcbmZ1bmN0aW9uIG1vbm9zcGFjZSh0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICAgIHZhciBnbHlwaHMgPSBNYXRoLm1pbih3aWR0aCwgZW5kLXN0YXJ0KVxuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgZW5kOiBzdGFydCtnbHlwaHNcbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBleHRlbmRcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gZXh0ZW5kKCkge1xuICAgIHZhciB0YXJnZXQgPSB7fVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXVxuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRcbn1cbiJdfQ==
