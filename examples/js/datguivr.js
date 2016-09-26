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

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":13,"./textlabel":15}],2:[function(require,module,exports){
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

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":13,"./textlabel":15}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorizeGeometry = colorizeGeometry;
/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                    * dat-guiVR Javascript Controller Library for VR
                                                                                                                                                                                                    * https://github.com/dataarts/dat.guiVR
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                                                                                                    * 
                                                                                                                                                                                                    * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                    * you may not use this file except in compliance with the License.
                                                                                                                                                                                                    * You may obtain a copy of the License at
                                                                                                                                                                                                    * 
                                                                                                                                                                                                    *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                    * 
                                                                                                                                                                                                    * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                    * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                    * See the License for the specific language governing permissions and
                                                                                                                                                                                                    * limitations under the License.
                                                                                                                                                                                                    */

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

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":13,"./textlabel":15}],5:[function(require,module,exports){
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

var _palette = require('./palette');

var Palette = _interopRequireWildcard(_palette);

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
  var paletteInteraction = Palette.create({ group: group, panel: descriptorLabel.back });

  group.update = function (inputObjects) {
    grabInteraction.update(inputObjects);
    paletteInteraction.update(inputObjects);
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
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  * 
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  * 
  *     http://www.apache.org/licenses/LICENSE-2.0
  * 
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./palette":11,"./sharedmaterials":13,"./textlabel":15}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.image = image;
exports.fnt = fnt;
/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function image() {
  var image = new Image();
  image.src = "data:image/png;base64,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";
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
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  * 
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  * 
  *     http://www.apache.org/licenses/LICENSE-2.0
  * 
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                    * dat-guiVR Javascript Controller Library for VR
                                                                                                                                                                                                    * https://github.com/dataarts/dat.guiVR
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                                                                                                    * 
                                                                                                                                                                                                    * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                    * you may not use this file except in compliance with the License.
                                                                                                                                                                                                    * You may obtain a copy of the License at
                                                                                                                                                                                                    * 
                                                                                                                                                                                                    *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                    * 
                                                                                                                                                                                                    * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                    * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                    * See the License for the specific language governing permissions and
                                                                                                                                                                                                    * limitations under the License.
                                                                                                                                                                                                    */

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
      events: new _events2.default(),
      interaction: {
        grip: undefined,
        press: undefined
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
      bindViveController(input, object, input.laser.pressed, input.laser.gripped);
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

function bindViveController(input, controller, pressed, gripped) {
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
  input.events.on('onControllerHeld', function (input) {
    if (input.object === controller) {
      if (gamepad && gamepad.haptics.length > 0) {
        gamepad.haptics[0].vibrate(0.3, 0.3);
      }
    }
  });
}

},{"./button":1,"./checkbox":2,"./dropdown":4,"./folder":5,"./font":6,"./sdftext":12,"./slider":14,"events":16}],9:[function(require,module,exports){
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

  var anyHover = false;
  var anyPressing = false;

  var hover = false;
  var anyActive = false;

  var tVector = new THREE.Vector3();

  function update(inputObjects) {

    hover = false;
    anyPressing = false;
    anyActive = false;

    inputObjects.forEach(function (input) {
      var _extractHit = extractHit(input);

      var hitObject = _extractHit.hitObject;
      var hitPoint = _extractHit.hitPoint;


      hover = hover || hitVolume === hitObject;

      performStateEvents({
        input: input,
        hover: hover,
        hitObject: hitObject, hitPoint: hitPoint,
        buttonName: 'pressed',
        interactionName: 'press',
        downName: 'onPressed',
        holdName: 'pressing',
        upName: 'onReleased'
      });

      performStateEvents({
        input: input,
        hover: hover,
        hitObject: hitObject, hitPoint: hitPoint,
        buttonName: 'gripped',
        interactionName: 'grip',
        downName: 'onGripped',
        holdName: 'gripping',
        upName: 'onReleaseGrip'
      });
    });
  }

  function extractHit(input) {
    if (input.intersections.length <= 0) {
      return {
        hitPoint: tVector.setFromMatrixPosition(input.cursor.matrixWorld).clone(),
        hitObject: input.cursor
      };
    } else {
      return {
        hitPoint: input.intersections[0].point,
        hitObject: input.intersections[0].object
      };
    }
  }

  function performStateEvents() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var input = _ref.input;
    var hover = _ref.hover;
    var hitObject = _ref.hitObject;
    var hitPoint = _ref.hitPoint;
    var buttonName = _ref.buttonName;
    var interactionName = _ref.interactionName;
    var downName = _ref.downName;
    var holdName = _ref.holdName;
    var upName = _ref.upName;


    // if( hover && input[ 'gripped' ] && interactionName === 'grip' ){
    //   debugger;
    // }

    //  hovering and button down but no interactions active yet
    if (hover && input[buttonName] === true && input.interaction[interactionName] === undefined) {
      // if( events.listenerCount( downName ) > 0 ){        
      input.interaction[interactionName] = interaction;
      events.emit(downName, {
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object
      });
      anyPressing = true;
      anyActive = true;
      // }
    }

    //  button still down and this is the active interaction
    if (input[buttonName] && input.interaction[interactionName] === interaction) {
      // if( events.listenerCount( holdName ) > 0 ){        
      events.emit(holdName, {
        hitObject: hitObject,
        point: hitPoint,
        inputObjet: input.object
      });
      anyPressing = true;
      // }
      // input.events.emit( 'onControllerHeld', input );
    }

    //  button not down and this is the active interaction
    if (input[buttonName] === false && input.interaction[interactionName] === interaction) {
      // if( events.listenerCount( upName ) > 0 ){
      input.interaction[interactionName] = undefined;
      events.emit(upName, {
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object
      });
      // }
    }
  }

  var interaction = {
    hovering: function hovering() {
      return hover;
    },
    pressing: function pressing() {
      return anyPressing;
    },
    update: update,
    events: events
  };

  return interaction;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  * 
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  * 
  *     http://www.apache.org/licenses/LICENSE-2.0
  * 
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"events":16}],10:[function(require,module,exports){
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

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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

},{"./colors":3,"./sharedmaterials":13}],11:[function(require,module,exports){
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

  interaction.events.on('onGripped', handleOnGrip);
  interaction.events.on('onReleaseGrip', handleOnGripRelease);

  var oldParent = void 0;
  var oldPosition = new THREE.Vector3();
  var oldRotation = new THREE.Euler();

  var rotationGroup = new THREE.Group();
  rotationGroup.scale.set(0.3, 0.3, 0.3);
  rotationGroup.position.set(-0.015, 0.015, 0.0);

  function handleOnGrip() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var inputObject = _ref2.inputObject;


    var folder = group.folder;
    if (folder === undefined) {
      return;
    }

    oldPosition.copy(folder.position);
    oldRotation.copy(folder.rotation);

    folder.position.set(0, 0.0, 0);
    folder.rotation.x = -Math.PI * 0.5;

    oldParent = folder.parent;

    rotationGroup.add(folder);

    inputObject.add(rotationGroup);
  }

  function handleOnGripRelease() {
    var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var inputObject = _ref3.inputObject;


    console.log('releasing grip');
    var folder = group.folder;
    if (folder === undefined) {
      return;
    }
    if (oldParent === undefined) {
      return;
    }

    oldParent.add(folder);
    oldParent = undefined;

    folder.position.copy(oldPosition);
    folder.rotation.copy(oldRotation);
  }

  return interaction;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  * 
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  * 
  *     http://www.apache.org/licenses/LICENSE-2.0
  * 
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"./interaction":9}],12:[function(require,module,exports){
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

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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

},{"./font":6,"parse-bmfont-ascii":18,"three-bmfont-text":19,"three-bmfont-text/shaders/sdf":35}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FOLDER = exports.LOCATOR = exports.PANEL = undefined;

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var PANEL = exports.PANEL = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: THREE.VertexColors }); /**
                                                                                                                * dat-guiVR Javascript Controller Library for VR
                                                                                                                * https://github.com/dataarts/dat.guiVR
                                                                                                                *
                                                                                                                * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                * 
                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                * You may obtain a copy of the License at
                                                                                                                * 
                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                * 
                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                * limitations under the License.
                                                                                                                */

var LOCATOR = exports.LOCATOR = new THREE.MeshBasicMaterial();
var FOLDER = exports.FOLDER = new THREE.MeshBasicMaterial({ color: 0x000000 });

},{"./colors":3}],14:[function(require,module,exports){
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

var _palette = require('./palette');

var Palette = _interopRequireWildcard(_palette);

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
  var paletteInteraction = Palette.create({ group: group, panel: panel });

  group.update = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    paletteInteraction.update(inputObjects);

    if (state.listen) {
      listenUpdate();
      updateValueLabel(state.value);
      updateSlider(state.alpha);
    }
    updateView();
  };

  return group;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  * 
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  * 
  *     http://www.apache.org/licenses/LICENSE-2.0
  * 
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

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

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./palette":11,"./sharedmaterials":13,"./textlabel":15}],15:[function(require,module,exports){
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

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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

},{"./colors":3,"./sharedmaterials":13}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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

},{"./lib/utils":20,"./lib/vertices":21,"inherits":22,"layout-bmfont-text":23,"object-assign":17,"quad-indices":28,"three-buffer-vertex-data":32}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
},{"as-number":24,"indexof-property":25,"word-wrapper":26,"xtend":27}],24:[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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
},{"an-array":29,"dtype":30,"is-buffer":31}],29:[function(require,module,exports){
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{"flatten-vertex-data":33}],33:[function(require,module,exports){
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

},{"dtype":34}],34:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],35:[function(require,module,exports){
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

},{"object-assign":17}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcYnV0dG9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNoZWNrYm94LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNvbG9ycy5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxkcm9wZG93bi5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxmb2xkZXIuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcZm9udC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxncmFiLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGluZGV4LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGludGVyYWN0aW9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGxheW91dC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxwYWxldHRlLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHNkZnRleHQuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcc2hhcmVkbWF0ZXJpYWxzLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHNsaWRlci5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFx0ZXh0bGFiZWwuanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlLWJtZm9udC1hc2NpaS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9saWIvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbGliL3ZlcnRpY2VzLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9sYXlvdXQtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9ub2RlX21vZHVsZXMvYXMtbnVtYmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9sYXlvdXQtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL2luZGV4b2YtcHJvcGVydHkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9ub2RlX21vZHVsZXMvd29yZC13cmFwcGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9sYXlvdXQtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL3h0ZW5kL2ltbXV0YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9ub2RlX21vZHVsZXMvcXVhZC1pbmRpY2VzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvbm9kZV9tb2R1bGVzL2FuLWFycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvbm9kZV9tb2R1bGVzL2R0eXBlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvbm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9ub2RlX21vZHVsZXMvdGhyZWUtYnVmZmVyLXZlcnRleC1kYXRhL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy90aHJlZS1idWZmZXItdmVydGV4LWRhdGEvbm9kZV9tb2R1bGVzL2ZsYXR0ZW4tdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvc2hhZGVycy9zZGYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkMwQndCLGM7O0FBUHhCOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWSxNOztBQUNaOztJQUFZLE07O0FBQ1o7O0lBQVksZTs7QUFDWjs7SUFBWSxJOzs7Ozs7QUF4Qlo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQmUsU0FBUyxjQUFULEdBT1A7QUFBQSxtRUFBSixFQUFJOztBQUFBLE1BTk4sV0FNTSxRQU5OLFdBTU07QUFBQSxNQUxOLE1BS00sUUFMTixNQUtNO0FBQUEsK0JBSk4sWUFJTTtBQUFBLE1BSk4sWUFJTSxxQ0FKUyxXQUlUO0FBQUEsd0JBSE4sS0FHTTtBQUFBLE1BSE4sS0FHTSw4QkFIRSxPQUFPLFdBR1Q7QUFBQSx5QkFGTixNQUVNO0FBQUEsTUFGTixNQUVNLCtCQUZHLE9BQU8sWUFFVjtBQUFBLHdCQUROLEtBQ007QUFBQSxNQUROLEtBQ00sOEJBREUsT0FBTyxXQUNUOzs7QUFFTixNQUFNLGVBQWUsUUFBUSxHQUFSLEdBQWMsT0FBTyxZQUExQztBQUNBLE1BQU0sZ0JBQWdCLFNBQVMsT0FBTyxZQUF0QztBQUNBLE1BQU0sZUFBZSxLQUFyQjs7QUFFQSxNQUFNLFFBQVEsSUFBSSxNQUFNLEtBQVYsRUFBZDs7QUFFQSxNQUFNLFFBQVEsT0FBTyxXQUFQLENBQW9CLEtBQXBCLEVBQTJCLE1BQTNCLEVBQW1DLEtBQW5DLENBQWQ7QUFDQSxRQUFNLEdBQU4sQ0FBVyxLQUFYOztBQUVBO0FBQ0EsTUFBTSxPQUFPLElBQUksTUFBTSxXQUFWLENBQXVCLFlBQXZCLEVBQXFDLGFBQXJDLEVBQW9ELFlBQXBELENBQWI7QUFDQSxP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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbiogXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiogXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qIFxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ2hlY2tib3goIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcbiAgY29uc3QgQlVUVE9OX1dJRFRIID0gd2lkdGggKiAwLjUgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9ERVBUSCA9IGRlcHRoO1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcclxuICBncm91cC5hZGQoIHBhbmVsICk7XHJcblxyXG4gIC8vICBiYXNlIGNoZWNrYm94XHJcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQlVUVE9OX1dJRFRILCBCVVRUT05fSEVJR0hULCBCVVRUT05fREVQVEggKTtcclxuICByZWN0LnRyYW5zbGF0ZSggQlVUVE9OX1dJRFRIICogMC41LCAwLCAwICk7XHJcblxyXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcclxuXHJcbiAgLy8gIG91dGxpbmUgdm9sdW1lXHJcbiAgY29uc3Qgb3V0bGluZSA9IG5ldyBUSFJFRS5Cb3hIZWxwZXIoIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBvdXRsaW5lLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLk9VVExJTkVfQ09MT1IgKTtcclxuXHJcbiAgLy8gIGNoZWNrYm94IHZvbHVtZVxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5ERUZBVUxUX0NPTE9SLCBlbWlzc2l2ZTogQ29sb3JzLkVNSVNTSVZFX0NPTE9SIH0pO1xyXG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xyXG5cclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQlVUVE9OICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIG91dGxpbmUsIGNvbnRyb2xsZXJJRCApO1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xyXG5cclxuICB1cGRhdGVWaWV3KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoKXtcclxuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG5cclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkVNSVNTSVZFX0NPTE9SICk7XHJcblxyXG4gICAgICBpZiggc3RhdGUudmFsdWUgKXtcclxuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0NPTE9SICk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5JTkFDVElWRV9DT0xPUiApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG5cclxuICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCgge1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG9iamVjdCxcclxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcclxuICBpbml0aWFsVmFsdWUgPSBmYWxzZSxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuICBjb25zdCBDSEVDS0JPWF9XSURUSCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQ0hFQ0tCT1hfSEVJR0hUID0gQ0hFQ0tCT1hfV0lEVEg7XHJcbiAgY29uc3QgQ0hFQ0tCT1hfREVQVEggPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgSU5BQ1RJVkVfU0NBTEUgPSAwLjAwMTtcclxuICBjb25zdCBBQ1RJVkVfU0NBTEUgPSAwLjk7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgdmFsdWU6IGluaXRpYWxWYWx1ZSxcclxuICAgIGxpc3RlbjogZmFsc2VcclxuICB9O1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcclxuICBncm91cC5hZGQoIHBhbmVsICk7XHJcblxyXG4gIC8vICBiYXNlIGNoZWNrYm94XHJcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQ0hFQ0tCT1hfV0lEVEgsIENIRUNLQk9YX0hFSUdIVCwgQ0hFQ0tCT1hfREVQVEggKTtcclxuICByZWN0LnRyYW5zbGF0ZSggQ0hFQ0tCT1hfV0lEVEggKiAwLjUsIDAsIDAgKTtcclxuXHJcblxyXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcclxuXHJcbiAgLy8gIG91dGxpbmUgdm9sdW1lXHJcbiAgY29uc3Qgb3V0bGluZSA9IG5ldyBUSFJFRS5Cb3hIZWxwZXIoIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBvdXRsaW5lLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLk9VVExJTkVfQ09MT1IgKTtcclxuXHJcbiAgLy8gIGNoZWNrYm94IHZvbHVtZVxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5ERUZBVUxUX0NPTE9SLCBlbWlzc2l2ZTogQ29sb3JzLkVNSVNTSVZFX0NPTE9SIH0pO1xyXG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XHJcbiAgZmlsbGVkVm9sdW1lLnNjYWxlLnNldCggQUNUSVZFX1NDQUxFLCBBQ1RJVkVfU0NBTEUsQUNUSVZFX1NDQUxFICk7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xyXG5cclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQ0hFQ0tCT1ggKTtcclxuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xyXG5cclxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgb3V0bGluZSwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIC8vIGdyb3VwLmFkZCggZmlsbGVkVm9sdW1lLCBvdXRsaW5lLCBoaXRzY2FuVm9sdW1lLCBkZXNjcmlwdG9yTGFiZWwgKTtcclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggaGl0c2NhblZvbHVtZSApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcclxuXHJcbiAgdXBkYXRlVmlldygpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlLnZhbHVlID0gIXN0YXRlLnZhbHVlO1xyXG5cclxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBzdGF0ZS52YWx1ZTtcclxuXHJcbiAgICBpZiggb25DaGFuZ2VkQ0IgKXtcclxuICAgICAgb25DaGFuZ2VkQ0IoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcblxyXG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XHJcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9FTUlTU0lWRV9DT0xPUiApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbWF0ZXJpYWwuZW1pc3NpdmUuc2V0SGV4KCBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgKTtcclxuXHJcbiAgICAgIGlmKCBzdGF0ZS52YWx1ZSApe1xyXG4gICAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfQ09MT1IgKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLklOQUNUSVZFX0NPTE9SICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiggc3RhdGUudmFsdWUgKXtcclxuICAgICAgZmlsbGVkVm9sdW1lLnNjYWxlLnNldCggQUNUSVZFX1NDQUxFLCBBQ1RJVkVfU0NBTEUsIEFDVElWRV9TQ0FMRSApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgZmlsbGVkVm9sdW1lLnNjYWxlLnNldCggSU5BQ1RJVkVfU0NBTEUsIElOQUNUSVZFX1NDQUxFLCBJTkFDVElWRV9TQ0FMRSApO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGxldCBvbkNoYW5nZWRDQjtcclxuICBsZXQgb25GaW5pc2hDaGFuZ2VDQjtcclxuXHJcbiAgZ3JvdXAub25DaGFuZ2UgPSBmdW5jdGlvbiggY2FsbGJhY2sgKXtcclxuICAgIG9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG5cclxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpZiggc3RhdGUubGlzdGVuICl7XHJcbiAgICAgIHN0YXRlLnZhbHVlID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXTtcclxuICAgIH1cclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qIFxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qIFxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKiBcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmV4cG9ydCBjb25zdCBERUZBVUxUX0NPTE9SID0gMHgyRkExRDY7XHJcbmV4cG9ydCBjb25zdCBISUdITElHSFRfQ09MT1IgPSAweDBGQzNGRjtcclxuZXhwb3J0IGNvbnN0IElOVEVSQUNUSU9OX0NPTE9SID0gMHgwN0FCRjc7XHJcbmV4cG9ydCBjb25zdCBFTUlTU0lWRV9DT0xPUiA9IDB4MjIyMjIyO1xyXG5leHBvcnQgY29uc3QgSElHSExJR0hUX0VNSVNTSVZFX0NPTE9SID0gMHg5OTk5OTk7XHJcbmV4cG9ydCBjb25zdCBPVVRMSU5FX0NPTE9SID0gMHg5OTk5OTk7XHJcbmV4cG9ydCBjb25zdCBERUZBVUxUX0JBQ0sgPSAweDEzMTMxM1xyXG5leHBvcnQgY29uc3QgSElHSExJR0hUX0JBQ0sgPSAweDQ5NDk0OTtcclxuZXhwb3J0IGNvbnN0IElOQUNUSVZFX0NPTE9SID0gMHgxNjE4Mjk7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1NMSURFUiA9IDB4MmZhMWQ2O1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9DSEVDS0JPWCA9IDB4ODA2Nzg3O1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9CVVRUT04gPSAweGU2MWQ1ZjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfVEVYVCA9IDB4MWVkMzZmO1xyXG5leHBvcnQgY29uc3QgRFJPUERPV05fQkdfQ09MT1IgPSAweGZmZmZmZjtcclxuZXhwb3J0IGNvbnN0IERST1BET1dOX0ZHX0NPTE9SID0gMHgwMDAwMDA7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29sb3JpemVHZW9tZXRyeSggZ2VvbWV0cnksIGNvbG9yICl7XHJcbiAgZ2VvbWV0cnkuZmFjZXMuZm9yRWFjaCggZnVuY3Rpb24oZmFjZSl7XHJcbiAgICBmYWNlLmNvbG9yLnNldEhleChjb2xvcik7XHJcbiAgfSk7XHJcbiAgZ2VvbWV0cnkuY29sb3JzTmVlZFVwZGF0ZSA9IHRydWU7XHJcbiAgcmV0dXJuIGdlb21ldHJ5O1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qIFxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qIFxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKiBcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IGZhbHNlLFxyXG4gIG9wdGlvbnMgPSBbXSxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICBvcGVuOiBmYWxzZSxcclxuICAgIGxpc3RlbjogZmFsc2VcclxuICB9O1xyXG5cclxuICBjb25zdCBEUk9QRE9XTl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBEUk9QRE9XTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IERST1BET1dOX0RFUFRIID0gZGVwdGg7XHJcbiAgY29uc3QgRFJPUERPV05fT1BUSU9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU4gKiAxLjg7XHJcbiAgY29uc3QgRFJPUERPV05fTUFSR0lOID0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XHJcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xyXG5cclxuICBncm91cC5oaXRzY2FuID0gWyBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBsYWJlbEludGVyYWN0aW9ucyA9IFtdO1xyXG4gIGNvbnN0IG9wdGlvbkxhYmVscyA9IFtdO1xyXG5cclxuICAvLyAgZmluZCBhY3R1YWxseSB3aGljaCBsYWJlbCBpcyBzZWxlY3RlZFxyXG4gIGNvbnN0IGluaXRpYWxMYWJlbCA9IGZpbmRMYWJlbEZyb21Qcm9wKCk7XHJcblxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZmluZExhYmVsRnJvbVByb3AoKXtcclxuICAgIGlmKCBBcnJheS5pc0FycmF5KCBvcHRpb25zICkgKXtcclxuICAgICAgcmV0dXJuIG9wdGlvbnMuZmluZCggZnVuY3Rpb24oIG9wdGlvbk5hbWUgKXtcclxuICAgICAgICByZXR1cm4gb3B0aW9uTmFtZSA9PT0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvcHRpb25zKS5maW5kKCBmdW5jdGlvbiggb3B0aW9uTmFtZSApe1xyXG4gICAgICAgIHJldHVybiBvYmplY3RbcHJvcGVydHlOYW1lXSA9PT0gb3B0aW9uc1sgb3B0aW9uTmFtZSBdO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbiggbGFiZWxUZXh0LCBpc09wdGlvbiApe1xyXG4gICAgY29uc3QgbGFiZWwgPSBjcmVhdGVUZXh0TGFiZWwoIHRleHRDcmVhdG9yLCBsYWJlbFRleHQsIERST1BET1dOX1dJRFRILCBkZXB0aCwgQ29sb3JzLkRST1BET1dOX0ZHX0NPTE9SLCBDb2xvcnMuRFJPUERPV05fQkdfQ09MT1IgKVxyXG4gICAgZ3JvdXAuaGl0c2Nhbi5wdXNoKCBsYWJlbC5iYWNrICk7XHJcbiAgICBjb25zdCBsYWJlbEludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGxhYmVsLmJhY2sgKTtcclxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLnB1c2goIGxhYmVsSW50ZXJhY3Rpb24gKTtcclxuICAgIG9wdGlvbkxhYmVscy5wdXNoKCBsYWJlbCApO1xyXG5cclxuXHJcbiAgICBpZiggaXNPcHRpb24gKXtcclxuICAgICAgbGFiZWxJbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHNlbGVjdGVkTGFiZWwuc2V0U3RyaW5nKCBsYWJlbFRleHQgKTtcclxuXHJcbiAgICAgICAgbGV0IHByb3BlcnR5Q2hhbmdlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XHJcbiAgICAgICAgICBwcm9wZXJ0eUNoYW5nZWQgPSBvYmplY3RbIHByb3BlcnR5TmFtZSBdICE9PSBsYWJlbFRleHQ7XHJcbiAgICAgICAgICBpZiggcHJvcGVydHlDaGFuZ2VkICl7XHJcbiAgICAgICAgICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBsYWJlbFRleHQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBwcm9wZXJ0eUNoYW5nZWQgPSBvYmplY3RbIHByb3BlcnR5TmFtZSBdICE9PSBvcHRpb25zWyBsYWJlbFRleHQgXTtcclxuICAgICAgICAgIGlmKCBwcm9wZXJ0eUNoYW5nZWQgKXtcclxuICAgICAgICAgICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IG9wdGlvbnNbIGxhYmVsVGV4dCBdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGNvbGxhcHNlT3B0aW9ucygpO1xyXG4gICAgICAgIHN0YXRlLm9wZW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYoIG9uQ2hhbmdlZENCICYmIHByb3BlcnR5Q2hhbmdlZCApe1xyXG4gICAgICAgICAgb25DaGFuZ2VkQ0IoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBpZiggc3RhdGUub3BlbiA9PT0gZmFsc2UgKXtcclxuICAgICAgICAgIG9wZW5PcHRpb25zKCk7XHJcbiAgICAgICAgICBzdGF0ZS5vcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIGNvbGxhcHNlT3B0aW9ucygpO1xyXG4gICAgICAgICAgc3RhdGUub3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBsYWJlbC5pc09wdGlvbiA9IGlzT3B0aW9uO1xyXG4gICAgcmV0dXJuIGxhYmVsO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29sbGFwc2VPcHRpb25zKCl7XHJcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGxhYmVsLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICBsYWJlbC5iYWNrLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvcGVuT3B0aW9ucygpe1xyXG4gICAgb3B0aW9uTGFiZWxzLmZvckVhY2goIGZ1bmN0aW9uKCBsYWJlbCApe1xyXG4gICAgICBpZiggbGFiZWwuaXNPcHRpb24gKXtcclxuICAgICAgICBsYWJlbC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBsYWJlbC5iYWNrLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vICBiYXNlIG9wdGlvblxyXG4gIGNvbnN0IHNlbGVjdGVkTGFiZWwgPSBjcmVhdGVPcHRpb24oIGluaXRpYWxMYWJlbCwgZmFsc2UgKTtcclxuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTUFSR0lOICogMiArIHdpZHRoICogMC41O1xyXG4gIHNlbGVjdGVkTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG5cclxuICBzZWxlY3RlZExhYmVsLmFkZCgoZnVuY3Rpb24gY3JlYXRlRG93bkFycm93KCl7XHJcbiAgICBjb25zdCB3ID0gMC4wMTU7XHJcbiAgICBjb25zdCBoID0gMC4wMztcclxuICAgIGNvbnN0IHNoID0gbmV3IFRIUkVFLlNoYXBlKCk7XHJcbiAgICBzaC5tb3ZlVG8oMCwwKTtcclxuICAgIHNoLmxpbmVUbygtdyxoKTtcclxuICAgIHNoLmxpbmVUbyh3LGgpO1xyXG4gICAgc2gubGluZVRvKDAsMCk7XHJcblxyXG4gICAgY29uc3QgZ2VvID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkoIHNoICk7XHJcbiAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggZ2VvLCBDb2xvcnMuRFJPUERPV05fRkdfQ09MT1IgKTtcclxuICAgIGdlby50cmFuc2xhdGUoIERST1BET1dOX1dJRFRIIC0gdyAqIDQsIC1EUk9QRE9XTl9IRUlHSFQgKiAwLjUgKyBoICogMC41ICwgZGVwdGggKiAxLjAxICk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBnZW8sIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xyXG4gIH0pKCkpO1xyXG5cclxuXHJcbiAgZnVuY3Rpb24gY29uZmlndXJlTGFiZWxQb3NpdGlvbiggbGFiZWwsIGluZGV4ICl7XHJcbiAgICBsYWJlbC5wb3NpdGlvbi55ID0gLURST1BET1dOX01BUkdJTiAtIChpbmRleCsxKSAqICggRFJPUERPV05fT1BUSU9OX0hFSUdIVCApO1xyXG4gICAgbGFiZWwucG9zaXRpb24ueiA9IGRlcHRoICogMjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wdGlvblRvTGFiZWwoIG9wdGlvbk5hbWUsIGluZGV4ICl7XHJcbiAgICBjb25zdCBvcHRpb25MYWJlbCA9IGNyZWF0ZU9wdGlvbiggb3B0aW9uTmFtZSwgdHJ1ZSApO1xyXG4gICAgY29uZmlndXJlTGFiZWxQb3NpdGlvbiggb3B0aW9uTGFiZWwsIGluZGV4ICk7XHJcbiAgICByZXR1cm4gb3B0aW9uTGFiZWw7XHJcbiAgfVxyXG5cclxuICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XHJcbiAgICBzZWxlY3RlZExhYmVsLmFkZCggLi4ub3B0aW9ucy5tYXAoIG9wdGlvblRvTGFiZWwgKSApO1xyXG4gIH1cclxuICBlbHNle1xyXG4gICAgc2VsZWN0ZWRMYWJlbC5hZGQoIC4uLk9iamVjdC5rZXlzKG9wdGlvbnMpLm1hcCggb3B0aW9uVG9MYWJlbCApICk7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29sbGFwc2VPcHRpb25zKCk7XHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX1NMSURFUiApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBjb250cm9sbGVySUQsIHNlbGVjdGVkTGFiZWwgKTtcclxuXHJcblxyXG4gIHVwZGF0ZVZpZXcoKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG5cclxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBpbnRlcmFjdGlvbiwgaW5kZXggKXtcclxuICAgICAgY29uc3QgbGFiZWwgPSBvcHRpb25MYWJlbHNbIGluZGV4IF07XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGxhYmVsLmJhY2suZ2VvbWV0cnksIENvbG9ycy5EUk9QRE9XTl9CR19DT0xPUiApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBsZXQgb25DaGFuZ2VkQ0I7XHJcbiAgbGV0IG9uRmluaXNoQ2hhbmdlQ0I7XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBvbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgc2VsZWN0ZWRMYWJlbC5zZXRTdHJpbmcoIGZpbmRMYWJlbEZyb21Qcm9wKCkgKTtcclxuICAgIH1cclxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBsYWJlbEludGVyYWN0aW9uICl7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIH0pO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcbmltcG9ydCAqIGFzIFBhbGV0dGUgZnJvbSAnLi9wYWxldHRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUZvbGRlcih7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgbmFtZVxyXG59ID0ge30gKXtcclxuXHJcbiAgY29uc3Qgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEg7XHJcblxyXG4gIGNvbnN0IHNwYWNpbmdQZXJDb250cm9sbGVyID0gTGF5b3V0LlBBTkVMX0hFSUdIVCArIExheW91dC5QQU5FTF9TUEFDSU5HO1xyXG5cclxuICBjb25zdCBzdGF0ZSA9IHtcclxuICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICBwcmV2aW91c1BhcmVudDogdW5kZWZpbmVkXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBjb25zdCBjb2xsYXBzZUdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgZ3JvdXAuYWRkKCBjb2xsYXBzZUdyb3VwICk7XHJcblxyXG4gIC8vICBZZWFoLiBHcm9zcy5cclxuICBjb25zdCBhZGRPcmlnaW5hbCA9IFRIUkVFLkdyb3VwLnByb3RvdHlwZS5hZGQ7XHJcbiAgYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIGNvbGxhcHNlR3JvdXAgKTtcclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gY3JlYXRlVGV4dExhYmVsKCB0ZXh0Q3JlYXRvciwgJy0gJyArIG5hbWUsIDAuNiApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCAqIDAuNTtcclxuXHJcbiAgYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIGRlc2NyaXB0b3JMYWJlbCApO1xyXG5cclxuICAvLyBjb25zdCBwYW5lbCA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIHdpZHRoLCAxLCBMYXlvdXQuUEFORUxfREVQVEggKSwgU2hhcmVkTWF0ZXJpYWxzLkZPTERFUiApO1xyXG4gIC8vIHBhbmVsLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGggKiAwLjUsIDAsIC1MYXlvdXQuUEFORUxfREVQVEggKTtcclxuICAvLyBhZGRPcmlnaW5hbC5jYWxsKCBncm91cCwgcGFuZWwgKTtcclxuXHJcbiAgLy8gY29uc3QgaW50ZXJhY3Rpb25Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgMSwgTGF5b3V0LlBBTkVMX0RFUFRIICksIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6MHgwMDAwMDB9KSApO1xyXG4gIC8vIGludGVyYWN0aW9uVm9sdW1lLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGggKiAwLjUgLSBMYXlvdXQuUEFORUxfTUFSR0lOLCAwLCAtTGF5b3V0LlBBTkVMX0RFUFRIICk7XHJcbiAgLy8gYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIGludGVyYWN0aW9uVm9sdW1lICk7XHJcbiAgLy8gaW50ZXJhY3Rpb25Wb2x1bWUudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAvLyBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xyXG4gIC8vIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZVByZXNzICk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVByZXNzKCl7XHJcbiAgICBzdGF0ZS5jb2xsYXBzZWQgPSAhc3RhdGUuY29sbGFwc2VkO1xyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuYWRkID0gZnVuY3Rpb24oIC4uLmFyZ3MgKXtcclxuICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24oIG9iaiApe1xyXG4gICAgICBjb25zdCBjb250YWluZXIgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgICAgY29udGFpbmVyLmFkZCggb2JqICk7XHJcbiAgICAgIGNvbGxhcHNlR3JvdXAuYWRkKCBjb250YWluZXIgKTtcclxuICAgICAgb2JqLmZvbGRlciA9IGdyb3VwO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIHBlcmZvcm1MYXlvdXQoKXtcclxuICAgIGNvbGxhcHNlR3JvdXAuY2hpbGRyZW4uZm9yRWFjaCggZnVuY3Rpb24oIGNoaWxkLCBpbmRleCApe1xyXG4gICAgICBjaGlsZC5wb3NpdGlvbi55ID0gLShpbmRleCsxKSAqIHNwYWNpbmdQZXJDb250cm9sbGVyICsgTGF5b3V0LlBBTkVMX0hFSUdIVCAqIDAuNTtcclxuICAgICAgaWYoIHN0YXRlLmNvbGxhcHNlZCApe1xyXG4gICAgICAgIGNoaWxkLmNoaWxkcmVuWzBdLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgIGNoaWxkLmNoaWxkcmVuWzBdLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiggc3RhdGUuY29sbGFwc2VkICl7XHJcbiAgICAgIGRlc2NyaXB0b3JMYWJlbC5zZXRTdHJpbmcoICcrICcgKyBuYW1lICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBkZXNjcmlwdG9yTGFiZWwuc2V0U3RyaW5nKCAnLSAnICsgbmFtZSApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnN0IHRvdGFsSGVpZ2h0ID0gY29sbGFwc2VHcm91cC5jaGlsZHJlbi5sZW5ndGggKiBzcGFjaW5nUGVyQ29udHJvbGxlcjtcclxuICAgIC8vIHBhbmVsLmdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgdG90YWxIZWlnaHQsIExheW91dC5QQU5FTF9ERVBUSCApO1xyXG4gICAgLy8gcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCAqIDAuNSwgLXRvdGFsSGVpZ2h0ICogMC41LCAtTGF5b3V0LlBBTkVMX0RFUFRIICk7XHJcbiAgICAvLyBwYW5lbC5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZUxhYmVsKCl7XHJcbiAgICAvLyBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgLy8gICBkZXNjcmlwdG9yTGFiZWwuYmFjay5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQkFDSyApO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gZWxzZXtcclxuICAgICAgLy8gZGVzY3JpcHRvckxhYmVsLmJhY2subWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9CQUNLICk7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICBncm91cC5mb2xkZXIgPSBncm91cDtcclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWw6IGRlc2NyaXB0b3JMYWJlbC5iYWNrIH0gKTtcclxuICBjb25zdCBwYWxldHRlSW50ZXJhY3Rpb24gPSBQYWxldHRlLmNyZWF0ZSggeyBncm91cCwgcGFuZWw6IGRlc2NyaXB0b3JMYWJlbC5iYWNrIH0gKTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBwYWxldHRlSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHVwZGF0ZUxhYmVsKCk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAucGluVG8gPSBmdW5jdGlvbiggbmV3UGFyZW50ICl7XHJcbiAgICBjb25zdCBvbGRQYXJlbnQgPSBncm91cC5wYXJlbnQ7XHJcblxyXG4gICAgaWYoIGdyb3VwLnBhcmVudCApe1xyXG4gICAgICBncm91cC5wYXJlbnQucmVtb3ZlKCBncm91cCApO1xyXG4gICAgfVxyXG4gICAgbmV3UGFyZW50LmFkZCggZ3JvdXAgKTtcclxuXHJcbiAgICByZXR1cm4gb2xkUGFyZW50O1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLmhpdHNjYW4gPSBbIGRlc2NyaXB0b3JMYWJlbC5iYWNrIF07XHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW1hZ2UoKXtcclxuICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gIGltYWdlLnNyYyA9IGBkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQWdBQUFBRUFDQVlBQUFERmtNNW5BQUNBQUVsRVFWUjQydXk5QjNkY1I3SW0yTHQ3ZHMvTW05blpubWY2dmJicWxsb3Q3eVdLcE9oQUN4SUVRSGlQZ3ZmZSt3T2dDcDdkUGY4NHQ2Q1gwZlhWVnhGNTgxWVZRRTAzZVU0ZVNkU3RhOUpFZkJIeFJjVFBuSE9OK2RHYUh4MzUwWmt3T3Z5MWw3OTU0Zi9aa2gvdEtYNzdLai9xRW43YmxoL04rVkdmSDdYNThVViszTWlQdS9ueDJELzdsYit1S3o5NmpkSGxyM25sZi9QWTMrUHlmdC9seCszOGVKQWZULzA3eVQyNzg2TXZQekorOU1HOUd1R2EvdndZOE9QeXVoNy9uZmp1RC9QalRuNThueDlmNWNmSC9sdnUrUDlYNjY5dG91L3A5L2ZVN3E4OXU5Ky9aN2VmMDh0M2FNaVA1L254eUgvM1RmOE9mOHFQei9MajIvejRBZDZqd2E5SnAzK1dOcWQ0LzVkKzdpN244RC95NC9mNThVRitmTzduOTQ1LzluUFlaOXE5ZS96ZnR5U3NxL1hzVy9ueGRYNThraDkvekkvZitqbitBZGIzaGYrK1pyaC9ENjN6UUdCT08vMzdOL24xZXU3MzAzMi9qNzcxMy8xUmZyeVhIMS82T2JpVll0OXEzM2Y1dTVyOHVPZWZrM1JlK1l3KzhiKzlDZnZ2OHYxK2t4Ly9saC8vbkIvL1gzNzg5L3o0ci9ueC8rYkh6L1BqWC8wMTcvbmZmT1h2Y2MvZjgwWEV1N1Q3TlczMDgvV05uNDk3L3J1ZTA1cDAram5ROWtlM0lSdXFPUisveUk5L2dmbW81cjEvbFIrLzlNLzQxekx1ZmNmdkE5ekxyL3hjdE1KbzhYLzN5bC96d3Y4R1pRM09kOUthWGM3SHIvUGpYYiszWlIvYzk5OWI1ODlFdTErak5MTDRucGVMWC9wN3Yrdm5xUVhrWEcvRTBQWkhvMyszWnlTRFVTNDhnYmxzb2oySU1wamxjQWJrZ3p5L1M5RnhUOHY0RnJrZmZsTzd2Ni9JZFBtdVIzNE9iL216OWRuUDB2N3hOKzhoaFdLTmZuOXRPeW5MbU4raUFtc0svRllVcmlpRWV2OXh0LzBCa0VNdjczMzVtK0g4R0tFeDdQK2Z2RytqLzIyTkY5YXMvSnY4dThrOUwrOHg3c2VJLzd0dXZ4RGQvcjlIODJQQ2o3SDhHRkxlSFVIQURROCtmcUFES1VxM0Y3NW4xRCtiNzkrclBIdmMvLy9MOXh3RXdOS3FnSURMZC9qUUg3cnYvVUYrQ3UvUjVkZGdTSmxUdkgrbm43TTZmNWhGU0lpeXVPWG45NWwvQjVtM2pMSmVRLzd2dXhMV0ZaL2RETStXNy9yY0E1QjMvQnpYMFBxSzR1MVQ1aG5ubXVkMENQWnZweUwwR1FSOFNJTG1jZVMrNWJtdDkrOWU2NS96SU9LODhobDk0ZGYramdja24za0ErSTRIU3I4Q3hTZUsvei84ZXY0T3dDSUNPZ0V5TWUvU0RjRDVKaWwvVVlLNEprUEt2QXpER3ZENXF0WjgvRjZaajJyZCt6MS9Objd2NS9UWFpkeGJNeFk2RmNYQ3lyQUo1QkRLbWo0RjlHcHI5Z3YvenU4clJzTnovMjRkL3RtRGhzelFaUEZ6ZjQ4ZnZIei8xRC9qdC83OStnTXlhQ1JoZnlDUVpobk1jdUVWekdVdnliNHhSVGFNd3hnRitUQ282TGk2TXI1RnZrZSthUUNBUmhjQW5BWXdRdjRHQXNvQkFEMys1VWRKQUdwajFGL2JBd3A4SVBLM3FNRGFBNzhkOXgvZkQ0THdPN0NpWHZwTjNPM2Y1Zkw2NmZ5WW9USHQvOStndjdiRi8vYXhuNno3aXZMdjllOG85NXozWTlxL1p3WVdkQlN1V2NpUFdmLysrTzRpcEo3NVRTZEtncFd1M0hQWVAzdkszMitPN2o4T2E0WFBudmZYVHZ0M0dBR0ZLaUNnRnQ3aEUyOHgzNGFEM09UZkkrUHZQNlhNNlF4OFk2L2ZBdzMrKzM3ckQvQ25JQ1JFV1RUN2R4bncrNER2UFFYekcxcFhlWFlmZ2JvSFlIV0pKVkhqMyt1bGYzNEhnS2NSbXVkNW1Nc0YrTzg1ZUw4eEVETGRKUFFGQk53Q1ljYUNwakZpMytMY2R2ajViU0ZySnVtODhobHQ4Tzl3MzgrUldGc2ZlRy9KSC96YVhWcW4vKzZWMHp0K0R0OEhzSGdUOW0yRHYzZk11d3pBK1dPUEVNb1FYSk5wT3NlWFk5S1FEZFdZajQ5cFBuN25nVUExN3YySkh4Lzd1WHpmejIzYWUydkdRa1lCVEtnTWUwa09OU3V5Sm1uTmZ1bm5CSTJHZXlDL1d2MDdEa1hLNGg3L20zcndtSWhoOUlFSFNYMytXeVlOR1RRVDJCOE1wRmtHbzF4Z293L2w3d3pJWDBzMnpJSjgwSFJjWThwdjRXL0MrNG9SaXNaZEk0T0FjZ0NBQ09VWitFaHJ6UGhyQndLSzBCcXpwSkN0Mzg3NXlVSWxjd00yWFlPZjNENy8rOHQzV3NxUEZScEwvditOZ3NLUUEzb1BYTEtzL0NmOHUxNytmczJQUmI4WVF5REFKLzM3WHY3L2pmeFlobmNmQVNHbHVhdngyVEtQc2tubS9MTlgvYjNYL2YyWC9GeU5LTTllOS8rKzVPY1NGV29YZ0I4NWNLS2s3L2gzcWZQWHlFR2U4dmZuT1pWdkhJYzkwT1EzNFR2Zy9yOEJydUo2djRhOS90Mm4vWHppZlJkZ2ZxMTFsV2RQK1BudjhuUDdnaXdKQ1FNOEJlVXZGZzhLcVRtNFA4Nnp6S2ZNNmJKLzMxbVkxMEhGOGtPWDVsZUtvR21uZlc5OTN6aFlFMzFLV0NEcHZQSVpsZlVSOFBlTmY3L1AvVDc0ME0rWFdNRHZlcXYxSTIveGZRRmdzWWJBWXVoZEVEajMrek5XbzNpRTVCNnlKb3QrTG5CZVpBMDAyVkN0K2ZnQzV1TjlQeC9WdUxlTXI3MEMvY3pQYmRwN3M3RWdlM2xTQVV5aURJZklHT253ZTJvWVpFM1NtdjNHNzQ5UHlCTXIxcjhZRFdNZ04wT3lXTzc3Q293U0NlRkp5R1RRbi9ONTVWNmFUSkw5TVU5R0VINjd5R0NXQ3lMM3hUREJQYmdLc2tDVERhdit1aVZEeHpXbi9CYnJtK1lBUkkyQUVkTEdJS0FjQUNBQ2Y1RStsTWM2S2NJZVF4RmFBeFZZYitDM3EvNkR4MkN6aUt2Nm1mL2dEajhKNDM2Q0x0OXRoOGE2LzMvai90b08vOXRuWVBXS1M1YVYvN0ovbDkzODJQYi9QZTBQRGlySnkyL2F5bys5L05qMDd6NFBJS0NQM0VIaXJuNEdWbFF2SE1oNWY0OU4vdzJYOTkzMy83N2lEOUVJUFh2Zlg3ZnIvM3NORk9vSUhUZ1JUcCtCVitXSlB4Q3RvS1JuL1BPMmFVNDNGVEFrU3BoamhBL0E3ZDBCUW1MT2Y2UGNjNXUrelZyWFRkaERvZ0JhQWRqYzlkLzB1VmRnQ081RTZDRzRrM25laG5tK0hJZnc3N0wrRy80ZEYvMTdqaE1JUUplbXVIODFRWU1Xbi9aOWl5VEFSNVd3UU9pOGFtZTB4ZSs5UitBQ3ZlbEIyamRlOFgwQ0Z2Q0hmbjk4NVVIaTkxNUFpMGRIQTR2YXU4ZytuQVRBSm1DVFBVSUNDbkZOY0g5c0JXUkROZWJqbGpFZmxkejdCeHEzL0Z4KzY0RkEybnMzSzhiQ3JBR1lCTEN5TWRJRGNrN09ZZEthdlVPOEhzMFRPK1Ivcytqdm84bGl2RzgzaGZBNFpETHM5OFN5WC91ZHdNRDlnVWJRSk1tL0ppOFQ2Z0p5WVJIbVJQYWd5SUlEUC9aQjV2THpXY2UxcHZ3V3VaK01UVDkzcS83ZWMrQ05IRkJBd01OeUFBQys0TFlYZ05xSVVZVFdiMW1COVJxLzNUY1Vkd3dBdVB6dHNSLzdDUUFBM1Zmb2trWGxmN25BdWNqdnp2cG5iZ0VJbUZEY1FZSjRSVG1KRUJ5SEF5bEsvZkxaSi81N1FnQWc2Njg3Z25YQ2d6d0U3anc1Y0F3QTZnMEFzQU56bXZYUFd6SUFBRm9KRWlORTk3OGc0UVUvdi9zd3Z4b0FtUFBmSWVzZ2N6QUxsa1E3ckNtNlhUOGtjRGNNUW04WmhOU0J2L2ZsOTUzU09JSHYzdmZ2dVE3V2pPYlNSUGR2SFZqS2ZlQmVuUEg3WXduMnJjd3RXaE56UnNnbGRGNjF2U3JyL3NTdi9VTVB6dTU2YSs2R3Q3NCs4K3YzaFYvRG0zNGQ3L25ySHluZW90QzdhSHZsR1hudzBDTzBCbXVTOWV0eTVQK1pEWnpwY3VkRENKYVAvUGZkVSthajNIcy9Va2FOM3hzL2VIbVc5dDd0WkwyTFJibWhBQ1lCckd5TURKQ2MyL1R6SFZxemQ0a0UrZ0RrTUh0aXhXaklLbkpqR1pSalgwSjRpdWNtQi9mRGdmdmpBSXdnTk1TRzZJekd5SVY5K0lZVFJUYWdmTWdGZEZ4cmltODVodnZKTngyQ0FTZ0dwaGdKWThSTCt6RVVXdzBBY1Bud2MvcllOSW9RZjNkdUtMRGVnQkt0QkFESWM1TUFRSjBTOHhhWHJDai9JLzlPTWQ5OTREZkVnZi92RmNVZGhHNTRGcUpUOE94OTJGeUhrUjZBUS8rK3AzQ1FWeWdFZ2djdUxRQzRpQUFBZnlJcmdUMExzczhZTExKWHdSSW9lN0NtRTRyYjlhRVg0SklOd1BIMk9YKy9UUUFWc2wrTzRIMWtQa1VBblBuMXlIb0JzMDR1elF5OEI1TEFMRUVqaW4vTGY1c0lHODJhMFVJdTFubk5CWlJTZzEvamwvNGRoVlJZNDlmcWxyZE12L0lLOExZL2J3LzlmcW4xdjNzSnJ1aWV3THRZZTBVRHZ2T2cvRkYrSElPd1BFa0JBS294SHpjOUNDcm4zblhHZUE1cy9IdGwzTHNiUURRYkMxbFNISm94Z3R3aGxIUEhzUC9XNkh4MUtlUS9qZGVESGkyNTU1LzlPUExuWmkwUVBud0lJWk5QamJsNURmdEM5c1NKUDU4WGNJNVpCby9CWG5rVktSZE9RSGVKSWthZ2xJWHJ6Z0k2cmpYeVcvaWI1TDRpZTNMKytUc1FrcDZtTU8rUEhwVnFBWUJUY25mc1J5ckNmUm9uMXd3QURoTThDWTJHK3gxZGNidHdtSFlOYXhvMy9TcWgzbjF3QjJseHIrY1FGKzlUWE80NUVIaGI0QkpFOTdkWTBoS2oyb1NEZCt6L2ZTM3cvVmNCQUpnc2h0YWV4TDFuNGI0NVE2bDNrM3QwTXdBV2VzaXpnYTdFRGlYZUxnRHJ5Qi93RTBEdlcrUU9sZENBS0tVejJCUG9vbVZDcEZnMElVR3o2NStMQ280RitKNFJjckVFU2k1Z09iWkRtcGlrU0wzMGlnOVRHYitIZExNbnNGY3gzYXdOR096YXU0VDJpZ1Y4WlkxUEFVaWpXM1F2SlFDSW1ZODJZejR3dFNydHZWdU1JV2w1bUQ2YTl0N29NVmtDNi8wRUFQS2VuMGMwUnBaQkRrMUJ5SFVIdkN5OHAwZUFOL1doOXdveCthOHRBT3d2ejhwZjh1T3ZvRXMybExQTElUeko1QW5ORGU2SlBUaEhwLzRhbE1GYTJDRkdMcHpDbkc2VFhOZ0NWejQrUHkwQXlDbnUvejNZNjRmZzNiMkFkOW9oWGhxdVZXTTFBY0ErRUI3V0EyUTRWa2JyZ0FTdkVnRDBVMHlaT1FkYXZGQVVZTFBoZnJjVU9STmorc0FTUitCd1JBZHF3WEJEb1dJY0EzZjNMaWp4SGY5T1FzNlpBZlE4QW9TVmhjRGFYU2NBK0NTQkxEWk9Wb0xsMWc5ZHY1M2cyYmp2OThvWENsa1R3ZDBGQ2NrMWNMMHZBRWx4SGR5ekFnTEVLN1NhWU5HMEU5RlZoTFlJbWpPd2NvL2duOGR3MkxYNVRxTTQrdnc3OUZNK2RnZGtGMkFXZzlTbUVQTGlLMWVvM1NEcFpualB0QUNnaVFpaERId3ZhSDVYUUs1WVp6ck5mUFRDdS9lNVF1MkZEc3A5Znh5dzBrTkt1aE55dUh1VWZHNWticWU5TjRmR2RtSGY3SURjUlJtMlIxWTl5cmxEdzJBWkk2dVN6M1d0UXY1RFhrOE9yT2RUdjZaNGRtZEpsbUltenkzdmhVcWFHeVJJYjRMMzZJdzhVQnBBcytUQ0VTamFRd2o1Q2ZkSFpNTVNjQzdXZ2JPeVhRWUEyQWJ1eGlxUXp0ZkJDTmtIR1h4SzU0TzlOYzFYQVFEbUU5TGhVQm5OZzB1dm1nQ0Fzd0RhbEJqaU1vM0ZRTXlKV2Vrb25FOWdrdEdWajZreFd1aEFFRG03NFdjVkwwQVNBRGlCd3p0SGhEQVJCaU1RVTBhcitrMEJnTThpTWd2WW90OVNpSDFKSGdQMmJIUXFqT0t2S0pTd0RIdnNqTlpvbGRqREU1QUd0RWp1NlhQd3ppUlpOSjNrS1VLaGpSYkdQdXczdENvcUJRQWovdnZISUkxbzJPOGh6UFhHVkVZdUZ0TUIrMjNRdUdjYUFJQ3BtTHkreDM1K0QyRnVaeUJOMDhvUVNxTklSK0RkUnlGbHJOOWdWYWRWMGxqSFlKanl1Wkc1M1ZEbXZabERjMHFlTVNIaEhTaVdOOGY5VDBoT3pTbThsZ2FGL0ZjWElQL3Rnd3Q3RDc3cEdMeDlDMFltajRUT3ZvMmNtem5pMG9nSE5NbERFNUlMQ1BEWEtQc0haY00wN010Rkk1dEpuaGZ6TFRPUTlqMUg5OTBFRVBBYTFuVkxJUjIyWFJVQXNBcmlkSkV5WXZMV2RZVUExb2c5dVozZ0F1OVVyUDhkY01udUtSWjhMd2dJSmcreWdOZnVnVndBS3dTdzQzL1BNVTkwajdmN2VZOEJEOWNKQUN3M29SYlR6NUdiRGdWQ0s3bVgwYldJQW0xU2VRZGhYMytyeEpoWlFHRE1jeEtVZ1FqeFVRQXRHQzhOV1RTU2F2b3NFTW80STZzTlNZQXJ3QS9ZcVRBRU1BTzV6SE9RSWpZQjU1aFRHYlZpTVpJaWhlbG1mTTlZQUlCMU5xWVVXWEZLKzRMem9iVTZBTEh6d2U4K0MvTXhhckNxMHlqcFFVZ2xtNll4QmM4UXBaY1dBTEN5UFRRTU5mUys0am9reGYwbkNZVExIREQ1VDB2RFhnYlBBL0lZRGtHeEhscEtpd2kwMzZlWW0zRUZSQ1lCQU0yN2VBeDhCWlRic201U2tHY1FBTjRvR1F0Y3p5VHQva1JnamVkamhVQWJ5aS8wUXY0bzQ2OFNBR1JjYVVsY0FRRzk1QTY2YmdDd0RxenlYSVFGekZZcEl1cVF1MHFJWG8wS2s1bGpZRmtsQmllZUNFNjc0L2svQTB1STAzS2FBdDkvUXVFRGRKZTJYekVKRUt2L2ladXd3MkQxYSs4b2F4VEtHc2dxVmk0S0VTd3NvZ25Na0REcUIxZHREK1UyczV2NmhQZ0xHQVlRYjBTUGtnS1VKU3VYQWNBU1dEVXJLVWlBTEZBV3dFMjVCdTcwSlZDc25NcjRTc2sxSDZFVUtiem5HdHd6RmdCa1FHakw3elFBc0U3ZXZDWHd4R1ZjY1lHWG1QbkFPVjJGZDErRytXQldkWDFLSlQwT1hxTVliMlE1QUVETC9rR3d6N0lYMTJGTjRUZHgzTDlmU1Z0bThwOUY0dHdEdC84QjhaSkNTcXVUVXBSdnA1aWJDY1VBT2pPOGl3SUFMTGx3RHI5YkpwS3ZoSGU2WEhHWllERVd0SXFtTFdYc29YNjQ3ekNGYlhiZ2ZKMGFQSWV1cXdZQUlxQ2xES0hVOGRiYzJXOENBTVJtQVZoVzZibVJEc09wWHBMTHpEd0lWc1RzeHBmMzBOempDQ0RPRXhSdVorRDdRNFNVK2l2MEFIeWpzSVE1M3FZcDhobFM1S0c2QVVjR3VPRlk0azFsWDJjTjVZMHh0QmFJZTF1aGkzTUNhSXNFMEdRK2VveDN3TU9yQVlBcHNpcVMwZ0MxbU9JNmhSUjJnT2k0RmtobDFBcFRZYm9aa3A5MjRaN3JrUUNBaGU4MmtDMFJBTEEzTCtUMWlSR3c2NVNEdlVmenNhaUVOOU5ZYjJOZ0JLeEhlaVBMQlFDTFJKcEVXV2NCZ0NTaThwZ3JMUm9taGN2RXE4ZHlRaU54Q3E5bEY3eXlTYUV6cnRKNk40WGJmQjdDR3Z2QXJBK0ZHelJRZmtGZVYvd2RubzBtSU1PMnU5SytKdGpUUktxdmxrTlN4ZFJoWFBNRHlLN2pNL2JqNzY4REFEUUNXL1paSUo3OVV3WUFHUU85YXB0Z0FDenY1eEFuWlRMaUxDbXEwd0FiRlN2RGNXenZJSUVFMWt6eFpmNmRSWDdDYW5KWEFRQnVCTzdIQnk3a3lxOVhpR0tvUVBjVFlvbFNGWEJFNFVlOEp1K0RWbE9BeVlzTTdvSUhFTElTdW8wOWppRFRBZ0JZMnBVTEFTVUpsRTNLWXo2bWZHVk9aUndEcFdjVnB0cUNqSWdqNDU2eEFJRG5Jd2RlcjNQNGI4eUtDTzI3cFBuWVVMSXVqaUgxYzBjaE9QZEVFcmd3dkxCSTdQcWNFbXFxQkFCWUhBQThTNHNLUDJBak1sVlp2cG5MV3pQNXI0TzhZMHorUTNDUHZJQno0bFp4bFZhUnpROGk1MFk4VVp1UXRuMXNaRCtna1JDU0M1aXV5TWJGY3o4a0hiYlJuOGNXVjl5SUNYc3ZQQ296azZRNVFJWStNY0RRajNyMXVnQ0FGRjU1K3I4cEFHQ3I5SURRNDFvZ2crQkJncExUOHFGNWtibDVodllkYVFHQTlUdE5pVndGQU5DS2hGamdLRVRtUSs4S1c0d0hBZmNlcHhScDMyRWVIUGk5dHNkNFR5Y2Q0RG9JWTB3cWF5VDdiTU1BQUVQTzdoQ1lKRkFPS0tmNEdBUndVaXFqVlpqcUFOeXJ4NkNZYzZCTTk4b0VBTWR3NzNNbE43cFNBTEFIQUlQbjQxUWgvR0xJTEZaNEw3alNXZ1k4ejVXR0FESUszK2dZcmw4anF4djNHTWI5bVVFKzZwK1JVVGdoVHhMSWZ3c0srUStObmxWRnlWcmVOK1R4Sk0wTmVyY09JQnZDcW4rQThpRkpMcUNlNnFQd1lvMDNNSjU0T2ZIY3o4dExQN2pldzkweUFZQ1dQcjBLNy90blM2KytCUUJ4NzI1Wlp2eXVvOG9tdU9mc2txaEw1RmJLR2VraFd2TU0vbzVEWjVmZURYRUFVRUZhYnVTckFBRFNXSWpqaEJNS1Q0TTVGcGlsd1RYRzJWTVRxZ3JZQUh0VEkwaGVSQ2p1bUQwZEF3QVlRS0F3UFBOQ2E5OEFBRUlZNjZXWTdMTUVnWUtDSGt0RTc3dmllZ2FvQ0xCWUNtZkdvSEEvbzl6b0xWQ3doMEJlalFFQWk1Qyt0YU9FQURnL09sU0NPbWsranNEYTM0UG41Y2cxclJXWml1VVhyRkc2NkJFb1gvUzBWRUlDN0NPUDJCYXgrYmtPZ01nQksrNHY2Y1hDY2g5emVvK0x0T1EvRE5FeEwrb3NrUDJERFlLc3VjRjZHVmc4NXdEMkNWZEF4SjRzZFlaY2lEblBXRHI2cnBjeE5hNVFJUk1yYmQ1M2RzWEhHQUNRSkkvLzhoWUFWQVlBclB6bEpPdndNZVJLdnlCTE5RUW9PR2FOTGpRa0oyMkN0UldxZkdkWjF6a2xqMW9qa2wwRkFKRDB2NWRPTC9heTVleVNvejBVZTJ5Z0RBSW00bGtFUEd6R291MUYvbzZyQkFCYXFpbldJamdEWlkxWkFFalNHMUpBZ0NWUXVDenBCdVVWN3loS2o4TlRGbUM1SUFXeVRMblFuSzlzN1JYMExxQWJWeU1CeGphaFNwb1AyUzliUUloY0oyQnpTQmtwYVFEQUt1enRVNHF4THl0dTluTFRBSkZ2aEtHWmZWS0lValZ1MjRqN2MyTWJxOGVGdk9mRFNQS2ZwdHpualJTOUhRVjhZb09nMEpwbXlmdDBCdCs4Nit5ZUxCSm1LRmN1U0liUkRVOTJ2Z01nNEtFZlV1NzVqci9tdTdjQTRLY0pBRWJLV0JUY0JGcWRlMmFXbml2NS9HUEE4a1QzdlZnNis2NjRwcjlWKzE0cnI0dDFEQTRTcktlckFBRDN5MURlR3NjaUZrUWtWUVhVWEdldnI5RUR3TVdtWmdnRVlKV3ZJeUMvclFIcm5mdEp2RXF3amc2STJDWXBiNHRHUEpZRjNxQ1MxNDFuYWhNc1dzbUZYbkI2TVI4ckRWRFl6VE9CTkVEWkh6RnRxSzM1T0FmUXNnSFcraHp0aWZNS0FNQUtXZUluTUUrU1c2K3Q0UXRYSGptc2o4aVpWdk9rVFNQdUwxd09ibWpEUFM3UVU0SHlvU2VCL0xjSDkxb0M0OFlpQTFyOVNtSkNBT3g5T29WenBJVUI1UDVqeWg2SU9jOWkvTjExaGQ0WVQ0RVg4TUwvK3pOLzdRT3ZLOG9GQUpvTTNWR0ExRnNBVUNZQTROejdDMmZYL21jQVVCTWdpNVVEQUE3Qm5ZWDV1Vm9sd1pmT3JtU0loejRVUDcwS0FGQ1R3bjF2RWZDZWxSRkdzS29DcG9uMW9RdFNTMkZrRWs3TVhoRWdKRjB6R1FSc3UrTHlvOGRBcUVQcmNTSWxNVTBFMzVSL3B1WWxzdWJCU2x0a2d0UTQ1RUtucVFNZzdPWkJRMVpvWjljaVE0cFFEbG1MNklhZkJlQ3hVaVVBZ0VWYVVOR3VndklmSmkvT2l3UTN0NlVZdEc2QUF1NjRuYXdXOThmcWZ6a2dkSEtQQytZcTRIbm9wOVRZSFZkYXdYSExHQm9aY05rNHYybElnRnNLeitQQVNNRnVUeUVYT1B6NzFNdi9KMzVPNUl4TG1leG12NzROWUVqVWxBa0FHaE5TcU0xUTVsc0FVQjRBeVAwRUFFRE9sUmJvV0hCNnBUbE9RZVFTbjI4Q0FEeUtJUEJsQS9FL0lmQlZnMGhZNi9SU3M2OERZUm5aSDNVdVhJdmdOQ0pOczg3UHlTdFhxSnVQSUdBQnJEY2tVSjJCbHdSQkFLYW5wYWtFbUVsUWtId3VMWWEwUlpCS1d3bzRLV1hZT3JzYUdmSnBKR01jMmU0alZRWUFlNjY0Q2RjMnVaK2xIRE9HY0lSZG4xWXhjSTBHcVQyQUthTUxScjQvZXdPMjZmMURPZnAxUmtvdmhsRmVBNWdJalZNZ3NQSDVIVWlaZm9scGdGak9WeU1iNHYxRFdRQmEycmE4azVEOHBLTmdzd2NIVWlhN0d6SnBtb0JRWEc0V2dKVmlmaHBLVjM4TEFNcm5BTHlwRUFEbmJCOHB6R1JPWmJGS0dSOUF2Rzhua0VQOXpSVUFnQ2VSS1h4YWNTTUVFYkdwaFBzUitlRWFMeU1wMzFlVWxOWG81SnpTcjdSQ1RlSVdiQURPaG9BQXFUQTRUMm1BQjZDUXNDSVpoem5TN2wzK0JpR29hdWRTY3plR2dIRmFBTkJRSmdDUStpT05RSWFzS2NQRldrMEFzQXZlR3cyME13RU5RY3Z0TXRhUnF6UktTZVVobDl5WWJBY1V2WUNVWldlWERaNmtOV3N6U0loNHBtSUhucDlOeWtSSm0zNDU0WXBMc1RQWlVQc2V5OHQxNmtyckZLRDNwaFZTL3FRYXF4VEFHM0tGYW9HOVJEb3NwNTlFbDdPTHpHbGhsTCtGVXQ4Q2dQSUFRUGFLU1lETWVNZHVWRmhoRFVzK2NqRUxqSlZyelpCMkNEeklJZGVxcU4wR0ptdTFBRUN0Q3hmeDBmSnNtZndqY1RPcm1OQ2lpNjhLT0dpa0tpVlYvT3FHRkUyTkVQZmEyUjBYMFFQeENpd0ViQXFqN2Rzc3VES1BqSnpwRVFJbGxWU1Fzd0RBbU9GdXRHb2VYQ2NBa1BvalQyQ2YzSGlEQU9DQU9Cek0rc2RXNEZoZStGR1o2V0hZcDZHVlNKV3pDaDlCM09DY0lTUktsM3UyV0NuTFdrTXZyZkxlWHVSQUYvYU9rbjZadGthQ3BnTkNlM0JROFV5ZUttY08rUnY5a0wwbFZRQXhoWHNTUW03RFJEcE04eTBaVjl4M0EvdUk3SUNISStlTVNxcHZBVUI1YVlDSGtXbUFUNnVZQnNpMXc3VTB3TFNWQVBtUXo4REd4SDRHTlpETFdsc2xBUERDeFpmeHRmSnNwUTBybGhQdU5HSmhTVlVCTXhFS0hHdCtqN2xDNDVZUml0bHZPcnVneWF6QlFSQ3JIeHZFRENVQUFLejJaWVVxeXZVQU1OaU5CUUJwN24zVkFFRGt6bTN2d2ZyeURRS0FiVkMyNTVRbHdhbC9VbDVZcXNNOUxHTWRuMEQ0RDV1UlljcW1sdSt2RlExYVVEdzkxbk9aL0xlbzdGTTVTMnNKWXp2Q0U1ZW0zNFhVNGw5SUFRQllsbURvQUVtY3lNRVpCWTZNbkpNSi93N0N3MWdFMElEdGg5UDBOUmdIUUNIM1hxRXNFMHdSdjlabVFHOFNBTnlwTWdEUWl1Z2tsZTlOS2dRMDQwb0xBUjBhbGhNcmgyb1VBdElxQ01wQjVwenlXbGVvWnZYS0ZjcmZWZ0lBWHJyeUcvbGdubTNhaGtKV1ZVQXRTK0tBY3RxNTY5YzBBTEk1SlhYdmdzaGxpMFRTeEpLbUdzaWJkSVZtSHhvQXdITmpoWS9TdGdQVzlxWVYxeDlOUVp3Y2NPbTdBVllMQUVqTDU0L2ZNQUJBd2F3VldjTHl3bGdmdnB3U3NTL0ErNGZ0eUsyNC83clRHd2ZKZDg1RUFvQVErVSt6bXEyeG1PQ0ptMDdnbG1qMUY2UTk3eXA1WHM4RElRREx0WDZxZUhOV0FDeHhRNmw1ZVBZR2dJYTA3WURsVzNEZ2R5SFJGR3N0TUgvaVN0c0J2MmtBOE5nL3E5WlZyeFN3VmhEaTFJVkxBVXVjT3FrVThIRUE0WGFCZTFpckZzZk5oTkpXQXJUQ0dHMUFSR3Iwd2tqcVRuZTZRblhDY2dHQVZyMHF0cFd2NU81Zld2K1Z0aFFXcTBYTGtzQjYvS2VRTTc4TytlWkxrTis5U1huN1dxdm5NZnFXbDM1L2FHRWVzUkttSXdEQWNZVUFZQnc4R2J6UHJWTEdzY1JKc1ZTbWdkRDRKZ0RBQjI4WUFIQUJvRE9ERDRBa3puS2F4UFFROXljbTdyOWtlQlUzWUIvaW5yQjRIaUh5bjFiZmY4d1ltaWZ1U01rdXlVVE16Ym9yMURQWUltL01uNTNlRDJBQUNIdm9vY1R5eldmRXdka2kyU0NoV3FrbHNRWHAyMWIvbGRodldWZStheWVCRzRTZzZjZENhSCt2QUFCVExwcGNkWm9CYVNRMXkyckgyUEt6QUZNY0QwY3U0S0t1b3p6M2FZVS9FRks0b2UrUENXTzArWHNKSVhIQUZibzlob2hnSVFDZ3hRclhJVVVueVdVdWd2MXJWNmcvL2p6aXZsWlZ3RFpYM0ZCREs5Y3FIaE5zRHJNRnBNeDlTaTg2Qk1IUHJhS2wzNzJVOHRTSW5odCtQeXpSZnRGQ0FOYWN4U2dsQkJxenJyU3FINE5USVRFT0c2R3hFMUlzYUFHdFVlejVId2tBTEpOckcvZlVkZ0lwTUMwQVNCUDNsejNENFJ5MDF0a2l0eXFQOWhrazNITWxEQ2ZyMVUvRDZwaks1TU1wQ0pkWmM3TlBRektvSkJ2aE5JRkUzVUh2dEVoZXZsTkt5OTBEUWpXWEljYnNyWElBd0w0eEpHTXFCM3RLeXc3aTZwSjExd1VBcEdCTDdUVUJBRXk1NkhUaGJuZ3hRaVJVenpxVUV0TU1GblJTTytCUS8rdVhDZUdEY3RvQkoxbU8vUDBEcnREVGVnSXNSaTBPZkI0QkFGcWNYdTQxcHZxZmtDc2xybnNUUWo0eG5nVXQzVWVMbFdMRGxrUDR0aFBJamM1Q2pyU0VDNDRnZlFxRitvU2ZyeEVnQzNYNXRkVlNQZmNCYUd3RVNJRElrbzRoM3IwbWo4WUdrRUJYU01CeHlWWWtZREdZeGJvSFdGUkhxZ3R1d2x6bUlzRGkzeU1Bc0lCbEtDMncwNVhIRG8rTis4OERRMzZaYWdEc0E5amNnYjIrYTZUbFdUSHprSXhyaDRGR0VsY0d2RENVdGNVdE9ZZjVQUVZsZlE3R1QxSWRsUmJ3RG82NTR0b2NLQmZPQVBnZnVlSUdUOGNnRzA1Y3VBTnJtbS9CZ2ZjK0FFK2xWaC9rYjRXeHJnTUF0UHJEK0lKY3lWY0pBS1NBU0FhczFVb0FBSGUwV29IRGNHS2tnNGliQmR2RmNoNitLS1VqVjFyeER1UFRWbXhiQ3g5Z3hUeUp5WFViV1FEYWI3WHY3d2RCSWpHbk9jb25SbStHbGliRUtYeWNLb1FWd0pLcS96MzBWdjlsZXVMbmxLS0lZRW5qRmxoVkFlc0JsTWhoUnhDd3BhQjRiS0J6VEttY1V2aGxEZHo1OHpCdmsrVHExUUNBSEdnQkEzc0FBTENpR1Fyek9Zcnp4WlMrM1NlclJUcjVuU2tjQnZSeU1jamFWbUxjKzhEb1BvQzVpMmtHOVBjSUFCaFlabDFwUVJxdE1GQmFBTkNyZUxPc3VMOTRIQ2FWYTQvaDNJankzMWRJWlNMdk5LNVJsczcxZ2tKK2EzREZ0VHg0WDJXVis4d0RrNTZKcTBuakFNNHB0M2p1aDJ5alVJRXVTeTRjVXlyak1aM2puUlFjZ0podk9TVHZ3eVo0RHEwS29UK0dwNjhTQUF6NGljUm1FZXhLdmlvQWdJVXZ4Rm9kclFBQWFNeFc5QUt3QUdhMHhRaHltZHkzV3BvWnBvYUVCT0d4UWdBVFMzTUk4bjlIWFhGbHN6VGhtMEVTRG1MVnJiamkrdWFZenJpbjNCUFQzam9NYXlHbSt0OERiL1ZmV3YrZmVDQmcxVnRnM29OVndhc1c0cVlNQWhiQU1wWlkyNjZTc3BTRlE1OGpJYlBwZjc4S2xpQXFVMHR3SHNNK3hRSkFaeUNjdVVWdFVoYzVVYnE3NEE0OUlvdmxqSVQ5Q3JrUk80RnJNV2xZdGhja0NMSDIvVStKQTNCeGhRQkF1N2ZtU2o1emVtbGdrYVZwM3J0SEFmeFczQi9UV3RGYnNBNWhMVlEwZThyN29TSWZvSFEwcnZCbjFTcXBKV0l3ZWdiWGxmc2cyTVZRMUlhenF3dml3TjRHMGs4RHN6Q0VlMkVWNkJLNXNBenZoKzUrSER0QUFoVVpFTW9DU1BzdG0vQTlxeEIyQy9VSStUR0w2cW9Bd0FTa1EyQ3pDTTJWZkJVQVFQcVR6N2xDRnl0SmNXTUFFR01CTjRGN2EweXhlRTdBQmJ1c0NFb3Roc1JWdGRhY1hvdjZwU0VJMFlwSE4vNGlNRkhsY0tMMXZsZ0dBT0M1My9lQ2F3YzJ2Y2FZdHpyd1BWWElRbHFyVzZ2NjMxMXY5VjlhL3gvbHgxZXUwRjdZcWkrQUJDYU5ZUGpZZXhjYWxiMDY2UXAxN0tWZU9hY3NZYm5lSENtOExLSC9iUVhnY0JyaWhyOXVGMktYYUlVZEJpeVlqQXQza2N1QkoyUkhzVjV5aHJCbllOdEozaUcwYkE4UzdzbldUVm9Ba0UyUUFiRUFBTjhoQ1FDZ0lvd0JBTmE5MlpXOFM5ZnVLMTZxTk8vZFk0VDg5b0NzdGtJeUF2a0NRa1JkSlNXMENXNWw5bEFJUU1mOUlPY0Z4N3pUeTVVL0lRNVBCdVpwVWJrUGNpV1E1NkJkdTJUOFhyb2JpamRPbEgrYks2NGp3U0NBRGFwNWtBdWFiSkJHYTBzZ202MDZBT1Y4QzNkcmxKVEhFZkFFdDRQeS8xdUJxYXNBQUFzd1poUkZ5SzdraFNzQUFHTWtTTmRnQVphZDNtdWRZK0JvY1RZUU1wMVVHS0hIenE3R3ByRklzNHA3bGQxcGpRbDU5MGdtT2dUaTJBYTU1OWg2eDI1c0ZyTTJxUjN5c1JIajB0eUwybUZudHlaWDdBdFYvL3ZCVy8yZmVxRitDUVJ1K0hUQUp4UXlDVlVZeEpTZmV3WUk2UGYvZnhSeWVXZU10Q1haYjJnNWNYd3dhM2c0K2dpNExnSnBESm0rQ0pKQ0ZvemtrWE5xSTVLVFJFQnhnNWdkdUQ4TCt6NXdqMW9oazlXRWU2NG8xczI2RWk2eUdrV0ZyTUVZQUdCWldCdEdsb040N1BEYU5hZTNBNDY5Ti9kNjJFcVlqelQzN2lFMytqSXBwQlY0ZDNRTll5b3E1cXlqb2hGamFvSTRDcUpjR0RoUDBaZ2dnaU9HOVo2NjRrWkM4aTZoKzJSQVA0d2IxMnBqRWp6RHdzZmhJa3lQWGFINDJRdkZpejBJY2tGS0xNOHFzbUVXREZEeHptSzZOZkxGeXZtV0tmSjBTNk91UG4rTzJ2eTdGeW4vU3lPcTJnQmd3eFczanRRVUlTdWpEU0NuVkFzQXNLc2ZlNUpqTXdpdGdocXo0SjhRYTUwdG5uV0tyY1ZVVjBPQ3pXYUlwVW5wYlV5YTJ5QWlXQlpjd2poLy9PeXNLMjFJb2pYMmtDd0FiZTVQeURVdFZ1bXU0VjdFRkw2SHptNVBIRlA5NzZhMytpK3QvL2M5RUpCMHdOZ2VBMXdWOEpZQ0FscjhzM3Znd0dOeER4eFRDaERnRG1SSENqZ2FCaUdBb2F0SkFCb0x4TE5BTWxYSWdubE92Sk1sU0U5Q1hvTFdJR1lKUUR3TGV5bFZhNFZNcktZenkyQUJMU3BXekF5bFNiNVVnUGQ4Z2pYWTYwb0xjZDN3SVBGUENSYldJbGpGQXpSM2k4b3pwOG03bGZiZTR3RUxsK2NqemIyN1lNNG1GTUFxZTJiRUZmY2VRQXQzeEZCQzQrRFo1ZjN3VkZHUVF6UUc0SGN0c0U3M3ZWeDRUdFoyeHJqUElKQm9KU1U1bzF4bmpVSElaT3FCakJ4VS92ZThva1FRZ0hJQnc5bFNFR3hVa1ExWUdFamVXODQ4OXdJbzUxdUdJRHRMN3QzbENyMHdHbHloL1ByZmxQOGxLSzRXQURnREYrVWhXS014aWhESFZRR0FZMkp0SHdjSVR0eHE4akVnMHhBamREZmdqclBlUGVSZWxmYWxXdGU4TVVEMkcrQVNQVGJtejdMZVE2MHdzZUFPTS9YM25ONG1WQ3lYSlZmYTE3eVZEcnRHeXR4M2NkWC9ib0JGOTU3N3p3SXZYM3NsSHVveXVBN3Z6WFAwRFlDQVJ4Q1RGQkpuaHl2VTgrNmp0S1dNSzI2MmdncVE4MzhSSEkxUnZqZVNWN0hDNEFSNXREWVUxckpsd1lobllRTGl6ekttWEdtREdCblRGTVpqWWYvTUNKbU1STnhUVXl4UzlBajN5M01DM2lOZ2JWbldZSmNyTFJaMUNRNC84MkF4WkdGTlVzeTBqOWFWcngybG1IR2FleWRadUR3ZmFlN2Q1Z3I5S1FZVnBZUldMNjRwMWh2cE5aU3ZLSEJ1dHZTanJQcloyejkvMzM4Q0hvQlR5a0dNVllUODI2c0FBRm1GdFowMUNFNXNyZGI0VWV1U1c3YnVSSDYzV01rckFmZnFDeEJnN0JvVFpEOExKQlFrb0lRQUFDcnNEWEFIVGhyaGh4cFhYQ0FIM2RJNGtOdzJRd0twSFpUU1ErL0M1MnBoZUIvdSs2MEo5RSs5UVA5OWZuem9BWUdVZ01aNkU1ZzVzVXp2akR5RHp6d0l1T2s1QmpVUWx4UnJ0OW12UVJ1bExtR3pGVlFZeUJ0WUJmZjNuQUdPdUdOWUg0Q0xTZklHekN1c1pjMkN3WmE2d3pTR3lIckJnZFpLanlic3lWc2l4WlQ2SXU2WkNWaGtTQnBHNE4xSjk3YXN3VllBenc4OHFQdmFnOFQzSWl5c0RCQ211SW1POWt3RVhXbnVIV1BoNG55a3VYY1RXUFRkQ21EdGcxUkJzY0tmdVVLQkx0eUhYYTdRdlU0NjJMWERYc05XdGorODFaRC9lQURBS2s0UW93aXQzOFlBZ1AwRURzQXN4Qm8xZHVhMm9vU0hER3YxcmlzMG5MRmF0aTVDakkyOUNjZ0JXQ1VyV1hPdllodlFtK1FhNjNERjFiMW1nYVcrYWlnM2ZyYkVBWVdKT3VsS0M0K0k5K011eE92Um5jamxLR2NWcTVHWnA2S1V2bGVBekR5a3lVMHA2VGdDUmxpZy84NjdkckZsOFdPdnFGcG8vbWZwbldmQWJmcWh2OGZYM3NOdzI3L3JRMWZvNlMwbGpPdTlvSlRSQkFJVGhUVHlCdVpnbmpUeWxCU013cDdoYlVwb1lJSkl0c3hhcnZWNzljYytDVzhsMXRzL2IvKzgvVk5OQUlEdVlNMFNYQWNsRTZNSXJjRXNjT3UzM0IycUhSUUxrcWxXRkNMTW9xS0VPeWhXL1lOWHd2Y01SaWlTWnViSk1zdVErM0lLRkFGYXlacDc5UUhrdWtzTXFnNEsrL1NDa3BsVUZETXFOMzcybkN0dS9ETU15aDh0QXJHZzBJb1VkK0k0RFlsem9XV2tNVTl2K1crU0d1VkR5djNRbmRzQ3hNRjdRT2o2MEZ2L3YvRkFRTklCYjRQSHBoRmNvVU9RQ2pwT3NjekxkWHpYaHhRKzhmZi8xai9yQnc4cUh2ajk4TmkveTFNWUx4UWdnTHlCRVhqbUdLdzVncU1IRUc1NjdncTl4RnVVdWhZWTcyUFc4a1AvdnBkNzlwdTNFdXZ0bjdkLzN2NnBKZ0RJRUpNL05HSVVvVFZtaU5SaS9YWldzZDc3RkRJVnN6TkZBWTRaU2hndGNJa1AzdytraFl5UUFrTTJkcGVmZ3hGRitZaVZ6TzdWSDRTbzRaWGFBNjhjNm9pdzB3L3UxakZEdVdVVUpUU3FNRkhSaW56b0N0WDJtaFYzWW9hR2tFKzZ5UjNONUpOdlBTR3JtUWgyZUs5ZWN1Zld3cHlnKy8vUyt2OWxmdnlCd2dEM2dEekpjNFhQK1ZzczgrM0pmdnZuN1orM2Y5NytTUVlBM1lyQ3MwYU1JclFHMXhDd2ZxdFpWQnd2R3drUVlUTEFBbVVsak5YbXZsVVlvVWlhNlNQRjBnV1dXU3NSYXpKRXBHbFNsUDhOWCtqbVk2K0VHUVFnT2EwYktyTnA5K2RuY3h4UW1LaXMvQytWNlZkdmQvM2JQMi8vdlAzejlzL2JQejh6Rko0MVloUmg2TGZkcnJpY3J2YmJmbGJnYjFmcDdaKzNmOTcrZWZ2bjdaKzNmNm9QQUZySTZpeDNjSXo0eVJYZSs0YTNxaCtBOWM0eFc4Mkt4czUzN09ydWdSelVWaXEwa1BRZDZDYVhlUHRMY3JWcnZ4T0x2UlhZM21tZkZYTTlNcjZiRXQ2cGw0cE52Q2p6KzlIamN1bmkvMk4rL0RZL2ZwRWYveU0vL3A4VSswK2JwMGMrTFBCQ1NYZTZxcm11aGV5UkZ1QUd4TXdoN3RtbkNrTmJjcjM3bFAwNlFKNmVidmdXOGZSZ29STU16WHhVeGpuc2dmTWdIcVZtWW9sTENLaWNNODVuamIvaEhuQkxQb00wem5xYUx6emZBOHI1eGpBV2VzYmtHNW9qemtKdmxXUlhjOFNlNGJNYXM3ZVIvUy9odGFTem9NbHF5ZHN2WjMrblBVZXhjbEcrU1l4TjYzM3crcVJyTFZrUSs5MjRSakg3UjB1dmZKeHliVnZUem5FYUFOQkpjZWR5QjhhL2hYUjNWZmYrd1NzWWRKOXJyRzJPbzJQbk93dzVjRXBURHhHNmtyNUR5OEZ0SXJMZGlKRkdsYUZLYjJtZmxYVDlJRlgzNmdBU3B2Vk9XRzZ5c2N6djEzTDhMMGwrLzVFZlA4K1AvNUlmLzBma0hzRjVhZ05CaDhUQUhramJ1NHE1RnVHRjlTTXlnZlE0bmtQZXMwM2tmWk4zSDFYMjZ3VHRWUXgxb1NCN0FjSWNRVURhY3poTTU2RXZRQUt0OU42OWlqQVdFSERUWjNFOEorR3N6ZGVFY3I1SGFiNHdpK1ZGeFBtc3hzRHpGOW96MmxtTjJkdERSTEN0anpnTGc4cGNQRkxxbzhUdTc3VG5LR25lOFp0YVhhRVZjaVppRHBLdTFlUkpJNlJscDFtam1QMHpxR1NFUFk5Y1czelBWREk0RFFEb2cvS3lNMlVPYkZLQWFYZFhkZThhc0xLYmdIekdlZHZNcE1lYzYzbUZRVC9waXB2dWlQQk8rZzZ1d2lYRlZEamRqc2VVVWkwdzdiT1NydWNVTlN4QU1oMlliK3hmVU03MzEwS1dnRlQ1dXlUMy9Tby8vamsvL2lrLy9zL0lQVEpsVkZYazFFRHJteXFkYXl4emlyWE5Sd01GY25nT2E4Z3oxQUU1NlNOVWE4RGFyeHJaTlVPaE5RUUJZa1duUFlmVFZKQm14RWdEZlZybXZhZmhyR25DK0Rta3JINFBwYnU3cUVqVE5NelhnakpmczFRZ0NRdnJORVNjejJvTVBIK2hQY1BYdGtYdTdTa2laamNsWEQ5dHpNVlRWMXE3UDNaL3B6bEhIWkZ5RWI4Smk3Vk5KVnlmZEMzTEFqbWZ6UkhmeldzVXMzOHdJNjJkd0VaUHhOcU9RYkdtYUJtY0JnQmdyK2FWTXNjU0ZkNFJKWEJWOTM0S2dyUVRsQnFYY0YybUZFTXNheXlwalZwakIrNklsZlFkV3RXOVRxWGdEdjhPK3dWSWc1eTB6d3Bkdit5S081RGhocHQxeFEwdmNMNjVnMkU1My8vQ0ZiZjUvY1NuOS8wNlAvNGxQLzViZnZ4ZmtYdGtVU2xyckxVYm5URytxWks1bmxTRU10YkFXSWljUTk2emZRVEU1bHh4WXlKcnZ5NUR1dXNVa1dzUkJHQ05oalRuVU1vS3kza0lkU0Y3VWNZWlgzYWxUVlNzeGkyU3RvdktmeFRPK0pKeXZyVmlWbHBwM2FhSTgxbnA0UE1YMmpOOGJhZFMrRXJiMnd1dXVEeDdTOEwxV05VVFFjTnpwM2Z2aTluZnNlZG95QlUzS2JMbW5UdHJTcytVYWFNa05jNUIwclVvQzdBMlNUdGttOFd1VWRKM1lOOE5OQVlZWkZscmhUSXJsUXhPQXdDNGdjdE9HVVBycFBYcUN1K04rZk5ZR2xYcWFxOVN3U0FwTW5UZ0I1ZThsYjRDM0hSSDYrbk0zN0dsRkVqUzZ2eHZLdDhtVFUrdzVrSGFaNFd1NXc1a1hQSjRRM2tucXh0ajJ1K1hTbjgvSkFDQW1EMkNuZjRHUUdnMUErS2ZnR3FSTzFXYWEyN2hLdUVEcllsVDBoeStDT3haVVdUU2NBZkxNaC9Ddis5U3dhdEZTSzhkcEpERGM4aitTSE1PdCtrOFdIM0lSVkduUGVOOGJ4RnlXdXRXS2R6Rmx0a0N6TmNPek5laGNiYTE1am90RWVlejBzSG5MN1JuTnBVNkt4MUs2V3VlU3k2dzFocTRma2Nwazk0RHRUa1lVTTlHN3UrWWM0U2x3RVB6Ym5YVzVLNnAxaHowQjY1RmVZTFZTYkdVTTVicFRscWpwUDJ6NllwYndndllRTyt3N09mMUJKbVZTZ2FYQ3dDa0ZQQnhpbUcxMG15NndudGpRWmhoV0xSbHAzZHZPMUZLRko5Q0dXSHBLN0JqSENqck82d1N5UXdBdUc1L3FHTmgybWRaMTJzdFdhMm1SOGV1dUt2ZFhBQUF4SDUvT1FCQTJ5TUhBYUhWNm9xN0VISnpwbkxubW51c3M3WEFBR0NIZm1lMXMwM2FzOWh5MTlxcldhak11UTdXV0toUFE1cHptSVB6Y0FCS1k1bXNhT3gzWHM2OTVSdTAxc2ZjVlk2RjVaci9yY3pYaVRGZlI4N3U1OUdTY0Q0ckhkcjVzL2FNMVQ1WkF3RDd6dTRSZ2dBQVcyWWZ3WE9zdHQ2TkFLZ0hDVkR2S1dlSkFjQ1VjZjUybGJQSEhUMXpkSDgrUDFnMGJzTVY5NFBaVmdBR2c1ZEQwaWs0QitOQUhNVVM0NXQrZitGN1ljZlJRVmRvaHJlb3pCTitDNEtOSGpCYVpKMndFNnkxVHFsa2NLVUE0TFVyMVBHdk5nQ294cjA1TmlhVEtJMXRSQ2ljdWRMKzdkaUhuYTlMQXdCZWx3a0FMdnd6MHlpbDF5a0J3SVVpVkVaSWdFb0xZNnZsTDNaaUsrZjdLd0VBbC9mK2kvK09uSElZeEszZTRZcWJLV0VYUXJsSE9YTjk0WW83R2JLMVlBR0Ewd0FBaU5tem9yeU9ZSi91dStLT2o5aUdlSmRBQUN0UUlYZkZuc01UT0EvbjhDNTdpbmVzTDJGdldQYys5d05iS2E4cHJteHBOZjJZaE9VcUNIVlIvRGxscnVSczU2b01BT1Q5cXdVQUxzb0FBS2NKOG1xRXJNVkRlR2RVc09JeUZrNU1DRkNmT2J2VHFxYWdCWVJoVy9rSjhFS2loWDc1WG4vMnZ6bFFGSzMyUHVldXVJc203aDFzOGI0T0lPaTFBZTVIQU1TZ01wZXVySWZneWNCd05NcWVGWnFyTTBXUmowRjJ5Z2g4azh6WmliUGIwR3ZuN1B3cUFVQ3V5aUdBYXQ2N1E0bjd5aVFlZ1lBNUpMZXBqQzF3bzBoNzE5emZPUUNRMXFzb1FEVUJqMTN0dWdKVzNuVUFnTDhZUWt2aXVOMnV1Q1UxSHFTLytsSE9YUC9WRlRwaWF0WkNPUUFnelo3ZEFUZjVoaXR1UlN3TnR5emdOcXlRdTJMTzRhNHI5TldRODNBR1FtWlhzZnc2VTV4eHZQY1JBSXhzQU9CSkV5QjJ0ZTZEOHRmbWE0dThnRWtBSURZRXNBOGdiYi9DRU1CVkFnQlV5T3N3WDJla05LZHB2M1E0dTYwM3Rvam5VRVdHdkE1N0FKWTBKVDFCM3lQbjlaem1ZaG95UFdaaDNuSUJjTkdwbkRPeDVrOWdQMk5vY1VKeC9hTnh4TmNPUWFvc2dvMjFBTmpBOHprRTY3TkdjM3dBTG4wRTlYek9ncDE2cXdVQXRpc2tBVjdWdlZud0k4b1RCU3NUaWNRcFlRa3ZBV2xqSFdLdjIzL0hBR0FPVU9vQm9NMTlpRlV4QVZMUzVkNEVBRGdHUmNkQ1pCaHk1dEdkdUFVSDk2U0N1ZjZMdDBnc2E2Ry9EQUJnN2RtY3NXZVhZTDlpSzJJRWIyaGxyQ29rTW5Hang1ekROU0FmYnRLN1daWlpWK1M5VitIZVcyQmR2WWIxV1ZkNEh0STBpbVBudU1kM2FMNlEvQ3RnWUpNVWl1elJOQ1RBZFFVQXJLY2tBVjRYQU9ET25Ec0tNTVA0Y21pUG9tV0s3bndFZ1VoVTVEWFMzUFRpTnQ4QWkva3Y5SDRJQ0xuOXQ0UjNORzZQNW1sYkJZL251V0hWcyt2L1JISDlUMU8yRTRMNmFRSWJwd0JvT0xTcWVRMU9hVzNRUTlORFlIV2RqQVAyRmxRVkFDeFhrQVo0VmZmbWxyQW8rSEZ4cFJXdHBFa0kwcHVpRktMRkJGWnRXZ1hZL2hNREFMT3d1ZmRCV1IwUTJRM1JMWkxKcmhzQW5JTVZlbUVJaFg3Rjh0aWxXUHhwbVhOOURBYzRaeENIMGdLQU5IdFcrbTdnZnNVT2xTak1UZ3pMRE4zb01lczNCeW16NHAxZ1FhYUJzRFQzWGlDMzlCa0FQQ3VNK0J3c1FIUVpueXZXN0lSZm4ybDYzaEt4c2NXekZac0dPQjhBQVBNcDBnQ3ZDd0QwVUZ4K0UrWWI5d3UzNmU1VndnZFpXdjlsaXJlM09iMHpMSVlkbUFlQSt5VUxJZGd6aGJNekRvcHZRd2xITEJOcHUxRmg5SE9NL3JYaWFvOTEvV01hTVhjbm5TT3ZDWjVQQktGVEJtOWczd0FiN2ZTTUpjaldVZmQzdFFIQXRDdXZFTkJWM1h0QVFZWEhoQ0JSWUk4Q0MzNFFZaXFqSkdDdHZObzBDaEQ3ZFA5VUFJQUlkTjdjMjZCd0psMXBCMFZKSjN0VEFPQ0FsRGk2K3dZSkZhUEN5bFlBQU00aGpueG1DSUx4TWdBQTd0bTF3SjZkaDV6ZVFVZ2ZHNlZ2M1FNRmtndVF1OUo0Y01hVWR6d3BZLzlaOTU1UUZObDVCQUFZSS9meWlhR1VwQk9tRkFDYmhMb0RXajUyVENHWDhRZ0FNTzdpQ3NGY0Z3RG9DdXkzYzFLZXFNd3ppdFY4WklBR1RQbkZUQnoySEdpdStsbTYvekdzNnlrOWE0SUlnMW5ESXlWelZrYzUvWmExemRaNUd0Yy9weUgzVWVvaGhpSXZsSHV4VitJc0Ftd01rNWRoRzBhSmgrc3FBTUNZTWJCQkVKZVhUS000dENHSGgrODlaTGlSdEJpWHVHeWxtbEtYS3k0VFBPQ0txeXRwbGJVcW1hT2ZBZ0JBZC9PWkFwS21YSEhCbTJaWFhDTDBxZ0RBZjAxUXdudGdHUndteEFibDhKNUFLbGdsQUNDR09KUUdBRlN5WjNzVVliWk40WU9RR3ozTittbkt0aG9BWU5nZ2lta0NIOS9kOGdDOEJ2N0tPbGhCVXdENEJ4VlpndnM3cVpSckpnVUF5TGprVXJEWEJRRGFEYmQ4VnJIS2NiL3dIdDFYWE5NY05uaEYzQUgyeG1rOEFIYm41d0FNYU5kckhqNHRXNkRUYzBZYVhIRTlnd2tBUWp0S2FHdFRDWTJHWFA5aUhOVVJBQnBYNUJFYkVjc0tMOEVpSENQWTBNNVo3cXBKZ096QzA4WTBiQWhrSHo5TUlSeXNNZUdLSzBocG5nVk5zV29zMXhiLyt5Wmd2TGE3MHJyUFdtM3RTdWZvVFFJQVp2d2ZFWEVNMDYrNklDY1k2NzFYR3dEOG13Y0JQMDlRd2lpMFVBak5LaGJsSHFURjdGUUJBTVFRaDlJQWdHSEY5V250MlFIYXM2MUtISEFUM0t6b1J1Y1lmUm9TNTRnUi83WElXV2tBd0FTRlB3N0pSYXJOR1hNQWxtbFBJQkZ5RStvS3pJTHNFTkptbHl1dXlTNGxtUnRCSHVEb0tBTUFkQ2ozd1I0SzF3VUFrSU0wcVZpbHAwWjY3YWd4enlIaVlMMy9aMStBcThFOEFNMWpoMmVDcjJlQ3J4WVNGTS9PSTY4alhybmlTcWthNHg1QjVCNmM0U1JyWEVxZEM5aVF2UDRoeXV1M1FnN0lXZE5DQkpoeUxQbzBsUXl1SmdCWUM0eFZZamRpVVlsWTEzRm9jQVdwRnVNZ1lld1dsUVRudVdLRG5pNWdjdUtRZzlmc0NvMXRLcGtqR1c4S0FDQnBqQzNaR1ZkY2dLVVZtTmZTeHZpN0tnT0EzK1hIYjl4L2xnVCs5d1FscktVVW9SdFNTMVdTdzFzcEFOZ0lvSGdrRHNVQ2dITDNMSlpuMWR5c1ZveStIQTdMdEN0VUd0c0dKYzBNOERRa3dHV0t4Mk9jOWNKSWxjTHZmNmFrZGUyQnRTZ2dBR3NqTEFPUFF2aERhUDFMVTVZbkhtQklXV25wOWRCWUFRQm9oUHU4OVBldTljKzZMZ0R3aWx6Z0hKdTJ3a1pheU1BS3Y0a3lsR1poRmtEVjR2cG91SjJDQXJSNEEwbnBmeWgzN3ZtNWZxbFk1M09LZFM1OGdpeUZCVUt1ZjVHUGoxeWh3RmVuVWt2QVNndmNWcmdNVE9MdEptUHNqUUNBdllSaGJjRDZ5QkJBYUd3WjkzNXBIQ1NOWE1pL2E2YTRYeWpzMEFrTFVNa2M0WGdUQU9BQVluSGk3bG9oeHI5c2JpekJlbGxCN3JLUno1ZFZCQUNYRFlIKzVQNnpNK0M3K2ZGT2hCTGVCV0dQTWQ5cEpWVUpoVlUxQUlDRjRrVVJWZ0lBWXZmc00wVWhzWXYrSW1FdFl0WnYwUlVxRW00QldmUjFCV21BMjVSZElCa0FPVkFNSVFLanlCR3NUTGRNZkpZek9GTlovL2ZpK1VKdndMQUNBdTZCSUg4TVZsMmxBRURBeFdOLzd4ci9yT3NDQVBWZ2xZNFlRRmxMcjlYNE5CWUJGM3QrTUVEbEZEOE84eUFJUHFZemU2SjRoWkxTL3dTUU5IbVBaWTByZFBmRHFudFdiWUF6WlU1Q3J2OUhYajdlZDRVR1NsamJIME1PbUUxekRPRkpLK2NmdlNzeXZ6VnZBZ0Njd1dKbzQ3Z0NBSEJDTVF4dGhPNnR4WnFTaENDelF5ZFNoQjNLblNNZXB6Njk3TG9Bd0Q3RjBCRnBZbG5YZHRyYzBvVGxLNis0cXdFQXZ2RGpzanZkWlh2Z2p6d1lTRkxDeUVUbTFCL0xOVmd0QUxBTUlPclVDQVhFQW9CeTlxdzAzR2x3aFJLdGFXUDBNUUNBOCtjUDRQMFFPS1lwQk1UZ2VCOXFBRWdvYWg4QUthZVdZU2dSWTdrTUFySUFnc1I2bE5vQUc1VGhnaVRYSmc5d2IvazlLZ0s5V2dEZ3ZyL25ELzRaTjY0UkFMeHdwVlg5MkMydGNVKzArUFVockQxYTI2M2dDbTlVOW1jb1kyTk5DZG10S2UrMlNXejVFMmRYRjVTNXYrSGxGMXZub2RvQWYxVnk4RU91Lzh1MXZlblg5cUVyZFBmVFFnNmJGRXJMUmVUOGR3TGZUWnBpWFRzQXFGUkpQN2xDY0RGbVdFRlduTEpGT1JCYU9vVVZkZ2lsaTJWVERNNTl2bW9Bd0RIc3BOaC9QU0RPSDF5aGxXK2xBT0I3R0RjOElMZ0VGNTlGS09FTnhUTFlnSHp2TFVWWVZRc0FMQ1RrRUMrWENRQmk5K3hWQXdDc09JZ1Y5RTVCU1I5QWVpSzdLSnRUblBGVFYxenNhSStVUDNmQ2t5Skc5MTF4RjBzRUFWSVhZUitBeFd1d1hQZVZaNkNINFhKdmYrMzM0L2RYQUFDKzkvZisyai9ydWdCQUxYeURWdGVmMDJ0WElRVlVLLzNMNU5JdUFtaGlBZmNhZkEwT09XQm9Md3ZlWHBaZjJ3RDJ0UFEvVGtlczl5RkxVY3pZTHJ3M2tCYjRGeGV1K0ljZFNMSEoxdmRLeUlHYkhiSDhPRmM0VFp6emo2VzhwYVBxRytNQWxPdW1mK3l1THJ5Z29jd2tJZGhDQ2xOTHA3QytKMm1PdGlMSGRZY0F0S0l4elA1SDFOa0N2SWNhNzA2cmxBTnduOFpkZjBBdkVmUzNFVXFZODJwUkFHak00TFVxQXdCT3UyTkNUeXdBc0pqc2I5SURjRUZDQ1d2b281TFdVa1cxWmtBaEErSUl2RGg3RUt1M3JITjB0VW9USlFRQlFpYVRwa0M3cmxEekhjdjE3bFBZQ3duTEgrYkh4MTQ1WHhVQStNSS80OE5yQkFDaWtEVHk2QWFsMXlLZ0RwWCt0YW8wUGdBMmZIY2tENERqL3h0RWxHWnZIM3NrdEdxRW9xQnYrWGNTMTd4VkdBanZlV0hVQnBpaVhIeHNzaVdlVFF3NWNCdjRLU0pnU3NuanBKeC9mczUzYnhJQWxFdlVlM1NGQk1Pa2VDclhxbTVUQUlDV1RsRkpLZUNsaFBFbVNZQlpFRnhabUhzckJiQmFXUURQbFBIRWIrejdnWHVqRXRaaWwrSUNaRXRDMXI2YUFDQW1oN2dhSEFBTDdOWUNvNW1WUWF3bklkWURnRjMwdGtoSlR4cXBvckVHQk9laGEwU3JYcWUzQTY0akVERG9TdHNDcndGM0lRZUNQY1F6K0wzbnBWdzFBUGpBUCt1NkFNQkRoVHc2VG5GcHJTWUF4dHF0VEFFbWV0OE5QR3ZkeU8vZlZqZzdXaCtCUFlqWEgwZWt1ejczNy9NWTlveldkbmVUNHZBQ0JMVEtmU0hML0FzSU9XalAxTkoyWHlzRVRBNDFTQXEyZUJxK2ZOTUFvSnhVdlZqaVFqa3BoaUZHTlZlUlF1dTJKOEdkWDJrdmdDbGovSlRTQUdPS0FEVlZvUTVBb3pIcS9SbytEZXdSVnNJc1NBNklwYzhzOVdvQ0FDMkgrSnhpZUdrQndMYVJCYURGTk91TWVPNkdLeTJtb3ltUm1EUkFMaXU2NnE5ZElCSmR2K0lwaXRrYkRLQ3M0a3BhTytBSC9odmEvTE94THNLdy85MDBrTXMyWEhITmkvT0FKZnZPTlFLQWQxSUNnSjRLQU1COThCeHhpaDVYK0dQUDJSNFIxRFRpSjNacXZBM3BjTnhLZU5YSTcrZjQvNG9CR0E2Y1hvOGc1SkVJdWY2WkFDajdjTmVvRFpBVW0vL0VoM2ZFNjhBMUNOTEt6VGJ5ck56MlhvWlBmd29BSUtsWVR5ZWtvTlNsVEYySUtUS0VLV3BhSFFDckxLckVGVHV1QVFCSW93Y2NQN1ZDUU9ldXVPNzhpa0lLUk1icmt6TGVxY01ZN1g0K200RGhIcU9FVnlpRktVdFc1UkhGMDZvTkFLWVZWeDRDempSMUFKYU1QY3VzNWg3SUkwZEJwblZGTzNWNll4U0oxY2Fzbi9RZG1QZkNWY0Q5S0tYUklWY2t0dGFIQnFCQ0xaZFowRXJtVHNZVldyZjJrVGRnMHIvM0VxVUtoZ3lETncwQWNnbEVVRTc5M0lnRUFIZkFJbTEyNGFaWlhBem4wT25WQXRHYml2eU03eW5rd09XRU5SNEF4LytYWFhIZkFzNzZ5YnB3TFFvTU82ZHgvZWVBTEtyVkJsZ0hMK2t3RUtiRlEvV0JKelYvNStmOGtaL3psaklCQUhyUDcvajdmdUhEUno4SkFKQUpqSDVYcUNIZkZPa2V0RXJveXBBQ0hxMFFGM25raXZzd2F6WEx0eFhGMW5kTkFFQnFDZnlVZWdGd0tlQUxWMXlBWWdVc1Bld0ZrTGFrYyt3ZTZZQlFRNHdTWGpMaWlaejd2M3hGQUdEYzZTMC8wV1dZQkFBc0FYeE83NDhXaCt5bFhxYzNOOEc5cXpWcWlXM0toY1Y2eHYzenBZd3RudXRtVXY1M1V0eWJ1UlRjWlhBQlBGRzlGQXZ0QjJ0ZjNsSGVUL2JWa1A5N3RuSXZBdXR5M1FBZ3BuRVNFdHU2RmE4UDVzcGI4dW9XeEtVeGZLUjErVVBGektsMldxbmRGZ0Jtb3FRZVFlYUJWb0JJTzdjY1lyQUFnOWFORU1zUll6MkNoeEhNZjNUOTcwT215TGFSczQvazEwSHlVTDNudlFEZitGQlZOUUVBcGsvLzhhY0FBTVlUeGlpbGxUVzY4cHJvNEJBTHFNRUxBbUZnWnBTWUZqTHN1Y09kV0RMRDF3UUFmbXJkQUxWbVFCd2Y1VzZBUFJGRXI3UjdaQXpBV0VmQU9tVWxQRytrTUdsNXdWY0JBTFNXbjl6Rkx3a0FaQklVT0ZzY1krQlJHZ0hscHFVV01ZQmdablJhQUNmZ1crTFE2Tmw3QnNyLyt4VDMxcmdVVm5vcWVrQWFJSWQ3RHRaWUdueUpwM0JJeVhuL3FRSUFmajh1elRzQmF6L3M5Q1k3SWU3SURXQ25JME5mOHlDZHdSblpkM3FuUFhUL3Y0Sk1vZHZlQlY3akN0WDNZbmdBT1NXZUh5SU9uaVNBWEhtbkJ3b1JiekxnK2hjUEtMZnlaUVBKOGxCZEZ3QjQ3MDBEZ1BtSU1RdUhOeWw5TGpRQkRUQWtYdnpNVDhvOWoyNzduRjdnNHRRdkh2YTRYeWEzNXRRL0lBQ3cyZ0dmMDF4WjFRR3J2VWN3RlNzTkVZOUw2SjY1MGhMQlZ3RUFCbHk0bk9pcDRvcG54ZENyNUFjZndIY2dPWE5SMmE5elNqam5RZ0VQZUFaamlYb2FFTWN5dGkrOWdIL2loYXdvLzY5U2VoZTBVQUFEOWhrbC9RcXpmalpjb2NYM2dqSlA4K0RxVGVJR1hUY0FHREk4bHh4M25sUFdYc3VHc1VpZjM0SkN3cG9BWEtpSEFiWFcrUTg3N2JVQk4rTWVmTjk5NGdIMFVlb2hlaHVPQ0dTZzk1RUxDSjI3NGxMVW1wZUUzNmxGU2NWYmNYYWpud1duNSt6THUybzErbVV1L2lFQXdIcmswR0pGNVU3QVV6K2UrTWtRb1hQVFR3cTd4bENvbkpGaTI0SjBMV0hyTHdmSVdIK3ZBR0FDaENNejJwTnFCRlJyajJqbFhtT1VzSmJDOUJkWFdzeGs2Z29CZ0NaUXhGTDVYMzZFRkVPWGtoL01HUnBTd0ViYnI1anVsZ1BMall1WGFKWGF5dG0vTDczeXFJWE1qWHVRR3ZxbFMxY2thc1FJQlZ4UXpKWFRyem9VSmJ6cnYza0RDSXM0VDFzR3VPTHNvT3NHQUJtRGpmK2FnUGdLWlJDdGtuTFNYUFRvRHYvS3k4b0g4RDJhWW1aQXJYWHY0ODUvbUo1NUNUUStBeGI4UzhYYndEeXRQN3ZTUFA5cHB4Zkt1anpqZjNXbGhZR21qS3l6TytUNjF3RDdpY0k5c1RnQzZLRmlzbXJYUHdJQTJJOGMxVkptT0FIM0lHZjhsaGM2VWp4R0NseWdVRUhMNk5RVlZ3WGJjOFg1K2hMdjJ2c0hBZ0FqNU1aRzVjTTFBdVNRalFMYnV0STlFdHNrSjRtSmozbi9Xam5UcXdJQUlaZmlSUVFBRURZMk1wSXhRd1BUTkRFVkQvZnJQaWwvenVaZzc4ckxNa21jZUE0ZmdPS1h3amFTMi82K1M5OXAwQW9GWkYxcFlSVDVGbGJDa3JxMTczK3pUZk4wQUR3RERWeUk4cmh1QUtDeDhaRy9kQVRmaFBWRGR1QzdUeFdlRTd2b2haaUdpbG1yMTQra3dyKzQ0dGJVcXdUVzJkVit5OHZqajEyaDhNNExoWFRJd1AxL09iMTVsWlVsODFkbk44ekNqQVFKU2ZBNVhTUFFyQ2wwSzB2Z3dnQU1BazcvYmdIQUJiZzBrMFphQVh1UllnSys4eWp6SzcrcEx6ZmJuL3gxWWxHTlFXeDAzVy9lUTNCdG5VSEtDVmJseThFMXAyVUFnSXRyQkFBWFZRQUFFaVBWbE0rWnMyc0VERlZoajV4V0FRQ2cwTnlCd1lmNXFnQkFFcW5vSXVFN215a25XWURybXJKblQ1VDllZ1J4MUJ4WS9selBvWThJbkErcmNBNmxldU9YUGlYcFF5K1Uza2w1N3lIRGE4ZHBsVnkwUjF2WGMzQWw4N2sraFhuQ1VDQ25kRjAzQUVEUEpZWXFEc25scmNrcXNWNDFvTTdkK1VRcDNYYUZtZ0RZSUlpNUtLTHNyTGJiWE9IMW5pdFVDZjBBMHVCcWxlZHd1TUZxWDIxeEhTNFVVTUlOczNDK013RlBuZFYyTnhNNDExWW4wTUV5QWNCRkZRSEF4VlVBZ0d3WkkxYkE0bTlpSitCVHIvZy84R3pJMzBOK2F3K3dvMlh4MWlEWFZPSmFZaTFpcVdFRUJRZmdKWWdCQURIZllRR0FhczlaNkhvR0FLeDhCTzNpYnc2VmVhakdIa25USmplcktHRVJtaXZLRUFYSXdycmN1YllBUUNpdEtPazdoWXpWRGNBVlFRRHUyWnl4WDJXdjdyamlDbjFjMFpHTGlWVHJISDdrcmY0LzVNZHY4K00vVXQ2NzMrQlM4TG5ndVdkRmNrQWduc3VJNTJDZU5vZ01qQVREY2dCQTBqcUhBQURXaWtjZ0xtc2YraVo1SnZKRXBwVWM5UmNlb0gwSjM0UTFBVGhOYnd2a1pOYlpyYW5SL1k5NzRuM2xPUllQQU5lWkZicFc0NEpsMmJJQ1NzVExkZGNiakFPQisxaHBwekhuK2xCNWg3UUFvSnh6WndHQTRMM1NBb0FwT0pCYlpRNHV6dENXY084TnA3ZHp0Q2JnVXZGZnRwSDlwZCtJci94R1F4QWdCVUdrVHZnbXVmdGw3SUlGS2U4aUJWRFE4c1ZLYW1tL280dmNZT3RYTkdlaDY5Y3BSdGh0ZUUzNHZUYUpVVjZ0UGJLcU1IaEQ5MGJFTFNHTUdXV0lBc1FEWE9sY3J5bnVScTJtK0Zya2QyS3BVQVlCdUdlM2pEMHIzZzRod1MyNTRncDlHVWlabFNJOVdNbXhXdWZ3c3AzenIvUGpGL254ejJYY2U0RFNLamVWK2VPNXgwNkE2NjY0Y1ZGb25sWmRjVWRBemxLS0JRRFdubG8xMGk0dEFDQmtQQUhpQWdKV1lPMzVlNnh2bWxiSXVrS0crNU1QbFhKK2VyUEJud3FkRmJhMEgzaCt3VmNlRUw0YkNEZkU3STFwMkwraHVWNUw0Q1RJUGgyZ2tLSDJiZHpUSXZaYzgzNk9BUURWT25lcDdwVUdBT0NCWEhUSkpXMnRnU1dCQldHSDdyMm9rQ3F3d1lTa21IenNOOW1sMFBrM0wzU2VLQ0JBQklXNGkrZGRvV0hNaWlzdE5id0NaSnRGWUtsUEthaTZuTy9BY3BBenh0eFdZODZTcmtkV2RhZmlOZEhlYTVGU3NxcTFSOUJWTFM3TDBMMFhDS2xMR0lPSGVEZlFzcXAwcnZuWjdhNjB0T2kwOFN6dE94KzdRdGN3QkFFanJ0RGdadDcvZnNVTFFkNnZ5N0JYcDhGMTJnL0t2NEh5OUwrN2duUDRML254OC96NGIyWGNHK3Y1enhuN1NWdDNuS05GbUNjKzI2c3dUMWhORkl0Y1NaMlMzM2xsK1Rta3pra2hHYlNXcDFLc016TFNiL2g3LzhrL1M2ckVkY0YrbFFKR0N3Rlp4ZDhrTWtvVW1LVHJTc2puUGI5ZVg1TjduaHNFVGFjNEsyeHBmdzdBQnNNTmtvZmZsV0p2REViTzlUU1JYRFZPUXV5M1lkZ2s5bHp6Zm40WDVybVM3NDg1ZDZudWxRWUF5SUVjOXhNelZlYkFrc0NpT0VQM252Ui9qMmtWRFlReXYvUW84dy9lOHYrZlh1amNKeEFnQXJYZkZTcURTWDlyc1JLNXpMRDgvVFM4eXlqa1FtT0h2SEsrQS90RGp4bHpXNDA1UzdwK2pOeWU3Ukh2TlFYS3BlOEs5Z2ltZUNXOVB3bzZLWXJEbzRlRTZrU1Y1aHFmM2FLNDhVY1QxaFcvODU0Q0FycEF3ZkdlbmFYOU9ndTU3MUlJWjhBVlYraVRlaG5jMHZrcXp1RS81Y2YvWGNhOU80QU1PVzdzRTU3N1hwZ2plYzYwTVU5ejRCWENlZW9oNWYvVWh6SGU5OWJ5dDRxMUhMdW5jSjNyRkpiOCsvNVp0UVFDY08zbG03VHZtYVZ2RWhuRnlsL3FwR0NQQTZ3SjhKTFM1RVpUeUNWdWdpTUZhbjdqOXdkbUhUUkV5aWJjRzBsemJaMUg1aVNVODIyeDU1cmYrUS8rWEZUais1UE9YYXA3cFFFQWtxT2NjYVZsYk5NTUZrYjFFZmZPRUNwLzRZb3JUQWw2dmtTWi8rNnRqdi9pMFJHQ2dFYi96QTRBQWdOZ01ZNDZ2Y3l3dUxleG9saXZLNVExRm11cW5POUE3MFRHUCtNcTVpeDB2WHdYVnZhTGVhOGhZTDUzVm5HUERDcldhdEw3OTRPZ2EvRy80OUZDUXJVYWM4M1BibFFzZU90WjJuZmVJaERRQUh1MkIvYnNzTEZuUjhuYjBlZnYzK2FLSy9TSjhyL3BMWWhQcitvY1Jzb1B2cmVRSVh2aGpDYk5mVHZNa2V6WjRZU3pqV3N1ODRSbHloOTRiNFptTFQ5VEZIWHNPajhEaTFRc3VQZjhzeDdSMm5mQ2Q4azNhZC9EYTQ4eWlwWC9MUTgyL3VqWDN1cFkxNTN5ckVqcFgxWk12M0xGNVhBZmd4V2NabS9FempXZXgxb0NKWitXK1cyeDU1cmYrUjN3SUZYNi9Vbm5MdFc5MGdBQTZXUGNIckN3eWhuZDREYTk2emQvclg5ZWsxL3dUbmhtbnl1VUFPNERWTmlqakM1dzNkVEIrNGV1MTU3VEM4L3BjSVVtTmxJRC83NWZqSWYrWUwvMFFxU2E3OTRFMXFCMmZUZThXd05ZRVFoNFFyK3BoL251Z0hjV1lUcEFBNEZRa29MQjk1RDNsNXJ0YWU3TmxSNy8xUXVXUDdoQ3ZXMHBibExqMTZLZTVpQnBEMkp6bzV0VjJ2TnlmK3lnK0FyV3N4cm5xSWNzZkR4TDliVDNld0ZJREpMUUU5RFFROG9ERmVKdFB4NEV3SFdmc25kd1hYbS80bG02N2RmeHB2RWRiZlFkL0l5TU11OE5pZ0w4Sm1FTmVoUUZhdTNqQVFJcUVoS0xPU08vOXE1L1RSbkg3T0h1d04venZudmduL0YxQXRqc1ZyNXRnTDZwazJRVTdvOXZ3ZjMvZXdBeWZUUlB3d0RTRUtpaFI2YU56clRvb2c0d1VORHpNd0hXNzZRckxsMDlIQUJrS0s5ajVPdUgzblB6amJKWFdRZG9BRzRjM25mQ0ZWZkx4ZjQ1dUk1Y1l2dDdWOXBoc00vL2x1ZFU4MXhMOGE2bi9wNzNMQUJnM2J6U01RaUk1SkZoOVdRTUt4MHRjNjBCMFFBaEozeC9xMkZSMG5NUVhXSWpuSWNrcERySWVxNzAzVHZBR3RLdUgxSTJOYnNRUTc5cFNiRlIrVUFoV201VlhNeU0ydm0rb1VPQTFobGJNci8wcVBkOUVtckNOSDRKM3hYaUJ1QWVmRVZ1ekdyc2VXeUVKY0lTT1NuRFZUaEhRM1N3OFN5MUt0OHhSb0p5aXRaMWlMeENMT1NsbDdvSW5uYXlpdVFadkxaanJyaC9RSmR5bHU3N2RieHJXTU45TUc5anh2N0JlZTh5ck9DYkNXdUFMblRaMTlZK25pQ1h0UHozV01RWmVkZnY0UThOZDN4endoNGVEUHc5Nzd2SHdQd1BoWnNHbFcvRE5kUmtGTzRQOFd4SUNLQVRzanR3bnFZaFRJT2htbWtpNEQwZzVTLzdZTWkvenhSd1B4WWcvbTAxcjlKQ010MmdhNUxrYXowb2Z3RlNTZnBMemh5R2NPYnBIYlVtVzRQT2JySjFSd2tuREFQSERVUGJ5RjNyaDdUalYrRGhlR3dCZ05ETnl4M1RFSlBvQ2NTK3hvalpqVEc4YVpoVUhGTks3S1FQM3Q5cVdaejBIRVNtN1NDNGFnR3A4K2JFV0dTNTc0NnhuU25sTjVPdXVDb2Y1NU5QSnZ5bVU1bnZhVGhVdUZINVFJMFRzbVNTR2NmdGNDN21BNGVBNDdQczFoTVg1c2MraHYwOXNJelJ2ZFlmeUE3Z1BjaDV6TlhZOHhORUptcWdsS0xwS3B3bEpxWFdLbVF5M1B0ek1PZENFRnBRU0s2RGlwQi83T2VuanNEcElCRnNOUUUzRjNHV1pPNGZCcjVqWEJINjFqTzBPTGlBMDlBYVRMblNIdXk4ai9uNVNFYWJKMlZtblpHUFBJRDlNa0RJNnpQMjhEVEVlMlAyM1RQd2tqMU1JSnhhYXppcnlDamVIM2NoM3Y2aEt4UVhtZ1FTcTFSbFhBYWk1aXBrcjJBeG5TZmd4ZTBrV1M2RXR4WEkvdGdBNXJ0a2I2MGtrRElISU9zaVNWWTJCYndvR25kakNraWNTL0NkNi9TTytKN3p0STVhbSswYUFrVllSWFNaQ0xDcnJyaXVnWGcyaXJ4Y0ZnQUkzYnpjSVExb2hIM09CeDNiZDJwTWZWeFEzRXpMY0crc2ZqVUlyR0x0K2ptRlpidEt6NWwyeFkxdzJnRkJ0U2hJdDFydm5nRjJKMSsvYkd4cTduRnQvV2FZQkF5eWpVTWJkUlhtYllvQUNLWWJhY3pkRmJodjByMDVsVWtPd0x0Z05YMEhZUml0ejdjSW5xUTlpS1Z4SDFSaHp5OVRPcEVJRDhsL25pR21lcm1EMDFKZlFwb3BwcFBOZ1FEQ1ZMbE5FcFNMSUh3NExlNDU4RmM2Q0p6T3dON1I5czBxN0QzckxJbUNmZ2JFcTVqdjJLQzlNMDlLdkpzVWIwM0NHaXk2NGhyM3JRbjdlSU5TcnBMT2lMaGd2L0JLK1h2dlBoZVM0UXNsSlcvZTJML3prZnZ1dWZkODNJZE1odFpBeXFtMWhxRzBTVzRDOUlrcnpmZkg2cFhicnJob0Z6YnprWG9jejRHWGhNcGZ6dVdHSzdUK3ZxenRJRFVMTHYrNTc0cXJabHBwbVZneE5pUXJaUytFdkNnWlJRZG9hWnhTL2ZSQWVjODFXTWRKSWlXMlFGaUhQU0xZTUFsVFlMa093REI0K2dRZ04xZ0FvRHR3ODNJSEYvSUk1Yjl1VU43ekxrM1VKbXdteVlYbEZwWFk1WXF2MzRRRnd1ZnMwSE9rRWM0NHNlYWJTUG1qd3RtZ1JjZDNYNDk4ZDI0UXNrMUQ2OGpGT2JQYWIyYUJOWXNDUnR1b2g4cUIyblRGZFJFWUpkY1p1YnZiZEFCQzk3YUttWHdBYnJqYjRDWkVvWWFGTzFaY2FZVkFyWkFQZGpLcmRNOXJkY21iWFdueG1Fck9rVmFZNmhXbGNzbFpXb1h2MkNkQmlZV3VwRy9IckxMWDYxMXhrUzFNdjhPYUVidXV0TXh6ekZrU1M3Vk84V1JaMzJFOUEzUGhXZkUrU1ZpRFZWZGFGSXIzc1hZK2NDOXJaMlNFVXRSdStQMTd6Kys1UitEK2IzVjZVUjdldi96MzFyNTc0WXBMOG1xcGJWeDBhbC81SnEwektEYVdlZ3lwZ0ovNTc4VTYvbExRU0lvYVNXRWpic2drYzE4UEdWT1lIaW8xSXVSK1VnWlpxbnZLdjB2aHAxQmhKdXkvRUpLVnNoZnVCTHdvbzJSNGlWNlJ1Y3pCNERuSXVVSnBlaXprTlVsN1J3aUI3WXAzRzR2S3lUMFJBS0MzZVJTOVhERUFnRzllenRDcXFMVTd2UUtXVEJ3L1R5WnExeFhLSHNxRWNuVTdCQURMZEgwT1FFRFNjOVpkY1RlOERKQmgyTnBjZGNYVnU0NHFlSGNHQVB2d0cyejRnVmFnVnM5YmZzTUNqdGQyM3hXWEYrVURKYVZJRDF4cFdXQjJPN0t5MjRmTmZwcHc3NTNBdlQveEZzWk55UGJRbElaWWVESUhvVDNJZGNNcjJmUFdXalliYzFMdVdiSktVNlBiRmMvU1FXQmQ1YjI1OHlQblZUY3JPY3hpaWUyNlFzbmlFM3JPa1N0dVpxU2RKUUdPalFreUFiOERuNFBQd0ZLNHJIaWZCOWJBcWdvWnU0L1BBbWNFK3hlMGVFVlM0L2Z2Yy8vdEwxMmhXbDQvV005WWxoZjczcS9BM3g4bUFJQzdycmdGTU1zS0xqdDlTbXVZby8yQnJ2cDJBSEQzWGFISWtRWUFVUDVpVFgxdDdybG1DcmN1UDNLRk1yNW9TS0RDUFk0RUFPc2tLNjI5VUVPWklKb1hSYXZnZU9pS0N6ZmgySU45TFd1OFJTQ0E1V3VYNGQzR3N2SUlBSEFzMHZxMVhTVUFrR1lTVmgzMVVBMXNhZHB4VEtqcDJCVWFlWVRxMjFzQUFCc2xITGpTMHFwUzV4bHJSR1BEa0dGZytRNG9Gb0xjODZ6Q2QwY3JtbnRTWTlNUFJLbGFSeSt0anZlSXNiWm5ycmk4S0I4b3JkbU01bmEwbEYzV09LeHltTEh2QUZ0akhUNW1lZ1BJWXVpV1pxWEI3WEhQS3dBQUZ5QU1ReU10QURoTk1TN241ODhCQU5CaDdJRkQyTnM4OTFsWDZJeDNCSHRkcTZ5R2lobEw5c3BleGw0RXVMYkg4UCtzczlRR1JLcWt1dmo0SGJoL1pPL3NHSXBYUEJscCswS2szY2ZuY0VhMFNwUHRTdllRcHJGaTZKWHI1Y3M3NHQ5emx6N2UxM1d1dEpKaHZ5dHV3SVFOd0k1cERlV2JzQVh1UEozNVYzQit1UERPck9HTlBJUzUwdVplQXlvNEY3TGV1K0JabGRERkpua2NZd0ZBMGw1QWttYVg0VVZCL1hVSTNobnM1TGxNSWVKTkFHRFl5Wk9yRXdvdnBTZmczV1lBd0dPTjUrS3FRZ0N5VUg5MnhaMlRjSk5pWEpTN1lKMEJHc091WHJ0dzJFNHFBQUI3aXJMYkJjR0kzY2pRSlRRR2FVZFdML2d6c0txMnlRVWUrKzU5VHEvTmZlNzBibmRZeGhNUGl0VVhYbE4waDY2NHBlbzZoQ3k0M2V5K1luV0loYU1wdXowSWQyQXI0QzI0OTdraDBLU2w2WGVRSGxScnVLVlJhUWlvT2E4Q0FKRDFUQnBwQUVDYWNRaUNXQU1BWFFsN1lGOFJsQUtDY2M5cS9kNWI2Zjd6cnJUVmRoWmN4YmkyZXdEd3N1U0pZdUNJSUlabHdnbFpTTGczOXdBRWFJb1h2UUNWQW9EZHdEN2VBNURPWnhTL05TblZqK1h1SVhqeFZseHhKNzFqSTRhT3FXUTFmbjgzQWNEQWZiSVBGdjhCekMrMlo5WTY5YkduUVNyVmZaUEFSOXFJQUFBaG9NS05lSmFJWE13RVFjMllLTWNEOE53d09OaUxnaTNuMTF4eCsyYmhXS3dwQThFRGVubW5pZXZWRS9CdVN4dnBFL0s0bU9HUWFwTUF0ZDdKV1NOdXpmV1pzVE1VV2d3clJNRFpBalJlRGdCQWw3d0lyVFZZbkIxRklXMlFaY1J4N2gxWDNJbHBGK0txeThRM2lIbjNia09nbndTc2Vvd0ZIYnJTbnVjb0VGblI3UklSQlJuNlM2NjBjMWRPdWEvVTBrZjMzNnBDTnVON0kzZzZwMi9ET2JrRjZXajFyclQ3NDZ5aU5ISXV1WnRmTEFEWU1nNHVsK2JsaGlsTmlqQmJUekd3bmZXQnN1Njloc2Z1a09aekJlWitFYnhXU2VDQ2U3bmovVS9KT2x3RVFiemk5SjdyR25Cc0RZQ1lJMWZhRlZDK1k1bWV3WUNYUFJscEFRQ3YyWm9yTHIwOHI3ekhLU2xNM204eHFYNHpyclRCeTViaTdzMHBuQkJPQ2VTV3ZCckFPRmU4RE5pQzl5TEJ3eVVBUUZwRVd4bEpDNUVBb0p2Q1dldktQc0tReEFTa01ISzJ5SnppU3E4dmd3T2c4UkxZNEJEWnZ3SHliazNoajdEaHNPMksyN0huRkxDY2dWUkRUYmVKQi92UDRNMDVKaU1nR2dDa1RRUFVoQzhxUXkydXF3a3NjUVhqQXM5QzJrNmFqV2tCQUhTemlOQ1NkTDFGUlNGbFhXa3J6RUVsUm84dFFUY2gzamtOVFB2WWQ3ZGN1Z2d5c0hPVzFzcnpKTUFYWUJMZ0dxV2lUTUtCbWpGQWxDVTBrUnN4cDZRVDRXSEZFRWNTS0JJR2JwMUN3cHlHdFdEdlI3YUtBR0RKbFpaazVmS3NreFFqYlZUSWMvTVJZMFVCY3pzUUg1d0E1V1oxR1R0VkFPdzRoVXIyWFhMcmF5MHVuVk1BMnpTdDdZcmhtdFFheTFnZzR3ekFDWDc3aEFMQXp3T2VqTFl5QUFDdjJSeWNEOXpIYU1TY0pPeTNwRlMvR2ZvdWNjdHovRDlIYzIrbEJKWURBT1pJNW9TQXVSUWVldTdkNURWT3Iwa3lrUUlBTUJGU3MvNUZPWEk5QnFsdE1RNy9qV2wxUXFaTG13V2c4UkpXUU9jZEFmaGNjcVd0NkpFVHBvVU9sOG5RMGd4UDdhd2pHVFJMK29GSE5BQklVd2hJaTlHOHBvOVlVcGpkSTRweXVRQkJoT2huV05rUWxYSUFzRzNxT0N3cUNwVFhCc3JtQmNqQ0lVS1huTHo3YU1wM2J6V0lmUWNndEhDRGFOZFlLTEpUU1FQa1hPcEJ5TUhXRkdKSWFJcGlIcVpES0FWbkJseHhON2NWRUhRaFFZTU1YQVlhM0VzZVFWNjFBWUNrbW1sRHZsR0VqYkNrTzF4eHJZanh3SmdLZ0prTklya0p5TEFBQU00bnRyL0ZaMkJmZENFT01RRElLSEhwRXdWZ0NDZ1pOcDZodWNZenNHY3NrSkZWUEI5V3IvZ2pnOVhmVVFZQTBOWU1Td29QRzFicUtTbHQzRzlKcVg0cjRISFloL2RiQjdET1NpS1VFaGdUQWpoVkRBYU91V3ZyTElXZFdyeDcvQ1VRNVRERU1aQVNBR2h0ZzQrVXZURHY5SG9NQXNTdHdqcFBYZm82QUpaTTVyVllkc1Z0MWRFRnYwY2NIQTZ0ckNoZUgyNFBiTzJkTFFOb2N4cnBESEpTS2lrRnpHNlFIUkE2SEkvalZvc3RBQUJRQVZnS3Q5ZFE2SlVBQUxRUU1na2hneDNGelRaRGFOeDY5NzR5M3IxSklRU2hwY3lXRG5zSnJEQ0JXRUxvZnNSeW5GaU8wa0xoRndrZUFDeU9sS0ZuakpHaVd5Q0JkbXJ3UmJxSWdkdGpwUHdkRXBud0tnQUFONHVTQWpjaXVIcGNhUUVQckJZcDVXeDVEQ3JuS1dmRXRqSE5yVGxBMmowbjhMQU1Ib1pWQWt5V3Q2aUZQRWFhMG1DRlBxQW9XMDB4VG9JaUNZRU03VGRhai9mVEJHTGN1R0t0aHdDQXRtWjlzUDgwVDhkNUF0QnBWZVRabG1HeEhSclczRDQ4SXlrVkZTczRkZ1FJeHVkd2J0WkJubHY4alF6dCtRN3dCbUI1OTg0eUFJQzFGMUJoWXB5ZjZ6RkltSWpUVHJGMlFkcEtnQjJLOWI4Ti9LbHRDQUd1d2Z4bGxWRHpGcEQrOFB3Z1lMYjBvT1k5V2dwa0FXaUZwTVNiMEdJQmdHZVFtdFBzaXB1c2NOeDFoUWg4VE5KWVVHSXdqWlFtb3JtQUdmbGNGUUFZVnBpVlc2VHNHQUJvMWlzeTlDdDlkeUc0OVpHbnhQSTJzQVZpRVFWRllXQXA0RDQ0eU4wQStnWU1uc05ySWlYTkVBZWdYZ2toWVRlemVTTU9mWllRKzlJWXVEUEFoTjJIdVA4dWtMT3FDUURReXNMV3N0Z2xVYXc4TE9HSnZTNUVzY2pnRkVZbXhPSlptbGZZN1pnYXBGbWo1MFJNV3FXc2xaTUlncDRtd004Q0FFQkxBOU5DYXJqbkIra1pCd2tnZ3hXWjVuNW53cHIyVGlFQW9LMFpubzBaaFlkd21wQUYwRVlFYURRaU9HNTdZc1J6ajQyLzE3eG5YTUZ4Q0ZMWE9OUnlBcFpxRnZZZmU1ODByMWNmNUt1SHZBNHhBTUFDZDZld0Y3YUFXSTBEYTF0dzdRbnU0Sm1tRndDZnNRMENZdXV1dUViRG9aTDl3cUVWTnFRNDQwUUx5VEYvWkNvQkFFeTc0bkxYV0kyejBRSUEwdmlqRnZKVXVkU3FGbmQ5VFJZSFdwOWMwRUE3akc4U0FGaVRxUzBFdjdzVnZ5NzMzZXZJVlpqa1ptUndrQTNFV2h0ZGNUT2dOaEJNYllDTVJ3TlpEb2NLTDBMY3hhOFVTMk9GaUpicmtGbHlrSkJ2alAyNU5RYnVPbGd4SEhhS0JRQjFIdlFtWlFGZ29TaGhHQzlCTEpKQmdCUkplZXIzZkwyZmZ4bGFCVWNrdjJsaHRCRVF0cEtDcGJHbVVjR2ZReXg1aHpJQXNrb09QYWZvRFFUU0dEWFg4RURDK1k0NWYwbEtvajlDaGl6Uk05SUNBRnd6Qkorb1FKbXNtS1dVSzY0RDBHNjh1NWI5SWFFcy9udE9oOFRCZS93VmhNeVEwN0FJSk4wOThDd2VBZmpJRXFIWmFrdk1aWWlyRFFBT3diTzg3NHJyRm1BS042WXljeDBYemdocFVJeGI3Q1RhNUlxYlN2VWFSaUxxcTNuYUQ4elJZRzRIRzFJeEFLQWVVbVpqQWNDd0syNXk5N2QrSEJZQXdFcFZtSExWNjRwclBLOVJyRTVEdjVqSGlDVU5OU3ZhVXREOTErZ0IwTnpkTVFBZ3piMlQzcjNXRlZkM0c2TzV5cEV3eGZkSWN1ZksvRDkzaFFJazJBNllLMXV0VWFvZW9sck51L0RLT1BSN0ZBT1RxblJIcnJqdzByS3liNXBwLzJrTVhONTdNUUNBTzZpRjZnQmdVYWVzSzY2U3RxS0FBSFEzM3ZlZWdDZVFBOTVpZUZxMnlmVzZiWndsZWVjbnJyUVFFTTdOUHV6UFV4QmFKNjY0U0E5WDBVUENWRVp4bng4SFNJRGpaQ0NJTWlzWGdNY0FnTjJJYzZnQmdHTWkxQ0pZZmhpUi9vVlpHaHFZWXNEV3BxUkFjK2FIWmwydU96My9uOGNLZWM5YUZSTHFNcmo1RCtEOUwrQ003eXVXOUpLUitjTGV1a29CQUpPcytmb3N4ZFYzd0J0dzRrcnJ1SEJOL0JhWHZqT2t4a3ZJRWVoQzhNcFpGZWl0UElEOWdzWXVlaFp5QmdCNGtSRDJ1d2pzLzFaWDZKYjVZeDhPQ3dCZ2x6Vk91Um9uSytNUVhQL1pnTHV5elJYWDVRN0YwWGZJZXNVK0FWY0JBUG9NVXFJVjF4OU53VjhZS0lQQXlKVzdrUEMwcVpDcU5pUGM2RmkwNDc0cnRIWkY1VC9vU2l0YmJTdlAyOUFJSmY2d2hBNDlWbkREKzBsbFJpa0ZQS053UnJxTi9YZWdDTi81Q0FDZ2RWRFREaFNXTUQwQ0FYTUtBbUNUUUFDNkd5K1Y5R1gxd2p1S1F1bDNkajBKTGFWdHlKVTJlNmx4ZXBuZVpXSWhTMXJ1T1FqNVBhZVgwY1ZhK3ZXS3k1cFoyYnRHUnMwYVhWc3BBRWQzZWw4RWp5Z05BTkN5SDdCRUw2ZC9ZWnhYVS81SWVrYkF4Z1dQT0N0a2lWeklPeERUWm1Dd3BtU1BzRVd1VmRUaklrNUhycmlZRVlkd1p3aG9JWmpYdkdxVkFnQ0x6M0lHQUJ6ajZxc1FGdURhRmxhNmN0ck9rQllJNXN5SkhYaEgxQVVMNUsxa0FpQ0haQ3hQZUNVQW9BVzhuWmZGMU81YkFJQzdyQ0ZMbDRXVkhEcE1nN0RRN3d0WDZNd1ZZdEtqNEp1bE5Mb05WMXgwbzFJQUlFU3VjY1dhT0RmYytpTWtESmt3aU1wM0hCVHFhaVFBd05yZFhRb1prQXQwN0VTUy80UUIrOWhRL2hMWDVNcFdJaVJFMldsMXdWc1NpRC9jQnlCTFZ2V0JLeTRaTzAxdU8yMy95VHdjVWF4dEpnRUFXQjNVckI0TVVzd0pMUTJzVm9uek1xT0VYTFNHTEtoUTJOTnlwckQzUjVVdzJpTVBMS3d5dlh0a25lSjduN25paW1XYTRoSmdwT1ZsNHg3VWlFNGJSR1E3U3hCT2FVaTR2VUJTdlVvQWdCMzZPQzJYU2FjN0NVQktBSnZWS25kS2tTbW9CSEEvczZHQmFYQmpGSk8zS3VwaHlHS1hsT2Vwc3YrMDBNbmhOUU9BMXdRNE1TMTNnVHhvV20wRDlGS1UweGx5UE9DbVozSXBsbWhHNzk0aGVPQ1EyOEpjcXdQaXNZaWN2UllQQUhaWmEwdEl1VHFIV0JVcWh6RUYvVXIvNzl0R0xqMGpOM0ZwSWNMYmQ1VlhBdHdtaTBWeTlka0tZMGJ4SktVNWFmRktqTm5PQWFwZmM2VjFFcXgzZndDczkzYkZaY2dXV0N6NVQ1UUdOclJnNWI5RUxPQlRBSGRzNldxZHdWNDV2VG1SVnE1ekZ6d0RLSXpXeU9wbEJiUkd4Q2t0SFdyRkFBQ2hEbW9aRis3Q3VPTDB5bTlIeXJ4aklTRHMrQmJLSjhhODkxMWlzbk5aMjZmK0xOMTBkcGxlckpBbnNYOGtlTDBPdUs0UkdMRUN4THJzV0pxVlU1MXl3SjhJN2ZrZXd5RFEwb0k1Vjd3Y0FJQngyQkFBUUJBZXFyUzRxNFJSdUtXMWREMjBXdVV1Z1p6WWRjWDUvMHZPenYvSE1VK3U3bFpubHdsbmorMXFJSk5oVVFFQXA0RnNpMnFGQVBoNksrUTBGdUJKN1JzZ0pXMW5TTTJneVJFQVFINE1naU04TDFrbFJEQUgxeHdrZUhITEJRQ3BPQUJQaVd3d1FJUXV0QXkxYW44YVU3bldLN1hIZm9Oa2xBT1pCZmZxSVJHdjBQTGFyeUFFZ0FKUmlGd28zRG5lamZGQjNLQmFsVDRzZnJRQnBMZE5zb2FTaXQ2SUI2YU9DQi9NUUVXV2NBejVUOXJlY2tNTFZ2Njc1QjdFTkRLT2RhTkYrcGd5R0xBZ0VKZnJYQ1pRaEJYVXRzbWE3bk42blh0Y1Myc2dBRWpxM0lldGJyWDhZR3lkSENKR1RwSGI3VDRBT2liK2FUblhUQjVpQXROekQ5SXZTeU4vRzhqWU9DT2VDRmFrUElCOXFQVmg0TlExcXpQYnZpdHROblJDM2dWbTZGc05zTkxVbk9nckl4dEhBd3doQUNEbnJ5Y0Erck8wWHkzbC85anpxalJQQWcvTS84ZS94NXh6N1hlYXEzdkFTS2xqcmhEdlF5MmtxNUVudFZyN1YwRUNQQXNvOUZEV2llV2xTTnNaVWdNQVIwcUk1b0RlazczVzJCaHBCL2hLNkpuQlluSkZ6WHRTQWdCT1hZL09BcWh6ZXV0SXRwQXZGUGZyRkJHaG12d1E1cVhFSURRaGlDN1FNeVVsQnB2UmxBc0FqbDF4Y1FiczByVG5paHZqY1BxTElLbitnRUk2YzZXRkh3NG83U1BwM1c4REFmT1Zrb1BLYVhsL2lTVC9QZkhnSXNSb3hqVmc1VDhiWUxzLzllQ2lqbEpWaGwxeC92OEV1RHNYbEc5aFpEeE9ZQkVQK0d1WDNKUkt1eTVVZ2JFWFlvTTRoUHN4b2NUN1F2VXJXaFhyM3lMK1lTR2JOVmRhOFEvWDhWS1pYSFpmKzFMaGlCeTQwaks5QzhUKzVwTGF2SC9RN1dqMVpsOEJWNy9XNW5rcndpSVREMVZNRmtCU3F1RnhRcXBoV2dEdzBzamJqNUUvbXZLL1pTamtyTUkzT1ZIK1BrdEVUaHhXSnNPZ29VeVovRGhMS1d5bkNyRVdMZHlqQUhteVdnQWdKdXRrSUFBR1l3RkFUR2ZJVUFoZzFaVVdWam9rNEhZRVlVNlVRZElRYUJlOE8xcXpOZlRpeHRUK1FONk1oRG1pNndCd3RUV05FWTVDWTVPc0ZiRWNlTFJEREFMZG9HeDlZdE9jRTRvVGIxZUJCTGdMaCt6SUZUZFRPQ01VaHNWWEJpQi9Ybk5KWjRGTnkyMUxqNEZabS9UdTMzdUJnV1RBVUtuVTE1SGtQMm5Za2NSb1BxTzBQRlQrUTBBdTZvRFVQd0VCV2dFcEtlNGhWUUNISU5PQUJmNnBrZmV0Q2Z2WXJwU3hBS0FKMk1HY0c5d0xnQ1kyWFZRVXlkT0E5WitVWWptaVpCWFV1RUxqbFU4TlRvcVdVaXR6UGs4V1BPZm9zK1dNb0k1QndCS0VlRFpnckxuU0d2bGFwVXl4R21OeXZ6RzhrbkhKeFdLNDJKQUdBRUxBRGMrZVJsb09nWTFtOElxSjh2L0c2YVY0V1ptZlFQZ0VoL0JkTkFDd1kzZ0FMR0RGM3oxaFpIWWh4d1hKeHFIbVVaVUNnSXdycmZIQUNoMXJQUFFiNFoyekZBQWdxU3FrbFhXQ1lSQzA0azhBRUVzNFo4dVZOdWtTQS9FSWxMOVZQNmNCNXJYTENKV2NFWmhmQVE5M2RDWEFWbUNxamlza2hqTnkxNkxTR1FSQno2UFBGYW9ydFJyeFoyNmVJSjM2dHNGbHp6V3F0YUlmU1J3QWRzbGpreUFyM2kzWkRFeUt4STVRQnduM2pBRUEzM3IzN2lOQWZGMEtNbVl5b0phYjMwWXg0KzhUR00waHkzK0kxalBqQ2xYQUpKOWVLeUU5Qk92ZjQ4TGxRWk1Bd0twTDE1a3lseUlFSUtRcEJDdjlrQnFVdGw2RUNNVG5BZXNmMHpvdERrZTNLNjRyY09uRnVXeU5mTmw3L1VPWHJxenlpQ3V0bzMrVUVEdVhjS0NzclhoSXhpRTBJdUVkR2ZNdVhKOWlobHliU1FxZDEwc3J5bkpxdUtaRjZMTVNQNlNRRXpPbVF3QUFpODhrTmNrUnNQWVpjWi9XRlRlKzVlYm4rRDhQclg1R2F3QUFhTndLaldDTEhKY2Q4bVJhVFpjcUJRQmF5STlUbjdFSTJaQ3pxenhxNEZFREFGbVhYQmJhYXRTMERZb1d3MkxIbEZLSm9XNU5QMnk1NHI0NTRsWEJlaVcxbEdxdHRZN0dMSjhkMEhlcHVnRm1uRjF0amROL1pCTk1CSWF3N1pFWTJPVkthekpMakhWVnlUZGRUSUh3WWtpQW16QTVXT1JsUFJEdmZrWGNpREVBQWFzSjk0eHRCaVI5NzU4b3FVT1RMdHoybDBsb3pjUVkvemFCMFh5aXNQMnROUjFUaUlCYUV5bnB0ekRxQ3FVMlIxeHB2ZmdRQU1EaVV5dVJRd09LSVJJZ1ZrckRiNVIzSGxMUzRYSVJBT0FseEpLSERPdi8zQkJ1L1liMS83VzMvdDlQNFFvZmdibFBVeU9qeVdDdlR3SUppL2NHQTV4VEkwUWxvWTErSTgvNnd1QzJqQmhaUkZvYXNjd2hFeVZsckFmQ1pnZ0F0Tjl1a0F3Y0JQSW5ldDB1MSt0ajhub3VFb2xQcS8rLzVQVDhmeVlBTGlxWk9jMkJFSUFXTXRSU2JFOFVzckhGTlJMNVdDa0E2REU4SldjSytKaUdrT0lTeGVHUEFqRjlCT0ZiTUw4V0FPaW1MQ0Z1M0xNSnNnVjF3TFlyN1E0WTBnK28vRVZYWWc4REpJZUhRdEhuU3JnN0dnQm8xY2wyWFhHL2EyUzdMMFNNZVVvTmJDUDJzaERERmlHZmxTdE9hU3g5QyszSHBBRnF5bVFKVXNXMGVQZExZTkF6Q0pnejdya013Q1lHQUNBSGdOT1FaaUlzSzg3TmYrYmo4NWVNOGE4Q0tWM25SQVpMV2xOTjRHaHRwSEZOcHdIc2FSM2pMQTZBelBPVVMrNU95ZlVjWXRNQUIwRUlMaWp2UEVVNXZYc0c4WXdCQUdkemFKYU4xbnA2U0luOXMvWC9CMWRhbCtKSUNRdk4wOXh6UDRCUUNLRFZZSzlMdTlVWlkxMlJqNUFVb3RLSWRnY1FPdENFUG9iZmpseHlsY3Ewek84NkJiZ3RHT2RiSzZFc0phWnYrWFAza1N1dXR6RUorOHJLLzhjbVh4eEN3UlJDQVdNTXlEV3ZJUU5PelBlZmNxVkZ0czRBTkdpY0w4NVFxUlFBV0gxUU5HTHJNbVRzckR1OWg0Ym1HUmx4cGRVM2p3T2hsRkRtRG5wc1ZwWDl0UmpRRGFoenhOaENReGxKOUErZFhwc0NROUhiaGhjNkZRRGdtTXEyd3REZlVwQndhS3lSa3U1d3BjVVZ0aWwrdUF3SU44VFMxOUIrYkIwQVZoelNGWTg3U1lueWYwWnBkQUlDUm9BOXJ0MHpEWUVJc3dDNGV4aHZXSTI4eFlwRDNNYmY1Y2ZuZ2JRZ3ZGZk1DTGtjRndFSmJ3TEN4UU83YXNTaE5UQWpKWXExd2gwOHBoTUFnRlVJaUsyOGRjZ1NXU0pCZzJmaWhQSjIyUlhNcVpIc3N0TUtZSTFCZlB3VktCTnhKMytTSDMvTWo5OGExakMrMXhaOWg1YUJvUUdRUVNDMDlTbGVvdzN3enVFY3licGlac09Ccyt0VE5DZ2hybEEyd3pJOEI3MVhTSHJVMG1EVE1yOWZHaUdBN1lod0VvY0F4QVBRRG1HbVFZTy9nVUJNY3pjanlCeUNrWEdGaGpIaU1nNmxBWjVDQ0dROVFkNitkc1h0enJWMDRHcDVBTnFWMU5aTlYxcW5ZQmRDSUpKV3JCVm0wc0pwbzRyWElBVGlRd29YNC93N0lPL1dJSTFkYW1Pd081NTFEamNpYW9BVTBydE9MeWFHbFZzMUwvUTJ5SUM1R0FDZ01SNHZKLzdQUkc1SU16UTN2ZGFhOHNBVnFzTnQwd0x2Z1VBNFZseFlhTEdrNlFiSVZhQUd3UlhWVHNxL3hpdFVBUUhTSUtrUENHN2FQZE1BZ1B1dXRBN0FpRUVBekNrQ2pNbC9yRGcwbDNIYXRiWGMzVnFNL0pEaVVSalh4SFEwemozbUZzbWRRTWl6eG5Ba0FOQktBWE9jZDE5NVo4NmxqNm0rMkV5a0hXN2RmSjVndWRZcnpIK3gvbjlsaElhT1hIR05qaDFGV0hJTmhtMWxIM1c0Y1AxNjdhenVRSm9VZDVQVFFsUjFBYUcvVCttUk84citPVkVJeVJxQk1pM3pPOFFCU0NLVVdnRGdGZXhsaTd5R3ZDYmthUndhWUVOR3B5djB6UkJTYnFnUTBEbWxYR3Y3L0JEQStZVXJMWHcxcTZSOVZ3b0FtcDFlSmhzdDdqT0ZFTW5GamRiSnMyUHRoVjFYMnZSb1VnSHhXTDF6U3JHNmp5aW12MHRwN0ZnSEFKL0RPZ2NiRWFIeXZ3bmtjQWtyWW5PMHFRZ3Y5QlNDN3pRQVFOanRVaTg2emRDRXI4VmlQSFhGTmRjNU5lYU1XSlZjSjEyc3VUU2xnTGtPZEJjdzNCdmhNTlY0Y3Q0OUFBSFNWS0l0b0tEU0FvQWFnemlHN3JBa2x5ZVMvMWh4V0UxVVl0ZjJPQ1VBT0l0WVV5dnpRaFJwZzUrUEZxYzM4TUN5eWJFQWdKc0JXU3p4bk1MR1BuT2xEVk00RFZhczJ4Wm5kNXc4VDBpUFEwVWllZjhTKy85ZGZ2eENDUTl0RUZnK01lYit6QlgzQkxBS0FiVUhjcTFENjNvU0tZeWZFU2VJMnp3ZkFBZzRVcDV6VEo2T09ZTkFtWmI1blFRQUxzb0FBSnBpbkRmaS8vTkcvSjhKYmMyZ3BQNVc1YzJIL1dKS0FXTVRIWnpiWXdqZkhJSU9PRlpJd2dnWVl3QkFLSDJ4MFpYV0Vwa0hyOVUrbkVNdFV3d3JpbUp0aHE3QVh0Z0x5SjVYQVlXN0FPQmtWeUdXSHdjSTRSb0p1UldlVjB2Sy8yc3ZBN0JIVHl1OFU1SVhtc01MeldrQVFMYUNZVmxmR2tNVk45K0pzc0E0Z1dKUmFIWFNOVVdRYytFeWlkSUpxdGx2d3BlUXgvdkFULzROSDlPNzV4ZEhXaWRiQ3FvbjhDNUpwWUE1M3hNSk1UbEFyVW5rUDFFY254bWtzWExXTkJZQVlOT2YwSnJ1dXRMR09taFZQUFBmODlJTFpoNHR6cTRwbjNWeDdZQzFWQy9ybmJOT2I1Z3lSb0s1THVCR3R2SzRNVDBPQ3pqZGhGanl1L254Ni96NEYxZmNueDZGUEFzay9JNGorb1pRS1dBTEFJVE9hdEw4ZEZGbUE2ZEpZaWhnRTU1M2JEeG5pK1NCMXBUSmttbmxBQUJjdXpRQUlPbGNvN2ZFK3Z0WmVzOUdmOS9uSHZBL2NvV0txMVl6SU5rZkJ4RnJ1T09LeTlqaXZHbG42b0hDVnA4Z0pSNHFZTVMxUkVZb2ZSVmQ2WndwcHZVVUdYU2wvV2pZczdBZWtEMzFoc0xGdEZyTVlPTjNRKy9ucGl0dDJvU3lTSFRPRXkrVFVQbC9DZ1R4UjJDQXhucWhCem04a0FRQWNJSXFIV3VLa3NLNHRzUkl0c2h0d3BQSUxQMUpwN2NiSGlaWDRqYU1UVmZhS2xTWWxpLzk3MnY5SWp5RVBON3Z2Qlg5alNzMGVIbmdCWmh3QStwQVNXbVdINytMNW5MU0FJQldvMzRiRGxBTStlOWpyemlTS3BIRmpFMGpWalpJTVRJOEVOeElCQTh0MXZiV01pL3UrM2w1N05jRmgxV3hiU05oRHdxNkZ3V0xhVDZieGtIZUkzWnZrckI1cGlnUnVUL1BwMFkrUWkvT0RjL2grQ0EvM3NtUC84aVBuenU5M1NzTHBOM0FONndBdVU1ckJxUnhBUENzN3BZeFAxZ2ZYd3BJTlVHcTRZZ3JWSkZjaHBTNW5jQTN6Sk04NExiTUlabW16ZjNMeUxWYmQ4WEZrN29pQUVCWElDVndBNWo5NnhHcGZ2V2dNTzU3dVhUVGcvNVhDZnRqTTJKL3JCcUsyenBURXNKc0pMYTZaSGtsbFRCKzVvcWIwR1ZnUDh3Q1lkektGQk9DNUJqc3QzWUlpVDRpTno2VDhGajJQRGNVYmdheVlxWUJDS3dZNzhhRWFDWWh5M2tRblhQYm4vbXZ2UEwvNEdmWDhRYzIvSlN4WU9XTUJhYzNlRUYwdHdqTWNaN0F0UUJMWHc0N3Ryc2RkTVhGU3BhSldEaG51Rm9mK3dWNDRKSFdEOTU5L28wWHZoOTdTL29yRHdodStRUEhDb29QZXVoZFppbHVYQU5FajVnYTlmT1I1RDlSSEtGYTVMRmowWEMxYW9kZDFuUXRzS2JDVWg4M01pOXUrZ054eDMvVFhTREZhSTJUWnBVMEs5NkRDSlR1SytzVTJvZkxKR3hHRldFakhoZ21jczRwNzdhb1dCKzRqbmY4T29vWDU1TDg5Mi81OFQvOHQzZTQ0bExHTEpDc2J4REJOK20vUVN0ajIrSktTd0V2QnRaMU5YSitua042NmxQL3JWeEZjc0lWbDJCZW9lZXNRQXJjQkNsL1RKOTZrQ0RUdERyNmRTbldia1p4R3d1d3hDd0E3cGVocFFUSzkxaC96NWszNk9uNzN1K1RyL3hlcVF2c2o3bkEvdUExWElpVTYrMUdDck9rZTA5UzlzS1VzbTRQRll1N0gxSjBKMTJoUXlFT1REa1dWemVmUitIU1pKU1VWaUhoc2V4NVlsamRYUE1FcTV6T0tWbHNuQkk5UkNUa09qanJvbk8rOEx5dFAxMXlmcTRMQUhRcEUxVHBZQUhUb3NRdUpvR1pQMnNzc01YU2w4TXVSRDJzV0RhdERLdDMrd092YUc1NjlQV050L28vOWZIejkveGlmT3lWNnRmK3dLR0NlZ0FwZk8wSjd6SkY2VHR0cnRBNUR0MmlvUnIxRStRRkNiSEdmK1BzYm1ScHg3Z3loM2pZSitCOXRVT2hIZHBCWUJRaitWSThMOS82K1pZNXg4WkpQRmVURVhzUUQ3aXNFOGJSWm8zRFBPM3ZKM1VDUXNLRzk4RjR4SHh5M1g5Y3gvZTgrLzlmOCtPL0swSitJRklnNFRjSSsxZ3JZeXNFS0h6L3ljQzZzckJMbXArYmZxK2k1U2ZDZFFnVUI2K0hQQWUvZ2VWQkxmQW5RaktObFZDVGNZYkhEZGsyUnQ0TjV0OTg0UUU0ZDRUVVVnS3h2c0prUktvZkE0M1B2SHo2azMrZXRUL0dVeWlzaVJSeW5kT1lKVnRLK3FnTTBSaWdkYnREeXJiRkZSZnBFaGYzR0EwdU90WUZQQzdaYi9mOVBIWFIrekFKajRuZk53RUUxUG8xeEtxbjdIN25keHQxZWxFMGZOWlRXTWV2UWVkY3l1M2ZYNTc1NndJQXJjb0VWVG9HU2NCb3NZdEJWMXgzWFp2RVlicVhzTGp4c044aGREYXNERTd4NHlwclgza0YvNmxIN3U5NzF2VnYvV0w4MFIvb1QveDFYL3BGdTZHazhTVzl5d0NsNzNEM3VGQ04rbUVGQ0wwTXNNWi82WW9ydWxXeXB2TGVPSWZhWVI4eERzV1lLMjVTMFFkcjJrUUg4Q00vMTU5NkFmZTVCd0YzWEhIcmFwbXJUTVFlNU9JNm5UVFBTZnNRVTY4NkE4SUc5MEZ2WU41NVBwUFc4Wi96NDU5SXlMZVJRQnFPRUVpaW5HWC9jQTE3c2N4NWJtUHZuVFEvMy9oMWZLZ0kxeDdZUzd3ZTJqZDBHUExnUm9KTUcxREF3NVBJdFJ0VUFBNDNiQkxQRGFaeGNVb2dwL1JaZjgrcGZsd2Q4Z01QRXQveENxVWErMk13VXE0My91enRuLys5LzhEaDAycWlsenU2S0VYbGlTY3cvY0tuTXYzT0M3YjN2WkQ3MUcvbWI3end1KzJGVVkzL2JhMi9UNk9DeFBvQlllR0JiZ1lrS1RXbisrRzZWdjkrOVY1SVBmVUg5cjQveUJKWEU1VDlrVWZaNy9yRDloc2ZsLzAzLzg5My9HRkVaU1dLL1JXOWN3WUdwaURpSVVkcjRrTVBSSDdwbGVSTFY2aFNLQmtKM1pDVklQTWljOU1McVVPdGlzTDlBUVNLTUUrZituZm56SWZ1d0RNNHM2SUZpRGdpOVBIOVcvMTEzWkh2L1FwWS9QamVTWHU0eTNoR0wreUhOcmdIOWpYZ2QrbFFGR2ZNODh1NTc3M0llL2NZMzRaV0VTcmNKbkJyaHVZZW44SGd1eG5XTGtrR3RBU3U3U2JBOE55Rit6VDB3SHpKKzJDYWJtZmdPZkticFB2ajk2YjV6dWFFNyt3QTBuSG9YZmtkWHBKMUhET1ByeWhicVZKNTNrN1dhOHhjNC9sL2FGalQvUUVRUHBJQUxybjUwdThWR2Z3NHdiaUtNYWlRaUhzWHVHQXZZSjY3akZUbGJwTHRUeURrZkl0U1Jic28xYlBiL3gzS3Z4ZXdmenVjM29kSEc1anA5b0pMQVljczFuSUdXN2t2S2xEOEx3M0ZQd2hvRm9zcWRNSkI3SU5ZMGppNERqTVZBQUZ4dDcwSFFPQjNmb044NUsvVDNOWGlBaHgxaFc1NUdCOWlOeCtXZ2YwRW5sZFBncUJQc2RKaUxTY0VBYmY5ZDlhQWtrWkJxYkZPK1JrbUExVVJBQjJLeGFmZGt5MnVaZ1c4eEhpQTJLb2NKWTlFYjhCU3duZlJYT2N4enkvbnZvOGo3ejFrQ0U4aytOV1N5NTFkck5xZUdTYVBEUUxzTko0dWpPdnlkYkl2MFZ1WTFndldBTlp1eG5nTy9pYk4vZE44WitoYXZHZlN1MnBleTlhVTh5Z2VoNEhBTTJLSDVrRU52VDhYdUtsWDlsOGZ5TU1KSXd3M0E2RXJEQzlaSFJqLzZHWGwxMTY1aGtLR1V3a2hWU3NWOTdIL2xoY1FNdXFoODQwRHc1eXZnSFF1MldZaHo1RGxjVUx2M0VEa1FFUHpGUUtBcFBoNTJxSEZ1UnNxVVB5czdBYUpqVGtIeENiTU9lWjBHR0ZqVGxVQkNIeE9RRUMrNnhQL1RUOFF1eDhKYXpQK1hlYUpJWXB0WUpFZzhpMkVKdjVFeEtraEFCUVlwNTB4NG50akJ2RkZtZ2ZkQk9YZm5CQkgxSjR4UXpIV0RKQXVheE5pdmh4am5sSGkxdFo3eDNCQUp1aTl0ZGoxQ0pDbVpnSjhGQ2JQeFQ1L1dwbTMwSDJmUjk1YkU1N1RSRlREdWRkSVZscThmVG9RTSsrbmN4aVNBUmxhWjc1MmxOSUYwL0JnT3AzZGE4VDZUY3o5aDhFckV2dWRvV3Z4K1Vudk9xMHcxTHRTemlOeURxWXFsT2thaHlyMC9wTktlaW52UCt3aGdnVFdGU0o5YWdSVDdadzhOS3ovT2tVR0k4RmFJNFRXQjd3QTZJbm1SbnJUU2o3K09OMWJQRUJZdkVuamhvUTRKOGhSMGZyd2FMMWNrSmpiaGdBZ3hGb3ZaMmhNOTFjVkt2NStSZkZqUHVhS2tuWW91Y3lTeXJST0xPSktnTUIzQkFRK0ExN0F0N0Q1dEI3ajB2QmpIVkljWjVSME1Ld0YvN1cvLytldXVMM3ZKQndnWkdxdkdDeDJMZldseVJVWG4zbEpYQVptRW11TWNLeEFKV3pob2lwVWlnQVlTV0I5eDc3MzQ4Z3NFSDdHS3FVU1RRYlNlNUJGcjZYUHhUeS9uUHZXUjk1N1VSR2VYREdUYzYwNXpTcTBucHFReE95U0pCbUF2VWI0V2k0WTFKWXlFNmJIbFZZV1hFejRUZWorbkRVVSs1MERDZGZpODVQZWxWTmtlMTF4UysrWWVjU0NVWXNWeW5NdGl5cjAvZ3V1dU1CVXF5dHRNalVKZTNwZHlhbmZNVkpNdFhNaUtYVWg2NThyVDI0b0thRXhYb0FtVjl3Q3ZjL1pmU2VXWEhHaElTMmNZbVdIaExKT01FTkg2OE16ci94OVVkMFNCQUNodlBWeWhsVmVzUkxGUDZxZ1JjbFZsUnJSWEp4RERqa1dBK0Z1VFdtQndDUEt2UlVnOEszL3JsdCt3MGhxVEtpNGlGU2swb3FTTkFDcitBZklWUGlPMHBUbVFYQmp3WXhRL3JSVi9FS2UxMFFzY013bDV0clR1OHBoVmV0UUd3SmdIc0RabG5KUHExc2plcFpxWFhJZENDMjNYTjVaaEl1QUtNbVgzcUZySlE5NlViR3VZK3BRNFBORDkyWExLZW5lV3JFVXJYQVRzdHR4N3JWQ0s3eWVXdDQ4N3VldEJCa2dOUVZXRlhtQmZVTmtyOFRVd2tDaGpkWWQ5aHJSNm1lTUpOeWZhMTZNSm56bkVpZzc2MXArZmlid3JyaXUySFlkVzNySHpDT1hYaTlYbmx0MVZFTHZ2K3BLKzdXMGd5RTA2WW9MUDFsVjlXSUtXR0dScVJqckgwc3hjNXZqR0MrQWVFVXhiR24xbmNEQ1NWWTRKYWxsdEZaM2dtdDBjQitlTlpmUUFWTURBRmk1cnBKS2dGYWxyQnNWS241QnZhajREd1BQMUFCQXRncEE0SmtDQkg3dy8xM2ovOStqQ0FCd0hBRUE1RjVTcStDT0s2MkFKKzB0NWZ2d0VIR1ZyMUQ1UytFZFlLeE1VS1pzTktuSG5sV2VFZXhFRlJBQTh2NVlRUkFQLzU0aUVMbTZYRklsU0trdWQraEt5M1h1ZzRDV0E4ekNTR3F6V3lWMGs1Ni9ZUWc1Njc0b2lKTHV6ZVZTcmRMTm5OKythdndXNXlZWDJLTmFKVVdyNGlWWEZjd2w3QlZXMEFldXRCb21sbEhHanFZQ2xBNXBua0lBQUsvbFhodmNlejVuM0hjMGNPMU9BZ0RZZ2JNcjh5TGdZZ2E0R2JOdzVuRk9kaE1BQUg5am1xRlZVbTFSWkd2U2ZrRlhPWloreGo0U1dIa3o1d3IxL3FYTU5KOFQ5Qm8xcExEK04xMXhRNkEwWG9BZThvcGlWMFZzK29YVlNLY0M0UlN0bkhxU1B1WHp4SDE0dHVqdlN0WXdCQUN5cnJ4cWNkc0pBT0J1aFlwL25SUy9DRStyMXJKMnlQWmRhV25YV0NBZ1ROOEdCUWc4OUFwYnFnUEtxQVFBNEgza2VZK2RYVzc0MUpYV3M1ZjY2VkxUZnovZ29aRUNJeHdyV3dFRktzK1JPdTA1RWx6SEFhRnVDWUFEQUJKeXYwUDZKaFNJMDhyQlQrb0ZJVUxtQkJTdjlFVEErMk9Ic1dQNEp1bU1tWFY2TTZhazUzT3QvbU5ZbDFORkVPRmVTTHIzZ1FMRU5BRFE2K3lPYTVyd3pTWHMwVFQxOHJXK0FxZUJ2WktCZlNMOU1LU0Z0ZlREd0FaZkdWQ1EyRmxRT2hOeTU4WUJWOXFwRVpzTUljRFFHanE5cHJtWkJ6NEJYM3RJOHpHc2hBQ3dhYytGSzIzRE93M1hib0NTQ1owTkRRQWNSNDdYenU2bFlnR0FwRjRMVnZNbjJYODU4b3B0QXhpM21saHhhZDAwMWovdTd6UmVBTnhyU3hSR3hJWnJ1TGNYQStFVURRQmN1SER2Q2ZRQTdORFoyQUFBZkc2dFlRd0FTRk1wYmprQ0FEeXVVUEh2S1lxZlhjUzRJZmlRcllJVld3NFE2RFdBZ0NqK2VsZm9CdGNDb3h3QTBFSURuMmNCQU83Q3R3M0tUelpJMXBWMlI1UVluVlNoMDJKbGUzQVBiQ2l6cmNUdUxLRWVFZ0RTeFk2N3pFbFRrcHdyYnZlWnBoblVIb0NWZlhEUDdZUFN5b0VWSnVoOUY3NHA1MHBiS0tNRkd2UDhJMW9qN2I1YTg1ZWtlNk9IWnk4UUF0QzYwUjJCa05nejF2Tk5BSUErVjF5T0Y1c3BIYm5TYm96Y2FFejJGYllNUnZuUXB3alJuQ3Z0MURnRjc0Q3RkUzljYVZPblNWZmErNEdiL1NCSGFRQml2OHZ3M2dJNDBlSmRJRU1tUitDQ3ZXUGRDZ0RZaVJ5SHJyUjljRFU4QUpvU1BvTHpoLzFCbHNuYmV3aUd4d0VaZk5qZkpZMzFmK3BLVzVKYlhnQXNzc1o3RGNPSWVCWmtiNjlDbUluREtiMWxBZ0R0N09GKzNLZ1dBSWlwRURjZENRQmVWRW54NzVMaTUxTEJ2WkM2TmdBczJMa0tnUUNtL0NBUXFJL0k2MDBEQUpKeWpUVUFnUEZ5UEVDckpMaU9uTjNZUjlCdXhrREwyRzVXNHRiWWMxNjRDT3VHSlR1Z1dIWFk1VkNRL1JKd1BOaVMyMVRjNUMwQkpZbFc3UzRkMUMwU2RoS0MySVB2V3lHRm9pbUlvWWpuNStpK3E2NjRJOXlac3hzWUpkMzdFUGJ0V29BRW1ER3NYaFFjMW5wcVJOV3JCQURkQWFWKzZrcGJnMXRnSWF0NEMvcWMzcTJSQmVZS1pFYWdGK0lZemdOKzZ6UzUvNC9KL1kvS0JkT0NKeFNQMkttaTRGZElHZVlJSUV5Uy9OTXMxZERZSW85UVZyay95dk8wSEFCdWhvVGZpVjZNV2ZCNE1PaTVNT1pVM09scHJQOFRDRGxxWGdDdUhpcGVnUCsvdlROaHJ1cktyckQvUkZKSlZ5cnBWSkpPZHp0eE91NjBHOGRsNDVIWVFHT01RQXhDODRDTUVFZ2dDWVNHRXBMUUFIYis4ZzNxdWllc3Q5NCtkM2g2TXJUOGZWV251c3FON252djNudk8yV2NQYTA5WitIV242R3pCdlY1MHRodGVsekJiOUM3a1FnQUhMUXlBWFp0UGFnRDRPOXJhQUtoU2g1dHNZUUNvR001eE52NlZZT04zcWVEdnJOWldaVDE3TVFUdVc3bVlHZ0lERGV0Nm14Z0FUWFFWdEdGUWFrKzVYSFEydVhDWDRYWlIzOW8zR1FBVFJiNlB2ZmQ2MTlLZmVjbDJqL3FHNXhZQW40RDNKVHY0YWNhUzllK2UyeVI5SWRPS0FHOTkvVndtN1pMOGp1VUdHMXp1ODEvWTZTWmxnM3RQK0JjOUdBQ0hjbnBaa2ZjMFZ3WVk1Y1M0Mi91aC9PMThUYW5xU1JvQTF5dmMrbjVxdTFkMHQ4L2VDOXo1Mzh2MzkrWmthbUM0YTkvLy94MTVkMzB6YXVMK0h5bzZtL1o0VGt4YVJ3L2xONnlhaDBCYjlLcnJYNXVrUmJGcUh5bW5ZTlU4aGJ0QkNNSlB4bTJyQUthQ3ZTS0Y0TnhMTTJtbjlyUU9IQVplRmEwMmEzUDYzN1puNnZrYzZiZTZMc3RNSnBTZ1h0aE55WmZhbGZCbTlMMmpKTUJOOGJSRysybTBKdXczTUFEKy94cHREWUJid1JocWFRQzRHRTR2Rzc4Mmt0R04zNldDTDlxcFhFVS9lakVFbGpPR1FLcERibExYTzFkakFEVFZWYmd1SlQ1M1plTzlKNXZib3B6azJob0F1WW1hTzNsTlNnWjBFamZTdXYyMElFMEY3dFNYZHBMeDhjUU1oZlhNNmFMS1RlNExXUzUydVNVWjRQUHlmaTRkd3dEd2hUcDMzVjRNQUkwVEw0aW5LaWNFRkxYNDFkQ1Fla2dpQTl2RnFrN1NBSWhLWjNVVDJMUEZORElzZlhPZWtVVmREUXcvNFh2ZWdKN01EaVRVc2hkc1JrM2QvNnJYcjAzUzBpYXdJY2JPYzlsUUl0Zi92Q1hHcGxOcmxLMnVZbHYzTE1UM1BEQ0VvN2JPNmZwdGRRRDhmWGx1ZVFhNkpta09neHVzK254OHJyU04vZWR5QWR6WVZTK0FkMWZWME9lMlhHZE5qQXdOelhxRmxKY0JQallEd01PTk55c01nRTN4Mm0xVmVSRjZNUUN1eUJqb3dRQzRWWFNLNFJ4bjQzZjFOSlZSVFZLeHFkY0xqdThBQUJiVlNVUkJWTGxFOGdZY3h4QllEd3dCRlI2cXErdlZFUmtBYlhRVnROM25uYUJDSWlXQmFISm1Xd1BBSitxUGdjRnlSNUlraDRwT2llT28wVWJWaHJGWk1ab2tHTlVseWoyU2hheEo4dEpzeXcydTd2TjFvWjdxa3dIZ3YyMWE3bjBrQmF6MXlvL01uWHhvT1JKUHhTT1FObGd0dXpwcEQ0QXU0TE5CaHZXaG5ZN21BM2RvVmF6NFdwQm5zSllKSGZqR3NWR1JaQmk1L3lPRE5YVkQxQ1pwMDhHbXJDZnliVXRFMWRhOHlkT21wYkZlcjY2Q1RITVpZMlBQd2tIYWpkQ3YzMVlKY0xyQ294YmxHWXhrM3B1cXVkTG05UC9VUER1YVhGcmxCWEN0QncyVlBaV0Q0NmFGNXBiTU96SWwrMUV5VWg3Sm9XY3ZZMERlQ0F6am5aL0tBRGhmZFBkamIvcTMva0NPcy9FUEJ4di94ZkloSmEzbEw4b1g0bndmRElIZHdCRFFoMUpYMSt0RERZQzJ1Z3F1Y1BqUUtpUzJwRHhTeTJsZU5qUUFaZ0lYOVkvQjMybzhPSVZCcmt2Sm4vY2N5RjMzUUZ6UnVmR3lEd2JBbkR6dkp0bkwvVFFBOVBOUHdnRFFoWE5RN3YrVjh0My94c29BRjZ6OFRPK3h6OE5sV2JSMFVUeEpBOEI3eTgvTDZkcGp3Y3NXMHRuUFpPaHIwdWdWQ2FYZHRWRFpvU1VhNm9sc1J4SWx0NFBFMnB6N2Y4N2M0Wi9KWnVWcWNscDU4MHcyUGZkOGVDbWNTczErVVhRcTF0MHdUOE9DeGRZUEpiOUhTMjdWdUVpZW45VFd1VzB2Z09nZGVKbUxVZmRvQURRNS9XdGk2SElQWGdCWGU3d3Z6MnRMM2tzdHdVdDVGTzRkdVJtRVJqY3R0MmVwSXAvQzh3YldMYjlvUis1Vmg1YkFtekFBUmdLWDI3WmtNYmZaK0pPcjN6Zit6MG8zVFdyVmU3WlBoc0F6aWVOc0JiOXh0Q0lyTmpjT0d2eWJuY3huYVUzd0U3dVgrL0lDYll0QjhLS2xBYUNubVI5cVl2RHB2dVlxRjc2cW1NeHRkQ2N3QU9vTmdMVG91bTZGaG83bTVNUzZKdStyYmpiUHBUSmpKU2lUT2trRDRLS3NNUk9aOGpxTmVUNnEySlRkV0wxVWJwUTNHcFlEcXFja25mWWZXNlhCdXNYdm8zSkNWZEU3VzNSM0g5VFR1WHNCL3RlOEdvOGtyS0d1K2RRaS9WTUxNNmh5NklJODk1MGc0WEM1NkJiZFV1TWk2ZTZuSm1GWGc2SHpQMm4xUng2QTNIdDhPeWdGYldJQXREbjlQNVIzcW8wWDRJWVpwcDVEc1dWaGxlM01ITHBsdVZHNm1XOVZ6THVyUlY0OGFGVzhWbHFpditKZWhEZmxBWEFGbzVPcXpUK3UySkI3Si9hczlIREZFb3VpRE91NnNkZnczMFVKbVhlRCt1RUQyU1RYeE1YVk5nY2dxakYxRDRDcndnMFczVjNIMHZOSkMwZXVkcld0N2tUMCtSZ0FuUVpBNmpyMlJmRmFRR3BBd25BekZlV3gyMEhKWjNRU09Va0RJSFVFOUUzYU5RRjJaRDZtcXBMOW9EeFBzN292bE92RllFVTVZQW94ck1vOVY2K0NibUlhNjgrNS8yZHNJOUV1b2FxNnFhZnpqYUpUQytORkVlc0RlRStFOU95MWFjeGswYWtpNktWMU84R0dvN0xiN2szNnNxanVnS2NpYXNsclVKVURFSGtXMVZ1bGMvVWdLTVVkSzdwN1F0U2QvaDhVOWJvQWtSZmdlbWE5ZjE1MDZoVG9QYTRxcDR3Mjh5Y1ZucmZMUlY0K2VGSHl3TFJNZjhFU09RZmZoQUdncnV2amx1VFYxZWFmMU1hdnBZZDZROTBpWEtrWm5nTlFOYnpQZ2J0RWQrUWt2UzVsZUErTFRoR1FPZ01ndWVxaUVwTWZLdHlxU1hkY3U0NGxzWldoaXFReGRlV3V5WGV1RzVFdVBRWkF0d0Z3dE1sOFZOWkcvNkhvYk1JeUUzaThsaXlPcVdHaktIdTU2ZjFSMmVlbUJzQzU0RFFYeGVyM0pIblJrLzkwOHgyVnhUT3RDMWNibGdQcXByNG1zVnpOMXQrdU9HVzYrejkxeHRNdW9ib3VMa3ZlenFFWTlYc1Y1WG1UUVJoZ01MaDJrM0svdTJKVTVQSkp2aW1xTytCcDE3NjB0bFJWQVd3R1ZRRFRtZWV5SDZ4RDZmbTJPZjNQbVdlcHFSZmdlbEFxblFTNU5EeXpJcUdBOWFKYk5qck4xV2d6WHlnNm14K05XZ0ptVlFPaDFBeklHd3BwRTZXQk4yRUFxS1ZiNTI1dllnaEVKWGw2NHJ4MFFodS9aa2FQU1F4c1FxNTd2MkxrcWdCeXd6c2RSaTc2UTR2MXpNdHBvczRBOExhOVVZTEpDM05CUHBReXN5bmJVT2JFVUJzUE5tbS9ybHZkZFpvVFVZWXhCa0RlQURnU0wzbXY2T3dEb09XYWQ2V2FaTUhpbVZWWjEwM3VUM29YSGdSMTdGVUdnR1p6ZTlucmsrQzdyUVVuOTRkQktWcnljbW1YenJweXdDclg4YmFWWXpaeC81OHZYamZHVXEwU2RTYy9LenFGalBTLzVkejFtZ2o0cld3U2R5eGNXRmZ1TnhNTXJ5aTVWT1E3NEdublVaWHM5dkppUGRIcnVqSXYxM1J2U0pVT3dMV1dwLy9ab3BrNm9Ic0JrbFM2NWxNc1MrTDFrdVJtUGJHd3RsZHNmSmZaekwrWHN2QlJXNSsvTHFwYkNJOEYvNjJyM1hpdkJzQ0ZZeGdBM2w3V0RRRnROdFBFRUlocTg3Vm5zdmJQN3ZmRzd6ZDBVRXB1cGpPVGFLYW8xd0dJeHJSazFkN0kxSEo3Tm5LcTRYNllNUUNXcFNUTjIvYXFBSXU2TmIxa2I5SEtEMVh5Y2pHd25uUENMb2Uyb0MzWUlqQnYxNDVxakRFQXFnMkFkNE5UeTJPYlMvY2txYWxKekRYbktkTHZwUWIrVTlsOGZxZ3hBRDRyRjdyTFFjbmVzbm1ROUlRY2VTdDBzVTBKY2wvYmFTNVhEcmlWS2Vuem5JRTkrUTZ1VkRnVHhKR3ZXQ3c1a3ZuVjBsVDFDdVRLVnUvWUpqM2FzdHl2NmhEaW1oTGZGZmtPZUVzV25yZ3QzeWNuTUxZYmxLRXVTYTZDYWdCNEtiSldkN1E1L1U5SjJNV05rc2dMTUN5NVoxcTVvZnVYZG4zVVRwTUxSV2RyWUcxbUZtM200K2JoSHBEd3l4ZnY5Sk1XbTdqTDA3WTFBQzdXSk9ETnRUUUV2RGJmVDV3M3hWVjVFaHUvVmlCb3ljMnd1YzlHS21LbVVWS2JqMkdKcVExVUpNYnNXQWdnZGJYYmtOTzJiblM1dHIwam1UQ0Q2K0dycWw0cVBVa3gwOGZCUnFiSmkzN2RmVW11VkRYREpYRk5yeFo1bFRFTWdIb0R3S1ZoYzJWSzZnRTR5SnhveHpMZnkwTUcycVh5bVNUODFua0FQaWxlTjlPNlZsUnJBdXpMZXhRSnVxU0YrNUlreU9tMWgrMlp1SExtZm5EcWpISUdkdVU3dVBxZ3RzVCtxdWp1ek9oWitRZVdlK0gvdjNyT1ZBeEkzY1dUUlY1YllFOE1pTG9RWktRcTZWTEFMaWU4SENUcWVpOEtsejdXU3FzMUNiOUV1UXE1WGdCdFR2L2pSYjFPZ1AvN1cxSzVrZmFYU2FrSTBLUjE5WWpPaWhjbEpWWCsyU0I5NTAzVGNCTWZ5b3cyQnNDNW1rejhxWmFHZ05mbWU4OWtkOU9jeE1hZktoQXVTSzdCTlNuRkdyU1h2Mmt2QUIzWGlzNk9oRGtOYzAwQ1hCZjNaVXBPMFZCQlZkdGV6Ynhlc01WRGpRRFYxZDhvT3J0U1JSdlpVSkRBdUdGbFNGRS9nM1c1TmxVQS9UTUFVcW5vTXl0SFhTODZPN1R0WkJMYVBIczViY2k2bUcvYUtYcW5ZUTdBUjVJbzU2NTYxd1Q0VVVvWWM4MnVVdXowS0xUd3NaVEpEUVRsZ0t2eVczNHN1dVdmNXpLaHJCOHlDWWpqUlhmRHJhZ3pvNTd3WGVZM2FocWtKMmVQM3c4SDcxa3lrbDRVbllwMWRTT1hNK1R6YUs5bVRjczFHZHNTbzJmZnFxRDJwUHh4TzhoVjhOYmdreTFPLzhORnZrRlcxZDk4TGVIbEc1S3c2TzEreCt5L3BWQnJ5bGM3ZXYvTy9TVVlBSk0xbzZrQlVGV1NkMU51V2xORFFDM0dxR2V5dTV4ODQ5L3B3OGFmU2crL0ZFUGdUK1Z2dXlUV1lpL2RBSFZjTE4wLzV3SzNsUzRJaDBWM1o2OXRPOVhzeXdZZWJUaGFrblJQZEFZMlpDRi9VWFIybjlzcjZqWHRtMXhYdTlMcElyRGZndzdBeXpkc0FMdzhRUVBnWlo4TWdJT2l1NHZrYnRIWmZXM0Q2czRueFdpZnRlejhYZGxrOXVVNjJzNjFpUUZ3cGp5cGY5MVFFOEIxQWU0WDNlMnV0YW5MWnhXVkJvK3RUajFxQU9XaExKV1RqcjZESmlCK1duU0xNcTBHdVFkUExOZG1QdmkzaDNZcTF0TnE3djE5V2RUcmJ1ekxkMmxxQU5TSmRlWGFqSzlLc3B5M3BkNjF5cWFWb2xPYVdFTVM1NFBmbkE0a0c1blRmQzVud1A5T2Ywc0tJZjJwM05lU2NlTWFDTkYvRzdCRTlVL2ZkZ05ncnVGb1lnQ2NxYWpOdjNJTVF5RDNtYU1aSzFWZnFPTnUvRWx6NEJNeEJMNHFOK3B6eGZIYUFaK1RjWFRkejh0N054Ym9BR3dXcjV2WnVDNzFVMW5VZG92T1B2VFJoak5RZEFxVDZHYWQ3cnQrbGs3VTdRckQ0bXJGZGRma3BMaGJkUGVrM3haamI3bUJBYURhQVhVR1FFNWpJRHBCN1RRMEFLbytQM2ZkcGdaQTFiWGJoZ0JTMmQrdVBjOGRNNjRmQmg2MlNOaHJRNjYzRjRUdVZ1UmQzYWt3QUQ0b1QrcGZXY1orMUU5QzcxK1VlWjljNytlSzF3MWR6aGF2aFhnaTQ4S2Z0NzkzSG9iemQ2UEsvZjlKcG94c1J6d3lMdk9icXhMd3YybnluclVkVFEyQU9xMk83eXdSZkZiVzlSVUo4WGs0NGFua2ZpMklRVFFtM3AzMGZEM0VvTU5QOG9PWnFvSEg5bmNkeVlidm5EWXFESUJITFVlZEFmQ2ZaVG1TR2dKZmxoUHh3akVOZ2FZR2dHNzhTMzNZK1A5WUxyQi9MRjZMRDMxc01jeWNBYkRUd0FENHBCd2ZsNHY1bWFKYkNWQkRHejV4SHN2emVSTDgvMTBDRVhMaUdyTE5XcXMxZktLcWFtRzZ0eDVhcUxydWttVE1yZ1hYWFMxZXQ5YU1Fb3dteFIzOXhIUUR2UHpHdlVJNWpZRXBPNkhwdjNPUFU1dlByN3B1OUR6YVhMc3VDWERHU2xXamU3NGU1Tm1raGp1YVkrUFMzZzh6NytGYTBkMkZVVWNVaHZwOU9aOCt6NXpVYzgvUFQzazN6ZlYrZEQvK0t6QXVQTWNnZDUvVGV6ZGQ4d3lyM1A4ZlpieVRmazlVNWpmS0YzaDZqUGVzelZndFl2R3Zwdk1vWmVoZmxPVEhZY3Y5MGlSZlR5alVKbWRlem5aTkVpcy90NnFIQlJzcWE2eUo2VGVMYm9sNkhSMVZGajhYQTJDdHgxRmxBUHkyTEVkS2hzQ0g1WWI1YVI4TWdhWWhBTjM0OVlYcWRlUC9qMWZqMzhyL2ZiOWNYRDRvWHJlbHZCZ1lBRDRobzhtaUJzQUg1ZjA2K3J6ZlNTV0ZHZ0VMd2VUUmlUTXZHKzFTMGFsTFBXY0pkVW1nWk5CS1ZMUnNNNXFvS2Z0ZnU4ZnBLU3k2N3JTVm9EMnN1ZTU5T3dHa0JWNWppNHVtRzdCb1dkS2FGMUtsTWFBeDJ1aWFlaUp1OC9sVjE0MmVSNXRyYTdiNzUrVzcrbjQ1OTZKUzFZV2lzLzJ2MzNPOTMrTldaWE10TU9ZV2FxNzFJTGpuVVNMcTcwcGpWMC9xZWxyTFBiL28vbjBycnZjejVmcnpVWGwvemdlYlFOMTlIbS81RE4zOS8yR1FuMVIxVDRhdFlpRDNOMjNlc3paalVUWkIzVHlienFOa01QNlBHUUdlKzNXM2lEc1d6a2xaM0lURjBwTW1RY3J0U092aVRQbDlkY3dVM1EydExoVnhrem9kZDFSbjRlZGlBQnhuNUF5QWYzbzFmaVdHd1B0OU1nUVdHeVlCUnBaa2VxR0dldHo0Zi8xcS9FdjV2KytXLyszM2tzU2t0Y3k1Q1JsTkZrMVlPcnBILzE1ZS96ZmlTa3N2KzNUNTkzUEJ4RW1laldpQ3pVVUNFVkluZmRsS1ZKTEYvbjJtOWpkZFR5ZWJkZ1BNWFhkQ2FtQnoxNzByMTQxcWtyVTUwdmVCQ0lhVzMyaGxpT3NNeklvMmdtdFcrRFYxVTJ6eitYWFg5ZWZSNXRyWExOdjlUTG1aL3FibzdBNlgzZ25OWG81cXVlL0kvZGJOUDJmTXpXYmV3NXhBeWQxTUtlcDc1WHNmOVhldmVuN1IvVXNhN2grWHh2UjdrbU9neHNWSlBrTjEvMy9RNEhmNFBSbG8rTnViZnNlMlF6ZkJ0SGsyblVjcFJ2K1pHQUZSN3RkRTBTMG9OQ1ZKZEtPMlRxc3E0U2ZsTTcwdTY4cVlEZjM3bElUbjcvRkk1dTlTNXY2VjAyb0E1RnlNdll6b05INDBlZi91MWZpSDBoRDQxM0pENjRjaEVDM0lWek1USnJmeFgrMXg0Ly9IVitQdlg0MWZsci9ydCtYditWQnFtYisxc3A4N0RTYkxOK1VKUlYyNC8xeCszZ1VwT3h3U25ZUGN4QmtwOG9wZFhRSVJ4V3VkOHZPaXA1RGNkcU0xRXpVSlVVVGRBUFc2MnFwWmEyQW5HMXczVWlXN0xwdjdSREIwRXFzMnhFUWdvakVzU1l1M1pYRnlZWTFSMlJUYmZIN2RkZjE1dExsMk92MS9XYzZsUDVSejdGZEJxV3JWUForeWE2ZjdmVmtTbUhUeFZLR3R5Y3p6RzYzNXpTcDI4cTdNSTkyb3I5WTh2K2orYVMvM05KZlV1RGh2UnZWSlBNT3ZiVDQzL1IxNlQrcitwczEzYkR0VWJDM3B3VFNkUjM4MmdONkJ0OVlBcUhKOTllb3l1aGRrNGY3VnEvRTNwU0h3eTNKRDY0Y2hFQzNJbHpNVFpqelkrQytYRnZvM1BXejh2M2cxL3ZyVitOdnlOLzI2L0xjZlNCN0FoY0R0VlRsWlN2Zi9XVHZCSFgzbUwzaGpBUUNnWHdaQWxldXJseEdkeHJFQUFRQUEzaklEb003MTFYWkVwL0Z2dU5NQUFBQnZsd0dRRWpLdVMreFR4M1ZSTDdwbzhkdGJGU3FCdlE1WFM3b2ljY2JibVpIK1JtT1VaelB4OGdtTFUycDgrWmFFQmpUTWtFMEtzVGo1emZJYU9tNUtIWHo2ZmdNU0VoZ3ByOW5yR0xhczJNdWlzbmljNTNDcnNKYWV6QllBZ05QckFSaHJzT0Zka3pyN2lRWktnVzJINnlXcjNHSXUrU3pLVXY2aVljYjhYY21XMStUQVVVazB6SmFGRk5XZG1YSWVrYWcxYTYvRHMrTFQ5eGs3NXZOSlNVVXBtZWtTc3dVQTRIUVpBSnFkUGx0WEJ5azFzOVBTN0tCZjQyNVExblJibEtOeWRhSXFVcUtadDRNMU5mT1BwQlR2bmxVSnBCTENCMVhDRUVWMWIrWmNUa1RVbXJYWDRiS1lYcnQvbkdjeHJmWDJ6QllBZ05ObEFLak01RUtkRXBKSkp5NzJvQmhZTmJSbjhtaWcvcFZUaXJwWGRMYkRUTm4wUTFKL3I2cDVhNkpTbGhNSXVpTTY1MWxweUtLejdlWml3Nm9JRnlsNjNPTllFWTMyQ1NuSG1wYnYwK3V6V0RUcHpHdk1GZ0NBMDJVQXFBYjJrMkJFRzU1dWptdDlIRkVuTDlmL2RxM294MFYzTzh4VXJ6cGlzcDJxbTc5cm12bVJSUENpTkU3SmRhTkxmZTRYUlFxMVRoZkJkZG0zZWh5UkZyeGUrL0V4bnNXS2E3UXpXd0FBVHBjQk1HT05MYlpyTnJ4SVkzKzNEeU9uSXVnYjdJWTFHNGxhUktad3hiam9aMnNyelFPNXhrR21PMkNTU0gwcVhhcTBMZXAwcGkxcUUyWEVxRFBiZnN1eDI4QUFlQ0xOV2RxTXNFa0xzd1VBNFBSNkFMUTk2WDRMQTZCZkk5ZlVaeVpvSWJzcmZadlhwS25Jck9RUXFNeHgycHdQcExmMFJ0bE02TG4xbmQ2UVJoaWJZbXlzQloyeElnUGdaVVhyMkZ1WnpteTlqS1lHd0Y3TGdRRUFBUEF6TUFDOFM5M1JSdmVEOVlMV0VNQ0lkQlZiT2tiOE9ockwwZzUxWEhvcVJ5MWtONlIzK2JOeXMxNEtHci80YjFPdlFlcXFwVzFNRDBxRElMVVlUUjZEOUJuZWZhMFhBMEJ6QUpia3U3UWR5OUo1TEdkY3JQYzRNQUFBQUU2NUFlRE5nQ0lEUUUrODNvNzJRUi9IZmVtQ05XSmxkbFZHd0Y1NUl2YTJuUnJlMkFqYzhnK2tIL1ZUYVMrY0RBc05ENnhiNjlLVUhkOUxDRUFyRytiTGEvWXk1aVZiUDkwdmJmc2FkZGRyT2xKeVpUTDhCcGt0QUFDbjB3RHdFMnpPNVQwc2lYWEgyV0NXTXExZmRZTzlFWFFkaTR5QWJYSGRhOGhDd3h1NW50MXpZZ2dzUzZMaFp1a0szNVNrdUs3TStCNlRBSytYZjUrMENXWjZITlBsODlPdVlVTWk3VHlYS1oxc011YXNmL1lBc3dVQTRIUVpBTkVKOWtWRmtwbm5BS3ozY2F3R1pXM25HeGdCdWFxRmlYTGpmVkRSczN0SzJwamVGME5BUXhOTDhqZmVpNzZYTXNBcjByb3loVlY2SGJkRnNlK1N0WDJkT3Nad2dhVnZtUzBBQUtmTEFOQk0rWlEwOXNMYzExVUd3RllQU1diUnlMbkx2Nm94QXFwMEMwWXlQYXUxWjdlcURLWlRzNGMyNWswWVIzdlJ0eFlDNHEwREFJQzN3UUR3cExGblpleTdMb0h0cC9JQW5LMHdBcVpybEF0dldOdmdxR2Yzb09uK1Q1YlhWYm5kNlVBYU4vV2lieTBGekZzSEFBQnZnd0VRbmVoVFREM2FrSC9xSElEL3JqQUNSaHIwTGhnTW12U2tPUHhBdVpHbkhnYzNNdzE2aHN2UHV5Ri9jN1Q1ZjhrYkJBQUFmNmtHd0loa3l5OWJQRjNWNE1ha0ErQjRINUxNY21PMlBJWGZSbjRXQUFEZzVBeUEyOWFZUnVQcEQ2UXNiN2c4VFd1M3VjbGpKcHBGWTF6Yzk5L3hoQUFBQUU3R0FORFd0RkhyMnlrcE02TWpIQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFEQTI4UC9BZllJdTBkYnBSZUVBQUFBQUVsRlRrU3VRbUNDYDtcclxuICByZXR1cm4gaW1hZ2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbnQoKXtcclxuICByZXR1cm4gYGluZm8gZmFjZT1cIkx1Y2lkYSBTYW5zIFVuaWNvZGVcIiBzaXplPTMyIGJvbGQ9MCBpdGFsaWM9MCBjaGFyc2V0PVwiXCIgdW5pY29kZT0wIHN0cmV0Y2hIPTEwMCBzbW9vdGg9MSBhYT0xIHBhZGRpbmc9NCw0LDQsNCBzcGFjaW5nPS04LC04XHJcbmNvbW1vbiBsaW5lSGVpZ2h0PTUxIGJhc2U9MzYgc2NhbGVXPTUxMiBzY2FsZUg9MjU2IHBhZ2VzPTEgcGFja2VkPTBcclxucGFnZSBpZD0wIGZpbGU9XCJsdWNpZGFzYW5zdW5pY29kZS5wbmdcIlxyXG5jaGFycyBjb3VudD05N1xyXG5jaGFyIGlkPTAgICAgICAgeD0wICAgIHk9MTAzICB3aWR0aD0yNiAgIGhlaWdodD0yOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTExICAgeGFkdmFuY2U9MjQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTAgICAgICB4PTAgICAgeT0wICAgIHdpZHRoPTAgICAgaGVpZ2h0PTAgICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MCAgICB4YWR2YW5jZT0wICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zMiAgICAgIHg9MCAgICB5PTAgICAgd2lkdGg9MCAgICBoZWlnaHQ9MCAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0wICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTMzICAgICAgeD0zMTAgIHk9NzEgICB3aWR0aD0xMiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzQgICAgICB4PTQ5MyAgeT0xMDMgIHdpZHRoPTE3ICAgaGVpZ2h0PTE3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NiAgICB4YWR2YW5jZT0xMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zNSAgICAgIHg9MzQzICB5PTcxICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTM2ICAgICAgeD0yMTQgIHk9MCAgICB3aWR0aD0yMiAgIGhlaWdodD0zNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzcgICAgICB4PTM2MiAgeT0wICAgIHdpZHRoPTMwICAgaGVpZ2h0PTM0ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NyAgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zOCAgICAgIHg9MzcxICB5PTcxICAgd2lkdGg9MjkgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTM5ICAgICAgeD0wICAgIHk9MTMyICB3aWR0aD0xMiAgIGhlaWdodD0xNyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9NyAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDAgICAgICB4PTYxICAgeT0wICAgIHdpZHRoPTE2ICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NyAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00MSAgICAgIHg9NzcgICB5PTAgICAgd2lkdGg9MTYgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQyICAgICAgeD00NjAgIHk9MTAzICB3aWR0aD0yMCAgIGhlaWdodD0yMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDMgICAgICB4PTgxICAgeT0xMDMgIHdpZHRoPTI3ICAgaGVpZ2h0PTI3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTMgICB4YWR2YW5jZT0yNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00NCAgICAgIHg9NDgwICB5PTEwMyAgd2lkdGg9MTMgICBoZWlnaHQ9MTggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yNyAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQ1ICAgICAgeD05MyAgIHk9MTMyICB3aWR0aD0yMyAgIGhlaWdodD0xMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIxICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDYgICAgICB4PTgwICAgeT0xMzIgIHdpZHRoPTEzICAgaGVpZ2h0PTEzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MjcgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00NyAgICAgIHg9MTQ2ICB5PTAgICAgd2lkdGg9MTggICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQ4ICAgICAgeD0yODUgIHk9NzEgICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDkgICAgICB4PTQwMCAgeT03MSAgIHdpZHRoPTE2ICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01MCAgICAgIHg9MTIwICB5PTcxICAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTUxICAgICAgeD0xNDMgIHk9NzEgICB3aWR0aD0yMiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTIgICAgICB4PTE2NSAgeT03MSAgIHdpZHRoPTI1ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01MyAgICAgIHg9MTkwICB5PTcxICAgd2lkdGg9MjIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTU0ICAgICAgeD00MTYgIHk9NzEgICB3aWR0aD0yNSAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTUgICAgICB4PTIxMiAgeT03MSAgIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01NiAgICAgIHg9MjM2ICB5PTcxICAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTU3ICAgICAgeD0yNjAgIHk9NzEgICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTggICAgICB4PTM5OCAgeT0xMDMgIHdpZHRoPTEyICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01OSAgICAgIHg9NDQxICB5PTcxICAgd2lkdGg9MTIgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTYwICAgICAgeD0yNiAgIHk9MTAzICB3aWR0aD0yOCAgIGhlaWdodD0yNyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEzICAgeGFkdmFuY2U9MjUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjEgICAgICB4PTEyICAgeT0xMzIgIHdpZHRoPTI4ICAgaGVpZ2h0PTE2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTggICB4YWR2YW5jZT0yNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02MiAgICAgIHg9NTQgICB5PTEwMyAgd2lkdGg9MjcgICBoZWlnaHQ9MjcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMyAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTYzICAgICAgeD0zMjIgIHk9NzEgICB3aWR0aD0yMSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjQgICAgICB4PTQ1MyAgeT03MSAgIHdpZHRoPTM0ICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT0yNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02NSAgICAgIHg9MzkyICB5PTAgICAgd2lkdGg9MjkgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTY2ICAgICAgeD00MjEgIHk9MCAgICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjcgICAgICB4PTQ0NCAgeT0wICAgIHdpZHRoPTI4ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02OCAgICAgIHg9NDcyICB5PTAgICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI0ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTY5ICAgICAgeD0wICAgIHk9MzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzAgICAgICB4PTIzICAgeT0zOSAgIHdpZHRoPTIyICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03MSAgICAgIHg9NDUgICB5PTM5ICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTcyICAgICAgeD03MyAgIHk9MzkgICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzMgICAgICB4PTEwMCAgeT0zOSAgIHdpZHRoPTEyICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT05ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03NCAgICAgIHg9MTI1ICB5PTAgICAgd2lkdGg9MjEgICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTc1ICAgICAgeD0xMTIgIHk9MzkgICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzYgICAgICB4PTEzNyAgeT0zOSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03NyAgICAgIHg9MTYwICB5PTM5ICAgd2lkdGg9MzEgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTc4ICAgICAgeD0xOTEgIHk9MzkgICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzkgICAgICB4PTIxOCAgeT0zOSAgIHdpZHRoPTMxICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04MCAgICAgIHg9MjQ5ICB5PTM5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTgxICAgICAgeD0xODIgIHk9MCAgICB3aWR0aD0zMiAgIGhlaWdodD0zNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODIgICAgICB4PTI3MiAgeT0zOSAgIHdpZHRoPTI1ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04MyAgICAgIHg9Mjk3ICB5PTM5ICAgd2lkdGg9MjIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTg0ICAgICAgeD0zMTkgIHk9MzkgICB3aWR0aD0yOCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODUgICAgICB4PTM0NyAgeT0zOSAgIHdpZHRoPTI2ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04NiAgICAgIHg9MzczICB5PTM5ICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTg3ICAgICAgeD00MDEgIHk9MzkgICB3aWR0aD0zNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODggICAgICB4PTQzNiAgeT0zOSAgIHdpZHRoPTI3ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04OSAgICAgIHg9NDYzICB5PTM5ICAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTkwICAgICAgeD0wICAgIHk9NzEgICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTEgICAgICB4PTAgICAgeT0wICAgIHdpZHRoPTE1ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NiAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05MiAgICAgIHg9MTY0ICB5PTAgICAgd2lkdGg9MTggICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTkzICAgICAgeD0xNSAgIHk9MCAgICB3aWR0aD0xNSAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTQgICAgICB4PTQzNSAgeT0xMDMgIHdpZHRoPTI1ICAgaGVpZ2h0PTI1ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05NSAgICAgIHg9MTE2ICB5PTEzMiAgd2lkdGg9MjMgICBoZWlnaHQ9MTEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zMSAgIHhhZHZhbmNlPTE2ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTk2ICAgICAgeD00MCAgIHk9MTMyICB3aWR0aD0xNSAgIGhlaWdodD0xNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTcgICAgICB4PTEwOCAgeT0xMDMgIHdpZHRoPTI0ICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05OCAgICAgIHg9MjM2ICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTk5ICAgICAgeD0xMzIgIHk9MTAzICB3aWR0aD0yMiAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MTYgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTAwICAgICB4PTI1OSAgeT0wICAgIHdpZHRoPTI0ICAgaGVpZ2h0PTM0ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDEgICAgIHg9MTU0ICB5PTEwMyAgd2lkdGg9MjMgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwMiAgICAgeD0yODMgIHk9MCAgICB3aWR0aD0yMSAgIGhlaWdodD0zNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MTIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTAzICAgICB4PTI1ICAgeT03MSAgIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDQgICAgIHg9MzA0ICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwNSAgICAgeD00OTAgIHk9MzkgICB3aWR0aD0xMiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9OSAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTA2ICAgICB4PTQxICAgeT0wICAgIHdpZHRoPTIwICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDcgICAgIHg9MzI3ICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwOCAgICAgeD0zNTAgIHk9MCAgICB3aWR0aD0xMiAgIGhlaWdodD0zNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9OSAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTA5ICAgICB4PTE3NyAgeT0xMDMgIHdpZHRoPTMyICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0zMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTAgICAgIHg9MjA5ICB5PTEwMyAgd2lkdGg9MjMgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExMSAgICAgeD00MTAgIHk9MTAzICB3aWR0aD0yNSAgIGhlaWdodD0yNSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE1ICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTEyICAgICB4PTQ5ICAgeT03MSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTMgICAgIHg9NzIgICB5PTcxICAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExNCAgICAgeD0yMzIgIHk9MTAzICB3aWR0aD0xOCAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MTMgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTE1ICAgICB4PTI1MCAgeT0xMDMgIHdpZHRoPTIwICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xNiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTYgICAgIHg9NDg3ICB5PTcxICAgd2lkdGg9MjAgICBoZWlnaHQ9MjggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMiAgIHhhZHZhbmNlPTEyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExNyAgICAgeD0yNzAgIHk9MTAzICB3aWR0aD0yMyAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTE4ICAgICB4PTI5MyAgeT0xMDMgIHdpZHRoPTI0ICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTkgICAgIHg9MzE3ICB5PTEwMyAgd2lkdGg9MzIgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyMCAgICAgeD0zNDkgIHk9MTAzICB3aWR0aD0yNSAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTIxICAgICB4PTk2ICAgeT03MSAgIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjIgICAgIHg9Mzc0ICB5PTEwMyAgd2lkdGg9MjQgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyMyAgICAgeD05MyAgIHk9MCAgICB3aWR0aD0xNiAgIGhlaWdodD0zOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTcgICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTI0ICAgICB4PTMwICAgeT0wICAgIHdpZHRoPTExICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NiAgICB4YWR2YW5jZT0xMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjUgICAgIHg9MTA5ICB5PTAgICAgd2lkdGg9MTYgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyNiAgICAgeD01NSAgIHk9MTMyICB3aWR0aD0yNSAgIGhlaWdodD0xNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIwICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmtlcm5pbmdzIGNvdW50PTBcclxuYDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ID0ge30gKXtcclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggcGFuZWwgKTtcclxuXHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZWQnLCBoYW5kbGVPblJlbGVhc2UgKTtcclxuXHJcbiAgY29uc3QgdGVtcE1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XHJcblxyXG4gIGxldCBvbGRQYXJlbnQ7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHtpbnB1dE9iamVjdH09e30gKXtcclxuXHJcbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRlbXBNYXRyaXguZ2V0SW52ZXJzZSggaW5wdXRPYmplY3QubWF0cml4V29ybGQgKTtcclxuXHJcbiAgICBmb2xkZXIubWF0cml4LnByZW11bHRpcGx5KCB0ZW1wTWF0cml4ICk7XHJcbiAgICBmb2xkZXIubWF0cml4LmRlY29tcG9zZSggZm9sZGVyLnBvc2l0aW9uLCBmb2xkZXIucXVhdGVybmlvbiwgZm9sZGVyLnNjYWxlICk7XHJcblxyXG4gICAgb2xkUGFyZW50ID0gZm9sZGVyLnBhcmVudDtcclxuICAgIGlucHV0T2JqZWN0LmFkZCggZm9sZGVyICk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25SZWxlYXNlKCB7aW5wdXRPYmplY3R9PXt9ICl7XHJcbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYoIG9sZFBhcmVudCA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGZvbGRlci5tYXRyaXgucHJlbXVsdGlwbHkoIGlucHV0T2JqZWN0Lm1hdHJpeFdvcmxkICk7XHJcbiAgICBmb2xkZXIubWF0cml4LmRlY29tcG9zZSggZm9sZGVyLnBvc2l0aW9uLCBmb2xkZXIucXVhdGVybmlvbiwgZm9sZGVyLnNjYWxlICk7XHJcbiAgICBvbGRQYXJlbnQuYWRkKCBmb2xkZXIgKTtcclxuICAgIG9sZFBhcmVudCA9IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIHJldHVybiBpbnRlcmFjdGlvbjtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xyXG5pbXBvcnQgY3JlYXRlU2xpZGVyIGZyb20gJy4vc2xpZGVyJztcclxuaW1wb3J0IGNyZWF0ZUNoZWNrYm94IGZyb20gJy4vY2hlY2tib3gnO1xyXG5pbXBvcnQgY3JlYXRlQnV0dG9uIGZyb20gJy4vYnV0dG9uJztcclxuaW1wb3J0IGNyZWF0ZUZvbGRlciBmcm9tICcuL2ZvbGRlcic7XHJcbmltcG9ydCBjcmVhdGVEcm9wZG93biBmcm9tICcuL2Ryb3Bkb3duJztcclxuaW1wb3J0ICogYXMgU0RGVGV4dCBmcm9tICcuL3NkZnRleHQnO1xyXG5pbXBvcnQgKiBhcyBGb250IGZyb20gJy4vZm9udCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEQVRHVUlWUigpe1xyXG5cclxuICAvKlxyXG4gICAgU0RGIGZvbnRcclxuICAqL1xyXG4gIGNvbnN0IHRleHRDcmVhdG9yID0gU0RGVGV4dC5jcmVhdG9yKCk7XHJcblxyXG5cclxuICAvKlxyXG4gICAgTGlzdHMuXHJcbiAgICBJbnB1dE9iamVjdHMgYXJlIHRoaW5ncyBsaWtlIFZJVkUgY29udHJvbGxlcnMsIGNhcmRib2FyZCBoZWFkc2V0cywgZXRjLlxyXG4gICAgQ29udHJvbGxlcnMgYXJlIHRoZSBEQVQgR1VJIHNsaWRlcnMsIGNoZWNrYm94ZXMsIGV0Yy5cclxuICAgIEhpdHNjYW5PYmplY3RzIGFyZSBhbnl0aGluZyByYXljYXN0cyB3aWxsIGhpdC10ZXN0IGFnYWluc3QuXHJcbiAgKi9cclxuICBjb25zdCBpbnB1dE9iamVjdHMgPSBbXTtcclxuICBjb25zdCBjb250cm9sbGVycyA9IFtdO1xyXG4gIGNvbnN0IGhpdHNjYW5PYmplY3RzID0gW107XHJcblxyXG4gIGxldCBtb3VzZUVuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgZnVuY3Rpb24gc2V0TW91c2VFbmFibGVkKCBmbGFnICl7XHJcbiAgICBtb3VzZUVuYWJsZWQgPSBmbGFnO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIFRoZSBkZWZhdWx0IGxhc2VyIHBvaW50ZXIgY29taW5nIG91dCBvZiBlYWNoIElucHV0T2JqZWN0LlxyXG4gICovXHJcbiAgY29uc3QgbGFzZXJNYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7Y29sb3I6MHg1NWFhZmYsIHRyYW5zcGFyZW50OiB0cnVlLCBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyB9KTtcclxuICBmdW5jdGlvbiBjcmVhdGVMYXNlcigpe1xyXG4gICAgY29uc3QgZyA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG4gICAgZy52ZXJ0aWNlcy5wdXNoKCBuZXcgVEhSRUUuVmVjdG9yMygpICk7XHJcbiAgICBnLnZlcnRpY2VzLnB1c2goIG5ldyBUSFJFRS5WZWN0b3IzKDAsMCwwKSApO1xyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5MaW5lKCBnLCBsYXNlck1hdGVyaWFsICk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIEEgXCJjdXJzb3JcIiwgZWcgdGhlIGJhbGwgdGhhdCBhcHBlYXJzIGF0IHRoZSBlbmQgb2YgeW91ciBsYXNlci5cclxuICAqL1xyXG4gIGNvbnN0IGN1cnNvck1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjoweDQ0NDQ0NCwgdHJhbnNwYXJlbnQ6IHRydWUsIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nIH0gKTtcclxuICBmdW5jdGlvbiBjcmVhdGVDdXJzb3IoKXtcclxuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDAuMDA2LCA0LCA0ICksIGN1cnNvck1hdGVyaWFsICk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgQ3JlYXRlcyBhIGdlbmVyaWMgSW5wdXQgdHlwZS5cclxuICAgIFRha2VzIGFueSBUSFJFRS5PYmplY3QzRCB0eXBlIG9iamVjdCBhbmQgdXNlcyBpdHMgcG9zaXRpb25cclxuICAgIGFuZCBvcmllbnRhdGlvbiBhcyBhbiBpbnB1dCBkZXZpY2UuXHJcblxyXG4gICAgQSBsYXNlciBwb2ludGVyIGlzIGluY2x1ZGVkIGFuZCB3aWxsIGJlIHVwZGF0ZWQuXHJcbiAgICBDb250YWlucyBzdGF0ZSBhYm91dCB3aGljaCBJbnRlcmFjdGlvbiBpcyBjdXJyZW50bHkgYmVpbmcgdXNlZCBvciBob3Zlci5cclxuICAqL1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUlucHV0KCBpbnB1dE9iamVjdCA9IG5ldyBUSFJFRS5Hcm91cCgpICl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByYXljYXN0OiBuZXcgVEhSRUUuUmF5Y2FzdGVyKCBuZXcgVEhSRUUuVmVjdG9yMygpLCBuZXcgVEhSRUUuVmVjdG9yMygpICksXHJcbiAgICAgIGxhc2VyOiBjcmVhdGVMYXNlcigpLFxyXG4gICAgICBjdXJzb3I6IGNyZWF0ZUN1cnNvcigpLFxyXG4gICAgICBvYmplY3Q6IGlucHV0T2JqZWN0LFxyXG4gICAgICBwcmVzc2VkOiBmYWxzZSxcclxuICAgICAgZ3JpcHBlZDogZmFsc2UsXHJcbiAgICAgIGV2ZW50czogbmV3IEVtaXR0ZXIoKSxcclxuICAgICAgaW50ZXJhY3Rpb246IHsgICAgICAgIFxyXG4gICAgICAgIGdyaXA6IHVuZGVmaW5lZCwgICAgICAgIFxyXG4gICAgICAgIHByZXNzOiB1bmRlZmluZWRcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgTW91c2VJbnB1dCBpcyBhIHNwZWNpYWwgaW5wdXQgdHlwZSB0aGF0IGlzIG9uIGJ5IGRlZmF1bHQuXHJcbiAgICBBbGxvd3MgeW91IHRvIGNsaWNrIG9uIHRoZSBzY3JlZW4gd2hlbiBub3QgaW4gVlIgZm9yIGRlYnVnZ2luZy5cclxuICAqL1xyXG4gIGNvbnN0IG1vdXNlSW5wdXQgPSBjcmVhdGVNb3VzZUlucHV0KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZU1vdXNlSW5wdXQoKXtcclxuICAgIGNvbnN0IG1vdXNlID0gbmV3IFRIUkVFLlZlY3RvcjIoLTEsLTEpO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgZnVuY3Rpb24oIGV2ZW50ICl7XHJcbiAgICAgIG1vdXNlLnggPSAoIGV2ZW50LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCApICogMiAtIDE7XHJcbiAgICAgIG1vdXNlLnkgPSAtICggZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCApICogMiArIDE7XHJcbiAgICB9LCBmYWxzZSApO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgZnVuY3Rpb24oIGV2ZW50ICl7XHJcbiAgICAgIGlucHV0LnByZXNzZWQgPSB0cnVlOyAgICAgIFxyXG4gICAgfSwgZmFsc2UgKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBmdW5jdGlvbiggZXZlbnQgKXtcclxuICAgICAgaW5wdXQucHJlc3NlZCA9IGZhbHNlOyAgICAgIFxyXG4gICAgfSwgZmFsc2UgKTtcclxuXHJcbiAgICBjb25zdCBpbnB1dCA9IGNyZWF0ZUlucHV0KCk7XHJcbiAgICBpbnB1dC5tb3VzZSA9IG1vdXNlO1xyXG4gICAgcmV0dXJuIGlucHV0O1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBQdWJsaWMgZnVuY3Rpb24gdXNlcnMgcnVuIHRvIGdpdmUgREFUIEdVSSBhbiBpbnB1dCBkZXZpY2UuXHJcbiAgICBBdXRvbWF0aWNhbGx5IGRldGVjdHMgZm9yIFZpdmVDb250cm9sbGVyIGFuZCBiaW5kcyBidXR0b25zICsgaGFwdGljIGZlZWRiYWNrLlxyXG5cclxuICAgIFJldHVybnMgYSBsYXNlciBwb2ludGVyIHNvIGl0IGNhbiBiZSBkaXJlY3RseSBhZGRlZCB0byBzY2VuZS5cclxuXHJcbiAgICBUaGUgbGFzZXIgd2lsbCB0aGVuIGhhdmUgdHdvIG1ldGhvZHM6XHJcbiAgICBsYXNlci5wcmVzc2VkKCksIGxhc2VyLmdyaXBwZWQoKVxyXG5cclxuICAgIFRoZXNlIGNhbiB0aGVuIGJlIGJvdW5kIHRvIGFueSBidXR0b24gdGhlIHVzZXIgd2FudHMuIFVzZWZ1bCBmb3IgYmluZGluZyB0b1xyXG4gICAgY2FyZGJvYXJkIG9yIGFsdGVybmF0ZSBpbnB1dCBkZXZpY2VzLlxyXG5cclxuICAgIEZvciBleGFtcGxlLi4uXHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBmdW5jdGlvbigpeyBsYXNlci5wcmVzc2VkKCB0cnVlICk7IH0gKTtcclxuICAqL1xyXG4gIGZ1bmN0aW9uIGFkZElucHV0T2JqZWN0KCBvYmplY3QgKXtcclxuICAgIGNvbnN0IGlucHV0ID0gY3JlYXRlSW5wdXQoIG9iamVjdCApO1xyXG5cclxuICAgIGlucHV0Lmxhc2VyLmFkZCggaW5wdXQuY3Vyc29yICk7XHJcblxyXG4gICAgaW5wdXQubGFzZXIucHJlc3NlZCA9IGZ1bmN0aW9uKCBmbGFnICl7XHJcbiAgICAgIGlucHV0LnByZXNzZWQgPSBmbGFnO1xyXG4gICAgfTtcclxuXHJcbiAgICBpbnB1dC5sYXNlci5ncmlwcGVkID0gZnVuY3Rpb24oIGZsYWcgKXtcclxuICAgICAgaW5wdXQuZ3JpcHBlZCA9IGZsYWc7XHJcbiAgICB9O1xyXG5cclxuICAgIGlucHV0Lmxhc2VyLmN1cnNvciA9IGlucHV0LmN1cnNvcjtcclxuXHJcbiAgICBpZiggVEhSRUUuVml2ZUNvbnRyb2xsZXIgJiYgb2JqZWN0IGluc3RhbmNlb2YgVEhSRUUuVml2ZUNvbnRyb2xsZXIgKXtcclxuICAgICAgYmluZFZpdmVDb250cm9sbGVyKCBpbnB1dCwgb2JqZWN0LCBpbnB1dC5sYXNlci5wcmVzc2VkLCBpbnB1dC5sYXNlci5ncmlwcGVkICk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5wdXRPYmplY3RzLnB1c2goIGlucHV0ICk7XHJcblxyXG4gICAgcmV0dXJuIGlucHV0Lmxhc2VyO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIEhlcmUgYXJlIHRoZSBtYWluIGRhdCBndWkgY29udHJvbGxlciB0eXBlcy5cclxuICAqL1xyXG5cclxuICBmdW5jdGlvbiBhZGRTbGlkZXIoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBtaW4gPSAwLjAsIG1heCA9IDEwMC4wICl7XHJcbiAgICBjb25zdCBzbGlkZXIgPSBjcmVhdGVTbGlkZXIoIHtcclxuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LCBtaW4sIG1heCxcclxuICAgICAgaW5pdGlhbFZhbHVlOiBvYmplY3RbIHByb3BlcnR5TmFtZSBdXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBzbGlkZXIgKTtcclxuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLnNsaWRlci5oaXRzY2FuIClcclxuXHJcbiAgICByZXR1cm4gc2xpZGVyO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkQ2hlY2tib3goIG9iamVjdCwgcHJvcGVydHlOYW1lICl7XHJcbiAgICBjb25zdCBjaGVja2JveCA9IGNyZWF0ZUNoZWNrYm94KHtcclxuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LFxyXG4gICAgICBpbml0aWFsVmFsdWU6IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGNoZWNrYm94ICk7XHJcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5jaGVja2JveC5oaXRzY2FuIClcclxuXHJcbiAgICByZXR1cm4gY2hlY2tib3g7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRCdXR0b24oIG9iamVjdCwgcHJvcGVydHlOYW1lICl7XHJcbiAgICBjb25zdCBidXR0b24gPSBjcmVhdGVCdXR0b24oe1xyXG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3RcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGJ1dHRvbiApO1xyXG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uYnV0dG9uLmhpdHNjYW4gKTtcclxuICAgIHJldHVybiBidXR0b247XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGREcm9wZG93biggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG9wdGlvbnMgKXtcclxuICAgIGNvbnN0IGRyb3Bkb3duID0gY3JlYXRlRHJvcGRvd24oe1xyXG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsIG9wdGlvbnNcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGRyb3Bkb3duICk7XHJcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5kcm9wZG93bi5oaXRzY2FuICk7XHJcbiAgICByZXR1cm4gZHJvcGRvd247XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIEFuIGltcGxpY2l0IEFkZCBmdW5jdGlvbiB3aGljaCBkZXRlY3RzIGZvciBwcm9wZXJ0eSB0eXBlXHJcbiAgICBhbmQgZ2l2ZXMgeW91IHRoZSBjb3JyZWN0IGNvbnRyb2xsZXIuXHJcblxyXG4gICAgRHJvcGRvd246XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG9iamVjdFR5cGUgKVxyXG5cclxuICAgIFNsaWRlcjpcclxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZOdW1iZXJUeXBlLCBtaW4sIG1heCApXHJcblxyXG4gICAgQ2hlY2tib3g6XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU9mQm9vbGVhblR5cGUgKVxyXG5cclxuICAgIEJ1dHRvbjpcclxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZGdW5jdGlvblR5cGUgKVxyXG4gICovXHJcblxyXG4gIGZ1bmN0aW9uIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMsIGFyZzQgKXtcclxuXHJcbiAgICBpZiggb2JqZWN0ID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgY29uc29sZS53YXJuKCAnb2JqZWN0IGlzIHVuZGVmaW5lZCcgKTtcclxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAgaWYoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICBjb25zb2xlLndhcm4oICdubyBwcm9wZXJ0eSBuYW1lZCcsIHByb3BlcnR5TmFtZSwgJ29uIG9iamVjdCcsIG9iamVjdCApO1xyXG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlzT2JqZWN0KCBhcmczICkgfHwgaXNBcnJheSggYXJnMyApICl7XHJcbiAgICAgIHJldHVybiBhZGREcm9wZG93biggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaXNOdW1iZXIoIG9iamVjdFsgcHJvcGVydHlOYW1lXSApICl7XHJcbiAgICAgIHJldHVybiBhZGRTbGlkZXIoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBhcmczLCBhcmc0ICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlzQm9vbGVhbiggb2JqZWN0WyBwcm9wZXJ0eU5hbWVdICkgKXtcclxuICAgICAgcmV0dXJuIGFkZENoZWNrYm94KCBvYmplY3QsIHByb3BlcnR5TmFtZSApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc0Z1bmN0aW9uKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICkgKXtcclxuICAgICAgcmV0dXJuIGFkZEJ1dHRvbiggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgYWRkIGNvdWxkbid0IGZpZ3VyZSBpdCBvdXQsIHNvIGF0IGxlYXN0IGFkZCBzb21ldGhpbmcgVEhSRUUgdW5kZXJzdGFuZHNcclxuICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBDcmVhdGVzIGEgZm9sZGVyIHdpdGggdGhlIG5hbWUuXHJcblxyXG4gICAgRm9sZGVycyBhcmUgVEhSRUUuR3JvdXAgdHlwZSBvYmplY3RzIGFuZCBjYW4gZG8gZ3JvdXAuYWRkKCkgZm9yIHNpYmxpbmdzLlxyXG4gICAgRm9sZGVycyB3aWxsIGF1dG9tYXRpY2FsbHkgYXR0ZW1wdCB0byBsYXkgaXRzIGNoaWxkcmVuIG91dCBpbiBzZXF1ZW5jZS5cclxuICAqL1xyXG5cclxuICBmdW5jdGlvbiBhZGRGb2xkZXIoIG5hbWUgKXtcclxuICAgIGNvbnN0IGZvbGRlciA9IGNyZWF0ZUZvbGRlcih7XHJcbiAgICAgIHRleHRDcmVhdG9yLFxyXG4gICAgICBuYW1lXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBmb2xkZXIgKTtcclxuICAgIGlmKCBmb2xkZXIuaGl0c2NhbiApe1xyXG4gICAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5mb2xkZXIuaGl0c2NhbiApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmb2xkZXI7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIFBlcmZvcm0gdGhlIG5lY2Vzc2FyeSB1cGRhdGVzLCByYXljYXN0cyBvbiBpdHMgb3duIFJBRi5cclxuICAqL1xyXG5cclxuICBjb25zdCB0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gIGNvbnN0IHREaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyggMCwgMCwgLTEgKTtcclxuICBjb25zdCB0TWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB1cGRhdGUgKTtcclxuXHJcbiAgICBpZiggbW91c2VFbmFibGVkICl7XHJcbiAgICAgIG1vdXNlSW5wdXQuaW50ZXJzZWN0aW9ucyA9IHBlcmZvcm1Nb3VzZUlucHV0KCBoaXRzY2FuT2JqZWN0cywgbW91c2VJbnB1dCApO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0T2JqZWN0cy5mb3JFYWNoKCBmdW5jdGlvbigge2JveCxvYmplY3QscmF5Y2FzdCxsYXNlcixjdXJzb3J9ID0ge30sIGluZGV4ICl7XHJcbiAgICAgIG9iamVjdC51cGRhdGVNYXRyaXhXb3JsZCgpO1xyXG5cclxuICAgICAgdFBvc2l0aW9uLnNldCgwLDAsMCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBvYmplY3QubWF0cml4V29ybGQgKTtcclxuICAgICAgdE1hdHJpeC5pZGVudGl0eSgpLmV4dHJhY3RSb3RhdGlvbiggb2JqZWN0Lm1hdHJpeFdvcmxkICk7XHJcbiAgICAgIHREaXJlY3Rpb24uc2V0KDAsMCwtMSkuYXBwbHlNYXRyaXg0KCB0TWF0cml4ICkubm9ybWFsaXplKCk7XHJcblxyXG4gICAgICByYXljYXN0LnNldCggdFBvc2l0aW9uLCB0RGlyZWN0aW9uICk7XHJcblxyXG4gICAgICBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc1sgMCBdLmNvcHkoIHRQb3NpdGlvbiApO1xyXG5cclxuICAgICAgLy8gIGRlYnVnLi4uXHJcbiAgICAgIC8vIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzWyAxIF0uY29weSggdFBvc2l0aW9uICkuYWRkKCB0RGlyZWN0aW9uLm11bHRpcGx5U2NhbGFyKCAxICkgKTtcclxuXHJcbiAgICAgIGNvbnN0IGludGVyc2VjdGlvbnMgPSByYXljYXN0LmludGVyc2VjdE9iamVjdHMoIGhpdHNjYW5PYmplY3RzLCBmYWxzZSApO1xyXG4gICAgICBwYXJzZUludGVyc2VjdGlvbnMoIGludGVyc2VjdGlvbnMsIGxhc2VyLCBjdXJzb3IgKTtcclxuXHJcbiAgICAgIGlucHV0T2JqZWN0c1sgaW5kZXggXS5pbnRlcnNlY3Rpb25zID0gaW50ZXJzZWN0aW9ucztcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGlucHV0cyA9IGlucHV0T2JqZWN0cy5zbGljZSgpO1xyXG5cclxuICAgIGlmKCBtb3VzZUVuYWJsZWQgKXtcclxuICAgICAgaW5wdXRzLnB1c2goIG1vdXNlSW5wdXQgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb250cm9sbGVycy5mb3JFYWNoKCBmdW5jdGlvbiggY29udHJvbGxlciApe1xyXG4gICAgICBjb250cm9sbGVyLnVwZGF0ZSggaW5wdXRzICk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApe1xyXG4gICAgaWYoIGludGVyc2VjdGlvbnMubGVuZ3RoID4gMCApe1xyXG4gICAgICBjb25zdCBmaXJzdEhpdCA9IGludGVyc2VjdGlvbnNbIDAgXTtcclxuICAgICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDEgXS5jb3B5KCBmaXJzdEhpdC5wb2ludCApO1xyXG4gICAgICBsYXNlci52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgbGFzZXIuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKCk7XHJcbiAgICAgIGxhc2VyLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gICAgICBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlO1xyXG4gICAgICBjdXJzb3IucG9zaXRpb24uY29weSggZmlyc3RIaXQucG9pbnQgKTtcclxuICAgICAgY3Vyc29yLnZpc2libGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbGFzZXIudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICBjdXJzb3IudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGVyZm9ybU1vdXNlSW5wdXQoIGhpdHNjYW5PYmplY3RzLCB7Ym94LG9iamVjdCxyYXljYXN0LGxhc2VyLGN1cnNvcixtb3VzZX0gPSB7fSApe1xyXG4gICAgcmF5Y2FzdC5zZXRGcm9tQ2FtZXJhKCBtb3VzZSwgY2FtZXJhICk7XHJcbiAgICBjb25zdCBpbnRlcnNlY3Rpb25zID0gcmF5Y2FzdC5pbnRlcnNlY3RPYmplY3RzKCBoaXRzY2FuT2JqZWN0cywgZmFsc2UgKTtcclxuICAgIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApO1xyXG4gICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBQdWJsaWMgbWV0aG9kcy5cclxuICAqL1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgYWRkSW5wdXRPYmplY3QsXHJcbiAgICBhZGQsXHJcbiAgICBhZGRGb2xkZXIsXHJcbiAgICBzZXRNb3VzZUVuYWJsZWRcclxuICB9O1xyXG5cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4gIFNldCB0byBnbG9iYWwgc2NvcGUgaWYgZXhwb3J0aW5nIGFzIGEgc3RhbmRhbG9uZS5cclxuKi9cclxuXHJcbmlmKCB3aW5kb3cgKXtcclxuICB3aW5kb3cuREFUR1VJVlIgPSBEQVRHVUlWUjtcclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICBCdW5jaCBvZiBzdGF0ZS1sZXNzIHV0aWxpdHkgZnVuY3Rpb25zLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gaXNOdW1iZXIobikge1xyXG4gIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQm9vbGVhbihuKXtcclxuICByZXR1cm4gdHlwZW9mIG4gPT09ICdib29sZWFuJztcclxufVxyXG5cclxuZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jdGlvblRvQ2hlY2spIHtcclxuICBjb25zdCBnZXRUeXBlID0ge307XHJcbiAgcmV0dXJuIGZ1bmN0aW9uVG9DaGVjayAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwoZnVuY3Rpb25Ub0NoZWNrKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcclxufVxyXG5cclxuLy8gIG9ubHkge30gb2JqZWN0cyBub3QgYXJyYXlzXHJcbi8vICAgICAgICAgICAgICAgICAgICB3aGljaCBhcmUgdGVjaG5pY2FsbHkgb2JqZWN0cyBidXQgeW91J3JlIGp1c3QgYmVpbmcgcGVkYW50aWNcclxuZnVuY3Rpb24gaXNPYmplY3QgKGl0ZW0pIHtcclxuICByZXR1cm4gKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtICE9PSBudWxsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNBcnJheSggbyApe1xyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KCBvICk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAgQ29udHJvbGxlci1zcGVjaWZpYyBzdXBwb3J0LlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gYmluZFZpdmVDb250cm9sbGVyKCBpbnB1dCwgY29udHJvbGxlciwgcHJlc3NlZCwgZ3JpcHBlZCApe1xyXG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyaWdnZXJkb3duJywgKCk9PnByZXNzZWQoIHRydWUgKSApO1xyXG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyaWdnZXJ1cCcsICgpPT5wcmVzc2VkKCBmYWxzZSApICk7XHJcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAnZ3JpcHNkb3duJywgKCk9PmdyaXBwZWQoIHRydWUgKSApO1xyXG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ2dyaXBzdXAnLCAoKT0+Z3JpcHBlZCggZmFsc2UgKSApO1xyXG5cclxuICBjb25zdCBnYW1lcGFkID0gY29udHJvbGxlci5nZXRHYW1lcGFkKCk7XHJcbiAgaW5wdXQuZXZlbnRzLm9uKCAnb25Db250cm9sbGVySGVsZCcsIGZ1bmN0aW9uKCBpbnB1dCApe1xyXG4gICAgaWYoIGlucHV0Lm9iamVjdCA9PT0gY29udHJvbGxlciApe1xyXG4gICAgICBpZiggZ2FtZXBhZCAmJiBnYW1lcGFkLmhhcHRpY3MubGVuZ3RoID4gMCApe1xyXG4gICAgICAgIGdhbWVwYWQuaGFwdGljc1sgMCBdLnZpYnJhdGUoIDAuMywgMC4zICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbiogXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiogXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qIFxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5pbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdFZvbHVtZSApe1xyXG4gIGNvbnN0IGV2ZW50cyA9IG5ldyBFbWl0dGVyKCk7ICBcclxuXHJcbiAgbGV0IGFueUhvdmVyID0gZmFsc2U7XHJcbiAgbGV0IGFueVByZXNzaW5nID0gZmFsc2U7XHJcblxyXG4gIGxldCBob3ZlciA9IGZhbHNlO1xyXG4gIGxldCBhbnlBY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgdFZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7ICBcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlKCBpbnB1dE9iamVjdHMgKXtcclxuXHJcbiAgICBob3ZlciA9IGZhbHNlOyAgICBcclxuICAgIGFueVByZXNzaW5nID0gZmFsc2U7XHJcbiAgICBhbnlBY3RpdmUgPSBmYWxzZTsgICAgXHJcblxyXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCBpbnB1dCApe1xyXG5cclxuICAgICAgY29uc3QgeyBoaXRPYmplY3QsIGhpdFBvaW50IH0gPSBleHRyYWN0SGl0KCBpbnB1dCApO1xyXG5cclxuICAgICAgaG92ZXIgPSBob3ZlciB8fCBoaXRWb2x1bWUgPT09IGhpdE9iamVjdDtcclxuICAgICAgXHJcbiAgICAgIHBlcmZvcm1TdGF0ZUV2ZW50cyh7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaG92ZXIsXHJcbiAgICAgICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcclxuICAgICAgICBidXR0b25OYW1lOiAncHJlc3NlZCcsXHJcbiAgICAgICAgaW50ZXJhY3Rpb25OYW1lOiAncHJlc3MnLFxyXG4gICAgICAgIGRvd25OYW1lOiAnb25QcmVzc2VkJyxcclxuICAgICAgICBob2xkTmFtZTogJ3ByZXNzaW5nJyxcclxuICAgICAgICB1cE5hbWU6ICdvblJlbGVhc2VkJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHBlcmZvcm1TdGF0ZUV2ZW50cyh7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaG92ZXIsXHJcbiAgICAgICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcclxuICAgICAgICBidXR0b25OYW1lOiAnZ3JpcHBlZCcsXHJcbiAgICAgICAgaW50ZXJhY3Rpb25OYW1lOiAnZ3JpcCcsXHJcbiAgICAgICAgZG93bk5hbWU6ICdvbkdyaXBwZWQnLFxyXG4gICAgICAgIGhvbGROYW1lOiAnZ3JpcHBpbmcnLFxyXG4gICAgICAgIHVwTmFtZTogJ29uUmVsZWFzZUdyaXAnXHJcbiAgICAgIH0pOyAgICAgIFxyXG5cclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGV4dHJhY3RIaXQoIGlucHV0ICl7XHJcbiAgICBpZiggaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPD0gMCApeyAgICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGhpdFBvaW50OiB0VmVjdG9yLnNldEZyb21NYXRyaXhQb3NpdGlvbiggaW5wdXQuY3Vyc29yLm1hdHJpeFdvcmxkICkuY2xvbmUoKSxcclxuICAgICAgICBoaXRPYmplY3Q6IGlucHV0LmN1cnNvcixcclxuICAgICAgfTsgICAgICBcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaGl0UG9pbnQ6IGlucHV0LmludGVyc2VjdGlvbnNbIDAgXS5wb2ludCxcclxuICAgICAgICBoaXRPYmplY3Q6IGlucHV0LmludGVyc2VjdGlvbnNbIDAgXS5vYmplY3RcclxuICAgICAgfTtcclxuICAgIH0gICAgICAgIFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGVyZm9ybVN0YXRlRXZlbnRzKHtcclxuICAgIGlucHV0LCBob3ZlciwgXHJcbiAgICBoaXRPYmplY3QsIGhpdFBvaW50LCBcclxuICAgIGJ1dHRvbk5hbWUsIGludGVyYWN0aW9uTmFtZSwgZG93bk5hbWUsIGhvbGROYW1lLCB1cE5hbWVcclxuICB9ID0ge30gKXtcclxuICAgIFxyXG4gICAgLy8gaWYoIGhvdmVyICYmIGlucHV0WyAnZ3JpcHBlZCcgXSAmJiBpbnRlcmFjdGlvbk5hbWUgPT09ICdncmlwJyApe1xyXG4gICAgLy8gICBkZWJ1Z2dlcjtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyAgaG92ZXJpbmcgYW5kIGJ1dHRvbiBkb3duIGJ1dCBubyBpbnRlcmFjdGlvbnMgYWN0aXZlIHlldFxyXG4gICAgaWYoIGhvdmVyICYmIGlucHV0WyBidXR0b25OYW1lIF0gPT09IHRydWUgJiYgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID09PSB1bmRlZmluZWQgKXsgICAgICBcclxuICAgICAgLy8gaWYoIGV2ZW50cy5saXN0ZW5lckNvdW50KCBkb3duTmFtZSApID4gMCApeyAgICAgICAgXHJcbiAgICAgICAgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID0gaW50ZXJhY3Rpb247XHJcbiAgICAgICAgZXZlbnRzLmVtaXQoIGRvd25OYW1lLCB7XHJcbiAgICAgICAgICBoaXRPYmplY3QsXHJcbiAgICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYW55UHJlc3NpbmcgPSB0cnVlO1xyXG4gICAgICAgIGFueUFjdGl2ZSA9IHRydWU7XHJcbiAgICAgIC8vIH1cclxuICAgIH0gICAgXHJcblxyXG4gICAgLy8gIGJ1dHRvbiBzdGlsbCBkb3duIGFuZCB0aGlzIGlzIHRoZSBhY3RpdmUgaW50ZXJhY3Rpb25cclxuICAgIGlmKCBpbnB1dFsgYnV0dG9uTmFtZSBdICYmIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9PT0gaW50ZXJhY3Rpb24gKXtcclxuICAgICAgLy8gaWYoIGV2ZW50cy5saXN0ZW5lckNvdW50KCBob2xkTmFtZSApID4gMCApeyAgICAgICAgXHJcbiAgICAgICAgZXZlbnRzLmVtaXQoIGhvbGROYW1lLCB7XHJcbiAgICAgICAgICBoaXRPYmplY3QsXHJcbiAgICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgICBpbnB1dE9iamV0OiBpbnB1dC5vYmplY3RcclxuICAgICAgICB9KTtcclxuICAgICAgICBhbnlQcmVzc2luZyA9IHRydWU7XHJcbiAgICAgIC8vIH1cclxuICAgICAgLy8gaW5wdXQuZXZlbnRzLmVtaXQoICdvbkNvbnRyb2xsZXJIZWxkJywgaW5wdXQgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgYnV0dG9uIG5vdCBkb3duIGFuZCB0aGlzIGlzIHRoZSBhY3RpdmUgaW50ZXJhY3Rpb25cclxuICAgIGlmKCBpbnB1dFsgYnV0dG9uTmFtZSBdID09PSBmYWxzZSAmJiBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPT09IGludGVyYWN0aW9uICl7XHJcbiAgICAgIC8vIGlmKCBldmVudHMubGlzdGVuZXJDb3VudCggdXBOYW1lICkgPiAwICl7XHJcbiAgICAgICAgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID0gdW5kZWZpbmVkOyAgICAgIFxyXG4gICAgICAgIGV2ZW50cy5lbWl0KCB1cE5hbWUsIHtcclxuICAgICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICAgIHBvaW50OiBoaXRQb2ludCxcclxuICAgICAgICAgIGlucHV0T2JqZWN0OiBpbnB1dC5vYmplY3RcclxuICAgICAgICB9KTtcclxuICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IHtcclxuICAgIGhvdmVyaW5nOiAoKT0+aG92ZXIsXHJcbiAgICBwcmVzc2luZzogKCk9PmFueVByZXNzaW5nLFxyXG4gICAgdXBkYXRlLFxyXG4gICAgZXZlbnRzXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGludGVyYWN0aW9uO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qIFxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qIFxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKiBcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWxpZ25MZWZ0KCBvYmogKXtcclxuICBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuTWVzaCApe1xyXG4gICAgb2JqLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gICAgY29uc3Qgd2lkdGggPSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnggLSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4Lnk7XHJcbiAgICBvYmouZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCwgMCwgMCApO1xyXG4gICAgcmV0dXJuIG9iajtcclxuICB9XHJcbiAgZWxzZSBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuR2VvbWV0cnkgKXtcclxuICAgIG9iai5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgIGNvbnN0IHdpZHRoID0gb2JqLmJvdW5kaW5nQm94Lm1heC54IC0gb2JqLmJvdW5kaW5nQm94Lm1heC55O1xyXG4gICAgb2JqLnRyYW5zbGF0ZSggd2lkdGgsIDAsIDAgKTtcclxuICAgIHJldHVybiBvYmo7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICl7XHJcbiAgY29uc3QgcGFuZWwgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApLCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcclxuICBwYW5lbC5nZW9tZXRyeS50cmFuc2xhdGUoIHdpZHRoICogMC41LCAwLCAwICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHBhbmVsLmdlb21ldHJ5LCBDb2xvcnMuREVGQVVMVF9CQUNLICk7XHJcbiAgcmV0dXJuIHBhbmVsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIGNvbG9yICl7XHJcbiAgY29uc3QgcGFuZWwgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBDT05UUk9MTEVSX0lEX1dJRFRILCBoZWlnaHQsIENPTlRST0xMRVJfSURfREVQVEggKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCBDT05UUk9MTEVSX0lEX1dJRFRIICogMC41LCAwLCAwICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHBhbmVsLmdlb21ldHJ5LCBjb2xvciApO1xyXG4gIHJldHVybiBwYW5lbDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFBBTkVMX1dJRFRIID0gMS4wO1xyXG5leHBvcnQgY29uc3QgUEFORUxfSEVJR0hUID0gMC4wNztcclxuZXhwb3J0IGNvbnN0IFBBTkVMX0RFUFRIID0gMC4wMTtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX1NQQUNJTkcgPSAwLjAwMjtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX01BUkdJTiA9IDAuMDA1O1xyXG5leHBvcnQgY29uc3QgUEFORUxfTEFCRUxfVEVYVF9NQVJHSU4gPSAwLjA2O1xyXG5leHBvcnQgY29uc3QgUEFORUxfVkFMVUVfVEVYVF9NQVJHSU4gPSAwLjAyO1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9XSURUSCA9IDAuMDI7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0RFUFRIID0gMC4wMDU7IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qIFxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qIFxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKiBcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gPSB7fSApe1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xyXG5cclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvbkdyaXBwZWQnLCBoYW5kbGVPbkdyaXAgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VHcmlwJywgaGFuZGxlT25HcmlwUmVsZWFzZSApO1xyXG5cclxuICBsZXQgb2xkUGFyZW50O1xyXG4gIGxldCBvbGRQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7ICBcclxuICBsZXQgb2xkUm90YXRpb24gPSBuZXcgVEhSRUUuRXVsZXIoKTtcclxuXHJcbiAgY29uc3Qgcm90YXRpb25Hcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIHJvdGF0aW9uR3JvdXAuc2NhbGUuc2V0KCAwLjMsIDAuMywgMC4zICk7XHJcbiAgcm90YXRpb25Hcm91cC5wb3NpdGlvbi5zZXQoIC0wLjAxNSwgMC4wMTUsIDAuMCApO1xyXG5cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25HcmlwKCB7aW5wdXRPYmplY3R9PXt9ICl7XHJcbiAgICBcclxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2xkUG9zaXRpb24uY29weSggZm9sZGVyLnBvc2l0aW9uICk7ICAgIFxyXG4gICAgb2xkUm90YXRpb24uY29weSggZm9sZGVyLnJvdGF0aW9uICk7XHJcblxyXG4gICAgZm9sZGVyLnBvc2l0aW9uLnNldCggMCwwLjAsMCApOyAgICBcclxuICAgIGZvbGRlci5yb3RhdGlvbi54ID0gLU1hdGguUEkgKiAwLjU7ICAgIFxyXG5cclxuICAgIG9sZFBhcmVudCA9IGZvbGRlci5wYXJlbnQ7XHJcblxyXG4gICAgcm90YXRpb25Hcm91cC5hZGQoIGZvbGRlciApO1xyXG5cclxuICAgIGlucHV0T2JqZWN0LmFkZCggcm90YXRpb25Hcm91cCApO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uR3JpcFJlbGVhc2UoIHtpbnB1dE9iamVjdH09e30gKXtcclxuXHJcbiAgICBjb25zb2xlLmxvZygncmVsZWFzaW5nIGdyaXAnKTtcclxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiggb2xkUGFyZW50ID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG9sZFBhcmVudC5hZGQoIGZvbGRlciApO1xyXG4gICAgb2xkUGFyZW50ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGZvbGRlci5wb3NpdGlvbi5jb3B5KCBvbGRQb3NpdGlvbiApOyAgICBcclxuICAgIGZvbGRlci5yb3RhdGlvbi5jb3B5KCBvbGRSb3RhdGlvbiApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGludGVyYWN0aW9uO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qIFxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qIFxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKiBcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBTREZTaGFkZXIgZnJvbSAndGhyZWUtYm1mb250LXRleHQvc2hhZGVycy9zZGYnO1xyXG5pbXBvcnQgY3JlYXRlR2VvbWV0cnkgZnJvbSAndGhyZWUtYm1mb250LXRleHQnO1xyXG5pbXBvcnQgcGFyc2VBU0NJSSBmcm9tICdwYXJzZS1ibWZvbnQtYXNjaWknO1xyXG5cclxuaW1wb3J0ICogYXMgRm9udCBmcm9tICcuL2ZvbnQnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hdGVyaWFsKCBjb2xvciApe1xyXG5cclxuICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcclxuICBjb25zdCBpbWFnZSA9IEZvbnQuaW1hZ2UoKTtcclxuICB0ZXh0dXJlLmltYWdlID0gaW1hZ2U7XHJcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJNaXBNYXBMaW5lYXJGaWx0ZXI7XHJcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XHJcbiAgdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSB0cnVlO1xyXG5cclxuICAvLyAgYW5kIHdoYXQgYWJvdXQgYW5pc290cm9waWMgZmlsdGVyaW5nP1xyXG5cclxuICByZXR1cm4gbmV3IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsKFNERlNoYWRlcih7XHJcbiAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBjb2xvcjogY29sb3IsXHJcbiAgICBtYXA6IHRleHR1cmVcclxuICB9KSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdG9yKCl7XHJcblxyXG4gIGNvbnN0IGZvbnQgPSBwYXJzZUFTQ0lJKCBGb250LmZudCgpICk7XHJcblxyXG4gIGNvbnN0IGNvbG9yTWF0ZXJpYWxzID0ge307XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZVRleHQoIHN0ciwgZm9udCwgY29sb3IgPSAweGZmZmZmZiApe1xyXG5cclxuICAgIGNvbnN0IGdlb21ldHJ5ID0gY3JlYXRlR2VvbWV0cnkoe1xyXG4gICAgICB0ZXh0OiBzdHIsXHJcbiAgICAgIGFsaWduOiAnbGVmdCcsXHJcbiAgICAgIHdpZHRoOiAxMDAwLFxyXG4gICAgICBmbGlwWTogdHJ1ZSxcclxuICAgICAgZm9udFxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGNvbnN0IGxheW91dCA9IGdlb21ldHJ5LmxheW91dDtcclxuXHJcbiAgICBsZXQgbWF0ZXJpYWwgPSBjb2xvck1hdGVyaWFsc1sgY29sb3IgXTtcclxuICAgIGlmKCBtYXRlcmlhbCA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIG1hdGVyaWFsID0gY29sb3JNYXRlcmlhbHNbIGNvbG9yIF0gPSBjcmVhdGVNYXRlcmlhbCggY29sb3IgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCggZ2VvbWV0cnksIG1hdGVyaWFsICk7XHJcbiAgICBtZXNoLnNjYWxlLm11bHRpcGx5KCBuZXcgVEhSRUUuVmVjdG9yMygxLC0xLDEpICk7XHJcbiAgICBtZXNoLnNjYWxlLm11bHRpcGx5U2NhbGFyKCAwLjAwMSApO1xyXG5cclxuICAgIG1lc2gucG9zaXRpb24ueSA9IGxheW91dC5oZWlnaHQgKiAwLjUgKiAwLjAwMTtcclxuXHJcbiAgICByZXR1cm4gbWVzaDtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGUoIHN0ciwgeyBjb2xvcj0weGZmZmZmZiB9ID0ge30gKXtcclxuICAgIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gICAgbGV0IG1lc2ggPSBjcmVhdGVUZXh0KCBzdHIsIGZvbnQsIGNvbG9yICk7XHJcbiAgICBncm91cC5hZGQoIG1lc2ggKTtcclxuICAgIGdyb3VwLmxheW91dCA9IG1lc2guZ2VvbWV0cnkubGF5b3V0O1xyXG5cclxuICAgIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgICAgbWVzaC5nZW9tZXRyeS51cGRhdGUoIHN0ciApO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgY3JlYXRlLFxyXG4gICAgZ2V0TWF0ZXJpYWw6ICgpPT4gbWF0ZXJpYWxcclxuICB9XHJcblxyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qIFxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qIFxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKiBcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcblxyXG5leHBvcnQgY29uc3QgUEFORUwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4ZmZmZmZmLCB2ZXJ0ZXhDb2xvcnM6IFRIUkVFLlZlcnRleENvbG9ycyB9ICk7XHJcbmV4cG9ydCBjb25zdCBMT0NBVE9SID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbmV4cG9ydCBjb25zdCBGT0xERVIgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4MDAwMDAwIH0gKTsiLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbiogXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiogXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qIFxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5pbXBvcnQgKiBhcyBQYWxldHRlIGZyb20gJy4vcGFsZXR0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVTbGlkZXIoIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgaW5pdGlhbFZhbHVlID0gMC4wLFxyXG4gIG1pbiA9IDAuMCwgbWF4ID0gMS4wLFxyXG4gIHN0ZXAgPSAwLjEsXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcblxyXG4gIGNvbnN0IFNMSURFUl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBTTElERVJfSEVJR0hUID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBTTElERVJfREVQVEggPSBkZXB0aDtcclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICBhbHBoYTogMS4wLFxyXG4gICAgdmFsdWU6IGluaXRpYWxWYWx1ZSxcclxuICAgIHN0ZXA6IHN0ZXAsXHJcbiAgICBwcmVjaXNpb246IDEsXHJcbiAgICBsaXN0ZW46IGZhbHNlLFxyXG4gICAgbWluOiBtaW4sXHJcbiAgICBtYXg6IG1heCxcclxuICAgIG9uQ2hhbmdlZENCOiB1bmRlZmluZWQsXHJcbiAgICBvbkZpbmlzaGVkQ2hhbmdlOiB1bmRlZmluZWRcclxuICB9O1xyXG5cclxuICBzdGF0ZS5zdGVwID0gZ2V0SW1wbGllZFN0ZXAoIHN0YXRlLnZhbHVlICk7XHJcbiAgc3RhdGUucHJlY2lzaW9uID0gbnVtRGVjaW1hbHMoIHN0YXRlLnN0ZXAgKTtcclxuICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgLy8gIGZpbGxlZCB2b2x1bWVcclxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBTTElERVJfV0lEVEgsIFNMSURFUl9IRUlHSFQsIFNMSURFUl9ERVBUSCApO1xyXG4gIHJlY3QudHJhbnNsYXRlKFNMSURFUl9XSURUSCowLjUsMCwwKTtcclxuICAvLyBMYXlvdXQuYWxpZ25MZWZ0KCByZWN0ICk7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIC8vICBvdXRsaW5lIHZvbHVtZVxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcclxuXHJcbiAgY29uc3Qgb3V0bGluZSA9IG5ldyBUSFJFRS5Cb3hIZWxwZXIoIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBvdXRsaW5lLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLk9VVExJTkVfQ09MT1IgKTtcclxuXHJcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogQ29sb3JzLkRFRkFVTFRfQ09MT1IsIGVtaXNzaXZlOiBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgfSk7XHJcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XHJcblxyXG4gIGNvbnN0IGVuZExvY2F0b3IgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCAwLjA1LCAwLjA1LCAwLjA1LCAxLCAxLCAxICksIFNoYXJlZE1hdGVyaWFscy5MT0NBVE9SICk7XHJcbiAgZW5kTG9jYXRvci5wb3NpdGlvbi54ID0gU0xJREVSX1dJRFRIO1xyXG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBlbmRMb2NhdG9yICk7XHJcbiAgZW5kTG9jYXRvci52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IHZhbHVlTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHN0YXRlLnZhbHVlLnRvU3RyaW5nKCkgKTtcclxuICB2YWx1ZUxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfVkFMVUVfVEVYVF9NQVJHSU4gKyB3aWR0aCAqIDAuNTtcclxuICB2YWx1ZUxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aCoyO1xyXG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9TTElERVIgKTtcclxuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xyXG5cclxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcclxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgb3V0bGluZSwgdmFsdWVMYWJlbCwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIGdyb3VwLmFkZCggcGFuZWwgKVxyXG5cclxuICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmFsdWVMYWJlbCggdmFsdWUgKXtcclxuICAgIHZhbHVlTGFiZWwudXBkYXRlKCByb3VuZFRvRGVjaW1hbCggc3RhdGUudmFsdWUsIHN0YXRlLnByZWNpc2lvbiApLnRvU3RyaW5nKCkgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcclxuICAgIGlmKCBpbnRlcmFjdGlvbi5wcmVzc2luZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLklOVEVSQUNUSU9OX0NPTE9SICk7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQ09MT1IgKTtcclxuICAgICAgbWF0ZXJpYWwuZW1pc3NpdmUuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0VNSVNTSVZFX0NPTE9SICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0NPTE9SICk7XHJcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkVNSVNTSVZFX0NPTE9SICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVTbGlkZXIoIGFscGhhICl7XHJcbiAgICBmaWxsZWRWb2x1bWUuc2NhbGUueCA9IE1hdGgubWF4KCBhbHBoYSAqIHdpZHRoLCAwLjAwMDAwMSApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlT2JqZWN0KCB2YWx1ZSApe1xyXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlU3RhdGVGcm9tQWxwaGEoIGFscGhhICl7XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldENsYW1wZWRBbHBoYSggYWxwaGEgKTtcclxuICAgIHN0YXRlLnZhbHVlID0gZ2V0VmFsdWVGcm9tQWxwaGEoIHN0YXRlLmFscGhhLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG4gICAgc3RhdGUudmFsdWUgPSBnZXRTdGVwcGVkVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5zdGVwICk7XHJcbiAgICBzdGF0ZS52YWx1ZSA9IGdldENsYW1wZWRWYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBsaXN0ZW5VcGRhdGUoKXtcclxuICAgIHN0YXRlLnZhbHVlID0gZ2V0VmFsdWVGcm9tT2JqZWN0KCk7XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuICAgIHN0YXRlLmFscGhhID0gZ2V0Q2xhbXBlZEFscGhhKCBzdGF0ZS5hbHBoYSApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0VmFsdWVGcm9tT2JqZWN0KCl7XHJcbiAgICByZXR1cm4gcGFyc2VGbG9hdCggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSApO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAub25DaGFuZ2UgPSBmdW5jdGlvbiggY2FsbGJhY2sgKXtcclxuICAgIHN0YXRlLm9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuc3RlcCA9IGZ1bmN0aW9uKCBzdGVwICl7XHJcbiAgICBzdGF0ZS5zdGVwID0gc3RlcDtcclxuICAgIHN0YXRlLnByZWNpc2lvbiA9IG51bURlY2ltYWxzKCBzdGF0ZS5zdGVwIClcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAncHJlc3NpbmcnLCBoYW5kbGVQcmVzcyApO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVQcmVzcyggeyBwb2ludCB9ID0ge30gKXtcclxuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZmlsbGVkVm9sdW1lLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XHJcbiAgICBlbmRMb2NhdG9yLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XHJcblxyXG4gICAgY29uc3QgYSA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBmaWxsZWRWb2x1bWUubWF0cml4V29ybGQgKTtcclxuICAgIGNvbnN0IGIgPSBuZXcgVEhSRUUuVmVjdG9yMygpLnNldEZyb21NYXRyaXhQb3NpdGlvbiggZW5kTG9jYXRvci5tYXRyaXhXb3JsZCApO1xyXG5cclxuICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSBzdGF0ZS52YWx1ZTtcclxuXHJcbiAgICB1cGRhdGVTdGF0ZUZyb21BbHBoYSggZ2V0UG9pbnRBbHBoYSggcG9pbnQsIHthLGJ9ICkgKTtcclxuICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB1cGRhdGVTbGlkZXIoIHN0YXRlLmFscGhhICk7XHJcbiAgICB1cGRhdGVPYmplY3QoIHN0YXRlLnZhbHVlICk7XHJcblxyXG4gICAgaWYoIHByZXZpb3VzVmFsdWUgIT09IHN0YXRlLnZhbHVlICYmIHN0YXRlLm9uQ2hhbmdlZENCICl7XHJcbiAgICAgIHN0YXRlLm9uQ2hhbmdlZENCKCBzdGF0ZS52YWx1ZSApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG4gIGNvbnN0IHBhbGV0dGVJbnRlcmFjdGlvbiA9IFBhbGV0dGUuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHBhbGV0dGVJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG5cclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgbGlzdGVuVXBkYXRlKCk7XHJcbiAgICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XHJcbiAgICAgIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBvaW50QWxwaGEoIHBvaW50LCBzZWdtZW50ICl7XHJcbiAgY29uc3QgYSA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuY29weSggc2VnbWVudC5iICkuc3ViKCBzZWdtZW50LmEgKTtcclxuICBjb25zdCBiID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5jb3B5KCBwb2ludCApLnN1Yiggc2VnbWVudC5hICk7XHJcbiAgY29uc3QgcHJvamVjdGVkID0gYi5wcm9qZWN0T25WZWN0b3IoIGEgKTtcclxuXHJcbiAgY29uc3QgbGVuZ3RoID0gc2VnbWVudC5hLmRpc3RhbmNlVG8oIHNlZ21lbnQuYiApO1xyXG5cclxuICBsZXQgYWxwaGEgPSBwcm9qZWN0ZWQubGVuZ3RoKCkgLyBsZW5ndGg7XHJcbiAgaWYoIGFscGhhID4gMS4wICl7XHJcbiAgICBhbHBoYSA9IDEuMDtcclxuICB9XHJcbiAgaWYoIGFscGhhIDwgMC4wICl7XHJcbiAgICBhbHBoYSA9IDAuMDtcclxuICB9XHJcbiAgcmV0dXJuIGFscGhhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsZXJwKG1pbiwgbWF4LCB2YWx1ZSkge1xyXG4gIHJldHVybiAoMS12YWx1ZSkqbWluICsgdmFsdWUqbWF4O1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXBfcmFuZ2UodmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikge1xyXG4gICAgcmV0dXJuIGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENsYW1wZWRBbHBoYSggYWxwaGEgKXtcclxuICBpZiggYWxwaGEgPiAxICl7XHJcbiAgICByZXR1cm4gMVxyXG4gIH1cclxuICBpZiggYWxwaGEgPCAwICl7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbiAgcmV0dXJuIGFscGhhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDbGFtcGVkVmFsdWUoIHZhbHVlLCBtaW4sIG1heCApe1xyXG4gIGlmKCB2YWx1ZSA8IG1pbiApe1xyXG4gICAgcmV0dXJuIG1pbjtcclxuICB9XHJcbiAgaWYoIHZhbHVlID4gbWF4ICl7XHJcbiAgICByZXR1cm4gbWF4O1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEltcGxpZWRTdGVwKCB2YWx1ZSApe1xyXG4gIGlmKCB2YWx1ZSA9PT0gMCApe1xyXG4gICAgcmV0dXJuIDE7IC8vIFdoYXQgYXJlIHdlLCBwc3ljaGljcz9cclxuICB9IGVsc2Uge1xyXG4gICAgLy8gSGV5IERvdWcsIGNoZWNrIHRoaXMgb3V0LlxyXG4gICAgcmV0dXJuIE1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nKE1hdGguYWJzKHZhbHVlKSkvTWF0aC5MTjEwKSkvMTA7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWYWx1ZUZyb21BbHBoYSggYWxwaGEsIG1pbiwgbWF4ICl7XHJcbiAgcmV0dXJuIG1hcF9yYW5nZSggYWxwaGEsIDAuMCwgMS4wLCBtaW4sIG1heCApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFscGhhRnJvbVZhbHVlKCB2YWx1ZSwgbWluLCBtYXggKXtcclxuICByZXR1cm4gbWFwX3JhbmdlKCB2YWx1ZSwgbWluLCBtYXgsIDAuMCwgMS4wICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFN0ZXBwZWRWYWx1ZSggdmFsdWUsIHN0ZXAgKXtcclxuICBpZiggdmFsdWUgJSBzdGVwICE9IDApIHtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKCB2YWx1ZSAvIHN0ZXAgKSAqIHN0ZXA7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbnVtRGVjaW1hbHMoeCkge1xyXG4gIHggPSB4LnRvU3RyaW5nKCk7XHJcbiAgaWYgKHguaW5kZXhPZignLicpID4gLTEpIHtcclxuICAgIHJldHVybiB4Lmxlbmd0aCAtIHguaW5kZXhPZignLicpIC0gMTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIDA7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByb3VuZFRvRGVjaW1hbCh2YWx1ZSwgZGVjaW1hbHMpIHtcclxuICBjb25zdCB0ZW5UbyA9IE1hdGgucG93KDEwLCBkZWNpbWFscyk7XHJcbiAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiB0ZW5UbykgLyB0ZW5UbztcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlVGV4dExhYmVsKCB0ZXh0Q3JlYXRvciwgc3RyLCB3aWR0aCA9IDAuNCwgZGVwdGggPSAwLjAyOSwgZmdDb2xvciA9IDB4ZmZmZmZmLCBiZ0NvbG9yID0gQ29sb3JzLkRFRkFVTFRfQkFDSyApe1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIGNvbnN0IGludGVybmFsUG9zaXRpb25pbmcgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBncm91cC5hZGQoIGludGVybmFsUG9zaXRpb25pbmcgKTtcclxuXHJcbiAgY29uc3QgdGV4dCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggc3RyLCB7IGNvbG9yOiBmZ0NvbG9yIH0gKTtcclxuICBpbnRlcm5hbFBvc2l0aW9uaW5nLmFkZCggdGV4dCApO1xyXG5cclxuICBncm91cC5zZXRTdHJpbmcgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICB0ZXh0LnVwZGF0ZSggc3RyLnRvU3RyaW5nKCkgKTtcclxuICB9O1xyXG5cclxuICBncm91cC5zZXROdW1iZXIgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICB0ZXh0LnVwZGF0ZSggc3RyLnRvRml4ZWQoMikgKTtcclxuICB9O1xyXG5cclxuICB0ZXh0LnBvc2l0aW9uLnogPSAwLjAxNVxyXG5cclxuICBjb25zdCBiYWNrQm91bmRzID0gMC4wMTtcclxuICBjb25zdCBtYXJnaW4gPSAwLjAxO1xyXG4gIGNvbnN0IHRvdGFsV2lkdGggPSB3aWR0aDtcclxuICBjb25zdCB0b3RhbEhlaWdodCA9IDAuMDQgKyBtYXJnaW4gKiAyO1xyXG4gIGNvbnN0IGxhYmVsQmFja0dlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB0b3RhbFdpZHRoLCB0b3RhbEhlaWdodCwgZGVwdGgsIDEsIDEsIDEgKTtcclxuICBsYWJlbEJhY2tHZW9tZXRyeS5hcHBseU1hdHJpeCggbmV3IFRIUkVFLk1hdHJpeDQoKS5tYWtlVHJhbnNsYXRpb24oIHRvdGFsV2lkdGggKiAwLjUgLSBtYXJnaW4sIDAsIDAgKSApO1xyXG5cclxuICBjb25zdCBsYWJlbEJhY2tNZXNoID0gbmV3IFRIUkVFLk1lc2goIGxhYmVsQmFja0dlb21ldHJ5LCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcclxuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWxCYWNrTWVzaC5nZW9tZXRyeSwgYmdDb2xvciApO1xyXG5cclxuICBsYWJlbEJhY2tNZXNoLnBvc2l0aW9uLnkgPSAwLjAzO1xyXG4gIC8vIGxhYmVsQmFja01lc2gucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG4gIGludGVybmFsUG9zaXRpb25pbmcuYWRkKCBsYWJlbEJhY2tNZXNoICk7XHJcbiAgaW50ZXJuYWxQb3NpdGlvbmluZy5wb3NpdGlvbi55ID0gLXRvdGFsSGVpZ2h0ICogMC41O1xyXG5cclxuICAvLyBsYWJlbEdyb3VwLnBvc2l0aW9uLnggPSBsYWJlbEJvdW5kcy53aWR0aCAqIDAuNTtcclxuICAvLyBsYWJlbEdyb3VwLnBvc2l0aW9uLnkgPSBsYWJlbEJvdW5kcy5oZWlnaHQgKiAwLjU7XHJcblxyXG4gIGdyb3VwLmJhY2sgPSBsYWJlbEJhY2tNZXNoO1xyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlQk1Gb250QXNjaWkoZGF0YSkge1xuICBpZiAoIWRhdGEpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBkYXRhIHByb3ZpZGVkJylcbiAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKS50cmltKClcblxuICB2YXIgb3V0cHV0ID0ge1xuICAgIHBhZ2VzOiBbXSxcbiAgICBjaGFyczogW10sXG4gICAga2VybmluZ3M6IFtdXG4gIH1cblxuICB2YXIgbGluZXMgPSBkYXRhLnNwbGl0KC9cXHJcXG4/fFxcbi9nKVxuXG4gIGlmIChsaW5lcy5sZW5ndGggPT09IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBkYXRhIGluIEJNRm9udCBmaWxlJylcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGxpbmVEYXRhID0gc3BsaXRMaW5lKGxpbmVzW2ldLCBpKVxuICAgIGlmICghbGluZURhdGEpIC8vc2tpcCBlbXB0eSBsaW5lc1xuICAgICAgY29udGludWVcblxuICAgIGlmIChsaW5lRGF0YS5rZXkgPT09ICdwYWdlJykge1xuICAgICAgaWYgKHR5cGVvZiBsaW5lRGF0YS5kYXRhLmlkICE9PSAnbnVtYmVyJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYWxmb3JtZWQgZmlsZSBhdCBsaW5lICcgKyBpICsgJyAtLSBuZWVkcyBwYWdlIGlkPU4nKVxuICAgICAgaWYgKHR5cGVvZiBsaW5lRGF0YS5kYXRhLmZpbGUgIT09ICdzdHJpbmcnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbGZvcm1lZCBmaWxlIGF0IGxpbmUgJyArIGkgKyAnIC0tIG5lZWRzIHBhZ2UgZmlsZT1cInBhdGhcIicpXG4gICAgICBvdXRwdXQucGFnZXNbbGluZURhdGEuZGF0YS5pZF0gPSBsaW5lRGF0YS5kYXRhLmZpbGVcbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2NoYXJzJyB8fCBsaW5lRGF0YS5rZXkgPT09ICdrZXJuaW5ncycpIHtcbiAgICAgIC8vLi4uIGRvIG5vdGhpbmcgZm9yIHRoZXNlIHR3byAuLi5cbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2NoYXInKSB7XG4gICAgICBvdXRwdXQuY2hhcnMucHVzaChsaW5lRGF0YS5kYXRhKVxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAna2VybmluZycpIHtcbiAgICAgIG91dHB1dC5rZXJuaW5ncy5wdXNoKGxpbmVEYXRhLmRhdGEpXG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dFtsaW5lRGF0YS5rZXldID0gbGluZURhdGEuZGF0YVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRwdXRcbn1cblxuZnVuY3Rpb24gc3BsaXRMaW5lKGxpbmUsIGlkeCkge1xuICBsaW5lID0gbGluZS5yZXBsYWNlKC9cXHQrL2csICcgJykudHJpbSgpXG4gIGlmICghbGluZSlcbiAgICByZXR1cm4gbnVsbFxuXG4gIHZhciBzcGFjZSA9IGxpbmUuaW5kZXhPZignICcpXG4gIGlmIChzcGFjZSA9PT0gLTEpIFxuICAgIHRocm93IG5ldyBFcnJvcihcIm5vIG5hbWVkIHJvdyBhdCBsaW5lIFwiICsgaWR4KVxuXG4gIHZhciBrZXkgPSBsaW5lLnN1YnN0cmluZygwLCBzcGFjZSlcblxuICBsaW5lID0gbGluZS5zdWJzdHJpbmcoc3BhY2UgKyAxKVxuICAvL2NsZWFyIFwibGV0dGVyXCIgZmllbGQgYXMgaXQgaXMgbm9uLXN0YW5kYXJkIGFuZFxuICAvL3JlcXVpcmVzIGFkZGl0aW9uYWwgY29tcGxleGl0eSB0byBwYXJzZSBcIiAvID0gc3ltYm9sc1xuICBsaW5lID0gbGluZS5yZXBsYWNlKC9sZXR0ZXI9W1xcJ1xcXCJdXFxTK1tcXCdcXFwiXS9naSwgJycpICBcbiAgbGluZSA9IGxpbmUuc3BsaXQoXCI9XCIpXG4gIGxpbmUgPSBsaW5lLm1hcChmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRyaW0oKS5tYXRjaCgoLyhcIi4qP1wifFteXCJcXHNdKykrKD89XFxzKnxcXHMqJCkvZykpXG4gIH0pXG5cbiAgdmFyIGRhdGEgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmUubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZHQgPSBsaW5lW2ldXG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIGtleTogZHRbMF0sXG4gICAgICAgIGRhdGE6IFwiXCJcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChpID09PSBsaW5lLmxlbmd0aCAtIDEpIHtcbiAgICAgIGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRhID0gcGFyc2VEYXRhKGR0WzBdKVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhW2RhdGEubGVuZ3RoIC0gMV0uZGF0YSA9IHBhcnNlRGF0YShkdFswXSlcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIGtleTogZHRbMV0sXG4gICAgICAgIGRhdGE6IFwiXCJcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdmFyIG91dCA9IHtcbiAgICBrZXk6IGtleSxcbiAgICBkYXRhOiB7fVxuICB9XG5cbiAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICBvdXQuZGF0YVt2LmtleV0gPSB2LmRhdGE7XG4gIH0pXG5cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBwYXJzZURhdGEoZGF0YSkge1xuICBpZiAoIWRhdGEgfHwgZGF0YS5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIFwiXCJcblxuICBpZiAoZGF0YS5pbmRleE9mKCdcIicpID09PSAwIHx8IGRhdGEuaW5kZXhPZihcIidcIikgPT09IDApXG4gICAgcmV0dXJuIGRhdGEuc3Vic3RyaW5nKDEsIGRhdGEubGVuZ3RoIC0gMSlcbiAgaWYgKGRhdGEuaW5kZXhPZignLCcpICE9PSAtMSlcbiAgICByZXR1cm4gcGFyc2VJbnRMaXN0KGRhdGEpXG4gIHJldHVybiBwYXJzZUludChkYXRhLCAxMClcbn1cblxuZnVuY3Rpb24gcGFyc2VJbnRMaXN0KGRhdGEpIHtcbiAgcmV0dXJuIGRhdGEuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24odmFsKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KHZhbCwgMTApXG4gIH0pXG59IiwidmFyIGNyZWF0ZUxheW91dCA9IHJlcXVpcmUoJ2xheW91dC1ibWZvbnQtdGV4dCcpXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG52YXIgY3JlYXRlSW5kaWNlcyA9IHJlcXVpcmUoJ3F1YWQtaW5kaWNlcycpXG52YXIgYnVmZmVyID0gcmVxdWlyZSgndGhyZWUtYnVmZmVyLXZlcnRleC1kYXRhJylcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJylcblxudmFyIHZlcnRpY2VzID0gcmVxdWlyZSgnLi9saWIvdmVydGljZXMnKVxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi9saWIvdXRpbHMnKVxuXG52YXIgQmFzZSA9IFRIUkVFLkJ1ZmZlckdlb21ldHJ5XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlVGV4dEdlb21ldHJ5IChvcHQpIHtcbiAgcmV0dXJuIG5ldyBUZXh0R2VvbWV0cnkob3B0KVxufVxuXG5mdW5jdGlvbiBUZXh0R2VvbWV0cnkgKG9wdCkge1xuICBCYXNlLmNhbGwodGhpcylcblxuICBpZiAodHlwZW9mIG9wdCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHQgPSB7IHRleHQ6IG9wdCB9XG4gIH1cblxuICAvLyB1c2UgdGhlc2UgYXMgZGVmYXVsdCB2YWx1ZXMgZm9yIGFueSBzdWJzZXF1ZW50XG4gIC8vIGNhbGxzIHRvIHVwZGF0ZSgpXG4gIHRoaXMuX29wdCA9IGFzc2lnbih7fSwgb3B0KVxuXG4gIC8vIGFsc28gZG8gYW4gaW5pdGlhbCBzZXR1cC4uLlxuICBpZiAob3B0KSB0aGlzLnVwZGF0ZShvcHQpXG59XG5cbmluaGVyaXRzKFRleHRHZW9tZXRyeSwgQmFzZSlcblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAob3B0KSB7XG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJykge1xuICAgIG9wdCA9IHsgdGV4dDogb3B0IH1cbiAgfVxuXG4gIC8vIHVzZSBjb25zdHJ1Y3RvciBkZWZhdWx0c1xuICBvcHQgPSBhc3NpZ24oe30sIHRoaXMuX29wdCwgb3B0KVxuXG4gIGlmICghb3B0LmZvbnQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHNwZWNpZnkgYSB7IGZvbnQgfSBpbiBvcHRpb25zJylcbiAgfVxuXG4gIHRoaXMubGF5b3V0ID0gY3JlYXRlTGF5b3V0KG9wdClcblxuICAvLyBnZXQgdmVjMiB0ZXhjb29yZHNcbiAgdmFyIGZsaXBZID0gb3B0LmZsaXBZICE9PSBmYWxzZVxuXG4gIC8vIHRoZSBkZXNpcmVkIEJNRm9udCBkYXRhXG4gIHZhciBmb250ID0gb3B0LmZvbnRcblxuICAvLyBkZXRlcm1pbmUgdGV4dHVyZSBzaXplIGZyb20gZm9udCBmaWxlXG4gIHZhciB0ZXhXaWR0aCA9IGZvbnQuY29tbW9uLnNjYWxlV1xuICB2YXIgdGV4SGVpZ2h0ID0gZm9udC5jb21tb24uc2NhbGVIXG5cbiAgLy8gZ2V0IHZpc2libGUgZ2x5cGhzXG4gIHZhciBnbHlwaHMgPSB0aGlzLmxheW91dC5nbHlwaHMuZmlsdGVyKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG4gICAgcmV0dXJuIGJpdG1hcC53aWR0aCAqIGJpdG1hcC5oZWlnaHQgPiAwXG4gIH0pXG5cbiAgLy8gcHJvdmlkZSB2aXNpYmxlIGdseXBocyBmb3IgY29udmVuaWVuY2VcbiAgdGhpcy52aXNpYmxlR2x5cGhzID0gZ2x5cGhzXG5cbiAgLy8gZ2V0IGNvbW1vbiB2ZXJ0ZXggZGF0YVxuICB2YXIgcG9zaXRpb25zID0gdmVydGljZXMucG9zaXRpb25zKGdseXBocylcbiAgdmFyIHV2cyA9IHZlcnRpY2VzLnV2cyhnbHlwaHMsIHRleFdpZHRoLCB0ZXhIZWlnaHQsIGZsaXBZKVxuICB2YXIgaW5kaWNlcyA9IGNyZWF0ZUluZGljZXMoe1xuICAgIGNsb2Nrd2lzZTogdHJ1ZSxcbiAgICB0eXBlOiAndWludDE2JyxcbiAgICBjb3VudDogZ2x5cGhzLmxlbmd0aFxuICB9KVxuXG4gIC8vIHVwZGF0ZSB2ZXJ0ZXggZGF0YVxuICBidWZmZXIuaW5kZXgodGhpcywgaW5kaWNlcywgMSwgJ3VpbnQxNicpXG4gIGJ1ZmZlci5hdHRyKHRoaXMsICdwb3NpdGlvbicsIHBvc2l0aW9ucywgMilcbiAgYnVmZmVyLmF0dHIodGhpcywgJ3V2JywgdXZzLCAyKVxuXG4gIC8vIHVwZGF0ZSBtdWx0aXBhZ2UgZGF0YVxuICBpZiAoIW9wdC5tdWx0aXBhZ2UgJiYgJ3BhZ2UnIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIC8vIGRpc2FibGUgbXVsdGlwYWdlIHJlbmRlcmluZ1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdwYWdlJylcbiAgfSBlbHNlIGlmIChvcHQubXVsdGlwYWdlKSB7XG4gICAgdmFyIHBhZ2VzID0gdmVydGljZXMucGFnZXMoZ2x5cGhzKVxuICAgIC8vIGVuYWJsZSBtdWx0aXBhZ2UgcmVuZGVyaW5nXG4gICAgYnVmZmVyLmF0dHIodGhpcywgJ3BhZ2UnLCBwYWdlcywgMSlcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVCb3VuZGluZ1NwaGVyZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYm91bmRpbmdTcGhlcmUgPT09IG51bGwpIHtcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlID0gbmV3IFRIUkVFLlNwaGVyZSgpXG4gIH1cblxuICB2YXIgcG9zaXRpb25zID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5XG4gIHZhciBpdGVtU2l6ZSA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5pdGVtU2l6ZVxuICBpZiAoIXBvc2l0aW9ucyB8fCAhaXRlbVNpemUgfHwgcG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlLnJhZGl1cyA9IDBcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlLmNlbnRlci5zZXQoMCwgMCwgMClcbiAgICByZXR1cm5cbiAgfVxuICB1dGlscy5jb21wdXRlU3BoZXJlKHBvc2l0aW9ucywgdGhpcy5ib3VuZGluZ1NwaGVyZSlcbiAgaWYgKGlzTmFOKHRoaXMuYm91bmRpbmdTcGhlcmUucmFkaXVzKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1RIUkVFLkJ1ZmZlckdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpOiAnICtcbiAgICAgICdDb21wdXRlZCByYWRpdXMgaXMgTmFOLiBUaGUgJyArXG4gICAgICAnXCJwb3NpdGlvblwiIGF0dHJpYnV0ZSBpcyBsaWtlbHkgdG8gaGF2ZSBOYU4gdmFsdWVzLicpXG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS5jb21wdXRlQm91bmRpbmdCb3ggPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmJvdW5kaW5nQm94ID09PSBudWxsKSB7XG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IG5ldyBUSFJFRS5Cb3gzKClcbiAgfVxuXG4gIHZhciBiYm94ID0gdGhpcy5ib3VuZGluZ0JveFxuICB2YXIgcG9zaXRpb25zID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5XG4gIHZhciBpdGVtU2l6ZSA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5pdGVtU2l6ZVxuICBpZiAoIXBvc2l0aW9ucyB8fCAhaXRlbVNpemUgfHwgcG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICBiYm94Lm1ha2VFbXB0eSgpXG4gICAgcmV0dXJuXG4gIH1cbiAgdXRpbHMuY29tcHV0ZUJveChwb3NpdGlvbnMsIGJib3gpXG59XG4iLCJ2YXIgaXRlbVNpemUgPSAyXG52YXIgYm94ID0geyBtaW46IFswLCAwXSwgbWF4OiBbMCwgMF0gfVxuXG5mdW5jdGlvbiBib3VuZHMgKHBvc2l0aW9ucykge1xuICB2YXIgY291bnQgPSBwb3NpdGlvbnMubGVuZ3RoIC8gaXRlbVNpemVcbiAgYm94Lm1pblswXSA9IHBvc2l0aW9uc1swXVxuICBib3gubWluWzFdID0gcG9zaXRpb25zWzFdXG4gIGJveC5tYXhbMF0gPSBwb3NpdGlvbnNbMF1cbiAgYm94Lm1heFsxXSA9IHBvc2l0aW9uc1sxXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIHZhciB4ID0gcG9zaXRpb25zW2kgKiBpdGVtU2l6ZSArIDBdXG4gICAgdmFyIHkgPSBwb3NpdGlvbnNbaSAqIGl0ZW1TaXplICsgMV1cbiAgICBib3gubWluWzBdID0gTWF0aC5taW4oeCwgYm94Lm1pblswXSlcbiAgICBib3gubWluWzFdID0gTWF0aC5taW4oeSwgYm94Lm1pblsxXSlcbiAgICBib3gubWF4WzBdID0gTWF0aC5tYXgoeCwgYm94Lm1heFswXSlcbiAgICBib3gubWF4WzFdID0gTWF0aC5tYXgoeSwgYm94Lm1heFsxXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlQm94ID0gZnVuY3Rpb24gKHBvc2l0aW9ucywgb3V0cHV0KSB7XG4gIGJvdW5kcyhwb3NpdGlvbnMpXG4gIG91dHB1dC5taW4uc2V0KGJveC5taW5bMF0sIGJveC5taW5bMV0sIDApXG4gIG91dHB1dC5tYXguc2V0KGJveC5tYXhbMF0sIGJveC5tYXhbMV0sIDApXG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbXB1dGVTcGhlcmUgPSBmdW5jdGlvbiAocG9zaXRpb25zLCBvdXRwdXQpIHtcbiAgYm91bmRzKHBvc2l0aW9ucylcbiAgdmFyIG1pblggPSBib3gubWluWzBdXG4gIHZhciBtaW5ZID0gYm94Lm1pblsxXVxuICB2YXIgbWF4WCA9IGJveC5tYXhbMF1cbiAgdmFyIG1heFkgPSBib3gubWF4WzFdXG4gIHZhciB3aWR0aCA9IG1heFggLSBtaW5YXG4gIHZhciBoZWlnaHQgPSBtYXhZIC0gbWluWVxuICB2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHdpZHRoICogd2lkdGggKyBoZWlnaHQgKiBoZWlnaHQpXG4gIG91dHB1dC5jZW50ZXIuc2V0KG1pblggKyB3aWR0aCAvIDIsIG1pblkgKyBoZWlnaHQgLyAyLCAwKVxuICBvdXRwdXQucmFkaXVzID0gbGVuZ3RoIC8gMlxufVxuIiwibW9kdWxlLmV4cG9ydHMucGFnZXMgPSBmdW5jdGlvbiBwYWdlcyAoZ2x5cGhzKSB7XG4gIHZhciBwYWdlcyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAxKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGlkID0gZ2x5cGguZGF0YS5wYWdlIHx8IDBcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgfSlcbiAgcmV0dXJuIHBhZ2VzXG59XG5cbm1vZHVsZS5leHBvcnRzLnV2cyA9IGZ1bmN0aW9uIHV2cyAoZ2x5cGhzLCB0ZXhXaWR0aCwgdGV4SGVpZ2h0LCBmbGlwWSkge1xuICB2YXIgdXZzID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDIpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuICAgIHZhciBidyA9IChiaXRtYXAueCArIGJpdG1hcC53aWR0aClcbiAgICB2YXIgYmggPSAoYml0bWFwLnkgKyBiaXRtYXAuaGVpZ2h0KVxuXG4gICAgLy8gdG9wIGxlZnQgcG9zaXRpb25cbiAgICB2YXIgdTAgPSBiaXRtYXAueCAvIHRleFdpZHRoXG4gICAgdmFyIHYxID0gYml0bWFwLnkgLyB0ZXhIZWlnaHRcbiAgICB2YXIgdTEgPSBidyAvIHRleFdpZHRoXG4gICAgdmFyIHYwID0gYmggLyB0ZXhIZWlnaHRcblxuICAgIGlmIChmbGlwWSkge1xuICAgICAgdjEgPSAodGV4SGVpZ2h0IC0gYml0bWFwLnkpIC8gdGV4SGVpZ2h0XG4gICAgICB2MCA9ICh0ZXhIZWlnaHQgLSBiaCkgLyB0ZXhIZWlnaHRcbiAgICB9XG5cbiAgICAvLyBCTFxuICAgIHV2c1tpKytdID0gdTBcbiAgICB1dnNbaSsrXSA9IHYxXG4gICAgLy8gVExcbiAgICB1dnNbaSsrXSA9IHUwXG4gICAgdXZzW2krK10gPSB2MFxuICAgIC8vIFRSXG4gICAgdXZzW2krK10gPSB1MVxuICAgIHV2c1tpKytdID0gdjBcbiAgICAvLyBCUlxuICAgIHV2c1tpKytdID0gdTFcbiAgICB1dnNbaSsrXSA9IHYxXG4gIH0pXG4gIHJldHVybiB1dnNcbn1cblxubW9kdWxlLmV4cG9ydHMucG9zaXRpb25zID0gZnVuY3Rpb24gcG9zaXRpb25zIChnbHlwaHMpIHtcbiAgdmFyIHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAyKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcblxuICAgIC8vIGJvdHRvbSBsZWZ0IHBvc2l0aW9uXG4gICAgdmFyIHggPSBnbHlwaC5wb3NpdGlvblswXSArIGJpdG1hcC54b2Zmc2V0XG4gICAgdmFyIHkgPSBnbHlwaC5wb3NpdGlvblsxXSArIGJpdG1hcC55b2Zmc2V0XG5cbiAgICAvLyBxdWFkIHNpemVcbiAgICB2YXIgdyA9IGJpdG1hcC53aWR0aFxuICAgIHZhciBoID0gYml0bWFwLmhlaWdodFxuXG4gICAgLy8gQkxcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHhcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHlcbiAgICAvLyBUTFxuICAgIHBvc2l0aW9uc1tpKytdID0geFxuICAgIHBvc2l0aW9uc1tpKytdID0geSArIGhcbiAgICAvLyBUUlxuICAgIHBvc2l0aW9uc1tpKytdID0geCArIHdcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHkgKyBoXG4gICAgLy8gQlJcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHggKyB3XG4gICAgcG9zaXRpb25zW2krK10gPSB5XG4gIH0pXG4gIHJldHVybiBwb3NpdGlvbnNcbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwidmFyIHdvcmRXcmFwID0gcmVxdWlyZSgnd29yZC13cmFwcGVyJylcbnZhciB4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kJylcbnZhciBmaW5kQ2hhciA9IHJlcXVpcmUoJ2luZGV4b2YtcHJvcGVydHknKSgnaWQnKVxudmFyIG51bWJlciA9IHJlcXVpcmUoJ2FzLW51bWJlcicpXG5cbnZhciBYX0hFSUdIVFMgPSBbJ3gnLCAnZScsICdhJywgJ28nLCAnbicsICdzJywgJ3InLCAnYycsICd1JywgJ20nLCAndicsICd3JywgJ3onXVxudmFyIE1fV0lEVEhTID0gWydtJywgJ3cnXVxudmFyIENBUF9IRUlHSFRTID0gWydIJywgJ0knLCAnTicsICdFJywgJ0YnLCAnSycsICdMJywgJ1QnLCAnVScsICdWJywgJ1cnLCAnWCcsICdZJywgJ1onXVxuXG5cbnZhciBUQUJfSUQgPSAnXFx0Jy5jaGFyQ29kZUF0KDApXG52YXIgU1BBQ0VfSUQgPSAnICcuY2hhckNvZGVBdCgwKVxudmFyIEFMSUdOX0xFRlQgPSAwLCBcbiAgICBBTElHTl9DRU5URVIgPSAxLCBcbiAgICBBTElHTl9SSUdIVCA9IDJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVMYXlvdXQob3B0KSB7XG4gIHJldHVybiBuZXcgVGV4dExheW91dChvcHQpXG59XG5cbmZ1bmN0aW9uIFRleHRMYXlvdXQob3B0KSB7XG4gIHRoaXMuZ2x5cGhzID0gW11cbiAgdGhpcy5fbWVhc3VyZSA9IHRoaXMuY29tcHV0ZU1ldHJpY3MuYmluZCh0aGlzKVxuICB0aGlzLnVwZGF0ZShvcHQpXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG9wdCkge1xuICBvcHQgPSB4dGVuZCh7XG4gICAgbWVhc3VyZTogdGhpcy5fbWVhc3VyZVxuICB9LCBvcHQpXG4gIHRoaXMuX29wdCA9IG9wdFxuICB0aGlzLl9vcHQudGFiU2l6ZSA9IG51bWJlcih0aGlzLl9vcHQudGFiU2l6ZSwgNClcblxuICBpZiAoIW9wdC5mb250KVxuICAgIHRocm93IG5ldyBFcnJvcignbXVzdCBwcm92aWRlIGEgdmFsaWQgYml0bWFwIGZvbnQnKVxuXG4gIHZhciBnbHlwaHMgPSB0aGlzLmdseXBoc1xuICB2YXIgdGV4dCA9IG9wdC50ZXh0fHwnJyBcbiAgdmFyIGZvbnQgPSBvcHQuZm9udFxuICB0aGlzLl9zZXR1cFNwYWNlR2x5cGhzKGZvbnQpXG4gIFxuICB2YXIgbGluZXMgPSB3b3JkV3JhcC5saW5lcyh0ZXh0LCBvcHQpXG4gIHZhciBtaW5XaWR0aCA9IG9wdC53aWR0aCB8fCAwXG5cbiAgLy9jbGVhciBnbHlwaHNcbiAgZ2x5cGhzLmxlbmd0aCA9IDBcblxuICAvL2dldCBtYXggbGluZSB3aWR0aFxuICB2YXIgbWF4TGluZVdpZHRoID0gbGluZXMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGxpbmUpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgocHJldiwgbGluZS53aWR0aCwgbWluV2lkdGgpXG4gIH0sIDApXG5cbiAgLy90aGUgcGVuIHBvc2l0aW9uXG4gIHZhciB4ID0gMFxuICB2YXIgeSA9IDBcbiAgdmFyIGxpbmVIZWlnaHQgPSBudW1iZXIob3B0LmxpbmVIZWlnaHQsIGZvbnQuY29tbW9uLmxpbmVIZWlnaHQpXG4gIHZhciBiYXNlbGluZSA9IGZvbnQuY29tbW9uLmJhc2VcbiAgdmFyIGRlc2NlbmRlciA9IGxpbmVIZWlnaHQtYmFzZWxpbmVcbiAgdmFyIGxldHRlclNwYWNpbmcgPSBvcHQubGV0dGVyU3BhY2luZyB8fCAwXG4gIHZhciBoZWlnaHQgPSBsaW5lSGVpZ2h0ICogbGluZXMubGVuZ3RoIC0gZGVzY2VuZGVyXG4gIHZhciBhbGlnbiA9IGdldEFsaWduVHlwZSh0aGlzLl9vcHQuYWxpZ24pXG5cbiAgLy9kcmF3IHRleHQgYWxvbmcgYmFzZWxpbmVcbiAgeSAtPSBoZWlnaHRcbiAgXG4gIC8vdGhlIG1ldHJpY3MgZm9yIHRoaXMgdGV4dCBsYXlvdXRcbiAgdGhpcy5fd2lkdGggPSBtYXhMaW5lV2lkdGhcbiAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0XG4gIHRoaXMuX2Rlc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBiYXNlbGluZVxuICB0aGlzLl9iYXNlbGluZSA9IGJhc2VsaW5lXG4gIHRoaXMuX3hIZWlnaHQgPSBnZXRYSGVpZ2h0KGZvbnQpXG4gIHRoaXMuX2NhcEhlaWdodCA9IGdldENhcEhlaWdodChmb250KVxuICB0aGlzLl9saW5lSGVpZ2h0ID0gbGluZUhlaWdodFxuICB0aGlzLl9hc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBkZXNjZW5kZXIgLSB0aGlzLl94SGVpZ2h0XG4gICAgXG4gIC8vbGF5b3V0IGVhY2ggZ2x5cGhcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgbGluZUluZGV4KSB7XG4gICAgdmFyIHN0YXJ0ID0gbGluZS5zdGFydFxuICAgIHZhciBlbmQgPSBsaW5lLmVuZFxuICAgIHZhciBsaW5lV2lkdGggPSBsaW5lLndpZHRoXG4gICAgdmFyIGxhc3RHbHlwaFxuICAgIFxuICAgIC8vZm9yIGVhY2ggZ2x5cGggaW4gdGhhdCBsaW5lLi4uXG4gICAgZm9yICh2YXIgaT1zdGFydDsgaTxlbmQ7IGkrKykge1xuICAgICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgICB2YXIgZ2x5cGggPSBzZWxmLmdldEdseXBoKGZvbnQsIGlkKVxuICAgICAgaWYgKGdseXBoKSB7XG4gICAgICAgIGlmIChsYXN0R2x5cGgpIFxuICAgICAgICAgIHggKz0gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKVxuXG4gICAgICAgIHZhciB0eCA9IHhcbiAgICAgICAgaWYgKGFsaWduID09PSBBTElHTl9DRU5URVIpIFxuICAgICAgICAgIHR4ICs9IChtYXhMaW5lV2lkdGgtbGluZVdpZHRoKS8yXG4gICAgICAgIGVsc2UgaWYgKGFsaWduID09PSBBTElHTl9SSUdIVClcbiAgICAgICAgICB0eCArPSAobWF4TGluZVdpZHRoLWxpbmVXaWR0aClcblxuICAgICAgICBnbHlwaHMucHVzaCh7XG4gICAgICAgICAgcG9zaXRpb246IFt0eCwgeV0sXG4gICAgICAgICAgZGF0YTogZ2x5cGgsXG4gICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgbGluZTogbGluZUluZGV4XG4gICAgICAgIH0pICBcblxuICAgICAgICAvL21vdmUgcGVuIGZvcndhcmRcbiAgICAgICAgeCArPSBnbHlwaC54YWR2YW5jZSArIGxldHRlclNwYWNpbmdcbiAgICAgICAgbGFzdEdseXBoID0gZ2x5cGhcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL25leHQgbGluZSBkb3duXG4gICAgeSArPSBsaW5lSGVpZ2h0XG4gICAgeCA9IDBcbiAgfSlcbiAgdGhpcy5fbGluZXNUb3RhbCA9IGxpbmVzLmxlbmd0aDtcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuX3NldHVwU3BhY2VHbHlwaHMgPSBmdW5jdGlvbihmb250KSB7XG4gIC8vVGhlc2UgYXJlIGZhbGxiYWNrcywgd2hlbiB0aGUgZm9udCBkb2Vzbid0IGluY2x1ZGVcbiAgLy8nICcgb3IgJ1xcdCcgZ2x5cGhzXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IG51bGxcbiAgdGhpcy5fZmFsbGJhY2tUYWJHbHlwaCA9IG51bGxcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuXG5cbiAgLy90cnkgdG8gZ2V0IHNwYWNlIGdseXBoXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlICdtJyBvciAndycgZ2x5cGhzXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlIGZpcnN0IGdseXBoIGF2YWlsYWJsZVxuICB2YXIgc3BhY2UgPSBnZXRHbHlwaEJ5SWQoZm9udCwgU1BBQ0VfSUQpIFxuICAgICAgICAgIHx8IGdldE1HbHlwaChmb250KSBcbiAgICAgICAgICB8fCBmb250LmNoYXJzWzBdXG5cbiAgLy9hbmQgY3JlYXRlIGEgZmFsbGJhY2sgZm9yIHRhYlxuICB2YXIgdGFiV2lkdGggPSB0aGlzLl9vcHQudGFiU2l6ZSAqIHNwYWNlLnhhZHZhbmNlXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IHNwYWNlXG4gIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGggPSB4dGVuZChzcGFjZSwge1xuICAgIHg6IDAsIHk6IDAsIHhhZHZhbmNlOiB0YWJXaWR0aCwgaWQ6IFRBQl9JRCwgXG4gICAgeG9mZnNldDogMCwgeW9mZnNldDogMCwgd2lkdGg6IDAsIGhlaWdodDogMFxuICB9KVxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5nZXRHbHlwaCA9IGZ1bmN0aW9uKGZvbnQsIGlkKSB7XG4gIHZhciBnbHlwaCA9IGdldEdseXBoQnlJZChmb250LCBpZClcbiAgaWYgKGdseXBoKVxuICAgIHJldHVybiBnbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gVEFCX0lEKSBcbiAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tUYWJHbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gU1BBQ0VfSUQpIFxuICAgIHJldHVybiB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGhcbiAgcmV0dXJuIG51bGxcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuY29tcHV0ZU1ldHJpY3MgPSBmdW5jdGlvbih0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICB2YXIgbGV0dGVyU3BhY2luZyA9IHRoaXMuX29wdC5sZXR0ZXJTcGFjaW5nIHx8IDBcbiAgdmFyIGZvbnQgPSB0aGlzLl9vcHQuZm9udFxuICB2YXIgY3VyUGVuID0gMFxuICB2YXIgY3VyV2lkdGggPSAwXG4gIHZhciBjb3VudCA9IDBcbiAgdmFyIGdseXBoXG4gIHZhciBsYXN0R2x5cGhcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgZW5kOiBzdGFydCxcbiAgICAgIHdpZHRoOiAwXG4gICAgfVxuICB9XG5cbiAgZW5kID0gTWF0aC5taW4odGV4dC5sZW5ndGgsIGVuZClcbiAgZm9yICh2YXIgaT1zdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgdmFyIGdseXBoID0gdGhpcy5nZXRHbHlwaChmb250LCBpZClcblxuICAgIGlmIChnbHlwaCkge1xuICAgICAgLy9tb3ZlIHBlbiBmb3J3YXJkXG4gICAgICB2YXIgeG9mZiA9IGdseXBoLnhvZmZzZXRcbiAgICAgIHZhciBrZXJuID0gbGFzdEdseXBoID8gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKSA6IDBcbiAgICAgIGN1clBlbiArPSBrZXJuXG5cbiAgICAgIHZhciBuZXh0UGVuID0gY3VyUGVuICsgZ2x5cGgueGFkdmFuY2UgKyBsZXR0ZXJTcGFjaW5nXG4gICAgICB2YXIgbmV4dFdpZHRoID0gY3VyUGVuICsgZ2x5cGgud2lkdGhcblxuICAgICAgLy93ZSd2ZSBoaXQgb3VyIGxpbWl0OyB3ZSBjYW4ndCBtb3ZlIG9udG8gdGhlIG5leHQgZ2x5cGhcbiAgICAgIGlmIChuZXh0V2lkdGggPj0gd2lkdGggfHwgbmV4dFBlbiA+PSB3aWR0aClcbiAgICAgICAgYnJlYWtcblxuICAgICAgLy9vdGhlcndpc2UgY29udGludWUgYWxvbmcgb3VyIGxpbmVcbiAgICAgIGN1clBlbiA9IG5leHRQZW5cbiAgICAgIGN1cldpZHRoID0gbmV4dFdpZHRoXG4gICAgICBsYXN0R2x5cGggPSBnbHlwaFxuICAgIH1cbiAgICBjb3VudCsrXG4gIH1cbiAgXG4gIC8vbWFrZSBzdXJlIHJpZ2h0bW9zdCBlZGdlIGxpbmVzIHVwIHdpdGggcmVuZGVyZWQgZ2x5cGhzXG4gIGlmIChsYXN0R2x5cGgpXG4gICAgY3VyV2lkdGggKz0gbGFzdEdseXBoLnhvZmZzZXRcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBlbmQ6IHN0YXJ0ICsgY291bnQsXG4gICAgd2lkdGg6IGN1cldpZHRoXG4gIH1cbn1cblxuLy9nZXR0ZXJzIGZvciB0aGUgcHJpdmF0ZSB2YXJzXG47Wyd3aWR0aCcsICdoZWlnaHQnLCBcbiAgJ2Rlc2NlbmRlcicsICdhc2NlbmRlcicsXG4gICd4SGVpZ2h0JywgJ2Jhc2VsaW5lJyxcbiAgJ2NhcEhlaWdodCcsXG4gICdsaW5lSGVpZ2h0JyBdLmZvckVhY2goYWRkR2V0dGVyKVxuXG5mdW5jdGlvbiBhZGRHZXR0ZXIobmFtZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dExheW91dC5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICBnZXQ6IHdyYXBwZXIobmFtZSksXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG59XG5cbi8vY3JlYXRlIGxvb2t1cHMgZm9yIHByaXZhdGUgdmFyc1xuZnVuY3Rpb24gd3JhcHBlcihuYW1lKSB7XG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKFtcbiAgICAncmV0dXJuIGZ1bmN0aW9uICcrbmFtZSsnKCkgeycsXG4gICAgJyAgcmV0dXJuIHRoaXMuXycrbmFtZSxcbiAgICAnfSdcbiAgXS5qb2luKCdcXG4nKSkpKClcbn1cblxuZnVuY3Rpb24gZ2V0R2x5cGhCeUlkKGZvbnQsIGlkKSB7XG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gbnVsbFxuXG4gIHZhciBnbHlwaElkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICBpZiAoZ2x5cGhJZHggPj0gMClcbiAgICByZXR1cm4gZm9udC5jaGFyc1tnbHlwaElkeF1cbiAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gZ2V0WEhlaWdodChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxYX0hFSUdIVFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBYX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRNR2x5cGgoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8TV9XSURUSFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBNX1dJRFRIU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdXG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0Q2FwSGVpZ2h0KGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPENBUF9IRUlHSFRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gQ0FQX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRLZXJuaW5nKGZvbnQsIGxlZnQsIHJpZ2h0KSB7XG4gIGlmICghZm9udC5rZXJuaW5ncyB8fCBmb250Lmtlcm5pbmdzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gMFxuXG4gIHZhciB0YWJsZSA9IGZvbnQua2VybmluZ3NcbiAgZm9yICh2YXIgaT0wOyBpPHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtlcm4gPSB0YWJsZVtpXVxuICAgIGlmIChrZXJuLmZpcnN0ID09PSBsZWZ0ICYmIGtlcm4uc2Vjb25kID09PSByaWdodClcbiAgICAgIHJldHVybiBrZXJuLmFtb3VudFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldEFsaWduVHlwZShhbGlnbikge1xuICBpZiAoYWxpZ24gPT09ICdjZW50ZXInKVxuICAgIHJldHVybiBBTElHTl9DRU5URVJcbiAgZWxzZSBpZiAoYWxpZ24gPT09ICdyaWdodCcpXG4gICAgcmV0dXJuIEFMSUdOX1JJR0hUXG4gIHJldHVybiBBTElHTl9MRUZUXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBudW10eXBlKG51bSwgZGVmKSB7XG5cdHJldHVybiB0eXBlb2YgbnVtID09PSAnbnVtYmVyJ1xuXHRcdD8gbnVtIFxuXHRcdDogKHR5cGVvZiBkZWYgPT09ICdudW1iZXInID8gZGVmIDogMClcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBpbGUocHJvcGVydHkpIHtcblx0aWYgKCFwcm9wZXJ0eSB8fCB0eXBlb2YgcHJvcGVydHkgIT09ICdzdHJpbmcnKVxuXHRcdHRocm93IG5ldyBFcnJvcignbXVzdCBzcGVjaWZ5IHByb3BlcnR5IGZvciBpbmRleG9mIHNlYXJjaCcpXG5cblx0cmV0dXJuIG5ldyBGdW5jdGlvbignYXJyYXknLCAndmFsdWUnLCAnc3RhcnQnLCBbXG5cdFx0J3N0YXJ0ID0gc3RhcnQgfHwgMCcsXG5cdFx0J2ZvciAodmFyIGk9c3RhcnQ7IGk8YXJyYXkubGVuZ3RoOyBpKyspJyxcblx0XHQnICBpZiAoYXJyYXlbaV1bXCInICsgcHJvcGVydHkgKydcIl0gPT09IHZhbHVlKScsXG5cdFx0JyAgICAgIHJldHVybiBpJyxcblx0XHQncmV0dXJuIC0xJ1xuXHRdLmpvaW4oJ1xcbicpKVxufSIsInZhciBuZXdsaW5lID0gL1xcbi9cbnZhciBuZXdsaW5lQ2hhciA9ICdcXG4nXG52YXIgd2hpdGVzcGFjZSA9IC9cXHMvXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XG4gICAgdmFyIGxpbmVzID0gbW9kdWxlLmV4cG9ydHMubGluZXModGV4dCwgb3B0KVxuICAgIHJldHVybiBsaW5lcy5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICByZXR1cm4gdGV4dC5zdWJzdHJpbmcobGluZS5zdGFydCwgbGluZS5lbmQpXG4gICAgfSkuam9pbignXFxuJylcbn1cblxubW9kdWxlLmV4cG9ydHMubGluZXMgPSBmdW5jdGlvbiB3b3Jkd3JhcCh0ZXh0LCBvcHQpIHtcbiAgICBvcHQgPSBvcHR8fHt9XG5cbiAgICAvL3plcm8gd2lkdGggcmVzdWx0cyBpbiBub3RoaW5nIHZpc2libGVcbiAgICBpZiAob3B0LndpZHRoID09PSAwICYmIG9wdC5tb2RlICE9PSAnbm93cmFwJykgXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgdGV4dCA9IHRleHR8fCcnXG4gICAgdmFyIHdpZHRoID0gdHlwZW9mIG9wdC53aWR0aCA9PT0gJ251bWJlcicgPyBvcHQud2lkdGggOiBOdW1iZXIuTUFYX1ZBTFVFXG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5tYXgoMCwgb3B0LnN0YXJ0fHwwKVxuICAgIHZhciBlbmQgPSB0eXBlb2Ygb3B0LmVuZCA9PT0gJ251bWJlcicgPyBvcHQuZW5kIDogdGV4dC5sZW5ndGhcbiAgICB2YXIgbW9kZSA9IG9wdC5tb2RlXG5cbiAgICB2YXIgbWVhc3VyZSA9IG9wdC5tZWFzdXJlIHx8IG1vbm9zcGFjZVxuICAgIGlmIChtb2RlID09PSAncHJlJylcbiAgICAgICAgcmV0dXJuIHByZShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aClcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBncmVlZHkobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgsIG1vZGUpXG59XG5cbmZ1bmN0aW9uIGlkeE9mKHRleHQsIGNociwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBpZHggPSB0ZXh0LmluZGV4T2YoY2hyLCBzdGFydClcbiAgICBpZiAoaWR4ID09PSAtMSB8fCBpZHggPiBlbmQpXG4gICAgICAgIHJldHVybiBlbmRcbiAgICByZXR1cm4gaWR4XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjaHIpIHtcbiAgICByZXR1cm4gd2hpdGVzcGFjZS50ZXN0KGNocilcbn1cblxuZnVuY3Rpb24gcHJlKG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGxpbmVzID0gW11cbiAgICB2YXIgbGluZVN0YXJ0ID0gc3RhcnRcbiAgICBmb3IgKHZhciBpPXN0YXJ0OyBpPGVuZCAmJiBpPHRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNociA9IHRleHQuY2hhckF0KGkpXG4gICAgICAgIHZhciBpc05ld2xpbmUgPSBuZXdsaW5lLnRlc3QoY2hyKVxuXG4gICAgICAgIC8vSWYgd2UndmUgcmVhY2hlZCBhIG5ld2xpbmUsIHRoZW4gc3RlcCBkb3duIGEgbGluZVxuICAgICAgICAvL09yIGlmIHdlJ3ZlIHJlYWNoZWQgdGhlIEVPRlxuICAgICAgICBpZiAoaXNOZXdsaW5lIHx8IGk9PT1lbmQtMSkge1xuICAgICAgICAgICAgdmFyIGxpbmVFbmQgPSBpc05ld2xpbmUgPyBpIDogaSsxXG4gICAgICAgICAgICB2YXIgbWVhc3VyZWQgPSBtZWFzdXJlKHRleHQsIGxpbmVTdGFydCwgbGluZUVuZCwgd2lkdGgpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKG1lYXN1cmVkKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsaW5lU3RhcnQgPSBpKzFcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGluZXNcbn1cblxuZnVuY3Rpb24gZ3JlZWR5KG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoLCBtb2RlKSB7XG4gICAgLy9BIGdyZWVkeSB3b3JkIHdyYXBwZXIgYmFzZWQgb24gTGliR0RYIGFsZ29yaXRobVxuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2xpYmdkeC9saWJnZHgvYmxvYi9tYXN0ZXIvZ2R4L3NyYy9jb20vYmFkbG9naWMvZ2R4L2dyYXBoaWNzL2cyZC9CaXRtYXBGb250Q2FjaGUuamF2YVxuICAgIHZhciBsaW5lcyA9IFtdXG5cbiAgICB2YXIgdGVzdFdpZHRoID0gd2lkdGhcbiAgICAvL2lmICdub3dyYXAnIGlzIHNwZWNpZmllZCwgd2Ugb25seSB3cmFwIG9uIG5ld2xpbmUgY2hhcnNcbiAgICBpZiAobW9kZSA9PT0gJ25vd3JhcCcpXG4gICAgICAgIHRlc3RXaWR0aCA9IE51bWJlci5NQVhfVkFMVUVcblxuICAgIHdoaWxlIChzdGFydCA8IGVuZCAmJiBzdGFydCA8IHRleHQubGVuZ3RoKSB7XG4gICAgICAgIC8vZ2V0IG5leHQgbmV3bGluZSBwb3NpdGlvblxuICAgICAgICB2YXIgbmV3TGluZSA9IGlkeE9mKHRleHQsIG5ld2xpbmVDaGFyLCBzdGFydCwgZW5kKVxuXG4gICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgc3RhcnQgb2YgbGluZVxuICAgICAgICB3aGlsZSAoc3RhcnQgPCBuZXdMaW5lKSB7XG4gICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZSggdGV4dC5jaGFyQXQoc3RhcnQpICkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIHN0YXJ0KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZGV0ZXJtaW5lIHZpc2libGUgIyBvZiBnbHlwaHMgZm9yIHRoZSBhdmFpbGFibGUgd2lkdGhcbiAgICAgICAgdmFyIG1lYXN1cmVkID0gbWVhc3VyZSh0ZXh0LCBzdGFydCwgbmV3TGluZSwgdGVzdFdpZHRoKVxuXG4gICAgICAgIHZhciBsaW5lRW5kID0gc3RhcnQgKyAobWVhc3VyZWQuZW5kLW1lYXN1cmVkLnN0YXJ0KVxuICAgICAgICB2YXIgbmV4dFN0YXJ0ID0gbGluZUVuZCArIG5ld2xpbmVDaGFyLmxlbmd0aFxuXG4gICAgICAgIC8vaWYgd2UgaGFkIHRvIGN1dCB0aGUgbGluZSBiZWZvcmUgdGhlIG5leHQgbmV3bGluZS4uLlxuICAgICAgICBpZiAobGluZUVuZCA8IG5ld0xpbmUpIHtcbiAgICAgICAgICAgIC8vZmluZCBjaGFyIHRvIGJyZWFrIG9uXG4gICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzV2hpdGVzcGFjZSh0ZXh0LmNoYXJBdChsaW5lRW5kKSkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgbGluZUVuZC0tXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGluZUVuZCA9PT0gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFN0YXJ0ID4gc3RhcnQgKyBuZXdsaW5lQ2hhci5sZW5ndGgpIG5leHRTdGFydC0tXG4gICAgICAgICAgICAgICAgbGluZUVuZCA9IG5leHRTdGFydCAvLyBJZiBubyBjaGFyYWN0ZXJzIHRvIGJyZWFrLCBzaG93IGFsbC5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dFN0YXJ0ID0gbGluZUVuZFxuICAgICAgICAgICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgZW5kIG9mIGxpbmVcbiAgICAgICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNXaGl0ZXNwYWNlKHRleHQuY2hhckF0KGxpbmVFbmQgLSBuZXdsaW5lQ2hhci5sZW5ndGgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGxpbmVFbmQtLVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobGluZUVuZCA+PSBzdGFydCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1lYXN1cmUodGV4dCwgc3RhcnQsIGxpbmVFbmQsIHRlc3RXaWR0aClcbiAgICAgICAgICAgIGxpbmVzLnB1c2gocmVzdWx0KVxuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ID0gbmV4dFN0YXJ0XG4gICAgfVxuICAgIHJldHVybiBsaW5lc1xufVxuXG4vL2RldGVybWluZXMgdGhlIHZpc2libGUgbnVtYmVyIG9mIGdseXBocyB3aXRoaW4gYSBnaXZlbiB3aWR0aFxuZnVuY3Rpb24gbW9ub3NwYWNlKHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGdseXBocyA9IE1hdGgubWluKHdpZHRoLCBlbmQtc3RhcnQpXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICBlbmQ6IHN0YXJ0K2dseXBoc1xuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIiwidmFyIGR0eXBlID0gcmVxdWlyZSgnZHR5cGUnKVxudmFyIGFuQXJyYXkgPSByZXF1aXJlKCdhbi1hcnJheScpXG52YXIgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKVxuXG52YXIgQ1cgPSBbMCwgMiwgM11cbnZhciBDQ1cgPSBbMiwgMSwgM11cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVRdWFkRWxlbWVudHMoYXJyYXksIG9wdCkge1xuICAgIC8vaWYgdXNlciBkaWRuJ3Qgc3BlY2lmeSBhbiBvdXRwdXQgYXJyYXlcbiAgICBpZiAoIWFycmF5IHx8ICEoYW5BcnJheShhcnJheSkgfHwgaXNCdWZmZXIoYXJyYXkpKSkge1xuICAgICAgICBvcHQgPSBhcnJheSB8fCB7fVxuICAgICAgICBhcnJheSA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdCA9PT0gJ251bWJlcicpIC8vYmFja3dhcmRzLWNvbXBhdGlibGVcbiAgICAgICAgb3B0ID0geyBjb3VudDogb3B0IH1cbiAgICBlbHNlXG4gICAgICAgIG9wdCA9IG9wdCB8fCB7fVxuXG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb3B0LnR5cGUgPT09ICdzdHJpbmcnID8gb3B0LnR5cGUgOiAndWludDE2J1xuICAgIHZhciBjb3VudCA9IHR5cGVvZiBvcHQuY291bnQgPT09ICdudW1iZXInID8gb3B0LmNvdW50IDogMVxuICAgIHZhciBzdGFydCA9IChvcHQuc3RhcnQgfHwgMCkgXG5cbiAgICB2YXIgZGlyID0gb3B0LmNsb2Nrd2lzZSAhPT0gZmFsc2UgPyBDVyA6IENDVyxcbiAgICAgICAgYSA9IGRpclswXSwgXG4gICAgICAgIGIgPSBkaXJbMV0sXG4gICAgICAgIGMgPSBkaXJbMl1cblxuICAgIHZhciBudW1JbmRpY2VzID0gY291bnQgKiA2XG5cbiAgICB2YXIgaW5kaWNlcyA9IGFycmF5IHx8IG5ldyAoZHR5cGUodHlwZSkpKG51bUluZGljZXMpXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAwOyBpIDwgbnVtSW5kaWNlczsgaSArPSA2LCBqICs9IDQpIHtcbiAgICAgICAgdmFyIHggPSBpICsgc3RhcnRcbiAgICAgICAgaW5kaWNlc1t4ICsgMF0gPSBqICsgMFxuICAgICAgICBpbmRpY2VzW3ggKyAxXSA9IGogKyAxXG4gICAgICAgIGluZGljZXNbeCArIDJdID0gaiArIDJcbiAgICAgICAgaW5kaWNlc1t4ICsgM10gPSBqICsgYVxuICAgICAgICBpbmRpY2VzW3ggKyA0XSA9IGogKyBiXG4gICAgICAgIGluZGljZXNbeCArIDVdID0gaiArIGNcbiAgICB9XG4gICAgcmV0dXJuIGluZGljZXNcbn0iLCJ2YXIgc3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuQXJyYXlcblxuZnVuY3Rpb24gYW5BcnJheShhcnIpIHtcbiAgcmV0dXJuIChcbiAgICAgICBhcnIuQllURVNfUEVSX0VMRU1FTlRcbiAgICAmJiBzdHIuY2FsbChhcnIuYnVmZmVyKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJ1xuICAgIHx8IEFycmF5LmlzQXJyYXkoYXJyKVxuICApXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGR0eXBlKSB7XG4gIHN3aXRjaCAoZHR5cGUpIHtcbiAgICBjYXNlICdpbnQ4JzpcbiAgICAgIHJldHVybiBJbnQ4QXJyYXlcbiAgICBjYXNlICdpbnQxNic6XG4gICAgICByZXR1cm4gSW50MTZBcnJheVxuICAgIGNhc2UgJ2ludDMyJzpcbiAgICAgIHJldHVybiBJbnQzMkFycmF5XG4gICAgY2FzZSAndWludDgnOlxuICAgICAgcmV0dXJuIFVpbnQ4QXJyYXlcbiAgICBjYXNlICd1aW50MTYnOlxuICAgICAgcmV0dXJuIFVpbnQxNkFycmF5XG4gICAgY2FzZSAndWludDMyJzpcbiAgICAgIHJldHVybiBVaW50MzJBcnJheVxuICAgIGNhc2UgJ2Zsb2F0MzInOlxuICAgICAgcmV0dXJuIEZsb2F0MzJBcnJheVxuICAgIGNhc2UgJ2Zsb2F0NjQnOlxuICAgICAgcmV0dXJuIEZsb2F0NjRBcnJheVxuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheVxuICAgIGNhc2UgJ3VpbnQ4X2NsYW1wZWQnOlxuICAgICAgcmV0dXJuIFVpbnQ4Q2xhbXBlZEFycmF5XG4gIH1cbn1cbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiIsInZhciBmbGF0dGVuID0gcmVxdWlyZSgnZmxhdHRlbi12ZXJ0ZXgtZGF0YScpXG5cbm1vZHVsZS5leHBvcnRzLmF0dHIgPSBzZXRBdHRyaWJ1dGVcbm1vZHVsZS5leHBvcnRzLmluZGV4ID0gc2V0SW5kZXhcblxuZnVuY3Rpb24gc2V0SW5kZXggKGdlb21ldHJ5LCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBpdGVtU2l6ZSAhPT0gJ251bWJlcicpIGl0ZW1TaXplID0gMVxuICBpZiAodHlwZW9mIGR0eXBlICE9PSAnc3RyaW5nJykgZHR5cGUgPSAndWludDE2J1xuXG4gIHZhciBpc1I2OSA9ICFnZW9tZXRyeS5pbmRleCAmJiB0eXBlb2YgZ2VvbWV0cnkuc2V0SW5kZXggIT09ICdmdW5jdGlvbidcbiAgdmFyIGF0dHJpYiA9IGlzUjY5ID8gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKCdpbmRleCcpIDogZ2VvbWV0cnkuaW5kZXhcbiAgdmFyIG5ld0F0dHJpYiA9IHVwZGF0ZUF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSlcbiAgaWYgKG5ld0F0dHJpYikge1xuICAgIGlmIChpc1I2OSkgZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCdpbmRleCcsIG5ld0F0dHJpYilcbiAgICBlbHNlIGdlb21ldHJ5LmluZGV4ID0gbmV3QXR0cmliXG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0QXR0cmlidXRlIChnZW9tZXRyeSwga2V5LCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBpdGVtU2l6ZSAhPT0gJ251bWJlcicpIGl0ZW1TaXplID0gM1xuICBpZiAodHlwZW9mIGR0eXBlICE9PSAnc3RyaW5nJykgZHR5cGUgPSAnZmxvYXQzMidcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiZcbiAgICBBcnJheS5pc0FycmF5KGRhdGFbMF0pICYmXG4gICAgZGF0YVswXS5sZW5ndGggIT09IGl0ZW1TaXplKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZXN0ZWQgdmVydGV4IGFycmF5IGhhcyB1bmV4cGVjdGVkIHNpemU7IGV4cGVjdGVkICcgK1xuICAgICAgaXRlbVNpemUgKyAnIGJ1dCBmb3VuZCAnICsgZGF0YVswXS5sZW5ndGgpXG4gIH1cblxuICB2YXIgYXR0cmliID0gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKGtleSlcbiAgdmFyIG5ld0F0dHJpYiA9IHVwZGF0ZUF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSlcbiAgaWYgKG5ld0F0dHJpYikge1xuICAgIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZShrZXksIG5ld0F0dHJpYilcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGUgKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGRhdGEgPSBkYXRhIHx8IFtdXG4gIGlmICghYXR0cmliIHx8IHJlYnVpbGRBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSkpIHtcbiAgICAvLyBjcmVhdGUgYSBuZXcgYXJyYXkgd2l0aCBkZXNpcmVkIHR5cGVcbiAgICBkYXRhID0gZmxhdHRlbihkYXRhLCBkdHlwZSlcbiAgICBhdHRyaWIgPSBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKGRhdGEsIGl0ZW1TaXplKVxuICAgIGF0dHJpYi5uZWVkc1VwZGF0ZSA9IHRydWVcbiAgICByZXR1cm4gYXR0cmliXG4gIH0gZWxzZSB7XG4gICAgLy8gY29weSBkYXRhIGludG8gdGhlIGV4aXN0aW5nIGFycmF5XG4gICAgZmxhdHRlbihkYXRhLCBhdHRyaWIuYXJyYXkpXG4gICAgYXR0cmliLm5lZWRzVXBkYXRlID0gdHJ1ZVxuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuLy8gVGVzdCB3aGV0aGVyIHRoZSBhdHRyaWJ1dGUgbmVlZHMgdG8gYmUgcmUtY3JlYXRlZCxcbi8vIHJldHVybnMgZmFsc2UgaWYgd2UgY2FuIHJlLXVzZSBpdCBhcy1pcy5cbmZ1bmN0aW9uIHJlYnVpbGRBdHRyaWJ1dGUgKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUpIHtcbiAgaWYgKGF0dHJpYi5pdGVtU2l6ZSAhPT0gaXRlbVNpemUpIHJldHVybiB0cnVlXG4gIGlmICghYXR0cmliLmFycmF5KSByZXR1cm4gdHJ1ZVxuICB2YXIgYXR0cmliTGVuZ3RoID0gYXR0cmliLmFycmF5Lmxlbmd0aFxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBBcnJheS5pc0FycmF5KGRhdGFbMF0pKSB7XG4gICAgLy8gWyBbIHgsIHksIHogXSBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGggKiBpdGVtU2l6ZVxuICB9IGVsc2Uge1xuICAgIC8vIFsgeCwgeSwgeiBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGhcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cbiIsIi8qZXNsaW50IG5ldy1jYXA6MCovXG52YXIgZHR5cGUgPSByZXF1aXJlKCdkdHlwZScpXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW5WZXJ0ZXhEYXRhXG5mdW5jdGlvbiBmbGF0dGVuVmVydGV4RGF0YSAoZGF0YSwgb3V0cHV0LCBvZmZzZXQpIHtcbiAgaWYgKCFkYXRhKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHNwZWNpZnkgZGF0YSBhcyBmaXJzdCBwYXJhbWV0ZXInKVxuICBvZmZzZXQgPSArKG9mZnNldCB8fCAwKSB8IDBcblxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBBcnJheS5pc0FycmF5KGRhdGFbMF0pKSB7XG4gICAgdmFyIGRpbSA9IGRhdGFbMF0ubGVuZ3RoXG4gICAgdmFyIGxlbmd0aCA9IGRhdGEubGVuZ3RoICogZGltXG5cbiAgICAvLyBubyBvdXRwdXQgc3BlY2lmaWVkLCBjcmVhdGUgYSBuZXcgdHlwZWQgYXJyYXlcbiAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgb3V0cHV0ID0gbmV3IChkdHlwZShvdXRwdXQgfHwgJ2Zsb2F0MzInKSkobGVuZ3RoICsgb2Zmc2V0KVxuICAgIH1cblxuICAgIHZhciBkc3RMZW5ndGggPSBvdXRwdXQubGVuZ3RoIC0gb2Zmc2V0XG4gICAgaWYgKGxlbmd0aCAhPT0gZHN0TGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZSBsZW5ndGggJyArIGxlbmd0aCArICcgKCcgKyBkaW0gKyAneCcgKyBkYXRhLmxlbmd0aCArICcpJyArXG4gICAgICAgICcgZG9lcyBub3QgbWF0Y2ggZGVzdGluYXRpb24gbGVuZ3RoICcgKyBkc3RMZW5ndGgpXG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGsgPSBvZmZzZXQ7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRpbTsgaisrKSB7XG4gICAgICAgIG91dHB1dFtrKytdID0gZGF0YVtpXVtqXVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gbm8gb3V0cHV0LCBjcmVhdGUgYSBuZXcgb25lXG4gICAgICB2YXIgQ3RvciA9IGR0eXBlKG91dHB1dCB8fCAnZmxvYXQzMicpXG4gICAgICBpZiAob2Zmc2V0ID09PSAwKSB7XG4gICAgICAgIG91dHB1dCA9IG5ldyBDdG9yKGRhdGEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQgPSBuZXcgQ3RvcihkYXRhLmxlbmd0aCArIG9mZnNldClcbiAgICAgICAgb3V0cHV0LnNldChkYXRhLCBvZmZzZXQpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHN0b3JlIG91dHB1dCBpbiBleGlzdGluZyBhcnJheVxuICAgICAgb3V0cHV0LnNldChkYXRhLCBvZmZzZXQpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dHB1dFxufVxuIiwidmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVNERlNoYWRlciAob3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fVxuICB2YXIgb3BhY2l0eSA9IHR5cGVvZiBvcHQub3BhY2l0eSA9PT0gJ251bWJlcicgPyBvcHQub3BhY2l0eSA6IDFcbiAgdmFyIGFscGhhVGVzdCA9IHR5cGVvZiBvcHQuYWxwaGFUZXN0ID09PSAnbnVtYmVyJyA/IG9wdC5hbHBoYVRlc3QgOiAwLjAwMDFcbiAgdmFyIHByZWNpc2lvbiA9IG9wdC5wcmVjaXNpb24gfHwgJ2hpZ2hwJ1xuICB2YXIgY29sb3IgPSBvcHQuY29sb3JcbiAgdmFyIG1hcCA9IG9wdC5tYXBcblxuICAvLyByZW1vdmUgdG8gc2F0aXNmeSByNzNcbiAgZGVsZXRlIG9wdC5tYXBcbiAgZGVsZXRlIG9wdC5jb2xvclxuICBkZWxldGUgb3B0LnByZWNpc2lvblxuICBkZWxldGUgb3B0Lm9wYWNpdHlcblxuICByZXR1cm4gYXNzaWduKHtcbiAgICB1bmlmb3Jtczoge1xuICAgICAgb3BhY2l0eTogeyB0eXBlOiAnZicsIHZhbHVlOiBvcGFjaXR5IH0sXG4gICAgICBtYXA6IHsgdHlwZTogJ3QnLCB2YWx1ZTogbWFwIHx8IG5ldyBUSFJFRS5UZXh0dXJlKCkgfSxcbiAgICAgIGNvbG9yOiB7IHR5cGU6ICdjJywgdmFsdWU6IG5ldyBUSFJFRS5Db2xvcihjb2xvcikgfVxuICAgIH0sXG4gICAgdmVydGV4U2hhZGVyOiBbXG4gICAgICAnYXR0cmlidXRlIHZlYzIgdXY7JyxcbiAgICAgICdhdHRyaWJ1dGUgdmVjNCBwb3NpdGlvbjsnLFxuICAgICAgJ3VuaWZvcm0gbWF0NCBwcm9qZWN0aW9uTWF0cml4OycsXG4gICAgICAndW5pZm9ybSBtYXQ0IG1vZGVsVmlld01hdHJpeDsnLFxuICAgICAgJ3ZhcnlpbmcgdmVjMiB2VXY7JyxcbiAgICAgICd2b2lkIG1haW4oKSB7JyxcbiAgICAgICd2VXYgPSB1djsnLFxuICAgICAgJ2dsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHBvc2l0aW9uOycsXG4gICAgICAnfSdcbiAgICBdLmpvaW4oJ1xcbicpLFxuICAgIGZyYWdtZW50U2hhZGVyOiBbXG4gICAgICAnI2lmZGVmIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcycsXG4gICAgICAnI2V4dGVuc2lvbiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMgOiBlbmFibGUnLFxuICAgICAgJyNlbmRpZicsXG4gICAgICAncHJlY2lzaW9uICcgKyBwcmVjaXNpb24gKyAnIGZsb2F0OycsXG4gICAgICAndW5pZm9ybSBmbG9hdCBvcGFjaXR5OycsXG4gICAgICAndW5pZm9ybSB2ZWMzIGNvbG9yOycsXG4gICAgICAndW5pZm9ybSBzYW1wbGVyMkQgbWFwOycsXG4gICAgICAndmFyeWluZyB2ZWMyIHZVdjsnLFxuXG4gICAgICAnZmxvYXQgYWFzdGVwKGZsb2F0IHZhbHVlKSB7JyxcbiAgICAgICcgICNpZmRlZiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgJyAgICBmbG9hdCBhZndpZHRoID0gbGVuZ3RoKHZlYzIoZEZkeCh2YWx1ZSksIGRGZHkodmFsdWUpKSkgKiAwLjcwNzEwNjc4MTE4NjU0NzU3OycsXG4gICAgICAnICAjZWxzZScsXG4gICAgICAnICAgIGZsb2F0IGFmd2lkdGggPSAoMS4wIC8gMzIuMCkgKiAoMS40MTQyMTM1NjIzNzMwOTUxIC8gKDIuMCAqIGdsX0ZyYWdDb29yZC53KSk7JyxcbiAgICAgICcgICNlbmRpZicsXG4gICAgICAnICByZXR1cm4gc21vb3Roc3RlcCgwLjUgLSBhZndpZHRoLCAwLjUgKyBhZndpZHRoLCB2YWx1ZSk7JyxcbiAgICAgICd9JyxcblxuICAgICAgJ3ZvaWQgbWFpbigpIHsnLFxuICAgICAgJyAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRChtYXAsIHZVdik7JyxcbiAgICAgICcgIGZsb2F0IGFscGhhID0gYWFzdGVwKHRleENvbG9yLmEpOycsXG4gICAgICAnICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLCBvcGFjaXR5ICogYWxwaGEpOycsXG4gICAgICBhbHBoYVRlc3QgPT09IDBcbiAgICAgICAgPyAnJ1xuICAgICAgICA6ICcgIGlmIChnbF9GcmFnQ29sb3IuYSA8ICcgKyBhbHBoYVRlc3QgKyAnKSBkaXNjYXJkOycsXG4gICAgICAnfSdcbiAgICBdLmpvaW4oJ1xcbicpXG4gIH0sIG9wdClcbn1cbiJdfQ==
