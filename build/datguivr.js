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

  var material = new THREE.MeshBasicMaterial({ color: Colors.BUTTON_COLOR });
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
    } else {
      material.color.setHex(Colors.BUTTON_COLOR);
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

},{"../thirdparty/SubdivisionModifier":17,"./colors":3,"./grab":7,"./interaction":10,"./layout":11,"./sharedmaterials":14,"./textlabel":16}],2:[function(require,module,exports){
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
  var material = new THREE.MeshBasicMaterial({ color: Colors.DEFAULT_COLOR });
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
    } else {
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

},{"./colors":3,"./grab":7,"./interaction":10,"./layout":11,"./sharedmaterials":14,"./textlabel":16}],3:[function(require,module,exports){
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

  var downArrow = Layout.createDownArrow();
  Colors.colorizeGeometry(downArrow.geometry, Colors.DROPDOWN_FG_COLOR);
  downArrow.position.set(DROPDOWN_WIDTH - 0.04, 0, depth * 1.01);
  selectedLabel.add(downArrow);

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

},{"./colors":3,"./grab":7,"./interaction":10,"./layout":11,"./sharedmaterials":14,"./textlabel":16}],5:[function(require,module,exports){
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

var _graphic = require('./graphic');

var Graphic = _interopRequireWildcard(_graphic);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

var _palette = require('./palette');

var Palette = _interopRequireWildcard(_palette);

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


  var width = Layout.FOLDER_WIDTH;
  var depth = Layout.PANEL_DEPTH;

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

  function addImpl(o) {
    addOriginal.call(group, o);
  }

  addImpl(collapseGroup);

  var panel = Layout.createPanel(width, Layout.FOLDER_HEIGHT, depth);
  addImpl(panel);

  var descriptorLabel = textCreator.create(name);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN * 1.5;
  descriptorLabel.position.y = -0.03;
  descriptorLabel.position.z = depth;
  panel.add(descriptorLabel);

  var downArrow = Layout.createDownArrow();
  Colors.colorizeGeometry(downArrow.geometry, 0xffffff);
  downArrow.position.set(0.05, 0, depth * 1.01);
  panel.add(downArrow);

  var grabber = Layout.createPanel(width, Layout.FOLDER_GRAB_HEIGHT, depth);
  grabber.position.y = Layout.FOLDER_HEIGHT * 0.86;
  grabber.name = 'grabber';
  addImpl(grabber);

  var grabBar = Graphic.grabBar();
  grabBar.position.set(width * 0.5, 0, depth * 1.001);
  grabber.add(grabBar);

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
      child.position.y = -(index + 1) * spacingPerController;
      child.position.x = 0.026;
      if (state.collapsed) {
        child.children[0].visible = false;
      } else {
        child.children[0].visible = true;
      }
    });

    if (state.collapsed) {
      downArrow.rotation.z = Math.PI * 0.5;
    } else {
      downArrow.rotation.z = 0;
    }
  }

  var interaction = (0, _interaction2.default)(panel);
  interaction.events.on('onPressed', function (p) {
    state.collapsed = !state.collapsed;
    performLayout();
    p.locked = true;
  });

  group.folder = group;

  var grabInteraction = Grab.create({ group: group, panel: grabber });
  var paletteInteraction = Palette.create({ group: group, panel: panel });

  group.update = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    paletteInteraction.update(inputObjects);
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  group.hitscan = [panel, grabber];

  group.beingMoved = false;

  return group;
}

},{"./colors":3,"./grab":7,"./graphic":8,"./interaction":10,"./layout":11,"./palette":12,"./sharedmaterials":14,"./textlabel":16}],6:[function(require,module,exports){
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

},{"./interaction":10}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grabBar = grabBar;
function grabBar() {
  var image = new Image();
  image.src = "data:image/png;base64,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/GMzLdsAADskaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzMiA3OS4xNTkyODQsIDIwMTYvMDQvMTktMTM6MTM6NDAgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDE2LTA5LTI4VDE2OjI1OjMyLTA3OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTYtMDktMjhUMTY6Mzc6MjMtMDc6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE2LTA5LTI4VDE2OjM3OjIzLTA3OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+c1JHQiBJRUM2MTk2Ni0yLjE8L3Bob3Rvc2hvcDpJQ0NQcm9maWxlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOmFhYTFjMTQzLTUwZmUtOTQ0My1hNThmLWEyM2VkNTM3MDdmMDwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjdlNzdmYmZjLTg1ZDQtMTFlNi1hYzhmLWFjNzU0ZWQ1ODM3ZjwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOmM1ZmM0ZGYyLTkxY2MtZTI0MS04Y2VjLTMzODIyY2Q1ZWFlOTwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpjNWZjNGRmMi05MWNjLWUyNDEtOGNlYy0zMzgyMmNkNWVhZTk8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMDktMjhUMTY6MjU6MzItMDc6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y29udmVydGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmFhYTFjMTQzLTUwZmUtOTQ0My1hNThmLWEyM2VkNTM3MDdmMDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0wOS0yOFQxNjozNzoyMy0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+MzAwMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+MzAwMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4zMjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+OhF7RwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAlElEQVR42uzZsQ3AIAxEUTuTZJRskt5LRFmCdTLapUKCBijo/F0hn2SkJxIKXJJlrsOSFwAAAABA6vKI6O7BUorXdZu1/VEWEZeZfbN5m/ZamjfK+AQAAAAAAAAAAAAAAAAAAAAAACBfuaSna7i/dd1mbX+USTrN7J7N27TX0rxRxgngZYifIAAAAJC4fgAAAP//AwAuMVPw20hxCwAAAABJRU5ErkJggg==";

  var texture = new THREE.Texture();
  texture.image = image;
  texture.needsUpdate = true;
  // texture.minFilter = THREE.LinearMipMapLinearFilter;
  // texture.magFilter = THREE.LinearFilter;
  // texture.generateMipmaps = false;

  var material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    map: texture
  });
  material.alphaTest = 0.01;

  var geometry = new THREE.PlaneGeometry(image.width / 1000, image.height / 1000, 1, 1);

  var mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

},{}],9:[function(require,module,exports){
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

},{"./button":1,"./checkbox":2,"./dropdown":4,"./folder":5,"./font":6,"./sdftext":13,"./slider":15,"events":22}],10:[function(require,module,exports){
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
        hitObject: undefined
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


    if (input[buttonName] === true && hitObject === undefined) {
      return;
    }

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

},{"events":22}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FOLDER_GRAB_HEIGHT = exports.FOLDER_HEIGHT = exports.FOLDER_WIDTH = exports.BUTTON_DEPTH = exports.CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_WIDTH = exports.PANEL_VALUE_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = exports.PANEL_MARGIN = exports.PANEL_SPACING = exports.PANEL_DEPTH = exports.PANEL_HEIGHT = exports.PANEL_WIDTH = undefined;
exports.alignLeft = alignLeft;
exports.createPanel = createPanel;
exports.createControllerIDBox = createControllerIDBox;
exports.createDownArrow = createDownArrow;

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

function createDownArrow() {
  var w = 0.0096;
  var h = 0.016;
  var sh = new THREE.Shape();
  sh.moveTo(0, 0);
  sh.lineTo(-w, h);
  sh.lineTo(w, h);
  sh.lineTo(0, 0);

  var geo = new THREE.ShapeGeometry(sh);
  geo.translate(0, -h * 0.5, 0);

  return new THREE.Mesh(geo, SharedMaterials.PANEL);
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
var FOLDER_WIDTH = exports.FOLDER_WIDTH = 1.026;
var FOLDER_HEIGHT = exports.FOLDER_HEIGHT = 0.08;
var FOLDER_GRAB_HEIGHT = exports.FOLDER_GRAB_HEIGHT = 0.0512;

},{"./colors":3,"./sharedmaterials":14}],12:[function(require,module,exports){
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

},{"./interaction":10}],13:[function(require,module,exports){
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
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

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

},{"./font":6,"parse-bmfont-ascii":28,"three-bmfont-text":30,"three-bmfont-text/shaders/sdf":33}],14:[function(require,module,exports){
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

},{"./colors":3}],15:[function(require,module,exports){
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
  hitscanVolume.name = 'hitscanVolume';

  //  sliderBG volume
  var sliderBG = new THREE.Mesh(rect.clone(), SharedMaterials.PANEL);
  Colors.colorizeGeometry(sliderBG.geometry, Colors.SLIDER_BG);
  sliderBG.position.z = depth * 0.5;
  sliderBG.position.x = SLIDER_WIDTH + Layout.PANEL_MARGIN;

  var material = new THREE.MeshBasicMaterial({ color: Colors.DEFAULT_COLOR });
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
  panel.name = 'panel';
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
    } else {
      material.color.setHex(Colors.DEFAULT_COLOR);
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

    state.alpha = getAlphaFromValue(state.value, state.min, state.max);

    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider(state.alpha);
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

  group.min = function (m) {
    state.min = m;
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider(state.alpha);
    return group;
  };

  group.max = function (m) {
    state.max = m;
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider(state.alpha);
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

var ta = new THREE.Vector3();
var tb = new THREE.Vector3();
var tToA = new THREE.Vector3();
var aToB = new THREE.Vector3();

function getPointAlpha(point, segment) {
  ta.copy(segment.b).sub(segment.a);
  tb.copy(point).sub(segment.a);

  var projected = tb.projectOnVector(ta);

  tToA.copy(point).sub(segment.a);

  aToB.copy(segment.b).sub(segment.a).normalize();

  var side = tToA.normalize().dot(aToB) >= 0 ? 1 : -1;

  var length = segment.a.distanceTo(segment.b) * side;

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

},{"./colors":3,"./grab":7,"./interaction":10,"./layout":11,"./palette":12,"./sharedmaterials":14,"./textlabel":16}],16:[function(require,module,exports){
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

},{"./colors":3,"./sharedmaterials":14}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],19:[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{"dtype":20}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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
},{"as-number":19,"indexof-property":23,"word-wrapper":35,"xtend":36}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
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
},{"an-array":18,"dtype":20,"is-buffer":25}],30:[function(require,module,exports){
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

},{"./lib/utils":31,"./lib/vertices":32,"inherits":24,"layout-bmfont-text":26,"object-assign":27,"quad-indices":29,"three-buffer-vertex-data":34}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"object-assign":27}],34:[function(require,module,exports){
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

},{"flatten-vertex-data":21}],35:[function(require,module,exports){
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
},{}],36:[function(require,module,exports){
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

},{}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcYnV0dG9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNoZWNrYm94LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNvbG9ycy5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxkcm9wZG93bi5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxmb2xkZXIuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcZm9udC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxncmFiLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGdyYXBoaWMuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcaW5kZXguanMiLCJtb2R1bGVzXFxkYXRndWl2clxcaW50ZXJhY3Rpb24uanMiLCJtb2R1bGVzXFxkYXRndWl2clxcbGF5b3V0LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHBhbGV0dGUuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcc2RmdGV4dC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxzaGFyZWRtYXRlcmlhbHMuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcc2xpZGVyLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHRleHRsYWJlbC5qcyIsIm1vZHVsZXNcXHRoaXJkcGFydHlcXFN1YmRpdmlzaW9uTW9kaWZpZXIuanMiLCJub2RlX21vZHVsZXMvYW4tYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXMtbnVtYmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R0eXBlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsYXR0ZW4tdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9pbmRleG9mLXByb3BlcnR5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlLWJtZm9udC1hc2NpaS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbGliL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2xpYi92ZXJ0aWNlcy5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9zaGFkZXJzL3NkZi5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1idWZmZXItdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvd29yZC13cmFwcGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3h0ZW5kL2ltbXV0YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQzRCd0IsYzs7QUFUeEI7O0lBQVksbUI7O0FBRVo7Ozs7QUFDQTs7OztBQUNBOztJQUFZLE07O0FBQ1o7O0lBQVksTTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLEk7Ozs7OztBQUVHLFNBQVMsY0FBVCxHQU9QO0FBQUEsbUVBQUosRUFBSTs7QUFBQSxNQU5OLFdBTU0sUUFOTixXQU1NO0FBQUEsTUFMTixNQUtNLFFBTE4sTUFLTTtBQUFBLCtCQUpOLFlBSU07QUFBQSxNQUpOLFlBSU0scUNBSlMsV0FJVDtBQUFBLHdCQUhOLEtBR007QUFBQSxNQUhOLEtBR00sOEJBSEUsT0FBTyxX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OztBQUVkO0FBRUEsRUFuUEQ7QUFxUEEsQ0E1VkQ7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBTdWJkaXZpc2lvbk1vZGlmaWVyIGZyb20gJy4uL3RoaXJkcGFydHkvU3ViZGl2aXNpb25Nb2RpZmllcic7XHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCgge1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG9iamVjdCxcclxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuICBjb25zdCBCVVRUT05fV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQlVUVE9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQlVUVE9OX0RFUFRIID0gTGF5b3V0LkJVVFRPTl9ERVBUSDtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XHJcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xyXG5cclxuICAvLyAgYmFzZSBjaGVja2JveFxyXG4gIGNvbnN0IGRpdmlzaW9ucyA9IDQ7XHJcbiAgY29uc3QgYXNwZWN0UmF0aW8gPSBCVVRUT05fV0lEVEggLyBCVVRUT05fSEVJR0hUO1xyXG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIEJVVFRPTl9XSURUSCwgQlVUVE9OX0hFSUdIVCwgQlVUVE9OX0RFUFRILCBNYXRoLmZsb29yKCBkaXZpc2lvbnMgKiBhc3BlY3RSYXRpbyApLCBkaXZpc2lvbnMsIGRpdmlzaW9ucyApO1xyXG4gIGNvbnN0IG1vZGlmaWVyID0gbmV3IFRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIoIDEgKTtcclxuICBtb2RpZmllci5tb2RpZnkoIHJlY3QgKTtcclxuICByZWN0LnRyYW5zbGF0ZSggQlVUVE9OX1dJRFRIICogMC41LCAwLCAwICk7XHJcblxyXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjU7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XHJcblxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5CVVRUT05fQ09MT1IgfSk7XHJcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XHJcblxyXG5cclxuICBjb25zdCBidXR0b25MYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lLCB7IHNjYWxlOiAwLjg2NiB9ICk7XHJcbiAgYnV0dG9uTGFiZWwucG9zaXRpb24ueCA9IEJVVFRPTl9XSURUSCAqIDAuNSAtIGJ1dHRvbkxhYmVsLmxheW91dC53aWR0aCAqIDAuMDAwMTEgKiAwLjU7XHJcbiAgYnV0dG9uTGFiZWwucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDEuMjtcclxuICBidXR0b25MYWJlbC5wb3NpdGlvbi55ID0gLTAuMDI1O1xyXG4gIGZpbGxlZFZvbHVtZS5hZGQoIGJ1dHRvbkxhYmVsICk7XHJcblxyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9CVVRUT04gKTtcclxuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xyXG5cclxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlZCcsIGhhbmRsZU9uUmVsZWFzZSApO1xyXG5cclxuICB1cGRhdGVWaWV3KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHAgKXtcclxuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSgpO1xyXG5cclxuICAgIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDAuMTtcclxuXHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblJlbGVhc2UoKXtcclxuICAgIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDAuNTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcclxuXHJcbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkJVVFRPTl9DT0xPUiApO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGdyb3VwLmludGVyYWN0aW9uID0gaW50ZXJhY3Rpb247XHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgaGl0c2NhblZvbHVtZSwgcGFuZWwgXTtcclxuXHJcbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlKCBzdHIgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IGZhbHNlLFxyXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxyXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXHJcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEhcclxufSA9IHt9ICl7XHJcblxyXG4gIGNvbnN0IENIRUNLQk9YX1dJRFRIID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBDSEVDS0JPWF9IRUlHSFQgPSBDSEVDS0JPWF9XSURUSDtcclxuICBjb25zdCBDSEVDS0JPWF9ERVBUSCA9IGRlcHRoO1xyXG5cclxuICBjb25zdCBJTkFDVElWRV9TQ0FMRSA9IDAuMDAxO1xyXG4gIGNvbnN0IEFDVElWRV9TQ0FMRSA9IDAuOTtcclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICB2YWx1ZTogaW5pdGlhbFZhbHVlLFxyXG4gICAgbGlzdGVuOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcclxuXHJcbiAgLy8gIGJhc2UgY2hlY2tib3hcclxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBDSEVDS0JPWF9XSURUSCwgQ0hFQ0tCT1hfSEVJR0hULCBDSEVDS0JPWF9ERVBUSCApO1xyXG4gIHJlY3QudHJhbnNsYXRlKCBDSEVDS0JPWF9XSURUSCAqIDAuNSwgMCwgMCApO1xyXG5cclxuXHJcbiAgLy8gIGhpdHNjYW4gdm9sdW1lXHJcbiAgY29uc3QgaGl0c2Nhbk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG5cclxuICAvLyAgb3V0bGluZSB2b2x1bWVcclxuICBjb25zdCBvdXRsaW5lID0gbmV3IFRIUkVFLkJveEhlbHBlciggaGl0c2NhblZvbHVtZSApO1xyXG4gIG91dGxpbmUubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuT1VUTElORV9DT0xPUiApO1xyXG5cclxuICAvLyAgY2hlY2tib3ggdm9sdW1lXHJcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogQ29sb3JzLkRFRkFVTFRfQ09MT1IgfSk7XHJcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcclxuICBmaWxsZWRWb2x1bWUuc2NhbGUuc2V0KCBBQ1RJVkVfU0NBTEUsIEFDVElWRV9TQ0FMRSxBQ1RJVkVfU0NBTEUgKTtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XHJcblxyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9DSEVDS0JPWCApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBvdXRsaW5lLCBjb250cm9sbGVySUQgKTtcclxuXHJcbiAgLy8gZ3JvdXAuYWRkKCBmaWxsZWRWb2x1bWUsIG91dGxpbmUsIGhpdHNjYW5Wb2x1bWUsIGRlc2NyaXB0b3JMYWJlbCApO1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xyXG5cclxuICB1cGRhdGVWaWV3KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHAgKXtcclxuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGUudmFsdWUgPSAhc3RhdGUudmFsdWU7XHJcblxyXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IHN0YXRlLnZhbHVlO1xyXG5cclxuICAgIGlmKCBvbkNoYW5nZWRDQiApe1xyXG4gICAgICBvbkNoYW5nZWRDQiggc3RhdGUudmFsdWUgKTtcclxuICAgIH1cclxuXHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcblxyXG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBpZiggc3RhdGUudmFsdWUgKXtcclxuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0NPTE9SICk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5JTkFDVElWRV9DT0xPUiApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIHN0YXRlLnZhbHVlICl7XHJcbiAgICAgIGZpbGxlZFZvbHVtZS5zY2FsZS5zZXQoIEFDVElWRV9TQ0FMRSwgQUNUSVZFX1NDQUxFLCBBQ1RJVkVfU0NBTEUgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGZpbGxlZFZvbHVtZS5zY2FsZS5zZXQoIElOQUNUSVZFX1NDQUxFLCBJTkFDVElWRV9TQ0FMRSwgSU5BQ1RJVkVfU0NBTEUgKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBsZXQgb25DaGFuZ2VkQ0I7XHJcbiAgbGV0IG9uRmluaXNoQ2hhbmdlQ0I7XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBvbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLmludGVyYWN0aW9uID0gaW50ZXJhY3Rpb247XHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgaGl0c2NhblZvbHVtZSwgcGFuZWwgXTtcclxuXHJcbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAubGlzdGVuID0gZnVuY3Rpb24oKXtcclxuICAgIHN0YXRlLmxpc3RlbiA9IHRydWU7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgIGRlc2NyaXB0b3JMYWJlbC51cGRhdGUoIHN0ciApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgc3RhdGUudmFsdWUgPSBvYmplY3RbIHByb3BlcnR5TmFtZSBdO1xyXG4gICAgfVxyXG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ09MT1IgPSAweDJGQTFENjtcclxuZXhwb3J0IGNvbnN0IEhJR0hMSUdIVF9DT0xPUiA9IDB4MEZDM0ZGO1xyXG5leHBvcnQgY29uc3QgSU5URVJBQ1RJT05fQ09MT1IgPSAweDA3QUJGNztcclxuZXhwb3J0IGNvbnN0IEVNSVNTSVZFX0NPTE9SID0gMHgyMjIyMjI7XHJcbmV4cG9ydCBjb25zdCBISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgPSAweDk5OTk5OTtcclxuZXhwb3J0IGNvbnN0IE9VVExJTkVfQ09MT1IgPSAweDk5OTk5OTtcclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQkFDSyA9IDB4MWExYTFhXHJcbmV4cG9ydCBjb25zdCBISUdITElHSFRfQkFDSyA9IDB4NDk0OTQ5O1xyXG5leHBvcnQgY29uc3QgSU5BQ1RJVkVfQ09MT1IgPSAweDE2MTgyOTtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfU0xJREVSID0gMHgyZmExZDY7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0NIRUNLQk9YID0gMHg4MDY3ODc7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0JVVFRPTiA9IDB4ZTYxZDVmO1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9URVhUID0gMHgxZWQzNmY7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0RST1BET1dOID0gMHhmZmYwMDA7XHJcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9CR19DT0xPUiA9IDB4ZmZmZmZmO1xyXG5leHBvcnQgY29uc3QgRFJPUERPV05fRkdfQ09MT1IgPSAweDAwMDAwMDtcclxuZXhwb3J0IGNvbnN0IEJVVFRPTl9DT0xPUiA9IDB4ZTYxZDVmO1xyXG5leHBvcnQgY29uc3QgU0xJREVSX0JHID0gMHg0NDQ0NDQ7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29sb3JpemVHZW9tZXRyeSggZ2VvbWV0cnksIGNvbG9yICl7XHJcbiAgZ2VvbWV0cnkuZmFjZXMuZm9yRWFjaCggZnVuY3Rpb24oZmFjZSl7XHJcbiAgICBmYWNlLmNvbG9yLnNldEhleChjb2xvcik7XHJcbiAgfSk7XHJcbiAgZ2VvbWV0cnkuY29sb3JzTmVlZFVwZGF0ZSA9IHRydWU7XHJcbiAgcmV0dXJuIGdlb21ldHJ5O1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IGZhbHNlLFxyXG4gIG9wdGlvbnMgPSBbXSxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICBvcGVuOiBmYWxzZSxcclxuICAgIGxpc3RlbjogZmFsc2VcclxuICB9O1xyXG5cclxuICBjb25zdCBEUk9QRE9XTl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBEUk9QRE9XTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IERST1BET1dOX0RFUFRIID0gZGVwdGg7XHJcbiAgY29uc3QgRFJPUERPV05fT1BUSU9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU4gKiAxLjI7XHJcbiAgY29uc3QgRFJPUERPV05fTUFSR0lOID0gTGF5b3V0LlBBTkVMX01BUkdJTiAqIC0wLjQ7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcclxuXHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgcGFuZWwgXTtcclxuXHJcbiAgY29uc3QgbGFiZWxJbnRlcmFjdGlvbnMgPSBbXTtcclxuICBjb25zdCBvcHRpb25MYWJlbHMgPSBbXTtcclxuXHJcbiAgLy8gIGZpbmQgYWN0dWFsbHkgd2hpY2ggbGFiZWwgaXMgc2VsZWN0ZWRcclxuICBjb25zdCBpbml0aWFsTGFiZWwgPSBmaW5kTGFiZWxGcm9tUHJvcCgpO1xyXG5cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGZpbmRMYWJlbEZyb21Qcm9wKCl7XHJcbiAgICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XHJcbiAgICAgIHJldHVybiBvcHRpb25zLmZpbmQoIGZ1bmN0aW9uKCBvcHRpb25OYW1lICl7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbk5hbWUgPT09IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMob3B0aW9ucykuZmluZCggZnVuY3Rpb24oIG9wdGlvbk5hbWUgKXtcclxuICAgICAgICByZXR1cm4gb2JqZWN0W3Byb3BlcnR5TmFtZV0gPT09IG9wdGlvbnNbIG9wdGlvbk5hbWUgXTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVPcHRpb24oIGxhYmVsVGV4dCwgaXNPcHRpb24gKXtcclxuICAgIGNvbnN0IGxhYmVsID0gY3JlYXRlVGV4dExhYmVsKFxyXG4gICAgICB0ZXh0Q3JlYXRvciwgbGFiZWxUZXh0LFxyXG4gICAgICBEUk9QRE9XTl9XSURUSCwgZGVwdGgsXHJcbiAgICAgIENvbG9ycy5EUk9QRE9XTl9GR19DT0xPUiwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SLFxyXG4gICAgICAwLjg2NlxyXG4gICAgKTtcclxuICAgIGdyb3VwLmhpdHNjYW4ucHVzaCggbGFiZWwuYmFjayApO1xyXG4gICAgY29uc3QgbGFiZWxJbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBsYWJlbC5iYWNrICk7XHJcbiAgICBsYWJlbEludGVyYWN0aW9ucy5wdXNoKCBsYWJlbEludGVyYWN0aW9uICk7XHJcbiAgICBvcHRpb25MYWJlbHMucHVzaCggbGFiZWwgKTtcclxuXHJcblxyXG4gICAgaWYoIGlzT3B0aW9uICl7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgICAgICBzZWxlY3RlZExhYmVsLnNldFN0cmluZyggbGFiZWxUZXh0ICk7XHJcblxyXG4gICAgICAgIGxldCBwcm9wZXJ0eUNoYW5nZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xyXG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gbGFiZWxUZXh0O1xyXG4gICAgICAgICAgaWYoIHByb3BlcnR5Q2hhbmdlZCApe1xyXG4gICAgICAgICAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gbGFiZWxUZXh0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gb3B0aW9uc1sgbGFiZWxUZXh0IF07XHJcbiAgICAgICAgICBpZiggcHJvcGVydHlDaGFuZ2VkICl7XHJcbiAgICAgICAgICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBvcHRpb25zWyBsYWJlbFRleHQgXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjb2xsYXBzZU9wdGlvbnMoKTtcclxuICAgICAgICBzdGF0ZS5vcGVuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmKCBvbkNoYW5nZWRDQiAmJiBwcm9wZXJ0eUNoYW5nZWQgKXtcclxuICAgICAgICAgIG9uQ2hhbmdlZENCKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwLmxvY2tlZCA9IHRydWU7XHJcblxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgICAgICBpZiggc3RhdGUub3BlbiA9PT0gZmFsc2UgKXtcclxuICAgICAgICAgIG9wZW5PcHRpb25zKCk7XHJcbiAgICAgICAgICBzdGF0ZS5vcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIGNvbGxhcHNlT3B0aW9ucygpO1xyXG4gICAgICAgICAgc3RhdGUub3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGxhYmVsLmlzT3B0aW9uID0gaXNPcHRpb247XHJcbiAgICByZXR1cm4gbGFiZWw7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjb2xsYXBzZU9wdGlvbnMoKXtcclxuICAgIG9wdGlvbkxhYmVscy5mb3JFYWNoKCBmdW5jdGlvbiggbGFiZWwgKXtcclxuICAgICAgaWYoIGxhYmVsLmlzT3B0aW9uICl7XHJcbiAgICAgICAgbGFiZWwudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wZW5PcHRpb25zKCl7XHJcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGxhYmVsLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gIGJhc2Ugb3B0aW9uXHJcbiAgY29uc3Qgc2VsZWN0ZWRMYWJlbCA9IGNyZWF0ZU9wdGlvbiggaW5pdGlhbExhYmVsLCBmYWxzZSApO1xyXG4gIHNlbGVjdGVkTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9NQVJHSU4gKiAwLjUgKyB3aWR0aCAqIDAuNTtcclxuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgZG93bkFycm93ID0gTGF5b3V0LmNyZWF0ZURvd25BcnJvdygpO1xyXG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBkb3duQXJyb3cuZ2VvbWV0cnksIENvbG9ycy5EUk9QRE9XTl9GR19DT0xPUiApO1xyXG4gIGRvd25BcnJvdy5wb3NpdGlvbi5zZXQoIERST1BET1dOX1dJRFRIIC0gMC4wNCwgMCwgZGVwdGggKiAxLjAxICk7XHJcbiAgc2VsZWN0ZWRMYWJlbC5hZGQoIGRvd25BcnJvdyApO1xyXG5cclxuXHJcbiAgZnVuY3Rpb24gY29uZmlndXJlTGFiZWxQb3NpdGlvbiggbGFiZWwsIGluZGV4ICl7XHJcbiAgICBsYWJlbC5wb3NpdGlvbi55ID0gLURST1BET1dOX01BUkdJTiAtIChpbmRleCsxKSAqICggRFJPUERPV05fT1BUSU9OX0hFSUdIVCApO1xyXG4gICAgbGFiZWwucG9zaXRpb24ueiA9IGRlcHRoICogMjQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvcHRpb25Ub0xhYmVsKCBvcHRpb25OYW1lLCBpbmRleCApe1xyXG4gICAgY29uc3Qgb3B0aW9uTGFiZWwgPSBjcmVhdGVPcHRpb24oIG9wdGlvbk5hbWUsIHRydWUgKTtcclxuICAgIGNvbmZpZ3VyZUxhYmVsUG9zaXRpb24oIG9wdGlvbkxhYmVsLCBpbmRleCApO1xyXG4gICAgcmV0dXJuIG9wdGlvbkxhYmVsO1xyXG4gIH1cclxuXHJcbiAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xyXG4gICAgc2VsZWN0ZWRMYWJlbC5hZGQoIC4uLm9wdGlvbnMubWFwKCBvcHRpb25Ub0xhYmVsICkgKTtcclxuICB9XHJcbiAgZWxzZXtcclxuICAgIHNlbGVjdGVkTGFiZWwuYWRkKCAuLi5PYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoIG9wdGlvblRvTGFiZWwgKSApO1xyXG4gIH1cclxuXHJcblxyXG4gIGNvbGxhcHNlT3B0aW9ucygpO1xyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9EUk9QRE9XTiApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBjb250cm9sbGVySUQsIHNlbGVjdGVkTGFiZWwgKTtcclxuXHJcblxyXG4gIHVwZGF0ZVZpZXcoKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG5cclxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBpbnRlcmFjdGlvbiwgaW5kZXggKXtcclxuICAgICAgY29uc3QgbGFiZWwgPSBvcHRpb25MYWJlbHNbIGluZGV4IF07XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGxhYmVsLmJhY2suZ2VvbWV0cnksIENvbG9ycy5EUk9QRE9XTl9CR19DT0xPUiApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBsZXQgb25DaGFuZ2VkQ0I7XHJcbiAgbGV0IG9uRmluaXNoQ2hhbmdlQ0I7XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBvbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgc2VsZWN0ZWRMYWJlbC5zZXRTdHJpbmcoIGZpbmRMYWJlbEZyb21Qcm9wKCkgKTtcclxuICAgIH1cclxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBsYWJlbEludGVyYWN0aW9uICl7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIH0pO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgIGRlc2NyaXB0b3JMYWJlbC51cGRhdGUoIHN0ciApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgR3JhcGhpYyBmcm9tICcuL2dyYXBoaWMnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcbmltcG9ydCAqIGFzIFBhbGV0dGUgZnJvbSAnLi9wYWxldHRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUZvbGRlcih7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgbmFtZVxyXG59ID0ge30gKXtcclxuXHJcbiAgY29uc3Qgd2lkdGggPSBMYXlvdXQuRk9MREVSX1dJRFRIO1xyXG4gIGNvbnN0IGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIO1xyXG5cclxuICBjb25zdCBzcGFjaW5nUGVyQ29udHJvbGxlciA9IExheW91dC5QQU5FTF9IRUlHSFQgKyBMYXlvdXQuUEFORUxfU1BBQ0lORztcclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgcHJldmlvdXNQYXJlbnQ6IHVuZGVmaW5lZFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgY29uc3QgY29sbGFwc2VHcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIGdyb3VwLmFkZCggY29sbGFwc2VHcm91cCApO1xyXG5cclxuICAvLyAgWWVhaC4gR3Jvc3MuXHJcbiAgY29uc3QgYWRkT3JpZ2luYWwgPSBUSFJFRS5Hcm91cC5wcm90b3R5cGUuYWRkO1xyXG5cclxuICBmdW5jdGlvbiBhZGRJbXBsKCBvICl7XHJcbiAgICBhZGRPcmlnaW5hbC5jYWxsKCBncm91cCwgbyApO1xyXG4gIH1cclxuXHJcbiAgYWRkSW1wbCggY29sbGFwc2VHcm91cCApO1xyXG5cclxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIExheW91dC5GT0xERVJfSEVJR0hULCBkZXB0aCApO1xyXG4gIGFkZEltcGwoIHBhbmVsICk7XHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggbmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOICogMS41O1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCApO1xyXG5cclxuICBjb25zdCBkb3duQXJyb3cgPSBMYXlvdXQuY3JlYXRlRG93bkFycm93KCk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGRvd25BcnJvdy5nZW9tZXRyeSwgMHhmZmZmZmYgKTtcclxuICBkb3duQXJyb3cucG9zaXRpb24uc2V0KCAwLjA1LCAwLCBkZXB0aCAgKiAxLjAxICk7XHJcbiAgcGFuZWwuYWRkKCBkb3duQXJyb3cgKTtcclxuXHJcbiAgY29uc3QgZ3JhYmJlciA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIExheW91dC5GT0xERVJfR1JBQl9IRUlHSFQsIGRlcHRoICk7XHJcbiAgZ3JhYmJlci5wb3NpdGlvbi55ID0gTGF5b3V0LkZPTERFUl9IRUlHSFQgKiAwLjg2O1xyXG4gIGdyYWJiZXIubmFtZSA9ICdncmFiYmVyJztcclxuICBhZGRJbXBsKCBncmFiYmVyICk7XHJcblxyXG4gIGNvbnN0IGdyYWJCYXIgPSBHcmFwaGljLmdyYWJCYXIoKTtcclxuICBncmFiQmFyLnBvc2l0aW9uLnNldCggd2lkdGggKiAwLjUsIDAsIGRlcHRoICogMS4wMDEgKTtcclxuICBncmFiYmVyLmFkZCggZ3JhYkJhciApO1xyXG5cclxuICBncm91cC5hZGQgPSBmdW5jdGlvbiggLi4uYXJncyApe1xyXG4gICAgYXJncy5mb3JFYWNoKCBmdW5jdGlvbiggb2JqICl7XHJcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICBjb250YWluZXIuYWRkKCBvYmogKTtcclxuICAgICAgY29sbGFwc2VHcm91cC5hZGQoIGNvbnRhaW5lciApO1xyXG4gICAgICBvYmouZm9sZGVyID0gZ3JvdXA7XHJcbiAgICB9KTtcclxuXHJcbiAgICBwZXJmb3JtTGF5b3V0KCk7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gcGVyZm9ybUxheW91dCgpe1xyXG4gICAgY29sbGFwc2VHcm91cC5jaGlsZHJlbi5mb3JFYWNoKCBmdW5jdGlvbiggY2hpbGQsIGluZGV4ICl7XHJcbiAgICAgIGNoaWxkLnBvc2l0aW9uLnkgPSAtKGluZGV4KzEpICogc3BhY2luZ1BlckNvbnRyb2xsZXIgO1xyXG4gICAgICBjaGlsZC5wb3NpdGlvbi54ID0gMC4wMjY7XHJcbiAgICAgIGlmKCBzdGF0ZS5jb2xsYXBzZWQgKXtcclxuICAgICAgICBjaGlsZC5jaGlsZHJlblswXS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBjaGlsZC5jaGlsZHJlblswXS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYoIHN0YXRlLmNvbGxhcHNlZCApe1xyXG4gICAgICBkb3duQXJyb3cucm90YXRpb24ueiA9IE1hdGguUEkgKiAwLjU7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBkb3duQXJyb3cucm90YXRpb24ueiA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGZ1bmN0aW9uKCBwICl7XHJcbiAgICBzdGF0ZS5jb2xsYXBzZWQgPSAhc3RhdGUuY29sbGFwc2VkO1xyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gIH0pO1xyXG5cclxuICBncm91cC5mb2xkZXIgPSBncm91cDtcclxuXHJcbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsOiBncmFiYmVyIH0gKTtcclxuICBjb25zdCBwYWxldHRlSW50ZXJhY3Rpb24gPSBQYWxldHRlLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG5cclxuICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBwYWxldHRlSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgcGFuZWwsIGdyYWJiZXIgXTtcclxuXHJcbiAgZ3JvdXAuYmVpbmdNb3ZlZCA9IGZhbHNlO1xyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGltYWdlKCl7XHJcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICBpbWFnZS5zcmMgPSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFnQUFBQUlBQ0FZQUFBRDBlTlQ2QUFDQUFFbEVRVlI0MnV5OWgzSWN5WklsZXZmWjJ1Nk8yTmwzWjY0V2ZWc3J0aVNiYktxbTFnS0NCS0VKUldpdE5XQUFDb3BnNzh6NzQzaUZPKzVUcDA1NVJHWldaVmFCVGRBc3JBV0JpTXpJQ0k4VDdzZVAvOG81OTNtK2ZaTnZQK1RiNVh5N2tXLzM4dTF4dmpYa1cxTyt0ZVZiWjc1MVMrdkt0NDU4YTg2M1J2blo0MysyeVA4Ly9wa2VhY2MvMjU1dkwrQm43OGs0bDJYYzQvR2Y1dHN6NmFOZCtnbTFWdW56K0Jucjh1MTV6Tjl0bDk4OWZxOTZlTy9yK1hZbjN4N0tzelRLejdUSSsydS9uZEN3djJaNWh1TStuK1RiL1h5N25XOC81ZHZGZlB0cnZ2MHQzejdJdDgva25jL24yOVY4dTVWdkQyQU9Ya2lmVnNOeEhzb3p4NWs3bks5SDhudlg4dTNIZlBzdTM3N0l0dy96N1MvNTlzZDgrMjIrL1ZxZS9YaHU3c3J2Nlpwb2xiRndQdHJrK1o3QkhIeVpiOS9MT05hN05rcy9MMlhkOUVucmxiWFRKdVBWeWZPM3c4KzlrbjkyeSsrM3dUcDdLdVBja25FdnlIdCtDbk4vSllXNXZ5Wno5TDI4NjhmeXJYK1hiLzhuMy83aFYvay8rWC8rajN6NzMvbjJiL24ycDR6V3dVL3dQZjhpejNJbTM4N20yeVg1anZmazIraDY2WlI5MnA5dmcvazJKRzBBNWxiM3I0Nmw2L3A0VHI4VkcvSkJodlA1ZnI2OUorLzB0d3pucnBKbnJ2UTVxcm9tOCsyL1ZYbE5admx1SDhpNitLdXNsZVAvL2lpamQrRXhQc3B3emo0MCtyNE5kcGh0SnphMGg5cjNMZmtHeDJmZTE3OFN3L1IxdnAwakE2RUhlck1jSG1vZzJEaDB5cy9VeXo4NzVmOGZHNUpoYVFQeSs1MWljQmdFWEpMeG44dUV2QlRqL3lyUStxUlBCU0VLVXJyZ1lBajlMaHExUzNUQTFjTUIxeUY5OWtDLy9kRHdXVjVLbnkzeTBldklXSDRzSC9QNG9QMEtqUElOT1NpZjBod2dpT3J4QUtwNldXaFJjOGZ6eFF2aW5EelRwN0tnM3hkait3ZlBvdXVBUXhqbm9sZWVvUlZBd0xlZWpjSFByT3RySk45R1plMzB5emh0MGwrYnZNZUEvTXlZL0hOSWZsYlhXYXYwanlEZ2lqeUhBcEtMc043TG5Ydjl2bGVsYnp3TWp3M3FiOFRBL3ZkOCswY0JWSCtRdyt5VEROWUJmcy8zRGVOeFI3NmpndldYOHQyR1pDNG44MjFLL2praGM2djdWOGVxazdGdUNuRFd0Zk54UnZQNXBjenBKN0kyUDgxb0Q5MnE4SmtyZlk1cXI4bi9tVy8vWE1VMWVUSEQ5ZkdGckhXMHNXY3llaGNlNDB5R2MvYTVuTTluWmY2MGI3ME1kWWp0SElDemVZanNZYnVjWjA5bDdxL3JKVUVCZ0haK0RRN0JScmdkNklHT0JtSkNESFN2RFBCTS90a3JneC8vL2JUODdKajh2ejREQk53RlJOY2lrOUV2Zlk4RjJxZzhVeS9jYnJ0bElrWmkvSzRhdFRiamRzc0gzSUE4ang0NDQ5RHdBQnFBQXhCdnJicG96NGd4L2w3bS9FY0JCbmRrTHA3SmUzU0JVUjQyR2hwa1BlU2k1bzducTBrTzU3dHdrL3RPbnUrTUxQQ1BCRlg3RnQyZzlJdHpNU3pQL2hLKzh6bndMUEhHMEhmVlp6NWVMelA1Tml2cloxVGVTWUhtUy9udk1mbTVPZm5uSkt5elY5SXZnZ0FFbTE4SkFyNEN3S2F4akxuWDczdWZnT3hYWWtqL0pvYjEyTUQrcjN6N0YvR3EvRVhtOWd1Wjh6VFhnZTZuQzNKN1VMQnp5ZmlPblREM2t6TG5DL20ybEcrTCtUWXYzMkJNdnJYdWwrZkcydmxHMWt3VzgvbTlHUHF2WUE5OWw4RWV1bHZoTTFmNkhOVmNrLzhtNi9GZjgrMzNWVnFUV2IzYldWa2ozOGg3Zml2L2ZVNWEydTlpalhFdW96blR5L2xGNmZ1V3pCOWVob2JFL2s1Ukc1Tyt1K1U1R3VRc3VpbmY0b0lDZ0F2U09kL3k5UEFmbGdOOUJnekVuQXc2SUViNUJSbm5ZMk95TElaa0ZnQURlZzBhNkliY0xuOC9JaTh3RjJnek1INFhHTE5STVZwUnZ6c216L3JTYzd2dGhWdW1ncGxaK2YxNWFOcmZsRHdQMzFxYjRNWjBWdWI2b2h5STZBNnJod1B1bGN6QnBJeUxEVDlzbHh5eURUSG1qdWVyUmNhOEx3RG9zanpYZVhuT2IrVHcrQVRteDFwME16QW5zL0xNQ2dJNlpWMzhDT0NTTjBZL3ZPdXNySmZqZGJNcWEyMVN4dEpGckdOUHljK3V5Yzh2d1BnajBxK0NBQVdiNmxyN1JyNkRQdE5UT2hDajVuNlF2QktQS1p5aXJzbVB4TEFlSC9yL0pNYjJqM1F6L3lIbGRmQkFqT05GdWFsWVlJZS80NlI4ditONVhNKzNUV2xyTXNlNFgzRHQ0RmdhUWtwN1BxK0lvZjlSM3VPc3JORXM5dENEQ3ArNTB1ZW8xcHA4VDliaGIrU2ZmeVZYYzFacjhscEc2ME50MXdVNUxDL0ltdEgxa2ZhNytNYklZczdVTTM5Tjl1OERBZDlOTUg5NjNpNUIwMzA3S3VkQ084emRQUVVCQ2dBdXkvOTRZTnp5OURZL0p4MnJnVmcwakhNM0dKVGp2OStRdGl5L1B5Ri9yN2RRZGlkMmlwRVpGNE8wS2tiSWFrc3lnY1BnUmhtUU1SWUN2NmRHYlFxZTNmZmU0ekxHdkl5SHo3TU8vNzRDb0dnS1BBemRkR082SkFmUURWa290OGtkaGg2VVNYbVBaV3FMOGt3ajhyTnRjc0JGelIzUFZ5c3N0RHZ5UE5mRnRYWkpqT3ozY29Ed3B1Mm5SYWZ6c1NKajg3ckE5VlZQTjNrRkxBdnkrOGZyWlR2ZnR1Ujk4VjA3WkRHUHl1SSsvdmtkK2ZsMStmbDU2VzhFUUVnekhWamZpbEc4TGdDb0hqd29neEZ6UHdOZWlaZEdPRVZkazNvamZsK003TDlJL1BXdmdiaDhHdXRBbitPeXVNcS9sdWY1Q2I1amsvRWRsMlhPZC9NdEIvOWNoN0dHYWF4SE1OWlpPV0RTbk0vYjBtNFNHTGlhMFI1NldPRXpWL29jMVZpVFh3Q240ay9pRWZpWVhNMVpyY25yR2EyUFc3SWVmcEsxZUkzV1I5cHJ4RGZHN1F6bVREM3p5azJyQjY0YjIveDEyY05iWXBQblpIKy9ndk8yRWJoWk54VUFLREo3SXAzcjdXQlFPbGNEc1NsR0FZM3pNTGd2OUFZNkkzKy9MWVprVS81N1Z2cnp1Uk90RjlvMTJvNHhQaTZtUlJuVCt0MHRPYlFRQUR6MjNHN3hnTnVVY2RVNDdvT1IzSkcvWDRVUE9tcWd1aHZ5SVIrSThYd01YQXNNWWVqWUt6S0hPM0RRcmNyZk1iSUx6WjAxWDYyd0dCN0w0cm92ejNkRGpNYVBZaEJDbTNZZDVrVFh4WXlzQTMyK24yaDk2Y1lZaHNOL1ZkNXZMOThPcEU5KzF3NUF2SFB5WFhibDUzVjg5aHowRXZxOUhRQUEzZUJkV0lKdnJtMWQrcDZDdzdDRDRtdnFtandyaDd4NkFYNU50Lzl2d2ZOMmg5eWlsYXdEUEpRL28zZTlKMEMzMmZNZGQrSG12d2JqNFZocVRKN0RmQ3JuNEV6SzgvbFkzdWVCckorYlFOUzluOEVlZWxUaE0xZjZEYk5la3orSXArYU1nTVAzNVo5blpKMmdxem1MTlhremcvV0JhK1NPakhIWHNMRnBycEhRR0dtT2N4Yzg4M3I0S3dtNkM4TFRhUFAxWEVJQTBFOGNQT1ZtM1ZNQWNFc0dhS0JZc3NaWmwrUm10aXNHZWpNbUFOaVVuOStUMzEveXVCTTFGR0FkWXNjdjlMUDhVMXRjQUlDLzh6cmZEajBBb042SUw4L0NlK2Zra0RtU2Z4NUlud2ZTNTJ0NHJqVkNkWDJ3YUpWY1dTOGY0Ym0wRjBZSVE4ZmVrekcwYjl3UVBRRVBnTTdkVVFBQUtIbnl1ZlJSSjg5M1g5YkVOVEVjb1UyN0JYT1Q4eXpvRzlCSE0zaHJ4bVdSNnVHdjg3b0ZYb3NaOGdEb0hNMkN5M29idnN1V2JMUlpXR2NhaWxDREdEb1VCOERqcGJmaWZma0d1bUV4L05WdGhCbnd4dldwdUZ5UFk2NS9Ga0R3SmR5MDBET1N4anJRR044bEF3QkVHZCtjOUQxUElOcTZUZmdBUUZyenFYdmptZGlISnpKUDk4UTQxc243cHJtSEhsYjR6SlYrd3l6WDVIV04rNHBuN3d3Yy90L0wvOWRNcU5zWnJjbjc4aDNyVTF3ZnVrYnF3WFk5TVd4c1dtc2thb3cweHNFMXo1NzVkaUJCajhqY1RRVUF3QlJ4bzVDZy9WZ0J3RDF3RFhaQTNIOWFETUc2Y2ZpclMzL1FDQUhnQjFVUVlMa1Qrd2pSUlIxaTY5QkNBR0NCZm5ZVERtc0xBRFRDN1g4WTRzdjYzbmpBYTN4VSs5MkNuOEVQT3kvemdGNkFKNUQyMWtZcGVoeVBYWk01T3dURHZFakV1SmVBNkpJQ2dDN2dUbUNLNERQNUZwaHl3NGQzWEErQXVyUnVTbi9XUEM4QldNTk5Qdys4Qll3QjlzQWFtNEZ3ejQ1OGd6MjRPV0FvQW1OcjdCWi9ZcXo5Q1htR0ZRQTV1djZYd0RXSlhJYzY0RlJvS3Q3bmN0UDZMYmovTlM2djJSV1BnVVJiN2pwb0JrNkh4dVhqQUFEMm1LM0wrK2w3NXhJQ0FMMEJ2YWh3UGpGbHQwWEdxNlArMDl4RDJuOGx6MXpwTjh4cVRUNkN1TzlWNEFTY29mVGNtMENHcnN0Z1RWcXB5cFd1anc1S1BZNUtoeTczWFpLTVVjazR2T1o5bnZreEl6ek5BQUE1ZUpORTBQNzd0MUVBOEpEY0ZvUHdRVmJGdU9MdGFvNUlmUjJBZXZDRHpvSGI0d0RjaWZNR2VJaDdpNTBId2huMjBVbGVpM202eVlRQXdIUGpkcW52ZlFqdnZnb0Vpd1VnckcwUVVOaWttSHN2SUR0ZnFwNFZqejB3Z0pPR0ZqamxMZ2tBR0pCNUc1RGZ3VFJHMUVkUUVPQ0xIYzhBRVc4Tk9BRDhiZldRZTA1eGZKeG5Qcnluak13RlhHTkRoSzRSUkhDSWltTnJaeUF6QWIxZlRIeWRwUEFFYmw0RUdCaFN3UnY0OXhKei9VRGkvKzhGNHZJK0VtM1VPdWhHUkE5RXgvT3VvSGVnNUxKN05OWUE3UE0xQ0hGdFFUaG0weFBXVVRjbEF3RE1IdXFCOVoxa1BqbDlGYlVnZlAyWHU0ZTQvMHJXUUtYZk1JczF5WEhmV3dRQ1VKdERiN1lOcnBDM251YWFES1VxbDdzKzJBNUdwVU9YczBhU2psSEpPTHdtMlRNL1lOaGVERThmd2pqYndNR2JCeER3WDZFVUJRQ01Oa2ZCOWErR2xUL0VzSkhXMStKWnJJcCs5ZzFFaDE2QXVJZllPS1VXZGhBNjB0UzB5WmdBZ0E4MmpDK2phMXZUb2lZaEhYS1c1dWtvRURkRlZxaVZxb2ZreVp5MERXSmlZeHVHVUVxU3VadUFQTzl4U0dOODVmeWlMNDhoZnA4MDIrQU9vRmhmSFA4TnpEUEdycnBkc2VBVUduK01mK0gzMm9tSXJXR3FFMlluY0c0OEVoVDVnRnp4c0d3dFl0eUhCQUQ0VUxiaThsSHJnRW1tVHlrOTZxeGtjQ2pZdUdwOEIvMk8wMkJNdG9uWGdxQnV5Sk5TZEFsWTVoWkl3elViTlorOHhrZm9VSW5xUCtrZUdqSGM1dVd1Z1VxLzRRVm5pOGlVOHp5dktPN0xtaGhYSThickFJQlZ5WnJFOGVLa0tzZDVOOHNPWXVweDFCaEoxMGpTTWNiZy9Jc2FaelJpVFQ0eDdDNTY1bmNneEgwQUllOURhYnQwY1MreXpRb0E2Z2xoVEpEYjRvRGN1Nk5HcnJkbFFFZUJENEFJYUkxdWlsMEJWcVB2RnRzdlNFWVhlSk1yS01TOU12Z0FjUUVBanIxSE4wcTlCUTI2Z21MYU9CeGtPWmgweTIzYUJ1UzNTVWdyMURZTFhwZFY4RGpNR2o4N0IyejN2cGh6eDU2UkJYQzFUN3BTMFJkTllieERxU2RKc3cwc0R3S1RGVU1jZ2lZNWNOaTlqQ2t3cS9MN2J3TDk2QUd0WWllb1Q0RHFlSmlpT0FvYmpyOExoenBDQUVBSmdKK0RXeDRCZ0hVcnQ5WUI1dVMzVTVvcE1yNi9GYjZCejl1QisxM2ZjUUZTTUZjaHM0VUJ2N3FXVVZSRXhXWTRGRGpyU2NXMTV0UDZ1V2x5L2NicGZ6NW0zMWIvMWhyQUcxZG9EVlQ2RGE5QXJKeEZaUHJnY2pNUnNTWW5DTlN6SmdZS3pTUVp6L2MrY2NlTGMza1lpM2czeTJiaXpUYk9HQk1SNzFMcEdHcWJvOWFBYi8zaW1xeURpeU5mZUhib3hyOEpUVDE0UnhSS3dZeURkZ1VBeitod1FyZnFBY1FHTGZjdTVoWmlqbmMzcFQrc0EyTjd5M0NSdDVjUngyNkhteUdxOTNXbEFBRDRScmtDQzJGY0puR0lYTmxiRVdrWWZHaXQwT0c1QWd0TzJ3eUFLUHhaOVVpTUE5RXRhdTZXSVdWdkUxSVpWK1FiemJoUzBaZG5NUS93VUxaQjFPOWJRTVU2V085Q0hudTdFVXFJQ3dBK2dJUDRQS1VwTmxBb2JOSklLL1dGc1RCLzl4SUFBTTBFK0FqUy95b1prN1VjVUVzRGM3NzFQZG5iZ1RIRmNzWnNCUGUvQW82dnhidGhrWUhYS21nTE5IN1cvZnVJa291QjN4MEVua25jMzlIeE1LM3RPZ0RSNXdSQ0xDMldWUURnK3UvTHNKY3RUUXdVeHFyMmVGR1hoMFVJL1UzSHRJTkkrSDJWWUl3cG8vL3hsTWJBZmVNYlp5eXdmbkdOTk5CNWF2R21kdUR5dFNodEJYN21OWGxYLyt2TVVBQmdpUXBnYkhiSGNDOVpxU2IzWGFuSUEvZUhMbHAwOWI0c2s4bmVDR2xzUGxkcUVnN0FHRERUY3pMMkxzUlNGbHlwK004MGJKS1FFRU9IWjA1MllZeEZ1STJQRWlESndjK3VKUVFBYTBEcXd1eUlYVUdMbHVpTGtrV1NIdUQ4amU1WCtQdVlGMXNwQUhnc3VjOVlEMERkNDFhWUF6MVl1NUFxWndGWVREWGtnL0ZkR2RQM1hYYkxhS2czTWtnQUlLditvekplUXI5Ynp1ODBnemVGWlpwUktFdVozc3VRNzQxcHlScTIyWEsySmdZZXloaWJyK1o0b2NzRDIrVmhzSUdqZ2UvTkY2MjRZM0QvSXhXTXNVWjJuTDNsUEk1MU1kNkZpL1lDckJFbVRrKzdRb3I5SWZDbUZpRThQVVg4UGVXbWNkOWRDZ0E0SllOdjdKdjBjZEF3UHdMWEl5dU5zVWNCMloxNDJBMFJrYStjdytGZUJRQUFaWXhIWUpJUlFlM0NZa2VHNVR5QWdTZ3B4cENYeFFvMURCbHBqUllnaXhNQzJJRVkwUzZrTVI0WjVKUXBNdmlWQWdBcytsTkxBS0NFcUErQkIzQVJHUExzaXVmd3psRUF3UHBjNDVvSjhLNk1HZm91cnlGZE0wNUxBZ0RTNmo4S0FCd0dmcmVjMzBFQVlNazBZOHgvRmJJMURpRHpDTk9STFUwTUZNWmlkbjQxeC9QdGZjc3U5N3BDVVREZjk0NExBSHhqOUpVNUJzZmptUU9XTXpLUmRJeCs4Z0J2RTlGOG1TNWhQbHUzQTVkVGZMNUJJOFBxd0hPT2R5c0FZSW5Wa1B0L0FENHFwajFwb1lJSExpd2F3eDhEalgydEFJQ1ZBVEVIS1NuN3NoZ09nQkM1N1FxaUtRb0dPTytTaXpGWVBBdU9nYStCbTRadlpvZEVwRVJBRnFXaHNFY0FaaDF1SjRmZ1NtSTMwY3NVQUFER0Zuc3lCZ0JIQnBrUUNWR3RrSXAzemhYa08xSDBoT1dHTjJFdWZ3NmtHaUk1VG5rQXlvNS9WOFpzanpDbW13bmFSa0lBa0ViL3RRUUFsaURaSk56bXR1RVNzQWMzOEUyNG9lK0NuZGgyeGNKWWxoZW5tdU1sT1p5VmpOeWVJUUFvZHd5MDQ2aGxzZ09neU9MTXNmaVpaZnM1a3lNdUFKaUhsR2ttYlhwRjhCUUFXSzdBSFNOMmdKT3N4V1EweGVPQzg4dU5qaHZNK25KdXNWa0JBTTZBUUpibE50eVdkU0Vkd2FKSE1MQktiblNPcFRjWjZZWXI1S1pCbzJTRkk1aEVPUkFSUHZrWlFNTUtFUDhXd0wybmZlOTdQRE9WQWdDT0xZNlNwOG1YdnRkakhEYW9KOEFlR3dzVmM1YkQ4VnloRXQ4MUkrOGFDYXdyNUc2emlLR1l6ZktjOWdYS0FyOExZOFl4cG9zSjJpeUZwTEx1djVZQXdDZTNqUUk1cjRGTmptbkptQXZPNmNzcnhuczIxMkM4cElkelN4VUFRRGxqV0dxbWVOaStNZHo1UXpUSG1PcTQ3d0VNbldUcmhzblc0Wm5CQk5Bb0RrUVJBQWpGdjZOU3FyQys4SlVZT2Q4NTQ3WTdsb0RJbGdVQWFIR2wrZ2ZJNnQ4RDVMc05jWFFHQXp2Z1JyZGk2WTJFdHFjQ09ld3o1RGxSZzd6dE1jaFJjN2NLdWFEalFQQ3hoSGhZZzc5U0FOQkJyRmxsdm1KMmlPWFowRytENURva3pmVjRRa3pZRjFZTDFCc0pLdkZaWGl2TFE2TnpnOEI0emVNWlkwR2U3OStoTWVNYTA4bVliUXh1USsxVjZMK1dBS0RCbFlvMDRVM3hEWENGbEUwK1JhUzJSYkJkcnluY2loN0R0aHFNOTBzQkFEN2wySkJMZjlRQUMzdWVQY2JFNHRiQW1mRWFRZzdMUmtnNldBaFBBWUNQQWYvYU1Pb3NxbklUR00rWFk5N1NVUFFsS1pNOUN3RFFhcEFzK0RCUk43K3lOamVJVktkQXdCZExiek5TT2hoc01ERHlIV3lMeHZNblRhRmtzT05MeFh1VkFnQ3dVcVBXSUw0WWRkQmd2Tm1xUzRDSFdJNXVMV3VVQTlzdmhEV2ZFcCtQbzdFUHJ1TjlBN0N3bENlSzVQendEbzJaeEpnT3htZ2FSbE1ocUt6N3J5VUE4SEdSdG94RFJldXFEQU5wYnN5SVNiK21MQ1lrY1ZkN3ZGOEtBUEFwZDFyZ0NiMEFWcmhnMzBqUlEyMGNLdzBRKzhCOGZ5c2tqYm81WTVUcTNlWURBTDVKc3lySklmcS82TG1sV1J0aTMrQVcxQW9BK0VJZ0hHUFJXdlZ6QkFZMndWdHdTRjZUTWNveFpzL0lETEU2a2EzSjhaNGN4WHV3RkhQU3VYdVZZTUZYQ2dDczc1RURyd1lLWkV4SHVKcnhXZGlOamJVYjFIT1RNNENtcHNWZEQ3aGU1enh6eitEWStzNmFIYU0xdlg5OGg4Wk02NEJXZGJSdUlIQTJWS0gvV2dJQXpzYXlzcEhXWFhIRnpWNFpzeWRBNk56MTJJMXFqL2RMQVFCWUowRzlBSmJtRFFNb0JFdDd0TGRLUkhwY1FjSHh1UUhhRnlIN0FNbmNtdFcxQWFtQnFCa3pnR3RlQWNCTHd4MjQ3Mk1PdXRKYThpb0VFcWZvQ0pQWmNFUFVHZ0NFQ0dWcS9FWmNRV1ZRaFhXV2lORGhJMDQrOU9SMXFrdG9ueFlOdTJaOTFmYWVsekYzVmxuZG95b0NnQVBnSGFEaTNDUzVEWjlSenJsMWswWHkwZ3A0Rm80SWFDb0FzSVJ4Zk5vVkhBdEhzSVlJbi9QQkZTQ3JoK3hkR1RNdEYvMkVzeXRxWnQxL0xRSEFDNDh0M2cya1kzZlNJVGJpdVZSWVkxZDd2RjhLQUxnVFFhQmNNMERVZ25INzM2T0xqMVh4OENGNVBGbWNqTk83WHhNL2JST0ltU2d3OUhmdnFnSUFuNEdPczJqTEJRQUhKd2dBUkJISzlBUE9RTnh3eEJXcU1mRUc4TTBicTc3MWV4QjBEZ2czNkpxMUNIcnFqVWs2ZHowR3FhUmFBQURESjB5Q2licGxzcDQ5eCtDMkFFamxJUE1CQVlEcThOK0o4TXBzVWE3dEFySGxENGk0eUZyNVhCM3dYUmd6TFpMZWdtZXNyUHV2SlFEdzJTNzhCcFkzdHRIWllqRmJoaDFIdTFmdDhYNHBBT0NHSjRVUzl4VHpxbFk4ZkNzbVRMTEFWNTNZd0RiSW9rTDF6bm55UkdObXhtdkl6bGl6c2pNc0FMQlFKUS9BU1FJQUlVTFpBVXdneDFZMHJoTjNzOStoMjZzbHduSUFobmpGSUdOeGlwNld1UzNIQXhBS2VhUUpBUGlnWGpReUVLeGJacGRCTm52Z0lTOHhzWWJWc2ZBV2M5R1ZsaWlPNG1Xb215N0UyZUR2Z2lENVhSa3pyVFE5WHdYQ3JQcy9pUURnSUdMTStqTHRYclhIKzZVQUFOUzg4UlhSUTJMa0xxUmY4Lyt6VWlZMTdIa1h2QXpkOGw3S3Z4aW1DeWhYQmR3Q1czamdBUnVkU1RrQUlRRHduY0VCaUFvQnNESlJMYk1BUW9ReXZFMXFPZ3lDZ1hubnIycUhzcDlSMHEvcWlsWDByWEhZT0Rld2NqZ0FIUGQ3NCt6eXI1VUNBQ1RMakFHWGdvVXErTnN3MytRbXViSXQ0dWFoNFZxYmdwaHdOMlNyUENJM25sV2ltT2ZlMG1Xd1dNK3NYL0N1akptR1VNOXVtUUFnamY1ckNRQmFBcmRxVThrTmZyK1M3S2RxamZkTEFRQVhpVmZUNUVxTGExbTNmV3V2V2VtUzlXRHZtb2xuTUNYOVl4dUhpK2lzZkxNVlNFczhjaDVOajdSSWdGb043RklDSTcxL2dySUFMRUlaVm5FNkFKYi9Ib0dCTllqRDdIdElnUHB1MXhLU3NYVEI3Qm1ia1dPd1NiTUFMT2FxTCsyelVnQ2d4WHQ2WUd6V0FYanR5aE1DaXVQRllGR21hOFk3K1dTdzJUT1JKRFd6Q1pEOHV6Sm15SmpxNFJ1bmxRTUEwdWovSkFLQWtMMXN5Z0FBWkRYZUx3VUFhTXE3cjdqV3VDZmVqOTQwUG95Ujg0UWxsQzNCcm1Wb1M1Um1xQlV4WjQxUVJJbjRYcEkwd0RpVnp5NlhZYVJQQWdCZ044NFk1YmdpeWVJUUdKZEt0TmlGLzk1eHhZSUw2TnJoRzVtVmpvVmhBS3lKN1pOazFmaDQxTnl0QUJ0VWRRQm1QYXhWVm1pc0ZBQTBRQXJYUzFkOUtXQWx2YlRKYzl3MHZGU0RybFFHbXhud21GdTc2bUU5VzhWNkhyeERZOFl4cG5FYUYyQ0pHd0tvdFArVERnQ3NZa0paQW9BMHgvdWxBSUR2d1F1Z3RqRWtEclFuZlIwNXYwb2dTbXhqV2U5V0QxOUxHNE0wdkdETkc1ZTdaUXNBK0VxcitrcTA2bVpCOG8vbUcyT3hrYmo5Um4yOGF0UUMwRmgxTDdpcUxaSUZDd0c5a2FaOXIxSTZHN3AyZklJc2xsRStvbHpja2xLT3hKQ1Bxd1NvOVF0VUNkQ25Yb1Z4K0VvQndDTlhxTlpZNjJKQWRRWVh3OHFEWnYxc2JyNmZzd3JuUEhxSHhveHJUS01hbDJCdFMwQUNyS1Qva3dRQWtoQ3kwd0FBV1kvM1N3RUFYNU1YQU8xNVNCeklVbkpGMFIrcnltWlVLajBUd3dla1QxOVZXeE1BV0N4NFRBSHk1WjQvcFV3QWk2VTlZRHlNVDNHdVZnQkE0eXl2d0kyaURVa1dpd1lZME52L0d3K2JIVy9yVndRQVdHN1pVY010KzNQZ1VHYUZ2RGkxQURRL2ROMFYxd0o0N1lsTDZZWjZVQ0VBcUJSQXBBa0FIa1ZrWXlCSTFlOFphdnZPenBWbkw4MjdNbVlTWXhyVmhsMXBRWm1zK3ovSldRQ2JIZ0t6ajIvbE84empaZ0drUGQ0dkJRQm9nUzB1c1cybEp2dk9INS9vRDliV09Sc0FhUmFYWUJMQ2R6T1VYbTVLcldNeElOL0gzUGQ4VEtzZ2lFVnlzeXJhK1dSZmE1MEdPQXp4RTVaUEhBZnkyand4MmJGZzBLNkhQTk1pODZORlArcGNhYWxISm1ZZHVmZ2lMRW1xQWU2NzRtcUFWaUVQakV2VmlVZW5KU01Bc0VlL1AyTVFIWjhBRUtrVUFEeDAvb0k0R3dDYzFBc1Rha2N1ZnVHY2QySE1wTVkwMUhybGNOYVNzaytyMFA5SjBRSGcvY0VjRER3OG1sMVkwUytPRGtBMXhvczZuSDBFNGpRQlFCcGpmT0lLUmJidzNDczNPOEozKy8vRzJWb05yRE93NFlxcjArSkZsUlVIelZvQVhBNDRKRUFUSWh6RnFUVis2SWtsdnF3QUFEeVZjUnZLL0FBY3FsaWhlQ0VpdGxFQ0F3dVFmMzRRa1Q5N1grYXJVVDZzTHI0dTR3UHZCbHl1bGd4cjFOd2hsMkhQRmNvQzU1eS9sS2ZlN0RRUHRVdkdUL3FOTkErOXlTQStya0VJd2hkdWFnSDN2VllXWkFXenRRUUE0SWtyTFFCbGlabnN4R3o3Um15UGhacmVsVEdUR3RPZWlOWU5oM1ExK2o4SlNvRDlMbHdJREZYamVxU2Y3c0R2UlNrQlZtczhIOWVNd2IvR3hidU5jZFlTQW9Bc3h2akEvV2ZwYXl5MFZXa1dXajNkL3JXV1IwaTdnMHZWYjRvOTNuVEZPaXRXcGRlL2Z4TUZBRkZWNm5JQjhvL2VORzRUQ3ZMVkdxK2tvQTBmTHAyd2NSdGwzSTRLQVFBKzY2NXhtUFRMZXczSmYwOG1ZTE0vQnI1QnB5dms0L2Q1UEFDV29pQ1RybFNLT2M3Y0tTcGNoNmI2QnZQRVcrZ0NnSVY1cU1PdXVOcFVIQUJ3T3dFdmhPTmpmV1NnOVZuNlBKa01yeU04Q1krY3Z5QU9nNUUxWXR4YWJjM3ovR2o0bXQraE1aTWMwTU14bWxaeDdDcmp0bFpPL3llMUZnQVh1WnFHREpkQnNFZFdzWmtkRDdDdTluZ2RFYUJkMTlTa1BNOFFqUk9Wc2ZTcVNtTzhsMitmeWcwOUN3Q2d1anFmT2IvT2dGNDY5MkI5c1hmM3RTc3RVbGZFM1ZFQUVGV2xMazdCQWxRdHN0aVFtTksyNmNrblRnSUFCbW5qYXJuSlBqaWcwNUFDVnFPeUFQbmtveklIWTdSb29nN0NldUliNk1MVEE1VTVBTDRGanA0WExjVWNaKzYwanNFOE5CVTFtcEIzNm9ld3lITlhMREtrNmxPelFKQ01BM3h1VVM1NnI3TUZrSENkYVduTFlVRDJ1aEZVQ2N1WHliQVpTRjE5U005aEZjUmhyOWQwb0VWVk5NVDBubmRoekxnSDlIVE1Oa2tlcWF6N1B5blZBQWM5NERZSFdVYWFzVEVKY2Q4RjV5ODJ3OFdjcWoxZVNENFlTd2x6UlRzY3g2cTJ4NFRVck1lb0pnQmduUUVOVXlzSTJBQmlPdWI4NStTYmJNTDN3MHFBZjErdkNnQ2lLZzZoc2hxekY5c0FCRFRCRGMxWHVjaDBSYmhrQlcybWFPTytKTkF4QVIrMlhDbGdkdW1yaTN4V0puTEdGVVFYZE5HRVV1bGFqZFMvU2VobnpoV0syZXhGYktSR1YxeUsrVnlDdVJ0ekJlRUlyUkkxQXJmdEx2cW1EMXlwZHJ3S0lXSG93NXBiZmU4YkFXNklaWERXcFIrdURZQ3VNTXpRMkhEaHFvS3NLR2pWUVBkcGRFOEdibzgrN3dOWFF1dDhoOGFNYzBBdkoyak1wY202LzFvQ2dLZWViOGI3VEc5MG1nZStTSEhmYmZwWnRiZThINm85WG1qdkl4bDFEY1phZ25IUTdSMWkwMmM5UmpVQmdLb050aEJSZmRJVnE2cXV3VnJUczNvVjdLamEva0U0UjU0ckFBaFZIRkxqaW1WeDFYVS9RTGZGTnJxaGNmV2pYV2VYeWsxUzBFWS9HSk9RR0x4Z0tsUGNkQmhHd1RsWHJLZThMcE82SXMraXNvdmJyclEyczhYYVp4TGNuUFNsNVhFM1hIRTUyNmlEVE4zLzM3bmtRa0RhWG9sQjdZWjQrM000L0c5NWpKckdoZmNBZFZxMUNscWNMWUJrYVdjcjV5UUhhWXNZSnJMaWUxdndlMWk3UE1SWGlUSVNsdTRDeDQ3akN1b01ncGZxWFJnemRFRHZKZUFiN0NUMDFxWFZmeTBCQUNzMjRuZkR5bSs2MXZXR3QwbHgzd1BuTDAyTys2SGE0MW4xTzVaZGNYVTgxVmJaaGd5VWJSb250TStyTVVZMUFjQTl5REJvTmJMVlVGVVZBY0F5ZUd6VXU2c2NEcTErV2FjQWdQUFNyVHpHQS9yQW5PZHVWU3RhZ0JpTUwwVU80NVZSaHhpbUpiR3IyWnAwL1BuUUI3QU9wU1VBUDFoek9RY0dKR2Y4L1NZdEdtVHQrMWp3T1ZkY3pXa3ZJdVNDN245bGk1YkRuK2lFVzVzQ2xFWmczTitXTVh4R0RkVVJ0MXlwMXJSNmRpenQ3QjZJYWMzQlRYNEg0bFloQUlEeHZUMjRwU3k1UXUzeUFXTFphc1pLS0F3UjBsMW9sZFpHSVM2ZnBESCsvcnN5cHUrQVBpeWpKUUVBYWZWZlN3RGdLekNEbGQrMjRTQmo2ZU5EVDl4M2h2WWtWajZzNW5nTU5uRHZiN3BpZlJXcjdjZlk1OVVZbzVvQTRDYVF4MW12cHQ5WWE3dUd2UjhnNys0TEdlK2hBb0M3NUFYb01WeStPK1JlV0RUaWYxYTk0bTBnL3EwNmY4blhLRDM3MThSb2pBTUFEaWlOS2E0U29NYmp0Y3p2RHJEeWVjRWN3S1Ryb3BsenRzaERVMFNheWdFd09wY05OMXFMa1hwNTdQNC9FK2ozSUJDYlYxRHlUUHA5NmdwNThqZmw4TC9vU1JIZEFsQzI0WXJMK2JKQWpLcG1vY0hCbU5ZRXVMTldwVDhyL0lIeFBRelZxR2RtRVRhczFpN0gwcHFoZ2pVSUZuMGVuRVlnbTFyRU91ekR5a0k0SFRONWl3TUEwdXcvQ2dCc0FlTTZMZ0FJL1E0Q0FNMmlhalQ0THROZ2k3SHFHeEsvOEphK1NvZnhJTm5iSnpVWUQ4RUc3bjMxMkxMWVdnNHVYTnZHT0xqUDJ5RnNtZlVZNVFDQTBKb0xBWUFyQmdoUXNtMDNwZlphbVd2REVENUY3Kzd4R1hKSEFRRG1NYjRBTjhNSWRiNFRPRkNzallrL3Z4WklNMU1CQk9zUTg3bnY0Z0NBdUc2L09pQmFxSWpET0IxSzY4YUh4TlFMUG9DR0RhS2tEd0J3WDh2Zyt1ZCtNUGRmaXpCOTRla1gzWFUraWQ0bmN1Zy9rSDV2eVNLOExJdjdlem9FNWlCbXRnejVwNmlzeHVJcTU4a0xvT1NqVG1EenEvTGluUFMzNUFGQXpJWmRBbTdHRkRDVmV5Rm51ZDRWRjhoaHNMcmdTaFh3ZkxvTHZ0UzZSZnI5QlNOMTgzVE01RzJlQUVyVy9kODM4cmx4cldHYk03SWdrdjRPeW5uZmdGQ1pGVktkZ3YyMzRzbm9XWVZ4cHVUM0JzRkdvK0JNdGNmRGVEWWUwT1BBNlZtQzhDbzJyc1NxSUlQM2VUWEdZQUR3a3l0b25ieUlDRWRiYTY0NUFBQXVBQWhRRFpsNkk5U2hCRy9XcnVITEkzcDNyeWtBK01rVnk0YTJHdTU4dk5GdmVjaHBGdHQ0R3p3R25HYlc0b29GRURxTjJJMnZzUWVDeFJLU0VIKzBvRU16Z1FDTnNjeTZnc0FDZjB3Vlg3QU9vRTdwVTIvdHoxMXAwYUVGdzZETzBPSFAvZWhCZGl4SGVTeEk4WW1uWDZ4L1BtL0U1aHRnTWR3VVVIRkZidXcveUNJOFE3ZDExVUJBSnZXVUsxVldhd1hQRG10blA2Wk5xald1dGY5SmlGMHhBR0xQZ1JKQ3g0RGYwQU1idHNFVlpIRVZOSEc0YWhKSW85ckdEUzhWaXdpcHNSd3pmbi9TV091bll5WnZ2QWF5N3YrdWgzazlFZmhkdkIwbS9SMlVWRWRwV1NaVjk5UCtzeko2MEE2TnczN29ocmh2UGFSdFYzdThlOGJlNzVXMU5RTHpwY1JvYk5QR09OWStyOFlZZjNVRk1TQkxBdDlIU0o4SzJMV25sTlgxallDTTd3QUUzS0J6dWcxczU2Z3JWcmtjSmZDQ29lUC84dTRxQUZDTit2c0JOS2hvZXdWdTgrdzZ0TnlGcTNCTHNJaURUOGcxMnd1eG0xRDZ6aFJ4RURoTklrbnF6MTI0bVNvSTZJRk5vSkxBa3g0RE9CRTRnQnJsZzkxMWR0R2hTV054ak1vYzlFRU1EZnZoMi8rSG5uNnhjVW9keXNWZWt6WHdveXpvNHdQN2ErbjdZMGl4N0lVVVM4Nmw3bmVseW1yNmJiOTJCZFdzRzdSSnRVaFFGOFcxaGlCMjFRbHpxV3pZUHNoSEhxVHhOYzZsRy9hdXJLOUw4aHpQWFdtTmJXNERzSG5RUzRVbFFOdGRjWVZEYnYwZWt1eTdQbWFTTmtqN0lPditieG5NYTF4clEyV3N6OUR2WU9HbUg4VXczNmEwYW96N29nYkp1TkZHSWU2TCs2RUpEbU1FdzlVY2ovYys2clpnK3ZZSXBFZVB3aGk0WHJzOCs3d2FZL3c1M3o2U3k1RVd3V00xUUU1SkQ2MDVLNnZySzdHOVg0cWRQKzhLMVhZZlFLaERRd0Y5cmxqbHNvL09JZmFDSG9PS3N3b0ExRVhyUTRNRGdMYm5YTEZvRExvT3JUUXRkQTBOR0ttRDkrV2xydERFRGJwb0FRODBQSmdtTWVTU2lYOWNKeER3UXZwOENVem9nWUFSR1hBRjFURStnQjdMZ3J6aGluVVNmQVlWKytwMEJSVzhKOURQWlZna240aExpdnNkcERiZ1dYUXFQYWszL3EvazRQOVVnTVY3c0pHMG1sKzNzOVhVMnVYbjlIbjEyNnBxMW5rQ0FTcktvekxEMkgrM2ZCOEVVaG9EYTRGTnJUL1hTZVBYMGVGL1dkN3hHMXJmblRBZU5ueWZCcGdyTFFGYVQrdkU2cVBUa3liN3JvK1pwSFc1VWpYSUxQdS9Uc3hyWG12ZFphelAwTzg4aGdQeXJIaks5RkJHNld2Y2Z5b2cxbSswVnhBU2JhZDV3OFA0VWczRzR3dUFGZ2pUK2RMMTFlc0tBbW5hZW1tOVlqeWI5M25XWS93eDM5NEh1NlkxQWU1NGdFZlVtc05Mc0tvQS92MWk5NnRxL0hHRndnWlhEVFNvSU9BVnVJVEc2VUJ2OVJCSnhnM1hFT2VZMzVKeEx3Q0M3akFPR2FzaDJud0dMcCtvMysxMnhlcHlsd2tFMU1FbVVFUHpNbUJFWG9JUnRBNGdQYlFmd29MMEdUQTl6RnJGOERiU1lYcFpEdEp2WlFGK0lJaVUrKzJpOWpMR292dFNBTVh4d2Y4MzZmZjN2enI5Yy9ybjlNL3BuOU0vdjh3LzRzcjQzdU1TZW02a0h2UkQ3bmdieERCWXFyWGZjQTJqY3FDbW1SMlArLzNwbHpqOWMvcm45TS9wbjlNL3AzK3FDd0RlZzNnRHVtcXZnMnZvTWJocnNaQk5KOXlROGJiWktUZE9kYVc4Z0p2eFk3blIzb0pVczdQaWZsYjN5cWNBVEM0U01BbTVKZkVHclZLMjdHbjRUdDcxWTNuM3VLNHdqTFZZWWpvOWhpdWN4OC82bmRMc3Q5cmZvaHJqZkNaaGdQTkVnbnJxY2QraTU2Z0xZb212ak8rTzQ2TjNwWnJqVmZ2OWJrSjZKeGFOMHZqbklJVzFNS1NHb1NuTE8vaWR3WUpHRHgzYW9RN1N0bER0ZWZYS05VR3E2d054MXlvdlJFTkREeWtrcGZLMTJ0cklMV3dWOXZMOWZMMnNQeVRFSWdPZkwxazZOLzNnbXJibTFDTGNJVWs0NjNIUzdMZmFjMU9Oc2Y0cDMvNDEzLzdrU29zSXNYMkxzKzdxS1Iyd0RkWTZOdlVnTjhRQkFOYmhmOFBqRXZjZGhnTVViOWFEc1pmaWhDL29ZTHhOSU9BOWNVUDd2QkwxUUg2dzR1aGNJMEFORm5JTjFJWCtoWkE1NG5vK2xEeGl5ZW1PZXNod2ZDQmwvVTVwOWx2dGIvRlZGY1pSNHM0bEl3MnFGUWhjRnRseEFOakV5TFlkZHFVRmxORFlWSE84YXI4ZnM1SzdvWTl4SXNucXR4b0ZVdTFFZ0J4OHdjaURiZ1FnMkFueDNCQW83Nkk4NkhvUFA2VGVJS1Z5akxpTHdvNVdZUy8rZVQwWXZnYldPQXRqZFJIem51Y053Nm80YjV4eWgrRHN4eXFNazJhLzFaNmJhb3oxTC9uMlc4a2MrTmo1eXdqSFdYZnRjSDdpMmZRcVJBQ01Bd0MrOEpDMEhodWt1RjVpVXVwaE9BR01jOWFaSHdKMlBCNk1IQXE0S0FmeUY0RCtMWEtpSGdTRFJtcVNNdnpSWUQyTGlLT0hDSkN2S0NVUTh5MnhvTTZNa1E3WFpZQ0FyTjhwelg2ci9TM09aVHpPQmJnZFh6V0VVSER6VDFDNkl4YUNVcjJDV1VpRHN0UWE3OGk2dmxURjhhcjlmcGczLzVKU2grY3BUVmJ0d2d6OW5aVWVYTzhSUWNIVTBUaWduSlhRMmdNWklpaUVObUF3eFpuTDVDdnNwWTNsVjVFd1prbGpqMER1L1NMb1cweEFyamZPbTRydStCUXZMMWRobkRUN3JmYmMzS3pDV0wvT3R6K0lKL1V6dXYxYkFueld1dU4xaE90dW1OTC9TbElBNHdDQWJ3UjlXV2xhTFVaYW5DODNGSFBPc2RMY0pDQ29WNGE3RDBFQXV6QnZCdElUeHd4eEVoUWI2dmVrcFRHVC9vYmh4dVRzQnl5OHNBcWlHS3E4eElJNGZDQXBDTWp5bmE2azNHKzF2OFZsTVFCWmpmT1RlQmd1MFRlM052ODhDUjdodDEyQUZOZFZWMXl2NFNXazAybUs1WFU0TExNZXI5cnZwN2NuelVuR0NxQnJJRzZsb2tNcXM2MUNWYWdSd2dxU041eXRoWTdpVVpNQlVPN1RRcmMwSW41eXhjcUhLa3pGZWVJS1ZEcWR2N0FYL3Z3WWlMSGd0d2tWeDFJMVRCVUZteU10RnAxVFZhdERuWHJVRmJoYWhYSFM3TGZhYzZQQU1zdXhmZ05wZzE4YWE0QkxkdnZXSGE2ak5scDNzeUVSb0RnQVFGMkdQcUdXUHJvRno3bmlLa1RycmxoNURsV2lsZ0ZCVFFiU0FUVVgxbkpoUGdFWHBpVlFoR3A2cTNBZ29EQk5LSmYrcnNlTnlmb0hYSHBSNVRCVlNsSWxjZmxBUXRkcGx1OTBNK1YrcS8wdGJzcC9QOGhnSEkzNy9pQmdSbDEvdm1Jb0tvRzZaWHhibFNEV29rVWhlZGRyUnV3NnEvRWUxdUQ5bmhvQ1Y2Z0VxbnRFWllkVnBWTDNEMWFQVTBWQ05hRHN3Y0JiajhwSEx4aWduRlhxc0JxYXBSS3A0YmxXQThTZ1Vod1hJUE1WOXRLR1JYRjZJR2M4VG5sc0xKMnVTbnRZVndXTGhZMERLT0ZhSVk4ekhLY3U1WDZyUFRmSWkybFBlU3psZ1AwT1FxbFdDSWdyeEU0YjY0N1hrZTQxck5mamxRR09Bd0EwNW5ySCthVVVXYTk5MHpnTXRWWTRIb3lxT2I0U1V4QW9qZ3R6aEpDWVNnNGZ1TkthQXlFMVBiMTVQZ2k0TWJrb0J0WUEwSGZXb2hoN01MNVA5dmhlUnUra0VvOXA5bHZ0YjZHSXZONlZLbEpXTXM0ejZmT3h2QTlLZDZJOE01ZEQzWWN4OU5zcTBOMlYvN2Nld3dQdzJJaGRwemxlS3dpdlZQdjludFBoUEVaRzhzZ1ZGOExSQ3FQSFkyTUpYd1FBK2s0c3JJS2xVRlh0Y3gzQUNvSnkxS25IZXZhczdZNmtSZ1FBV210aUIrd1lTNGlIQ250WmN1VVdBUEJKcUd2dGt5MEFNUXFjM3NoN3Juc09PVlNWWTF1ZXhqaklnMGp6K2FzOU44K05XSG9hWXlFSDdJOUEvdE4wKytzdVhQNTVsZFlkcjZNT1k2L2htbDlPQ2dDUUxjeEtSbGhNUVRmY0RoejBXQjBQeThUcWh0UUNOM0VsZ1hHU1FpNU1MRktraDRBK2wxYW04K25wY3pVOXF4enlsUE9YeGR3R1Q0ZmVvbllCR1BnS0g3WFNZWkRXT3lFek9jMStxLzB0R0pHbk5RN3FNMFFWNzhDU3VWcVlhWlBXUEJaWjBtSTRZOFpONDQ1aGhKVUZuOVo0ZmNSQXJ2Yjd0UkMzWU13Vmwzak93ZDVYOS93cVhCNjRRaWg2Y0hoZkRzSGh2MEw3N2dqMkgxZXF5N25vU3BHUEFnRGdNQUVBQ0ZYZ1ZQZnZUVmVRV202ak1iVUtxZHJWZGZDZ3JnRFkyUWJQeWJqbjIxeDF4WVZ4aGx4eG1mWnl4aG1odVV2eithczlOOWJhSGF0d0xGN0RmeEh5M3hraS96ME1oQjdXQlh6dndiam9lZklCZ0tOeUFRQ25RckFrTDVaVDNBWGpzRW11Zm93cHJnSTZ4OTlCRUdBVkJiSTJTU3U1TU5HSVlML29tdGwwZGtVOWRGOHFHN1FPYnY5WXhFSEgwRnQvRHVKQlNnNVpCR0NVQXlPa2hnM0xBbmNZaDBHbDc5UkhpRHpOdWFyMnQ3QVFlYVhqdkNKRWpvREdxdnEyQ090OEU3NzFtaXN1TUxYbGlxdGljdnhhRmZXdWVJendXSVhqSWVGSFk5dHROWGcvck5BNFJiSElaWEtmVHdPUVd3RzdnVEY3ckNiSjhkRnh3NE54QklmOEZnRHliVmRjSmhqcnUwOVR2Rlp2aGxrRGdPK0U2SHlEdmcrLzN4SzVmNUhmb0hPNlFtRXYvRGFQWWUzaEFUTkI4ZUlrNDh4QkRCd1ZZTk44ZnVRWlpURTNuSkVWV3J2Vy9NeVE5OG1hSDE3RGYzT0Z3a0hud2RPTzRCYUxiV0hKYmc2UDlVT0thNm9BNEphUkNvR1Ryb2Uvb3BJdGlEWE11K0pDQ3ROQXlsa2dyOEVodkpSMU8yNk00U2FiSVFTV0F5TEdJcm5oTmwyODBvdDhzR0haVzkzUU9NNHNzTThuZ1pTMkRtN1BYWEtmYXZ6VU9nektmYWN4QTVHbk9WZkl5Sy9HdC9BaDhrcm1oeEY1bkFNUzQya0xZR0RRSUN4VFNFdkpoeGhYdmlFQUttU0VyZkdtQStQTkdZUWZyTDF1R2RHczN1K1djUWl1R3ZGSTNTL0thSjcweEM1WFhIRjFRaXMrcWplelBkbG5HcC9GUzhnUzJCMEZqSzhwWHN2bHVodXFBQUMrTVJqZ1ZoWFNHZUEzNFB5c2dyMmRJYkl4ZjV1YnN2YndrSnNCM2xhNWJZRkFmT2o1RnoyLzczdis2d0dla1hxaXNZRGFLcXczWHJjekVXVHNlekhXN3FKQnhHUEM1M0xFR3Y1UU1xbStOOEFmWHpybjRVSnpBTGFNQ2JLcEF3QXMvTkhoaW11dTY0YmJoYzIyQXNTYUNWZGExR1lTVWdObktHNjdiOXlPRVluSEljb3NHU1FKTktnaDRvNEZBSjU3RHJZZGNDTnV3ak5qVHZNUXVUMjN3QTFwVlUzMEhRWkozOG1IeU5PY0t4L3pQMDcvc3dtK1JSeEVibzB6QSt2TE56K015TmxGSGxWVzAyZUVzYWdVOGxtZUFkTllLM3RGR2VFVnlwclJQUGxwTWtBTGhrRmRwRU1wWkVUSENKeG5ZVVRYSVB5WGcvaSt1bUsxVkM2SEluSUdHUkMvRFhybGRvQnpzd2xlaEdtd1FUTVVNckk4YzVyYTJBNmNreXdCZ09hQWE4ajFJUndFZW9nT0drUzBYZkRZb0FlRGE1bzhJMkx0QlU4Y1BRZDlKbWtXSWRUMy9IcUoydkw4dnZYOHpFRkQvcytVd2Z2WW9iVzJBNXd6WFJOVG5oVGh4NTd2aDZHeEpRQ3VtZ0tLS1ovV2ZES2ZCYXNHSWpuWHlwekJTK2V1d2IvcGdxeThWQUVBeHlPd25qVWlraTF3c1U2NjRuSzVXTllXOHlNbmlMbU5FOFczNDVhSVZKbEJRcGhSS05sSzNlRXFlQmNNUTRQdi9jWnpjMUNCa1I0anZvb3hWTXZZWkluSVEzTVZRdVRXWEtXSnlHY043a2NhaUp6VFpxSVFPWk1hUTJVMW80d3c2ajFZQmE0dUM2Q05Nc0lNTGxXUVp4aHlnU2ZKZmIvck9aU3FiVVI5THN4RDJRY2JZUFNIeU5neFdGNkcwR0N2RVI5RkF1RWh4VjgxMVc4SURQUVUyWjBqRHloUnU1QTFBUGdDZURYWDRGczFlRUtRU0tRODhyaUVXWERzUHFYVyt0YmVHd0ZSQndtYUJRQzRpbW8zZVZHM0FIeng3N011VEJ5ZUVZYWhYMFBmaC9BK3UwWjIwQWg0QWRWVDR2dCsxdmRXTVo3T3dIeGFBQUNWLzY0WjVGeUxlS2hyZThVSUlUZGxBUUNlUUNwUFZEeGlIZzUvdkgwaElXNFRjdVBuQVpGamYxdUdlNlBOMldJWlRRYkNISTJKa2xtOEEyTmtXZ1dQaVZKb2FIUlNWd3lQUmJPUkNyUUc2WkNiUUtJYUpRQ1FGU0wzelZVY1JNNXpkWklSK1lnclZxNkxpOGpQdXVpeW1rbU5NSEpZSHNMYXVpRHJPV1NFTVZ5RThYWlZBT3VqZGJrSkJzODZsS3B0UktNT2FmYjJXU3hySmpzTkFyR3h6N2dSTTdqQU9ldDJoVkxCbVBXQTNqd2VTeThmV1FPQVR3d3Z3Q05QQ0hJUmJvTS9TL09Sd2xvcG8rYXFLNGhydFVjY1dKc0oyb1poYjdDS2FrdENBTkRsaWlYVEgzdlNWcEgvc3c5clpvZDRIenRBQ3QybmpLeEpneXVSQkFCMEF6azVDUUE0WTlnY25DdkxJN1lQY3pWbGhNbFRCd0JNZ3VQYi96NGRyR01VOTk2UkQzSUE2WEU1TUNEenhrc3l3MWdSenRmZ0xya0YzZ2xFbUVrTnRIVkQwL2pzV1E4QXNBenROTG55bjVHUm1nWmlJSW9pWVFnZ2EwVE9jOVdiWUVPeTFPbmJnTWk3RW01SW53NTNVOHBHV0c5Z1p5SysrYjhiM0JqMk1pVUJBTlUyb2o0M2ZZNXUzUE1RRnB3M2pGWmNzbE11Y0pOWDdZYzJ6M2M4OEZ3K2REOW5EUUErTTI2RFQraFdoeUZJSlNEdlFRcXlMM3o2bkRKUHpndm5JTTZCdFppZ3paTDNJY1NuaVFzQTZpRE1hS1hGWVU2K2NqazJYRUhuWVJFOGtPdEd5R2ZGZU83bUtnR0FyejFlUjlRZG1LYkxNYTl0VHI5TkhRQTBSSkRnY3BUcU1FM2txd013SkZ1UU03OVBIeDJSLzY0bngxZ0pFei9DSnNrU0pYOFRZRXBic1h4Y0RBM0VWRVdOYzIwVFJIVEpHcEVyR20raTIxbmNEWWtwaGI5a1JIN3hoQmpoLzVCMXl6d1RESlVrQVFEVk5xSlJ4b3h2TTJ4YmZON0FkZysvZ0VFRGU5ZWVlUzR6NjBBY3RBN250aW9BZ0M5ZHNiQ1dwUVEzUWQ2dlEwaDN0WWlNQXdTaTlYS2pKYjdqN28vSm1HME1icVR0S1FLQWU0WVhnZE5XMzFBMng2d3JsZ1RITUdjTzdOS0djWnR1cTVLOTBjeVA2eDdlRVlObUt4eldCMWtNajdNQUFNODhzYndkWTRNaWdzZDg3RFhnQUt5QzV3QVBxV2t5Uk5hQ3FBVktMbmZoMXJ0aXFWcXNjb2FGa2ZyQTNaMDFJcjhMdDlwS051U0RYeWdpUDJsRytCQU9EVlRNUTdkMkVnQlFiU1BLN2t3ZVQrZHVHVWlieXpDWCtNN01CMktHZE5RQjJ5WVhCUlkvbW9zSkhySUdBS3dFOXppUTZiQkpBRW9CMHo1bHV1QzdjL3JwRHduM3gyQ01walZkT3NRMnBBa0FRbUNTU1p5cTV6QU0zSkl4bWorMVR6dGdjekNlWGcxN3c2UlAzMFYydzVXcVptSTRUQytjRDdJQUFFaElZSGNiMzZoWkpqRkg2VXY0UUt5U3hPUWZhNUpyWWFBcldiaDFjTnZ1QkxjMGxrYnVBS0xMS1NLdkxTSS9pVVo0Q3c1MUpyWU5KZ1FBMVRhaVhFaUYxY3c0RERCUDY4RUtCYXBvaStYOTJJOEl5elc0WW1saU5wSnZ3S05aYlFBUVJ3bHV6ak4zK3Z4UmMvYlVGY3RycHdVQXJMSzNEU25iRytzY1d2V2tWazlDS0xBYlNMeFdhSGlYd2xCNkhsVEQzdmpTUHZteXZVMmhRUDYyTCtEYnBnNEFYbmhjWmt5azRzbmx0QnAyMWZIRXN4R3pKcmtXQnZxa2VRQk9FWG0yTHJtVGFJUnpsSEs2QkI2c0pBQ2cya2FVVTNWRCs1T2xnQStNZmRvTCt6UnArS01GOW1TdEFFQklDdmdjcERqSFVZSkRieVllRXBiWGhHK0pyQU5RNllVRHl6WjN3VmhwMnB2UU9mVGFJR09qR0pGRkdOMEdENXMxZGpYc1RaeUw3QnFSLzZMT3JkUUJRSE1BYmVObW1ZeHdWMHpRUlBLRXhBRUF0VERRMXNLdEZRZmdGSkZuNzVJN2lVWVl4VzF5UmlnZzdpRlliU09heEVPM1RBRFNsK3VzNERvdUFEZ0pIb0E0eFlBc0piaU9RQm9sZWw4WERkNkVGU2RHSFlxcktZWWNGenhqcFdsdlF1ZFFTRmVsTWNCM1lzSjBIQTlPbXZZbXlVWFc4bHgzR1o3cjFBRkFpQVNIdWV3OHNibkFBYjl2YkxRNEFLQVdCcnE1VEdPVGRoYkFLU0xQZmtPZVZDTzhFaEVLaUFzQXFtMUVmUndkVHI5VFc3SHFjZjl6cnZNVHo5cERMOUt5RVFKZ0RzQzRZU1RUQWdDNGJxWWh4S0Z0bG14UFNBbU9NNitPaUh3OUh6TUxBZ3MxWFUrUmRNejdTRGxWMVFBQUJ4R2s1ZnFFTnJ5YUFDQjBrZVhjL3lqdW10Wk15UndBNElkREl6ZE5CQjdld0h4NzNpa0RBTlRDUVBzS3ByQ3hZVUVmaTgxWnJnN0FLU0t2em9ZOGlVWllPVFNoVUVDbEFDQXJJNHE1N0cyQlRDSjluM1hLRUxMY25WcWN4NmNMNGRQbTROUkVDenl3a1J5QnNFT2xJUUFzUjd4dUFCUmZtZWJoUUhhRTloR2xnOEM1NHBydGxFYmE4VzZWQUVCTHdHYjQ5QnVhblYzMDZxUUFnTGdYMlNUcHhWVUhBRXRBNnRJWFpuQXdiUHp1VHVEdmZRQ2dGZ2E2S1NMbHlNckw3SmErOElOeWZOTm5wRTRSZWUwMjVFa3p3dmlNT3ZZZXJidUZoSEh3YWhwUjNhdFJXaUt2SVUzMHdKV3FnVnBFM2M0SU43NjF0NXNOOEdtOWgrVTlTSXNFdU8veFVQaVU0UGcyYUdWSFdKN1BiZWVYVk5jYlkyanRIYmo0b21PMUJBQ0hMbHppOXlRRGdMZ1hXVi9sVFZTdXZTNGg2NW9BZ0drUEFOQkpRcExZdHJIUlJvd01BbXRCMU1KQVA0OXdYN0lRMGlqRTRRYzlIOVFuT0hLS3lHdTdJVSthRWNabm5JUFUxZ05Jc1YxeGhkb041UUtBckl4b0hHOGRodVYyUE9FaksxV1grK0k5aVNuR1NpRHNBa0x1YUVUNGllY3Q2eXlBdUVwdzdGM1ZyQnFMZzJQRmpMSEdScHkxRjZleHBIYXRBTUNDc3l1S25sUjdFK2NpR3lyOFl5blhWZ1VBTUFmQUFnQm8vQ2JwcFhnUythVjlSTEJhR0dqTGZibG9NTmV4ck9rRWpEbE5MdHdqVHo1bjF5a2lyL21HUEtsR2VBN1dMNmROcW5GSUN3Q2thVVF2R3puTzNaNGM1eU1DMUZIQVBDUk9obnJwbUlHaUpOa1JZejdmQk94T05Xb0J4RldDd3dPQm0rL25ySVBqVVVMd0dXcGNWS3N0ZzVCamxDQmI2UGRQcXIySmM1R05ZME5RdWJabVdRQXM0b0V1eW5tNjNmUGhpMldGOTExcHNRTTltR3Rob05sOWllcE0yN0NBVWZCSTMxbEZiOWJnNXNiR0NiTVFUaEY1N1YxeUo5VUlxOFEyaGdKd241VURBTEkyb2xmRk9JVlV6aEFZYzNHdGNYTC9xeXpzOVJqaFA5V1VXSkp4c0VTM2t2SlduRjEweVBJOFpBMEE0aWpCSGJsQ3hkUlEyL2RrTzdIck9NbmFpMnBZVmx0RE5kWGtIRmtseFZ1ZHZ3NkJiOTFYMDk1RVhXUVBBMmRoRTVIL3RMWklUWFFBNWowdStHMGd2Mnk1Z2lRc2lnUXR5UXR1UUovcm5odEFMUXowWTFjUTZla0ZsS2EzQjFTeTB4b0hTdlJSMmRzY0dFcU8zYUxZelNraXJ5MEFPT2xHZUR3aUZGQnBGa0RhUnZTV3JMZkhzdWFlT1g4Um40T0FWdzZsVGxXcDB3b3BzS2JFTHBCdGw0QWtxMVVoV2JIUzJwZElYTTBTQU1SUmd2dFpmdjh3b2gyNWVOTG5TZmRIcVBXNlF2VStMZUNUVmRZUnpxbmx6UjF4eFVYWlFub2w1V1lkV1R5UnBQTVpwL0JQbkREMUZjbVErOHBWU1FrUTVYelJhTENiSDkzV0dqTEF2MWZpejdiOEROYndaam5ZRnpVeTBBOG9UdE1QcVQyTEFBTDJJVTYvRCswQVhKczdBRzVRMDEzZjd4U1IxeGFSbjNRalBHeTRybzlnM3lUUkFhaUdFVlhKYU5YZ1Y1QnJzWjMzUFFhUDJjNWFTaGxEQ21vODBUTjM0SXJyVUNCSmRndjJySUx5RGVMeG9NcGFYUlVBUUJ3bE9MVWhjZHErNGRWZzdmaWsrNk1ub25XNzRoSythZG9iUzhKNU5VRHFIbkNGZ2xuZGdkK0xxenRpSGFTWTR0eHRqTE1XTVo5V3FuaW84QThUMWRVYmRreU9QOWJJK2NKbFdBdkFkOXZlb1RBQVZnSGNoVGpHTnJncU40eS8zNUgvdnd6NXpYZzdmbFlqQTMzWEZSZSs2WFlGWVI4RkFWcjViZ2ZBemdHOW05NUU5UEFmZzR5Qk5sZGFjK0VVa1ZjZmtiOE5SdGgzMjgyNStFcUExVEtpVDhGOS9sTDY2cXZBNENIYitTbDlLL1RNcmJwQ2FldERENEZXOTc5NkhKZUlML0FLOWs4MVBBQlJTbkFZSGxtT2FGYTJreFZTU1FvK285cVF6SnNxbTZacGIrSVdsc0txdEVQUzF4Q2tvdXRac2VkSlYxYzc1YXMyeVdHcVNYbWVJUnBud1VoTlpWMkxVRWdzU2FxNjFxMzUxR1ZVRFRCVTBBUDEyNmNCQkt5Q0sxemowZ3N5QVV2MDkrdmdwbE9CREMxMmdpaThGZ1lhVTVtYURCQXdCV2xhcTY2NHBMRyt1NzdiUEN6T1FXRCtLem51RkpIWEZwR2ZkQ1A4eW5QYlBRUXdYbTR0Z0N5TXFCNmNYZklkaHVYdlI0MjQvV0ZnSDFvR0QwdUJxeEVkQVUva2l1eS9iVmVvVzdKUFpOblg0SWxjQjc3QUpJQ0F6aXFSQUtNa2szbCtwZ1BOOTAybnlndzVUc2RzZWhqcXZLVnBiNkxPSWViRHpCTHZZd2JBb1pYQnhYb1RJYkV5TEZ3Mjd3cENlRk0wRHYvOE1vV2E0eGIraVJLck95Yi9IVmN5L1NnTEFPQlRLY0pxZXp1dXVPaVBaZ1dnOHBWbUEyako0RGxYcW93MUxYOC9CSWQvaXl1SWY5VENRRitWT01zREF3U29VWnNnVi9ZdThCeXdqQ3RLLytyaC8wTGU2K0VwSXE4NUlqL0pSbGdCQU45MjEyRWQ2NjAyVGpYQWFoaFJCT3Q2T00rQ2JVRGk3eDZsN3JFbmpnMGVldVlRWkNqRGY1YmkvZXQwSWRrQTRIRUlmSUVWVnl4Zm5iWU9nQThBaEpUZ1hodno0OXZ6a3g1Q05OZlhpRXM2WGs3UU9Lc3BUWHNUT29lUVE2SmdidG5EKzlpbW4wVkZUU1FyKzRSNWRpbk12QVpqTFVYd1MrYnBNTGRTV2FNSy8xaHk5Y2ZrdjgvejdmMkFuY3lWQ3dBNFZZRW5KRWVFUHpRYzQ5REc0S0NjQWJMYUJQejlzSHlFWGpyOEg4c0wxOEpBL3lpa285dHlTQ01JZUNrZkVPZGtsUlpBempEaVhmTDdlUGpmT1VYa05VZmtKOVVJNDlwQkhncUhBbzRQLy84dmNDaFYyNGhhQk9KVjJDT2J6bCtmQTkzL0tuYUNCazg5Y3hobTZKSTVHcEkrME5iZ1pVTTlkdXZnTmRIdnUrVnNnYTZzQVVEVWdZT2labU53aWNBV055VTZUdHJ4WGdKUDZvNW5EdEswTjZGemFJMjhYN3NlM2dlVHNaRnNQa3dNZTNUUGoxR20yaDdZcTV6c2h5M2dzK1hvV1pSZk1oUGpVck1Eeng2M1lOMHgrZStUZkh2UGxXcldMTHRBRFlvNEFPQytRYnhENDdOQkpMOTEyVUNMY0xPZmhVMkloZ1RkZlJxMzFvWFpESWYvUGRud3RURFFaNFZrd1NEZ0dYa2p4c2l6d1ZVUHJiejhPamo4cjUwaThwb2o4cE5taEgxcnB6c1FDdmozd0tGVWJTUHFJNHJtZ0VUOEdvd2s5aE1TTy9tYVBITUlBanJsM2ZyQkF6UkdsNUZ4Q2xWcWhoSWI2elNsZ0tNQVFCdDQwMmFNYkNVVURodUIrVkh2UkJ0bEtmbUtsdkh2VzJ2dnNJeVdOUURBYzZnVERqa2tZMi9ENGN5OGo4TUFHUnNCcDdyWWVaL29YbHVHTmJ3Zm1JOTlDaTNOdW1LbDJGWlBGZ3ZhNzdnbDY0L0pmeC9tMjUrTlo1NkJNM2dXdkxGL3Q2MXhBTUFkZ3dRM0tDOHpDeUFnQjZ4L05SeHJoUGcxTlc3YnVCbjN3NjMvdWJ3b0h2NlhhMlNndnpKQWdHb1JvRkdZQW9QQ0hnQjI1WFJBV3ROdE9md3ZuU0x5bWlQeWsyYUVmUUNnd3hNSzJJMHd5TlUyb2xIcG5nY1FKbHN5YnY5cThOajkvNlY0QWhnRU5NcTdxWGV1VythcG45b2d2UGNDcEZCdWtMRkdZT2dEQUxzSkFNQXU3QVVHQU5ZNndLd2x5emFwaDdRUjVwcERvOWhIbk5vald4VzBjdXlOdGloN28rY1FabjhNMEhka01qWm1ZNFhJMklOMHczNUMrNlFQUXIzcVBWcWpzd3pkN052R09CcmE3Z1hlbDY2cFFRaU5zd2NYN1NBcVlmNEU1TC9QOHUxditmWUhldVloc1RPajBFYUFqOVVlQndBd0NhNURYbUtJUU1BNk1HK1JBWStUc3djZlJBMitwUmFuNlhkMzRQQS9YeU1EL1JtQWdFdGlpQjRHbU1IYnhBSFlNUHBFVjQ0V2NUaDNpc2hyanNoUG9oRzJBRUN6NFkxYkJtRGxNOGpWTnFJV0FOZ2dvNzhHNUx0eENMOHgrUS9GVGo2VG00K0NnSnV5SmgrRGQrNEZmTk5PYXQzRUY1Z0RyOUVzR2VzT010WVlla1R4cmFqaVZhdjA4MHNlRDhBd2ZBdldNUEhGZzMzazZFWDYvUVVLZWNVWk0wbWJwNzJCOWdiWGd1NE4vdjA1VjZyQXFQSHVHK0I1ZkI1QnhsN3g4RDVXWGJFdzFLaUhqSDNmRllwWXRSQUkwSU42SG03c3E5U1daZTduaVBUZEMvdTNYdDVQejlPQkFJY0w3ZUJET2pPT3lYOGY1OXRmOHUyMzlNemRrSFdqRGIzc0wrSUFnS3ZnK2xaVXp5QkE0NnpMZE12ZkNhQWpkZFZ5L24wVG9aeEw0dmI3dGtZRytnTWhXSHpuQ3NXSTBBTVFRclZyeG1IVFJVeE9kT1djSXZMYUl2S1RhSVFYblYzVnJnMXVEemdQSVlOY2JTTnFlVzBXNmQzbWdTQTdERWJ5QmQzK0x3UGIrV1A1NS9jQ0NxN0l1OTJSbjFjZ29NQ3hpVm9iOEFWMEhVMFRDUm1OZFFPRis4YUJXNkNOZ1dzN2tSL25qSjlubTlBRm9HNFNlQ3hUd0trYU11TEJENDE5T0diOC9xUXJhSS9FSFROSm02QWI2MCt1V0xxOWcvYXU3L2Q3WGFuNDA1VVlaT3p4QU85am5yaHB3L0o3M1FZWit6WUFTanhROWFBZUlUN2JyT0ZtNTNGNmFEMDlvdk8weTVQRnBWNXh0WU5JL3Z0T3pxYmpNK3FQK2ZhdnYwcjdqeHhPcXNIL3lBQUJnN0I0WmlLUTBTb2diZHo0UTY1VWdVOUpEdWZFemZGRmpRejAzK1RHOGExTU9oK2lYQ3A0MlhoSFBteWVFNU5UYnphbmlMeTJpUHlrR3VFeDhsUTB3TzBoamtGVmcxeHRJNnFaSWoxRXpPTm4xTyt1bVQ5b0pQbjJyd2J2VXdFQjM0bDM4Skw4M0UzNW5YdnlISTlsN3orVlZ1ZUt0UW42Wk94aElpR3pzVzR5YkI0S2I0MkNhN1dOdnV1d0t4WHFHcVUxK0p5K3haRFJCZ2dnNmQ2NEI0ZHNPM0VndU9uM2FvczVacEttMzFCdnJMcmVjTy9pbkZ2dmgyc0FBYUNQakszZlVROW41WDJNRzIyVXZ2Rkx5RmFwSno3V0RRSUJlRkQzd1Zqc1loK0YyL3NBM0xpVjlLM3I2ZTZ2M29ZL2NnQmZrc1BEQWdIZHdMd2RCVU0wYlNBalJFZStqYzhGRHI2WG1OOUhOVExRNzRteCtVYU1FQllrUXZlM3VoT25QZS9JaDgwRFZ5cmplSXJJYTR2SVQ2b1I3aWRROUJSdXBaMWtrRUlHdWRwR0ZOMmN2dmxRbzk4TjN3TXpmNjVUcnZQeDdmK3ZrdkwwaVZ3TXZwRy92eUEvZTFWKzc2YTg2eDNwNjY0clZpZHNBUnVtdDY0dVkxM2NCZENzNzlMbmlvVzMrbWp0UHFkNWZXWDhQSzVCM0VQcXZ1WDJFZ2pTRFhCUjBvSkw5UVlIZ2xzbmZLODRZeVpwT25kNlk3MG8zK0dlZ0RDYzg2N0E3K01hMExWazhiQlFaYkxkRll0TjlSdnRGWHpqZG5oT0ptTmZFbzhUZ29CNm1TdDlmcDNmWG8rYkhiOVhDNUMrZFQxZGYxc0F3RGZpZ3I5TUlLQWVqRWNuRU96VWdBd2J5SWpSRVc3OEZ2cm9IUE43djBZRytxOWlkTDZTZWNDU3hJMUcraEhHYndZTjQ4WTNHM1hsZkhHS3lHdUx5RSt3RVg1cHBJMWE4eEJsa0t0dFJCK0J0NkxkTXg4djVSbGJaUjRhRFBLdk12L1ZEdnp4VjZkL1R2K2MvcWtLQVBqQ0FBRjN3T2czQXVFbUNobjF1V0tGdXRER3QxQi9MUXowbnlYRjRrdnhSaUNxWmFuVGJvcmZkQm52K01pNDJXZ2U1eWtpUDBYa3AzOU8vNXorT2YxellnQ0FvdmdtWU5LM1EydnpISERYZ055bUx2eGpwdUp2Z01DRHFUeG8ySm5GMjBFczNnNWc5N01McjRjT2xSZVVIdFJodERiNE9YUTlXczkvVExiNDNUSGhJdC8rUmRxL3l2LzdvNFFNUGdHUHdXVzVNZDhuMTJPNzhSenRNSmYxQXJ6T2V3Ni81OUJQcHh4dVhkSmVnc2hNQzNBT2NMN3ZDd2hvaEc5cjlZWHpiVDJ2SHRwSjMwMWQreHpmZlIvbStiY3A5dnVSQUxrUGhOZnhsNWg5ZDlDYzROeTJ3cnJSekpYYjRObkphcTZmdU9JQ083NDEzU3cvRjdYK3NXOWR1K2NvekZNUE4zbUxzTVI3emhmbWl2UHNyZUNkd2N0RjZMbXZVRW9nMmhDck5VTzZNWUpOM1BONjhmamYrZlp2K2ZZbldUK2Z3ZDY4V3VHNFp5RER5QUxucUdzdzZBbWRXQ0d6bjhoMnFPZVdzeVI4Nnh1L3d6TUd5eG5QZDFaemZTZUZaNjMwT2JLY3Q5K0JuY0h6azgvci8wcTFqMXNMQU9QOXZaN2JWWWR4NitaQ0JjZUc5L2ZHNFk5NXZNM2tMdFJZRzk4YysrRHZCNDBVaWdHSW03WlFtSUpianl1VkhjYm4vMXFlLzJOWmxIK0ZBK3EzOHU4YWwvd0lzZ1orQk03QWs1aHhRZHpReXIrdzNOOXFpSHRoZmdhbERjaC85N21DRFBBemozZ0t4a0gxcGo1QS9id3lZcDVjY0NqcHU5VTVXOC82VTVsREJRSnA5WHRHTnNzWE1FWlUzNzJCT2VrRGIxR3JLeFoydXAzeFhEK0xlRzcrK2FqMWp6LzdoWUFtNXJzOGg5Q1psYkxFZTg1SGRIM21rc1hHZlRGM2Z1NDRYcmtRV0hsSWV4NEpoNytXSEdzRTkyZGhiOTZ2WUZ3ODNPNFk0VGxVTnB3RW50SUVFUSt0OWM4WGh3YnlmdlpFck84ZUNqK3hCek9yK2M1cXJoK2s4S3lWUGtlVzgvWW4yRitkcnJqNFZ0bHBnTXgrdFlRRkJqMXhkNzFGYTR6N1EzbklDeTZzNU5VTE1mQVJWNnJrTmVZS2V1K2N4ak5Oek9rdUVrYXcyTHRZZThDcVBQYWRiTlF6TXRrZnl3SDFaMm52eS8vN1hINUdTVW1YUVRlZ0lTWXpHSm5FQ2lEdUJBaHd3ekEvS3JPcjh6UkMrZlEzblMyZjJnZmZkaHo2bW9CWS9ZaXpTdzViYlBZNDcyWVZlTUY1L3N3Z2ZwYmI3emxwWjJtTXFMNkhnYjh3WWN3SjFsckFtTDRhNEFjWnpYVXpIQTdXYzNNNTZORDY1NzQxM0hlSlVsNVo5WElxWXM5eHFxdHFlVVE5TzVObWZheDdmdTQ0dkJ3ZldNRnNFdzAvbm9QUTNPOEZqSDRrZHV3NzRNQ2dVRnJTY1ovTFplZ1M2YTBndVZpVlMyY2hLMGpUSjZlTnRObm5rQzUyM2NPYllhWEUwUHIyRVdhem5PK3M1dnBwQ3M5YTZYTmtPVzkvby8wMVpQQ2hFZ3NCWWMzdGNZTmxyV2x1dWdoYjRSYk43ajkxVlZ3SkdNZ29MVy9NbzlYRGJzNFZTeWd1a3ZCT040akh6RkkrN2l5a0ltS2FGZFllVjlmUFdVRmNlbFA5a0ZLU3ZwV2ZPUysvb3hvS2oxMXg2ZGRRYmpEbUVsOGg3a0l6R1hNdXJMUUl4bUhlbGNxcTNpTlBCQlpRbWFDNVhoU0RnNFdhK0htblhISFZ0aVR2aGtEcm1qSFAzOGlOdmRKK3IwRGpNYUw2bm9MVTFubWFXMTEvSTY2NHJMTWFtbnZHMms1cnJqRmRkTkt6cGlmaDI0ZldQL2ZOaEYvTm5rRVJMaFY3Q3UyNU5yQURTT2lMZW5iT2ovZmwzZk56eDhuTVliQXk2SXJMY1NQSDVVZHdzYjRuZS8wekFFZ2NIa0hER3pVdWdpUW1GbHZxbXZPa3NhSTZLaXljcFgzcWJmZU9rVDdiU3g0RlhvZTh2cTJVMllhTTUvdjlqT2E2SVlWbnJmUTVzcHkzajF5aFFOc3dmTitLcElCWmZXK0pjcXhSVWxXVnlwcEl0SURaL0RjaURLUlZ6V3NOOHNmWHdPaW9FcUVLemxqVjVMaUl6QnIxWTVVZmZRUWZYSkhmWlhtWDd5VXM4TG0wcjBHVTVMTDg3QTM1M1R1Z1FSQ2xEc1pxWXRlTXRMMWU4SHB3YWVVTm1RY3RyOHdLY21nTWNMNm53TWlnWkxQbTdHdHRCM3pXVlZlcTRwamszZFJRM2FkNVZqZmJlWm5UU3ZxOVRZM0hDUFc5NmdveXNUd251bTcwRmpaS2VmcU5Cc3FQTzllck1lWWFpNGpNd2pOcVd3RU5oMzVYV2pvNzFMZVY4dHZrYkpHcW5jQ2VheWRlallLQXFHZG5oVHlmOGg0L2R4eHREZ1FyTTVEdWk3TERxclNHNGN1UDVUYjZ0Ukd2eC9CSXJ5dVd4RjZPQVpMT0crbTVYRjlERlU5VldWWC91UTU5RGh2QUM3a2JySjB4RzdHK3RYdzc2NWlvbHpmcitUNlR3VnczcHZDc2xUNUhsdlAyT2RtME9mbU9GUlVEYW5kMnljS2NLNWJ6blNDMHhmbjhad0dsc0lvY0cwaGRtQnN3bGlySjZlTGZsci9YQmF3L3czcnlQYzZXMTlWK0xNT2xwTFluc3BIMGtMb3BFMzdSRlFTS3ZwRi8xeHUvQ3BHb2VNMFRZMk5iK3VDV2N0OU5qd3NXdlI0YnJsUnB6NmNoWDBjQ01qamZxanFZYzdaaW54cUlYWmpuRUFDSWVqZGRJMDlrTGVBODZ5SDlZd1g5UGpZYWpuRTlvbTgxaGlqdHJCTFhPVmRRZWx3RUVQQ0t3a2hvZU5PY2F6NUVWMkVOWUdHZFNTQ002VHZpWHRGMWduMWZnNXVqcGZmQisrakkyRWY5QnE5R1FZQ3ZYcmxQSTkvUzNyZm1KS1J3dVVsZ1JSVkQwVVBXQVJvTDl3eTc5YTNjUmkrQ0cvaVJvUzB5N29yTHBldVkyeDViOHlNY2NIV3VWRDRaNnp4c0FnQ3lnQmZYR1hsQzNBMlUwRjR5MWpldXcyMVhLcHVOK2lwWnp2Zm53RU5KYzY2ZnBmQ3NsVDVIVnZOMlR1Yk1zbWtWbFFOdWhjV2pCVzgyd1NCdUVtcjNWZkZDTXAwVjY3SU01TEdPdkdyR3EwWTkvcmVXNzlTS2NscmlsWXVLK0FycytBQkFzMHp5Yy9uWWVxRG9yVkpUMDM2QWVPazErYnY3cmlCRjJpaDlOSUg3M3FvUUZpcmVvb3hnZEZkakdXVFYydWY2Q3hZQXdQb0ZxQUNvMWVTMFdobjJwYytuQmtqL0xnNEFDTDFiaXpIUGRURFB0MlR6bDlQdk0rbVRXeU93bWU4Rit0WjFuVFBtNGdEbWFFZm1lY0VWMTQ5dm83a2VTakRYQndCdWZIT2RwQ1QyQ054UWNPOWlCVXlVR3I1TklTZEw4VE8wajlSdGlid2FCQUUrQUhBVUV3QWNlZWFFRDlBQlYxd3ZZZ3ZXelRaNHlNWU43dzFxa1NpSDZRS0VSbTRidDJ1c2hhRUYwdFIrNFRyaDhxNld1cWgxTUdBRnkwVUFpTDVLbzQ5ZHFib2xGOUhhQmJ2S2E1QUxaN0ZOeldLK0ZmUi9EUVRvbXluT2RXTUt6MXJwYzJReGI5ZUJZNU9vQ21VY0FJQTF2Y2RoMCthZ1U2N0FGeUxUZmU2S3F3dHlyR3NWRG5RdDhhdlY3YlRZeVk2eGVIR0RzREZPQWdBNEpRdlRxVGdWNWpLNVRMRlVNS1k1ZFVLL1NRNHpURk43U2E0ZC9RWmFVR2ZiQ0pHd2h2eHpWeXFGakl2dUNFRFZPcmdHRll6dHczaVZBZ0JybmpIbFNGUHFrdmJiNmttanM5STlmWDFyZFVqZlhPd0M2RUxReVdFd3JNM054YXVPSXZvL2tEVnF6WFdMSzYxcHdWVXgxOEJ3Y1BFc0xZNjBTZlBYNDhLRnY3RG14eHJ0b3pWd01TcXZadGlWQ2tsbEJRRHV1bEs1NzJHWUh5eFR2UWZ2UHVQeDNqeWdkRkxsTGQyamRMcDJ3NGJwM0J6QzNLQ25DTjI1SVFBd1NZZTkzc2hYd0lNVUFnRFBLQ2FzM0kwTldNTzc1UHJIL2Y3YThLcnFPa2w3dnUrRFMvc2NYYW9lcHpUWDlTazhhNlhQa2ZhOFBYUUZhZmJMV1FDQTU4YnRjNWtlY3AxdVFVeW00K3BGY1dySmE5MzJEZUFhTE1JR1dIZUZldHloMi8rTEJBQmdBRkxwVUtnbWxBcHp6WWlYWXBvTnArZ2xPY3c0VFkycnF1Rk5iaFdJWkQ1eVl6T0FPU3lHdEFzSDBxYk1vL2ExNElyTDdyNUpBUUJZcVc4NHowMnd1Sk1DZ0c1UHlwaVY3dW5yKzAzRVhLZ0JmVVB1YUt5N1lOVmFXSTg1MS9oejFsd3p1T0RTMXZzVUJ0RERsdDMyYTY2MDVqaURjeTc5dmU2S1N6bi83SXJMZ0cvSU84dzVXMG82S3dCd3l4VVhMTU9ZOXlSNEZyZkpTTFAzeGtycHZBSVpOSnhuL2RJVHJ6OHc0dlRNRlhsR2ZUK2xDeGZ1MFIwSVBXM1QrdkZ4bUY0WUZ3Y3VnYjRCZkpaNVYxd2VlUjl1cyt3cFNuTytOZVNxdWhHWElCVDFFTHpGbGM3MTR4U2V0ZExuU0hQZUxBRzkxQUZBQTZCU0t5N0ZMa2VzcjQ0cEtWaS9tQ3ZwY1o5dkRQY1RhdFFqOFcrZkRMRUZST0lBZ0hFamxXN1VoYlhqNzhBaWJZaElzK0VVdmJqdWJFNVR3ekRNQWYzdU5LUkpXdW1OUHZjaXVweVVRRFlKenowSDRPeXdRZ0FRbFhMVVRTQWdDUURRSFBWUlQzb1p6MGRVM3p3WEU4YUdQNkRuR0lZTnFnY1lWbHM4Q013MUVqdERjOTBJQi9TdzUxdmluc1Q5dFFmalczc1cyYzFxNUdiQXhabUQ5MmEzTWQ0b2w4bDFxZHlnckFEQVRRcVp0UkJEVzhPTGZKanl3ZFpsZ0ZDcmI5UlZZR0NlZzhzTE12V3RiQkZmMzMyVWNiRUdmQ2l0b3JrQ0FNNjZlRm5laEEzNFhuaHBtb0Q5UGc5QTRTakFGYmxMNmNubHpEZnFpQ2dJd01PLzNoVlhjS3hrcmg5VStLenR6bC9pT3U1enBERnZyNXd0b1g4dkN3REFLUXRqeG8zRHVrMTBnZHRGOHhaVnZRaGRVNVo3a2hmbk9PUkZvakhMZ2J2VVo5VGFZd0lBWDByV2xQTlhqM3RBOFNtTWw0NEJXRkZrdlFnMzlEZ0F3SmVtdGtSenBhVjdRNm1OamE2MHBybmxFa1lDWmI5eGdGVUNBRUtwYjVPRWxuWERKQUVBZzNCZ3pjVkk5NHpiOXpBQU9qNU1YOFBHbWdHMmI3dVJmZUs3b1dQL2NlYTZQb1kzQjkzRDB3UkErRnNQMFUwSk9RWlR0TjlleHdpTjdBVzRRVmx5QUo2NFlxRWgxRDZZZ01QVXltS2FjQVhkREFhaGNmdWVOL3FlVGFsdjlRNWgzM09RaW1yMXphbWJ1Tjh0ejIyL1lSdVFrR1o1WEZBaFVnSDRTTXo1UmgwSEJBRngrdmJOOVZSRTMwOG9mNzhmNHZpK1o4Vk1Bc3REWXowSHBzWmpEbi9VdTQxSFBJdmF5VUVQeHlaMUFNQzVxZGFOZytPSlNMemc4cjQvQUNQK2xjYzlpVzVWWmpJajIzSWZDREp2Q0lqZ3dSUUZBS0pTc2tJbGZWa2xEZlVTRmlGY29XbDY2L0JCb3dCQUtFMk5BVUNjMUViTElQaFEvb0RoTGFnVUFDeEhwQnhodkt3TGJrTnhBY0FZelB0YWpEbEpHbDdvOXh4Y1BqS3BiOTFaTjZva2MvMGt3T2ZZcHQ5YklNQitaT3dUTFBmYzVBSDcyd1FVTVhReFQ2R1Ixd0Z1VUZZQXdGTFEwOWlxY2hjd2hWazVDeXV1VURwNzJnQ2h6OTdpdm4xcjhNZ2dFUFliWGw1T1M4UHdxbFZjVFFFNGx1ZjJQVGZxT09CQi9Temp2bEVJTFdsS2FpdUYzNUw4WGdPbEVVYTkyd3E5bTU0WkN3U2dFQVEwWkFFQXVINDgzemh5dE9GbmdaQ2lybGFVQlAzUmc2TFd5WGl3eTJQRVlGdnVHTEZQUkxVYWo0MENBRkVwV1lqcUJtQkJOVklxNHdDNVROZU5GTDA5R1d1ekRBQ0FhV3BxTkYvVC93dWxOb1lNZ2tVb1NoTUFoT1o1bTBnekkrQ1NqbnRJSTRwZnAxUzN6WlFBZ0FWWWZXUlM2NkRqbnk5M3JoOGFXUVpXaHM0V3hIZDlJYnNSSW9reWQySEIySnVyZ2RESXRuSERSSzlnVmdDZ3ppQldzWWpPRnJoVmQ4bWR2dW9oYmJXOHhYMTNKRml6cjF5ME1NMEVYSUllTzd1OE9nTHd6WWpuWG9DRCtoV1E5YkxzRzRYWmtxYWt0bGJ3ZTQydXVJcG5PZSsyQlplWk9WZGE3djFGRmdEZ2JzU05Zd3RTUnZqdzdYYkZrcUNxckdmRlVkaHdvVGRoeUNERUlDdVdiOE5zdUVNQVlKc081MTBnMTNFcURCOU9UYlI1UjR4RDZCREFDY1pMOTR5WWJSd0FnSWZuRWZTOUQ5a1FTUUVBRzRRc0FNQTJIZnI0RG9kd3NEQXBMZTRoamJIU0hEd254dkxMRFFIRVdVZHhBTUJ1U25OOWo0aFJWcDQvZWlhV0tJV1RkUUl3ZGh6aUxod1lucjcrUUM3ekpvd3ptREVBUUtNNmFMQ3FkNG03Z0x5RmZVamJXblNsQ3BwdmE5OXg1cHBCWUVpYUZ0M09kVVk2M0F6WXZoMnlkYXlsc1EwSDlTUTlkNVo5eHdFQVIyVUNnS01ZQUNESnUvR1pjUUNYUndRQnFNS2JPZ0JBMXFLUHVMZEhONDVwNDJhQnVaNHRIZ0J3UURIdFNYQ1BNUGxLeC9JUjR1SVk3Z1BJNTBiWHZ4cXhBdy9IWVJCYzFDM0c1c1ZEeU9vZmI4S0hDUURBR3ZXQm9HZmRGU3YzelVRQUFCVjEydkc0Qk5NQ0FLK0JPR2JOTTdMZHJiUzBPSWMwSHY2Y0diSUNvYVRoaENUQXRBQ0FMd1JRN2x6ZmNiYTg5SXduenJ0aThIVlFLZkFsZU9yYVBBY3ZlOWp3Vm8rZVBIWWJNNkJMWWp4N0V3Q0E1NEcweTMxZ1ZHczY4U2FFRHc4SmhQTGN2SzE5ZHdUQ3JEdWVOWXRxZ1pQVVVKYldTdU5lSU51M1MxeVJEWGl2QXlMQ1lpZ3F5NzVyRFFEaXZKdkZzZG1rdjk4a3ZwdDZjRklIQU5mcHh0RkpzVkFydGpobnhCYXhRRkNMeCtBZEdHNzhZWEJ2cnJ0aW9adjVDZ0VBQ2pZc3VXTE5kNHg3SHRCaGc3S2JvUlRKQTBDanFMTzlSS1FxMzNPangyV2FmdDhpQVdLOUJFNFo4WkVBZHlqZk4yME93TTl3RTErbGVWNTJwY0kwVEthTGMwZ3ZHSWUvZFF0NEJlN1J4aFE1QURzSk9BQkhLY3oxelFBb1g0UVEyUUc0RFhjalFMcW1TZmtrZjYzbjdqZlNtTmh0UEVsdXlpamp5Zk1ZRndENGxEYlJHN0lPbHdaTktXWTlqUTNEYS9HMjloMFY4dU13RkF2VExFSmJvTVBHNG9wd0R2c0djVVVXUFhudXJER1FaZCsxQmdCeDNtMFRlRkh6RkE1aUc4SWU5OVFCQUJhMHNZUWwyTDFvVFRvWENHcEpZUEFtQ0dnd3c3Z1NBTEJMT1pzVHdNSmNvSHhzaStQUVlRQ2lOU091dmtBcGNKaFdGU1ZxMHcycGJlUEdmTEhIWkJ5eUpsZzBJdVRldGJJQUJsTElBbmhON3YxcG1JZjVHR1M2T0ljMGdqVzhFVmx4UU13SlRnSUFmRmtBaDNTb0lqaGt3dVcySitOaUtHRVd3RFVnRTNGZXNwWHZ2d2tocnFnd1hSenlJZ3ZQdkF5NGpZY0llTVVOall3YXJQUVFBUEJKNk9iZ0JvMXBrWk9HL1RydzdNTzN0ZTgySTlOcTJ4T3lIVEwyTzNvY2ZHSlVGbGNFMDF5dEZFUG1qckhITXN1K2F3MEE0cjRiYzJ4bWlIaC9ZSEI1ZXJNQUFGZ1dGS1VsTFFJZnZrQ29RRkFjQUxEZ2VYR2VvRW9BQU1kaUI0Q1VNUnNqRi9hbGg4em95N1VlZ0N5QnVFSkFiZkFPUXpFQWdJb05ZYTEwVFJGcDhSaWJ2UURCQzNVQXRsM2xPZ0FqQUdqaXVOTGprQXUzNGZ2dkdJUkNaZ0kvaWNpWlBhUTBWSndMRGtYdGUzZ25yUzZlNWtLb2Y5OWMrMEM1VDZnTFJVVjhxcDFLMUkwVEp1THYzdU9LSzh5eDIzZ0kwcUY4eHZObjQxQWFBNExoU2dRQWlFclBXb1dNQ0V3UGpiTVAzOWErUTJ2d0lNWWExekNvOWQzWm0raTdUTXdaYmRrVGtocXJRdCsxQmdDaGQ5c3p2Ti85bnZEeWtZZExsRG9BdU9BSzRnVlBuQzF4dW1JZ3kxQ0JJSi9jcGNVQndQaElqaVlvVFFDZ0IwNG8vbW01MmFLNERKWWJPUzRBcUhNRk5jRHVCQUJBM1gvTmRPQlo2b3VyNERwSDk5TWl1ZFpVQ2ZCblY3a1NZRitLQUdDTHVBYnJCaXVhYzRIdml4czl0RmwyRFRjakt3R0dVdXFhQXdTOTF3bjZ0K1lhTmRLamhMcU9QR0VzMUN2QVZGMHJUTFR0QWVjRHJsUm5mcEVhSzNPR0FBQm5Mc3pSbklUV0g1TnhWWU5qRnR6Wnk1UTZobFZHUS92d2JlM2JweFVSV29PTE5OOE1WdlZTRndjb2hocnpWUEJiWnRsM3JRRkE2TjBzd1BMUytmVkVkaFBZNGJJQndEbFhxTWY4S0diNlVWU0JvT2FZQjZlVjg0ODM2aW5ERmJacE1KekxBUUJ4RDFvTFlUTlN4WjlQQWdEUTY1SVVBS2hZMFdNNDhIemE0Q3hSdStVS21nV2JyaUE5R3RLbnJ3VUEwT2Q2UTNGL1ZFZERJUTZVRzcwU3NWbjJpV2lFNU10ZEFJV3MxWTNFVjk3c1M4UjVDUFVmbXVzcjRwWGoydUw5SHU4VjM2Nlp5S3J1L3h1QlcyTlVGZ0R5RDlSdHZKRWdDK0JuRjEwZllUOUdGb0JQM0VYWGNZNVNSSGZCZStuYmgyOXIzMWJtRmhjUjR6VzRTV3M4WjRRS2VxaGYzc2Y3eG5OYXpmY3RzK3k3MWdEQWt2RE91YkNlU0U4S1hLeXlBY0J4QVorTHJsQ3d3a28vU2xvZ2lEVUZGZ3pEdnV6c25IODE3cGE2bGUvUVRYTGdKRDFvNDRZeUJzb0FBUGNyQkFDcU5IWkREbzJvNm1CN1FFckUxRUprM1I2ZUVBRHdNeGkvZlRxUWx5bXMwMDN1ZjYzakVQWE1PVXEvd21xQSs1UmxNQUV4OVZZaTZPRStVY0lQVjNGTU10ZGFsRWFyVHJKNkg3c1dmUnlXVGdCR3F0UGgyNXU3RVdHaUdjTlZtd1FBdkFHUWVRQ0dmTS9GcTVCbzFTekJ6QkNzdElqbFVYZmc3ME1INmR2WXQyOE4rcW9CN2hzcFp4c0FjT040Y3Q1QW4zR2FEd0JrMWZkSkFRQnhVak43SVFSY013QndyTjEvWHVLT3Z2U2pwQVdDbVBscUNhVmczV3VzY2E3dVM1K0NvT1dPcllVSDRDQUZEMEJhQU9DYWhIS2VBSytBNjRPcjI0K0ZpN0EyK0VrQ0FQOE9jVzEwbWZOYVlYRVVKYVBlaWZITW5MS0pBbEdiUnBZQjZrTThkY1VWOVZEZ1pjVXoxN21ZYzIwVnBXbDMvdUpEUHErY3BkVFpSRG5LNklWRHp4YUdpYmlJVVNqZE1Nb0Fic0ZObHdXNU5pa1U2T01Bb0hMbWpwRTJwdTcwWlhqdXVISDZ0Nmx2YXczaWZ0ZTg4eHdCcnh4a2oxalN0bTB1V3VocU0wR0xBd0RTNnZ1a0FZQzRIZ0FHOWxVREFNZlYrODY2L3hUd2lSdDNqQ29RNU10Slo1YjBsck1yL1kxQzZHSERJTEZadWExeEQ1eVFmdnRtUWc2QVZhem1wQUFBL1hZcVFUa0xqSHAwU2F0VTczSktKTUMwQU1CclNwRmlMZ0RYNHNiOGYrV2lKSlV2Um9sb2xoeEZwcnZLZnFKbS95c0FBVGpYYThaY1IyMXlKZisxQWdtdnp4Vks5K0xlMkkvSnk5RmFIWTJlUEdXdUJiQU5ZU0lFU29lUXByVmtwQnZHTVo3V2ZMTTIrZ3FCQzk0akdKWmsrV0tOc2MrNCtFVzUzc2ErY1ExaXV1WUU4RFZXd0c3dndEclVNVFZyQjJYUW0ySm1peXpHYkp4aW1HWGZKNGtERUtYRzJrOFgyTGlrM0ZRQndPZjU5cTM3VHduZmEwYmNzWndDUWN3ajRQemxJMWNzYmJ0R3hEL1Z5RjQxRG1pckhrSGNMSUJCWU9seldNUEszYzQ2Q3lCdEFOQkFXUnlvUW9XMTNPZXB6Y1hJaUtnVkNYQUpiazJvMnhEaUF5Z1pNR2tCSTV3UFRSc2Q5bVFaM0tXREdsUGx4bDF4b1Nqc2Q4WWxLd2FrZlk2Q1oyeVdBRFVEWXlzelIrdmVZNGlQbGNxd0d1Q2g0VGJXR3l1R1ljcXBCc2p6UFFzZ0ZROUJWSGxyRGR5VUdBRHBKV0lpQVp2K2JleGJQYlphYTZBVHNvbkd5R3U1QzE2b1RjTnVjU0UwSDVuTmttUzNtcTc5R1ZjcU1wUmwzN1VHQUtIVXpEM3dYakxIaGttY2I1d3QzNTQ2QVBnazM3NXkvMW5FNTRwTVlLVUZnbnoxbmRIVmVBU0htOTY0Rm9HbHVtYWtmNjE2QUVjY0hRQXRzR0NsSGxxOEJwOE9nQ1g0c2dBSHhxVFJmN1VBd0ROUHZISGRGUXNpNlVHa0c0azVBanRsSHRSWkFZQXB5aGFKeXdkSVVzSVkyNWdyNkNSWUpVMjEraVdXZWRYYmVpL2tXNDhaZmNlSjh6R1pVOWZVRE56czFzR28rL1loYW5OY0VjSXZnaGIwRXMxQ2JCckRJai9Ed2JFRkhobVVYdTRGd0JIWGVGcnpQVW9OTlFaOElsZEhkR2hvdGJocGlvY25PYVRmbHI1dkFGY0VRUUI3ZDFiaHUrNTdEaFl1aGQ1cWtOUFkrNG1saGtjaFRSUkRFRmd4RVhWanN1cjdKS1FCUnFVSFd4eWJXZU9iYjd0U09lZlVBY0NIK2ZhbCs4OHl2aGZCc0ZWU0lPaXh4NGlob3RzUnVCczFOcmdKb1FHOGlYRDZGOGRqbzVRQWRiRm9LZ3dyOWUwSE1oczRCM3ZKbFVwU290SWd4a3VqbEFEVEJnQyt4YnREOGZSVlNEMWFneHZDYXc5SzdUa0JBQURGbFVKOEFIVFZKeFVDMHZaS3Zua1hHTVpuUnBiQlRZclhOME9zdmxmNndYN2pFbjBzRHMwS2ZMTjErcVp4UzNWL0IwVGZKbUlnajRIcmVkbjRidWcydHFxVjZYaEpqQ2ZQZHg4MVhYZXRFVGRwVnVURUNudWI0SFcwUkoxNjN1SytMeHNnQUczMkdBQUtGT1h5Q1Q2cHBQdmRHTFlmYTZqTWcrZG1BUTZ5SEtRaG9uY3F5NzVyRFFDaTBvUDNBaHliRGNyV1Fqc2NWVCttYkFEd3QzejdETWlBUDduS0N3UTlNY2dwVThRajJJVWI1MnRpZDJLQm5SMjZ4WSs1NG5LeURSRXBKWHg3WWQxbEZKZXhZcWd0QnZrS1NUeVYxQUxJQ2dCd1d0QUdjRGYyaVdtY2d3VzBaL0F4TkU1VmF3QXc3b3BGZEN3K0FKUDFra29CcTlaMmh4eU9MYktPR3lEZDhwWVFaaThBQ0ZBRFhPOEtGZmZhNEJrNkV6SjlmZkt4TzBBc1JGMEhYeUVyZFArZmx6MSsyeFhYSys5d2hYcmxvM0FiOFgwM2RMbGE5Y3FUR2srZG56WUEzTnBhNVJrYm5hMHRza0Zwb3JnUE40bGwvenJ3REc5cjMrY0JCRHh3ZHJHblJZOEh3Rkk5VlFCdzJ4WHJGNFJTRExWVStTcUEweTBJazFxZTFTejdyalVBc0FqMFN4VCs5bkZzZHVFczFBeWt1SGE0YkFEd2wzejdXTWlBNTJSQlZWb2dpQlVGeDhGOWpqbi9HM1FJK1pqWWVQZ2pVL1c1R0xuUWdiTUZ6OHFwWHBaM0lXazFRS3pjaGYzdlVTcE9OUUFBY2k4RzRkQlVqOGMyc01ZUEtVVW9COGgwSHJJNzFCTlNhd0F3RkFCZ3FCNko2WHErdmc4Q2hLMG1JTExXeS9wNktBZnBEVG44ZjVUYjlBWEkyYjhqUnZpSi9ONHo2YWZKeGF1TkVRY0FjQlZMcm9RNFFNRDRvZXpseTdLM3o4aGF1U051M2dZNVlOdGRvUnh5blB6bGZzZ1Z4OFAvWHNCNEhnU01aNVBNRjdkR1dlT1BBeUhGTFdkWHpqeUFHOWVXQzljamVGdjdQdmJhcW1nVWw1Qm1vU2ZrQURDQmt6Tkdicm5TS29aV2lpRldRVVVkQXl6Q1psVXl6TEx2V2dPQUJ1UHNpNU9LemQ5OU5ZRWR4dlRSeEFEZ1QvbjJnWkFCdnhQamR0MVZWaUNvd2VQNjJvUmJ2Y2I5Vnd4VzhKckJ4QjZGdzErWnFuVmlkSzBESndmamJFYWt2eUhBWUNQYVNCK1VhenR2ZTlMSU5seXh3bUU1QUNBSEIzTWNBRkFIdDdwZUlLUXBxWElGWFA1YkVIWlpKMzRBRnRmcEJKYXhiK0hGQVFDNUJBREExKytJS3k0Y2xhTTVzbTZYM0RlbUVGa0FRQS85UjdLMjdvcEJ2Q1lINlhreHZGL0tmamt2UnZnbk1jUjM1ZmNlZ1ZlZ3hSTVg5S1V5K1FEQUZvVExOcHhkQ2JIRHlQMVh3UEtGUE90MStidEg4bncrMWpmbW8xdnBTeS9BTzZKNkZKYnh4SGUxaktmR25iazlsRDF5eHhOUzFKVExUZGlEQndEQWMzQ0x6QkhwR0crTmIydmYzMEhZOW9GeFlVTmJzdVZKL1dON3B4a2pVU21Hbk9aNlFKZUpMYmk4Y2JwdWxuMUhBUUJjMDBrQVFOVHZLUURnZHd1bFl1Tjc0YVZYOXpWbUlGbDJXRU9EbUQxVEZMcU5Bd0IrbjIvdjVkdW4rZlkxYUFMRUtSRGtxd3ZlNEVHaWVNZ3ZRbXgzem1DbXo0THJWK09GM1dCNDZtWENieFByY3NtWWtGRDYyNExoWFdnSDc4SVRjT3YwQUdscUJtSTN2alN5WlZlcStUMFpBUUNRdUlPTnk2NitNQUNBM3VxYVlRRU9nbXRYWTd3NkowdkFqV0RtZTZpeW5yWHdGZ2l0K3I3SGt2TVh0NGpxdDkvSWJQQXVmbGNxYWIxQUtVUnpSdHhjNS9TV0dNSnJjc3YvVVc3UjM4cmgvNGtjcU45SUd1MEZBUWcveWUvZEFoRE5NYytvU216UFBjK3VhMm9KTWpxNEVtSXozZjZ2Q01IM0szbm1IK1E1cjh2QitoQlNBM3ZKeTRWbGZ4ZU5HNk9TRE5VN2N0bHdmL0tjejlNZXdJUG5GcldiOHB4WEF5bVg4N1FIRVZTdFVxcm5HdXg3ZEgrL3JYMS9DeGUyKytSNXhmVHRaVmczeXA3bjFML25CQm9mZ2kzeHBSaXVHZ0FQMHd6bjRZQldnbTVieG4wekFPQXdBNjlwTG1wWDd1L3BHbzZUbXJsSzMzekRTRCtlZEtWMVRobzk1R0RNbnBuR2kyd2NBUENiZlB0enZuMGtodTJzaTFjZ0tGUVhIQSsxUVhoNVBPQm5JTzFsM0dpandNVFd3amR0Z3E3MDhMOGppeFZkU2RhRVRIdlMzelNOaEwwTG1FditBT0tsN1VhOGRDYVExbVE5eXlpazFkMXpwVkt2bzBaSzFDeWdRWTd4M29FWTcxMERCUFFBQVcwVU1oV21vQ2tiZFFTWTc1MlU5aFpuNFkwQ1VQTjlEelUrbUJLVXROOHh6eHhOa3hlSG1lNmNUalJ1M0p3eGJuNUpEdlp6Y3R2NlNqeGxId3RvL2tqNE0xK0pNVDRuUDMrUnVEUVlSb3BUaTczUjgreFRzSjZuWEtFUWoxVUowYnI5ZnlpQTVRZmE0dzJHbHd2SHd2RjhOMGIxam5BYTZnUzk1NFFycldUNUZJRHNaV2lYNVBuUGUxSXVoeUdyWjQ3QUJvSmFMclF6U3ltR2IydmYzN2ppV2k2Y3ZqM2lpa3M0VHdHcmZ0QkkvVU9DNjkwWUtZYXpjS0ZBZ0RjSFJORVIyTHRxdjdQczJ3cUhxQzJhTnRZMGVnK2FLL2k5T3ZCV2hkNXRPdkJ1Zk9sOTVVcnJuRmpwd2RqVWh2LzlMSXNEQUg2ZGIzL0l0L2ZGbUgzci9BV0M0dFlGZjBxL00yU2tSSTBDa2FqZmFLL2tKYnFBa1BWTUpob1AvMHQwMngweEpzU1hralVLTjB1ZmQ0RkpVeGd2SGZJQUdBVXYvQ3pEdEdEUnk2TGlQZjJlbEtoaEF3MCtwQlN2NndRQ1hraS9MMTFCVEdaQW5odWJWaGpzSStaN28zei8rekVXSHI1YjFQZGc0eE8zWHdSZ0kxR0xuNWp1V25VTDJ3QjRJWm85Y2ZOdjVZRC9RbTdReCtHeXY4cWUrWXY4OXljQ0RNNklVYmE0Tk0yVUpzalAwZy9QWFdjOE81ZmlIWUxmWWJCMkR3N2xjM0Q3Zjg4VmRELzQ0SGhPOHp0c3RBRlhxclZ3Rnp4UTM3cGlJYXBYeHJ0aWFpVXFOOTZXbS80UGNnazVLNkdXNzJSTzcxSEtwUXFvNkJvYk40REdHS3lUTVdyb05YbGIrN2JTdDdIMkFKZHdIZ0tiMjIyay91bGw0c2VJRkVPMFVkYnpqOE0rVjV2U0JtSGJMUHZtOEhVSHBlWmFlNmdiT0JEbC90NWptVC9mdTNGNjhJUnhHUm1qUzI4bkhmNFBuQzBRaHEwWHpzd1hjUURBditUYjc4U29mU3lMQ2dzRUliRWhibDF3L0IxOWVldUE3d1ppQTdjT21keG1tWUI2T0l4dXcrRi9EbTY3M1VZNlVhOG5KYXNmVW8xQzNvVnI0Q3JWZUtsdTVHNFBnUEdsTmZYU2dyMUJhVmx0a0VKbXBVUnhQdm85V2ZDYTRuV1pRSURxeUt1Y2JBYzhON1l1bVhPTCtYN1BGUW9OeFZsNGJURytSemVsMThYdDl3V2wyUVVYUDN5dk51bS9pOXBMVjZpcTJCaTRPWDhzdCtmM3hGdjJPd0hPdnhNT3pYc0NCRDZXbjFjdXpUVzY3V2lhNEV2aldUcGhYVHcwbnIxYjVrZGJOenovQ3dKck4yWC9ucGREK1hONXZqKzdndTRIN25IMmNuWFJXRDBFeGw4WU4wWUZHbld3UjN4ejNnR0EvZ210WStWWGZDbHorYm1FSnpIbDhwa3JpQTdoSG1TZzBROTdueHVXMDM1Yis4YjA3ZXZnVVh4T05nclhqQUw4VnRqbkdzYTVMamIxckNmRjhBV3MzNTRBd09zbmtLRTJTeTl2V2ZaOUZjQVFla0o5YS9vbEFZaHlmMC8zblM4MWs5T0RCNHdMQUg1ZnRFdi9sWDc4cTdULzVEdjlwM3o3TnpGa0gzb01HQzVleXhqMUFPdTZ4V1AwckFPK0ZaajIzSjdMNyt2QnI0U3NtL0tSTDRyUitmcFhwMzlPLzV6K09mMXordWYweittZnhBRGczeUFUQVBVQXJzTHQ0Q25kSksyR04vV0g0RTZxdEk5cmREUDRXTFFMM3N2b21aVVRvV0RvZXdKRGloRDFsc1A1eTIwQ2doQ1Yzb2JjY2IyUkhZZGMvcGh2L3dyUDJ1ekpoN1phbTR6ZkF1K2hhUEVoRWJQT2x6RUc5djlDZnJmQjZGL1Q0cjRYRjNnNTd4SjZoaGI2UmxuMVgwZXBmWnJmejU2VUZsZlF2UGQ1clZyZ1ZsNW5FT1hpZkE5K3RnZkdqYW5WODE2WVAvOVk5dmwvejdkL2x2MWV5Zm91NmIvTWQ0bnpIVnZKdTFIT09LcmJvRG9JbjhuZSs0TjRjZjRoMy82Zm1NL1Q1dnlpVUQ5UnVQQzVQRXVjZHl0bkRoOVc4TDIrSlEyQnU5SmZIYXl0RmtQTHdscm5UUkYyNTlzSzlxeGxnN0FFT25xQ0s3V2hMMlJ1R3lMZTVTS2NhL2NoMDBmSGJ2WFlodzc2RnFGM1NmbzlIeVJkUHdnQS9pQ0hxYm9Ha1FSNFA4S2xGTWM5ZUsrQ1B2RHcxQS93aGJnRU5lNmE5alAvSHViamE0aXhjVHczNU9MdUNyaUh6c3BCK1pIRWtIOUx6MnE1d2ZzODdtNTBCYk5iN3pIRmdwT08wV3U0bWtQQ09Bb0N5bm1YMERQd044cWlmLzFXZVBoelJUNTB4YU43RnNNK3J5REUwUWtidFp6dllhMmpSeFJYN1BhOEYzcmpHbVdmLzA4STkxV3l2a3Y2TC9OZDRueEg1amVVTTQ0cUlhcHIrMHZaZTM4V01QVFBBbzdpUG84dkRIZlRFMHJwamZPTnlueTNjci9YZWNOVjNVQ2htMjVQNkJUWGVWY011M08rZ2oyTGRocmQ0aFlYTEEwYjJoN2pYUlRvUFlDTFFUT0ZML284ODlaSFkvbmVKZW4zZkpwMC9iQVEwRWZrK3Y4SjJJelBBcVNTT0FTaEtHS0tydzlyQTU4RFVwQXlyNzlQK1puL0dOQkY0QnpQd1JoRVB5U0lvQ0xicCtMSitBTThxNDhBT09vaHZDbjNZc0FnOWpUU0FrNDZCaE5lb3FSeDFjTlJ6cnVFM3BHL1Vacjk4N2U2NG9uWmRoSVpid1JJV2FoblB3WUVwVmZPTDVZVDUzc01Cd2hLeUN5MlNKWkRrTW54UXZiNS84cTMvOWNnL09ydFArNzZMdW0vekhlSjh4MkhLTDJ4bkhFZUU4SHdhd0UvZnhYdy9iL3o3WC9FZkI2TGlLc0V4cnRHeW5DSXJGcnBIRDZ2NEh2NTR0UWRRTjRjREt4emZaN0JHSGJuY2dWN2Roakc2WS9JQnF1R0RiME1YaDdrYmIwRW5odmFCNjUzTVVMMjFIcVgyMlY4ejhhazZ3Y0J3UHZnUnYvQklBWWhTM3ZFa3dFUVNoR0tTazNoUGdZOWg2ZW1DRjJVUS9RSE1WNlhVbjdtdU1xSW9iUkRYNHJJRFFobmFGclduMXl4MHVDVWtkNDI2MGw1czFKN0xIbld1MldNZ2RrZG5DTDQwbUNuS3ZHc25IY0pQY01ZNWVtbjNUK21aZDRJc0xhSElQVnpHbEt6c05MZkxNeFpwZCtEbisyRkt5M2xPK0ZKczhUaUtNYy8vOS9FMWYxckFManEvci9rRVpJSnBYRnkvMG5mUmVlMVAvQTdYQTJ3dmN3NWUwcGFHUXErM3hOdjMvOFI3MGljZGNYQ0xOaS9sVEx0UzFldGRBNjdZRDJWODcydUIxTHhCbW1kendiV09hY1VXdXY4V2dWN0ZtM1FHQnhpUFlhbnVGSWJPazRaU3AwR2NMOE9OLzhtSTNOTGkzM05rSDJZZy9URktHMmJCMlY4ejZha2V3TUJnQjUyNmtabk5xbm1hUThad2hKUklpRVBZNGhUWUI4enh1R0p5T2dXeEoydnlPSzZLWCtYMWpQL3paWFdScmpqL0xVUmxqeGlOUGlCOEtad2hWS3ovdXBLU3c2dnhtaVd1SWRWb0VWVDI1S09nWUl6bGtoUWwrRUt2VkhtdS9nYUMvdTBwdHcvQ3pOaERxOHZiMXZYMHFvckZvQmFnM256RmN6QnRMZW85K0JuYTNHbEFrR3pybFJzaW91amRFaU0reCtGYjZKazN5K0I3WDNMRlZjQURRazVXZjBuZlJlY1Y2MFJ3citqRXNkWWpycWNPZE9DU05mbHd2Q3Q3TysvRVFDSXM2NjQvMWJZWHo3UnRFWFAza282aHl4VjNnbWhxYVRmQzFueWVQZ25XZWVXcUJEYkhiVjU1ZTVaRnIzQ1N5S0RnRXBzNkNLOWkyL1A0am1naDcvcVhVeTVnc0FYQ2ppeGJWQjdHbEszVGZvOVh5VGRHd2dBTUM5WUQ3dEhoQzVSMDFoTCtxb0tvRmF6WXBsUTFaVU9TYUdpdkNLV3hSeDJ4U1ZHbjhvR2V3UmlDNWJzYWhyUEhGVWRrU2NhNVg1M1hFR3RheFJ1Q2syZW5Ha2xKQ0U0V25RRmlkQlF3d3FLS09PTGh3N09YNUl4ZGx5eDVHeVVRaFY2YXNwNUY5OHpXSktiYWZWdlNUT3ppcGVsM0liRm5uYXArVXJtRHBQUnJvdDREMStkQXA5TUtiNlhWZVV0Q1FDd0pJR2oray82TG4wMHIxb2pCTCs5RnVkQ0FGRE9uTVVGQUZIclNtdWVZR2xXVkF5MVpOTlJVcm1TT2VSUzZIaTVLT2Q3M2FkOGR6ejg1MXloZGdpdTh6MVk1Mm9iVUZhWTdjNEw4SHlXYTkvWUJsazFZZlFiWkdWRE8rbGRVRFFMaGRzVXhHSjlHNVV5VnR1d0RlK0NDclFENVBWTytqMmJrKzROQkFCZnk0MzBra0ZrNllUYkJsYzF3aXA2Qzg2dVJhNnhFa3NLRmF1NmNaM2tjVmRjMi8wNXNOeVZES1dGVnhxQUlKVEdNMy9pRWRoNEJ1N1hZVmRhNi9tTks2Nk9xRVZwT0NSeTB5QWtXUi92d0JWS0dsdE5peGxoSVI4OGREaTBrWFFNcS84Vm1MY1JpcytxKzZxY2Q3RmFFZ0JRVHYvV2dXSHBlS04ydXhabjBXcVZYR0JLLzkrdThUM1FhRDhMdk1kaEdRQmdGOVpmVmdBZzFIK1NkK0hEQmd2amFIVkhMTTQxQ29kS09YTldDUURRZFlVMVQrYkJQdUhheDh1SFZUanRUWmx6cUZWTmZWVTZ5L2xlajhtZURaSmQxc01EaTZaaHBkWWorWGNzeVl1RnVIb29oRnZ1bnRWeDlweGRGUlp0WEJZMmRNaDRGMTl4T0swTGd3VzdEc0EySE1KWTI4WWExKy81b296djJaeDBieUFBME1QL21pdlYvKzhoSTZpM0RheER2dWlKZTllN1lwRWJScHBvVkxGNjNwSXIxa1hYRklvT0VJTnBCQ1l4cG1WMVZQak1qZUFSd2RRbzVqRXd1bi90Q3FVOWRiSXh2TkJ1RUpMT0MvajZOT0xqYmJ2aVloNWI0TTNZaFUzcUt3M2JIdVBBc2Nhd1NnVnZ1K0lxVlJpZjFadFEwbkZDTFFrQUtLZC9QakI4bGJ5NGVwc1d0RUtkY3AyelBmb2ViTFQxUnBFMkFQZzVZQ0QrUWZRK1RnSUFHRElPR3pXYVdnZCswYmdkdGRZSUFQeEh2djFmVjZoZ3VtUmNISjQ1dThRdGxrNy9qNGh2RkJyL0NDNFhHQmJyb3pIamZxODZWMXFsY01ZVlY2ekRRNTczRFZaQlpiczlSb2RaWFpsN2RodHUwWWN1dW5KcnVUYlVlaGZmbm4zcWJGbDhyRTZLbFRxeHhEUE9HMTlFSndsc1ZCVUE2T0YvQjI3c1ZnbkxaVGlzTFpTT0d4VmR3cWh3MTBkdTFRVncvK0VCalpPQ0tsZzlFSmV4K24xVnhqTnp2MmZBTU41MHhWcnAzY1JqV0lkRE9BYzNHS3hSelp2aEhoaWo3d1J3eFBsNDJKYkJIYjBOSUlBck0vWkRDQ0xKR01zUXg5b0VBSVYxcXRGVDB3WEdOdW03aEpvVmMwMnovM255MU1TdDViMEpZUkhWOHRaWUhScFE5QWlWOHg1cEFZQmZTOHJiYjA0QUFNQVMxVHhYRytCU3RrcC8xd0lBL093S0pYdXhLdUlZa1FHdGcyRU41dTZvQWdEd0gzQm9yTks2N1NuamV6R1psTzNaRVhnZDFpQVdqd1dLRUJCYjZ4eTlxdVhzV2VVZnJOUGhpdUVoOUhTV1kwTlhZNzRMOGozUUM4eFZiZy9CVTZIeC9nV3dEMnRncnhXWXJCaGdvNm9Bd0pLNmJUTTYzSUNZZ2crbFd5bFBHSlBIdEpJeElBQ3RBUnJUQTJhR2ZuYVVpQ2FoZnVNOHM2OWZGQlZTVXBoMU1EQzQwRVd3QjJQeEFrTDlmcXpSSHZmamFac0dvbzRhR2QyMHVIaXhkSENTTWFhQnlhcnh3SnlCK0tmSkMvQ3NqSGNKdFVrS05ieEl1WDhyYnZrU2J2OFlZMzhOdDhCbElQS29sdmNVaGJid21aYkJxOVVIT2VMVkFnQi9rSVAvTDBJNnJSVUFHQU5pMHdZY05uenpHb2REcEQzbVRUSXJBTEFQWHI1ZFkzOTFneGV5MTNNd2NCOUo1dkJuY0ZmaitzUGJkdEx2MVdTUVNWZmdJcllQZG5nZTJPdFRycmkwK0pibk1FT0Mydk15OTZ4bUlDekMrZkRhOE1Ub09pbkhoczRhbnVoRGcrL1JDNTRlWDlsczl0TE1rSDJZTnV6MXJzZGVWeFVBM0hLbHhXNHdoOVZpRlM0bFNIbmltUHdjTmF1MDY1S3pLMkZOd09hTzZ0ZjN6Rkg5b3JiMmZmS0lXQWVETHY0MWNGZFpScjhEM09SYWJVNDFBWks2VUlmaHZaZGg0eDY0MHRMTVhXVXNFTzEvQXI2UEdteThDYUduSWVrQlBSU2pEVkxHd2JNTStzZkNORnhMZlpGYzFId0QweHpsUVFwdDRVMktpVHNoUWx2b01PdUFsaFFBdkMrSC9zZkNjZm0wUmdCQTE5STZnYW90SS9iYUM2Qk1NNEZxQlFBMklaYUxvU2tNczZISGRJNE9oaHlFQXNxWncyMlBWd2xEQWVVY0dBT2VOWXUzN0VuSVBjZFVXTjloeG1YTG04dmNzeU9RUnFuMkIvY2hFekxMdGFFWUtzWTl5NTZlamdnUzdodmo5OVRHREpGSGNRczRGWnNla216VkFBQUtnSEROKzJtWm5DVlhxTk8rUm9kcUtPV3BnUmJhZ2l1dWI0M3hlTTUxNUZyWTFnZVA2cGY3ak5NdkZrbkJiSWdlejhHd0QwUVlEbVd3bXdxNUVhZ0prT1RqOWJ0Q1ZTbGNVR2tDZ0I3SUNSN3ozQkFzTDBkTHduRmVCWnArWTY2SWxmUVFDTFV1VjF5WWhsT3FMSENGbm84K2NEKytNbTRGbU9FU2g5R2VaSjZTQUlEUDVNRC9TbmduMzBpckpnQkFzcFFWVWtKZWlaVk9kaWREQVBDUGdiNFBJQXhtaGRuMG9FTjMraUtFalE0ZzdueFl3Unl5NjNpVmlIZEp2cGVQekh4Z3JIUDF3T21lZVdWd0hBNENOL1BXTXZkc0wxeTQ1b25zbWpPeXVKS08wV1BzMmFoNWl5TGg0dHJRY3NVRFlFdngyVERMb2FZQXdFcWZHd08wdmdZUG5JT1VoaDJLRWMxNVhLcldnKzBDVVdJSmNpSkhqUmZmVGZEQjAraVh5NlN5dTJ5R0RrTWtGbTRBS0FnUmhsQVQ0SWNFSHcrVnBTYmhZTjR4UWdBTVBNcTVjVExvMllCWVZ6a2tQWFlIaDlvSThVbzBGemN0RDBBLzVkOCtwYzJOYThWM3cxR0owaTR5cUl1dVZIZGl0a3dQUUdpTzRnS0Fid1JvL2lCZXB3dlFxZ1VBTU5TbmgvODI1U2dQUTF3ZDg2KzFVbDBXQU9BM1FvNk1BZ0I4MEMwYWdIblVBSTY3a0ZKWENRRGdVQjhUcHBOOEw1OGIrM1ZnbmJlNll0RWg1QTM0YnVhOW5uQnkxSGZyY2dXQkhkOUJXd2tBUUxsZTZ5WWZCUUNzL2NFaG1ubFhMSlkwQk40V3RnMDFEUUhVR2VsejZLcmJBZmZYUHVRMkhsRDgyMG9GU1lyK2ZDOWU2UWRQMGkrblErS3RsdDFsQitTK3hIaXhqekRFbWdBL3hueVhlV3A2eUd4QTZNRnl6U2NoQWJMeFZMZm11T0VtMndHdVJ0TFk5bHlNTnUxS3RSU2V1UFE0QU13d2IwaUE3c2ZBUzhGbFBVY2h4b2dOWGR0cHpsTWNBSERlRlJRemYzS0ZNdGZhcWdFQVZ1a1d5K200eVBXd0ZOZ3Vad0FBM2hOZXhCOWpBSUIxQ29GeHZKdkpmeHd1SzVjRGdPKzJDV1MxSElVQ2tud3ZYdWVXVGJSNEE2aHpNRTdyNzhoalQ1UHlYUWJCYlQ1c3BGTWVrVzFOZWg2b3ZQQUloVFBXQXdBREFRQjZDWmtMWnBHRWtVTXg0V3hWV3VRNlZaMEUrTXpEQ0VWWDNaNHJDSnlzUVdvRC92MG14YjFmbGVIcVBBa0E0S3FSRHRscnVOdzFkVkUzSVM4R1N4T2cyOW1hQUZIdnNtNjBUY3BMenhscFF1V1E4OUI0K203RWJ5clk3R3N4bStYRmlFc0VpMnFMQm5CNVJzWXR5dTNZRHh5WnlSZ05aYTViVTV5bk9BRGdxb1NjVkxQK250R3lCQUJNc3ZLbDR5TFg0NGtyMW1EL0lXVUE4Sm53SVk1MU9ENklBUUJXakZzOTdtMG0veDNRalJDSllwV0NxRU5uYTZmRS9WNmRIcUFiT3NTZlJkeUFmU0E1Q1Vka2traTEwd2F4OXNEd1B2WW1DRU5OQThsNUZnaU4yMGIvTTBZNk5XYURJZURiSWJLbXBnbXZTZjhJQnBRM2gvVldrT3RVVlFEUVpPUzNXL241S2dJejc0cFYwVUtNeHU2M0VBQmNGOE5qcFVNeXVRZHYzRlpxb0k4d2hHbVNWd1B2Y2dRaEJhdWhLNVZGTXZyaE5sVmZwdkZzVHpoMzdSSHZzaHV6K1hnTTVlWVVjL081OXhnQXJNT05pOTJiNnU2ZmgxUkFYMXNnWU55UjBqenR3bG9MQVlEYmNnZytFdTlUSGJXbnJsRC9JQXNBb0dsV2IraFFuRFU4TWNyMTBBcWFWMXloRW1oYUFFRGIxNUtGODNrTUFMQUVJVEJMNzhOSC9sdExFUUJ3cWg3bjRDY0JBTHpPZHozckhCbndXWHFJckgzRHFiVnZLamhubG8yMkNxblUrNTVNRDA0RFpMMEhGZ0xhazM1UUZBekJnQ1VWcnA0dlhmOVZCUURzNHNaRmh1a2Rlc2lOQXp0OHljT1F4Y1h6dGdFQXpZcXdsTDBzY284YUFVc2N5TXJMdHpRQnlnRUFCd0FBZGdDa3pWTXViaVVlZ0RRQndCc3dxRkd0SEFEd3M0dW5BTGhiSVFDWUJnYnhMQmlvVUV0Q0Frd3lUOXBlUndBQTFmZFF3WnBtYWxvTFBRc0RqMFlSQWM2R3N3VzVXSHRkdzJUZnB3UUF0RjBRWUhFdUFiamd3eDF2M3o3N3NKd2lBRUN4bm4yeU1Rc1ZBZ0RmT3U4QkRrNVdBTUMzYjdZZ0JIM2svSXFJb2YzMG1naTUySElBb0E5ZHNSWUZlN0xWWmpOZmpxV0FsUytISW0ydklYeXVIbDJVVm1mWjRhb0NnRlpYS214Z3ViajFRZnNOOTBjdWtEN3h0Z0VBTGVzWnBlekY2VGhUcmxRZUdObnl6SXhGVFlCS1FnQTVJM2VYNVVLYlR3QUFpTnJzMkRiS0FBQ2hqYzR0RFE4QXo0bnZjTjR2TXd0Z00wR0xDZ0dndmtjblpDNTBBWkd4SThZM0x6ZUgvVFdrd2xrSDE1VEIvcStIL2FHbHBpc0ZBTml1Q1IvaWNvSysyYjJQZTl0SC9sdElFUUJNdVZMbHVRTlhuSU9mRmdDb2hnY2dDdXdldWxKNWJldVNFeUlhL2w5NUw2dXBQUE1lZUZFMVhYeWN1R3dLU2wrQW5ldHhwY1dBbHNDenNHV0FBWDRYbGgydWVnaWduUTY1RmNPRnhhcDJmWlFxWlRGSXh5R3U5ellCQUN3cDdGUDJRbktQRldOZUl3K0twUW1ncExhN1paQUFGNEFFaURuVnV3SEFVU2tIWUk3QTNrNEZoSi9GR0kxQnpJdVlhWURMTWRxU3N6VWFPZ09rUjE0cnZtSWRPYmhaSEZVQUFPTE9VeHdPQUtiNDloTnBjZEFWbDNsTzA4RC9CNjNMVlVxclJHbHBKa2xxWlRRTUJWUUNBTGpkYzRXaVlqOGwySU5yaG5kMEprRCtTMXRMWVFvSTJoZ0sySURESndrQUtJY0Q4Q29sRHNCckY2OWdqM3JSbGlsZEZHL241VndNOXVpY1czREZRbFNvUmFGckVYVnlocWxwT2VCWlNKOUhNSkF6eUlMTFJuaXdxZ0RBOTBGRGl3SFR3ekFQZmY4WEFBQzRMS3BWK0NkT3ZKa1JQNmZWcUhGNlVFWWFvQkxQT0F6enVrSjJ2cFVGRUJJTFlTSk9rcFNmT0tRNURtTThMb1BzNDJzV3dvL0tBa0IydEs5YzV5cTVpaXNCQUZIekZEY0xBTk8zeG94K0pzaWdwZ1VBK0hCYWNLWEtpdWpTeFNKZ0t2K0xaTUJ5QVlEVjZxVHZCeTYreG9EdmxqL3ZJZjh0dVd6VUZGSG1uRDBxNVdRQnJNWE1BbWdLZ0lkS3ZJSnhTZ0xQZStMbUdqSktlakVJRWYvUTljK2xqYnNnVlg3S1kxZFVSRzBhaUlaWVNYUS9Jclc0SmdEQVlvVDYzRUhkdjJBQThOU0Z5M3BxNForb1dMUEdaUzBCR1hTckpjMXRWeUdnSVlQRWt3WVRGM1VBZWltMzNhZUlWbzRPd0pCeEU4V21lZnFvQnBjRUxBMUh0QUVENFlkeWZIbXpEc3I4Sy9rSzIzS0tBTUEzVDBsMEFGakhZb0c4Q1BORWVFbzd4cXNIdkNVRGJNVmQrd0VrTjdwd3Fla29BT0JyelFJdzZoUHVRVXhKdzcxdGtmL21YVGIxRkNZOG9ZQXRWNzRPUUpUZVJVdUFMNWJHNVdQVzB6Q0ZEaFZuWDFMR1NOS0xBUk1xUS9VTWtMU05LWUNMQWMraVpvYU13V1Z0d2ZDQ1ZhSUUyQThnSlRVQUVOY0RZQ25SL1JJQVFJUHpDMTdzeG5SYmFkdHp0aVlBVjVncVJ5a3JxUnBjdVVxQTR3WUEyamZpOU4wdXVSSmdkNHpXS1p1d3lTWFhnKzhKdEM1QXo0cndMU1hBTFRLd1MwQmNHd1Erd0tncmxtZE9Fd0IwVTh3KzZiZTNZcjdJSWVDVXAxY3VHeW5nOGYrZnZmZitqalRKcnNTb0k0bGFVYXNWdGVTS0lwZmNIWTdwOFROdHE3cXFxN3E4cndJS0tIaVg4Q2g0a3pBSmU0Qk1tQVM2eVYyNTFjcWJjMlIra2Y3RkVOQVRyM0cvbSs5RnhKZklyQnFPcXM2Snd5RWFpTytMK0NKZTNIanZ2dnNBSU8wRitBRFRkQU9yVndvNDFDVGNJZDgvdFcvZUM3SzNOZkxmY3BNQUFCNUFDUDdGMjVLaUJLamxzbXVLbDZpOE91UnFDMlZac3JiMVhBcG1sQ1l5eEZpNERkVTdYM3JYZko2TGdhWmtlQkxoVU1rRlJCTlFzaFEvUnlEa05rTVhxZEM2dFVMeVIwNlhXeDVRdlBKMWNRQzBFSURGQWRCZUVOM2QvMUFCQUJmK3NTUXZ0eEthUmdoYW9IencxNjQrZGJ1M3JsWjRwRkVlZ0NuSWNjZGIyNUdyclhqWXpGb0E0dkZBbDNEZVE2REhhRkpSVW02QWp3SlpIOGRLckZERU95WmRyVHh6TXdDQTNGcjdHd0FBdGwyMmlpWHVnVWtBZnMwQWwzaDcxZVJ0MFJzeEF1N25sZ2F2TGZZQXBmYk5oVzk5bTh3QUFJQUFTVVJCVkg3azBMWDJlak1BZ0ZYeDlCVFk3YUZuZFFleW0vTFV2TkFLNFdqeTUzbHROYllSQXV3OS9udTloc1AvWGgxckF5OTJXaW83YTZsSU9HcUU5cmtsai80VytEVXliM2xraXExbm9BcWxlRExId1N1NEhQbWJHZ0FRMGo4L0lsS1paQUZNT2Iza3BYYjRhRlVGV1RweUNTYXNYZ0RRcUg2N1hMYndEMmM2SEpKN3oycnJTdDZ3Smk1eGxXcFp4U1p3QUxEcWw4UTJ1WGdMM3hDYVdRMlFYY0wxSEp4dDFGNzdnLytsdjFrKzlNeHcxSDNBQTVEZHJNSkVYcUxVMkFVaXhqWWFBTlJiRFRBVTh6MmsyemRXTDhPd2owYjhyT2Z3ZXV0cXE0QldEVDVBdmVXQVU5cGNJb3VjKzJhN0orRGwwUEQyTlFNQW9HZ2JDdEdjUWdneXRCNUMraVpjOVJMWCtZTExpdk53R1Z4dGJkU2pRdG9IcmRjZitsMityellQQmdXMDEwTVF0ZW9aSUJCRmpRcXhQYStWOERmend0ZzJpRjFZVkFEYlNjQnpwZDNtR1p6SmVwd0QyOE5lSWJWSUU2Y0J4Z2FGWWplb1ExOVNmcGNQdVVIRi9haEpPbHBsRTYyRHVsbjk5anE3OEkvRzZ0ZmFuTUthcjVCM0pHKzFMS3VlOVo3VGhVSHF5UUxnL3FVT1JFVkpPY0ppS0xoQkdxSFV0d0drc1hwSmhrd0Vld2J0cWI4NVBQSnBaaGNwWVRjb3pVbHpzM0tkZEhsSGxtZkdXOFh2QXdEUU1uMDBOcjZNWncyeVdjb0c4S3YzbTR5N3JJQ0t4V1pIUWF1aE90ZHdxTEZFZHg0M3RlWVYxRzViTTAwQ0FCSUN4RFVxTi9odmZQWkZhRDFvQ3FmclRpL1J2RVVaS1N6T3cyVnd1ZlpKVzUxcnZSM2FheUJ0UHZkNzk0RzdsSWorb281bldLbnNlT25Gb2w4Q1pyZ3E3SllDWW5IT01HdHJTK0cvc0tMa2tFSys1am9RK0F6TURDc1JxSzRhNU1aK0JBQ2hHeS9XZjkra0FaV1VCY01wYUFVaTB4V055UzdCQXBOQkhFQ3VxSFpRTjdOZnJwUE5SbkE5NExLS2hRN3lwdWdkUkRJTmp1RGR0TU01QldRY0dIMVhYRmFFUXl2ZWdtN2FWNjR4U24zN3NNaXZvaXZPcVdEM2ZMdnJqY2R0ZjN1NEVJYjV6QnVhYm1MNkl0QTlnbHhlS1lZVmttZm1WTGYzQlFCNlhLM1VOM0phVGlqZGlxVytVYnRmSTRmbEhZczJ0OGdIMkFFRFBKMTRTT2RaVzFjRlpEeUgzenE5VW1BekFRQ3ZVVlJ2L1RzWDE0V3cxdmsrN1hsWjU1WTRENmF6V2JIemV2ZnNjOThZc0YvczNRdHRpQzlkUGlFbks4N09HUldvOE1wclhRTk9PeTZyeDFKMldSRXcyVTlsMm5QTU9aQjF6dm96RzJSL2pwWDlpcW1Hc21jNVpQbjltWU1BNEkxeTY4R1lyM3prQS84emZGaG9NT09VVjZ3ZGlwSWp6QXNNaFZWQzZTWE42TmRTUlF5VkFrV1hsVVllUERMYzh5bENHYkZNZ3hNWXEzWTR4OElNM3dUNmxnVmRnZHVBVnJ3bGhhaVZramxScGNYYmFBQnd4OS8wdi9UdG1qY2dIN3ZmbGNwOTZTNExmZ3hEcUF0ZG5wakxLOENPNVprbEZueWdrTnV1TW81WU9kSlVsKzhLN1BFSzdCa2N6d21CSFQ2VVI2L2c0dVc1NVZvQlpZVVBNTnlndGRVSWo0eVdHYVJKZnpjVEFNaEJwTlZ2T1kwODZ5WFlmUTRuYklKWHNRcHJBQnNMMm1BaE9JMDlmNVU5ZTE4QjdGLzZXLytGT3VTRm5QUFA2aVNJVGdadTJSb1JzazhCVHVoMkY5WExxbUliVHNDbUhpbVhLWnkzSG5vL3REK0h4bjVGZGRoalpjL09JUGtjQVFEZmV1YVVXdzhlQmp5Z0l6aDhtTURUcHhDck1QWW5pNm5xYXRYVERseXQ3Q1llQnMzcVYwdHhGRlovS0k3Zkhra2ZyTUR0SnNYNHBHUVo0QzIwQkhFaDdYRE8rd3hFL3R0Sy8xeTg1WVd6UlkwcWRiWlVBSURmSjBVTzloTi82UC9HSC93L2Q3OHJEUFBVWmF0ampnTHBxUWh1Y1ZrVGg3QWZqdHhsaWVsOWY3aHVRaGdqaGNzUUc4ZWJRRHkvRWlDQWNzR3ZPUUFCTzhaNGNDeFN1R2ZaaUl2bUhVcy96QzN2WGZ3NzVySTBhbTNsM1lNV2oyR0Rmby9kdVpaWVZDb0FpSzBIOUZZdUtlOWpQVXZFenJBSzdGc0FBYVhFZGJIajlGTHdLSjM3dEFGNzlvYmZ0MThBWUwvWXU3ODRieCtkdHg5ZVlRMU81NXc3QkU1SXZKT2lRcnVSZVRzZzI4QlpMNTB1cTBMN2xrREFUa0wvY2xualBTdGs2bllFQUZqemZrUzU5ZXk2ckp3aGxnVm1EWG90aGFkVFdhanJpaUU5cEQ0NXhZSVBnMmIxeTZDQ21mMVdrWWpuZ2RnYS92Mm1xeTNYeXpHZnJjUldncmp0TWpEVHRjTzVubWVVSU95REloellQeFp2dVh1RnNXaHR3OVZxVU1UNjUrOWpGWVQ1bVRjZVAvWUc1Ri80dU9Kekg3ZnNWa0RBTWhqSUxYZFpHVlBhTnMzYkNoQVp1ZUJOUGVQUWxOaEt5amRqSXBhQUd0empjMkM0c0RBS3RpMGlnczBxeEx5WGRZNWxVSWxqeDc1L285WldQWHNReDRBeDRNM0EzRnRpVWRvM3FtY09VWk4rRG14MjdGa1BhWjBQQWdpWXAzV3hIVmdYWE5SR0RuK3M1L0NnZ1h0V2lqZjkzTy9kaTBxTy8vSzgvZk02bjhGS3I1c0pjeWZBaVVIQUFwQy9aZDQwKzdCSnRvSHR0WkNVdXd6N1krM1hiVG9UaXBTdUxJSnEzMlhVSUFCNDVpNmxiL21CSzdBeE1YZDRGeFlDRmpYUUJtTVZUMkJEdWcyRDJIQzFJZ3ZyeERwdlZyOERSRlJpZG4rTk84VWZnRStOMkJyM3NheTQ2QkdOTGtheUMwSWlHVnhXRWcvbmVwNnhCSXhwU1hsREVZNDNNSGJSYks5M0xOYjQ1aWh0TXRhLzlYMGVlN0xmTlg5NytNZ2JqNzg1YjM5MTN2N0NHNXRISGpBeENKQWJIU3A4clZJcndzWkROY014UU4vQ2xhaG5IRzFLZUdKWm1UTjJ4VDRIb3lJZ1FNWWo3T0dpTVo1bFdGOFRZRWp3aGxmUFdIcGduMWg3amI5L285WldQWHNReHpBQ04rYmx3TnhiWWxIYU42cG5EdC9RaFNOMVBkengrMEVxUVBaQWV2ZFVqbld4NExMaVBIajRpMGZ3VG9QMzdBVmcvMXUvZC8vNnZQM241KzNQNjN3R2U2SlM1dTZaQWdMR1hhM29UMmplUk5IeHJXR3ZRL2JINnI5SVo4SWNYTllLc0dlLzB6TkFBUERRZU9BVUhXQmM5bFRTNFBCaDJtQmVRVndWRDJ0Y3JFVm9LNVRxdGdRSEVib2ZtOVd2OUNjZmxSbitieWszSGQzZkhGdWJjTFZDTVhoUWk0dGVqS0gxVEt0TlE1cWppR1FNd0cwUkQrZDZudkVXYmp5allJU0ZwY3VILy9VcmpNVWEzeVFSRFdQOVc5L25nWC9Iei8xTjRpZis4UDluNSszUHp0dWZla2J4WFc5NFpFL0lvVm1BalNqbFgrZW96YnBMbVdCaHZBOERZT3FBUTdPZWNYQjRZa3BaWDlOQVRoVkQ5MGdCQWNJa240cU1CNEVmRzVKbmZsN3JHY3ViaEwzRzM3K1JheXZ2SHNReERNTGNoZVoreE9saVVkbzNxbWNPK2VLV3VoNis4bVRZSndBQ3hQWVBRNnAzYkYxTXVWcHhIam44UmI3NVpoUDJyQUQyaTRQL1B6MXYvM0dkeitnT2ZFdHI3aDRDQ09nQXIrUUl6TnRNWU41bXdEYU1HSmVweDNRbTkvczVIc3Z4WFVUbllnZ3VIckpuSHlJQXVLczhVQmJ2QkNDYmVaZlZENThERkRNQnQyY2VqTVJWTzJERHN5SEZoZ2VQSnQ4cU41Qm05ZHNCcVUwalRoZW13RW5GZ2lWUENSMWFmUXpEWElreEZCUStiR1FXV0UzSVVkS2YzQlJmQW9ubVZwM1BHSFpaMVRRNXhGNHIvVXRzL1NwajBlWmFRSWNvdHNYNnQ3N1BYUjlML05USERuL2tYWWNYaC84L1BtLy95TWNZR1FTOEJ1QWhCK2VJMzR6alNodUQ5eDZFQXhNQjA0TTZ4OEhoaVlJeGJ3VzZqZDBoRUNEakdZaU1aNHkrZ2V6dDd3Mkp2NkhWTTVhV3hMMkczNytSYXl2dkhzUXg5TUJoR1pwN1hDK3hiMVRQSEw2b2N6MWNVMEJBbTErbnZkUlhiRjJnM1htdEhQNWZOR25QL3FrLytQL2t2UDF4bmM5b2ozeExiZTYrQmhBZ2ZYVDVmVDZZTUcramNDa1FKVXErVExIOTZjeXhYMGZKOXNobHNBWDNMQUlBNjlhREI5aVl1MVEwUXEzMk1VQXhNcGcyR3N3RG1LdzNoaUhGSmhOa3liZUtRVzFLdjMvMDRkK0hmeC8rZmZqMzRkK0hmLzkvK09jUGEwRXh2WlRTZHRYR045SldmMWgzRzgvcVZSRExBN2hkeDk0Vi83NlZrRzFQd3UvekRhazM4bjU1M2djUnUvVSs4amVNQ2hIb2hPWU9iK2l4c1lUbSsybmk4M0R1WXIvZmlQVnozZDljN3ZnMThkRGZGSjdCK21yM1k4YjM0TG01N3IwVzl3SDR0c0szN0lHNDhBQzBmbnF2ZHBkVkpaTmJ6eDk3cjhLZmVYZmxEODdiVDMwYzh3cy9odnQxck9rV0NybmNJZUFlV2xleHhzLzVoV2RieTIzeHJwL3ZwOHBjeTV6MUJOYUhySzNiQ2Z2eXFtc0ZQVG5pK1dpQlRCM3QrL2FEbHdNTEJjbU5WaFRuVXZZVnZvdmN0UE91TTVrL3plUDJWejRPL2pOUGpydm01L1VCdUtldHZkZ2IrRG5iajBmZXE0ZjdSVHdHcjJtZjVSMERlZzEvNmQzN0tYT2JaeDM4M005UFBldEJHME1iZWZGdVg4R21QMG5jQnppZUw1WHYzQWxoaUFLMEljTWpMM04vRFhVQUd1VldpN25aWXE1eHl4WDBHR0wrS1c0ZWRMdUdYRHo4K3h3akhZbThYMTYzVTRxN2JsaUpDOVhqTG8yTkpUVGZxYy9EdVl2OWZpUFd6OWR3YUQvem02L0Z6MnNISEtJRDlCNDhON2VNQTdpUHZ1Vll4TVhXQzVzVFhaOS80bU9UZitHekMzN2lqZHluM3FWNXQ0NDFyYmxISCtZSUM2U0VXL0E1SDVPckdBK3dOeUNLSW5OZG9QZm45U0hGVk80bHVsN3pOblRWM2pUY3FDSDN0dVdleFhEYXZjUjloZS9DYnZiWU9oc0R6K3FRd2JuNWdTZkQvZEtueGQzTUVZS1Vmb2NUN01jemYzaHErNlViMGhkSGpMM0NZMUFQSXIvV2ZwNDR0M25Xd1c4OGZ5QzBIa0p1ZXlzRWhwZWxlbTM2aThSOWdEWlFPL3o3aUxjaGJUSkFDUDhPektJVWNLT0lOVEdpVFl3Y1o1RkJuZ1ByZnloQ0dzSjRmbGNDeVlQai8vMEI4ZzYvWDE3aVNZekFOYU9rMmJWREhuY2V3bFJzTEtINVRuMGV6bDNzOXh1eGZoNzV4ZjhLK0FCZEVQNFpBckxNSkx3SHp3MGFNenlBUnlJRUtJM2dONkNRbi82Skp4Zit0WTliL2h3TzFOdEV2TDBLUWVwSklqRXdsZkNKejdIaXhGcDRjQks0TmRQRytwQ1V3VWNKKzdJZXNpaVN0ZTRHaUZUVzkwV0NGbk9hc09wY2JGL3h1MmhFdXhCaERQbEtFMGJXelUvOTRTKzMyOXM1U01odmpiV20yWTlYY0hnK1VmYkxLRHpEMmlzVG9PSEF0MUh4cWdqSkw4Vm01VmtIbnhIZ1ptTHZjT0orbjRReElCQi9WcWROeDFTLzJENUFHM2lmdUcrY2lzaDFWTFNVOE8vQkxKWURibFRhVml6VkpwUWV4NmthWXZSYlNLc2dsdXFCalA2K1FNcU85dnVvd0RSbi9ENitYOTdVazFnSzE0clRoWHhrb1l6blNKbUtqY1dhNzliRTUvSGN4ZEluRzdGKzJFWElOeWttclM0WmM4TzM3eUhJZzVhTlpLWGFMRk9LbjViK2RPSDYvMHR5L1g4T0I2b214RkpQaXRUenhOVEExSlJQZkk3R0ZPOEpFSVFsdTJiWldCOWRrTnNkMjVmMXJCVk0xNHBsTm1tcFZFVktvVUxEaThZenRxLzRYVjVRcXQwWXZNZWk4UjR5ZjVidXhxKzlOK21hUCtEdStIbVZ2UnV5cy9LZEZ4UHN4MnZ2ZFh0RTQwREFpdnNNeDRGam1EYTBReDc3ZC8vU2h3SlNiRmFlZFhBZFNIdFdhbDFvUGZBWUppaWR0NlVPbTI2Si9WaHBpR2dEbnhqWmI2aElpSFZVVUxTTjEvRmpBUUNORkc2SmlXMUltY05GUS9oRDA4bHZvL3o2eWNDN2NqRUtMSU5hVklRZVdBT0E1WVUzSXUrWFYzd2lKdUppU2ZuaVFsbE1GRTNoS284YmtmbkNpbjZhekdoc3JndVIzMi9FK25tdHBPVk5BSHFlQjhPMkJtUG11ZEdNMlhSRXpFUCt0d2lnckNnQ0tITElpZXYveCtUNnYwUGdnNlZZVTRTblVDVGxoVXNUQjBwcC9KeTdScTc0R0tVSUYyR3VTL0JzWGg5eW9EeE4ySmQ1R3d1MlBJMW9tNndaMzNmVFhSWUtXb0RVNWtGM3FYb1kyMWY4THExMDAzdEw2MnpUWlFWalVMUEVVdDc4M0srbjJ4NmtpVnRZUEVvaE95dmZlVFhCZnJRVFlNV0xnUURXVlppRDdSeGpRS0VnU2ZWTHNWbDUxb0Z3YlVKYU44dUI5Y0JDV0RNRUF0cHoyblRVRTJBaEltMGZzQTE4U1pjV3JiQVcxbEhCc3NhNGpyKzdxQWdBYUtSMGEweHVrK3Njbzh5dVZzWldYRkh0c0Rqazd5MlozaVVEQUtEZXN5WTFPNllZcG0xNlA1WUJsa05Qa3dXMTVDZFJ4cFZsZ3FXWWo1UkRuWUQ0S2k0VTYrKzRCTEJXQVE3SGcyVXYwUXZBdXZIOHQ5cGM4MXpzTjJIOXNJdFFLaTl5K2VJdDJBeWEyaU1iWlRGbUtPY3A4eXR5bXlpMXlSS29LSDM5eHJ2K2Z3Z2tKSFQ5Y3poTEsraVNLcFA2MHMvSmdBdkxBOGVhOWh3T1UxZ0hHTTYxeUd5WGxmVWhSditac2k5M3JyaFdXTElWQVphbWJzcHlxcWdXS2pLdHF3QUN4QloxMHI1S2tmbDlvM2c4Ukt5TTE1bW1XcXJKeGQ3MFlGSkltUzhnTnEvdCs3THluZGxlYWJMYjdVcG9ZY1JsU3pwdlFUKzhWMEpqWUxHZjZ3bHptM2NkaVBjaXBIWXJjdGdIeGhoUUNsdnptTVpzdWxVakowV0ttRzFnbTNKcFFRVmNrY0huSW1RTHlrWGxkUWdBU0ZFQnJWMW82RjhVbWpoMStRdHVGRnh0b1J3dVpNTFZ4cm9VSTRjYSsxSzhRU29SaG03Y3NxRE82SGw0MlBMN0hidkx3a0hiaE1oRzRDT1UzR1dKVlg2ZlNTVWtzZWpDNVZDeENBWFdyOFp5eldjdXEwRytRTjRUcXdMY042NjJlaU42QWZnZHNUQVVsalhHdWRZQVFEVm5rN1ZsclIvTlJiaEtOeW1zdW5WaUdMZDJ4U2lMTWR0M2wvVXZ1RGdPRnZyQkNtaGNGbGxjLzc4R0VsTEk5Yy9sV0tXNFRRd0F2SUs5d1FlcTlITVdhZFp6WW5yeENKUU9ZWDVPNndRQXh6blhTcWpnVGF5K3lTSFpLcTIyeVNiWW9ra1lnM1ZJV2UvQzc0SEZqMlNkaVMzRk9kU3FiOHJlUmwySFZpQllXd2VTVlBYY2c0T3NCSHYwd0dXTEdJa0hvTTBJTFdBcDNBT3dSU2MwbDhmS1FjUVM2c0lGdUJHWTIzTGs1cjl2QUlCN2ZyM1Z1eDZ3R05hMllTdERObDNXeEk3aTJTMjRjREVpcll5dkZqSmNnN1B3QkVENHNiS09NNldOUXdBZ1ZFcnpFQTdFdkNVM3JVT2M2NDF6VFdsMi8ydFYrcmJvY0I0a2x4SXZldHdRdUxuWXd5RGxOWS9wUTA0cVk3SEF4VGk0WC9oMnJaV2lSQ0EwNWZTS1gxaTFDaGVLUEtzVGJtMWFEWE11ZTRtSDJIamtHL0hDSERBQVFONTI3TEoxc25uOWFDNUNQdlNQNFhDd0tqNTJHbDRPckVpSDFTUkZCaHVOSFlPMXQyQTQwZlgvcGN0S3IxcFYyTFpobnY5VklnQm9JY004VDhEMTJHWHJYbGhOZTA2c1lod0RwVVBxTHk4QXlMdFdLclNHc2FScXUwdXJjTXJWUWc4VDFubGVBS0I1TGhIQVk4bmRmYWRYV1MyUmQrOGg4R0U2Z1FzekJQc1h2WjZIdEtmUU0zQkNkaGNQNlBaQWFBSEhjUXFnZUJmMlkxVVp3elI1R0NRTThGVmdiZy9nc29JeGN0dzNaV1h1SDBLWUxMUWVyT3F4Q0F3c2oybDNnaTA1VUx3QVhJNllTMkp2RXdBdEtKZTZWUUJoQ0ZTMkNmU2h0L0w3aXpWekFPYkFKV0sxYlFJQVc1SGY1enJIdllTV2VCR1ZGYmQ4djZzdHNJT0hzMWFHVTlCWk54MU02L0E4TkxCTEVDZVpVVHdNWi9BYy9QMEpaYU9kR1c1bnJTcmJ2R0w4Y1R3eWY5YkN3cktwdUZCNklXNnJIVFJXMmN1M2dkdC9iR0V5UDJNalI5c0NnMkVaMy82QWdUaFdEcUtqQUFEb1VkWUZqMVBjL092K1VGMm4rYmNPbjM3RjljOUZob1lNRUhqaXNtVkQ4d0FBell0M0RPT0l0VFh5VmxrMTR6Y0JyRlhKVGNvRnFxd2JIMThFTm5JMitWYmFwV0dFQUI2SDgrU1dMMFhNMW9IenNRdDcrRkFCL0lVNkFFQi93cVVIN1dnSnh2ZU40YWxFN3d5eTJWR29iUUhXOVRGZGtvcDBTUEE0UitGd2V4NEpMVEJnV29lem91eHF5Nmh6WmIwWENRQmdSd2x6SXBqYU13REFZOGlTR1ZUc05hNkhYWGovZFFnVlZRandzNWVaYmJwMlVkTzhyVlBHN2YvSTZhV0krNDF2c0U4aGczWHdRbFFnRkZOalJ3UUFjREdKUmFNVkRRQ3dFdmliT1NJKzhHMWwxZFhXTTk5UndnQldpVjNlcUhnb2RkT0hueWYzcUhaUWErOTFEQXVkZjMrS2pPNnhBUlJrL0p5eXhlN2ZJeHJUT3JDcjF3MERoWXNLZVJNdHJyWmk0bklBZEtFWFlJN2lXYWZPcnBIZDcvVHlsWXNKalQwZ1ZYSVpwcnBmajF5MlJLbTFUZ1VBc0NlQnd6ZDdRSXBDK1d2ZXJKYW5RblA5eDc3OUlheWQ0MFFBMEtxQTNBMEFBSGdnTFVYYUFzVm9yY3FXdTNBemtwcmpHOFQ4WHFUK3hDUFY0bzB5bHlaZXpMRmU4T0NwS0d0M2tPYUVEMEs4a1JYaDI2N1FUVXk3dVk0RURzSXpBd0JvdktKRHVMSEorMnRqUEZNOGxaTkFZa1h2ekN5dFZWNEx5R0ZDTzRqdnZBQ3VZbmwzSnByT0tzQUh2OE1DWGRLcUFXQ1VDZ0MyWUsydEtseW9iUU1BV0h1RUw0SjRRMThBUnY0R2hjUTF6MWE5ZGxienlsWURYdG51QkpMa09nQzg5UmlaV0FBQU1pTW5YRlpNWUFvV1Z6RmlXTFcvbTRDOFVrNTltRkdNNzRrUkJ0QzRBMGVCVzVnUXhrSUxsemZzbkxGQUR1RURNUnAvcXl4MksvN2ZyZHdDSnhKdTkwVnc5WVM4Qk9QRVZrYlhuUlZ2T2pXOEFFdUpRQUZyd25kRGJ2Q2tzUjZtSUZkMlNlRkFJSjloTVpHQXRlL25ld3R1bmpFQTBHOFlHaTE4TXdVNXlSclhRd01BbjREckgwbFVtdmRuaXc2MG5Sd0E0RFY1ZVpoL3dUY3ZMQ0RGalN0SmRoTHdMaHJ2dXU2eUZRTzVRQlhuSUQ5MjJkTEVFNUcxTW1Yd1dEUkFLZ2QwajBFNHJpbzMzdEJ0REE4MnNTMWEzNmtBWU5WbHE2cnUwWUdpMlpNVEJRQzhNc0pZNjlSSzRCNld0YlJPOXEwTWg4ZTZFcXZYQUVBeDRQR2NOWUJhREFEY2lnQ0FQVHFBQmRUdHd6ZmdaenhOMkNNNHY0dXczM0c5TVJFY0FjQ0xnSjBOWGFBV2xGQzJkcWxEY25Fb1RYTFRaYXZmYnNUU2lRVUFvRERDa012S0NSYU1qMjRaVnY1YlZOUjZUYkVrN2JDMURuUXRqbjlpQUFaTVlXbFB1TzJoTWRCK3B3SzNCMGJqTTRaSFFvdi9keXB4NEJIRGJjUUxKb1VuTUF6amZxbXdYelhHcVhXNHM3RkhGeGFHQ2xBd2hOWEJDa29iTWVMZVZYSjlNWjlCUzhGYUFpTzNEcmZjWWlJQTRIV05NWEgrZlk1OTdzTTdhd0RnbWpkb0R5QldHM0w5SDhQNDh3Q0F0c0NCZEVwalg0Yi9hNVVyUnNHWmJpVzFVNEEzMzQ1WFhHMDVVdXdiYzVCZlFEb25GbEN4MnBpU3lWSlZ3bEhhVFNsMFNPTTM0d3RKR2VMQ08rUit6d3NBK21rTWEzUklGOEhUWlYwb0dBQllvWjlkQWhkN1FBampuKy9EZDdRQXlUQUJnQkJvRmp1NlRNQWVTWVlhQitDRnU1UUhEZ0dBYmZybW01U1JVdzVrZzRUMmlCWUNpYVdPNCtYMGNjRE9jbWdSUTdaYTZNKzYxRWw2c1NhVXhHZnpJUUVWVTFCTUFBQldQT3Z5RzZnYmpIa2VBTkJIZjQrYTJzK05lRXpSY0t1aVMzOWNZYldlUlRJSFdnSDlXUzdTRXpLeS9Jd3F4RGNyaWh0SWUzK0x4L0JHeWFrZFNHRDRieWRtQ2d5NGJJMzJFQU0yNXQ3ZklCY1pnekkwdHFMekxrcHgyanJxZ1ZUR09XUHhvMXRXNHpPOFZEd25pM1NZemVZQUFLTTA3eGdQWjMySThjQUJnVVpuSE5LMDdybXNVcDltSEhiQUhTemp6d01BMmlNdTZUS05hNHZHdU9Kc3hURHRFRVdYcnJqK044RkFieWw5WXc2eVhBU0V2ZjVHV1N1NFpxd3NGb3NjSjRCVU8waktnVnU5QmZDMHd6Y3ZBTUJiRzd2cEY4Q1RxSG1Gem95d2FJejdnYTBLWGtOdTM5RC9yOTF3eFpQWUc3bUlDZU44QTI3TlZlVldpNXdRcktmeE5BSUFTZ0JXNUJsbCtHOGFBRUN0ajlHY0FDQlZQSTVGaGpUUHJoWmUxSWpzMjA3WERCRDdwNVh6dGp3eStCMVZTWEVCQUkvQWdMZjRqZGthY2Z0OEU4a2RsVDVhZkw5UEE0ek1aV014b1V0Nkt1RCt0N1FEWHNKR3NYZ0FweFFibTZkbkhFTmVzSGFyWXRhMUZpZkNsQnBOQnJaZ3BOWlU0V0E0SUVhdHBoWEE0aHEzd1F2d0poRFAxZERwbG5JTHN0eFM0bTBRWmJwWDhQMVo3bkxHWU9EeTR0ZjRERTljcmN3cHVxL0hjNnhUTWVMaVN1TjQrQ0pzOGxIS2U5NDJiamE0L3REMWp5UWh6VDFZcGZGZkJRQ2cwVHlGdU9rKzVDYVhJV3l5NlhURnNDN2p4bGNta0x0SGVlekkyQzQ1UFplK3cyV0xDcUhOYWFXYnpxZ1JLN1Y0UDBJMDFPeEwyUWo3alFkU1dFOGFBQUJRc3BXSmVwTVFBcGxUZUFnY241WUxSUWdBY0liSENYeDNiRWRHbGdnRGdLZHdpZUJRckVhczNLUERmeGU4ZXJNdzN3VWdoc3NlRHdHQU5UcjA5OGxEV2paU01GRzRhQzdoRzZNVXNDVTN6R1hwVzQxUStrTGdvTmVBQWRvU0ptTzJ1YXdTYW44T0FJRFpkTjhYRlJNQUlBVld4SWcvU1lqN3hBREFjM2RaeE9laHZ3M2RwcGlNRnRlM1lrb2FVRGhXWWplY2JtUUpwV3hSbkc4YmlEaVlZVkNCZU1vZUdaOVZ4YU9ncFJhaTBlWkNNT2pTd1VNRzUrSlk4UWdnU3NURG1PVTE3OE1DN1RaUy9EUjBpa1FvTFlVRjNWTGliYmdENndnTEN1SDRMTU94UzY1L3ZqRks0UTB1ZERJTUhKRTg2NVJqMEZwTWZNS0kxMHRNVldNRnkvcDdRTjRYak5WeTJnL08rMnBPQUdEdDBRb0FLMHhsRXEwRkNWOWduam1ETzR1OEpzRGl3UGRScGRzbXBsQnFIaDBwYWlMVkhNWG1QRW5nclJ3U3lPWVVQUWxIYVllMEZ2YWJCNjdTZEdMOFBTOEFFRUNEUmFxR1lQMU93dUcvQVNUTFV5VVRRZGJZSzRQZ3pKa2QrK1F0S1FHN0hWTUQyZnVGOXZRSlBNL3lXR0lxM1JHQTJoMklSYzhwdkE1MFNiK0pBQURrRmV4UU9NQUNBSnlqdndvWlN0bzNYcVcyVEdsN1dwR3JGOG9GQzBuUXl4VHFPd0VBZnFTRWRPWHY1aFhnL0NnSEo4Tkt3NVVMK1FNQkFOZTl5L0syTitJUEdnUUE3bnR3Y2R2M2Z3ME92czRBcy85VVFmaWFxNzJpcE1kZy9ZQW5sTUl5b3R3SVRpR091NmE4UnhsdVNlaCt4RmcxR3BkRDQ1MUU5UXBMd2FJODVhRGlacFlENGtLRDRGdUZuWTZHanc5aktiRHh0WXNyZWJFM3hBckhhRzZwRjk2STMxWkliMWhRYUpKaWFnZUs2eEE5R2dXS0dUL3lZM2xHcm1NcFFadDNuYjRtM3N1dzBTWXBYczhNY1EwWWRTb0FpR1djT1Q2S1pNOFVBTkFPL1ZzSDlSbWxSWXBTWDhWbGhWc09EQ2E5SmRZandFTDZQb0RiMkFFWU5ZM1RJY2JzR3RpY3IySGR2TXA1KzE5UWdQL3pRTmhQWS9mUGdSZUl3V2tqQUlDVThtNm44TmdRZ1VJKy9EVmdMR3ZzRmNYbDN3TDdmb2xBendtRjk1QnpoWHNEdlYvNHJKZmtTcDl3bDdVRVVCT2lDaUdGQTNjcG5DTnp6SmxCQy9BY0NTZkdBTUE2ckRQOGhoWUEwRVNSZHNBcmhnQmdSMm1jR3F1VnVYNWxoTFcxRkhvRTVtVmxuMkRETENnSmF6OW9BQUI0SmhkeUFRQVhWY28rZzhPcGtRRGdwdS8zTTU4WC9RQU9aVXNnUXdzRGFLazhXZ3l3RDVpbER5TXMwRDJGU0xoS2FUcnljK1lGSEFCWlkwdGhEYThZYkZkaGgzOXR1SWcxTnZJMzVCV3hjdjVsekNLcitiR3JWYUN6Wkg3WnEzSnN4Rms1cFV0S1M5NmtmSGUrK1ZvM0JzdWpnZVJDS1gxNzAvZVA5ZWhmMTdsT244UE5yQnVBUkkremkyeWdjUTU1WXJTS2lpSFhQMlk5eEFDQTFKOFF0Nm1sQXJqdmFtV0xrUWV3QnltbmxnQVg1MDNMZS8wOXZmc21HSzFOU2xXMWlIcS9CWnR6RXdBeDgxVzByQlZOa0dXQTFxUVc5dHRXMk5ZYmRDdEVEOC9mTlFnQVBJREx5S3RBZXVVT0hmNnNORGtKNEJzbFlhVTJnM2l1TkkwTVhHUG80V1I1ODdmS3pieFZjYVV2UVpvWkt4cHFNclNhTnNpYUVpYU5BUUMwd3p2UVJ5b0F3TlJ1QWNHbjhQOGZHMlJ2UElTbGt0OHJTTysxd2pHYWdOVUp6Rk5JVUU4RC9vMEVBRGNFQUZ5SWxraGQ2V1lBZ0U5OS96L3pocHhkMHRZbVJiTE9NcEdRTEZHR0huQVpJd25MVWtzN29nT2QwLy9FMWM4a0tEUnNPNHBya2lVMVpVNitBSGE0NVNKbWRqaDdBRFRWdnk0ZzQ5MzMzL0VMVjF0KzFoS3QyS0ZibzJhODhhYUZnRU5xZW5PK2U3OFNQOThCUTM1SW1RV2FSMFBHYzhzREozRWRQN3BpcU9vaGhJZ1FTUEF0QjQxem52ZCtuZURaWVkvT1hBUUF2RFhjcHN3eVgzZlpnaVJyd1B5WExBa3RxNFRuU0ROb0hJb1NzcCttNjZCbDZjZ2ErcGtIQWRjSkRNY3lWakRGbHRWQ3NVenltNEFYQVFXTTlpQnRhaGRpNWhoKzQ1dGdDQUJvNlc2M0tPeW5pUlJ0S2Rrd1dxMEpTWWRsU1ZpKy9UTXJmQnRjMmlVWUoxNnlOQzJJem9EbmtMWG55eTRyNW9VaElFMGRWRHM3WWdBQWVRRG8xY2dMQUE0QmJKM1J6NlJaQUVBSWk0KzhiUW9CZ0dPam5WSjRsOXM3QlFBL2VnY0E0QmZ1ZDhWUmJodWJYVk9YUXRkOE1aS2ZPMDZ1OXNma2p1NVFjcHExL3ZDUVI2UElIL1VJaUhGN0NtcmtEeWNLYU1JQlNIVVJuN21zTHJXV0o4ODM1c2YrR1RmY1pSVzZ1NjYyZHJ3bEVmeDNScmhoVkxscDRYTWVLL251azByOHZHcWt2S0RydnczU2d4NzVOWG1IWE1kWFdhZkNlM21pdURpdElodWNxaGg2NzQ0SUFHSVZSekhBRmdDdzNMUHRDc3NjUzh3VzRXL2UrbkZwSGlhTkdCZGltTzhSc2N2SzFUOTFlaEV0c1Rmc29VcTkvYlBrTjVZYXZrdnBrZG9hUElhYjN5SGRDc3VSTk04WUFPQzE5aVZjZkY2N3NFalJpY0tkcUNuaTRyTFM2RExuSlNYT2YweTJyYVI0QmtKcWtOM2tUV0dpOGdtNS9ERmJpcjBZbkZwZER3QW9nVmNMejRBVUFNQzU4aXp3czYyME5TVzdySVc0YlJvQVdETkNDanZLYzYzZis0TUVBQmovam1rQzRDRmgvWndGUVBBV2NJdENEaFl6R0RrSFd4RGY1SFEvRGcvc3UxcTFLMDdYWVFXMHI1WGJlTWhGTE40Si92ODVac3NIa01UbGZ3dGVCODQrMEVJTytHMHR5Vjh1NDNuUi8yK2NMWFc3ckRDYmtmU0NjZHcraUsyMVFvenR1WisvM3pab25jcU5US3ZWUHEzY2NwaXBpOEpSdzBUQ2ZPTDBVcDlieEJXeEpIcTFqQktMb01WbFptZVZKdm0vdzRFOGJrM1FLQVlBOEhZMG5IUCtVU2JaNHFob3QzOU50cnBQNGFOb3FaZDVxdGN4cHdjdkdua0J3QTFLeWMwclVpU0hmemZzNzI0amN5RlBCc0NSaTllRDZIWnB1aTF5V1BMbEJiTUF0Q3lTUEFBQWRVTlFBR3c5QUFCNmlZQXNZWVIxNVNEZUFOQXNiVWtobVVwMjJ3c1A2bDRwRjh4bGhWQzRHbml1OXJzckNyZnRIendBRUtMWUV5VkZqeldhK1diT3hsT1QvdVhxVXRyR20xSmlZY2RBQkRsMHRXcCtNd1pCTUpaZjNBK3BjZzhUeUg5V3BUL1dBVWdsQS80eXdRdVFKM2UrUThrMCtNUi9YNndjWitXN3M5clZFcmtjdFh6d1RyOXdYelZ3blQ2aTNGMHVkYnRHdDV4ajQyWW0zaGVwV0Nua1BEYnkybmNORmVkQjR4cEswYklNWEJGQ1o1aXp6SG5jNVFBQTBGSm5XZW9hRHd0TEgxK2IvMDhOZmtwSXF5SWsvSU5yL3FZQlJrUDE2M2ZBemlBd0tnZFNTQmtBV0pVbmhlUEEzS2RweFNXdmVXTDQ4SDhjQUFEMTV2K2ZCQUNBSmFxa0NZU3RHRHlmblVDb0ZOZHlDQUJzT0YwSFlETUFBRFNBdkJBNGlCY0pQRS9UQlF0dGt1eDFLOFM4YmJRVXo4TzI0VW4rQnc4QXZxQ1lkRXdUUUJaWWlBVEVLVURDR0w4R1lLTTE0S2JCMjlZZXBmL0pSbnlyYkxSRGNubXgydFdJTWg4cDZYOWFvUjZPMmFhbUEvN1UzODZSZTlDb2J5dVpCaGU2OXgrNTJzcHhta2ZqT09ENjE1clVnUkIxdWthdFV5UXFEaENUZXBXSWtaZ0t5WG50bU5LRk9jM1dJWkduTFBLMzlETnRVNGRjbk50S3JOeks2N2NramJVU3cxcjUyRkVqRmRHYS95OFViZ3JIbVRjaVhyOVJBdGk0N3pFY3hhR2RlWWlUNDQycjZIU3hJZlk0YU44V2xmUmlBRUE3NUxTLzEwakVFdDZ6Nmo5Z3cycHdyQUJZaFRnNk5nMEF4RVNWOE5DZFZ6Z21WZkF3bkNnOGp0aXpRa3FBWlJkV0FrVHYzb2l6eTk0eitCbnpiZFN3UzBMRTdZeHdBQTZORnVJZUhQNGhjd0FRK2VQTnZPQjBzUjg4bUk5ZHVHUXdsNWI4M0dYRmNLeVVxUXJkdHJURGZOTFpJa0dITGx4U1U3d1NkMTI2QUZCcUxZQk5WNnZPaDI3NmQvbHRrVUNua1JtMTZvVXgvWGZXazIvVVdGcGRWdXptTFJpdlRjclo1WnJzb25QUGJSekNBWmFiTjA5WjVDcWtPKzBidHlhcjl2dWgwd3RkVFNpL3ExV2NHemM4UkpwMnhqek1nU1cweFdKZDZKR3lzbE5DdDMvMitqMkROZmtaRUlCZkVRZ1ljMWtKVlVrQlhLQnZiNGtORFNreGZISHRvcFkrMmliMFJMWUJQd1p6MDYyL1p4S3hqTEZMQ1RGaEgwd0FYQ2RYT1I1Nm1pd3h4cnhUaWg5aGJSU3RURzFWeWFCaEhrZW5TNjhGZ0prNW9Wb0FMTUkwbFFnQVlnMzNlZ2dBVkl4V2hiblEyaDhzQVBnWW1MOHBtZ0Jua003RWVmYWE5SytRZ01RMWplT0psYlNzRUdyR0Q2Q1JCN0Z5bXhYL1I5TElIUmVYQUU2dEJ2aU40bjdUSklIZjViZEZWbkpLOWNLVXhoWGxHalVXcnNXQU54ZU5xN0FHNzJPMVdlSktNS2hOTFhXcmtRQXhkUXF6WGtMcitSRGVmY21QY2Q2RlZTRDVlMnVlT2ExaW92Uzk3TUpTMjJLTWJobVpLVm9aNnBqc0wzcjlKUDMxanFzdEJZdU0rVVhZVjhJdTM0UTl5QUI3aHBqeEE4UVhXWEcxNGpHeUZyNE1nQjMrKzZMeTk4eTcrVW9obWM2NWJNVktKZ0N1S0ttQnlPTmdXV0tjM3hobllaZlN0ZWNNRHMyM0xseFJOQVlBeXNTUFNLa0cyRU1wdll0R3lHUXZwMTFDenlYTDI2UG5VMnNNUEt6ZnE2bmU5NGNBQUtSTXFrYlFDMmtDWUxwZVNQcjNrYi8xQ3pHTjBYZVAwM1cvV2NXTUQzTTJoTWhtUHpYaS93UHdYa0pPU2kwQ2hBWnYxdWwxNDFPS0FyM0xiMXRReHFUVkM4OVQ5NTAzUWFQR3d0d1RGUG81b3NOL1BhR3RFUjhqZE9pRVdpZ05VQU5FbHI0RmwxYm1mSGZ0Mi9BaGJYbm11SElqOTQxaExPc1d6WHlVME8xZkUvN2hneEZEVXI4aTFuMElqRW5NWCtyTkg3bGFhV1lXd05MNmt6NVEvRWJXd2szREJxWCsvWUJpMzE3RFJRSXJLaTdTN1paTEFLTm5ZSWM4S2lKTFBLSmtIQlNvZjAzRmJnTThHSktWc08yeXVncG8yOFFETUpuQUFkaHh0WkxJU3hUNnNKUUFSeWxGZHNOWVg2azJhWjNPSHkxOWRkRmw2d2RJc3p3UDJ1L1dWTy83UXdBQXYvQTM4eHN1cmdtd0E4LzZPNWNtL1l0dXdGLzZHd0h5QUxxZFhrRkw4dTJ0WWo0Rmd3WDc5NEZVSnkxbUhpc0RmT3Awd1IrdW9GZHhhV1dCMytXMzFXNEpNYkdMV09ORjNLaXhhREZVOWxiczVXZ2NQMjlYM000eHQySk1CMEFMaVZncFdtVUFxR1dYVlRyYlM4Z3FHVEk4YzFvdS9UNzFYVkg0SG55ZzNRZWlYa2lYZ3JYd1ora20zcUlRVW44ZUFQMWFPS1lDWWJ3VHVHbHFPZytkQm9sdkh6SUpkaWg5VEZ1cjdMVTVDUHc5cDU5OURhSEVMbkJ4YTVVRWNmMnNLWjRCUEN5SFhMWjZxNUFPTFlDRzduMVpZN3N1cTdSWGdYVjRiSkNZOFRadEFRQmsvT01oaVprQnFUb0ErNUFLV285dDBwUWUyNGhySW9KTTJHS2hCLzc5bXVwOWZ3Z0E0S2RHQ2hBV045RGNtU0hwWDh4TEYwUHdzVGNFMTl5bDBJZ213c0hwYnhieHgxSVYrOGJaWWljc1NuU0QzS3JzaXYzRzFZck1JTUVLaFZGMkErRUNUSTk2bndCQVFqamYrRzlZemRuSzd4Z0FvSnlweFo3V21rYWd3OWl6Nkw4WEFtMDhFUUFVaUJScEZYbENrWlpUZU05anlvSG5FQWVuMXZIaGpBVEpJNlh2RStpYjFlQndYendFa2g3dWU2NmVkcVFReGpUT2o2U2pDaUUxQmdDWWtIa001Q3U4aFdzNkQzMkJkRW90UlRKbHJWYklsbGdDTkk4aGZCb0xhL0tGYWNQd0RPQ0ZwUlBTY0lWMHFCRTBNVXZtMkZoakdQcy9jTFUxQXhoa2pRYm10aHh3bFc4QjJFZ1ZBcEo5bnRjMmFVcVBqMm0vRHdMaFZsb3ErUkQvcHFaNjMrOExBRUN5UXQ1RDRzZmVSU2ZQd3B1QTVjNUVZb1MyYUZINkYvUFNQNkp3UTZpdWRSbWVvMmxBczVHeS9rWkQ3UUpNcmp1N0RqMlBFVy96UTVRZWhVYXlRaHVFRi8rNy9MYWFrYTFjb1YwVkFJVEdZZ0dBZXQrVkFZRGtCN2Q1bzlvZGFCcmJQa1lHa3JSSUx2STBReUNBODkyMW5QZDFjamVLOTRqVFJUbExRandKM0hjWitzWktnM2lMdG9pNVBINU45cGRCLzExS1IvMVJJZ0NRL3VWdzJuYVhGUXlYSUE3UE9nOFdOeUxGQTJBZDJQc3dkekVCbXE4amEzOUxXWmZvK2FnWXZBeTVzRWgrKzBNL3R4WnZBVFVWeXNZYUUrL1FKb3dUdnkwVFR5MEFrTnBTQUVEbGlvMmZjUS8yZTd1Zkt3bG45RVhJZ2RyK2xyK3JxZDZYWVBOQ0tjTlhBZ0F6NEFKRTVMVkJhVys5a1VQaWgvNW0vckdMYXdJSUt6ZEVqT0JiTmtvUC8wakpPbWd6Q0VmNERENkFCNVJjMkpTLzBYZ0pzZm5VYmt4OUJtOWd5M2lIbVp3QW9GSGZOalNuOVRaT1kydlVXTHFOT0c2OWJaTll6Wkx5eWVXUnRiSzNuSmtTVy9OWURSQ1ZGNFhzSkNBQTg5MVpaUXg1QVV1UUpWQ2c3MnpwSkJTZG5rdS9EWDBYWGJiTThCQ0FsNGV1VnFIVEd2KzY0WjNRUVArRmgvRmZLaHdBYTIyaXdOSXFFQnBsUG9iaFppeGFBejFLRnNBbXBWNWl5T05HaEFNUSszdk5scVN1ZmJFSjJwN1VWUDlrWGQzelFPT0d5NHBsc2FhQ3RRNTJBRkN0Z2J0K003SnZPTHl5a1hNZmFqWXdabSszcnZpTVcrNVNWZlNGbjhNMlAyY3A1RUJ0ZjdmN1Bsb2RWTytMaEpJMlhGZzBqRFBTdmhRQUlMSDVUeWxubGVOend2TEZHTXd5RURtMHRMY2JFSmY3Vzc4NVA0TGM5TnZrRGtSWDA0THlQSTBZOFFxUXNiQ0FMN1RHZndCQWcxbTRHSWRmVXNhRSt0dDlTdXcrNVc4NExmR3poUGxjTVc1TVhhNVdxVzRsOEE3aUpuMlgzelkwUC9XMkpVcHhiTlJZTUw0OTA0RDNYWVlVd1JIL3ZlLzRieTkxQzdocCtlOTUxN3pVWHVnZ0VJRDU3aXRPVnhtVHpJQnBpalYyd0czenBhdFZTaFRXZWF6dk9ZaGpEa0hZNHFWeUk0Nk5mMWJKK0VIQkx3SDlGeDdHdjNhNi9vZTJOcVZHd2lJYy9GT1EvOTBMaC84emI2czByd2dLTUMwUmkvODZYWFJTLzM0aWtBV1F1dmJGSm1oN1VyTXpuRkh4bVpGT09RN3JZTkZZQjBYWUY3UEd0K1Y5ZzdMV2M0WjlqTzFEdG9FeGU3dHl4V2RjZDVmMUhoNjZ5N0xXcWVSQWEzOC9jNWMxQis2NXl6b29EQ1FuWVQ5aVk5bndHbyswQUlDL3BWdTVwaGczNmdjOFRVUUZ5WkhYOU9obEVmM1dJL01mK00ySnQxS3JXcDFVdUVvaFJxRDByd2pUL09TOC9Rc0NHaXc1T2d6R2tzYzA1Ykw2Mi9YOFRhdHlXTWJtYzBZeG1tMEtBdGRJSnZ3T25lLzQyNGJtcDk0MlRUZXhSbzBGWlppdCtjemJwb0NkLzRWL3g2L2NaYmxiYkkxYTgxSlVDa0hBa0orSENTWGZYUnFxbkkwcXNVWTVYSjhvSUVCWTUyK052dVdkSjRBLzArT3lVc2w1eHM5cjRBM2RocS81ZFNpZy95OXo3SGVzZ0Nkek1VdzhpeFk0L0w5V3ZDTHl6cXdlSis5clNYRmJFczc4OTVyNlp1cmFuNGF4VFNmWUdkWlIrWlVIRzArVk9EZXVnNW5BR3BNMDZxbUVmWU1DYVpOMTJCSE5Cc2JzN2N3Vm4vR0ovOFkzL0xxNzYycmw3a04yTzdTLzcvbytiN3BMWVR0TWIrMm43NEJ0eXVoWE10SytFQURBdDNKWnJPZ0NISENYY3A5TVZDaTRTemxVRk9YNFNqbVEvOUlmU2xvMU1IUTFEU2hFQ29zWXdVVnBKQTc0endOQW94UGlNeVBLYzRSczFRMnVtTHgvZzVNdFJpbzJuMktBMkdqR1NDYldPN3pMYnh1Ym4zcWFmRzl4d3pacUxIeGdOdUo5OGVENGpUY01uL3R2ZjUxYW85YjhiUUlCc2tiNllWeGozaEJnRzROKyt5blcrQXdPQVFZQlhmU05VL3J1OG44cjVWUHYxemwrZHNYZm80eWZpOXYvMzV5My95em5maDkybCtwdS9mNWRVSDVhM0svaUVuK3B2UE9ZeTZySDRmdWlGUGRqQTFDRi9wNnJZdVpkKzRYQXVObk9hQkxmdHdnRThEcVFiNmF0QTdSSnd3bjdSdEliKy8zZjFiTXYyUWJHN08zb0ZaL3hDMi9iUHdYZ2Z5ZVJISmh5cGwzemEveTNMcHMrajNNbDM0SGJvTkx2OTZGeUFRQS84NGI4TTVjdHVTb3h6Qlkva1ZJN3ZkYy90TjlQZ3JSK0lDN0lCbXB4bDRWYzd2dSt2L1RQK3ZWN2ZyYTRicXpuZGJuTEd2RjlSbU9paHJoOXNmNzNhNGdIaWR5bGpLRVBZajV5TzdydmplTmpjQmRqUmJ5di9MdC9DblA0dnA3N1F5QjEzb1NieVVzZ3dQWFN0eHBRbnY4VWdNWHZrS24vZC83Ly96dm43UitkdC8vRUcvZS84UUJQVWtxL2hBTkZOb1lJbVBRR3ZsMUtrN3p2RHQvdmN6Z1lROFNmV0grb0ovNGFYSDZQL0J6ZThuUDlTZUtZOE5CNkFZWmNRUEhIL3B0SldlNmZlQ0QrTjhvTnJ4c01zQmoyQ2NvVkh3ZEQyQS9mOGlVWUdTbEovWkYvN2lld3h3VzB0TUlhR1hSaEdXaGNKMUtDdWxuOWZneUd0bzFTT3FmSWF6QUd4cllQREhJQkRncjJybnpVNUhkdlZ0L1hDQmkrb0xVNUFBZjNHQUhFTVppcklRQmJVbURudVYvL2Q3d3RZZURHSUlNUHpoQlF3Y04zekFDc0JlV2R4UE56dzExV2wzME8vQjF0ekZiZkE0b3RlUVNBNjQ1aHd4QzhqQVZBRnNvVFovci9vOUEvT0lCdkFNT1VXY3lZempTaXZNeVlNZGdRa3Y3c1BUOGJ5UnN2amVjTkI1Q3JodDRlQVpEZ3cxZmJIT3dpZlFueG94YW5WOFRUd016N2V1NVBFejA1WThybU5XOGZ0RDcvL2ZQMmo4L2JuNTIzdndJUEV0YzRlTjZnRzBUTUM1SUgzV3Y5NFkxVGdGQUhNTENmZ05HOW5qZ212dlU4QjRMY0RkL1BGeDRNL05hRHRwOTVJS1hGZUVmQkJUdm5ZNTZvRmpjTFlaVlIrSllDQXJBa3RSeEcxNDNEaUtWYUxSbG9EaUY4MWNSK3YzQzFTcVVvNnFUeEJyRGlJdW8rTUwvaVZaUG41SXNtOW0xNWhXUnRqcEhyZnBaQ0F1THlub1IxMndkN0N3OUZMWFF6QzMyeDYveGVJRlF4VHFFYWZDZGV5d1hGKzhJWERCN3psQkZ1d3pESW1HSkxua01vNitFVis1ZjFWOU4vREFCOENnZndROFdkaUVaOEV1SVkyc2VkaG9YRXNiUldpcVhkZU0vUFpyVFlUYytiQUxSdnhZTjRFY29IeEp0dkFSWWg2cERQVWh4T2RNMWZnd2RDcTRqM1ZKbkQ5L1hjWHptN3NodkdTUGw3aGVLUHQyQnQvcnZuN1Q4OGIzOTYzdjdDaHhwK0FzL1ZxaHhlSllZNGs4Q0R5QlBmMC9yRCtOeG94RlYrS3lFdXFzVTl4ZDMzd0grWE83NnZtMER1K28zM29sZ3NieUZOU1MwSzFLb3ZBb253cmNzcUU3WVJRLzlqZjNQRUc1cUVZUHFBeUlSU3JhaDZpT3VFdlF6TjZ2ZW1DOWNxS1VFV3hiSzdsSWNWZXpFUHo1b2hRbDk3aytma1poUDd0c0lZQW5wbWlIeGFKRklna2s5bmdDZkNoOVpEZzNoZHBQVTNBKy83Mk9tMUg5N0NXSmNUMzRtelB4N0FldWlpL1RnRG9MQkk3eWp2S2V0ZzBoanZmUXBYYWYwdkcvMGowVkx0UHdZQXJ0TUIzS29RaXFaeWZOd0ZJbmRvaU9vaEVNbmUxN09mS0doeGpKNG5ldUhMTGsydUVZdk1EQ3VITHk4VVllS2lwa0VYdVJHSEltRG0rbnQ4N3NjS3lVbkw1bGloNzJVeGtMOGpHTUxhL0EvTzJ6ODViMy91T1IyWVJuck4xVmFVNnlWbTdGVlp2MW9teEVPWFQvNlQxd3RxcGlNUmI5Qnd2OGFZMFJyeldRN2hGLzZiUGZidmplbGRjbE8wOHJ4WDNhV2NxNmo4N1ZHS0YxWkhIRk1BeUYzL0hMdzV2bEpTRjZXR3VraTFpZ3cwcGhGcVhvWm05WHZYWllXS01OMUs4dWxsTGpiZHBVTGRnc3VXSEY1enRSb0xYVTJlazd0TjdCdUpqSndlS29CeERkTHRyQlRSVmRoYlUzUm9pWjNSUk5PMklZMVY5Q3NrZytDNUFzcW53ZjZzVTdvbHZsUEoxZFp4UUJMbUV3QlIvWkNTUFJjWU0vYTlab3dYMVN4ZnVkcUtxdHcvdi90MlN2OHhBSERMY0JNVmxOdkFXaVQvRjE5bUlZQ29uZ0Z6LzMwOSs0WEJybCtnNTVXVS9GVXJoNU8xL3Zud1hhTmNWSzYrMWdXczFRbHl6UlVNWXRCWDcvRzVRbkw3MnRVV1gyRTlCOHhCMTNKZnYwOHg5T3Z5M3p0di85RjUrNmVlUENxRVJxa244WlhoZFJpbjNOaXI1UHhxV2dqYU9HTUZRTFM4YyswV1BhU0VSV0s1MFZydWM0ZnZRemdHTGE1VzRFVkNEQXpZVU9SRmhGdFE0ZTNJWFFvSllZbGtTNldQQ1hDY1RvYmlSU0lodSsreVFrTG9aVUNTYmJQNlplVlFWZ0dWT1JHVnUxMC9GMnZ1TXQ5ZVZBWHhXVEkvTjVyODd2ZWExRGZ1TlU1bEZFMkFiWmVWV01aV2hua1JEWHcrdENSTVlsVnVQWEs2OEZtTDB3czFTYUduWFhjcEFIWG8rMEhCb3BBQ0pKNFZDTVpYM0dYOUN4eXpKb2JFNCtXOXdsVmlaNkgvN1VEL0Iwci9XRitoUFFZQTdoSENRVGNSaW9xVVlLQmw1ZVBpWUV1QWZobFJNWlAzWFQrN3hYQlY4ODBIZGRNMVZUdE54VWtyTW9PSEx5NFVyZjQ2bDZkZE5NQU1wd2E5citkZWQzcTlCWEdaWXUwRTJYU2F4ajhMT21uRXZ4OFQ4ZThPR1RuMk9vajIrVlZVdnpRMVJBRUFlVXVBVnNBQTdvSVJMQWJjcnk5Y1hCMk5sY21RR0lzRVFaUjRmUUtjRHF1ZUFNcThIc05lTzNMWm9sV28weit1NUpScktYQjRROVBraTdFTU0zb1pNTTMyZFJQN2ZlYmlkZDVGOWhqbGJ1VmlJbEs4QjhZYXV0WGtkMzhLdktaRzl2M1M2UVhOVUIyeTRuUUphdnhaeFYxV0VaUkRpM1VQTklYSWkzNitkYm9rcnlWZExXQU1wYXRQakhmYWNib1FFMWVWeEF2R3JqSG0wSGhueVNQMGlqeUtETktzL2xHaWVOZGw2eXQ4cjVvWkF3Q1BJS1pqdVlsa0VobDlWQWhWaFRTMU5Wbk5kLzNzWG5pMmRXamc4MlRTUmROZW1xWFRya25NNHVGNzVHejkrQUVZL3p3Z2FnUXp1RW53d0h4Zno3MlJBQUJRWno5VnAvcVBEZUxmYnhYaVh4dkZDMWt1R1hXL3oxeTY3bmU5QU9BRTFnZzNlZjR4M2FKWk1uY1EzS0VXQVBoR01ZUWhobkNmd2pONDRHcVZNYkdpNENrWUwzRTV5Z0hJMWY0V0lGVFNEU0QvanRORmNGaFN0Z3dIVVprQXhpcDRTckFDYUxQNmZSbng4dURsUUlyY25MaHNTZkV5M016WWkzVG5IYno3RytBMU5hcnZWbU92WVpHb014Zy9Gc3phaCtlY0tvY1dWM2RsQUxBTmx6L05BOUFCWTlXcXAxYmhmSkRDUmZnTnJTcVFoUUFYUkE3blV4b3pydyt1ZjhBZUlheTZPS2w0bTZwRy93ZEsvelZxdVRFQThBeGVnRjJvNjRCb1Q4Qm9iWk1MY2d1TVE1azJBTHRWaHNqZ1grWFpXMWQ0Tmkva0lod2FVaW5xb3RyZnZ6NXYvK1Y1KzY5OCs5YzVBWUFzd0VONFArc2dablM1NTJybFFWR1hYd1FqM3RkenY0b0FBTndvWmZpR0c0WUhRSVNUL3NRZy9uMFdJUDVodkpBTEpwM0N6U0ZQNWE5NkFZQlVzZVAreW5CQW5ORXRjYzFsVmRINkFLU21BQUJOaUdVRzB0VXc4d0pUMHJUK3BRZ1hGdU1wQWpqY2cxdEl5S01qWHI2UURDNVdsaXNEME1DNjlWSStsdlh4bTlWdlM0VG5nVExMZTNBSW5FSGZXN0IvbUVkeXI4bnZydkdvcnRxM3BIcHFwZHR4cngzQitEZUFQTG9CbHlzRWwxak9IQUdreGdIWUF2dlBIQURjai9QT0xsOWRNdDdwUkZuUEF0cmFuVjRENG9EK1R0NkxRMEZZTlpGdFNqL05xNHkzcEx5WDFUK1cveTZ4elk0QkFIWS9vR1kyTG93RGNGdXVLc3pnVlhxcEkzS3JZSFU3alBYVSsyd2tsZFh6N0Y1bEllK0JtK20vT0cvLzVyejkyL1AyMy92MmIrc0VBRmlPMVRxSVdldC8yNFdMWEx4SkFBRE5mdTVYeEFIQXRLbHh4Wk9ET3ZGc1hFU0gvSTRuL3YwemhmaUhwRkdOK0RkUHQ0VlRBRUI0WTAydC9iMUdScVkzQndEWXA3NUtRT1RCc3JrbmNQUGlrcnpkaVFCQTJ4TkZZS2pQUVZ5M1FKNHdxMkRLR2QyMDVseHROY3dVajQ3STFvWUs0VlJvdjY1VCtHYlAyR3ZONnJjMWtPa3hDeHdoQkFEb2xxMDR2Y29pWnBJMDg5MHhsandONzF4djM1aGhNa2l4ZVFTTURDQVdJWDEwQ1VJRkI1RUR0NC9zTThzbEZ3Rlk0VjZ4TGtGWXNYVVozbW5SQUFwWWdHck14YXM0SXBCWkpETG90ckZmOFFMV1FUWVRpenFkS2V0cFh1bGZxNWo3WGY4eEFQQ2Fic1BvNmtMWDBCWWhEMllHSThOVDRrRkhMbHYxYWQ3VmFzdW5QbnRIYWR1RUNQTTh1NS9jUmJpUUx3NzUvL2E4L1kvbjdYODliLys3Lzc4cEFBQVBCVTRaQ2gzRTdMN2VwdzBWOHdDOGorY0tFZkNXMC9YZHB5aDdZd1VPcFpCT3RSRC9mcUFRLys1SGlIL29qanlCMjNlVnhyK1kwQllvMWFpN0RnQ3dTTmtrUlFqUlZPQ216WjRSTVlReEFCRGFGMGc0dEZMU05GZXJkYmp6NzV3bUFJREhGT1lMRVJyWElhdG4zY1dMcGp6UDBhOGNJQ245dGlwcFpjeHIyUUZ2NFNHNFpORUR0R1dBdXZzNTN6M1BuTFNTVjIrSnZEZmM5N0lDMHFYdkZjZ3dLUmp6c0FzM2VnU01Fa0tZaEJSdTlBZ2UwWUhMRncyMno4amczemE4aUZ6MWNSKzRLMWlsY1JKU0lZdVJzTnBZSUNTaGdZWVo0TEJoZWVhemdBZTJpODVBbkNQdFpqK2hlQXJRdm1VS1BjVUF3QnZGM1lLMzRUS1FRemFBVFhsSXpPQXl4SFNLaFBUMmxjT2tQK0haQjdCUTk0aU5qSHdBZVhZcHg3TTFrc21odi8zLzErZnRmL0FILy85MTN2N3ZSQUFRRWcySkhjU2EreHJuWGdOUGtxUDdycDhyNGtEMzNLWGdpRmJoRFdOeGVTcFZ4WWgvcndMc2RVYnoyd1lBRURadXJJM1RyUm5GT2xJQkFPcEp6SVBCM2FXRGxBK013UWdBcUNwN2dobkN5RFBReXY1YVpLdXE0dDVIQTM2c2pGTUxBVHhQU0J2Ym9IQ2VWSW9UQUdzVlRYbEs4VmxPbFZ5TjlLM2xrd3N3d3V5a2JnTUFWQ0RjV0NMUDAzRUExRDBHNzJlZmtyb3E3NzFKNzcwRm5pbHRUaVNiaGcrVGJXcnJMbHRvYVJiQTh6WUJTQ3kvem1DbEJEeWJZL0ljQ0g5Z0NEd29mSHMrQ2R5S3JYcjNod0hRT1V3ZVhSd0xWeDRjUytUVldBQmdoNEF5QW9CeG1xTVlBTENJMCtnbDRiTm1TckU3NHVsQSsxcUlBUUJPMjFvbE56QzdpUTRoZm5RQWNjMHFFUjAwZC9JcXVINEhFNSs5Um9Nc3c2ME9DU3dZcjB4NXRvYTRqbjNjLzhMMS96K2R0Ly9qdlAwL09RQ0FKUnM2RnptSU1VYUhaSmRkaW5WSnZqakxyNzZMNTdKT3VvQVBGaHpSdnVtT3kxZXJPb1g0MTZOd09MWU1nNlFCQUZrTFkwWkRoVDJVY21XbHJsUUFJS3A5a3dTTStIM1g2VllYQWdBblNrYk1JYm1qanlDRXhpN3B2Z1FBSUdPWVZjaVZGdkVJUXpvdFNwaHZ3Y2p1cVJDbzM2TjRMNE9YRjBiNjFES0VFZmNpZlZzRVRLNGpNRXo5QzJCRzcyTU0xTW03WCtXOTkrRndMaXBrdmM1QTVzSWhmVlBSb2VDMWRXaVFZUHVOdFhoR0J6bmEyVzRqZnI1SEh1UlVBR0NGblpqVHRVd2hneFh3Z29tWTNMemhSdCtpMU5vM2dmZmhFTUFDOUYyTWNIWXNBSUEyNjRUc3dxVHhmWSt0Y3lrR0FIb005SEVNTndCMGtWZkJvSlFJK1ZiaDR5ekRRSTZWdU5KdzRyT1hGUUJRZ3JncUVpM0sza0NsUE51NnZmMHJEd0QrNS9QMmY1NjMvemNIQUdCaG9ZSmhYUGtnMWxpck9QZXpMcXZGUGtvNXVzMStMbXFlRHhENHNBUkh0QVY2bWdnQW1QaDMwOWtWME5oemRFU0VHd1lBdUpsbUF3MVRJTEdhbHFiTUZ3TUFyTnFINkgwM2NPTWVTZVFBY050UmVBWUhob2NoRlFBc0JnNDRLdzN3TVIxMHlOUFlwR3diTFdYc0dNSjQ2d3A0WVJhOVJpQ1cvbzRJSE1VSW1Dek1Jc0J0eVdXRldYWmNWaUJwazBEZExobnZRczczUHFiM1JrSTBnb0JKMkV0RE9ZR3B0cllzQUJBNkJEbDIzcStFVUJhSVB5WVhOa3k5NjY4REFQQytuS0g5ekVKZFJRQ2g2RjFHcjQxd0VrS0NVRlU2cjFhTnZrUGVhTTE3WWRtc1NRSTZvVDJiQkFCNkZmYmhBYUY3akVuZ3o1Zm9nRDRtOGhpNlpNc1JsNUwxN0FVREFDd0JPM1FQTnNZVzVNRmJ6eDVwa2djQXBZVTdBOGFWRCtKRjhyQndPZ28yRkk1QlYyZ3pucnNJejhSYTZhZ1NwZ21PVEZCV3diN2h6ckt5QUg2a0VQOGVLY1MvS1FYRmM4cU41U0lyUmxwTlBxMDMzSmE3MlRLMGxtcWZGWFBYTWc5U3NnQlFKblJONFJrY0srN0I0UndBZ0hreTZDbml0Q2JraWVEdFNlTnBDR2x1bjI2RkZVaWZ0RzdTV3U3M0dxVlB5YTFYRHVoZDRvZ2NLQVRNUWNYTHhEZjBmUVZRNERpc0xJbVJ4UGMrb3ZkbVVIZWs4SFRFSmpRTEFHamlQRlljSERsRENIWWsvTU4yYlRiQTBVb0JBS3lHS2pWalFrSmQyMEFhWnkwRUpDbHIyUnFZQm1oOUwxa2pWb3FoMkQ2TnYyQ0ZEU2FJaUhsbEFCQVNHdGtDNGd3ZXdQaWg1K0VsOWlDRnJHajBod2d4OXV5VkFBQVE0MTRpRDhBV0dOelFzNXZCQWJnUHQrR094SU9ZaVk5TUNHTzB2S3E0V3h2OTNEVklrNUZuTHJ0YTdmY3VseVptVWdua2pXdFpBRDlWaUgvUEZPTGZMQjBvSjhTcVh6RUF3SFpDV3pjWTFpSFNGaHRhVFFsd0JUd0NsdEV0SnV3UkxWNHBOUmNXeUUzTjNoY0U0YWtBSUVSOG1pWFhQR3JJVyt1eEVrblAyaWJ3c3F2Y2dyVGM3MDFZQzBmQURWcUR2Y1Mvb3dHakRpVzlsSVZacXBCeFZLSHdxQVhxeGhMZkc3a2JxeFF5Q2Uybndqc0NBTGhXK0ZCR3pZTTI0b0NJMnVna05TbG0wd2R6bndjQVlEMFVMSWtkRXVvNmhQbm1NQmxtamJVRXNwdVFESW9odVNPd09XWEtTSnVoQzF3ZUFEQ2VZODhtQVFDZTZDMklON0U3WFhOVHpnQ1pCMTA2UzhTQ1BEVFN5cXhubHlCbGd3RUFDMHdjS1Fkbm5tZHJXUUQveG1jQi9DL243WDlMQkFDMzNhV01hT3BCdkV5dUluVFZGaUdyWVE4UVA3dlBHL2xjelBEQVZFTFdmaGRYS1V1RG91QUlob2FPbGZDQzVqSyt1RFZlVkV2N1ZDSCtvWnN2UnZ6VHZFZW5Sc3ljMjM0Z3hTcW16RmVGSEdkdXVBWlRDVWg1QUlCVVhaeDB0UktxZVkyNkJnQXM0dE9jNFIxNnFaQWxXYUZ4bi9iNkFvVjBRa1NvN2tEdWR4VnU5OEptbnlQT1N3V0EwU2E1WmkxaEZselBCNVIxd2JjK1M3VXU5YjBsZTJNT1NKTWJBYmN5ZWpmZkp3RGcwSjVrZ1VpcDZVRWdCMHBEcmsxckhRRGdzYitNdExyTEtvWFdQSnpBUHEzQ2Q5eDB0VXFJL2E1V0NaQzFDVkFjcXdyOW4wR0dpTVZsNmZwOUF3RGJpdHVjQVFBK1FHSmo3S2Flb2NHa0FBRHQyZHJITzZFUGVVaFpBSE1Kenc3cEFGeHNnQXNkZ1AvR3B3UCtkeTVOQjZDZWd4Z05JaUw2Wllwcm53UTJXYU9ldSswM3d4SEZaUStOWFBWQkplMVBFeHhCVit1cXF5MWVJNXIxVW43NGd2aDN6U0QrRlJLSmY4c0tCK0hNWU0xenF3Y0F5RGpQZ0tDSDdmQWRBWUJDZzR3NnIvR2k0czFCZVZQMkRnay9KYVZtd3BxUzV4MDFiSUhZNlFtRlBMUVFUd2tBUDRPemNTVTd5Zkl5cmRFN2J4QlEwbGp1b2ZjK29sdjlXd0IxTWRLYXJJSGZCd0R3cmowQVdKNjQxL0FBN0xwYVpjSkRDaFZ0S3RsUG9aQU5pcXlWNGRLMHIvdzNpOHZ5ZXdNQUxMZDVYZy9BcWhJM3pBTUFZaUVBVmxjN29heUJoWVJuVzBxQUtHbUpTb0RTVWdEQXkwRHVLT1pxb3pBRzU5NnZVd3ozTEFFQVhPVzVTUExFV0dZNTRDb3RLQzU1MWhPb0dtUXJNU2dTQThQeXcwTDh1K2QweWRRWkJiU2RVdnJpQW9BUjNpQTdDUzBQQUVBUERScmFQV3JOQmdCWWh6NkY0WndIQUN4UjdQNlVnTGRWR1RCVU5iRUlZVHlNeStLTk9nUUFOQkdkTWgyOG9iWVBidnlRa1MwNlczQUZ5YVR6aWFsZm9mZld3TWlnd3FJdkU5OEYrMytYQUNER1gzbFhIQUFzVHp3QzJUeG9sOVlwekZRQzBtVlZJWi9MT0xUVVprdzFSL1ZEamFCKzdHcVZBUEhicGdLQStYZkZBU2pUUXVRREdOMWxHZ2NnRklkbkFHQzVVN2ZCQlJiTEFqaFFDRGV4WjJ1MUFMaW94VEc0Y3FSOUd6QklYQmFYaXp1d1lodmU4UEh3d3RpOExMQVFBR2pFYzVIa0tUZTdEUUlHbXV3cmE4a0wwajV5dWlyYU5HUVVZQ3RBaGtHTStLZTVjVEVObE51T3E1WExYSTIwRmZKMGlGZ1JqM2RWSVJ2aStsaFhRbVBUQ3VDK0tnY0FqZWtpQVBjOXAwdUZpcnM0RlFBd2V4OUJ3TDdUS3dQMktmeVFHY1Y5ZWtCeFdXelZ3SDdyRDh6TmNXSzR4enFrdGJDRkpiazZEb2RieWcydTM4aERENUhwaG8wMHNlTjNDQUJTc3dCbTNrTVdBQloyZTJ0azl2QWVXVlo0U3BxYW5oWEdPcVFMenFxNzFGOWg1Y01xMmFpUUo2djBQcklBK09GSFNoYkFzWklGc0tSa0FWaE1mSTZ6YWNJUzVTdGtBZUIvaXoyN1ZWazBtSis4VGE2Y01oeklsa0c2Q1lRMWRsblB1RXVkZG1iOUlxT2FpMnVVd1poWUFLQVJ6OTBsQUZjRXBGc09wUEJweHF5c3NQRXg5aVU2QmRpbXdIMk14TC9YaHBjQlhiSm5DamVFbSthcW5BdTBXWGRacGxSMCtWL1N1MHpEYlNaa2FEazBOdUhTRk1WU3N3RFdsZHZOSnFUc25RV01UeW9BWUpDOEQ4RFU0bmNNT2wzc2E1M2NweWV1dHNoWDJXVUx0VmdBd0RxUXFrYklVR3Q1RHRFVHA4dndEdGNCQUVLSEd4Y1FLdndlQWdCTGxocUJjK2M3MGdHSVNRZWpxaUVLYzJtaEl5WldobVNHT2J2bUxmUWZ5dE5uRFlQM3BnUEF4VnN3TjNrZjR1cGNRV29MYnVFeEhRRGVOS3plaEFQZlU4Z3QxaUVmQWdleFo3OGd0eEVybEsyQ2U3SUVpellFQUs2N1dyVzZYb2pMVGdSeTd6ZmgxclpMYVhrV0FKQURzeEhQNVV5RFpYcVhZMk1lQncyM0lKS3I1RkNZY0ZtbFFtd1lHdENJZjF3cllnZU0vYmNKUnQ0S280d2JiUXdBVHBlNzFGdG9oeHZ0YUE1RGkzb0ttdTRGM2l4WkZ6MEVBRFN3c3crWkhhZTBaL21BemhOUFpKQzhCeURBU2d2VWhLSFFxNFJwZXBndFVVb0lBY1QwMmZkeU5ENkVMSU52R1dST1p5NEQ4SW9CZ0ZRUGdKVW4vcTRBUUY4Z0ZHR2xtUTY2eGlvQm5rVXVJcFowTUx2MWh5TUFENzl2NklaK3FLVHBGWXdiZWtqRXFPRHlLUUdtdkhzdUpVQXU4RkFoOXkwZUJoeUx4NC9KYW54OG8rZnFWVXdRMmxhZW5Rb0FLdUNLaVQzN0NSQkhlaURPTmdtaGpVWEQwMkFaSk5hcnQ2clZyU3VIL0pweE95OFpBQUFQektzK2wrTnh6RUdvdWxwNTRBbGc4RTRxNEZHN0tYR3RBbXpZNzBPRCtEZFBZTFRxc2pXKzZ3RUF3d29qR1pzb0wvYTRiQ25wdklJcnc3Qyt0SkxGeHdiSElnUUFUZ1BFMkZQWWsxakxvMTRsUUpGRmZndmZBVUhBcVpIeVpobTNZK0s5ckxtc1hrSUtDYkFlNzRqVjJBM05sNktRUVI0T3VQUVBBd1JES3dSZ2NRQkNYSWQzQVFCNm5GMDZtck11Wm1ITlhMVVdRRjRBVUNRN3lncDhBc1pUQVY3TVJjOTFCcGkwR1FNQVZpMkFVTWpwYmNSNzhiMk5qZ0VBclJUaGhwR1dKaUFBcTEraENBYXFVMjBxTjAwV3JPaHd0c0lTL2gzbWNQSWh5R2xGMjRuUHZrY2dRRkpVOE5hc3VYSlNBSUF3MTYxcWRWanNTQTVKWkxTanlJY0dBUGpBdk1welpWNm00R0Rhb01NL1ZGblJja2V4b1p3R0V0Z0doVlo0d3oxMXRscmFCcm4wVTI5Nnh3WlphVExTUkhsUmRPTGwzZkxXQXBpQ2tBRjZWNDRVSm5wcUxZQmpJOTBRWldNeGhWTytBNllncFFLQUJURHFDQUswd3dpTmVVamw3SkFJVHJNS3I2Z2VFdUNwNHNyVjJncDR1NWlJbHNjZ1R4RHhrcjFnRElwQ212cEhpaWRsM0NCMmZ1UDBxcDBXS05mQ2VKTTVBQUFmVkt0TzEvbFlCd0wzSE1UY3VVNUxxQnBnWGdCZ2Nka3dETE1PNThZOHJJRk5KV3lKaDZqbW90ZENRc3MwWml0dGswTUFIVGxKcDlKL2tjYkpOcVR1YW9CRjViQW9BWUZzbTJMR3dpN1hxZ0dHRkpEYURJTEl0c3VLMDVSY2JSV3JSV0x2by90d04rSFpYeEVJZU8wL1JBL2txaFp5R1BpTDMvMGlrSkxIb2pVYXVOb0RuZ1hHUVhFaGFBZm1WWjQ3QndaOXhmRDB5RTFLMVBIZXdrMUQwLzAvVWxqNVN3WXhSb3U1dlhSeHRiUXpXcHVoMjUxRlZscElhUE4wYU5aYkRYRFJaUXU5YUNwOUd3U3craEp2dVZ0S2s0STNhekRXYVZkYjlDWUZBS3hDUDBJSTFCanZLUUJBaTQ5am1kTWw4aTZrcEFGYWhobDVDY0svbUFYaldZS01qeFZLVHgwd3ZLSm5DcmRsSHZaUHllbGxhRG4wcVIwb25EVlRKSU8vb3N3TEV6dEhqYkRja1FLQVVYZGh6Y1UxSXpSSlhINTNGblphQlY3S0ZvV04wRDVqMmwzM0ZUa0FDRFNSZ2I4TmV3SkR2THVLemNJMXJBRWYxaDdaY1ZuaE5CUzAwc0FGaG8vYWpmQUszdXp4TXJ3S1hsUk1FOTlYMWtKZkRBREU0cXdWZHlsemlDVi8yWDIyQ3N6ZWZZVlJ6amZ3VHVXV3B5bHVhYzllZHRreXEwSTRST0FSZS9ZMUFBR1BQT0hzbFFjbGIrcTQ0UlY4bjE4SERna2tKaDZTOGNNRnE3VnZ5VzJLQU9BcXoyV1hMc2I4RCtEd1IwSU5LbVVOR1BFOUpJZGhYSGVMM01ZYWFuME5lY01XOGM5SysrTm1zWlZUWGNPclpMenpBZ0JzU0M2TjZmU0xRbUpxRnNDS3E1VWRYcUtiK3hnYy9oTE9TQUVBa2lXeVNRWVVnWXpsemcxNUFIRHM2eTViR1JBUENpc0RKWFFqUFNVYnNBcHpnOGF6QXFFMnZLVnJYbEhyUU1Ic0dxeVZvQlVpNDlEbm5KSFJzbWNZL0R6RVRtMVBvam9pcXFsdXc4M2NBZ0JjZVhGZVNaOUdYc2V1WHgrN2tGSjhETyt4WjlqbmVuUUFXRnlKaFp1cWNIbmFjVm14czBQS0pPSUtqaDB1VGM1NlR4a3o3L05OVnl1RTlscTVDSys1V2pYTUEraC9oOTdkS3N6VkV3TUF6eFNEYXhXbktFTStjMGxKeDl1RjM2MjRyRkFJRWlUazlxOVZkcHROZlBZR1BSc2xHVk9lL2JHL09kLzBwTFA3M3JnL3E5UEZtd2NBSEJCYVd3UmpxalVNQWV3b0tMTGU1ODdTNFNxS1ZnSzZ0TnpwTFNPbldTdktjK2F5QWhuN0FTT0FOOThVNGg4YVAvbGJkdDliNlVwNXlHRnNCRk1Cd0lITDZsVmd4VHNVSlRvdzR2UDk3ckpjYktvT3dBdzFjZkZpSVNjOC9KOG1BZ0FVNkdJRFdnWURwNm5TV1NUakkzY3BtSVQ5N2xGMlFJaTcwUkc0a1I2Qllkd2pUOGtPWEZLcXhxMVBPMUMyNkVDcDBIendZWUpyTzZVTStpN3NtNk9Jd1djU0wvSUZRcmRKVE4xRTBpaUtXVmtBUUxzc2NtWUlwbTdpQmVZRTN0c3Fab1QydWQ1aVFLRnNrMU9YTFRxRlZUTVA0WjFXQ0locnRRQTRHOGJxK3hTKzVaYmlqZTcxODJxRk8zZGRWbnJhZW5menNoc0RBSS9JNVZvQTQya1Z2Nmk0MnJLOGNscy9nb01LRDJCTXFlcHdsOUt2eUZvZnJ1UForMEQyeVBQc2l6cnpGNHB6RjZJelgzcHZ3SjA2WGJ4NVFnQnJZSWprWmpBSDhVaHVHZ2RnMVdXTDFkVDczRW5EVFhnU3lKdG14ckVXUGtJd2NRSzN1Q3IxajBaZ2ptNUlRd0hpbjRhbUo0aThaOVg3enBNZVZxa1RBSHdENDhWMkNwdTQ0dlNTdEJpZmIzWDVsUUJIb1FuQlVXUldPeUdiNGFrSHZTa0FZTTh3b0Nmd1BjdDAyeFdEM3VuQ1FsRm5jTU5obzdudndrSXpYR2x3VGxsL3B4QldZdzE0RG5FdEtyYytCcUhiY05IUTVvTUw5UlNWQ3dpSFhlY0loQi9SV3JIbUJyMWZhT09zMjJTWjlpT25RaDVRUEpubm05Tnl0ZlRwSFRnUER1SGRaZjczd1Q1cjVZekZQbHVrdm9vQkFOcG9Ualc5aVRLOWs0U0pEeUJzVVlSUWtGVjFrb0hQcnRMM01ZSG1UYWVYbnU1VUNNK1RDaC9MbXRNeXZQc0trQnkvRDdQSEFBQ3FyWFc0Y1BuTEhUcHd0WW5FR3RuTGRBRDNnMkdUMHE5SStIcVh6LzZ4KzEyOStZdWlNNThrM0tLNW1FUTlKRUFzUzRtdTlDbDNXY2dGRzhaTWVlSFB3SWV1OTdsYWdaWllZd0RBaG5LZTRxdDQ4MlZ5R2hzQitVNFc2WWJmWTAweGZsMHVydGVmcCtVRkFKVUlNZStBUEZsTXpzUDQvSXVFc1dqcW1uMXdFSWpDWXJ0LzcrZCtEQmQ3NzVhekMvWGdHcmYySGhyMWJaZlZleENEamlUamtPQ1dIRVJIQUk2UXlhMk5WYXNQd2VFc05NeE1XdDUzdGtaN20rSVZYUUlnelFlS2hCMFBYRmFXZkY3eDZ2QjdUd1hlbXlXNThVQlpwUU5sd0s5TFRUVVRMMU1zdUZSMldUWFFzZ0c0SGdYU3B4Y2duUmhMSmFNQzZSWmtmQ3pUNFMvdi90cmJaOVlYc1hoZ0tBV002YzhJQWxZaHRLUzlGMmFoYU8vMG5OYUROdWF0d0pqWGdjK2g3ZlBIeHBxWWc4dWJOYWViUUxxY3AvUHV1ekI3REFDSTNycFVXOE9EV0NaeGdXSm5XNHFibWw5bUVWaTFlQUMvOWhQNjBOOWFHL1hzVXM1bi84MTUrK0Y1KytpOC9VWUJBS2thNWhodnVRQVNOMXkyZGoyQ0trbmZtQ1V5bmFRUllSNDYzanBDQzcvdkNzOGRONGlVb2JhcHhPdUZUWTRnWUpsaXV0aVF5NkZ0dUc3bEJxUDFnZTR1dVRXM3UzREZ2cnh0ZzF6YWVkYUgxcEFjaGVNZlYrTHpUeExHd3JGcmNURzNlNlBWNmk1ckxEenhhLytPQjR6WEZMTGJwckxHY2UreEVkb0NJTE1FckhpNTdhWUlidTBRb1pnMVJyYkJ2cURtL2JQQSttUER2S2VRbHEzMzdsVzhvbUtQRmdNSGltYVFlVzIzdW14bHk5Qjc0N3pzMHR4WUIwcWIwOFhBbG1ET3Q1U3czb2FyMVQxWkozYitYU045ZWd3dU1VSjJMVHBkWFhNSkNKbVRNRGRTTytLRkJ4cGM4bnVaT0M1TDVQbDdDblpQdmhtS2RTMFpYdFlpWllGTUtlLzBPR0hNVnQ4clFGaC9hL0J3V1BSTVFNQWtuSUhhbkJZaGhNenYvdjE1RndNQVgvcUQ3NkZ5RUJkb29BdUJqOHN2ZzRjYkg4Q1B2QkY2bjgvK0N3OENmdUs5QU9KR2YrZ3VOZlV0RFhOY2hETkE1dmlONzRkQmxTeEsxcWtlOFQvcjlYOHZEZmtRUzVHRjMzV0Y1K0t0YkZrWjM0cEJMc09LZ0M4QUhZc3htNEtGdTJUTVc4Z0lZT25OR2FPUFpYQjNGUUJOdjFaY2FhbGpXMGw0VHA3MXNXS01mVkVaLzZBU243K2ZNSlpsVjF0Y1NmZzF6N3pCZnVUWHhWMi9SbTU0cjlISHl1MWNNN1M0OXl3akpOa1NlSWkrY1hIQnJhS3JyU1JhaEcvT2FtNjQ5aDRGMWg4YlppWjI4bnVQdzN0M0VKQk9QVkNLZEFHWk1nNjRoNUgzWGdxOGQ4cUI4c3E0RGVOQnl2T0twT29sV0tkb2E3NHkwcWNINEtJeEJka1dtcnJtTlBCU0NpNHJ0UFhDSDdaM3dRYU1RZ290OGx0a3Jja2w2QUh3dCtTYkRVRkt0eWovV2U4MFJXY0dmcTk3Q3ZBWjhHdHdQTkQzSEhCeEpzRHU4ajRYMmZQbkJBTHdESncyNW5TRzNyMEdUTVVBd0dmZUlQQkIvQVlHaWg5M092Qng4V1h3Y090UUR1Q2JEWDcyZE01bi8vbDUrMnNmQ3ZpbGZ4ZVVvR1VOODdjR3lRb054eS84Ylp5QlRZdXJyVlFscmxxcG45NEJEYjBnc1lYLzVnclBSU1E3azZPaGJPOWp4WmlKUjJNeU1HOUlUbU1qMEU1R1YrdGptanc4SFg2ODdFcWJWT1l3VCtQbjVGa2ZNOGJZcDl5bHZrQUJERTQ3SGY2M0VzWXlUUWVOWk5jODhZYnJqbDhUWC9uMWNRRVVQL1dnOGVkME81OEt2TzkwZ2xFWHZZUmUrQjdhN1drVXhqS25wRjNPd2poWnp4MFZNTzhHMWg4YlpuN0dYT1M5VXc2VTJRUWJ5QWI1Y2VDOVI2aHZMcG96QjNNd0FmM3pnYUxkaG5IT2VVN3hPN05FTjlxYWF3b0lFTURlQzZuVG80cEhjeHd1SHdWNGI3SFBPRGMzYVY0S3hHMFpkWmRsai92ODgyL1ROM3NENllSRGNBSFNWRDlsSHc0Q1Z3YmZTUnV6aEJvSDNhWElsOVgzTUpBenU1Ujlmc1B2VXdRQkhiQmZRbk9LL1NQUDUvdjVqQUdBWDlOQi9NQy8yQ3Y2dVBJaFloT3BEYmJGZnhnOGdEOXZ3ck1MT1o3OVQ4L2JYNTIzdi9XRzhHTlhXMy8rRFh5RTRjQWlGTVB4a1RHbUp5NWJxL29OdUdsYi9hSjY2WitKWGhCWnVLR0YzMXJuYzlzSlpJM21hTWdvWjJQV0NmME9HWDBMT1UwVTluakRzZEVkTWVhK1FCNmVaNG9ycldEOGZXcmo1K1JaSDZIK1VHRlFqT0JMLzgzazhMK2VPSllDSFRRUzVycmwxL1ExditZLzhRZi9CZUQ5NlhuN1VjSTZHSW5zdlRHYUl6bU1Xb0RuRXhMY0duZTF3a3ZqNUxFYVU3eFhVZ05EVzM5b21NZGNiZm5aQ2JJWjJudmZCbnVVNTBBWlUyeGdtM0xBOFh0MzBaN1gzbnVjNWdEN3h3T0ZEOEllV2o4OHA3SW50ZmE5cmZtakQvLys4UDRaaTJXQU5paHY5aUhsMXRiaUQ1cFcvNzlmK0FYSk1jZVAvWTJWRGR1b2NxRGo0Y3FHUkVOZ1k4U0VMaEFEV2p3QkwrbDlYd0U1NnI3Zi9GLzZBMVhDQXlpMSs0cU0yWkM3TEFpQ0cyZEllYTloY2dNMXE5OW12dk1yZjZCZ3lWN3N2dys4RGVoMWtNTk80cUFQL0Z6ZmhUNjBRM1dNMXA2c0NjMXoxT1gwRXNQaVplbjB2eU5rcVE0SUhYVDR2OEcvbC9kRkQ1SUdBRWJnTU1ORHJPQ3lOZEFud1AySklPNVprL3R1ZEovTmZOZjdUZXo3TjM3dE1sQis3bTNDYTJXdFdEZFJEWVFLR1AvYzZVV3RMQ0Ezb25naG52aTljY043YlFRNFBBS2JqYUJicEowSFlTOFBrTmNQYjl6aUpmb3FjQW5yU09pNzEvZjl4cy96Q3lDYWl1ZnB0cDhMRmw3ckR2UTlBSDEzUU4vNDNpbDJoL3NmaEhlWEMwaDN6akUraDZ5cnZNL25mcEdrKzlSL2c1UitlVXpZWDFzcUFORGNSV05HTEdjV1hOQVkyMnFIU1F5eGpnVUUvRlp4YlhJTWhlT0ptaXR4UklrN3paSnJWT01DZE1ERzdsYlNveDc2elNBYjd3WWdkalpLTEJ1TXJyTUpjcm5OS0lTdlp2WGJ6SGR1YzltU3ZTOFZRNjNkTXRBZ3kySy9CekZSTExURGExQUx1V2pja1NGWFcyTFlNbUJpQ1Byb2xqUk1YZ3Jra0R4d3Rmb1Y0bTZlSXpmMmxNdFdaRnlnMlA4d3BhWTJzKzlHOTluTWQzM2N4TDRGdU42aFVGbnNJTlZpMFZvWTZ0Zitrbk1kU01VcFlTbGUyNUlGOHNCN2NqNG5yd0c2aWZuQ05tRjREWEE5dDRQSDZaNFNPbVRQQWJxZ3JiNzdqTDV2RTdCZ2IwcEszOVo3cDlnZG5wY0o4bGdQZ09jbE5uL3MxYm5LODhmSWZkOEJIcWlVZnNjVjBQczlEeUFWQUZqcEV4cnByZ2dFTG1TM1l2eW5vTVFqOElPSkMxNGpOeUdoQmdsMlF3RXlFVEpQVjREVXdzeE96QWJBRy9BUXhkSGtwaUFnNExyZmdFamNZYVBFaFlNVzRkQmFjbG1sTmxUUjYyOWl2ODE4NXc2L3FlKzVySkRVa0pKeGdFQmlBb2hxN1VDSWVrcHNjU0ZiNFJwY1VkamFWdllJbHhpMmpDTzdna2VCdDRCeFZnUUJZdEJad1ZLMHp0Y3BwV2pXWmF0TG9vWURpMU0xcys5Rzk5bk1kMzNXeEw0NTN0cWFjSkJPR0d4MGpZajZ1YnZVRmJucjEzWUtNWlVKeFowQWh1UXl3cndCalNnMlI5d0I1ZzBnNFZRTzA4Y0dlVmpqRHN4Rk9BbmM5eE9GVDlGRGZJcFEzOU9Sdm1OMlp4ckE0VHh4UUpEUE5KRmpqQmh1UzNuK2RPVDVURUJ0U2JTbnM5VG5EUEtCVWdFQUcrOFp5ci9mcHB4R1RjQUJpWG9hSXhFWG1yRC9OUVV2Zkpha29BamoxMG9ua3JTWlRVaHYyYUxjVGhSSEdLQWI4R1RFRmZrVnBkZHBSbWtWMHBZd0hSRkZPRmlFUjRxOU5LdmZacjV6SnlCNkFaQjl4SWd2VWtQaG9rSHdBanduN1lJUlNJRVVlZWR0SlY5N1ZEbjhVZk1BS3laT2tZY0pOemR1eExmQThGNXl1bzRFRzNST1ZaUjByUklBNW5WSVJSTU4rV1ZYcXc3WHpMNGIzV2N6My9WRkUvdStrOEM0bnFHREFNVzZTb0VVMFY1M0tTaDIzMTFXdFV4SlRlV1U0bTYvdnA5QUJvZVdPV0NsaXFGRU8xL2N4dWd3ZlFFZ1hFdkZuZy8wdlFKN1JldjdaV0pHUlQxOXYwaXdPMHQwdVZ5SC83ME1xWlNwNzhHRTI5VG5XLzB1S0Ntb3FmWjBoY2FFV2dDRlZBQVFrbEFVMFFnUnViQWtITkh3WWdxTWZEQWtKOG1oeWdJa0l2b2gwckVzemNrSGhLYkVoQUlwS0RhRGg4OG8zWUFYNkhiS3JzZzdUaGZZWWFPRWRkaDMzYVh5VXdubVVhc2ozcXgrbS9uT1hRbzVpcjhuNXhxelhqbVMveVN0VGtDS0tNWkpkVVFSMFdGZDlUZks0YjhNK2N4WUk0QTM0YnFTQjR4aUxKcVNaSC9Bb0tNMk9NckFGbWx0b3o0ODFqL3ZhSExmamU2em1lLzZzb2w5UDFBTy81SEVneFJybEdoQ09YM2VLeWFTNGk4aEV5Y2s2S1NKaW5XN1dnMEhTenRBRTR0QmlXTFdEc0REdEF1SXlOcCtRdjBBNlhzM3NlOXVJN05IMDFUSTI3ZDQ1R0oyeDVvWEZBQmliUWRyL3JoZ1ZOOFZueS8ybHIzZHFmYVUzelZUQ0NnVkFHZ0ZOVVFSNmdRV08wcjk3cmxzT1V5c0hiQk8rYm9zOGZqSXU0OHRDVkpMNHBRTFJLQ2s2SkhMbGthVjZraGE5U1dVbDkyQUQ4RHV3dGZBWXJZa2RsbldGTlhNRHVEamlFenhqbktiYmxhL3pYem5UdWdiMDZQNGU0clNtRmFESEhrWi9KN2NoMmpHTXhoQjZVK3VJU0U2NmF2R0p0UU1BY3JJY2kwSmNmTStEeGgwcWZyRmxmUndITWV1VmsyUkFVQXorbTUwbjgxODExZE5ldWR1bDFVZVRWRmQ0NE9nN0xMVkFGR1VxMWNoMEhXNnNEcGxOUUFBdW9DazJnSUh0S1llaUdxTklUbmFWWmZWVXBCVTRyYkFmbUlGd1pTK3hlNTN1cXg4c0tXcWFLbE1odm9PMlF5c0FXSE5DeXBCNG5zY0tXUEVnbEdvalJCNy9sYmcrUWZrN2NZdzYwREVua3FOR0R6N01vQTBGUUJZSlRXbDB4MXdVKzBaQ0JzTHptRDk4WG02TllwTDY0N2hBUkNnd1RydlkwNVhYdHVCUllQRmE3Q2NMZGRmNXFJaDI0cTdzSTlJT0tsVjlxVEFSdG5WYW5qampRRXJRZUhHYTJTL3pYem5EbGVyTm9ieHMxQXQ5MWtnYU1tdCtxV3phMktYYVMxaW5XNjhJWElWU1N5aGlWcmFYR1dSdGNDdGFwTGk1aFVOQVBHcVlKVzdYUURNT3hDQzJnUWp3SlgvY0U2YjJYZWorMnptdTc1VTF0WlYra2EzTFhLZWh1SHdSOTMxL2NCQmNPVDBxbTZEQUdhUlFNZEV3bFFBZ0d6eFhtRE00d0dOOVFPa1lBd2VubGlMQS9jREZyc1pCS0NoZVlKMzRES0kvY3U4WUcyQ1RiTDd3NUQ1RTZ1clVLVytwZTRCdm5mUlphc3FkZ2N1a2lmR3ZNaC9rMHZGQVFBN2xKYy9ndkZoWlVrT1RjZHFhUnpRR3BML0xmVVl5a2FZTmRhdnJKMnFNK3FXcEFJQXpjMVdkdGxhMWtLdTJ3SWppcmN4MllBSHhvMlBZMXAzWEcwMUxKUzgzWVJidTB5MGRaQWhPbDhGUkN3M0JTNGN3YVVXTFQzMU53QUF4UDNHR3ZYcmNGdkd1dlRiY0tpV1hWWXJmWkhRTjdyMEd0bHZNOSs1blZ6MlNCd3NCZ0FBeHErdytNOExWMXNURzBOUk94VE93Wkt0YkZTeHBLa1lENmxRZHViMFlqWll3aFFMSWgwb2JsNmNWeTdtZ25IZGRkZzNLTUdLUlVGNFRwdlpkMHFmeFJ4OU52TmRYd1RXRnZlOTdMTFN3dGgza2VPaTlNN29GZVBLYTlxaGNRYTJqOE9nd3hDYlpwSWI1dktuQUFETy9SZDNNOWU4eDhxS1d1WERIVnJUV082V3czRmM1cGZMNldJNVd2U09WT0MvNzVObldHNnpXc0V3OURKYmZXTXhKNjFxYUYvZ29EeFZic3pieHB3Y3VHeVZ3aDFsZktmS2hXZ3M4dnlLcTYxMmlXTTdvN0V0UW5qQjZ2Y01nRjBGTG5ENzlRSUF5elYxREloSEpGMFpIS3k3MmxLV1hBUGI4Z0F3bWwwa2R1Mml5eGJuMENyY2NkVzhFcmp2S3Nya3ppa3U4RDFsMGJJSElIU1ljcnhuaGVKSlNFamtnaU5kaWt0dnllaDNPV2Uvelh6blZpVjB0RWI5TWdEQS80WWVtV0VnbEduVnZGYUp0SU9FVHJ4OUxvSkxFVUZBRlRZYWJwZzljczJkRVVqUXl2UU9PN3N3aUZYL1lCc09wUTFuYTgrbkZBVlpqZlROaFo2dzRJalY1d3JzQ2Y1R0swU1V3aldRK3E1TXp0MkMwSnRXQzZMYnI0WFEya0szNmF6THloaHovWUJNWE5UVkZpZkNtKzRoM1dqNTBPQXkxaVZYVzM2Vk0xbFl6VzhoQWdENGQyY2gvR1NGUkxBa2JBa3VRcXZnSVpDOWVLRE1TWit6U3dnZnUyenBZU1RSYllESDdReEN0M3liN1NOUEhYcVpUOGdWdndwN2FCY09TcnlvemNGYXRBN0tid0h3bElESHNVWmprMzFmZ1hYUDR6dUUwRFNIUkVQUFA0YXhiZEJaaFJVMnk2NjJqTGJWNzk4cC9XNVFPUHM3UU4wSUFJQ0R0UUFBSXNWUURXem1BR2p1V3k1RWdZaUlLOXhoM3U4NjNWNHI1Sllxd2hnUXJMRDdaWkk0QU1KZ1phT1BJS1I0UmFQUDhma1N0VldZRzgyUVlsR1FNVExRV0xTRzMvbXFCdHFxaG9kVnhxcGdHTER5R0pmeWZHU2tvMDY3V3Qxckx2Q0V4cFpCUU5WbDY1L0xCaGV1eWdaNFByQ09PUi8rZVBpMU9Mc211bFlCOFJCYzFudk9yajdYVFNtYkJTTVd1eGZwV3lzNWlxQ05jOUc1M2pwL0kweVY0a3FGOWI3clBoek9Xa25ZenNqYTRodXpWdnI1ME9uVkhIRS96TG5hVXROSExsdStkWlVPakVOWTA4d3ZLaWlnbFBYODE4SGJ5UUNBZjJlTkFJWldJaGZMb20rQngyTUIxcVZjaUw0eDVxUlBtWk50T05qeFVyY0FLVzBTU3QySG0veWVRdmhGRzRlZVpPeDdEUzVwOCtSVnJpb1gwc2xBREI3QnppWncwdVpvVGc3aG9FYjMvanlNcjBUdndEeWtrQWNBejVjbEdCcyszeXE5bktmZlJTSzBmd2YrOHdJQUt3U3dEcmZ6TGVXL2xXQUJITGhzdFRqT3djVXNBQXZObG8xREFnSEFCS1RxYUFhQ3kzMnUwb2N2R3pFZHlaSHRwL1RGWmhwOTdVT1hpVnl6NjdMMW9DdXV0czQwRTN1YWJhQXRBSUR4ZGJ4OUgwT0dCMzliTEF1dEVRdFJpYkxnc3FJZ1BRcUpkWnR1SlhneldnTGp1RVFrcXBoeDczRzFkYnZuSVJ0bDM5V1djT1Y0WmprUVd1R1V6UmtpTnBhaHZ5TnlUeDhUY09IMVlLVzlNUUE0TTc0UkswSG1lVmQycFo4RU1vcUc0WnZ5MmpveFhPYmFCY1k2N0xqU3BMalIrZEFvS3B5WnNuSnpMYmxzeFR6TnJ1MFpEUUdBOXQrWnlOaEhxZFByeWcxd1ZRRWRXd2tBZ09kN2x6eDRlRU1kVjBLeEdEclUrQXo4KzBma2tTZ3FEYi83aWRMM2NFS3NISDkvUExCT3R1bmNRazdjUHNUYVV3RUFQMzhhenEyVWRaclNyNnk3S1VyQi93Nkk1aVVCSW9sbm4waGdHK1FPUVJic0Rod2VPNGJ4d2ZLbW9uTnVlUjRzQTJUZFpJdmtJc1RZRGNhbFZnaXM3Qk9yRThWaFJpbU5wWmxHUC9haDl5R3I0UmlNNENrWWZZMlExR3dESGVOazhEaDJpQ1NLMzlZcTVDSHpJNDIxODl1VXVPZ0dHQTMrL2xMNWJSSnV3UE5FcGdvWmQ4blI3YWM1eFJ0aVZRazE3QkZwcDZ3UTRBWURLWnZiOFBjYzA5d2xWNjBHd2dkZGJhR1IvcHdBUUc3K29wYVo4cTZhSzMyUC9ydmxTbThXQUdEUFl3a00vQkhaTUx5RkhrR011cUxjM0dZRHZCVGtGV0NyQWhtTm01Ykp3R0IrRVhMRXVUenhyckwrUWdDZ29CeDZKOHBGY0FyeStDMnY1UnJkMGdzS3lSdzlCdHVCdHFPNHluRmQ1Z0VBZWRaSm93RkEzdWZuNmJjQTdYdlNhQ29BUUFZNjM2Q1F3TEFQUDlzSDEzR1pZdTFjb3gyMWpyRmdSVjRBRUl0bGw4aTF2US9HZUVzQks5dXdVTGxTMkZzd1JKMU5Odm94VjQ4V3V6NkFsTWtqOEdUZ2dtaTJnWTV4TXJRRmkzWEJNZVRDbGJaWXFya2IwcUpRaS91Tnl3cEtvU2ZwVE9HanlDWmtlZGQ1dyszSnhqMlVlb1IvdHdOaExBdzFWQUM0YWU1TVRRdGhFNHl4RnROY1YzNW5Ud21oM1hHWDVYUGYxQWtBUktYdmZ1SzdzaXNkUFdhVmlMZWxXUUFnWkhmd0pxamQvcmVJWUh6b2F2VUdRdm4rM0k2QUxLWTFCZ0Nhb0JlbTBwV0phYTZCRFd0TzhCS0lvTWhhcTh4YndvWWh5UUVLaWFCdHJsSjQwR3JWd0xyOEFBQXVTZllaR2Y1NmhJQkN0OFFUeXAxRUlnY2Vidk11cTZHc3VRK2Y1Z1FBSXdvQTJDQzMvdzdFMFRZVkFMQmw4QlMwbXR1c3lOVk1veDhpZTFUQmUxQWlsOTQrYk93RDViYmFiQU50Y1RKaUMxYWtOYWNncElCMUhyaFlFVGFzZ1BZNmNwQXg0V21HZUF6ZGxQYTBUSWJ2ME1nbHR6d2ZLT3BTQXZMY2d1S1pPQWxzWWdUamVBQnhUSE5laVdsV0FEaHUwcmkvOGw2V1JnQ0Flem5ldFdqRWpUVnZDNUtnbWdVQVdFdGt5d0I5MnUxL25RNEU3WlllVS96RGhpRUE3Yjl2MG9XaHgrbUNYcHhLVjRGd1hobUFRUjRBVUlid0hZOXgwR1dWQ0xtRU1ITkd0TDVQNFgxVDJ3Y0FFQVlBSWh6MVhjR2tWQUFRaWhPajBwREVwRGJwSnNtaUdDaXpxaEdJQkFURUFBQlBpTVk2UjROVElYYjNFUm1YUFlxVFN2aGdrMjd0bXVGcnB0RVBwWHRVWEZhbllBR0lSVEVTU2JNTnRNVHIreUNlbkNjV2g1cmFUTElVd3pKRkRiWDVPdzFnaGdCZzMwaDVhbk8xVXJPYWUxSURBSm9lQlJ2dU5VaDlpNlZHOHJ0WjRUZ2tJR254VWpTc25ObzYzZ1FBRUhyWEl5VWNPRzU0R1Mxdnk3c0FBTmE0bDQzYi8wb0NBSWhwL3E4RXNnRDRkNVlwbk1vWHRSSzU2akdWVGdCRUtkRXJvbjFMSEtQbTFwOEVIdFlDMlg3a0RJVzhDenM1MndjQUVFK3ovMDQ2T2hVQW9Pb1dTMEJLZkIxdng0aU1PY2E2cXZ6dWdwR1cxSmR6UWpxVWVIYUo0djBuNUswNEFCQlRvZHNzSG5SSEVPN1FERjh6alg3S2gxNEdCbnpxZkRYYlFHUGhrSjQ2Rml6WE1tZVM1VHpFT0JmQmV6QUZLWUFkTGk0RXNtNXNsSllBa1RFRUFGZ3dCZE5YaTVTeHNSVkpqZFRtQkEzOEp0ekVEaU94MG0wbGxvM3YzbWdBRUhwWERZQU1HbVRqVThQYjBrd0FFQW9CYkFWdS80c0pBQ0JXOVMrbUE4Qy9pNUxxRnRoRlpyZ0F4QlVBSHlrQUlDOEhBTzN3R25sUldiQ25rSENncmlZMkRoOStBQUM2enM2TlZBQVFxcWcyUjhoT1M2T1RXUG9tZUF0MnlWdXdxT1FSNXdVQWJYQ29UYnFzbk84MjNQejN5VnVCWUFYajJhZ2FkeG94Zk0wMCtzMWFRTTAyMEZnNnRPTUtDL2FGeStvS0lBalpvTVlDSENFcDBLckJHaFlBMmxhbkI0QXJLODY0ckpEVkhtUnNWSXg0cGpVbi9ZRnZmSndZTDdYY3RvMEdBUDFHK3QxWjVKWTVsWGlRdms4T2dIWDdYMDdnQUhDbXhZaTdMQW1icWdTSXZ5KzMzQjdEQTRwZ0Y4TnNNMHFZb3hGWkFKTEt6SXFzNkVYVkNHcFRTcllRaHVsV0tPVjN6bVhsbVZkZHRzNU1TREwzQXdCdzdub3FBTEJxcW8vQXJYREsxYXBESVRJV1NVZldjdGJFVklUOW5oY0FvSDQzM2hJeGpyOEJQSUExdXVGajdpVFhPemhLTUh6Tk12ck5Xa0ROTnRCZk83M2VRRDBMdHRYZ2VHQ09zM1lZcDNBQU5oVmlhZzk0TFRSaVo5VXc3dkpNUzdFUU9UT0hSaXoyT0FJQXRMRjhBd1lvcGIxTEFCQnpwV01HUmVIM0FBQ2taQUZZdC85Vkl6OGVWVVFsMDZJVDh1dnJsUUllSkUrWmxYYkxoL1M4eTFaSzNVbmdBQXc2dlRnYmsya1hJVTkrU1VuVjB3Q0FlRS9uakRSZHJONkkzQlo4ZjA2bEhvUHNvQThBNEFvQTRHc0NBWmlDeFdsM3lIem5UQUNKd3g5QWJqbkxxYUtlZkY0QUlCc0xTMkZPdUt6YUZycUxtYWNnRzNtRnhsR0dtN0ZsK0pwcDlKc05BSnBsb0c4M0FBQ0krejhFQUtxQjIzZ29DK0JVSVRCS2RrY0IzSmh2RlNLZHhrTVpBKzRCR3pSV1pOdDMyUm9hSlNCWDVnVUErSTMzY3JSM0RRQlNBV1lvenZ3dUFFQjM1RWE2Yjl6K09WVlV5NC9IRXRVUyt4NTNZU2xnalJ1RUtja2pMcXN3T0tGNHU1Q0l2QUV1ZVNUMFZwV2NkOHh1c1pRQWtiK2txZlVoK1pTemJpUUZOY1JkcUNydmpvcDlXSDFSdkRNWVh2Z0FBSzRJQUc1NEVDRDEzYlY0N0tLUlJvZWJwd0pzZFJSV09USklKSGtCZ0tRd3RZR0xqZlcycHlnM2RaL1NGbEh6RzhkaEFRQzVNVGJUNkw4ckFOQm9BMzFWQU5BUDRLcGVBTURGYUJZVkFpT1RIV2VBVkNqbFg0dVVJYUVWa1JLUVpOVldPS1l3MHhxUnVWSjVFZFkzUG9ROWw5SllSYTZaSElCUU9oMkhtRUw4aG5jQkFIZ3ZGd2swSGltM2Z6bU1VSnFXd1NXbTM2STNUU1BKYVFKQm1oUXdrK21zY3RsVklrTHZRRWowRUx4QzM3cmFTcXZqRUdJb1VBZ09iZHl4MHpYdFF5bkRvN0RQQzBTaXhqb0RtRWFOaEw5OUlubC9BQUJOQUFCZnVOOEo4engwdW5vY0YyL0FuSDkwbnlGaERTVVVUK293ZHRxRTNQWHBZaS9jcFppSnBISU5LcmZ6WFNYblgvTUtsQXdBZ0tVbm0ybjAzd1VIb0JrRytpb0FZQUx5OFh1STM1SFhBOUJIdkJDK3lXTzZvOVFURUMvUnNzdHFjeDg1V3o5Z0JJeVpCWlJZSzF3cUg4N1hBUUR3RzV3cWJPd0Y0MkJaQmZZNDZzZzNHZ0JvUmNRTzREQkExN21RVEtlVWIyVGRTcTJZdENZSWs0Y2NpeVYxOFhLekM0UTZPWEIybGNQb2xQWThlelpac0d3bEIyaGJqNURwZXVtOThTQ1ZZa1VzUm5ZTVh0blR3SVhNcWdhSVhzNVRWMXN4RkM5QW01UUtYZ0FTTmVvWGFIM3p1N01vMmE3TFZtMzlFQUpvRUFDNDd2L2dpYlBWNHphTU5EcExOcGducmhFQTRLWUhBWSs4RVhxbDVLSXpja1d3VWdURWpHaFZBd0FsY21NMTArZzNhd0UxMjBEWEN3QkViQWxKb1owUTFwbEpKRnNOVUdyb0xLeFZ2S2tKQ0VCNTR3MEFzTnN1V3gwTTVZTTNnSncwYWFUcWFUblRheEFyUmJuaHZjUTBRSTJVeU9xVjh5NHJoNDJTeGhzdVd3VnZ1RWxwZ0JxQkVzbGRXNVJtdW1DNDByVUNOWVBLZWpwU3dqTklVRjV6Y2QzN1ZsZGIwNE05ZzFVbFJ4MnppeEJRemxObVNwY0JYdmJxYUx3K3NQYkZEQjJrWEhNZXBZczM0YlplTWRaZWlPZUUvV3M4THl3QnYwQmVpdzdxZThMZ1VKV1Z2aXN1VzVWVXdCWkt6RnY2TEpWRSsxbEpCQUFWOExERUFFQWpucCtuM3l1SEFPNjV5L3JlbXRqRXRwSkd0M1JGQUJDTGQvS0VmT0ZCZ0VVKzAzZ0thSVRRUUIxU2pCNXZ4bVhsSXpmVDZEY0xBRFRiUUl2WDZHVWtIeCtGYVZZaGhyaEloMHZCQUNDV3NBM2Z4aGVWekk0cXZBT1h6K1JxZ0tjdzNsTUNBY2lWQ0lGQjVMd2dFWFdMUEF3WVA4WkRsclV1ZUI3d25WYkIyN1JHS2JHN0FCU2FGUUxvQ3BDN1RzbnpzazV4WFFSb2xwSWxGNUJocjQ2TWNSM2kzZHN1V3dsUzJ4Y3ZGVGM5cS80ZDBHRjNTQzdxRXV3YkxKVFZHVWt0emRNMFc5SHVzc1d5WmdENGxGeTJkTGFFSXpjQ2Fjc1l1bmpsYW90eFlVWE9FcVJVUzl1Rzd5dUFFMVZVcFhCWXJHK1dNWmErdVNycExJQ3RQc1h1RklHWHBvMHpKTkRFKzV6RmxyQloxUUFiK2Z3OC9WNEpBRndjcXZjOXlhN2RjRU5xcFhPWGxFTytCTG1uQ0E3eU1wNjFqZnZiODNiTkE0REhSaDQzYnVKRE9wZzNZQnhhKzVaYytpRUEwRWlqM3l3QTBHd0RmU3R5b0d3cGJualJLTGZDRlJvQlNYditNREQ1TlpFUm1iK3l5OVo0UHlNMlBaYi9yY0JOcEtvUVdHUEZaSTdjcGE1N21XS3hTQlFOcFp4cXFweVl5YUxWZk9lNjd5dzdQZHNrQUtBUll6RkZHR3V0VzY1MDV1ZGdPQ3EwSnJEQ0k0TzVrd1FBb0VsN0kvTi94empzTU13M1R6eWhidUFuYVFDZ2tyTnBOaE9MWmVGQktxV1FpMHJPL0JLbExhL0F6MmZBbS9iVTZIOGFMalVyMUg4UlFtcVluamNJNitXRjBmYzRaWEp4MzlML0VuQjNKdnhhRkRKdUs0VnpGbHl0OEJLT1UzZ0lta0RUTW5uNjBBdkNjN2Zvc3FXVW0vSDhQUDBLK0h6bHo4YUxNL0phSXdIQW5xc3RuYnVna0FCM2NwQUE4d0tBMytRQUFBY0VTQVFBV09wU0dBTFlVZDYzbVVhL1dRQ2cyUVphV3pjamhzSEdpb0NwZklVRGx5M3B6TS92VXI0TEZtaENackc0TUdOdXhnMklTMm9wck1OR2pCZEI4aG5GU2s5Y3RzYjhvYlBWTHJubzFCeDVrakFHZlVocHB5ZXdEclhDVTQwR0FKS1JNd1FnYzRYNEZLZUdLeDNuQTZ0MVRrR2FjQTk5V3kzZVhWWFNIdzljVnUrQzV6Z1VzcW9RZU5JT3V3WGpzSlBLb1NtaVlhbU5iM25hUVRvR2hGYk9vWjkxbC9LOExERDBGZzZsWHBjdHhzVVZPYkYwTkQ5RFNMWGpZTSt3a3VyalNOOFQ4SDdhKzB2eHJqRTRHRHY5K25zT0Z4MmNCMnVjSVlFbWVZNXdmUkNrV0gwT05mSDVlZnFWMHZJdi9GeGZYTTQrYjFRSVlCWGNTNUtIT1UwTTJnT0lqNkgyTkxLd21Td1R5dC9XTnU2dmZSamdkaVFFc0thNGF1WU1oTGxxY0FDRVNDWHYyMHlqM3l3QTBHd0RmY056TXA2NnJLd3VjekVPRkZlcXhsY1lKbkxUSnNWYStmbnR4RmQ1U3lBQWM0dlJoV201R2VXYnI4UFBOUkdyZGdXZHIxS2NGV1BHUitCZHdGQ2F4cXZBREp3UnVDRVZ3VE9ESUFZUHZncWxhbkhwNlJRQUVDckh6UUNBMzNVcThLNzRuaHliWG9VNUhnTnVCM09SckhqMElmWEpaY1UxRDBETWRTemdpUThqUHV5NGJQZ1RGeFlOeTl2NGxzY0hxY1RBQzY2MmRMYlVZaG54N3pwS2JRU0loUjNPcnNpSmdrWmp5ak5FckFnTHY3WEJmTnlMOUQwVTZGdmV2d0NaQ2xnTTdKRzdMQWsra0RET2tFRFRpTXVXR3UrRmQrTStod240TmVQNWVmcnQ4UFA2eE52a0M5djhhU05JZ0dLQWxnRUJ6d0l5d21wVSszUzdRb09rbFFqV0RCQUt2L0RHL2RVRnFnRkQ5bHdoQWM3Q2hpdUNZWmt5MEN2Rzh5dGsrRVI2ZDdqSlJ0OVNzanRNQkFDSGtadE9zd3owZGZER3ZESU1ueHprZk9oeXZBdkpUZE5BYWxzblloRSt2OVZsNndjZ0NDZ1NpQXU1R2NYUXpsTmNjcFVPZjhsWWFDVjAvbFlCeWx3L1k0dEloOXNRUDJWNVpWR1NHM0Jad2FzVklFMXRLem4vMndCa2xzQmxLamNFRFFCd3FBRkx1bW9obDljZThOMTFsN29oc1hmRnVkaWwrWkE0T3M5eG01S05wTVdqY1M2bHozVmxIRmdrNjRXeG41ZnA0Qld5R1I1R295NWJjbFZ1b2kvZ3NHTXluWGFEVEcyWlc5NGZmZmozNFYrai93WFNBTEVveXd3Z1lJbkRqSk9oTHltR3ZxUWNJSm9Vc055OFVQWjFqWEt3ZjNIZVBvR2I1eE9YTFVnekRCdHVGdHhmZ3RZWllTSnhiRXRCLzIrQmJOSk1vODhBZ0EzYk9nRUFkTEZ6T1dRazZUWGJRQXNZa3pBQUc3NXBTazFqVnlyR3U5cmhiMlYrNTF4dGVXYU9MYjZFdngya3Y1MERFRGNKNnlMa1pwd2dWeVNQK3cwY0lQeE1CTXBybEk5ZkJBQ0N0U0pXQ0JpajFnVUtYazBSdU5VcVdNcThZb1pGQVc0SU53MVAzeVNBWVd5TDVFSG9nbHZHSGJJWDJyc3VCZDUxQlc3WWI1MWVMTXdpanMzRFljMXpLUVJrSHNjc3BOSTlWZmJ6bE9LT25RQ1h0bmdzK3lDdHJkM1BoOXhFNy9yOUlPOHQ2ME83dmFXMnpDM3Z3Mm4xNFY4ekFNQ25jS2hxWlZsbEFTTUM3bE1NL2JKeXUxcDJkakVncmtESWhWOFd3QUJkL04xUFBRL2dDeUNnWVVHYVhyL2h4SjBrN2lOeFRRMUF3OVN4SmNYdGhnYWpxOGxHdjQ5dXpWemxEYjB1eUpUWCtwMkhlR0d6RGZRRkdQdlNId2FQeWZEaFFUNXJ1Rkl4M3NWR2M4UmRpanROR0xIV3gvNHdZaEF3UXJlMlFzU0ZpVzVHZHFXT0t1TityRHdUNDZSY1AyTWVRTVlNZ0ZNRXFRSnVVT3NDdjlzdzNTYTFaOHdCa0JsVjNJUDRyVkJXZXdUaXNGelNWWXN4UHZRdVhldGRzYjlaNEF1aHVJMk1HNVh1dUZ5NEZ1L21lRFMyR1hodkhzc0VnUGxIdEo4MUY2c2N2Qkp2N3ZEdjF1NXYvSEx3UytXMU94NWdmZkhoUlBudzd4OGFBSkJEOVN0L1F4Q2pLbnJXUGQ1UUlBTHVJRU52a1ZCQzVZRDU1ajZsTkRSQVB3WXZ3SmN1SzJIYzRqZW54Rzd3ZlNWRzF3RU5peDVOQjlCL24zL2ZaaHI5Ym5JWGFvWU5ieU9qTU4vOGUxUEFLMmkyZ2Y0MWVBSHV1VXNWU1Q3SXg1UURkNVRpWFU5QjEwRzhRNktoUG1qRVd1L1Jlc1cveFZ0YmovOWJXUmNEMVByZHBjSmZELzJPckI4Y056OFQ0NlFDSGxENlZkeklDRXpIRkpEYUExb1grTjFRVTE0OFdSUEdNM0JlNVh1MStEMkN3UG01eXhhdEdmSjljeHRVWW96My9IdHE3OXJsc3JWRXRIY2RwM0Z6VmNpbjNxdkVNZU1lSlI2TmJkUVl3ekFlNWg4cy9vZC9ILzVsQWNEUHo5dkhubUV2eHZ5Uk54SXRmbU8rSVFTTWhoNFJ0RVlRS1JnSGlHaG15ODI5b0xRQk1FQS9PRzhmK1lQbk01ZVZNSDdpTHF2S3RkUDd0bnBqL2RKZDZzNXowYU1RK205dHN0SFhEa3cyYkFVNGpBYmdJT0NHTE55bUd1Z1BPK2ZEdncvL1B2ejc4TzhmUGdDNFFiZnBWM0R6NklFYkZWYTFHcVFiVWdjeFArLzcyd1l5UHZ2Z1pxNTVGTm9BRVBRckRSbW1MM0wrUHRhdHQ5NmpHMjVNencwUENQZmZCV3owbnNqNE5BOEZ0aDVLYjRrOVA4L2M4ZmhTNWkrMTRYdmY4TzVRQVpDdEFiYnlCSUdsTWJxdGRTazNmaXUraXNBS1hkOGZrYWZpUGhIdFVobTVyLzNmM2ZmOWZPNzdaWGxxQnJRODFra0F4L2dNckw2cHpjc0l6WXZzZ2NmZUkvYUY5NHJkcHREWUcvQis5RUhycGZYd0ZQYnNGejRzeU1CUjNsTUQ1eTBCUUk4Z1V0YjJqMzFJNzFjZXpOOEVMMUlMaGZRNEJLbDVKc1F6STkvbVYxNDM1Rk4vc2JuaHgzYkh6ODlqL3g2di9EdHhBYlFSQXVDNHB2b2cvUTYvNVpCaUR6RlU4TkMvNDlmK1BhLzdkLzBFMXVoTnVteXdIY1ptL1V4czNsMFlaeXZZSDdhQnVCNDZDT2cvOE8vekdDNVliK3JzNTc3djU1a2ZHMTR1dTJnOFBZYXR0OFljbXd2WkszZjlISDlHZHFyRnNPTWEvNk5EeVhMUXZORjhmb2I2UXMvWHowRHpKblUvVzJPTlp3TzQybXFBTVlNOWFiaHkyVlY2WDhuNWJOVHR0aTNuNzNmQ3hyWGVBemQ1S3hpOVllTnY4Qlp2L1I2T0wzYkxINFlESitYNWVlYU94NWN5ZnltTjN4czNGUit5WXhTNm1LUDQ5UXlGSFRqbS8wUWhDMDRSUVpWelkzL3R2VnRXeGtKcVRtNEhpV3hjOS8xcUJhb3dwSVZoTVE2eFlMeCtndktzY1Y2MGNFdzNiUFl2NFhDN1Q5NjFtSmRMU3lHNjVRM0hjNFUvTW1HRTV6cmdlUnpTbTZEYzVvdDE4VXM2b0VYZDh5VVIvNUQzWUgzak4vN3ZIc0czK2NUM2V4UDRDZy85R0ovREphZERTVWZqVU53MFpWTU1Bekdhdjg4b2FKd2dXYkFWQkhFZStlOTB4d09CTDRHSGRRZm1JWllHcHYyc0FPc2pGRVlhcFQwOEVnZ2RhU0cyb1RyNndjc2xIdnI5Q2xseUdMekd1QVlMeHBnTGtibVF2ZkxJei9HWFpLYzZEY0NwOFlTMGNLUjJmZzdTZVdPRlFOa3pyb0hpMkg3V3hpcGNuV3N4QUlBSW81TVFMaHF4K1lnUkcxSUcwME9LVW8yS2IzZm0vUDFlaVBsck1YbmM1RDNLQVJHTDQxdS9oK01iSkdJYy94NGZPTEhucDg2ZE5yN09oTDlKYWZ6ZVdud1p4OENLWlVLWVJPTGhyTUw2bDgybXBRc3VBd21TMDk4Kzl3ZkN6WUJtUVlvcUY2ZkEzZlQ5Y29ucTJGalhTZUZzbnRUUXJIbFo4dStEYTFvMk80YkJuc01oR3VLNVdDSWlZc3p1QnRJUkYwbVpyUUEzRWs3SFhZVDNSaERBTi9PN1lPaVFFek5EYWIwcmtKMGdKTjF1OE5DSUYrQ0dOMzczL0hpZSt2RzEwRzJ5WHhHa21hTm5jdjE1MUJ4aHdpemF3Mkd3UFYwVWpud0dBamwzL0ZxNjdkLzF1WkxlcW1VcFdEK1Q5V0VSU2FlSW16UkQ3MTBnWUtpUmJDY0ltQ0U0cy9yQnc1RVAvUWthejVUTFZtSkZXeld0ak5uNk9lNFY4VDdKd2NoMmlvSDdySkVwcEJHU1krZG5xQzgrTi9IMi95aGhQL05ZNVFJcFhyRWJNUUR3RkZqQmZYUlFwaG94TFYzcWxTTGswU2lHZTArTzN4OG1FWjlsNVQxNGs3T0F6bktFeVcvOTNqSmtGR0RPOFlyeWUzTmsxRUxQNTc2SEEzT2hqUzgyZjZtTjMvdXB3akNmZ2pHc0tXbVRxRnUrVG5QTE1xdGFOYlJOeUFOSEFaeFJmeGpJemZnaGFVZmswZVdXUTFJTWlOemdjS3lqQ1dQRk5Fdk0yVWM5ZEcxZXNMZ1BhOCtqNnhGdlY3Rk1GNVlSYllQdzBHUGxHNHFHQktib0lnakF3eC9UZWxjVUVJQUg5QU80alhGKy9oSnBIMnhSWHY4b0VIWGxodmNBYnZ4UGlSdlVxWGczeFFPRUlBeWZ5ZVZuV1hVVTlmWlJUd0lGZ3dZcFBDQThxdWQrcm04cDNoc0VYcXhUc0d6OERHM2U2MEFxNlRLQktuenZDZkt1dENuWlQzbjc2VkM4c0hqb3owTi95MlJiZThtK2FXTzJmbzVGaVRyaFlMd1A4NHhyZk5icHNzcEY2cFB0RXFlalc1Y0FLMTBYejAzeEJ0MVRRTEcybi9HN28waWFlQUZ1eFFEQVMwTlFKMmJFdER4L3poWEh3aVpybExkK2xSejN2b1RmeDBJb2N0Z3RncG9ZTnQ3a212WS81L0lYM1dWbE91djNVRk1BNjNodjB1OXRLS3Byb2VkdksycHYwbmNwWVh5eCtVdHQvTjdvd2gyR0ExR3FyZTJBaXR1UnE2MWN0dXV5eW44by9vTUNWVndQWFVTY3NJVHZCTVVkVVRmQXFrUnBWZWJxQTdUL0FtNXc3WXFCd3JFZXVHeUZ0bU1TaWRweTJZcG9vWG1SQWpSbzVQc1UxMk0vM1Bnc3JRdVdtT1U0NGt0Rkp3QlZKSG45VFNpSHY5UjkwQ29xM3FFRCtoVVlVUzRDdEFXQ1ZmaU5zU3FrM0RKZlFjeWRZOSs5bEVtQmh3K0RzRjJuRndYVE5QN0xNQ2NicnJZYzgxdmlDZlRUWEwrQ3VEOW5SMkZ4TEZRcUxCay9RNXVId2x5cy8xRWlVS1VKU0EyNTJsSytlSUZaaCtlSCtwRUxHM3RoOGRDWHVkOVViQ3ZXYkZpQmQ5K0NQV0g5blBlS2hQS2V1TnFDVUxMR1dieU14NmJacGRUemN6dHlibllydWp3aFVJemZIV1hTTzFHekl3WUF0UEtZS0ltNnJ4Z3gxRkJueVZTY0dHM0RORUxsVGp2QURseTJDQkFlQkZ4bWxuK1g2eFJZeFgrc3Y4RURDWTBWdmpkcWc3UGFYeWtCQU9EY1liMzZCVmRiRFE5L2J5Y0FBTFQ1VG0yYVhDeTdjTG5VS2hacmtYV2t5USt6L084d2FEbG9xb2xTajRFTjlsT0tPMklhYUI1WjVUNzQyemRndUR2cHdCSkRoR1ZsVWJ0ZkRuZjVtZFFna0xvUjFjQzg3Qm1idlNWQVR1UHFsVmFKVW82N3RqdGRLWENYRG1JRUFYejR5M3JTS2lvK29nTmFxdWgxR2Q5WWFtNGN3OTdtc3RCZFFMWnRnZGh1SCtsRFROSHRiQlVBTnRmd1NBRUFMTVhNUllOUVQyUEN5SXppdUQvcW95RHd3bG9GMnM5UVlaU2x1VmtCbEFzUGJTdmVsWDRDdUtpQXl2MlVsWDdRNnppb2hFODI0TENWdWVmdnF4VVpLd09JTGdWK3JwVVAxc0tKc3dwd1B5UTdhdG1sSHFVdjNBY0haRnV0YzFQbVc5UHI0UGZFc2U3Q0dzVjNhdk43N0g0TUFEREM0TEtxSjJURUJBUklnWmNENDFiUkU5Z3dqUzUxSzhWNWNPTnV3TzFicTRpSHhVS0tMbHVub050dzkwbi8rOVQvdkhJZ0hkS05WS3Z4enBVSHNiUWpoZ0JFcTN6ZjZiWGg1MmdUVktGdk1iNjRHYTBETUtWTTZiZk9MaGhqb1ZXWkZ6emtkOGl6VklIMzNqY09POVp2eDhOVEF6dWNRNDVzM0R6cmJVRFJGaEJHYnNIcEpXVmx6NVJkdHRpU2pCWC9leFgyMGk3TUN4Wm1PblI2VmNUMkNEa05xeVJXbGJXcnhWMjduRjByb09vdUt3NmlzVjhpdXhHcXFQaGNPYUNIb0dsbHBVOEkzTS9CelVuYUFMbWMrMTJ0UXVpQ2NqdmpzdER5ckJRQUlPOTJCbiszVDJHdElybkhKMGtiaGVQK1dJbHVIWUNYak4vNkdTcW45aXNYbnoyYVMvRTRuUmdldENIRjZ5WjI2Q2pTait6RFNjZ2VZUy9zbnFzdDBNWGYxenFiZU96V3o3a21ScmVyclhtelNITmFKZEIrUW5hSnk1TEh6azhHOWJndmVMNDFkVlVFWUZpSWprdTFpNDFINHZLakdBQUl1ZDJxOEZFMUkxYWx3MmlaYmszTkFnQ0lpdkF3d1ByeCtEZjRrZmZvSUMrNXJGWjRIOTNzVXZybmcvM3Y2UUJlVkx3VlZRSUpFa3NmZExVRlliQWFHdGFHeDBXK0FXUGprckR6UkdqVEFNQmVRaXNEOE5NOEY5cDN3YldFSllqWFhMWWcwdzRBTS9heW9Lc2FxeHV1dTZ6OE5JTWRaSlJyT2hVcDY4M1N0dWdsVGdJZnRGd21laFZ1UGY5ZmUzZmlITldWM1hFOGYweFNTU1VUSjVtWjJCNEgyOWdZRERhckJOcEFDeUN4YUVQN0xwV1cxZ0syLythWHdmV3UrZld2ejMyTEJOaEpmVDlWcjZaR1JpMTFxL3ZkYys4OTk1ejBBZjVaQm81OSs3ZmVtam05N3padHFmZEJKamt0RFRyYUN0cy9kNjlzVDFtclUrWmU2MXdRNFAvOXRNaDNWTHdURE5EUDdOS1ZCODJMME1Ed1dWRERZa0orLzRtaXQ0eHlXdUxWN1NpZDVCelpBSzQzYU8veXR4bHNhNTBWM1kzUmRpMVB3S3Vqam1iMi9WL1paMTQvYzlIWE5GZ2VzOCtoVG56UzN5VXRSKzlLVU9BVHA0bmdPZThVM1kzZW9zZlpEeDVuM0NaQjJwcGRCMG9QQUtMVmFXMzdmU1FCUis3cnJ5eDNaaUN6aXB6ZXUwY1dpT2Z1MTVNeU1ZaG02R2NTU083SVk1M2ErS0NCV3pvUjQvMVZwb1B4NDZkZ3hmdVpKY2RlcndzQUhtVCt5TWMyMlBsTmJNZG0wdEVMODZFQ2dMNGkzeS84TEhoUmNvT3ZMK1dQeXhHUDNEWkQ5RVpJYlpNUDVVYmkwWmtHVjBkMlEvZUkwbXVWVHhlOTdYeDFrRitwQ0E1ZVdUTE0vYUszKzU2WEEvWnJ3NElMajE3MXRSc1BvbFg5dnJUSE55K25TeGFEQU9ZZ3lQM1FsUkZ2M0xOaTJmc1RSVzh6bWRuZ3FucS9SZjllOXphalFPcFFsdngyNUFZVS9idzN3ZWZubGJ3dVN6WHZ1MGw1emF1UzA2SUFRUGU4ZmQvMVVlYTFyZ29DNmdiL3FLUGloQ1ZmUlZjYXROZGtXVDMzYjJma3ZlakxwdHI3NHFEb2JvTFZzYjE4WDhMWEpkb250aGZ1dVFQYS9WSlhlZnl4ZFhEc3orejdhNmZWUTluMzlhK3QySDczY0hEdjNRMjJNSmRsNEh1ZFdkV0xIa2Q3bmpSOW5DZ0EySmZIeWEwQStBcVh2amFId1d3NjkvVTVTMFROVFlMMkphaGFzZFhmM0JaVXRGcDhMSU84UHRhV3ZVNWJGdEIvSTZlVmRDVjZMbGdSTzdhQXl5ZXl2eWJIMWdVQUE1bUIycGZURit5R3ZTR1I3MUdERitaOUJnQjNpN2hmK0k2OEtCck4raXplYXBwWWF3QUFJSDlKUkVGVVcvUE9XTzdDM1dDYlFRZW9FOXQ3MFQvTWlmeTdJMXRXVzdVSU9vcVVoNHJ1V3VYalJYYzdYOTBLMERkWTlMVkZXMElmbEtNdmVweHVMbk5EOWIzZjF4V1I5VVBMcnZjWjhiRUZYQzlrNWplWDJaN3h6b25lSE9abE1EanJzVVNObmoxWTBDdDZ2K1grclo0eThPZXJ5VG1hTE9xbkxMUUZ0YjRQb3BNVzYvYTMzYlZsNmR3cXhLSGNYUFU5czVmWmQvVThtS2dSVDFVUTBHVHcxOFN5YUlDK3lMVnFxei9Sd0hWb1M3dysyNjlLNGh2TEhNM3owd01id2ZKMjFMSlo3MmQrYW1QSmd1Nk9ySDc0MTN6Zlh2T3ZjZ25ZR3hLODZHdzFXdFdyK2p0cDEwVmZsVmpQQkFEek1oQnV5SEo1Ym9EMWt6WXZnNjFGWFFuSmZYM0pUaXhGazZEVWlHN0RQc2QxQWNCNHNNcDhHbXdETDloS2NTZTR4MFhKZnk4dEYrMVUza3RudHBXdEs4bS9OdkE2N3dxQXovYlc3Rnp5cW1VV1I3T0lEeFVBUkFsWTBleDZTMllNbmlld0h5eS9ERXNTMFVETjhwZCtXTmFDUWI5ak4yemZKamkyUGV0MDR4MG91cHZyak1neEZkMEtPSlFCZVVkdWJJZkI3SHhDbnBzbUcra1phRjFLalpZZ1h3ZEpYYjYzbHNzdGlBYjA5SDNSTXR6cnpINnZWb2tiQzViMTA0bVBoNW1FTXQwdThFdmZiN2wvRTgyK2M4ZHoxb0lieWJiTmx0L0krNkRxdE1XZXpGWjlYL3BoY0RMaU1GaUsxZ0RBMjBCSE4yeHZ4Rk1YQkRRZC9Qc3prNDdkaHR0UXVTdktEWWp1UFcrSzdsYmRQdHVmazNQYVQ0dnEzdTlQaSs3bVJKNVl1Q1ZiQk1lV2QrUTVUWDVxWTljbUZCdVpyL25TZjlyanJqcUN2V1I1UlNjMTIyN1JTbzJlZ2ppVUxaQm9kWEJNUG92VDhqbFp0UEVtR21BMVAySXNTTGpkbC92cHJnemcwZGM5MFRxWEpIa2dFOXVPQlkxMUFjQjZNREF2eVd1M1ZoTUFmRy9qajIrbkhzbG4xbGNhUEQvbzdXZjNYcHNjZ05tS0hJQzlvcnZ2OW1yUld6ekY5eEUvVkFDUWk1RDBENjhEU04wV2dlNmIzSkhqYkg0RVpVdHUzQnBnNkRMdGdXd0huRmwreElZTjNGRUM0bjA3RXp3UWZKZzlZZVhJbmxlMDlLOUhRMjVaY2x4S3ducWNXWUk4cTRpbXh5VzRpQWFqbzRvYjM0Z2w0dWlISi9xd2FYT1lGSEJFQ1hycHJIV1VVWDZTdWQ2K1ozNlIyVnAwK2Urais3YmFHanRsU2UvYmxvQmV4M0o2b2NtcGk5Y05Bd0Q5MlpxY3BZbHFwM0ljY1Y4R0U3MUIzbWdZQktUUHFYNG1xZ2IvV3hXcmpxZm52RTRhQmdBbmtvaDZXQk1FYUxMZXVKd0UwZE1XMmd6c1ZjWGdyd20yZFFIQWd0eFBUaVVnamI2Mld2RTV6eFZoMHpibWU4RlM5WkxkajZLcWpOR3ByaE1KckRhRDdjSG9jV1liQkFEYTl2Mmg1VWlzMmVUbklGZ0YwSy9yK3p2YTR0MlQ3K25JNlliREZpc0FGdzBBVXNBem5FbFMxR0ROdHhNOFAralgxYUMycHdCMGVlWFE5ckowTnVIRlc3eEl3c0FIREFCMGp5VGEvL1NrbHJva1BzK2MxRC9DNCtBNG9DL3Y2UExYbnMzMGRhRGZsc0Y2My9hNHRZakRsMFYzTzkvYzBhRDB1L3pVY09uLzdmTzZZc2ZqL0FZL2E0K2YyL2ZYd2hQcEhIYVVPZDZ4VXdOZVlHZThSUURnL1NyNjVRalpBenNHOWtORkFCQU5JbWRsQUhEV1lwRHhna29hTkIzTHpQamtQUVFBblV4bStyQWxpeTdiNnNPT3ZFOStEckxVTnlSVFhXL1kzdDU1c21JRjRMVUVLT2RkQWRCN1E5c3IrdHY0NnQyV3pGaVBXMndEVE5zcW1wNjI4T1YvMzFySi9SelBiWW0yTS9YMVBaQlZwTU9LUEJ4ZDZidHZnKzVMV2VyV1RQNFRPK0xtZStYUnpIM0p0aFYyWlBBOHlTUlg2OHJkNDRyQTNQK092aDJxTS9ZdFM5emJ0bjEyLzdxdWJQanFzWThQK3ZsNDMxc0EreFVCd0MyWmxPdmtjelBJSFZnUHRvUThwMjJvU1FBd1pFdVppNW1qR3FmeVFUOHU0aUlseno3Q01jQ3J0ZzBRTFlHK3RobUovaEdqYk5kaE9UdnBGWmlpNDRDNjdLS1IyYlp0RitoU2Y5V1NUWHJOM2c3VTNoekZaNXErQi9aVHpheEFDMkJjdHVEQ1M2KzIyZmZYMHBNM0xyQUM0QUZXMVFwQVZGSlVHMVFOU3g1SEZBRGtscEQxL2RaMG1UbVhpSG9xeS9zSFJYZnhMTjhDNkRUWUFxZ3E3S1RKb3FtVXJSNTEwK3p2amcwZXFTcVpubFZQNzVrK0cveGYycmFRNXdBY3RkZ0d5QVVBK3hlNG92UGp1akt6bkVuV3Ewc0VYTFFac1dhanIwcWc1WS81Mm1iRnZ0S2dsVTBmQkFtL3ZwZTlKNE5ScDBIQVB4U3MycVRCVVpmOWRmRDM4czI1dlh1dG1Ma3NLd3JSekRkOTFuWGw3bEdMQUNCS2lGNE1CciswMVpyN3VtOVo1dXBONk1SeHBVR093bWlETVdLOVJSTGczU0RZV1EzKzd1dkI2WTc5SUxnY3FRc0FCaTBoTENWVTVVcVVIdHJSbVk2OUVUV2IvVU1GQUtubWZGK0RXZnBPc0RVUW5YZE5BOW4zUVlBUkhRZlVXZnkrWmVVdVdUYnFmaWI1dzQvL3BlVzdyOHM4Z0tpeTNseVF2UE1tdUxGN01LYmxJVzhFMndzdjdZeHUwMzEvblhYbnN1THJjZ0NtN1NURm0wekd1OWZiMXZ5RktkbXpmV2huMmFmbGhoMGxrRVh2dHlhSlp0R0t4NUVjbFV6TG9WbysyNU1BVHl5YnVzbWxSVmE4VHJ2UGtBNXNHKys0NkswUm9lV3Ewd2tBdnkrOGtodllnWHlPRDJVVzJDUUlHTFc4bzFrWm5DOTZhVUt2Qmk5ZTQzL05qdkIxS280Q3JtYnFBS3phRXYrSkJFUWFUT1JXRmJSK2UxMEJvQ2FKZ0I3MGV3THNtdjN0am1UeVZ2VTZSb25RUi9KNTFvVEFxZ0RndXMxdW13WUEvYlpDcmEvOWtRVkN1YTk3UWFEaHpIMjlZeXNBT2dIT0plR08xV3loZHlRQTNMSGpqOUV4d1A2YWlZVW1saThHcjd1UEsyTjFBWUFYTWZDczUyVTc3cUxGTTA2Q1kweDZadlpEQlFDWE03UDBLRmx2citIUnUvdkZ1NjVpVnl6UElIY2M4TWdTTTNSbFFRZjh3NXJJTC8wT3FhYjVsWWJKTHlkeXpPaTB5QmYvR2JXWnV1NnBhWUtoQnhaVisvNVI4WldxYy9ISGxoQ1pzcXVmdHp3RjRQMHF0SHZlakMxZmFpUTlVM0hNTFBkK3F6dHFscXRNcVB2aGV1UnhwdWl1elBjbVNDaU5taTdOMnV4TW16dEYrU3FMTmxDazEzNVRCb0JvOE5CdEtMOHZWQTMrV29pbEtnandZMi9wOGVmaytmbWxUWkswdGtGMDZjeTF2NGdiMk16WThjS29HTkNib2wwbHdEWkZnSjRYdmQxS2IyV09BaTdiMyt4UUVxNXpSd0dmeVdON0F1eWgvWjVOVmxKeWlkQm5FdVRzV1NBVmJXOWVQV2NBNEVYUmx1ejU2MVpJN3V0UlNlQ0h3ZVJqWDk3Ym10dlFLZUlpYzVvb0dXMmhId1ZiZ09rK25Tc0VkRC96dDR0bStibGpoMTJyMjNVQlFGUnFVVE9mTjJYSlNoTmRObTI1TnZxdzVCSnhvc1NNWnkwQ2dDK0wzbUlKVWJLZVJuUFJDK1NsRTFQUDkyK0tkMzNqcTQ0RGRvcmU2bE1yUlZ6eWQ4ZitpTGt0aUJ0RjNCUWtXdnAvTFRkaEh6aFhMU2xUdHdMNlpIL3dXY1crZjNUT3VLcjR5bUFSVjJnOERsWW81bVh3OXRuT1dXWTVhekRZcWxxeEV5bzZDR2hkOVZ5eG1icjNXOVh6elMwait2dDdWajQvdmdMd0p0aGltWlh2V2JBWnNsZEhyTHFwNmcxNTA3WUV2RmpVakt4cTlHZnVDN25CZjZIb0xRTmNWUWxRVjUrOHpiQjJkL05pVDl1Mm5PdmZvNjJIMC9zOEpZdDZPV0RQMnZmamV5Y05BNEJvZjkvTEFLZUFUY3NBcDYycWUvWjU5MW9EdXVXaXM5cm9henFwYVpQL1VwWG40bHVzV3RiYkg2OVQ1Q3ZEbmpjQUdBNk93dTFLRW12NjNPUys3bHVXcVNtUVY5alQ3UkZOMmoyVTUzdVVTU2djekd5aFI2V0FkV1VvdDExYnRYV3BLeEM2MWFwYmxWMi9YOU1Bd0crR25saVFvdGk1SU5raEZ5M3JNcC8rb2Q5WTFtSTZoNzVnTjZsY0FPRGxFdjFNcHcvUzBmSkp6M25KY3ZuLzY2SzdGbk9UNDRDKy9EOFRiQVBvYkN4My9PK09aZW1QMUN6OTZ4RVhyZDF3WU1jeXZSYTJseHhkdEErUUhpOU1NOFFteFZlcTZsWjdKY0JjeGJ2elZBSk0rL00rUU42UmxZbEhSWGZaMkRZclRybHlzMUVpVWNjR2RTK2d0U1VKVTFIeW5HNFgrUGY0YTVJYU1FVW5lVGJsWnJZdDJ4ZmFWMkpQUG9PNUFHRGFBclRqNHVLOUFGTCt5WUJzRlk3TEZXMjVIUmR4d1RIOXZ0UjFiNkI0MThmK2ppUWVwa0FnYWdpMEdMemVUUUlBM2QrUGFnaWtvQ1JxQkhSYkVuTzF0WFF1SDBCL1h2UTFEZVRhNUw5VTVibmtHbnR0Vzk2RzFweUllc1BVQlFCMWVUYjZXVTAvYzFlUzBLT3Y1OG9BLzJENVk1b2d1V0hIZHJlSzNtNmhhMFcra0ZPdUdaQS8za3F3TlRhWVdjM3pyY3NsZVg5RmhkeTBYOEY0WFFBd1hIR1VUbTlNNjhHTjdLQ0lpN3prOWtaMFlPL0lUWHRGb3JodG1Xbmtic2lmbDlzQTM4dHNZc3dHNlcwN3Z4blZUZFoyb2plTGQ3MmlVeGIreldBMjVIdmJaNW16MUZIZC83T2E0MyszeWcvS3ZTQXhNNWVadjFua1MrN210Z0txYWxlL3RzQ2lUZkdWdXI0U1owRmluTmU4ejVVM2ZWU1J1WnZMZ2szYkhTa3JlcURvTGdQYXBobFExSEFtV2tZOHNPUzRYY3VVUHJUM1F1NjRiZlE5QjhGUm42aGptQjcxMmltNkMza3R5MUhCRFZtTjhWb1l3OEZ5OVB2cUJuaXQvTDN2eXQ5bHNDWkI3SmVLR1dyNjNvSHk4M3FuWE1XN1dzNnVVeUNRR2c4TnkxbitYRXZnZFJuVWM2V0FONHJxVnNDUGk5NVd3UGVLN3E2RjM1VVRqcXRGWEFCc0poZ0VWak5mODBZK1RmSmY2ajdUVVd2dkJSbDAxdVUrb1pVYVBmSHp1NHJ0cXRXS24rL2JpcXRCdmtMdTY3bEdRSDZQMVlKbzJ1SjRXWTY0ZXp2dEdWbTIxOXlrWER0Z2Zid0ZPVFducjFHZm5mcktiVjNPeUhzc0t1U21KL0llTlVrQ0hDL2lpbXgrWTlxeG05SnBaaWt4ZlRCSGl0NDZ4cnJQY2xUenVMa2I4bi9MTnNETmlqMmR0QTN3UzlGYmxNY3o3MitVTjQwdnl1dmJpa1JEZlI2L1pHYjFucjM1YzRQamYyazI0TkdwTC8zN0xQbFZzRFVRSFg5SlB5dlhZZXRNZnNmenpCWTBZM2N5TXlzOGxhRHN4SllSTzhFNTRpYmRBSC9PckVKZEtkNjFocjBsd1VBdUFEZ3JxdHNCZTh2WmFCbFJnNTNYdHYrbkhmODAwU2c2Ymh0MUJEd0labnJYZzB4cGJmK3FXeU1hSEZRZDM0MXEwOC9Kd0xoYTlMWjhuUWlDZ0hYYmxrbkw4NWZMeis2Tjh2TjdXMVpyY3Z1ZkowVys1UGo5OHZ0dmw0OTN2ZndNZjFWK3ByWDE4RzBKQk5KSkVrMG8xWVRCQlFtT29sTEFLUjhoS2g2VVZvcFNVSEszZk8ra1Z0Slh5dGZoVXZtN1hzNnMva1dEd0Z6bWE5N0t0eTcvcGNtcTNsMVpxVW01RkRyb2FBNkc1em5vMFU5dmNGTTN3R2w1Y1QybE5CL2tmZVMrbm1zRi9FMXd6RlVEUWMyL21TNi9OaTFYMnRMeGx0eWFvRHdwVzFtZTA2T2RJVWVMN2hvWnR4dHNYYVp0eUZ3aE4zM3N3U2FGZ0h6d2pMb0JudG9OVyt0Y2IyZVNpYXJPdCtZZTkxUk9HdVNPai8xRkJ1a2JSZHpkU1pmRlBhbHN0dWp0blh5dGpNUS9reFVHVFRRY0wzb3JsNTBVK2E2QzBXcEIzZkcvNitYUDlacjZLM2IweWp0VFJiVUJUbTNHcUZzZXVmUDZQOG5aOVBNVVgvbXh5UGZHOXZiU21tRGplNmpMZHVOOUZCejUxSDFwYlZHclIrUXVsYS9ubGVKZEM5cSttbVhGL1lvQTRBZEpFcjBjYkhuNDNwOTJPZXZJSHVLZW5UVFlLdUxPYU1leVNyQXJ5NnM2MC9PWll6cFo4VndTQ0dma3B2eENidDR6a29BN2FxZEY3c21NL0lrbDY4M2I0RDhjREZoK0kzNHNwelBTNFB4dCtmdW5GWUgrekwwbzEvREprMmV2bFlQOU4rVTk0clB5WjMwcGdVQUtDRzhYNytwZ0RNbFd4R1BKU1hoUmRIZEo5RkxBTDRyZU5yKzZ6TjlYM2o5K0xEL2JWOHZuL0hYNTN2eThuTXlrSHZEZldqNUFiaENZeW56dHFmdzk2Z2FScWt2elhINndJTUFISGMvQjhPcUphV0Q3dXVndTZ0TmtnQnNwdWt0U1QyYnlQaVpyOGtIU3Z2LzE4alcrSktjUytpMFFmRncrQjcwZUYrL2FaaitSTFozVU9PNDdPNkk4WEQ3L0ZGaEdqNWUyaEZMdm1iZS9TM1hqbmcraGlBdk4rQTM3TUhNejB4dFp0TitpTjIwdklxSlp0M3F6MHg3cFI1a0E0RCtMZDMyVHZ3LzI2bjMyY0pRN0kybkg0eTZWSDhaUGkrNnVURlhkQjQrS3VQQ0ZIMHM4cXNoQjBDRGtxeUt1REthUDRhMDdQVkRRWHQrN1FkWnE3dmhhMjZ1cWFsZmRucGlYMlBVejBpL3N4bnV2SWpOOU8wZ1FlMXIrTGY5VzVveDhJOEZpM2JMaWF0RmJJdnFlckJMOVQvbTR1V0FuVlFQTVBjK1VIZjZxNks1RHZwWDVuazJac2MvYlRPK3k3SGYzeWFDZEV0NG03YWFzTis5SnkwWlBTNlRYTWtHQUp1dE4ybURqQTFaMEl4NG9CeE1mbkQyUUh3OFNQYXNhUG1rQzc1Zmw0LzdwNzlkL2xEL3IwL0x2cFFIaE5Wa1pTbHNSZzVZbk1DRkplNFAyK283THY5R2IrWDNaMzA4RGZ3cEt2aXJmTzIrZisxLy9mdjNYMzY5UHl2dlpaK1h2ZmlVWVREeC9aYXppYTBPeUlsTDEvVldYNXJta3dQbU92RVphZjBOek1NWXN3ZkczZ2ExODdkczh0L1R6Yjl1L0hRL3lQbkpmSDVIMzNBK3l4ZnZaUCtDM0FPQlc1b2E5VUhOajJyTDlMNThSOUFVZmFDMUlzVkZ6Zy9TQ0U3cGsvb2xzQStqZWttODVlUEtHSjVYcHpQdWI4aWJ4NS9MRGVTbHpITER1c1o4Rld5clJjNGxtTUNrSWlXcURid1dKS0F1U2FPUG5mYXVlZDVUZ3RYV095L3MvWEFtV3cvVEludTZKK1ZIVHhacFo2YzNNMmZRbE94K3YrMzZmbERmWnp6TkhSM1BMaXZNU3pHcUo2TFJDODNuNXVMbGdaejRZdVBSNWF1R2RGN0wzdkZUelBUTVNHS1hQV1FwdVVoQndUL0ljdEV6eWNIRHpIcFZaekwzeVBaaVdTSy9WSk92NVRmcU83SytQMXR5SS8xUU9laWtRU0VtM2ZpK0t1amg2d3lkZndYdjd0L2tMZDNhZ1dRQlFkY091dWpGcE1zUExZRVp3VzVaWXZKWjQzUTF5b2VqdE02QkpSUDhtMndEUmtiMTB0QzFLM3BpV3ZjTUg1ZStZWnQ2ZmxiT0dQNWZCUUp2SDlxelhKelpJUmM4bG1zRjhVZlIyQi9QWFl5a1k3T3IrclQ1dlQvQmFETDZueWVYOUg3Nnk1VERkRTN0cWUySjZVNSt4NUtrSld4NjdXUTVNWHAzdWhlMnQrZDdjUDVkQndLZVdNMUszck9nejNINUpIdnF5Zkx4UE1wK2RTY2t1bjYxNG5sT3l0SmoybnV1K1J4UExmcDNwY1FjRGNKRUFJSGZEVGtrUkw0SWI5cXpkY05OUktSMzgwM2wyYnlqeXRPWUcrVEtUZEtGUi83L0lzcG5QSGxLeXlyUGdjVjdZamIxUEN1OWNLbWYrLzM3Qnh4NExCcW1xNXhMTllMemdqZitzS0JHbDZ0LzY4OVlFcitlWjcybDY2UjdwMzRJZ0lPMnhQckk5TWUvaUY1MlJ2bXV6MGx0QmdSZmRXM3RpZTNQL1dNNDJOVmk4M21CWk1acmhYcGNrMGIrVWo1dmIrMHZaNVpNVnozTlVFakxINUdqYVpIQTlrU1g4Tkp2K2RYbVZPeGlBaXdRQWZzUHVENUppbm1adVpwN00wQytEL3hWWkVyNmRHUWh5TjdzbzZXSmM5aEgvcVJ5by95bzFBVzVZc3NwNFJmS0czdGhUZmZ5MC9QK3Y1M3hzVDN3WnNzRWc5MXkwU1UvS1FkQmdiQ3o0V1ZFaVNwTi9PeXg3bElQMnR6anZsZmFRaC9nMEFjRC9yUURBTzhNTm5QTjZZT2Rjdlczcnc1cHJXR1kyMXl5cEtTb1c0dnVMYWI4eTdVUDY0NDlJa0tMN3BYNE91ZTJWem9iZkRaS3hQTE5VZzV6eFRQSlYrdjZCelBNWXRqM2JxN0lQZkMzSWNINlErWDAxUS9sbStmdjNsLzlOcjM3NW0rcU1mcVRpNzZpLzM3VXl3UG8waytUVTlMSHFXZ0dQV0FKVTI3NEJQMGd5MkpCa3RsZGR3L0tldW5PTzkzeVR6MFI2L2plTHVCKzlyeEtNWmQ1dkdnQytqK2Q2M1o1dms4ZW9lc3piM0kyQmp4OEErT3g4N0p6WHFCeUI2Uys2Mno4K0NaWnFvNk1SYVFhdGRmQkhaVHVpNnFpSHptb25nc2ZYbTJDVDRLTHBOU2FEeU0zZ09OWXoyL2RPMnh5NTQxZDlGVXZjWGtNOERiS2VCS1pubkVjck1uVlR3SlViVkIvWjM5UUgxS2NOZjcvdmJBbit6amtlNjNiUjIxSTBDcXJTaWtqYnZnRjFLenhQR3F6Q1ZMM256M1A1YStuSDBLYUQ1TGpKWU52dXBTWG92by9uR3YwOTJxNGVkYTFNY1RjR1BuNEEwRy83ODFNdHo0eDY4WUcwQjY3Wi8xRnhoYWc0UXRwTHZtWDFDWElOUTdUWWcrOXJUMmNTeE1ZYkJoZE5yeWs1cSs2bFBGOUlrdDJ5SlRwR1I5MmlnaTcrdW1rWHNZSHl1VVRId0Niazd4bWQxVTBCMTdBVnc0aTJaTkxBTVd3RDZreUQzeS9ORnI4dXVqc2NqclI4TEUvYzgwRnUybklpenRNM29DckhZN3BCSGtiVmU3N3Q1Yy8vZmxDSVppazRIamRkeEExMDlPamcrM2l1ZmNIZm8yMytTRmR1Q25kajRPTUhBSHFqbkE3S0NqYTk1cXl1c1ovLzEzS0lVYmxGelNiWDhyNTZuSzZ1L2VlNFpMWXZGZmtXcWsyQ2k2YlhuUHplVVRNUHJTK3RSeDFYZ21JM1huVndQbmlkNW14Z0dLd29CRE1kVk95YWs0QnJVbklYdkIyMEQ2empRZEdiNWFETTVaeFZIVXlGUUtJT2gxTU5IeXVxQ0xZUUJGVmFRYXh0MzRDNlV4NUxOU2N4eG1yZTgyMnY2UG43OGRKTmVVOXBXZFExZTcrdFdmR2c5L0ZjdFZYMmRPYjBTWlBIL08xMENuZGo0T01IQUg2amJGb3oycStWb3J0Qmd0Ym1YeTI2R3lLc1M2R1U3YUszSWNtZG9yZXozSHBSM2JZeWF0dXJQMU1yeERVSkxwcGUybkJuU002RDYwMWFxOStsd2tGUnVkdjdSVy8zTFgyZE5tejE0SWt0WDBjckQxcXoyK3QxejhpSmhGdzc2QVdwV2FCL2p6VjdmZFB2cDFVSHgrU1lZeW9TbE90d0dEMldGMjN5bHBzK3lHa1JvTFo5QTdRblJsVG5ZU3RUaTZIcGU3N3Q1YzgvMTdNamxRM2VsUUpEVzFLODZ6QW9uL3MrbnV0Z1VPV3piUjJKcnZvVTNJMkJqeDhBUkZYaDlzNXhSUjNVdkhOV3VpRnRTUG5aVGxEZnZDb0FPTXVVb2MzVmQrOEVOZUxyZ291bWx6L3V3NkQzZ1hZbFBKUkJ5QnZlUEMycU93OGVTdkMwTEQwSHhqUEx3OW9NWnErSU8zWXRTa0dhcUIxMDFIbnRlZEhiNUVjSG9YVXJVSlRxTGR3czRpWXpLelpncGIrWEQ0QStvT3YzSEZrdmhxbHo5QTNJdlg5eTEySFIyeFkwOTU1dmUrWDZFZmp2cHcycDlxVXdsejdYTnArVk5zODE5eGxxV2tWeTN5dFVjamNHL2hnQlFLZGhQZmgwSFRVTUFFNS9od0RndEVVQWNOYmlpaDQzYW1TaUE5U1dEWm83UlhlM3NlajMycE15ekVkRjNQdDcwR2FmMmc0Mi9TM1Q3NXg2ZHU5SU1ERWZCQnpSYSt4YkFLbUZzRGNnMG5hVWFjLzRybFh5aXpvY25zanF5TEl0Z1VjRCtuSEZnTjYyYjBEVit5ZTZtZ1lBSitlNG9zOVQxSkJxTHdpQW91ZTYxZUt6MHZTNTVqNURUZThaQkFEQUh6Z0F1T2lNNVNJQlFLNjV6NGNPQUpyT1huSUJnRDduMUJuT1ovdmFwS2pxOTVxM1d2ZjdSWGRITkgyOVJteDVXSC9HYS9rYmFUQ2d3VVRhUjlmQnVKTlpPcDZRdldOOVBzZHlZL2RXdm1QVzZNVmJCWGVLN3RiVFVYNUViZ1hneEFaQW5kRzM2UnNRdlgvcVZyMnFBb0JWSzNQZDl0b01nanpOQVZpMmJhNTFxVWlwejNVcnlBRjRIODgxRjZ5MnVRZ0FnRDlRQU9CN3poZlpzMndhQUVRRG11NFQ2M0w2b1F4bzJ3MERnRFlEYlpOclQyWXhiUU9BRlJ0ay9mdWpFc0RMdHBvUUJVelI0S2pkRkxVbi9YNDVXS2NXcy9zeVVLVFovRm54cnBPZ0RrSVBaR0QxUHZFYU9PektvS01Ka3I2OWtRWnhIZnhYWmE5WlQwaEVPUUJSbDdnVWRMVHRHekJzL1JkV0d1YTl6QWVyRkRPWlV0ZHRybVZiUllrU1Y1Y3NzWGEyNHJscWI0UDM4VndIZ2xXbnRubER5N0lDTThiZEdQajRBVUJWMXZsRnNwWnpBY0IrRUFENDZvRm45R3VYdTlmbG9PR0RVMVVBNEV2dDU4MWdYcXNKQUhLOXpJL0xmN3R0KzhLNmlqRlYwUVRJVndDMkxIZkF1eUNtNWZFVG1Xa3RTNWU2UFZtMlA1R1ZqV01Kc0hZc1NXdENUbWY0UUtUSmpybVd1Z09aOThTK0JDR3IwbE5oMG1va1JLY0FxcnJFdGUwYk1HQUJRNVBUTUhxVTg1R3RrRVNscnR0ZSt0aDNpKzdPZkg3VU5aM1dpSjZybDRKK0g4L1ZBNUxaYzV3Y210VmtWdTdHd084VEFMeXZ4akRhc0tjcUFGaVhBS0JxTU5lTS9yUy9lQ3d6ekZlMnoxd1hBS1RWZ3ZPY1laNXZFQUJFSFFOMUR6Lzk3N0VzcS9wUlJtOERmR0E1QUo1bzk3Z20rVXlEbi9reUVFaDc5MmtKWGZNYTlHZm9qSHEwNk80Ti9paElPcXhxcWZ2QUFwWGx6TCtmdHA0S2ZVRURuNm5neUtKM2lXdmJONkRQNmlFMHFZY3hKY1djQnFXVDNYaEZYZjgybHhiSCtyR20ySlgyR0hoY3hQM0hoNlVLNUVXZnE3NFBIcCt6ZmtncTVQVnJ6UWp1eHNEdnR3VncwZGF3M3JLM1RRRGcrNHZSWUg0Z1M5YWJ0c2M4V2hFQUhBY0JRTnNxWnJuQjFRT0FvY3crN2E2Y0FEZ3N2eTg2QmpoVWN6cEI5M3IxcUYzVjhUTjlyWFRwV00vRjY2a0cveGxwUmoxY2xoMytNYWhLRjlWUzhKYTYvYmFNbi92M2FVbCtTR29JZkIvOHpaNEV2U2wrNjdIQUp4c0EydVVBNkhucHRsZVRKRUE5T3JjdEE4KzZCUUMrUjZsTDE1dTJIL2xZYW92bkVwdDB6M3l5WlIzenVyUGRta21lMjZkZGs4QnEwN0x2WDFoUkg4OGoyQ2l2ZFZ2cTF1ZGVWWUJteVg3T2M4a3YwQm9CNnhVL0kzVXR2R3o5Q29acXFpbnFzdk1kV3ptWXF2bjM5OHZCLyszZjZscytxUUR3Y1FLQVRzc2pjVkVBVUxYY3Uyd0R6NHFjYXg4TDlpam41WHMwUS95cGxKeXRTbXhhdFN6b0srWEFjck1jbU82VkE1cGY5eHRVZDlNS2c3NDhuZ2JiVjdLMXNsaCt6MnlRNlBaQWZsNTYzZ3ZsbGFyNCtWTDNRSU1TdFBwenRHM3dYS2F5NGJUMVdVaGRDNyt3dmdOMS9SUzBwVzVhT1JobytPOVRDOTYzM1JndjhVa0ZnSThUQUp5bktFNVV1Q1MzM0R1WEthZWJLdHZwSHVWVFN6THlHdnBETXJEa0Vwdm1yQmI2bCtWQWRyVWNaRzZVKzl0KzNXc3d1R3FQZ1dpZmRxcjhmVjlhRGZRcDIrUHRrNTgzSmcxZlhwVFg4M0xnZnhLMEU2NXJRcU0vWjhUMmZuTzlEWHBhRnZOcEFZRC9Yd0dBSjY2dG5iTWtyaWQ5VlMzMyt2OS9aZ2xHVVFMWFZKQ01wRWxpVllsTlU3SkhQRnkycHYyaURBUXVsOEhBdDNaZGs2WkVWWU9yZGhtOFptMkowMkE3WVRrRkU5WkZNRDBIZjk3ajViK2RzTTZEUTlLQ21JRVpBSEN1QUVCbnVETVhhSXJqU1Y5Vnk3MWptWmE2ZytWZ2VMMGNEUHZLeHhncEIwUnRPendvQStmMy9DVUJBR2dYQU55WDFxeVRGMmlMKzV6V25nQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBUGdkL0M5K2RJa0hpTmxFYndBQUFBQkpSVTVFcmtKZ2dnPT1gO1xyXG4gIHJldHVybiBpbWFnZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZudCgpe1xyXG4gIHJldHVybiBgaW5mbyBmYWNlPVwiUm9ib3RvXCIgc2l6ZT0zMiBib2xkPTAgaXRhbGljPTAgY2hhcnNldD1cIlwiIHVuaWNvZGU9MCBzdHJldGNoSD0xMDAgc21vb3RoPTEgYWE9MSBwYWRkaW5nPTQsNCw0LDQgc3BhY2luZz0tOCwtOFxyXG5jb21tb24gbGluZUhlaWdodD0zOCBiYXNlPTMwIHNjYWxlVz01MTIgc2NhbGVIPTUxMiBwYWdlcz0xIHBhY2tlZD0wXHJcbnBhZ2UgaWQ9MCBmaWxlPVwicm9ib3RvLnBuZ1wiXHJcbmNoYXJzIGNvdW50PTE5NFxyXG5jaGFyIGlkPTAgICAgICAgeD0wICAgIHk9MCAgICB3aWR0aD0wICAgIGhlaWdodD0wICAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTAgICAgeGFkdmFuY2U9MCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTAgICAgICB4PTAgICAgeT0wICAgIHdpZHRoPTAgICAgaGVpZ2h0PTAgICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MCAgICB4YWR2YW5jZT0wICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zMiAgICAgIHg9MCAgICB5PTAgICAgd2lkdGg9MCAgICBoZWlnaHQ9MCAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0wICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTMzICAgICAgeD0zMzIgIHk9MTQ2ICB3aWR0aD0xMiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzQgICAgICB4PTIyICAgeT0yNjcgIHdpZHRoPTE1ICAgaGVpZ2h0PTE3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zNSAgICAgIHg9MzY1ICB5PTE0NiAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTM2ICAgICAgeD00ODcgIHk9MCAgICB3aWR0aD0yNCAgIGhlaWdodD0zOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS0xICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzcgICAgICB4PTAgICAgeT0yMTAgIHdpZHRoPTMwICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0yMyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zOCAgICAgIHg9MzkyICB5PTE0NiAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTM5ICAgICAgeD01MCAgIHk9MjY3ICB3aWR0aD0xMSAgIGhlaWdodD0xNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9NiAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDAgICAgICB4PTAgICAgeT0wICAgIHdpZHRoPTE3ICAgaGVpZ2h0PTQxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MCAgICB4YWR2YW5jZT0xMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00MSAgICAgIHg9MTcgICB5PTAgICAgd2lkdGg9MTcgICBoZWlnaHQ9NDEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0wICAgIHhhZHZhbmNlPTExICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQyICAgICAgeD0yNDAgIHk9MjQxICB3aWR0aD0yMiAgIGhlaWdodD0yMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDMgICAgICB4PTE4MyAgeT0yNDEgIHdpZHRoPTI0ICAgaGVpZ2h0PTI1ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NyAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00NCAgICAgIHg9MzcgICB5PTI2NyAgd2lkdGg9MTMgICBoZWlnaHQ9MTcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yMiAgIHhhZHZhbmNlPTYgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQ1ICAgICAgeD0xOTQgIHk9MjY3ICB3aWR0aD0xNyAgIGhlaWdodD0xMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9OSAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDYgICAgICB4PTE4MiAgeT0yNjcgIHdpZHRoPTEyICAgaGVpZ2h0PTExICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MjMgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00NyAgICAgIHg9NDcxICB5PTQxICAgd2lkdGg9MjEgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTEzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQ4ICAgICAgeD00ODEgIHk9MTc4ICB3aWR0aD0yNCAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDkgICAgICB4PTE3MSAgeT0xNDYgIHdpZHRoPTE4ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01MCAgICAgIHg9MTg5ICB5PTE0NiAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTUxICAgICAgeD00MzQgIHk9MTc4ICB3aWR0aD0yMyAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTIgICAgICB4PTIxMyAgeT0xNDYgIHdpZHRoPTI2ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01MyAgICAgIHg9MjM5ICB5PTE0NiAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTU0ICAgICAgeD0yNjIgIHk9MTQ2ICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTUgICAgICB4PTI4NSAgeT0xNDYgIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01NiAgICAgIHg9NDU3ICB5PTE3OCAgd2lkdGg9MjQgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTU3ICAgICAgeD0zMDkgIHk9MTQ2ICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTggICAgICB4PTE3MSAgeT0yNDEgIHdpZHRoPTEyICAgaGVpZ2h0PTI1ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01OSAgICAgIHg9MTYxICB5PTIxMCAgd2lkdGg9MTQgICBoZWlnaHQ9MzAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTcgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTYwICAgICAgeD0zMTAgIHk9MjQxICB3aWR0aD0yMSAgIGhlaWdodD0yMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9MTYgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjEgICAgICB4PTAgICAgeT0yNjcgIHdpZHRoPTIyICAgaGVpZ2h0PTE4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02MiAgICAgIHg9MzMxICB5PTI0MSAgd2lkdGg9MjIgICBoZWlnaHQ9MjIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTYzICAgICAgeD0zNDQgIHk9MTQ2ICB3aWR0aD0yMSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjQgICAgICB4PTAgICAgeT00MSAgIHdpZHRoPTM1ICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0yOSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02NSAgICAgIHg9NjggICB5PTExMyAgd2lkdGg9MjkgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTY2ICAgICAgeD05NyAgIHk9MTEzICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjcgICAgICB4PTM5NSAgeT0xNzggIHdpZHRoPTI3ICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02OCAgICAgIHg9MTIyICB5PTExMyAgd2lkdGg9MjYgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTY5ICAgICAgeD0xNDggIHk9MTEzICB3aWR0aD0yNCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzAgICAgICB4PTE3MiAgeT0xMTMgIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03MSAgICAgIHg9MTk1ICB5PTExMyAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTcyICAgICAgeD0yMjIgIHk9MTEzICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjMgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzMgICAgICB4PTQ5MiAgeT03OSAgIHdpZHRoPTEyICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT05ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03NCAgICAgIHg9MjQ5ICB5PTExMyAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTc1ICAgICAgeD0yNzMgIHk9MTEzICB3aWR0aD0yNiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzYgICAgICB4PTI5OSAgeT0xMTMgIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03NyAgICAgIHg9MzIyICB5PTExMyAgd2lkdGg9MzIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTI4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTc4ICAgICAgeD0zNTQgIHk9MTEzICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjMgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzkgICAgICB4PTM4MSAgeT0xMTMgIHdpZHRoPTI4ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04MCAgICAgIHg9NDA5ICB5PTExMyAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTgxICAgICAgeD0yOTQgIHk9NDEgICB3aWR0aD0yOCAgIGhlaWdodD0zNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODIgICAgICB4PTQzNCAgeT0xMTMgIHdpZHRoPTI2ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04MyAgICAgIHg9NDYwICB5PTExMyAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTg0ICAgICAgeD0wICAgIHk9MTQ2ICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODUgICAgICB4PTQ4NSAgeT0xMTMgIHdpZHRoPTI1ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04NiAgICAgIHg9MjcgICB5PTE0NiAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTg3ICAgICAgeD01NSAgIHk9MTQ2ICB3aWR0aD0zNiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODggICAgICB4PTkxICAgeT0xNDYgIHdpZHRoPTI4ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04OSAgICAgIHg9MTE5ICB5PTE0NiAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTkwICAgICAgeD0xNDYgIHk9MTQ2ICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTEgICAgICB4PTM0ICAgeT0wICAgIHdpZHRoPTE1ICAgaGVpZ2h0PTQwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTEgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05MiAgICAgIHg9MCAgICB5PTc5ICAgd2lkdGg9MjEgICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTEzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTkzICAgICAgeD00OSAgIHk9MCAgICB3aWR0aD0xNSAgIGhlaWdodD00MCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS0xICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTQgICAgICB4PTQ4NCAgeT0yNDEgIHdpZHRoPTIxICAgaGVpZ2h0PTIwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xMyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05NSAgICAgIHg9MjExICB5PTI2NyAgd2lkdGg9MjMgICBoZWlnaHQ9MTEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yNSAgIHhhZHZhbmNlPTE0ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTk2ICAgICAgeD0xMzkgIHk9MjY3ICB3aWR0aD0xNSAgIGhlaWdodD0xNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTcgICAgICB4PTM2MyAgeT0yMTAgIHdpZHRoPTIzICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05OCAgICAgIHg9NDkgICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTk5ICAgICAgeD0zODYgIHk9MjEwICB3aWR0aD0yMyAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTAwICAgICB4PTcyICAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDEgICAgIHg9NDA5ICB5PTIxMCAgd2lkdGg9MjMgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwMiAgICAgeD05NSAgIHk9NzkgICB3aWR0aD0yMCAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTAzICAgICB4PTExNSAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDQgICAgIHg9MTM4ICB5PTc5ICAgd2lkdGg9MjIgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwNSAgICAgeD00MjIgIHk9MTc4ICB3aWR0aD0xMiAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTA2ICAgICB4PTEzNiAgeT0wICAgIHdpZHRoPTE2ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDcgICAgIHg9MTYwICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE2ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwOCAgICAgeD00OTIgIHk9NDEgICB3aWR0aD0xMiAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTA5ICAgICB4PTQzMiAgeT0yMTAgIHdpZHRoPTMyICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0yOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTAgICAgIHg9NDY0ICB5PTIxMCAgd2lkdGg9MjIgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExMSAgICAgeD0xNDcgIHk9MjQxICB3aWR0aD0yNCAgIGhlaWdodD0yNSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTEyICAgICB4PTE4MyAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTMgICAgIHg9MjA2ICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExNCAgICAgeD00ODYgIHk9MjEwICB3aWR0aD0xNyAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTE1ICAgICB4PTAgICAgeT0yNDEgIHdpZHRoPTIzICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTYgICAgIHg9MTQyICB5PTIxMCAgd2lkdGg9MTkgICBoZWlnaHQ9MzAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD00ICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExNyAgICAgeD0yMyAgIHk9MjQxICB3aWR0aD0yMiAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTE4ICAgICB4PTQ1ICAgeT0yNDEgIHdpZHRoPTI0ICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTkgICAgIHg9NjkgICB5PTI0MSAgd2lkdGg9MzIgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI0ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyMCAgICAgeD0xMDEgIHk9MjQxICB3aWR0aD0yNCAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTYgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTIxICAgICB4PTIyOSAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjIgICAgIHg9MTI1ICB5PTI0MSAgd2lkdGg9MjIgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE2ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyMyAgICAgeD0xNTIgIHk9MCAgICB3aWR0aD0xOCAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTI0ICAgICB4PTMyMiAgeT00MSAgIHdpZHRoPTEyICAgaGVpZ2h0PTM2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjUgICAgIHg9MTcwICB5PTAgICAgd2lkdGg9MTggICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTExICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyNiAgICAgeD0xMTMgIHk9MjY3ICB3aWR0aD0yNiAgIGhlaWdodD0xNSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEyICAgeGFkdmFuY2U9MjIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTI3ICAgICB4PTQxOSAgeT0xNDYgIHdpZHRoPTIwICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xNCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNjAgICAgIHg9MCAgICB5PTAgICAgd2lkdGg9MCAgICBoZWlnaHQ9MCAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0wICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE2MSAgICAgeD0zMCAgIHk9MjEwICB3aWR0aD0xMiAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTYyICAgICB4PTI1MiAgeT03OSAgIHdpZHRoPTI0ICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NSAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNjMgICAgIHg9NDM5ICB5PTE0NiAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE2NCAgICAgeD0xNzUgIHk9MjEwICB3aWR0aD0yOSAgIGhlaWdodD0zMCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTUgICAgeGFkdmFuY2U9MjMgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTY1ICAgICB4PTQ2NCAgeT0xNDYgIHdpZHRoPTI3ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNjYgICAgIHg9MzM0ICB5PTQxICAgd2lkdGg9MTIgICBoZWlnaHQ9MzYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE2NyAgICAgeD02NCAgIHk9MCAgICB3aWR0aD0yNiAgIGhlaWdodD00MCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTY4ICAgICB4PTIzNCAgeT0yNjcgIHdpZHRoPTE5ICAgaGVpZ2h0PTExICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0xMyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNjkgICAgIHg9MCAgICB5PTE3OCAgd2lkdGg9MzEgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE3MCAgICAgeD00NDYgIHk9MjQxICB3aWR0aD0xOSAgIGhlaWdodD0yMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTcxICAgICB4PTM1MyAgeT0yNDEgIHdpZHRoPTIxICAgaGVpZ2h0PTIyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTAgICB4YWR2YW5jZT0xNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNzIgICAgIHg9NjEgICB5PTI2NyAgd2lkdGg9MjIgICBoZWlnaHQ9MTYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMiAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE3MyAgICAgeD0yNTMgIHk9MjY3ICB3aWR0aD0xNyAgIGhlaWdodD0xMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTE0ICAgeGFkdmFuY2U9OSAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTc0ICAgICB4PTMxICAgeT0xNzggIHdpZHRoPTMxICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNzUgICAgIHg9MjcwICB5PTI2NyAgd2lkdGg9MjEgICBoZWlnaHQ9MTEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE3NiAgICAgeD04MyAgIHk9MjY3ICB3aWR0aD0xNiAgIGhlaWdodD0xNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MTIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTc3ICAgICB4PTM0MCAgeT0yMTAgIHdpZHRoPTIzICAgaGVpZ2h0PTI4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NiAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNzggICAgIHg9Mzc0ICB5PTI0MSAgd2lkdGg9MTggICBoZWlnaHQ9MjIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTEyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE3OSAgICAgeD0zOTIgIHk9MjQxICB3aWR0aD0xOCAgIGhlaWdodD0yMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTgwICAgICB4PTE1NCAgeT0yNjcgIHdpZHRoPTE2ICAgaGVpZ2h0PTE0ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xODEgICAgIHg9Mjc2ICB5PTc5ICAgd2lkdGg9MjIgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE4MiAgICAgeD02MiAgIHk9MTc4ICB3aWR0aD0yMSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTYgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTgzICAgICB4PTE3MCAgeT0yNjcgIHdpZHRoPTEyICAgaGVpZ2h0PTEyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTIgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xODQgICAgIHg9OTkgICB5PTI2NyAgd2lkdGg9MTQgICBoZWlnaHQ9MTYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yNSAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE4NSAgICAgeD00MTAgIHk9MjQxICB3aWR0aD0xNCAgIGhlaWdodD0yMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTg2ICAgICB4PTQ2NSAgeT0yNDEgIHdpZHRoPTE5ICAgaGVpZ2h0PTIxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xODcgICAgIHg9NDI0ICB5PTI0MSAgd2lkdGg9MjIgICBoZWlnaHQ9MjIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMCAgIHhhZHZhbmNlPTE1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE4OCAgICAgeD04MyAgIHk9MTc4ICB3aWR0aD0zMCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjMgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTg5ICAgICB4PTExMyAgeT0xNzggIHdpZHRoPTMxICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xOTAgICAgIHg9NDIgICB5PTIxMCAgd2lkdGg9MzEgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE5MSAgICAgeD0xNDQgIHk9MTc4ICB3aWR0aD0yMSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTkyICAgICB4PTE4OCAgeT0wICAgIHdpZHRoPTI5ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTUgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xOTMgICAgIHg9MjE3ICB5PTAgICAgd2lkdGg9MjkgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNSAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE5NCAgICAgeD0zNSAgIHk9NDEgICB3aWR0aD0yOSAgIGhlaWdodD0zOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS00ICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTk1ICAgICB4PTE4NyAgeT00MSAgIHdpZHRoPTI5ICAgaGVpZ2h0PTM3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTMgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xOTYgICAgIHg9MzQ2ICB5PTQxICAgd2lkdGg9MjkgICBoZWlnaHQ9MzYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tMiAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE5NyAgICAgeD0yNDYgIHk9MCAgICB3aWR0aD0yOSAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS01ICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTk4ICAgICB4PTE2NSAgeT0xNzggIHdpZHRoPTM5ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0zMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xOTkgICAgIHg9NjQgICB5PTQxICAgd2lkdGg9MjcgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIwMCAgICAgeD0yNzUgIHk9MCAgICB3aWR0aD0yNCAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS01ICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjAxICAgICB4PTI5OSAgeT0wICAgIHdpZHRoPTI0ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTUgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMDIgICAgIHg9OTEgICB5PTQxICAgd2lkdGg9MjQgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNCAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIwMyAgICAgeD0zNzUgIHk9NDEgICB3aWR0aD0yNCAgIGhlaWdodD0zNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS0yICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjA0ICAgICB4PTMyMyAgeT0wICAgIHdpZHRoPTE1ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTUgICB4YWR2YW5jZT05ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMDUgICAgIHg9MzM4ICB5PTAgICAgd2lkdGg9MTYgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNSAgIHhhZHZhbmNlPTkgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIwNiAgICAgeD0xMTUgIHk9NDEgICB3aWR0aD0xOSAgIGhlaWdodD0zOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS00ICAgeGFkdmFuY2U9OSAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjA3ICAgICB4PTM5OSAgeT00MSAgIHdpZHRoPTE5ICAgaGVpZ2h0PTM2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTIgICB4YWR2YW5jZT05ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMDggICAgIHg9MjA0ICB5PTE3OCAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIwOSAgICAgeD0yMTYgIHk9NDEgICB3aWR0aD0yNyAgIGhlaWdodD0zNyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS0zICAgeGFkdmFuY2U9MjMgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjEwICAgICB4PTM1NCAgeT0wICAgIHdpZHRoPTI4ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTUgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMTEgICAgIHg9MzgyICB5PTAgICAgd2lkdGg9MjggICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNSAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIxMiAgICAgeD0xMzQgIHk9NDEgICB3aWR0aD0yOCAgIGhlaWdodD0zOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS00ICAgeGFkdmFuY2U9MjIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjEzICAgICB4PTI0MyAgeT00MSAgIHdpZHRoPTI4ICAgaGVpZ2h0PTM3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTMgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMTQgICAgIHg9NDE4ICB5PTQxICAgd2lkdGg9MjggICBoZWlnaHQ9MzYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tMiAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIxNSAgICAgeD0yNjIgIHk9MjQxICB3aWR0aD0yMyAgIGhlaWdodD0yMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjE2ICAgICB4PTIxICAgeT03OSAgIHdpZHRoPTI4ICAgaGVpZ2h0PTM0ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMTcgICAgIHg9NDEwICB5PTAgICAgd2lkdGg9MjUgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNSAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIxOCAgICAgeD00MzUgIHk9MCAgICB3aWR0aD0yNSAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS01ICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjE5ICAgICB4PTE2MiAgeT00MSAgIHdpZHRoPTI1ICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTQgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMjAgICAgIHg9NDQ2ICB5PTQxICAgd2lkdGg9MjUgICBoZWlnaHQ9MzYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tMiAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIyMSAgICAgeD00NjAgIHk9MCAgICB3aWR0aD0yNyAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS01ICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjIyICAgICB4PTIzMiAgeT0xNzggIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMjMgICAgIHg9MjU2ICB5PTE3OCAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIyNCAgICAgeD0yOTggIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjI1ICAgICB4PTMyMSAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMjYgICAgIHg9MjgwICB5PTE3OCAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIyNyAgICAgeD03MyAgIHk9MjEwICB3aWR0aD0yMyAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjI4ICAgICB4PTIwNCAgeT0yMTAgIHdpZHRoPTIzICAgaGVpZ2h0PTMwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMjkgICAgIHg9MzQ0ICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIzMCAgICAgeD0yMDcgIHk9MjQxICB3aWR0aD0zMyAgIGhlaWdodD0yNSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9MjcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjMxICAgICB4PTM2NyAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMzIgICAgIHg9MzkwICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIzMyAgICAgeD00MTMgIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjM0ICAgICB4PTMwMyAgeT0xNzggIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMzUgICAgIHg9MjI3ICB5PTIxMCAgd2lkdGg9MjMgICBoZWlnaHQ9MzAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD00ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIzNiAgICAgeD00MzYgIHk9NzkgICB3aWR0aD0xNiAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjM3ICAgICB4PTQ1MiAgeT03OSAgIHdpZHRoPTE2ICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMzggICAgIHg9NDkxICB5PTE0NiAgd2lkdGg9MjAgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIzOSAgICAgeD0yNTAgIHk9MjEwICB3aWR0aD0yMCAgIGhlaWdodD0zMCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTQgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjQwICAgICB4PTMyNiAgeT0xNzggIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNDEgICAgIHg9OTYgICB5PTIxMCAgd2lkdGg9MjIgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI0MiAgICAgeD00NjggIHk9NzkgICB3aWR0aD0yNCAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjQzICAgICB4PTAgICAgeT0xMTMgIHdpZHRoPTI0ICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNDQgICAgIHg9MzQ5ICB5PTE3OCAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI0NSAgICAgeD0xMTggIHk9MjEwICB3aWR0aD0yNCAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjQ2ICAgICB4PTI3MCAgeT0yMTAgIHdpZHRoPTI0ICAgaGVpZ2h0PTMwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NCAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNDcgICAgIHg9Mjg1ICB5PTI0MSAgd2lkdGg9MjUgICBoZWlnaHQ9MjMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI0OCAgICAgeD0zMTYgIHk9MjEwICB3aWR0aD0yNCAgIGhlaWdodD0yOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTcgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjQ5ICAgICB4PTI0ICAgeT0xMTMgIHdpZHRoPTIyICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNTAgICAgIHg9NDYgICB5PTExMyAgd2lkdGg9MjIgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI1MSAgICAgeD0zNzMgIHk9MTc4ICB3aWR0aD0yMiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjUyICAgICB4PTI5NCAgeT0yMTAgIHdpZHRoPTIyICAgaGVpZ2h0PTMwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NCAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNTMgICAgIHg9OTAgICB5PTAgICAgd2lkdGg9MjMgICBoZWlnaHQ9NDAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI1NCAgICAgeD0xMTMgIHk9MCAgICB3aWR0aD0yMyAgIGhlaWdodD00MCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjU1ICAgICB4PTI3MSAgeT00MSAgIHdpZHRoPTIzICAgaGVpZ2h0PTM3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NCAgICB4YWR2YW5jZT0xNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxua2VybmluZ3MgY291bnQ9NTYwXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTQ0IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD00NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD00NyBzZWNvbmQ9NDcgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTc0IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMTYgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTExOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTAgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xOTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTIxMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI0MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9ODcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIzMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTM5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD05NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTIyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yMjEgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTkzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTIzNSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTEyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0xOTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD05NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MTk1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9ODcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTk4IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD05NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTA5IHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MTczIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwIHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTE5NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTk4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNDggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTQ2IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MTk2IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc1IHNlY29uZD0xMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MTk1IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD04OSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MzkgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9NDQgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD02NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9OTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xOTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTExOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MSBzZWNvbmQ9ODQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTQ1IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xODcgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD02MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTIzMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD00NCBzZWNvbmQ9MzQgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yNTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTExOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xNzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NDYgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTkyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEwOSBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xODcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTE5NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTIyNiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9ODYgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NiBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgxIHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDEgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTcxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTk4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD04NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTY1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTE1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD00MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD02MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTkyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTM5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xOTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTc0IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE5NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MTkyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTIyNyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMzAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTY1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9NjMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MzkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE5OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTQ2IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD03OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xOTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9NzQgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI0NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTIxMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjI5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTEwMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTE1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0xMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD00NCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD02NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCBzZWNvbmQ9NDYgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIxOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9ODQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTE5MiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTk0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg4IHNlY29uZD0xNzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTE5NyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTk3IHNlY29uZD0zNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9ODQgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xODcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE3MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MTE1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTQ0IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0xOTMgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTY1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0zNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9NjMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9ODUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTExOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTkzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD05OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03OSBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTEyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE5MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgyIHNlY29uZD04NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05NyBzZWNvbmQ9MzkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTIyNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjMzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTYzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY4IHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc5IHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9OTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTEwMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD02MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MzkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9NjUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yNDEgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xOTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjQyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4IHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgyIHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTMyIHNlY29uZD04NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTE0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwIHNlY29uZD0xOTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI0MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD05OSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE3MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTgwIHNlY29uZD02NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTM5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMDkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MTk0IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTIzMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD00NCBzZWNvbmQ9MzkgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTE3MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xNzEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEwOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTc0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD04MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD05OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9MTE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCBzZWNvbmQ9NDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExNSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NSBzZWNvbmQ9MTczIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xOTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCBzZWNvbmQ9NDQgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTExOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTExOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTk0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODIgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTE5NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD05NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTA5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xOTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTk4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc5IHNlY29uZD0xOTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE5MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xOTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTcxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yNDggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTY1IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTg1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD05NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTkyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjEyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTE5MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD05NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTk4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD00NiBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjI1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9NjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTAgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTE5OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NiBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MzQgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODEgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjE0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9NjMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9NDYgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD00NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD03NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTIyOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc1IHNlY29uZD00NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTk1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yNTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD00NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTQ2IHNlY29uZD0zNCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjE2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xOTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTEwMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9NjUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTExOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjQxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD00NCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTM5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI0NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTQ2IHNlY29uZD0zOSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTczIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD05OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0zNCBhbW91bnQ9LTFcclxuYDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ID0ge30gKXtcclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggcGFuZWwgKTtcclxuXHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZWQnLCBoYW5kbGVPblJlbGVhc2UgKTtcclxuXHJcbiAgY29uc3QgdGVtcE1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XHJcblxyXG4gIGxldCBvbGRQYXJlbnQ7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHAgKXtcclxuXHJcbiAgICBjb25zdCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9ID0gcDtcclxuXHJcbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBmb2xkZXIuYmVpbmdNb3ZlZCA9PT0gdHJ1ZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGVtcE1hdHJpeC5nZXRJbnZlcnNlKCBpbnB1dE9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG5cclxuICAgIGZvbGRlci5tYXRyaXgucHJlbXVsdGlwbHkoIHRlbXBNYXRyaXggKTtcclxuICAgIGZvbGRlci5tYXRyaXguZGVjb21wb3NlKCBmb2xkZXIucG9zaXRpb24sIGZvbGRlci5xdWF0ZXJuaW9uLCBmb2xkZXIuc2NhbGUgKTtcclxuXHJcbiAgICBvbGRQYXJlbnQgPSBmb2xkZXIucGFyZW50O1xyXG4gICAgaW5wdXRPYmplY3QuYWRkKCBmb2xkZXIgKTtcclxuXHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcblxyXG4gICAgZm9sZGVyLmJlaW5nTW92ZWQgPSB0cnVlO1xyXG5cclxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAnZ3JhYmJlZCcsIGlucHV0ICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblJlbGVhc2UoIHsgaW5wdXRPYmplY3QsIGlucHV0IH09e30gKXtcclxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIG9sZFBhcmVudCA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggZm9sZGVyLmJlaW5nTW92ZWQgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBmb2xkZXIubWF0cml4LnByZW11bHRpcGx5KCBpbnB1dE9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG4gICAgZm9sZGVyLm1hdHJpeC5kZWNvbXBvc2UoIGZvbGRlci5wb3NpdGlvbiwgZm9sZGVyLnF1YXRlcm5pb24sIGZvbGRlci5zY2FsZSApO1xyXG4gICAgb2xkUGFyZW50LmFkZCggZm9sZGVyICk7XHJcbiAgICBvbGRQYXJlbnQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgZm9sZGVyLmJlaW5nTW92ZWQgPSBmYWxzZTtcclxuXHJcbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ2dyYWJSZWxlYXNlZCcsIGlucHV0ICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaW50ZXJhY3Rpb247XHJcbn0iLCJleHBvcnQgZnVuY3Rpb24gZ3JhYkJhcigpe1xyXG4gIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgaW1hZ2Uuc3JjID0gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFBZ0NBWUFBQUNpblg2RUFBQUFDWEJJV1hNQUFDNGpBQUF1SXdGNHBUOTJBQUFLVDJsRFExQlFhRzkwYjNOb2IzQWdTVU5ESUhCeWIyWnBiR1VBQUhqYW5WTm5WRlBwRmozMzN2UkNTNGlBbEV0dlVoVUlJRkpDaTRBVWtTWXFJUWtRU29naG9ka1ZVY0VSUlVVRUc4aWdpQU9Pam9DTUZWRXNESW9LMkFma0lhS09nNk9JaXNyNzRYdWphOWE4OStiTi9yWFhQdWVzODUyenp3ZkFDQXlXU0ROUk5ZQU1xVUllRWVDRHg4VEc0ZVF1UUlFS0pIQUFFQWl6WkNGei9TTUJBUGgrUER3cklzQUh2Z0FCZU5NTENBREFUWnZBTUJ5SC93L3FRcGxjQVlDRUFjQjBrVGhMQ0lBVUFFQjZqa0ttQUVCR0FZQ2RtQ1pUQUtBRUFHRExZMkxqQUZBdEFHQW5mK2JUQUlDZCtKbDdBUUJibENFVkFhQ1JBQ0FUWlloRUFHZzdBS3pQVm9wRkFGZ3dBQlJtUzhRNUFOZ3RBREJKVjJaSUFMQzNBTURPRUF1eUFBZ01BREJSaUlVcEFBUjdBR0RJSXlONEFJU1pBQlJHOGxjODhTdXVFT2NxQUFCNG1iSTh1U1E1UllGYkNDMXhCMWRYTGg0b3pra1hLeFEyWVFKaG1rQXV3bm1aR1RLQk5BL2c4OHdBQUtDUkZSSGdnL1A5ZU00T3JzN09ObzYyRGw4dDZyOEcveUppWXVQKzVjK3JjRUFBQU9GMGZ0SCtMQyt6R29BN0JvQnQvcUlsN2dSb1hndWdkZmVMWnJJUFFMVUFvT25hVi9OdytINDhQRVdoa0xuWjJlWGs1TmhLeEVKYlljcFhmZjVud2wvQVYvMXMrWDQ4L1BmMTRMN2lKSUV5WFlGSEJQamd3c3owVEtVY3o1SUpoR0xjNW85SC9MY0wvL3dkMHlMRVNXSzVXQ29VNDFFU2NZNUVtb3p6TXFVaWlVS1NLY1VsMHY5azR0OHMrd00rM3pVQXNHbytBWHVSTGFoZFl3UDJTeWNRV0hUQTR2Y0FBUEs3YjhIVUtBZ0RnR2lENGM5My8rOC8vVWVnSlFDQVprbVNjUUFBWGtRa0xsVEtzei9IQ0FBQVJLQ0JLckJCRy9UQkdDekFCaHpCQmR6QkMveGdOb1JDSk1UQ1FoQkNDbVNBSEhKZ0theUNRaWlHemJBZEttQXYxRUFkTk1CUmFJYVRjQTR1d2xXNERqMXdEL3BoQ0o3QktMeUJDUVJCeUFnVFlTSGFpQUZpaWxnampnZ1htWVg0SWNGSUJCS0xKQ0RKaUJSUklrdVJOVWd4VW9wVUlGVklIZkk5Y2dJNWgxeEd1cEU3eUFBeWd2eUd2RWN4bElHeVVUM1VETFZEdWFnM0dvUkdvZ3ZRWkhReG1vOFdvSnZRY3JRYVBZdzJvZWZRcTJnUDJvOCtROGN3d09nWUJ6UEViREF1eHNOQ3NUZ3NDWk5qeTdFaXJBeXJ4aHF3VnF3RHU0bjFZOCt4ZHdRU2dVWEFDVFlFZDBJZ1lSNUJTRmhNV0U3WVNLZ2dIQ1EwRWRvSk53a0RoRkhDSnlLVHFFdTBKcm9SK2NRWVlqSXhoMWhJTENQV0VvOFRMeEI3aUVQRU55UVNpVU15SjdtUUFrbXhwRlRTRXRKRzBtNVNJK2tzcVpzMFNCb2prOG5hWkd1eUJ6bVVMQ0FyeUlYa25lVEQ1RFBrRytRaDhsc0tuV0pBY2FUNFUrSW9Vc3BxU2hubEVPVTA1UVpsbURKQlZhT2FVdDJvb1ZRUk5ZOWFRcTJodGxLdlVZZW9FelIxbWpuTmd4WkpTNld0b3BYVEdtZ1hhUGRwcitoMHVoSGRsUjVPbDlCWDBzdnBSK2lYNkFQMGR3d05oaFdEeDRobktCbWJHQWNZWnhsM0dLK1lUS1laMDRzWngxUXdOekhybU9lWkQ1bHZWVmdxdGlwOEZaSEtDcFZLbFNhVkd5b3ZWS21xcHFyZXFndFY4MVhMVkkrcFhsTjlya1pWTTFQanFRblVscXRWcXAxUTYxTWJVMmVwTzZpSHFtZW9iMVEvcEg1Wi9Za0dXY05NdzA5RHBGR2dzVi9qdk1ZZ0MyTVpzM2dzSVdzTnE0WjFnVFhFSnJITjJYeDJLcnVZL1IyN2l6MnFxYUU1UXpOS00xZXpVdk9VWmo4SDQ1aHgrSngwVGdubktLZVg4MzZLM2hUdktlSXBHNlkwVExreFpWeHJxcGFYbGxpclNLdFJxMGZydlRhdTdhZWRwcjFGdTFuN2dRNUJ4MG9uWENkSFo0L09CWjNuVTlsVDNhY0tweFpOUFRyMXJpNnFhNlVib2J0RWQ3OXVwKzZZbnI1ZWdKNU1iNmZlZWIzbitoeDlMLzFVL1czNnAvVkhERmdHc3d3a0J0c016aGc4eFRWeGJ6d2RMOGZiOFZGRFhjTkFRNlZobFdHWDRZU1J1ZEU4bzlWR2pVWVBqR25HWE9NazQyM0diY2FqSmdZbUlTWkxUZXBON3BwU1RibW1LYVk3VER0TXg4M016YUxOMXBrMW16MHgxekxubStlYjE1dmZ0MkJhZUZvc3RxaTJ1R1ZKc3VSYXBsbnV0cnh1aFZvNVdhVllWVnBkczBhdG5hMGwxcnV0dTZjUnA3bE9rMDZybnRabnc3RHh0c20ycWJjWnNPWFlCdHV1dG0yMmZXRm5ZaGRudDhXdXcrNlR2Wk45dW4yTi9UMEhEWWZaRHFzZFdoMStjN1J5RkRwV090NmF6cHp1UDMzRjlKYnBMMmRZenhEUDJEUGp0aFBMS2NScG5WT2IwMGRuRjJlNWM0UHppSXVKUzRMTExwYytMcHNieHQzSXZlUktkUFZ4WGVGNjB2V2RtN09id3UybzI2L3VOdTVwN29mY244dzBueW1lV1ROejBNUElRK0JSNWRFL0M1K1ZNR3Zmckg1UFEwK0JaN1huSXk5akw1RlhyZGV3dDZWM3F2ZGg3eGMrOWo1eW4rTSs0enczM2pMZVdWL01OOEMzeUxmTFQ4TnZubCtGMzBOL0kvOWsvM3IvMFFDbmdDVUJad09KZ1VHQld3TDcrSHA4SWIrT1B6cmJaZmF5MmUxQmpLQzVRUlZCajRLdGd1WEJyU0ZveU95UXJTSDM1NWpPa2M1cERvVlFmdWpXMEFkaDVtR0x3MzRNSjRXSGhWZUdQNDV3aUZnYTBUR1hOWGZSM0VOejMwVDZSSlpFM3B0bk1VODVyeTFLTlNvK3FpNXFQTm8zdWpTNlA4WXVabG5NMVZpZFdFbHNTeHc1TGlxdU5tNXN2dC84N2ZPSDRwM2lDK043RjVndnlGMXdlYUhPd3ZTRnB4YXBMaElzT3BaQVRJaE9PSlR3UVJBcXFCYU1KZklUZHlXT0NubkNIY0puSWkvUk50R0kyRU5jS2g1TzhrZ3FUWHFTN0pHOE5Ya2t4VE9sTE9XNWhDZXBrTHhNRFV6ZG16cWVGcHAySUcweVBUcTlNWU9Ta1pCeFFxb2hUWk8yWitwbjVtWjJ5NnhsaGJMK3hXNkx0eThlbFFmSmE3T1FyQVZaTFFxMlFxYm9WRm9vMXlvSHNtZGxWMmEvelluS09aYXJuaXZON2N5enl0dVFONXp2bi8vdEVzSVM0WksycFlaTFZ5MGRXT2E5ckdvNXNqeHhlZHNLNHhVRks0WldCcXc4dUlxMkttM1ZUNnZ0VjVldWZyMG1lazFyZ1Y3QnlvTEJ0UUZyNnd0VkN1V0ZmZXZjMSsxZFQxZ3ZXZCsxWWZxR25ScytGWW1LcmhUYkY1Y1ZmOWdvM0hqbEc0ZHZ5citaM0pTMHFhdkV1V1RQWnRKbTZlYmVMWjViRHBhcWwrYVhEbTROMmRxMERkOVd0TzMxOWtYYkw1Zk5LTnU3ZzdaRHVhTy9QTGk4WmFmSnpzMDdQMVNrVlBSVStsUTI3dExkdFdIWCtHN1I3aHQ3dlBZMDdOWGJXN3ozL1Q3SnZ0dFZBVlZOMVdiVlpmdEorN1AzUDY2SnF1bjRsdnR0WGExT2JYSHR4d1BTQS8wSEl3NjIxN25VMVIzU1BWUlNqOVlyNjBjT3h4KysvcDN2ZHkwTk5nMVZqWnpHNGlOd1JIbms2ZmNKMy9jZURUcmFkb3g3ck9FSDB4OTJIV2NkTDJwQ212S2FScHRUbXZ0YllsdTZUOHcrMGRicTNucjhSOXNmRDV3MFBGbDVTdk5VeVduYTZZTFRrMmZ5ejR5ZGxaMTlmaTc1M0dEYm9yWjc1MlBPMzJvUGIrKzZFSFRoMGtYL2krYzd2RHZPWFBLNGRQS3kyK1VUVjdoWG1xODZYMjNxZE9vOC9wUFRUOGU3bkx1YXJybGNhN251ZXIyMWUyYjM2UnVlTjg3ZDlMMTU4UmIvMXRXZU9UM2R2Zk42Yi9mRjkvWGZGdDErY2lmOXpzdTcyWGNuN3EyOFQ3eGY5RUR0UWRsRDNZZlZQMXYrM05qdjNIOXF3SGVnODlIY1IvY0doWVBQL3BIMWp3OURCWStaajh1R0RZYnJuamcrT1RuaVAzTDk2ZnluUTg5a3p5YWVGLzZpL3N1dUZ4WXZmdmpWNjlmTzBaalJvWmZ5bDVPL2JYeWwvZXJBNnhtdjI4YkN4aDYreVhnek1WNzBWdnZ0d1hmY2R4M3ZvOThQVCtSOElIOG8vMmo1c2ZWVDBLZjdreG1Uay84RUE1anovR016TGRzQUFEc2thVlJZZEZoTlREcGpiMjB1WVdSdlltVXVlRzF3QUFBQUFBQThQM2h3WVdOclpYUWdZbVZuYVc0OUl1Kzd2eUlnYVdROUlsYzFUVEJOY0VObGFHbEllbkpsVTNwT1ZHTjZhMk01WkNJL1BnbzhlRHA0YlhCdFpYUmhJSGh0Ykc1ek9uZzlJbUZrYjJKbE9tNXpPbTFsZEdFdklpQjRPbmh0Y0hSclBTSkJaRzlpWlNCWVRWQWdRMjl5WlNBMUxqWXRZekV6TWlBM09TNHhOVGt5T0RRc0lESXdNVFl2TURRdk1Ua3RNVE02TVRNNk5EQWdJQ0FnSUNBZ0lDSStDaUFnSUR4eVpHWTZVa1JHSUhodGJHNXpPbkprWmowaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1UazVPUzh3TWk4eU1pMXlaR1l0YzNsdWRHRjRMVzV6SXlJK0NpQWdJQ0FnSUR4eVpHWTZSR1Z6WTNKcGNIUnBiMjRnY21SbU9tRmliM1YwUFNJaUNpQWdJQ0FnSUNBZ0lDQWdJSGh0Ykc1ek9uaHRjRDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3THlJS0lDQWdJQ0FnSUNBZ0lDQWdlRzFzYm5NNlpHTTlJbWgwZEhBNkx5OXdkWEpzTG05eVp5OWtZeTlsYkdWdFpXNTBjeTh4TGpFdklnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cHdhRzkwYjNOb2IzQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2Y0dodmRHOXphRzl3THpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbmh0Y0UxTlBTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZiVzB2SWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwemRFVjJkRDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDNOVWVYQmxMMUpsYzI5MWNtTmxSWFpsYm5Raklnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cDBhV1ptUFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzUnBabVl2TVM0d0x5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZaWGhwWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOWxlR2xtTHpFdU1DOGlQZ29nSUNBZ0lDQWdJQ0E4ZUcxd09rTnlaV0YwYjNKVWIyOXNQa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUF5TURFMUxqVWdLRmRwYm1SdmQzTXBQQzk0YlhBNlEzSmxZWFJ2Y2xSdmIydytDaUFnSUNBZ0lDQWdJRHg0YlhBNlEzSmxZWFJsUkdGMFpUNHlNREUyTFRBNUxUSTRWREUyT2pJMU9qTXlMVEEzT2pBd1BDOTRiWEE2UTNKbFlYUmxSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBOYjJScFpubEVZWFJsUGpJd01UWXRNRGt0TWpoVU1UWTZNemM2TWpNdE1EYzZNREE4TDNodGNEcE5iMlJwWm5sRVlYUmxQZ29nSUNBZ0lDQWdJQ0E4ZUcxd09rMWxkR0ZrWVhSaFJHRjBaVDR5TURFMkxUQTVMVEk0VkRFMk9qTTNPakl6TFRBM09qQXdQQzk0YlhBNlRXVjBZV1JoZEdGRVlYUmxQZ29nSUNBZ0lDQWdJQ0E4WkdNNlptOXliV0YwUG1sdFlXZGxMM0J1Wnp3dlpHTTZabTl5YldGMFBnb2dJQ0FnSUNBZ0lDQThjR2h2ZEc5emFHOXdPa052Ykc5eVRXOWtaVDR6UEM5d2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBnb2dJQ0FnSUNBZ0lDQThjR2h2ZEc5emFHOXdPa2xEUTFCeWIyWnBiR1UrYzFKSFFpQkpSVU0yTVRrMk5pMHlMakU4TDNCb2IzUnZjMmh2Y0RwSlEwTlFjbTltYVd4bFBnb2dJQ0FnSUNBZ0lDQThlRzF3VFUwNlNXNXpkR0Z1WTJWSlJENTRiWEF1YVdsa09tRmhZVEZqTVRRekxUVXdabVV0T1RRME15MWhOVGhtTFdFeU0yVmtOVE0zTURkbU1Ed3ZlRzF3VFUwNlNXNXpkR0Z1WTJWSlJENEtJQ0FnSUNBZ0lDQWdQSGh0Y0UxTk9rUnZZM1Z0Wlc1MFNVUStZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pkbE56ZG1ZbVpqTFRnMVpEUXRNVEZsTmkxaFl6aG1MV0ZqTnpVMFpXUTFPRE0zWmp3dmVHMXdUVTA2Ukc5amRXMWxiblJKUkQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRTFOT2s5eWFXZHBibUZzUkc5amRXMWxiblJKUkQ1NGJYQXVaR2xrT21NMVptTTBaR1l5TFRreFkyTXRaVEkwTVMwNFkyVmpMVE16T0RJeVkyUTFaV0ZsT1R3dmVHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUGdvZ0lDQWdJQ0FnSUNBOGVHMXdUVTA2U0dsemRHOXllVDRLSUNBZ0lDQWdJQ0FnSUNBZ1BISmtaanBUWlhFK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4eVpHWTZiR2tnY21SbU9uQmhjbk5sVkhsd1pUMGlVbVZ6YjNWeVkyVWlQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSRmRuUTZZV04wYVc5dVBtTnlaV0YwWldROEwzTjBSWFowT21GamRHbHZiajRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbWx1YzNSaGJtTmxTVVErZUcxd0xtbHBaRHBqTldaak5HUm1NaTA1TVdOakxXVXlOREV0T0dObFl5MHpNemd5TW1Oa05XVmhaVGs4TDNOMFJYWjBPbWx1YzNSaGJtTmxTVVErQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHAzYUdWdVBqSXdNVFl0TURrdE1qaFVNVFk2TWpVNk16SXRNRGM2TURBOEwzTjBSWFowT25kb1pXNCtDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUGtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBeU1ERTFMalVnS0ZkcGJtUnZkM01wUEM5emRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzSmtaanBzYVQ0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhKa1pqcHNhU0J5WkdZNmNHRnljMlZVZVhCbFBTSlNaWE52ZFhKalpTSStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcGhZM1JwYjI0K1kyOXVkbVZ5ZEdWa1BDOXpkRVYyZERwaFkzUnBiMjQrQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHB3WVhKaGJXVjBaWEp6UG1aeWIyMGdZWEJ3YkdsallYUnBiMjR2ZG01a0xtRmtiMkpsTG5Cb2IzUnZjMmh2Y0NCMGJ5QnBiV0ZuWlM5d2JtYzhMM04wUlhaME9uQmhjbUZ0WlhSbGNuTStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjbVJtT214cFBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGNtUm1PbXhwSUhKa1pqcHdZWEp6WlZSNWNHVTlJbEpsYzI5MWNtTmxJajRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbUZqZEdsdmJqNXpZWFpsWkR3dmMzUkZkblE2WVdOMGFXOXVQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDU0YlhBdWFXbGtPbUZoWVRGak1UUXpMVFV3Wm1VdE9UUTBNeTFoTlRobUxXRXlNMlZrTlRNM01EZG1NRHd2YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbmRvWlc0K01qQXhOaTB3T1MweU9GUXhOam96TnpveU15MHdOem93TUR3dmMzUkZkblE2ZDJobGJqNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblErUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESURJd01UVXVOU0FvVjJsdVpHOTNjeWs4TDNOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwamFHRnVaMlZrUGk4OEwzTjBSWFowT21Ob1lXNW5aV1ErQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Y21SbU9teHBQZ29nSUNBZ0lDQWdJQ0FnSUNBOEwzSmtaanBUWlhFK0NpQWdJQ0FnSUNBZ0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VDNKcFpXNTBZWFJwYjI0K01Ud3ZkR2xtWmpwUGNtbGxiblJoZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldGSmxjMjlzZFhScGIyNCtNekF3TURBd01DOHhNREF3TUR3dmRHbG1aanBZVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2V1ZKbGMyOXNkWFJwYjI0K016QXdNREF3TUM4eE1EQXdNRHd2ZEdsbVpqcFpVbVZ6YjJ4MWRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZVbVZ6YjJ4MWRHbHZibFZ1YVhRK01qd3ZkR2xtWmpwU1pYTnZiSFYwYVc5dVZXNXBkRDRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZRMjlzYjNKVGNHRmpaVDR4UEM5bGVHbG1Pa052Ykc5eVUzQmhZMlUrQ2lBZ0lDQWdJQ0FnSUR4bGVHbG1PbEJwZUdWc1dFUnBiV1Z1YzJsdmJqNDJORHd2WlhocFpqcFFhWGhsYkZoRWFXMWxibk5wYjI0K0NpQWdJQ0FnSUNBZ0lEeGxlR2xtT2xCcGVHVnNXVVJwYldWdWMybHZiajR6TWp3dlpYaHBaanBRYVhobGJGbEVhVzFsYm5OcGIyNCtDaUFnSUNBZ0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBnb2dJQ0E4TDNKa1pqcFNSRVkrQ2p3dmVEcDRiWEJ0WlhSaFBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvOFAzaHdZV05yWlhRZ1pXNWtQU0ozSWo4K09oRjdSd0FBQUNCalNGSk5BQUI2SlFBQWdJTUFBUG4vQUFDQTZRQUFkVEFBQU9wZ0FBQTZtQUFBRjIrU1g4VkdBQUFBbEVsRVFWUjQydXpac1EzQUlBeEVVVHVUWkpSc2t0NUxSRm1DZFRMYXBVS0NCaWpvL0YwaG4yU2tKeElLWEpKbHJzT1NGd0FBQUFCQTZ2S0k2TzdCVW9yWGRadTEvVkVXRVplWmZiTjVtL1phbWpmSytBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFDQmZ1YVNuYTdpL2RkMW1iWCtVU1RyTjdKN04yN1RYMHJ4UnhnbmdaWWlmSUFBQUFKQzRmZ0FBQVAvL0F3QXVNVlB3MjBoeEN3QUFBQUJKUlU1RXJrSmdnZz09YDtcclxuXHJcbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XHJcbiAgdGV4dHVyZS5pbWFnZSA9IGltYWdlO1xyXG4gIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gIC8vIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyO1xyXG4gIC8vIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xyXG4gIC8vIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcclxuICAgIC8vIGNvbG9yOiAweGZmMDAwMCxcclxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIG1hcDogdGV4dHVyZVxyXG4gIH0pO1xyXG4gIG1hdGVyaWFsLmFscGhhVGVzdCA9IDAuMDE7XHJcblxyXG4gIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoIGltYWdlLndpZHRoIC8gMTAwMCwgaW1hZ2UuaGVpZ2h0IC8gMTAwMCwgMSwgMSApO1xyXG5cclxuICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xyXG4gIHJldHVybiBtZXNoO1xyXG59XHJcblxyXG4iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcclxuaW1wb3J0IGNyZWF0ZVNsaWRlciBmcm9tICcuL3NsaWRlcic7XHJcbmltcG9ydCBjcmVhdGVDaGVja2JveCBmcm9tICcuL2NoZWNrYm94JztcclxuaW1wb3J0IGNyZWF0ZUJ1dHRvbiBmcm9tICcuL2J1dHRvbic7XHJcbmltcG9ydCBjcmVhdGVGb2xkZXIgZnJvbSAnLi9mb2xkZXInO1xyXG5pbXBvcnQgY3JlYXRlRHJvcGRvd24gZnJvbSAnLi9kcm9wZG93bic7XHJcbmltcG9ydCAqIGFzIFNERlRleHQgZnJvbSAnLi9zZGZ0ZXh0JztcclxuaW1wb3J0ICogYXMgRm9udCBmcm9tICcuL2ZvbnQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gREFUR1VJVlIoKXtcclxuXHJcbiAgLypcclxuICAgIFNERiBmb250XHJcbiAgKi9cclxuICBjb25zdCB0ZXh0Q3JlYXRvciA9IFNERlRleHQuY3JlYXRvcigpO1xyXG5cclxuXHJcbiAgLypcclxuICAgIExpc3RzLlxyXG4gICAgSW5wdXRPYmplY3RzIGFyZSB0aGluZ3MgbGlrZSBWSVZFIGNvbnRyb2xsZXJzLCBjYXJkYm9hcmQgaGVhZHNldHMsIGV0Yy5cclxuICAgIENvbnRyb2xsZXJzIGFyZSB0aGUgREFUIEdVSSBzbGlkZXJzLCBjaGVja2JveGVzLCBldGMuXHJcbiAgICBIaXRzY2FuT2JqZWN0cyBhcmUgYW55dGhpbmcgcmF5Y2FzdHMgd2lsbCBoaXQtdGVzdCBhZ2FpbnN0LlxyXG4gICovXHJcbiAgY29uc3QgaW5wdXRPYmplY3RzID0gW107XHJcbiAgY29uc3QgY29udHJvbGxlcnMgPSBbXTtcclxuICBjb25zdCBoaXRzY2FuT2JqZWN0cyA9IFtdO1xyXG5cclxuICBsZXQgbW91c2VFbmFibGVkID0gZmFsc2U7XHJcblxyXG4gIGZ1bmN0aW9uIHNldE1vdXNlRW5hYmxlZCggZmxhZyApe1xyXG4gICAgbW91c2VFbmFibGVkID0gZmxhZztcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBUaGUgZGVmYXVsdCBsYXNlciBwb2ludGVyIGNvbWluZyBvdXQgb2YgZWFjaCBJbnB1dE9iamVjdC5cclxuICAqL1xyXG4gIGNvbnN0IGxhc2VyTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4NTVhYWZmLCB0cmFuc3BhcmVudDogdHJ1ZSwgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcgfSk7XHJcbiAgZnVuY3Rpb24gY3JlYXRlTGFzZXIoKXtcclxuICAgIGNvbnN0IGcgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuICAgIGcudmVydGljZXMucHVzaCggbmV3IFRIUkVFLlZlY3RvcjMoKSApO1xyXG4gICAgZy52ZXJ0aWNlcy5wdXNoKCBuZXcgVEhSRUUuVmVjdG9yMygwLDAsMCkgKTtcclxuICAgIHJldHVybiBuZXcgVEhSRUUuTGluZSggZywgbGFzZXJNYXRlcmlhbCApO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBBIFwiY3Vyc29yXCIsIGVnIHRoZSBiYWxsIHRoYXQgYXBwZWFycyBhdCB0aGUgZW5kIG9mIHlvdXIgbGFzZXIuXHJcbiAgKi9cclxuICBjb25zdCBjdXJzb3JNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6MHg0NDQ0NDQsIHRyYW5zcGFyZW50OiB0cnVlLCBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyB9ICk7XHJcbiAgZnVuY3Rpb24gY3JlYXRlQ3Vyc29yKCl7XHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjAwNiwgNCwgNCApLCBjdXJzb3JNYXRlcmlhbCApO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIENyZWF0ZXMgYSBnZW5lcmljIElucHV0IHR5cGUuXHJcbiAgICBUYWtlcyBhbnkgVEhSRUUuT2JqZWN0M0QgdHlwZSBvYmplY3QgYW5kIHVzZXMgaXRzIHBvc2l0aW9uXHJcbiAgICBhbmQgb3JpZW50YXRpb24gYXMgYW4gaW5wdXQgZGV2aWNlLlxyXG5cclxuICAgIEEgbGFzZXIgcG9pbnRlciBpcyBpbmNsdWRlZCBhbmQgd2lsbCBiZSB1cGRhdGVkLlxyXG4gICAgQ29udGFpbnMgc3RhdGUgYWJvdXQgd2hpY2ggSW50ZXJhY3Rpb24gaXMgY3VycmVudGx5IGJlaW5nIHVzZWQgb3IgaG92ZXIuXHJcbiAgKi9cclxuICBmdW5jdGlvbiBjcmVhdGVJbnB1dCggaW5wdXRPYmplY3QgPSBuZXcgVEhSRUUuR3JvdXAoKSApe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmF5Y2FzdDogbmV3IFRIUkVFLlJheWNhc3RlciggbmV3IFRIUkVFLlZlY3RvcjMoKSwgbmV3IFRIUkVFLlZlY3RvcjMoKSApLFxyXG4gICAgICBsYXNlcjogY3JlYXRlTGFzZXIoKSxcclxuICAgICAgY3Vyc29yOiBjcmVhdGVDdXJzb3IoKSxcclxuICAgICAgb2JqZWN0OiBpbnB1dE9iamVjdCxcclxuICAgICAgcHJlc3NlZDogZmFsc2UsXHJcbiAgICAgIGdyaXBwZWQ6IGZhbHNlLFxyXG4gICAgICBldmVudHM6IG5ldyBFbWl0dGVyKCksXHJcbiAgICAgIGludGVyYWN0aW9uOiB7XHJcbiAgICAgICAgZ3JpcDogdW5kZWZpbmVkLFxyXG4gICAgICAgIHByZXNzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgaG92ZXI6IHVuZGVmaW5lZFxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBNb3VzZUlucHV0IGlzIGEgc3BlY2lhbCBpbnB1dCB0eXBlIHRoYXQgaXMgb24gYnkgZGVmYXVsdC5cclxuICAgIEFsbG93cyB5b3UgdG8gY2xpY2sgb24gdGhlIHNjcmVlbiB3aGVuIG5vdCBpbiBWUiBmb3IgZGVidWdnaW5nLlxyXG4gICovXHJcbiAgY29uc3QgbW91c2VJbnB1dCA9IGNyZWF0ZU1vdXNlSW5wdXQoKTtcclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlTW91c2VJbnB1dCgpe1xyXG4gICAgY29uc3QgbW91c2UgPSBuZXcgVEhSRUUuVmVjdG9yMigtMSwtMSk7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBmdW5jdGlvbiggZXZlbnQgKXtcclxuICAgICAgbW91c2UueCA9ICggZXZlbnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoICkgKiAyIC0gMTtcclxuICAgICAgbW91c2UueSA9IC0gKCBldmVudC5jbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0ICkgKiAyICsgMTtcclxuICAgIH0sIGZhbHNlICk7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBmdW5jdGlvbiggZXZlbnQgKXtcclxuICAgICAgaW5wdXQucHJlc3NlZCA9IHRydWU7XHJcbiAgICB9LCBmYWxzZSApO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIGZ1bmN0aW9uKCBldmVudCApe1xyXG4gICAgICBpbnB1dC5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICB9LCBmYWxzZSApO1xyXG5cclxuICAgIGNvbnN0IGlucHV0ID0gY3JlYXRlSW5wdXQoKTtcclxuICAgIGlucHV0Lm1vdXNlID0gbW91c2U7XHJcbiAgICByZXR1cm4gaW5wdXQ7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIFB1YmxpYyBmdW5jdGlvbiB1c2VycyBydW4gdG8gZ2l2ZSBEQVQgR1VJIGFuIGlucHV0IGRldmljZS5cclxuICAgIEF1dG9tYXRpY2FsbHkgZGV0ZWN0cyBmb3IgVml2ZUNvbnRyb2xsZXIgYW5kIGJpbmRzIGJ1dHRvbnMgKyBoYXB0aWMgZmVlZGJhY2suXHJcblxyXG4gICAgUmV0dXJucyBhIGxhc2VyIHBvaW50ZXIgc28gaXQgY2FuIGJlIGRpcmVjdGx5IGFkZGVkIHRvIHNjZW5lLlxyXG5cclxuICAgIFRoZSBsYXNlciB3aWxsIHRoZW4gaGF2ZSB0d28gbWV0aG9kczpcclxuICAgIGxhc2VyLnByZXNzZWQoKSwgbGFzZXIuZ3JpcHBlZCgpXHJcblxyXG4gICAgVGhlc2UgY2FuIHRoZW4gYmUgYm91bmQgdG8gYW55IGJ1dHRvbiB0aGUgdXNlciB3YW50cy4gVXNlZnVsIGZvciBiaW5kaW5nIHRvXHJcbiAgICBjYXJkYm9hcmQgb3IgYWx0ZXJuYXRlIGlucHV0IGRldmljZXMuXHJcblxyXG4gICAgRm9yIGV4YW1wbGUuLi5cclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGZ1bmN0aW9uKCl7IGxhc2VyLnByZXNzZWQoIHRydWUgKTsgfSApO1xyXG4gICovXHJcbiAgZnVuY3Rpb24gYWRkSW5wdXRPYmplY3QoIG9iamVjdCApe1xyXG4gICAgY29uc3QgaW5wdXQgPSBjcmVhdGVJbnB1dCggb2JqZWN0ICk7XHJcblxyXG4gICAgaW5wdXQubGFzZXIuYWRkKCBpbnB1dC5jdXJzb3IgKTtcclxuXHJcbiAgICBpbnB1dC5sYXNlci5wcmVzc2VkID0gZnVuY3Rpb24oIGZsYWcgKXtcclxuICAgICAgaW5wdXQucHJlc3NlZCA9IGZsYWc7XHJcbiAgICB9O1xyXG5cclxuICAgIGlucHV0Lmxhc2VyLmdyaXBwZWQgPSBmdW5jdGlvbiggZmxhZyApe1xyXG4gICAgICBpbnB1dC5ncmlwcGVkID0gZmxhZztcclxuICAgIH07XHJcblxyXG4gICAgaW5wdXQubGFzZXIuY3Vyc29yID0gaW5wdXQuY3Vyc29yO1xyXG5cclxuICAgIGlmKCBUSFJFRS5WaXZlQ29udHJvbGxlciAmJiBvYmplY3QgaW5zdGFuY2VvZiBUSFJFRS5WaXZlQ29udHJvbGxlciApe1xyXG4gICAgICBiaW5kVml2ZUNvbnRyb2xsZXIoIGlucHV0LCBvYmplY3QsIGlucHV0Lmxhc2VyLnByZXNzZWQsIGlucHV0Lmxhc2VyLmdyaXBwZWQgKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnB1dE9iamVjdHMucHVzaCggaW5wdXQgKTtcclxuXHJcbiAgICByZXR1cm4gaW5wdXQubGFzZXI7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgSGVyZSBhcmUgdGhlIG1haW4gZGF0IGd1aSBjb250cm9sbGVyIHR5cGVzLlxyXG4gICovXHJcblxyXG4gIGZ1bmN0aW9uIGFkZFNsaWRlciggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG1pbiA9IDAuMCwgbWF4ID0gMTAwLjAgKXtcclxuICAgIGNvbnN0IHNsaWRlciA9IGNyZWF0ZVNsaWRlcigge1xyXG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsIG1pbiwgbWF4LFxyXG4gICAgICBpbml0aWFsVmFsdWU6IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIHNsaWRlciApO1xyXG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uc2xpZGVyLmhpdHNjYW4gKVxyXG5cclxuICAgIHJldHVybiBzbGlkZXI7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRDaGVja2JveCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKXtcclxuICAgIGNvbnN0IGNoZWNrYm94ID0gY3JlYXRlQ2hlY2tib3goe1xyXG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsXHJcbiAgICAgIGluaXRpYWxWYWx1ZTogb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggY2hlY2tib3ggKTtcclxuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmNoZWNrYm94LmhpdHNjYW4gKVxyXG5cclxuICAgIHJldHVybiBjaGVja2JveDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZEJ1dHRvbiggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKXtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGNyZWF0ZUJ1dHRvbih7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggYnV0dG9uICk7XHJcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5idXR0b24uaGl0c2NhbiApO1xyXG4gICAgcmV0dXJuIGJ1dHRvbjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZERyb3Bkb3duKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgb3B0aW9ucyApe1xyXG4gICAgY29uc3QgZHJvcGRvd24gPSBjcmVhdGVEcm9wZG93bih7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCwgb3B0aW9uc1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggZHJvcGRvd24gKTtcclxuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmRyb3Bkb3duLmhpdHNjYW4gKTtcclxuICAgIHJldHVybiBkcm9wZG93bjtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgQW4gaW1wbGljaXQgQWRkIGZ1bmN0aW9uIHdoaWNoIGRldGVjdHMgZm9yIHByb3BlcnR5IHR5cGVcclxuICAgIGFuZCBnaXZlcyB5b3UgdGhlIGNvcnJlY3QgY29udHJvbGxlci5cclxuXHJcbiAgICBEcm9wZG93bjpcclxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgb2JqZWN0VHlwZSApXHJcblxyXG4gICAgU2xpZGVyOlxyXG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlPZk51bWJlclR5cGUsIG1pbiwgbWF4IClcclxuXHJcbiAgICBDaGVja2JveDpcclxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZCb29sZWFuVHlwZSApXHJcblxyXG4gICAgQnV0dG9uOlxyXG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlPZkZ1bmN0aW9uVHlwZSApXHJcbiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gYWRkKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMywgYXJnNCApe1xyXG5cclxuICAgIGlmKCBvYmplY3QgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICBjb25zb2xlLndhcm4oICdvYmplY3QgaXMgdW5kZWZpbmVkJyApO1xyXG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICBpZiggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIGNvbnNvbGUud2FybiggJ25vIHByb3BlcnR5IG5hbWVkJywgcHJvcGVydHlOYW1lLCAnb24gb2JqZWN0Jywgb2JqZWN0ICk7XHJcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaXNPYmplY3QoIGFyZzMgKSB8fCBpc0FycmF5KCBhcmczICkgKXtcclxuICAgICAgcmV0dXJuIGFkZERyb3Bkb3duKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMyApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc051bWJlciggb2JqZWN0WyBwcm9wZXJ0eU5hbWVdICkgKXtcclxuICAgICAgcmV0dXJuIGFkZFNsaWRlciggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMsIGFyZzQgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaXNCb29sZWFuKCBvYmplY3RbIHByb3BlcnR5TmFtZV0gKSApe1xyXG4gICAgICByZXR1cm4gYWRkQ2hlY2tib3goIG9iamVjdCwgcHJvcGVydHlOYW1lICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlzRnVuY3Rpb24oIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKSApe1xyXG4gICAgICByZXR1cm4gYWRkQnV0dG9uKCBvYmplY3QsIHByb3BlcnR5TmFtZSApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICBhZGQgY291bGRuJ3QgZmlndXJlIGl0IG91dCwgc28gYXQgbGVhc3QgYWRkIHNvbWV0aGluZyBUSFJFRSB1bmRlcnN0YW5kc1xyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIENyZWF0ZXMgYSBmb2xkZXIgd2l0aCB0aGUgbmFtZS5cclxuXHJcbiAgICBGb2xkZXJzIGFyZSBUSFJFRS5Hcm91cCB0eXBlIG9iamVjdHMgYW5kIGNhbiBkbyBncm91cC5hZGQoKSBmb3Igc2libGluZ3MuXHJcbiAgICBGb2xkZXJzIHdpbGwgYXV0b21hdGljYWxseSBhdHRlbXB0IHRvIGxheSBpdHMgY2hpbGRyZW4gb3V0IGluIHNlcXVlbmNlLlxyXG4gICovXHJcblxyXG4gIGZ1bmN0aW9uIGFkZEZvbGRlciggbmFtZSApe1xyXG4gICAgY29uc3QgZm9sZGVyID0gY3JlYXRlRm9sZGVyKHtcclxuICAgICAgdGV4dENyZWF0b3IsXHJcbiAgICAgIG5hbWVcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGZvbGRlciApO1xyXG4gICAgaWYoIGZvbGRlci5oaXRzY2FuICl7XHJcbiAgICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmZvbGRlci5oaXRzY2FuICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZvbGRlcjtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgUGVyZm9ybSB0aGUgbmVjZXNzYXJ5IHVwZGF0ZXMsIHJheWNhc3RzIG9uIGl0cyBvd24gUkFGLlxyXG4gICovXHJcblxyXG4gIGNvbnN0IHRQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgY29uc3QgdERpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCAwLCAwLCAtMSApO1xyXG4gIGNvbnN0IHRNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHVwZGF0ZSApO1xyXG5cclxuICAgIGlmKCBtb3VzZUVuYWJsZWQgKXtcclxuICAgICAgbW91c2VJbnB1dC5pbnRlcnNlY3Rpb25zID0gcGVyZm9ybU1vdXNlSW5wdXQoIGhpdHNjYW5PYmplY3RzLCBtb3VzZUlucHV0ICk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCB7Ym94LG9iamVjdCxyYXljYXN0LGxhc2VyLGN1cnNvcn0gPSB7fSwgaW5kZXggKXtcclxuICAgICAgb2JqZWN0LnVwZGF0ZU1hdHJpeFdvcmxkKCk7XHJcblxyXG4gICAgICB0UG9zaXRpb24uc2V0KDAsMCwwKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIG9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG4gICAgICB0TWF0cml4LmlkZW50aXR5KCkuZXh0cmFjdFJvdGF0aW9uKCBvYmplY3QubWF0cml4V29ybGQgKTtcclxuICAgICAgdERpcmVjdGlvbi5zZXQoMCwwLC0xKS5hcHBseU1hdHJpeDQoIHRNYXRyaXggKS5ub3JtYWxpemUoKTtcclxuXHJcbiAgICAgIHJheWNhc3Quc2V0KCB0UG9zaXRpb24sIHREaXJlY3Rpb24gKTtcclxuXHJcbiAgICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzWyAwIF0uY29weSggdFBvc2l0aW9uICk7XHJcblxyXG4gICAgICAvLyAgZGVidWcuLi5cclxuICAgICAgLy8gbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDEgXS5jb3B5KCB0UG9zaXRpb24gKS5hZGQoIHREaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoIDEgKSApO1xyXG5cclxuICAgICAgY29uc3QgaW50ZXJzZWN0aW9ucyA9IHJheWNhc3QuaW50ZXJzZWN0T2JqZWN0cyggaGl0c2Nhbk9iamVjdHMsIGZhbHNlICk7XHJcbiAgICAgIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApO1xyXG5cclxuICAgICAgaW5wdXRPYmplY3RzWyBpbmRleCBdLmludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgaW5wdXRzID0gaW5wdXRPYmplY3RzLnNsaWNlKCk7XHJcblxyXG4gICAgaWYoIG1vdXNlRW5hYmxlZCApe1xyXG4gICAgICBpbnB1dHMucHVzaCggbW91c2VJbnB1dCApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goIGZ1bmN0aW9uKCBjb250cm9sbGVyICl7XHJcbiAgICAgIGNvbnRyb2xsZXIudXBkYXRlKCBpbnB1dHMgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICl7XHJcbiAgICBpZiggaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwICl7XHJcbiAgICAgIGNvbnN0IGZpcnN0SGl0ID0gaW50ZXJzZWN0aW9uc1sgMCBdO1xyXG4gICAgICBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc1sgMSBdLmNvcHkoIGZpcnN0SGl0LnBvaW50ICk7XHJcbiAgICAgIGxhc2VyLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICBsYXNlci5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTtcclxuICAgICAgbGFzZXIuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XHJcbiAgICAgIGN1cnNvci5wb3NpdGlvbi5jb3B5KCBmaXJzdEhpdC5wb2ludCApO1xyXG4gICAgICBjdXJzb3IudmlzaWJsZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBsYXNlci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgIGN1cnNvci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwZXJmb3JtTW91c2VJbnB1dCggaGl0c2Nhbk9iamVjdHMsIHtib3gsb2JqZWN0LHJheWNhc3QsbGFzZXIsY3Vyc29yLG1vdXNlfSA9IHt9ICl7XHJcbiAgICByYXljYXN0LnNldEZyb21DYW1lcmEoIG1vdXNlLCBjYW1lcmEgKTtcclxuICAgIGNvbnN0IGludGVyc2VjdGlvbnMgPSByYXljYXN0LmludGVyc2VjdE9iamVjdHMoIGhpdHNjYW5PYmplY3RzLCBmYWxzZSApO1xyXG4gICAgcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICk7XHJcbiAgICByZXR1cm4gaW50ZXJzZWN0aW9ucztcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIFB1YmxpYyBtZXRob2RzLlxyXG4gICovXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBhZGRJbnB1dE9iamVjdCxcclxuICAgIGFkZCxcclxuICAgIGFkZEZvbGRlcixcclxuICAgIHNldE1vdXNlRW5hYmxlZFxyXG4gIH07XHJcblxyXG59XHJcblxyXG5cclxuXHJcbi8qXHJcbiAgU2V0IHRvIGdsb2JhbCBzY29wZSBpZiBleHBvcnRpbmcgYXMgYSBzdGFuZGFsb25lLlxyXG4qL1xyXG5cclxuaWYoIHdpbmRvdyApe1xyXG4gIHdpbmRvdy5EQVRHVUlWUiA9IERBVEdVSVZSO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gIEJ1bmNoIG9mIHN0YXRlLWxlc3MgdXRpbGl0eSBmdW5jdGlvbnMuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBpc051bWJlcihuKSB7XHJcbiAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNCb29sZWFuKG4pe1xyXG4gIHJldHVybiB0eXBlb2YgbiA9PT0gJ2Jvb2xlYW4nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGZ1bmN0aW9uVG9DaGVjaykge1xyXG4gIGNvbnN0IGdldFR5cGUgPSB7fTtcclxuICByZXR1cm4gZnVuY3Rpb25Ub0NoZWNrICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbChmdW5jdGlvblRvQ2hlY2spID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG59XHJcblxyXG4vLyAgb25seSB7fSBvYmplY3RzIG5vdCBhcnJheXNcclxuLy8gICAgICAgICAgICAgICAgICAgIHdoaWNoIGFyZSB0ZWNobmljYWxseSBvYmplY3RzIGJ1dCB5b3UncmUganVzdCBiZWluZyBwZWRhbnRpY1xyXG5mdW5jdGlvbiBpc09iamVjdCAoaXRlbSkge1xyXG4gIHJldHVybiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0gIT09IG51bGwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0FycmF5KCBvICl7XHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoIG8gKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICBDb250cm9sbGVyLXNwZWNpZmljIHN1cHBvcnQuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBiaW5kVml2ZUNvbnRyb2xsZXIoIGlucHV0LCBjb250cm9sbGVyLCBwcmVzc2VkLCBncmlwcGVkICl7XHJcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAndHJpZ2dlcmRvd24nLCAoKT0+cHJlc3NlZCggdHJ1ZSApICk7XHJcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAndHJpZ2dlcnVwJywgKCk9PnByZXNzZWQoIGZhbHNlICkgKTtcclxuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICdncmlwc2Rvd24nLCAoKT0+Z3JpcHBlZCggdHJ1ZSApICk7XHJcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAnZ3JpcHN1cCcsICgpPT5ncmlwcGVkKCBmYWxzZSApICk7XHJcblxyXG4gIGNvbnN0IGdhbWVwYWQgPSBjb250cm9sbGVyLmdldEdhbWVwYWQoKTtcclxuICBmdW5jdGlvbiB2aWJyYXRlKCB0LCBhICl7XHJcbiAgICBpZiggZ2FtZXBhZCAmJiBnYW1lcGFkLmhhcHRpY3MubGVuZ3RoID4gMCApe1xyXG4gICAgICBnYW1lcGFkLmhhcHRpY3NbIDAgXS52aWJyYXRlKCB0LCBhICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYXB0aWNzVGFwKCl7XHJcbiAgICBzZXRJbnRlcnZhbFRpbWVzKCAoeCx0LGEpPT52aWJyYXRlKDEtYSwgMC41KSwgMTAsIDIwICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYXB0aWNzRWNobygpe1xyXG4gICAgc2V0SW50ZXJ2YWxUaW1lcyggKHgsdCxhKT0+dmlicmF0ZSg0LCAxLjAgKiAoMS1hKSksIDEwMCwgNCApO1xyXG4gIH1cclxuXHJcbiAgaW5wdXQuZXZlbnRzLm9uKCAnb25Db250cm9sbGVySGVsZCcsIGZ1bmN0aW9uKCBpbnB1dCApe1xyXG4gICAgdmlicmF0ZSggMC4zLCAwLjMgKTtcclxuICB9KTtcclxuXHJcbiAgaW5wdXQuZXZlbnRzLm9uKCAnZ3JhYmJlZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBoYXB0aWNzVGFwKCk7XHJcbiAgfSk7XHJcblxyXG4gIGlucHV0LmV2ZW50cy5vbiggJ2dyYWJSZWxlYXNlZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBoYXB0aWNzRWNobygpO1xyXG4gIH0pO1xyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdwaW5uZWQnLCBmdW5jdGlvbigpe1xyXG4gICAgaGFwdGljc1RhcCgpO1xyXG4gIH0pO1xyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdwaW5SZWxlYXNlZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBoYXB0aWNzRWNobygpO1xyXG4gIH0pO1xyXG5cclxuXHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRJbnRlcnZhbFRpbWVzKCBjYiwgZGVsYXksIHRpbWVzICl7XHJcbiAgbGV0IHggPSAwO1xyXG4gIGxldCBpZCA9IHNldEludGVydmFsKCBmdW5jdGlvbigpe1xyXG4gICAgY2IoIHgsIHRpbWVzLCB4L3RpbWVzICk7XHJcbiAgICB4Kys7XHJcbiAgICBpZiggeD49dGltZXMgKXtcclxuICAgICAgY2xlYXJJbnRlcnZhbCggaWQgKTtcclxuICAgIH1cclxuICB9LCBkZWxheSApO1xyXG4gIHJldHVybiBpZDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcbmltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJbnRlcmFjdGlvbiggaGl0Vm9sdW1lICl7XHJcbiAgY29uc3QgZXZlbnRzID0gbmV3IEVtaXR0ZXIoKTtcclxuXHJcbiAgbGV0IGFueUhvdmVyID0gZmFsc2U7XHJcbiAgbGV0IGFueVByZXNzaW5nID0gZmFsc2U7XHJcblxyXG4gIGxldCBob3ZlciA9IGZhbHNlO1xyXG4gIGxldCBhbnlBY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgdFZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgY29uc3QgYXZhaWxhYmxlSW5wdXRzID0gW107XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZSggaW5wdXRPYmplY3RzICl7XHJcblxyXG4gICAgaG92ZXIgPSBmYWxzZTtcclxuICAgIGFueVByZXNzaW5nID0gZmFsc2U7XHJcbiAgICBhbnlBY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICBpbnB1dE9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24oIGlucHV0ICl7XHJcblxyXG4gICAgICBpZiggYXZhaWxhYmxlSW5wdXRzLmluZGV4T2YoIGlucHV0ICkgPCAwICl7XHJcbiAgICAgICAgYXZhaWxhYmxlSW5wdXRzLnB1c2goIGlucHV0ICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHsgaGl0T2JqZWN0LCBoaXRQb2ludCB9ID0gZXh0cmFjdEhpdCggaW5wdXQgKTtcclxuXHJcbiAgICAgIGhvdmVyID0gaG92ZXIgfHwgaGl0Vm9sdW1lID09PSBoaXRPYmplY3Q7XHJcblxyXG4gICAgICBwZXJmb3JtU3RhdGVFdmVudHMoe1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhvdmVyLFxyXG4gICAgICAgIGhpdE9iamVjdCwgaGl0UG9pbnQsXHJcbiAgICAgICAgYnV0dG9uTmFtZTogJ3ByZXNzZWQnLFxyXG4gICAgICAgIGludGVyYWN0aW9uTmFtZTogJ3ByZXNzJyxcclxuICAgICAgICBkb3duTmFtZTogJ29uUHJlc3NlZCcsXHJcbiAgICAgICAgaG9sZE5hbWU6ICdwcmVzc2luZycsXHJcbiAgICAgICAgdXBOYW1lOiAnb25SZWxlYXNlZCdcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBwZXJmb3JtU3RhdGVFdmVudHMoe1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhvdmVyLFxyXG4gICAgICAgIGhpdE9iamVjdCwgaGl0UG9pbnQsXHJcbiAgICAgICAgYnV0dG9uTmFtZTogJ2dyaXBwZWQnLFxyXG4gICAgICAgIGludGVyYWN0aW9uTmFtZTogJ2dyaXAnLFxyXG4gICAgICAgIGRvd25OYW1lOiAnb25HcmlwcGVkJyxcclxuICAgICAgICBob2xkTmFtZTogJ2dyaXBwaW5nJyxcclxuICAgICAgICB1cE5hbWU6ICdvblJlbGVhc2VHcmlwJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBleHRyYWN0SGl0KCBpbnB1dCApe1xyXG4gICAgaWYoIGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoIDw9IDAgKXtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBoaXRQb2ludDogdFZlY3Rvci5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGlucHV0LmN1cnNvci5tYXRyaXhXb3JsZCApLmNsb25lKCksXHJcbiAgICAgICAgaGl0T2JqZWN0OiB1bmRlZmluZWQsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGhpdFBvaW50OiBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ucG9pbnQsXHJcbiAgICAgICAgaGl0T2JqZWN0OiBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ub2JqZWN0XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwZXJmb3JtU3RhdGVFdmVudHMoe1xyXG4gICAgaW5wdXQsIGhvdmVyLFxyXG4gICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcclxuICAgIGJ1dHRvbk5hbWUsIGludGVyYWN0aW9uTmFtZSwgZG93bk5hbWUsIGhvbGROYW1lLCB1cE5hbWVcclxuICB9ID0ge30gKXtcclxuXHJcbiAgICBpZiggaW5wdXRbIGJ1dHRvbk5hbWUgXSA9PT0gdHJ1ZSAmJiBoaXRPYmplY3QgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gIGhvdmVyaW5nIGFuZCBidXR0b24gZG93biBidXQgbm8gaW50ZXJhY3Rpb25zIGFjdGl2ZSB5ZXRcclxuICAgIGlmKCBob3ZlciAmJiBpbnB1dFsgYnV0dG9uTmFtZSBdID09PSB0cnVlICYmIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9PT0gdW5kZWZpbmVkICl7XHJcblxyXG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdCxcclxuICAgICAgICBsb2NrZWQ6IGZhbHNlXHJcbiAgICAgIH07XHJcbiAgICAgIGV2ZW50cy5lbWl0KCBkb3duTmFtZSwgcGF5bG9hZCApO1xyXG5cclxuICAgICAgaWYoIHBheWxvYWQubG9ja2VkICl7XHJcbiAgICAgICAgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID0gaW50ZXJhY3Rpb247XHJcbiAgICAgICAgaW5wdXQuaW50ZXJhY3Rpb24uaG92ZXIgPSBpbnRlcmFjdGlvbjtcclxuICAgICAgfVxyXG5cclxuICAgICAgYW55UHJlc3NpbmcgPSB0cnVlO1xyXG4gICAgICBhbnlBY3RpdmUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICBidXR0b24gc3RpbGwgZG93biBhbmQgdGhpcyBpcyB0aGUgYWN0aXZlIGludGVyYWN0aW9uXHJcbiAgICBpZiggaW5wdXRbIGJ1dHRvbk5hbWUgXSAmJiBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPT09IGludGVyYWN0aW9uICl7XHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaGl0T2JqZWN0LFxyXG4gICAgICAgIHBvaW50OiBoaXRQb2ludCxcclxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0LFxyXG4gICAgICAgIGxvY2tlZDogZmFsc2VcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGV2ZW50cy5lbWl0KCBob2xkTmFtZSwgcGF5bG9hZCApO1xyXG5cclxuICAgICAgYW55UHJlc3NpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgaW5wdXQuZXZlbnRzLmVtaXQoICdvbkNvbnRyb2xsZXJIZWxkJyApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICBidXR0b24gbm90IGRvd24gYW5kIHRoaXMgaXMgdGhlIGFjdGl2ZSBpbnRlcmFjdGlvblxyXG4gICAgaWYoIGlucHV0WyBidXR0b25OYW1lIF0gPT09IGZhbHNlICYmIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9PT0gaW50ZXJhY3Rpb24gKXtcclxuICAgICAgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID0gdW5kZWZpbmVkO1xyXG4gICAgICBpbnB1dC5pbnRlcmFjdGlvbi5ob3ZlciA9IHVuZGVmaW5lZDtcclxuICAgICAgZXZlbnRzLmVtaXQoIHVwTmFtZSwge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc01haW5Ib3Zlcigpe1xyXG5cclxuICAgIGxldCBub01haW5Ib3ZlciA9IHRydWU7XHJcbiAgICBmb3IoIGxldCBpPTA7IGk8YXZhaWxhYmxlSW5wdXRzLmxlbmd0aDsgaSsrICl7XHJcbiAgICAgIGlmKCBhdmFpbGFibGVJbnB1dHNbIGkgXS5pbnRlcmFjdGlvbi5ob3ZlciAhPT0gdW5kZWZpbmVkICl7XHJcbiAgICAgICAgbm9NYWluSG92ZXIgPSBmYWxzZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKCBub01haW5Ib3ZlciApe1xyXG4gICAgICByZXR1cm4gaG92ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGF2YWlsYWJsZUlucHV0cy5maWx0ZXIoIGZ1bmN0aW9uKCBpbnB1dCApe1xyXG4gICAgICByZXR1cm4gaW5wdXQuaW50ZXJhY3Rpb24uaG92ZXIgPT09IGludGVyYWN0aW9uO1xyXG4gICAgfSkubGVuZ3RoID4gMCApe1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSB7XHJcbiAgICBob3ZlcmluZzogaXNNYWluSG92ZXIsXHJcbiAgICBwcmVzc2luZzogKCk9PmFueVByZXNzaW5nLFxyXG4gICAgdXBkYXRlLFxyXG4gICAgZXZlbnRzXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGludGVyYWN0aW9uO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWxpZ25MZWZ0KCBvYmogKXtcclxuICBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuTWVzaCApe1xyXG4gICAgb2JqLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gICAgY29uc3Qgd2lkdGggPSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnggLSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4Lnk7XHJcbiAgICBvYmouZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCwgMCwgMCApO1xyXG4gICAgcmV0dXJuIG9iajtcclxuICB9XHJcbiAgZWxzZSBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuR2VvbWV0cnkgKXtcclxuICAgIG9iai5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgIGNvbnN0IHdpZHRoID0gb2JqLmJvdW5kaW5nQm94Lm1heC54IC0gb2JqLmJvdW5kaW5nQm94Lm1heC55O1xyXG4gICAgb2JqLnRyYW5zbGF0ZSggd2lkdGgsIDAsIDAgKTtcclxuICAgIHJldHVybiBvYmo7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICl7XHJcbiAgY29uc3QgcGFuZWwgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApLCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcclxuICBwYW5lbC5nZW9tZXRyeS50cmFuc2xhdGUoIHdpZHRoICogMC41LCAwLCAwICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHBhbmVsLmdlb21ldHJ5LCBDb2xvcnMuREVGQVVMVF9CQUNLICk7XHJcbiAgcmV0dXJuIHBhbmVsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIGNvbG9yICl7XHJcbiAgY29uc3QgcGFuZWwgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBDT05UUk9MTEVSX0lEX1dJRFRILCBoZWlnaHQsIENPTlRST0xMRVJfSURfREVQVEggKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCBDT05UUk9MTEVSX0lEX1dJRFRIICogMC41LCAwLCAwICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHBhbmVsLmdlb21ldHJ5LCBjb2xvciApO1xyXG4gIHJldHVybiBwYW5lbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURvd25BcnJvdygpe1xyXG4gIGNvbnN0IHcgPSAwLjAwOTY7XHJcbiAgY29uc3QgaCA9IDAuMDE2O1xyXG4gIGNvbnN0IHNoID0gbmV3IFRIUkVFLlNoYXBlKCk7XHJcbiAgc2gubW92ZVRvKDAsMCk7XHJcbiAgc2gubGluZVRvKC13LGgpO1xyXG4gIHNoLmxpbmVUbyh3LGgpO1xyXG4gIHNoLmxpbmVUbygwLDApO1xyXG5cclxuICBjb25zdCBnZW8gPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeSggc2ggKTtcclxuICBnZW8udHJhbnNsYXRlKCAwLCAtaCAqIDAuNSwgMCApO1xyXG5cclxuICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIGdlbywgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBQQU5FTF9XSURUSCA9IDEuMDtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX0hFSUdIVCA9IDAuMDg7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9ERVBUSCA9IDAuMDAxO1xyXG5leHBvcnQgY29uc3QgUEFORUxfU1BBQ0lORyA9IDAuMDAyO1xyXG5leHBvcnQgY29uc3QgUEFORUxfTUFSR0lOID0gMC4wMTU7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9MQUJFTF9URVhUX01BUkdJTiA9IDAuMDY7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9WQUxVRV9URVhUX01BUkdJTiA9IDAuMDI7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1dJRFRIID0gMC4wMjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfREVQVEggPSAwLjAwMTtcclxuZXhwb3J0IGNvbnN0IEJVVFRPTl9ERVBUSCA9IDAuMDE7XHJcbmV4cG9ydCBjb25zdCBGT0xERVJfV0lEVEggPSAxLjAyNjtcclxuZXhwb3J0IGNvbnN0IEZPTERFUl9IRUlHSFQgPSAwLjA4O1xyXG5leHBvcnQgY29uc3QgRk9MREVSX0dSQUJfSEVJR0hUID0gMC4wNTEyOyIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ID0ge30gKXtcclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggcGFuZWwgKTtcclxuXHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25HcmlwcGVkJywgaGFuZGxlT25HcmlwICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlR3JpcCcsIGhhbmRsZU9uR3JpcFJlbGVhc2UgKTtcclxuXHJcbiAgbGV0IG9sZFBhcmVudDtcclxuICBsZXQgb2xkUG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gIGxldCBvbGRSb3RhdGlvbiA9IG5ldyBUSFJFRS5FdWxlcigpO1xyXG5cclxuICBjb25zdCByb3RhdGlvbkdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgcm90YXRpb25Hcm91cC5zY2FsZS5zZXQoIDAuMywgMC4zLCAwLjMgKTtcclxuICByb3RhdGlvbkdyb3VwLnBvc2l0aW9uLnNldCggLTAuMDE1LCAwLjAxNSwgMC4wICk7XHJcblxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPbkdyaXAoIHAgKXtcclxuXHJcbiAgICBjb25zdCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9ID0gcDtcclxuXHJcbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBmb2xkZXIuYmVpbmdNb3ZlZCA9PT0gdHJ1ZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2xkUG9zaXRpb24uY29weSggZm9sZGVyLnBvc2l0aW9uICk7XHJcbiAgICBvbGRSb3RhdGlvbi5jb3B5KCBmb2xkZXIucm90YXRpb24gKTtcclxuXHJcbiAgICBmb2xkZXIucG9zaXRpb24uc2V0KCAwLDAsMCApO1xyXG4gICAgZm9sZGVyLnJvdGF0aW9uLnNldCggMCwwLDAgKTtcclxuICAgIGZvbGRlci5yb3RhdGlvbi54ID0gLU1hdGguUEkgKiAwLjU7XHJcblxyXG4gICAgb2xkUGFyZW50ID0gZm9sZGVyLnBhcmVudDtcclxuXHJcbiAgICByb3RhdGlvbkdyb3VwLmFkZCggZm9sZGVyICk7XHJcblxyXG4gICAgaW5wdXRPYmplY3QuYWRkKCByb3RhdGlvbkdyb3VwICk7XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG5cclxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gdHJ1ZTtcclxuXHJcbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ3Bpbm5lZCcsIGlucHV0ICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPbkdyaXBSZWxlYXNlKCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9PXt9ICl7XHJcblxyXG4gICAgY29uc3QgZm9sZGVyID0gZ3JvdXAuZm9sZGVyO1xyXG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggb2xkUGFyZW50ID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBmb2xkZXIuYmVpbmdNb3ZlZCA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG9sZFBhcmVudC5hZGQoIGZvbGRlciApO1xyXG4gICAgb2xkUGFyZW50ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGZvbGRlci5wb3NpdGlvbi5jb3B5KCBvbGRQb3NpdGlvbiApO1xyXG4gICAgZm9sZGVyLnJvdGF0aW9uLmNvcHkoIG9sZFJvdGF0aW9uICk7XHJcblxyXG4gICAgZm9sZGVyLmJlaW5nTW92ZWQgPSBmYWxzZTtcclxuXHJcbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ3BpblJlbGVhc2VkJywgaW5wdXQgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBpbnRlcmFjdGlvbjtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgU0RGU2hhZGVyIGZyb20gJ3RocmVlLWJtZm9udC10ZXh0L3NoYWRlcnMvc2RmJztcclxuaW1wb3J0IGNyZWF0ZUdlb21ldHJ5IGZyb20gJ3RocmVlLWJtZm9udC10ZXh0JztcclxuaW1wb3J0IHBhcnNlQVNDSUkgZnJvbSAncGFyc2UtYm1mb250LWFzY2lpJztcclxuXHJcbmltcG9ydCAqIGFzIEZvbnQgZnJvbSAnLi9mb250JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYXRlcmlhbCggY29sb3IgKXtcclxuXHJcbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XHJcbiAgY29uc3QgaW1hZ2UgPSBGb250LmltYWdlKCk7XHJcbiAgdGV4dHVyZS5pbWFnZSA9IGltYWdlO1xyXG4gIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xyXG4gIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xyXG4gIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XHJcblxyXG4gIHJldHVybiBuZXcgVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWwoU0RGU2hhZGVyKHtcclxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGNvbG9yOiBjb2xvcixcclxuICAgIG1hcDogdGV4dHVyZVxyXG4gIH0pKTtcclxufVxyXG5cclxuY29uc3QgdGV4dFNjYWxlID0gMC4wMDEyO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0b3IoKXtcclxuXHJcbiAgY29uc3QgZm9udCA9IHBhcnNlQVNDSUkoIEZvbnQuZm50KCkgKTtcclxuXHJcbiAgY29uc3QgY29sb3JNYXRlcmlhbHMgPSB7fTtcclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlVGV4dCggc3RyLCBmb250LCBjb2xvciA9IDB4ZmZmZmZmLCBzY2FsZSA9IDEuMCApe1xyXG5cclxuICAgIGNvbnN0IGdlb21ldHJ5ID0gY3JlYXRlR2VvbWV0cnkoe1xyXG4gICAgICB0ZXh0OiBzdHIsXHJcbiAgICAgIGFsaWduOiAnbGVmdCcsXHJcbiAgICAgIHdpZHRoOiAxMDAwLFxyXG4gICAgICBmbGlwWTogdHJ1ZSxcclxuICAgICAgZm9udFxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGNvbnN0IGxheW91dCA9IGdlb21ldHJ5LmxheW91dDtcclxuXHJcbiAgICBsZXQgbWF0ZXJpYWwgPSBjb2xvck1hdGVyaWFsc1sgY29sb3IgXTtcclxuICAgIGlmKCBtYXRlcmlhbCA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIG1hdGVyaWFsID0gY29sb3JNYXRlcmlhbHNbIGNvbG9yIF0gPSBjcmVhdGVNYXRlcmlhbCggY29sb3IgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCggZ2VvbWV0cnksIG1hdGVyaWFsICk7XHJcbiAgICBtZXNoLnNjYWxlLm11bHRpcGx5KCBuZXcgVEhSRUUuVmVjdG9yMygxLC0xLDEpICk7XHJcblxyXG4gICAgY29uc3QgZmluYWxTY2FsZSA9IHNjYWxlICogdGV4dFNjYWxlO1xyXG5cclxuICAgIG1lc2guc2NhbGUubXVsdGlwbHlTY2FsYXIoIGZpbmFsU2NhbGUgKTtcclxuXHJcbiAgICBtZXNoLnBvc2l0aW9uLnkgPSBsYXlvdXQuaGVpZ2h0ICogMC41ICogZmluYWxTY2FsZTtcclxuXHJcbiAgICByZXR1cm4gbWVzaDtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGUoIHN0ciwgeyBjb2xvcj0weGZmZmZmZiwgc2NhbGU9MS4wIH0gPSB7fSApe1xyXG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgICBsZXQgbWVzaCA9IGNyZWF0ZVRleHQoIHN0ciwgZm9udCwgY29sb3IsIHNjYWxlICk7XHJcbiAgICBncm91cC5hZGQoIG1lc2ggKTtcclxuICAgIGdyb3VwLmxheW91dCA9IG1lc2guZ2VvbWV0cnkubGF5b3V0O1xyXG5cclxuICAgIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgICAgbWVzaC5nZW9tZXRyeS51cGRhdGUoIHN0ciApO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgY3JlYXRlLFxyXG4gICAgZ2V0TWF0ZXJpYWw6ICgpPT4gbWF0ZXJpYWxcclxuICB9XHJcblxyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qIFxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qIFxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKiBcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcblxyXG5leHBvcnQgY29uc3QgUEFORUwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4ZmZmZmZmLCB2ZXJ0ZXhDb2xvcnM6IFRIUkVFLlZlcnRleENvbG9ycyB9ICk7XHJcbmV4cG9ydCBjb25zdCBMT0NBVE9SID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbmV4cG9ydCBjb25zdCBGT0xERVIgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4MDAwMDAwIH0gKTsiLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5pbXBvcnQgKiBhcyBQYWxldHRlIGZyb20gJy4vcGFsZXR0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVTbGlkZXIoIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgaW5pdGlhbFZhbHVlID0gMC4wLFxyXG4gIG1pbiA9IDAuMCwgbWF4ID0gMS4wLFxyXG4gIHN0ZXAgPSAwLjEsXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcblxyXG4gIGNvbnN0IFNMSURFUl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBTTElERVJfSEVJR0hUID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBTTElERVJfREVQVEggPSBkZXB0aDtcclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICBhbHBoYTogMS4wLFxyXG4gICAgdmFsdWU6IGluaXRpYWxWYWx1ZSxcclxuICAgIHN0ZXA6IHN0ZXAsXHJcbiAgICB1c2VTdGVwOiBmYWxzZSxcclxuICAgIHByZWNpc2lvbjogMSxcclxuICAgIGxpc3RlbjogZmFsc2UsXHJcbiAgICBtaW46IG1pbixcclxuICAgIG1heDogbWF4LFxyXG4gICAgb25DaGFuZ2VkQ0I6IHVuZGVmaW5lZCxcclxuICAgIG9uRmluaXNoZWRDaGFuZ2U6IHVuZGVmaW5lZCxcclxuICAgIHByZXNzaW5nOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIHN0YXRlLnN0ZXAgPSBnZXRJbXBsaWVkU3RlcCggc3RhdGUudmFsdWUgKTtcclxuICBzdGF0ZS5wcmVjaXNpb24gPSBudW1EZWNpbWFscyggc3RhdGUuc3RlcCApO1xyXG4gIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICAvLyAgZmlsbGVkIHZvbHVtZVxyXG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIFNMSURFUl9XSURUSCwgU0xJREVSX0hFSUdIVCwgU0xJREVSX0RFUFRIICk7XHJcbiAgcmVjdC50cmFuc2xhdGUoU0xJREVSX1dJRFRIKjAuNSwwLDApO1xyXG4gIC8vIExheW91dC5hbGlnbkxlZnQoIHJlY3QgKTtcclxuXHJcbiAgY29uc3QgaGl0c2Nhbk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG4gIGhpdHNjYW5Wb2x1bWUubmFtZSA9ICdoaXRzY2FuVm9sdW1lJztcclxuXHJcbiAgLy8gIHNsaWRlckJHIHZvbHVtZVxyXG4gIGNvbnN0IHNsaWRlckJHID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHNsaWRlckJHLmdlb21ldHJ5LCBDb2xvcnMuU0xJREVSX0JHICk7XHJcbiAgc2xpZGVyQkcucG9zaXRpb24ueiA9IGRlcHRoICogMC41O1xyXG4gIHNsaWRlckJHLnBvc2l0aW9uLnggPSBTTElERVJfV0lEVEggKyBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiBDb2xvcnMuREVGQVVMVF9DT0xPUiB9KTtcclxuICBjb25zdCBmaWxsZWRWb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBtYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBmaWxsZWRWb2x1bWUgKTtcclxuXHJcbiAgY29uc3QgZW5kTG9jYXRvciA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIDAuMDUsIDAuMDUsIDAuMDUsIDEsIDEsIDEgKSwgU2hhcmVkTWF0ZXJpYWxzLkxPQ0FUT1IgKTtcclxuICBlbmRMb2NhdG9yLnBvc2l0aW9uLnggPSBTTElERVJfV0lEVEg7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGVuZExvY2F0b3IgKTtcclxuICBlbmRMb2NhdG9yLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgdmFsdWVMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggc3RhdGUudmFsdWUudG9TdHJpbmcoKSApO1xyXG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9WQUxVRV9URVhUX01BUkdJTiArIHdpZHRoICogMC41O1xyXG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoKjI7XHJcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX1NMSURFUiApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIHBhbmVsLm5hbWUgPSAncGFuZWwnO1xyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBzbGlkZXJCRywgdmFsdWVMYWJlbCwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIGdyb3VwLmFkZCggcGFuZWwgKVxyXG5cclxuICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmFsdWVMYWJlbCggdmFsdWUgKXtcclxuICAgIGlmKCBzdGF0ZS51c2VTdGVwICl7XHJcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlKCByb3VuZFRvRGVjaW1hbCggc3RhdGUudmFsdWUsIHN0YXRlLnByZWNpc2lvbiApLnRvU3RyaW5nKCkgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlKCBzdGF0ZS52YWx1ZS50b1N0cmluZygpICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcbiAgICBpZiggc3RhdGUucHJlc3NpbmcgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSU5URVJBQ1RJT05fQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9DT0xPUiApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlU2xpZGVyKCBhbHBoYSApe1xyXG4gICAgYWxwaGEgPSBnZXRDbGFtcGVkQWxwaGEoIGFscGhhICk7XHJcbiAgICBmaWxsZWRWb2x1bWUuc2NhbGUueCA9IE1hdGgubWF4KCBhbHBoYSAqIHdpZHRoLCAwLjAwMDAwMSApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlT2JqZWN0KCB2YWx1ZSApe1xyXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlU3RhdGVGcm9tQWxwaGEoIGFscGhhICl7XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldENsYW1wZWRBbHBoYSggYWxwaGEgKTtcclxuICAgIHN0YXRlLnZhbHVlID0gZ2V0VmFsdWVGcm9tQWxwaGEoIHN0YXRlLmFscGhhLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG4gICAgaWYoIHN0YXRlLnVzZVN0ZXAgKXtcclxuICAgICAgc3RhdGUudmFsdWUgPSBnZXRTdGVwcGVkVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5zdGVwICk7XHJcbiAgICB9XHJcbiAgICBzdGF0ZS52YWx1ZSA9IGdldENsYW1wZWRWYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBsaXN0ZW5VcGRhdGUoKXtcclxuICAgIHN0YXRlLnZhbHVlID0gZ2V0VmFsdWVGcm9tT2JqZWN0KCk7XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuICAgIHN0YXRlLmFscGhhID0gZ2V0Q2xhbXBlZEFscGhhKCBzdGF0ZS5hbHBoYSApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0VmFsdWVGcm9tT2JqZWN0KCl7XHJcbiAgICByZXR1cm4gcGFyc2VGbG9hdCggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSApO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAub25DaGFuZ2UgPSBmdW5jdGlvbiggY2FsbGJhY2sgKXtcclxuICAgIHN0YXRlLm9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuc3RlcCA9IGZ1bmN0aW9uKCBzdGVwICl7XHJcbiAgICBzdGF0ZS5zdGVwID0gc3RlcDtcclxuICAgIHN0YXRlLnByZWNpc2lvbiA9IG51bURlY2ltYWxzKCBzdGF0ZS5zdGVwIClcclxuICAgIHN0YXRlLnVzZVN0ZXAgPSB0cnVlO1xyXG5cclxuICAgIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG5cclxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSApO1xyXG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICAgIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlUHJlc3MgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdwcmVzc2luZycsIGhhbmRsZUhvbGQgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlUmVsZWFzZSApO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVQcmVzcyggcCApe1xyXG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhvbGQoIHsgcG9pbnQgfSA9IHt9ICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBmaWxsZWRWb2x1bWUudXBkYXRlTWF0cml4V29ybGQoKTtcclxuICAgIGVuZExvY2F0b3IudXBkYXRlTWF0cml4V29ybGQoKTtcclxuXHJcbiAgICBjb25zdCBhID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGZpbGxlZFZvbHVtZS5tYXRyaXhXb3JsZCApO1xyXG4gICAgY29uc3QgYiA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBlbmRMb2NhdG9yLm1hdHJpeFdvcmxkICk7XHJcblxyXG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHN0YXRlLnZhbHVlO1xyXG5cclxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBnZXRQb2ludEFscGhhKCBwb2ludCwge2EsYn0gKSApO1xyXG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICAgIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuICAgIHVwZGF0ZU9iamVjdCggc3RhdGUudmFsdWUgKTtcclxuXHJcbiAgICBpZiggcHJldmlvdXNWYWx1ZSAhPT0gc3RhdGUudmFsdWUgJiYgc3RhdGUub25DaGFuZ2VkQ0IgKXtcclxuICAgICAgc3RhdGUub25DaGFuZ2VkQ0IoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSZWxlYXNlKCl7XHJcbiAgICBzdGF0ZS5wcmVzc2luZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG4gIGNvbnN0IHBhbGV0dGVJbnRlcmFjdGlvbiA9IFBhbGV0dGUuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHBhbGV0dGVJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG5cclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgbGlzdGVuVXBkYXRlKCk7XHJcbiAgICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XHJcbiAgICAgIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubWluID0gZnVuY3Rpb24oIG0gKXtcclxuICAgIHN0YXRlLm1pbiA9IG07XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSApO1xyXG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICAgIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5tYXggPSBmdW5jdGlvbiggbSApe1xyXG4gICAgc3RhdGUubWF4ID0gbTtcclxuICAgIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG4gICAgdXBkYXRlU3RhdGVGcm9tQWxwaGEoIHN0YXRlLmFscGhhICk7XHJcbiAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gICAgdXBkYXRlU2xpZGVyKCBzdGF0ZS5hbHBoYSApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBncm91cDtcclxufVxyXG5cclxuY29uc3QgdGEgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5jb25zdCB0YiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbmNvbnN0IHRUb0EgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5jb25zdCBhVG9CID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuXHJcbmZ1bmN0aW9uIGdldFBvaW50QWxwaGEoIHBvaW50LCBzZWdtZW50ICl7XHJcbiAgdGEuY29weSggc2VnbWVudC5iICkuc3ViKCBzZWdtZW50LmEgKTtcclxuICB0Yi5jb3B5KCBwb2ludCApLnN1Yiggc2VnbWVudC5hICk7XHJcblxyXG4gIGNvbnN0IHByb2plY3RlZCA9IHRiLnByb2plY3RPblZlY3RvciggdGEgKTtcclxuXHJcbiAgdFRvQS5jb3B5KCBwb2ludCApLnN1Yiggc2VnbWVudC5hICk7XHJcblxyXG4gIGFUb0IuY29weSggc2VnbWVudC5iICkuc3ViKCBzZWdtZW50LmEgKS5ub3JtYWxpemUoKTtcclxuXHJcbiAgY29uc3Qgc2lkZSA9IHRUb0Eubm9ybWFsaXplKCkuZG90KCBhVG9CICkgPj0gMCA/IDEgOiAtMTtcclxuXHJcbiAgY29uc3QgbGVuZ3RoID0gc2VnbWVudC5hLmRpc3RhbmNlVG8oIHNlZ21lbnQuYiApICogc2lkZTtcclxuXHJcbiAgbGV0IGFscGhhID0gcHJvamVjdGVkLmxlbmd0aCgpIC8gbGVuZ3RoO1xyXG4gIGlmKCBhbHBoYSA+IDEuMCApe1xyXG4gICAgYWxwaGEgPSAxLjA7XHJcbiAgfVxyXG4gIGlmKCBhbHBoYSA8IDAuMCApe1xyXG4gICAgYWxwaGEgPSAwLjA7XHJcbiAgfVxyXG4gIHJldHVybiBhbHBoYTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGVycChtaW4sIG1heCwgdmFsdWUpIHtcclxuICByZXR1cm4gKDEtdmFsdWUpKm1pbiArIHZhbHVlKm1heDtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFwX3JhbmdlKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpIHtcclxuICAgIHJldHVybiBsb3cyICsgKGhpZ2gyIC0gbG93MikgKiAodmFsdWUgLSBsb3cxKSAvIChoaWdoMSAtIGxvdzEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDbGFtcGVkQWxwaGEoIGFscGhhICl7XHJcbiAgaWYoIGFscGhhID4gMSApe1xyXG4gICAgcmV0dXJuIDFcclxuICB9XHJcbiAgaWYoIGFscGhhIDwgMCApe1xyXG4gICAgcmV0dXJuIDA7XHJcbiAgfVxyXG4gIHJldHVybiBhbHBoYTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2xhbXBlZFZhbHVlKCB2YWx1ZSwgbWluLCBtYXggKXtcclxuICBpZiggdmFsdWUgPCBtaW4gKXtcclxuICAgIHJldHVybiBtaW47XHJcbiAgfVxyXG4gIGlmKCB2YWx1ZSA+IG1heCApe1xyXG4gICAgcmV0dXJuIG1heDtcclxuICB9XHJcbiAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJbXBsaWVkU3RlcCggdmFsdWUgKXtcclxuICBpZiggdmFsdWUgPT09IDAgKXtcclxuICAgIHJldHVybiAxOyAvLyBXaGF0IGFyZSB3ZSwgcHN5Y2hpY3M/XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIEhleSBEb3VnLCBjaGVjayB0aGlzIG91dC5cclxuICAgIHJldHVybiBNYXRoLnBvdygxMCwgTWF0aC5mbG9vcihNYXRoLmxvZyhNYXRoLmFicyh2YWx1ZSkpL01hdGguTE4xMCkpLzEwO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VmFsdWVGcm9tQWxwaGEoIGFscGhhLCBtaW4sIG1heCApe1xyXG4gIHJldHVybiBtYXBfcmFuZ2UoIGFscGhhLCAwLjAsIDEuMCwgbWluLCBtYXggKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBbHBoYUZyb21WYWx1ZSggdmFsdWUsIG1pbiwgbWF4ICl7XHJcbiAgcmV0dXJuIG1hcF9yYW5nZSggdmFsdWUsIG1pbiwgbWF4LCAwLjAsIDEuMCApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTdGVwcGVkVmFsdWUoIHZhbHVlLCBzdGVwICl7XHJcbiAgaWYoIHZhbHVlICUgc3RlcCAhPSAwKSB7XHJcbiAgICByZXR1cm4gTWF0aC5yb3VuZCggdmFsdWUgLyBzdGVwICkgKiBzdGVwO1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG51bURlY2ltYWxzKHgpIHtcclxuICB4ID0geC50b1N0cmluZygpO1xyXG4gIGlmICh4LmluZGV4T2YoJy4nKSA+IC0xKSB7XHJcbiAgICByZXR1cm4geC5sZW5ndGggLSB4LmluZGV4T2YoJy4nKSAtIDE7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAwO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcm91bmRUb0RlY2ltYWwodmFsdWUsIGRlY2ltYWxzKSB7XHJcbiAgY29uc3QgdGVuVG8gPSBNYXRoLnBvdygxMCwgZGVjaW1hbHMpO1xyXG4gIHJldHVybiBNYXRoLnJvdW5kKHZhbHVlICogdGVuVG8pIC8gdGVuVG87XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVRleHRMYWJlbCggdGV4dENyZWF0b3IsIHN0ciwgd2lkdGggPSAwLjQsIGRlcHRoID0gMC4wMjksIGZnQ29sb3IgPSAweGZmZmZmZiwgYmdDb2xvciA9IENvbG9ycy5ERUZBVUxUX0JBQ0ssIHNjYWxlID0gMS4wICl7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgY29uc3QgaW50ZXJuYWxQb3NpdGlvbmluZyA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIGdyb3VwLmFkZCggaW50ZXJuYWxQb3NpdGlvbmluZyApO1xyXG5cclxuICBjb25zdCB0ZXh0ID0gdGV4dENyZWF0b3IuY3JlYXRlKCBzdHIsIHsgY29sb3I6IGZnQ29sb3IsIHNjYWxlIH0gKTtcclxuICBpbnRlcm5hbFBvc2l0aW9uaW5nLmFkZCggdGV4dCApO1xyXG5cclxuXHJcbiAgZ3JvdXAuc2V0U3RyaW5nID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgdGV4dC51cGRhdGUoIHN0ci50b1N0cmluZygpICk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuc2V0TnVtYmVyID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgdGV4dC51cGRhdGUoIHN0ci50b0ZpeGVkKDIpICk7XHJcbiAgfTtcclxuXHJcbiAgdGV4dC5wb3NpdGlvbi56ID0gMC4wMTVcclxuXHJcbiAgY29uc3QgYmFja0JvdW5kcyA9IDAuMDE7XHJcbiAgY29uc3QgbWFyZ2luID0gMC4wMTtcclxuICBjb25zdCB0b3RhbFdpZHRoID0gd2lkdGg7XHJcbiAgY29uc3QgdG90YWxIZWlnaHQgPSAwLjA0ICsgbWFyZ2luICogMjtcclxuICBjb25zdCBsYWJlbEJhY2tHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggdG90YWxXaWR0aCwgdG90YWxIZWlnaHQsIGRlcHRoLCAxLCAxLCAxICk7XHJcbiAgbGFiZWxCYWNrR2VvbWV0cnkuYXBwbHlNYXRyaXgoIG5ldyBUSFJFRS5NYXRyaXg0KCkubWFrZVRyYW5zbGF0aW9uKCB0b3RhbFdpZHRoICogMC41IC0gbWFyZ2luLCAwLCAwICkgKTtcclxuXHJcbiAgY29uc3QgbGFiZWxCYWNrTWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBsYWJlbEJhY2tHZW9tZXRyeSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGxhYmVsQmFja01lc2guZ2VvbWV0cnksIGJnQ29sb3IgKTtcclxuXHJcbiAgbGFiZWxCYWNrTWVzaC5wb3NpdGlvbi55ID0gMC4wMztcclxuICBpbnRlcm5hbFBvc2l0aW9uaW5nLmFkZCggbGFiZWxCYWNrTWVzaCApO1xyXG4gIGludGVybmFsUG9zaXRpb25pbmcucG9zaXRpb24ueSA9IC10b3RhbEhlaWdodCAqIDAuNTtcclxuXHJcbiAgZ3JvdXAuYmFjayA9IGxhYmVsQmFja01lc2g7XHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qXG4gKlx0QGF1dGhvciB6ejg1IC8gaHR0cDovL3R3aXR0ZXIuY29tL2JsdXJzcGxpbmUgLyBodHRwOi8vd3d3LmxhYjRnYW1lcy5uZXQveno4NS9ibG9nXG4gKlx0QGF1dGhvciBjZW50ZXJpb253YXJlIC8gaHR0cDovL3d3dy5jZW50ZXJpb253YXJlLmNvbVxuICpcbiAqXHRTdWJkaXZpc2lvbiBHZW9tZXRyeSBNb2RpZmllclxuICpcdFx0dXNpbmcgTG9vcCBTdWJkaXZpc2lvbiBTY2hlbWVcbiAqXG4gKlx0UmVmZXJlbmNlczpcbiAqXHRcdGh0dHA6Ly9ncmFwaGljcy5zdGFuZm9yZC5lZHUvfm1kZmlzaGVyL3N1YmRpdmlzaW9uLmh0bWxcbiAqXHRcdGh0dHA6Ly93d3cuaG9sbWVzM2QubmV0L2dyYXBoaWNzL3N1YmRpdmlzaW9uL1xuICpcdFx0aHR0cDovL3d3dy5jcy5ydXRnZXJzLmVkdS9+ZGVjYXJsby9yZWFkaW5ncy9zdWJkaXYtc2cwMGMucGRmXG4gKlxuICpcdEtub3duIElzc3VlczpcbiAqXHRcdC0gY3VycmVudGx5IGRvZXNuJ3QgaGFuZGxlIFwiU2hhcnAgRWRnZXNcIlxuICovXG5cblRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIgPSBmdW5jdGlvbiAoIHN1YmRpdmlzaW9ucyApIHtcblxuXHR0aGlzLnN1YmRpdmlzaW9ucyA9ICggc3ViZGl2aXNpb25zID09PSB1bmRlZmluZWQgKSA/IDEgOiBzdWJkaXZpc2lvbnM7XG5cbn07XG5cbi8vIEFwcGxpZXMgdGhlIFwibW9kaWZ5XCIgcGF0dGVyblxuVEhSRUUuU3ViZGl2aXNpb25Nb2RpZmllci5wcm90b3R5cGUubW9kaWZ5ID0gZnVuY3Rpb24gKCBnZW9tZXRyeSApIHtcblxuXHR2YXIgcmVwZWF0cyA9IHRoaXMuc3ViZGl2aXNpb25zO1xuXG5cdHdoaWxlICggcmVwZWF0cyAtLSA+IDAgKSB7XG5cblx0XHR0aGlzLnNtb290aCggZ2VvbWV0cnkgKTtcblxuXHR9XG5cblx0Z2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XG5cdGdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XG5cbn07XG5cbiggZnVuY3Rpb24oKSB7XG5cblx0Ly8gU29tZSBjb25zdGFudHNcblx0dmFyIFdBUk5JTkdTID0gISB0cnVlOyAvLyBTZXQgdG8gdHJ1ZSBmb3IgZGV2ZWxvcG1lbnRcblx0dmFyIEFCQyA9IFsgJ2EnLCAnYicsICdjJyBdO1xuXG5cblx0ZnVuY3Rpb24gZ2V0RWRnZSggYSwgYiwgbWFwICkge1xuXG5cdFx0dmFyIHZlcnRleEluZGV4QSA9IE1hdGgubWluKCBhLCBiICk7XG5cdFx0dmFyIHZlcnRleEluZGV4QiA9IE1hdGgubWF4KCBhLCBiICk7XG5cblx0XHR2YXIga2V5ID0gdmVydGV4SW5kZXhBICsgXCJfXCIgKyB2ZXJ0ZXhJbmRleEI7XG5cblx0XHRyZXR1cm4gbWFwWyBrZXkgXTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBwcm9jZXNzRWRnZSggYSwgYiwgdmVydGljZXMsIG1hcCwgZmFjZSwgbWV0YVZlcnRpY2VzICkge1xuXG5cdFx0dmFyIHZlcnRleEluZGV4QSA9IE1hdGgubWluKCBhLCBiICk7XG5cdFx0dmFyIHZlcnRleEluZGV4QiA9IE1hdGgubWF4KCBhLCBiICk7XG5cblx0XHR2YXIga2V5ID0gdmVydGV4SW5kZXhBICsgXCJfXCIgKyB2ZXJ0ZXhJbmRleEI7XG5cblx0XHR2YXIgZWRnZTtcblxuXHRcdGlmICgga2V5IGluIG1hcCApIHtcblxuXHRcdFx0ZWRnZSA9IG1hcFsga2V5IF07XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR2YXIgdmVydGV4QSA9IHZlcnRpY2VzWyB2ZXJ0ZXhJbmRleEEgXTtcblx0XHRcdHZhciB2ZXJ0ZXhCID0gdmVydGljZXNbIHZlcnRleEluZGV4QiBdO1xuXG5cdFx0XHRlZGdlID0ge1xuXG5cdFx0XHRcdGE6IHZlcnRleEEsIC8vIHBvaW50ZXIgcmVmZXJlbmNlXG5cdFx0XHRcdGI6IHZlcnRleEIsXG5cdFx0XHRcdG5ld0VkZ2U6IG51bGwsXG5cdFx0XHRcdC8vIGFJbmRleDogYSwgLy8gbnVtYmVyZWQgcmVmZXJlbmNlXG5cdFx0XHRcdC8vIGJJbmRleDogYixcblx0XHRcdFx0ZmFjZXM6IFtdIC8vIHBvaW50ZXJzIHRvIGZhY2VcblxuXHRcdFx0fTtcblxuXHRcdFx0bWFwWyBrZXkgXSA9IGVkZ2U7XG5cblx0XHR9XG5cblx0XHRlZGdlLmZhY2VzLnB1c2goIGZhY2UgKTtcblxuXHRcdG1ldGFWZXJ0aWNlc1sgYSBdLmVkZ2VzLnB1c2goIGVkZ2UgKTtcblx0XHRtZXRhVmVydGljZXNbIGIgXS5lZGdlcy5wdXNoKCBlZGdlICk7XG5cblxuXHR9XG5cblx0ZnVuY3Rpb24gZ2VuZXJhdGVMb29rdXBzKCB2ZXJ0aWNlcywgZmFjZXMsIG1ldGFWZXJ0aWNlcywgZWRnZXMgKSB7XG5cblx0XHR2YXIgaSwgaWwsIGZhY2UsIGVkZ2U7XG5cblx0XHRmb3IgKCBpID0gMCwgaWwgPSB2ZXJ0aWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0bWV0YVZlcnRpY2VzWyBpIF0gPSB7IGVkZ2VzOiBbXSB9O1xuXG5cdFx0fVxuXG5cdFx0Zm9yICggaSA9IDAsIGlsID0gZmFjZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdGZhY2UgPSBmYWNlc1sgaSBdO1xuXG5cdFx0XHRwcm9jZXNzRWRnZSggZmFjZS5hLCBmYWNlLmIsIHZlcnRpY2VzLCBlZGdlcywgZmFjZSwgbWV0YVZlcnRpY2VzICk7XG5cdFx0XHRwcm9jZXNzRWRnZSggZmFjZS5iLCBmYWNlLmMsIHZlcnRpY2VzLCBlZGdlcywgZmFjZSwgbWV0YVZlcnRpY2VzICk7XG5cdFx0XHRwcm9jZXNzRWRnZSggZmFjZS5jLCBmYWNlLmEsIHZlcnRpY2VzLCBlZGdlcywgZmFjZSwgbWV0YVZlcnRpY2VzICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG5ld0ZhY2UoIG5ld0ZhY2VzLCBhLCBiLCBjICkge1xuXG5cdFx0bmV3RmFjZXMucHVzaCggbmV3IFRIUkVFLkZhY2UzKCBhLCBiLCBjICkgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gbWlkcG9pbnQoIGEsIGIgKSB7XG5cblx0XHRyZXR1cm4gKCBNYXRoLmFicyggYiAtIGEgKSAvIDIgKSArIE1hdGgubWluKCBhLCBiICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG5ld1V2KCBuZXdVdnMsIGEsIGIsIGMgKSB7XG5cblx0XHRuZXdVdnMucHVzaCggWyBhLmNsb25lKCksIGIuY2xvbmUoKSwgYy5jbG9uZSgpIF0gKTtcblxuXHR9XG5cblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHQvLyBQZXJmb3JtcyBvbmUgaXRlcmF0aW9uIG9mIFN1YmRpdmlzaW9uXG5cdFRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIucHJvdG90eXBlLnNtb290aCA9IGZ1bmN0aW9uICggZ2VvbWV0cnkgKSB7XG5cblx0XHR2YXIgdG1wID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuXHRcdHZhciBvbGRWZXJ0aWNlcywgb2xkRmFjZXMsIG9sZFV2cztcblx0XHR2YXIgbmV3VmVydGljZXMsIG5ld0ZhY2VzLCBuZXdVVnMgPSBbXTtcblxuXHRcdHZhciBuLCBsLCBpLCBpbCwgaiwgaztcblx0XHR2YXIgbWV0YVZlcnRpY2VzLCBzb3VyY2VFZGdlcztcblxuXHRcdC8vIG5ldyBzdHVmZi5cblx0XHR2YXIgc291cmNlRWRnZXMsIG5ld0VkZ2VWZXJ0aWNlcywgbmV3U291cmNlVmVydGljZXM7XG5cblx0XHRvbGRWZXJ0aWNlcyA9IGdlb21ldHJ5LnZlcnRpY2VzOyAvLyB7IHgsIHksIHp9XG5cdFx0b2xkRmFjZXMgPSBnZW9tZXRyeS5mYWNlczsgLy8geyBhOiBvbGRWZXJ0ZXgxLCBiOiBvbGRWZXJ0ZXgyLCBjOiBvbGRWZXJ0ZXgzIH1cblx0XHRvbGRVdnMgPSBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWyAwIF07XG5cblx0XHR2YXIgaGFzVXZzID0gb2xkVXZzICE9PSB1bmRlZmluZWQgJiYgb2xkVXZzLmxlbmd0aCA+IDA7XG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdFx0ICpcblx0XHQgKiBTdGVwIDA6IFByZXByb2Nlc3MgR2VvbWV0cnkgdG8gR2VuZXJhdGUgZWRnZXMgTG9va3VwXG5cdFx0ICpcblx0XHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdG1ldGFWZXJ0aWNlcyA9IG5ldyBBcnJheSggb2xkVmVydGljZXMubGVuZ3RoICk7XG5cdFx0c291cmNlRWRnZXMgPSB7fTsgLy8gRWRnZSA9PiB7IG9sZFZlcnRleDEsIG9sZFZlcnRleDIsIGZhY2VzW10gIH1cblxuXHRcdGdlbmVyYXRlTG9va3Vwcyggb2xkVmVydGljZXMsIG9sZEZhY2VzLCBtZXRhVmVydGljZXMsIHNvdXJjZUVkZ2VzICk7XG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0XHQgKlxuXHRcdCAqXHRTdGVwIDEuXG5cdFx0ICpcdEZvciBlYWNoIGVkZ2UsIGNyZWF0ZSBhIG5ldyBFZGdlIFZlcnRleCxcblx0XHQgKlx0dGhlbiBwb3NpdGlvbiBpdC5cblx0XHQgKlxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0bmV3RWRnZVZlcnRpY2VzID0gW107XG5cdFx0dmFyIG90aGVyLCBjdXJyZW50RWRnZSwgbmV3RWRnZSwgZmFjZTtcblx0XHR2YXIgZWRnZVZlcnRleFdlaWdodCwgYWRqYWNlbnRWZXJ0ZXhXZWlnaHQsIGNvbm5lY3RlZEZhY2VzO1xuXG5cdFx0Zm9yICggaSBpbiBzb3VyY2VFZGdlcyApIHtcblxuXHRcdFx0Y3VycmVudEVkZ2UgPSBzb3VyY2VFZGdlc1sgaSBdO1xuXHRcdFx0bmV3RWRnZSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0XHRcdGVkZ2VWZXJ0ZXhXZWlnaHQgPSAzIC8gODtcblx0XHRcdGFkamFjZW50VmVydGV4V2VpZ2h0ID0gMSAvIDg7XG5cblx0XHRcdGNvbm5lY3RlZEZhY2VzID0gY3VycmVudEVkZ2UuZmFjZXMubGVuZ3RoO1xuXG5cdFx0XHQvLyBjaGVjayBob3cgbWFueSBsaW5rZWQgZmFjZXMuIDIgc2hvdWxkIGJlIGNvcnJlY3QuXG5cdFx0XHRpZiAoIGNvbm5lY3RlZEZhY2VzICE9IDIgKSB7XG5cblx0XHRcdFx0Ly8gaWYgbGVuZ3RoIGlzIG5vdCAyLCBoYW5kbGUgY29uZGl0aW9uXG5cdFx0XHRcdGVkZ2VWZXJ0ZXhXZWlnaHQgPSAwLjU7XG5cdFx0XHRcdGFkamFjZW50VmVydGV4V2VpZ2h0ID0gMDtcblxuXHRcdFx0XHRpZiAoIGNvbm5lY3RlZEZhY2VzICE9IDEgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnU3ViZGl2aXNpb24gTW9kaWZpZXI6IE51bWJlciBvZiBjb25uZWN0ZWQgZmFjZXMgIT0gMiwgaXM6ICcsIGNvbm5lY3RlZEZhY2VzLCBjdXJyZW50RWRnZSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRuZXdFZGdlLmFkZFZlY3RvcnMoIGN1cnJlbnRFZGdlLmEsIGN1cnJlbnRFZGdlLmIgKS5tdWx0aXBseVNjYWxhciggZWRnZVZlcnRleFdlaWdodCApO1xuXG5cdFx0XHR0bXAuc2V0KCAwLCAwLCAwICk7XG5cblx0XHRcdGZvciAoIGogPSAwOyBqIDwgY29ubmVjdGVkRmFjZXM7IGogKysgKSB7XG5cblx0XHRcdFx0ZmFjZSA9IGN1cnJlbnRFZGdlLmZhY2VzWyBqIF07XG5cblx0XHRcdFx0Zm9yICggayA9IDA7IGsgPCAzOyBrICsrICkge1xuXG5cdFx0XHRcdFx0b3RoZXIgPSBvbGRWZXJ0aWNlc1sgZmFjZVsgQUJDWyBrIF0gXSBdO1xuXHRcdFx0XHRcdGlmICggb3RoZXIgIT09IGN1cnJlbnRFZGdlLmEgJiYgb3RoZXIgIT09IGN1cnJlbnRFZGdlLmIgKSBicmVhaztcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dG1wLmFkZCggb3RoZXIgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHR0bXAubXVsdGlwbHlTY2FsYXIoIGFkamFjZW50VmVydGV4V2VpZ2h0ICk7XG5cdFx0XHRuZXdFZGdlLmFkZCggdG1wICk7XG5cblx0XHRcdGN1cnJlbnRFZGdlLm5ld0VkZ2UgPSBuZXdFZGdlVmVydGljZXMubGVuZ3RoO1xuXHRcdFx0bmV3RWRnZVZlcnRpY2VzLnB1c2goIG5ld0VkZ2UgKTtcblxuXHRcdFx0Ly8gY29uc29sZS5sb2coY3VycmVudEVkZ2UsIG5ld0VkZ2UpO1xuXG5cdFx0fVxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHRcdCAqXG5cdFx0ICpcdFN0ZXAgMi5cblx0XHQgKlx0UmVwb3NpdGlvbiBlYWNoIHNvdXJjZSB2ZXJ0aWNlcy5cblx0XHQgKlxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0dmFyIGJldGEsIHNvdXJjZVZlcnRleFdlaWdodCwgY29ubmVjdGluZ1ZlcnRleFdlaWdodDtcblx0XHR2YXIgY29ubmVjdGluZ0VkZ2UsIGNvbm5lY3RpbmdFZGdlcywgb2xkVmVydGV4LCBuZXdTb3VyY2VWZXJ0ZXg7XG5cdFx0bmV3U291cmNlVmVydGljZXMgPSBbXTtcblxuXHRcdGZvciAoIGkgPSAwLCBpbCA9IG9sZFZlcnRpY2VzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xuXG5cdFx0XHRvbGRWZXJ0ZXggPSBvbGRWZXJ0aWNlc1sgaSBdO1xuXG5cdFx0XHQvLyBmaW5kIGFsbCBjb25uZWN0aW5nIGVkZ2VzICh1c2luZyBsb29rdXBUYWJsZSlcblx0XHRcdGNvbm5lY3RpbmdFZGdlcyA9IG1ldGFWZXJ0aWNlc1sgaSBdLmVkZ2VzO1xuXHRcdFx0biA9IGNvbm5lY3RpbmdFZGdlcy5sZW5ndGg7XG5cblx0XHRcdGlmICggbiA9PSAzICkge1xuXG5cdFx0XHRcdGJldGEgPSAzIC8gMTY7XG5cblx0XHRcdH0gZWxzZSBpZiAoIG4gPiAzICkge1xuXG5cdFx0XHRcdGJldGEgPSAzIC8gKCA4ICogbiApOyAvLyBXYXJyZW4ncyBtb2RpZmllZCBmb3JtdWxhXG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gTG9vcCdzIG9yaWdpbmFsIGJldGEgZm9ybXVsYVxuXHRcdFx0Ly8gYmV0YSA9IDEgLyBuICogKCA1LzggLSBNYXRoLnBvdyggMy84ICsgMS80ICogTWF0aC5jb3MoIDIgKiBNYXRoLiBQSSAvIG4gKSwgMikgKTtcblxuXHRcdFx0c291cmNlVmVydGV4V2VpZ2h0ID0gMSAtIG4gKiBiZXRhO1xuXHRcdFx0Y29ubmVjdGluZ1ZlcnRleFdlaWdodCA9IGJldGE7XG5cblx0XHRcdGlmICggbiA8PSAyICkge1xuXG5cdFx0XHRcdC8vIGNyZWFzZSBhbmQgYm91bmRhcnkgcnVsZXNcblx0XHRcdFx0Ly8gY29uc29sZS53YXJuKCdjcmVhc2UgYW5kIGJvdW5kYXJ5IHJ1bGVzJyk7XG5cblx0XHRcdFx0aWYgKCBuID09IDIgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnMiBjb25uZWN0aW5nIGVkZ2VzJywgY29ubmVjdGluZ0VkZ2VzICk7XG5cdFx0XHRcdFx0c291cmNlVmVydGV4V2VpZ2h0ID0gMyAvIDQ7XG5cdFx0XHRcdFx0Y29ubmVjdGluZ1ZlcnRleFdlaWdodCA9IDEgLyA4O1xuXG5cdFx0XHRcdFx0Ly8gc291cmNlVmVydGV4V2VpZ2h0ID0gMTtcblx0XHRcdFx0XHQvLyBjb25uZWN0aW5nVmVydGV4V2VpZ2h0ID0gMDtcblxuXHRcdFx0XHR9IGVsc2UgaWYgKCBuID09IDEgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnb25seSAxIGNvbm5lY3RpbmcgZWRnZScgKTtcblxuXHRcdFx0XHR9IGVsc2UgaWYgKCBuID09IDAgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnMCBjb25uZWN0aW5nIGVkZ2VzJyApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRuZXdTb3VyY2VWZXJ0ZXggPSBvbGRWZXJ0ZXguY2xvbmUoKS5tdWx0aXBseVNjYWxhciggc291cmNlVmVydGV4V2VpZ2h0ICk7XG5cblx0XHRcdHRtcC5zZXQoIDAsIDAsIDAgKTtcblxuXHRcdFx0Zm9yICggaiA9IDA7IGogPCBuOyBqICsrICkge1xuXG5cdFx0XHRcdGNvbm5lY3RpbmdFZGdlID0gY29ubmVjdGluZ0VkZ2VzWyBqIF07XG5cdFx0XHRcdG90aGVyID0gY29ubmVjdGluZ0VkZ2UuYSAhPT0gb2xkVmVydGV4ID8gY29ubmVjdGluZ0VkZ2UuYSA6IGNvbm5lY3RpbmdFZGdlLmI7XG5cdFx0XHRcdHRtcC5hZGQoIG90aGVyICk7XG5cblx0XHRcdH1cblxuXHRcdFx0dG1wLm11bHRpcGx5U2NhbGFyKCBjb25uZWN0aW5nVmVydGV4V2VpZ2h0ICk7XG5cdFx0XHRuZXdTb3VyY2VWZXJ0ZXguYWRkKCB0bXAgKTtcblxuXHRcdFx0bmV3U291cmNlVmVydGljZXMucHVzaCggbmV3U291cmNlVmVydGV4ICk7XG5cblx0XHR9XG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0XHQgKlxuXHRcdCAqXHRTdGVwIDMuXG5cdFx0ICpcdEdlbmVyYXRlIEZhY2VzIGJldHdlZW4gc291cmNlIHZlcnRpY2VzXG5cdFx0ICpcdGFuZCBlZGdlIHZlcnRpY2VzLlxuXHRcdCAqXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHRuZXdWZXJ0aWNlcyA9IG5ld1NvdXJjZVZlcnRpY2VzLmNvbmNhdCggbmV3RWRnZVZlcnRpY2VzICk7XG5cdFx0dmFyIHNsID0gbmV3U291cmNlVmVydGljZXMubGVuZ3RoLCBlZGdlMSwgZWRnZTIsIGVkZ2UzO1xuXHRcdG5ld0ZhY2VzID0gW107XG5cblx0XHR2YXIgdXYsIHgwLCB4MSwgeDI7XG5cdFx0dmFyIHgzID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblx0XHR2YXIgeDQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXHRcdHZhciB4NSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0XHRmb3IgKCBpID0gMCwgaWwgPSBvbGRGYWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0ZmFjZSA9IG9sZEZhY2VzWyBpIF07XG5cblx0XHRcdC8vIGZpbmQgdGhlIDMgbmV3IGVkZ2VzIHZlcnRleCBvZiBlYWNoIG9sZCBmYWNlXG5cblx0XHRcdGVkZ2UxID0gZ2V0RWRnZSggZmFjZS5hLCBmYWNlLmIsIHNvdXJjZUVkZ2VzICkubmV3RWRnZSArIHNsO1xuXHRcdFx0ZWRnZTIgPSBnZXRFZGdlKCBmYWNlLmIsIGZhY2UuYywgc291cmNlRWRnZXMgKS5uZXdFZGdlICsgc2w7XG5cdFx0XHRlZGdlMyA9IGdldEVkZ2UoIGZhY2UuYywgZmFjZS5hLCBzb3VyY2VFZGdlcyApLm5ld0VkZ2UgKyBzbDtcblxuXHRcdFx0Ly8gY3JlYXRlIDQgZmFjZXMuXG5cblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBlZGdlMSwgZWRnZTIsIGVkZ2UzICk7XG5cdFx0XHRuZXdGYWNlKCBuZXdGYWNlcywgZmFjZS5hLCBlZGdlMSwgZWRnZTMgKTtcblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBmYWNlLmIsIGVkZ2UyLCBlZGdlMSApO1xuXHRcdFx0bmV3RmFjZSggbmV3RmFjZXMsIGZhY2UuYywgZWRnZTMsIGVkZ2UyICk7XG5cblx0XHRcdC8vIGNyZWF0ZSA0IG5ldyB1didzXG5cblx0XHRcdGlmICggaGFzVXZzICkge1xuXG5cdFx0XHRcdHV2ID0gb2xkVXZzWyBpIF07XG5cblx0XHRcdFx0eDAgPSB1dlsgMCBdO1xuXHRcdFx0XHR4MSA9IHV2WyAxIF07XG5cdFx0XHRcdHgyID0gdXZbIDIgXTtcblxuXHRcdFx0XHR4My5zZXQoIG1pZHBvaW50KCB4MC54LCB4MS54ICksIG1pZHBvaW50KCB4MC55LCB4MS55ICkgKTtcblx0XHRcdFx0eDQuc2V0KCBtaWRwb2ludCggeDEueCwgeDIueCApLCBtaWRwb2ludCggeDEueSwgeDIueSApICk7XG5cdFx0XHRcdHg1LnNldCggbWlkcG9pbnQoIHgwLngsIHgyLnggKSwgbWlkcG9pbnQoIHgwLnksIHgyLnkgKSApO1xuXG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgzLCB4NCwgeDUgKTtcblx0XHRcdFx0bmV3VXYoIG5ld1VWcywgeDAsIHgzLCB4NSApO1xuXG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgxLCB4NCwgeDMgKTtcblx0XHRcdFx0bmV3VXYoIG5ld1VWcywgeDIsIHg1LCB4NCApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBPdmVyd3JpdGUgb2xkIGFycmF5c1xuXHRcdGdlb21ldHJ5LnZlcnRpY2VzID0gbmV3VmVydGljZXM7XG5cdFx0Z2VvbWV0cnkuZmFjZXMgPSBuZXdGYWNlcztcblx0XHRpZiAoIGhhc1V2cyApIGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnNbIDAgXSA9IG5ld1VWcztcblxuXHRcdC8vIGNvbnNvbGUubG9nKCdkb25lJyk7XG5cblx0fTtcblxufSApKCk7XG4iLCJ2YXIgc3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuQXJyYXlcblxuZnVuY3Rpb24gYW5BcnJheShhcnIpIHtcbiAgcmV0dXJuIChcbiAgICAgICBhcnIuQllURVNfUEVSX0VMRU1FTlRcbiAgICAmJiBzdHIuY2FsbChhcnIuYnVmZmVyKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJ1xuICAgIHx8IEFycmF5LmlzQXJyYXkoYXJyKVxuICApXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG51bXR5cGUobnVtLCBkZWYpIHtcblx0cmV0dXJuIHR5cGVvZiBudW0gPT09ICdudW1iZXInXG5cdFx0PyBudW0gXG5cdFx0OiAodHlwZW9mIGRlZiA9PT0gJ251bWJlcicgPyBkZWYgOiAwKVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZHR5cGUpIHtcbiAgc3dpdGNoIChkdHlwZSkge1xuICAgIGNhc2UgJ2ludDgnOlxuICAgICAgcmV0dXJuIEludDhBcnJheVxuICAgIGNhc2UgJ2ludDE2JzpcbiAgICAgIHJldHVybiBJbnQxNkFycmF5XG4gICAgY2FzZSAnaW50MzInOlxuICAgICAgcmV0dXJuIEludDMyQXJyYXlcbiAgICBjYXNlICd1aW50OCc6XG4gICAgICByZXR1cm4gVWludDhBcnJheVxuICAgIGNhc2UgJ3VpbnQxNic6XG4gICAgICByZXR1cm4gVWludDE2QXJyYXlcbiAgICBjYXNlICd1aW50MzInOlxuICAgICAgcmV0dXJuIFVpbnQzMkFycmF5XG4gICAgY2FzZSAnZmxvYXQzMic6XG4gICAgICByZXR1cm4gRmxvYXQzMkFycmF5XG4gICAgY2FzZSAnZmxvYXQ2NCc6XG4gICAgICByZXR1cm4gRmxvYXQ2NEFycmF5XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5XG4gICAgY2FzZSAndWludDhfY2xhbXBlZCc6XG4gICAgICByZXR1cm4gVWludDhDbGFtcGVkQXJyYXlcbiAgfVxufVxuIiwiLyplc2xpbnQgbmV3LWNhcDowKi9cbnZhciBkdHlwZSA9IHJlcXVpcmUoJ2R0eXBlJylcbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlblZlcnRleERhdGFcbmZ1bmN0aW9uIGZsYXR0ZW5WZXJ0ZXhEYXRhIChkYXRhLCBvdXRwdXQsIG9mZnNldCkge1xuICBpZiAoIWRhdGEpIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSBkYXRhIGFzIGZpcnN0IHBhcmFtZXRlcicpXG4gIG9mZnNldCA9ICsob2Zmc2V0IHx8IDApIHwgMFxuXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIEFycmF5LmlzQXJyYXkoZGF0YVswXSkpIHtcbiAgICB2YXIgZGltID0gZGF0YVswXS5sZW5ndGhcbiAgICB2YXIgbGVuZ3RoID0gZGF0YS5sZW5ndGggKiBkaW1cblxuICAgIC8vIG5vIG91dHB1dCBzcGVjaWZpZWQsIGNyZWF0ZSBhIG5ldyB0eXBlZCBhcnJheVxuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvdXRwdXQgPSBuZXcgKGR0eXBlKG91dHB1dCB8fCAnZmxvYXQzMicpKShsZW5ndGggKyBvZmZzZXQpXG4gICAgfVxuXG4gICAgdmFyIGRzdExlbmd0aCA9IG91dHB1dC5sZW5ndGggLSBvZmZzZXRcbiAgICBpZiAobGVuZ3RoICE9PSBkc3RMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc291cmNlIGxlbmd0aCAnICsgbGVuZ3RoICsgJyAoJyArIGRpbSArICd4JyArIGRhdGEubGVuZ3RoICsgJyknICtcbiAgICAgICAgJyBkb2VzIG5vdCBtYXRjaCBkZXN0aW5hdGlvbiBsZW5ndGggJyArIGRzdExlbmd0aClcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgayA9IG9mZnNldDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZGltOyBqKyspIHtcbiAgICAgICAgb3V0cHV0W2srK10gPSBkYXRhW2ldW2pdXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBubyBvdXRwdXQsIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgIHZhciBDdG9yID0gZHR5cGUob3V0cHV0IHx8ICdmbG9hdDMyJylcbiAgICAgIGlmIChvZmZzZXQgPT09IDApIHtcbiAgICAgICAgb3V0cHV0ID0gbmV3IEN0b3IoZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IG5ldyBDdG9yKGRhdGEubGVuZ3RoICsgb2Zmc2V0KVxuICAgICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3RvcmUgb3V0cHV0IGluIGV4aXN0aW5nIGFycmF5XG4gICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBpbGUocHJvcGVydHkpIHtcblx0aWYgKCFwcm9wZXJ0eSB8fCB0eXBlb2YgcHJvcGVydHkgIT09ICdzdHJpbmcnKVxuXHRcdHRocm93IG5ldyBFcnJvcignbXVzdCBzcGVjaWZ5IHByb3BlcnR5IGZvciBpbmRleG9mIHNlYXJjaCcpXG5cblx0cmV0dXJuIG5ldyBGdW5jdGlvbignYXJyYXknLCAndmFsdWUnLCAnc3RhcnQnLCBbXG5cdFx0J3N0YXJ0ID0gc3RhcnQgfHwgMCcsXG5cdFx0J2ZvciAodmFyIGk9c3RhcnQ7IGk8YXJyYXkubGVuZ3RoOyBpKyspJyxcblx0XHQnICBpZiAoYXJyYXlbaV1bXCInICsgcHJvcGVydHkgKydcIl0gPT09IHZhbHVlKScsXG5cdFx0JyAgICAgIHJldHVybiBpJyxcblx0XHQncmV0dXJuIC0xJ1xuXHRdLmpvaW4oJ1xcbicpKVxufSIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwidmFyIHdvcmRXcmFwID0gcmVxdWlyZSgnd29yZC13cmFwcGVyJylcbnZhciB4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kJylcbnZhciBmaW5kQ2hhciA9IHJlcXVpcmUoJ2luZGV4b2YtcHJvcGVydHknKSgnaWQnKVxudmFyIG51bWJlciA9IHJlcXVpcmUoJ2FzLW51bWJlcicpXG5cbnZhciBYX0hFSUdIVFMgPSBbJ3gnLCAnZScsICdhJywgJ28nLCAnbicsICdzJywgJ3InLCAnYycsICd1JywgJ20nLCAndicsICd3JywgJ3onXVxudmFyIE1fV0lEVEhTID0gWydtJywgJ3cnXVxudmFyIENBUF9IRUlHSFRTID0gWydIJywgJ0knLCAnTicsICdFJywgJ0YnLCAnSycsICdMJywgJ1QnLCAnVScsICdWJywgJ1cnLCAnWCcsICdZJywgJ1onXVxuXG5cbnZhciBUQUJfSUQgPSAnXFx0Jy5jaGFyQ29kZUF0KDApXG52YXIgU1BBQ0VfSUQgPSAnICcuY2hhckNvZGVBdCgwKVxudmFyIEFMSUdOX0xFRlQgPSAwLCBcbiAgICBBTElHTl9DRU5URVIgPSAxLCBcbiAgICBBTElHTl9SSUdIVCA9IDJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVMYXlvdXQob3B0KSB7XG4gIHJldHVybiBuZXcgVGV4dExheW91dChvcHQpXG59XG5cbmZ1bmN0aW9uIFRleHRMYXlvdXQob3B0KSB7XG4gIHRoaXMuZ2x5cGhzID0gW11cbiAgdGhpcy5fbWVhc3VyZSA9IHRoaXMuY29tcHV0ZU1ldHJpY3MuYmluZCh0aGlzKVxuICB0aGlzLnVwZGF0ZShvcHQpXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG9wdCkge1xuICBvcHQgPSB4dGVuZCh7XG4gICAgbWVhc3VyZTogdGhpcy5fbWVhc3VyZVxuICB9LCBvcHQpXG4gIHRoaXMuX29wdCA9IG9wdFxuICB0aGlzLl9vcHQudGFiU2l6ZSA9IG51bWJlcih0aGlzLl9vcHQudGFiU2l6ZSwgNClcblxuICBpZiAoIW9wdC5mb250KVxuICAgIHRocm93IG5ldyBFcnJvcignbXVzdCBwcm92aWRlIGEgdmFsaWQgYml0bWFwIGZvbnQnKVxuXG4gIHZhciBnbHlwaHMgPSB0aGlzLmdseXBoc1xuICB2YXIgdGV4dCA9IG9wdC50ZXh0fHwnJyBcbiAgdmFyIGZvbnQgPSBvcHQuZm9udFxuICB0aGlzLl9zZXR1cFNwYWNlR2x5cGhzKGZvbnQpXG4gIFxuICB2YXIgbGluZXMgPSB3b3JkV3JhcC5saW5lcyh0ZXh0LCBvcHQpXG4gIHZhciBtaW5XaWR0aCA9IG9wdC53aWR0aCB8fCAwXG5cbiAgLy9jbGVhciBnbHlwaHNcbiAgZ2x5cGhzLmxlbmd0aCA9IDBcblxuICAvL2dldCBtYXggbGluZSB3aWR0aFxuICB2YXIgbWF4TGluZVdpZHRoID0gbGluZXMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGxpbmUpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgocHJldiwgbGluZS53aWR0aCwgbWluV2lkdGgpXG4gIH0sIDApXG5cbiAgLy90aGUgcGVuIHBvc2l0aW9uXG4gIHZhciB4ID0gMFxuICB2YXIgeSA9IDBcbiAgdmFyIGxpbmVIZWlnaHQgPSBudW1iZXIob3B0LmxpbmVIZWlnaHQsIGZvbnQuY29tbW9uLmxpbmVIZWlnaHQpXG4gIHZhciBiYXNlbGluZSA9IGZvbnQuY29tbW9uLmJhc2VcbiAgdmFyIGRlc2NlbmRlciA9IGxpbmVIZWlnaHQtYmFzZWxpbmVcbiAgdmFyIGxldHRlclNwYWNpbmcgPSBvcHQubGV0dGVyU3BhY2luZyB8fCAwXG4gIHZhciBoZWlnaHQgPSBsaW5lSGVpZ2h0ICogbGluZXMubGVuZ3RoIC0gZGVzY2VuZGVyXG4gIHZhciBhbGlnbiA9IGdldEFsaWduVHlwZSh0aGlzLl9vcHQuYWxpZ24pXG5cbiAgLy9kcmF3IHRleHQgYWxvbmcgYmFzZWxpbmVcbiAgeSAtPSBoZWlnaHRcbiAgXG4gIC8vdGhlIG1ldHJpY3MgZm9yIHRoaXMgdGV4dCBsYXlvdXRcbiAgdGhpcy5fd2lkdGggPSBtYXhMaW5lV2lkdGhcbiAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0XG4gIHRoaXMuX2Rlc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBiYXNlbGluZVxuICB0aGlzLl9iYXNlbGluZSA9IGJhc2VsaW5lXG4gIHRoaXMuX3hIZWlnaHQgPSBnZXRYSGVpZ2h0KGZvbnQpXG4gIHRoaXMuX2NhcEhlaWdodCA9IGdldENhcEhlaWdodChmb250KVxuICB0aGlzLl9saW5lSGVpZ2h0ID0gbGluZUhlaWdodFxuICB0aGlzLl9hc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBkZXNjZW5kZXIgLSB0aGlzLl94SGVpZ2h0XG4gICAgXG4gIC8vbGF5b3V0IGVhY2ggZ2x5cGhcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgbGluZUluZGV4KSB7XG4gICAgdmFyIHN0YXJ0ID0gbGluZS5zdGFydFxuICAgIHZhciBlbmQgPSBsaW5lLmVuZFxuICAgIHZhciBsaW5lV2lkdGggPSBsaW5lLndpZHRoXG4gICAgdmFyIGxhc3RHbHlwaFxuICAgIFxuICAgIC8vZm9yIGVhY2ggZ2x5cGggaW4gdGhhdCBsaW5lLi4uXG4gICAgZm9yICh2YXIgaT1zdGFydDsgaTxlbmQ7IGkrKykge1xuICAgICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgICB2YXIgZ2x5cGggPSBzZWxmLmdldEdseXBoKGZvbnQsIGlkKVxuICAgICAgaWYgKGdseXBoKSB7XG4gICAgICAgIGlmIChsYXN0R2x5cGgpIFxuICAgICAgICAgIHggKz0gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKVxuXG4gICAgICAgIHZhciB0eCA9IHhcbiAgICAgICAgaWYgKGFsaWduID09PSBBTElHTl9DRU5URVIpIFxuICAgICAgICAgIHR4ICs9IChtYXhMaW5lV2lkdGgtbGluZVdpZHRoKS8yXG4gICAgICAgIGVsc2UgaWYgKGFsaWduID09PSBBTElHTl9SSUdIVClcbiAgICAgICAgICB0eCArPSAobWF4TGluZVdpZHRoLWxpbmVXaWR0aClcblxuICAgICAgICBnbHlwaHMucHVzaCh7XG4gICAgICAgICAgcG9zaXRpb246IFt0eCwgeV0sXG4gICAgICAgICAgZGF0YTogZ2x5cGgsXG4gICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgbGluZTogbGluZUluZGV4XG4gICAgICAgIH0pICBcblxuICAgICAgICAvL21vdmUgcGVuIGZvcndhcmRcbiAgICAgICAgeCArPSBnbHlwaC54YWR2YW5jZSArIGxldHRlclNwYWNpbmdcbiAgICAgICAgbGFzdEdseXBoID0gZ2x5cGhcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL25leHQgbGluZSBkb3duXG4gICAgeSArPSBsaW5lSGVpZ2h0XG4gICAgeCA9IDBcbiAgfSlcbiAgdGhpcy5fbGluZXNUb3RhbCA9IGxpbmVzLmxlbmd0aDtcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuX3NldHVwU3BhY2VHbHlwaHMgPSBmdW5jdGlvbihmb250KSB7XG4gIC8vVGhlc2UgYXJlIGZhbGxiYWNrcywgd2hlbiB0aGUgZm9udCBkb2Vzbid0IGluY2x1ZGVcbiAgLy8nICcgb3IgJ1xcdCcgZ2x5cGhzXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IG51bGxcbiAgdGhpcy5fZmFsbGJhY2tUYWJHbHlwaCA9IG51bGxcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuXG5cbiAgLy90cnkgdG8gZ2V0IHNwYWNlIGdseXBoXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlICdtJyBvciAndycgZ2x5cGhzXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlIGZpcnN0IGdseXBoIGF2YWlsYWJsZVxuICB2YXIgc3BhY2UgPSBnZXRHbHlwaEJ5SWQoZm9udCwgU1BBQ0VfSUQpIFxuICAgICAgICAgIHx8IGdldE1HbHlwaChmb250KSBcbiAgICAgICAgICB8fCBmb250LmNoYXJzWzBdXG5cbiAgLy9hbmQgY3JlYXRlIGEgZmFsbGJhY2sgZm9yIHRhYlxuICB2YXIgdGFiV2lkdGggPSB0aGlzLl9vcHQudGFiU2l6ZSAqIHNwYWNlLnhhZHZhbmNlXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IHNwYWNlXG4gIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGggPSB4dGVuZChzcGFjZSwge1xuICAgIHg6IDAsIHk6IDAsIHhhZHZhbmNlOiB0YWJXaWR0aCwgaWQ6IFRBQl9JRCwgXG4gICAgeG9mZnNldDogMCwgeW9mZnNldDogMCwgd2lkdGg6IDAsIGhlaWdodDogMFxuICB9KVxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5nZXRHbHlwaCA9IGZ1bmN0aW9uKGZvbnQsIGlkKSB7XG4gIHZhciBnbHlwaCA9IGdldEdseXBoQnlJZChmb250LCBpZClcbiAgaWYgKGdseXBoKVxuICAgIHJldHVybiBnbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gVEFCX0lEKSBcbiAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tUYWJHbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gU1BBQ0VfSUQpIFxuICAgIHJldHVybiB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGhcbiAgcmV0dXJuIG51bGxcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuY29tcHV0ZU1ldHJpY3MgPSBmdW5jdGlvbih0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICB2YXIgbGV0dGVyU3BhY2luZyA9IHRoaXMuX29wdC5sZXR0ZXJTcGFjaW5nIHx8IDBcbiAgdmFyIGZvbnQgPSB0aGlzLl9vcHQuZm9udFxuICB2YXIgY3VyUGVuID0gMFxuICB2YXIgY3VyV2lkdGggPSAwXG4gIHZhciBjb3VudCA9IDBcbiAgdmFyIGdseXBoXG4gIHZhciBsYXN0R2x5cGhcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgZW5kOiBzdGFydCxcbiAgICAgIHdpZHRoOiAwXG4gICAgfVxuICB9XG5cbiAgZW5kID0gTWF0aC5taW4odGV4dC5sZW5ndGgsIGVuZClcbiAgZm9yICh2YXIgaT1zdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgdmFyIGdseXBoID0gdGhpcy5nZXRHbHlwaChmb250LCBpZClcblxuICAgIGlmIChnbHlwaCkge1xuICAgICAgLy9tb3ZlIHBlbiBmb3J3YXJkXG4gICAgICB2YXIgeG9mZiA9IGdseXBoLnhvZmZzZXRcbiAgICAgIHZhciBrZXJuID0gbGFzdEdseXBoID8gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKSA6IDBcbiAgICAgIGN1clBlbiArPSBrZXJuXG5cbiAgICAgIHZhciBuZXh0UGVuID0gY3VyUGVuICsgZ2x5cGgueGFkdmFuY2UgKyBsZXR0ZXJTcGFjaW5nXG4gICAgICB2YXIgbmV4dFdpZHRoID0gY3VyUGVuICsgZ2x5cGgud2lkdGhcblxuICAgICAgLy93ZSd2ZSBoaXQgb3VyIGxpbWl0OyB3ZSBjYW4ndCBtb3ZlIG9udG8gdGhlIG5leHQgZ2x5cGhcbiAgICAgIGlmIChuZXh0V2lkdGggPj0gd2lkdGggfHwgbmV4dFBlbiA+PSB3aWR0aClcbiAgICAgICAgYnJlYWtcblxuICAgICAgLy9vdGhlcndpc2UgY29udGludWUgYWxvbmcgb3VyIGxpbmVcbiAgICAgIGN1clBlbiA9IG5leHRQZW5cbiAgICAgIGN1cldpZHRoID0gbmV4dFdpZHRoXG4gICAgICBsYXN0R2x5cGggPSBnbHlwaFxuICAgIH1cbiAgICBjb3VudCsrXG4gIH1cbiAgXG4gIC8vbWFrZSBzdXJlIHJpZ2h0bW9zdCBlZGdlIGxpbmVzIHVwIHdpdGggcmVuZGVyZWQgZ2x5cGhzXG4gIGlmIChsYXN0R2x5cGgpXG4gICAgY3VyV2lkdGggKz0gbGFzdEdseXBoLnhvZmZzZXRcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBlbmQ6IHN0YXJ0ICsgY291bnQsXG4gICAgd2lkdGg6IGN1cldpZHRoXG4gIH1cbn1cblxuLy9nZXR0ZXJzIGZvciB0aGUgcHJpdmF0ZSB2YXJzXG47Wyd3aWR0aCcsICdoZWlnaHQnLCBcbiAgJ2Rlc2NlbmRlcicsICdhc2NlbmRlcicsXG4gICd4SGVpZ2h0JywgJ2Jhc2VsaW5lJyxcbiAgJ2NhcEhlaWdodCcsXG4gICdsaW5lSGVpZ2h0JyBdLmZvckVhY2goYWRkR2V0dGVyKVxuXG5mdW5jdGlvbiBhZGRHZXR0ZXIobmFtZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dExheW91dC5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICBnZXQ6IHdyYXBwZXIobmFtZSksXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG59XG5cbi8vY3JlYXRlIGxvb2t1cHMgZm9yIHByaXZhdGUgdmFyc1xuZnVuY3Rpb24gd3JhcHBlcihuYW1lKSB7XG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKFtcbiAgICAncmV0dXJuIGZ1bmN0aW9uICcrbmFtZSsnKCkgeycsXG4gICAgJyAgcmV0dXJuIHRoaXMuXycrbmFtZSxcbiAgICAnfSdcbiAgXS5qb2luKCdcXG4nKSkpKClcbn1cblxuZnVuY3Rpb24gZ2V0R2x5cGhCeUlkKGZvbnQsIGlkKSB7XG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gbnVsbFxuXG4gIHZhciBnbHlwaElkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICBpZiAoZ2x5cGhJZHggPj0gMClcbiAgICByZXR1cm4gZm9udC5jaGFyc1tnbHlwaElkeF1cbiAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gZ2V0WEhlaWdodChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxYX0hFSUdIVFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBYX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRNR2x5cGgoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8TV9XSURUSFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBNX1dJRFRIU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdXG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0Q2FwSGVpZ2h0KGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPENBUF9IRUlHSFRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gQ0FQX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRLZXJuaW5nKGZvbnQsIGxlZnQsIHJpZ2h0KSB7XG4gIGlmICghZm9udC5rZXJuaW5ncyB8fCBmb250Lmtlcm5pbmdzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gMFxuXG4gIHZhciB0YWJsZSA9IGZvbnQua2VybmluZ3NcbiAgZm9yICh2YXIgaT0wOyBpPHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtlcm4gPSB0YWJsZVtpXVxuICAgIGlmIChrZXJuLmZpcnN0ID09PSBsZWZ0ICYmIGtlcm4uc2Vjb25kID09PSByaWdodClcbiAgICAgIHJldHVybiBrZXJuLmFtb3VudFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldEFsaWduVHlwZShhbGlnbikge1xuICBpZiAoYWxpZ24gPT09ICdjZW50ZXInKVxuICAgIHJldHVybiBBTElHTl9DRU5URVJcbiAgZWxzZSBpZiAoYWxpZ24gPT09ICdyaWdodCcpXG4gICAgcmV0dXJuIEFMSUdOX1JJR0hUXG4gIHJldHVybiBBTElHTl9MRUZUXG59IiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUJNRm9udEFzY2lpKGRhdGEpIHtcbiAgaWYgKCFkYXRhKVxuICAgIHRocm93IG5ldyBFcnJvcignbm8gZGF0YSBwcm92aWRlZCcpXG4gIGRhdGEgPSBkYXRhLnRvU3RyaW5nKCkudHJpbSgpXG5cbiAgdmFyIG91dHB1dCA9IHtcbiAgICBwYWdlczogW10sXG4gICAgY2hhcnM6IFtdLFxuICAgIGtlcm5pbmdzOiBbXVxuICB9XG5cbiAgdmFyIGxpbmVzID0gZGF0YS5zcGxpdCgvXFxyXFxuP3xcXG4vZylcblxuICBpZiAobGluZXMubGVuZ3RoID09PSAwKVxuICAgIHRocm93IG5ldyBFcnJvcignbm8gZGF0YSBpbiBCTUZvbnQgZmlsZScpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBsaW5lRGF0YSA9IHNwbGl0TGluZShsaW5lc1tpXSwgaSlcbiAgICBpZiAoIWxpbmVEYXRhKSAvL3NraXAgZW1wdHkgbGluZXNcbiAgICAgIGNvbnRpbnVlXG5cbiAgICBpZiAobGluZURhdGEua2V5ID09PSAncGFnZScpIHtcbiAgICAgIGlmICh0eXBlb2YgbGluZURhdGEuZGF0YS5pZCAhPT0gJ251bWJlcicpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWFsZm9ybWVkIGZpbGUgYXQgbGluZSAnICsgaSArICcgLS0gbmVlZHMgcGFnZSBpZD1OJylcbiAgICAgIGlmICh0eXBlb2YgbGluZURhdGEuZGF0YS5maWxlICE9PSAnc3RyaW5nJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYWxmb3JtZWQgZmlsZSBhdCBsaW5lICcgKyBpICsgJyAtLSBuZWVkcyBwYWdlIGZpbGU9XCJwYXRoXCInKVxuICAgICAgb3V0cHV0LnBhZ2VzW2xpbmVEYXRhLmRhdGEuaWRdID0gbGluZURhdGEuZGF0YS5maWxlXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdjaGFycycgfHwgbGluZURhdGEua2V5ID09PSAna2VybmluZ3MnKSB7XG4gICAgICAvLy4uLiBkbyBub3RoaW5nIGZvciB0aGVzZSB0d28gLi4uXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdjaGFyJykge1xuICAgICAgb3V0cHV0LmNoYXJzLnB1c2gobGluZURhdGEuZGF0YSlcbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2tlcm5pbmcnKSB7XG4gICAgICBvdXRwdXQua2VybmluZ3MucHVzaChsaW5lRGF0YS5kYXRhKVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXRbbGluZURhdGEua2V5XSA9IGxpbmVEYXRhLmRhdGFcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG5cbmZ1bmN0aW9uIHNwbGl0TGluZShsaW5lLCBpZHgpIHtcbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFx0Ky9nLCAnICcpLnRyaW0oKVxuICBpZiAoIWxpbmUpXG4gICAgcmV0dXJuIG51bGxcblxuICB2YXIgc3BhY2UgPSBsaW5lLmluZGV4T2YoJyAnKVxuICBpZiAoc3BhY2UgPT09IC0xKSBcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJubyBuYW1lZCByb3cgYXQgbGluZSBcIiArIGlkeClcblxuICB2YXIga2V5ID0gbGluZS5zdWJzdHJpbmcoMCwgc3BhY2UpXG5cbiAgbGluZSA9IGxpbmUuc3Vic3RyaW5nKHNwYWNlICsgMSlcbiAgLy9jbGVhciBcImxldHRlclwiIGZpZWxkIGFzIGl0IGlzIG5vbi1zdGFuZGFyZCBhbmRcbiAgLy9yZXF1aXJlcyBhZGRpdGlvbmFsIGNvbXBsZXhpdHkgdG8gcGFyc2UgXCIgLyA9IHN5bWJvbHNcbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvbGV0dGVyPVtcXCdcXFwiXVxcUytbXFwnXFxcIl0vZ2ksICcnKSAgXG4gIGxpbmUgPSBsaW5lLnNwbGl0KFwiPVwiKVxuICBsaW5lID0gbGluZS5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50cmltKCkubWF0Y2goKC8oXCIuKj9cInxbXlwiXFxzXSspKyg/PVxccyp8XFxzKiQpL2cpKVxuICB9KVxuXG4gIHZhciBkYXRhID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGR0ID0gbGluZVtpXVxuICAgIGlmIChpID09PSAwKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBrZXk6IGR0WzBdLFxuICAgICAgICBkYXRhOiBcIlwiXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoaSA9PT0gbGluZS5sZW5ndGggLSAxKSB7XG4gICAgICBkYXRhW2RhdGEubGVuZ3RoIC0gMV0uZGF0YSA9IHBhcnNlRGF0YShkdFswXSlcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGEgPSBwYXJzZURhdGEoZHRbMF0pXG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBrZXk6IGR0WzFdLFxuICAgICAgICBkYXRhOiBcIlwiXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHZhciBvdXQgPSB7XG4gICAga2V5OiBrZXksXG4gICAgZGF0YToge31cbiAgfVxuXG4gIGRhdGEuZm9yRWFjaChmdW5jdGlvbih2KSB7XG4gICAgb3V0LmRhdGFbdi5rZXldID0gdi5kYXRhO1xuICB9KVxuXG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gcGFyc2VEYXRhKGRhdGEpIHtcbiAgaWYgKCFkYXRhIHx8IGRhdGEubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBcIlwiXG5cbiAgaWYgKGRhdGEuaW5kZXhPZignXCInKSA9PT0gMCB8fCBkYXRhLmluZGV4T2YoXCInXCIpID09PSAwKVxuICAgIHJldHVybiBkYXRhLnN1YnN0cmluZygxLCBkYXRhLmxlbmd0aCAtIDEpXG4gIGlmIChkYXRhLmluZGV4T2YoJywnKSAhPT0gLTEpXG4gICAgcmV0dXJuIHBhcnNlSW50TGlzdChkYXRhKVxuICByZXR1cm4gcGFyc2VJbnQoZGF0YSwgMTApXG59XG5cbmZ1bmN0aW9uIHBhcnNlSW50TGlzdChkYXRhKSB7XG4gIHJldHVybiBkYXRhLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKHZhbCkge1xuICAgIHJldHVybiBwYXJzZUludCh2YWwsIDEwKVxuICB9KVxufSIsInZhciBkdHlwZSA9IHJlcXVpcmUoJ2R0eXBlJylcbnZhciBhbkFycmF5ID0gcmVxdWlyZSgnYW4tYXJyYXknKVxudmFyIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJylcblxudmFyIENXID0gWzAsIDIsIDNdXG52YXIgQ0NXID0gWzIsIDEsIDNdXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUXVhZEVsZW1lbnRzKGFycmF5LCBvcHQpIHtcbiAgICAvL2lmIHVzZXIgZGlkbid0IHNwZWNpZnkgYW4gb3V0cHV0IGFycmF5XG4gICAgaWYgKCFhcnJheSB8fCAhKGFuQXJyYXkoYXJyYXkpIHx8IGlzQnVmZmVyKGFycmF5KSkpIHtcbiAgICAgICAgb3B0ID0gYXJyYXkgfHwge31cbiAgICAgICAgYXJyYXkgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHQgPT09ICdudW1iZXInKSAvL2JhY2t3YXJkcy1jb21wYXRpYmxlXG4gICAgICAgIG9wdCA9IHsgY291bnQ6IG9wdCB9XG4gICAgZWxzZVxuICAgICAgICBvcHQgPSBvcHQgfHwge31cblxuICAgIHZhciB0eXBlID0gdHlwZW9mIG9wdC50eXBlID09PSAnc3RyaW5nJyA/IG9wdC50eXBlIDogJ3VpbnQxNidcbiAgICB2YXIgY291bnQgPSB0eXBlb2Ygb3B0LmNvdW50ID09PSAnbnVtYmVyJyA/IG9wdC5jb3VudCA6IDFcbiAgICB2YXIgc3RhcnQgPSAob3B0LnN0YXJ0IHx8IDApIFxuXG4gICAgdmFyIGRpciA9IG9wdC5jbG9ja3dpc2UgIT09IGZhbHNlID8gQ1cgOiBDQ1csXG4gICAgICAgIGEgPSBkaXJbMF0sIFxuICAgICAgICBiID0gZGlyWzFdLFxuICAgICAgICBjID0gZGlyWzJdXG5cbiAgICB2YXIgbnVtSW5kaWNlcyA9IGNvdW50ICogNlxuXG4gICAgdmFyIGluZGljZXMgPSBhcnJheSB8fCBuZXcgKGR0eXBlKHR5cGUpKShudW1JbmRpY2VzKVxuICAgIGZvciAodmFyIGkgPSAwLCBqID0gMDsgaSA8IG51bUluZGljZXM7IGkgKz0gNiwgaiArPSA0KSB7XG4gICAgICAgIHZhciB4ID0gaSArIHN0YXJ0XG4gICAgICAgIGluZGljZXNbeCArIDBdID0gaiArIDBcbiAgICAgICAgaW5kaWNlc1t4ICsgMV0gPSBqICsgMVxuICAgICAgICBpbmRpY2VzW3ggKyAyXSA9IGogKyAyXG4gICAgICAgIGluZGljZXNbeCArIDNdID0gaiArIGFcbiAgICAgICAgaW5kaWNlc1t4ICsgNF0gPSBqICsgYlxuICAgICAgICBpbmRpY2VzW3ggKyA1XSA9IGogKyBjXG4gICAgfVxuICAgIHJldHVybiBpbmRpY2VzXG59IiwidmFyIGNyZWF0ZUxheW91dCA9IHJlcXVpcmUoJ2xheW91dC1ibWZvbnQtdGV4dCcpXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG52YXIgY3JlYXRlSW5kaWNlcyA9IHJlcXVpcmUoJ3F1YWQtaW5kaWNlcycpXG52YXIgYnVmZmVyID0gcmVxdWlyZSgndGhyZWUtYnVmZmVyLXZlcnRleC1kYXRhJylcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJylcblxudmFyIHZlcnRpY2VzID0gcmVxdWlyZSgnLi9saWIvdmVydGljZXMnKVxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi9saWIvdXRpbHMnKVxuXG52YXIgQmFzZSA9IFRIUkVFLkJ1ZmZlckdlb21ldHJ5XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlVGV4dEdlb21ldHJ5IChvcHQpIHtcbiAgcmV0dXJuIG5ldyBUZXh0R2VvbWV0cnkob3B0KVxufVxuXG5mdW5jdGlvbiBUZXh0R2VvbWV0cnkgKG9wdCkge1xuICBCYXNlLmNhbGwodGhpcylcblxuICBpZiAodHlwZW9mIG9wdCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHQgPSB7IHRleHQ6IG9wdCB9XG4gIH1cblxuICAvLyB1c2UgdGhlc2UgYXMgZGVmYXVsdCB2YWx1ZXMgZm9yIGFueSBzdWJzZXF1ZW50XG4gIC8vIGNhbGxzIHRvIHVwZGF0ZSgpXG4gIHRoaXMuX29wdCA9IGFzc2lnbih7fSwgb3B0KVxuXG4gIC8vIGFsc28gZG8gYW4gaW5pdGlhbCBzZXR1cC4uLlxuICBpZiAob3B0KSB0aGlzLnVwZGF0ZShvcHQpXG59XG5cbmluaGVyaXRzKFRleHRHZW9tZXRyeSwgQmFzZSlcblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAob3B0KSB7XG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJykge1xuICAgIG9wdCA9IHsgdGV4dDogb3B0IH1cbiAgfVxuXG4gIC8vIHVzZSBjb25zdHJ1Y3RvciBkZWZhdWx0c1xuICBvcHQgPSBhc3NpZ24oe30sIHRoaXMuX29wdCwgb3B0KVxuXG4gIGlmICghb3B0LmZvbnQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHNwZWNpZnkgYSB7IGZvbnQgfSBpbiBvcHRpb25zJylcbiAgfVxuXG4gIHRoaXMubGF5b3V0ID0gY3JlYXRlTGF5b3V0KG9wdClcblxuICAvLyBnZXQgdmVjMiB0ZXhjb29yZHNcbiAgdmFyIGZsaXBZID0gb3B0LmZsaXBZICE9PSBmYWxzZVxuXG4gIC8vIHRoZSBkZXNpcmVkIEJNRm9udCBkYXRhXG4gIHZhciBmb250ID0gb3B0LmZvbnRcblxuICAvLyBkZXRlcm1pbmUgdGV4dHVyZSBzaXplIGZyb20gZm9udCBmaWxlXG4gIHZhciB0ZXhXaWR0aCA9IGZvbnQuY29tbW9uLnNjYWxlV1xuICB2YXIgdGV4SGVpZ2h0ID0gZm9udC5jb21tb24uc2NhbGVIXG5cbiAgLy8gZ2V0IHZpc2libGUgZ2x5cGhzXG4gIHZhciBnbHlwaHMgPSB0aGlzLmxheW91dC5nbHlwaHMuZmlsdGVyKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG4gICAgcmV0dXJuIGJpdG1hcC53aWR0aCAqIGJpdG1hcC5oZWlnaHQgPiAwXG4gIH0pXG5cbiAgLy8gcHJvdmlkZSB2aXNpYmxlIGdseXBocyBmb3IgY29udmVuaWVuY2VcbiAgdGhpcy52aXNpYmxlR2x5cGhzID0gZ2x5cGhzXG5cbiAgLy8gZ2V0IGNvbW1vbiB2ZXJ0ZXggZGF0YVxuICB2YXIgcG9zaXRpb25zID0gdmVydGljZXMucG9zaXRpb25zKGdseXBocylcbiAgdmFyIHV2cyA9IHZlcnRpY2VzLnV2cyhnbHlwaHMsIHRleFdpZHRoLCB0ZXhIZWlnaHQsIGZsaXBZKVxuICB2YXIgaW5kaWNlcyA9IGNyZWF0ZUluZGljZXMoe1xuICAgIGNsb2Nrd2lzZTogdHJ1ZSxcbiAgICB0eXBlOiAndWludDE2JyxcbiAgICBjb3VudDogZ2x5cGhzLmxlbmd0aFxuICB9KVxuXG4gIC8vIHVwZGF0ZSB2ZXJ0ZXggZGF0YVxuICBidWZmZXIuaW5kZXgodGhpcywgaW5kaWNlcywgMSwgJ3VpbnQxNicpXG4gIGJ1ZmZlci5hdHRyKHRoaXMsICdwb3NpdGlvbicsIHBvc2l0aW9ucywgMilcbiAgYnVmZmVyLmF0dHIodGhpcywgJ3V2JywgdXZzLCAyKVxuXG4gIC8vIHVwZGF0ZSBtdWx0aXBhZ2UgZGF0YVxuICBpZiAoIW9wdC5tdWx0aXBhZ2UgJiYgJ3BhZ2UnIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIC8vIGRpc2FibGUgbXVsdGlwYWdlIHJlbmRlcmluZ1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdwYWdlJylcbiAgfSBlbHNlIGlmIChvcHQubXVsdGlwYWdlKSB7XG4gICAgdmFyIHBhZ2VzID0gdmVydGljZXMucGFnZXMoZ2x5cGhzKVxuICAgIC8vIGVuYWJsZSBtdWx0aXBhZ2UgcmVuZGVyaW5nXG4gICAgYnVmZmVyLmF0dHIodGhpcywgJ3BhZ2UnLCBwYWdlcywgMSlcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVCb3VuZGluZ1NwaGVyZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYm91bmRpbmdTcGhlcmUgPT09IG51bGwpIHtcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlID0gbmV3IFRIUkVFLlNwaGVyZSgpXG4gIH1cblxuICB2YXIgcG9zaXRpb25zID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5XG4gIHZhciBpdGVtU2l6ZSA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5pdGVtU2l6ZVxuICBpZiAoIXBvc2l0aW9ucyB8fCAhaXRlbVNpemUgfHwgcG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlLnJhZGl1cyA9IDBcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlLmNlbnRlci5zZXQoMCwgMCwgMClcbiAgICByZXR1cm5cbiAgfVxuICB1dGlscy5jb21wdXRlU3BoZXJlKHBvc2l0aW9ucywgdGhpcy5ib3VuZGluZ1NwaGVyZSlcbiAgaWYgKGlzTmFOKHRoaXMuYm91bmRpbmdTcGhlcmUucmFkaXVzKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1RIUkVFLkJ1ZmZlckdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpOiAnICtcbiAgICAgICdDb21wdXRlZCByYWRpdXMgaXMgTmFOLiBUaGUgJyArXG4gICAgICAnXCJwb3NpdGlvblwiIGF0dHJpYnV0ZSBpcyBsaWtlbHkgdG8gaGF2ZSBOYU4gdmFsdWVzLicpXG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS5jb21wdXRlQm91bmRpbmdCb3ggPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmJvdW5kaW5nQm94ID09PSBudWxsKSB7XG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IG5ldyBUSFJFRS5Cb3gzKClcbiAgfVxuXG4gIHZhciBiYm94ID0gdGhpcy5ib3VuZGluZ0JveFxuICB2YXIgcG9zaXRpb25zID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5XG4gIHZhciBpdGVtU2l6ZSA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5pdGVtU2l6ZVxuICBpZiAoIXBvc2l0aW9ucyB8fCAhaXRlbVNpemUgfHwgcG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICBiYm94Lm1ha2VFbXB0eSgpXG4gICAgcmV0dXJuXG4gIH1cbiAgdXRpbHMuY29tcHV0ZUJveChwb3NpdGlvbnMsIGJib3gpXG59XG4iLCJ2YXIgaXRlbVNpemUgPSAyXG52YXIgYm94ID0geyBtaW46IFswLCAwXSwgbWF4OiBbMCwgMF0gfVxuXG5mdW5jdGlvbiBib3VuZHMgKHBvc2l0aW9ucykge1xuICB2YXIgY291bnQgPSBwb3NpdGlvbnMubGVuZ3RoIC8gaXRlbVNpemVcbiAgYm94Lm1pblswXSA9IHBvc2l0aW9uc1swXVxuICBib3gubWluWzFdID0gcG9zaXRpb25zWzFdXG4gIGJveC5tYXhbMF0gPSBwb3NpdGlvbnNbMF1cbiAgYm94Lm1heFsxXSA9IHBvc2l0aW9uc1sxXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIHZhciB4ID0gcG9zaXRpb25zW2kgKiBpdGVtU2l6ZSArIDBdXG4gICAgdmFyIHkgPSBwb3NpdGlvbnNbaSAqIGl0ZW1TaXplICsgMV1cbiAgICBib3gubWluWzBdID0gTWF0aC5taW4oeCwgYm94Lm1pblswXSlcbiAgICBib3gubWluWzFdID0gTWF0aC5taW4oeSwgYm94Lm1pblsxXSlcbiAgICBib3gubWF4WzBdID0gTWF0aC5tYXgoeCwgYm94Lm1heFswXSlcbiAgICBib3gubWF4WzFdID0gTWF0aC5tYXgoeSwgYm94Lm1heFsxXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlQm94ID0gZnVuY3Rpb24gKHBvc2l0aW9ucywgb3V0cHV0KSB7XG4gIGJvdW5kcyhwb3NpdGlvbnMpXG4gIG91dHB1dC5taW4uc2V0KGJveC5taW5bMF0sIGJveC5taW5bMV0sIDApXG4gIG91dHB1dC5tYXguc2V0KGJveC5tYXhbMF0sIGJveC5tYXhbMV0sIDApXG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbXB1dGVTcGhlcmUgPSBmdW5jdGlvbiAocG9zaXRpb25zLCBvdXRwdXQpIHtcbiAgYm91bmRzKHBvc2l0aW9ucylcbiAgdmFyIG1pblggPSBib3gubWluWzBdXG4gIHZhciBtaW5ZID0gYm94Lm1pblsxXVxuICB2YXIgbWF4WCA9IGJveC5tYXhbMF1cbiAgdmFyIG1heFkgPSBib3gubWF4WzFdXG4gIHZhciB3aWR0aCA9IG1heFggLSBtaW5YXG4gIHZhciBoZWlnaHQgPSBtYXhZIC0gbWluWVxuICB2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHdpZHRoICogd2lkdGggKyBoZWlnaHQgKiBoZWlnaHQpXG4gIG91dHB1dC5jZW50ZXIuc2V0KG1pblggKyB3aWR0aCAvIDIsIG1pblkgKyBoZWlnaHQgLyAyLCAwKVxuICBvdXRwdXQucmFkaXVzID0gbGVuZ3RoIC8gMlxufVxuIiwibW9kdWxlLmV4cG9ydHMucGFnZXMgPSBmdW5jdGlvbiBwYWdlcyAoZ2x5cGhzKSB7XG4gIHZhciBwYWdlcyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAxKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGlkID0gZ2x5cGguZGF0YS5wYWdlIHx8IDBcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgfSlcbiAgcmV0dXJuIHBhZ2VzXG59XG5cbm1vZHVsZS5leHBvcnRzLnV2cyA9IGZ1bmN0aW9uIHV2cyAoZ2x5cGhzLCB0ZXhXaWR0aCwgdGV4SGVpZ2h0LCBmbGlwWSkge1xuICB2YXIgdXZzID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDIpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuICAgIHZhciBidyA9IChiaXRtYXAueCArIGJpdG1hcC53aWR0aClcbiAgICB2YXIgYmggPSAoYml0bWFwLnkgKyBiaXRtYXAuaGVpZ2h0KVxuXG4gICAgLy8gdG9wIGxlZnQgcG9zaXRpb25cbiAgICB2YXIgdTAgPSBiaXRtYXAueCAvIHRleFdpZHRoXG4gICAgdmFyIHYxID0gYml0bWFwLnkgLyB0ZXhIZWlnaHRcbiAgICB2YXIgdTEgPSBidyAvIHRleFdpZHRoXG4gICAgdmFyIHYwID0gYmggLyB0ZXhIZWlnaHRcblxuICAgIGlmIChmbGlwWSkge1xuICAgICAgdjEgPSAodGV4SGVpZ2h0IC0gYml0bWFwLnkpIC8gdGV4SGVpZ2h0XG4gICAgICB2MCA9ICh0ZXhIZWlnaHQgLSBiaCkgLyB0ZXhIZWlnaHRcbiAgICB9XG5cbiAgICAvLyBCTFxuICAgIHV2c1tpKytdID0gdTBcbiAgICB1dnNbaSsrXSA9IHYxXG4gICAgLy8gVExcbiAgICB1dnNbaSsrXSA9IHUwXG4gICAgdXZzW2krK10gPSB2MFxuICAgIC8vIFRSXG4gICAgdXZzW2krK10gPSB1MVxuICAgIHV2c1tpKytdID0gdjBcbiAgICAvLyBCUlxuICAgIHV2c1tpKytdID0gdTFcbiAgICB1dnNbaSsrXSA9IHYxXG4gIH0pXG4gIHJldHVybiB1dnNcbn1cblxubW9kdWxlLmV4cG9ydHMucG9zaXRpb25zID0gZnVuY3Rpb24gcG9zaXRpb25zIChnbHlwaHMpIHtcbiAgdmFyIHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAyKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcblxuICAgIC8vIGJvdHRvbSBsZWZ0IHBvc2l0aW9uXG4gICAgdmFyIHggPSBnbHlwaC5wb3NpdGlvblswXSArIGJpdG1hcC54b2Zmc2V0XG4gICAgdmFyIHkgPSBnbHlwaC5wb3NpdGlvblsxXSArIGJpdG1hcC55b2Zmc2V0XG5cbiAgICAvLyBxdWFkIHNpemVcbiAgICB2YXIgdyA9IGJpdG1hcC53aWR0aFxuICAgIHZhciBoID0gYml0bWFwLmhlaWdodFxuXG4gICAgLy8gQkxcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHhcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHlcbiAgICAvLyBUTFxuICAgIHBvc2l0aW9uc1tpKytdID0geFxuICAgIHBvc2l0aW9uc1tpKytdID0geSArIGhcbiAgICAvLyBUUlxuICAgIHBvc2l0aW9uc1tpKytdID0geCArIHdcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHkgKyBoXG4gICAgLy8gQlJcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHggKyB3XG4gICAgcG9zaXRpb25zW2krK10gPSB5XG4gIH0pXG4gIHJldHVybiBwb3NpdGlvbnNcbn1cbiIsInZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTREZTaGFkZXIgKG9wdCkge1xuICBvcHQgPSBvcHQgfHwge31cbiAgdmFyIG9wYWNpdHkgPSB0eXBlb2Ygb3B0Lm9wYWNpdHkgPT09ICdudW1iZXInID8gb3B0Lm9wYWNpdHkgOiAxXG4gIHZhciBhbHBoYVRlc3QgPSB0eXBlb2Ygb3B0LmFscGhhVGVzdCA9PT0gJ251bWJlcicgPyBvcHQuYWxwaGFUZXN0IDogMC4wMDAxXG4gIHZhciBwcmVjaXNpb24gPSBvcHQucHJlY2lzaW9uIHx8ICdoaWdocCdcbiAgdmFyIGNvbG9yID0gb3B0LmNvbG9yXG4gIHZhciBtYXAgPSBvcHQubWFwXG5cbiAgLy8gcmVtb3ZlIHRvIHNhdGlzZnkgcjczXG4gIGRlbGV0ZSBvcHQubWFwXG4gIGRlbGV0ZSBvcHQuY29sb3JcbiAgZGVsZXRlIG9wdC5wcmVjaXNpb25cbiAgZGVsZXRlIG9wdC5vcGFjaXR5XG5cbiAgcmV0dXJuIGFzc2lnbih7XG4gICAgdW5pZm9ybXM6IHtcbiAgICAgIG9wYWNpdHk6IHsgdHlwZTogJ2YnLCB2YWx1ZTogb3BhY2l0eSB9LFxuICAgICAgbWFwOiB7IHR5cGU6ICd0JywgdmFsdWU6IG1hcCB8fCBuZXcgVEhSRUUuVGV4dHVyZSgpIH0sXG4gICAgICBjb2xvcjogeyB0eXBlOiAnYycsIHZhbHVlOiBuZXcgVEhSRUUuQ29sb3IoY29sb3IpIH1cbiAgICB9LFxuICAgIHZlcnRleFNoYWRlcjogW1xuICAgICAgJ2F0dHJpYnV0ZSB2ZWMyIHV2OycsXG4gICAgICAnYXR0cmlidXRlIHZlYzQgcG9zaXRpb247JyxcbiAgICAgICd1bmlmb3JtIG1hdDQgcHJvamVjdGlvbk1hdHJpeDsnLFxuICAgICAgJ3VuaWZvcm0gbWF0NCBtb2RlbFZpZXdNYXRyaXg7JyxcbiAgICAgICd2YXJ5aW5nIHZlYzIgdlV2OycsXG4gICAgICAndm9pZCBtYWluKCkgeycsXG4gICAgICAndlV2ID0gdXY7JyxcbiAgICAgICdnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiBwb3NpdGlvbjsnLFxuICAgICAgJ30nXG4gICAgXS5qb2luKCdcXG4nKSxcbiAgICBmcmFnbWVudFNoYWRlcjogW1xuICAgICAgJyNpZmRlZiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgJyNleHRlbnNpb24gR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzIDogZW5hYmxlJyxcbiAgICAgICcjZW5kaWYnLFxuICAgICAgJ3ByZWNpc2lvbiAnICsgcHJlY2lzaW9uICsgJyBmbG9hdDsnLFxuICAgICAgJ3VuaWZvcm0gZmxvYXQgb3BhY2l0eTsnLFxuICAgICAgJ3VuaWZvcm0gdmVjMyBjb2xvcjsnLFxuICAgICAgJ3VuaWZvcm0gc2FtcGxlcjJEIG1hcDsnLFxuICAgICAgJ3ZhcnlpbmcgdmVjMiB2VXY7JyxcblxuICAgICAgJ2Zsb2F0IGFhc3RlcChmbG9hdCB2YWx1ZSkgeycsXG4gICAgICAnICAjaWZkZWYgR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcbiAgICAgICcgICAgZmxvYXQgYWZ3aWR0aCA9IGxlbmd0aCh2ZWMyKGRGZHgodmFsdWUpLCBkRmR5KHZhbHVlKSkpICogMC43MDcxMDY3ODExODY1NDc1NzsnLFxuICAgICAgJyAgI2Vsc2UnLFxuICAgICAgJyAgICBmbG9hdCBhZndpZHRoID0gKDEuMCAvIDMyLjApICogKDEuNDE0MjEzNTYyMzczMDk1MSAvICgyLjAgKiBnbF9GcmFnQ29vcmQudykpOycsXG4gICAgICAnICAjZW5kaWYnLFxuICAgICAgJyAgcmV0dXJuIHNtb290aHN0ZXAoMC41IC0gYWZ3aWR0aCwgMC41ICsgYWZ3aWR0aCwgdmFsdWUpOycsXG4gICAgICAnfScsXG5cbiAgICAgICd2b2lkIG1haW4oKSB7JyxcbiAgICAgICcgIHZlYzQgdGV4Q29sb3IgPSB0ZXh0dXJlMkQobWFwLCB2VXYpOycsXG4gICAgICAnICBmbG9hdCBhbHBoYSA9IGFhc3RlcCh0ZXhDb2xvci5hKTsnLFxuICAgICAgJyAgZ2xfRnJhZ0NvbG9yID0gdmVjNChjb2xvciwgb3BhY2l0eSAqIGFscGhhKTsnLFxuICAgICAgYWxwaGFUZXN0ID09PSAwXG4gICAgICAgID8gJydcbiAgICAgICAgOiAnICBpZiAoZ2xfRnJhZ0NvbG9yLmEgPCAnICsgYWxwaGFUZXN0ICsgJykgZGlzY2FyZDsnLFxuICAgICAgJ30nXG4gICAgXS5qb2luKCdcXG4nKVxuICB9LCBvcHQpXG59XG4iLCJ2YXIgZmxhdHRlbiA9IHJlcXVpcmUoJ2ZsYXR0ZW4tdmVydGV4LWRhdGEnKVxudmFyIHdhcm5lZCA9IGZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cy5hdHRyID0gc2V0QXR0cmlidXRlXG5tb2R1bGUuZXhwb3J0cy5pbmRleCA9IHNldEluZGV4XG5cbmZ1bmN0aW9uIHNldEluZGV4IChnZW9tZXRyeSwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGlmICh0eXBlb2YgaXRlbVNpemUgIT09ICdudW1iZXInKSBpdGVtU2l6ZSA9IDFcbiAgaWYgKHR5cGVvZiBkdHlwZSAhPT0gJ3N0cmluZycpIGR0eXBlID0gJ3VpbnQxNidcblxuICB2YXIgaXNSNjkgPSAhZ2VvbWV0cnkuaW5kZXggJiYgdHlwZW9mIGdlb21ldHJ5LnNldEluZGV4ICE9PSAnZnVuY3Rpb24nXG4gIHZhciBhdHRyaWIgPSBpc1I2OSA/IGdlb21ldHJ5LmdldEF0dHJpYnV0ZSgnaW5kZXgnKSA6IGdlb21ldHJ5LmluZGV4XG4gIHZhciBuZXdBdHRyaWIgPSB1cGRhdGVBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpXG4gIGlmIChuZXdBdHRyaWIpIHtcbiAgICBpZiAoaXNSNjkpIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSgnaW5kZXgnLCBuZXdBdHRyaWIpXG4gICAgZWxzZSBnZW9tZXRyeS5pbmRleCA9IG5ld0F0dHJpYlxuICB9XG59XG5cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZSAoZ2VvbWV0cnksIGtleSwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGlmICh0eXBlb2YgaXRlbVNpemUgIT09ICdudW1iZXInKSBpdGVtU2l6ZSA9IDNcbiAgaWYgKHR5cGVvZiBkdHlwZSAhPT0gJ3N0cmluZycpIGR0eXBlID0gJ2Zsb2F0MzInXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmXG4gICAgQXJyYXkuaXNBcnJheShkYXRhWzBdKSAmJlxuICAgIGRhdGFbMF0ubGVuZ3RoICE9PSBpdGVtU2l6ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTmVzdGVkIHZlcnRleCBhcnJheSBoYXMgdW5leHBlY3RlZCBzaXplOyBleHBlY3RlZCAnICtcbiAgICAgIGl0ZW1TaXplICsgJyBidXQgZm91bmQgJyArIGRhdGFbMF0ubGVuZ3RoKVxuICB9XG5cbiAgdmFyIGF0dHJpYiA9IGdlb21ldHJ5LmdldEF0dHJpYnV0ZShrZXkpXG4gIHZhciBuZXdBdHRyaWIgPSB1cGRhdGVBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpXG4gIGlmIChuZXdBdHRyaWIpIHtcbiAgICBnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoa2V5LCBuZXdBdHRyaWIpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQXR0cmlidXRlIChhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBkYXRhID0gZGF0YSB8fCBbXVxuICBpZiAoIWF0dHJpYiB8fCByZWJ1aWxkQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUpKSB7XG4gICAgLy8gY3JlYXRlIGEgbmV3IGFycmF5IHdpdGggZGVzaXJlZCB0eXBlXG4gICAgZGF0YSA9IGZsYXR0ZW4oZGF0YSwgZHR5cGUpXG4gICAgaWYgKGF0dHJpYiAmJiAhd2FybmVkKSB7XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS53YXJuKFtcbiAgICAgICAgJ0EgV2ViR0wgYnVmZmVyIGlzIGJlaW5nIHVwZGF0ZWQgd2l0aCBhIG5ldyBzaXplIG9yIGl0ZW1TaXplLCAnLFxuICAgICAgICAnaG93ZXZlciBUaHJlZUpTIG9ubHkgc3VwcG9ydHMgZml4ZWQtc2l6ZSBidWZmZXJzLlxcblRoZSBvbGQgYnVmZmVyIG1heSAnLFxuICAgICAgICAnc3RpbGwgYmUga2VwdCBpbiBtZW1vcnkuXFxuJyxcbiAgICAgICAgJ1RvIGF2b2lkIG1lbW9yeSBsZWFrcywgaXQgaXMgcmVjb21tZW5kZWQgdGhhdCB5b3UgZGlzcG9zZSAnLFxuICAgICAgICAneW91ciBnZW9tZXRyaWVzIGFuZCBjcmVhdGUgbmV3IG9uZXMsIG9yIHN1cHBvcnQgdGhlIGZvbGxvd2luZyBQUiBpbiBUaHJlZUpTOlxcbicsXG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL3B1bGwvOTYzMSdcbiAgICAgIF0uam9pbignJykpO1xuICAgIH1cbiAgICBhdHRyaWIgPSBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKGRhdGEsIGl0ZW1TaXplKVxuICAgIGF0dHJpYi5uZWVkc1VwZGF0ZSA9IHRydWVcbiAgICByZXR1cm4gYXR0cmliXG4gIH0gZWxzZSB7XG4gICAgLy8gY29weSBkYXRhIGludG8gdGhlIGV4aXN0aW5nIGFycmF5XG4gICAgZmxhdHRlbihkYXRhLCBhdHRyaWIuYXJyYXkpXG4gICAgYXR0cmliLm5lZWRzVXBkYXRlID0gdHJ1ZVxuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuLy8gVGVzdCB3aGV0aGVyIHRoZSBhdHRyaWJ1dGUgbmVlZHMgdG8gYmUgcmUtY3JlYXRlZCxcbi8vIHJldHVybnMgZmFsc2UgaWYgd2UgY2FuIHJlLXVzZSBpdCBhcy1pcy5cbmZ1bmN0aW9uIHJlYnVpbGRBdHRyaWJ1dGUgKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUpIHtcbiAgaWYgKGF0dHJpYi5pdGVtU2l6ZSAhPT0gaXRlbVNpemUpIHJldHVybiB0cnVlXG4gIGlmICghYXR0cmliLmFycmF5KSByZXR1cm4gdHJ1ZVxuICB2YXIgYXR0cmliTGVuZ3RoID0gYXR0cmliLmFycmF5Lmxlbmd0aFxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBBcnJheS5pc0FycmF5KGRhdGFbMF0pKSB7XG4gICAgLy8gWyBbIHgsIHksIHogXSBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGggKiBpdGVtU2l6ZVxuICB9IGVsc2Uge1xuICAgIC8vIFsgeCwgeSwgeiBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGhcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cbiIsInZhciBuZXdsaW5lID0gL1xcbi9cbnZhciBuZXdsaW5lQ2hhciA9ICdcXG4nXG52YXIgd2hpdGVzcGFjZSA9IC9cXHMvXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XG4gICAgdmFyIGxpbmVzID0gbW9kdWxlLmV4cG9ydHMubGluZXModGV4dCwgb3B0KVxuICAgIHJldHVybiBsaW5lcy5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICByZXR1cm4gdGV4dC5zdWJzdHJpbmcobGluZS5zdGFydCwgbGluZS5lbmQpXG4gICAgfSkuam9pbignXFxuJylcbn1cblxubW9kdWxlLmV4cG9ydHMubGluZXMgPSBmdW5jdGlvbiB3b3Jkd3JhcCh0ZXh0LCBvcHQpIHtcbiAgICBvcHQgPSBvcHR8fHt9XG5cbiAgICAvL3plcm8gd2lkdGggcmVzdWx0cyBpbiBub3RoaW5nIHZpc2libGVcbiAgICBpZiAob3B0LndpZHRoID09PSAwICYmIG9wdC5tb2RlICE9PSAnbm93cmFwJykgXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgdGV4dCA9IHRleHR8fCcnXG4gICAgdmFyIHdpZHRoID0gdHlwZW9mIG9wdC53aWR0aCA9PT0gJ251bWJlcicgPyBvcHQud2lkdGggOiBOdW1iZXIuTUFYX1ZBTFVFXG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5tYXgoMCwgb3B0LnN0YXJ0fHwwKVxuICAgIHZhciBlbmQgPSB0eXBlb2Ygb3B0LmVuZCA9PT0gJ251bWJlcicgPyBvcHQuZW5kIDogdGV4dC5sZW5ndGhcbiAgICB2YXIgbW9kZSA9IG9wdC5tb2RlXG5cbiAgICB2YXIgbWVhc3VyZSA9IG9wdC5tZWFzdXJlIHx8IG1vbm9zcGFjZVxuICAgIGlmIChtb2RlID09PSAncHJlJylcbiAgICAgICAgcmV0dXJuIHByZShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aClcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBncmVlZHkobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgsIG1vZGUpXG59XG5cbmZ1bmN0aW9uIGlkeE9mKHRleHQsIGNociwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBpZHggPSB0ZXh0LmluZGV4T2YoY2hyLCBzdGFydClcbiAgICBpZiAoaWR4ID09PSAtMSB8fCBpZHggPiBlbmQpXG4gICAgICAgIHJldHVybiBlbmRcbiAgICByZXR1cm4gaWR4XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjaHIpIHtcbiAgICByZXR1cm4gd2hpdGVzcGFjZS50ZXN0KGNocilcbn1cblxuZnVuY3Rpb24gcHJlKG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGxpbmVzID0gW11cbiAgICB2YXIgbGluZVN0YXJ0ID0gc3RhcnRcbiAgICBmb3IgKHZhciBpPXN0YXJ0OyBpPGVuZCAmJiBpPHRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNociA9IHRleHQuY2hhckF0KGkpXG4gICAgICAgIHZhciBpc05ld2xpbmUgPSBuZXdsaW5lLnRlc3QoY2hyKVxuXG4gICAgICAgIC8vSWYgd2UndmUgcmVhY2hlZCBhIG5ld2xpbmUsIHRoZW4gc3RlcCBkb3duIGEgbGluZVxuICAgICAgICAvL09yIGlmIHdlJ3ZlIHJlYWNoZWQgdGhlIEVPRlxuICAgICAgICBpZiAoaXNOZXdsaW5lIHx8IGk9PT1lbmQtMSkge1xuICAgICAgICAgICAgdmFyIGxpbmVFbmQgPSBpc05ld2xpbmUgPyBpIDogaSsxXG4gICAgICAgICAgICB2YXIgbWVhc3VyZWQgPSBtZWFzdXJlKHRleHQsIGxpbmVTdGFydCwgbGluZUVuZCwgd2lkdGgpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKG1lYXN1cmVkKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsaW5lU3RhcnQgPSBpKzFcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGluZXNcbn1cblxuZnVuY3Rpb24gZ3JlZWR5KG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoLCBtb2RlKSB7XG4gICAgLy9BIGdyZWVkeSB3b3JkIHdyYXBwZXIgYmFzZWQgb24gTGliR0RYIGFsZ29yaXRobVxuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2xpYmdkeC9saWJnZHgvYmxvYi9tYXN0ZXIvZ2R4L3NyYy9jb20vYmFkbG9naWMvZ2R4L2dyYXBoaWNzL2cyZC9CaXRtYXBGb250Q2FjaGUuamF2YVxuICAgIHZhciBsaW5lcyA9IFtdXG5cbiAgICB2YXIgdGVzdFdpZHRoID0gd2lkdGhcbiAgICAvL2lmICdub3dyYXAnIGlzIHNwZWNpZmllZCwgd2Ugb25seSB3cmFwIG9uIG5ld2xpbmUgY2hhcnNcbiAgICBpZiAobW9kZSA9PT0gJ25vd3JhcCcpXG4gICAgICAgIHRlc3RXaWR0aCA9IE51bWJlci5NQVhfVkFMVUVcblxuICAgIHdoaWxlIChzdGFydCA8IGVuZCAmJiBzdGFydCA8IHRleHQubGVuZ3RoKSB7XG4gICAgICAgIC8vZ2V0IG5leHQgbmV3bGluZSBwb3NpdGlvblxuICAgICAgICB2YXIgbmV3TGluZSA9IGlkeE9mKHRleHQsIG5ld2xpbmVDaGFyLCBzdGFydCwgZW5kKVxuXG4gICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgc3RhcnQgb2YgbGluZVxuICAgICAgICB3aGlsZSAoc3RhcnQgPCBuZXdMaW5lKSB7XG4gICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZSggdGV4dC5jaGFyQXQoc3RhcnQpICkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIHN0YXJ0KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZGV0ZXJtaW5lIHZpc2libGUgIyBvZiBnbHlwaHMgZm9yIHRoZSBhdmFpbGFibGUgd2lkdGhcbiAgICAgICAgdmFyIG1lYXN1cmVkID0gbWVhc3VyZSh0ZXh0LCBzdGFydCwgbmV3TGluZSwgdGVzdFdpZHRoKVxuXG4gICAgICAgIHZhciBsaW5lRW5kID0gc3RhcnQgKyAobWVhc3VyZWQuZW5kLW1lYXN1cmVkLnN0YXJ0KVxuICAgICAgICB2YXIgbmV4dFN0YXJ0ID0gbGluZUVuZCArIG5ld2xpbmVDaGFyLmxlbmd0aFxuXG4gICAgICAgIC8vaWYgd2UgaGFkIHRvIGN1dCB0aGUgbGluZSBiZWZvcmUgdGhlIG5leHQgbmV3bGluZS4uLlxuICAgICAgICBpZiAobGluZUVuZCA8IG5ld0xpbmUpIHtcbiAgICAgICAgICAgIC8vZmluZCBjaGFyIHRvIGJyZWFrIG9uXG4gICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzV2hpdGVzcGFjZSh0ZXh0LmNoYXJBdChsaW5lRW5kKSkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgbGluZUVuZC0tXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGluZUVuZCA9PT0gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFN0YXJ0ID4gc3RhcnQgKyBuZXdsaW5lQ2hhci5sZW5ndGgpIG5leHRTdGFydC0tXG4gICAgICAgICAgICAgICAgbGluZUVuZCA9IG5leHRTdGFydCAvLyBJZiBubyBjaGFyYWN0ZXJzIHRvIGJyZWFrLCBzaG93IGFsbC5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dFN0YXJ0ID0gbGluZUVuZFxuICAgICAgICAgICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgZW5kIG9mIGxpbmVcbiAgICAgICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNXaGl0ZXNwYWNlKHRleHQuY2hhckF0KGxpbmVFbmQgLSBuZXdsaW5lQ2hhci5sZW5ndGgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGxpbmVFbmQtLVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobGluZUVuZCA+PSBzdGFydCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1lYXN1cmUodGV4dCwgc3RhcnQsIGxpbmVFbmQsIHRlc3RXaWR0aClcbiAgICAgICAgICAgIGxpbmVzLnB1c2gocmVzdWx0KVxuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ID0gbmV4dFN0YXJ0XG4gICAgfVxuICAgIHJldHVybiBsaW5lc1xufVxuXG4vL2RldGVybWluZXMgdGhlIHZpc2libGUgbnVtYmVyIG9mIGdseXBocyB3aXRoaW4gYSBnaXZlbiB3aWR0aFxuZnVuY3Rpb24gbW9ub3NwYWNlKHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGdseXBocyA9IE1hdGgubWluKHdpZHRoLCBlbmQtc3RhcnQpXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICBlbmQ6IHN0YXJ0K2dseXBoc1xuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIl19
