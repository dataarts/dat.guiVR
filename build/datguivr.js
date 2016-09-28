(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _SubdivisionModifier = require('../thirdparty/SubdivisionModifier');

var SubdivisionModifier = _interopRequireWildcard(_SubdivisionModifier);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
  var BUTTON_DEPTH = Layout.BUTTON_DEPTH;

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var divisions = 4;
  var aspectRatio = BUTTON_WIDTH / BUTTON_HEIGHT;
  var rect = new THREE.BoxGeometry(BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_DEPTH, Math.floor(divisions * aspectRatio), divisions, divisions);
  var modifier = new THREE.SubdivisionModifier(1);
  modifier.modify(rect);
  rect.translate(BUTTON_WIDTH * 0.5, 0, 0);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  hitscanVolume.position.x = width * 0.5;

  var material = new THREE.MeshPhongMaterial({ color: Colors.BUTTON_COLOR, emissive: Colors.EMISSIVE_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  hitscanVolume.add(filledVolume);

  var buttonLabel = textCreator.create(propertyName, { scale: 0.866 });
  buttonLabel.position.x = BUTTON_WIDTH * 0.5 - buttonLabel.layout.width * 0.00011 * 0.5;
  buttonLabel.position.z = BUTTON_DEPTH * 1.2;
  buttonLabel.position.y = -0.025;
  filledVolume.add(buttonLabel);

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_BUTTON);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, hitscanVolume, controllerID);

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('onReleased', handleOnRelease);

  updateView();

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    object[propertyName]();

    hitscanVolume.position.z = BUTTON_DEPTH * 0.1;

    p.locked = true;
  }

  function handleOnRelease() {
    hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  }

  function updateView() {

    if (interaction.hovering()) {
      material.color.setHex(Colors.HIGHLIGHT_COLOR);
      material.emissive.setHex(Colors.HIGHLIGHT_EMISSIVE_COLOR);
    } else {
      material.color.setHex(Colors.BUTTON_COLOR);
      material.emissive.setHex(Colors.EMISSIVE_COLOR);
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

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
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

},{"../thirdparty/SubdivisionModifier":16,"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":13,"./textlabel":15}],2:[function(require,module,exports){
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

  group.name = function (str) {
    descriptorLabel.update(str);
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
var DEFAULT_BACK = exports.DEFAULT_BACK = 0x1a1a1a;
var HIGHLIGHT_BACK = exports.HIGHLIGHT_BACK = 0x494949;
var INACTIVE_COLOR = exports.INACTIVE_COLOR = 0x161829;
var CONTROLLER_ID_SLIDER = exports.CONTROLLER_ID_SLIDER = 0x2fa1d6;
var CONTROLLER_ID_CHECKBOX = exports.CONTROLLER_ID_CHECKBOX = 0x806787;
var CONTROLLER_ID_BUTTON = exports.CONTROLLER_ID_BUTTON = 0xe61d5f;
var CONTROLLER_ID_TEXT = exports.CONTROLLER_ID_TEXT = 0x1ed36f;
var CONTROLLER_ID_DROPDOWN = exports.CONTROLLER_ID_DROPDOWN = 0xfff000;
var DROPDOWN_BG_COLOR = exports.DROPDOWN_BG_COLOR = 0xffffff;
var DROPDOWN_FG_COLOR = exports.DROPDOWN_FG_COLOR = 0x000000;
var BUTTON_COLOR = exports.BUTTON_COLOR = 0xe61d5f;
var SLIDER_BG = exports.SLIDER_BG = 0x444444;

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
  var DROPDOWN_OPTION_HEIGHT = height - Layout.PANEL_MARGIN * 1.2;
  var DROPDOWN_MARGIN = Layout.PANEL_MARGIN * -0.4;

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
    var label = (0, _textlabel2.default)(textCreator, labelText, DROPDOWN_WIDTH, depth, Colors.DROPDOWN_FG_COLOR, Colors.DROPDOWN_BG_COLOR, 0.866);
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
  selectedLabel.position.x = Layout.PANEL_MARGIN * 0.5 + width * 0.5;
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
    label.position.z = depth * 24;
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

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_DROPDOWN);
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

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
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

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
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
  return "info face=\"Roboto\" size=32 bold=0 italic=0 charset=\"\" unicode=0 stretchH=100 smooth=1 aa=1 padding=4,4,4,4 spacing=-8,-8\ncommon lineHeight=38 base=30 scaleW=512 scaleH=512 pages=1 packed=0\npage id=0 file=\"roboto.png\"\nchars count=194\nchar id=0       x=0    y=0    width=0    height=0    xoffset=-4   yoffset=0    xadvance=0    page=0    chnl=0\nchar id=10      x=0    y=0    width=0    height=0    xoffset=-4   yoffset=0    xadvance=0    page=0    chnl=0\nchar id=32      x=0    y=0    width=0    height=0    xoffset=-4   yoffset=0    xadvance=8    page=0    chnl=0\nchar id=33      x=332  y=146  width=12   height=32   xoffset=-4   yoffset=2    xadvance=8    page=0    chnl=0\nchar id=34      x=22   y=267  width=15   height=17   xoffset=-4   yoffset=1    xadvance=10   page=0    chnl=0\nchar id=35      x=365  y=146  width=27   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=36      x=487  y=0    width=24   height=38   xoffset=-4   yoffset=-1   xadvance=18   page=0    chnl=0\nchar id=37      x=0    y=210  width=30   height=31   xoffset=-4   yoffset=3    xadvance=23   page=0    chnl=0\nchar id=38      x=392  y=146  width=27   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=39      x=50   y=267  width=11   height=16   xoffset=-4   yoffset=1    xadvance=6    page=0    chnl=0\nchar id=40      x=0    y=0    width=17   height=41   xoffset=-4   yoffset=0    xadvance=11   page=0    chnl=0\nchar id=41      x=17   y=0    width=17   height=41   xoffset=-4   yoffset=0    xadvance=11   page=0    chnl=0\nchar id=42      x=240  y=241  width=22   height=23   xoffset=-4   yoffset=2    xadvance=14   page=0    chnl=0\nchar id=43      x=183  y=241  width=24   height=25   xoffset=-4   yoffset=7    xadvance=18   page=0    chnl=0\nchar id=44      x=37   y=267  width=13   height=17   xoffset=-4   yoffset=22   xadvance=6    page=0    chnl=0\nchar id=45      x=194  y=267  width=17   height=11   xoffset=-4   yoffset=14   xadvance=9    page=0    chnl=0\nchar id=46      x=182  y=267  width=12   height=11   xoffset=-4   yoffset=23   xadvance=8    page=0    chnl=0\nchar id=47      x=471  y=41   width=21   height=34   xoffset=-4   yoffset=2    xadvance=13   page=0    chnl=0\nchar id=48      x=481  y=178  width=24   height=31   xoffset=-4   yoffset=3    xadvance=18   page=0    chnl=0\nchar id=49      x=171  y=146  width=18   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=50      x=189  y=146  width=24   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=51      x=434  y=178  width=23   height=31   xoffset=-4   yoffset=3    xadvance=18   page=0    chnl=0\nchar id=52      x=213  y=146  width=26   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=53      x=239  y=146  width=23   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=54      x=262  y=146  width=23   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=55      x=285  y=146  width=24   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=56      x=457  y=178  width=24   height=31   xoffset=-4   yoffset=3    xadvance=18   page=0    chnl=0\nchar id=57      x=309  y=146  width=23   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=58      x=171  y=241  width=12   height=25   xoffset=-4   yoffset=9    xadvance=8    page=0    chnl=0\nchar id=59      x=161  y=210  width=14   height=30   xoffset=-4   yoffset=9    xadvance=7    page=0    chnl=0\nchar id=60      x=310  y=241  width=21   height=22   xoffset=-4   yoffset=9    xadvance=16   page=0    chnl=0\nchar id=61      x=0    y=267  width=22   height=18   xoffset=-4   yoffset=9    xadvance=18   page=0    chnl=0\nchar id=62      x=331  y=241  width=22   height=22   xoffset=-4   yoffset=9    xadvance=17   page=0    chnl=0\nchar id=63      x=344  y=146  width=21   height=32   xoffset=-4   yoffset=2    xadvance=15   page=0    chnl=0\nchar id=64      x=0    y=41   width=35   height=38   xoffset=-4   yoffset=3    xadvance=29   page=0    chnl=0\nchar id=65      x=68   y=113  width=29   height=32   xoffset=-4   yoffset=2    xadvance=21   page=0    chnl=0\nchar id=66      x=97   y=113  width=25   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=67      x=395  y=178  width=27   height=31   xoffset=-4   yoffset=3    xadvance=21   page=0    chnl=0\nchar id=68      x=122  y=113  width=26   height=32   xoffset=-4   yoffset=2    xadvance=21   page=0    chnl=0\nchar id=69      x=148  y=113  width=24   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=70      x=172  y=113  width=23   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=71      x=195  y=113  width=27   height=32   xoffset=-4   yoffset=2    xadvance=22   page=0    chnl=0\nchar id=72      x=222  y=113  width=27   height=32   xoffset=-4   yoffset=2    xadvance=23   page=0    chnl=0\nchar id=73      x=492  y=79   width=12   height=32   xoffset=-4   yoffset=2    xadvance=9    page=0    chnl=0\nchar id=74      x=249  y=113  width=24   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=75      x=273  y=113  width=26   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=76      x=299  y=113  width=23   height=32   xoffset=-4   yoffset=2    xadvance=17   page=0    chnl=0\nchar id=77      x=322  y=113  width=32   height=32   xoffset=-4   yoffset=2    xadvance=28   page=0    chnl=0\nchar id=78      x=354  y=113  width=27   height=32   xoffset=-4   yoffset=2    xadvance=23   page=0    chnl=0\nchar id=79      x=381  y=113  width=28   height=32   xoffset=-4   yoffset=2    xadvance=22   page=0    chnl=0\nchar id=80      x=409  y=113  width=25   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=81      x=294  y=41   width=28   height=36   xoffset=-4   yoffset=2    xadvance=22   page=0    chnl=0\nchar id=82      x=434  y=113  width=26   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=83      x=460  y=113  width=25   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=84      x=0    y=146  width=27   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=85      x=485  y=113  width=25   height=32   xoffset=-4   yoffset=2    xadvance=21   page=0    chnl=0\nchar id=86      x=27   y=146  width=28   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=87      x=55   y=146  width=36   height=32   xoffset=-4   yoffset=2    xadvance=28   page=0    chnl=0\nchar id=88      x=91   y=146  width=28   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=89      x=119  y=146  width=27   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=90      x=146  y=146  width=25   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=91      x=34   y=0    width=15   height=40   xoffset=-4   yoffset=-1   xadvance=8    page=0    chnl=0\nchar id=92      x=0    y=79   width=21   height=34   xoffset=-4   yoffset=2    xadvance=13   page=0    chnl=0\nchar id=93      x=49   y=0    width=15   height=40   xoffset=-4   yoffset=-1   xadvance=8    page=0    chnl=0\nchar id=94      x=484  y=241  width=21   height=20   xoffset=-4   yoffset=2    xadvance=13   page=0    chnl=0\nchar id=95      x=211  y=267  width=23   height=11   xoffset=-4   yoffset=25   xadvance=14   page=0    chnl=0\nchar id=96      x=139  y=267  width=15   height=14   xoffset=-4   yoffset=1    xadvance=10   page=0    chnl=0\nchar id=97      x=363  y=210  width=23   height=26   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=98      x=49   y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=99      x=386  y=210  width=23   height=26   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=100     x=72   y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=101     x=409  y=210  width=23   height=26   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=102     x=95   y=79   width=20   height=33   xoffset=-4   yoffset=1    xadvance=11   page=0    chnl=0\nchar id=103     x=115  y=79   width=23   height=33   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=104     x=138  y=79   width=22   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=105     x=422  y=178  width=12   height=31   xoffset=-4   yoffset=3    xadvance=8    page=0    chnl=0\nchar id=106     x=136  y=0    width=16   height=39   xoffset=-4   yoffset=2    xadvance=8    page=0    chnl=0\nchar id=107     x=160  y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=16   page=0    chnl=0\nchar id=108     x=492  y=41   width=12   height=33   xoffset=-4   yoffset=1    xadvance=8    page=0    chnl=0\nchar id=109     x=432  y=210  width=32   height=26   xoffset=-4   yoffset=8    xadvance=28   page=0    chnl=0\nchar id=110     x=464  y=210  width=22   height=26   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=111     x=147  y=241  width=24   height=25   xoffset=-4   yoffset=9    xadvance=18   page=0    chnl=0\nchar id=112     x=183  y=79   width=23   height=33   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=113     x=206  y=79   width=23   height=33   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=114     x=486  y=210  width=17   height=26   xoffset=-4   yoffset=8    xadvance=11   page=0    chnl=0\nchar id=115     x=0    y=241  width=23   height=26   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=116     x=142  y=210  width=19   height=30   xoffset=-4   yoffset=4    xadvance=10   page=0    chnl=0\nchar id=117     x=23   y=241  width=22   height=26   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=118     x=45   y=241  width=24   height=26   xoffset=-4   yoffset=8    xadvance=16   page=0    chnl=0\nchar id=119     x=69   y=241  width=32   height=26   xoffset=-4   yoffset=8    xadvance=24   page=0    chnl=0\nchar id=120     x=101  y=241  width=24   height=26   xoffset=-4   yoffset=8    xadvance=16   page=0    chnl=0\nchar id=121     x=229  y=79   width=23   height=33   xoffset=-4   yoffset=8    xadvance=15   page=0    chnl=0\nchar id=122     x=125  y=241  width=22   height=26   xoffset=-4   yoffset=8    xadvance=16   page=0    chnl=0\nchar id=123     x=152  y=0    width=18   height=39   xoffset=-4   yoffset=1    xadvance=11   page=0    chnl=0\nchar id=124     x=322  y=41   width=12   height=36   xoffset=-4   yoffset=2    xadvance=8    page=0    chnl=0\nchar id=125     x=170  y=0    width=18   height=39   xoffset=-4   yoffset=1    xadvance=11   page=0    chnl=0\nchar id=126     x=113  y=267  width=26   height=15   xoffset=-4   yoffset=12   xadvance=22   page=0    chnl=0\nchar id=127     x=419  y=146  width=20   height=32   xoffset=-4   yoffset=2    xadvance=14   page=0    chnl=0\nchar id=160     x=0    y=0    width=0    height=0    xoffset=-4   yoffset=0    xadvance=8    page=0    chnl=0\nchar id=161     x=30   y=210  width=12   height=31   xoffset=-4   yoffset=9    xadvance=8    page=0    chnl=0\nchar id=162     x=252  y=79   width=24   height=33   xoffset=-4   yoffset=5    xadvance=18   page=0    chnl=0\nchar id=163     x=439  y=146  width=25   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=164     x=175  y=210  width=29   height=30   xoffset=-4   yoffset=5    xadvance=23   page=0    chnl=0\nchar id=165     x=464  y=146  width=27   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=166     x=334  y=41   width=12   height=36   xoffset=-4   yoffset=2    xadvance=8    page=0    chnl=0\nchar id=167     x=64   y=0    width=26   height=40   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=168     x=234  y=267  width=19   height=11   xoffset=-4   yoffset=3    xadvance=13   page=0    chnl=0\nchar id=169     x=0    y=178  width=31   height=32   xoffset=-4   yoffset=2    xadvance=25   page=0    chnl=0\nchar id=170     x=446  y=241  width=19   height=21   xoffset=-4   yoffset=2    xadvance=14   page=0    chnl=0\nchar id=171     x=353  y=241  width=21   height=22   xoffset=-4   yoffset=10   xadvance=15   page=0    chnl=0\nchar id=172     x=61   y=267  width=22   height=16   xoffset=-4   yoffset=12   xadvance=18   page=0    chnl=0\nchar id=173     x=253  y=267  width=17   height=11   xoffset=-4   yoffset=14   xadvance=9    page=0    chnl=0\nchar id=174     x=31   y=178  width=31   height=32   xoffset=-4   yoffset=2    xadvance=25   page=0    chnl=0\nchar id=175     x=270  y=267  width=21   height=11   xoffset=-4   yoffset=2    xadvance=15   page=0    chnl=0\nchar id=176     x=83   y=267  width=16   height=16   xoffset=-4   yoffset=3    xadvance=12   page=0    chnl=0\nchar id=177     x=340  y=210  width=23   height=28   xoffset=-4   yoffset=6    xadvance=17   page=0    chnl=0\nchar id=178     x=374  y=241  width=18   height=22   xoffset=-4   yoffset=2    xadvance=12   page=0    chnl=0\nchar id=179     x=392  y=241  width=18   height=22   xoffset=-4   yoffset=2    xadvance=12   page=0    chnl=0\nchar id=180     x=154  y=267  width=16   height=14   xoffset=-4   yoffset=1    xadvance=10   page=0    chnl=0\nchar id=181     x=276  y=79   width=22   height=33   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=182     x=62   y=178  width=21   height=32   xoffset=-4   yoffset=2    xadvance=16   page=0    chnl=0\nchar id=183     x=170  y=267  width=12   height=12   xoffset=-4   yoffset=12   xadvance=8    page=0    chnl=0\nchar id=184     x=99   y=267  width=14   height=16   xoffset=-4   yoffset=25   xadvance=8    page=0    chnl=0\nchar id=185     x=410  y=241  width=14   height=22   xoffset=-4   yoffset=2    xadvance=12   page=0    chnl=0\nchar id=186     x=465  y=241  width=19   height=21   xoffset=-4   yoffset=2    xadvance=15   page=0    chnl=0\nchar id=187     x=424  y=241  width=22   height=22   xoffset=-4   yoffset=10   xadvance=15   page=0    chnl=0\nchar id=188     x=83   y=178  width=30   height=32   xoffset=-4   yoffset=2    xadvance=23   page=0    chnl=0\nchar id=189     x=113  y=178  width=31   height=32   xoffset=-4   yoffset=2    xadvance=25   page=0    chnl=0\nchar id=190     x=42   y=210  width=31   height=31   xoffset=-4   yoffset=3    xadvance=25   page=0    chnl=0\nchar id=191     x=144  y=178  width=21   height=32   xoffset=-4   yoffset=8    xadvance=15   page=0    chnl=0\nchar id=192     x=188  y=0    width=29   height=39   xoffset=-4   yoffset=-5   xadvance=21   page=0    chnl=0\nchar id=193     x=217  y=0    width=29   height=39   xoffset=-4   yoffset=-5   xadvance=21   page=0    chnl=0\nchar id=194     x=35   y=41   width=29   height=38   xoffset=-4   yoffset=-4   xadvance=21   page=0    chnl=0\nchar id=195     x=187  y=41   width=29   height=37   xoffset=-4   yoffset=-3   xadvance=21   page=0    chnl=0\nchar id=196     x=346  y=41   width=29   height=36   xoffset=-4   yoffset=-2   xadvance=21   page=0    chnl=0\nchar id=197     x=246  y=0    width=29   height=39   xoffset=-4   yoffset=-5   xadvance=21   page=0    chnl=0\nchar id=198     x=165  y=178  width=39   height=32   xoffset=-4   yoffset=2    xadvance=30   page=0    chnl=0\nchar id=199     x=64   y=41   width=27   height=38   xoffset=-4   yoffset=3    xadvance=21   page=0    chnl=0\nchar id=200     x=275  y=0    width=24   height=39   xoffset=-4   yoffset=-5   xadvance=18   page=0    chnl=0\nchar id=201     x=299  y=0    width=24   height=39   xoffset=-4   yoffset=-5   xadvance=18   page=0    chnl=0\nchar id=202     x=91   y=41   width=24   height=38   xoffset=-4   yoffset=-4   xadvance=18   page=0    chnl=0\nchar id=203     x=375  y=41   width=24   height=36   xoffset=-4   yoffset=-2   xadvance=18   page=0    chnl=0\nchar id=204     x=323  y=0    width=15   height=39   xoffset=-4   yoffset=-5   xadvance=9    page=0    chnl=0\nchar id=205     x=338  y=0    width=16   height=39   xoffset=-4   yoffset=-5   xadvance=9    page=0    chnl=0\nchar id=206     x=115  y=41   width=19   height=38   xoffset=-4   yoffset=-4   xadvance=9    page=0    chnl=0\nchar id=207     x=399  y=41   width=19   height=36   xoffset=-4   yoffset=-2   xadvance=9    page=0    chnl=0\nchar id=208     x=204  y=178  width=28   height=32   xoffset=-4   yoffset=2    xadvance=21   page=0    chnl=0\nchar id=209     x=216  y=41   width=27   height=37   xoffset=-4   yoffset=-3   xadvance=23   page=0    chnl=0\nchar id=210     x=354  y=0    width=28   height=39   xoffset=-4   yoffset=-5   xadvance=22   page=0    chnl=0\nchar id=211     x=382  y=0    width=28   height=39   xoffset=-4   yoffset=-5   xadvance=22   page=0    chnl=0\nchar id=212     x=134  y=41   width=28   height=38   xoffset=-4   yoffset=-4   xadvance=22   page=0    chnl=0\nchar id=213     x=243  y=41   width=28   height=37   xoffset=-4   yoffset=-3   xadvance=22   page=0    chnl=0\nchar id=214     x=418  y=41   width=28   height=36   xoffset=-4   yoffset=-2   xadvance=22   page=0    chnl=0\nchar id=215     x=262  y=241  width=23   height=23   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=216     x=21   y=79   width=28   height=34   xoffset=-4   yoffset=2    xadvance=22   page=0    chnl=0\nchar id=217     x=410  y=0    width=25   height=39   xoffset=-4   yoffset=-5   xadvance=21   page=0    chnl=0\nchar id=218     x=435  y=0    width=25   height=39   xoffset=-4   yoffset=-5   xadvance=21   page=0    chnl=0\nchar id=219     x=162  y=41   width=25   height=38   xoffset=-4   yoffset=-4   xadvance=21   page=0    chnl=0\nchar id=220     x=446  y=41   width=25   height=36   xoffset=-4   yoffset=-2   xadvance=21   page=0    chnl=0\nchar id=221     x=460  y=0    width=27   height=39   xoffset=-4   yoffset=-5   xadvance=19   page=0    chnl=0\nchar id=222     x=232  y=178  width=24   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=223     x=256  y=178  width=24   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=224     x=298  y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=17   page=0    chnl=0\nchar id=225     x=321  y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=17   page=0    chnl=0\nchar id=226     x=280  y=178  width=23   height=32   xoffset=-4   yoffset=2    xadvance=17   page=0    chnl=0\nchar id=227     x=73   y=210  width=23   height=31   xoffset=-4   yoffset=3    xadvance=17   page=0    chnl=0\nchar id=228     x=204  y=210  width=23   height=30   xoffset=-4   yoffset=4    xadvance=17   page=0    chnl=0\nchar id=229     x=344  y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=17   page=0    chnl=0\nchar id=230     x=207  y=241  width=33   height=25   xoffset=-4   yoffset=9    xadvance=27   page=0    chnl=0\nchar id=231     x=367  y=79   width=23   height=33   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=232     x=390  y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=17   page=0    chnl=0\nchar id=233     x=413  y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=17   page=0    chnl=0\nchar id=234     x=303  y=178  width=23   height=32   xoffset=-4   yoffset=2    xadvance=17   page=0    chnl=0\nchar id=235     x=227  y=210  width=23   height=30   xoffset=-4   yoffset=4    xadvance=17   page=0    chnl=0\nchar id=236     x=436  y=79   width=16   height=33   xoffset=-4   yoffset=1    xadvance=8    page=0    chnl=0\nchar id=237     x=452  y=79   width=16   height=33   xoffset=-4   yoffset=1    xadvance=8    page=0    chnl=0\nchar id=238     x=491  y=146  width=20   height=32   xoffset=-4   yoffset=2    xadvance=8    page=0    chnl=0\nchar id=239     x=250  y=210  width=20   height=30   xoffset=-4   yoffset=4    xadvance=8    page=0    chnl=0\nchar id=240     x=326  y=178  width=23   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=241     x=96   y=210  width=22   height=31   xoffset=-4   yoffset=3    xadvance=18   page=0    chnl=0\nchar id=242     x=468  y=79   width=24   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=243     x=0    y=113  width=24   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=244     x=349  y=178  width=24   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=245     x=118  y=210  width=24   height=31   xoffset=-4   yoffset=3    xadvance=18   page=0    chnl=0\nchar id=246     x=270  y=210  width=24   height=30   xoffset=-4   yoffset=4    xadvance=18   page=0    chnl=0\nchar id=247     x=285  y=241  width=25   height=23   xoffset=-4   yoffset=7    xadvance=18   page=0    chnl=0\nchar id=248     x=316  y=210  width=24   height=29   xoffset=-4   yoffset=7    xadvance=18   page=0    chnl=0\nchar id=249     x=24   y=113  width=22   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=250     x=46   y=113  width=22   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=251     x=373  y=178  width=22   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=252     x=294  y=210  width=22   height=30   xoffset=-4   yoffset=4    xadvance=18   page=0    chnl=0\nchar id=253     x=90   y=0    width=23   height=40   xoffset=-4   yoffset=1    xadvance=15   page=0    chnl=0\nchar id=254     x=113  y=0    width=23   height=40   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=255     x=271  y=41   width=23   height=37   xoffset=-4   yoffset=4    xadvance=15   page=0    chnl=0\nkernings count=560\nkerning first=193 second=34 amount=-2\nkerning first=221 second=44 amount=-3\nkerning first=87 second=45 amount=-1\nkerning first=47 second=47 amount=-3\nkerning first=80 second=74 amount=-3\nkerning first=208 second=89 amount=-1\nkerning first=221 second=115 amount=-1\nkerning first=114 second=116 amount=1\nkerning first=193 second=119 amount=-1\nkerning first=110 second=34 amount=-2\nkerning first=89 second=196 amount=-1\nkerning first=76 second=210 amount=-1\nkerning first=76 second=218 amount=-1\nkerning first=221 second=220 amount=-1\nkerning first=211 second=221 amount=-1\nkerning first=34 second=229 amount=-1\nkerning first=39 second=235 amount=-1\nkerning first=221 second=251 amount=-1\nkerning first=196 second=255 amount=-1\nkerning first=194 second=84 amount=-2\nkerning first=89 second=110 amount=-1\nkerning first=89 second=241 amount=-1\nkerning first=76 second=87 amount=-2\nkerning first=192 second=87 amount=-1\nkerning first=104 second=39 amount=-2\nkerning first=89 second=227 amount=-1\nkerning first=89 second=230 amount=-1\nkerning first=225 second=39 amount=-1\nkerning first=119 second=46 amount=-2\nkerning first=87 second=44 amount=-2\nkerning first=89 second=97 amount=-1\nkerning first=80 second=193 amount=-2\nkerning first=193 second=253 amount=-1\nkerning first=84 second=251 amount=-1\nkerning first=84 second=119 amount=-1\nkerning first=84 second=122 amount=-1\nkerning first=76 second=221 amount=-4\nkerning first=214 second=89 amount=-1\nkerning first=87 second=226 amount=-1\nkerning first=221 second=193 amount=-1\nkerning first=84 second=118 amount=-1\nkerning first=84 second=235 amount=-2\nkerning first=84 second=112 amount=-2\nkerning first=76 second=199 amount=-1\nkerning first=221 second=224 amount=-1\nkerning first=114 second=97 amount=-1\nkerning first=87 second=195 amount=-1\nkerning first=213 second=89 amount=-1\nkerning first=208 second=46 amount=-2\nkerning first=65 second=87 amount=-1\nkerning first=195 second=39 amount=-2\nkerning first=84 second=198 amount=-3\nkerning first=39 second=97 amount=-1\nkerning first=221 second=233 amount=-1\nkerning first=214 second=221 amount=-1\nkerning first=34 second=245 amount=-1\nkerning first=192 second=86 amount=-1\nkerning first=109 second=34 amount=-2\nkerning first=221 second=111 amount=-1\nkerning first=214 second=46 amount=-2\nkerning first=228 second=34 amount=-1\nkerning first=221 second=249 amount=-1\nkerning first=34 second=101 amount=-1\nkerning first=87 second=173 amount=-1\nkerning first=197 second=118 amount=-1\nkerning first=80 second=197 amount=-2\nkerning first=84 second=195 amount=-1\nkerning first=221 second=97 amount=-1\nkerning first=221 second=103 amount=-1\nkerning first=39 second=227 amount=-1\nkerning first=65 second=39 amount=-2\nkerning first=212 second=198 amount=-1\nkerning first=221 second=242 amount=-1\nkerning first=84 second=248 amount=-1\nkerning first=208 second=221 amount=-1\nkerning first=86 second=46 amount=-4\nkerning first=243 second=34 amount=-2\nkerning first=34 second=196 amount=-2\nkerning first=70 second=196 amount=-3\nkerning first=75 second=119 amount=-1\nkerning first=195 second=84 amount=-2\nkerning first=227 second=34 amount=-1\nkerning first=84 second=244 amount=-2\nkerning first=34 second=195 amount=-2\nkerning first=70 second=195 amount=-3\nkerning first=76 second=89 amount=-4\nkerning first=76 second=39 amount=-5\nkerning first=192 second=39 amount=-2\nkerning first=70 second=44 amount=-4\nkerning first=65 second=255 amount=-1\nkerning first=86 second=242 amount=-1\nkerning first=84 second=114 amount=-1\nkerning first=34 second=193 amount=-2\nkerning first=39 second=197 amount=-2\nkerning first=87 second=65 amount=-1\nkerning first=39 second=245 amount=-1\nkerning first=221 second=99 amount=-1\nkerning first=70 second=227 amount=-1\nkerning first=34 second=227 amount=-1\nkerning first=86 second=196 amount=-1\nkerning first=76 second=118 amount=-2\nkerning first=86 second=228 amount=-1\nkerning first=192 second=118 amount=-1\nkerning first=39 second=101 amount=-1\nkerning first=86 second=97 amount=-1\nkerning first=39 second=228 amount=-1\nkerning first=39 second=243 amount=-1\nkerning first=81 second=84 amount=-1\nkerning first=84 second=45 amount=-4\nkerning first=84 second=187 amount=-3\nkerning first=194 second=63 amount=-1\nkerning first=197 second=84 amount=-2\nkerning first=76 second=250 amount=-1\nkerning first=84 second=231 amount=-2\nkerning first=44 second=34 amount=-3\nkerning first=212 second=44 amount=-2\nkerning first=245 second=39 amount=-2\nkerning first=192 second=255 amount=-1\nkerning first=76 second=255 amount=-2\nkerning first=86 second=101 amount=-1\nkerning first=196 second=119 amount=-1\nkerning first=194 second=89 amount=-1\nkerning first=34 second=226 amount=-1\nkerning first=221 second=232 amount=-1\nkerning first=70 second=226 amount=-1\nkerning first=65 second=118 amount=-1\nkerning first=194 second=221 amount=-1\nkerning first=89 second=252 amount=-1\nkerning first=89 second=220 amount=-1\nkerning first=39 second=196 amount=-2\nkerning first=89 second=246 amount=-1\nkerning first=221 second=171 amount=-1\nkerning first=84 second=110 amount=-2\nkerning first=89 second=46 amount=-3\nkerning first=86 second=246 amount=-1\nkerning first=114 second=46 amount=-2\nkerning first=221 second=218 amount=-1\nkerning first=34 second=244 amount=-1\nkerning first=86 second=224 amount=-1\nkerning first=86 second=192 amount=-1\nkerning first=89 second=101 amount=-1\nkerning first=246 second=34 amount=-2\nkerning first=89 second=245 amount=-1\nkerning first=39 second=246 amount=-1\nkerning first=89 second=228 amount=-1\nkerning first=86 second=233 amount=-1\nkerning first=109 second=39 amount=-2\nkerning first=195 second=255 amount=-1\nkerning first=221 second=187 amount=-1\nkerning first=195 second=118 amount=-1\nkerning first=86 second=197 amount=-1\nkerning first=242 second=39 amount=-2\nkerning first=221 second=194 amount=-1\nkerning first=87 second=225 amount=-1\nkerning first=84 second=226 amount=-2\nkerning first=76 second=86 amount=-3\nkerning first=197 second=89 amount=-1\nkerning first=66 second=221 amount=-1\nkerning first=81 second=89 amount=-1\nkerning first=241 second=34 amount=-2\nkerning first=89 second=226 amount=-1\nkerning first=87 second=227 amount=-1\nkerning first=89 second=171 amount=-1\nkerning first=214 second=198 amount=-1\nkerning first=65 second=86 amount=-1\nkerning first=75 second=253 amount=-1\nkerning first=89 second=242 amount=-1\nkerning first=89 second=65 amount=-1\nkerning first=193 second=221 amount=-1\nkerning first=114 second=226 amount=-1\nkerning first=229 second=34 amount=-1\nkerning first=221 second=219 amount=-1\nkerning first=75 second=118 amount=-1\nkerning first=34 second=115 amount=-1\nkerning first=89 second=42 amount=-1\nkerning first=84 second=121 amount=-1\nkerning first=34 second=234 amount=-1\nkerning first=193 second=63 amount=-1\nkerning first=221 second=250 amount=-1\nkerning first=84 second=192 amount=-1\nkerning first=84 second=255 amount=-1\nkerning first=208 second=198 amount=-1\nkerning first=80 second=194 amount=-2\nkerning first=227 second=39 amount=-1\nkerning first=89 second=194 amount=-1\nkerning first=39 second=233 amount=-1\nkerning first=212 second=89 amount=-1\nkerning first=89 second=113 amount=-1\nkerning first=70 second=74 amount=-4\nkerning first=70 second=228 amount=-1\nkerning first=196 second=34 amount=-2\nkerning first=244 second=34 amount=-2\nkerning first=39 second=103 amount=-1\nkerning first=89 second=197 amount=-1\nkerning first=87 second=192 amount=-1\nkerning first=221 second=225 amount=-1\nkerning first=197 second=39 amount=-2\nkerning first=84 second=227 amount=-2\nkerning first=193 second=87 amount=-1\nkerning first=84 second=230 amount=-2\nkerning first=87 second=229 amount=-1\nkerning first=221 second=65 amount=-1\nkerning first=39 second=242 amount=-1\nkerning first=89 second=244 amount=-1\nkerning first=86 second=103 amount=-1\nkerning first=242 second=34 amount=-2\nkerning first=84 second=252 amount=-1\nkerning first=39 second=244 amount=-1\nkerning first=194 second=118 amount=-1\nkerning first=196 second=63 amount=-1\nkerning first=76 second=252 amount=-1\nkerning first=65 second=121 amount=-1\nkerning first=76 second=220 amount=-1\nkerning first=89 second=103 amount=-1\nkerning first=214 second=44 amount=-2\nkerning first=224 second=39 amount=-1\nkerning first=89 second=198 amount=-1\nkerning first=221 second=46 amount=-3\nkerning first=76 second=79 amount=-1\nkerning first=84 second=113 amount=-2\nkerning first=84 second=197 amount=-1\nkerning first=34 second=242 amount=-1\nkerning first=111 second=34 amount=-2\nkerning first=39 second=34 amount=-2\nkerning first=84 second=74 amount=-4\nkerning first=197 second=255 amount=-1\nkerning first=84 second=245 amount=-2\nkerning first=84 second=32 amount=-1\nkerning first=76 second=213 amount=-1\nkerning first=84 second=229 amount=-2\nkerning first=89 second=217 amount=-1\nkerning first=84 second=101 amount=-2\nkerning first=89 second=115 amount=-1\nkerning first=192 second=121 amount=-1\nkerning first=76 second=121 amount=-2\nkerning first=39 second=231 amount=-1\nkerning first=194 second=39 amount=-2\nkerning first=86 second=44 amount=-4\nkerning first=221 second=196 amount=-1\nkerning first=86 second=231 amount=-1\nkerning first=221 second=228 amount=-1\nkerning first=76 second=67 amount=-1\nkerning first=221 second=117 amount=-1\nkerning first=80 second=46 amount=-5\nkerning first=89 second=218 amount=-1\nkerning first=65 second=84 amount=-2\nkerning first=70 second=192 amount=-3\nkerning first=34 second=192 amount=-2\nkerning first=195 second=121 amount=-1\nkerning first=221 second=241 amount=-1\nkerning first=34 second=113 amount=-1\nkerning first=70 second=229 amount=-1\nkerning first=196 second=253 amount=-1\nkerning first=86 second=194 amount=-1\nkerning first=88 second=173 amount=-1\nkerning first=70 second=197 amount=-3\nkerning first=34 second=197 amount=-2\nkerning first=97 second=34 amount=-1\nkerning first=192 second=89 amount=-1\nkerning first=86 second=226 amount=-1\nkerning first=221 second=110 amount=-1\nkerning first=253 second=46 amount=-2\nkerning first=196 second=221 amount=-1\nkerning first=89 second=231 amount=-1\nkerning first=86 second=244 amount=-1\nkerning first=221 second=112 amount=-1\nkerning first=221 second=246 amount=-1\nkerning first=80 second=196 amount=-2\nkerning first=76 second=84 amount=-4\nkerning first=221 second=85 amount=-1\nkerning first=114 second=44 amount=-2\nkerning first=89 second=187 amount=-1\nkerning first=192 second=84 amount=-2\nkerning first=221 second=173 amount=-1\nkerning first=39 second=115 amount=-1\nkerning first=194 second=87 amount=-1\nkerning first=111 second=39 amount=-2\nkerning first=39 second=39 amount=-2\nkerning first=70 second=224 amount=-1\nkerning first=84 second=234 amount=-2\nkerning first=34 second=224 amount=-1\nkerning first=89 second=44 amount=-3\nkerning first=39 second=194 amount=-2\nkerning first=197 second=86 amount=-1\nkerning first=211 second=46 amount=-2\nkerning first=255 second=46 amount=-2\nkerning first=65 second=89 amount=-1\nkerning first=210 second=221 amount=-1\nkerning first=70 second=193 amount=-3\nkerning first=86 second=65 amount=-1\nkerning first=84 second=120 amount=-1\nkerning first=226 second=34 amount=-1\nkerning first=87 second=228 amount=-1\nkerning first=193 second=118 amount=-1\nkerning first=86 second=234 amount=-1\nkerning first=80 second=195 amount=-2\nkerning first=34 second=103 amount=-1\nkerning first=195 second=63 amount=-1\nkerning first=89 second=225 amount=-1\nkerning first=76 second=85 amount=-1\nkerning first=244 second=39 amount=-2\nkerning first=34 second=233 amount=-1\nkerning first=221 second=100 amount=-1\nkerning first=76 second=211 amount=-1\nkerning first=84 second=253 amount=-1\nkerning first=195 second=119 amount=-1\nkerning first=221 second=235 amount=-1\nkerning first=84 second=193 amount=-1\nkerning first=195 second=89 amount=-1\nkerning first=89 second=249 amount=-1\nkerning first=197 second=34 amount=-2\nkerning first=39 second=99 amount=-1\nkerning first=79 second=89 amount=-1\nkerning first=68 second=221 amount=-1\nkerning first=89 second=112 amount=-1\nkerning first=194 second=86 amount=-1\nkerning first=89 second=192 amount=-1\nkerning first=75 second=121 amount=-1\nkerning first=82 second=84 amount=-1\nkerning first=39 second=193 amount=-2\nkerning first=39 second=226 amount=-1\nkerning first=75 second=255 amount=-1\nkerning first=97 second=39 amount=-1\nkerning first=84 second=224 amount=-2\nkerning first=211 second=44 amount=-2\nkerning first=255 second=44 amount=-2\nkerning first=119 second=44 amount=-2\nkerning first=84 second=233 amount=-2\nkerning first=194 second=255 amount=-1\nkerning first=86 second=225 amount=-1\nkerning first=89 second=229 amount=-1\nkerning first=221 second=198 amount=-1\nkerning first=192 second=63 amount=-1\nkerning first=68 second=89 amount=-1\nkerning first=194 second=34 amount=-2\nkerning first=195 second=221 amount=-1\nkerning first=79 second=221 amount=-1\nkerning first=84 second=111 amount=-2\nkerning first=89 second=99 amount=-1\nkerning first=79 second=46 amount=-2\nkerning first=194 second=121 amount=-1\nkerning first=221 second=195 amount=-1\nkerning first=84 second=249 amount=-1\nkerning first=84 second=103 amount=-2\nkerning first=39 second=225 amount=-1\nkerning first=65 second=63 amount=-1\nkerning first=89 second=219 amount=-1\nkerning first=229 second=39 amount=-1\nkerning first=87 second=224 amount=-1\nkerning first=39 second=65 amount=-2\nkerning first=114 second=229 amount=-1\nkerning first=208 second=44 amount=-2\nkerning first=241 second=39 amount=-2\nkerning first=196 second=118 amount=-1\nkerning first=87 second=197 amount=-1\nkerning first=221 second=248 amount=-1\nkerning first=210 second=89 amount=-1\nkerning first=197 second=253 amount=-1\nkerning first=84 second=242 amount=-2\nkerning first=68 second=46 amount=-2\nkerning first=224 second=34 amount=-1\nkerning first=82 second=89 amount=-1\nkerning first=114 second=224 amount=-1\nkerning first=195 second=86 amount=-1\nkerning first=32 second=84 amount=-1\nkerning first=39 second=100 amount=-1\nkerning first=221 second=244 amount=-1\nkerning first=221 second=114 amount=-1\nkerning first=80 second=198 amount=-2\nkerning first=210 second=46 amount=-2\nkerning first=39 second=113 amount=-1\nkerning first=89 second=233 amount=-1\nkerning first=84 second=243 amount=-2\nkerning first=221 second=231 amount=-1\nkerning first=34 second=111 amount=-1\nkerning first=84 second=99 amount=-2\nkerning first=39 second=229 amount=-1\nkerning first=221 second=45 amount=-1\nkerning first=89 second=173 amount=-1\nkerning first=118 second=46 amount=-2\nkerning first=80 second=65 amount=-2\nkerning first=226 second=39 amount=-1\nkerning first=213 second=44 amount=-2\nkerning first=89 second=234 amount=-1\nkerning first=34 second=243 amount=-1\nkerning first=84 second=109 amount=-2\nkerning first=86 second=113 amount=-1\nkerning first=70 second=194 amount=-3\nkerning first=34 second=194 amount=-2\nkerning first=194 second=253 amount=-1\nkerning first=84 second=232 amount=-2\nkerning first=213 second=221 amount=-1\nkerning first=89 second=100 amount=-1\nkerning first=76 second=217 amount=-1\nkerning first=76 second=249 amount=-1\nkerning first=44 second=39 amount=-3\nkerning first=86 second=173 amount=-1\nkerning first=196 second=39 amount=-2\nkerning first=84 second=171 amount=-5\nkerning first=196 second=87 amount=-1\nkerning first=221 second=109 amount=-1\nkerning first=34 second=34 amount=-2\nkerning first=89 second=74 amount=-1\nkerning first=76 second=81 amount=-1\nkerning first=213 second=46 amount=-2\nkerning first=34 second=99 amount=-1\nkerning first=65 second=119 amount=-1\nkerning first=34 second=39 amount=-2\nkerning first=88 second=45 amount=-1\nkerning first=84 second=115 amount=-2\nkerning first=197 second=121 amount=-1\nkerning first=75 second=173 amount=-1\nkerning first=87 second=193 amount=-1\nkerning first=39 second=234 amount=-1\nkerning first=80 second=44 amount=-5\nkerning first=76 second=119 amount=-1\nkerning first=221 second=226 amount=-1\nkerning first=192 second=119 amount=-1\nkerning first=84 second=194 amount=-1\nkerning first=89 second=117 amount=-1\nkerning first=82 second=221 amount=-1\nkerning first=121 second=46 amount=-2\nkerning first=34 second=232 amount=-1\nkerning first=86 second=229 amount=-1\nkerning first=65 second=34 amount=-2\nkerning first=87 second=196 amount=-1\nkerning first=86 second=235 amount=-1\nkerning first=114 second=228 amount=-1\nkerning first=34 second=97 amount=-1\nkerning first=89 second=109 amount=-1\nkerning first=89 second=195 amount=-1\nkerning first=196 second=84 amount=-2\nkerning first=193 second=39 amount=-2\nkerning first=213 second=198 amount=-1\nkerning first=79 second=198 amount=-1\nkerning first=89 second=193 amount=-1\nkerning first=34 second=246 amount=-1\nkerning first=87 second=194 amount=-1\nkerning first=76 second=71 amount=-1\nkerning first=89 second=248 amount=-1\nkerning first=212 second=221 amount=-1\nkerning first=70 second=65 amount=-3\nkerning first=193 second=121 amount=-1\nkerning first=89 second=111 amount=-1\nkerning first=89 second=85 amount=-1\nkerning first=221 second=243 amount=-1\nkerning first=87 second=97 amount=-1\nkerning first=84 second=250 amount=-1\nkerning first=221 second=192 amount=-1\nkerning first=39 second=224 amount=-1\nkerning first=246 second=39 amount=-2\nkerning first=76 second=212 amount=-1\nkerning first=121 second=44 amount=-2\nkerning first=86 second=193 amount=-1\nkerning first=80 second=192 amount=-2\nkerning first=195 second=253 amount=-1\nkerning first=84 second=97 amount=-2\nkerning first=193 second=89 amount=-1\nkerning first=210 second=198 amount=-1\nkerning first=34 second=100 amount=-1\nkerning first=196 second=86 amount=-1\nkerning first=39 second=111 amount=-1\nkerning first=70 second=46 amount=-4\nkerning first=221 second=217 amount=-1\nkerning first=84 second=225 amount=-2\nkerning first=39 second=195 amount=-2\nkerning first=221 second=227 amount=-1\nkerning first=197 second=87 amount=-1\nkerning first=84 second=65 amount=-1\nkerning first=34 second=225 amount=-1\nkerning first=110 second=39 amount=-2\nkerning first=70 second=225 amount=-1\nkerning first=68 second=198 amount=-1\nkerning first=66 second=89 amount=-1\nkerning first=192 second=34 amount=-2\nkerning first=197 second=221 amount=-1\nkerning first=76 second=34 amount=-5\nkerning first=81 second=221 amount=-1\nkerning first=221 second=230 amount=-1\nkerning first=76 second=214 amount=-1\nkerning first=212 second=46 amount=-2\nkerning first=89 second=235 amount=-1\nkerning first=221 second=252 amount=-1\nkerning first=86 second=245 amount=-1\nkerning first=86 second=111 amount=-1\nkerning first=34 second=228 amount=-1\nkerning first=193 second=84 amount=-2\nkerning first=197 second=63 amount=-1\nkerning first=196 second=121 amount=-1\nkerning first=114 second=227 amount=-1\nkerning first=70 second=97 amount=-1\nkerning first=243 second=39 amount=-2\nkerning first=79 second=44 amount=-2\nkerning first=86 second=243 amount=-1\nkerning first=65 second=253 amount=-1\nkerning first=84 second=46 amount=-3\nkerning first=89 second=232 amount=-1\nkerning first=65 second=221 amount=-1\nkerning first=221 second=113 amount=-1\nkerning first=86 second=45 amount=-1\nkerning first=221 second=101 amount=-1\nkerning first=221 second=245 amount=-1\nkerning first=76 second=251 amount=-1\nkerning first=192 second=253 amount=-1\nkerning first=221 second=197 amount=-1\nkerning first=196 second=89 amount=-1\nkerning first=221 second=74 amount=-1\nkerning first=76 second=219 amount=-1\nkerning first=192 second=221 amount=-1\nkerning first=221 second=229 amount=-1\nkerning first=34 second=231 amount=-1\nkerning first=194 second=119 amount=-1\nkerning first=84 second=228 amount=-2\nkerning first=39 second=192 amount=-2\nkerning first=75 second=45 amount=-1\nkerning first=86 second=195 amount=-1\nkerning first=76 second=253 amount=-2\nkerning first=68 second=44 amount=-2\nkerning first=89 second=45 amount=-1\nkerning first=76 second=117 amount=-1\nkerning first=89 second=224 amount=-1\nkerning first=193 second=86 amount=-1\nkerning first=245 second=34 amount=-2\nkerning first=46 second=34 amount=-3\nkerning first=89 second=251 amount=-1\nkerning first=86 second=227 amount=-1\nkerning first=39 second=232 amount=-1\nkerning first=76 second=216 amount=-1\nkerning first=84 second=196 amount=-1\nkerning first=84 second=100 amount=-2\nkerning first=34 second=65 amount=-2\nkerning first=84 second=117 amount=-1\nkerning first=197 second=119 amount=-1\nkerning first=84 second=241 amount=-2\nkerning first=84 second=44 amount=-3\nkerning first=228 second=39 amount=-1\nkerning first=253 second=44 amount=-2\nkerning first=210 second=44 amount=-2\nkerning first=118 second=44 amount=-2\nkerning first=193 second=255 amount=-1\nkerning first=89 second=114 amount=-1\nkerning first=211 second=89 amount=-1\nkerning first=195 second=34 amount=-2\nkerning first=86 second=232 amount=-1\nkerning first=89 second=243 amount=-1\nkerning first=34 second=235 amount=-1\nkerning first=87 second=46 amount=-2\nkerning first=195 second=87 amount=-1\nkerning first=86 second=100 amount=-1\nkerning first=84 second=246 amount=-2\nkerning first=211 second=198 amount=-1\nkerning first=221 second=42 amount=-1\nkerning first=46 second=39 amount=-3\nkerning first=84 second=173 amount=-4\nkerning first=114 second=225 amount=-1\nkerning first=221 second=234 amount=-1\nkerning first=86 second=99 amount=-1\nkerning first=104 second=34 amount=-2\nkerning first=89 second=250 amount=-1\nkerning first=225 second=34 amount=-1\n";
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
        press: undefined,
        hover: undefined
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

},{"./button":1,"./checkbox":2,"./dropdown":4,"./folder":5,"./font":6,"./sdftext":12,"./slider":14,"events":21}],9:[function(require,module,exports){
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
  var availableInputs = [];

  function update(inputObjects) {

    hover = false;
    anyPressing = false;
    anyActive = false;

    inputObjects.forEach(function (input) {

      if (availableInputs.indexOf(input) < 0) {
        availableInputs.push(input);
      }

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
        input.interaction.hover = interaction;
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
      input.interaction.hover = undefined;
      events.emit(upName, {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object
      });
    }
  }

  function isMainHover() {

    var noMainHover = true;
    for (var i = 0; i < availableInputs.length; i++) {
      if (availableInputs[i].interaction.hover !== undefined) {
        noMainHover = false;
        break;
      }
    }

    if (noMainHover) {
      return hover;
    }

    if (availableInputs.filter(function (input) {
      return input.interaction.hover === interaction;
    }).length > 0) {
      return true;
    }

    return false;
  }

  var interaction = {
    hovering: isMainHover,
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

},{"events":21}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BUTTON_DEPTH = exports.CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_WIDTH = exports.PANEL_VALUE_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = exports.PANEL_MARGIN = exports.PANEL_SPACING = exports.PANEL_DEPTH = exports.PANEL_HEIGHT = exports.PANEL_WIDTH = undefined;
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
var PANEL_HEIGHT = exports.PANEL_HEIGHT = 0.08;
var PANEL_DEPTH = exports.PANEL_DEPTH = 0.001;
var PANEL_SPACING = exports.PANEL_SPACING = 0.002;
var PANEL_MARGIN = exports.PANEL_MARGIN = 0.015;
var PANEL_LABEL_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = 0.06;
var PANEL_VALUE_TEXT_MARGIN = exports.PANEL_VALUE_TEXT_MARGIN = 0.02;
var CONTROLLER_ID_WIDTH = exports.CONTROLLER_ID_WIDTH = 0.02;
var CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_DEPTH = 0.001;
var BUTTON_DEPTH = exports.BUTTON_DEPTH = 0.01;

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

var textScale = 0.0012;

function creator() {

  var font = (0, _parseBmfontAscii2.default)(Font.fnt());

  var colorMaterials = {};

  function createText(str, font) {
    var color = arguments.length <= 2 || arguments[2] === undefined ? 0xffffff : arguments[2];
    var scale = arguments.length <= 3 || arguments[3] === undefined ? 1.0 : arguments[3];


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

    var finalScale = scale * textScale;

    mesh.scale.multiplyScalar(finalScale);

    mesh.position.y = layout.height * 0.5 * finalScale;

    return mesh;
  }

  function create(str) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$color = _ref.color;
    var color = _ref$color === undefined ? 0xffffff : _ref$color;
    var _ref$scale = _ref.scale;
    var scale = _ref$scale === undefined ? 1.0 : _ref$scale;

    var group = new THREE.Group();

    var mesh = createText(str, font, color, scale);
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

},{"./font":6,"parse-bmfont-ascii":27,"three-bmfont-text":29,"three-bmfont-text/shaders/sdf":32}],13:[function(require,module,exports){
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

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;

  //  sliderBG volume
  var sliderBG = new THREE.Mesh(rect.clone(), SharedMaterials.PANEL);
  Colors.colorizeGeometry(sliderBG.geometry, Colors.SLIDER_BG);
  sliderBG.position.z = depth * 0.5;
  sliderBG.position.x = SLIDER_WIDTH + Layout.PANEL_MARGIN;

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
  panel.add(descriptorLabel, hitscanVolume, sliderBG, valueLabel, controllerID);

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

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
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
  var scale = arguments.length <= 6 || arguments[6] === undefined ? 1.0 : arguments[6];


  var group = new THREE.Group();
  var internalPositioning = new THREE.Group();
  group.add(internalPositioning);

  var text = textCreator.create(str, { color: fgColor, scale: scale });
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
  internalPositioning.add(labelBackMesh);
  internalPositioning.position.y = -totalHeight * 0.5;

  group.back = labelBackMesh;

  return group;
}

},{"./colors":3,"./sharedmaterials":13}],16:[function(require,module,exports){
'use strict';

/*
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog
 *	@author centerionware / http://www.centerionware.com
 *
 *	Subdivision Geometry Modifier
 *		using Loop Subdivision Scheme
 *
 *	References:
 *		http://graphics.stanford.edu/~mdfisher/subdivision.html
 *		http://www.holmes3d.net/graphics/subdivision/
 *		http://www.cs.rutgers.edu/~decarlo/readings/subdiv-sg00c.pdf
 *
 *	Known Issues:
 *		- currently doesn't handle "Sharp Edges"
 */

THREE.SubdivisionModifier = function (subdivisions) {

	this.subdivisions = subdivisions === undefined ? 1 : subdivisions;
};

// Applies the "modify" pattern
THREE.SubdivisionModifier.prototype.modify = function (geometry) {

	var repeats = this.subdivisions;

	while (repeats-- > 0) {

		this.smooth(geometry);
	}

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
};

(function () {

	// Some constants
	var WARNINGS = !true; // Set to true for development
	var ABC = ['a', 'b', 'c'];

	function getEdge(a, b, map) {

		var vertexIndexA = Math.min(a, b);
		var vertexIndexB = Math.max(a, b);

		var key = vertexIndexA + "_" + vertexIndexB;

		return map[key];
	}

	function processEdge(a, b, vertices, map, face, metaVertices) {

		var vertexIndexA = Math.min(a, b);
		var vertexIndexB = Math.max(a, b);

		var key = vertexIndexA + "_" + vertexIndexB;

		var edge;

		if (key in map) {

			edge = map[key];
		} else {

			var vertexA = vertices[vertexIndexA];
			var vertexB = vertices[vertexIndexB];

			edge = {

				a: vertexA, // pointer reference
				b: vertexB,
				newEdge: null,
				// aIndex: a, // numbered reference
				// bIndex: b,
				faces: [] // pointers to face

			};

			map[key] = edge;
		}

		edge.faces.push(face);

		metaVertices[a].edges.push(edge);
		metaVertices[b].edges.push(edge);
	}

	function generateLookups(vertices, faces, metaVertices, edges) {

		var i, il, face, edge;

		for (i = 0, il = vertices.length; i < il; i++) {

			metaVertices[i] = { edges: [] };
		}

		for (i = 0, il = faces.length; i < il; i++) {

			face = faces[i];

			processEdge(face.a, face.b, vertices, edges, face, metaVertices);
			processEdge(face.b, face.c, vertices, edges, face, metaVertices);
			processEdge(face.c, face.a, vertices, edges, face, metaVertices);
		}
	}

	function newFace(newFaces, a, b, c) {

		newFaces.push(new THREE.Face3(a, b, c));
	}

	function midpoint(a, b) {

		return Math.abs(b - a) / 2 + Math.min(a, b);
	}

	function newUv(newUvs, a, b, c) {

		newUvs.push([a.clone(), b.clone(), c.clone()]);
	}

	/////////////////////////////

	// Performs one iteration of Subdivision
	THREE.SubdivisionModifier.prototype.smooth = function (geometry) {

		var tmp = new THREE.Vector3();

		var oldVertices, oldFaces, oldUvs;
		var newVertices,
		    newFaces,
		    newUVs = [];

		var n, l, i, il, j, k;
		var metaVertices, sourceEdges;

		// new stuff.
		var sourceEdges, newEdgeVertices, newSourceVertices;

		oldVertices = geometry.vertices; // { x, y, z}
		oldFaces = geometry.faces; // { a: oldVertex1, b: oldVertex2, c: oldVertex3 }
		oldUvs = geometry.faceVertexUvs[0];

		var hasUvs = oldUvs !== undefined && oldUvs.length > 0;

		/******************************************************
   *
   * Step 0: Preprocess Geometry to Generate edges Lookup
   *
   *******************************************************/

		metaVertices = new Array(oldVertices.length);
		sourceEdges = {}; // Edge => { oldVertex1, oldVertex2, faces[]  }

		generateLookups(oldVertices, oldFaces, metaVertices, sourceEdges);

		/******************************************************
   *
   *	Step 1.
   *	For each edge, create a new Edge Vertex,
   *	then position it.
   *
   *******************************************************/

		newEdgeVertices = [];
		var other, currentEdge, newEdge, face;
		var edgeVertexWeight, adjacentVertexWeight, connectedFaces;

		for (i in sourceEdges) {

			currentEdge = sourceEdges[i];
			newEdge = new THREE.Vector3();

			edgeVertexWeight = 3 / 8;
			adjacentVertexWeight = 1 / 8;

			connectedFaces = currentEdge.faces.length;

			// check how many linked faces. 2 should be correct.
			if (connectedFaces != 2) {

				// if length is not 2, handle condition
				edgeVertexWeight = 0.5;
				adjacentVertexWeight = 0;

				if (connectedFaces != 1) {

					if (WARNINGS) console.warn('Subdivision Modifier: Number of connected faces != 2, is: ', connectedFaces, currentEdge);
				}
			}

			newEdge.addVectors(currentEdge.a, currentEdge.b).multiplyScalar(edgeVertexWeight);

			tmp.set(0, 0, 0);

			for (j = 0; j < connectedFaces; j++) {

				face = currentEdge.faces[j];

				for (k = 0; k < 3; k++) {

					other = oldVertices[face[ABC[k]]];
					if (other !== currentEdge.a && other !== currentEdge.b) break;
				}

				tmp.add(other);
			}

			tmp.multiplyScalar(adjacentVertexWeight);
			newEdge.add(tmp);

			currentEdge.newEdge = newEdgeVertices.length;
			newEdgeVertices.push(newEdge);

			// console.log(currentEdge, newEdge);
		}

		/******************************************************
   *
   *	Step 2.
   *	Reposition each source vertices.
   *
   *******************************************************/

		var beta, sourceVertexWeight, connectingVertexWeight;
		var connectingEdge, connectingEdges, oldVertex, newSourceVertex;
		newSourceVertices = [];

		for (i = 0, il = oldVertices.length; i < il; i++) {

			oldVertex = oldVertices[i];

			// find all connecting edges (using lookupTable)
			connectingEdges = metaVertices[i].edges;
			n = connectingEdges.length;

			if (n == 3) {

				beta = 3 / 16;
			} else if (n > 3) {

				beta = 3 / (8 * n); // Warren's modified formula
			}

			// Loop's original beta formula
			// beta = 1 / n * ( 5/8 - Math.pow( 3/8 + 1/4 * Math.cos( 2 * Math. PI / n ), 2) );

			sourceVertexWeight = 1 - n * beta;
			connectingVertexWeight = beta;

			if (n <= 2) {

				// crease and boundary rules
				// console.warn('crease and boundary rules');

				if (n == 2) {

					if (WARNINGS) console.warn('2 connecting edges', connectingEdges);
					sourceVertexWeight = 3 / 4;
					connectingVertexWeight = 1 / 8;

					// sourceVertexWeight = 1;
					// connectingVertexWeight = 0;
				} else if (n == 1) {

					if (WARNINGS) console.warn('only 1 connecting edge');
				} else if (n == 0) {

					if (WARNINGS) console.warn('0 connecting edges');
				}
			}

			newSourceVertex = oldVertex.clone().multiplyScalar(sourceVertexWeight);

			tmp.set(0, 0, 0);

			for (j = 0; j < n; j++) {

				connectingEdge = connectingEdges[j];
				other = connectingEdge.a !== oldVertex ? connectingEdge.a : connectingEdge.b;
				tmp.add(other);
			}

			tmp.multiplyScalar(connectingVertexWeight);
			newSourceVertex.add(tmp);

			newSourceVertices.push(newSourceVertex);
		}

		/******************************************************
   *
   *	Step 3.
   *	Generate Faces between source vertices
   *	and edge vertices.
   *
   *******************************************************/

		newVertices = newSourceVertices.concat(newEdgeVertices);
		var sl = newSourceVertices.length,
		    edge1,
		    edge2,
		    edge3;
		newFaces = [];

		var uv, x0, x1, x2;
		var x3 = new THREE.Vector2();
		var x4 = new THREE.Vector2();
		var x5 = new THREE.Vector2();

		for (i = 0, il = oldFaces.length; i < il; i++) {

			face = oldFaces[i];

			// find the 3 new edges vertex of each old face

			edge1 = getEdge(face.a, face.b, sourceEdges).newEdge + sl;
			edge2 = getEdge(face.b, face.c, sourceEdges).newEdge + sl;
			edge3 = getEdge(face.c, face.a, sourceEdges).newEdge + sl;

			// create 4 faces.

			newFace(newFaces, edge1, edge2, edge3);
			newFace(newFaces, face.a, edge1, edge3);
			newFace(newFaces, face.b, edge2, edge1);
			newFace(newFaces, face.c, edge3, edge2);

			// create 4 new uv's

			if (hasUvs) {

				uv = oldUvs[i];

				x0 = uv[0];
				x1 = uv[1];
				x2 = uv[2];

				x3.set(midpoint(x0.x, x1.x), midpoint(x0.y, x1.y));
				x4.set(midpoint(x1.x, x2.x), midpoint(x1.y, x2.y));
				x5.set(midpoint(x0.x, x2.x), midpoint(x0.y, x2.y));

				newUv(newUVs, x3, x4, x5);
				newUv(newUVs, x0, x3, x5);

				newUv(newUVs, x1, x4, x3);
				newUv(newUVs, x2, x5, x4);
			}
		}

		// Overwrite old arrays
		geometry.vertices = newVertices;
		geometry.faces = newFaces;
		if (hasUvs) geometry.faceVertexUvs[0] = newUVs;

		// console.log('done');
	};
})();

},{}],17:[function(require,module,exports){
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],18:[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{"dtype":19}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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
},{"as-number":18,"indexof-property":22,"word-wrapper":34,"xtend":35}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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
},{"an-array":17,"dtype":19,"is-buffer":24}],29:[function(require,module,exports){
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

},{"./lib/utils":30,"./lib/vertices":31,"inherits":23,"layout-bmfont-text":25,"object-assign":26,"quad-indices":28,"three-buffer-vertex-data":33}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{"object-assign":26}],33:[function(require,module,exports){
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

},{"flatten-vertex-data":20}],34:[function(require,module,exports){
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
},{}],35:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcYnV0dG9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNoZWNrYm94LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNvbG9ycy5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxkcm9wZG93bi5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxmb2xkZXIuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcZm9udC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxncmFiLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGluZGV4LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGludGVyYWN0aW9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGxheW91dC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxwYWxldHRlLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHNkZnRleHQuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcc2hhcmVkbWF0ZXJpYWxzLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHNsaWRlci5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFx0ZXh0bGFiZWwuanMiLCJtb2R1bGVzXFx0aGlyZHBhcnR5XFxTdWJkaXZpc2lvbk1vZGlmaWVyLmpzIiwibm9kZV9tb2R1bGVzL2FuLWFycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzLW51bWJlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdHlwZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mbGF0dGVuLXZlcnRleC1kYXRhL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvaW5kZXhvZi1wcm9wZXJ0eS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sYXlvdXQtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZS1ibWZvbnQtYXNjaWkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcXVhZC1pbmRpY2VzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2xpYi91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9saWIvdmVydGljZXMuanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvc2hhZGVycy9zZGYuanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYnVmZmVyLXZlcnRleC1kYXRhL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3dvcmQtd3JhcHBlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94dGVuZC9pbW11dGFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkM0QndCLGM7O0FBVHhCOztJQUFZLG1COztBQUVaOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWSxNOztBQUNaOztJQUFZLE07O0FBQ1o7O0lBQVksZTs7QUFDWjs7SUFBWSxJOzs7Ozs7QUFFRyxTQUFTLGNBQVQsR0FPUDtBQUFBLG1FQUFKLEVBQUk7O0FBQUEsTUFOTixXQU1NLFFBTk4sV0FNTTtBQUFBLE1BTE4sTUFLTSxRQUxOLE1BS007QUFBQSwrQkFKTixZQUlNO0FBQUEsTUFKTixZQUlNLHFDQUpTLFdBSVQ7QUFBQSx3QkFITixLQUdNO0FBQUEsTUFITixLQUdNLDhCQUhFLE9BQU8sV0FHVDtBQUFBLHlCQUZOLE1BRU07QUFBQSxNQUZOLE1B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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0ICogYXMgU3ViZGl2aXNpb25Nb2RpZmllciBmcm9tICcuLi90aGlyZHBhcnR5L1N1YmRpdmlzaW9uTW9kaWZpZXInO1xyXG5cclxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ2hlY2tib3goIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcbiAgY29uc3QgQlVUVE9OX1dJRFRIID0gd2lkdGggKiAwLjUgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9ERVBUSCA9IExheW91dC5CVVRUT05fREVQVEg7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcclxuXHJcbiAgLy8gIGJhc2UgY2hlY2tib3hcclxuICBjb25zdCBkaXZpc2lvbnMgPSA0O1xyXG4gIGNvbnN0IGFzcGVjdFJhdGlvID0gQlVUVE9OX1dJRFRIIC8gQlVUVE9OX0hFSUdIVDtcclxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBCVVRUT05fV0lEVEgsIEJVVFRPTl9IRUlHSFQsIEJVVFRPTl9ERVBUSCwgTWF0aC5mbG9vciggZGl2aXNpb25zICogYXNwZWN0UmF0aW8gKSwgZGl2aXNpb25zLCBkaXZpc2lvbnMgKTtcclxuICBjb25zdCBtb2RpZmllciA9IG5ldyBUSFJFRS5TdWJkaXZpc2lvbk1vZGlmaWVyKCAxICk7XHJcbiAgbW9kaWZpZXIubW9kaWZ5KCByZWN0ICk7XHJcbiAgcmVjdC50cmFuc2xhdGUoIEJVVFRPTl9XSURUSCAqIDAuNSwgMCwgMCApO1xyXG5cclxuICAvLyAgaGl0c2NhbiB2b2x1bWVcclxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcclxuICBoaXRzY2FuTWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdCBoaXRzY2FuVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgaGl0c2Nhbk1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIICogMC41O1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiBDb2xvcnMuQlVUVE9OX0NPTE9SLCBlbWlzc2l2ZTogQ29sb3JzLkVNSVNTSVZFX0NPTE9SIH0pO1xyXG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xyXG5cclxuXHJcbiAgY29uc3QgYnV0dG9uTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSwgeyBzY2FsZTogMC44NjYgfSApO1xyXG4gIGJ1dHRvbkxhYmVsLnBvc2l0aW9uLnggPSBCVVRUT05fV0lEVEggKiAwLjUgLSBidXR0b25MYWJlbC5sYXlvdXQud2lkdGggKiAwLjAwMDExICogMC41O1xyXG4gIGJ1dHRvbkxhYmVsLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAxLjI7XHJcbiAgYnV0dG9uTGFiZWwucG9zaXRpb24ueSA9IC0wLjAyNTtcclxuICBmaWxsZWRWb2x1bWUuYWRkKCBidXR0b25MYWJlbCApO1xyXG5cclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQlVUVE9OICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIGNvbnRyb2xsZXJJRCApO1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZWQnLCBoYW5kbGVPblJlbGVhc2UgKTtcclxuXHJcbiAgdXBkYXRlVmlldygpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0oKTtcclxuXHJcbiAgICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjE7XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25SZWxlYXNlKCl7XHJcbiAgICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcblxyXG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XHJcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9FTUlTU0lWRV9DT0xPUiApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuQlVUVE9OX0NPTE9SICk7XHJcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkVNSVNTSVZFX0NPTE9SICk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG5cclxuICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgIGRlc2NyaXB0b3JMYWJlbC51cGRhdGUoIHN0ciApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ2hlY2tib3goIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgaW5pdGlhbFZhbHVlID0gZmFsc2UsXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcbiAgY29uc3QgQ0hFQ0tCT1hfV0lEVEggPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IENIRUNLQk9YX0hFSUdIVCA9IENIRUNLQk9YX1dJRFRIO1xyXG4gIGNvbnN0IENIRUNLQk9YX0RFUFRIID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IElOQUNUSVZFX1NDQUxFID0gMC4wMDE7XHJcbiAgY29uc3QgQUNUSVZFX1NDQUxFID0gMC45O1xyXG5cclxuICBjb25zdCBzdGF0ZSA9IHtcclxuICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXHJcbiAgICBsaXN0ZW46IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XHJcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xyXG5cclxuICAvLyAgYmFzZSBjaGVja2JveFxyXG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIENIRUNLQk9YX1dJRFRILCBDSEVDS0JPWF9IRUlHSFQsIENIRUNLQk9YX0RFUFRIICk7XHJcbiAgcmVjdC50cmFuc2xhdGUoIENIRUNLQk9YX1dJRFRIICogMC41LCAwLCAwICk7XHJcblxyXG5cclxuICAvLyAgaGl0c2NhbiB2b2x1bWVcclxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcclxuICBoaXRzY2FuTWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdCBoaXRzY2FuVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgaGl0c2Nhbk1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XHJcblxyXG4gIC8vICBvdXRsaW5lIHZvbHVtZVxyXG4gIGNvbnN0IG91dGxpbmUgPSBuZXcgVEhSRUUuQm94SGVscGVyKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgb3V0bGluZS5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5PVVRMSU5FX0NPTE9SICk7XHJcblxyXG4gIC8vICBjaGVja2JveCB2b2x1bWVcclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiBDb2xvcnMuREVGQVVMVF9DT0xPUiwgZW1pc3NpdmU6IENvbG9ycy5FTUlTU0lWRV9DT0xPUiB9KTtcclxuICBjb25zdCBmaWxsZWRWb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBtYXRlcmlhbCApO1xyXG4gIGZpbGxlZFZvbHVtZS5zY2FsZS5zZXQoIEFDVElWRV9TQ0FMRSwgQUNUSVZFX1NDQUxFLEFDVElWRV9TQ0FMRSApO1xyXG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBmaWxsZWRWb2x1bWUgKTtcclxuXHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX0NIRUNLQk9YICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIG91dGxpbmUsIGNvbnRyb2xsZXJJRCApO1xyXG5cclxuICAvLyBncm91cC5hZGQoIGZpbGxlZFZvbHVtZSwgb3V0bGluZSwgaGl0c2NhblZvbHVtZSwgZGVzY3JpcHRvckxhYmVsICk7XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XHJcblxyXG4gIHVwZGF0ZVZpZXcoKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25QcmVzcyggcCApe1xyXG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0ZS52YWx1ZSA9ICFzdGF0ZS52YWx1ZTtcclxuXHJcbiAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gc3RhdGUudmFsdWU7XHJcblxyXG4gICAgaWYoIG9uQ2hhbmdlZENCICl7XHJcbiAgICAgIG9uQ2hhbmdlZENCKCBzdGF0ZS52YWx1ZSApO1xyXG4gICAgfVxyXG5cclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcclxuXHJcbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQ09MT1IgKTtcclxuICAgICAgbWF0ZXJpYWwuZW1pc3NpdmUuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0VNSVNTSVZFX0NPTE9SICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5FTUlTU0lWRV9DT0xPUiApO1xyXG5cclxuICAgICAgaWYoIHN0YXRlLnZhbHVlICl7XHJcbiAgICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9DT0xPUiApO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSU5BQ1RJVkVfQ09MT1IgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKCBzdGF0ZS52YWx1ZSApe1xyXG4gICAgICBmaWxsZWRWb2x1bWUuc2NhbGUuc2V0KCBBQ1RJVkVfU0NBTEUsIEFDVElWRV9TQ0FMRSwgQUNUSVZFX1NDQUxFICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBmaWxsZWRWb2x1bWUuc2NhbGUuc2V0KCBJTkFDVElWRV9TQ0FMRSwgSU5BQ1RJVkVfU0NBTEUsIElOQUNUSVZFX1NDQUxFICk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgbGV0IG9uQ2hhbmdlZENCO1xyXG4gIGxldCBvbkZpbmlzaENoYW5nZUNCO1xyXG5cclxuICBncm91cC5vbkNoYW5nZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xyXG4gICAgb25DaGFuZ2VkQ0IgPSBjYWxsYmFjaztcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xyXG4gIGdyb3VwLmhpdHNjYW4gPSBbIGhpdHNjYW5Wb2x1bWUsIHBhbmVsIF07XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlKCBzdHIgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpZiggc3RhdGUubGlzdGVuICl7XHJcbiAgICAgIHN0YXRlLnZhbHVlID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXTtcclxuICAgIH1cclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmV4cG9ydCBjb25zdCBERUZBVUxUX0NPTE9SID0gMHgyRkExRDY7XHJcbmV4cG9ydCBjb25zdCBISUdITElHSFRfQ09MT1IgPSAweDBGQzNGRjtcclxuZXhwb3J0IGNvbnN0IElOVEVSQUNUSU9OX0NPTE9SID0gMHgwN0FCRjc7XHJcbmV4cG9ydCBjb25zdCBFTUlTU0lWRV9DT0xPUiA9IDB4MjIyMjIyO1xyXG5leHBvcnQgY29uc3QgSElHSExJR0hUX0VNSVNTSVZFX0NPTE9SID0gMHg5OTk5OTk7XHJcbmV4cG9ydCBjb25zdCBPVVRMSU5FX0NPTE9SID0gMHg5OTk5OTk7XHJcbmV4cG9ydCBjb25zdCBERUZBVUxUX0JBQ0sgPSAweDFhMWExYVxyXG5leHBvcnQgY29uc3QgSElHSExJR0hUX0JBQ0sgPSAweDQ5NDk0OTtcclxuZXhwb3J0IGNvbnN0IElOQUNUSVZFX0NPTE9SID0gMHgxNjE4Mjk7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1NMSURFUiA9IDB4MmZhMWQ2O1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9DSEVDS0JPWCA9IDB4ODA2Nzg3O1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9CVVRUT04gPSAweGU2MWQ1ZjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfVEVYVCA9IDB4MWVkMzZmO1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9EUk9QRE9XTiA9IDB4ZmZmMDAwO1xyXG5leHBvcnQgY29uc3QgRFJPUERPV05fQkdfQ09MT1IgPSAweGZmZmZmZjtcclxuZXhwb3J0IGNvbnN0IERST1BET1dOX0ZHX0NPTE9SID0gMHgwMDAwMDA7XHJcbmV4cG9ydCBjb25zdCBCVVRUT05fQ09MT1IgPSAweGU2MWQ1ZjtcclxuZXhwb3J0IGNvbnN0IFNMSURFUl9CRyA9IDB4NDQ0NDQ0O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yaXplR2VvbWV0cnkoIGdlb21ldHJ5LCBjb2xvciApe1xyXG4gIGdlb21ldHJ5LmZhY2VzLmZvckVhY2goIGZ1bmN0aW9uKGZhY2Upe1xyXG4gICAgZmFjZS5jb2xvci5zZXRIZXgoY29sb3IpO1xyXG4gIH0pO1xyXG4gIGdlb21ldHJ5LmNvbG9yc05lZWRVcGRhdGUgPSB0cnVlO1xyXG4gIHJldHVybiBnZW9tZXRyeTtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCgge1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG9iamVjdCxcclxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcclxuICBpbml0aWFsVmFsdWUgPSBmYWxzZSxcclxuICBvcHRpb25zID0gW10sXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgb3BlbjogZmFsc2UsXHJcbiAgICBsaXN0ZW46IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgRFJPUERPV05fV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgRFJPUERPV05fSEVJR0hUID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBEUk9QRE9XTl9ERVBUSCA9IGRlcHRoO1xyXG4gIGNvbnN0IERST1BET1dOX09QVElPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOICogMS4yO1xyXG4gIGNvbnN0IERST1BET1dOX01BUkdJTiA9IExheW91dC5QQU5FTF9NQVJHSU4gKiAtMC40O1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcclxuICBncm91cC5hZGQoIHBhbmVsICk7XHJcblxyXG4gIGdyb3VwLmhpdHNjYW4gPSBbIHBhbmVsIF07XHJcblxyXG4gIGNvbnN0IGxhYmVsSW50ZXJhY3Rpb25zID0gW107XHJcbiAgY29uc3Qgb3B0aW9uTGFiZWxzID0gW107XHJcblxyXG4gIC8vICBmaW5kIGFjdHVhbGx5IHdoaWNoIGxhYmVsIGlzIHNlbGVjdGVkXHJcbiAgY29uc3QgaW5pdGlhbExhYmVsID0gZmluZExhYmVsRnJvbVByb3AoKTtcclxuXHJcblxyXG5cclxuICBmdW5jdGlvbiBmaW5kTGFiZWxGcm9tUHJvcCgpe1xyXG4gICAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xyXG4gICAgICByZXR1cm4gb3B0aW9ucy5maW5kKCBmdW5jdGlvbiggb3B0aW9uTmFtZSApe1xyXG4gICAgICAgIHJldHVybiBvcHRpb25OYW1lID09PSBvYmplY3RbIHByb3BlcnR5TmFtZSBdXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZpbmQoIGZ1bmN0aW9uKCBvcHRpb25OYW1lICl7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdFtwcm9wZXJ0eU5hbWVdID09PSBvcHRpb25zWyBvcHRpb25OYW1lIF07XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlT3B0aW9uKCBsYWJlbFRleHQsIGlzT3B0aW9uICl7XHJcbiAgICBjb25zdCBsYWJlbCA9IGNyZWF0ZVRleHRMYWJlbChcclxuICAgICAgdGV4dENyZWF0b3IsIGxhYmVsVGV4dCxcclxuICAgICAgRFJPUERPV05fV0lEVEgsIGRlcHRoLFxyXG4gICAgICBDb2xvcnMuRFJPUERPV05fRkdfQ09MT1IsIENvbG9ycy5EUk9QRE9XTl9CR19DT0xPUixcclxuICAgICAgMC44NjZcclxuICAgICk7XHJcbiAgICBncm91cC5oaXRzY2FuLnB1c2goIGxhYmVsLmJhY2sgKTtcclxuICAgIGNvbnN0IGxhYmVsSW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggbGFiZWwuYmFjayApO1xyXG4gICAgbGFiZWxJbnRlcmFjdGlvbnMucHVzaCggbGFiZWxJbnRlcmFjdGlvbiApO1xyXG4gICAgb3B0aW9uTGFiZWxzLnB1c2goIGxhYmVsICk7XHJcblxyXG5cclxuICAgIGlmKCBpc09wdGlvbiApe1xyXG4gICAgICBsYWJlbEludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGZ1bmN0aW9uKCBwICl7XHJcbiAgICAgICAgc2VsZWN0ZWRMYWJlbC5zZXRTdHJpbmcoIGxhYmVsVGV4dCApO1xyXG5cclxuICAgICAgICBsZXQgcHJvcGVydHlDaGFuZ2VkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmKCBBcnJheS5pc0FycmF5KCBvcHRpb25zICkgKXtcclxuICAgICAgICAgIHByb3BlcnR5Q2hhbmdlZCA9IG9iamVjdFsgcHJvcGVydHlOYW1lIF0gIT09IGxhYmVsVGV4dDtcclxuICAgICAgICAgIGlmKCBwcm9wZXJ0eUNoYW5nZWQgKXtcclxuICAgICAgICAgICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IGxhYmVsVGV4dDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIHByb3BlcnR5Q2hhbmdlZCA9IG9iamVjdFsgcHJvcGVydHlOYW1lIF0gIT09IG9wdGlvbnNbIGxhYmVsVGV4dCBdO1xyXG4gICAgICAgICAgaWYoIHByb3BlcnR5Q2hhbmdlZCApe1xyXG4gICAgICAgICAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gb3B0aW9uc1sgbGFiZWxUZXh0IF07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgY29sbGFwc2VPcHRpb25zKCk7XHJcbiAgICAgICAgc3RhdGUub3BlbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiggb25DaGFuZ2VkQ0IgJiYgcHJvcGVydHlDaGFuZ2VkICl7XHJcbiAgICAgICAgICBvbkNoYW5nZWRDQiggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcC5sb2NrZWQgPSB0cnVlO1xyXG5cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBsYWJlbEludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGZ1bmN0aW9uKCBwICl7XHJcbiAgICAgICAgaWYoIHN0YXRlLm9wZW4gPT09IGZhbHNlICl7XHJcbiAgICAgICAgICBvcGVuT3B0aW9ucygpO1xyXG4gICAgICAgICAgc3RhdGUub3BlbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBjb2xsYXBzZU9wdGlvbnMoKTtcclxuICAgICAgICAgIHN0YXRlLm9wZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBsYWJlbC5pc09wdGlvbiA9IGlzT3B0aW9uO1xyXG4gICAgcmV0dXJuIGxhYmVsO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29sbGFwc2VPcHRpb25zKCl7XHJcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGxhYmVsLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICBsYWJlbC5iYWNrLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvcGVuT3B0aW9ucygpe1xyXG4gICAgb3B0aW9uTGFiZWxzLmZvckVhY2goIGZ1bmN0aW9uKCBsYWJlbCApe1xyXG4gICAgICBpZiggbGFiZWwuaXNPcHRpb24gKXtcclxuICAgICAgICBsYWJlbC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBsYWJlbC5iYWNrLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vICBiYXNlIG9wdGlvblxyXG4gIGNvbnN0IHNlbGVjdGVkTGFiZWwgPSBjcmVhdGVPcHRpb24oIGluaXRpYWxMYWJlbCwgZmFsc2UgKTtcclxuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTUFSR0lOICogMC41ICsgd2lkdGggKiAwLjU7XHJcbiAgc2VsZWN0ZWRMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIHNlbGVjdGVkTGFiZWwuYWRkKChmdW5jdGlvbiBjcmVhdGVEb3duQXJyb3coKXtcclxuICAgIGNvbnN0IHcgPSAwLjAxNTtcclxuICAgIGNvbnN0IGggPSAwLjAzO1xyXG4gICAgY29uc3Qgc2ggPSBuZXcgVEhSRUUuU2hhcGUoKTtcclxuICAgIHNoLm1vdmVUbygwLDApO1xyXG4gICAgc2gubGluZVRvKC13LGgpO1xyXG4gICAgc2gubGluZVRvKHcsaCk7XHJcbiAgICBzaC5saW5lVG8oMCwwKTtcclxuXHJcbiAgICBjb25zdCBnZW8gPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeSggc2ggKTtcclxuICAgIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBnZW8sIENvbG9ycy5EUk9QRE9XTl9GR19DT0xPUiApO1xyXG4gICAgZ2VvLnRyYW5zbGF0ZSggRFJPUERPV05fV0lEVEggLSB3ICogNCwgLURST1BET1dOX0hFSUdIVCAqIDAuNSArIGggKiAwLjUgLCBkZXB0aCAqIDEuMDEgKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIGdlbywgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgfSkoKSk7XHJcblxyXG5cclxuICBmdW5jdGlvbiBjb25maWd1cmVMYWJlbFBvc2l0aW9uKCBsYWJlbCwgaW5kZXggKXtcclxuICAgIGxhYmVsLnBvc2l0aW9uLnkgPSAtRFJPUERPV05fTUFSR0lOIC0gKGluZGV4KzEpICogKCBEUk9QRE9XTl9PUFRJT05fSEVJR0hUICk7XHJcbiAgICBsYWJlbC5wb3NpdGlvbi56ID0gZGVwdGggKiAyNDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wdGlvblRvTGFiZWwoIG9wdGlvbk5hbWUsIGluZGV4ICl7XHJcbiAgICBjb25zdCBvcHRpb25MYWJlbCA9IGNyZWF0ZU9wdGlvbiggb3B0aW9uTmFtZSwgdHJ1ZSApO1xyXG4gICAgY29uZmlndXJlTGFiZWxQb3NpdGlvbiggb3B0aW9uTGFiZWwsIGluZGV4ICk7XHJcbiAgICByZXR1cm4gb3B0aW9uTGFiZWw7XHJcbiAgfVxyXG5cclxuICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XHJcbiAgICBzZWxlY3RlZExhYmVsLmFkZCggLi4ub3B0aW9ucy5tYXAoIG9wdGlvblRvTGFiZWwgKSApO1xyXG4gIH1cclxuICBlbHNle1xyXG4gICAgc2VsZWN0ZWRMYWJlbC5hZGQoIC4uLk9iamVjdC5rZXlzKG9wdGlvbnMpLm1hcCggb3B0aW9uVG9MYWJlbCApICk7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29sbGFwc2VPcHRpb25zKCk7XHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX0RST1BET1dOICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGNvbnRyb2xsZXJJRCwgc2VsZWN0ZWRMYWJlbCApO1xyXG5cclxuXHJcbiAgdXBkYXRlVmlldygpO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcblxyXG4gICAgbGFiZWxJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGludGVyYWN0aW9uLCBpbmRleCApe1xyXG4gICAgICBjb25zdCBsYWJlbCA9IG9wdGlvbkxhYmVsc1sgaW5kZXggXTtcclxuICAgICAgaWYoIGxhYmVsLmlzT3B0aW9uICl7XHJcbiAgICAgICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgICAgIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBsYWJlbC5iYWNrLmdlb21ldHJ5LCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGxldCBvbkNoYW5nZWRDQjtcclxuICBsZXQgb25GaW5pc2hDaGFuZ2VDQjtcclxuXHJcbiAgZ3JvdXAub25DaGFuZ2UgPSBmdW5jdGlvbiggY2FsbGJhY2sgKXtcclxuICAgIG9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAubGlzdGVuID0gZnVuY3Rpb24oKXtcclxuICAgIHN0YXRlLmxpc3RlbiA9IHRydWU7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgaWYoIHN0YXRlLmxpc3RlbiApe1xyXG4gICAgICBzZWxlY3RlZExhYmVsLnNldFN0cmluZyggZmluZExhYmVsRnJvbVByb3AoKSApO1xyXG4gICAgfVxyXG4gICAgbGFiZWxJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsSW50ZXJhY3Rpb24gKXtcclxuICAgICAgbGFiZWxJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgfSk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcbmltcG9ydCAqIGFzIFBhbGV0dGUgZnJvbSAnLi9wYWxldHRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUZvbGRlcih7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgbmFtZVxyXG59ID0ge30gKXtcclxuXHJcbiAgY29uc3Qgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEg7XHJcblxyXG4gIGNvbnN0IHNwYWNpbmdQZXJDb250cm9sbGVyID0gTGF5b3V0LlBBTkVMX0hFSUdIVCArIExheW91dC5QQU5FTF9TUEFDSU5HO1xyXG5cclxuICBjb25zdCBzdGF0ZSA9IHtcclxuICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICBwcmV2aW91c1BhcmVudDogdW5kZWZpbmVkXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBjb25zdCBjb2xsYXBzZUdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgZ3JvdXAuYWRkKCBjb2xsYXBzZUdyb3VwICk7XHJcblxyXG4gIC8vICBZZWFoLiBHcm9zcy5cclxuICBjb25zdCBhZGRPcmlnaW5hbCA9IFRIUkVFLkdyb3VwLnByb3RvdHlwZS5hZGQ7XHJcbiAgYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIGNvbGxhcHNlR3JvdXAgKTtcclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gY3JlYXRlVGV4dExhYmVsKCB0ZXh0Q3JlYXRvciwgJy0gJyArIG5hbWUsIDAuNiApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCAqIDAuNTtcclxuXHJcbiAgYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIGRlc2NyaXB0b3JMYWJlbCApO1xyXG5cclxuICAvLyBjb25zdCBwYW5lbCA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIHdpZHRoLCAxLCBMYXlvdXQuUEFORUxfREVQVEggKSwgU2hhcmVkTWF0ZXJpYWxzLkZPTERFUiApO1xyXG4gIC8vIHBhbmVsLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGggKiAwLjUsIDAsIC1MYXlvdXQuUEFORUxfREVQVEggKTtcclxuICAvLyBhZGRPcmlnaW5hbC5jYWxsKCBncm91cCwgcGFuZWwgKTtcclxuXHJcbiAgLy8gY29uc3QgaW50ZXJhY3Rpb25Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgMSwgTGF5b3V0LlBBTkVMX0RFUFRIICksIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6MHgwMDAwMDB9KSApO1xyXG4gIC8vIGludGVyYWN0aW9uVm9sdW1lLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGggKiAwLjUgLSBMYXlvdXQuUEFORUxfTUFSR0lOLCAwLCAtTGF5b3V0LlBBTkVMX0RFUFRIICk7XHJcbiAgLy8gYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIGludGVyYWN0aW9uVm9sdW1lICk7XHJcbiAgLy8gaW50ZXJhY3Rpb25Wb2x1bWUudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAvLyBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xyXG4gIC8vIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZVByZXNzICk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVByZXNzKCl7XHJcbiAgICBzdGF0ZS5jb2xsYXBzZWQgPSAhc3RhdGUuY29sbGFwc2VkO1xyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuYWRkID0gZnVuY3Rpb24oIC4uLmFyZ3MgKXtcclxuICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24oIG9iaiApe1xyXG4gICAgICBjb25zdCBjb250YWluZXIgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgICAgY29udGFpbmVyLmFkZCggb2JqICk7XHJcbiAgICAgIGNvbGxhcHNlR3JvdXAuYWRkKCBjb250YWluZXIgKTtcclxuICAgICAgb2JqLmZvbGRlciA9IGdyb3VwO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIHBlcmZvcm1MYXlvdXQoKXtcclxuICAgIGNvbGxhcHNlR3JvdXAuY2hpbGRyZW4uZm9yRWFjaCggZnVuY3Rpb24oIGNoaWxkLCBpbmRleCApe1xyXG4gICAgICBjaGlsZC5wb3NpdGlvbi55ID0gLShpbmRleCsxKSAqIHNwYWNpbmdQZXJDb250cm9sbGVyICsgTGF5b3V0LlBBTkVMX0hFSUdIVCAqIDAuNTtcclxuICAgICAgaWYoIHN0YXRlLmNvbGxhcHNlZCApe1xyXG4gICAgICAgIGNoaWxkLmNoaWxkcmVuWzBdLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgIGNoaWxkLmNoaWxkcmVuWzBdLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiggc3RhdGUuY29sbGFwc2VkICl7XHJcbiAgICAgIGRlc2NyaXB0b3JMYWJlbC5zZXRTdHJpbmcoICcrICcgKyBuYW1lICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBkZXNjcmlwdG9yTGFiZWwuc2V0U3RyaW5nKCAnLSAnICsgbmFtZSApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnN0IHRvdGFsSGVpZ2h0ID0gY29sbGFwc2VHcm91cC5jaGlsZHJlbi5sZW5ndGggKiBzcGFjaW5nUGVyQ29udHJvbGxlcjtcclxuICAgIC8vIHBhbmVsLmdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgdG90YWxIZWlnaHQsIExheW91dC5QQU5FTF9ERVBUSCApO1xyXG4gICAgLy8gcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCAqIDAuNSwgLXRvdGFsSGVpZ2h0ICogMC41LCAtTGF5b3V0LlBBTkVMX0RFUFRIICk7XHJcbiAgICAvLyBwYW5lbC5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZUxhYmVsKCl7XHJcbiAgICAvLyBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgLy8gICBkZXNjcmlwdG9yTGFiZWwuYmFjay5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQkFDSyApO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gZWxzZXtcclxuICAgICAgLy8gZGVzY3JpcHRvckxhYmVsLmJhY2subWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9CQUNLICk7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICBncm91cC5mb2xkZXIgPSBncm91cDtcclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWw6IGRlc2NyaXB0b3JMYWJlbC5iYWNrIH0gKTtcclxuICBjb25zdCBwYWxldHRlSW50ZXJhY3Rpb24gPSBQYWxldHRlLmNyZWF0ZSggeyBncm91cCwgcGFuZWw6IGRlc2NyaXB0b3JMYWJlbC5iYWNrIH0gKTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBwYWxldHRlSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHVwZGF0ZUxhYmVsKCk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgIGRlc2NyaXB0b3JMYWJlbC51cGRhdGUoIHN0ciApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLmhpdHNjYW4gPSBbIGRlc2NyaXB0b3JMYWJlbC5iYWNrIF07XHJcblxyXG4gIGdyb3VwLmJlaW5nTW92ZWQgPSBmYWxzZTtcclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbWFnZSgpe1xyXG4gIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgaW1hZ2Uuc3JjID0gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBZ0FBQUFJQUNBWUFBQUQwZU5UNkFBQ0FBRWxFUVZSNDJ1eTloM0ljeVpJbGV2ZloydTZPMk5sM1o2NFdmVnNydGlTYmJLcW0xZ0tDQktFSlJXaXROV0FBQ29wZzc4ejc0M2lGTys1VHAwNTVSR1pXWlZhQlRkQXNyQVdCaU16SUNJOFQ3c2VQLzhvNTkzbStmWk52UCtUYjVYeTdrVy8zOHUxeHZqWGtXMU8rdGVWYlo3NTFTK3ZLdDQ1OGE4NjNSdm5aNDMrMnlQOC8vcGtlYWNjLzI1NXZMK0JuNzhrNGwyWGM0L0dmNXRzejZhTmQrZ20xVnVueitCbnI4dTE1ek45dGw5ODlmcTk2ZU8vcitYWW4zeDdLc3pUS3o3VEkrMnUvbmRDd3YyWjVodU0rbitUYi9YeTduVzgvNWR2RmZQdHJ2djB0M3o3SXQ4L2tuYy9uMjlWOHU1VnZEMkFPWGtpZlZzTnhIc296eDVrN25LOUg4bnZYOHUzSGZQc3UzNzdJdHcvejdTLzU5c2Q4KzIyKy9WcWUvWGh1N3NydjZacG9sYkZ3UHRyaytaN0JISHlaYjkvTE9OYTdOa3MvTDJYZDlFbnJsYlhUSnVQVnlmTzN3OCs5a245MnkrKzN3VHA3S3VQY2tuRXZ5SHQrQ25OL0pZVzV2eVp6OUwyODY4ZnlyWCtYYi84bjMvN2hWL2svK1gvK2ozejczL24yYi9uMnA0eld3VS93UGY4aXozSW0zODdtMnlYNWp2ZmsyK2g2NlpSOTJwOXZnL2sySkcwQTVsYjNyNDZsNi9wNFRyOFZHL0pCaHZQNWZyNjlKKy8wdHd6bnJwSm5ydlE1cXJvbTgrMi9WWGxOWnZsdUg4aTYrS3VzbGVQLy9paWpkK0V4UHNwd3pqNDArcjROZHBodEp6YTBoOXIzTGZrR3gyZmUxNzhTdy9SMXZwMGpBNkVIZXJNY0htb2cyRGgweXMvVXl6ODc1ZjhmRzVKaGFRUHkrNTFpY0JnRVhKTHhuOHVFdkJUai95clErcVJQQlNFS1VycmdZQWo5TGhxMVMzVEExY01CMXlGOTlrQy8vZER3V1Y1S255M3kwZXZJV0g0c0gvUDRvUDBLalBJTk9TaWYwaHdnaU9yeEFLcDZXV2hSYzhmenhRdmluRHpUcDdLZzN4ZGord2ZQb3V1QVF4am5vbGVlb1JWQXdMZWVqY0hQck90ckpOOUdaZTMweXpodDBsK2J2TWVBL015WS9ITklmbGJYV2F2MGp5RGdpanlIQXBLTHNON0xuWHY5dmxlbGJ6d01qdzNxYjhUQS92ZDgrMGNCVkgrUXcreVRETllCZnMvM0RlTnhSNzZqZ3ZXWDh0MkdaQzRuODIxSy9qa2hjNnY3VjhlcWs3RnVDbkRXdGZOeFJ2UDVwY3pwSjdJMlA4MW9EOTJxOEprcmZZNXFyOG4vbVcvL1hNVTFlVEhEOWZHRnJIVzBzV2N5ZWhjZTQweUdjL2E1bk05blpmNjBiNzBNZFlqdEhJQ3plWWpzWWJ1Y1owOWw3cS9ySlVFQmdIWitEUTdCUnJnZDZJR09CbUpDREhTdkRQQk0vdGtyZ3gvLy9iVDg3Smo4dno0REJOd0ZSTmNpazlFdmZZOEYycWc4VXkvY2JydGxJa1ppL0s0YXRUYmpkc3NIM0lBOGp4NDQ0OUR3QUJxQUF4QnZyYnBvejRneC9sN20vRWNCQm5ka0xwN0plM1NCVVI0MkdocGtQZVNpNW83bnEwa081N3R3ay90T251K01MUENQQkZYN0Z0Mmc5SXR6TVN6UC9oSys4em53TFBIRzBIZlZaejVlTHpQNU5pdnJaMVRlU1lIbVMvbnZNZm01T2ZubkpLeXpWOUl2Z2dBRW0xOEpBcjRDd0theGpMblg3M3VmZ094WFlrai9Kb2IxMk1EK3IzejdGL0dxL0VYbTlndVo4elRYZ2U2bkMzSjdVTEJ6eWZpT25URDNrekxuQy9tMmxHK0wrVFl2MzJCTXZyWHVsK2ZHMnZsRzFrd1c4L205R1BxdllBOTlsOEVldWx2aE0xZjZITlZjay84bTYvRmY4KzMzVlZxVFdiM2JXVmtqMzhoN2Zpdi9mVTVhMnU5aWpYRXVvem5UeS9sRjZmdVd6QjllaG9iRS9rNVJHNU8rdStVNUd1UXN1aW5mNG9JQ2dBdlNPZC95OVBBZmxnTjlCZ3pFbkF3NklFYjVCUm5uWTJPeUxJWmtGZ0FEZWcwYTZJYmNMbjgvSWk4d0YyZ3pNSDRYR0xOUk1WcFJ2enNtei9yU2M3dnRoVnVtZ3BsWitmMTVhTnJmbER3UDMxcWI0TVowVnViNm9oeUk2QTZyaHdQdWxjekJwSXlMRFQ5c2x4eXlEVEhtanVlclJjYThMd0Rvc2p6WGVYbk9iK1R3K0FUbXgxcDBNekFucy9MTUNnSTZaVjM4Q09DU04wWS92T3VzckpmamRiTXFhMjFTeHRKRnJHTlB5Yyt1eWM4dndQZ2owcStDQUFXYjZscjdScjZEUHROVE9oQ2o1bjZRdkJLUEtaeWlyc21QeExBZUgvci9KTWIyajNRei95SGxkZkJBak9ORnVhbFlZSWUvNDZSOHYrTjVYTSszVFdsck1zZTRYM0R0NEZnYVFrcDdQcStJb2Y5UjN1T3NyTkVzOXRDRENwKzUwdWVvMXBwOFQ5YmhiK1NmZnlWWGMxWnI4bHBHNjBOdDF3VTVMQy9JbXRIMWtmYTcrTWJJWXM3VU0zOU45dThEQWQ5Tk1IOTYzaTVCMDMwN0t1ZENPOHpkUFFVQkNnQXV5Lzk0WU56eTlEWS9KeDJyZ1ZnMGpITTNHSlRqdjkrUXRpeS9QeUYvcjdkUWRpZDJpcEVaRjRPMEtrYklha3N5Z2NQZ1JobVFNUllDdjZkR2JRcWUzZmZlNHpMR3ZJeUh6N01PLzc0Q29HZ0tQQXpkZEdPNkpBZlFEVmtvdDhrZGhoNlVTWG1QWldxTDhrd2o4ck50Y3NCRnpSM1BWeXNzdER2eVBOZkZ0WFpKak96M2NvRHdwdTJuUmFmenNTSmo4N3JBOVZWUE4za0ZMQXZ5KzhmclpUdmZ0dVI5OFYwN1pER1B5dUkrL3ZrZCtmbDErZmw1Nlc4RVFFZ3pIVmpmaWxHOExnQ29IandvZ3hGelB3TmVpWmRHT0VWZGszb2pmbCtNN0w5SS9QV3ZnYmg4R3V0QW4rT3l1TXEvbHVmNUNiNWprL0VkbDJYT2QvTXRCLzljaDdHR2FheEhNTlpaT1dEU25NL2IwbTRTR0xpYTBSNTZXT0V6Vi9vYzFWaVRYd0NuNGsvaUVmaVlYTTFacmNuckdhMlBXN0llZnBLMWVJM1dSOXByeERmRzdRem1URDN6eWsyckI2NGIyL3gxMmNOYllwUG5aSCsvZ3ZPMkViaFpOeFVBS0RKN0lwM3I3V0JRT2xjRHNTbEdBWTN6TUxndjlBWTZJMysvTFlaa1UvNTdWdnJ6dVJPdEY5bzEybzR4UGk2bVJSblQrdDB0T2JRUUFEejIzRzd4Z051VWNkVTQ3b09SM0pHL1g0VVBPbXFndWh2eUlSK0k4WHdNWEFzTVllallLektITzNEUXJjcmZNYklMelowMVg2MndHQjdMNHJvdnozZERqTWFQWWhCQ20zWWQ1a1RYeFl5c0EzMituMmg5NmNZWWhzTi9WZDV2TDk4T3BFOSsxdzVBdkhQeVhYYmw1M1Y4OWh6MEV2cTlIUUFBM2VCZFdJSnZybTFkK3A2Q3c3Q0Q0bXZxbWp3cmg3eDZBWDVOdC85dndmTjJoOXlpbGF3RFBKUS9vM2U5SjBDMzJmTWRkK0htdndiajRWaHFUSjdEZkNybjRFeks4L2xZM3VlQnJKK2JRTlM5bjhFZWVsVGhNMWY2RGJOZWt6K0lwK2FNZ01QMzVaOW5aSjJncXptTE5Ya3pnL1dCYStTT2pISFhzTEZwcnBIUUdHbU9jeGM4ODNyNEt3bTZDOExUYVBQMVhFSUEwRThjUE9WbTNWTUFjRXNHYUtCWXNzWlpsK1JtdGlzR2VqTW1BTmlVbjkrVDMxL3l1Qk0xRkdBZFlzY3Y5TFA4VTF0Y0FJQy84enJmRGowQW9ONklMOC9DZStma2tEbVNmeDVJbndmUzUydDRyalZDZFgyd2FKVmNXUzhmNGJtMEYwWUlROGZla3pHMGI5d1FQUUVQZ003ZFVRQUFLSG55dWZSUko4OTNYOWJFTlRFY29VMjdCWE9UOHl6b0c5QkhNM2hyeG1XUjZ1R3Y4N29GWG9zWjhnRG9ITTJDeTNvYnZzdVdiTFJaV0djYWlsQ0RHRG9VQjhEanBiZmlmZmtHdW1FeC9OVnRoQm53eHZXcHVGeVBZNjUvRmtEd0pkeTAwRE9TeGpyUUdOOGxBd0JFR2QrYzlEMVBJTnE2VGZnQVFGcnpxWHZqbWRpSEp6SlA5OFE0MXNuN3BybUhIbGI0ekpWK3d5elg1SFdOKzRwbjd3d2MvdC9MLzlkTXFOc1pyY243OGgzclUxd2Z1a2Jxd1hZOU1XeHNXbXNrYW93MHhzRTF6NTc1ZGlCQmo4amNUUVVBd0JSeG81Q2cvVmdCd0Qxd0RYWkEzSDlhRE1HNmNmaXJTMy9RQ0FIZ0IxVVFZTGtUK3dqUlJSMWk2OUJDQUdDQmZuWVREbXNMQURUQzdYOFk0c3Y2M25qQWEzeFUrOTJDbjhFUE95L3pnRjZBSjVEMjFrWXBlaHlQWFpNNU93VER2RWpFdUplQTZKSUNnQzdnVG1DSzREUDVGcGh5dzRkM1hBK0F1clJ1U24vV1BDOEJXTU5OUHcrOEJZd0I5c0FhbTRGd3o0NThnejI0T1dBb0FtTnI3QlovWXF6OUNYbUdGUUE1dXY2WHdEV0pYSWM2NEZSb0t0N25jdFA2TGJqL05TNnYyUldQZ1VSYjdqcG9CazZIeHVYakFBRDJtSzNMKytsNzV4SUNBTDBCdmFod1BqRmx0MFhHcTZQKzA5eEQybjhsejF6cE44eHFUVDZDdU85VjRBU2NvZlRjbTBDR3JzdGdUVnFweXBXdWp3NUtQWTVLaHk3M1haS01VY2s0dk9aOW52a3hJenpOQUFBNWVKTkUwUDc3dDFFQThKRGNGb1B3UVZiRnVPTHRhbzVJZlIyQWV2Q0R6b0hiNHdEY2lmTUdlSWg3aTUwSHdobjIwVWxlaTNtNnlZUUF3SFBqZHFudmZRanZ2Z29FaXdVZ3JHMFFVTmlrbUhzdklEdGZxcDRWanowd2dKT0dGampsTGdrQUdKQjVHNURmd1RSRzFFZFFFT0NMSGM4QUVXOE5PQUQ4YmZXUWUwNXhmSnhuUHJ5bmpNd0ZYR05EaEs0UlJIQ0lpbU5yWnlBekFiMWZUSHlkcFBBRWJsNEVHQmhTd1J2NDl4SnovVURpLys4RjR2SStFbTNVT3VoR1JBOUV4L091b0hlZzVMSjdOTllBN1BNMUNIRnRRVGhtMHhQV1VUY2xBd0RNSHVxQjlaMWtQamw5RmJVZ2ZQMlh1NGU0LzByV1FLWGZNSXMxeVhIZld3UUNVSnREYjdZTnJwQzNudWFhREtVcWw3cysyQTVHcFVPWHMwYVNqbEhKT0x3bTJUTS9ZTmhlREU4ZndqamJ3TUdiQnhEd1g2RVVCUUNNTmtmQjlhK0dsVC9Fc0pIVzErSlpySXArOWcxRWgxNkF1SWZZT0tVV2RoQTYwdFMweVpnQWdBODJqQytqYTF2VG9pWWhIWEtXNXVrb0VEZEZWcWlWcW9ma3laeTBEV0ppWXh1R1VFcVN1WnVBUE85eFNHTjg1ZnlpTDQ4aGZwODAyK0FPb0ZoZkhQOE56RFBHcnJwZHNlQVVHbitNZitIMzJvbUlyV0dxRTJZbmNHNDhFaFQ1Z0Z6eHNHd3RZdHlIQkFENFVMYmk4bEhyZ0VtbVR5azk2cXhrY0NqWXVHcDhCLzJPMDJCTXRvblhncUJ1eUpOU2RBbFk1aFpJd3pVYk5aKzh4a2ZvVUlucVAra2VHakhjNXVXdWdVcS80UVZuaThpVTh6eXZLTzdMbWhoWEk4YnJBSUJWeVpyRThlS2tLc2Q1TjhzT1l1cHgxQmhKMTBqU01jYmcvSXNhWnpSaVRUNHg3QzU2NW5jZ3hIMEFJZTlEYWJ0MGNTK3l6UW9BNmdsaFRKRGI0b0RjdTZOR3JyZGxRRWVCRDRBSWFJMXVpbDBCVnFQdkZ0c3ZTRVlYZUpNcktNUzlNdmdBY1FFQWpyMUhOMHE5QlEyNmdtTGFPQnhrT1poMHkyM2FCdVMzU1VncjFEWUxYcGRWOERqTUdqODdCMnozdnBoeng1NlJCWEMxVDdwUzBSZE5ZYnhEcVNkSnN3MHNEd0tURlVNY2dpWTVjTmk5akNrd3EvTDdid0w5NkFHdFlpZW9UNERxZUppaU9Bb2JqcjhMaHpwQ0FFQUpnSitEV3g0QmdIVXJ0OVlCNXVTM1U1b3BNcjYvRmI2Qno5dUIrMTNmY1FGU01GY2hzNFVCdjdxV1VWUkV4V1k0RkRqclNjVzE1dFA2dVdseS9jYnBmejVtMzFiLzFockFHMWRvRFZUNkRhOUFySnhGWlByZ2NqTVJzU1luQ05TekpnWUt6U1Faei9jK2NjZUxjM2tZaTNnM3kyYml6VGJPR0JNUjcxTHBHR3FibzlhQWIvM2ltcXlEaXlOZmVIYm94cjhKVFQxNFJ4Ukt3WXlEZGdVQXoraHdRcmZxQWNRR0xmY3U1aFppam5jM3BUK3NBMk43eTNDUnQ1Y1J4MjZIbXlHcTkzV2xBQUQ0UnJrQ0MyRmNKbkdJWE5sYkVXa1lmR2l0ME9HNUFndE8yd3lBS1B4WjlVaU1BOUV0YXU2V0lXVnZFMUlaVitRYnpiaFMwWmRuTVEvd1VMWkIxTzliUU1VNldPOUNIbnU3RVVxSUN3QStnSVA0UEtVcE5sQW9iTkpJSy9XRnNUQi85eElBQU0wRStBalMveW9aazdVY1VFc0RjNzcxUGRuYmdUSEZjc1pzQlBlL0FvNnZ4YnRoa1lIWEttZ0xOSDdXL2Z1SWtvdUIzeDBFbmtuYzM5SHhNSzN0T2dEUjV3UkNMQzJXVlFEZyt1L0xzSmN0VFF3VXhxcjJlRkdYaDBVSS9VM0h0SU5JK0gyVllJd3BvLy94bE1iQWZlTWJaeXl3Zm5HTk5OQjVhdkdtZHVEeXRTaHRCWDdtTlhsWC8rdk1VQUJnaVFwZ2JIYkhjQzlacVNiM1hhbklBL2VITGxwMDliNHNrOG5lQ0dsc1BsZHFFZzdBR0REVGN6TDJMc1JTRmx5cCtNODBiSktRRUVPSFowNTJZWXhGdUkyUEVpREp3Yyt1SlFRQWEwRHF3dXlJWFVHTGx1aUxra1dTSHVEOGplNVgrUHVZRjFzcEFIZ3N1YzlZRDBEZDQxYVlBejFZdTVBcVp3RllURFhrZy9GZEdkUDNYWGJMYUtnM01rZ0FJS3Yrb3pKZVFyOWJ6dTgwZ3plRlpacFJLRXVaM3N1UTc0MXB5UnEyMlhLMkpnWWV5aGlicitaNG9jc0QyK1Zoc0lHamdlL05GNjI0WTNEL0l4V01zVVoybkwzbFBJNTFNZDZGaS9ZQ3JCRW1Uays3UW9yOUlmQ21GaUU4UFVYOFBlV21jZDlkQ2dBNEpZTnY3SnYwY2RBd1B3TFhJeXVOc1VjQjJaMTQyQTBSa2ErY3crRmVCUUFBWll4SFlKSVJRZTNDWWtlRzVUeUFnU2dweHBDWHhRbzFEQmxwalJZZ2l4TUMySUVZMFM2a01SNFo1SlFwTXZpVkFnQXMrbE5MQUtDRXFBK0JCM0FSR1BMc2l1Znd6bEVBd1BwYzQ1b0o4SzZNR2ZvdXJ5RmRNMDVMQWdEUzZqOEtBQndHZnJlYzMwRUFZTWswWTh4L0ZiSTFEaUR6Q05PUkxVME1GTVppZG40MXgvUHRmY3N1OTdwQ1VURGY5NDRMQUh4ajlKVTVCc2ZqbVFPV016S1JkSXgrOGdCdkU5RjhtUzVoUGx1M0E1ZFRmTDVCSThQcXdIT09keXNBWUluVmtQdC9BRDRxcGoxcG9ZSUhMaXdhd3g4RGpYMnRBSUNWQVRFSEtTbjdzaGdPZ0JDNTdRcWlLUW9HT08rU2l6RllQQXVPZ2ErQm00WnZab2RFcEVSQUZxV2hzRWNBWmgxdUo0ZmdTbUkzMGNzVUFBREdGbnN5QmdCSEJwa1FDVkd0a0lwM3poWGtPMUgwaE9XR04yRXVmdzZrR2lJNVRua0F5bzUvVjhac2p6Q21td25hUmtJQWtFYi90UVFBbGlEWkpOem10dUVTc0FjMzhFMjRvZStDbmRoMnhjSllsaGVubXVNbE9aeVZqTnllSVFBb2R3eTA0Nmhsc2dPZ3lPTE1zZmlaWmZzNWt5TXVBSmlIbEdrbWJYcEY4QlFBV0s3QUhTTjJnSk9zeFdRMHhlT0M4OHVOamh2TStuSnVzVmtCQU02QVFKYmxOdHlXZFNFZHdhSkhNTEJLYm5TT3BUY1o2WVlyNUtaQm8yU0ZJNWhFT1JBUlB2a1pRTU1LRVA4V3dMMm5mZTk3UERPVkFnQ09MWTZTcDhtWHZ0ZGpIRGFvSjhBZUd3c1ZjNWJEOFZ5aEV0ODFJKzhhQ2F3cjVHNnppS0dZemZLYzlnWEtBcjhMWThZeHBvc0oyaXlGcExMdXY1WUF3Q2UzalFJNXI0Rk5qbW5KbUF2TzZjc3J4bnMyMTJDOHBJZHpTeFVBUURsaldHcW1lTmkrTWR6NVF6VEhtT3E0N3dFTW5XVHJoc25XNFpuQkJOQW9Ea1FSQUFqRnY2TlNxckMrOEpVWU9kODU0N1k3bG9ESWxnVUFhSEdsK2dmSTZ0OEQ1THNOY1hRR0F6dmdScmRpNlkyRXRxY0NPZXd6NURsUmc3enRNY2hSYzdjS3VhRGpRUEN4aEhoWWc3OVNBTkJCckZsbHZtSjJpT1haMEcrRDVEb2t6ZlY0UWt6WUYxWUwxQnNKS3ZGWlhpdkxRNk56ZzhCNHplTVpZMEdlNzkraE1lTWEwOG1ZYlF4dVErMVY2TCtXQUtEQmxZbzA0VTN4RFhDRmxFMCtSYVMyUmJCZHJ5bmNpaDdEdGhxTTkwc0JBRDdsMkpCTGY5UUFDM3VlUGNiRTR0YkFtZkVhUWc3TFJrZzZXQWhQQVlDUEFmL2FNT29zcW5JVEdNK1hZOTdTVVBRbEtaTTlDd0RRYXBBcytEQlJONyt5TmplSVZLZEF3QmRMYnpOU09oaHNNRER5SFd5THh2TW5UYUZrc09OTHhYdVZBZ0N3VXFQV0lMNFlkZEJndk5tcVM0Q0hXSTV1TFd1VUE5c3ZoRFdmRXArUG83RVBydU45QTdDd2xDZUs1UHp3RG8yWnhKZ094bWdhUmxNaHFLejdyeVVBOEhHUnRveERSZXVxREFOcGJzeUlTYittTENZa2NWZDd2RjhLQVBBcGQxcmdDYjBBVnJoZzMwalJRMjBjS3cwUSs4QjhmeXNramJvNVk1VHEzZVlEQUw1SnN5ckpJZnEvNkxtbFdSdGkzK0FXMUFvQStFSWdIR1BSV3ZWekJBWTJ3VnR3U0Y2VE1jb3hacy9JRExFNmthM0o4WjRjeFh1d0ZIUFN1WHVWWU1GWENnQ3M3NUVEcndZS1pFeEh1SnJ4V2RpTmpiVWIxSE9UTTRDbXBzVmREN2hlNXp4enorRFkrczZhSGFNMXZYOThoOFpNNjRCV2RiUnVJSEEyVktIL1dnSUF6c2F5c3BIV1hYSEZ6VjRac3lkQTZOejEySTFxai9kTEFRQllKMEc5QUpibURRTW9CRXQ3dExkS1JIcGNRY0h4dVFIYUZ5SDdBTW5jbXRXMUFhbUJxQmt6Z0d0ZUFjQkx3eDI0NzJNT3V0SmE4aW9FRXFmb0NKUFpjRVBVR2dDRUNHVnEvRVpjUVdWUWhYV1dpTkRoSTA0KzlPUjFxa3RvbnhZTnUyWjkxZmFlbHpGM1ZsbmRveW9DZ0FQZ0hhRGkzQ1M1RFo5UnpybDFrMFh5MGdwNEZvNElhQ29Bc0lSeGZOb1ZIQXRIc0lZSW4vUEJGU0NyaCt4ZEdUTXRGLzJFc3l0cVp0MS9MUUhBQzQ4dDNnMmtZM2ZTSVRiaXVWUllZMWQ3dkY4S0FMZ1RRYUJjTTBEVWduSDczNk9MajFYeDhDRjVQRm1jak5PN1h4TS9iUk9JbVNndzlIZnZxZ0lBbjRHT3MyakxCUUFISndnQVJCSEs5QVBPUU54d3hCV3FNZkVHOE0wYnE3NzFleEIwRGdnMzZKcTFDSHJxalVrNmR6MEdxYVJhQUFEREoweUNpYnBsc3A0OXgrQzJBRWpsSVBNQkFZRHE4TitKOE1wc1VhN3RBckhsRDRpNHlGcjVYQjN3WFJnekxaTGVnbWVzclB1dkpRRHcyUzc4QnBZM3R0SFpZakZiaGgxSHUxZnQ4WDRwQU9DR0o0VVM5eFR6cWxZOGZDc21UTExBVjUzWXdEYklva0wxem5ueVJHTm14bXZJemxpenNqTXNBTEJRSlEvQVNRSUFJVUxaQVV3Z3gxWTByaE4zczkraDI2c2x3bklBaG5qRklHTnhpcDZXdVMzSEF4QUtlYVFKQVBpZ1hqUXlFS3hiWnBkQk5udmdJUzh4c1liVnNmQVdjOUdWbGlpTzRtV29teTdFMmVEdmdpRDVYUmt6clRROVh3WENyUHMvaVFEZ0lHTE0rakx0WHJYSCs2VUFBTlM4OFJYUlEyTGtMcVJmOC8relVpWTE3SGtYdkF6ZDhsN0t2eGltQ3loWEJkd0NXM2pnQVJ1ZFNUa0FJUUR3bmNFQmlBb0JzREpSTGJNQVFvUXl2RTFxT2d5Q2dYbm5yMnFIc3A5UjBxL3FpbFgwclhIWU9EZXdjamdBSFBkNzQrenlyNVVDQUNUTGpBR1hnb1VxK05zdzMrUW11Ykl0NHVhaDRWcWJncGh3TjJTclBDSTNubFdpbU9mZTBtV3dXTStzWC9DdWpKbUdVTTl1bVFBZ2pmNXJDUUJhQXJkcVU4a05mcitTN0tkcWpmZExBUUFYaVZmVDVFcUxhMW0zZld1dldlbVM5V0R2bW9sbk1DWDlZeHVIaStpc2ZMTVZTRXM4Y2g1Tmo3UklnRm9ON0ZJQ0k3MS9ncklBTEVJWlZuRTZBSmIvSG9HQk5ZakQ3SHRJZ1BwdTF4S1NzWFRCN0JtYmtXT3dTYk1BTE9hcUwrMnpVZ0NneFh0NllHeldBWGp0eWhNQ2l1UEZZRkdtYThZNytXU3cyVE9SSkRXekNaRDh1ekpteUpqcTRSdW5sUU1BMHVqL0pBS0FrTDFzeWdBQVpEWGVMd1VBYU1xN3I3ald1Q2Zlajk0MFBveVI4NFFsbEMzQnJtVm9TNVJtcUJVeFo0MVFSSW40WHBJMHdEaVZ6eTZYWWFSUEFnQmdOODRZNWJnaXllSVFHSmRLdE5pRi85NXh4WUlMNk5yaEc1bVZqb1ZoQUt5SjdaTmsxZmg0MU55dEFCdFVkUUJtUGF4VlZtaXNGQUEwUUFyWFMxZDlLV0FsdmJUSmM5dzB2RlNEcmxRR214bndtRnU3Nm1FOVc4VjZIcnhEWThZeHBuRWFGMkNKR3dLb3RQK1REZ0NzWWtKWkFvQTB4L3VsQUlEdndRdWd0akVrRHJRbmZSMDV2MG9nU214aldlOVdEMTlMRzRNMHZHRE5HNWU3WlFzQStFcXIra3EwNm1aQjhvL21HMk94a2JqOVJuMjhhdFFDMEZoMUw3aXFMWklGQ3dHOWthWjlyMUk2RzdwMmZJSXNsbEUrb2x6Y2tsS094SkNQcXdTbzlRdFVDZENuWG9WeCtFb0J3Q05YcU5aWTYySkFkUVlYdzhxRFp2MXNicjZmc3dyblBIcUh4b3hyVEtNYWwyQnRTMEFDcktUL2t3UUFraEN5MHdBQVdZLzNTd0VBWDVNWEFPMTVTQnpJVW5KRjBSK3J5bVpVS2owVHd3ZWtUMTlWV3hNQVdDeDRUQUh5NVo0L3BVd0FpNlU5WUR5TVQzR3VWZ0JBNHl5dndJMmlEVWtXaXdZWTBOdi9HdytiSFcvclZ3UUFXRzdaVWNNdCszUGdVR2FGdkRpMUFEUS9kTjBWMXdKNDdZbEw2WVo2VUNFQXFCUkFwQWtBSGtWa1l5QkkxZThaYXZ2T3pwVm5MODI3TW1ZU1l4clZobDFwUVptcyt6L0pXUUNiSGdLemoyL2xPOHpqWmdHa1BkNHZCUUJvZ1MwdXNXMmxKdnZPSDUvb0Q5YldPUnNBYVJhWFlCTENkek9VWG01S3JXTXhJTi9IM1BkOFRLc2dpRVZ5c3lyYStXUmZhNTBHT0F6eEU1WlBIQWZ5Mmp3eDJiRmcwSzZIUE5NaTg2TkZQK3BjYWFsSEptWWR1ZmdpTEVtcUFlNjc0bXFBVmlFUGpFdlZpVWVuSlNNQXNFZS9QMk1RSFo4QUVLa1VBRHgwL29JNEd3Q2MxQXNUYWtjdWZ1R2NkMkhNcE1ZMDFIcmxjTmFTc2srcjBQOUowUUhnL2NFY0REdzhtbDFZMFMrT0RrQTF4b3M2bkgwRTRqUUJRQnBqZk9JS1JiYnczQ3MzTzhKMysvL0cyVm9OckRPdzRZcXIwK0pGbFJVSHpWb0FYQTQ0SkVBVEloekZxVFYrNklrbHZxd0FBRHlWY1J2Sy9BQWNxbGloZUNFaXRsRUNBd3VRZjM0UWtUOTdYK2FyVVQ2c0xyNHU0d1B2Qmx5dWxneHIxTndobDJIUEZjb0M1NXkvbEtmZTdEUVB0VXZHVC9xTk5BKzl5U0ErcmtFSXdoZHVhZ0gzdlZZV1pBV3p0UVFBNElrckxRQmxpWm5zeEd6N1JteVBoWnJlbFRHVEd0T2VpTllOaDNRMStqOEpTb0Q5TGx3SURGWGplcVNmN3NEdlJTa0JWbXM4SDllTXdiL0d4YnVOY2RZU0FvQXN4dmpBL1dmcGF5eTBWV2tXV2ozZC9yV1dSMGk3ZzB2VmI0bzkzblRGT2l0V3BkZS9meE1GQUZGVjZuSUI4by9lTkc0VEN2TFZHcStrb0EwZkxwMndjUnRsM0k0S0FRQSs2NjV4bVBUTGV3M0pmMDhtWUxNL0JyNUJweXZrNC9kNVBBQ1dvaUNUcmxTS09jN2NLU3BjaDZiNkJ2UEVXK2dDZ0lWNXFNT3V1TnBVSEFCd093RXZoT05qZldTZzlWbjZQSmtNcnlNOENZK2N2eUFPZzVFMVl0eGFiYzN6L0dqNG10K2hNWk1jME1NeG1sWng3Q3JqdGxaTy95ZTFGZ0FYdVpxR0RKZEJzRWRXc1prZEQ3Q3U5bmdkRWFCZDE5U2tQTThRalJPVnNmU3FTbU84bDIrZnlnMDlDd0NndWpxZk9iL09nRjQ2OTJCOXNYZjN0U3N0VWxmRTNWRUFFRldsTGs3QkFsUXRzdGlRbU5LMjZja25UZ0lBQm1uamFybkpQamlnMDVBQ1ZxT3lBUG5rb3pJSFk3Um9vZzdDZXVJYjZNTFRBNVU1QUw0RmpwNFhMY1VjWis2MGpzRThOQlUxbXBCMzZvZXd5SE5YTERLazZsT3pRSkNNQTN4dVVTNTZyN01Ga0hDZGFXbkxZVUQydWhGVUNjdVh5YkFaU0YxOVNNOWhGY1JocjlkMG9FVlZOTVQwbm5kaHpMZ0g5SFRNTmtrZXFhejdQeW5WQUFjOTREWUhXVWFhc1RFSmNkOEY1eTgydzhXY3FqMWVTRDRZU3dselJUc2N4NnEyeDRUVXJNZW9KZ0JnblFFTlV5c0kyQUJpT3ViODUrU2JiTUwzdzBxQWYxK3ZDZ0NpS2c2aHNocXpGOXNBQkRUQkRjMVh1Y2gwUmJoa0JXMm1hT08rSk5BeEFSKzJYQ2xnZHVtcmkzeFdKbkxHRlVRWGROR0VVdWxhamRTL1NlaG56aFdLMmV4RmJLUkdWMXlLK1Z5Q3VSdHpCZUVJclJJMUFyZnRMdnFtRDF5cGRyd0tJV0hvdzVwYmZlOGJBVzZJWlhEV3BSK3VEWUN1TU16UTJIRGhxb0tzS0dqVlFQZHBkRThHYm84Kzd3TlhRdXQ4aDhhTWMwQXZKMmpNcGNtNi8xb0NnS2VlYjhiN1RHOTBtZ2UrU0hIZmJmcFp0YmU4SDZvOVhtanZJeGwxRGNaYWduSFE3UjFpMDJjOVJqVUJnS29OdGhCUmZkSVZxNnF1d1ZyVHMzb1Y3S2phL2tFNFI1NHJBQWhWSEZMamltVngxWFUvUUxmRk5ycWhjZldqWFdlWHlrMVMwRVkvR0pPUUdMeGdLbFBjZEJoR3dUbFhyS2U4THBPNklzK2lzb3ZicnJRMnM4WGFaeExjblBTbDVYRTNYSEU1MjZpRFROMy8zN25rUWtEYVhvbEI3WVo0KzNNNC9HOTVqSnJHaGZjQWRWcTFDbHFjTFlCa2FXY3I1eVFIYVlzWUpyTGllMXZ3ZTFpN1BNUlhpVElTbHU0Q3g0N2pDdW9NZ3BmcVhSZ3pkRUR2SmVBYjdDVDAxcVhWZnkwQkFDczI0bmZEeW0rNjF2V0d0MGx4M3dQbkwwMk8rNkhhNDFuMU81WmRjWFU4MVZiWmhneVViUm9udE0rck1VWTFBY0E5eURCb05iTFZVRlVWQWNBeWVHelV1NnNjRHExK1dhY0FnUFBTclR6R0EvckFuT2R1VlN0YWdCaU1MMFVPNDVWUmh4aW1KYkdyMlpwMC9QblFCN0FPcFNVQVAxaHpPUWNHSkdmOC9TWXRHbVR0KzFqd09WZGN6V2t2SXVTQzduOWxpNWJEbitpRVc1c0NsRVpnM04rV01YeEdEZFVSdDF5cDFyUjZkaXp0N0I2SWFjM0JUWDRINGxZaEFJRHh2VDI0cFN5NVF1M3lBV0xaYXNaS0tBd1IwbDFvbGRaR0lTNmZwREgrL3JzeXB1K0FQaXlqSlFFQWFmVmZTd0RnS3pDRGxkKzI0U0JqNmVORFQ5eDNodllrVmo2czVuZ01ObkR2YjdwaWZSV3I3Y2ZZNTlVWW81b0E0Q2FReDFtdnB0OVlhN3VHdlI4ZzcrNExHZStoQW9DNzVBWG9NVnkrTytSZVdEVGlmMWE5NG0wZy9xMDZmOG5YS0QzNzE4Um9qQU1BRGlpTkthNFNvTWJqdGN6dkRyRHllY0Vjd0tUcm9wbHp0c2hEVTBTYXlnRXdPcGNOTjFxTGtYcDU3UDQvRStqM0lCQ2JWMUR5VFBwOTZncDU4amZsOEwvb1NSSGRBbEMyNFlyTCtiSkFqS3Btb2NIQm1OWUV1TE5XcFQ4ci9JSHhQUXpWcUdkbUVUYXMxaTdIMHBxaGdqVUlGbjBlbkVZZ20xckVPdXpEeWtJNEhUTjVpd01BMHV3L0NnQnNBZU02TGdBSS9RNENBTTJpYWpUNEx0TmdpN0hxR3hLLzhKYStTb2Z4SU5uYkp6VVlEOEVHN24zMTJMTFlXZzR1WE52R09MalAyeUZzbWZVWTVRQ0EwSm9MQVlBckJnaFFzbTAzcGZaYW1XdkRFRDVGNys3eEdYSkhBUURtTWI0QU44TUlkYjRUT0ZDc2pZay92eFpJTTFNQkJPc1E4N252NGdDQXVHNi9PaUJhcUlqRE9CMUs2OGFIeE5RTFBvQ0dEYUtrRHdCd1g4dmcrdWQrTVBkZml6Qjk0ZWtYM1hVK2lkNG5jdWcva0g1dnlTSzhMSXY3ZXpvRTVpQm10Z3o1cDZpc3h1SXE1OGtMb09TalRtRHpxL0xpblBTMzVBRkF6SVpkQW03R0ZEQ1ZleUZudWQ0VkY4aGhzTHJnU2hYd2ZMb0x2dFM2UmZyOUJTTjE4M1RNNUcyZUFFclcvZDgzOHJseHJXR2JNN0lna3Y0T3lubmZnRkNaRlZLZGd2MjM0c25vV1lWeHB1VDNCc0ZHbytCTXRjZkRlRFllME9QQTZWbUM4Q28ycnNTcUlJUDNlVFhHWUFEd2t5dG9uYnlJQ0VkYmE2NDVBQUF1QUFoUURabDZJOVNoQkcvV3J1SExJM3AzcnlrQStNa1Z5NGEyR3U1OHZORnZlY2hwRnR0NEd6d0duR2JXNG9vRkVEcU4ySTJ2c1FlQ3hSS1NFSCswb0VNemdRQ05zY3k2Z3NBQ2Ywd1ZYN0FPb0U3cFUyL3R6MTFwMGFFRnc2RE8wT0hQL2VoQmRpeEhlU3hJOFltblg2eC9QbS9FNWh0Z01kd1VVSEZGYnV3L3lDSThRN2QxMVVCQUp2V1VLMVZXYXdYUERtdG5QNlpOcWpXdXRmOUppRjB4QUdMUGdSSkN4NERmMEFNYnRzRVZaSEVWTkhHNGFoSklvOXJHRFM4Vml3aXBzUnd6Zm4vU1dPdW5ZeVp2dkFheTd2K3VoM2s5RWZoZHZCMG0vUjJVVkVkcFdTWlY5OVArc3pKNjBBNk53MzdvaHJodlBhUnRWM3U4ZThiZTc1VzFOUUx6cGNSb2JOUEdPTlkrcjhZWWYzVUZNU0JMQXQ5SFNKOEsyTFdubE5YMWpZQ003d0FFM0tCenVnMXM1NmdyVnJrY0pmQ0NvZVAvOHU0cUFGQ04rdnNCTktob2V3VnU4K3c2dE55RnEzQkxzSWlEVDhnMTJ3dXhtMUQ2emhSeEVEaE5Ja25xejEyNG1Tb0k2SUZOb0pMQWt4NERPQkU0Z0JybGc5MTFkdEdoU1dOeGpNb2M5RUVNRGZ2aDIvK0hubjZ4Y1VvZHlzVmVrelh3b3l6bzR3UDdhK243WTBpeDdJVVVTODZsN25lbHltcjZiYjkyQmRXc0c3Ukp0VWhRRjhXMWhpQjIxUWx6cVd6WVBzaEhIcVR4TmM2bEcvYXVySzlMOGh6UFhXbU5iVzREc0huUVM0VWxRTnRkY1lWRGJ2MGVrdXk3UG1hU05rajdJT3YrYnhuTWExeHJRMldzejlEdllPR21IOFV3MzZhMGFvejdvZ2JKdU5GR0llNkwrNkVKRG1NRXc5VWNqL2MrNnJaZyt2WUlwRWVQd2hpNFhyczgrN3dhWS93NTN6NlN5NUVXd1dNMVFFNUpENjA1SzZ2cks3RzlYNHFkUCs4SzFYWWZRS2hEUXdGOXJsamxzby9PSWZhQ0hvT0tzd29BMUVYclE0TURnTGJuWExGb0RMb09yVFF0ZEEwTkdLbUQ5K1dscnRERURicG9BUTgwUEpnbU1lU1NpWDljSnhEd1F2cDhDVXpvZ1lBUkdYQUYxVEUrZ0I3TGdyemhpblVTZkFZVisrcDBCUlc4SjlEUFpWZ2tuNGhMaXZzZHBEYmdXWFFxUGFrMy9xL2s0UDlVZ01WN3NKRzBtbCszczlYVTJ1WG45SG4xMjZwcTFua0NBU3JLb3pMRDJIKzNmQjhFVWhvRGE0Rk5yVC9YU2VQWDBlRi9XZDd4RzFyZm5UQWVObnlmQnBnckxRRmFUK3ZFNnFQVGt5YjdybytacEhXNVVqWElMUHUvVHN4clhtdmRaYXpQME84OGhnUHlySGpLOUZCRzZXdmNmeW9nMW0rMFZ4QVNiYWQ1dzhQNFVnM0c0d3VBRmdqVCtkTDExZXNLQW1uYWVtbTlZanliOTNuV1kvd3gzOTRIdTZZMUFlNTRnRWZVbXNOTHNLb0EvdjFpOTZ0cS9IR0Z3Z1pYRFRTb0lPQVZ1SVRHNlVCdjlSQkp4ZzNYRU9lWTM1SnhMd0NDN2pBT0dhc2gybndHTHArbzMrMTJ4ZXB5bHdrRTFNRW1VRVB6TW1CRVhvSVJ0QTRnUGJRZndvTDBHVEE5ekZyRjhEYlNZWHBaRHRKdlpRRitJSWlVKysyaTlqTEdvdnRTQU1YeHdmODM2ZmYzdnpyOWMvcm45TS9wbjlNL3Y4dy80c3I0M3VNU2VtNmtIdlJEN25nYnhEQllxclhmY0EyamNxQ21tUjJQKy8zcGx6ajljL3JuOU0vcG45TS9wMytxQ3dEZWczZ0R1bXF2ZzJ2b01iaHJzWkJOSjl5UThiYlpLVGRPZGFXOGdKdnhZN25SM29KVXM3UGlmbGIzeXFjQVRDNFNNQW01SmZFR3JWSzI3R240VHQ3MVkzbjN1SzR3akxWWVlqbzloaXVjeDgvNm5kTHN0OXJmb2hyamZDWmhnUE5FZ25ycWNkK2k1NmdMWW9tdmpPK080Nk4zcFpyalZmdjlia0o2SnhhTjB2am5JSVcxTUtTR29TbkxPL2lkd1lKR0R4M2FvUTdTdGxEdGVmWEtOVUdxNndOeDF5b3ZSRU5ERHlra3BmSzEydHJJTFd3Vjl2TDlmTDJzUHlURUlnT2ZMMWs2Ti8zZ21yYm0xQ0xjSVVrNDYzSFM3TGZhYzFPTnNmNHAzLzQxMy83a1Nvc0lzWDJMcys3cUtSMndEZFk2TnZVZ044UUJBTmJoZjhQakV2Y2RoZ01VYjlhRHNaZmloQy9vWUx4TklPQTljVVA3dkJMMVFINnc0dWhjSTBBTkZuSU4xSVgraFpBNTRubytsRHhpeWVtT2VzaHdmQ0JsL1U1cDlsdnRiL0ZWRmNaUjRzNGxJdzJxRlFoY0Z0bHhBTmpFeUxZZGRxVUZsTkRZVkhPOGFyOGZzNUs3b1k5eElzbnF0eG9GVXUxRWdCeDh3Y2lEYmdRZzJBbngzQkFvNzZJODZIb1BQNlRlSUtWeWpMaUx3bzVXWVMvK2VUMFl2Z2JXT0F0amRSSHpudWNOdzZvNGI1eHloK0RzeHlxTWsyYS8xWjZiYW96MUwvbjJXOGtjK05qNXl3akhXWGZ0Y0g3aTJmUXFSQUNNQXdDKzhKQzBIaHVrdUY1aVV1cGhPQUdNYzlhWkh3SjJQQjZNSEFxNEtBZnlGNEQrTFhLaUhnU0RSbXFTTXZ6UllEMkxpS09IQ0pDdktDVVE4eTJ4b002TWtRN1haWUNBck44cHpYNnIvUzNPWlR6T0JiZ2RYeldFVUhEelQxQzZJeGFDVXIyQ1dVaURzdFFhNzhpNnZsVEY4YXI5ZnBnMy81SlNoK2NwVFZidHdnejluWlVlWE84UlFjSFUwVGlnbkpYUTJnTVpJaWlFTm1Bd3habkw1Q3ZzcFkzbFY1RXdaa2xqajBEdS9TTG9XMHhBcmpmT200cnUrQlF2TDFkaG5EVDdyZmJjM0t6Q1dML090eitJSi9VenV2MWJBbnpXdXVOMWhPdHVtTkwvU2xJQTR3Q0Fid1I5V1dsYUxVWmFuQzgzRkhQT3NkTGNKQ0NvVjRhN0QwRUF1ekJ2QnRJVHh3eHhFaFFiNnZla3BUR1Qvb2JoeHVUc0J5eThzQXFpR0txOHhJSTRmQ0FwQ01qeW5hNmszRysxdjhWbE1RQlpqZk9UZUJndTBUZTNOdjg4Q1I3aHQxMkFGTmRWVjF5djRTV2swMm1LNVhVNExMTWVyOXJ2cDdjbnpVbkdDcUJySUc2bG9rTXFzNjFDVmFnUndncVNONXl0aFk3aVVaTUJVTzdUUXJjMEluNXl4Y3FIS2t6RmVlSUtWRHFkdjdBWC92d1lpTEhndHdrVngxSTFUQlVGbXlNdEZwMVRWYXREblhyVUZiaGFoWEhTN0xmYWM2UEFNc3V4ZmdOcGcxOGFhNEJMZHZ2V0hhNmpObHAzc3lFUm9EZ0FRRjJHUHFHV1Byb0Z6N25pS2tUcnJsaDVEbFdpbGdGQlRRYlNBVFVYMW5KaFBnRVhwaVZRaEdwNnEzQWdvREJOS0pmK3JzZU55Zm9IWEhwUjVUQlZTbElsY2ZsQVF0ZHBsdTkwTStWK3EvMHRic3AvUDhoZ0hJMzcvaUJnUmwxL3ZtSW9Lb0c2Wlh4YmxTRFdva1VoZWRkclJ1dzZxL0VlMXVEOW5ob0NWNmdFcW50RVpZZFZwVkwzRDFhUFUwVkNOYURzd2NCYmo4cEhMeGlnbkZYcXNCcWFwUktwNGJsV0E4U2dVaHdYSVBNVjl0S0dSWEY2SUdjOFRubHNMSjJ1U250WVZ3V0xoWTBES09GYUlZOHpIS2N1NVg2clBUZklpMmxQZVN6bGdQME9RcWxXQ0lncnhFNGI2NDdYa2U0MXJOZmpsUUdPQXdBMDVuckgrYVVVV2E5OTB6Z010Vlk0SG95cU9iNFNVeEFvamd0emhKQ1lTZzRmdU5LYUF5RTFQYjE1UGdpNE1ia29CdFlBMEhmV29oaDdNTDVQOXZoZVJ1K2tFbzlwOWx2dGI2R0l2TjZWS2xKV01zNHo2Zk94dkE5S2Q2SThNNWREM1ljeDlOc3EwTjJWLzdjZXd3UHcySWhkcHpsZUt3aXZWUHY5bnRQaFBFWkc4c2dWRjhMUkNxUEhZMk1KWHdRQStrNHNySUtsVUZYdGN4M0FDb0p5MUtuSGV2YXM3WTZrUmdRQVdtdGlCK3dZUzRpSENudFpjdVVXQVBCSnFHdnRreTBBTVFxYzNzaDdybnNPT1ZTVlkxdWV4ampJZzBqeithczlOOCtOV0hvYVl5RUg3STlBL3ROMCsrc3VYUDU1bGRZZHI2TU9ZNi9obWw5T0NnQ1FMY3hLUmxoTVFUZmNEaHowV0IwUHk4VHFodFFDTjNFbGdYR1NRaTVNTEZLa2g0QStsMWFtOCtucGN6VTlxeHp5bFBPWHhkd0dUNGZlb25ZQkdQZ0tIN1hTWVpEV095RXpPYzErcS8wdEdKR25OUTdxTTBRVjc4Q1N1VnFZYVpQV1BCWlowbUk0WThaTjQ0NWhoSlVGbjlaNGZjUkFydmI3dFJDM1lNd1ZsM2pPd2Q1WDkvd3FYQjY0UWloNmNIaGZEc0hodjBMNzdnajJIMWVxeTdub1NwR1BBZ0RnTUFFQUNGWGdWUGZ2VFZlUVdtNmpNYlVLcWRyVmRmQ2dyZ0RZMlFiUHliam4yMXgxeFlWeGhseHhtZlp5eGhtaHVVdnorYXM5TjliYUhhdHdMRjdEZnhIeTN4a2kvejBNaEI3V0JYenZ3YmpvZWZJQmdLTnlBUUNuUXJBa0w1WlQzQVhqc0VtdWZvd3ByZ0k2eDk5QkVHQVZCYkkyU1N1NU1OR0lZTC9vbXRsMGRrVTlkRjhxRzdRT2J2OVl4RUhIMEZ0L0R1SkJTZzVaQkdDVUF5T2toZzNMQW5jWWgwR2w3OVJIaUR6TnVhcjJ0N0FRZWFYanZDSkVqb0RHcXZxMkNPdDhFNzcxbWlzdU1MWGxpcXRpY3Z4YUZmV3VlSXp3V0lYakllRkhZOXR0TlhnL3JOQTRSYkhJWlhLZlR3T1FXd0c3Z1RGN3JDYko4ZEZ4dzROeEJJZjhGZ0R5YlZkY0poanJ1MDlUdkZadmhsa0RnTytFNkh5RHZnKy8zeEs1ZjVIZm9ITzZRbUV2L0RhUFllM2hBVE5COGVJazQ4eEJEQndWWU5OOGZ1UVpaVEUzbkpFVldydlcvTXlROThtYUgxN0RmM09Gd2tIbndkT080QmFMYldISmJnNlA5VU9LYTZvQTRKYVJDb0dUcm9lL29wSXRpRFhNdStKQ0N0TkF5bGtncjhFaHZKUjFPMjZNNFNhYklRU1dBeUxHSXJuaE5sMjgwb3Q4c0dIWlc5M1FPTTRzc004bmdaUzJEbTdQWFhLZmF2elVPZ3pLZmFjeEE1R25PVmZJeUsvR3QvQWg4a3JtaHhGNW5BTVM0MmtMWUdEUUlDeFRTRXZKaHhoWHZpRUFLbVNFcmZHbUErUE5HWVFmckwxdUdkR3MzdStXY1FpdUd2RkkzUy9LYUo3MHhDNVhYSEYxUWlzK3FqZXpQZGxuR3AvRlM4Z1MyQjBGaks4cFhzdmx1aHVxQUFDK01SamdWaFhTR2VBMzRQeXNncjJkSWJJeGY1dWJzdmJ3a0pzQjNsYTViWUZBZk9qNUZ6Mi83M3YrNndHZWtYcWlzWURhS3F3M1hyY3pFV1RzZXpIVzdxSkJ4R1BDNTNMRUd2NVFNcW0rTjhBZlh6cm40VUp6QUxhTUNiS3BBd0FzL05IaGltdXU2NGJiaGMyMkFzU2FDVmRhMUdZU1VnTm5LRzY3Yjl5T0VZbkhJY29zR1NRSk5LZ2g0bzRGQUo1N0RyWWRjQ051d2pOalR2TVF1VDIzd0ExcFZVMzBIUVpKMzhtSHlOT2NLeC96UDA3L3N3bStSUnhFYm8wekErdkxOeitNeU5sRkhsVlcwMmVFc2FnVThsbWVBZE5ZSzN0RkdlRVZ5cHJSUFBscE1rQUxoa0ZkcEVNcFpFVEhDSnhuWVVUWElQeVhnL2krdW1LMVZDNkhJbklHR1JDL0RYcmxkb0J6c3dsZWhHbXdRVE1VTXJJOGM1cmEyQTZja3l3QmdPYUFhOGoxSVJ3RWVvZ09Ha1MwWGZEWW9BZURhNW84STJMdEJVOGNQUWQ5Sm1rV0lkVDMvSHFKMnZMOHZ2WDh6RUZEL3MrVXdmdllvYlcyQTV3elhSTlRuaFRoeDU3dmg2R3hKUUN1bWdLS0taL1dmREtmQmFzR0lqblh5cHpCUytldXdiL3BncXk4VkFFQXh5T3dualVpa2kxd3NVNjY0bks1V05ZVzh5TW5pTG1ORThXMzQ1YUlWSmxCUXBoUktObEszZUVxZUJjTVE0UHYvY1p6YzFDQmtSNGp2b294Vk12WVpJbklRM01WUXVUV1hLV0p5R2NON2tjYWlKelRacUlRT1pNYVEyVTFvNHd3NmoxWUJhNHVDNkNOTXNJTUxsV1FaeGh5Z1NmSmZiL3JPWlNxYlVSOUxzeEQyUWNiWVBTSHlOZ3hXRjZHMEdDdkVSOUZBdUVoeFY4MTFXOElEUFFVMlowakR5aFJ1NUExQVBnQ2VEWFg0RnMxZUVLUVNLUTg4cmlFV1hEc1BxWFcrdGJlR3dGUkJ3bWFCUUM0aW1vM2VWRzNBSHp4NzdNdVRCeWVFWWFoWDBQZmgvQSt1MFoyMEFoNEFkVlQ0dnQrMXZkV01aN093SHhhQUFDVi82NFo1RnlMZUtocmU4VUlJVGRsQVFDZVFDcFBWRHhpSGc1L3ZIMGhJVzRUY3VQbkFaRmpmMXVHZTZQTjJXSVpUUWJDSEkySmtsbThBMk5rV2dXUGlWSm9hSFJTVnd5UFJiT1JDclFHNlpDYlFLSWFKUUNRRlNMM3pWVWNSTTV6ZFpJUitZZ3JWcTZMaThqUHV1aXlta21OTUhKWUhzTGF1aURyT1dTRU1WeUU4WFpWQU91amRia0pCczg2bEtwdFJLTU9hZmIyV1N4ckpqc05Bckd4ejdnUk03akFPZXQyaFZMQm1QV0EzandlU3k4ZldRT0FUd3d2d0NOUENISVJib00vUy9PUndsb3BvK2FxSzRocnRVY2NXSnNKMm9aaGI3Q0tha3RDQU5EbGlpWFRIM3ZTVnBIL3N3OXJab2Q0SHp0QUN0Mm5qS3hKZ3l1UkJBQjBBems1Q1FBNFk5Z2NuQ3ZMSTdZUGN6VmxoTWxUQndCTWd1UGIvejRkckdNVTk5NlJEM0lBNlhFNU1DRHp4a3N5dzFnUnp0ZmdMcmtGM2dsRW1Fa050SFZEMC9qc1dROEFzQXp0TkxueW41R1JtZ1ppSUlvaVlRZ2dhMFRPYzlXYllFT3kxT25iZ01pN0VtNUludzUzVThwR1dHOWdaeUsrK2I4YjNCajJNaVVCQU5VMm9qNDNmWTV1M1BNUUZwdzNqRlpjc2xNdWNKTlg3WWMyejNjODhGdytkRDluRFFBK00yNkRUK2hXaHlGSUpTRHZRUXF5TDN6Nm5ESlB6Z3ZuSU02QnRaaWd6WkwzSWNTbmlRc0E2aURNYUtYRllVNitjamsyWEVIbllSRThrT3RHeUdmRmVPN21LZ0dBcnoxZVI5UWRtS2JMTWE5dFRyOU5IUUEwUkpEZ2NwVHFNRTNrcXdNd0pGdVFNNzlQSHgyUi82NG54MWdKRXovQ0pza1NKWDhUWUVwYnNYeGNEQTNFVkVXTmMyMFRSSFRKR3BFckdtK2kyMW5jRFlrcGhiOWtSSDd4aEJqaC81QjF5endUREpVa0FRRFZOcUpSeG94dk0yeGJmTjdBZGcrL2dFRURlOWVlZVM0ejYwQWN0QTdudGlvQWdDOWRzYkNXcFFRM1FkNnZRMGgzdFlpTUF3U2k5WEtqSmI3ajdvL0ptRzBNYnFUdEtRS0FlNFlYZ2ROVzMxQTJ4NndybGdUSE1HY083TktHY1p0dXE1SzkwY3lQNng3ZUVZTm1LeHpXQjFrTWo3TUFBTTg4c2J3ZFk0TWlnc2Q4N0RYZ0FLeUM1d0FQcVdreVJOYUNxQVZLTG5maDFydGlxVnFzY29hRmtmckEzWjAxSXI4THQ5cEtOdVNEWHlnaVAybEcrQkFPRFZUTVE3ZDJFZ0JRYlNQSzdrd2VUK2R1R1VpYnl6Q1grTTdNQjJLR2ROUUIyeVlYQlJZL21vc0pIcklHQUt3RTl6aVE2YkJKQUVvQjB6NWx1dUM3Yy9ycER3bjN4MkNNcGpWZE9zUTJwQWtBUW1DU1NaeXE1ekFNM0pJeG1qKzFUenRnY3pDZVhnMTd3NlJQMzBWMnc1V3FabUk0VEMrY0Q3SUFBRWhJWUhjYjM2aFpKakZINlV2NFFLeVN4T1FmYTVKcllhQXJXYmgxY052dUJMYzBsa2J1QUtMTEtTS3ZMU0kvaVVaNEN3NTFKcllOSmdRQTFUYWlYRWlGMWN3NEREQlA2OEVLQmFwb2krWDkySThJeXpXNFltbGlOcEp2d0tOWmJRQVFSd2x1empOMyt2eFJjL2JVRmN0cnB3VUFyTEszRFNuYkcrc2NXdldrVms5Q0tMQWJTTHhXYUhpWHdsQjZIbFREM3ZqU1B2bXl2VTJoUVA2MkwrRGJwZzRBWG5oY1preWs0c25sdEJwMjFmSEVzeEd6SnJrV0J2cWtlUUJPRVhtMkxybVRhSVJ6bEhLNkJCNnNKQUNnMmthVVUzVkQrNU9sZ0ErTWZkb0wrelJwK0tNRjltU3RBRUJJQ3ZnY3BEakhVWUpEYnlZZUVwYlhoRytKckFOUTZZVUR5elozd1ZocDJwdlFPZlRhSUdPakdKRkZHTjBHRDVzMWRqWHNUWnlMN0JxUi82TE9yZFFCUUhNQWJlTm1tWXh3VjB6UVJQS0V4QUVBdFREUTFzS3RGUWZnRkpGbjc1STdpVVlZeFcxeVJpZ2c3aUZZYlNPYXhFTzNUQURTbCt1czREb3VBRGdKSG9BNHhZQXNKYmlPUUJvbGVsOFhEZDZFRlNkR0hZcXJLWVljRnp4anBXbHZRdWRRU0ZlbE1jQjNZc0owSEE5T212WW15VVhXOGx4M0daN3IxQUZBaUFTSHVldzhzYm5BQWI5dmJMUTRBS0FXQnJxNVRHT1RkaGJBS1NMUGZrT2VWQ084RWhFS2lBc0FxbTFFZlJ3ZFRyOVRXN0hxY2Y5enJ2TVR6OXBETDlLeUVRSmdEc0M0WVNUVEFnQzRicVloeEtGdGxteFBTQW1PTTYrT2lIdzlIek1MQWdzMVhVK1JkTXo3U0RsVjFRQUFCeEdrNWZxRU5yeWFBQ0Iwa2VYYy95anVtdFpNeVJ3QTRJZERJemROQkI3ZXdIeDczaWtEQU5UQ1FQc0twckN4WVVFZmk4MVpyZzdBS1NLdnpvWThpVVpZT1RTaFVFQ2xBQ0FySTRxNTdHMkJUQ0o5bjNYS0VMTGNuVnFjeDZjTDRkUG00TlJFQ3p5d2tSeUJzRU9sSVFBc1I3eHVBQlJmbWViaFFIYUU5aEdsZzhDNTRwcnRsRWJhOFc2VkFFQkx3R2I0OUJ1YW5WMzA2cVFBZ0xnWDJTVHB4VlVIQUV0QTZ0SVhabkF3YlB6dVR1RHZmUUNnRmdhNktTTGx5TXJMN0phKzhJTnlmTk5ucEU0UmVlMDI1RWt6d3ZpTU92WWVyYnVGaEhId2FocFIzYXRSV2lLdklVMzB3SldxZ1ZwRTNjNElONzYxdDVzTjhHbTloK1U5U0lzRXVPL3hVUGlVNFBnMmFHVkhXSjdQYmVlWFZOY2JZMmp0SGJqNG9tTzFCQUNITGx6aTl5UURnTGdYV1YvbFRWU3V2UzRoNjVvQWdHa1BBTkJKUXBMWXRySFJSb3dNQW10QjFNSkFQNDl3WDdJUTBpakU0UWM5SDlRbk9IS0t5R3U3SVUrYUVjWm5uSVBVMWdOSXNWMXhoZG9ONVFLQXJJeG9IRzhkaHVWMlBPRWpLMVdYKytJOWlTbkdTaURzQWtMdWFFVDRpZWN0Nnl5QXVFcHc3RjNWckJxTGcyUEZqTEhHUnB5MUY2ZXhwSGF0QU1DQ3N5dUtubFI3RStjaUd5cjhZeW5YVmdVQU1BZkFBZ0JvL0NicHBYZ1MrYVY5UkxCYUdHakxmYmxvTU5leHJPa0VqRGxOTHR3alR6NW4xeWtpci9tR1BLbEdlQTdXTDZkTnFuRklDd0NrYVVRdkd6bk8zWjRjNXlNQzFGSEFQQ1JPaG5ycG1JR2lKTmtSWXo3ZkJPeE9OV29CeEZXQ3d3T0JtKy9ucklQalVVTHdHV3BjVktzdGc1QmpsQ0JiNlBkUHFyMkpjNUdOWTBOUXViWm1XUUFzNG9FdXlubTYzZlBoaTJXRjkxMXBzUU05bUd0aG9ObDlpZXBNMjdDQVVmQkkzMWxGYjliZzVzYkdDYk1RVGhGNTdWMXlKOVVJcThRMmhnSnduNVVEQUxJMm9sZkZPSVZVemhBWWMzR3RjWEwvcXl6czlSamhQOVdVV0pKeHNFUzNrdkpXbkYxMHlQSThaQTBBNGlqQkhibEN4ZFJRMi9ka083SHJPTW5haTJwWVZsdEROZFhrSEZrbHhWdWR2dzZCYjkxWDA5NUVYV1FQQTJkaEU1SC90TFpJVFhRQTVqMHUrRzBndjJ5NWdpUXNpZ1F0eVF0dVFKL3JuaHRBTFF6MFkxY1E2ZWtGbEthM0IxU3kweG9IU3ZSUjJkc2NHRXFPM2FMWXpTa2lyeTBBT09sR2VEd2lGRkJwRmtEYVJ2U1dyTGZIc3VhZU9YOFJuNE9BVnc2bFRsV3Awd29wc0tiRUxwQnRsNEFrcTFVaFdiSFMycGRJWE0wU0FNUlJndnRaZnY4d29oMjVlTkxuU2ZkSHFQVzZRdlUrTGVDVFZkWVJ6cW5selIxeHhVWFpRbm9sNVdZZFdUeVJwUE1acC9CUG5ERDFGY21RKzhwVlNRa1E1WHpSYUxDYkg5M1dHakxBdjFmaXo3YjhETmJ3WmpuWUZ6VXkwQThvVHRNUHFUMkxBQUwySVU2L0QrMEFYSnM3QUc1UTAxM2Y3eFNSMXhhUm4zUWpQR3k0cm85ZzN5VFJBYWlHRVZYSmFOWGdWNUJyc1ozM1BRYVAyYzVhU2hsRENtbzgwVE4zNElyclVDQkpkZ3YycklMeURlTHhvTXBhWFJVQVFCd2xPTFVoY2RxKzRkVmc3ZmlrKzZNbm9uVzc0aEsrYWRvYlM4SjVOVURxSG5DRmdsbmRnZCtMcXp0aUhhU1k0dHh0akxNV01aOVdxbmlvOEE4VDFkVWJka3lPUDliSStjSmxXQXZBZDl2ZW9UQUFWZ0hjaFRqR05yZ3FONHkvMzVIL3Z3ejV6WGc3ZmxZakEzM1hGUmUrNlhZRllSOEZBVnI1YmdmQXpnRzltOTVFOVBBZmc0eUJObGRhYytFVWtWY2ZrYjhOUnRoMzI4MjUrRXFBMVRLaVQ4RjkvbEw2NnF2QTRDSGIrU2w5Sy9UTXJicENhZXRERDRGVzk3OTZISmVJTC9BSzlrODFQQUJSU25BWUhsbU9hRmEya3hWU1NRbytvOXFRekpzcW02WnBiK0lXbHNLcXRFUFMxeENrb3V0WnNlZEpWMWM3NWFzMnlXR3FTWG1lSVJwbndVaE5aVjJMVUVnc1NhcTYxcTM1MUdWVURUQlUwQVAxMjZjQkJLeUNLMXpqMGdzeUFVdjA5K3ZncGxPQkRDMTJnaWk4RmdZYVU1bWFEQkF3QldsYXE2NjRwTEcrdTc3YlBDek9RV0QrS3pudUZKSFhGcEdmZENQOHluUGJQUVF3WG00dGdDeU1xQjZjWGZJZGh1WHZSNDI0L1dGZ0gxb0dEMHVCcXhFZEFVL2tpdXkvYlZlb1c3SlBaTm5YNElsY0I3N0FKSUNBemlxUkFLTWtrM2wrcGdQTjkwMm55Z3c1VHNkc2VoanF2S1ZwYjZMT0llYkR6Qkx2WXdiQW9aWEJ4WG9USWJFeUxGdzI3d3BDZUZNMER2LzhNb1dhNHhiK2lSS3JPeWIvSFZjeS9TZ0xBT0JUS2NKcWV6dXV1T2lQWmdXZzhwVm1BMmpKNERsWHFvdzFMWDgvQklkL2l5dUlmOVRDUUYrVk9Nc0RBd1NvVVpzZ1YvWXU4Qnl3akN0Sy8rcmgvMExlNitFcElxODVJai9KUmxnQkFOOTIxMkVkNjYwMlRqWEFhaGhSQk90Nk9NK0NiVURpN3g2bDdyRW5qZzBlZXVZUVpDakRmNWJpL2V0MElka0E0SEVJZklFVlZ5eGZuYllPZ0E4QWhKVGdYaHZ6NDl2emt4NUNOTmZYaUVzNlhrN1FPS3NwVFhzVE9vZVFRNkpnYnRuRCs5aW1uMFZGVFNRcis0UjVkaW5NdkFaakxVWHdTK2JwTUxkU1dhTUsvMWh5OWNma3Y4L3o3ZjJBbmN5VkN3QTRWWUVuSkVlRVB6UWM0OURHNEtDY0FiTGFCUHo5c0h5RVhqcjhIOHNMMThKQS95aWtvOXR5U0NNSWVDa2ZFT2RrbFJaQXpqRGlYZkw3ZVBqZk9VWGtOVWZrSjlVSTQ5cEJIZ3FIQW80UC8vOHZjQ2hWMjRoYUJPSlYyQ09iemwrZkE5My9LbmFDQms4OWN4aG02Skk1R3BJKzBOYmdaVU05ZHV2Z05kSHZ1K1ZzZ2E2c0FVRFVnWU9pWm1Od2ljQVdOeVU2VHRyeFhnSlA2bzVuRHRLME42RnphSTI4WDdzZTNnZVRzWkZzUGt3TWUzVFBqMUdtMmg3WXE1enNoeTNncytYb1daUmZNaFBqVXJNRHp4NjNZTjB4K2UrVGZIdlBsV3JXTEx0QURZbzRBT0MrUWJ4RDQ3TkJKTDkxMlVDTGNMT2ZoVTJJaGdUZGZScTMxb1haRElmL1Bkbnd0VERRWjRWa3dTRGdHWGtqeHNpendWVVByYno4T2pqOHI1MGk4cG9qOHBObWhIMXJwenNRQ3ZqM3dLRlViU1BxSTRybWdFVDhHb3drOWhNU08vbWFQSE1JQWpybDNmckJBelJHbDVGeENsVnFoaEliNnpTbGdLTUFRQnQ0MDJhTWJDVVVEaHVCK1ZIdlJCdGxLZm1LbHZIdlcydnZzSXlXTlFEQWM2Z1REamtrWTIvRDRjeThqOE1BR1JzQnA3clllWi9vWGx1R05id2ZtSTk5Q2kzTnVtS2wyRlpQRmd2YTc3Z2w2NC9KZngvbTI1K05aNTZCTTNnV3ZMRi90NjF4QU1BZGd3UTNLQzh6Q3lBZ0I2eC9OUnhyaFBnMU5XN2J1Qm4zdzYzL3Vid29IdjZYYTJTZ3Z6SkFnR29Sb0ZHWUFvUENIZ0IyNVhSQVd0TnRPZnd2blNMeW1pUHlrMmFFZlFDZ3d4TUsySTB3eU5VMm9sSHBuZ2NRSmxzeWJ2OXE4Tmo5LzZWNEFoZ0VOTXE3cVhldVcrYXBuOW9ndlBjQ3BGQnVrTEZHWU9nREFMc0pBTUF1N0FVR0FOWTZ3S3dseXphcGg3UVI1cHBEbzloSG5Ob2pXeFcwY3V5TnRpaDdvK2NRWm44TTBIZGtNalptWTRYSTJJTjB3MzVDKzZRUFFyM3FQVnFqc3d6ZDdOdkdPQnJhN2dYZWw2NnBRUWlOc3djWDdTQXFZZjRFNUwvUDh1MXYrZllIZXVZaHNUT2owRWFBajlVZUJ3QXdDYTVEWG1LSVFNQTZNRytSQVkrVHN3Y2ZSQTIrcFJhbjZYZDM0UEEvWHlNRC9SbUFnRXRpaUI0R21NSGJ4QUhZTVBwRVY0NFdjVGgzaXNocmpzaFBvaEcyQUVDejRZMWJCbURsTThqVk5xSVdBTmdnbzc4RzVMdHhDTDh4K1EvRlRqNlRtNCtDZ0p1eUpoK0RkKzRGZk5OT2F0M0VGNWdEcjlFc0dlc09NdFlZZWtUeHJhamlWYXYwODBzZUQ4QXdmQXZXTVBIRmczM2s2RVg2L1FVS2VjVVpNMG1icDcyQjlnYlhndTROL3YwNVY2ckFxUEh1RytCNWZCNUJ4bDd4OEQ1V1hiRXcxS2lIakgzZkZZcFl0UkFJMElONkhtN3NxOVNXWmU3bmlQVGRDL3UzWHQ1UHo5T0JBSWNMN2VCRE9qT095WDhmNTl0Zjh1MjM5TXpka0hXakRiM3NMK0lBZ0t2ZytsWlV6eUJBNDZ6TGRNdmZDYUFqZGRWeS9uMFRvWnhMNHZiN3RrWUcrZ01oV0h6bkNzV0kwQU1RUXJWcnhtSFRSVXhPZE9XY0l2TGFJdktUYUlRWG5WM1ZyZzF1RHpnUElZTmNiU05xZVcwVzZkM21nU0E3REVieUJkMytMd1BiK1dQNTUvY0NDcTdJdTkyUm4xY2dvTUN4aVZvYjhBVjBIVTBUQ1JtTmRRT0YrOGFCVzZDTmdXczdrUi9uako5bm05QUZvRzRTZUN4VHdLa2FNdUxCRDQxOU9HYjgvcVFyYUkvRUhUTkptNkFiNjArdVdMcTlnL2F1Ny9kN1hhbjQwNVVZWk96eEFPOWpucmhwdy9KNzNRWVorellBU2p4UTlhQWVJVDdick9GbTUzRjZhRDA5b3ZPMHk1UEZwVjV4dFlOSS92dE96cWJqTStxUCtmYXZ2MHI3anh4T3FzSC95QUFCZzdCNFppS1EwU29nYmR6NFE2NVVnVTlKRHVmRXpmRkZqUXowMytURzhhMU1PaCtpWENwNDJYaEhQbXllRTVOVGJ6YW5pTHkyaVB5a0d1RXg4bFEwd08waGprRlZnMXh0STZxWklqMUV6T05uMU8rdW1UOW9KUG4ycndidlV3RUIzNGwzOEpMODNFMzVuWHZ5SEk5bDd6K1ZWdWVLdFFuNlpPeGhJaUd6c1c0eWJCNEtiNDJDYTdXTnZ1dXdLeFhxR3FVMStKeSt4WkRSQmdnZzZkNjRCNGRzTzNFZ3VPbjNhb3M1WnBLbTMxQnZyTHJlY08vaW5GdnZoMnNBQWFDUGpLM2ZVUTluNVgyTUcyMlV2dkZMeUZhcEp6N1dEUUlCZUZEM3dWanNZaCtGMi9zQTNMaVY5SzNyNmU2djNvWS9jZ0Jma3NQREFnSGR3THdkQlVNMGJTQWpSRWUramM4RkRyNlhtTjlITlRMUTc0bXgrVWFNRUJZa1F2ZTN1aE9uUGUvSWg4MERWeXJqZUlySWE0dklUNm9SN2lkUTlCUnVwWjFra0VJR3VkcEdGTjJjdnZsUW85OE4zd016ZjY1VHJ2UHg3Zit2a3ZMMGlWd012cEcvdnlBL2UxVis3NmE4NngzcDY2NHJWaWRzQVJ1bXQ2NHVZMTNjQmRDczc5TG5pb1czK21qdFBxZDVmV1g4UEs1QjNFUHF2dVgyRWdqU0RYQlIwb0pMOVFZSGdsc25mSzg0WXlacE9uZDZZNzBvMytHZWdEQ2M4NjdBNytNYTBMVms4YkJRWmJMZEZZdE45UnZ0Rlh6amRuaE9KbU5mRW84VGdvQjZtU3Q5ZnAzZlhvK2JIYjlYQzVDK2RUMWRmMXNBd0RmaWdyOU1JS0FlakVjbkVPelVnQXdieUlqUkVXNzhGdnJvSFBON3YwWUcrcTlpZEw2U2VjQ1N4STFHK2hIR2J3WU40OFkzRzNYbGZIR0t5R3VMeUUrd0VYNXBwSTFhOHhCbGtLdHRSQitCdDZMZE14OHY1UmxiWlI0YURQS3ZNdi9WRHZ6eFY2ZC9UditjL3FrS0FQakNBQUYzd09nM0F1RW1DaG4xdVdLRnV0REd0MUIvTFF6MG55WEY0a3Z4UmlDcVphblRib3JmZEJuditNaTQyV2dlNXlraVAwWGtwMzlPLzV6K09mMXpZZ0NBb3ZnbVlOSzNRMnZ6SEhEWGdOeW1MdnhqcHVKdmdNQ0RxVHhvMkpuRjIwRXMzZzVnOTdNTHI0Y09sUmVVSHRSaHREYjRPWFE5V3M5L1RMYjQzVEhoSXQvK1JkcS95di83bzRRTVBnR1B3V1c1TWQ4bjEyTzc4Unp0TUpmMUFyek9ldzYvNTlCUHB4eHVYZEplZ3NoTUMzQU9jTDd2Q3dob2hHOXI5WVh6YlQydkh0cEozMDFkK3h6ZmZSL20rYmNwOXZ1UkFMa1BoTmZ4bDVoOWQ5Q2M0Tnkyd3JyUnpKWGI0Tm5KYXE2ZnVPSUNPNzQxM1N3L0Y3WCtzVzlkdStjb3pGTVBOM21Mc01SN3poZm1pdlBzcmVDZHdjdEY2TG12VUVvZzJoQ3JOVU82TVlKTjNQTjY4ZmpmK2ZaditmWW5XVCtmd2Q2OFd1RzRaeUREeUFMbnFHc3c2QW1kV0NHem44aDJxT2VXc3lSODZ4dS93ek1HeXhuUGQxWnpmU2VGWjYzME9iS2N0OStCbmNIems4L3IvMHExajFzTEFPUDl2WjdiVllkeDYrWkNCY2VHOS9mRzRZOTV2TTNrTHRSWUc5OGMrK0R2QjQwVWlnR0ltN1pRbUlKYmp5dVZIY2JuLzFxZS8yTlpsSCtGQStxMzh1OGFsL3dJc2daK0JNN0FrNWh4UWR6UXlyK3czTjlxaUh0aGZnYWxEY2gvOTdtQ0RQQXpqM2dLeGtIMXBqNUEvYnd5WXA1Y2NDanB1OVU1VzgvNlU1bERCUUpwOVh0R05zc1hNRVpVMzcyQk9la0RiMUdyS3haMnVwM3hYRCtMZUc3KythajFqei83aFlBbTVyczhoOUNabGJMRWU4NUhkSDNta3NYR2ZURjNmdTQ0WHJrUVdIbElleDRKaDcrV0hHc0U5MmRoYjk2dllGdzgzTzRZNFRsVU5wd0VudElFRVErdDljOFhod2J5ZnZaRXJPOGVDait4QnpPcitjNXFyaCtrOEt5VlBrZVc4L1luMkYrZHJyajRWdGxwZ014K3RZUUZCajF4ZDcxRmE0ejdRM25JQ3k2czVOVUxNZkFSVjZya05lWUtldStjeGpOTnpPa3VFa2F3Mkx0WWU4Q3FQUGFkYk5Rek10a2Z5d0gxWjJudnkvLzdYSDVHU1VtWFFUZWdJU1l6R0puRUNpRHVCQWh3d3pBL0tyT3I4elJDK2ZRM25TMmYyZ2ZmZGh6Nm1vQlkvWWl6U3c1YmJQWTQ3MllWZU1GNS9zd2dmcGJiN3pscFoybU1xTDZIZ2I4d1ljd0oxbHJBbUw0YTRBY1p6WFV6SEE3V2MzTTU2TkQ2NTc0MTNIZUpVbDVaOVhJcVlzOXhxcXRxZVVROU81Tm1mYXg3ZnU0NHZCd2ZXTUZzRXcwL25vUFEzTzhGakg0a2R1dzc0TUNnVUZyU2NaL0xaZWdTNmEwZ3VWaVZTMmNoSzBqVEo2ZU50Tm5ua0M1MjNjT2JZYVhFMFByMkVXYXpuTytzNXZwcENzOWE2WE5rT1c5L28vMDFaUENoRWdzQlljM3RjWU5scldsdXVnaGI0UmJON2o5MVZWd0pHTWdvTFcvTW85WERiczRWU3lndWt2Qk9ONGpIekZJKzdpeWtJbUthRmRZZVY5ZlBXVUZjZWxQOWtGS1N2cFdmT1MrL294b0tqMTF4NmRkUWJqRG1FbDhoN2tJekdYTXVyTFFJeG1IZWxjcXEzaU5QQkJaUW1hQzVYaFNEZzRXYStIbW5YSEhWdGlUdmhrRHJtakhQMzhpTnZkSityMERqTWFMNm5vTFUxbm1hVzExL0k2NjRyTE1hbW52RzJrNXJyakZkZE5LenBpZmgyNGZXUC9mTmhGL05ua0VSTGhWN0N1MjVOckFEU09pTGVuYk9qL2ZsM2ZOeng4bk1ZYkF5NklyTGNTUEg1VWR3c2I0bmUvMHpBRWdjSGtIREd6VXVnaVFtRmx2cW12T2tzYUk2S2l5Y3BYM3FiZmVPa1Q3YlN4NEZYb2U4dnEyVTJZYU01L3Y5ak9hNklZVm5yZlE1c3B5M2oxeWhRTnN3Zk4rS3BJQlpmVytKY3F4UlVsV1Z5cHBJdElEWi9EY2lES1JWeldzTjhzZlh3T2lvRXFFS3psalY1TGlJekJyMVk1VWZmUVFmWEpIZlpYbVg3eVVzOExtMHIwR1U1TEw4N0EzNTNUdWdRUkNsRHNacVl0ZU10TDFlOEhwd2FlVU5tUWN0cjh3S2NtZ01jTDZud01pZ1pMUG03R3R0QjN6V1ZWZXE0cGprM2RSUTNhZDVWamZiZVpuVFN2cTlUWTNIQ1BXOTZnb3lzVHdudW03MEZqWktlZnFOQnNxUE85ZXJNZVlhaTRqTXdqTnFXd0VOaDM1WFdqbzcxTGVWOHR2a2JKR3FuY0NlYXlkZWpZS0FxR2RuaFR5ZjhoNC9keHh0RGdRck01RHVpN0xEcXJTRzRjdVA1VGI2dFJHdngvQklyeXVXeEY2T0FaTE9HK201WEY5REZVOVZXVlgvdVE1OURodkFDN2tickoweEc3Ryt0WHc3NjVpb2x6ZnIrVDZUd1Z3M3B2Q3NsVDVIbHZQMk9kbTBPZm1PRlJVRGFuZDJ5Y0tjSzViem5TQzB4Zm44WndHbHNJb2NHMGhkbUJzd2xpcko2ZUxmbHIvWEJhdy93M3J5UGM2VzE5VitMTU9scExZbnNwSDBrTG9wRTM3UkZRU0t2cEYvMXh1L0NwR29lTTBUWTJOYit1Q1djdDlOandzV3ZSNGJybFJwejZjaFgwY0NNampmcWpxWWM3WmlueHFJWFpqbkVBQ0llamRkSTA5a0xlQTg2eUg5WXdYOVBqWWFqbkU5b204MWhpanRyQkxYT1ZkUWVsd0VFUENLd2tob2VOT2NhejVFVjJFTllHR2RTU0NNNlR2aVh0RjFnbjFmZzV1anBmZkIrK2pJMkVmOUJxOUdRWUN2WHJsUEk5L1MzcmZtSktSd3VVbGdSUlZEMFVQV0FSb0w5d3k3OWEzY1JpK0NHL2lSb1MweTdvckxwZXVZMng1Yjh5TWNjSFd1VkQ0WjZ6eHNBZ0N5Z0JmWEdYbEMzQTJVMEY0eTFqZXV3MjFYS3B1TitpcFp6dmZud0VOSmM2NmZwZkNzbFQ1SFZ2TjJUdWJNc21rVmxRTnVoY1dqQlc4MndTQnVFbXIzVmZGQ01wMFY2N0lNNUxHT3ZHckdxMFk5L3JlVzc5U0tjbHJpbFl1SytBcnMrQUJBczB6eWMvblllcURvclZKVDAzNkFlT2sxK2J2N3JpQkYyaWg5TklINzNxb1FGaXJlb294Z2RGZGpHV1RWMnVmNkN4WUF3UG9GcUFDbzFlUzBXaG4ycGMrbkJrai9MZzRBQ0wxYml6SFBkVERQdDJUemw5UHZNK21UV3lPd21lOEYrdFoxblRQbTRnRG1hRWZtZWNFVjE0OXZvN2tlU2pEWEJ3QnVmSE9kcENUMkNOeFFjTzlpQlV5VUdyNU5JU2RMOFRPMGo5UnRpYndhQkFFK0FIQVVFd0FjZWVhRUQ5QUJWMXd2WWd2V3pUWjR5TVlON3cxcWtTaUg2UUtFUm00YnQydXNoYUVGMHRSKzRUcmg4cTZXdXFoMU1HQUZ5MFVBaUw1S280OWRxYm9sRjlIYUJidkthNUFMWjdGTnpXSytGZlIvRFFUb215bk9kV01LejFycGMyUXhiOWVCWTVPb0NtVWNBSUExdmNkaDArYWdVNjdBRnlMVGZlNktxd3R5ckdzVkRuUXQ4YXZWN2JUWXlZNnhlSEdEc0RGT0FnQTRKUXZUcVRnVjVqSzVUTEZVTUtZNWRVSy9TUTR6VEZON1NhNGQvUVphVUdmYkNKR3dodnh6VnlxRmpJdnVDRURWT3JnR0ZZenR3M2lWQWdCcm5qSGxTRlBxa3ZiYjZrbWpzOUk5ZlgxcmRVamZYT3dDNkVMUXlXRXdyTTNOeGF1T0l2by9rRFZxelhXTEs2MXB3VlV4MThCd2NQRXNMWTYwU2ZQWDQ4S0Z2N0RteHhydG96VndNU3F2WnRpVkNrbGxCUUR1dWxLNTcyR1lIeXhUdlFmdlB1UHgzanlnZEZMbExkMmpkTHAydzRicDNCekMzS0NuQ04yNUlRQXdTWWU5M3NoWHdJTVVBZ0RQS0NhczNJME5XTU83NVBySC9mN2E4S3JxT2tsN3Z1K0RTL3NjWGFvZXB6VFg5U2s4YTZYUGtmYThQWFFGYWZiTFdRQ0E1OGJ0YzVrZWNwMXVRVXltNCtwRmNXckphOTMyRGVBYUxNSUdXSGVGZXR5aDIvK0xCQUJnQUZMcFVLZ21sQXB6ellpWFlwb05wK2dsT2N3NFRZMnJxdUZOYmhXSVpENXlZek9BT1N5R3RBc0gwcWJNby9hMTRJckw3cjVKQVFCWXFXODR6MDJ3dUpNQ2dHNVB5cGlWN3VuciswM0VYS2dCZlVQdWFLeTdZTlZhV0k4NTEvaHoxbHd6dU9EUzF2c1VCdEREbHQzMmE2NjA1amlEY3k3OXZlNktTem4vN0lyTGdHL0lPOHc1VzBvNkt3Qnd5eFVYTE1PWTl5UjRGcmZKU0xQM3hrcnB2QUlaTkp4bi9kSVRyejh3NHZUTUZYbEdmVCtsQ3hmdTBSMElQVzNUK3ZGeG1GNFlGd2N1Z2I0QmZKWjVWMXdlZVI5dXMrd3BTbk8rTmVTcXVoR1hJQlQxRUx6RmxjNzE0eFNldGRMblNIUGVMQUc5MUFGQUE2QlNLeTdGTGtlc3I0NHBLVmkvbUN2cGNaOXZEUGNUYXRRajhXK2ZETEVGUk9JQWdIRWpsVzdVaGJYajc4QWliWWhJcytFVXZianViRTVUd3pETUFmM3VOS1JKV3VtTlB2Y2l1cHlVUURZSnp6MEg0T3l3UWdBUWxYTFVUU0FnQ1FEUUhQVlJUM29aejBkVTN6d1hFOGFHUDZEbkdJWU5xZ2NZVmxzOENNdzFFanREYzkwSUIvU3c1MXZpbnNUOXRRZmpXM3NXMmMxcTVHYkF4Wm1EOTJhM01kNG9sOGwxcWR5Z3JBREFUUXFadFJCRFc4T0xmSmp5d2RabGdGQ3JiOVJWWUdDZWc4c0xNdld0YkJGZjMzMlVjYkVHZkNpdG9ya0NBTTY2ZUZuZWhBMzRYbmhwbW9EOVBnOUE0U2pBRmJsTDZjbmx6RGZxaUNnSXdNTy8zaFZYY0t4a3JoOVUrS3p0emwvaU91NXpwREZ2cjV3dG9YOHZDd0RBS1F0anhvM0R1azEwZ2R0Rjh4WlZ2UWhkVTVaN2toZm5PT1JGb2pITGdidlVaOVRhWXdJQVgwcldsUE5YajN0QThTbU1sNDRCV0ZGa3ZRZzM5RGdBd0plbXRrUnpwYVY3UTZtTmphNjBwcm5sRWtZQ1piOXhnRlVDQUVLcGI1T0VsblhESkFFQWczQmd6Y1ZJOTR6Yjl6QUFPajVNWDhQR21nRzJiN3VSZmVLN29XUC9jZWE2UG9ZM0I5M0Qwd1JBK0ZzUDBVMEpPUVpUdE45ZXh3aU43QVc0UVZseUFKNjRZcUVoMUQ2WWdNUFV5bUthY0FYZERBYWhjZnVlTi9xZVRhbHY5UTVoMzNPUWltcjF6YW1idU44dHoyMi9ZUnVRa0daNVhGQWhVZ0g0U016NVJoMEhCQUZ4K3ZiTjlWUkUzMDhvZjc4ZjR2aStaOFZNQXN0RFl6MEhwc1pqRG4vVXU0MUhQSXZheVVFUHh5WjFBTUM1cWRhTmcrT0pTTHpnOHI0L0FDUCtsY2M5aVc1VlpqSWoyM0lmQ0RKdkNJamd3UlFGQUtKU3NrSWxmVmtsRGZVU0ZpRmNvV2w2Ni9CQm93QkFLRTJOQVVDYzFFYkxJUGhRL29EaExhZ1VBQ3hIcEJ4aHZLd0xia054QWNBWXpQdGFqRGxKR2w3bzl4eGNQaktwYjkxWk42b2tjLzBrd09mWXB0OWJJTUIrWk93VExQZmM1QUg3MndRVU1YUXhUNkdSMXdGdVVGWUF3RkxRMDlpcWNoY3doVms1Q3l1dVVEcDcyZ0Noejk3aXZuMXI4TWdnRVBZYlhsNU9TOFB3cWxWY1RRRTRsdWYyUFRmcU9PQkIvU3pqdmxFSUxXbEthaXVGMzVMOFhnT2xFVWE5MndxOW01NFpDd1NnRUFRMFpBRUF1SDQ4M3poeXRPRm5nWkNpcmxhVUJQM1JnNkxXeVhpd3kyUEVZRnZ1R0xGUFJMVWFqNDBDQUZFcFdZanFCbUJCTlZJcTR3QzVUTmVORkwwOUdXdXpEQUNBYVdwcU5GL1Qvd3VsTm9ZTWdrVW9TaE1BaE9aNW0wZ3pJK0NTam50SUk0cGZwMVMzelpRQWdBVllmV1JTNjZEam55OTNyaDhhV1FaV2hzNFd4SGQ5SWJzUklva3lkMkhCMkp1cmdkREl0bkhEUks5Z1ZnQ2d6aUJXc1lqT0ZyaFZkOG1kdnVvaGJiVzh4WDEzSkZpenIxeTBNTTBFWElJZU83dThPZ0x3ellqblhvQ0QraFdROWJMc0c0WFprcWFrdGxid2U0MnV1SXBuT2UrMkJaZVpPVmRhN3YxRkZnRGdic1NOWXd0U1J2anc3WGJGa3FDcXJHZkZVZGh3b1RkaHlDREVJQ3VXYjhOc3VFTUFZSnNPNTEwZzEzRXFEQjlPVGJSNVI0eEQ2QkRBQ2NaTDk0eVliUndBZ0lmbkVmUzlEOWtRU1FFQUc0UXNBTUEySGZyNERvZHdzREFwTGU0aGpiSFNIRHdueHZMTERRSEVXVWR4QU1CdVNuTjlqNGhSVnA0L2VpYVdLSVdUZFFJd2RoemlMaHdZbnI3K1FDN3pKb3d6bURFQVFLTTZhTENxZDRtN2dMeUZmVWpiV25TbENwcHZhOTl4NXBwQllFaWFGdDNPZFVZNjNBell2aDJ5ZGF5bHNRMEg5U1E5ZDVaOXh3RUFSMlVDZ0tNWUFDREp1L0daY1FDWFJ3UUJxTUtiT2dCQTFxS1B1TGRITjQ1cDQyYUJ1WjR0SGdCd1FESHRTWENQTVBsS3gvSVI0dUlZN2dQSTUwYlh2eHF4QXcvSFlSQmMxQzNHNXNWRHlPb2ZiOEtIQ1FEQUd2V0JvR2ZkRlN2M3pVUUFBQlYxMnZHNEJOTUNBSytCT0diTk03TGRyYlMwT0ljMEh2NmNHYklDb2FUaGhDVEF0QUNBTHdSUTdsemZjYmE4OUl3bnpydGk4SFZRS2ZBbGVPcmFQQWN2ZTlqd1ZvK2VQSFliTTZCTFlqeDdFd0NBNTRHMHkzMWdWR3M2OFNhRUR3OEpoUExjdksxOWR3VENyRHVlTll0cWdaUFVVSmJXU3VOZUlOdTNTMXlSRFhpdkF5TENZaWdxeTc1ckRRRGl2SnZGc2Rta3Y5OGt2cHQ2Y0ZJSEFOZnB4dEZKc1ZBcnRqaG54QmF4UUZDTHgrQWRHRzc4WVhCdnJydGlvWnY1Q2dFQUNqWXN1V0xOZDR4N0h0QmhnN0tib1JUSkEwQ2pxTE85UktRcTMzT2p4MldhZnQ4aUFXSzlCRTRaOFpFQWR5amZOMjBPd005d0UxK2xlVjUycGNJMFRLYUxjMGd2R0llL2RRdDRCZTdSeGhRNUFEc0pPQUJIS2N6MXpRQW9YNFFRMlFHNERYY2pRTHFtU2Zra2Y2M243amZTbU5odFBFbHV5aWpqeWZNWUZ3RDRsRGJSRzdJT2x3Wk5LV1k5alEzRGEvRzI5aDBWOHVNd0ZBdlRMRUpib01QRzRvcHdEdnNHY1VVV1BYbnVyREdRWmQrMUJnQngzbTBUZUZIekZBNWlHOEllOTlRQkFCYTBzWVFsMkwxb1RUb1hDR3BKWVBBbUNHZ3d3N2dTQUxCTE9ac1R3TUpjb0h4c2krUFFZUUNpTlNPdXZrQXBjSmhXRlNWcTB3MnBiZVBHZkxISFpCeXlKbGcwSXVUZXRiSUFCbExJQW5oTjd2MXBtSWY1R0dTNk9JYzBnalc4RVZseFFNd0pUZ0lBZkZrQWgzU29Jamhrd3VXMkorTmlLR0VXd0RVZ0UzRmVzcFh2dndraHJxZ3dYUnp5SWd2UHZBeTRqWWNJZU1VTmpZd2FyUFFRQVBCSjZPYmdCbzFwa1pPRy9Ucnc3TU8zdGU4Mkk5TnEyeE95SFRMMk8zb2NmR0pVRmxjRTAxeXRGRVBtanJISE1zdSthdzBBNHI0YmMyeG1pSGgvWUhCNWVyTUFBRmdXRktVbExRSWZ2a0NvUUZBY0FMRGdlWEdlb0VvQUFNZGlCNENVTVJzakYvYWxoOHpveTdVZWdDeUJ1RUpBYmZBT1F6RUFnSW9OWWExMFRSRnA4UmlidlFEQkMzVUF0bDNsT2dBakFHaml1Tkxqa0F1MzRmdnZHSVJDWmdJL2ljaVpQYVEwVkp3TERrWHRlM2duclM2ZTVrS29mOTljKzBDNVQ2Z0xSVVY4cXAxSzFJMFRKdUx2M3VPS0s4eXgyM2dJMHFGOHh2Tm40MUFhQTRMaFNnUUFpRXJQV29XTUNFd1BqYk1QMzlhK1EydndJTVlhMXpDbzlkM1ptK2k3VE13WmJka1RraHFyUXQrMUJnQ2hkOXN6dk4vOW52RHlrWWRMbERvQXVPQUs0Z1ZQbkMxeHVtSWd5MUNCSUovY3BjVUJ3UGhJamlZb1RRQ2dCMDRvL21tNTJhSzRESlliT1M0QXFITUZOY0R1QkFCQTNYL05kT0JaNm91cjREcEg5OU1pdWRaVUNmQm5WN2tTWUYrS0FHQ0x1QWJyQml1YWM0SHZpeHM5dEZsMkRUY2pLd0dHVXVxYUF3Uzkxd242dCtZYU5kS2poTHFPUEdFczFDdkFWRjByVExUdEFlY0RybFJuZnBFYUszT0dBQUJuTHN6Um5JVFdINU54VllOakZ0elp5NVE2aGxWR1EvdndiZTNicHhVUldvT0xOTjhNVnZWU0Z3Y29oaHJ6VlBCYlp0bDNyUUZBNk4wc3dQTFMrZlZFZGhQWTRiSUJ3RGxYcU1mOEtHYjZVVlNCb09hWUI2ZVY4NDgzNmluREZiWnBNSnpMQVFCeEQxb0xZVE5TeFo5UEFnRFE2NUlVQUtoWTBXTTQ4SHphNEN4UnUrVUttZ1dicmlBOUd0S25yd1VBME9kNlEzRi9WRWRESVE2VUc3MFNzVm4yaVdpRTVNdGRBSVdzMVkzRVY5N3NTOFI1Q1BVZm11c3I0cFhqMnVMOUh1OFYzNjZaeUtydS94dUJXMk5VRmdEeUQ5UnR2SkVnQytCbkYxMGZZVDlHRm9CUDNFWFhjWTVTUkhmQmUrbmJoMjlyMzFibUZoY1I0elc0U1dzOFo0UUtlcWhmM3NmN3huTmF6ZmN0cyt5NzFnREFrdkRPdWJDZVNFOEtYS3l5QWNCeEFaK0xybEN3d2tvL1Nsb2dpRFVGRmd6RHZ1enNuSDgxN3BhNmxlL1FUWExnSkQxbzQ0WXlCc29BQVBjckJBQ3FOSFpERG8ybzZtQjdRRXJFMUVKazNSNmVFQUR3TXhpL2ZUcVFseW1zMDAzdWY2M2pFUFhNT1VxL3dtcUErNVJsTUFFeDlWWWk2T0UrVWNJUFYzRk1NdGRhbEVhclRySjZIN3NXZlJ5V1RnQkdxdFBoMjV1N0VXR2lHY05WbXdRQXZBR1FlUUNHZk0vRnE1Qm8xU3pCekJDc3RJamxVWGZnNzBNSDZkdll0MjhOK3FvQjdoc3BaeHNBY09ONGN0NUFuM0dhRHdCazFmZEpBUUJ4VWpON0lRUmNNd0J3ck4xL1h1S092dlNqcEFXQ21QbHFDYVZnM1d1c2NhN3VTNStDb09XT3JZVUg0Q0FGRDBCYUFPQ2FoSEtlQUsrQTY0T3IyNCtGaTdBMitFa0NBUDhPY1cxMG1mTmFZWEVVSmFQZWlmSE1uTEtKQWxHYlJwWUI2a004ZGNVVjlWRGdaY1V6MTdtWWMyMFZwV2wzL3VKRFBxK2NwZFRaUkRuSzZJVkR6eGFHaWJpSVVTamRNTW9BYnNGTmx3VzVOaWtVNk9NQW9ITG1qcEUycHU3MFpYanV1SEg2dDZsdmF3M2lmdGU4OHh3QnJ4eGtqMWpTdG0wdVd1aHFNMEdMQXdEUzZ2dWtBWUM0SGdBRzlsVURBTWZWKzg2Ni94VHdpUnQzakNvUTVNdEpaNWIwbHJNci9ZMUM2R0hESUxGWnVhMXhENXlRZnZ0bVFnNkFWYXptcEFBQS9YWXFRVGtMakhwMFNhdFU3M0pLSk1DMEFNQnJTcEZpTGdEWDRzYjhmK1dpSkpVdlJvbG9saHhGcHJ2S2ZxSm0veXNBQVRqWGE4WmNSMjF5SmYrMUFnbXZ6eFZLOStMZTJJL0p5OUZhSFkyZVBHV3VCYkFOWVNJRVNvZVFwclZrcEJ2R01aN1dmTE0yK2dxQkM5NGpHSlprK1dLTnNjKzQrRVc1M3NhK2NRMWl1dVlFOERWV3dHN3Z3RHJVTVRWckIyWFFtMkptaXl6R2JKeGltR1hmSjRrREVLWEcyazhYMkxpazNGUUJ3T2Y1OXEzN1R3bmZhMGJjc1p3Q1Fjd2o0UHpsSTFjc2JidEd4RC9WeUY0MURtaXJIa0hjTElCQllPbHpXTVBLM2M0NkN5QnRBTkJBV1J5b1FvVzEzT2VwemNYSWlLZ1ZDWEFKYmsybzJ4RGlBeWdaTUdrQkk1d1BUUnNkOW1RWjNLV0RHbFBseGwxeG9TanNkOFlsS3dha2ZZNkNaMnlXQURVRFl5c3pSK3ZlWTRpUGxjcXdHdUNoNFRiV0d5dUdZY3FwQnNqelBRc2dGUTlCVkhsckRkeVVHQURwSldJaUFaditiZXhiUGJaYWE2QVRzb25HeUd1NUMxNm9UY051Y1NFMEg1bk5rbVMzbXE3OUdWY3FNcFJsMzdVR0FLSFV6RDN3WGpMSGhrbWNiNXd0MzU0NkFQZ2szNzV5LzFuRTU0cE1ZS1VGZ256MW5kSFZlQVNIbTk2NEZvR2x1bWFrZjYxNkFFY2NIUUF0c0dDbEhscThCcDhPZ0NYNHNnQUh4cVRSZjdVQXdETlB2SEhkRlFzaTZVR2tHNGs1QWp0bEh0UlpBWUFweWhhSnl3ZElVc0lZMjVncjZDUllKVTIxK2lXV2VkWGJlaS9rVzQ4WmZjZUo4ekdaVTlmVUROenMxc0dvKy9ZaGFuTmNFY0l2Z2hiMEVzMUNiQnJESWovRHdiRUZIaG1VWHU0RndCSFhlRnJ6UFVvTk5RWjhJbGRIZEdob3RiaHBpb2NuT2FUZmxyNXZBRmNFUVFCN2QxYmh1KzU3RGhZdWhkNXFrTlBZKzRtbGhrY2hUUlJERUZneEVYVmpzdXI3SktRQlJxVUhXeHliV2VPYmI3dFNPZWZVQWNDSCtmYWwrODh5dmhmQnNGVlNJT2l4eDRpaG90c1J1QnMxTnJnSm9RRzhpWEQ2Rjhkam81UUFkYkZvS2d3cjllMEhNaHM0QjN2SmxVcFNvdElneGt1amxBRFRCZ0MreGJ0RDhmUlZTRDFhZ3h2Q2F3OUs3VGtCQUFERmxVSjhBSFRWSnhVQzB2Wkt2bmtYR01ablJwYkJUWXJYTjBPc3ZsZjZ3WDdqRW4wc0RzMEtmTE4xK3FaeFMzVi9CMFRmSm1JZ2o0SHJlZG40YnVnMnRxcVY2WGhKakNmUGR4ODFYWGV0RVRkcFZ1VEVDbnViNEhXMFJKMTYzdUsrTHhzZ0FHMzJHQUFLRk9YeUNUNnBwUHZkR0xZZmE2ak1nK2RtQVE2eUhLUWhvbmNxeTc1ckRRQ2kwb1AzQWh5YkRjcldRanNjVlQrbWJBRHd0M3o3RE1pQVA3bktDd1E5TWNncFU4UWoySVViNTJ0aWQyS0JuUjI2eFkrNTRuS3lEUkVwSlh4N1lkMWxGSmV4WXFndEJ2a0tTVHlWMUFMSUNnQndXdEFHY0RmMmlXbWNnd1cwWi9BeE5FNVZhd0F3N29wRmRDdytBSlAxa2tvQnE5WjJoeHlPTGJLT0d5RGQ4cFlRWmk4QUNGQURYTzhLRmZmYTRCazZFeko5ZmZLeE8wQXNSRjBIWHlFcmRQK2ZsejErMnhYWEsrOXdoWHJsbzNBYjhYMDNkTGxhOWNxVEdrK2RuellBM05wYTVSa2JuYTB0c2tGcG9yZ1BONGxsL3pyd0RHOXIzK2NCQkR4d2RyR25SWThId0ZJOVZRQncyeFhyRjRSU0RMVlUrU3FBMHkwSWsxcWUxU3o3cmpVQXNBajBTeFQrOW5Gc2R1RXMxQXlrdUhhNGJBRHdsM3o3V01pQTUyUkJWVm9naUJVRng4Rjlqam4vRzNRSStaalllUGdqVS9XNUdMblFnYk1GejhxcFhwWjNJV2sxUUt6Y2hmM3ZVU3BPTlFBQWNpOEc0ZEJVajhjMnNNWVBLVVVvQjhoMEhySTcxQk5TYXdBd0ZBQmdxQjZKNlhxK3ZnOENoSzBtSUxMV3kvcDZLQWZwRFRuOGY1VGI5QVhJMmI4alJ2aUovTjR6NmFmSnhhdU5FUWNBY0JWTHJvUTRRTUQ0b2V6bHk3SzN6OGhhdVNOdTNnWTVZTnRkb1J4eW5Qemxmc2dWeDhQL1hzQjRIZ1NNWjVQTUY3ZEdXZU9QQXlIRkxXZFh6anlBRzllV0M5Y2plRnY3UHZiYXFtZ1VsNUJtb1Nma0FEQ0Jrek5HYnJuU0tvWldpaUZXUVVVZEF5ekNabFV5ekxMdldnT0FCdVBzaTVPS3pkOTlOWUVkeHZUUnhBRGdUL24yZ1pBQnZ4UGpkdDFWVmlDb3dlUDYyb1JidmNiOVZ3eFc4SnJCeEI2RncxK1pxblZpZEswREp3ZmpiRWFrdnlIQVlDUGFTQitVYXp0dmU5TElObHl4d21FNUFDQUhCM01jQUZBSHQ3cGVJS1FwcVhJRlhQNWJFSFpaSjM0QUZ0ZnBCSmF4YitIRkFRQzVCQURBMSsrSUt5NGNsYU01c202WDNEZW1FRmtBUUEvOVI3SzI3b3BCdkNZSDZYa3h2Ri9LZmprdlJ2Z25NY1IzNWZjZWdWZWd4Uk1YOUtVeStRREFGb1RMTnB4ZENiSER5UDFYd1BLRlBPdDErYnRIOG53KzFqZm1vMXZwU3kvQU82SjZGSmJ4eEhlMWpLZkduYms5bEQxeXh4TlMxSlRMVGRpREJ3REFjM0NMekJIcEdHK05iMnZmMzBIWTlvRnhZVU5ic3VWSi9XTjdweGtqVVNtR25PWjZRSmVKTGJpOGNicHVsbjFIQVFCYzAwa0FRTlR2S1FEZ2R3dWxZdU43NGFWWDl6Vm1JRmwyV0VPRG1EMVRGTHFOQXdCK24yL3Y1ZHVuK2ZZMWFBTEVLUkRrcXd2ZTRFR2llTWd2UW14M3ptQ216NExyVitPRjNXQjQ2bVhDYnhQcmNzbVlrRkQ2MjRMaFhXZ0g3OElUY092MEFHbHFCbUkzdmpTeVpWZXErVDBaQVFDUXVJT055NjYrTUFDQTN1cWFZUUVPZ210WFk3dzZKMHZBaldEbWU2aXluclh3RmdpdCtyN0hrdk1YdDRqcXQ5L0liUEF1ZmxjcWFiMUFLVVJ6UnR4YzUvU1dHTUpyY3N2L1VXN1IzOHJoLzRrY3FOOUlHdTBGQVFnL3llL2RBaEROTWMrb1NtelBQYyt1YTJvSk1qcTRFbUl6M2Y2dkNNSDNLM25tSCtRNXI4dkIraEJTQTN2Snk0VmxmeGVORzZPU0ROVTdjdGx3Zi9LY3o5TWV3SVBuRnJXYjhweFhBeW1YODdRSEVWU3RVcXJuR3V4N2RIKy9yWDEvQ3hlMisrUjV4ZlR0WlZnM3lwN24xTC9uQkJvZmdpM3hwUml1R2dBUDB3em40WUJXZ201YnhuMHpBT0F3QTY5cExtcFg3dS9wR282VG1ybEszM3pEU0QrZWRLVjFUaG85NUdETW5wbkdpMndjQVBDYmZQdHp2bjBraHUyc2kxY2dLRlFYSEErMVFYaDVQT0JuSU8xbDNHaWp3TVRXd2pkdGdxNzA4TDhqaXhWZFNkYUVUSHZTM3pTTmhMMExtRXYrQU9LbDdVYThkQ2FRMW1ROXl5aWsxZDF6cFZLdm8wWksxQ3lnUVk3eDNvRVk3MTBEQlBRQUFXMFVNaFdtb0NrYmRRU1k3NTJVOWhabjRZMENVUE45RHpVK21CS1V0Tjh4enh4Tmt4ZUhtZTZjVGpSdTNKd3hibjVKRHZaemN0djZTanhsSHd0by9rajRNMStKTVQ0blAzK1J1RFFZUm9wVGk3M1I4K3hUc0o2blhLRVFqMVVKMGJyOWZ5aUE1UWZhNHcyR2x3dkh3dkY4TjBiMWpuQWE2Z1M5NTRRcnJXVDVGSURzWldpWDVQblBlMUl1aHlHclo0N0FCb0phTHJRelN5bUdiMnZmMzdqaVdpNmN2ajNpaWtzNFR3R3JmdEJJL1VPQzY5MFlLWWF6Y0tGQWdEY0hSTkVSMkx0cXY3UHMyd3FIcUMyYU50WTBlZythSy9pOU92QldoZDV0T3ZCdWZPbDk1VXJybkZqcHdkalVodi85TElzREFINmRiMy9JdC9mRm1IM3IvQVdDNHRZRmYwcS9NMlNrUkkwQ2thamZhSy9rSmJxQWtQVk1KaG9QLzB0MDJ4MHhKc1NYa2pVS04wdWZkNEZKVXhndkhmSUFHQVV2L0N6RHRHRFJ5NkxpUGYyZWxLaGhBdzArcEJTdjZ3UUNYa2kvTDExQlRHWkFuaHViVmhqc0krWjdvM3ovK3pFV0hyNWIxUGRnNHhPM1h3UmdJMUdMbjVqdVduVUwyd0I0SVpvOWNmTnY1WUQvUW03UXgrR3l2OHFlK1l2ODl5Y0NETTZJVWJhNE5NMlVKc2pQMGcvUFhXYzhPNWZpSFlMZlliQjJEdzdsYzNEN2Y4OFZkRC80NEhoTzh6dHN0QUZYcXJWd0Z6eFEzN3BpSWFwWHhydGlhaVVxTjk2V20vNFBjZ2s1SzZHVzcyUk83MUhLcFFxbzZCb2JONERHR0t5VE1Xcm9OWGxiKzdiU3Q3SDJBSmR3SGdLYjIyMmsvdWxsNHNlSUZFTzBVZGJ6ajhNK1Y1dlNCbUhiTFB2bThIVUhwZVphZTZnYk9CRGwvdDVqbVQvZnUzRjY4SVJ4R1JtalMyOG5IZjRQbkMwUWhxMFh6c3dYY1FEQXYrVGI3OFNvZlN5TENnc0VJYkVoYmwxdy9CMTllZXVBN3daaUE3Y09tZHhtbVlCNk9JeHV3K0YvRG02NzNVWTZVYThuSmFzZlVvMUMzb1ZyNENyVmVLbHU1RzRQZ1BHbE5mWFNncjFCYVZsdGtFSm1wVVJ4UHZvOVdmQ2E0bldaUUlEcXlLdWNiQWM4TjdZdW1YT0wrWDdQRlFvTnhWbDRiVEcrUnplbDE4WHQ5d1dsMlFVWFAzeXZOdW0vaTlwTFY2aXEyQmk0T1g4c3QrZjN4RnYyT3dIT3Z4TU96WHNDQkQ2V24xY3V6VFc2N1dpYTRFdmpXVHBoWFR3MG5yMWI1a2RiTnp6L0N3SnJOMlgvbnBkRCtYTjV2ais3Z3U0SDduSDJjblhSV0QwRXhsOFlOMFlGR25Xd1IzeHozZ0dBL2dtdFkrVlhmQ2x6K2JtRUp6SGw4cGtyaUE3aEhtU2cwUTk3bnh1VzAzNWIrOGIwN2V2Z1VYeE9OZ3JYakFMOFZ0am5Hc2E1TGpiMXJDZkY4QVdzMzU0QXdPc25rS0UyU3k5dldmWjlGY0FRZWtKOWEvb2xBWWh5ZjAvM25TODFrOU9EQjR3TEFINWZ0RXYvbFg3OHE3VC81RHY5cDN6N056RmtIM29NR0M1ZXl4ajFBT3U2eFdQMHJBTytGWmoyM0o3TDcrdkJyNFNzbS9LUkw0clIrZnBYcDM5Ty81eitPZjF6K3VmMHorbWZ4QURnM3lBVEFQVUFyc0x0NENuZEpLMkdOL1dINEU2cXRJOXJkRFA0V0xRTDNzdm9tWlVUb1dEb2V3SkRpaEQxbHNQNXkyMENnaENWM29iY2NiMlJIWWRjL3Bodi93clAydXpKaDdaYW00emZBdStoYVBFaEViUE9sekVHOXY5Q2ZyZkI2Ri9UNHI0WEYzZzU3eEo2aGhiNlJsbjFYMGVwZlpyZno1NlVGbGZRdlBkNXJWcmdWbDVuRU9YaWZBOSt0Z2ZHamFuVjgxNllQLzlZOXZsL3o3ZC9sdjFleWZvdTZiL01kNG56SFZ2SnUxSE9PS3Jib0RvSW44bmUrNE40Y2Y0aDMvNmZtTS9UNXZ5aVVEOVJ1UEM1UEV1Y2R5dG5EaDlXOEwyK0pRMkJ1OUpmSGF5dEZrUEx3bHJuVFJGMjU5c0s5cXhsZzdBRU9ucUNLN1doTDJSdUd5TGU1U0tjYS9jaDAwZkhidlhZaHc3NkZxRjNTZm85SHlSZFB3Z0EvaUNIcWJvR2tRUjRQOEtsRk1jOWVLK0NQdkR3MUEvd2hiZ0VOZTZhOWpQL0h1YmphNGl4Y1R3MzVPTHVDcmlIenNwQitaSEVrSDlMejJxNXdmczg3bTUwQmJOYjd6SEZncE9PMFd1NG1rUENPQW9DeW5tWDBEUHdOOHFpZi8xV2VQaHpSVDUweGFON0ZzTStyeURFMFFrYnRaenZZYTJqUnhSWDdQYThGM3JqR21XZi8wOEk5MVd5dmt2NkwvTmQ0bnhINWplVU00NHFJYXByKzB2WmUzOFdNUFRQQW83aVBvOHZESGZURTBycGpmT055bnkzY3IvWGVjTlYzVUNobTI1UDZCVFhlVmNNdTNPK2dqMkxkaHJkNGhZWExBMGIyaDdqWFJUb1BZQ0xRVE9GTC9vODg5WkhZL25lSmVuM2ZKcDAvYkFRMEVmayt2OEoySXpQQXFTU09BU2hLR0tLcnc5ckE1OERVcEF5cjc5UCtabi9HTkJGNEJ6UHdSaEVQeVNJb0NMYnArTEorQU04cTQ4QU9Pb2h2Q24zWXNBZzlqVFNBazQ2QmhOZW9xUngxY05SenJ1RTNwRy9VWnI5ODdlNjRvblpkaElaYndSSVdhaG5Qd1lFcFZmT0w1WVQ1M3NNQndoS3lDeTJTSlpEa01ueFF2YjUvOHEzLzljZy9PcnRQKzc2THVtL3pIZUo4eDJIS0wyeG5IRWVFOEh3YXdFL2Z4WHcvYi96N1gvRWZCNkxpS3NFeHJ0R3luQ0lyRnJwSEQ2djRIdjU0dFFkUU40Y0RLeHpmWjdCR0hibmNnVjdkaGpHNlkvSUJxdUdEYjBNWGg3a2JiMEVuaHZhQjY1M01VTDIxSHFYMjJWOHo4YWs2d2NCd1B2Z1J2L0JJQVloUzN2RWt3RVFTaEdLU2szaFBnWTloNmVtQ0YyVVEvUUhNVjZYVW43bXVNcUlvYlJEWDRySURRaG5hRnJXbjF5eDB1Q1VrZDQyNjBsNXMxSjdMSG5XdTJXTWdka2RuQ0w0MG1Dbkt2R3NuSGNKUGNNWTVlbW4zVCttWmQ0SXNMYUhJUFZ6R2xLenNOTGZMTXhacGQrRG4rMkZLeTNsTytGSnM4VGlLTWMvLzkvRTFmMXJBTGpxL3Iva0VaSUpwWEZ5LzBuZlJlZTFQL0E3WEEyd3ZjdzVlMHBhR1FxKzN4TnYzLzhSNzBpY2RjWENMTmkvbFRMdFMxZXRkQTY3WUQyVjg3MnVCMUx4Qm1tZHp3YldPYWNVV3V2OFdnVjdGbTNRR0J4aVBZYW51RkliT2s0WlNwMEdjTDhPTi84bUkzTkxpMzNOa0gyWWcvVEZLRzJiQjJWOHo2YWtld01CZ0I1MjZrWm5OcW5tYVE4WndoSlJJaUVQWTRoVFlCOHp4dUdKeU9nV3hKMnZ5T0s2S1grWDFqUC96WlhXUnJqai9MVVJsanhpTlBpQjhLWndoVkt6L3VwS1N3NnZ4bWlXdUlkVm9FVlQyNUtPZ1lJemxraFFsK0VLdlZIbXUvZ2FDL3UwcHR3L0N6TmhEcTh2YjF2WDBxb3JGb0JhZzNuekZjekJ0TGVvOStCbmEzR2xBa0d6cmxSc2lvdWpkRWlNK3grRmI2SmszeStCN1gzTEZWY0FEUWs1V2YwbmZSZWNWNjBSd3IrakVzZFlqcnFjT2RPQ1NOZmx3dkN0N08rL0VRQ0lzNjY0LzFiWVh6N1J0RVhQM2tvNmh5eFYzZ21ocWFUZkMxbnllUGduV2VlV3FCRGJIYlY1NWU1WkZyM0NTeUtEZ0VwczZDSzlpMi9QNGptZ2g3L3FYVXk1Z3NBWENqaXhiVkI3R2xLM1RmbzlYeVRkR3dnQU1DOVlEN3RIaEM1UjAxaEwrcW9Lb0ZhellwbFExWlVPU2FHaXZDS1d4UngyeFNWR244b0dld1JpQzVic2FoclBIRlVka1NjYTVYNTNYRUd0YXhSdUNrMmVuR2tsSkNFNFduUUZpZEJRd3dxS0tPT0xodzdPWDVJeGRseXg1R3lVUWhWNmFzcDVGOTh6V0pLYmFmVnZTVE96aXBlbDNJYkZubmFwK1VybURwUFJyb3Q0RDErZEFwOU1LYjZYVmVVdENRQ3dKSUdqK2svNkxuMDByMW9qQkwrOUZ1ZENBRkRPbk1VRkFGSHJTbXVlWUdsV1ZBeTFaTk5SVXJtU09lUlM2SGk1S09kNzNhZDhkeno4NTF5aGRnaXU4ejFZNTJvYlVGYVk3YzRMOEh5V2E5L1lCbGsxWWZRYlpHVkRPK2xkVURRTGhkc1V4R0o5RzVVeVZ0dXdEZStDQ3JRRDVQVk8rajJiays0TkJBQmZ5NDMwa2tGazZZVGJCbGMxd2lwNkM4NnVSYTZ4RWtzS0ZhdTZjWjNrY1ZkYzIvMDVzTnlWREtXRlZ4cUFJSlRHTTMvaUVkaDRCdTdYWVZkYTYvbU5LNjZPcUVWcE9DUnkweUFrV1IvdndCVktHbHROaXhsaElSODhkRGkwa1hRTXEvOFZtTGNSaXMrcSs2cWNkN0ZhRWdCUVR2L1dnV0hwZUtOMnV4Wm4wV3FWWEdCSy85K3U4VDNRYUQ4THZNZGhHUUJnRjlaZlZnQWcxSCtTZCtIREJndmphSFZITE00MUNvZEtPWE5XQ1FEUWRZVTFUK2JCUHVIYXg4dUhWVGp0VFpsenFGVk5mVlU2eS9sZWo4bWVEWkpkMXNNRGk2WmhwZFlqK1hjc3lZdUZ1SG9vaEZ2dW50Vng5cHhkRlJadFhCWTJkTWg0RjE5eE9LMExnd1c3RHNBMkhNSlkyOFlhMSsvNW9venYyWngwYnlBQTBNUC9taXZWLys4aEk2aTNEYXhEdnVpSmU5ZTdZcEViUnBwb1ZMRjYzcElyMWtYWEZJb09FSU5wQkNZeHBtVjFWUGpNamVBUndkUW81akV3dW4vdENxVTlkYkl4dk5CdUVKTE9DL2o2Tk9MamJidmlZaDViNE0zWWhVM3FLdzNiSHVQQXNjYXdTZ1Z2dStJcVZSaWYxWnRRMG5GQ0xRa0FLS2QvUGpCOGxieTRlcHNXdEVLZGNwMnpQZm9lYkxUMVJwRTJBUGc1WUNEK1FmUStUZ0lBR0RJT0d6V2FXZ2QrMGJnZHRkWUlBUHhIdnYxZlY2aGd1bVJjSEo0NXU4UXRsazcvajRodkZCci9DQzRYR0Jicm96SGpmcTg2VjFxbGNNWVZWNnpEUTU3M0RWWkJaYnM5Um9kWlhabDdkaHR1MFljdXVuSnJ1VGJVZWhmZm5uM3FiRmw4ckU2S2xUcXh4RFBPRzE5RUp3bHNWQlVBNk9GL0IyN3NWZ25MWlRpc0xaU09HeFZkd3FodzEwZHUxUVZ3LytFQmpaT0NLbGc5RUpleCtuMVZ4ak56djJmQU1ONTB4VnJwM2NSaldJZERPQWMzR0t4UnpadmhIaGlqN3dSd3hQbDQySmJCSGIwTklJQXJNL1pEQ0NMSkdNc1F4OW9FQUlWMXF0RlQwd1hHTnVtN2hKb1ZjMDJ6LzNueTFNU3Q1YjBKWVJIVjh0WllIUnBROUFpVjh4NXBBWUJmUzhyYmIwNEFBTUFTMVR4WEcrQlN0a3AvMXdJQS9Pd0tKWHV4S3VJWWtRR3RnMkVONXU2b0FnRHdIM0Jvck5LNjdTbmplekdabE8zWkVYZ2QxaUFXandXS0VCQmI2eHk5cXVYc1dlVWZyTlBoaXVFaDlIU1dZME5YWTc0TDhqM1FDOHhWYmcvQlU2SHgvZ1d3RDJ0Z3J4V1lyQmhnbzZvQXdKSzZiVE02M0lDWWdnK2xXeWxQR0pQSHRKSXhJQUN0QVJyVEEyYUdmbmFVaUNhaGZ1TThzNjlmRkJWU1VwaDFNREM0MEVXd0IyUHhBa0w5ZnF6Ukh2ZmphWnNHb280YUdkMjB1SGl4ZEhDU01hYUJ5YXJ4d0p5QitLZkpDL0NzakhjSnRVa0tOYnhJdVg4cmJ2a1NidjhZWTM4TnQ4QmxJUEtvbHZjVWhiYndtWmJCcTlVSE9lTFZBZ0Iva0lQL0wwSTZyUlVBR0FOaTB3WWNObnp6R29kRHBEM21UVElyQUxBUFhyNWRZMzkxZ3hleTEzTXdjQjlKNXZCbmNGZmorc1BiZHRMdjFXU1FTVmZnSXJZUGRuZ2UyT3RUcnJpMCtKYm5NRU9DMnZNeTk2eG1JQ3pDK2ZEYThNVG9PaW5IaHM0YW51aERnKy9SQzU0ZVg5bHM5dExNa0gyWU51ejFyc2RlVnhVQTNIS2x4VzR3aDlWaUZTNGxTSG5pbVB3Y05hdTA2NUt6SzJGTndPYU82dGYzekZIOW9yYjJmZktJV0FlREx2NDFjRmRaUnI4RDNPUmFiVTQxQVpLNlVJZmh2WmRoNHg2NDB0TE1YV1VzRU8xL0FyNlBHbXk4Q2FHbklla0JQUlNqRFZMR3diTU0rc2ZDTkZ4TGZaRmMxSHdEMHh6bFFRcHQ0VTJLaVRzaFFsdm9NT3VBbGhRQXZDK0gvc2ZDY2ZtMFJnQkExOUk2Z2FvdEkvYmFDNkJNTTRGcUJRQTJJWmFMb1NrTXM2SEhkSTRPaGh5RUFzcVp3MjJQVndsREFlVWNHQU9lTll1MzdFbklQY2RVV045aHhtWExtOHZjc3lPUVJxbjJCL2NoRXpMTHRhRVlLc1k5eTU2ZWpnZ1M3aHZqOTlUR0RKRkhjUXM0RlpzZWttelZBQUFLZ0hETisybVpuQ1ZYcU5PK1JvZHFLT1dwZ1JiYWdpdXViNDN4ZU01MTVGclkxZ2VQNnBmN2pOTXZGa25CYklnZXo4R3dEMFFZRG1Xd213cTVFYWdKa09UajlidENWU2xjVUdrQ2dCN0lDUjd6M0JBc0wwZEx3bkZlQlpwK1k2NklsZlFRQ0xVdVYxeVlobE9xTEhDRm5vOCtjRCsrTW00Rm1PRVNoOUdlWko2U0FJRFA1TUQvU25nbjMwaXJKZ0JBc3BRVlVrSmVpWlZPZGlkREFQQ1BnYjRQSUF4bWhkbjBvRU4zK2lLRWpRNGc3bnhZd1J5eTYzaVZpSGRKdnBlUHpIeGdySFAxd09tZWVXVndIQTRDTi9QV012ZHNMMXk0NW9uc21qT3l1SktPMFdQczJhaDVpeUxoNHRyUWNzVURZRXZ4MlRETG9hWUF3RXFmR3dPMHZnWVBuSU9VaGgyS0VjMTVYS3JXZyswQ1VXSUpjaUpIalJmZlRmREIwK2lYeTZTeXUyeUdEa01rRm00QUtBZ1JobEFUNEljRUh3K1ZwU2JoWU40eFFnQU1QTXE1Y1RMbzJZQllWemtrUFhZSGg5b0k4VW8wRnpjdEQwQS81ZDgrcGMyTmE4VjN3MUdKMGk0eXFJdXVWSGRpdGt3UFFHaU80Z0tBYndSby9pQmVwd3ZRcWdVQU1OU25oLzgyNVNnUFExd2Q4NisxVWwwV0FPQTNRbzZNQWdCODBDMGFnSG5VQUk2N2tGSlhDUURnVUI4VHBwTjhMNThiKzNWZ25iZTZZdEVoNUEzNGJ1YTlubkJ5MUhmcmNnV0JIZDlCV3drQVFMbGU2eVlmQlFDcy9jRWhtbmxYTEpZMEJONFd0ZzAxRFFIVUdlbHo2S3JiQWZmWFB1UTJIbEQ4MjBvRlNZcitmQzllNlFkUDBpK25RK0t0bHQxbEIrUyt4SGl4anpERW1nQS94bnlYZVdwNnlHeEE2TUZ5elNjaEFiTHhWTGZtdU9FbTJ3R3VSdExZOWx5TU51MUt0UlNldVBRNEFNd3diMGlBN3NmQVM4RmxQVWNoeG9nTlhkdHB6bE1jQUhEZUZSUXpmM0tGTXRmYXFnRUFWdWtXeSttNHlQV3dGTmd1WndBQTNoTmV4QjlqQUlCMUNvRnh2SnZKZnh3dUs1Y0RnTysyQ1dTMUhJVUNrbnd2WHVlV1RiUjRBNmh6TUU3cjc4aGpUNVB5WFFiQmJUNXNwRk1la1cxTmVoNm92UEFJaFRQV0F3QURBUUI2Q1prTFpwR0VrVU14NFd4Vld1UTZWWjBFK016RENFVlgzWjRyQ0p5c1FXb0QvdjBteGIxZmxlSHFQQWtBNEtxUkR0bHJ1TncxZFZFM0lTOEdTeE9nMjltYUFGSHZzbTYwVGNwTHp4bHBRdVdRODlCNCttN0VieXJZN0dzeG0rWEZpRXNFaTJxTEJuQjVSc1l0eXUzWUR4eVp5UmdOWmE1YlU1eW5PQURncW9TY1ZMUCtudEd5QkFCTXN2S2w0eUxYNDRrcjFtRC9JV1VBOEpud0lZNTFPRDZJQVFCV2pGczk3bTBtL3gzUWpSQ0pZcFdDcUVObmE2ZkUvVjZkSHFBYk9zU2ZSZHlBZlNBNUNVZGtra2kxMHdheDlzRHdQdlltQ0VOTkE4bDVGZ2lOMjBiL00wWTZOV2FESWVEYkliS21wZ212U2Y4SUJwUTNoL1ZXa090VVZRRFFaT1MzVy9uNUtnSXo3NHBWMFVLTXh1NjNFQUJjRjhOanBVTXl1UWR2M0ZacW9JOHdoR21TVndQdmNnUWhCYXVoSzVWRk12cmhObFZmcHZGc1R6aDM3Ukh2c2h1eitYZ001ZVlVYy9PNTl4Z0FyTU9OaTkyYjZ1NmZoMVJBWDFzZ1lOeVIwanp0d2xvTEFZRGJjZ2crRXU5VEhiV25ybEQvSUFzQW9HbFdiK2hRbkRVOE1jcjEwQXFhVjF5aEVtaGFBRURiMTVLRjgza01BTEFFSVRCTDc4TkgvbHRMRVFCd3FoN240Q2NCQUx6T2R6M3JIQm53V1hxSXJIM0RxYlZ2S2pobmxvMjJDcW5VKzU1TUQwNERaTDBIRmdMYWszNVFGQXpCZ0NVVnJwNHZYZjlWQlFEczRzWkZodWtkZXNpTkF6dDh5Y09ReGNYenRnRUF6WXF3bEwwc2NvOGFBVXNjeU1yTHR6UUJ5Z0VBQndBQWRnQ2t6Vk11YmlVZWdEUUJ3QnN3cUZHdEhBRHdzNHVuQUxoYklRQ1lCZ2J4TEJpb1VFdENBa3d5VDlwZVJ3QUExZmRRd1pwbWFsb0xQUXNEajBZUkFjNkdzd1c1V0h0ZHcyVGZwd1FBdEYwUVlIRXVBYmpnd3gxdjN6NzdzSndpQUVDeG5uMnlNUXNWQWdEZk91OEJEazVXQU1DM2I3WWdCSDNrL0lxSW9mMzBtZ2k1MkhJQW9BOWRzUllGZTdMVlpqTmZqcVdBbFMrSEltMnZJWHl1SGwyVVZtZlo0YW9DZ0ZaWEtteGd1YmoxUWZzTjkwY3VrRDd4dGdFQUxlc1pwZXpGNlRoVHJsUWVHTm55ekl4RlRZQktRZ0E1STNlWDVVS2JUd0FBaU5yczJEYktBQUNoamM0dERROEF6NG52Y040dk13dGdNMEdMQ2dHZ3ZrY25aQzUwQVpHeEk4WTNMemVIL1RXa3dsa0gxNVRCL3ErSC9hR2xwaXNGQU5pdUNSL2ljb0srMmIyUGU5dEgvbHRJRVFCTXVWTGx1UU5YbklPZkZnQ29oZ2NnQ3V3ZXVsSjViZXVTRXlJYS9sOTVMNnVwUFBNZWVGRTFYWHljdUd3S1NsK0FuZXR4cGNXQWxzQ3pzR1dBQVg0WGxoMnVlZ2lnblE2NUZjT0Z4YXAyZlpRcVpURkl4eUd1OXpZQkFDd3A3RlAyUW5LUEZXTmVJdytLcFFtZ3BMYTdaWkFBRjRBRWlEblZ1d0hBVVNrSFlJN0EzazRGaEovRkdJMUJ6SXVZYVlETE1kcVNzelVhT2dPa1IxNHJ2bUlkT2JoWkhGVUFBT0xPVXh3T0FLYjQ5aE5wY2RBVmwzbE8wOEQvQjYzTFZVcXJSR2xwSmtscVpUUU1CVlFDQUxqZGM0V2lZajhsMklOcmhuZDBKa0QrUzF0TFlRb0kyaGdLMklEREp3a0FLSWNEOENvbERzQnJGNjlnajNyUmxpbGRGRy9uNVZ3TTl1aWNXM0RGUWxTb1JhRnJFWFZ5aHFscE9lQlpTSjlITUpBenlJTExSbml3cWdEQTkwRkRpd0hUd3pBUGZmOFhBQUM0TEtwVitDZE92SmtSUDZmVnFIRjZVRVlhb0JMUE9Benp1a0oydnBVRkVCSUxZU0pPa3BTZk9LUTVEbU04TG9QczQyc1d3by9LQWtCMnRLOWM1eXE1aWlzQkFGSHpGRGNMQU5PM3hveCtKc2lncGdVQStIQmFjS1hLaXVqU3hTSmdLditMWk1CeUFZRFY2cVR2Qnk2K3hvRHZsai92SWY4dHVXelVGRkhtbkQwcTVXUUJyTVhNQW1nS2dJZEt2SUp4U2dMUGUrTG1HakpLZWpFSUVmL1E5YytsamJzZ1ZYN0tZMWRVUkcwYWlJWllTWFEvSXJXNEpnREFZb1Q2M0VIZHYyQUE4TlNGeTNwcTRaK29XTFBHWlMwQkdYU3JKYzF0VnlHZ0lZUEVrd1lURjNVQWVpbTMzYWVJVm80T3dKQnhFOFdtZWZxb0JwY0VMQTFIdEFFRDRZZHlmSG16RHNyOEsva0syM0tLQU1BM1QwbDBBRmpIWW9HOENQTkVlRW83eHFzSHZDVURiTVZkK3dFa043cHdxZWtvQU9CcnpRSXc2aFB1UVV4Snc3MXRrZi9tWFRiMUZDWThvWUF0Vjc0T1FKVGVSVXVBTDViRzVXUFcwekNGRGhWblgxTEdTTktMQVJNcVEvVU1rTFNOS1lDTEFjK2lab2FNd1dWdHdmQ0NWYUlFMkE4Z0pUVUFFTmNEWUNuUi9SSUFRSVB6QzE3c3huUmJhZHR6dGlZQVY1Z3FSeWtycVJwY3VVcUE0d1lBMmpmaTlOMHV1UkpnZDR6V0tadXd5U1hYZys4SnRDNUF6NHJ3TFNYQUxUS3dTMEJjR3dRK3dLZ3JsbWRPRXdCMFU4dys2YmUzWXI3SUllQ1VwMWN1R3luZzhmK2Z2ZmYrampUSnJzU29JNGxhVWFzVnRlU0tJcGZjSFk3cDhUTnRxN3FxcTdxOHJ3SUtLSGlYOENoNGt6QUplNEJNbUFTNnlWMjUxY3FiYzJSK2tmN0ZFTkFUcjNHL20rOUZ4SmZJckJxT3FzNkp3eUVhaU8rTCtDSmUzSGp2dnZzQUlPMEYrQURUZEFPclZ3bzQxQ1RjSWQ4L3RXL2VDN0szTmZMZmNwTUFBQjVBQ1A3RjI1S2lCS2psc211S2w2aThPdVJxQzJWWnNyYjFYQXBtbENZeXhGaTREZFU3WDNyWGZKNkxnYVprZUJMaFVNa0ZSQk5Rc2hRL1J5RGtOa01YcWRDNnRVTHlSMDZYV3g1UXZQSjFjUUMwRUlERkFkQmVFTjNkLzFBQkFCZitzU1F2dHhLYVJnaGFvSHp3MTY0K2RidTNybFo0cEZFZWdDbkljY2RiMjVHcnJYall6Rm9BNHZGQWwzRGVRNkRIYUZKUlVtNkFqd0paSDhkS3JGREVPeVpkclR4ek13Q0EzRnI3R3dBQXRsMjJpaVh1Z1VrQWZzMEFsM2g3MWVSdDBSc3hBdTdubGdhdkxmWUFwZmJOaFc5OW04d0FBSUFBU1VSQlZIN2swTFgyZWpNQWdGWHg5QlRZN2FGbmRRZXltL0xVdk5BSzRXank1M2x0TmJZUkF1dzkvbnU5aHNQL1hoMXJBeTkyV2lvN2E2bElPR3FFOXJrbGovNFcrRFV5YjNsa2lxMW5vQXFsZURMSHdTdTRIUG1iR2dBUTBqOC9JbEtaWkFGTU9iM2twWGI0YUZVRldUcHlDU2FzWGdEUXFINjdYTGJ3RDJjNkhKSjd6MnJyU3Q2d0ppNXhsV3BaeFNad0FMRHFsOFEydVhnTDN4Q2FXUTJRWGNMMUhKeHQxRjc3Zy8rbHYxays5TXh3MUgzQUE1RGRyTUpFWHFMVTJBVWl4allhQU5SYkRUQVU4ejJrMnpkV0w4T3dqMGI4ck9md2V1dHFxNEJXRFQ1QXZlV0FVOXBjSW91YysyYTdKK0RsMFBEMk5RTUFvR2diQ3RHY1FnZ3l0QjVDK2laYzlSTFgrWUxMaXZOd0dWeHRiZFNqUXRvSHJkY2YrbDIrcnpZUEJnVzAxME1RdGVvWklCQkZqUXF4UGErVjhEZnp3dGcyaUYxWVZBRGJTY0J6cGQzbUdaekplcHdEMjhOZUliVklFNmNCeGdhRllqZW9RMTlTZnBjUHVVSEYvYWhKT2xwbEU2MkR1bG45OWpxNzhJL0c2dGZhbk1LYXI1QjNKRysxTEt1ZTlaN1RoVUhxeVFMZy9xVU9SRVZKT2NKaUtMaEJHcUhVdHdHa3NYcEpoa3dFZXdidHFiODVQUEpwWmhjcFlUY296VWx6czNLZGRIbEhsbWZHVzhYdkF3RFFNbjAwTnI2TVp3MnlXY29HOEt2M200eTdySUNLeFdaSFFhdWhPdGR3cUxGRWR4NDN0ZVlWMUc1Yk0wMENBQklDeERVcU4vaHZmUFpGYUQxb0NxZnJUaS9SdkVVWktTek93MlZ3dWZaSlc1MXJ2UjNhYXlCdFB2ZDc5NEc3bElqK29vNW5XS25zZU9uRm9sOENacmdxN0pZQ1luSE9NR3RyUytHL3NLTGtrRUsrNWpvUStBek1EQ3NScUs0YTVNWitCQUNoR3kvV2Y5K2tBWldVQmNNcGFBVWkweFdOeVM3QkFwTkJIRUN1cUhaUU43TmZycFBOUm5BOTRMS0toUTd5cHVnZFJESU5qdURkdE1NNUJXUWNHSDFYWEZhRVF5dmVnbTdhVjY0eFNuMzdzTWl2b2l2T3FXRDNmTHZyamNkdGYzdTRFSWI1ekJ1YWJtTDZJdEE5Z2x4ZUtZWVZrbWZtVkxmM0JRQjZYSzNVTjNKYVRpamRpcVcrVWJ0Zkk0ZmxIWXMydDhnSDJBRURQSjE0U09kWlcxY0ZaRHlIM3pxOVVtQXpBUUN2VVZSdi9Uc1gxNFd3MXZrKzdYbFo1NVk0RDZheldiSHpldmZzYzk4WXNGL3MzUXR0aUM5ZFBpRW5LODdPR1JXbzhNcHJYUU5PT3k2cngxSjJXUkV3MlU5bDJuUE1PWkIxenZvekcyUi9qcFg5aXFtR3NtYzVaUG45bVlNQTRJMXk2OEdZcjN6a0EvOHpmRmhvTU9PVVY2d2RpcElqekFzTWhWVkM2U1hONk5kU1JReVZBa1dYbFVZZVBETGM4eWxDR2JGTWd4TVlxM1k0eDhJTTN3VDZsZ1ZkZ2R1QVZyd2xoYWlWa2psUnBjWGJhQUJ3eDkvMHYvVHRtamNnSDd2ZmxjcDk2UzRMZmd4RHFBdGRucGpMSzhDTzVaa2xGbnlna051dU1vNVlPZEpVbCs4SzdQRUs3QmtjendtQkhUNlVSNi9nNHVXNTVWb0JaWVVQTU55Z3RkVUlqNHlXR2FSSmZ6Y1RBTWhCcE5Wdk9ZMDg2eVhZZlE0bmJJSlhzUXByQUJzTDJtQWhPSTA5ZjVVOWUxOEI3Ri82Vy8rRk91U0ZuUFBQNmlTSVRnWnUyUm9Sc2s4QlR1aDJGOVhMcW1JYlRzQ21IaW1YS1p5M0huby90RCtIeG41RmRkaGpaYy9PSVBrY0FRRGZldWFVV3c4ZUJqeWdJemg4bU1EVHB4Q3JNUFluaTZucWF0WFREbHl0N0NZZUJzM3FWMHR4RkZaL0tJN2ZIa2tmck1EdEpzWDRwR1FaNEMyMEJIRWg3WERPK3d4RS90dEsvMXk4NVlXelJZMHFkYlpVQUlEZkowVU85aE4vNlAvR0gvdy9kNzhyRFBQVVphdGpqZ0xwcVFodWNWa1RoN0FmanR4bGllbDlmN2h1UWhnamhjc1FHOGViUUR5L0VpQ0Fjc0d2T1FBQk84WjRjQ3hTdUdmWmlJdm1IVXMvekMzdlhmdzc1ckkwYW0zbDNZTVdqMkdEZm8vZHVaWllWQ29BaUswSDlGWXVLZTlqUFV2RXpyQUs3RnNBQWFYRWRiSGo5Rkx3S0ozN3RBRjc5b2JmdDE4QVlML1l1Nzg0YngrZHR4OWVZUTFPNTV3N0JFNUl2Sk9pUXJ1UmVUc2cyOEJaTDUwdXEwTDdsa0RBVGtML2NsbmpQU3RrNm5ZRUFGanpma1M1OWV5NnJKd2hsZ1ZtRFhvdGhhZFRXYWpyaWlFOXBENDV4WUlQZzJiMXk2Q0NtZjFXa1lqbmdkZ2EvdjJtcXkzWHl6R2ZyY1JXZ3JqdE1qRFR0Y081bm1lVUlPeURJaHpZUHhadnVYdUZzV2h0dzlWcVVNVDY1KzlqRllUNW1UY2VQL1lHNUYvNHVPSnpIN2ZzVmtEQU1oaklMWGRaR1ZQYU5zM2JDaEFadWVCTlBlUFFsTmhLeWpkaklwYUFHdHpqYzJDNHNEQUt0aTBpZ3MwcXhMeVhkWTVsVUlsang3NS9vOVpXUFhzUXg0QXg0TTNBM0Z0aVVkbzNxbWNPVVpOK0RteDI3RmtQYVowUEFnaVlwM1d4SFZnWFhOUkdEbitzNS9DZ2dYdFdpamY5M08vZGkwcU8vL0s4L2ZNNm44RktyNXNKY3lmQWlVSEFBcEMvWmQ0MCs3Qkp0b0h0dFpDVXV3ejdZKzNYYlRvVGlwU3VMSUpxMzJYVUlBQjQ1aTZsYi9tQks3QXhNWGQ0RnhZQ0ZqWFFCbU1WVDJCRHVnMkQySEMxSWd2cnhEcHZWcjhEUkZSaWRuK05POFVmZ0UrTjJCcjNzYXk0NkJHTkxrYXlDMElpR1Z4V0VnL25lcDZ4Qkl4cFNYbERFWTQzTUhiUmJLOTNMTmI0NWlodE10YS85WDBlZTdMZk5YOTcrTWdiajc4NWIzOTEzdjdDRzV0SEhqQXhDSkFiSFNwOHJWSXJ3c1pETmNNeFFOL0NsYWhuSEcxS2VHSlptVE4yeFQ0SG95SWdRTVlqN09HaU1aNWxXRjhUWUVqd2hsZlBXSHBnbjFoN2piOS9vOVpXUFhzUXh6QUNOK2Jsd054YllsSGFONnBuRHQvUWhTTjFQZHp4KzBFcVFQWkFldmRVam5XeDRMTGlQSGo0aTBmd1RvUDM3QVZnLzF1L2QvLzZ2UDNuNSszUDYzd0dlNkpTNXU2WkFnTEdYYTNvVDJqZVJOSHhyV0d2US9iSDZyOUlaOEljWE5ZS3NHZS8wek5BQVBEUWVPQVVIV0JjOWxUUzRQQmgybUJlUVZ3VkQydGNyRVZvSzVUcXRnUUhFYm9mbTlXdjlDY2ZsUm4rYnlrM0hkM2ZIRnViY0xWQ01YaFFpNHRlaktIMVRLdE5RNXFqaUdRTXdHMFJEK2Q2bnZFV2JqeWpZSVNGcGN1SC8vVXJqTVVhM3lRUkRXUDlXOS9uZ1gvSHovMU40aWYrOFA5bjUrM1B6dHVmZWtieFhXOTRaRS9Jb1ZtQWpTamxYK2VvemJwTG1XQmh2QThEWU9xQVE3T2VjWEI0WWtwWlg5TkFUaFZEOTBnQkFjSWtuNHFNQjRFZkc1Sm5mbDdyR2N1YmhMM0czNytSYXl2dkhzUXhETUxjaGVaK3hPbGlVZG8zcW1jTytlS1d1aDYrOG1UWUp3QUN4UFlQUTZwM2JGMU11VnB4SGpuOFJiNzVaaFAyckFEMmk0UC9QejF2LzNHZHorZ09mRXRyN2g0Q0NPZ0FyK1FJek50TVlONW13RGFNR0plcHgzUW05L3M1SHN2eFhVVG5ZZ2d1SHJKbkh5SUF1S3M4VUJidkJDQ2JlWmZWRDU4REZETUJ0MmNlak1SVk8yRERzeUhGaGdlUEp0OHFONUJtOWRzQnFVMGpUaGVtd0VuRmdpVlBDUjFhZlF6RFhJa3hGQlErYkdRV1dFM0lVZEtmM0JSZkFvbm1WcDNQR0haWjFUUTV4RjRyL1V0cy9TcGowZVphUUljb3RzWDZ0NzdQWFI5TC9OVEhEbi9rWFljWGgvOC9QbS8veU1jWUdRUzhCdUFoQitlSTM0empTaHVEOXg2RUF4TUIwNE02eDhIaGlZSXhid1c2amQwaEVDRGpHWWlNWjR5K2dlenQ3dzJKdjZIVk01YVd4TDJHMzcrUmF5dnZIc1F4OU1CaEdacDdYQyt4YjFUUEhMNm9jejFjVTBCQW0xK252ZFJYYkYyZzNYbXRIUDVmTkduUC9xay8rUC9rdlAxeG5jOW9qM3hMYmU2K0JoQWdmWFQ1ZlQ2WU1HK2pjQ2tRSlVxK1RMSDk2Y3l4WDBmSjlzaGxzQVgzTEFJQTY5YURCOWlZdTFRMFFxMzJNVUF4TXBnMkdzd0RtS3czaGlIRkpoTmt5YmVLUVcxS3YzLzA0ZCtIZngvK2ZmajM0ZCtIZi85LytPY1BhMEV4dlpUU2R0WEdOOUpXZjFoM0c4L3FWUkRMQTdoZHg5NFYvNzZWa0cxUHd1L3pEYWszOG41NTNnY1J1L1UrOGplTUNoSG9oT1lPYitpeHNZVG0rMm5pODNEdVlyL2ZpUFZ6M2Q5Yzd2ZzE4ZERmRko3QittcjNZOGIzNExtNTdyMFc5d0g0dHNLMzdJRzQ4QUMwZm5xdmRwZFZKWk5ieng5N3I4S2ZlWGZsRDg3YlQzMGM4d3MvaHZ0MXJPa1dDcm5jSWVBZVdsZXh4cy81aFdkYnkyM3hycC92cDhwY3k1ejFCTmFIckszYkNmdnlxbXNGUFRuaStXaUJUQjN0Ky9hRGx3TUxCY21OVmhUblV2WVZ2b3ZjdFBPdU01ay96ZVAyVno0Ty9qTlBqcnZtNS9VQnVLZXR2ZGdiK0RuYmowZmVxNGY3UlR3R3IybWY1UjBEZWcxLzZkMzdLWE9iWngzODNNOVBQZXRCRzBNYmVmRnVYOEdtUDBuY0J6aWVMNVh2M0FsaGlBSzBJY01qTDNOL0RYVUFHdVZXaTduWllxNXh5eFgwR0dMK0tXNGVkTHVHWER6OCt4d2pIWW04WDE2M1U0cTdibGlKQzlYakxvMk5KVFRmcWMvRHVZdjlmaVBXejlkd2FEL3ptNi9GejJzSEhLSUQ5QjQ4TjdlTUE3aVB2dVZZeE1YV0M1c1RYWjkvNG1PVGYrR3pDMzdpamR5bjNxVjV0NDQxcmJsSEgrWUlDNlNFVy9BNUg1T3JHQSt3TnlDS0luTmRvUGZuOVNIRlZPNGx1bDd6Tm5UVjNqVGNxQ0gzdHVXZXhYRGF2Y1I5aGUvQ2J2YllPaHNEeitxUXdibjVnU2ZEL2RLbnhkM01FWUtVZm9jVDdNY3pmM2hxKzZVYjBoZEhqTDNDWTFBUElyL1dmcDQ0dDNuV3dXODhmeUMwSGtKdWV5c0VocGVsZW0zNmk4UjlnRFpRTy96N2lMY2hiVEpBQ1A4T3pLSVVjS09JTlRHaVRZd2NaNUZCbmdQcmZ5aENHc0o0ZmxjQ3lZUGovLzBCOGc2L1gxN2lTWXpBTmFPazJiVkRIbmNld2xSc0xLSDVUbjBlemwzczl4dXhmaDc1eGY4SytBQmRFUDRaQXJMTUpMd0h6dzBhTXp5QVJ5SUVLSTNnTjZDUW4vNkpKeGYrdFk5Yi9od08xTnRFdkwwS1FlcEpJakV3bGZDSno3SGl4RnA0Y0JLNE5kUEcrcENVd1VjSis3SWVzaWlTdGU0R2lGVFc5MFdDRm5PYXNPcGNiRi94dTJoRXV4QmhEUGxLRTBiV3pVLzk0UyszMjlzNVNNaHZqYldtMlk5WGNIZytVZmJMS0R6RDJpc1RvT0hBdDFIeHFnakpMOFZtNVZrSG54SGdabUx2Y09KK240UXhJQkIvVnFkTngxUy8yRDVBRzNpZnVHK2Npc2gxVkxTVThPL0JMSllEYmxUYVZpelZKcFFleDZrYVl2UmJTS3NnbHVxQmpQNitRTXFPOXZ1b3dEUm4vRDYrWDk3VWsxZ0sxNHJUaFh4a29Zem5TSm1LamNXYTc5YkU1L0hjeGRJbkc3RisyRVhJTnlrbXJTNFpjOE8zN3lISWc1YU5aS1hhTEZPS241YitkT0g2LzB0eS9YOE9CNm9teEZKUGl0VHp4TlRBMUpSUGZJN0dGTzhKRUlRbHUyYlpXQjlka05zZDI1ZjFyQlZNMTRwbE5tbXBWRVZLb1VMRGk4WXp0cS80WFY1UXF0MFl2TWVpOFI0eWY1YnV4cSs5TittYVArRHUrSG1WdlJ1eXMvS2RGeFBzeDJ2dmRYdEU0MERBaXZzTXg0RmptRGEwUXg3N2QvL1Nod0pTYkZhZWRYQWRTSHRXYWwxb1BmQVlKaWlkdDZVT20yNkovVmhwaUdnRG54alpiNmhJaUhWVVVMU04xL0ZqQVFDTkZHNkppVzFJbWNORlEvaEQwOGx2by96NnljQzdjakVLTElOYVZJUWVXQU9BNVlVM0l1K1hWM3dpSnVKaVNmbmlRbGxNRkUzaEtvOGJrZm5DaW42YXpHaHNyZ3VSMzIvRStubXRwT1ZOQUhxZUI4TzJCbVBtdWRHTTJYUkV6RVArdHdpZ3JDZ0NLSExJaWV2L3grVDZ2MFBnZzZWWVU0U25VQ1RsaFVzVEIwcHAvSnk3UnE3NEdLVUlGMkd1Uy9Cc1hoOXlvRHhOMkpkNUd3dTJQSTFvbTZ3WjMzZlRYUllLV29EVTVrRjNxWG9ZMjFmOExxMTAwM3RMNjJ6VFpRVmpVTFBFVXQ3ODNLK24yeDZraVZ0WVBFb2hPeXZmZVRYQmZyUVRZTVdMZ1FEV1ZaaUQ3UnhqUUtFZ1NmVkxzVmw1MW9Gd2JVSmFOOHVCOWNCQ1dETUVBdHB6Mm5UVUUyQWhJbTBmc0ExOFNaY1dyYkFXMWxIQnNzYTRqcis3cUFnQWFLUjBhMHh1aytzY284eXVWc1pXWEZIdHNEams3eTJaM2lVREFLRGVzeVkxTzZZWXBtMTZQNVlCbGtOUGt3VzE1Q2RSeHBWbGdxV1lqNVJEbllENEtpNFU2Kys0QkxCV0FRN0hnMlV2MFF2QXV2SDh0OXBjODF6c04ySDlzSXRRS2k5eStlSXQyQXlhMmlNYlpURm1LT2NwOHl0eW15aTF5UktvS0gzOXhyditmd2drSkhUOWN6aExLK2lTS3BQNjBzL0pnQXZMQThlYTlod09VMWdIR002MXlHeVhsZlVoUnYrWnNpOTNycmhXV0xJVkFaYW1ic3B5cXFnV0tqS3Rxd0FDeEJaMTByNUtrZmw5bzNnOFJLeU0xNW1tV3FySnhkNzBZRkpJbVM4Z05xL3QrN0x5bmRsZWFiTGI3VXBvWWNSbFN6cHZRVCs4VjBKallMR2Y2d2x6bTNjZGlQY2lwSFlyY3RnSHhoaFFDbHZ6bU1ac3VsVWpKMFdLbUcxZ20zSnBRUVZja2NIbkltUUx5a1hsZFFnQVNGRUJyVjFvNkY4VW1qaDErUXR1RkZ4dG9Sd3VaTUxWeHJvVUk0Y2ErMUs4UVNvUmhtN2NzcURPNkhsNDJQTDdIYnZMd2tIYmhNaEc0Q09VM0dXSlZYNmZTU1Vrc2VqQzVWQ3hDQVhXcjhaeXpXY3VxMEcrUU40VHF3TGNONjYyZWlONkFmZ2RzVEFVbGpYR3VkWUFRRFZuazdWbHJSL05SYmhLTnltc3VuVmlHTGQyeFNpTE1kdDNsL1V2dURnT0Z2ckJDbWhjRmxsYy83OEdFbExJOWMvbFdLVzRUUXdBdklLOXdRZXE5SE1XYWRaellucnhDSlFPWVg1TzZ3UUF4em5YU3FqZ1RheSt5U0haS3EyMnlTYllva2tZZzNWSVdlL0M3NEhGajJTZGlTM0ZPZFNxYjhyZVJsMkhWaUJZV3dlU1ZQWGNnNE9zQkh2MHdHV0xHSWtIb00wSUxXQXAzQU93UlNjMGw4ZktRY1FTNnNJRnVCR1kyM0xrNXI5dkFJQjdmcjNWdXg2d0dOYTJZU3RETmwzV3hJN2kyUzI0Y0RFaXJZeXZGakpjZzdQd0JFRDRzYktPTTZXTlF3QWdWRXJ6RUE3RXZDVTNyVU9jNjQxelRXbDIvMnRWK3Jib2NCNGtseEl2ZXR3UXVMbll3eURsTlkvcFEwNHFZN0hBeFRpNFgvaDJyWldpUkNBMDVmU0tYMWkxQ2hlS1BLc1RibTFhRFhNdWU0bUgySGprRy9IQ0hEQUFRTjUyN0xKMXNubjlhQzVDUHZTUDRYQ3dLajUyR2w0T3JFaUgxU1JGQmh1TkhZTzF0MkE0MGZYL3BjdEtyMXBWMkxaaG52OVZJZ0JvSWNNOFQ4RDEyR1hyWGxoTmUwNnNZaHdEcFVQcUx5OEF5THRXS3JTR3NhUnF1MHVyY01yVlFnOFQxbmxlQUtCNUxoSEFZOG5kZmFkWFdTMlJkKzhoOEdFNmdRc3pCUHNYdlo2SHRLZlFNM0JDZGhjUDZQWkFhQUhIY1FxZ2VCZjJZMVVad3pSNUdDUU04RlZnYmcvZ3NvSXhjdHczWldYdUgwS1lMTFFlck9xeENBd3NqMmwzZ2kwNVVMd0FYSTZZUzJKdkV3QXRLSmU2VlFCaENGUzJDZlNodC9MN2l6VnpBT2JBSldLMWJRSUFXNUhmNXpySHZZU1dlQkdWRmJkOHY2c3RzSU9IczFhR1U5QlpOeDFNNi9BOE5MQkxFQ2VaVVR3TVovQWMvUDBKWmFPZEdXNW5yU3JidkdMOGNUd3lmOWJDd3JLcHVGQjZJVzZySFRSVzJjdTNnZHQvYkdFeVAyTWpSOXNDZzJFWjMvNkFnVGhXRHFLakFBRG9VZFlGajFQYy9PditVRjJuK2JjT24zN0Y5YzlGaG9ZTUVIamlzbVZEOHdBQXpZdDNET09JdFRYeVZsazE0emNCckZYSlRjb0ZxcXdiSDE4RU5uSTIrVmJhcFdHRUFCNkg4K1NXTDBYTTFvSHpzUXQ3K0ZBQi9JVTZBRUIvd3FVSDdXZ0p4dmVONGFsRTd3eXkyVkdvYlFIVzlURmRrb3AwU1BBNFIrRndleDRKTFRCZ1dvZXpvdXhxeTZoelpiMFhDUUJnUndseklwamFNd0RBWThpU0dWVHNOYTZIWFhqL2RRZ1ZWUWp3czVlWmJicDJVZE84clZQRzdmL0k2YVdJKzQxdnNFOGhnM1h3UWxRZ0ZGTmpSd1FBY0RHSlJhTVZEUUN3RXZpYk9TSSs4RzFsMWRYV005OVJ3Z0JXaVYzZXFIZ29kZE9IbnlmM3FIWlFhKzkxREF1ZGYzK0tqTzZ4QVJSay9KeXl4ZTdmSXhyVE9yQ3IxdzBEaFlzS2VSTXRyclppNG5JQWRLRVhZSTdpV2FmT3JwSGQ3L1R5bFlzSmpUMGdWWElacHJwZmoxeTJSS20xVGdVQXNDZUJ3emQ3UUlwQytXdmVySmFuUW5QOXg3NzlJYXlkNDBRQTBLcUEzQTBBQUhnZ0xVWGFBc1ZvcmNxV3UzQXprcHJqRzhUOFhxVCt4Q1BWNG8weWx5WmV6TEZlOE9DcEtHdDNrT2FFRDBLOGtSWGgyNjdRVFV5N3VZNEVEc0l6QXdCb3ZLSkR1TEhKKzJ0alBGTThsWk5BWWtYdnpDeXRWVjRMeUdGQ080anZ2QUN1WW5sM0pwck9Lc0FIdjhNQ1hkS3FBV0NVQ2dDMllLMnRLbHlvYlFNQVdIdUVMNEo0UTE4QVJ2NEdoY1ExejFhOWRsYnp5bFlEWHRudUJKTGtPZ0M4OVJpWldBQUFNaU1uWEZaTVlBb1dWekZpV0xXL200QzhVazU5bUZHTTc0a1JCdEM0QTBlQlc1Z1F4a0lMbHpmc25MRkFEdUVETVJwL3F5eDJLLzdmcmR3Q0p4SnU5MFZ3OVlTOEJPUEVWa2JYblJWdk9qVzhBRXVKUUFGcnduZERidkNrc1I2bUlGZDJTZUZBSUo5aE1aR0F0ZS9uZXd0dW5qRUEwRzhZR2kxOE13VTV5UnJYUXdNQW40RHJIMGxVbXZkbml3NjBuUndBNERWNWVaaC93VGN2TENERmpTdEpkaEx3TGhydnV1NnlGUU81UUJYbklEOTIyZExFRTVHMU1tWHdXRFJBS2dkMGowRTRyaW8zM3RCdERBODJzUzFhMzZrQVlOVmxxNnJ1MFlHaTJaTVRCUUM4TXNKWTY5Uks0QjZXdGJSTzlxME1oOGU2RXF2WEFFQXg0UEdjTllCYURBRGNpZ0NBUFRxQUJkVHR3emZnWnp4TjJDTTR2NHV3MzNHOU1SRWNBY0NMZ0owTlhhQVdsRkMyZHFsRGNuRW9UWExUWmF2ZmJzVFNpUVVBb0REQ2tNdktDUmFNajI0WlZ2NWJWTlI2VGJFazdiQzFEblF0am45aUFBWk1ZV2xQdU8yaE1kQitwd0szQjBiak00WkhRb3YvZHlweDRCSERiY1FMSm9Vbk1BempmcW13WHpYR3FYVzRzN0ZIRnhhR0NsQXdoTlhCQ2tvYk1lTGVWWEo5TVo5QlM4RmFBaU8zRHJmY1lpSUE0SFdOTVhIK2ZZNTk3c003YXdEZ21qZG9EeUJXRzNMOUg4UDQ4d0NBdHNDQmRFcGpYNGIvYTVVclJzR1piaVcxVTRBMzM0NVhYRzA1VXV3YmM1QmZRRG9uRmxDeDJwaVN5VkpWd2xIYVRTbDBTT00zNHd0SkdlTENPK1IrendzQStta01hM1JJRjhIVFpWMG9HQUJZb1o5ZEFoZDdRQWpqbisvRGQ3UUF5VEFCZ0JCb0ZqdTZUTUFlU1lZYUIrQ0Z1NVFIRGdHQWJmcm1tNVNSVXc1a2c0VDJpQllDaWFXTzQrWDBjY0RPY21nUlE3WmE2TSs2MUVsNnNTYVV4R2Z6SVFFVlUxQk1BQUJXUE92eUc2Z2JqSGtlQU5CSGY0K2EycytOZUV6UmNLdWlTMzljWWJXZVJUSUhXZ0g5V1M3U0V6S3kvSXdxeERjcmlodEllMytMeC9CR3lha2RTR0Q0YnlkbUNneTRiSTMyRUFNMjV0N2ZJQmNaZ3pJMHRxTHpMa3B4MmpycWdWVEdPV1B4bzF0VzR6TzhWRHduaTNTWXplWUFBS00wN3hnUFozMkk4Y0FCZ1VabkhOSzA3cm1zVXA5bUhIYkFIU3pqendNQTJpTXU2VEtOYTR2R3VPSnN4VER0RUVXWHJyaitOOEZBYnlsOVl3NnlYQVNFdmY1R1dTdTRacXdzRm9zY0o0QlVPMGpLZ1Z1OUJmQzB3emN2QU1CYkc3dnBGOENUcUhtRnpveXdhSXo3Z2EwS1hrTnUzOUQvcjkxd3haUFlHN21JQ2VOOEEyN05WZVZXaTV3UXJLZnhOQUlBU2dCVzVCbGwrRzhhQUVDdGo5R2NBQ0JWUEk1RmhqVFByaFplMUlqczIwN1hEQkQ3cDVYenRqd3krQjFWU1hFQkFJL0FnTGY0amRrYWNmdDhFOGtkbFQ1YWZMOVBBNHpNWldNeG9VdDZLdUQrdDdRRFhzSkdzWGdBcHhRYm02ZG5IRU5lc0hhcll0YTFGaWZDbEJwTkJyWmdwTlpVNFdBNElFYXRwaFhBNGhxM3dRdndKaERQMWREcGxuSUxzdHhTNG0wUVpicFg4UDFaN25MR1lPRHk0dGY0REU5Y3Jjd3B1cS9IYzZ4VE1lTGlTdU40K0NKczhsSEtlOTQyYmphNC90RDFqeVFoelQxWXBmRmZCUUNnMFR5RnVPays1Q2FYSVd5eTZYVEZzQzdqeGxjbWtMdEhlZXpJMkM0NVBaZSt3MldMQ3FITmFhV2J6cWdSSzdWNFAwSTAxT3hMMlFqN2pRZFNXRThhQUFCUXNwV0plcE1RQXBsVGVBZ2NuNVlMUlFnQWNJYkhDWHgzYkVkR2xnZ0RnS2R3aWVCUXJFYXMzS1BEZnhlOGVyTXczd1VnaHNzZUR3R0FOVHIwOThsRFdqWlNNRkc0YUM3aEc2TVVzQ1UzekdYcFc0MVEra0xnb05lQUFkb1NKbU8ydWF3U2FuOE9BSURaZE44WEZSTUFJQVZXeElnL1NZajd4QURBYzNkWnhPZWh2dzNkcHBpTUZ0ZTNZa29hVURoV1lqZWNibVFKcFd4Um5HOGJpRGlZWVZDQmVNb2VHWjlWeGFPZ3BSYWkwZVpDTU9qU3dVTUc1K0pZOFFnZ1NzVERtT1UxNzhNQzdUWlMvRFIwaWtRb0xZVUYzVkxpYmJnRDZ3Z0xDdUg0TE1PeFM2NS92akZLNFEwdWRESU1ISkU4NjVSajBGcE1mTUtJMTB0TVZXTUZ5L3A3UU40WGpOVnkyZy9PKzJwT0FHRHQwUW9BSzB4bEVxMEZDVjlnbmptRE80dThKc0Rpd1BkUnBkc21wbEJxSGgwcGFpTFZITVhtUEVuZ3JSd1N5T1lVUFFsSGFZZTBGdmFiQjY3U2RHTDhQUzhBRUVDRFJhcUdZUDFPd3VHL0FTVExVeVVUUWRiWUs0UGd6SmtkKytRdEtRRzdIVk1EMmZ1Rjl2UUpQTS95V0dJcTNSR0EyaDJJUmM4cHZBNTBTYitKQUFEa0ZleFFPTUFDQUp5anZ3b1pTdG8zWHFXMlRHbDdXcEdyRjhvRkMwblF5eFRxT3dFQWZxU0VkT1h2NWhYZy9DZ0hKOE5LdzVVTCtRTUJBTmU5eS9LMk4rSVBHZ1FBN250d2NkdjNmdzBPdnM0QXMvOVVRZmlhcTcyaXBNZGcvWUFubE1JeW90d0lUaUdPdTZhOFJ4bHVTZWgreEZnMUdwZEQ0NTFFOVFwTHdhSTg1YURpWnBZRDRrS0Q0RnVGblk2R2p3OWpLYkR4dFlzcmViRTN4QXJIYUc2cEY5NkkzMVpJYjFoUWFKSmlhZ2VLNnhBOUdnV0tHVC95WTNsR3JtTXBRWnQzbmI0bTNzdXcwU1lwWHM4TWNRMFlkU29BaUdXY09UNktaTThVQU5BTy9Wc0g5Um1sUllwU1g4VmxoVnNPRENhOUpkWWp3RUw2UG9EYjJBRVlOWTNUSWNic0d0aWNyMkhkdk1wNSsxOVFnUC96UU5oUFkvZlBnUmVJd1drakFJQ1U4bTZuOE5nUWdVSSsvRFZnTEd2c0ZjWGwzd0w3Zm9sQXp3bUY5NUJ6aFhzRHZWLzRySmZrU3A5d2w3VUVVQk9pQ2lHRkEzY3BuQ056ekpsQkMvQWNDU2ZHQU1BNnJEUDhoaFlBMEVTUmRzQXJoZ0JnUjJtY0dxdVZ1WDVsaExXMUZIb0U1bVZsbjJERExDZ0phejlvQUFCNEpoZHlBUUFYVmNvK2c4T3BrUURncHUvM001OFgvUUFPWlVzZ1F3c0RhS2s4V2d5d0Q1aWxEeU1zMEQyRlNMaEthVHJ5YytZRkhBQlpZMHRoRGE4WWJGZGhoMzl0dUlnMU52STM1Qld4Y3Y1bHpDS3IrYkdyVmFDelpIN1pxM0pzeEZrNXBVdEtTOTZrZkhlKytWbzNCc3VqZ2VSQ0tYMTcwL2VQOWVoZjE3bE9uOFBOckJ1QVJJK3ppMnlnY1E1NVlyU0tpaUhYUDJZOXhBQ0ExSjhRdDZtbEFyanZhbVdMa1Fld0J5bW5sZ0FYNTAzTGUvMDl2ZnNtR0sxTlNsVzFpSHEvQlp0ekV3QXg4MVcwckJWTmtHV0ExcVFXOXR0VzJOWWJkQ3RFRDgvZk5RZ0FQSURMeUt0QWV1VU9IZjZzTkRrSjRCc2xZYVUyZzNpdU5JME1YR1BvNFdSNTg3Zkt6YnhWY2FVdlFab1pLeHBxTXJTYU5zaWFFaWFOQVFDMHd6dlFSeW9Bd05SdUFjR244UDhmRzJSdlBJU2xrdDhyU08rMXdqR2FnTlVKekZOSVVFOEQvbzBFQURjRUFGeUlsa2hkNldZQWdFOTkvei96aHB4ZDB0WW1SYkxPTXBHUUxGR0dIbkFaSXduTFVrczdvZ09kMC8vRTFjOGtLRFJzTzRwcmtpVTFaVTYrQUhhNDVTSm1kamg3QURUVnZ5NGc0OTMzMy9FTFYxdCsxaEt0MktGYm8yYTg4YWFGZ0VOcWVuTytlNzhTUDk4QlEzNUltUVdhUjBQR2M4c0RKM0VkUDdwaXFPb2hoSWdRU1BBdEI0MXpudmQrbmVEWllZL09YQVFBdkRYY3Bzd3lYM2ZaZ2lScndQeVhMQWt0cTRUblNETm9ISW9Tc3ArbTY2Qmw2Y2dhK3BrSEFkY0pETWN5VmpERmx0VkNzVXp5bTRBWEFRV005aUJ0YWhkaTVoaCs0NXRnQ0FCbzZXNjNLT3luaVJSdEtka3dXcTBKU1lkbFNWaSsvVE1yZkJ0YzJpVVlKMTZ5TkMySXpvRG5rTFhueXk0cjVvVWhJRTBkVkRzN1lnQUFlUURvMWNnTEFBNEJiSjNSejZSWkFFQUlpNCs4YlFvQmdHT2puVko0bDlzN0JRQS9lZ2NBNEJmdWQ4VlJiaHViWFZPWFF0ZDhNWktmTzA2dTlzZmtqdTVRY3BxMS92Q1FSNlBJSC9VSWlIRjdDbXJrRHljS2FNSUJTSFVSbjdtc0xyV1dKODgzNXNmK0dUZmNaUlc2dTY2MmRyd2xFZngzUnJoaFZMbHA0WE1lSy9udWswcjh2R3FrdktEcnZ3M1NneDc1TlhtSFhNZFhXYWZDZTNtaXVEaXRJaHVjcWhoNjc0NElBR0lWUnpIQUZnQ3czTFB0Q3NzY1M4d1c0Vy9lK25GcEhpYU5HQmRpbU84UnNjdksxVDkxZWhFdHNUZnNvVXE5L2JQa041WWF2a3Zwa2RvYVBJYWIzeUhkQ3N1Uk5NOFlBT0MxOWlWY2ZGNjdzRWpSaWNLZHFDbmk0ckxTNkRMbkpTWE9mMHkycmFSNEJrSnFrTjNrVFdHaThnbTUvREZiaXIwWW5GcGREd0FvZ1ZjTHo0QVVBTUM1OGl6d3M2MjBOU1c3cklXNGJSb0FXRE5DQ2p2S2M2M2YrNE1FQUJqL2pta0M0Q0ZoL1p3RlFQQVdjSXRDRGhZekdEa0hXeERmNUhRL0RnL3N1MXExSzA3WFlRVzByNVhiZU1oRkxONEovdjg1WnNzSGtNVGxmd3RlQjg0KzBFSU8rRzB0eVY4dTQzblIvMitjTFhXN3JEQ2JrZlNDY2R3K2lLMjFRb3p0dVorLzN6Wm9uY3FOVEt2VlBxM2NjcGlwaThKUncwVENmT0wwVXA5YnhCV3hKSHExakJLTG9NVmxabWVWSnZtL3c0RThiazNRS0FZQThIWTBuSFArVVNiWjRxaG90MzlOdHJwUDRhTm9xWmQ1cXRjeHB3Y3ZHbmtCd0ExS3ljMHJVaVNIZnpmczcyNGpjeUZQQnNDUmk5ZUQ2SFpwdWkxeVdQTGxCYk1BdEN5U1BBQUFkVU5RQUd3OUFBQjZpWUFzWVlSMTVTRGVBTkFzYlVraG1VcDIyd3NQNmw0cEY4eGxoVkM0R25pdTlyc3JDcmZ0SHp3QUVLTFlFeVZGanpXYStXYk94bE9UL3VYcVV0ckdtMUppWWNkQUJEbDB0V3ArTXdaQk1KWmYzQStwY2c4VHlIOVdwVC9XQVVnbEEvNHl3UXVRSjNlK1E4azArTVIvWDZ3Y1orVzdzOXJWRXJrY3RYendUcjl3WHpWd25UNmkzRjB1ZGJ0R3Q1eGo0MlltM2hlcFdDbmtQRGJ5Mm5jTkZlZEI0eHBLMGJJTVhCRkNaNWl6ekhuYzVRQUEwRkpuV2VvYUR3dExIMStiLzA4TmZrcElxeUlrL0lOci9xWUJSa1AxNjNmQXppQXdLZ2RTU0JrQVdKVW5oZVBBM0tkcHhTV3ZlV0w0OEg4Y0FBRDE1ditmQkFDQUphcWtDWVN0R0R5Zm5VQ29GTmR5Q0FCc09GMEhZRE1BQURTQXZCQTRpQmNKUEUvVEJRdHRrdXgxSzhTOGJiUVV6OE8yNFVuK0J3OEF2cUNZZEV3VFFCWllpQVRFS1VEQ0dMOEdZS00xNEtiQjI5WWVwZi9KUm55cmJMUkRjbm14MnRXSU1oOHA2WDlhb1I2TzJhYW1BLzdVMzg2UmU5Q29ieXVaQmhlNjl4KzUyc3B4bWtmak9PRDYxNXJVZ1JCMXVrYXRVeVFxRGhDVGVwV0lrWmdLeVhudG1OS0ZPYzNXSVpHbkxQSzM5RE50VTRkY25OdEtyTnpLNjdja2piVVN3MXI1MkZFakZkR2EveThVYmdySG1UY2lYcjlSQXRpNDd6RWN4YUdkZVlpVDQ0MnI2SFN4SWZZNGFOOFdsZlJpQUVBNzVMUy8xMGpFRXQ2ejZqOWd3MnB3ckFCWWhUZzZOZzBBeEVTVjhOQ2RWemdtVmZBd25DZzhqdGl6UWtxQVpSZFdBa1R2M29penk5NHorQm56YmRTd1MwTEU3WXh3QUE2TkZ1SWVIUDRoY3dBUStlUE52T0Iwc1I4OG1JOWR1R1F3bDViODNHWEZjS3lVcVFyZHRyVERmTkxaSWtHSExseFNVN3dTZDEyNkFGQnFMWUJOVjZ2T2gyNzZkL2x0a1VDbmtSbTE2b1V4L1hmV2syL1VXRnBkVnV6bUxSaXZUY3JaNVpyc29uUFBiUnpDQVphYk4wOVo1Q3FrTyswYnR5YXI5dnVoMHd0ZFRTaS9xMVdjR3pjOFJKcDJ4anpNZ1NXMHhXSmQ2Skd5c2xOQ3QzLzIrajJETmZrWkVJQmZFUWdZYzFrSlZVa0JYS0J2YjRrTkRTa3hmSEh0b3BZKzJpYjBSTFlCUHdaejA2Mi9aeEt4akxGTENURmhIMHdBWENkWE9SNTZtaXd4eHJ4VGloOWhiUlN0VEcxVnlhQmhIa2VuUzY4RmdKazVvVm9BTE1JMGxRZ0FZZzMzZWdnQVZJeFdoYm5RMmg4c0FQZ1ltTDhwbWdCbmtNN0VlZmFhOUsrUWdNUTFqZU9KbGJTc0VHckdENkNSQjdGeW14WC9SOUxJSFJlWEFFNnRCdmlONG43VEpJSGY1YmRGVm5KSzljS1V4aFhsR2pVV3JzV0FOeGVOcTdBRzcyTzFXZUpLTUtoTkxYV3JrUUF4ZFFxelhrTHIrUkRlZmNtUGNkNkZWU0Q1ZTJ1ZU9hMWlvdlM5N01KUzIyS01iaG1aS1ZvWjZwanNMM3I5SlAzMWpxc3RCWXVNK1VYWVY4SXUzNFE5eUFCN2hwanhBOFFYV1hHMTRqR3lGcjRNZ0IzKys2THk5OHk3K1VvaG1jNjViTVZLSmdDdUtLbUJ5T05nV1dLYzN4aG5ZWmZTdGVjTURzMjNMbHhSTkFZQXlzU1BTS2tHMkVNcHZZdEd5R1F2cDExQ3p5WEwyNlBuVTJzTVBLemZxNm5lOTRjQUFLUk1xa2JRQzJrQ1lMcGVTUHIza2IvMUN6R04wWGVQMDNXL1djV01EM00yaE1obVB6WGkvd1B3WGtKT1NpMENoQVp2MXVsMTQxT0tBcjNMYjF0UXhxVFZDODlUOTUwM1FhUEd3dHdURlBvNW9zTi9QYUd0RVI4amRPaUVXaWdOVUFORWxyNEZsMWJtZkhmdDIvQWhiWG5tdUhJajk0MWhMT3NXelh5VTBPMWZFLzdoZ3hGRFVyOGkxbjBJakVuTVgrck5IN2xhYVdZV3dOTDZrejVRL0ViV3drM0RCcVgrL1lCaTMxN0RSUUlyS2k3UzdaWkxBS05uWUljOEtpSkxQS0prSEJTb2YwM0ZiZ004R0pLVnNPMnl1Z3BvMjhRRE1KbkFBZGh4dFpMSVN4VDZzSlFBUnlsRmRzTllYNmsyYVozT0h5MTlkZEZsNndkSXN6d1AydS9XVk8vN1F3QUF2L0EzOHhzdXJnbXdBOC82TzVjbS9ZdHV3Ri82R3dIeUFMcWRYa0ZMOHUydFlqNEZnd1g3OTRGVUp5MW1IaXNEZk9wMHdSK3VvRmR4YVdXQjMrVzMxVzRKTWJHTFdPTkYzS2l4YURGVTlsYnM1V2djUDI5WDNNNHh0MkpNQjBBTGlWZ3BXbVVBcUdXWFZUcmJTOGdxR1RJOGMxb3UvVDcxWFZINEhueWczUWVpWGtpWGdyWHdaK2ttM3FJUVVuOGVBUDFhT0tZQ1lid1R1R2xxT2crZEJvbHZIeklKZGloOVRGdXI3TFU1Q1B3OXA1OTlEYUhFTG5CeGE1VUVjZjJzS1o0QlBDeUhYTFo2cTVBT0xZQ0c3bjFaWTdzdXE3UlhnWFY0YkpDWThUWnRBUUJrL09NaGlaa0JxVG9BKzVBS1dvOXQwcFFlMjRocklvSk0yR0toQi83OW11cDlmd2dBNEtkR0NoQVdOOURjbVNIcFg4eExGMFB3c1RjRTE5eWwwSWdtd3NIcGJ4Ynh4MUlWKzhiWllpY3NTblNEM0tyc2l2M0cxWXJNSU1FS2hWRjJBK0VDVEk5Nm53QkFRampmK0c5WXpkbks3eGdBb0p5cHhaN1dta2FndzlpejZMOFhBbTA4RVFBVWlCUnBGWGxDa1paVGVNOWp5b0huRUFlbjF2SGhqQVRKSTZYdkUraWIxZUJ3WHp3RWtoN3VlNjZlZHFRUXhqVE9qNlNqQ2lFMUJnQ1lrSGtNNUN1OGhXczZEMzJCZEVvdFJUSmxyVmJJbGxnQ05JOGhmQm9MYS9LRmFjUHdET0NGcFJQU2NJVjBxQkUwTVV2bTJGaGpHUHMvY0xVMUF4aGtqUWJtdGh4d2xXOEIyRWdWQXBKOW50YzJhVXFQajJtL0R3TGhWbG9xK1JEL3BxWjYzKzhMQUVDeVF0NUQ0c2ZlUlNmUHdwdUE1YzVFWW9TMmFGSDZGL1BTUDZKd1E2aXVkUm1lbzJsQXM1R3kva1pEN1FKTXJqdTdEajJQRVcvelE1UWVoVWF5UWh1RUYvKzcvTGFha2ExY29WMFZBSVRHWWdHQWV0K1ZBWURrQjdkNW85b2RhQnJiUGtZR2tyUklMdkkwUXlDQTg5MjFuUGQxY2plSzk0alRSVGxMUWp3SjNIY1orc1pLZzNpTHRvaTVQSDVOOXBkQi8xMUtSLzFSSWdDUS91VncybmFYRlF5WElBN1BPZzhXTnlMRkEyQWQyUHN3ZHpFQm1xOGphMzlMV1pmbythZ1l2QXk1c0VoKyswTS90eFp2QVRVVnlzWWFFKy9RSm93VHZ5MFRUeTBBa05wU0FFRGxpbzJmY1EvMmU3dWZLd2xuOUVYSWdkcitscitycWQ2WFlQTkNLY05YQWdBejRBSkU1TFZCYVcrOWtVUGloLzVtL3JHTGF3SUlLemRFak9CYk5rb1AvMGpKT21nekNFZjRERDZBQjVSYzJKUy8wWGdKc2ZuVWJreDlCbTlneTNpSG1ad0FvRkhmTmpTbjlUWk9ZMnZVV0xxTk9HNjliWk5ZelpMeXllV1J0YkszbkprU1cvTllEUkNWRjRYc0pDQUE4OTFaWlF4NUFVdVFKVkNnNzJ6cEpCU2Rua3UvRFgwWFhiYk04QkNBbDRldVZxSFRHdis2NFozUVFQK0ZoL0ZmS2h3QWEyMml3TklxRUJwbFBvYmhaaXhhQXoxS0ZzQW1wVjVpeU9OR2hBTVErM3ZObHFTdWZiRUoycDdVVlA5a1hkM3pRT09HeTRwbHNhYUN0UTUyQUZDdGdidCtNN0p2T0x5eWtYTWZhall3Wm0rM3J2aU1XKzVTVmZTRm44TTJQMmNwNUVCdGY3ZjdQbG9kVk8rTGhKSTJYRmcwakRQU3ZoUUFJTEg1VHlsbmxlTnp3dkxGR013eUVEbTB0TGNiRUpmN1c3ODVQNExjOU52a0RrUlgwNEx5UEkwWThRcVFzYkNBTDdUR2Z3QkFnMW00R0lkZlVzYUUrdHQ5U3V3KzVXODRMZkd6aFBsY01XNU1YYTVXcVc0bDhBN2lKbjJYM3pZMFAvVzJKVXB4Yk5SWU1MNDkwNEQzWFlZVXdSSC92ZS80Ynk5MUM3aHArZTk1MTd6VVh1Z2dFSUQ1N2l0T1Z4bVR6SUJwaWpWMndHM3pwYXRWU2hUV2VhenZPWWhqRGtIWTRxVnlJNDZOZjFiSitFSEJMd0g5Rng3R3YzYTYvb2UyTnFWR3dpSWMvRk9RLzkwTGgvOHpiNnMwcndnS01DMFJpLzg2WFhSUy8zNGlrQVdRdXZiRkptaDdVck16bkZIeG1aRk9PUTdyWU5GWUIwWFlGN1BHdCtWOWc3TFdjNFo5ak8xRHRvRXhlN3R5eFdkY2Q1ZjFIaDY2eTdMV3FlUkFhMzgvYzVjMUIrNjV5em9vRENRbllUOWlZOW53R28rMEFJQy9wVnU1cGhnMzZnYzhUVVFGeVpIWDlPaGxFZjNXSS9NZitNMkp0MUtyV3AxVXVFb2hScUQwcndqVC9PUzgvUXNDR2l3NU9nekdrc2MwNWJMNjIvWDhUYXR5V01ibWMwWXhtbTBLQXRkSUp2d09uZS80MjRibXA5NDJUVGV4Um8wRlpaaXQrY3picG9DZC80Vi94Ni9jWmJsYmJJMWE4MUpVQ2tIQWtKK0hDU1hmWFJxcW5JMHFzVVk1WEo4b0lFQlk1MitOdnVXZEo0QS8wK095VXNsNXhzOXI0QTNkaHEvNWRTaWcveTl6N0hlc2dDZHpNVXc4aXhZNC9MOVd2Q0x5enF3ZUorOXJTWEZiRXM3ODk1cjZadXJhbjRheFRTZllHZFpSK1pVSEcwK1ZPRGV1ZzVuQUdwTTA2cW1FZllNQ2FaTjEyQkhOQnNiczdjd1ZuL0dKLzhZMy9McTc2MnJsN2tOMk83Uy83L28rYjdwTFlUdE1iKzJuNzRCdHl1aFhNdEsrRUFEQXQzSlpyT2dDSEhDWGNwOU1WQ2k0U3psVUZPWDRTam1RLzlJZlNsbzFNSFExRFNoRUNvc1l3VVZwSkE3NHp3TkFveFBpTXlQS2M0UnMxUTJ1bUx4L2c1TXRSaW8ybjJLQTJHakdTQ2JXTzd6TGJ4dWJuM3FhZkc5eHd6WnFMSHhnTnVKOThlRDRqVGNNbi90dmY1MWFvOWI4YlFJQnNrYjZZVnhqM2hCZ0c0TisreW5XK0F3T0FRWUJYZlNOVS9ydThuOHI1VlB2MXpsK2RzWGZvNHlmaTl2LzM1eTMveXpuZmg5MmwrcHUvZjVkVUg1YTNLL2lFbitwdlBPWXk2ckg0ZnVpRlBkakExQ0YvcDZyWXVaZCs0WEF1Tm5PYUJMZnR3Z0U4RHFRYjZhdEE3Ukp3d243UnRJYisvM2YxYk12MlFiRzdPM29GWi94QzIvYlB3WGdmeWVSSEpoeXBsM3phL3kzTHBzK2ozTWwzNEhib05Mdjk2RnlBUUEvODRiOE01Y3R1U294ekJZL2tWSTd2ZGMvdE45UGdyUitJQzdJQm1weGw0VmM3dnUrdi9UUCt2VjdmcmE0YnF6bmRibkxHdkY5Um1PaWhyaDlzZjczYTRnSGlkeWxqS0VQWWo1eU83cnZqZU5qY0JkalJieXYvTHQvQ25QNHZwNzdReUIxM29TYnlVc2d3UFhTdHhwUW52OFVnTVh2a0tuL2QvNy8venZuN1IrZHQvL0VHL2UvOFFCUFVrcS9oQU5GTm9ZSW1QUUd2bDFLazd6dkR0L3ZjemdZUThTZldIK29KLzRhWEg2UC9CemU4blA5U2VLWThOQjZBWVpjUVBISC9wdEpXZTZmZUNEK044b05yeHNNc0JqMkNjb1ZId2REMkEvZjhpVVlHU2xKL1pGLzdpZXd4d1cwdE1JYUdYUmhHV2hjSjFLQ3VsbjlmZ3lHdG8xU09xZklhekFHeHJZUERISUJEZ3Iycm56VTVIZHZWdC9YQ0JpK29MVTVBQWYzR0FIRU1aaXJJUUJiVW1EbnVWLy9kN3d0WWVER0lJTVB6aEJRd2NOM3pBQ3NCZVdkeFBOencxMVdsMzBPL0IxdHpGYmZBNG90ZVFTQTY0NWh3eEM4akFWQUZzb1RaL3IvbzlBL09JQnZBTU9VV2N5WXpqU2l2TXlZTWRnUWt2N3NQVDhieVJzdmplY05CNUNyaHQ0ZUFaRGd3MWZiSE93aWZRbnhveGFuVjhUVHdNejdldTVQRXowNVk4cm1OVzhmdEQ3Ly9mUDJqOC9ibjUyM3Z3SVBFdGM0ZU42Z0cwVE1DNUlIM1d2OTRZMVRnRkFITUxDZmdORzluamdtdnZVOEI0TGNEZC9QRng0TS9OYUR0cDk1SUtYRmVFZkJCVHZuWTU2b0ZqY0xZWlZSK0pZQ0FyQWt0UnhHMTQzRGlLVmFMUmxvRGlGODFjUit2M0MxU3FVbzZxVHhCckRpSXVvK01ML2lWWlBuNUlzbTltMTVoV1J0anBIcmZwWkNBdUx5bm9SMTJ3ZDdDdzlGTFhRekMzMng2L3hlSUZReFRxRWFmQ2RleXdYRis4SVhEQjd6bEJGdXd6REltR0pMbmtNbzYrRVYrNWYxVjlOL0RBQjhDZ2Z3UThXZGlFWjhFdUlZMnNlZGhvWEVzYlJXaXFYZGVNL1BaclRZVGMrYkFMUnZ4WU40RWNvSHhKdHZBUlloNnBEUFVoeE9kTTFmZ3dkQ3E0ajNWSm5EOS9YY1h6bTdzaHZHU1BsN2hlS1B0MkJ0L3J2bjdUODhiMzk2M3Y3Q2h4cCtBcy9WcWh4ZUpZWTRrOENEeUJQZjAvckQrTnhveEZWK0t5RXVxc1U5eGQzM3dIK1hPNzZ2bTBEdStvMzNvbGdzYnlGTlNTMEsxS292QW9ud3Jjc3FFN1lSUS85amYzUEVHNXFFWVBxQXlJUlNyYWg2aU91RXZRek42dmVtQzljcUtVRVd4Yks3bEljVmV6RVB6NW9oUWw5N2srZmtaaFA3dHNJWUFucG1pSHhhSkZJZ2trOW5nQ2ZDaDlaRGczaGRwUFUzQSsvNzJPbTFIOTdDV0pjVDM0bXpQeDdBZXVpaS9UZ0RvTEJJN3lqdktldGcwaGp2ZlFwWGFmMHZHLzBqMFZMdFB3WUFydE1CM0tvUWlxWnlmTndGSW5kb2lPb2hFTW5lMTdPZktHaHhqSjRuZXVITExrMnVFWXZNREN1SEx5OFVZZUtpcGtFWHVSR0hJbURtK250ODdzY0t5VW5MNWxpaDcyVXhrTDhqR01MYS9BL08yejg1YjMvdU9SMllSbnJOMVZhVTZ5Vm03RlZadjFvbXhFT1hULzZUMXd0cXBpTVJiOUJ3djhhWTBScnpXUTdoRi82YlBmYnZqZWxkY2xPMDhyeFgzYVdjcTZqODdWR0tGMVpISEZNQXlGMy9ITHc1dmxKU0Y2V0d1a2kxaWd3MHBoRnFYb1ptOVh2WFpZV0tNTjFLOHVsbExqYmRwVUxkZ3N1V0hGNXp0Um9MWFUyZWs3dE43QnVKakp3ZUtvQnhEZEx0ckJUUlZkaGJVM1JvaVozUlJOTzJJWTFWOUNza2crQzVBc3Fud2Y2c1U3b2x2bFBKMWRaeFFCTG1Fd0JSL1pDU1BSY1lNL2E5Wm93WDFTeGZ1ZHFLcXR3L3YvdDJTdjh4QUhETGNCTVZsTnZBV2lUL0YxOW1JWUNvbmdGei8zMDkrNFhCcmwrZzU1V1UvRlVyaDVPMS92bndYYU5jVks2KzFnV3MxUWx5elJVTVl0Qlg3L0c1UW5MNzJ0VVdYMkU5Qjh4QjEzSmZ2MDh4OU92eTN6dHYvOUY1KzZlZVBDcUVScWtuOFpYaGRSaW4zTmlyNVB4cVdnamFPR01GUUxTOGMrMFdQYVNFUldLNTBWcnVjNGZ2UXpnR0xhNVc0RVZDREF6WVVPUkZoRnRRNGUzSVhRb0pZWWxrUzZXUENYQ2NUb2JpUlNJaHUrK3lRa0xvWlVDU2JiUDZaZVZRVmdHVk9SR1Z1MTAvRjJ2dU10OWVWQVh4V1RJL041cjg3dmVhMURmdU5VNWxGRTJBYlplVldNWldobmtSRFh3K3RDUk1ZbFZ1UFhLNjhGbUwwd3MxU2FHblhYY3BBSFhvKzBIQm9wQUNKSjRWQ01aWDNHWDlDeHl6Sm9iRTQrVzl3bFZpWjZILzdVRC9CMHIvV0YraFBRWUE3aEhDUVRjUmlvcVVZS0JsNWVQaVlFdUFmaGxSTVpQM1hUKzd4WEJWODgwSGRkTTFWVHROeFVrck1vT0hMeTRVcmY0Nmw2ZGROTUFNcHdhOXIrZGVkM3E5QlhHWll1MEUyWFNheGo4TE9tbkV2eDhUOGU4T0dUbjJPb2oyK1ZWVXZ6UTFSQUVBZVV1QVZzQUE3b0lSTEFiY3J5OWNYQjJObGNtUUdJc0VRWlI0ZlFLY0RxdWVBTXE4SHNOZU8zTFpvbFdvMHordTVKUnJLWEI0UTlQa2k3RU1NM29aTU0zMmRSUDdmZWJpZGQ1RjloamxidVZpSWxLOEI4WWF1dFhrZDM4S3ZLWkc5djNTNlFYTlVCMnk0blFKYXZ4WnhWMVdFWlJEaTNVUE5JWElpMzYrZGJva3J5VmRMV0FNcGF0UGpIZmFjYm9RRTFlVnhBdkdyakhtMEhobnlTUDBpanlLRE5Lcy9sR2llTmRsNnl0OHI1b1pBd0NQSUtaanVZbGtFaGw5VkFoVmhUUzFOVm5OZC8zc1huaTJkV2pnODJUU1JkTmVtcVhUcmtuTTR1Rjc1R3o5K0FFWS96d2dhZ1F6dUVud3dIeGZ6NzJSQUFCUVp6OVZwL3FQRGVMZmJ4WGlYeHZGQzFrdUdYVy96MXk2N25lOUFPQUUxZ2czZWY0eDNhSlpNbmNRM0tFV0FQaEdNWVFoaG5DZndqTjQ0R3FWTWJHaTRDa1lMM0U1eWdISTFmNFdJRlRTRFNEL2p0TkZjRmhTdGd3SFVaa0F4aXA0U3JBQ2FMUDZmUm54OHVEbFFJcmNuTGhzU2ZFeTNNellpM1RuSGJ6N0crQTFOYXJ2Vm1PdllaR29NeGcvRnN6YWgrZWNLb2NXVjNkbEFMQU5sei9OQTlBQlk5V3FwMWJoZkpEQ1JmZ05yU3FRaFFBWFJBN25VeG96cncrdWY4QWVJYXk2T0tsNG02cEcvd2RLL3pWcXVURUE4QXhlZ0YybzY0Qm9UOEJvYlpNTGNndU1RNWsyQUx0VmhzamdYK1haVzFkNE5pL2tJaHdhVWlucW90cmZ2ejV2LytWNSs2OTgrOWM1QVlBc3dFTjRQK3NnWm5TNTUycmxRVkdYWHdRajN0ZHp2NG9BQU53b1pmaUdHNFlIUUlTVC9zUWcvbjBXSVA1aHZKQUxKcDNDelNGUDVhOTZBWUJVc2VQK3luQkFuTkV0Y2MxbFZkSDZBS1NtQUFCTmlHVUcwdFV3OHdKVDByVCtwUWdYRnVNcEFqamNnMXRJeUtNalhyNlFEQzVXbGlzRDBNQzY5VkkrbHZYeG05VnZTNFRuZ1RMTGUzQUluRUhmVzdCL21FZHlyOG52cnZHb3J0cTNwSHBxcGR0eHJ4M0IrRGVBUExvQmx5c0VsMWpPSEFHa3hnSFlBdnZQSEFEY2ovUE9MbDlkTXQ3cFJGblBBdHJhblY0RDRvRCtUdDZMUTBGWU5aRnRTai9OcTR5M3BMeVgxVCtXL3k2eHpZNEJBSFkvb0dZMkxvd0RjRnV1S3N6Z1ZYcXBJM0tyWUhVN2pQWFUrMndrbGRYejdGNWxJZStCbSttL09HLy81cno5Mi9QMjMvdjJiK3NFQUZpTzFUcUlXZXQvMjRXTFhMeEpBQUROZnU1WHhBSEF0S2x4eFpPRE92RnNYRVNIL0k0bi92MHpoZmlIcEZHTitEZFB0NFZUQUVCNFkwMnQvYjFHUnFZM0J3RFlwNzVLUU9UQnNya25jUFBpa3J6ZGlRQkEyeE5GWUtqUFFWeTNRSjR3cTJES0dkMjA1bHh0TmN3VWo0N0kxb1lLNFZSb3Y2NVQrR2JQMkd2TjZyYzFrT2t4Q3h3aEJBRG9scTA0dmNvaVpwSTA4OTB4bGp3TjcxeHYzNWhoTWtpeGVRU01EQ0FXSVgxMENVSUZCNUVEdDQvc004c2xGd0ZZNFY2eExrRllzWFVaM21uUkFBcFlnR3JNeGFzNElwQlpKRExvdHJGZjhRTFdRVFlUaXpxZEtldHBYdWxmcTVqN1hmOHhBUENhYnNQbzZrTFgwQlloRDJZR0k4TlQ0a0ZITGx2MWFkN1Zhc3VuUG50SGFkdUVDUE04dTUvY1JiaVFMdzc1Ly9hOC9ZL243WDg5Yi8rNy83OHBBQUFQQlU0WkNoM0U3TDdlcHcwVjh3QzhqK2NLRWZDVzAvWGRweWg3WXdVT3BaQk90UkQvZnFBUS8rNUhpSC9vamp5QjIzZVZ4citZMEJZbzFhaTdEZ0N3U05ra1JRalJWT0Ntelo0Uk1ZUXhBQkRhRjBnNHRGTFNORmVyZGJqejc1d21BSURIRk9ZTEVSclhJYXRuM2NXTHBqelAwYThjSUNuOXRpcHBaY3hyMlFGdjRTRzRaTkVEdEdXQXV2czUzejNQbkxTU1YyK0p2RGZjOTdJQzBxWHZGY2d3S1JqenNBczNlZ1NNRWtLWWhCUnU5QWdlMFlITEZ3MjJ6OGpnM3phOGlGejFjUis0SzFpbGNSSlNJWXVSc05wWUlDU2hnWVlaNExCaGVlYXpnQWUyaTg1QW5DUHRaaitoZUFyUXZtVUtQY1VBd0J2RjNZSzM0VEtRUXphQVRYbEl6T0F5eEhTS2hQVDJsY09rUCtIWkI3QlE5NGlOakh3QWVYWXB4N00xa3NtaHYvMy8xK2Z0Zi9BSC8vOTEzdjd2UkFBUUVnMkpIY1NhK3hyblhnTlBrcVA3cnA4cjRrRDMzS1hnaUZiaERXTnhlU3BWeFloL3J3THNkVWJ6MndZQUVEWnVySTNUclJuRk9sSUJBT3BKeklQQjNhV0RsQStNd1FnQXFDcDdnaG5DeURQUXl2NWFaS3VxNHQ1SEEzNnNqRk1MQVR4UFNCdmJvSENlVklvVEFHc1ZUWGxLOFZsT2xWeU45SzNsa3dzd3d1eWtiZ01BVkNEY1dDTFAwM0VBMUQwRzcyZWZrcm9xNzcxSjc3MEZuaWx0VGlTYmhnK1RiV3JyTGx0b2FSYkE4ellCU0N5L3ptQ2xCRHliWS9JY0NIOWdDRHdvZkhzK0NkeUtyWHIzaHdIUU9Vd2VYUndMVng0Y1MrVFZXQUJnaDRBeUFvQnhtcU1ZQUxDSTArZ2w0Yk5tU3JFNzR1bEErMXFJQVFCTzIxb2xOekM3aVE0aGZuUUFjYzBxRVIwMGQvSXF1SDRIRTUrOVJvTXN3NjBPQ1N3WXIweDV0b2E0am4zYy84TDEveitkdC8vanZQMC9PUUNBSlJzNkZ6bUlNVWFIWkpkZGluVkp2ampMcjc2TDU3Sk91b0FQRmh6UnZ1bU95MWVyT29YNDE2TndPTFlNZzZRQkFGa0xZMFpEaFQyVWNtV2xybFFBSUtwOWt3U00rSDNYNlZZWEFnQW5Ta2JNSWJtamp5Q0V4aTdwdmdRQUlHT1lWY2lWRnZFSVF6b3RTcGh2d2NqdXFSQ28zNk40TDRPWEYwYjYxREtFRWZjaWZWc0VUSzRqTUV6OUMyQkc3Mk1NMU1tN1grVzk5K0Z3TGlwa3ZjNUE1c0loZlZQUm9lQzFkV2lRWVB1TnRYaEdCem5hMlc0amZyNUhIdVJVQUdDRm5aalR0VXdoZ3hYd2dvbVkzTHpoUnQraTFObzNnZmZoRU1BQzlGMk1jSFlzQUlBMjY0VHN3cVR4ZlkrdGN5a0dBSG9NOUhFTU53QjBrVmZCb0pRSStWYmg0eXpEUUk2VnVOSnc0ck9YRlFCUWdyZ3FFaTNLM2tDbFBOdTZ2ZjByRHdEKzUvUDJmNTYzL3pjSEFHQmhvWUpoWFBrZzFsaXJPUGV6THF2RlBrbzV1czErTG1xZUR4RDRzQVJIdEFWNm1nZ0FtUGgzMDlrVjBOaHpkRVNFR3dZQXVKbG1BdzFUSUxHYWxxYk1Gd01Bck5xSDZIMDNjT01lU2VRQWNOdFJlQVlIaG9jaEZRQXNCZzQ0S3czd01SMTB5TlBZcEd3YkxXWHNHTUo0NndwNFlSYTlSaUNXL280SUhNVUltQ3pNSXNCdHlXV0ZXWFpjVmlCcGswRGRMaG52UXM3M1BxYjNSa0kwZ29CSjJFdERPWUdwdHJZc0FCQTZCRGwyM3ErRVVCYUlQeVlYTmt5OTY2OERBUEMrbktIOXpFSmRSUUNoNkYxR3I0MXdFa0tDVUZVNnIxYU52a1BlYU0xN1lkbXNTUUk2b1QyYkJBQjZGZmJoQWFGN2pFbmd6NWZvZ0Q0bThoaTZaTXNSbDVMMTdBVURBQ3dCTzNRUE5zWVc1TUZieng1cGtnY0FwWVU3QThhVkQrSkY4ckJ3T2dvMkZJNUJWMmd6bnJzSXo4UmE2YWdTcGdtT1RGQld3YjdoenJLeUFINmtFUDhlS2NTL0tRWEZjOHFONVNJclJscE5QcTAzM0phNzJUSzBsbXFmRlhQWE1nOVNzZ0JRSm5STjRSa2NLKzdCNFJ3QWdIa3k2Q25pdENia2llRHRTZU5wQ0dsdW4yNkZGVWlmdEc3U1d1NzNHcVZQeWExWER1aGQ0b2djS0FUTVFjWEx4RGYwZlFWUTREaXNMSW1SeFBjK292ZG1VSGVrOEhURUpqUUxBR2ppUEZZY0hEbERDSFlrL01OMmJUYkEwVW9CQUt5R0tqVmpRa0pkMjBBYVp5MEVKQ2xyMlJxWUJtaDlMMWtqVm9xaDJENk52MkNGRFNhSWlIbGxBQkFTR3RrQzRnd2V3UGloNStFbDlpQ0ZyR2owaHdneDl1eVZBQUFRNDE0aUQ4QVdHTnpRczV2QkFiZ1B0K0dPeElPWWlZOU1DR08wdktxNFd4djkzRFZJazVGbkxydGE3ZmN1bHlabVVnbmtqV3RaQUQ5VmlIL1BGT0xmTEIwb0o4U3FYekVBd0haQ1d6Y1kxaUhTRmh0YVRRbHdCVHdDbHRFdEp1d1JMVjRwTlJjV3lFM04zaGNFNGFrQUlFUjhtaVhYUEdySVcrdXhFa25QMmlid3NxdmNnclRjNzAxWUMwZkFEVnFEdmNTL293R2pEaVc5bElWWnFwQnhWS0h3cUFYcXhoTGZHN2ticXhReUNlMm53anNDQUxoVytGQkd6WU0yNG9DSTJ1Z2tOU2xtMHdkem53Y0FZRDBVTElrZEV1bzZoUG5tTUJsbWpiVUVzcHVRRElvaHVTT3dPV1hLU0p1aEMxd2VBRENlWTg4bUFRQ2U2QzJJTjdFN1hYTlR6Z0NaQjEwNlM4U0NQRFRTeXF4bmx5Qmxnd0VBQzB3Y0tRZG5ubWRyV1FEL3htY0IvQy9uN1g5TEJBQzMzYVdNYU9wQnZFeXVJblRWRmlHcllROFFQN3ZQRy9sY3pQREFWRUxXZmhkWEtVdURvdUFJaG9hT2xmQ0M1aksrdURWZVZFdjdWQ0grb1pzdlJ2elR2RWVuUnN5YzIzNGd4U3FtekZlRkhHZHV1QVpUQ1VoNUFJQlVYWngwdFJLcWVZMjZCZ0FzNHRPYzRSMTZxWkFsV2FGeG4vYjZBb1YwUWtTbzdrRHVkeFZ1OThKbW55UE9Td1dBMFNhNVppMWhGbHpQQjVSMXdiYytTN1V1OWIwbGUyTU9TSk1iQWJjeWVqZmZKd0RnMEo1a2dVaXA2VUVnQjBwRHJrMXJIUURnc2IrTXRMckxLb1hXUEp6QVBxM0NkOXgwdFVxSS9hNVdDWkMxQ1ZBY3F3cjluMEdHaU1WbDZmcDlBd0RiaXR1Y0FRQStRR0pqN0thZW9jR2tBQUR0MmRySE82RVBlVWhaQUhNSnp3N3BBRnhzZ0FzZGdQL0dwd1ArZHk1TkI2Q2VneGdOSWlMNlpZcHJud1EyV2FPZXUrMDN3eEhGWlErTlhQVkJKZTFQRXh4QlYrdXFxeTFlSTVyMVVuNzRndmgzelNEK0ZSS0pmOHNLQitITVlNMXpxd2NBeURqUGdLQ0g3ZkFkQVlCQ2c0dzZyL0dpNHMxQmVWUDJEZ2svSmFWbXdwcVM1eDAxYklIWTZRbUZQTFFRVHdrQVA0T3pjU1U3eWZJeXJkRTdieEJRMGxqdW9mYytvbHY5V3dCMU1kS2FySUhmQndEd3JqMEFXSjY0MS9BQTdMcGFaY0pEQ2hWdEt0bFBvWkFOaXF5VjRkSzByL3czaTh2eWV3TUFMTGQ1WGcvQXFoSTN6QU1BWWlFQVZsYzdvYXlCaFlSblcwcUFLR21KU29EU1VnREF5MER1S09acW96QUc1OTZ2VXd6M0xBRUFYT1c1U1BMRVdHWTU0Q290S0M1NTFoT29HbVFyTVNnU0E4UHl3MEw4dStkMHlkUVpCYlNkVXZyaUFvQVIzaUE3Q1MwUEFFQVBEUnJhUFdyTkJnQlloejZGNFp3SEFDeFI3UDZVZ0xkVkdUQlVOYkVJWVR5TXkrS05PZ1FBTkJHZE1oMjhvYllQYnZ5UWtTMDZXM0FGeWFUemlhbGZvZmZXd01pZ3dxSXZFOThGKzMrWEFDREdYM2xYSEFBc1R6d0MyVHhvbDlZcHpGUUMwbVZWSVovTE9MVFVaa3cxUi9WRGphQis3R3FWQVBIYnBnS0ErWGZGQVNqVFF1UURHTjFsR2djZ0ZJZG5BR0M1VTdmQkJSYkxBamhRQ0RleFoydTFBTGlveFRHNGNxUjlHekJJWEJhWGl6dXdZaHZlOFBId3d0aThMTEFRQUdqRWM1SGtLVGU3RFFJR211d3JhOGtMMGo1eXVpcmFOR1FVWUN0QWhrR00rS2U1Y1RFTmxOdU9xNVhMWEkyMEZmSjBpRmdSajNkVklSdmkrbGhYUW1QVEN1QytLZ2NBamVraUFQYzlwMHVGaXJzNEZRQXdleDlCd0w3VEt3UDJLZnlRR2NWOWVrQnhXV3pWd0g3ckQ4ek5jV0s0eHpxa3RiQ0ZKYms2RG9kYnlnMnUzOGhERDVIcGhvMDBzZU4zQ0FCU3N3Qm0za01XQUJaMmUydGs5dkFlV1ZaNFNwcWFuaFhHT3FRTHpxcTcxRjloNWNNcTJhaVFKNnYwUHJJQStPRkhTaGJBc1pJRnNLUmtBVmhNZkk2emFjSVM1U3RrQWVCL2l6MjdWVmswbUorOFRhNmNNaHpJbGtHNkNZUTFkbG5QdUV1ZGRtYjlJcU9haTJ1VXdaaFlBS0FSejkwbEFGY0VwRnNPcFBCcHhxeXNzUEV4OWlVNkJkaW13SDJNeEwvWGhwY0JYYkpuQ2plRW0rYXFuQXUwV1hkWnBsUjArVi9TdTB6RGJTWmthRGswTnVIU0ZNVlNzd0RXbGR2TkpxVHNuUVdNVHlvQVlKQzhEOERVNG5jTU9sM3NhNTNjcHlldXRzaFgyV1VMdFZnQXdEcVFxa2JJVUd0NUR0RVRwOHZ3RHRjQkFFS0hHeGNRS3Z3ZUFnQkxsaHFCYytjNzBnR0lTUWVqcWlFS2MybWhJeVpXaG1TR09idm1MZlFmeXRObkRZUDNwZ1BBeFZzd04za2Y0dXBjUVdvTGJ1RXhIUURlTkt6ZWhBUGZVOGd0MWlFZkFnZXhaNzhndHhFcmxLMkNlN0lFaXpZRUFLNjdXclc2WG9qTFRnUnk3emZoMXJaTGFYa1dBSkFEc3hIUDVVeURaWHFYWTJNZUJ3MjNJSktyNUZDWWNGbWxRbXdZR3RDSWYxd3JZZ2VNL2JjSlJ0NEtvNHdiYlF3QVRwZTcxRnRvaHh2dGFBNURpM29LbXU0RjNpeFpGejBFQURTd3N3K1pIYWUwWi9tQXpoTlBaSkM4QnlEQVNndlVoS0hRcTRScGVwZ3RVVW9JQWNUMDJmZHlORDZFTElOdkdXUk9aeTREOElvQmdGUVBnSlVuL3E0QVFGOGdGR0dsbVE2Nnhpb0Jua1V1SXBaME1MdjFoeU1BRDc5djZJWitxS1RwRll3YmVrakVxT0R5S1FHbXZIc3VKVUF1OEZBaDl5MGVCaHlMeDQvSmFueDhvK2ZxVlV3UTJsYWVuUW9BS3VDS2lUMzdDUkJIZWlET05nbWhqVVhEMDJBWkpOYXJ0NnJWclN1SC9KcHhPeThaQUFBUHpLcytsK054ekVHb3VscDU0QWxnOEU0cTRGRzdLWEd0QW16WTcwT0QrRGRQWUxUcXNqVys2d0VBd3dvakdac29ML2E0YkNucHZJSXJ3N0MrdEpMRnh3YkhJZ1FBVGdQRTJGUFlrMWpMbzE0bFFKRkZmZ3ZmQVVIQXFaSHlaaG0zWStLOXJMbXNYa0lLQ2JBZTc0alYyQTNObDZLUVFSNE91UFFQQXdSREt3UmdjUUJDWElkM0FRQjZuRjA2bXJNdVptSE5YTFVXUUY0QVVDUTd5Z3A4QXNaVEFWN01SYzkxQnBpMEdRTUFWaTJBVU1qcGJjUjc4YjJOamdFQXJSVGhocEdXSmlBQXExK2hDQWFxVTIwcU4wMFdyT2h3dHNJUy9oM21jUEloeUdsRjI0blB2a2NnUUZKVThOYXN1WEpTQUlBdzE2MXFkVmpzU0E1SlpMU2p5SWNHQVBqQXZNcHpaVjZtNEdEYW9NTS9WRm5SY2tleG9ad0dFdGdHaFZaNHd6MTF0bHJhQnJuMFUyOTZ4d1paYVRMU1JIbFJkT0xsM2ZMV0FwaUNrQUY2VjQ0VUpucHFMWUJqSTkwUVpXTXhoVk8rQTZZZ3BRS0FCVERxQ0FLMHd3aU5lVWpsN0pBSVRyTUtyNmdlRXVDcDRzclYyZ3A0dTVpSWxzY2dUeER4a3IxZ0RJcENtdnBIaWlkbDNDQjJmdVAwcXAwV0tOZkNlSk01QUFBZlZLdE8xL2xZQndMM0hNVGN1VTVMcUJwZ1hnQmdjZGt3RExNTzU4WThySUZOSld5Smg2am1vdGRDUXNzMFppdHRrME1BSFRsSnA5Si9rY2JKTnFUdWFvQkY1YkFvQVlGc20yTEd3aTdYcWdHR0ZKRGFESUxJdHN1SzA1UmNiUldyUldMdm8vdHdOK0haWHhFSWVPMC9SQS9rcWhaeUdQaUwzLzBpa0pMSG9qVWF1Tm9EbmdYR1FYRWhhQWZtVlo0N0J3Wjl4ZkQweUUxSzFQSGV3azFEMC8wL1VsajVTd1l4Um91NXZYUnh0YlF6V3B1aDI1MUZWbHBJYVBOMGFOWmJEWERSWlF1OWFDcDlHd1N3K2hKdnVWdEtrNEkzYXpEV2FWZGI5Q1lGQUt4Q1AwSUkxQmp2S1FCQWk0OWptZE1sOGk2a3BBRmFoaGw1Q2NLL21BWGpXWUtNanhWS1R4MHd2S0puQ3JkbEh2WlB5ZWxsYURuMHFSMG9uRFZUSklPL29zd0xFenRIamJEY2tRS0FVWGRoemNVMUl6UkpYSDUzRm5aYUJWN0tGb1dOMEQ1ajJsMzNGVGtBQ0RTUmdiOE5ld0pEdkx1S3pjSTFyQUVmMWg3WmNWbmhOQlMwMHNBRmhvL2FqZkFLM3V6eE1yd0tYbFJNRTk5WDFrSmZEQURFNHF3VmR5bHppQ1YvMlgyMkNzemVmWVZSempmd1R1V1dweWx1YWM5ZWR0a3lxMEk0Uk9BUmUvWTFBQUdQUE9Ic2xRY2xiK3E0NFJWOG4xOEhEZ2trSmg2UzhjTUZxN1Z2eVcyS0FPQXF6MldYTHNiOEQrRHdSMElOS21VTkdQRTlKSWRoWEhlTDNNWWFhbjBOZWNNVzhjOUsrK05tc1pWVFhjT3JaTHp6QWdCc1NDNk42ZlNMUW1KcUZzQ0txNVVkWHFLYit4Z2MvaExPU0FFQWtpV3lTUVlVZ1l6bHpnMTVBSERzNnk1YkdSQVBDaXNESlhRalBTVWJzQXB6ZzhhekFxRTJ2S1ZyWGxIclFNSHNHcXlWb0JVaTQ5RG5uSkhSc21jWS9EekVUbTFQb2pvaXFxbHV3ODNjQWdCY2VYRmVTWjlHWHNldVh4KzdrRko4RE8reFo5am5lblFBV0Z5SmhadXFjSG5hY1ZteHMwUEtKT0lLamgwdVRjNTZUeGt6Ny9OTlZ5dUU5bHE1Q0srNVdqWE1BK2gvaDk3ZEtzelZFd01BenhTRGF4V25LRU0rYzBsSng5dUYzNjI0ckZBSUVpVGs5cTlWZHB0TmZQWUdQUnNsR1ZPZS9iRy9PZC8wcExQNzNyZy9xOVBGbXdjQUhCQmFXd1JqcWpVTUFld29LTExlNTg3UzRTcUtWZ0s2dE56cExTT25XU3ZLYytheUFobjdBU09BTjk4VTRoOGFQL2xiZHQ5YjZVcDV5R0ZzQkZNQndJSEw2bFZneFRzVUpUb3c0dlA5N3JKY2JLb093QXcxY2ZGaUlTYzgvSjhtQWdBVTZHSURXZ1lEcDZuU1dTVGpJM2NwbUlUOTdsRjJRSWk3MFJHNGtSNkJZZHdqVDhrT1hGS3F4cTFQTzFDMjZFQ3AwSHp3WVlKck82VU0raTdzbTZPSXdXY1NML0lGUXJkSlROMUUwaWlLV1ZrQVFMc3NjbVlJcG03aUJlWUUzdHNxWm9UMnVkNWlRS0ZzazFPWExUcUZWVE1QNFoxV0NJaHJ0UUE0RzhicSt4Uys1WmJpamU3MTgycUZPM2RkVm5yYWVuZnpzaHNEQUkvSTVWb0E0MmtWdjZpNDJySzhjbHMvZ29NS0QyQk1xZXB3bDlLdnlGb2ZydVBaKzBEMnlQUHNpenJ6RjRwekY2SXpYM3B2d0owNlhieDVRZ0JyWUlqa1pqQUg4VWh1R2dkZzFXV0wxZFQ3M0VuRFRYZ1N5SnRteHJFV1BrSXdjUUszdUNyMWowWmdqbTVJUXdIaW40YW1KNGk4WjlYN3pwTWVWcWtUQUh3RDQ4VjJDcHU0NHZTU3RCaWZiM1g1bFFCSG9RbkJVV1JXT3lHYjRha0h2U2tBWU04d29DZndQY3QwMnhXRDN1bkNRbEZuY01OaG83bnZ3a0l6WEdsd1RsbC9weEJXWXcxNERuRXRLcmMrQnFIYmNOSFE1b01MOVJTVkN3aUhYZWNJaEIvUldySG1CcjFmYU9PczIyU1o5aU9uUWg1UVBKbm5tOU55dGZUcEhUZ1BEdUhkWmY3M3dUNXI1WXpGUGx1a3Zvb0JBTnBvVGpXOWlUSzlrNFNKRHlCc1VZUlFrRlYxa29IUHJ0TDNNWUhtVGFlWG51NVVDTStUQ2gvTG10TXl2UHNLa0J5L0Q3UEhBQUNxclhXNGNQbkxIVHB3dFluRUd0bkxkQUQzZzJHVDBxOUkrSHFYei82eCsxMjkrWXVpTTU4azNLSzVtRVE5SkVBc1M0bXU5Q2wzV2NnRkc4Wk1lZUhQd0lldTk3bGFnWlpZWXdEQWhuS2U0cXQ0ODJWeUdoc0IrVTRXNlliZlkwMHhmbDB1cnRlZnArVUZBSlVJTWUrQVBGbE16c1A0L0l1RXNXanFtbjF3RUlqQ1lydC83K2QrREJkNzc1YXpDL1hnR3JmMkhocjFiWmZWZXhDRGppVGprT0NXSEVSSEFJNlF5YTJOVmFzUHdlRXNOTXhNV3Q1M3RrWjdtK0lWWFFJZ3pRZUtoQjBQWEZhV2ZGN3g2dkI3VHdYZW15VzU4VUJacFFObHdLOUxUVFVUTDFNc3VGUjJXVFhRc2dHNEhnWFNweGNnblJoTEphTUM2UlprZkN6VDRTL3YvdHJiWjlZWHNYaGdLQVdNNmM4SUFsWWh0S1M5RjJhaGFPLzBuTmFETnVhdHdKalhnYytoN2ZQSHhwcVlnOHViTmFlYlFMcWNwL1B1dXpCN0RBQ0kzcnBVVzhPRFdDWnhnV0puVzRxYm1sOW1FVmkxZUFDLzloUDYwTjlhRy9Yc1VzNW4vODE1KytGNSsraTgvVVlCQUtrYTVoaHZ1UUFTTjF5MmRqMkNLa25mbUNVeW5hUVJZUjQ2M2pwQ0M3L3ZDczhkTjRpVW9iYXB4T3VGVFk0Z1lKbGl1dGlReTZGdHVHN2xCcVAxZ2U0dXVUVzN1M0RGdnJ4dGcxemFlZGFIMXBBY2hlTWZWK0x6VHhMR3dyRnJjVEczZTZQVjZpNXJMRHp4YS8rT0I0elhGTExicHJMR2NlK3hFZG9DSUxNRXJIaTU3YVlJYnUwUW9aZzFScmJCdnFEbS9iUEErbVBEdktlUWxxMzM3bFc4b21LUEZnTUhpbWFRZVcyM3VteGx5OUI3NDd6czB0eFlCMHFiMDhYQWxtRE90NVN3M29hcjFUMVpKM2IrWFNOOWVnd3VNVUoyTFRwZFhYTUpDSm1UTURkU08rS0ZCeHBjOG51Wk9DNUw1UGw3Q25aUHZobUtkUzBaWHRZaVpZRk1LZS8wT0dITVZ0OHJRRmgvYS9Cd1dQUk1RTUFrbklIYW5CWWhoTXp2L3YxNUZ3TUFYL3FENzZGeUVCZG9vQXVCajhzdmc0Y2JIOENQdkJGNm44LytDdzhDZnVLOUFPSkdmK2d1TmZVdERYTmNoRE5BNXZpTjc0ZEJsU3hLMXFrZThUL3I5WDh2RGZrUVM1R0YzM1dGNStLdGJGa1ozNHBCTHNPS2dDOEFIWXN4bTRLRnUyVE1XOGdJWU9uTkdhT1BaWEIzRlFCTnYxWmNhYWxqVzBsNFRwNzFzV0tNZlZFWi82QVNuNytmTUpabFYxdGNTZmcxejd6QmZ1VFh4VjIvUm01NHI5SEh5dTFjTTdTNDl5d2pKTmtTZUlpK2NYSEJyYUtyclNSYWhHL09hbTY0OWg0RjFoOGJaaVoyOG51UHczdDNFSkJPUFZDS2RBR1pNZzY0aDVIM1hncThkOHFCOHNxNERlTkJ5dk9LcE9vbFdLZG9hNzR5MHFjSDRLSXhCZGtXbXJybU5QQlNDaTRydFBYQ0g3WjN3UWFNUWdvdDhsdGtyY2tsNkFId3QrU2JEVUZLdHlqL1dlODBSV2NHZnE5N0N2QVo4R3R3UE5EM0hIQnhKc0R1OGo0WDJmUG5CQUx3REp3MjVuU0czcjBHVE1VQXdHZmVJUEJCL0FZR2loOTNPdkJ4OFdYd2NPdFFEdUNiRFg3MmRNNW4vL2w1KzJzZkN2aWxmeGVVb0dVTjg3Y0d5UW9OeHkvOGJaeUJUWXVyclZRbHJscXBuOTRCRGIwZ3NZWC81Z3JQUlNRN2s2T2hiTzlqeFppSlIyTXlNRzlJVG1NajBFNUdWK3RqbWp3OEhYNjg3RXFiVk9Zd1QrUG41RmtmTThiWXA5eWx2a0FCREU0N0hmNjNFc1l5VFFlTlpOYzg4WWJyamw4VFgvbjFjUUVVUC9XZzhlZDBPNThLdk85MGdsRVh2WVJlK0I3YTdXa1V4aktucEYzT3dqaFp6eDBWTU84RzFoOGJabjdHWE9TOVV3NlUyUVFieUFiNWNlQzlSNmh2THBvekIzTXdBZjN6Z2FMZGhuSE9lVTd4TzdORU45cWFhd29JRU1EZUM2blRvNHBIY3h3dUh3VjRiN0hQT0RjM2FWNEt4RzBaZFpkbGovdjg4Mi9UTjNzRDZZUkRjQUhTVkQ5bEh3NENWd2JmU1J1emhCb0gzYVhJbDlYM01KQXp1NVI5ZnNQdlV3UUJIYkJmUW5PSy9TUFA1L3Y1akFHQVg5TkIvTUMvMkN2NnVQSWhZaE9wRGJiRmZ4ZzhnRDl2d3JNTE9aNzlUOC9iWDUyM3YvV0c4R05YVzMvK0RYeUU0Y0FpRk1QeGtUR21KeTVicS9vTnVHbGIvYUo2NlorSlhoQlp1S0dGMzFybmM5c0paSTNtYU1nb1oyUFdDZjBPR1gwTE9VMFU5bmpEc2RFZE1lYStRQjZlWjRvcnJXRDhmV3JqNStSWkg2SCtVR0ZRak9CTC84M2s4TCtlT0pZQ0hUUVM1cnJsMS9RMXYrWS84UWYvQmVEOTZYbjdVY0k2R0luc3ZUR2FJem1NV29EbkV4TGNHbmUxd2t2ajVMRWFVN3hYVWdORFczOW9tTWRjYmZuWkNiSVoybnZmQm51VTUwQVpVMnhnbTNMQThYdDMwWjdYM251YzVnRDd4d09GRDhJZVdqODhwN0ludGZhOXJmbWpELy8rOFA0WmkyV0FOaWh2OWlIbDF0YmlENXBXLzc5ZitBWEpNY2VQL1kyVkRkdW9jcURqNGNxR1JFTmdZOFNFTGhBRFdqd0JMK2w5WHdFNTZyN2YvRi82QTFYQ0F5aTErNHFNMlpDN0xBaUNHMmRJZWE5aGNnTTFxOTltdnZNcmY2Qmd5VjdzdncrOERlaDFrTU5PNHFBUC9GemZoVDYwUTNXTTFwNnNDYzF6MU9YMEVzUGlaZW4wdnlOa3FRNElIWFQ0djhHL2wvZEZENUlHQUViZ01NTkRyT0N5TmRBbndQMkpJTzVaay90dWRKL05mTmY3VGV6N04zN3RNbEIrN20zQ2EyV3RXRGRSRFlRS0dQL2M2VVd0TENBM29uZ2hudmk5Y2NON2JRUTRQQUtiamFCYnBKMEhZUzhQa05jUGI5emlKZm9xY0FuclNPaTcxL2Y5eHMvekN5Q2FpdWZwdHA4TEZsN3JEdlE5QUgxM1FOLzQzaWwyaC9zZmhIZVhDMGgzempFK2g2eXJ2TS9uZnBHays5Ui9nNVIrZVV6WVgxc3FBTkRjUldOR0xHY1dYTkFZMjJxSFNReXhqZ1VFL0ZaeGJYSU1oZU9KbWl0eFJJazd6WkpyVk9NQ2RNREc3bGJTb3g3NnpTQWI3d1lnZGpaS0xCdU1yck1KY3JuTktJU3ZadlhiekhkdWM5bVN2UzhWUTYzZE10QWd5MksvQnpGUkxMVERhMUFMdVdqY2tTRlhXMkxZTW1CaUNQcm9salJNWGdya2tEeHd0Zm9WNG02ZUl6ZjJsTXRXWkZ5ZzJQOHdwYVkycys5Rzk5bk1kMzNjeEw0RnVONmhVRm5zSU5WaTBWb1k2dGYra25NZFNNVXBZU2xlMjVJRjhzQjdjajRucndHNmlmbkNObUY0RFhBOXQ0UEg2WjRTT21UUEFicWdyYjc3akw1dkU3QmdiMHBLMzlaN3A5Z2RucGNKOGxnUGdPY2xObi9zMWJuSzg4ZklmZDhCSHFpVWZzY1YwUHM5RHlBVkFGanBFeHJwcmdnRUxtUzNZdnlub01RajhJT0pDMTRqTnlHaEJnbDJRd0V5RVRKUFY0RFV3c3hPekFiQUcvQVF4ZEhrcGlBZzRMcmZnRWpjWWFQRWhZTVc0ZEJhY2xtbE5sVFI2MjlpdjgxODV3Ni9xZSs1ckpEVWtKSnhnRUJpQW9ocTdVQ0lla3BzY1NGYjRScGNVZGphVnZZSWx4aTJqQ083Z2tlQnQ0QnhWZ1FCWXRCWndWSzB6dGNwcFdqV1phdExvb1lEaTFNMXMrOUc5OW5NZDMzV3hMNDUzdHFhY0pCT0dHeDBqWWo2dWJ2VUZibnIxM1lLTVpVSnhaMEFodVF5d3J3QmpTZzJSOXdCNWcwZzRWUU8wOGNHZVZqakRzeEZPQW5jOXhPRlQ5RkRmSXBRMzlPUnZtTjJaeHJBNFR4eFFKRFBOSkZqakJodVMzbitkT1Q1VEVCdFNiU25zOVRuRFBLQlVnRUFHKzhaeXIvZnBweEdUY0FCaVhvYUl4RVhtckQvTlFVdmZKYWtvQWpqMTBvbmtyU1pUVWh2MmFMY1RoUkhHS0FiOEdURUZma1ZwZGRwUm1rVjBwWXdIUkZGT0ZpRVI0cTlOS3ZmWnI1ekp5QjZBWkI5eElndlVrUGhva0h3QWp3bjdZSVJTSUVVZWVkdEpWOTdWRG44VWZNQUt5Wk9rWWNKTnpkdXhMZkE4RjV5dW80RUczUk9WWlIwclJJQTVuVklSUk1OK1dWWHF3N1h6TDRiM1djejMvVkZFL3UrazhDNG5xR0RBTVc2U29FVTBWNTNLU2gyMzExV3RVeEpUZVdVNG02L3ZwOUFCb2VXT1dDbGlxRkVPMS9jeHVnd2ZRRWdYRXZGbmcvMHZRSjdSZXY3WldKR1JUMTl2MGl3TzB0MHVWeUgvNzBNcVpTcDc4R0UyOVRuVy8wdUtDbW9xZlowaGNhRVdnQ0ZWQUFRa2xBVTBRZ1J1YkFrSE5Id1lncU1mREFrSjhtaHlnSWtJdm9oMHJFc3pja0hoS2JFaEFJcEtEYURoODhvM1lBWDZIYktyc2c3VGhmWVlhT0VkZGgzM2FYeVV3bm1VYXNqM3F4K20vbk9YUW81aXI4bjV4cXpYam1TL3lTdFRrQ0tLTVpKZFVRUjBXRmQ5VGZLNGI4TStjeFlJNEEzNGJxU0I0eGlMSnFTWkgvQW9LTTJPTXJBRm1sdG96NDgxai92YUhMZmplNnptZS82c29sOVAxQU8vNUhFZ3hScmxHaENPWDNlS3lhUzRpOGhFeWNrNktTSmluVzdXZzBIU3p0QUU0dEJpV0xXRHNERHRBdUl5TnArUXYwQTZYczNzZTl1STdOSDAxVEkyN2Q0NUdKMng1b1hGQUJpYlFkci9yaGdWTjhWbnkvMmxyM2RxZmFVM3pWVENDZ1ZBR2dGTlVRUjZnUVdPMHI5N3Jsc09VeXNIYkJPK2Jvczhmakl1NDh0Q1ZKTDRwUUxSS0NrNkpITGxrYVY2a2hhOVNXVWw5MkFEOER1d3RmQVlyWWtkbG5XRk5YTUR1RGppRXp4am5LYmJsYS96WHpuVHVnYjA2UDRlNHJTbUZhREhIa1ovSjdjaDJqR014aEI2VSt1SVNFNjZhdkdKdFFNQWNySWNpMEpjZk0rRHhoMHFmckZsZlJ3SE1ldVZrMlJBVUF6K201MG44MTgxMWROZXVkdWwxVWVUVkZkNDRPZzdMTFZBRkdVcTFjaDBIVzZzRHBsTlFBQXVvQ2syZ0lIdEtZZWlHcU5JVG5hVlpmVlVwQlU0cmJBZm1JRndaUyt4ZTUzdXF4OHNLV3FhS2xNaHZvTzJReXNBV0hOQ3lwQjRuc2NLV1BFZ2xHb2pSQjcvbGJnK1FmazdjWXc2MERFbmtxTkdEejdNb0EwRlFCWUpUV2wweDF3VSswWkNCc0x6bUQ5OFhtNk5ZcEw2NDdoQVJDZ3dUcnZZMDVYWHR1QlJZUEZhN0NjTGRkZjVxSWgyNHE3c0k5SU9LbFY5cVRBUnRuVmFuampqUUVyUWVIR2EyUy96WHpuRGxlck5vYnhzMUF0OTFrZ2FNbXQrcVd6YTJLWGFTMWluVzY4SVhJVlNTeWhpVnJhWEdXUnRjQ3RhcExpNWhVTkFQR3FZSlc3WFFETU94Q0MyZ1Fqd0pYL2NFNmIyWGVqKzJ6bXU3NVUxdFpWK2thM0xYS2VodUh3UjkzMS9jQkJjT1QwcW02REFHYVJRTWRFd2xRQWdHenhYbURNNHdHTjlRT2tZQXdlbmxpTEEvY0RGcnNaQktDaGVZSjM0REtJL2N1OFlHMkNUYkw3dzVENUU2dXJVS1crcGU0QnZuZlJaYXNxZGdjdWtpZkd2TWgvazB2RkFRQTdsSmMvZ3ZGaFpVa09UY2RxYVJ6UUdwTC9MZlVZeWthWU5kYXZySjJxTStxV3BBSUF6YzFXZHRsYTFrS3Uyd0lqaXJjeDJZQUh4bzJQWTFwM1hHMDFMSlM4M1lSYnUweTBkWkFoT2w4RlJDdzNCUzRjd2FVV0xUMzFOd0FBeFAzR0d2WHJjRnZHdXZUYmNLaVdYVllyZlpIUU43cjBHdGx2TTkrNW5WejJTQndzQmdBQXhxK3crTThMVjFzVEcwTlJPeFRPd1pLdGJGU3hwS2tZRDZsUWR1YjBZalpZd2hRTEloMG9ibDZjVnk3bWduSGRkZGczS01HS1JVRjRUcHZaZDBxZnhSeDlOdk5kWHdUV0Z2ZTk3TExTd3RoM2tlT2k5TTdvRmVQS2E5cWhjUWEyajhPZ3d4Q2JacEliNXZLbkFBRE8vUmQzTTllOHg4cUtXdVhESFZyVFdPNld3M0ZjNXBmTDZXSTVXdlNPVk9DLzc1Tm5XRzZ6V3NFdzlESmJmV014SjYxcWFGL2dvRHhWYnN6Ynhwd2N1R3lWd2gxbGZLZktoV2dzOHZ5S3E2MTJpV003bzdFdFFuakI2dmNNZ0YwRkxuRDc5UUlBeXpWMURJaEhKRjBaSEt5NzJsS1dYQVBiOGdBd21sMGtkdTJpeXhibjBDcmNjZFc4RXJqdktzcmt6aWt1OEQxbDBiSUhJSFNZY3J4bmhlSkpTRWprZ2lOZGlrdHZ5ZWgzT1dlL3pYem5WaVYwdEViOU1nREEvNFllbVdFZ2xHblZ2RmFKdElPRVRyeDlMb0pMRVVGQUZUWWFicGc5Y3MyZEVValF5dlFPTzdzd2lGWC9ZQnNPcFExbmE4K25GQVZaamZUTmhaNnc0SWpWNXdyc0NmNUdLMFNVd2pXUStxNU16dDJDMEp0V0M2TGJyNFhRMmtLMzZhekx5aGh6L1lCTVhOVFZGaWZDbSs0aDNXajUwT0F5MWlWWFczNlZNMWxZelc4aEFnRDRkMmNoL0dTRlJMQWtiQWt1UXF2Z0laQzllS0RNU1orelN3Z2Z1MnpwWVNUUmJZREg3UXhDdDN5YjdTTlBIWHFaVDhnVnZ3cDdhQmNPU3J5b3pjRmF0QTdLYndId2xJREhzVVpqazMxZmdYWFA0enVFMERTSFJFUFBQNGF4YmRCWmhSVTJ5NjYyakxiVjc5OHAvVzVRT1BzN1FOMElBSUNEdFFBQUlzVlFEV3ptQUdqdVd5NUVnWWlJSzl4aDN1ODYzVjRyNUpZcXdoZ1FyTEQ3WlpJNEFNSmdaYU9QSUtSNFJhUFA4ZmtTdFZXWUc4MlFZbEdRTVRMUVdMU0czL21xQnRxcWhvZFZ4cXBnR0xEeUdKZnlmR1NrbzA2N1d0MXJMdkNFeHBaQlFOVmw2NS9MQmhldXlnWjRQckNPT1IvK2VQaTFPTHNtdWxZQjhSQmMxbnZPcmo3WFRTbWJCU01XdXhmcFd5czVpcUNOYzlHNTNqcC9JMHlWNGtxRjliN3JQaHpPV2tuWXpzamE0aHV6VnZyNTBPblZISEUvekxuYVV0TkhMbHUrZFpVT2pFTlkwOHd2S2lpZ2xQWDgxOEhieVFDQWYyZU5BSVpXSWhmTG9tK0J4Mk1CMXFWY2lMNHg1cVJQbVpOdE9OanhVcmNBS1cwU1N0MkhtL3llUXZoRkc0ZWVaT3g3RFM1cDgrUlZyaW9YMHNsQURCN0J6aVp3MHVab1RnN2hvRWIzL2p5TXIwVHZ3RHlra0FjQXo1Y2xHQnMrM3lxOW5LZmZSU0swZndmKzh3SUFLd1N3RHJmekxlVy9sV0FCSExoc3RUak93Y1VzQUF2TmxvMURBZ0hBQktUcWFBYUN5MzJ1MG9jdkd6RWR5Wkh0cC9URlpocDk3VU9YaVZ5ejY3TDFvQ3V1dHM0MEUzdWFiYUF0QUlEeGRieDlIME9HQjM5YkxBdXRFUXRSaWJMZ3NxSWdQUXFKZFp0dUpYZ3pXZ0xqdUVRa3FwaHg3M0cxZGJ2bklSdGwzOVdXY09WNFpqa1FXdUdVelJraU5wYWh2eU55VHg4VGNPSDFZS1c5TVFBNE03NFJLMEhtZVZkMnBaOEVNb3FHNFp2eTJqb3hYT2JhQmNZNjdMalNwTGpSK2RBb0tweVpzbkp6TGJsc3hUek5ydTBaRFFHQTl0K1p5TmhIcWRQcnlnMXdWUUVkV3drQWdPZDdseng0ZUVNZFYwS3hHRHJVK0F6OCswZmtrU2dxRGIvN2lkTDNjRUtzSEg5L1BMQk90dW5jUWs3Y1BzVGFVd0VBUDM4YXpxMlVkWnJTcjZ5N0tVckIvdzZJNWlVQklvbG5uMGhnRytRT1FSYnNEaHdlTzRieHdmS21vbk51ZVI0c0EyVGRaSXZrSXNUWURjYWxWZ2lzN0JPckU4VmhSaW1OcFpsR1AvYWg5eUdyNFJpTTRDa1lmWTJRMUd3REhlTms4RGgyaUNTSzM5WXE1Q0h6STQyMTg5dVV1T2dHR0EzKy9sTDViUkp1d1BORXBnb1pkOG5SN2FjNXhSdGlWUWsxN0JGcHA2d1E0QVlES1p2YjhQY2MwOXdsVjYwR3dnZGRiYUdSL3B3QVFHNytvcGFaOHE2YUszMlAvcnZsU204V0FHRFBZd2tNL0JIWk1MeUZIa0dNdXFMYzNHWUR2QlRrRldDckFobU5tNWJKd0dCK0VYTEV1VHp4cnJMK1FnQ2dvQng2SjhwRmNBcnkrQzJ2NVJyZDBnc0t5Unc5QnR1QnRxTzR5bkZkNWdFQWVkWkpvd0ZBM3VmbjZiY0E3WHZTYUNvQVFBWTYzNkNRd0xBUFA5c0gxM0daWXUxY294MjFqckZnUlY0QUVJdGxsOGkxdlEvR2VFc0JLOXV3VUxsUzJGc3dSSjFOTnZveFY0OFd1ejZBbE1rajhHVGdnbWkyZ1k1eE1yUUZpM1hCTWVUQ2xiWllxcmtiMHFKUWkvdU55d3BLb1NmcFRPR2p5Q1prZWRkNXcrM0p4ajJVZW9SL3R3TmhMQXcxVkFDNGFlNU1UUXRoRTR5eEZ0TmNWMzVuVHdtaDNYR1g1WFBmMUFrQVJLWHZmdUs3c2lzZFBXYVZpTGVsV1FBZ1pIZndKcWpkL3JlSVlIem9hdlVHUXZuKzNJNkFMS1kxQmdDYW9CZW0wcFdKYWE2QkRXdE84QktJb01oYXE4eGJ3b1loeVFFS2lhQnRybEo0MEdyVndMcjhBQUF1U2ZZWkdmNTZoSUJDdDhRVHlwMUVJZ2NlYnZNdXE2R3N1UStmNWdRQUl3b0EyQ0MzL3c3RTBUWVZBTEJsOEJTMG10dXN5TlZNb3g4aWUxVEJlMUFpbDk0K2JPd0Q1YmJhYkFOdGNUSmlDMWFrTmFjZ3BJQjFIcmhZRVRhc2dQWTZjcEF4NFdtR2VBemRsUGEwVElidjBNZ2x0endmS09wU0F2TGNndUtaT0Fsc1lnVGplQUJ4VEhOZWlXbFdBRGh1MHJpLzhsNldSZ0NBZXpuZXRXakVqVFZ2QzVLZ21nVUFXRXRreXdCOTJ1MS9uUTRFN1pZZVUvekRoaUVBN2I5djBvV2h4K21DWHB4S1Y0RndYaG1BUVI0QVVJYndIWTl4MEdXVkNMbUVNSE5HdEw1UDRYMVQyd2NBRUFZQUloejFYY0drVkFBUWloT2owcERFcERicEpzbWlHQ2l6cWhHSUJBVEVBQUJQaU1ZNlI0TlRJWGIzRVJtWFBZcVRTdmhnazI3dG11RnJwdEVQcFh0VVhGYW5ZQUdJUlRFU1NiTU50TVRyK3lDZW5DY1doNXJhVExJVXd6SkZEYlg1T3cxZ2hnQmczMGg1YW5PMVVyT2FlMUlEQUpvZUJSdnVOVWg5aTZWRzhydFo0VGdrSUdueFVqU3NuTm82M2dRQUVIclhJeVVjT0c1NEdTMXZ5N3NBQU5hNGw0M2IvMG9DQUlocC9xOEVzZ0Q0ZDVZcG5Nb1h0Uks1NmpHVlRnQkVLZEVyb24xTEhLUG0xcDhFSHRZQzJYN2tESVc4Q3pzNTJ3Y0FFRSt6LzA0Nk9oVUFvT29XUzBCS2ZCMXZ4NGlNT2NhNnF2enVncEdXMUpkelFqcVVlSGFKNHYwbjVLMDRBQkJUb2Rzc0huUkhFTzdRREY4empYN0toMTRHQm56cWZEWGJRR1Boa0o0NkZpelhNbWVTNVR6RU9CZkJlekFGS1lBZExpNEVzbTVzbEpZQWtURUVBRmd3QmROWGk1U3hzUlZKamRUbUJBMzhKdHpFRGlPeDBtMGxsbzN2M21nQUVIcFhEWUFNR21UalU4UGIwa3dBRUFvQmJBVnUvNHNKQUNCVzlTK21BOEMvaTVMcUZ0aEZacmdBeEJVQUh5a0FJQzhIQU8zd0dubFJXYkNua0hDZ3JpWTJEaDkrQUFDNnpzNk5WQUFRcXFnMlI4aE9TNk9UV1BvbWVBdDJ5VnV3cU9RUjV3VUFiWENvVGJxc25PODIzUHozeVZ1QllBWGoyYWdhZHhveGZNMDArczFhUU0wMjBGZzZ0T01LQy9hRnkrb0tJQWpab01ZQ0hDRXAwS3JCR2hZQTJsYW5CNEFySzg2NHJKRFZIbVJzVkl4NHBqVW4vWUZ2Zkp3WUw3WGN0bzBHQVAxRyt0MVo1Slk1bFhpUXZrOE9nSFg3WDA3Z0FIQ214WWk3TEFtYnFnU0l2eSszM0I3REE0cGdGOE5zTTBxWW94RlpBSkxLeklxczZFWFZDR3BUU3JZUWh1bFdLT1Yzem1YbG1WZGR0czVNU0RMM0F3Qnc3bm9xQUxCcXFvL0FyWERLMWFwRElUSVdTVWZXY3RiRVZJVDluaGNBb0g0MzNoSXhqcjhCUElBMXV1Rmo3aVRYT3poS01Iek5NdnJOV2tETk50QmZPNzNlUUQwTHR0WGdlR0NPczNZWXAzQUFOaFZpYWc5NExUUmlaOVV3N3ZKTVM3RVFPVE9IUml6Mk9BSUF0TEY4QXdZb3BiMUxBQkJ6cFdNR1JlSDNBQUNrWkFGWXQvOVZJejhlVlVRbDA2SVQ4dXZybFFJZUpFK1psWGJMaC9TOHkxWkszVW5nQUF3NnZUZ2JrMmtYSVU5K1NVblYwd0NBZUUvbmpEUmRyTjZJM0JaOGYwNmxIb1Bzb0E4QTRBb0E0R3NDQVppQ3hXbDN5SHpuVEFDSnd4OUFiam5McWFLZWZGNEFJQnNMUzJGT3VLemFGcnFMbWFjZ0czbUZ4bEdHbTdGbCtKcHA5SnNOQUpwbG9HODNBQUNJK3o4RUFLcUIyM2dvQytCVUlUQktka2NCM0podkZTS2R4a01aQSs0Qkd6UldaTnQzMlJvYUpTQlg1Z1VBK0kzM2NyUjNEUUJTQVdZb3p2d3VBRUIzNUVhNmI5eitPVlZVeTQvSEV0VVMreDUzWVNsZ2pSdUVLY2tqTHFzd09LRjR1NUNJdkFFdWVTVDBWcFdjZDh4dXNaUUFrYitrcWZVaCtaU3piaVFGTmNSZHFDcnZqb3A5V0gxUnZETVlYdmdBQUs0SUFHNTRFQ0QxM2JWNDdLS1JSb2VicHdKc2RSUldPVEpJSkhrQmdLUXd0WUdMamZXMnB5ZzNkWi9TRmxIekc4ZGhBUUM1TVRiVDZMOHJBTkJvQTMxVkFOQVA0S3BlQU1ERmFCWVZBaU9USFdlQVZDamxYNHVVSWFFVmtSS1FaTlZXT0tZdzB4cVJ1Vko1RWRZM1BvUTlsOUpZUmE2WkhJQlFPaDJIbUVMOGhuY0JBSGd2RndrMEhpbTNmem1NVUpxV3dTV20zNkkzVFNQSmFRSkJtaFF3ayttc2N0bFZJa0x2UUVqMEVMeEMzN3JhU3F2akVHSW9VQWdPYmR5eDB6WHRReW5EbzdEUEMwU2l4am9EbUVhTmhMOTlJbmwvQUFCTkFBQmZ1TjhKOHp4MHVub2NGMi9Bbkg5MG55RmhEU1VVVCtvd2R0cUUzUFhwWWkvY3BaaUpwSElOS3JmelhTWG5YL01LbEF3QWdLVW5tMm4wM3dVSG9Ca0craW9BWUFMeThYdUkzNUhYQTlCSHZCQyt5V082bzlRVEVDL1Jzc3RxY3g4NVd6OWdCSXlaQlpSWUsxd3FIODdYQVFEd0c1d3FiT3dGNDJCWkJmWTQ2c2czR2dCb1JjUU80REJBMTdtUVRLZVViMlRkU3EyWXRDWUlrNGNjaXlWMThYS3pDNFE2T1hCMmxjUG9sUFk4ZXpaWnNHd2xCMmhiajVEcGV1bTk4U0NWWWtVc1JuWU1YdG5Ud0lYTXFnYUlYczVUVjFzeEZDOUFtNVFLWGdBU05lb1hhSDN6dTdNbzJhN0xWbTM5RUFKb0VBQzQ3di9naWJQVjR6YU1ORHBMTnBnbnJoRUE0S1lIQVkrOEVYcWw1S0l6Y2tXd1VnVEVqR2hWQXdBbGNtTTEwK2czYXdFMTIwRFhDd0JFYkFsSm9aMFExcGxKSkZzTlVHcm9MS3hWdktrSkNFQjU0dzBBc05zdVd4ME01WU0zZ0p3MGFhVHFhVG5UYXhBclJibmh2Y1EwUUkyVXlPcVY4eTRyaDQyU3hoc3VXd1Z2dUVscGdCcUJFc2xkVzVSbXVtQzQwclVDTllQS2VqcFN3ak5JVUY1emNkMzdWbGRiMDRNOWcxVWxSeDJ6aXhCUXpsTm1TcGNCWHZicWFMdytzUGJGREIya1hITWVwWXMzNGJaZU1kWmVpT2VFL1dzOEx5d0J2MEJlaXc3cWU4TGdVSldWdmlzdVc1VlV3QlpLekZ2NkxKVkUrMWxKQkFBVjhMREVBRUFqbnArbjN5dUhBTzY1eS9yZW10akV0cEpHdDNSRkFCQ0xkL0tFZk9GQmdFVSswM2dLYUlUUVFCMVNqQjV2eG1YbEl6ZlQ2RGNMQURUYlFJdlg2R1VrSHgrRmFWWWhocmhJaDB2QkFDQ1dzQTNmeGhlVnpJNHF2QU9YeitScWdLY3czbE1DQWNpVkNJRkI1THdnRVhXTFBBd1lQOFpEbHJVdWVCN3duVmJCMjdSR0tiRzdBQlNhRlFMb0NwQzdUc256c2s1eFhRUm9scElsRjVCaHI0Nk1jUjNpM2RzdVd3bFMyeGN2RlRjOXEvNGQwR0YzU0M3cUV1d2JMSlRWR1VrdHpkTTBXOUh1c3NXeVpnRDRsRnkyZExhRUl6Y0NhY3NZdW5qbGFvdHhZVVhPRXFSVVM5dUc3eXVBRTFWVXBYQllyRytXTVphK3VTcnBMSUN0UHNYdUZJR1hwbzB6Sk5ERSs1ekZsckJaMVFBYitmdzgvVjRKQUZ3Y3F2Yzl5YTdkY0VOcXBYT1hsRU8rQkxtbkNBN3lNcDYxamZ2YjgzYk5BNERIUmg0M2J1SkRPcGczWUJ4YSs1WmMraUVBMEVpajN5d0EwR3dEZlN0eW9Hd3BibmpSS0xmQ0ZSb0JTWHYrTURENU5aRVJtYit5eTlaNFB5TTJQWmIvcmNCTnBLb1FXR1BGWkk3Y3BhNTdtV0t4U0JRTnBaeHFxcHlZeWFMVmZPZTY3eXc3UGRza0FLQVJZekZGR0d1dFc2NTA1dWRnT0NxMEpyRENJNE81a3dRQW9FbDdJL04veHpqc01NdzNUenloYnVBbmFRQ2drck5wTmhPTFplRkJLcVdRaTByTy9CS2xMYS9BejJmQW0vYlU2SDhhTGpVcjFIOFJRbXFZbmpjSTYrV0YwZmM0WlhKeDM5TC9FbkIzSnZ4YUZESnVLNFZ6Rmx5dDhCS09VM2dJbWtEVE1ubjYwQXZDYzdmb3NxV1VtL0g4UFAwSytIemx6OGFMTS9KYUl3SEFucXN0bmJ1Z2tBQjNjcEFBOHdLQTMrUUFBQWNFU0FRQVdPcFNHQUxZVWQ2M21VYS9XUUNnMlFaYVd6Y2poc0hHaW9DcGZJVURseTNwek0vdlVyNExGbWhDWnJHNE1HTnV4ZzJJUzJvcHJNTkdqQmRCOGhuRlNrOWN0c2I4b2JQVkxybm8xQng1a2pBR2ZVaHBweWV3RHJYQ1U0MEdBSktSTXdRZ2M0WDRGS2VHS3gzbkE2dDFUa0dhY0E5OVd5M2VYVlhTSHc5Y1Z1K0M1emdVc3FvUWVOSU91d1hqc0pQS29TbWlZYW1OYjNuYVFUb0doRmJPb1o5MWwvSzhMREQwRmc2bFhwY3R4c1VWT2JGME5EOURTTFhqWU0rd2t1cmpTTjhUOEg3YSswdnhyakU0R0R2OStuc09GeDJjQjJ1Y0lZRW1lWTV3ZlJDa1dIME9OZkg1ZWZxVjB2SXYvRnhmWE00K2IxUUlZQlhjUzVLSE9VME0yZ09JajZIMk5MS3dtU3dUeXQvV051NnZmUmpnZGlRRXNLYTRhdVlNaExscWNBQ0VTQ1h2MjB5ajN5d0EwR3dEZmNOek1wNjZyS3d1Y3pFT0ZGZXF4bGNZSm5MVEpzVmErZm50eEZkNVN5QUFjNHZSaFdtNUdlV2JyOFBQTlJHcmRnV2RyMUtjRldQR1IrQmR3RkNheHF2QURKd1J1Q0VWd1RPRElBWVB2Z3FsYW5IcDZSUUFFQ3JIelFDQTMzVXE4Szc0bmh5YlhvVTVIZ051QjNPUnJIajBJZlhKWmNVMUQwRE1kU3pnaVE4alB1eTRiUGdURnhZTnk5djRsc2NIcWNUQUM2NjJkTGJVWWhueDd6cEtiUVNJaFIzT3JzaUpna1pqeWpORXJBZ0x2N1hCZk55TDlEMFU2RnZldndDWkNsZ003Skc3TEFrK2tERE9rRURUaU11V0d1K0ZkK00raHduNE5lUDVlZnJ0OFBQNnhOdmtDOXY4YVNOSWdHS0FsZ0VCendJeXdtcFUrM1M3UW9Pa2xRaldEQkFLdi9ERy9kVUZxZ0ZEOWx3aEFjN0NoaXVDWVpreTBDdkc4eXRrK0VSNmQ3akpSdDlTc2p0TUJBQ0hrWnRPc3d6MGRmREd2RElNbnh6a2ZPaHl2QXZKVGROQWFsc25ZaEUrdjlWbDZ3Y2dDQ2dTaUF1NUdjWFF6bE5jY3BVT2Y4bFlhQ1YwL2xZQnlsdy9ZNHRJaDlzUVAyVjVaVkdTRzNCWndhc1ZJRTF0S3puLzJ3Qmtsc0JsS2pjRURRQndxQUZMdW1vaGw5Y2U4TjExbDdvaHNYZkZ1ZGlsK1pBNE9zOXhtNUtOcE1XamNTNmx6M1ZsSEZnazY0V3huNWZwNEJXeUdSNUdveTViY2xWdW9pL2dzR015blhhRFRHMlpXOTRmZmZqMzRWK2ovd1hTQUxFb3l3d2dZSW5EakpPaEx5bUd2cVFjSUpvVXNOeThVUFoxalhLd2YzSGVQb0diNXhPWExVZ3pEQnR1RnR4Zmd0WVpZU0p4YkV0Qi8yK0JiTkpNbzg4QWdBM2JPZ0VBZExGek9XUWs2VFhiUUFzWWt6QUFHNzVwU2sxalZ5ckd1OXJoYjJWKzUxeHRlV2FPTGI2RXZ4Mmt2NTBERURjSjZ5TGtacHdnVnlTUCt3MGNJUHhNQk1wcmxJOWZCQUNDdFNKV0NCaWoxZ1VLWGswUnVOVXFXTXE4WW9aRkFXNElOdzFQM3lTQVlXeUw1RUhvZ2x2R0hiSVgycnN1QmQ1MUJXN1liNTFlTE13aWpzM0RZYzF6S1FSa0hzY3NwTkk5VmZiemxPS09uUUNYdG5ncyt5Q3RyZDNQaDl4RTcvcjlJTzh0NjBPN3ZhVzJ6QzN2dzJuMTRWOHpBTUNuY0tocVpWbGxBU01DN2xNTS9iSnl1MXAyZGpFZ3JrREloVjhXd0FCZC9OMVBQUS9nQ3lDZ1lVR2FYci9oeEowazdpTnhUUTFBdzlTeEpjWHRoZ2FqcThsR3Y0OXV6VnpsRGIwdXlKVFgrcDJIZUdHekRmUUZHUHZTSHdhUHlmRGhRVDVydUZJeDNzVkdjOFJkaWp0TkdMSFd4LzR3WWhBd1FyZTJRc1NGaVc1R2RxV09LdU4rckR3VDQ2UmNQMk1lUU1ZTWdGTUVxUUp1VU9zQ3Y5c3czU2ExWjh3QmtCbFYzSVA0clZCV2V3VGlzRnpTVllzeFB2UXVYZXRkc2I5WjRBdWh1STJNRzVYdXVGeTRGdS9tZURTMkdYaHZIc3NFZ1BsSHRKODFGNnNjdkJKdjd2RHYxdTV2L0hMd1MrVzFPeDVnZmZIaFJQbnc3eDhhQUpCRDlTdC9ReENqS25yV1BkNVFJQUx1SUVOdmtWQkM1WUQ1NWo2bE5EUkFQd1l2d0pjdUsySGM0amVueEc3d2ZTVkcxd0VOaXg1TkI5Qi9uMy9mWmhyOWJuSVhhb1lOYnlPak1OLzhlMVBBSzJpMmdmNDFlQUh1dVVzVlNUN0l4NVFEZDVUaVhVOUIxMEc4UTZLaFBtakVXdS9SZXNXL3hWdGJqLzliV1JjRDFQcmRwY0pmRC8yT3JCOGNOejhUNDZRQ0hsRDZWZHpJQ0V6SEZKRGFBMW9YK04xUVUxNDhXUlBHTTNCZTVYdTErRDJDd1BtNXl4YXRHZko5Y3h0VVlvejMvSHRxNzlybHNyVkV0SGNkcDNGelZjaW4zcXZFTWVNZUpSNk5iZFFZd3pBZTVoOHMvb2QvSC81bEFjRFB6OXZIbm1Fdnh2eVJOeEl0Zm1PK0lRU01oaDRSdEVZUUtSZ0hpR2hteTgyOW9MUUJNRUEvT0c4ZitZUG5NNWVWTUg3aUxxdkt0ZFA3dG5wai9kSmQ2czV6MGFNUSttOXRzdEhYRGt3MmJBVTRqQWJnSU9DR0xOeW1HdWdQTytmRHZ3Ly9Qdno3OE84ZlBnQzRRYmZwVjNEejZJRWJGVmExR3FRYlVnY3hQKy83MndZeVB2dmdacTU1Rk5vQUVQUXJEUm1tTDNMK1B0YXR0OTZqRzI1TXp3MFBDUGZmQld6MG5zajROQThGdGg1S2I0azlQOC9jOGZoUzVpKzE0WHZmOE81UUFaQ3RBYmJ5QklHbE1icXRkU2szZml1K2lzQUtYZDhma2FmaVBoSHRVaG01ci8zZjNmZjlmTzc3WlhscUJyUTgxa2tBeC9nTXJMNnB6Y3NJell2c2djZmVJL2FGOTRyZHB0RFlHL0IrOUVIcnBmWHdGUGJzRno0c3lNQlIzbE1ENXkwQlFJOGdVdGIyajMxSTcxY2V6TjhFTDFJTGhmUTRCS2w1SnNRekk5L21WMTQzNUZOL3Nibmh4M2JIejg5ai94NnYvRHR4QWJRUkF1QzRwdm9nL1E2LzVaQmlEekZVOE5DLzQ5ZitQYS83ZC8wRTF1aE51bXl3SGNabS9VeHMzbDBZWnl2WUg3YUJ1QjQ2Q09nLzhPL3pHQzVZYityczU3N3Y1NWtmRzE0dXUyZzhQWWF0dDhZY213dlpLM2Y5SEg5R2RxckZzT01hLzZORHlYTFF2TkY4Zm9iNlFzL1h6MER6Sm5VL1cyT05ad080Mm1xQU1ZTTlhYmh5MlZWNlg4bjViTlR0dGkzbjczZkN4clhlQXpkNUt4aTlZZU52OEJadi9SNk9MM2JMSDRZREorWDVlZWFPeDVjeWZ5bU4zeHMzRlIreVl4UzZtS1A0OVF5RkhUam0vMFFoQzA0UlFaVnpZMy90dlZ0V3hrSnFUbTRIaVd4YzkvMXFCYW93cElWaE1RNnhZTHgrZ3ZLc2NWNjBjRXczYlBZdjRYQzdUOTYxbUpkTFN5RzY1UTNIYzRVL01tR0U1enJnZVJ6U202RGM1b3QxOFVzNm9FWGQ4eVVSLzVEM1lIM2pOLzd2SHNHMytjVDNleFA0Q2cvOUdKL0RKYWREU1VmalVOdzBaVk1NQXpHYXY4OG9hSndnV2JBVkJIRWUrZTkweHdPQkw0R0hkUWZtSVpZR3B2MnNBT3NqRkVZYXBUMDhFZ2dkYVNHMm9UcjZ3Y3NsSHZyOUNsbHlHTHpHdUFZTHhwZ0xrYm1RdmZMSXovR1haS2M2RGNDcDhZUzBjS1IyZmc3U2VXT0ZRTmt6cm9IaTJIN1d4aXBjbldzeEFJQUlvNU1RTGhxeCtZZ1JHMUlHMDBPS1VvMktiM2ZtL1AxZWlQbHJNWG5jNUQzS0FSR0w0MXUvaCtNYkpHSWMveDRmT0xIbnA4NmROcjdPaEw5SmFmemVXbndaeDhDS1pVS1lST0xock1MNmw4Mm1wUXN1QXdtUzA5OCs5d2ZDellCbVFZb3FGNmZBM2ZUOWNvbnEyRmpYU2VGc250VFFySGxaOHUrRGExbzJPNGJCbnNNaEd1SzVXQ0lpWXN6dUJ0SVJGMG1aclFBM0VrN0hYWVQzUmhEQU4vTzdZT2lRRXpORGFiMHJrSjBnSk4xdThOQ0lGK0NHTjM3My9IaWUrdkcxMEcyeVh4R2ttYU5uY3YxNTFCeGh3aXphdzJHd1BWMFVqbndHQWpsMy9GcTY3ZC8xdVpMZXFtVXBXRCtUOVdFUlNhZUltelJENzEwZ1lLaVJiQ2NJbUNFNHMvckJ3NUVQL1FrYXo1VExWbUpGV3pXdGpObjZPZTRWOFQ3SndjaDJpb0g3ckpFcHBCR1NZK2RucUM4K04vSDIveWhoUC9OWTVRSXBYckViTVFEd0ZGakJmWFJRcGhveExWM3FsU0xrMFNpR2UwK08zeDhtRVo5bDVUMTRrN09Bem5LRXlXLzkzakprRkdETzhZcnllM05rMUVMUDU3NkhBM09oalM4MmY2bU4zL3Vwd2pDZmdqR3NLV21UcUZ1K1RuUExNcXRhTmJSTnlBTkhBWnhSZnhqSXpmZ2hhVWZrMGVXV1ExSU1pTnpnY0t5akNXUEZORXZNMlVjOWRHMWVzTGdQYTgrajZ4RnZWN0ZNRjVZUmJZUHcwR1BsRzRxR0JLYm9JZ2pBd3gvVGVsY1VFSUFIOUFPNGpYRisvaEpwSDJ4Ulh2OG9FSFhsaHZjQWJ2eFBpUnZVcVhnM3hRT0VJQXlmeWVWbldYVVU5ZlpSVHdJRmd3WXBQQ0E4cXVkK3JtOHAzaHNFWHF4VHNHejhERzNlNjBBcTZUS0JLbnp2Q2ZLdXRDblpUM243NlZDOHNIam96ME4veTJSYmU4bSthV08yZm81RmlUcmhZTHdQODR4cmZOYnBzc3BGNnBQdEVxZWpXNWNBSzEwWHowM3hCdDFUUUxHMm4vRzdvMGlhZUFGdXhRREFTME5RSjJiRXREeC96aFhId2lacmxMZCtsUnozdm9UZngwSW9jdGd0Z3BvWU50N2ttdlkvNS9JWDNXVmxPdXYzVUZNQTYzaHYwdTl0S0twcm9lZHZLMnB2MG5jcFlYeXgrVXR0L043b3doMkdBMUdxcmUyQWl0dVJxNjFjdHV1eXluOG8vb01DVlZ3UFhVU2NzSVR2Qk1VZFVUZkFxa1JwVmVicUE3VC9BbTV3N1lxQndyRWV1R3lGdG1NU2lkcHkyWXBvb1htUkFqUm81UHNVMTJNLzNQZ3NyUXVXbU9VNDRrdEZKd0JWSkhuOVRTaUh2OVI5MENvcTNxRUQraFVZVVM0Q3RBV0NWZmlOc1NxazNESmZRY3lkWTkrOWxFbUJodytEc0YybkZ3WFROUDdMTUNjYnJyWWM4MXZpQ2ZUVFhMK0N1RDluUjJGeExGUXFMQmsvUTV1SHdseXMvMUVpVUtVSlNBMjUybEsrZUlGWmgrZUgrcEVMRzN0aDhkQ1h1ZDlVYkN2V2JGaUJkOStDUFdIOW5QZUtoUEtldU5xQ1VMTEdXYnlNeDZiWnBkVHpjenR5Ym5ZcnVqd2hVSXpmSFdYU08xR3pJd1lBdFBLWUtJbTZyeGd4MUZCbnlWU2NHRzNETkVMbFRqdkFEbHkyQ0JBZUJGeG1sbitYNnhSWXhYK3N2OEVEQ1kwVnZqZHFnN1BhWHlrQkFPRGNZYjM2QlZkYkRROS9ieWNBQUxUNVRtMmFYQ3k3Y0xuVUtoWnJrWFdreVErei9POHdhRGxvcW9sU2o0RU45bE9LTzJJYWFCNVo1VDc0MnpkZ3VEdnB3QkpEaEdWbFVidGZEbmY1bWRRZ2tMb1IxY0M4N0JtYnZTVkFUdVBxbFZhSlVvNjd0anRkS1hDWERtSUVBWHo0eTNyU0tpbytvZ05hcXVoMUdkOVlhbTRjdzk3bXN0QmRRTFp0Z2RodUgrbERUTkh0YkJVQU50ZndTQUVBTE1YTVJZTlFUMlBDeUl6aXVEL3FveUR3d2xvRjJzOVFZWlNsdVZrQmxBc1BiU3ZlbFg0Q3VLaUF5djJVbFg3UTZ6aW9oRTgyNExDVnVlZnZxeFVaS3dPSUxnVitycFVQMXNLSnN3cHdQeVE3YXRtbEhxVXYzQWNIWkZ1dGMxUG1XOVByNFBmRXNlN0NHc1YzYXZONzdINE1BRERDNExLcUoyVEVCQVJJZ1pjRDQxYlJFOWd3alM1MUs4VjVjT051d08xYnE0aUh4VUtLTGx1bm9OdHc5MG4vKzlUL3ZISWdIZEtOVkt2eHpwVUhzYlFqaGdCRXEzemY2YlhoNTJnVFZLRnZNYjY0R2EwRE1LVk02YmZPTGhoam9WV1pGenprZDhpelZJSDMzamNPTzladng4TlRBenVjUTQ1czNEenJiVURSRmhCR2JzSHBKV1ZsejVSZHR0aVNqQlgvZXhYMjBpN01DeFptT25SNlZjVDJDRGtOcXlSV2xiV3J4VjI3bkYwcm9Pb3VLdzZpc1Y4aXV4R3FxUGhjT2FDSG9HbGxwVThJM00vQnpVbmFBTG1jKzEydFF1aUNjanZqc3REeXJCUUFJTzkyQm4rM1QyR3RJcm5ISjBrYmhlUCtXSWx1SFlDWGpOLzZHU3FuOWlzWG56MmFTL0U0blJnZXRDSEY2eVoyNkNqU2orekRTY2dlWVMvc25xc3QwTVhmMXpxYmVPeld6N2ttUnJlcnJYbXpTSE5hSmRCK1FuYUp5NUxIems4RzliZ3ZlTDQxZFZVRVlGaUlqa3UxaTQxSDR2S2pHQUFJdWQycThGRTFJMWFsdzJpWmJrM05BZ0NJaXZBd3dQcngrRGY0a2Zmb0lDKzVyRlo0SDkzc1V2cm5nLzN2NlFCZVZMd1ZWUUlKRWtzZmRMVUZZYkFhR3RhR3gwVytBV1Bqa3JEelJHalRBTUJlUWlzRDhOTThGOXAzd2JXRUpZalhYTFlnMHc0QU0vYXlvS3NhcXh1dXU2ejhOSU1kWkpSck9oVXA2ODNTdHVnbFRnSWZ0RndtZWhWdVBmOWZlM2ZpSE5XVjNYRThmMHhTU1NVVEo1bVoyQjRIMjlnWUREYXJCTnBBQ3lDeGFFUDdMcFdXMWdLMi8rYVh3Zld1K2ZXdnozMkxCTmhKZlQ5VnI2WkdSaTExcS92ZGMrODk5NXowQWY1WkJvNTkrN2ZlbWptOTd6WnRxZmRCSmprdERUcmFDdHMvZDY5c1QxbXJVK1plNjF3UTRQLzl0TWgzVkx3VERORFA3TktWQjgyTDBNRHdXVkREWWtKKy80bWl0NHh5V3VMVjdTaWQ1QnpaQUs0M2FPL3l0eGxzYTUwVjNZM1JkaTFQd0t1amptYjIvVi9aWjE0L2M5SFhORmdlczgraFRuelMzeVV0Uis5S1VPQVRwNG5nT2U4VTNZM2Vvc2ZaRHg1bjNDWkIycHBkQjBvUEFLTFZhVzM3ZlNRQlIrN3JyeXgzWmlDemlwemV1MGNXaU9mdTE1TXlNWWhtNkdjU1NPN0lZNTNhK0tDQld6b1I0LzFWcG9QeDQ2ZGd4ZnVaSmNkZXJ3c0FIbVQreU1jMjJQbE5iTWRtMHRFTDg2RUNnTDRpM3kvOExIaFJjb092TCtXUHl4R1AzRFpEOUVaSWJaTVA1VWJpMFprR1YwZDJRL2VJMG11VlR4ZTk3WHgxa0YrcENBNWVXVExNL2FLMys1NlhBL1pydzRJTGoxNzF0UnNQb2xYOXZyVEhOeStuU3hhREFPWWd5UDNRbFJGdjNMTmkyZnNUUlc4em1kbmdxbnEvUmY5ZTl6YWpRT3BRbHZ4MjVBWVUvYnczd2Vmbmxid3VTelh2dTBsNXphdVMwNklBUVBlOGZkLzFVZWExcmdvQzZnYi9xS1BpaENWZlJWY2F0TmRrV1QzM2IyZmt2ZWpMcHRyNzRxRG9ib0xWc2IxOFg4TFhKZG9udGhmdXVRUGEvVkpYZWZ5eGRYRHN6K3o3YTZmVlE5bjM5YSt0Mkg3M2NIRHYzUTIyTUpkbDRIdWRXZFdMSGtkN25qUjluQ2dBMkpmSHlhMEErQXFYdmphSHdXdzY5L1U1UzBUTlRZTDJKYWhhc2RYZjNCWlV0RnA4TElPOFB0YVd2VTViRnRCL0k2ZVZkQ1Y2TGxnUk83YUF5eWV5dnliSDFnVUFBNW1CMnBmVEYreUd2U0dSNzFHREYrWjlCZ0IzaTdoZitJNjhLQnJOK2l6ZWFwcFlhd0FBSUg5SlJFRlVXL1BPV083QzNXQ2JRUWVvRTl0NzBUL01pZnk3STF0V1c3VUlPb3FVaDRydVd1WGpSWGM3WDkwSzBEZFk5TFZGVzBJZmxLTXZlcHh1TG5ORDliM2YxeFdSOVVQTHJ2Y1o4YkVGWEM5azVqZVgyWjd4em9uZUhPWmxNRGpyc1VTTm5qMVkwQ3Q2ditYK3JaNHk4T2VyeVRtYUxPcW5MTFFGdGI0UG9wTVc2L2EzM2JWbDZkd3F4S0hjWFBVOXM1ZlpkL1U4bUtnUlQxVVEwR1R3MThTeWFJQyt5TFZxcXovUndIVm9TN3crMjY5SzRodkxITTN6MHdNYndmSjIxTEpaNzJkK2FtUEpndTZPckg3NDEzemZYdk92Y2duWUd4Szg2R3cxV3RXcitqdHAxMFZmbFZqUEJBRHpNaEJ1eUhKNWJvRDFrell2ZzYxRlhRbkpmWDNKVGl4Rms2RFVpRzdEUHNkMUFjQjRzTXA4R213REw5aEtjU2U0eDBYSmZ5OHRGKzFVM2t0bnRwV3RLOG0vTnZBNjd3cUF6L2JXN0Z6eXFtVVdSN09JRHhVQVJBbFkwZXg2UzJZTW5pZXdIeXkvREVzUzBVRE44cGQrV05hQ1FiOWpOMnpmSmppMlBldDA0eDBvdXB2cmpNZ3hGZDBLT0pRQmVVZHViSWZCN0h4Q25wc21HK2taYUYxS2paWWdYd2RKWGI2M2xzc3RpQWIwOUgzUk10enJ6SDZ2Vm9rYkM1YjEwNG1QaDVtRU10MHU4RXZmYjdsL0U4MitjOGR6MW9JYnliYk5sdC9JKzZEcXRNV2V6Rlo5WC9waGNETGlNRmlLMWdEQTIwQkhOMnh2eEZNWEJEUWQvUHN6azQ3ZGh0dFF1U3ZLRFlqdVBXK0s3bGJkUHR1ZmszUGFUNHZxM3U5UGkrN21SSjVZdUNWYkJNZVdkK1E1VFg1cVk5Y21GQnVaci9uU2Y5cmpyanFDdldSNVJTYzEyMjdSU28yZWdqaVVMWkJvZFhCTVBvdlQ4amxadFBFbUdtQTFQMklzU0xqZGwvdnByZ3pnMGRjOTBUcVhKSGtnRTl1T0JZMTFBY0I2TURBdnlXdTNWaE1BZkcvamoyK25Ic2xuMWxjYVBEL283V2YzWHBzY2dObUtISUM5b3J2djltclJXenpGOXhFL1ZBQ1FpNUQwRDY4RFNOMFdnZTZiM0pIamJINEVaVXR1M0JwZzZETHRnV3dIbkZsK3hJWU4zRkVDNG4wN0V6d1FmSmc5WWVYSW5sZTA5SzlIUTI1WmNseEt3bnFjV1lJOHE0aW14eVc0aUFham80b2IzNGdsNHVpSEovcXdhWE9ZRkhCRUNYcnBySFdVVVg2U3VkNitaMzZSMlZwMCtlK2orN2JhR2p0bFNlL2Jsb0JleDNKNm9jbXBpOWNOQXdEOTJacWNwWWxxcDNJY2NWOEdFNzFCM21nWUJLVFBxWDRtcWdiL1d4V3JqcWZudkU0YUJnQW5rb2g2V0JNRWFMTGV1SndFMGRNVzJnenNWY1hncndtMmRRSEFndHhQVGlVZ2piNjJXdkU1enhWaDB6Ym1lOEZTOVpMZGo2S3FqTkdwcmhNSnJEYUQ3Y0hvY1dZYkJBRGE5djJoNVVpczJlVG5JRmdGMEsvcit6dmE0dDJUNytuSTZZYkRGaXNBRncwQVVzQXpuRWxTMUdETnR4TThQK2pYMWFDMnB3QjBlZVhROXJKME51SEZXN3hJd3NBSERBQjBqeVRhLy9Ta2xyb2tQcytjMUQvQzQrQTRvQy92NlBMWG5zMzBkYURmbHNGNjMvYTR0WWpEbDBWM085L2MwYUQwdS96VWNPbi83Zk82WXNmai9BWS9hNCtmMi9mWHdoUHBISGFVT2Q2eFV3TmVZR2U4UlFEZy9TcjY1UWpaQXpzRzlrTkZBQkFOSW1kbEFIRFdZcER4Z2tvYU5CM0x6UGprUFFRQW5VeG0rckFsaXk3YjZzT092RTkrRHJMVU55UlRYVy9ZM3Q1NXNtSUY0TFVFS09kZEFkQjdROXNyK3R2NDZ0Mld6RmlQVzJ3RFROc3FtcDYyOE9WLzMxckovUnpQYlltMk0vWDFQWkJWcE1PS1BCeGQ2YnR2Zys1TFdlcldUUDRUTytMbWUrWFJ6SDNKdGhWMlpQQTh5U1JYNjhyZDQ0ckEzUCtPdmgycU0vWXRTOXpidG4xMi83cXViUGpxc1k4UCt2bDQzMXNBK3hVQndDMlpsT3ZrY3pQSUhWZ1B0b1E4cDIyb1NRQXdaRXVaaTVtakdxZnlRVDh1NGlJbHp6N0NNY0NydGcwUUxZRyt0aG1KL2hHamJOZGhPVHZwRlppaTQ0QzY3S0tSMmJadEYraFNmOVdTVFhyTjNnN1UzaHpGWjVxK0IvWlR6YXhBQzJCY3R1RENTNisyMmZmWDBwTTNMckFDNEFGVzFRcEFWRkpVRzFRTlN4NUhGQURrbHBEMS9kWjBtVG1YaUhvcXkvc0hSWGZ4TE44QzZEVFlBcWdxN0tUSm9xbVVyUjUxMCt6dmpnMGVxU3FabmxWUDc1aytHL3hmMnJhUTV3QWN0ZGdHeUFVQSt4ZTRvdlBqdWpLem5FbldxMHNFWExRWnNXYWpyMHFnNVkvNTJtYkZ2dEtnbFUwZkJBbS92cGU5SjROUnAwSEFQeFNzMnFUQlVaZjlkZkQzOHMyNXZYdXRtTGtzS3dyUnpEZDkxblhsN2xHTEFDQktpRjRNQnIrMDFacjd1bTlaNXVwTjZNUnhwVUdPd21pRE1XSzlSUkxnM1NEWVdRMys3dXZCNlk3OUlMZ2NxUXNBQmkwaExDVlU1VXFVSHRyUm1ZNjlFVFdiL1VNRkFLbm1mRitEV2ZwT3NEVVFuWGROQTluM1FZQVJIUWZVV2Z5K1plVXVXVGJxZmliNXc0Ly9wZVc3cjhzOGdLaXkzbHlRdlBNbXVMRjdNS2JsSVc4RTJ3c3Y3WXh1MDMxL25YWG5zdUxyY2dDbTdTVEZtMHpHdTlmYjF2eUZLZG16ZldobjJhZmxoaDBsa0VYdnR5YUpadEdLeDVFY2xVekxvVm8rMjVNQVR5eWJ1c21sUlZhOFRydlBrQTVzRysrNDZLMFJvZVdxMHdrQXZ5KzhraHZZZ1h5T0QyVVcyQ1FJR0xXOG8xa1puQzk2YVVLdkJpOWU0My9OanZCMUtvNENybWJxQUt6YUV2K0pCRVFhVE9SV0ZiUitlMTBCb0NhSmdCNzBld0xzbXYzdGptVHlWdlU2Um9uUVIvSjUxb1RBcWdEZ3VzMXVtd1lBL2JaQ3JhLzlrUVZDdWE5N1FhRGh6SDI5WXlzQU9nSE9KZUdPMVd5aGR5UUEzTEhqajlFeHdQNmFpWVVtbGk4R3I3dVBLMk4xQVlBWE1mQ3M1MlU3N3FMRk0wNkNZMHg2WnZaREJRQ1hNN1AwS0ZsdnIrSFJ1L3ZGdTY1aVZ5elBJSGNjOE1nU00zUmxRUWY4dzVySUwvME9xYWI1bFliSkx5ZHl6T2kweUJmL0diV1p1dTZwYVlLaEJ4WlYrLzVSOFpXcWMvSEhsaENac3F1ZnR6d0Y0UDBxdEh2ZWpDMWZhaVE5VTNITUxQZCtxenRxbHF0TXFQdmhldVJ4cHVpdXpQY21TQ2lObWk3TjJ1eE1tenRGK1NxTE5sQ2sxMzVUQm9CbzhOQnRLTDh2VkEzK1dvaWxLZ2p3WTIvcDhlZmsrZm1sVFpLMHRrRjA2Y3kxdjRnYjJNelk4Y0tvR05DYm9sMGx3RFpGZ0o0WHZkMUtiMldPQWk3YjMreFFFcTV6UndHZnlXTjdBdXloL1o1TlZsSnlpZEJuRXVUc1dTQVZiVzllUFdjQTRFWFJsdXo1NjFaSTd1dFJTZUNId2VSalg5N2JtdHZRS2VJaWM1b29HVzJoSHdWYmdPaytuU3NFZEQvenQ0dG0rYmxqaDEycjIzVUJRRlJxVVRPZk4yWEpTaE5kTm0yNU52cXc1Qkp4b3NTTVp5MENnQytMM21JSlViS2VSblBSQytTbEUxUFA5MitLZDMzanE0NERkb3JlNmxNclJWenlkOGYraUxrdGlCdEYzQlFrV3ZwL0xUZGhIemhYTFNsVHR3TDZaSC93V2NXK2YzVE91S3I0eW1BUlYyZzhEbFlvNW1Ydzl0bk9XV1k1YXpEWXFscXhFeW82Q0doZDlWeXhtYnIzVzlYenpTMGordnQ3Vmo0L3ZnTHdKdGhpbVpYdldiQVpzbGRIckxxcDZnMTUwN1lFdkZqVWpLeHE5R2Z1QzduQmY2SG9MUU5jVlFsUVY1Kzh6YkIyZC9OaVQ5dTJuT3ZmbzYySDAvczhKWXQ2T1dEUDJ2ZmpleWNOQTRCb2Y5L0xBS2VBVGNzQXA2MnFlL1o1OTFvRHV1V2lzOXJvYXpxcGFaUC9VcFhuNGx1c1d0YmJINjlUNUN2RG5qY0FHQTZPd3UxS0VtdjYzT1MrN2x1V3FTbVFWOWpUN1JGTjJqMlU1M3VVU1NnY3pHeWhSNldBZFdVb3QxMWJ0WFdwS3hDNjFhcGJsVjIvWDlNQXdHK0dubGlRb3RpNUlOa2hGeTNyTXAvK29kOVkxbUk2aDc1Z042bGNBT0RsRXYxTXB3L1MwZkpKejNuSmN2bi82Nks3Rm5PVDQ0QysvRDhUYkFQb2JDeDMvTytPWmVtUDFDejk2eEVYcmQxd1lNY3l2UmEybHh4ZHRBK1FIaTlNTThRbXhWZXE2bFo3SmNCY3hidnpWQUpNKy9NK1FONlJsWWxIUlhmWjJEWXJUcmx5czFFaVVjY0dkUytndFNVSlUxSHluRzRYK1BmNGE1SWFNRVVuZVRibFpyWXQyeGZhVjJKUFBvTzVBR0RhQXJUajR1SzlBRkwreVlCc0ZZN0xGVzI1SFJkeHdUSDl2dFIxYjZCNDE4ZitqaVFlcGtBZ2FnaTBHTHplVFFJQTNkK1BhZ2lrb0NScUJIUmJFbk8xdFhRdUgwQi9YdlExRGVUYTVMOVU1Ym5rR250dFc5NkcxcHlJZXNQVUJRQjFlVGI2V1UwL2MxZVMwS092NThvQS8yRDVZNW9ndVdISGRyZUszbTZoYTBXK2tGT3VHWkEvM2txd05UYVlXYzN6cmNzbGVYOUZoZHkwWDhGNFhRQXdYSEdVVG05TTY4R043S0NJaTd6azlrWjBZTy9JVFh0Rm9yaHRtV25rYnNpZmw5c0EzOHRzWXN3RzZXMDd2eG5WVGRaMm9qZUxkNzJpVXhiK3pXQTI1SHZiWjVtejFGSGQvN09hNDMrM3lnL0t2U0F4TTVlWnYxbmtTKzdtdGdLcWFsZS90c0NpVGZHVnVyNFNaMEZpbk5lOHo1VTNmVlNSdVp2TGdrM2JIU2tyZXFEb0xnUGFwaGxRMUhBbVdrWThzT1M0WGN1VVByVDNRdTY0YmZROUI4RlJuNmhqbUI3MTJpbTZDM2t0eTFIQkRWbU44Vm9ZdzhGeTlQdnFCbml0L0wzdnl0OWxzQ1pCN0plS0dXcjYzb0h5ODNxblhNVzdXczZ1VXlDUUdnOE55MW4rWEV2Z2RSblVjNldBTjRycVZzQ1BpOTVXd1BlSzdxNkYzNVVUanF0RlhBQnNKaGdFVmpOZjgwWStUZkpmNmo3VFVXdnZCUmwwMXVVK29aVWFQZkh6dTRydHF0V0tuKy9iaXF0QnZrTHU2N2xHUUg2UDFZSm8ydUo0V1k2NGV6dnRHVm0yMTl5a1hEdGdmYndGT1RXbnIxR2ZuZnJLYlYzT3lIc3NLdVNtSi9JZU5Va0NIQy9paW14K1k5cXhtOUpwWmlreGZUQkhpdDQ2eHJyUGNsVHp1TGtiOG4vTE5zRE5pajJkdEEzd1M5RmJsTWN6NzIrVU40MHZ5dXZiaWtSRGZSNi9aR2IxbnIzNWM0UGpmMmsyNE5HcEwvMzdMUGxWc0RVUUhYOUpQeXZYWWV0TWZzZnp6QlkwWTNjeU15czhsYURzeEpZUk84RTU0aWJkQUgvT3JFSmRLZDYxaHIwbHdVQXVBRGdycXRzQmU4dlphQmxSZzUzWHR2K25IZjgwMFNnNmJodDFCRHdJWm5yWGcweHBiZitxV3lNYUhGUWQzNDFxMDgvSndMaGE5TFo4blFpQ2dIWGJsa25MODVmTHorNk44dk43VzFacmN2dWZKMFcrNVBqOTh2dHZsNDkzdmZ3TWYxVitwclgxOEcwSkJOSkpFazBvMVlUQkJRbU9vbExBS1I4aEtoNlVWb3BTVUhLM2ZPK2tWdEpYeXRmaFV2bTdYczZzL2tXRHdGem1hOTdLdHk3L3BjbXEzbDFacVVtNUZEcm9hQTZHNXpubzBVOXZjRk0zd0dsNWNUMmxOQi9rZmVTK25tc0YvRTF3ekZVRFFjMi9tUzYvTmkxWDJ0THhsdHlhb0R3cFcxbWUwNk9kSVVlTDdob1p0eHRzWGFadHlGd2hOMzNzd1NhRmdIendqTG9CbnRvTlcrdGNiMmVTaWFyT3QrWWU5MVJPR3VTT2ovMUZCdWtiUmR6ZFNaZkZQYWxzdHVqdG5YeXRqTVEva3hVR1RUUWNMM29ybDUwVSthNkMwV3BCM2ZHLzYrWFA5WnI2SzNiMHlqdFRSYlVCVG0zR3FGc2V1ZlA2UDhuWjlQTVVYL214eVBmRzl2YlNtbURqZTZqTGR1TjlGQno1MUgxcGJWR3JSK1F1bGEvbmxlSmRDOXErbW1YRi9Zb0E0QWRKRXIwY2JIbjQzcDkyT2V2SUh1S2VuVFRZS3VMT2FNZXlTckFyeTZzNjAvT1pZenBaOFZ3U0NHZmtwdnhDYnQ0emtvQTdhcWRGN3NtTS9Ja2w2ODNiNEQ4Y0RGaCtJMzRzcHpQUzRQeHQrZnVuRllIK3pMMG8xL0RKazJldmxZUDlOK1U5NHJQeVozMHBnVUFLQ0c4WDcrcGdETWxXeEdQSlNYaFJkSGRKOUZMQUw0cmVOcis2ek45WDNqOStMRC9iVjh2bi9IWDUzdnk4bk15a0h2RGZXajVBYmhDWXluenRxZnc5NmdhUnFrdnpYSDZ3SU1BSEhjL0I4T3FKYVdEN3V1Z3U2dE5rZ0JzcHVrdFNUMmJ5UGlacjhrSFN2di8xOGpXK0pLY1MraTBRZkZ3K0I3MGVGKy9hWmorUkxaM1VPTzQ3TzZJOFhENy9GRmhHajVlMmhGTHZtYmUvUzNYam5nK2hpQXZOK0EzN01ITXoweHRadE4raU4yMHZJcUpadDNxejB4N3BSNWtBNEQrTGQzMlR2dy8yNm4zMmNKUTdJMm5INHk2Vkg4WlBpKzZ1VEZYZEI0K0t1UENGSDBzOHFzaEIwQ0RrcXlLdURLYVA0YTA3UFZEUVh0KzdRZFpxN3ZoYTI2dXFhbGZkbnBpWDJQVXowaS9zeG51dklqTjlPMGdRZTFyK0xmOVc1b3g4SThGaTNiTGlhdEZiSXZxZXJCTDlUL200dVdBblZRUE1QYytVSGY2cTZLNUR2cFg1bmsyWnNjL2JUTyt5N0hmM3lhQ2RFdDRtN2Fhc04rOUp5MFpQUzZUWE1rR0FKdXROMm1EakExWjBJeDRvQnhNZm5EMlFIdzhTUGFzYVBta0M3NWZsNC83cDc5ZC9sRC9yMC9MdnBRSGhOVmtaU2xzUmc1WW5NQ0ZKZTRQMitvN0x2OUdiK1gzWjMwOERmd3BLdmlyZk8yK2YrMS8vZnYzWDM2OVB5dnZaWitYdmZpVVlURHgvWmF6aWEwT3lJbEwxL1ZXWDVybWt3UG1PdkVaYWYwTnpNTVlzd2ZHM2dhMTg3ZHM4dC9UemI5dS9IUS95UG5KZkg1SDMzQSt5eGZ2WlArQzNBT0JXNW9hOVVITmoyckw5TDU4UjlBVWZhQzFJc1ZGemcvU0NFN3BrL29sc0EramVrbTg1ZVBLR0o1WHB6UHViOGlieDUvTERlU2x6SExEdXNaOEZXeXJSYzRsbU1Da0lpV3FEYndXSktBdVNhT1BuZmF1ZWQ1VGd0WFdPeS9zL1hBbVd3L1RJbnU2SitWSFR4WnBaNmMzTTJmUWxPeCt2KzM2ZmxEZlp6ek5IUjNQTGl2TVN6R3FKNkxSQzgzbjV1TGxnWno0WXVQUjVhdUdkRjdMM3ZGVHpQVE1TR0tYUFdRcHVVaEJ3VC9JY3RFenljSER6SHBWWnpMM3lQWmlXU0svVkpPdjVUZnFPN0srUDF0eUkvMVFPZWlrUVNFbTNmaStLdWpoNnd5ZGZ3WHY3dC9rTGQzYWdXUUJRZGNPdXVqRnBNc1BMWUVad1c1Wll2Slo0M1ExeW9lanRNNkJKUlA4bTJ3RFJrYjEwdEMxSzNwaVd2Y01INWUrWVp0NmZsYk9HUDVmQlFKdkg5cXpYSnpaSVJjOGxtc0Y4VWZSMkIvUFhZeWtZN09yK3JUNXZUL0JhREw2bnllWDlINzZ5NVREZEUzdHFlMko2VTUreDVLa0pXeDY3V1E1TVhwM3VoZTJ0K2Q3Y1A1ZEJ3S2VXTTFLM3JPZ3ozSDVKSHZxeWZMeFBNcCtkU2NrdW42MTRubE95dEpqMm51dStSeFBMZnAzcGNRY0RjSkVBSUhmRFRra1JMNEliOXF6ZGNOTlJLUjM4MDNsMmJ5anl0T1lHK1RLVGRLRlIvNy9Jc3BuUEhsS3l5clBnY1Y3WWpiMVBDdTljS21mKy8zN0J4eDRMQnFtcTV4TE5ZTHpnamYrc0tCR2w2dC82ODlZRXIrZVo3Mmw2NlI3cDM0SWdJTzJ4UHJJOU1lL2lGNTJSdm11ejBsdEJnUmZkVzN0aWUzUC9XTTQyTlZpODNtQlpNWnJoWHBjazBiK1VqNXZiKzB2WjVaTVZ6M05VRWpMSDVHamFaSEE5a1NYOE5KditkWG1WT3hpQWl3UUFmc1B1RDVKaW5tWnVacDdNMEMrRC94VlpFcjZkR1FoeU43c282V0pjOWhIL3FSeW8veW8xQVc1WXNzcDRSZktHM3RoVGZmeTAvUCt2NTN4c1Qzd1pzc0VnOTF5MFNVL0tRZEJnYkN6NFdWRWlTcE4vT3l4N2xJUDJ0emp2bGZhUWgvZzBBY0QvclFEQU84TU5uUE42WU9kY3ZXM3J3NXByV0dZMjF5eXBLU29XNHZ1TGFiOHk3VVA2NDQ5SWtLTDdwWDRPdWUyVnpvYmZEWkt4UExOVWc1enhUUEpWK3Y2QnpQTVl0ajNicTdJUGZDM0ljSDZRK1gwMVEvbG0rZnYzbC85TnIzNzVtK3FNZnFUaTc2aS8zN1V5d1BvMGsrVFU5TEhxV2dHUFdBSlUyNzRCUDBneTJKQmt0bGRkdy9LZXVuT085M3lUejBSNi9qZUx1Qis5cnhLTVpkNXZHZ0MraitkNjNaNXZrOGVvZXN6YjNJMkJqeDhBK094ODdKelhxQnlCNlMrNjJ6OCtDWlpxbzZNUmFRYXRkZkJIWlR1aTZxaUh6bW9uZ3NmWG0yQ1Q0S0xwTlNhRHlNM2dPTll6Mi9kTzJ4eTU0MWQ5RlV2Y1hrTThEYktlQktabm5FY3JNblZUd0pVYlZCL1ozOVFIMUtjTmY3L3ZiQW4remprZTYzYlIyMUkwQ3FyU2lramJ2Z0YxS3p4UEdxekNWTDNuejNQNWErbkgwS2FENUxqSllOdnVwU1hvdm8vbkd2MDkycTRlZGExTWNUY0dQbjRBMEcvNzgxTXR6NHg2OFlHMEI2N1ovMUZ4aGFnNFF0cEx2bVgxQ1hJTlE3VFlnKzlyVDJjU3hNWWJCaGROcnlrNXErNmxQRjlJa3QyeUpUcEdSOTJpZ2k3K3Vta1hzWUh5dVVUSHdDYms3eG1kMVUwQjE3QVZ3NGkyWk5MQU1Xd0Q2a3lEM3kvTkZyOHV1anNjanJSOExFL2M4MEZ1Mm5JaXp0TTNvQ3JIWTdwQkhrYlZlNzd0NWMvL2ZsQ0laaWs0SGpkZHhBMTA5T2pnKzNpdWZjSGZvMjMrU0ZkdUNuZGo0T01IQUhxam5BN0tDamE5NXF5dXNaLy8xM0tJVWJsRnpTYlg4cjU2bks2dS9lZTRaTFl2RmZrV3FrMkNpNmJYblB6ZVVUTVByUyt0UngxWGdtSTNYblZ3UG5pZDVteGdHS3dvQkRNZFZPeWFrNEJyVW5JWHZCMjBENnpqUWRHYjVhRE01WnhWSFV5RlFLSU9oMU1OSHl1cUNMWVFCRlZhUWF4dDM0QzZVeDVMTlNjeHhtcmU4MjJ2NlBuNzhkSk5lVTlwV2RRMWU3K3RXZkdnOS9GY3RWWDJkT2IwU1pQSC9PMTBDbmRqNE9NSEFINmpiRm96MnErVm9ydEJndGJtWHkyNkd5S3NTNkdVN2FLM0ljbWRvcmV6M0hwUjNiWXlhdHVyUDFNcnhEVUpMcHBlMm5CblNNNkQ2MDFhcTkrbHdrRlJ1ZHY3UlcvM0xYMmRObXoxNElrdFgwY3JEMXF6Mit0MXo4aUpoRnc3NkFXcFdhQi9qelY3ZmRQdnAxVUh4K1NZWXlvU2xPdHdHRDJXRjIzeWxwcyt5R2tSb0xaOUE3UW5SbFRuWVN0VGk2SHBlNzd0NWM4LzE3TWpsUTNlbFFKRFcxSzg2ekFvbi9zK251dGdVT1d6YlIySnJ2b1UzSTJCang4QVJGWGg5czV4UlIzVXZITld1aUZ0U1BuWlRsRGZ2Q29BT011VW9jM1ZkKzhFTmVMcmdvdW1sei91dzZEM2dYWWxQSlJCeUJ2ZVBDMnFPdzhlU3ZDMExEMEh4alBMdzlvTVpxK0lPM1l0U2tHYXFCMTAxSG50ZWRIYjVFY0hvWFVyVUpUcUxkd3M0aVl6S3paZ3BiK1hENEErb092M0hGa3ZocWx6OUEzSXZYOXkxMkhSMnhZMDk1NXZlK1g2RWZqdnB3MnA5cVV3bHo3WE5wK1ZOczgxOXhscVdrVnkzeXRVY2pjRy9oZ0JRS2RoUGZoMEhUVU1BRTUvaHdEZ3RFVUFjTmJpaWg0M2FtU2lBOVNXRFpvN1JYZTNzZWozMnBNeXpFZEYzUHQ3MEdhZjJnNDIvUzNUNzV4NmR1OUlNREVmQkJ6UmEreGJBS21Gc0RjZzBuYVVhYy80cmxYeWl6b2Nuc2pxeUxJdGdVY0QrbkhGZ042MmIwRFYreWU2bWdZQUorZTRvczlUMUpCcUx3aUFvdWU2MWVLejB2UzU1ajVEVGU4WkJBREFIemdBdU9pTTVTSUJRSzY1ejRjT0FKck9YbklCZ0Q3bjFCbk9aL3ZhcEtqcTk1cTNXdmY3UlhkSE5IMjlSbXg1V0gvR2Eva2JhVENnd1VUYVI5ZkJ1Sk5aT3A2UXZXTjlQc2R5WS9kV3ZtUFc2TVZiQlhlSzd0YlRVWDVFYmdYZ3hBWkFuZEczNlJzUXZYL3FWcjJxQW9CVkszUGQ5dG9NZ2p6TkFWaTJiYTUxcVVpcHozVXJ5QUY0SDg4MUY2eTJ1UWdBZ0Q5UUFPQjd6aGZaczJ3YUFFUURtdTRUNjNMNm9ReG8ydzBEZ0RZRGJaTnJUMll4YlFPQUZSdGsvZnVqRXNETHRwb1FCVXpSNEtqZEZMVW4vWDQ1V0tjV3Mvc3lVS1RaL0ZueHJwT2dEa0lQWkdEMVB2RWFPT3pLb0tNSmtyNjlrUVp4SGZ4WFphOVpUMGhFT1FCUmw3Z1VkTFR0R3pCcy9SZFdHdWE5ekFlckZET1pVdGR0cm1WYlJZa1NWNWNzc1hhMjRybHFiNFAzOFZ3SGdsV250bmxEeTdJQ004YmRHUGo0QVVCVjF2bEZzcFp6QWNCK0VBRDQ2b0ZuOUd1WHU5ZmxvT0dEVTFVQTRFdnQ1ODFnWHFzSkFISzl6SS9MZjd0dCs4SzZpakZWMFFUSVZ3QzJMSGZBdXlDbTVmRVRtV2t0UzVlNlBWbTJQNUdWaldNSnNIWXNTV3RDVG1mNFFLVEpqcm1XdWdPWjk4UytCQ0dyMGxOaDBtb2tSS2NBcXJyRXRlMGJNR0FCUTVQVE1IcVU4NUd0a0VTbHJ0dGUrdGgzaSs3T2ZIN1VOWjNXaUo2cmw0SitIOC9WQTVMWmM1d2NtdFZrVnU3R3dPOFRBTHl2eGpEYXNLY3FBRmlYQUtCcU1OZU0vclMvZUN3enpGZTJ6MXdYQUtUVmd2T2NZWjV2RUFCRUhRTjFEei85NzdFc3EvcFJSbThEZkdBNUFKNW85N2dtK1V5RG4va3lFRWg3OTJrSlhmTWE5R2ZvakhxMDZPNE4vaWhJT3F4cXFmdkFBcFhsekwrZnRwNEtmVUVEbjZuZ3lLSjNpV3ZiTjZEUDZpRTBxWWN4SmNXY0JxV1QzWGhGWGY4Mmx4YkgrckdtMkpYMkdIaGN4UDNIaDZVSzVFV2ZxNzRQSHAremZrZ3E1UFZyelFqdXhzRHZ0d1Z3MGRhdzNySzNUUURnKzR2UllINGdTOWFidHNjOFdoRUFIQWNCUU5zcVpybkIxUU9Bb2N3KzdhNmNBRGdzdnk4NkJqaFVjenBCOTNyMXFGM1Y4VE45clhUcFdNL0Y2NmtHL3hscFJqMWNsaDMrTWFoS0Y5VlM4SmE2L2JhTW4vdjNhVWwrU0dvSWZCLzh6WjRFdlNsKzY3SEFKeHNBMnVVQTZIbnB0bGVUSkVBOU9yY3RBOCs2QlFDK1I2bEwxNXUySC9sWWFvdm5FcHQwejN5eVpSM3p1clBkbWttZTI2ZGRrOEJxMDdMdlgxaFJIODhqMkNpdmRWdnExdWRlVllCbXlYN09jOGt2MEJvQjZ4VS9JM1V0dkd6OUNvWnFxaW5xc3ZNZFd6bVlxdm4zOTh2Qi8rM2Y2bHMrcVFEd2NRS0FUc3NqY1ZFQVVMWGN1MndEejRxY2F4OEw5aWpuNVhzMFEveXBsSnl0U214YXRTem9LK1hBY3JNY21PNlZBNXBmOXh0VWQ5TUtnNzQ4bmdiYlY3SzFzbGgrejJ5UTZQWkFmbDU2M2d2bGxhcjQrVkwzUUlNU3RQcHp0RzN3WEtheTRiVDFXVWhkQzcrd3ZnTjEvUlMwcFc1YU9SaG8rTzlUQzk2MzNSZ3Y4VWtGZ0k4VEFKeW5LRTVVdUNTMzNEdVhLYWViS3R2cEh1VlRTekx5R3ZwRE1yRGtFcHZtckJiNmwrVkFkclVjWkc2VSs5dCszV3N3dUdxUGdXaWZkcXI4ZlY5YURmUXAyK1B0azU4M0pnMWZYcFRYODNMZ2Z4SzBFNjVyUXFNL1o4VDJmbk85RFhwYUZ2TnBBWUQvWHdHQUo2NnRuYk1rcmlkOVZTMzMrdjkvWmdsR1VRTFhWSkNNcEVsaVZZbE5VN0pIUEZ5MnB2MmlEQVF1bDhIQXQzWmRrNlpFVllPcmRobThabTJKMDJBN1lUa0ZFOVpGTUQwSGY5N2o1Yitkc002RFE5S0NtSUVaQUhDdUFFQm51RE1YYUlyalNWOVZ5NzFqbVphNmcrVmdlTDBjRFB2S3h4Z3BCMFJ0T3p3b0ErZjMvQ1VCQUdnWEFOeVgxcXlURjJpTCs1elduZ0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVBnZC9DOStkSWtIaU5sRWJ3QUFBQUJKUlU1RXJrSmdnZz09YDtcclxuICByZXR1cm4gaW1hZ2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbnQoKXtcclxuICByZXR1cm4gYGluZm8gZmFjZT1cIlJvYm90b1wiIHNpemU9MzIgYm9sZD0wIGl0YWxpYz0wIGNoYXJzZXQ9XCJcIiB1bmljb2RlPTAgc3RyZXRjaEg9MTAwIHNtb290aD0xIGFhPTEgcGFkZGluZz00LDQsNCw0IHNwYWNpbmc9LTgsLThcclxuY29tbW9uIGxpbmVIZWlnaHQ9MzggYmFzZT0zMCBzY2FsZVc9NTEyIHNjYWxlSD01MTIgcGFnZXM9MSBwYWNrZWQ9MFxyXG5wYWdlIGlkPTAgZmlsZT1cInJvYm90by5wbmdcIlxyXG5jaGFycyBjb3VudD0xOTRcclxuY2hhciBpZD0wICAgICAgIHg9MCAgICB5PTAgICAgd2lkdGg9MCAgICBoZWlnaHQ9MCAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0wICAgIHhhZHZhbmNlPTAgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwICAgICAgeD0wICAgIHk9MCAgICB3aWR0aD0wICAgIGhlaWdodD0wICAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTAgICAgeGFkdmFuY2U9MCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzIgICAgICB4PTAgICAgeT0wICAgIHdpZHRoPTAgICAgaGVpZ2h0PTAgICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MCAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zMyAgICAgIHg9MzMyICB5PTE0NiAgd2lkdGg9MTIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTM0ICAgICAgeD0yMiAgIHk9MjY3ICB3aWR0aD0xNSAgIGhlaWdodD0xNyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzUgICAgICB4PTM2NSAgeT0xNDYgIHdpZHRoPTI3ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zNiAgICAgIHg9NDg3ICB5PTAgICAgd2lkdGg9MjQgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tMSAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTM3ICAgICAgeD0wICAgIHk9MjEwICB3aWR0aD0zMCAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MjMgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzggICAgICB4PTM5MiAgeT0xNDYgIHdpZHRoPTI3ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zOSAgICAgIHg9NTAgICB5PTI2NyAgd2lkdGg9MTEgICBoZWlnaHQ9MTYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTYgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQwICAgICAgeD0wICAgIHk9MCAgICB3aWR0aD0xNyAgIGhlaWdodD00MSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTAgICAgeGFkdmFuY2U9MTEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDEgICAgICB4PTE3ICAgeT0wICAgIHdpZHRoPTE3ICAgaGVpZ2h0PTQxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MCAgICB4YWR2YW5jZT0xMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00MiAgICAgIHg9MjQwICB5PTI0MSAgd2lkdGg9MjIgICBoZWlnaHQ9MjMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE0ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQzICAgICAgeD0xODMgIHk9MjQxICB3aWR0aD0yNCAgIGhlaWdodD0yNSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTcgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDQgICAgICB4PTM3ICAgeT0yNjcgIHdpZHRoPTEzICAgaGVpZ2h0PTE3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MjIgICB4YWR2YW5jZT02ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00NSAgICAgIHg9MTk0ICB5PTI2NyAgd2lkdGg9MTcgICBoZWlnaHQ9MTEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTkgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQ2ICAgICAgeD0xODIgIHk9MjY3ICB3aWR0aD0xMiAgIGhlaWdodD0xMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIzICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDcgICAgICB4PTQ3MSAgeT00MSAgIHdpZHRoPTIxICAgaGVpZ2h0PTM0ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xMyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00OCAgICAgIHg9NDgxICB5PTE3OCAgd2lkdGg9MjQgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQ5ICAgICAgeD0xNzEgIHk9MTQ2ICB3aWR0aD0xOCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTAgICAgICB4PTE4OSAgeT0xNDYgIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01MSAgICAgIHg9NDM0ICB5PTE3OCAgd2lkdGg9MjMgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTUyICAgICAgeD0yMTMgIHk9MTQ2ICB3aWR0aD0yNiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTMgICAgICB4PTIzOSAgeT0xNDYgIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01NCAgICAgIHg9MjYyICB5PTE0NiAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTU1ICAgICAgeD0yODUgIHk9MTQ2ICB3aWR0aD0yNCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTYgICAgICB4PTQ1NyAgeT0xNzggIHdpZHRoPTI0ICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01NyAgICAgIHg9MzA5ICB5PTE0NiAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTU4ICAgICAgeD0xNzEgIHk9MjQxICB3aWR0aD0xMiAgIGhlaWdodD0yNSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTkgICAgICB4PTE2MSAgeT0yMTAgIHdpZHRoPTE0ICAgaGVpZ2h0PTMwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT03ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02MCAgICAgIHg9MzEwICB5PTI0MSAgd2lkdGg9MjEgICBoZWlnaHQ9MjIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTE2ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTYxICAgICAgeD0wICAgIHk9MjY3ICB3aWR0aD0yMiAgIGhlaWdodD0xOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjIgICAgICB4PTMzMSAgeT0yNDEgIHdpZHRoPTIyICAgaGVpZ2h0PTIyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02MyAgICAgIHg9MzQ0ICB5PTE0NiAgd2lkdGg9MjEgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTY0ICAgICAgeD0wICAgIHk9NDEgICB3aWR0aD0zNSAgIGhlaWdodD0zOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MjkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjUgICAgICB4PTY4ICAgeT0xMTMgIHdpZHRoPTI5ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02NiAgICAgIHg9OTcgICB5PTExMyAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTY3ICAgICAgeD0zOTUgIHk9MTc4ICB3aWR0aD0yNyAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjggICAgICB4PTEyMiAgeT0xMTMgIHdpZHRoPTI2ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02OSAgICAgIHg9MTQ4ICB5PTExMyAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTcwICAgICAgeD0xNzIgIHk9MTEzICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzEgICAgICB4PTE5NSAgeT0xMTMgIHdpZHRoPTI3ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03MiAgICAgIHg9MjIyICB5PTExMyAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTczICAgICAgeD00OTIgIHk9NzkgICB3aWR0aD0xMiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9OSAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzQgICAgICB4PTI0OSAgeT0xMTMgIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03NSAgICAgIHg9MjczICB5PTExMyAgd2lkdGg9MjYgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTc2ICAgICAgeD0yOTkgIHk9MTEzICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzcgICAgICB4PTMyMiAgeT0xMTMgIHdpZHRoPTMyICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03OCAgICAgIHg9MzU0ICB5PTExMyAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTc5ICAgICAgeD0zODEgIHk9MTEzICB3aWR0aD0yOCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODAgICAgICB4PTQwOSAgeT0xMTMgIHdpZHRoPTI1ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04MSAgICAgIHg9Mjk0ICB5PTQxICAgd2lkdGg9MjggICBoZWlnaHQ9MzYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTgyICAgICAgeD00MzQgIHk9MTEzICB3aWR0aD0yNiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODMgICAgICB4PTQ2MCAgeT0xMTMgIHdpZHRoPTI1ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04NCAgICAgIHg9MCAgICB5PTE0NiAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTg1ICAgICAgeD00ODUgIHk9MTEzICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODYgICAgICB4PTI3ICAgeT0xNDYgIHdpZHRoPTI4ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04NyAgICAgIHg9NTUgICB5PTE0NiAgd2lkdGg9MzYgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTI4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTg4ICAgICAgeD05MSAgIHk9MTQ2ICB3aWR0aD0yOCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODkgICAgICB4PTExOSAgeT0xNDYgIHdpZHRoPTI3ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05MCAgICAgIHg9MTQ2ICB5PTE0NiAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTkxICAgICAgeD0zNCAgIHk9MCAgICB3aWR0aD0xNSAgIGhlaWdodD00MCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS0xICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTIgICAgICB4PTAgICAgeT03OSAgIHdpZHRoPTIxICAgaGVpZ2h0PTM0ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xMyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05MyAgICAgIHg9NDkgICB5PTAgICAgd2lkdGg9MTUgICBoZWlnaHQ9NDAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tMSAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTk0ICAgICAgeD00ODQgIHk9MjQxICB3aWR0aD0yMSAgIGhlaWdodD0yMCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTMgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTUgICAgICB4PTIxMSAgeT0yNjcgIHdpZHRoPTIzICAgaGVpZ2h0PTExICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MjUgICB4YWR2YW5jZT0xNCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05NiAgICAgIHg9MTM5ICB5PTI2NyAgd2lkdGg9MTUgICBoZWlnaHQ9MTQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTk3ICAgICAgeD0zNjMgIHk9MjEwICB3aWR0aD0yMyAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTggICAgICB4PTQ5ICAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05OSAgICAgIHg9Mzg2ICB5PTIxMCAgd2lkdGg9MjMgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwMCAgICAgeD03MiAgIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTAxICAgICB4PTQwOSAgeT0yMTAgIHdpZHRoPTIzICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDIgICAgIHg9OTUgICB5PTc5ICAgd2lkdGg9MjAgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTExICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwMyAgICAgeD0xMTUgIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTA0ICAgICB4PTEzOCAgeT03OSAgIHdpZHRoPTIyICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDUgICAgIHg9NDIyICB5PTE3OCAgd2lkdGg9MTIgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwNiAgICAgeD0xMzYgIHk9MCAgICB3aWR0aD0xNiAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTA3ICAgICB4PTE2MCAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xNiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDggICAgIHg9NDkyICB5PTQxICAgd2lkdGg9MTIgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwOSAgICAgeD00MzIgIHk9MjEwICB3aWR0aD0zMiAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTEwICAgICB4PTQ2NCAgeT0yMTAgIHdpZHRoPTIyICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTEgICAgIHg9MTQ3ICB5PTI0MSAgd2lkdGg9MjQgICBoZWlnaHQ9MjUgICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExMiAgICAgeD0xODMgIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTEzICAgICB4PTIwNiAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTQgICAgIHg9NDg2ICB5PTIxMCAgd2lkdGg9MTcgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTExICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExNSAgICAgeD0wICAgIHk9MjQxICB3aWR0aD0yMyAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTE2ICAgICB4PTE0MiAgeT0yMTAgIHdpZHRoPTE5ICAgaGVpZ2h0PTMwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NCAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTcgICAgIHg9MjMgICB5PTI0MSAgd2lkdGg9MjIgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExOCAgICAgeD00NSAgIHk9MjQxICB3aWR0aD0yNCAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTYgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTE5ICAgICB4PTY5ICAgeT0yNDEgIHdpZHRoPTMyICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yNCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjAgICAgIHg9MTAxICB5PTI0MSAgd2lkdGg9MjQgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE2ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyMSAgICAgeD0yMjkgIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTIyICAgICB4PTEyNSAgeT0yNDEgIHdpZHRoPTIyICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjMgICAgIHg9MTUyICB5PTAgICAgd2lkdGg9MTggICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTExICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyNCAgICAgeD0zMjIgIHk9NDEgICB3aWR0aD0xMiAgIGhlaWdodD0zNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTI1ICAgICB4PTE3MCAgeT0wICAgIHdpZHRoPTE4ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjYgICAgIHg9MTEzICB5PTI2NyAgd2lkdGg9MjYgICBoZWlnaHQ9MTUgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMiAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyNyAgICAgeD00MTkgIHk9MTQ2ICB3aWR0aD0yMCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTYwICAgICB4PTAgICAgeT0wICAgIHdpZHRoPTAgICAgaGVpZ2h0PTAgICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MCAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNjEgICAgIHg9MzAgICB5PTIxMCAgd2lkdGg9MTIgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE2MiAgICAgeD0yNTIgIHk9NzkgICB3aWR0aD0yNCAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTUgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTYzICAgICB4PTQzOSAgeT0xNDYgIHdpZHRoPTI1ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNjQgICAgIHg9MTc1ICB5PTIxMCAgd2lkdGg9MjkgICBoZWlnaHQ9MzAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD01ICAgIHhhZHZhbmNlPTIzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE2NSAgICAgeD00NjQgIHk9MTQ2ICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTY2ICAgICB4PTMzNCAgeT00MSAgIHdpZHRoPTEyICAgaGVpZ2h0PTM2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNjcgICAgIHg9NjQgICB5PTAgICAgd2lkdGg9MjYgICBoZWlnaHQ9NDAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE2OCAgICAgeD0yMzQgIHk9MjY3ICB3aWR0aD0xOSAgIGhlaWdodD0xMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MTMgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTY5ICAgICB4PTAgICAgeT0xNzggIHdpZHRoPTMxICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNzAgICAgIHg9NDQ2ICB5PTI0MSAgd2lkdGg9MTkgICBoZWlnaHQ9MjEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE0ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE3MSAgICAgeD0zNTMgIHk9MjQxICB3aWR0aD0yMSAgIGhlaWdodD0yMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEwICAgeGFkdmFuY2U9MTUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTcyICAgICB4PTYxICAgeT0yNjcgIHdpZHRoPTIyICAgaGVpZ2h0PTE2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTIgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNzMgICAgIHg9MjUzICB5PTI2NyAgd2lkdGg9MTcgICBoZWlnaHQ9MTEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xNCAgIHhhZHZhbmNlPTkgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE3NCAgICAgeD0zMSAgIHk9MTc4ICB3aWR0aD0zMSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTc1ICAgICB4PTI3MCAgeT0yNjcgIHdpZHRoPTIxICAgaGVpZ2h0PTExICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNzYgICAgIHg9ODMgICB5PTI2NyAgd2lkdGg9MTYgICBoZWlnaHQ9MTYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTEyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE3NyAgICAgeD0zNDAgIHk9MjEwICB3aWR0aD0yMyAgIGhlaWdodD0yOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTYgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTc4ICAgICB4PTM3NCAgeT0yNDEgIHdpZHRoPTE4ICAgaGVpZ2h0PTIyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNzkgICAgIHg9MzkyICB5PTI0MSAgd2lkdGg9MTggICBoZWlnaHQ9MjIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTEyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE4MCAgICAgeD0xNTQgIHk9MjY3ICB3aWR0aD0xNiAgIGhlaWdodD0xNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTgxICAgICB4PTI3NiAgeT03OSAgIHdpZHRoPTIyICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xODIgICAgIHg9NjIgICB5PTE3OCAgd2lkdGg9MjEgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE2ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE4MyAgICAgeD0xNzAgIHk9MjY3ICB3aWR0aD0xMiAgIGhlaWdodD0xMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEyICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTg0ICAgICB4PTk5ICAgeT0yNjcgIHdpZHRoPTE0ICAgaGVpZ2h0PTE2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MjUgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xODUgICAgIHg9NDEwICB5PTI0MSAgd2lkdGg9MTQgICBoZWlnaHQ9MjIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTEyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE4NiAgICAgeD00NjUgIHk9MjQxICB3aWR0aD0xOSAgIGhlaWdodD0yMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTg3ICAgICB4PTQyNCAgeT0yNDEgIHdpZHRoPTIyICAgaGVpZ2h0PTIyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTAgICB4YWR2YW5jZT0xNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xODggICAgIHg9ODMgICB5PTE3OCAgd2lkdGg9MzAgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE4OSAgICAgeD0xMTMgIHk9MTc4ICB3aWR0aD0zMSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTkwICAgICB4PTQyICAgeT0yMTAgIHdpZHRoPTMxICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0yNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xOTEgICAgIHg9MTQ0ICB5PTE3OCAgd2lkdGg9MjEgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE5MiAgICAgeD0xODggIHk9MCAgICB3aWR0aD0yOSAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS01ICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTkzICAgICB4PTIxNyAgeT0wICAgIHdpZHRoPTI5ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTUgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xOTQgICAgIHg9MzUgICB5PTQxICAgd2lkdGg9MjkgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNCAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE5NSAgICAgeD0xODcgIHk9NDEgICB3aWR0aD0yOSAgIGhlaWdodD0zNyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS0zICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTk2ICAgICB4PTM0NiAgeT00MSAgIHdpZHRoPTI5ICAgaGVpZ2h0PTM2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTIgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xOTcgICAgIHg9MjQ2ICB5PTAgICAgd2lkdGg9MjkgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNSAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE5OCAgICAgeD0xNjUgIHk9MTc4ICB3aWR0aD0zOSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MzAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTk5ICAgICB4PTY0ICAgeT00MSAgIHdpZHRoPTI3ICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMDAgICAgIHg9Mjc1ICB5PTAgICAgd2lkdGg9MjQgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNSAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIwMSAgICAgeD0yOTkgIHk9MCAgICB3aWR0aD0yNCAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS01ICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjAyICAgICB4PTkxICAgeT00MSAgIHdpZHRoPTI0ICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTQgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMDMgICAgIHg9Mzc1ICB5PTQxICAgd2lkdGg9MjQgICBoZWlnaHQ9MzYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tMiAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIwNCAgICAgeD0zMjMgIHk9MCAgICB3aWR0aD0xNSAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS01ICAgeGFkdmFuY2U9OSAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjA1ICAgICB4PTMzOCAgeT0wICAgIHdpZHRoPTE2ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTUgICB4YWR2YW5jZT05ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMDYgICAgIHg9MTE1ICB5PTQxICAgd2lkdGg9MTkgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNCAgIHhhZHZhbmNlPTkgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIwNyAgICAgeD0zOTkgIHk9NDEgICB3aWR0aD0xOSAgIGhlaWdodD0zNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS0yICAgeGFkdmFuY2U9OSAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjA4ICAgICB4PTIwNCAgeT0xNzggIHdpZHRoPTI4ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMDkgICAgIHg9MjE2ICB5PTQxICAgd2lkdGg9MjcgICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tMyAgIHhhZHZhbmNlPTIzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIxMCAgICAgeD0zNTQgIHk9MCAgICB3aWR0aD0yOCAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS01ICAgeGFkdmFuY2U9MjIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjExICAgICB4PTM4MiAgeT0wICAgIHdpZHRoPTI4ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTUgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMTIgICAgIHg9MTM0ICB5PTQxICAgd2lkdGg9MjggICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNCAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIxMyAgICAgeD0yNDMgIHk9NDEgICB3aWR0aD0yOCAgIGhlaWdodD0zNyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS0zICAgeGFkdmFuY2U9MjIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjE0ICAgICB4PTQxOCAgeT00MSAgIHdpZHRoPTI4ICAgaGVpZ2h0PTM2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTIgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMTUgICAgIHg9MjYyICB5PTI0MSAgd2lkdGg9MjMgICBoZWlnaHQ9MjMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIxNiAgICAgeD0yMSAgIHk9NzkgICB3aWR0aD0yOCAgIGhlaWdodD0zNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjE3ICAgICB4PTQxMCAgeT0wICAgIHdpZHRoPTI1ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTUgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMTggICAgIHg9NDM1ICB5PTAgICAgd2lkdGg9MjUgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNSAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIxOSAgICAgeD0xNjIgIHk9NDEgICB3aWR0aD0yNSAgIGhlaWdodD0zOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS00ICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjIwICAgICB4PTQ0NiAgeT00MSAgIHdpZHRoPTI1ICAgaGVpZ2h0PTM2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTIgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMjEgICAgIHg9NDYwICB5PTAgICAgd2lkdGg9MjcgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNSAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIyMiAgICAgeD0yMzIgIHk9MTc4ICB3aWR0aD0yNCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjIzICAgICB4PTI1NiAgeT0xNzggIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMjQgICAgIHg9Mjk4ICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIyNSAgICAgeD0zMjEgIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjI2ICAgICB4PTI4MCAgeT0xNzggIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMjcgICAgIHg9NzMgICB5PTIxMCAgd2lkdGg9MjMgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIyOCAgICAgeD0yMDQgIHk9MjEwICB3aWR0aD0yMyAgIGhlaWdodD0zMCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTQgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjI5ICAgICB4PTM0NCAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMzAgICAgIHg9MjA3ICB5PTI0MSAgd2lkdGg9MzMgICBoZWlnaHQ9MjUgICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTI3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIzMSAgICAgeD0zNjcgIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjMyICAgICB4PTM5MCAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMzMgICAgIHg9NDEzICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIzNCAgICAgeD0zMDMgIHk9MTc4ICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjM1ICAgICB4PTIyNyAgeT0yMTAgIHdpZHRoPTIzICAgaGVpZ2h0PTMwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMzYgICAgIHg9NDM2ICB5PTc5ICAgd2lkdGg9MTYgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIzNyAgICAgeD00NTIgIHk9NzkgICB3aWR0aD0xNiAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjM4ICAgICB4PTQ5MSAgeT0xNDYgIHdpZHRoPTIwICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMzkgICAgIHg9MjUwICB5PTIxMCAgd2lkdGg9MjAgICBoZWlnaHQ9MzAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD00ICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI0MCAgICAgeD0zMjYgIHk9MTc4ICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjQxICAgICB4PTk2ICAgeT0yMTAgIHdpZHRoPTIyICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNDIgICAgIHg9NDY4ICB5PTc5ICAgd2lkdGg9MjQgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI0MyAgICAgeD0wICAgIHk9MTEzICB3aWR0aD0yNCAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjQ0ICAgICB4PTM0OSAgeT0xNzggIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNDUgICAgIHg9MTE4ICB5PTIxMCAgd2lkdGg9MjQgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI0NiAgICAgeD0yNzAgIHk9MjEwICB3aWR0aD0yNCAgIGhlaWdodD0zMCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTQgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjQ3ICAgICB4PTI4NSAgeT0yNDEgIHdpZHRoPTI1ICAgaGVpZ2h0PTIzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NyAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNDggICAgIHg9MzE2ICB5PTIxMCAgd2lkdGg9MjQgICBoZWlnaHQ9MjkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI0OSAgICAgeD0yNCAgIHk9MTEzICB3aWR0aD0yMiAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjUwICAgICB4PTQ2ICAgeT0xMTMgIHdpZHRoPTIyICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNTEgICAgIHg9MzczICB5PTE3OCAgd2lkdGg9MjIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI1MiAgICAgeD0yOTQgIHk9MjEwICB3aWR0aD0yMiAgIGhlaWdodD0zMCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTQgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjUzICAgICB4PTkwICAgeT0wICAgIHdpZHRoPTIzICAgaGVpZ2h0PTQwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNTQgICAgIHg9MTEzICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9NDAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI1NSAgICAgeD0yNzEgIHk9NDEgICB3aWR0aD0yMyAgIGhlaWdodD0zNyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTQgICAgeGFkdmFuY2U9MTUgICBwYWdlPTAgICAgY2hubD0wXHJcbmtlcm5pbmdzIGNvdW50PTU2MFxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD00NCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9NDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NDcgc2Vjb25kPTQ3IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTgwIHNlY29uZD03NCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTE1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTE2IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTEwIHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTk2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yMTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTIxOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTEwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yNDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTg3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMzAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0zOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9OTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTEyMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjIxIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMzUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9OTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTE5NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTg3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTE5OCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9OTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEwOSBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTE3MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xOTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD05NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjQ4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD00NiBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTE5NiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03NSBzZWNvbmQ9MTE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0zNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTE5NSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9ODkgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTM5IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTQ0IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTE0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9NjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTk2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0xMTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD05NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODEgc2Vjb25kPTg0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD00NSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTg3IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9NjMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMzEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NDQgc2Vjb25kPTM0IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjU1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTcxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTQ2IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTE5MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMDkgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTg3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xOTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMjYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTg2IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjYgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MSBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQxIHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE3MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9ODYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD02NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc1IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTExNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9NjMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTE5MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTk4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwIHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0zOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTk0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD03NCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xOTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTE5MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMjcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjMwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD02NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTYzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTM5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xOTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD00NiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9NzkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTc0IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNDUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTIyOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTExNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MTIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9NDQgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9NjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTQ2IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTg0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0xOTIgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTE5NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OCBzZWNvbmQ9MTczIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0xOTcgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05NyBzZWNvbmQ9MzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTEwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTEyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwIHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTg0IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTg3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xNzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTExNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTIzNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD00NCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MTkzIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD02NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwIHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTYzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTg1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTE5MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9OTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY4IHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTExMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xOTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MiBzZWNvbmQ9ODQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc1IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTcgc2Vjb25kPTM5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMjQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTIzMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD02MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OCBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03OSBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc5IHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9NjMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIxOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTM5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTY1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjQxIHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI0MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0zNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MiBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zMiBzZWNvbmQ9ODQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCBzZWNvbmQ9MTk4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9OTkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xNzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04MCBzZWNvbmQ9NjUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0zOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTA5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTE5NCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMzIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NDQgc2Vjb25kPTM5IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xNzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTcxIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD03NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9ODEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9OTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTExOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggc2Vjb25kPTQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTE3MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MTkzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTQ0IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0xMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTE5NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgyIHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xOTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9OTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTEwOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTk1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03OSBzZWNvbmQ9MTk4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xOTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MTk0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD03MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjQ4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD02NSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD04NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9OTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTIxMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xOTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9OTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9NDYgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTIyNSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTY1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTEwIHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY4IHNlY29uZD0xOTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjYgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTM0IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTgxIHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTIxNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTYzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD05NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc5IHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTQ2IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9NDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTIxOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMjggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSBzZWNvbmQ9NDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTE5NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjUzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4IHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD00NiBzZWNvbmQ9MzQgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTIxNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTk2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMDAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTY1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI0MSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9NDQgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0zOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTE0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD00MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD00NiBzZWNvbmQ9MzkgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTE3MyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9OTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MzQgYW1vdW50PS0xXHJcbmA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSA9IHt9ICl7XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIHBhbmVsICk7XHJcblxyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlT25SZWxlYXNlICk7XHJcblxyXG4gIGNvbnN0IHRlbXBNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xyXG5cclxuICBsZXQgb2xkUGFyZW50O1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XHJcblxyXG4gICAgY29uc3QgeyBpbnB1dE9iamVjdCwgaW5wdXQgfSA9IHA7XHJcblxyXG4gICAgY29uc3QgZm9sZGVyID0gZ3JvdXAuZm9sZGVyO1xyXG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggZm9sZGVyLmJlaW5nTW92ZWQgPT09IHRydWUgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRlbXBNYXRyaXguZ2V0SW52ZXJzZSggaW5wdXRPYmplY3QubWF0cml4V29ybGQgKTtcclxuXHJcbiAgICBmb2xkZXIubWF0cml4LnByZW11bHRpcGx5KCB0ZW1wTWF0cml4ICk7XHJcbiAgICBmb2xkZXIubWF0cml4LmRlY29tcG9zZSggZm9sZGVyLnBvc2l0aW9uLCBmb2xkZXIucXVhdGVybmlvbiwgZm9sZGVyLnNjYWxlICk7XHJcblxyXG4gICAgb2xkUGFyZW50ID0gZm9sZGVyLnBhcmVudDtcclxuICAgIGlucHV0T2JqZWN0LmFkZCggZm9sZGVyICk7XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG5cclxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gdHJ1ZTtcclxuXHJcbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ2dyYWJiZWQnLCBpbnB1dCApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25SZWxlYXNlKCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9PXt9ICl7XHJcbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBvbGRQYXJlbnQgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZm9sZGVyLm1hdHJpeC5wcmVtdWx0aXBseSggaW5wdXRPYmplY3QubWF0cml4V29ybGQgKTtcclxuICAgIGZvbGRlci5tYXRyaXguZGVjb21wb3NlKCBmb2xkZXIucG9zaXRpb24sIGZvbGRlci5xdWF0ZXJuaW9uLCBmb2xkZXIuc2NhbGUgKTtcclxuICAgIG9sZFBhcmVudC5hZGQoIGZvbGRlciApO1xyXG4gICAgb2xkUGFyZW50ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gZmFsc2U7XHJcblxyXG4gICAgaW5wdXQuZXZlbnRzLmVtaXQoICdncmFiUmVsZWFzZWQnLCBpbnB1dCApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGludGVyYWN0aW9uO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XHJcbmltcG9ydCBjcmVhdGVTbGlkZXIgZnJvbSAnLi9zbGlkZXInO1xyXG5pbXBvcnQgY3JlYXRlQ2hlY2tib3ggZnJvbSAnLi9jaGVja2JveCc7XHJcbmltcG9ydCBjcmVhdGVCdXR0b24gZnJvbSAnLi9idXR0b24nO1xyXG5pbXBvcnQgY3JlYXRlRm9sZGVyIGZyb20gJy4vZm9sZGVyJztcclxuaW1wb3J0IGNyZWF0ZURyb3Bkb3duIGZyb20gJy4vZHJvcGRvd24nO1xyXG5pbXBvcnQgKiBhcyBTREZUZXh0IGZyb20gJy4vc2RmdGV4dCc7XHJcbmltcG9ydCAqIGFzIEZvbnQgZnJvbSAnLi9mb250JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERBVEdVSVZSKCl7XHJcblxyXG4gIC8qXHJcbiAgICBTREYgZm9udFxyXG4gICovXHJcbiAgY29uc3QgdGV4dENyZWF0b3IgPSBTREZUZXh0LmNyZWF0b3IoKTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICBMaXN0cy5cclxuICAgIElucHV0T2JqZWN0cyBhcmUgdGhpbmdzIGxpa2UgVklWRSBjb250cm9sbGVycywgY2FyZGJvYXJkIGhlYWRzZXRzLCBldGMuXHJcbiAgICBDb250cm9sbGVycyBhcmUgdGhlIERBVCBHVUkgc2xpZGVycywgY2hlY2tib3hlcywgZXRjLlxyXG4gICAgSGl0c2Nhbk9iamVjdHMgYXJlIGFueXRoaW5nIHJheWNhc3RzIHdpbGwgaGl0LXRlc3QgYWdhaW5zdC5cclxuICAqL1xyXG4gIGNvbnN0IGlucHV0T2JqZWN0cyA9IFtdO1xyXG4gIGNvbnN0IGNvbnRyb2xsZXJzID0gW107XHJcbiAgY29uc3QgaGl0c2Nhbk9iamVjdHMgPSBbXTtcclxuXHJcbiAgbGV0IG1vdXNlRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICBmdW5jdGlvbiBzZXRNb3VzZUVuYWJsZWQoIGZsYWcgKXtcclxuICAgIG1vdXNlRW5hYmxlZCA9IGZsYWc7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgVGhlIGRlZmF1bHQgbGFzZXIgcG9pbnRlciBjb21pbmcgb3V0IG9mIGVhY2ggSW5wdXRPYmplY3QuXHJcbiAgKi9cclxuICBjb25zdCBsYXNlck1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtjb2xvcjoweDU1YWFmZiwgdHJhbnNwYXJlbnQ6IHRydWUsIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nIH0pO1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUxhc2VyKCl7XHJcbiAgICBjb25zdCBnID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcbiAgICBnLnZlcnRpY2VzLnB1c2goIG5ldyBUSFJFRS5WZWN0b3IzKCkgKTtcclxuICAgIGcudmVydGljZXMucHVzaCggbmV3IFRIUkVFLlZlY3RvcjMoMCwwLDApICk7XHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLkxpbmUoIGcsIGxhc2VyTWF0ZXJpYWwgKTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgQSBcImN1cnNvclwiLCBlZyB0aGUgYmFsbCB0aGF0IGFwcGVhcnMgYXQgdGhlIGVuZCBvZiB5b3VyIGxhc2VyLlxyXG4gICovXHJcbiAgY29uc3QgY3Vyc29yTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4NDQ0NDQ0LCB0cmFuc3BhcmVudDogdHJ1ZSwgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcgfSApO1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUN1cnNvcigpe1xyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMC4wMDYsIDQsIDQgKSwgY3Vyc29yTWF0ZXJpYWwgKTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBDcmVhdGVzIGEgZ2VuZXJpYyBJbnB1dCB0eXBlLlxyXG4gICAgVGFrZXMgYW55IFRIUkVFLk9iamVjdDNEIHR5cGUgb2JqZWN0IGFuZCB1c2VzIGl0cyBwb3NpdGlvblxyXG4gICAgYW5kIG9yaWVudGF0aW9uIGFzIGFuIGlucHV0IGRldmljZS5cclxuXHJcbiAgICBBIGxhc2VyIHBvaW50ZXIgaXMgaW5jbHVkZWQgYW5kIHdpbGwgYmUgdXBkYXRlZC5cclxuICAgIENvbnRhaW5zIHN0YXRlIGFib3V0IHdoaWNoIEludGVyYWN0aW9uIGlzIGN1cnJlbnRseSBiZWluZyB1c2VkIG9yIGhvdmVyLlxyXG4gICovXHJcbiAgZnVuY3Rpb24gY3JlYXRlSW5wdXQoIGlucHV0T2JqZWN0ID0gbmV3IFRIUkVFLkdyb3VwKCkgKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJheWNhc3Q6IG5ldyBUSFJFRS5SYXljYXN0ZXIoIG5ldyBUSFJFRS5WZWN0b3IzKCksIG5ldyBUSFJFRS5WZWN0b3IzKCkgKSxcclxuICAgICAgbGFzZXI6IGNyZWF0ZUxhc2VyKCksXHJcbiAgICAgIGN1cnNvcjogY3JlYXRlQ3Vyc29yKCksXHJcbiAgICAgIG9iamVjdDogaW5wdXRPYmplY3QsXHJcbiAgICAgIHByZXNzZWQ6IGZhbHNlLFxyXG4gICAgICBncmlwcGVkOiBmYWxzZSxcclxuICAgICAgZXZlbnRzOiBuZXcgRW1pdHRlcigpLFxyXG4gICAgICBpbnRlcmFjdGlvbjoge1xyXG4gICAgICAgIGdyaXA6IHVuZGVmaW5lZCxcclxuICAgICAgICBwcmVzczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGhvdmVyOiB1bmRlZmluZWRcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgTW91c2VJbnB1dCBpcyBhIHNwZWNpYWwgaW5wdXQgdHlwZSB0aGF0IGlzIG9uIGJ5IGRlZmF1bHQuXHJcbiAgICBBbGxvd3MgeW91IHRvIGNsaWNrIG9uIHRoZSBzY3JlZW4gd2hlbiBub3QgaW4gVlIgZm9yIGRlYnVnZ2luZy5cclxuICAqL1xyXG4gIGNvbnN0IG1vdXNlSW5wdXQgPSBjcmVhdGVNb3VzZUlucHV0KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZU1vdXNlSW5wdXQoKXtcclxuICAgIGNvbnN0IG1vdXNlID0gbmV3IFRIUkVFLlZlY3RvcjIoLTEsLTEpO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgZnVuY3Rpb24oIGV2ZW50ICl7XHJcbiAgICAgIG1vdXNlLnggPSAoIGV2ZW50LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCApICogMiAtIDE7XHJcbiAgICAgIG1vdXNlLnkgPSAtICggZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCApICogMiArIDE7XHJcbiAgICB9LCBmYWxzZSApO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgZnVuY3Rpb24oIGV2ZW50ICl7XHJcbiAgICAgIGlucHV0LnByZXNzZWQgPSB0cnVlO1xyXG4gICAgfSwgZmFsc2UgKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBmdW5jdGlvbiggZXZlbnQgKXtcclxuICAgICAgaW5wdXQucHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgfSwgZmFsc2UgKTtcclxuXHJcbiAgICBjb25zdCBpbnB1dCA9IGNyZWF0ZUlucHV0KCk7XHJcbiAgICBpbnB1dC5tb3VzZSA9IG1vdXNlO1xyXG4gICAgcmV0dXJuIGlucHV0O1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBQdWJsaWMgZnVuY3Rpb24gdXNlcnMgcnVuIHRvIGdpdmUgREFUIEdVSSBhbiBpbnB1dCBkZXZpY2UuXHJcbiAgICBBdXRvbWF0aWNhbGx5IGRldGVjdHMgZm9yIFZpdmVDb250cm9sbGVyIGFuZCBiaW5kcyBidXR0b25zICsgaGFwdGljIGZlZWRiYWNrLlxyXG5cclxuICAgIFJldHVybnMgYSBsYXNlciBwb2ludGVyIHNvIGl0IGNhbiBiZSBkaXJlY3RseSBhZGRlZCB0byBzY2VuZS5cclxuXHJcbiAgICBUaGUgbGFzZXIgd2lsbCB0aGVuIGhhdmUgdHdvIG1ldGhvZHM6XHJcbiAgICBsYXNlci5wcmVzc2VkKCksIGxhc2VyLmdyaXBwZWQoKVxyXG5cclxuICAgIFRoZXNlIGNhbiB0aGVuIGJlIGJvdW5kIHRvIGFueSBidXR0b24gdGhlIHVzZXIgd2FudHMuIFVzZWZ1bCBmb3IgYmluZGluZyB0b1xyXG4gICAgY2FyZGJvYXJkIG9yIGFsdGVybmF0ZSBpbnB1dCBkZXZpY2VzLlxyXG5cclxuICAgIEZvciBleGFtcGxlLi4uXHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBmdW5jdGlvbigpeyBsYXNlci5wcmVzc2VkKCB0cnVlICk7IH0gKTtcclxuICAqL1xyXG4gIGZ1bmN0aW9uIGFkZElucHV0T2JqZWN0KCBvYmplY3QgKXtcclxuICAgIGNvbnN0IGlucHV0ID0gY3JlYXRlSW5wdXQoIG9iamVjdCApO1xyXG5cclxuICAgIGlucHV0Lmxhc2VyLmFkZCggaW5wdXQuY3Vyc29yICk7XHJcblxyXG4gICAgaW5wdXQubGFzZXIucHJlc3NlZCA9IGZ1bmN0aW9uKCBmbGFnICl7XHJcbiAgICAgIGlucHV0LnByZXNzZWQgPSBmbGFnO1xyXG4gICAgfTtcclxuXHJcbiAgICBpbnB1dC5sYXNlci5ncmlwcGVkID0gZnVuY3Rpb24oIGZsYWcgKXtcclxuICAgICAgaW5wdXQuZ3JpcHBlZCA9IGZsYWc7XHJcbiAgICB9O1xyXG5cclxuICAgIGlucHV0Lmxhc2VyLmN1cnNvciA9IGlucHV0LmN1cnNvcjtcclxuXHJcbiAgICBpZiggVEhSRUUuVml2ZUNvbnRyb2xsZXIgJiYgb2JqZWN0IGluc3RhbmNlb2YgVEhSRUUuVml2ZUNvbnRyb2xsZXIgKXtcclxuICAgICAgYmluZFZpdmVDb250cm9sbGVyKCBpbnB1dCwgb2JqZWN0LCBpbnB1dC5sYXNlci5wcmVzc2VkLCBpbnB1dC5sYXNlci5ncmlwcGVkICk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5wdXRPYmplY3RzLnB1c2goIGlucHV0ICk7XHJcblxyXG4gICAgcmV0dXJuIGlucHV0Lmxhc2VyO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIEhlcmUgYXJlIHRoZSBtYWluIGRhdCBndWkgY29udHJvbGxlciB0eXBlcy5cclxuICAqL1xyXG5cclxuICBmdW5jdGlvbiBhZGRTbGlkZXIoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBtaW4gPSAwLjAsIG1heCA9IDEwMC4wICl7XHJcbiAgICBjb25zdCBzbGlkZXIgPSBjcmVhdGVTbGlkZXIoIHtcclxuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LCBtaW4sIG1heCxcclxuICAgICAgaW5pdGlhbFZhbHVlOiBvYmplY3RbIHByb3BlcnR5TmFtZSBdXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBzbGlkZXIgKTtcclxuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLnNsaWRlci5oaXRzY2FuIClcclxuXHJcbiAgICByZXR1cm4gc2xpZGVyO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkQ2hlY2tib3goIG9iamVjdCwgcHJvcGVydHlOYW1lICl7XHJcbiAgICBjb25zdCBjaGVja2JveCA9IGNyZWF0ZUNoZWNrYm94KHtcclxuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LFxyXG4gICAgICBpbml0aWFsVmFsdWU6IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGNoZWNrYm94ICk7XHJcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5jaGVja2JveC5oaXRzY2FuIClcclxuXHJcbiAgICByZXR1cm4gY2hlY2tib3g7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRCdXR0b24oIG9iamVjdCwgcHJvcGVydHlOYW1lICl7XHJcbiAgICBjb25zdCBidXR0b24gPSBjcmVhdGVCdXR0b24oe1xyXG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3RcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGJ1dHRvbiApO1xyXG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uYnV0dG9uLmhpdHNjYW4gKTtcclxuICAgIHJldHVybiBidXR0b247XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGREcm9wZG93biggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG9wdGlvbnMgKXtcclxuICAgIGNvbnN0IGRyb3Bkb3duID0gY3JlYXRlRHJvcGRvd24oe1xyXG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsIG9wdGlvbnNcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGRyb3Bkb3duICk7XHJcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5kcm9wZG93bi5oaXRzY2FuICk7XHJcbiAgICByZXR1cm4gZHJvcGRvd247XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIEFuIGltcGxpY2l0IEFkZCBmdW5jdGlvbiB3aGljaCBkZXRlY3RzIGZvciBwcm9wZXJ0eSB0eXBlXHJcbiAgICBhbmQgZ2l2ZXMgeW91IHRoZSBjb3JyZWN0IGNvbnRyb2xsZXIuXHJcblxyXG4gICAgRHJvcGRvd246XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG9iamVjdFR5cGUgKVxyXG5cclxuICAgIFNsaWRlcjpcclxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZOdW1iZXJUeXBlLCBtaW4sIG1heCApXHJcblxyXG4gICAgQ2hlY2tib3g6XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU9mQm9vbGVhblR5cGUgKVxyXG5cclxuICAgIEJ1dHRvbjpcclxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZGdW5jdGlvblR5cGUgKVxyXG4gICovXHJcblxyXG4gIGZ1bmN0aW9uIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMsIGFyZzQgKXtcclxuXHJcbiAgICBpZiggb2JqZWN0ID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgY29uc29sZS53YXJuKCAnb2JqZWN0IGlzIHVuZGVmaW5lZCcgKTtcclxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAgaWYoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICBjb25zb2xlLndhcm4oICdubyBwcm9wZXJ0eSBuYW1lZCcsIHByb3BlcnR5TmFtZSwgJ29uIG9iamVjdCcsIG9iamVjdCApO1xyXG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlzT2JqZWN0KCBhcmczICkgfHwgaXNBcnJheSggYXJnMyApICl7XHJcbiAgICAgIHJldHVybiBhZGREcm9wZG93biggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaXNOdW1iZXIoIG9iamVjdFsgcHJvcGVydHlOYW1lXSApICl7XHJcbiAgICAgIHJldHVybiBhZGRTbGlkZXIoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBhcmczLCBhcmc0ICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlzQm9vbGVhbiggb2JqZWN0WyBwcm9wZXJ0eU5hbWVdICkgKXtcclxuICAgICAgcmV0dXJuIGFkZENoZWNrYm94KCBvYmplY3QsIHByb3BlcnR5TmFtZSApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc0Z1bmN0aW9uKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICkgKXtcclxuICAgICAgcmV0dXJuIGFkZEJ1dHRvbiggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgYWRkIGNvdWxkbid0IGZpZ3VyZSBpdCBvdXQsIHNvIGF0IGxlYXN0IGFkZCBzb21ldGhpbmcgVEhSRUUgdW5kZXJzdGFuZHNcclxuICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBDcmVhdGVzIGEgZm9sZGVyIHdpdGggdGhlIG5hbWUuXHJcblxyXG4gICAgRm9sZGVycyBhcmUgVEhSRUUuR3JvdXAgdHlwZSBvYmplY3RzIGFuZCBjYW4gZG8gZ3JvdXAuYWRkKCkgZm9yIHNpYmxpbmdzLlxyXG4gICAgRm9sZGVycyB3aWxsIGF1dG9tYXRpY2FsbHkgYXR0ZW1wdCB0byBsYXkgaXRzIGNoaWxkcmVuIG91dCBpbiBzZXF1ZW5jZS5cclxuICAqL1xyXG5cclxuICBmdW5jdGlvbiBhZGRGb2xkZXIoIG5hbWUgKXtcclxuICAgIGNvbnN0IGZvbGRlciA9IGNyZWF0ZUZvbGRlcih7XHJcbiAgICAgIHRleHRDcmVhdG9yLFxyXG4gICAgICBuYW1lXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBmb2xkZXIgKTtcclxuICAgIGlmKCBmb2xkZXIuaGl0c2NhbiApe1xyXG4gICAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5mb2xkZXIuaGl0c2NhbiApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmb2xkZXI7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIFBlcmZvcm0gdGhlIG5lY2Vzc2FyeSB1cGRhdGVzLCByYXljYXN0cyBvbiBpdHMgb3duIFJBRi5cclxuICAqL1xyXG5cclxuICBjb25zdCB0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gIGNvbnN0IHREaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyggMCwgMCwgLTEgKTtcclxuICBjb25zdCB0TWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB1cGRhdGUgKTtcclxuXHJcbiAgICBpZiggbW91c2VFbmFibGVkICl7XHJcbiAgICAgIG1vdXNlSW5wdXQuaW50ZXJzZWN0aW9ucyA9IHBlcmZvcm1Nb3VzZUlucHV0KCBoaXRzY2FuT2JqZWN0cywgbW91c2VJbnB1dCApO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0T2JqZWN0cy5mb3JFYWNoKCBmdW5jdGlvbigge2JveCxvYmplY3QscmF5Y2FzdCxsYXNlcixjdXJzb3J9ID0ge30sIGluZGV4ICl7XHJcbiAgICAgIG9iamVjdC51cGRhdGVNYXRyaXhXb3JsZCgpO1xyXG5cclxuICAgICAgdFBvc2l0aW9uLnNldCgwLDAsMCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBvYmplY3QubWF0cml4V29ybGQgKTtcclxuICAgICAgdE1hdHJpeC5pZGVudGl0eSgpLmV4dHJhY3RSb3RhdGlvbiggb2JqZWN0Lm1hdHJpeFdvcmxkICk7XHJcbiAgICAgIHREaXJlY3Rpb24uc2V0KDAsMCwtMSkuYXBwbHlNYXRyaXg0KCB0TWF0cml4ICkubm9ybWFsaXplKCk7XHJcblxyXG4gICAgICByYXljYXN0LnNldCggdFBvc2l0aW9uLCB0RGlyZWN0aW9uICk7XHJcblxyXG4gICAgICBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc1sgMCBdLmNvcHkoIHRQb3NpdGlvbiApO1xyXG5cclxuICAgICAgLy8gIGRlYnVnLi4uXHJcbiAgICAgIC8vIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzWyAxIF0uY29weSggdFBvc2l0aW9uICkuYWRkKCB0RGlyZWN0aW9uLm11bHRpcGx5U2NhbGFyKCAxICkgKTtcclxuXHJcbiAgICAgIGNvbnN0IGludGVyc2VjdGlvbnMgPSByYXljYXN0LmludGVyc2VjdE9iamVjdHMoIGhpdHNjYW5PYmplY3RzLCBmYWxzZSApO1xyXG4gICAgICBwYXJzZUludGVyc2VjdGlvbnMoIGludGVyc2VjdGlvbnMsIGxhc2VyLCBjdXJzb3IgKTtcclxuXHJcbiAgICAgIGlucHV0T2JqZWN0c1sgaW5kZXggXS5pbnRlcnNlY3Rpb25zID0gaW50ZXJzZWN0aW9ucztcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGlucHV0cyA9IGlucHV0T2JqZWN0cy5zbGljZSgpO1xyXG5cclxuICAgIGlmKCBtb3VzZUVuYWJsZWQgKXtcclxuICAgICAgaW5wdXRzLnB1c2goIG1vdXNlSW5wdXQgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb250cm9sbGVycy5mb3JFYWNoKCBmdW5jdGlvbiggY29udHJvbGxlciApe1xyXG4gICAgICBjb250cm9sbGVyLnVwZGF0ZSggaW5wdXRzICk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApe1xyXG4gICAgaWYoIGludGVyc2VjdGlvbnMubGVuZ3RoID4gMCApe1xyXG4gICAgICBjb25zdCBmaXJzdEhpdCA9IGludGVyc2VjdGlvbnNbIDAgXTtcclxuICAgICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDEgXS5jb3B5KCBmaXJzdEhpdC5wb2ludCApO1xyXG4gICAgICBsYXNlci52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgbGFzZXIuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKCk7XHJcbiAgICAgIGxhc2VyLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gICAgICBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlO1xyXG4gICAgICBjdXJzb3IucG9zaXRpb24uY29weSggZmlyc3RIaXQucG9pbnQgKTtcclxuICAgICAgY3Vyc29yLnZpc2libGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbGFzZXIudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICBjdXJzb3IudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGVyZm9ybU1vdXNlSW5wdXQoIGhpdHNjYW5PYmplY3RzLCB7Ym94LG9iamVjdCxyYXljYXN0LGxhc2VyLGN1cnNvcixtb3VzZX0gPSB7fSApe1xyXG4gICAgcmF5Y2FzdC5zZXRGcm9tQ2FtZXJhKCBtb3VzZSwgY2FtZXJhICk7XHJcbiAgICBjb25zdCBpbnRlcnNlY3Rpb25zID0gcmF5Y2FzdC5pbnRlcnNlY3RPYmplY3RzKCBoaXRzY2FuT2JqZWN0cywgZmFsc2UgKTtcclxuICAgIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApO1xyXG4gICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBQdWJsaWMgbWV0aG9kcy5cclxuICAqL1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgYWRkSW5wdXRPYmplY3QsXHJcbiAgICBhZGQsXHJcbiAgICBhZGRGb2xkZXIsXHJcbiAgICBzZXRNb3VzZUVuYWJsZWRcclxuICB9O1xyXG5cclxufVxyXG5cclxuXHJcblxyXG4vKlxyXG4gIFNldCB0byBnbG9iYWwgc2NvcGUgaWYgZXhwb3J0aW5nIGFzIGEgc3RhbmRhbG9uZS5cclxuKi9cclxuXHJcbmlmKCB3aW5kb3cgKXtcclxuICB3aW5kb3cuREFUR1VJVlIgPSBEQVRHVUlWUjtcclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICBCdW5jaCBvZiBzdGF0ZS1sZXNzIHV0aWxpdHkgZnVuY3Rpb25zLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gaXNOdW1iZXIobikge1xyXG4gIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQm9vbGVhbihuKXtcclxuICByZXR1cm4gdHlwZW9mIG4gPT09ICdib29sZWFuJztcclxufVxyXG5cclxuZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jdGlvblRvQ2hlY2spIHtcclxuICBjb25zdCBnZXRUeXBlID0ge307XHJcbiAgcmV0dXJuIGZ1bmN0aW9uVG9DaGVjayAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwoZnVuY3Rpb25Ub0NoZWNrKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcclxufVxyXG5cclxuLy8gIG9ubHkge30gb2JqZWN0cyBub3QgYXJyYXlzXHJcbi8vICAgICAgICAgICAgICAgICAgICB3aGljaCBhcmUgdGVjaG5pY2FsbHkgb2JqZWN0cyBidXQgeW91J3JlIGp1c3QgYmVpbmcgcGVkYW50aWNcclxuZnVuY3Rpb24gaXNPYmplY3QgKGl0ZW0pIHtcclxuICByZXR1cm4gKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtICE9PSBudWxsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNBcnJheSggbyApe1xyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KCBvICk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAgQ29udHJvbGxlci1zcGVjaWZpYyBzdXBwb3J0LlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gYmluZFZpdmVDb250cm9sbGVyKCBpbnB1dCwgY29udHJvbGxlciwgcHJlc3NlZCwgZ3JpcHBlZCApe1xyXG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyaWdnZXJkb3duJywgKCk9PnByZXNzZWQoIHRydWUgKSApO1xyXG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyaWdnZXJ1cCcsICgpPT5wcmVzc2VkKCBmYWxzZSApICk7XHJcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAnZ3JpcHNkb3duJywgKCk9PmdyaXBwZWQoIHRydWUgKSApO1xyXG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ2dyaXBzdXAnLCAoKT0+Z3JpcHBlZCggZmFsc2UgKSApO1xyXG5cclxuICBjb25zdCBnYW1lcGFkID0gY29udHJvbGxlci5nZXRHYW1lcGFkKCk7XHJcbiAgZnVuY3Rpb24gdmlicmF0ZSggdCwgYSApe1xyXG4gICAgaWYoIGdhbWVwYWQgJiYgZ2FtZXBhZC5oYXB0aWNzLmxlbmd0aCA+IDAgKXtcclxuICAgICAgZ2FtZXBhZC5oYXB0aWNzWyAwIF0udmlicmF0ZSggdCwgYSApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFwdGljc1RhcCgpe1xyXG4gICAgc2V0SW50ZXJ2YWxUaW1lcyggKHgsdCxhKT0+dmlicmF0ZSgxLWEsIDAuNSksIDEwLCAyMCApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFwdGljc0VjaG8oKXtcclxuICAgIHNldEludGVydmFsVGltZXMoICh4LHQsYSk9PnZpYnJhdGUoNCwgMS4wICogKDEtYSkpLCAxMDAsIDQgKTtcclxuICB9XHJcblxyXG4gIGlucHV0LmV2ZW50cy5vbiggJ29uQ29udHJvbGxlckhlbGQnLCBmdW5jdGlvbiggaW5wdXQgKXtcclxuICAgIHZpYnJhdGUoIDAuMywgMC4zICk7XHJcbiAgfSk7XHJcblxyXG4gIGlucHV0LmV2ZW50cy5vbiggJ2dyYWJiZWQnLCBmdW5jdGlvbigpe1xyXG4gICAgaGFwdGljc1RhcCgpO1xyXG4gIH0pO1xyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdncmFiUmVsZWFzZWQnLCBmdW5jdGlvbigpe1xyXG4gICAgaGFwdGljc0VjaG8oKTtcclxuICB9KTtcclxuXHJcbiAgaW5wdXQuZXZlbnRzLm9uKCAncGlubmVkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NUYXAoKTtcclxuICB9KTtcclxuXHJcbiAgaW5wdXQuZXZlbnRzLm9uKCAncGluUmVsZWFzZWQnLCBmdW5jdGlvbigpe1xyXG4gICAgaGFwdGljc0VjaG8oKTtcclxuICB9KTtcclxuXHJcblxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gc2V0SW50ZXJ2YWxUaW1lcyggY2IsIGRlbGF5LCB0aW1lcyApe1xyXG4gIGxldCB4ID0gMDtcclxuICBsZXQgaWQgPSBzZXRJbnRlcnZhbCggZnVuY3Rpb24oKXtcclxuICAgIGNiKCB4LCB0aW1lcywgeC90aW1lcyApO1xyXG4gICAgeCsrO1xyXG4gICAgaWYoIHg+PXRpbWVzICl7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwoIGlkICk7XHJcbiAgICB9XHJcbiAgfSwgZGVsYXkgKTtcclxuICByZXR1cm4gaWQ7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5pbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdFZvbHVtZSApe1xyXG4gIGNvbnN0IGV2ZW50cyA9IG5ldyBFbWl0dGVyKCk7XHJcblxyXG4gIGxldCBhbnlIb3ZlciA9IGZhbHNlO1xyXG4gIGxldCBhbnlQcmVzc2luZyA9IGZhbHNlO1xyXG5cclxuICBsZXQgaG92ZXIgPSBmYWxzZTtcclxuICBsZXQgYW55QWN0aXZlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IHRWZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gIGNvbnN0IGF2YWlsYWJsZUlucHV0cyA9IFtdO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGUoIGlucHV0T2JqZWN0cyApe1xyXG5cclxuICAgIGhvdmVyID0gZmFsc2U7XHJcbiAgICBhbnlQcmVzc2luZyA9IGZhbHNlO1xyXG4gICAgYW55QWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCBpbnB1dCApe1xyXG5cclxuICAgICAgaWYoIGF2YWlsYWJsZUlucHV0cy5pbmRleE9mKCBpbnB1dCApIDwgMCApe1xyXG4gICAgICAgIGF2YWlsYWJsZUlucHV0cy5wdXNoKCBpbnB1dCApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB7IGhpdE9iamVjdCwgaGl0UG9pbnQgfSA9IGV4dHJhY3RIaXQoIGlucHV0ICk7XHJcblxyXG4gICAgICBob3ZlciA9IGhvdmVyIHx8IGhpdFZvbHVtZSA9PT0gaGl0T2JqZWN0O1xyXG5cclxuICAgICAgcGVyZm9ybVN0YXRlRXZlbnRzKHtcclxuICAgICAgICBpbnB1dCxcclxuICAgICAgICBob3ZlcixcclxuICAgICAgICBoaXRPYmplY3QsIGhpdFBvaW50LFxyXG4gICAgICAgIGJ1dHRvbk5hbWU6ICdwcmVzc2VkJyxcclxuICAgICAgICBpbnRlcmFjdGlvbk5hbWU6ICdwcmVzcycsXHJcbiAgICAgICAgZG93bk5hbWU6ICdvblByZXNzZWQnLFxyXG4gICAgICAgIGhvbGROYW1lOiAncHJlc3NpbmcnLFxyXG4gICAgICAgIHVwTmFtZTogJ29uUmVsZWFzZWQnXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcGVyZm9ybVN0YXRlRXZlbnRzKHtcclxuICAgICAgICBpbnB1dCxcclxuICAgICAgICBob3ZlcixcclxuICAgICAgICBoaXRPYmplY3QsIGhpdFBvaW50LFxyXG4gICAgICAgIGJ1dHRvbk5hbWU6ICdncmlwcGVkJyxcclxuICAgICAgICBpbnRlcmFjdGlvbk5hbWU6ICdncmlwJyxcclxuICAgICAgICBkb3duTmFtZTogJ29uR3JpcHBlZCcsXHJcbiAgICAgICAgaG9sZE5hbWU6ICdncmlwcGluZycsXHJcbiAgICAgICAgdXBOYW1lOiAnb25SZWxlYXNlR3JpcCdcclxuICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZXh0cmFjdEhpdCggaW5wdXQgKXtcclxuICAgIGlmKCBpbnB1dC5pbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwICl7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaGl0UG9pbnQ6IHRWZWN0b3Iuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBpbnB1dC5jdXJzb3IubWF0cml4V29ybGQgKS5jbG9uZSgpLFxyXG4gICAgICAgIGhpdE9iamVjdDogaW5wdXQuY3Vyc29yLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBoaXRQb2ludDogaW5wdXQuaW50ZXJzZWN0aW9uc1sgMCBdLnBvaW50LFxyXG4gICAgICAgIGhpdE9iamVjdDogaW5wdXQuaW50ZXJzZWN0aW9uc1sgMCBdLm9iamVjdFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGVyZm9ybVN0YXRlRXZlbnRzKHtcclxuICAgIGlucHV0LCBob3ZlcixcclxuICAgIGhpdE9iamVjdCwgaGl0UG9pbnQsXHJcbiAgICBidXR0b25OYW1lLCBpbnRlcmFjdGlvbk5hbWUsIGRvd25OYW1lLCBob2xkTmFtZSwgdXBOYW1lXHJcbiAgfSA9IHt9ICl7XHJcblxyXG5cclxuICAgIC8vICBob3ZlcmluZyBhbmQgYnV0dG9uIGRvd24gYnV0IG5vIGludGVyYWN0aW9ucyBhY3RpdmUgeWV0XHJcbiAgICBpZiggaG92ZXIgJiYgaW5wdXRbIGJ1dHRvbk5hbWUgXSA9PT0gdHJ1ZSAmJiBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPT09IHVuZGVmaW5lZCApe1xyXG5cclxuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcclxuICAgICAgICBpbnB1dCxcclxuICAgICAgICBoaXRPYmplY3QsXHJcbiAgICAgICAgcG9pbnQ6IGhpdFBvaW50LFxyXG4gICAgICAgIGlucHV0T2JqZWN0OiBpbnB1dC5vYmplY3QsXHJcbiAgICAgICAgbG9ja2VkOiBmYWxzZVxyXG4gICAgICB9O1xyXG4gICAgICBldmVudHMuZW1pdCggZG93bk5hbWUsIHBheWxvYWQgKTtcclxuXHJcbiAgICAgIGlmKCBwYXlsb2FkLmxvY2tlZCApe1xyXG4gICAgICAgIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9IGludGVyYWN0aW9uO1xyXG4gICAgICAgIGlucHV0LmludGVyYWN0aW9uLmhvdmVyID0gaW50ZXJhY3Rpb247XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGFueVByZXNzaW5nID0gdHJ1ZTtcclxuICAgICAgYW55QWN0aXZlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgYnV0dG9uIHN0aWxsIGRvd24gYW5kIHRoaXMgaXMgdGhlIGFjdGl2ZSBpbnRlcmFjdGlvblxyXG4gICAgaWYoIGlucHV0WyBidXR0b25OYW1lIF0gJiYgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID09PSBpbnRlcmFjdGlvbiApe1xyXG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdCxcclxuICAgICAgICBsb2NrZWQ6IGZhbHNlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBldmVudHMuZW1pdCggaG9sZE5hbWUsIHBheWxvYWQgKTtcclxuXHJcbiAgICAgIGFueVByZXNzaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgIGlucHV0LmV2ZW50cy5lbWl0KCAnb25Db250cm9sbGVySGVsZCcgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgYnV0dG9uIG5vdCBkb3duIGFuZCB0aGlzIGlzIHRoZSBhY3RpdmUgaW50ZXJhY3Rpb25cclxuICAgIGlmKCBpbnB1dFsgYnV0dG9uTmFtZSBdID09PSBmYWxzZSAmJiBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPT09IGludGVyYWN0aW9uICl7XHJcbiAgICAgIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9IHVuZGVmaW5lZDtcclxuICAgICAgaW5wdXQuaW50ZXJhY3Rpb24uaG92ZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgIGV2ZW50cy5lbWl0KCB1cE5hbWUsIHtcclxuICAgICAgICBpbnB1dCxcclxuICAgICAgICBoaXRPYmplY3QsXHJcbiAgICAgICAgcG9pbnQ6IGhpdFBvaW50LFxyXG4gICAgICAgIGlucHV0T2JqZWN0OiBpbnB1dC5vYmplY3RcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNNYWluSG92ZXIoKXtcclxuXHJcbiAgICBsZXQgbm9NYWluSG92ZXIgPSB0cnVlO1xyXG4gICAgZm9yKCBsZXQgaT0wOyBpPGF2YWlsYWJsZUlucHV0cy5sZW5ndGg7IGkrKyApe1xyXG4gICAgICBpZiggYXZhaWxhYmxlSW5wdXRzWyBpIF0uaW50ZXJhY3Rpb24uaG92ZXIgIT09IHVuZGVmaW5lZCApe1xyXG4gICAgICAgIG5vTWFpbkhvdmVyID0gZmFsc2U7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiggbm9NYWluSG92ZXIgKXtcclxuICAgICAgcmV0dXJuIGhvdmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBhdmFpbGFibGVJbnB1dHMuZmlsdGVyKCBmdW5jdGlvbiggaW5wdXQgKXtcclxuICAgICAgcmV0dXJuIGlucHV0LmludGVyYWN0aW9uLmhvdmVyID09PSBpbnRlcmFjdGlvbjtcclxuICAgIH0pLmxlbmd0aCA+IDAgKXtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0ge1xyXG4gICAgaG92ZXJpbmc6IGlzTWFpbkhvdmVyLFxyXG4gICAgcHJlc3Npbmc6ICgpPT5hbnlQcmVzc2luZyxcclxuICAgIHVwZGF0ZSxcclxuICAgIGV2ZW50c1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBpbnRlcmFjdGlvbjtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFsaWduTGVmdCggb2JqICl7XHJcbiAgaWYoIG9iaiBpbnN0YW5jZW9mIFRIUkVFLk1lc2ggKXtcclxuICAgIG9iai5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgIGNvbnN0IHdpZHRoID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC54IC0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC55O1xyXG4gICAgb2JqLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGgsIDAsIDAgKTtcclxuICAgIHJldHVybiBvYmo7XHJcbiAgfVxyXG4gIGVsc2UgaWYoIG9iaiBpbnN0YW5jZW9mIFRIUkVFLkdlb21ldHJ5ICl7XHJcbiAgICBvYmouY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICBjb25zdCB3aWR0aCA9IG9iai5ib3VuZGluZ0JveC5tYXgueCAtIG9iai5ib3VuZGluZ0JveC5tYXgueTtcclxuICAgIG9iai50cmFuc2xhdGUoIHdpZHRoLCAwLCAwICk7XHJcbiAgICByZXR1cm4gb2JqO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApe1xyXG4gIGNvbnN0IHBhbmVsID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggd2lkdGgsIGhlaWdodCwgZGVwdGggKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCAqIDAuNSwgMCwgMCApO1xyXG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBwYW5lbC5nZW9tZXRyeSwgQ29sb3JzLkRFRkFVTFRfQkFDSyApO1xyXG4gIHJldHVybiBwYW5lbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBjb2xvciApe1xyXG4gIGNvbnN0IHBhbmVsID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQ09OVFJPTExFUl9JRF9XSURUSCwgaGVpZ2h0LCBDT05UUk9MTEVSX0lEX0RFUFRIICksIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xyXG4gIHBhbmVsLmdlb21ldHJ5LnRyYW5zbGF0ZSggQ09OVFJPTExFUl9JRF9XSURUSCAqIDAuNSwgMCwgMCApO1xyXG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBwYW5lbC5nZW9tZXRyeSwgY29sb3IgKTtcclxuICByZXR1cm4gcGFuZWw7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBQQU5FTF9XSURUSCA9IDEuMDtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX0hFSUdIVCA9IDAuMDg7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9ERVBUSCA9IDAuMDAxO1xyXG5leHBvcnQgY29uc3QgUEFORUxfU1BBQ0lORyA9IDAuMDAyO1xyXG5leHBvcnQgY29uc3QgUEFORUxfTUFSR0lOID0gMC4wMTU7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9MQUJFTF9URVhUX01BUkdJTiA9IDAuMDY7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9WQUxVRV9URVhUX01BUkdJTiA9IDAuMDI7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1dJRFRIID0gMC4wMjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfREVQVEggPSAwLjAwMTtcclxuZXhwb3J0IGNvbnN0IEJVVFRPTl9ERVBUSCA9IDAuMDE7IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gPSB7fSApe1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xyXG5cclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvbkdyaXBwZWQnLCBoYW5kbGVPbkdyaXAgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VHcmlwJywgaGFuZGxlT25HcmlwUmVsZWFzZSApO1xyXG5cclxuICBsZXQgb2xkUGFyZW50O1xyXG4gIGxldCBvbGRQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgbGV0IG9sZFJvdGF0aW9uID0gbmV3IFRIUkVFLkV1bGVyKCk7XHJcblxyXG4gIGNvbnN0IHJvdGF0aW9uR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICByb3RhdGlvbkdyb3VwLnNjYWxlLnNldCggMC4zLCAwLjMsIDAuMyApO1xyXG4gIHJvdGF0aW9uR3JvdXAucG9zaXRpb24uc2V0KCAtMC4wMTUsIDAuMDE1LCAwLjAgKTtcclxuXHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uR3JpcCggcCApe1xyXG5cclxuICAgIGNvbnN0IHsgaW5wdXRPYmplY3QsIGlucHV0IH0gPSBwO1xyXG5cclxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSB0cnVlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBvbGRQb3NpdGlvbi5jb3B5KCBmb2xkZXIucG9zaXRpb24gKTtcclxuICAgIG9sZFJvdGF0aW9uLmNvcHkoIGZvbGRlci5yb3RhdGlvbiApO1xyXG5cclxuICAgIGZvbGRlci5wb3NpdGlvbi5zZXQoIDAsMCwwICk7XHJcbiAgICBmb2xkZXIucm90YXRpb24uc2V0KCAwLDAsMCApO1xyXG4gICAgZm9sZGVyLnJvdGF0aW9uLnggPSAtTWF0aC5QSSAqIDAuNTtcclxuXHJcbiAgICBvbGRQYXJlbnQgPSBmb2xkZXIucGFyZW50O1xyXG5cclxuICAgIHJvdGF0aW9uR3JvdXAuYWRkKCBmb2xkZXIgKTtcclxuXHJcbiAgICBpbnB1dE9iamVjdC5hZGQoIHJvdGF0aW9uR3JvdXAgKTtcclxuXHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcblxyXG4gICAgZm9sZGVyLmJlaW5nTW92ZWQgPSB0cnVlO1xyXG5cclxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAncGlubmVkJywgaW5wdXQgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uR3JpcFJlbGVhc2UoIHsgaW5wdXRPYmplY3QsIGlucHV0IH09e30gKXtcclxuXHJcbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBvbGRQYXJlbnQgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2xkUGFyZW50LmFkZCggZm9sZGVyICk7XHJcbiAgICBvbGRQYXJlbnQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgZm9sZGVyLnBvc2l0aW9uLmNvcHkoIG9sZFBvc2l0aW9uICk7XHJcbiAgICBmb2xkZXIucm90YXRpb24uY29weSggb2xkUm90YXRpb24gKTtcclxuXHJcbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IGZhbHNlO1xyXG5cclxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAncGluUmVsZWFzZWQnLCBpbnB1dCApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGludGVyYWN0aW9uO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBTREZTaGFkZXIgZnJvbSAndGhyZWUtYm1mb250LXRleHQvc2hhZGVycy9zZGYnO1xyXG5pbXBvcnQgY3JlYXRlR2VvbWV0cnkgZnJvbSAndGhyZWUtYm1mb250LXRleHQnO1xyXG5pbXBvcnQgcGFyc2VBU0NJSSBmcm9tICdwYXJzZS1ibWZvbnQtYXNjaWknO1xyXG5cclxuaW1wb3J0ICogYXMgRm9udCBmcm9tICcuL2ZvbnQnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hdGVyaWFsKCBjb2xvciApe1xyXG5cclxuICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcclxuICBjb25zdCBpbWFnZSA9IEZvbnQuaW1hZ2UoKTtcclxuICB0ZXh0dXJlLmltYWdlID0gaW1hZ2U7XHJcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJNaXBNYXBMaW5lYXJGaWx0ZXI7XHJcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XHJcbiAgdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSB0cnVlO1xyXG5cclxuICAvLyAgYW5kIHdoYXQgYWJvdXQgYW5pc290cm9waWMgZmlsdGVyaW5nP1xyXG5cclxuICByZXR1cm4gbmV3IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsKFNERlNoYWRlcih7XHJcbiAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBjb2xvcjogY29sb3IsXHJcbiAgICBtYXA6IHRleHR1cmVcclxuICB9KSk7XHJcbn1cclxuXHJcbmNvbnN0IHRleHRTY2FsZSA9IDAuMDAxMjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdG9yKCl7XHJcblxyXG4gIGNvbnN0IGZvbnQgPSBwYXJzZUFTQ0lJKCBGb250LmZudCgpICk7XHJcblxyXG4gIGNvbnN0IGNvbG9yTWF0ZXJpYWxzID0ge307XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZVRleHQoIHN0ciwgZm9udCwgY29sb3IgPSAweGZmZmZmZiwgc2NhbGUgPSAxLjAgKXtcclxuXHJcbiAgICBjb25zdCBnZW9tZXRyeSA9IGNyZWF0ZUdlb21ldHJ5KHtcclxuICAgICAgdGV4dDogc3RyLFxyXG4gICAgICBhbGlnbjogJ2xlZnQnLFxyXG4gICAgICB3aWR0aDogMTAwMCxcclxuICAgICAgZmxpcFk6IHRydWUsXHJcbiAgICAgIGZvbnRcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBjb25zdCBsYXlvdXQgPSBnZW9tZXRyeS5sYXlvdXQ7XHJcblxyXG4gICAgbGV0IG1hdGVyaWFsID0gY29sb3JNYXRlcmlhbHNbIGNvbG9yIF07XHJcbiAgICBpZiggbWF0ZXJpYWwgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICBtYXRlcmlhbCA9IGNvbG9yTWF0ZXJpYWxzWyBjb2xvciBdID0gY3JlYXRlTWF0ZXJpYWwoIGNvbG9yICk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xyXG4gICAgbWVzaC5zY2FsZS5tdWx0aXBseSggbmV3IFRIUkVFLlZlY3RvcjMoMSwtMSwxKSApO1xyXG5cclxuICAgIGNvbnN0IGZpbmFsU2NhbGUgPSBzY2FsZSAqIHRleHRTY2FsZTtcclxuXHJcbiAgICBtZXNoLnNjYWxlLm11bHRpcGx5U2NhbGFyKCBmaW5hbFNjYWxlICk7XHJcblxyXG4gICAgbWVzaC5wb3NpdGlvbi55ID0gbGF5b3V0LmhlaWdodCAqIDAuNSAqIGZpbmFsU2NhbGU7XHJcblxyXG4gICAgcmV0dXJuIG1lc2g7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlKCBzdHIsIHsgY29sb3I9MHhmZmZmZmYsIHNjYWxlPTEuMCB9ID0ge30gKXtcclxuICAgIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gICAgbGV0IG1lc2ggPSBjcmVhdGVUZXh0KCBzdHIsIGZvbnQsIGNvbG9yLCBzY2FsZSApO1xyXG4gICAgZ3JvdXAuYWRkKCBtZXNoICk7XHJcbiAgICBncm91cC5sYXlvdXQgPSBtZXNoLmdlb21ldHJ5LmxheW91dDtcclxuXHJcbiAgICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICAgIG1lc2guZ2VvbWV0cnkudXBkYXRlKCBzdHIgKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGNyZWF0ZSxcclxuICAgIGdldE1hdGVyaWFsOiAoKT0+IG1hdGVyaWFsXHJcbiAgfVxyXG5cclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBBTkVMID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweGZmZmZmZiwgdmVydGV4Q29sb3JzOiBUSFJFRS5WZXJ0ZXhDb2xvcnMgfSApO1xyXG5leHBvcnQgY29uc3QgTE9DQVRPUiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG5leHBvcnQgY29uc3QgRk9MREVSID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweDAwMDAwMCB9ICk7IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuaW1wb3J0ICogYXMgUGFsZXR0ZSBmcm9tICcuL3BhbGV0dGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlU2xpZGVyKCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IDAuMCxcclxuICBtaW4gPSAwLjAsIG1heCA9IDEuMCxcclxuICBzdGVwID0gMC4xLFxyXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxyXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXHJcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEhcclxufSA9IHt9ICl7XHJcblxyXG5cclxuICBjb25zdCBTTElERVJfV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgU0xJREVSX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgU0xJREVSX0RFUFRIID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgYWxwaGE6IDEuMCxcclxuICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXHJcbiAgICBzdGVwOiBzdGVwLFxyXG4gICAgdXNlU3RlcDogZmFsc2UsXHJcbiAgICBwcmVjaXNpb246IDEsXHJcbiAgICBsaXN0ZW46IGZhbHNlLFxyXG4gICAgbWluOiBtaW4sXHJcbiAgICBtYXg6IG1heCxcclxuICAgIG9uQ2hhbmdlZENCOiB1bmRlZmluZWQsXHJcbiAgICBvbkZpbmlzaGVkQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgICBwcmVzc2luZzogZmFsc2VcclxuICB9O1xyXG5cclxuICBzdGF0ZS5zdGVwID0gZ2V0SW1wbGllZFN0ZXAoIHN0YXRlLnZhbHVlICk7XHJcbiAgc3RhdGUucHJlY2lzaW9uID0gbnVtRGVjaW1hbHMoIHN0YXRlLnN0ZXAgKTtcclxuICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgLy8gIGZpbGxlZCB2b2x1bWVcclxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBTTElERVJfV0lEVEgsIFNMSURFUl9IRUlHSFQsIFNMSURFUl9ERVBUSCApO1xyXG4gIHJlY3QudHJhbnNsYXRlKFNMSURFUl9XSURUSCowLjUsMCwwKTtcclxuICAvLyBMYXlvdXQuYWxpZ25MZWZ0KCByZWN0ICk7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcclxuXHJcbiAgLy8gIHNsaWRlckJHIHZvbHVtZVxyXG4gIGNvbnN0IHNsaWRlckJHID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHNsaWRlckJHLmdlb21ldHJ5LCBDb2xvcnMuU0xJREVSX0JHICk7XHJcbiAgc2xpZGVyQkcucG9zaXRpb24ueiA9IGRlcHRoICogMC41O1xyXG4gIHNsaWRlckJHLnBvc2l0aW9uLnggPSBTTElERVJfV0lEVEggKyBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiBDb2xvcnMuREVGQVVMVF9DT0xPUiwgZW1pc3NpdmU6IENvbG9ycy5FTUlTU0lWRV9DT0xPUiB9KTtcclxuICBjb25zdCBmaWxsZWRWb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBtYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBmaWxsZWRWb2x1bWUgKTtcclxuXHJcbiAgY29uc3QgZW5kTG9jYXRvciA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIDAuMDUsIDAuMDUsIDAuMDUsIDEsIDEsIDEgKSwgU2hhcmVkTWF0ZXJpYWxzLkxPQ0FUT1IgKTtcclxuICBlbmRMb2NhdG9yLnBvc2l0aW9uLnggPSBTTElERVJfV0lEVEg7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGVuZExvY2F0b3IgKTtcclxuICBlbmRMb2NhdG9yLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgdmFsdWVMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggc3RhdGUudmFsdWUudG9TdHJpbmcoKSApO1xyXG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9WQUxVRV9URVhUX01BUkdJTiArIHdpZHRoICogMC41O1xyXG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoKjI7XHJcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX1NMSURFUiApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBzbGlkZXJCRywgdmFsdWVMYWJlbCwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIGdyb3VwLmFkZCggcGFuZWwgKVxyXG5cclxuICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmFsdWVMYWJlbCggdmFsdWUgKXtcclxuICAgIGlmKCBzdGF0ZS51c2VTdGVwICl7XHJcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlKCByb3VuZFRvRGVjaW1hbCggc3RhdGUudmFsdWUsIHN0YXRlLnByZWNpc2lvbiApLnRvU3RyaW5nKCkgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlKCBzdGF0ZS52YWx1ZS50b1N0cmluZygpICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcbiAgICBpZiggc3RhdGUucHJlc3NpbmcgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSU5URVJBQ1RJT05fQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfQ09MT1IgKTtcclxuICAgICAgbWF0ZXJpYWwuZW1pc3NpdmUuc2V0SGV4KCBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVNsaWRlciggYWxwaGEgKXtcclxuICAgIGFscGhhID0gZ2V0Q2xhbXBlZEFscGhhKCBhbHBoYSApO1xyXG4gICAgZmlsbGVkVm9sdW1lLnNjYWxlLnggPSBNYXRoLm1heCggYWxwaGEgKiB3aWR0aCwgMC4wMDAwMDEgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZU9iamVjdCggdmFsdWUgKXtcclxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBhbHBoYSApe1xyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRDbGFtcGVkQWxwaGEoIGFscGhhICk7XHJcbiAgICBzdGF0ZS52YWx1ZSA9IGdldFZhbHVlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuICAgIGlmKCBzdGF0ZS51c2VTdGVwICl7XHJcbiAgICAgIHN0YXRlLnZhbHVlID0gZ2V0U3RlcHBlZFZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUuc3RlcCApO1xyXG4gICAgfVxyXG4gICAgc3RhdGUudmFsdWUgPSBnZXRDbGFtcGVkVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbGlzdGVuVXBkYXRlKCl7XHJcbiAgICBzdGF0ZS52YWx1ZSA9IGdldFZhbHVlRnJvbU9iamVjdCgpO1xyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldENsYW1wZWRBbHBoYSggc3RhdGUuYWxwaGEgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFZhbHVlRnJvbU9iamVjdCgpe1xyXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKTtcclxuICB9XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBzdGF0ZS5vbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnN0ZXAgPSBmdW5jdGlvbiggc3RlcCApe1xyXG4gICAgc3RhdGUuc3RlcCA9IHN0ZXA7XHJcbiAgICBzdGF0ZS5wcmVjaXNpb24gPSBudW1EZWNpbWFscyggc3RhdGUuc3RlcCApXHJcbiAgICBzdGF0ZS51c2VTdGVwID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlUHJlc3MgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdwcmVzc2luZycsIGhhbmRsZUhvbGQgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlUmVsZWFzZSApO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVQcmVzcyggcCApe1xyXG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhvbGQoIHsgcG9pbnQgfSA9IHt9ICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBmaWxsZWRWb2x1bWUudXBkYXRlTWF0cml4V29ybGQoKTtcclxuICAgIGVuZExvY2F0b3IudXBkYXRlTWF0cml4V29ybGQoKTtcclxuXHJcbiAgICBjb25zdCBhID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGZpbGxlZFZvbHVtZS5tYXRyaXhXb3JsZCApO1xyXG4gICAgY29uc3QgYiA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBlbmRMb2NhdG9yLm1hdHJpeFdvcmxkICk7XHJcblxyXG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHN0YXRlLnZhbHVlO1xyXG5cclxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBnZXRQb2ludEFscGhhKCBwb2ludCwge2EsYn0gKSApO1xyXG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICAgIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuICAgIHVwZGF0ZU9iamVjdCggc3RhdGUudmFsdWUgKTtcclxuXHJcbiAgICBpZiggcHJldmlvdXNWYWx1ZSAhPT0gc3RhdGUudmFsdWUgJiYgc3RhdGUub25DaGFuZ2VkQ0IgKXtcclxuICAgICAgc3RhdGUub25DaGFuZ2VkQ0IoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSZWxlYXNlKCl7XHJcbiAgICBzdGF0ZS5wcmVzc2luZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG4gIGNvbnN0IHBhbGV0dGVJbnRlcmFjdGlvbiA9IFBhbGV0dGUuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHBhbGV0dGVJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG5cclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgbGlzdGVuVXBkYXRlKCk7XHJcbiAgICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XHJcbiAgICAgIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQb2ludEFscGhhKCBwb2ludCwgc2VnbWVudCApe1xyXG4gIGNvbnN0IGEgPSBuZXcgVEhSRUUuVmVjdG9yMygpLmNvcHkoIHNlZ21lbnQuYiApLnN1Yiggc2VnbWVudC5hICk7XHJcbiAgY29uc3QgYiA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuY29weSggcG9pbnQgKS5zdWIoIHNlZ21lbnQuYSApO1xyXG4gIGNvbnN0IHByb2plY3RlZCA9IGIucHJvamVjdE9uVmVjdG9yKCBhICk7XHJcblxyXG4gIGNvbnN0IGxlbmd0aCA9IHNlZ21lbnQuYS5kaXN0YW5jZVRvKCBzZWdtZW50LmIgKTtcclxuXHJcbiAgbGV0IGFscGhhID0gcHJvamVjdGVkLmxlbmd0aCgpIC8gbGVuZ3RoO1xyXG4gIGlmKCBhbHBoYSA+IDEuMCApe1xyXG4gICAgYWxwaGEgPSAxLjA7XHJcbiAgfVxyXG4gIGlmKCBhbHBoYSA8IDAuMCApe1xyXG4gICAgYWxwaGEgPSAwLjA7XHJcbiAgfVxyXG4gIHJldHVybiBhbHBoYTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGVycChtaW4sIG1heCwgdmFsdWUpIHtcclxuICByZXR1cm4gKDEtdmFsdWUpKm1pbiArIHZhbHVlKm1heDtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFwX3JhbmdlKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpIHtcclxuICAgIHJldHVybiBsb3cyICsgKGhpZ2gyIC0gbG93MikgKiAodmFsdWUgLSBsb3cxKSAvIChoaWdoMSAtIGxvdzEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDbGFtcGVkQWxwaGEoIGFscGhhICl7XHJcbiAgaWYoIGFscGhhID4gMSApe1xyXG4gICAgcmV0dXJuIDFcclxuICB9XHJcbiAgaWYoIGFscGhhIDwgMCApe1xyXG4gICAgcmV0dXJuIDA7XHJcbiAgfVxyXG4gIHJldHVybiBhbHBoYTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2xhbXBlZFZhbHVlKCB2YWx1ZSwgbWluLCBtYXggKXtcclxuICBpZiggdmFsdWUgPCBtaW4gKXtcclxuICAgIHJldHVybiBtaW47XHJcbiAgfVxyXG4gIGlmKCB2YWx1ZSA+IG1heCApe1xyXG4gICAgcmV0dXJuIG1heDtcclxuICB9XHJcbiAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJbXBsaWVkU3RlcCggdmFsdWUgKXtcclxuICBpZiggdmFsdWUgPT09IDAgKXtcclxuICAgIHJldHVybiAxOyAvLyBXaGF0IGFyZSB3ZSwgcHN5Y2hpY3M/XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIEhleSBEb3VnLCBjaGVjayB0aGlzIG91dC5cclxuICAgIHJldHVybiBNYXRoLnBvdygxMCwgTWF0aC5mbG9vcihNYXRoLmxvZyhNYXRoLmFicyh2YWx1ZSkpL01hdGguTE4xMCkpLzEwO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VmFsdWVGcm9tQWxwaGEoIGFscGhhLCBtaW4sIG1heCApe1xyXG4gIHJldHVybiBtYXBfcmFuZ2UoIGFscGhhLCAwLjAsIDEuMCwgbWluLCBtYXggKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBbHBoYUZyb21WYWx1ZSggdmFsdWUsIG1pbiwgbWF4ICl7XHJcbiAgcmV0dXJuIG1hcF9yYW5nZSggdmFsdWUsIG1pbiwgbWF4LCAwLjAsIDEuMCApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTdGVwcGVkVmFsdWUoIHZhbHVlLCBzdGVwICl7XHJcbiAgaWYoIHZhbHVlICUgc3RlcCAhPSAwKSB7XHJcbiAgICByZXR1cm4gTWF0aC5yb3VuZCggdmFsdWUgLyBzdGVwICkgKiBzdGVwO1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG51bURlY2ltYWxzKHgpIHtcclxuICB4ID0geC50b1N0cmluZygpO1xyXG4gIGlmICh4LmluZGV4T2YoJy4nKSA+IC0xKSB7XHJcbiAgICByZXR1cm4geC5sZW5ndGggLSB4LmluZGV4T2YoJy4nKSAtIDE7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAwO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcm91bmRUb0RlY2ltYWwodmFsdWUsIGRlY2ltYWxzKSB7XHJcbiAgY29uc3QgdGVuVG8gPSBNYXRoLnBvdygxMCwgZGVjaW1hbHMpO1xyXG4gIHJldHVybiBNYXRoLnJvdW5kKHZhbHVlICogdGVuVG8pIC8gdGVuVG87XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVRleHRMYWJlbCggdGV4dENyZWF0b3IsIHN0ciwgd2lkdGggPSAwLjQsIGRlcHRoID0gMC4wMjksIGZnQ29sb3IgPSAweGZmZmZmZiwgYmdDb2xvciA9IENvbG9ycy5ERUZBVUxUX0JBQ0ssIHNjYWxlID0gMS4wICl7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgY29uc3QgaW50ZXJuYWxQb3NpdGlvbmluZyA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIGdyb3VwLmFkZCggaW50ZXJuYWxQb3NpdGlvbmluZyApO1xyXG5cclxuICBjb25zdCB0ZXh0ID0gdGV4dENyZWF0b3IuY3JlYXRlKCBzdHIsIHsgY29sb3I6IGZnQ29sb3IsIHNjYWxlIH0gKTtcclxuICBpbnRlcm5hbFBvc2l0aW9uaW5nLmFkZCggdGV4dCApO1xyXG5cclxuXHJcbiAgZ3JvdXAuc2V0U3RyaW5nID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgdGV4dC51cGRhdGUoIHN0ci50b1N0cmluZygpICk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuc2V0TnVtYmVyID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgdGV4dC51cGRhdGUoIHN0ci50b0ZpeGVkKDIpICk7XHJcbiAgfTtcclxuXHJcbiAgdGV4dC5wb3NpdGlvbi56ID0gMC4wMTVcclxuXHJcbiAgY29uc3QgYmFja0JvdW5kcyA9IDAuMDE7XHJcbiAgY29uc3QgbWFyZ2luID0gMC4wMTtcclxuICBjb25zdCB0b3RhbFdpZHRoID0gd2lkdGg7XHJcbiAgY29uc3QgdG90YWxIZWlnaHQgPSAwLjA0ICsgbWFyZ2luICogMjtcclxuICBjb25zdCBsYWJlbEJhY2tHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggdG90YWxXaWR0aCwgdG90YWxIZWlnaHQsIGRlcHRoLCAxLCAxLCAxICk7XHJcbiAgbGFiZWxCYWNrR2VvbWV0cnkuYXBwbHlNYXRyaXgoIG5ldyBUSFJFRS5NYXRyaXg0KCkubWFrZVRyYW5zbGF0aW9uKCB0b3RhbFdpZHRoICogMC41IC0gbWFyZ2luLCAwLCAwICkgKTtcclxuXHJcbiAgY29uc3QgbGFiZWxCYWNrTWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBsYWJlbEJhY2tHZW9tZXRyeSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGxhYmVsQmFja01lc2guZ2VvbWV0cnksIGJnQ29sb3IgKTtcclxuXHJcbiAgbGFiZWxCYWNrTWVzaC5wb3NpdGlvbi55ID0gMC4wMztcclxuICBpbnRlcm5hbFBvc2l0aW9uaW5nLmFkZCggbGFiZWxCYWNrTWVzaCApO1xyXG4gIGludGVybmFsUG9zaXRpb25pbmcucG9zaXRpb24ueSA9IC10b3RhbEhlaWdodCAqIDAuNTtcclxuXHJcbiAgZ3JvdXAuYmFjayA9IGxhYmVsQmFja01lc2g7XHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qXG4gKlx0QGF1dGhvciB6ejg1IC8gaHR0cDovL3R3aXR0ZXIuY29tL2JsdXJzcGxpbmUgLyBodHRwOi8vd3d3LmxhYjRnYW1lcy5uZXQveno4NS9ibG9nXG4gKlx0QGF1dGhvciBjZW50ZXJpb253YXJlIC8gaHR0cDovL3d3dy5jZW50ZXJpb253YXJlLmNvbVxuICpcbiAqXHRTdWJkaXZpc2lvbiBHZW9tZXRyeSBNb2RpZmllclxuICpcdFx0dXNpbmcgTG9vcCBTdWJkaXZpc2lvbiBTY2hlbWVcbiAqXG4gKlx0UmVmZXJlbmNlczpcbiAqXHRcdGh0dHA6Ly9ncmFwaGljcy5zdGFuZm9yZC5lZHUvfm1kZmlzaGVyL3N1YmRpdmlzaW9uLmh0bWxcbiAqXHRcdGh0dHA6Ly93d3cuaG9sbWVzM2QubmV0L2dyYXBoaWNzL3N1YmRpdmlzaW9uL1xuICpcdFx0aHR0cDovL3d3dy5jcy5ydXRnZXJzLmVkdS9+ZGVjYXJsby9yZWFkaW5ncy9zdWJkaXYtc2cwMGMucGRmXG4gKlxuICpcdEtub3duIElzc3VlczpcbiAqXHRcdC0gY3VycmVudGx5IGRvZXNuJ3QgaGFuZGxlIFwiU2hhcnAgRWRnZXNcIlxuICovXG5cblRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIgPSBmdW5jdGlvbiAoIHN1YmRpdmlzaW9ucyApIHtcblxuXHR0aGlzLnN1YmRpdmlzaW9ucyA9ICggc3ViZGl2aXNpb25zID09PSB1bmRlZmluZWQgKSA/IDEgOiBzdWJkaXZpc2lvbnM7XG5cbn07XG5cbi8vIEFwcGxpZXMgdGhlIFwibW9kaWZ5XCIgcGF0dGVyblxuVEhSRUUuU3ViZGl2aXNpb25Nb2RpZmllci5wcm90b3R5cGUubW9kaWZ5ID0gZnVuY3Rpb24gKCBnZW9tZXRyeSApIHtcblxuXHR2YXIgcmVwZWF0cyA9IHRoaXMuc3ViZGl2aXNpb25zO1xuXG5cdHdoaWxlICggcmVwZWF0cyAtLSA+IDAgKSB7XG5cblx0XHR0aGlzLnNtb290aCggZ2VvbWV0cnkgKTtcblxuXHR9XG5cblx0Z2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XG5cdGdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XG5cbn07XG5cbiggZnVuY3Rpb24oKSB7XG5cblx0Ly8gU29tZSBjb25zdGFudHNcblx0dmFyIFdBUk5JTkdTID0gISB0cnVlOyAvLyBTZXQgdG8gdHJ1ZSBmb3IgZGV2ZWxvcG1lbnRcblx0dmFyIEFCQyA9IFsgJ2EnLCAnYicsICdjJyBdO1xuXG5cblx0ZnVuY3Rpb24gZ2V0RWRnZSggYSwgYiwgbWFwICkge1xuXG5cdFx0dmFyIHZlcnRleEluZGV4QSA9IE1hdGgubWluKCBhLCBiICk7XG5cdFx0dmFyIHZlcnRleEluZGV4QiA9IE1hdGgubWF4KCBhLCBiICk7XG5cblx0XHR2YXIga2V5ID0gdmVydGV4SW5kZXhBICsgXCJfXCIgKyB2ZXJ0ZXhJbmRleEI7XG5cblx0XHRyZXR1cm4gbWFwWyBrZXkgXTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBwcm9jZXNzRWRnZSggYSwgYiwgdmVydGljZXMsIG1hcCwgZmFjZSwgbWV0YVZlcnRpY2VzICkge1xuXG5cdFx0dmFyIHZlcnRleEluZGV4QSA9IE1hdGgubWluKCBhLCBiICk7XG5cdFx0dmFyIHZlcnRleEluZGV4QiA9IE1hdGgubWF4KCBhLCBiICk7XG5cblx0XHR2YXIga2V5ID0gdmVydGV4SW5kZXhBICsgXCJfXCIgKyB2ZXJ0ZXhJbmRleEI7XG5cblx0XHR2YXIgZWRnZTtcblxuXHRcdGlmICgga2V5IGluIG1hcCApIHtcblxuXHRcdFx0ZWRnZSA9IG1hcFsga2V5IF07XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR2YXIgdmVydGV4QSA9IHZlcnRpY2VzWyB2ZXJ0ZXhJbmRleEEgXTtcblx0XHRcdHZhciB2ZXJ0ZXhCID0gdmVydGljZXNbIHZlcnRleEluZGV4QiBdO1xuXG5cdFx0XHRlZGdlID0ge1xuXG5cdFx0XHRcdGE6IHZlcnRleEEsIC8vIHBvaW50ZXIgcmVmZXJlbmNlXG5cdFx0XHRcdGI6IHZlcnRleEIsXG5cdFx0XHRcdG5ld0VkZ2U6IG51bGwsXG5cdFx0XHRcdC8vIGFJbmRleDogYSwgLy8gbnVtYmVyZWQgcmVmZXJlbmNlXG5cdFx0XHRcdC8vIGJJbmRleDogYixcblx0XHRcdFx0ZmFjZXM6IFtdIC8vIHBvaW50ZXJzIHRvIGZhY2VcblxuXHRcdFx0fTtcblxuXHRcdFx0bWFwWyBrZXkgXSA9IGVkZ2U7XG5cblx0XHR9XG5cblx0XHRlZGdlLmZhY2VzLnB1c2goIGZhY2UgKTtcblxuXHRcdG1ldGFWZXJ0aWNlc1sgYSBdLmVkZ2VzLnB1c2goIGVkZ2UgKTtcblx0XHRtZXRhVmVydGljZXNbIGIgXS5lZGdlcy5wdXNoKCBlZGdlICk7XG5cblxuXHR9XG5cblx0ZnVuY3Rpb24gZ2VuZXJhdGVMb29rdXBzKCB2ZXJ0aWNlcywgZmFjZXMsIG1ldGFWZXJ0aWNlcywgZWRnZXMgKSB7XG5cblx0XHR2YXIgaSwgaWwsIGZhY2UsIGVkZ2U7XG5cblx0XHRmb3IgKCBpID0gMCwgaWwgPSB2ZXJ0aWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0bWV0YVZlcnRpY2VzWyBpIF0gPSB7IGVkZ2VzOiBbXSB9O1xuXG5cdFx0fVxuXG5cdFx0Zm9yICggaSA9IDAsIGlsID0gZmFjZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdGZhY2UgPSBmYWNlc1sgaSBdO1xuXG5cdFx0XHRwcm9jZXNzRWRnZSggZmFjZS5hLCBmYWNlLmIsIHZlcnRpY2VzLCBlZGdlcywgZmFjZSwgbWV0YVZlcnRpY2VzICk7XG5cdFx0XHRwcm9jZXNzRWRnZSggZmFjZS5iLCBmYWNlLmMsIHZlcnRpY2VzLCBlZGdlcywgZmFjZSwgbWV0YVZlcnRpY2VzICk7XG5cdFx0XHRwcm9jZXNzRWRnZSggZmFjZS5jLCBmYWNlLmEsIHZlcnRpY2VzLCBlZGdlcywgZmFjZSwgbWV0YVZlcnRpY2VzICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG5ld0ZhY2UoIG5ld0ZhY2VzLCBhLCBiLCBjICkge1xuXG5cdFx0bmV3RmFjZXMucHVzaCggbmV3IFRIUkVFLkZhY2UzKCBhLCBiLCBjICkgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gbWlkcG9pbnQoIGEsIGIgKSB7XG5cblx0XHRyZXR1cm4gKCBNYXRoLmFicyggYiAtIGEgKSAvIDIgKSArIE1hdGgubWluKCBhLCBiICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG5ld1V2KCBuZXdVdnMsIGEsIGIsIGMgKSB7XG5cblx0XHRuZXdVdnMucHVzaCggWyBhLmNsb25lKCksIGIuY2xvbmUoKSwgYy5jbG9uZSgpIF0gKTtcblxuXHR9XG5cblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHQvLyBQZXJmb3JtcyBvbmUgaXRlcmF0aW9uIG9mIFN1YmRpdmlzaW9uXG5cdFRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIucHJvdG90eXBlLnNtb290aCA9IGZ1bmN0aW9uICggZ2VvbWV0cnkgKSB7XG5cblx0XHR2YXIgdG1wID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuXHRcdHZhciBvbGRWZXJ0aWNlcywgb2xkRmFjZXMsIG9sZFV2cztcblx0XHR2YXIgbmV3VmVydGljZXMsIG5ld0ZhY2VzLCBuZXdVVnMgPSBbXTtcblxuXHRcdHZhciBuLCBsLCBpLCBpbCwgaiwgaztcblx0XHR2YXIgbWV0YVZlcnRpY2VzLCBzb3VyY2VFZGdlcztcblxuXHRcdC8vIG5ldyBzdHVmZi5cblx0XHR2YXIgc291cmNlRWRnZXMsIG5ld0VkZ2VWZXJ0aWNlcywgbmV3U291cmNlVmVydGljZXM7XG5cblx0XHRvbGRWZXJ0aWNlcyA9IGdlb21ldHJ5LnZlcnRpY2VzOyAvLyB7IHgsIHksIHp9XG5cdFx0b2xkRmFjZXMgPSBnZW9tZXRyeS5mYWNlczsgLy8geyBhOiBvbGRWZXJ0ZXgxLCBiOiBvbGRWZXJ0ZXgyLCBjOiBvbGRWZXJ0ZXgzIH1cblx0XHRvbGRVdnMgPSBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWyAwIF07XG5cblx0XHR2YXIgaGFzVXZzID0gb2xkVXZzICE9PSB1bmRlZmluZWQgJiYgb2xkVXZzLmxlbmd0aCA+IDA7XG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdFx0ICpcblx0XHQgKiBTdGVwIDA6IFByZXByb2Nlc3MgR2VvbWV0cnkgdG8gR2VuZXJhdGUgZWRnZXMgTG9va3VwXG5cdFx0ICpcblx0XHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdG1ldGFWZXJ0aWNlcyA9IG5ldyBBcnJheSggb2xkVmVydGljZXMubGVuZ3RoICk7XG5cdFx0c291cmNlRWRnZXMgPSB7fTsgLy8gRWRnZSA9PiB7IG9sZFZlcnRleDEsIG9sZFZlcnRleDIsIGZhY2VzW10gIH1cblxuXHRcdGdlbmVyYXRlTG9va3Vwcyggb2xkVmVydGljZXMsIG9sZEZhY2VzLCBtZXRhVmVydGljZXMsIHNvdXJjZUVkZ2VzICk7XG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0XHQgKlxuXHRcdCAqXHRTdGVwIDEuXG5cdFx0ICpcdEZvciBlYWNoIGVkZ2UsIGNyZWF0ZSBhIG5ldyBFZGdlIFZlcnRleCxcblx0XHQgKlx0dGhlbiBwb3NpdGlvbiBpdC5cblx0XHQgKlxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0bmV3RWRnZVZlcnRpY2VzID0gW107XG5cdFx0dmFyIG90aGVyLCBjdXJyZW50RWRnZSwgbmV3RWRnZSwgZmFjZTtcblx0XHR2YXIgZWRnZVZlcnRleFdlaWdodCwgYWRqYWNlbnRWZXJ0ZXhXZWlnaHQsIGNvbm5lY3RlZEZhY2VzO1xuXG5cdFx0Zm9yICggaSBpbiBzb3VyY2VFZGdlcyApIHtcblxuXHRcdFx0Y3VycmVudEVkZ2UgPSBzb3VyY2VFZGdlc1sgaSBdO1xuXHRcdFx0bmV3RWRnZSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0XHRcdGVkZ2VWZXJ0ZXhXZWlnaHQgPSAzIC8gODtcblx0XHRcdGFkamFjZW50VmVydGV4V2VpZ2h0ID0gMSAvIDg7XG5cblx0XHRcdGNvbm5lY3RlZEZhY2VzID0gY3VycmVudEVkZ2UuZmFjZXMubGVuZ3RoO1xuXG5cdFx0XHQvLyBjaGVjayBob3cgbWFueSBsaW5rZWQgZmFjZXMuIDIgc2hvdWxkIGJlIGNvcnJlY3QuXG5cdFx0XHRpZiAoIGNvbm5lY3RlZEZhY2VzICE9IDIgKSB7XG5cblx0XHRcdFx0Ly8gaWYgbGVuZ3RoIGlzIG5vdCAyLCBoYW5kbGUgY29uZGl0aW9uXG5cdFx0XHRcdGVkZ2VWZXJ0ZXhXZWlnaHQgPSAwLjU7XG5cdFx0XHRcdGFkamFjZW50VmVydGV4V2VpZ2h0ID0gMDtcblxuXHRcdFx0XHRpZiAoIGNvbm5lY3RlZEZhY2VzICE9IDEgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnU3ViZGl2aXNpb24gTW9kaWZpZXI6IE51bWJlciBvZiBjb25uZWN0ZWQgZmFjZXMgIT0gMiwgaXM6ICcsIGNvbm5lY3RlZEZhY2VzLCBjdXJyZW50RWRnZSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRuZXdFZGdlLmFkZFZlY3RvcnMoIGN1cnJlbnRFZGdlLmEsIGN1cnJlbnRFZGdlLmIgKS5tdWx0aXBseVNjYWxhciggZWRnZVZlcnRleFdlaWdodCApO1xuXG5cdFx0XHR0bXAuc2V0KCAwLCAwLCAwICk7XG5cblx0XHRcdGZvciAoIGogPSAwOyBqIDwgY29ubmVjdGVkRmFjZXM7IGogKysgKSB7XG5cblx0XHRcdFx0ZmFjZSA9IGN1cnJlbnRFZGdlLmZhY2VzWyBqIF07XG5cblx0XHRcdFx0Zm9yICggayA9IDA7IGsgPCAzOyBrICsrICkge1xuXG5cdFx0XHRcdFx0b3RoZXIgPSBvbGRWZXJ0aWNlc1sgZmFjZVsgQUJDWyBrIF0gXSBdO1xuXHRcdFx0XHRcdGlmICggb3RoZXIgIT09IGN1cnJlbnRFZGdlLmEgJiYgb3RoZXIgIT09IGN1cnJlbnRFZGdlLmIgKSBicmVhaztcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dG1wLmFkZCggb3RoZXIgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHR0bXAubXVsdGlwbHlTY2FsYXIoIGFkamFjZW50VmVydGV4V2VpZ2h0ICk7XG5cdFx0XHRuZXdFZGdlLmFkZCggdG1wICk7XG5cblx0XHRcdGN1cnJlbnRFZGdlLm5ld0VkZ2UgPSBuZXdFZGdlVmVydGljZXMubGVuZ3RoO1xuXHRcdFx0bmV3RWRnZVZlcnRpY2VzLnB1c2goIG5ld0VkZ2UgKTtcblxuXHRcdFx0Ly8gY29uc29sZS5sb2coY3VycmVudEVkZ2UsIG5ld0VkZ2UpO1xuXG5cdFx0fVxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHRcdCAqXG5cdFx0ICpcdFN0ZXAgMi5cblx0XHQgKlx0UmVwb3NpdGlvbiBlYWNoIHNvdXJjZSB2ZXJ0aWNlcy5cblx0XHQgKlxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0dmFyIGJldGEsIHNvdXJjZVZlcnRleFdlaWdodCwgY29ubmVjdGluZ1ZlcnRleFdlaWdodDtcblx0XHR2YXIgY29ubmVjdGluZ0VkZ2UsIGNvbm5lY3RpbmdFZGdlcywgb2xkVmVydGV4LCBuZXdTb3VyY2VWZXJ0ZXg7XG5cdFx0bmV3U291cmNlVmVydGljZXMgPSBbXTtcblxuXHRcdGZvciAoIGkgPSAwLCBpbCA9IG9sZFZlcnRpY2VzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xuXG5cdFx0XHRvbGRWZXJ0ZXggPSBvbGRWZXJ0aWNlc1sgaSBdO1xuXG5cdFx0XHQvLyBmaW5kIGFsbCBjb25uZWN0aW5nIGVkZ2VzICh1c2luZyBsb29rdXBUYWJsZSlcblx0XHRcdGNvbm5lY3RpbmdFZGdlcyA9IG1ldGFWZXJ0aWNlc1sgaSBdLmVkZ2VzO1xuXHRcdFx0biA9IGNvbm5lY3RpbmdFZGdlcy5sZW5ndGg7XG5cblx0XHRcdGlmICggbiA9PSAzICkge1xuXG5cdFx0XHRcdGJldGEgPSAzIC8gMTY7XG5cblx0XHRcdH0gZWxzZSBpZiAoIG4gPiAzICkge1xuXG5cdFx0XHRcdGJldGEgPSAzIC8gKCA4ICogbiApOyAvLyBXYXJyZW4ncyBtb2RpZmllZCBmb3JtdWxhXG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gTG9vcCdzIG9yaWdpbmFsIGJldGEgZm9ybXVsYVxuXHRcdFx0Ly8gYmV0YSA9IDEgLyBuICogKCA1LzggLSBNYXRoLnBvdyggMy84ICsgMS80ICogTWF0aC5jb3MoIDIgKiBNYXRoLiBQSSAvIG4gKSwgMikgKTtcblxuXHRcdFx0c291cmNlVmVydGV4V2VpZ2h0ID0gMSAtIG4gKiBiZXRhO1xuXHRcdFx0Y29ubmVjdGluZ1ZlcnRleFdlaWdodCA9IGJldGE7XG5cblx0XHRcdGlmICggbiA8PSAyICkge1xuXG5cdFx0XHRcdC8vIGNyZWFzZSBhbmQgYm91bmRhcnkgcnVsZXNcblx0XHRcdFx0Ly8gY29uc29sZS53YXJuKCdjcmVhc2UgYW5kIGJvdW5kYXJ5IHJ1bGVzJyk7XG5cblx0XHRcdFx0aWYgKCBuID09IDIgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnMiBjb25uZWN0aW5nIGVkZ2VzJywgY29ubmVjdGluZ0VkZ2VzICk7XG5cdFx0XHRcdFx0c291cmNlVmVydGV4V2VpZ2h0ID0gMyAvIDQ7XG5cdFx0XHRcdFx0Y29ubmVjdGluZ1ZlcnRleFdlaWdodCA9IDEgLyA4O1xuXG5cdFx0XHRcdFx0Ly8gc291cmNlVmVydGV4V2VpZ2h0ID0gMTtcblx0XHRcdFx0XHQvLyBjb25uZWN0aW5nVmVydGV4V2VpZ2h0ID0gMDtcblxuXHRcdFx0XHR9IGVsc2UgaWYgKCBuID09IDEgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnb25seSAxIGNvbm5lY3RpbmcgZWRnZScgKTtcblxuXHRcdFx0XHR9IGVsc2UgaWYgKCBuID09IDAgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnMCBjb25uZWN0aW5nIGVkZ2VzJyApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRuZXdTb3VyY2VWZXJ0ZXggPSBvbGRWZXJ0ZXguY2xvbmUoKS5tdWx0aXBseVNjYWxhciggc291cmNlVmVydGV4V2VpZ2h0ICk7XG5cblx0XHRcdHRtcC5zZXQoIDAsIDAsIDAgKTtcblxuXHRcdFx0Zm9yICggaiA9IDA7IGogPCBuOyBqICsrICkge1xuXG5cdFx0XHRcdGNvbm5lY3RpbmdFZGdlID0gY29ubmVjdGluZ0VkZ2VzWyBqIF07XG5cdFx0XHRcdG90aGVyID0gY29ubmVjdGluZ0VkZ2UuYSAhPT0gb2xkVmVydGV4ID8gY29ubmVjdGluZ0VkZ2UuYSA6IGNvbm5lY3RpbmdFZGdlLmI7XG5cdFx0XHRcdHRtcC5hZGQoIG90aGVyICk7XG5cblx0XHRcdH1cblxuXHRcdFx0dG1wLm11bHRpcGx5U2NhbGFyKCBjb25uZWN0aW5nVmVydGV4V2VpZ2h0ICk7XG5cdFx0XHRuZXdTb3VyY2VWZXJ0ZXguYWRkKCB0bXAgKTtcblxuXHRcdFx0bmV3U291cmNlVmVydGljZXMucHVzaCggbmV3U291cmNlVmVydGV4ICk7XG5cblx0XHR9XG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0XHQgKlxuXHRcdCAqXHRTdGVwIDMuXG5cdFx0ICpcdEdlbmVyYXRlIEZhY2VzIGJldHdlZW4gc291cmNlIHZlcnRpY2VzXG5cdFx0ICpcdGFuZCBlZGdlIHZlcnRpY2VzLlxuXHRcdCAqXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHRuZXdWZXJ0aWNlcyA9IG5ld1NvdXJjZVZlcnRpY2VzLmNvbmNhdCggbmV3RWRnZVZlcnRpY2VzICk7XG5cdFx0dmFyIHNsID0gbmV3U291cmNlVmVydGljZXMubGVuZ3RoLCBlZGdlMSwgZWRnZTIsIGVkZ2UzO1xuXHRcdG5ld0ZhY2VzID0gW107XG5cblx0XHR2YXIgdXYsIHgwLCB4MSwgeDI7XG5cdFx0dmFyIHgzID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblx0XHR2YXIgeDQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXHRcdHZhciB4NSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0XHRmb3IgKCBpID0gMCwgaWwgPSBvbGRGYWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0ZmFjZSA9IG9sZEZhY2VzWyBpIF07XG5cblx0XHRcdC8vIGZpbmQgdGhlIDMgbmV3IGVkZ2VzIHZlcnRleCBvZiBlYWNoIG9sZCBmYWNlXG5cblx0XHRcdGVkZ2UxID0gZ2V0RWRnZSggZmFjZS5hLCBmYWNlLmIsIHNvdXJjZUVkZ2VzICkubmV3RWRnZSArIHNsO1xuXHRcdFx0ZWRnZTIgPSBnZXRFZGdlKCBmYWNlLmIsIGZhY2UuYywgc291cmNlRWRnZXMgKS5uZXdFZGdlICsgc2w7XG5cdFx0XHRlZGdlMyA9IGdldEVkZ2UoIGZhY2UuYywgZmFjZS5hLCBzb3VyY2VFZGdlcyApLm5ld0VkZ2UgKyBzbDtcblxuXHRcdFx0Ly8gY3JlYXRlIDQgZmFjZXMuXG5cblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBlZGdlMSwgZWRnZTIsIGVkZ2UzICk7XG5cdFx0XHRuZXdGYWNlKCBuZXdGYWNlcywgZmFjZS5hLCBlZGdlMSwgZWRnZTMgKTtcblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBmYWNlLmIsIGVkZ2UyLCBlZGdlMSApO1xuXHRcdFx0bmV3RmFjZSggbmV3RmFjZXMsIGZhY2UuYywgZWRnZTMsIGVkZ2UyICk7XG5cblx0XHRcdC8vIGNyZWF0ZSA0IG5ldyB1didzXG5cblx0XHRcdGlmICggaGFzVXZzICkge1xuXG5cdFx0XHRcdHV2ID0gb2xkVXZzWyBpIF07XG5cblx0XHRcdFx0eDAgPSB1dlsgMCBdO1xuXHRcdFx0XHR4MSA9IHV2WyAxIF07XG5cdFx0XHRcdHgyID0gdXZbIDIgXTtcblxuXHRcdFx0XHR4My5zZXQoIG1pZHBvaW50KCB4MC54LCB4MS54ICksIG1pZHBvaW50KCB4MC55LCB4MS55ICkgKTtcblx0XHRcdFx0eDQuc2V0KCBtaWRwb2ludCggeDEueCwgeDIueCApLCBtaWRwb2ludCggeDEueSwgeDIueSApICk7XG5cdFx0XHRcdHg1LnNldCggbWlkcG9pbnQoIHgwLngsIHgyLnggKSwgbWlkcG9pbnQoIHgwLnksIHgyLnkgKSApO1xuXG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgzLCB4NCwgeDUgKTtcblx0XHRcdFx0bmV3VXYoIG5ld1VWcywgeDAsIHgzLCB4NSApO1xuXG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgxLCB4NCwgeDMgKTtcblx0XHRcdFx0bmV3VXYoIG5ld1VWcywgeDIsIHg1LCB4NCApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBPdmVyd3JpdGUgb2xkIGFycmF5c1xuXHRcdGdlb21ldHJ5LnZlcnRpY2VzID0gbmV3VmVydGljZXM7XG5cdFx0Z2VvbWV0cnkuZmFjZXMgPSBuZXdGYWNlcztcblx0XHRpZiAoIGhhc1V2cyApIGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnNbIDAgXSA9IG5ld1VWcztcblxuXHRcdC8vIGNvbnNvbGUubG9nKCdkb25lJyk7XG5cblx0fTtcblxufSApKCk7XG4iLCJ2YXIgc3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuQXJyYXlcblxuZnVuY3Rpb24gYW5BcnJheShhcnIpIHtcbiAgcmV0dXJuIChcbiAgICAgICBhcnIuQllURVNfUEVSX0VMRU1FTlRcbiAgICAmJiBzdHIuY2FsbChhcnIuYnVmZmVyKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJ1xuICAgIHx8IEFycmF5LmlzQXJyYXkoYXJyKVxuICApXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG51bXR5cGUobnVtLCBkZWYpIHtcblx0cmV0dXJuIHR5cGVvZiBudW0gPT09ICdudW1iZXInXG5cdFx0PyBudW0gXG5cdFx0OiAodHlwZW9mIGRlZiA9PT0gJ251bWJlcicgPyBkZWYgOiAwKVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZHR5cGUpIHtcbiAgc3dpdGNoIChkdHlwZSkge1xuICAgIGNhc2UgJ2ludDgnOlxuICAgICAgcmV0dXJuIEludDhBcnJheVxuICAgIGNhc2UgJ2ludDE2JzpcbiAgICAgIHJldHVybiBJbnQxNkFycmF5XG4gICAgY2FzZSAnaW50MzInOlxuICAgICAgcmV0dXJuIEludDMyQXJyYXlcbiAgICBjYXNlICd1aW50OCc6XG4gICAgICByZXR1cm4gVWludDhBcnJheVxuICAgIGNhc2UgJ3VpbnQxNic6XG4gICAgICByZXR1cm4gVWludDE2QXJyYXlcbiAgICBjYXNlICd1aW50MzInOlxuICAgICAgcmV0dXJuIFVpbnQzMkFycmF5XG4gICAgY2FzZSAnZmxvYXQzMic6XG4gICAgICByZXR1cm4gRmxvYXQzMkFycmF5XG4gICAgY2FzZSAnZmxvYXQ2NCc6XG4gICAgICByZXR1cm4gRmxvYXQ2NEFycmF5XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5XG4gICAgY2FzZSAndWludDhfY2xhbXBlZCc6XG4gICAgICByZXR1cm4gVWludDhDbGFtcGVkQXJyYXlcbiAgfVxufVxuIiwiLyplc2xpbnQgbmV3LWNhcDowKi9cbnZhciBkdHlwZSA9IHJlcXVpcmUoJ2R0eXBlJylcbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlblZlcnRleERhdGFcbmZ1bmN0aW9uIGZsYXR0ZW5WZXJ0ZXhEYXRhIChkYXRhLCBvdXRwdXQsIG9mZnNldCkge1xuICBpZiAoIWRhdGEpIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSBkYXRhIGFzIGZpcnN0IHBhcmFtZXRlcicpXG4gIG9mZnNldCA9ICsob2Zmc2V0IHx8IDApIHwgMFxuXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIEFycmF5LmlzQXJyYXkoZGF0YVswXSkpIHtcbiAgICB2YXIgZGltID0gZGF0YVswXS5sZW5ndGhcbiAgICB2YXIgbGVuZ3RoID0gZGF0YS5sZW5ndGggKiBkaW1cblxuICAgIC8vIG5vIG91dHB1dCBzcGVjaWZpZWQsIGNyZWF0ZSBhIG5ldyB0eXBlZCBhcnJheVxuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvdXRwdXQgPSBuZXcgKGR0eXBlKG91dHB1dCB8fCAnZmxvYXQzMicpKShsZW5ndGggKyBvZmZzZXQpXG4gICAgfVxuXG4gICAgdmFyIGRzdExlbmd0aCA9IG91dHB1dC5sZW5ndGggLSBvZmZzZXRcbiAgICBpZiAobGVuZ3RoICE9PSBkc3RMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc291cmNlIGxlbmd0aCAnICsgbGVuZ3RoICsgJyAoJyArIGRpbSArICd4JyArIGRhdGEubGVuZ3RoICsgJyknICtcbiAgICAgICAgJyBkb2VzIG5vdCBtYXRjaCBkZXN0aW5hdGlvbiBsZW5ndGggJyArIGRzdExlbmd0aClcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgayA9IG9mZnNldDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZGltOyBqKyspIHtcbiAgICAgICAgb3V0cHV0W2srK10gPSBkYXRhW2ldW2pdXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBubyBvdXRwdXQsIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgIHZhciBDdG9yID0gZHR5cGUob3V0cHV0IHx8ICdmbG9hdDMyJylcbiAgICAgIGlmIChvZmZzZXQgPT09IDApIHtcbiAgICAgICAgb3V0cHV0ID0gbmV3IEN0b3IoZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IG5ldyBDdG9yKGRhdGEubGVuZ3RoICsgb2Zmc2V0KVxuICAgICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3RvcmUgb3V0cHV0IGluIGV4aXN0aW5nIGFycmF5XG4gICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBpbGUocHJvcGVydHkpIHtcblx0aWYgKCFwcm9wZXJ0eSB8fCB0eXBlb2YgcHJvcGVydHkgIT09ICdzdHJpbmcnKVxuXHRcdHRocm93IG5ldyBFcnJvcignbXVzdCBzcGVjaWZ5IHByb3BlcnR5IGZvciBpbmRleG9mIHNlYXJjaCcpXG5cblx0cmV0dXJuIG5ldyBGdW5jdGlvbignYXJyYXknLCAndmFsdWUnLCAnc3RhcnQnLCBbXG5cdFx0J3N0YXJ0ID0gc3RhcnQgfHwgMCcsXG5cdFx0J2ZvciAodmFyIGk9c3RhcnQ7IGk8YXJyYXkubGVuZ3RoOyBpKyspJyxcblx0XHQnICBpZiAoYXJyYXlbaV1bXCInICsgcHJvcGVydHkgKydcIl0gPT09IHZhbHVlKScsXG5cdFx0JyAgICAgIHJldHVybiBpJyxcblx0XHQncmV0dXJuIC0xJ1xuXHRdLmpvaW4oJ1xcbicpKVxufSIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwidmFyIHdvcmRXcmFwID0gcmVxdWlyZSgnd29yZC13cmFwcGVyJylcbnZhciB4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kJylcbnZhciBmaW5kQ2hhciA9IHJlcXVpcmUoJ2luZGV4b2YtcHJvcGVydHknKSgnaWQnKVxudmFyIG51bWJlciA9IHJlcXVpcmUoJ2FzLW51bWJlcicpXG5cbnZhciBYX0hFSUdIVFMgPSBbJ3gnLCAnZScsICdhJywgJ28nLCAnbicsICdzJywgJ3InLCAnYycsICd1JywgJ20nLCAndicsICd3JywgJ3onXVxudmFyIE1fV0lEVEhTID0gWydtJywgJ3cnXVxudmFyIENBUF9IRUlHSFRTID0gWydIJywgJ0knLCAnTicsICdFJywgJ0YnLCAnSycsICdMJywgJ1QnLCAnVScsICdWJywgJ1cnLCAnWCcsICdZJywgJ1onXVxuXG5cbnZhciBUQUJfSUQgPSAnXFx0Jy5jaGFyQ29kZUF0KDApXG52YXIgU1BBQ0VfSUQgPSAnICcuY2hhckNvZGVBdCgwKVxudmFyIEFMSUdOX0xFRlQgPSAwLCBcbiAgICBBTElHTl9DRU5URVIgPSAxLCBcbiAgICBBTElHTl9SSUdIVCA9IDJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVMYXlvdXQob3B0KSB7XG4gIHJldHVybiBuZXcgVGV4dExheW91dChvcHQpXG59XG5cbmZ1bmN0aW9uIFRleHRMYXlvdXQob3B0KSB7XG4gIHRoaXMuZ2x5cGhzID0gW11cbiAgdGhpcy5fbWVhc3VyZSA9IHRoaXMuY29tcHV0ZU1ldHJpY3MuYmluZCh0aGlzKVxuICB0aGlzLnVwZGF0ZShvcHQpXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG9wdCkge1xuICBvcHQgPSB4dGVuZCh7XG4gICAgbWVhc3VyZTogdGhpcy5fbWVhc3VyZVxuICB9LCBvcHQpXG4gIHRoaXMuX29wdCA9IG9wdFxuICB0aGlzLl9vcHQudGFiU2l6ZSA9IG51bWJlcih0aGlzLl9vcHQudGFiU2l6ZSwgNClcblxuICBpZiAoIW9wdC5mb250KVxuICAgIHRocm93IG5ldyBFcnJvcignbXVzdCBwcm92aWRlIGEgdmFsaWQgYml0bWFwIGZvbnQnKVxuXG4gIHZhciBnbHlwaHMgPSB0aGlzLmdseXBoc1xuICB2YXIgdGV4dCA9IG9wdC50ZXh0fHwnJyBcbiAgdmFyIGZvbnQgPSBvcHQuZm9udFxuICB0aGlzLl9zZXR1cFNwYWNlR2x5cGhzKGZvbnQpXG4gIFxuICB2YXIgbGluZXMgPSB3b3JkV3JhcC5saW5lcyh0ZXh0LCBvcHQpXG4gIHZhciBtaW5XaWR0aCA9IG9wdC53aWR0aCB8fCAwXG5cbiAgLy9jbGVhciBnbHlwaHNcbiAgZ2x5cGhzLmxlbmd0aCA9IDBcblxuICAvL2dldCBtYXggbGluZSB3aWR0aFxuICB2YXIgbWF4TGluZVdpZHRoID0gbGluZXMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGxpbmUpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgocHJldiwgbGluZS53aWR0aCwgbWluV2lkdGgpXG4gIH0sIDApXG5cbiAgLy90aGUgcGVuIHBvc2l0aW9uXG4gIHZhciB4ID0gMFxuICB2YXIgeSA9IDBcbiAgdmFyIGxpbmVIZWlnaHQgPSBudW1iZXIob3B0LmxpbmVIZWlnaHQsIGZvbnQuY29tbW9uLmxpbmVIZWlnaHQpXG4gIHZhciBiYXNlbGluZSA9IGZvbnQuY29tbW9uLmJhc2VcbiAgdmFyIGRlc2NlbmRlciA9IGxpbmVIZWlnaHQtYmFzZWxpbmVcbiAgdmFyIGxldHRlclNwYWNpbmcgPSBvcHQubGV0dGVyU3BhY2luZyB8fCAwXG4gIHZhciBoZWlnaHQgPSBsaW5lSGVpZ2h0ICogbGluZXMubGVuZ3RoIC0gZGVzY2VuZGVyXG4gIHZhciBhbGlnbiA9IGdldEFsaWduVHlwZSh0aGlzLl9vcHQuYWxpZ24pXG5cbiAgLy9kcmF3IHRleHQgYWxvbmcgYmFzZWxpbmVcbiAgeSAtPSBoZWlnaHRcbiAgXG4gIC8vdGhlIG1ldHJpY3MgZm9yIHRoaXMgdGV4dCBsYXlvdXRcbiAgdGhpcy5fd2lkdGggPSBtYXhMaW5lV2lkdGhcbiAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0XG4gIHRoaXMuX2Rlc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBiYXNlbGluZVxuICB0aGlzLl9iYXNlbGluZSA9IGJhc2VsaW5lXG4gIHRoaXMuX3hIZWlnaHQgPSBnZXRYSGVpZ2h0KGZvbnQpXG4gIHRoaXMuX2NhcEhlaWdodCA9IGdldENhcEhlaWdodChmb250KVxuICB0aGlzLl9saW5lSGVpZ2h0ID0gbGluZUhlaWdodFxuICB0aGlzLl9hc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBkZXNjZW5kZXIgLSB0aGlzLl94SGVpZ2h0XG4gICAgXG4gIC8vbGF5b3V0IGVhY2ggZ2x5cGhcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgbGluZUluZGV4KSB7XG4gICAgdmFyIHN0YXJ0ID0gbGluZS5zdGFydFxuICAgIHZhciBlbmQgPSBsaW5lLmVuZFxuICAgIHZhciBsaW5lV2lkdGggPSBsaW5lLndpZHRoXG4gICAgdmFyIGxhc3RHbHlwaFxuICAgIFxuICAgIC8vZm9yIGVhY2ggZ2x5cGggaW4gdGhhdCBsaW5lLi4uXG4gICAgZm9yICh2YXIgaT1zdGFydDsgaTxlbmQ7IGkrKykge1xuICAgICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgICB2YXIgZ2x5cGggPSBzZWxmLmdldEdseXBoKGZvbnQsIGlkKVxuICAgICAgaWYgKGdseXBoKSB7XG4gICAgICAgIGlmIChsYXN0R2x5cGgpIFxuICAgICAgICAgIHggKz0gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKVxuXG4gICAgICAgIHZhciB0eCA9IHhcbiAgICAgICAgaWYgKGFsaWduID09PSBBTElHTl9DRU5URVIpIFxuICAgICAgICAgIHR4ICs9IChtYXhMaW5lV2lkdGgtbGluZVdpZHRoKS8yXG4gICAgICAgIGVsc2UgaWYgKGFsaWduID09PSBBTElHTl9SSUdIVClcbiAgICAgICAgICB0eCArPSAobWF4TGluZVdpZHRoLWxpbmVXaWR0aClcblxuICAgICAgICBnbHlwaHMucHVzaCh7XG4gICAgICAgICAgcG9zaXRpb246IFt0eCwgeV0sXG4gICAgICAgICAgZGF0YTogZ2x5cGgsXG4gICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgbGluZTogbGluZUluZGV4XG4gICAgICAgIH0pICBcblxuICAgICAgICAvL21vdmUgcGVuIGZvcndhcmRcbiAgICAgICAgeCArPSBnbHlwaC54YWR2YW5jZSArIGxldHRlclNwYWNpbmdcbiAgICAgICAgbGFzdEdseXBoID0gZ2x5cGhcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL25leHQgbGluZSBkb3duXG4gICAgeSArPSBsaW5lSGVpZ2h0XG4gICAgeCA9IDBcbiAgfSlcbiAgdGhpcy5fbGluZXNUb3RhbCA9IGxpbmVzLmxlbmd0aDtcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuX3NldHVwU3BhY2VHbHlwaHMgPSBmdW5jdGlvbihmb250KSB7XG4gIC8vVGhlc2UgYXJlIGZhbGxiYWNrcywgd2hlbiB0aGUgZm9udCBkb2Vzbid0IGluY2x1ZGVcbiAgLy8nICcgb3IgJ1xcdCcgZ2x5cGhzXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IG51bGxcbiAgdGhpcy5fZmFsbGJhY2tUYWJHbHlwaCA9IG51bGxcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuXG5cbiAgLy90cnkgdG8gZ2V0IHNwYWNlIGdseXBoXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlICdtJyBvciAndycgZ2x5cGhzXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlIGZpcnN0IGdseXBoIGF2YWlsYWJsZVxuICB2YXIgc3BhY2UgPSBnZXRHbHlwaEJ5SWQoZm9udCwgU1BBQ0VfSUQpIFxuICAgICAgICAgIHx8IGdldE1HbHlwaChmb250KSBcbiAgICAgICAgICB8fCBmb250LmNoYXJzWzBdXG5cbiAgLy9hbmQgY3JlYXRlIGEgZmFsbGJhY2sgZm9yIHRhYlxuICB2YXIgdGFiV2lkdGggPSB0aGlzLl9vcHQudGFiU2l6ZSAqIHNwYWNlLnhhZHZhbmNlXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IHNwYWNlXG4gIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGggPSB4dGVuZChzcGFjZSwge1xuICAgIHg6IDAsIHk6IDAsIHhhZHZhbmNlOiB0YWJXaWR0aCwgaWQ6IFRBQl9JRCwgXG4gICAgeG9mZnNldDogMCwgeW9mZnNldDogMCwgd2lkdGg6IDAsIGhlaWdodDogMFxuICB9KVxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5nZXRHbHlwaCA9IGZ1bmN0aW9uKGZvbnQsIGlkKSB7XG4gIHZhciBnbHlwaCA9IGdldEdseXBoQnlJZChmb250LCBpZClcbiAgaWYgKGdseXBoKVxuICAgIHJldHVybiBnbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gVEFCX0lEKSBcbiAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tUYWJHbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gU1BBQ0VfSUQpIFxuICAgIHJldHVybiB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGhcbiAgcmV0dXJuIG51bGxcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuY29tcHV0ZU1ldHJpY3MgPSBmdW5jdGlvbih0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICB2YXIgbGV0dGVyU3BhY2luZyA9IHRoaXMuX29wdC5sZXR0ZXJTcGFjaW5nIHx8IDBcbiAgdmFyIGZvbnQgPSB0aGlzLl9vcHQuZm9udFxuICB2YXIgY3VyUGVuID0gMFxuICB2YXIgY3VyV2lkdGggPSAwXG4gIHZhciBjb3VudCA9IDBcbiAgdmFyIGdseXBoXG4gIHZhciBsYXN0R2x5cGhcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgZW5kOiBzdGFydCxcbiAgICAgIHdpZHRoOiAwXG4gICAgfVxuICB9XG5cbiAgZW5kID0gTWF0aC5taW4odGV4dC5sZW5ndGgsIGVuZClcbiAgZm9yICh2YXIgaT1zdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgdmFyIGdseXBoID0gdGhpcy5nZXRHbHlwaChmb250LCBpZClcblxuICAgIGlmIChnbHlwaCkge1xuICAgICAgLy9tb3ZlIHBlbiBmb3J3YXJkXG4gICAgICB2YXIgeG9mZiA9IGdseXBoLnhvZmZzZXRcbiAgICAgIHZhciBrZXJuID0gbGFzdEdseXBoID8gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKSA6IDBcbiAgICAgIGN1clBlbiArPSBrZXJuXG5cbiAgICAgIHZhciBuZXh0UGVuID0gY3VyUGVuICsgZ2x5cGgueGFkdmFuY2UgKyBsZXR0ZXJTcGFjaW5nXG4gICAgICB2YXIgbmV4dFdpZHRoID0gY3VyUGVuICsgZ2x5cGgud2lkdGhcblxuICAgICAgLy93ZSd2ZSBoaXQgb3VyIGxpbWl0OyB3ZSBjYW4ndCBtb3ZlIG9udG8gdGhlIG5leHQgZ2x5cGhcbiAgICAgIGlmIChuZXh0V2lkdGggPj0gd2lkdGggfHwgbmV4dFBlbiA+PSB3aWR0aClcbiAgICAgICAgYnJlYWtcblxuICAgICAgLy9vdGhlcndpc2UgY29udGludWUgYWxvbmcgb3VyIGxpbmVcbiAgICAgIGN1clBlbiA9IG5leHRQZW5cbiAgICAgIGN1cldpZHRoID0gbmV4dFdpZHRoXG4gICAgICBsYXN0R2x5cGggPSBnbHlwaFxuICAgIH1cbiAgICBjb3VudCsrXG4gIH1cbiAgXG4gIC8vbWFrZSBzdXJlIHJpZ2h0bW9zdCBlZGdlIGxpbmVzIHVwIHdpdGggcmVuZGVyZWQgZ2x5cGhzXG4gIGlmIChsYXN0R2x5cGgpXG4gICAgY3VyV2lkdGggKz0gbGFzdEdseXBoLnhvZmZzZXRcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBlbmQ6IHN0YXJ0ICsgY291bnQsXG4gICAgd2lkdGg6IGN1cldpZHRoXG4gIH1cbn1cblxuLy9nZXR0ZXJzIGZvciB0aGUgcHJpdmF0ZSB2YXJzXG47Wyd3aWR0aCcsICdoZWlnaHQnLCBcbiAgJ2Rlc2NlbmRlcicsICdhc2NlbmRlcicsXG4gICd4SGVpZ2h0JywgJ2Jhc2VsaW5lJyxcbiAgJ2NhcEhlaWdodCcsXG4gICdsaW5lSGVpZ2h0JyBdLmZvckVhY2goYWRkR2V0dGVyKVxuXG5mdW5jdGlvbiBhZGRHZXR0ZXIobmFtZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dExheW91dC5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICBnZXQ6IHdyYXBwZXIobmFtZSksXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG59XG5cbi8vY3JlYXRlIGxvb2t1cHMgZm9yIHByaXZhdGUgdmFyc1xuZnVuY3Rpb24gd3JhcHBlcihuYW1lKSB7XG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKFtcbiAgICAncmV0dXJuIGZ1bmN0aW9uICcrbmFtZSsnKCkgeycsXG4gICAgJyAgcmV0dXJuIHRoaXMuXycrbmFtZSxcbiAgICAnfSdcbiAgXS5qb2luKCdcXG4nKSkpKClcbn1cblxuZnVuY3Rpb24gZ2V0R2x5cGhCeUlkKGZvbnQsIGlkKSB7XG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gbnVsbFxuXG4gIHZhciBnbHlwaElkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICBpZiAoZ2x5cGhJZHggPj0gMClcbiAgICByZXR1cm4gZm9udC5jaGFyc1tnbHlwaElkeF1cbiAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gZ2V0WEhlaWdodChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxYX0hFSUdIVFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBYX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRNR2x5cGgoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8TV9XSURUSFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBNX1dJRFRIU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdXG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0Q2FwSGVpZ2h0KGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPENBUF9IRUlHSFRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gQ0FQX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRLZXJuaW5nKGZvbnQsIGxlZnQsIHJpZ2h0KSB7XG4gIGlmICghZm9udC5rZXJuaW5ncyB8fCBmb250Lmtlcm5pbmdzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gMFxuXG4gIHZhciB0YWJsZSA9IGZvbnQua2VybmluZ3NcbiAgZm9yICh2YXIgaT0wOyBpPHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtlcm4gPSB0YWJsZVtpXVxuICAgIGlmIChrZXJuLmZpcnN0ID09PSBsZWZ0ICYmIGtlcm4uc2Vjb25kID09PSByaWdodClcbiAgICAgIHJldHVybiBrZXJuLmFtb3VudFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldEFsaWduVHlwZShhbGlnbikge1xuICBpZiAoYWxpZ24gPT09ICdjZW50ZXInKVxuICAgIHJldHVybiBBTElHTl9DRU5URVJcbiAgZWxzZSBpZiAoYWxpZ24gPT09ICdyaWdodCcpXG4gICAgcmV0dXJuIEFMSUdOX1JJR0hUXG4gIHJldHVybiBBTElHTl9MRUZUXG59IiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUJNRm9udEFzY2lpKGRhdGEpIHtcbiAgaWYgKCFkYXRhKVxuICAgIHRocm93IG5ldyBFcnJvcignbm8gZGF0YSBwcm92aWRlZCcpXG4gIGRhdGEgPSBkYXRhLnRvU3RyaW5nKCkudHJpbSgpXG5cbiAgdmFyIG91dHB1dCA9IHtcbiAgICBwYWdlczogW10sXG4gICAgY2hhcnM6IFtdLFxuICAgIGtlcm5pbmdzOiBbXVxuICB9XG5cbiAgdmFyIGxpbmVzID0gZGF0YS5zcGxpdCgvXFxyXFxuP3xcXG4vZylcblxuICBpZiAobGluZXMubGVuZ3RoID09PSAwKVxuICAgIHRocm93IG5ldyBFcnJvcignbm8gZGF0YSBpbiBCTUZvbnQgZmlsZScpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBsaW5lRGF0YSA9IHNwbGl0TGluZShsaW5lc1tpXSwgaSlcbiAgICBpZiAoIWxpbmVEYXRhKSAvL3NraXAgZW1wdHkgbGluZXNcbiAgICAgIGNvbnRpbnVlXG5cbiAgICBpZiAobGluZURhdGEua2V5ID09PSAncGFnZScpIHtcbiAgICAgIGlmICh0eXBlb2YgbGluZURhdGEuZGF0YS5pZCAhPT0gJ251bWJlcicpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWFsZm9ybWVkIGZpbGUgYXQgbGluZSAnICsgaSArICcgLS0gbmVlZHMgcGFnZSBpZD1OJylcbiAgICAgIGlmICh0eXBlb2YgbGluZURhdGEuZGF0YS5maWxlICE9PSAnc3RyaW5nJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYWxmb3JtZWQgZmlsZSBhdCBsaW5lICcgKyBpICsgJyAtLSBuZWVkcyBwYWdlIGZpbGU9XCJwYXRoXCInKVxuICAgICAgb3V0cHV0LnBhZ2VzW2xpbmVEYXRhLmRhdGEuaWRdID0gbGluZURhdGEuZGF0YS5maWxlXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdjaGFycycgfHwgbGluZURhdGEua2V5ID09PSAna2VybmluZ3MnKSB7XG4gICAgICAvLy4uLiBkbyBub3RoaW5nIGZvciB0aGVzZSB0d28gLi4uXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdjaGFyJykge1xuICAgICAgb3V0cHV0LmNoYXJzLnB1c2gobGluZURhdGEuZGF0YSlcbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2tlcm5pbmcnKSB7XG4gICAgICBvdXRwdXQua2VybmluZ3MucHVzaChsaW5lRGF0YS5kYXRhKVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXRbbGluZURhdGEua2V5XSA9IGxpbmVEYXRhLmRhdGFcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG5cbmZ1bmN0aW9uIHNwbGl0TGluZShsaW5lLCBpZHgpIHtcbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFx0Ky9nLCAnICcpLnRyaW0oKVxuICBpZiAoIWxpbmUpXG4gICAgcmV0dXJuIG51bGxcblxuICB2YXIgc3BhY2UgPSBsaW5lLmluZGV4T2YoJyAnKVxuICBpZiAoc3BhY2UgPT09IC0xKSBcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJubyBuYW1lZCByb3cgYXQgbGluZSBcIiArIGlkeClcblxuICB2YXIga2V5ID0gbGluZS5zdWJzdHJpbmcoMCwgc3BhY2UpXG5cbiAgbGluZSA9IGxpbmUuc3Vic3RyaW5nKHNwYWNlICsgMSlcbiAgLy9jbGVhciBcImxldHRlclwiIGZpZWxkIGFzIGl0IGlzIG5vbi1zdGFuZGFyZCBhbmRcbiAgLy9yZXF1aXJlcyBhZGRpdGlvbmFsIGNvbXBsZXhpdHkgdG8gcGFyc2UgXCIgLyA9IHN5bWJvbHNcbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvbGV0dGVyPVtcXCdcXFwiXVxcUytbXFwnXFxcIl0vZ2ksICcnKSAgXG4gIGxpbmUgPSBsaW5lLnNwbGl0KFwiPVwiKVxuICBsaW5lID0gbGluZS5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50cmltKCkubWF0Y2goKC8oXCIuKj9cInxbXlwiXFxzXSspKyg/PVxccyp8XFxzKiQpL2cpKVxuICB9KVxuXG4gIHZhciBkYXRhID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGR0ID0gbGluZVtpXVxuICAgIGlmIChpID09PSAwKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBrZXk6IGR0WzBdLFxuICAgICAgICBkYXRhOiBcIlwiXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoaSA9PT0gbGluZS5sZW5ndGggLSAxKSB7XG4gICAgICBkYXRhW2RhdGEubGVuZ3RoIC0gMV0uZGF0YSA9IHBhcnNlRGF0YShkdFswXSlcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGEgPSBwYXJzZURhdGEoZHRbMF0pXG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBrZXk6IGR0WzFdLFxuICAgICAgICBkYXRhOiBcIlwiXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHZhciBvdXQgPSB7XG4gICAga2V5OiBrZXksXG4gICAgZGF0YToge31cbiAgfVxuXG4gIGRhdGEuZm9yRWFjaChmdW5jdGlvbih2KSB7XG4gICAgb3V0LmRhdGFbdi5rZXldID0gdi5kYXRhO1xuICB9KVxuXG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gcGFyc2VEYXRhKGRhdGEpIHtcbiAgaWYgKCFkYXRhIHx8IGRhdGEubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBcIlwiXG5cbiAgaWYgKGRhdGEuaW5kZXhPZignXCInKSA9PT0gMCB8fCBkYXRhLmluZGV4T2YoXCInXCIpID09PSAwKVxuICAgIHJldHVybiBkYXRhLnN1YnN0cmluZygxLCBkYXRhLmxlbmd0aCAtIDEpXG4gIGlmIChkYXRhLmluZGV4T2YoJywnKSAhPT0gLTEpXG4gICAgcmV0dXJuIHBhcnNlSW50TGlzdChkYXRhKVxuICByZXR1cm4gcGFyc2VJbnQoZGF0YSwgMTApXG59XG5cbmZ1bmN0aW9uIHBhcnNlSW50TGlzdChkYXRhKSB7XG4gIHJldHVybiBkYXRhLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKHZhbCkge1xuICAgIHJldHVybiBwYXJzZUludCh2YWwsIDEwKVxuICB9KVxufSIsInZhciBkdHlwZSA9IHJlcXVpcmUoJ2R0eXBlJylcbnZhciBhbkFycmF5ID0gcmVxdWlyZSgnYW4tYXJyYXknKVxudmFyIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJylcblxudmFyIENXID0gWzAsIDIsIDNdXG52YXIgQ0NXID0gWzIsIDEsIDNdXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUXVhZEVsZW1lbnRzKGFycmF5LCBvcHQpIHtcbiAgICAvL2lmIHVzZXIgZGlkbid0IHNwZWNpZnkgYW4gb3V0cHV0IGFycmF5XG4gICAgaWYgKCFhcnJheSB8fCAhKGFuQXJyYXkoYXJyYXkpIHx8IGlzQnVmZmVyKGFycmF5KSkpIHtcbiAgICAgICAgb3B0ID0gYXJyYXkgfHwge31cbiAgICAgICAgYXJyYXkgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHQgPT09ICdudW1iZXInKSAvL2JhY2t3YXJkcy1jb21wYXRpYmxlXG4gICAgICAgIG9wdCA9IHsgY291bnQ6IG9wdCB9XG4gICAgZWxzZVxuICAgICAgICBvcHQgPSBvcHQgfHwge31cblxuICAgIHZhciB0eXBlID0gdHlwZW9mIG9wdC50eXBlID09PSAnc3RyaW5nJyA/IG9wdC50eXBlIDogJ3VpbnQxNidcbiAgICB2YXIgY291bnQgPSB0eXBlb2Ygb3B0LmNvdW50ID09PSAnbnVtYmVyJyA/IG9wdC5jb3VudCA6IDFcbiAgICB2YXIgc3RhcnQgPSAob3B0LnN0YXJ0IHx8IDApIFxuXG4gICAgdmFyIGRpciA9IG9wdC5jbG9ja3dpc2UgIT09IGZhbHNlID8gQ1cgOiBDQ1csXG4gICAgICAgIGEgPSBkaXJbMF0sIFxuICAgICAgICBiID0gZGlyWzFdLFxuICAgICAgICBjID0gZGlyWzJdXG5cbiAgICB2YXIgbnVtSW5kaWNlcyA9IGNvdW50ICogNlxuXG4gICAgdmFyIGluZGljZXMgPSBhcnJheSB8fCBuZXcgKGR0eXBlKHR5cGUpKShudW1JbmRpY2VzKVxuICAgIGZvciAodmFyIGkgPSAwLCBqID0gMDsgaSA8IG51bUluZGljZXM7IGkgKz0gNiwgaiArPSA0KSB7XG4gICAgICAgIHZhciB4ID0gaSArIHN0YXJ0XG4gICAgICAgIGluZGljZXNbeCArIDBdID0gaiArIDBcbiAgICAgICAgaW5kaWNlc1t4ICsgMV0gPSBqICsgMVxuICAgICAgICBpbmRpY2VzW3ggKyAyXSA9IGogKyAyXG4gICAgICAgIGluZGljZXNbeCArIDNdID0gaiArIGFcbiAgICAgICAgaW5kaWNlc1t4ICsgNF0gPSBqICsgYlxuICAgICAgICBpbmRpY2VzW3ggKyA1XSA9IGogKyBjXG4gICAgfVxuICAgIHJldHVybiBpbmRpY2VzXG59IiwidmFyIGNyZWF0ZUxheW91dCA9IHJlcXVpcmUoJ2xheW91dC1ibWZvbnQtdGV4dCcpXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG52YXIgY3JlYXRlSW5kaWNlcyA9IHJlcXVpcmUoJ3F1YWQtaW5kaWNlcycpXG52YXIgYnVmZmVyID0gcmVxdWlyZSgndGhyZWUtYnVmZmVyLXZlcnRleC1kYXRhJylcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJylcblxudmFyIHZlcnRpY2VzID0gcmVxdWlyZSgnLi9saWIvdmVydGljZXMnKVxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi9saWIvdXRpbHMnKVxuXG52YXIgQmFzZSA9IFRIUkVFLkJ1ZmZlckdlb21ldHJ5XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlVGV4dEdlb21ldHJ5IChvcHQpIHtcbiAgcmV0dXJuIG5ldyBUZXh0R2VvbWV0cnkob3B0KVxufVxuXG5mdW5jdGlvbiBUZXh0R2VvbWV0cnkgKG9wdCkge1xuICBCYXNlLmNhbGwodGhpcylcblxuICBpZiAodHlwZW9mIG9wdCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHQgPSB7IHRleHQ6IG9wdCB9XG4gIH1cblxuICAvLyB1c2UgdGhlc2UgYXMgZGVmYXVsdCB2YWx1ZXMgZm9yIGFueSBzdWJzZXF1ZW50XG4gIC8vIGNhbGxzIHRvIHVwZGF0ZSgpXG4gIHRoaXMuX29wdCA9IGFzc2lnbih7fSwgb3B0KVxuXG4gIC8vIGFsc28gZG8gYW4gaW5pdGlhbCBzZXR1cC4uLlxuICBpZiAob3B0KSB0aGlzLnVwZGF0ZShvcHQpXG59XG5cbmluaGVyaXRzKFRleHRHZW9tZXRyeSwgQmFzZSlcblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAob3B0KSB7XG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJykge1xuICAgIG9wdCA9IHsgdGV4dDogb3B0IH1cbiAgfVxuXG4gIC8vIHVzZSBjb25zdHJ1Y3RvciBkZWZhdWx0c1xuICBvcHQgPSBhc3NpZ24oe30sIHRoaXMuX29wdCwgb3B0KVxuXG4gIGlmICghb3B0LmZvbnQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHNwZWNpZnkgYSB7IGZvbnQgfSBpbiBvcHRpb25zJylcbiAgfVxuXG4gIHRoaXMubGF5b3V0ID0gY3JlYXRlTGF5b3V0KG9wdClcblxuICAvLyBnZXQgdmVjMiB0ZXhjb29yZHNcbiAgdmFyIGZsaXBZID0gb3B0LmZsaXBZICE9PSBmYWxzZVxuXG4gIC8vIHRoZSBkZXNpcmVkIEJNRm9udCBkYXRhXG4gIHZhciBmb250ID0gb3B0LmZvbnRcblxuICAvLyBkZXRlcm1pbmUgdGV4dHVyZSBzaXplIGZyb20gZm9udCBmaWxlXG4gIHZhciB0ZXhXaWR0aCA9IGZvbnQuY29tbW9uLnNjYWxlV1xuICB2YXIgdGV4SGVpZ2h0ID0gZm9udC5jb21tb24uc2NhbGVIXG5cbiAgLy8gZ2V0IHZpc2libGUgZ2x5cGhzXG4gIHZhciBnbHlwaHMgPSB0aGlzLmxheW91dC5nbHlwaHMuZmlsdGVyKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG4gICAgcmV0dXJuIGJpdG1hcC53aWR0aCAqIGJpdG1hcC5oZWlnaHQgPiAwXG4gIH0pXG5cbiAgLy8gcHJvdmlkZSB2aXNpYmxlIGdseXBocyBmb3IgY29udmVuaWVuY2VcbiAgdGhpcy52aXNpYmxlR2x5cGhzID0gZ2x5cGhzXG5cbiAgLy8gZ2V0IGNvbW1vbiB2ZXJ0ZXggZGF0YVxuICB2YXIgcG9zaXRpb25zID0gdmVydGljZXMucG9zaXRpb25zKGdseXBocylcbiAgdmFyIHV2cyA9IHZlcnRpY2VzLnV2cyhnbHlwaHMsIHRleFdpZHRoLCB0ZXhIZWlnaHQsIGZsaXBZKVxuICB2YXIgaW5kaWNlcyA9IGNyZWF0ZUluZGljZXMoe1xuICAgIGNsb2Nrd2lzZTogdHJ1ZSxcbiAgICB0eXBlOiAndWludDE2JyxcbiAgICBjb3VudDogZ2x5cGhzLmxlbmd0aFxuICB9KVxuXG4gIC8vIHVwZGF0ZSB2ZXJ0ZXggZGF0YVxuICBidWZmZXIuaW5kZXgodGhpcywgaW5kaWNlcywgMSwgJ3VpbnQxNicpXG4gIGJ1ZmZlci5hdHRyKHRoaXMsICdwb3NpdGlvbicsIHBvc2l0aW9ucywgMilcbiAgYnVmZmVyLmF0dHIodGhpcywgJ3V2JywgdXZzLCAyKVxuXG4gIC8vIHVwZGF0ZSBtdWx0aXBhZ2UgZGF0YVxuICBpZiAoIW9wdC5tdWx0aXBhZ2UgJiYgJ3BhZ2UnIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIC8vIGRpc2FibGUgbXVsdGlwYWdlIHJlbmRlcmluZ1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdwYWdlJylcbiAgfSBlbHNlIGlmIChvcHQubXVsdGlwYWdlKSB7XG4gICAgdmFyIHBhZ2VzID0gdmVydGljZXMucGFnZXMoZ2x5cGhzKVxuICAgIC8vIGVuYWJsZSBtdWx0aXBhZ2UgcmVuZGVyaW5nXG4gICAgYnVmZmVyLmF0dHIodGhpcywgJ3BhZ2UnLCBwYWdlcywgMSlcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVCb3VuZGluZ1NwaGVyZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYm91bmRpbmdTcGhlcmUgPT09IG51bGwpIHtcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlID0gbmV3IFRIUkVFLlNwaGVyZSgpXG4gIH1cblxuICB2YXIgcG9zaXRpb25zID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5XG4gIHZhciBpdGVtU2l6ZSA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5pdGVtU2l6ZVxuICBpZiAoIXBvc2l0aW9ucyB8fCAhaXRlbVNpemUgfHwgcG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlLnJhZGl1cyA9IDBcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlLmNlbnRlci5zZXQoMCwgMCwgMClcbiAgICByZXR1cm5cbiAgfVxuICB1dGlscy5jb21wdXRlU3BoZXJlKHBvc2l0aW9ucywgdGhpcy5ib3VuZGluZ1NwaGVyZSlcbiAgaWYgKGlzTmFOKHRoaXMuYm91bmRpbmdTcGhlcmUucmFkaXVzKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1RIUkVFLkJ1ZmZlckdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpOiAnICtcbiAgICAgICdDb21wdXRlZCByYWRpdXMgaXMgTmFOLiBUaGUgJyArXG4gICAgICAnXCJwb3NpdGlvblwiIGF0dHJpYnV0ZSBpcyBsaWtlbHkgdG8gaGF2ZSBOYU4gdmFsdWVzLicpXG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS5jb21wdXRlQm91bmRpbmdCb3ggPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmJvdW5kaW5nQm94ID09PSBudWxsKSB7XG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IG5ldyBUSFJFRS5Cb3gzKClcbiAgfVxuXG4gIHZhciBiYm94ID0gdGhpcy5ib3VuZGluZ0JveFxuICB2YXIgcG9zaXRpb25zID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5XG4gIHZhciBpdGVtU2l6ZSA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5pdGVtU2l6ZVxuICBpZiAoIXBvc2l0aW9ucyB8fCAhaXRlbVNpemUgfHwgcG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICBiYm94Lm1ha2VFbXB0eSgpXG4gICAgcmV0dXJuXG4gIH1cbiAgdXRpbHMuY29tcHV0ZUJveChwb3NpdGlvbnMsIGJib3gpXG59XG4iLCJ2YXIgaXRlbVNpemUgPSAyXG52YXIgYm94ID0geyBtaW46IFswLCAwXSwgbWF4OiBbMCwgMF0gfVxuXG5mdW5jdGlvbiBib3VuZHMgKHBvc2l0aW9ucykge1xuICB2YXIgY291bnQgPSBwb3NpdGlvbnMubGVuZ3RoIC8gaXRlbVNpemVcbiAgYm94Lm1pblswXSA9IHBvc2l0aW9uc1swXVxuICBib3gubWluWzFdID0gcG9zaXRpb25zWzFdXG4gIGJveC5tYXhbMF0gPSBwb3NpdGlvbnNbMF1cbiAgYm94Lm1heFsxXSA9IHBvc2l0aW9uc1sxXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIHZhciB4ID0gcG9zaXRpb25zW2kgKiBpdGVtU2l6ZSArIDBdXG4gICAgdmFyIHkgPSBwb3NpdGlvbnNbaSAqIGl0ZW1TaXplICsgMV1cbiAgICBib3gubWluWzBdID0gTWF0aC5taW4oeCwgYm94Lm1pblswXSlcbiAgICBib3gubWluWzFdID0gTWF0aC5taW4oeSwgYm94Lm1pblsxXSlcbiAgICBib3gubWF4WzBdID0gTWF0aC5tYXgoeCwgYm94Lm1heFswXSlcbiAgICBib3gubWF4WzFdID0gTWF0aC5tYXgoeSwgYm94Lm1heFsxXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlQm94ID0gZnVuY3Rpb24gKHBvc2l0aW9ucywgb3V0cHV0KSB7XG4gIGJvdW5kcyhwb3NpdGlvbnMpXG4gIG91dHB1dC5taW4uc2V0KGJveC5taW5bMF0sIGJveC5taW5bMV0sIDApXG4gIG91dHB1dC5tYXguc2V0KGJveC5tYXhbMF0sIGJveC5tYXhbMV0sIDApXG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbXB1dGVTcGhlcmUgPSBmdW5jdGlvbiAocG9zaXRpb25zLCBvdXRwdXQpIHtcbiAgYm91bmRzKHBvc2l0aW9ucylcbiAgdmFyIG1pblggPSBib3gubWluWzBdXG4gIHZhciBtaW5ZID0gYm94Lm1pblsxXVxuICB2YXIgbWF4WCA9IGJveC5tYXhbMF1cbiAgdmFyIG1heFkgPSBib3gubWF4WzFdXG4gIHZhciB3aWR0aCA9IG1heFggLSBtaW5YXG4gIHZhciBoZWlnaHQgPSBtYXhZIC0gbWluWVxuICB2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHdpZHRoICogd2lkdGggKyBoZWlnaHQgKiBoZWlnaHQpXG4gIG91dHB1dC5jZW50ZXIuc2V0KG1pblggKyB3aWR0aCAvIDIsIG1pblkgKyBoZWlnaHQgLyAyLCAwKVxuICBvdXRwdXQucmFkaXVzID0gbGVuZ3RoIC8gMlxufVxuIiwibW9kdWxlLmV4cG9ydHMucGFnZXMgPSBmdW5jdGlvbiBwYWdlcyAoZ2x5cGhzKSB7XG4gIHZhciBwYWdlcyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAxKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGlkID0gZ2x5cGguZGF0YS5wYWdlIHx8IDBcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgfSlcbiAgcmV0dXJuIHBhZ2VzXG59XG5cbm1vZHVsZS5leHBvcnRzLnV2cyA9IGZ1bmN0aW9uIHV2cyAoZ2x5cGhzLCB0ZXhXaWR0aCwgdGV4SGVpZ2h0LCBmbGlwWSkge1xuICB2YXIgdXZzID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDIpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuICAgIHZhciBidyA9IChiaXRtYXAueCArIGJpdG1hcC53aWR0aClcbiAgICB2YXIgYmggPSAoYml0bWFwLnkgKyBiaXRtYXAuaGVpZ2h0KVxuXG4gICAgLy8gdG9wIGxlZnQgcG9zaXRpb25cbiAgICB2YXIgdTAgPSBiaXRtYXAueCAvIHRleFdpZHRoXG4gICAgdmFyIHYxID0gYml0bWFwLnkgLyB0ZXhIZWlnaHRcbiAgICB2YXIgdTEgPSBidyAvIHRleFdpZHRoXG4gICAgdmFyIHYwID0gYmggLyB0ZXhIZWlnaHRcblxuICAgIGlmIChmbGlwWSkge1xuICAgICAgdjEgPSAodGV4SGVpZ2h0IC0gYml0bWFwLnkpIC8gdGV4SGVpZ2h0XG4gICAgICB2MCA9ICh0ZXhIZWlnaHQgLSBiaCkgLyB0ZXhIZWlnaHRcbiAgICB9XG5cbiAgICAvLyBCTFxuICAgIHV2c1tpKytdID0gdTBcbiAgICB1dnNbaSsrXSA9IHYxXG4gICAgLy8gVExcbiAgICB1dnNbaSsrXSA9IHUwXG4gICAgdXZzW2krK10gPSB2MFxuICAgIC8vIFRSXG4gICAgdXZzW2krK10gPSB1MVxuICAgIHV2c1tpKytdID0gdjBcbiAgICAvLyBCUlxuICAgIHV2c1tpKytdID0gdTFcbiAgICB1dnNbaSsrXSA9IHYxXG4gIH0pXG4gIHJldHVybiB1dnNcbn1cblxubW9kdWxlLmV4cG9ydHMucG9zaXRpb25zID0gZnVuY3Rpb24gcG9zaXRpb25zIChnbHlwaHMpIHtcbiAgdmFyIHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAyKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcblxuICAgIC8vIGJvdHRvbSBsZWZ0IHBvc2l0aW9uXG4gICAgdmFyIHggPSBnbHlwaC5wb3NpdGlvblswXSArIGJpdG1hcC54b2Zmc2V0XG4gICAgdmFyIHkgPSBnbHlwaC5wb3NpdGlvblsxXSArIGJpdG1hcC55b2Zmc2V0XG5cbiAgICAvLyBxdWFkIHNpemVcbiAgICB2YXIgdyA9IGJpdG1hcC53aWR0aFxuICAgIHZhciBoID0gYml0bWFwLmhlaWdodFxuXG4gICAgLy8gQkxcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHhcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHlcbiAgICAvLyBUTFxuICAgIHBvc2l0aW9uc1tpKytdID0geFxuICAgIHBvc2l0aW9uc1tpKytdID0geSArIGhcbiAgICAvLyBUUlxuICAgIHBvc2l0aW9uc1tpKytdID0geCArIHdcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHkgKyBoXG4gICAgLy8gQlJcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHggKyB3XG4gICAgcG9zaXRpb25zW2krK10gPSB5XG4gIH0pXG4gIHJldHVybiBwb3NpdGlvbnNcbn1cbiIsInZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTREZTaGFkZXIgKG9wdCkge1xuICBvcHQgPSBvcHQgfHwge31cbiAgdmFyIG9wYWNpdHkgPSB0eXBlb2Ygb3B0Lm9wYWNpdHkgPT09ICdudW1iZXInID8gb3B0Lm9wYWNpdHkgOiAxXG4gIHZhciBhbHBoYVRlc3QgPSB0eXBlb2Ygb3B0LmFscGhhVGVzdCA9PT0gJ251bWJlcicgPyBvcHQuYWxwaGFUZXN0IDogMC4wMDAxXG4gIHZhciBwcmVjaXNpb24gPSBvcHQucHJlY2lzaW9uIHx8ICdoaWdocCdcbiAgdmFyIGNvbG9yID0gb3B0LmNvbG9yXG4gIHZhciBtYXAgPSBvcHQubWFwXG5cbiAgLy8gcmVtb3ZlIHRvIHNhdGlzZnkgcjczXG4gIGRlbGV0ZSBvcHQubWFwXG4gIGRlbGV0ZSBvcHQuY29sb3JcbiAgZGVsZXRlIG9wdC5wcmVjaXNpb25cbiAgZGVsZXRlIG9wdC5vcGFjaXR5XG5cbiAgcmV0dXJuIGFzc2lnbih7XG4gICAgdW5pZm9ybXM6IHtcbiAgICAgIG9wYWNpdHk6IHsgdHlwZTogJ2YnLCB2YWx1ZTogb3BhY2l0eSB9LFxuICAgICAgbWFwOiB7IHR5cGU6ICd0JywgdmFsdWU6IG1hcCB8fCBuZXcgVEhSRUUuVGV4dHVyZSgpIH0sXG4gICAgICBjb2xvcjogeyB0eXBlOiAnYycsIHZhbHVlOiBuZXcgVEhSRUUuQ29sb3IoY29sb3IpIH1cbiAgICB9LFxuICAgIHZlcnRleFNoYWRlcjogW1xuICAgICAgJ2F0dHJpYnV0ZSB2ZWMyIHV2OycsXG4gICAgICAnYXR0cmlidXRlIHZlYzQgcG9zaXRpb247JyxcbiAgICAgICd1bmlmb3JtIG1hdDQgcHJvamVjdGlvbk1hdHJpeDsnLFxuICAgICAgJ3VuaWZvcm0gbWF0NCBtb2RlbFZpZXdNYXRyaXg7JyxcbiAgICAgICd2YXJ5aW5nIHZlYzIgdlV2OycsXG4gICAgICAndm9pZCBtYWluKCkgeycsXG4gICAgICAndlV2ID0gdXY7JyxcbiAgICAgICdnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiBwb3NpdGlvbjsnLFxuICAgICAgJ30nXG4gICAgXS5qb2luKCdcXG4nKSxcbiAgICBmcmFnbWVudFNoYWRlcjogW1xuICAgICAgJyNpZmRlZiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgJyNleHRlbnNpb24gR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzIDogZW5hYmxlJyxcbiAgICAgICcjZW5kaWYnLFxuICAgICAgJ3ByZWNpc2lvbiAnICsgcHJlY2lzaW9uICsgJyBmbG9hdDsnLFxuICAgICAgJ3VuaWZvcm0gZmxvYXQgb3BhY2l0eTsnLFxuICAgICAgJ3VuaWZvcm0gdmVjMyBjb2xvcjsnLFxuICAgICAgJ3VuaWZvcm0gc2FtcGxlcjJEIG1hcDsnLFxuICAgICAgJ3ZhcnlpbmcgdmVjMiB2VXY7JyxcblxuICAgICAgJ2Zsb2F0IGFhc3RlcChmbG9hdCB2YWx1ZSkgeycsXG4gICAgICAnICAjaWZkZWYgR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcbiAgICAgICcgICAgZmxvYXQgYWZ3aWR0aCA9IGxlbmd0aCh2ZWMyKGRGZHgodmFsdWUpLCBkRmR5KHZhbHVlKSkpICogMC43MDcxMDY3ODExODY1NDc1NzsnLFxuICAgICAgJyAgI2Vsc2UnLFxuICAgICAgJyAgICBmbG9hdCBhZndpZHRoID0gKDEuMCAvIDMyLjApICogKDEuNDE0MjEzNTYyMzczMDk1MSAvICgyLjAgKiBnbF9GcmFnQ29vcmQudykpOycsXG4gICAgICAnICAjZW5kaWYnLFxuICAgICAgJyAgcmV0dXJuIHNtb290aHN0ZXAoMC41IC0gYWZ3aWR0aCwgMC41ICsgYWZ3aWR0aCwgdmFsdWUpOycsXG4gICAgICAnfScsXG5cbiAgICAgICd2b2lkIG1haW4oKSB7JyxcbiAgICAgICcgIHZlYzQgdGV4Q29sb3IgPSB0ZXh0dXJlMkQobWFwLCB2VXYpOycsXG4gICAgICAnICBmbG9hdCBhbHBoYSA9IGFhc3RlcCh0ZXhDb2xvci5hKTsnLFxuICAgICAgJyAgZ2xfRnJhZ0NvbG9yID0gdmVjNChjb2xvciwgb3BhY2l0eSAqIGFscGhhKTsnLFxuICAgICAgYWxwaGFUZXN0ID09PSAwXG4gICAgICAgID8gJydcbiAgICAgICAgOiAnICBpZiAoZ2xfRnJhZ0NvbG9yLmEgPCAnICsgYWxwaGFUZXN0ICsgJykgZGlzY2FyZDsnLFxuICAgICAgJ30nXG4gICAgXS5qb2luKCdcXG4nKVxuICB9LCBvcHQpXG59XG4iLCJ2YXIgZmxhdHRlbiA9IHJlcXVpcmUoJ2ZsYXR0ZW4tdmVydGV4LWRhdGEnKVxudmFyIHdhcm5lZCA9IGZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cy5hdHRyID0gc2V0QXR0cmlidXRlXG5tb2R1bGUuZXhwb3J0cy5pbmRleCA9IHNldEluZGV4XG5cbmZ1bmN0aW9uIHNldEluZGV4IChnZW9tZXRyeSwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGlmICh0eXBlb2YgaXRlbVNpemUgIT09ICdudW1iZXInKSBpdGVtU2l6ZSA9IDFcbiAgaWYgKHR5cGVvZiBkdHlwZSAhPT0gJ3N0cmluZycpIGR0eXBlID0gJ3VpbnQxNidcblxuICB2YXIgaXNSNjkgPSAhZ2VvbWV0cnkuaW5kZXggJiYgdHlwZW9mIGdlb21ldHJ5LnNldEluZGV4ICE9PSAnZnVuY3Rpb24nXG4gIHZhciBhdHRyaWIgPSBpc1I2OSA/IGdlb21ldHJ5LmdldEF0dHJpYnV0ZSgnaW5kZXgnKSA6IGdlb21ldHJ5LmluZGV4XG4gIHZhciBuZXdBdHRyaWIgPSB1cGRhdGVBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpXG4gIGlmIChuZXdBdHRyaWIpIHtcbiAgICBpZiAoaXNSNjkpIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSgnaW5kZXgnLCBuZXdBdHRyaWIpXG4gICAgZWxzZSBnZW9tZXRyeS5pbmRleCA9IG5ld0F0dHJpYlxuICB9XG59XG5cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZSAoZ2VvbWV0cnksIGtleSwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGlmICh0eXBlb2YgaXRlbVNpemUgIT09ICdudW1iZXInKSBpdGVtU2l6ZSA9IDNcbiAgaWYgKHR5cGVvZiBkdHlwZSAhPT0gJ3N0cmluZycpIGR0eXBlID0gJ2Zsb2F0MzInXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmXG4gICAgQXJyYXkuaXNBcnJheShkYXRhWzBdKSAmJlxuICAgIGRhdGFbMF0ubGVuZ3RoICE9PSBpdGVtU2l6ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTmVzdGVkIHZlcnRleCBhcnJheSBoYXMgdW5leHBlY3RlZCBzaXplOyBleHBlY3RlZCAnICtcbiAgICAgIGl0ZW1TaXplICsgJyBidXQgZm91bmQgJyArIGRhdGFbMF0ubGVuZ3RoKVxuICB9XG5cbiAgdmFyIGF0dHJpYiA9IGdlb21ldHJ5LmdldEF0dHJpYnV0ZShrZXkpXG4gIHZhciBuZXdBdHRyaWIgPSB1cGRhdGVBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpXG4gIGlmIChuZXdBdHRyaWIpIHtcbiAgICBnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoa2V5LCBuZXdBdHRyaWIpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQXR0cmlidXRlIChhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBkYXRhID0gZGF0YSB8fCBbXVxuICBpZiAoIWF0dHJpYiB8fCByZWJ1aWxkQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUpKSB7XG4gICAgLy8gY3JlYXRlIGEgbmV3IGFycmF5IHdpdGggZGVzaXJlZCB0eXBlXG4gICAgZGF0YSA9IGZsYXR0ZW4oZGF0YSwgZHR5cGUpXG4gICAgaWYgKGF0dHJpYiAmJiAhd2FybmVkKSB7XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS53YXJuKFtcbiAgICAgICAgJ0EgV2ViR0wgYnVmZmVyIGlzIGJlaW5nIHVwZGF0ZWQgd2l0aCBhIG5ldyBzaXplIG9yIGl0ZW1TaXplLCAnLFxuICAgICAgICAnaG93ZXZlciBUaHJlZUpTIG9ubHkgc3VwcG9ydHMgZml4ZWQtc2l6ZSBidWZmZXJzLlxcblRoZSBvbGQgYnVmZmVyIG1heSAnLFxuICAgICAgICAnc3RpbGwgYmUga2VwdCBpbiBtZW1vcnkuXFxuJyxcbiAgICAgICAgJ1RvIGF2b2lkIG1lbW9yeSBsZWFrcywgaXQgaXMgcmVjb21tZW5kZWQgdGhhdCB5b3UgZGlzcG9zZSAnLFxuICAgICAgICAneW91ciBnZW9tZXRyaWVzIGFuZCBjcmVhdGUgbmV3IG9uZXMsIG9yIHN1cHBvcnQgdGhlIGZvbGxvd2luZyBQUiBpbiBUaHJlZUpTOlxcbicsXG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL3B1bGwvOTYzMSdcbiAgICAgIF0uam9pbignJykpO1xuICAgIH1cbiAgICBhdHRyaWIgPSBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKGRhdGEsIGl0ZW1TaXplKVxuICAgIGF0dHJpYi5uZWVkc1VwZGF0ZSA9IHRydWVcbiAgICByZXR1cm4gYXR0cmliXG4gIH0gZWxzZSB7XG4gICAgLy8gY29weSBkYXRhIGludG8gdGhlIGV4aXN0aW5nIGFycmF5XG4gICAgZmxhdHRlbihkYXRhLCBhdHRyaWIuYXJyYXkpXG4gICAgYXR0cmliLm5lZWRzVXBkYXRlID0gdHJ1ZVxuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuLy8gVGVzdCB3aGV0aGVyIHRoZSBhdHRyaWJ1dGUgbmVlZHMgdG8gYmUgcmUtY3JlYXRlZCxcbi8vIHJldHVybnMgZmFsc2UgaWYgd2UgY2FuIHJlLXVzZSBpdCBhcy1pcy5cbmZ1bmN0aW9uIHJlYnVpbGRBdHRyaWJ1dGUgKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUpIHtcbiAgaWYgKGF0dHJpYi5pdGVtU2l6ZSAhPT0gaXRlbVNpemUpIHJldHVybiB0cnVlXG4gIGlmICghYXR0cmliLmFycmF5KSByZXR1cm4gdHJ1ZVxuICB2YXIgYXR0cmliTGVuZ3RoID0gYXR0cmliLmFycmF5Lmxlbmd0aFxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBBcnJheS5pc0FycmF5KGRhdGFbMF0pKSB7XG4gICAgLy8gWyBbIHgsIHksIHogXSBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGggKiBpdGVtU2l6ZVxuICB9IGVsc2Uge1xuICAgIC8vIFsgeCwgeSwgeiBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGhcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cbiIsInZhciBuZXdsaW5lID0gL1xcbi9cbnZhciBuZXdsaW5lQ2hhciA9ICdcXG4nXG52YXIgd2hpdGVzcGFjZSA9IC9cXHMvXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XG4gICAgdmFyIGxpbmVzID0gbW9kdWxlLmV4cG9ydHMubGluZXModGV4dCwgb3B0KVxuICAgIHJldHVybiBsaW5lcy5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICByZXR1cm4gdGV4dC5zdWJzdHJpbmcobGluZS5zdGFydCwgbGluZS5lbmQpXG4gICAgfSkuam9pbignXFxuJylcbn1cblxubW9kdWxlLmV4cG9ydHMubGluZXMgPSBmdW5jdGlvbiB3b3Jkd3JhcCh0ZXh0LCBvcHQpIHtcbiAgICBvcHQgPSBvcHR8fHt9XG5cbiAgICAvL3plcm8gd2lkdGggcmVzdWx0cyBpbiBub3RoaW5nIHZpc2libGVcbiAgICBpZiAob3B0LndpZHRoID09PSAwICYmIG9wdC5tb2RlICE9PSAnbm93cmFwJykgXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgdGV4dCA9IHRleHR8fCcnXG4gICAgdmFyIHdpZHRoID0gdHlwZW9mIG9wdC53aWR0aCA9PT0gJ251bWJlcicgPyBvcHQud2lkdGggOiBOdW1iZXIuTUFYX1ZBTFVFXG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5tYXgoMCwgb3B0LnN0YXJ0fHwwKVxuICAgIHZhciBlbmQgPSB0eXBlb2Ygb3B0LmVuZCA9PT0gJ251bWJlcicgPyBvcHQuZW5kIDogdGV4dC5sZW5ndGhcbiAgICB2YXIgbW9kZSA9IG9wdC5tb2RlXG5cbiAgICB2YXIgbWVhc3VyZSA9IG9wdC5tZWFzdXJlIHx8IG1vbm9zcGFjZVxuICAgIGlmIChtb2RlID09PSAncHJlJylcbiAgICAgICAgcmV0dXJuIHByZShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aClcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBncmVlZHkobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgsIG1vZGUpXG59XG5cbmZ1bmN0aW9uIGlkeE9mKHRleHQsIGNociwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBpZHggPSB0ZXh0LmluZGV4T2YoY2hyLCBzdGFydClcbiAgICBpZiAoaWR4ID09PSAtMSB8fCBpZHggPiBlbmQpXG4gICAgICAgIHJldHVybiBlbmRcbiAgICByZXR1cm4gaWR4XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjaHIpIHtcbiAgICByZXR1cm4gd2hpdGVzcGFjZS50ZXN0KGNocilcbn1cblxuZnVuY3Rpb24gcHJlKG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGxpbmVzID0gW11cbiAgICB2YXIgbGluZVN0YXJ0ID0gc3RhcnRcbiAgICBmb3IgKHZhciBpPXN0YXJ0OyBpPGVuZCAmJiBpPHRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNociA9IHRleHQuY2hhckF0KGkpXG4gICAgICAgIHZhciBpc05ld2xpbmUgPSBuZXdsaW5lLnRlc3QoY2hyKVxuXG4gICAgICAgIC8vSWYgd2UndmUgcmVhY2hlZCBhIG5ld2xpbmUsIHRoZW4gc3RlcCBkb3duIGEgbGluZVxuICAgICAgICAvL09yIGlmIHdlJ3ZlIHJlYWNoZWQgdGhlIEVPRlxuICAgICAgICBpZiAoaXNOZXdsaW5lIHx8IGk9PT1lbmQtMSkge1xuICAgICAgICAgICAgdmFyIGxpbmVFbmQgPSBpc05ld2xpbmUgPyBpIDogaSsxXG4gICAgICAgICAgICB2YXIgbWVhc3VyZWQgPSBtZWFzdXJlKHRleHQsIGxpbmVTdGFydCwgbGluZUVuZCwgd2lkdGgpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKG1lYXN1cmVkKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsaW5lU3RhcnQgPSBpKzFcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGluZXNcbn1cblxuZnVuY3Rpb24gZ3JlZWR5KG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoLCBtb2RlKSB7XG4gICAgLy9BIGdyZWVkeSB3b3JkIHdyYXBwZXIgYmFzZWQgb24gTGliR0RYIGFsZ29yaXRobVxuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2xpYmdkeC9saWJnZHgvYmxvYi9tYXN0ZXIvZ2R4L3NyYy9jb20vYmFkbG9naWMvZ2R4L2dyYXBoaWNzL2cyZC9CaXRtYXBGb250Q2FjaGUuamF2YVxuICAgIHZhciBsaW5lcyA9IFtdXG5cbiAgICB2YXIgdGVzdFdpZHRoID0gd2lkdGhcbiAgICAvL2lmICdub3dyYXAnIGlzIHNwZWNpZmllZCwgd2Ugb25seSB3cmFwIG9uIG5ld2xpbmUgY2hhcnNcbiAgICBpZiAobW9kZSA9PT0gJ25vd3JhcCcpXG4gICAgICAgIHRlc3RXaWR0aCA9IE51bWJlci5NQVhfVkFMVUVcblxuICAgIHdoaWxlIChzdGFydCA8IGVuZCAmJiBzdGFydCA8IHRleHQubGVuZ3RoKSB7XG4gICAgICAgIC8vZ2V0IG5leHQgbmV3bGluZSBwb3NpdGlvblxuICAgICAgICB2YXIgbmV3TGluZSA9IGlkeE9mKHRleHQsIG5ld2xpbmVDaGFyLCBzdGFydCwgZW5kKVxuXG4gICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgc3RhcnQgb2YgbGluZVxuICAgICAgICB3aGlsZSAoc3RhcnQgPCBuZXdMaW5lKSB7XG4gICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZSggdGV4dC5jaGFyQXQoc3RhcnQpICkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIHN0YXJ0KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZGV0ZXJtaW5lIHZpc2libGUgIyBvZiBnbHlwaHMgZm9yIHRoZSBhdmFpbGFibGUgd2lkdGhcbiAgICAgICAgdmFyIG1lYXN1cmVkID0gbWVhc3VyZSh0ZXh0LCBzdGFydCwgbmV3TGluZSwgdGVzdFdpZHRoKVxuXG4gICAgICAgIHZhciBsaW5lRW5kID0gc3RhcnQgKyAobWVhc3VyZWQuZW5kLW1lYXN1cmVkLnN0YXJ0KVxuICAgICAgICB2YXIgbmV4dFN0YXJ0ID0gbGluZUVuZCArIG5ld2xpbmVDaGFyLmxlbmd0aFxuXG4gICAgICAgIC8vaWYgd2UgaGFkIHRvIGN1dCB0aGUgbGluZSBiZWZvcmUgdGhlIG5leHQgbmV3bGluZS4uLlxuICAgICAgICBpZiAobGluZUVuZCA8IG5ld0xpbmUpIHtcbiAgICAgICAgICAgIC8vZmluZCBjaGFyIHRvIGJyZWFrIG9uXG4gICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzV2hpdGVzcGFjZSh0ZXh0LmNoYXJBdChsaW5lRW5kKSkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgbGluZUVuZC0tXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGluZUVuZCA9PT0gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFN0YXJ0ID4gc3RhcnQgKyBuZXdsaW5lQ2hhci5sZW5ndGgpIG5leHRTdGFydC0tXG4gICAgICAgICAgICAgICAgbGluZUVuZCA9IG5leHRTdGFydCAvLyBJZiBubyBjaGFyYWN0ZXJzIHRvIGJyZWFrLCBzaG93IGFsbC5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dFN0YXJ0ID0gbGluZUVuZFxuICAgICAgICAgICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgZW5kIG9mIGxpbmVcbiAgICAgICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNXaGl0ZXNwYWNlKHRleHQuY2hhckF0KGxpbmVFbmQgLSBuZXdsaW5lQ2hhci5sZW5ndGgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGxpbmVFbmQtLVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobGluZUVuZCA+PSBzdGFydCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1lYXN1cmUodGV4dCwgc3RhcnQsIGxpbmVFbmQsIHRlc3RXaWR0aClcbiAgICAgICAgICAgIGxpbmVzLnB1c2gocmVzdWx0KVxuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ID0gbmV4dFN0YXJ0XG4gICAgfVxuICAgIHJldHVybiBsaW5lc1xufVxuXG4vL2RldGVybWluZXMgdGhlIHZpc2libGUgbnVtYmVyIG9mIGdseXBocyB3aXRoaW4gYSBnaXZlbiB3aWR0aFxuZnVuY3Rpb24gbW9ub3NwYWNlKHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGdseXBocyA9IE1hdGgubWluKHdpZHRoLCBlbmQtc3RhcnQpXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICBlbmQ6IHN0YXJ0K2dseXBoc1xuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIl19
