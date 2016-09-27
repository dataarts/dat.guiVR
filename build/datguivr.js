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

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    object[propertyName]();

    p.locked = true;
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

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    state.value = !state.value;

    object[propertyName] = state.value;

    if (onChangedCB) {
      onChangedCB(state.value);
    }

    p.locked = true;
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
      labelInteraction.events.on('onPressed', function (p) {
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

        p.locked = true;
      });
    } else {
      labelInteraction.events.on('onPressed', function (p) {
        if (state.open === false) {
          openOptions();
          state.open = true;
        } else {
          collapseOptions();
          state.open = false;
        }

        p.locked = true;
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

  group.beingMoved = false;

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

  function handleOnPress(p) {
    var inputObject = p.inputObject;
    var input = p.input;


    var folder = group.folder;
    if (folder === undefined) {
      return;
    }

    if (folder.beingMoved === true) {
      return;
    }

    tempMatrix.getInverse(inputObject.matrixWorld);

    folder.matrix.premultiply(tempMatrix);
    folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);

    oldParent = folder.parent;
    inputObject.add(folder);

    p.locked = true;

    folder.beingMoved = true;

    input.events.emit('grabbed', input);
  }

  function handleOnRelease() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var inputObject = _ref2.inputObject;
    var input = _ref2.input;

    var folder = group.folder;
    if (folder === undefined) {
      return;
    }

    if (oldParent === undefined) {
      return;
    }

    if (folder.beingMoved === false) {
      return;
    }

    folder.matrix.premultiply(inputObject.matrixWorld);
    folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);
    oldParent.add(folder);
    oldParent = undefined;

    folder.beingMoved = false;

    input.events.emit('grabReleased', input);
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
  function vibrate(t, a) {
    if (gamepad && gamepad.haptics.length > 0) {
      gamepad.haptics[0].vibrate(t, a);
    }
  }

  function hapticsTap() {
    setIntervalTimes(function (x, t, a) {
      return vibrate(1 - a, 0.5);
    }, 10, 20);
  }

  function hapticsEcho() {
    setIntervalTimes(function (x, t, a) {
      return vibrate(4, 1.0 * (1 - a));
    }, 100, 4);
  }

  input.events.on('onControllerHeld', function (input) {
    vibrate(0.3, 0.3);
  });

  input.events.on('grabbed', function () {
    hapticsTap();
  });

  input.events.on('grabReleased', function () {
    hapticsEcho();
  });

  input.events.on('pinned', function () {
    hapticsTap();
  });

  input.events.on('pinReleased', function () {
    hapticsEcho();
  });
}

function setIntervalTimes(cb, delay, times) {
  var x = 0;
  var id = setInterval(function () {
    cb(x, times, x / times);
    x++;
    if (x >= times) {
      clearInterval(id);
    }
  }, delay);
  return id;
}

},{"./button":1,"./checkbox":2,"./dropdown":4,"./folder":5,"./font":6,"./sdftext":12,"./slider":14,"events":20}],9:[function(require,module,exports){
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


    //  hovering and button down but no interactions active yet
    if (hover && input[buttonName] === true && input.interaction[interactionName] === undefined) {

      var payload = {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object,
        locked: false
      };
      events.emit(downName, payload);

      if (payload.locked) {
        input.interaction[interactionName] = interaction;
      }

      anyPressing = true;
      anyActive = true;
    }

    //  button still down and this is the active interaction
    if (input[buttonName] && input.interaction[interactionName] === interaction) {
      var _payload = {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object,
        locked: false
      };

      events.emit(holdName, _payload);

      anyPressing = true;

      input.events.emit('onControllerHeld');
    }

    //  button not down and this is the active interaction
    if (input[buttonName] === false && input.interaction[interactionName] === interaction) {
      input.interaction[interactionName] = undefined;
      events.emit(upName, {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object
      });
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

},{"events":20}],10:[function(require,module,exports){
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

    function handleOnGrip(p) {
        var inputObject = p.inputObject;
        var input = p.input;


        var folder = group.folder;
        if (folder === undefined) {
            return;
        }

        if (folder.beingMoved === true) {
            return;
        }

        oldPosition.copy(folder.position);
        oldRotation.copy(folder.rotation);

        folder.position.set(0, 0, 0);
        folder.rotation.set(0, 0, 0);
        folder.rotation.x = -Math.PI * 0.5;

        oldParent = folder.parent;

        rotationGroup.add(folder);

        inputObject.add(rotationGroup);

        p.locked = true;

        folder.beingMoved = true;

        input.events.emit('pinned', input);
    }

    function handleOnGripRelease() {
        var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var inputObject = _ref2.inputObject;
        var input = _ref2.input;


        var folder = group.folder;
        if (folder === undefined) {
            return;
        }

        if (oldParent === undefined) {
            return;
        }

        if (folder.beingMoved === false) {
            return;
        }

        oldParent.add(folder);
        oldParent = undefined;

        folder.position.copy(oldPosition);
        folder.rotation.copy(oldRotation);

        folder.beingMoved = false;

        input.events.emit('pinReleased', input);
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

},{"./font":6,"parse-bmfont-ascii":26,"three-bmfont-text":28,"three-bmfont-text/shaders/sdf":31}],13:[function(require,module,exports){
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
    useStep: false,
    precision: 1,
    listen: false,
    min: min,
    max: max,
    onChangedCB: undefined,
    onFinishedChange: undefined,
    pressing: false
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
    if (state.useStep) {
      valueLabel.update(roundToDecimal(state.value, state.precision).toString());
    } else {
      valueLabel.update(state.value.toString());
    }
  }

  function updateView() {
    if (state.pressing) {
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
    alpha = getClampedAlpha(alpha);
    filledVolume.scale.x = Math.max(alpha * width, 0.000001);
  }

  function updateObject(value) {
    object[propertyName] = value;
  }

  function updateStateFromAlpha(alpha) {
    state.alpha = getClampedAlpha(alpha);
    state.value = getValueFromAlpha(state.alpha, state.min, state.max);
    if (state.useStep) {
      state.value = getSteppedValue(state.value, state.step);
    }
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
    state.useStep = true;
    return group;
  };

  group.listen = function () {
    state.listen = true;
    return group;
  };

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handlePress);
  interaction.events.on('pressing', handleHold);
  interaction.events.on('onReleased', handleRelease);

  function handlePress(p) {
    if (group.visible === false) {
      return;
    }
    state.pressing = true;
    p.locked = true;
  }

  function handleHold() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var point = _ref2.point;

    if (group.visible === false) {
      return;
    }

    state.pressing = true;

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

  function handleRelease() {
    state.pressing = false;
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
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],17:[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{"dtype":18}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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
},{"as-number":17,"indexof-property":21,"word-wrapper":33,"xtend":34}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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
},{"an-array":16,"dtype":18,"is-buffer":23}],28:[function(require,module,exports){
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

},{"./lib/utils":29,"./lib/vertices":30,"inherits":22,"layout-bmfont-text":24,"object-assign":25,"quad-indices":27,"three-buffer-vertex-data":32}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{"object-assign":25}],32:[function(require,module,exports){
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

},{"flatten-vertex-data":19}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcYnV0dG9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNoZWNrYm94LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNvbG9ycy5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxkcm9wZG93bi5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxmb2xkZXIuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcZm9udC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxncmFiLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGluZGV4LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGludGVyYWN0aW9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGxheW91dC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxwYWxldHRlLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHNkZnRleHQuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcc2hhcmVkbWF0ZXJpYWxzLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHNsaWRlci5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFx0ZXh0bGFiZWwuanMiLCJub2RlX21vZHVsZXMvYW4tYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXMtbnVtYmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R0eXBlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsYXR0ZW4tdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9pbmRleG9mLXByb3BlcnR5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlLWJtZm9udC1hc2NpaS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbGliL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2xpYi92ZXJ0aWNlcy5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9zaGFkZXJzL3NkZi5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1idWZmZXItdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvd29yZC13cmFwcGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3h0ZW5kL2ltbXV0YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQzBCd0IsYzs7QUFQeEI7Ozs7QUFDQTs7OztBQUNBOztJQUFZLE07O0FBQ1o7O0lBQVksTTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLEk7Ozs7OztBQXhCWjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCZSxTQUFTLGNBQVQsR0FPUDtBQUFBLG1FQUFKLEVBQUk7O0FBQUEsTUFOTixXQU1NLFFBTk4sV0FNTTtBQUFBLE1BTE4sTUFLTSxRQUxOLE1BS007QUFBQSwrQkFKTixZQUlNO0FBQUEsTUFKTixZQUlNLHFDQUpTLFdBSVQ7QUFBQSx3QkFITixLQUdNO0FBQUEsTUFITixLQUdNLDhCQUhFLE9BQU8sV0FHVDtBQUFBLHlCQUZOLE1BRU07QUFBQSxNQUZOLE1BRU0sK0JBRkcsT0FBTyxZQUVWO0FBQUEsd0JBRE4sS0FDTTtBQUFBLE1BRE4sS0FDTSw4QkFERSxPQUFPLFdBQ1Q7OztBQUVOLE1BQU0sZUFBZSxRQUFRLEdBQVIsR0FBYyxPQUFPLFlBQTFDO0FBQ0EsTUFBTSxnQkFBZ0IsU0FBUyxPQUFPLFlBQXRDO0FBQ0EsTUFBTSxlQUFlLEtBQXJCOztBQUVBLE1BQU0sUUFBUSxJQUFJLE1BQU0sS0FBVixFQUFkOztBQUVBLE1BQU0sUUFBUSxPQUFPLFdBQVAsQ0FBb0IsS0FBcEIsRUFBMkIsTUFBM0IsRUFBbUMsS0FBbkMsQ0FBZDtBQUNBLFFBQU0sR0FBTixDQUFXLEtBQVg7O0FBRUE7QUFDQSxNQUFNLE9BQU8sSUFBSSxNQUFNLFdBQVYsQ0FBdUIsWUFBdkIsRUFBcUMsYUFBckMsRUFBb0QsWUFBcEQsQ0FBYjtBQUNBLE9BQUssU0FBTCxDQUFnQixlQUFlLEdBQS9CLEVBQW9DLENBQXBDLEVBQXVDLENBQXZDOztBQUVBO0FBQ0EsTUFBTSxrQkFBa0IsSUFBSSxNQUFNLGlCQUFWLEVBQXhCO0FBQ0Esa0JBQWdCLE9BQWhCLEdBQTBCLEtBQTFCOztBQUVBLE1BQU0sZ0JBQWdCLElBQUksTUFBTSxJQUFWLENBQWdCLEtBQUssS0FBTCxFQUFoQixFQUE4QixlQUE5QixDQUF0QjtBQUNBLGdCQUFjLFFBQWQsQ0FBdUIsQ0FBdkIsR0FBMkIsS0FBM0I7QUFDQSxnQkFBYyxRQUFkLENBQXVCLENBQXZCLEdBQTJCLFFBQVEsR0FBbkM7O0FBRUE7QUFDQSxNQUFNLFVBQVUsSUFBSSxNQUFNLFNBQVYsQ0FBcUIsYUFBckIsQ0FBaEI7QUFDQSxVQUFRLFFBQVIsQ0FBaUIsS0FBakIsQ0FBdUIsTUFBdkIsQ0FBK0IsT0FBTyxhQUF0Qzs7QUFFQTtBQUNBLE1BQU0sV0FBVyxJQUFJLE1BQU0saUJBQVYsQ0FBNEIsRUFBRSxPQUFPLE9BQU8sYUFBaEIsRUFBK0IsVUFBVSxPQUFPLGNBQWhELEVBQTVCLENBQWpCO0FBQ0EsTUFBTSxlQUFlLElBQUksTUFBTSxJQUFWLENBQWdCLEtBQUssS0FBTCxFQUFoQixFQUE4QixRQUE5QixDQUFyQjtBQUNBLGdCQUFjLEdBQWQsQ0FBbUIsWUFBbkI7O0FBR0EsTUFBTSxrQkFBa0IsWUFBWSxNQUFaLENBQW9CLFlBQXBCLENBQXhCO0FBQ0Esa0JBQWdCLFFBQWhCLENBQXlCLENBQXpCLEdBQTZCLE9BQU8sdUJBQXBDO0FBQ0Esa0JBQWdCLFFBQWhCLENBQXlCLENBQXpCLEdBQTZCLEtBQTdCO0FBQ0Esa0JBQWdCLFFBQWhCLENBQXlCLENBQXpCLEdBQTZCLENBQUMsSUFBOUI7O0FBRUEsTUFBTSxlQUFlLE9BQU8scUJBQVAsQ0FBOEIsTUFBOUIsRUFBc0MsT0FBTyxvQkFBN0MsQ0FBckI7QUFDQSxlQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsR0FBMEIsS0FBMUI7O0FBRUEsUUFBTSxHQUFOLENBQVcsZUFBWCxFQUE0QixhQUE1QixFQUEyQyxPQUEzQyxFQUFvRCxZQUFwRDs7QUFFQSxNQUFNLGNBQWMsMkJBQW1CLGFBQW5CLENBQXBCO0FBQ0EsY0FBWSxNQUFaLENBQW1CLEVBQW5CLENBQXVCLFdBQXZCLEVBQW9DLGFBQXBDOztBQUVBOztBQUVBLFdBQVMsYUFBVCxDQUF3QixDQUF4QixFQUEyQjtBQUN6QixRQUFJLE1BQU0sT0FBTixLQUFrQixLQUF0QixFQUE2QjtBQUMzQjtBQUNEOztBQUVELFdBQVEsWUFBUjs7QUFFQSxNQUFFLE1BQUYsR0FBVyxJQUFYO0FBQ0Q7O0FBRUQsV0FBUyxVQUFULEdBQXFCOztBQUVuQixRQUFJLFlBQVksUUFBWixFQUFKLEVBQTRCO0FBQzFCLGVBQVMsS0FBVCxDQUFlLE1BQWYsQ0FBdUIsT0FBTyxlQUE5QjtBQUNBLGVBQVMsUUFBVCxDQUFrQixNQUFsQixDQUEwQixPQUFPLHdCQUFqQztBQUNELEtBSEQsTUFJSTtBQUNGLGVBQVMsUUFBVCxDQUFrQixNQUFsQixDQUEwQixPQUFPLGNBQWpDOztBQUVBLFVBQUksTUFBTSxLQUFWLEVBQWlCO0FBQ2YsaUJBQVMsS0FBVCxDQUFlLE1BQWYsQ0FBdUIsT0FBTyxhQUE5QjtBQUNELE9BRkQsTUFHSTtBQUNGLGlCQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXVCLE9BQU8sY0FBOUI7QUFDRDtBQUNGO0FBRUY7O0FBRUQsUUFBTSxXQUFOLEdBQW9CLFdBQXBCO0FBQ0EsUUFBTSxPQUFOLEdBQWdCLENBQUUsYUFBRixFQUFpQixLQUFqQixDQUFoQjs7QUFFQSxNQUFNLGtCQUFrQixLQUFLLE1BQUwsQ0FBYSxFQUFFLFlBQUYsRUFBUyxZQUFULEVBQWIsQ0FBeEI7O0FBRUEsUUFBTSxNQUFOLEdBQWUsVUFBVSxZQUFWLEVBQXdCO0FBQ3JDLGdCQUFZLE1BQVosQ0FBb0IsWUFBcEI7QUFDQSxvQkFBZ0IsTUFBaEIsQ0FBd0IsWUFBeEI7QUFDQTtBQUNELEdBSkQ7O0FBT0EsU0FBTyxLQUFQO0FBQ0Q7Ozs7Ozs7O2tCQ2pHdUIsYzs7QUFQeEI7Ozs7QUFDQTs7OztBQUNBOztJQUFZLE07O0FBQ1o7O0lBQVksTTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLEk7Ozs7OztBQXhCWjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCZSxTQUFTLGNBQVQsR0FRUDtBQUFBLG1FQUFKLEVBQUk7O0FBQUEsTUFQTixXQU9NLFFBUE4sV0FPTTtBQUFBLE1BTk4sTUFNTSxRQU5OLE1BTU07QUFBQSwrQkFMTixZQUtNO0FBQUEsTUFMTixZQUtNLHFDQUxTLFdBS1Q7QUFBQSwrQkFKTixZQUlNO0FBQUEsTUFKTixZQUlNLHFDQUpTLEtBSVQ7QUFBQSx3QkFITixLQUdNO0FBQUEsTUFITixLQUdNLDhCQUhFLE9BQU8sV0FHVDtBQUFBLHlCQUZOLE1BRU07QUFBQSxNQUZOLE1BRU0sK0JBRkcsT0FBTyxZQUVWO0FBQUEsd0JBRE4sS0FDTTtBQUFBLE1BRE4sS0FDTSw4QkFERSxPQUFPLFdBQ1Q7OztBQUVOLE1BQU0saUJBQWlCLFNBQVMsT0FBTyxZQUF2QztBQUNBLE1BQU0sa0JBQWtCLGNBQXhCO0FBQ0EsTUFBTSxpQkFBaUIsS0FBdkI7O0FBRUEsTUFBTSxpQkFBaUIsS0FBdkI7QUFDQSxNQUFNLGVBQWUsR0FBckI7O0FBRUEsTUFBTSxRQUFRO0FBQ1osV0FBTyxZQURLO0FBRVosWUFBUTtBQUZJLEdBQWQ7O0FBS0EsTUFBTSxRQUFRLElBQUksTUFBTSxLQUFWLEVBQWQ7O0FBRUEsTUFBTSxRQUFRLE9BQU8sV0FBUCxDQUFvQixLQUFwQixFQUEyQixNQUEzQixFQUFtQyxLQUFuQyxDQUFkO0FBQ0EsUUFBTSxHQUFOLENBQVcsS0FBWDs7QUFFQTtBQUNBLE1BQU0sT0FBTyxJQUFJLE1BQU0sV0FBVixDQUF1QixjQUF2QixFQUF1QyxlQUF2QyxFQUF3RCxjQUF4RCxDQUFiO0FBQ0EsT0FBSyxTQUFMLENBQWdCLGlCQUFpQixHQUFqQyxFQUFzQyxDQUF0QyxFQUF5QyxDQUF6Qzs7QUFHQTtBQUNBLE1BQU0sa0JBQWtCLElBQUksTUFBTSxpQkFBVixFQUF4QjtBQUNBLGtCQUFnQixPQUFoQixHQUEwQixLQUExQjs7QUFFQSxNQUFNLGdCQUFnQixJQUFJLE1BQU0sSUFBVixDQUFnQixLQUFLLEtBQUwsRUFBaEIsRUFBOEIsZUFBOUIsQ0FBdEI7QUFDQSxnQkFBYyxRQUFkLENBQXVCLENBQXZCLEdBQTJCLEtBQTNCO0FBQ0EsZ0JBQWMsUUFBZCxDQUF1QixDQUF2QixHQUEyQixRQUFRLEdBQW5DOztBQUVBO0FBQ0EsTUFBTSxVQUFVLElBQUksTUFBTSxTQUFWLENBQXFCLGFBQXJCLENBQWhCO0FBQ0EsVUFBUSxRQUFSLENBQWlCLEtBQWpCLENBQXVCLE1BQXZCLENBQStCLE9BQU8sYUFBdEM7O0FBRUE7QUFDQSxNQUFNLFdBQVcsSUFBSSxNQUFNLGlCQUFWLENBQTRCLEVBQUUsT0FBTyxPQUFPLGFBQWhCLEVBQStCLFVBQVUsT0FBTyxjQUFoRCxFQUE1QixDQUFqQjtBQUNBLE1BQU0sZUFBZSxJQUFJLE1BQU0sSUFBVixDQUFnQixLQUFLLEtBQUwsRUFBaEIsRUFBOEIsUUFBOUIsQ0FBckI7QUFDQSxlQUFhLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBd0IsWUFBeEIsRUFBc0MsWUFBdEMsRUFBbUQsWUFBbkQ7QUFDQSxnQkFBYyxHQUFkLENBQW1CLFlBQW5COztBQUdBLE1BQU0sa0JBQWtCLFlBQVksTUFBWixDQUFvQixZQUFwQixDQUF4QjtBQUNBLGtCQUFnQixRQUFoQixDQUF5QixDQUF6QixHQUE2QixPQUFPLHVCQUFwQztBQUNBLGtCQUFnQixRQUFoQixDQUF5QixDQUF6QixHQUE2QixLQUE3QjtBQUNBLGtCQUFnQixRQUFoQixDQUF5QixDQUF6QixHQUE2QixDQUFDLElBQTlCOztBQUVBLE1BQU0sZUFBZSxPQUFPLHFCQUFQLENBQThCLE1BQTlCLEVBQXNDLE9BQU8sc0JBQTdDLENBQXJCO0FBQ0EsZUFBYSxRQUFiLENBQXNCLENBQXRCLEdBQTBCLEtBQTFCOztBQUVBLFFBQU0sR0FBTixDQUFXLGVBQVgsRUFBNEIsYUFBNUIsRUFBMkMsT0FBM0MsRUFBb0QsWUFBcEQ7O0FBRUE7O0FBRUEsTUFBTSxjQUFjLDJCQUFtQixhQUFuQixDQUFwQjtBQUNBLGNBQVksTUFBWixDQUFtQixFQUFuQixDQUF1QixXQUF2QixFQUFvQyxhQUFwQzs7QUFFQTs7QUFFQSxXQUFTLGFBQVQsQ0FBd0IsQ0FBeEIsRUFBMkI7QUFDekIsUUFBSSxNQUFNLE9BQU4sS0FBa0IsS0FBdEIsRUFBNkI7QUFDM0I7QUFDRDs7QUFFRCxVQUFNLEtBQU4sR0FBYyxDQUFDLE1BQU0sS0FBckI7O0FBRUEsV0FBUSxZQUFSLElBQXlCLE1BQU0sS0FBL0I7O0FBRUEsUUFBSSxXQUFKLEVBQWlCO0FBQ2Ysa0JBQWEsTUFBTSxLQUFuQjtBQUNEOztBQUVELE1BQUUsTUFBRixHQUFXLElBQVg7QUFDRDs7QUFFRCxXQUFTLFVBQVQsR0FBcUI7O0FBRW5CLFFBQUksWUFBWSxRQUFaLEVBQUosRUFBNEI7QUFDMUIsZUFBUyxLQUFULENBQWUsTUFBZixDQUF1QixPQUFPLGVBQTlCO0FBQ0EsZUFBUyxRQUFULENBQWtCLE1BQWxCLENBQTBCLE9BQU8sd0JBQWpDO0FBQ0QsS0FIRCxNQUlJO0FBQ0YsZUFBUyxRQUFULENBQWtCLE1BQWxCLENBQTBCLE9BQU8sY0FBakM7O0FBRUEsVUFBSSxNQUFNLEtBQVYsRUFBaUI7QUFDZixpQkFBUyxLQUFULENBQWUsTUFBZixDQUF1QixPQUFPLGFBQTlCO0FBQ0QsT0FGRCxNQUdJO0FBQ0YsaUJBQVMsS0FBVCxDQUFlLE1BQWYsQ0FBdUIsT0FBTyxjQUE5QjtBQUNEO0FBQ0Y7O0FBRUQsUUFBSSxNQUFNLEtBQVYsRUFBaUI7QUFDZixtQkFBYSxLQUFiLENBQW1CLEdBQW5CLENBQXdCLFlBQXhCLEVBQXNDLFlBQXRDLEVBQW9ELFlBQXBEO0FBQ0QsS0FGRCxNQUdJO0FBQ0YsbUJBQWEsS0FBYixDQUFtQixHQUFuQixDQUF3QixjQUF4QixFQUF3QyxjQUF4QyxFQUF3RCxjQUF4RDtBQUNEO0FBRUY7O0FBRUQsTUFBSSxvQkFBSjtBQUNBLE1BQUkseUJBQUo7O0FBRUEsUUFBTSxRQUFOLEdBQWlCLFVBQVUsUUFBVixFQUFvQjtBQUNuQyxrQkFBYyxRQUFkO0FBQ0EsV0FBTyxLQUFQO0FBQ0QsR0FIRDs7QUFLQSxRQUFNLFdBQU4sR0FBb0IsV0FBcEI7QUFDQSxRQUFNLE9BQU4sR0FBZ0IsQ0FBRSxhQUFGLEVBQWlCLEtBQWpCLENBQWhCOztBQUVBLE1BQU0sa0JBQWtCLEtBQUssTUFBTCxDQUFhLEVBQUUsWUFBRixFQUFTLFlBQVQsRUFBYixDQUF4Qjs7QUFFQSxRQUFNLE1BQU4sR0FBZSxZQUFVO0FBQ3ZCLFVBQU0sTUFBTixHQUFlLElBQWY7QUFDQSxXQUFPLEtBQVA7QUFDRCxHQUhEOztBQUtBLFFBQU0sTUFBTixHQUFlLFVBQVUsWUFBVixFQUF3QjtBQUNyQyxRQUFJLE1BQU0sTUFBVixFQUFrQjtBQUNoQixZQUFNLEtBQU4sR0FBYyxPQUFRLFlBQVIsQ0FBZDtBQUNEO0FBQ0QsZ0JBQVksTUFBWixDQUFvQixZQUFwQjtBQUNBLG9CQUFnQixNQUFoQixDQUF3QixZQUF4QjtBQUNBO0FBQ0QsR0FQRDs7QUFVQSxTQUFPLEtBQVA7QUFDRDs7Ozs7Ozs7UUNsSWUsZ0IsR0FBQSxnQjtBQW5DaEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQk8sSUFBTSx3Q0FBZ0IsUUFBdEI7QUFDQSxJQUFNLDRDQUFrQixRQUF4QjtBQUNBLElBQU0sZ0RBQW9CLFFBQTFCO0FBQ0EsSUFBTSwwQ0FBaUIsUUFBdkI7QUFDQSxJQUFNLDhEQUEyQixRQUFqQztBQUNBLElBQU0sd0NBQWdCLFFBQXRCO0FBQ0EsSUFBTSxzQ0FBZSxRQUFyQjtBQUNBLElBQU0sMENBQWlCLFFBQXZCO0FBQ0EsSUFBTSwwQ0FBaUIsUUFBdkI7QUFDQSxJQUFNLHNEQUF1QixRQUE3QjtBQUNBLElBQU0sMERBQXlCLFFBQS9CO0FBQ0EsSUFBTSxzREFBdUIsUUFBN0I7QUFDQSxJQUFNLGtEQUFxQixRQUEzQjtBQUNBLElBQU0sZ0RBQW9CLFFBQTFCO0FBQ0EsSUFBTSxnREFBb0IsUUFBMUI7O0FBRUEsU0FBUyxnQkFBVCxDQUEyQixRQUEzQixFQUFxQyxLQUFyQyxFQUE0QztBQUNqRCxXQUFTLEtBQVQsQ0FBZSxPQUFmLENBQXdCLFVBQVMsSUFBVCxFQUFjO0FBQ3BDLFNBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBbEI7QUFDRCxHQUZEO0FBR0EsV0FBUyxnQkFBVCxHQUE0QixJQUE1QjtBQUNBLFNBQU8sUUFBUDtBQUNEOzs7Ozs7OztrQkNmdUIsYzs7QUFQeEI7Ozs7QUFDQTs7OztBQUNBOztJQUFZLE07O0FBQ1o7O0lBQVksTTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLEk7Ozs7OztvTUF4Qlo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQmUsU0FBUyxjQUFULEdBU1A7QUFBQSxtRUFBSixFQUFJOztBQUFBLE1BUk4sV0FRTSxRQVJOLFdBUU07QUFBQSxNQVBOLE1BT00sUUFQTixNQU9NO0FBQUEsK0JBTk4sWUFNTTtBQUFBLE1BTk4sWUFNTSxxQ0FOUyxXQU1UO0FBQUEsK0JBTE4sWUFLTTtBQUFBLE1BTE4sWUFLTSxxQ0FMUyxLQUtUO0FBQUEsMEJBSk4sT0FJTTtBQUFBLE1BSk4sT0FJTSxnQ0FKSSxFQUlKO0FBQUEsd0JBSE4sS0FHTTtBQUFBLE1BSE4sS0FHTSw4QkFIRSxPQUFPLFdBR1Q7QUFBQSx5QkFGTixNQUVNO0FBQUEsTUFGTixNQUVNLCtCQUZHLE9BQU8sWUFFVjtBQUFBLHdCQUROLEtBQ007QUFBQSxNQUROLEtBQ00sOEJBREUsT0FBTyxXQUNUOzs7QUFHTixNQUFNLFFBQVE7QUFDWixVQUFNLEtBRE07QUFFWixZQUFRO0FBRkksR0FBZDs7QUFLQSxNQUFNLGlCQUFpQixRQUFRLEdBQVIsR0FBYyxPQUFPLFlBQTVDO0FBQ0EsTUFBTSxrQkFBa0IsU0FBUyxPQUFPLFlBQXhDO0FBQ0EsTUFBTSxpQkFBaUIsS0FBdkI7QUFDQSxNQUFNLHlCQUF5QixTQUFTLE9BQU8sWUFBUCxHQUFzQixHQUE5RDtBQUNBLE1BQU0sa0JBQWtCLE9BQU8sWUFBL0I7O0FBRUEsTUFBTSxRQUFRLElBQUksTUFBTSxLQUFWLEVBQWQ7O0FBRUEsTUFBTSxRQUFRLE9BQU8sV0FBUCxDQUFvQixLQUFwQixFQUEyQixNQUEzQixFQUFtQyxLQUFuQyxDQUFkO0FBQ0EsUUFBTSxHQUFOLENBQVcsS0FBWDs7QUFFQSxRQUFNLE9BQU4sR0FBZ0IsQ0FBRSxLQUFGLENBQWhCOztBQUVBLE1BQU0sb0JBQW9CLEVBQTFCO0FBQ0EsTUFBTSxlQUFlLEVBQXJCOztBQUVBO0FBQ0EsTUFBTSxlQUFlLG1CQUFyQjs7QUFJQSxXQUFTLGlCQUFULEdBQTRCO0FBQzFCLFFBQUksTUFBTSxPQUFOLENBQWUsT0FBZixDQUFKLEVBQThCO0FBQzVCLGFBQU8sUUFBUSxJQUFSLENBQWMsVUFBVSxVQUFWLEVBQXNCO0FBQ3pDLGVBQU8sZUFBZSxPQUFRLFlBQVIsQ0FBdEI7QUFDRCxPQUZNLENBQVA7QUFHRCxLQUpELE1BS0k7QUFDRixhQUFPLE9BQU8sSUFBUCxDQUFZLE9BQVosRUFBcUIsSUFBckIsQ0FBMkIsVUFBVSxVQUFWLEVBQXNCO0FBQ3RELGVBQU8sT0FBTyxZQUFQLE1BQXlCLFFBQVMsVUFBVCxDQUFoQztBQUNELE9BRk0sQ0FBUDtBQUdEO0FBQ0Y7O0FBRUQsV0FBUyxZQUFULENBQXVCLFNBQXZCLEVBQWtDLFFBQWxDLEVBQTRDO0FBQzFDLFFBQU0sUUFBUSx5QkFBaUIsV0FBakIsRUFBOEIsU0FBOUIsRUFBeUMsY0FBekMsRUFBeUQsS0FBekQsRUFBZ0UsT0FBTyxpQkFBdkUsRUFBMEYsT0FBTyxpQkFBakcsQ0FBZDtBQUNBLFVBQU0sT0FBTixDQUFjLElBQWQsQ0FBb0IsTUFBTSxJQUExQjtBQUNBLFFBQU0sbUJBQW1CLDJCQUFtQixNQUFNLElBQXpCLENBQXpCO0FBQ0Esc0JBQWtCLElBQWxCLENBQXdCLGdCQUF4QjtBQUNBLGlCQUFhLElBQWIsQ0FBbUIsS0FBbkI7O0FBR0EsUUFBSSxRQUFKLEVBQWM7QUFDWix1QkFBaUIsTUFBakIsQ0FBd0IsRUFBeEIsQ0FBNEIsV0FBNUIsRUFBeUMsVUFBVSxDQUFWLEVBQWE7QUFDcEQsc0JBQWMsU0FBZCxDQUF5QixTQUF6Qjs7QUFFQSxZQUFJLGtCQUFrQixLQUF0Qjs7QUFFQSxZQUFJLE1BQU0sT0FBTixDQUFlLE9BQWYsQ0FBSixFQUE4QjtBQUM1Qiw0QkFBa0IsT0FBUSxZQUFSLE1BQTJCLFNBQTdDO0FBQ0EsY0FBSSxlQUFKLEVBQXFCO0FBQ25CLG1CQUFRLFlBQVIsSUFBeUIsU0FBekI7QUFDRDtBQUNGLFNBTEQsTUFNSTtBQUNGLDRCQUFrQixPQUFRLFlBQVIsTUFBMkIsUUFBUyxTQUFULENBQTdDO0FBQ0EsY0FBSSxlQUFKLEVBQXFCO0FBQ25CLG1CQUFRLFlBQVIsSUFBeUIsUUFBUyxTQUFULENBQXpCO0FBQ0Q7QUFDRjs7QUFHRDtBQUNBLGNBQU0sSUFBTixHQUFhLEtBQWI7O0FBRUEsWUFBSSxlQUFlLGVBQW5CLEVBQW9DO0FBQ2xDLHNCQUFhLE9BQVEsWUFBUixDQUFiO0FBQ0Q7O0FBRUQsVUFBRSxNQUFGLEdBQVcsSUFBWDtBQUVELE9BNUJEO0FBNkJELEtBOUJELE1BK0JJO0FBQ0YsdUJBQWlCLE1BQWpCLENBQXdCLEVBQXhCLENBQTRCLFdBQTVCLEVBQXlDLFVBQVUsQ0FBVixFQUFhO0FBQ3BELFlBQUksTUFBTSxJQUFOLEtBQWUsS0FBbkIsRUFBMEI7QUFDeEI7QUFDQSxnQkFBTSxJQUFOLEdBQWEsSUFBYjtBQUNELFNBSEQsTUFJSTtBQUNGO0FBQ0EsZ0JBQU0sSUFBTixHQUFhLEtBQWI7QUFDRDs7QUFFRCxVQUFFLE1BQUYsR0FBVyxJQUFYO0FBQ0QsT0FYRDtBQVlEO0FBQ0QsVUFBTSxRQUFOLEdBQWlCLFFBQWpCO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsV0FBUyxlQUFULEdBQTBCO0FBQ3hCLGlCQUFhLE9BQWIsQ0FBc0IsVUFBVSxLQUFWLEVBQWlCO0FBQ3JDLFVBQUksTUFBTSxRQUFWLEVBQW9CO0FBQ2xCLGNBQU0sT0FBTixHQUFnQixLQUFoQjtBQUNBLGNBQU0sSUFBTixDQUFXLE9BQVgsR0FBcUIsS0FBckI7QUFDRDtBQUNGLEtBTEQ7QUFNRDs7QUFFRCxXQUFTLFdBQVQsR0FBc0I7QUFDcEIsaUJBQWEsT0FBYixDQUFzQixVQUFVLEtBQVYsRUFBaUI7QUFDckMsVUFBSSxNQUFNLFFBQVYsRUFBb0I7QUFDbEIsY0FBTSxPQUFOLEdBQWdCLElBQWhCO0FBQ0EsY0FBTSxJQUFOLENBQVcsT0FBWCxHQUFxQixJQUFyQjtBQUNEO0FBQ0YsS0FMRDtBQU1EOztBQUVEO0FBQ0EsTUFBTSxnQkFBZ0IsYUFBYyxZQUFkLEVBQTRCLEtBQTVCLENBQXRCO0FBQ0EsZ0JBQWMsUUFBZCxDQUF1QixDQUF2QixHQUEyQixPQUFPLFlBQVAsR0FBc0IsQ0FBdEIsR0FBMEIsUUFBUSxHQUE3RDtBQUNBLGdCQUFjLFFBQWQsQ0FBdUIsQ0FBdkIsR0FBMkIsS0FBM0I7O0FBRUEsZ0JBQWMsR0FBZCxDQUFtQixTQUFTLGVBQVQsR0FBMEI7QUFDM0MsUUFBTSxJQUFJLEtBQVY7QUFDQSxRQUFNLElBQUksSUFBVjtBQUNBLFFBQU0sS0FBSyxJQUFJLE1BQU0sS0FBVixFQUFYO0FBQ0EsT0FBRyxNQUFILENBQVUsQ0FBVixFQUFZLENBQVo7QUFDQSxPQUFHLE1BQUgsQ0FBVSxDQUFDLENBQVgsRUFBYSxDQUFiO0FBQ0EsT0FBRyxNQUFILENBQVUsQ0FBVixFQUFZLENBQVo7QUFDQSxPQUFHLE1BQUgsQ0FBVSxDQUFWLEVBQVksQ0FBWjs7QUFFQSxRQUFNLE1BQU0sSUFBSSxNQUFNLGFBQVYsQ0FBeUIsRUFBekIsQ0FBWjtBQUNBLFdBQU8sZ0JBQVAsQ0FBeUIsR0FBekIsRUFBOEIsT0FBTyxpQkFBckM7QUFDQSxRQUFJLFNBQUosQ0FBZSxpQkFBaUIsSUFBSSxDQUFwQyxFQUF1QyxDQUFDLGVBQUQsR0FBbUIsR0FBbkIsR0FBeUIsSUFBSSxHQUFwRSxFQUEwRSxRQUFRLElBQWxGOztBQUVBLFdBQU8sSUFBSSxNQUFNLElBQVYsQ0FBZ0IsR0FBaEIsRUFBcUIsZ0JBQWdCLEtBQXJDLENBQVA7QUFDRCxHQWRpQixFQUFsQjs7QUFpQkEsV0FBUyxzQkFBVCxDQUFpQyxLQUFqQyxFQUF3QyxLQUF4QyxFQUErQztBQUM3QyxVQUFNLFFBQU4sQ0FBZSxDQUFmLEdBQW1CLENBQUMsZUFBRCxHQUFtQixDQUFDLFFBQU0sQ0FBUCxJQUFjLHNCQUFwRDtBQUNBLFVBQU0sUUFBTixDQUFlLENBQWYsR0FBbUIsUUFBUSxDQUEzQjtBQUNEOztBQUVELFdBQVMsYUFBVCxDQUF3QixVQUF4QixFQUFvQyxLQUFwQyxFQUEyQztBQUN6QyxRQUFNLGNBQWMsYUFBYyxVQUFkLEVBQTBCLElBQTFCLENBQXBCO0FBQ0EsMkJBQXdCLFdBQXhCLEVBQXFDLEtBQXJDO0FBQ0EsV0FBTyxXQUFQO0FBQ0Q7O0FBRUQsTUFBSSxNQUFNLE9BQU4sQ0FBZSxPQUFmLENBQUosRUFBOEI7QUFDNUIsa0JBQWMsR0FBZCx5Q0FBc0IsUUFBUSxHQUFSLENBQWEsYUFBYixDQUF0QjtBQUNELEdBRkQsTUFHSTtBQUNGLGtCQUFjLEdBQWQseUNBQXNCLE9BQU8sSUFBUCxDQUFZLE9BQVosRUFBcUIsR0FBckIsQ0FBMEIsYUFBMUIsQ0FBdEI7QUFDRDs7QUFHRDs7QUFFQSxNQUFNLGtCQUFrQixZQUFZLE1BQVosQ0FBb0IsWUFBcEIsQ0FBeEI7QUFDQSxrQkFBZ0IsUUFBaEIsQ0FBeUIsQ0FBekIsR0FBNkIsT0FBTyx1QkFBcEM7QUFDQSxrQkFBZ0IsUUFBaEIsQ0FBeUIsQ0FBekIsR0FBNkIsS0FBN0I7QUFDQSxrQkFBZ0IsUUFBaEIsQ0FBeUIsQ0FBekIsR0FBNkIsQ0FBQyxJQUE5Qjs7QUFFQSxNQUFNLGVBQWUsT0FBTyxxQkFBUCxDQUE4QixNQUE5QixFQUFzQyxPQUFPLG9CQUE3QyxDQUFyQjtBQUNBLGVBQWEsUUFBYixDQUFzQixDQUF0QixHQUEwQixLQUExQjs7QUFFQSxRQUFNLEdBQU4sQ0FBVyxlQUFYLEVBQTRCLFlBQTVCLEVBQTBDLGFBQTFDOztBQUdBOztBQUVBLFdBQVMsVUFBVCxHQUFxQjs7QUFFbkIsc0JBQWtCLE9BQWxCLENBQTJCLFVBQVUsV0FBVixFQUF1QixLQUF2QixFQUE4QjtBQUN2RCxVQUFNLFFBQVEsYUFBYyxLQUFkLENBQWQ7QUFDQSxVQUFJLE1BQU0sUUFBVixFQUFvQjtBQUNsQixZQUFJLFlBQVksUUFBWixFQUFKLEVBQTRCO0FBQzFCLGlCQUFPLGdCQUFQLENBQXlCLE1BQU0sSUFBTixDQUFXLFFBQXBDLEVBQThDLE9BQU8sZUFBckQ7QUFDRCxTQUZELE1BR0k7QUFDRixpQkFBTyxnQkFBUCxDQUF5QixNQUFNLElBQU4sQ0FBVyxRQUFwQyxFQUE4QyxPQUFPLGlCQUFyRDtBQUNEO0FBQ0Y7QUFDRixLQVZEO0FBV0Q7O0FBRUQsTUFBSSxvQkFBSjtBQUNBLE1BQUkseUJBQUo7O0FBRUEsUUFBTSxRQUFOLEdBQWlCLFVBQVUsUUFBVixFQUFvQjtBQUNuQyxrQkFBYyxRQUFkO0FBQ0EsV0FBTyxLQUFQO0FBQ0QsR0FIRDs7QUFLQSxNQUFNLGtCQUFrQixLQUFLLE1BQUwsQ0FBYSxFQUFFLFlBQUYsRUFBUyxZQUFULEVBQWIsQ0FBeEI7O0FBRUEsUUFBTSxNQUFOLEdBQWUsWUFBVTtBQUN2QixVQUFNLE1BQU4sR0FBZSxJQUFmO0FBQ0EsV0FBTyxLQUFQO0FBQ0QsR0FIRDs7QUFLQSxRQUFNLE1BQU4sR0FBZSxVQUFVLFlBQVYsRUFBd0I7QUFDckMsUUFBSSxNQUFNLE1BQVYsRUFBa0I7QUFDaEIsb0JBQWMsU0FBZCxDQUF5QixtQkFBekI7QUFDRDtBQUNELHNCQUFrQixPQUFsQixDQUEyQixVQUFVLGdCQUFWLEVBQTRCO0FBQ3JELHVCQUFpQixNQUFqQixDQUF5QixZQUF6QjtBQUNELEtBRkQ7QUFHQSxvQkFBZ0IsTUFBaEIsQ0FBd0IsWUFBeEI7QUFDQTtBQUNELEdBVEQ7O0FBWUEsU0FBTyxLQUFQO0FBQ0Q7Ozs7Ozs7O2tCQ2hPdUIsWTs7QUFSeEI7Ozs7QUFDQTs7OztBQUNBOztJQUFZLE07O0FBQ1o7O0lBQVksTTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLEk7O0FBQ1o7O0lBQVksTzs7Ozs7O0FBRUcsU0FBUyxZQUFULEdBR1A7QUFBQSxtRUFBSixFQUFJOztBQUFBLE1BRk4sV0FFTSxRQUZOLFdBRU07QUFBQSxNQUROLElBQ00sUUFETixJQUNNOzs7QUFFTixNQUFNLFFBQVEsT0FBTyxXQUFyQjs7QUFFQSxNQUFNLHVCQUF1QixPQUFPLFlBQVAsR0FBc0IsT0FBTyxhQUExRDs7QUFFQSxNQUFNLFFBQVE7QUFDWixlQUFXLEtBREM7QUFFWixvQkFBZ0I7QUFGSixHQUFkOztBQUtBLE1BQU0sUUFBUSxJQUFJLE1BQU0sS0FBVixFQUFkO0FBQ0EsTUFBTSxnQkFBZ0IsSUFBSSxNQUFNLEtBQVYsRUFBdEI7QUFDQSxRQUFNLEdBQU4sQ0FBVyxhQUFYOztBQUVBO0FBQ0EsTUFBTSxjQUFjLE1BQU0sS0FBTixDQUFZLFNBQVosQ0FBc0IsR0FBMUM7QUFDQSxjQUFZLElBQVosQ0FBa0IsS0FBbEIsRUFBeUIsYUFBekI7O0FBRUEsTUFBTSxrQkFBa0IseUJBQWlCLFdBQWpCLEVBQThCLE9BQU8sSUFBckMsRUFBMkMsR0FBM0MsQ0FBeEI7QUFDQSxrQkFBZ0IsUUFBaEIsQ0FBeUIsQ0FBekIsR0FBNkIsT0FBTyxZQUFQLEdBQXNCLEdBQW5EOztBQUVBLGNBQVksSUFBWixDQUFrQixLQUFsQixFQUF5QixlQUF6Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxXQUFTLFdBQVQsR0FBc0I7QUFDcEIsVUFBTSxTQUFOLEdBQWtCLENBQUMsTUFBTSxTQUF6QjtBQUNBO0FBQ0Q7O0FBRUQsUUFBTSxHQUFOLEdBQVksWUFBbUI7QUFBQSxzQ0FBTixJQUFNO0FBQU4sVUFBTTtBQUFBOztBQUM3QixTQUFLLE9BQUwsQ0FBYyxVQUFVLEdBQVYsRUFBZTtBQUMzQixVQUFNLFlBQVksSUFBSSxNQUFNLEtBQVYsRUFBbEI7QUFDQSxnQkFBVSxHQUFWLENBQWUsR0FBZjtBQUNBLG9CQUFjLEdBQWQsQ0FBbUIsU0FBbkI7QUFDQSxVQUFJLE1BQUosR0FBYSxLQUFiO0FBQ0QsS0FMRDs7QUFPQTtBQUNELEdBVEQ7O0FBV0EsV0FBUyxhQUFULEdBQXdCO0FBQ3RCLGtCQUFjLFFBQWQsQ0FBdUIsT0FBdkIsQ0FBZ0MsVUFBVSxLQUFWLEVBQWlCLEtBQWpCLEVBQXdCO0FBQ3RELFlBQU0sUUFBTixDQUFlLENBQWYsR0FBbUIsRUFBRSxRQUFNLENBQVIsSUFBYSxvQkFBYixHQUFvQyxPQUFPLFlBQVAsR0FBc0IsR0FBN0U7QUFDQSxVQUFJLE1BQU0sU0FBVixFQUFxQjtBQUNuQixjQUFNLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLE9BQWxCLEdBQTRCLEtBQTVCO0FBQ0QsT0FGRCxNQUdJO0FBQ0YsY0FBTSxRQUFOLENBQWUsQ0FBZixFQUFrQixPQUFsQixHQUE0QixJQUE1QjtBQUNEO0FBQ0YsS0FSRDs7QUFVQSxRQUFJLE1BQU0sU0FBVixFQUFxQjtBQUNuQixzQkFBZ0IsU0FBaEIsQ0FBMkIsT0FBTyxJQUFsQztBQUNELEtBRkQsTUFHSTtBQUNGLHNCQUFnQixTQUFoQixDQUEyQixPQUFPLElBQWxDO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7QUFFRCxXQUFTLFdBQVQsR0FBc0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDRTtBQUNGO0FBQ0Q7O0FBRUQsUUFBTSxNQUFOLEdBQWUsS0FBZjtBQUNBLE1BQU0sa0JBQWtCLEtBQUssTUFBTCxDQUFhLEVBQUUsWUFBRixFQUFTLE9BQU8sZ0JBQWdCLElBQWhDLEVBQWIsQ0FBeEI7QUFDQSxNQUFNLHFCQUFxQixRQUFRLE1BQVIsQ0FBZ0IsRUFBRSxZQUFGLEVBQVMsT0FBTyxnQkFBZ0IsSUFBaEMsRUFBaEIsQ0FBM0I7O0FBRUEsUUFBTSxNQUFOLEdBQWUsVUFBVSxZQUFWLEVBQXdCO0FBQ3JDLG9CQUFnQixNQUFoQixDQUF3QixZQUF4QjtBQUNBLHVCQUFtQixNQUFuQixDQUEyQixZQUEzQjtBQUNBO0FBQ0QsR0FKRDs7QUFNQSxRQUFNLEtBQU4sR0FBYyxVQUFVLFNBQVYsRUFBcUI7QUFDakMsUUFBTSxZQUFZLE1BQU0sTUFBeEI7O0FBRUEsUUFBSSxNQUFNLE1BQVYsRUFBa0I7QUFDaEIsWUFBTSxNQUFOLENBQWEsTUFBYixDQUFxQixLQUFyQjtBQUNEO0FBQ0QsY0FBVSxHQUFWLENBQWUsS0FBZjs7QUFFQSxXQUFPLFNBQVA7QUFDRCxHQVREOztBQVdBLFFBQU0sT0FBTixHQUFnQixDQUFFLGdCQUFnQixJQUFsQixDQUFoQjs7QUFFQSxRQUFNLFVBQU4sR0FBbUIsS0FBbkI7O0FBRUEsU0FBTyxLQUFQO0FBQ0QsQyxDQTdJRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQ21CZ0IsSyxHQUFBLEs7UUFNQSxHLEdBQUEsRztBQXpCaEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQk8sU0FBUyxLQUFULEdBQWdCO0FBQ3JCLE1BQU0sUUFBUSxJQUFJLEtBQUosRUFBZDtBQUNBLFFBQU0sR0FBTjtBQUNBLFNBQU8sS0FBUDtBQUNEOztBQUVNLFNBQVMsR0FBVCxHQUFjO0FBQ25CO0FBdUdEOzs7Ozs7OztRQzVHZSxNLEdBQUEsTTs7QUFGaEI7Ozs7OztBQUVPLFNBQVMsTUFBVCxHQUF3QztBQUFBLG1FQUFKLEVBQUk7O0FBQUEsTUFBckIsS0FBcUIsUUFBckIsS0FBcUI7QUFBQSxNQUFkLEtBQWMsUUFBZCxLQUFjOzs7QUFFN0MsTUFBTSxjQUFjLDJCQUFtQixLQUFuQixDQUFwQjs7QUFFQSxjQUFZLE1BQVosQ0FBbUIsRUFBbkIsQ0FBdUIsV0FBdkIsRUFBb0MsYUFBcEM7QUFDQSxjQUFZLE1BQVosQ0FBbUIsRUFBbkIsQ0FBdUIsWUFBdkIsRUFBcUMsZUFBckM7O0FBRUEsTUFBTSxhQUFhLElBQUksTUFBTSxPQUFWLEVBQW5COztBQUVBLE1BQUksa0JBQUo7O0FBRUEsV0FBUyxhQUFULENBQXdCLENBQXhCLEVBQTJCO0FBQUEsUUFFakIsV0FGaUIsR0FFTSxDQUZOLENBRWpCLFdBRmlCO0FBQUEsUUFFSixLQUZJLEdBRU0sQ0FGTixDQUVKLEtBRkk7OztBQUl6QixRQUFNLFNBQVMsTUFBTSxNQUFyQjtBQUNBLFFBQUksV0FBVyxTQUFmLEVBQTBCO0FBQ3hCO0FBQ0Q7O0FBRUQsUUFBSSxPQUFPLFVBQVAsS0FBc0IsSUFBMUIsRUFBZ0M7QUFDOUI7QUFDRDs7QUFFRCxlQUFXLFVBQVgsQ0FBdUIsWUFBWSxXQUFuQzs7QUFFQSxXQUFPLE1BQVAsQ0FBYyxXQUFkLENBQTJCLFVBQTNCO0FBQ0EsV0FBTyxNQUFQLENBQWMsU0FBZCxDQUF5QixPQUFPLFFBQWhDLEVBQTBDLE9BQU8sVUFBakQsRUFBNkQsT0FBTyxLQUFwRTs7QUFFQSxnQkFBWSxPQUFPLE1BQW5CO0FBQ0EsZ0JBQVksR0FBWixDQUFpQixNQUFqQjs7QUFFQSxNQUFFLE1BQUYsR0FBVyxJQUFYOztBQUVBLFdBQU8sVUFBUCxHQUFvQixJQUFwQjs7QUFFQSxVQUFNLE1BQU4sQ0FBYSxJQUFiLENBQW1CLFNBQW5CLEVBQThCLEtBQTlCO0FBQ0Q7O0FBRUQsV0FBUyxlQUFULEdBQXFEO0FBQUEsc0VBQUosRUFBSTs7QUFBQSxRQUF6QixXQUF5QixTQUF6QixXQUF5QjtBQUFBLFFBQVosS0FBWSxTQUFaLEtBQVk7O0FBQ25ELFFBQU0sU0FBUyxNQUFNLE1BQXJCO0FBQ0EsUUFBSSxXQUFXLFNBQWYsRUFBMEI7QUFDeEI7QUFDRDs7QUFFRCxRQUFJLGNBQWMsU0FBbEIsRUFBNkI7QUFDM0I7QUFDRDs7QUFFRCxRQUFJLE9BQU8sVUFBUCxLQUFzQixLQUExQixFQUFpQztBQUMvQjtBQUNEOztBQUVELFdBQU8sTUFBUCxDQUFjLFdBQWQsQ0FBMkIsWUFBWSxXQUF2QztBQUNBLFdBQU8sTUFBUCxDQUFjLFNBQWQsQ0FBeUIsT0FBTyxRQUFoQyxFQUEwQyxPQUFPLFVBQWpELEVBQTZELE9BQU8sS0FBcEU7QUFDQSxjQUFVLEdBQVYsQ0FBZSxNQUFmO0FBQ0EsZ0JBQVksU0FBWjs7QUFFQSxXQUFPLFVBQVAsR0FBb0IsS0FBcEI7O0FBRUEsVUFBTSxNQUFOLENBQWEsSUFBYixDQUFtQixjQUFuQixFQUFtQyxLQUFuQztBQUNEOztBQUVELFNBQU8sV0FBUDtBQUNELEMsQ0FyRkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JDNEJ3QixROztBQVR4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWSxPOztBQUNaOztJQUFZLEk7Ozs7OztvTUExQlo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QmUsU0FBUyxRQUFULEdBQW1COztBQUVoQzs7O0FBR0EsTUFBTSxjQUFjLFFBQVEsT0FBUixFQUFwQjs7QUFHQTs7Ozs7O0FBTUEsTUFBTSxlQUFlLEVBQXJCO0FBQ0EsTUFBTSxjQUFjLEVBQXBCO0FBQ0EsTUFBTSxpQkFBaUIsRUFBdkI7O0FBRUEsTUFBSSxlQUFlLEtBQW5COztBQUVBLFdBQVMsZUFBVCxDQUEwQixJQUExQixFQUFnQztBQUM5QixtQkFBZSxJQUFmO0FBQ0Q7O0FBS0Q7OztBQUdBLE1BQU0sZ0JBQWdCLElBQUksTUFBTSxpQkFBVixDQUE0QixFQUFDLE9BQU0sUUFBUCxFQUFpQixhQUFhLElBQTlCLEVBQW9DLFVBQVUsTUFBTSxnQkFBcEQsRUFBNUIsQ0FBdEI7QUFDQSxXQUFTLFdBQVQsR0FBc0I7QUFDcEIsUUFBTSxJQUFJLElBQUksTUFBTSxRQUFWLEVBQVY7QUFDQSxNQUFFLFFBQUYsQ0FBVyxJQUFYLENBQWlCLElBQUksTUFBTSxPQUFWLEVBQWpCO0FBQ0EsTUFBRSxRQUFGLENBQVcsSUFBWCxDQUFpQixJQUFJLE1BQU0sT0FBVixDQUFrQixDQUFsQixFQUFvQixDQUFwQixFQUFzQixDQUF0QixDQUFqQjtBQUNBLFdBQU8sSUFBSSxNQUFNLElBQVYsQ0FBZ0IsQ0FBaEIsRUFBbUIsYUFBbkIsQ0FBUDtBQUNEOztBQU1EOzs7QUFHQSxNQUFNLGlCQUFpQixJQUFJLE1BQU0saUJBQVYsQ0FBNEIsRUFBQyxPQUFNLFFBQVAsRUFBaUIsYUFBYSxJQUE5QixFQUFvQyxVQUFVLE1BQU0sZ0JBQXBELEVBQTVCLENBQXZCO0FBQ0EsV0FBUyxZQUFULEdBQXVCO0FBQ3JCLFdBQU8sSUFBSSxNQUFNLElBQVYsQ0FBZ0IsSUFBSSxNQUFNLGNBQVYsQ0FBeUIsS0FBekIsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkMsQ0FBaEIsRUFBd0QsY0FBeEQsQ0FBUDtBQUNEOztBQUtEOzs7Ozs7O0FBUUEsV0FBUyxXQUFULEdBQXVEO0FBQUEsUUFBakMsV0FBaUMseURBQW5CLElBQUksTUFBTSxLQUFWLEVBQW1COztBQUNyRCxXQUFPO0FBQ0wsZUFBUyxJQUFJLE1BQU0sU0FBVixDQUFxQixJQUFJLE1BQU0sT0FBVixFQUFyQixFQUEwQyxJQUFJLE1BQU0sT0FBVixFQUExQyxDQURKO0FBRUwsYUFBTyxhQUZGO0FBR0wsY0FBUSxjQUhIO0FBSUwsY0FBUSxXQUpIO0FBS0wsZUFBUyxLQUxKO0FBTUwsZUFBUyxLQU5KO0FBT0wsY0FBUSxzQkFQSDtBQVFMLG1CQUFhO0FBQ1gsY0FBTSxTQURLO0FBRVgsZUFBTztBQUZJO0FBUlIsS0FBUDtBQWFEOztBQU1EOzs7O0FBSUEsTUFBTSxhQUFhLGtCQUFuQjs7QUFFQSxXQUFTLGdCQUFULEdBQTJCO0FBQ3pCLFFBQU0sUUFBUSxJQUFJLE1BQU0sT0FBVixDQUFrQixDQUFDLENBQW5CLEVBQXFCLENBQUMsQ0FBdEIsQ0FBZDs7QUFFQSxXQUFPLGdCQUFQLENBQXlCLFdBQXpCLEVBQXNDLFVBQVUsS0FBVixFQUFpQjtBQUNyRCxZQUFNLENBQU4sR0FBWSxNQUFNLE9BQU4sR0FBZ0IsT0FBTyxVQUF6QixHQUF3QyxDQUF4QyxHQUE0QyxDQUF0RDtBQUNBLFlBQU0sQ0FBTixHQUFVLEVBQUksTUFBTSxPQUFOLEdBQWdCLE9BQU8sV0FBM0IsSUFBMkMsQ0FBM0MsR0FBK0MsQ0FBekQ7QUFDRCxLQUhELEVBR0csS0FISDs7QUFLQSxXQUFPLGdCQUFQLENBQXlCLFdBQXpCLEVBQXNDLFVBQVUsS0FBVixFQUFpQjtBQUNyRCxZQUFNLE9BQU4sR0FBZ0IsSUFBaEI7QUFDRCxLQUZELEVBRUcsS0FGSDs7QUFJQSxXQUFPLGdCQUFQLENBQXlCLFNBQXpCLEVBQW9DLFVBQVUsS0FBVixFQUFpQjtBQUNuRCxZQUFNLE9BQU4sR0FBZ0IsS0FBaEI7QUFDRCxLQUZELEVBRUcsS0FGSDs7QUFJQSxRQUFNLFFBQVEsYUFBZDtBQUNBLFVBQU0sS0FBTixHQUFjLEtBQWQ7QUFDQSxXQUFPLEtBQVA7QUFDRDs7QUFNRDs7Ozs7Ozs7Ozs7QUFlQSxXQUFTLGNBQVQsQ0FBeUIsTUFBekIsRUFBaUM7QUFDL0IsUUFBTSxRQUFRLFlBQWEsTUFBYixDQUFkOztBQUVBLFVBQU0sS0FBTixDQUFZLEdBQVosQ0FBaUIsTUFBTSxNQUF2Qjs7QUFFQSxVQUFNLEtBQU4sQ0FBWSxPQUFaLEdBQXNCLFVBQVUsSUFBVixFQUFnQjtBQUNwQyxZQUFNLE9BQU4sR0FBZ0IsSUFBaEI7QUFDRCxLQUZEOztBQUlBLFVBQU0sS0FBTixDQUFZLE9BQVosR0FBc0IsVUFBVSxJQUFWLEVBQWdCO0FBQ3BDLFlBQU0sT0FBTixHQUFnQixJQUFoQjtBQUNELEtBRkQ7O0FBSUEsVUFBTSxLQUFOLENBQVksTUFBWixHQUFxQixNQUFNLE1BQTNCOztBQUVBLFFBQUksTUFBTSxjQUFOLElBQXdCLGtCQUFrQixNQUFNLGNBQXBELEVBQW9FO0FBQ2xFLHlCQUFvQixLQUFwQixFQUEyQixNQUEzQixFQUFtQyxNQUFNLEtBQU4sQ0FBWSxPQUEvQyxFQUF3RCxNQUFNLEtBQU4sQ0FBWSxPQUFwRTtBQUNEOztBQUVELGlCQUFhLElBQWIsQ0FBbUIsS0FBbkI7O0FBRUEsV0FBTyxNQUFNLEtBQWI7QUFDRDs7QUFLRDs7OztBQUlBLFdBQVMsU0FBVCxDQUFvQixNQUFwQixFQUE0QixZQUE1QixFQUFrRTtBQUFBLFFBQXhCLEdBQXdCLHlEQUFsQixHQUFrQjtBQUFBLFFBQWIsR0FBYSx5REFBUCxLQUFPOztBQUNoRSxRQUFNLFNBQVMsc0JBQWM7QUFDM0IsOEJBRDJCLEVBQ2QsMEJBRGMsRUFDQSxjQURBLEVBQ1EsUUFEUixFQUNhLFFBRGI7QUFFM0Isb0JBQWMsT0FBUSxZQUFSO0FBRmEsS0FBZCxDQUFmOztBQUtBLGdCQUFZLElBQVosQ0FBa0IsTUFBbEI7QUFDQSxtQkFBZSxJQUFmLDBDQUF3QixPQUFPLE9BQS9COztBQUVBLFdBQU8sTUFBUDtBQUNEOztBQUVELFdBQVMsV0FBVCxDQUFzQixNQUF0QixFQUE4QixZQUE5QixFQUE0QztBQUMxQyxRQUFNLFdBQVcsd0JBQWU7QUFDOUIsOEJBRDhCLEVBQ2pCLDBCQURpQixFQUNILGNBREc7QUFFOUIsb0JBQWMsT0FBUSxZQUFSO0FBRmdCLEtBQWYsQ0FBakI7O0FBS0EsZ0JBQVksSUFBWixDQUFrQixRQUFsQjtBQUNBLG1CQUFlLElBQWYsMENBQXdCLFNBQVMsT0FBakM7O0FBRUEsV0FBTyxRQUFQO0FBQ0Q7O0FBRUQsV0FBUyxTQUFULENBQW9CLE1BQXBCLEVBQTRCLFlBQTVCLEVBQTBDO0FBQ3hDLFFBQU0sU0FBUyxzQkFBYTtBQUMxQiw4QkFEMEIsRUFDYiwwQkFEYSxFQUNDO0FBREQsS0FBYixDQUFmOztBQUlBLGdCQUFZLElBQVosQ0FBa0IsTUFBbEI7QUFDQSxtQkFBZSxJQUFmLDBDQUF3QixPQUFPLE9BQS9CO0FBQ0EsV0FBTyxNQUFQO0FBQ0Q7O0FBRUQsV0FBUyxXQUFULENBQXNCLE1BQXRCLEVBQThCLFlBQTlCLEVBQTRDLE9BQTVDLEVBQXFEO0FBQ25ELFFBQU0sV0FBVyx3QkFBZTtBQUM5Qiw4QkFEOEIsRUFDakIsMEJBRGlCLEVBQ0gsY0FERyxFQUNLO0FBREwsS0FBZixDQUFqQjs7QUFJQSxnQkFBWSxJQUFaLENBQWtCLFFBQWxCO0FBQ0EsbUJBQWUsSUFBZiwwQ0FBd0IsU0FBUyxPQUFqQztBQUNBLFdBQU8sUUFBUDtBQUNEOztBQU1EOzs7Ozs7Ozs7Ozs7O0FBaUJBLFdBQVMsR0FBVCxDQUFjLE1BQWQsRUFBc0IsWUFBdEIsRUFBb0MsSUFBcEMsRUFBMEMsSUFBMUMsRUFBZ0Q7O0FBRTlDLFFBQUksV0FBVyxTQUFmLEVBQTBCO0FBQ3hCLGNBQVEsSUFBUixDQUFjLHFCQUFkO0FBQ0EsYUFBTyxJQUFJLE1BQU0sS0FBVixFQUFQO0FBQ0QsS0FIRCxNQUtBLElBQUksT0FBUSxZQUFSLE1BQTJCLFNBQS9CLEVBQTBDO0FBQ3hDLGNBQVEsSUFBUixDQUFjLG1CQUFkLEVBQW1DLFlBQW5DLEVBQWlELFdBQWpELEVBQThELE1BQTlEO0FBQ0EsYUFBTyxJQUFJLE1BQU0sS0FBVixFQUFQO0FBQ0Q7O0FBRUQsUUFBSSxTQUFVLElBQVYsS0FBb0IsUUFBUyxJQUFULENBQXhCLEVBQXlDO0FBQ3ZDLGFBQU8sWUFBYSxNQUFiLEVBQXFCLFlBQXJCLEVBQW1DLElBQW5DLENBQVA7QUFDRDs7QUFFRCxRQUFJLFNBQVUsT0FBUSxZQUFSLENBQVYsQ0FBSixFQUF1QztBQUNyQyxhQUFPLFVBQVcsTUFBWCxFQUFtQixZQUFuQixFQUFpQyxJQUFqQyxFQUF1QyxJQUF2QyxDQUFQO0FBQ0Q7O0FBRUQsUUFBSSxVQUFXLE9BQVEsWUFBUixDQUFYLENBQUosRUFBd0M7QUFDdEMsYUFBTyxZQUFhLE1BQWIsRUFBcUIsWUFBckIsQ0FBUDtBQUNEOztBQUVELFFBQUksV0FBWSxPQUFRLFlBQVIsQ0FBWixDQUFKLEVBQTBDO0FBQ3hDLGFBQU8sVUFBVyxNQUFYLEVBQW1CLFlBQW5CLENBQVA7QUFDRDs7QUFFRDtBQUNBLFdBQU8sSUFBSSxNQUFNLEtBQVYsRUFBUDtBQUNEOztBQUtEOzs7Ozs7QUFPQSxXQUFTLFNBQVQsQ0FBb0IsSUFBcEIsRUFBMEI7QUFDeEIsUUFBTSxTQUFTLHNCQUFhO0FBQzFCLDhCQUQwQjtBQUUxQjtBQUYwQixLQUFiLENBQWY7O0FBS0EsZ0JBQVksSUFBWixDQUFrQixNQUFsQjtBQUNBLFFBQUksT0FBTyxPQUFYLEVBQW9CO0FBQ2xCLHFCQUFlLElBQWYsMENBQXdCLE9BQU8sT0FBL0I7QUFDRDs7QUFFRCxXQUFPLE1BQVA7QUFDRDs7QUFNRDs7OztBQUlBLE1BQU0sWUFBWSxJQUFJLE1BQU0sT0FBVixFQUFsQjtBQUNBLE1BQU0sYUFBYSxJQUFJLE1BQU0sT0FBVixDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixDQUFDLENBQTFCLENBQW5CO0FBQ0EsTUFBTSxVQUFVLElBQUksTUFBTSxPQUFWLEVBQWhCOztBQUVBLFdBQVMsTUFBVCxHQUFrQjtBQUNoQiwwQkFBdUIsTUFBdkI7O0FBRUEsUUFBSSxZQUFKLEVBQWtCO0FBQ2hCLGlCQUFXLGFBQVgsR0FBMkIsa0JBQW1CLGNBQW5CLEVBQW1DLFVBQW5DLENBQTNCO0FBQ0Q7O0FBRUQsaUJBQWEsT0FBYixDQUFzQixZQUF5RDtBQUFBLHVFQUFYLEVBQVc7O0FBQUEsVUFBOUMsR0FBOEMsUUFBOUMsR0FBOEM7QUFBQSxVQUExQyxNQUEwQyxRQUExQyxNQUEwQztBQUFBLFVBQW5DLE9BQW1DLFFBQW5DLE9BQW1DO0FBQUEsVUFBM0IsS0FBMkIsUUFBM0IsS0FBMkI7QUFBQSxVQUFyQixNQUFxQixRQUFyQixNQUFxQjtBQUFBLFVBQVAsS0FBTzs7QUFDN0UsYUFBTyxpQkFBUDs7QUFFQSxnQkFBVSxHQUFWLENBQWMsQ0FBZCxFQUFnQixDQUFoQixFQUFrQixDQUFsQixFQUFxQixxQkFBckIsQ0FBNEMsT0FBTyxXQUFuRDtBQUNBLGNBQVEsUUFBUixHQUFtQixlQUFuQixDQUFvQyxPQUFPLFdBQTNDO0FBQ0EsaUJBQVcsR0FBWCxDQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBbUIsQ0FBQyxDQUFwQixFQUF1QixZQUF2QixDQUFxQyxPQUFyQyxFQUErQyxTQUEvQzs7QUFFQSxjQUFRLEdBQVIsQ0FBYSxTQUFiLEVBQXdCLFVBQXhCOztBQUVBLFlBQU0sUUFBTixDQUFlLFFBQWYsQ0FBeUIsQ0FBekIsRUFBNkIsSUFBN0IsQ0FBbUMsU0FBbkM7O0FBRUE7QUFDQTs7QUFFQSxVQUFNLGdCQUFnQixRQUFRLGdCQUFSLENBQTBCLGNBQTFCLEVBQTBDLEtBQTFDLENBQXRCO0FBQ0EseUJBQW9CLGFBQXBCLEVBQW1DLEtBQW5DLEVBQTBDLE1BQTFDOztBQUVBLG1CQUFjLEtBQWQsRUFBc0IsYUFBdEIsR0FBc0MsYUFBdEM7QUFDRCxLQWxCRDs7QUFvQkEsUUFBTSxTQUFTLGFBQWEsS0FBYixFQUFmOztBQUVBLFFBQUksWUFBSixFQUFrQjtBQUNoQixhQUFPLElBQVAsQ0FBYSxVQUFiO0FBQ0Q7O0FBRUQsZ0JBQVksT0FBWixDQUFxQixVQUFVLFVBQVYsRUFBc0I7QUFDekMsaUJBQVcsTUFBWCxDQUFtQixNQUFuQjtBQUNELEtBRkQ7QUFHRDs7QUFFRCxXQUFTLGtCQUFULENBQTZCLGFBQTdCLEVBQTRDLEtBQTVDLEVBQW1ELE1BQW5ELEVBQTJEO0FBQ3pELFFBQUksY0FBYyxNQUFkLEdBQXVCLENBQTNCLEVBQThCO0FBQzVCLFVBQU0sV0FBVyxjQUFlLENBQWYsQ0FBakI7QUFDQSxZQUFNLFFBQU4sQ0FBZSxRQUFmLENBQXlCLENBQXpCLEVBQTZCLElBQTdCLENBQW1DLFNBQVMsS0FBNUM7QUFDQSxZQUFNLE9BQU4sR0FBZ0IsSUFBaEI7QUFDQSxZQUFNLFFBQU4sQ0FBZSxxQkFBZjtBQUNBLFlBQU0sUUFBTixDQUFlLGtCQUFmO0FBQ0EsWUFBTSxRQUFOLENBQWUsa0JBQWYsR0FBb0MsSUFBcEM7QUFDQSxhQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsQ0FBc0IsU0FBUyxLQUEvQjtBQUNBLGFBQU8sT0FBUCxHQUFpQixJQUFqQjtBQUNELEtBVEQsTUFVSTtBQUNGLFlBQU0sT0FBTixHQUFnQixLQUFoQjtBQUNBLGFBQU8sT0FBUCxHQUFpQixLQUFqQjtBQUNEO0FBQ0Y7O0FBRUQsV0FBUyxpQkFBVCxDQUE0QixjQUE1QixFQUEwRjtBQUFBLHNFQUFKLEVBQUk7O0FBQUEsUUFBN0MsR0FBNkMsU0FBN0MsR0FBNkM7QUFBQSxRQUF6QyxNQUF5QyxTQUF6QyxNQUF5QztBQUFBLFFBQWxDLE9BQWtDLFNBQWxDLE9BQWtDO0FBQUEsUUFBMUIsS0FBMEIsU0FBMUIsS0FBMEI7QUFBQSxRQUFwQixNQUFvQixTQUFwQixNQUFvQjtBQUFBLFFBQWIsS0FBYSxTQUFiLEtBQWE7O0FBQ3hGLFlBQVEsYUFBUixDQUF1QixLQUF2QixFQUE4QixNQUE5QjtBQUNBLFFBQU0sZ0JBQWdCLFFBQVEsZ0JBQVIsQ0FBMEIsY0FBMUIsRUFBMEMsS0FBMUMsQ0FBdEI7QUFDQSx1QkFBb0IsYUFBcEIsRUFBbUMsS0FBbkMsRUFBMEMsTUFBMUM7QUFDQSxXQUFPLGFBQVA7QUFDRDs7QUFFRDs7QUFNQTs7OztBQUlBLFNBQU87QUFDTCxrQ0FESztBQUVMLFlBRks7QUFHTCx3QkFISztBQUlMO0FBSkssR0FBUDtBQU9EOztBQUlEOzs7O0FBSUEsSUFBSSxNQUFKLEVBQVk7QUFDVixTQUFPLFFBQVAsR0FBa0IsUUFBbEI7QUFDRDs7QUFLRDs7OztBQUlBLFNBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQjtBQUNuQixTQUFPLENBQUMsTUFBTSxXQUFXLENBQVgsQ0FBTixDQUFELElBQXlCLFNBQVMsQ0FBVCxDQUFoQztBQUNEOztBQUVELFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFxQjtBQUNuQixTQUFPLE9BQU8sQ0FBUCxLQUFhLFNBQXBCO0FBQ0Q7O0FBRUQsU0FBUyxVQUFULENBQW9CLGVBQXBCLEVBQXFDO0FBQ25DLE1BQU0sVUFBVSxFQUFoQjtBQUNBLFNBQU8sbUJBQW1CLFFBQVEsUUFBUixDQUFpQixJQUFqQixDQUFzQixlQUF0QixNQUEyQyxtQkFBckU7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsU0FBUyxRQUFULENBQW1CLElBQW5CLEVBQXlCO0FBQ3ZCLFNBQVEsUUFBTyxJQUFQLHlDQUFPLElBQVAsT0FBZ0IsUUFBaEIsSUFBNEIsQ0FBQyxNQUFNLE9BQU4sQ0FBYyxJQUFkLENBQTdCLElBQW9ELFNBQVMsSUFBckU7QUFDRDs7QUFFRCxTQUFTLE9BQVQsQ0FBa0IsQ0FBbEIsRUFBcUI7QUFDbkIsU0FBTyxNQUFNLE9BQU4sQ0FBZSxDQUFmLENBQVA7QUFDRDs7QUFRRDs7OztBQUlBLFNBQVMsa0JBQVQsQ0FBNkIsS0FBN0IsRUFBb0MsVUFBcEMsRUFBZ0QsT0FBaEQsRUFBeUQsT0FBekQsRUFBa0U7QUFDaEUsYUFBVyxnQkFBWCxDQUE2QixhQUE3QixFQUE0QztBQUFBLFdBQUksUUFBUyxJQUFULENBQUo7QUFBQSxHQUE1QztBQUNBLGFBQVcsZ0JBQVgsQ0FBNkIsV0FBN0IsRUFBMEM7QUFBQSxXQUFJLFFBQVMsS0FBVCxDQUFKO0FBQUEsR0FBMUM7QUFDQSxhQUFXLGdCQUFYLENBQTZCLFdBQTdCLEVBQTBDO0FBQUEsV0FBSSxRQUFTLElBQVQsQ0FBSjtBQUFBLEdBQTFDO0FBQ0EsYUFBVyxnQkFBWCxDQUE2QixTQUE3QixFQUF3QztBQUFBLFdBQUksUUFBUyxLQUFULENBQUo7QUFBQSxHQUF4Qzs7QUFFQSxNQUFNLFVBQVUsV0FBVyxVQUFYLEVBQWhCO0FBQ0EsV0FBUyxPQUFULENBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCO0FBQ3RCLFFBQUksV0FBVyxRQUFRLE9BQVIsQ0FBZ0IsTUFBaEIsR0FBeUIsQ0FBeEMsRUFBMkM7QUFDekMsY0FBUSxPQUFSLENBQWlCLENBQWpCLEVBQXFCLE9BQXJCLENBQThCLENBQTlCLEVBQWlDLENBQWpDO0FBQ0Q7QUFDRjs7QUFFRCxXQUFTLFVBQVQsR0FBcUI7QUFDbkIscUJBQWtCLFVBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMO0FBQUEsYUFBUyxRQUFRLElBQUUsQ0FBVixFQUFhLEdBQWIsQ0FBVDtBQUFBLEtBQWxCLEVBQThDLEVBQTlDLEVBQWtELEVBQWxEO0FBQ0Q7O0FBRUQsV0FBUyxXQUFULEdBQXNCO0FBQ3BCLHFCQUFrQixVQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTDtBQUFBLGFBQVMsUUFBUSxDQUFSLEVBQVcsT0FBTyxJQUFFLENBQVQsQ0FBWCxDQUFUO0FBQUEsS0FBbEIsRUFBb0QsR0FBcEQsRUFBeUQsQ0FBekQ7QUFDRDs7QUFFRCxRQUFNLE1BQU4sQ0FBYSxFQUFiLENBQWlCLGtCQUFqQixFQUFxQyxVQUFVLEtBQVYsRUFBaUI7QUFDcEQsWUFBUyxHQUFULEVBQWMsR0FBZDtBQUNELEdBRkQ7O0FBSUEsUUFBTSxNQUFOLENBQWEsRUFBYixDQUFpQixTQUFqQixFQUE0QixZQUFVO0FBQ3BDO0FBQ0QsR0FGRDs7QUFJQSxRQUFNLE1BQU4sQ0FBYSxFQUFiLENBQWlCLGNBQWpCLEVBQWlDLFlBQVU7QUFDekM7QUFDRCxHQUZEOztBQUlBLFFBQU0sTUFBTixDQUFhLEVBQWIsQ0FBaUIsUUFBakIsRUFBMkIsWUFBVTtBQUNuQztBQUNELEdBRkQ7O0FBSUEsUUFBTSxNQUFOLENBQWEsRUFBYixDQUFpQixhQUFqQixFQUFnQyxZQUFVO0FBQ3hDO0FBQ0QsR0FGRDtBQU1EOztBQUVELFNBQVMsZ0JBQVQsQ0FBMkIsRUFBM0IsRUFBK0IsS0FBL0IsRUFBc0MsS0FBdEMsRUFBNkM7QUFDM0MsTUFBSSxJQUFJLENBQVI7QUFDQSxNQUFJLEtBQUssWUFBYSxZQUFVO0FBQzlCLE9BQUksQ0FBSixFQUFPLEtBQVAsRUFBYyxJQUFFLEtBQWhCO0FBQ0E7QUFDQSxRQUFJLEtBQUcsS0FBUCxFQUFjO0FBQ1osb0JBQWUsRUFBZjtBQUNEO0FBQ0YsR0FOUSxFQU1OLEtBTk0sQ0FBVDtBQU9BLFNBQU8sRUFBUDtBQUNEOzs7Ozs7OztrQkNyZXVCLGlCOztBQUZ4Qjs7Ozs7O0FBRWUsU0FBUyxpQkFBVCxDQUE0QixTQUE1QixFQUF1QztBQUNwRCxNQUFNLFNBQVMsc0JBQWY7O0FBRUEsTUFBSSxXQUFXLEtBQWY7QUFDQSxNQUFJLGNBQWMsS0FBbEI7O0FBRUEsTUFBSSxRQUFRLEtBQVo7QUFDQSxNQUFJLFlBQVksS0FBaEI7O0FBRUEsTUFBTSxVQUFVLElBQUksTUFBTSxPQUFWLEVBQWhCOztBQUVBLFdBQVMsTUFBVCxDQUFpQixZQUFqQixFQUErQjs7QUFFN0IsWUFBUSxLQUFSO0FBQ0Esa0JBQWMsS0FBZDtBQUNBLGdCQUFZLEtBQVo7O0FBRUEsaUJBQWEsT0FBYixDQUFzQixVQUFVLEtBQVYsRUFBaUI7QUFBQSx3QkFFTCxXQUFZLEtBQVosQ0FGSzs7QUFBQSxVQUU3QixTQUY2QixlQUU3QixTQUY2QjtBQUFBLFVBRWxCLFFBRmtCLGVBRWxCLFFBRmtCOzs7QUFJckMsY0FBUSxTQUFTLGNBQWMsU0FBL0I7O0FBRUEseUJBQW1CO0FBQ2pCLG9CQURpQjtBQUVqQixvQkFGaUI7QUFHakIsNEJBSGlCLEVBR04sa0JBSE07QUFJakIsb0JBQVksU0FKSztBQUtqQix5QkFBaUIsT0FMQTtBQU1qQixrQkFBVSxXQU5PO0FBT2pCLGtCQUFVLFVBUE87QUFRakIsZ0JBQVE7QUFSUyxPQUFuQjs7QUFXQSx5QkFBbUI7QUFDakIsb0JBRGlCO0FBRWpCLG9CQUZpQjtBQUdqQiw0QkFIaUIsRUFHTixrQkFITTtBQUlqQixvQkFBWSxTQUpLO0FBS2pCLHlCQUFpQixNQUxBO0FBTWpCLGtCQUFVLFdBTk87QUFPakIsa0JBQVUsVUFQTztBQVFqQixnQkFBUTtBQVJTLE9BQW5CO0FBV0QsS0E1QkQ7QUE4QkQ7O0FBRUQsV0FBUyxVQUFULENBQXFCLEtBQXJCLEVBQTRCO0FBQzFCLFFBQUksTUFBTSxhQUFOLENBQW9CLE1BQXBCLElBQThCLENBQWxDLEVBQXFDO0FBQ25DLGFBQU87QUFDTCxrQkFBVSxRQUFRLHFCQUFSLENBQStCLE1BQU0sTUFBTixDQUFhLFdBQTVDLEVBQTBELEtBQTFELEVBREw7QUFFTCxtQkFBVyxNQUFNO0FBRlosT0FBUDtBQUlELEtBTEQsTUFNSTtBQUNGLGFBQU87QUFDTCxrQkFBVSxNQUFNLGFBQU4sQ0FBcUIsQ0FBckIsRUFBeUIsS0FEOUI7QUFFTCxtQkFBVyxNQUFNLGFBQU4sQ0FBcUIsQ0FBckIsRUFBeUI7QUFGL0IsT0FBUDtBQUlEO0FBQ0Y7O0FBRUQsV0FBUyxrQkFBVCxHQUlRO0FBQUEscUVBQUosRUFBSTs7QUFBQSxRQUhOLEtBR00sUUFITixLQUdNO0FBQUEsUUFIQyxLQUdELFFBSEMsS0FHRDtBQUFBLFFBRk4sU0FFTSxRQUZOLFNBRU07QUFBQSxRQUZLLFFBRUwsUUFGSyxRQUVMO0FBQUEsUUFETixVQUNNLFFBRE4sVUFDTTtBQUFBLFFBRE0sZUFDTixRQURNLGVBQ047QUFBQSxRQUR1QixRQUN2QixRQUR1QixRQUN2QjtBQUFBLFFBRGlDLFFBQ2pDLFFBRGlDLFFBQ2pDO0FBQUEsUUFEMkMsTUFDM0MsUUFEMkMsTUFDM0M7OztBQUdOO0FBQ0EsUUFBSSxTQUFTLE1BQU8sVUFBUCxNQUF3QixJQUFqQyxJQUF5QyxNQUFNLFdBQU4sQ0FBbUIsZUFBbkIsTUFBeUMsU0FBdEYsRUFBaUc7O0FBRS9GLFVBQU0sVUFBVTtBQUNkLG9CQURjO0FBRWQsNEJBRmM7QUFHZCxlQUFPLFFBSE87QUFJZCxxQkFBYSxNQUFNLE1BSkw7QUFLZCxnQkFBUTtBQUxNLE9BQWhCO0FBT0EsYUFBTyxJQUFQLENBQWEsUUFBYixFQUF1QixPQUF2Qjs7QUFFQSxVQUFJLFFBQVEsTUFBWixFQUFvQjtBQUNsQixjQUFNLFdBQU4sQ0FBbUIsZUFBbkIsSUFBdUMsV0FBdkM7QUFDRDs7QUFFRCxvQkFBYyxJQUFkO0FBQ0Esa0JBQVksSUFBWjtBQUNEOztBQUVEO0FBQ0EsUUFBSSxNQUFPLFVBQVAsS0FBdUIsTUFBTSxXQUFOLENBQW1CLGVBQW5CLE1BQXlDLFdBQXBFLEVBQWlGO0FBQy9FLFVBQU0sV0FBVTtBQUNkLG9CQURjO0FBRWQsNEJBRmM7QUFHZCxlQUFPLFFBSE87QUFJZCxxQkFBYSxNQUFNLE1BSkw7QUFLZCxnQkFBUTtBQUxNLE9BQWhCOztBQVFBLGFBQU8sSUFBUCxDQUFhLFFBQWIsRUFBdUIsUUFBdkI7O0FBRUEsb0JBQWMsSUFBZDs7QUFFQSxZQUFNLE1BQU4sQ0FBYSxJQUFiLENBQW1CLGtCQUFuQjtBQUNEOztBQUVEO0FBQ0EsUUFBSSxNQUFPLFVBQVAsTUFBd0IsS0FBeEIsSUFBaUMsTUFBTSxXQUFOLENBQW1CLGVBQW5CLE1BQXlDLFdBQTlFLEVBQTJGO0FBQ3pGLFlBQU0sV0FBTixDQUFtQixlQUFuQixJQUF1QyxTQUF2QztBQUNBLGFBQU8sSUFBUCxDQUFhLE1BQWIsRUFBcUI7QUFDbkIsb0JBRG1CO0FBRW5CLDRCQUZtQjtBQUduQixlQUFPLFFBSFk7QUFJbkIscUJBQWEsTUFBTTtBQUpBLE9BQXJCO0FBTUQ7QUFFRjs7QUFHRCxNQUFNLGNBQWM7QUFDbEIsY0FBVTtBQUFBLGFBQUksS0FBSjtBQUFBLEtBRFE7QUFFbEIsY0FBVTtBQUFBLGFBQUksV0FBSjtBQUFBLEtBRlE7QUFHbEIsa0JBSGtCO0FBSWxCO0FBSmtCLEdBQXBCOztBQU9BLFNBQU8sV0FBUDtBQUNELEMsQ0F0SkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FDc0JnQixTLEdBQUEsUztRQWVBLFcsR0FBQSxXO1FBT0EscUIsR0FBQSxxQjs7QUF6QmhCOztJQUFZLGU7O0FBQ1o7O0lBQVksTTs7OztBQXBCWjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCTyxTQUFTLFNBQVQsQ0FBb0IsR0FBcEIsRUFBeUI7QUFDOUIsTUFBSSxlQUFlLE1BQU0sSUFBekIsRUFBK0I7QUFDN0IsUUFBSSxRQUFKLENBQWEsa0JBQWI7QUFDQSxRQUFNLFFBQVEsSUFBSSxRQUFKLENBQWEsV0FBYixDQUF5QixHQUF6QixDQUE2QixDQUE3QixHQUFpQyxJQUFJLFFBQUosQ0FBYSxXQUFiLENBQXlCLEdBQXpCLENBQTZCLENBQTVFO0FBQ0EsUUFBSSxRQUFKLENBQWEsU0FBYixDQUF3QixLQUF4QixFQUErQixDQUEvQixFQUFrQyxDQUFsQztBQUNBLFdBQU8sR0FBUDtBQUNELEdBTEQsTUFNSyxJQUFJLGVBQWUsTUFBTSxRQUF6QixFQUFtQztBQUN0QyxRQUFJLGtCQUFKO0FBQ0EsUUFBTSxTQUFRLElBQUksV0FBSixDQUFnQixHQUFoQixDQUFvQixDQUFwQixHQUF3QixJQUFJLFdBQUosQ0FBZ0IsR0FBaEIsQ0FBb0IsQ0FBMUQ7QUFDQSxRQUFJLFNBQUosQ0FBZSxNQUFmLEVBQXNCLENBQXRCLEVBQXlCLENBQXpCO0FBQ0EsV0FBTyxHQUFQO0FBQ0Q7QUFDRjs7QUFFTSxTQUFTLFdBQVQsQ0FBc0IsS0FBdEIsRUFBNkIsTUFBN0IsRUFBcUMsS0FBckMsRUFBNEM7QUFDakQsTUFBTSxRQUFRLElBQUksTUFBTSxJQUFWLENBQWdCLElBQUksTUFBTSxXQUFWLENBQXVCLEtBQXZCLEVBQThCLE1BQTlCLEVBQXNDLEtBQXRDLENBQWhCLEVBQStELGdCQUFnQixLQUEvRSxDQUFkO0FBQ0EsUUFBTSxRQUFOLENBQWUsU0FBZixDQUEwQixRQUFRLEdBQWxDLEVBQXVDLENBQXZDLEVBQTBDLENBQTFDO0FBQ0EsU0FBTyxnQkFBUCxDQUF5QixNQUFNLFFBQS9CLEVBQXlDLE9BQU8sWUFBaEQ7QUFDQSxTQUFPLEtBQVA7QUFDRDs7QUFFTSxTQUFTLHFCQUFULENBQWdDLE1BQWhDLEVBQXdDLEtBQXhDLEVBQStDO0FBQ3BELE1BQU0sUUFBUSxJQUFJLE1BQU0sSUFBVixDQUFnQixJQUFJLE1BQU0sV0FBVixDQUF1QixtQkFBdkIsRUFBNEMsTUFBNUMsRUFBb0QsbUJBQXBELENBQWhCLEVBQTJGLGdCQUFnQixLQUEzRyxDQUFkO0FBQ0EsUUFBTSxRQUFOLENBQWUsU0FBZixDQUEwQixzQkFBc0IsR0FBaEQsRUFBcUQsQ0FBckQsRUFBd0QsQ0FBeEQ7QUFDQSxTQUFPLGdCQUFQLENBQXlCLE1BQU0sUUFBL0IsRUFBeUMsS0FBekM7QUFDQSxTQUFPLEtBQVA7QUFDRDs7QUFFTSxJQUFNLG9DQUFjLEdBQXBCO0FBQ0EsSUFBTSxzQ0FBZSxJQUFyQjtBQUNBLElBQU0sb0NBQWMsSUFBcEI7QUFDQSxJQUFNLHdDQUFnQixLQUF0QjtBQUNBLElBQU0sc0NBQWUsS0FBckI7QUFDQSxJQUFNLDREQUEwQixJQUFoQztBQUNBLElBQU0sNERBQTBCLElBQWhDO0FBQ0EsSUFBTSxvREFBc0IsSUFBNUI7QUFDQSxJQUFNLG9EQUFzQixLQUE1Qjs7Ozs7Ozs7UUN0Q1MsTSxHQUFBLE07O0FBRmhCOzs7Ozs7QUFFTyxTQUFTLE1BQVQsR0FBd0M7QUFBQSxxRUFBSixFQUFJOztBQUFBLFFBQXJCLEtBQXFCLFFBQXJCLEtBQXFCO0FBQUEsUUFBZCxLQUFjLFFBQWQsS0FBYzs7O0FBRTdDLFFBQU0sY0FBYywyQkFBbUIsS0FBbkIsQ0FBcEI7O0FBRUEsZ0JBQVksTUFBWixDQUFtQixFQUFuQixDQUF1QixXQUF2QixFQUFvQyxZQUFwQztBQUNBLGdCQUFZLE1BQVosQ0FBbUIsRUFBbkIsQ0FBdUIsZUFBdkIsRUFBd0MsbUJBQXhDOztBQUVBLFFBQUksa0JBQUo7QUFDQSxRQUFJLGNBQWMsSUFBSSxNQUFNLE9BQVYsRUFBbEI7QUFDQSxRQUFJLGNBQWMsSUFBSSxNQUFNLEtBQVYsRUFBbEI7O0FBRUEsUUFBTSxnQkFBZ0IsSUFBSSxNQUFNLEtBQVYsRUFBdEI7QUFDQSxrQkFBYyxLQUFkLENBQW9CLEdBQXBCLENBQXlCLEdBQXpCLEVBQThCLEdBQTlCLEVBQW1DLEdBQW5DO0FBQ0Esa0JBQWMsUUFBZCxDQUF1QixHQUF2QixDQUE0QixDQUFDLEtBQTdCLEVBQW9DLEtBQXBDLEVBQTJDLEdBQTNDOztBQUdBLGFBQVMsWUFBVCxDQUF1QixDQUF2QixFQUEwQjtBQUFBLFlBRWhCLFdBRmdCLEdBRU8sQ0FGUCxDQUVoQixXQUZnQjtBQUFBLFlBRUgsS0FGRyxHQUVPLENBRlAsQ0FFSCxLQUZHOzs7QUFJeEIsWUFBTSxTQUFTLE1BQU0sTUFBckI7QUFDQSxZQUFJLFdBQVcsU0FBZixFQUEwQjtBQUN4QjtBQUNEOztBQUVELFlBQUksT0FBTyxVQUFQLEtBQXNCLElBQTFCLEVBQWdDO0FBQzlCO0FBQ0Q7O0FBRUQsb0JBQVksSUFBWixDQUFrQixPQUFPLFFBQXpCO0FBQ0Esb0JBQVksSUFBWixDQUFrQixPQUFPLFFBQXpCOztBQUVBLGVBQU8sUUFBUCxDQUFnQixHQUFoQixDQUFxQixDQUFyQixFQUF1QixDQUF2QixFQUF5QixDQUF6QjtBQUNBLGVBQU8sUUFBUCxDQUFnQixHQUFoQixDQUFxQixDQUFyQixFQUF1QixDQUF2QixFQUF5QixDQUF6QjtBQUNBLGVBQU8sUUFBUCxDQUFnQixDQUFoQixHQUFvQixDQUFDLEtBQUssRUFBTixHQUFXLEdBQS9COztBQUVBLG9CQUFZLE9BQU8sTUFBbkI7O0FBRUEsc0JBQWMsR0FBZCxDQUFtQixNQUFuQjs7QUFFQSxvQkFBWSxHQUFaLENBQWlCLGFBQWpCOztBQUVBLFVBQUUsTUFBRixHQUFXLElBQVg7O0FBRUEsZUFBTyxVQUFQLEdBQW9CLElBQXBCOztBQUVBLGNBQU0sTUFBTixDQUFhLElBQWIsQ0FBbUIsUUFBbkIsRUFBNkIsS0FBN0I7QUFDRDs7QUFFRCxhQUFTLG1CQUFULEdBQXlEO0FBQUEsMEVBQUosRUFBSTs7QUFBQSxZQUF6QixXQUF5QixTQUF6QixXQUF5QjtBQUFBLFlBQVosS0FBWSxTQUFaLEtBQVk7OztBQUV2RCxZQUFNLFNBQVMsTUFBTSxNQUFyQjtBQUNBLFlBQUksV0FBVyxTQUFmLEVBQTBCO0FBQ3hCO0FBQ0Q7O0FBRUQsWUFBSSxjQUFjLFNBQWxCLEVBQTZCO0FBQzNCO0FBQ0Q7O0FBRUQsWUFBSSxPQUFPLFVBQVAsS0FBc0IsS0FBMUIsRUFBaUM7QUFDL0I7QUFDRDs7QUFFRCxrQkFBVSxHQUFWLENBQWUsTUFBZjtBQUNBLG9CQUFZLFNBQVo7O0FBRUEsZUFBTyxRQUFQLENBQWdCLElBQWhCLENBQXNCLFdBQXRCO0FBQ0EsZUFBTyxRQUFQLENBQWdCLElBQWhCLENBQXNCLFdBQXRCOztBQUVBLGVBQU8sVUFBUCxHQUFvQixLQUFwQjs7QUFFQSxjQUFNLE1BQU4sQ0FBYSxJQUFiLENBQW1CLGFBQW5CLEVBQWtDLEtBQWxDO0FBQ0Q7O0FBRUQsV0FBTyxXQUFQO0FBQ0QsQyxDQWpHRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQ3lCZ0IsYyxHQUFBLGM7UUFvQkEsTyxHQUFBLE87O0FBMUJoQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7SUFBWSxJOzs7Ozs7QUF2Qlo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5Qk8sU0FBUyxjQUFULENBQXlCLEtBQXpCLEVBQWdDOztBQUVyQyxNQUFNLFVBQVUsSUFBSSxNQUFNLE9BQVYsRUFBaEI7QUFDQSxNQUFNLFFBQVEsS0FBSyxLQUFMLEVBQWQ7QUFDQSxVQUFRLEtBQVIsR0FBZ0IsS0FBaEI7QUFDQSxVQUFRLFdBQVIsR0FBc0IsSUFBdEI7QUFDQSxVQUFRLFNBQVIsR0FBb0IsTUFBTSx3QkFBMUI7QUFDQSxVQUFRLFNBQVIsR0FBb0IsTUFBTSxZQUExQjtBQUNBLFVBQVEsZUFBUixHQUEwQixJQUExQjs7QUFFQTs7QUFFQSxTQUFPLElBQUksTUFBTSxpQkFBVixDQUE0QixtQkFBVTtBQUMzQyxVQUFNLE1BQU0sVUFEK0I7QUFFM0MsaUJBQWEsSUFGOEI7QUFHM0MsV0FBTyxLQUhvQztBQUkzQyxTQUFLO0FBSnNDLEdBQVYsQ0FBNUIsQ0FBUDtBQU1EOztBQUVNLFNBQVMsT0FBVCxHQUFrQjs7QUFFdkIsTUFBTSxPQUFPLGdDQUFZLEtBQUssR0FBTCxFQUFaLENBQWI7O0FBRUEsTUFBTSxpQkFBaUIsRUFBdkI7O0FBRUEsV0FBUyxVQUFULENBQXFCLEdBQXJCLEVBQTBCLElBQTFCLEVBQWtEO0FBQUEsUUFBbEIsS0FBa0IseURBQVYsUUFBVTs7O0FBRWhELFFBQU0sV0FBVywrQkFBZTtBQUM5QixZQUFNLEdBRHdCO0FBRTlCLGFBQU8sTUFGdUI7QUFHOUIsYUFBTyxJQUh1QjtBQUk5QixhQUFPLElBSnVCO0FBSzlCO0FBTDhCLEtBQWYsQ0FBakI7O0FBU0EsUUFBTSxTQUFTLFNBQVMsTUFBeEI7O0FBRUEsUUFBSSxXQUFXLGVBQWdCLEtBQWhCLENBQWY7QUFDQSxRQUFJLGFBQWEsU0FBakIsRUFBNEI7QUFDMUIsaUJBQVcsZUFBZ0IsS0FBaEIsSUFBMEIsZUFBZ0IsS0FBaEIsQ0FBckM7QUFDRDtBQUNELFFBQU0sT0FBTyxJQUFJLE1BQU0sSUFBVixDQUFnQixRQUFoQixFQUEwQixRQUExQixDQUFiO0FBQ0EsU0FBSyxLQUFMLENBQVcsUUFBWCxDQUFxQixJQUFJLE1BQU0sT0FBVixDQUFrQixDQUFsQixFQUFvQixDQUFDLENBQXJCLEVBQXVCLENBQXZCLENBQXJCO0FBQ0EsU0FBSyxLQUFMLENBQVcsY0FBWCxDQUEyQixLQUEzQjs7QUFFQSxTQUFLLFFBQUwsQ0FBYyxDQUFkLEdBQWtCLE9BQU8sTUFBUCxHQUFnQixHQUFoQixHQUFzQixLQUF4Qzs7QUFFQSxXQUFPLElBQVA7QUFDRDs7QUFHRCxXQUFTLE1BQVQsQ0FBaUIsR0FBakIsRUFBK0M7QUFBQSxxRUFBSixFQUFJOztBQUFBLDBCQUF2QixLQUF1QjtBQUFBLFFBQXZCLEtBQXVCLDhCQUFqQixRQUFpQjs7QUFDN0MsUUFBTSxRQUFRLElBQUksTUFBTSxLQUFWLEVBQWQ7O0FBRUEsUUFBSSxPQUFPLFdBQVksR0FBWixFQUFpQixJQUFqQixFQUF1QixLQUF2QixDQUFYO0FBQ0EsVUFBTSxHQUFOLENBQVcsSUFBWDtBQUNBLFVBQU0sTUFBTixHQUFlLEtBQUssUUFBTCxDQUFjLE1BQTdCOztBQUVBLFVBQU0sTUFBTixHQUFlLFVBQVUsR0FBVixFQUFlO0FBQzVCLFdBQUssUUFBTCxDQUFjLE1BQWQsQ0FBc0IsR0FBdEI7QUFDRCxLQUZEOztBQUlBLFdBQU8sS0FBUDtBQUNEOztBQUVELFNBQU87QUFDTCxrQkFESztBQUVMLGlCQUFhO0FBQUEsYUFBSyxRQUFMO0FBQUE7QUFGUixHQUFQO0FBS0Q7Ozs7Ozs7Ozs7QUM5RUQ7O0lBQVksTTs7OztBQUVMLElBQU0sd0JBQVEsSUFBSSxNQUFNLGlCQUFWLENBQTZCLEVBQUUsT0FBTyxRQUFULEVBQW1CLGNBQWMsTUFBTSxZQUF2QyxFQUE3QixDQUFkLEMsQ0FyQlA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQk8sSUFBTSw0QkFBVSxJQUFJLE1BQU0saUJBQVYsRUFBaEI7QUFDQSxJQUFNLDBCQUFTLElBQUksTUFBTSxpQkFBVixDQUE2QixFQUFFLE9BQU8sUUFBVCxFQUE3QixDQUFmOzs7Ozs7OztrQkNJaUIsWTs7QUFSeEI7Ozs7QUFDQTs7OztBQUNBOztJQUFZLE07O0FBQ1o7O0lBQVksTTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLEk7O0FBQ1o7O0lBQVksTzs7Ozs7O0FBRUcsU0FBUyxZQUFULEdBVVA7QUFBQSxtRUFBSixFQUFJOztBQUFBLE1BVE4sV0FTTSxRQVROLFdBU007QUFBQSxNQVJOLE1BUU0sUUFSTixNQVFNO0FBQUEsK0JBUE4sWUFPTTtBQUFBLE1BUE4sWUFPTSxxQ0FQUyxXQU9UO0FBQUEsK0JBTk4sWUFNTTtBQUFBLE1BTk4sWUFNTSxxQ0FOUyxHQU1UO0FBQUEsc0JBTE4sR0FLTTtBQUFBLE1BTE4sR0FLTSw0QkFMQSxHQUtBO0FBQUEsc0JBTEssR0FLTDtBQUFBLE1BTEssR0FLTCw0QkFMVyxHQUtYO0FBQUEsdUJBSk4sSUFJTTtBQUFBLE1BSk4sSUFJTSw2QkFKQyxHQUlEO0FBQUEsd0JBSE4sS0FHTTtBQUFBLE1BSE4sS0FHTSw4QkFIRSxPQUFPLFdBR1Q7QUFBQSx5QkFGTixNQUVNO0FBQUEsTUFGTixNQUVNLCtCQUZHLE9BQU8sWUFFVjtBQUFBLHdCQUROLEtBQ007QUFBQSxNQUROLEtBQ00sOEJBREUsT0FBTyxXQUNUOzs7QUFHTixNQUFNLGVBQWUsUUFBUSxHQUFSLEdBQWMsT0FBTyxZQUExQztBQUNBLE1BQU0sZ0JBQWdCLFNBQVMsT0FBTyxZQUF0QztBQUNBLE1BQU0sZUFBZSxLQUFyQjs7QUFFQSxNQUFNLFFBQVE7QUFDWixXQUFPLEdBREs7QUFFWixXQUFPLFlBRks7QUFHWixVQUFNLElBSE07QUFJWixhQUFTLEtBSkc7QUFLWixlQUFXLENBTEM7QUFNWixZQUFRLEtBTkk7QUFPWixTQUFLLEdBUE87QUFRWixTQUFLLEdBUk87QUFTWixpQkFBYSxTQVREO0FBVVosc0JBQWtCLFNBVk47QUFXWixjQUFVO0FBWEUsR0FBZDs7QUFjQSxRQUFNLElBQU4sR0FBYSxlQUFnQixNQUFNLEtBQXRCLENBQWI7QUFDQSxRQUFNLFNBQU4sR0FBa0IsWUFBYSxNQUFNLElBQW5CLENBQWxCO0FBQ0EsUUFBTSxLQUFOLEdBQWMsa0JBQW1CLE1BQU0sS0FBekIsRUFBZ0MsTUFBTSxHQUF0QyxFQUEyQyxNQUFNLEdBQWpELENBQWQ7O0FBRUEsTUFBTSxRQUFRLElBQUksTUFBTSxLQUFWLEVBQWQ7O0FBRUE7QUFDQSxNQUFNLE9BQU8sSUFBSSxNQUFNLFdBQVYsQ0FBdUIsWUFBdkIsRUFBcUMsYUFBckMsRUFBb0QsWUFBcEQsQ0FBYjtBQUNBLE9BQUssU0FBTCxDQUFlLGVBQWEsR0FBNUIsRUFBZ0MsQ0FBaEMsRUFBa0MsQ0FBbEM7QUFDQTs7QUFFQSxNQUFNLGtCQUFrQixJQUFJLE1BQU0saUJBQVYsRUFBeEI7QUFDQSxrQkFBZ0IsT0FBaEIsR0FBMEIsS0FBMUI7O0FBRUE7QUFDQSxNQUFNLGdCQUFnQixJQUFJLE1BQU0sSUFBVixDQUFnQixLQUFLLEtBQUwsRUFBaEIsRUFBOEIsZUFBOUIsQ0FBdEI7QUFDQSxnQkFBYyxRQUFkLENBQXVCLENBQXZCLEdBQTJCLEtBQTNCO0FBQ0EsZ0JBQWMsUUFBZCxDQUF1QixDQUF2QixHQUEyQixRQUFRLEdBQW5DOztBQUVBLE1BQU0sVUFBVSxJQUFJLE1BQU0sU0FBVixDQUFxQixhQUFyQixDQUFoQjtBQUNBLFVBQVEsUUFBUixDQUFpQixLQUFqQixDQUF1QixNQUF2QixDQUErQixPQUFPLGFBQXRDOztBQUVBLE1BQU0sV0FBVyxJQUFJLE1BQU0saUJBQVYsQ0FBNEIsRUFBRSxPQUFPLE9BQU8sYUFBaEIsRUFBK0IsVUFBVSxPQUFPLGNBQWhELEVBQTVCLENBQWpCO0FBQ0EsTUFBTSxlQUFlLElBQUksTUFBTSxJQUFWLENBQWdCLEtBQUssS0FBTCxFQUFoQixFQUE4QixRQUE5QixDQUFyQjtBQUNBLGdCQUFjLEdBQWQsQ0FBbUIsWUFBbkI7O0FBRUEsTUFBTSxhQUFhLElBQUksTUFBTSxJQUFWLENBQWdCLElBQUksTUFBTSxXQUFWLENBQXVCLElBQXZCLEVBQTZCLElBQTdCLEVBQW1DLElBQW5DLEVBQXlDLENBQXpDLEVBQTRDLENBQTVDLEVBQStDLENBQS9DLENBQWhCLEVBQW9FLGdCQUFnQixPQUFwRixDQUFuQjtBQUNBLGFBQVcsUUFBWCxDQUFvQixDQUFwQixHQUF3QixZQUF4QjtBQUNBLGdCQUFjLEdBQWQsQ0FBbUIsVUFBbkI7QUFDQSxhQUFXLE9BQVgsR0FBcUIsS0FBckI7O0FBRUEsTUFBTSxhQUFhLFlBQVksTUFBWixDQUFvQixNQUFNLEtBQU4sQ0FBWSxRQUFaLEVBQXBCLENBQW5CO0FBQ0EsYUFBVyxRQUFYLENBQW9CLENBQXBCLEdBQXdCLE9BQU8sdUJBQVAsR0FBaUMsUUFBUSxHQUFqRTtBQUNBLGFBQVcsUUFBWCxDQUFvQixDQUFwQixHQUF3QixRQUFNLENBQTlCO0FBQ0EsYUFBVyxRQUFYLENBQW9CLENBQXBCLEdBQXdCLENBQUMsSUFBekI7O0FBRUEsTUFBTSxrQkFBa0IsWUFBWSxNQUFaLENBQW9CLFlBQXBCLENBQXhCO0FBQ0Esa0JBQWdCLFFBQWhCLENBQXlCLENBQXpCLEdBQTZCLE9BQU8sdUJBQXBDO0FBQ0Esa0JBQWdCLFFBQWhCLENBQXlCLENBQXpCLEdBQTZCLEtBQTdCO0FBQ0Esa0JBQWdCLFFBQWhCLENBQXlCLENBQXpCLEdBQTZCLENBQUMsSUFBOUI7O0FBRUEsTUFBTSxlQUFlLE9BQU8scUJBQVAsQ0FBOEIsTUFBOUIsRUFBc0MsT0FBTyxvQkFBN0MsQ0FBckI7QUFDQSxlQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsR0FBMEIsS0FBMUI7O0FBRUEsTUFBTSxRQUFRLE9BQU8sV0FBUCxDQUFvQixLQUFwQixFQUEyQixNQUEzQixFQUFtQyxLQUFuQyxDQUFkO0FBQ0EsUUFBTSxHQUFOLENBQVcsZUFBWCxFQUE0QixhQUE1QixFQUEyQyxPQUEzQyxFQUFvRCxVQUFwRCxFQUFnRSxZQUFoRTs7QUFFQSxRQUFNLEdBQU4sQ0FBVyxLQUFYOztBQUVBLG1CQUFrQixNQUFNLEtBQXhCO0FBQ0EsZUFBYyxNQUFNLEtBQXBCOztBQUVBLFdBQVMsZ0JBQVQsQ0FBMkIsS0FBM0IsRUFBa0M7QUFDaEMsUUFBSSxNQUFNLE9BQVYsRUFBbUI7QUFDakIsaUJBQVcsTUFBWCxDQUFtQixlQUFnQixNQUFNLEtBQXRCLEVBQTZCLE1BQU0sU0FBbkMsRUFBK0MsUUFBL0MsRUFBbkI7QUFDRCxLQUZELE1BR0k7QUFDRixpQkFBVyxNQUFYLENBQW1CLE1BQU0sS0FBTixDQUFZLFFBQVosRUFBbkI7QUFDRDtBQUNGOztBQUVELFdBQVMsVUFBVCxHQUFxQjtBQUNuQixRQUFJLE1BQU0sUUFBVixFQUFvQjtBQUNsQixlQUFTLEtBQVQsQ0FBZSxNQUFmLENBQXVCLE9BQU8saUJBQTlCO0FBQ0QsS0FGRCxNQUlBLElBQUksWUFBWSxRQUFaLEVBQUosRUFBNEI7QUFDMUIsZUFBUyxLQUFULENBQWUsTUFBZixDQUF1QixPQUFPLGVBQTlCO0FBQ0EsZUFBUyxRQUFULENBQWtCLE1BQWxCLENBQTBCLE9BQU8sd0JBQWpDO0FBQ0QsS0FIRCxNQUlJO0FBQ0YsZUFBUyxLQUFULENBQWUsTUFBZixDQUF1QixPQUFPLGFBQTlCO0FBQ0EsZUFBUyxRQUFULENBQWtCLE1BQWxCLENBQTBCLE9BQU8sY0FBakM7QUFDRDtBQUNGOztBQUVELFdBQVMsWUFBVCxDQUF1QixLQUF2QixFQUE4QjtBQUM1QixZQUFRLGdCQUFpQixLQUFqQixDQUFSO0FBQ0EsaUJBQWEsS0FBYixDQUFtQixDQUFuQixHQUF1QixLQUFLLEdBQUwsQ0FBVSxRQUFRLEtBQWxCLEVBQXlCLFFBQXpCLENBQXZCO0FBQ0Q7O0FBRUQsV0FBUyxZQUFULENBQXVCLEtBQXZCLEVBQThCO0FBQzVCLFdBQVEsWUFBUixJQUF5QixLQUF6QjtBQUNEOztBQUVELFdBQVMsb0JBQVQsQ0FBK0IsS0FBL0IsRUFBc0M7QUFDcEMsVUFBTSxLQUFOLEdBQWMsZ0JBQWlCLEtBQWpCLENBQWQ7QUFDQSxVQUFNLEtBQU4sR0FBYyxrQkFBbUIsTUFBTSxLQUF6QixFQUFnQyxNQUFNLEdBQXRDLEVBQTJDLE1BQU0sR0FBakQsQ0FBZDtBQUNBLFFBQUksTUFBTSxPQUFWLEVBQW1CO0FBQ2pCLFlBQU0sS0FBTixHQUFjLGdCQUFpQixNQUFNLEtBQXZCLEVBQThCLE1BQU0sSUFBcEMsQ0FBZDtBQUNEO0FBQ0QsVUFBTSxLQUFOLEdBQWMsZ0JBQWlCLE1BQU0sS0FBdkIsRUFBOEIsTUFBTSxHQUFwQyxFQUF5QyxNQUFNLEdBQS9DLENBQWQ7QUFDRDs7QUFFRCxXQUFTLFlBQVQsR0FBdUI7QUFDckIsVUFBTSxLQUFOLEdBQWMsb0JBQWQ7QUFDQSxVQUFNLEtBQU4sR0FBYyxrQkFBbUIsTUFBTSxLQUF6QixFQUFnQyxNQUFNLEdBQXRDLEVBQTJDLE1BQU0sR0FBakQsQ0FBZDtBQUNBLFVBQU0sS0FBTixHQUFjLGdCQUFpQixNQUFNLEtBQXZCLENBQWQ7QUFDRDs7QUFFRCxXQUFTLGtCQUFULEdBQTZCO0FBQzNCLFdBQU8sV0FBWSxPQUFRLFlBQVIsQ0FBWixDQUFQO0FBQ0Q7O0FBRUQsUUFBTSxRQUFOLEdBQWlCLFVBQVUsUUFBVixFQUFvQjtBQUNuQyxVQUFNLFdBQU4sR0FBb0IsUUFBcEI7QUFDQSxXQUFPLEtBQVA7QUFDRCxHQUhEOztBQUtBLFFBQU0sSUFBTixHQUFhLFVBQVUsSUFBVixFQUFnQjtBQUMzQixVQUFNLElBQU4sR0FBYSxJQUFiO0FBQ0EsVUFBTSxTQUFOLEdBQWtCLFlBQWEsTUFBTSxJQUFuQixDQUFsQjtBQUNBLFVBQU0sT0FBTixHQUFnQixJQUFoQjtBQUNBLFdBQU8sS0FBUDtBQUNELEdBTEQ7O0FBT0EsUUFBTSxNQUFOLEdBQWUsWUFBVTtBQUN2QixVQUFNLE1BQU4sR0FBZSxJQUFmO0FBQ0EsV0FBTyxLQUFQO0FBQ0QsR0FIRDs7QUFLQSxNQUFNLGNBQWMsMkJBQW1CLGFBQW5CLENBQXBCO0FBQ0EsY0FBWSxNQUFaLENBQW1CLEVBQW5CLENBQXVCLFdBQXZCLEVBQW9DLFdBQXBDO0FBQ0EsY0FBWSxNQUFaLENBQW1CLEVBQW5CLENBQXVCLFVBQXZCLEVBQW1DLFVBQW5DO0FBQ0EsY0FBWSxNQUFaLENBQW1CLEVBQW5CLENBQXVCLFlBQXZCLEVBQXFDLGFBQXJDOztBQUVBLFdBQVMsV0FBVCxDQUFzQixDQUF0QixFQUF5QjtBQUN2QixRQUFJLE1BQU0sT0FBTixLQUFrQixLQUF0QixFQUE2QjtBQUMzQjtBQUNEO0FBQ0QsVUFBTSxRQUFOLEdBQWlCLElBQWpCO0FBQ0EsTUFBRSxNQUFGLEdBQVcsSUFBWDtBQUNEOztBQUVELFdBQVMsVUFBVCxHQUFxQztBQUFBLHNFQUFKLEVBQUk7O0FBQUEsUUFBZCxLQUFjLFNBQWQsS0FBYzs7QUFDbkMsUUFBSSxNQUFNLE9BQU4sS0FBa0IsS0FBdEIsRUFBNkI7QUFDM0I7QUFDRDs7QUFFRCxVQUFNLFFBQU4sR0FBaUIsSUFBakI7O0FBRUEsaUJBQWEsaUJBQWI7QUFDQSxlQUFXLGlCQUFYOztBQUVBLFFBQU0sSUFBSSxJQUFJLE1BQU0sT0FBVixHQUFvQixxQkFBcEIsQ0FBMkMsYUFBYSxXQUF4RCxDQUFWO0FBQ0EsUUFBTSxJQUFJLElBQUksTUFBTSxPQUFWLEdBQW9CLHFCQUFwQixDQUEyQyxXQUFXLFdBQXRELENBQVY7O0FBRUEsUUFBTSxnQkFBZ0IsTUFBTSxLQUE1Qjs7QUFFQSx5QkFBc0IsY0FBZSxLQUFmLEVBQXNCLEVBQUMsSUFBRCxFQUFHLElBQUgsRUFBdEIsQ0FBdEI7QUFDQSxxQkFBa0IsTUFBTSxLQUF4QjtBQUNBLGlCQUFjLE1BQU0sS0FBcEI7QUFDQSxpQkFBYyxNQUFNLEtBQXBCOztBQUVBLFFBQUksa0JBQWtCLE1BQU0sS0FBeEIsSUFBaUMsTUFBTSxXQUEzQyxFQUF3RDtBQUN0RCxZQUFNLFdBQU4sQ0FBbUIsTUFBTSxLQUF6QjtBQUNEO0FBQ0Y7O0FBRUQsV0FBUyxhQUFULEdBQXdCO0FBQ3RCLFVBQU0sUUFBTixHQUFpQixLQUFqQjtBQUNEOztBQUVELFFBQU0sV0FBTixHQUFvQixXQUFwQjtBQUNBLFFBQU0sT0FBTixHQUFnQixDQUFFLGFBQUYsRUFBaUIsS0FBakIsQ0FBaEI7O0FBRUEsTUFBTSxrQkFBa0IsS0FBSyxNQUFMLENBQWEsRUFBRSxZQUFGLEVBQVMsWUFBVCxFQUFiLENBQXhCO0FBQ0EsTUFBTSxxQkFBcUIsUUFBUSxNQUFSLENBQWdCLEVBQUUsWUFBRixFQUFTLFlBQVQsRUFBaEIsQ0FBM0I7O0FBRUEsUUFBTSxNQUFOLEdBQWUsVUFBVSxZQUFWLEVBQXdCO0FBQ3JDLGdCQUFZLE1BQVosQ0FBb0IsWUFBcEI7QUFDQSxvQkFBZ0IsTUFBaEIsQ0FBd0IsWUFBeEI7QUFDQSx1QkFBbUIsTUFBbkIsQ0FBMkIsWUFBM0I7O0FBRUEsUUFBSSxNQUFNLE1BQVYsRUFBa0I7QUFDaEI7QUFDQSx1QkFBa0IsTUFBTSxLQUF4QjtBQUNBLG1CQUFjLE1BQU0sS0FBcEI7QUFDRDtBQUNEO0FBQ0QsR0FYRDs7QUFhQSxTQUFPLEtBQVA7QUFDRCxDLENBalBEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbVBBLFNBQVMsYUFBVCxDQUF3QixLQUF4QixFQUErQixPQUEvQixFQUF3QztBQUN0QyxNQUFNLElBQUksSUFBSSxNQUFNLE9BQVYsR0FBb0IsSUFBcEIsQ0FBMEIsUUFBUSxDQUFsQyxFQUFzQyxHQUF0QyxDQUEyQyxRQUFRLENBQW5ELENBQVY7QUFDQSxNQUFNLElBQUksSUFBSSxNQUFNLE9BQVYsR0FBb0IsSUFBcEIsQ0FBMEIsS0FBMUIsRUFBa0MsR0FBbEMsQ0FBdUMsUUFBUSxDQUEvQyxDQUFWO0FBQ0EsTUFBTSxZQUFZLEVBQUUsZUFBRixDQUFtQixDQUFuQixDQUFsQjs7QUFFQSxNQUFNLFNBQVMsUUFBUSxDQUFSLENBQVUsVUFBVixDQUFzQixRQUFRLENBQTlCLENBQWY7O0FBRUEsTUFBSSxRQUFRLFVBQVUsTUFBVixLQUFxQixNQUFqQztBQUNBLE1BQUksUUFBUSxHQUFaLEVBQWlCO0FBQ2YsWUFBUSxHQUFSO0FBQ0Q7QUFDRCxNQUFJLFFBQVEsR0FBWixFQUFpQjtBQUNmLFlBQVEsR0FBUjtBQUNEO0FBQ0QsU0FBTyxLQUFQO0FBQ0Q7O0FBRUQsU0FBUyxJQUFULENBQWMsR0FBZCxFQUFtQixHQUFuQixFQUF3QixLQUF4QixFQUErQjtBQUM3QixTQUFPLENBQUMsSUFBRSxLQUFILElBQVUsR0FBVixHQUFnQixRQUFNLEdBQTdCO0FBQ0Q7O0FBRUQsU0FBUyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLElBQTFCLEVBQWdDLEtBQWhDLEVBQXVDLElBQXZDLEVBQTZDLEtBQTdDLEVBQW9EO0FBQ2hELFNBQU8sT0FBTyxDQUFDLFFBQVEsSUFBVCxLQUFrQixRQUFRLElBQTFCLEtBQW1DLFFBQVEsSUFBM0MsQ0FBZDtBQUNIOztBQUVELFNBQVMsZUFBVCxDQUEwQixLQUExQixFQUFpQztBQUMvQixNQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ2IsV0FBTyxDQUFQO0FBQ0Q7QUFDRCxNQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ2IsV0FBTyxDQUFQO0FBQ0Q7QUFDRCxTQUFPLEtBQVA7QUFDRDs7QUFFRCxTQUFTLGVBQVQsQ0FBMEIsS0FBMUIsRUFBaUMsR0FBakMsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsTUFBSSxRQUFRLEdBQVosRUFBaUI7QUFDZixXQUFPLEdBQVA7QUFDRDtBQUNELE1BQUksUUFBUSxHQUFaLEVBQWlCO0FBQ2YsV0FBTyxHQUFQO0FBQ0Q7QUFDRCxTQUFPLEtBQVA7QUFDRDs7QUFFRCxTQUFTLGNBQVQsQ0FBeUIsS0FBekIsRUFBZ0M7QUFDOUIsTUFBSSxVQUFVLENBQWQsRUFBaUI7QUFDZixXQUFPLENBQVAsQ0FEZSxDQUNMO0FBQ1gsR0FGRCxNQUVPO0FBQ0w7QUFDQSxXQUFPLEtBQUssR0FBTCxDQUFTLEVBQVQsRUFBYSxLQUFLLEtBQUwsQ0FBVyxLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQUwsQ0FBUyxLQUFULENBQVQsSUFBMEIsS0FBSyxJQUExQyxDQUFiLElBQThELEVBQXJFO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTLGlCQUFULENBQTRCLEtBQTVCLEVBQW1DLEdBQW5DLEVBQXdDLEdBQXhDLEVBQTZDO0FBQzNDLFNBQU8sVUFBVyxLQUFYLEVBQWtCLEdBQWxCLEVBQXVCLEdBQXZCLEVBQTRCLEdBQTVCLEVBQWlDLEdBQWpDLENBQVA7QUFDRDs7QUFFRCxTQUFTLGlCQUFULENBQTRCLEtBQTVCLEVBQW1DLEdBQW5DLEVBQXdDLEdBQXhDLEVBQTZDO0FBQzNDLFNBQU8sVUFBVyxLQUFYLEVBQWtCLEdBQWxCLEVBQXVCLEdBQXZCLEVBQTRCLEdBQTVCLEVBQWlDLEdBQWpDLENBQVA7QUFDRDs7QUFFRCxTQUFTLGVBQVQsQ0FBMEIsS0FBMUIsRUFBaUMsSUFBakMsRUFBdUM7QUFDckMsTUFBSSxRQUFRLElBQVIsSUFBZ0IsQ0FBcEIsRUFBdUI7QUFDckIsV0FBTyxLQUFLLEtBQUwsQ0FBWSxRQUFRLElBQXBCLElBQTZCLElBQXBDO0FBQ0Q7QUFDRCxTQUFPLEtBQVA7QUFDRDs7QUFFRCxTQUFTLFdBQVQsQ0FBcUIsQ0FBckIsRUFBd0I7QUFDdEIsTUFBSSxFQUFFLFFBQUYsRUFBSjtBQUNBLE1BQUksRUFBRSxPQUFGLENBQVUsR0FBVixJQUFpQixDQUFDLENBQXRCLEVBQXlCO0FBQ3ZCLFdBQU8sRUFBRSxNQUFGLEdBQVcsRUFBRSxPQUFGLENBQVUsR0FBVixDQUFYLEdBQTRCLENBQW5DO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBTyxDQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0IsUUFBL0IsRUFBeUM7QUFDdkMsTUFBTSxRQUFRLEtBQUssR0FBTCxDQUFTLEVBQVQsRUFBYSxRQUFiLENBQWQ7QUFDQSxTQUFPLEtBQUssS0FBTCxDQUFXLFFBQVEsS0FBbkIsSUFBNEIsS0FBbkM7QUFDRDs7Ozs7Ozs7a0JDOVN1QixlOztBQUh4Qjs7SUFBWSxNOztBQUNaOztJQUFZLGU7Ozs7QUFwQlo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQmUsU0FBUyxlQUFULENBQTBCLFdBQTFCLEVBQXVDLEdBQXZDLEVBQTJIO0FBQUEsTUFBL0UsS0FBK0UseURBQXZFLEdBQXVFO0FBQUEsTUFBbEUsS0FBa0UseURBQTFELEtBQTBEO0FBQUEsTUFBbkQsT0FBbUQseURBQXpDLFFBQXlDO0FBQUEsTUFBL0IsT0FBK0IseURBQXJCLE9BQU8sWUFBYzs7O0FBRXhJLE1BQU0sUUFBUSxJQUFJLE1BQU0sS0FBVixFQUFkO0FBQ0EsTUFBTSxzQkFBc0IsSUFBSSxNQUFNLEtBQVYsRUFBNUI7QUFDQSxRQUFNLEdBQU4sQ0FBVyxtQkFBWDs7QUFFQSxNQUFNLE9BQU8sWUFBWSxNQUFaLENBQW9CLEdBQXBCLEVBQXlCLEVBQUUsT0FBTyxPQUFULEVBQXpCLENBQWI7QUFDQSxzQkFBb0IsR0FBcEIsQ0FBeUIsSUFBekI7O0FBRUEsUUFBTSxTQUFOLEdBQWtCLFVBQVUsR0FBVixFQUFlO0FBQy9CLFNBQUssTUFBTCxDQUFhLElBQUksUUFBSixFQUFiO0FBQ0QsR0FGRDs7QUFJQSxRQUFNLFNBQU4sR0FBa0IsVUFBVSxHQUFWLEVBQWU7QUFDL0IsU0FBSyxNQUFMLENBQWEsSUFBSSxPQUFKLENBQVksQ0FBWixDQUFiO0FBQ0QsR0FGRDs7QUFJQSxPQUFLLFFBQUwsQ0FBYyxDQUFkLEdBQWtCLEtBQWxCOztBQUVBLE1BQU0sYUFBYSxJQUFuQjtBQUNBLE1BQU0sU0FBUyxJQUFmO0FBQ0EsTUFBTSxhQUFhLEtBQW5CO0FBQ0EsTUFBTSxjQUFjLE9BQU8sU0FBUyxDQUFwQztBQUNBLE1BQU0sb0JBQW9CLElBQUksTUFBTSxXQUFWLENBQXVCLFVBQXZCLEVBQW1DLFdBQW5DLEVBQWdELEtBQWhELEVBQXVELENBQXZELEVBQTBELENBQTFELEVBQTZELENBQTdELENBQTFCO0FBQ0Esb0JBQWtCLFdBQWxCLENBQStCLElBQUksTUFBTSxPQUFWLEdBQW9CLGVBQXBCLENBQXFDLGFBQWEsR0FBYixHQUFtQixNQUF4RCxFQUFnRSxDQUFoRSxFQUFtRSxDQUFuRSxDQUEvQjs7QUFFQSxNQUFNLGdCQUFnQixJQUFJLE1BQU0sSUFBVixDQUFnQixpQkFBaEIsRUFBbUMsZ0JBQWdCLEtBQW5ELENBQXRCO0FBQ0EsU0FBTyxnQkFBUCxDQUF5QixjQUFjLFFBQXZDLEVBQWlELE9BQWpEOztBQUVBLGdCQUFjLFFBQWQsQ0FBdUIsQ0FBdkIsR0FBMkIsSUFBM0I7QUFDQTtBQUNBLHNCQUFvQixHQUFwQixDQUF5QixhQUF6QjtBQUNBLHNCQUFvQixRQUFwQixDQUE2QixDQUE3QixHQUFpQyxDQUFDLFdBQUQsR0FBZSxHQUFoRDs7QUFFQTtBQUNBOztBQUVBLFFBQU0sSUFBTixHQUFhLGFBQWI7O0FBRUEsU0FBTyxLQUFQO0FBQ0Q7OztBQzlERDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCgge1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG9iamVjdCxcclxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuICBjb25zdCBCVVRUT05fV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQlVUVE9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQlVUVE9OX0RFUFRIID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcclxuXHJcbiAgLy8gIGJhc2UgY2hlY2tib3hcclxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBCVVRUT05fV0lEVEgsIEJVVFRPTl9IRUlHSFQsIEJVVFRPTl9ERVBUSCApO1xyXG4gIHJlY3QudHJhbnNsYXRlKCBCVVRUT05fV0lEVEggKiAwLjUsIDAsIDAgKTtcclxuXHJcbiAgLy8gIGhpdHNjYW4gdm9sdW1lXHJcbiAgY29uc3QgaGl0c2Nhbk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG5cclxuICAvLyAgb3V0bGluZSB2b2x1bWVcclxuICBjb25zdCBvdXRsaW5lID0gbmV3IFRIUkVFLkJveEhlbHBlciggaGl0c2NhblZvbHVtZSApO1xyXG4gIG91dGxpbmUubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuT1VUTElORV9DT0xPUiApO1xyXG5cclxuICAvLyAgY2hlY2tib3ggdm9sdW1lXHJcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogQ29sb3JzLkRFRkFVTFRfQ09MT1IsIGVtaXNzaXZlOiBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgfSk7XHJcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XHJcblxyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9CVVRUT04gKTtcclxuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xyXG5cclxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgb3V0bGluZSwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XHJcblxyXG4gIHVwZGF0ZVZpZXcoKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25QcmVzcyggcCApe1xyXG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdKCk7XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG5cclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkVNSVNTSVZFX0NPTE9SICk7XHJcblxyXG4gICAgICBpZiggc3RhdGUudmFsdWUgKXtcclxuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0NPTE9SICk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5JTkFDVElWRV9DT0xPUiApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG5cclxuICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCgge1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG9iamVjdCxcclxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcclxuICBpbml0aWFsVmFsdWUgPSBmYWxzZSxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuICBjb25zdCBDSEVDS0JPWF9XSURUSCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQ0hFQ0tCT1hfSEVJR0hUID0gQ0hFQ0tCT1hfV0lEVEg7XHJcbiAgY29uc3QgQ0hFQ0tCT1hfREVQVEggPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgSU5BQ1RJVkVfU0NBTEUgPSAwLjAwMTtcclxuICBjb25zdCBBQ1RJVkVfU0NBTEUgPSAwLjk7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgdmFsdWU6IGluaXRpYWxWYWx1ZSxcclxuICAgIGxpc3RlbjogZmFsc2VcclxuICB9O1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcclxuICBncm91cC5hZGQoIHBhbmVsICk7XHJcblxyXG4gIC8vICBiYXNlIGNoZWNrYm94XHJcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQ0hFQ0tCT1hfV0lEVEgsIENIRUNLQk9YX0hFSUdIVCwgQ0hFQ0tCT1hfREVQVEggKTtcclxuICByZWN0LnRyYW5zbGF0ZSggQ0hFQ0tCT1hfV0lEVEggKiAwLjUsIDAsIDAgKTtcclxuXHJcblxyXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcclxuXHJcbiAgLy8gIG91dGxpbmUgdm9sdW1lXHJcbiAgY29uc3Qgb3V0bGluZSA9IG5ldyBUSFJFRS5Cb3hIZWxwZXIoIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBvdXRsaW5lLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLk9VVExJTkVfQ09MT1IgKTtcclxuXHJcbiAgLy8gIGNoZWNrYm94IHZvbHVtZVxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5ERUZBVUxUX0NPTE9SLCBlbWlzc2l2ZTogQ29sb3JzLkVNSVNTSVZFX0NPTE9SIH0pO1xyXG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XHJcbiAgZmlsbGVkVm9sdW1lLnNjYWxlLnNldCggQUNUSVZFX1NDQUxFLCBBQ1RJVkVfU0NBTEUsQUNUSVZFX1NDQUxFICk7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xyXG5cclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQ0hFQ0tCT1ggKTtcclxuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xyXG5cclxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgb3V0bGluZSwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIC8vIGdyb3VwLmFkZCggZmlsbGVkVm9sdW1lLCBvdXRsaW5lLCBoaXRzY2FuVm9sdW1lLCBkZXNjcmlwdG9yTGFiZWwgKTtcclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggaGl0c2NhblZvbHVtZSApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcclxuXHJcbiAgdXBkYXRlVmlldygpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlLnZhbHVlID0gIXN0YXRlLnZhbHVlO1xyXG5cclxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBzdGF0ZS52YWx1ZTtcclxuXHJcbiAgICBpZiggb25DaGFuZ2VkQ0IgKXtcclxuICAgICAgb25DaGFuZ2VkQ0IoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB9XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG5cclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkVNSVNTSVZFX0NPTE9SICk7XHJcblxyXG4gICAgICBpZiggc3RhdGUudmFsdWUgKXtcclxuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0NPTE9SICk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5JTkFDVElWRV9DT0xPUiApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIHN0YXRlLnZhbHVlICl7XHJcbiAgICAgIGZpbGxlZFZvbHVtZS5zY2FsZS5zZXQoIEFDVElWRV9TQ0FMRSwgQUNUSVZFX1NDQUxFLCBBQ1RJVkVfU0NBTEUgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGZpbGxlZFZvbHVtZS5zY2FsZS5zZXQoIElOQUNUSVZFX1NDQUxFLCBJTkFDVElWRV9TQ0FMRSwgSU5BQ1RJVkVfU0NBTEUgKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBsZXQgb25DaGFuZ2VkQ0I7XHJcbiAgbGV0IG9uRmluaXNoQ2hhbmdlQ0I7XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBvbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLmludGVyYWN0aW9uID0gaW50ZXJhY3Rpb247XHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgaGl0c2NhblZvbHVtZSwgcGFuZWwgXTtcclxuXHJcbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAubGlzdGVuID0gZnVuY3Rpb24oKXtcclxuICAgIHN0YXRlLmxpc3RlbiA9IHRydWU7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgaWYoIHN0YXRlLmxpc3RlbiApe1xyXG4gICAgICBzdGF0ZS52YWx1ZSA9IG9iamVjdFsgcHJvcGVydHlOYW1lIF07XHJcbiAgICB9XHJcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5leHBvcnQgY29uc3QgREVGQVVMVF9DT0xPUiA9IDB4MkZBMUQ2O1xyXG5leHBvcnQgY29uc3QgSElHSExJR0hUX0NPTE9SID0gMHgwRkMzRkY7XHJcbmV4cG9ydCBjb25zdCBJTlRFUkFDVElPTl9DT0xPUiA9IDB4MDdBQkY3O1xyXG5leHBvcnQgY29uc3QgRU1JU1NJVkVfQ09MT1IgPSAweDIyMjIyMjtcclxuZXhwb3J0IGNvbnN0IEhJR0hMSUdIVF9FTUlTU0lWRV9DT0xPUiA9IDB4OTk5OTk5O1xyXG5leHBvcnQgY29uc3QgT1VUTElORV9DT0xPUiA9IDB4OTk5OTk5O1xyXG5leHBvcnQgY29uc3QgREVGQVVMVF9CQUNLID0gMHgxMzEzMTNcclxuZXhwb3J0IGNvbnN0IEhJR0hMSUdIVF9CQUNLID0gMHg0OTQ5NDk7XHJcbmV4cG9ydCBjb25zdCBJTkFDVElWRV9DT0xPUiA9IDB4MTYxODI5O1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9TTElERVIgPSAweDJmYTFkNjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfQ0hFQ0tCT1ggPSAweDgwNjc4NztcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfQlVUVE9OID0gMHhlNjFkNWY7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1RFWFQgPSAweDFlZDM2ZjtcclxuZXhwb3J0IGNvbnN0IERST1BET1dOX0JHX0NPTE9SID0gMHhmZmZmZmY7XHJcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9GR19DT0xPUiA9IDB4MDAwMDAwO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yaXplR2VvbWV0cnkoIGdlb21ldHJ5LCBjb2xvciApe1xyXG4gIGdlb21ldHJ5LmZhY2VzLmZvckVhY2goIGZ1bmN0aW9uKGZhY2Upe1xyXG4gICAgZmFjZS5jb2xvci5zZXRIZXgoY29sb3IpO1xyXG4gIH0pO1xyXG4gIGdlb21ldHJ5LmNvbG9yc05lZWRVcGRhdGUgPSB0cnVlO1xyXG4gIHJldHVybiBnZW9tZXRyeTtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCgge1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG9iamVjdCxcclxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcclxuICBpbml0aWFsVmFsdWUgPSBmYWxzZSxcclxuICBvcHRpb25zID0gW10sXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgb3BlbjogZmFsc2UsXHJcbiAgICBsaXN0ZW46IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgRFJPUERPV05fV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgRFJPUERPV05fSEVJR0hUID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBEUk9QRE9XTl9ERVBUSCA9IGRlcHRoO1xyXG4gIGNvbnN0IERST1BET1dOX09QVElPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOICogMS44O1xyXG4gIGNvbnN0IERST1BET1dOX01BUkdJTiA9IExheW91dC5QQU5FTF9NQVJHSU47XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcclxuXHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgcGFuZWwgXTtcclxuXHJcbiAgY29uc3QgbGFiZWxJbnRlcmFjdGlvbnMgPSBbXTtcclxuICBjb25zdCBvcHRpb25MYWJlbHMgPSBbXTtcclxuXHJcbiAgLy8gIGZpbmQgYWN0dWFsbHkgd2hpY2ggbGFiZWwgaXMgc2VsZWN0ZWRcclxuICBjb25zdCBpbml0aWFsTGFiZWwgPSBmaW5kTGFiZWxGcm9tUHJvcCgpO1xyXG5cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGZpbmRMYWJlbEZyb21Qcm9wKCl7XHJcbiAgICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XHJcbiAgICAgIHJldHVybiBvcHRpb25zLmZpbmQoIGZ1bmN0aW9uKCBvcHRpb25OYW1lICl7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbk5hbWUgPT09IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMob3B0aW9ucykuZmluZCggZnVuY3Rpb24oIG9wdGlvbk5hbWUgKXtcclxuICAgICAgICByZXR1cm4gb2JqZWN0W3Byb3BlcnR5TmFtZV0gPT09IG9wdGlvbnNbIG9wdGlvbk5hbWUgXTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVPcHRpb24oIGxhYmVsVGV4dCwgaXNPcHRpb24gKXtcclxuICAgIGNvbnN0IGxhYmVsID0gY3JlYXRlVGV4dExhYmVsKCB0ZXh0Q3JlYXRvciwgbGFiZWxUZXh0LCBEUk9QRE9XTl9XSURUSCwgZGVwdGgsIENvbG9ycy5EUk9QRE9XTl9GR19DT0xPUiwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SIClcclxuICAgIGdyb3VwLmhpdHNjYW4ucHVzaCggbGFiZWwuYmFjayApO1xyXG4gICAgY29uc3QgbGFiZWxJbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBsYWJlbC5iYWNrICk7XHJcbiAgICBsYWJlbEludGVyYWN0aW9ucy5wdXNoKCBsYWJlbEludGVyYWN0aW9uICk7XHJcbiAgICBvcHRpb25MYWJlbHMucHVzaCggbGFiZWwgKTtcclxuXHJcblxyXG4gICAgaWYoIGlzT3B0aW9uICl7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgICAgICBzZWxlY3RlZExhYmVsLnNldFN0cmluZyggbGFiZWxUZXh0ICk7XHJcblxyXG4gICAgICAgIGxldCBwcm9wZXJ0eUNoYW5nZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xyXG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gbGFiZWxUZXh0O1xyXG4gICAgICAgICAgaWYoIHByb3BlcnR5Q2hhbmdlZCApe1xyXG4gICAgICAgICAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gbGFiZWxUZXh0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gb3B0aW9uc1sgbGFiZWxUZXh0IF07XHJcbiAgICAgICAgICBpZiggcHJvcGVydHlDaGFuZ2VkICl7XHJcbiAgICAgICAgICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBvcHRpb25zWyBsYWJlbFRleHQgXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjb2xsYXBzZU9wdGlvbnMoKTtcclxuICAgICAgICBzdGF0ZS5vcGVuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmKCBvbkNoYW5nZWRDQiAmJiBwcm9wZXJ0eUNoYW5nZWQgKXtcclxuICAgICAgICAgIG9uQ2hhbmdlZENCKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwLmxvY2tlZCA9IHRydWU7XHJcblxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgICAgICBpZiggc3RhdGUub3BlbiA9PT0gZmFsc2UgKXtcclxuICAgICAgICAgIG9wZW5PcHRpb25zKCk7XHJcbiAgICAgICAgICBzdGF0ZS5vcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIGNvbGxhcHNlT3B0aW9ucygpO1xyXG4gICAgICAgICAgc3RhdGUub3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGxhYmVsLmlzT3B0aW9uID0gaXNPcHRpb247XHJcbiAgICByZXR1cm4gbGFiZWw7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjb2xsYXBzZU9wdGlvbnMoKXtcclxuICAgIG9wdGlvbkxhYmVscy5mb3JFYWNoKCBmdW5jdGlvbiggbGFiZWwgKXtcclxuICAgICAgaWYoIGxhYmVsLmlzT3B0aW9uICl7XHJcbiAgICAgICAgbGFiZWwudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wZW5PcHRpb25zKCl7XHJcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGxhYmVsLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gIGJhc2Ugb3B0aW9uXHJcbiAgY29uc3Qgc2VsZWN0ZWRMYWJlbCA9IGNyZWF0ZU9wdGlvbiggaW5pdGlhbExhYmVsLCBmYWxzZSApO1xyXG4gIHNlbGVjdGVkTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9NQVJHSU4gKiAyICsgd2lkdGggKiAwLjU7XHJcbiAgc2VsZWN0ZWRMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIHNlbGVjdGVkTGFiZWwuYWRkKChmdW5jdGlvbiBjcmVhdGVEb3duQXJyb3coKXtcclxuICAgIGNvbnN0IHcgPSAwLjAxNTtcclxuICAgIGNvbnN0IGggPSAwLjAzO1xyXG4gICAgY29uc3Qgc2ggPSBuZXcgVEhSRUUuU2hhcGUoKTtcclxuICAgIHNoLm1vdmVUbygwLDApO1xyXG4gICAgc2gubGluZVRvKC13LGgpO1xyXG4gICAgc2gubGluZVRvKHcsaCk7XHJcbiAgICBzaC5saW5lVG8oMCwwKTtcclxuXHJcbiAgICBjb25zdCBnZW8gPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeSggc2ggKTtcclxuICAgIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBnZW8sIENvbG9ycy5EUk9QRE9XTl9GR19DT0xPUiApO1xyXG4gICAgZ2VvLnRyYW5zbGF0ZSggRFJPUERPV05fV0lEVEggLSB3ICogNCwgLURST1BET1dOX0hFSUdIVCAqIDAuNSArIGggKiAwLjUgLCBkZXB0aCAqIDEuMDEgKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIGdlbywgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgfSkoKSk7XHJcblxyXG5cclxuICBmdW5jdGlvbiBjb25maWd1cmVMYWJlbFBvc2l0aW9uKCBsYWJlbCwgaW5kZXggKXtcclxuICAgIGxhYmVsLnBvc2l0aW9uLnkgPSAtRFJPUERPV05fTUFSR0lOIC0gKGluZGV4KzEpICogKCBEUk9QRE9XTl9PUFRJT05fSEVJR0hUICk7XHJcbiAgICBsYWJlbC5wb3NpdGlvbi56ID0gZGVwdGggKiAyO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb3B0aW9uVG9MYWJlbCggb3B0aW9uTmFtZSwgaW5kZXggKXtcclxuICAgIGNvbnN0IG9wdGlvbkxhYmVsID0gY3JlYXRlT3B0aW9uKCBvcHRpb25OYW1lLCB0cnVlICk7XHJcbiAgICBjb25maWd1cmVMYWJlbFBvc2l0aW9uKCBvcHRpb25MYWJlbCwgaW5kZXggKTtcclxuICAgIHJldHVybiBvcHRpb25MYWJlbDtcclxuICB9XHJcblxyXG4gIGlmKCBBcnJheS5pc0FycmF5KCBvcHRpb25zICkgKXtcclxuICAgIHNlbGVjdGVkTGFiZWwuYWRkKCAuLi5vcHRpb25zLm1hcCggb3B0aW9uVG9MYWJlbCApICk7XHJcbiAgfVxyXG4gIGVsc2V7XHJcbiAgICBzZWxlY3RlZExhYmVsLmFkZCggLi4uT2JqZWN0LmtleXMob3B0aW9ucykubWFwKCBvcHRpb25Ub0xhYmVsICkgKTtcclxuICB9XHJcblxyXG5cclxuICBjb2xsYXBzZU9wdGlvbnMoKTtcclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfU0xJREVSICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGNvbnRyb2xsZXJJRCwgc2VsZWN0ZWRMYWJlbCApO1xyXG5cclxuXHJcbiAgdXBkYXRlVmlldygpO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcblxyXG4gICAgbGFiZWxJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGludGVyYWN0aW9uLCBpbmRleCApe1xyXG4gICAgICBjb25zdCBsYWJlbCA9IG9wdGlvbkxhYmVsc1sgaW5kZXggXTtcclxuICAgICAgaWYoIGxhYmVsLmlzT3B0aW9uICl7XHJcbiAgICAgICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgICAgIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBsYWJlbC5iYWNrLmdlb21ldHJ5LCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGxldCBvbkNoYW5nZWRDQjtcclxuICBsZXQgb25GaW5pc2hDaGFuZ2VDQjtcclxuXHJcbiAgZ3JvdXAub25DaGFuZ2UgPSBmdW5jdGlvbiggY2FsbGJhY2sgKXtcclxuICAgIG9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAubGlzdGVuID0gZnVuY3Rpb24oKXtcclxuICAgIHN0YXRlLmxpc3RlbiA9IHRydWU7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgaWYoIHN0YXRlLmxpc3RlbiApe1xyXG4gICAgICBzZWxlY3RlZExhYmVsLnNldFN0cmluZyggZmluZExhYmVsRnJvbVByb3AoKSApO1xyXG4gICAgfVxyXG4gICAgbGFiZWxJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsSW50ZXJhY3Rpb24gKXtcclxuICAgICAgbGFiZWxJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgfSk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuaW1wb3J0ICogYXMgUGFsZXR0ZSBmcm9tICcuL3BhbGV0dGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlRm9sZGVyKHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBuYW1lXHJcbn0gPSB7fSApe1xyXG5cclxuICBjb25zdCB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSDtcclxuXHJcbiAgY29uc3Qgc3BhY2luZ1BlckNvbnRyb2xsZXIgPSBMYXlvdXQuUEFORUxfSEVJR0hUICsgTGF5b3V0LlBBTkVMX1NQQUNJTkc7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgIHByZXZpb3VzUGFyZW50OiB1bmRlZmluZWRcclxuICB9O1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIGNvbnN0IGNvbGxhcHNlR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBncm91cC5hZGQoIGNvbGxhcHNlR3JvdXAgKTtcclxuXHJcbiAgLy8gIFllYWguIEdyb3NzLlxyXG4gIGNvbnN0IGFkZE9yaWdpbmFsID0gVEhSRUUuR3JvdXAucHJvdG90eXBlLmFkZDtcclxuICBhZGRPcmlnaW5hbC5jYWxsKCBncm91cCwgY29sbGFwc2VHcm91cCApO1xyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSBjcmVhdGVUZXh0TGFiZWwoIHRleHRDcmVhdG9yLCAnLSAnICsgbmFtZSwgMC42ICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSBMYXlvdXQuUEFORUxfSEVJR0hUICogMC41O1xyXG5cclxuICBhZGRPcmlnaW5hbC5jYWxsKCBncm91cCwgZGVzY3JpcHRvckxhYmVsICk7XHJcblxyXG4gIC8vIGNvbnN0IHBhbmVsID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggd2lkdGgsIDEsIExheW91dC5QQU5FTF9ERVBUSCApLCBTaGFyZWRNYXRlcmlhbHMuRk9MREVSICk7XHJcbiAgLy8gcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCAqIDAuNSwgMCwgLUxheW91dC5QQU5FTF9ERVBUSCApO1xyXG4gIC8vIGFkZE9yaWdpbmFsLmNhbGwoIGdyb3VwLCBwYW5lbCApO1xyXG5cclxuICAvLyBjb25zdCBpbnRlcmFjdGlvblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIHdpZHRoLCAxLCBMYXlvdXQuUEFORUxfREVQVEggKSwgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjoweDAwMDAwMH0pICk7XHJcbiAgLy8gaW50ZXJhY3Rpb25Wb2x1bWUuZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU4sIDAsIC1MYXlvdXQuUEFORUxfREVQVEggKTtcclxuICAvLyBhZGRPcmlnaW5hbC5jYWxsKCBncm91cCwgaW50ZXJhY3Rpb25Wb2x1bWUgKTtcclxuICAvLyBpbnRlcmFjdGlvblZvbHVtZS52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIC8vIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIHBhbmVsICk7XHJcbiAgLy8gaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlUHJlc3MgKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlUHJlc3MoKXtcclxuICAgIHN0YXRlLmNvbGxhcHNlZCA9ICFzdGF0ZS5jb2xsYXBzZWQ7XHJcbiAgICBwZXJmb3JtTGF5b3V0KCk7XHJcbiAgfVxyXG5cclxuICBncm91cC5hZGQgPSBmdW5jdGlvbiggLi4uYXJncyApe1xyXG4gICAgYXJncy5mb3JFYWNoKCBmdW5jdGlvbiggb2JqICl7XHJcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICBjb250YWluZXIuYWRkKCBvYmogKTtcclxuICAgICAgY29sbGFwc2VHcm91cC5hZGQoIGNvbnRhaW5lciApO1xyXG4gICAgICBvYmouZm9sZGVyID0gZ3JvdXA7XHJcbiAgICB9KTtcclxuXHJcbiAgICBwZXJmb3JtTGF5b3V0KCk7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gcGVyZm9ybUxheW91dCgpe1xyXG4gICAgY29sbGFwc2VHcm91cC5jaGlsZHJlbi5mb3JFYWNoKCBmdW5jdGlvbiggY2hpbGQsIGluZGV4ICl7XHJcbiAgICAgIGNoaWxkLnBvc2l0aW9uLnkgPSAtKGluZGV4KzEpICogc3BhY2luZ1BlckNvbnRyb2xsZXIgKyBMYXlvdXQuUEFORUxfSEVJR0hUICogMC41O1xyXG4gICAgICBpZiggc3RhdGUuY29sbGFwc2VkICl7XHJcbiAgICAgICAgY2hpbGQuY2hpbGRyZW5bMF0udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgY2hpbGQuY2hpbGRyZW5bMF0udmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmKCBzdGF0ZS5jb2xsYXBzZWQgKXtcclxuICAgICAgZGVzY3JpcHRvckxhYmVsLnNldFN0cmluZyggJysgJyArIG5hbWUgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGRlc2NyaXB0b3JMYWJlbC5zZXRTdHJpbmcoICctICcgKyBuYW1lICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uc3QgdG90YWxIZWlnaHQgPSBjb2xsYXBzZUdyb3VwLmNoaWxkcmVuLmxlbmd0aCAqIHNwYWNpbmdQZXJDb250cm9sbGVyO1xyXG4gICAgLy8gcGFuZWwuZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIHdpZHRoLCB0b3RhbEhlaWdodCwgTGF5b3V0LlBBTkVMX0RFUFRIICk7XHJcbiAgICAvLyBwYW5lbC5nZW9tZXRyeS50cmFuc2xhdGUoIHdpZHRoICogMC41LCAtdG90YWxIZWlnaHQgKiAwLjUsIC1MYXlvdXQuUEFORUxfREVQVEggKTtcclxuICAgIC8vIHBhbmVsLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlTGFiZWwoKXtcclxuICAgIC8vIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAvLyAgIGRlc2NyaXB0b3JMYWJlbC5iYWNrLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9CQUNLICk7XHJcbiAgICAvLyB9XHJcbiAgICAvLyBlbHNle1xyXG4gICAgICAvLyBkZXNjcmlwdG9yTGFiZWwuYmFjay5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0JBQ0sgKTtcclxuICAgIC8vIH1cclxuICB9XHJcblxyXG4gIGdyb3VwLmZvbGRlciA9IGdyb3VwO1xyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbDogZGVzY3JpcHRvckxhYmVsLmJhY2sgfSApO1xyXG4gIGNvbnN0IHBhbGV0dGVJbnRlcmFjdGlvbiA9IFBhbGV0dGUuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbDogZGVzY3JpcHRvckxhYmVsLmJhY2sgfSApO1xyXG5cclxuICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHBhbGV0dGVJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgdXBkYXRlTGFiZWwoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5waW5UbyA9IGZ1bmN0aW9uKCBuZXdQYXJlbnQgKXtcclxuICAgIGNvbnN0IG9sZFBhcmVudCA9IGdyb3VwLnBhcmVudDtcclxuXHJcbiAgICBpZiggZ3JvdXAucGFyZW50ICl7XHJcbiAgICAgIGdyb3VwLnBhcmVudC5yZW1vdmUoIGdyb3VwICk7XHJcbiAgICB9XHJcbiAgICBuZXdQYXJlbnQuYWRkKCBncm91cCApO1xyXG5cclxuICAgIHJldHVybiBvbGRQYXJlbnQ7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgZGVzY3JpcHRvckxhYmVsLmJhY2sgXTtcclxuXHJcbiAgZ3JvdXAuYmVpbmdNb3ZlZCA9IGZhbHNlO1xyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbiogXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiogXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qIFxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGltYWdlKCl7XHJcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICBpbWFnZS5zcmMgPSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFnQUFBQUVBQ0FZQUFBREZrTTVuQUFDQUFFbEVRVlI0MnV5OUIzZGNSN0ltMkx0N2RzL01tOW5abm1mNnZiYnFsbG90N3lXS3BPaEFDeElFUUhpUGd2ZmUrd09nQ3A3ZFBmODR0NkNYMGZYVlZ4RjU4MVlWUUUwM2VVNGVTZFN0YTlKRWZCSHhSY1RQbkhPTitkR2FIeDM1MFprd092eTFsNzk1NGYvWmtoL3RLWDc3S2ovcUVuN2JsaC9OK1ZHZkg3WDU4VVYrM01pUHUvbngyRC83bGIrdUt6OTZqZEhscjNubGYvUFkzK1B5ZnQvbHgrMzhlSkFmVC8wN3lUMjc4Nk12UHpKKzlNRzlHdUdhL3Z3WThPUHl1aDcvbmZqdUQvUGpUbjU4bng5ZjVjZkgvbHZ1K1A5WDY2OXRvdS9wOS9mVTdxODl1OSsvWjdlZjA4dDNhTWlQNS9ueHlILzNUZjhPZjhxUHovTGoyL3o0QWQ2andhOUpwMytXTnFkNC81ZCs3aTduOEQveTQvZjU4VUYrZk83bjk0NS85blBZWjlxOWUvemZ0eVNzcS9Yc1cvbnhkWDU4a2g5L3pJL2Yram4rQWRiM2hmKytacmgvRDYzelFHQk9PLzM3Ti9uMWV1NzMwMzIvajc3MTMvMVJmcnlYSDEvNk9iaVZZdDlxMzNmNXU1cjh1T2VmazNSZStZdys4Yis5Q2Z2djh2MStreC8vbGgvL25CLy9YMzc4OS96NHIvbngvK2JIei9QalgvMDE3L25mZk9YdmNjL2Y4MFhFdTdUN05XMzA4L1dObjQ5Ny9ydWUwNXAwK2puUTlrZTNJUnVxT1IrL3lJOS9nZm1vNXIxL2xSKy85TS80MXpMdWZjZnZBOXpMci94Y3RNSm84WC8zeWwvend2OEdaUTNPZDlLYVhjN0hyL1BqWGIrM1pSL2M5OTliNTg5RXUxK2pOTEw0bnBlTFgvcDd2K3ZucVFYa1hHL0UwUFpIbzMrM1p5U0RVUzQ4Z2Jsc29qMklNcGpsY0Fia2d6eS9TOUZ4VDh2NEZya2ZmbE83djYvSWRQbXVSMzRPYi9tejlkblAwdjd4Tis4aGhXS05mbjl0T3luTG1OK2lBbXNLL0ZZVXJpaUVldjl4dC8wQmtFTXY3MzM1bStIOEdLRXg3UCtmdkcrai8yMk5GOWFzL0p2OHU4azlMKzh4N3NlSS83dHV2eERkL3I5SDgyUENqN0g4R0ZMZUhVSEFEUTgrZnFBREtVcTNGNzVuMUQrYjc5K3JQSHZjLy8vTDl4d0V3TktxZ0lETGQvalFIN3J2L1VGK0N1L1I1ZGRnU0psVHZIK25uN002ZjVoRlNJaXl1T1huOTVsL0I1bTNqTEplUS83dnV4TFdGWi9kRE0rVzcvcmNBNUIzL0J6WDBQcUs0dTFUNWhubm11ZDBDUFp2cHlMMEdRUjhTSUxtY2VTKzVibXQ5KzllNjUveklPSzg4aGw5NGRmK2pnY2tuM2tBK0k0SFNyOEN4U2VLL3ovOGV2NE93Q0lDT2dFeU1lL1NEY0Q1SmlsL1VZSzRKa1BLdkF6REd2RDVxdFo4L0Y2WmoycmQrejEvTm43djUvVFhaZHhiTXhZNkZjWEN5ckFKNUJES21qNEY5R3ByOWd2L3p1OHJSc056LzI0ZC90bURoc3pRWlBGemY0OGZ2SHovMUQvanQvNzkrZ015YUNSaGZ5Q1FaaG5NY3VFVnpHVXZ5YjR4UlRhTXd4Z0YrVENvNkxpNk1yNUZ2a2UrYVFDQVJoY0FuQVl3UXY0R0Fzb0JBRDMrNVVkSkFHcGoxRi9iQXdwOElQSzNxTURhQTc4ZDl4L2ZENEx3TzdDaVh2cE4zTzNmNWZMNjZmeVlvVEh0LzkrZ3Y3YkYvL2F4bjZ6N2l2THY5ZThvOTV6M1k5cS9ad1lXZEJTdVdjaVBXZi8rK080aXBKNzVUU2RLZ3BXdTNIUFlQM3ZLMzIrTzdqOE9hNFhQbnZmWFR2dDNHQUdGS2lDZ0Z0N2hFMjh4MzRhRDNPVGZJK1B2UDZYTTZReDhZNi9mQXczKyszN3JEL0NuSUNSRVdUVDdkeG53KzREdlBRWHpHMXBYZVhZZmdib0hZSFdKSlZIajMrdWxmMzRIZ0tjUm11ZDVtTXNGK084NWVMOHhFRExkSlBRRkJOd0NZY2FDcGpGaTMrTGNkdmo1YlNGckp1bTg4aGx0OE85dzM4K1JXRnNmZUcvSkgvemFYVnFuLys2VjB6dCtEdDhIc0hnVDltMkR2M2ZNdXd6QStXT1BFTW9RWEpOcE9zZVhZOUtRRGRXWWo0OXBQbjduZ1VBMTd2MkpIeC83dVh6ZnoyM2FlMnZHUWtZQlRLZ01lMGtPTlN1eUptbk5mdW5uQkkyR2V5Qy9XdjA3RGtYSzRoNy9tM3J3bUloaDlJRUhTWDMrV3lZTkdUUVQyQjhNcEZrR28xeGdvdy9sN3d6SVgwczJ6SUo4MEhSY1k4cHY0Vy9DKzRvUmlzWmRJNE9BY2dDQUNPVVorRWhyelBockJ3S0swQnF6cEpDdDM4NzV5VUlsY3dNMlhZT2YzRDcvKzh0M1dzcVBGUnBML3YrTmdzS1FBM29QWExLcy9DZjh1MTcrZnMyUFJiOFlReURBSi8zN1h2Ny9qZnhZaG5jZkFTR2x1YXZ4MlRLUHNrbm0vTE5YL2IzWC9mMlgvRnlOS005ZTkvKys1T2NTRldvWGdCODVjS0trNy9oM3FmUFh5RUdlOHZmbk9aVnZISWM5ME9RMzRUdmcvcjhCcnVKNnY0YTkvdDJuL1h6aWZSZGdmcTExbFdkUCtQbnY4blA3Z2l3SkNRTThCZVV2Rmc4S3FUbTRQODZ6ektmTTZiSi8zMW1ZMTBIRjhrT1g1bGVLb0dtbmZXOTkzemhZRTMxS1dDRHB2UElabGZVUjhQZU5mNy9QL1Q3NDBNK1hXTUR2ZXF2MUkyL3hmUUZnc1liQVl1aGRFRGozK3pOV28zaUU1QjZ5Sm90K0xuQmVaQTAwMlZDdCtmZ0M1dU45UHgvVnVMZU1yNzBDL2N6UGJkcDdzN0VnZTNsU0FVeWlESWZJR09ud2Uyb1laRTNTbXYzRzc0OVB5Qk1yMXI4WURXTWdOME95V083N0Nvd1NDZUZKeUdUUW4vTjU1VjZhVEpMOU1VOUdFSDY3eUdDV0N5TDN4VERCUGJnS3NrQ1REYXYrdWlWRHh6V24vQmJybStZQVJJMkFFZExHSUtBY0FDQUNmNUUrbE1jNktjSWVReEZhQXhWWWIrQzNxLzZEeDJDemlLdjZtZi9nRGo4SjQzNkNMdDl0aDhhNi8zL2ovdG9PLzl0bllQV0tTNWFWLzdKL2w5MzgyUGIvUGUwUERpckp5Mi9heW8rOS9OajA3ejRQSUtDUDNFSGlybjRHVmxRdkhNaDVmNDlOL3cyWDk5MzMvNzdpRDlFSVBYdmZYN2ZyLzNzTkZPb0lIVGdSVHArQlYrV0pQeEN0b0tSbi9QTzJhVTQzRlRBa1NwaGpoQS9BN2QwQlFtTE9mNlBjYzV1K3pWclhUZGhEb2dCYUFkamM5ZC8wdVZkZ0NPNUU2Q0c0azNuZWhubStISWZ3NzdMK0cvNGRGLzE3amhNSVFKZW11SDgxUVlNV24vWjlpeVRBUjVXd1FPaThhbWUweGUrOVIrQUN2ZWxCMmpkZThYMENGdkNIZm45ODVVSGk5MTVBaTBkSEE0dmF1OGcrbkFUQUptQ1RQVUlDQ25GTmNIOXNCV1JETmViamxqRWZsZHo3QnhxMy9GeCs2NEZBMm5zM0s4YkNyQUdZQkxDeU1kSURjazdPWWRLYXZVTzhIczBUTytSL3MranZvOGxpdkc4M2hmQTRaRExzOThTeVgvdWR3TUQ5Z1ViUUpNbS9KaThUNmdKeVlSSG1SUGFneUlJRFAvWkI1dkx6V2NlMXB2d1d1WitNVFQ5M3EvN2VjK0NOSEZCQXdNTnlBQUMrNExZWGdOcUlVWVRXYjFtQjlScS8zVGNVZHd3QXVQenRzUi83Q1FBQTNWZm9ra1hsZjduQXVjanZ6dnBuYmdFSW1GRGNRWUo0UlRtSkVCeUhBeWxLL2ZMWkovNTdRZ0FnNjY4N2duWENnendFN2p3NWNBd0E2ZzBBc0FOem12WFBXeklBQUZvSkVpTkU5NzhnNFFVL3Yvc3d2eG9BbVBQZkllc2djekFMbGtRN3JDbTZYVDhrY0RjTVFtOFpoTlNCdi9mbDk1M1NPSUh2M3ZmdnVRN1dqT2JTUlBkdkhWaktmZUJlblBIN1l3bjJyY3d0V2hOelJzZ2xkRjYxdlNyci9zU3YvVU1QenU1NmErNkd0NzQrOCt2M2hWL0RtMzRkNy9uckh5bmVvdEM3YUh2bEdYbncwQ08wQm11UzlldHk1UCtaRFp6cGN1ZERDSmFQL1BmZFUrYWozSHMvVWthTjN4cy9lSG1XOXQ3dFpMMkxSYm1oQUNZQnJHeU1ESkNjMi9UekhWcXpkNGtFK2dEa01IdGl4V2pJS25KakdaUmpYMEo0aXVjbUIvZkRnZnZqQUl3Z05NU0c2SXpHeUlWOStJWVRSVGFnZk1nRmRGeHJpbTg1aHZ2Sk54MkNBU2dHcGhnSlk4UkwrekVVV3cwQWNQbndjL3JZTklvUWYzZHVLTERlZ0JLdEJBREljNU1BUUowUzh4YVhyQ2ovSS85T01kOTk0RGZFZ2YvdkZjVWRoRzU0RnFKVDhPeDkyRnlIa1I2QVEvKytwM0NRVnlnRWdnY3VMUUM0aUFBQWZ5SXJnVDBMc3M4WUxMSlh3UklvZTdDbUU0cmI5YUVYNEpJTndQSDJPWCsvVFFBVnNsK080SDFrUGtVQW5QbjF5SG9CczA0dXpReThCNUxBTEVFamluL0xmNXNJRzgyYTBVSXUxbm5OQlpSU2cxL2psLzRkaFZSWTQ5ZnFscmRNdi9JSzhMWS9idy85ZnFuMXYzc0pydWlld0x0WWUwVUR2dk9nL0ZGK0hJT3dQRWtCQUtveEh6YzlDQ3JuM25YR2VBNXMvSHRsM0xzYlFEUWJDMWxTSEpveGd0d2hsSFBIc1AvVzZIeDFLZVEvamRlREhpMjU1NS85T1BMblppMFFQbndJSVpOUGpibDVEZnRDOXNTSlA1OFhjSTVaQm8vQlhua1ZLUmRPUUhlSklrYWdsSVhyemdJNnJqWHlXL2liNUw0aWUzTCsrVHNRa3A2bU1PK1BIcFZxQVlCVGNuZnNSeXJDZlJvbjF3d0FEaE04Q1kyRyt4MWRjYnR3bUhZTmF4bzMvU3FoM24xd0IybHhyK2NRRis5VFhPNDVFSGhiNEJKRTk3ZFkwaEtqMm9TRGQrei9mUzN3L1ZjQkFKZ3NodGFleEwxbjRiNDVRNmwzazN0ME13QVdlc2l6Z2E3RURpWGVMZ0RyeUIvd0UwRHZXK1FPbGRDQUtLVXoyQlBvb21WQ3BGZzBJVUd6NjUrTENvNEYrSjRSY3JFRVNpNWdPYlpEbXBpa1NMMzBpZzlUR2IrSGRMTW5zRmN4M2F3TkdPemF1NFQyaWdWOFpZMVBBVWlqVzNRdkpRQ0ltWTgyWXo0d3RTcnR2VnVNSVdsNW1ENmE5dDdvTVZrQzYvMEVBUEtlbjBjMFJwWkJEazFCeUhVSHZDeThwMGVBTi9XaDl3b3grYTh0QU93dno4cGY4dU92b0VzMmxMUExJVHpKNUFuTkRlNkpQVGhIcC80YWxNRmEyQ0ZHTHB6Q25HNlRYTmdDVno0K1B5MEF5Q251L3ozWTY0ZmczYjJBZDlvaFhocXVWV00xQWNBK0VCN1dBMlE0VmticmdBU3ZFZ0QwVTB5Wk9RZGF2RkFVWUxQaGZyY1VPUk5qK3NBU1IrQndSQWRxd1hCRG9XSWNBM2YzTGlqeEhmOU9RczZaQWZROEFvU1ZoY0RhWFNjQStDU0JMRFpPVm9MbDFnOWR2NTNnMmJqdjk4b1hDbGtUd2QwRkNjazFjTDB2QUVseEhkeXpBZ0xFSzdTYVlORzBFOUZWaExZSW1qT3djby9nbjhkdzJMWDVUcU00K3Z3NzlGTStkZ2RrRjJBV2c5U21FUExpSzFlbzNTRHBabmpQdEFDZ2lRaWhESHd2YUg1WFFLNVlaenJOZlBUQ3UvZTVRdTJGRHNwOWZ4eXcwa05LdWhOeXVIdVVmRzVrYnFlOU40ZkdkbUhmN0lEY1JSbTJSMVk5eXJsRHcyQVpJNnVTejNXdFF2NURYazhPck9kVHY2WjRkbWRKbG1JbXp5M3ZoVXFhR3lSSWI0TDM2SXc4VUJwQXMrVENFU2phUXdqNUNmZEhaTU1TY0M3V2diT3lYUVlBMkFidXhpcVF6dGZCQ05rSEdYeEs1NE85TmMxWEFRRG1FOUxoVUJuTmcwdXZtZ0NBc3dEYWxCamlNbzNGUU15Sldla29uRTlna3RHVmo2a3hXdWhBRURtNzRXY1ZMMEFTQURpQnd6dEhoREFSQmlNUVUwYXIrazBCZ004aU1ndllvdDlTaUgxSkhnUDJiSFFxak9LdktKU3dESHZzak5ab2xkakRFNUFHdEVqdTZYUHd6aVJaTkoza0tVS2hqUmJHUHV3M3RDb3FCUUFqL3Z2SElJMW8yTzhoelBYR1ZFWXVGdE1CKzIzUXVHY2FBSUNwbUx5K3gzNStEMkZ1WnlCTjA4b1FTcU5JUitEZFJ5RmxyTjlnVmFkVjBsakhZSmp5dVpHNTNWRG12WmxEYzBxZU1TSGhIU2lXTjhmOVQwaE96U204bGdhRi9GY1hJUC90Z3d0N0Q3N3BHTHg5QzBZbWo0VE92bzJjbXpuaTBvZ0hOTWxERTVJTENQRFhLUHNIWmNNMDdNdEZJNXRKbmhmekxUT1E5ajFIOTkwRUVQQWExblZMSVIyMlhSVUFzQXJpZEpFeVl2TFdkWVVBMW9nOXVaM2dBdTlVclA4ZGNNbnVLUlo4THdnSUpnK3lnTmZ1Z1Z3QUt3U3c0My9QTVU5MGo3ZjdlWThCRDljSkFDdzNvUmJUejVHYkRnVkNLN21YMGJXSUFtMVNlUWRoWDMrcnhKaFpRR0RNY3hLVWdRanhVUUF0R0M4TldUU1Nhdm9zRU1vNEk2c05TWUFyd0EvWXFUQUVNQU81ekhPUUlqWUI1NWhUR2JWaU1aSWloZWxtZk05WUFJQjFOcVlVV1hGSys0THpvYlU2QUxIendlOCtDL014YXJDcTB5anBRVWdsbTZZeEJjOFFwWmNXQUxDeVBUUU1OZlMrNGpva3hmMG5DWVRMSERENVQwdkRYZ2JQQS9JWURrR3hIbHBLaXdpMDM2ZVltM0VGUkNZQkFNMjdlQXg4QlpUYnNtNVNrR2NRQU40b0dRdGN6eVR0L2tSZ2plZGpoVUFieWkvMFF2NG80NjhTQUdSY2FVbGNBUUc5NUE2NmJnQ3dEcXp5WElRRnpGWXBJdXFRdTBxSVhvMEtrNWxqWUZrbEJpZWVDRTY3NC9rL0EwdUkwM0thQXQ5L1F1RURkSmUyWHpFSkVLdi9pWnV3dzJEMWErOG9heFRLR3NncVZpNEtFU3dzb2duTWtERHFCMWR0RCtVMnM1djZoUGdMR0FZUWIwU1BrZ0tVSlN1WEFjQVNXRFVyS1VpQUxGQVd3RTI1QnU3MEpWQ3NuTXI0U3NrMUg2RVVLYnpuR3R3ekZnQmtRR2pMN3pRQXNFN2V2Q1h3eEdWY2NZR1htUG5BT1YyRmQxK0crV0JXZFgxS0pUME9YcU1ZYjJRNUFFREwva0d3ejdJWDEyRk40VGR4M0w5ZlNWdG04cDlGNHR3RHQvOEI4WkpDU3F1VFVwUnZwNWliQ2NVQU9qTzhpd0lBTExsd0RyOWJKcEt2aEhlNlhIR1pZREVXdElxbUxXWHNvWDY0N3pDRmJYYmdmSjBhUElldXF3WUFJcUNsREtIVThkYmMyVzhDQU1SbUFWaFc2Ym1SRHNPcFhwTEx6RHdJVnNUc3hwZjMwTnpqQ0NET0V4UnVaK0Q3UTRTVStpdjBBSHlqc0lRNTNxWXA4aGxTNUtHNkFVY0d1T0ZZNGsxbFgyY041WTB4dEJhSWUxdWhpM01DYUlzRTBHUStlb3gzd01PckFZQXBzaXFTMGdDMW1PSTZoUlIyZ09pNEZraGwxQXBUWWJvWmtwOTI0Wjdya1FDQWhlODJrQzBSQUxBM0wrVDFpUkd3NjVTRHZVZnpzYWlFTjlOWWIyTmdCS3hIZWlQTEJRQ0xSSnBFV1djQmdDU2k4cGdyTFJvbWhjdkVxOGR5UWlOeENxOWxGN3l5U2FFenJ0SjZONFhiZkI3Q0d2dkFyQStGR3pSUWZrRmVWL3dkbm8wbUlNTzJ1OUsrSnRqVFJLcXZsa05TeGRSaFhQTUR5SzdqTS9iajc2OERBRFFDVy9aWklKNzlVd1lBR1FPOWFwdGdBQ3p2NXhBblpUTGlMQ21xMHdBYkZTdkRjV3p2SUlFRTFrenhaZjZkUlg3Q2FuSlhBUUJ1Qk83SEJ5N2t5cTlYaUdLb1FQY1RZb2xTRlhCRTRVZThKdStEVmxPQXlZc003b0lIRUxJU3VvMDlqaURUQWdCWTJwVUxBU1VKbEUzS1l6Nm1mR1ZPWlJ3RHBXY1ZwdHFDaklnajQ1NnhBSURuSXdkZXIzUDRiOHlLQ08yN3BQbllVTEl1amlIMWMwY2hPUGRFRXJnd3ZMQkk3UHFjRW1xcUJBQllIQUE4UzRzS1AyQWpNbFZadnBuTFd6UDVyNE84WTB6K1EzQ1B2SUJ6NGxaeGxWYVJ6UThpNTBZOFVadVF0bjFzWkQrZ2tSQ1NDNWl1eU1iRmN6OGtIYmJSbjhjV1Y5eUlDWHN2UENvems2UTVRSVkrTWNEUWozcjF1Z0NBRkY1NStyOHBBR0NyOUlEUTQxb2dnK0JCZ3BMVDhxRjVrYmw1aHZZZGFRR0E5VHROaVZ3RkFOQ0toRmpnS0VUbVErOEtXNHdIQWZjZXB4UnAzMkVlSFBpOXRzZDRUeWNkNERvSVkwd3FheVQ3Yk1NQUFFUE83aENZSkZBT0tLZjRHQVJ3VWlxalZaanFBTnlyeDZDWWM2Qk05OG9FQU1kdzczTWxON3BTQUxBSEFJUG40MVFoL0dMSUxGWjRMN2pTV2dZOHo1V0dBRElLMytnWXJsOGpxeHYzR01iOW1VRSs2cCtSVVRnaFR4TElmd3NLK1ErTm5sVkZ5VnJlTitUeEpNME5lcmNPSUJ2Q3FuK0E4aUZKTHFDZTZxUHdZbzAzTUo1NE9mSGN6OHRMUDdqZXc5MHlBWUNXUHIwSzcvdG5TNisrQlFCeDcyNVpadnl1bzhvbXVPZnNrcWhMNUZiS0dla2hXdk1NL281RFo1ZmVEWEVBVUVGYWJ1U3JBQURTV0lqamhCTUtUNE01RnBpbHdUWEcyVk1UcWdyWUFIdFRJMGhlUkNqdW1EMGRBd0FZUUtBd1BQTkNhOThBQUVJWTY2V1k3TE1FZ1lLQ0hrdEU3N3ZpZWdhb0NMQllDbWZHb0hBL285em9MVkN3aDBCZWpRRUFpNUMrdGFPRUFEZy9PbFNDT21rK2pzRGEzNFBuNWNnMXJSV1ppdVVYckZHNjZCRW9YL1MwVkVJQzdDT1AyQmF4K2JrT2dNZ0JLKzR2NmNYQ2NoOXplbytMdE9RL0RORXhMK29za1AyRERZS3N1Y0Y2R1ZnODV3RDJDVmRBeEo0c2RZWmNpRG5QV0RyNnJwY3hOYTVRSVJNcmJkNTNkc1hIR0FDUUpJLy84aFlBVkFZQXJQemxKT3Z3TWVSS3Z5QkxOUVFvT0dhTkxqUWtKMjJDdFJXcWZHZFoxemtsajFvamtsMEZBSkQwdjVkT0wvYXk1ZXlTb3owVWUyeWdEQUltNGxrRVBHekdvdTFGL282ckJBQmFxaW5XSWpnRFpZMVpBRWpTRzFKQWdDVlF1Q3pwQnVVVjd5aEtqOE5URm1DNUlBV3lUTG5Rbks5czdSWDBMcUFiVnlNQnhqYWhTcG9QMlM5YlFJaGNKMkJ6U0JrcGFRREFLdXp0VTRxeEx5dHU5bkxUQUpGdmhLR1pmVktJVWpWdTI0ajdjMk1icThlRnZPZkRTUEtmcHR6bmpSUzlIUVY4WW9PZzBKcG15ZnQwQnQrODYreWVMQkptS0ZjdVNJYlJEVTkydmdNZzRLRWZVdTc1anIvbXU3Y0E0S2NKQUViS1dCVGNCRnFkZTJhV25pdjUvR1BBOGtUM3ZWZzYrNjY0cHI5VisxNHJyNHQxREE0U3JLZXJBQUQzeTFEZUdzY2lGa1FrVlFYVVhHZXZyOUVEd01XbVpnZ0VZSld2SXlDL3JRSHJuZnRKdkVxd2pnNkkyQ1lwYjR0R1BKWUYzcUNTMTQxbmFoTXNXc21GWG5CNk1SOHJEVkRZelRPQk5FRFpIekZ0cUszNU9BZlFzZ0hXK2h6dGlmTUtBTUFLV2VJbk1FK1NXNit0NFF0WEhqbXNqOGlaVnZPa1RTUHVMMXdPYm1qRFBTN1FVNEh5b1NlQi9MY0g5MW9DNDhZaUExcjlTbUpDQU94OU9vVnpwSVVCNVA1anloNklPYzlpL04xMWhkNFlUNEVYOE1MLyt6Ti83UU92SzhvRkFKb00zVkdBMUZzQVVDWUE0Tno3QzJmWC9tY0FVQk1naTVVREFBN0JuWVg1dVZvbHdaZk9ybVNJaHo0VVA3MEtBRkNUd24xdkVmQ2VsUkZHc0tvQ3BvbjFvUXRTUzJGa0VrN01YaEVnSkYwekdRUnN1K0x5bzhkQXFFUHJjU0lsTVUwRTM1Ui9wdVlsc3ViQlNsdGtndFE0NUVLbnFRTWc3T1pCUTFab1o5Y2lRNHBRRGxtTDZJYWZCZUN4VWlVQWdFVmFVTkd1Z3ZJZkppL09pd1EzdDZVWXRHNkFBdTY0bmF3Vzk4ZnFmemtnZEhLUEMrWXE0SG5vcDlUWUhWZGF3WEhMR0JvWmNOazR2MmxJZ0ZzS3orUEFTTUZ1VHlFWE9QejcxTXYvSjM1TzVJeExtZXhtdjc0TllFalVsQWtBR2hOU3FNMVE1bHNBVUI0QXlQMEVBRURPbFJib1dIQjZwVGxPUWVRU24yOENBRHlLSVBCbEEvRS9JZkJWZzBoWTYvUlNzNjhEWVJuWkgzVXVYSXZnTkNKTnM4N1B5U3RYcUp1UElHQUJyRGNrVUoyQmx3UkJBS2FucGFrRW1FbFFrSHd1TFlhMFJaQktXd280S1dYWU9yc2FHZkpwSkdNYzJlNGpWUVlBZTY2NENkYzJ1WitsSERPR2NJUmRuMVl4Y0kwR3FUMkFLYU1MUnI0L2V3TzI2ZjFET2ZwMVJrb3ZobEZlQTVnSWpWTWdzUEg1SFVpWmZvbHBnRmpPVnlNYjR2MURXUUJhMnJhOGs1RDhwS05nc3djSFVpYTdHekpwbW9CUVhHNFdnSlZpZmhwS1YzOExBTXJuQUx5cEVBRG5iQjhwekdST1piRktHUjlBdkc4bmtFUDl6UlVBZ0NlUktYeGFjU01FRWJHcGhQc1IrZUVhTHlNcDMxZVVsTlhvNUp6U3I3UkNUZUlXYkFET2hvQUFxVEE0VDJtQUI2Q1FzQ0laaHpuUzdsMytCaUdvYXVkU2N6ZUdnSEZhQU5CUUpnQ1EraU9OUUlhc0tjUEZXazBBc0F2ZUd3MjBNd0VOUWN2dE10YVJxelJLU2VVaGw5eVliQWNVdllDVVpXZVhEWjZrTldzelNJaDRwbUlIbnA5TnlrUkptMzQ1NFlwTHNUUFpVUHNleTh0MTZrcnJGS0QzcGhWUy9xUWFxeFRBRzNLRmFvRzlSRG9zcDU5RWw3T0x6R2xobEwrRlV0OENnUElBUVBhS1NZRE1lTWR1VkZoaERVcytjakVMakpWcnpaQjJDRHpJSWRlcXFOMEdKbXUxQUVDdEN4ZngwZkpzbWZ3amNUT3JtTkNpaTY4S09HaWtLaVZWL09xR0ZFMk5FUGZhMlIwWDBRUHhDaXdFYkFxajdkc3N1REtQakp6cEVRSWxsVlNRc3dEQW1PRnV0R29lWENjQWtQb2pUMkNmM0hpREFPQ0FPQnpNK3NkVzRGaGUrRkdaNldIWXA2R1ZTSld6Q2g5QjNPQ2NJU1JLbDN1MldDbkxXa012cmZMZVh1UkFGL2FPa242WnRrYUNwZ05DZTNCUThVeWVLbWNPK1J2OWtMMGxWUUF4aFhzU1FtN0RSRHBNOHkwWlY5eDNBL3VJN0lDSEkrZU1TcXB2QVVCNWFZQ0hrV21BVDZ1WUJzaTF3N1Uwd0xTVkFQbVF6OERHeEg0R05aRExXbHNsQVBEQ3haZnh0ZkpzcFEwcmxoUHVOR0poU1ZVQk14RUtIR3QrajdsQzQ1WVJpdGx2T3J1Z3lhekJRUkNySHh2RURDVUFBS3oyWllVcXl2VUFNTmlOQlFCcDduM1ZBRURrem0zdndmcnlEUUtBYlZDMjU1UWx3YWwvVWw1WXFzTTlMR01kbjBENEQ1dVJZY3FtbHUrdkZRMWFVRHc5MW5PWi9MZW83Rk01UzJzSll6dkNFNWVtMzRYVTRsOUlBUUJZbG1Eb0FFbWN5TUVaQlk2TW5KTUovdzdDdzFnRTBJRHRoOVAwTlJnSFFDSDNYcUVzRTB3UnY5Wm1RRzhTQU55cE1nRFFpdWdrbGU5TktnUTA0MG9MQVIwYWxoTXJoMm9VQXRJcUNNcEI1cHp5V2xlb1p2WEtGY3JmVmdJQVhycnlHL2xnbm0zYWhrSldWVUF0UytLQWN0cTU2OWMwQUxJNUpYWHZnc2hsaTBUU3hKS21Hc2liZElWbUh4b0F3SE5qaFkvU3RnUFc5cVlWMXg5TlFad2NjT203QVZZTEFFakw1NC9mTUFCQXdhd1ZXY0x5d2xnZnZwd1NzUy9BKzRmdHlLMjQvN3JUR3dmSmQ4NUVBb0FRK1Urem1xMnhtT0NKbTA3Z2xtajFGNlE5N3lwNVhzOERJUURMdFg2cWVITldBQ3h4UTZsNWVQWUdnSWEwN1lEbFczRGdkeUhSRkdzdE1IL2lTdHNCdjJrQThOZy9xOVpWcnhTd1ZoRGkxSVZMQVV1Y09xa1U4SEVBNFhhQmUxaXJGc2ZOaE5KV0FyVENHRzFBUkdyMHdranFUbmU2UW5YQ2NnR0FWcjBxdHBXdjVPNWZXditWdGhRV3EwWExrc0I2L0tlUU03OE8rZVpMa04rOVNYbjdXcXZuTWZxV2wzNS9hR0Vlc1JLbUl3REFjWVVBWUJ3OEdielByVkxHc2NSSnNWU21nZEQ0SmdEQUIyOFlBSEFCb0RPREQ0QWt6bktheFBRUTl5Y203cjlrZUJVM1lCL2luckI0SGlIeW4xYmZmOHdZbWlmdVNNa3V5VVRNemJvcjFEUFlJbS9NbjUzZUQyQUFDSHZvb2NUeXpXZkV3ZGtpMlNDaFdxa2xzUVhwMjFiL2xkaHZXVmUrYXllQkc0U2c2Y2RDYUgrdkFBQlRMcHBjZFpvQmFTUTF5MnJIMlBLekFGTWNEMGN1NEtLdW96ejNhWVUvRUZLNG9lK1BDV08wK1hzSklYSEFGYm85aG9oZ0lRQ2d4UXJYSVVVbnlXVXVndjFyVjZnLy9qeml2bFpWd0RaWDNGQkRLOWNxSGhOc0RyTUZwTXg5U2k4NkJNSFByYUtsMzcyVTh0U0luaHQrUHl6UmZ0RkNBTmFjeFNnbEJCcXpyclNxSDROVElURU9HNkd4RTFJc2FBR3RVZXo1SHdrQUxKTnJHL2ZVZGdJcE1DMEFTQlAzbHozRDRSeTAxdGtpdHlxUDloa2szSE1sRENmcjFVL0Q2cGpLNU1NcENKZFpjN05QUXpLb0pCdmhOSUZFM1VIdnRFaGV2bE5LeTkwRFFqV1hJY2JzclhJQXdMNHhKR01xQjN0S3l3N2k2cEoxMXdVQXBHQkw3VFVCQUV5NTZIVGhibmd4UWlSVXp6cVVFdE1NRm5SU08rQlEvK3VYQ2VHRGN0b0JKMW1PL1AwRHJ0RFRlZ0lzUmkwT2ZCNEJBRnFjWHU0MXB2cWZrQ3Nscm5zVFFqNHhuZ1V0M1VlTGxXTERsa1A0dGhQSWpjNUNqclNFQzQ0Z2ZRcUYrb1NmcnhFZ0MzWDV0ZFZTUGZjQmFHd0VTSURJa280aDNyMG1qOFlHa0VCWFNNQnh5VllrWURHWXhib0hXRlJIcWd0dXdsem1Jc0RpM3lNQXNJQmxLQzJ3MDVYSERvK04rODhEUTM2WmFnRHNBOWpjZ2IyK2E2VGxXVEh6a0l4cmg0RkdFbGNHdkRDVXRjVXRPWWY1UFFWbGZRN0dUMUlkbFJid0RvNjU0dG9jS0JmT0FQZ2Z1ZUlHVDhjZ0cwNWN1QU5ybW0vQmdmYytBRStsVmgva2I0V3hyZ01BdFByRCtJSmN5VmNKQUtTQVNBYXMxVW9BQUhlMFdvSERjR0trZzRpYkJkdkZjaDYrS0tValYxcnhEdVBUVm14YkN4OWd4VHlKeVhVYldRRGFiN1h2N3dkQklqR25PY29uUm0rR2xpYkVLWHljS29RVndKS3EvejMwVnY5bGV1TG5sS0tJWUVuakZsaFZBZXNCbE1oaFJ4Q3dwYUI0YktCelRLbWNVdmhsRGR6NTh6QnZrK1RxMVFDQUhHZ0JBM3NBQUxDaUdRcnpPWXJ6eFpTKzNTZXJSVHI1blNrY0J2UnlNY2phVm1MYys4RG9Qb0M1aTJrRzlQY0lBQmhZWmwxcFFScXRNRkJhQU5DcmVMT3N1TDk0SENhVmE0L2gzSWp5MzFkSVpTTHZOSzVSbHM3MWdrSithM0RGdFR4NFgyV1YrOHdEazU2SnEwbmpBTTRwdDNqdWgyeWpVSUV1U3k0Y1V5cmpNWjNqblJRY2dKaHZPU1R2d3laNERxMEtvVCtHcDY4U0FBejRpY1JtRWV4S3Zpb0FnSVV2eEZvZHJRQUFhTXhXOUFLd0FHYTB4UWh5bWR5M1dwb1pwb2FFQk9HeFFnQVRTM01JOG45SFhYRmxzelRobTBFU0RtTFZyYmppK3VhWXpyaW4zQlBUM2pvTWF5R20rdDhEYi9WZld2K2ZlQ0JnMVZ0ZzNvTlZ3YXNXNHFZTUFoYkFNcFpZMjY2U3NwU0ZRNThqSWJQcGY3OEtsaUFxVTB0d0hzTSt4UUpBWnlDY3VVVnRVaGM1VWJxNzRBNDlJb3ZsaklUOUNya1JPNEZyTVdsWXRoY2tDTEgyL1UrSkEzQnhoUUJBdTdmbVNqNXplbWxna2FWcDNydEhBZnhXM0IvVFd0RmJzQTVoTFZRMGU4cjdvU0lmb0hRMHJ2Qm4xU3FwSldJd2VnYlhsZnNnMk1WUTFJYXpxd3Zpd040RzBrOERzekNFZTJFVjZCSzVzQXp2aCs1K0hEdEFBaFVaRU1vQ1NQc3RtL0E5cXhCMkMvVUkrVEdMNnFvQXdBU2tRMkN6Q00yVmZCVUFRUHFUejdsQ0Z5dEpjV01BRUdNQk40RjdhMHl4ZUU3QUJidXNDRW90aHNSVnRkYWNYb3Y2cFNFSTBZcEhOLzRpTUZIbGNLTDF2bGdHQU9DNTMvZUNhd2MydmNhWXR6cndQVlhJUWxxclc2djYzMTF2OVY5YS94L2x4MWV1MEY3WXFpK0FCQ2FOWVBqWWV4Y2FsYjA2NlFwMTdLVmVPYWNzWWJuZUhDbThMS0gvYlFYZ2NCcmlocjl1RjJLWGFJVWRCaXlZakF0M2tjdUJKMlJIc1Y1eWhyQm5ZTnRKM2lHMGJBOFM3c25XVFZvQWtFMlFBYkVBQU44aENRQ2dJb3dCQU5hOTJaVzhTOWZ1SzE2cU5PL2RZNFQ4OW9Dc3RrSXlBdmtDUWtSZEpTVzBDVzVsOWxBSVFNZjlJT2NGeDd6VHk1VS9JUTVQQnVacFVia1BjaVdRNTZCZHUyVDhYcm9iaWpkT2xIK2JLNjRqd1NDQURhcDVrQXVhYkpCR2Ewc2dtNjA2QU9WOEMzZHJsSlRIRWZBRXQ0UHkvMXVCcWFzQUFBc3daaFJGeUs3a2hTc0FBR01rU05kZ0FaYWQzbXVkWStCb2NUWVFNcDFVR0tISHpxN0dwckZJczRwN2xkMXBqUWw1OTBnbU9nVGkyQWE1NTloNngyNXNGck0ycVIzeXNSSGowdHlMMm1GbnR5Wlg3QXRWLy92QlcvMmZlcUYrQ1FSdStIVEFKeFF5Q1ZVWXhKU2Zld1lJNlBmL2Z4UnllV2VNdENYWmIyZzVjWHd3YTNnNCtnaTRMZ0pwREptK0NKSkNGb3pra1hOcUk1S1RSRUJ4ZzVnZHVEOEwrejV3ajFvaGs5V0VlNjRvMXMyNkVpNnlHa1dGck1FWUFHQlpXQnRHbG9ONDdQRGFOYWUzQTQ2OU4vZDYyRXFZanpUMzdpRTMraklwcEJWNGQzUU5ZeW9xNXF5am9oRmphb0k0Q3FKY0dEaFAwWmdnZ2lPRzlaNjY0a1pDOGk2aCsyUkFQNHdiMTJwakVqekR3c2ZoSWt5UFhhSDQyUXZGaXowSWNrRktMTThxc21FV0RGRHh6bUs2TmZMRnl2bVdLZkowUzZPdVBuK08ydnk3RnluL1N5T3EyZ0Jnd3hXM2p0UVVJU3VqRFNDblZBc0FzS3NmZTVKak13aXRnaHF6NEo4UWE1MHRubldLcmNWVVYwT0N6V2FJcFVucGJVeWEyeUFpV0JaY3dqaC8vT3lzSzIxSW9qWDJrQ3dBYmU1UHlEVXRWdW11NFY3RUZMNkh6bTVQSEZQOTc2YTMraSt0Ly9jOUVKQjB3TmdlQTF3VjhKWUNBbHI4czN2Z3dHTnhEeHhUQ2hEZ0RtUkhDamdhQmlHQW9hdEpBQm9MeExOQU1sWElnbmxPdkpNbFNFOUNYb0xXSUdZSlFEd0xleWxWYTRWTXJLWXp5MkFCTFNwV3pBeWxTYjVVZ1BkOGdqWFk2MG9MY2Qzd0lQRlBDUmJXSWxqRkF6UjNpOG96cDhtN2xmYmU0d0VMbCtjanpiMjdZTTRtRk1BcWUyYkVGZmNlUUF0M3hGQkM0K0RaNWYzd1ZGR1FRelFHNEhjdHNFNzN2Vng0VHRaMnhyalBJSkJvSlNVNW8xeG5qVUhJWk9xQmpCeFUvdmU4b2tRUWdISUJ3OWxTRUd4VWtRMVlHRWplVzg0ODl3SW81MXVHSUR0TDd0M2xDcjB3R2x5aC9QcmZsUDhsS0s0V0FEZ0RGK1VoV0tNeGloREhWUUdBWTJKdEh3Y0lUdHhxOGpFZzB4QWpkRGZnanJQZVBlUmVsZmFsV3RlOE1VRDJHK0FTUFRibXo3TGVRNjB3c2VBT00vWDNuTjRtVkN5WEpWZmExN3lWRHJ0R3l0eDNjZFgvYm9CRjk1Nzd6d0l2WDNzbEh1b3l1QTd2elhQMERZQ0FSeENURkJKbmh5dlU4KzZqdEtXTUsyNjJnZ3FRODM4UkhJMVJ2amVTVjdIQzRBUjV0RFlVMXJKbHdZaG5ZUUxpenpLbVhHbURHQm5URk1aallmL01DSm1NUk54VFV5eFM5QWozeTNNQzNpTmdiVm5XWUpjckxSWjFDUTQvODJBeFpHRk5Vc3kwajlhVnJ4MmxtSEdhZXlkWnVEd2ZhZTdkNWdyOUtRWVZwWVJXTDY0cDFodnBOWlN2S0hCdXR2U2pyUHJaMno5LzMzOENIb0JUeWtHTVZZVDgyNnNBQUZtRnRaMDFDRTVzcmRiNFVldVNXN2J1Ukg2M1dNa3JBZmZxQ3hCZzdCb1RaRDhMSkJRa29JUUFBQ3JzRFhBSFRocmhoeHBYWENBSDNkSTRrTncyUXdLcEhaVFNRKy9DNTJwaGVCL3UrNjBKOUUrOVFQOTlmbnpvQVlHVWdNWjZFNWc1c1V6dmpEeUR6endJdU9rNUJqVVFseFJydDltdlFSdWxMbUd6RlZRWXlCdFlCZmYzbkFHT3VHTllINENMU2ZJR3pDdXNaYzJDd1phNnd6U0d5SHJCZ2RaS2p5YnN5VnNpeFpUNkl1NlpDVmhrU0JwRzROMUo5N2Fzd1ZZQXp3ODhxUHZhZzhUM0lpeXNEQkNtdUltTzlrd0VYV251SFdQaDRueWt1WGNUV1BUZENtRHRnMVJCc2NLZnVVS0JMdHlIWGE3UXZVNDYyTFhEWHNOV3RqKzgxWkQvZUFEQUtrNFFvd2l0MzhZQWdQMEVEc0FzeEJvMWR1YTJvb1NIREd2MXJpczBuTEZhdGk1Q2pJMjlDY2dCV0NVcldYT3ZZaHZRbStRYTYzREYxYjFtZ2FXK2FpZzNmcmJFQVlXSk91bEtDNCtJOStNdXhPdlJuY2psS0djVnE1R1pwNktVdmxlQXpEeWt5VTBwNlRnQ1JsaWcvODY3ZHJGbDhXT3ZxRnBvL21mcG5XZkFiZnFodjhmWDNzTncyNy9yUTFmbzZTMGxqT3U5b0pUUkJBSVRoVFR5QnVaZ25qVHlsQlNNd3A3aGJVcG9ZSUpJdHN4YXJ2Vjc5Y2MrQ1c4bDF0cy9iLys4L1ZOTkFJRHVZTTBTWEFjbEU2TUlyY0VzY091MzNCMnFIUlFMa3FsV0ZDTE1vcUtFT3loVy9ZTlh3dmNNUmlpU1p1YkpNc3VRKzNJS0ZBRmF5WnA3OVFIa3Vrc01xZzRLKy9TQ2twbFVGRE1xTjM3Mm5DdHUvRE1NeWg4dEFyR2cwSW9VZCtJNERZbHpvV1drTVU5ditXK1NHdVZEeXYzUW5kc0N4TUY3UU9qNjBGdi92L0ZBUU5JQmI0UEhwaEZjb1VPUUNqcE9zY3pMZFh6WGh4USs4ZmYvMWovckJ3OHFIdmo5OE5pL3kxTVlMeFFnZ0x5QkVYam1HS3c1Z3FNSEVHNTY3Z3E5eEZ1VXVoWVk3MlBXOGtQL3ZwZDc5cHUzRXV2dG43ZC8zdjZwSmdESUVKTS9OR0lVb1RWbWlOUmkvWFpXc2Q3N0ZESVZzek5GQVk0WlNoZ3RjSWtQM3cra2hZeVFBa00yZHBlZmd4RkYrWWlWek83Vkg0U280WlhhQTY4YzZvaXcwdy91MWpGRHVXVVVKVFNxTUZIUmluem9DdFgybWhWM1lvYUdrRSs2eVIzTjVKTnZQU0dybVFoMmVLOWVjdWZXd3B5ZysvL1MrdjlsZnZ5QndnRDNnRHpKYzRYUCtWc3M4KzNKZnZ2bjdaKzNmOTcrU1FZQTNZckNzMGFNSXJRRzF4Q3dmcXRaVkJ3dkd3a1FZVExBQW1VbGpOWG12bFVZb1VpYTZTUEYwZ1dXV1NzUmF6SkVwR2xTbFA4Tlgram1ZNitFR1FRZ09hMGJLck5wOStkbmN4eFFtS2lzL0MrVjZWZHZkLzNiUDIvL3ZQM3o5cy9iUHo4ekZKNDFZaFJoNkxmZHJyaWNydmJiZmxiZ2IxZnA3WiszZjk3K2Vmdm43WiszZjZvUEFGckk2aXgzY0l6NHlSWGUrNGEzcWgrQTljNHhXODJLeHM1MzdPcnVnUnpVVmlxMGtQUWQ2Q2FYZVB0TGNyVnJ2eE9MdlJYWTNtbWZGWE05TXI2YkV0NnBsNHBOdkNqeis5SGpjdW5pLzJOKy9EWS9mcEVmL3lNLy9wOFUrMCticDBjK0xQQkNTWGU2cXJtdWhleVJGdUFHeE13aDd0bW5Da05iY3IzN2xQMDZRSjZlYnZnVzhmUmdvUk1Nelh4VXhqbnNnZk1nSHFWbVlvbExDS2ljTTg1bmpiL2hIbkJMUG9NMHpucWFMenpmQThyNXhqQVdlc2JrRzVvanprSnZsV1JYYzhTZTRiTWFzN2VSL1MvaHRhU3pvTWxxeWRzdlozK25QVWV4Y2xHK1NZeE42MzN3K3FSckxWa1ErOTI0UmpIN1IwdXZmSnh5YlZ2VHpuRWFBTkJKY2VkeUI4YS9oWFIzVmZmK3dTc1lkSjlyckcyT28yUG5Pd3c1Y0VwVER4RzZrcjVEeThGdElyTGRpSkZHbGFGS2IybWZsWFQ5SUZYMzZnQVNwdlZPV0c2eXNjenYxM0w4TDBsKy81RWZQOCtQLzVJZi8wZmtIc0Y1YWdOQmg4VEFIa2pidTRxNUZ1R0Y5U015Z2ZRNG5rUGVzMDNrZlpOM0gxWDI2d1R0VlF4MW9TQjdBY0ljUVVEYWN6aE01NkV2UUFLdDlONjlpakFXRUhEVFozRThKK0dzemRlRWNyNUhhYjR3aStWRnhQbXN4c0R6RjlvejJsbU4yZHREUkxDdGp6Z0xnOHBjUEZMcW84VHU3N1RuS0duZThadGFYYUVWY2laaURwS3UxZVJKSTZSbHAxbWptUDB6cUdTRVBZOWNXM3pQVkRJNERRRG9nL0t5TTJVT2JGS0FhWGRYZGU4YXNMS2JnSHpHZWR2TXBNZWM2M21GUVQvcGlwdnVpUEJPK2c2dXdpWEZWRGpkanNlVVVpMHc3Yk9TcnVjVU5TeEFNaDJZYit4ZlVNNzMxMEtXZ0ZUNXV5VDMvU28vL2prLy9pay8vcy9JUFRKbFZGWGsxRURybXlxZGF5eHppclhOUndNRmNuZ09hOGd6MUFFNTZTTlVhOERhcnhyWk5VT2hOUVFCWWtXblBZZlRWSkJteEVnRGZWcm12YWZockduQytEbWtySDRQcGJ1N3FFalROTXpYZ2pKZnMxUWdDUXZyTkVTY3oyb01QSCtoUGNQWHRrWHU3U2tpWmpjbFhEOXR6TVZUVjFxN1AzWi9wemxISFpGeUViOEppN1ZOSlZ5ZmRDM0xBam1melJIZnpXc1VzMzh3STYyZHdFWlB4TnFPUWJHbWFCbWNCZ0JncithVk1zY1NGZDRSSlhCVjkzNEtnclFUbEJxWGNGMm1GRU1zYXl5cGpWcGpCKzZJbGZRZFd0VzlUcVhnRHY4Tyt3VklnNXkwendwZHYreUtPNURoaHB0MXhRMHZjTDY1ZzJFNTMvL0NGYmY1L2NTbjkvMDZQLzRsUC81YmZ2eGZrWHRrVVNscnJMVWJuVEcrcVpLNW5sU0VNdGJBV0lpY1E5NnpmUVRFNWx4eFl5SnJ2eTVEdXVzVWtXc1JCR0NOaGpUblVNb0t5M2tJZFNGN1VjWVpYM2FsVFZTc3hpMlN0b3ZLZnhUTytKSnl2clZpVmxwcDNhYUk4MW5wNFBNWDJqTjhiYWRTK0VyYjJ3dXV1RHg3UzhMMVdOVVRRY056cDNmdmk5bmZzZWRveUJVM0tiTG1uVHRyU3MrVWFhTWtOYzVCMHJVb0M3QTJTVHRrbThXdVVkSjNZTjhOTkFZWVpGbHJoVElybFF4T0F3QzRnY3RPR1VQcnBQWHFDdStOK2ZOWUdsWHFhcTlTd1NBcE1uVGdCNWU4bGI0QzNIUkg2K25NMzdHbEZFalM2dnh2S3Q4bVRVK3c1a0hhWjRXdTV3NWtYUEo0UTNrbnF4dGoydStYU244L0pBQ0FtRDJDbmY0R1FHZzFBK0tmZ0dxUk8xV2FhMjdoS3VFRHJZbFQwaHkrQ094WlVXVFNjQWZMTWgvQ3YrOVN3YXRGU0s4ZHBKRERjOGorU0hNT3QrazhXSDNJUlZHblBlTjhieEZ5V3V0V0tkekZsdGtDek5jT3pOZWhjYmExNWpvdEVlZXowc0huTDdSbk5wVTZLeDFLNld1ZVN5NncxaHE0ZmtjcGs5NER0VGtZVU05Rzd1K1ljNFNsd0VQemJuWFc1SzZwMWh6MEI2NUZlWUxWU2JHVU01YnBUbHFqcFAyejZZcGJ3Z3ZZUU8rdzdPZjFCSm1WU2dhWEN3Q2tGUEJ4aW1HMTBteTZ3bnRqUVpoaFdMUmxwM2R2TzFGS0ZKOUNHV0hwSzdCakhDanJPNndTeVF3QXVHNS9xR05oMm1kWjEyc3RXYTJtUjhldXVLdmRYQUFBeEg1L09RQkEyeU1IQWFIVjZvcTdFSEp6cG5Mbm1udXNzN1hBQUdDSGZtZTFzMDNhczloeTE5cXJXYWpNdVE3V1dLaFBRNXB6bUlQemNBQktZNW1zYU94M1hzNjk1UnUwMXNmY1ZZNkY1WnIvcmN6WGlURmZSODd1NTlHU2NENHJIZHI1cy9hTTFUNVpBd0Q3enU0UmdnQUFXMllmd1hPc3R0Nk5BS2dIQ1ZEdktXZUpBY0NVY2Y1MmxiUEhIVDF6ZEg4K1AxZzBic01WOTRQWlZnQUdnNWREMGlrNEIrTkFITVVTNDV0K2YrRjdZY2ZSUVZkb2hyZW96Qk4rQzRLTkhqQmFaSjJ3RTZ5MVRxbGtjS1VBNExVcjFQR3ZOZ0NveHIwNU5pYVRLSTF0UkNpY3VkTCs3ZGlIbmE5TEF3QmVsd2tBTHZ3ejB5aWwxeWtCd0lVaVZFWklnRW9MWTZ2bEwzWmlLK2Y3S3dFQWwvZitpLytPbkhJWXhLM2U0WXFiS1dFWFFybEhPWE45NFlvN0diSzFZQUdBMHdBQWlObXpvcnlPWUovdXUrS09qOWlHZUpkQUFDdFFJWGZGbnNNVE9BL244QzU3aW5lc0wyRnZXUGMrOXdOYkthOHBybXhwTmYyWWhPVXFDSFZSL0RsbHJ1UnM1Nm9NQU9UOXF3VUFMc29BQUtjSjhtcUVyTVZEZUdkVXNPSXlGazVNQ0ZDZk9idlRxcWFnQllSaFcva0o4RUtpaFg3NVhuLzJ2emxRRkszMlB1ZXV1SXNtN2gxczhiNE9JT2kxQWU1SEFNU2dNcGV1cklmZ3ljQndOTXFlRlpxck0wV1JqMEYyeWdoOGs4elppYlBiMEd2bjdQd3FBVUN1eWlHQWF0NjdRNG43eWlRZWdZQTVKTGVwakMxd28waDcxOXpmT1FDUTFxc29RRFVCajEzdHVnSlczblVBZ0w4WVFrdml1TjJ1dUNVMUhxUy8rbEhPWFAvVkZUcGlhdFpDT1FBZ3paN2RBVGY1aGl0dVJTd050eXpnTnF5UXUyTE80YTRyOU5XUTgzQUdRbVpYc2Z3NlU1eHh2UGNSQUl4c0FPQkpFeUIydGU2RDh0Zm1hNHU4Z0VrQUlEWUVzQThnYmIvQ0VNQlZBZ0JVeU9zd1gyZWtOS2RwdjNRNHU2MDN0b2puVUVXR3ZBNTdBSlkwSlQxQjN5UG45WnptWWhveVBXWmgzbklCY05HcG5ET3g1azlnUDJOb2NVSngvYU54eE5jT1Fhb3NnbzIxQU5qQTh6a0U2N05HYzN3QUxuMEU5WHpPZ3AxNnF3VUF0aXNrQVY3VnZWbndJOG9UQlNzVGljUXBZUWt2QVdsakhXS3YyMy9IQUdBT1VPb0JvTTE5aUZVeEFWTFM1ZDRFQURnR1JjZENaQmh5NXRHZHVBVUg5NlNDdWY2THQwZ3NhNkcvREFCZzdkbWNzV2VYWUw5aUsySUViMmhsckNva01uR2p4NXpETlNBZmJ0SzdXWlpaVitTOVYrSGVXMkJkdlliMVdWZDRIdEkwaW1QbnVNZDNhTDZRL0N0Z1lKTVVpdXpSTkNUQWRRVUFyS2NrQVY0WEFPRE9uRHNLTU1QNGNtaVBvbVdLN253RWdVaFU1RFhTM1BUaU50OEFpL2t2OUg0SUNMbjl0NFIzTkc2UDVtbGJCWS9udVdIVnMrdi9SSEg5VDFPMkU0TDZhUUlicHdCb09MU3FlUTFPYVczUVE5TkRZSFdkakFQMkZsUVZBQ3hYa0FaNFZmZm1sckFvK0hGeHBSV3RwRWtJMHB1aUZLTEZCRlp0V2dYWS9oTURBTE93dWZkQldSMFEyUTNSTFpMSnJoc0FuSU1WZW1FSWhYN0Y4dGlsV1B4cG1YTjlEQWM0WnhDSDBnS0FOSHRXK203Z2ZzVU9sU2pNVGd6TEROM29NZXMzQnltejRwMWdRYWFCc0RUM1hpQzM5QmtBUEN1TStCd3NRSFFabnl2VzdJUmZuMmw2M2hLeHNjV3pGWnNHT0I4QUFQTXAwZ0N2Q3dEMFVGeCtFK1liOXd1MzZlNVZ3Z2RaV3Y5bGlyZTNPYjB6TElZZG1BZUEreVVMSWRnemhiTXpEb3B2UXdsSExCTnB1MUZoOUhPTS9yWGlhbzkxL1dNYU1YY25uU092Q1o1UEJLRlRCbTlnM3dBYjdmU01KY2pXVWZkM3RRSEF0Q3V2RU5CVjNYdEFRWVhIaENCUllJOENDMzRRWWlxakpHQ3R2Tm8wQ2hEN2RQOVVBSUFJZE43YzI2QndKbDFwQjBWSkozdFRBT0NBbERpNit3WUpGYVBDeWxZQUFNNGhqbnhtQ0lMeE1nQUE3dG0xd0o2ZGg1emVRVWdmRzZWdjNRTUZrZ3VRdTlKNGNNYVVkendwWS85Wjk1NVFGTmw1QkFBWUkvZnlpYUdVcEJPbUZBQ2JoTG9EV2o1MlRDR1g4UWdBTU83aUNzRmNGd0RvQ3V5M2MxS2VxTXd6aXRWOFpJQUdUUG5GVEJ6MkhHaXUrbG02L3pHczZ5azlhNElJZzFuREl5VnpWa2M1L1phMXpkWjVHdGMvcHlIM1Vlb2hoaUl2bEh1eFYrSXNBbXdNazVkaEcwYUpoK3NxQU1DWU1iQkJFSmVYVEtNNHRDR0hoKzg5WkxpUnRCaVh1R3lsbWxLWEt5NFRQT0NLcXl0cGxiVXFtYU9mQWdCQWQvT1pBcEttWEhIQm0yWlhYQ0wwcWdEQWYwMVF3bnRnR1J3bXhBYmw4SjVBS2xnbEFDQ0dPSlFHQUZTeVozc1VZYlpONFlPUUd6M04rbW5LdGhvQVlOZ2dpbWtDSDkvZDhnQzhCdjdLT2xoQlV3RDRCeFZaZ3ZzN3FaUnJKZ1VBeUxqa1VyRFhCUURhRGJkOFZySEtjYi93SHQxWFhOTWNObmhGM0FIMnhtazhBSGJuNXdBTWFOZHJIajR0VzZEVGMwWWFYSEU5Z3drQVFqdEthR3RUQ1kyR1hQOWlITlVSQUJwWDVCRWJFY3NLTDhFaUhDUFkwTTVaN3FwSmdPekMwOFkwYkFoa0h6OU1JUnlzTWVHS0swaHBuZ1ZOc1dvczF4Yi8reVpndkxhNzByclBXbTN0U3Vmb1RRSUFadndmRVhFTTA2KzZJQ2NZNjcxWEd3RDhtd2NCUDA5UXdpaTBVQWpOS2hibEhxVEY3RlFCQU1RUWg5SUFnR0hGOVdudDJRSGFzNjFLSEhBVDNLem9SdWNZZlJvUzU0Z1IvN1hJV1drQXdBU0ZQdzdKUmFyTkdYTUFsbWxQSUJGeUUrb0t6SUxzRU5KbWx5dXV5UzRsbVJ0Qkh1RG9LQU1BZENqM3dSNEsxd1VBa0lNMHFWaWxwMFo2N2FneHp5SGlZTDMvWjErQXE4RThBTTFqaDJlQ3IyZUNyeFlTRk0vT0k2OGpYcm5pU3FrYTR4NUI1QjZjNFNSclhFcWRDOWlRdlA0aHl1dTNRZzdJV2ROQ0JKaHlMUG8wbFF5dUpnQllDNHhWWWpkaVVZbFkxM0ZvY0FXcEZ1TWdZZXdXbFFUbnVXS0RuaTVnY3VLUWc5ZnNDbzF0S3BrakdXOEtBQ0JwakMzWkdWZGNnS1VWbU5mU3h2aTdLZ09BMytYSGI5eC9sZ1QrOXdRbHJLVVVvUnRTUzFXU3cxc3BBTmdJb0hna0RzVUNnSEwzTEpabjFkeXNWb3krSEE3THRDdFVHdHNHSmMwTThEUWt3R1dLeDJPYzljSklsY0x2ZjZha2RlMkJ0U2dnQUdzakxBT1BRdmhEYVAxTFU1WW5IbUJJV1ducDlkQllBUUJvaFB1ODlQZXU5Yys2TGdEd2lsemdISnUyd2taYXlNQUt2NGt5bEdaaEZrRFY0dnBvdUoyQ0FyUjRBMG5wZnloMzd2bTVmcWxZNTNPS2RTNThnaXlGQlVLdWY1R1BqMXlod0ZlblVrdkFTZ3ZjVnJnTVRPTHRKbVBzalFDQXZZUmhiY0Q2eUJCQWFHd1o5MzVwSENTTlhNaS9hNmE0WHlqczBBa0xVTWtjNFhnVEFPQUFZbkhpN2xvaHhyOXNiaXpCZWxsQjdyS1J6NWRWQkFDWERZSCs1UDZ6TStDNytmRk9oQkxlQldHUE1kOXBKVlVKaFZVMUFJQ0Y0a1VSVmdJQVl2ZnNNMFVoc1l2K0ltRXRZdFp2MFJVcUVtNEJXZlIxQldtQTI1UmRJQmtBT1ZBTUlRS2p5QkdzVExkTWZKWXpPRk5aLy9maStVSnZ3TEFDQXU2QklIOE1WbDJsQUVEQXhXTi83eHIvck9zQ0FQVmdsWTRZUUZsTHI5WDROQllCRjN0K01FRGxGRDhPOHlBSVBxWXplNko0aFpMUy93U1FOSG1QWlkwcmRQZkRxbnRXYllBelpVNUNydjlIWGo3ZWQ0VUdTbGpiSDBNT21FMXpET0ZKSytjZnZTc3l2elZ2QWdDY3dXSm80N2dDQUhCQ01ReHRoTzZ0eFpxU2hDQ3pReWRTaEIzS25TTWVwejY5N0xvQXdEN0YwQkZwWWxuWGR0cmMwb1RsSzYrNHF3RUF2dkRqc2p2ZFpYdmdqendZU0ZMQ3lFVG0xQi9MTlZndEFMQU1JT3JVQ0FYRUFvQnk5cXcwM0dsd2hSS3RhV1AwTVFDQTgrY1A0UDBRT0tZcEJNVGdlQjlxQUVnb2FoOEFLYWVXWVNnUlk3a01BcklBZ3NSNmxOb0FHNVRoZ2lUWEpnOXdiL2s5S2dLOVdnRGd2ci9uRC80Wk42NFJBTHh3cFZYOTJDMnRjVSswK1BVaHJEMWEyNjNnQ205VTltY29ZMk5OQ2RtdEtlKzJTV3o1RTJkWEY1UzV2K0hsRjF2bm9kb0FmMVZ5OEVPdS84dTF2ZW5YOXFFcmRQZlRRZzZiRkVyTFJlVDhkd0xmVFpwaVhUc0FxRlJKUDdsQ2NERm1XRUZXbkxKRk9SQmFPb1VWZGdpbGkyVlRETTU5dm1vQXdESHNwTmgvUFNET0gxeWhsVytsQU9CN0dEYzhJTGdFRjU5RktPRU54VExZZ0h6dkxVVllWUXNBTENUa0VDK1hDUUJpOSt4VkF3Q3NPSWdWOUU1QlNSOUFlaUs3S0p0VG5QRlRWMXpzYUkrVVAzZkNreUpHOTExeEYwc0VBVklYWVIrQXhXdXdYUGVWWjZDSDRYSnZmKzMzNC9kWEFBQys5L2YrMmovcnVnQkFMWHlEVnRlZjAydFhJUVZVSy8zTDVOSXVBbWhpQWZjYWZBME9PV0JvTHd2ZVhwWmYyd0QydFBRL1RrZXM5eUZMVWN6WUxydzNrQmI0RnhldStJY2RTTEhKMXZkS3lJR2JIYkg4T0ZjNFRaenpqNlc4cGFQcUcrTUFsT3VtZit5dUxyeWdvY3drSWRoQ0NsTkxwN0MrSjJtT3RpTEhkWWNBdEtJeHpQNUgxTmtDdkljYTcwNnJsQU53bjhaZGYwQXZFZlMzRVVxWTgycFJBR2pNNExVcUF3Qk91Mk5DVHl3QXNKanNiOUlEY0VGQ0NXdm9vNUxXVWtXMVprQWhBK0lJdkRoN0VLdTNySE4wdFVvVEpRUUJRaWFUcGtDN3JsRHpIY3YxN2xQWUN3bkxIK2JIeDE0NVh4VUErTUkvNDhOckJBQ2lrRFR5NkFhbDF5S2dEcFgrdGFvMFBnQTJmSGNrRDREai94dEVsR1p2SDNza3RHcUVvcUJ2K1hjUzE3eFZHQWp2ZVdIVUJwaWlYSHhzc2lXZVRRdzVjQnY0S1NKZ1NzbmpwSngvZnM1M2J4SUFsRXZVZTNTRkJNT2tlQ3JYcW01VEFJQ1dUbEZKS2VDbGhQRW1TWUJaRUZ4Wm1Ic3JCYkJhV1FEUGxQSEViK3o3Z1h1akV0WmlsK0lDWkV0QzFyNmFBQ0FtaDdnYUhBQUw3TllDbzVtVlFhd25JZFlEZ0YzMHRraEpUeHFwb3JFR0JPZWhhMFNyWHFlM0E2NGpFRERvU3RzQ3J3RjNJUWVDUGNReitMM25wVncxQVBqQVArdTZBTUJEaFR3NlRuRnByU1lBeHRxdFRBRW1ldDhOUEd2ZHlPL2ZWamc3V2grQlBZalhIMGVrdXo3MzcvTVk5b3pXZG5lVDR2QUNCTFRLZlNITC9Bc0lPV2pQMU5KMlh5c0VUQTQxU0FxMmVCcStmTk1Bb0p4VXZWamlRamtwaGlGR05WZVJRdXUySjhHZFgya3ZnQ2xqL0pUU0FHT0tBRFZWb1E1QW96SHEvUm8rRGV3UlZzSXNTQTZJcGM4czlXb0NBQzJIK0p4aWVHa0J3TGFSQmFERk5PdU1lTzZHS3kybW95bVJtRFJBTGl1NjZxOWRJQkpkditJcGl0a2JES0NzNGtwYU8rQUgvaHZhL0xPeExzS3cvOTAwa01zMlhISE5pL09BSmZ2T05RS0FkMUlDZ0o0S0FNQjk4Qnh4aWg1WCtHUFAyUjRSMURUaUozWnF2QTNwY054S2VOWEk3K2Y0LzRvQkdBNmNYbzhnNUpFSXVmNlpBQ2o3Y05lb0RaQVVtLy9FaDNmRTY4QTFDTkxLelRieXJOejJYb1pQZndvQUlLbFlUeWVrb05TbFRGMklLVEtFS1dwYUhRQ3JMS3JFRlR1dUFRQklvd2NjUDdWQ1FPZXV1Tzc4aWtJS1JNYnJrekxlcWNNWTdYNCttNERoSHFPRVZ5aUZLVXRXNVJIRjA2b05BS1lWVng0Q3pqUjFBSmFNUGN1czVoN0lJMGRCcG5WRk8zVjZZeFNKMWNhc24vUWRtUGZDVmNEOUtLWFJJVmNrdHRhSEJxQkNMWmRaMEVybVRzWVZXcmYya1RkZzByLzNFcVVLaGd5RE53MEFjZ2xFVUU3OTNJZ0VBSGZBSW0xMjRhWlpYQXpuME9uVkF0R2JpdnlNN3lua3dPV0VOUjRBeC8rWFhYSGZBczc2eWJwd0xRb01PNmR4L2VlQUxLclZCbGdITCtrd0VLYkZRL1dCSnpWLzUrZjhrWi96bGpJQkFIclA3L2o3ZnVIRFJ6OEpBSkFKakg1WHFDSGZGT2tldEVyb3lwQUNIcTBRRjNua2l2c3dhelhMdHhYRjFuZE5BRUJxQ2Z5VWVnRndLZUFMVjF5QVlnVXNQZXdGa0xha2Mrd2U2WUJRUTR3U1hqTGlpWno3djN4RkFHRGM2UzAvMFdXWUJBQXNBWHhPNzQ4V2greWxYcWMzTjhHOXF6VnFpVzNLaGNWNnh2M3pwWXd0bnV0bVV2NTNVdHlidVJUY1pYQUJQRkc5RkF2dEIydGYzbEhlVC9iVmtQOTd0bkl2QXV0eTNRQWdwbkVTRXR1NkZhOFA1c3BiOHVvV3hLVXhmS1IxK1VQRnpLbDJXcW5kRmdCbW9xUWVRZWFCVm9CSU83Y2NZckFBZzlhTkVNc1JZejJDaHhITWYzVDk3ME9teUxhUnM0L2sxMEh5VUwzbnZRRGYrRkJWTlFFQXBrLy84YWNBQU1ZVHhpaWxsVFc2OHBybzRCQUxxTUVMQW1GZ1pwU1lGakxzdWNPZFdETEQxd1FBZm1yZEFMVm1RQndmNVc2QVBSRkVyN1I3WkF6QVdFZkFPbVVsUEcra01HbDV3VmNCQUxTV245ekZMd2tBWkJJVU9Gc2NZK0JSR2dIbHBxVVdNWUJnWm5SYUFDZmdXK0xRNk5sN0Jzci8reFQzMXJnVVZub3Fla0FhSUlkN0R0WllHbnlKcDNCSXlYbi9xUUlBZmo4dXpUc0Jhei9zOUNZN0llN0lEV0NuSTBOZjh5Q2R3Um5aZDNxblBYVC92NEpNb2R2ZUJWN2pDdFgzWW5nQU9TV2VIeUlPbmlTQVhIbW5Cd29SYnpMZytoY1BLTGZ5WlFQSjhsQmRGd0I0NzAwRGdQbUlNUXVITnlsOUxqUUJEVEFrWHZ6TVQ4bzlqMjc3bkY3ZzR0UXZIdmE0WHlhMzV0US9JQUN3MmdHZjAxeFoxUUdydlVjd0ZTc05FWTlMNko2NTBoTEJWd0VBQmx5NG5PaXA0b3BueGRDcjVBY2Z3SGNnT1hOUjJhOXpTampuUWdFUGVBWmppWG9hRU1jeXRpKzlnSC9paGF3by82OVNlaGUwVUFBRDloa2wvUXF6ZmpaY29jWDNnakpQOCtEcVRlSUdYVGNBR0RJOGx4eDNubFBXWHN1R3NVaWYzNEpDd3BvQVhLaUhBYlhXK1E4NzdiVUJOK01lZk45OTRnSDBVZW9oZWh1T0NHU2c5NUVMQ0oyNzRsTFVtcGVFMzZsRlNjVmJjWGFqbndXbjUrekx1Mm8xK21VdS9pRUF3SHJrMEdKRjVVN0FVeitlK01rUW9YUFRUd3E3eGxDb25KRmkyNEowTFdIckx3ZklXSCt2QUdBQ2hDTXoycE5xQkZScmoyamxYbU9Vc0piQzlCZFhXc3hrNmdvQmdDWlF4Rkw1WDM2RUZFT1hraC9NR1JwU3dFYmJyNWp1bGdQTGpZdVhhSlhheXRtL0w3M3lxSVhNalh1UUd2cWxTMWNrYXNRSUJWeFF6SlhUcnpvVUpienJ2M2tEQ0lzNFQxc0d1T0xzb09zR0FCbURqZithZ1BnS1pSQ3RrbkxTWFBUb0R2L0t5OG9IOEQyYVltWkFyWFh2NDg1L21KNTVDVFErQXhiOFM4WGJ3RHl0UDd2U1BQOXBweGZLdWp6amYzV2xoWUdtakt5ek8rVDYxd0Q3aWNJOXNUZ0M2S0Zpc21yWFB3SUEySThjMVZKbU9BSDNJR2Y4bGhjNlVqeEdDbHlnVUVITDZOUVZWd1hiYzhYNStoTHYydnNIQWdBajVNWkc1Y00xQXVTUWpRTGJ1dEk5RXRza0o0bUpqM24vV2puVHF3SUFJWmZpUlFRQUVEWTJNcEl4UXdQVE5ERVZEL2ZyUGlsL3p1Wmc3OHJMTWttY2VBNGZnT0tYd2phUzIvNitTOTlwMEFvRlpGMXBZUlQ1RmxiQ2tycTE3Myt6VGZOMEFEd0REVnlJOHJodUFLQ3g4WkcvZEFUZmhQVkRkdUM3VHhXZUU3dm9oWmlHaWxtcjE0K2t3cis0NHRiVXF3VFcyZFYreTh2amoxMmg4TTRMaFhUSXdQMS9PYjE1bFpVbDgxZG5OOHpDakFRSlNmQTVYU1BRckNsMEswdmd3Z0FNQWs3L2JnSEFCYmcwazBaYUFYdVJZZ0srOHlqeks3K3BMemZibi94MVlsR05RV3gwM1cvZVEzQnRuVUhLQ1ZibHk4RTFwMlVBZ0l0ckJBQVhWUUFBRWlQVmxNK1pzMnNFREZWaGo1eFdBUUNnME55QndZZjVxZ0JBRXFub0l1RTdteWtuV1lEcm1ySm5UNVQ5ZWdSeDFCeFkvbHpQb1k4SW5BK3JjQTZsZXVPWFBpWHBReStVM2tsNTd5SERhOGRwbFZ5MFIxdlhjM0FsODdrK2hYbkNVQ0NuZEYwM0FFRFBKWVlxRHNubHJja3FzVjQxb003ZCtVUXAzWGFGbWdEWUlJaTVLS0xzckxiYlhPSDFuaXRVQ2YwQTB1QnFsZWR3dU1GcVgyMXhIUzRVVU1JTnMzQytNd0ZQbmRWMk54TTQxMVluME1FeUFjQkZGUUhBeFZVQWdHd1pJMWJBNG05aUorQlRyL2cvOEd6STMwTithdyt3bzJYeDFpRFhWT0phWWkxaXFXRUVCUWZnSllnQkFESGZZUUdBYXM5WjZIb0dBS3g4Qk8zaWJ3NlZlYWpHSGtuVEpqZXJLR0VSbWl2S0VBWEl3cnJjdWJZQVFDaXRLT2s3aFl6VkRjQVZRUUR1Mlp5eFgyV3Y3cmppQ24xYzBaR0xpVlRySEg3a3JmNC81TWR2OCtNL1V0NjczK0JTOExuZ3VXZEZja0FnbnN1STUyQ2VOb2dNakFURGNnQkEwanFIQUFEV2lrY2dMbXNmK2laNUp2SkVwcFVjOVJjZW9IMEozNFExQVRoTmJ3dmtaTmJacmFuUi9ZOTc0bjNsT1JZUEFOZVpGYnBXNDRKbDJiSUNTc1RMZGRjYmpBT0IrMWhwcHpIbitsQjVoN1FBb0p4elp3R0E0TDNTQW9BcE9KQmJaUTR1enRDV2NPOE5wN2R6dENiZ1V2RmZ0cEg5cGQrSXIveEdReEFnQlVHa1R2Z211ZnRsN0lJRktlOGlCVkRROHNWS2FtbS9vNHZjWU90WE5HZWg2OWNwUnRodGVFMzR2VGFKVVY2dFBiS3FNSGhEOTBiRUxTR01HV1dJQXNRRFhPbGNyeW51UnEybStGcmtkMktwVUFZQnVHZTNqRDByM2c0aHdTMjU0Z3A5R1VpWmxTSTlXTW14V3Vmd3NwM3pyL1BqRi9ueHoyWGNlNERTS2plVitlTzV4MDZBNjY2NGNWRm9ubFpkY1VkQXpsS0tCUURXbmxvMTBpNHRBQ0JrUEFIaUFnSldZTzM1ZTZ4dm1sYkl1a0tHKzVNUGxYSitlclBCbndxZEZiYTBIM2grd1ZjZUVMNGJDRGZFN0kxcDJMK2h1VjVMNENUSVBoMmdrS0gyYmR6VEl2WmM4MzZPQVFEVk9uZXA3cFVHQU9DQlhIVEpKVzJ0Z1NXQkJXR0g3cjJva0Nxd3dZU2ttSHpzTjltbDBQazNMM1NlS0NCQUJJVzRpK2Rkb1dITWlpc3ROYndDWkp0RllLbFBLYWk2bk8vQWNwQXp4dHhXWTg2U3JrZFdkYWZpTmRIZWE1RlNzcXExUjlCVkxTN0wwTDBYQ0tsTEdJT0hlRGZRc3FwMHJ2blo3YTYwdE9pMDhTenRPeCs3UXRjd0JBRWpydERnWnQ3L2ZzVUxRZDZ2eTdCWHA4RjEyZy9LdjRIeTlMKzdnblA0TC9ueDgvejRiMlhjRyt2NXp4bjdTVnQzbktORm1DYysyNnN3VDFoTkZJdGNTWjJTMzNsbCtUbWt6a2toR2JTV3AxS3NNekxTYi9oNy84ay9TNnJFZGNGK2xRSkdDd0ZaeGQ4a01rb1VtS1RyU3NqblBiOWVYNU43bmhzRVRhYzRLMnhwZnc3QUJzTU5rb2ZmbFdKdkRFYk85VFNSWERWT1F1eTNZZGdrOWx6emZuNFg1cm1TNzQ4NWQ2bnVsUVlBeUlFYzl4TXpWZWJBa3NDaU9FUDNudlIvajJrVkRZUXl2L1FvOHcvZTh2K2ZYdWpjSnhBZ0FyWGZGU3FEU1g5cnNSSzV6TEQ4L1RTOHl5amtRbU9IdkhLK0EvdERqeGx6VzQwNVM3cCtqTnllN1JIdk5RWEtwZThLOWdpbWVDVzlQd282S1lyRG80ZUU2a1NWNWhxZjNhSzQ4VWNUMWhXLzg1NENBcnBBd2ZHZW5hWDlPZ3U1NzFJSVo4QVZWK2lUZWhuYzB2a3F6dUUvNWNmL1hjYTlPNEFNT1c3c0U1NzdYcGdqZWM2ME1VOXo0QlhDZWVvaDVmL1VoekhlOTlieXQ0cTFITHVuY0ozckZKYjgrLzVadFFRQ2NPM2xtN1R2bWFWdkVobkZ5bC9xcEdDUEE2d0o4SkxTNUVaVHlDVnVnaU1GYW43ajl3ZG1IVFJFeWliY0cwbHpiWjFINWlTVTgyMng1NXJmK1EvK1hGVGorNVBPWGFwN3BRRUFrcU9jY2FWbGJOTU1Ga2IxRWZmT0VDcC80WW9yVEFsNnZrU1ovKzZ0anYvaTBSR0NnRWIvekE0QUFnTmdNWTQ2dmN5d3VMZXhvbGl2SzVRMUZtdXFuTzlBNzBUR1ArTXE1aXgwdlh3WFZ2YUxlYThoWUw1M1ZuR1BEQ3JXYXRMNzk0T2dhL0cvNDlGQ1FyVWFjODNQYmxRc2VPdFoybmZlSWhEUUFIdTJCL2Jzc0xGblI4bmIwZWZ2MythS0svU0o4ci9wTFloUHIrb2NSc29QdnJlUUlYdmhqQ2JOZlR2TWtlelo0WVN6aldzdTg0Umx5aDk0YjRabUxUOVRGSFhzT2o4RGkxUXN1UGY4c3g3UjJuZkNkOGszYWQvRGE0OHlpcFgvTFE4Mi91algzdXBZMTUzeXJFanBYMVpNdjNMRjVYQWZneFdjWm0vRXpqV2V4MW9DSlorVytXMng1NXJmK1Izd0lGWDYvVW5uTHRXOTBnQUE2V1BjSHJDd3lobmQ0RGE5NnpkL3JYOWVrMS93VG5obW55dVVBTzREVk5pampDNXczZFRCKzRldTE1N1RDOC9wY0lVbU5sSUQvNzVmaklmK1lMLzBRcVNhNzk0RTFxQjJmVGU4V3dOWUVRaDRRcitwaC9udWdIY1dZVHBBQTRGUWtvTEI5NUQzbDVydGFlN05sUjcvMVF1V1A3aEN2VzBwYmxMajE2S2U1aUJwRDJKem81dFYydk55Zit5ZytBcldzeHJucUljc2ZEeEw5YlQzZXdGSURKTFFFOURRUThvREZlSnRQeDRFd0hXZnNuZHdYWG0vNGxtNjdkZnhwdkVkYmZRZC9JeU1NdThOaWdMOEptRU5laFFGYXUzakFRSXFFaEtMT1NPLzlxNS9UUm5IN09IdXdOL3p2bnZnbi9GMUF0anNWcjV0Z0w2cGsyUVU3bzl2d2YzL2V3QXlmVFJQd3dEU0VLaWhSNmFOenJUb29nNHdVTkR6TXdIVzc2UXJMbDA5SEFCa0tLOWo1T3VIM25QempiSlhXUWRvQUc0YzNuZkNGVmZMeGY0NXVJNWNZdnQ3VjlwaHNNLy9sdWRVODF4TDhhNm4vcDczTEFCZzNielNNUWlJNUpGaDlXUU1LeDB0YzYwQjBRQWhKM3gvcTJGUjBuTVFYV0lqbklja3BEckllcTcwM1R2QUd0S3VIMUkyTmJzUVE3OXBTYkZSK1VBaFdtNVZYTXlNMnZtK29VT0ExaGxiTXIvMHFQZDlFbXJDTkg0SjN4WGlCdUFlZkVWdXpHcnNlV3lFSmNJU09TbkRWVGhIUTNTdzhTeTFLdDh4Um9KeWl0WjFpTHhDTE9TbGw3b0lubmF5aXVRWnZMWmpycmgvUUpkeWx1NzdkYnhyV01OOU1HOWp4djdCZWU4eXJPQ2JDV3VBTG5UWjE5WStuaUNYdFB6M1dNUVplZGZ2NFE4TmQzeHp3aDRlRFB3OTc3dkh3UHdQaFpzR2xXL0ROZFJrRk80UDhXeElDS0FUc2p0d25xWWhUSU9obW1raTREMGc1Uy83WU1pL3p4UndQeFlnL20wMXI5SkNNdDJnYTVMa2F6MG9md0ZTU2ZwTHpoeUdjT2JwSGJVbVc0UE9ickoxUndrbkRBUEhEVVBieUYzcmg3VGpWK0RoZUd3QmdORE55eDNURUpQb0NjUyt4b2paalRHOGFaaFVIRk5LN0tRUDN0OXFXWnowSEVTbTdTQzRhZ0dwOCtiRVdHUzU3NDZ4blNubE41T3V1Q29mNTVOUEp2eW1VNW52YVRoVXVGSDVRSTBUc21TU0djZnRjQzdtQTRlQTQ3UHMxaE1YNXNjK2h2MDlzSXpSdmRZZnlBN2dQY2g1ek5YWTh4TkVKbXFnbEtMcEtwd2xKcVhXS21ReTNQdHpNT2RDRUZwUVNLNkRpcEIvN09lbmpzRHBJQkZzTlFFM0YzR1daTzRmQnI1alhCSDYxak8wT0xpQTA5QWFUTG5TSHV5OGovbjVTRWFiSjJWbW5aR1BQSUQ5TWtESTZ6UDI4RFRFZTJQMjNUUHdrajFNSUp4YWF6aXJ5Q2plSDNjaDN2NmhLeFFYbWdRU3ExUmxYQWFpNWlwa3IyQXhuU2ZneGUwa1dTNkV0eFhJL3RnQTVydGtiNjBra0RJSElPc2lTVlkyQmJ3b0duZGpDa2ljUy9DZDYvU08rSjd6dEk1YW0rMGFBa1ZZUlhTWkNMQ3Jycml1Z1hnMmlyeGNGZ0FJM2J6Y0lRMW9oSDNPQngzYmQycE1mVnhRM0V6TGNHK3NmalVJckdMdCtqbUZaYnRLejVsMnhZMXcyZ0ZCdFNoSXQxcnZuZ0YySjErL2JHeHE3bkZ0L1dhWUJBeXlqVU1iZFJYbWJZb0FDS1liYWN6ZEZiaHYwcjA1bFVrT3dMdGdOWDBIWVJpdHo3Y0lucVE5aUtWeEgxUmh6eTlUT3BFSUQ4bC9uaUdtZXJtRDAxSmZRcG9wcHBQTmdRRENWTGxORXBTTElIdzRMZTQ1OEZjNkNKek93TjdSOXMwcTdEM3JMSW1DZmdiRXE1anYyS0M5TTA5S3ZKc1ViMDNDR2l5NjRocjNyUW43ZUlOU3JwTE9pTGhndi9CSytYdnZQaGVTNFFzbEpXL2UyTC96a2Z2dXVmZDgzSWRNaHRaQXlxbTFocUcwU1c0QzlJa3J6ZmZINnBYYnJyaG9GemJ6a1hvY3o0R1hoTXBmenVXR0s3VCt2cXp0SURVTEx2KzU3NHFyWmxwcG1WZ3hOaVFyWlMrRXZDZ1pSUWRvYVp4Uy9mUkFlYzgxV01kSklpVzJRRmlIUFNMWU1BbFRZTGtPd0RCNCtnUWdOMWdBb0R0dzgzSUhGL0lJNWI5dVVON3pMazNVSm13bXlZWGxGcFhZNVlxdjM0UUZ3dWZzMEhPa0VjNDRzZWFiU1Btand0bWdSY2QzWDQ5OGQyNFFzazFENjhqRk9iUGFiMmFCTllzQ1J0dW9oOHFCMm5URmRSRVlKZGNadWJ2YmRBQkM5N2FLbVh3QWJyamI0Q1pFb1lhRk8xWmNhWVZBclpBUGRqS3JkTTlyZGNtYlhXbnhtRXJPa1ZhWTZoV2xjc2xaV29YdjJDZEJpWVd1cEcvSHJMTFg2MTF4a1MxTXY4T2FFYnV1dE14enpGa1NTN1ZPOFdSWjMyRTlBM1BoV2ZFK1NWaURWVmRhRklyM3NYWStjQzlyWjJTRVV0UnUrUDE3eisrNVIrRCtiM1Y2VVI3ZXYvejMxcjU3NFlwTDhtcXBiVngwYWwvNUpxMHpLRGFXZWd5cGdKLzU3OFU2L2xMUVNJb2FTV0VqYnNna2MxOFBHVk9ZSGlvMUl1UitVZ1pacW52S3YwdmhwMUJoSnV5L0VKS1ZzaGZ1Qkx3b28yUjRpVjZSdWN6QjREbkl1VUpwZWl6a05VbDdSd2lCN1lwM0c0dkt5VDBSQUtDM2VSUzlYREVBZ0c5ZXp0Q3FxTFU3dlFLV1RCdy9UeVpxMXhYS0hzcUVjblU3QkFETGRIME9RRURTYzlaZGNUZThESkJoMk5wY2RjWFZ1NDRxZUhjR0FQdndHMno0Z1ZhZ1ZzOWJmc01DanRkMjN4V1hGK1VESmFWSUQxeHBXV0IyTzdLeTI0Zk5mcHB3NzUzQXZUL3hGc1pOeVBiUWxJWlllRElIb1QzSWRjTXIyZlBXV2pZYmMxTHVXYkpLVTZQYkZjL1NRV0JkNWIyNTh5UG5WVGNyT2N4aWllMjZRc25pRTNyT2tTdHVacVNkSlFHT2pRa3lBYjhEbjRQUHdGSzRySGlmQjliQXFnb1p1NC9QQW1jRSt4ZTBlRVZTNC9mdmMvL3RMMTJoV2w0L1dNOVlsaGY3M3EvQTN4OG1BSUM3cnJnRk1Nc0tManQ5U211WW8vMkJydnAyQUhEM1hhSElrUVlBVVA1aVRYMXQ3cmxtQ3JjdVAzS0ZNcjVvU0tEQ1BZNEVBT3NrSzYyOVVFT1pJSm9YUmF2Z2VPaUtDemZoMklOOUxXdThSU0NBNVd1WDRkM0dzdklJQUhBczB2cTFYU1VBa0dZU1ZoMzFVQTFzYWRweFRLanAyQlVhZVlUcTIxc0FBQnNsSExqUzBxcFM1eGxyUkdQRGtHRmcrUTRvRm9MYzg2ekNkMGNybW50U1k5TVBSS2xhUnkrdGp2ZUlzYlpucnJpOEtCOG9yZG1NNW5hMGxGM1dPS3h5bUxIdkFGdGpIVDVtZWdQSVl1aVdacVhCN1hIUEt3QUFGeUFNUXlNdEFEaE5NUzduNTg4QkFOQmg3SUZEMk5zODkxbFg2SXgzQkh0ZHE2eUdpaGxMOXNwZXhsNEV1TGJIOFArc3M5UUdSS3FrdXZqNEhiaC9aTy9zR0lwWFBCbHArMEtrM2NmbmNFYTBTcFB0U3ZZUXByRmk2SlhyNWNzNzR0OXpsejdlMTNXdXRKSmh2eXR1d0lRTndJNXBEZVdic0FYdVBKMzVWM0IrdVBET3JPR05QSVM1MHVaZUF5bzRGN0xldStCWmxkREZKbmtjWXdGQTBsNUFrbWFYNFVWQi9YVUkzaG5zNUxsTUllSk5BR0RZeVpPckV3b3ZwU2ZnM1dZQXdHT041K0txUWdDeVVIOTJ4WjJUY0pOaVhKUzdZSjBCR3NPdVhydHcyRTRxQUFCN2lyTGJCY0dJM2NqUUpUUUdhVWRXTC9nenNLcTJ5UVVlKys1OVRxL05mZTcwYm5kWXhoTVBpdFVYWGxOMGg2NjRwZW82aEN5NDNleStZbldJaGFNcHV6MElkMkFyNEMyNDk3a2gwS1NsNlhlUUhsUnJ1S1ZSYVFpb09hOENBSkQxVEJwcEFFQ2FjUWlDV0FNQVhRbDdZRjhSbEFLQ2NjOXEvZDViNmY3enJyVFZkaFpjeGJpMmV3RHdzdVNKWXVDSUlJWmx3Z2xaU0xnMzl3QUVhSW9YdlFDVkFvRGR3RDdlQTVET1p4Uy9OU25WaitYdUlYanhWbHh4Sjcxakk0YU9xV1ExZm44M0FjREFmYklQRnY4QnpDKzJaOVk2OWJHblFTclZmWlBBUjlxSUFBQWhvTUtOZUphSVhNd0VRYzJZS01jRDhOd3dPTmlMZ2kzbjExeHgrMmJoV0t3cEE4RURlbm1uaWV2VkUvQnVTeHZwRS9LNG1PR1FhcE1BdGQ3SldTTnV6Zldac1RNVVdnd3JSTURaQWpSZURnQkFsN3dJclRWWW5CMUZJVzJRWmNSeDdoMVgzSWxwRitLcXk4UTNpSG4zYmtPZ253U3Nlb3dGSGJyU251Y29FRm5SN1JJUkJSbjZTNjYwYzFkT3VhL1Uwa2YzMzZwQ051TjdJM2c2cDIvRE9ia0Y2V2oxcnJUNzQ2eWlOSEl1dVp0ZkxBRFlNZzR1bCtibGhpbE5pakJiVHpHd25mV0JzdTY5aHNmdWtPWnpCZVorRWJ4V1NlQ0NlN25qL1UvSk9sd0VRYnppOUo3ckduQnNEWUNZSTFmYUZWQytZNW1ld1lDWFBSbHBBUUN2MlpvckxyMDhyN3pIS1NsTTNtOHhxWDR6cnJUQnk1Ymk3czBwbkJCT0NlU1d2QnJBT0ZlOEROaUM5eUxCd3lVQVFGcEVXeGxKQzVFQW9KdkNXZXZLUHNLUXhBU2tNSEsyeUp6aVNxOHZnd09nOFJMWTRCRFp2d0h5YmszaGo3RGhzTzJLMjdIbkZMQ2NnVlJEVGJlSkIvdlA0TTA1SmlNZ0dnQ2tUUVBVaEM4cVF5MnVxd2tzY1FYakFzOUMyazZhaldrQkFIU3ppTkNTZEwxRlJTRmxYV2tyekVFbFJvOHRRVGNoM2prTlRQdllkN2RjdWdneXNIT1cxc3J6Sk1BWFlCTGdHcVdpVE1LQm1qRkFsQ1Uwa1JzeHA2UVQ0V0hGRUVjU0tCSUdicDFDd3B5R3RXRHZSN2FLQUdESmxaWms1Zktza3hRamJWVEljL01SWTBVQmN6c1FINXdBNVdaMUdUdFZBT3c0aFVyMlhYTHJheTB1blZNQTJ6U3Q3WXJobXRRYXkxZ2c0d3pBQ1g3N2hBTEF6d09lakxZeUFBQ3YyUnljRDl6SGFNU2NKT3kzcEZTL0dmb3VjY3R6L0Q5SGMyK2xCSllEQU9aSTVvU0F1UlFlZXU3ZDVEVk9yMGt5a1FJQU1CRlNzLzVGT1hJOUJxbHRNUTcvaldsMVFxWkxtd1dnOFJKV1FPY2RBZmhjY3FXdDZKRVRwb1VPbDhuUTBneFA3YXdqR1RSTCtvRkhOQUJJVXdoSWk5RzhwbzlZVXBqZEk0cHl1UUJCaE9obldOa1FsWElBc0czcU9Dd3FDcFRYQnNybUJjakNJVUtYbkx6N2FNcDNieldJZlFjZ3RIQ0RhTmRZS0xKVFNRUGtYT3BCeU1IV0ZHSklhSXBpSHFaREtBVm5CbHh4TjdjVkVIUWhRWU1NWEFZYTNFc2VRVjYxQVlDa21tbER2bEdFamJDa08xeHhyWWp4d0pnS2dKa05JcmtKeUxBQUFNNG50ci9GWjJCZmRDRU9NUURJS0hIcEV3VmdDQ2daTnA2aHVjWXpzR2Nza0pGVlBCOVdyL2dqZzlYZlVRWUEwTllNU3dvUEcxYnFLU2x0M0c5SnFYNHI0SEhZaC9kYkI3RE9TaUtVRWhnVEFqaFZEQWFPdVd2ckxJV2RXcng3L0NVUTVUREVNWkFTQUdodGc0K1V2VER2OUhvTUFzU3R3anBQWGZvNkFKWk01clZZZHNWdDFkRUZ2MGNjSEE2dHJDaGVIMjRQYk8yZExRTm9jeHJwREhKU0tpa0Z6RzZRSFJBNkhJL2pWb3N0QUFCUUFWZ0t0OWRRNkpVQUFMUVFNZ2toZ3gzRnpUWkRhTng2OTc0eTNyMUpJUVNocGN5V0Ruc0pyRENCV0VMb2ZzUnluRmlPMGtMaEZ3a2VBQ3lPbEtGbmpKR2lXeUNCZG1yd1JicUlnZHRqcFB3ZEVwbndLZ0FBTjR1U0FqY2l1SHBjYVFFUHJCWXA1V3g1RENybktXZkV0akhOclRsQTJqMG44TEFNSG9aVkFreVd0NmlGUEVhYTBtQ0ZQcUFvVzAweFRvSWlDWUVNN1RkYWovZlRCR0xjdUdLdGh3Q0F0bVo5c1A4MFQ4ZDVBdEJwVmVUWmxtR3hIUnJXM0Q0OEl5a1ZGU3M0ZGdRSXh1ZHdidFpCbmx2OGpRenQrUTd3Qm1CNTk4NHlBSUMxRjFCaFlweWY2ekZJbUlqVFRyRjJRZHBLZ0IySzliOE4vS2x0Q0FHdXdmeGxsVkR6RnBEKzhQd2dZTGIwb09ZOVdncGtBV2lGcE1TYjBHSUJnR2VRbXRQc2lwdXNjTngxaFFoOFROSllVR0l3alpRbW9ybUFHZmxjRlFBWVZwaVZXNlRzR0FCbzFpc3k5Q3Q5ZHlHNDlaR254UEkyc0FWaUVRVkZZV0FwNEQ0NHlOMEErZ1lNbnNOcklpWE5FQWVnWGdraFlUZXplU01PZlpZUSs5SVl1RFBBaE4ySHVQOHVrTE9xQ1FEUXlzTFdzdGdsVWF3OExPR0p2UzVFc2NqZ0ZFWW14T0pabWxmWTdaZ2FwRm1qNTBSTVdxV3NsWk1JZ3A0bXdNOENBRUJMQTlOQ2Fyam5CK2taQndrZ2d4V1o1bjVud3ByMlRpRUFvSzBabm8wWmhZZHdtcEFGMEVZRWFEUWlPRzU3WXNSemo0Mi8xN3huWE1GeENGTFhPTlJ5QXBacUZ2WWZlNTgwcjFjZjVLdUh2QTR4QU1BQ2Q2ZXdGN2FBV0kwRGExdHc3UW51NEptbUZ3Q2ZzUTBDWXV1dXVFYkRvWkw5d3FFVk5xUTQ0MFFMeVRGL1pDb0JBRXk3NG5MWFdJMnowUUlBMHZpakZ2SlV1ZFNxRm5kOVRSWUhXcDljMEVBN2pHOFNBRmlUcVMwRXY3c1Z2eTczM2V2SVZaamtabVJ3a0EzRVdodGRjVE9nTmhCTWJZQ01Sd05aRG9jS0wwTGN4YThVUzJPRmlKYnJrRmx5a0pCdmpQMjVOUWJ1T2xneEhIYUtCUUIxSHZRbVpRRmdvU2hoR0M5QkxKSkJnQlJKZWVyM2ZMMmZmeGxhQlVja3YybGh0QkVRdHBLQ3BiR21VY0dmUXl4NWh6SUFza29PUGFmb0RRVFNHRFhYOEVEQytZNDVmMGxLb2o5Q2hpelJNOUlDQUZ3ekJKK29RSm1zbUtXVUs2NEQwRzY4dTViOUlhRXMvbnRPaDhUQmUvd1ZoTXlRMDdBSUpOMDk4Q3dlQWZqSUVxSFpha3ZNWllpckRRQU93Yk84NzRyckZtQUtONll5Y3gwWHpnaHBVSXhiN0NUYTVJcWJTdlVhUmlMcXEzbmFEOHpSWUc0SEcxSXhBS0FlVW1aakFjQ3dLMjV5OTdkK0hCWUF3RXBWbUhMVjY0cHJQSzlSckU1RHY1akhpQ1VOTlN2YVV0RDkxK2dCME56ZE1RQWd6YjJUM3IzV0ZWZDNHNk81eXBFd3hmZEljdWZLL0Q5M2hRSWsyQTZZSzF1dFVhb2VvbHJOdS9ES09QUjdGQU9UcW5SSHJyancwckt5YjVwcC8ya01YTjU3TVFDQU82aUY2Z0JnVWFlc0s2NlN0cUtBQUhRMzN2ZWVnQ2VRQTk1aWVGcTJ5Zlc2Ylp3bGVlY25yclFRRU03TlB1elBVeEJhSjY2NFNBOVgwVVBDVkVaeG54OEhTSURqWkNDSU1pc1hnTWNBZ04ySWM2Z0JnR01pMUNKWWZoaVIvb1ZaR2hxWVlzRFdwcVJBYythSFpsMnVPejMvbjhjS2VjOWFGUkxxTXJqNUQrRDlMK0NNN3l1VzlKS1IrY0xldWtvQkFKT3MrZm9zeGRWM3dCdHc0a3JydUhCTi9CYVh2ak9reGt2SUVlaEM4TXBaRmVpdFBJRDlnc1l1ZWhaeUJnQjRrUkQydXdqcy8xWlg2SmI1WXg4T0N3QmdselZPdVJvbksrTVFYUC9aZ0x1eXpSWFg1UTdGMFhmSWVzVStBVmNCQVBvTVVxSVYxeDlOd1Y4WUtJUEF5Slc3a1BDMHFaQ3FOaVBjNkZpMDQ3NHJ0SFpGNVQvb1NpdGJiU3ZQMjlBSUpmNndoQTQ5Vm5ERCswbGxSaWtGUEtOd1JycU4vWGVnQ04vNUNBQ2dkVkRURGhTV01EMENBWE1LQW1DVFFBQzZHeStWOUdYMXdqdUtRdWwzZGowSkxhVnR5SlUyZTZseGVwbmVaV0loUzFydU9RajVQYWVYMGNWYSt2V0t5NXBaMmJ0R1JzMGFYVnNwQUVkM2VsOEVqeWdOQU5DeUg3QkVMNmQvWVp4WFUvNUlla2JBeGdXUE9DdGtpVnpJT3hEVFptQ3dwbVNQc0VXdVZkVGpJazVIcnJpWUVZZHdad2hvSVpqWHZHcVZBZ0NMejNJR0FCemo2cXNRRnVEYUZsYTZjdHJPa0JZSTVzeUpIWGhIMUFVTDVLMWtBaUNIWkN4UGVDVUFvQVc4blpmRjFPNWJBSUM3ckNGTGw0V1ZIRHBNZzdEUTd3dFg2TXdWWXRLajRKdWxOTG9OVjF4MG8xSUFJRVN1Y2NXYU9EZmMraU1rREprd2lNcDNIQlRxYWlRQXdOcmRYUW9aa0F0MDdFU1MvNFFCKzloUS9oTFg1TXBXSWlSRTJXbDF3VnNTaUQvY0J5QkxWdldCS3k0Wk8wMXVPMjMveVR3Y1VheHRKZ0VBV0IzVXJCNE1Vc3dKTFEyc1ZvbnpNcU9FWExTR0xLaFEyTk55cHJEM1I1VXcyaU1QTEt3eXZYdGtuZUo3bjduaWltV2E0aEpncE9WbDR4N1VpRTRiUkdRN1N4Qk9hVWk0dlVCU3ZVb0FnQjM2T0MyWFNhYzdDVUJLQUp2VktuZEtrU21vQkhBL3M2R0JhWEJqRkpPM0t1cGh5R0tYbE9lcHN2KzAwTW5oTlFPQTF3UTRNUzEzZ1R4b1dtMEQ5RktVMHhseVBPQ21aM0lwbG1oRzc5NGhlT0NRMjhKY3F3UGlzWWljdlJZUEFIWlphMHRJdVRxSFdCVXFoekVGL1VyLzc5dEdMajBqTjNGcEljTGJkNVZYQXR3bWkwVnk5ZGtLWTBieEpLVTVhZkZLak5uT0FhcGZjNlYxRXF4M2Z3Q3M5M2JGWmNnV1dDejVUNVFHTnJSZzViOUVMT0JUQUhkczZXcWR3VjQ1dlRtUlZxNXpGendES0l6V3lPcGxCYlJHeENrdEhXckZBQUNoRG1vWkYrN0N1T0wweW05SHlyeGpJU0RzK0JiS0o4YTg5MTFpc25OWjI2ZitMTjEwZHBsZXJKQW5zWDhrZUwwT3VLNFJHTEVDeExyc1dKcVZVNTF5d0o4STdma2V3eURRMG9JNVY3d2NBSUJ4MkJBQVFCQWVxclM0cTRSUnVLVzFkRDIwV3VVdWdaellkY1g1LzB2T3p2L0hNVSt1N2xabmx3bG5qKzFxSUpOaFVRRUFwNEZzaTJxRkFQaDZLK1EwRnVCSjdSc2dKVzFuU00yZ3lSRUFRSDRNZ2lNOEwxa2xSREFIMXh3a2VISExCUUNwT0FCUGlXd3dRSVF1dEF5MWFuOGFVN25XSzdYSGZvTmtsQU9aQmZmcUlSR3YwUExhcnlBRWdBSlJpRndvM0RuZWpmRkIzS0JhbFQ0c2ZyUUJwTGROc29hU2l0NklCNmFPQ0IvTVFFV1djQXo1VDlyZWNrTUxWdjY3NUI3RU5ES09kYU5GK3BneUdMQWdFSmZyWENaUWhCWFV0c21hN25ONm5YdGNTMnNnQUVqcTNJZXRiclg4WUd5ZEhDSkdUcEhiN1Q0QU9pYithVG5YVEI1aUF0TnpEOUl2U3lOL0c4allPQ09lQ0Zha1BJQjlxUFZoNE5RMXF6UGJ2aXR0Tm5SQzNnVm02RnNOc05MVW5PZ3JJeHRIQXd3aEFDRG5yeWNBK3JPMFh5M2wvOWp6cWpSUEFnL00vOGUveDV4ejdYZWFxM3ZBU0tsanJoRHZReTJrcTVFbnRWcjdWMEVDUEFzbzlGRFdpZVdsU05zWlVnTUFSMHFJNW9EZWs3M1cyQmhwQi9oSzZKbkJZbkpGelh0U0FnQk9YWS9PQXFoemV1dEl0cEF2RlBmckZCR2htdndRNXFYRUlEUWhpQzdRTXlVbEJwdlJsQXNBamwxeGNRYnMwclRuaWh2amNQcUxJS24rZ0VJNmM2V0ZIdzRvN1NQcDNXOERBZk9Wa29QS2FYbC9pU1QvUGZIZ0lzUm94alZnNVQ4YllMcy85ZUNpamxKVmhsMXgvdjhFdURzWGxHOWhaRHhPWUJFUCtHdVgzSlJLdXk1VWdiRVhZb000aFBzeG9jVDdRdlVyV2hYcjN5TCtZU0diTlZkYThRL1g4VktaWEhaZisxTGhpQnk0MGpLOUM4VCs1cExhdkgvUTdXajFabDhCVjcvVzVua3J3aUlURDFWTUZrQlNxdUZ4UXFwaFdnRHcwc2piajVFL212Sy9aU2prck1JM09WSCtQa3RFVGh4V0pzT2dvVXlaL0RoTEtXeW5DckVXTGR5akFIbXlXZ0FnSnV0a0lBQUdZd0ZBVEdmSVVBaGcxWlVXVmpvazRIWUVZVTZVUWRJUWFCZThPMXF6TmZUaXh0VCtRTjZNaERtaTZ3Qnd0VFdORVk1Q1k1T3NGYkVjZUxSRERBTGRvR3g5WXRPY0U0b1RiMWVCQkxnTGgreklGVGRUT0NNVWhzVlhCaUIvWG5OSlo0Rk55MjFMajRGWm0vVHUzM3VCZ1dUQVVLblUxNUhrUDJuWWtjUm9QcU8wUEZUK1EwQXU2b0RVUHdFQldnRXBLZTRoVlFDSElOT0FCZjZwa2ZldENmdllycFN4QUtBSjJNR2NHOXdMZ0NZMlhWUVV5ZE9BOVorVVlqbWlaQlhVdUVMamxVOE5Ub3FXVWl0elBrOFdQT2ZvcytXTW9JNUJ3QktFZURaZ3JMblNHdmxhcFV5eEdtTnl2ekc4a25ISnhXSzQySkFHQUVMQURjK2VSbG9PZ1kxbThJcUo4di9HNmFWNFdabWZRUGdFaC9CZE5BQ3dZM2dBTEdERjN6MWhaSFloeHdYSnhxSG1VWlVDZ0l3cnJmSEFDaDFyUFBRYjRaMnpGQUFncVNxa2xYV0NZUkMwNGs4QUVFczRaOHVWTnVrU0EvRUlsTDlWUDZjQjVyWExDSldjRVpoZkFROTNkQ1hBVm1DcWppc2toak55MTZMU0dRUkJ6NlBQRmFvcnRScnhaMjZlSUozNnRzRmx6eldxdGFJZlNSd0Fkc2xqa3lBcjNpM1pERXlLeEk1UUJ3bjNqQUVBMzNyMzdpTkFmRjBLTW1ZeW9KYWIzMFl4NCs4VEdNMGh5MytJMWpQakNsWEFKSjllS3lFOUJPdmY0OExsUVpNQXdLcEwxNWt5bHlJRUlLUXBCQ3Y5a0JxVXRsNkVDTVRuQWVzZjB6b3REa2UzSzY0cmNPbkZ1V3lOZk5sNy9VT1hycXp5aUN1dG8zK1VFRHVYY0tDc3JYaEl4aUUwSXVFZEdmTXVYSjlpaGx5YlNRcWQxMHNyeW5KcXVLWkY2TE1TUDZTUUV6T21Rd0FBaTg4a05ja1JzUFlaY1ovV0ZUZSs1ZWJuK0Q4UHJYNUdhd0FBYU53S2pXQ0xISmNkOG1SYVRaY3FCUUJheUk5VG43RUkyWkN6cXp4cTRGRURBRm1YWEJiYWF0UzBEWW9XdzJMSGxGS0pvVzVOUDJ5NTRyNDU0bFhCZWlXMWxHcXR0WTdHTEo4ZDBIZXB1Z0ZtbkYxdGpkTi9aQk5NQklhdzdaRVkyT1ZLYXpKTGpIVlZ5VGRkVElId1lraUFtekE1V09SbFBSRHZma1hjaURFQUFhc0o5NHh0QmlSOTc1OG9xVU9UTHR6MmwwbG96Y1FZL3phQjBYeWlzUDJ0TlIxVGlJQmFFeW5wdHpEcUNxVTJSMXhwdmZnUUFNRGlVeXVSUXdPS0lSSWdWa3JEYjVSM0hsTFM0WElSQU9BbHhKS0hET3YvM0JCdS9ZYjEvN1czL3Q5UDRRb2ZnYmxQVXlPanlXQ3ZUd0lKaS9jR0E1eFRJMFFsb1kxK0k4LzZ3dUMyakJoWlJGb2FzY3doRXlWbHJBZkNaZ2dBdE45dWtBd2NCUEluZXQwdTErdGo4bm91RW9sUHEvKy81UFQ4ZnlZQUxpcVpPYzJCRUlBV010UlNiRThVc3JIRk5STDVXQ2tBNkRFOEpXY0srSmlHa09JU3hlR1BBakY5Qk9GYk1MOFdBT2ltTENGdTNMTUpzZ1Yxd0xZcjdRNFkwZytvL0VWWFlnOERKSWVIUXRIblNyZzdHZ0JvMWNsMlhYRy9hMlM3TDBTTWVVb05iQ1Ayc2hEREZpR2ZsU3RPYVN4OUMrM0hwQUZxeW1RSlVzVzBlUGRMWU5BekNKZ3o3cmtNd0NZR0FDQUhnTk9RWmlJc0s4N05mK2JqODVlTThhOENLVjNuUkFaTFdsTk40R2h0cEhGTnB3SHNhUjNqTEE2QXpQT1VTKzVPeWZVY1l0TUFCMEVJTGlqdlBFVTV2WHNHOFl3QkFHZHphSmFOMW5wNlNJbjlzL1gvQjFkYWwrSklDUXZOMDl4elA0QlFDS0RWWUs5THU5VVpZMTJSajVBVW90S0lkZ2NRT3RDRVBvYmZqbHh5bGNxMHpPODZCYmd0R09kYks2RXNKYVp2K1hQM2tTdXV0ekVKKzhySy84Y21YeHhDd1JSQ0FXTU15RFd2SVFOT3pQZWZjcVZGdHM0QU5HaWNMODVRcVJRQVdIMVFOR0xyTW1Uc3JEdTloNGJtR1JseHBkVTNqd09obEZEbURucHNWcFg5dFJqUURhaHp4TmhDUXhsSjlBK2RYcHNDUTlIYmhoYzZGUURnbU1xMnd0RGZVcEJ3YUt5Umt1NXdwY1VWdGlsK3VBd0lOOFRTMTlCK2JCMEFWaHpTRlk4N1NZbnlmMFpwZEFJQ1JvQTlydDB6RFlFSXN3QzRleGh2V0kyOHhZcEQzTWJmNWNmbmdiUWd2RmZNQ0xrY0Z3RUpid0xDeFFPN2FzU2hOVEFqSllxMXdoMDhwaE1BZ0ZVSWlLMjhkY2dTV1NKQmcyZmloUEoyMlJYTXFaSHNzdE1LWUkxQmZQd1ZLQk54SjMrU0gzL01qOThhMWpDKzF4WjloNWFCb1FHUVFTQzA5U2xlb3czd3p1RWN5YnBpWnNPQnMrdFROQ2docmxBMnd6SThCNzFYU0hyVTBtRFRNcjlmR2lHQTdZaHdFb2NBeEFQUURtR21RWU8vZ1VCTWN6Y2p5QnlDa1hHRmhqSGlNZzZsQVo1Q0NHUTlRZDYrZHNYdHpyVjA0R3A1QU5xVjFOWk5WMXFuWUJkQ0lKSldyQlZtMHNKcG80clhJQVRpUXdvWDQvdzdJTy9XSUkxZGFtT3dPNTUxRGpjaWFvQVUwcnRPTHlhR2xWczFML1EyeUlDNUdBQ2dNUjR2Si83UFJHNUlNelEzdmRhYThzQVZxc050MHdMdmdVQTRWbHhZYUxHazZRYklWYUFHd1JYVlRzcS94aXRVQVFIU0lLa1BDRzdhUGRNQWdQdXV0QTdBaUVFQXpDa0NqTWwvckRnMGwzSGF0YlhjM1ZxTS9KRGlVUmpYeEhRMHpqM21Gc21kUU1penhuQWtBTkJLQVhPY2QxOTVaODZsajZtKzJFeWtIVzdkZko1Z3VkWXJ6SCt4L245bGhJYU9YSEdOamgxRldISU5obTFsSDNXNGNQMTY3YXp1UUpvVWQ1UFRRbFIxQWFHL1QrbVJPOHIrT1ZFSXlScUJNaTN6TzhRQlNDS1VXZ0RnRmV4bGk3eUd2Q2JrYVJ3YVlFTkdweXYwelJCU2JxZ1EwRG1sWEd2Ny9CREErWVVyTFh3MXE2UjlWd29BbXAxZUpoc3Q3ak9GRU1uRmpkYkpzMlB0aFYxWDJ2Um9VZ0h4V0wxelNyRzZqeWltdjB0cDdGZ0hBSi9ET2djYkVhSHl2d25rY0FrclluTzBxUWd2OUJTQzd6UUFRTmp0VWk4NnpkQ0VyOFZpUEhYRk5kYzVOZWFNV0pWY0oxMnN1VFNsZ0xrT2RCY3czQnZoTU5WNGN0NDlBQUhTVktJdG9LRFNBb0FhZ3ppRzdyQWtseWVTLzFoeFdFMVVZdGYyT0NVQU9JdFlVeXZ6UWhScGc1K1BGcWMzOE1DeXliRUFnSnNCV1N6eG5NTEdQbk9sRFZNNERWYXMyeFpuZDV3OFQwaVBRMFVpZWY4UysvOWRmdnhDQ1E5dEVGZytNZWIrekJYM0JMQUtBYlVIY3ExRDYzb1NLWXlmRVNlSTJ6d2ZBQWc0VXA1elRKNk9PWU5BbVpiNW5RUUFMc29BQUpwaW5EZmkvL05HL0o4SmJjMmdwUDVXNWMySC9XSktBV01USFp6Yll3amZISUlPT0ZaSXdnZ1lZd0JBS0gyeDBaWFdFcGtIcjlVK25FTXRVd3dyaW1KdGhxN0FYdGdMeUo1WEFZVzdBT0JrVnlHV0h3Y0k0Um9KdVJXZVYwdksvMnN2QTdCSFR5dThVNUlYbXNNTHpXa0FRTGFDWVZsZkdrTVZOOStKc3NBNGdXSlJhSFhTTlVXUWMrRXlpZElKcXRsdndwZVF4L3ZBVC80Tkg5Tzc1eGRIV2lkYkNxb244QzVKcFlBNTN4TUpNVGxBclVua1AxRWNueG1rc1hMV05CWUFZTk9mMEpydXV0TEdPbWhWUFBQZjg5SUxaaDR0enE0cG4zVng3WUMxVkMvcm5iTk9iNWd5Um9LNUx1Qkd0dks0TVQwT0N6amRoRmp5dS9ueDYvejRGMWZjbng2RlBBc2svSTRqK29aUUtXQUxBSVRPYXRMOGRGRm1BNmRKWWloZ0U1NTNiRHhuaStTQjFwVEprbW5sQUFCY3V6UUFJT2xjbzdmRSt2dFplczlHZjkvbkh2QS9jb1dLcTFZeklOa2ZCeEZydU9PS3k5aml2R2xuNm9IQ1ZwOGdKUjRxWU1TMVJFWW9mUlZkNlp3cHB2VVVHWFNsL1dqWXM3QWVrRDMxaHNMRnRGck1ZT04zUSsvbnBpdHQyb1N5U0hUT0V5K1RVUGwvQ2dUeFIyQ0F4bnFoQnptOGtBUUFjSUlxSFd1S2tzSzR0c1JJdHNodHdwUElMUDFKcDdjYkhpWlg0amFNVFZmYUtsU1lsaS85NzJ2OUlqeUVQTjd2dkJYOWpTczBlSG5nQlpod0ErcEFTV21XSDcrTDVuTFNBSUJXbzM0YkRsQU0rZTlqcnppU0twSEZqRTBqVmpaSU1USThFTnhJQkE4dDF2YldNaS91KzNsNTdOY0ZoMVd4YlNOaER3cTZGd1dMYVQ2YnhrSGVJM1p2a3JCNXBpZ1J1VC9QcDBZK1FpL09EYy9oK0NBLzNzbVAvOGlQbnp1OTNTc0xwTjNBTjZ3QXVVNXJCcVJ4QVBDczdwWXhQMWdmWHdwSU5VR3E0WWdyVkpGY2hwUzVuY0EzekpNODRMYk1JWm1temYzTHlMVmJkOFhGazdvaUFFQlhJQ1Z3QTVqOTZ4R3BmdldnTU81N3VYVFRnLzVYQ2Z0ak0ySi9yQnFLMnpwVEVzSnNKTGE2WkhrbGxUQis1b3FiMEdWZ1A4d0NZZHpLRkJPQzVCanN0M1lJaVQ0aU56NlQ4RmoyUERjVWJnYXlZcVlCQ0t3WTc4YUVhQ1loeTNrUW5YUGJuL212dlBMLzRHZlg4UWMyL0pTeFlPV01CYWMzZUVGMHR3ak1jWjdBdFFCTFh3NDd0cnNkZE1YRlNwYUpXRGhudUZvZit3VjQ0SkhXRDk1OS9vMFh2aDk3Uy9vckR3aHUrUVBIQ29vUGV1aGRaaWx1WEFORWo1Z2E5Zk9SNUQ5UkhLRmE1TEZqMFhDMWFvZGQxblF0c0tiQ1VoODNNaTl1K2dOeHgzL1RYU0RGYUkyVFpwVTBLOTZEQ0pUdUsrc1Uyb2ZMSkd4R0ZXRWpIaGdtY3M0cDc3YW9XQis0am5mOE9vb1g1NUw4OTIvNThULzh0M2U0NGxMR0xKQ3NieERCTittL1FTdGoyK0pLU3dFdkJ0WjFOWEorbmtONjZsUC9yVnhGY3NJVmwyQmVvZWVzUUFyY0JDbC9USjk2a0NEVHREcjZkU25XYmtaeEd3dXd4Q3dBN3BlaHBRVEs5MWgvejVrMzZPbjczdStUci94ZXFRdnNqN25BL3VBMVhJaVU2KzFHQ3JPa2UwOVM5c0tVc200UEZZdTdIMUowSjEyaFF5RU9URGtXVnplZlIrSFNaSlNVVmlIaHNleDVZbGpkWFBNRXE1ek9LVmxzbkJJOVJDVGtPampyb25PKzhMeXRQMTF5ZnE0TEFIUXBFMVRwWUFIVG9zUXVKb0daUDJzc3NNWFNsOE11UkQyc1dEYXRES3QzK3dPdmFHNTY5UFdOdC9vLzlmSHo5L3hpZk95VjZ0Zit3S0dDZWdBcGZPMEo3ekpGNlR0dHJ0QTVEdDJpb1JyMUUrUUZDYkhHZitQc2JtUnB4N2d5aDNqWUorQjl0VU9oSGRwQllCUWorVkk4TDkvNitaWTV4OFpKUEZlVEVYc1FEN2lzRThiUlpvM0RQTzN2SjNVQ1FzS0c5OEY0eEh4eTNYOWN4L2U4Ky85ZjgrTy9LMEorSUZJZzRUY0krMWdyWXlzRUtIei95Y0M2c3JCTG1wK2JmcStpNVNmQ2RRZ1VCNitIUEFlL2dlVkJMZkFuUWpLTmxWQ1RjWWJIRGRrMlJ0NE41dDk4NFFFNGQ0VFVVZ0t4dnNKa1JLb2ZBNDNQdkh6NmszK2V0VC9HVXlpc2lSUnluZE9ZSlZ0SytxZ00wUmlnZGJ0RHlyYkZGUmZwRWhmM0dBMHVPdFlGUEM3WmIvZjlQSFhSK3pBSmo0bmZOd0VFMVBvMXhLcW43SDduZHh0MWVsRTBmTlpUV01ldlFlZGN5dTNmWDU3NTZ3SUFyY29FVlRvR1NjQm9zWXRCVjF4M1hadkVZYnFYc0xqeHNOOGhkRGFzREU3eDR5cHJYM2tGLzZsSDd1OTcxdlZ2L1dMODBSL29UL3gxWC9wRnU2R2s4U1c5eXdDbDczRDN1RkNOK21FRkNMME1zTVovNllvcnVsV3lwdkxlT0lmYVlSOHhEc1dZSzI1UzBRZHIya1FIOENNLzE1OTZBZmU1QndGM1hISHJhcG1yVE1RZTVPSTZuVFRQU2ZzUVU2ODZBOElHOTBGdllONTVQcFBXOFovejQ1OUl5TGVSUUJxT0VFaWluR1gvY0ExN3NjeDVibVB2blRRLzMvaDFmS2dJMXg3WVM3d2UyamQwR1BMZ1JvSk1HMURBdzVQSXRSdFVBQTQzYkJMUERhWnhjVW9ncC9SWmY4K3BmbHdkOGdNUEV0L3hDcVVhKzJNd1VxNDMvdXp0bi8rOS84RGgwMnFpbHp1NktFWGxpU2N3L2NLbk12M09DN2IzdlpENzFHL21iN3p3dSsyRlVZMy9iYTIvVDZPQ3hQb0JZZUdCYmdZa0tUV24rK0c2VnY5KzlWNUlQZlVIOXI0L3lCSlhFNVQ5a1VmWjcvckQ5aHNmbC8wMy84OTMvR0ZFWlNXSy9SVzljd1lHcGlEaUlVZHI0a01QUkg3cGxlUkxWNmhTS0JrSjNaQ1ZJUE1pYzlNTHFVT3Rpc0w5QVFTS01FK2YrbmZueklmdXdETTRzNklGaURnaTlQSDlXLzExM1pIdi9RcFkvUGplU1h1NHkzaEdMK3lITnJnSDlqWGdkK2xRRkdmTTg4dTU3NzNJZS9jWTM0WldFU3JjSm5Ccmh1WWVuOEhndXhuV0xra0d0QVN1N1NiQThOeUYrelQwd0h6SisyQ2FibWZnT2ZLYnBQdmo5NmI1enVhRTcrd0EwbkhvWGZrZFhwSjFIRE9QcnloYnFWSjUzazdXYTh4YzQvbC9hRmpUL1FFUVBwSUFMcm41MHU4VkdmdzR3YmlLTWFpUWlIc1h1R0F2WUo2N2pGVGxicEx0VHlEa2ZJdFNSYnNvMWJQYi94M0t2eGV3Znp1YzNvZEhHNWpwOW9KTEFZY3MxbklHVzdrdktsRDhMdzNGUHdob0Zvc3FkTUpCN0lOWTBqaTREak1WQUFGeHQ3MEhRT0IzZm9OODVLL1QzTlhpQWh4MWhXNTVHQjlpTngrV2dmMEVubGRQZ3FCUHNkSmlMU2NFQWJmOWQ5YUFra1pCcWJGTytSa21BMVVSQUIyS3hhZmRreTJ1WmdXOHhIaUEyS29jSlk5RWI4QlN3bmZSWE9jeHp5L252bzhqN3oxa0NFOGsrTldTeTUxZHJOcWVHU2FQRFFMc05KNHVqT3Z5ZGJJdjBWdVkxZ3ZXQU5adXhuZ08vaWJOL2ROOForaGF2R2ZTdTJwZXk5YVU4eWdlaDRIQU0yS0g1a0VOdlQ4WHVLbFg5bDhmeU1NSkl3dzNBNkVyREM5WkhSai82R1hsMTE2NWhrS0dVd2toVlNzVjk3SC9saGNRTXVxaDg0MER3NXl2Z0hRdTJXWWh6NURsY1VMdjNFRGtRRVB6RlFLQXBQaDUycUhGdVJzcVVQeXM3QWFKalRrSHhDYk1PZVowR0dGalRsVUJDSHhPUUVDKzZ4UC9UVDhRdXg4SmF6UCtYZWFKSVlwdFlKRWc4aTJFSnY1RXhLa2hBQlFZcDUweDRudGpCdkZGbWdmZEJPWGZuQkJIMUo0eFF6SFdESkF1YXhOaXZoeGpubEhpMXRaN3gzQkFKdWk5dGRqMUNKQ21aZ0o4RkNiUHhUNS9XcG0zMEgyZlI5NWJFNTdUUkZURHVkZElWbHE4ZlRvUU0rK25jeGlTQVJsYVo3NTJsTklGMC9CZ09wM2RhOFQ2VGN6OWg4RXJFdnVkb1d2eCtVbnZPcTB3MUx0U3ppTnlEcVlxbE9rYWh5cjAvcE5LZWludlArd2hnZ1RXRlNKOWFnUlQ3Wnc4Tkt6L09rVUdJOEZhSTRUV0I3d0E2SW5tUm5yVFNqNytPTjFiUEVCWXZFbmpob1E0SjhoUjBmcndhTDFja0pqYmhnQWd4Rm92WjJoTTkxY1ZLdjUrUmZGalB1YUtrbllvdWN5U3lyUk9MT0pLZ01CM0JBUStBMTdBdDdENXRCN2owdkJqSFZJY1o1UjBNS3dGLzdXLy8rZXV1TDN2SkJ3Z1pHcXZHQ3gyTGZXbHlSVVhuM2xKWEFabUVtdU1jS3hBSld6aG9pcFVpZ0FZU1dCOXg3NzM0OGdzRUg3R0txVVNUUWJTZTVCRnI2WFB4VHkvblB2V1I5NTdVUkdlWERHVGM2MDV6U3EwbnBxUXhPeVNKQm1BdlViNFdpNFkxSll5RTZiSGxWWVdYRXo0VGVqK25EVVUrNTBEQ2RmaTg1UGVsVk5rZTExeFMrK1llY1NDVVlzVnluTXRpeXIwL2d1dXVNQlVxeXR0TWpVSmUzcGR5YW5mTVZKTXRYTWlLWFVoNjU4clQyNG9LYUV4WG9BbVY5d0N2Yy9aZlNlV1hIR2hJUzJjWW1XSGhMSk9NRU5INjhNenIveDlVZDBTQkFDaHZQVnlobFZlc1JMRlA2cWdSY2xWbFJyUlhKeEREamtXQStGdVRXbUJ3Q1BLdlJVZzhLMy9ybHQrdzBocVRLaTRpRlNrMG9xU05BQ3IrQWZJVlBpTzBwVG1RWEJqd1l4US9yUlYvRUtlMTBRc2NNd2w1dHJUdThwaFZldFFHd0pnSHNEWmxuSlBxMXNqZXBacVhYSWRDQzIzWE41WmhJdUFLTW1YM3FGckpROTZVYkd1WStwUTRQTkQ5MlhMS2VuZVdyRVVyWEFUc3R0eDdyVkNLN3llV3Q0ODd1ZXRCQmtnTlFWV0ZYbUJmVU5rcjhUVXdrQ2hqZFlkOWhyUjZtZU1KTnlmYTE2TUpuem5FaWc3NjFwK2ZpYndycml1MkhZZFczckh6Q09YWGk5WG5sdDFWRUx2ditwSys3VzBneUUwNllvTFAxbFY5V0lLV0dHUnFSanJIMHN4YzV2akdDK0FlRVV4YkduMW5jRENTVlk0SmFsbHRGWjNnbXQwY0IrZU5aZlFBVk1EQUZpNXJwSktnRmFsckJzVktuNUJ2YWo0RHdQUDFBQkF0Z3BBNEprQ0JIN3cvMTNqLzkrakNBQndIQUVBNUY1U3ErQ09LNjJBSiswdDVmdndFSEdWcjFENVMrRWRZS3hNVUtac05LbkhubFdlRWV4RUZSQUE4djVZUVJBUC81NGlFTG02WEZJbFNLa3VkK2hLeTNYdWc0Q1dBOHpDU0dxeld5VjBrNTYvWVFnNTY3NG9pSkx1emVWU3JkTE5uTisrYXZ3VzV5WVgyS05hSlVXcjRpVlhGY3dsN0JWVzBBZXV0Qm9tbGxIR2pxWUNsQTVwbmtJQUFLL2xYaHZjZXo1bjNIYzBjTzFPQWdEWWdiTXI4eUxnWWdhNEdiTnc1bkZPZGhNQUFIOWptcUZWVW0xUlpHdlNma0ZYT1paK3hqNFNXSGt6NXdyMS9xWE1OSjhUOUJvMXBMRCtOMTF4UTZBMFhvQWU4b3BpVjBWcytvWFZTS2NDNFJTdG5IcVNQdVh6eEgxNHR1anZTdFl3QkFDeXJyeHFjZHNKQU9CdWhZcC9uUlMvQ0UrcjFySjJ5UFpkYVduWFdDQWdUTjhHQlFnODlBcGJxZ1BLcUFRQTRIM2tlWStkWFc3NDFKWFdzNWY2NlZMVGZ6L2dvWkVDSXh3cld3RUZLcytST3UwNUVsekhBYUZ1Q1lBREFCSnl2MFA2SmhTSTA4ckJUK29GSVVMbUJCU3Y5RVRBKzJPSHNXUDRKdW1NbVhWNk02YWs1M090L21OWWwxTkZFT0ZlU0xyM2dRTEVOQURRNit5T2E1cnd6U1hzMFRUMThyVytBcWVCdlpLQmZTTDlNS1NGdGZURHdBWmZHVkNRMkZsUU9oTnk1OFlCVjlxcEVac01JY0RRR2pxOXBybVpCejRCWDN0STh6R3NoQUN3YWMrRksyM0RPdzNYYm9DU0NaME5EUUFjUjQ3WHp1NmxZZ0dBcEY0TFZ2TW4yWDg1OG9wdEF4aTNtbGh4YWQwMDFqL3U3elJlQU54clN4Ukd4SVpydUxjWEErRVVEUUJjdUhEdkNmUUE3TkRaMkFBQWZHNnRZUXdBU0ZNcGJqa0NBRHl1VVBIdktZcWZYY1M0SWZpUXJZSVZXdzRRNkRXQWdDaitlbGZvQnRjQ294d0EwRUlEbjJjQkFPN0N0dzNLVHpaSTFwVjJSNVFZblZTaDAySmxlM0FQYkNpenJjVHVMS0VlRWdEU3hZNjd6RWxUa3B3cmJ2ZVpwaG5VSG9DVmZYRFA3WVBTeW9FVkp1aDlGNzRwNTBwYktLTUZHdlA4STFvajdiNWE4NWVrZTZPSFp5OFFBdEM2MFIyQmtOZ3oxdk5OQUlBK1YxeU9GNXNwSGJuU2JvemNhRXoyRmJZTVJ2blFwd2pSbkN2dDFEZ0Y3NEN0ZFM5Y2FWT25TVmZhKzRHYi9TQkhhUUJpdjh2dzNnSTQwZUpkSUVNbVIrQ0N2V1BkQ2dEWWlSeUhyclI5Y0RVOEFKb1NQb0x6aC8xQmxzbmJld2lHeHdFWmZOamZKWTMxZitwS1c1SmJYZ0Fzc3NaN0RjT0llQlprYjY5Q21JbkRLYjFsQWdEdDdPRiszS2dXQUlpcEVEY2RDUUJlVkVueDc1TGk1MUxCdlpDNk5nQXMyTGtLZ1FDbS9DQVFxSS9JNjAwREFKSnlqVFVBZ1BGeVBFQ3JKTGlPbk4zWVI5QnV4a0RMMkc1VzR0YlljMTY0Q091R0pUdWdXSFhZNVZDUS9SSndQTmlTMjFUYzVDMEJKWWxXN1M0ZDFDMFNkaEtDMklQdld5R0ZvaW1Jb1lqbjUraStxNjY0STl5WnN4c1lKZDM3RVBidFdvQUVtREdzWGhRYzFucHFSTldyQkFEZEFhVis2a3BiZzF0Z0lhdDRDL3FjM3EyUkJlWUtaRWFnRitJWXpnTis2elM1LzQvSi9ZL0tCZE9DSnhTUDJLbWk0RmRJR2VZSUlFeVMvTk1zMWREWUlvOVFWcmsveXZPMEhBQnVob1RmaVY2TVdmQjRNT2k1TU9aVTNPbHByUDhUQ0RscVhnQ3VIaXBlZ1ArL3ZUTmhydXJLcnJEL1JGSkpWeXJwVkpKT2R6dHhPdTYwRzhkbDQ1SFlRR09NUUF4Qzg0Q01FRWdnQ1lTR0VwTFFBSGIrOGczcXVpZXN0OTQrZDNoNk1yVDhmVldudXNxTjdudnYzbnZPMldjUGEwOVorSFduNkd6QnZWNTB0aHRlbHpCYjlDN2tRZ0FITFF5QVhadFBhZ0Q0TzlyYUFLaFNoNXRzWVFDb0dNNXhOdjZWWU9OM3FlRHZyTlpXWlQxN01RVHVXN21ZR2dJRERldDZteGdBVFhRVnRHRlFhays1WEhRMnVYQ1g0WFpSMzlvM0dRQVRSYjZQdmZkNjE5S2ZlY2wyai9xRzV4WUFuNEQzSlR2NGFjYVM5ZStlMnlSOUlkT0tBRzk5L1Z3bTdaTDhqdVVHRzF6dTgxL1k2U1psZzN0UCtCYzlHQUNIY25wWmtmYzBWd1lZNWNTNDIvdWgvTzE4VGFucVNSb0ExeXZjK241cXUxZDB0OC9lQzl6NTM4djM5K1prYW1DNGE5Ly8veDE1ZDMwemF1TCtIeW82bS9aNFRreGFSdy9sTjZ5YWgwQmI5S3JyWDV1a1JiRnFIeW1uWU5VOGhidEJDTUpQeG0yckFLYUN2U0tGNE54TE0ybW45clFPSEFaZUZhMDJhM1A2MzdabjZ2a2M2YmU2THN0TUpwU2dYdGhOeVpmYWxmQm05TDJqSk1CTjhiUkcrMm0wSnV3M01BRCsveHB0RFlCYndSaHFhUUM0R0U0dkc3ODJrdEdOMzZXQ0w5cXBYRVUvZWpFRWxqT0dRS3BEYmxMWE8xZGpBRFRWVmJndUpUNTNaZU85SjV2Ym9wemsyaG9BdVltYU8zbE5TZ1owRWpmU3V2MjBJRTBGN3RTWGRwTHg4Y1FNaGZYTTZhTEtUZTRMV1M1MnVTVVo0UFB5Zmk0ZHd3RHdoVHAzM1Y0TUFJMFRMNGluS2ljRUZMWDQxZENRZWtnaUE5dkZxazdTQUloS1ozVVQyTFBGTkRJc2ZYT2VrVVZkRFF3LzRYdmVnSjdNRGlUVXNoZHNSazNkLzZyWHIwM1MwaWF3SWNiT2M5bFFJdGYvdkNYR3BsTnJsSzJ1WWx2M0xNVDNQRENFbzdiTzZmcHRkUUQ4ZlhsdWVRYTZKbWtPZ3h1cytueDhyclNOL2VkeUFkellWUytBZDFmVjBPZTJYR2ROakF3TnpYcUZsSmNCUGpZRHdNT05OeXNNZ0UzeDJtMVZlUkY2TVFDdXlCam93UUM0VlhTSzRSeG40M2YxTkpWUlRWS3hxZGNManU4QUFCYlZTVVJCVkxsRThnWWN4eEJZRHd3QkZSNnFxK3ZWRVJrQWJYUVZ0TjNubmFCQ0lpV0JhSEptV3dQQUorcVBnY0Z5UjVJa2g0cE9pZU9vMFViVmhyRlpNWm9rR05VbHlqMlNoYXhKOHRKc3l3MnU3dk4xb1o3cWt3SGd2MjFhN24wa0JhejF5by9Nblh4b09SSlB4U09RTmxndHV6cHBENEF1NExOQmh2V2huWTdtQTNkb1ZhejRXcEJuc0pZSkhmakdzVkdSWkJpNS95T0ROWFZEMUNacDA4R21yQ2Z5YlV0RTFkYTh5ZE9tcGJGZXI2NkNUSE1aWTJQUHdrSGFqZEN2MzFZSmNMckNveGJsR1l4azNwdXF1ZExtOVAvVVBEdWFYRnJsQlhDdEJ3MlZQWldENDZhRjVwYk1PeklsKzFFeVVoN0pvV2N2WTBEZUNBempuWi9LQURoZmRQZGpiL3EzL2tDT3MvRVBCeHYveGZJaEphM2xMOG9YNG53ZkRJSGR3QkRRaDFKWDErdEREWUMydWdxdWNQalFLaVMycER4U3kybGVOalFBWmdJWDlZL0IzMm84T0lWQnJrdkpuL2NjeUYzM1FGelJ1Zkd5RHdiQW5EenZKdG5ML1RRQTlQTlB3Z0RRaFhOUTd2K1Y4dDMveHNvQUY2ejhUTyt4ejhObFdiUjBVVHhKQThCN3k4L0w2ZHBqd2NzVzB0blBaT2hyMHVnVkNhWGR0VkRab1NVYTZvbHNSeElsdDRQRTJwejdmODdjNFovSlp1VnFjbHA1ODB3MlBmZDhlQ21jU3MxK1VYUXExdDB3VDhPQ3hkWVBKYjlIUzI3VnVFaWVuOVRXdVcwdmdPZ2RlSm1MVWZkb0FEUTUvV3RpNkhJUFhnQlhlN3d2ejJ0TDNrc3R3VXQ1Rk80ZHVSbUVSamN0dDJlcElwL0M4d2JXTGI5b1IrNVZoNWJBbXpBQVJnS1gyN1prTWJmWitKT3IzemYrejBvM1RXclZlN1pQaHNBemllTnNCYjl4dENJck5qY09HdnlibmN4bmFVM3dFN3VYKy9JQ2JZdEI4S0tsQWFDbm1SOXFZdkRwdnVZcUY3NnFtTXh0ZENjd0FPb05nTFRvdW02RmhvN201TVM2SnUrcmJqYlBwVEpqSlNpVE9ra0Q0S0tzTVJPWjhqcU5lVDZxMkpUZFdMMVVicFEzR3BZRHFxY2tuZllmVzZYQnVzWHZvM0pDVmRFN1czUjNIOVRUdVhzQi90ZThHbzhrcktHdStkUWkvVk1MTTZoeTZJSTg5NTBnNFhDNTZCYmRVdU1pNmU2bkptRlhnNkh6UDJuMVJ4NkEzSHQ4T3lnRmJXSUF0RG45UDVSM3FvMFg0SVlacHA1RHNXVmhsZTNNSExwbHVWRzZtVzlWekx1clJWNDhhRlc4VmxxaXYrSmVoRGZsQVhBRm81T3F6VCt1MkpCN0ovYXM5SERGRW91aURPdTZzZGZ3MzBVSm1YZUQrdUVEMlNUWHhNWFZOZ2NncWpGMUQ0Q3J3ZzBXM1YzSDB2TkpDMGV1ZHJXdDdrVDArUmdBblFaQTZqcjJSZkZhUUdwQXduQXpGZVd4MjBISlozUVNPVWtESUhVRTlFM2FOUUYyWkQ2bXFwTDlvRHhQczdvdmxPdkZZRVU1WUFveHJNbzlWNitDYm1JYTY4KzUvMmRzSTlFdW9hcTZxYWZ6amFKVEMrTkZFZXNEZUUrRTlPeTFhY3hrMGFraTZLVjFPOEdHbzdMYjdrMzZzcWp1Z0tjaWFzbHJVSlVERUhrVzFWdWxjL1VnS01VZEs3cDdRdFNkL2g4VTlib0FrUmZnZW1hOWYxNTA2aFRvUGE0cXA0dzI4eWNWbnJmTFJWNCtlRkh5d0xSTWY4RVNPUWZmaEFHZ3J1dmpsdVRWMWVhZjFNYXZwWWQ2UTkwaVhLa1puZ05RTmJ6UGdidEVkK1FrdlM1bGVBK0xUaEdRT2dNZ3VlcWlFcE1mS3R5cVNYZGN1NDRsc1pXaGlxUXhkZVd1eVhldUc1RXVQUVpBdHdGd3RNbDhWTlpHLzZIb2JNSXlFM2k4bGl5T3FXR2pLSHU1NmYxUjJlZW1Cc0M1NERRWHhlcjNKSG5Say85MDh4MlZ4VE90QzFjYmxnUHFwcjRtc1Z6TjF0K3VPR1c2K3o5MXh0TXVvYm91TGt2ZXpxRVk5WHNWNVhtVFFSaGdNTGgyazNLL3UySlU1UEpKdmltcU8rQnAxNzYwdGxSVkFXd0dWUURUbWVleUg2eEQ2Zm0yT2YzUG1XZXBxUmZnZWxBcW5RUzVORHl6SXFHQTlhSmJOanJOMVdnelh5ZzZteCtOV2dKbVZRT2gxQXpJR3dwcEU2V0JOMkVBcUtWYjUyNXZZZ2hFSlhsNjRyeDBRaHUvWmthUFNReHNRcTU3djJMa3FnQnl3enNkUmk3NlE0djF6TXRwb3M0QThMYTlVWUxKQzNOQlBwUXlzeW5iVU9iRVVCc1BObW0vcmx2ZGRab1RVWVl4QmtEZUFEZ1NMM212Nk93RG9PV2FkNldhWk1IaW1WVloxMDN1VDNvWEhnUjE3RlVHZ0daemU5bnJrK0M3clFVbjk0ZEJLVnJ5Y21tWHpycHl3Q3JYOGJhVll6WngvNTh2WGpmR1VxMFNkU2MvS3pxRmpQUy81ZHoxbWdqNHJXd1NkeXhjV0ZmdU54TU1yeWk1Vk9RNzRHbm5VWlhzOXZKaVBkSHJ1akl2MTNSdlNKVU93TFdXcC8vWm9wazZvSHNCa2xTNjVsTXNTK0wxa3VSbVBiR3d0bGRzZkpmWnpMK1hzdkJSVzUrL0xxcGJDSThGLzYycjNYaXZCc0NGWXhnQTNsN1dEUUZ0TnRQRUVJaHE4N1Zuc3ZiUDd2Zkc3emQwVUVwdXBqT1RhS2FvMXdHSXhyUmsxZDdJMUhKN05uS3E0WDZZTVFDV3BTVE4yL2FxQUl1Nk5iMWtiOUhLRDFYeWNqR3dublBDTG9lMm9DM1lJakJ2MTQ1cWpERUFxZzJBZDROVHkyT2JTL2NrcWFsSnpEWG5LZEx2cFFiK1U5bDhmcWd4QUQ0ckY3ckxRY25lc25tUTlJUWNlU3Qwc1UwSmNsL2JhUzVYRHJpVktlbnpuSUU5K1E2dVZEZ1R4Skd2V0N3NWt2blYwbFQxQ3VUS1Z1L1lKajNhc3R5djZoRGltaExmRmZrT2VFc1ducmd0M3ljbk1MWWJsS0V1U2E2Q2FnQjRLYkpXZDdRNS9VOUoyTVdOa3NnTE1DeTVaMXE1b2Z1WGRuM1VUcE1MUldkcllHMW1GbTNtNCtiaEhwRHd5eGZ2OUpNV203akwwN1kxQUM3V0pPRE50VFFFdkRiZlQ1dzN4VlY1RWh1L1ZpQm95YzJ3dWM5R0ttS21VVktiajJHSnFRMVVKTWJzV0FnZ2RiWGJrTk8yYm5TNXRyMGptVENENitHcnFsNHFQVWt4MDhmQlJxYkppMzdkZlVtdVZEWERKWEZOcnhaNWxURU1nSG9Ed0tWaGMyVks2Z0U0eUp4b3h6TGZ5ME1HMnFYeW1TVDgxbmtBUGlsZU45TzZWbFJyQXV6TGV4UUp1cVNGKzVJa3lPbTFoKzJadUhMbWZuRHFqSElHZHVVN3VQcWd0c1QrcXVqdXpPaForUWVXZStIL3Yzck9WQXhJM2NXVFJWNWJZRThNaUxvUVpLUXE2VkxBTGllOEhDVHFlaThLbHo3V1NxczFDYjlFdVFxNVhnQnRUdi9qUmIxT2dQLzdXMUs1a2ZhWFNha0kwS1IxOVlqT2loY2xKVlgrMlNCOTUwM1RjQk1meW93MkJzQzVta3o4cVphR2dOZm1lODlrZDlPY3hNYWZLaEF1U0s3Qk5TbkZHclNYdjJrdkFCM1hpczZPaERrTmMwMENYQmYzWlVwTzBWQkJWZHRlemJ4ZXNNVkRqUURWMWQ4b09ydFNSUnZaVUpEQXVHRmxTRkUvZzNXNU5sVUEvVE1BVXFub015dEhYUzg2TzdUdFpCTGFQSHM1YmNpNm1HL2FLWHFuWVE3QVI1SW81NjU2MXdUNFVVb1ljODJ1VXV6MEtMVHdzWlRKRFFUbGdLdnlXMzRzdXVXZjV6S2hyQjh5Q1lqalJYZkRyYWd6bzU3d1hlWTNhaHFrSjJlUDN3OEg3MWt5a2w0VW5ZcDFkU09YTStUemFLOW1UY3MxR2RzU28yZmZxcUQycFB4eE84aFY4TmJna3kxTy84TkZ2a0ZXMWQ5OExlSGxHNUt3Nk8xK3greS9wVkJyeWxjN2V2L08vU1VZQUpNMW82a0JVRldTZDFOdVdsTkRRQzNHcUdleXU1eDg0OS9wdzhhZlNnKy9GRVBnVCtWdnV5VFdZaS9kQUhWY0xOMC81d0szbFM0SWgwVjNaNjl0TzlYc3l3WWViVGhha25SUGRBWTJaQ0YvVVhSMm45c3I2alh0bTF4WHU5THBJckRmZ3c3QXl6ZHNBTHc4UVFQZ1paOE1nSU9pdTR2a2J0SFpmVzNENnM0bnhXaWZ0ZXo4WGRsazl1VTYyczYxaVFGd3BqeXBmOTFRRThCMUFlNFgzZTJ1dGFuTFp4V1ZCbyt0VGoxcUFPV2hMSldUanI2REppQitXblNMTXEwR3VRZFBMTmRtUHZpM2gzWXExdE5xN3YxOVdkVHJidXpMZDJscUFOU0pkZVhhaks5S3NweTNwZDYxeXFhVm9sT2FXRU1TNTRQZm5BNGtHNW5UZkM1bndQOU9mMHNLSWYycDNOZVNjZU1hQ05GL0c3QkU5VS9mZGdOZ3J1Rm9ZZ0NjcWFqTnYzSU1ReUQzbWFNWksxVmZxT051L0VsejRCTXhCTDRxTitwenhmSGFBWitUY1hUZHo4dDdOeGJvQUd3V3I1dlp1QzcxVTFuVWRvdk9QdlRSaGpOUWRBcVQ2R2FkN3J0K2xrN1U3UXJENG1yRmRkZmtwTGhiZFBlazN4WmpiN21CQWFEYUFYVUdRRTVqSURwQjdUUTBBS28rUDNmZHBnWkExYlhiaGdCUzJkK3VQYzhkTTY0ZkJoNjJTTmhyUTY2M0Y0VHVWdVJkM2Frd0FENG9UK3BmV2NaKzFFOUM3MStVZVo5YzcrZUsxdzFkemhhdmhYZ2k0OEtmdDc5M0hvYnpkNlBLL2Y5SnBveHNSend5THZPYnF4THd2Mm55bnJVZFRRMkFPcTJPN3l3UmZGYlc5UlVKOFhrNDRhbmtmaTJJUVRRbTNwMzBmRDNFb01OUDhvT1pxb0hIOW5jZHlZYnZuRFlxRElCSExVZWRBZkNmWlRtU0dnSmZsaFB4d2pFTmdhWUdnRzc4UzMzWStQOVlMckIvTEY2TEQzMXNNY3ljQWJEVHdBRDRwQndmbDR2NW1hSmJDVkJER3o1eEhzdnplUkw4LzEwQ0VYTGlHckxOV3FzMWZLS3FhbUc2dHg1YXFMcnVrbVRNcmdYWFhTMWV0OWFNRW93bXhSMzl4SFFEdlB6R3ZVSTVqWUVwTzZIcHYzT1BVNXZQcjdwdTlEemFYTHN1Q1hER1NsV2plNzRlNU5ta2hqdWFZK1BTM2c4ejcrRmEwZDJGVVVjVWh2cDlPWjgrejV6VWM4L1BUM2szemZWK2RELytLekF1UE1jZ2Q1L1RlemRkOHd5cjNQOGZaYnlUZms5VTVqZktGM2g2alBlc3pWZ3RZdkd2cHZNb1plaGZsT1RIWWN2OTBpUmZUeWpVSm1kZXpuWk5FaXMvdDZxSEJSc3FhNnlKNlRlTGJvbDZIUjFWRmo4WEEyQ3R4MUZsQVB5MkxFZEtoc0NINVliNWFSOE1nYVloQU4zNDlZWHFkZVAvajFmajM4ci9mYjljWEQ0b1hyZWx2QmdZQUQ0aG84bWlCc0FINWYwNityemZTU1dGR2dFTHdlVFJpVE12RysxUzBhbExQV2NKZFVtZ1pOQktWTFJzTTVxb0tmdGZ1OGZwS1N5NjdyU1ZvRDJzdWU1OU93R2tCVjVqaTR1bUc3Qm9XZEthRjFLbE1hQXgydWlhZWlKdTgvbFYxNDJlUjV0cmE3Yjc1K1c3K240NTk2SlMxWVdpcy8ydjMzTzkzK05XWlhNdE1PWVdhcTcxSUxqblVTTHE3MHBqVjAvcWVsckxQYi9vL24wcnJ2Y3o1ZnJ6VVhsL3pnZWJRTjE5SG0vNUROMzkvMkdRbjFSMVQ0YXRZaUQzTjIzZXN6WmpVVFpCM1R5YnpxTmtNUDZQR1FHZSszVzNpRHNXemtsWjNJVEYwcE1tUWNydFNPdmlUUGw5ZGN3VTNRMnRMaFZ4a3pvZGQxUm40ZWRpQUJ4bjVBeUFmM28xZmlXR3dQdDlNZ1FXR3lZQlJwWmtlcUdHZXR6NGYvMXEvRXY1disrVy8rMzNrc1NrdGN5NUNSbE5GazFZT3JwSC8xNWUvemZpU2tzdiszVDU5M1BCeEVtZWpXaUN6VVVDRVZJbmZkbEtWSkxGL24ybTlqZGRUeWViZGdQTVhYZENhbUJ6MTcwcjE0MXFrclU1MHZlQkNJYVczMmhsaU9zTXpJbzJnbXRXK0RWMVUyenorWFhYOWVmUjV0clhMTnY5VExtWi9xYm83QTZYM2duTlhvNXF1ZS9JL2RiTlAyZk16V2JldzV4QXlkMU1LZXA3NVhzZjlYZXZlbjdSL1VzYTdoK1h4dlI3a21PZ3hzVkpQa04xLzMvUTRIZjRQUmxvK051YmZzZTJRemZCdEhrMm5VY3BSditaR0FGUjd0ZEUwUzBvTkNWSmRLTzJUcXNxNFNmbE03MHU2OHFZRGYzN2xJVG43L0ZJNXU5UzV2NlYwMm9BNUZ5TXZZem9OSDQwZWYvdTFmaUgwaEQ0MTNKRDY0Y2hFQzNJVnpNVEpyZnhYKzF4NC8vSFYrUHZYNDFmbHIvcnQrWHYrVkJxbWIrMXNwODdEU2JMTitVSlJWMjQvMXgrM2dVcE94d1NuWVBjeEJrcDhvcGRYUUlSeFd1ZDh2T2lwNURjZHFNMUV6VUpVVVRkQVBXNjJxcFphMkFuRzF3M1VpVzdMcHY3UkRCMEVxczJ4RVFnb2pFc1NZdTNaWEZ5WVkxUjJSVGJmSDdkZGYxNXRMbDJPdjEvV2M2bFA1Uno3RmRCcVdyVlBaK3lhNmY3ZlZrU21IVHhWS0d0eWN6ekc2MzV6U3AyOHE3TUk5Mm9yOVk4ditqK2FTLzNOSmZVdURodlJ2VkpQTU92YlQ0My9SMTZUK3IrcHMxM2JEdFViQzNwd1RTZFIzODJnTjZCdDlZQXFISjk5ZW95dWhkazRmN1ZxL0UzcFNId3kzSkQ2NGNoRUMzSWx6TVRaanpZK0MrWEZ2bzNQV3o4djNnMS92clYrTnZ5Ti8yNi9MY2ZTQjdBaGNEdFZUbFpTdmYvV1R2QkhYM21MM2hqQVFDZ1h3WkFsZXVybHhHZHhyRUFBUUFBM2pJRG9NNzExWFpFcC9GdnVOTUFBQUJ2bHdHUUVqS3VTK3hUeDNWUkw3cG84ZHRiRlNxQnZRNVhTN29pY2NiYm1aSCtSbU9VWnpQeDhnbUxVMnA4K1phRUJqVE1rRTBLc1RqNXpmSWFPbTVLSFh6NmZnTVNFaGdwcjluckdMYXMyTXVpc25pYzUzQ3JzSmFlekJZQWdOUHJBUmhyc09GZGt6cjdpUVpLZ1cySDZ5V3IzR0l1K1N6S1V2NmlZY2I4WGNtVzErVEFVVWswekphRkZOV2RtWElla2FnMWE2L0RzK0xUOXhrNzV2TkpTVVVwbWVrU3N3VUE0SFFaQUpxZFBsdFhCeWsxczlQUzdLQmY0MjVRMW5SYmxLTnlkYUlxVXFLWnQ0TTFOZk9QcEJUdm5sVUpwQkxDQjFYQ0VFVjFiK1pjVGtUVW1yWFg0YktZWHJ0L25HY3hyZlgyekJZQWdOTmxBS2pNNUVLZEVwSkpKeTcyb0JoWU5iUm44bWlnL3BWVGlycFhkTGJEVE5uMFExSi9yNnA1YTZKU2xoTUl1aU02NTFscHlLS3o3ZVppdzZvSUZ5bDYzT05ZRVkzMkNTbkhtcGJ2MCt1eldEVHB6R3ZNRmdDQTAyVUFxQWIyazJCRUc1NXVqbXQ5SEZFbkw5Zi9kcTNveDBWM084eFVyenBpc3AycW03OXJtdm1SUlBDaU5FN0pkYU5MZmU0WFJRcTFUaGZCZGRtM2VoeVJGcnhlKy9FeG5zV0thN1F6V3dBQVRwY0JNR09OTGJack5yeElZMyszRHlPbkl1Z2I3SVkxRzRsYVJLWnd4YmpvWjJzcnpRTzV4a0dtTzJDU1NIMHFYYXEwTGVwMHBpMXFFMlhFcURQYmZzdXgyOEFBZUNMTldkcU1zRWtMc3dVQTRQUjZBTFE5Nlg0TEE2QmZJOWZVWnlab0lic3JmWnZYcEtuSXJPUVFxTXh4MnB3UHBMZjBSdGxNNkxuMW5kNlFSaGliWW15c0JaMnhJZ1BnWlVYcjJGdVp6bXk5aktZR3dGN0xnUUVBQVBBek1BQzhTOTNSUnZlRDlZTFdFTUNJZEJWYk9rYjhPaHJMMGc1MVhIb3FSeTFrTjZSMytiTnlzMTRLR3IvNGIxT3ZRZXFxcFcxTUQwcURJTFVZVFI2RDlCbmVmYTBYQTBCekFKYmt1N1FkeTlKNUxHZGNyUGM0TUFBQUFFNjVBZUROZ0NJRFFFKzgzbzcyUVIvSGZlbUNOV0psZGxWR3dGNTVJdmEyblJyZTJBamM4ZytrSC9WVGFTK2NEQXNORDZ4YjY5S1VIZDlMQ0VBckcrYkxhL1l5NWlWYlA5MHZiZnNhZGRkck9sSnlaVEw4QnBrdEFBQ24wd0R3RTJ6TzVUMHNpWFhIMldDV01xMWZkWU85RVhRZGk0eUFiWEhkYThoQ3d4dTVudDF6WWdnc1M2TGhadWtLMzVTa3VLN00rQjZUQUsrWGY1KzBDV1o2SE5QbDg5T3VZVU1pN1R5WEtaMXNNdWFzZi9ZQXN3VUE0SFFaQU5FSjlrVkZrcG5uQUt6M2Nhd0daVzNuR3hnQnVhcUZpWExqZlZEUnMzdEsycGplRjBOQVF4Tkw4amZlaTc2WE1zQXIwcm95aFZWNkhiZEZzZStTdFgyZE9zWndnYVZ2bVMwQUFLZkxBTkJNK1pRMDlzTGMxMVVHd0ZZUFNXYlJ5TG5MdjZveEFxcDBDMFl5UGF1MVo3ZXFES1pUczRjMjVrMFlSM3ZSdHhZQzRxMERBSUMzd1FEd3BMRm5aZXk3TG9IdHAvSUFuSzB3QXFacmxBdHZXTnZncUdmM29PbitUNWJYVmJuZDZVQWFOL1dpYnkwRnpGc0hBQUJ2Z3dFUW5laFRURDNha0gvcUhJRC9yakFDUmhyMExoZ01tdlNrT1B4QXVaR25IZ2MzTXcxNmhzdlB1eUYvYzdUNWY4a2JCQUFBZjZrR3dJaGt5eTliUEYzVjRNYWtBK0I0SDVMTWNtTzJQSVhmUm40V0FBRGc1QXlBMjlhWVJ1UHBENlFzYjdnOFRXdTN1Y2xqSnBwRlkxemM5OS94aEFBQUFFN0dBTkRXdEZIcjJ5a3BNNk1qSEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBREEyOFAvQWZZSXUwZGJwUmVFQUFBQUFFbEZUa1N1UW1DQ2A7XHJcbiAgcmV0dXJuIGltYWdlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm50KCl7XHJcbiAgcmV0dXJuIGBpbmZvIGZhY2U9XCJMdWNpZGEgU2FucyBVbmljb2RlXCIgc2l6ZT0zMiBib2xkPTAgaXRhbGljPTAgY2hhcnNldD1cIlwiIHVuaWNvZGU9MCBzdHJldGNoSD0xMDAgc21vb3RoPTEgYWE9MSBwYWRkaW5nPTQsNCw0LDQgc3BhY2luZz0tOCwtOFxyXG5jb21tb24gbGluZUhlaWdodD01MSBiYXNlPTM2IHNjYWxlVz01MTIgc2NhbGVIPTI1NiBwYWdlcz0xIHBhY2tlZD0wXHJcbnBhZ2UgaWQ9MCBmaWxlPVwibHVjaWRhc2Fuc3VuaWNvZGUucG5nXCJcclxuY2hhcnMgY291bnQ9OTdcclxuY2hhciBpZD0wICAgICAgIHg9MCAgICB5PTEwMyAgd2lkdGg9MjYgICBoZWlnaHQ9MjkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMSAgIHhhZHZhbmNlPTI0ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwICAgICAgeD0wICAgIHk9MCAgICB3aWR0aD0wICAgIGhlaWdodD0wICAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTAgICAgeGFkdmFuY2U9MCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzIgICAgICB4PTAgICAgeT0wICAgIHdpZHRoPTAgICAgaGVpZ2h0PTAgICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MCAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zMyAgICAgIHg9MzEwICB5PTcxICAgd2lkdGg9MTIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTM0ICAgICAgeD00OTMgIHk9MTAzICB3aWR0aD0xNyAgIGhlaWdodD0xNyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MTIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzUgICAgICB4PTM0MyAgeT03MSAgIHdpZHRoPTI4ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zNiAgICAgIHg9MjE0ICB5PTAgICAgd2lkdGg9MjIgICBoZWlnaHQ9MzYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTM3ICAgICAgeD0zNjIgIHk9MCAgICB3aWR0aD0zMCAgIGhlaWdodD0zNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTcgICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzggICAgICB4PTM3MSAgeT03MSAgIHdpZHRoPTI5ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zOSAgICAgIHg9MCAgICB5PTEzMiAgd2lkdGg9MTIgICBoZWlnaHQ9MTcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTcgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQwICAgICAgeD02MSAgIHk9MCAgICB3aWR0aD0xNiAgIGhlaWdodD0zOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTcgICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDEgICAgICB4PTc3ICAgeT0wICAgIHdpZHRoPTE2ICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NyAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00MiAgICAgIHg9NDYwICB5PTEwMyAgd2lkdGg9MjAgICBoZWlnaHQ9MjEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQzICAgICAgeD04MSAgIHk9MTAzICB3aWR0aD0yNyAgIGhlaWdodD0yNyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEzICAgeGFkdmFuY2U9MjUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDQgICAgICB4PTQ4MCAgeT0xMDMgIHdpZHRoPTEzICAgaGVpZ2h0PTE4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MjcgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00NSAgICAgIHg9OTMgICB5PTEzMiAgd2lkdGg9MjMgICBoZWlnaHQ9MTEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yMSAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQ2ICAgICAgeD04MCAgIHk9MTMyICB3aWR0aD0xMyAgIGhlaWdodD0xMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTI3ICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDcgICAgICB4PTE0NiAgeT0wICAgIHdpZHRoPTE4ICAgaGVpZ2h0PTM3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00OCAgICAgIHg9Mjg1ICB5PTcxICAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQ5ICAgICAgeD00MDAgIHk9NzEgICB3aWR0aD0xNiAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTAgICAgICB4PTEyMCAgeT03MSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01MSAgICAgIHg9MTQzICB5PTcxICAgd2lkdGg9MjIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTUyICAgICAgeD0xNjUgIHk9NzEgICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTMgICAgICB4PTE5MCAgeT03MSAgIHdpZHRoPTIyICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01NCAgICAgIHg9NDE2ICB5PTcxICAgd2lkdGg9MjUgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTU1ICAgICAgeD0yMTIgIHk9NzEgICB3aWR0aD0yNCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTYgICAgICB4PTIzNiAgeT03MSAgIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01NyAgICAgIHg9MjYwICB5PTcxICAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTU4ICAgICAgeD0zOTggIHk9MTAzICB3aWR0aD0xMiAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTkgICAgICB4PTQ0MSAgeT03MSAgIHdpZHRoPTEyICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02MCAgICAgIHg9MjYgICB5PTEwMyAgd2lkdGg9MjggICBoZWlnaHQ9MjcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMyAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTYxICAgICAgeD0xMiAgIHk9MTMyICB3aWR0aD0yOCAgIGhlaWdodD0xNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE4ICAgeGFkdmFuY2U9MjUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjIgICAgICB4PTU0ICAgeT0xMDMgIHdpZHRoPTI3ICAgaGVpZ2h0PTI3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTMgICB4YWR2YW5jZT0yNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02MyAgICAgIHg9MzIyICB5PTcxICAgd2lkdGg9MjEgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE0ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTY0ICAgICAgeD00NTMgIHk9NzEgICB3aWR0aD0zNCAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9MjcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjUgICAgICB4PTM5MiAgeT0wICAgIHdpZHRoPTI5ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02NiAgICAgIHg9NDIxICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTY3ICAgICAgeD00NDQgIHk9MCAgICB3aWR0aD0yOCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjggICAgICB4PTQ3MiAgeT0wICAgIHdpZHRoPTI4ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yNCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02OSAgICAgIHg9MCAgICB5PTM5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTcwICAgICAgeD0yMyAgIHk9MzkgICB3aWR0aD0yMiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzEgICAgICB4PTQ1ICAgeT0zOSAgIHdpZHRoPTI4ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03MiAgICAgIHg9NzMgICB5PTM5ICAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI0ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTczICAgICAgeD0xMDAgIHk9MzkgICB3aWR0aD0xMiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9OSAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzQgICAgICB4PTEyNSAgeT0wICAgIHdpZHRoPTIxICAgaGVpZ2h0PTM3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03NSAgICAgIHg9MTEyICB5PTM5ICAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTc2ICAgICAgeD0xMzcgIHk9MzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzcgICAgICB4PTE2MCAgeT0zOSAgIHdpZHRoPTMxICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03OCAgICAgIHg9MTkxICB5PTM5ICAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI0ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTc5ICAgICAgeD0yMTggIHk9MzkgICB3aWR0aD0zMSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODAgICAgICB4PTI0OSAgeT0zOSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04MSAgICAgIHg9MTgyICB5PTAgICAgd2lkdGg9MzIgICBoZWlnaHQ9MzYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTgyICAgICAgeD0yNzIgIHk9MzkgICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODMgICAgICB4PTI5NyAgeT0zOSAgIHdpZHRoPTIyICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04NCAgICAgIHg9MzE5ICB5PTM5ICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTg1ICAgICAgeD0zNDcgIHk9MzkgICB3aWR0aD0yNiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODYgICAgICB4PTM3MyAgeT0zOSAgIHdpZHRoPTI4ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04NyAgICAgIHg9NDAxICB5PTM5ICAgd2lkdGg9MzUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTg4ICAgICAgeD00MzYgIHk9MzkgICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODkgICAgICB4PTQ2MyAgeT0zOSAgIHdpZHRoPTI3ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05MCAgICAgIHg9MCAgICB5PTcxICAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTkxICAgICAgeD0wICAgIHk9MCAgICB3aWR0aD0xNSAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTIgICAgICB4PTE2NCAgeT0wICAgIHdpZHRoPTE4ICAgaGVpZ2h0PTM3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05MyAgICAgIHg9MTUgICB5PTAgICAgd2lkdGg9MTUgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTk0ICAgICAgeD00MzUgIHk9MTAzICB3aWR0aD0yNSAgIGhlaWdodD0yNSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTUgICAgICB4PTExNiAgeT0xMzIgIHdpZHRoPTIzICAgaGVpZ2h0PTExICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MzEgICB4YWR2YW5jZT0xNiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05NiAgICAgIHg9NDAgICB5PTEzMiAgd2lkdGg9MTUgICBoZWlnaHQ9MTQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTk3ICAgICAgeD0xMDggIHk9MTAzICB3aWR0aD0yNCAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTggICAgICB4PTIzNiAgeT0wICAgIHdpZHRoPTIzICAgaGVpZ2h0PTM0ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05OSAgICAgIHg9MTMyICB5PTEwMyAgd2lkdGg9MjIgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTE2ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwMCAgICAgeD0yNTkgIHk9MCAgICB3aWR0aD0yNCAgIGhlaWdodD0zNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTAxICAgICB4PTE1NCAgeT0xMDMgIHdpZHRoPTIzICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDIgICAgIHg9MjgzICB5PTAgICAgd2lkdGg9MjEgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTEyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwMyAgICAgeD0yNSAgIHk9NzEgICB3aWR0aD0yNCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTA0ICAgICB4PTMwNCAgeT0wICAgIHdpZHRoPTIzICAgaGVpZ2h0PTM0ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDUgICAgIHg9NDkwICB5PTM5ICAgd2lkdGg9MTIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTkgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwNiAgICAgeD00MSAgIHk9MCAgICB3aWR0aD0yMCAgIGhlaWdodD0zOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTA3ICAgICB4PTMyNyAgeT0wICAgIHdpZHRoPTIzICAgaGVpZ2h0PTM0ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NiAgICB4YWR2YW5jZT0xOSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDggICAgIHg9MzUwICB5PTAgICAgd2lkdGg9MTIgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTkgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwOSAgICAgeD0xNzcgIHk9MTAzICB3aWR0aD0zMiAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MzAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTEwICAgICB4PTIwOSAgeT0xMDMgIHdpZHRoPTIzICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTEgICAgIHg9NDEwICB5PTEwMyAgd2lkdGg9MjUgICBoZWlnaHQ9MjUgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNSAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExMiAgICAgeD00OSAgIHk9NzEgICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTEzICAgICB4PTcyICAgeT03MSAgIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTQgICAgIHg9MjMyICB5PTEwMyAgd2lkdGg9MTggICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTEzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExNSAgICAgeD0yNTAgIHk9MTAzICB3aWR0aD0yMCAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MTYgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTE2ICAgICB4PTQ4NyAgeT03MSAgIHdpZHRoPTIwICAgaGVpZ2h0PTI4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTIgICB4YWR2YW5jZT0xMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTcgICAgIHg9MjcwICB5PTEwMyAgd2lkdGg9MjMgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExOCAgICAgeD0yOTMgIHk9MTAzICB3aWR0aD0yNCAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTE5ICAgICB4PTMxNyAgeT0xMDMgIHdpZHRoPTMyICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0yNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjAgICAgIHg9MzQ5ICB5PTEwMyAgd2lkdGg9MjUgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyMSAgICAgeD05NiAgIHk9NzEgICB3aWR0aD0yNCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTIyICAgICB4PTM3NCAgeT0xMDMgIHdpZHRoPTI0ICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjMgICAgIHg9OTMgICB5PTAgICAgd2lkdGg9MTYgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyNCAgICAgeD0zMCAgIHk9MCAgICB3aWR0aD0xMSAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MTIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTI1ICAgICB4PTEwOSAgeT0wICAgIHdpZHRoPTE2ICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NyAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjYgICAgIHg9NTUgICB5PTEzMiAgd2lkdGg9MjUgICBoZWlnaHQ9MTQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yMCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5rZXJuaW5ncyBjb3VudD0wXHJcbmA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSA9IHt9ICl7XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIHBhbmVsICk7XHJcblxyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlT25SZWxlYXNlICk7XHJcblxyXG4gIGNvbnN0IHRlbXBNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xyXG5cclxuICBsZXQgb2xkUGFyZW50O1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XHJcblxyXG4gICAgY29uc3QgeyBpbnB1dE9iamVjdCwgaW5wdXQgfSA9IHA7XHJcblxyXG4gICAgY29uc3QgZm9sZGVyID0gZ3JvdXAuZm9sZGVyO1xyXG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggZm9sZGVyLmJlaW5nTW92ZWQgPT09IHRydWUgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRlbXBNYXRyaXguZ2V0SW52ZXJzZSggaW5wdXRPYmplY3QubWF0cml4V29ybGQgKTtcclxuXHJcbiAgICBmb2xkZXIubWF0cml4LnByZW11bHRpcGx5KCB0ZW1wTWF0cml4ICk7XHJcbiAgICBmb2xkZXIubWF0cml4LmRlY29tcG9zZSggZm9sZGVyLnBvc2l0aW9uLCBmb2xkZXIucXVhdGVybmlvbiwgZm9sZGVyLnNjYWxlICk7XHJcblxyXG4gICAgb2xkUGFyZW50ID0gZm9sZGVyLnBhcmVudDtcclxuICAgIGlucHV0T2JqZWN0LmFkZCggZm9sZGVyICk7XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG5cclxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gdHJ1ZTtcclxuXHJcbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ2dyYWJiZWQnLCBpbnB1dCApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25SZWxlYXNlKCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9PXt9ICl7XHJcbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBvbGRQYXJlbnQgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZm9sZGVyLm1hdHJpeC5wcmVtdWx0aXBseSggaW5wdXRPYmplY3QubWF0cml4V29ybGQgKTtcclxuICAgIGZvbGRlci5tYXRyaXguZGVjb21wb3NlKCBmb2xkZXIucG9zaXRpb24sIGZvbGRlci5xdWF0ZXJuaW9uLCBmb2xkZXIuc2NhbGUgKTtcclxuICAgIG9sZFBhcmVudC5hZGQoIGZvbGRlciApO1xyXG4gICAgb2xkUGFyZW50ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gZmFsc2U7XHJcblxyXG4gICAgaW5wdXQuZXZlbnRzLmVtaXQoICdncmFiUmVsZWFzZWQnLCBpbnB1dCApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGludGVyYWN0aW9uO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XHJcbmltcG9ydCBjcmVhdGVTbGlkZXIgZnJvbSAnLi9zbGlkZXInO1xyXG5pbXBvcnQgY3JlYXRlQ2hlY2tib3ggZnJvbSAnLi9jaGVja2JveCc7XHJcbmltcG9ydCBjcmVhdGVCdXR0b24gZnJvbSAnLi9idXR0b24nO1xyXG5pbXBvcnQgY3JlYXRlRm9sZGVyIGZyb20gJy4vZm9sZGVyJztcclxuaW1wb3J0IGNyZWF0ZURyb3Bkb3duIGZyb20gJy4vZHJvcGRvd24nO1xyXG5pbXBvcnQgKiBhcyBTREZUZXh0IGZyb20gJy4vc2RmdGV4dCc7XHJcbmltcG9ydCAqIGFzIEZvbnQgZnJvbSAnLi9mb250JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERBVEdVSVZSKCl7XHJcblxyXG4gIC8qXHJcbiAgICBTREYgZm9udFxyXG4gICovXHJcbiAgY29uc3QgdGV4dENyZWF0b3IgPSBTREZUZXh0LmNyZWF0b3IoKTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICBMaXN0cy5cclxuICAgIElucHV0T2JqZWN0cyBhcmUgdGhpbmdzIGxpa2UgVklWRSBjb250cm9sbGVycywgY2FyZGJvYXJkIGhlYWRzZXRzLCBldGMuXHJcbiAgICBDb250cm9sbGVycyBhcmUgdGhlIERBVCBHVUkgc2xpZGVycywgY2hlY2tib3hlcywgZXRjLlxyXG4gICAgSGl0c2Nhbk9iamVjdHMgYXJlIGFueXRoaW5nIHJheWNhc3RzIHdpbGwgaGl0LXRlc3QgYWdhaW5zdC5cclxuICAqL1xyXG4gIGNvbnN0IGlucHV0T2JqZWN0cyA9IFtdO1xyXG4gIGNvbnN0IGNvbnRyb2xsZXJzID0gW107XHJcbiAgY29uc3QgaGl0c2Nhbk9iamVjdHMgPSBbXTtcclxuXHJcbiAgbGV0IG1vdXNlRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICBmdW5jdGlvbiBzZXRNb3VzZUVuYWJsZWQoIGZsYWcgKXtcclxuICAgIG1vdXNlRW5hYmxlZCA9IGZsYWc7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgVGhlIGRlZmF1bHQgbGFzZXIgcG9pbnRlciBjb21pbmcgb3V0IG9mIGVhY2ggSW5wdXRPYmplY3QuXHJcbiAgKi9cclxuICBjb25zdCBsYXNlck1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtjb2xvcjoweDU1YWFmZiwgdHJhbnNwYXJlbnQ6IHRydWUsIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nIH0pO1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUxhc2VyKCl7XHJcbiAgICBjb25zdCBnID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcbiAgICBnLnZlcnRpY2VzLnB1c2goIG5ldyBUSFJFRS5WZWN0b3IzKCkgKTtcclxuICAgIGcudmVydGljZXMucHVzaCggbmV3IFRIUkVFLlZlY3RvcjMoMCwwLDApICk7XHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLkxpbmUoIGcsIGxhc2VyTWF0ZXJpYWwgKTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgQSBcImN1cnNvclwiLCBlZyB0aGUgYmFsbCB0aGF0IGFwcGVhcnMgYXQgdGhlIGVuZCBvZiB5b3VyIGxhc2VyLlxyXG4gICovXHJcbiAgY29uc3QgY3Vyc29yTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4NDQ0NDQ0LCB0cmFuc3BhcmVudDogdHJ1ZSwgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcgfSApO1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUN1cnNvcigpe1xyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMC4wMDYsIDQsIDQgKSwgY3Vyc29yTWF0ZXJpYWwgKTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBDcmVhdGVzIGEgZ2VuZXJpYyBJbnB1dCB0eXBlLlxyXG4gICAgVGFrZXMgYW55IFRIUkVFLk9iamVjdDNEIHR5cGUgb2JqZWN0IGFuZCB1c2VzIGl0cyBwb3NpdGlvblxyXG4gICAgYW5kIG9yaWVudGF0aW9uIGFzIGFuIGlucHV0IGRldmljZS5cclxuXHJcbiAgICBBIGxhc2VyIHBvaW50ZXIgaXMgaW5jbHVkZWQgYW5kIHdpbGwgYmUgdXBkYXRlZC5cclxuICAgIENvbnRhaW5zIHN0YXRlIGFib3V0IHdoaWNoIEludGVyYWN0aW9uIGlzIGN1cnJlbnRseSBiZWluZyB1c2VkIG9yIGhvdmVyLlxyXG4gICovXHJcbiAgZnVuY3Rpb24gY3JlYXRlSW5wdXQoIGlucHV0T2JqZWN0ID0gbmV3IFRIUkVFLkdyb3VwKCkgKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJheWNhc3Q6IG5ldyBUSFJFRS5SYXljYXN0ZXIoIG5ldyBUSFJFRS5WZWN0b3IzKCksIG5ldyBUSFJFRS5WZWN0b3IzKCkgKSxcclxuICAgICAgbGFzZXI6IGNyZWF0ZUxhc2VyKCksXHJcbiAgICAgIGN1cnNvcjogY3JlYXRlQ3Vyc29yKCksXHJcbiAgICAgIG9iamVjdDogaW5wdXRPYmplY3QsXHJcbiAgICAgIHByZXNzZWQ6IGZhbHNlLFxyXG4gICAgICBncmlwcGVkOiBmYWxzZSxcclxuICAgICAgZXZlbnRzOiBuZXcgRW1pdHRlcigpLFxyXG4gICAgICBpbnRlcmFjdGlvbjoge1xyXG4gICAgICAgIGdyaXA6IHVuZGVmaW5lZCxcclxuICAgICAgICBwcmVzczogdW5kZWZpbmVkXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIE1vdXNlSW5wdXQgaXMgYSBzcGVjaWFsIGlucHV0IHR5cGUgdGhhdCBpcyBvbiBieSBkZWZhdWx0LlxyXG4gICAgQWxsb3dzIHlvdSB0byBjbGljayBvbiB0aGUgc2NyZWVuIHdoZW4gbm90IGluIFZSIGZvciBkZWJ1Z2dpbmcuXHJcbiAgKi9cclxuICBjb25zdCBtb3VzZUlucHV0ID0gY3JlYXRlTW91c2VJbnB1dCgpO1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVNb3VzZUlucHV0KCl7XHJcbiAgICBjb25zdCBtb3VzZSA9IG5ldyBUSFJFRS5WZWN0b3IyKC0xLC0xKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIGZ1bmN0aW9uKCBldmVudCApe1xyXG4gICAgICBtb3VzZS54ID0gKCBldmVudC5jbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGggKSAqIDIgLSAxO1xyXG4gICAgICBtb3VzZS55ID0gLSAoIGV2ZW50LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQgKSAqIDIgKyAxO1xyXG4gICAgfSwgZmFsc2UgKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGZ1bmN0aW9uKCBldmVudCApe1xyXG4gICAgICBpbnB1dC5wcmVzc2VkID0gdHJ1ZTtcclxuICAgIH0sIGZhbHNlICk7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgZnVuY3Rpb24oIGV2ZW50ICl7XHJcbiAgICAgIGlucHV0LnByZXNzZWQgPSBmYWxzZTtcclxuICAgIH0sIGZhbHNlICk7XHJcblxyXG4gICAgY29uc3QgaW5wdXQgPSBjcmVhdGVJbnB1dCgpO1xyXG4gICAgaW5wdXQubW91c2UgPSBtb3VzZTtcclxuICAgIHJldHVybiBpbnB1dDtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgUHVibGljIGZ1bmN0aW9uIHVzZXJzIHJ1biB0byBnaXZlIERBVCBHVUkgYW4gaW5wdXQgZGV2aWNlLlxyXG4gICAgQXV0b21hdGljYWxseSBkZXRlY3RzIGZvciBWaXZlQ29udHJvbGxlciBhbmQgYmluZHMgYnV0dG9ucyArIGhhcHRpYyBmZWVkYmFjay5cclxuXHJcbiAgICBSZXR1cm5zIGEgbGFzZXIgcG9pbnRlciBzbyBpdCBjYW4gYmUgZGlyZWN0bHkgYWRkZWQgdG8gc2NlbmUuXHJcblxyXG4gICAgVGhlIGxhc2VyIHdpbGwgdGhlbiBoYXZlIHR3byBtZXRob2RzOlxyXG4gICAgbGFzZXIucHJlc3NlZCgpLCBsYXNlci5ncmlwcGVkKClcclxuXHJcbiAgICBUaGVzZSBjYW4gdGhlbiBiZSBib3VuZCB0byBhbnkgYnV0dG9uIHRoZSB1c2VyIHdhbnRzLiBVc2VmdWwgZm9yIGJpbmRpbmcgdG9cclxuICAgIGNhcmRib2FyZCBvciBhbHRlcm5hdGUgaW5wdXQgZGV2aWNlcy5cclxuXHJcbiAgICBGb3IgZXhhbXBsZS4uLlxyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgZnVuY3Rpb24oKXsgbGFzZXIucHJlc3NlZCggdHJ1ZSApOyB9ICk7XHJcbiAgKi9cclxuICBmdW5jdGlvbiBhZGRJbnB1dE9iamVjdCggb2JqZWN0ICl7XHJcbiAgICBjb25zdCBpbnB1dCA9IGNyZWF0ZUlucHV0KCBvYmplY3QgKTtcclxuXHJcbiAgICBpbnB1dC5sYXNlci5hZGQoIGlucHV0LmN1cnNvciApO1xyXG5cclxuICAgIGlucHV0Lmxhc2VyLnByZXNzZWQgPSBmdW5jdGlvbiggZmxhZyApe1xyXG4gICAgICBpbnB1dC5wcmVzc2VkID0gZmxhZztcclxuICAgIH07XHJcblxyXG4gICAgaW5wdXQubGFzZXIuZ3JpcHBlZCA9IGZ1bmN0aW9uKCBmbGFnICl7XHJcbiAgICAgIGlucHV0LmdyaXBwZWQgPSBmbGFnO1xyXG4gICAgfTtcclxuXHJcbiAgICBpbnB1dC5sYXNlci5jdXJzb3IgPSBpbnB1dC5jdXJzb3I7XHJcblxyXG4gICAgaWYoIFRIUkVFLlZpdmVDb250cm9sbGVyICYmIG9iamVjdCBpbnN0YW5jZW9mIFRIUkVFLlZpdmVDb250cm9sbGVyICl7XHJcbiAgICAgIGJpbmRWaXZlQ29udHJvbGxlciggaW5wdXQsIG9iamVjdCwgaW5wdXQubGFzZXIucHJlc3NlZCwgaW5wdXQubGFzZXIuZ3JpcHBlZCApO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0T2JqZWN0cy5wdXNoKCBpbnB1dCApO1xyXG5cclxuICAgIHJldHVybiBpbnB1dC5sYXNlcjtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBIZXJlIGFyZSB0aGUgbWFpbiBkYXQgZ3VpIGNvbnRyb2xsZXIgdHlwZXMuXHJcbiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gYWRkU2xpZGVyKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgbWluID0gMC4wLCBtYXggPSAxMDAuMCApe1xyXG4gICAgY29uc3Qgc2xpZGVyID0gY3JlYXRlU2xpZGVyKCB7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCwgbWluLCBtYXgsXHJcbiAgICAgIGluaXRpYWxWYWx1ZTogb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggc2xpZGVyICk7XHJcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5zbGlkZXIuaGl0c2NhbiApXHJcblxyXG4gICAgcmV0dXJuIHNsaWRlcjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZENoZWNrYm94KCBvYmplY3QsIHByb3BlcnR5TmFtZSApe1xyXG4gICAgY29uc3QgY2hlY2tib3ggPSBjcmVhdGVDaGVja2JveCh7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCxcclxuICAgICAgaW5pdGlhbFZhbHVlOiBvYmplY3RbIHByb3BlcnR5TmFtZSBdXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBjaGVja2JveCApO1xyXG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uY2hlY2tib3guaGl0c2NhbiApXHJcblxyXG4gICAgcmV0dXJuIGNoZWNrYm94O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkQnV0dG9uKCBvYmplY3QsIHByb3BlcnR5TmFtZSApe1xyXG4gICAgY29uc3QgYnV0dG9uID0gY3JlYXRlQnV0dG9uKHtcclxuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBidXR0b24gKTtcclxuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmJ1dHRvbi5oaXRzY2FuICk7XHJcbiAgICByZXR1cm4gYnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkRHJvcGRvd24oIG9iamVjdCwgcHJvcGVydHlOYW1lLCBvcHRpb25zICl7XHJcbiAgICBjb25zdCBkcm9wZG93biA9IGNyZWF0ZURyb3Bkb3duKHtcclxuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LCBvcHRpb25zXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBkcm9wZG93biApO1xyXG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uZHJvcGRvd24uaGl0c2NhbiApO1xyXG4gICAgcmV0dXJuIGRyb3Bkb3duO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBBbiBpbXBsaWNpdCBBZGQgZnVuY3Rpb24gd2hpY2ggZGV0ZWN0cyBmb3IgcHJvcGVydHkgdHlwZVxyXG4gICAgYW5kIGdpdmVzIHlvdSB0aGUgY29ycmVjdCBjb250cm9sbGVyLlxyXG5cclxuICAgIERyb3Bkb3duOlxyXG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBvYmplY3RUeXBlIClcclxuXHJcbiAgICBTbGlkZXI6XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU9mTnVtYmVyVHlwZSwgbWluLCBtYXggKVxyXG5cclxuICAgIENoZWNrYm94OlxyXG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlPZkJvb2xlYW5UeXBlIClcclxuXHJcbiAgICBCdXR0b246XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU9mRnVuY3Rpb25UeXBlIClcclxuICAqL1xyXG5cclxuICBmdW5jdGlvbiBhZGQoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBhcmczLCBhcmc0ICl7XHJcblxyXG4gICAgaWYoIG9iamVjdCA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIGNvbnNvbGUud2FybiggJ29iamVjdCBpcyB1bmRlZmluZWQnICk7XHJcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIGlmKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgY29uc29sZS53YXJuKCAnbm8gcHJvcGVydHkgbmFtZWQnLCBwcm9wZXJ0eU5hbWUsICdvbiBvYmplY3QnLCBvYmplY3QgKTtcclxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc09iamVjdCggYXJnMyApIHx8IGlzQXJyYXkoIGFyZzMgKSApe1xyXG4gICAgICByZXR1cm4gYWRkRHJvcGRvd24oIG9iamVjdCwgcHJvcGVydHlOYW1lLCBhcmczICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlzTnVtYmVyKCBvYmplY3RbIHByb3BlcnR5TmFtZV0gKSApe1xyXG4gICAgICByZXR1cm4gYWRkU2xpZGVyKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMywgYXJnNCApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc0Jvb2xlYW4oIG9iamVjdFsgcHJvcGVydHlOYW1lXSApICl7XHJcbiAgICAgIHJldHVybiBhZGRDaGVja2JveCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaXNGdW5jdGlvbiggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSApICl7XHJcbiAgICAgIHJldHVybiBhZGRCdXR0b24oIG9iamVjdCwgcHJvcGVydHlOYW1lICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gIGFkZCBjb3VsZG4ndCBmaWd1cmUgaXQgb3V0LCBzbyBhdCBsZWFzdCBhZGQgc29tZXRoaW5nIFRIUkVFIHVuZGVyc3RhbmRzXHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgQ3JlYXRlcyBhIGZvbGRlciB3aXRoIHRoZSBuYW1lLlxyXG5cclxuICAgIEZvbGRlcnMgYXJlIFRIUkVFLkdyb3VwIHR5cGUgb2JqZWN0cyBhbmQgY2FuIGRvIGdyb3VwLmFkZCgpIGZvciBzaWJsaW5ncy5cclxuICAgIEZvbGRlcnMgd2lsbCBhdXRvbWF0aWNhbGx5IGF0dGVtcHQgdG8gbGF5IGl0cyBjaGlsZHJlbiBvdXQgaW4gc2VxdWVuY2UuXHJcbiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gYWRkRm9sZGVyKCBuYW1lICl7XHJcbiAgICBjb25zdCBmb2xkZXIgPSBjcmVhdGVGb2xkZXIoe1xyXG4gICAgICB0ZXh0Q3JlYXRvcixcclxuICAgICAgbmFtZVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggZm9sZGVyICk7XHJcbiAgICBpZiggZm9sZGVyLmhpdHNjYW4gKXtcclxuICAgICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uZm9sZGVyLmhpdHNjYW4gKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZm9sZGVyO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBQZXJmb3JtIHRoZSBuZWNlc3NhcnkgdXBkYXRlcywgcmF5Y2FzdHMgb24gaXRzIG93biBSQUYuXHJcbiAgKi9cclxuXHJcbiAgY29uc3QgdFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICBjb25zdCB0RGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoIDAsIDAsIC0xICk7XHJcbiAgY29uc3QgdE1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSggdXBkYXRlICk7XHJcblxyXG4gICAgaWYoIG1vdXNlRW5hYmxlZCApe1xyXG4gICAgICBtb3VzZUlucHV0LmludGVyc2VjdGlvbnMgPSBwZXJmb3JtTW91c2VJbnB1dCggaGl0c2Nhbk9iamVjdHMsIG1vdXNlSW5wdXQgKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnB1dE9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24oIHtib3gsb2JqZWN0LHJheWNhc3QsbGFzZXIsY3Vyc29yfSA9IHt9LCBpbmRleCApe1xyXG4gICAgICBvYmplY3QudXBkYXRlTWF0cml4V29ybGQoKTtcclxuXHJcbiAgICAgIHRQb3NpdGlvbi5zZXQoMCwwLDApLnNldEZyb21NYXRyaXhQb3NpdGlvbiggb2JqZWN0Lm1hdHJpeFdvcmxkICk7XHJcbiAgICAgIHRNYXRyaXguaWRlbnRpdHkoKS5leHRyYWN0Um90YXRpb24oIG9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG4gICAgICB0RGlyZWN0aW9uLnNldCgwLDAsLTEpLmFwcGx5TWF0cml4NCggdE1hdHJpeCApLm5vcm1hbGl6ZSgpO1xyXG5cclxuICAgICAgcmF5Y2FzdC5zZXQoIHRQb3NpdGlvbiwgdERpcmVjdGlvbiApO1xyXG5cclxuICAgICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDAgXS5jb3B5KCB0UG9zaXRpb24gKTtcclxuXHJcbiAgICAgIC8vICBkZWJ1Zy4uLlxyXG4gICAgICAvLyBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc1sgMSBdLmNvcHkoIHRQb3NpdGlvbiApLmFkZCggdERpcmVjdGlvbi5tdWx0aXBseVNjYWxhciggMSApICk7XHJcblxyXG4gICAgICBjb25zdCBpbnRlcnNlY3Rpb25zID0gcmF5Y2FzdC5pbnRlcnNlY3RPYmplY3RzKCBoaXRzY2FuT2JqZWN0cywgZmFsc2UgKTtcclxuICAgICAgcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICk7XHJcblxyXG4gICAgICBpbnB1dE9iamVjdHNbIGluZGV4IF0uaW50ZXJzZWN0aW9ucyA9IGludGVyc2VjdGlvbnM7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBpbnB1dHMgPSBpbnB1dE9iamVjdHMuc2xpY2UoKTtcclxuXHJcbiAgICBpZiggbW91c2VFbmFibGVkICl7XHJcbiAgICAgIGlucHV0cy5wdXNoKCBtb3VzZUlucHV0ICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaCggZnVuY3Rpb24oIGNvbnRyb2xsZXIgKXtcclxuICAgICAgY29udHJvbGxlci51cGRhdGUoIGlucHV0cyApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZUludGVyc2VjdGlvbnMoIGludGVyc2VjdGlvbnMsIGxhc2VyLCBjdXJzb3IgKXtcclxuICAgIGlmKCBpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDAgKXtcclxuICAgICAgY29uc3QgZmlyc3RIaXQgPSBpbnRlcnNlY3Rpb25zWyAwIF07XHJcbiAgICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzWyAxIF0uY29weSggZmlyc3RIaXQucG9pbnQgKTtcclxuICAgICAgbGFzZXIudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIGxhc2VyLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpO1xyXG4gICAgICBsYXNlci5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZTtcclxuICAgICAgY3Vyc29yLnBvc2l0aW9uLmNvcHkoIGZpcnN0SGl0LnBvaW50ICk7XHJcbiAgICAgIGN1cnNvci52aXNpYmxlID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGxhc2VyLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgY3Vyc29yLnZpc2libGUgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBlcmZvcm1Nb3VzZUlucHV0KCBoaXRzY2FuT2JqZWN0cywge2JveCxvYmplY3QscmF5Y2FzdCxsYXNlcixjdXJzb3IsbW91c2V9ID0ge30gKXtcclxuICAgIHJheWNhc3Quc2V0RnJvbUNhbWVyYSggbW91c2UsIGNhbWVyYSApO1xyXG4gICAgY29uc3QgaW50ZXJzZWN0aW9ucyA9IHJheWNhc3QuaW50ZXJzZWN0T2JqZWN0cyggaGl0c2Nhbk9iamVjdHMsIGZhbHNlICk7XHJcbiAgICBwYXJzZUludGVyc2VjdGlvbnMoIGludGVyc2VjdGlvbnMsIGxhc2VyLCBjdXJzb3IgKTtcclxuICAgIHJldHVybiBpbnRlcnNlY3Rpb25zO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgUHVibGljIG1ldGhvZHMuXHJcbiAgKi9cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGFkZElucHV0T2JqZWN0LFxyXG4gICAgYWRkLFxyXG4gICAgYWRkRm9sZGVyLFxyXG4gICAgc2V0TW91c2VFbmFibGVkXHJcbiAgfTtcclxuXHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuICBTZXQgdG8gZ2xvYmFsIHNjb3BlIGlmIGV4cG9ydGluZyBhcyBhIHN0YW5kYWxvbmUuXHJcbiovXHJcblxyXG5pZiggd2luZG93ICl7XHJcbiAgd2luZG93LkRBVEdVSVZSID0gREFUR1VJVlI7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAgQnVuY2ggb2Ygc3RhdGUtbGVzcyB1dGlsaXR5IGZ1bmN0aW9ucy5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGlzTnVtYmVyKG4pIHtcclxuICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0Jvb2xlYW4obil7XHJcbiAgcmV0dXJuIHR5cGVvZiBuID09PSAnYm9vbGVhbic7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZnVuY3Rpb25Ub0NoZWNrKSB7XHJcbiAgY29uc3QgZ2V0VHlwZSA9IHt9O1xyXG4gIHJldHVybiBmdW5jdGlvblRvQ2hlY2sgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKGZ1bmN0aW9uVG9DaGVjaykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbn1cclxuXHJcbi8vICBvbmx5IHt9IG9iamVjdHMgbm90IGFycmF5c1xyXG4vLyAgICAgICAgICAgICAgICAgICAgd2hpY2ggYXJlIHRlY2huaWNhbGx5IG9iamVjdHMgYnV0IHlvdSdyZSBqdXN0IGJlaW5nIHBlZGFudGljXHJcbmZ1bmN0aW9uIGlzT2JqZWN0IChpdGVtKSB7XHJcbiAgcmV0dXJuICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbSAhPT0gbnVsbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQXJyYXkoIG8gKXtcclxuICByZXR1cm4gQXJyYXkuaXNBcnJheSggbyApO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gIENvbnRyb2xsZXItc3BlY2lmaWMgc3VwcG9ydC5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGJpbmRWaXZlQ29udHJvbGxlciggaW5wdXQsIGNvbnRyb2xsZXIsIHByZXNzZWQsIGdyaXBwZWQgKXtcclxuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmlnZ2VyZG93bicsICgpPT5wcmVzc2VkKCB0cnVlICkgKTtcclxuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmlnZ2VydXAnLCAoKT0+cHJlc3NlZCggZmFsc2UgKSApO1xyXG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ2dyaXBzZG93bicsICgpPT5ncmlwcGVkKCB0cnVlICkgKTtcclxuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICdncmlwc3VwJywgKCk9PmdyaXBwZWQoIGZhbHNlICkgKTtcclxuXHJcbiAgY29uc3QgZ2FtZXBhZCA9IGNvbnRyb2xsZXIuZ2V0R2FtZXBhZCgpO1xyXG4gIGZ1bmN0aW9uIHZpYnJhdGUoIHQsIGEgKXtcclxuICAgIGlmKCBnYW1lcGFkICYmIGdhbWVwYWQuaGFwdGljcy5sZW5ndGggPiAwICl7XHJcbiAgICAgIGdhbWVwYWQuaGFwdGljc1sgMCBdLnZpYnJhdGUoIHQsIGEgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhcHRpY3NUYXAoKXtcclxuICAgIHNldEludGVydmFsVGltZXMoICh4LHQsYSk9PnZpYnJhdGUoMS1hLCAwLjUpLCAxMCwgMjAgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhcHRpY3NFY2hvKCl7XHJcbiAgICBzZXRJbnRlcnZhbFRpbWVzKCAoeCx0LGEpPT52aWJyYXRlKDQsIDEuMCAqICgxLWEpKSwgMTAwLCA0ICk7XHJcbiAgfVxyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdvbkNvbnRyb2xsZXJIZWxkJywgZnVuY3Rpb24oIGlucHV0ICl7XHJcbiAgICB2aWJyYXRlKCAwLjMsIDAuMyApO1xyXG4gIH0pO1xyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdncmFiYmVkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NUYXAoKTtcclxuICB9KTtcclxuXHJcbiAgaW5wdXQuZXZlbnRzLm9uKCAnZ3JhYlJlbGVhc2VkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NFY2hvKCk7XHJcbiAgfSk7XHJcblxyXG4gIGlucHV0LmV2ZW50cy5vbiggJ3Bpbm5lZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBoYXB0aWNzVGFwKCk7XHJcbiAgfSk7XHJcblxyXG4gIGlucHV0LmV2ZW50cy5vbiggJ3BpblJlbGVhc2VkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NFY2hvKCk7XHJcbiAgfSk7XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldEludGVydmFsVGltZXMoIGNiLCBkZWxheSwgdGltZXMgKXtcclxuICBsZXQgeCA9IDA7XHJcbiAgbGV0IGlkID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCl7XHJcbiAgICBjYiggeCwgdGltZXMsIHgvdGltZXMgKTtcclxuICAgIHgrKztcclxuICAgIGlmKCB4Pj10aW1lcyApe1xyXG4gICAgICBjbGVhckludGVydmFsKCBpZCApO1xyXG4gICAgfVxyXG4gIH0sIGRlbGF5ICk7XHJcbiAgcmV0dXJuIGlkO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUludGVyYWN0aW9uKCBoaXRWb2x1bWUgKXtcclxuICBjb25zdCBldmVudHMgPSBuZXcgRW1pdHRlcigpO1xyXG5cclxuICBsZXQgYW55SG92ZXIgPSBmYWxzZTtcclxuICBsZXQgYW55UHJlc3NpbmcgPSBmYWxzZTtcclxuXHJcbiAgbGV0IGhvdmVyID0gZmFsc2U7XHJcbiAgbGV0IGFueUFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdCB0VmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlKCBpbnB1dE9iamVjdHMgKXtcclxuXHJcbiAgICBob3ZlciA9IGZhbHNlO1xyXG4gICAgYW55UHJlc3NpbmcgPSBmYWxzZTtcclxuICAgIGFueUFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgIGlucHV0T2JqZWN0cy5mb3JFYWNoKCBmdW5jdGlvbiggaW5wdXQgKXtcclxuXHJcbiAgICAgIGNvbnN0IHsgaGl0T2JqZWN0LCBoaXRQb2ludCB9ID0gZXh0cmFjdEhpdCggaW5wdXQgKTtcclxuXHJcbiAgICAgIGhvdmVyID0gaG92ZXIgfHwgaGl0Vm9sdW1lID09PSBoaXRPYmplY3Q7XHJcblxyXG4gICAgICBwZXJmb3JtU3RhdGVFdmVudHMoe1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhvdmVyLFxyXG4gICAgICAgIGhpdE9iamVjdCwgaGl0UG9pbnQsXHJcbiAgICAgICAgYnV0dG9uTmFtZTogJ3ByZXNzZWQnLFxyXG4gICAgICAgIGludGVyYWN0aW9uTmFtZTogJ3ByZXNzJyxcclxuICAgICAgICBkb3duTmFtZTogJ29uUHJlc3NlZCcsXHJcbiAgICAgICAgaG9sZE5hbWU6ICdwcmVzc2luZycsXHJcbiAgICAgICAgdXBOYW1lOiAnb25SZWxlYXNlZCdcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBwZXJmb3JtU3RhdGVFdmVudHMoe1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhvdmVyLFxyXG4gICAgICAgIGhpdE9iamVjdCwgaGl0UG9pbnQsXHJcbiAgICAgICAgYnV0dG9uTmFtZTogJ2dyaXBwZWQnLFxyXG4gICAgICAgIGludGVyYWN0aW9uTmFtZTogJ2dyaXAnLFxyXG4gICAgICAgIGRvd25OYW1lOiAnb25HcmlwcGVkJyxcclxuICAgICAgICBob2xkTmFtZTogJ2dyaXBwaW5nJyxcclxuICAgICAgICB1cE5hbWU6ICdvblJlbGVhc2VHcmlwJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBleHRyYWN0SGl0KCBpbnB1dCApe1xyXG4gICAgaWYoIGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoIDw9IDAgKXtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBoaXRQb2ludDogdFZlY3Rvci5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGlucHV0LmN1cnNvci5tYXRyaXhXb3JsZCApLmNsb25lKCksXHJcbiAgICAgICAgaGl0T2JqZWN0OiBpbnB1dC5jdXJzb3IsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGhpdFBvaW50OiBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ucG9pbnQsXHJcbiAgICAgICAgaGl0T2JqZWN0OiBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ub2JqZWN0XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwZXJmb3JtU3RhdGVFdmVudHMoe1xyXG4gICAgaW5wdXQsIGhvdmVyLFxyXG4gICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcclxuICAgIGJ1dHRvbk5hbWUsIGludGVyYWN0aW9uTmFtZSwgZG93bk5hbWUsIGhvbGROYW1lLCB1cE5hbWVcclxuICB9ID0ge30gKXtcclxuXHJcblxyXG4gICAgLy8gIGhvdmVyaW5nIGFuZCBidXR0b24gZG93biBidXQgbm8gaW50ZXJhY3Rpb25zIGFjdGl2ZSB5ZXRcclxuICAgIGlmKCBob3ZlciAmJiBpbnB1dFsgYnV0dG9uTmFtZSBdID09PSB0cnVlICYmIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9PT0gdW5kZWZpbmVkICl7XHJcblxyXG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdCxcclxuICAgICAgICBsb2NrZWQ6IGZhbHNlXHJcbiAgICAgIH07XHJcbiAgICAgIGV2ZW50cy5lbWl0KCBkb3duTmFtZSwgcGF5bG9hZCApO1xyXG5cclxuICAgICAgaWYoIHBheWxvYWQubG9ja2VkICl7XHJcbiAgICAgICAgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID0gaW50ZXJhY3Rpb247XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGFueVByZXNzaW5nID0gdHJ1ZTtcclxuICAgICAgYW55QWN0aXZlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgYnV0dG9uIHN0aWxsIGRvd24gYW5kIHRoaXMgaXMgdGhlIGFjdGl2ZSBpbnRlcmFjdGlvblxyXG4gICAgaWYoIGlucHV0WyBidXR0b25OYW1lIF0gJiYgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID09PSBpbnRlcmFjdGlvbiApe1xyXG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdCxcclxuICAgICAgICBsb2NrZWQ6IGZhbHNlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBldmVudHMuZW1pdCggaG9sZE5hbWUsIHBheWxvYWQgKTtcclxuXHJcbiAgICAgIGFueVByZXNzaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgIGlucHV0LmV2ZW50cy5lbWl0KCAnb25Db250cm9sbGVySGVsZCcgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgYnV0dG9uIG5vdCBkb3duIGFuZCB0aGlzIGlzIHRoZSBhY3RpdmUgaW50ZXJhY3Rpb25cclxuICAgIGlmKCBpbnB1dFsgYnV0dG9uTmFtZSBdID09PSBmYWxzZSAmJiBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPT09IGludGVyYWN0aW9uICl7XHJcbiAgICAgIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9IHVuZGVmaW5lZDtcclxuICAgICAgZXZlbnRzLmVtaXQoIHVwTmFtZSwge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSB7XHJcbiAgICBob3ZlcmluZzogKCk9PmhvdmVyLFxyXG4gICAgcHJlc3Npbmc6ICgpPT5hbnlQcmVzc2luZyxcclxuICAgIHVwZGF0ZSxcclxuICAgIGV2ZW50c1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBpbnRlcmFjdGlvbjtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFsaWduTGVmdCggb2JqICl7XHJcbiAgaWYoIG9iaiBpbnN0YW5jZW9mIFRIUkVFLk1lc2ggKXtcclxuICAgIG9iai5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgIGNvbnN0IHdpZHRoID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC54IC0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC55O1xyXG4gICAgb2JqLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGgsIDAsIDAgKTtcclxuICAgIHJldHVybiBvYmo7XHJcbiAgfVxyXG4gIGVsc2UgaWYoIG9iaiBpbnN0YW5jZW9mIFRIUkVFLkdlb21ldHJ5ICl7XHJcbiAgICBvYmouY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICBjb25zdCB3aWR0aCA9IG9iai5ib3VuZGluZ0JveC5tYXgueCAtIG9iai5ib3VuZGluZ0JveC5tYXgueTtcclxuICAgIG9iai50cmFuc2xhdGUoIHdpZHRoLCAwLCAwICk7XHJcbiAgICByZXR1cm4gb2JqO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApe1xyXG4gIGNvbnN0IHBhbmVsID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggd2lkdGgsIGhlaWdodCwgZGVwdGggKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCAqIDAuNSwgMCwgMCApO1xyXG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBwYW5lbC5nZW9tZXRyeSwgQ29sb3JzLkRFRkFVTFRfQkFDSyApO1xyXG4gIHJldHVybiBwYW5lbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBjb2xvciApe1xyXG4gIGNvbnN0IHBhbmVsID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQ09OVFJPTExFUl9JRF9XSURUSCwgaGVpZ2h0LCBDT05UUk9MTEVSX0lEX0RFUFRIICksIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xyXG4gIHBhbmVsLmdlb21ldHJ5LnRyYW5zbGF0ZSggQ09OVFJPTExFUl9JRF9XSURUSCAqIDAuNSwgMCwgMCApO1xyXG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBwYW5lbC5nZW9tZXRyeSwgY29sb3IgKTtcclxuICByZXR1cm4gcGFuZWw7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBQQU5FTF9XSURUSCA9IDEuMDtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX0hFSUdIVCA9IDAuMDc7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9ERVBUSCA9IDAuMDE7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9TUEFDSU5HID0gMC4wMDI7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9NQVJHSU4gPSAwLjAwNTtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOID0gMC4wNjtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX1ZBTFVFX1RFWFRfTUFSR0lOID0gMC4wMjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfV0lEVEggPSAwLjAyO1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9ERVBUSCA9IDAuMDA1OyIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ID0ge30gKXtcclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggcGFuZWwgKTtcclxuXHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25HcmlwcGVkJywgaGFuZGxlT25HcmlwICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlR3JpcCcsIGhhbmRsZU9uR3JpcFJlbGVhc2UgKTtcclxuXHJcbiAgbGV0IG9sZFBhcmVudDtcclxuICBsZXQgb2xkUG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gIGxldCBvbGRSb3RhdGlvbiA9IG5ldyBUSFJFRS5FdWxlcigpO1xyXG5cclxuICBjb25zdCByb3RhdGlvbkdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgcm90YXRpb25Hcm91cC5zY2FsZS5zZXQoIDAuMywgMC4zLCAwLjMgKTtcclxuICByb3RhdGlvbkdyb3VwLnBvc2l0aW9uLnNldCggLTAuMDE1LCAwLjAxNSwgMC4wICk7XHJcblxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPbkdyaXAoIHAgKXtcclxuXHJcbiAgICBjb25zdCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9ID0gcDtcclxuXHJcbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBmb2xkZXIuYmVpbmdNb3ZlZCA9PT0gdHJ1ZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2xkUG9zaXRpb24uY29weSggZm9sZGVyLnBvc2l0aW9uICk7XHJcbiAgICBvbGRSb3RhdGlvbi5jb3B5KCBmb2xkZXIucm90YXRpb24gKTtcclxuXHJcbiAgICBmb2xkZXIucG9zaXRpb24uc2V0KCAwLDAsMCApO1xyXG4gICAgZm9sZGVyLnJvdGF0aW9uLnNldCggMCwwLDAgKTtcclxuICAgIGZvbGRlci5yb3RhdGlvbi54ID0gLU1hdGguUEkgKiAwLjU7XHJcblxyXG4gICAgb2xkUGFyZW50ID0gZm9sZGVyLnBhcmVudDtcclxuXHJcbiAgICByb3RhdGlvbkdyb3VwLmFkZCggZm9sZGVyICk7XHJcblxyXG4gICAgaW5wdXRPYmplY3QuYWRkKCByb3RhdGlvbkdyb3VwICk7XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG5cclxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gdHJ1ZTtcclxuXHJcbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ3Bpbm5lZCcsIGlucHV0ICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPbkdyaXBSZWxlYXNlKCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9PXt9ICl7XHJcblxyXG4gICAgY29uc3QgZm9sZGVyID0gZ3JvdXAuZm9sZGVyO1xyXG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggb2xkUGFyZW50ID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBmb2xkZXIuYmVpbmdNb3ZlZCA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG9sZFBhcmVudC5hZGQoIGZvbGRlciApO1xyXG4gICAgb2xkUGFyZW50ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGZvbGRlci5wb3NpdGlvbi5jb3B5KCBvbGRQb3NpdGlvbiApO1xyXG4gICAgZm9sZGVyLnJvdGF0aW9uLmNvcHkoIG9sZFJvdGF0aW9uICk7XHJcblxyXG4gICAgZm9sZGVyLmJlaW5nTW92ZWQgPSBmYWxzZTtcclxuXHJcbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ3BpblJlbGVhc2VkJywgaW5wdXQgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBpbnRlcmFjdGlvbjtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgU0RGU2hhZGVyIGZyb20gJ3RocmVlLWJtZm9udC10ZXh0L3NoYWRlcnMvc2RmJztcclxuaW1wb3J0IGNyZWF0ZUdlb21ldHJ5IGZyb20gJ3RocmVlLWJtZm9udC10ZXh0JztcclxuaW1wb3J0IHBhcnNlQVNDSUkgZnJvbSAncGFyc2UtYm1mb250LWFzY2lpJztcclxuXHJcbmltcG9ydCAqIGFzIEZvbnQgZnJvbSAnLi9mb250JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYXRlcmlhbCggY29sb3IgKXtcclxuXHJcbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XHJcbiAgY29uc3QgaW1hZ2UgPSBGb250LmltYWdlKCk7XHJcbiAgdGV4dHVyZS5pbWFnZSA9IGltYWdlO1xyXG4gIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyO1xyXG4gIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xyXG4gIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gdHJ1ZTtcclxuXHJcbiAgLy8gIGFuZCB3aGF0IGFib3V0IGFuaXNvdHJvcGljIGZpbHRlcmluZz9cclxuXHJcbiAgcmV0dXJuIG5ldyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbChTREZTaGFkZXIoe1xyXG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgY29sb3I6IGNvbG9yLFxyXG4gICAgbWFwOiB0ZXh0dXJlXHJcbiAgfSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRvcigpe1xyXG5cclxuICBjb25zdCBmb250ID0gcGFyc2VBU0NJSSggRm9udC5mbnQoKSApO1xyXG5cclxuICBjb25zdCBjb2xvck1hdGVyaWFscyA9IHt9O1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVUZXh0KCBzdHIsIGZvbnQsIGNvbG9yID0gMHhmZmZmZmYgKXtcclxuXHJcbiAgICBjb25zdCBnZW9tZXRyeSA9IGNyZWF0ZUdlb21ldHJ5KHtcclxuICAgICAgdGV4dDogc3RyLFxyXG4gICAgICBhbGlnbjogJ2xlZnQnLFxyXG4gICAgICB3aWR0aDogMTAwMCxcclxuICAgICAgZmxpcFk6IHRydWUsXHJcbiAgICAgIGZvbnRcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBjb25zdCBsYXlvdXQgPSBnZW9tZXRyeS5sYXlvdXQ7XHJcblxyXG4gICAgbGV0IG1hdGVyaWFsID0gY29sb3JNYXRlcmlhbHNbIGNvbG9yIF07XHJcbiAgICBpZiggbWF0ZXJpYWwgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICBtYXRlcmlhbCA9IGNvbG9yTWF0ZXJpYWxzWyBjb2xvciBdID0gY3JlYXRlTWF0ZXJpYWwoIGNvbG9yICk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xyXG4gICAgbWVzaC5zY2FsZS5tdWx0aXBseSggbmV3IFRIUkVFLlZlY3RvcjMoMSwtMSwxKSApO1xyXG4gICAgbWVzaC5zY2FsZS5tdWx0aXBseVNjYWxhciggMC4wMDEgKTtcclxuXHJcbiAgICBtZXNoLnBvc2l0aW9uLnkgPSBsYXlvdXQuaGVpZ2h0ICogMC41ICogMC4wMDE7XHJcblxyXG4gICAgcmV0dXJuIG1lc2g7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlKCBzdHIsIHsgY29sb3I9MHhmZmZmZmYgfSA9IHt9ICl7XHJcbiAgICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICAgIGxldCBtZXNoID0gY3JlYXRlVGV4dCggc3RyLCBmb250LCBjb2xvciApO1xyXG4gICAgZ3JvdXAuYWRkKCBtZXNoICk7XHJcbiAgICBncm91cC5sYXlvdXQgPSBtZXNoLmdlb21ldHJ5LmxheW91dDtcclxuXHJcbiAgICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICAgIG1lc2guZ2VvbWV0cnkudXBkYXRlKCBzdHIgKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGNyZWF0ZSxcclxuICAgIGdldE1hdGVyaWFsOiAoKT0+IG1hdGVyaWFsXHJcbiAgfVxyXG5cclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBBTkVMID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweGZmZmZmZiwgdmVydGV4Q29sb3JzOiBUSFJFRS5WZXJ0ZXhDb2xvcnMgfSApO1xyXG5leHBvcnQgY29uc3QgTE9DQVRPUiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG5leHBvcnQgY29uc3QgRk9MREVSID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweDAwMDAwMCB9ICk7IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuaW1wb3J0ICogYXMgUGFsZXR0ZSBmcm9tICcuL3BhbGV0dGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlU2xpZGVyKCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IDAuMCxcclxuICBtaW4gPSAwLjAsIG1heCA9IDEuMCxcclxuICBzdGVwID0gMC4xLFxyXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxyXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXHJcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEhcclxufSA9IHt9ICl7XHJcblxyXG5cclxuICBjb25zdCBTTElERVJfV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgU0xJREVSX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgU0xJREVSX0RFUFRIID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgYWxwaGE6IDEuMCxcclxuICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXHJcbiAgICBzdGVwOiBzdGVwLFxyXG4gICAgdXNlU3RlcDogZmFsc2UsXHJcbiAgICBwcmVjaXNpb246IDEsXHJcbiAgICBsaXN0ZW46IGZhbHNlLFxyXG4gICAgbWluOiBtaW4sXHJcbiAgICBtYXg6IG1heCxcclxuICAgIG9uQ2hhbmdlZENCOiB1bmRlZmluZWQsXHJcbiAgICBvbkZpbmlzaGVkQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgICBwcmVzc2luZzogZmFsc2VcclxuICB9O1xyXG5cclxuICBzdGF0ZS5zdGVwID0gZ2V0SW1wbGllZFN0ZXAoIHN0YXRlLnZhbHVlICk7XHJcbiAgc3RhdGUucHJlY2lzaW9uID0gbnVtRGVjaW1hbHMoIHN0YXRlLnN0ZXAgKTtcclxuICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgLy8gIGZpbGxlZCB2b2x1bWVcclxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBTTElERVJfV0lEVEgsIFNMSURFUl9IRUlHSFQsIFNMSURFUl9ERVBUSCApO1xyXG4gIHJlY3QudHJhbnNsYXRlKFNMSURFUl9XSURUSCowLjUsMCwwKTtcclxuICAvLyBMYXlvdXQuYWxpZ25MZWZ0KCByZWN0ICk7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIC8vICBvdXRsaW5lIHZvbHVtZVxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcclxuXHJcbiAgY29uc3Qgb3V0bGluZSA9IG5ldyBUSFJFRS5Cb3hIZWxwZXIoIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBvdXRsaW5lLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLk9VVExJTkVfQ09MT1IgKTtcclxuXHJcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogQ29sb3JzLkRFRkFVTFRfQ09MT1IsIGVtaXNzaXZlOiBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgfSk7XHJcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XHJcblxyXG4gIGNvbnN0IGVuZExvY2F0b3IgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCAwLjA1LCAwLjA1LCAwLjA1LCAxLCAxLCAxICksIFNoYXJlZE1hdGVyaWFscy5MT0NBVE9SICk7XHJcbiAgZW5kTG9jYXRvci5wb3NpdGlvbi54ID0gU0xJREVSX1dJRFRIO1xyXG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBlbmRMb2NhdG9yICk7XHJcbiAgZW5kTG9jYXRvci52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IHZhbHVlTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHN0YXRlLnZhbHVlLnRvU3RyaW5nKCkgKTtcclxuICB2YWx1ZUxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfVkFMVUVfVEVYVF9NQVJHSU4gKyB3aWR0aCAqIDAuNTtcclxuICB2YWx1ZUxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aCoyO1xyXG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9TTElERVIgKTtcclxuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xyXG5cclxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcclxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgb3V0bGluZSwgdmFsdWVMYWJlbCwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIGdyb3VwLmFkZCggcGFuZWwgKVxyXG5cclxuICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmFsdWVMYWJlbCggdmFsdWUgKXtcclxuICAgIGlmKCBzdGF0ZS51c2VTdGVwICl7XHJcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlKCByb3VuZFRvRGVjaW1hbCggc3RhdGUudmFsdWUsIHN0YXRlLnByZWNpc2lvbiApLnRvU3RyaW5nKCkgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlKCBzdGF0ZS52YWx1ZS50b1N0cmluZygpICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcbiAgICBpZiggc3RhdGUucHJlc3NpbmcgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSU5URVJBQ1RJT05fQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfQ09MT1IgKTtcclxuICAgICAgbWF0ZXJpYWwuZW1pc3NpdmUuc2V0SGV4KCBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVNsaWRlciggYWxwaGEgKXtcclxuICAgIGFscGhhID0gZ2V0Q2xhbXBlZEFscGhhKCBhbHBoYSApO1xyXG4gICAgZmlsbGVkVm9sdW1lLnNjYWxlLnggPSBNYXRoLm1heCggYWxwaGEgKiB3aWR0aCwgMC4wMDAwMDEgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZU9iamVjdCggdmFsdWUgKXtcclxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBhbHBoYSApe1xyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRDbGFtcGVkQWxwaGEoIGFscGhhICk7XHJcbiAgICBzdGF0ZS52YWx1ZSA9IGdldFZhbHVlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuICAgIGlmKCBzdGF0ZS51c2VTdGVwICl7XHJcbiAgICAgIHN0YXRlLnZhbHVlID0gZ2V0U3RlcHBlZFZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUuc3RlcCApO1xyXG4gICAgfVxyXG4gICAgc3RhdGUudmFsdWUgPSBnZXRDbGFtcGVkVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbGlzdGVuVXBkYXRlKCl7XHJcbiAgICBzdGF0ZS52YWx1ZSA9IGdldFZhbHVlRnJvbU9iamVjdCgpO1xyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldENsYW1wZWRBbHBoYSggc3RhdGUuYWxwaGEgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFZhbHVlRnJvbU9iamVjdCgpe1xyXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKTtcclxuICB9XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBzdGF0ZS5vbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnN0ZXAgPSBmdW5jdGlvbiggc3RlcCApe1xyXG4gICAgc3RhdGUuc3RlcCA9IHN0ZXA7XHJcbiAgICBzdGF0ZS5wcmVjaXNpb24gPSBudW1EZWNpbWFscyggc3RhdGUuc3RlcCApXHJcbiAgICBzdGF0ZS51c2VTdGVwID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlUHJlc3MgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdwcmVzc2luZycsIGhhbmRsZUhvbGQgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlUmVsZWFzZSApO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVQcmVzcyggcCApe1xyXG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhvbGQoIHsgcG9pbnQgfSA9IHt9ICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBmaWxsZWRWb2x1bWUudXBkYXRlTWF0cml4V29ybGQoKTtcclxuICAgIGVuZExvY2F0b3IudXBkYXRlTWF0cml4V29ybGQoKTtcclxuXHJcbiAgICBjb25zdCBhID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGZpbGxlZFZvbHVtZS5tYXRyaXhXb3JsZCApO1xyXG4gICAgY29uc3QgYiA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBlbmRMb2NhdG9yLm1hdHJpeFdvcmxkICk7XHJcblxyXG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHN0YXRlLnZhbHVlO1xyXG5cclxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBnZXRQb2ludEFscGhhKCBwb2ludCwge2EsYn0gKSApO1xyXG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICAgIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuICAgIHVwZGF0ZU9iamVjdCggc3RhdGUudmFsdWUgKTtcclxuXHJcbiAgICBpZiggcHJldmlvdXNWYWx1ZSAhPT0gc3RhdGUudmFsdWUgJiYgc3RhdGUub25DaGFuZ2VkQ0IgKXtcclxuICAgICAgc3RhdGUub25DaGFuZ2VkQ0IoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSZWxlYXNlKCl7XHJcbiAgICBzdGF0ZS5wcmVzc2luZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG4gIGNvbnN0IHBhbGV0dGVJbnRlcmFjdGlvbiA9IFBhbGV0dGUuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHBhbGV0dGVJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG5cclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgbGlzdGVuVXBkYXRlKCk7XHJcbiAgICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XHJcbiAgICAgIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBvaW50QWxwaGEoIHBvaW50LCBzZWdtZW50ICl7XHJcbiAgY29uc3QgYSA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuY29weSggc2VnbWVudC5iICkuc3ViKCBzZWdtZW50LmEgKTtcclxuICBjb25zdCBiID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5jb3B5KCBwb2ludCApLnN1Yiggc2VnbWVudC5hICk7XHJcbiAgY29uc3QgcHJvamVjdGVkID0gYi5wcm9qZWN0T25WZWN0b3IoIGEgKTtcclxuXHJcbiAgY29uc3QgbGVuZ3RoID0gc2VnbWVudC5hLmRpc3RhbmNlVG8oIHNlZ21lbnQuYiApO1xyXG5cclxuICBsZXQgYWxwaGEgPSBwcm9qZWN0ZWQubGVuZ3RoKCkgLyBsZW5ndGg7XHJcbiAgaWYoIGFscGhhID4gMS4wICl7XHJcbiAgICBhbHBoYSA9IDEuMDtcclxuICB9XHJcbiAgaWYoIGFscGhhIDwgMC4wICl7XHJcbiAgICBhbHBoYSA9IDAuMDtcclxuICB9XHJcbiAgcmV0dXJuIGFscGhhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsZXJwKG1pbiwgbWF4LCB2YWx1ZSkge1xyXG4gIHJldHVybiAoMS12YWx1ZSkqbWluICsgdmFsdWUqbWF4O1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXBfcmFuZ2UodmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikge1xyXG4gICAgcmV0dXJuIGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENsYW1wZWRBbHBoYSggYWxwaGEgKXtcclxuICBpZiggYWxwaGEgPiAxICl7XHJcbiAgICByZXR1cm4gMVxyXG4gIH1cclxuICBpZiggYWxwaGEgPCAwICl7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbiAgcmV0dXJuIGFscGhhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDbGFtcGVkVmFsdWUoIHZhbHVlLCBtaW4sIG1heCApe1xyXG4gIGlmKCB2YWx1ZSA8IG1pbiApe1xyXG4gICAgcmV0dXJuIG1pbjtcclxuICB9XHJcbiAgaWYoIHZhbHVlID4gbWF4ICl7XHJcbiAgICByZXR1cm4gbWF4O1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEltcGxpZWRTdGVwKCB2YWx1ZSApe1xyXG4gIGlmKCB2YWx1ZSA9PT0gMCApe1xyXG4gICAgcmV0dXJuIDE7IC8vIFdoYXQgYXJlIHdlLCBwc3ljaGljcz9cclxuICB9IGVsc2Uge1xyXG4gICAgLy8gSGV5IERvdWcsIGNoZWNrIHRoaXMgb3V0LlxyXG4gICAgcmV0dXJuIE1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nKE1hdGguYWJzKHZhbHVlKSkvTWF0aC5MTjEwKSkvMTA7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWYWx1ZUZyb21BbHBoYSggYWxwaGEsIG1pbiwgbWF4ICl7XHJcbiAgcmV0dXJuIG1hcF9yYW5nZSggYWxwaGEsIDAuMCwgMS4wLCBtaW4sIG1heCApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFscGhhRnJvbVZhbHVlKCB2YWx1ZSwgbWluLCBtYXggKXtcclxuICByZXR1cm4gbWFwX3JhbmdlKCB2YWx1ZSwgbWluLCBtYXgsIDAuMCwgMS4wICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFN0ZXBwZWRWYWx1ZSggdmFsdWUsIHN0ZXAgKXtcclxuICBpZiggdmFsdWUgJSBzdGVwICE9IDApIHtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKCB2YWx1ZSAvIHN0ZXAgKSAqIHN0ZXA7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbnVtRGVjaW1hbHMoeCkge1xyXG4gIHggPSB4LnRvU3RyaW5nKCk7XHJcbiAgaWYgKHguaW5kZXhPZignLicpID4gLTEpIHtcclxuICAgIHJldHVybiB4Lmxlbmd0aCAtIHguaW5kZXhPZignLicpIC0gMTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIDA7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByb3VuZFRvRGVjaW1hbCh2YWx1ZSwgZGVjaW1hbHMpIHtcclxuICBjb25zdCB0ZW5UbyA9IE1hdGgucG93KDEwLCBkZWNpbWFscyk7XHJcbiAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiB0ZW5UbykgLyB0ZW5UbztcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlVGV4dExhYmVsKCB0ZXh0Q3JlYXRvciwgc3RyLCB3aWR0aCA9IDAuNCwgZGVwdGggPSAwLjAyOSwgZmdDb2xvciA9IDB4ZmZmZmZmLCBiZ0NvbG9yID0gQ29sb3JzLkRFRkFVTFRfQkFDSyApe1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIGNvbnN0IGludGVybmFsUG9zaXRpb25pbmcgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBncm91cC5hZGQoIGludGVybmFsUG9zaXRpb25pbmcgKTtcclxuXHJcbiAgY29uc3QgdGV4dCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggc3RyLCB7IGNvbG9yOiBmZ0NvbG9yIH0gKTtcclxuICBpbnRlcm5hbFBvc2l0aW9uaW5nLmFkZCggdGV4dCApO1xyXG5cclxuICBncm91cC5zZXRTdHJpbmcgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICB0ZXh0LnVwZGF0ZSggc3RyLnRvU3RyaW5nKCkgKTtcclxuICB9O1xyXG5cclxuICBncm91cC5zZXROdW1iZXIgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICB0ZXh0LnVwZGF0ZSggc3RyLnRvRml4ZWQoMikgKTtcclxuICB9O1xyXG5cclxuICB0ZXh0LnBvc2l0aW9uLnogPSAwLjAxNVxyXG5cclxuICBjb25zdCBiYWNrQm91bmRzID0gMC4wMTtcclxuICBjb25zdCBtYXJnaW4gPSAwLjAxO1xyXG4gIGNvbnN0IHRvdGFsV2lkdGggPSB3aWR0aDtcclxuICBjb25zdCB0b3RhbEhlaWdodCA9IDAuMDQgKyBtYXJnaW4gKiAyO1xyXG4gIGNvbnN0IGxhYmVsQmFja0dlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB0b3RhbFdpZHRoLCB0b3RhbEhlaWdodCwgZGVwdGgsIDEsIDEsIDEgKTtcclxuICBsYWJlbEJhY2tHZW9tZXRyeS5hcHBseU1hdHJpeCggbmV3IFRIUkVFLk1hdHJpeDQoKS5tYWtlVHJhbnNsYXRpb24oIHRvdGFsV2lkdGggKiAwLjUgLSBtYXJnaW4sIDAsIDAgKSApO1xyXG5cclxuICBjb25zdCBsYWJlbEJhY2tNZXNoID0gbmV3IFRIUkVFLk1lc2goIGxhYmVsQmFja0dlb21ldHJ5LCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcclxuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWxCYWNrTWVzaC5nZW9tZXRyeSwgYmdDb2xvciApO1xyXG5cclxuICBsYWJlbEJhY2tNZXNoLnBvc2l0aW9uLnkgPSAwLjAzO1xyXG4gIC8vIGxhYmVsQmFja01lc2gucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG4gIGludGVybmFsUG9zaXRpb25pbmcuYWRkKCBsYWJlbEJhY2tNZXNoICk7XHJcbiAgaW50ZXJuYWxQb3NpdGlvbmluZy5wb3NpdGlvbi55ID0gLXRvdGFsSGVpZ2h0ICogMC41O1xyXG5cclxuICAvLyBsYWJlbEdyb3VwLnBvc2l0aW9uLnggPSBsYWJlbEJvdW5kcy53aWR0aCAqIDAuNTtcclxuICAvLyBsYWJlbEdyb3VwLnBvc2l0aW9uLnkgPSBsYWJlbEJvdW5kcy5oZWlnaHQgKiAwLjU7XHJcblxyXG4gIGdyb3VwLmJhY2sgPSBsYWJlbEJhY2tNZXNoO1xyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCJ2YXIgc3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuQXJyYXlcblxuZnVuY3Rpb24gYW5BcnJheShhcnIpIHtcbiAgcmV0dXJuIChcbiAgICAgICBhcnIuQllURVNfUEVSX0VMRU1FTlRcbiAgICAmJiBzdHIuY2FsbChhcnIuYnVmZmVyKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJ1xuICAgIHx8IEFycmF5LmlzQXJyYXkoYXJyKVxuICApXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG51bXR5cGUobnVtLCBkZWYpIHtcblx0cmV0dXJuIHR5cGVvZiBudW0gPT09ICdudW1iZXInXG5cdFx0PyBudW0gXG5cdFx0OiAodHlwZW9mIGRlZiA9PT0gJ251bWJlcicgPyBkZWYgOiAwKVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZHR5cGUpIHtcbiAgc3dpdGNoIChkdHlwZSkge1xuICAgIGNhc2UgJ2ludDgnOlxuICAgICAgcmV0dXJuIEludDhBcnJheVxuICAgIGNhc2UgJ2ludDE2JzpcbiAgICAgIHJldHVybiBJbnQxNkFycmF5XG4gICAgY2FzZSAnaW50MzInOlxuICAgICAgcmV0dXJuIEludDMyQXJyYXlcbiAgICBjYXNlICd1aW50OCc6XG4gICAgICByZXR1cm4gVWludDhBcnJheVxuICAgIGNhc2UgJ3VpbnQxNic6XG4gICAgICByZXR1cm4gVWludDE2QXJyYXlcbiAgICBjYXNlICd1aW50MzInOlxuICAgICAgcmV0dXJuIFVpbnQzMkFycmF5XG4gICAgY2FzZSAnZmxvYXQzMic6XG4gICAgICByZXR1cm4gRmxvYXQzMkFycmF5XG4gICAgY2FzZSAnZmxvYXQ2NCc6XG4gICAgICByZXR1cm4gRmxvYXQ2NEFycmF5XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5XG4gICAgY2FzZSAndWludDhfY2xhbXBlZCc6XG4gICAgICByZXR1cm4gVWludDhDbGFtcGVkQXJyYXlcbiAgfVxufVxuIiwiLyplc2xpbnQgbmV3LWNhcDowKi9cbnZhciBkdHlwZSA9IHJlcXVpcmUoJ2R0eXBlJylcbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlblZlcnRleERhdGFcbmZ1bmN0aW9uIGZsYXR0ZW5WZXJ0ZXhEYXRhIChkYXRhLCBvdXRwdXQsIG9mZnNldCkge1xuICBpZiAoIWRhdGEpIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSBkYXRhIGFzIGZpcnN0IHBhcmFtZXRlcicpXG4gIG9mZnNldCA9ICsob2Zmc2V0IHx8IDApIHwgMFxuXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIEFycmF5LmlzQXJyYXkoZGF0YVswXSkpIHtcbiAgICB2YXIgZGltID0gZGF0YVswXS5sZW5ndGhcbiAgICB2YXIgbGVuZ3RoID0gZGF0YS5sZW5ndGggKiBkaW1cblxuICAgIC8vIG5vIG91dHB1dCBzcGVjaWZpZWQsIGNyZWF0ZSBhIG5ldyB0eXBlZCBhcnJheVxuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvdXRwdXQgPSBuZXcgKGR0eXBlKG91dHB1dCB8fCAnZmxvYXQzMicpKShsZW5ndGggKyBvZmZzZXQpXG4gICAgfVxuXG4gICAgdmFyIGRzdExlbmd0aCA9IG91dHB1dC5sZW5ndGggLSBvZmZzZXRcbiAgICBpZiAobGVuZ3RoICE9PSBkc3RMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc291cmNlIGxlbmd0aCAnICsgbGVuZ3RoICsgJyAoJyArIGRpbSArICd4JyArIGRhdGEubGVuZ3RoICsgJyknICtcbiAgICAgICAgJyBkb2VzIG5vdCBtYXRjaCBkZXN0aW5hdGlvbiBsZW5ndGggJyArIGRzdExlbmd0aClcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgayA9IG9mZnNldDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZGltOyBqKyspIHtcbiAgICAgICAgb3V0cHV0W2srK10gPSBkYXRhW2ldW2pdXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBubyBvdXRwdXQsIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgIHZhciBDdG9yID0gZHR5cGUob3V0cHV0IHx8ICdmbG9hdDMyJylcbiAgICAgIGlmIChvZmZzZXQgPT09IDApIHtcbiAgICAgICAgb3V0cHV0ID0gbmV3IEN0b3IoZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IG5ldyBDdG9yKGRhdGEubGVuZ3RoICsgb2Zmc2V0KVxuICAgICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3RvcmUgb3V0cHV0IGluIGV4aXN0aW5nIGFycmF5XG4gICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBpbGUocHJvcGVydHkpIHtcblx0aWYgKCFwcm9wZXJ0eSB8fCB0eXBlb2YgcHJvcGVydHkgIT09ICdzdHJpbmcnKVxuXHRcdHRocm93IG5ldyBFcnJvcignbXVzdCBzcGVjaWZ5IHByb3BlcnR5IGZvciBpbmRleG9mIHNlYXJjaCcpXG5cblx0cmV0dXJuIG5ldyBGdW5jdGlvbignYXJyYXknLCAndmFsdWUnLCAnc3RhcnQnLCBbXG5cdFx0J3N0YXJ0ID0gc3RhcnQgfHwgMCcsXG5cdFx0J2ZvciAodmFyIGk9c3RhcnQ7IGk8YXJyYXkubGVuZ3RoOyBpKyspJyxcblx0XHQnICBpZiAoYXJyYXlbaV1bXCInICsgcHJvcGVydHkgKydcIl0gPT09IHZhbHVlKScsXG5cdFx0JyAgICAgIHJldHVybiBpJyxcblx0XHQncmV0dXJuIC0xJ1xuXHRdLmpvaW4oJ1xcbicpKVxufSIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwidmFyIHdvcmRXcmFwID0gcmVxdWlyZSgnd29yZC13cmFwcGVyJylcbnZhciB4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kJylcbnZhciBmaW5kQ2hhciA9IHJlcXVpcmUoJ2luZGV4b2YtcHJvcGVydHknKSgnaWQnKVxudmFyIG51bWJlciA9IHJlcXVpcmUoJ2FzLW51bWJlcicpXG5cbnZhciBYX0hFSUdIVFMgPSBbJ3gnLCAnZScsICdhJywgJ28nLCAnbicsICdzJywgJ3InLCAnYycsICd1JywgJ20nLCAndicsICd3JywgJ3onXVxudmFyIE1fV0lEVEhTID0gWydtJywgJ3cnXVxudmFyIENBUF9IRUlHSFRTID0gWydIJywgJ0knLCAnTicsICdFJywgJ0YnLCAnSycsICdMJywgJ1QnLCAnVScsICdWJywgJ1cnLCAnWCcsICdZJywgJ1onXVxuXG5cbnZhciBUQUJfSUQgPSAnXFx0Jy5jaGFyQ29kZUF0KDApXG52YXIgU1BBQ0VfSUQgPSAnICcuY2hhckNvZGVBdCgwKVxudmFyIEFMSUdOX0xFRlQgPSAwLCBcbiAgICBBTElHTl9DRU5URVIgPSAxLCBcbiAgICBBTElHTl9SSUdIVCA9IDJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVMYXlvdXQob3B0KSB7XG4gIHJldHVybiBuZXcgVGV4dExheW91dChvcHQpXG59XG5cbmZ1bmN0aW9uIFRleHRMYXlvdXQob3B0KSB7XG4gIHRoaXMuZ2x5cGhzID0gW11cbiAgdGhpcy5fbWVhc3VyZSA9IHRoaXMuY29tcHV0ZU1ldHJpY3MuYmluZCh0aGlzKVxuICB0aGlzLnVwZGF0ZShvcHQpXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG9wdCkge1xuICBvcHQgPSB4dGVuZCh7XG4gICAgbWVhc3VyZTogdGhpcy5fbWVhc3VyZVxuICB9LCBvcHQpXG4gIHRoaXMuX29wdCA9IG9wdFxuICB0aGlzLl9vcHQudGFiU2l6ZSA9IG51bWJlcih0aGlzLl9vcHQudGFiU2l6ZSwgNClcblxuICBpZiAoIW9wdC5mb250KVxuICAgIHRocm93IG5ldyBFcnJvcignbXVzdCBwcm92aWRlIGEgdmFsaWQgYml0bWFwIGZvbnQnKVxuXG4gIHZhciBnbHlwaHMgPSB0aGlzLmdseXBoc1xuICB2YXIgdGV4dCA9IG9wdC50ZXh0fHwnJyBcbiAgdmFyIGZvbnQgPSBvcHQuZm9udFxuICB0aGlzLl9zZXR1cFNwYWNlR2x5cGhzKGZvbnQpXG4gIFxuICB2YXIgbGluZXMgPSB3b3JkV3JhcC5saW5lcyh0ZXh0LCBvcHQpXG4gIHZhciBtaW5XaWR0aCA9IG9wdC53aWR0aCB8fCAwXG5cbiAgLy9jbGVhciBnbHlwaHNcbiAgZ2x5cGhzLmxlbmd0aCA9IDBcblxuICAvL2dldCBtYXggbGluZSB3aWR0aFxuICB2YXIgbWF4TGluZVdpZHRoID0gbGluZXMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGxpbmUpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgocHJldiwgbGluZS53aWR0aCwgbWluV2lkdGgpXG4gIH0sIDApXG5cbiAgLy90aGUgcGVuIHBvc2l0aW9uXG4gIHZhciB4ID0gMFxuICB2YXIgeSA9IDBcbiAgdmFyIGxpbmVIZWlnaHQgPSBudW1iZXIob3B0LmxpbmVIZWlnaHQsIGZvbnQuY29tbW9uLmxpbmVIZWlnaHQpXG4gIHZhciBiYXNlbGluZSA9IGZvbnQuY29tbW9uLmJhc2VcbiAgdmFyIGRlc2NlbmRlciA9IGxpbmVIZWlnaHQtYmFzZWxpbmVcbiAgdmFyIGxldHRlclNwYWNpbmcgPSBvcHQubGV0dGVyU3BhY2luZyB8fCAwXG4gIHZhciBoZWlnaHQgPSBsaW5lSGVpZ2h0ICogbGluZXMubGVuZ3RoIC0gZGVzY2VuZGVyXG4gIHZhciBhbGlnbiA9IGdldEFsaWduVHlwZSh0aGlzLl9vcHQuYWxpZ24pXG5cbiAgLy9kcmF3IHRleHQgYWxvbmcgYmFzZWxpbmVcbiAgeSAtPSBoZWlnaHRcbiAgXG4gIC8vdGhlIG1ldHJpY3MgZm9yIHRoaXMgdGV4dCBsYXlvdXRcbiAgdGhpcy5fd2lkdGggPSBtYXhMaW5lV2lkdGhcbiAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0XG4gIHRoaXMuX2Rlc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBiYXNlbGluZVxuICB0aGlzLl9iYXNlbGluZSA9IGJhc2VsaW5lXG4gIHRoaXMuX3hIZWlnaHQgPSBnZXRYSGVpZ2h0KGZvbnQpXG4gIHRoaXMuX2NhcEhlaWdodCA9IGdldENhcEhlaWdodChmb250KVxuICB0aGlzLl9saW5lSGVpZ2h0ID0gbGluZUhlaWdodFxuICB0aGlzLl9hc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBkZXNjZW5kZXIgLSB0aGlzLl94SGVpZ2h0XG4gICAgXG4gIC8vbGF5b3V0IGVhY2ggZ2x5cGhcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgbGluZUluZGV4KSB7XG4gICAgdmFyIHN0YXJ0ID0gbGluZS5zdGFydFxuICAgIHZhciBlbmQgPSBsaW5lLmVuZFxuICAgIHZhciBsaW5lV2lkdGggPSBsaW5lLndpZHRoXG4gICAgdmFyIGxhc3RHbHlwaFxuICAgIFxuICAgIC8vZm9yIGVhY2ggZ2x5cGggaW4gdGhhdCBsaW5lLi4uXG4gICAgZm9yICh2YXIgaT1zdGFydDsgaTxlbmQ7IGkrKykge1xuICAgICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgICB2YXIgZ2x5cGggPSBzZWxmLmdldEdseXBoKGZvbnQsIGlkKVxuICAgICAgaWYgKGdseXBoKSB7XG4gICAgICAgIGlmIChsYXN0R2x5cGgpIFxuICAgICAgICAgIHggKz0gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKVxuXG4gICAgICAgIHZhciB0eCA9IHhcbiAgICAgICAgaWYgKGFsaWduID09PSBBTElHTl9DRU5URVIpIFxuICAgICAgICAgIHR4ICs9IChtYXhMaW5lV2lkdGgtbGluZVdpZHRoKS8yXG4gICAgICAgIGVsc2UgaWYgKGFsaWduID09PSBBTElHTl9SSUdIVClcbiAgICAgICAgICB0eCArPSAobWF4TGluZVdpZHRoLWxpbmVXaWR0aClcblxuICAgICAgICBnbHlwaHMucHVzaCh7XG4gICAgICAgICAgcG9zaXRpb246IFt0eCwgeV0sXG4gICAgICAgICAgZGF0YTogZ2x5cGgsXG4gICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgbGluZTogbGluZUluZGV4XG4gICAgICAgIH0pICBcblxuICAgICAgICAvL21vdmUgcGVuIGZvcndhcmRcbiAgICAgICAgeCArPSBnbHlwaC54YWR2YW5jZSArIGxldHRlclNwYWNpbmdcbiAgICAgICAgbGFzdEdseXBoID0gZ2x5cGhcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL25leHQgbGluZSBkb3duXG4gICAgeSArPSBsaW5lSGVpZ2h0XG4gICAgeCA9IDBcbiAgfSlcbiAgdGhpcy5fbGluZXNUb3RhbCA9IGxpbmVzLmxlbmd0aDtcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuX3NldHVwU3BhY2VHbHlwaHMgPSBmdW5jdGlvbihmb250KSB7XG4gIC8vVGhlc2UgYXJlIGZhbGxiYWNrcywgd2hlbiB0aGUgZm9udCBkb2Vzbid0IGluY2x1ZGVcbiAgLy8nICcgb3IgJ1xcdCcgZ2x5cGhzXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IG51bGxcbiAgdGhpcy5fZmFsbGJhY2tUYWJHbHlwaCA9IG51bGxcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuXG5cbiAgLy90cnkgdG8gZ2V0IHNwYWNlIGdseXBoXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlICdtJyBvciAndycgZ2x5cGhzXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlIGZpcnN0IGdseXBoIGF2YWlsYWJsZVxuICB2YXIgc3BhY2UgPSBnZXRHbHlwaEJ5SWQoZm9udCwgU1BBQ0VfSUQpIFxuICAgICAgICAgIHx8IGdldE1HbHlwaChmb250KSBcbiAgICAgICAgICB8fCBmb250LmNoYXJzWzBdXG5cbiAgLy9hbmQgY3JlYXRlIGEgZmFsbGJhY2sgZm9yIHRhYlxuICB2YXIgdGFiV2lkdGggPSB0aGlzLl9vcHQudGFiU2l6ZSAqIHNwYWNlLnhhZHZhbmNlXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IHNwYWNlXG4gIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGggPSB4dGVuZChzcGFjZSwge1xuICAgIHg6IDAsIHk6IDAsIHhhZHZhbmNlOiB0YWJXaWR0aCwgaWQ6IFRBQl9JRCwgXG4gICAgeG9mZnNldDogMCwgeW9mZnNldDogMCwgd2lkdGg6IDAsIGhlaWdodDogMFxuICB9KVxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5nZXRHbHlwaCA9IGZ1bmN0aW9uKGZvbnQsIGlkKSB7XG4gIHZhciBnbHlwaCA9IGdldEdseXBoQnlJZChmb250LCBpZClcbiAgaWYgKGdseXBoKVxuICAgIHJldHVybiBnbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gVEFCX0lEKSBcbiAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tUYWJHbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gU1BBQ0VfSUQpIFxuICAgIHJldHVybiB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGhcbiAgcmV0dXJuIG51bGxcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuY29tcHV0ZU1ldHJpY3MgPSBmdW5jdGlvbih0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICB2YXIgbGV0dGVyU3BhY2luZyA9IHRoaXMuX29wdC5sZXR0ZXJTcGFjaW5nIHx8IDBcbiAgdmFyIGZvbnQgPSB0aGlzLl9vcHQuZm9udFxuICB2YXIgY3VyUGVuID0gMFxuICB2YXIgY3VyV2lkdGggPSAwXG4gIHZhciBjb3VudCA9IDBcbiAgdmFyIGdseXBoXG4gIHZhciBsYXN0R2x5cGhcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgZW5kOiBzdGFydCxcbiAgICAgIHdpZHRoOiAwXG4gICAgfVxuICB9XG5cbiAgZW5kID0gTWF0aC5taW4odGV4dC5sZW5ndGgsIGVuZClcbiAgZm9yICh2YXIgaT1zdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgdmFyIGdseXBoID0gdGhpcy5nZXRHbHlwaChmb250LCBpZClcblxuICAgIGlmIChnbHlwaCkge1xuICAgICAgLy9tb3ZlIHBlbiBmb3J3YXJkXG4gICAgICB2YXIgeG9mZiA9IGdseXBoLnhvZmZzZXRcbiAgICAgIHZhciBrZXJuID0gbGFzdEdseXBoID8gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKSA6IDBcbiAgICAgIGN1clBlbiArPSBrZXJuXG5cbiAgICAgIHZhciBuZXh0UGVuID0gY3VyUGVuICsgZ2x5cGgueGFkdmFuY2UgKyBsZXR0ZXJTcGFjaW5nXG4gICAgICB2YXIgbmV4dFdpZHRoID0gY3VyUGVuICsgZ2x5cGgud2lkdGhcblxuICAgICAgLy93ZSd2ZSBoaXQgb3VyIGxpbWl0OyB3ZSBjYW4ndCBtb3ZlIG9udG8gdGhlIG5leHQgZ2x5cGhcbiAgICAgIGlmIChuZXh0V2lkdGggPj0gd2lkdGggfHwgbmV4dFBlbiA+PSB3aWR0aClcbiAgICAgICAgYnJlYWtcblxuICAgICAgLy9vdGhlcndpc2UgY29udGludWUgYWxvbmcgb3VyIGxpbmVcbiAgICAgIGN1clBlbiA9IG5leHRQZW5cbiAgICAgIGN1cldpZHRoID0gbmV4dFdpZHRoXG4gICAgICBsYXN0R2x5cGggPSBnbHlwaFxuICAgIH1cbiAgICBjb3VudCsrXG4gIH1cbiAgXG4gIC8vbWFrZSBzdXJlIHJpZ2h0bW9zdCBlZGdlIGxpbmVzIHVwIHdpdGggcmVuZGVyZWQgZ2x5cGhzXG4gIGlmIChsYXN0R2x5cGgpXG4gICAgY3VyV2lkdGggKz0gbGFzdEdseXBoLnhvZmZzZXRcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBlbmQ6IHN0YXJ0ICsgY291bnQsXG4gICAgd2lkdGg6IGN1cldpZHRoXG4gIH1cbn1cblxuLy9nZXR0ZXJzIGZvciB0aGUgcHJpdmF0ZSB2YXJzXG47Wyd3aWR0aCcsICdoZWlnaHQnLCBcbiAgJ2Rlc2NlbmRlcicsICdhc2NlbmRlcicsXG4gICd4SGVpZ2h0JywgJ2Jhc2VsaW5lJyxcbiAgJ2NhcEhlaWdodCcsXG4gICdsaW5lSGVpZ2h0JyBdLmZvckVhY2goYWRkR2V0dGVyKVxuXG5mdW5jdGlvbiBhZGRHZXR0ZXIobmFtZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dExheW91dC5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICBnZXQ6IHdyYXBwZXIobmFtZSksXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG59XG5cbi8vY3JlYXRlIGxvb2t1cHMgZm9yIHByaXZhdGUgdmFyc1xuZnVuY3Rpb24gd3JhcHBlcihuYW1lKSB7XG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKFtcbiAgICAncmV0dXJuIGZ1bmN0aW9uICcrbmFtZSsnKCkgeycsXG4gICAgJyAgcmV0dXJuIHRoaXMuXycrbmFtZSxcbiAgICAnfSdcbiAgXS5qb2luKCdcXG4nKSkpKClcbn1cblxuZnVuY3Rpb24gZ2V0R2x5cGhCeUlkKGZvbnQsIGlkKSB7XG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gbnVsbFxuXG4gIHZhciBnbHlwaElkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICBpZiAoZ2x5cGhJZHggPj0gMClcbiAgICByZXR1cm4gZm9udC5jaGFyc1tnbHlwaElkeF1cbiAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gZ2V0WEhlaWdodChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxYX0hFSUdIVFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBYX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRNR2x5cGgoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8TV9XSURUSFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBNX1dJRFRIU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdXG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0Q2FwSGVpZ2h0KGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPENBUF9IRUlHSFRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gQ0FQX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRLZXJuaW5nKGZvbnQsIGxlZnQsIHJpZ2h0KSB7XG4gIGlmICghZm9udC5rZXJuaW5ncyB8fCBmb250Lmtlcm5pbmdzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gMFxuXG4gIHZhciB0YWJsZSA9IGZvbnQua2VybmluZ3NcbiAgZm9yICh2YXIgaT0wOyBpPHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtlcm4gPSB0YWJsZVtpXVxuICAgIGlmIChrZXJuLmZpcnN0ID09PSBsZWZ0ICYmIGtlcm4uc2Vjb25kID09PSByaWdodClcbiAgICAgIHJldHVybiBrZXJuLmFtb3VudFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldEFsaWduVHlwZShhbGlnbikge1xuICBpZiAoYWxpZ24gPT09ICdjZW50ZXInKVxuICAgIHJldHVybiBBTElHTl9DRU5URVJcbiAgZWxzZSBpZiAoYWxpZ24gPT09ICdyaWdodCcpXG4gICAgcmV0dXJuIEFMSUdOX1JJR0hUXG4gIHJldHVybiBBTElHTl9MRUZUXG59IiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUJNRm9udEFzY2lpKGRhdGEpIHtcbiAgaWYgKCFkYXRhKVxuICAgIHRocm93IG5ldyBFcnJvcignbm8gZGF0YSBwcm92aWRlZCcpXG4gIGRhdGEgPSBkYXRhLnRvU3RyaW5nKCkudHJpbSgpXG5cbiAgdmFyIG91dHB1dCA9IHtcbiAgICBwYWdlczogW10sXG4gICAgY2hhcnM6IFtdLFxuICAgIGtlcm5pbmdzOiBbXVxuICB9XG5cbiAgdmFyIGxpbmVzID0gZGF0YS5zcGxpdCgvXFxyXFxuP3xcXG4vZylcblxuICBpZiAobGluZXMubGVuZ3RoID09PSAwKVxuICAgIHRocm93IG5ldyBFcnJvcignbm8gZGF0YSBpbiBCTUZvbnQgZmlsZScpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBsaW5lRGF0YSA9IHNwbGl0TGluZShsaW5lc1tpXSwgaSlcbiAgICBpZiAoIWxpbmVEYXRhKSAvL3NraXAgZW1wdHkgbGluZXNcbiAgICAgIGNvbnRpbnVlXG5cbiAgICBpZiAobGluZURhdGEua2V5ID09PSAncGFnZScpIHtcbiAgICAgIGlmICh0eXBlb2YgbGluZURhdGEuZGF0YS5pZCAhPT0gJ251bWJlcicpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWFsZm9ybWVkIGZpbGUgYXQgbGluZSAnICsgaSArICcgLS0gbmVlZHMgcGFnZSBpZD1OJylcbiAgICAgIGlmICh0eXBlb2YgbGluZURhdGEuZGF0YS5maWxlICE9PSAnc3RyaW5nJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYWxmb3JtZWQgZmlsZSBhdCBsaW5lICcgKyBpICsgJyAtLSBuZWVkcyBwYWdlIGZpbGU9XCJwYXRoXCInKVxuICAgICAgb3V0cHV0LnBhZ2VzW2xpbmVEYXRhLmRhdGEuaWRdID0gbGluZURhdGEuZGF0YS5maWxlXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdjaGFycycgfHwgbGluZURhdGEua2V5ID09PSAna2VybmluZ3MnKSB7XG4gICAgICAvLy4uLiBkbyBub3RoaW5nIGZvciB0aGVzZSB0d28gLi4uXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdjaGFyJykge1xuICAgICAgb3V0cHV0LmNoYXJzLnB1c2gobGluZURhdGEuZGF0YSlcbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2tlcm5pbmcnKSB7XG4gICAgICBvdXRwdXQua2VybmluZ3MucHVzaChsaW5lRGF0YS5kYXRhKVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXRbbGluZURhdGEua2V5XSA9IGxpbmVEYXRhLmRhdGFcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG5cbmZ1bmN0aW9uIHNwbGl0TGluZShsaW5lLCBpZHgpIHtcbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFx0Ky9nLCAnICcpLnRyaW0oKVxuICBpZiAoIWxpbmUpXG4gICAgcmV0dXJuIG51bGxcblxuICB2YXIgc3BhY2UgPSBsaW5lLmluZGV4T2YoJyAnKVxuICBpZiAoc3BhY2UgPT09IC0xKSBcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJubyBuYW1lZCByb3cgYXQgbGluZSBcIiArIGlkeClcblxuICB2YXIga2V5ID0gbGluZS5zdWJzdHJpbmcoMCwgc3BhY2UpXG5cbiAgbGluZSA9IGxpbmUuc3Vic3RyaW5nKHNwYWNlICsgMSlcbiAgLy9jbGVhciBcImxldHRlclwiIGZpZWxkIGFzIGl0IGlzIG5vbi1zdGFuZGFyZCBhbmRcbiAgLy9yZXF1aXJlcyBhZGRpdGlvbmFsIGNvbXBsZXhpdHkgdG8gcGFyc2UgXCIgLyA9IHN5bWJvbHNcbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvbGV0dGVyPVtcXCdcXFwiXVxcUytbXFwnXFxcIl0vZ2ksICcnKSAgXG4gIGxpbmUgPSBsaW5lLnNwbGl0KFwiPVwiKVxuICBsaW5lID0gbGluZS5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50cmltKCkubWF0Y2goKC8oXCIuKj9cInxbXlwiXFxzXSspKyg/PVxccyp8XFxzKiQpL2cpKVxuICB9KVxuXG4gIHZhciBkYXRhID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGR0ID0gbGluZVtpXVxuICAgIGlmIChpID09PSAwKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBrZXk6IGR0WzBdLFxuICAgICAgICBkYXRhOiBcIlwiXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoaSA9PT0gbGluZS5sZW5ndGggLSAxKSB7XG4gICAgICBkYXRhW2RhdGEubGVuZ3RoIC0gMV0uZGF0YSA9IHBhcnNlRGF0YShkdFswXSlcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGEgPSBwYXJzZURhdGEoZHRbMF0pXG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBrZXk6IGR0WzFdLFxuICAgICAgICBkYXRhOiBcIlwiXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHZhciBvdXQgPSB7XG4gICAga2V5OiBrZXksXG4gICAgZGF0YToge31cbiAgfVxuXG4gIGRhdGEuZm9yRWFjaChmdW5jdGlvbih2KSB7XG4gICAgb3V0LmRhdGFbdi5rZXldID0gdi5kYXRhO1xuICB9KVxuXG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gcGFyc2VEYXRhKGRhdGEpIHtcbiAgaWYgKCFkYXRhIHx8IGRhdGEubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBcIlwiXG5cbiAgaWYgKGRhdGEuaW5kZXhPZignXCInKSA9PT0gMCB8fCBkYXRhLmluZGV4T2YoXCInXCIpID09PSAwKVxuICAgIHJldHVybiBkYXRhLnN1YnN0cmluZygxLCBkYXRhLmxlbmd0aCAtIDEpXG4gIGlmIChkYXRhLmluZGV4T2YoJywnKSAhPT0gLTEpXG4gICAgcmV0dXJuIHBhcnNlSW50TGlzdChkYXRhKVxuICByZXR1cm4gcGFyc2VJbnQoZGF0YSwgMTApXG59XG5cbmZ1bmN0aW9uIHBhcnNlSW50TGlzdChkYXRhKSB7XG4gIHJldHVybiBkYXRhLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKHZhbCkge1xuICAgIHJldHVybiBwYXJzZUludCh2YWwsIDEwKVxuICB9KVxufSIsInZhciBkdHlwZSA9IHJlcXVpcmUoJ2R0eXBlJylcbnZhciBhbkFycmF5ID0gcmVxdWlyZSgnYW4tYXJyYXknKVxudmFyIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJylcblxudmFyIENXID0gWzAsIDIsIDNdXG52YXIgQ0NXID0gWzIsIDEsIDNdXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUXVhZEVsZW1lbnRzKGFycmF5LCBvcHQpIHtcbiAgICAvL2lmIHVzZXIgZGlkbid0IHNwZWNpZnkgYW4gb3V0cHV0IGFycmF5XG4gICAgaWYgKCFhcnJheSB8fCAhKGFuQXJyYXkoYXJyYXkpIHx8IGlzQnVmZmVyKGFycmF5KSkpIHtcbiAgICAgICAgb3B0ID0gYXJyYXkgfHwge31cbiAgICAgICAgYXJyYXkgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHQgPT09ICdudW1iZXInKSAvL2JhY2t3YXJkcy1jb21wYXRpYmxlXG4gICAgICAgIG9wdCA9IHsgY291bnQ6IG9wdCB9XG4gICAgZWxzZVxuICAgICAgICBvcHQgPSBvcHQgfHwge31cblxuICAgIHZhciB0eXBlID0gdHlwZW9mIG9wdC50eXBlID09PSAnc3RyaW5nJyA/IG9wdC50eXBlIDogJ3VpbnQxNidcbiAgICB2YXIgY291bnQgPSB0eXBlb2Ygb3B0LmNvdW50ID09PSAnbnVtYmVyJyA/IG9wdC5jb3VudCA6IDFcbiAgICB2YXIgc3RhcnQgPSAob3B0LnN0YXJ0IHx8IDApIFxuXG4gICAgdmFyIGRpciA9IG9wdC5jbG9ja3dpc2UgIT09IGZhbHNlID8gQ1cgOiBDQ1csXG4gICAgICAgIGEgPSBkaXJbMF0sIFxuICAgICAgICBiID0gZGlyWzFdLFxuICAgICAgICBjID0gZGlyWzJdXG5cbiAgICB2YXIgbnVtSW5kaWNlcyA9IGNvdW50ICogNlxuXG4gICAgdmFyIGluZGljZXMgPSBhcnJheSB8fCBuZXcgKGR0eXBlKHR5cGUpKShudW1JbmRpY2VzKVxuICAgIGZvciAodmFyIGkgPSAwLCBqID0gMDsgaSA8IG51bUluZGljZXM7IGkgKz0gNiwgaiArPSA0KSB7XG4gICAgICAgIHZhciB4ID0gaSArIHN0YXJ0XG4gICAgICAgIGluZGljZXNbeCArIDBdID0gaiArIDBcbiAgICAgICAgaW5kaWNlc1t4ICsgMV0gPSBqICsgMVxuICAgICAgICBpbmRpY2VzW3ggKyAyXSA9IGogKyAyXG4gICAgICAgIGluZGljZXNbeCArIDNdID0gaiArIGFcbiAgICAgICAgaW5kaWNlc1t4ICsgNF0gPSBqICsgYlxuICAgICAgICBpbmRpY2VzW3ggKyA1XSA9IGogKyBjXG4gICAgfVxuICAgIHJldHVybiBpbmRpY2VzXG59IiwidmFyIGNyZWF0ZUxheW91dCA9IHJlcXVpcmUoJ2xheW91dC1ibWZvbnQtdGV4dCcpXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG52YXIgY3JlYXRlSW5kaWNlcyA9IHJlcXVpcmUoJ3F1YWQtaW5kaWNlcycpXG52YXIgYnVmZmVyID0gcmVxdWlyZSgndGhyZWUtYnVmZmVyLXZlcnRleC1kYXRhJylcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJylcblxudmFyIHZlcnRpY2VzID0gcmVxdWlyZSgnLi9saWIvdmVydGljZXMnKVxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi9saWIvdXRpbHMnKVxuXG52YXIgQmFzZSA9IFRIUkVFLkJ1ZmZlckdlb21ldHJ5XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlVGV4dEdlb21ldHJ5IChvcHQpIHtcbiAgcmV0dXJuIG5ldyBUZXh0R2VvbWV0cnkob3B0KVxufVxuXG5mdW5jdGlvbiBUZXh0R2VvbWV0cnkgKG9wdCkge1xuICBCYXNlLmNhbGwodGhpcylcblxuICBpZiAodHlwZW9mIG9wdCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHQgPSB7IHRleHQ6IG9wdCB9XG4gIH1cblxuICAvLyB1c2UgdGhlc2UgYXMgZGVmYXVsdCB2YWx1ZXMgZm9yIGFueSBzdWJzZXF1ZW50XG4gIC8vIGNhbGxzIHRvIHVwZGF0ZSgpXG4gIHRoaXMuX29wdCA9IGFzc2lnbih7fSwgb3B0KVxuXG4gIC8vIGFsc28gZG8gYW4gaW5pdGlhbCBzZXR1cC4uLlxuICBpZiAob3B0KSB0aGlzLnVwZGF0ZShvcHQpXG59XG5cbmluaGVyaXRzKFRleHRHZW9tZXRyeSwgQmFzZSlcblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAob3B0KSB7XG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJykge1xuICAgIG9wdCA9IHsgdGV4dDogb3B0IH1cbiAgfVxuXG4gIC8vIHVzZSBjb25zdHJ1Y3RvciBkZWZhdWx0c1xuICBvcHQgPSBhc3NpZ24oe30sIHRoaXMuX29wdCwgb3B0KVxuXG4gIGlmICghb3B0LmZvbnQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHNwZWNpZnkgYSB7IGZvbnQgfSBpbiBvcHRpb25zJylcbiAgfVxuXG4gIHRoaXMubGF5b3V0ID0gY3JlYXRlTGF5b3V0KG9wdClcblxuICAvLyBnZXQgdmVjMiB0ZXhjb29yZHNcbiAgdmFyIGZsaXBZID0gb3B0LmZsaXBZICE9PSBmYWxzZVxuXG4gIC8vIHRoZSBkZXNpcmVkIEJNRm9udCBkYXRhXG4gIHZhciBmb250ID0gb3B0LmZvbnRcblxuICAvLyBkZXRlcm1pbmUgdGV4dHVyZSBzaXplIGZyb20gZm9udCBmaWxlXG4gIHZhciB0ZXhXaWR0aCA9IGZvbnQuY29tbW9uLnNjYWxlV1xuICB2YXIgdGV4SGVpZ2h0ID0gZm9udC5jb21tb24uc2NhbGVIXG5cbiAgLy8gZ2V0IHZpc2libGUgZ2x5cGhzXG4gIHZhciBnbHlwaHMgPSB0aGlzLmxheW91dC5nbHlwaHMuZmlsdGVyKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG4gICAgcmV0dXJuIGJpdG1hcC53aWR0aCAqIGJpdG1hcC5oZWlnaHQgPiAwXG4gIH0pXG5cbiAgLy8gcHJvdmlkZSB2aXNpYmxlIGdseXBocyBmb3IgY29udmVuaWVuY2VcbiAgdGhpcy52aXNpYmxlR2x5cGhzID0gZ2x5cGhzXG5cbiAgLy8gZ2V0IGNvbW1vbiB2ZXJ0ZXggZGF0YVxuICB2YXIgcG9zaXRpb25zID0gdmVydGljZXMucG9zaXRpb25zKGdseXBocylcbiAgdmFyIHV2cyA9IHZlcnRpY2VzLnV2cyhnbHlwaHMsIHRleFdpZHRoLCB0ZXhIZWlnaHQsIGZsaXBZKVxuICB2YXIgaW5kaWNlcyA9IGNyZWF0ZUluZGljZXMoe1xuICAgIGNsb2Nrd2lzZTogdHJ1ZSxcbiAgICB0eXBlOiAndWludDE2JyxcbiAgICBjb3VudDogZ2x5cGhzLmxlbmd0aFxuICB9KVxuXG4gIC8vIHVwZGF0ZSB2ZXJ0ZXggZGF0YVxuICBidWZmZXIuaW5kZXgodGhpcywgaW5kaWNlcywgMSwgJ3VpbnQxNicpXG4gIGJ1ZmZlci5hdHRyKHRoaXMsICdwb3NpdGlvbicsIHBvc2l0aW9ucywgMilcbiAgYnVmZmVyLmF0dHIodGhpcywgJ3V2JywgdXZzLCAyKVxuXG4gIC8vIHVwZGF0ZSBtdWx0aXBhZ2UgZGF0YVxuICBpZiAoIW9wdC5tdWx0aXBhZ2UgJiYgJ3BhZ2UnIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIC8vIGRpc2FibGUgbXVsdGlwYWdlIHJlbmRlcmluZ1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdwYWdlJylcbiAgfSBlbHNlIGlmIChvcHQubXVsdGlwYWdlKSB7XG4gICAgdmFyIHBhZ2VzID0gdmVydGljZXMucGFnZXMoZ2x5cGhzKVxuICAgIC8vIGVuYWJsZSBtdWx0aXBhZ2UgcmVuZGVyaW5nXG4gICAgYnVmZmVyLmF0dHIodGhpcywgJ3BhZ2UnLCBwYWdlcywgMSlcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVCb3VuZGluZ1NwaGVyZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYm91bmRpbmdTcGhlcmUgPT09IG51bGwpIHtcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlID0gbmV3IFRIUkVFLlNwaGVyZSgpXG4gIH1cblxuICB2YXIgcG9zaXRpb25zID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5XG4gIHZhciBpdGVtU2l6ZSA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5pdGVtU2l6ZVxuICBpZiAoIXBvc2l0aW9ucyB8fCAhaXRlbVNpemUgfHwgcG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlLnJhZGl1cyA9IDBcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlLmNlbnRlci5zZXQoMCwgMCwgMClcbiAgICByZXR1cm5cbiAgfVxuICB1dGlscy5jb21wdXRlU3BoZXJlKHBvc2l0aW9ucywgdGhpcy5ib3VuZGluZ1NwaGVyZSlcbiAgaWYgKGlzTmFOKHRoaXMuYm91bmRpbmdTcGhlcmUucmFkaXVzKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1RIUkVFLkJ1ZmZlckdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpOiAnICtcbiAgICAgICdDb21wdXRlZCByYWRpdXMgaXMgTmFOLiBUaGUgJyArXG4gICAgICAnXCJwb3NpdGlvblwiIGF0dHJpYnV0ZSBpcyBsaWtlbHkgdG8gaGF2ZSBOYU4gdmFsdWVzLicpXG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS5jb21wdXRlQm91bmRpbmdCb3ggPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmJvdW5kaW5nQm94ID09PSBudWxsKSB7XG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IG5ldyBUSFJFRS5Cb3gzKClcbiAgfVxuXG4gIHZhciBiYm94ID0gdGhpcy5ib3VuZGluZ0JveFxuICB2YXIgcG9zaXRpb25zID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5XG4gIHZhciBpdGVtU2l6ZSA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5pdGVtU2l6ZVxuICBpZiAoIXBvc2l0aW9ucyB8fCAhaXRlbVNpemUgfHwgcG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICBiYm94Lm1ha2VFbXB0eSgpXG4gICAgcmV0dXJuXG4gIH1cbiAgdXRpbHMuY29tcHV0ZUJveChwb3NpdGlvbnMsIGJib3gpXG59XG4iLCJ2YXIgaXRlbVNpemUgPSAyXG52YXIgYm94ID0geyBtaW46IFswLCAwXSwgbWF4OiBbMCwgMF0gfVxuXG5mdW5jdGlvbiBib3VuZHMgKHBvc2l0aW9ucykge1xuICB2YXIgY291bnQgPSBwb3NpdGlvbnMubGVuZ3RoIC8gaXRlbVNpemVcbiAgYm94Lm1pblswXSA9IHBvc2l0aW9uc1swXVxuICBib3gubWluWzFdID0gcG9zaXRpb25zWzFdXG4gIGJveC5tYXhbMF0gPSBwb3NpdGlvbnNbMF1cbiAgYm94Lm1heFsxXSA9IHBvc2l0aW9uc1sxXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIHZhciB4ID0gcG9zaXRpb25zW2kgKiBpdGVtU2l6ZSArIDBdXG4gICAgdmFyIHkgPSBwb3NpdGlvbnNbaSAqIGl0ZW1TaXplICsgMV1cbiAgICBib3gubWluWzBdID0gTWF0aC5taW4oeCwgYm94Lm1pblswXSlcbiAgICBib3gubWluWzFdID0gTWF0aC5taW4oeSwgYm94Lm1pblsxXSlcbiAgICBib3gubWF4WzBdID0gTWF0aC5tYXgoeCwgYm94Lm1heFswXSlcbiAgICBib3gubWF4WzFdID0gTWF0aC5tYXgoeSwgYm94Lm1heFsxXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlQm94ID0gZnVuY3Rpb24gKHBvc2l0aW9ucywgb3V0cHV0KSB7XG4gIGJvdW5kcyhwb3NpdGlvbnMpXG4gIG91dHB1dC5taW4uc2V0KGJveC5taW5bMF0sIGJveC5taW5bMV0sIDApXG4gIG91dHB1dC5tYXguc2V0KGJveC5tYXhbMF0sIGJveC5tYXhbMV0sIDApXG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbXB1dGVTcGhlcmUgPSBmdW5jdGlvbiAocG9zaXRpb25zLCBvdXRwdXQpIHtcbiAgYm91bmRzKHBvc2l0aW9ucylcbiAgdmFyIG1pblggPSBib3gubWluWzBdXG4gIHZhciBtaW5ZID0gYm94Lm1pblsxXVxuICB2YXIgbWF4WCA9IGJveC5tYXhbMF1cbiAgdmFyIG1heFkgPSBib3gubWF4WzFdXG4gIHZhciB3aWR0aCA9IG1heFggLSBtaW5YXG4gIHZhciBoZWlnaHQgPSBtYXhZIC0gbWluWVxuICB2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHdpZHRoICogd2lkdGggKyBoZWlnaHQgKiBoZWlnaHQpXG4gIG91dHB1dC5jZW50ZXIuc2V0KG1pblggKyB3aWR0aCAvIDIsIG1pblkgKyBoZWlnaHQgLyAyLCAwKVxuICBvdXRwdXQucmFkaXVzID0gbGVuZ3RoIC8gMlxufVxuIiwibW9kdWxlLmV4cG9ydHMucGFnZXMgPSBmdW5jdGlvbiBwYWdlcyAoZ2x5cGhzKSB7XG4gIHZhciBwYWdlcyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAxKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGlkID0gZ2x5cGguZGF0YS5wYWdlIHx8IDBcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgfSlcbiAgcmV0dXJuIHBhZ2VzXG59XG5cbm1vZHVsZS5leHBvcnRzLnV2cyA9IGZ1bmN0aW9uIHV2cyAoZ2x5cGhzLCB0ZXhXaWR0aCwgdGV4SGVpZ2h0LCBmbGlwWSkge1xuICB2YXIgdXZzID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDIpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuICAgIHZhciBidyA9IChiaXRtYXAueCArIGJpdG1hcC53aWR0aClcbiAgICB2YXIgYmggPSAoYml0bWFwLnkgKyBiaXRtYXAuaGVpZ2h0KVxuXG4gICAgLy8gdG9wIGxlZnQgcG9zaXRpb25cbiAgICB2YXIgdTAgPSBiaXRtYXAueCAvIHRleFdpZHRoXG4gICAgdmFyIHYxID0gYml0bWFwLnkgLyB0ZXhIZWlnaHRcbiAgICB2YXIgdTEgPSBidyAvIHRleFdpZHRoXG4gICAgdmFyIHYwID0gYmggLyB0ZXhIZWlnaHRcblxuICAgIGlmIChmbGlwWSkge1xuICAgICAgdjEgPSAodGV4SGVpZ2h0IC0gYml0bWFwLnkpIC8gdGV4SGVpZ2h0XG4gICAgICB2MCA9ICh0ZXhIZWlnaHQgLSBiaCkgLyB0ZXhIZWlnaHRcbiAgICB9XG5cbiAgICAvLyBCTFxuICAgIHV2c1tpKytdID0gdTBcbiAgICB1dnNbaSsrXSA9IHYxXG4gICAgLy8gVExcbiAgICB1dnNbaSsrXSA9IHUwXG4gICAgdXZzW2krK10gPSB2MFxuICAgIC8vIFRSXG4gICAgdXZzW2krK10gPSB1MVxuICAgIHV2c1tpKytdID0gdjBcbiAgICAvLyBCUlxuICAgIHV2c1tpKytdID0gdTFcbiAgICB1dnNbaSsrXSA9IHYxXG4gIH0pXG4gIHJldHVybiB1dnNcbn1cblxubW9kdWxlLmV4cG9ydHMucG9zaXRpb25zID0gZnVuY3Rpb24gcG9zaXRpb25zIChnbHlwaHMpIHtcbiAgdmFyIHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAyKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcblxuICAgIC8vIGJvdHRvbSBsZWZ0IHBvc2l0aW9uXG4gICAgdmFyIHggPSBnbHlwaC5wb3NpdGlvblswXSArIGJpdG1hcC54b2Zmc2V0XG4gICAgdmFyIHkgPSBnbHlwaC5wb3NpdGlvblsxXSArIGJpdG1hcC55b2Zmc2V0XG5cbiAgICAvLyBxdWFkIHNpemVcbiAgICB2YXIgdyA9IGJpdG1hcC53aWR0aFxuICAgIHZhciBoID0gYml0bWFwLmhlaWdodFxuXG4gICAgLy8gQkxcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHhcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHlcbiAgICAvLyBUTFxuICAgIHBvc2l0aW9uc1tpKytdID0geFxuICAgIHBvc2l0aW9uc1tpKytdID0geSArIGhcbiAgICAvLyBUUlxuICAgIHBvc2l0aW9uc1tpKytdID0geCArIHdcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHkgKyBoXG4gICAgLy8gQlJcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHggKyB3XG4gICAgcG9zaXRpb25zW2krK10gPSB5XG4gIH0pXG4gIHJldHVybiBwb3NpdGlvbnNcbn1cbiIsInZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTREZTaGFkZXIgKG9wdCkge1xuICBvcHQgPSBvcHQgfHwge31cbiAgdmFyIG9wYWNpdHkgPSB0eXBlb2Ygb3B0Lm9wYWNpdHkgPT09ICdudW1iZXInID8gb3B0Lm9wYWNpdHkgOiAxXG4gIHZhciBhbHBoYVRlc3QgPSB0eXBlb2Ygb3B0LmFscGhhVGVzdCA9PT0gJ251bWJlcicgPyBvcHQuYWxwaGFUZXN0IDogMC4wMDAxXG4gIHZhciBwcmVjaXNpb24gPSBvcHQucHJlY2lzaW9uIHx8ICdoaWdocCdcbiAgdmFyIGNvbG9yID0gb3B0LmNvbG9yXG4gIHZhciBtYXAgPSBvcHQubWFwXG5cbiAgLy8gcmVtb3ZlIHRvIHNhdGlzZnkgcjczXG4gIGRlbGV0ZSBvcHQubWFwXG4gIGRlbGV0ZSBvcHQuY29sb3JcbiAgZGVsZXRlIG9wdC5wcmVjaXNpb25cbiAgZGVsZXRlIG9wdC5vcGFjaXR5XG5cbiAgcmV0dXJuIGFzc2lnbih7XG4gICAgdW5pZm9ybXM6IHtcbiAgICAgIG9wYWNpdHk6IHsgdHlwZTogJ2YnLCB2YWx1ZTogb3BhY2l0eSB9LFxuICAgICAgbWFwOiB7IHR5cGU6ICd0JywgdmFsdWU6IG1hcCB8fCBuZXcgVEhSRUUuVGV4dHVyZSgpIH0sXG4gICAgICBjb2xvcjogeyB0eXBlOiAnYycsIHZhbHVlOiBuZXcgVEhSRUUuQ29sb3IoY29sb3IpIH1cbiAgICB9LFxuICAgIHZlcnRleFNoYWRlcjogW1xuICAgICAgJ2F0dHJpYnV0ZSB2ZWMyIHV2OycsXG4gICAgICAnYXR0cmlidXRlIHZlYzQgcG9zaXRpb247JyxcbiAgICAgICd1bmlmb3JtIG1hdDQgcHJvamVjdGlvbk1hdHJpeDsnLFxuICAgICAgJ3VuaWZvcm0gbWF0NCBtb2RlbFZpZXdNYXRyaXg7JyxcbiAgICAgICd2YXJ5aW5nIHZlYzIgdlV2OycsXG4gICAgICAndm9pZCBtYWluKCkgeycsXG4gICAgICAndlV2ID0gdXY7JyxcbiAgICAgICdnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiBwb3NpdGlvbjsnLFxuICAgICAgJ30nXG4gICAgXS5qb2luKCdcXG4nKSxcbiAgICBmcmFnbWVudFNoYWRlcjogW1xuICAgICAgJyNpZmRlZiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgJyNleHRlbnNpb24gR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzIDogZW5hYmxlJyxcbiAgICAgICcjZW5kaWYnLFxuICAgICAgJ3ByZWNpc2lvbiAnICsgcHJlY2lzaW9uICsgJyBmbG9hdDsnLFxuICAgICAgJ3VuaWZvcm0gZmxvYXQgb3BhY2l0eTsnLFxuICAgICAgJ3VuaWZvcm0gdmVjMyBjb2xvcjsnLFxuICAgICAgJ3VuaWZvcm0gc2FtcGxlcjJEIG1hcDsnLFxuICAgICAgJ3ZhcnlpbmcgdmVjMiB2VXY7JyxcblxuICAgICAgJ2Zsb2F0IGFhc3RlcChmbG9hdCB2YWx1ZSkgeycsXG4gICAgICAnICAjaWZkZWYgR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcbiAgICAgICcgICAgZmxvYXQgYWZ3aWR0aCA9IGxlbmd0aCh2ZWMyKGRGZHgodmFsdWUpLCBkRmR5KHZhbHVlKSkpICogMC43MDcxMDY3ODExODY1NDc1NzsnLFxuICAgICAgJyAgI2Vsc2UnLFxuICAgICAgJyAgICBmbG9hdCBhZndpZHRoID0gKDEuMCAvIDMyLjApICogKDEuNDE0MjEzNTYyMzczMDk1MSAvICgyLjAgKiBnbF9GcmFnQ29vcmQudykpOycsXG4gICAgICAnICAjZW5kaWYnLFxuICAgICAgJyAgcmV0dXJuIHNtb290aHN0ZXAoMC41IC0gYWZ3aWR0aCwgMC41ICsgYWZ3aWR0aCwgdmFsdWUpOycsXG4gICAgICAnfScsXG5cbiAgICAgICd2b2lkIG1haW4oKSB7JyxcbiAgICAgICcgIHZlYzQgdGV4Q29sb3IgPSB0ZXh0dXJlMkQobWFwLCB2VXYpOycsXG4gICAgICAnICBmbG9hdCBhbHBoYSA9IGFhc3RlcCh0ZXhDb2xvci5hKTsnLFxuICAgICAgJyAgZ2xfRnJhZ0NvbG9yID0gdmVjNChjb2xvciwgb3BhY2l0eSAqIGFscGhhKTsnLFxuICAgICAgYWxwaGFUZXN0ID09PSAwXG4gICAgICAgID8gJydcbiAgICAgICAgOiAnICBpZiAoZ2xfRnJhZ0NvbG9yLmEgPCAnICsgYWxwaGFUZXN0ICsgJykgZGlzY2FyZDsnLFxuICAgICAgJ30nXG4gICAgXS5qb2luKCdcXG4nKVxuICB9LCBvcHQpXG59XG4iLCJ2YXIgZmxhdHRlbiA9IHJlcXVpcmUoJ2ZsYXR0ZW4tdmVydGV4LWRhdGEnKVxudmFyIHdhcm5lZCA9IGZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cy5hdHRyID0gc2V0QXR0cmlidXRlXG5tb2R1bGUuZXhwb3J0cy5pbmRleCA9IHNldEluZGV4XG5cbmZ1bmN0aW9uIHNldEluZGV4IChnZW9tZXRyeSwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGlmICh0eXBlb2YgaXRlbVNpemUgIT09ICdudW1iZXInKSBpdGVtU2l6ZSA9IDFcbiAgaWYgKHR5cGVvZiBkdHlwZSAhPT0gJ3N0cmluZycpIGR0eXBlID0gJ3VpbnQxNidcblxuICB2YXIgaXNSNjkgPSAhZ2VvbWV0cnkuaW5kZXggJiYgdHlwZW9mIGdlb21ldHJ5LnNldEluZGV4ICE9PSAnZnVuY3Rpb24nXG4gIHZhciBhdHRyaWIgPSBpc1I2OSA/IGdlb21ldHJ5LmdldEF0dHJpYnV0ZSgnaW5kZXgnKSA6IGdlb21ldHJ5LmluZGV4XG4gIHZhciBuZXdBdHRyaWIgPSB1cGRhdGVBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpXG4gIGlmIChuZXdBdHRyaWIpIHtcbiAgICBpZiAoaXNSNjkpIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSgnaW5kZXgnLCBuZXdBdHRyaWIpXG4gICAgZWxzZSBnZW9tZXRyeS5pbmRleCA9IG5ld0F0dHJpYlxuICB9XG59XG5cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZSAoZ2VvbWV0cnksIGtleSwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGlmICh0eXBlb2YgaXRlbVNpemUgIT09ICdudW1iZXInKSBpdGVtU2l6ZSA9IDNcbiAgaWYgKHR5cGVvZiBkdHlwZSAhPT0gJ3N0cmluZycpIGR0eXBlID0gJ2Zsb2F0MzInXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmXG4gICAgQXJyYXkuaXNBcnJheShkYXRhWzBdKSAmJlxuICAgIGRhdGFbMF0ubGVuZ3RoICE9PSBpdGVtU2l6ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTmVzdGVkIHZlcnRleCBhcnJheSBoYXMgdW5leHBlY3RlZCBzaXplOyBleHBlY3RlZCAnICtcbiAgICAgIGl0ZW1TaXplICsgJyBidXQgZm91bmQgJyArIGRhdGFbMF0ubGVuZ3RoKVxuICB9XG5cbiAgdmFyIGF0dHJpYiA9IGdlb21ldHJ5LmdldEF0dHJpYnV0ZShrZXkpXG4gIHZhciBuZXdBdHRyaWIgPSB1cGRhdGVBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpXG4gIGlmIChuZXdBdHRyaWIpIHtcbiAgICBnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoa2V5LCBuZXdBdHRyaWIpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQXR0cmlidXRlIChhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBkYXRhID0gZGF0YSB8fCBbXVxuICBpZiAoIWF0dHJpYiB8fCByZWJ1aWxkQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUpKSB7XG4gICAgLy8gY3JlYXRlIGEgbmV3IGFycmF5IHdpdGggZGVzaXJlZCB0eXBlXG4gICAgZGF0YSA9IGZsYXR0ZW4oZGF0YSwgZHR5cGUpXG4gICAgaWYgKGF0dHJpYiAmJiAhd2FybmVkKSB7XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS53YXJuKFtcbiAgICAgICAgJ0EgV2ViR0wgYnVmZmVyIGlzIGJlaW5nIHVwZGF0ZWQgd2l0aCBhIG5ldyBzaXplIG9yIGl0ZW1TaXplLCAnLFxuICAgICAgICAnaG93ZXZlciBUaHJlZUpTIG9ubHkgc3VwcG9ydHMgZml4ZWQtc2l6ZSBidWZmZXJzLlxcblRoZSBvbGQgYnVmZmVyIG1heSAnLFxuICAgICAgICAnc3RpbGwgYmUga2VwdCBpbiBtZW1vcnkuXFxuJyxcbiAgICAgICAgJ1RvIGF2b2lkIG1lbW9yeSBsZWFrcywgaXQgaXMgcmVjb21tZW5kZWQgdGhhdCB5b3UgZGlzcG9zZSAnLFxuICAgICAgICAneW91ciBnZW9tZXRyaWVzIGFuZCBjcmVhdGUgbmV3IG9uZXMsIG9yIHN1cHBvcnQgdGhlIGZvbGxvd2luZyBQUiBpbiBUaHJlZUpTOlxcbicsXG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL3B1bGwvOTYzMSdcbiAgICAgIF0uam9pbignJykpO1xuICAgIH1cbiAgICBhdHRyaWIgPSBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKGRhdGEsIGl0ZW1TaXplKVxuICAgIGF0dHJpYi5uZWVkc1VwZGF0ZSA9IHRydWVcbiAgICByZXR1cm4gYXR0cmliXG4gIH0gZWxzZSB7XG4gICAgLy8gY29weSBkYXRhIGludG8gdGhlIGV4aXN0aW5nIGFycmF5XG4gICAgZmxhdHRlbihkYXRhLCBhdHRyaWIuYXJyYXkpXG4gICAgYXR0cmliLm5lZWRzVXBkYXRlID0gdHJ1ZVxuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuLy8gVGVzdCB3aGV0aGVyIHRoZSBhdHRyaWJ1dGUgbmVlZHMgdG8gYmUgcmUtY3JlYXRlZCxcbi8vIHJldHVybnMgZmFsc2UgaWYgd2UgY2FuIHJlLXVzZSBpdCBhcy1pcy5cbmZ1bmN0aW9uIHJlYnVpbGRBdHRyaWJ1dGUgKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUpIHtcbiAgaWYgKGF0dHJpYi5pdGVtU2l6ZSAhPT0gaXRlbVNpemUpIHJldHVybiB0cnVlXG4gIGlmICghYXR0cmliLmFycmF5KSByZXR1cm4gdHJ1ZVxuICB2YXIgYXR0cmliTGVuZ3RoID0gYXR0cmliLmFycmF5Lmxlbmd0aFxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBBcnJheS5pc0FycmF5KGRhdGFbMF0pKSB7XG4gICAgLy8gWyBbIHgsIHksIHogXSBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGggKiBpdGVtU2l6ZVxuICB9IGVsc2Uge1xuICAgIC8vIFsgeCwgeSwgeiBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGhcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cbiIsInZhciBuZXdsaW5lID0gL1xcbi9cbnZhciBuZXdsaW5lQ2hhciA9ICdcXG4nXG52YXIgd2hpdGVzcGFjZSA9IC9cXHMvXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XG4gICAgdmFyIGxpbmVzID0gbW9kdWxlLmV4cG9ydHMubGluZXModGV4dCwgb3B0KVxuICAgIHJldHVybiBsaW5lcy5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICByZXR1cm4gdGV4dC5zdWJzdHJpbmcobGluZS5zdGFydCwgbGluZS5lbmQpXG4gICAgfSkuam9pbignXFxuJylcbn1cblxubW9kdWxlLmV4cG9ydHMubGluZXMgPSBmdW5jdGlvbiB3b3Jkd3JhcCh0ZXh0LCBvcHQpIHtcbiAgICBvcHQgPSBvcHR8fHt9XG5cbiAgICAvL3plcm8gd2lkdGggcmVzdWx0cyBpbiBub3RoaW5nIHZpc2libGVcbiAgICBpZiAob3B0LndpZHRoID09PSAwICYmIG9wdC5tb2RlICE9PSAnbm93cmFwJykgXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgdGV4dCA9IHRleHR8fCcnXG4gICAgdmFyIHdpZHRoID0gdHlwZW9mIG9wdC53aWR0aCA9PT0gJ251bWJlcicgPyBvcHQud2lkdGggOiBOdW1iZXIuTUFYX1ZBTFVFXG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5tYXgoMCwgb3B0LnN0YXJ0fHwwKVxuICAgIHZhciBlbmQgPSB0eXBlb2Ygb3B0LmVuZCA9PT0gJ251bWJlcicgPyBvcHQuZW5kIDogdGV4dC5sZW5ndGhcbiAgICB2YXIgbW9kZSA9IG9wdC5tb2RlXG5cbiAgICB2YXIgbWVhc3VyZSA9IG9wdC5tZWFzdXJlIHx8IG1vbm9zcGFjZVxuICAgIGlmIChtb2RlID09PSAncHJlJylcbiAgICAgICAgcmV0dXJuIHByZShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aClcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBncmVlZHkobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgsIG1vZGUpXG59XG5cbmZ1bmN0aW9uIGlkeE9mKHRleHQsIGNociwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBpZHggPSB0ZXh0LmluZGV4T2YoY2hyLCBzdGFydClcbiAgICBpZiAoaWR4ID09PSAtMSB8fCBpZHggPiBlbmQpXG4gICAgICAgIHJldHVybiBlbmRcbiAgICByZXR1cm4gaWR4XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjaHIpIHtcbiAgICByZXR1cm4gd2hpdGVzcGFjZS50ZXN0KGNocilcbn1cblxuZnVuY3Rpb24gcHJlKG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGxpbmVzID0gW11cbiAgICB2YXIgbGluZVN0YXJ0ID0gc3RhcnRcbiAgICBmb3IgKHZhciBpPXN0YXJ0OyBpPGVuZCAmJiBpPHRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNociA9IHRleHQuY2hhckF0KGkpXG4gICAgICAgIHZhciBpc05ld2xpbmUgPSBuZXdsaW5lLnRlc3QoY2hyKVxuXG4gICAgICAgIC8vSWYgd2UndmUgcmVhY2hlZCBhIG5ld2xpbmUsIHRoZW4gc3RlcCBkb3duIGEgbGluZVxuICAgICAgICAvL09yIGlmIHdlJ3ZlIHJlYWNoZWQgdGhlIEVPRlxuICAgICAgICBpZiAoaXNOZXdsaW5lIHx8IGk9PT1lbmQtMSkge1xuICAgICAgICAgICAgdmFyIGxpbmVFbmQgPSBpc05ld2xpbmUgPyBpIDogaSsxXG4gICAgICAgICAgICB2YXIgbWVhc3VyZWQgPSBtZWFzdXJlKHRleHQsIGxpbmVTdGFydCwgbGluZUVuZCwgd2lkdGgpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKG1lYXN1cmVkKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsaW5lU3RhcnQgPSBpKzFcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGluZXNcbn1cblxuZnVuY3Rpb24gZ3JlZWR5KG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoLCBtb2RlKSB7XG4gICAgLy9BIGdyZWVkeSB3b3JkIHdyYXBwZXIgYmFzZWQgb24gTGliR0RYIGFsZ29yaXRobVxuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2xpYmdkeC9saWJnZHgvYmxvYi9tYXN0ZXIvZ2R4L3NyYy9jb20vYmFkbG9naWMvZ2R4L2dyYXBoaWNzL2cyZC9CaXRtYXBGb250Q2FjaGUuamF2YVxuICAgIHZhciBsaW5lcyA9IFtdXG5cbiAgICB2YXIgdGVzdFdpZHRoID0gd2lkdGhcbiAgICAvL2lmICdub3dyYXAnIGlzIHNwZWNpZmllZCwgd2Ugb25seSB3cmFwIG9uIG5ld2xpbmUgY2hhcnNcbiAgICBpZiAobW9kZSA9PT0gJ25vd3JhcCcpXG4gICAgICAgIHRlc3RXaWR0aCA9IE51bWJlci5NQVhfVkFMVUVcblxuICAgIHdoaWxlIChzdGFydCA8IGVuZCAmJiBzdGFydCA8IHRleHQubGVuZ3RoKSB7XG4gICAgICAgIC8vZ2V0IG5leHQgbmV3bGluZSBwb3NpdGlvblxuICAgICAgICB2YXIgbmV3TGluZSA9IGlkeE9mKHRleHQsIG5ld2xpbmVDaGFyLCBzdGFydCwgZW5kKVxuXG4gICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgc3RhcnQgb2YgbGluZVxuICAgICAgICB3aGlsZSAoc3RhcnQgPCBuZXdMaW5lKSB7XG4gICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZSggdGV4dC5jaGFyQXQoc3RhcnQpICkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIHN0YXJ0KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZGV0ZXJtaW5lIHZpc2libGUgIyBvZiBnbHlwaHMgZm9yIHRoZSBhdmFpbGFibGUgd2lkdGhcbiAgICAgICAgdmFyIG1lYXN1cmVkID0gbWVhc3VyZSh0ZXh0LCBzdGFydCwgbmV3TGluZSwgdGVzdFdpZHRoKVxuXG4gICAgICAgIHZhciBsaW5lRW5kID0gc3RhcnQgKyAobWVhc3VyZWQuZW5kLW1lYXN1cmVkLnN0YXJ0KVxuICAgICAgICB2YXIgbmV4dFN0YXJ0ID0gbGluZUVuZCArIG5ld2xpbmVDaGFyLmxlbmd0aFxuXG4gICAgICAgIC8vaWYgd2UgaGFkIHRvIGN1dCB0aGUgbGluZSBiZWZvcmUgdGhlIG5leHQgbmV3bGluZS4uLlxuICAgICAgICBpZiAobGluZUVuZCA8IG5ld0xpbmUpIHtcbiAgICAgICAgICAgIC8vZmluZCBjaGFyIHRvIGJyZWFrIG9uXG4gICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzV2hpdGVzcGFjZSh0ZXh0LmNoYXJBdChsaW5lRW5kKSkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgbGluZUVuZC0tXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGluZUVuZCA9PT0gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFN0YXJ0ID4gc3RhcnQgKyBuZXdsaW5lQ2hhci5sZW5ndGgpIG5leHRTdGFydC0tXG4gICAgICAgICAgICAgICAgbGluZUVuZCA9IG5leHRTdGFydCAvLyBJZiBubyBjaGFyYWN0ZXJzIHRvIGJyZWFrLCBzaG93IGFsbC5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dFN0YXJ0ID0gbGluZUVuZFxuICAgICAgICAgICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgZW5kIG9mIGxpbmVcbiAgICAgICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNXaGl0ZXNwYWNlKHRleHQuY2hhckF0KGxpbmVFbmQgLSBuZXdsaW5lQ2hhci5sZW5ndGgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGxpbmVFbmQtLVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobGluZUVuZCA+PSBzdGFydCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1lYXN1cmUodGV4dCwgc3RhcnQsIGxpbmVFbmQsIHRlc3RXaWR0aClcbiAgICAgICAgICAgIGxpbmVzLnB1c2gocmVzdWx0KVxuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ID0gbmV4dFN0YXJ0XG4gICAgfVxuICAgIHJldHVybiBsaW5lc1xufVxuXG4vL2RldGVybWluZXMgdGhlIHZpc2libGUgbnVtYmVyIG9mIGdseXBocyB3aXRoaW4gYSBnaXZlbiB3aWR0aFxuZnVuY3Rpb24gbW9ub3NwYWNlKHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGdseXBocyA9IE1hdGgubWluKHdpZHRoLCBlbmQtc3RhcnQpXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICBlbmQ6IHN0YXJ0K2dseXBoc1xuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIl19
