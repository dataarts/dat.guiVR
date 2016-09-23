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

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":12,"./textlabel":14}],3:[function(require,module,exports){
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

},{"./button":1,"./checkbox":2,"./dropdown":4,"./folder":5,"./font":6,"./sdftext":11,"./slider":13,"events":15}],9:[function(require,module,exports){
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

},{"events":15}],10:[function(require,module,exports){
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

},{"./font":6,"parse-bmfont-ascii":17,"three-bmfont-text":18,"three-bmfont-text/shaders/sdf":34}],12:[function(require,module,exports){
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

},{"./colors":3,"./sharedmaterials":12}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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

},{"./lib/utils":19,"./lib/vertices":20,"inherits":21,"layout-bmfont-text":22,"object-assign":16,"quad-indices":27,"three-buffer-vertex-data":31}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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
},{"as-number":23,"indexof-property":24,"word-wrapper":25,"xtend":26}],23:[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{"an-array":28,"dtype":29,"is-buffer":30}],28:[function(require,module,exports){
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{"flatten-vertex-data":32}],32:[function(require,module,exports){
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

},{"dtype":33}],33:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],34:[function(require,module,exports){
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

},{"object-assign":16}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL2RhdGd1aXZyL2J1dHRvbi5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvY2hlY2tib3guanMiLCJtb2R1bGVzL2RhdGd1aXZyL2NvbG9ycy5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZHJvcGRvd24uanMiLCJtb2R1bGVzL2RhdGd1aXZyL2ZvbGRlci5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZm9udC5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZ3JhYi5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvaW5kZXguanMiLCJtb2R1bGVzL2RhdGd1aXZyL2ludGVyYWN0aW9uLmpzIiwibW9kdWxlcy9kYXRndWl2ci9sYXlvdXQuanMiLCJtb2R1bGVzL2RhdGd1aXZyL3NkZnRleHQuanMiLCJtb2R1bGVzL2RhdGd1aXZyL3NoYXJlZG1hdGVyaWFscy5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvc2xpZGVyLmpzIiwibW9kdWxlcy9kYXRndWl2ci90ZXh0bGFiZWwuanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlLWJtZm9udC1hc2NpaS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9saWIvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbGliL3ZlcnRpY2VzLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9sYXlvdXQtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9ub2RlX21vZHVsZXMvYXMtbnVtYmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9sYXlvdXQtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL2luZGV4b2YtcHJvcGVydHkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9ub2RlX21vZHVsZXMvd29yZC13cmFwcGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9sYXlvdXQtYm1mb250LXRleHQvbm9kZV9tb2R1bGVzL3h0ZW5kL2ltbXV0YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9ub2RlX21vZHVsZXMvcXVhZC1pbmRpY2VzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvbm9kZV9tb2R1bGVzL2FuLWFycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvbm9kZV9tb2R1bGVzL2R0eXBlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvbm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9ub2RlX21vZHVsZXMvdGhyZWUtYnVmZmVyLXZlcnRleC1kYXRhL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L25vZGVfbW9kdWxlcy90aHJlZS1idWZmZXItdmVydGV4LWRhdGEvbm9kZV9tb2R1bGVzL2ZsYXR0ZW4tdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvc2hhZGVycy9zZGYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkMwQndCLGM7O0FBUHhCOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWSxNOztBQUNaOztJQUFZLE07O0FBQ1o7O0lBQVksZTs7QUFDWjs7SUFBWSxJOzs7Ozs7QUF4Qlo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQmUsU0FBUyxjQUFULEdBT1A7QUFBQSxtRUFBSixFQUFJOztBQUFBLE1BTk4sV0FNTSxRQU5OLFdBTU07QUFBQSxNQUxOLE1BS00sUUFMTixNQUtNO0FBQUEsK0JBSk4sWUFJTTtBQUFBLE1BSk4sWUFJTSxxQ0FKUyxXQUlUO0FBQUEsd0JBSE4sS0FHTTtBQUFBLE1BSE4sS0FHTSw4QkFIRSxPQUFPLFdBR1Q7QUFBQSx5QkFGTixNQUVNO0FBQUEsTUFGTixNQUVNLCtCQUZHLE9BQU8sWUFFVjtBQUFBLHdCQUROLEtBQ007QUFBQSxNQUROLEtBQ00sOEJBREUsT0FBTyxXQUNUOzs7QUFFTixNQUFNLGVBQWUsUUFBUSxHQUFSLEdBQWMsT0FBTyxZQUExQztBQUNBLE1BQU0sZ0JBQWdCLFNBQVMsT0FBTyxZQUF0QztBQUNBLE1BQU0sZUFBZSxLQUFyQjs7QUFFQSxNQUFNLFFBQVEsSUFBSSxNQUFNLEtBQVYsRUFBZDs7QUFFQSxNQUFNLFFBQVEsT0FBTyxXQUFQLENBQW9CLEtBQXBCLEVBQTJCLE1BQTNCLEVBQW1DLEtBQW5DLENBQWQ7QUFDQSxRQUFNLEdBQU4sQ0FBVyxLQUFYOztBQUVBO0FBQ0EsTUFBTSxPQUFPLElBQUksTUFBTSxXQUFWLENBQXVCLFlBQXZCLEVBQXFDLGFBQXJDLEVBQW9ELFlBQXBELENBQWI7QUFDQSxPQUFLLFNBQUwsQ0FBZ0IsZUFBZSxHQUEvQixFQUFvQyxDQUFwQyxFQUF1QyxDQUF2Qzs7QUFFQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qIFxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKiBcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKiBcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KCB7XG4gIHRleHRDcmVhdG9yLFxuICBvYmplY3QsXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEhcbn0gPSB7fSApe1xuXG4gIGNvbnN0IEJVVFRPTl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcbiAgY29uc3QgQlVUVE9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IEJVVFRPTl9ERVBUSCA9IGRlcHRoO1xuXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG5cbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcblxuICAvLyAgYmFzZSBjaGVja2JveFxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBCVVRUT05fV0lEVEgsIEJVVFRPTl9IRUlHSFQsIEJVVFRPTl9ERVBUSCApO1xuICByZWN0LnRyYW5zbGF0ZSggQlVUVE9OX1dJRFRIICogMC41LCAwLCAwICk7XG5cbiAgLy8gIGhpdHNjYW4gdm9sdW1lXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xuICBoaXRzY2FuTWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlO1xuXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gZGVwdGg7XG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xuXG4gIC8vICBvdXRsaW5lIHZvbHVtZVxuICBjb25zdCBvdXRsaW5lID0gbmV3IFRIUkVFLkJveEhlbHBlciggaGl0c2NhblZvbHVtZSApO1xuICBvdXRsaW5lLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLk9VVExJTkVfQ09MT1IgKTtcblxuICAvLyAgY2hlY2tib3ggdm9sdW1lXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5ERUZBVUxUX0NPTE9SLCBlbWlzc2l2ZTogQ29sb3JzLkVNSVNTSVZFX0NPTE9SIH0pO1xuICBjb25zdCBmaWxsZWRWb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBtYXRlcmlhbCApO1xuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XG5cblxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcblxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX0JVVFRPTiApO1xuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xuXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBvdXRsaW5lLCBjb250cm9sbGVySUQgKTtcblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcblxuICB1cGRhdGVWaWV3KCk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlT25QcmVzcygpe1xuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcblxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQ09MT1IgKTtcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9FTUlTU0lWRV9DT0xPUiApO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgbWF0ZXJpYWwuZW1pc3NpdmUuc2V0SGV4KCBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgKTtcblxuICAgICAgaWYoIHN0YXRlLnZhbHVlICl7XG4gICAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfQ09MT1IgKTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLklOQUNUSVZFX0NPTE9SICk7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICBncm91cC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xuXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XG5cbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgdXBkYXRlVmlldygpO1xuICB9O1xuXG5cbiAgcmV0dXJuIGdyb3VwO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qIFxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKiBcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKiBcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KCB7XG4gIHRleHRDcmVhdG9yLFxuICBvYmplY3QsXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxuICBpbml0aWFsVmFsdWUgPSBmYWxzZSxcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXG59ID0ge30gKXtcblxuICBjb25zdCBDSEVDS0JPWF9XSURUSCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IENIRUNLQk9YX0hFSUdIVCA9IENIRUNLQk9YX1dJRFRIO1xuICBjb25zdCBDSEVDS0JPWF9ERVBUSCA9IGRlcHRoO1xuXG4gIGNvbnN0IElOQUNUSVZFX1NDQUxFID0gMC4wMDE7XG4gIGNvbnN0IEFDVElWRV9TQ0FMRSA9IDAuOTtcblxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICB2YWx1ZTogaW5pdGlhbFZhbHVlLFxuICAgIGxpc3RlbjogZmFsc2VcbiAgfTtcblxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xuICBncm91cC5hZGQoIHBhbmVsICk7XG5cbiAgLy8gIGJhc2UgY2hlY2tib3hcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQ0hFQ0tCT1hfV0lEVEgsIENIRUNLQk9YX0hFSUdIVCwgQ0hFQ0tCT1hfREVQVEggKTtcbiAgcmVjdC50cmFuc2xhdGUoIENIRUNLQk9YX1dJRFRIICogMC41LCAwLCAwICk7XG5cblxuICAvLyAgaGl0c2NhbiB2b2x1bWVcbiAgY29uc3QgaGl0c2Nhbk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XG5cbiAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aDtcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XG5cbiAgLy8gIG91dGxpbmUgdm9sdW1lXG4gIGNvbnN0IG91dGxpbmUgPSBuZXcgVEhSRUUuQm94SGVscGVyKCBoaXRzY2FuVm9sdW1lICk7XG4gIG91dGxpbmUubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuT1VUTElORV9DT0xPUiApO1xuXG4gIC8vICBjaGVja2JveCB2b2x1bWVcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogQ29sb3JzLkRFRkFVTFRfQ09MT1IsIGVtaXNzaXZlOiBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgfSk7XG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XG4gIGZpbGxlZFZvbHVtZS5zY2FsZS5zZXQoIEFDVElWRV9TQ0FMRSwgQUNUSVZFX1NDQUxFLEFDVElWRV9TQ0FMRSApO1xuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XG5cblxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcblxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX0NIRUNLQk9YICk7XG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XG5cbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIG91dGxpbmUsIGNvbnRyb2xsZXJJRCApO1xuXG4gIC8vIGdyb3VwLmFkZCggZmlsbGVkVm9sdW1lLCBvdXRsaW5lLCBoaXRzY2FuVm9sdW1lLCBkZXNjcmlwdG9yTGFiZWwgKTtcblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcblxuICB1cGRhdGVWaWV3KCk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlT25QcmVzcygpe1xuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN0YXRlLnZhbHVlID0gIXN0YXRlLnZhbHVlO1xuXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IHN0YXRlLnZhbHVlO1xuXG4gICAgaWYoIG9uQ2hhbmdlZENCICl7XG4gICAgICBvbkNoYW5nZWRDQiggc3RhdGUudmFsdWUgKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XG5cbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkVNSVNTSVZFX0NPTE9SICk7XG5cbiAgICAgIGlmKCBzdGF0ZS52YWx1ZSApe1xuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0NPTE9SICk7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5JTkFDVElWRV9DT0xPUiApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmKCBzdGF0ZS52YWx1ZSApe1xuICAgICAgZmlsbGVkVm9sdW1lLnNjYWxlLnNldCggQUNUSVZFX1NDQUxFLCBBQ1RJVkVfU0NBTEUsIEFDVElWRV9TQ0FMRSApO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgZmlsbGVkVm9sdW1lLnNjYWxlLnNldCggSU5BQ1RJVkVfU0NBTEUsIElOQUNUSVZFX1NDQUxFLCBJTkFDVElWRV9TQ0FMRSApO1xuICAgIH1cblxuICB9XG5cbiAgbGV0IG9uQ2hhbmdlZENCO1xuICBsZXQgb25GaW5pc2hDaGFuZ2VDQjtcblxuICBncm91cC5vbkNoYW5nZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xuICAgIG9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGdyb3VwLmludGVyYWN0aW9uID0gaW50ZXJhY3Rpb247XG4gIGdyb3VwLmhpdHNjYW4gPSBbIGhpdHNjYW5Wb2x1bWUsIHBhbmVsIF07XG5cbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcblxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xuICAgIHN0YXRlLmxpc3RlbiA9IHRydWU7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcbiAgICBpZiggc3RhdGUubGlzdGVuICl7XG4gICAgICBzdGF0ZS52YWx1ZSA9IG9iamVjdFsgcHJvcGVydHlOYW1lIF07XG4gICAgfVxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgdXBkYXRlVmlldygpO1xuICB9O1xuXG5cbiAgcmV0dXJuIGdyb3VwO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qIFxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKiBcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKiBcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ09MT1IgPSAweDJGQTFENjtcbmV4cG9ydCBjb25zdCBISUdITElHSFRfQ09MT1IgPSAweDBGQzNGRjtcbmV4cG9ydCBjb25zdCBJTlRFUkFDVElPTl9DT0xPUiA9IDB4MDdBQkY3O1xuZXhwb3J0IGNvbnN0IEVNSVNTSVZFX0NPTE9SID0gMHgyMjIyMjI7XG5leHBvcnQgY29uc3QgSElHSExJR0hUX0VNSVNTSVZFX0NPTE9SID0gMHg5OTk5OTk7XG5leHBvcnQgY29uc3QgT1VUTElORV9DT0xPUiA9IDB4OTk5OTk5O1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQkFDSyA9IDB4MTMxMzEzXG5leHBvcnQgY29uc3QgSElHSExJR0hUX0JBQ0sgPSAweDQ5NDk0OTtcbmV4cG9ydCBjb25zdCBJTkFDVElWRV9DT0xPUiA9IDB4MTYxODI5O1xuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfU0xJREVSID0gMHgyZmExZDY7XG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9DSEVDS0JPWCA9IDB4ODA2Nzg3O1xuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfQlVUVE9OID0gMHhlNjFkNWY7XG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9URVhUID0gMHgxZWQzNmY7XG5leHBvcnQgY29uc3QgRFJPUERPV05fQkdfQ09MT1IgPSAweGZmZmZmZjtcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9GR19DT0xPUiA9IDB4MDAwMDAwO1xuXG5leHBvcnQgZnVuY3Rpb24gY29sb3JpemVHZW9tZXRyeSggZ2VvbWV0cnksIGNvbG9yICl7XG4gIGdlb21ldHJ5LmZhY2VzLmZvckVhY2goIGZ1bmN0aW9uKGZhY2Upe1xuICAgIGZhY2UuY29sb3Iuc2V0SGV4KGNvbG9yKTtcbiAgfSk7XG4gIGdlb21ldHJ5LmNvbG9yc05lZWRVcGRhdGUgPSB0cnVlO1xuICByZXR1cm4gZ2VvbWV0cnk7XG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbiogXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qIFxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qIFxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ2hlY2tib3goIHtcbiAgdGV4dENyZWF0b3IsXG4gIG9iamVjdCxcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXG4gIGluaXRpYWxWYWx1ZSA9IGZhbHNlLFxuICBvcHRpb25zID0gW10sXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxufSA9IHt9ICl7XG5cblxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBvcGVuOiBmYWxzZSxcbiAgICBsaXN0ZW46IGZhbHNlXG4gIH07XG5cbiAgY29uc3QgRFJPUERPV05fV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IERST1BET1dOX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IERST1BET1dOX0RFUFRIID0gZGVwdGg7XG4gIGNvbnN0IERST1BET1dOX09QVElPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOICogMS44O1xuICBjb25zdCBEUk9QRE9XTl9NQVJHSU4gPSBMYXlvdXQuUEFORUxfTUFSR0lOO1xuXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG5cbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcblxuICBncm91cC5oaXRzY2FuID0gWyBwYW5lbCBdO1xuXG4gIGNvbnN0IGxhYmVsSW50ZXJhY3Rpb25zID0gW107XG4gIGNvbnN0IG9wdGlvbkxhYmVscyA9IFtdO1xuXG4gIC8vICBmaW5kIGFjdHVhbGx5IHdoaWNoIGxhYmVsIGlzIHNlbGVjdGVkXG4gIGNvbnN0IGluaXRpYWxMYWJlbCA9IGZpbmRMYWJlbEZyb21Qcm9wKCk7XG5cblxuXG4gIGZ1bmN0aW9uIGZpbmRMYWJlbEZyb21Qcm9wKCl7XG4gICAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xuICAgICAgcmV0dXJuIG9wdGlvbnMuZmluZCggZnVuY3Rpb24oIG9wdGlvbk5hbWUgKXtcbiAgICAgICAgcmV0dXJuIG9wdGlvbk5hbWUgPT09IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZpbmQoIGZ1bmN0aW9uKCBvcHRpb25OYW1lICl7XG4gICAgICAgIHJldHVybiBvYmplY3RbcHJvcGVydHlOYW1lXSA9PT0gb3B0aW9uc1sgb3B0aW9uTmFtZSBdO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlT3B0aW9uKCBsYWJlbFRleHQsIGlzT3B0aW9uICl7XG4gICAgY29uc3QgbGFiZWwgPSBjcmVhdGVUZXh0TGFiZWwoIHRleHRDcmVhdG9yLCBsYWJlbFRleHQsIERST1BET1dOX1dJRFRILCBkZXB0aCwgQ29sb3JzLkRST1BET1dOX0ZHX0NPTE9SLCBDb2xvcnMuRFJPUERPV05fQkdfQ09MT1IgKVxuICAgIGdyb3VwLmhpdHNjYW4ucHVzaCggbGFiZWwuYmFjayApO1xuICAgIGNvbnN0IGxhYmVsSW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggbGFiZWwuYmFjayApO1xuICAgIGxhYmVsSW50ZXJhY3Rpb25zLnB1c2goIGxhYmVsSW50ZXJhY3Rpb24gKTtcbiAgICBvcHRpb25MYWJlbHMucHVzaCggbGFiZWwgKTtcblxuXG4gICAgaWYoIGlzT3B0aW9uICl7XG4gICAgICBsYWJlbEludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHNlbGVjdGVkTGFiZWwuc2V0U3RyaW5nKCBsYWJlbFRleHQgKTtcblxuICAgICAgICBsZXQgcHJvcGVydHlDaGFuZ2VkID0gZmFsc2U7XG5cbiAgICAgICAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xuICAgICAgICAgIHByb3BlcnR5Q2hhbmdlZCA9IG9iamVjdFsgcHJvcGVydHlOYW1lIF0gIT09IGxhYmVsVGV4dDtcbiAgICAgICAgICBpZiggcHJvcGVydHlDaGFuZ2VkICl7XG4gICAgICAgICAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gbGFiZWxUZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIHByb3BlcnR5Q2hhbmdlZCA9IG9iamVjdFsgcHJvcGVydHlOYW1lIF0gIT09IG9wdGlvbnNbIGxhYmVsVGV4dCBdO1xuICAgICAgICAgIGlmKCBwcm9wZXJ0eUNoYW5nZWQgKXtcbiAgICAgICAgICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBvcHRpb25zWyBsYWJlbFRleHQgXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbGxhcHNlT3B0aW9ucygpO1xuICAgICAgICBzdGF0ZS5vcGVuID0gZmFsc2U7XG5cbiAgICAgICAgaWYoIG9uQ2hhbmdlZENCICYmIHByb3BlcnR5Q2hhbmdlZCApe1xuICAgICAgICAgIG9uQ2hhbmdlZENCKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICk7XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBsYWJlbEludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCBzdGF0ZS5vcGVuID09PSBmYWxzZSApe1xuICAgICAgICAgIG9wZW5PcHRpb25zKCk7XG4gICAgICAgICAgc3RhdGUub3BlbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBjb2xsYXBzZU9wdGlvbnMoKTtcbiAgICAgICAgICBzdGF0ZS5vcGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBsYWJlbC5pc09wdGlvbiA9IGlzT3B0aW9uO1xuICAgIHJldHVybiBsYWJlbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbGxhcHNlT3B0aW9ucygpe1xuICAgIG9wdGlvbkxhYmVscy5mb3JFYWNoKCBmdW5jdGlvbiggbGFiZWwgKXtcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xuICAgICAgICBsYWJlbC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb3Blbk9wdGlvbnMoKXtcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XG4gICAgICBpZiggbGFiZWwuaXNPcHRpb24gKXtcbiAgICAgICAgbGFiZWwudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyAgYmFzZSBvcHRpb25cbiAgY29uc3Qgc2VsZWN0ZWRMYWJlbCA9IGNyZWF0ZU9wdGlvbiggaW5pdGlhbExhYmVsLCBmYWxzZSApO1xuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTUFSR0lOICogMiArIHdpZHRoICogMC41O1xuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcblxuICBzZWxlY3RlZExhYmVsLmFkZCgoZnVuY3Rpb24gY3JlYXRlRG93bkFycm93KCl7XG4gICAgY29uc3QgdyA9IDAuMDE1O1xuICAgIGNvbnN0IGggPSAwLjAzO1xuICAgIGNvbnN0IHNoID0gbmV3IFRIUkVFLlNoYXBlKCk7XG4gICAgc2gubW92ZVRvKDAsMCk7XG4gICAgc2gubGluZVRvKC13LGgpO1xuICAgIHNoLmxpbmVUbyh3LGgpO1xuICAgIHNoLmxpbmVUbygwLDApO1xuXG4gICAgY29uc3QgZ2VvID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkoIHNoICk7XG4gICAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGdlbywgQ29sb3JzLkRST1BET1dOX0ZHX0NPTE9SICk7XG4gICAgZ2VvLnRyYW5zbGF0ZSggRFJPUERPV05fV0lEVEggLSB3ICogNCwgLURST1BET1dOX0hFSUdIVCAqIDAuNSArIGggKiAwLjUgLCBkZXB0aCAqIDEuMDEgKTtcblxuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaCggZ2VvLCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcbiAgfSkoKSk7XG5cblxuICBmdW5jdGlvbiBjb25maWd1cmVMYWJlbFBvc2l0aW9uKCBsYWJlbCwgaW5kZXggKXtcbiAgICBsYWJlbC5wb3NpdGlvbi55ID0gLURST1BET1dOX01BUkdJTiAtIChpbmRleCsxKSAqICggRFJPUERPV05fT1BUSU9OX0hFSUdIVCApO1xuICAgIGxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aCAqIDI7XG4gIH1cblxuICBmdW5jdGlvbiBvcHRpb25Ub0xhYmVsKCBvcHRpb25OYW1lLCBpbmRleCApe1xuICAgIGNvbnN0IG9wdGlvbkxhYmVsID0gY3JlYXRlT3B0aW9uKCBvcHRpb25OYW1lLCB0cnVlICk7XG4gICAgY29uZmlndXJlTGFiZWxQb3NpdGlvbiggb3B0aW9uTGFiZWwsIGluZGV4ICk7XG4gICAgcmV0dXJuIG9wdGlvbkxhYmVsO1xuICB9XG5cbiAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xuICAgIHNlbGVjdGVkTGFiZWwuYWRkKCAuLi5vcHRpb25zLm1hcCggb3B0aW9uVG9MYWJlbCApICk7XG4gIH1cbiAgZWxzZXtcbiAgICBzZWxlY3RlZExhYmVsLmFkZCggLi4uT2JqZWN0LmtleXMob3B0aW9ucykubWFwKCBvcHRpb25Ub0xhYmVsICkgKTtcbiAgfVxuXG5cbiAgY29sbGFwc2VPcHRpb25zKCk7XG5cbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XG5cbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9TTElERVIgKTtcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcblxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgY29udHJvbGxlcklELCBzZWxlY3RlZExhYmVsICk7XG5cblxuICB1cGRhdGVWaWV3KCk7XG5cbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xuXG4gICAgbGFiZWxJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGludGVyYWN0aW9uLCBpbmRleCApe1xuICAgICAgY29uc3QgbGFiZWwgPSBvcHRpb25MYWJlbHNbIGluZGV4IF07XG4gICAgICBpZiggbGFiZWwuaXNPcHRpb24gKXtcbiAgICAgICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGxhYmVsLmJhY2suZ2VvbWV0cnksIENvbG9ycy5EUk9QRE9XTl9CR19DT0xPUiApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBsZXQgb25DaGFuZ2VkQ0I7XG4gIGxldCBvbkZpbmlzaENoYW5nZUNCO1xuXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XG4gICAgb25DaGFuZ2VkQ0IgPSBjYWxsYmFjaztcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcblxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xuICAgIHN0YXRlLmxpc3RlbiA9IHRydWU7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcbiAgICBpZiggc3RhdGUubGlzdGVuICl7XG4gICAgICBzZWxlY3RlZExhYmVsLnNldFN0cmluZyggZmluZExhYmVsRnJvbVByb3AoKSApO1xuICAgIH1cbiAgICBsYWJlbEludGVyYWN0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggbGFiZWxJbnRlcmFjdGlvbiApe1xuICAgICAgbGFiZWxJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xuICAgIH0pO1xuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xuICAgIHVwZGF0ZVZpZXcoKTtcbiAgfTtcblxuXG4gIHJldHVybiBncm91cDtcbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKiBcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiogXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiogXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVGb2xkZXIoe1xuICB0ZXh0Q3JlYXRvcixcbiAgbmFtZVxufSA9IHt9ICl7XG5cbiAgY29uc3Qgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEg7XG5cbiAgY29uc3Qgc3BhY2luZ1BlckNvbnRyb2xsZXIgPSBMYXlvdXQuUEFORUxfSEVJR0hUICsgTGF5b3V0LlBBTkVMX1NQQUNJTkc7XG5cbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICBwcmV2aW91c1BhcmVudDogdW5kZWZpbmVkXG4gIH07XG5cbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgY29uc3QgY29sbGFwc2VHcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICBncm91cC5hZGQoIGNvbGxhcHNlR3JvdXAgKTtcblxuICAvLyAgWWVhaC4gR3Jvc3MuXG4gIGNvbnN0IGFkZE9yaWdpbmFsID0gVEhSRUUuR3JvdXAucHJvdG90eXBlLmFkZDtcbiAgYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIGNvbGxhcHNlR3JvdXAgKTtcblxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSBjcmVhdGVUZXh0TGFiZWwoIHRleHRDcmVhdG9yLCAnLSAnICsgbmFtZSwgMC42ICk7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCAqIDAuNTtcblxuICBhZGRPcmlnaW5hbC5jYWxsKCBncm91cCwgZGVzY3JpcHRvckxhYmVsICk7XG5cbiAgLy8gY29uc3QgcGFuZWwgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgMSwgTGF5b3V0LlBBTkVMX0RFUFRIICksIFNoYXJlZE1hdGVyaWFscy5GT0xERVIgKTtcbiAgLy8gcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCAqIDAuNSwgMCwgLUxheW91dC5QQU5FTF9ERVBUSCApO1xuICAvLyBhZGRPcmlnaW5hbC5jYWxsKCBncm91cCwgcGFuZWwgKTtcblxuICAvLyBjb25zdCBpbnRlcmFjdGlvblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIHdpZHRoLCAxLCBMYXlvdXQuUEFORUxfREVQVEggKSwgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjoweDAwMDAwMH0pICk7XG4gIC8vIGludGVyYWN0aW9uVm9sdW1lLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGggKiAwLjUgLSBMYXlvdXQuUEFORUxfTUFSR0lOLCAwLCAtTGF5b3V0LlBBTkVMX0RFUFRIICk7XG4gIC8vIGFkZE9yaWdpbmFsLmNhbGwoIGdyb3VwLCBpbnRlcmFjdGlvblZvbHVtZSApO1xuICAvLyBpbnRlcmFjdGlvblZvbHVtZS52aXNpYmxlID0gZmFsc2U7XG5cbiAgLy8gY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggcGFuZWwgKTtcbiAgLy8gaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlUHJlc3MgKTtcblxuICBmdW5jdGlvbiBoYW5kbGVQcmVzcygpe1xuICAgIHN0YXRlLmNvbGxhcHNlZCA9ICFzdGF0ZS5jb2xsYXBzZWQ7XG4gICAgcGVyZm9ybUxheW91dCgpO1xuICB9XG5cbiAgZ3JvdXAuYWRkID0gZnVuY3Rpb24oIC4uLmFyZ3MgKXtcbiAgICBhcmdzLmZvckVhY2goIGZ1bmN0aW9uKCBvYmogKXtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgY29udGFpbmVyLmFkZCggb2JqICk7XG4gICAgICBjb2xsYXBzZUdyb3VwLmFkZCggY29udGFpbmVyICk7XG4gICAgICBvYmouZm9sZGVyID0gZ3JvdXA7XG4gICAgfSk7XG5cbiAgICBwZXJmb3JtTGF5b3V0KCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gcGVyZm9ybUxheW91dCgpe1xuICAgIGNvbGxhcHNlR3JvdXAuY2hpbGRyZW4uZm9yRWFjaCggZnVuY3Rpb24oIGNoaWxkLCBpbmRleCApe1xuICAgICAgY2hpbGQucG9zaXRpb24ueSA9IC0oaW5kZXgrMSkgKiBzcGFjaW5nUGVyQ29udHJvbGxlciArIExheW91dC5QQU5FTF9IRUlHSFQgKiAwLjU7XG4gICAgICBpZiggc3RhdGUuY29sbGFwc2VkICl7XG4gICAgICAgIGNoaWxkLmNoaWxkcmVuWzBdLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIGNoaWxkLmNoaWxkcmVuWzBdLnZpc2libGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYoIHN0YXRlLmNvbGxhcHNlZCApe1xuICAgICAgZGVzY3JpcHRvckxhYmVsLnNldFN0cmluZyggJysgJyArIG5hbWUgKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGRlc2NyaXB0b3JMYWJlbC5zZXRTdHJpbmcoICctICcgKyBuYW1lICk7XG4gICAgfVxuXG4gICAgLy8gY29uc3QgdG90YWxIZWlnaHQgPSBjb2xsYXBzZUdyb3VwLmNoaWxkcmVuLmxlbmd0aCAqIHNwYWNpbmdQZXJDb250cm9sbGVyO1xuICAgIC8vIHBhbmVsLmdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgdG90YWxIZWlnaHQsIExheW91dC5QQU5FTF9ERVBUSCApO1xuICAgIC8vIHBhbmVsLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGggKiAwLjUsIC10b3RhbEhlaWdodCAqIDAuNSwgLUxheW91dC5QQU5FTF9ERVBUSCApO1xuICAgIC8vIHBhbmVsLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlTGFiZWwoKXtcbiAgICAvLyBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xuICAgIC8vICAgZGVzY3JpcHRvckxhYmVsLmJhY2subWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0JBQ0sgKTtcbiAgICAvLyB9XG4gICAgLy8gZWxzZXtcbiAgICAgIC8vIGRlc2NyaXB0b3JMYWJlbC5iYWNrLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfQkFDSyApO1xuICAgIC8vIH1cbiAgfVxuXG4gIGdyb3VwLmZvbGRlciA9IGdyb3VwO1xuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWw6IGRlc2NyaXB0b3JMYWJlbC5iYWNrIH0gKTtcblxuICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgdXBkYXRlTGFiZWwoKTtcbiAgfTtcblxuICBncm91cC5waW5UbyA9IGZ1bmN0aW9uKCBuZXdQYXJlbnQgKXtcbiAgICBjb25zdCBvbGRQYXJlbnQgPSBncm91cC5wYXJlbnQ7XG5cbiAgICBpZiggZ3JvdXAucGFyZW50ICl7XG4gICAgICBncm91cC5wYXJlbnQucmVtb3ZlKCBncm91cCApO1xuICAgIH1cbiAgICBuZXdQYXJlbnQuYWRkKCBncm91cCApO1xuXG4gICAgcmV0dXJuIG9sZFBhcmVudDtcbiAgfTtcblxuICBncm91cC5oaXRzY2FuID0gWyBkZXNjcmlwdG9yTGFiZWwuYmFjayBdO1xuXG4gIHJldHVybiBncm91cDtcbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKiBcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiogXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiogXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBpbWFnZSgpe1xuICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICBpbWFnZS5zcmMgPSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFnQUFBQUVBQ0FZQUFBREZrTTVuQUFDQUFFbEVRVlI0MnV5OUIzZGNSN0ltMkx0N2RzL01tOW5abm1mNnZiYnFsbG90N3lXS3BPaEFDeElFUUhpUGd2ZmUrd09nQ3A3ZFBmODR0NkNYMGZYVlZ4RjU4MVlWUUUwM2VVNGVTZFN0YTlKRWZCSHhSY1RQbkhPTitkR2FIeDM1MFprd092eTFsNzk1NGYvWmtoL3RLWDc3S2ovcUVuN2JsaC9OK1ZHZkg3WDU4VVYrM01pUHUvbngyRC83bGIrdUt6OTZqZEhscjNubGYvUFkzK1B5ZnQvbHgrMzhlSkFmVC8wN3lUMjc4Nk12UHpKKzlNRzlHdUdhL3Z3WThPUHl1aDcvbmZqdUQvUGpUbjU4bng5ZjVjZkgvbHZ1K1A5WDY2OXRvdS9wOS9mVTdxODl1OSsvWjdlZjA4dDNhTWlQNS9ueHlILzNUZjhPZjhxUHovTGoyL3o0QWQ2andhOUpwMytXTnFkNC81ZCs3aTduOEQveTQvZjU4VUYrZk83bjk0NS85blBZWjlxOWUvemZ0eVNzcS9Yc1cvbnhkWDU4a2g5L3pJL2Yram4rQWRiM2hmKytacmgvRDYzelFHQk9PLzM3Ti9uMWV1NzMwMzIvajc3MTMvMVJmcnlYSDEvNk9iaVZZdDlxMzNmNXU1cjh1T2VmazNSZStZdys4Yis5Q2Z2djh2MStreC8vbGgvL25CLy9YMzc4OS96NHIvbngvK2JIei9QalgvMDE3L25mZk9YdmNjL2Y4MFhFdTdUN05XMzA4L1dObjQ5Ny9ydWUwNXAwK2puUTlrZTNJUnVxT1IrL3lJOS9nZm1vNXIxL2xSKy85TS80MXpMdWZjZnZBOXpMci94Y3RNSm84WC8zeWwvend2OEdaUTNPZDlLYVhjN0hyL1BqWGIrM1pSL2M5OTliNTg5RXUxK2pOTEw0bnBlTFgvcDd2K3ZucVFYa1hHL0UwUFpIbzMrM1p5U0RVUzQ4Z2Jsc29qMklNcGpsY0Fia2d6eS9TOUZ4VDh2NEZya2ZmbE83djYvSWRQbXVSMzRPYi9tejlkblAwdjd4Tis4aGhXS05mbjl0T3luTG1OK2lBbXNLL0ZZVXJpaUVldjl4dC8wQmtFTXY3MzM1bStIOEdLRXg3UCtmdkcrai8yMk5GOWFzL0p2OHU4azlMKzh4N3NlSS83dHV2eERkL3I5SDgyUENqN0g4R0ZMZUhVSEFEUTgrZnFBREtVcTNGNzVuMUQrYjc5K3JQSHZjLy8vTDl4d0V3TktxZ0lETGQvalFIN3J2L1VGK0N1L1I1ZGRnU0psVHZIK25uN002ZjVoRlNJaXl1T1huOTVsL0I1bTNqTEplUS83dnV4TFdGWi9kRE0rVzcvcmNBNUIzL0J6WDBQcUs0dTFUNWhubm11ZDBDUFp2cHlMMEdRUjhTSUxtY2VTKzVibXQ5KzllNjUveklPSzg4aGw5NGRmK2pnY2tuM2tBK0k0SFNyOEN4U2VLL3ovOGV2NE93Q0lDT2dFeU1lL1NEY0Q1SmlsL1VZSzRKa1BLdkF6REd2RDVxdFo4L0Y2WmoycmQrejEvTm43djUvVFhaZHhiTXhZNkZjWEN5ckFKNUJES21qNEY5R3ByOWd2L3p1OHJSc056LzI0ZC90bURoc3pRWlBGemY0OGZ2SHovMUQvanQvNzkrZ015YUNSaGZ5Q1FaaG5NY3VFVnpHVXZ5YjR4UlRhTXd4Z0YrVENvNkxpNk1yNUZ2a2UrYVFDQVJoY0FuQVl3UXY0R0Fzb0JBRDMrNVVkSkFHcGoxRi9iQXdwOElQSzNxTURhQTc4ZDl4L2ZENEx3TzdDaVh2cE4zTzNmNWZMNjZmeVlvVEh0LzkrZ3Y3YkYvL2F4bjZ6N2l2THY5ZThvOTV6M1k5cS9ad1lXZEJTdVdjaVBXZi8rK080aXBKNzVUU2RLZ3BXdTNIUFlQM3ZLMzIrTzdqOE9hNFhQbnZmWFR2dDNHQUdGS2lDZ0Z0N2hFMjh4MzRhRDNPVGZJK1B2UDZYTTZReDhZNi9mQXczKyszN3JEL0NuSUNSRVdUVDdkeG53KzREdlBRWHpHMXBYZVhZZmdib0hZSFdKSlZIajMrdWxmMzRIZ0tjUm11ZDVtTXNGK084NWVMOHhFRExkSlBRRkJOd0NZY2FDcGpGaTMrTGNkdmo1YlNGckp1bTg4aGx0OE85dzM4K1JXRnNmZUcvSkgvemFYVnFuLys2VjB6dCtEdDhIc0hnVDltMkR2M2ZNdXd6QStXT1BFTW9RWEpOcE9zZVhZOUtRRGRXWWo0OXBQbjduZ1VBMTd2MkpIeC83dVh6ZnoyM2FlMnZHUWtZQlRLZ01lMGtPTlN1eUptbk5mdW5uQkkyR2V5Qy9XdjA3RGtYSzRoNy9tM3J3bUloaDlJRUhTWDMrV3lZTkdUUVQyQjhNcEZrR28xeGdvdy9sN3d6SVgwczJ6SUo4MEhSY1k4cHY0Vy9DKzRvUmlzWmRJNE9BY2dDQUNPVVorRWhyelBockJ3S0swQnF6cEpDdDM4NzV5VUlsY3dNMlhZT2YzRDcvKzh0M1dzcVBGUnBML3YrTmdzS1FBM29QWExLcy9DZjh1MTcrZnMyUFJiOFlReURBSi8zN1h2Ny9qZnhZaG5jZkFTR2x1YXZ4MlRLUHNrbm0vTE5YL2IzWC9mMlgvRnlOS005ZTkvKys1T2NTRldvWGdCODVjS0trNy9oM3FmUFh5RUdlOHZmbk9aVnZISWM5ME9RMzRUdmcvcjhCcnVKNnY0YTkvdDJuL1h6aWZSZGdmcTExbFdkUCtQbnY4blA3Z2l3SkNRTThCZVV2Rmc4S3FUbTRQODZ6ektmTTZiSi8zMW1ZMTBIRjhrT1g1bGVLb0dtbmZXOTkzemhZRTMxS1dDRHB2UElabGZVUjhQZU5mNy9QL1Q3NDBNK1hXTUR2ZXF2MUkyL3hmUUZnc1liQVl1aGRFRGozK3pOV28zaUU1QjZ5Sm90K0xuQmVaQTAwMlZDdCtmZ0M1dU45UHgvVnVMZU1yNzBDL2N6UGJkcDdzN0VnZTNsU0FVeWlESWZJR09ud2Uyb1laRTNTbXYzRzc0OVB5Qk1yMXI4WURXTWdOME95V083N0Nvd1NDZUZKeUdUUW4vTjU1VjZhVEpMOU1VOUdFSDY3eUdDV0N5TDN4VERCUGJnS3NrQ1REYXYrdWlWRHh6V24vQmJybStZQVJJMkFFZExHSUtBY0FDQUNmNUUrbE1jNktjSWVReEZhQXhWWWIrQzNxLzZEeDJDemlLdjZtZi9nRGo4SjQzNkNMdDl0aDhhNi8zL2ovdG9PLzl0bllQV0tTNWFWLzdKL2w5MzgyUGIvUGUwUERpckp5Mi9heW8rOS9OajA3ejRQSUtDUDNFSGlybjRHVmxRdkhNaDVmNDlOL3cyWDk5MzMvNzdpRDlFSVBYdmZYN2ZyLzNzTkZPb0lIVGdSVHArQlYrV0pQeEN0b0tSbi9QTzJhVTQzRlRBa1NwaGpoQS9BN2QwQlFtTE9mNlBjYzV1K3pWclhUZGhEb2dCYUFkamM5ZC8wdVZkZ0NPNUU2Q0c0azNuZWhubStISWZ3NzdMK0cvNGRGLzE3amhNSVFKZW11SDgxUVlNV24vWjlpeVRBUjVXd1FPaThhbWUweGUrOVIrQUN2ZWxCMmpkZThYMENGdkNIZm45ODVVSGk5MTVBaTBkSEE0dmF1OGcrbkFUQUptQ1RQVUlDQ25GTmNIOXNCV1JETmViamxqRWZsZHo3QnhxMy9GeCs2NEZBMm5zM0s4YkNyQUdZQkxDeU1kSURjazdPWWRLYXZVTzhIczBUTytSL3MranZvOGxpdkc4M2hmQTRaRExzOThTeVgvdWR3TUQ5Z1ViUUpNbS9KaThUNmdKeVlSSG1SUGFneUlJRFAvWkI1dkx6V2NlMXB2d1d1WitNVFQ5M3EvN2VjK0NOSEZCQXdNTnlBQUMrNExZWGdOcUlVWVRXYjFtQjlScS8zVGNVZHd3QXVQenRzUi83Q1FBQTNWZm9ra1hsZjduQXVjanZ6dnBuYmdFSW1GRGNRWUo0UlRtSkVCeUhBeWxLL2ZMWkovNTdRZ0FnNjY4N2duWENnendFN2p3NWNBd0E2ZzBBc0FOem12WFBXeklBQUZvSkVpTkU5NzhnNFFVL3Yvc3d2eG9BbVBQZkllc2djekFMbGtRN3JDbTZYVDhrY0RjTVFtOFpoTlNCdi9mbDk1M1NPSUh2M3ZmdnVRN1dqT2JTUlBkdkhWaktmZUJlblBIN1l3bjJyY3d0V2hOelJzZ2xkRjYxdlNyci9zU3YvVU1QenU1NmErNkd0NzQrOCt2M2hWL0RtMzRkNy9uckh5bmVvdEM3YUh2bEdYbncwQ08wQm11UzlldHk1UCtaRFp6cGN1ZERDSmFQL1BmZFUrYWozSHMvVWthTjN4cy9lSG1XOXQ3dFpMMkxSYm1oQUNZQnJHeU1ESkNjMi9UekhWcXpkNGtFK2dEa01IdGl4V2pJS25KakdaUmpYMEo0aXVjbUIvZkRnZnZqQUl3Z05NU0c2SXpHeUlWOStJWVRSVGFnZk1nRmRGeHJpbTg1aHZ2Sk54MkNBU2dHcGhnSlk4UkwrekVVV3cwQWNQbndjL3JZTklvUWYzZHVLTERlZ0JLdEJBREljNU1BUUowUzh4YVhyQ2ovSS85T01kOTk0RGZFZ2YvdkZjVWRoRzU0RnFKVDhPeDkyRnlIa1I2QVEvKytwM0NRVnlnRWdnY3VMUUM0aUFBQWZ5SXJnVDBMc3M4WUxMSlh3UklvZTdDbUU0cmI5YUVYNEpJTndQSDJPWCsvVFFBVnNsK080SDFrUGtVQW5QbjF5SG9CczA0dXpReThCNUxBTEVFamluL0xmNXNJRzgyYTBVSXUxbm5OQlpSU2cxL2psLzRkaFZSWTQ5ZnFscmRNdi9JSzhMWS9idy85ZnFuMXYzc0pydWlld0x0WWUwVUR2dk9nL0ZGK0hJT3dQRWtCQUtveEh6YzlDQ3JuM25YR2VBNXMvSHRsM0xzYlFEUWJDMWxTSEpveGd0d2hsSFBIc1AvVzZIeDFLZVEvamRlREhpMjU1NS85T1BMblppMFFQbndJSVpOUGpibDVEZnRDOXNTSlA1OFhjSTVaQm8vQlhua1ZLUmRPUUhlSklrYWdsSVhyemdJNnJqWHlXL2liNUw0aWUzTCsrVHNRa3A2bU1PK1BIcFZxQVlCVGNuZnNSeXJDZlJvbjF3d0FEaE04Q1kyRyt4MWRjYnR3bUhZTmF4bzMvU3FoM24xd0IybHhyK2NRRis5VFhPNDVFSGhiNEJKRTk3ZFkwaEtqMm9TRGQrei9mUzN3L1ZjQkFKZ3NodGFleEwxbjRiNDVRNmwzazN0ME13QVdlc2l6Z2E3RURpWGVMZ0RyeUIvd0UwRHZXK1FPbGRDQUtLVXoyQlBvb21WQ3BGZzBJVUd6NjUrTENvNEYrSjRSY3JFRVNpNWdPYlpEbXBpa1NMMzBpZzlUR2IrSGRMTW5zRmN4M2F3TkdPemF1NFQyaWdWOFpZMVBBVWlqVzNRdkpRQ0ltWTgyWXo0d3RTcnR2VnVNSVdsNW1ENmE5dDdvTVZrQzYvMEVBUEtlbjBjMFJwWkJEazFCeUhVSHZDeThwMGVBTi9XaDl3b3grYTh0QU93dno4cGY4dU92b0VzMmxMUExJVHpKNUFuTkRlNkpQVGhIcC80YWxNRmEyQ0ZHTHB6Q25HNlRYTmdDVno0K1B5MEF5Q251L3ozWTY0ZmczYjJBZDlvaFhocXVWV00xQWNBK0VCN1dBMlE0VmticmdBU3ZFZ0QwVTB5Wk9RZGF2RkFVWUxQaGZyY1VPUk5qK3NBU1IrQndSQWRxd1hCRG9XSWNBM2YzTGlqeEhmOU9RczZaQWZROEFvU1ZoY0RhWFNjQStDU0JMRFpPVm9MbDFnOWR2NTNnMmJqdjk4b1hDbGtUd2QwRkNjazFjTDB2QUVseEhkeXpBZ0xFSzdTYVlORzBFOUZWaExZSW1qT3djby9nbjhkdzJMWDVUcU00K3Z3NzlGTStkZ2RrRjJBV2c5U21FUExpSzFlbzNTRHBabmpQdEFDZ2lRaWhESHd2YUg1WFFLNVlaenJOZlBUQ3UvZTVRdTJGRHNwOWZ4eXcwa05LdWhOeXVIdVVmRzVrYnFlOU40ZkdkbUhmN0lEY1JSbTJSMVk5eXJsRHcyQVpJNnVTejNXdFF2NURYazhPck9kVHY2WjRkbWRKbG1JbXp5M3ZoVXFhR3lSSWI0TDM2SXc4VUJwQXMrVENFU2phUXdqNUNmZEhaTU1TY0M3V2diT3lYUVlBMkFidXhpcVF6dGZCQ05rSEdYeEs1NE85TmMxWEFRRG1FOUxoVUJuTmcwdXZtZ0NBc3dEYWxCamlNbzNGUU15Sldla29uRTlna3RHVmo2a3hXdWhBRURtNzRXY1ZMMEFTQURpQnd6dEhoREFSQmlNUVUwYXIrazBCZ004aU1ndllvdDlTaUgxSkhnUDJiSFFxak9LdktKU3dESHZzak5ab2xkakRFNUFHdEVqdTZYUHd6aVJaTkoza0tVS2hqUmJHUHV3M3RDb3FCUUFqL3Z2SElJMW8yTzhoelBYR1ZFWXVGdE1CKzIzUXVHY2FBSUNwbUx5K3gzNStEMkZ1WnlCTjA4b1FTcU5JUitEZFJ5RmxyTjlnVmFkVjBsakhZSmp5dVpHNTNWRG12WmxEYzBxZU1TSGhIU2lXTjhmOVQwaE96U204bGdhRi9GY1hJUC90Z3d0N0Q3N3BHTHg5QzBZbWo0VE92bzJjbXpuaTBvZ0hOTWxERTVJTENQRFhLUHNIWmNNMDdNdEZJNXRKbmhmekxUT1E5ajFIOTkwRUVQQWExblZMSVIyMlhSVUFzQXJpZEpFeVl2TFdkWVVBMW9nOXVaM2dBdTlVclA4ZGNNbnVLUlo4THdnSUpnK3lnTmZ1Z1Z3QUt3U3c0My9QTVU5MGo3ZjdlWThCRDljSkFDdzNvUmJUejVHYkRnVkNLN21YMGJXSUFtMVNlUWRoWDMrcnhKaFpRR0RNY3hLVWdRanhVUUF0R0M4TldUU1Nhdm9zRU1vNEk2c05TWUFyd0EvWXFUQUVNQU81ekhPUUlqWUI1NWhUR2JWaU1aSWloZWxtZk05WUFJQjFOcVlVV1hGSys0THpvYlU2QUxIendlOCtDL014YXJDcTB5anBRVWdsbTZZeEJjOFFwWmNXQUxDeVBUUU1OZlMrNGpva3hmMG5DWVRMSERENVQwdkRYZ2JQQS9JWURrR3hIbHBLaXdpMDM2ZVltM0VGUkNZQkFNMjdlQXg4QlpUYnNtNVNrR2NRQU40b0dRdGN6eVR0L2tSZ2plZGpoVUFieWkvMFF2NG80NjhTQUdSY2FVbGNBUUc5NUE2NmJnQ3dEcXp5WElRRnpGWXBJdXFRdTBxSVhvMEtrNWxqWUZrbEJpZWVDRTY3NC9rL0EwdUkwM0thQXQ5L1F1RURkSmUyWHpFSkVLdi9pWnV3dzJEMWErOG9heFRLR3NncVZpNEtFU3dzb2duTWtERHFCMWR0RCtVMnM1djZoUGdMR0FZUWIwU1BrZ0tVSlN1WEFjQVNXRFVyS1VpQUxGQVd3RTI1QnU3MEpWQ3NuTXI0U3NrMUg2RVVLYnpuR3R3ekZnQmtRR2pMN3pRQXNFN2V2Q1h3eEdWY2NZR1htUG5BT1YyRmQxK0crV0JXZFgxS0pUME9YcU1ZYjJRNUFFREwva0d3ejdJWDEyRk40VGR4M0w5ZlNWdG04cDlGNHR3RHQvOEI4WkpDU3F1VFVwUnZwNWliQ2NVQU9qTzhpd0lBTExsd0RyOWJKcEt2aEhlNlhIR1pZREVXdElxbUxXWHNvWDY0N3pDRmJYYmdmSjBhUElldXF3WUFJcUNsREtIVThkYmMyVzhDQU1SbUFWaFc2Ym1SRHNPcFhwTEx6RHdJVnNUc3hwZjMwTnpqQ0NET0V4UnVaK0Q3UTRTVStpdjBBSHlqc0lRNTNxWXA4aGxTNUtHNkFVY0d1T0ZZNGsxbFgyY041WTB4dEJhSWUxdWhpM01DYUlzRTBHUStlb3gzd01PckFZQXBzaXFTMGdDMW1PSTZoUlIyZ09pNEZraGwxQXBUWWJvWmtwOTI0Wjdya1FDQWhlODJrQzBSQUxBM0wrVDFpUkd3NjVTRHZVZnpzYWlFTjlOWWIyTmdCS3hIZWlQTEJRQ0xSSnBFV1djQmdDU2k4cGdyTFJvbWhjdkVxOGR5UWlOeENxOWxGN3l5U2FFenJ0SjZONFhiZkI3Q0d2dkFyQStGR3pSUWZrRmVWL3dkbm8wbUlNTzJ1OUsrSnRqVFJLcXZsa05TeGRSaFhQTUR5SzdqTS9iajc2OERBRFFDVy9aWklKNzlVd1lBR1FPOWFwdGdBQ3p2NXhBblpUTGlMQ21xMHdBYkZTdkRjV3p2SUlFRTFrenhaZjZkUlg3Q2FuSlhBUUJ1Qk83SEJ5N2t5cTlYaUdLb1FQY1RZb2xTRlhCRTRVZThKdStEVmxPQXlZc003b0lIRUxJU3VvMDlqaURUQWdCWTJwVUxBU1VKbEUzS1l6Nm1mR1ZPWlJ3RHBXY1ZwdHFDaklnajQ1NnhBSURuSXdkZXIzUDRiOHlLQ08yN3BQbllVTEl1amlIMWMwY2hPUGRFRXJnd3ZMQkk3UHFjRW1xcUJBQllIQUE4UzRzS1AyQWpNbFZadnBuTFd6UDVyNE84WTB6K1EzQ1B2SUJ6NGxaeGxWYVJ6UThpNTBZOFVadVF0bjFzWkQrZ2tSQ1NDNWl1eU1iRmN6OGtIYmJSbjhjV1Y5eUlDWHN2UENvems2UTVRSVkrTWNEUWozcjF1Z0NBRkY1NStyOHBBR0NyOUlEUTQxb2dnK0JCZ3BMVDhxRjVrYmw1aHZZZGFRR0E5VHROaVZ3RkFOQ0toRmpnS0VUbVErOEtXNHdIQWZjZXB4UnAzMkVlSFBpOXRzZDRUeWNkNERvSVkwd3FheVQ3Yk1NQUFFUE83aENZSkZBT0tLZjRHQVJ3VWlxalZaanFBTnlyeDZDWWM2Qk05OG9FQU1kdzczTWxON3BTQUxBSEFJUG40MVFoL0dMSUxGWjRMN2pTV2dZOHo1V0dBRElLMytnWXJsOGpxeHYzR01iOW1VRSs2cCtSVVRnaFR4TElmd3NLK1ErTm5sVkZ5VnJlTitUeEpNME5lcmNPSUJ2Q3FuK0E4aUZKTHFDZTZxUHdZbzAzTUo1NE9mSGN6OHRMUDdqZXc5MHlBWUNXUHIwSzcvdG5TNisrQlFCeDcyNVpadnl1bzhvbXVPZnNrcWhMNUZiS0dla2hXdk1NL281RFo1ZmVEWEVBVUVGYWJ1U3JBQURTV0lqamhCTUtUNE01RnBpbHdUWEcyVk1UcWdyWUFIdFRJMGhlUkNqdW1EMGRBd0FZUUtBd1BQTkNhOThBQUVJWTY2V1k3TE1FZ1lLQ0hrdEU3N3ZpZWdhb0NMQllDbWZHb0hBL285em9MVkN3aDBCZWpRRUFpNUMrdGFPRUFEZy9PbFNDT21rK2pzRGEzNFBuNWNnMXJSV1ppdVVYckZHNjZCRW9YL1MwVkVJQzdDT1AyQmF4K2JrT2dNZ0JLKzR2NmNYQ2NoOXplbytMdE9RL0RORXhMK29za1AyRERZS3N1Y0Y2R1ZnODV3RDJDVmRBeEo0c2RZWmNpRG5QV0RyNnJwY3hOYTVRSVJNcmJkNTNkc1hIR0FDUUpJLy84aFlBVkFZQXJQemxKT3Z3TWVSS3Z5QkxOUVFvT0dhTkxqUWtKMjJDdFJXcWZHZFoxemtsajFvamtsMEZBSkQwdjVkT0wvYXk1ZXlTb3owVWUyeWdEQUltNGxrRVBHekdvdTFGL282ckJBQmFxaW5XSWpnRFpZMVpBRWpTRzFKQWdDVlF1Q3pwQnVVVjd5aEtqOE5URm1DNUlBV3lUTG5Rbks5czdSWDBMcUFiVnlNQnhqYWhTcG9QMlM5YlFJaGNKMkJ6U0JrcGFRREFLdXp0VTRxeEx5dHU5bkxUQUpGdmhLR1pmVktJVWpWdTI0ajdjMk1icThlRnZPZkRTUEtmcHR6bmpSUzlIUVY4WW9PZzBKcG15ZnQwQnQrODYreWVMQkptS0ZjdVNJYlJEVTkydmdNZzRLRWZVdTc1anIvbXU3Y0E0S2NKQUViS1dCVGNCRnFkZTJhV25pdjUvR1BBOGtUM3ZWZzYrNjY0cHI5VisxNHJyNHQxREE0U3JLZXJBQUQzeTFEZUdzY2lGa1FrVlFYVVhHZXZyOUVEd01XbVpnZ0VZSld2SXlDL3JRSHJuZnRKdkVxd2pnNkkyQ1lwYjR0R1BKWUYzcUNTMTQxbmFoTXNXc21GWG5CNk1SOHJEVkRZelRPQk5FRFpIekZ0cUszNU9BZlFzZ0hXK2h6dGlmTUtBTUFLV2VJbk1FK1NXNit0NFF0WEhqbXNqOGlaVnZPa1RTUHVMMXdPYm1qRFBTN1FVNEh5b1NlQi9MY0g5MW9DNDhZaUExcjlTbUpDQU94OU9vVnpwSVVCNVA1anloNklPYzlpL04xMWhkNFlUNEVYOE1MLyt6Ti83UU92SzhvRkFKb00zVkdBMUZzQVVDWUE0Tno3QzJmWC9tY0FVQk1naTVVREFBN0JuWVg1dVZvbHdaZk9ybVNJaHo0VVA3MEtBRkNUd24xdkVmQ2VsUkZHc0tvQ3BvbjFvUXRTUzJGa0VrN01YaEVnSkYwekdRUnN1K0x5bzhkQXFFUHJjU0lsTVUwRTM1Ui9wdVlsc3ViQlNsdGtndFE0NUVLbnFRTWc3T1pCUTFab1o5Y2lRNHBRRGxtTDZJYWZCZUN4VWlVQWdFVmFVTkd1Z3ZJZkppL09pd1EzdDZVWXRHNkFBdTY0bmF3Vzk4ZnFmemtnZEhLUEMrWXE0SG5vcDlUWUhWZGF3WEhMR0JvWmNOazR2MmxJZ0ZzS3orUEFTTUZ1VHlFWE9QejcxTXYvSjM1TzVJeExtZXhtdjc0TllFalVsQWtBR2hOU3FNMVE1bHNBVUI0QXlQMEVBRURPbFJib1dIQjZwVGxPUWVRU24yOENBRHlLSVBCbEEvRS9JZkJWZzBoWTYvUlNzNjhEWVJuWkgzVXVYSXZnTkNKTnM4N1B5U3RYcUp1UElHQUJyRGNrVUoyQmx3UkJBS2FucGFrRW1FbFFrSHd1TFlhMFJaQktXd280S1dYWU9yc2FHZkpwSkdNYzJlNGpWUVlBZTY2NENkYzJ1WitsSERPR2NJUmRuMVl4Y0kwR3FUMkFLYU1MUnI0L2V3TzI2ZjFET2ZwMVJrb3ZobEZlQTVnSWpWTWdzUEg1SFVpWmZvbHBnRmpPVnlNYjR2MURXUUJhMnJhOGs1RDhwS05nc3djSFVpYTdHekpwbW9CUVhHNFdnSlZpZmhwS1YzOExBTXJuQUx5cEVBRG5iQjhwekdST1piRktHUjlBdkc4bmtFUDl6UlVBZ0NlUktYeGFjU01FRWJHcGhQc1IrZUVhTHlNcDMxZVVsTlhvNUp6U3I3UkNUZUlXYkFET2hvQUFxVEE0VDJtQUI2Q1FzQ0laaHpuUzdsMytCaUdvYXVkU2N6ZUdnSEZhQU5CUUpnQ1EraU9OUUlhc0tjUEZXazBBc0F2ZUd3MjBNd0VOUWN2dE10YVJxelJLU2VVaGw5eVliQWNVdllDVVpXZVhEWjZrTldzelNJaDRwbUlIbnA5TnlrUkptMzQ1NFlwTHNUUFpVUHNleTh0MTZrcnJGS0QzcGhWUy9xUWFxeFRBRzNLRmFvRzlSRG9zcDU5RWw3T0x6R2xobEwrRlV0OENnUElBUVBhS1NZRE1lTWR1VkZoaERVcytjakVMakpWcnpaQjJDRHpJSWRlcXFOMEdKbXUxQUVDdEN4ZngwZkpzbWZ3amNUT3JtTkNpaTY4S09HaWtLaVZWL09xR0ZFMk5FUGZhMlIwWDBRUHhDaXdFYkFxajdkc3N1REtQakp6cEVRSWxsVlNRc3dEQW1PRnV0R29lWENjQWtQb2pUMkNmM0hpREFPQ0FPQnpNK3NkVzRGaGUrRkdaNldIWXA2R1ZTSld6Q2g5QjNPQ2NJU1JLbDN1MldDbkxXa012cmZMZVh1UkFGL2FPa242WnRrYUNwZ05DZTNCUThVeWVLbWNPK1J2OWtMMGxWUUF4aFhzU1FtN0RSRHBNOHkwWlY5eDNBL3VJN0lDSEkrZU1TcXB2QVVCNWFZQ0hrV21BVDZ1WUJzaTF3N1Uwd0xTVkFQbVF6OERHeEg0R05aRExXbHNsQVBEQ3haZnh0ZkpzcFEwcmxoUHVOR0poU1ZVQk14RUtIR3QrajdsQzQ1WVJpdGx2T3J1Z3lhekJRUkNySHh2RURDVUFBS3oyWllVcXl2VUFNTmlOQlFCcDduM1ZBRURrem0zdndmcnlEUUtBYlZDMjU1UWx3YWwvVWw1WXFzTTlMR01kbjBENEQ1dVJZY3FtbHUrdkZRMWFVRHc5MW5PWi9MZW83Rk01UzJzSll6dkNFNWVtMzRYVTRsOUlBUUJZbG1Eb0FFbWN5TUVaQlk2TW5KTUovdzdDdzFnRTBJRHRoOVAwTlJnSFFDSDNYcUVzRTB3UnY5Wm1RRzhTQU55cE1nRFFpdWdrbGU5TktnUTA0MG9MQVIwYWxoTXJoMm9VQXRJcUNNcEI1cHp5V2xlb1p2WEtGY3JmVmdJQVhycnlHL2xnbm0zYWhrSldWVUF0UytLQWN0cTU2OWMwQUxJNUpYWHZnc2hsaTBUU3hKS21Hc2liZElWbUh4b0F3SE5qaFkvU3RnUFc5cVlWMXg5TlFad2NjT203QVZZTEFFakw1NC9mTUFCQXdhd1ZXY0x5d2xnZnZwd1NzUy9BKzRmdHlLMjQvN3JUR3dmSmQ4NUVBb0FRK1Urem1xMnhtT0NKbTA3Z2xtajFGNlE5N3lwNVhzOERJUURMdFg2cWVITldBQ3h4UTZsNWVQWUdnSWEwN1lEbFczRGdkeUhSRkdzdE1IL2lTdHNCdjJrQThOZy9xOVpWcnhTd1ZoRGkxSVZMQVV1Y09xa1U4SEVBNFhhQmUxaXJGc2ZOaE5KV0FyVENHRzFBUkdyMHdranFUbmU2UW5YQ2NnR0FWcjBxdHBXdjVPNWZXditWdGhRV3EwWExrc0I2L0tlUU03OE8rZVpMa04rOVNYbjdXcXZuTWZxV2wzNS9hR0Vlc1JLbUl3REFjWVVBWUJ3OEdielByVkxHc2NSSnNWU21nZEQ0SmdEQUIyOFlBSEFCb0RPREQ0QWt6bktheFBRUTl5Y203cjlrZUJVM1lCL2luckI0SGlIeW4xYmZmOHdZbWlmdVNNa3V5VVRNemJvcjFEUFlJbS9NbjUzZUQyQUFDSHZvb2NUeXpXZkV3ZGtpMlNDaFdxa2xzUVhwMjFiL2xkaHZXVmUrYXllQkc0U2c2Y2RDYUgrdkFBQlRMcHBjZFpvQmFTUTF5MnJIMlBLekFGTWNEMGN1NEtLdW96ejNhWVUvRUZLNG9lK1BDV08wK1hzSklYSEFGYm85aG9oZ0lRQ2d4UXJYSVVVbnlXVXVndjFyVjZnLy9qeml2bFpWd0RaWDNGQkRLOWNxSGhOc0RyTUZwTXg5U2k4NkJNSFByYUtsMzcyVTh0U0luaHQrUHl6UmZ0RkNBTmFjeFNnbEJCcXpyclNxSDROVElURU9HNkd4RTFJc2FBR3RVZXo1SHdrQUxKTnJHL2ZVZGdJcE1DMEFTQlAzbHozRDRSeTAxdGtpdHlxUDloa2szSE1sRENmcjFVL0Q2cGpLNU1NcENKZFpjN05QUXpLb0pCdmhOSUZFM1VIdnRFaGV2bE5LeTkwRFFqV1hJY2JzclhJQXdMNHhKR01xQjN0S3l3N2k2cEoxMXdVQXBHQkw3VFVCQUV5NTZIVGhibmd4UWlSVXp6cVVFdE1NRm5SU08rQlEvK3VYQ2VHRGN0b0JKMW1PL1AwRHJ0RFRlZ0lzUmkwT2ZCNEJBRnFjWHU0MXB2cWZrQ3Nscm5zVFFqNHhuZ1V0M1VlTGxXTERsa1A0dGhQSWpjNUNqclNFQzQ0Z2ZRcUYrb1NmcnhFZ0MzWDV0ZFZTUGZjQmFHd0VTSURJa280aDNyMG1qOFlHa0VCWFNNQnh5VllrWURHWXhib0hXRlJIcWd0dXdsem1Jc0RpM3lNQXNJQmxLQzJ3MDVYSERvK04rODhEUTM2WmFnRHNBOWpjZ2IyK2E2VGxXVEh6a0l4cmg0RkdFbGNHdkRDVXRjVXRPWWY1UFFWbGZRN0dUMUlkbFJid0RvNjU0dG9jS0JmT0FQZ2Z1ZUlHVDhjZ0cwNWN1QU5ybW0vQmdmYytBRStsVmgva2I0V3hyZ01BdFByRCtJSmN5VmNKQUtTQVNBYXMxVW9BQUhlMFdvSERjR0trZzRpYkJkdkZjaDYrS0tValYxcnhEdVBUVm14YkN4OWd4VHlKeVhVYldRRGFiN1h2N3dkQklqR25PY29uUm0rR2xpYkVLWHljS29RVndKS3EvejMwVnY5bGV1TG5sS0tJWUVuakZsaFZBZXNCbE1oaFJ4Q3dwYUI0YktCelRLbWNVdmhsRGR6NTh6QnZrK1RxMVFDQUhHZ0JBM3NBQUxDaUdRcnpPWXJ6eFpTKzNTZXJSVHI1blNrY0J2UnlNY2phVm1MYys4RG9Qb0M1aTJrRzlQY0lBQmhZWmwxcFFScXRNRkJhQU5DcmVMT3N1TDk0SENhVmE0L2gzSWp5MzFkSVpTTHZOSzVSbHM3MWdrSithM0RGdFR4NFgyV1YrOHdEazU2SnEwbmpBTTRwdDNqdWgyeWpVSUV1U3k0Y1V5cmpNWjNqblJRY2dKaHZPU1R2d3laNERxMEtvVCtHcDY4U0FBejRpY1JtRWV4S3Zpb0FnSVV2eEZvZHJRQUFhTXhXOUFLd0FHYTB4UWh5bWR5M1dwb1pwb2FFQk9HeFFnQVRTM01JOG45SFhYRmxzelRobTBFU0RtTFZyYmppK3VhWXpyaW4zQlBUM2pvTWF5R20rdDhEYi9WZld2K2ZlQ0JnMVZ0ZzNvTlZ3YXNXNHFZTUFoYkFNcFpZMjY2U3NwU0ZRNThqSWJQcGY3OEtsaUFxVTB0d0hzTSt4UUpBWnlDY3VVVnRVaGM1VWJxNzRBNDlJb3ZsaklUOUNya1JPNEZyTVdsWXRoY2tDTEgyL1UrSkEzQnhoUUJBdTdmbVNqNXplbWxna2FWcDNydEhBZnhXM0IvVFd0RmJzQTVoTFZRMGU4cjdvU0lmb0hRMHJ2Qm4xU3FwSldJd2VnYlhsZnNnMk1WUTFJYXpxd3Zpd040RzBrOERzekNFZTJFVjZCSzVzQXp2aCs1K0hEdEFBaFVaRU1vQ1NQc3RtL0E5cXhCMkMvVUkrVEdMNnFvQXdBU2tRMkN6Q00yVmZCVUFRUHFUejdsQ0Z5dEpjV01BRUdNQk40RjdhMHl4ZUU3QUJidXNDRW90aHNSVnRkYWNYb3Y2cFNFSTBZcEhOLzRpTUZIbGNLTDF2bGdHQU9DNTMvZUNhd2MydmNhWXR6cndQVlhJUWxxclc2djYzMTF2OVY5YS94L2x4MWV1MEY3WXFpK0FCQ2FOWVBqWWV4Y2FsYjA2NlFwMTdLVmVPYWNzWWJuZUhDbThMS0gvYlFYZ2NCcmlocjl1RjJLWGFJVWRCaXlZakF0M2tjdUJKMlJIc1Y1eWhyQm5ZTnRKM2lHMGJBOFM3c25XVFZvQWtFMlFBYkVBQU44aENRQ2dJb3dCQU5hOTJaVzhTOWZ1SzE2cU5PL2RZNFQ4OW9Dc3RrSXlBdmtDUWtSZEpTVzBDVzVsOWxBSVFNZjlJT2NGeDd6VHk1VS9JUTVQQnVacFVia1BjaVdRNTZCZHUyVDhYcm9iaWpkT2xIK2JLNjRqd1NDQURhcDVrQXVhYkpCR2Ewc2dtNjA2QU9WOEMzZHJsSlRIRWZBRXQ0UHkvMXVCcWFzQUFBc3daaFJGeUs3a2hTc0FBR01rU05kZ0FaYWQzbXVkWStCb2NUWVFNcDFVR0tISHpxN0dwckZJczRwN2xkMXBqUWw1OTBnbU9nVGkyQWE1NTloNngyNXNGck0ycVIzeXNSSGowdHlMMm1GbnR5Wlg3QXRWLy92QlcvMmZlcUYrQ1FSdStIVEFKeFF5Q1ZVWXhKU2Zld1lJNlBmL2Z4UnllV2VNdENYWmIyZzVjWHd3YTNnNCtnaTRMZ0pwREptK0NKSkNGb3pra1hOcUk1S1RSRUJ4ZzVnZHVEOEwrejV3ajFvaGs5V0VlNjRvMXMyNkVpNnlHa1dGck1FWUFHQlpXQnRHbG9ONDdQRGFOYWUzQTQ2OU4vZDYyRXFZanpUMzdpRTMraklwcEJWNGQzUU5ZeW9xNXF5am9oRmphb0k0Q3FKY0dEaFAwWmdnZ2lPRzlaNjY0a1pDOGk2aCsyUkFQNHdiMTJwakVqekR3c2ZoSWt5UFhhSDQyUXZGaXowSWNrRktMTThxc21FV0RGRHh6bUs2TmZMRnl2bVdLZkowUzZPdVBuK08ydnk3RnluL1N5T3EyZ0Jnd3hXM2p0UVVJU3VqRFNDblZBc0FzS3NmZTVKak13aXRnaHF6NEo4UWE1MHRubldLcmNWVVYwT0N6V2FJcFVucGJVeWEyeUFpV0JaY3dqaC8vT3lzSzIxSW9qWDJrQ3dBYmU1UHlEVXRWdW11NFY3RUZMNkh6bTVQSEZQOTc2YTMraSt0Ly9jOUVKQjB3TmdlQTF3VjhKWUNBbHI4czN2Z3dHTnhEeHhUQ2hEZ0RtUkhDamdhQmlHQW9hdEpBQm9MeExOQU1sWElnbmxPdkpNbFNFOUNYb0xXSUdZSlFEd0xleWxWYTRWTXJLWXp5MkFCTFNwV3pBeWxTYjVVZ1BkOGdqWFk2MG9MY2Qzd0lQRlBDUmJXSWxqRkF6UjNpOG96cDhtN2xmYmU0d0VMbCtjanpiMjdZTTRtRk1BcWUyYkVGZmNlUUF0M3hGQkM0K0RaNWYzd1ZGR1FRelFHNEhjdHNFNzN2Vng0VHRaMnhyalBJSkJvSlNVNW8xeG5qVUhJWk9xQmpCeFUvdmU4b2tRUWdISUJ3OWxTRUd4VWtRMVlHRWplVzg0ODl3SW81MXVHSUR0TDd0M2xDcjB3R2x5aC9QcmZsUDhsS0s0V0FEZ0RGK1VoV0tNeGloREhWUUdBWTJKdEh3Y0lUdHhxOGpFZzB4QWpkRGZnanJQZVBlUmVsZmFsV3RlOE1VRDJHK0FTUFRibXo3TGVRNjB3c2VBT00vWDNuTjRtVkN5WEpWZmExN3lWRHJ0R3l0eDNjZFgvYm9CRjk1Nzd6d0l2WDNzbEh1b3l1QTd2elhQMERZQ0FSeENURkJKbmh5dlU4KzZqdEtXTUsyNjJnZ3FRODM4UkhJMVJ2amVTVjdIQzRBUjV0RFlVMXJKbHdZaG5ZUUxpenpLbVhHbURHQm5URk1aallmL01DSm1NUk54VFV5eFM5QWozeTNNQzNpTmdiVm5XWUpjckxSWjFDUTQvODJBeFpHRk5Vc3kwajlhVnJ4MmxtSEdhZXlkWnVEd2ZhZTdkNWdyOUtRWVZwWVJXTDY0cDFodnBOWlN2S0hCdXR2U2pyUHJaMno5LzMzOENIb0JUeWtHTVZZVDgyNnNBQUZtRnRaMDFDRTVzcmRiNFVldVNXN2J1Ukg2M1dNa3JBZmZxQ3hCZzdCb1RaRDhMSkJRa29JUUFBQ3JzRFhBSFRocmhoeHBYWENBSDNkSTRrTncyUXdLcEhaVFNRKy9DNTJwaGVCL3UrNjBKOUUrOVFQOTlmbnpvQVlHVWdNWjZFNWc1c1V6dmpEeUR6endJdU9rNUJqVVFseFJydDltdlFSdWxMbUd6RlZRWXlCdFlCZmYzbkFHT3VHTllINENMU2ZJR3pDdXNaYzJDd1phNnd6U0d5SHJCZ2RaS2p5YnN5VnNpeFpUNkl1NlpDVmhrU0JwRzROMUo5N2Fzd1ZZQXp3ODhxUHZhZzhUM0lpeXNEQkNtdUltTzlrd0VYV251SFdQaDRueWt1WGNUV1BUZENtRHRnMVJCc2NLZnVVS0JMdHlIWGE3UXZVNDYyTFhEWHNOV3RqKzgxWkQvZUFEQUtrNFFvd2l0MzhZQWdQMEVEc0FzeEJvMWR1YTJvb1NIREd2MXJpczBuTEZhdGk1Q2pJMjlDY2dCV0NVcldYT3ZZaHZRbStRYTYzREYxYjFtZ2FXK2FpZzNmcmJFQVlXSk91bEtDNCtJOStNdXhPdlJuY2psS0djVnE1R1pwNktVdmxlQXpEeWt5VTBwNlRnQ1JsaWcvODY3ZHJGbDhXT3ZxRnBvL21mcG5XZkFiZnFodjhmWDNzTncyNy9yUTFmbzZTMGxqT3U5b0pUUkJBSVRoVFR5QnVaZ25qVHlsQlNNd3A3aGJVcG9ZSUpJdHN4YXJ2Vjc5Y2MrQ1c4bDF0cy9iLys4L1ZOTkFJRHVZTTBTWEFjbEU2TUlyY0VzY091MzNCMnFIUlFMa3FsV0ZDTE1vcUtFT3loVy9ZTlh3dmNNUmlpU1p1YkpNc3VRKzNJS0ZBRmF5WnA3OVFIa3Vrc01xZzRLKy9TQ2twbFVGRE1xTjM3Mm5DdHUvRE1NeWg4dEFyR2cwSW9VZCtJNERZbHpvV1drTVU5ditXK1NHdVZEeXYzUW5kc0N4TUY3UU9qNjBGdi92L0ZBUU5JQmI0UEhwaEZjb1VPUUNqcE9zY3pMZFh6WGh4USs4ZmYvMWovckJ3OHFIdmo5OE5pL3kxTVlMeFFnZ0x5QkVYam1HS3c1Z3FNSEVHNTY3Z3E5eEZ1VXVoWVk3MlBXOGtQL3ZwZDc5cHUzRXV2dG43ZC8zdjZwSmdESUVKTS9OR0lVb1RWbWlOUmkvWFpXc2Q3N0ZESVZzek5GQVk0WlNoZ3RjSWtQM3cra2hZeVFBa00yZHBlZmd4RkYrWWlWek83Vkg0U280WlhhQTY4YzZvaXcwdy91MWpGRHVXVVVKVFNxTUZIUmluem9DdFgybWhWM1lvYUdrRSs2eVIzTjVKTnZQU0dybVFoMmVLOWVjdWZXd3B5ZysvL1MrdjlsZnZ5QndnRDNnRHpKYzRYUCtWc3M4KzNKZnZ2bjdaKzNmOTcrU1FZQTNZckNzMGFNSXJRRzF4Q3dmcXRaVkJ3dkd3a1FZVExBQW1VbGpOWG12bFVZb1VpYTZTUEYwZ1dXV1NzUmF6SkVwR2xTbFA4Tlgram1ZNitFR1FRZ09hMGJLck5wOStkbmN4eFFtS2lzL0MrVjZWZHZkLzNiUDIvL3ZQM3o5cy9iUHo4ekZKNDFZaFJoNkxmZHJyaWNydmJiZmxiZ2IxZnA3WiszZjk3K2Vmdm43WiszZjZvUEFGckk2aXgzY0l6NHlSWGUrNGEzcWgrQTljNHhXODJLeHM1MzdPcnVnUnpVVmlxMGtQUWQ2Q2FYZVB0TGNyVnJ2eE9MdlJYWTNtbWZGWE05TXI2YkV0NnBsNHBOdkNqeis5SGpjdW5pLzJOKy9EWS9mcEVmL3lNLy9wOFUrMCticDBjK0xQQkNTWGU2cXJtdWhleVJGdUFHeE13aDd0bW5Da05iY3IzN2xQMDZRSjZlYnZnVzhmUmdvUk1Nelh4VXhqbnNnZk1nSHFWbVlvbExDS2ljTTg1bmpiL2hIbkJMUG9NMHpucWFMenpmQThyNXhqQVdlc2JrRzVvanprSnZsV1JYYzhTZTRiTWFzN2VSL1MvaHRhU3pvTWxxeWRzdlozK25QVWV4Y2xHK1NZeE42MzN3K3FSckxWa1ErOTI0UmpIN1IwdXZmSnh5YlZ2VHpuRWFBTkJKY2VkeUI4YS9oWFIzVmZmK3dTc1lkSjlyckcyT28yUG5Pd3c1Y0VwVER4RzZrcjVEeThGdElyTGRpSkZHbGFGS2IybWZsWFQ5SUZYMzZnQVNwdlZPV0c2eXNjenYxM0w4TDBsKy81RWZQOCtQLzVJZi8wZmtIc0Y1YWdOQmg4VEFIa2pidTRxNUZ1R0Y5U015Z2ZRNG5rUGVzMDNrZlpOM0gxWDI2d1R0VlF4MW9TQjdBY0ljUVVEYWN6aE01NkV2UUFLdDlONjlpakFXRUhEVFozRThKK0dzemRlRWNyNUhhYjR3aStWRnhQbXN4c0R6RjlvejJsbU4yZHREUkxDdGp6Z0xnOHBjUEZMcW84VHU3N1RuS0duZThadGFYYUVWY2laaURwS3UxZVJKSTZSbHAxbWptUDB6cUdTRVBZOWNXM3pQVkRJNERRRG9nL0t5TTJVT2JGS0FhWGRYZGU4YXNMS2JnSHpHZWR2TXBNZWM2M21GUVQvcGlwdnVpUEJPK2c2dXdpWEZWRGpkanNlVVVpMHc3Yk9TcnVjVU5TeEFNaDJZYit4ZlVNNzMxMEtXZ0ZUNXV5VDMvU28vL2prLy9pay8vcy9JUFRKbFZGWGsxRURybXlxZGF5eHppclhOUndNRmNuZ09hOGd6MUFFNTZTTlVhOERhcnhyWk5VT2hOUVFCWWtXblBZZlRWSkJteEVnRGZWcm12YWZockduQytEbWtySDRQcGJ1N3FFalROTXpYZ2pKZnMxUWdDUXZyTkVTY3oyb01QSCtoUGNQWHRrWHU3U2tpWmpjbFhEOXR6TVZUVjFxN1AzWi9wemxISFpGeUViOEppN1ZOSlZ5ZmRDM0xBam1melJIZnpXc1VzMzh3STYyZHdFWlB4TnFPUWJHbWFCbWNCZ0JncithVk1zY1NGZDRSSlhCVjkzNEtnclFUbEJxWGNGMm1GRU1zYXl5cGpWcGpCKzZJbGZRZFd0VzlUcVhnRHY4Tyt3VklnNXkwendwZHYreUtPNURoaHB0MXhRMHZjTDY1ZzJFNTMvL0NGYmY1L2NTbjkvMDZQLzRsUC81YmZ2eGZrWHRrVVNscnJMVWJuVEcrcVpLNW5sU0VNdGJBV0lpY1E5NnpmUVRFNWx4eFl5SnJ2eTVEdXVzVWtXc1JCR0NOaGpUblVNb0t5M2tJZFNGN1VjWVpYM2FsVFZTc3hpMlN0b3ZLZnhUTytKSnl2clZpVmxwcDNhYUk4MW5wNFBNWDJqTjhiYWRTK0VyYjJ3dXV1RHg3UzhMMVdOVVRRY056cDNmdmk5bmZzZWRveUJVM0tiTG1uVHRyU3MrVWFhTWtOYzVCMHJVb0M3QTJTVHRrbThXdVVkSjNZTjhOTkFZWVpGbHJoVElybFF4T0F3QzRnY3RPR1VQcnBQWHFDdStOK2ZOWUdsWHFhcTlTd1NBcE1uVGdCNWU4bGI0QzNIUkg2K25NMzdHbEZFalM2dnh2S3Q4bVRVK3c1a0hhWjRXdTV3NWtYUEo0UTNrbnF4dGoydStYU244L0pBQ0FtRDJDbmY0R1FHZzFBK0tmZ0dxUk8xV2FhMjdoS3VFRHJZbFQwaHkrQ094WlVXVFNjQWZMTWgvQ3YrOVN3YXRGU0s4ZHBKRERjOGorU0hNT3QrazhXSDNJUlZHblBlTjhieEZ5V3V0V0tkekZsdGtDek5jT3pOZWhjYmExNWpvdEVlZXowc0huTDdSbk5wVTZLeDFLNld1ZVN5NncxaHE0ZmtjcGs5NER0VGtZVU05Rzd1K1ljNFNsd0VQemJuWFc1SzZwMWh6MEI2NUZlWUxWU2JHVU01YnBUbHFqcFAyejZZcGJ3Z3ZZUU8rdzdPZjFCSm1WU2dhWEN3Q2tGUEJ4aW1HMTBteTZ3bnRqUVpoaFdMUmxwM2R2TzFGS0ZKOUNHV0hwSzdCakhDanJPNndTeVF3QXVHNS9xR05oMm1kWjEyc3RXYTJtUjhldXVLdmRYQUFBeEg1L09RQkEyeU1IQWFIVjZvcTdFSEp6cG5Mbm1udXNzN1hBQUdDSGZtZTFzMDNhczloeTE5cXJXYWpNdVE3V1dLaFBRNXB6bUlQemNBQktZNW1zYU94M1hzNjk1UnUwMXNmY1ZZNkY1WnIvcmN6WGlURmZSODd1NTlHU2NENHJIZHI1cy9hTTFUNVpBd0Q3enU0UmdnQUFXMllmd1hPc3R0Nk5BS2dIQ1ZEdktXZUpBY0NVY2Y1MmxiUEhIVDF6ZEg4K1AxZzBic01WOTRQWlZnQUdnNWREMGlrNEIrTkFITVVTNDV0K2YrRjdZY2ZSUVZkb2hyZW96Qk4rQzRLTkhqQmFaSjJ3RTZ5MVRxbGtjS1VBNExVcjFQR3ZOZ0NveHIwNU5pYVRLSTF0UkNpY3VkTCs3ZGlIbmE5TEF3QmVsd2tBTHZ3ejB5aWwxeWtCd0lVaVZFWklnRW9MWTZ2bEwzWmlLK2Y3S3dFQWwvZitpLytPbkhJWXhLM2U0WXFiS1dFWFFybEhPWE45NFlvN0diSzFZQUdBMHdBQWlObXpvcnlPWUovdXUrS09qOWlHZUpkQUFDdFFJWGZGbnNNVE9BL244QzU3aW5lc0wyRnZXUGMrOXdOYkthOHBybXhwTmYyWWhPVXFDSFZSL0RsbHJ1UnM1Nm9NQU9UOXF3VUFMc29BQUtjSjhtcUVyTVZEZUdkVXNPSXlGazVNQ0ZDZk9idlRxcWFnQllSaFcva0o4RUtpaFg3NVhuLzJ2emxRRkszMlB1ZXV1SXNtN2gxczhiNE9JT2kxQWU1SEFNU2dNcGV1cklmZ3ljQndOTXFlRlpxck0wV1JqMEYyeWdoOGs4elppYlBiMEd2bjdQd3FBVUN1eWlHQWF0NjdRNG43eWlRZWdZQTVKTGVwakMxd28waDcxOXpmT1FDUTFxc29RRFVCajEzdHVnSlczblVBZ0w4WVFrdml1TjJ1dUNVMUhxUy8rbEhPWFAvVkZUcGlhdFpDT1FBZ3paN2RBVGY1aGl0dVJTd050eXpnTnF5UXUyTE80YTRyOU5XUTgzQUdRbVpYc2Z3NlU1eHh2UGNSQUl4c0FPQkpFeUIydGU2RDh0Zm1hNHU4Z0VrQUlEWUVzQThnYmIvQ0VNQlZBZ0JVeU9zd1gyZWtOS2RwdjNRNHU2MDN0b2puVUVXR3ZBNTdBSlkwSlQxQjN5UG45WnptWWhveVBXWmgzbklCY05HcG5ET3g1azlnUDJOb2NVSngvYU54eE5jT1Fhb3NnbzIxQU5qQTh6a0U2N05HYzN3QUxuMEU5WHpPZ3AxNnF3VUF0aXNrQVY3VnZWbndJOG9UQlNzVGljUXBZUWt2QVdsakhXS3YyMy9IQUdBT1VPb0JvTTE5aUZVeEFWTFM1ZDRFQURnR1JjZENaQmh5NXRHZHVBVUg5NlNDdWY2THQwZ3NhNkcvREFCZzdkbWNzV2VYWUw5aUsySUViMmhsckNva01uR2p4NXpETlNBZmJ0SzdXWlpaVitTOVYrSGVXMkJkdlliMVdWZDRIdEkwaW1QbnVNZDNhTDZRL0N0Z1lKTVVpdXpSTkNUQWRRVUFyS2NrQVY0WEFPRE9uRHNLTU1QNGNtaVBvbVdLN253RWdVaFU1RFhTM1BUaU50OEFpL2t2OUg0SUNMbjl0NFIzTkc2UDVtbGJCWS9udVdIVnMrdi9SSEg5VDFPMkU0TDZhUUlicHdCb09MU3FlUTFPYVczUVE5TkRZSFdkakFQMkZsUVZBQ3hYa0FaNFZmZm1sckFvK0hGeHBSV3RwRWtJMHB1aUZLTEZCRlp0V2dYWS9oTURBTE93dWZkQldSMFEyUTNSTFpMSnJoc0FuSU1WZW1FSWhYN0Y4dGlsV1B4cG1YTjlEQWM0WnhDSDBnS0FOSHRXK203Z2ZzVU9sU2pNVGd6TEROM29NZXMzQnltejRwMWdRYWFCc0RUM1hpQzM5QmtBUEN1TStCd3NRSFFabnl2VzdJUmZuMmw2M2hLeHNjV3pGWnNHT0I4QUFQTXAwZ0N2Q3dEMFVGeCtFK1liOXd1MzZlNVZ3Z2RaV3Y5bGlyZTNPYjB6TElZZG1BZUEreVVMSWRnemhiTXpEb3B2UXdsSExCTnB1MUZoOUhPTS9yWGlhbzkxL1dNYU1YY25uU092Q1o1UEJLRlRCbTlnM3dBYjdmU01KY2pXVWZkM3RRSEF0Q3V2RU5CVjNYdEFRWVhIaENCUllJOENDMzRRWWlxakpHQ3R2Tm8wQ2hEN2RQOVVBSUFJZE43YzI2QndKbDFwQjBWSkozdFRBT0NBbERpNit3WUpGYVBDeWxZQUFNNGhqbnhtQ0lMeE1nQUE3dG0xd0o2ZGg1emVRVWdmRzZWdjNRTUZrZ3VRdTlKNGNNYVVkendwWS85Wjk1NVFGTmw1QkFBWUkvZnlpYUdVcEJPbUZBQ2JoTG9EV2o1MlRDR1g4UWdBTU83aUNzRmNGd0RvQ3V5M2MxS2VxTXd6aXRWOFpJQUdUUG5GVEJ6MkhHaXUrbG02L3pHczZ5azlhNElJZzFuREl5VnpWa2M1L1phMXpkWjVHdGMvcHlIM1Vlb2hoaUl2bEh1eFYrSXNBbXdNazVkaEcwYUpoK3NxQU1DWU1iQkJFSmVYVEtNNHRDR0hoKzg5WkxpUnRCaVh1R3lsbWxLWEt5NFRQT0NLcXl0cGxiVXFtYU9mQWdCQWQvT1pBcEttWEhIQm0yWlhYQ0wwcWdEQWYwMVF3bnRnR1J3bXhBYmw4SjVBS2xnbEFDQ0dPSlFHQUZTeVozc1VZYlpONFlPUUd6M04rbW5LdGhvQVlOZ2dpbWtDSDkvZDhnQzhCdjdLT2xoQlV3RDRCeFZaZ3ZzN3FaUnJKZ1VBeUxqa1VyRFhCUURhRGJkOFZySEtjYi93SHQxWFhOTWNObmhGM0FIMnhtazhBSGJuNXdBTWFOZHJIajR0VzZEVGMwWWFYSEU5Z3drQVFqdEthR3RUQ1kyR1hQOWlITlVSQUJwWDVCRWJFY3NLTDhFaUhDUFkwTTVaN3FwSmdPekMwOFkwYkFoa0h6OU1JUnlzTWVHS0swaHBuZ1ZOc1dvczF4Yi8reVpndkxhNzByclBXbTN0U3Vmb1RRSUFadndmRVhFTTA2KzZJQ2NZNjcxWEd3RDhtd2NCUDA5UXdpaTBVQWpOS2hibEhxVEY3RlFCQU1RUWg5SUFnR0hGOVdudDJRSGFzNjFLSEhBVDNLem9SdWNZZlJvUzU0Z1IvN1hJV1drQXdBU0ZQdzdKUmFyTkdYTUFsbWxQSUJGeUUrb0t6SUxzRU5KbWx5dXV5UzRsbVJ0Qkh1RG9LQU1BZENqM3dSNEsxd1VBa0lNMHFWaWxwMFo2N2FneHp5SGlZTDMvWjErQXE4RThBTTFqaDJlQ3IyZUNyeFlTRk0vT0k2OGpYcm5pU3FrYTR4NUI1QjZjNFNSclhFcWRDOWlRdlA0aHl1dTNRZzdJV2ROQ0JKaHlMUG8wbFF5dUpnQllDNHhWWWpkaVVZbFkxM0ZvY0FXcEZ1TWdZZXdXbFFUbnVXS0RuaTVnY3VLUWc5ZnNDbzF0S3BrakdXOEtBQ0JwakMzWkdWZGNnS1VWbU5mU3h2aTdLZ09BMytYSGI5eC9sZ1QrOXdRbHJLVVVvUnRTUzFXU3cxc3BBTmdJb0hna0RzVUNnSEwzTEpabjFkeXNWb3krSEE3THRDdFVHdHNHSmMwTThEUWt3R1dLeDJPYzljSklsY0x2ZjZha2RlMkJ0U2dnQUdzakxBT1BRdmhEYVAxTFU1WW5IbUJJV1ducDlkQllBUUJvaFB1ODlQZXU5Yys2TGdEd2lsemdISnUyd2taYXlNQUt2NGt5bEdaaEZrRFY0dnBvdUoyQ0FyUjRBMG5wZnloMzd2bTVmcWxZNTNPS2RTNThnaXlGQlVLdWY1R1BqMXlod0ZlblVrdkFTZ3ZjVnJnTVRPTHRKbVBzalFDQXZZUmhiY0Q2eUJCQWFHd1o5MzVwSENTTlhNaS9hNmE0WHlqczBBa0xVTWtjNFhnVEFPQUFZbkhpN2xvaHhyOXNiaXpCZWxsQjdyS1J6NWRWQkFDWERZSCs1UDZ6TStDNytmRk9oQkxlQldHUE1kOXBKVlVKaFZVMUFJQ0Y0a1VSVmdJQVl2ZnNNMFVoc1l2K0ltRXRZdFp2MFJVcUVtNEJXZlIxQldtQTI1UmRJQmtBT1ZBTUlRS2p5QkdzVExkTWZKWXpPRk5aLy9maStVSnZ3TEFDQXU2QklIOE1WbDJsQUVEQXhXTi83eHIvck9zQ0FQVmdsWTRZUUZsTHI5WDROQllCRjN0K01FRGxGRDhPOHlBSVBxWXplNko0aFpMUy93U1FOSG1QWlkwcmRQZkRxbnRXYllBelpVNUNydjlIWGo3ZWQ0VUdTbGpiSDBNT21FMXpET0ZKSytjZnZTc3l2elZ2QWdDY3dXSm80N2dDQUhCQ01ReHRoTzZ0eFpxU2hDQ3pReWRTaEIzS25TTWVwejY5N0xvQXdEN0YwQkZwWWxuWGR0cmMwb1RsSzYrNHF3RUF2dkRqc2p2ZFpYdmdqendZU0ZMQ3lFVG0xQi9MTlZndEFMQU1JT3JVQ0FYRUFvQnk5cXcwM0dsd2hSS3RhV1AwTVFDQTgrY1A0UDBRT0tZcEJNVGdlQjlxQUVnb2FoOEFLYWVXWVNnUlk3a01BcklBZ3NSNmxOb0FHNVRoZ2lUWEpnOXdiL2s5S2dLOVdnRGd2ci9uRC80Wk42NFJBTHh3cFZYOTJDMnRjVSswK1BVaHJEMWEyNjNnQ205VTltY29ZMk5OQ2RtdEtlKzJTV3o1RTJkWEY1UzV2K0hsRjF2bm9kb0FmMVZ5OEVPdS84dTF2ZW5YOXFFcmRQZlRRZzZiRkVyTFJlVDhkd0xmVFpwaVhUc0FxRlJKUDdsQ2NERm1XRUZXbkxKRk9SQmFPb1VWZGdpbGkyVlRETTU5dm1vQXdESHNwTmgvUFNET0gxeWhsVytsQU9CN0dEYzhJTGdFRjU5RktPRU54VExZZ0h6dkxVVllWUXNBTENUa0VDK1hDUUJpOSt4VkF3Q3NPSWdWOUU1QlNSOUFlaUs3S0p0VG5QRlRWMXpzYUkrVVAzZkNreUpHOTExeEYwc0VBVklYWVIrQXhXdXdYUGVWWjZDSDRYSnZmKzMzNC9kWEFBQys5L2YrMmovcnVnQkFMWHlEVnRlZjAydFhJUVZVSy8zTDVOSXVBbWhpQWZjYWZBME9PV0JvTHd2ZVhwWmYyd0QydFBRL1RrZXM5eUZMVWN6WUxydzNrQmI0RnhldStJY2RTTEhKMXZkS3lJR2JIYkg4T0ZjNFRaenpqNlc4cGFQcUcrTUFsT3VtZit5dUxyeWdvY3drSWRoQ0NsTkxwN0MrSjJtT3RpTEhkWWNBdEtJeHpQNUgxTmtDdkljYTcwNnJsQU53bjhaZGYwQXZFZlMzRVVxWTgycFJBR2pNNExVcUF3Qk91Mk5DVHl3QXNKanNiOUlEY0VGQ0NXdm9vNUxXVWtXMVprQWhBK0lJdkRoN0VLdTNySE4wdFVvVEpRUUJRaWFUcGtDN3JsRHpIY3YxN2xQWUN3bkxIK2JIeDE0NVh4VUErTUkvNDhOckJBQ2lrRFR5NkFhbDF5S2dEcFgrdGFvMFBnQTJmSGNrRDREai94dEVsR1p2SDNza3RHcUVvcUJ2K1hjUzE3eFZHQWp2ZVdIVUJwaWlYSHhzc2lXZVRRdzVjQnY0S1NKZ1NzbmpwSngvZnM1M2J4SUFsRXZVZTNTRkJNT2tlQ3JYcW01VEFJQ1dUbEZKS2VDbGhQRW1TWUJaRUZ4Wm1Ic3JCYkJhV1FEUGxQSEViK3o3Z1h1akV0WmlsK0lDWkV0QzFyNmFBQ0FtaDdnYUhBQUw3TllDbzVtVlFhd25JZFlEZ0YzMHRraEpUeHFwb3JFR0JPZWhhMFNyWHFlM0E2NGpFRERvU3RzQ3J3RjNJUWVDUGNReitMM25wVncxQVBqQVArdTZBTUJEaFR3NlRuRnByU1lBeHRxdFRBRW1ldDhOUEd2ZHlPL2ZWamc3V2grQlBZalhIMGVrdXo3MzcvTVk5b3pXZG5lVDR2QUNCTFRLZlNITC9Bc0lPV2pQMU5KMlh5c0VUQTQxU0FxMmVCcStmTk1Bb0p4VXZWamlRamtwaGlGR05WZVJRdXUySjhHZFgya3ZnQ2xqL0pUU0FHT0tBRFZWb1E1QW96SHEvUm8rRGV3UlZzSXNTQTZJcGM4czlXb0NBQzJIK0p4aWVHa0J3TGFSQmFERk5PdU1lTzZHS3kybW95bVJtRFJBTGl1NjZxOWRJQkpkditJcGl0a2JES0NzNGtwYU8rQUgvaHZhL0xPeExzS3cvOTAwa01zMlhISE5pL09BSmZ2T05RS0FkMUlDZ0o0S0FNQjk4Qnh4aWg1WCtHUFAyUjRSMURUaUozWnF2QTNwY054S2VOWEk3K2Y0LzRvQkdBNmNYbzhnNUpFSXVmNlpBQ2o3Y05lb0RaQVVtLy9FaDNmRTY4QTFDTkxLelRieXJOejJYb1pQZndvQUlLbFlUeWVrb05TbFRGMklLVEtFS1dwYUhRQ3JMS3JFRlR1dUFRQklvd2NjUDdWQ1FPZXV1Tzc4aWtJS1JNYnJrekxlcWNNWTdYNCttNERoSHFPRVZ5aUZLVXRXNVJIRjA2b05BS1lWVng0Q3pqUjFBSmFNUGN1czVoN0lJMGRCcG5WRk8zVjZZeFNKMWNhc24vUWRtUGZDVmNEOUtLWFJJVmNrdHRhSEJxQkNMWmRaMEVybVRzWVZXcmYya1RkZzByLzNFcVVLaGd5RE53MEFjZ2xFVUU3OTNJZ0VBSGZBSW0xMjRhWlpYQXpuME9uVkF0R2JpdnlNN3lua3dPV0VOUjRBeC8rWFhYSGZBczc2eWJwd0xRb01PNmR4L2VlQUxLclZCbGdITCtrd0VLYkZRL1dCSnpWLzUrZjhrWi96bGpJQkFIclA3L2o3ZnVIRFJ6OEpBSkFKakg1WHFDSGZGT2tldEVyb3lwQUNIcTBRRjNua2l2c3dhelhMdHhYRjFuZE5BRUJxQ2Z5VWVnRndLZUFMVjF5QVlnVXNQZXdGa0xha2Mrd2U2WUJRUTR3U1hqTGlpWno3djN4RkFHRGM2UzAvMFdXWUJBQXNBWHhPNzQ4V2greWxYcWMzTjhHOXF6VnFpVzNLaGNWNnh2M3pwWXd0bnV0bVV2NTNVdHlidVJUY1pYQUJQRkc5RkF2dEIydGYzbEhlVC9iVmtQOTd0bkl2QXV0eTNRQWdwbkVTRXR1NkZhOFA1c3BiOHVvV3hLVXhmS1IxK1VQRnpLbDJXcW5kRmdCbW9xUWVRZWFCVm9CSU83Y2NZckFBZzlhTkVNc1JZejJDaHhITWYzVDk3ME9teUxhUnM0L2sxMEh5VUwzbnZRRGYrRkJWTlFFQXBrLy84YWNBQU1ZVHhpaWxsVFc2OHBybzRCQUxxTUVMQW1GZ1pwU1lGakxzdWNPZFdETEQxd1FBZm1yZEFMVm1RQndmNVc2QVBSRkVyN1I3WkF6QVdFZkFPbVVsUEcra01HbDV3VmNCQUxTV245ekZMd2tBWkJJVU9Gc2NZK0JSR2dIbHBxVVdNWUJnWm5SYUFDZmdXK0xRNk5sN0Jzci8reFQzMXJnVVZub3Fla0FhSUlkN0R0WllHbnlKcDNCSXlYbi9xUUlBZmo4dXpUc0Jhei9zOUNZN0llN0lEV0NuSTBOZjh5Q2R3Um5aZDNxblBYVC92NEpNb2R2ZUJWN2pDdFgzWW5nQU9TV2VIeUlPbmlTQVhIbW5Cd29SYnpMZytoY1BLTGZ5WlFQSjhsQmRGd0I0NzAwRGdQbUlNUXVITnlsOUxqUUJEVEFrWHZ6TVQ4bzlqMjc3bkY3ZzR0UXZIdmE0WHlhMzV0US9JQUN3MmdHZjAxeFoxUUdydlVjd0ZTc05FWTlMNko2NTBoTEJWd0VBQmx5NG5PaXA0b3BueGRDcjVBY2Z3SGNnT1hOUjJhOXpTampuUWdFUGVBWmppWG9hRU1jeXRpKzlnSC9paGF3by82OVNlaGUwVUFBRDloa2wvUXF6ZmpaY29jWDNnakpQOCtEcVRlSUdYVGNBR0RJOGx4eDNubFBXWHN1R3NVaWYzNEpDd3BvQVhLaUhBYlhXK1E4NzdiVUJOK01lZk45OTRnSDBVZW9oZWh1T0NHU2c5NUVMQ0oyNzRsTFVtcGVFMzZsRlNjVmJjWGFqbndXbjUrekx1Mm8xK21VdS9pRUF3SHJrMEdKRjVVN0FVeitlK01rUW9YUFRUd3E3eGxDb25KRmkyNEowTFdIckx3ZklXSCt2QUdBQ2hDTXoycE5xQkZScmoyamxYbU9Vc0piQzlCZFhXc3hrNmdvQmdDWlF4Rkw1WDM2RUZFT1hraC9NR1JwU3dFYmJyNWp1bGdQTGpZdVhhSlhheXRtL0w3M3lxSVhNalh1UUd2cWxTMWNrYXNRSUJWeFF6SlhUcnpvVUpienJ2M2tEQ0lzNFQxc0d1T0xzb09zR0FCbURqZithZ1BnS1pSQ3RrbkxTWFBUb0R2L0t5OG9IOEQyYVltWkFyWFh2NDg1L21KNTVDVFErQXhiOFM4WGJ3RHl0UDd2U1BQOXBweGZLdWp6amYzV2xoWUdtakt5ek8rVDYxd0Q3aWNJOXNUZ0M2S0Zpc21yWFB3SUEySThjMVZKbU9BSDNJR2Y4bGhjNlVqeEdDbHlnVUVITDZOUVZWd1hiYzhYNStoTHYydnNIQWdBajVNWkc1Y00xQXVTUWpRTGJ1dEk5RXRza0o0bUpqM24vV2puVHF3SUFJWmZpUlFRQUVEWTJNcEl4UXdQVE5ERVZEL2ZyUGlsL3p1Wmc3OHJMTWttY2VBNGZnT0tYd2phUzIvNitTOTlwMEFvRlpGMXBZUlQ1RmxiQ2tycTE3Myt6VGZOMEFEd0REVnlJOHJodUFLQ3g4WkcvZEFUZmhQVkRkdUM3VHhXZUU3dm9oWmlHaWxtcjE0K2t3cis0NHRiVXF3VFcyZFYreTh2amoxMmg4TTRMaFhUSXdQMS9PYjE1bFpVbDgxZG5OOHpDakFRSlNmQTVYU1BRckNsMEswdmd3Z0FNQWs3L2JnSEFCYmcwazBaYUFYdVJZZ0srOHlqeks3K3BMemZibi94MVlsR05RV3gwM1cvZVEzQnRuVUhLQ1ZibHk4RTFwMlVBZ0l0ckJBQVhWUUFBRWlQVmxNK1pzMnNFREZWaGo1eFdBUUNnME55QndZZjVxZ0JBRXFub0l1RTdteWtuV1lEcm1ySm5UNVQ5ZWdSeDFCeFkvbHpQb1k4SW5BK3JjQTZsZXVPWFBpWHBReStVM2tsNTd5SERhOGRwbFZ5MFIxdlhjM0FsODdrK2hYbkNVQ0NuZEYwM0FFRFBKWVlxRHNubHJja3FzVjQxb003ZCtVUXAzWGFGbWdEWUlJaTVLS0xzckxiYlhPSDFuaXRVQ2YwQTB1QnFsZWR3dU1GcVgyMXhIUzRVVU1JTnMzQytNd0ZQbmRWMk54TTQxMVluME1FeUFjQkZGUUhBeFZVQWdHd1pJMWJBNG05aUorQlRyL2cvOEd6STMwTithdyt3bzJYeDFpRFhWT0phWWkxaXFXRUVCUWZnSllnQkFESGZZUUdBYXM5WjZIb0dBS3g4Qk8zaWJ3NlZlYWpHSGtuVEpqZXJLR0VSbWl2S0VBWEl3cnJjdWJZQVFDaXRLT2s3aFl6VkRjQVZRUUR1Mlp5eFgyV3Y3cmppQ24xYzBaR0xpVlRySEg3a3JmNC81TWR2OCtNL1V0NjczK0JTOExuZ3VXZEZja0FnbnN1STUyQ2VOb2dNakFURGNnQkEwanFIQUFEV2lrY2dMbXNmK2laNUp2SkVwcFVjOVJjZW9IMEozNFExQVRoTmJ3dmtaTmJacmFuUi9ZOTc0bjNsT1JZUEFOZVpGYnBXNDRKbDJiSUNTc1RMZGRjYmpBT0IrMWhwcHpIbitsQjVoN1FBb0p4elp3R0E0TDNTQW9BcE9KQmJaUTR1enRDV2NPOE5wN2R6dENiZ1V2RmZ0cEg5cGQrSXIveEdReEFnQlVHa1R2Z211ZnRsN0lJRktlOGlCVkRROHNWS2FtbS9vNHZjWU90WE5HZWg2OWNwUnRodGVFMzR2VGFKVVY2dFBiS3FNSGhEOTBiRUxTR01HV1dJQXNRRFhPbGNyeW51UnEybStGcmtkMktwVUFZQnVHZTNqRDByM2c0aHdTMjU0Z3A5R1VpWmxTSTlXTW14V3Vmd3NwM3pyL1BqRi9ueHoyWGNlNERTS2plVitlTzV4MDZBNjY2NGNWRm9ubFpkY1VkQXpsS0tCUURXbmxvMTBpNHRBQ0JrUEFIaUFnSldZTzM1ZTZ4dm1sYkl1a0tHKzVNUGxYSitlclBCbndxZEZiYTBIM2grd1ZjZUVMNGJDRGZFN0kxcDJMK2h1VjVMNENUSVBoMmdrS0gyYmR6VEl2WmM4MzZPQVFEVk9uZXA3cFVHQU9DQlhIVEpKVzJ0Z1NXQkJXR0g3cjJva0Nxd3dZU2ttSHpzTjltbDBQazNMM1NlS0NCQUJJVzRpK2Rkb1dITWlpc3ROYndDWkp0RllLbFBLYWk2bk8vQWNwQXp4dHhXWTg2U3JrZFdkYWZpTmRIZWE1RlNzcXExUjlCVkxTN0wwTDBYQ0tsTEdJT0hlRGZRc3FwMHJ2blo3YTYwdE9pMDhTenRPeCs3UXRjd0JBRWpydERnWnQ3L2ZzVUxRZDZ2eTdCWHA4RjEyZy9LdjRIeTlMKzdnblA0TC9ueDgvejRiMlhjRyt2NXp4bjdTVnQzbktORm1DYysyNnN3VDFoTkZJdGNTWjJTMzNsbCtUbWt6a2toR2JTV3AxS3NNekxTYi9oNy84ay9TNnJFZGNGK2xRSkdDd0ZaeGQ4a01rb1VtS1RyU3NqblBiOWVYNU43bmhzRVRhYzRLMnhwZnc3QUJzTU5rb2ZmbFdKdkRFYk85VFNSWERWT1F1eTNZZGdrOWx6emZuNFg1cm1TNzQ4NWQ2bnVsUVlBeUlFYzl4TXpWZWJBa3NDaU9FUDNudlIvajJrVkRZUXl2L1FvOHcvZTh2K2ZYdWpjSnhBZ0FyWGZGU3FEU1g5cnNSSzV6TEQ4L1RTOHl5amtRbU9IdkhLK0EvdERqeGx6VzQwNVM3cCtqTnllN1JIdk5RWEtwZThLOWdpbWVDVzlQd282S1lyRG80ZUU2a1NWNWhxZjNhSzQ4VWNUMWhXLzg1NENBcnBBd2ZHZW5hWDlPZ3U1NzFJSVo4QVZWK2lUZWhuYzB2a3F6dUUvNWNmL1hjYTlPNEFNT1c3c0U1NzdYcGdqZWM2ME1VOXo0QlhDZWVvaDVmL1VoekhlOTlieXQ0cTFITHVuY0ozckZKYjgrLzVadFFRQ2NPM2xtN1R2bWFWdkVobkZ5bC9xcEdDUEE2d0o4SkxTNUVaVHlDVnVnaU1GYW43ajl3ZG1IVFJFeWliY0cwbHpiWjFINWlTVTgyMng1NXJmK1EvK1hGVGorNVBPWGFwN3BRRUFrcU9jY2FWbGJOTU1Ga2IxRWZmT0VDcC80WW9yVEFsNnZrU1ovKzZ0anYvaTBSR0NnRWIvekE0QUFnTmdNWTQ2dmN5d3VMZXhvbGl2SzVRMUZtdXFuTzlBNzBUR1ArTXE1aXgwdlh3WFZ2YUxlYThoWUw1M1ZuR1BEQ3JXYXRMNzk0T2dhL0cvNDlGQ1FyVWFjODNQYmxRc2VPdFoybmZlSWhEUUFIdTJCL2Jzc0xGblI4bmIwZWZ2MythS0svU0o4ci9wTFloUHIrb2NSc29QdnJlUUlYdmhqQ2JOZlR2TWtlelo0WVN6aldzdTg0Umx5aDk0YjRabUxUOVRGSFhzT2o4RGkxUXN1UGY4c3g3UjJuZkNkOGszYWQvRGE0OHlpcFgvTFE4Mi91algzdXBZMTUzeXJFanBYMVpNdjNMRjVYQWZneFdjWm0vRXpqV2V4MW9DSlorVytXMng1NXJmK1Izd0lGWDYvVW5uTHRXOTBnQUE2V1BjSHJDd3lobmQ0RGE5NnpkL3JYOWVrMS93VG5obW55dVVBTzREVk5pampDNXczZFRCKzRldTE1N1RDOC9wY0lVbU5sSUQvNzVmaklmK1lMLzBRcVNhNzk0RTFxQjJmVGU4V3dOWUVRaDRRcitwaC9udWdIY1dZVHBBQTRGUWtvTEI5NUQzbDVydGFlN05sUjcvMVF1V1A3aEN2VzBwYmxMajE2S2U1aUJwRDJKem81dFYydk55Zit5ZytBcldzeHJucUljc2ZEeEw5YlQzZXdGSURKTFFFOURRUThvREZlSnRQeDRFd0hXZnNuZHdYWG0vNGxtNjdkZnhwdkVkYmZRZC9JeU1NdThOaWdMOEptRU5laFFGYXUzakFRSXFFaEtMT1NPLzlxNS9UUm5IN09IdXdOL3p2bnZnbi9GMUF0anNWcjV0Z0w2cGsyUVU3bzl2d2YzL2V3QXlmVFJQd3dEU0VLaWhSNmFOenJUb29nNHdVTkR6TXdIVzc2UXJMbDA5SEFCa0tLOWo1T3VIM25QempiSlhXUWRvQUc0YzNuZkNGVmZMeGY0NXVJNWNZdnQ3VjlwaHNNLy9sdWRVODF4TDhhNm4vcDczTEFCZzNielNNUWlJNUpGaDlXUU1LeDB0YzYwQjBRQWhKM3gvcTJGUjBuTVFYV0lqbklja3BEckllcTcwM1R2QUd0S3VIMUkyTmJzUVE3OXBTYkZSK1VBaFdtNVZYTXlNMnZtK29VT0ExaGxiTXIvMHFQZDlFbXJDTkg0SjN4WGlCdUFlZkVWdXpHcnNlV3lFSmNJU09TbkRWVGhIUTNTdzhTeTFLdDh4Um9KeWl0WjFpTHhDTE9TbGw3b0lubmF5aXVRWnZMWmpycmgvUUpkeWx1NzdkYnhyV01OOU1HOWp4djdCZWU4eXJPQ2JDV3VBTG5UWjE5WStuaUNYdFB6M1dNUVplZGZ2NFE4TmQzeHp3aDRlRFB3OTc3dkh3UHdQaFpzR2xXL0ROZFJrRk80UDhXeElDS0FUc2p0d25xWWhUSU9obW1raTREMGc1Uy83WU1pL3p4UndQeFlnL20wMXI5SkNNdDJnYTVMa2F6MG9md0ZTU2ZwTHpoeUdjT2JwSGJVbVc0UE9ickoxUndrbkRBUEhEVVBieUYzcmg3VGpWK0RoZUd3QmdORE55eDNURUpQb0NjUyt4b2paalRHOGFaaFVIRk5LN0tRUDN0OXFXWnowSEVTbTdTQzRhZ0dwOCtiRVdHUzU3NDZ4blNubE41T3V1Q29mNTVOUEp2eW1VNW52YVRoVXVGSDVRSTBUc21TU0djZnRjQzdtQTRlQTQ3UHMxaE1YNXNjK2h2MDlzSXpSdmRZZnlBN2dQY2g1ek5YWTh4TkVKbXFnbEtMcEtwd2xKcVhXS21ReTNQdHpNT2RDRUZwUVNLNkRpcEIvN09lbmpzRHBJQkZzTlFFM0YzR1daTzRmQnI1alhCSDYxak8wT0xpQTA5QWFUTG5TSHV5OGovbjVTRWFiSjJWbW5aR1BQSUQ5TWtESTZ6UDI4RFRFZTJQMjNUUHdrajFNSUp4YWF6aXJ5Q2plSDNjaDN2NmhLeFFYbWdRU3ExUmxYQWFpNWlwa3IyQXhuU2ZneGUwa1dTNkV0eFhJL3RnQTVydGtiNjBra0RJSElPc2lTVlkyQmJ3b0duZGpDa2ljUy9DZDYvU08rSjd6dEk1YW0rMGFBa1ZZUlhTWkNMQ3Jycml1Z1hnMmlyeGNGZ0FJM2J6Y0lRMW9oSDNPQngzYmQycE1mVnhRM0V6TGNHK3NmalVJckdMdCtqbUZaYnRLejVsMnhZMXcyZ0ZCdFNoSXQxcnZuZ0YySjErL2JHeHE3bkZ0L1dhWUJBeXlqVU1iZFJYbWJZb0FDS1liYWN6ZEZiaHYwcjA1bFVrT3dMdGdOWDBIWVJpdHo3Y0lucVE5aUtWeEgxUmh6eTlUT3BFSUQ4bC9uaUdtZXJtRDAxSmZRcG9wcHBQTmdRRENWTGxORXBTTElIdzRMZTQ1OEZjNkNKek93TjdSOXMwcTdEM3JMSW1DZmdiRXE1anYyS0M5TTA5S3ZKc1ViMDNDR2l5NjRocjNyUW43ZUlOU3JwTE9pTGhndi9CSytYdnZQaGVTNFFzbEpXL2UyTC96a2Z2dXVmZDgzSWRNaHRaQXlxbTFocUcwU1c0QzlJa3J6ZmZINnBYYnJyaG9GemJ6a1hvY3o0R1hoTXBmenVXR0s3VCt2cXp0SURVTEx2KzU3NHFyWmxwcG1WZ3hOaVFyWlMrRXZDZ1pSUWRvYVp4Uy9mUkFlYzgxV01kSklpVzJRRmlIUFNMWU1BbFRZTGtPd0RCNCtnUWdOMWdBb0R0dzgzSUhGL0lJNWI5dVVON3pMazNVSm13bXlZWGxGcFhZNVlxdjM0UUZ3dWZzMEhPa0VjNDRzZWFiU1Btand0bWdSY2QzWDQ5OGQyNFFzazFENjhqRk9iUGFiMmFCTllzQ1J0dW9oOHFCMm5URmRSRVlKZGNadWJ2YmRBQkM5N2FLbVh3QWJyamI0Q1pFb1lhRk8xWmNhWVZBclpBUGRqS3JkTTlyZGNtYlhXbnhtRXJPa1ZhWTZoV2xjc2xaV29YdjJDZEJpWVd1cEcvSHJMTFg2MTF4a1MxTXY4T2FFYnV1dE14enpGa1NTN1ZPOFdSWjMyRTlBM1BoV2ZFK1NWaURWVmRhRklyM3NYWStjQzlyWjJTRVV0UnUrUDE3eisrNVIrRCtiM1Y2VVI3ZXYvejMxcjU3NFlwTDhtcXBiVngwYWwvNUpxMHpLRGFXZWd5cGdKLzU3OFU2L2xMUVNJb2FTV0VqYnNna2MxOFBHVk9ZSGlvMUl1UitVZ1pacW52S3YwdmhwMUJoSnV5L0VKS1ZzaGZ1Qkx3b28yUjRpVjZSdWN6QjREbkl1VUpwZWl6a05VbDdSd2lCN1lwM0c0dkt5VDBSQUtDM2VSUzlYREVBZ0c5ZXp0Q3FxTFU3dlFLV1RCdy9UeVpxMXhYS0hzcUVjblU3QkFETGRIME9RRURTYzlaZGNUZThESkJoMk5wY2RjWFZ1NDRxZUhjR0FQdndHMno0Z1ZhZ1ZzOWJmc01DanRkMjN4V1hGK1VESmFWSUQxeHBXV0IyTzdLeTI0Zk5mcHB3NzUzQXZUL3hGc1pOeVBiUWxJWlllRElIb1QzSWRjTXIyZlBXV2pZYmMxTHVXYkpLVTZQYkZjL1NRV0JkNWIyNTh5UG5WVGNyT2N4aWllMjZRc25pRTNyT2tTdHVacVNkSlFHT2pRa3lBYjhEbjRQUHdGSzRySGlmQjliQXFnb1p1NC9QQW1jRSt4ZTBlRVZTNC9mdmMvL3RMMTJoV2w0L1dNOVlsaGY3M3EvQTN4OG1BSUM3cnJnRk1Nc0tManQ5U211WW8vMkJydnAyQUhEM1hhSElrUVlBVVA1aVRYMXQ3cmxtQ3JjdVAzS0ZNcjVvU0tEQ1BZNEVBT3NrSzYyOVVFT1pJSm9YUmF2Z2VPaUtDemZoMklOOUxXdThSU0NBNVd1WDRkM0dzdklJQUhBczB2cTFYU1VBa0dZU1ZoMzFVQTFzYWRweFRLanAyQlVhZVlUcTIxc0FBQnNsSExqUzBxcFM1eGxyUkdQRGtHRmcrUTRvRm9MYzg2ekNkMGNybW50U1k5TVBSS2xhUnkrdGp2ZUlzYlpucnJpOEtCOG9yZG1NNW5hMGxGM1dPS3h5bUxIdkFGdGpIVDVtZWdQSVl1aVdacVhCN1hIUEt3QUFGeUFNUXlNdEFEaE5NUzduNTg4QkFOQmg3SUZEMk5zODkxbFg2SXgzQkh0ZHE2eUdpaGxMOXNwZXhsNEV1TGJIOFArc3M5UUdSS3FrdXZqNEhiaC9aTy9zR0lwWFBCbHArMEtrM2NmbmNFYTBTcFB0U3ZZUXByRmk2SlhyNWNzNzR0OXpsejdlMTNXdXRKSmh2eXR1d0lRTndJNXBEZVdic0FYdVBKMzVWM0IrdVBET3JPR05QSVM1MHVaZUF5bzRGN0xldStCWmxkREZKbmtjWXdGQTBsNUFrbWFYNFVWQi9YVUkzaG5zNUxsTUllSk5BR0RZeVpPckV3b3ZwU2ZnM1dZQXdHT041K0txUWdDeVVIOTJ4WjJUY0pOaVhKUzdZSjBCR3NPdVhydHcyRTRxQUFCN2lyTGJCY0dJM2NqUUpUUUdhVWRXTC9nenNLcTJ5UVVlKys1OVRxL05mZTcwYm5kWXhoTVBpdFVYWGxOMGg2NjRwZW82aEN5NDNleStZbldJaGFNcHV6MElkMkFyNEMyNDk3a2gwS1NsNlhlUUhsUnJ1S1ZSYVFpb09hOENBSkQxVEJwcEFFQ2FjUWlDV0FNQVhRbDdZRjhSbEFLQ2NjOXEvZDViNmY3enJyVFZkaFpjeGJpMmV3RHdzdVNKWXVDSUlJWmx3Z2xaU0xnMzl3QUVhSW9YdlFDVkFvRGR3RDdlQTVET1p4Uy9OU25WaitYdUlYanhWbHh4Sjcxakk0YU9xV1ExZm44M0FjREFmYklQRnY4QnpDKzJaOVk2OWJHblFTclZmWlBBUjlxSUFBQWhvTUtOZUphSVhNd0VRYzJZS01jRDhOd3dPTmlMZ2kzbjExeHgrMmJoV0t3cEE4RURlbm1uaWV2VkUvQnVTeHZwRS9LNG1PR1FhcE1BdGQ3SldTTnV6Zldac1RNVVdnd3JSTURaQWpSZURnQkFsN3dJclRWWW5CMUZJVzJRWmNSeDdoMVgzSWxwRitLcXk4UTNpSG4zYmtPZ253U3Nlb3dGSGJyU251Y29FRm5SN1JJUkJSbjZTNjYwYzFkT3VhL1Uwa2YzMzZwQ051TjdJM2c2cDIvRE9ia0Y2V2oxcnJUNzQ2eWlOSEl1dVp0ZkxBRFlNZzR1bCtibGhpbE5pakJiVHpHd25mV0JzdTY5aHNmdWtPWnpCZVorRWJ4V1NlQ0NlN25qL1UvSk9sd0VRYnppOUo3ckduQnNEWUNZSTFmYUZWQytZNW1ld1lDWFBSbHBBUUN2MlpvckxyMDhyN3pIS1NsTTNtOHhxWDR6cnJUQnk1Ymk3czBwbkJCT0NlU1d2QnJBT0ZlOEROaUM5eUxCd3lVQVFGcEVXeGxKQzVFQW9KdkNXZXZLUHNLUXhBU2tNSEsyeUp6aVNxOHZnd09nOFJMWTRCRFp2d0h5YmszaGo3RGhzTzJLMjdIbkZMQ2NnVlJEVGJlSkIvdlA0TTA1SmlNZ0dnQ2tUUVBVaEM4cVF5MnVxd2tzY1FYakFzOUMyazZhaldrQkFIU3ppTkNTZEwxRlJTRmxYV2tyekVFbFJvOHRRVGNoM2prTlRQdllkN2RjdWdneXNIT1cxc3J6Sk1BWFlCTGdHcVdpVE1LQm1qRkFsQ1Uwa1JzeHA2UVQ0V0hGRUVjU0tCSUdicDFDd3B5R3RXRHZSN2FLQUdESmxaWms1Zktza3hRamJWVEljL01SWTBVQmN6c1FINXdBNVdaMUdUdFZBT3c0aFVyMlhYTHJheTB1blZNQTJ6U3Q3WXJobXRRYXkxZ2c0d3pBQ1g3N2hBTEF6d09lakxZeUFBQ3YyUnljRDl6SGFNU2NKT3kzcEZTL0dmb3VjY3R6L0Q5SGMyK2xCSllEQU9aSTVvU0F1UlFlZXU3ZDVEVk9yMGt5a1FJQU1CRlNzLzVGT1hJOUJxbHRNUTcvaldsMVFxWkxtd1dnOFJKV1FPY2RBZmhjY3FXdDZKRVRwb1VPbDhuUTBneFA3YXdqR1RSTCtvRkhOQUJJVXdoSWk5RzhwbzlZVXBqZEk0cHl1UUJCaE9obldOa1FsWElBc0czcU9Dd3FDcFRYQnNybUJjakNJVUtYbkx6N2FNcDNieldJZlFjZ3RIQ0RhTmRZS0xKVFNRUGtYT3BCeU1IV0ZHSklhSXBpSHFaREtBVm5CbHh4TjdjVkVIUWhRWU1NWEFZYTNFc2VRVjYxQVlDa21tbER2bEdFamJDa08xeHhyWWp4d0pnS2dKa05JcmtKeUxBQUFNNG50ci9GWjJCZmRDRU9NUURJS0hIcEV3VmdDQ2daTnA2aHVjWXpzR2Nza0pGVlBCOVdyL2dqZzlYZlVRWUEwTllNU3dvUEcxYnFLU2x0M0c5SnFYNHI0SEhZaC9kYkI3RE9TaUtVRWhnVEFqaFZEQWFPdVd2ckxJV2RXcng3L0NVUTVUREVNWkFTQUdodGc0K1V2VER2OUhvTUFzU3R3anBQWGZvNkFKWk01clZZZHNWdDFkRUZ2MGNjSEE2dHJDaGVIMjRQYk8yZExRTm9jeHJwREhKU0tpa0Z6RzZRSFJBNkhJL2pWb3N0QUFCUUFWZ0t0OWRRNkpVQUFMUVFNZ2toZ3gzRnpUWkRhTng2OTc0eTNyMUpJUVNocGN5V0Ruc0pyRENCV0VMb2ZzUnluRmlPMGtMaEZ3a2VBQ3lPbEtGbmpKR2lXeUNCZG1yd1JicUlnZHRqcFB3ZEVwbndLZ0FBTjR1U0FqY2l1SHBjYVFFUHJCWXA1V3g1RENybktXZkV0akhOclRsQTJqMG44TEFNSG9aVkFreVd0NmlGUEVhYTBtQ0ZQcUFvVzAweFRvSWlDWUVNN1RkYWovZlRCR0xjdUdLdGh3Q0F0bVo5c1A4MFQ4ZDVBdEJwVmVUWmxtR3hIUnJXM0Q0OEl5a1ZGU3M0ZGdRSXh1ZHdidFpCbmx2OGpRenQrUTd3Qm1CNTk4NHlBSUMxRjFCaFlweWY2ekZJbUlqVFRyRjJRZHBLZ0IySzliOE4vS2x0Q0FHdXdmeGxsVkR6RnBEKzhQd2dZTGIwb09ZOVdncGtBV2lGcE1TYjBHSUJnR2VRbXRQc2lwdXNjTngxaFFoOFROSllVR0l3alpRbW9ybUFHZmxjRlFBWVZwaVZXNlRzR0FCbzFpc3k5Q3Q5ZHlHNDlaR254UEkyc0FWaUVRVkZZV0FwNEQ0NHlOMEErZ1lNbnNOcklpWE5FQWVnWGdraFlUZXplU01PZlpZUSs5SVl1RFBBaE4ySHVQOHVrTE9xQ1FEUXlzTFdzdGdsVWF3OExPR0p2UzVFc2NqZ0ZFWW14T0pabWxmWTdaZ2FwRm1qNTBSTVdxV3NsWk1JZ3A0bXdNOENBRUJMQTlOQ2Fyam5CK2taQndrZ2d4V1o1bjVud3ByMlRpRUFvSzBabm8wWmhZZHdtcEFGMEVZRWFEUWlPRzU3WXNSemo0Mi8xN3huWE1GeENGTFhPTlJ5QXBacUZ2WWZlNTgwcjFjZjVLdUh2QTR4QU1BQ2Q2ZXdGN2FBV0kwRGExdHc3UW51NEptbUZ3Q2ZzUTBDWXV1dXVFYkRvWkw5d3FFVk5xUTQ0MFFMeVRGL1pDb0JBRXk3NG5MWFdJMnowUUlBMHZpakZ2SlV1ZFNxRm5kOVRSWUhXcDljMEVBN2pHOFNBRmlUcVMwRXY3c1Z2eTczM2V2SVZaamtabVJ3a0EzRVdodGRjVE9nTmhCTWJZQ01Sd05aRG9jS0wwTGN4YThVUzJPRmlKYnJrRmx5a0pCdmpQMjVOUWJ1T2xneEhIYUtCUUIxSHZRbVpRRmdvU2hoR0M5QkxKSkJnQlJKZWVyM2ZMMmZmeGxhQlVja3YybGh0QkVRdHBLQ3BiR21VY0dmUXl4NWh6SUFza29PUGFmb0RRVFNHRFhYOEVEQytZNDVmMGxLb2o5Q2hpelJNOUlDQUZ3ekJKK29RSm1zbUtXVUs2NEQwRzY4dTViOUlhRXMvbnRPaDhUQmUvd1ZoTXlRMDdBSUpOMDk4Q3dlQWZqSUVxSFpha3ZNWllpckRRQU93Yk84NzRyckZtQUtONll5Y3gwWHpnaHBVSXhiN0NUYTVJcWJTdlVhUmlMcXEzbmFEOHpSWUc0SEcxSXhBS0FlVW1aakFjQ3dLMjV5OTdkK0hCWUF3RXBWbUhMVjY0cHJQSzlSckU1RHY1akhpQ1VOTlN2YVV0RDkxK2dCME56ZE1RQWd6YjJUM3IzV0ZWZDNHNk81eXBFd3hmZEljdWZLL0Q5M2hRSWsyQTZZSzF1dFVhb2VvbHJOdS9ES09QUjdGQU9UcW5SSHJyancwckt5YjVwcC8ya01YTjU3TVFDQU82aUY2Z0JnVWFlc0s2NlN0cUtBQUhRMzN2ZWVnQ2VRQTk1aWVGcTJ5Zlc2Ylp3bGVlY25yclFRRU03TlB1elBVeEJhSjY2NFNBOVgwVVBDVkVaeG54OEhTSURqWkNDSU1pc1hnTWNBZ04ySWM2Z0JnR01pMUNKWWZoaVIvb1ZaR2hxWVlzRFdwcVJBYythSFpsMnVPejMvbjhjS2VjOWFGUkxxTXJqNUQrRDlMK0NNN3l1VzlKS1IrY0xldWtvQkFKT3MrZm9zeGRWM3dCdHc0a3JydUhCTi9CYVh2ak9reGt2SUVlaEM4TXBaRmVpdFBJRDlnc1l1ZWhaeUJnQjRrUkQydXdqcy8xWlg2SmI1WXg4T0N3QmdselZPdVJvbksrTVFYUC9aZ0x1eXpSWFg1UTdGMFhmSWVzVStBVmNCQVBvTVVxSVYxeDlOd1Y4WUtJUEF5Slc3a1BDMHFaQ3FOaVBjNkZpMDQ3NHJ0SFpGNVQvb1NpdGJiU3ZQMjlBSUpmNndoQTQ5Vm5ERCswbGxSaWtGUEtOd1JycU4vWGVnQ04vNUNBQ2dkVkRURGhTV01EMENBWE1LQW1DVFFBQzZHeStWOUdYMXdqdUtRdWwzZGowSkxhVnR5SlUyZTZseGVwbmVaV0loUzFydU9RajVQYWVYMGNWYSt2V0t5NXBaMmJ0R1JzMGFYVnNwQUVkM2VsOEVqeWdOQU5DeUg3QkVMNmQvWVp4WFUvNUlla2JBeGdXUE9DdGtpVnpJT3hEVFptQ3dwbVNQc0VXdVZkVGpJazVIcnJpWUVZZHdad2hvSVpqWHZHcVZBZ0NMejNJR0FCemo2cXNRRnVEYUZsYTZjdHJPa0JZSTVzeUpIWGhIMUFVTDVLMWtBaUNIWkN4UGVDVUFvQVc4blpmRjFPNWJBSUM3ckNGTGw0V1ZIRHBNZzdEUTd3dFg2TXdWWXRLajRKdWxOTG9OVjF4MG8xSUFJRVN1Y2NXYU9EZmMraU1rREprd2lNcDNIQlRxYWlRQXdOcmRYUW9aa0F0MDdFU1MvNFFCKzloUS9oTFg1TXBXSWlSRTJXbDF3VnNTaUQvY0J5QkxWdldCS3k0Wk8wMXVPMjMveVR3Y1VheHRKZ0VBV0IzVXJCNE1Vc3dKTFEyc1ZvbnpNcU9FWExTR0xLaFEyTk55cHJEM1I1VXcyaU1QTEt3eXZYdGtuZUo3bjduaWltV2E0aEpncE9WbDR4N1VpRTRiUkdRN1N4Qk9hVWk0dlVCU3ZVb0FnQjM2T0MyWFNhYzdDVUJLQUp2VktuZEtrU21vQkhBL3M2R0JhWEJqRkpPM0t1cGh5R0tYbE9lcHN2KzAwTW5oTlFPQTF3UTRNUzEzZ1R4b1dtMEQ5RktVMHhseVBPQ21aM0lwbG1oRzc5NGhlT0NRMjhKY3F3UGlzWWljdlJZUEFIWlphMHRJdVRxSFdCVXFoekVGL1VyLzc5dEdMajBqTjNGcEljTGJkNVZYQXR3bWkwVnk5ZGtLWTBieEpLVTVhZkZLak5uT0FhcGZjNlYxRXF4M2Z3Q3M5M2JGWmNnV1dDejVUNVFHTnJSZzViOUVMT0JUQUhkczZXcWR3VjQ1dlRtUlZxNXpGendES0l6V3lPcGxCYlJHeENrdEhXckZBQUNoRG1vWkYrN0N1T0wweW05SHlyeGpJU0RzK0JiS0o4YTg5MTFpc25OWjI2ZitMTjEwZHBsZXJKQW5zWDhrZUwwT3VLNFJHTEVDeExyc1dKcVZVNTF5d0o4STdma2V3eURRMG9JNVY3d2NBSUJ4MkJBQVFCQWVxclM0cTRSUnVLVzFkRDIwV3VVdWdaellkY1g1LzB2T3p2L0hNVSt1N2xabmx3bG5qKzFxSUpOaFVRRUFwNEZzaTJxRkFQaDZLK1EwRnVCSjdSc2dKVzFuU00yZ3lSRUFRSDRNZ2lNOEwxa2xSREFIMXh3a2VISExCUUNwT0FCUGlXd3dRSVF1dEF5MWFuOGFVN25XSzdYSGZvTmtsQU9aQmZmcUlSR3YwUExhcnlBRWdBSlJpRndvM0RuZWpmRkIzS0JhbFQ0c2ZyUUJwTGROc29hU2l0NklCNmFPQ0IvTVFFV1djQXo1VDlyZWNrTUxWdjY3NUI3RU5ES09kYU5GK3BneUdMQWdFSmZyWENaUWhCWFV0c21hN25ONm5YdGNTMnNnQUVqcTNJZXRiclg4WUd5ZEhDSkdUcEhiN1Q0QU9pYithVG5YVEI1aUF0TnpEOUl2U3lOL0c4allPQ09lQ0Zha1BJQjlxUFZoNE5RMXF6UGJ2aXR0Tm5SQzNnVm02RnNOc05MVW5PZ3JJeHRIQXd3aEFDRG5yeWNBK3JPMFh5M2wvOWp6cWpSUEFnL00vOGUveDV4ejdYZWFxM3ZBU0tsanJoRHZReTJrcTVFbnRWcjdWMEVDUEFzbzlGRFdpZVdsU05zWlVnTUFSMHFJNW9EZWs3M1cyQmhwQi9oSzZKbkJZbkpGelh0U0FnQk9YWS9PQXFoemV1dEl0cEF2RlBmckZCR2htdndRNXFYRUlEUWhpQzdRTXlVbEJwdlJsQXNBamwxeGNRYnMwclRuaWh2amNQcUxJS24rZ0VJNmM2V0ZIdzRvN1NQcDNXOERBZk9Wa29QS2FYbC9pU1QvUGZIZ0lzUm94alZnNVQ4YllMcy85ZUNpamxKVmhsMXgvdjhFdURzWGxHOWhaRHhPWUJFUCtHdVgzSlJLdXk1VWdiRVhZb000aFBzeG9jVDdRdlVyV2hYcjN5TCtZU0diTlZkYThRL1g4VktaWEhaZisxTGhpQnk0MGpLOUM4VCs1cExhdkgvUTdXajFabDhCVjcvVzVua3J3aUlURDFWTUZrQlNxdUZ4UXFwaFdnRHcwc2piajVFL212Sy9aU2prck1JM09WSCtQa3RFVGh4V0pzT2dvVXlaL0RoTEtXeW5DckVXTGR5akFIbXlXZ0FnSnV0a0lBQUdZd0ZBVEdmSVVBaGcxWlVXVmpvazRIWUVZVTZVUWRJUWFCZThPMXF6TmZUaXh0VCtRTjZNaERtaTZ3Qnd0VFdORVk1Q1k1T3NGYkVjZUxSRERBTGRvR3g5WXRPY0U0b1RiMWVCQkxnTGgreklGVGRUT0NNVWhzVlhCaUIvWG5OSlo0Rk55MjFMajRGWm0vVHUzM3VCZ1dUQVVLblUxNUhrUDJuWWtjUm9QcU8wUEZUK1EwQXU2b0RVUHdFQldnRXBLZTRoVlFDSElOT0FCZjZwa2ZldENmdllycFN4QUtBSjJNR2NHOXdMZ0NZMlhWUVV5ZE9BOVorVVlqbWlaQlhVdUVMamxVOE5Ub3FXVWl0elBrOFdQT2ZvcytXTW9JNUJ3QktFZURaZ3JMblNHdmxhcFV5eEdtTnl2ekc4a25ISnhXSzQySkFHQUVMQURjK2VSbG9PZ1kxbThJcUo4di9HNmFWNFdabWZRUGdFaC9CZE5BQ3dZM2dBTEdERjN6MWhaSFloeHdYSnhxSG1VWlVDZ0l3cnJmSEFDaDFyUFBRYjRaMnpGQUFncVNxa2xYV0NZUkMwNGs4QUVFczRaOHVWTnVrU0EvRUlsTDlWUDZjQjVyWExDSldjRVpoZkFROTNkQ1hBVm1DcWppc2toak55MTZMU0dRUkJ6NlBQRmFvcnRScnhaMjZlSUozNnRzRmx6eldxdGFJZlNSd0Fkc2xqa3lBcjNpM1pERXlLeEk1UUJ3bjNqQUVBMzNyMzdpTkFmRjBLTW1ZeW9KYWIzMFl4NCs4VEdNMGh5MytJMWpQakNsWEFKSjllS3lFOUJPdmY0OExsUVpNQXdLcEwxNWt5bHlJRUlLUXBCQ3Y5a0JxVXRsNkVDTVRuQWVzZjB6b3REa2UzSzY0cmNPbkZ1V3lOZk5sNy9VT1hycXp5aUN1dG8zK1VFRHVYY0tDc3JYaEl4aUUwSXVFZEdmTXVYSjlpaGx5YlNRcWQxMHNyeW5KcXVLWkY2TE1TUDZTUUV6T21Rd0FBaTg4a05ja1JzUFlaY1ovV0ZUZSs1ZWJuK0Q4UHJYNUdhd0FBYU53S2pXQ0xISmNkOG1SYVRaY3FCUUJheUk5VG43RUkyWkN6cXp4cTRGRURBRm1YWEJiYWF0UzBEWW9XdzJMSGxGS0pvVzVOUDJ5NTRyNDU0bFhCZWlXMWxHcXR0WTdHTEo4ZDBIZXB1Z0ZtbkYxdGpkTi9aQk5NQklhdzdaRVkyT1ZLYXpKTGpIVlZ5VGRkVElId1lraUFtekE1V09SbFBSRHZma1hjaURFQUFhc0o5NHh0QmlSOTc1OG9xVU9UTHR6MmwwbG96Y1FZL3phQjBYeWlzUDJ0TlIxVGlJQmFFeW5wdHpEcUNxVTJSMXhwdmZnUUFNRGlVeXVSUXdPS0lSSWdWa3JEYjVSM0hsTFM0WElSQU9BbHhKS0hET3YvM0JCdS9ZYjEvN1czL3Q5UDRRb2ZnYmxQVXlPanlXQ3ZUd0lKaS9jR0E1eFRJMFFsb1kxK0k4LzZ3dUMyakJoWlJGb2FzY3doRXlWbHJBZkNaZ2dBdE45dWtBd2NCUEluZXQwdTErdGo4bm91RW9sUHEvKy81UFQ4ZnlZQUxpcVpPYzJCRUlBV010UlNiRThVc3JIRk5STDVXQ2tBNkRFOEpXY0srSmlHa09JU3hlR1BBakY5Qk9GYk1MOFdBT2ltTENGdTNMTUpzZ1Yxd0xZcjdRNFkwZytvL0VWWFlnOERKSWVIUXRIblNyZzdHZ0JvMWNsMlhYRy9hMlM3TDBTTWVVb05iQ1Ayc2hEREZpR2ZsU3RPYVN4OUMrM0hwQUZxeW1RSlVzVzBlUGRMWU5BekNKZ3o3cmtNd0NZR0FDQUhnTk9RWmlJc0s4N05mK2JqODVlTThhOENLVjNuUkFaTFdsTk40R2h0cEhGTnB3SHNhUjNqTEE2QXpQT1VTKzVPeWZVY1l0TUFCMEVJTGlqdlBFVTV2WHNHOFl3QkFHZHphSmFOMW5wNlNJbjlzL1gvQjFkYWwrSklDUXZOMDl4elA0QlFDS0RWWUs5THU5VVpZMTJSajVBVW90S0lkZ2NRT3RDRVBvYmZqbHh5bGNxMHpPODZCYmd0R09kYks2RXNKYVp2K1hQM2tTdXV0ekVKKzhySy84Y21YeHhDd1JSQ0FXTU15RFd2SVFOT3pQZWZjcVZGdHM0QU5HaWNMODVRcVJRQVdIMVFOR0xyTW1Uc3JEdTloNGJtR1JseHBkVTNqd09obEZEbURucHNWcFg5dFJqUURhaHp4TmhDUXhsSjlBK2RYcHNDUTlIYmhoYzZGUURnbU1xMnd0RGZVcEJ3YUt5Umt1NXdwY1VWdGlsK3VBd0lOOFRTMTlCK2JCMEFWaHpTRlk4N1NZbnlmMFpwZEFJQ1JvQTlydDB6RFlFSXN3QzRleGh2V0kyOHhZcEQzTWJmNWNmbmdiUWd2RmZNQ0xrY0Z3RUpid0xDeFFPN2FzU2hOVEFqSllxMXdoMDhwaE1BZ0ZVSWlLMjhkY2dTV1NKQmcyZmloUEoyMlJYTXFaSHNzdE1LWUkxQmZQd1ZLQk54SjMrU0gzL01qOThhMWpDKzF4WjloNWFCb1FHUVFTQzA5U2xlb3czd3p1RWN5YnBpWnNPQnMrdFROQ2docmxBMnd6SThCNzFYU0hyVTBtRFRNcjlmR2lHQTdZaHdFb2NBeEFQUURtR21RWU8vZ1VCTWN6Y2p5QnlDa1hHRmhqSGlNZzZsQVo1Q0NHUTlRZDYrZHNYdHpyVjA0R3A1QU5xVjFOWk5WMXFuWUJkQ0lKSldyQlZtMHNKcG80clhJQVRpUXdvWDQvdzdJTy9XSUkxZGFtT3dPNTUxRGpjaWFvQVUwcnRPTHlhR2xWczFML1EyeUlDNUdBQ2dNUjR2Si83UFJHNUlNelEzdmRhYThzQVZxc050MHdMdmdVQTRWbHhZYUxHazZRYklWYUFHd1JYVlRzcS94aXRVQVFIU0lLa1BDRzdhUGRNQWdQdXV0QTdBaUVFQXpDa0NqTWwvckRnMGwzSGF0YlhjM1ZxTS9KRGlVUmpYeEhRMHpqM21Gc21kUU1penhuQWtBTkJLQVhPY2QxOTVaODZsajZtKzJFeWtIVzdkZko1Z3VkWXJ6SCt4L245bGhJYU9YSEdOamgxRldISU5obTFsSDNXNGNQMTY3YXp1UUpvVWQ1UFRRbFIxQWFHL1QrbVJPOHIrT1ZFSXlScUJNaTN6TzhRQlNDS1VXZ0RnRmV4bGk3eUd2Q2JrYVJ3YVlFTkdweXYwelJCU2JxZ1EwRG1sWEd2Ny9CREErWVVyTFh3MXE2UjlWd29BbXAxZUpoc3Q3ak9GRU1uRmpkYkpzMlB0aFYxWDJ2Um9VZ0h4V0wxelNyRzZqeWltdjB0cDdGZ0hBSi9ET2djYkVhSHl2d25rY0FrclluTzBxUWd2OUJTQzd6UUFRTmp0VWk4NnpkQ0VyOFZpUEhYRk5kYzVOZWFNV0pWY0oxMnN1VFNsZ0xrT2RCY3czQnZoTU5WNGN0NDlBQUhTVktJdG9LRFNBb0FhZ3ppRzdyQWtseWVTLzFoeFdFMVVZdGYyT0NVQU9JdFlVeXZ6UWhScGc1K1BGcWMzOE1DeXliRUFnSnNCV1N6eG5NTEdQbk9sRFZNNERWYXMyeFpuZDV3OFQwaVBRMFVpZWY4UysvOWRmdnhDQ1E5dEVGZytNZWIrekJYM0JMQUtBYlVIY3ExRDYzb1NLWXlmRVNlSTJ6d2ZBQWc0VXA1elRKNk9PWU5BbVpiNW5RUUFMc29BQUpwaW5EZmkvL05HL0o4SmJjMmdwUDVXNWMySC9XSktBV01USFp6Yll3amZISUlPT0ZaSXdnZ1lZd0JBS0gyeDBaWFdFcGtIcjlVK25FTXRVd3dyaW1KdGhxN0FYdGdMeUo1WEFZVzdBT0JrVnlHV0h3Y0k0Um9KdVJXZVYwdksvMnN2QTdCSFR5dThVNUlYbXNNTHpXa0FRTGFDWVZsZkdrTVZOOStKc3NBNGdXSlJhSFhTTlVXUWMrRXlpZElKcXRsdndwZVF4L3ZBVC80Tkg5Tzc1eGRIV2lkYkNxb244QzVKcFlBNTN4TUpNVGxBclVua1AxRWNueG1rc1hMV05CWUFZTk9mMEpydXV0TEdPbWhWUFBQZjg5SUxaaDR0enE0cG4zVng3WUMxVkMvcm5iTk9iNWd5Um9LNUx1Qkd0dks0TVQwT0N6amRoRmp5dS9ueDYvejRGMWZjbng2RlBBc2svSTRqK29aUUtXQUxBSVRPYXRMOGRGRm1BNmRKWWloZ0U1NTNiRHhuaStTQjFwVEprbW5sQUFCY3V6UUFJT2xjbzdmRSt2dFplczlHZjkvbkh2QS9jb1dLcTFZeklOa2ZCeEZydU9PS3k5aml2R2xuNm9IQ1ZwOGdKUjRxWU1TMVJFWW9mUlZkNlp3cHB2VVVHWFNsL1dqWXM3QWVrRDMxaHNMRnRGck1ZT04zUSsvbnBpdHQyb1N5U0hUT0V5K1RVUGwvQ2dUeFIyQ0F4bnFoQnptOGtBUUFjSUlxSFd1S2tzSzR0c1JJdHNodHdwUElMUDFKcDdjYkhpWlg0amFNVFZmYUtsU1lsaS85NzJ2OUlqeUVQTjd2dkJYOWpTczBlSG5nQlpod0ErcEFTV21XSDcrTDVuTFNBSUJXbzM0YkRsQU0rZTlqcnppU0twSEZqRTBqVmpaSU1USThFTnhJQkE4dDF2YldNaS91KzNsNTdOY0ZoMVd4YlNOaER3cTZGd1dMYVQ2YnhrSGVJM1p2a3JCNXBpZ1J1VC9QcDBZK1FpL09EYy9oK0NBLzNzbVAvOGlQbnp1OTNTc0xwTjNBTjZ3QXVVNXJCcVJ4QVBDczdwWXhQMWdmWHdwSU5VR3E0WWdyVkpGY2hwUzVuY0EzekpNODRMYk1JWm1temYzTHlMVmJkOFhGazdvaUFFQlhJQ1Z3QTVqOTZ4R3BmdldnTU81N3VYVFRnLzVYQ2Z0ak0ySi9yQnFLMnpwVEVzSnNKTGE2WkhrbGxUQis1b3FiMEdWZ1A4d0NZZHpLRkJPQzVCanN0M1lJaVQ0aU56NlQ4RmoyUERjVWJnYXlZcVlCQ0t3WTc4YUVhQ1loeTNrUW5YUGJuL212dlBMLzRHZlg4UWMyL0pTeFlPV01CYWMzZUVGMHR3ak1jWjdBdFFCTFh3NDd0cnNkZE1YRlNwYUpXRGhudUZvZit3VjQ0SkhXRDk1OS9vMFh2aDk3Uy9vckR3aHUrUVBIQ29vUGV1aGRaaWx1WEFORWo1Z2E5Zk9SNUQ5UkhLRmE1TEZqMFhDMWFvZGQxblF0c0tiQ1VoODNNaTl1K2dOeHgzL1RYU0RGYUkyVFpwVTBLOTZEQ0pUdUsrc1Uyb2ZMSkd4R0ZXRWpIaGdtY3M0cDc3YW9XQis0am5mOE9vb1g1NUw4OTIvNThULzh0M2U0NGxMR0xKQ3NieERCTittL1FTdGoyK0pLU3dFdkJ0WjFOWEorbmtONjZsUC9yVnhGY3NJVmwyQmVvZWVzUUFyY0JDbC9USjk2a0NEVHREcjZkU25XYmtaeEd3dXd4Q3dBN3BlaHBRVEs5MWgvejVrMzZPbjczdStUci94ZXFRdnNqN25BL3VBMVhJaVU2KzFHQ3JPa2UwOVM5c0tVc200UEZZdTdIMUowSjEyaFF5RU9URGtXVnplZlIrSFNaSlNVVmlIaHNleDVZbGpkWFBNRXE1ek9LVmxzbkJJOVJDVGtPampyb25PKzhMeXRQMTF5ZnE0TEFIUXBFMVRwWUFIVG9zUXVKb0daUDJzc3NNWFNsOE11UkQyc1dEYXRES3QzK3dPdmFHNTY5UFdOdC9vLzlmSHo5L3hpZk95VjZ0Zit3S0dDZWdBcGZPMEo3ekpGNlR0dHJ0QTVEdDJpb1JyMUUrUUZDYkhHZitQc2JtUnB4N2d5aDNqWUorQjl0VU9oSGRwQllCUWorVkk4TDkvNitaWTV4OFpKUEZlVEVYc1FEN2lzRThiUlpvM0RQTzN2SjNVQ1FzS0c5OEY0eEh4eTNYOWN4L2U4Ky85ZjgrTy9LMEorSUZJZzRUY0krMWdyWXlzRUtIei95Y0M2c3JCTG1wK2JmcStpNVNmQ2RRZ1VCNitIUEFlL2dlVkJMZkFuUWpLTmxWQ1RjWWJIRGRrMlJ0NE41dDk4NFFFNGQ0VFVVZ0t4dnNKa1JLb2ZBNDNQdkh6NmszK2V0VC9HVXlpc2lSUnluZE9ZSlZ0SytxZ00wUmlnZGJ0RHlyYkZGUmZwRWhmM0dBMHVPdFlGUEM3WmIvZjlQSFhSK3pBSmo0bmZOd0VFMVBvMXhLcW43SDduZHh0MWVsRTBmTlpUV01ldlFlZGN5dTNmWDU3NTZ3SUFyY29FVlRvR1NjQm9zWXRCVjF4M1hadkVZYnFYc0xqeHNOOGhkRGFzREU3eDR5cHJYM2tGLzZsSDd1OTcxdlZ2L1dMODBSL29UL3gxWC9wRnU2R2s4U1c5eXdDbDczRDN1RkNOK21FRkNMME1zTVovNllvcnVsV3lwdkxlT0lmYVlSOHhEc1dZSzI1UzBRZHIya1FIOENNLzE1OTZBZmU1QndGM1hISHJhcG1yVE1RZTVPSTZuVFRQU2ZzUVU2ODZBOElHOTBGdllONTVQcFBXOFovejQ1OUl5TGVSUUJxT0VFaWluR1gvY0ExN3NjeDVibVB2blRRLzMvaDFmS2dJMXg3WVM3d2UyamQwR1BMZ1JvSk1HMURBdzVQSXRSdFVBQTQzYkJMUERhWnhjVW9ncC9SWmY4K3BmbHdkOGdNUEV0L3hDcVVhKzJNd1VxNDMvdXp0bi8rOS84RGgwMnFpbHp1NktFWGxpU2N3L2NLbk12M09DN2IzdlpENzFHL21iN3p3dSsyRlVZMy9iYTIvVDZPQ3hQb0JZZUdCYmdZa0tUV24rK0c2VnY5KzlWNUlQZlVIOXI0L3lCSlhFNVQ5a1VmWjcvckQ5aHNmbC8wMy84OTMvR0ZFWlNXSy9SVzljd1lHcGlEaUlVZHI0a01QUkg3cGxlUkxWNmhTS0JrSjNaQ1ZJUE1pYzlNTHFVT3Rpc0w5QVFTS01FK2YrbmZueklmdXdETTRzNklGaURnaTlQSDlXLzExM1pIdi9RcFkvUGplU1h1NHkzaEdMK3lITnJnSDlqWGdkK2xRRkdmTTg4dTU3NzNJZS9jWTM0WldFU3JjSm5Ccmh1WWVuOEhndXhuV0xra0d0QVN1N1NiQThOeUYrelQwd0h6SisyQ2FibWZnT2ZLYnBQdmo5NmI1enVhRTcrd0EwbkhvWGZrZFhwSjFIRE9QcnloYnFWSjUzazdXYTh4YzQvbC9hRmpUL1FFUVBwSUFMcm41MHU4VkdmdzR3YmlLTWFpUWlIc1h1R0F2WUo2N2pGVGxicEx0VHlEa2ZJdFNSYnNvMWJQYi94M0t2eGV3Znp1YzNvZEhHNWpwOW9KTEFZY3MxbklHVzdrdktsRDhMdzNGUHdob0Zvc3FkTUpCN0lOWTBqaTREak1WQUFGeHQ3MEhRT0IzZm9OODVLL1QzTlhpQWh4MWhXNTVHQjlpTngrV2dmMEVubGRQZ3FCUHNkSmlMU2NFQWJmOWQ5YUFra1pCcWJGTytSa21BMVVSQUIyS3hhZmRreTJ1WmdXOHhIaUEyS29jSlk5RWI4QlN3bmZSWE9jeHp5L252bzhqN3oxa0NFOGsrTldTeTUxZHJOcWVHU2FQRFFMc05KNHVqT3Z5ZGJJdjBWdVkxZ3ZXQU5adXhuZ08vaWJOL2ROOForaGF2R2ZTdTJwZXk5YVU4eWdlaDRIQU0yS0g1a0VOdlQ4WHVLbFg5bDhmeU1NSkl3dzNBNkVyREM5WkhSai82R1hsMTE2NWhrS0dVd2toVlNzVjk3SC9saGNRTXVxaDg0MER3NXl2Z0hRdTJXWWh6NURsY1VMdjNFRGtRRVB6RlFLQXBQaDUycUhGdVJzcVVQeXM3QWFKalRrSHhDYk1PZVowR0dGalRsVUJDSHhPUUVDKzZ4UC9UVDhRdXg4SmF6UCtYZWFKSVlwdFlKRWc4aTJFSnY1RXhLa2hBQlFZcDUweDRudGpCdkZGbWdmZEJPWGZuQkJIMUo0eFF6SFdESkF1YXhOaXZoeGpubEhpMXRaN3gzQkFKdWk5dGRqMUNKQ21aZ0o4RkNiUHhUNS9XcG0zMEgyZlI5NWJFNTdUUkZURHVkZElWbHE4ZlRvUU0rK25jeGlTQVJsYVo3NTJsTklGMC9CZ09wM2RhOFQ2VGN6OWg4RXJFdnVkb1d2eCtVbnZPcTB3MUx0U3ppTnlEcVlxbE9rYWh5cjAvcE5LZWludlArd2hnZ1RXRlNKOWFnUlQ3Wnc4Tkt6L09rVUdJOEZhSTRUV0I3d0E2SW5tUm5yVFNqNytPTjFiUEVCWXZFbmpob1E0SjhoUjBmcndhTDFja0pqYmhnQWd4Rm92WjJoTTkxY1ZLdjUrUmZGalB1YUtrbllvdWN5U3lyUk9MT0pLZ01CM0JBUStBMTdBdDdENXRCN2owdkJqSFZJY1o1UjBNS3dGLzdXLy8rZXV1TDN2SkJ3Z1pHcXZHQ3gyTGZXbHlSVVhuM2xKWEFabUVtdU1jS3hBSld6aG9pcFVpZ0FZU1dCOXg3NzM0OGdzRUg3R0txVVNUUWJTZTVCRnI2WFB4VHkvblB2V1I5NTdVUkdlWERHVGM2MDV6U3EwbnBxUXhPeVNKQm1BdlViNFdpNFkxSll5RTZiSGxWWVdYRXo0VGVqK25EVVUrNTBEQ2RmaTg1UGVsVk5rZTExeFMrK1llY1NDVVlzVnluTXRpeXIwL2d1dXVNQlVxeXR0TWpVSmUzcGR5YW5mTVZKTXRYTWlLWFVoNjU4clQyNG9LYUV4WG9BbVY5d0N2Yy9aZlNlV1hIR2hJUzJjWW1XSGhMSk9NRU5INjhNenIveDlVZDBTQkFDaHZQVnlobFZlc1JMRlA2cWdSY2xWbFJyUlhKeEREamtXQStGdVRXbUJ3Q1BLdlJVZzhLMy9ybHQrdzBocVRLaTRpRlNrMG9xU05BQ3IrQWZJVlBpTzBwVG1RWEJqd1l4US9yUlYvRUtlMTBRc2NNd2w1dHJUdThwaFZldFFHd0pnSHNEWmxuSlBxMXNqZXBacVhYSWRDQzIzWE41WmhJdUFLTW1YM3FGckpROTZVYkd1WStwUTRQTkQ5MlhMS2VuZVdyRVVyWEFUc3R0eDdyVkNLN3llV3Q0ODd1ZXRCQmtnTlFWV0ZYbUJmVU5rcjhUVXdrQ2hqZFlkOWhyUjZtZU1KTnlmYTE2TUpuem5FaWc3NjFwK2ZpYndycml1MkhZZFczckh6Q09YWGk5WG5sdDFWRUx2ditwSys3VzBneUUwNllvTFAxbFY5V0lLV0dHUnFSanJIMHN4YzV2akdDK0FlRVV4YkduMW5jRENTVlk0SmFsbHRGWjNnbXQwY0IrZU5aZlFBVk1EQUZpNXJwSktnRmFsckJzVktuNUJ2YWo0RHdQUDFBQkF0Z3BBNEprQ0JIN3cvMTNqLzkrakNBQndIQUVBNUY1U3ErQ09LNjJBSiswdDVmdndFSEdWcjFENVMrRWRZS3hNVUtac05LbkhubFdlRWV4RUZSQUE4djVZUVJBUC81NGlFTG02WEZJbFNLa3VkK2hLeTNYdWc0Q1dBOHpDU0dxeld5VjBrNTYvWVFnNTY3NG9pSkx1emVWU3JkTE5uTisrYXZ3VzV5WVgyS05hSlVXcjRpVlhGY3dsN0JWVzBBZXV0Qm9tbGxIR2pxWUNsQTVwbmtJQUFLL2xYaHZjZXo1bjNIYzBjTzFPQWdEWWdiTXI4eUxnWWdhNEdiTnc1bkZPZGhNQUFIOWptcUZWVW0xUlpHdlNma0ZYT1paK3hqNFNXSGt6NXdyMS9xWE1OSjhUOUJvMXBMRCtOMTF4UTZBMFhvQWU4b3BpVjBWcytvWFZTS2NDNFJTdG5IcVNQdVh6eEgxNHR1anZTdFl3QkFDeXJyeHFjZHNKQU9CdWhZcC9uUlMvQ0UrcjFySjJ5UFpkYVduWFdDQWdUTjhHQlFnODlBcGJxZ1BLcUFRQTRIM2tlWStkWFc3NDFKWFdzNWY2NlZMVGZ6L2dvWkVDSXh3cld3RUZLcytST3UwNUVsekhBYUZ1Q1lBREFCSnl2MFA2SmhTSTA4ckJUK29GSVVMbUJCU3Y5RVRBKzJPSHNXUDRKdW1NbVhWNk02YWs1M090L21OWWwxTkZFT0ZlU0xyM2dRTEVOQURRNit5T2E1cnd6U1hzMFRUMThyVytBcWVCdlpLQmZTTDlNS1NGdGZURHdBWmZHVkNRMkZsUU9oTnk1OFlCVjlxcEVac01JY0RRR2pxOXBybVpCejRCWDN0STh6R3NoQUN3YWMrRksyM0RPdzNYYm9DU0NaME5EUUFjUjQ3WHp1NmxZZ0dBcEY0TFZ2TW4yWDg1OG9wdEF4aTNtbGh4YWQwMDFqL3U3elJlQU54clN4Ukd4SVpydUxjWEErRVVEUUJjdUhEdkNmUUE3TkRaMkFBQWZHNnRZUXdBU0ZNcGJqa0NBRHl1VVBIdktZcWZYY1M0SWZpUXJZSVZXdzRRNkRXQWdDaitlbGZvQnRjQ294d0EwRUlEbjJjQkFPN0N0dzNLVHpaSTFwVjJSNVFZblZTaDAySmxlM0FQYkNpenJjVHVMS0VlRWdEU3hZNjd6RWxUa3B3cmJ2ZVpwaG5VSG9DVmZYRFA3WVBTeW9FVkp1aDlGNzRwNTBwYktLTUZHdlA4STFvajdiNWE4NWVrZTZPSFp5OFFBdEM2MFIyQmtOZ3oxdk5OQUlBK1YxeU9GNXNwSGJuU2JvemNhRXoyRmJZTVJ2blFwd2pSbkN2dDFEZ0Y3NEN0ZFM5Y2FWT25TVmZhKzRHYi9TQkhhUUJpdjh2dzNnSTQwZUpkSUVNbVIrQ0N2V1BkQ2dEWWlSeUhyclI5Y0RVOEFKb1NQb0x6aC8xQmxzbmJld2lHeHdFWmZOamZKWTMxZitwS1c1SmJYZ0Fzc3NaN0RjT0llQlprYjY5Q21JbkRLYjFsQWdEdDdPRiszS2dXQUlpcEVEY2RDUUJlVkVueDc1TGk1MUxCdlpDNk5nQXMyTGtLZ1FDbS9DQVFxSS9JNjAwREFKSnlqVFVBZ1BGeVBFQ3JKTGlPbk4zWVI5QnV4a0RMMkc1VzR0YlljMTY0Q091R0pUdWdXSFhZNVZDUS9SSndQTmlTMjFUYzVDMEJKWWxXN1M0ZDFDMFNkaEtDMklQdld5R0ZvaW1Jb1lqbjUraStxNjY0STl5WnN4c1lKZDM3RVBidFdvQUVtREdzWGhRYzFucHFSTldyQkFEZEFhVis2a3BiZzF0Z0lhdDRDL3FjM3EyUkJlWUtaRWFnRitJWXpnTis2elM1LzQvSi9ZL0tCZE9DSnhTUDJLbWk0RmRJR2VZSUlFeVMvTk1zMWREWUlvOVFWcmsveXZPMEhBQnVob1RmaVY2TVdmQjRNT2k1TU9aVTNPbHByUDhUQ0RscVhnQ3VIaXBlZ1ArL3ZUTmhydXJLcnJEL1JGSkpWeXJwVkpKT2R6dHhPdTYwRzhkbDQ1SFlRR09NUUF4Qzg0Q01FRWdnQ1lTR0VwTFFBSGIrOGczcXVpZXN0OTQrZDNoNk1yVDhmVldudXNxTjdudnYzbnZPMldjUGEwOVorSFduNkd6QnZWNTB0aHRlbHpCYjlDN2tRZ0FITFF5QVhadFBhZ0Q0TzlyYUFLaFNoNXRzWVFDb0dNNXhOdjZWWU9OM3FlRHZyTlpXWlQxN01RVHVXN21ZR2dJRERldDZteGdBVFhRVnRHRlFhays1WEhRMnVYQ1g0WFpSMzlvM0dRQVRSYjZQdmZkNjE5S2ZlY2wyai9xRzV4WUFuNEQzSlR2NGFjYVM5ZStlMnlSOUlkT0tBRzk5L1Z3bTdaTDhqdVVHRzF6dTgxL1k2U1psZzN0UCtCYzlHQUNIY25wWmtmYzBWd1lZNWNTNDIvdWgvTzE4VGFucVNSb0ExeXZjK241cXUxZDB0OC9lQzl6NTM4djM5K1prYW1DNGE5Ly8veDE1ZDMwemF1TCtIeW82bS9aNFRreGFSdy9sTjZ5YWgwQmI5S3JyWDV1a1JiRnFIeW1uWU5VOGhidEJDTUpQeG0yckFLYUN2U0tGNE54TE0ybW45clFPSEFaZUZhMDJhM1A2MzdabjZ2a2M2YmU2THN0TUpwU2dYdGhOeVpmYWxmQm05TDJqSk1CTjhiUkcrMm0wSnV3M01BRCsveHB0RFlCYndSaHFhUUM0R0U0dkc3ODJrdEdOMzZXQ0w5cXBYRVUvZWpFRWxqT0dRS3BEYmxMWE8xZGpBRFRWVmJndUpUNTNaZU85SjV2Ym9wemsyaG9BdVltYU8zbE5TZ1owRWpmU3V2MjBJRTBGN3RTWGRwTHg4Y1FNaGZYTTZhTEtUZTRMV1M1MnVTVVo0UFB5Zmk0ZHd3RHdoVHAzM1Y0TUFJMFRMNGluS2ljRUZMWDQxZENRZWtnaUE5dkZxazdTQUloS1ozVVQyTFBGTkRJc2ZYT2VrVVZkRFF3LzRYdmVnSjdNRGlUVXNoZHNSazNkLzZyWHIwM1MwaWF3SWNiT2M5bFFJdGYvdkNYR3BsTnJsSzJ1WWx2M0xNVDNQRENFbzdiTzZmcHRkUUQ4ZlhsdWVRYTZKbWtPZ3h1cytueDhyclNOL2VkeUFkellWUytBZDFmVjBPZTJYR2ROakF3TnpYcUZsSmNCUGpZRHdNT05OeXNNZ0UzeDJtMVZlUkY2TVFDdXlCam93UUM0VlhTSzRSeG40M2YxTkpWUlRWS3hxZGNManU4QUFCYlZTVVJCVkxsRThnWWN4eEJZRHd3QkZSNnFxK3ZWRVJrQWJYUVZ0TjNubmFCQ0lpV0JhSEptV3dQQUorcVBnY0Z5UjVJa2g0cE9pZU9vMFViVmhyRlpNWm9rR05VbHlqMlNoYXhKOHRKc3l3MnU3dk4xb1o3cWt3SGd2MjFhN24wa0JhejF5by9Nblh4b09SSlB4U09RTmxndHV6cHBENEF1NExOQmh2V2huWTdtQTNkb1ZhejRXcEJuc0pZSkhmakdzVkdSWkJpNS95T0ROWFZEMUNacDA4R21yQ2Z5YlV0RTFkYTh5ZE9tcGJGZXI2NkNUSE1aWTJQUHdrSGFqZEN2MzFZSmNMckNveGJsR1l4azNwdXF1ZExtOVAvVVBEdWFYRnJsQlhDdEJ3MlZQWldENDZhRjVwYk1PeklsKzFFeVVoN0pvV2N2WTBEZUNBempuWi9LQURoZmRQZGpiL3EzL2tDT3MvRVBCeHYveGZJaEphM2xMOG9YNG53ZkRJSGR3QkRRaDFKWDErdEREWUMydWdxdWNQalFLaVMycER4U3kybGVOalFBWmdJWDlZL0IzMm84T0lWQnJrdkpuL2NjeUYzM1FGelJ1Zkd5RHdiQW5EenZKdG5ML1RRQTlQTlB3Z0RRaFhOUTd2K1Y4dDMveHNvQUY2ejhUTyt4ejhObFdiUjBVVHhKQThCN3k4L0w2ZHBqd2NzVzB0blBaT2hyMHVnVkNhWGR0VkRab1NVYTZvbHNSeElsdDRQRTJwejdmODdjNFovSlp1VnFjbHA1ODB3MlBmZDhlQ21jU3MxK1VYUXExdDB3VDhPQ3hkWVBKYjlIUzI3VnVFaWVuOVRXdVcwdmdPZ2RlSm1MVWZkb0FEUTUvV3RpNkhJUFhnQlhlN3d2ejJ0TDNrc3R3VXQ1Rk80ZHVSbUVSamN0dDJlcElwL0M4d2JXTGI5b1IrNVZoNWJBbXpBQVJnS1gyN1prTWJmWitKT3IzemYrejBvM1RXclZlN1pQaHNBemllTnNCYjl4dENJck5qY09HdnlibmN4bmFVM3dFN3VYKy9JQ2JZdEI4S0tsQWFDbm1SOXFZdkRwdnVZcUY3NnFtTXh0ZENjd0FPb05nTFRvdW02RmhvN201TVM2SnUrcmJqYlBwVEpqSlNpVE9ra0Q0S0tzTVJPWjhqcU5lVDZxMkpUZFdMMVVicFEzR3BZRHFxY2tuZllmVzZYQnVzWHZvM0pDVmRFN1czUjNIOVRUdVhzQi90ZThHbzhrcktHdStkUWkvVk1MTTZoeTZJSTg5NTBnNFhDNTZCYmRVdU1pNmU2bkptRlhnNkh6UDJuMVJ4NkEzSHQ4T3lnRmJXSUF0RG45UDVSM3FvMFg0SVlacHA1RHNXVmhsZTNNSExwbHVWRzZtVzlWekx1clJWNDhhRlc4VmxxaXYrSmVoRGZsQVhBRm81T3F6VCt1MkpCN0ovYXM5SERGRW91aURPdTZzZGZ3MzBVSm1YZUQrdUVEMlNUWHhNWFZOZ2NncWpGMUQ0Q3J3ZzBXM1YzSDB2TkpDMGV1ZHJXdDdrVDArUmdBblFaQTZqcjJSZkZhUUdwQXduQXpGZVd4MjBISlozUVNPVWtESUhVRTlFM2FOUUYyWkQ2bXFwTDlvRHhQczdvdmxPdkZZRVU1WUFveHJNbzlWNitDYm1JYTY4KzUvMmRzSTlFdW9hcTZxYWZ6amFKVEMrTkZFZXNEZUUrRTlPeTFhY3hrMGFraTZLVjFPOEdHbzdMYjdrMzZzcWp1Z0tjaWFzbHJVSlVERUhrVzFWdWxjL1VnS01VZEs3cDdRdFNkL2g4VTlib0FrUmZnZW1hOWYxNTA2aFRvUGE0cXA0dzI4eWNWbnJmTFJWNCtlRkh5d0xSTWY4RVNPUWZmaEFHZ3J1dmpsdVRWMWVhZjFNYXZwWWQ2UTkwaVhLa1puZ05RTmJ6UGdidEVkK1FrdlM1bGVBK0xUaEdRT2dNZ3VlcWlFcE1mS3R5cVNYZGN1NDRsc1pXaGlxUXhkZVd1eVhldUc1RXVQUVpBdHdGd3RNbDhWTlpHLzZIb2JNSXlFM2k4bGl5T3FXR2pLSHU1NmYxUjJlZW1Cc0M1NERRWHhlcjNKSG5Say85MDh4MlZ4VE90QzFjYmxnUHFwcjRtc1Z6TjF0K3VPR1c2K3o5MXh0TXVvYm91TGt2ZXpxRVk5WHNWNVhtVFFSaGdNTGgyazNLL3UySlU1UEpKdmltcU8rQnAxNzYwdGxSVkFXd0dWUURUbWVleUg2eEQ2Zm0yT2YzUG1XZXBxUmZnZWxBcW5RUzVORHl6SXFHQTlhSmJOanJOMVdnelh5ZzZteCtOV2dKbVZRT2gxQXpJR3dwcEU2V0JOMkVBcUtWYjUyNXZZZ2hFSlhsNjRyeDBRaHUvWmthUFNReHNRcTU3djJMa3FnQnl3enNkUmk3NlE0djF6TXRwb3M0QThMYTlVWUxKQzNOQlBwUXlzeW5iVU9iRVVCc1BObW0vcmx2ZGRab1RVWVl4QmtEZUFEZ1NMM212Nk93RG9PV2FkNldhWk1IaW1WVloxMDN1VDNvWEhnUjE3RlVHZ0daemU5bnJrK0M3clFVbjk0ZEJLVnJ5Y21tWHpycHl3Q3JYOGJhVll6WngvNTh2WGpmR1VxMFNkU2MvS3pxRmpQUy81ZHoxbWdqNHJXd1NkeXhjV0ZmdU54TU1yeWk1Vk9RNzRHbm5VWlhzOXZKaVBkSHJ1akl2MTNSdlNKVU93TFdXcC8vWm9wazZvSHNCa2xTNjVsTXNTK0wxa3VSbVBiR3d0bGRzZkpmWnpMK1hzdkJSVzUrL0xxcGJDSThGLzYycjNYaXZCc0NGWXhnQTNsN1dEUUZ0TnRQRUVJaHE4N1Zuc3ZiUDd2Zkc3emQwVUVwdXBqT1RhS2FvMXdHSXhyUmsxZDdJMUhKN05uS3E0WDZZTVFDV3BTVE4yL2FxQUl1Nk5iMWtiOUhLRDFYeWNqR3dublBDTG9lMm9DM1lJakJ2MTQ1cWpERUFxZzJBZDROVHkyT2JTL2NrcWFsSnpEWG5LZEx2cFFiK1U5bDhmcWd4QUQ0ckY3ckxRY25lc25tUTlJUWNlU3Qwc1UwSmNsL2JhUzVYRHJpVktlbnpuSUU5K1E2dVZEZ1R4Skd2V0N3NWt2blYwbFQxQ3VUS1Z1L1lKajNhc3R5djZoRGltaExmRmZrT2VFc1ducmd0M3ljbk1MWWJsS0V1U2E2Q2FnQjRLYkpXZDdRNS9VOUoyTVdOa3NnTE1DeTVaMXE1b2Z1WGRuM1VUcE1MUldkcllHMW1GbTNtNCtiaEhwRHd5eGZ2OUpNV203akwwN1kxQUM3V0pPRE50VFFFdkRiZlQ1dzN4VlY1RWh1L1ZpQm95YzJ3dWM5R0ttS21VVktiajJHSnFRMVVKTWJzV0FnZ2RiWGJrTk8yYm5TNXRyMGptVENENitHcnFsNHFQVWt4MDhmQlJxYkppMzdkZlVtdVZEWERKWEZOcnhaNWxURU1nSG9Ed0tWaGMyVks2Z0U0eUp4b3h6TGZ5ME1HMnFYeW1TVDgxbmtBUGlsZU45TzZWbFJyQXV6TGV4UUp1cVNGKzVJa3lPbTFoKzJadUhMbWZuRHFqSElHZHVVN3VQcWd0c1QrcXVqdXpPaForUWVXZStIL3Yzck9WQXhJM2NXVFJWNWJZRThNaUxvUVpLUXE2VkxBTGllOEhDVHFlaThLbHo3V1NxczFDYjlFdVFxNVhnQnRUdi9qUmIxT2dQLzdXMUs1a2ZhWFNha0kwS1IxOVlqT2loY2xKVlgrMlNCOTUwM1RjQk1meW93MkJzQzVta3o4cVphR2dOZm1lODlrZDlPY3hNYWZLaEF1U0s3Qk5TbkZHclNYdjJrdkFCM1hpczZPaERrTmMwMENYQmYzWlVwTzBWQkJWZHRlemJ4ZXNNVkRqUURWMWQ4b09ydFNSUnZaVUpEQXVHRmxTRkUvZzNXNU5sVUEvVE1BVXFub015dEhYUzg2TzdUdFpCTGFQSHM1YmNpNm1HL2FLWHFuWVE3QVI1SW81NjU2MXdUNFVVb1ljODJ1VXV6MEtMVHdzWlRKRFFUbGdLdnlXMzRzdXVXZjV6S2hyQjh5Q1lqalJYZkRyYWd6bzU3d1hlWTNhaHFrSjJlUDN3OEg3MWt5a2w0VW5ZcDFkU09YTStUemFLOW1UY3MxR2RzU28yZmZxcUQycFB4eE84aFY4TmJna3kxTy84TkZ2a0ZXMWQ5OExlSGxHNUt3Nk8xK3greS9wVkJyeWxjN2V2L08vU1VZQUpNMW82a0JVRldTZDFOdVdsTkRRQzNHcUdleXU1eDg0OS9wdzhhZlNnKy9GRVBnVCtWdnV5VFdZaS9kQUhWY0xOMC81d0szbFM0SWgwVjNaNjl0TzlYc3l3WWViVGhha25SUGRBWTJaQ0YvVVhSMm45c3I2alh0bTF4WHU5THBJckRmZ3c3QXl6ZHNBTHc4UVFQZ1paOE1nSU9pdTR2a2J0SFpmVzNENnM0bnhXaWZ0ZXo4WGRsazl1VTYyczYxaVFGd3BqeXBmOTFRRThCMUFlNFgzZTJ1dGFuTFp4V1ZCbyt0VGoxcUFPV2hMSldUanI2REppQitXblNMTXEwR3VRZFBMTmRtUHZpM2gzWXExdE5xN3YxOVdkVHJidXpMZDJscUFOU0pkZVhhaks5S3NweTNwZDYxeXFhVm9sT2FXRU1TNTRQZm5BNGtHNW5UZkM1bndQOU9mMHNLSWYycDNOZVNjZU1hQ05GL0c3QkU5VS9mZGdOZ3J1Rm9ZZ0NjcWFqTnYzSU1ReUQzbWFNWksxVmZxT051L0VsejRCTXhCTDRxTitwenhmSGFBWitUY1hUZHo4dDdOeGJvQUd3V3I1dlp1QzcxVTFuVWRvdk9QdlRSaGpOUWRBcVQ2R2FkN3J0K2xrN1U3UXJENG1yRmRkZmtwTGhiZFBlazN4WmpiN21CQWFEYUFYVUdRRTVqSURwQjdUUTBBS28rUDNmZHBnWkExYlhiaGdCUzJkK3VQYzhkTTY0ZkJoNjJTTmhyUTY2M0Y0VHVWdVJkM2Frd0FENG9UK3BmV2NaKzFFOUM3MStVZVo5YzcrZUsxdzFkemhhdmhYZ2k0OEtmdDc5M0hvYnpkNlBLL2Y5SnBveHNSend5THZPYnF4THd2Mm55bnJVZFRRMkFPcTJPN3l3UmZGYlc5UlVKOFhrNDRhbmtmaTJJUVRRbTNwMzBmRDNFb01OUDhvT1pxb0hIOW5jZHlZYnZuRFlxRElCSExVZWRBZkNmWlRtU0dnSmZsaFB4d2pFTmdhWUdnRzc4UzMzWStQOVlMckIvTEY2TEQzMXNNY3ljQWJEVHdBRDRwQndmbDR2NW1hSmJDVkJER3o1eEhzdnplUkw4LzEwQ0VYTGlHckxOV3FzMWZLS3FhbUc2dHg1YXFMcnVrbVRNcmdYWFhTMWV0OWFNRW93bXhSMzl4SFFEdlB6R3ZVSTVqWUVwTzZIcHYzT1BVNXZQcjdwdTlEemFYTHN1Q1hER1NsV2plNzRlNU5ta2hqdWFZK1BTM2c4ejcrRmEwZDJGVVVjVWh2cDlPWjgrejV6VWM4L1BUM2szemZWK2RELytLekF1UE1jZ2Q1L1RlemRkOHd5cjNQOGZaYnlUZms5VTVqZktGM2g2alBlc3pWZ3RZdkd2cHZNb1plaGZsT1RIWWN2OTBpUmZUeWpVSm1kZXpuWk5FaXMvdDZxSEJSc3FhNnlKNlRlTGJvbDZIUjFWRmo4WEEyQ3R4MUZsQVB5MkxFZEtoc0NINVliNWFSOE1nYVloQU4zNDlZWHFkZVAvajFmajM4ci9mYjljWEQ0b1hyZWx2QmdZQUQ0aG84bWlCc0FINWYwNityemZTU1dGR2dFTHdlVFJpVE12RysxUzBhbExQV2NKZFVtZ1pOQktWTFJzTTVxb0tmdGZ1OGZwS1N5NjdyU1ZvRDJzdWU1OU93R2tCVjVqaTR1bUc3Qm9XZEthRjFLbE1hQXgydWlhZWlKdTgvbFYxNDJlUjV0cmE3Yjc1K1c3K240NTk2SlMxWVdpcy8ydjMzTzkzK05XWlhNdE1PWVdhcTcxSUxqblVTTHE3MHBqVjAvcWVsckxQYi9vL24wcnJ2Y3o1ZnJ6VVhsL3pnZWJRTjE5SG0vNUROMzkvMkdRbjFSMVQ0YXRZaUQzTjIzZXN6WmpVVFpCM1R5YnpxTmtNUDZQR1FHZSszVzNpRHNXemtsWjNJVEYwcE1tUWNydFNPdmlUUGw5ZGN3VTNRMnRMaFZ4a3pvZGQxUm40ZWRpQUJ4bjVBeUFmM28xZmlXR3dQdDlNZ1FXR3lZQlJwWmtlcUdHZXR6NGYvMXEvRXY1disrVy8rMzNrc1NrdGN5NUNSbE5GazFZT3JwSC8xNWUvemZpU2tzdiszVDU5M1BCeEVtZWpXaUN6VVVDRVZJbmZkbEtWSkxGL24ybTlqZGRUeWViZGdQTVhYZENhbUJ6MTcwcjE0MXFrclU1MHZlQkNJYVczMmhsaU9zTXpJbzJnbXRXK0RWMVUyenorWFhYOWVmUjV0clhMTnY5VExtWi9xYm83QTZYM2duTlhvNXF1ZS9JL2RiTlAyZk16V2JldzV4QXlkMU1LZXA3NVhzZjlYZXZlbjdSL1VzYTdoK1h4dlI3a21PZ3hzVkpQa04xLzMvUTRIZjRQUmxvK051YmZzZTJRemZCdEhrMm5VY3BSditaR0FGUjd0ZEUwUzBvTkNWSmRLTzJUcXNxNFNmbE03MHU2OHFZRGYzN2xJVG43L0ZJNXU5UzV2NlYwMm9BNUZ5TXZZem9OSDQwZWYvdTFmaUgwaEQ0MTNKRDY0Y2hFQzNJVnpNVEpyZnhYKzF4NC8vSFYrUHZYNDFmbHIvcnQrWHYrVkJxbWIrMXNwODdEU2JMTitVSlJWMjQvMXgrM2dVcE94d1NuWVBjeEJrcDhvcGRYUUlSeFd1ZDh2T2lwNURjZHFNMUV6VUpVVVRkQVBXNjJxcFphMkFuRzF3M1VpVzdMcHY3UkRCMEVxczJ4RVFnb2pFc1NZdTNaWEZ5WVkxUjJSVGJmSDdkZGYxNXRMbDJPdjEvV2M2bFA1Uno3RmRCcVdyVlBaK3lhNmY3ZlZrU21IVHhWS0d0eWN6ekc2MzV6U3AyOHE3TUk5Mm9yOVk4ditqK2FTLzNOSmZVdURodlJ2VkpQTU92YlQ0My9SMTZUK3IrcHMxM2JEdFViQzNwd1RTZFIzODJnTjZCdDlZQXFISjk5ZW95dWhkazRmN1ZxL0UzcFNId3kzSkQ2NGNoRUMzSWx6TVRaanpZK0MrWEZ2bzNQV3o4djNnMS92clYrTnZ5Ti8yNi9MY2ZTQjdBaGNEdFZUbFpTdmYvV1R2QkhYM21MM2hqQVFDZ1h3WkFsZXVybHhHZHhyRUFBUUFBM2pJRG9NNzExWFpFcC9GdnVOTUFBQUJ2bHdHUUVqS3VTK3hUeDNWUkw3cG84ZHRiRlNxQnZRNVhTN29pY2NiYm1aSCtSbU9VWnpQeDhnbUxVMnA4K1phRUJqVE1rRTBLc1RqNXpmSWFPbTVLSFh6NmZnTVNFaGdwcjluckdMYXMyTXVpc25pYzUzQ3JzSmFlekJZQWdOUHJBUmhyc09GZGt6cjdpUVpLZ1cySDZ5V3IzR0l1K1N6S1V2NmlZY2I4WGNtVzErVEFVVWswekphRkZOV2RtWElla2FnMWE2L0RzK0xUOXhrNzV2TkpTVVVwbWVrU3N3VUE0SFFaQUpxZFBsdFhCeWsxczlQUzdLQmY0MjVRMW5SYmxLTnlkYUlxVXFLWnQ0TTFOZk9QcEJUdm5sVUpwQkxDQjFYQ0VFVjFiK1pjVGtUVW1yWFg0YktZWHJ0L25HY3hyZlgyekJZQWdOTmxBS2pNNUVLZEVwSkpKeTcyb0JoWU5iUm44bWlnL3BWVGlycFhkTGJEVE5uMFExSi9yNnA1YTZKU2xoTUl1aU02NTFscHlLS3o3ZVppdzZvSUZ5bDYzT05ZRVkzMkNTbkhtcGJ2MCt1eldEVHB6R3ZNRmdDQTAyVUFxQWIyazJCRUc1NXVqbXQ5SEZFbkw5Zi9kcTNveDBWM084eFVyenBpc3AycW03OXJtdm1SUlBDaU5FN0pkYU5MZmU0WFJRcTFUaGZCZGRtM2VoeVJGcnhlKy9FeG5zV0thN1F6V3dBQVRwY0JNR09OTGJack5yeElZMyszRHlPbkl1Z2I3SVkxRzRsYVJLWnd4YmpvWjJzcnpRTzV4a0dtTzJDU1NIMHFYYXEwTGVwMHBpMXFFMlhFcURQYmZzdXgyOEFBZUNMTldkcU1zRWtMc3dVQTRQUjZBTFE5Nlg0TEE2QmZJOWZVWnlab0lic3JmWnZYcEtuSXJPUVFxTXh4MnB3UHBMZjBSdGxNNkxuMW5kNlFSaGliWW15c0JaMnhJZ1BnWlVYcjJGdVp6bXk5aktZR3dGN0xnUUVBQVBBek1BQzhTOTNSUnZlRDlZTFdFTUNJZEJWYk9rYjhPaHJMMGc1MVhIb3FSeTFrTjZSMytiTnlzMTRLR3IvNGIxT3ZRZXFxcFcxTUQwcURJTFVZVFI2RDlCbmVmYTBYQTBCekFKYmt1N1FkeTlKNUxHZGNyUGM0TUFBQUFFNjVBZUROZ0NJRFFFKzgzbzcyUVIvSGZlbUNOV0psZGxWR3dGNTVJdmEyblJyZTJBamM4ZytrSC9WVGFTK2NEQXNORDZ4YjY5S1VIZDlMQ0VBckcrYkxhL1l5NWlWYlA5MHZiZnNhZGRkck9sSnlaVEw4QnBrdEFBQ24wd0R3RTJ6TzVUMHNpWFhIMldDV01xMWZkWU85RVhRZGk0eUFiWEhkYThoQ3d4dTVudDF6WWdnc1M2TGhadWtLMzVTa3VLN00rQjZUQUsrWGY1KzBDV1o2SE5QbDg5T3VZVU1pN1R5WEtaMXNNdWFzZi9ZQXN3VUE0SFFaQU5FSjlrVkZrcG5uQUt6M2Nhd0daVzNuR3hnQnVhcUZpWExqZlZEUnMzdEsycGplRjBOQVF4Tkw4amZlaTc2WE1zQXIwcm95aFZWNkhiZEZzZStTdFgyZE9zWndnYVZ2bVMwQUFLZkxBTkJNK1pRMDlzTGMxMVVHd0ZZUFNXYlJ5TG5MdjZveEFxcDBDMFl5UGF1MVo3ZXFES1pUczRjMjVrMFlSM3ZSdHhZQzRxMERBSUMzd1FEd3BMRm5aZXk3TG9IdHAvSUFuSzB3QXFacmxBdHZXTnZncUdmM29PbitUNWJYVmJuZDZVQWFOL1dpYnkwRnpGc0hBQUJ2Z3dFUW5laFRURDNha0gvcUhJRC9yakFDUmhyMExoZ01tdlNrT1B4QXVaR25IZ2MzTXcxNmhzdlB1eUYvYzdUNWY4a2JCQUFBZjZrR3dJaGt5eTliUEYzVjRNYWtBK0I0SDVMTWNtTzJQSVhmUm40V0FBRGc1QXlBMjlhWVJ1UHBENlFzYjdnOFRXdTN1Y2xqSnBwRlkxemM5OS94aEFBQUFFN0dBTkRXdEZIcjJ5a3BNNk1qSEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBREEyOFAvQWZZSXUwZGJwUmVFQUFBQUFFbEZUa1N1UW1DQ2A7XG4gIHJldHVybiBpbWFnZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZudCgpe1xuICByZXR1cm4gYGluZm8gZmFjZT1cIkx1Y2lkYSBTYW5zIFVuaWNvZGVcIiBzaXplPTMyIGJvbGQ9MCBpdGFsaWM9MCBjaGFyc2V0PVwiXCIgdW5pY29kZT0wIHN0cmV0Y2hIPTEwMCBzbW9vdGg9MSBhYT0xIHBhZGRpbmc9NCw0LDQsNCBzcGFjaW5nPS04LC04XG5jb21tb24gbGluZUhlaWdodD01MSBiYXNlPTM2IHNjYWxlVz01MTIgc2NhbGVIPTI1NiBwYWdlcz0xIHBhY2tlZD0wXG5wYWdlIGlkPTAgZmlsZT1cImx1Y2lkYXNhbnN1bmljb2RlLnBuZ1wiXG5jaGFycyBjb3VudD05N1xuY2hhciBpZD0wICAgICAgIHg9MCAgICB5PTEwMyAgd2lkdGg9MjYgICBoZWlnaHQ9MjkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMSAgIHhhZHZhbmNlPTI0ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMCAgICAgIHg9MCAgICB5PTAgICAgd2lkdGg9MCAgICBoZWlnaHQ9MCAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0wICAgIHhhZHZhbmNlPTAgICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0zMiAgICAgIHg9MCAgICB5PTAgICAgd2lkdGg9MCAgICBoZWlnaHQ9MCAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0wICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0zMyAgICAgIHg9MzEwICB5PTcxICAgd2lkdGg9MTIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0zNCAgICAgIHg9NDkzICB5PTEwMyAgd2lkdGg9MTcgICBoZWlnaHQ9MTcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTEyICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0zNSAgICAgIHg9MzQzICB5PTcxICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0zNiAgICAgIHg9MjE0ICB5PTAgICAgd2lkdGg9MjIgICBoZWlnaHQ9MzYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0zNyAgICAgIHg9MzYyICB5PTAgICAgd2lkdGg9MzAgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0zOCAgICAgIHg9MzcxICB5PTcxICAgd2lkdGg9MjkgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0zOSAgICAgIHg9MCAgICB5PTEzMiAgd2lkdGg9MTIgICBoZWlnaHQ9MTcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTcgICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD00MCAgICAgIHg9NjEgICB5PTAgICAgd2lkdGg9MTYgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD00MSAgICAgIHg9NzcgICB5PTAgICAgd2lkdGg9MTYgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD00MiAgICAgIHg9NDYwICB5PTEwMyAgd2lkdGg9MjAgICBoZWlnaHQ9MjEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE1ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD00MyAgICAgIHg9ODEgICB5PTEwMyAgd2lkdGg9MjcgICBoZWlnaHQ9MjcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMyAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD00NCAgICAgIHg9NDgwICB5PTEwMyAgd2lkdGg9MTMgICBoZWlnaHQ9MTggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yNyAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD00NSAgICAgIHg9OTMgICB5PTEzMiAgd2lkdGg9MjMgICBoZWlnaHQ9MTEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yMSAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD00NiAgICAgIHg9ODAgICB5PTEzMiAgd2lkdGg9MTMgICBoZWlnaHQ9MTMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yNyAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD00NyAgICAgIHg9MTQ2ICB5PTAgICAgd2lkdGg9MTggICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD00OCAgICAgIHg9Mjg1ICB5PTcxICAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD00OSAgICAgIHg9NDAwICB5PTcxICAgd2lkdGg9MTYgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD01MCAgICAgIHg9MTIwICB5PTcxICAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD01MSAgICAgIHg9MTQzICB5PTcxICAgd2lkdGg9MjIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD01MiAgICAgIHg9MTY1ICB5PTcxICAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD01MyAgICAgIHg9MTkwICB5PTcxICAgd2lkdGg9MjIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD01NCAgICAgIHg9NDE2ICB5PTcxICAgd2lkdGg9MjUgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD01NSAgICAgIHg9MjEyICB5PTcxICAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD01NiAgICAgIHg9MjM2ICB5PTcxICAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD01NyAgICAgIHg9MjYwICB5PTcxICAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD01OCAgICAgIHg9Mzk4ICB5PTEwMyAgd2lkdGg9MTIgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD01OSAgICAgIHg9NDQxICB5PTcxICAgd2lkdGg9MTIgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD02MCAgICAgIHg9MjYgICB5PTEwMyAgd2lkdGg9MjggICBoZWlnaHQ9MjcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMyAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD02MSAgICAgIHg9MTIgICB5PTEzMiAgd2lkdGg9MjggICBoZWlnaHQ9MTYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xOCAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD02MiAgICAgIHg9NTQgICB5PTEwMyAgd2lkdGg9MjcgICBoZWlnaHQ9MjcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMyAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD02MyAgICAgIHg9MzIyICB5PTcxICAgd2lkdGg9MjEgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE0ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD02NCAgICAgIHg9NDUzICB5PTcxICAgd2lkdGg9MzQgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTI3ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD02NSAgICAgIHg9MzkyICB5PTAgICAgd2lkdGg9MjkgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD02NiAgICAgIHg9NDIxICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD02NyAgICAgIHg9NDQ0ICB5PTAgICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD02OCAgICAgIHg9NDcyICB5PTAgICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI0ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD02OSAgICAgIHg9MCAgICB5PTM5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD03MCAgICAgIHg9MjMgICB5PTM5ICAgd2lkdGg9MjIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD03MSAgICAgIHg9NDUgICB5PTM5ICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIzICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD03MiAgICAgIHg9NzMgICB5PTM5ICAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI0ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD03MyAgICAgIHg9MTAwICB5PTM5ICAgd2lkdGg9MTIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTkgICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD03NCAgICAgIHg9MTI1ICB5PTAgICAgd2lkdGg9MjEgICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD03NSAgICAgIHg9MTEyICB5PTM5ICAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD03NiAgICAgIHg9MTM3ICB5PTM5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD03NyAgICAgIHg9MTYwICB5PTM5ICAgd2lkdGg9MzEgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI4ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD03OCAgICAgIHg9MTkxICB5PTM5ICAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI0ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD03OSAgICAgIHg9MjE4ICB5PTM5ICAgd2lkdGg9MzEgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD04MCAgICAgIHg9MjQ5ICB5PTM5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD04MSAgICAgIHg9MTgyICB5PTAgICAgd2lkdGg9MzIgICBoZWlnaHQ9MzYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD04MiAgICAgIHg9MjcyICB5PTM5ICAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD04MyAgICAgIHg9Mjk3ICB5PTM5ICAgd2lkdGg9MjIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD04NCAgICAgIHg9MzE5ICB5PTM5ICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD04NSAgICAgIHg9MzQ3ICB5PTM5ICAgd2lkdGg9MjYgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD04NiAgICAgIHg9MzczICB5PTM5ICAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD04NyAgICAgIHg9NDAxICB5PTM5ICAgd2lkdGg9MzUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI3ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD04OCAgICAgIHg9NDM2ICB5PTM5ICAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD04OSAgICAgIHg9NDYzICB5PTM5ICAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD05MCAgICAgIHg9MCAgICB5PTcxICAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD05MSAgICAgIHg9MCAgICB5PTAgICAgd2lkdGg9MTUgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD05MiAgICAgIHg9MTY0ICB5PTAgICAgd2lkdGg9MTggICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD05MyAgICAgIHg9MTUgICB5PTAgICAgd2lkdGg9MTUgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD05NCAgICAgIHg9NDM1ICB5PTEwMyAgd2lkdGg9MjUgICBoZWlnaHQ9MjUgICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD05NSAgICAgIHg9MTE2ICB5PTEzMiAgd2lkdGg9MjMgICBoZWlnaHQ9MTEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zMSAgIHhhZHZhbmNlPTE2ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD05NiAgICAgIHg9NDAgICB5PTEzMiAgd2lkdGg9MTUgICBoZWlnaHQ9MTQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD05NyAgICAgIHg9MTA4ICB5PTEwMyAgd2lkdGg9MjQgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD05OCAgICAgIHg9MjM2ICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD05OSAgICAgIHg9MTMyICB5PTEwMyAgd2lkdGg9MjIgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTE2ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMDAgICAgIHg9MjU5ICB5PTAgICAgd2lkdGg9MjQgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMDEgICAgIHg9MTU0ICB5PTEwMyAgd2lkdGg9MjMgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMDIgICAgIHg9MjgzICB5PTAgICAgd2lkdGg9MjEgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTEyICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMDMgICAgIHg9MjUgICB5PTcxICAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMDQgICAgIHg9MzA0ICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMDUgICAgIHg9NDkwICB5PTM5ICAgd2lkdGg9MTIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTkgICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMDYgICAgIHg9NDEgICB5PTAgICAgd2lkdGg9MjAgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMDcgICAgIHg9MzI3ICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMDggICAgIHg9MzUwICB5PTAgICAgd2lkdGg9MTIgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTkgICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMDkgICAgIHg9MTc3ICB5PTEwMyAgd2lkdGg9MzIgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTMwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMTAgICAgIHg9MjA5ICB5PTEwMyAgd2lkdGg9MjMgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMTEgICAgIHg9NDEwICB5PTEwMyAgd2lkdGg9MjUgICBoZWlnaHQ9MjUgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNSAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMTIgICAgIHg9NDkgICB5PTcxICAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMTMgICAgIHg9NzIgICB5PTcxICAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMTQgICAgIHg9MjMyICB5PTEwMyAgd2lkdGg9MTggICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTEzICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMTUgICAgIHg9MjUwICB5PTEwMyAgd2lkdGg9MjAgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTE2ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMTYgICAgIHg9NDg3ICB5PTcxICAgd2lkdGg9MjAgICBoZWlnaHQ9MjggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMiAgIHhhZHZhbmNlPTEyICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMTcgICAgIHg9MjcwICB5PTEwMyAgd2lkdGg9MjMgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMTggICAgIHg9MjkzICB5PTEwMyAgd2lkdGg9MjQgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMTkgICAgIHg9MzE3ICB5PTEwMyAgd2lkdGg9MzIgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMjAgICAgIHg9MzQ5ICB5PTEwMyAgd2lkdGg9MjUgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMjEgICAgIHg9OTYgICB5PTcxICAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMjIgICAgIHg9Mzc0ICB5PTEwMyAgd2lkdGg9MjQgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMjMgICAgIHg9OTMgICB5PTAgICAgd2lkdGg9MTYgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMjQgICAgIHg9MzAgICB5PTAgICAgd2lkdGg9MTEgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTEyICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMjUgICAgIHg9MTA5ICB5PTAgICAgd2lkdGg9MTYgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxuY2hhciBpZD0xMjYgICAgIHg9NTUgICB5PTEzMiAgd2lkdGg9MjUgICBoZWlnaHQ9MTQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yMCAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxua2VybmluZ3MgY291bnQ9MFxuYDtcbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKiBcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiogXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiogXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSA9IHt9ICl7XG5cbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggcGFuZWwgKTtcblxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZWQnLCBoYW5kbGVPblJlbGVhc2UgKTtcblxuICBjb25zdCB0ZW1wTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcblxuICBsZXQgb2xkUGFyZW50O1xuXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHtpbnB1dE9iamVjdH09e30gKXtcblxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0ZW1wTWF0cml4LmdldEludmVyc2UoIGlucHV0T2JqZWN0Lm1hdHJpeFdvcmxkICk7XG5cbiAgICBmb2xkZXIubWF0cml4LnByZW11bHRpcGx5KCB0ZW1wTWF0cml4ICk7XG4gICAgZm9sZGVyLm1hdHJpeC5kZWNvbXBvc2UoIGZvbGRlci5wb3NpdGlvbiwgZm9sZGVyLnF1YXRlcm5pb24sIGZvbGRlci5zY2FsZSApO1xuXG4gICAgb2xkUGFyZW50ID0gZm9sZGVyLnBhcmVudDtcbiAgICBpbnB1dE9iamVjdC5hZGQoIGZvbGRlciApO1xuXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVPblJlbGVhc2UoIHtpbnB1dE9iamVjdH09e30gKXtcbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKCBvbGRQYXJlbnQgPT09IHVuZGVmaW5lZCApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb2xkZXIubWF0cml4LnByZW11bHRpcGx5KCBpbnB1dE9iamVjdC5tYXRyaXhXb3JsZCApO1xuICAgIGZvbGRlci5tYXRyaXguZGVjb21wb3NlKCBmb2xkZXIucG9zaXRpb24sIGZvbGRlci5xdWF0ZXJuaW9uLCBmb2xkZXIuc2NhbGUgKTtcbiAgICBvbGRQYXJlbnQuYWRkKCBmb2xkZXIgKTtcbiAgICBvbGRQYXJlbnQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gaW50ZXJhY3Rpb247XG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbiogXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qIFxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qIFxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xuaW1wb3J0IGNyZWF0ZVNsaWRlciBmcm9tICcuL3NsaWRlcic7XG5pbXBvcnQgY3JlYXRlQ2hlY2tib3ggZnJvbSAnLi9jaGVja2JveCc7XG5pbXBvcnQgY3JlYXRlQnV0dG9uIGZyb20gJy4vYnV0dG9uJztcbmltcG9ydCBjcmVhdGVGb2xkZXIgZnJvbSAnLi9mb2xkZXInO1xuaW1wb3J0IGNyZWF0ZURyb3Bkb3duIGZyb20gJy4vZHJvcGRvd24nO1xuaW1wb3J0ICogYXMgU0RGVGV4dCBmcm9tICcuL3NkZnRleHQnO1xuaW1wb3J0ICogYXMgRm9udCBmcm9tICcuL2ZvbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEQVRHVUlWUigpe1xuXG4gIC8qXG4gICAgU0RGIGZvbnRcbiAgKi9cbiAgY29uc3QgdGV4dENyZWF0b3IgPSBTREZUZXh0LmNyZWF0b3IoKTtcblxuXG4gIC8qXG4gICAgTGlzdHMuXG4gICAgSW5wdXRPYmplY3RzIGFyZSB0aGluZ3MgbGlrZSBWSVZFIGNvbnRyb2xsZXJzLCBjYXJkYm9hcmQgaGVhZHNldHMsIGV0Yy5cbiAgICBDb250cm9sbGVycyBhcmUgdGhlIERBVCBHVUkgc2xpZGVycywgY2hlY2tib3hlcywgZXRjLlxuICAgIEhpdHNjYW5PYmplY3RzIGFyZSBhbnl0aGluZyByYXljYXN0cyB3aWxsIGhpdC10ZXN0IGFnYWluc3QuXG4gICovXG4gIGNvbnN0IGlucHV0T2JqZWN0cyA9IFtdO1xuICBjb25zdCBjb250cm9sbGVycyA9IFtdO1xuICBjb25zdCBoaXRzY2FuT2JqZWN0cyA9IFtdO1xuXG4gIGxldCBtb3VzZUVuYWJsZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBzZXRNb3VzZUVuYWJsZWQoIGZsYWcgKXtcbiAgICBtb3VzZUVuYWJsZWQgPSBmbGFnO1xuICB9XG5cblxuXG5cbiAgLypcbiAgICBUaGUgZGVmYXVsdCBsYXNlciBwb2ludGVyIGNvbWluZyBvdXQgb2YgZWFjaCBJbnB1dE9iamVjdC5cbiAgKi9cbiAgY29uc3QgbGFzZXJNYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7Y29sb3I6MHg1NWFhZmYsIHRyYW5zcGFyZW50OiB0cnVlLCBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyB9KTtcbiAgZnVuY3Rpb24gY3JlYXRlTGFzZXIoKXtcbiAgICBjb25zdCBnID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG4gICAgZy52ZXJ0aWNlcy5wdXNoKCBuZXcgVEhSRUUuVmVjdG9yMygpICk7XG4gICAgZy52ZXJ0aWNlcy5wdXNoKCBuZXcgVEhSRUUuVmVjdG9yMygwLDAsMCkgKTtcbiAgICByZXR1cm4gbmV3IFRIUkVFLkxpbmUoIGcsIGxhc2VyTWF0ZXJpYWwgKTtcbiAgfVxuXG5cblxuXG5cbiAgLypcbiAgICBBIFwiY3Vyc29yXCIsIGVnIHRoZSBiYWxsIHRoYXQgYXBwZWFycyBhdCB0aGUgZW5kIG9mIHlvdXIgbGFzZXIuXG4gICovXG4gIGNvbnN0IGN1cnNvck1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjoweDQ0NDQ0NCwgdHJhbnNwYXJlbnQ6IHRydWUsIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nIH0gKTtcbiAgZnVuY3Rpb24gY3JlYXRlQ3Vyc29yKCl7XG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMC4wMDYsIDQsIDQgKSwgY3Vyc29yTWF0ZXJpYWwgKTtcbiAgfVxuXG5cblxuXG4gIC8qXG4gICAgQ3JlYXRlcyBhIGdlbmVyaWMgSW5wdXQgdHlwZS5cbiAgICBUYWtlcyBhbnkgVEhSRUUuT2JqZWN0M0QgdHlwZSBvYmplY3QgYW5kIHVzZXMgaXRzIHBvc2l0aW9uXG4gICAgYW5kIG9yaWVudGF0aW9uIGFzIGFuIGlucHV0IGRldmljZS5cblxuICAgIEEgbGFzZXIgcG9pbnRlciBpcyBpbmNsdWRlZCBhbmQgd2lsbCBiZSB1cGRhdGVkLlxuICAgIENvbnRhaW5zIHN0YXRlIGFib3V0IHdoaWNoIEludGVyYWN0aW9uIGlzIGN1cnJlbnRseSBiZWluZyB1c2VkIG9yIGhvdmVyLlxuICAqL1xuICBmdW5jdGlvbiBjcmVhdGVJbnB1dCggaW5wdXRPYmplY3QgPSBuZXcgVEhSRUUuR3JvdXAoKSApe1xuICAgIHJldHVybiB7XG4gICAgICByYXljYXN0OiBuZXcgVEhSRUUuUmF5Y2FzdGVyKCBuZXcgVEhSRUUuVmVjdG9yMygpLCBuZXcgVEhSRUUuVmVjdG9yMygpICksXG4gICAgICBsYXNlcjogY3JlYXRlTGFzZXIoKSxcbiAgICAgIGN1cnNvcjogY3JlYXRlQ3Vyc29yKCksXG4gICAgICBvYmplY3Q6IGlucHV0T2JqZWN0LFxuICAgICAgcHJlc3NlZDogZmFsc2UsXG4gICAgICBncmlwcGVkOiBmYWxzZSxcbiAgICAgIHN0YXRlOiB7XG4gICAgICAgIGN1cnJlbnRIb3ZlcjogdW5kZWZpbmVkLFxuICAgICAgICBjdXJyZW50SW50ZXJhY3Rpb246IHVuZGVmaW5lZCxcbiAgICAgICAgZXZlbnRzOiBuZXcgRW1pdHRlcigpXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG5cblxuXG5cbiAgLypcbiAgICBNb3VzZUlucHV0IGlzIGEgc3BlY2lhbCBpbnB1dCB0eXBlIHRoYXQgaXMgb24gYnkgZGVmYXVsdC5cbiAgICBBbGxvd3MgeW91IHRvIGNsaWNrIG9uIHRoZSBzY3JlZW4gd2hlbiBub3QgaW4gVlIgZm9yIGRlYnVnZ2luZy5cbiAgKi9cbiAgY29uc3QgbW91c2VJbnB1dCA9IGNyZWF0ZU1vdXNlSW5wdXQoKTtcblxuICBmdW5jdGlvbiBjcmVhdGVNb3VzZUlucHV0KCl7XG4gICAgY29uc3QgbW91c2UgPSBuZXcgVEhSRUUuVmVjdG9yMigtMSwtMSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIGZ1bmN0aW9uKCBldmVudCApe1xuICAgICAgbW91c2UueCA9ICggZXZlbnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoICkgKiAyIC0gMTtcbiAgICAgIG1vdXNlLnkgPSAtICggZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCApICogMiArIDE7XG4gICAgfSwgZmFsc2UgKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgZnVuY3Rpb24oIGV2ZW50ICl7XG4gICAgICBpbnB1dC5wcmVzc2VkID0gdHJ1ZTtcbiAgICB9LCBmYWxzZSApO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgZnVuY3Rpb24oIGV2ZW50ICl7XG4gICAgICBpbnB1dC5wcmVzc2VkID0gZmFsc2U7XG4gICAgfSwgZmFsc2UgKTtcblxuICAgIGNvbnN0IGlucHV0ID0gY3JlYXRlSW5wdXQoKTtcbiAgICBpbnB1dC5tb3VzZSA9IG1vdXNlO1xuICAgIHJldHVybiBpbnB1dDtcbiAgfVxuXG5cblxuXG5cbiAgLypcbiAgICBQdWJsaWMgZnVuY3Rpb24gdXNlcnMgcnVuIHRvIGdpdmUgREFUIEdVSSBhbiBpbnB1dCBkZXZpY2UuXG4gICAgQXV0b21hdGljYWxseSBkZXRlY3RzIGZvciBWaXZlQ29udHJvbGxlciBhbmQgYmluZHMgYnV0dG9ucyArIGhhcHRpYyBmZWVkYmFjay5cblxuICAgIFJldHVybnMgYSBsYXNlciBwb2ludGVyIHNvIGl0IGNhbiBiZSBkaXJlY3RseSBhZGRlZCB0byBzY2VuZS5cblxuICAgIFRoZSBsYXNlciB3aWxsIHRoZW4gaGF2ZSB0d28gbWV0aG9kczpcbiAgICBsYXNlci5wcmVzc2VkKCksIGxhc2VyLmdyaXBwZWQoKVxuXG4gICAgVGhlc2UgY2FuIHRoZW4gYmUgYm91bmQgdG8gYW55IGJ1dHRvbiB0aGUgdXNlciB3YW50cy4gVXNlZnVsIGZvciBiaW5kaW5nIHRvXG4gICAgY2FyZGJvYXJkIG9yIGFsdGVybmF0ZSBpbnB1dCBkZXZpY2VzLlxuXG4gICAgRm9yIGV4YW1wbGUuLi5cbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBmdW5jdGlvbigpeyBsYXNlci5wcmVzc2VkKCB0cnVlICk7IH0gKTtcbiAgKi9cbiAgZnVuY3Rpb24gYWRkSW5wdXRPYmplY3QoIG9iamVjdCApe1xuICAgIGNvbnN0IGlucHV0ID0gY3JlYXRlSW5wdXQoIG9iamVjdCApO1xuXG4gICAgaW5wdXQubGFzZXIuYWRkKCBpbnB1dC5jdXJzb3IgKTtcblxuICAgIGlucHV0Lmxhc2VyLnByZXNzZWQgPSBmdW5jdGlvbiggZmxhZyApe1xuICAgICAgaW5wdXQucHJlc3NlZCA9IGZsYWc7XG4gICAgfTtcblxuICAgIGlucHV0Lmxhc2VyLmdyaXBwZWQgPSBmdW5jdGlvbiggZmxhZyApe1xuICAgICAgaW5wdXQuZ3JpcHBlZCA9IGZsYWc7XG4gICAgfTtcblxuICAgIGlucHV0Lmxhc2VyLmN1cnNvciA9IGlucHV0LmN1cnNvcjtcblxuICAgIGlmKCBUSFJFRS5WaXZlQ29udHJvbGxlciAmJiBvYmplY3QgaW5zdGFuY2VvZiBUSFJFRS5WaXZlQ29udHJvbGxlciApe1xuICAgICAgYmluZFZpdmVDb250cm9sbGVyKCBpbnB1dC5zdGF0ZSwgb2JqZWN0LCBpbnB1dC5sYXNlci5wcmVzc2VkLCBpbnB1dC5sYXNlci5ncmlwcGVkICk7XG4gICAgfVxuXG4gICAgaW5wdXRPYmplY3RzLnB1c2goIGlucHV0ICk7XG5cbiAgICByZXR1cm4gaW5wdXQubGFzZXI7XG4gIH1cblxuXG5cblxuICAvKlxuICAgIEhlcmUgYXJlIHRoZSBtYWluIGRhdCBndWkgY29udHJvbGxlciB0eXBlcy5cbiAgKi9cblxuICBmdW5jdGlvbiBhZGRTbGlkZXIoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBtaW4gPSAwLjAsIG1heCA9IDEwMC4wICl7XG4gICAgY29uc3Qgc2xpZGVyID0gY3JlYXRlU2xpZGVyKCB7XG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsIG1pbiwgbWF4LFxuICAgICAgaW5pdGlhbFZhbHVlOiBvYmplY3RbIHByb3BlcnR5TmFtZSBdXG4gICAgfSk7XG5cbiAgICBjb250cm9sbGVycy5wdXNoKCBzbGlkZXIgKTtcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5zbGlkZXIuaGl0c2NhbiApXG5cbiAgICByZXR1cm4gc2xpZGVyO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkQ2hlY2tib3goIG9iamVjdCwgcHJvcGVydHlOYW1lICl7XG4gICAgY29uc3QgY2hlY2tib3ggPSBjcmVhdGVDaGVja2JveCh7XG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsXG4gICAgICBpbml0aWFsVmFsdWU6IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cbiAgICB9KTtcblxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGNoZWNrYm94ICk7XG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uY2hlY2tib3guaGl0c2NhbiApXG5cbiAgICByZXR1cm4gY2hlY2tib3g7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRCdXR0b24oIG9iamVjdCwgcHJvcGVydHlOYW1lICl7XG4gICAgY29uc3QgYnV0dG9uID0gY3JlYXRlQnV0dG9uKHtcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdFxuICAgIH0pO1xuXG4gICAgY29udHJvbGxlcnMucHVzaCggYnV0dG9uICk7XG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uYnV0dG9uLmhpdHNjYW4gKTtcbiAgICByZXR1cm4gYnV0dG9uO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkRHJvcGRvd24oIG9iamVjdCwgcHJvcGVydHlOYW1lLCBvcHRpb25zICl7XG4gICAgY29uc3QgZHJvcGRvd24gPSBjcmVhdGVEcm9wZG93bih7XG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsIG9wdGlvbnNcbiAgICB9KTtcblxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGRyb3Bkb3duICk7XG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uZHJvcGRvd24uaGl0c2NhbiApO1xuICAgIHJldHVybiBkcm9wZG93bjtcbiAgfVxuXG5cblxuXG5cbiAgLypcbiAgICBBbiBpbXBsaWNpdCBBZGQgZnVuY3Rpb24gd2hpY2ggZGV0ZWN0cyBmb3IgcHJvcGVydHkgdHlwZVxuICAgIGFuZCBnaXZlcyB5b3UgdGhlIGNvcnJlY3QgY29udHJvbGxlci5cblxuICAgIERyb3Bkb3duOlxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgb2JqZWN0VHlwZSApXG5cbiAgICBTbGlkZXI6XG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlPZk51bWJlclR5cGUsIG1pbiwgbWF4IClcblxuICAgIENoZWNrYm94OlxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZCb29sZWFuVHlwZSApXG5cbiAgICBCdXR0b246XG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlPZkZ1bmN0aW9uVHlwZSApXG4gICovXG5cbiAgZnVuY3Rpb24gYWRkKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMywgYXJnNCApe1xuXG4gICAgaWYoIG9iamVjdCA9PT0gdW5kZWZpbmVkICl7XG4gICAgICBjb25zb2xlLndhcm4oICdvYmplY3QgaXMgdW5kZWZpbmVkJyApO1xuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgIH1cbiAgICBlbHNlXG4gICAgaWYoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPT09IHVuZGVmaW5lZCApe1xuICAgICAgY29uc29sZS53YXJuKCAnbm8gcHJvcGVydHkgbmFtZWQnLCBwcm9wZXJ0eU5hbWUsICdvbiBvYmplY3QnLCBvYmplY3QgKTtcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICB9XG5cbiAgICBpZiggaXNPYmplY3QoIGFyZzMgKSB8fCBpc0FycmF5KCBhcmczICkgKXtcbiAgICAgIHJldHVybiBhZGREcm9wZG93biggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMgKTtcbiAgICB9XG5cbiAgICBpZiggaXNOdW1iZXIoIG9iamVjdFsgcHJvcGVydHlOYW1lXSApICl7XG4gICAgICByZXR1cm4gYWRkU2xpZGVyKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMywgYXJnNCApO1xuICAgIH1cblxuICAgIGlmKCBpc0Jvb2xlYW4oIG9iamVjdFsgcHJvcGVydHlOYW1lXSApICl7XG4gICAgICByZXR1cm4gYWRkQ2hlY2tib3goIG9iamVjdCwgcHJvcGVydHlOYW1lICk7XG4gICAgfVxuXG4gICAgaWYoIGlzRnVuY3Rpb24oIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKSApe1xuICAgICAgcmV0dXJuIGFkZEJ1dHRvbiggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKTtcbiAgICB9XG5cbiAgICAvLyAgYWRkIGNvdWxkbid0IGZpZ3VyZSBpdCBvdXQsIHNvIGF0IGxlYXN0IGFkZCBzb21ldGhpbmcgVEhSRUUgdW5kZXJzdGFuZHNcbiAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XG4gIH1cblxuXG5cblxuICAvKlxuICAgIENyZWF0ZXMgYSBmb2xkZXIgd2l0aCB0aGUgbmFtZS5cblxuICAgIEZvbGRlcnMgYXJlIFRIUkVFLkdyb3VwIHR5cGUgb2JqZWN0cyBhbmQgY2FuIGRvIGdyb3VwLmFkZCgpIGZvciBzaWJsaW5ncy5cbiAgICBGb2xkZXJzIHdpbGwgYXV0b21hdGljYWxseSBhdHRlbXB0IHRvIGxheSBpdHMgY2hpbGRyZW4gb3V0IGluIHNlcXVlbmNlLlxuICAqL1xuXG4gIGZ1bmN0aW9uIGFkZEZvbGRlciggbmFtZSApe1xuICAgIGNvbnN0IGZvbGRlciA9IGNyZWF0ZUZvbGRlcih7XG4gICAgICB0ZXh0Q3JlYXRvcixcbiAgICAgIG5hbWVcbiAgICB9KTtcblxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGZvbGRlciApO1xuICAgIGlmKCBmb2xkZXIuaGl0c2NhbiApe1xuICAgICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uZm9sZGVyLmhpdHNjYW4gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9sZGVyO1xuICB9XG5cblxuXG5cblxuICAvKlxuICAgIFBlcmZvcm0gdGhlIG5lY2Vzc2FyeSB1cGRhdGVzLCByYXljYXN0cyBvbiBpdHMgb3duIFJBRi5cbiAgKi9cblxuICBjb25zdCB0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICBjb25zdCB0RGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoIDAsIDAsIC0xICk7XG4gIGNvbnN0IHRNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHVwZGF0ZSApO1xuXG4gICAgaWYoIG1vdXNlRW5hYmxlZCApe1xuICAgICAgbW91c2VJbnB1dC5pbnRlcnNlY3Rpb25zID0gcGVyZm9ybU1vdXNlSW5wdXQoIGhpdHNjYW5PYmplY3RzLCBtb3VzZUlucHV0ICk7XG4gICAgfVxuXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCB7Ym94LG9iamVjdCxyYXljYXN0LGxhc2VyLGN1cnNvcn0gPSB7fSwgaW5kZXggKXtcbiAgICAgIG9iamVjdC51cGRhdGVNYXRyaXhXb3JsZCgpO1xuXG4gICAgICB0UG9zaXRpb24uc2V0KDAsMCwwKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIG9iamVjdC5tYXRyaXhXb3JsZCApO1xuICAgICAgdE1hdHJpeC5pZGVudGl0eSgpLmV4dHJhY3RSb3RhdGlvbiggb2JqZWN0Lm1hdHJpeFdvcmxkICk7XG4gICAgICB0RGlyZWN0aW9uLnNldCgwLDAsLTEpLmFwcGx5TWF0cml4NCggdE1hdHJpeCApLm5vcm1hbGl6ZSgpO1xuXG4gICAgICByYXljYXN0LnNldCggdFBvc2l0aW9uLCB0RGlyZWN0aW9uICk7XG5cbiAgICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzWyAwIF0uY29weSggdFBvc2l0aW9uICk7XG5cbiAgICAgIC8vICBkZWJ1Zy4uLlxuICAgICAgLy8gbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDEgXS5jb3B5KCB0UG9zaXRpb24gKS5hZGQoIHREaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoIDEgKSApO1xuXG4gICAgICBjb25zdCBpbnRlcnNlY3Rpb25zID0gcmF5Y2FzdC5pbnRlcnNlY3RPYmplY3RzKCBoaXRzY2FuT2JqZWN0cywgZmFsc2UgKTtcbiAgICAgIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApO1xuXG4gICAgICBpbnB1dE9iamVjdHNbIGluZGV4IF0uaW50ZXJzZWN0aW9ucyA9IGludGVyc2VjdGlvbnM7XG4gICAgfSk7XG5cbiAgICBjb25zdCBpbnB1dHMgPSBpbnB1dE9iamVjdHMuc2xpY2UoKTtcblxuICAgIGlmKCBtb3VzZUVuYWJsZWQgKXtcbiAgICAgIGlucHV0cy5wdXNoKCBtb3VzZUlucHV0ICk7XG4gICAgfVxuXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaCggZnVuY3Rpb24oIGNvbnRyb2xsZXIgKXtcbiAgICAgIGNvbnRyb2xsZXIudXBkYXRlKCBpbnB1dHMgKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApe1xuICAgIGlmKCBpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDAgKXtcbiAgICAgIGNvbnN0IGZpcnN0SGl0ID0gaW50ZXJzZWN0aW9uc1sgMCBdO1xuICAgICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDEgXS5jb3B5KCBmaXJzdEhpdC5wb2ludCApO1xuICAgICAgbGFzZXIudmlzaWJsZSA9IHRydWU7XG4gICAgICBsYXNlci5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTtcbiAgICAgIGxhc2VyLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xuICAgICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZTtcbiAgICAgIGN1cnNvci5wb3NpdGlvbi5jb3B5KCBmaXJzdEhpdC5wb2ludCApO1xuICAgICAgY3Vyc29yLnZpc2libGUgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgbGFzZXIudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgY3Vyc29yLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwZXJmb3JtTW91c2VJbnB1dCggaGl0c2Nhbk9iamVjdHMsIHtib3gsb2JqZWN0LHJheWNhc3QsbGFzZXIsY3Vyc29yLG1vdXNlfSA9IHt9ICl7XG4gICAgcmF5Y2FzdC5zZXRGcm9tQ2FtZXJhKCBtb3VzZSwgY2FtZXJhICk7XG4gICAgY29uc3QgaW50ZXJzZWN0aW9ucyA9IHJheWNhc3QuaW50ZXJzZWN0T2JqZWN0cyggaGl0c2Nhbk9iamVjdHMsIGZhbHNlICk7XG4gICAgcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICk7XG4gICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XG4gIH1cblxuICB1cGRhdGUoKTtcblxuXG5cblxuXG4gIC8qXG4gICAgUHVibGljIG1ldGhvZHMuXG4gICovXG5cbiAgcmV0dXJuIHtcbiAgICBhZGRJbnB1dE9iamVjdCxcbiAgICBhZGQsXG4gICAgYWRkRm9sZGVyLFxuICAgIHNldE1vdXNlRW5hYmxlZFxuICB9O1xuXG59XG5cblxuXG4vKlxuICBTZXQgdG8gZ2xvYmFsIHNjb3BlIGlmIGV4cG9ydGluZyBhcyBhIHN0YW5kYWxvbmUuXG4qL1xuXG5pZiggd2luZG93ICl7XG4gIHdpbmRvdy5EQVRHVUlWUiA9IERBVEdVSVZSO1xufVxuXG5cblxuXG4vKlxuICBCdW5jaCBvZiBzdGF0ZS1sZXNzIHV0aWxpdHkgZnVuY3Rpb25zLlxuKi9cblxuZnVuY3Rpb24gaXNOdW1iZXIobikge1xuICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xufVxuXG5mdW5jdGlvbiBpc0Jvb2xlYW4obil7XG4gIHJldHVybiB0eXBlb2YgbiA9PT0gJ2Jvb2xlYW4nO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGZ1bmN0aW9uVG9DaGVjaykge1xuICBjb25zdCBnZXRUeXBlID0ge307XG4gIHJldHVybiBmdW5jdGlvblRvQ2hlY2sgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKGZ1bmN0aW9uVG9DaGVjaykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8vICBvbmx5IHt9IG9iamVjdHMgbm90IGFycmF5c1xuLy8gICAgICAgICAgICAgICAgICAgIHdoaWNoIGFyZSB0ZWNobmljYWxseSBvYmplY3RzIGJ1dCB5b3UncmUganVzdCBiZWluZyBwZWRhbnRpY1xuZnVuY3Rpb24gaXNPYmplY3QgKGl0ZW0pIHtcbiAgcmV0dXJuICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbSAhPT0gbnVsbCk7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkoIG8gKXtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoIG8gKTtcbn1cblxuXG5cblxuXG5cblxuLypcbiAgQ29udHJvbGxlci1zcGVjaWZpYyBzdXBwb3J0LlxuKi9cblxuZnVuY3Rpb24gYmluZFZpdmVDb250cm9sbGVyKCBpbnB1dFN0YXRlLCBjb250cm9sbGVyLCBwcmVzc2VkLCBncmlwcGVkICl7XG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyaWdnZXJkb3duJywgKCk9PnByZXNzZWQoIHRydWUgKSApO1xuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmlnZ2VydXAnLCAoKT0+cHJlc3NlZCggZmFsc2UgKSApO1xuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICdncmlwc2Rvd24nLCAoKT0+Z3JpcHBlZCggdHJ1ZSApICk7XG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ2dyaXBzdXAnLCAoKT0+Z3JpcHBlZCggZmFsc2UgKSApO1xuXG4gIGNvbnN0IGdhbWVwYWQgPSBjb250cm9sbGVyLmdldEdhbWVwYWQoKTtcbiAgaW5wdXRTdGF0ZS5ldmVudHMub24oICdvbkNvbnRyb2xsZXJIZWxkJywgZnVuY3Rpb24oIGlucHV0ICl7XG4gICAgaWYoIGlucHV0Lm9iamVjdCA9PT0gY29udHJvbGxlciApe1xuICAgICAgaWYoIGdhbWVwYWQgJiYgZ2FtZXBhZC5oYXB0aWNBY3R1YXRvcnMubGVuZ3RoID4gMCApe1xuICAgICAgICBnYW1lcGFkLmhhcHRpY0FjdHVhdG9yc1sgMCBdLnB1bHNlKCAwLjMsIDAuMyApO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKiBcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiogXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiogXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5pbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJbnRlcmFjdGlvbiggaGl0Vm9sdW1lICl7XG4gIGNvbnN0IGV2ZW50cyA9IG5ldyBFbWl0dGVyKCk7XG5cbiAgY29uc3Qgc3RhdGVzID0gbmV3IFdlYWtNYXAoKTtcblxuICBsZXQgYW55SG92ZXIgPSBmYWxzZTtcbiAgbGV0IGFueVByZXNzaW5nID0gZmFsc2U7XG5cbiAgLy8gY29uc3Qgc3RhdGUgPSB7XG4gIC8vICAgaG92ZXI6IGZhbHNlLFxuICAvLyAgIHByZXNzZWQ6IGZhbHNlLFxuICAvLyAgIGdyaXBwZWQ6IGZhbHNlLFxuICAvLyB9O1xuXG4gIGZ1bmN0aW9uIGlzTWFpbkludGVyYWN0aW9uKCBndWlTdGF0ZSApe1xuICAgIHJldHVybiAoIGd1aVN0YXRlLmN1cnJlbnRJbnRlcmFjdGlvbiA9PT0gaW50ZXJhY3Rpb24gKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc01haW5JbnRlcmFjdGlvbiggZ3VpU3RhdGUgKXtcbiAgICByZXR1cm4gKCBndWlTdGF0ZS5jdXJyZW50SW50ZXJhY3Rpb24gIT09IHVuZGVmaW5lZCApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0TWFpbkludGVyYWN0aW9uKCBndWlTdGF0ZSApe1xuICAgIGd1aVN0YXRlLmN1cnJlbnRJbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJNYWluSW50ZXJhY3Rpb24oIGd1aVN0YXRlICl7XG4gICAgZ3VpU3RhdGUuY3VycmVudEludGVyYWN0aW9uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgdFZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCBpbnB1dE9iamVjdHMgKXtcblxuICAgIGFueUhvdmVyID0gZmFsc2U7XG4gICAgYW55UHJlc3NpbmcgPSBmYWxzZTtcblxuICAgIGlucHV0T2JqZWN0cy5mb3JFYWNoKCBmdW5jdGlvbiggaW5wdXQgKXtcblxuICAgICAgbGV0IHN0YXRlID0gc3RhdGVzLmdldCggaW5wdXQgKTtcbiAgICAgIGlmKCBzdGF0ZSA9PT0gdW5kZWZpbmVkICl7XG4gICAgICAgIHN0YXRlcy5zZXQoIGlucHV0LCB7XG4gICAgICAgICAgaG92ZXI6IGZhbHNlLFxuICAgICAgICAgIHByZXNzZWQ6IGZhbHNlLFxuICAgICAgICAgIGdyaXBwZWQ6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgICAgc3RhdGUgPSBzdGF0ZXMuZ2V0KCBpbnB1dCApO1xuICAgICAgfVxuXG4gICAgICBzdGF0ZS5sYXN0SG92ZXIgPSBzdGF0ZS5ob3ZlcjtcbiAgICAgIHN0YXRlLmhvdmVyID0gZmFsc2U7XG5cbiAgICAgIGxldCBoaXRQb2ludDtcbiAgICAgIGxldCBoaXRPYmplY3Q7XG5cbiAgICAgIGlmKCBpbnB1dC5pbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwICl7XG4gICAgICAgIHN0YXRlLmhvdmVyID0gZmFsc2U7XG4gICAgICAgIGhpdFBvaW50ID0gdFZlY3Rvci5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGlucHV0LmN1cnNvci5tYXRyaXhXb3JsZCApLmNsb25lKCk7XG4gICAgICAgIGhpdE9iamVjdCA9IGlucHV0LmN1cnNvcjtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIGhpdFBvaW50ID0gaW5wdXQuaW50ZXJzZWN0aW9uc1sgMCBdLnBvaW50O1xuICAgICAgICBoaXRPYmplY3QgPSBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ub2JqZWN0O1xuICAgICAgfVxuXG4gICAgICBpZiggaGFzTWFpbkludGVyYWN0aW9uKCBpbnB1dC5zdGF0ZSApID09PSBmYWxzZSAmJiBoaXRWb2x1bWUgPT09IGhpdE9iamVjdCApe1xuICAgICAgICBzdGF0ZS5ob3ZlciA9IHRydWU7XG4gICAgICAgIGFueUhvdmVyID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IHVzZWQgPSBwZXJmb3JtU3RhdGVFdmVudHMoIGlucHV0LCBzdGF0ZSwgaGl0T2JqZWN0LCBoaXRQb2ludCwgJ3ByZXNzZWQnLCAnb25QcmVzc2VkJywgJ3ByZXNzaW5nJywgJ29uUmVsZWFzZWQnICk7XG4gICAgICB1c2VkID0gdXNlZCB8fCBwZXJmb3JtU3RhdGVFdmVudHMoIGlucHV0LCBzdGF0ZSwgaGl0T2JqZWN0LCBoaXRQb2ludCwgJ2dyaXBwZWQnLCAnb25HcmlwcGVkJywgJ2dyaXBwaW5nJywgJ29uUmVsZWFzZUdyaXAnICk7XG5cbiAgICAgIGlmKCB1c2VkID09PSBmYWxzZSAmJiBpc01haW5JbnRlcmFjdGlvbiggIGlucHV0LnN0YXRlICApICl7XG4gICAgICAgIGNsZWFyTWFpbkludGVyYWN0aW9uKCBpbnB1dC5zdGF0ZSApO1xuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHBlcmZvcm1TdGF0ZUV2ZW50cyggaW5wdXQsIHN0YXRlLCBoaXRPYmplY3QsIGhpdFBvaW50LCBzdGF0ZVRvQ2hlY2ssIGNsaWNrTmFtZSwgaG9sZE5hbWUsIHJlbGVhc2VOYW1lICl7XG4gICAgaWYoIGlucHV0WyBzdGF0ZVRvQ2hlY2sgXSAmJiBzdGF0ZS5ob3ZlciAmJiBoYXNNYWluSW50ZXJhY3Rpb24oIGlucHV0LnN0YXRlICkgPT09IGZhbHNlICl7XG4gICAgICBpZiggc3RhdGVbIHN0YXRlVG9DaGVjayBdID09PSBmYWxzZSApe1xuICAgICAgICBzdGF0ZVsgc3RhdGVUb0NoZWNrIF0gPSB0cnVlO1xuICAgICAgICBzZXRNYWluSW50ZXJhY3Rpb24oIGlucHV0LnN0YXRlICk7XG5cbiAgICAgICAgZXZlbnRzLmVtaXQoIGNsaWNrTmFtZSwge1xuICAgICAgICAgIGhpdE9iamVjdCxcbiAgICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0LFxuICAgICAgICAgIHBvaW50OiBoaXRQb2ludCxcbiAgICAgICAgfSk7XG5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiggaW5wdXRbIHN0YXRlVG9DaGVjayBdID09PSBmYWxzZSAmJiBpc01haW5JbnRlcmFjdGlvbiggaW5wdXQuc3RhdGUgKSApe1xuICAgICAgc3RhdGVbIHN0YXRlVG9DaGVjayBdID0gZmFsc2U7XG4gICAgICBldmVudHMuZW1pdCggcmVsZWFzZU5hbWUsIHtcbiAgICAgICAgaGl0T2JqZWN0LFxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0LFxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiggc3RhdGVbIHN0YXRlVG9DaGVjayBdICl7XG4gICAgICBldmVudHMuZW1pdCggaG9sZE5hbWUsIHtcbiAgICAgICAgaGl0T2JqZWN0LFxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0LFxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXG4gICAgICB9KTtcblxuICAgICAgYW55UHJlc3NpbmcgPSB0cnVlO1xuXG4gICAgICBpbnB1dC5zdGF0ZS5ldmVudHMuZW1pdCggJ29uQ29udHJvbGxlckhlbGQnLCBpbnB1dCApO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZVsgc3RhdGVUb0NoZWNrIF07XG5cbiAgfVxuXG4gIGNvbnN0IGludGVyYWN0aW9uID0ge1xuICAgIGhvdmVyaW5nOiAoKT0+YW55SG92ZXIsXG4gICAgcHJlc3Npbmc6ICgpPT5hbnlQcmVzc2luZyxcbiAgICB1cGRhdGUsXG4gICAgZXZlbnRzXG4gIH07XG5cbiAgcmV0dXJuIGludGVyYWN0aW9uO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qIFxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKiBcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKiBcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGlnbkxlZnQoIG9iaiApe1xuICBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuTWVzaCApe1xuICAgIG9iai5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcbiAgICBjb25zdCB3aWR0aCA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueCAtIG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueTtcbiAgICBvYmouZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCwgMCwgMCApO1xuICAgIHJldHVybiBvYmo7XG4gIH1cbiAgZWxzZSBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuR2VvbWV0cnkgKXtcbiAgICBvYmouY29tcHV0ZUJvdW5kaW5nQm94KCk7XG4gICAgY29uc3Qgd2lkdGggPSBvYmouYm91bmRpbmdCb3gubWF4LnggLSBvYmouYm91bmRpbmdCb3gubWF4Lnk7XG4gICAgb2JqLnRyYW5zbGF0ZSggd2lkdGgsIDAsIDAgKTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKXtcbiAgY29uc3QgcGFuZWwgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApLCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcbiAgcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCAqIDAuNSwgMCwgMCApO1xuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggcGFuZWwuZ2VvbWV0cnksIENvbG9ycy5ERUZBVUxUX0JBQ0sgKTtcbiAgcmV0dXJuIHBhbmVsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIGNvbG9yICl7XG4gIGNvbnN0IHBhbmVsID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQ09OVFJPTExFUl9JRF9XSURUSCwgaGVpZ2h0LCBDT05UUk9MTEVSX0lEX0RFUFRIICksIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xuICBwYW5lbC5nZW9tZXRyeS50cmFuc2xhdGUoIENPTlRST0xMRVJfSURfV0lEVEggKiAwLjUsIDAsIDAgKTtcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHBhbmVsLmdlb21ldHJ5LCBjb2xvciApO1xuICByZXR1cm4gcGFuZWw7XG59XG5cbmV4cG9ydCBjb25zdCBQQU5FTF9XSURUSCA9IDEuMDtcbmV4cG9ydCBjb25zdCBQQU5FTF9IRUlHSFQgPSAwLjA3O1xuZXhwb3J0IGNvbnN0IFBBTkVMX0RFUFRIID0gMC4wMTtcbmV4cG9ydCBjb25zdCBQQU5FTF9TUEFDSU5HID0gMC4wMDI7XG5leHBvcnQgY29uc3QgUEFORUxfTUFSR0lOID0gMC4wMDU7XG5leHBvcnQgY29uc3QgUEFORUxfTEFCRUxfVEVYVF9NQVJHSU4gPSAwLjA2O1xuZXhwb3J0IGNvbnN0IFBBTkVMX1ZBTFVFX1RFWFRfTUFSR0lOID0gMC4wMjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1dJRFRIID0gMC4wMjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0RFUFRIID0gMC4wMDU7IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbiogXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qIFxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qIFxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgU0RGU2hhZGVyIGZyb20gJ3RocmVlLWJtZm9udC10ZXh0L3NoYWRlcnMvc2RmJztcbmltcG9ydCBjcmVhdGVHZW9tZXRyeSBmcm9tICd0aHJlZS1ibWZvbnQtdGV4dCc7XG5pbXBvcnQgcGFyc2VBU0NJSSBmcm9tICdwYXJzZS1ibWZvbnQtYXNjaWknO1xuXG5pbXBvcnQgKiBhcyBGb250IGZyb20gJy4vZm9udCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYXRlcmlhbCggY29sb3IgKXtcblxuICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcbiAgY29uc3QgaW1hZ2UgPSBGb250LmltYWdlKCk7XG4gIHRleHR1cmUuaW1hZ2UgPSBpbWFnZTtcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyO1xuICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcbiAgdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSB0cnVlO1xuXG4gIC8vICBhbmQgd2hhdCBhYm91dCBhbmlzb3Ryb3BpYyBmaWx0ZXJpbmc/XG5cbiAgcmV0dXJuIG5ldyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbChTREZTaGFkZXIoe1xuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgY29sb3I6IGNvbG9yLFxuICAgIG1hcDogdGV4dHVyZVxuICB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdG9yKCl7XG5cbiAgY29uc3QgZm9udCA9IHBhcnNlQVNDSUkoIEZvbnQuZm50KCkgKTtcblxuICBjb25zdCBjb2xvck1hdGVyaWFscyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZVRleHQoIHN0ciwgZm9udCwgY29sb3IgPSAweGZmZmZmZiApe1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBjcmVhdGVHZW9tZXRyeSh7XG4gICAgICB0ZXh0OiBzdHIsXG4gICAgICBhbGlnbjogJ2xlZnQnLFxuICAgICAgd2lkdGg6IDEwMDAsXG4gICAgICBmbGlwWTogdHJ1ZSxcbiAgICAgIGZvbnRcbiAgICB9KTtcblxuXG4gICAgY29uc3QgbGF5b3V0ID0gZ2VvbWV0cnkubGF5b3V0O1xuXG4gICAgbGV0IG1hdGVyaWFsID0gY29sb3JNYXRlcmlhbHNbIGNvbG9yIF07XG4gICAgaWYoIG1hdGVyaWFsID09PSB1bmRlZmluZWQgKXtcbiAgICAgIG1hdGVyaWFsID0gY29sb3JNYXRlcmlhbHNbIGNvbG9yIF0gPSBjcmVhdGVNYXRlcmlhbCggY29sb3IgKTtcbiAgICB9XG4gICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBnZW9tZXRyeSwgbWF0ZXJpYWwgKTtcbiAgICBtZXNoLnNjYWxlLm11bHRpcGx5KCBuZXcgVEhSRUUuVmVjdG9yMygxLC0xLDEpICk7XG4gICAgbWVzaC5zY2FsZS5tdWx0aXBseVNjYWxhciggMC4wMDEgKTtcblxuICAgIG1lc2gucG9zaXRpb24ueSA9IGxheW91dC5oZWlnaHQgKiAwLjUgKiAwLjAwMTtcblxuICAgIHJldHVybiBtZXNoO1xuICB9XG5cblxuICBmdW5jdGlvbiBjcmVhdGUoIHN0ciwgeyBjb2xvcj0weGZmZmZmZiB9ID0ge30gKXtcbiAgICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXG4gICAgbGV0IG1lc2ggPSBjcmVhdGVUZXh0KCBzdHIsIGZvbnQsIGNvbG9yICk7XG4gICAgZ3JvdXAuYWRkKCBtZXNoICk7XG4gICAgZ3JvdXAubGF5b3V0ID0gbWVzaC5nZW9tZXRyeS5sYXlvdXQ7XG5cbiAgICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgICBtZXNoLmdlb21ldHJ5LnVwZGF0ZSggc3RyICk7XG4gICAgfTtcblxuICAgIHJldHVybiBncm91cDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlLFxuICAgIGdldE1hdGVyaWFsOiAoKT0+IG1hdGVyaWFsXG4gIH1cblxufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qIFxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKiBcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKiBcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcblxuZXhwb3J0IGNvbnN0IFBBTkVMID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweGZmZmZmZiwgdmVydGV4Q29sb3JzOiBUSFJFRS5WZXJ0ZXhDb2xvcnMgfSApO1xuZXhwb3J0IGNvbnN0IExPQ0FUT1IgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcbmV4cG9ydCBjb25zdCBGT0xERVIgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4MDAwMDAwIH0gKTsiLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKiBcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiogXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiogXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVTbGlkZXIoIHtcbiAgdGV4dENyZWF0b3IsXG4gIG9iamVjdCxcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXG4gIGluaXRpYWxWYWx1ZSA9IDAuMCxcbiAgbWluID0gMC4wLCBtYXggPSAxLjAsXG4gIHN0ZXAgPSAwLjEsXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxufSA9IHt9ICl7XG5cblxuICBjb25zdCBTTElERVJfV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IFNMSURFUl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xuICBjb25zdCBTTElERVJfREVQVEggPSBkZXB0aDtcblxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBhbHBoYTogMS4wLFxuICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXG4gICAgc3RlcDogc3RlcCxcbiAgICBwcmVjaXNpb246IDEsXG4gICAgbGlzdGVuOiBmYWxzZSxcbiAgICBtaW46IG1pbixcbiAgICBtYXg6IG1heCxcbiAgICBvbkNoYW5nZWRDQjogdW5kZWZpbmVkLFxuICAgIG9uRmluaXNoZWRDaGFuZ2U6IHVuZGVmaW5lZFxuICB9O1xuXG4gIHN0YXRlLnN0ZXAgPSBnZXRJbXBsaWVkU3RlcCggc3RhdGUudmFsdWUgKTtcbiAgc3RhdGUucHJlY2lzaW9uID0gbnVtRGVjaW1hbHMoIHN0YXRlLnN0ZXAgKTtcbiAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XG5cbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcblxuICAvLyAgZmlsbGVkIHZvbHVtZVxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBTTElERVJfV0lEVEgsIFNMSURFUl9IRUlHSFQsIFNMSURFUl9ERVBUSCApO1xuICByZWN0LnRyYW5zbGF0ZShTTElERVJfV0lEVEgqMC41LDAsMCk7XG4gIC8vIExheW91dC5hbGlnbkxlZnQoIHJlY3QgKTtcblxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcblxuICAvLyAgb3V0bGluZSB2b2x1bWVcbiAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aDtcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XG5cbiAgY29uc3Qgb3V0bGluZSA9IG5ldyBUSFJFRS5Cb3hIZWxwZXIoIGhpdHNjYW5Wb2x1bWUgKTtcbiAgb3V0bGluZS5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5PVVRMSU5FX0NPTE9SICk7XG5cbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogQ29sb3JzLkRFRkFVTFRfQ09MT1IsIGVtaXNzaXZlOiBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgfSk7XG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBmaWxsZWRWb2x1bWUgKTtcblxuICBjb25zdCBlbmRMb2NhdG9yID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggMC4wNSwgMC4wNSwgMC4wNSwgMSwgMSwgMSApLCBTaGFyZWRNYXRlcmlhbHMuTE9DQVRPUiApO1xuICBlbmRMb2NhdG9yLnBvc2l0aW9uLnggPSBTTElERVJfV0lEVEg7XG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBlbmRMb2NhdG9yICk7XG4gIGVuZExvY2F0b3IudmlzaWJsZSA9IGZhbHNlO1xuXG4gIGNvbnN0IHZhbHVlTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHN0YXRlLnZhbHVlLnRvU3RyaW5nKCkgKTtcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX1ZBTFVFX1RFWFRfTUFSR0lOICsgd2lkdGggKiAwLjU7XG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoKjI7XG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xuXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfU0xJREVSICk7XG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XG5cbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBvdXRsaW5lLCB2YWx1ZUxhYmVsLCBjb250cm9sbGVySUQgKTtcblxuICBncm91cC5hZGQoIHBhbmVsIClcblxuICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xuICB1cGRhdGVTbGlkZXIoIHN0YXRlLmFscGhhICk7XG5cbiAgZnVuY3Rpb24gdXBkYXRlVmFsdWVMYWJlbCggdmFsdWUgKXtcbiAgICB2YWx1ZUxhYmVsLnVwZGF0ZSggcm91bmRUb0RlY2ltYWwoIHN0YXRlLnZhbHVlLCBzdGF0ZS5wcmVjaXNpb24gKS50b1N0cmluZygpICk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XG4gICAgaWYoIGludGVyYWN0aW9uLnByZXNzaW5nKCkgKXtcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLklOVEVSQUNUSU9OX0NPTE9SICk7XG4gICAgfVxuICAgIGVsc2VcbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfQ09MT1IgKTtcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkVNSVNTSVZFX0NPTE9SICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlU2xpZGVyKCBhbHBoYSApe1xuICAgIGZpbGxlZFZvbHVtZS5zY2FsZS54ID0gTWF0aC5tYXgoIGFscGhhICogd2lkdGgsIDAuMDAwMDAxICk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVPYmplY3QoIHZhbHVlICl7XG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IHZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlU3RhdGVGcm9tQWxwaGEoIGFscGhhICl7XG4gICAgc3RhdGUuYWxwaGEgPSBnZXRDbGFtcGVkQWxwaGEoIGFscGhhICk7XG4gICAgc3RhdGUudmFsdWUgPSBnZXRWYWx1ZUZyb21BbHBoYSggc3RhdGUuYWxwaGEsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XG4gICAgc3RhdGUudmFsdWUgPSBnZXRTdGVwcGVkVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5zdGVwICk7XG4gICAgc3RhdGUudmFsdWUgPSBnZXRDbGFtcGVkVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xuICB9XG5cbiAgZnVuY3Rpb24gbGlzdGVuVXBkYXRlKCl7XG4gICAgc3RhdGUudmFsdWUgPSBnZXRWYWx1ZUZyb21PYmplY3QoKTtcbiAgICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcbiAgICBzdGF0ZS5hbHBoYSA9IGdldENsYW1wZWRBbHBoYSggc3RhdGUuYWxwaGEgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZhbHVlRnJvbU9iamVjdCgpe1xuICAgIHJldHVybiBwYXJzZUZsb2F0KCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICk7XG4gIH1cblxuICBncm91cC5vbkNoYW5nZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xuICAgIHN0YXRlLm9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGdyb3VwLnN0ZXAgPSBmdW5jdGlvbiggc3RlcCApe1xuICAgIHN0YXRlLnN0ZXAgPSBzdGVwO1xuICAgIHN0YXRlLnByZWNpc2lvbiA9IG51bURlY2ltYWxzKCBzdGF0ZS5zdGVwIClcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgZ3JvdXAubGlzdGVuID0gZnVuY3Rpb24oKXtcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ3ByZXNzaW5nJywgaGFuZGxlUHJlc3MgKTtcblxuICBmdW5jdGlvbiBoYW5kbGVQcmVzcyggeyBwb2ludCB9ID0ge30gKXtcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmaWxsZWRWb2x1bWUudXBkYXRlTWF0cml4V29ybGQoKTtcbiAgICBlbmRMb2NhdG9yLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG5cbiAgICBjb25zdCBhID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGZpbGxlZFZvbHVtZS5tYXRyaXhXb3JsZCApO1xuICAgIGNvbnN0IGIgPSBuZXcgVEhSRUUuVmVjdG9yMygpLnNldEZyb21NYXRyaXhQb3NpdGlvbiggZW5kTG9jYXRvci5tYXRyaXhXb3JsZCApO1xuXG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHN0YXRlLnZhbHVlO1xuXG4gICAgdXBkYXRlU3RhdGVGcm9tQWxwaGEoIGdldFBvaW50QWxwaGEoIHBvaW50LCB7YSxifSApICk7XG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcbiAgICB1cGRhdGVTbGlkZXIoIHN0YXRlLmFscGhhICk7XG4gICAgdXBkYXRlT2JqZWN0KCBzdGF0ZS52YWx1ZSApO1xuXG4gICAgaWYoIHByZXZpb3VzVmFsdWUgIT09IHN0YXRlLnZhbHVlICYmIHN0YXRlLm9uQ2hhbmdlZENCICl7XG4gICAgICBzdGF0ZS5vbkNoYW5nZWRDQiggc3RhdGUudmFsdWUgKTtcbiAgICB9XG4gIH1cblxuICBncm91cC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xuXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XG5cbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgaWYoIHN0YXRlLmxpc3RlbiApe1xuICAgICAgbGlzdGVuVXBkYXRlKCk7XG4gICAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xuICAgICAgdXBkYXRlU2xpZGVyKCBzdGF0ZS5hbHBoYSApO1xuICAgIH1cbiAgICB1cGRhdGVWaWV3KCk7XG4gIH07XG5cbiAgcmV0dXJuIGdyb3VwO1xufVxuXG5mdW5jdGlvbiBnZXRQb2ludEFscGhhKCBwb2ludCwgc2VnbWVudCApe1xuICBjb25zdCBhID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5jb3B5KCBzZWdtZW50LmIgKS5zdWIoIHNlZ21lbnQuYSApO1xuICBjb25zdCBiID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5jb3B5KCBwb2ludCApLnN1Yiggc2VnbWVudC5hICk7XG4gIGNvbnN0IHByb2plY3RlZCA9IGIucHJvamVjdE9uVmVjdG9yKCBhICk7XG5cbiAgY29uc3QgbGVuZ3RoID0gc2VnbWVudC5hLmRpc3RhbmNlVG8oIHNlZ21lbnQuYiApO1xuXG4gIGxldCBhbHBoYSA9IHByb2plY3RlZC5sZW5ndGgoKSAvIGxlbmd0aDtcbiAgaWYoIGFscGhhID4gMS4wICl7XG4gICAgYWxwaGEgPSAxLjA7XG4gIH1cbiAgaWYoIGFscGhhIDwgMC4wICl7XG4gICAgYWxwaGEgPSAwLjA7XG4gIH1cbiAgcmV0dXJuIGFscGhhO1xufVxuXG5mdW5jdGlvbiBsZXJwKG1pbiwgbWF4LCB2YWx1ZSkge1xuICByZXR1cm4gKDEtdmFsdWUpKm1pbiArIHZhbHVlKm1heDtcbn1cblxuZnVuY3Rpb24gbWFwX3JhbmdlKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpIHtcbiAgICByZXR1cm4gbG93MiArIChoaWdoMiAtIGxvdzIpICogKHZhbHVlIC0gbG93MSkgLyAoaGlnaDEgLSBsb3cxKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2xhbXBlZEFscGhhKCBhbHBoYSApe1xuICBpZiggYWxwaGEgPiAxICl7XG4gICAgcmV0dXJuIDFcbiAgfVxuICBpZiggYWxwaGEgPCAwICl7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIGFscGhhO1xufVxuXG5mdW5jdGlvbiBnZXRDbGFtcGVkVmFsdWUoIHZhbHVlLCBtaW4sIG1heCApe1xuICBpZiggdmFsdWUgPCBtaW4gKXtcbiAgICByZXR1cm4gbWluO1xuICB9XG4gIGlmKCB2YWx1ZSA+IG1heCApe1xuICAgIHJldHVybiBtYXg7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBnZXRJbXBsaWVkU3RlcCggdmFsdWUgKXtcbiAgaWYoIHZhbHVlID09PSAwICl7XG4gICAgcmV0dXJuIDE7IC8vIFdoYXQgYXJlIHdlLCBwc3ljaGljcz9cbiAgfSBlbHNlIHtcbiAgICAvLyBIZXkgRG91ZywgY2hlY2sgdGhpcyBvdXQuXG4gICAgcmV0dXJuIE1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nKE1hdGguYWJzKHZhbHVlKSkvTWF0aC5MTjEwKSkvMTA7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWVGcm9tQWxwaGEoIGFscGhhLCBtaW4sIG1heCApe1xuICByZXR1cm4gbWFwX3JhbmdlKCBhbHBoYSwgMC4wLCAxLjAsIG1pbiwgbWF4IClcbn1cblxuZnVuY3Rpb24gZ2V0QWxwaGFGcm9tVmFsdWUoIHZhbHVlLCBtaW4sIG1heCApe1xuICByZXR1cm4gbWFwX3JhbmdlKCB2YWx1ZSwgbWluLCBtYXgsIDAuMCwgMS4wICk7XG59XG5cbmZ1bmN0aW9uIGdldFN0ZXBwZWRWYWx1ZSggdmFsdWUsIHN0ZXAgKXtcbiAgaWYoIHZhbHVlICUgc3RlcCAhPSAwKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoIHZhbHVlIC8gc3RlcCApICogc3RlcDtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIG51bURlY2ltYWxzKHgpIHtcbiAgeCA9IHgudG9TdHJpbmcoKTtcbiAgaWYgKHguaW5kZXhPZignLicpID4gLTEpIHtcbiAgICByZXR1cm4geC5sZW5ndGggLSB4LmluZGV4T2YoJy4nKSAtIDE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcm91bmRUb0RlY2ltYWwodmFsdWUsIGRlY2ltYWxzKSB7XG4gIGNvbnN0IHRlblRvID0gTWF0aC5wb3coMTAsIGRlY2ltYWxzKTtcbiAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiB0ZW5UbykgLyB0ZW5Ubztcbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKiBcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiogXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiogXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVUZXh0TGFiZWwoIHRleHRDcmVhdG9yLCBzdHIsIHdpZHRoID0gMC40LCBkZXB0aCA9IDAuMDI5LCBmZ0NvbG9yID0gMHhmZmZmZmYsIGJnQ29sb3IgPSBDb2xvcnMuREVGQVVMVF9CQUNLICl7XG5cbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgY29uc3QgaW50ZXJuYWxQb3NpdGlvbmluZyA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICBncm91cC5hZGQoIGludGVybmFsUG9zaXRpb25pbmcgKTtcblxuICBjb25zdCB0ZXh0ID0gdGV4dENyZWF0b3IuY3JlYXRlKCBzdHIsIHsgY29sb3I6IGZnQ29sb3IgfSApO1xuICBpbnRlcm5hbFBvc2l0aW9uaW5nLmFkZCggdGV4dCApO1xuXG4gIGdyb3VwLnNldFN0cmluZyA9IGZ1bmN0aW9uKCBzdHIgKXtcbiAgICB0ZXh0LnVwZGF0ZSggc3RyLnRvU3RyaW5nKCkgKTtcbiAgfTtcblxuICBncm91cC5zZXROdW1iZXIgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgdGV4dC51cGRhdGUoIHN0ci50b0ZpeGVkKDIpICk7XG4gIH07XG5cbiAgdGV4dC5wb3NpdGlvbi56ID0gMC4wMTVcblxuICBjb25zdCBiYWNrQm91bmRzID0gMC4wMTtcbiAgY29uc3QgbWFyZ2luID0gMC4wMTtcbiAgY29uc3QgdG90YWxXaWR0aCA9IHdpZHRoO1xuICBjb25zdCB0b3RhbEhlaWdodCA9IDAuMDQgKyBtYXJnaW4gKiAyO1xuICBjb25zdCBsYWJlbEJhY2tHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggdG90YWxXaWR0aCwgdG90YWxIZWlnaHQsIGRlcHRoLCAxLCAxLCAxICk7XG4gIGxhYmVsQmFja0dlb21ldHJ5LmFwcGx5TWF0cml4KCBuZXcgVEhSRUUuTWF0cml4NCgpLm1ha2VUcmFuc2xhdGlvbiggdG90YWxXaWR0aCAqIDAuNSAtIG1hcmdpbiwgMCwgMCApICk7XG5cbiAgY29uc3QgbGFiZWxCYWNrTWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBsYWJlbEJhY2tHZW9tZXRyeSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBsYWJlbEJhY2tNZXNoLmdlb21ldHJ5LCBiZ0NvbG9yICk7XG5cbiAgbGFiZWxCYWNrTWVzaC5wb3NpdGlvbi55ID0gMC4wMztcbiAgLy8gbGFiZWxCYWNrTWVzaC5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XG4gIGludGVybmFsUG9zaXRpb25pbmcuYWRkKCBsYWJlbEJhY2tNZXNoICk7XG4gIGludGVybmFsUG9zaXRpb25pbmcucG9zaXRpb24ueSA9IC10b3RhbEhlaWdodCAqIDAuNTtcblxuICAvLyBsYWJlbEdyb3VwLnBvc2l0aW9uLnggPSBsYWJlbEJvdW5kcy53aWR0aCAqIDAuNTtcbiAgLy8gbGFiZWxHcm91cC5wb3NpdGlvbi55ID0gbGFiZWxCb3VuZHMuaGVpZ2h0ICogMC41O1xuXG4gIGdyb3VwLmJhY2sgPSBsYWJlbEJhY2tNZXNoO1xuXG4gIHJldHVybiBncm91cDtcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlQk1Gb250QXNjaWkoZGF0YSkge1xuICBpZiAoIWRhdGEpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBkYXRhIHByb3ZpZGVkJylcbiAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKS50cmltKClcblxuICB2YXIgb3V0cHV0ID0ge1xuICAgIHBhZ2VzOiBbXSxcbiAgICBjaGFyczogW10sXG4gICAga2VybmluZ3M6IFtdXG4gIH1cblxuICB2YXIgbGluZXMgPSBkYXRhLnNwbGl0KC9cXHJcXG4/fFxcbi9nKVxuXG4gIGlmIChsaW5lcy5sZW5ndGggPT09IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBkYXRhIGluIEJNRm9udCBmaWxlJylcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGxpbmVEYXRhID0gc3BsaXRMaW5lKGxpbmVzW2ldLCBpKVxuICAgIGlmICghbGluZURhdGEpIC8vc2tpcCBlbXB0eSBsaW5lc1xuICAgICAgY29udGludWVcblxuICAgIGlmIChsaW5lRGF0YS5rZXkgPT09ICdwYWdlJykge1xuICAgICAgaWYgKHR5cGVvZiBsaW5lRGF0YS5kYXRhLmlkICE9PSAnbnVtYmVyJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYWxmb3JtZWQgZmlsZSBhdCBsaW5lICcgKyBpICsgJyAtLSBuZWVkcyBwYWdlIGlkPU4nKVxuICAgICAgaWYgKHR5cGVvZiBsaW5lRGF0YS5kYXRhLmZpbGUgIT09ICdzdHJpbmcnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbGZvcm1lZCBmaWxlIGF0IGxpbmUgJyArIGkgKyAnIC0tIG5lZWRzIHBhZ2UgZmlsZT1cInBhdGhcIicpXG4gICAgICBvdXRwdXQucGFnZXNbbGluZURhdGEuZGF0YS5pZF0gPSBsaW5lRGF0YS5kYXRhLmZpbGVcbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2NoYXJzJyB8fCBsaW5lRGF0YS5rZXkgPT09ICdrZXJuaW5ncycpIHtcbiAgICAgIC8vLi4uIGRvIG5vdGhpbmcgZm9yIHRoZXNlIHR3byAuLi5cbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2NoYXInKSB7XG4gICAgICBvdXRwdXQuY2hhcnMucHVzaChsaW5lRGF0YS5kYXRhKVxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAna2VybmluZycpIHtcbiAgICAgIG91dHB1dC5rZXJuaW5ncy5wdXNoKGxpbmVEYXRhLmRhdGEpXG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dFtsaW5lRGF0YS5rZXldID0gbGluZURhdGEuZGF0YVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRwdXRcbn1cblxuZnVuY3Rpb24gc3BsaXRMaW5lKGxpbmUsIGlkeCkge1xuICBsaW5lID0gbGluZS5yZXBsYWNlKC9cXHQrL2csICcgJykudHJpbSgpXG4gIGlmICghbGluZSlcbiAgICByZXR1cm4gbnVsbFxuXG4gIHZhciBzcGFjZSA9IGxpbmUuaW5kZXhPZignICcpXG4gIGlmIChzcGFjZSA9PT0gLTEpIFxuICAgIHRocm93IG5ldyBFcnJvcihcIm5vIG5hbWVkIHJvdyBhdCBsaW5lIFwiICsgaWR4KVxuXG4gIHZhciBrZXkgPSBsaW5lLnN1YnN0cmluZygwLCBzcGFjZSlcblxuICBsaW5lID0gbGluZS5zdWJzdHJpbmcoc3BhY2UgKyAxKVxuICAvL2NsZWFyIFwibGV0dGVyXCIgZmllbGQgYXMgaXQgaXMgbm9uLXN0YW5kYXJkIGFuZFxuICAvL3JlcXVpcmVzIGFkZGl0aW9uYWwgY29tcGxleGl0eSB0byBwYXJzZSBcIiAvID0gc3ltYm9sc1xuICBsaW5lID0gbGluZS5yZXBsYWNlKC9sZXR0ZXI9W1xcJ1xcXCJdXFxTK1tcXCdcXFwiXS9naSwgJycpICBcbiAgbGluZSA9IGxpbmUuc3BsaXQoXCI9XCIpXG4gIGxpbmUgPSBsaW5lLm1hcChmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRyaW0oKS5tYXRjaCgoLyhcIi4qP1wifFteXCJcXHNdKykrKD89XFxzKnxcXHMqJCkvZykpXG4gIH0pXG5cbiAgdmFyIGRhdGEgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmUubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZHQgPSBsaW5lW2ldXG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIGtleTogZHRbMF0sXG4gICAgICAgIGRhdGE6IFwiXCJcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChpID09PSBsaW5lLmxlbmd0aCAtIDEpIHtcbiAgICAgIGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRhID0gcGFyc2VEYXRhKGR0WzBdKVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhW2RhdGEubGVuZ3RoIC0gMV0uZGF0YSA9IHBhcnNlRGF0YShkdFswXSlcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIGtleTogZHRbMV0sXG4gICAgICAgIGRhdGE6IFwiXCJcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdmFyIG91dCA9IHtcbiAgICBrZXk6IGtleSxcbiAgICBkYXRhOiB7fVxuICB9XG5cbiAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICBvdXQuZGF0YVt2LmtleV0gPSB2LmRhdGE7XG4gIH0pXG5cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBwYXJzZURhdGEoZGF0YSkge1xuICBpZiAoIWRhdGEgfHwgZGF0YS5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIFwiXCJcblxuICBpZiAoZGF0YS5pbmRleE9mKCdcIicpID09PSAwIHx8IGRhdGEuaW5kZXhPZihcIidcIikgPT09IDApXG4gICAgcmV0dXJuIGRhdGEuc3Vic3RyaW5nKDEsIGRhdGEubGVuZ3RoIC0gMSlcbiAgaWYgKGRhdGEuaW5kZXhPZignLCcpICE9PSAtMSlcbiAgICByZXR1cm4gcGFyc2VJbnRMaXN0KGRhdGEpXG4gIHJldHVybiBwYXJzZUludChkYXRhLCAxMClcbn1cblxuZnVuY3Rpb24gcGFyc2VJbnRMaXN0KGRhdGEpIHtcbiAgcmV0dXJuIGRhdGEuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24odmFsKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KHZhbCwgMTApXG4gIH0pXG59IiwidmFyIGNyZWF0ZUxheW91dCA9IHJlcXVpcmUoJ2xheW91dC1ibWZvbnQtdGV4dCcpXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG52YXIgY3JlYXRlSW5kaWNlcyA9IHJlcXVpcmUoJ3F1YWQtaW5kaWNlcycpXG52YXIgYnVmZmVyID0gcmVxdWlyZSgndGhyZWUtYnVmZmVyLXZlcnRleC1kYXRhJylcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJylcblxudmFyIHZlcnRpY2VzID0gcmVxdWlyZSgnLi9saWIvdmVydGljZXMnKVxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi9saWIvdXRpbHMnKVxuXG52YXIgQmFzZSA9IFRIUkVFLkJ1ZmZlckdlb21ldHJ5XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlVGV4dEdlb21ldHJ5IChvcHQpIHtcbiAgcmV0dXJuIG5ldyBUZXh0R2VvbWV0cnkob3B0KVxufVxuXG5mdW5jdGlvbiBUZXh0R2VvbWV0cnkgKG9wdCkge1xuICBCYXNlLmNhbGwodGhpcylcblxuICBpZiAodHlwZW9mIG9wdCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHQgPSB7IHRleHQ6IG9wdCB9XG4gIH1cblxuICAvLyB1c2UgdGhlc2UgYXMgZGVmYXVsdCB2YWx1ZXMgZm9yIGFueSBzdWJzZXF1ZW50XG4gIC8vIGNhbGxzIHRvIHVwZGF0ZSgpXG4gIHRoaXMuX29wdCA9IGFzc2lnbih7fSwgb3B0KVxuXG4gIC8vIGFsc28gZG8gYW4gaW5pdGlhbCBzZXR1cC4uLlxuICBpZiAob3B0KSB0aGlzLnVwZGF0ZShvcHQpXG59XG5cbmluaGVyaXRzKFRleHRHZW9tZXRyeSwgQmFzZSlcblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAob3B0KSB7XG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJykge1xuICAgIG9wdCA9IHsgdGV4dDogb3B0IH1cbiAgfVxuXG4gIC8vIHVzZSBjb25zdHJ1Y3RvciBkZWZhdWx0c1xuICBvcHQgPSBhc3NpZ24oe30sIHRoaXMuX29wdCwgb3B0KVxuXG4gIGlmICghb3B0LmZvbnQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHNwZWNpZnkgYSB7IGZvbnQgfSBpbiBvcHRpb25zJylcbiAgfVxuXG4gIHRoaXMubGF5b3V0ID0gY3JlYXRlTGF5b3V0KG9wdClcblxuICAvLyBnZXQgdmVjMiB0ZXhjb29yZHNcbiAgdmFyIGZsaXBZID0gb3B0LmZsaXBZICE9PSBmYWxzZVxuXG4gIC8vIHRoZSBkZXNpcmVkIEJNRm9udCBkYXRhXG4gIHZhciBmb250ID0gb3B0LmZvbnRcblxuICAvLyBkZXRlcm1pbmUgdGV4dHVyZSBzaXplIGZyb20gZm9udCBmaWxlXG4gIHZhciB0ZXhXaWR0aCA9IGZvbnQuY29tbW9uLnNjYWxlV1xuICB2YXIgdGV4SGVpZ2h0ID0gZm9udC5jb21tb24uc2NhbGVIXG5cbiAgLy8gZ2V0IHZpc2libGUgZ2x5cGhzXG4gIHZhciBnbHlwaHMgPSB0aGlzLmxheW91dC5nbHlwaHMuZmlsdGVyKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG4gICAgcmV0dXJuIGJpdG1hcC53aWR0aCAqIGJpdG1hcC5oZWlnaHQgPiAwXG4gIH0pXG5cbiAgLy8gcHJvdmlkZSB2aXNpYmxlIGdseXBocyBmb3IgY29udmVuaWVuY2VcbiAgdGhpcy52aXNpYmxlR2x5cGhzID0gZ2x5cGhzXG5cbiAgLy8gZ2V0IGNvbW1vbiB2ZXJ0ZXggZGF0YVxuICB2YXIgcG9zaXRpb25zID0gdmVydGljZXMucG9zaXRpb25zKGdseXBocylcbiAgdmFyIHV2cyA9IHZlcnRpY2VzLnV2cyhnbHlwaHMsIHRleFdpZHRoLCB0ZXhIZWlnaHQsIGZsaXBZKVxuICB2YXIgaW5kaWNlcyA9IGNyZWF0ZUluZGljZXMoe1xuICAgIGNsb2Nrd2lzZTogdHJ1ZSxcbiAgICB0eXBlOiAndWludDE2JyxcbiAgICBjb3VudDogZ2x5cGhzLmxlbmd0aFxuICB9KVxuXG4gIC8vIHVwZGF0ZSB2ZXJ0ZXggZGF0YVxuICBidWZmZXIuaW5kZXgodGhpcywgaW5kaWNlcywgMSwgJ3VpbnQxNicpXG4gIGJ1ZmZlci5hdHRyKHRoaXMsICdwb3NpdGlvbicsIHBvc2l0aW9ucywgMilcbiAgYnVmZmVyLmF0dHIodGhpcywgJ3V2JywgdXZzLCAyKVxuXG4gIC8vIHVwZGF0ZSBtdWx0aXBhZ2UgZGF0YVxuICBpZiAoIW9wdC5tdWx0aXBhZ2UgJiYgJ3BhZ2UnIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIC8vIGRpc2FibGUgbXVsdGlwYWdlIHJlbmRlcmluZ1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdwYWdlJylcbiAgfSBlbHNlIGlmIChvcHQubXVsdGlwYWdlKSB7XG4gICAgdmFyIHBhZ2VzID0gdmVydGljZXMucGFnZXMoZ2x5cGhzKVxuICAgIC8vIGVuYWJsZSBtdWx0aXBhZ2UgcmVuZGVyaW5nXG4gICAgYnVmZmVyLmF0dHIodGhpcywgJ3BhZ2UnLCBwYWdlcywgMSlcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVCb3VuZGluZ1NwaGVyZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYm91bmRpbmdTcGhlcmUgPT09IG51bGwpIHtcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlID0gbmV3IFRIUkVFLlNwaGVyZSgpXG4gIH1cblxuICB2YXIgcG9zaXRpb25zID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5XG4gIHZhciBpdGVtU2l6ZSA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5pdGVtU2l6ZVxuICBpZiAoIXBvc2l0aW9ucyB8fCAhaXRlbVNpemUgfHwgcG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlLnJhZGl1cyA9IDBcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlLmNlbnRlci5zZXQoMCwgMCwgMClcbiAgICByZXR1cm5cbiAgfVxuICB1dGlscy5jb21wdXRlU3BoZXJlKHBvc2l0aW9ucywgdGhpcy5ib3VuZGluZ1NwaGVyZSlcbiAgaWYgKGlzTmFOKHRoaXMuYm91bmRpbmdTcGhlcmUucmFkaXVzKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1RIUkVFLkJ1ZmZlckdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpOiAnICtcbiAgICAgICdDb21wdXRlZCByYWRpdXMgaXMgTmFOLiBUaGUgJyArXG4gICAgICAnXCJwb3NpdGlvblwiIGF0dHJpYnV0ZSBpcyBsaWtlbHkgdG8gaGF2ZSBOYU4gdmFsdWVzLicpXG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS5jb21wdXRlQm91bmRpbmdCb3ggPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmJvdW5kaW5nQm94ID09PSBudWxsKSB7XG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IG5ldyBUSFJFRS5Cb3gzKClcbiAgfVxuXG4gIHZhciBiYm94ID0gdGhpcy5ib3VuZGluZ0JveFxuICB2YXIgcG9zaXRpb25zID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5XG4gIHZhciBpdGVtU2l6ZSA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5pdGVtU2l6ZVxuICBpZiAoIXBvc2l0aW9ucyB8fCAhaXRlbVNpemUgfHwgcG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICBiYm94Lm1ha2VFbXB0eSgpXG4gICAgcmV0dXJuXG4gIH1cbiAgdXRpbHMuY29tcHV0ZUJveChwb3NpdGlvbnMsIGJib3gpXG59XG4iLCJ2YXIgaXRlbVNpemUgPSAyXG52YXIgYm94ID0geyBtaW46IFswLCAwXSwgbWF4OiBbMCwgMF0gfVxuXG5mdW5jdGlvbiBib3VuZHMgKHBvc2l0aW9ucykge1xuICB2YXIgY291bnQgPSBwb3NpdGlvbnMubGVuZ3RoIC8gaXRlbVNpemVcbiAgYm94Lm1pblswXSA9IHBvc2l0aW9uc1swXVxuICBib3gubWluWzFdID0gcG9zaXRpb25zWzFdXG4gIGJveC5tYXhbMF0gPSBwb3NpdGlvbnNbMF1cbiAgYm94Lm1heFsxXSA9IHBvc2l0aW9uc1sxXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIHZhciB4ID0gcG9zaXRpb25zW2kgKiBpdGVtU2l6ZSArIDBdXG4gICAgdmFyIHkgPSBwb3NpdGlvbnNbaSAqIGl0ZW1TaXplICsgMV1cbiAgICBib3gubWluWzBdID0gTWF0aC5taW4oeCwgYm94Lm1pblswXSlcbiAgICBib3gubWluWzFdID0gTWF0aC5taW4oeSwgYm94Lm1pblsxXSlcbiAgICBib3gubWF4WzBdID0gTWF0aC5tYXgoeCwgYm94Lm1heFswXSlcbiAgICBib3gubWF4WzFdID0gTWF0aC5tYXgoeSwgYm94Lm1heFsxXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlQm94ID0gZnVuY3Rpb24gKHBvc2l0aW9ucywgb3V0cHV0KSB7XG4gIGJvdW5kcyhwb3NpdGlvbnMpXG4gIG91dHB1dC5taW4uc2V0KGJveC5taW5bMF0sIGJveC5taW5bMV0sIDApXG4gIG91dHB1dC5tYXguc2V0KGJveC5tYXhbMF0sIGJveC5tYXhbMV0sIDApXG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbXB1dGVTcGhlcmUgPSBmdW5jdGlvbiAocG9zaXRpb25zLCBvdXRwdXQpIHtcbiAgYm91bmRzKHBvc2l0aW9ucylcbiAgdmFyIG1pblggPSBib3gubWluWzBdXG4gIHZhciBtaW5ZID0gYm94Lm1pblsxXVxuICB2YXIgbWF4WCA9IGJveC5tYXhbMF1cbiAgdmFyIG1heFkgPSBib3gubWF4WzFdXG4gIHZhciB3aWR0aCA9IG1heFggLSBtaW5YXG4gIHZhciBoZWlnaHQgPSBtYXhZIC0gbWluWVxuICB2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHdpZHRoICogd2lkdGggKyBoZWlnaHQgKiBoZWlnaHQpXG4gIG91dHB1dC5jZW50ZXIuc2V0KG1pblggKyB3aWR0aCAvIDIsIG1pblkgKyBoZWlnaHQgLyAyLCAwKVxuICBvdXRwdXQucmFkaXVzID0gbGVuZ3RoIC8gMlxufVxuIiwibW9kdWxlLmV4cG9ydHMucGFnZXMgPSBmdW5jdGlvbiBwYWdlcyAoZ2x5cGhzKSB7XG4gIHZhciBwYWdlcyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAxKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGlkID0gZ2x5cGguZGF0YS5wYWdlIHx8IDBcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgfSlcbiAgcmV0dXJuIHBhZ2VzXG59XG5cbm1vZHVsZS5leHBvcnRzLnV2cyA9IGZ1bmN0aW9uIHV2cyAoZ2x5cGhzLCB0ZXhXaWR0aCwgdGV4SGVpZ2h0LCBmbGlwWSkge1xuICB2YXIgdXZzID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDIpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuICAgIHZhciBidyA9IChiaXRtYXAueCArIGJpdG1hcC53aWR0aClcbiAgICB2YXIgYmggPSAoYml0bWFwLnkgKyBiaXRtYXAuaGVpZ2h0KVxuXG4gICAgLy8gdG9wIGxlZnQgcG9zaXRpb25cbiAgICB2YXIgdTAgPSBiaXRtYXAueCAvIHRleFdpZHRoXG4gICAgdmFyIHYxID0gYml0bWFwLnkgLyB0ZXhIZWlnaHRcbiAgICB2YXIgdTEgPSBidyAvIHRleFdpZHRoXG4gICAgdmFyIHYwID0gYmggLyB0ZXhIZWlnaHRcblxuICAgIGlmIChmbGlwWSkge1xuICAgICAgdjEgPSAodGV4SGVpZ2h0IC0gYml0bWFwLnkpIC8gdGV4SGVpZ2h0XG4gICAgICB2MCA9ICh0ZXhIZWlnaHQgLSBiaCkgLyB0ZXhIZWlnaHRcbiAgICB9XG5cbiAgICAvLyBCTFxuICAgIHV2c1tpKytdID0gdTBcbiAgICB1dnNbaSsrXSA9IHYxXG4gICAgLy8gVExcbiAgICB1dnNbaSsrXSA9IHUwXG4gICAgdXZzW2krK10gPSB2MFxuICAgIC8vIFRSXG4gICAgdXZzW2krK10gPSB1MVxuICAgIHV2c1tpKytdID0gdjBcbiAgICAvLyBCUlxuICAgIHV2c1tpKytdID0gdTFcbiAgICB1dnNbaSsrXSA9IHYxXG4gIH0pXG4gIHJldHVybiB1dnNcbn1cblxubW9kdWxlLmV4cG9ydHMucG9zaXRpb25zID0gZnVuY3Rpb24gcG9zaXRpb25zIChnbHlwaHMpIHtcbiAgdmFyIHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAyKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcblxuICAgIC8vIGJvdHRvbSBsZWZ0IHBvc2l0aW9uXG4gICAgdmFyIHggPSBnbHlwaC5wb3NpdGlvblswXSArIGJpdG1hcC54b2Zmc2V0XG4gICAgdmFyIHkgPSBnbHlwaC5wb3NpdGlvblsxXSArIGJpdG1hcC55b2Zmc2V0XG5cbiAgICAvLyBxdWFkIHNpemVcbiAgICB2YXIgdyA9IGJpdG1hcC53aWR0aFxuICAgIHZhciBoID0gYml0bWFwLmhlaWdodFxuXG4gICAgLy8gQkxcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHhcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHlcbiAgICAvLyBUTFxuICAgIHBvc2l0aW9uc1tpKytdID0geFxuICAgIHBvc2l0aW9uc1tpKytdID0geSArIGhcbiAgICAvLyBUUlxuICAgIHBvc2l0aW9uc1tpKytdID0geCArIHdcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHkgKyBoXG4gICAgLy8gQlJcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHggKyB3XG4gICAgcG9zaXRpb25zW2krK10gPSB5XG4gIH0pXG4gIHJldHVybiBwb3NpdGlvbnNcbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwidmFyIHdvcmRXcmFwID0gcmVxdWlyZSgnd29yZC13cmFwcGVyJylcbnZhciB4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kJylcbnZhciBmaW5kQ2hhciA9IHJlcXVpcmUoJ2luZGV4b2YtcHJvcGVydHknKSgnaWQnKVxudmFyIG51bWJlciA9IHJlcXVpcmUoJ2FzLW51bWJlcicpXG5cbnZhciBYX0hFSUdIVFMgPSBbJ3gnLCAnZScsICdhJywgJ28nLCAnbicsICdzJywgJ3InLCAnYycsICd1JywgJ20nLCAndicsICd3JywgJ3onXVxudmFyIE1fV0lEVEhTID0gWydtJywgJ3cnXVxudmFyIENBUF9IRUlHSFRTID0gWydIJywgJ0knLCAnTicsICdFJywgJ0YnLCAnSycsICdMJywgJ1QnLCAnVScsICdWJywgJ1cnLCAnWCcsICdZJywgJ1onXVxuXG5cbnZhciBUQUJfSUQgPSAnXFx0Jy5jaGFyQ29kZUF0KDApXG52YXIgU1BBQ0VfSUQgPSAnICcuY2hhckNvZGVBdCgwKVxudmFyIEFMSUdOX0xFRlQgPSAwLCBcbiAgICBBTElHTl9DRU5URVIgPSAxLCBcbiAgICBBTElHTl9SSUdIVCA9IDJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVMYXlvdXQob3B0KSB7XG4gIHJldHVybiBuZXcgVGV4dExheW91dChvcHQpXG59XG5cbmZ1bmN0aW9uIFRleHRMYXlvdXQob3B0KSB7XG4gIHRoaXMuZ2x5cGhzID0gW11cbiAgdGhpcy5fbWVhc3VyZSA9IHRoaXMuY29tcHV0ZU1ldHJpY3MuYmluZCh0aGlzKVxuICB0aGlzLnVwZGF0ZShvcHQpXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG9wdCkge1xuICBvcHQgPSB4dGVuZCh7XG4gICAgbWVhc3VyZTogdGhpcy5fbWVhc3VyZVxuICB9LCBvcHQpXG4gIHRoaXMuX29wdCA9IG9wdFxuICB0aGlzLl9vcHQudGFiU2l6ZSA9IG51bWJlcih0aGlzLl9vcHQudGFiU2l6ZSwgNClcblxuICBpZiAoIW9wdC5mb250KVxuICAgIHRocm93IG5ldyBFcnJvcignbXVzdCBwcm92aWRlIGEgdmFsaWQgYml0bWFwIGZvbnQnKVxuXG4gIHZhciBnbHlwaHMgPSB0aGlzLmdseXBoc1xuICB2YXIgdGV4dCA9IG9wdC50ZXh0fHwnJyBcbiAgdmFyIGZvbnQgPSBvcHQuZm9udFxuICB0aGlzLl9zZXR1cFNwYWNlR2x5cGhzKGZvbnQpXG4gIFxuICB2YXIgbGluZXMgPSB3b3JkV3JhcC5saW5lcyh0ZXh0LCBvcHQpXG4gIHZhciBtaW5XaWR0aCA9IG9wdC53aWR0aCB8fCAwXG5cbiAgLy9jbGVhciBnbHlwaHNcbiAgZ2x5cGhzLmxlbmd0aCA9IDBcblxuICAvL2dldCBtYXggbGluZSB3aWR0aFxuICB2YXIgbWF4TGluZVdpZHRoID0gbGluZXMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGxpbmUpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgocHJldiwgbGluZS53aWR0aCwgbWluV2lkdGgpXG4gIH0sIDApXG5cbiAgLy90aGUgcGVuIHBvc2l0aW9uXG4gIHZhciB4ID0gMFxuICB2YXIgeSA9IDBcbiAgdmFyIGxpbmVIZWlnaHQgPSBudW1iZXIob3B0LmxpbmVIZWlnaHQsIGZvbnQuY29tbW9uLmxpbmVIZWlnaHQpXG4gIHZhciBiYXNlbGluZSA9IGZvbnQuY29tbW9uLmJhc2VcbiAgdmFyIGRlc2NlbmRlciA9IGxpbmVIZWlnaHQtYmFzZWxpbmVcbiAgdmFyIGxldHRlclNwYWNpbmcgPSBvcHQubGV0dGVyU3BhY2luZyB8fCAwXG4gIHZhciBoZWlnaHQgPSBsaW5lSGVpZ2h0ICogbGluZXMubGVuZ3RoIC0gZGVzY2VuZGVyXG4gIHZhciBhbGlnbiA9IGdldEFsaWduVHlwZSh0aGlzLl9vcHQuYWxpZ24pXG5cbiAgLy9kcmF3IHRleHQgYWxvbmcgYmFzZWxpbmVcbiAgeSAtPSBoZWlnaHRcbiAgXG4gIC8vdGhlIG1ldHJpY3MgZm9yIHRoaXMgdGV4dCBsYXlvdXRcbiAgdGhpcy5fd2lkdGggPSBtYXhMaW5lV2lkdGhcbiAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0XG4gIHRoaXMuX2Rlc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBiYXNlbGluZVxuICB0aGlzLl9iYXNlbGluZSA9IGJhc2VsaW5lXG4gIHRoaXMuX3hIZWlnaHQgPSBnZXRYSGVpZ2h0KGZvbnQpXG4gIHRoaXMuX2NhcEhlaWdodCA9IGdldENhcEhlaWdodChmb250KVxuICB0aGlzLl9saW5lSGVpZ2h0ID0gbGluZUhlaWdodFxuICB0aGlzLl9hc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBkZXNjZW5kZXIgLSB0aGlzLl94SGVpZ2h0XG4gICAgXG4gIC8vbGF5b3V0IGVhY2ggZ2x5cGhcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgbGluZUluZGV4KSB7XG4gICAgdmFyIHN0YXJ0ID0gbGluZS5zdGFydFxuICAgIHZhciBlbmQgPSBsaW5lLmVuZFxuICAgIHZhciBsaW5lV2lkdGggPSBsaW5lLndpZHRoXG4gICAgdmFyIGxhc3RHbHlwaFxuICAgIFxuICAgIC8vZm9yIGVhY2ggZ2x5cGggaW4gdGhhdCBsaW5lLi4uXG4gICAgZm9yICh2YXIgaT1zdGFydDsgaTxlbmQ7IGkrKykge1xuICAgICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgICB2YXIgZ2x5cGggPSBzZWxmLmdldEdseXBoKGZvbnQsIGlkKVxuICAgICAgaWYgKGdseXBoKSB7XG4gICAgICAgIGlmIChsYXN0R2x5cGgpIFxuICAgICAgICAgIHggKz0gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKVxuXG4gICAgICAgIHZhciB0eCA9IHhcbiAgICAgICAgaWYgKGFsaWduID09PSBBTElHTl9DRU5URVIpIFxuICAgICAgICAgIHR4ICs9IChtYXhMaW5lV2lkdGgtbGluZVdpZHRoKS8yXG4gICAgICAgIGVsc2UgaWYgKGFsaWduID09PSBBTElHTl9SSUdIVClcbiAgICAgICAgICB0eCArPSAobWF4TGluZVdpZHRoLWxpbmVXaWR0aClcblxuICAgICAgICBnbHlwaHMucHVzaCh7XG4gICAgICAgICAgcG9zaXRpb246IFt0eCwgeV0sXG4gICAgICAgICAgZGF0YTogZ2x5cGgsXG4gICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgbGluZTogbGluZUluZGV4XG4gICAgICAgIH0pICBcblxuICAgICAgICAvL21vdmUgcGVuIGZvcndhcmRcbiAgICAgICAgeCArPSBnbHlwaC54YWR2YW5jZSArIGxldHRlclNwYWNpbmdcbiAgICAgICAgbGFzdEdseXBoID0gZ2x5cGhcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL25leHQgbGluZSBkb3duXG4gICAgeSArPSBsaW5lSGVpZ2h0XG4gICAgeCA9IDBcbiAgfSlcbiAgdGhpcy5fbGluZXNUb3RhbCA9IGxpbmVzLmxlbmd0aDtcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuX3NldHVwU3BhY2VHbHlwaHMgPSBmdW5jdGlvbihmb250KSB7XG4gIC8vVGhlc2UgYXJlIGZhbGxiYWNrcywgd2hlbiB0aGUgZm9udCBkb2Vzbid0IGluY2x1ZGVcbiAgLy8nICcgb3IgJ1xcdCcgZ2x5cGhzXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IG51bGxcbiAgdGhpcy5fZmFsbGJhY2tUYWJHbHlwaCA9IG51bGxcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuXG5cbiAgLy90cnkgdG8gZ2V0IHNwYWNlIGdseXBoXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlICdtJyBvciAndycgZ2x5cGhzXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlIGZpcnN0IGdseXBoIGF2YWlsYWJsZVxuICB2YXIgc3BhY2UgPSBnZXRHbHlwaEJ5SWQoZm9udCwgU1BBQ0VfSUQpIFxuICAgICAgICAgIHx8IGdldE1HbHlwaChmb250KSBcbiAgICAgICAgICB8fCBmb250LmNoYXJzWzBdXG5cbiAgLy9hbmQgY3JlYXRlIGEgZmFsbGJhY2sgZm9yIHRhYlxuICB2YXIgdGFiV2lkdGggPSB0aGlzLl9vcHQudGFiU2l6ZSAqIHNwYWNlLnhhZHZhbmNlXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IHNwYWNlXG4gIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGggPSB4dGVuZChzcGFjZSwge1xuICAgIHg6IDAsIHk6IDAsIHhhZHZhbmNlOiB0YWJXaWR0aCwgaWQ6IFRBQl9JRCwgXG4gICAgeG9mZnNldDogMCwgeW9mZnNldDogMCwgd2lkdGg6IDAsIGhlaWdodDogMFxuICB9KVxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5nZXRHbHlwaCA9IGZ1bmN0aW9uKGZvbnQsIGlkKSB7XG4gIHZhciBnbHlwaCA9IGdldEdseXBoQnlJZChmb250LCBpZClcbiAgaWYgKGdseXBoKVxuICAgIHJldHVybiBnbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gVEFCX0lEKSBcbiAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tUYWJHbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gU1BBQ0VfSUQpIFxuICAgIHJldHVybiB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGhcbiAgcmV0dXJuIG51bGxcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuY29tcHV0ZU1ldHJpY3MgPSBmdW5jdGlvbih0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICB2YXIgbGV0dGVyU3BhY2luZyA9IHRoaXMuX29wdC5sZXR0ZXJTcGFjaW5nIHx8IDBcbiAgdmFyIGZvbnQgPSB0aGlzLl9vcHQuZm9udFxuICB2YXIgY3VyUGVuID0gMFxuICB2YXIgY3VyV2lkdGggPSAwXG4gIHZhciBjb3VudCA9IDBcbiAgdmFyIGdseXBoXG4gIHZhciBsYXN0R2x5cGhcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgZW5kOiBzdGFydCxcbiAgICAgIHdpZHRoOiAwXG4gICAgfVxuICB9XG5cbiAgZW5kID0gTWF0aC5taW4odGV4dC5sZW5ndGgsIGVuZClcbiAgZm9yICh2YXIgaT1zdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgdmFyIGdseXBoID0gdGhpcy5nZXRHbHlwaChmb250LCBpZClcblxuICAgIGlmIChnbHlwaCkge1xuICAgICAgLy9tb3ZlIHBlbiBmb3J3YXJkXG4gICAgICB2YXIgeG9mZiA9IGdseXBoLnhvZmZzZXRcbiAgICAgIHZhciBrZXJuID0gbGFzdEdseXBoID8gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKSA6IDBcbiAgICAgIGN1clBlbiArPSBrZXJuXG5cbiAgICAgIHZhciBuZXh0UGVuID0gY3VyUGVuICsgZ2x5cGgueGFkdmFuY2UgKyBsZXR0ZXJTcGFjaW5nXG4gICAgICB2YXIgbmV4dFdpZHRoID0gY3VyUGVuICsgZ2x5cGgud2lkdGhcblxuICAgICAgLy93ZSd2ZSBoaXQgb3VyIGxpbWl0OyB3ZSBjYW4ndCBtb3ZlIG9udG8gdGhlIG5leHQgZ2x5cGhcbiAgICAgIGlmIChuZXh0V2lkdGggPj0gd2lkdGggfHwgbmV4dFBlbiA+PSB3aWR0aClcbiAgICAgICAgYnJlYWtcblxuICAgICAgLy9vdGhlcndpc2UgY29udGludWUgYWxvbmcgb3VyIGxpbmVcbiAgICAgIGN1clBlbiA9IG5leHRQZW5cbiAgICAgIGN1cldpZHRoID0gbmV4dFdpZHRoXG4gICAgICBsYXN0R2x5cGggPSBnbHlwaFxuICAgIH1cbiAgICBjb3VudCsrXG4gIH1cbiAgXG4gIC8vbWFrZSBzdXJlIHJpZ2h0bW9zdCBlZGdlIGxpbmVzIHVwIHdpdGggcmVuZGVyZWQgZ2x5cGhzXG4gIGlmIChsYXN0R2x5cGgpXG4gICAgY3VyV2lkdGggKz0gbGFzdEdseXBoLnhvZmZzZXRcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBlbmQ6IHN0YXJ0ICsgY291bnQsXG4gICAgd2lkdGg6IGN1cldpZHRoXG4gIH1cbn1cblxuLy9nZXR0ZXJzIGZvciB0aGUgcHJpdmF0ZSB2YXJzXG47Wyd3aWR0aCcsICdoZWlnaHQnLCBcbiAgJ2Rlc2NlbmRlcicsICdhc2NlbmRlcicsXG4gICd4SGVpZ2h0JywgJ2Jhc2VsaW5lJyxcbiAgJ2NhcEhlaWdodCcsXG4gICdsaW5lSGVpZ2h0JyBdLmZvckVhY2goYWRkR2V0dGVyKVxuXG5mdW5jdGlvbiBhZGRHZXR0ZXIobmFtZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dExheW91dC5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICBnZXQ6IHdyYXBwZXIobmFtZSksXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG59XG5cbi8vY3JlYXRlIGxvb2t1cHMgZm9yIHByaXZhdGUgdmFyc1xuZnVuY3Rpb24gd3JhcHBlcihuYW1lKSB7XG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKFtcbiAgICAncmV0dXJuIGZ1bmN0aW9uICcrbmFtZSsnKCkgeycsXG4gICAgJyAgcmV0dXJuIHRoaXMuXycrbmFtZSxcbiAgICAnfSdcbiAgXS5qb2luKCdcXG4nKSkpKClcbn1cblxuZnVuY3Rpb24gZ2V0R2x5cGhCeUlkKGZvbnQsIGlkKSB7XG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gbnVsbFxuXG4gIHZhciBnbHlwaElkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICBpZiAoZ2x5cGhJZHggPj0gMClcbiAgICByZXR1cm4gZm9udC5jaGFyc1tnbHlwaElkeF1cbiAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gZ2V0WEhlaWdodChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxYX0hFSUdIVFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBYX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRNR2x5cGgoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8TV9XSURUSFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBNX1dJRFRIU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdXG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0Q2FwSGVpZ2h0KGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPENBUF9IRUlHSFRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gQ0FQX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRLZXJuaW5nKGZvbnQsIGxlZnQsIHJpZ2h0KSB7XG4gIGlmICghZm9udC5rZXJuaW5ncyB8fCBmb250Lmtlcm5pbmdzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gMFxuXG4gIHZhciB0YWJsZSA9IGZvbnQua2VybmluZ3NcbiAgZm9yICh2YXIgaT0wOyBpPHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtlcm4gPSB0YWJsZVtpXVxuICAgIGlmIChrZXJuLmZpcnN0ID09PSBsZWZ0ICYmIGtlcm4uc2Vjb25kID09PSByaWdodClcbiAgICAgIHJldHVybiBrZXJuLmFtb3VudFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldEFsaWduVHlwZShhbGlnbikge1xuICBpZiAoYWxpZ24gPT09ICdjZW50ZXInKVxuICAgIHJldHVybiBBTElHTl9DRU5URVJcbiAgZWxzZSBpZiAoYWxpZ24gPT09ICdyaWdodCcpXG4gICAgcmV0dXJuIEFMSUdOX1JJR0hUXG4gIHJldHVybiBBTElHTl9MRUZUXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBudW10eXBlKG51bSwgZGVmKSB7XG5cdHJldHVybiB0eXBlb2YgbnVtID09PSAnbnVtYmVyJ1xuXHRcdD8gbnVtIFxuXHRcdDogKHR5cGVvZiBkZWYgPT09ICdudW1iZXInID8gZGVmIDogMClcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBpbGUocHJvcGVydHkpIHtcblx0aWYgKCFwcm9wZXJ0eSB8fCB0eXBlb2YgcHJvcGVydHkgIT09ICdzdHJpbmcnKVxuXHRcdHRocm93IG5ldyBFcnJvcignbXVzdCBzcGVjaWZ5IHByb3BlcnR5IGZvciBpbmRleG9mIHNlYXJjaCcpXG5cblx0cmV0dXJuIG5ldyBGdW5jdGlvbignYXJyYXknLCAndmFsdWUnLCAnc3RhcnQnLCBbXG5cdFx0J3N0YXJ0ID0gc3RhcnQgfHwgMCcsXG5cdFx0J2ZvciAodmFyIGk9c3RhcnQ7IGk8YXJyYXkubGVuZ3RoOyBpKyspJyxcblx0XHQnICBpZiAoYXJyYXlbaV1bXCInICsgcHJvcGVydHkgKydcIl0gPT09IHZhbHVlKScsXG5cdFx0JyAgICAgIHJldHVybiBpJyxcblx0XHQncmV0dXJuIC0xJ1xuXHRdLmpvaW4oJ1xcbicpKVxufSIsInZhciBuZXdsaW5lID0gL1xcbi9cbnZhciBuZXdsaW5lQ2hhciA9ICdcXG4nXG52YXIgd2hpdGVzcGFjZSA9IC9cXHMvXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XG4gICAgdmFyIGxpbmVzID0gbW9kdWxlLmV4cG9ydHMubGluZXModGV4dCwgb3B0KVxuICAgIHJldHVybiBsaW5lcy5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICByZXR1cm4gdGV4dC5zdWJzdHJpbmcobGluZS5zdGFydCwgbGluZS5lbmQpXG4gICAgfSkuam9pbignXFxuJylcbn1cblxubW9kdWxlLmV4cG9ydHMubGluZXMgPSBmdW5jdGlvbiB3b3Jkd3JhcCh0ZXh0LCBvcHQpIHtcbiAgICBvcHQgPSBvcHR8fHt9XG5cbiAgICAvL3plcm8gd2lkdGggcmVzdWx0cyBpbiBub3RoaW5nIHZpc2libGVcbiAgICBpZiAob3B0LndpZHRoID09PSAwICYmIG9wdC5tb2RlICE9PSAnbm93cmFwJykgXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgdGV4dCA9IHRleHR8fCcnXG4gICAgdmFyIHdpZHRoID0gdHlwZW9mIG9wdC53aWR0aCA9PT0gJ251bWJlcicgPyBvcHQud2lkdGggOiBOdW1iZXIuTUFYX1ZBTFVFXG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5tYXgoMCwgb3B0LnN0YXJ0fHwwKVxuICAgIHZhciBlbmQgPSB0eXBlb2Ygb3B0LmVuZCA9PT0gJ251bWJlcicgPyBvcHQuZW5kIDogdGV4dC5sZW5ndGhcbiAgICB2YXIgbW9kZSA9IG9wdC5tb2RlXG5cbiAgICB2YXIgbWVhc3VyZSA9IG9wdC5tZWFzdXJlIHx8IG1vbm9zcGFjZVxuICAgIGlmIChtb2RlID09PSAncHJlJylcbiAgICAgICAgcmV0dXJuIHByZShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aClcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBncmVlZHkobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgsIG1vZGUpXG59XG5cbmZ1bmN0aW9uIGlkeE9mKHRleHQsIGNociwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBpZHggPSB0ZXh0LmluZGV4T2YoY2hyLCBzdGFydClcbiAgICBpZiAoaWR4ID09PSAtMSB8fCBpZHggPiBlbmQpXG4gICAgICAgIHJldHVybiBlbmRcbiAgICByZXR1cm4gaWR4XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjaHIpIHtcbiAgICByZXR1cm4gd2hpdGVzcGFjZS50ZXN0KGNocilcbn1cblxuZnVuY3Rpb24gcHJlKG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGxpbmVzID0gW11cbiAgICB2YXIgbGluZVN0YXJ0ID0gc3RhcnRcbiAgICBmb3IgKHZhciBpPXN0YXJ0OyBpPGVuZCAmJiBpPHRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNociA9IHRleHQuY2hhckF0KGkpXG4gICAgICAgIHZhciBpc05ld2xpbmUgPSBuZXdsaW5lLnRlc3QoY2hyKVxuXG4gICAgICAgIC8vSWYgd2UndmUgcmVhY2hlZCBhIG5ld2xpbmUsIHRoZW4gc3RlcCBkb3duIGEgbGluZVxuICAgICAgICAvL09yIGlmIHdlJ3ZlIHJlYWNoZWQgdGhlIEVPRlxuICAgICAgICBpZiAoaXNOZXdsaW5lIHx8IGk9PT1lbmQtMSkge1xuICAgICAgICAgICAgdmFyIGxpbmVFbmQgPSBpc05ld2xpbmUgPyBpIDogaSsxXG4gICAgICAgICAgICB2YXIgbWVhc3VyZWQgPSBtZWFzdXJlKHRleHQsIGxpbmVTdGFydCwgbGluZUVuZCwgd2lkdGgpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKG1lYXN1cmVkKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsaW5lU3RhcnQgPSBpKzFcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGluZXNcbn1cblxuZnVuY3Rpb24gZ3JlZWR5KG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoLCBtb2RlKSB7XG4gICAgLy9BIGdyZWVkeSB3b3JkIHdyYXBwZXIgYmFzZWQgb24gTGliR0RYIGFsZ29yaXRobVxuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2xpYmdkeC9saWJnZHgvYmxvYi9tYXN0ZXIvZ2R4L3NyYy9jb20vYmFkbG9naWMvZ2R4L2dyYXBoaWNzL2cyZC9CaXRtYXBGb250Q2FjaGUuamF2YVxuICAgIHZhciBsaW5lcyA9IFtdXG5cbiAgICB2YXIgdGVzdFdpZHRoID0gd2lkdGhcbiAgICAvL2lmICdub3dyYXAnIGlzIHNwZWNpZmllZCwgd2Ugb25seSB3cmFwIG9uIG5ld2xpbmUgY2hhcnNcbiAgICBpZiAobW9kZSA9PT0gJ25vd3JhcCcpXG4gICAgICAgIHRlc3RXaWR0aCA9IE51bWJlci5NQVhfVkFMVUVcblxuICAgIHdoaWxlIChzdGFydCA8IGVuZCAmJiBzdGFydCA8IHRleHQubGVuZ3RoKSB7XG4gICAgICAgIC8vZ2V0IG5leHQgbmV3bGluZSBwb3NpdGlvblxuICAgICAgICB2YXIgbmV3TGluZSA9IGlkeE9mKHRleHQsIG5ld2xpbmVDaGFyLCBzdGFydCwgZW5kKVxuXG4gICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgc3RhcnQgb2YgbGluZVxuICAgICAgICB3aGlsZSAoc3RhcnQgPCBuZXdMaW5lKSB7XG4gICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZSggdGV4dC5jaGFyQXQoc3RhcnQpICkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIHN0YXJ0KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZGV0ZXJtaW5lIHZpc2libGUgIyBvZiBnbHlwaHMgZm9yIHRoZSBhdmFpbGFibGUgd2lkdGhcbiAgICAgICAgdmFyIG1lYXN1cmVkID0gbWVhc3VyZSh0ZXh0LCBzdGFydCwgbmV3TGluZSwgdGVzdFdpZHRoKVxuXG4gICAgICAgIHZhciBsaW5lRW5kID0gc3RhcnQgKyAobWVhc3VyZWQuZW5kLW1lYXN1cmVkLnN0YXJ0KVxuICAgICAgICB2YXIgbmV4dFN0YXJ0ID0gbGluZUVuZCArIG5ld2xpbmVDaGFyLmxlbmd0aFxuXG4gICAgICAgIC8vaWYgd2UgaGFkIHRvIGN1dCB0aGUgbGluZSBiZWZvcmUgdGhlIG5leHQgbmV3bGluZS4uLlxuICAgICAgICBpZiAobGluZUVuZCA8IG5ld0xpbmUpIHtcbiAgICAgICAgICAgIC8vZmluZCBjaGFyIHRvIGJyZWFrIG9uXG4gICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzV2hpdGVzcGFjZSh0ZXh0LmNoYXJBdChsaW5lRW5kKSkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgbGluZUVuZC0tXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGluZUVuZCA9PT0gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFN0YXJ0ID4gc3RhcnQgKyBuZXdsaW5lQ2hhci5sZW5ndGgpIG5leHRTdGFydC0tXG4gICAgICAgICAgICAgICAgbGluZUVuZCA9IG5leHRTdGFydCAvLyBJZiBubyBjaGFyYWN0ZXJzIHRvIGJyZWFrLCBzaG93IGFsbC5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dFN0YXJ0ID0gbGluZUVuZFxuICAgICAgICAgICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgZW5kIG9mIGxpbmVcbiAgICAgICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNXaGl0ZXNwYWNlKHRleHQuY2hhckF0KGxpbmVFbmQgLSBuZXdsaW5lQ2hhci5sZW5ndGgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGxpbmVFbmQtLVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobGluZUVuZCA+PSBzdGFydCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1lYXN1cmUodGV4dCwgc3RhcnQsIGxpbmVFbmQsIHRlc3RXaWR0aClcbiAgICAgICAgICAgIGxpbmVzLnB1c2gocmVzdWx0KVxuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ID0gbmV4dFN0YXJ0XG4gICAgfVxuICAgIHJldHVybiBsaW5lc1xufVxuXG4vL2RldGVybWluZXMgdGhlIHZpc2libGUgbnVtYmVyIG9mIGdseXBocyB3aXRoaW4gYSBnaXZlbiB3aWR0aFxuZnVuY3Rpb24gbW9ub3NwYWNlKHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGdseXBocyA9IE1hdGgubWluKHdpZHRoLCBlbmQtc3RhcnQpXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICBlbmQ6IHN0YXJ0K2dseXBoc1xuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIiwidmFyIGR0eXBlID0gcmVxdWlyZSgnZHR5cGUnKVxudmFyIGFuQXJyYXkgPSByZXF1aXJlKCdhbi1hcnJheScpXG52YXIgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKVxuXG52YXIgQ1cgPSBbMCwgMiwgM11cbnZhciBDQ1cgPSBbMiwgMSwgM11cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVRdWFkRWxlbWVudHMoYXJyYXksIG9wdCkge1xuICAgIC8vaWYgdXNlciBkaWRuJ3Qgc3BlY2lmeSBhbiBvdXRwdXQgYXJyYXlcbiAgICBpZiAoIWFycmF5IHx8ICEoYW5BcnJheShhcnJheSkgfHwgaXNCdWZmZXIoYXJyYXkpKSkge1xuICAgICAgICBvcHQgPSBhcnJheSB8fCB7fVxuICAgICAgICBhcnJheSA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdCA9PT0gJ251bWJlcicpIC8vYmFja3dhcmRzLWNvbXBhdGlibGVcbiAgICAgICAgb3B0ID0geyBjb3VudDogb3B0IH1cbiAgICBlbHNlXG4gICAgICAgIG9wdCA9IG9wdCB8fCB7fVxuXG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb3B0LnR5cGUgPT09ICdzdHJpbmcnID8gb3B0LnR5cGUgOiAndWludDE2J1xuICAgIHZhciBjb3VudCA9IHR5cGVvZiBvcHQuY291bnQgPT09ICdudW1iZXInID8gb3B0LmNvdW50IDogMVxuICAgIHZhciBzdGFydCA9IChvcHQuc3RhcnQgfHwgMCkgXG5cbiAgICB2YXIgZGlyID0gb3B0LmNsb2Nrd2lzZSAhPT0gZmFsc2UgPyBDVyA6IENDVyxcbiAgICAgICAgYSA9IGRpclswXSwgXG4gICAgICAgIGIgPSBkaXJbMV0sXG4gICAgICAgIGMgPSBkaXJbMl1cblxuICAgIHZhciBudW1JbmRpY2VzID0gY291bnQgKiA2XG5cbiAgICB2YXIgaW5kaWNlcyA9IGFycmF5IHx8IG5ldyAoZHR5cGUodHlwZSkpKG51bUluZGljZXMpXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAwOyBpIDwgbnVtSW5kaWNlczsgaSArPSA2LCBqICs9IDQpIHtcbiAgICAgICAgdmFyIHggPSBpICsgc3RhcnRcbiAgICAgICAgaW5kaWNlc1t4ICsgMF0gPSBqICsgMFxuICAgICAgICBpbmRpY2VzW3ggKyAxXSA9IGogKyAxXG4gICAgICAgIGluZGljZXNbeCArIDJdID0gaiArIDJcbiAgICAgICAgaW5kaWNlc1t4ICsgM10gPSBqICsgYVxuICAgICAgICBpbmRpY2VzW3ggKyA0XSA9IGogKyBiXG4gICAgICAgIGluZGljZXNbeCArIDVdID0gaiArIGNcbiAgICB9XG4gICAgcmV0dXJuIGluZGljZXNcbn0iLCJ2YXIgc3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuQXJyYXlcblxuZnVuY3Rpb24gYW5BcnJheShhcnIpIHtcbiAgcmV0dXJuIChcbiAgICAgICBhcnIuQllURVNfUEVSX0VMRU1FTlRcbiAgICAmJiBzdHIuY2FsbChhcnIuYnVmZmVyKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJ1xuICAgIHx8IEFycmF5LmlzQXJyYXkoYXJyKVxuICApXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGR0eXBlKSB7XG4gIHN3aXRjaCAoZHR5cGUpIHtcbiAgICBjYXNlICdpbnQ4JzpcbiAgICAgIHJldHVybiBJbnQ4QXJyYXlcbiAgICBjYXNlICdpbnQxNic6XG4gICAgICByZXR1cm4gSW50MTZBcnJheVxuICAgIGNhc2UgJ2ludDMyJzpcbiAgICAgIHJldHVybiBJbnQzMkFycmF5XG4gICAgY2FzZSAndWludDgnOlxuICAgICAgcmV0dXJuIFVpbnQ4QXJyYXlcbiAgICBjYXNlICd1aW50MTYnOlxuICAgICAgcmV0dXJuIFVpbnQxNkFycmF5XG4gICAgY2FzZSAndWludDMyJzpcbiAgICAgIHJldHVybiBVaW50MzJBcnJheVxuICAgIGNhc2UgJ2Zsb2F0MzInOlxuICAgICAgcmV0dXJuIEZsb2F0MzJBcnJheVxuICAgIGNhc2UgJ2Zsb2F0NjQnOlxuICAgICAgcmV0dXJuIEZsb2F0NjRBcnJheVxuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheVxuICAgIGNhc2UgJ3VpbnQ4X2NsYW1wZWQnOlxuICAgICAgcmV0dXJuIFVpbnQ4Q2xhbXBlZEFycmF5XG4gIH1cbn1cbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiIsInZhciBmbGF0dGVuID0gcmVxdWlyZSgnZmxhdHRlbi12ZXJ0ZXgtZGF0YScpXG52YXIgd2FybmVkID0gZmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzLmF0dHIgPSBzZXRBdHRyaWJ1dGVcbm1vZHVsZS5leHBvcnRzLmluZGV4ID0gc2V0SW5kZXhcblxuZnVuY3Rpb24gc2V0SW5kZXggKGdlb21ldHJ5LCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBpdGVtU2l6ZSAhPT0gJ251bWJlcicpIGl0ZW1TaXplID0gMVxuICBpZiAodHlwZW9mIGR0eXBlICE9PSAnc3RyaW5nJykgZHR5cGUgPSAndWludDE2J1xuXG4gIHZhciBpc1I2OSA9ICFnZW9tZXRyeS5pbmRleCAmJiB0eXBlb2YgZ2VvbWV0cnkuc2V0SW5kZXggIT09ICdmdW5jdGlvbidcbiAgdmFyIGF0dHJpYiA9IGlzUjY5ID8gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKCdpbmRleCcpIDogZ2VvbWV0cnkuaW5kZXhcbiAgdmFyIG5ld0F0dHJpYiA9IHVwZGF0ZUF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSlcbiAgaWYgKG5ld0F0dHJpYikge1xuICAgIGlmIChpc1I2OSkgZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCdpbmRleCcsIG5ld0F0dHJpYilcbiAgICBlbHNlIGdlb21ldHJ5LmluZGV4ID0gbmV3QXR0cmliXG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0QXR0cmlidXRlIChnZW9tZXRyeSwga2V5LCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBpdGVtU2l6ZSAhPT0gJ251bWJlcicpIGl0ZW1TaXplID0gM1xuICBpZiAodHlwZW9mIGR0eXBlICE9PSAnc3RyaW5nJykgZHR5cGUgPSAnZmxvYXQzMidcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiZcbiAgICBBcnJheS5pc0FycmF5KGRhdGFbMF0pICYmXG4gICAgZGF0YVswXS5sZW5ndGggIT09IGl0ZW1TaXplKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZXN0ZWQgdmVydGV4IGFycmF5IGhhcyB1bmV4cGVjdGVkIHNpemU7IGV4cGVjdGVkICcgK1xuICAgICAgaXRlbVNpemUgKyAnIGJ1dCBmb3VuZCAnICsgZGF0YVswXS5sZW5ndGgpXG4gIH1cblxuICB2YXIgYXR0cmliID0gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKGtleSlcbiAgdmFyIG5ld0F0dHJpYiA9IHVwZGF0ZUF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSlcbiAgaWYgKG5ld0F0dHJpYikge1xuICAgIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZShrZXksIG5ld0F0dHJpYilcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGUgKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGRhdGEgPSBkYXRhIHx8IFtdXG4gIGlmICghYXR0cmliIHx8IHJlYnVpbGRBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSkpIHtcbiAgICAvLyBjcmVhdGUgYSBuZXcgYXJyYXkgd2l0aCBkZXNpcmVkIHR5cGVcbiAgICBkYXRhID0gZmxhdHRlbihkYXRhLCBkdHlwZSlcbiAgICBpZiAoYXR0cmliICYmICF3YXJuZWQpIHtcbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLndhcm4oW1xuICAgICAgICAnQSBXZWJHTCBidWZmZXIgaXMgYmVpbmcgdXBkYXRlZCB3aXRoIGEgbmV3IHNpemUgb3IgaXRlbVNpemUsICcsXG4gICAgICAgICdob3dldmVyIFRocmVlSlMgb25seSBzdXBwb3J0cyBmaXhlZC1zaXplIGJ1ZmZlcnMuXFxuVGhlIG9sZCBidWZmZXIgbWF5ICcsXG4gICAgICAgICdzdGlsbCBiZSBrZXB0IGluIG1lbW9yeS5cXG4nLFxuICAgICAgICAnVG8gYXZvaWQgbWVtb3J5IGxlYWtzLCBpdCBpcyByZWNvbW1lbmRlZCB0aGF0IHlvdSBkaXNwb3NlICcsXG4gICAgICAgICd5b3VyIGdlb21ldHJpZXMgYW5kIGNyZWF0ZSBuZXcgb25lcywgb3Igc3VwcG9ydCB0aGUgZm9sbG93aW5nIFBSIGluIFRocmVlSlM6XFxuJyxcbiAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvcHVsbC85NjMxJ1xuICAgICAgXS5qb2luKCcnKSk7XG4gICAgfVxuICAgIGF0dHJpYiA9IG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoZGF0YSwgaXRlbVNpemUpXG4gICAgYXR0cmliLm5lZWRzVXBkYXRlID0gdHJ1ZVxuICAgIHJldHVybiBhdHRyaWJcbiAgfSBlbHNlIHtcbiAgICAvLyBjb3B5IGRhdGEgaW50byB0aGUgZXhpc3RpbmcgYXJyYXlcbiAgICBmbGF0dGVuKGRhdGEsIGF0dHJpYi5hcnJheSlcbiAgICBhdHRyaWIubmVlZHNVcGRhdGUgPSB0cnVlXG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG4vLyBUZXN0IHdoZXRoZXIgdGhlIGF0dHJpYnV0ZSBuZWVkcyB0byBiZSByZS1jcmVhdGVkLFxuLy8gcmV0dXJucyBmYWxzZSBpZiB3ZSBjYW4gcmUtdXNlIGl0IGFzLWlzLlxuZnVuY3Rpb24gcmVidWlsZEF0dHJpYnV0ZSAoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSkge1xuICBpZiAoYXR0cmliLml0ZW1TaXplICE9PSBpdGVtU2l6ZSkgcmV0dXJuIHRydWVcbiAgaWYgKCFhdHRyaWIuYXJyYXkpIHJldHVybiB0cnVlXG4gIHZhciBhdHRyaWJMZW5ndGggPSBhdHRyaWIuYXJyYXkubGVuZ3RoXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIEFycmF5LmlzQXJyYXkoZGF0YVswXSkpIHtcbiAgICAvLyBbIFsgeCwgeSwgeiBdIF1cbiAgICByZXR1cm4gYXR0cmliTGVuZ3RoICE9PSBkYXRhLmxlbmd0aCAqIGl0ZW1TaXplXG4gIH0gZWxzZSB7XG4gICAgLy8gWyB4LCB5LCB6IF1cbiAgICByZXR1cm4gYXR0cmliTGVuZ3RoICE9PSBkYXRhLmxlbmd0aFxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuIiwiLyplc2xpbnQgbmV3LWNhcDowKi9cbnZhciBkdHlwZSA9IHJlcXVpcmUoJ2R0eXBlJylcbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlblZlcnRleERhdGFcbmZ1bmN0aW9uIGZsYXR0ZW5WZXJ0ZXhEYXRhIChkYXRhLCBvdXRwdXQsIG9mZnNldCkge1xuICBpZiAoIWRhdGEpIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSBkYXRhIGFzIGZpcnN0IHBhcmFtZXRlcicpXG4gIG9mZnNldCA9ICsob2Zmc2V0IHx8IDApIHwgMFxuXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIEFycmF5LmlzQXJyYXkoZGF0YVswXSkpIHtcbiAgICB2YXIgZGltID0gZGF0YVswXS5sZW5ndGhcbiAgICB2YXIgbGVuZ3RoID0gZGF0YS5sZW5ndGggKiBkaW1cblxuICAgIC8vIG5vIG91dHB1dCBzcGVjaWZpZWQsIGNyZWF0ZSBhIG5ldyB0eXBlZCBhcnJheVxuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvdXRwdXQgPSBuZXcgKGR0eXBlKG91dHB1dCB8fCAnZmxvYXQzMicpKShsZW5ndGggKyBvZmZzZXQpXG4gICAgfVxuXG4gICAgdmFyIGRzdExlbmd0aCA9IG91dHB1dC5sZW5ndGggLSBvZmZzZXRcbiAgICBpZiAobGVuZ3RoICE9PSBkc3RMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc291cmNlIGxlbmd0aCAnICsgbGVuZ3RoICsgJyAoJyArIGRpbSArICd4JyArIGRhdGEubGVuZ3RoICsgJyknICtcbiAgICAgICAgJyBkb2VzIG5vdCBtYXRjaCBkZXN0aW5hdGlvbiBsZW5ndGggJyArIGRzdExlbmd0aClcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgayA9IG9mZnNldDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZGltOyBqKyspIHtcbiAgICAgICAgb3V0cHV0W2srK10gPSBkYXRhW2ldW2pdXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBubyBvdXRwdXQsIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgIHZhciBDdG9yID0gZHR5cGUob3V0cHV0IHx8ICdmbG9hdDMyJylcbiAgICAgIGlmIChvZmZzZXQgPT09IDApIHtcbiAgICAgICAgb3V0cHV0ID0gbmV3IEN0b3IoZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IG5ldyBDdG9yKGRhdGEubGVuZ3RoICsgb2Zmc2V0KVxuICAgICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3RvcmUgb3V0cHV0IGluIGV4aXN0aW5nIGFycmF5XG4gICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG4iLCJ2YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU0RGU2hhZGVyIChvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9XG4gIHZhciBvcGFjaXR5ID0gdHlwZW9mIG9wdC5vcGFjaXR5ID09PSAnbnVtYmVyJyA/IG9wdC5vcGFjaXR5IDogMVxuICB2YXIgYWxwaGFUZXN0ID0gdHlwZW9mIG9wdC5hbHBoYVRlc3QgPT09ICdudW1iZXInID8gb3B0LmFscGhhVGVzdCA6IDAuMDAwMVxuICB2YXIgcHJlY2lzaW9uID0gb3B0LnByZWNpc2lvbiB8fCAnaGlnaHAnXG4gIHZhciBjb2xvciA9IG9wdC5jb2xvclxuICB2YXIgbWFwID0gb3B0Lm1hcFxuXG4gIC8vIHJlbW92ZSB0byBzYXRpc2Z5IHI3M1xuICBkZWxldGUgb3B0Lm1hcFxuICBkZWxldGUgb3B0LmNvbG9yXG4gIGRlbGV0ZSBvcHQucHJlY2lzaW9uXG4gIGRlbGV0ZSBvcHQub3BhY2l0eVxuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIHVuaWZvcm1zOiB7XG4gICAgICBvcGFjaXR5OiB7IHR5cGU6ICdmJywgdmFsdWU6IG9wYWNpdHkgfSxcbiAgICAgIG1hcDogeyB0eXBlOiAndCcsIHZhbHVlOiBtYXAgfHwgbmV3IFRIUkVFLlRleHR1cmUoKSB9LFxuICAgICAgY29sb3I6IHsgdHlwZTogJ2MnLCB2YWx1ZTogbmV3IFRIUkVFLkNvbG9yKGNvbG9yKSB9XG4gICAgfSxcbiAgICB2ZXJ0ZXhTaGFkZXI6IFtcbiAgICAgICdhdHRyaWJ1dGUgdmVjMiB1djsnLFxuICAgICAgJ2F0dHJpYnV0ZSB2ZWM0IHBvc2l0aW9uOycsXG4gICAgICAndW5pZm9ybSBtYXQ0IHByb2plY3Rpb25NYXRyaXg7JyxcbiAgICAgICd1bmlmb3JtIG1hdDQgbW9kZWxWaWV3TWF0cml4OycsXG4gICAgICAndmFyeWluZyB2ZWMyIHZVdjsnLFxuICAgICAgJ3ZvaWQgbWFpbigpIHsnLFxuICAgICAgJ3ZVdiA9IHV2OycsXG4gICAgICAnZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogcG9zaXRpb247JyxcbiAgICAgICd9J1xuICAgIF0uam9pbignXFxuJyksXG4gICAgZnJhZ21lbnRTaGFkZXI6IFtcbiAgICAgICcjaWZkZWYgR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcbiAgICAgICcjZXh0ZW5zaW9uIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcyA6IGVuYWJsZScsXG4gICAgICAnI2VuZGlmJyxcbiAgICAgICdwcmVjaXNpb24gJyArIHByZWNpc2lvbiArICcgZmxvYXQ7JyxcbiAgICAgICd1bmlmb3JtIGZsb2F0IG9wYWNpdHk7JyxcbiAgICAgICd1bmlmb3JtIHZlYzMgY29sb3I7JyxcbiAgICAgICd1bmlmb3JtIHNhbXBsZXIyRCBtYXA7JyxcbiAgICAgICd2YXJ5aW5nIHZlYzIgdlV2OycsXG5cbiAgICAgICdmbG9hdCBhYXN0ZXAoZmxvYXQgdmFsdWUpIHsnLFxuICAgICAgJyAgI2lmZGVmIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcycsXG4gICAgICAnICAgIGZsb2F0IGFmd2lkdGggPSBsZW5ndGgodmVjMihkRmR4KHZhbHVlKSwgZEZkeSh2YWx1ZSkpKSAqIDAuNzA3MTA2NzgxMTg2NTQ3NTc7JyxcbiAgICAgICcgICNlbHNlJyxcbiAgICAgICcgICAgZmxvYXQgYWZ3aWR0aCA9ICgxLjAgLyAzMi4wKSAqICgxLjQxNDIxMzU2MjM3MzA5NTEgLyAoMi4wICogZ2xfRnJhZ0Nvb3JkLncpKTsnLFxuICAgICAgJyAgI2VuZGlmJyxcbiAgICAgICcgIHJldHVybiBzbW9vdGhzdGVwKDAuNSAtIGFmd2lkdGgsIDAuNSArIGFmd2lkdGgsIHZhbHVlKTsnLFxuICAgICAgJ30nLFxuXG4gICAgICAndm9pZCBtYWluKCkgeycsXG4gICAgICAnICB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKG1hcCwgdlV2KTsnLFxuICAgICAgJyAgZmxvYXQgYWxwaGEgPSBhYXN0ZXAodGV4Q29sb3IuYSk7JyxcbiAgICAgICcgIGdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IsIG9wYWNpdHkgKiBhbHBoYSk7JyxcbiAgICAgIGFscGhhVGVzdCA9PT0gMFxuICAgICAgICA/ICcnXG4gICAgICAgIDogJyAgaWYgKGdsX0ZyYWdDb2xvci5hIDwgJyArIGFscGhhVGVzdCArICcpIGRpc2NhcmQ7JyxcbiAgICAgICd9J1xuICAgIF0uam9pbignXFxuJylcbiAgfSwgb3B0KVxufVxuIl19
